var router = require('express').Router();
var db = require('../../../lib/database')();

router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results, fields) => {
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

module.exports = router;
