var SERVER = 'https://q86.herokuapp.com/ptt';
var NEXT_URL;
var LOADING = false;

function render(result) {
    NEXT_URL = result.url;
    let html = '';
    const articles = result.articles;
    for (let i = 0; i < articles.length; i++) {
        html += `<a href='${articles[i][1]}' target='_blank'>
            <span class='title'>${articles[i][0]}</span>
        </a><p>`;
        for (let j = 2; j < articles[i].length; j++) {
            html += `<img class='contentImg' src='${articles[i][j]}.jpg'>`;
        }
        html += '</p><hr>';
    }
    document.getElementById('app').innerHTML += `${html}`;
}
function toggleLoading () {
    LOADING = !LOADING;
    if (LOADING) {
        document.querySelector(".fa-spinner").style.display = 'block';
    } else {
        document.querySelector(".fa-spinner").style.display = 'none';
    }
}
function getRequest(url, callback) {
    toggleLoading();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            toggleLoading();
            callback(JSON.parse(xhr.responseText));
        } else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
function handleScroll() {
    let window_scrollTop = document.body.scrollTop || window.pageYOffset;
    const window_height = window.innerHeight || document.documentElement.clientHeight;
    let body_height = document.body.scrollHeight || document.documentElement.scrollHeight;
    if(!LOADING && window_scrollTop + window_height >= body_height - 100) {
        getRequest(`${SERVER}?url=${NEXT_URL}`, function (data) {
            render(data);
        });
    }
}
(function init() {
    getRequest(SERVER, function (data) {
        render(data);
        window.addEventListener('scroll', handleScroll);
    });
})();
