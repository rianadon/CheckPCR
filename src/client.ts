import { checkCommit, fetchNews, getNews, VERSION } from './app'
import { closeOpened, getES } from './components/assignment'
import { updateAvatar } from './components/avatar'
import { updateNewTips } from './components/customAdder'
import { getResizeAssignments, resize, resizeCaller } from './components/resizer'
import { toDateNum, today } from './dates'
import { display, formatUpdate, getScroll } from './display'
import {
    decrementCalDateOffset,
    decrementListDateOffset,
    getCalDateOffset,
    getListDateOffset,
    incrementCalDateOffset,
    incrementListDateOffset,
    setListDateOffset,
    zeroDateOffsets
} from './navigation'
import { dologin, fetch, getClasses, getData, logout, setData, switchViews } from './pcr'
import { addActivity, recentActivity } from './plugins/activity'
import { updateAthenaData } from './plugins/athena'
import { addToExtra, parseCustomTask, saveExtra } from './plugins/customAssignments'
import { getSetting, setSetting, settings } from './settings'
import {
    _$,
    _$h,
    animateEl,
    dateString,
    elemById,
    element,
    forceLayout,
    localStorageRead,
    localStorageWrite,
    monthString,
    requestIdleCallback,
    ripple
} from './util'

if (localStorageRead('data') != null) {
    setData(localStorageRead('data'))
}

// Additionally, if it's the user's first time, the page is set to the welcome page.
if (!localStorageRead('noWelcome')) {
    localStorageWrite('noWelcome', true)
    window.location.href = 'welcome.html'
}

const NAV_ELEMENT = _$(document.querySelector('nav'))
const INPUT_ELEMENTS = document.querySelectorAll(
    'input[type=text]:not(#newText):not([readonly]), input[type=password], input[type=email], ' +
    'input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]'
) as NodeListOf<HTMLInputElement>

// #### Send function
//

// This function displays a snackbar to tell the user something

// <a name="ret"/>
// Retrieving data
// ---------------
//
elemById('login').addEventListener('submit', (evt) => {
    evt.preventDefault()
    dologin(null, true)
})

// The view switching button needs an event handler.
elemById('switchViews').addEventListener('click', switchViews)

// The same goes for the log out button.
elemById('logout').addEventListener('click', logout)

// Now we assign it to clicking the background.
elemById('background').addEventListener('click', closeOpened)

// Then, the tabs are made interactive.
document.querySelectorAll('#navTabs>li').forEach((tab, tabIndex) => {
  tab.addEventListener('click', (evt) => {
    if (!settings.viewTrans) {
      document.body.classList.add('noTrans')
      forceLayout(document.body)
    }
    localStorageWrite('view', tabIndex)
    document.body.setAttribute('data-view', String(tabIndex))
    if (tabIndex === 1) {
        window.addEventListener('resize', resizeCaller)
        if (settings.viewTrans) {
            let start: number|null = null
            // The code below is the same code used in the resize() function. It basically just
            // positions the assignments correctly as they animate
            const widths = document.body.classList.contains('showInfo') ?
                [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800]
            let columns = 1
            widths.forEach((w, index) => {
                if (window.innerWidth > w) { columns = index + 1 }
            })
            const assignments = getResizeAssignments()
            const columnHeights = Array.from(new Array(columns), () => 0)
            const step = (timestamp: number) => {
                if (!columns) throw new Error('Columns number not found')
                assignments.forEach((assignment, n) => {
                    const col = n % columns
                    if (n < columns) {
                        columnHeights[col] = 0
                    }
                    assignment.style.top = columnHeights[col] + 'px'
                    if (start == null) {
                        const [eName, sName] = getES(assignment)
                        const oldLeft = Number(sName.substring(1)) * 100 / 7 + '%'
                        const oldRight = Number(eName.substring(1)) * 100 / 7 + '%'

                        const left = ((100 / columns) * col) + '%'
                        const right = ((100 / columns) * (columns - col - 1)) + '%'
                        animateEl(assignment, [
                            { left: oldLeft, right: oldRight },
                            { left, right }
                        ], { duration: 300 }).then(() => {
                            assignment.style.left = left
                            assignment.style.right = right
                        })
                    }
                    columnHeights[col] += assignment.offsetHeight + 24
                })
                if (start == null) start = timestamp
                if ((timestamp - start) < 350) {
                    return window.requestAnimationFrame(step)
                }
            }
            window.requestAnimationFrame(step)
            setTimeout(() => {
                if (!columns) throw new Error('Columns number not found')
                assignments.forEach((assignment, n) => {
                    const col = n % columns
                    if (n < columns) {
                    columnHeights[col] = 0
                    }
                    assignment.style.top = columnHeights[col] + 'px'
                    columnHeights[col] += assignment.offsetHeight + 24
                })
            }, 350)
        } else {
            resize()
        }
        zeroDateOffsets()
        updateDateNavs()
    } else {
        window.scrollTo(0, getScroll())
        NAV_ELEMENT.classList.add('headroom--locked')
        setTimeout(() => {
            NAV_ELEMENT.classList.remove('headroom--unpinned')
            NAV_ELEMENT.classList.remove('headroom--locked')
            NAV_ELEMENT.classList.add('headroom--pinned')
        }, 350)
        requestIdleCallback(() => {
            zeroDateOffsets()
            lazyFetch()
            updateDateNavs()
            display()
        }, {timeout: 2000})
        window.removeEventListener('resize', resizeCaller)
        document.querySelectorAll('.assignment').forEach((assignment) => {
            (assignment as HTMLElement).style.top = 'auto'
        })
    }
    if (!settings.viewTrans) {
      forceLayout(document.body)
      setTimeout(() => {
          document.body.classList.remove('noTrans')
      }, 350)
    }
  })
})

