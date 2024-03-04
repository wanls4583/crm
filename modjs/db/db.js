const mssql = require('mssql');
let dbConfig = {
    user: 'root',
    password: '12345678',
    server: '127.0.0.1',
    database: 'lisong',
    port: 3306,
    options: {
        encrypt: true // Use this if you're on Windows Azure
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
};
if (process.env.NODE_ENV == 'production') {
    
}
const poolConnect = new mssql.ConnectionPool(dbConfig);
module.exports = {
    query(queryStr, params) {
        var reg = /\?/g;
        var result = reg.exec(queryStr);
        var i = 0;
        while (result) {
            var index = result.index;
            if (typeof params[i] == 'string') {
                params[i] = '\'' + params[i] + '\'';
            }
            queryStr = queryStr.slice(0, index) + params[i] + queryStr.slice(index + 1);
            reg.lastIndex = index + 1 + String(params[i]).length;
            result = reg.exec(queryStr);
            i++;
        }
        return poolConnect.connect().then((pool) => {
            return pool.query(queryStr).then((result) => {
                // pool.close();
                return result;
            });
        });
    },
}