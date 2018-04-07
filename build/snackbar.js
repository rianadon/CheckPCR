"use strict";
/**
 * All this is responsible for is creating snackbars.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
function snackbar(message, action, f) {
    const snack = util_1.element('div', 'snackbar');
    const snackInner = util_1.element('div', 'snackInner', message);
    snack.appendChild(snackInner);
    if ((action != null) && (f != null)) {
        const actionE = util_1.element('a', [], action);
        actionE.addEventListener('click', () => {
            snack.classList.remove('active');
            f();
        });
        snackInner.appendChild(actionE);
    }
    const add = () => {
        document.body.appendChild(snack);
        util_1.forceLayout(snack);
        snack.classList.add('active');
        setTimeout(() => {
            snack.classList.remove('active');
            setTimeout(() => snack.remove(), 900);
        }, 5000);
    };
    const existing = document.querySelector('.snackbar');
    if (existing != null) {
        existing.classList.remove('active');
        setTimeout(add, 300);
    }
    else {
        add();
    }
}
exports.snackbar = snackbar;
