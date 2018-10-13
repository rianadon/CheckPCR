import { elemById, localStorageRead } from '../util'

// Then, the username in the sidebar needs to be set and we need to generate an "avatar" based on
// initials. To do that, some code to convert from LAB to RGB colors is borrowed from
// https://github.com/boronine/colorspaces.js
//
// LAB is a color naming scheme that uses two values (A and B) along with a lightness value in order
// to produce colors that are equally spaced between all of the colors that can be seen by the human
// eye. This works great because everyone has letters in his/her initials.

// The D65 standard illuminant
const REF_X = 0.95047
const REF_Y = 1.00000
const REF_Z = 1.08883

// CIE L*a*b* constants
const LAB_E = 0.008856
const LAB_K = 903.3

const M = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758,  0.0415],
    [0.0557, -0.2040,  1.0570]
]

const fInv = (t: number) => {
    if (Math.pow(t, 3) > LAB_E) {
    return Math.pow(t, 3)
    } else {
    return ((116 * t) - 16) / LAB_K
    }
}
const dotProduct = (a: number[], b: number[]) => {
    let ret = 0
    a.forEach((_, i) => {
        ret += a[i] * b[i]
    })
    return ret
}
const fromLinear = (c: number) => {
    const a = 0.055
    if (c <= 0.0031308) {
        return 12.92 * c
    } else {
        return (1.055 * Math.pow(c, 1 / 2.4)) - 0.055
    }
}

function labrgb(l: number, a: number, b: number): string {
    const varY = (l + 16) / 116
    const varZ = varY - (b / 200)
    const varX = (a / 500) + varY
    const _X = REF_X * fInv(varX)
    const _Y = REF_Y * fInv(varY)
    const _Z = REF_Z * fInv(varZ)

    const tuple = [_X, _Y, _Z]

    const _R = fromLinear(dotProduct(M[0], tuple))
    const _G = fromLinear(dotProduct(M[1], tuple))
    const _B = fromLinear(dotProduct(M[2], tuple))

    // Original from here
    const n = (v: number) => Math.round(Math.max(Math.min(v * 256, 255), 0))
    return `rgb(${n(_R)}, ${n(_G)}, ${n(_B)})`
}

/**
 * Convert a letter to a float valued from 0 to 255
 */
function letterToColorVal(letter: string): number {
    return (((letter.charCodeAt(0) - 65) / 26) * 256) - 128
}

// The function below uses this algorithm to generate a background color for the initials displayed in the sidebar.
export function updateAvatar(): void {
    if (!localStorageRead('username')) return
    const userEl = document.getElementById('user')
    const initialsEl = document.getElementById('initials')
    if (!userEl || !initialsEl) return

    userEl.innerHTML = localStorageRead('username')
    const initials = localStorageRead('username').match(/\d*(.).*?(.$)/) // Separate year from first name and initial
    if (initials != null) {
        const bg = labrgb(50, letterToColorVal(initials[1]), letterToColorVal(initials[2])) // Compute the color
        initialsEl.style.backgroundColor = bg
        initialsEl.innerHTML = initials[1] + initials[2]
    }
}
