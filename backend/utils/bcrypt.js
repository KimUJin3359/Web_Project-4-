const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async(password) => {
    try {
        //소금 생성기
        // 이유 -> 해커가 암호를 유추할 수 없도록 의미 없는 데이터를 뿌림
        const salt = await bcrypt.genSalt(saltRounds);
        // 비밀번호를 확인할 때는 bcrypt.check(비밀번호, 저장된 db 값)
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (e) {
        console.log(e);
        return new Error(e);
    }
}

const comparePassword = async(password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (e) {
        console.log(e);
        return new Error(e);
    }
}

module.exports = { hashPassword, comparePassword };