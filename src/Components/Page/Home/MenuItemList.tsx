import React from "react";
import { useState, useEffect } from "react";
import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { useGetMenuItemsQuery } from "../../../Apis/menuItemApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setMenuItem,
  setSearchItem,
} from "../../../Storeage/Redux/menuItemSlice";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storeage/Redux/store";
import "./custom-button.css";
import { SD_SortTypes } from "../../../Utility/SD";
function MenuItemList() {
  const { data, isLoading } = useGetMenuItemsQuery(null);

  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);

  const dispatch = useDispatch();

  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);

  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFIlters(
        sortName,
        selectedCategory,
        searchValue
      );
      setMenuItems(tempMenuArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      // fetch("https://freebieredmangoapi.azurewebsites.net/api/MenuItem")
      //   .then((response) => response.json())
      //   .then((data) => {
      //     setMenuItems(data.result);
      //   });
      dispatch(setMenuItem(data.result));
      setMenuItems(data.result);
      const tempCategoryList = ["All"];
      data.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });

      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFIlters(
      sortOptions[i],
      selectedCategory,
      searchValue
    );
    setMenuItems(tempArray);
  };

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategory(localCategory);
        const tempArray = handleFIlters(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  const handleFIlters = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    let tempArray =
      category === "All"
        ? [...data.result]
        : data.result.filter((item: menuItemModel) => {
            return item.category.toUpperCase() === category.toUpperCase();
          });
    // //serach function
    if (search) {
      tempArray = tempArray.filter((item: menuItemModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    //sort function
    if (sortType === SD_SortTypes.PRICE_LOW_HIGH) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => a.price - b.price);
    }

    if (sortType === SD_SortTypes.PRICE_HIGH_LOW) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => b.price - a.price);
    }

    if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort(
        (a: menuItemModel, b: menuItemModel) =>
          a.name.toUpperCase().charCodeAt(0) -
          b.name.toUpperCase().charCodeAt(0)
      );
    }

    if (sortType === SD_SortTypes.NAME_Z_A) {
      tempArray.sort(
        (a: menuItemModel, b: menuItemModel) =>
          b.name.toUpperCase().charCodeAt(0) -
          a.name.toUpperCase().charCodeAt(0)
      );
    }

    return tempArray;
  };

  if (isLoading) {
    return <MainLoader></MainLoader>;
  }
  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-1oo d-flex justify-content center">
          {categoryList.map((category: string, index: number) => (
            <li key={index} className="nav-item text-center">
              <button
                onClick={() => handleCategoryClick(index)}
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => {
                return (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleSortClick(index)}
                  >
                    {sortType}
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </div>
      {menuItems.length > 0 &&
        menuItems.map((item: menuItemModel, index: number) => {
          return <MenuItemCard menuItem={item} key={index}></MenuItemCard>;
        })}
    </div>
  );
}

export default MenuItemList;
