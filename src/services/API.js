import axios from "axios";

axios.defaults.withCredentials = false;
const apiInstance = axios.create({
  baseURL: "https://social360.app/edit/api",
  timeout: 300000,
});
// https://social360.app/edit/api/iniciarSession
const apiPrefix = "/api/v1";

class API {
  login = async (params) => {
    console.log(params);
    // const response = await apiInstance.post(`${apiPrefix}/user/login`, params);
    const response = await apiInstance.post(`/iniciarSession`, params);
    // const response = { data: { result: true } };
    console.log(response.data);
    return response.data;
  };
  signup = async (params) => {
    console.log(params);
    // const response = await apiInstance.post(`${apiPrefix}/user/login`, params);
    const response = await apiInstance.post(`/registrar`, params);
    // const response = { data: { result: true } };
    console.log(response.data);
    return response.data;
  }
}
export default new API();