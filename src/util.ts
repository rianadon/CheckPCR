import { fromDateNum, toDateNum } from './dates'

/**
 * Forces a layout on an element
 */
export function forceLayout(el: HTMLElement): void {
    // This involves a little trickery in that by requesting the computed height of the element the
    // browser is forced to do a full layout

    // tslint:disable-next-line no-unused-expression
    el.offsetHeight
}

/**
 * Return a string with the first letter capitalized
 */
export function capitalizeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.substr(1)
}

/**
 * Returns an XMLHttpRequest with the specified url, response type, headers, and data
 */
function constructXMLHttpRequest(url: string, respType?: XMLHttpRequestResponseType|null,
                                 headers?: {[name: string]: string}|null, data?: string|null): XMLHttpRequest {
    const req = new XMLHttpRequest()

    // If POST data is provided send a POST request, otherwise send a GET request
    req.open((data ? 'POST' : 'GET'), url, true)

    if (respType) req.responseType = respType

    if (headers) {
        Object.keys(headers).forEach((header) => {
            req.setRequestHeader(header, headers[header])
        })
    }

    // If data is undefined default to the normal req.send(), otherwise pass the data in
    req.send(data)
    return req
}

/** Sends a request to a server and returns a Promise.
 * @param url the url to retrieve
 * @param respType the type of response that should be received
 * @param headers the headers that will be sent to the server
 * @param data the data that will be sent to the server (only for POST requests)
 * @param progressElement an optional element for the progress bar used to display the status of the request
 */
export function send(url: string, respType?: XMLHttpRequestResponseType|null, headers?: {[name: string]: string}|null,
                     data?: string|null, progress?: HTMLElement|null): Promise<XMLHttpRequest> {

    const req = constructXMLHttpRequest(url, respType, headers, data)

    return new Promise((resolve, reject) => {

        const progressInner = progress ? progress.querySelector('div') : null
        if (progress && progressInner) {
            forceLayout(progressInner) // Wait for it to render
            progress.classList.add('active') // Display the progress bar
            if (progressInner.classList.contains('determinate')) {
                progressInner.classList.remove('determinate')
                progressInner.classList.add('indeterminate')
            }
        }

        // Sometimes the browser won't give the total bytes in the response, so use past results or
        // a default of 170,000 bytes if the browser doesn't provide the number
        const load = Number(localStorage.getItem('load')) || 170000
        let computedLoad = 0

        req.addEventListener('load', (evt) => {
            // Cache the number of bytes loaded so it can be used for better estimates later on
            localStorage.setItem('load', String(computedLoad))
            if (progress) progress.classList.remove('active')
            // Resolve with the request
            if (req.status === 200) {
                resolve(req)
            } else {
                reject(Error(req.statusText))
            }
        })

        req.addEventListener('error', () => {
            if (progress) progress.classList.remove('active')
            reject(Error('Network Error'))
        })

        if (progress && progressInner) {
            req.addEventListener('progress', (evt) => {
                // Update the progress bar
                if (progressInner.classList.contains('indeterminate')) {
                    progressInner.classList.remove('indeterminate')
                    progressInner.classList.add('determinate')
                }
                computedLoad = evt.loaded
                progressInner.style.width = ((100 * evt.loaded) / (evt.lengthComputable ? evt.total : load)) + '%'
            })
        }
    })
}

/**
 * The equivalent of document.getElementById but throws an error if the element is not defined
 */
export function elemById(id: string): HTMLElement {
    const el = document.getElementById(id)
    if (el == null) throw new Error(`Could not find element with id ${id}`)
    return el
}

/**
 * A little helper function to simplify the creation of HTML elements
 */
export function element(tag: string, cls: string|string[], html?: string|null, id?: string|null): HTMLElement {
    const e = document.createElement(tag)

    if (typeof cls === 'string') {
        e.classList.add(cls)
    } else {
        cls.forEach((c) => e.classList.add(c))
    }

    if (html) e.innerHTML = html
    if (id) e.setAttribute('id', id)

    return e
}

/**
 * Throws an error if the supplied argument is null, otherwise returns the argument
 */
export function _$<T>(arg: T|null): T {
    if (arg == null) throw new Error('Expected argument to be non-null')
    return arg
}

export function _$h(arg: Node|EventTarget|null): HTMLElement {
    if (arg == null) throw new Error('Expected node to be non-null')
    return arg as HTMLElement
}

