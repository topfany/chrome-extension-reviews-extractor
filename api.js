const express = require('express');
const app = express();
const chromeStoreApi = require('chrome-extension-meta');
const port = 3001;

app.get('/', (req, res) => {
  res.send('This is an API function for crawler chrome extension info!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// 因为getExtensionComments是异步函数，所以调用它的整个方法也用异步函数
app.get('/crawler/comment/:extensionId', async (req, res) => {
  const extensionId = req.params.extensionId;
  //res.send(`Extension ID: ${extensionId}`);
  try {
      const allComments = await getExtensionComments(extensionId);
      //console.log(allComments);
      // 根据需要响应客户端，例如：
      if (!allComments || allComments === undefined || allComments === "" || allComments === null) {
        // 如果数据为空，返回400错误
        res.json({ data: 'We couldn\'t find any reviews for this extension' });
      }
      res.json(allComments);
  } catch (error) {
      console.error('Error fetching comments:', error);
      // 处理错误响应，例如：
      res.status(500).send('Error fetching comments');
  }
});

async function getExtensionComments(extensionID) {
    try {
        const data = await chromeStoreApi.getExtComments(extensionID);
        if (data.success) {
            //console.log(data); // Log the extension comments
            return data;
        } else {
            console.error(data.error); // Handle errors
        }
    } catch (error) {
        console.error(error); // Handle exceptions
    }
}
