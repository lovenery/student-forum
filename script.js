new Vue({
    el: '#app',
    data: {
        fullContent: [],
        imageOnly: [],
        imageOnlyFlag: false,
        page: 1,
        loading: false,
        mode: localStorage.getItem('mode') != null ? localStorage.getItem('mode') : 'hot',
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
            this.page = 1
            this.meteor()
            this.imageOnly = this.fullContent
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
            if( $(window).scrollTop() + $(window).height() >= $(document).height() - 100 ) {
                this.page++
                this.meteor(this.page)
            }
        },
        encodeToImg (content) {
            if (this.imageOnlyFlag && !content.includes('.jpg') && !content.includes('.png') ) {
                return '可能撤照了QQ'
            }
            let only = ''
            for (let img_i = 1; img_i < content.split('http://i.imgur.com/').length; img_i++) {
                let newHash = content.split('http://i.imgur.com/')[img_i].split('.jpg')[0]
                let ext = '.jpg'
                if (newHash.length > 9) {
                    newHash = content.split('http://i.imgur.com/')[img_i].split('.png')[0]
                    ext = '.png'
                }
                let url = 'https://i.imgur.com/' + newHash + ext
                content = content.split(url)[0] + "<img class='contentImg' src='" + url + "'/>" + content.split(url)[1]
                only += "<img class='contentImg' src='" + url + "'/>"
            }
            return !this.imageOnlyFlag ? content : only
        },
        meteor (page) {
            this.loading = true
            let data = {
                boardId: '57e0afce41e832d5e53e5f97',
                version: 2,
                page: page
            }
            // https://meteor.today/boardlist/57e0afce41e832d5e53e5f97
            let url = 'https://meteor.today/article/get_' + this.mode + '_articles'
            this.$http.post(url, data)
                .then(response => {
                    let res = JSON.parse(decodeURI(response.body.result))
                    for (var i = 0, len = res.length; i < len; i++) {
                        this.fullContent.push(res[i])
                    }
                    this.loading = false
                }, (response) => {
                    alert("似乎有錯誤QQ, https://meteor.today失連, 也可能是不給爬資料了.")
                    location.reload()
                })
        },
        createTime (time) {
            let date = new Date(time)
            let newtime = ` ${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            return newtime
        }
    }
})