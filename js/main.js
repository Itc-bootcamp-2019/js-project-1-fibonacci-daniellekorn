const docY = document.getElementById("y");
const errorFortyTwo = document.getElementById("errorFortyTwo");
const errorOverFifty = document.getElementById("error");

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
			document.getElementById("spinner").style.display = "none";
			docY.innerText = data.result;
		})
		.catch(error => {
			let errorMessage = "Server error: 42 is the meaning of life";
			errorFortyTwo.style.display = "inline-block";
			errorFortyTwo.innerText = errorMessage;
		});
}

function clearMessages() {
	if (errorFortyTwo) {
		errorFortyTwo.style.display = "none";
	} else if (docY) {
		docY.style.display = "none";
	} else if (errorOverFifty.style.display === "inline-block") {
		errorOverFifty.style.display = "none";
	}
}

calcButton.addEventListener("click", () => {
	clearMessages();

	x = document.getElementById("x").value;

	if (x > 50) {
		document.getElementById("y").style.display = "none";
		document.getElementById("errorMessage").style.display = "block";
		errorOverFifty.innerHTML = "Can't be larger than 50";
	} else {
		document.getElementById("spinner").style.display = "display-block";
		serverRequest();
	}
});
