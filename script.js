class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.countrySelect = document.getElementById('country');
        this.stateSelect = document.getElementById('state');
        this.citySelect = document.getElementById('city');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.countryCodeSelect = document.getElementById('countryCode');
        
        this.init();
    }

    init() {
        this.populateCountries();
        this.setupEventListeners();
    }

    populateCountries() {
        const countries = Object.keys(locationData);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            this.countrySelect.appendChild(option);
        });
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.countrySelect.addEventListener('change', () => {
            this.handleCountryChange();
            this.syncCountryCode();
        });
        this.stateSelect.addEventListener('change', () => this.handleStateChange());
        
        this.passwordInput.addEventListener('input', () => {
            this.validatePasswordStrength();
            this.validateForm();
        });
        this.confirmPasswordInput.addEventListener('input', () => {
            this.validatePasswordMatch();
            this.validateForm();
        });
        
        this.countryCodeSelect.addEventListener('change', () => this.validateForm());
        
        document.querySelectorAll('input[name="gender"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.querySelectorAll('input[name="gender"]').forEach(other => {
                        if (other !== e.target) other.checked = false;
                    });
                }
                this.validateForm();
            });
        });
    }

    setupRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field, true));
        });
    }

    handleCountryChange() {
        const country = this.countrySelect.value;
        this.stateSelect.innerHTML = '<option value="">Select State</option>';
        this.citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (country) {
            this.stateSelect.disabled = false;
            const states = Object.keys(locationData[country] || {});
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                this.stateSelect.appendChild(option);
            });
        } else {
            this.stateSelect.disabled = true;
            this.citySelect.disabled = true;
        }
        this.validateForm();
    }

    handleStateChange() {
        const country = this.countrySelect.value;
        const state = this.stateSelect.value;
        this.citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (country && state) {
            this.citySelect.disabled = false;
            const cities = locationData[country][state] || [];
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                this.citySelect.appendChild(option);
            });
        } else {
            this.citySelect.disabled = true;
        }
        this.validateForm();
    }

    syncCountryCode() {
        const country = this.countrySelect.value;
        const countryCodeMap = {
            'USA': '+1', 'Canada': '+1', 'UK': '+44', 'India': '+91', 'Australia': '+61',
            'Germany': '+49', 'France': '+33', 'Japan': '+81', 'Brazil': '+55', 'China': '+86',
            'Russia': '+7', 'South Korea': '+82', 'Italy': '+39', 'Spain': '+34', 'Netherlands': '+31',
            'Switzerland': '+41', 'Sweden': '+46', 'South Africa': '+27', 'Mexico': '+52', 'Argentina': '+54'
        };
        
        if (country && countryCodeMap[country]) {
            this.countryCodeSelect.value = countryCodeMap[country];
        }
    }

    validateField(field, showErrors = false) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                return this.validateName(field, value, showErrors);
            case 'email':
                return this.validateEmail(field, value, showErrors);
            case 'phone':
                return this.validatePhoneWithCountryCode(field, value, showErrors);
            case 'password':
                return this.validatePassword(field, value, showErrors);
            case 'confirmPassword':
                return this.validateConfirmPassword(field, value, showErrors);
            case 'country':
            case 'state':
            case 'city':
                return this.validateDropdown(field, value, showErrors);
            default:
                return true; // For non-validated fields
        }
    }

    validateName(field, value, showErrors = false) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'This field is required');
            return false;
        }
        if (value.length < 2) {
            if (showErrors) this.showError(field, errorElement, 'Must be at least 2 characters');
            return false;
        }
        const nameRegex = /^[a-zA-Z\s\-]+$/;
        if (!nameRegex.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Invalid characters in name');
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validateEmail(field, value, showErrors = false) {
        const errorElement = document.getElementById('emailError');
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Please enter a valid email address');
            return false;
        }
        const domain = value.split('@')[1].toLowerCase();
        if (typeof disposableDomains !== 'undefined' && disposableDomains.includes(domain)) {
            if (showErrors) this.showError(field, errorElement, 'Disposable email domains are not allowed');
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validatePhoneWithCountryCode(field, value, showErrors = false) {
        const errorElement = document.getElementById('phoneError');
        const countryCode = this.countryCodeSelect.value;
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'Phone number is required');
            return false;
        }
        const cleanPhone = value.replace(/\D/g, '');
        let isValidLength = true;
        let errorMessage = '';
        switch (countryCode) {
            case '+1': isValidLength = cleanPhone.length === 10; errorMessage = 'US/Canada numbers must be 10 digits'; break;
            case '+44': isValidLength = cleanPhone.length === 10 || cleanPhone.length === 11; errorMessage = 'UK numbers must be 10-11 digits'; break;
            case '+91': isValidLength = cleanPhone.length === 10; errorMessage = 'Indian numbers must be 10 digits'; break;
            case '+61': isValidLength = cleanPhone.length === 9; errorMessage = 'Australian numbers must be 9 digits'; break;
            default: isValidLength = cleanPhone.length >= 7 && cleanPhone.length <= 15; errorMessage = 'Phone number must be 7-15 digits';
        }
        if (!isValidLength) {
            if (showErrors) this.showError(field, errorElement, errorMessage);
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validatePassword(field, value, showErrors = false) {
        const errorElement = document.getElementById('passwordError');
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'Password is required');
            return false;
        }
        if (value.length < 8) {
            if (showErrors) this.showError(field, errorElement, 'Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Must contain an uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Must contain a lowercase letter');
            return false;
        }
        if (!/\d/.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Must contain a number');
            return false;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            if (showErrors) this.showError(field, errorElement, 'Must contain a special character');
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validateConfirmPassword(field, value, showErrors = false) {
        const errorElement = document.getElementById('confirmPasswordError');
        const password = this.passwordInput.value;
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'Please confirm your password');
            return false;
        }
        if (value !== password) {
            if (showErrors) this.showError(field, errorElement, 'Passwords do not match');
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validateDropdown(field, value, showErrors = false) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (!value) {
            if (showErrors) this.showError(field, errorElement, 'This field is required');
            return false;
        }
        this.clearError(field, errorElement);
        return true;
    }

    validatePasswordStrength() {
        const password = this.passwordInput.value;
        const meter = document.querySelector('.strength-meter');
        const text = document.getElementById('strengthText');
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        meter.className = 'strength-meter';
        text.className = 'strength-text';
        if (password.length === 0) {
            text.textContent = '';
        } else if (strength <= 2) {
            meter.classList.add('weak');
            text.classList.add('weak');
            text.textContent = 'Weak';
        } else if (strength <= 4) {
            meter.classList.add('medium');
            text.classList.add('medium');
            text.textContent = 'Medium';
        } else {
            meter.classList.add('strong');
            text.classList.add('strong');
            text.textContent = 'Strong';
        }
    }

    validatePasswordMatch() {
        this.validateConfirmPassword(this.confirmPasswordInput, this.confirmPasswordInput.value, true);
    }

    validateGender(showErrors = false) {
        const genderCheckboxes = document.querySelectorAll('input[name="gender"]:checked');
        const errorElement = document.getElementById('genderError');
        if (genderCheckboxes.length === 0) {
            if (showErrors) this.showError(null, errorElement, 'Please select a gender');
            return false;
        }
        this.clearError(null, errorElement);
        return true;
    }

    validateTerms(showErrors = false) {
        const termsCheckbox = document.getElementById('terms');
        const errorElement = document.getElementById('termsError');
        if (!termsCheckbox.checked) {
            if (showErrors) this.showError(termsCheckbox, errorElement, 'You must accept the terms and conditions');
            return false;
        }
        this.clearError(termsCheckbox, errorElement);
        return true;
    }

    validateForm(showErrors = false) {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'country', 'state', 'city', 'password', 'confirmPassword'
        ];
        let isValid = true;
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !this.validateField(field, showErrors)) {
                isValid = false;
            }
        });
        if (!this.validateGender(showErrors)) isValid = false;
        if (!this.validateTerms(showErrors)) isValid = false;
        
        return isValid;
    }

    showError(field, errorElement, message) {
        if (field) field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(field, errorElement) {
        if (field) field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    showMessage(message, type) {
        const messagesContainer = document.getElementById('form-messages');
        messagesContainer.innerHTML = `<div class="alert ${type}">${message}</div>`;
        setTimeout(() => {
            messagesContainer.innerHTML = '';
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        this.stateSelect.disabled = true;
        this.citySelect.disabled = true;
        this.stateSelect.innerHTML = '<option value="">Select State</option>';
        this.citySelect.innerHTML = '<option value="">Select City</option>';
        this.validatePasswordStrength();
        this.validateForm();
    }

    clearAllErrors() {
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));

        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });

        // Also clear the general error message
        this.clearGeneralError();
    }

    showGeneralError(message) {
        let generalErrorDiv = document.getElementById('generalFormError');
        if (!generalErrorDiv) {
            generalErrorDiv = document.createElement('div');
            generalErrorDiv.id = 'generalFormError';
            generalErrorDiv.className = 'alert error';
            this.form.appendChild(generalErrorDiv);
        }
        generalErrorDiv.textContent = message;
        generalErrorDiv.style.display = 'block';
    }

    clearGeneralError() {
        const generalErrorDiv = document.getElementById('generalFormError');
        if (generalErrorDiv) {
            generalErrorDiv.textContent = '';
            generalErrorDiv.style.display = 'none';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Clear all previous errors before validating again
        this.clearAllErrors();

        const isValid = this.validateForm(true);

        if (isValid) {
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: `${this.countryCodeSelect.value} ${document.getElementById('phone').value}`,
                age: document.getElementById('age').value || 'Not specified',
                gender: document.querySelector('input[name="gender"]:checked')?.value || 'Not specified',
                address: document.getElementById('address').value || 'Not specified',
                country: document.getElementById('country').value,
                state: document.getElementById('state').value,
                city: document.getElementById('city').value,
                timestamp: new Date().toISOString()
            };
            console.log('Form submitted:', formData);
            this.showMessage('Registration Successful! Your profile has been submitted successfully.', 'success');
            alert('Registration Successful!');
            setTimeout(() => this.resetForm(), 1000);
        } else {
            // Add a general error message below the form
            // this.showGeneralError("Please fix the highlighted errors before submitting.");

            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});
