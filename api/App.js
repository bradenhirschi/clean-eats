const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.json());

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    callback(null, 'image_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', (req, res, next) => {
  console.log('Requested:', req.originalUrl);
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    console.log('Image uploaded:', req.file.filename);
    res.json({ success: true, message: 'Image uploaded successfully' });
  } else {
    res.status(400).json({ success: false, message: 'No image provided' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
