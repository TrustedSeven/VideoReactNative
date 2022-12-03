import axios from "axios";

axios.defaults.withCredentials = false;
const apiInstance = axios.create({
  baseURL: "https://conducirenperu.com",
  timeout: 300000,
});
const apiPrefix = "/api/v1";

class API {
  login = async (params) => {
    console.log(params);
    const response = await apiInstance.post(`${apiPrefix}/user/login`, params);
    // const response = { data: { result: true } };
    return response.data;
  };
  signup = async (params) => {
    console.log(params);
    // let body = params.body;
    // console.log(body)
    const response = await apiInstance.post(`${apiPrefix}/user/signup`, params, {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
    });
    return response.data;
  }
}
export default new API();