var express = require('express');
var needle = require('needle');
var router = express.Router();


router.get('/:city_name', function(req, res, next) {
    const cityName = req.params.city_name;
    let weatherAPI = "api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid=fd369556a5351344de1d2cf51f4bfb47";

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
                "temp": parseFloat((resp.body.main.temp-273.15).toFixed(2))
            });
    })
    .catch(function(err) {console.error(err)});
});

module.exports = router;
