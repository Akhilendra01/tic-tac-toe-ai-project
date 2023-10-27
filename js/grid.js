const matrix = document.createElement("table");
const moveLabel = document.querySelector("h1");
const board = new Array(9);
for (let i = 0; i < 9; i++) board[i] = -1;
let symbol = 1,
  startHuman = 1,
  human = 0,
  computer = 0;

const magic = [8, 3, 4, 1, 5, 9, 6, 7, 2];
const pos = {};
for (let i = 0; i < 9; i++) pos[magic[i]] = i;

const newGameButton = document.querySelector(".new_game");

function count() {
  let c = 0;
  for (let i = 0; i < 9; i++) if (board[i] === -1) c++;
  return c;
}

function checkWin(symbol) {
  for (let i = 0; i < 9; i++)
    for (let j = i + 1; j < 9; j++)
      for (let k = j + 1; k < 9; k++) {
        if (
          board[i] === symbol &&
          board[j] === symbol &&
          board[k] == symbol &&
          magic[i] + magic[j] + magic[k] === 15
        ) {
          return true;
        }
      }
  return false;
}

function move(comp) {
  //empty board
  if (count() === 9) {
    board[4] = 0;
    return;
  }
  //if comp first move is second
  if (count() === 8) {
    if (board[4] === 1 - comp) {
      board[0] = comp;
      return;
    }
    const candidates = [4, 1, 3, 5, 7];
    for (let key of candidates) {
      if (board[key] === -1) {
        board[key] = comp;
        return;
      }
    }
  }

  // win in 1 move for comp exists
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      for (let k = 0; k < 9; k++) {
        if (i == j || j == k || k == i) continue;
        if (
          board[i] === comp &&
          board[j] == comp &&
          board[k] === -1 &&
          magic[i] + magic[j] + magic[k] === 15
        ) {
          board[k] = 0;
          return;
        }
      }

  //stop opponents win in 1 move for opponent exists
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      for (let k = 0; k < 9; k++) {
        if (i == j || j == k || k == i) continue;
        if (
          board[i] === 1 - comp &&
          board[j] == 1 - comp &&
          board[k] === -1 &&
          magic[i] + magic[j] + magic[k] === 15
        ) {
          board[k] = 0;
          return;
        }
      }
    }
  }

  //check if opponent has force win in 2 and stop it
  for (let i = 0; i < 9; i++) {
    if (board[i] !== -1) continue; //box should be empty
    let c = 0;
    for (let j = 0; j < 9; j++)
      for (let k = 0; k < 9; k++) {
        if (i == j || j == k || k == i) continue;
        if (board[j] !== 1 - comp || board[k] !== 1 - comp) continue;
        let p1 = pos[15 - magic[i] - magic[j]];
        let p2 = pos[15 - magic[i] - magic[k]];
        if (
          p1 !== i &&
          p1 !== j &&
          p1 !== k &&
          p2 !== i &&
          p2 !== j &&
          p2 !== k
        )
          if (p1 >= 0 && board[p1] == -1 && p2 >= 0 && board[p2] == -1) {
            board[i] = comp;
            return;
          }
      }
  }

  //checking if a win in 2 can be forced over opponent
  for (let i = 0; i < 9; i++) {
    if (board[i] !== -1) continue; //box should be empty
    let c = 0;
    for (let j = 0; j < 9; j++)
      for (let k = 0; k < 9; k++) {
        if (i == j || j == k || k == i) continue;
        if (board[j] !== comp || board[k] !== comp) continue;
        let p1 = pos[15 - magic[i] - magic[j]];
        let p2 = pos[15 - magic[i] - magic[k]];
        if (
          p1 !== i &&
          p1 !== j &&
          p1 !== k &&
          p2 !== i &&
          p2 !== j &&
          p2 !== k
        )
          if (p1 >= 0 && board[p1] == -1 && p2 >= 0 && board[p2] == -1) {
            board[i] = comp;
            return;
          }
      }
  }
  for (let i = 0; i < 9; i++) {
    if (board[i] === -1) {
      board[i] = comp;
      return;
    }
  }
}

function render() {
  const btns = document.querySelectorAll(".cell");
  for (let i = 0; i < 9; i++) {
    if (board[i] === 1) {
      btns[i].innerText = "X";
      btns[i].classList.add("red");
      btns[i].classList.add("disabled-cell");
    }
    if (board[i] === 0) {
      btns[i].innerText = "O";
      btns[i].classList.add("green");
      btns[i].classList.add("disabled-cell");
    } else {
      board[i].innerText = "";
    }
    btns[i].disabled = board[i] !== -1;
  }
}

function disable() {
  const btns = document.querySelectorAll(".cell");
  for (let btn of btns) {
    btn.disabled = true;
    btn.classList.add("disabled-cell");
  }

  newGameButton.disabled = false;
}

newGameButton.addEventListener("click", async () => {
  for (let i = 0; i < 9; i++) board[i] = -1;
  if (startHuman) {
    move();
  }
  const btns = document.querySelectorAll(".cell");
  for (let btn of btns) {
    btn.classList.remove("disabled-cell");
    btn.classList.remove("red");
    btn.classList.remove("green");
    btn.disabled = false;
    btn.innerText = "";
  }
  moveLabel.innerText = "Your Turn";
  await render();
  startHuman = 1 - startHuman;
});

matrix.classList.add("container");

for (let i = 0; i < 3; i++) {
  const row = document.createElement("tr");
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    button.classList.add("cell");
    button.addEventListener("click", async function () {
      board[i * 3 + j] = symbol;
      this.disabled = true;
      this.classList.add("disabled-cell");
      move(1 - symbol);
      render();
      let win = checkWin(symbol);
      if (win) {
        moveLabel.innerText = "Win X";
        disable();
        human++;
        return;
      }

      win = checkWin(1 - symbol);
      if (win) {
        moveLabel.innerText = "Win O";
        computer++;
        disable();
        return;
      }
      moveLabel.innerText =
        count() !== 9 ? "Your Turn" : win ? "Game Over" : "Draw";
      if (count() === 9) {
        newGameButton.disabled = false;
      }
    });

    cell.appendChild(button);
    row.appendChild(cell);
  }
  matrix.appendChild(row);
}

document.body.appendChild(matrix);
