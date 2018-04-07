import { _$ } from '../util'

// For list view, the assignments can't be on top of each other.
// Therefore, a listener is attached to the resizing of the browser window.
let ticking = false
let timeoutId: number|null = null
export function getResizeAssignments(): HTMLElement[] {
    const assignments = Array.from(document.querySelectorAll(document.body.classList.contains('showDone') ?
        '.assignment.listDisp' : '.assignment.listDisp:not(.done)'))
    assignments.sort((a, b) => {
        const ad = a.classList.contains('done')
        const bd = b.classList.contains('done')
        if (ad && !bd) { return 1 }
        if (bd && !ad) { return -1 }
        return Number((a.querySelector('.due') as HTMLInputElement).value)
             - Number((b.querySelector('.due') as HTMLInputElement).value)
    })
    return assignments as HTMLElement[]
}

export function resizeCaller(): void {
    if (!ticking) {
        requestAnimationFrame(resize)
        ticking = true
    }
}

export function resize(): void {
    ticking = true
    // To calculate the number of columns, the below algorithm is used becase as the screen size
    // increases, the column width increases
    const widths = document.body.classList.contains('showInfo') ?
        [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800]
    let columns = 1
    widths.forEach((w, index) => {
        if (window.innerWidth > w) { columns = index + 1 }
    })
    const columnHeights = Array.from(new Array(columns), () => 0)
    const cch: number[] = []
    const assignments = getResizeAssignments()
    assignments.forEach((assignment, n) => {
        const col = n % columns
        cch.push(columnHeights[col])
        columnHeights[col] += assignment.offsetHeight + 24
    })
    assignments.forEach((assignment, n) => {
        const col = n % columns
        assignment.style.top = cch[n] + 'px'
        assignment.style.left = ((100 / columns) * col) + '%'
        assignment.style.right = ((100 / columns) * (columns - col - 1)) + '%'
    })
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        cch.length = 0
        assignments.forEach((assignment, n) => {
            const col = n % columns
            if (n < columns) {
                columnHeights[col] = 0
            }
            cch.push(columnHeights[col])
            columnHeights[col] += assignment.offsetHeight + 24
        })
        assignments.forEach((assignment, n) => {
            assignment.style.top = cch[n] + 'px'
        })
    }, 500)
    ticking = false
}