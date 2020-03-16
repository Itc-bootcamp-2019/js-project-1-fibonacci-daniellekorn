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
	let results = data.results;
	sort(results);

	let resultsString = "";
	for (let item of results) {
		let date = item.createdDate;
		let resultDate = new Date(date);
		resultsString += `<div class="chart-style">The Fibonacci Of <strong>${item.number}</strong> is 
				<strong>${item.result}</strong>. Calculated at: ${resultDate}</div>`;
	}
	chart.innerHTML = resultsString;
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
