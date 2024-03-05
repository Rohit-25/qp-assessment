import express from 'express';
import * as groceryItemController from '../controllers/admin.controller';


let router = express.Router();

router.post('/groceryItem',groceryItemController.addGroceryItem);
router.get('/groceryItems',groceryItemController.getGroceryItems);
router.get('/groceryItem/:groceryItemId',groceryItemController.getGroceryItemById);
router.put('/groceryItem/:groceryItemId',groceryItemController.updateGroceryItemById);
router.delete('/groceryItem/:groceryItemId',groceryItemController.deleteGroceryItemById);
router.patch('/manageGroceryItemInventory/:groceryItemId',groceryItemController.manageGroceryItemById);





export {router as adminRoutes}