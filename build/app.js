import { elemById, element, localStorageRead, localStorageWrite, send } from './util';
export const VERSION = '2.24.3';
const VERSION_URL = 'https://raw.githubusercontent.com/19RyanA/CheckPCR/master/version.txt';
const COMMIT_URL = (location.protocol === 'chrome-extension:' ?
    'https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master' : '/api/commit');
const NEWS_URL = 'https://api.github.com/gists/21bf11a429da257539a68520f513a38b';
function formatCommitMessage(message) {
    return message.substr(message.indexOf('\n\n') + 2)
        .replace(/\* (.*?)(?=$|\n)/g, (a, b) => `<li>${b}</li>`)
        .replace(/>\n</g, '><')
        .replace(/\n/g, '<br>');
}
// For updating, a request will be send to Github to get the current commit id and check that against what's stored
export async function checkCommit() {
    try {
        const resp = await send(VERSION_URL, 'text');
        const c = resp.responseText.trim();
        console.log(`Current version: ${c} ${VERSION === c ? '(no update available)' : '(update available)'}`);
        elemById('newversion').innerHTML = c;
        if (VERSION !== c) {
            elemById('updateIgnore').addEventListener('click', () => {
                if (location.protocol === 'chrome-extension:') {
                    elemById('update').classList.remove('active');
                    setTimeout(() => {
                        elemById('updateBackground').style.display = 'none';
                    }, 350);
                }
                else {
                    window.location.reload();
                }
            });
            const resp2 = await send(COMMIT_URL, 'json');
            const { sha, url } = resp2.response.object;
            const resp3 = await send((location.protocol === 'chrome-extension:' ? url : `/api/commit/${sha}`), 'json');
            elemById('pastUpdateVersion').innerHTML = VERSION;
            elemById('newUpdateVersion').innerHTML = c;
            elemById('updateFeatures').innerHTML = formatCommitMessage(resp3.response.message);
            elemById('updateBackground').style.display = 'block';
            elemById('update').classList.add('active');
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
let newsUrl = null;
let newsCommit = null;
export async function fetchNews() {
    try {
        const resp = await send(NEWS_URL, 'json');
        let last = localStorageRead('newsCommit');
        newsCommit = resp.response.history[0].version;
        if (last == null) {
            last = newsCommit;
            localStorageWrite('newsCommit', newsCommit);
        }
        newsUrl = resp.response.files['updates.htm'].raw_url;
        if (last !== newsCommit) {
            getNews();
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
export async function getNews(onfail) {
    if (!newsUrl) {
        if (onfail)
            onfail();
        return;
    }
    try {
        const resp = await send(newsUrl);
        localStorage.newsCommit = newsCommit;
        resp.responseText.split('<hr>').forEach((news) => {
            elemById('newsContent').appendChild(element('div', 'newsItem', news));
        });
        elemById('newsBackground').style.display = 'block';
        elemById('news').classList.add('active');
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
        if (onfail)
            onfail();
    }
}
