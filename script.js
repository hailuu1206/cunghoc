document.addEventListener('DOMContentLoaded', () => {
    // 1. Tối ưu điều hướng Card bằng Event Delegation
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.card, .m-card, .resource-item, .exp-card, .view-all-link, .primary-btn');
        if (!card) return;

        const target = card.getAttribute('data-target') || card.getAttribute('href');
        if (target && !target.startsWith('#') && target !== 'javascript:void(0)') {
            window.location.href = target.includes('.html') ? target : `study.html?target=${target}`;
        }
    });

    // 2. Xử lý thay đổi ảnh Hero
    const imageNode = document.getElementById('heroImageContainer');
    const imageUpload = document.getElementById('imageUpload');
    const heroImg = document.getElementById('heroImg');

    if (imageNode && imageUpload) {
        imageNode.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    heroImg.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Hiệu ứng chạy thanh tiến độ (Progress Bar)
    const progressFills = document.querySelectorAll('.p-fill');
    progressFills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.style.width = '0'; // Đặt về 0 ban đầu
        setTimeout(() => {
            fill.style.width = targetWidth; // Chạy lên mức thực tế
        }, 300);
    });

    // 4. Hiệu ứng cuộn mượt (Smooth Scroll) cho Footer
    const footerLinks = document.querySelectorAll('.footer-column ul li a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Hiệu ứng Fade-In khi cuộn trang (Scroll Reveal)
    const fadeElements = document.querySelectorAll('.fade-element');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Kích hoạt khi phần tử hiện ra 15% trên màn hình
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Ngừng theo dõi sau khi đã hiện ra để tối ưu hiệu suất
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
});