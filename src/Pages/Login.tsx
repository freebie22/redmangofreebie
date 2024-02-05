import React from "react";
import { useState } from "react";
import { inputHelper, toastNotify } from "../Helper";
import { useLoginUserMutation } from "../Apis/authApi";
import { useDispatch } from "react-redux";
import { apiResponse, userModel } from "../Interfaces";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from "../Storeage/Redux/userAuthSlice";
import { useSelector } from "react-redux";
import { RootState } from "../Storeage/Redux/store";
import { useNavigate } from "react-router-dom";


function Login() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });


  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const [loginUser] = useLoginUserMutation();

  const handleUserLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password,
    });

    if (response.data) {
      const token = response.data.result["token"];
      const {fullName, id, email, role} : userModel = jwt_decode(token);
      localStorage.setItem("token", token)
      dispatch(setLoggedInUser({fullName, id, email, role} ));
      toastNotify(`Login is successfull. Welcome, ${fullName}!`);
      navigate("/");
    } else if (response.error) {
      setError(response.error.data.errorMessages[0]);
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {isLoading && (<MainLoader></MainLoader>)}
      <form onSubmit={handleSubmit} method="post">
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              name="userName"
              placeholder="Enter Username"
              value={userInput.userName}
              onChange={handleUserLogin}
              required
            />
          </div>

          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              value={userInput.password}
              onChange={handleUserLogin}
              required
            />
          </div>
        </div>

        <div className="mt-2">
          {error ? (
            <div>
              <p className="text-danger">{error}</p>
            </div>
          ) : null}
          <button disabled={isLoading}
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