// And the info tabs (just a little less code)
document.querySelectorAll('#infoTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        elemById('info').setAttribute('data-view', String(tabIndex))
    })
})

// The view is set to what it was last.
if (localStorageRead('view') != null) {
  document.body.setAttribute('data-view', localStorageRead('view'))
  if (localStorageRead('view') === 1) {
    window.addEventListener('resize', resizeCaller)
  }
}

// Additionally, the active class needs to be added when inputs are selected (for the login box).
INPUT_ELEMENTS.forEach((input) => {
    input.addEventListener('change', (evt) => {
        _$h(_$h(input.parentNode).querySelector('label')).classList.add('active')
    })
    input.addEventListener('focus', (evt) => {
        _$h(_$h(input.parentNode).querySelector('label')).classList.add('active')
    })
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            _$h(_$h(input.parentNode).querySelector('label')).classList.remove('active')
        }
    })
})

// When the escape key is pressed, the current assignment should be closed.
window.addEventListener('keydown', (evt) => {
  if (evt.which === 27) { // Escape key pressed
    if (document.getElementsByClassName('full').length !== 0) { return closeOpened(new Event('Generated Event')) }
  }
});

// If it's winter time, a class is added to the body element.
(() => {
    const todayDate = new Date()
    if (new Date(todayDate.getFullYear(), 10, 27) <= todayDate &&
        todayDate <= new Date(todayDate.getFullYear(), 11, 32)) {
        return document.body.classList.add('winter')
    }
})()

// For the navbar toggle buttons, a function to toggle the action is defined to eliminate code.
function navToggle(elem: string, ls: string, f?: () => void): void {
    ripple(elemById(elem))
    elemById(elem).addEventListener('mouseup', () => {
        document.body.classList.toggle(ls)
        resize()
        localStorageWrite(ls, document.body.classList.contains(ls))
        if (f != null) f()
    })
    if (localStorageRead(ls)) document.body.classList.add(ls)
}

// The button to show/hide completed assignments in list view also needs event listeners.
navToggle('cvButton', 'showDone', () => setTimeout(resize, 1000))

// The same goes for the button that shows upcoming tests.
if (localStorage.showInfo == null) { localStorage.showInfo = JSON.stringify(true) }
navToggle('infoButton', 'showInfo')

// This also gets repeated for the theme toggling.
navToggle('lightButton', 'dark')

