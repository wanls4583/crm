const mysql = require('mysql');
let dbConfig = {
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'crm'
};
if (process.env.NODE_ENV == 'production') {

}
const poolConnect = mysql.createPool(dbConfig);
module.exports = {
    query(sql, sqlParams) {
        return new Promise((resolve, reject) => {
            poolConnect.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                connection.query(sql, sqlParams, function (err, result) {
                    if (err) {
                        connection.release();
                        reject(err);
                        return;
                    }
                    resolve(result);
                    connection.release();
                });
            });
        })
    },
}