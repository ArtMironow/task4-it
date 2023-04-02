import React from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { useEffect, useState } from "react";

import { Icon } from "react-icons-kit";
import { lock } from "react-icons-kit/icomoon/lock";
import { unlocked } from "react-icons-kit/icomoon/unlocked";
import { bin } from "react-icons-kit/icomoon/bin";

import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  let navigate = useNavigate();

  const [usersData, setData] = useState("");

  const [dataId, setDataId] = useState("");

  useEffect(() => {
    UserService.getUsers().then(
      (response) => {
        const token = localStorage.getItem("user");
        let decoded = jwt_decode(token);

        let tmp = response.data.filter((i) => i.id === decoded.result.id);

        if (!tmp || tmp[0].status === "Blocked") {
          AuthService.logout();
          navigate("/login");
          window.location.reload();
        }
        setData(response.data);
      },
      (error) => {}
    );
  }, []);

  const chooseCheckbox = (e) => {
    const id = parseInt(e.target.value);
    if (dataId.includes(id)) {
      const idCollection = dataId.filter((x) => x !== id);
      setDataId(idCollection);
    } else {
      const idCollection = [...dataId];
      idCollection.push(id);
      setDataId(idCollection);
    }
  };

  const chooseAllCheckboxes = (e) => {
    if (!e.target.checked) {
      const idCollection = [];
      setDataId(idCollection);
    } else {
      const idCollection = usersData.map((x) => x.id);
      setDataId(idCollection);
    }
  };

  const remove = () => {
    const newList = usersData.filter((item) => dataId.includes(item.id));
    const updatedList = usersData.filter((item) => !dataId.includes(item.id));
    setData(updatedList);

    for (let i = 0; i < newList.length; i++) {
      AuthService.deleteSelected(newList[i].id);
    }

    const token = localStorage.getItem("user");
    console.log(token);
    let decoded = jwt_decode(token);

    if (newList.map((i) => i.id).includes(decoded.result.id)) {
      console.log(decoded.result.id);
      AuthService.logout();
      navigate("/login");
      window.location.reload();
    }
  };

  const block = async () => {
    const blockList = usersData.filter((item) => dataId.includes(item.id));

    for (let i = 0; i < blockList.length; i++) {
      await UserService.updateUser(
        blockList[i].lastLoginDate.substring(0, 10),
        "Blocked",
        blockList[i].id
      );
    }
    window.location.reload();
  };

  const unblock = async () => {
    const unBlockList = usersData.filter((item) => dataId.includes(item.id));

    for (let i = 0; i < unBlockList.length; i++) {
      await UserService.updateUser(
        unBlockList[i].lastLoginDate.substring(0, 10),
        "Unblocked",
        unBlockList[i].id
      );
    }
    window.location.reload();
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3> Users </h3>

        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Delete"
            onClick={remove}
          >
            <Icon icon={bin} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Block"
            onClick={block}
          >
            <Icon icon={lock} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Unblock"
            onClick={unblock}
          >
            <Icon icon={unlocked} />
          </button>
        </div>

        <hr></hr>
        <span>
          <input type="checkbox" onChange={chooseAllCheckboxes} />
        </span>
        <span>&nbsp;check/uncheck all</span>
        <hr></hr>

        <div style={styles.container}>
          {usersData.length === 0 && <h4>Fetching Checkboxes ...</h4>}
          {usersData.length > 0 &&
            usersData.map((item) => (
              <div style={styles.checkbox} key={item.id}>
                <span>
                  <input
                    type="checkbox"
                    value={item.id}
                    onChange={chooseCheckbox}
                    checked={dataId.includes(item.id) ? true : false}
                  />
                </span>
                <span>{item.id}</span>
                <span>{item.username}</span>
                <span>{item.email}</span>
                <span>{item.registrationDate.substring(0, 10)}</span>
                <span>{item.lastLoginDate.substring(0, 10)}</span>
                <span>{item.status}</span>
              </div>
            ))}
        </div>
      </header>
    </div>
  );
};

const styles = {
  checkbox: {
    margin: "10px 0",
    padding: "14px 25px",
    backgroundColor: "rgb(238 237 247)",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    marginTop: 15,
    color: "#ffffff",
    width: "100%",
    cursor: "pointer",
    padding: "15px 30px",
    border: "none",
    fontWeight: "bold",
    backgroundColor: "red",
  },
};

export default Profile;
