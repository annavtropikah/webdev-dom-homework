
const host = "https://wedev-api.sky.pro/api/v2/anna-kozhevnikova/comments";
const userUrl = "https://wedev-api.sky.pro/api/user/login";

//важно ,чтобы объявление и функция по переопределению были в одном модуле, тогда при экспорте ошибки с типом(константой) не будет. При импорте переменные становятся константами
export let token;
export const setToken = (newToken) => {
    token = newToken;
};



export function getComments() {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization:`Bearer ${token}`,
        },
    }).then((responce) => {
        if (responce.status === 401) {
            throw new Error("Not authorised");
        }
        return responce.json();
    })
}

export function postComment({ name, text }) {
    return fetch(host,
        {
            method: "POST",
            headers: {
                Authorization:`Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                text: text,
                /*forceError: true*/
            }),
        })
}


export function login({ login, password }) {
    return fetch(userUrl, {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 201) {
            console.log("вот комментарии");
            //отрисуй страницу комментариев с формой ввода комментария
        }
        return response.json();
    });
}