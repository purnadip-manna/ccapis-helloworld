/* Task 2: Get All Tokens */

const express = require('express');
const router = express.Router();
const needle = require('needle');


router.get('/', function (req, res, next) {
    let all_coins = [];
    url = "https://api.coinpaprika.com/v1/coins"

    needle('get', url)
        .then(function (response) {
            response.body.forEach(coin => {
                if (coin.type == "token") {
                    all_coins.push({
                        "id": coin.id,
                        "name": coin.name,
                        "symbol": coin.symbol,
                        "type": coin.type
                    })
                };
            });
            res.send(all_coins);
        })
        .catch(function (error) {
            res.json({
                "status": 404,
                "message": "coin/token not found"
            })
        });
})

module.exports = router;
