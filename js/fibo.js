function fibonacci(x) {
	let first = 0;
	let second = 1;
	let y;

	for (let i = 2; i <= x; i++) {
		y = first + second;
		first = second;
		second = y;
	}
	return y;
}

/* Declare variables to run function*/
let x = 10;
let y = fibonacci(x);

const docX = document.getElementById("x");
const docY = document.getElementById("y");
docX.innerText = x;
docY.innerText = y;
