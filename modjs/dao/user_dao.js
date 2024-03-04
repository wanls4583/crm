var db = require('../db/db.js');
module.exports = class DAO {
    constructor() {}
    
    getUserList(KHDMs) {
        return db.query('select * from user');
    }
}