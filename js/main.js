const userInput = document.getElementById("x");
const serverResponse = document.getElementById("y");
const chart = document.getElementById("resultChart");

const spinner = document.getElementById("spinner");
const chartSpinner = document.getElementById("chartSpinner");

const errorBox = document.getElementById("errorBox");
const errorFiftyBox = document.getElementById("errorFiftyBox");
const errorFifty = document.getElementById("errorFifty");

const checkbox = document.getElementById("checkbox");
const checkboxContainer = document.getElementById("checkboxContainer");

let x;

function resetChart() {
	chart.classList.replace("show", "hide");
}

/* rework*/
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

function localFibResponse(x) {
	hideSpinners();
	if (x == 42) {
		serverResponse.classList.replace("show", "hide");
		errorBox.classList.replace("hide", "show");
		errorBox.innerText = "Server Error: 42 is the meaning of life";
	} else if (x == 0 || x < 0) {
		serverResponse.classList.replace("show", "hide");
		errorBox.classList.replace("hide", "show");
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
				if (resp.status === 200) {
					return resp.json();
				} else {
					throw resp;
				}
			})
			.then(data => {
				hideSpinners();
				serverResponse.classList.replace("hide", "show");
				serverResponse.innerText = data.result;
			})
			.catch(err => err.text())
			.then(errorMessage => {
				errorBox.classList.add("show");
				hideSpinners();
				if (x == 42) {
					errorBox.innerText = `Server Error: ${errorMessage}`;
				} else if (x == 0 || x < 0) {
					errorBox.innerText = "Please enter a valid number!";
				}
			});
	}
}

function sortByDate(array) {
	array.sort(function(a, b) {
		return new Date(b.createdDate) - new Date(a.createdDate);
	});
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
			sortByDate(jsonArray);

			for (let i = 0; i < jsonArray.length; i++) {
				const myDiv = document.createElement("div");
				myDiv.classList.add("chart-style");

				let date = jsonArray[i].createdDate;
				let resultDate = new Date(date);

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
		errorFifty.innerHTML = "Can't be larger than 50";
	} else {
		spinner.classList.add("hide");
		fibServerRequest();
	}

	resultChartRequest();
});
