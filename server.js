// 1. npm install express (서버 만들어서 get, post 하기 위해)
// 2. npm install ejs (ejs 파일 사용하기 위해)
// 3. npm install nodemon (서버 지속 유지)
// 4. git init (git 사용)
// 5. git commit -m "first commit" (처음으로 commit 함)


const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const { Db } = require('mongodb');
app.use(bodyParser.urlencoded({extended: true}))

const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs');


var db;

MongoClient.connect('mongodb+srv://carcase2:ka76062989@cluster0.9gddo.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
	if (에러) return console.log(에러)
	db = client.db('COAD_Todo');
 
	  app.listen(8080, function () {
		console.log('listening on 8080')
	});
});


app.get('/',function(요청,응답){
    응답.render('index.ejs')
})

app.get('/write', function(요청, 응답) { 
    응답.render('write.ejs')
});

app.post ('/add', function(요청, 응답){
    응답.send('전송완료2');
    var 저장할것 = {
        제목: 요청.body.title
        ,세부내용:요청.body.detail
        ,요청날짜:요청.body.req_date
        ,마감예정일:요청.body.end_date
        ,소용시간:요청.body.cost_time
        ,완료일:요청.body.complet_date
        ,진행상태:요청.body.job_state
        ,비고:요청.body.remark
        ,난이도:요청.body.job_level}
    console.log(저장할것)
    db.collection('Job_List').insertOne(저장할것,function(){
        console.log('저장되')
        
    })
});
