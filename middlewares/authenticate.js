const jwt = require('jsonwebtoken');
const { User, Auth } = require('../models');
const ApiError = require('../utils/ApiError');

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      next(
        new ApiError('Token is not found', 401)
      );
    }

    const token = bearerToken.split('Bearer')[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findByPk();
  } catch (err) {}
};
