const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyB3Wg3jY6qembjVYo_FZRmpbeyT_wWzKjo';
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
    try {
        console.log('Testing Gemini API directly...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Merhaba, nasılsın?');
        const response = await result.response;
        const text = response.text();
        console.log('Success! Response:', text);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

test();
