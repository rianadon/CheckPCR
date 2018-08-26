/**
 * This module contains code to both fetch and parse assignments from PCR.
 */
import { updateAvatar } from './components/avatar'
import { displayError } from './components/errorDisplay'
import { snackbar } from './components/snackbar'
import { deleteCookie, getCookie, setCookie } from './cookies'
import { toDateNum } from './dates'
import { display, formatUpdate } from './display'
import { zeroDateOffsets, getCalDateOffset, getListDateOffset } from './navigation'
import { _$, elemById, localStorageWrite, send } from './util'

const PCR_URL = 'https://webappsca.pcrsoft.com'
const ASSIGNMENTS_URL = `${PCR_URL}/Clue/SC-Assignments-Start-and-End-Date-(No-Range)/18594`
const LOGIN_URL = `${PCR_URL}/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=${encodeURIComponent(ASSIGNMENTS_URL)}`
const ATTACHMENTS_URL = `${PCR_URL}/Clue/Common/AttachmentRender.aspx`
const FORM_HEADER_ONLY = { 'Content-type': 'application/x-www-form-urlencoded' }
const ONE_MINUTE_MS = 60000

const progressElement = elemById('progress')
const loginDialog = elemById('login')
const loginBackground = document.getElementById('loginBackground')
const lastUpdateEl = document.getElementById('lastUpdate')
const usernameEl = elemById('username') as HTMLInputElement
const passwordEl = elemById('password') as HTMLInputElement
const rememberCheck = elemById('remember') as HTMLInputElement
const incorrectLoginEl = elemById('loginIncorrect')

// TODO keeping these as a global vars is bad
const loginHeaders: {[header: string]: string} = {}
const viewData: {[hader: string]: string} = {}
let lastUpdate = 0 // The last time everything was updated

export interface IApplicationData {
    classes: string[]
    assignments: IAssignment[]
    monthView: boolean
}

export interface IAssignment {
    start: number
    end: number|'Forever'
    attachments: AttachmentArray[]
    body: string
    type: string
    baseType: string
    class: number|null,
    title: string
    id: string
}

export type AttachmentArray = [string, string]

// This is the function that retrieves your assignments from PCR.
//
// First, a request is sent to PCR to load the page you would normally see when accessing PCR.
//
// Because this is run as a chrome extension, this page can be accessed. Otherwise, the browser
// would throw an error for security reasons (you don't want a random website being able to access
// confidential data from a website you have logged into).

/**
 * Fetches data from PCR and if the user is logged in parses and displays it
 * @param override Whether to force an update even there was one recently
 * @param data  Optional data to be posted to PCR
 */
export async function fetch(override: boolean = false, data?: string, onsuccess: () => void = display,
                            onlogin?: () => void): Promise<void> {
    if (!override && Date.now() - lastUpdate < ONE_MINUTE_MS) return
    lastUpdate = Date.now()

    // Request a new month if needed
    const monthOffset = getCalDateOffset()
    if (monthOffset !== 0) {
        const today = new Date()
        today.setMonth(today.getMonth() + getCalDateOffset())
        // Remember months are zero-indexed
        const dateArray = [today.getFullYear(), today.getMonth() + 1, 1]
        const newViewData = {
            ...viewData,
            __EVENTTARGET: 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1$SelectedDateCalendar',
            __EVENTARGUMENT: 'd',
            ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_SelectedDateCalendar_SD:
                JSON.stringify([dateArray]),
            ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_SelectedDateCalendar_AD:
                JSON.stringify([[1900, 1, 1], [2099, 12, 30], dateArray]),
            ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState:
                JSON.stringify({scrollTop: 0, scrollLeft: 0, isDirty: false}),
            ctl00_ctl00_RadScriptManager1_TSM: ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, ' +
                'PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2'
        }
        const postArray: string[] = [] // Array of data to post
        Object.entries(newViewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v))
        })
        data = (data ? data + '&' : '') + postArray.join('&')
    }

    const headers = data ? FORM_HEADER_ONLY : undefined
    console.time('Fetching assignments')
    try {
        const resp = await send(ASSIGNMENTS_URL, 'document', headers, data, progressElement)
        console.timeEnd('Fetching assignments')
        if (resp.responseURL.indexOf('Login') !== -1) {
            // We have to log in now
            (resp.response as HTMLDocument).getElementsByTagName('input').forEach((e) => {
                loginHeaders[e.name] = e.value || ''
            })
            console.log('Need to log in')
            const up = getCookie('userPass') // Attempts to get the cookie *userPass*, which is set if the
                                             // "Remember me" checkbox is checked when logging in through CheckPCR
            if (up === '') {
                if (loginBackground) loginBackground.style.display = 'block'
                loginDialog.classList.add('active')
                if (onlogin) onlogin()
            } else {
                // Because we were remembered, we can log in immediately without waiting for the
                // user to log in through the login form
                dologin(window.atob(up).split(':') as [string, string], false, onsuccess)
            }
        } else {
            // Logged in now
            console.log('Fetching assignments successful')
            const t = Date.now()
            localStorage.lastUpdate = t
            if (lastUpdateEl) lastUpdateEl.innerHTML = formatUpdate(t)
            try {
                parse(resp.response)
                onsuccess()
                if (monthOffset === 0) {
                    localStorageWrite('data', getData()) // Store for offline use
                }
            } catch (error) {
                console.log(error)
                displayError(error)
            }
        }
    } catch (error) {
        console.log('Could not fetch assignments; You are probably offline. Here\'s the error:', error)
        snackbar('Could not fetch your assignments', 'Retry', () => fetch(true))
    }
}

