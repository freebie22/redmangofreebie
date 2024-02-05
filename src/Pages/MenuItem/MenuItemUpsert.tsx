import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
} from "../../Apis/menuItemApi";
import { inputHelper, toastNotify } from "../../Helper";
import { apiResponse } from "../../Interfaces";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories } from "../../Utility/SD";

const Categories = [
  SD_Categories.APPETIZER,
  SD_Categories.BEVERAGES,
  SD_Categories.DESSERT,
  SD_Categories.ENTREE
]

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};



function MenuItemUpsert() {
  const { menuItemId } = useParams();

  const {data, isLoading} = useGetMenuItemByIdQuery(menuItemId);

  const [updateMenuItem] = useUpdateMenuItemMutation();

  useEffect(() => {
    if(data && data.result){
      const tempData = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };

      setMenuItemInputs(tempData);
      setImageToDisplay(data.result.image);
    }
  }, [data])

  const [imageToStore, setImageToStore] = useState<any>();

  const [imageToDisplay, setImageToDisplay] = useState<any>();

  const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);

  const navigate = useNavigate();

  const [createMenuItem] = useCreateMenuItemMutation();

  const [loading, setIsLoading] = useState<boolean>();

  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, menuItemInputs);
    setMenuItemInputs(tempData);
    console.log(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpg", "jpeg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return (e = imgType);
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File must be in jpeg, jpg or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!imageToStore && !menuItemId) {
      toastNotify("Please, upload an image.", "error");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("Name", menuItemInputs.name);
    formData.append("Description", menuItemInputs.description);
    formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
    formData.append("Category", menuItemInputs.category);
    formData.append("Price", menuItemInputs.price);
    if(imageToDisplay) formData.append("File", imageToStore);

    let response;

    if(menuItemId)
    {
      formData.append("Id", menuItemId);
      response = await updateMenuItem({data:formData, id:menuItemId});
      console.log(response);
      toastNotify("Menu item updated successfully", "success");
      setIsLoading(false);
      navigate("/menuItem/menuItemList");
    }
    else
    {
      response = await createMenuItem(formData);
      console.log(response);
      toastNotify("Menu item created successfully!", "success");
      setIsLoading(false);
      navigate("/menuItem/menuItemList");
    }

    setIsLoading(false);
  };


  return (
    <div>
      {loading && <MainLoader></MainLoader>}
      {!loading && (
        <div className="container border mt-5 p-5 bg-light">
          <h3 className="px-2 text-success">{
            menuItemId ? "Update Menu Item" : "Add Menu Item"
          }</h3>
          <form
            method="post"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="row mt-3">
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  required
                  name="name"
                  value={menuItemInputs.name}
                  onChange={handleMenuItemInput}
                />
                <textarea
                  className="form-control mt-3"
                  placeholder="Enter Description"
                  name="description"
                  onChange={handleMenuItemInput}
                  value={menuItemInputs.description}
                  rows={10}
                ></textarea>
                <input
                  type="text"
                  className="form-control mt-3"
                  placeholder="Enter Special Tag"
                  name="specialTag"
                  value={menuItemInputs.specialTag}
                  onChange={handleMenuItemInput}
                />
                <select
                  className="form-control form-select mt-3"
                  name="category"
                  value={menuItemInputs.category}
                  onChange={handleMenuItemInput}>
                    {Categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <input
                  type="number"
                  className="form-control mt-3"
                  required
                  placeholder="Enter Price"
                  name="price"
                  value={menuItemInputs.price}
                  onChange={handleMenuItemInput}
                />
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="form-control mt-3"
                />

                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn btn-success form-control mt-5"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-secondary form-control mt-5"
                    >
                      Back to Menu Items
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-5 text-center">
                <img
                  src={imageToDisplay}
                  style={{ width: "100%", borderRadius: "30px" }}
                  alt=""
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MenuItemUpsert;
