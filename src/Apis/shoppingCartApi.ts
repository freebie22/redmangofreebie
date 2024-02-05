import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
  reducerPath: "shoppingCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://freebieredmangoapi.azurewebsites.net/api/",
  }),
  tagTypes: ["ShoppingCarts"],
  endpoints: (builder) => ({
    getShoppingCart: builder.query({
      query: (userId) => ({
        url: `shoppingcart`,
        params: {
          userId: userId,
        },
      }),
      providesTags: ["ShoppingCarts"],
    }),
    updateShoppingCart: builder.mutation({
      query: ({ menuItemId, updateQuantityBy, userId }) => ({
        url: "shoppingCart",
        method: "POST",
        params: {
            menuItemId, 
            updateQuantityBy, 
            userId
        }
      }),
      invalidatesTags: ["ShoppingCarts"]
    }),
  }),
});

export const { useGetShoppingCartQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;
