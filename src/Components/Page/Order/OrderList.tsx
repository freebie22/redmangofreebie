import React from "react";
import OrderListProps from "./orderListType";
import { MainLoader } from "../Common";
import orderHeaderModel from "../../../Interfaces/orderHeaderModel";
import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../Helper";

function OrderList({ isLoading, orderData }: OrderListProps) {
  const navigate = useNavigate();
  return (
    <div>
      {isLoading && <MainLoader></MainLoader>}
      {!isLoading && (
        <div className="table p-5">
          <h1 className="text-success">Orders List</h1>
          <div className="p-2">
            <div className="row border">
              <div className="col-1 text-center">ID</div>
              <div className="col-2 text-center">Name</div>
              <div className="col-2 text-center">Phone</div>
              <div className="col-1 text-center">Total</div>
              <div className="col-1 text-center">Items</div>
              <div className="col-2 text-center">Date</div>
              <div className="col-1 text-center">Status</div>
              <div className="col-1 text-center">Details</div>
              <div className="col-1"></div>
            </div>
            {orderData.result.map((order: orderHeaderModel, index: number) => {
              const badgeColor = getStatusColor(order.status!);
              return (
                <div key={index} className="row border">
                  <div className="col-1 text-center">{order.orderHeaderId}</div>
                  <div className="col-2 text-center">{order.pickupName}</div>
                  <div className="col-2 text-center">{order.pickupPhoneNumber}</div>
                  <div className="col-1 text-center">{order.orderTotal.toFixed(2)}$</div>
                  <div className="col-1 text-center">{order.totalItems}</div>
                  <div className="col-2 text-center">
                    {new Date(order.orderDate!).toLocaleDateString()}
                  </div>
                  <div className="col-2 text-center">
                    <span className={`badge bg-${badgeColor}`}>{order.status}</span>
                  </div>
                  <div className="col-1 text-center">
                    <button
                      onClick={() =>
                        navigate("/order/orderDetails/" + order.orderHeaderId)
                      }
                      className="btn btn-success"
                    >
                      Details
                    </button>
                  </div>
                  <div className="col-1"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;
