const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../../utils/jwt");
const User = require("./auth.model");

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.password;
  delete user.refreshTokens;
  return user;
};

exports.registerUser = async (data) => {
  const { userName, email, password, name } = data || {};

  if (!userName || !email || !password || !name) {
    throw new Error("Name, username, email and password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }]
  }).lean();

  if (existingUser) {
    if (existingUser.userName === userName) {
      throw new Error("User name already exists");
    }

    if (existingUser.email === email) {
      throw new Error("Email already exists");
    }
  }

  const user = await User.create(data);
  return sanitizeUser(user);
};

exports.loginUser = async (data) => {
  const { email, password } = data || {};

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  const userId = user._id;
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  user.refreshTokens.push({ token: refreshToken });

  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
};

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const hasRefreshToken = user.refreshTokens.some((tokenObj) => tokenObj.token === refreshToken);

  if (!hasRefreshToken) {
    throw new Error("Refresh token revoked");
  }

  user.refreshTokens = user.refreshTokens.filter((tokenObj) => tokenObj.token !== refreshToken);

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

exports.logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const user = await User.findOne({
    "refreshTokens.token": refreshToken
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  user.refreshTokens = user.refreshTokens.filter((tokenObj) => tokenObj.token !== refreshToken);

  await user.save();

  return { message: "Logout successful" };
};
