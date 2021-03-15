const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        // 저장위치 
        destination: (req, file, done) => {
            done(null, "uploads/");
        }, 
        //파일이름 지정
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
            done(null, fileName);
        }
    }),
    limits: { fileSize: 30 * 1024 * 1024},
})

module.exports = { upload };