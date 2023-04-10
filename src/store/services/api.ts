import { createApi } from "@reduxjs/toolkit/query/react";
import { CallLog, Notification, UserType } from "../../types";
import { baseQueryWithReauth } from "../common/baseQuery";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "User", "Notifications", "Calls", "Call"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserType[], void>({
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
      {
        id?: string;
        name: string;
        email: string;
        role: string;
        addedBy?: { name: string; role: string };
      }
    >({
      query: (body) => ({
        url: `user`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Users"],
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
    getNotifications: builder.query<Notification[], null>({
      query: () => {
        return {
          url: `notification`,
          method: "GET",
        };
      },
      providesTags: ["Users", "User", "Notifications"],
    }),
    updateNotification: builder.mutation<any, { body: Partial<Notification> }>({
      query: ({ body }) => ({
        url: `notification`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
    getCallLogs: builder.query<
      { callLogs: CallLog[]; totalLogs: number },
      { page?: number; limit?: number; sort?: string; filter?: string }
    >({
      query: ({ limit, page, sort, filter }) =>
        `/calls?page=${page}&limit=${limit}&sort=${sort}&${filter}`,
      providesTags: ["Calls", "Call"],
    }),
    createCallLog: builder.mutation<CallLog, Partial<CallLog>>({
      query: (callLog) => ({
        url: "/calls",
        method: "POST",
        body: callLog,
      }),
      invalidatesTags: ["Calls"],
    }),
    updateCallLog: builder.mutation<CallLog, Partial<CallLog>>({
      query: ({ _id, ...callLog }) => ({
        url: `/calls/${_id}`,
        method: "PUT",
        body: callLog,
      }),
      invalidatesTags: ["Calls", "Call"],
    }),
    deleteCallLog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/calls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Calls"],
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
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useGetCallLogsQuery,
  useCreateCallLogMutation,
  useUpdateCallLogMutation,
  useDeleteCallLogMutation,
} = apiSlice;