function setupDateListener(opts: { elem: HTMLElement, from: HTMLElement, current: HTMLElement, to: HTMLElement,
                                   hooks: Array<() => void>, forward: boolean, newsupplier: () => string }): void {
    const { elem, from, current, to, hooks, forward, newsupplier } = opts
    elem.addEventListener('click', () => {
        const transfrom = forward ? 'translateX(0%)' : 'translateX(-100%)'
        const transto = forward ? 'translateX(-100%)' : 'translateX(0%)'
        hooks.forEach((hook) => hook())
        to.style.display = 'inline-block'
        Promise.race([
            animateEl(current, [
                {transform: transfrom, opacity: 1},
                {opacity: 0},
                {transform: transto, opacity: 0}
            ], {duration: 300, easing: 'ease-out'}),
            animateEl(to, [
                {transform: transfrom, opacity: 0},
                {opacity: 0},
                {transform: transto, opacity: 1}
            ], {duration: 300, easing: 'ease-out'})
        ]).then(() => {
                from.innerHTML = current.innerHTML
                current.innerHTML = to.innerHTML
                to.innerHTML = newsupplier()
                to.style.display = 'none'
        })
    })
}

setupDateListener({
    elem: elemById('listnext'),
    from: elemById('listprevdate'),
    current: elemById('listnowdate'),
    to: elemById('listnextdate'),
    hooks: [incrementListDateOffset, display],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date()
        listDate2.setDate(listDate2.getDate() + 1 + getListDateOffset())
        return dateString(listDate2).replace('Today', 'Now')
    }
})

setupDateListener({
    elem: elemById('listbefore'),
    from: elemById('listnextdate'),
    current: elemById('listnowdate'),
    to: elemById('listprevdate'),
    hooks: [decrementListDateOffset, display],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date()
        listDate2.setDate(listDate2.getDate() - 1 + getListDateOffset())
        return dateString(listDate2).replace('Today', 'Now')
    }
})

function lazyFetch(): void {
    Array.from(document.querySelectorAll('.week, .upcomingTest'))
        .forEach((s) => s.remove())
    document.body.removeAttribute('data-pcrview')
    if (getCalDateOffset() === 0) {
        setData(localStorageRead('data'))
        display()
    } else {
        fetch(true)
    }
}

setupDateListener({
    elem: elemById('calnext'),
    from: elemById('calprevdate'),
    current: elemById('calnowdate'),
    to: elemById('calnextdate'),
    hooks: [incrementCalDateOffset, lazyFetch],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date()
        listDate2.setMonth(listDate2.getMonth() + 1 + getCalDateOffset())
        return monthString(listDate2).replace('Today', 'Now')
    }
})

setupDateListener({
    elem: elemById('calbefore'),
    from: elemById('calnextdate'),
    current: elemById('calnowdate'),
    to: elemById('calprevdate'),
    hooks: [decrementCalDateOffset, lazyFetch],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date()
        listDate2.setMonth(listDate2.getMonth() - 1 + getCalDateOffset())
        return monthString(listDate2)
    }
})

function updateListNav(): void {
    const d = new Date()
    d.setDate((d.getDate() + getListDateOffset()) - 1)
    const up = (id: string) => {
        elemById(id).innerHTML = dateString(d).replace('Today', 'Now')
        return d.setDate(d.getDate() + 1)
    }
    up('listprevdate')
    up('listnowdate')
    up('listnextdate')
}

function updateCalNav(): void {
    const d = new Date()
    d.setMonth((d.getMonth() + getCalDateOffset()) - 1)
    const up = (id: string) => {
        elemById(id).innerHTML = monthString(d)
        return d.setMonth(d.getMonth() + 1)
    }
    up('calprevdate')
    up('calnowdate')
    up('calnextdate')
}

// Whenever a date is double clicked, long tapped, or force touched, list view for that day is displayed.
function updateDateNavs(): void {
    updateListNav()
    updateCalNav()
}

function switchToList(evt: Event): void {
    if (_$h(evt.target).classList.contains('month') || _$h(evt.target).classList.contains('date')) {
        setListDateOffset(toDateNum(Number(_$h(_$h(evt.target).parentNode).getAttribute('data-date'))) - today())
        updateDateNavs()
        document.body.setAttribute('data-view', '1')
        return display()
    }
}

