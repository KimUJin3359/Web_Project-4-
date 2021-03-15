const express = require('express');
const { route } = require('./user');

const db = require('../models/index');
const { upload } = require('../utils/multer');
const { sequelize } = require('../models');
const Seq = require('sequelize');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const { compare } = require('bcrypt');

const router = express.Router();


// 전체방 가져오기 (get)
router.get('/', async (req, res) => {
    try {
        const roomInformations = await db["room"].findAll({
            include: [{ model: db["room_image"] }, { model: db["room_option"] }],
            where: {
                location: {
                    [Seq.Op.like]: req.query.search ? `%${req.query.search}%` : `%%`
                }
            }
        });
        const makeImageUrl = id => `${req.protocol}://${req.get("host")}/api/room/image/${id}/`
        const plainInformation = roomInformations.map((el) => el.get({ plain: true }));
        const result = plainInformation.map(li => {
            if (li['room_images'].length) {
                li['room_images'] = li['room_images'].map(image => {
                    console.log(makeImageUrl(image.id));
                    return { ...image, url: makeImageUrl(image.id) };
                })
            }
        });
        return res.json(plainInformation);
    } catch (error) {
        console.log(error);
        return res.json({ status: "ERROR" })
    }
})

// 방 정보 받아오기 (get)
router.get('/:id', async (req, res) => {
    try {
        const roomInformation = await db["room"].findOne({
            include: [{ model: db["room_image"] }, { model: db["room_option"] }],
            where: {
                id: req.params.id,
            }
        })
        return res.json(roomInformation.dataValues);
    } catch (error) {
        console.log(error);
        return res.json({ status: "ERROR" })
    }
})

// 이미지 받아오기 (get)
router.get('/image/:id', async (req, res) => {
    try {
        const roomImage = await db["room_image"].findOne({
            where: {
                id: req.params.id
            }
        });
        if (roomImage.dataValues && roomImage.dataValues['file_name']) {
            res.set('Content-Disposition', 'inline; filename=profile.png');
            const file = fs.createReadStream(`uploads/${roomImage.dataValues['file_name']}`);
            return file.pipe(res);
        }
        else {
            return res.json({ status: "IMAGE LOAD ERROR"});
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: "ERROR" })
    }
})

// 방 정보 작성하기 (post)

// rooms table
// price, room_size, title, content, location, latitude, longitude를 받아야 됨
// 작성자 id(decoded)

// room_images table
// room_id, file_name, original_file_name

// room_options table
// room_id, item
router.post('/', verifyToken, upload.array("room_image"), async (req, res) => {
    // 모든 정보에 문제가 없을 때만, 데이터를 삽입하기 위해 transaction 사용
    const transaction = await sequelize.transaction();

    try {
        const { price, room_size, room_type, title, content, location, latitude, longitude, item } = req.body;
        // console.log(req.body);
        // room create로 db에 insert

        // 작성된 room의 id를 기반으로 room_image와 room_option을 넣어야 함
        const room = await db["room"].create({
            title,
            content,
            room_type,
            room_size,
            location,
            content,
            latitude,
            longitude,
            price,
            user_id: req.decoded.id,
        }, {
            transaction: transaction
        });
        // item이 1개일 때 하나로 넘어옴
        // item이 여러개일 때 배열로 넘어옴

        // room option table
        if (item) {
            if (typeof item === "string") {
                await db["room_option"].create({
                    item: item,
                    room_id: room.dataValues.id
                }, {
                    transaction: transaction
                })
            }
            else {
                await Promise.all(
                    item.map(async li => {
                        await db["room_option"].create({
                            item: li,
                            room_id: room.dataValues.id
                        }), {
                            transaction: transaction
                        }
                    })
                )
            }
        }

        // room image table
        if (req.files) {
            await Promise.all(
                req.files.map(async li => {
                    console.log(li);
                    await db["room_image"].create({
                        file_name: li.filename,
                        original_file_name: li.originalname,
                        room_id: room.dataValues.id
                    }), {
                        transaction: transaction
                    }
                })
            )
        }

        // 모든 요청이 성공적으로 진행되면 commit을 통해 일괄 db 삽입
        transaction.commit();
        return res.json({ status: "OK" })
    } catch (error) {
        // db에 올라가지 않게 처리
        console.log(error);
        transaction.rollback();
        // 에러가 발생했는데, 이미지가 올라가는 경우 삭제 처리
        if (req.files) {
            req.files.forEach(li => {
                // console.log(li.path);
                fs.unlink(li.path, err => {
                    console.log(err);
                });
            });
        };
        return res.json({ status: "ERROR" });
    }
})

// 방 정보 업데이트 (patch)
router.patch('/:id', async (req, res) => {
    try {
        return res.json({ hello: "world" })
    } catch (error) {
        return res.json({ hello: "error" })
    }
})

// 방 정보 삭제 (delete)
router.delete('/:id', async (req, res) => {
    try {
        return res.json({ hello: "world" })
    } catch (error) {
        return res.json({ hello: "error" })
    }
})

module.exports = router;