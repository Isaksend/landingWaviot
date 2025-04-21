// JavaScript для модального окна - добавьте в ваш файл script.js
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Добавляем анимацию появления для элементов при прокрутке
    const fadeInElements = document.querySelectorAll('.feature-card, .use-case');

    // Создаем экземпляр IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.3,
        rootMargin: '0px'
    });

    // Наблюдаем за каждым элементом
    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Функционал модального окна
    const modal = document.getElementById('modal');
    const btn = document.querySelector('.btn');
    const closeButton = document.querySelector('.close-button');
    const contactForm = document.getElementById('contactForm');
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Открыть модальное окно при клике на кнопку
    btn.addEventListener('click', function() {
        openModal();
    });

    // Закрыть модальное окно при клике на крестик
    closeButton.addEventListener('click', function() {
        closeModal();
    });

    // Закрыть сообщение об успехе и модальное окно при клике на кнопку Закрыть
    closeSuccessBtn.addEventListener('click', function() {
        closeModal();
        // Сбросить отображение формы после закрытия модального окна
        setTimeout(() => {
            resetFormDisplay();
        }, 300);
    });

    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Закрыть модальное окно при нажатии клавиши Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Валидация формы и отправка
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Простая валидация
        const name = document.getElementById('name').value.trim();
        const company = document.getElementById('company').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !company || !phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        // Валидация телефона - базовая проверка формата для Казахстана
        const phoneRegex = /^[+]?7\s?7[\d\s]{8,10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона в формате +7 7XX XXX XXXX');
            return;
        }

        // Собираем данные формы
        const formData = new FormData(contactForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Здесь вы обычно отправляете данные на сервер через AJAX
        console.log('Форма отправлена:', formDataObject);

        // Имитируем отправку формы (при необходимости добавьте состояние загрузки)
        submitForm(formDataObject);
    });

    function submitForm(data) {
        // Имитируем AJAX-запрос с небольшой задержкой
        setTimeout(() => {
            // Показываем сообщение об успехе с анимацией
            formContainer.style.display = 'none';
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 10);
        }, 800); // Имитируем сетевую задержку
    }

    function resetFormDisplay() {
        formContainer.style.display = 'block';
        successMessage.classList.remove('show');
        successMessage.style.display = 'none';
        contactForm.reset();
    }

    function openModal() {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку за модальным окном
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Согласуем с длительностью перехода
        document.body.style.overflow = ''; // Восстанавливаем прокрутку
    }
});