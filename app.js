var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/to_do_list';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/get_tasks', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.post('/add_task', function(req, res) {
    console.log(req.body);
    var addTask = {
        task_id: req.body.task_id,
        task_name: req.body.task_name,
        task_status: req.body.task_status
    };
    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO tasks (task_name, task_status) ' +
            'VALUES ($1, $2) RETURNING task_id, task_name, task_status;',
            [addTask.task_name, addTask.task_status],
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.post('/get_this_task', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks WHERE task_id = ' + req.body.task_id);

            query.on('row', function(row) {
                results.push(row);
            });

            query.on('end', function () {
                client.end();
                console.log(results);
                return res.json(results);
            });

        if (err) {
            console.log(err);
        }
    });
});

app.post('/complete_task', function(req, res) {

    pg.connect(connectionString, function(err, client, done) {
        client.query('UPDATE tasks SET task_status = true WHERE task_id = ' + req.body.task_id,
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.post('/redo_task', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('UPDATE tasks SET task_status = false WHERE task_id = ' + req.body.task_id,
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.delete('/del_task', function (req, res) {
   pg.connect(connectionString, function(err, client, done) {
       client.query('DELETE FROM tasks WHERE task_id = ' + req.body.task_id,
           function(err, result) {
               done();
               if(err) {
                   console.log('Error inserting data: ', err);
                   res.send(false);
               } else {
                   res.send(result);
               }
           });
   });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});