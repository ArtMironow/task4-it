import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://13.50.238.216/api/auth/";

const getUsers = () => {
  return axios.get(API_URL + "getusers").then((response) => {
    return response.data;
  });
};

const updateUser = (lastLoginDate, status, id) => {
  return axios
    .patch(API_URL + "update", { lastLoginDate, status, id })
    .then((response) => {
      return response.data;
    });
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const UserService = {
  getUsers,
  getUserBoard,
  updateUser,
};

export default UserService;
