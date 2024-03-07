import express, { Request, Response } from 'express';
import db from './database/connection';
import { adminRoutes } from './routes/admin.routes';
import { userRoutes } from './routes/user.routs';


const app = express();
const PORT = 3000;

async function server() {
  try{
    await db.connect();
    app.use(express.json())

    app.use('/api/admin', adminRoutes);
    app.use('/api/user', userRoutes);

    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, Express!');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  }catch(error){
    console.log(error);
    await db.disconnect(); 
    
}

}
void server();





