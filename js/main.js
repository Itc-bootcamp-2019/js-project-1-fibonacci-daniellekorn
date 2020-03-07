const userInput = document.getElementById("x");
const serverResponse = document.getElementById("y");
const chart = document.getElementById("resultChart");

const spinner = document.getElementById("spinner");
const resultSpinner = document.getElementById("resultSpinner");

const errorFortyTwo = document.getElementById("errorFortyTwo");
const errorFiftyBox = document.getElementById("errorFiftyBox");
const errorFifty = document.getElementById("errorFifty");

let x;

function clearOldContent() {
	errorFiftyBox.classList.add("hide");
	serverResponse.classList.replace("show", "hide");
	errorFortyTwo.innerText = "";
	userInput.classList.remove("user-input-error");
}

function resetChart() {
	chart.classList.replace("show", "hide");
}

function toggleSpinners() {
	spinner.classList.toggle("hide");
	resultSpinner;
	/*also for result spinner or use class?*/
}

function fibRequest() {
	let ourServer = "http://localhost:5050/fibonacci/" + x;

	clearOldContent();

	fetch(ourServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			console.log(data);
			document.getElementById("spinner").style.display = "none";
			serverResponse.classList.replace("hide", "show");
			serverResponse.innerText = data.result;
		});
	/*.catch(err => err.text()).then(errorMessage => {
			if (x == 42) {
				serverResponse.innerText = `Server Error: ${errorMessage}`;
			} else if (x == 0 || x < 0) {
				serverResponse.innerText = "Please enter a valid number!";
			}
		});*/
}

/* look at how to do this*/
function verifyJson(str) {
	try {
		JSON.parse(str);
	} catch (err) {
		return false;
	}
	return true;
}

function listRequest() {
	let secondServer = "http://localhost:5050/getFibonacciResults";

	fetch(secondServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			document.getElementById("resultSpinner").style.display = "none";

			const jsonArray = data.results;
			sortByDate(jsonArray);
			chart.classList.remove("hide");

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
}

function sortByDate(array) {
	array.sort(function(a, b) {
		return new Date(b.createdDate) - new Date(a.createdDate);
	});
}

function clearHistory() {
	let child = chart.lastElementChild;
	while (child) {
		chart.removeChild(child);
		child = chart.lastElementChild;
	}
}

window.onload = listRequest;
calcButton.addEventListener("click", clearHistory);

calcButton.addEventListener("click", () => {
	resetChart();

	x = document.getElementById("x").value;

	if (x > 50) {
		clearOldContent();
		userInput.classList.add("user-input-error");
		errorFiftyBox.style.display = "block";
		errorFifty.innerHTML = "Can't be larger than 50";
	} else {
		document.getElementById("spinner").style.display = "inline-block";
		fibRequest();
	}

	listRequest();
});
