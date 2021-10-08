/* Task 3: Get Astronomy Videos for the given Month. */

var express = require('express');
var needle = require('needle');
const dotenv = require('dotenv');
const getMonthno = require('../../getMonthNo');
var router = express.Router();

dotenv.config();
const NASA_API = process.env.NASA_API_KEY;

router.get('/:year/:month', function(req, res, next) {
    const year = req.params.year;
    const month = req.params.month.toLowerCase();
    const monthNo = getMonthno[month];
    let nasaAPI = "https://api.nasa.gov/planetary/apod?start_date="+year+"-"+monthNo+"-1&end_date="+year+"-"+(monthNo+1)+"-1&api_key="+NASA_API;

    needle('get', nasaAPI)
    .then(function(resp) { 
        const stsCode = resp.body.code;
        const resDate = resp.body;
        const len = resDate.length-1;
        let links = [];
        for (let index = 0; index < len; index++) {
            if(resDate[index].media_type == "video")
                links.push(resDate[index].url);
        }
        if(stsCode == 400)
            res.status(400).json({
                "status": 400,
                "message": "Bad Request"
            });
        
        else if(links.length == 0)
            res.status(404).json({
                "status": 404,
                "message": "image/video not found"
            });

        else
            res.json(links);
    })
    .catch(function(err) {console.error(err)});
});

module.exports = router;
