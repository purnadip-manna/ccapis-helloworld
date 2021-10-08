/* Task 1: Get First Image/Video of the Month */


var express = require('express');
var needle = require('needle');
const dotenv = require('dotenv');
var router = express.Router();


dotenv.config();
const NASA_API = process.env.NASA_API_KEY;

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

/* Task-1:  GET image of the month. */
router.get('/', function(req, res, next) {
  // Generate the url
  let date =  currentYear + "-" + currentMonth + "-" + "01";
  url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API}`;

  // Fetch data with needle
  needle('get', url)

  .then( function(response) {
    if (response.body.length == 0) {
      res.json({
        "status": 404,
        "message": "image/video not found"
      });      
    }
    else if (response.body.code == 400) {
      res.json({
        "status": 400,
        "message": "Bad Request"
      });  
    }
    else {
      res.json({
        "date": response.body.date,
        "media_type": response.body.media_type,
        "title": response.body.title,
        "url": response.body.url
      });
    }
  })
});

module.exports = router;
