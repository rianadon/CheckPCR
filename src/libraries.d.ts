type DiffOutput = Array<[number, string]>

declare class diff_match_patch {
    diff_main(a: string, b: string): DiffOutput
    diff_cleanupSemantic(diff: DiffOutput): void
    diff_prettyHtml(diff: DiffOutput): string
}

declare class Headroom {
    constructor(el: HTMLElement, options: {
        tolerance?: number
        offset?: number
    })
    init(): void
}

declare namespace Hammer {
    const defaults: {
        cssProps: {
            userSelect: any
        }
    }

    type Action = string
    type Direction = string

    const Pan: string
    const DIRECTION_HORIZONTAL: string

    class Manager {
        constructor(el: Element, options: {
            recognizers: Array<[Action, { direction: Direction }]>
        })
    }
}

interface HammerPointerEvent extends Event {
    pointerType: string
    center: { x: number, y: number }
    velocityX: number
    velocityY: number
}

declare class Hammer {
    constructor(element: HTMLElement)

    on(type: 'pan', listener: (e: HammerPointerEvent) => void): void
    on(type: 'panend', listener: (e: HammerPointerEvent) => void): void
    on(type: 'tap', listener: (e: Event) => void): void
}

declare class TinyColor {
    constructor(color: string)
    darken(percent: number): TinyColor
    toHexString(): string
}
declare function tinycolor(color: string): TinyColor

declare namespace tinycolor {
    function mix(color1: string, color2: string, amount: number): TinyColor
}

declare namespace chrono {
    function parseDate(str: string): Date
}
