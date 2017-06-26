var express = require('express'),
    jwt = require('express-jwt');

var APIRouter = express.Router();

APIRouter.use('/public', function(req, res, next) {
  res.send('public');
  next();
});
APIRouter.use('/private', jwt({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  res.send('private');
  next();
});

module.exports = APIRouter;
