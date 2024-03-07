"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageGroceryItemById = exports.deleteGroceryItemById = exports.updateGroceryItemById = exports.getGroceryItemById = exports.getGroceryItems = exports.addGroceryItem = void 0;
const admin_service_1 = require("../services/admin.service");
const response_1 = require("../helper/response");
let adminService = new admin_service_1.AdminService();
const addGroceryItem = (req, res) => {
    try {
        return adminService.addGroceryItem(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.addGroceryItem = addGroceryItem;
const getGroceryItems = (req, res) => {
    try {
        return adminService.getGroceryItems(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.getGroceryItems = getGroceryItems;
const getGroceryItemById = (req, res) => {
    try {
        return adminService.getGroceryItembyId(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.getGroceryItemById = getGroceryItemById;
const updateGroceryItemById = (req, res) => {
    try {
        return adminService.updateGroceryItembyId(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.updateGroceryItemById = updateGroceryItemById;
const deleteGroceryItemById = (req, res) => {
    try {
        return adminService.deleteGroceryItembyId(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.deleteGroceryItemById = deleteGroceryItemById;
const manageGroceryItemById = (req, res) => {
    try {
        return adminService.manageInventory(req, res);
    }
    catch (error) {
        return (0, response_1.responseStatus)(res, 500, error.message, error);
    }
};
exports.manageGroceryItemById = manageGroceryItemById;
