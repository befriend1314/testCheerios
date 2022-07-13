
const https = require("https")
const cheerio = require('cheerio')

const fs = require("fs");
const path = require("path")


const url = 'https://www.nimingqiang.com/xiaomimi/13.html'

const defaultUrl = 'https://www.nimingqiang.com/xiaomimi/' 


const dataList = []

for (let i = 0; i < 20; i++ ){
  https.get(`${defaultUrl}${i}.html`, res => {
    let html = ''
    res.on('data', data => {
      html += data;
    })
    res.on('end', () => {

      const pageId = i


      const $ = cheerio.load(html)
      const contentHtml = $('.content>p')
      let texts  = []
      for (let j = 0; j < contentHtml.length; j++) {
        let pHtml = contentHtml.eq(j).html()

        console.log('pHtml', pHtml)
        if(pHtml.indexOf('br') !== -1) {
          texts.push('\n')
        } else {
          texts.push(pHtml)
        }
      }


      // const times = $('.list-foot .left').text()
      // const comments = []
      
      // const commentListHtml = $('.comment .commentname')

      // for(let index = 0; index < commentListHtml.length; index++) {
      //   const obj = {}
      //   obj.nickName = $('.comment .commentname').eq(index).children('a').eq(0).text()
      //   obj.ipAddress = $('.comment .commentname').eq(index).children('a').eq(1).text()
      //   obj.times = $('.comment .commentname').eq(index).children('span').text()
      //   obj.txt = $('.comment .commentname').eq(index).children('p').text()
      //   comments.push(obj)
      // }

      const list = {
        pageId,
        texts,
      }
      dataList.push(list)
 

    })



  }).on('error', function(err){
    console.error('err', err, `url ${i} 不存在`);
  });
}

fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(dataList), err => {} )





// https.get(url, res => {
//   let html = ''
//   res.on('data', data => {
//     html += data;
//   })

//   res.on('end', () => {
//     const $ = cheerio.load(html)
//     const contentHtml = $('.content>p')

//     let texts  = []
//     for (let i = 0; i < contentHtml.length; i++) {
//       let pHtml = contentHtml.eq(i).html()
//       if(pHtml.indexOf('br') !== -1) {
//         texts.join('\n')
//       } else {
//         texts.join(pHtml)
//       }
//     }

//     const times = $('.list-foot .left').text()
//     const comments = []
    
//     const commentListHtml = $('.comment .commentname')

//     for(let i = 0; i < commentListHtml.length; i++) {
//       const obj = {}
//       obj.nickName = $('.comment .commentname').eq(i).children('a').eq(0).text()
//       obj.ipAddress = $('.comment .commentname').eq(i).children('a').eq(1).text()
//       obj.times = $('.comment .commentname').eq(i).children('span').text()
//       obj.txt = $('.comment .commentname').eq(i).children('p').text()
//       comments.push(obj)
//     }

//     const list = {
//       times,
//       texts,
//       comments
//     }
    
//     const dataList = []
//     dataList.push(list)


//     fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(dataList), err => {} ) 
//   })
// })



// function getContent(url) {
//   var movieArr = []

//   return new Promise((resolve, reject) => {
//       request(url, function (err, response, body) {
//         const $ = cheerio.load(body)

//         const item = $('.content p')

//         movieArr.push(item)

//         resolve(movieArr)
//       })
//   })
// }

// getContent(url).then(res => {
//   console.log('res', res)
// })