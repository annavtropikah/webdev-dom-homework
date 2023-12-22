

import { getComments} from './api.js';

import { formatDateTime } from './formatDateTime.js';

import { renderComment } from './render.js';
import { renderLogin } from './renderLogin.js';



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
        // commentsLoading.classList.add("hidden");
        comments = appComments;
        renderComment({ comments });
        
    });
};

// fetchAndRenderComments();
renderLogin({fetchAndRenderComments});

