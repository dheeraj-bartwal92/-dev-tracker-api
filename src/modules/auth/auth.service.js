const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt");
const User = require("./auth.model");


exports.registerUser = async (data) => {
    const {userName, email} = data || {}
    
    if (!userName || ! email) {
        throw new Error("Username and email are required");
    }

    const existingUser = await User.findOne({
        $or: [{userName}, {email}]
    }).lean();

    if (existingUser) {
        if(existingUser.userName == userName) {
            throw new Error("User name already exists");
        }

        if(existingUser.email == email) {
            throw new Error("Email already exists");
        }
    }

    const user = await User.create(data);

    return user
}

exports.loginUser = async (data) => {
    const { email, password } = data || {}
    
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
    }

    const userId = user._id
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)
    user.refreshTokens.push({token: refreshToken});

    await user.save();
    user.refreshTokens = undefined
    user.password = undefined

    return {
        user,
        accessToken,
        refreshToken
    }
}

exports.logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token required")
    }

    const user = await User.findOne({
        "refreshTokens.token": refreshToken
    })

    if(!user) {
        throw new Error("Invalid refresh token")
    }

    user.refreshTokens = user.refreshTokens.filter(
    (tokenObj) => tokenObj.token !== refreshToken
  );

  await user.save();

  return { message: "Logout successful" };
}