document.body.addEventListener('dblclick', switchToList)
document.body.addEventListener('webkitmouseforceup', switchToList);
(() => {
    let taptimer: number|null = null
    document.body.addEventListener('touchstart', (evt) => taptimer = setTimeout((() => switchToList(evt)), 1000))
    document.body.addEventListener('touchend', (evt) => {
        if (taptimer) clearTimeout(taptimer)
        taptimer = null
    })
})()

// <a name="side"/>
// Side menu and Navbar
// --------------------
//
// The [Headroom library](https://github.com/WickyNilliams/headroom.js) is used to show the navbar when scrolling up
const headroom = new Headroom(_$(document.querySelector('nav')), {
  tolerance: 10,
  offset: 66
})
headroom.init()

// Also, the side menu needs event listeners.
elemById('collapseButton').addEventListener('click', () => {
  document.body.style.overflow = 'hidden'
  elemById('sideNav').classList.add('active')
  return elemById('sideBackground').style.display = 'block'
})

elemById('sideBackground').addEventListener('click', () => {
  elemById('sideBackground').style.opacity = '0'
  elemById('sideNav').classList.remove('active')
  elemById('dragTarget').style.width = ''
  return setTimeout(() => {
    document.body.style.overflow = 'auto'
    elemById('sideBackground').style.display = 'none'
  }
  , 350)
})

updateAvatar()

// <a name="athena"/> Athena (Schoology)
// ------------------
//

// <a name="settings"/> Settings
// --------
//
// The code below updates the current version text in the settings. I should've put this under the
// Updates section, but it should go before the display() function forces a reflow.
elemById('version').innerHTML = VERSION

// To bring up the settings windows, an event listener needs to be added to the button.
elemById('settingsB').addEventListener('click', () => {
    elemById('sideBackground').click()
    document.body.classList.add('settingsShown')
    elemById('brand').innerHTML = 'Settings'
    return setTimeout(() => {
        _$h(document.querySelector('main')).style.display = 'none'
    })
})

// The back button also needs to close the settings window.
elemById('backButton').addEventListener('click', () => {
    _$h(document.querySelector('main')).style.display = 'block'
    document.body.classList.remove('settingsShown')
    return elemById('brand').innerHTML = 'Check PCR'
})

// The code below is what the settings control.
if (settings.sepTasks) {
    elemById('info').classList.add('isTasks')
    elemById('new').style.display = 'none'
}
if (settings.holidayThemes) { document.body.classList.add('holidayThemes') }
if (settings.sepTaskClass) { document.body.classList.add('sepTaskClass') }
interface IColorMap { [cls: string]: string }
let assignmentColors: IColorMap = localStorageRead('assignmentColors', {
    classwork: '#689f38', homework: '#2196f3', longterm: '#f57c00', test: '#f44336'
})
let classColors = localStorageRead('classColors', () => {
    const cc: IColorMap = {}
    const data = getData()
    if (!data) return cc
    data.classes.forEach((c: string) => {
        cc[c] = '#616161'
    })
    return cc
})
elemById(`${settings.colorType}Colors`).style.display = 'block'
window.addEventListener('focus', () => {
  if (settings.refreshOnFocus) fetch()
})
function intervalRefresh(): void {
    const r = settings.refreshRate
    if (r > 0) {
        setTimeout(() => {
            console.debug('Refreshing because of timer')
            fetch()
            intervalRefresh()
        }, r * 60 * 1000)
    }
}
intervalRefresh()

// For choosing colors, the color choosing boxes need to be initialized.
const palette: IColorMap = {
  '#f44336': '#B71C1C',
  '#e91e63': '#880E4F',
  '#9c27b0': '#4A148C',
  '#673ab7': '#311B92',
  '#3f51b5': '#1A237E',
  '#2196f3': '#0D47A1',
  '#03a9f4': '#01579B',
  '#00bcd4': '#006064',
  '#009688': '#004D40',
  '#4caf50': '#1B5E20',
  '#689f38': '#33691E',
  '#afb42b': '#827717',
  '#fbc02d': '#F57F17',
  '#ffa000': '#FF6F00',
  '#f57c00': '#E65100',
  '#ff5722': '#BF360C',
  '#795548': '#3E2723',
  '#616161': '#212121'
}

