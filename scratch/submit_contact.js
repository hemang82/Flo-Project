const http = require('https');

function submitContact(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: 'flo-tracker-api.tracewavetransparency.com',
      port: 443,
      path: '/api/v1/app/common/submit_contact_us',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'platform': 'AnDroId@Trace'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse: ${data}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Testing with valid payload...');
  try {
    const res = await submitContact({
      name: "Test User",
      email: "testuser@gmail.com",
      phonenumber: "",
      description: "This is a test feedback message submitted from the landing page contact form."
    });
    console.log('Success test response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Success test error:', err.message);
  }

  console.log('\nTesting with invalid email payload...');
  try {
    const res = await submitContact({
      name: "Test User",
      email: "invalidemail",
      phonenumber: "",
      description: "Test feedback."
    });
    console.log('Invalid email response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Invalid email error:', err.message);
  }
}

run();
