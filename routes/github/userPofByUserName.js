/**Task 1: Get User Profile by Username */

var express = require('express');
var router = express.Router();
var needle=require('needle');

const dotenv = require("dotenv");


dotenv.config();

router.get('/user/:username', function (req, res, next) {
    url = `https://api.github.com/users/${req.params.username}`;
    repo_count = 0
    followers = []
    following = []
  
    needle('get', `https://api.github.com/users/${req.params.username}/repos`,{
        headers:{
            Authorization:process.env.gitHub_Token
        }
    })
      .then(function (response) {
        repo_count = response.body.length;
      })
      .catch(function (error) {
        res.json({
          "status": 404,
          "message": "resource not found"
        });
      })
  
    needle('get', `https://api.github.com/users/${req.params.username}/followers`,{
        headers:{
            Authorization:process.env.gitHub_Token
        }
    })
      .then(function (response) {
        for (i = 0; i < response.body.length; i++) {
          followers.push(response.body[i].login);
        }
      })
      .catch(function (error) {
        res.json({
          "status": 404,
          "message": "resource not found"
        });
      });
  
    needle('get', `https://api.github.com/users/${req.params.username}/following`,{
        headers:{
            Authorization:process.env.gitHub_Token
        }
    })
      .then(function (response) {
        for (i = 0; i < response.body.length; i++) {
          following.push(response.body[i].login);
        }
      })
      .catch(function (error) {
        res.json({
          "status": 404,
          "message": "resource not found"
        });
      });
  
    needle('get', url)
      .then(function (response) {
        res.json({
          "name": response.body.name,
          "avatar_url": response.body.avatar_url,
          "public_repos": repo_count,
          "followers": followers,
          "following": following,
          "url": response.body.url,
          "bio": response.body.bio
        });
      })
      .catch(function (error) {
        res.json({
          "status": 404,
          "message": "resource not found"
        });
      });
  });
module.exports = router;
