const docY = document.getElementById("y");
const errorFortyTwo = document.getElementById("errorFortyTwo");
const spinner = document.getElementById("spinner");
const errorFiftyBox = document.getElementById("errorFiftyBox");
const errorFifty = document.getElementById("errorFifty");
const userInput = document.getElementById("x");

let x;

function clearOldContent() {
	errorFiftyBox.style.display = "none";
	docY.style.display = "none";
	errorFortyTwo.innerText = "";
	userInput.classList.remove("user-input-error");
}

function serverRequest() {
	let ourServer = "http://localhost:5050/fibonacci/" + x;

	clearOldContent();

	fetch(ourServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			console.log(data);
			document.getElementById("spinner").style.display = "none";
			docY.style.display = "inline-block";
			docY.innerText = data.result;
		})
		.catch(error => {
			document.getElementById("spinner").style.display = "none";
			const errorMessage = "Server error: 42 is the meaning of life";
			errorFortyTwo.innerText = errorMessage;
		});
}

calcButton.addEventListener("click", () => {
	x = document.getElementById("x").value;

	if (x > 50) {
		clearOldContent();
		userInput.classList.add("user-input-error");
		errorFiftyBox.style.display = "block";
		errorFifty.innerHTML = "Can't be larger than 50";
	} else {
		document.getElementById("spinner").style.display = "inline-block";
		serverRequest();
	}
});
