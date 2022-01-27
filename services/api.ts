import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue: { onSuccess: (token: string) => void; onFailure: (err: AxiosError<any, any>) => void; }[] = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
})

api.defaults.headers.common["Authorization"] =
  `Bearer ${cookies["nextauth.token"]}`;

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if (error.response?.status === 401) {
    if (error.response.data?.code === "token.expired") {
      cookies = parseCookies();

      const { "nextauth.refreshToken": refreshToken } = cookies;
      const originalConfig = error.config;
      if (!isRefreshing) {
        api.post("/refresh", {
          refreshToken
        }).then(response => {
          const { token } = response?.data;
  
          setCookie(undefined, "nextauth.token", token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
          })
          setCookie(undefined, "nextauth.refreshToken", response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
          })
  
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          failedRequestQueue.forEach(request => request.onSuccess(token))

          failedRequestQueue = []
  
        }).catch(err => {
          failedRequestQueue.forEach(request => request.onFailure(err))

          failedRequestQueue = []
        }).finally(() => {
          isRefreshing = false;
        })
      }
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (token: string) => {
            if(!originalConfig?.headers) {
              return
            }
          
            originalConfig.headers["Authorization"] = `Bearer ${token}`
          
            resolve(api(originalConfig))
          },
          onFailure: (err: AxiosError) => {
            reject(err)
          }
        })
      });
    } else {

    }
  }
})