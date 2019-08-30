var mysql = require('mysql')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
})

db.connect(function(err) {
    if (err) throw err
    console.log('Mysql connected...')
})
var db_connection=1;
db.query('create database if not exists Trip_Pool', function(err, result) {
    if (err) throw err
    //console.log("database created");
})
db.query('use Trip_Pool',function (err, result) {
    if (err) throw err
});
var query='create table if not exists Cities(city_id int primary key NOT NULL AUTO_INCREMENT,city_name varchar(255))';
db.query(query,function (err, result) {
    if (err) throw err
    //console.log(result)

})

query='create table if not exists Colleges(college_id int primary key NOT NULL AUTO_INCREMENT,college_name varchar(255),college_address varchar(255),town varchar(255))'
db.query(query,function (err, result) {
    if (err) throw err
    //console.log(result)

})

query='create table if not exists Users(user_id int primary key NOT NULL AUTO_INCREMENT,' +
    'first_name varchar(255),' +
    'last_name varchar(255),' +
    'email varchar(255),' +
    'mobile varchar(255),' +
    'city varchar(255),' +
    'college varchar(255),' +
    'user_type varchar(255),' +
    'gender varchar(255),' +
    'password varchar(255)) ';
db.query(query,function (err, result) {
    if (err) throw err
    //console.log(result)

})
query='CREATE TABLE if not exists Trips (' +
    '  `trip_id` INT NOT NULL AUTO_INCREMENT,' +
    '  `date` DATE NULL,' +
    '  `time` VARCHAR(45) NULL,' +
    '  `vehicle` VARCHAR(45) BINARY NULL,' +
    '  `seats` INT NULL,' +
    '  `v_details` VARCHAR(255) NULL,' +
    '  `rules` VARCHAR(255) NULL,' +
    '  `origin` VARCHAR(255) NULL,' +
    '  `destination` VARCHAR(255) NULL,' +
    '  `status` VARCHAR(45) NULL,' +
    '  PRIMARY KEY (`trip_id`));';

db.query(query,function (err, result) {
    if (err) throw err
    //console.log(result)

})
//module.exports = db;
//module.exports=db_connection;
exports.db=db;