getClasses().forEach((c: string) => {
    const d = element('div', [], c)
    d.setAttribute('data-control', c)
    d.appendChild(element('span', []))
    elemById('classColors').appendChild(d)
})
document.querySelectorAll('.colors').forEach((e) => {
    e.querySelectorAll('div').forEach((color) => {
        const controlledColor = color.getAttribute('data-control')
        if (!controlledColor) throw new Error('Element has no controlled color')

        const sp = _$h(color.querySelector('span'))
        const listName = e.getAttribute('id') === 'classColors' ? 'classColors' : 'assignmentColors'
        const listSetter = (v: IColorMap) => {
            e.getAttribute('id') === 'classColors' ? classColors = v : assignmentColors = v
        }
        const list = e.getAttribute('id') === 'classColors' ? classColors : assignmentColors
        sp.style.backgroundColor = list[controlledColor]
        Object.keys(palette).forEach((p) => {
            const pe = element('span', [])
            pe.style.backgroundColor = p
            if (p === list[controlledColor]) {
                pe.classList.add('selected')
            }
            sp.appendChild(pe)
        })
        const custom = element('span', ['customColor'], `<a>Custom</a> \
    <input type='text' placeholder='Was ${list[controlledColor]}' /> \
    <span class='customInfo'>Use any CSS valid color name, such as \
    <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span> \
    <a class='customOk'>Set</a>`)
        custom.addEventListener('click', (evt) => evt.stopPropagation())
        _$(custom.querySelector('a')).addEventListener('click', (evt) => {
            sp.classList.toggle('onCustom')
            evt.stopPropagation()
        })
        sp.addEventListener('click', (evt) => {
            if (sp.classList.contains('choose')) {
                const target = _$h(evt.target)
                const bg = tinycolor(target.style.backgroundColor || '#000').toHexString()
                list[controlledColor] = bg
                sp.style.backgroundColor = bg
                const selected = target.querySelector('.selected')
                if (selected) {
                    selected.classList.remove('selected')
                }
                target.classList.add('selected')
                localStorage[listName] = JSON.stringify(list)
                listSetter(list)
                updateColors()
            }
            sp.classList.toggle('choose')
        })
        _$(custom.querySelector('.customOk')).addEventListener('click', (evt) => {
            sp.classList.remove('onCustom')
            sp.classList.toggle('choose')
            const selectedEl = sp.querySelector('.selected')
            if (selectedEl != null) {
                selectedEl.classList.remove('selected')
            }
            sp.style.backgroundColor = (list[controlledColor] = _$(custom.querySelector('input')).value)
            localStorage[listName] = JSON.stringify(list)
            updateColors()
            return evt.stopPropagation()
        })
    })
})

// Then, a function that updates the color preferences is defined.
function updateColors(): void {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(''))
    document.head.appendChild(style)
    const sheet = _$(style.sheet) as CSSStyleSheet

    const addColorRule = (selector: string, light: string, dark: string, extra = '') => {
        const mixed = tinycolor.mix(light, '#1B5E20', 70).toHexString()
        sheet.insertRule(`${extra}.assignment${selector} { background-color: ${light}; }`, 0)
        sheet.insertRule(`${extra}.assignment${selector}.done { background-color: ${dark}; }`, 0)
        sheet.insertRule(`${extra}.assignment${selector}::before { background-color: ${mixed}; }`, 0)
        sheet.insertRule(`${extra}.assignmentItem${selector}>i { background-color: ${light}; }`, 0)
        sheet.insertRule(`${extra}.assignmentItem${selector}.done>i { background-color: ${dark}; }`, 0)
    }

    const createPalette = (color: string) => tinycolor(color).darken(24).toHexString()

    if (settings.colorType === 'assignment') {
        Object.entries(assignmentColors).forEach(([name, color]) => {
            addColorRule(`.${name}`, color, palette[color] || createPalette(color))
        })
    } else {
        Object.entries(classColors).forEach(([name, color]) => {
            addColorRule(`[data-class=\"${name}\"]`, color, palette[color] || createPalette(color))
        })
    }

    addColorRule('.task', '#F5F5F5', '#E0E0E0')
    addColorRule('.task', '#424242', '#212121', '.dark ')
}

