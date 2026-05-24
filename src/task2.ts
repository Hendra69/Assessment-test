const grid = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '.', '.', '.', '.', '.', '.', '.', '#'],
  ['#', '.', '#', '#', '#', '#', '.', '.', '#'],
  ['#', '.', '.', '.', '#', '.', '#', '#', '#'],
  ['#', 'X', '#', '.', '.', '.', '.', '.', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
];

// jumlah langkah
const up = 3;
const right = 6;
const down = 1;

// cari posisi awal player (X)
let playerRow = 0;
let playerCol = 0;

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    if (grid[row][col] === 'X') {
      playerRow = row;
      playerCol = col;
    }
  }
}

// function movement
function move(
  row: number,
  col: number,
  direction: 'up' | 'right' | 'down',
  totalStep: number,
) {
  let currentRow = row;
  let currentCol = col;

  for (let step = 0; step < totalStep; step++) {
    // gerak ke atas
    if (direction === 'up') {
      currentRow--;
    }

    // gerak ke kanan
    if (direction === 'right') {
      currentCol++;
    }

    // gerak ke bawah
    if (direction === 'down') {
      currentRow++;
    }

    // cek keluar map
    const isOutsideMap =
      currentRow < 0 ||
      currentRow >= grid.length ||
      currentCol < 0 ||
      currentCol >= grid[0].length;

    if (isOutsideMap) {
      return null;
    }

    // cek obstacle
    if (grid[currentRow][currentCol] === '#') {
      return null;
    }
  }

  return {
    row: currentRow,
    col: currentCol,
  };
}

// langkah 1 → up
const moveUp = move(playerRow, playerCol, 'up', up);

if (!moveUp) {
  console.log('Path UP tidak valid');
  process.exit();
}

// langkah 2 → right
const moveRight = move(moveUp.row, moveUp.col, 'right', right);

if (!moveRight) {
  console.log('Path RIGHT tidak valid');
  process.exit();
}

// langkah 3 → down
const moveDown = move(moveRight.row, moveRight.col, 'down', down);

if (!moveDown) {
  console.log('Path DOWN tidak valid');
  process.exit();
}

// tandai lokasi item dengan $
grid[moveDown.row][moveDown.col] = '$';

// tampilkan koordinat item
console.log('Kemungkinan lokasi item:');
console.log(`(${moveDown.row}, ${moveDown.col})`);

// tampilkan grid
console.log('\nGrid:\n');

for (const row of grid) {
  console.log(row.join(' '));
}