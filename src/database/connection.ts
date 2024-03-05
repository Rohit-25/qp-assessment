import { PrismaClient } from '@prisma/client';

class Database {

  public prisma: PrismaClient;
  public connected: boolean;

  constructor() {
    this.prisma = new PrismaClient();
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.prisma.$connect();
      this.connected = true;
      console.log('connected');
    }
  }

   async disconnect() {
    if (this.connected) {
      await this.prisma.$disconnect();
      this.connected = false;
      console.log('disconnected');
    }
  }
}
const db = new Database();
export default db;
