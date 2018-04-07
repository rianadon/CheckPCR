let listDateOffset = 0

export function getListDateOffset(): number {
    return listDateOffset
}

export function zeroListDateOffset(): void {
    listDateOffset = 0
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
