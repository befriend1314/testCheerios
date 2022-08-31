

1. 修改writeList ，执行node writeList 把链接保存到downloadList 里面

2. 执行  wget -P ./pages -i downloadList.txt 把页面下载下来

3. 执行 node index.js 爬取页面数据，保存到data.json

4. 执行 node format.js 拿到小程序专用数据