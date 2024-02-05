import React from "react";
import { NavLink } from "react-router-dom";
import cartItemModel from "../../Interfaces/cartItemModel";
import { useSelector } from "react-redux";
import { RootState } from "../../Storeage/Redux/store";
import { userModel } from "../../Interfaces";
import { useDispatch } from "react-redux";
import {
  emptyUserState,
  setLoggedInUser,
} from "../../Storeage/Redux/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { SDRoles } from "../../Utility/SD";
let logo = require("../../Assets/Images/mango.png");

const Header = () => {
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              style={{ height: "40px" }}
              alt=""
              className="m-1"
            ></img>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              {userData && userData.role === SDRoles.ADMIN ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin Panel
                  </a>
                  <ul className="dropdown-menu">
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("order/myOrders")}
                      style={{cursor: "pointer"}}
                    >
                      My Orders
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("order/allOrders")}
                      style={{cursor: "pointer"}}
                    >
                      All Orders
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("/menuItem/menuItemList")}
                      style={{cursor: "pointer"}}
                    >
                      Menu Items
                    </li>
                    <li className="dropdown-divider">
                      <hr></hr>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/order/myOrders"
                  >
                    Orders
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/shoppingCart"
                >
                  <i className="bi bi-cart"></i>
                  &nbsp;
                  {userData.id && `(${shoppingCartFromStore.length})`}
                </NavLink>
              </li>
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                {userData.id ? (
                  <div style={{ display: "flex" }}>
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          border: 0,
                        }}
                      >
                        Welcome, {userData.fullName}!
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </div>
                ) : (
                  <div className="d-flex">
                    <li className="nav-item">
                      <NavLink to="/register">
                        <button
                          className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                          style={{
                            border: "none",
                            height: "40px",
                            width: "100px",
                          }}
                        >
                          Register
                        </button>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/login">
                        <button
                          className="btn btn-warning btn-outlined rounded-pill text-white mx-2"
                          style={{
                            border: "none",
                            height: "40px",
                            width: "100px",
                          }}
                        >
                          Login
                        </button>
                      </NavLink>
                    </li>
                  </div>
                )}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
