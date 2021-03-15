// JWT
// json web token의 줄임말
// 회원 정보 인증 시 사용
// header(header).payload(내용).서명(signature)
// header
// typ - 토큰의 타입
// alg - 해싱 알고리즘
// payload - 토큰에 담을 정보
// signature - header의 인코딩 값 + payload의 인코딩 값을 합친후 비밀키를 통해 암호화 생성

const jwt = require('jsonwebtoken');

// 크로스 오리진 CORS 이슈 발생을 막음
// cookie 세션을 사용하는 방식보다 보안 이슈를 막을 수 있음

const verifyToken = (req, res, next) => {
    try {
        // jwt.verify(token, secret_key)
        req.decoded = jwt.verify(req.headers.authorization, "ujin");
        return next();
    } catch(e) {
        return res.json(e);
    }
}

module.exports = { verifyToken };