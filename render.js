
import { sanitizeHtml } from './sanitizeHtml.js';

import { postComment, token } from './api.js';
import { comments, fetchAndRenderComments, user } from './main.js';
import { renderLogin } from './renderLogin.js';




// const listElement = document.getElementById("list");

export const renderComment = () => {
  const appElement = document.getElementById("app");

  const commentHtml = comments.map((comment, index) => {
    return `<li class="comment" data-name="${comment.name}" data-text="${comment.text}">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text.replaceAll("BEGIN_QUOTE", "<div class='quote'>").replaceAll("END_QUOTE", "</div>")}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="like-button ${comment.isLiked ? "-active-like" : ''}" data-index="${index}"></button>
            </div>
          </div>
          </li>`;
  }).join('');

  const formHtml = () => {
    if (!token) return btnLogin;
    return `
  <div id="add-form" class="add-form">
  <input type="text" id="name-input" class="add-form-name" placeholder="Введите ваше имя" value="${user.name}" readonly/>
  <textarea type="textarea" id="textarea-input" class="add-form-text" placeholder="Введите ваш коментарий"
    rows="4"></textarea>
  <div class="add-form-row">
    <button id="add-button" class="add-form-button">Написать</button>
  </div>

</div>
<div id="add-comment" class="div"></div>
`
  }

  const btnLogin = `
<p class="render-login-btn">  Чтобы добавить комментарий, <u>авторизуйтесь</u> </p>
`
  function actionRenderLoginbtn() {
    if (token) return
    const btn = document.querySelector(".render-login-btn")
    btn.addEventListener('click', () => {
      renderLogin()
    })
  }

  const appHtml = `
    <div class="container">
    <ul id="list" class="comments">

${commentHtml}
    </ul>
   ${formHtml()}
  </div>
    `;

  appElement.innerHTML = appHtml;

  actionRenderLoginbtn();



  // new comment

  const addNewComment = () => {
    const nameInputElement = document.getElementById("name-input");
    const textareaInputElement = document.getElementById("textarea-input");

    nameInputElement.classList.remove("error");
    textareaInputElement.classList.remove("error");

    if (nameInputElement.value === "") {
      nameInputElement.classList.add("error");
      return;
    } else if (textareaInputElement.value === "") {
      textareaInputElement.classList.add("error");

      return;
    }






    
    //отвалилось
    const addForm = document.getElementById("add-form");
    const addComment = document.getElementById("add-comment");
    
    addForm.classList.add("hidden");
    addComment.classList.remove("hidden");
    addComment.innerHTML = "Элемент добавляется...";




    postComment({
      text: sanitizeHtml(textareaInputElement.value),

    })
      .then((response) => {
        if (response.status === 201) {

          fetchAndRenderComments()
      
          nameInputElement.value = "";
          textareaInputElement.value = '';
          addForm.classList.remove("hidden");
          addComment.classList.add("hidden");

          return
        }
        if (response.status === 400) {
          return Promise.reject("вы ввели имя короче 3-х символов");
        }
        if (response.status === 500) {
          return Promise.reject("ошибка сервера");
        }
        return Promise.reject("сервер упал");

      })
      .catch((error) => {
        addForm.classList.remove("hidden");
        addComment.classList.add("hidden");
        alert(error);
        //todo:отправлять в систему сбора ошибок??
        console.warn(error);
      })


    renderComment();
  };

  if (token) {
    const buttonElement = document.getElementById('add-button');

    buttonElement.addEventListener('click', addNewComment);
  }

  initLikeListeners();
  initAnswerCommentListeners();

};






const initLikeListeners = () => {
  const likeButtons = document.querySelectorAll('.like-button');
  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!token) {
        alert("autorize")
        return
      }
      const index = likeButton.dataset.index;
      comments[index].likes += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;

      renderComment();
    });
  }
};
// answer a comment
export const initAnswerCommentListeners = () => {
  const textareaInputElement = document.getElementById("textarea-input");
  const commentsList = document.querySelectorAll('.comment');
  for (const theComment of commentsList) {
    theComment.addEventListener('click', () => {
      const name = theComment.dataset.name;
      const text = theComment.dataset.text;
      textareaInputElement.value = `BEGIN_QUOTE${name}:\n${text}END_QUOTE`
    });
  }
}








