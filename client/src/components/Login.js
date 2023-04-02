import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { isEmail } from "validator";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import jwt_decode from "jwt-decode";

import moment from "moment";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const Login = () => {
  let navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(email, password).then(
        () => {
          const token = localStorage.getItem("user");
          let decoded = jwt_decode(token);

          if (decoded.result.status === "Blocked") {
            AuthService.logout();
            navigate("/login");
            window.location.reload();
          } else {
            let lastLoginDate = moment().format("YYYY-MM-DD");
            UserService.updateUser(
              lastLoginDate,
              decoded.result.status,
              decoded.result.id
            );
            navigate("/profile");
            window.location.reload();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              type="text"
              className="form-control"
              name="email"
              value={email}
              onChange={onChangeEmail}
              validations={[required, validEmail]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Login;
