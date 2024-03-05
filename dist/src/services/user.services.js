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
exports.UserService = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const response_1 = require("../helper/response");
class UserService {
    constructor() {
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, email } = req.body;
                const userExisted = yield connection_1.default.prisma.user.findFirst({
                    where: {
                        email: email,
                    }
                });
                if (userExisted) {
                    return (0, response_1.responseStatus)(res, 409, "user already exist", null);
                }
                let user = yield connection_1.default.prisma.user.create({
                    data: {
                        name,
                        email,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        items: {
                            select: {
                                soldQuantity: true,
                                name: true
                            }
                        }
                    }
                });
                const response = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    itemsBooked: ((_a = user.items) === null || _a === void 0 ? void 0 : _a.map(item => ({
                        name: item.name,
                        bookedQuantity: item.soldQuantity || 0,
                    }))) || [],
                };
                return (0, response_1.responseStatus)(res, 200, "user created", response);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.getallUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield connection_1.default.prisma.user.findMany({
                    select: {
                        name: true,
                        email: true,
                        id: true,
                        items: {
                            select: {
                                name: true,
                                soldQuantity: true
                            }
                        }
                    }
                });
                const response = {
                    Allusers: users.map(user => {
                        var _a;
                        return ({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            itemsBooked: (_a = user.items) === null || _a === void 0 ? void 0 : _a.map(item => ({
                                name: item.name,
                                bookedQuantity: item.soldQuantity || 0,
                            })),
                        });
                    })
                };
                return (0, response_1.responseStatus)(res, 200, "all user list", response);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.bookOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const { items } = req.body;
                const userId = req.params.userId;
                const user = yield connection_1.default.prisma.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        items: true
                    }
                });
                if (!user) {
                    return (0, response_1.responseStatus)(res, 404, "user not exist", null);
                }
                const messages = [];
                for (const item of items) {
                    const groceryItem = yield connection_1.default.prisma.groceryItem.findUnique({
                        where: { name: item.name }
                    });
                    if (!groceryItem) {
                        // Item not found in the database
                        messages.push(`Item '${item.name}' not found.`);
                    }
                    else if (item.quantity > groceryItem.avilableQuantity) {
                        // Requested avilableQuantity is not avilable
                        messages.push(`Insufficient avilableQuantity available for '${item.name}'. Available avilableQuantity: ${groceryItem.avilableQuantity}`);
                    }
                }
                console.log(messages);
                if (messages.length > 0) {
                    // If there are messages, handle them (e.g., return an error response)
                    return (0, response_1.responseStatus)(res, 403, "user not exist", messages);
                }
                else {
                    // If all items have sufficient avilableQuantity, proceed with the order
                    for (const item of items) {
                        console.log(item);
                        yield connection_1.default.prisma.groceryItem.update({
                            where: { name: item.name },
                            data: { avilableQuantity: { decrement: item.quantity },
                                userId: user.id,
                                soldQuantity: { increment: item.quantity }
                            }
                        });
                    }
                    const response = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        itemsBooked: (_b = user.items) === null || _b === void 0 ? void 0 : _b.map(item => ({
                            name: item.name,
                            bookedQuantity: item.soldQuantity || 0,
                        })),
                    };
                    return (0, response_1.responseStatus)(res, 200, "item added", response);
                }
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.viewGroceryItems = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const groceryItems = yield connection_1.default.prisma.groceryItem.findMany({
                    where: {
                        avilableQuantity: {
                            gt: 0
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        avilableQuantity: true,
                        soldQuantity: true,
                    },
                });
                return (0, response_1.responseStatus)(res, 200, "available grocery items", groceryItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
    }
}
exports.UserService = UserService;
