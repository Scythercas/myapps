window.onload = () => {
  const dice1 = document.querySelector("#dice1");
  const dice2 = document.querySelector("#dice2");
  const dice3 = document.querySelector("#dice3");
  const diceBoxes = [dice1, dice2, dice3];
  const decideBut = document.querySelector("#decide");
  const scoreTds = Array.from(document.querySelectorAll(".scoreTd"));
  let dices = [];
  let copyDices = [];
  let turn = 1;

  const play = () => {
    dices = [];
    copyDices = [];
    for (let i = 0; i <= 2; i++) {
      dices.push(random(1, 3));
    }
    copyDices = [...dices];
    //各ダイスに目の値とchangeDice関数を設定
    diceBoxes.forEach((element) => {
      element.innerText = copyDices.shift();
      element.removeEventListener("click", changeDice);
      element.addEventListener("click", changeDice, false);
    });
    //振り直さなかった場合のnoChangeDice関数を設定
    decideBut.removeEventListener("click", noChangeDice);
    decideBut.addEventListener("click", noChangeDice, false);
  };

  const changeDice = (index) => {
    let elmIdx = index.srcElement.id.slice(-1) - 1;
    let changedNum = random(1, 3);
    dices[elmIdx].innerText = changedNum;
    dices[elmIdx] = changedNum;
    writeScore(dices);
  };

  const noChangeDice = () => {
    writeScore(dices);
  };

  const writeScore = (dices) => {
    let sum = 0;
    dices.forEach((element) => {
      sum += element;
    });
    let score = sum + bonus(dices);
    switch (score - sum) {
      case 10:
        alert("YATHZEE !!!");
        break;
      case 5:
        alert("Straight !!");
        break;
      case 3:
        alert("Regoll !");
        break;
    }
    scoreTds[turn - 1].innerText = score;

    if (turn < 6) {
      turn += 1;
      play();
    } else {
      result();
    }
  };

  const bonus = (dices) => {
    let bonusPoints = 0;
    const dice1 = dices[0];
    const dice2 = dices[1];
    const dice3 = dices[2];

    if (dice1 == dice2 && dice2 == dice3) {
      bonusPoints += 10;
    } else if (dice1 !== dice2 && dice2 !== dice3 && dice3 !== dice1) {
      bonusPoints += 5;
    } else if (dice1 !== 2 && dice2 !== 2 && dice3 !== 2) {
      bonusPoints += 3;
    }

    return bonusPoints;
  };

  const result = () => {
    const myScore = document.querySelector("#playersScore");
    const cpusScore = document.querySelector("#CPUsScore");
    const scores = Array.from(document.querySelectorAll(".scoreTd"));
    let myPoints =
      Number(scores[0].innerText) +
      Number(scores[2].innerText) +
      Number(scores[4].innerText);
    let cpuPoints =
      Number(scores[1].innerText) +
      Number(scores[3].innerText) +
      Number(scores[5].innerText);
    myScore.innerText = myPoints;
    cpusScore.innerText = cpuPoints;
    decideBut.disabled = true;

    dice1.innerText = "お";
    dice2.innerText = "わ";
    dice3.innerText = "り";
    diceBoxes.forEach((element) => {
      element.removeEventListener("click", changeDice);
      element.style.backgroundColor = "white";
    });
    decideBut.innerText = "また遊んでね";
  };

  const random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  play();
};
