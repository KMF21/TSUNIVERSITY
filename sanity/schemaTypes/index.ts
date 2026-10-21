import post from './post'
import event from './event'
import faculty from './faculty'
import department from './department'
import leadershipProfile from './leadershipProfile'
import page from './page'
import siteSettings from './siteSettings'
import contactPage from './contactPage'
import tetfundIntervention from './tetfundIntervention'
import studentLifeCategory from './studentLifeCategory'
import academicCalendarEntry from './academicCalendarEntry'
import staffMember from './staffMember'
import institutionalFacts from './institutionalFacts'
import rankingsPage from './rankingsPage'
import tetfundResearch from './tetfundResearch'
import statisticIndicator from './statisticIndicator'
import conference from './conference'
import proceedings from './proceedings'
import {conferenceObjectTypes} from './conferenceObjects'

export const schemaTypes = [
  post,
  event,
  faculty,
  department,
  leadershipProfile,
  page,
  siteSettings,
  contactPage,
  tetfundIntervention,
  studentLifeCategory,
  academicCalendarEntry,
  staffMember,
  institutionalFacts,
  rankingsPage,
  tetfundResearch,
  statisticIndicator,
  conference,
  proceedings,
  ...conferenceObjectTypes,
]
