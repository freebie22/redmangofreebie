import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetMenuItemByIdQuery } from "../Apis/menuItemApi";
import { setMenuItem } from "../Storeage/Redux/menuItemSlice";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { useUpdateShoppingCartMutation } from "../Apis/shoppingCartApi";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import { apiResponse, userModel } from "../Interfaces";
import { toastNotify } from "../Helper";
import { RootState } from "../Storeage/Redux/store";

//USER ID - 8bb67032-d84c-4e42-8911-10660832bac1

function MenuItemDetails() {
  const { menuItemId } = useParams();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useGetMenuItemByIdQuery(menuItemId);

  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const [updateShoppingCart] = useUpdateShoppingCartMutation();

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (quantity >= 1) {
      setQuantity(newQuantity);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = async (menuItemId: number) => {
    if (!userData.id) {
      navigate("/login");
    } else {
      setIsAddingToCart(true);

      const response: apiResponse = await updateShoppingCart({
        menuItemId: menuItemId,
        updateQuantityBy: quantity,
        userId: userData.id,
      });

      if (response.data && response.data.isSuccess) {
        toastNotify("Item added to cart successfully!");
      }


      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.result));
    }
  }, [isLoading]);

  if (isLoading) {
    return <MainLoader></MainLoader>;
  }

  return (
    <div className="container pt-4 pt-md-5">
      <div className="row">
        <div className="col-7">
          <h2 className="text-success">{data.result.name}</h2>
          <span>
            <span
              className="badge text-bg-dark pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.result.category}
            </span>
          </span>
          <span>
            <span
              className="badge text-bg-light pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.result.specialTag}
            </span>
          </span>
          <p style={{ fontSize: "20px" }} className="pt-2">
            {data.result.description}
          </p>
          <span className="h3">{data.result.price}$</span> &nbsp;&nbsp;&nbsp;
          <span
            className="pb-2  p-3"
            style={{ border: "1px solid #333", borderRadius: "30px" }}
          >
            <i
              className="bi bi-dash p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={() => handleQuantity(-1)}
            ></i>
            <span className="h3 mt-3 px-3">{quantity}</span>
            <i
              className="bi bi-plus p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={() => handleQuantity(1)}
            ></i>
          </span>
          <div className="row pt-4">
            <div className="col-5">
              {isAddingToCart ? (
                <button disabled className="btn btn-success form-control">
                  <MiniLoader></MiniLoader>
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(data.result.id)}
                  className="btn btn-success form-control"
                >
                  Add to Cart
                </button>
              )}
            </div>

            <div className="col-5 ">
              <Link to="/">
                <button className="btn btn-secondary form-control">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-5">
          <img
            src={data.result.image}
            width="100%"
            style={{ borderRadius: "50%" }}
            alt="No content"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default MenuItemDetails;
