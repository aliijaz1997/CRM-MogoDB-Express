import { createApi } from "@reduxjs/toolkit/query/react";
import { UserType } from "../../types";
import { baseQueryWithReauth } from "../common/baseQuery";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserType[], any>({
      query: () => {
        return {
          url: `user`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
    getUserById: builder.query<UserType, { id: string }>({
      query: ({ id }) => {
        return {
          url: `user/${id}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
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
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<any, { body: Partial<UserType> }>({
      query: ({ body }) => ({
        url: `user`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "Users"],
    }),
    deleteUser: builder.mutation<any, { id: string }>({
      query: (body) => ({
        url: `user`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    temporaryAuth: builder.mutation<{ token: string }, { id: string }>({
      query: (body) => ({
        url: `user/auth`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});
export const {
  useAddUserMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useTemporaryAuthMutation,
} = apiSlice;
