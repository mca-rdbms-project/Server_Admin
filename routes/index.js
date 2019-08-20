var express = require('express');
var router = express.Router();
const db=require('../config/db');
const conn=db.db;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user-registration', function(req, res, next) {
  console.log("API called");
    if(req.body){
      //console.log(req.body);
     // console.log(req.body)
       var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)
        console.log(data)
        console.log(data.f_name)
        var insert="insert into Users values(null,'"+data.f_name+"','"+data.l_name+"','"+data.email+"','"+data.mno+"','"+data.city+"','"+data.id_photo+"','"+data.user_type+"','"+data.gender+"','"+data.password+"')";
        conn.query(insert, function(err, results) {
            if (err) throw err
            console.log(results)
            res.json({"status":true});

        })

    }
    else{
      console.log("no data found");
        res.json({"status":false})
    }

});
router.post('/user-login',function (req,res,next) {
    if(req.body){
        var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)
        var pass=data.password;
        var uname=data.user_name;
        console.log(pass+uname);

        var query="select * from Users where email='"+uname+"' && password='"+pass+"'";
        conn.query(query,function (err,result) {
            console.log(result)
            if(result.length>0){
                res.json({"status":true});
            }
           else {
                res.json({"status":false});
            }
        })
    }
})
router.get('/cities',function (req,res,next) {
    var cities="select * from Cities";
    conn.query(cities,function (err, data) {
        if (err) throw err

        data=Object.values(JSON.parse(JSON.stringify(data)))
        //data.status=true;
        //console.log(data);
        var cities={};
        cities.list=data;
        cities.status=true;
        console.log(cities);
        res.json(cities)

    })
})
router.post('/collegesByCity',function (req,res,next) {
    if(req.body){
        var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)



        var query="select * from Colleges where town='"+data.city_id+"'";
        conn.query(query,function (err,result) {
            console.log(result)
            if(result.length>0){
                res.json({"status":true});
            }
            else {
                res.json({"status":false});
            }
        })
    }
})
router.get('/colleges',function (req,res,next) {
    var cities="select * from Colleges";
    conn.query(cities,function (err, data) {
        if (err) throw err
        res.json(result)

    })
})


module.exports = router;
