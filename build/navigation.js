let listDateOffset = 0;
export function getListDateOffset() {
    return listDateOffset;
}
export function zeroListDateOffset() {
    listDateOffset = 0;
}
export function incrementListDateOffset() {
    listDateOffset += 1;
}
export function decrementListDateOffset() {
    listDateOffset -= 1;
}
export function setListDateOffset(offset) {
    listDateOffset = offset;
}
