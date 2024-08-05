const server = 'https://real-time-p8h4.onrender.com';
axios.defaults.baseURL = server;
const usernameInput = document.getElementById('inputUsername');
const passwordInput = document.getElementById('inputPassword');
const registrationForm = document.getElementById('registration');
const errorWrapper = document.getElementById('error-wrapper');


registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    let username = usernameInput.value;
    let password = passwordInput.value;

    axios.post('auth/register', {username: username, password: password})
    .then((response) => {
        localStorage.setItem('token', response.data.token);
        location = '/'
    })
    .catch(error => {
        errorWrapper.innerHTML = `
        <div class="alert w-100 alert-danger d-flex align-items-center" role="alert">
            <svg class="bi danger-img" role="img" aria-label="Danger:">
                <use xlink:href="#exclamation-triangle-fill"/>
            </svg>
             
            <div>
                ${error.response.data.message}
            </div>
        </div>
        `
    })

})