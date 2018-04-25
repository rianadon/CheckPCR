import { localStorageRead, localStorageWrite } from '../util'

const DONE_STORAGE_NAME = 'done'

const done: string[] = localStorageRead(DONE_STORAGE_NAME, [])

export function removeFromDone(id: string): void {
    const index = done.indexOf(id)
    if (index >= 0) done.splice(index, 1)
}

export function addToDone(id: string): void {
    done.push(id)
}

export function saveDone(): void {
    localStorageWrite(DONE_STORAGE_NAME, done)
}

export function assignmentInDone(id: string): boolean {
    return done.includes(id)
}
