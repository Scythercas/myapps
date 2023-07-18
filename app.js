const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("./public"));
const PORT = 3000;

///////////
const currentDir = process.cwd();
const publicPath = `${currentDir}/public`;

//ファイルとディレクトリのリストが格納される(配列)
const files = fs.readdirSync(publicPath);
//ディレクトリのリストに絞る
const dirList = files.filter((file) => {
  return fs.statSync(path.join(currentDir, file)).isDirectory();
});
///////////

// ルーティングの設定
app.get("/", (req, res) => {
  res.sendFile("index.html");
  console.log("/ へアクセスがありました");
});

// ディレクトリごとにルーティング
dirList.forEach((element) => {
  app.get(`/${element}`, (req, res) => {
    res.sendFile(`${element}/index.html`);
    console.log("/ へアクセスがありました");
  });
});

// HTTPサーバを起動する
app.listen(
  process.env.PORT || PORT,
  console.log(`listening at http://localhost:${PORT}`)
);
