import { Mongoose } from "mongoose";
import { UsingClient } from "seyfert";

const MongooseClient = new Mongoose({ strictQuery: false });

export class AsepDatabase {
  private client: UsingClient;
  private mongoose: Mongoose;

  private connected: boolean = false;
  constructor(client: UsingClient) {
    this.client = client;
    this.mongoose = MongooseClient;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    try {
      await this.mongoose.connect(process.env.MONGODB_URI!);
      this.connected = true;
      this.client.logger.info("[Asep - Database]: Koneksi Berhasil");
    } catch (err) {
      this.client.logger.error(err);
    }
  }
}
