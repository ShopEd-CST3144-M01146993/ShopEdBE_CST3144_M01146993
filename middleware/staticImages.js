const path = require('path');
const fs = require('fs');

function staticImages(req, res) {
  const filePath = path.join(__dirname, '..', 'images', req.url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image file does not exist' });
  }
}

module.exports = staticImages;
