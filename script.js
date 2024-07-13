var arr = [[], [], [], [], [], [], [], [], []];

// Initialize arr with DOM elements
for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j];
			} else {
				arr[i][j].innerText = '';
			}
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response);
		console.log(response);
		board = response.board;
		FillBoard(board);
	};
	xhrRequest.open('GET', 'https://sugoku.onrender.com/board?difficulty=easy');
	// Change difficulty as needed: easy, medium, hard, random
	xhrRequest.send();
};

SolvePuzzle.onclick = () => {
	sudokuSolver(board, 0, 0, 9);
};

function isSafe(board, row, col, val, n) {
	let rn = Math.sqrt(n);
	let si = row - (row % rn);
	let sj = col - (col % rn);
	
	// Check row and column
	for (let i = 0; i < n; i++) {
		if (board[row][i] == val || board[i][col] == val) {
			return false;
		}
	}
	
	// Check 3x3 submatrix
	for (let x = si; x < si + rn; x++) {
		for (let y = sj; y < sj + rn; y++) {
			if (board[x][y] == val) {
				return false;
			}
		}
	}
	
	return true;
}

function sudokuSolver(board, row, col, n) {
	// Base case: If all rows are filled
	if (row == n) {
		FillBoard(board);
		return true;
	}

	// Move to the next column if current cell is already filled
	if (col == n) {
		return sudokuSolver(board, row + 1, 0, n);
	}

	// Skip if cell is already filled
	if (board[row][col] != 0) {
		return sudokuSolver(board, row, col + 1, n);
	}

	// Try placing values 1 to 9
	for (let val = 1; val <= 9; val++) {
		if (isSafe(board, row, col, val, n)) {
			board[row][col] = val;
			if (sudokuSolver(board, row, col + 1, n)) {
				return true;
			}
			// Backtrack
			board[row][col] = 0;
		}
	}

	return false;
}
