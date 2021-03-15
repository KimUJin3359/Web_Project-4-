const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 8000;
const routes = require('./routes')
//const routes = require('./routes/index.js')
//index는 기본적으로 생략이 가능
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(morgan("dev"))
//1차 라우터 /로 들어온다
app.use("/", routes)

app.listen(PORT, () => console.log(`PORT : ${PORT}`));