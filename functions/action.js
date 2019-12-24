const reply = function(msg,token) {
  return {
    type : 'message',
    replyToken: token,
    messages: [{
      type:"text",
      text: msg
    }]
  }
};

const flexLogout = function(userid) {
  return {
    to: userid,
    messages: [{
      "type": "flex",
      "altText": "Flex Message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Are you sure logout?",
              "align": "center"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "Yes",
                "text": "Yes, Logout"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "No",
                "text": "No, Logout"
              }
            }
          ]
        }
      }
  }]
  }};


  const quickmsg = function(userid) {
    return {
      to: userid,
      messages: [{
        type:"text",
        text: "list",
        quickReply: {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "รหัส",
                "text": "รหัส"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "ชื่อ",
                "text": "ชื่อ"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "คณะ",
                "text": "คณะ"
              }
            },{
              "type": "action",
              "action": {
                "type": "message",
                "label": "แผนที่",
                "text": "แผนที่"
              }
            }
          ]
        }
      }]
    }
  };


  const MapBuu = function(userid) {
    return {
      to: userid,
      messages: [{
        type:"text",
        text: "แผนที่",
        quickReply: {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "location",
                "title": "ตึกภาคคณะวิศวกรรมศาสตร์",
                "address": "169 Bangsaen Beach Road, Saen Suk City, Chon Buri 20131",
                "latitude": 13.274865,
                "longitude": 100.925182
              }
            }
          ]
        }
      }]
    }
  };


module.exports = {reply,flexLogout,quickmsg,MapBuu};