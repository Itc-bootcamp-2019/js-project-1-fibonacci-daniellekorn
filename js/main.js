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

function clearOldContent() {
	errorFiftyBox.classList.add("hide");
	serverResponse.classList.replace("show", "hide");
	userInput.classList.remove("user-input-error");
	errorBox.classList.remove("show");
}

function fibServerRequest() {
	let ourServer = "http://localhost:5050/fibonacci/" + x;
	clearOldContent();

	if (checkbox.checked == false) {
		spinner.classList.add("hide");
		chartSpinner.classList.add("hide");
		serverResponse.classList.replace("hide", "show");
		serverResponse.innerText = myFibResponse(x);
	} else {
		fetch(ourServer)
			.then(resp => {
				if (resp.status === 200) {
					return resp.json();
				} else {
					throw resp;
				}
			})
			.then(data => {
				console.log(data);
				spinner.classList.add("hide");
				chartSpinner.classList.add("hide");
				serverResponse.classList.replace("hide", "show");
				serverResponse.innerText = data.result;
			})
			.catch(err => err.text())
			.then(errorMessage => {
				errorBox.classList.add("show");
				if (x == 42) {
					spinner.classList.add("hide");
					errorBox.innerText = `Server Error: ${errorMessage}`;
				} else if (x == 0 || x < 0) {
					spinner.classList.add("hide");
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

function clearHistory() {
	let child = chart.lastElementChild;
	while (child) {
		chart.removeChild(child);
		child = chart.lastElementChild;
	}
}

function myFibResponse(x) {
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

window.onload = resultChartRequest;
calcButton.addEventListener("click", clearHistory);
calcButton.addEventListener("click", resetChart);

calcButton.addEventListener("click", () => {
	spinner.classList.toggle("hide");
	chartSpinner.classList.toggle("hide");

	x = document.getElementById("x").value;

	if (x > 50) {
		clearOldContent();

		spinner.classList.toggle("hide");
		checkboxContainer.classList.add("hide");

		userInput.classList.add("user-input-error");
		errorFiftyBox.classList.toggle("hide");
		errorFifty.innerHTML = "Can't be larger than 50";
	} else {
		spinner.classList.remove("hide");
		fibServerRequest();
	}

	resultChartRequest();
});