// The function then needs to be called.
updateColors()

// The elements that control the settings also need event listeners
document.querySelectorAll('.settingsControl').forEach((e: HTMLInputElement) => {
    if (e.type === 'checkbox') {
        e.checked = getSetting(e.name)
    } else {
        e.value = getSetting(e.name)
    }
    e.addEventListener('change', (evt) => {
        if (e.type === 'checkbox') {
            setSetting(e.name, e.checked)
        } else {
            setSetting(e.name, e.value)
        }
        switch (e.name) {
            case 'refreshRate': return intervalRefresh()
            case 'earlyTest': return display()
            case 'assignmentSpan': return display()
            case 'projectsInTestPane': return display()
            case 'hideAssignments': return display()
            case 'holidayThemes': return document.body.classList.toggle('holidayThemes', e.checked)
            case 'sepTaskClass': document.body.classList.toggle('sepTaskClass', e.checked); return display()
            case 'sepTasks': return elemById('sepTasksRefresh').style.display = 'block'
        }
    })
})

// This also needs to be done for radio buttons
const colorType =
    _$(document.querySelector(`input[name=\"colorType\"][value=\"${settings.colorType}\"]`)) as HTMLInputElement
colorType.checked = true
Array.from(document.getElementsByName('colorType')).forEach((c) => {
  c.addEventListener('change', (evt) => {
    const v = (_$(document.querySelector('input[name="colorType"]:checked')) as HTMLInputElement).value
    if (v !== 'assignment' && v !== 'class') return
    settings.colorType = v
    if (v === 'class') {
      elemById('assignmentColors').style.display = 'none'
      elemById('classColors').style.display = 'block'
    } else {
      elemById('assignmentColors').style.display = 'block'
      elemById('classColors').style.display = 'none'
    }
    return updateColors()
  })
})

// The same goes for textareas.
document.querySelectorAll('textarea').forEach((e) => {
  if ((e.name !== 'athenaDataRaw') && (localStorage[e.name] != null)) {
    e.value = localStorage[e.name]
  }
  e.addEventListener('input', (evt) => {
    localStorage[e.name] = e.value
    if (e.name === 'athenaDataRaw') {
      updateAthenaData(e.value)
    }
  })
})

// <a name="starting"/>
// Starting everything
// -------------------
//
// Finally! We are (almost) done!
//
// Before getting to anything, let's print out a welcoming message to the console!
console.log('%cCheck PCR', 'color: #004000; font-size: 3em')
console.log(`%cVersion ${VERSION} (Check below for current version)`, 'font-size: 1.1em')
console.log(`Welcome to the developer console for your browser! Besides looking at the source code, \
you can also play around with Check PCR by executing the lines below:
%c\tfetch(true)               %c// Reloads all of your assignments (the true is for forcing a reload if one \
has already been triggered in the last minute)
%c\tdata                      %c// Displays the object that contains the data parsed from PCR's interface
%c\tactivity                  %c// The data for the assignments that show up in the activity pane
%c\textra                     %c// All of the tasks you've created by clicking the + button
%c\tathenaData                %c// The data fetched from Athena (if you've pasted the raw data into settings)
%c\tsnackbar("Hello World!")  %c// Creates a snackbar showing the message "Hello World!"
%c\tdisplayError(new Error()) %c// Displays the stack trace for a random error (Just don't submit it!)
%c\tcloseError()              %c// Closes that dialog`,
               ...(([] as string[]).concat(...Array.from(new Array(8), () => ['color: initial', 'color: grey']))))
console.log('')

// The "last updated" text is set to the correct date.
const triedLastUpdate = localStorageRead('lastUpdate')
elemById('lastUpdate').innerHTML = triedLastUpdate ? formatUpdate(triedLastUpdate) : 'Never'

if (localStorageRead('data') != null) {
    // Now check if there's activity
    recentActivity().forEach((item) => {
        addActivity(item[0], item[1], new Date(item[2]), false, item[3])
    })

    display()
}

