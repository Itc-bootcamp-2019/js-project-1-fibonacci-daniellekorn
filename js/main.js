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
const numAsc = document.getElementById("numAsc");
const numDesc = document.getElementById("numDesc");
const dateAsc = document.getElementById("dateAsc");
const dateDesc = document.getElementById("dateDesc");

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
		checked = true;
	} else {
		checked = false;
	}
});

async function fibServerRequest() {
	clearOldContent();

	if (!checked) {
		/*Runs my local server if checkbox unchecked and presents results*/
		serverResponse.classList.replace("hide", "show");
		serverResponse.innerText = localFibResponse(x);
	} else if (checked) {
		/*if checkbox is checked it will make a call to the server*/
		spinner.classList.toggle("hide");
		chartSpinner.classList.remove("hide");
		let response = await fetch("http://localhost:5050/fibonacci/" + x);
		if (!response.ok) {
			let text = await response.text();
			if (x == 42) {
				spinner.classList.toggle("hide");
				errorStyle();
				errorBox.innerText = `Server Error: ${text}`;
				/* hides the 50+ error since I made a special error design for those cases*/
			} else {
				errorBox.classList.replace("show", "hide");
			}
		} else {
			resultChartRequest();
			let data = await response.json();
			hideSpinners();
			serverResponse.classList.replace("hide", "show");
			serverResponse.innerText = data.result;
		}
	}
}

function sort(array) {
	/*Number Asc*/
	if (numAsc.selected) {
		array.sort(function(a, b) {
			return a.number - b.number;
		});
		/*Number Desc*/
	} else if (numDesc.selected) {
		array.sort(function(a, b) {
			return b.number - a.number;
		});
		/*Date Asc*/
	} else if (dateAsc.selected) {
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
async function resultChartRequest() {
	chartSpinner.classList.replace("hide", "show");
	clearHistory();
	let response = await fetch("http://localhost:5050/getFibonacciResults");
	let data = await response.json();

	const jsonArray = data.results;
	sort(jsonArray);

	for (let i = 0; i < jsonArray.length; i++) {
		const containerDiv = document.createElement("div");
		containerDiv.classList.add("chart-style");

		const fibDiv = document.createElement("span");
		fibDiv.innerText = "The Fibonacci of ";
		fibDiv.classList.add("add-padding");

		const numDiv = document.createElement("span");
		numDiv.innerText = jsonArray[i].number;
		numDiv.classList.add("be-bold", "add-padding");

		const isDiv = document.createElement("span");
		isDiv.innerText = " is ";
		isDiv.classList.add("add-padding");

		const resultDiv = document.createElement("span");
		resultDiv.innerText = jsonArray[i].result;
		resultDiv.classList.add("be-bold", "add-padding");

		const calc = document.createElement("span");
		calc.innerText = " Calculated at: ";
		calc.classList.add("add-padding");

		const date = document.createElement("span");
		let resultDate = new Date(jsonArray[i].createdDate);
		date.innerText = resultDate;
		date.classList.add("add-padding", "no-overflow");

		containerDiv.append(fibDiv, numDiv, isDiv, resultDiv, calc, date);
		chart.append(containerDiv);
	}
	chartSpinner.classList.replace("show", "hide");
	chart.classList.remove("hide");
}

window.onload = resultChartRequest;
calcButton.addEventListener("click", clearHistory);
calcButton.addEventListener("click", resetChart);
dropdown.addEventListener("change", resultChartRequest);

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
