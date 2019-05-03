const main = document.querySelector('main');
const apiKey = "5a2f3801928a40c2b752b4a3006316ea";
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = "bbc-news";

window.addEventListener('load', async event => {
    updateNews();
    await updateSource();

    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', event => {
        updateNews(event.target.value);
    });
    
    if('serviceWorker' in navigator){
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (error) {
            console.log('SW reg failed');
        }
    }
});

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const json = await res.json();
     
    main.innerHTML = json.articles.map(createArticel).join('\n');
}

async function updateSource() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await res.json();

    sourceSelector.innerHTML = json.sources.map(src => 
        `<option value="${src.id}">${src.name}</option>`).join('\n');
}

function createArticel(article) {
    return `
        <article>
            <a class="link-news" href="${article.url}">
                <h2>${article.title}</h2>
            
                <p class="article-meta"><strong>Author:</strong> ${article.author}, <strong>Published:</strong> ${convertDate(article.publishedAt)}</p>

                <div class="image-wrapper">
                    <img src="${article.urlToImage}">
                    <span>Image source: ${article.source.name}</span>
                </div>

                <p><i>${article.description}</i></p>
                <p>${article.content}</p>
            </a>
        </article>
    `;
}

function convertDate(datetime) {
    let dateNow = new Date();
    let secondsNow = dateNow.getTime() / 1000;

    let date = new Date(datetime);
    let second = date.getTime() / 1000;
    
    let delta = secondsNow - second;

    if (delta < (1 * 60)) {
        return delta == 1 ? "1 second ago" : delta + " seconds ago";
    }
    if (delta < (2 * 60)) {
        return "1 minute ago";
    } if (delta < (45 * 60)) {
        return Math.floor(delta / 60) + " minutes ago";
    }
    if (delta < (90 * 60)) {
        return "1 hour ago";
    } if (delta < (24 * 60 * 60)) {
        return Math.floor(delta / (60 * 60)) + " hours ago";
    }
    if (delta < (48 * 60 * 60)) {
        return "yesterday";
    } if (delta < (30 * 24 * 60 * 60)) {
        return Math.floor(delta / (24 * 60 * 60)) + " days ago";
    }
    if (delta < (12 * 30 * 24 * 60 * 60)) {
        let months = Math.floor(delta / (24 * 60 * 60) / 30);
        return months <= 1 ? "1 month ago" : months + " months ago";
    } else {
        let years = Math.floor(delta / (24 * 60 * 60) / 365);
        return years <= 1 ? "1 year ago" : years + " years ago";
    }
}