const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: result
  });
});

exports.signUp = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User created",
    data: user
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: tokens
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  await authService.logoutUser(refreshToken);

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});
