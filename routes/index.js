var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user-registration', function(req, res, next) {
  console.log("API called");
    if(req.body){
      console.log(req.body.fname);
        res.json({"status":true});
    }
    else{
      console.log("no data found");
        res.json({"status":false})
    }

});

module.exports = router;
