import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
 
export type OrderDocument = Order & Document;
 
@Schema({})
export class Order {
  @Prop()
  ID: Number;

  @Prop({ unique: true })
  DeliveryOrderId: String;

  @Prop()
  MerchantId: String;

  @Prop()
  MerchanAppId: String;

  @Prop(raw({
    _id: { type: String },
    client_id: { type: String }
  }))
  OauthClient: Record<string, any>;

  @Prop()
  resource: String;

  @Prop()
  attemps: Number;

  @Prop()
  received: String;

  @Prop({default: 'P'})
  statusOrder: string;

  @Prop({default: Date.now})
  createdAt: Date

  @Prop(raw({
    Name: { type: String },
    ExternalName: { type: String },
    ID: { type: Number },
    LastUpdated: { type: String },
    LastUpdatedByUser: { type: String },
  }))
  detailStatus: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);