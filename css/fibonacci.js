let x = 8;

function fibonacci(x) {
	let prev1 = 0;
	let prev2 = 1;
	let y;

	for (let i = 2; i <= l; i++) {
		y = prev1 + prev2;
		prev1 = prev2;
		prev2 = y;
	}
	return y;
}

let y = fibonacci(x);

console.log(y);

document.getElementById(
	"declare-fig"
).innerText = `The Fibonnaci of ${x} is ${y}`;