/**
 * Logs the user into PCR
 * @param val   An optional length-2 array of the form [username, password] to use the user in with.
 *              If this array is not given the login dialog inputs will be used.
 * @param submitEvt Whether to override the username and password suppleid in val with the values of the input elements
 */
export async function dologin(val?: [string, string]|null, submitEvt: boolean = false,
                              onsuccess: () => void = display): Promise<void> {
    loginDialog.classList.remove('active')
    setTimeout(() => {
        if (loginBackground) loginBackground.style.display = 'none'
    }, 350)

    const postArray: string[] = [] // Array of data to post
    localStorageWrite('username', val && !submitEvt ? val[0] : usernameEl.value)
    updateAvatar()
    Object.keys(loginHeaders).forEach((h) =>  {
        // Loop through the input elements contained in the login page. As mentioned before, they
        // will be sent to PCR to log in.
        if (h.toLowerCase().indexOf('user') !== -1) {
            loginHeaders[h] = val && !submitEvt ? val[0] : usernameEl.value
        }
        if (h.toLowerCase().indexOf('pass') !== -1) {
            loginHeaders[h] = val && !submitEvt ? val[1] : passwordEl.value
        }
        postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(loginHeaders[h]))
    })

    // Now send the login request to PCR
    console.time('Logging in')
    try {
        const resp = await send(LOGIN_URL, 'document', FORM_HEADER_ONLY, postArray.join('&'), progressElement)
        console.timeEnd('Logging in')
        if (resp.responseURL.indexOf('Login') !== -1) {
        // If PCR still wants us to log in, then the username or password entered were incorrect.
            incorrectLoginEl.style.display = 'block'
            passwordEl.value = ''

            loginDialog.classList.add('active')
            if (loginBackground) loginBackground.style.display = 'block'
        } else {
            // Otherwise, we are logged in
            if (rememberCheck.checked) { // Is the "remember me" checkbox checked?
                // Set a cookie with the username and password so we can log in automatically in the
                // future without having to prompt for a username and password again
                setCookie('userPass', window.btoa(usernameEl.value + ':' + passwordEl.value), 14)
            }
            // loadingBar.style.display = "none"
            const t = Date.now()
            localStorage.lastUpdate = t
            if (lastUpdateEl) lastUpdateEl.innerHTML = formatUpdate(t)
            try {
                parse(resp.response) // Parse the data PCR has replied with
                onsuccess()
                localStorageWrite('data', getData()) // Store for offline use
            } catch (e) {
                console.log(e)
                displayError(e)
            }
        }
    } catch (error) {
         console.log('Could not log in to PCR. Either your network connection was lost during your visit ' +
                     'or PCR is just not working. Here\'s the error:', error)
    }
}

export function getData(): IApplicationData|undefined {
    return (window as any).data
}

export function getClasses(): string[] {
    const data = getData()
    if (!data) return []
    return data.classes
}

export function setData(data: IApplicationData): void {
    (window as any).data = data
}

