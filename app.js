// app.js
const express = require('express');
//const ejs = require('ejs');
const app = express();
const axios = require('axios');
const path = require('path');
const favicon = require('serve-favicon');
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件用于解析JSON格式的请求体
app.use(express.json());

// 将public目录设置为静态资源目录
//app.use(express.static('public'));

// 为静态资源设置中间件，这也会处理favicon.ico请求
app.use(express.static(path.join(__dirname, 'public')));

// 设置favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon('./favicon.ico'));

app.post('/api/data', (req, res) => {
  // 从请求体中获取数据
  const postData = req.body;

  try {
    const extensionId = validateAndExtractUrl(postData);
    console.log(`Valid URL and extracted ID: ${extensionId}`);

    console.log('extensionId:', extensionId);

    if (typeof extensionId === 'string' && extensionId.trim() === '') {
        console.log('字符串不存在或为空');
        res.status(200).json({ message: 'Extension ID not exist!'});
    }

    const apiUrl = 'http://localhost:3001' + '/crawler/comment/' + extensionId;
    axios.get(apiUrl, {
        headers: {
        'Content-Type': 'application/json',
        // 如果有认证信息，可以添加在这里
        // 'Authorization': 'Bearer your_token_here'
        }
    })
    .then(response => {
        console.log('Response:', response.data);
        //console.log('Received POST data:', postData);
        // 响应客户端
        res.status(200).json({ message: 'success', data: response.data.data });
    })
    .catch(error => {
        console.error('Error:', error);
    });
  } catch (error) {
    console.error(error.message);
    res.json({ message: 'failed', data: error.message });
  }
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome', message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function validateAndExtractUrl(data) {
    // 首先检查data是否存在且data.url是一个字符串
    if (!data || typeof data.url !== 'string') {
      throw new Error('Please enter a valid URL.');
    }
  
    const url = data.url;
    
    // 验证URL是否以"https://chromewebstore.google.com/detail"开头
    if (!url.startsWith('https://chromewebstore.google.com/detail')) {
      throw new Error('Please enter a valid URL. URL must start with "https://chromewebstore.google.com/detail"');
    }
  
    // 使用正则表达式提取链接中的ID部分，即eimadpbcbfnmbkopoojfekhnkhdbieeh
    //const regex = /https:\/\/chromewebstore\.google\.com\/detail\/([^/]+)/;
    const regex = /\/([^\/]*)$/;
    const match = url.match(regex);
    //console.log(match);
    if (match && match[1]) {
      // 返回提取的ID
      return match[1];
    } else {
      throw new Error('Please enter a valid URL.');
    }
}
