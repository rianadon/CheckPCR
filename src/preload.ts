/*
 * Fast snippets that run before the all HTML gets loaded.
 */

 /**
  * Set the supplied navbar class, retrieving its last value from local storage
  */
function navInit(name: string): void {
    if (JSON.parse(localStorage.getItem(name) || 'false')) document.body.classList.add(name)
}

navInit('dark')
navInit('showInfo')
navInit('showDone')
document.body.setAttribute('data-view', JSON.parse(localStorage.getItem('view') || '0'))
const brnd = document.getElementById('brand')
if (brnd) brnd.innerHTML = document.title = (localStorage.getItem('titleAction') || 'Check') + ' PCR'
