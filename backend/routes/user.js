const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { upload } = require('../utils/multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const { compare } = require('bcrypt');

// 기능 정의

// 3차 라우터
// /api/user
// 회원 정보 가져오기(get)
// 회원 전체 정보
router.get("/", async (req, res) => {
    try {
        const userInformation = await db["user"].findAll();
        const plainInformation = userInformation.map((el) => el.get({ plain: true }));
        return res.json(plainInformation );
    } catch (error) {
        console.log(error);
        return res.json({ hello: "error" })
    }
})

// 회원 하나의 정보(get)
router.get("/:id", async (req, res) => {
    try {
        const result = await db["user"].findOne({
            attributes: ["id", "name", "email", "profile", "type", "createdAt", "updatedAt"],
            where: {
                id: req.params.id
            }
        });
        return res.json(result);
    } catch (error) {
        return res.json({ hello: "error" })
    }
})

// 프로필 이미지 가져오기(get)
// 다른 사람들도 profile을 볼 수 있어야 되기 때문에 id를 별도로 입력
router.get("/:id/profile", async (req, res) => {
    try {
        const userInformation = await db["user"].findOne({
            attributes: ["id", "profile"],
            where: {
                id: req.params.id
            }
        });
        // console.log(userInformation);
        if (userInformation.dataValues && userInformation.dataValues.profile) {
            //이미지 가져오는 로직
            res.set('Content-Disposition', 'inline; filename=profile.png');
            console.log(userInformation.dataValues.profile);
            const file = fs.createReadStream(`uploads/${userInformation.dataValues.profile}`);

            return file.pipe(res);
        }
        else {
            return res.json({ status: "NO PROFILE" });
        }
    } catch (error) {
        return res.json({ status: "ERROR" })
    }
})

// 회원가입(post)
router.post("/", async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password, type } = req.body;
        const hashedPassword = await hashPassword(password);
        const result = await db["user"].create({
            name,
            email,
            password: hashedPassword,
            type,
        });
        console.log(result);
        return res.json({ status: "OK" })
    } catch (error) {
        return res.json({ status: "ERROR" })
    }
})

// 로그인(post)
router.post("/login", async (req, res) => {
    try {
        // 로직
        // DB에서 맞는지 검증
        // JWT 발행
        // JWT 전달해서 검사
        // JWT 유효한지 확인
        const { email, password } = req.body;
        const userData = await db["user"].findOne({
            attributes: ["id", "password", "name"],
            where: {
                // email: email
                email
            }
        })
        const hashedPassword = userData.dataValues.password;
        const compareResult = await comparePassword(password, hashedPassword);
        // 로그인 성공 시
        if (compareResult) {
            const token = jwt.sign({
                id: userData.dataValues.id
            }, "ujin", {
                expiresIn: "24h"
            });
            return res.json({
                resultCode: 200,
                token: token,
                id: userData.dataValues.id,
                name: userData.dataValues.name
            });
        }
        else {
            return res.json({ status: "PASSWORD ERROR" });
        }
    } catch (error) {
        return res.json({ status: "ERROR" })
    }
})

// 프로필 업로드(post)
router.post("/profile", verifyToken, upload.single("profile"), async (req, res) => {
    // 업로드는 middleware를 통해 multer가 처리

    // 프로필이 이미 있는 경우
    // 해당 id를 기반으로 db에서 데이터를 불러옴
    // 해당 데이터에서 profile이 존재하는 경우
    // 기존의 프로필 삭제
    // uploads에 있는 파일을 삭제
    // db의 profile을 새로운 파일명으로 업데이트

    // 프로필이 없는 경우
    // 업로드
    // db의 profile을 새로운 파일명으로 업로드
    try {
        const userInformation = await db["user"].findOne({
            where: {
                id: req.decoded.id
            }
        });
        // console.log(userInformation.dataValues);
        // 기존의 프로필이 있는 경우를 검증하는 로직
        if (userInformation.dataValues && userInformation.dataValues.profile) {
            // 기존의 프로필 삭제
            fs.unlink(`uploads/${userInformation.dataValues.profile}`, function (error) {
                if (error) {
                    console.log(error);
                }
            })
        }

        await db["user"].update(
            {
                profile: req.file.filename
            },
            {
                where: {
                    id: req.decoded.id
                }
            }
        )

        return res.json({ status: "OK" })
    } catch (error) {
        return res.json({ status: "ERROR" })
    }
})

// 유저 정보 수정(patch)
router.patch("/", verifyToken, async (req, res) => {
    try {
        const { name, password, type } = req.body;
        const userInformation = await db["user"].findOne({
            where: {
                id: req.decoded.id
            }
        });
        const result = await comparePassword(password, userInformation.dataValues.password);
        console.log(result);
        if (result) {
            const update = await db["user"].update({
                name: name,
                type: type
            }, 
            {
                where: {
                    id: req.decoded.id
                }
            })
            return res.json({ status: "OK" })
        }
        return res.json({state : "PASSWORD ERROR"});
        
    } catch (error) {
        console.log(error);
        return res.json({ status: "ERROR" })
    }
})

// 회원탈퇴(delete)
router.delete("/", verifyToken, async (req, res) => {
    try {
        // paranoid true로 실패 데이터가 삭제되지는 않고 deletedAt에 표시됨
        const result = await db["user"].destroy({
            where: {
                id: req.decoded.id
            }
        });
        return res.json({ status: "OK" })
    } catch (error) {
        return res.json({ status: "ERROR" })
    }
})

module.exports = router