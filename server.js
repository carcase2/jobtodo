// 1. npm install express (서버 만들어서 get, post 하기 위해)
// 2. npm install ejs (ejs 파일 사용하기 위해)
// 3. npm install nodemon (서버 지속 유지)
// 4. git init (git 사용)
// 5. git commit -m "first commit" (처음으로 commit 함)

const request = require('request')
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const { Db } = require('mongodb');
const { query } = require('express');
const methodOverride = require('method-override')
const fs = require('fs')

app.use(methodOverride('_method')) 

app.use(bodyParser.urlencoded({extended: true}))

const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs');
const TARGET_URL = 'https://notify-api.line.me/api/notify'
const TOKEN = 'qVONEIy5s2nJc8AU1ylzY5xYocCEh9TMcfNzzclhudE'

var db;

MongoClient.connect('mongodb+srv://carcase2:ka76062989@cluster0.9gddo.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
	if (에러) return console.log(에러)
	db = client.db('COAD_Todo');
 
	  app.listen(process.env.PORT || 8080, function () {
		console.log('listening on 8080')
	});
});


app.get('/',function(요청,응답){
    응답.render('index.ejs')
})

app.delete('/delete', function(요청, 응답){
    요청.body._id = parseInt(요청.body._id)
    console.log('/delete왔음')
    db.collection('Job_List').deleteOne(요청.body, function(에러, 결과){
      console.log('삭제완료')
    })
    응답.send('삭제완료')
  });

app.get('/write', function(요청, 응답) { 
    응답.render('write.ejs')
});

app.get('/edit/:id', function(요청, 응답) { 
    db.collection('Job_List').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
        console.log(결과);
    응답.render('edit.ejs',{post : 결과})
});

app.put('/edit',function(요청,응답){
    db.collection('Job_List').updateOne({_id : parseInt(요청.body.id) },
    {$set:{
        제목: 요청.body.title
        ,세부내용:요청.body.detail
        ,요청날짜:요청.body.req_date
        ,마감예정일:요청.body.end_date
        ,소용시간:요청.body.cost_time
        ,완료일:요청.body.complete_date
        ,요청자:요청.body.req_people
        ,진행상태:요청.body.job_state
        ,비고:요청.body.remark          
        ,난이도:요청.body.job_level       
    }},function(에러,결과){응답.redirect('/list')})
})

});
app.get('/list', function(요청, 응답) { 
    db.collection('Job_List').find().toArray(function(에러,결과){
        // console.log(결과);
    응답.render('list.ejs',{posts:결과})
    })
    
});

app.get('/print', function(요청, 응답) { 
    db.collection('Job_List').find().toArray(function(에러,결과){
        // console.log(결과);
    응답.render('print.ejs',{posts:결과})
    })
    
});

app.get('/totheline', function(요청, 응답) { 
    db.collection('Job_List').find().toArray(function(에러,결과){
        // console.log(결과);
    응답.render('totheLine.ejs',{posts:결과})
    })
    
});
app.get('/history', function(요청, 응답) { 
    db.collection('Job_List').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('history.ejs',{posts:결과})
    })
    
});

app.post ('/add', function(요청, 응답){
    응답.send('전송완료2');
    // 응답.redirect('/');
    db.collection('counter').findOne({name:'게시물갯수'},function(에러,결과){
        var CalltotalPost = 결과.totalPost;
        var 저장할것 = {
            _id:(CalltotalPost + 1)
            ,제목: 요청.body.title
            ,세부내용:요청.body.detail
            ,요청날짜:요청.body.req_date
            ,마감예정일:요청.body.end_date
            ,소용시간:요청.body.cost_time
            ,완료일:요청.body.complete_date
            ,요청자:요청.body.req_people
            ,진행상태:요청.body.job_state
            ,비고:요청.body.remark          
            ,난이도:요청.body.job_level
        }
            db.collection('Job_List').insertOne(저장할것,function(){
                console.log('저장됨');
                db.collection('counter').updateOne({name:'게시물갯수'},{$inc:{totalPost : 1}},function(에러,결과){
                    console.log('counter 숫자 증가');
                })
                // 응답.redirect('/list');
              })
    })
    // 응답.redirect('/list');
});

app.get('/search',function(요청,응답){
    // console.log(요청.query===null);
    console.log(요청.query.state==="all");   
    if(요청.query.state==="전체"){
    var 검색조건 = [
        {
          $search: {
            index: 'searchTitle',
            text: {
              query: 요청.query.value,
              path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
          },
          
        },
       { $sort : { _id : 1 } },
       { $limit : 10 },

    //    {$match :{진행상태:요청.query.state}}
    //    { $project : { 제목 : 1, _id : 0 } }
    ]
    }else{
        var 검색조건 = [
            {
              $search: {
                index: 'searchTitle',
                text: {
                  query: 요청.query.value,
                  path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
              },
              
            },
           { $sort : { _id : 1 } },
           { $limit : 10 },
    
           {$match :{진행상태:요청.query.state}}
        //    { $project : { 제목 : 1, _id : 0 } }
        ]   
    }
  
    console.log('요청.query.value= ' +  요청.query.value);
    console.log('요청.query.state= ' +  요청.query.state);
    db.collection('Job_List').aggregate(검색조건).toArray((에러, 결과)=>{
    //   db.collection('Job_List').find({진행상태:요청.query.state}).toArray((에러, 결과)=>{
    
    //   })
      console.log(결과) 
      응답.render('search.ejs', {posts : 결과})

  })
})

// request.post({
//     url: TARGET_URL,
//     headers: {
//       'Authorization': `Bearer ${TOKEN}`
//     },
//     form: {
//       message: '안녕하세요. LINE Notify 스티커 테스트입니다.',
//       stickerPackageId: "446",
//       stickerId: "1989"
      
//     }
//   }, (error, response, body) => {
//     // 요청 완료
//     console.log(body)
//   })

const form = request.post({
    url: TARGET_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${TOKEN}`
    }
  }, (error, response, body) => {
    // 요청 완료
    console.log(body)
  }).form()
    form.append('message', "안녕하세요. LINE Notify 이미지 테스트입니다.11")
    form.append('stickerPackageId', "446")
    form.append('stickerId', "1989")
//   stickerPackageId: "446",
//   stickerId: "1989"
  


 // const form = request.post({
//     url: TARGET_URL,
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       'Authorization': `Bearer ${TOKEN}`
//     }
//   }, (error, response, body) => {
//     // 요청 완료
//     console.log(body)
//   }).form()
   
//   // 데이터를 지정합니다.
//   form.append('message', '안녕하세요. LINE Notify 이미지 테스트입니다.')
//   form.append('imageFile', fs.createReadStream('./google_logo.png'))