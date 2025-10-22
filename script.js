// script.js

document.addEventListener('DOMContentLoaded', () => {
    const assignmentSelectionDiv = document.getElementById('assignment-selection');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultsContainer = document.getElementById('results-container');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const reviewAnswersButton = document.getElementById('review-answers-button');
    const restartButton = document.getElementById('restart-button');
    const feedbackArea = document.getElementById('feedback-area');
    const wrongAnswersList = document.getElementById('wrong-answers-list');

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let userScore = 0;
    let userAnswers = []; // To store user's choice and correct answer for review

    // Event listeners for assignment selection buttons
    document.querySelectorAll('.week-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const assignmentKey = event.target.dataset.assignment;
            startQuiz(assignmentKey);
        });
    });

    nextButton.addEventListener('click', loadNextQuestion);
    reviewAnswersButton.addEventListener('click', showWrongAnswers);
    restartButton.addEventListener('click', resetQuiz);

    function startQuiz(assignmentKey) {
        if (assignmentKey === 'all') {
            currentQuestions = Object.values(allQuestions).flat(); // Combine all questions
            quizTitle.textContent = "All Weeks Combined Quiz";
        } else {
            currentQuestions = allQuestions[assignmentKey];
            quizTitle.textContent = `${assignmentKey} Quiz`;
        }

        currentQuestionIndex = 0;
        userScore = 0;
        userAnswers = [];

        assignmentSelectionDiv.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        quizContainer.style.display = 'block';

        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex < currentQuestions.length) {
            const questionData = currentQuestions[currentQuestionIndex];
            questionText.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
            optionsContainer.innerHTML = ''; // Clear previous options

            questionData.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option;
                button.addEventListener('click', () => selectOption(button, questionData.correctAnswer));
                optionsContainer.appendChild(button);
            });
            nextButton.style.display = 'none'; // Hide next button until an option is selected
        } else {
            showResults();
        }
    }

    function selectOption(selectedButton, correctAnswer) {
        // Disable all options after selection
        document.querySelectorAll('.option-button').forEach(button => {
            button.disabled = true;
            button.classList.remove('selected'); // Remove selected class from others if re-selecting
        });

        selectedButton.classList.add('selected'); // Mark selected option

        const selectedAnswer = selectedButton.textContent;
        const isCorrect = (selectedAnswer === correctAnswer);

        userAnswers.push({
            question: currentQuestions[currentQuestionIndex].question,
            selected: selectedAnswer,
            correct: correctAnswer,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            userScore++;
        }
        nextButton.style.display = 'block'; // Show next button
    }

    function loadNextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        scoreSpan.textContent = userScore;
        totalQuestionsSpan.textContent = currentQuestions.length;
    }

    function showWrongAnswers() {
        wrongAnswersList.innerHTML = '';
        const wrongAnswers = userAnswers.filter(answer => !answer.isCorrect);

        if (wrongAnswers.length === 0) {
            wrongAnswersList.innerHTML = '<li>Great job! You answered all questions correctly.</li>';
        } else {
            wrongAnswers.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p><strong>Question:</strong> ${item.question}</p>
                    <p class="user-answer">Your Answer: ${item.selected}</p>
                    <p class="correct-answer">Correct Answer: ${item.correct}</p>
                `;
                wrongAnswersList.appendChild(listItem);
            });
        }
        feedbackArea.style.display = 'block';
    }

    function resetQuiz() {
        assignmentSelectionDiv.style.display = 'block';
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        wrongAnswersList.innerHTML = '';
        currentQuestions = [];
        currentQuestionIndex = 0;
        userScore = 0;
        userAnswers = [];
    }
});