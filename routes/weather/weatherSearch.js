/* Task 2 : Search for Weather by latitude or longitude / PinCode */

var express = require('express');
var needle = require('needle');
const dotenv = require('dotenv');
var router = express.Router();

dotenv.config();
const WEATHER_API = process.env.WEATHER_API_KEY;

router.get('/', function(req, res, next) {
    let weatherAPI_url = "";
    if(req.query.pin_code){
        const pinCode = req.query.pin_code;
        weatherAPI_url = "api.openweathermap.org/data/2.5/weather?zip="+pinCode+",in&appid="+WEATHER_API;
    }
    else{
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        weatherAPI_url = "api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+WEATHER_API;
    }

    needle('get', weatherAPI_url)
    .then(function(resp) {
        const stsCode = resp.body.cod;
        if(stsCode == 400)
            res.status(400).json({
                "status": 400,
                "message": "Bad Request"
            });
        
        else if(stsCode == 404)
            res.status(404).json({
                "status": 404,
                "message": "weather data not found"
            });
            
        else
            res.json({
                "country": resp.body.sys.country,
                "name": resp.body.name,
                "temp": parseFloat((resp.body.main.temp-273.15).toFixed(2)),
                "min_temp": parseFloat((resp.body.main.temp_min-273.15).toFixed(2)),
                "max_temp": parseFloat((resp.body.main.temp_max-273.15).toFixed(2)),
                "latitude": resp.body.coord.lat,
                "longitude": resp.body.coord.lon
            });
    })
    .catch(function(err) {console.error(err)});
});

module.exports = router;
