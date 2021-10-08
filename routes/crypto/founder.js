/* Task 4: Get Coin Founder & Team Members */

const express = require('express');
const router = express.Router();
const needle = require('needle');

router.get('/:name', function (req, res, next) {
    var url = "https://api.coinpaprika.com/v1/coins";   
    var founders = [];
    let coinId = "";
    needle('get', url)
        .then(function (response) {

            for (i = 0; i < response.body.length; i++) {
                coin = response.body[i];

                if (coin.name == req.params.name) {
                    coinId = coin.id;
                    needle('get', `https://api.coinpaprika.com/v1/coins/${coin.id}`)
                        .then(function (response) {
                            let developers = [];
                            for (i = 0; i < response.body.team.length; i++) {
                                if (response.body.team[i].position == "Founder") {

                                    let founderName = response.body.team[i].name;
                                    let founderId = response.body.team[i].id;
                                    let founderLinks = "";

                                    needle('get', `https://api.coinpaprika.com/v1/people/${founderId}`)
                                        .then(function (response) {
                                            if(response.body.links.additional.url)
                                                founderLinks = response.body.links.additional.url;
                                        })

                                    founders.push({
                                        "name": founderName,
                                        "links": founderLinks
                                    });
                                }
                                else if (response.body.team[i].position.indexOf("Developer") != -1){
                                    let developerName = response.body.team[i].name;
                                    let developerId = response.body.team[i].id;
                                    let developerPosition = response.body.team[i].position;
                                    needle('get', `https://api.coinpaprika.com/v1/people/${developerId}`)
                                    .then(function (response) {
                                        new Promise((resolve, reject) => {
                                            let githubLink = "";
                                            let twitterLink = "";
                                            let linkedInLink = "";
                                            if(response.body.links.github){
                                                githubLinkArr = response.body.links.github;
                                                if(githubLinkArr.length != 0)
                                                    githubLink = githubLinkArr[0].url;
                                            }
                                            if(response.body.links.twitter){
                                                twitterLinkArr = response.body.links.twitter;
                                                if(twitterLinkArr.length != 0)
                                                    twitterLink = twitterLinkArr[0].url;
                                            }
    
                                            if(response.body.links.linkedin){
                                                linkedInLinkArr = response.body.links.linkedin;
                                                if(linkedInLinkArr.length != 0)
                                                    linkedInLink = linkedInLinkArr[0].url;
                                            }
                                            resolve(githubLink, twitterLink, linkedInLink);
                                        }).then((githubLink, twitterLink, linkedInLink) => {
                                            if(!githubLink) githubLink = "";
                                            if(!twitterLink) twitterLink = "";
                                            if(!linkedInLink) linkedInLink = "";

                                            console.log({
                                                "name": developerName,
                                                "position": developerPosition,
                                                "github": githubLink,
                                                "linkedIn": linkedInLink,
                                                "twitter": twitterLink
                                            });
                                            developers.push({
                                                "name": developerName,
                                                "position": developerPosition,
                                                "github": githubLink,
                                                "linkedIn": linkedInLink,
                                                "twitter": twitterLink
                                            });
                                        });
                                    });
                                }
                            }

                            res.json({
                                "id": coinId,
                                "name": response.body.name,
                                "symbol": response.body.symbol,
                                "type": response.body.type,
                                "founders": founders,
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