// In PCR's interface, you can click a date in month or week view to see it in day view.
// Therefore, the HTML element that shows the date that you can click on has a hyperlink that looks like `#2015-04-26`.
// The function below will parse that String and return a Date timestamp
function parseDateHash(element: HTMLAnchorElement): number {
    const [year, month, day] = element.hash.substring(1).split('-').map(Number)
    return (new Date(year, month - 1, day)).getTime()
}

// The *attachmentify* function parses the body of an assignment (*text*) and returns the assignment's attachments.
// Side effect: these attachments are removed
function attachmentify(element: HTMLElement): AttachmentArray[] {
    const attachments: AttachmentArray[] = []

    // Get all links
    const as = Array.from(element.getElementsByTagName('a'))
    as.forEach((a) => {
        if (a.id.includes('Attachment')) {
            attachments.push([
                a.innerHTML,
                a.search + a.hash
            ])
            a.remove()
        }
    })
    return attachments
}

const URL_REGEX = new RegExp(`(\
https?:\\/\\/\
[-A-Z0-9+&@#\\/%?=~_|!:,.;]*\
[-A-Z0-9+&@#\\/%=~_|]+\
)`, 'ig'
)

// This function replaces text that represents a hyperlink with a functional hyperlink by using
// javascript's replace function with a regular expression if the text already isn't part of a
// hyperlink.
function urlify(text: string): string {
    return text.replace(URL_REGEX, (str, str2, offset) => { // Function to replace matches
        if (/href\s*=\s*./.test(text.substring(offset - 10, offset)) ||
            /originalpath\s*=\s*./.test(text.substring(offset - 20, offset))
        ) {
            return str
        } else {
            return `<a href="${str}">${str}</a>`
        }
    })
}

// Also, PCR"s interface uses a system of IDs to identify different elements. For example, the ID of
// one of the boxes showing the name of an assignment could be
// `ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_95_0`. The function below will
// return the first HTML element whose ID contains a specified String (*id*) and containing a
// specified tag (*tag*).
function findId(element: HTMLElement|HTMLDocument, tag: string, id: string): HTMLElement {
    const el = [...element.getElementsByTagName(tag)].find((e) => e.id.includes(id))
    if (!el) throw new Error(`Could not find element with tag ${tag} and id ${id} in ${element}`)
    return el as HTMLElement
}

function parseAssignmentType(type: string): string {
    return type.toLowerCase().replace('& quizzes', '').replace('tests', 'test')
}

function parseAssignmentBaseType(type: string): string {
    return type.toLowerCase().replace('& quizzes', '').replace(/\s/g, '').replace('quizzes', 'test')
}

function parseAssignment(ca: HTMLElement): IAssignment {
    const data = getData()
    if (!data) throw new Error('Data dictionary not set up')

    // The starting date and ending date of the assignment are parsed first
    const range = findId(ca, 'span', 'StartingOn').innerHTML.split(' - ')
    const assignmentStart = toDateNum(Date.parse(range[0]))
    const assignmentEnd = (range[1] != null) ? toDateNum(Date.parse(range[1])) : assignmentStart

    // Then, the name of the assignment is parsed
    const t = findId(ca, 'span', 'lblTitle')
    let title = t.innerHTML

    // The actual body of the assignment and its attachments are parsed next
    const b = _$(_$(t.parentNode).parentNode) as HTMLElement
    [...b.getElementsByTagName('div')].slice(0, 2).forEach((div) => div.remove())

    const ap = attachmentify(b) // Separates attachments from the body

    // The last Replace removes leading and trailing newlines
    const assignmentBody = urlify(b.innerHTML)
                               .replace(/^(?:\s*<br\s*\/?>)*/, '')
                               .replace(/(?:\s*<br\s*\/?>)*\s*$/, '').trim()

    // Finally, we separate the class name and type (homework, classwork, or projects) from the title of the assignment
    const matchedTitle = title.match(/\(([^)]*\)*)\)$/)
    if ((matchedTitle == null)) {
        throw new Error(`Could not parse assignment title \"${title}\"`)
    }
    const assignmentType = matchedTitle[1]
    const assignmentBaseType = parseAssignmentBaseType(ca.title.substring(0, ca.title.indexOf('\n')))
    let assignmentClassIndex = null
    data.classes.some((c, pos) => {
        if (title.indexOf(c) !== -1) {
            assignmentClassIndex = pos
            title = title.replace(c, '')
            return true
        }
        return false
    })

    if (assignmentClassIndex === null || assignmentClassIndex === -1) {
        throw new Error(`Could not find class in title ${title} (classes are ${data.classes}`)
    }

    const assignmentTitle = title.substring(title.indexOf(': ') + 2).replace(/\([^\(\)]*\)$/, '').trim()

    // To make sure there are no repeats, the title of the assignment (only letters) and its start &
    // end date are combined to give it a unique identifier.
    const assignmentId = assignmentTitle.replace(/[^\w]*/g, '') + (assignmentStart + assignmentEnd)

    return {
        start: assignmentStart,
        end: assignmentEnd,
        attachments: ap,
        body: assignmentBody,
        type: assignmentType,
        baseType: assignmentBaseType,
        class: assignmentClassIndex,
        title: assignmentTitle,
        id: assignmentId
    }
}

