import { state } from './state'
import { elemById, element, send } from './util'

export const VERSION = '2.25.1'

const VERSION_URL = 'https://raw.githubusercontent.com/19RyanA/CheckPCR/master/version.txt'
const COMMIT_URL = (location.protocol === 'chrome-extension:' ?
    'https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master' : '/api/commit')
const NEWS_URL = 'https://api.github.com/gists/21bf11a429da257539a68520f513a38b'

function formatCommitMessage(message: string): string {
    return message.substr(message.indexOf('\n\n') + 2)
                  .replace(/\* (.*?)(?=$|\n)/g, (a, b) => `<li>${b}</li>`)
                  .replace(/>\n</g, '><')
                  .replace(/\n/g, '<br>')
}

// For updating, a request will be send to Github to get the current commit id and check that against what's stored
export async function checkCommit(): Promise<void> {
    try {
        const resp = await send(VERSION_URL, 'text')
        const c = resp.responseText.trim()
        console.log(`Latest version: ${c} ${VERSION === c ? '(no update available)' : '(update available)'}`)
        elemById('newversion').innerHTML = c
        if (VERSION !== c) {
            elemById('updateIgnore').addEventListener('click', () => {
                if (location.protocol === 'chrome-extension:') {
                    elemById('update').classList.remove('active')
                    setTimeout(() => {
                        elemById('updateBackground').style.display = 'none'
                    }, 350)
                } else {
                    window.location.reload()
                }
            })
            const resp2 = await send(COMMIT_URL, 'json')
            const { sha, url } = resp2.response.object
            const resp3 = await send((location.protocol === 'chrome-extension:' ? url : `/api/commit/${sha}`), 'json')
            elemById('pastUpdateVersion').innerHTML = VERSION
            elemById('newUpdateVersion').innerHTML = c
            elemById('updateFeatures').innerHTML = formatCommitMessage(resp3.response.message)
            elemById('updateBackground').style.display = 'block'
            elemById('update').classList.add('active')
        }
    } catch (err) {
        console.log('Could not access Github. Here\'s the error:', err)
    }
}

export async function fetchNews(): Promise<void> {
    try {
        const resp = await send(NEWS_URL, 'json')
        const newsCommit = resp.response.history[0].version

        if (state.lastNewsCommit.get() == null) {
            state.lastNewsCommit.set(newsCommit)
        }

        state.newsUrl.set(resp.response.files['updates.htm'].raw_url)

        if (state.lastNewsCommit.get() !== newsCommit) {
            getNews().then(() => state.lastNewsCommit.set(newsCommit))
        }
    } catch (err) {
        console.log('Could not access Github. Here\'s the error:', err)
    }
}

export async function getNews(): Promise<void> {
    const url = state.newsUrl.get()
    if (!url) {
        throw new Error('News url not yet found')
    }
    try {
        const resp = await send(url)
        resp.responseText.split('<hr>').forEach((news) => {
            elemById('newsContent').appendChild(element('div', 'newsItem', news))
        })
        elemById('newsBackground').style.display = 'block'
        elemById('news').classList.add('active')
    } catch (err) {
        console.log('Could not access Github. Here\'s the error:', err)
        throw err
    }
}
