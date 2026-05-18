document.addEventListener('DOMContentLoaded', () => {
    // Dữ liệu câu hỏi mở rộng
    const quizData = {
        grammar: [
            { q: "She ___ to the market every day.", options: ["go", "goes", "going", "gone"], correct: 1, explain: "Thì hiện tại đơn cho thói quen." },
            { q: "If I ___ you, I would take that job.", options: ["am", "is", "was", "were"], correct: 3, explain: "Câu điều kiện loại 2." }
        ],
        vocabulary: [
            { q: "Synonym of 'Start' is?", options: ["End", "Begin", "Stop", "Close"], correct: 1, explain: "Begin đồng nghĩa với Start (Bắt đầu)." },
            { q: "What does 'abundant' mean?", options: ["Rare", "Small", "Plentiful", "Empty"], correct: 2, explain: "Abundant có nghĩa là dồi dào, phong phú (Plentiful)." }
        ],
        reading: [
            { q: "What is the main idea of a summary?", options: ["Detailed facts", "Minor points", "Key concepts", "Long descriptions"], correct: 2, explain: "Summary tập trung vào các ý chính (Key concepts)." },
            { q: "Which part of a paragraph introduces the main topic?", options: ["Ending", "Body", "Topic sentence", "Details"], correct: 2, explain: "Topic sentence (Câu chủ đề) giới thiệu nội dung chính của đoạn văn." }
        ],
        listening: [
            { q: "[Audio: Hello, how can I help you?] Where is the speaker?", options: ["In a library", "In a shop", "At home", "In a park"], correct: 1, explain: "Câu chào 'How can I help you' thường dùng trong dịch vụ bán hàng." }
        ],
        pronunciation: [
            { q: "Which word has a different sound in the underlined part? (h_ea_t, b_ea_t, gr_ea_t, m_ea_t)", options: ["Heat", "Beat", "Great", "Meat"], correct: 2, explain: "Great phát âm là /eɪ/, các từ còn lại là /iː/." }
        ],
        idioms: [
            { q: "What does 'A piece of cake' mean?", options: ["Delicious food", "Very easy", "Very hard", "A small gift"], correct: 1, explain: "'A piece of cake' là thành ngữ chỉ việc gì đó rất dễ dàng." }
        ],
        'full-test': [
            { q: "I ___ English since 2010.", options: ["study", "studied", "have studied", "is studying"], correct: 2, explain: "Dùng hiện tại hoàn thành với 'since'." }
        ]
    };

    // Trạng thái ứng dụng
    let currentModule = 'grammar';
    let currentIndex = 0;
    let userAnswers = {};
    let revealedQuestions = new Set();
    let timerInterval = null;
    let timeLeft = 900; // 15 phút (tính bằng giây)
    let isReviewMode = false;

   
    const questionArea = document.getElementById('question-area');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnReveal = document.getElementById('btn-reveal');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressPercent = document.getElementById('progress-percent');
    const resultSummary = document.getElementById('result-summary');
    const quizControls = document.getElementById('quiz-controls');
    const timerDisplay = document.getElementById('timer-display');
    const btnReview = document.getElementById('btn-review');
    const timerContainer = document.getElementById('quiz-timer');

    function initQuiz(moduleName) {
        currentModule = moduleName;
        currentIndex = 0;
        userAnswers = {};
        revealedQuestions.clear();
        isReviewMode = false;
        resultSummary.style.display = 'none';
        quizControls.style.display = 'none';  
        timerContainer.style.display = 'none';  
        
       
        questionArea.innerHTML = `
            <div class="start-quiz-screen">
                <i class="fa-solid fa-stopwatch-20"></i>
                <h3>Sẵn sàng để bắt đầu luyện tập?</h3>
                <p style="margin-bottom: 25px; color: #636e72;">Thời gian làm bài: ${moduleName === 'full-test' ? '60' : '15'} phút</p>
                <button class="btn-restart" onclick="window.startQuizNow()">Bắt đầu làm bài</button>
            </div>
        `;
    }

    window.startQuizNow = () => {
        quizControls.style.display = 'flex';
        timerContainer.style.display = 'flex';
        resetTimer();
        renderQuestion();
        startTimer();
    };

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Hết thời gian làm bài!");
                showResult();
            }
        }, 1000);
    }

    function resetTimer() {
        timeLeft = currentModule === 'full-test' ? 3600 : 900;  
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (timeLeft < 60) document.getElementById('quiz-timer').style.background = '#fff0f0';
    }

    function renderQuestion() {
        const questions = quizData[currentModule];
        const qData = questions[currentIndex];
        const isLast = currentIndex === questions.length - 1;
        const isRevealed = revealedQuestions.has(currentIndex) || isReviewMode;

        
        const progress = ((currentIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.innerText = `Câu ${currentIndex + 1}/${questions.length}`;
        progressPercent.innerText = `${Math.round(progress)}%`;

       
        questionArea.innerHTML = `
            <div class="q-card">
                <div class="question-text">${qData.q}</div>
                <div class="options-list">
                    ${qData.options.map((opt, i) => {
                        let statusClass = '';
                        if (isRevealed) {
                            if (i === qData.correct) statusClass = 'correct';
                            else if (userAnswers[currentIndex] === i) statusClass = 'wrong';
                        } else if (userAnswers[currentIndex] === i) {
                            statusClass = 'selected';
                        }
                        return `<div class="option ${statusClass}" onclick="selectOption(${i})">
                            <span class="opt-letter">${String.fromCharCode(65 + i)}.</span> ${opt}
                        </div>`;
                    }).join('')}
                </div>
                ${isRevealed ? `<div class="explain"><i class="fa-solid fa-lightbulb"></i> <b>Giải thích:</b> ${qData.explain}</div>` : ''}
            </div>
        `;

     
        btnPrev.disabled = currentIndex === 0;
        btnNext.innerHTML = isLast ? 'Nộp bài <i class="fa-solid fa-check-double"></i>' : 'Câu tiếp <i class="fa-solid fa-chevron-right"></i>';
        btnReveal.disabled = userAnswers[currentIndex] === undefined || isRevealed || isReviewMode;
        if (isReviewMode) btnReveal.style.display = 'none';
        else btnReveal.style.display = 'flex';
    }

    window.selectOption = (optIdx) => {
        if (isReviewMode) return;
        if (revealedQuestions.has(currentIndex)) return;
        userAnswers[currentIndex] = optIdx;
        renderQuestion();
    };

    btnReveal.onclick = () => {
        revealedQuestions.add(currentIndex);
        renderQuestion();
    };

    btnNext.onclick = () => {
        const questions = quizData[currentModule];
        if (currentIndex < questions.length - 1) {
            // Thêm hiệu ứng chuyển câu nhẹ nhàng
            const card = document.querySelector('.q-card');
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                currentIndex++;
                renderQuestion();
            }, 200);
        } else {
            showResult();
        }
    };

    btnPrev.onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderQuestion();
        }
    };

    function showResult() {
        const questions = quizData[currentModule];
        let score = 0;
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.correct) score++;
        });

        clearInterval(timerInterval);
        timerContainer.style.display = 'none';

   
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        const moduleTitle = document.querySelector('.menu-item.active').innerText.trim();
        
        const resultEntry = {
            id: Date.now(),
            module: currentModule,
            title: moduleTitle,
            score: score,
            total: questions.length,
            date: new Date().toLocaleString('vi-VN')
        };
        
        quizHistory.unshift(resultEntry);  
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

        questionArea.innerHTML = '';
        quizControls.style.display = 'none';
        resultSummary.style.display = 'block';
        document.getElementById('score-text').innerText = `${score}/${questions.length}`;
        
        
        console.log("Quiz Finished! Score: " + score);
    }

    btnReview.onclick = () => {
        isReviewMode = true;
        currentIndex = 0;
        resultSummary.style.display = 'none';
        quizControls.style.display = 'flex';
        renderQuestion();
    };

   
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelector('.menu-item.active').classList.remove('active');
            this.classList.add('active');
            
            const title = this.innerText;
            const desc = this.dataset.desc;
            document.getElementById('current-title').innerText = `Luyện tập ${title}`;
            document.getElementById('quiz-desc').innerText = desc;
            
            initQuiz(this.dataset.module);
        });
    });

   
    initQuiz('grammar');
});