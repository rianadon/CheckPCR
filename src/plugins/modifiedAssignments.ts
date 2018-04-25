import { localStorageRead, localStorageWrite } from '../util'

const MODIFIED_STORAGE_NAME = 'modified'

interface IModifiedBodies {
    [id: string]: string
}

const modified: IModifiedBodies = localStorageRead(MODIFIED_STORAGE_NAME, {})

export function removeFromModified(id: string): void {
    delete modified[id]
}

export function saveModified(): void {
    localStorageWrite(MODIFIED_STORAGE_NAME, modified)
}

export function assignmentInModified(id: string): boolean {
    return modified.hasOwnProperty(id)
}

export function modifiedBody(id: string): string|undefined {
    return modified[id]
}

export function setModified(id: string, body: string): void {
    modified[id] = body
}
