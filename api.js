export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/anna-kozhevnikova/comments", {
        method: "GET"
    }).then((responce) => {
        return responce.json();
    })
}

export function postComment({ name, text }) {
    return fetch("https://wedev-api.sky.pro/api/v1/anna-kozhevnikova/comments",
        {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: text,
                /*forceError: true*/
            }),
        })
}