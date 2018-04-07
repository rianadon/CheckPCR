import { classById, getData, IAssignment } from '../pcr'
import { ActivityType } from '../plugins/activity'
import { assignmentInDone } from '../plugins/done'
import { _$, dateString, elemById, element, smoothScroll } from '../util'
import { separate } from './assignment'

const insertTo = elemById('infoActivity')
export function addActivityElement(el: HTMLElement): void {
    insertTo.insertBefore(el, insertTo.querySelector('.activity'))
}

export function createActivity(type: ActivityType, assignment: IAssignment, date: Date,
                               className?: string ): HTMLElement {
    const cname = className || classById(assignment.class)

    const te = element('div', ['activity', 'assignmentItem', assignment.baseType, type], `
        <i class='material-icons'>${type}</i>
        <span class='title'>${assignment.title}</span>
        <small>${separate(cname)[2]}</small>
        <div class='range'>${dateString(date)}</div>`, `activity${assignment.id}`)
    te.setAttribute('data-class', cname)
    const { id } = assignment
    if (type !== 'delete') {
        te.addEventListener('click', () => {
            const doScrolling = async () => {
                const el = _$(document.querySelector(`.assignment[id*=\"${id}\"]`)) as HTMLElement
                await smoothScroll((el.getBoundingClientRect().top + document.body.scrollTop) - 116)
                el.click()
            }
            if (document.body.getAttribute('data-view') === '0') {
            return doScrolling()
            } else {
                (_$(document.querySelector('#navTabs>li:first-child')) as HTMLElement).click()
                return setTimeout(doScrolling, 500)
            }
        })
    }

    if (assignmentInDone(assignment.id)) {
      te.classList.add('done')
    }
    return te
}
