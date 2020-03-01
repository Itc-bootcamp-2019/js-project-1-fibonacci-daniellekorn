function fibonacci(x) {
	let prev1 = 0;
	let prev2 = 1;
	let y;

	for (let i = 2; i <= x; i++) {
		y = prev1 + prev2;
		prev1 = prev2;
		prev2 = y;
	}
	return y;
}

/* Declare variables to run function*/

let x = 10;
let y = fibonacci(x);

document.getElementById(
	"declare-fib"
).innerText = `The Fibonacci of ${x} is ${y}`;
