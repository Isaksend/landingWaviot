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
    const errorMessage = document.getElementById('errorMessage');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const closeErrorBtn = document.getElementById('closeErrorBtn');
    const phoneInput = document.getElementById('phone');

    // Установка и обработка маски телефона
    phoneInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.value = '+7 7';
        }
    });

    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');

        // Если пользователь удалил все цифры, устанавливаем начальное значение
        if (value.length <= 2) {
            this.value = '+7 7';
            return;
        }

        // Форматирование для казахстанского номера
        if (value.length > 2) {
            // Гарантируем, что первые две цифры 7 7
            if (value.substring(0, 2) !== '77') {
                value = '77' + value.substring(2);
            }

            // Форматируем номер
            let formattedNumber = '+7 7';

            // Добавляем первые две цифры после префикса
            if (value.length > 2) {
                formattedNumber += value.substring(2, 4);
            }

            // Добавляем пробел и следующие три цифры
            if (value.length > 4) {
                formattedNumber += ' ' + value.substring(4, 7);
            }

            // Добавляем пробел и последние цифры
            if (value.length > 7) {
                formattedNumber += ' ' + value.substring(7, 11);
            }

            this.value = formattedNumber;
        }
    });

    // Предотвращение удаления префикса +7 7
    phoneInput.addEventListener('keydown', function(e) {
        const cursorPosition = this.selectionStart;

        // Если пользователь пытается удалить префикс, предотвращаем это
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
            e.preventDefault();
        }
    });

    // Открыть модальное окно при клике на кнопку
    if (btn) {
        btn.addEventListener('click', function() {
            openModal();
        });
    }

    // Закрыть модальное окно при клике на крестик
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal();
        });
    }

    // Закрыть сообщение об успехе и модальное окно при клике на кнопку Закрыть
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            closeModal();
            // Сбросить отображение формы после закрытия модального окна
            setTimeout(() => {
                resetFormDisplay();
            }, 300);
        });
    }

    // Закрыть сообщение об ошибке и вернуться к форме
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', function() {
            errorMessage.classList.remove('show');
            setTimeout(() => {
                errorMessage.style.display = 'none';
                formContainer.style.display = 'block';
            }, 300);
        });
    }

    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Закрыть модальное окно при нажатии клавиши Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Валидация формы и отправка
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Простая валидация
            const name = document.getElementById('name').value.trim();
            const company = document.getElementById('company').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!name || !company || !phone) {
                showError('Пожалуйста, заполните все обязательные поля');
                return;
            }

            // Валидация телефона - базовая проверка формата для Казахстана
            // Нам нужно только проверить, что номер начинается с +7 7 и содержит достаточное количество цифр
            // Старое регулярное выражение было слишком строгим: /^[+]?7\s?7[\d\s]{8,10}$/
            const phoneDigits = phone.replace(/\D/g, ''); // Удаляем все нецифровые символы
            if (phoneDigits.length < 10 || !phone.startsWith('+7 7')) {
                showError('Пожалуйста, введите корректный номер телефона в формате +7 7XX XXX XXXX');
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
    }

    function showError(message) {
        if (!errorMessage) return;

        // Обновляем текст сообщения об ошибке
        const errorText = errorMessage.querySelector('.error-text');
        if (errorText) {
            errorText.textContent = message;
        }

        // Показываем сообщение об ошибке с анимацией
        if (formContainer) formContainer.style.display = 'none';
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.classList.add('show');
        }, 10);
    }

    function submitForm(data) {
        // Имитируем AJAX-запрос с небольшой задержкой
        // Здесь замените на реальный AJAX-запрос

        // Имитация успешной отправки (80% случаев)
        const isSuccess = Math.random() > 0.2;

        setTimeout(() => {
            if (isSuccess) {
                // Показываем сообщение об успехе с анимацией
                if (formContainer) formContainer.style.display = 'none';
                if (errorMessage) errorMessage.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 10);
                }
            } else {
                // Показываем сообщение об ошибке
                showError('Произошла ошибка при отправке данных. Пожалуйста, попробуйте снова.');
            }
        }, 800); // Имитируем сетевую задержку
    }

    function resetFormDisplay() {
        if (formContainer) formContainer.style.display = 'block';
        if (successMessage) {
            successMessage.classList.remove('show');
            successMessage.style.display = 'none';
        }
        if (errorMessage) {
            errorMessage.classList.remove('show');
            errorMessage.style.display = 'none';
        }
        if (contactForm) {
            contactForm.reset();
            // Устанавливаем значение по умолчанию для телефона
            if (phoneInput) phoneInput.value = '+7 7';
        }
    }

    function openModal() {
        if (!modal) return;

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку за модальным окном
    }

    function closeModal() {
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Согласуем с длительностью перехода
        document.body.style.overflow = ''; // Восстанавливаем прокрутку
    }
});