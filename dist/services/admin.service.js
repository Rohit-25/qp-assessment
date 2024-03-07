"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const response_1 = require("../helper/response");
class AdminService {
    constructor() {
        this.addGroceryItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, quantity } = req.body;
                const groceryItemExist = yield connection_1.default.prisma.groceryItem.findFirst({
                    where: {
                        name: name,
                    }
                });
                if (groceryItemExist) {
                    return (0, response_1.responseStatus)(res, 409, "item already exist", null);
                }
                let groceryItem = yield connection_1.default.prisma.groceryItem.create({
                    data: {
                        name,
                        price,
                        avilableQuantity: quantity
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        avilableQuantity: true,
                    },
                });
                return (0, response_1.responseStatus)(res, 200, "item added", groceryItem);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.getGroceryItems = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let groceryItems = yield connection_1.default.prisma.groceryItem.findMany({
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        avilableQuantity: true,
                    },
                });
                return (0, response_1.responseStatus)(res, 200, "get all item list", groceryItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.getGroceryItembyId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let groceryItemId = req.params.groceryItemId;
                const groceryItem = yield connection_1.default.prisma.groceryItem.findUnique({
                    where: {
                        id: Number(groceryItemId),
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        avilableQuantity: true,
                        soldQuantity: true,
                    },
                });
                return (0, response_1.responseStatus)(res, 200, "get item by id ", groceryItem);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.updateGroceryItembyId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let groceryItemId = req.params.groceryItemId;
                const { name, price, quantity } = req.body;
                const groceryItem = yield connection_1.default.prisma.groceryItem.findFirst({
                    where: {
                        id: Number(groceryItemId),
                    }
                });
                if (!groceryItem) {
                    return (0, response_1.responseStatus)(res, 404, "item not exist", null);
                }
                const updatedgroceryItem = yield connection_1.default.prisma.groceryItem.update({
                    where: {
                        id: Number(groceryItemId),
                    },
                    data: {
                        name,
                        price,
                        avilableQuantity: quantity
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        avilableQuantity: true
                    },
                });
                return (0, response_1.responseStatus)(res, 200, "item updated", updatedgroceryItem);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.deleteGroceryItembyId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let groceryItemId = req.params.groceryItemId;
                const groceryItem = yield connection_1.default.prisma.groceryItem.findFirst({
                    where: {
                        id: Number(groceryItemId),
                    }
                });
                if (!groceryItem) {
                    return (0, response_1.responseStatus)(res, 404, "item not exist", null);
                }
                const updatedgroceryItem = yield connection_1.default.prisma.groceryItem.delete({
                    where: {
                        id: Number(groceryItemId),
                    }
                });
                return (0, response_1.responseStatus)(res, 200, "item deleted", updatedgroceryItem);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.manageInventory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let groceryItemId = req.params.groceryItemId;
                const { action, avilableQuantity } = req.body;
                const groceryItem = yield connection_1.default.prisma.groceryItem.findFirst({
                    where: {
                        id: Number(groceryItemId),
                    },
                    select: {
                        id: true,
                        avilableQuantity: true
                    }
                });
                if (!groceryItem) {
                    return (0, response_1.responseStatus)(res, 404, "item not exist", null);
                }
                let updatedItem;
                if (action === 'increase') {
                    updatedItem = yield connection_1.default.prisma.groceryItem.update({
                        where: { id: parseInt(groceryItemId) },
                        data: { avilableQuantity: groceryItem.avilableQuantity + parseInt(avilableQuantity) },
                    });
                }
                else if (action === 'decrease') {
                    if (groceryItem.avilableQuantity < parseInt(avilableQuantity)) {
                        return (0, response_1.responseStatus)(res, 400, "Insufficient  avilableQuantity for decrease action", null);
                    }
                    updatedItem = yield connection_1.default.prisma.groceryItem.update({
                        where: { id: parseInt(groceryItemId) },
                        data: { avilableQuantity: groceryItem.avilableQuantity - parseInt(avilableQuantity) },
                    });
                }
                else {
                    return (0, response_1.responseStatus)(res, 404, "only select from increase and decrease acction", updatedItem);
                }
                return (0, response_1.responseStatus)(res, 200, "item inventory updated", updatedItem);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
    }
}
exports.AdminService = AdminService;
