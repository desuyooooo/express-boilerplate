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
// delete todo
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id=? ORDER BY date_created DESC', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully deleted todo!' });
    });
});
// update todo
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
        res.status(200).send(results);
    });
});
// insert comment 
router.post('/:id/comments', (req, res) => {
    db.query('INSERT INTO comments(`todo_id`, `comment_by`, `content`, `comment_date`) VALUES (?, ?, ?, CURRENT_TIMESTAMP())', [req.params.id, req.body.comment_by, req.body.content], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated comment!' });
    });
});
// by mode display logs
router.post('/logs', (req, res) => {
    db.query('SELECT * FROM logs l, todos t, users u WHERE t.assigned_by=? OR t.assigned_to=? AND l.todo_id=t.id AND t.assigned_by=u.id ORDER BY l.date_modified DESC', [req.body.userid, req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});
// by mode insert
router.post('/logs/insert', (req, res) => {
    db.query('INSERT INTO logs(`todo_id`, `content`, `modified_by`) VALUES (?, ?, ?)', [req.body.todoid, req.body.content, req.body.modified_by], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added to logs'});
    });
});

/* // Extra codes
// insert logs *
router.post('/logs/insert', (req, res) => {
    db.query('INSERT INTO logs(`todoid`, `previous_title`, `previous_description`, `modified_by`) VALUES (?, ?, ?, ?)', [req.body.todoid, req.body.title, req.body.description, req.body.modified_by], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added to logs' });
    });
});

// display logs SELECT * FROM logs l, todos t, users u WHERE t.assigned_by=? AND t.assigned_to=? AND t.id=l.todoid AND t.assigned_by=u.id ORDER BY l.date_modified DESC',
router.post('/logs', (req, res) => {
    db.query('SELECT * FROM logs l, todos t, users u WHERE t.assigned_by=? AND t.assigned_to=? AND t.id=l.todoid AND t.assigned_by=u.id ORDER BY date_modified DESC', [req.body.userid, req.body.userid], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});*/


/*  // MYSQL queries
DATABASES:
database name: express
create database express;

TABLES:
table name: users
create table users (id int primary key auto_increment not null, username varchar(20) unique not null, password varchar(10000) not null);

table name: todos
create table todos (id int not null primary key auto_increment, title varchar (50) not null, description varchar (50) not null, done tinyint default 0, date_created datetime default CURRENT_TIMESTAMP(), date_modified datetime, assigned_by int not null. assigned_to int not null);

table name: comments
create table comments (id int primary key not null auto_increment, todo_id int not null, comment_by int not null, content varchar (100) not null, comment_date datetime default CURRENT_TIMESTAMP());

table name: logs
create table logs (id int primary key not null auto_increment, todo_id int not null, content varchar (100) not null, modified_by int not null, date_modified datetime default CURRENT_TIMESTAMP());
*/
module.exports = router;
