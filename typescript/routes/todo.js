"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const todo = [];
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todo });
});
router.post('/', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        name: req.body.name,
    };
    todo.push(newTodo);
    res.status(200).json({ message: 'Added' });
});
router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    const index = todo.findIndex((todoItem) => todoItem.id === id);
    if (index >= 0) {
        todo[index] = { id: id, name: name };
        res.status(200).json({ message: 'Updated' });
    }
    else
        res.status(404).json({ message: 'Not found' });
});
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    const length = todo.length;
    todo.filter((todoItem) => {
        todoItem.id !== id;
    });
    if (todo.length < length)
        res.status(200).json({ message: 'deleted' });
    else
        res.status(404).json({ message: 'Not found' });
});
exports.default = router;
