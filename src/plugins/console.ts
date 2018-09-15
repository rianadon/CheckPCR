import { VERSION } from '../app'
import { closeError, displayError } from '../components/errorDisplay'
import { snackbar } from '../components/snackbar'
import { fetch } from '../pcr'
import { getStateItem, state } from '../state'

/**
 * Exports some variables to the window object so they can be interacted with
 * via the console.
 */

function logInfo(): void {
    console.log('%cCheck PCR', 'color: #004000; font-size: 3em')
    console.log(`%cVersion ${VERSION} (Check below for latest version)`, 'font-size: 1.1em')
    console.log(`Welcome to the developer console for your browser! Besides looking at the source code, \
you can also play around with Check PCR by executing the lines below:
%c\tfetchData(true)           %c// Reloads your assignments (the true forces a reload if one \
was already triggered in the last minute)
%c\tdata                      %c// The data parsed from PCR's interface
%c\tactivity                  %c// The data for the assignments shown in the activity pane
%c\textra                     %c// The tasks you've created by clicking the + button
%c\tathenaData                %c// The data you've entered from Athena into settings
%c\tsnackbar("Hello World!")  %c// Creates a snackbar showing the message "Hello World!"
%c\tdisplayError(new Error()) %c// Displays the stack trace for a random error (Just don't submit it!)
%c\tcloseError()              %c// Closes that dialog`,
                ...(([] as string[]).concat(...Array.from(new Array(8), () => ['color: initial', 'color: grey']))))
    console.log('')
}

/**
 * Exports the state object as well as defining getters and setters on the
 * window object for all state objects.
 */
function exportVariables(): void {
    const wnd = window as any
    wnd.fetchData = fetch
    wnd.state = state
    wnd.snackbar = snackbar
    wnd.displayError = displayError
    wnd.closeError = closeError
    Object.keys(state).forEach((item) => {
        Object.defineProperty(window, item, {
            get(): any { return getStateItem(item).get() },
            set(value: any): void { return getStateItem(item).set(value) }
        })
    })
}

export function initConsoleInteractivity(): void {
    logInfo()
    exportVariables()
}
