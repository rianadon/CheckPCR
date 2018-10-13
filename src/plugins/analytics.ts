// tslint:disable-next-line
/// <reference path="./../../node_modules/@types/google.analytics/index.d.ts" />
import { VERSION } from '../app'
import { snackbar } from '../components/snackbar'
import { state } from '../state'
import { elemById } from '../util'

/**
 * Calls the code Google provides to set up Google Analytics and also alerts the
 * user that's it's being used.
 */
export function initAnalytics(): void {
    if (state.enableAnalytics.get()) {
        const gp = {
            page: '/new.html',
            title: location.protocol === 'chrome-extension:' ? `Version ${VERSION}` : 'Online'
        }

        const now: any = new Date()
        const gaNewElem: any = {}
        const gaElems: any = {}
        // tslint:disable
        ;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*now;a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window as any,document,'script','https://www.google-analytics.com/analytics.js','ga', gaNewElem, gaElems);
        // tslint-enable
        ga('create', 'UA-66932824-1', 'auto')
        ga('set', 'checkProtocolTask', () => {})
        ga('require', 'displayfeatures')
        ga('send', 'pageview', gp)
    } else {
        // @ts-ignore
        window['ga-disable-UA-66932824-1'] = true
    }

    // Alert the user about google analytics to be nice
    if (state.alertAnalytics.get()) {
        snackbar("This page uses Google Analytics. You can opt out via Settings.", "Settings", () => {
            elemById("settingsB").click()
        })
        state.alertAnalytics.set(false)
    }
}
