import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserType } from "../../types";
import { BaseUrl } from "../../utils/baseUrl";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserType[], { token: string }>({
      query: ({ token }) => {
        return {
          url: `user`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
      providesTags: ["Users"],
    }),
    getUserById: builder.query<UserType, { id: string; token: string }>({
      query: ({ id, token }) => {
        return {
          url: `user/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    addUser: builder.mutation<
      any,
      { id: string; name: string; email: string; role: string }
    >({
      query: (body) => ({
        url: `user`,
        method: "POST",
        body,
      }),
    }),
    deleteUser: builder.mutation<any, { id: string; token: string }>({
      query: ({ id, token }) => ({
        url: `user`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: { id },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});
export const {
  useAddUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
} = apiSlice;
