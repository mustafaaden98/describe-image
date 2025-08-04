import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';


dotenv.config();

const app = express();
const upload = multer(); // for parsing multipart/form-data

app.use(cors());
app.use(express.json());

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT!;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';

// Decode base64 credentials and write to a temp file
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
  const keyFilePath = path.join(__dirname, '../image-reognition.json');
  fs.writeFileSync(
    keyFilePath,
    Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8')
  );
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
}


// Authenticate using GOOGLE_APPLICATION_CREDENTIALS env variable
const ai = new GoogleGenAI({
  vertexai: true,
  project: GOOGLE_CLOUD_PROJECT,
  location: GOOGLE_CLOUD_LOCATION,
});

app.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) return res.status(400).send('No image uploaded.');

    const base64Image = imageBuffer.toString('base64');

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file?.mimetype || 'image/jpeg',
      },
    };

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [imagePart, 'What is shown in this image?'],
    });

    res.json({ description: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to process image');
  }
});

app.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});
