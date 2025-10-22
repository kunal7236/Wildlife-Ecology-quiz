// script.js

document.addEventListener('DOMContentLoaded', () => {
    const assignmentSelectionDiv = document.getElementById('assignment-selection');
    const learningSection = document.getElementById('learning-section');
    const quizContainer = document.getElementById('quiz-container');
    const learningContainer = document.getElementById('learning-container');
    const quizTitle = document.getElementById('quiz-title');
    const learningTitle = document.getElementById('learning-title');
    const questionsWrapper = document.getElementById('questions-wrapper');
    const learningQuestionsWrapper = document.getElementById('learning-questions-wrapper');
    const submitButton = document.getElementById('submit-button');
    const backToMenuButton = document.getElementById('back-to-menu');
    const backToMenuBottomButton = document.getElementById('back-to-menu-bottom');
    const backToMenuQuizButton = document.getElementById('back-to-menu-quiz');
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
    let userAnswers = {}; // Store answers by question index

    // Event listeners for assignment selection buttons
    document.querySelectorAll('.week-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const assignmentKey = event.target.dataset.assignment;
            startQuiz(assignmentKey);
        });
    });

    // Event listeners for learning buttons
    document.querySelectorAll('.learning-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const assignmentKey = event.target.dataset.assignment;
            startLearningMode(assignmentKey);
        });
    });

    submitButton.addEventListener('click', submitQuiz);
    reviewAnswersButton.addEventListener('click', showAllAnswers);
    restartButton.addEventListener('click', resetQuiz);
    backToMenuButton.addEventListener('click', backToMenu);
    backToMenuBottomButton.addEventListener('click', backToMenu);
    backToMenuQuizButton.addEventListener('click', backToMenu);

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

        userAnswers = {};

        assignmentSelectionDiv.style.display = 'none';
        learningSection.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        learningContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        progressBar.style.width = '0%';

        loadAllQuestions();
        submitButton.style.display = 'block';
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function loadAllQuestions() {
        questionsWrapper.innerHTML = ''; // Clear previous questions

        currentQuestions.forEach((questionData, index) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');
            questionCard.dataset.questionIndex = index;

            const questionHeader = document.createElement('div');
            questionHeader.classList.add('question-header');
            
            const questionNumber = document.createElement('span');
            questionNumber.classList.add('question-number');
            questionNumber.textContent = `Question ${index + 1}`;
            questionHeader.appendChild(questionNumber);

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.textContent = questionData.question;

            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options-container');

            // Shuffle options for variety
            const shuffledOptions = shuffleArray(questionData.options);

            shuffledOptions.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('quiz-option');
                optionDiv.textContent = option;
                optionDiv.dataset.questionIndex = index;
                optionDiv.addEventListener('click', () => selectOption(optionDiv, index, option));
                optionsContainer.appendChild(optionDiv);
            });

            questionCard.appendChild(questionHeader);
            questionCard.appendChild(questionText);
            questionCard.appendChild(optionsContainer);
            questionsWrapper.appendChild(questionCard);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function selectOption(selectedDiv, questionIndex, selectedAnswer) {
        // Get all option divs for this question
        const allOptions = document.querySelectorAll(`.quiz-option[data-question-index="${questionIndex}"]`);
        
        // Remove selected class from all options in this question
        allOptions.forEach(option => {
            option.classList.remove('selected-quiz-option');
        });

        // Mark the selected option
        selectedDiv.classList.add('selected-quiz-option');

        // Store the answer
        userAnswers[questionIndex] = selectedAnswer;

        // Update progress bar
        const answeredCount = Object.keys(userAnswers).length;
        const progress = (answeredCount / currentQuestions.length) * 100;
        progressBar.style.width = progress + '%';
    }

    function submitQuiz() {
        showResults();
    }

    function showResults() {
        let userScore = 0;
        const detailedAnswers = [];

        currentQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer && (userAnswer === question.correctAnswer);
            
            if (isCorrect) {
                userScore++;
            }

            detailedAnswers.push({
                question: question.question,
                selected: userAnswer || 'Not answered',
                correct: question.correctAnswer,
                isCorrect: isCorrect
            });
        });

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

        // Store detailed answers for review
        window.detailedAnswers = detailedAnswers;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showAllAnswers() {
        wrongAnswersList.innerHTML = '';
        
        if (!window.detailedAnswers || window.detailedAnswers.length === 0) {
            wrongAnswersList.innerHTML = '<li>No answers to review.</li>';
        } else {
            window.detailedAnswers.forEach((item, index) => {
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
        learningSection.style.display = 'block';
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        learningContainer.style.display = 'none';
        wrongAnswersList.innerHTML = '';
        questionsWrapper.innerHTML = '';
        currentQuestions = [];
        userAnswers = {};
        window.detailedAnswers = [];
        progressBar.style.width = '0%';
        submitButton.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function backToMenu() {
        assignmentSelectionDiv.style.display = 'block';
        learningSection.style.display = 'block';
        learningContainer.style.display = 'none';
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
        feedbackArea.style.display = 'none';
        learningQuestionsWrapper.innerHTML = '';
        questionsWrapper.innerHTML = '';
        userAnswers = {};
        progressBar.style.width = '0%';
        submitButton.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function startLearningMode(assignmentKey) {
        const questions = allQuestions[assignmentKey];
        learningTitle.textContent = `📖 ${assignmentKey} - Learning Mode`;

        assignmentSelectionDiv.style.display = 'none';
        learningSection.style.display = 'none';
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
        learningContainer.style.display = 'block';

        loadLearningQuestions(questions);
    }

    function loadLearningQuestions(questions) {
        learningQuestionsWrapper.innerHTML = '';

        questions.forEach((questionData, index) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card', 'learning-card');

            const questionHeader = document.createElement('div');
            questionHeader.classList.add('question-header');
            
            const questionNumber = document.createElement('span');
            questionNumber.classList.add('question-number');
            questionNumber.textContent = `Question ${index + 1}`;
            questionHeader.appendChild(questionNumber);

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.textContent = questionData.question;

            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options-container');

            // Display options WITHOUT shuffling
            questionData.options.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('learning-option');
                
                // Mark correct answer
                if (option === questionData.correctAnswer) {
                    optionDiv.classList.add('correct-learning-option');
                    optionDiv.innerHTML = `<span class="check-icon">✓</span> ${option}`;
                } else {
                    optionDiv.textContent = option;
                }
                
                optionsContainer.appendChild(optionDiv);
            });

            questionCard.appendChild(questionHeader);
            questionCard.appendChild(questionText);
            questionCard.appendChild(optionsContainer);
            learningQuestionsWrapper.appendChild(questionCard);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});