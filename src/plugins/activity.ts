import { addActivityElement, createActivity } from '../components/activity'
import { IAssignment } from '../pcr'
import { state } from '../state'

export type ActivityType = 'delete' | 'edit' | 'add'
export type ActivityItem = [ActivityType, IAssignment, number, string | undefined]

export function addActivity(type: ActivityType, assignment: IAssignment, date: Date,
                            newActivity: boolean, className?: string ): void {
    if (state.calDateOffset.get() !== 0) return // Ignore activity when on another month
    if (newActivity) state.activity.get().push([type, assignment, Date.now(), className])
    const el = createActivity(type, assignment, date, className)
    addActivityElement(el)
}

export function saveActivity(): void {
    const activity = state.activity.get()
    state.activity.set(activity.slice(activity.length - 128, activity.length))
}

export function recentActivity(): ActivityItem[] {
    const activity = state.activity.get()
    return activity.slice(activity.length - 32, activity.length)
}
