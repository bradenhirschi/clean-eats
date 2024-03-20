import express from 'express';
import { createWorker } from 'tesseract.js';

const app = express();
const port = 3000;

// TODO: this is 10 MB, is that too large?
app.use(express.json({ limit: '10000kb' }));

app.post('/', async (req, res) => {
  const base64string = req.body.image.base64;

  const worker = await createWorker('eng');
  const ret = await worker.recognize(Buffer.from(base64string, 'base64'));

  res.send(JSON.stringify(ret.data.text));

  // Take down tesseract worker
  await worker.terminate();
});

app.listen(port, () => {
  console.log(`CleanEats API listening on port ${port}`)
})