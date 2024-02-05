import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://freebieredmangoapi.azurewebsites.net/api/",
        prepareHeaders: (headers: Headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token);
          }
    }),
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
       createOrder : builder.mutation({
        query: (orderDetails) => ({
            url: "order",
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: orderDetails
        }),
        invalidatesTags: ["Orders"]
       }),
       getOrdersByUserId : builder.query({
        query: (userId) => ({
            method: "GET",
            url: "order",
            params: {
                userId
            }
        }),
        providesTags: ["Orders"]
       }),
       getOrderById : builder.query({
        query: (orderId) => ({
            method: "GET",
            url: `order/${orderId}`,
        }),
        providesTags: ["Orders"]
       }),
       updateOrderHeader: builder.mutation({
        query: (orderDetails) => ({
            method: "PUT",
            url: "order/" + orderDetails.orderHeaderId,
            headers: {
                "Content-type" : "application/json"
            },
            body: orderDetails
        }),
        invalidatesTags: ["Orders"]
       })
    })
})

export const { useCreateOrderMutation, useGetOrderByIdQuery, useGetOrdersByUserIdQuery, useUpdateOrderHeaderMutation } = orderApi;
export default orderApi;

