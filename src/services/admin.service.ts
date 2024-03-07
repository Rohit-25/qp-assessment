import { Request, Response } from "express";
import db from "../database/connection";
import { responseStatus } from "../helper/response";
import { groceryItem  } from "@prisma/client";

export class AdminService {
 addGroceryItem = async (req: Request, res: Response) => {

    try {
          const { name, price, quantity} = req.body; 
          const groceryItemExist = await db.prisma.groceryItem.findFirst({
            where:{
                name:name,
            }
          });

          if(groceryItemExist){
            return responseStatus(res,409,"item already exist",null);

          }
          
          let groceryItem= await db.prisma.groceryItem.create({
              data:{
                name,
                price,
                avilableQuantity:quantity
              } , 
              select: {
                id: true,
                name: true,
                price: true,
                avilableQuantity: true,
               
              }, 
            })
            return responseStatus(res, 200, "item added",groceryItem );
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

 getGroceryItems = async (req: Request, res: Response) => {

    try {
          let groceryItems= await db.prisma.groceryItem.findMany({
          select: {
              id: true,
              name: true,
              price: true,
              avilableQuantity: true,
          },
          })

          return responseStatus(res, 200, "get all item list",groceryItems);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

  getGroceryItembyId = async (req: Request, res: Response) => {

    try {
          let groceryItemId = req.params.groceryItemId;
        
           const groceryItem = await db.prisma.groceryItem.findUnique({
            where:{
                id:Number(groceryItemId),
            }, 
            select: {
              id: true,
              name: true,
              price: true,
              avilableQuantity: true,
              soldQuantity: true,
            },
          });

          return responseStatus(res, 200, "get item by id ",groceryItem);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

  updateGroceryItembyId = async (req: Request, res: Response) => {

    try {
          let groceryItemId = req.params.groceryItemId;
          const { name, price, quantity} = req.body; 
          
           const groceryItem = await db.prisma.groceryItem.findFirst({
            where:{
                id:Number(groceryItemId),
            }
          });
          if(!groceryItem){
            return responseStatus(res,404,"item not exist",null);

          }

          const updatedgroceryItem = await db.prisma.groceryItem.update({
            where:{
                id:Number(groceryItemId),
            },
            data:{
             name,
             price,
              avilableQuantity:quantity
            }, 
            select: {
              id: true,
              name: true,
              price: true,
              avilableQuantity: true
            },
          
          })

          return responseStatus(res, 200, "item updated",updatedgroceryItem);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

  deleteGroceryItembyId = async (req: Request, res: Response) => {

    try {
          let groceryItemId = req.params.groceryItemId;
          
           const groceryItem = await db.prisma.groceryItem.findFirst({
            where:{
                id:Number(groceryItemId),
            }
          });
          if(!groceryItem){
            return responseStatus(res,404,"item not exist",null);

          }

          const updatedgroceryItem = await db.prisma.groceryItem.delete({
            where:{
                id:Number(groceryItemId),
            }      
          })

          return responseStatus(res, 200, "item deleted",updatedgroceryItem);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

  manageInventory = async (req: Request, res: Response) => {

  try {
          let groceryItemId = req.params.groceryItemId;
          const { action,  avilableQuantity } = req.body;
          
          const groceryItem = await db.prisma.groceryItem.findFirst({
            where:{
                id:Number(groceryItemId),
            },
            select:{
              id:true,
               avilableQuantity:true
            }
          });
          if(!groceryItem){
            return responseStatus(res,404,"item not exist",null);
          }
          let updatedItem;

          if (action === 'increase') {
            updatedItem = await db.prisma.groceryItem.update({
              where: { id: parseInt(groceryItemId) },
              data:  {  avilableQuantity: groceryItem. avilableQuantity + parseInt( avilableQuantity) },
           });
          } else if (action === 'decrease') {
            if (groceryItem. avilableQuantity < parseInt( avilableQuantity)) {
             
              return responseStatus(res, 400, "Insufficient  avilableQuantity for decrease action",null);
            }
            updatedItem = await db.prisma.groceryItem.update({
              where: { id: parseInt(groceryItemId) },
              data: {  avilableQuantity: groceryItem. avilableQuantity - parseInt( avilableQuantity) },
            });
          } else {
             return responseStatus(res, 404, "only select from increase and decrease acction",updatedItem);
           }
           return responseStatus(res, 200, "item inventory updated",updatedItem);
        }catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  }
}