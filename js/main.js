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

calcButton.addEventListener("click", () => {
	let x = document.getElementById("x").value;
	let y = fibonacci(x);

	const docY = document.getElementById("y");
	docY.innerText = y;
});
