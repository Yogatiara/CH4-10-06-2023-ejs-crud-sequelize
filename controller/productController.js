const { Product } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../utils/ApiError');
const upload = require('../middlewares/uploader');

const createProduct = async (req, res, next) => {
  const { name, price, stock } = req.body;
  const file = req.file;
  let img;

  console.log(file);

  try {
    if (file) {
      // dapatkan extension file nya
      const split = file.originalname.split('.');
      const extension = split[split.length - 1];

      // upload file ke imagekit
      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      img = uploadedImage.url;
    }

    // IMG-10062023.jpeg

    const newProduct = await Product.create({
      name,
      price,
      stock,
      imageUrl: img.url,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        newProduct,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      status: 'Success',
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

const findProductById = async (
  req,
  res,
  next
) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: 'Success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const UpdateProduct = async (req, res, next) => {
  const { name, price, stock } = req.body;
  try {
    const product = await Product.update(
      {
        name,
        price,
        stock,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: 'Success',
      message: 'sukses update produk',
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteProduct = async (req, res, next) => {
  const { name, price, stock } = req.body;
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: 'Success',
      message: 'sukses delete produk',
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createProduct,
  findProducts,
  findProductById,
  UpdateProduct,
  deleteProduct,
};
