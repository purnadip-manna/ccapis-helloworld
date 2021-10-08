const express = require('express');
const router = express.Router();
const needle = require('needle');
const gc = require('./getCoinID');


router.get('/:name', function (req, res, next) {
    var url = "https://api.coinpaprika.com/v1/coins";

    needle('get', url)
        .then(function (response) {

            for (i = 0; i < response.body.length; i++) {
                coin = response.body[i];

                if (coin.name == req.params.name) {
                    needle('get', `https://api.coinpaprika.com/v1/tickers/${coin.id}`)
                        .then(function (response) {
                            res.json({
                                "id": response.body.id,
                                "name": response.body.name,
                                "symbol": response.body.symbol,
                                "rank": response.body.rank,
                                "circulating_supply": response.body.circulating_supply,
                                "total_supply": response.body.total_supply,
                                "max_supply": response.body.max_supply,
                                "USD_price": response.body.quotes.USD.price
                            });
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
