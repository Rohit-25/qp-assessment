import express from 'express';
import * as userController from '../controllers/user.controller';


let router = express.Router();

router.post('/',userController.adduser);
router.get('/',userController.getusers);
router.post('/:userId/bookorder',userController.bookOrder);
router.get('/groceyItems',userController.viewGroceryItems);






export {router as userRoutes}