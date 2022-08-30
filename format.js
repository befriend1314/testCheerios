const fs = require("fs");

function starFetch() {
    fs.readFile('./data.json','utf-8', (error, htmlData) => {

        const newData = JSON.parse(htmlData)
        const str = newData.join('')

        console.log('str',str)


        fs.writeFile('./result.json', str, 'utf8', err => {
            if (err) throw err
            console.log('It\'s saved!');
          })

    })
}
starFetch()