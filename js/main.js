const docY = document.getElementById("y");
let x = 8;

function serverRequest() {
	let ourServer = "http://localhost:5050/fibonacci/" + x;

	document.getElementById("errorMessage").style.display = "none";
	fetch(ourServer)
		.then(resp => {
			//I think notation is alt to saying function(resp)
			return resp.json();
		}) // Transform the data into json (which is a format for storing and transporting data)
		.then(data => {
			console.log(data);
			docY.innerText = data.result;
		});
}

calcButton.addEventListener("click", () => {
	x = document.getElementById("x").value;

	if (x > 50) {
		document.getElementById("y").style.display = "none";
		document.getElementById("errorMessage").style.display = "block";
		document.getElementById("error").innerHTML = "Can't be larger than 50";
	} else {
		serverRequest();
	}
});
