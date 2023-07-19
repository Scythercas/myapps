const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("./public"));
const PORT = 3000;

const currentDir = process.cwd();
const publicPath = `${currentDir}/public`;

//ファイル名とディレクトリ名のリスト
const files = fs.readdirSync(publicPath);
//ディレクトリに絞る
const dirList = files.filter((file) => {
  return fs.statSync(path.join(publicPath, file)).isDirectory();
});

// ルーティングの設定
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ディレクトリごとにルーティング
dirList.forEach((element) => {
  app.get(`/${element}`, (req, res) => {
    res.sendFile(`${element}/index.html`);
  });
});

// HTTPサーバを起動する
app.listen(
  process.env.PORT || PORT,
  console.log(`listening at http://localhost:${PORT}`)
);
