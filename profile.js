document.addEventListener('DOMContentLoaded', () => {
    const historyBody = document.getElementById('history-body');
    const totalQuizzesEl = document.getElementById('total-quizzes');
    const avgScoreEl = document.getElementById('avg-score');
    const btnClear = document.getElementById('clear-history');

    function loadProfile() {
        const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        
        if (history.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="4" class="no-data">Bạn chưa hoàn thành bài trắc nghiệm nào.</td></tr>';
            totalQuizzesEl.innerText = '0';
            avgScoreEl.innerText = '0%';
            return;
        }

        let totalCorrect = 0;
        let totalQuestions = 0;
        historyBody.innerHTML = '';

        history.forEach(item => {
            const percent = Math.round((item.score / item.total) * 100);
            totalCorrect += item.score;
            totalQuestions += item.total;

            const statusClass = percent >= 80 ? 'status-excellent' : (percent >= 50 ? 'status-pass' : 'status-fail');
            const statusText = percent >= 80 ? 'Xuất sắc' : (percent >= 50 ? 'Đạt' : 'Cần cố gắng');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="module-title"><i class="fa-solid fa-circle-dot"></i> ${item.title}</div></td>
                <td><span class="date-text">${item.date}</span></td>
                <td><span class="score-pill">${item.score}/${item.total} (${percent}%)</span></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            `;
            historyBody.appendChild(row);
        });

        totalQuizzesEl.innerText = history.length;
        avgScoreEl.innerText = Math.round((totalCorrect / totalQuestions) * 100) + '%';
    }

    btnClear.onclick = () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài?')) {
            localStorage.removeItem('quizHistory');
            loadProfile();
        }
    };

    loadProfile();
});