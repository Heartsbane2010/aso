//Component Toggle Action
function switchForm(formType) {
    const buttons = document.querySelectorAll('.toggle-btn');
    const panels = document.querySelectorAll('.form-panel');

    buttons.forEach(btn => btn.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    
    if(formType === 'register') {
        buttons[0].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    } else {
        buttons[1].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    }
};/* We select the toggle buttons and the form panel of the two forms. We went ahead to remove the "active" class of both, which is color change for the toggle and a display of block for the form panel. If the formType passed is register, we restore the active class of the first toggle button(at index "0") and the corresponding form panel. */

// Core Regex Definition Blueprints
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const firstnameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const lastnameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least 1 letter and 1 number

//Helper Visibility Function
function toggleError(elementId, showError) {
    document.getElementById(elementId).style.display = showError ? 'block' : 'none';
}/*This helper function helps us decides which element to show or not. showError is just a boolean flag that holds true/false. In the function, if showError is true, the element's CSS display is set to block(visible), otherwise none*/


//Validating Registration Form
function validateRegister(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('regEmail').value;
    const firstName = document.getElementById('regFirstname').value;
    const lastName = document.getElementById('regLastname').value;
    const pwd = document.getElementById('regPassword').value;

    let isValid = true;

    if (!emailRegex.test(email)) {
        toggleError('regEmailError', true);
        isValid = false;
    } else {
        toggleError('regEmailError', false);
    }

    if (!firstnameRegex.test(firstName)) {
        toggleError('regFirstnameError', true);
        isValid = false;
    } else {
        toggleError('regFirstnameError', false);
    }

    if (!lastnameRegex.test(lastName)) {
        toggleError('regLastnameError', true);
        isValid = false;
    } else {
        toggleError('regLastnameError', false);
    }

    if (!passwordRegex.test(pwd)) {
        toggleError('regPasswordError', true);
        isValid = false;
    } else {
        toggleError('regPasswordError', false);
    }

    registerUser(event);
    return isValid;

    if (isValid) alert('You have registered successfully!'); // Placeholder for successful registration action
    return isValid;
};/* If the value of our elements does not match the already established regex, we return our reusable function "toggleError" and passing in the element's id and setting the value to true, so our error message can be displayed. If the regex conditions are met, we hide the error message with toggleError, and set isValid to true with an alert */

//Validating Login Form
function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('loginEmail').value;
    const pwd = document.getElementById('loginPassword').value;

    let isValid = true;

    if (!emailRegex.test(email)) {
        toggleError('loginEmailError', true);
        isValid = false;
    } else {
        toggleError('loginEmailError', false);
    }

    if (pwd.length < 8) {
        toggleError('loginPasswordError', true);
        isValid = false;
    } else {
        toggleError('loginPasswordError', false);
    }

    loginUser(event);
    return isValid;

    if (isValid) alert('You have logged in successfully!'); // Placeholder for successful login action
    return isValid;
};

//Communication with the Backend
//Register User
const registerUser = async (e) => {
    e.preventDefault();

    const firstname = document.getElementById('regFirstname').value;
    const lastname = document.getElementById('regLastname').value;
    const email =  document.getElementById('regEmail').value;
    const pwd = document.getElementById('regPassword').value;

    try {
        const res = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, pwd })
    });
    console.log(res);
    const data = await res.json();

    if (res.ok) {
        alert('You have registered successfully!');
        console.log(data);//contains user + token
        window.location.href = '../Members/dashboard.html';//Redirect to members dashboard upon successful registration
    } else {
        toggleError('regEmailError', true);
        console.error(data.message);
    }
    } catch (error) {
        console.error('Error registering:',  error)
    }
};

//Login User
const loginUser = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pwd = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, pwd })
    });
    const data = await res.json();

    if (res.ok) {
        const accessToken = data.accessToken || data.authToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('authToken', accessToken); // backward compatibility for older code
        localStorage.setItem('userId', data.userId);
        alert('Login Successful');
        console.log(data);//contains user id + token
        window.location.href = '../Members/dashboard.html';//Redirect to members dashboard upon successful login
    } else {
        toggleError('loginEmailError', true);
        console.error(data.message);
    }
    } catch (error) {
        console.error('Error logging in:',  error)
    }
};

//regPassword Visibility Toggle
const toggleRegVisibility = document.getElementById('toggleRegVisibility');
const regPasswordInput = document.getElementById('regPassword');
const eyeSlashReg = document.getElementById('eyeSlashReg');

toggleRegVisibility.addEventListener('click', () => {
    //Toggle the type attribute of the password input field
    const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    regPasswordInput.setAttribute('type', type);//Replace "type" with the one that is able to switch between pwd and text

    //Toggle the visibility of the eye slash icon
    if (type === 'text') {
        eyeSlashReg.style.display = 'none';//Hide the slash icon when password is visible
    } else {
        eyeSlashReg.style.display = 'block';//Show the slash icon when password is hidden
    }
});


//loginPassword Visibility Toggle
const toggleLoginVisibility = document.getElementById('toggleLoginVisibility');
const loginPasswordInput = document.getElementById('loginPassword');
const eyeSlashLogin = document.getElementById('eyeSlashLogin');

toggleLoginVisibility.addEventListener('click', () => {
    //Toggle the type attribute of the password input field
    const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPasswordInput.setAttribute('type', type);//Replace "type" with the one that is able to switch between pwd and text

    //Toggle the visibility of the eye slash icon
    if (type === 'text') {
        eyeSlashLogin.style.display = 'none';//Hide the slash icon when password is visible
    } else {
        eyeSlashLogin.style.display = 'block';//Show the slash icon when password is hidden
    }
});
 