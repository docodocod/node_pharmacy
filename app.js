const express=require('express');
const dotenv=require('dotenv');
const path=require('path');
const morgan=require('morgan');
const session=require('express-session');
const axios=require("axios");
const app=express();

dotenv.config();

app.set('port',process.env.PORT||4162);
app.set('view engine','ejs');

//약국 api 주소 http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire
app.get("/pharmacy_list",(req,res)=>{
    let response=null;
        const api = async () => {
            try {
                response = await axios.get('http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire', {
                    params: {
                        "serviceKey": "lHWVPy5mPqipunudcvmExi3LlMBQ9m8Dgdq4ku+Fvb6r3EAycJsNz8V5fidRJhlm+Truu2hgulj7/yP47jk2pw==",
                        "Q0": req.query.Q0,
                        "Q1": req.query.Q1,
                        "QT": req.query.QT,
                        "QN": req.query.QN,
                        "ORD": req.query.ORD,
                        "pageNo": req.query.pageNo,
                        "numOfRows": req.query.numOfRows,
                    }
                })
            } catch (e) {
                console.log(e);
            }
            return response;
        };
        api().then((response)=>{
            res.setHeader("Access-Control-Allow-Origin","*");
            res.json(response.data.response.body); //약국데이터 전송
        });

})

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httponly:true,
        secure:false,
    }
}));

app.use(express.static(path.join("C:\\Users\\donga\\WebstormProjects\\node_pharmacy","public")));

app.use((req,res,next)=> {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    next(error);
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(process.env.PORT,()=>{
    console.log("process listening 127.0.0.1:"+process.env.PORT+"에서 연결중입니다.");
});
