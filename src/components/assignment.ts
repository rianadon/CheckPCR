import { fromDateNum, today } from '../dates'
import { display, getTimeAfter, ISplitAssignment } from '../display'
import { getListDateOffset } from '../navigation'
import { getAttachmentMimeType, IApplicationData, IAssignment, urlForAttachment } from '../pcr'
import { recentActivity } from '../plugins/activity'
import { getAthenaData } from '../plugins/athena'
import { removeFromExtra, saveExtra } from '../plugins/customAssignments'
import { addToDone, assignmentInDone, removeFromDone, saveDone } from '../plugins/done'
import { modifiedBody, removeFromModified, saveModified, setModified } from '../plugins/modifiedAssignments'
import { _$, cssNumber, dateString, elemById, element, forceLayout, localStorageRead, ripple } from '../util'
import { resize } from './resizer'

const mimeTypes: { [mime: string]: [string, string] } = {
    'application/msword': ['Word Doc', 'document'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['Word Doc', 'document'],
    'application/vnd.ms-powerpoint': ['PPT Presentation', 'slides'],
    'application/pdf': ['PDF File', 'pdf'],
    'text/plain': ['Text Doc', 'plain']
}

const dmp = new diff_match_patch() // For diffing

function populateAddedDeleted(diffs: any[], edits: HTMLElement): boolean {
    let added = 0
    let deleted = 0
    diffs.forEach((diff) => {
        if (diff[0] === 1) { added++ }
        if (diff[0] === -1) { deleted++ }
    })
    _$(edits.querySelector('.additions')).innerHTML = added !== 0 ? `+${added}` : ''
    _$(edits.querySelector('.deletions')).innerHTML = deleted !== 0 ? `-${deleted}` : ''
    edits.classList.add('notEmpty')
    return added > 0 || deleted > 0
}

export function computeWeekId(split: ISplitAssignment): string {
    const startSun = new Date(split.start.getTime())
    startSun.setDate(startSun.getDate() - startSun.getDay())
    return `wk${startSun.getMonth()}-${startSun.getDate()}`
}

// This function separates the parts of a class name.
export function separate(cl: string): RegExpMatchArray {
    const m = cl.match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i)
    if (m == null) throw new Error(`Could not separate class string ${cl}`)
    return m
}

export function assignmentClass(assignment: IAssignment, data: IApplicationData): string {
    const cls = (assignment.class != null) ? data.classes[assignment.class] : 'Task'
    if (cls == null) throw new Error(`Could not find class ${assignment.class} in ${data.classes}`)
    return cls
}

export function separatedClass(assignment: IAssignment, data: IApplicationData): RegExpMatchArray {
    return separate(assignmentClass(assignment, data))
}

