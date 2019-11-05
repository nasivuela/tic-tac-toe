const squares = document.querySelectorAll('.square');

const config = [
  { i: 1, r: 1 }, // rows
  { i: 3, r: -5 }, // columns
  { i: 4, r: 0 }, // cross
  { i: 2, r: 0, in: 2 } // cross
];
const slots = Array.from({ length: 9 });
const SLOTS_ON_LINE = 3;

const cross = 'X';
const circle = 'O';

let currentSymbol = cross;
let playing = true;
let winner = false;

const toggleSymbol = () => {
  currentSymbol = currentSymbol === cross ? circle : cross;
};

const mark = pos => {
  slots[pos] = currentSymbol;
};

const lineMatch = line => {
  let symbol = line[0];
  for (let i = 0; i < line.length; i++) {
    if (!symbol || symbol !== line[i]) {
      return false;
    }
  }
  return symbol;
};

const checkLines = (increment, restart, initial = 0) => {
  let symbols = [];
  let i = initial;
  while (i < slots.length) {
    symbols[symbols.length] = slots[i];
    let match = symbols.length === SLOTS_ON_LINE ? lineMatch(symbols) : false;

    if (symbols.length === SLOTS_ON_LINE && match) {
      return match;
    } else if (symbols.length === SLOTS_ON_LINE && !restart) {
      return false;
    } else if (symbols.length === SLOTS_ON_LINE && !match) {
      symbols = [];
      i = i + restart;
    } else {
      i = i + increment;
    }
  }
  return false;
};

const stop = () => {
  playing = false;
  console.log(winner ? `${winner} wins` : 'empate');
};

const checkGame = () => {
  for (const dir of config) {
    winner = checkLines(dir.i, dir.r, dir.in || 0);
    if (winner) {
      stop();
      break;
    }
  }
};

const check = () => {
  checkGame();
  if (slots.every(slot => !!slot)) {
    stop();
  }
};

const handleSquareClick = e => {
  if (!playing) {
    for (const square of squares) {
      square.removeEventListener('click', handleSquareClick);
    }
    return;
  }
  const currentSquare = e.currentTarget;
  if (currentSquare.classList.contains('mark')) {
    return;
  }
  currentSquare.innerHTML = currentSymbol;
  mark(currentSquare.dataset.position);
  check();
  toggleSymbol();
};

function init() {
  for (const square of squares) {
    square.addEventListener('click', handleSquareClick);
  }
}

init();
