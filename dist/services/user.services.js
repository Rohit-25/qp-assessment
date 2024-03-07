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
                });
                return (0, response_1.responseStatus)(res, 200, "user created", user);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.getallUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userWithOrdersAndItems = yield connection_1.default.prisma.user.findMany({
                // include: {
                //   order: {
                //     include: {
                //       items: true // Assuming 'items' is the name of the relation in your Order model
                //     }
                //   }
                // }
                });
                return (0, response_1.responseStatus)(res, 200, "all user list", userWithOrdersAndItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.responseStatus)(res, 500, error.message, error);
            }
        });
        this.bookOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { items } = req.body;
                const userId = req.params.userId;
                const userExisted = yield connection_1.default.prisma.user.findUnique({
                    where: {
                        id: Number(userId),
                    }
                });
                if (!userExisted) {
                    return (0, response_1.responseStatus)(res, 404, "user not exist", null);
                }
                const messages = [];
                for (const item of items) {
                    const groceryItem = yield connection_1.default.prisma.groceryItem.findUnique({
                        where: { id: item.id }
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
                    const order = yield connection_1.default.prisma.order.create({
                        data: {
                            userId: Number(userId),
                        },
                        select: {
                            id: true,
                            userId: true
                        }
                    });
                    let orderDetails = [];
                    for (const item of items) {
                        const orderDetail = yield connection_1.default.prisma.orderDetails.create({
                            data: {
                                orderId: order.id,
                                quantity: item.quantity,
                                groceryItemId: item.id
                            },
                            select: {
                                quantity: true,
                                order: {
                                    select: {
                                        user: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                },
                                groceryItem: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        });
                        orderDetails.push(orderDetail);
                    }
                    yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const { id, quantity } = item;
                        // Decrease the available quantity and increase the sold quantity
                        yield connection_1.default.prisma.groceryItem.update({
                            where: { id },
                            data: {
                                avilableQuantity: {
                                    decrement: quantity,
                                },
                                soldQuantity: {
                                    increment: quantity,
                                },
                            },
                        });
                    })));
                    return (0, response_1.responseStatus)(res, 200, "item added", orderDetails);
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
