const fs = require("fs");

fs.readdir('./xiaomimi', (err, data) => {
  if(err) console.log(err)
  data.forEach(item => {
    fs.readFile(item, (error, htmlDat) => {
      if(error) console.log(err)
      


      
    })
  })
})