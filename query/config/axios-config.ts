import env from "@/constant/env";
import RefreshTokenResponse from "@/types/response/RefreshTokenResponse";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

export const addRefreshInterceptor = () => {
  const accessToken = localStorage.getItem("access-token");
  if (accessToken) {
    axiosClient.defaults.headers["Authorization"] = "Bearer " + accessToken;
  }

  const refreshInterceptor = axiosClient.interceptors.response.use(
    async (response) => response,
    async (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      // Avoid loop
      axiosClient.interceptors.response.eject(refreshInterceptor);

      const refreshToken = localStorage.getItem("refresh-token");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      return axiosClient
        .post("/auth/refresh-token", {
          refreshToken: refreshToken,
        })
        .then((response) => {
          const { accessToken, refreshToken }: RefreshTokenResponse =
            response.data;
          localStorage.setItem("access-token", accessToken);
          localStorage.setItem("refresh-token", refreshToken);

          error.response.config.headers["Authorization"] =
            "Bearer " + accessToken;

          return axios(error.response.config);
        })
        .catch((error2) => Promise.reject(error2))
        .finally(addRefreshInterceptor);
    },
  );
};

export default axiosClient;
