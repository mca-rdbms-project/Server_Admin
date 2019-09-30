var express = require('express');
var router = express.Router();
var msg91 = require("msg91")("150002A5XhiVcr75d909049", "TRPOOL", "4" );
var msg91=require('msg91-sms');
var authkey='150002A5XhiVcr75d909049';
var random=require('random-number');
var four = {
    min:  1000
    , max:  9999
    , integer: true
}
const db=require('../config/db');
const conn=db.db;


var distance = require('google-distance');
distance.apiKey="AIzaSyBSjMmeNnPp00VQhtalS1czrRCYf2ATYLg"
router.get("/otp",function (req,res) {
   /* var msg = "A new passenger has requested to join with your trip. Please login in TRIP POOL App tor view details";
    msg91.send("7736409656", msg, function (err, response) {
        if (err) {
            console.log("msgerr:"+err);
            res.json({"status": false});
        }
        else {
            console.log("msg91: "+response)
            res.json({"status": true});
        }
    });*/
    var number='7736409656';
    var msg="testing";
    var senderid="TRPOOL";
    var route='4';
    var dialcode='91';
    msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

        console.log(response);
        res.json({"status": true});
    });
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var reg_details={};
router.post('/user-registration', function(req, res, next) {
  console.log("API called");
    if(req.body){

      //console.log(req.body);
     // console.log(req.body)
       var data=new Object(req.body);
        data=JSON.stringify(data)
        data=JSON.parse(data)

        console.log(data)
        var query="select * from Users where mobile='"+data.mno+"'"
        conn.query(query,function (err,result) {
            if(!err){
                if(result.length>0){
                    res.json({"status":false,"message":"Mobile number already registered"})
                }
                else{
                    reg_details.data=data;
                    var otp = random(four);

                    reg_details.otp=otp;
                    var mob=data.mno;
                    var msg = "OTP From TRIP POOL is "+otp+"";
                    var number=mob;

                    var senderid="TRPOOL";
                    var route='4';
                    var dialcode='91';
                    msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

                        console.log(response);
                        res.json({"status": true});
                    });
                }
            }
        })




    }
    else{
      console.log("no data found");
        res.json({"status":false})
    }

});
router.post("/check-otp",function (req,res) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)
        console.log(data);

        if(data.mobile==reg_details.data.mno && reg_details.otp==data.otp){
            var data=reg_details.data;
            var insert="insert into Users values(null,'"+data.f_name+"','"+data.l_name+"','"+data.email+"','"+data.mno+"','"+data.city+"','"+data.college+"','"+data.user_type+"','"+data.gender+"','"+data.password+"',null)";
       conn.query(insert, function(err, results) {
           if (err) throw err
           console.log(results)
           var mob=data.mobile;
           var msg = "Greetings from TRIP POOL \n\nWe are happy to have you as a member of our community, feel free to explore our ";
           var number=mob;

           var senderid="TRPOOL";
           var route='4';
           var dialcode='91';
           msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

               console.log(response);
               res.json({"status": true});
           });
           //res.json({"status":true});

       })
        }
        else{
            res.json({"status":false});
        }
    }
})
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
        var query="INSERT INTO Trips VALUES (null,'"+data.date+"','"+data.time+"','"+data.vehicle+"',"+data.seats+",'"+v_details+"','"+rule+"','"+data.origin+"','"+data.destination+"','upcoming','"+user+"',"+data.amount+");"

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
        var query="select t.trip_id,t.time,t.date,t.v_details,t.rules,u.first_name,u.mobile,t.origin,t.destination,t.amount from Trips t,Users u where t.user=u.user_id";
        var obj={}
        var tripArr=[];
        conn.query(query,function (err,trips) {
            if(err){
                console.log(err)
                throw err
            }
            else {
                trips=Object.values(JSON.parse(JSON.stringify(trips)))

                //Promise.all([findDistance(item.origin, data.f_location), findDistance(item.destination, data.to_location)])
                if (trips.length > 0) {
                    var list=[];
                    var counter=trips.length;
                   // trips.forEach(function (item)
                    trips.forEach(function (item) {
                        var oDist;
                        var dDist;
                        item.date=item.date.slice(0,-14)
                        item.time=item.date+" "+item.time;
                        distance.get(
                            {
                                origin: item.origin,
                                destination:data.f_location
                            },
                            function(err, result) {
                                if (err) return console.log(err);
                                console.log(result.distanceValue);
                                oDist=result.distanceValue;

                                distance.get(
                                    {
                                        origin: item.destination,
                                        destination: data.to_location
                                    },
                                    function(err, result) {
                                        if (err) return console.log(err);
                                        console.log(result.distanceValue);
                                        dDist=result.distanceValue;

                                        if(oDist<=10 && dDist<=10){
                                            list.push(item);
                                        }
                                        counter--;
                                        if(counter==0){
                                            sendData(list);
                                        }
                                    });
                            });


                        /*getList();
                        async function getList () {


                        var oDist=await findDistance(item.origin, data.f_location);
                        var dDist=await findDistance(item.destination, data.to_location)
                        console.log("oDist:"+oDist)
                        console.log("dDist:"+dDist)
                        if(oDist<=10 && dDist<=10){
                            list.push(item);
                        }
                        counter--;
                        if(counter==0){
                            sendData(list);
                        }
                        }*/


                    })
                    function sendData(list){

                       // gtrips.data = trips;
                        gtrips.data = list;
                        //console.log(obj);
                        gtrips.status=true;
                        console.log(gtrips);
                        res.json({"status":true});
                    }



                }
                else {
                    gtrips.data=[];
                    gtrips.status=true;
                    res.json(gtrips);
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
router.get("/list-view-rider",function (req,res) {
    setTimeout(() => {
        console.log(gtrips);
        res.json(gtrips);
        gtrips.data=[];
        gtrips.status=true;
    }, 2000)


})
router.post("/request-trip",function (req,res) {
    if(req.body) {

        var data = new Object(req.body);
        data = JSON.stringify(data)

        data = JSON.parse(data)
        console.log(data);
        var trip_id=data.trip_id;
        var user=data.user_id;
        trip_id=trip_id.substring(9);
        console.log("trip_id:"+trip_id)
        user=user.substring(2);
        user=user.substring(0,user.length-1);



        //var query="select trip_id from Trips where user='"+data.user_id+"' && status='upcoming' ";
        var check="select * from Requests where trip_id='"+trip_id+"' && user_id='"+user+"' && status='pending'";

        conn.query(check,function (err,data) {
            if(!err) {
                console.log("fetch data:"+data);
                if (data.length == 0) {
                    var query = "insert into Requests values(null,'"+trip_id+"','"+user+"',2,'pending')";
                    conn.query(query, function (err, id) {

                        if(!err){

                                var query = "select u.mobile from Users u,Trips t where t.trip_id='"+trip_id+"' && u.user_id=t.user";
                                conn.query(query, function (err, result) {
                                    if (!err) {
                                        console.log(result)
                                        var mob = result[0].mobile;
                                        console.log("mobile :" + mob)
                                        var msg = "A new passenger has requested to join with your trip. Please login in TRIP POOL App tor view details";
                                        var number = mob;

                                        var senderid = "TRPOOL";
                                        var route = '4';
                                        var dialcode = '91';
                                        msg91.sendOne(authkey, number, msg, senderid, route, dialcode, function (response) {

                                            console.log(response);
                                            res.json({"status": true});
                                        });
                                    }
                                    else {
                                        console.log(err)
                                    }

                                })


                            }
                            else {
                                console.log(err);
                                res.json({"status": false});
                            }

                        })

                }
                else {
                    console.log("Result:"+data);
                    res.json({"status": false});
                }
            }
            else{
                console.log(err);
            }
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

    var query="select u.first_name,u.mobile,u.college,r.req_id,r.seats from Users u,Trips t,Requests r where t.user='"+driver+"' && r.trip_id=t.trip_id && u.user_id=r.user_id && r.status='pending'";
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


router.post("/accept-request",function (req,res) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)
        var req_id=data.request_id;
        req_id=req_id.substring(12);
        var query="update Requests set status='accepted' where req_id='"+req_id+"'";
        conn.query(query,function (err,result) {
            if(!err){
                query="select u.mobile,t.origin,t.destination,t.v_details,t.date,t.time,t.amount from Users u,Requests r,Trips t where r.req_id='"+req_id+"' u.user_id=r.user_id && t.trip_id=r.trip_id && t.user=u.user_id"
                conn.query(query,function (err,result) {
                    if(!err){

                        var details=result[0];
                        console.log(result)
                        /*var driverMob=result[1]
                        console.log("driver:"+driverMob);
                        console.log(details);*/
                        var mob=result[0].mobile;
                        var msg = "Your request for the trip from "+details.origin+" to"+details.destination+" has accepted by driver.\nTime : "+details.date+" "+details.time+"\nVehicle :"+details.v_details+"\nAmount : "+details.amount+"\nDriver Contact :"+driverMob.mobile+"\n\nThank you..";
                        var number=mob;

                        var senderid="TRPOOL";
                        var route='4';
                        var dialcode='91';
                        msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

                            console.log(response);
                            res.json({"status": true});
                        });
                    }
                    else {
                        console.log(err)
                        res.json({"status":true});
                    }
                })

            }
            else{
                console.log(err);
                res.json({"status":true});
            }
        })



    }
})
router.post("/reject-request",function (req,res) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)
        console.log(data);
        var req_id=data.request_id;
        req_id=req_id.substring(12);
        console.log(req_id);
        var query="update Requests set status='rejected' where req_id='"+req_id+"'";
        conn.query(query,function (err,result) {
            if(!err){
                query="select u.mobile,t.origin,t.destination from Users u,Requests r,Trips t where u.user_id=r.user_id && t.trip_id=r.trip_id"
                conn.query(query,function (err,result) {
                    if(!err){

                        var details=result[0];
                        console.log(details);
                        var mob=result[0].mobile;
                        var msg = "Your request for the trip from "+details.origin+" to"+details.destination+" has rejected by driver. Search other trips .\n\nThank you..";
                        var number=mob;

                        var senderid="TRPOOL";
                        var route='4';
                        var dialcode='91';
                        msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

                            console.log(response);
                            res.json({"status": true});
                        });
                    }
                    else {
                        console.log(err)
                        res.json({"status":true});
                    }
                })

            }
            else{
                console.log(err)
                res.json({"status":true});
            }
        })

    }
})
router.get("/contact",function (req,res) {
    res.render("contact",{layout:false})
})

