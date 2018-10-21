// JavaScript Trivia Game by Scott Ratigan

// Globals:
const msToDisplayAnswer = 5000;
const defaultSecondsToAnswer = 30;
var questionList = [];

// Set up list of trivia questions:
addQuestionToList('What will console.log(3 < 2 < 1) show in the console?', 'true', ['false', 'undefined', 'null', "Error, can't perform 2 comparisons at once."],  'The statement evaluates true. Equality operators have a left-to-right associativity and the first comparison (3 < 2) returns a 0.', 30);
addQuestionToList('The conditional statement (false == 0) will evaluate to?', 'true', ['false', 'error', 'undefined'],  'True. 0 is considered a "falsy" value.', 20);
addQuestionToList('The conditional statement ("" == 0) will evaluate to?', 'true', ['false', 'undefined', 'null'],  'True.', 20);
addQuestionToList('Given the following:<br>for(var i = 0; i < 10; i++ {<br>&emsp;&emsp;console.log(i);<br>}<br>Does i have a value outside the for loop?', 'true', ['false'],  'True, oddly enough. Replacing the var declaration with let will give i a scope restricted to the code block, however.', 25);
let inspirationalQuotesList = ["Never define your success by somebody else's success. I never looked at another man's code to tell how clean mine should be.", "I drank a whole pot of coffee. Some call that I problem but I need to... go.", "You took the caffeine challenge and lost your balance. Your code's not compiling, we under water counting bitcoins by the thousands.", "It don't make sense. You're either a coder from the start, or an actor in a bootcamp tryin' to play the part.", "Rearrange the whole page with my rugged DOMs, won't need a library I can vanilla with no qualms."];

var triviaGame = { // The entire game is an object, with functions to perform the various game functions.
	correctResponses: 0,
	incorrectResponses: 0,
	questionIndex: 0,
	totalQuestions: questionList.length,
	highScore: 0,
	gameDiv: $('#game-container'),
	startButton: $('#start-trivia-game'),
	buttonDiv: null,
	startGame: function() {
		triviaGame.startButton.hide();
		triviaGame.correctResponses = 0;
		triviaGame.incorrectResponses = 0;
		triviaGame.questionIndex = 0;
		shuffleArray(questionList);
		triviaGame.displayQuestion();
	},
	endGame: function() {
		triviaGame.gameDiv.empty();
		triviaGame.gameDiv.append('<p>GAME OVER</p>')
		let correctPercentage = Math.floor((triviaGame.correctResponses / triviaGame.totalQuestions) * 100);
		triviaGame.gameDiv.append(`<p>Correct answers: ${triviaGame.correctResponses}<br>Incorrect answers: ${triviaGame.incorrectResponses}<br>${correctPercentage}% correct.</p>`)
		if (triviaGame.correctResponses === triviaGame.totalQuestions) {
			triviaGame.gameDiv.append('<p>Well played, you got a perfect score!</p>');
			triviaGame.highScore = triviaGame.correctResponses;
		}
		else if (triviaGame.correctResponses > triviaGame.highScore) {
			triviaGame.gameDiv.append('<p>You set a new high score!</p>');
			triviaGame.highScore = triviaGame.correctResponses;
		}
		else if (triviaGame.correctResponses === triviaGame.highScore) {
			triviaGame.gameDiv.append('<p>You have tied the high score!</p>');
		}
		else {
			triviaGame.gameDiv.append(`<p>The high score is still ${triviaGame.highScore} / ${triviaGame.totalQuestions}</p>`);
		}
		let randomQuote = inspirationalQuotesList[Math.floor(Math.random() * inspirationalQuotesList.length)];
		triviaGame.gameDiv.append(`<p>"<em>${randomQuote}</em>" - Xzibit, probably</p>`);
		// triviaGame.startButton.style.display = 'block';
		triviaGame.startButton.show();
	},
	displayQuestion: function() {
		// Clear out trivia area and add the question:
		triviaGame.gameDiv.empty();
		triviaGame.gameDiv.append(questionList[triviaGame.questionIndex].questionDiv);
		// Shuffle the order of possible answers:
		shuffleArray(questionList[triviaGame.questionIndex].responseButtons);
		// Create a new div for the answer buttons to live in.
		let answersAreaDiv = $('<div>');
		answersAreaDiv.attr('id', 'answer-button-div');
		triviaGame.gameDiv.append(answersAreaDiv);
		triviaGame.buttonDiv = $('#answer-button-div');
		// Append the randomized answer list to the trivia area:
		questionList[triviaGame.questionIndex].responseButtons.forEach(function(buttonToAppend) {
			triviaGame.buttonDiv.append(buttonToAppend);
		});
		clock.start(); // Start the countdown.
	},
	displayCorrectAnswer: function() { // Displays the correct answer under the correct/incorrect text.
		// First clear out the answer buttons:
		$('#answer-button-div').empty();
		// Then display the answer:
		triviaGame.gameDiv.append(questionList[triviaGame.questionIndex].correctAnswerDescription);
		// Display correct answer for set amount of time, then either go to next question or end game.
		if (triviaGame.questionIndex + 1 < questionList.length) {
			triviaGame.questionIndex++;
			// If there is another question in the list, show it after delay:
			setTimeout(triviaGame.displayQuestion, msToDisplayAnswer);
		}
		else { // Else, run endGame function, after delay:
			setTimeout(triviaGame.endGame, msToDisplayAnswer);
		}
	},
	guessAnswer: function() { // User has guessed an answer:
		clock.stop();
		if (event.target.id === 'correct-response') { // The response was correct:
			triviaGame.gameDiv.append('<h3>CORRECT :)</h3>');
			triviaGame.correctResponses++;
		}
		else { // The response was NOT correct:
			triviaGame.gameDiv.append('<h3>INCORRECT :/</h3>');
			triviaGame.incorrectResponses++;
		}
		// Either way, show the correct answer:
		triviaGame.displayCorrectAnswer();
	},
	didntGuessAnswer: function() { // Runs when user doesn't select an answer before time runs out:
		clock.stop();
		triviaGame.gameDiv.append('<h3>Sorry, time ran out.</h3>');
		// Show the correct answer:
		triviaGame.displayCorrectAnswer();
	}
}

