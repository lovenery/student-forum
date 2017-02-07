// https://www.dcard.tw/_api/forums/sex/posts?popular=true&before=225694690
// https://www.dcard.tw/_api/posts/225699806
// https://www.dcard.tw/_api/posts/225699806/comments
// https://www.dcard.tw/_api/posts/225704108/comments?popular=true
Vue.prototype.$http = axios
new Vue({
    el: '#app',
    data: {
        fullContent: [],
        loading: false,
        before: '', // LAST ITEM
        popular: localStorage.getItem('popular') != null ? JSON.parse(localStorage.getItem('popular')) : true,
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
            if( $(window).scrollTop() + $(window).height() >= $(document).height() - 100 ) {
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
                    var r = confirm("https://dcard.tw失連。你可以上他們的網站確認是不是掛了。取消：到另外一頁。確定：重新整理。");
                    if (r == true) {
                        location.reload();
                    } else {
                        window.location.href = 'index.html';
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