// The function below will parse the data given by PCR and convert it into an object. If you open up
// the developer console on CheckPCR and type in `data`, you can see the array containing all of
// your assignments.
function parse(doc: HTMLDocument): void {
    console.time('Handling data') // To time how long it takes to parse the assignments
    const handledDataShort: string[] = [] // Array used to make sure we don"t parse the same assignment twice.
    const data: IApplicationData = {
        classes: [],
        assignments: [],
        monthView: (_$(doc.querySelector('.rsHeaderMonth')).parentNode as HTMLElement).classList.contains('rsSelected')
    } // Reset the array in which all of your assignments are stored in.
    setData(data)

    doc.querySelectorAll('input:not([type="submit"])').forEach((e) => {
        viewData[(e as HTMLInputElement).name] = (e as HTMLInputElement).value || ''
    })

    // Now, the classes you take are parsed (these are the checkboxes you see up top when looking at PCR).
    const classes = findId(doc, 'table', 'cbClasses').getElementsByTagName('label')
    classes.forEach((c) => {
        data.classes.push(c.innerHTML)
    })

    const assignments = doc.getElementsByClassName('rsApt rsAptSimple')
    Array.prototype.forEach.call(assignments, (assignmentEl: HTMLElement) => {
        const assignment = parseAssignment(assignmentEl)
        if (handledDataShort.indexOf(assignment.id) === -1) { // Make sure we haven't already parsed the assignment
            handledDataShort.push(assignment.id)
            data.assignments.push(assignment)
        }
    })

    console.timeEnd('Handling data')

    // Now allow the view to be switched
    document.body.classList.add('loaded')
}

export function urlForAttachment(search: string): string {
    return ATTACHMENTS_URL + search
}

export function getAttachmentMimeType(search: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('HEAD', urlForAttachment(search))
        req.onload = () => {
            if (req.status === 200) {
                const type = req.getResponseHeader('Content-Type')
                if (type) {
                    resolve(type)
                } else {
                    reject(new Error('Content type is null'))
                }
            }
        }
        req.send()
    })
}

export function classById(id: number|null|undefined): string {
    return (id ? getClasses()[id] : null) || 'Unknown class'
}

export function switchViews(): void {
    if (Object.keys(viewData).length > 0) {
        elemById('sideBackground').click()
        const newViewData = {
            ...viewData,
            __EVENTTARGET: 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1',
            __EVENTARGUMENT: JSON.stringify({
                Command: `SwitchTo${document.body.getAttribute('data-pcrview') === 'month' ? 'Week' : 'Month'}View`
            }),
            ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState:
                JSON.stringify({scrollTop: 0, scrollLeft: 0, isDirty: false}),
            ctl00_ctl00_RadScriptManager1_TSM: ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, ' +
                'PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2'
        }
        const postArray: string[] = [] // Array of data to post
        Object.entries(newViewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v))
        })
        zeroDateOffsets()
        fetch(true, postArray.join('&'))
    }
}

export function logout(): void {
    if (Object.keys(viewData).length > 0) {
        deleteCookie('userPass')
        elemById('sideBackground').click()
        viewData.__EVENTTARGET = 'ctl00$ctl00$baseContent$LogoutControl1$LoginStatus1$ctl00'
        viewData.__EVENTARGUMENT = ''
        viewData.ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState =
            JSON.stringify({scrollTop: 0, scrollLeft: 0, isDirty: false})
        const postArray: string[] = [] // Array of data to post
        Object.entries(viewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v))
        })
        fetch(true, postArray.join('&'))
      }
}
