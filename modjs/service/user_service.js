var Dao = require('../dao/user_dao.js');

module.exports = class Engine {
    constructor() {
        this.dao = new Dao();
    }
    //获取所有客户信息
    getUserList() {
        return this.dao.getUserList();
    }
}