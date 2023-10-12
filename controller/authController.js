const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Auth, User } = require('../models');
const ApiError = require('../utils/ApiError');

const register = async (req, res, next) => {
  try {
    const [
      name,
      email,
      password,
      confirmPassword,
      age,
      address,
    ] = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (user) {
      next(
        new ApiError(
          'user email alredy taken',
          400
        )
      );
    }

    const passwordLength = password <= 8;
    if (passwordLength) {
      next(
        new ApiError(
          'Minimum password must be 8 character',
          400
        )
      );
    }

    if (password !== confirmPassword) {
      next(
        new ApiError(
          'Password does not match',
          400
        )
      );
    }
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(
      password,
      saltRounds
    );
    const hashedConfirmPassword = bcrypt.hashSync(
      password,
      saltRounds
    );

    const newUser = await User.create({
      name,
      address,
      age,
    });

    await Auth.create({
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      userId: newUser.id,
    });

    res.status(201).json({
      status: 'Success',
      data: {
        ...newUser,
        email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    });
    if (
      user &&
      bcrypt.compareSync(password, user.password)
    ) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.jwt_SECRET
      );
      res.status(200).json({
        status: 'Success',
        message: 'Berhasil login',
        data: user,
      });
    } else {
      next(
        new ApiError(
          'wrong pasword or user is not found',
          400
        )
      );
    }
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = register;
module.exports = login;
