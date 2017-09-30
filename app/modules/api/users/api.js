var router = require('express').Router();
var db = require('../../../lib/database')();

// register
router.post('/register', (req, res) => {
    db.query('INSERT INTO users (`username`, `password`, `fullname`, `user_type`) VALUES (?, md5(?), ?, ?)', [req.body.username, req.body.password, req.body.fullname, req.body.user_type], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString(), message: 'Username already exists' });
        res.status(200).send({ message: 'Successfully registered!', login: 'true' });
    });         
});
// login
router.post('/login', (req, res) => {
	var result;
    db.query('SELECT * FROM users WHERE username=? and password=md5(?)', [req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        try{
       		result = Object.assign(results[0], {login: 'true', message: 'Successfully logged in!'});
        }catch(error){
            result = { error: error.toString(), message: 'Invalid Username or Password', login: 'false' };
        }
    	res.status(200).send(result);
    });
});
// set code
router.put('/code', (req, res) => {
    db.query("UPDATE users SET code=? WHERE id=?", [req.body.code, req.body.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully set the driver code !' });
    });
});
// extra
// display all users either type // for devs
router.get('/users', (req, res) => {
    db.query("SELECT id, username FROM users ORDER BY username ASC", (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// display all driver users // for Devs
router.post('/drivers', (req, res) => {
    db.query("SELECT * FROM users WHERE user_type='DRV'", (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// display all guardian users // for Devs
router.post('/guardians', (req, res) => {
    db.query("SELECT * FROM users WHERE user_type='GRD'", (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
/*
router.get('/', (req, res) => {
    db.query('SELECT id, username FROM users ORDER BY username ASC', (err, results, fields) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(results);
    });
});

router.post('/register', (req, res) => {
    db.query('INSERT INTO users (`username`, `password`) VALUES (?, md5(?))', [req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString(), message: 'Username already exists' });
        res.status(200).send({ message: 'Successfully registered!', login: 'true' });
    });         
});

router.post('/login', (req, res) => {
	var result;
    db.query('SELECT * FROM users WHERE username=? and password=md5(?)', [req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        try{
       		result = Object.assign(results[0], {login: 'true', message: 'Successfully logged in!'});
        }catch(error){
            result = { error: error.toString(), message: 'Invalid Username or Password', login: 'false' };
        }
    	res.status(200).send(result)
    });
});
*/
module.exports = router;
