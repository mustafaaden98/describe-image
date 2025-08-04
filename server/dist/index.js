"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const genai_1 = require("@google/genai");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)(); // for parsing multipart/form-data
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';
// Decode base64 credentials and write to a temp file
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const keyFilePath = path_1.default.join(__dirname, '../image-reognition.json');
    fs_1.default.writeFileSync(keyFilePath, Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
}
// Authenticate using GOOGLE_APPLICATION_CREDENTIALS env variable
const ai = new genai_1.GoogleGenAI({
    vertexai: true,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
});
app.post('/analyze-image', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer)
            return res.status(400).send('No image uploaded.');
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to process image');
    }
});
app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
});
//# sourceMappingURL=index.js.map