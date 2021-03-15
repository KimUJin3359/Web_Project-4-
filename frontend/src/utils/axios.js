import axios from 'axios';

// axios 인스턴스를 생성
const request = axios.create({
    baseURL: "http://localhost:8000/api"
});

// user API
export const userAPI = {
    // 회원가입
    register: (name, email, password) => {
        return request.post("/user", {
            name,
            email, 
            password
        });
    },
    // 로그인
    login: (email, password) => {
        return request.post("/user/login", {
            email,
            password
        })
    }
}

// room API