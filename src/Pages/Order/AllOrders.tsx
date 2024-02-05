import React from "react";
import { useGetOrdersByUserIdQuery } from "../../Apis/orderApi";
import { menuItemModel, userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storeage/Redux/store";
import { MainLoader } from "../../Components/Page/Common";
import orderHeaderModel from "../../Interfaces/orderHeaderModel";
import OrderList from "../../Components/Page/Order/OrderList";
import { withAdminAuth, withAuth } from "../../HOC";

function AllOrders() {

  const { data, isLoading } = useGetOrdersByUserIdQuery("");
  return (
    // <></>
     <OrderList isLoading={isLoading} orderData={data}></OrderList>
  );
}

export default withAdminAuth(AllOrders);
