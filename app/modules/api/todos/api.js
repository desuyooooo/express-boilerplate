var router = require('express').Router();
var db = require('../../../lib/database')();

router.post('/all', (req, res) => {
    db.query('SELECT * FROM todos WHERE assigned_by=? or assigned_to=?', [req.body.userid, req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(results);
    });
});

router.post('/mine', (req, res) => {
    db.query('SELECT * FROM todos WHERE assigned_to=?', [req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(results);
    });
});

router.post('/theirs', (req, res) => {
    db.query('SELECT * FROM todos WHERE assigned_by=?', [req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(results);
    });
});

router.post('/', (req, res) => {
    db.query('INSERT INTO todos (`title`, `description`, `assigned_by`, `assigned_to`, `done`) VALUES (?, ?, ?, ?, false)', [req.body.title, req.body.description, req.body.assigned_by, req.body.assigned_to], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added todo!' });
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results[0]);
    })
});

router.post('/', (req, res) => {
    db.query('DELETE FROM todos WHERE id=?', [req.body.title], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results[0]);
    });
});

module.exports = router;
