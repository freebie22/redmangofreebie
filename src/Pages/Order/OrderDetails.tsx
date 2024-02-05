import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../Apis/orderApi";
import { OrderSummary } from "../../Components/Page/Order";

function OrderDetails() {
  const { orderHeaderId } = useParams();

  const { data, isLoading } = useGetOrderByIdQuery(orderHeaderId);

  let userInput, orderDetails;

  if (!isLoading && data?.result) {
    console.log(data.result);
    userInput = {
      name: data.result.pickupName,
      email: data.result.pickupEmail,
      phoneNumber: data.result.pickupPhoneNumber,
    };
    orderDetails = {
      id: data.result.orderHeaderId,
      cartItems: data.result.orderDetails,
      cartTotal: data.result.orderTotal,
      status: data.result.status,
    };
  }
  return (<div className="container my-5 mx-auto p-5 w-100" style={{maxWidth: "750px"}}>
    {!isLoading && orderDetails && userInput && (
        <OrderSummary data={orderDetails} userInput={userInput}></OrderSummary>
    )}
  </div>)
}

export default OrderDetails;
