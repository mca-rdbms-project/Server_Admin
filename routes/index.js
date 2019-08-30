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
var user_id;
router.post('/user-login',function (req,res,next) {
    if(req.body){
        var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)
        var pass=data.password;
        var uname=data.user_name;


        var query="select * from Users where mobile='"+uname+"' && password='"+pass+"'";
        conn.query(query,function (err,result) {

            if(result.length>0){
                var data ={};

                data.status=true;
                data.user_id=result[0].user_id;
                user_id=result[0].user_id;
                console.log(user_id)
                res.json(data);
            }
           else {
                res.json({"status":false});
            }
        })
    }
})
router.get('/cities',function (req,res,next) {
    console.log("Cities API called");
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
router.get("/get-user-id",function (req,res) {
    var data={};
    data.user_id=user_id;

    console.log(data);
    res.json(data);
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
        data=Object.values(JSON.parse(JSON.stringify(data)))
        //data.status=true;
        //console.log(data);
        var colleges={};
        colleges.list1=data;
        colleges.status=true;
        console.log(colleges);
        res.json(colleges)

    })
})
router.post("/do-offer-trip",function (req,res,next) {
    if(req.body){
        console.log(req.body);

        var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)

        var time=data.hour+":"+data.min;
        var date=new Date(data.date);


        query="INSERT INTO Trips VALUES (null,'"+data.date+"','"+time+"','"+data.vehicle+"',"+data.seats+",'"+data.v_details+"','"+data.rules+"','"+data.origin+"','"+data.destination+"','upcoming',   "+data.user+");"

        conn.query(query,function (err,result) {
            if(err){
                console.log(err)
                throw err
            }
            console.log(result);
            res.json({"status":true});

        })


    }
})
router.post("/find-trip",function (req,res) {
    console.log(req.body);
    var data={"data":[{
        "name":"sonu",
            "city":"Bangalore"

    }],"status":true}
    res.json(data);
})
router.get("/list-view-rider",function (req,res) {

    var data={"data":[{
            "name":"sonu",
            "city":"Bangalore"

        }],"status":true}
    res.json(data);
})

module.exports = router;
