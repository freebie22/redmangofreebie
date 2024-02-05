import React from "react";
import { SDRoles } from "../Utility/SD";
import { useState } from "react";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../Apis/authApi";
import { apiResponse } from "../Interfaces";
import { MiniLoader } from "../Components/Page/Common";
import { useNavigate } from "react-router-dom";

function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
    email: ""
  });

  const navigate = useNavigate();
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
      email: userInput.email
    });
    if(response.data && response.data.isSuccess)
    {
        toastNotify("Registration is complete!. Please login to continue.");
        navigate("/login");
    }
    else if (response.error)
    {
        toastNotify(response.error.data.errorMessages[0], "error");
    }


    setLoading(false);
  };
  return (
    <div className="container text-center">
      <form onSubmit={handleSubmit} method="post">
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              name="userName"
              required
              value={userInput.userName}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={userInput.name}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email"
              name="email"
              value={userInput.email}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              name="password"
              required
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              required
              value={userInput.role}
              onChange={handleUserInput}
              name="role"
            >
              <option value="">--Select Role--</option>
              <option value={`${SDRoles.CUSTOMER}`}>Customer</option>
              <option value={`${SDRoles.ADMIN}`}>Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-success">
            {isLoading ? (<div>
              <MiniLoader></MiniLoader>
            </div>) : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
