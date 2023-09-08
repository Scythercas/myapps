//* 定数
const TABLE_WIDTH = 10;
const TABLE_HEIGHT = 10;
const NUMBER_OF_BOMBS = 20;
const GAME_STATUS = {
  BEFORE_INIT: 0,
  BEFORE_START: 1,
  PLAYING: 2,
  CLEARED: 3,
  OVERED: 4,
};

//* グローバル変数
let currentStatus = GAME_STATUS.BEFORE_INIT;
let numberOfOpenedCells = 0;

//* 関数
const returnIdfromTd = (td) => {
  return td.id.slice(-2);
};
// ログの更新
const updateLog = () => {
  const log = document.querySelector("#log");
  log.innerText = `開けたマス：${numberOfOpenedCells}`;
};
// Clear処理
const gameClear = () => {
  log.innerText = "Clear";
};
// GameOver処理
const gameOver = () => {
  log.innerText = "GameOver";
  for (let i = 0; i < TABLE_HEIGHT; i++) {
    for (let j = 0; j < TABLE_WIDTH; j++) {
      const td = document.querySelector(`#cell${i}${j}`);
      td.classList.replace("unopened", "opened");
      if (td.classList.contains("flag")) {
        td.classList.remove("flag");
      }
    }
  }
};
// 再帰関数
const openBlankCells = (cell) => {
  if (!cell.classList.contains("blank")) {
    return;
  }
  if (cell.classList.contains("opened")) {
    return;
  }
  if (
    //FIXME: if文引っかからない
    cell.classList.contains("haveNum") &&
    cell.classList.contains("unopened")
  ) {
    numberOfOpenedCells++;
    updateLog();
    cell.classList.replace("unopened", "opened");
    return;
  }
  numberOfOpenedCells++;
  updateLog();
  cell.classList.replace("unopened", "opened");
  const clickedX = +cell.id[5];
  const clickedY = +cell.id[4];
  let flg = 0;
  if (clickedX > 0 && flg == 0) {
    flg++;
    openBlankCells(document.querySelector(`#cell${clickedY}${clickedX - 1}`));
  }
  if (clickedY > 0 && flg <= 1) {
    flg++;
    openBlankCells(document.querySelector(`#cell${clickedY - 1}${clickedX}`));
  }
  if (clickedX < TABLE_WIDTH - 1 && flg <= 2) {
    flg++;
    openBlankCells(document.querySelector(`#cell${clickedY}${clickedX + 1}`));
  }
  if (clickedY < TABLE_HEIGHT - 1 && flg <= 3) {
    flg++;
    openBlankCells(document.querySelector(`#cell${clickedY + 1}${clickedX}`));
  }
};
// ひだりクリック
const tdOnClick = (e) => {
  currentStatus =
    currentStatus == GAME_STATUS.BEFORE_START
      ? GAME_STATUS.PLAYING
      : currentStatus;
  if (!(currentStatus == GAME_STATUS.PLAYING)) {
    return;
  }
  const target = e.target;
  if (target.classList.contains("opened")) {
    return;
  } else if (target.classList.contains("haveBomb")) {
    target.classList.add("opened");
    target.classList.replace("unopened", "opened");
    currentStatus = GAME_STATUS.OVERED;
    gameOver();
  } else {
    if (target.classList.contains("flag")) {
      target.classList.remove("flag");
    }
    if (target.classList.contains("blank")) {
      openBlankCells(target);
    } else {
      target.classList.replace("unopened", "opened");
      numberOfOpenedCells++;
      updateLog();
    }
  }
  if (numberOfOpenedCells == TABLE_HEIGHT * TABLE_WIDTH - NUMBER_OF_BOMBS) {
    currentStatus = GAME_STATUS.CLEARED;
    gameClear();
  }
};
// 右クリック
const tdRightClick = (e) => {
  e.preventDefault();
  currentStatus =
    currentStatus == GAME_STATUS.BEFORE_START
      ? GAME_STATUS.PLAYING
      : currentStatus;
  const target = e.target;
  if (target.classList.contains("opened")) {
    return false;
  } else {
    target.classList.add("flag");
    return false;
  }
};
// ダブルクリック
const tdDoubleClick = (e) => {
  const target = e.target;
  const cellX = +target.id[5];
  const cellY = +target.id[4];
  if (
    !(
      target.classList.contains("opened") &&
      target.classList.contains("haveNum")
    )
  ) {
    return;
  }
  const writtenNumber = +target.innerText;
  const bombCount = countSurroundingflags(cellX, cellY);
  if (writtenNumber === bombCount) {
    openCellWithYourClass(cellX - 1, cellY, "flag");
    openCellWithYourClass(cellX + 1, cellY, "flag");
    openCellWithYourClass(cellX, cellY - 1, "flag");
    openCellWithYourClass(cellX, cellY + 1, "flag");
    openCellWithYourClass(cellX - 1, cellY - 1, "flag");
    openCellWithYourClass(cellX - 1, cellY + 1, "flag");
    openCellWithYourClass(cellX + 1, cellY - 1, "flag");
    openCellWithYourClass(cellX + 1, cellY + 1, "flag");
  }
};
// x座標、y座標、クラス名にあったセルを自動でクリック
const openCellWithYourClass = (cellX, cellY, nameOfClass) => {
  if (
    cellX >= 0 &&
    cellX < TABLE_WIDTH &&
    cellY >= 0 &&
    cellY < TABLE_HEIGHT &&
    !document
      .querySelector(`#cell${cellY}${cellX}`)
      .classList.contains(nameOfClass)
  ) {
    document.querySelector(`#cell${cellY}${cellX}`).click();
  }
};
// 周囲8マスの旗の数を数える
const countSurroundingflags = (cellX, cellY) => {
  let count = 0;
  if (cellX > 0) {
    if (
      document
        .querySelector(`#cell${cellY}${cellX - 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellY > 0) {
    if (
      document
        .querySelector(`#cell${cellY - 1}${cellX}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellX < TABLE_WIDTH - 1) {
    if (
      document
        .querySelector(`#cell${cellY}${cellX + 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellY < TABLE_HEIGHT - 1) {
    if (
      document
        .querySelector(`#cell${cellY + 1}${cellX}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  // 斜め方向
  if (cellX > 0 && cellY > 0) {
    if (
      document
        .querySelector(`#cell${cellY - 1}${cellX - 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellX > 0 && cellY < TABLE_HEIGHT - 1) {
    if (
      document
        .querySelector(`#cell${cellY + 1}${cellX - 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellX < TABLE_WIDTH - 1 && cellY > 0) {
    if (
      document
        .querySelector(`#cell${cellY - 1}${cellX + 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  if (cellX < TABLE_WIDTH - 1 && cellY < TABLE_HEIGHT - 1) {
    if (
      document
        .querySelector(`#cell${cellY + 1}${cellX + 1}`)
        .classList.contains("flag")
    ) {
      count++;
    }
  }
  return count;
};
// テーブル、爆弾の設置
const init = () => {
  // プレイ用テーブル作成
  const body = document.querySelector("body");
  const table = document.createElement("table");
  for (let i = 0; i < TABLE_HEIGHT; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < TABLE_WIDTH; j++) {
      const td = document.createElement("td");
      td.id = `cell${i}${j}`;
      td.classList.add("unopened");
      td.addEventListener("click", tdOnClick, false);
      td.addEventListener("contextmenu", tdRightClick, false);
      td.addEventListener("dblclick", tdDoubleClick, false);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  body.appendChild(table);
  // 爆弾20個作成
  const bombs = [];
  for (let i = 0; i < NUMBER_OF_BOMBS; i++) {
    let aBomb;
    do {
      //FIX: 100を変数に
      aBomb = ("0" + Math.floor(Math.random() * 100).toString()).slice(-2);
    } while (bombs.indexOf(aBomb) !== -1);
    bombs.push(aBomb);
  }
  // 爆弾周りの数値計算用配列の初期化
  const fieldArr = new Array(TABLE_HEIGHT);
  for (let y = 0; y < TABLE_HEIGHT; y++) {
    fieldArr[y] = new Array(TABLE_WIDTH).fill(0);
  }
  for (let i = 0; i < TABLE_HEIGHT; i++) {
    for (let j = 0; j < TABLE_WIDTH; j++) {
      fieldArr[i][j] = 1;
    }
  }
  // 爆弾の周りを×2
  for (let bomb of bombs) {
    const bombX = bomb.charAt(1);
    const bombY = bomb.charAt(0);
    fieldArr[bombY][bombX] = 0;
    // 十字方向
    if (bombX > 0) {
      fieldArr[bombY][+bombX - 1] *= 2;
    }
    if (bombY > 0) {
      fieldArr[+bombY - 1][bombX] *= 2;
    }
    if (bombX < TABLE_WIDTH - 1) {
      fieldArr[bombY][+bombX + 1] *= 2;
    }
    if (bombY < TABLE_HEIGHT - 1) {
      fieldArr[+bombY + 1][bombX] *= 2;
    }
    // 斜め方向
    if (bombX > 0 && bombY > 0) {
      fieldArr[+bombY - 1][+bombX - 1] *= 2;
    }
    if (bombX > 0 && bombY < TABLE_HEIGHT - 1) {
      fieldArr[+bombY + 1][+bombX - 1] *= 2;
    }
    if (bombX < TABLE_WIDTH - 1 && bombY > 0) {
      fieldArr[+bombY - 1][+bombX + 1] *= 2;
    }
    if (bombX < TABLE_WIDTH - 1 && bombY < TABLE_HEIGHT - 1) {
      fieldArr[+bombY + 1][+bombX + 1] *= 2;
    }
  }
  // 数字に応じてクラスを設定
  for (let i = 0; i < TABLE_HEIGHT; i++) {
    for (let j = 0; j < TABLE_WIDTH; j++) {
      const td = document.querySelector(`#cell${i}${j}`);
      switch (fieldArr[i][j]) {
        case 0:
          td.innerText = "●";
          td.classList.add("haveBomb");
          break;
        case 1:
          td.innerText = "";
          td.classList.add("blank");
          break;
        default:
          td.innerText = `${Math.log(fieldArr[i][j]) / Math.log(2)}`;
          td.classList.add("haveNum");
          break;
      }
    }
  }

  const log = document.createElement("div");
  log.id = "log";
  log.innerText = "開けたマス：0";
  body.appendChild(log);

  currentStatus = GAME_STATUS.BEFORE_START;
};

window.onload = () => {
  init();
};
