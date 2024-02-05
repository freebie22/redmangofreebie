import React, { useState } from "react";
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from "../../Apis/menuItemApi";
import { apiResponse, menuItemModel } from "../../Interfaces";
import { MainLoader } from "../../Components/Page/Common";
import { useNavigate } from "react-router-dom";
import { toastNotify } from "../../Helper";

function MenuItemList() {

  const { data, isLoading } = useGetMenuItemsQuery(null);

  const [loading, setIsLoading] = useState<boolean>();

  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const navigate = useNavigate();

  const handleDelete = async (menuItemId:number) => {
    setIsLoading(true);

    const response: apiResponse = await deleteMenuItem(menuItemId);

    console.log(response);

    toastNotify("Item was successfully deleted.", "success");

    setIsLoading(false);
}

  return (
    <div>
      {isLoading && <MainLoader></MainLoader>}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">MenuItem List</h1>
            <button onClick={() => navigate(`/menuItem/menuItemUpsert`)} className="btn btn-success">Add New Menu Item</button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-2 text-center">Image</div>
              <div className="col-1 text-center">ID</div>
              <div className="col-2 text-center">Name</div>
              <div className="col-2 text-center">Category</div>
              <div className="col-1 text-center">Price</div>
              <div className="col-2 text-center">Special Tag</div>
              <div className="col-1 text-center">Action</div>
            </div>
            {data.result.map((item: menuItemModel, index: number) => (
              <div key={index} className="row border">
                <div className="col-2 text-center">
                  <img
                    src={`${item.image}`}
                    alt="no content"
                    style={{ width: "100%", maxWidth: "120px" }}
                  />
                </div>
                <div className="col-1 text-center">{item.id}</div>
                <div className="col-2 text-center">{item.name}</div>
                <div className="col-2 text-center">{item.category}</div>
                <div className="col-1 text-center">{item.price}$</div>
                <div className="col-2 text-center">
                  {item.specialTag ? item.specialTag : "No tag"}
                </div>
                <div className="col-1 text-center">
                  <button onClick={() => navigate(`/menuItem/menuItemUpsert/${item.id}`)} className="btn btn-success">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button disabled={loading} onClick={() => handleDelete(item.id)} className="btn btn-danger mx-2">
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuItemList;
