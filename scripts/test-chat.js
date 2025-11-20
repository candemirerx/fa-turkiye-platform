const fs = require('fs');

async function test() {
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Merhaba' })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        const content = JSON.stringify(data, null, 2);
        console.log(content);
        fs.writeFileSync('test-result.log', content);
    } catch (e) {
        console.error('Error:', e);
        fs.writeFileSync('test-result.log', String(e));
    }
}
test();
