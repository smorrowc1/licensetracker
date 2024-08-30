//const mysql = require('mysql');

const sql = require("msnodesqlv8");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};Server=AWS-SQL2022LAB;Database=Morrow;Trusted_Connection=yes;";

sql.open(connectionString, (err, conn) => {
  if (err) {
    console.log("Failed to connect to Database");
  }
  //console.log('db' + connnection.state);
});

class dbService {
  static getDbServiceInstance() {
    // if instance is not "null" create new instance "dbService()"
    return instance ? instance : new dbService();
  }

  async getAllData() {
    try {
      // if query is successful we resolve it,
      // otherwise it will be rejected
      const response = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM License_Tracker`;

        sql.open(connectionString, (err, conn) => {
          conn.query(query, (err, results) => {
            if (err) {
              reject(new Error(err.message));
              resolve(results);
            } else {
              //console.log("getAllData - return (conn.query):" + results);
              //response.send(results);
            }
            //response.send(results);
            conn.close();
          });
        });
      });
      //console.log("getAllData (response):" + response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Licenses (LicenseId, LicenseKey, Type, Activation_Date, Expiration_Date, Owning_org, OEM, Channel_Partner, Number_of_devices_users_supported, Cost_per_unit

  async insertNewName(name) {
    console.log("insertNewName():" + name);
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO License_Tracker (LicenseId, LicenseKey, Type, Activation_Date, Expiration_Date, Owning_org, OEM, Channel_Partner, Number_of_devices_users_supported, Cost_per_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        console.log("Before SQL Query:");

        sql.open(connectionString, (err, conn) => {
          conn.query(
            query,
            [
              4,
              name,
              "Tech",
              "2024-08-27",
              "2024-10-31",
              "Amazon",
              "HubSpot",
              "Vendor",
              12,
              125.0,
            ],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
              console.log("insertNewName(): After Query " + result);
            }
          );
          //console.log("insertNewName(): " + result);
        });
      });
      return {
        LicenseId: insertId,
        LicenseKey: name,
        Activation_Date: dateAdded,
      };
      //console.log(insertId);
      //return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM License_Tracker WHERE LicenseId = ?";

        sql.open(connectionString, (err, conn) => {
          // Delete worked here just by using [id]
          conn.query(query, [id], (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateNameById(id, name) {
    console.log("updateNameById (id, name):" + id + name);
    try {
      //id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE License_Tracker SET LicenseKey = ? WHERE LicenseId = ?";

        sql.open(connectionString, (err, conn) => {
          conn.query(query, [name, id], (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        sql.open(connectionString, (err, conn) => {
          const query = "select * FROM License_Tracker WHERE LicenseKey = ?";

          conn.query(query, [name], (err, results) => {
            if (err) reject(new Error(err.message));
            resolve(results);

            //console.log("searchByName():" + results);
            //return results;
          });
        });
      });

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = dbService;
