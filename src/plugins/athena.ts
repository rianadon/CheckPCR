import { state } from '../state'
import { elemById } from '../util'

interface IRawAthenaData {
    response_code: 200
    body: {
        courses: {
            courses: IRawCourse[]
            sections: IRawSection[]
        }
    }
    permissions: any
}

interface IRawCourse {
    nid: number
    course_title: string
    // There's a bunch more that I've omitted
}

interface IRawSection {
    course_nid: number
    link: string
    logo: string
    section_title: string
    // There's a bunch more that I've omitted
}

export interface IAthenaDataItem {
    link: string
    logo: string
    period: string
}

export interface IAthenaData {
    [cls: string]: IAthenaDataItem
}

function formatLogo(logo: string): string {
    return logo.substr(0, logo.indexOf('" alt="'))
                .replace('<div class="profile-picture"><img src="', '')
                .replace('tiny', 'reg')
}

// Now, there's the schoology/athena integration stuff. First, we need to check if it's been more
// than a day. There's no point constantly retrieving classes from Athena; they dont't change that
// much.

// Then, once the variable for the last date is initialized, it's time to get the classes from
// athena. Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any
// better! Seriously! It's just too bad the login page isn't in JSON.
function parseAthenaData(dat: string): IAthenaData|null {
    if (dat === '') return null
    const d = JSON.parse(dat) as IRawAthenaData
    const athenaData2: IAthenaData = {}
    const allCourseDetails: { [nid: number]: IRawSection } = {}
    d.body.courses.sections.forEach((section) => {
        allCourseDetails[section.course_nid] = section
    })
    d.body.courses.courses.reverse().forEach((course) => {
        const courseDetails = allCourseDetails[course.nid]
        athenaData2[course.course_title] = {
            link: `https://athena.harker.org${courseDetails.link}`,
            logo: formatLogo(courseDetails.logo),
            period: courseDetails.section_title
        }
    })
    return athenaData2
}

export function updateAthenaData(data: string): void {
    const refreshEl = document.getElementById('athenaDataRefresh')
    try {
        state.athenaData.set(parseAthenaData(data))
        elemById('athenaDataError').style.display = 'none'
        if (refreshEl) refreshEl.style.display = 'block'
    } catch (e) {
        elemById('athenaDataError').style.display = 'block'
        if (refreshEl) refreshEl.style.display = 'none'
        elemById('athenaDataError').innerHTML = e.message
    }
}
