const axios = require('axios');
const cheerio = require('cheerio');
const { downloadFile } = require('./downloadFile');

//블로그 HTML을 가져와서 selector 리턴하는 함수
module.exports.getBlog = async (url) => {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  return $;
};

//블로그 작성 날짜를 YYYYMMDD 형식으로 리턴하는 함수
module.exports.getDate = (blog) => {
  let date = '';

  date += blog('.year-month .ym-year').text();

  if(blog('.year-month .ym-month').text().length === 1) date += '0';
  date += blog('.year-month .ym-month').text();

  if(blog('.year-month .date').text().length === 1) date += '0';
  date += blog('.year-month .date').text();

  console.log(date);
  return date;
};

module.exports.validDate = async (date) => {
  //이전 날짜와 중복되는지 검증
};

//블로그 이미지 저장하는 함수
module.exports.getImg = (blog, date, member) => {
  blog('.box-article img').each((idx, el) => {
    const src = blog(el).attr('src');
    const extension = src.slice(-4);

    let fileName = '';

    if(extension === 'jpeg') fileName = `${date}_${idx + 1}.${extension}`;
    else fileName = `${date}_${idx + 1}${extension}`;

    downloadFile(`https://www.sakurazaka46.com${src}`, `Downloads/${member}`, fileName);
  });
};

//다음 블로그가 있으면 URL 리턴하는 함수
module.exports.getNextBlog = (blog) => {
  const nextBlog = blog('.blog-foot-nav .pos-right a').attr('href');

  if(nextBlog === undefined) return false;
  else return `https://www.sakurazaka46.com${nextBlog}`;
};
