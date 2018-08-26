import { addActivityElement, createActivity } from '../components/activity'
import { getCalDateOffset } from '../navigation'
import { IAssignment } from '../pcr'
import { localStorageRead, localStorageWrite } from '../util'

export type ActivityType = 'delete' | 'edit' | 'add'
export type ActivityItem = [ActivityType, IAssignment, number, string | undefined]

const ACTIVITY_STORAGE_NAME = 'activity'

let activity: ActivityItem[] = localStorageRead(ACTIVITY_STORAGE_NAME) || []

export function addActivity(type: ActivityType, assignment: IAssignment, date: Date,
                            newActivity: boolean, className?: string ): void {
    if (getCalDateOffset() !== 0) return // Ignore activity when on another month
    if (newActivity) activity.push([type, assignment, Date.now(), className])
    const el = createActivity(type, assignment, date, className)
    addActivityElement(el)
}

export function saveActivity(): void {
    activity = activity.slice(activity.length - 128, activity.length)
    localStorageWrite(ACTIVITY_STORAGE_NAME, activity)
}

export function recentActivity(): ActivityItem[] {
    return activity.slice(activity.length - 32, activity.length)
}
