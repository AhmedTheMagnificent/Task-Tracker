const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { List } = require('./db/models/listmodel');
const { Task } = require("./db/models/taskmodel");
const { mongoose } = require("./db/mongoose");
app.use(bodyParser.json());


app.get('/lists', (req, res) => {
    List.find({}).then((lists) => {
        res.send(lists);
    });
});

app.post('/lists', (req, res) => {
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    });
});

app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({_id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

app.delete('/lists/:id', (req, res) => {
    List.findOneAndDelete({ _id: req.params.id })
        .then((removedListDoc) => {
            res.send(removedListDoc);
        });
});

app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({ _listId: req.params.listId}).then((tasks) => {
        res.send(tasks);
    });
});

app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });

    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    });
});

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({_id: req.params.taskId, _listId: req.params.listId},
        { $set: req.body }
    ).then(() => {
        res.send(200);
    });
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000"); 
});