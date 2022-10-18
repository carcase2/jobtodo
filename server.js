// 1. npm install express (서버 만들어서 get, post 하기 위해)
// 2. npm install ejs (ejs 파일 사용하기 위해)
// 3. npm install nodemon (서버 지속 유지)
// 4. git init (git 사용)
// 5. git commit -m "first commit" (처음으로 commit 함)


const express = require('express');
const app = express();


app.set('view engine','ejs');

app.listen(8080,function(){
    console.log('listening on 8080!!!')
});

app.get('/',function(요청,응답){
    응답.render('index.ejs')
})

app.get('/write', function(요청, 응답) { 
    응답.render('write.ejs')
});


app.get('/todolist',function(요청,응답){
    응답.render('todolist.ejs')
})