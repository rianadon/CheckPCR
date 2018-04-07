/**
 * All this is responsible for is creating snackbars.
 */

import { element, forceLayout } from '../util'

/**
 * Creates a snackbar without an action
 * @param message The snackbar's message
 */
export function snackbar(message: string): void
/**
 * Creates a snackbar with an action
 * @param message The snackbar's message
 * @param action Optional text to show as a message action
 * @param f      A function to execute when the action is clicked
 */
export function snackbar(message: string, action: string, f: () => void): void
export function snackbar(message: string, action?: string, f?: () => void): void {
    const snack = element('div', 'snackbar')
    const snackInner = element('div', 'snackInner', message)
    snack.appendChild(snackInner)

    if ((action != null) && (f != null)) {
        const actionE = element('a', [], action)
        actionE.addEventListener('click', () => {
            snack.classList.remove('active')
            f()
        })
        snackInner.appendChild(actionE)
    }

    const add = () => {
      document.body.appendChild(snack)
      forceLayout(snack)
      snack.classList.add('active')
      setTimeout(() => {
          snack.classList.remove('active')
          setTimeout(() => snack.remove(), 900)
      }, 5000)
    }

    const existing = document.querySelector('.snackbar')
    if (existing != null) {
        existing.classList.remove('active')
        setTimeout(add, 300)
    } else {
        add()
    }
}
