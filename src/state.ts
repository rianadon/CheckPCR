import { IApplicationData } from './pcr'
import { ActivityItem } from './plugins/activity'
import { IAthenaData } from './plugins/athena'
import { ICustomAssignment } from './plugins/customAssignments'
import { IModifiedBodies } from './plugins/modifiedAssignments'
import { localStorageRead, localStorageWrite } from './util'

/**
 * In rewriting Check PCR, I've decided to consolidate all settings and view
 * parameters into a single store. Think Redux or Vuex (though way fewer
 * features). Hopefully this will make it easier to debug as I can more easily
 * reproduce states, and I may be able to implement some kind of settings sync
 * easier.
 *
 * The architecture of this is as follows:
 *
 * Each state item is a member of the IStateItem interface. These interfaces can
 * be returned by composing multiple functions, each giving the state item
 * special properties. For example, It can be saved in local storage and syned
 * between sessions.
 */

interface IStateItem<V> {
    get(): V
    set(value: V): void
}

interface IBackedStateItem<V> extends IStateItem<V> {
    /** Set a value without updating the store */
    localSet(value: V): void,
    /** Refreshes state from backed store */
    revert(): void,
    /** Forces a write of the state back to the store */
    forceUpdate(): void,
}

class CachedState<V> implements IStateItem<V> {
    constructor(private value: V) {}
    public set(value: V): void { this.value = value }
    public get(): V { return this.value }
}

/**
 * Back a given state to localStorage
 */
function storedState<V>(name: string, statevar: IStateItem<V>): IBackedStateItem<V> {
    statevar.set(localStorageRead(name, () => statevar.get()))
    return {
        get(): V { return statevar.get() },
        set(value: V): void {
            localStorageWrite(name, value)
            return statevar.set(value)
        },
        localSet(value: V): void {
            return statevar.set(value)
        },
        revert(): void {
            statevar.set(localStorageRead(name, () => statevar.get()))
        },
        forceUpdate(): void {
            localStorageWrite(name, statevar.get())
        }
    }
}

// Definitions for various types
type AssignmentSpan = 'multiple' | 'start' | 'end'
type HideAssignments = 'day' | 'ms' | 'us'
type ColorType = 'assignment' | 'class'
interface IShownActivity {
    add: boolean
    edit: boolean
    delete: boolean
}

export const state = {

    /** Offset from today of the date displayed in list view */
    listDateOffset: new CachedState(0),

    /** Offset from today of the month displayed in calendar view */
    calDateOffset: new CachedState(0),

    /** Data fetched from PCR */
    data: storedState('data', new CachedState<IApplicationData|undefined>(undefined)),

    /** The last time an update was attempted from PCR (irregardless of success) */
    lastTriedUpdate: new CachedState(0),

    /** The last time data was succesfully fetched from PCR */
    lastUpdate: storedState('lastUpdate', new CachedState(0)),

    /** Recorded changes to assignments */
    activity: storedState('activity', new CachedState<ActivityItem[]>([])),

    /** Data on classes */
    athenaData: storedState('athenaData', new CachedState<IAthenaData|null>(null)),

    /** Assignments marked as done */
    done: storedState('done', new CachedState<string[]>([])),

    /** Modifications made to assignments */
    modified: storedState('modified', new CachedState<IModifiedBodies>({})),

    /** The last fetched commit to the news gist */
    lastNewsCommit: storedState('newsCommit', new CachedState<string|null>(null)),

    /** The detected url to the news gist */
    newsUrl: new CachedState<string|null>(null),

    /** Custom assignments */
    extra: storedState('extra', new CachedState<ICustomAssignment[]>([])),

    //////////////////////////////////
    //           Settings           //
    //////////////////////////////////

    /**
     * Minutes between each automatic refresh of the page. Negative numbers indicate no automatic
     * refreshing.
     */
    refreshRate: storedState('refreshRate', new CachedState(-1)),

    /**
     * Whether the window should refresh assignment data when focussed
     */
    refreshOnFocus: storedState('refreshOnFocus', new CachedState(true)),

    /**
     * Whether switching between views should be animated
     */
    viewTrans: storedState('viewTrans', new CachedState(true)),

    /**
     * Number of days early to show tests in list view
     */
    earlyTest: storedState('earlyTest', new CachedState<number>(1)),

    /**
     * Whether to take tasks off the calendar view and show them in the info pane
     */
    sepTasks: storedState('sepTasks', new CachedState<boolean>(false)),

    /**
     * Whether tasks should have their own color
     */
    sepTaskClass: storedState('sepTaskClass', new CachedState<boolean>(false)),

    /**
     * Whether projects show up in the test page
     */
    projectsInTestPane: storedState('projectsInTestPane', new CachedState<boolean>(false)),

    /**
     * When assignments should be shown on calendar view
     */
    assignmentSpan: storedState('assignmentSpan', new CachedState<AssignmentSpan>('multiple')),

    /**
     * When assignments should disappear from list view
     */
    hideAssignments: storedState('hideAssignments', new CachedState<HideAssignments>('day')),

    /**
     * Whether to use holiday theming
     */
    holidayThemes: storedState('holidayThemes', new CachedState<boolean>(false)),

    /**
     * Whether to color assignments based on their type or class
     */
    colorType: storedState('colorType', new CachedState<ColorType>('assignment')),

    /**
     * Which types of activity are shown in the activity pane
     */
    shownActivity: storedState('shownActivity', new CachedState<IShownActivity>({
      add: true,
        edit: true,
        delete: true
    })),

    /**
     * Whether to display tasks in the task pane that are completed
     */
    showDoneTasks: storedState('showDoneTasks', new CachedState<boolean>(false))
}

export function getStateItem(name: string): IStateItem<any> {
    if (!state.hasOwnProperty(name)) throw new Error(`Invalid state property ${name}`)
    // @ts-ignore
    return state[name]
}

/////////////////////////////////////////
//           Generic helpers           //
/////////////////////////////////////////

export function incrementState(statevar: IStateItem<number>): void {
    statevar.set(statevar.get() + 1)
}

export function decrementState(statevar: IStateItem<number>): void {
    statevar.set(statevar.get() - 1)
}

//////////////////////////////////////////
//           Specific helpers           //
//////////////////////////////////////////

export function zeroDateOffsets(): void {
    state.listDateOffset.set(0)
    state.calDateOffset.set(0)
}
