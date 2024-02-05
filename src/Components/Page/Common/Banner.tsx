import React, { useEffect } from "react";
import "./banner.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchItem } from "../../../Storeage/Redux/menuItemSlice";
import { RootState } from "../../../Storeage/Redux/store";

function Banner() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const searchValue = useSelector((state: RootState) => state.menuItemStore.search);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    dispatch(setSearchItem(e.target.value));
  };

  return (
    <div className="custom-banner">
      <div
        className="m-auto d-flex align-items-center"
        style={{
          width: "400px",
          height: "50vh",
        }}
      >
        <div className="d-flex align-items-center" style={{ width: "100%" }}>
          <input
            onChange={handleChange}
            type="text"
            className="form-control rounded-pill"
            style={{
              width: "100%",
              padding: "20px 20px",
            }}
            value={value}
            placeholder="Search for Food Items!"
          />
          <span style={{ position: "relative", left: "-43px" }}>
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
