const docY = document.getElementById("y");
const errorFortyTwo = document.getElementById("errorFortyTwo");
let x = 8;

function serverRequest() {
	let ourServer = "http://localhost:5050/fibonacci/" + x;

	document.getElementById("errorMessage").style.display = "none";
	fetch(ourServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			console.log(data);
			docY.innerText = data.result;
		})
		.catch(error => {
			let errorMessage = "Server error: 42 is the meaning of life";
			errorFortyTwo.innerText = errorMessage;
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
