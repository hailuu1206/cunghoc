document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lấy dữ liệu
        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Reset lỗi
        document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
        document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => el.style.borderColor = '#f1f2f6');

        let isValid = true;

        // Kiểm tra tên
        if (name === '') {
            showError('nameError', 'Vui lòng nhập họ và tên');
            isValid = false;
        } else if (name.length < 2) {
            showError('nameError', 'Họ tên quá ngắn');
            isValid = false;
        }

        // Kiểm tra số điện thoại (định dạng VN cơ bản)
        const phonePattern = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (phone === '') {
            showError('phoneError', 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            showError('phoneError', 'Số điện thoại không hợp lệ');
            isValid = false;
        }

        // Kiểm tra email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('emailError', 'Vui lòng nhập email');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError('emailError', 'Email không đúng định dạng');
            isValid = false;
        }

        // Kiểm tra chủ đề
        if (subject === '') {
            showError('subjectError', 'Vui lòng chọn chủ đề');
            isValid = false;
        }

        // Kiểm tra nội dung
        if (message === '') {
            showError('messageError', 'Vui lòng nhập nội dung thông điệp');
            isValid = false;
        } else if (message.length < 10) {
            showError('messageError', 'Nội dung góp ý cần ít nhất 10 ký tự');
            isValid = false;
        }

        if (isValid) {
            alert('Cảm ơn góp ý của bạn! Ban quản trị sẽ phản hồi sớm nhất có thể.');
            contactForm.reset();
        }
    });

    function showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        errorEl.innerText = message;
        errorEl.previousElementSibling.style.borderColor = '#ff7675';
    }
});