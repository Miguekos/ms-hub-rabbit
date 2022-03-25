export class OrderDTO{
    readonly ID: number;
    readonly DeliveryOrderId: string;
    readonly MerchantId: string;
    readonly MerchanAppId: string;
    readonly OauthClient: {
        readonly _id: string, 
        readonly client_id: string
    };
    readonly resource: string;
    readonly attemps: number;
    readonly received: String;
    readonly createdAt: Date;
    readonly detailStatus: {
        readonly Name: string, 
        readonly ExternalName: string,
        readonly ID: number,
        readonly LastUpdated: string,
        readonly LastUpdatedByUser: string,
    };
    
}

