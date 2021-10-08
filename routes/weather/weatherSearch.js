var express = require('express');
var needle = require('needle');
var router = express.Router();

router.get('/', function(req, res, next) {
    let weatherAPI = "";
    if(req.query.pin_code){
        const pinCode = req.query.pin_code;
        weatherAPI = "api.openweathermap.org/data/2.5/weather?zip="+pinCode+",in&appid=fd369556a5351344de1d2cf51f4bfb47";
    }
    else{
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        weatherAPI = "api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=fd369556a5351344de1d2cf51f4bfb47";
    }

    needle('get', weatherAPI)
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
