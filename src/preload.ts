/**
 * Fast snippets that run before the all HTML gets loaded.
 */
if (JSON.parse(localStorage.getItem('dark') || 'false')) document.body.classList.add('dark')
if (JSON.parse(localStorage.getItem('showInfo') || 'false')) document.body.classList.add('showInfo')
document.body.setAttribute('data-view', JSON.parse(localStorage.getItem('view') || '0'))
