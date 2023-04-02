import axios from "axios";

const API_URL = "https://13.50.238.216/api/auth/";

const deleteSelected = (id) => {
  return axios.delete(API_URL + `delete/${id}`).then((response) => {
    console.log(response);
  });
};

const register = (
  username,
  email,
  password,
  registrationDate,
  lastLoginDate,
  status
) => {
  return axios
    .post(API_URL + "signup", {
      username,
      email,
      password,
      registrationDate,
      lastLoginDate,
      status,
    })
    .then(login(email, password));
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.success === 1) {
        localStorage.setItem("user", JSON.stringify(response.data.token));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  deleteSelected,
};

export default AuthService;
