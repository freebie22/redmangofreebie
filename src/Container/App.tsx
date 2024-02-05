import React from "react";
import { Header, Footer } from "../Components/Layout";
import { useState, useEffect } from "react";
import { menuItemModel, userModel } from "../Interfaces";
import {
  Home,
  Login,
  MenuItemDetails,
  NotFound,
  Register,
  ShoppingCart,
  AccessDenied,
  Payment,
  MenuItemList,
} from "../Pages";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { setShoppingCart } from "../Storeage/Redux/shoppingCartSlice";
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from "../Storeage/Redux/userAuthSlice";
import { RootState } from "../Storeage/Redux/store";
import {
  AllOrders,
  MyOrders,
  OrderConfirmed,
  OrderDetails,
} from "../Pages/Order";
import MenuItemUpsert from "../Pages/MenuItem/MenuItemUpsert";

function App() {
  const dispatch = useDispatch();

  const [skip, setSkip] = useState(false);

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
    skip: skip,
  });

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data]);

  useEffect(() => {
    if (userData.id) {
      setSkip(false);
    }
  }, [userData]);

  return (
    <div>
      <Header></Header>
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/shoppingCart"
            element={<ShoppingCart></ShoppingCart>}
          ></Route>
          <Route
            path="/menuItemDetails/:menuItemId"
            element={<MenuItemDetails></MenuItemDetails>}
          ></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route
            path="/accessDenied"
            element={<AccessDenied></AccessDenied>}
          ></Route>
          <Route path="/payment" element={<Payment></Payment>}></Route>
          <Route
            path="/order/orderConfirmed/:orderHeaderId"
            element={<OrderConfirmed></OrderConfirmed>}
          ></Route>
          <Route path="/order/myOrders" element={<MyOrders></MyOrders>}></Route>
          <Route
            path="/order/allOrders"
            element={<AllOrders></AllOrders>}
          ></Route>
          <Route
            path="/order/orderDetails/:orderHeaderId"
            element={<OrderDetails></OrderDetails>}
          ></Route>
          <Route
            path="/menuItem/menuItemList"
            element={<MenuItemList></MenuItemList>}
          ></Route>
          <Route
            path="/menuItem/menuItemUpsert"
            element={<MenuItemUpsert></MenuItemUpsert>}
          ></Route>
          <Route
            path="/menuItem/menuItemUpsert/:menuItemId"
            element={<MenuItemUpsert></MenuItemUpsert>}
          ></Route>
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
