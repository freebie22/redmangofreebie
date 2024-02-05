import { SD_Status } from "../Utility/SD";
import OrderDetails from "./orderDetailsModel";

export default interface OrderHeaderModel
{
    orderHeaderId: number;
    pickupName: string;
    pickupPhoneNumber: string;
    pickupEmail: string;
    applicationUserId: string;
    user?: any;
    orderTotal: number;
    orderDate: number;
    stripePaymentIntentID: string;
    status: SD_Status;
    totalItems: number;
    orderDetails: OrderDetails[];
}