const docY = document.getElementById("y");
const errorFortyTwo = document.getElementById("errorFortyTwo");
const spinner = document.getElementById("spinner");
const errorFiftyBox = document.getElementById("errorFiftyBox");
const errorFifty = document.getElementById("errorFifty");
const userInput = document.getElementById("x");
const chart = document.getElementById("resultChart");

/*use this throughout loaderTimeline.classList.replace('hide', 'show');*/

let x;

function clearOldContent() {
	errorFiftyBox.style.display = "none";
	docY.style.display = "none";
	errorFortyTwo.innerText = "";
	userInput.classList.remove("user-input-error");
}

function resetChart() {
	chart.classList.add("hide");
}

/* NEED TO WORK ON THIS*/
function toggleSpinner() {
	spinner.classList.toggle("hide");
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
			docY.style.display = "inline-block";
			docY.innerText = data.result;
		})
		.catch(error => {
			document.getElementById("spinner").style.display = "none";
			/* fix this*/
			const errorMessage = "Server error: 42 is the meaning of life";
			errorFortyTwo.innerText = errorMessage;
		});
}

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
