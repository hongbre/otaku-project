const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const downloadFile = async (fileUrl, downloadFolder, fileName) => {
  const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      console.log(`Successfully downloaded file! ${fileName}`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

const dateArr = [];

module.exports.getImgUrlKeyaki = async (url) => {
  console.log(`In function getImgUrl : ${url}`);
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  let date = '';
  $('.box-date time').each((idx, el) => {
    if(idx === 0) {
      const splitYearMonth = $(el).text().split('.');
      date += splitYearMonth[0];
      
      if(splitYearMonth[1].length === 1){
        date += '0';
      } 
      
      date += splitYearMonth[1];
    } else if(idx === 1) {
      if($(el).text().length === 1) {
        date += '0';
      }
      
      date += $(el).text();
    }
  });
  
  const repeatDate = dateArr.filter((el) => el === date);
  if(repeatDate.length > 0) {
    date += `_repeat${repeatDate.length}`;
  }
  dateArr.push(date);
  console.log(date);
  
  $('.box-article img').each((idx, el) => {
    const extension = $(el).attr('src').slice(-4);
    const fileName = `${date}_${idx + 1}${extension}`;
    console.log(fileName);
    downloadFile($(el).attr('src'), 'download', fileName);
  });

  const nextUrl = $('.box-navi_next .btn-navi a').attr('href');
  if(nextUrl === undefined) {
    return 'end';
  } else {
    return `https://www.keyakizaka46.com${nextUrl}`;
  }
};

module.exports.getImgUrlSakura = async (url) => {
  console.log(`In function getImgUrl : ${url}`);
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  let date = '';
  date += $('.year-month .ym-year').text();

  if($('.year-month .ym-month').text().length === 1) {
    date += '0';
  }
  date += $('.year-month .ym-month').text();

  if($('.year-month .date').text().length === 1) {
    date += '0';
  }
  date += $('.year-month .date').text();

  const repeatDate = dateArr.filter((el) => el === date);
  if(repeatDate.length > 0) {
    date += `_repeat${repeatDate.length}`;
  }
  dateArr.push(date);
  console.log(date);

  $('.box-article img').each((idx, el) => {
    const src = $(el).attr('src');
    const extension = src.slice(-4);
   
    let fileName = '';
    if(extension === 'jpeg') {
      fileName = `${date}_${idx + 1}.${extension}`;
    } else {
      fileName = `${date}_${idx + 1}${extension}`;
    }

    console.log(fileName);
    downloadFile(`https://www.sakurazaka46.com${src}`, 'download', fileName);
  });

  const nextUrl = $('.blog-foot-nav .pos-right a').attr('href');
  if(nextUrl === undefined) {
    return 'end';
  } else {
    return `https://www.sakurazaka46.com${nextUrl}`;
  }
};
