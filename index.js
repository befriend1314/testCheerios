
const https = require("https")
const cheerio = require('cheerio')

const fs = require("fs");

// 拿到所有url
function filterRankUrl(){
  const blogRankUrl = []
  const defaultUrl = 'https://www.nimingqiang.com/xiaomimi/'
  for(let i = 1141; i < 1143; i ++) {
    let url = defaultUrl + i + '.html'
    blogRankUrl.push(url)
  }
  return blogRankUrl
}


//打印每个页面的信息
function printArticleInfo(blogData){
  console.log('时间', blogData.times)
  console.log('id', blogData.pageId)
}

//过滤每个URL数组对应页面的文章
function filterArticle(html){
  var $ = cheerio.load(html)
  var blogData = {}

  // 获取标题
  const title = $('h2').text()
  blogData.title = title
  // 获取时间
  const times = $('.list-foot .left').text()
  blogData.times = times

  // 获取id
  const asctionStr = $('.comments form').attr('action')
  const urlParams = new URL(asctionStr)
  const pageId = urlParams.searchParams.get('postid')
  blogData.pageId = pageId

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
  const prev = {
    pageId: prevStr.substring(37, prevStr.length - 5),
    title: $('.xiangguan .left a').text(),
  }
  blogData.prev = prev

  // 获取下一条
  const nextStr = $('.xiangguan .right a').attr('href')
  const next = {
    pageId: nextStr.substring(37, nextStr.length - 5),
    title: $('.xiangguan .right a').text(),
  }
  blogData.next = next

  return blogData

}

// 爬取

function getUrlAsync(url){
  return new Promise(function(resolve,reject){
      console.log('正在爬取：'+url)
      https.get(url,function(res){
          var html = '';
          res.on('data',function(data){
              html+=data;
          })
          res.on('end',function(){
              resolve(html)
          })
      }).on('error',function(){
          reject(e)
          console.log('获取数据出错');
      })
  })
}

// 开始
function starFetch() {

  const urlArr = filterRankUrl()

  const fetchBlogArray = []


  urlArr.forEach(function(url){
    console.log('url', url)
    fetchBlogArray.push(getUrlAsync(url))
  })

  const data = []
  Promise.all(fetchBlogArray).then( res => {
    res.forEach(html => {
      const blogData = filterArticle(html)
      printArticleInfo(blogData)
      data.push(blogData)
    })

    fs.writeFile('./data.json', JSON.stringify(data), 'utf8', err => {
      if (err) throw err
      console.log('It\'s saved!');
    })
    console.log('成功了')
  })

}

starFetch()


