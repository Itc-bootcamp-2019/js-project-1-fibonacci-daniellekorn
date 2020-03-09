const userInput = document.getElementById("x");
const serverResponse = document.getElementById("y");
const chart = document.getElementById("resultChart");

const spinner = document.getElementById("spinner");
const chartSpinner = document.getElementById("chartSpinner");

const errorBox = document.getElementById("errorBox");
const errorFiftyBox = document.getElementById("errorFiftyBox");

const checkbox = document.getElementById("checkbox");
const checkboxContainer = document.getElementById("checkboxContainer");

const dropdown = document.getElementById("dropdown");

let x;

function resetChart() {
	chart.classList.replace("show", "hide");
}

function hideSpinners() {
	spinner.classList.add("hide");
	chartSpinner.classList.add("hide");
}

function clearOldContent() {
	errorFiftyBox.classList.add("hide");
	serverResponse.classList.replace("show", "hide");
	userInput.classList.remove("user-input-error");
	errorBox.classList.replace("show", "hide");
}

function clearHistory() {
	let child = chart.lastElementChild;
	while (child) {
		chart.removeChild(child);
		child = chart.lastElementChild;
	}
}

function errorStyle() {
	userInput.classList.add("user-input-error");
	serverResponse.classList.replace("show", "hide");
	errorBox.classList.replace("hide", "show");
}

function localFibResponse(x) {
	hideSpinners();
	if (x == 42) {
		errorStyle();
		errorBox.innerText = "Server Error: 42 is the meaning of life";
	} else if (x == 0 || x < 0) {
		errorStyle();
		errorBox.innerText = "Please enter a valid number!";
	} else {
		serverResponse.classList.replace("hide", "show");
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
}

let checked;
checkbox.addEventListener("change", event => {
	if (event.target.checked) {
		console.log("checked");
		checked = true;
	} else {
		console.log("not checked");
		checked = false;
	}
});

function fibServerRequest() {
	clearOldContent();

	if (!checked) {
		/*Runs my local server if checkbox unchecked and presents results*/
		serverResponse.classList.replace("hide", "show");
		serverResponse.innerText = localFibResponse(x);
	} else if (checked) {
		/*if checkbox is checked it will make a call to the server*/
		let ourServer = "http://localhost:5050/fibonacci/" + x;

		spinner.classList.toggle("hide");
		fetch(ourServer)
			.then(resp => {
				if (resp.ok) {
					return resp.json();
				} else {
					resp.text().then(text => {
						errorStyle();
						errorBox.innerText = `Server Error: ${text}`;
					});
				}
			})
			.then(data => {
				hideSpinners();
				serverResponse.classList.replace("hide", "show");
				serverResponse.innerText = data.result;
				resultChartRequest();
			});
	}
}

function sort(array) {
	/*Number Asc*/
	if (dropdown.value == 1) {
		array.sort(function(a, b) {
			return a.number - b.number;
		});
		/*Number Desc*/
	} else if (dropdown.value == 2) {
		array.sort(function(a, b) {
			return b.number - a.number;
		});
		/*Date Asc*/
	} else if (dropdown.value == 3) {
		array.sort(function(a, b) {
			return new Date(a.createdDate) - new Date(b.createdDate);
		});
		/*Date Desc (this is default as well, in the case that nothing is selected*/
	} else {
		array.sort(function(a, b) {
			return new Date(b.createdDate) - new Date(a.createdDate);
		});
	}
}

function resultChartRequest() {
	let secondServer = "http://localhost:5050/getFibonacciResults";
	chartSpinner.classList.remove("hide");

	fetch(secondServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			chartSpinner.classList.add("hide");

			const jsonArray = data.results;
			console.log(jsonArray);
			sort(jsonArray);

			for (let i = 0; i < jsonArray.length; i++) {
				const myDiv = document.createElement("div");
				myDiv.classList.add("chart-style");
				let resultDate = new Date(jsonArray[i].createdDate);

				myDiv.innerHTML = `The Fibonacci Of <strong>${jsonArray[i].number}</strong> is 
						<strong>${jsonArray[i].result}</strong>. Calculated at: ${resultDate}`;

				chart.append(myDiv);
			}
		});

	chart.classList.remove("hide");
}

window.onload = resultChartRequest;
calcButton.addEventListener("click", clearHistory);
calcButton.addEventListener("click", resetChart);

calcButton.addEventListener("click", () => {
	x = document.getElementById("x").value;

	if (x > 50) {
		hideSpinners();
		clearOldContent();

		userInput.classList.add("user-input-error");
		errorFiftyBox.classList.toggle("hide");
		errorFiftyBox.innerHTML = "Can't be larger than 50";
	} else {
		spinner.classList.add("hide");
		fibServerRequest();
	}
});
