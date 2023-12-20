

import { getComments, postComment } from './api.js';
import { sanitizeHtml } from './sanitizeHtml.js';
import { formatDateTime } from './formatDateTime.js';



const buttonElement = document.getElementById('add-button');
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textareaInputElement = document.getElementById("textarea-input");
const commentsLoading = document.getElementById("comments-loading");
const addForm = document.getElementById("add-form");
const addComment = document.getElementById("add-comment");

// const formatDateTime = (date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear() - 2000);
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     return `${day}.${month}.${year} ${hours}:${minutes}`;
// };

const fetchAndRenderComments = () => {
    getComments().then((responceData) => {
        const appComments = responceData.comments.map((comment) => {
            return {
                //достаем имя автора
                name: comment.author.name,
                //преобразовываем дату в Date
                date: formatDateTime(new Date(comment.date)),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        commentsLoading.classList.add("hidden");
        comments = appComments;
        renderComment();
    });
};

fetchAndRenderComments();

//рендер комментария
let comments = [];
const renderComment = () => {
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

    listElement.innerHTML = commentHtml;
    initLikeListeners();
    initAnswerCommentListeners();
};

const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button');
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = likeButton.dataset.index;
            comments[index].likes += comments[index].isLiked ? -1 : +1;
            comments[index].isLiked = !comments[index].isLiked;

            renderComment();
        });
    }
};


// answer a comment

const initAnswerCommentListeners = () => {
    const commentsList = document.querySelectorAll('.comment');
    for (const theComment of commentsList) {
        theComment.addEventListener('click', () => {
            const name = theComment.dataset.name;
            const text = theComment.dataset.text;
            textareaInputElement.value = `BEGIN_QUOTE${name}:\n${text}END_QUOTE`
        });
    }
}
//new comment

const addNewComment = () => {
    nameInputElement.classList.remove("error");
    textareaInputElement.classList.remove("error");

    if (nameInputElement.value === "") {
        nameInputElement.classList.add("error");
        return;
    } else if (textareaInputElement.value === "") {
        textareaInputElement.classList.add("error");

        return;
    }


    addForm.classList.add("hidden");
    addComment.classList.remove("hidden");
    addComment.innerHTML = "Элемент добавляется...";
    postComment({
        name: sanitizeHtml(nameInputElement.value),
        text: sanitizeHtml(textareaInputElement.value),
        /*forceError: true,*/
    })
        .then((response) => {
            if (response.status === 201) {
                fetchAndRenderComments()
                    .then(() => {
                        nameInputElement.value = "";
                        textareaInputElement.value = '';
                        addForm.classList.remove("hidden");
                        addComment.classList.add("hidden");
                    })
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

buttonElement.addEventListener('click', addNewComment);
renderComment();