var clock = { // The entire clock is an object which tracks time and has methods to start & stop:
	clockDiv: $("#countdown-timer"),
	timeRemaining: 0,
	clockTimeout: null,
	start: function() {
		clock.timeRemaining = questionList[triviaGame.questionIndex].secondsToAnswer;
		clock.clockDiv.show();
		clockTimeout = setInterval(clock.countDown, 1000);
		clock.display();
	},
	stop: function() {
		clearInterval(clockTimeout);
		clock.clockDiv.hide();
	},
	countDown: function () {
		if (clock.timeRemaining > 0) clock.timeRemaining--;
		else triviaGame.didntGuessAnswer();
		clock.display();
	},
	display: function() {
		clock.clockDiv.text(`Time remaining: ${clock.timeRemaining} seconds.`);
	}
}

function TriviaQuestion(question, correctResponse, incorrectResponses, correctAnswerDescription, secondsToAnswer) {
	// Constructor for the TriviaQuestion object. This builds the question objects from string arguments.
	this.questionDiv = `<div class='question'>${question}</div>`;
	this.responseButtons = [];
	for (let i = 0; i < incorrectResponses.length; i++) {
		let button = buildButton(incorrectResponses[i], false);
		this.responseButtons.push(button);
	}
	let button = buildButton(correctResponse, true);
	this.responseButtons.push(button);
	this.correctAnswerDescription = correctAnswerDescription;
	this.secondsToAnswer = secondsToAnswer || defaultSecondsToAnswer; // Use default value if no time was specified during construction.
	function buildButton(buttonText, isCorrectResponse) {
		// Creates answer buttons, which are part of the question object.
		let button = $('<button>');
		button.text(buttonText);
		if (isCorrectResponse) {
			button.attr('class', 'response');
			button.attr('id', 'correct-response');
		}
		else {
			button.attr('class', 'response incorrect-response');
		}
		return button;
	}
}

function addQuestionToList(question, correctResponse, incorrectResponses, correctAnswerDescription, secondsToAnswer) {
	// Allows constructor function to be called easily. Not strictly necessary, but it makes the array construction a bit cleaner up top.
	let newQuestion = new TriviaQuestion(question, correctResponse, incorrectResponses, correctAnswerDescription, secondsToAnswer);
	questionList.push(newQuestion);
}

function shuffleArray(array) {
	// A generic function to shuffle an array. This ensures a randomized order for questions and answers without worrying about repitition.
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

// Click event handlers:
// Hey, I just loaded, and this is crazy, but here's my id, call back maybe?
$('#start-trivia-game').click(triviaGame.startGame);
// Click handler for answering questions. Because it's attached to the document, it will fire on any buttons that are dynamically created.
$(document).on('click', '.response', triviaGame.guessAnswer);