import { localStorageRead, localStorageWrite } from './util'

type AssignmentSpan = 'multiple' | 'start' | 'end'
type HideAssignments = 'day' | 'ms' | 'us'
type ColorType = 'assignment' | 'class'
interface IShownActivity {
    add: boolean
    edit: boolean
    delete: boolean
}

export const settings = {
    /**
     * Minutes between each automatic refresh of the page. Negative numbers indicate no automatic
     * refreshing.
     */
    get refreshRate(): number { return localStorageRead('refreshRate', -1) },
    set refreshRate(v: number) { localStorageWrite('refreshRate', v) },

    /**
     * Whether the window should refresh assignment data when focussed
     */
    get refreshOnFocus(): boolean { return localStorageRead('refreshOnFocus', true) },
    set refreshOnFocus(v: boolean) { localStorageWrite('refreshOnFocus', v) },

    /**
     * Whether switching between views should be animated
     */
    get viewTrans(): boolean { return localStorageRead('viewTrans', true) },
    set viewTrans(v: boolean) { localStorageWrite('viewTrans', v) },

    /**
     * Number of days early to show tests in list view
     */
    get earlyTest(): number { return localStorageRead('earlyTest', 1) },
    set earlyTest(v: number) { localStorageWrite('earlyTest', v) },

    /**
     * Whether to take tasks off the calendar view and show them in the info pane
     */
    get sepTasks(): boolean { return localStorageRead('sepTasks', false) },
    set sepTasks(v: boolean) { localStorageWrite('sepTasks', v) },

    /**
     * Whether tasks should have their own color
     */
    get sepTaskClass(): boolean { return localStorageRead('sepTaskClass', false) },
    set sepTaskClass(v: boolean) { localStorageWrite('sepTaskClass', v) },

    /**
     * Whether projects show up in the test page
     */
    get projectsInTestPane(): boolean { return localStorageRead('projectsInTestPane', false) },
    set projectsInTestPane(v: boolean) { localStorageWrite('projectsInTestPane', v) },

    /**
     * When assignments should be shown on calendar view
     */
    get assignmentSpan(): AssignmentSpan { return localStorageRead('assignmentSpan', 'multiple') },
    set assignmentSpan(v: AssignmentSpan) { localStorageWrite('assignmentSpan', v) },

    /**
     * When assignments should disappear from list view
     */
    get hideAssignments(): HideAssignments { return localStorageRead('hideAssignments', 'day') },
    set hideAssignments(v: HideAssignments) { localStorageWrite('hideAssignments', v) },

    /**
     * Whether to use holiday theming
     */
    get holidayThemes(): boolean { return localStorageRead('holidayThemes', false) },
    set holidayThemes(v: boolean) { localStorageWrite('holidayThemes', v) },

    /**
     * Whether to color assignments based on their type or class
     */
    get colorType(): ColorType { return localStorageRead('colorType', 'assignment') },
    set colorType(v: ColorType) { localStorageWrite('colorType', v) },

    /**
     * Which types of activity are shown in the activity pane
     */
    get shownActivity(): IShownActivity { return localStorageRead('shownActivity', {
        add: true,
        edit: true,
        delete: true
    }) },
    set shownActivity(v: IShownActivity) { localStorageWrite('shownActivity', v) },

    /**
     * Whether to display tasks in the task pane that are completed
     */
    get showDoneTasks(): boolean { return localStorageRead('showDoneTasks', false) },
    set showDoneTasks(v: boolean) { localStorageWrite('showDoneTasks', v) }
}