// Because some localStorage entries can become corrupted due to error side effects, the below
// method tries to read a value from localStorage and handles errors.
export function localStorageRead(name: string): any
export function localStorageRead<R>(name: string, defaultVal: () => R): R
export function localStorageRead<T>(name: string, defaultVal: T): T
export function localStorageRead(name: string, defaultVal?: any): any {
    try {
        return JSON.parse(localStorage[name])
    } catch (e) {
        return typeof defaultVal === 'function' ? defaultVal() : defaultVal
    }
}

export function localStorageWrite(name: string, item: any): void {
    localStorage[name] = JSON.stringify(item)
}

interface IdleDeadline {
    didTimeout: boolean
    timeRemaining: () => number
}

// Because the requestIdleCallback function is very new (as of writing only works with Chrome
// version 47), the below function polyfills that method.
export function requestIdleCallback(cb: (deadline: IdleDeadline) => void, opts: { timeout: number}): number {
    if ('requestIdleCallback' in window) {
        return (window as any).requestIdleCallback(cb, opts)
    }
    const start = Date.now()

    return setTimeout(() => cb({
        didTimeout: false,
        timeRemaining(): number {
            return Math.max(0, 50 - (Date.now() - start))
        }
    }), 1)
}

/**
 * Determine if the two dates have the same year, month, and day
 */
function datesEqual(a: Date, b: Date): boolean {
    return toDateNum(a) === toDateNum(b)
}

const DATE_RELATIVENAMES: {[name: string]: number} = {
    'Tomorrow': 1,
    'Today': 0,
    'Yesterday': -1,
    '2 days ago': -2
}
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const FULLMONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                    'November', 'December']

export function dateString(date: Date|number|'Forever', addThis: boolean = false): string {
    if (date === 'Forever') return date
    if (typeof date === 'number') return dateString(fromDateNum(date), addThis)

    const relativeMatch = Object.keys(DATE_RELATIVENAMES).find((name) => {
        const dayAt = new Date()
        dayAt.setDate(dayAt.getDate() + DATE_RELATIVENAMES[name])
        return datesEqual(dayAt, date)
    })
    if (relativeMatch) return relativeMatch

    const daysAhead = (date.getTime() - Date.now()) / 1000 / 3600 / 24

    // If the date is within 6 days of today, only display the day of the week
    if (0 < daysAhead && daysAhead <= 6) {
        return (addThis ? 'This ' : '') + WEEKDAYS[date.getDay()]
    }
    return `${WEEKDAYS[date.getDay()]}, ${FULLMONTHS[date.getMonth()]} ${date.getDate()}`
}

// The one below scrolls smoothly to a y position.
export function smoothScroll(to: number): Promise<void> {
    return new Promise((resolve, reject) => {
        let start: number|null = null
        const from = document.body.scrollTop
        const amount = to - from
        const step = (timestamp: number) => {
            if (start == null) { start = timestamp }
            const progress = timestamp - start
            window.scrollTo(0, from + (amount * (progress / 350)))
            if (progress < 350) {
                return requestAnimationFrame(step)
            } else {
                _$(document.querySelector('nav')).classList.remove('headroom--unpinned')
                resolve()
            }
        }
        requestAnimationFrame(step)
    })
}

// And a function to apply an ink effect
export function ripple(el: HTMLElement): void {
    el.addEventListener('mousedown', (evt) => {
        if (evt.which !== 1) return // Not left button
        const wave = element('span', 'wave')
        const size = Math.max(Number(el.offsetWidth), Number(el.offsetHeight))
        wave.style.width = (wave.style.height = size + 'px')

        let x = evt.clientX
        let y = evt.clientY
        const rect = el.getBoundingClientRect()
        x -= rect.left
        y -= rect.top

        wave.style.top = (y - (size / 2)) + 'px'
        wave.style.left = (x - (size / 2)) + 'px'
        el.appendChild(wave)
        wave.setAttribute('data-hold', String(Date.now()))
        forceLayout(wave)
        wave.style.transform = 'scale(2.5)'
    })
    el.addEventListener('mouseup', (evt) => {
        if (evt.which !== 1) return // Only for left button
        const waves = el.getElementsByClassName('wave')
        waves.forEach((wave) => {
            const diff = Date.now() - Number(wave.getAttribute('data-hold'))
            const delay = Math.max(350 - diff, 0)
            setTimeout(() => {
                (wave as HTMLElement).style.opacity = '0'
                setTimeout(() => {
                    wave.remove()
                }, 550)
            }, delay)
        })
    })
}

export function cssNumber(css: string|null): number {
    if (!css) return 0
    return parseInt(css, 10)
}
