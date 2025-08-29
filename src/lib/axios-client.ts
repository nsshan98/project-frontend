
import { doUserLogOut } from "@/action/auth";
import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosClient = axios.create({
  baseURL: baseURL,
});

const getAccessToken = async () => {
  const session = await getSession();
  return session?.accessToken;
};

axiosClient.interceptors.request.use(async (request) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  return request;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(`error`, error);
    if (error.response.status === 401) {
      doUserLogOut();
    }
    throw error;
  }
);

export { axiosClient };