import { elemById, localStorageRead, localStorageWrite } from '../util';
const ATHENA_STORAGE_NAME = 'athenaData';
let athenaData = localStorageRead(ATHENA_STORAGE_NAME);
export function getAthenaData() {
    return athenaData;
}
function formatLogo(logo) {
    return logo.substr(0, logo.indexOf('" alt="'))
        .replace('<div class="profile-picture"><img src="', '')
        .replace('tiny', 'reg');
}
// Now, there's the schoology/athena integration stuff. First, we need to check if it's been more
// than a day. There's no point constantly retrieving classes from Athena; they dont't change that
// much.
// Then, once the variable for the last date is initialized, it's time to get the classes from
// athena. Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any
// better! Seriously! It's just too bad the login page isn't in JSON.
function parseAthenaData(dat) {
    if (dat === '')
        return null;
    const d = JSON.parse(dat);
    const athenaData2 = {};
    const allCourseDetails = {};
    d.body.courses.sections.forEach((section) => {
        allCourseDetails[section.course_nid] = section;
    });
    d.body.courses.courses.reverse().forEach((course) => {
        const courseDetails = allCourseDetails[course.nid];
        athenaData2[course.course_title] = {
            link: `https://athena.harker.org${courseDetails.link}`,
            logo: formatLogo(courseDetails.logo),
            period: courseDetails.section_title
        };
    });
    return athenaData2;
}
export function updateAthenaData(data) {
    try {
        athenaData = parseAthenaData(data);
        localStorageWrite(ATHENA_STORAGE_NAME, data);
        elemById('athenaDataError').style.display = 'none';
        elemById('athenaDataRefresh').style.display = 'block';
    }
    catch (e) {
        elemById('athenaDataError').style.display = 'block';
        elemById('athenaDataRefresh').style.display = 'none';
        elemById('athenaDataError').innerHTML = e.message;
    }
}
