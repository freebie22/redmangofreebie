import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
  reducerPath: "menuItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://freebieredmangoapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    }
  }),
  tagTypes: ["MenuItems"],
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: () => ({
        url: "menuitem",
      }),
      providesTags: ["MenuItems"],
    }),
    getMenuItemById: builder.query({
      query: (id) => ({
        url: `menuitem/${id}`,
      }),
      providesTags: ["MenuItems"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ data, id }) => ({
        method: "PUT",
        url: "menuItem/" + id,
        body: data,
      }),
      invalidatesTags: ["MenuItems"],
    }),
    createMenuItem: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "menuItem",
        body: data,
      }),
      invalidatesTags: ["MenuItems"],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: "menuItem/" + id
      }),
      invalidatesTags: ["MenuItems"],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuItemApi;
export default menuItemApi;
