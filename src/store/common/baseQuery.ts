import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { BaseUrl } from "../../utils/baseUrl";
import auth from "../../utils/firebase";
import { logoutRedux, updateToken } from "../slice/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    //try to get a new token
    const currentUser = auth.currentUser;
    const refreshToken = await currentUser?.getIdToken(true);
    if (refreshToken) {
      // store the new token
      api.dispatch(updateToken(refreshToken));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutRedux());
    }
  }
  return result;
};
