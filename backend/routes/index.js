const express = require('express');
const userRouter = require('./user.js');
const roomRouter = require('./room.js');
const router = express.Router();

// 1차 라우터 /

// htps://localhost:8080/api/user로 시작되는 부분은 모두 userRouter로 간다
// htps://localhost:8080/api/room으로 시작되는 부분은 모두 roomRouter로 간다
// 2차 라우터가 /api/user, /api/room
router.use("/api/user", userRouter)
router.use("/api/room", roomRouter)

module.exports = router;