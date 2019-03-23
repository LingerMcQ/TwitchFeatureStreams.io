document.addEventListener('DOMContentLoaded', () => {

    let nowIndex = 0;
    let isLoading = false;
    let LANG = 'zh-tw'
    // ISO 639-1
    // ja = japanese, zh-tw = madarine-taiwan, en = english,


    function changeLang(lang) {
        $('.menu h3').text(window.I18N[lang].TITLE);
        LANG = lang;
        $('.row').empty();
        appendData(LANG);
    }


    document.querySelector('.i18n__zh-tw').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(changeLang('zh-tw'),1000);
        nowIndex = 0;
    });

    document.querySelector('.i18n__ja').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(changeLang('ja'),1000);
        nowIndex = 0;
    });
    document.querySelector('.i18n__en').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(changeLang('en'),1000);
        nowIndex = 0;
    });



    function getData (lang, cb) {
        const clientId = 'kio3amiur4ltyb9mu8e9cic0ohkh8z';
        const limit = 12;
        isLoading = true;

        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.twitch.tv/kraken/streams/?client_id=' + clientId + '&game=League%20of%20Legends&limit=' + limit + '&offset=' + nowIndex + '&language=' + lang, true);
        
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                cb(null, JSON.parse(resp))
            };
        }
        request.send();
    }

    // 流程：呼叫 getData function，傳入一個 cb function，跑 getData 抓資料，再把資料回傳至 cb 的兩個參數，繼續跑 cb (注意 cb 在下面是匿名函式的寫法)
    function appendData(lang){
        getData(lang, (err, data) => {
            const {streams} = data;
            const $row = document.querySelector('.row');
            for(let stream of streams) {
                const div = document.createElement('div');
                $row.appendChild(div);
                div.outerHTML = getColumn(stream);
            }
            nowIndex += 12;
            isLoading = false;
        });
    }

    appendData(LANG);
    document.addEventListener('scroll', function() {
        if(window.scrollY + window.innerHeight > document.body.offsetHeight - 200) {
            if(!isLoading) {
                appendData(LANG);

            }
        }
    })


    // return 每一個 column 的 html
    function getColumn(data) {
        return  `
            <div class="col">
                <a href='${data.channel.url}'>
                    <div class="preview">
                        
                        <img src="${data.preview.medium}" onload="this.style.opacity = 1"/>>
                    </div>
                    <div class="bottom">
                        <div class="intro">
                            <div class="logo">
                                <img class="logo__img" src="${data.channel.logo}" onload="this.style.opacity = 1"/>
                            </div>
                            <div class="desc">
                                <div class="title">
                                    ${data.channel.status}
                                </div>
                                <div class="name">
                                    ${data.channel.display_name}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;


    }


})