fetch()

// <a name="events"/>
// Events
// ------
//
// The document body needs to be enabled for hammer.js events.
delete Hammer.defaults.cssProps.userSelect
const hammertime = new Hammer.Manager(document.body, {
  recognizers: [
    [Hammer.Pan, {direction: Hammer.DIRECTION_HORIZONTAL}]
  ]
})

// For touch displays, hammer.js is used to make the side menu appear/disappear. The code below is
// adapted from Materialize's implementation.
let menuOut = false
const dragTarget = new Hammer(elemById('dragTarget'))
dragTarget.on('pan', (e) => {
  if (e.pointerType === 'touch') {
    e.preventDefault()
    let { x } = e.center
    const { y } = e.center

    const sBkg = elemById('sideBackground')
    sBkg.style.display = 'block'
    sBkg.style.opacity = '0'
    elemById('sideNav').classList.add('manual')

    // Keep within boundaries
    if (x > 240) {
      x = 240
    } else if (x < 0) {
      x = 0

      // Left Direction
      if (x < 120) {
        menuOut = false
      // Right Direction
      } else if (x >= 120) {
        menuOut = true
      }
    }

    elemById('sideNav').style.transform = `translateX(${x - 240}px)`
    const overlayPercent = Math.min(x / 480, 0.5)
    return sBkg.style.opacity = String(overlayPercent)
  }
})

dragTarget.on('panend', (e) => {
  if (e.pointerType === 'touch') {
    let sideNav
    const { velocityX } = e
    // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
    if ((menuOut && (velocityX <= 0.3)) || (velocityX < -0.5)) {
      sideNav = elemById('sideNav')
      sideNav.classList.remove('manual')
      sideNav.classList.add('active')
      sideNav.style.transform = ''
      elemById('dragTarget').style.width = '100%'

    } else if (!menuOut || (velocityX > 0.3)) {
      document.body.style.overflow = 'auto'
      sideNav = elemById('sideNav')
      sideNav.classList.remove('manual')
      sideNav.classList.remove('active')
      sideNav.style.transform = ''
      elemById('sideBackground').style.opacity = ''
      elemById('dragTarget').style.width = '10px'
      setTimeout(() => elemById('sideBackground').style.display = 'none'
      , 350)
    }
  }
})

dragTarget.on('tap', (e) => {
    elemById('sideBackground').click()
    e.preventDefault()
})

const dt = document.getElementById('dragTarget')

// The activity filter button also needs an event listener.
ripple(elemById('filterActivity'))
elemById('filterActivity').addEventListener('click', () => {
  elemById('infoActivity').classList.toggle('filter')
})

// At the start, it needs to be correctly populated
const activityTypes = settings.shownActivity

function updateSelectNum(): string {
    const c = (bool: boolean)  => bool ? 1 : 0
    const count = String(c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes.delete))
    return elemById('selectNum').innerHTML = count
}
updateSelectNum()
Object.entries(activityTypes).forEach(([type, enabled]) => {
  if (type !== 'add' && type !== 'edit' && type !== 'delete') {
    throw new Error(`Invalid activity type ${type}`)
  }

  const selectEl = elemById(type + 'Select') as HTMLInputElement
  selectEl.checked = enabled
  if (enabled) { elemById('infoActivity').classList.add(type) }
  selectEl.addEventListener('change', (evt) => {
    activityTypes[type] = selectEl.checked
    elemById('infoActivity').setAttribute('data-filtered', updateSelectNum())
    elemById('infoActivity').classList.toggle(type)
    settings.shownActivity = activityTypes
  })
})

// The show completed tasks checkbox is set correctly and is assigned an event listener.
const showDoneTasksEl = elemById('showDoneTasks') as HTMLInputElement
if (settings.showDoneTasks) {
  showDoneTasksEl.checked = true
  elemById('infoTasksInner').classList.add('showDoneTasks')
}
showDoneTasksEl.addEventListener('change', () => {
  settings.showDoneTasks = showDoneTasksEl.checked
  elemById('infoTasksInner').classList.toggle('showDoneTasks', settings.showDoneTasks)
})

