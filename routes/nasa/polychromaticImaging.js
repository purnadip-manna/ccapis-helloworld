var express = require('express');
var router = express.Router();
var needle=require('needle');

/* Task 4: Get Earth Polychromatic Imaging Camera data. */

router.get('/:date', function(req, res, next) {
    const date = req.params.date;
    const filterResult=[]
    const pcImg="https://api.nasa.gov/EPIC/api/natural/date/"+date+"?api_key=8kvcLXpBlinXXiCYJNyP7e2ASyoh2MKIhHmmDOrw"
    needle('get', pcImg)
    .then(function(resp) { 
        const result=resp.body;
        if(result.length==0){
            res.statusCode=404;
            res.send({"status": 404,
                "message": "image/video not found"});
        }
        for(var i=0;i<result.length;i++){
            var latitude=resp.body[i].centroid_coordinates.lat;
            var longitude=resp.body[i].centroid_coordinates.lon;
            if(latitude<=40 && latitude>=10 && longitude>=120 && longitude<=160){
                var obj={
                    identifier:resp.body[i].identifier,
                    caption:resp.body[i].caption,
                    image:resp.body[i].image,
                    date:resp.body[i].date,
                    latitude:latitude,
                    longitude:longitude
                }
                filterResult.push(obj);
            }
        }
        res.statusCode=200;
        res.setHeader("Content-Type","application/json"); 
        res.send(filterResult);
        res.send(resp.body.code);
    })
    .catch(function(err) {
        res.statusCode=400;
        res.send({"status": 400,
        "message": "Bad Request."});
        next(err);
    });
});


module.exports=router;