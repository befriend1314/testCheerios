const fs = require("fs");

const max = 2144

const min = 2140

// const url = 'https://www.nimingqiang.com/xiaomimi/2144.html'

const CreateFiles = fs.createWriteStream('./downloadList.txt', {
  flags: 'a' //flags: 'a' preserved old data
})

for(let i = max; i >= min; i--){
  let url = `https://www.nimingqiang.com/xiaomimi/${i}.html`
  CreateFiles.write(url.toString()+'\r\n') //'\r\n at the end of each value
}