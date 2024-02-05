import React, { useState } from "react";
import orderSummaryProps from "./orderSummaryProps";
import { cartItemModel, menuItemModel, userModel } from "../../../Interfaces";
import { getStatusColor } from "../../../Helper";
import { useNavigate } from "react-router-dom";
import { SDRoles, SD_Status } from "../../../Utility/SD";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storeage/Redux/store";
import { useUpdateOrderHeaderMutation } from "../../../Apis/orderApi";
import { MainLoader } from "../Common";

function OrderSummary({ data, userInput }: orderSummaryProps) {
  const badgeTypeColor = getStatusColor(data.status!);
  const navigate = useNavigate();

  const [updateOrderHeader] = useUpdateOrderHeaderMutation();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const nextStatus: any =
    data.status! === SD_Status.CONFIRMED
      ? { color: "info", value: SD_Status.BEING_COOKED }
      : data.status! === SD_Status.BEING_COOKED
      ? { color: "warning", value: SD_Status.READY_FOR_PICKUP }
      : data.status! === SD_Status.READY_FOR_PICKUP && {
          color: "success",
          value: SD_Status.COMPLETED,
        };

  const [isLoading, setIsloading] = useState(false);
  const handleCancel = async () => {
    setIsloading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: SD_Status.CANCELLED,
    });
    setIsloading(false);
  };

  const handleNextStatus = async () => {
    setIsloading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: nextStatus.value,
    });
    setIsloading(false);
  };

  return (
    <div>
      {" "}
      {isLoading && <MainLoader></MainLoader>}
      {!isLoading && (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-success">Order Summary</h3>
            <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>
              {data.status}
            </span>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name : {userInput.name} </div>
            <div className="border py-3 px-2">Email : {userInput.email} </div>
            <div className="border py-3 px-2">
              Phone : {userInput.phoneNumber}{" "}
            </div>
            <div className="border py-3 px-2">
              <h4 className="text-success">Menu Items</h4>
              <div className="p-3">
                {data.cartItems?.map((item: cartItemModel, index: number) => {
                  return (
                    <div key={index} className="d-flex">
                      <div className="d-flex w-100 justify-content-between">
                        <p>{item.menuItem?.name}</p>
                        <p>
                          ${item.menuItem?.price} x {item.quantity} ={" "}
                        </p>
                      </div>
                      <p style={{ width: "70px", textAlign: "right" }}>
                        {(item.menuItem!.price * item.quantity!).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
                <hr />
                <h4 className="text-danger" style={{ textAlign: "right" }}>
                  ${data.cartTotal?.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back to orders
            </button>
            {userData.role === SDRoles.ADMIN && (
              <div className="d-flex">
                {data.status! !== SD_Status.CANCELLED &&
                  data.status! !== SD_Status.COMPLETED && (
                    <>
                      <button
                        onClick={handleCancel}
                        className="btn btn-danger mx-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNextStatus}
                        className={`btn btn-${nextStatus.color}`}
                      >
                        {nextStatus.value}
                      </button>
                    </>
                  )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderSummary;
