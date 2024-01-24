// Countdown
const timerElement = document.getElementById('timer');
let countdownTimeInSeconds = 50; // set the initial countdown time in seconds
let timerInterval;
let quizCompleted = false; // variable to track whether the quiz is completed

function startQuiz() {
    // Set up the timer to update every second
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if(!quizCompleted) {
        const minutes = Math.floor(countdownTimeInSeconds / 60);
        const seconds = countdownTimeInSeconds % 60;

    // display formatted time in timer element
    timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // decrease countdown time
    countdownTimeInSeconds--;

    // check if countdown has reached zero
    if (countdownTimeInSeconds < 0) {
        clearInterval(timerInterval);
        timerElement.textContent = 'Time is up!';
        // Add any additional actions you want to perform when the time is up
        submitScore(); // For example, submitting the score when time is up
        }
    }
}

// Questions Array
const questions = [
    {
        question: 'Commonly used data types do NOT include:',
        options: ['strings', 'booleans', 'alerts', 'numbers'],
        correctAnswer: 'alerts'
    },
    {
        question: 'The condition in an if/else statement is enclosed within:',
        options: ['quotes', 'curly brackets', 'parenthesis', 'square brackets'],
        correctAnswer: 'parenthesis'
    }
    // Repeat as needed
];

// Quiz State
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Document Ready Event Handler
$(document).ready(function() {
    // Start Quiz Button Click Event
    $('#start-quiz').click(function() {
        $('#title-container').hide();
        $('#quiz-container').show();
        startQuiz(); // Start the timer when "Take Quiz" is clicked
        displayQuestion();
    });

    // Next Question Button Click Event
    $('#next-question').click(function() {
        nextQuestion();
    });

    // Options Click Event
    $('#options').on('click', '.option', function() {
        const selectedIndex = $(this).index();
        checkAnswer(selectedIndex);
    });

    // Submit Score Button Click Event
    $('#submit-score').click(function() {
        submitScore();
    });

    // Clear Scores Button Click Event
    $('#clear-scores').click(function() {
        clearScores();
    });

    // Restart Quiz Button Click Event
    $('#restart-quiz').click(function() {
        resetQuiz();
        $('#quiz-container').show();
        $('#high-scores').hide();
    });

    // View Highscores Button Click Event
    $('.highscores').click(function() {
        toggleHighScoresView();
        displayHighScores(); // This line ensures high scores are displayed immediately when the button is clicked
    });

    // Return to Title Button Click Event
    $('#return-to-title').click(function() {
        toggleHighScoresView();
        // Add any other actions you want to perform when returning to the title page
        // For example, displaying the title content
        $('#quiz-container').hide();
        $('#title-container').show();
    });
});

// Display Question
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    $('#question').text(currentQuestion.question);

    $('#options').empty();
    $.each(currentQuestion.options, function(index, option) {
        const optionElement = $('<div>').addClass('option').text(option);
        $('#options').append(optionElement);
    });

    $('#feedback').text('');
}

// Check Answer
function checkAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.correctAnswer === currentQuestion.options[selectedIndex]) {
        correctAnswers++;
    }

    const feedbackMessage = currentQuestion.correctAnswer === currentQuestion.options[selectedIndex]
        ? 'Correct!'
        : 'Incorrect!';

    $('#feedback').text(feedbackMessage);

    // Add a delay before moving to the next question
    setTimeout(function () {
        $('#feedback').text('');
        nextQuestion();
    }, 500); // Adjust the delay as needed
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        quizCompleted = true;
        setTimeout(function () {
            showMessage('Quiz completed!', 'success');
            showHighScores();
        }, 500); // Add a delay of 500 milliseconds (adjust if needed)
    }
}

// Show High Scores
function showHighScores() {
    $('#quiz-container').hide();
    $('#high-scores').show();

    displayHighScores();
}

// Display High Scores
function displayHighScores() {
    console.log('Displaying high scores...'); // Add this line for debugging

    const highScoresList = $('#high-scores-list');

    // Display high scores in a list
    const storedScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
    console.log('Stored Scores:', storedScores); // Add this line for debugging
    highScoresList.empty();

    storedScores.forEach(function(score) {
        const scoreItem = $('<li>').text(`${score.initials}: ${score.score}`);
        highScoresList.append(scoreItem);
    });
}

// Submit Score
function submitScore() {
    console.log('Submitting score...'); // Add this line for debugging

    const initials = $('#initials').val().toUpperCase();

    if (initials && correctAnswers > 0) {
        const score = { initials, score: correctAnswers };
        console.log('Score to be stored:', score); // Add this line for debugging

        // Store score in localStorage
        const storedScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
        console.log('Current stored scores:', storedScores); // Add this line for debugging

        storedScores.push(score);

        localStorage.setItem('quizHighScores', JSON.stringify(storedScores));
        console.log('Scores stored successfully.'); // Add this line for debugging

        // Reset quiz and show high scores
        resetQuiz();
        showHighScores();
        showMessage('Score submitted!', 'success');
    } else {
        showMessage('Please enter initials and complete the quiz to submit your score.', 'error');
    }
}

// Clear Scores
function clearScores() {
    localStorage.removeItem('quizHighScores');
    displayHighScores();
    showMessage('Scores cleared!', 'success');
}

// Reset Quiz
function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
}

// Show Message
function showMessage(message, messageType) {
    const messageSection = $('#message-section');
    messageSection.text(message);
    messageSection.removeClass().addClass(`container ${messageType}`);
    setTimeout(() => {
        messageSection.text('');
    }, 2000);
}

// Toggle High Scores View
function toggleHighScoresView() {
    const titleContainer = $('#title-container');
    const highScoresContainer = $('#high-scores');
    const returnToTitleButton = $('#return-to-title');
    const initialsLabel = $('#initials-label');
    const initialsInput = $('#initials');
    const submitScoreButton = $('#submit-score');
    const clearScoresButton = $('#clear-scores');
    const restartQuizButton = $('#restart-quiz');

    // Toggle the display property of the title container and high scores section
    titleContainer.toggle();
    highScoresContainer.toggle();

    // Toggle the visibility of the return to title button
    returnToTitleButton.toggle();

    // Toggle the display property of the initials label, input, and submit button
    initialsLabel.toggle();
    initialsInput.toggle();
    submitScoreButton.toggle();

    // Toggle the display property of the other buttons in the high scores section
    clearScoresButton.toggle();
    restartQuizButton.toggle();

    // Scroll to the high scores section smoothly
    $('html, body').animate({
        scrollTop: highScoresContainer.offset().top
    }, 1000); // Adjust the duration as needed

    // Log information to the console for debugging
    console.log("returnToTitleButton visibility:", returnToTitleButton.is(":visible"));
    console.log("titleContainer visibility:", titleContainer.is(":visible"));
    console.log("highScoresContainer visibility:", highScoresContainer.is(":visible"));
    console.log("initialsLabel visibility:", initialsLabel.is(":visible"));
    console.log("initialsInput visibility:", initialsInput.is(":visible"));
}