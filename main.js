

import { getComments, postComment } from './api.js';
import { sanitizeHtml } from './sanitizeHtml.js';
import { formatDateTime } from './formatDateTime.js';
import { renderComment } from './render.js';

const buttonElement = document.getElementById('add-button');
const nameInputElement = document.getElementById("name-input");
const textareaInputElement = document.getElementById("textarea-input");
const commentsLoading = document.getElementById("comments-loading");
const addForm = document.getElementById("add-form");
const addComment = document.getElementById("add-comment");


let comments = [];

const fetchAndRenderComments = () => {
    getComments().then((responceData) => {
        const appComments = responceData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: formatDateTime(new Date(comment.date)),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        commentsLoading.classList.add("hidden");
        comments = appComments;
        renderComment({ comments });
        
    });
};

fetchAndRenderComments();


export const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button');
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = likeButton.dataset.index;
            comments[index].likes += comments[index].isLiked ? -1 : +1;
            comments[index].isLiked = !comments[index].isLiked;

            renderComment({comments});
        });
    }
};


// answer a comment

export const initAnswerCommentListeners = () => {
    const commentsList = document.querySelectorAll('.comment');
    for (const theComment of commentsList) {
        theComment.addEventListener('click', () => {
            const name = theComment.dataset.name;
            const text = theComment.dataset.text;
            textareaInputElement.value = `BEGIN_QUOTE${name}:\n${text}END_QUOTE`
        });
    }
}
// new comment

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


    renderComment({ comments });
};

buttonElement.addEventListener('click', addNewComment);
renderComment({ comments });