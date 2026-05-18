document.addEventListener('DOMContentLoaded', () => {
    // 1. Interval for Slider
    setInterval(() => moveSlide(1), 5000);

    // 2. Video/Lesson Navigation Logic
    document.querySelectorAll('.lesson-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const displayArea = this.closest('.lesson-list-wrapper').querySelector('.video-display-area');
            const videoPlayer = displayArea.querySelector('video');
            videoPlayer.src = this.dataset.video;
            displayArea.querySelector('.playing-lesson-title').innerText = this.dataset.title;
            displayArea.style.display = 'block';
            videoPlayer.load();
            videoPlayer.play();
            displayArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    // 3. Sidebar Navigation Logic (Content Switching)
    const navItems = document.querySelectorAll('.nav-item');
    const currentTitle = document.getElementById('current-title');
    const introText = document.querySelector('#dynamic-content > p');
    const CONTENT_MAP = {
        'beginner-path': { intro: "Lộ trình học tiếng Anh căn bản dành cho người mới bắt đầu.", ids: ['.image-slider', '.lesson-info'] },
        'beginner-guide': { intro: "Hướng dẫn chi tiết để bạn bắt đầu hành trình học tiếng Anh.", ids: ['#guide-content'] },
        'beginner-course-root': { intro: "Khóa học giúp bạn củng cố nền tảng tiếng Anh từ đầu.", ids: ['#beginner-course-root-content'] },
        'ipa-pronunciation': { intro: "Luyện tập phát âm chuẩn quốc tế với bảng IPA.", ids: ['#ipa-pronunciation-content'] },
        'exam-thpt': { intro: (title) => `Tổng hợp ${title} mới nhất giúp bạn ôn luyện hiệu quả.`, ids: ['#exam-thpt-content'], display: 'grid' },
        'exam-dgnl': { intro: "Tổng hợp đề thi DGNL mới nhất giúp bạn ôn luyện hiệu quả.", ids: ['#exam-dgnl-content'], display: 'grid' },
        'vocab-3000': { intro: "Nắm vững 3000 từ vựng cốt lõi để giao tiếp thành thạo.", ids: ['#vocab-3000-content'], display: 'grid' },
        'toeic-vocab': { intro: "Tổng hợp các lộ trình học từ vựng TOEIC hiệu quả.", ids: ['#toeic-vocab-content'], display: 'grid' },
        'ielts-vocab': { intro: "Tổng hợp các lộ trình học từ vựng IELTS hiệu quả.", ids: ['#ielts-vocab-content'], display: 'grid' }
    };

    const hideAllDynamic = () => {
        document.querySelectorAll('.dynamic-section').forEach(el => el.style.display = 'none');
    };

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const target = this.dataset.target;
            currentTitle.innerText = this.innerText;

            if (['vocab-3000', 'toeic-vocab', 'ielts-vocab'].includes(target)) lastVocabTarget = target;

            const config = CONTENT_MAP[target];
            const contentBody = document.getElementById('dynamic-content');
            
            contentBody.style.opacity = '0';
            setTimeout(() => {
                hideAllDynamic();
                if (config) {
                    introText.innerText = typeof config.intro === 'function' ? config.intro(this.innerText) : config.intro;
                    config.ids.forEach(id => {
                        const el = document.querySelector(id);
                        if (el) el.style.display = config.display || 'block';
                    });
                } else {
                    introText.innerText = `Nội dung của mục "${this.innerText}" hiện đang được biên soạn.`;
                }
                contentBody.style.opacity = '1';
            }, 100);
        });
    });

    // 4. Vocab Learning & Flashcards Logic
    const flashcard = document.getElementById('flashcard');
    const btnPrev = document.getElementById('prev-card');
    const btnNext = document.getElementById('next-card');
    const btnExit = document.getElementById('exit-flashcard');
    const cardCounter = document.getElementById('card-counter');
    const flashcardSection = document.getElementById('flashcard-section');

    let currentCardIndex = 0;
    let flashcardData = [];
    let lastVocabTarget = 'vocab-3000';

    const updateFlashcard = () => {
        const data = flashcardData[currentCardIndex];
        document.getElementById('card-en').innerText = data.en;
        document.getElementById('card-ipa').innerText = data.ipa;
        document.getElementById('card-vi').innerText = data.vi;
        document.getElementById('card-ex').innerText = `Example: ${data.ex}`;
        document.getElementById('card-ex-vi').innerText = `Ví dụ: ${data.exVi}`;
        document.getElementById('card-img').src = data.img;
        cardCounter.innerText = `${currentCardIndex + 1}/${flashcardData.length}`;
        flashcard.classList.remove('flipped');
    };

    document.querySelectorAll('.btn-learn-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sourceId = btn.dataset.source || 'flashcard-data-source';
            showFlashcards(sourceId);
        });
    });

    function showFlashcards(sourceId) {
        const dataSource = document.getElementById(sourceId);
        if (!dataSource) return;
        
        flashcardData = Array.from(dataSource.querySelectorAll('li')).map(li => ({ ...li.dataset }));
        
        // Tạo bảng từ vựng
        const tableBody = document.getElementById('vocab-table-body');
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ
        tableBody.innerHTML = '';
        flashcardData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight: bold; color: #2575fc;">${item.en}</td>
                <td style="color: #7f8c8d;">${item.ipa}</td>
                <td style="font-style: italic; color: #e67e22;">(${item.pos})</td>
                <td>${item.vi}</td>
                <td><button class="audio-btn-small" onclick="playText('${item.en}')"><i class="fa-solid fa-volume-high"></i></button></td>
            `;
            tableBody.appendChild(row);
        });

        hideAllDynamic();
        flashcardSection.style.display = 'block';

        // Hiển thị intro và ẩn/hiện flashcard tùy theo loại dữ liệu
        const fcContainer = document.querySelector('.flashcard-container');
        const fcControls = document.querySelector('.flashcard-controls');

        if (sourceId.includes('toeic') || sourceId.includes('ielts')) {
            const isToeic = sourceId.includes('toeic');
            if (fcContainer) fcContainer.style.display = 'none';
            if (fcControls) {
                // Ẩn các nút điều hướng flashcard vì TOEIC/IELTS chỉ hiện bảng
                btnPrev.style.display = 'none';
                btnNext.style.display = 'none';
                cardCounter.style.display = 'none';
                btnExit.innerText = isToeic ? "Quay lại danh sách TOEIC" : "Quay lại danh sách IELTS";
            }
            introText.innerText = isToeic ? "Danh sách từ vựng TOEIC quan trọng." : "Danh sách từ vựng IELTS quan trọng.";
        } else {
            if (fcContainer) fcContainer.style.display = 'block';
            if (fcControls) {
                btnPrev.style.display = 'block';
                btnNext.style.display = 'block';
                cardCounter.style.display = 'block';
                btnExit.innerText = "Thoát";
            }
            introText.innerText = "Luyện tập ghi nhớ từ vựng qua thẻ Flashcard.";
            currentCardIndex = 0;
            updateFlashcard();
        }
    }

    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    btnNext.addEventListener('click', () => { currentCardIndex = (currentCardIndex + 1) % flashcardData.length; updateFlashcard(); });
    btnPrev.addEventListener('click', () => { currentCardIndex = (currentCardIndex - 1 + flashcardData.length) % flashcardData.length; updateFlashcard(); });
    btnExit.addEventListener('click', () => document.querySelector(`.nav-item[data-target="${lastVocabTarget}"]`)?.click());

    // 5. Image Modal Logic
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('img-enlarged');
    const closeBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.slide').forEach(slide => {
        slide.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        });
    });
    closeBtn.onclick = () => modal.style.display = "none";
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
});

/**
 * GLOBAL HELPERS & UTILITIES
 */
function playText(text) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}
const playSound = () => playText(document.getElementById('card-en').innerText);
let currentIndex = 0;
function moveSlide(step) {
    const slides = document.querySelectorAll('.slide');
    const wrapper = document.querySelector('.slider-wrapper');
    const totalSlides = slides.length;
    if (totalSlides === 0) return;
    currentIndex = (currentIndex + step + totalSlides) % totalSlides;
    const offset = -currentIndex * 100;
    wrapper.style.transform = `translateX(${offset}%)`;
}
let lastVocabTarget = 'vocab-3000';

window.addEventListener('load', () => {
    const target = new URLSearchParams(window.location.search).get('target');
    if (target) document.querySelector(`.nav-item[data-target="${target}"]`)?.click();
});