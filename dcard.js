// https://www.dcard.tw/_api/forums/sex/posts?popular=true&before=225694690
// https://www.dcard.tw/_api/posts/225699806
// https://www.dcard.tw/_api/posts/225699806/comments
new Vue({
    el: '#app',
    data: {
        fullContent: [],
        loading: false,
        before: '', // LAST ITEM
        popular: true
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
                    let res = response.body
                    for (var i = 0, len = res.length; i < len; i++) {
                        // Vue.set(res[i], 'content', this.getDetail(res[i]) ) // fail QQ
                        this.fullContent.push(res[i])
                        if (i == len - 1) {
                            this.before = res[i].id
                        }
                    }
                    this.loading = false
                }, (response) => {
                    alert("似乎有錯誤QQ, https://dcard.tw失連.")
                    location.reload()
                })
        },
        getDetail(res) {
            let url = 'https://www.dcard.tw/_api/posts/' + res.id
            this.$http.get(url)
                .then(response => {
                    res.content = response.body.content
                })
        }
    }
})