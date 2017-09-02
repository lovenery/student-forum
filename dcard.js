// https://www.dcard.tw/_api/forums/sex/posts?popular=true&before=225694690
// https://www.dcard.tw/_api/posts/225699806
// https://www.dcard.tw/_api/posts/225699806/comments
// https://www.dcard.tw/_api/posts/225704108/comments?popular=true
Vue.prototype.$http = axios
axios.defaults.headers.common['access-control-allow-origin'] = '*'
new Vue({
    el: '#app',
    data: {
        fullContent: [],
        loading: false,
        before: '', // LAST ITEM
        popular: localStorage.getItem('popular') != null ? JSON.parse(localStorage.getItem('popular')) : true,
        EOF: false,
    },
    mounted: function() {  
        window.addEventListener('scroll', this.handleScroll)
        this.init()
    },
    computed: {
        thePopular () {
            if (this.popular) {
                return 'Hot';
            } else {
                return 'New';
            }
        },
        inversePopular () {
            if (this.popular) {
                return 'New';
            } else {
                return 'Hot';
            }
        }
    },
    methods: {
        init () {
            this.fullContent = []
            this.before = ''
            this.dcard()
            this.EOF = false
        },
        switchPopular () {
            if (this.popular) {
                this.popular = false
                localStorage.setItem('popular', false)
                this.init()
            } else {
                this.popular = true
                localStorage.setItem('popular', true)
                this.init()
            }
        },
        handleScroll () {
            // $(window).scrollTop(), $(window).height(), $(document).height()
            let window_scrollTop = document.body.scrollTop || window.pageYOffset;
            const window_height = window.innerHeight || document.documentElement.clientHeight;
            let body_height = document.body.scrollHeight || document.documentElement.scrollHeight;
            if(!this.loading && !this.EOF && window_scrollTop + window_height >= body_height - 100 ) {
                this.dcard()
            }
        },
        dcard () {
            this.loading = true
            let url = 'https://www.dcard.tw/_api/forums/sex/posts?popular=' + this.popular
            if (this.before) {
                let before = this.before
                url += '&before=' + before
            }
            this.$http.get(url)
                .then(response => {
                    let res = response.data
                    if (res.length < 1) {
                        this.EOF = true
                    }
                    for (var i = 0, len = res.length; i < len; i++) {
                        // res[i].content = this.getDetail(res[i])
                        res[i].popular = this.getPopularContent(res[i])
                        this.fullContent.push(res[i])
                        if (i == len - 1) {
                            this.before = res[i].id
                        }
                    }
                    this.loading = false
                }, (response) => {
                    var r = confirm("好像有什麼地方出錯了，請重新整理。");
                    if (r == true) {
                        location.reload();
                    } else {
                        // window.location.href = 'index.html';
                    }
                })
        },
        getDetail(res) {
            let url = 'https://www.dcard.tw/_api/posts/' + res.id
            this.$http.get(url)
                .then(response => {
                    res.content = response.data.content
                })
        },
        getPopularContent(res) {
            let url = 'https://www.dcard.tw/_api/posts/' + res.id + '/comments?popular=true'
            this.$http.get(url)
                .then(response => {
                    res.popular = response.data
                })
        },
        getPopularImage(str) {
            // http://stackoverflow.com/questions/34471610/regex-replace-url-with-image-tag
            return str.match(/(https?:\/\/\S+(\.png|\.jpg|\.gif))/g)
        },
        getTimeAndSchool (item) {
            let date = new Date(item.createdAt)
            let newtime = ` ${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            if (item.school) {
                newtime += ( ' ' + item.school )
            }
            return newtime
        }
    }
})