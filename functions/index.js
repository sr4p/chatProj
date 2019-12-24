const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const request = require('request');
const admin = require("firebase-admin");
// const { WebhookClient } = require('dialogflow-fulfillment');
const serviceAccount = require('./secret/service-account.json')
const actionJson = require('./action');


const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eIVGYDTn0zLab+gMhDYCv0RXDpxTIOClstjx3uS239knk5I03BgM1wNUQyenrPouWkebx5/G0pQk6ml23HmSBopFprXEJBobzdFmrkM5hJEhdoUl/nD1GmLQWxgsj3YeWaak4/dwcmfpvI4ZSdDAvVGUYhWQfeY8sLGRXgo3xvw='
  };

const headersLogout = {
    'Authorization': 'Bearer eIVGYDTn0zLab+gMhDYCv0RXDpxTIOClstjx3uS239knk5I03BgM1wNUQyenrPouWkebx5/G0pQk6ml23HmSBopFprXEJBobzdFmrkM5hJEhdoUl/nD1GmLQWxgsj3YeWaak4/dwcmfpvI4ZSdDAvVGUYhWQfeY8sLGRXgo3xvw='
};

admin.initializeApp({
  //dialogflow
  // credential: admin.credential.applicationDefault(),
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proj-ver1.firebaseio.com"
});

// //agent dialogflow



// func logout
const logout = (userid) => {
  return new Promise((resolve, reject) => {
    request.delete({
      url:'https://api.line.me/v2/bot/user/U2d34a23815ed5e15e28dd56a5f521a79/richmenu',
      headers : headersLogout,
    }, (err,responce,body) => {
      resolve(responce)
    })
  })
};

//quick message
const quickMessage = (userid) => {
  return new Promise((resolve, reject) => {  
  request.post({
      uri: 'https://api.line.me/v2/bot/message/push',
      headers: headers,
      body: JSON.stringify(actionJson.quickmsg(userid))
  },(err,responce,body) => {
    resolve(responce)
  });
})};

//quick Map
const quickMap = (userid) => {
  return new Promise((resolve, reject) => {  
  request.post({
      uri: 'https://api.line.me/v2/bot/message/push',
      headers: headers,
      body: JSON.stringify(actionJson.MapBuu(userid))
  },(err,responce,body) => {
    resolve(responce)
  });
})};



//func push
const pushMessage = (userid) => {
  return new Promise((resolve, reject) => {  
  request.post({
      uri: 'https://api.line.me/v2/bot/message/push',
      headers: headers,
      body: JSON.stringify(actionJson.flexLogout(userid))
  },(err,responce,body) => {
    resolve(responce)
  });
})};


//func ส่งกลับMessage reply 
const sendMessage = (msg,token) =>{
  return new Promise((resolve, reject) => {
    request.post({
      url:'https://api.line.me/v2/bot/message/reply',
      headers : headers,
      body : JSON.stringify(actionJson.reply(msg,token))
    }, (err,responce,body) => {
      resolve(responce)
    })
  })
}

//export func. ขึ้น firabase functions
exports.webhook = functions.https.onRequest((req,res) =>{
  // const agent = new WebhookClient({request: req,response: res});
  let token = req.body.events[0].replyToken;
  let userid = req.body.events[0].source.userId;

  // ดึงobject source จาก request
  // let source = req.body.originalDetectIntentRequest.source;
  //ดึงuserid line จาก source ที่มาจาก request
  // let userid = req.body.originalDetectIntentRequest.source.userId;
  
  let msg = req.body.events[0].message.text;
  let log = false;
  var db = admin.database();
  const rootRef = db.ref("people/student/")
  const rootDe = db.ref('people/student/'+userid)

  
  
  //หาข้อมูลใน firebaseDB
  rootRef.once("value").then(function(snapshot){
    let userStu;
    if (snapshot.hasChild(String(userid)) == false) {
      userStu ='กรุณาเข้าสู่ระบบ';
      
    } else {
      
      var info = snapshot.child(String(userid)).val();
      if(msg == 'คู่มือ') {quickMessage(userid);}
      // else if(msg == 'แผนที่') {quickMap(userid);}
      else if(msg == 'ชื่อ') {
        userStu = "ชื่อ : "+String(info.prefix_thai)+""+String(info.name_thai)+" "+String(info.surname_thai);
        // infoma(agent,userStu); //เรียกใช้ func เพื่อส่ง agent เมื่อ "คำถาม" เข้าintentนั้นๆ
      }
      else if(msg == 'รหัส') {userStu = "รหัสนิสิต : "+String(info.username);}
      else if(msg == 'คณะ') {userStu = "คณะ : "+String(info.faculty_thai)+" สาขา : "+String(info.program_thai);}
      /*
      
      another information from dataB
      
      */
      else if(msg == 'ออกจากระบบ') {
        log = true;
        pushMessage(userid);
      } 
      else if(msg == 'Yes, Logout')  {
        userStu ='ออกจากระบบเรียบร้อย';
        rootDe.remove()
        // cancel richmenu
        logout(userid);
      }
      else {
        userStu ='กรุณาขอข้อมูลใหม่อีกครั้ง';
      }

    }

    //ส่งagent/message ให้ผู้req 
      // function infoma(agent,userStu){
      //   agent.add(userStu);
      // }

    // run func dialogflow //ส่งให้ให้ผู้ req ผ่าน Intent 
      // let intentMap = new Map();
      // intentMap.set('info', infoma); //( intent,function ที่ต้องการใช้ )
      // agent.handleRequest(intentMap);

      //ส่ง message
      sendMessage(userStu,token);
      // quickMessage(userid);
  });
});