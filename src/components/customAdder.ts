import { getClasses } from '../pcr'
import { _$, capitalizeString, elemById, element } from '../util'

// When anything is typed, the search suggestions need to be updated.
const TIP_NAMES = {
    for: ['for'],
    by: ['by', 'due', 'ending'],
    starting: ['starting', 'beginning', 'assigned']
}

const newText = elemById('newText') as HTMLInputElement

export function updateNewTips(val: string, scroll: boolean = true): void {
    if (scroll) {
        elemById('newTips').scrollTop = 0
    }

    const spaceIndex = val.lastIndexOf(' ')
    let foundFor = false
    if (spaceIndex !== -1) {
        const beforeSpace = val.lastIndexOf(' ', spaceIndex - 1)
        const before = val.substring((beforeSpace === -1 ? 0 : beforeSpace + 1), spaceIndex)
        Object.entries(TIP_NAMES).forEach(([name, possible]) => {
            if (possible.indexOf(before) !== -1) {
                if (name === 'for') {
                    foundFor = true
                    Object.keys(TIP_NAMES).forEach((tipName) => {
                        elemById(`tip${tipName}`).classList.remove('active')
                    })
                    getClasses().forEach((cls) => {
                        const id = `tipclass${cls.replace(/\W/, '')}`
                        if (spaceIndex === (val.length - 1)) {
                            const e = document.getElementById(id)
                            if (e) {
                                e.classList.add('active')
                            } else {
                                const container = element('div', ['classTip', 'active', 'tip'],
                                    `<i class='material-icons'>class</i><span class='typed'>${cls}</span>`, id)
                                container.addEventListener('click', tipComplete(cls))
                                elemById('newTips').appendChild(container)
                            }
                        } else {
                            elemById(id).classList.toggle('active',
                                cls.toLowerCase().includes(val.toLowerCase().substr(spaceIndex + 1)))
                        }
                    })
                }
            }
        })
    }
    if (foundFor) return

    document.querySelectorAll('.classTip').forEach((el) => {
        el.classList.remove('active')
    })
    if ((val === '') || (val.charAt(val.length - 1) === ' ')) {
        updateTip('for', 'for', false)
        updateTip('by', 'by', false)
        updateTip('starting', 'starting', false)
    } else {
        const lastSpace = val.lastIndexOf(' ')
        let lastWord = lastSpace === -1 ? val : val.substr(lastSpace + 1)
        const uppercase = lastWord.charAt(0) === lastWord.charAt(0).toUpperCase()
        lastWord = lastWord.toLowerCase()
        Object.entries(TIP_NAMES).forEach(([name, possible]) => {
            let found: string|null = null
            possible.forEach((p) => {
                if (p.slice(0, lastWord.length) === lastWord) {
                    found = p
                }
            })
            if (found) {
                updateTip(name, found, uppercase)
            } else {
                elemById(`tip${name}`).classList.remove('active')
            }
        })
    }
}

function updateTip(name: string, typed: string, capitalize: boolean): void {
    if (name !== 'for' && name !== 'by' && name !== 'starting') {
        throw new Error('Invalid tip name')
    }

    const el = elemById(`tip${name}`)
    el.classList.add('active')
    _$(el.querySelector('.typed')).innerHTML = (capitalize ? capitalizeString(typed) : typed) + '...'
    const newNames: string[] = []
    TIP_NAMES[name].forEach((n) => {
        if (n !== typed) { newNames.push(`<b>${n}</b>`) }
    })
    _$(el.querySelector('.others')).innerHTML = newNames.length > 0 ? `You can also use ${newNames.join(' or ')}` : ''
}

function tipComplete(autocomplete: string): (evt: Event) => void {
    return (evt: Event) => {
        const val = newText.value
        const lastSpace = val.lastIndexOf(' ')
        const lastWord = lastSpace === -1 ? 0 : lastSpace + 1
        updateNewTips(newText.value = val.substring(0, lastWord) + autocomplete + ' ')
        return newText.focus()
    }
}

// The event listener is then added to the preexisting tips.
document.querySelectorAll('.tip').forEach((tip) => {
    tip.addEventListener('click', tipComplete(_$(tip.querySelector('.typed')).innerHTML))
})
