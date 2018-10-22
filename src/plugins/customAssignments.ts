import { IApplicationData, IAssignment } from '../pcr'
import { state } from '../state'

export interface ICustomAssignment {
    body: string
    done: boolean
    start: number
    class: string|null
    end: number|'Forever'
}
export function addToExtra(custom: ICustomAssignment): void {
    state.extra.get().push(custom)
}

export function removeFromExtra(custom: ICustomAssignment): void {
    const extra = state.extra.get()
    if (!extra.includes(custom)) throw new Error('Cannot remove custom assignment that does not exist')
    extra.splice(extra.indexOf(custom), 1)
}

export function extraToTask(custom: ICustomAssignment, data: IApplicationData): IAssignment {
    let cls: number|null = null
    const className = custom.class
    if (className != null) {
        cls = data.classes.findIndex((c) => c.toLowerCase().includes(className))
    }

    return {
        title: 'Task',
        baseType: 'task',
        type: 'task',
        attachments: [],
        start: custom.start,
        end: custom.end || 'Forever',
        body: custom.body,
        id: `task${custom.body}${custom.start}${custom.end}${custom.class}`.replace(/[^\w]*/g, ''),
        class: cls === -1 ? null : cls
    }
}

interface IParseResult {
    text: string
    cls?: string
    due?: string
    st?: string
}

export function parseCustomTask(text: string, result: IParseResult = { text: '' }): IParseResult {
    const parsed = text.match(/(.*) (for|by|due|assigned|starting|ending|beginning) (.*)/)
    if (parsed == null) {
        result.text = text
        return result
    }

    switch (parsed[2]) {
        case 'for': result.cls = parsed[3]; break
        case 'by': case 'due': case 'ending': result.due = parsed[3]; break
        case 'assigned': case 'starting': case 'beginning': result.st = parsed[3]; break
    }

    return parseCustomTask(parsed[1], result)
}
