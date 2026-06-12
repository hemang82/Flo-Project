const http = require('https');

function fetchCMS(type) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ type });
    
    const options = {
      hostname: 'flo-tracker-api.tracewavetransparency.com',
      port: 443,
      path: '/api/v1/admin/cms/list_cms',
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
          reject(new Error(`Failed to parse response for type ${type}: ${data}`));
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
  try {
    const result = await fetchCMS('about_us');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

run();
