var express = require('express');
var router = express.Router();
const db=require('../config/db');
const conn=db.db;
var distance = require('google-distance');
distance.apiKey="AIzaSyBSjMmeNnPp00VQhtalS1czrRCYf2ATYLg"

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

        var insert="insert into Users values(null,'"+data.f_name+"','"+data.l_name+"','"+data.email+"','"+data.mno+"','"+data.city+"','"+data.college+"','"+data.user_type+"','"+data.gender+"','"+data.password+"',null)";
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

        /*var time=data.hour+":"+data.min;*/
        var date=new Date(data.date);
        console.log(data);
        var v_details=data.v_model+" "+data.v_color+" "+data.v_no;
        var rule=data.rule1;
        var user=data.user;
        console.log("user:"+user)
        user=user.substring(2);
        user=user.substring(0,user.length-1);

        console.log("user:"+user)
        var query="INSERT INTO Trips VALUES (null,'"+data.date+"','"+data.time+"','"+data.vehicle+"',"+data.seats+",'"+v_details+"','"+rule+"','"+data.origin+"','"+data.destination+"','upcoming','"+user+"');"

        conn.query(query,function (err,result) {
            if(err){
                console.log(err)
                throw err
            }
            else {
                console.log(result);
                res.json({"status": true});
            }

        })
    }
})
var gtrips={};
router.post("/find-trip",function (req,res) {
    if(req.body){
        var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)
        console.log("find-trip values :"+data);
        var query="select t.trip_id,t.time,t.v_details,t.rules,u.first_name,u.mobile,t.origin from Trips t,Users u where t.user=u.user_id && t.seats<=data.seats";
        var obj={}
        var tripArr=[];
        conn.query(query,function (err,trips) {
            if(err){
                console.log(err)
                throw err
            }
            else {
                trips=Object.values(JSON.parse(JSON.stringify(trips)))


                if (trips.length > 0) {
                    trips.forEach(function (item) {

                        if (findDistance(item.origin, data.f_location) < 10 && data.date == trips.date && findDistance(item.destination, data.to_location)) {

                            item.distance = findDistance(item.origin, data.f_location)
                            tripArr.push(item);
                        }

                    })
                    gtrips.data=null;
                    gtrips.data = trips;
                    //console.log(obj);
                    gtrips.status=true;

                    res.json({"status": true});
                }
                else {
                    res.json({"status": true, "Result": "Empty"});
                }
            }
        })

    }
    console.log(req.body);
   /* var data={"data":[{
        "name":"sonu",
            "city":"Bangalore"

    }],"status":true}
    res.json(data);*/
})
router.post("/request-trip",function (req,res) {
    if(req.body) {

        var data = new Object(req.body);
        data = JSON.stringify(data)

        data = JSON.parse(data)
        console.log(data);
        var trip_id=data.trip_id;
        var user=data.user_id;
        trip_id=trip_id.substring(8);

        user=user.substring(2);
        user=user.substring(0,user.length-1);



        //var query="select trip_id from Trips where user='"+data.user_id+"' && status='upcoming' ";
        var query="insert into Requests values(null,'"+trip_id+"','"+user+"',null)";
        conn.query(query,function (err,id) {


            conn.query(query,function (err,result) {
                if(!err){
                    res.json({"status":true})
                }
                else
                {
                    console.log(err);
                    res.json({"status":false});
                }

            })

        })


    }

})
var driver;
router.post("/find-requests",function (req,res,next) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)
        console.log(data);
        driver=data.user_id;
        console.log(driver);
        driver=driver.substring(2);
        driver=driver.substring(0,driver.length-1);

        res.json({"status":true})

    }
})
router.get("/view-requests",function (req,res) {

    var query="select u.first_name,u.mobile,u.college from Users u,Trips t,Requests r where t.user='"+driver+"' && r.trip_id=t.trip_id && u.user_id=r.user_id"
    conn.query(query,function (err,data) {
        if(!err){
            console.log(data);
            var obj={};
            obj.data=data;
            obj.status=true;
            console.log(obj);
            res.json(obj);
        }
        else{
            console.log(err);
            res.json({status:false});

        }
    })
})
router.post("/ride-request",function (req,res) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)

        console.log(data);

        res.json({"status":true})

    }

})


function findDistance(loc1,loc2){
    console.log(loc1)
    console.log(loc2)
    distance.get(
        {
            origin: loc1,
            destination:loc2
        },
        function(err, data) {
            if (err) return console.log(err);
            //console.log(data);
           // console.log(data.distance);
            var dist=data.distance.slice(2,-1)
            //console.log(dist)
            console.log(dist)
            dist=parseInt(dist);

            console.log(dist)
            return dist;
        });
}
router.get("/list-view-rider",function (req,res) {

    /*var data={"data":[{
            "name":"sonu",
            "city":"Bangalore"

        }],"status":true}*/
    console.log(gtrips)
    res.json(gtrips);

})

module.exports = router;
