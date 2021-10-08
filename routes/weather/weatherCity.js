/* Task 1 : Get Weather by City */

var express = require('express');
var needle = require('needle');
const dotenv = require('dotenv');
var router = express.Router();

dotenv.config();
const WEATHER_API = process.env.WEATHER_API_KEY;

router.get('/:city_name', function(req, res, next) {
    const cityName = req.params.city_name;
    let weatherAPI_url = "api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+WEATHER_API;

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
                "temp": parseFloat((resp.body.main.temp-273.15).toFixed(2))
            });
    })
    .catch(function(err) {console.error(err)});
});

module.exports = router;
