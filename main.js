const { getImgUrlKeyaki, getImgUrlSakura } = require('./crawler.js');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = '';
let flag = '';

rl.on('line', (line) => {
  url = line;
  flag = url.match(/[aeikrsuy]\w+46/)[0];
  rl.close();
}).on('close', async () => {
  while(url !== 'end') {
    console.log(`main ${url}`);
    if(flag === 'keyakizaka46') {
      url = await getImgUrlKeyaki(url);
    } else if(flag === 'sakurazaka46') {
      url = await getImgUrlSakura(url);
    }
  }
});
