const listElement = document.getElementById("list");


export const renderComment = ({comments}) => {
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