router.post("/get-rider-trips",function (req,res) {
    if(req.body) {
        var data = new Object(req.body);
        data = JSON.stringify(data)
        data = JSON.parse(data)
        console.log(data);
        var req_id=data.user_id;
        //req_id=req_id.substring(12);
        console.log(req_id);
        var query="update Requests set status='rejected' where req_id='"+req_id+"'";
        conn.query(query,function (err,result) {
            if(!err){
                query="select u.mobile,t.origin,t.destination from Users u,Requests r,Trips t where u.user_id=r.user_id && t.trip_id=r.trip_id"
                conn.query(query,function (err,result) {
                    if(!err){

                        var details=result[0];
                        console.log(details);
                        var mob=result[0].mobile;
                        var msg = "Your request for the trip from "+details.origin+" to"+details.destination+" has rejected by driver. Search other trips .\n\nThank you..";
                        var number=mob;

                        var senderid="TRPOOL";
                        var route='4';
                        var dialcode='91';
                        msg91.sendOne(authkey,number,msg,senderid,route,dialcode,function(response){

                            console.log(response);
                            res.json({"status": true});
                        });
                    }
                    else {
                        console.log(err)
                        res.json({"status":true});
                    }
                })

            }
            else{
                console.log(err)
                res.json({"status":true});
            }
        })

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
            console.log(data.distanceValue);

            return data.distanceValue;
        });

}


var driver;
router.post("/find-driver-trips",function (req,res,next) {
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
router.get("/view-rider-trips",function (req,res) {

    var query="select * from Trips where user='"+driver+"'";
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
router.post("/find-passenger-requests",function (req,res,next) {
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
router.get("/view-passenger-trips",function (req,res) {

    var query="select t.origin,t.destination,t.trip_id,t.time from Trips t,Requests r where r.user_id='"+driver+"' && t.trip_id=r.trip_id";
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


module.exports = router;