// <a name="updates"/>
// Updates and News
// ----------------
//

if (location.protocol === 'chrome-extension:') { checkCommit() }

// This update dialog also needs to be closed when the buttons are clicked.
elemById('updateDelay').addEventListener('click', () => {
  elemById('update').classList.remove('active')
  setTimeout(() => {
    elemById('updateBackground').style.display = 'none'
  }, 350)
})

// For news, the latest news is fetched from a GitHub gist.
fetchNews()

// The news dialog then needs to be closed when OK or the background is clicked.
function closeNews(): void {
  elemById('news').classList.remove('active')
  setTimeout(() => {
    elemById('newsBackground').style.display = 'none'
  }, 350)
}

elemById('newsOk').addEventListener('click', closeNews)
elemById('newsBackground').addEventListener('click', closeNews)

// It also needs to be opened when the news button is clicked.
elemById('newsB').addEventListener('click', () => {
  elemById('sideBackground').click()
  const displayNews = () => {
    elemById('newsBackground').style.display = 'block'
    return elemById('news').classList.add('active')
  }

  if (elemById('newsContent').childNodes.length === 0) {
    getNews(displayNews)
  } else {
    displayNews()
  }
})

// The same goes for the error dialog.
function closeError(): void {
  elemById('error').classList.remove('active')
  setTimeout(() => {
    elemById('errorBackground').style.display = 'none'
  }, 350)
}

elemById('errorNo').addEventListener('click', closeError)
elemById('errorBackground').addEventListener('click', closeError)

// <a name="new"/>
// Adding new assignments
// ----------------------
//
// The event listeners for the new buttons are added.
ripple(elemById('new'))
ripple(elemById('newTask'))
const onNewTask = () => {
  updateNewTips((elemById('newText') as HTMLInputElement).value = '')
  document.body.style.overflow = 'hidden'
  elemById('newBackground').style.display = 'block'
  elemById('newDialog').classList.add('active')
  elemById('newText').focus()
}
elemById('new').addEventListener('mouseup', onNewTask)
elemById('newTask').addEventListener('mouseup', onNewTask)

// A function to close the dialog is then defined.
function closeNew(): void {
  document.body.style.overflow = 'auto'
  elemById('newDialog').classList.remove('active')
  setTimeout(() => {
    elemById('newBackground').style.display = 'none'
  }, 350)
}

// This function is set to be called called when the ESC key is called inside of the dialog.
elemById('newText').addEventListener('keydown', (evt) => {
  if (evt.which === 27) { // Escape key pressed
    closeNew()
  }
})

// An event listener to call the function is also added to the X button
elemById('newCancel').addEventListener('click', closeNew)

// When the enter key is pressed or the submit button is clicked, the new assignment is added.
elemById('newDialog').addEventListener('submit', (evt) => {
  evt.preventDefault()
  const itext = (elemById('newText') as HTMLInputElement).value
  const { text, cls, due, st } = parseCustomTask(itext)
  let end: 'Forever'|number = 'Forever'

  const start = (st != null) ? toDateNum(chrono.parseDate(st)) : today()
  if (due != null) {
    end = toDateNum(chrono.parseDate(due))
    if (end < start) { // Assignment ends before it is assigned
      end += Math.ceil((start - end) / 7) * 7
    }
  }
  addToExtra({
    body: text.charAt(0).toUpperCase() + text.substr(1),
    done: false,
    start,
    class: (cls != null) ? cls.toLowerCase().trim() : null,
    end
  })
  saveExtra()
  closeNew()
  display(false)
})

updateNewTips('', false)
elemById('newText').addEventListener('input', () => {
  return updateNewTips((elemById('newText') as HTMLInputElement).value)
})

// The code below registers a service worker that caches the page so it can be viewed offline.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) =>
      // Registration was successful
      console.log('ServiceWorker registration successful with scope', registration.scope)).catch((err) =>
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err)
  )
}

// If the service worker detects that the web app has been updated, the commit is fetched from GitHub.
navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Getting commit because of serviceworker')
    if (event.data.getCommit) { return checkCommit() }
})
