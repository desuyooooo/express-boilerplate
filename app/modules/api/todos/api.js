var router = require('express').Router();
var db = require('../../../lib/database')();
// display all
router.post('/', (req, res) => {
    db.query('SELECT * FROM todos WHERE assigned_by=? or assigned_to=?', [req.body.userid, req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(results);
    });
});
// insert todo
router.post('/add', (req, res) => {
    db.query('INSERT INTO todos (`title`, `description`, `assigned_by`, `assigned_to`, `done`, `date_created`) VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)', [req.body.title, req.body.description, req.body.assigned_by, req.body.assigned_to], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added todo!' });
    });
});
// get one
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results[0]);
    })
});
// delete
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully deleted todo!' });
    });
});
// update
router.put('/:id', (req, res) => {
    db.query('UPDATE todos SET title=?, description=?, date_modified=CURRENT_TIMESTAMP() WHERE id=?', [req.body.title, req.body.description, req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated todo!' });
    });
});
// display comments in a todo
router.get('/:id/comments', (req, res) => {
    db.query('SELECT * FROM comments WHERE todo_id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({results});
    });
});
// insert comment 
router.post('/:id/comments', (req, res) => {
    db.query('INSERT INTO comments(`todo_id`, `comment_by`, `content`, `comment_date`) VALUES (?, ?, ?, CURRENT_TIMESTAMP())', [req.params.id, req.body.comment_by, req.body.content], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated comment!' });
    });
});/*
// track changes
router.post('/logs', (req, res) => {
    db.query('SELECT * FROM logs, todos WHERE todos.id=logs.id  ')
});

todoid
updated_by
date_modified
previous_title,
previous_description

*/
module.exports = router;
