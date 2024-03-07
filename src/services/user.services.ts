import { Request, Response } from "express";
import db from "../database/connection";
import { responseStatus } from "../helper/response";
import { groceryItem  } from "@prisma/client";

export class UserService {
 addUser = async (req: Request, res: Response) => {

    try {
          const { name,email} = req.body; 
          const userExisted= await db.prisma.user.findFirst({
            where:{
                email:email,
            }
          });

          if(userExisted){
            return responseStatus(res,409,"user already exist",null);
          }
          
          let user= await db.prisma.user.create({
              data:{
                name,
                email,  
              },
            })
         
            return responseStatus(res, 200, "user created",user );
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

 getallUser = async (req: Request, res: Response) => {

    try {
          const userWithOrdersAndItems = await db.prisma.user.findMany({});
          
          return responseStatus(res, 200, "all user list",userWithOrdersAndItems);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

 bookOrder = async (req: Request, res: Response) => {

    try {
          const { items} = req.body;
          const userId= req.params.userId;

          const userExisted= await db.prisma.user.findUnique({
            where:{
                id:Number(userId),
            }
          });

          if(!userExisted){
            return responseStatus(res,404,"user not exist",null);

          }
          
        const messages = [];
        for (const item of items) {
            const groceryItem = await db.prisma.groceryItem.findUnique({
                where: { id: item.id }
            });

            if (!groceryItem) {
                // Item not found in the database
                messages.push(`Item '${item.name}' not found.`);
            } else if (item.quantity > groceryItem.avilableQuantity) {
                // Requested avilableQuantity is not avilable
                messages.push(`Insufficient avilableQuantity available for '${item.name}'. Available avilableQuantity: ${groceryItem.avilableQuantity}`);
            }
        }
         interface Item {
           id: number,
           quantity:number
         }
       console.log(messages)
        if (messages.length > 0) {
        // If there are messages, handle them (e.g., return an error response)
        return responseStatus(res,403,"user not exist",messages);
        } else {
        // If all items have sufficient avilableQuantity, proceed with the order
         
       
        const order = await db.prisma.order.create({
              data: {
                userId:Number(userId),
              },
              select:{
                id:true,
                userId:true
              }
             
         });
         let orderDetails =[];
         for (const item of items){
          const orderDetail = await db.prisma.orderDetails.create({
            data:{
              orderId:order.id,
              quantity:item.quantity,
              groceryItemId:item.id
            },
            select:{
              quantity:true,
              order:{
               select:{
                user:{
                  select:{
                    name:true
                  }
                }
               }
              },
              groceryItem:{
                select:{
                  name:true
                }
              }
            

            }
          })
          orderDetails.push(orderDetail)
         }
      
        await Promise.all(
          items.map(async (item:Item) => {
              const { id, quantity } = item;

              // Decrease the available quantity and increase the sold quantity
              await db.prisma.groceryItem.update({
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
          })
        );
    

          return responseStatus(res, 200, "item added",orderDetails);

        }
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

  viewGroceryItems = async (req: Request, res: Response) => {

    try {
          
           const groceryItems = await db.prisma.groceryItem.findMany({
            where:{
                avilableQuantity:{
                  gt:0
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

          return responseStatus(res, 200, "available grocery items",groceryItems);
        
        } catch (error: any) {
            console.log(error)
          return responseStatus(res, 500, error.message, error);
        }
  };

}