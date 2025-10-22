// script.js

document.addEventListener('DOMContentLoaded', () => {
    const assignmentSelectionDiv = document.getElementById('assignment-selection');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.getElementById('progress-bar');
    const resultsContainer = document.getElementById('results-container');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const performanceMessage = document.getElementById('performance-message');
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
            quizTitle.textContent = "🎯 All Weeks Combined Quiz";
        } else {
            currentQuestions = allQuestions[assignmentKey];
            quizTitle.textContent = `📚 ${assignmentKey} Quiz`;
        }

        // Shuffle questions for variety
        currentQuestions = shuffleArray([...currentQuestions]);

        currentQuestionIndex = 0;
        userScore = 0;
        userAnswers = [];

        assignmentSelectionDiv.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        quizContainer.style.display = 'block';

        loadQuestion();
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function loadQuestion() {
        if (currentQuestionIndex < currentQuestions.length) {
            const questionData = currentQuestions[currentQuestionIndex];
            
            // Update progress bar
            const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
            progressBar.style.width = progress + '%';
            
            // Update question number
            questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
            
            questionText.textContent = questionData.question;
            optionsContainer.innerHTML = ''; // Clear previous options

            // Shuffle options for variety
            const shuffledOptions = shuffleArray(questionData.options);

            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option;
                button.addEventListener('click', () => selectOption(button, questionData.correctAnswer));
                optionsContainer.appendChild(button);
            });
            
            nextButton.style.display = 'none'; // Hide next button until an option is selected
            
            // Scroll to top of question
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showResults();
        }
    }

    function selectOption(selectedButton, correctAnswer) {
        // Disable all options after selection
        const allButtons = document.querySelectorAll('.option-button');
        allButtons.forEach(button => {
            button.disabled = true;
            button.classList.remove('selected');
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
        
        // Add smooth transition
        setTimeout(() => {
            nextButton.style.opacity = '1';
        }, 100);
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
        
        // Update progress bar to 100%
        progressBar.style.width = '100%';
        
        // Calculate percentage
        const percentage = (userScore / currentQuestions.length) * 100;
        
        // Show performance message
        let message = '';
        if (percentage === 100) {
            message = '🏆 Perfect Score! Outstanding!';
        } else if (percentage >= 80) {
            message = '🌟 Excellent Work!';
        } else if (percentage >= 60) {
            message = '👍 Good Job!';
        } else if (percentage >= 40) {
            message = '📚 Keep Practicing!';
        } else {
            message = '💪 Don\'t Give Up!';
        }
        
        performanceMessage.textContent = message;
        performanceMessage.style.marginTop = '15px';
        performanceMessage.style.fontSize = '1.2em';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showWrongAnswers() {
        wrongAnswersList.innerHTML = '';
        
        // Show all answers, not just wrong ones
        if (userAnswers.length === 0) {
            wrongAnswersList.innerHTML = '<li>No answers to review.</li>';
        } else {
            userAnswers.forEach((item, index) => {
                const listItem = document.createElement('li');
                if (item.isCorrect) {
                    listItem.classList.add('correct-item');
                }
                
                const icon = item.isCorrect ? '✅' : '❌';
                
                listItem.innerHTML = `
                    <p><strong>${icon} Question ${index + 1}:</strong> ${item.question}</p>
                    <p class="user-answer">Your Answer: ${item.selected}</p>
                    ${!item.isCorrect ? `<p class="correct-answer">Correct Answer: ${item.correct}</p>` : '<p class="correct-answer">Correct! ✓</p>'}
                `;
                wrongAnswersList.appendChild(listItem);
            });
        }
        
        feedbackArea.style.display = 'block';
        
        // Scroll to feedback
        setTimeout(() => {
            feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
        progressBar.style.width = '0%';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});