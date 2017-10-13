var router = require('express').Router();
var db = require('../../../lib/database')();

// register
router.post('/register', (req, res) => {
    db.query('INSERT INTO users (`username`, `password`, `fullname`, `user_type`, `code`) VALUES (?, md5(?), ?, ?, ?)', [req.body.username, req.body.password, req.body.fullname, req.body.user_type, req.body.code], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString(), message: 'Username already exists' });
        res.status(200).send({ message: 'Successfully registered!', login: 'true' });
    });         
});
// login
router.post('/login', (req, res) => {
	var result;
    db.query('SELECT * FROM users WHERE username=? and password=md5(?)', [req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        try {
       		result = Object.assign(results[0], {login: 'true', message: 'Successfully logged in!'});
        } catch(error) {
            result = { error: error.toString(), message: 'Invalid Username or Password', login: 'false' };
        }
    	res.status(200).send(result);
    });
});
// code verify
router.post('/codeverify', (req, res) => {
    db.query('SELECT COUNT(code) as num FROM users WHERE code=? AND user_type=`DRV`', [req.body.code], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        try {
            result = Object.assign(results, {valid: (results.num) ? 'true' : 'false'});
        } catch (e) {
            result = {error : error.toString(), message: 'Error in CODE verification.', valid: 'false'};
        }
        res.status(200).send(result);
    });
});

// extra
// display code // for devs
router.post('/getcode', (req, res) => {
    db.query("SELECT code FROM users WHERE id=?", [req.body.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// display all users either type // for devs
router.get('/users', (req, res) => {
    db.query("SELECT id, username FROM users ORDER BY username ASC", (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// set code // for devs
router.put('/code', (req, res) => {
    db.query("UPDATE users SET code=? WHERE id=?", [req.body.code, req.body.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully set the driver code !' });
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


module.exports = router;
