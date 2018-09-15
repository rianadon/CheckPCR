import { state } from '../state'
import { localStorageWrite } from '../util'

export interface IModifiedBodies {
    [id: string]: string
}

export function removeFromModified(id: string): void {
    delete state.modified.get()[id]
}

export function saveModified(): void {
    state.modified.forceUpdate()
}

export function assignmentInModified(id: string): boolean {
    return state.modified.get().hasOwnProperty(id)
}

export function modifiedBody(id: string): string|undefined {
    return state.modified.get()[id]
}

export function setModified(id: string, body: string): void {
    state.modified.get()[id] = body
}
