import { state } from '../state'
import { localStorageWrite } from '../util'

const DONE_STORAGE_NAME = 'done'

export function removeFromDone(id: string): void {
    const index = state.done.get().indexOf(id)
    if (index >= 0) state.done.get().splice(index, 1)
}

export function addToDone(id: string): void {
    state.done.get().push(id)
}

export function saveDone(): void {
    state.done.forceUpdate()
}

export function assignmentInDone(id: string): boolean {
    return state.done.get().includes(id)
}
