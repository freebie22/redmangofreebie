import React from "react";
import { useGetOrdersByUserIdQuery } from "../../Apis/orderApi";
import { menuItemModel, userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storeage/Redux/store";
import { MainLoader } from "../../Components/Page/Common";
import orderHeaderModel from "../../Interfaces/orderHeaderModel";
import OrderList from "../../Components/Page/Order/OrderList";
import { withAuth } from "../../HOC";

function MyOrders() {
  const userData = useSelector(
    (state: RootState) => state.userAuthStore.id
  );

  const { data, isLoading } = useGetOrdersByUserIdQuery(userData);


  return (
    // <></>
     <OrderList isLoading={isLoading} orderData={data}></OrderList>
  );
}

export default withAuth(MyOrders);
