import { apiLogin, apiMe, apiRegister } from "../api.js";
import { navigate } from "../router.js";
import { getState, updateState } from "../state.js";
export function renderRegistrationPage(root) {
    const state = getState();
    const hasUser = Boolean(state.currentUser);
    const container = document.createElement("div");
    container.className = "page";
    const title = document.createElement("h1");
    title.textContent = "Регистрация и вход";
    container.appendChild(title);
    const backLink = document.createElement("a");
    backLink.href = "/";
    backLink.textContent = "На главную";
    backLink.setAttribute("data-link", "true");
    backLink.className = "link-back";
    container.appendChild(backLink);
    const formsWrapper = document.createElement("div");
    formsWrapper.className = "forms-row";
    const registerForm = document.createElement("form");
    registerForm.setAttribute("data-registration", "true");
    registerForm.className = "card";
    const registerTitle = document.createElement("h2");
    registerTitle.textContent = "Регистрация";
    registerForm.appendChild(registerTitle);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.placeholder = "Имя";
    registerForm.appendChild(nameInput);
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.placeholder = "Email";
    registerForm.appendChild(emailInput);
    const loginInput = document.createElement("input");
    loginInput.type = "text";
    loginInput.name = "login";
    loginInput.placeholder = "Логин";
    registerForm.appendChild(loginInput);
    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.name = "phone";
    phoneInput.placeholder = "Телефон";
    registerForm.appendChild(phoneInput);
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.placeholder = "Пароль";
    registerForm.appendChild(passwordInput);
    const registerError = document.createElement("div");
    registerError.className = "error-text";
    registerForm.appendChild(registerError);
    const registerButton = document.createElement("button");
    registerButton.type = "submit";
    registerButton.textContent = "Зарегистрироваться";
    registerForm.appendChild(registerButton);
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        registerError.textContent = "";
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const login = loginInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();
        if (!name || !email || !login || !phone || !password) {
            registerError.textContent = "Заполните все поля";
            return;
        }
        const user = await apiRegister({ name, email, login, phone, password });
        if (!user) {
            registerError.textContent = "Не удалось зарегистрироваться";
            return;
        }
        updateState({
            currentUser: user,
            cartItems: user.cartItems,
            deliveries: user.deliveries
        });
        navigate("/");
    });
    const loginForm = document.createElement("form");
    loginForm.className = "card";
    const loginTitle = document.createElement("h2");
    loginTitle.textContent = "Вход";
    loginForm.appendChild(loginTitle);
    const loginUserInput = document.createElement("input");
    loginUserInput.type = "text";
    loginUserInput.name = "loginOrEmailOrPhone";
    loginUserInput.placeholder = "Логин, email или телефон";
    loginForm.appendChild(loginUserInput);
    const loginPasswordInput = document.createElement("input");
    loginPasswordInput.type = "password";
    loginPasswordInput.name = "password";
    loginPasswordInput.placeholder = "Пароль";
    loginForm.appendChild(loginPasswordInput);
    const loginError = document.createElement("div");
    loginError.className = "error-text";
    loginForm.appendChild(loginError);
    const loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.textContent = "Войти";
    loginForm.appendChild(loginButton);
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        loginError.textContent = "";
        const loginValue = loginUserInput.value.trim();
        const passwordValue = loginPasswordInput.value.trim();
        if (!loginValue || !passwordValue) {
            loginError.textContent = "Заполните все поля";
            return;
        }
        const user = await apiLogin({
            loginOrEmailOrPhone: loginValue,
            password: passwordValue
        });
        if (!user) {
            loginError.textContent = "Неверные данные";
            return;
        }
        updateState({
            currentUser: user,
            cartItems: user.cartItems,
            deliveries: user.deliveries
        });
        navigate("/");
    });
    formsWrapper.appendChild(registerForm);
    formsWrapper.appendChild(loginForm);
    container.appendChild(formsWrapper);
    const info = document.createElement("div");
    info.className = "info-box";
    if (hasUser) {
        info.textContent = "Вы уже авторизованы. Можете вернуться на главную.";
    }
    else {
        info.textContent = "После регистрации сессия будет действовать 10 минут.";
    }
    container.appendChild(info);
    root.innerHTML = "";
    root.appendChild(container);
    void apiMe().then(user => {
        if (!user) {
            return;
        }
        updateState({
            currentUser: user,
            cartItems: user.cartItems,
            deliveries: user.deliveries
        });
    });
}
