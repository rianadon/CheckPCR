import { addActivityElement, createActivity } from '../components/activity';
import { localStorageRead, localStorageWrite } from '../util';
const ACTIVITY_STORAGE_NAME = 'activity';
let activity = localStorageRead(ACTIVITY_STORAGE_NAME) || [];
export function addActivity(type, assignment, date, newActivity, className) {
    if (newActivity)
        activity.push([type, assignment, Date.now(), className]);
    const el = createActivity(type, assignment, date, className);
    addActivityElement(el);
}
export function saveActivity() {
    activity = activity.slice(activity.length - 128, activity.length);
    localStorageWrite(ACTIVITY_STORAGE_NAME, activity);
}
export function recentActivity() {
    return activity.slice(activity.length - 32, activity.length);
}
