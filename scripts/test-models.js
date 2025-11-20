const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyB3Wg3jY6qembjVYo_FZRmpbeyT_wWzKjo';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log('Listing available models...');

        // Try different model names
        const modelNames = [
            'gemini-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro',
            'models/gemini-pro',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash'
        ];

        for (const modelName of modelNames) {
            try {
                console.log(`\nTrying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Test');
                console.log(`✅ SUCCESS with ${modelName}`);
                break;
            } catch (error) {
                console.log(`❌ Failed with ${modelName}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
