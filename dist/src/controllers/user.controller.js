"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewGroceryItems = exports.bookOrder = exports.getusers = exports.adduser = void 0;
const user_services_1 = require("../services/user.services");
const response_1 = require("../helper/response");
let userService = new user_services_1.UserService();
const adduser = (req, res) => {
    try {
        return userService.addUser(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.adduser = adduser;
const getusers = (req, res) => {
    try {
        return userService.getallUser(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.getusers = getusers;
const bookOrder = (req, res) => {
    try {
        return userService.bookOrder(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.bookOrder = bookOrder;
const viewGroceryItems = (req, res) => {
    try {
        return userService.viewGroceryItems(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.viewGroceryItems = viewGroceryItems;
