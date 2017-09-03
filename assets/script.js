// https://meteor.today/boardlist/57e0afce41e832d5e53e5f97
// https://meteor.today/article/get_' + this.mode + '_articles
// https://meteor.today/article/get_basic_article_content, {articleId}
// refs:
// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
// https://stackoverflow.com/questions/6323417/how-do-i-retrieve-all-matches-for-a-regular-expression-in-javascript
Vue.prototype.$http = axios // http://stackoverflow.com/questions/41879928/switching-from-vue-resource-to-axios
new Vue({
    el: '#app',
    data: {
        fullContent: [],
        imageOnlyFlag: false,
        page: 0,
        loading: false,
        mode: localStorage.getItem('mode') != null ? localStorage.getItem('mode') : 'hot',
        EOF: false,
    },
    mounted: function() {  
        window.addEventListener('scroll', this.handleScroll)
        this.init()
    },
    computed: {
        theMode () {
            if (this.mode == 'hot') {
                return 'Hot';
            } else {
                return 'New';
            }
        },
        inverseMode () {
            if (this.mode == 'hot') {
                return 'New';
            } else {
                return 'Hot';
            }
        },
        imageOnlyBtn () {
            if (this.imageOnlyFlag) {
                return 'Full Content'
            } else {
                return 'Image Only'
            }
        }
    },
    methods: {
        init () {
            this.fullContent = []
            this.page = 0
            this.meteor(0)
            this.EOF = false
        },
        switchMode () {
            if (this.mode == 'hot') {
                this.mode = 'new'
                localStorage.setItem('mode', 'new')
                this.init()
            } else {
                this.mode = 'hot'
                localStorage.setItem('mode', 'hot')
                this.init()
            }
        },
        handleScroll () {
            // $(window).scrollTop(), $(window).height(), $(document).height()
            let window_scrollTop = document.body.scrollTop || window.pageYOffset;
            const window_height = window.innerHeight || document.documentElement.clientHeight;
            let body_height = document.body.scrollHeight || document.documentElement.scrollHeight;
            if(!this.loading && !this.EOF && window_scrollTop + window_height >= body_height - 100 ) {
                this.page++
                this.meteor(this.page)
            }
        },
        encodeToImg (content) {
            if (this.imageOnlyFlag && !content.includes('.jpg') && !content.includes('.png') ) {
                return '此文無相片'
            }
            let only = ''
            const imgur_pattern = /https?:\/\/(?:i\.)?imgur\.com\/\w+\.(?:jpg|png|gif)/g;
            var matched;
            while ((matched = imgur_pattern.exec(content)) !== null) {
                img_tag = `<img class='contentImg' src='${matched[0]}'/>`
                content = content.replace(matched[0], img_tag)
                only += img_tag
            }
            return !this.imageOnlyFlag ? content : only
        },
        meteor (page) {
            this.loading = true
            let data = {
                boardId: '56fcf952299e4a3376892c1f',//'57e0afce41e832d5e53e5f97',
                version: 2,
                page: page
            }
            let url = 'https://meteor.today/article/get_' + this.mode + '_articles'
            this.$http.post(url, data)
                .then(response => {
                    let res = JSON.parse(decodeURI(response.data.result))
                    if (res.length < 1) {
                        this.EOF = true
                    }
                    for (var i = 0, len = res.length; i < len; i++) {
                        this.fullContent.push(res[i])
                    }
                    this.loading = false
                }, (response) => {
                    var r = confirm("https://meteor.today失連。你可以上他們的網站確認是不是掛了(很常掛掉)。取消：到另外一頁。確定：重新整理。");
                    if (r == true) {
                        location.reload();
                    } else {
                        window.location.href = 'dcard.html';
                    }
                })
        },
        createTime (time) {
            let date = new Date(time)
            let newtime = ` ${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            return newtime
        }
    }
})