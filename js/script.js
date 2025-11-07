document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const burger = document.querySelector('.menu'); 
    const navUl = document.querySelector('.nav-links');
    const contactForm = document.getElementById('contact-form');
    const submissionOutput = document.getElementById('submission-output'); 
    const welcomeMessage = document.getElementById('welcome-message');
    
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // Scroll to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show-btn');
        } else {
            scrollToTopBtn.classList.remove('show-btn');
        }
    });

    // Navigation logic
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            if (window.innerWidth <= 768) {
                navUl.classList.remove('show');
            }
        });
    });

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.5 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    burger.addEventListener('click', () => {
        navUl.classList.toggle('show');
    });

    // Greeting function
    function greetUser() {
        let userName = sessionStorage.getItem('userName');
        if (!userName) {
             userName = prompt("Please enter your name:");
             if (userName && userName.trim() !== "") {
                 sessionStorage.setItem('userName', userName.trim());
             } else {
                 userName = "User";
             }
        }
        
        const blueNameSpan = `<span class="user-name">${userName}</span>`;
        welcomeMessage.innerHTML = `Hi, ${blueNameSpan}! Welcome to Sui Company`;
    }
    
    greetUser();

    // Validation
    function validateInput(inputElement, errorMessageElement, validationFunc, errorMessage) {
        const value = inputElement.value.trim();
        if (validationFunc(value)) {
            errorMessageElement.textContent = '';
            errorMessageElement.style.display = 'none';
            inputElement.classList.remove('error');
            return true;
        } else {
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            inputElement.classList.add('error');
            return false;
        }
    }

    const isRequired = (value) => value.length > 0;
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidPhone = (value) => /^\+?(\d[\d\s-()]{7,}\d)$/.test(value);

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        let isFormValid = true;

        // Validate Name
        const nameInput = document.getElementById('name');
        isFormValid = validateInput(nameInput, document.getElementById('name-error'), isRequired, 'Name is required.') && isFormValid;

        // Validate Email
        const emailInput = document.getElementById('email');
        let isEmailValid = validateInput(emailInput, document.getElementById('email-error'), isRequired, 'Email is required.');
        if (isEmailValid) {
            isEmailValid = validateInput(emailInput, document.getElementById('email-error'), isValidEmail, 'Please enter a valid email address.');
        }
        isFormValid = isEmailValid && isFormValid;

        // Validate Phone
        const phoneInput = document.getElementById('phone');
        let isPhoneValid = validateInput(phoneInput, document.getElementById('phone-error'), isRequired, 'Phone number is required.');
        if (isPhoneValid) {
            isPhoneValid = validateInput(phoneInput, document.getElementById('phone-error'), isValidPhone, 'Please enter a valid phone number.');
        }
        isFormValid = isPhoneValid && isFormValid;


        // Validate Message
        const messageInput = document.getElementById('message');
        isFormValid = validateInput(messageInput, document.getElementById('message-error'), isRequired, 'Message is required.') && isFormValid;

        if (isFormValid) {
            document.getElementById('output-name').textContent = nameInput.value.trim();
            document.getElementById('output-email').textContent = emailInput.value.trim();
            document.getElementById('output-phone').textContent = phoneInput.value.trim();
            document.getElementById('output-message').textContent = messageInput.value.trim();

            submissionOutput.classList.remove('hidden-output'); 
            submissionOutput.classList.add('visible');

            submissionOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Real-time validation
    document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(input => {
        input.addEventListener('blur', (e) => {
            const field = e.target;
            const errorElement = document.getElementById(`${field.id}-error`);
            
            if (field.id === 'name') {
                validateInput(field, errorElement, isRequired, 'Name is required.');
            } else if (field.id === 'email') {
                let isValid = validateInput(field, errorElement, isRequired, 'Email is required.');
                if (isValid) validateInput(field, errorElement, isValidEmail, 'Please enter a valid email address.');
            } else if (field.id === 'phone') {
                let isValid = validateInput(field, errorElement, isRequired, 'Phone number is required.');
                if (isValid) validateInput(field, errorElement, isValidPhone, 'Please enter a valid phone number.');
            } else if (field.id === 'message') {
                validateInput(field, errorElement, isRequired, 'Message is required.');
            }
        });
    });
});