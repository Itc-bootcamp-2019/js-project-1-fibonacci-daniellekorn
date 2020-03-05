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
			const errorMessage = "Server error: 42 is the meaning of life";
			errorFortyTwo.innerText = errorMessage;
		});
}

function listRequest() {
	let secondServer = "http://localhost:5050/getFibonacciResults";

	fetch(secondServer)
		.then(resp => {
			return resp.json();
		})
		.then(data => {
			const jsonArray = data.results;
			console.log(jsonArray);
			const chart = document.getElementById("resultChart");

			for (let i = 0; i < jsonArray.length; i++) {
				const myDiv = document.createElement("div");
				let date = jsonArray[i].createdDate;
				let resultDate = new Date(date);
				myDiv.innerHTML = `The Fibonnaci Of ${jsonArray[i].number} is ${jsonArray[i].result}. Calculated at: ${resultDate}`;
				chart.append(myDiv);
			}
		});
}

/*Format:
 The Fibonnaci Of 8 is 21. 
Calculated at: Thu Feb 2 2020 10:33:24 GMT+0200 (Israel Standard Time) */

window.onload = listRequest;

calcButton.addEventListener("click", () => {
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
});
