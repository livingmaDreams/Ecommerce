"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
const todo_1 = __importDefault(require("./routes/todo"));
app.use(todo_1.default);
app.listen(3000);
