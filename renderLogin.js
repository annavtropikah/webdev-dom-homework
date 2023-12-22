import { login, setToken, token } from "./api.js";




//отрисовка формы входа
export const renderLogin = ({fetchAndRenderComments}) => {
    const appElement = document.getElementById("app");
    const loginHtml = `
<div class="container">
    <div id="log-form" class="add-form">
      <h3>Форма входа</h3>
      <input type="text" id="login-input" class="form-name" placeholder="Введите логин" />
      <input type="password" id="password-input" class="form-password" placeholder="Введите пароль" />
      <div class="add-form-row">
        <button id="log-button" class="log-form-button">Войти</button>
      </div>
      <a class="log" href="#">Зарегистрироваться</a>
    </div>
  </div>
`;
appElement.innerHTML=loginHtml;

const buttonElement = document.getElementById("log-button");
const loginInputElemen = document.getElementById("login-input");
const passwordInputElement = document.getElementById("password-input");


buttonElement.addEventListener("click",()=>{
    login({
        login:loginInputElemen.value,
        password:passwordInputElement.value,
    }).then((responseData)=>{
setToken(responseData.user.token);
console.log(token);
    }).then(()=>{
        fetchAndRenderComments();
    })
});
};