
import { format } from "date-fns";
import { getComments } from './api.js';

//import { formatDateTime } from './formatDateTime.js';

import { renderComment } from './render.js';
// import { renderLogin } from './renderLogin.js';

export let user = JSON.parse(localStorage.getItem("user"));
export const setUser = (newUser) => {
    user = newUser;
};
console.log(user);
export let comments = [];

export const fetchAndRenderComments = () => {
    getComments().then((responceData) => {
        const appComments = responceData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: format(new Date(comment.date),"yyyy-MM-dd hh.mm.ss"),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        comments = appComments;
        renderComment();

    });
};

fetchAndRenderComments();


