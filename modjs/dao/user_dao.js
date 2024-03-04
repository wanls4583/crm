var db = require('../db/db.js');
module.exports = class DAO {
    constructor() {}
    getUserList() {
        return db.query('select * from user');
    }
}