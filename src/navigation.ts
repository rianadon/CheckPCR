let listDateOffset = 0
let calDateOffset = 0

export function getListDateOffset(): number {
    return listDateOffset
}

export function incrementListDateOffset(): void {
    listDateOffset += 1
}

export function decrementListDateOffset(): void {
    listDateOffset -= 1
}

export function setListDateOffset(offset: number): void {
    listDateOffset = offset
}

export function getCalDateOffset(): number {
    return calDateOffset
}

export function incrementCalDateOffset(): void {
    calDateOffset += 1
}

export function decrementCalDateOffset(): void {
    calDateOffset -= 1
}

export function setCalDateOffset(offset: number): void {
    calDateOffset = offset
}

export function zeroDateOffsets(): void {
    listDateOffset = 0
    calDateOffset = 0
}
