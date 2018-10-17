// For variety, using vanilla JS

const msToDisplayAnswer = 1000;
var questionList = [];
addQuestionToList('Click  1?', ' 1', ['2', '3', '4'],  '1 was the number',  '1.jpg', 10);
addQuestionToList('Click  2?', ' 2', ['1', '3', '4'],  '2 was the number',  '2.jpg', 10);
addQuestionToList('Click  3?', ' 3', ['1', '2', '4'],  '3 was the number',  '3.jpg', 10);
addQuestionToList('Click  4?', ' 4', ['1', '2', '3'],  '4 was the number',  '4.jpg', 10);
addQuestionToList('Click  5?', ' 5', ['2', '3', '4'],  '5 was the number',  '5.jpg', 10);
// addQuestionToList('Click  6?', ' 6', ['2', '3', '4'],  '6 was the number',  '6.jpg', 10);
// addQuestionToList('Click  7?', ' 7', ['2', '3', '4'],  '7 was the number',  '7.jpg', 10);
// addQuestionToList('Click  8?', ' 8', ['2', '3', '4'],  '8 was the number',  '8.jpg', 10);
// addQuestionToList('Click  9?', ' 9', ['2', '3', '4'],  '9 was the number',  '9.jpg', 10);
// addQuestionToList('Click 10?', '10', ['2', '3', '4'], '10 was the number', '10.jpg', 10);

var triviaGame = {
	correctResponses: 0,
	questionIndex: 0,
	totalQuestions: questionList.length,
	highScore: 0,
	gameDiv: document.querySelector('#trivia-container'),
	startButton: document.querySelector('#start-trivia-game'),
	startGame: function() {
		triviaGame.startButton.style.display = 'none';
		triviaGame.correctResponses = 0;
		triviaGame.questionIndex = 0;
		shuffleArray(questionList);
		triviaGame.displayQuestion();
	},
	endGame: function() {
		triviaGame.gameDiv.innerHTML = '<p>GAME OVER</p>';
		triviaGame.gameDiv.innerHTML += `<p>You got ${triviaGame.correctResponses} / ${triviaGame.totalQuestions} correct.`;
		if (triviaGame.correctResponses === triviaGame.totalQuestions) {
			triviaGame.gameDiv.innerHTML += '<p>Well played, you got a perfect score!</p>';
			triviaGame.highScore = triviaGame.correctResponses;
		}
		else if (triviaGame.correctResponses > triviaGame.highScore) {
			triviaGame.gameDiv.innerHTML += '<p>You set a new high score!</p>';
			triviaGame.highScore = triviaGame.correctResponses;
		}
		else if (triviaGame.correctResponses === triviaGame.highScore) {
			triviaGame.gameDiv.innerHTML += '<p>You have tied the high score!</p>';
		}
		else {
			triviaGame.gameDiv.innerHTML += `<p>The high score is still ${triviaGame.highScore} / ${triviaGame.totalQuestions}</p>`
		}
		triviaGame.startButton.style.display = 'block';
	},
	displayQuestion: function() {
		// Clear out trivia area and add the question:
		triviaGame.gameDiv.innerHTML = questionList[triviaGame.questionIndex].questionDiv;
		// Shuffle the order of possible answers:
		shuffleArray(questionList[triviaGame.questionIndex].responseButtons);
		// Append the randomized answer list to the trivia area:
		questionList[triviaGame.questionIndex].responseButtons.forEach(function(buttonToAppend) {
			triviaGame.gameDiv.innerHTML += buttonToAppend;
		});
		// Attach event listeners to all buttons.
		document.querySelectorAll('.response').forEach(function(button) {
			// Needs a forEach because you can't attach an event listener to a NodeList.
			button.addEventListener('click', triviaGame.guessAnswer);
		})
		clock.start(); // Start the countdown.
	},
	displayCorrectAnswer: function() {
		// Display the correct answer under the correct/incorrect text.
		triviaGame.gameDiv.innerHTML += questionList[triviaGame.questionIndex].correctAnswerDescription;
		if (triviaGame.questionIndex + 1 < questionList.length) {
			triviaGame.questionIndex++;
			// If there is another question in the list, show it after delay.
			setTimeout(triviaGame.displayQuestion, msToDisplayAnswer);
		}
		else {
			// Run endGame function, after delay.
			setTimeout(triviaGame.endGame, msToDisplayAnswer);
		}
	},
	guessAnswer: function() {
		clock.stop();
		if (event.target.id === 'correct-response') {
			triviaGame.gameDiv.innerHTML = '<h3>CORRECT :)</h3>';
			triviaGame.correctResponses++;
		}
		else {
			triviaGame.gameDiv.innerHTML = '<h3>INCORRECT :/</h3>';
		}
		triviaGame.displayCorrectAnswer();
	},
	didntGuessAnswer: function() {
		clock.stop();
		triviaGame.gameDiv.innerHTML = '<h3>Sorry, time ran out.</h3>';
		triviaGame.displayCorrectAnswer();
	}
}

var clock = {
	clockDiv: document.querySelector('#countdown-timer'),
	timeRemaining: 0,
	clockTimeout: null,
	start: function() {
		clock.timeRemaining = questionList[triviaGame.questionIndex].secondsToAnswer;
		clock.clockDiv.style.display = 'block';
		clockTimeout = setInterval(clock.countDown, 1000);
		clock.display();
	},
	stop: function() {
		clearInterval(clockTimeout);
		clock.clockDiv.style.display = 'none';
	},
	countDown: function () {
		if (clock.timeRemaining > 0) clock.timeRemaining--;
		else triviaGame.didntGuessAnswer();
		clock.display();
	},
	display: function() {
		clock.clockDiv.textContent = clock.timeRemaining;
	}
}

function TriviaQuestion(question, correctResponse, incorrectResponses, correctAnswerDescription, correctAnswerPictureSRC, secondsToAnswer) {
	// Constructor for the TriviaQuestion object.
	this.questionDiv = `<div class='question'>${question}</div>`;
	this.responseButtons = [];
	for (let i = 0; i < incorrectResponses.length; i++) {
		this.responseButtons.push(`<button class='response incorrect-response'>${incorrectResponses[i]}</button>`);
	}
	this.responseButtons.push(`<button class='response' id='correct-response'>${correctResponse}</button>`);
	this.correctAnswerDescription = correctAnswerDescription;
	this.correctAnswerPictureSRC = correctAnswerPictureSRC;
	this.secondsToAnswer = secondsToAnswer;
}

function addQuestionToList(question, correctResponse, incorrectResponses, correctAnswerDescription, correctAnswerPictureSRC, secondsToAnswer) {
	let newQuestion = new TriviaQuestion(question, correctResponse, incorrectResponses, correctAnswerDescription, correctAnswerPictureSRC, secondsToAnswer);
	questionList.push(newQuestion);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

document.querySelector('#start-trivia-game').addEventListener('click', triviaGame.startGame);
// Hey, I just loaded, and this is crazy, but here's my id, call back maybe?