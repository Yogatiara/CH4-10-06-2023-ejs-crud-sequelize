// karena menggunakan .env variable, jd lakuin import ini di awal aplikasi jalan
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const router = require('./routes');
const ApiError = require('./utils/ApiError');
const errorHandlre = require('./controller/errorController');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(router);
app.all('*', (req, res, next) => {
  next(
    new ApiError('Routes does not exist', 404)
  );
});

app.use(errorHandlre);
app.listen(PORT, () => {
  console.log(`Server jalan di port : ${PORT}`);
});
