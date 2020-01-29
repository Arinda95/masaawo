var express = require('express');
var router = express.Router();

//Access home page at root index
router.get('/', function(req, res, next){
    res.render('index', {title: "M A S A A W O"});
});

module.exports = router;