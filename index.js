/* eslint-disable indent */
/* eslint-disable keyword-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable space-before-blocks */
'use strict';
const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(config);

const app = express();

let queue = [];

// Endpoint to add a user to the queue
app.post('/add-to-queue/:userId', (req, res) => {
  const userId = req.params.userId;
  addToQueue(userId);
  res.send('User added to queue');
});

// Endpoint to remove a user from the queue
app.post('/remove-from-queue', (req, res) => {
  removeFromQueue();
  res.send('First user removed from queue');
});

// Endpoint to get the size of the queue
app.get('/queue-size', (req, res) => {
  const queueSize = getQueueSize();
  res.json({ size: queueSize });
});

// Endpoint to get the position of a user in the queue
app.get('/user-position/:userId', (req, res) => {
  const userId = req.params.userId;
  const position = getUserPositionInQueue(userId);
  res.json({ position: position });
});

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    return handleEvent(event);
  }))
  .then(() => res.end())
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

// simple reply function
const replyText = (replyToken, text, quoteToken) => {
  return client.replyMessage({
    replyToken,
    messages: [{
      type: 'text',
      text,
      quoteToken,
    }],
  });
};

function addToQueue(userId) {
  // Check if the user is already in the queue
  if (!queue.includes(userId)) {
    queue.push(userId);
    // Optionally, you can save the queue state to a database or storage here
  }
}

function removeFromQueue() {
  if (queue.length > 0) {
    queue.shift(); // Remove the first user from the queue
    // Optionally, you can save the updated queue state to a database or storage here
  }
}

function getQueueSize() {
  return queue.length;
}

function getUserPositionInQueue(userId) {
  return queue.indexOf(userId);
}

const replyTextandSticker = (replyToken, text, quoteToken,stickerId,packageId) => {
  const stickerMessage = {
    type: 'sticker',
    packageId: packageId,
    stickerId: stickerId,
  };

  return client.replyMessage({
    replyToken,
    messages: [{
      type: 'text',
      text,
      quoteToken,
    },stickerMessage],
  });
};

// callback function to handle a single event
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // Non-text message, ignore
    return Promise.resolve(null);
  }

  // Extract user ID from the event
  const userId = event.source.userId;
  // Retrieve user profile information
  if(event.message.text === 'ตรวจสอบและเพิ่มเข้าคิว'){
    if (!queue.includes(userId)) {
      queue.push(userId);
      return client.getProfile(userId)
      .then((profile) => {
        const displayName = profile.displayName;
        var text = 'เราได้เพิ่มคุณ ';
        text += displayName;
        text += ' เข้าสู่คิวการใช้บริการเรียบร้อย';
        text += '\nคิวของคุณคือคิวที่ ';
        text += queue.length;
        replyTextandSticker(event.replyToken,text,event.quoteToken,16581266,8522);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    } else{
      return client.getProfile(userId)
      .then((profile) => {
        const displayName = profile.displayName;
        var text = 'คุณ ';
        text += displayName;
        text += ' ได้อยู่ในคิวแล้ว';
        text += '\nคิวของคุณคือคิวที่ ';
        text += queue.indexOf(userId) + 1;
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    }
  }
  if(event.message.text === 'ตรวจสอบคิวและเวลา'){
    if (!queue.includes(userId)) {
      queue.push(userId);
      return client.getProfile(userId)
      .then((profile) => {
        var text = 'คุณยังไม่ได้อยู่ในคิว\nหากต้องการเพิ่มคิวเข้าใช้งานเครื่องซักผ้า สามารถกดเมนู"จองคิว"\nหรือพิมพ์ "ตรวจสอบและเพิ่มเข้าคิว" ได้เลยครับ';
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    } else{
      return client.getProfile(userId)
      .then((profile) => {
        const displayName = profile.displayName;
        var text = 'คุณ ';
        text += displayName;
        text += ' ได้อยู่ในคิวแล้ว';
        text += '\nคิวของคุณคือคิวที่ ';
        text += queue.indexOf(userId) + 1;
        text += '\nเวลาเฉลี่ยที่ต้องรอคื';
        text += (queue.indexOf(userId) + 1) * 30;
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    }
  }
  if(event.message.text === 'ยกเลิกคิว'){
    if (!queue.includes(userId)) {
      queue.push(userId);
      return client.getProfile(userId)
      .then((profile) => {
        var text = 'คุณยังไม่ได้อยู่ในคิว\nหากต้องการเพิ่มคิวเข้าใช้งานเครื่องซักผ้า สามารถกดเมนู"จองคิว"\nหรือพิมพ์ "ตรวจสอบและเพิ่มเข้าคิว" ได้เลยครับ';
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    } else{
      return client.getProfile(userId)
      .then((profile) => {
        var text = 'คุณแน่ใจหรือไม่ว่าต้องการจะยกเลิกการจองคิว\nหากยืนยันพิมพ์"ยืนยัน"';
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    }
  }
  if(event.message.text === 'ยืนยัน'){
    if (!queue.includes(userId)) {
      queue.push(userId);
      return client.getProfile(userId)
      .then((profile) => {
        var text = 'คุณยังไม่ได้อยู่ในคิว\nหากต้องการเพิ่มคิวเข้าใช้งานเครื่องซักผ้า สามารถกดเมนู"จองคิว"\nหรือพิมพ์ "ตรวจสอบและเพิ่มเข้าคิว" ได้เลยครับ';
        replyText(event.replyToken,text,event.quoteToken);
        // Handle the user's display name
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    } else{
      return client.getProfile(userId)
      .then((profile) => {
        const index = queue.indexOf(userId);
        if (index !== -1) {
          queue.splice(index, 1);
        }
        var text = 'คิวของคุณได้ถูกลบเรียบร้อย\nขอบคุณที่ใช้บริการครับ';
        replyTextandSticker(event.replyToken,text,event.quoteToken,52002739,11537);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        // Handle error
      });
    }
  }
}
const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
