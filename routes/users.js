const express = require('express');
const router = express.Router();
const axios = require('axios');
const sha1 = require('sha1');
const UserService = require('../modjs/service/user_service');
const util = require('../modjs/util');

var userSrv = new UserService();


//将充值和消费记录标记为已读
router.get('/login', function (req, res, next) {
  userSrv.getUserList().then((result) => {
    res.json({
      code: 0,
      data: result
    })
  });
});

module.exports = router;