const docY = document.getElementById("y");
let x = 8;

calcButton.addEventListener("click", () => {
	x = document.getElementById("x").value;

	let ourServer = "http://localhost:5050/fibonacci/" + x;

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
});
