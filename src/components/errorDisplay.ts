import { VERSION } from '../app'
import { elemById } from '../util'

const ERROR_FORM_URL = 'https://docs.google.com/a/students.harker.org/forms/d/'
                     + '1sa2gUtYFPdKT5YENXIEYauyRPucqsQCVaQAPeF3bZ4Q/viewform'
const ERROR_FORM_ENTRY = '?entry.120036223='
const ERROR_GITHUB_URL = 'https://github.com/19RyanA/CheckPCR/issues/new'

const linkById = (id: string) => elemById(id) as HTMLLinkElement

// *displayError* displays a dialog containing information about an error.
export function displayError(e: Error): void {
    console.log('Displaying error', e)
    const errorHTML = `Message: ${e.message}\nStack: ${e.stack || (e as any).lineNumber}\n`
                    + `Browser: ${navigator.userAgent}\nVersion: ${VERSION}`
    elemById('errorContent').innerHTML = errorHTML.replace('\n', '<br>')
    linkById('errorGoogle').href = ERROR_FORM_URL + ERROR_FORM_ENTRY + encodeURIComponent(errorHTML)
    linkById('errorGitHub').href =
        ERROR_GITHUB_URL + '?body=' + encodeURIComponent(`I've encountered an bug.\n\n\`\`\`\n${errorHTML}\n\`\`\``)
    elemById('errorBackground').style.display = 'block'
    return elemById('error').classList.add('active')
}

window.addEventListener('error', (evt) => {
    evt.preventDefault()
    displayError(evt.error)
})
