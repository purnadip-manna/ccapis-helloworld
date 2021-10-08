const express = require('express');
const router = express.Router();
const needle = require('needle');

router.get('/:name', function (req, res, next) {
    var url = "https://api.coinpaprika.com/v1/coins";
    var founder = {
        id: "",
        name: "",
        links: []
    }
    var developer = {
        id: "",
        name: "",
        position: "",
    }
    var developers = []


    needle('get', url)
        .then(function (response) {

            for (i = 0; i < response.body.length; i++) {
                coin = response.body[i];

                if (coin.name == req.params.name) {
                    needle('get', `https://api.coinpaprika.com/v1/coins/${coin.id}`)
                        .then(function (response) {

                            for (i = 0; i < response.body.team.length; i++) {
                                if (response.body.team[i].position == "Founder") {
                                    founder.name = response.body.team[i].name;
                                    founder.id = response.body.team[i].id;

                                    needle('get', `https://api.coinpaprika.com/v1/people/${founder.id}`)
                                        .then(function (response) {
                                            founder.links = response.body.links;
                                        })
                                }
                                else {
                                    developer.name = response.body.team[i].name;
                                    developer.id = response.body.team[i].id;
                                    developer.position = response.body.team[i].position;

                                    // needle('get', `https://api.coinpaprika.com/v1/people/${developer.id}`)
                                    //     .then(function (response) {
                                    //     })
                                    console.log(developers)
                                    developers.push(developer);
                                }
                            }

                            res.json({
                                "name": response.body.name,
                                "symbol": response.body.symbol,
                                "rank": response.body.rank,
                                "type": response.body.type,
                                "founders": [{
                                    "name": founder.name,
                                    "links": founder.links
                                }],
                                "developers": developers
                            })
                        })
                        .catch(function (error) {
                            res.json({
                                "status": 404,
                                "message": "coin/token not found"
                            });
                        });
                    break;
                }
            }

        });
});

module.exports = router;