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
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../database/connection"));
const admin_routes_1 = require("../routes/admin.routes");
const user_routs_1 = require("../routes/user.routs");
const app = (0, express_1.default)();
const PORT = 3000;
function server() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.default.connect();
            app.use(express_1.default.json());
            app.use('/api/admin', admin_routes_1.adminRoutes);
            app.use('/api/user', user_routs_1.userRoutes);
            app.get('/', (req, res) => {
                res.send('Hello, Express!');
            });
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.log(error);
            yield connection_1.default.disconnect();
        }
    });
}
void server();
