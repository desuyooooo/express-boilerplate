var router = require('express').Router();
var db = require('../../../lib/database')();

// add school for DRV
router.post('/school', (req, res) => {
    db.query("INSERT INTO schools (`id`, `school_name`, `lttd`, `lngtd`) VALUES (?, ?, ?, ?)", [req.body.id, req.body.location, req.body.lttd, req.body.lngtd], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added school !' });
    });
});

// add location
router.post('/', (req, res) => {
    db.query("INSERT INTO location (`lttd`, `lngtd`) VALUES (?, ?)", [ req.body.lttd, req.body.lngtd], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added location !' });
    });
});

// update location DRV
router.put('/:id', (req, res) => {
    db.query("UPDATE location SET location=? WHERE id=?", [req.body.location, req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated location !' });
    });
});

// update location and lttd and lngtd // for GRD
router.put('/location/save', (req, res) => {
    db.query("UPDATE location SET lttd=?, lngtd=?, location=?", [req.body.lttd, req.body.lngtd, req.body.location], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated location !' });
    });
});
// get location of driver // for GRD
router.post('/driver/location', (req, res) => {
    db.query("SELECT l.lttd, l.lngtd, l.location FROM location l, users u WHERE u.id=(SELECT id FROM users WHERE code=? AND user_type='DRV') AND l.userid=u.id", [req.body.code], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// display the meet ups // for DRV
router.post('/driver/destination', (req, res) => {
    db.query("SELECT l.lttd, l.lngtd, l.location FROM location l, users u WHERE u.code=? AND l.userid=u.id AND u.user_type='GRD'", [req.body.code], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});



/*  // MYSQL queries
DATABASES:
database name: cheesydrop
create database cheesydrop;

TABLES:
table name: users
create table users (id int primary key auto_increment not null, username varchar(20) unique not null, password varchar(10000) not null, fullname varchar(100) not null, user_type ENUM('DRV', 'GRD'), status ENUM('ready', 'preparing', 'not going') DEFAULT 'ready', code varchar(50));

table name: location
create table location (id int primary key auto_increment not null, location varchar(1000) default 'NOT SET', lttd double DEFAULT '0', lngtd double DEFAULT '0');

table name: schools
create table schools (id int primary key auto_increment not null, school_name varchar(100) not null, lttd double DEFAULT '0', lngtd double DEFAULT '0');
*/

module.exports = router;
