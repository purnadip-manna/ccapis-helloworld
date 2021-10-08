var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var imageOfMonth = require('./routes/nasa/imageOfTheMonth');
var astronomyPic = require('./routes/nasa/astronomyPicture');
var astronomyVdo = require('./routes/nasa/astronomyVideos'); 
var polyChrom = require('./routes/nasa/polychromaticImaging');
var weatherCity = require('./routes/weather/weatherCity');
var weatherSearch = require('./routes/weather/weatherSearch');


var fetchbyUser=require('./routes/twitter/tweetsByUser');
var fetchByPlace=require('./routes/twitter/tweetsByPlace');
var fetchByTag=require('./routes/twitter/tweetByHashTag');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/nasa/image-of-month', imageOfMonth);
app.use('/nasa/images-of-month', astronomyPic);
app.use('/nasa/videos-of-month', astronomyVdo);
app.use('/nasa/earth-poly-image',polyChrom);

app.use('/weather/city/', weatherCity);
app.use('/weather/search', weatherSearch);

app.use('/twitter/',fetchbyUser);
app.use('/twitter/',fetchByPlace);
app.use('/twitter/',fetchByTag);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.statusCode=400;
  res.json({status:400,message: "Bad Request."});
});

module.exports = app;
