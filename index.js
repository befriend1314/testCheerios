
const https = require("https")
const cheerio = require('cheerio')

const fs = require("fs");

//打印每个页面的信息
function printArticleInfo(blogData){
  // console.log('时间', blogData.times)
  // console.log('id', blogData.pageId)
}

//过滤每个URL数组对应页面的文章
function filterArticle(html){
  var $ = cheerio.load(html)

  const page404 = $('.bk_404')

  const page502 = $('h1').text()

  const isPage502 = page502.indexOf('502') !== -1 ? false : true




  var blogData = {}

  if(page404.length === 0 && !!isPage502) {
    
    // 获取标题
    const title = $('h2').text()
    blogData.title = title
    // 获取时间
    const times = $('.list-foot .left').text()
    blogData.times = times

    // 获取id
    const asctionStr = $('.comments form').attr('action')
    if(asctionStr) {
      const urlParams = new URL(asctionStr)
      const pageId = urlParams.searchParams.get('postid')
      blogData.pageId = pageId
    }
    

    // 获取正文，保存为字符串数组
    const contentHtml = $('.content>p')
    let content  = []
    for (let j = 0; j < contentHtml.length; j++) {
      let pHtml = contentHtml.eq(j).html() + ''
      if(pHtml.indexOf('<br>') !== -1) {
        content.push('\n')
      } else {
        content.push(pHtml)
      }
    }

    blogData.content = content

    // 获取评论
    const commentList = []
    const commentListHtml = $('.commentname')
    for(let i = 0; i < commentListHtml.length; i++ ){
      const obj = {}
      obj.nickName = $(commentListHtml).eq(i).find('a').eq(0).text()
      obj.ipAdress = $(commentListHtml).eq(i).find('a').eq(1).text().slice(3)
      obj.replyTimes = $(commentListHtml).eq(i).find('span').text().slice(0,19)
      obj.content = $(commentListHtml).eq(i).find('p').text()
      commentList.push(obj)
    }
    blogData.commentList = commentList

    // 获取上一条
    const prevStr = $('.xiangguan .left a').attr('href')

    if(prevStr) {
      const prev = {
        pageId: prevStr.substring(37, prevStr.length - 5),
        title: $('.xiangguan .left a').text(),
      }
      blogData.prev = prev
    } else {
      console.log('无效上一条', prevStr)
    }
    

    // 获取下一条
    const nextStr = $('.xiangguan .right a').attr('href')

    if(nextStr) {
      const next = {
        pageId: nextStr.substring(37, nextStr.length - 5),
        title: $('.xiangguan .right a').text(),
      }
      blogData.next = next
    } else {
      console.log('无效下一条', nextStr)
    }
    

  } else {
    // console.log('当前无效 html', html)
  }

  return blogData

}

// 爬取

function getUrlAsync(url){
  return new Promise(function(resolve, reject){
      fs.readFile(`./xiaomimi/${url}`, (error, htmlData) => {
        if(error){
          console.log(error)
        } else {
          const htmlStr = htmlData.toString()
          resolve(htmlStr)
        }
        
      })
  })
}


// 开始
function starFetch() {

  const fetchBlogArray = []


  fs.readdir('./xiaomimi', (err, res) => {
    if(err) {
      console.log(err)
    } else {
      res.slice(0, 50).forEach(function(url){
        fetchBlogArray.push(getUrlAsync(url))
  
        const data = []
        Promise.all(fetchBlogArray).then( res => {
          res.forEach(html => {
            const blogData = filterArticle(html)
            if(Object.keys(blogData).length > 0) {
              printArticleInfo(blogData)
              data.push(blogData)
            }
          })
      
          console.log(`共完成爬取${data.length} 条数据`)

          console.log('datadatadata')
      
          fs.writeFile('./data.json', JSON.stringify(data), 'utf8', err => {
            if (err) throw err
            console.log('It\'s saved!');
          })
          console.log('成功了')
        })
      })
    }
  })

}

starFetch()


