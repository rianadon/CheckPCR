import { dologin, fetch } from './pcr'
import { updateAthenaData } from './plugins/athena'
import { _$h, elemById } from './util'

// Welcome to the welcome file.
//
// This script runs on the welcome page, which welcomes new users, to make it more welcoming. If you
// haven't already, I welcome you to view the more important [main script](client.litcoffee).
//
// Also, if you haven't noticed yet, I'm trying my best to use the word welcome as many times as I
// can just to welcome you.
//
// First off, the buttons big, green, welcoming buttons on the bottom of the welcome page are
// assigned event listeners so that they can make the page show more welcoming information.
function advance(): void {
    // The box holding the individual pages that ge scrolled
    // when pressing the 'next' button is assigned to a varialbe.
    const container = document.body
    // show the next page
    const view = Number(container.getAttribute('data-view'))
    window.scrollTo(0, 0) // Scoll to top of the page
    history.pushState({page: view + 1}, '', `?page=${view}`) // Make the broswer register a page shift

    const npage = _$h(document.querySelector(`section:nth-child(${view + 2})`))
    npage.style.display = 'inline-block'
    npage.style.transform = npage.style.webkitTransform = `translateX(${view * 100}%)`
    // increase the data-view attribute by 1. The rest is handled by the css.
    container.setAttribute('data-view', String(view + 1))
    setTimeout(() => {
        // After animating is done, don't display the first page
        npage.style.transform = npage.style.webkitTransform = `translateX(${view + 1}00%)`
        _$h(document.querySelector(`section:nth-child(${view + 1})`)).style.display = 'none'
    }, 50)
}

document.querySelectorAll('.next').forEach((nextButton) => {
    nextButton.addEventListener('click', advance)
})

// Additionally, the active class needs to be added when text fields are selected (for the login
// box) [copied from main script].
document.querySelectorAll('input[type=text], input[type=password], input[type=email], input[type=url], '
                        + 'input[type=tel], input[type=number], input[type=search]')
                        .forEach((input: HTMLInputElement) => {
    input.addEventListener('change', (evt) => _$h(_$h(input.parentNode).querySelector('label')).classList.add('active'))
    input.addEventListener('focus', (evt) => _$h(_$h(input.parentNode).querySelector('label')).classList.add('active'))
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            _$h(_$h(input.parentNode).querySelector('label')).classList.remove('active')
        }
    })
})

// An event listener is attached to the window so that when the back button is pressed, a more
// welcoming page is displayed. Most of the code is the same from next button event listener, except
// that the page is switched the previous one, not the next one.
window.onpopstate = (event) => {
    const container = document.body
    const view = (event.state != null) ? event.state.page : 0
    window.scrollTo(0, 0) // Scoll to top of the page

    const npage = _$h(document.querySelector(`section:nth-child(${view + 1})`))
    npage.style.display = 'inline-block'
    npage.style.transform = npage.style.webkitTransform = `translateX(${view * 100}%)`
    // increase the data-view attribute by 1. The rest is handled by the css.
    container.setAttribute('data-view', view)
    setTimeout(() => {
        // After animating is done, don't display the first page
        npage.style.transform = npage.style.webkitTransform = `translateX(${view}00%)`
        _$h(document.querySelector(`section:nth-child(${view + 2})`)).style.display = 'none'
    }, 50)
}

// The text box also needs to execute this function when anything is typed / pasted.
const athenaDataEl = elemById('athenaData') as HTMLInputElement
athenaDataEl.addEventListener('input', () => updateAthenaData(athenaDataEl.value))

fetch(true, undefined, () => {
    elemById('loginNext').style.display = ''
    elemById('login').classList.add('done')
}, () => {
    elemById('login').classList.add('ready')
    elemById('login').addEventListener('submit', (evt) => {
        evt.preventDefault()
        dologin(null, true, advance)
    })
})

function closeError(): void {
    elemById('error').classList.remove('active')
    setTimeout(() => {
        elemById('errorBackground').style.display = 'none'
    }, 350)
}

elemById('errorNo').addEventListener('click', closeError)
elemById('errorBackground').addEventListener('click', closeError)
