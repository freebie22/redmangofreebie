import React, { useState, useEffect } from "react";
import cartItemModel from "../../../Interfaces/cartItemModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storeage/Redux/store";
import { inputHelper } from "../../../Helper";
import { MiniLoader } from "../Common";
import { apiResponse, userModel } from "../../../Interfaces";
import { useInitiatePaymentMutation } from "../../../Apis/paymentApi";
import { useNavigate } from "react-router-dom";

function CartPickUpDetails() {
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  let grandTotal = 0;
  let totalItems = 0;

  const initialUserData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
  };

  shoppingCartFromStore?.map((cartItem: cartItemModel) => {
    grandTotal += (cartItem.quantity ?? 0) * (cartItem.menuItem?.price ?? 0);
    totalItems += cartItem.quantity ?? 0;
    return null;
  });

  const [userInput, setUserInput] = useState(initialUserData);

  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);

  const [initiatePayment] = useInitiatePaymentMutation();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data }: apiResponse = await initiatePayment(userData.id);
    // const orderSummary = {grandTotal, totalItems};
    navigate("/payment", {
      state: { apiResult: data?.result, userInput /*orderSummary*/ },
    });
  };

  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form onSubmit={handleSubmit} className="col-10 mx-auto">
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            className="form-control"
            placeholder="name..."
            value={userInput.name}
            onChange={handleUserInput}
            name="name"
            required
          />
        </div>
        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            className="form-control"
            value={userInput.email}
            placeholder="email..."
            name="email"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="number"
            className="form-control"
            value={userInput.phoneNumber}
            placeholder="phone number..."
            onChange={handleUserInput}
            name="phoneNumber"
            required
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : ${grandTotal}</h5>
            <h5>№ of items : {totalItems}</h5>
          </div>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
        >
          {loading ? <MiniLoader></MiniLoader> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
  );
}

export default CartPickUpDetails;
