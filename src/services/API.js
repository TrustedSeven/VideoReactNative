import axios from "axios";

axios.defaults.withCredentials = false;
const apiInstance = axios.create({
  baseURL: "http://livelikeyouaredying.com",
  timeout: 300000,
});
const apiPrefix = "/api/v1";

class API {
  login = async (params) => {
    const response = await apiInstance.post(`${apiPrefix}/user/login`, params);
    console.log('api call result ', response.data)
    return response.data;
  };
  signup = async (params) => {
    let body = params.body;
    const response = await apiInstance.post(`${apiPrefix}/user/signup`, body, {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
    });
    return response.data;
  }
}
export default new API();
