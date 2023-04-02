const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert users(username, email, password, registrationDate, lastLoginDate, status)
                values(?,?,?,?,?,?)`,
      [
        data.username,
        data.email,
        data.password,
        data.registrationDate,
        data.lastLoginDate,
        data.status,
      ],
      (error, result, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, result);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `select id, username, email, password, registrationDate, lastLoginDate, status from users`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUsersByUserId: (id, callBack) => {
    pool.query(
      `select id, username, email, password, registrationDate, lastLoginDate, status from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `update users set lastLoginDate = ?, status = ? where id = ?`,
      [data.lastLoginDate, data.status, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      `delete from users where id = ?`,
      [data],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from users where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