export function createAssignment(split: ISplitAssignment, data: IApplicationData): HTMLElement {
    const { assignment, reference } = split

    // Separate the class description from the actual class
    const separated = separatedClass(assignment, data)

    const weekId = computeWeekId(split)

    let smallTag = 'small'
    let link = null
    const athenaData = getAthenaData()
    if (athenaData && assignment.class != null && (athenaData[data.classes[assignment.class]] != null)) {
        link = athenaData[data.classes[assignment.class]].link
        smallTag = 'a'
    }

    const e = element('div', ['assignment', assignment.baseType, 'anim'],
                      `<${smallTag}${link ? ` href='${link}' class='linked' target='_blank'` : ''}>
                           <span class='extra'>${separated[1]}</span>
                           ${separated[2]}
                       </${smallTag}>
                       <span class='title'>${assignment.title}</span>
                       <input type='hidden' class='due'
                              value='${assignment.end === 'Forever' ? 0 : assignment.end}' />`,
                      assignment.id + weekId)

    if (( reference && reference.done) || assignmentInDone(assignment.id)) {
        e.classList.add('done')
    }
    e.setAttribute('data-class', assignmentClass(assignment, data))
    const close = element('a', ['close', 'material-icons'], 'close')
    close.addEventListener('click', closeOpened)
    e.appendChild(close)

    // Prevent clicking the class name when an item is displayed on the calendar from doing anything
    if (link != null) {
        _$(e.querySelector('a')).addEventListener('click', (evt) => {
            if ((document.body.getAttribute('data-view') === '0') && !e.classList.contains('full')) {
                evt.preventDefault()
            }
        })
    }

    const complete = element('a', ['complete', 'material-icons', 'waves'], 'done')
    ripple(complete)
    const id = split.assignment.id
    complete.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) { // Left button
            let added = true
            if (reference != null) { // Task item
                if (e.classList.contains('done')) {
                    reference.done = false
                } else {
                    added = false
                    reference.done = true
                }
                saveExtra()
            } else {
                if (e.classList.contains('done')) {
                    removeFromDone(assignment.id)
                } else {
                    added = false
                    addToDone(assignment.id)
                }
                saveDone()
            }
            if (document.body.getAttribute('data-view') === '1') {
            setTimeout(() => {
                document.querySelectorAll(
                    `.assignment[id^=\"${id}\"], #test${id}, #activity${id}, #ia${id}`
                ).forEach((elem) => {
                    elem.classList.toggle('done')
                })
                if (added) {
                    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
                        document.body.classList.remove('noList')
                    }
                } else {
                    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
                        document.body.classList.add('noList')
                    }
                }
                resize()
            }, 100)
        } else {
            document.querySelectorAll(
                `.assignment[id^=\"${id}\"], #test${id}, #activity${id}, #ia${id}`
            ).forEach((elem) => {
                elem.classList.toggle('done')
            })
            if (added) {
                if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
                    document.body.classList.remove('noList')
                }
            } else {
                if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
                    document.body.classList.add('noList')
                }
            }
            }
        }
    })
    e.appendChild(complete)

    // If the assignment is a custom one, add a button to delete it
    if (split.custom) {
        const deleteA = element('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete')
        ripple(deleteA)
        deleteA.addEventListener('mouseup', (evt) => {
            if (evt.which !== 1 || !reference) return
            removeFromExtra(reference)
            saveExtra()
            if (document.querySelector('.full') != null) {
                document.body.style.overflow = 'auto'
                const back = elemById('background')
                back.classList.remove('active')
                setTimeout(() => {
                    back.style.display = 'none'
                }, 350)
            }
            e.remove()
            display(false)
        })
        e.appendChild(deleteA)
    }

    // Modification button
    const edit = element('a', ['editAssignment', 'material-icons', 'waves'], 'edit')
    edit.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            const remove = edit.classList.contains('active')
            edit.classList.toggle('active')
            _$(e.querySelector('.body')).setAttribute('contentEditable', remove ? 'false' : 'true')
            if (!remove) {
                (e.querySelector('.body') as HTMLElement).focus()
            }
            const dn = e.querySelector('.complete') as HTMLElement
            dn.style.display = remove ? 'block' : 'none'
        }
    })
    ripple(edit)

    e.appendChild(edit)

    const start = new Date(fromDateNum(assignment.start))
    const end = assignment.end === 'Forever' ? assignment.end : new Date(fromDateNum(assignment.end))
    const times = element('div', 'range',
        assignment.start === assignment.end ? dateString(start) : `${dateString(start)} &ndash; ${dateString(end)}`)
    e.appendChild(times)
    if (assignment.attachments.length > 0) {
        const attachments = element('div', 'attachments')
        assignment.attachments.forEach((attachment) => {
            const a = element('a', [], attachment[0]) as HTMLAnchorElement
            a.href = urlForAttachment(attachment[1])
            getAttachmentMimeType(attachment[1]).then((type) => {
                let span
                if (mimeTypes[type] != null) {
                    a.classList.add(mimeTypes[type][1])
                    span = element('span', [], mimeTypes[type][0])
                } else {
                    span = element('span', [], 'Unknown file type')
                }
                a.appendChild(span)
            })
            attachments.appendChild(a)
        })
        e.appendChild(attachments)
    }

    const body = element('div', 'body',
        assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''))
    const edits = element('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>')
    const m = modifiedBody(assignment.id)
    if (m != null) {
        const d = dmp.diff_main(assignment.body, m)
        dmp.diff_cleanupSemantic(d)
        if (d.length !== 0) { // Has been edited
            populateAddedDeleted(d, edits)
            body.innerHTML = m
        }
    }

    body.addEventListener('input', (evt) => {
        if (reference != null) {
            reference.body = body.innerHTML
            saveExtra()
        } else {
            setModified(assignment.id,  body.innerHTML)
            saveModified()
            const d = dmp.diff_main(assignment.body, body.innerHTML)
            dmp.diff_cleanupSemantic(d)
            if (populateAddedDeleted(d, edits)) {
                edits.classList.add('notEmpty')
            } else {
                edits.classList.remove('notEmpty')
            }
        }
        if (document.body.getAttribute('data-view') === '1') resize()
    })

    e.appendChild(body)

    const restore = element('a', ['material-icons', 'restore'], 'settings_backup_restore')
    restore.addEventListener('click', () => {
        removeFromModified(assignment.id)
        saveModified()
        body.innerHTML = assignment.body
        edits.classList.remove('notEmpty')
        if (document.body.getAttribute('data-view') === '1')  resize()
    })
    edits.appendChild(restore)
    e.appendChild(edits)

    const mods = element('div', ['mods'])
    recentActivity().forEach((a) => {
        if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
        const te = element('div', ['innerActivity', 'assignmentItem', assignment.baseType],
                           `<i class='material-icons'>edit</i>
                            <span class='title'>${dateString(new Date(a[2]))}</span>
                            <span class='additions'></span><span class='deletions'></span>`,
                           `ia${assignment.id}`)
        const d = dmp.diff_main(a[1].body, assignment.body)
        dmp.diff_cleanupSemantic(d)
        populateAddedDeleted(d, te)

        if (assignment.class) te.setAttribute('data-class', data.classes[assignment.class])
        te.appendChild(element('div', 'iaDiff', dmp.diff_prettyHtml(d)))
        te.addEventListener('click', () => {
            te.classList.toggle('active')
            if (document.body.getAttribute('data-view') === '1') resize()
        })
        mods.appendChild(te)
        }
    })
    e.appendChild(mods)

    if ((localStorageRead('assignmentSpan') === 'multiple') && (start < split.start)) {
        e.classList.add('fromWeekend')
    }
    if ((localStorageRead('assignmentSpan') === 'multiple') && (end > split.end)) {
        e.classList.add('overWeekend')
    }
    e.classList.add(`s${split.start.getDay()}`)
    if (split.end !== 'Forever') e.classList.add(`e${6 - split.end.getDay()}`)

    const st = Math.floor(split.start.getDate() / 1000 / 3600 / 24)
    if (split.assignment.end === 'Forever') {
        if (st <= (today() + getListDateOffset())) {
            e.classList.add('listDisp')
        }
    } else {
        const midDate = new Date()
        midDate.setDate(midDate.getDate() + getListDateOffset())
        const push = (assignment.baseType === 'test' && assignment.start === st) ? localStorageRead('earlyTest') : 0
        const endExtra = getListDateOffset() === 0 ? getTimeAfter(midDate) : 24 * 3600 * 1000
        if (fromDateNum(st - push) <= midDate &&
            (split.end === 'Forever' || midDate.getTime() <= split.end.getTime() + endExtra)) {
            e.classList.add('listDisp')
        }
    }

    // Add click interactivity
    if (!split.custom || !JSON.parse(localStorage.sepTasks)) {
        e.addEventListener('click', (evt) => {
            if ((document.getElementsByClassName('full').length === 0) &&
                (document.body.getAttribute('data-view') === '0')) {
                e.classList.remove('anim')
                e.classList.add('modify')
                e.style.top = (e.getBoundingClientRect().top - document.body.scrollTop
                            - cssNumber(e.style.marginTop)) + 44 + 'px'
                e.setAttribute('data-top', e.style.top)
                document.body.style.overflow = 'hidden'
                const back = elemById('background')
                back.classList.add('active')
                back.style.display = 'block'
                e.classList.add('anim')
                forceLayout(e)
                e.classList.add('full')
                e.style.top = (75 - cssNumber(e.style.marginTop)) + 'px'
                setTimeout(() => e.classList.remove('anim'), 350)
            }
        })
    }

    return e
}

// In order to display an assignment in the correct X position, classes with names eX and eX are
// used, where X is the number of squares to from the assignment to the left/right side of the
// screen. The function below determines which eX and sX class the given element has.
export function getES(el: HTMLElement): [string, string] {
    let e = 0
    let s = 0

    Array.from(new Array(7), (_, x) => x).forEach((x) => {
        if (el.classList.contains(`e${x}`)) {
            e = x
        }
        if (el.classList.contains(`s${x}`)) {
            s = x
        }
    })
    return [`e${e}`, `s${s}`]
}

// Below is a function to close the current assignment that is opened.
export function closeOpened(evt: Event): void {
    evt.stopPropagation()
    const el = document.querySelector('.full') as HTMLElement|null
    if (el == null) return

    el.style.top = el.getAttribute('data-top')
    el.classList.add('anim')
    el.classList.remove('full')
    el.scrollTop = 0
    document.body.style.overflow = 'auto'
    const back = elemById('background')
    back.classList.remove('active')
    setTimeout(() => {
        back.style.display = 'none'
        el.classList.remove('anim')
        el.classList.remove('modify')
        el.style.top = 'auto'
        forceLayout(el)
        el.classList.add('anim')
    }, 1000)
}
