const docY = document.getElementById("y");
const x = 8;
const x2 = document.getElementById("x").value;

const ourServer = "http://localhost:5050/fibonacci/" + x2;
//IDEA: + .toString;

fetch(ourServer)
	.then(resp => {
		//I think notation is alt to saying function(resp)
		return resp.json();
	}) // Transform the data into json (which is a format for storing and transporting data)
	.then(data => {
		console.log(data);
		docY.innerText = data[0];

		//let y = data.results;
	});

console.log(x2);
//function fib(x) {}

//calcButton.addEventListener("click", () => {
//	fib(x);
//});

//	let x = document.getElementById("x").value;
//	let y = fibonacci(x);
//
//
//});
