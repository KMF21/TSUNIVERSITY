// Centralized GROQ queries. Keeping these in one file means every route
// fetches data the same shape, and changing a field only requires editing
// it here rather than hunting through every page component.

export const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...4]{
  _id, title, slug, excerpt, mainImage, category, publishedAt,
  "authorName": coalesce(author->name, authorNameOverride)
}`

export const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id, title, slug, excerpt, mainImage, category, publishedAt,
  "authorName": coalesce(author->name, authorNameOverride)
}`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, body, mainImage, category, publishedAt,
  "authorName": coalesce(author->name, authorNameOverride),
  "attachment": attachment.asset->{url, originalFilename, size},
  attachmentLabel
}`

export const UPCOMING_EVENTS_QUERY = `*[_type == "event" && startDateTime > now()] | order(startDateTime asc)[0...3]{
  _id, title, slug, eventType, startDateTime, location, capacity, summary, image
}`

export const ALL_UPCOMING_EVENTS_QUERY = `*[_type == "event" && startDateTime > now()] | order(startDateTime asc){
  _id, title, slug, eventType, startDateTime, location, capacity, summary, image, featured
}`

// Past events power the "highlights" showcase — most recent first, since
// that's what a visitor scrolling through past events actually wants to see.
export const PAST_EVENTS_QUERY = `*[_type == "event" && startDateTime <= now()] | order(startDateTime desc){
  _id, title, slug, eventType, startDateTime, location, capacity, summary, image, featured
}`

export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0]{
  _id, title, eventType, startDateTime, endDateTime, location, capacity, summary, image, gallery, registrationUrl
}`

export const STUDENT_LIFE_QUERY = `*[_type == "studentLifeCategory"] | order(order asc){
  _id, name, slug, category, coverImage, summary, description
}`

export const ACADEMIC_CALENDAR_QUERY = `*[_type == "academicCalendarEntry"] | order(startDate asc){
  _id, title, session, semester, category, startDate, endDate, isPlaceholder
}`

// Cross-content search. Each type has different field names for its
// "title" and "excerpt" — coalesce() picks whichever one that type has.
// facultySlug is only meaningful for departments, used to build their href.
export const SEARCH_QUERY = `*[
  _type in ["page", "post", "event", "faculty", "department", "studentLifeCategory", "staffMember", "rankingsPage", "tetfundResearch"] &&
  (
    title match $q + "*" ||
    name match $q + "*" ||
    excerpt match $q + "*" ||
    summary match $q + "*" ||
    specialization match $q + "*"
  )
][0...30]{
  _type,
  "title": coalesce(title, name),
  "slug": slug.current,
  "excerpt": coalesce(excerpt, summary, heroSubheading, specialization, publication, researchers),
  "facultySlug": faculty->slug.current
}`

export const STAFF_DIRECTORY_QUERY = `*[_type == "staffMember"] | order(department->name asc, order asc, name asc){
  _id, name, slug, title, staffType, photo, specialization,
  "department": department->{name, slug, "facultySlug": faculty->slug.current}
}`

export const STAFF_MEMBER_BY_SLUG_QUERY = `*[_type == "staffMember" && slug.current == $slug][0]{
  _id, name, title, staffType, photo, email, officeLocation, qualifications, specialization, bio,
  "department": department->{name, slug, "facultySlug": faculty->slug.current}
}`

export const ALL_FACULTIES_QUERY = `*[_type == "faculty"] | order(order asc){
  _id,
  name,
  slug,
  heroImage,
  deanName,
  "departmentCount": count(*[
    _type == "department" &&
    faculty._ref == ^._id
  ])
}`

export const FACULTY_BY_SLUG_QUERY = `*[_type == "faculty" && slug.current == $slug][0]{
  _id, name, deanName, deanMessage, overview, heroImage,
  "departments": departments[]->{_id, name, slug, hodName}
}`

export const DEPARTMENT_BY_SLUG_QUERY = `*[_type == "department" && slug.current == $slug && faculty->slug.current == $facultySlug][0]{
  _id, name, hodName, programsOffered, description,
  "faculty": faculty->{name, slug}
}`

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title, heroHeading, heroSubheading, heroImage, sections
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  heroImage, aboutImage
}`

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  cards[]{_key, label, lines[]{_key, kind, value}},
  map{embedUrl, latitude, longitude}
}`

export const LEADERSHIP_QUERY = `*[_type == "leadershipProfile" && category in ["principal-officer", "governing-council", "dean", "hod"]] | order(order asc){
  _id, name, slug, role, category, photo
}`


export const TETFUND_INTERVENTIONS_QUERY = `
  *[_type == "tetfundIntervention"]
  | order(order asc, year desc, _createdAt desc) {
    _id,
    title,
    category,
    description,
    mainImage {
      ...,
      alt
    },
    gallery[] {
      ...,
      alt,
      caption
    },
    year,
    location,
    status,
    featured,
    order
  }
`

export const FEATURED_TETFUND_INTERVENTIONS_QUERY = `
  *[
    _type == "tetfundIntervention" &&
    featured == true
  ]
  | order(order asc, year desc, _createdAt desc)[0...3] {
    _id,
    title,
    category,
    description,
    mainImage,
    gallery,
    year,
    location,
    status,
    featured,
    order
  }
`

export const ACADEMIC_CATALOG_QUERY = `
  *[_type == "faculty"] | order(order asc, name asc) {
    _id,
    name,
    slug,
    heroImage,

    "departments": *[
      _type == "department" &&
      faculty._ref == ^._id
    ] | order(name asc) {
      _id,
      name,
      slug,
      hodName,
      description,

      "programs": programsOffered[] {
        programName,
        level,
        duration
      }
    }
  }
`

export const INSTITUTIONAL_FACTS_QUERY = `*[_type == "institutionalFacts"][0]{
  stats, keyFacts, studentCommunity, studentCommunityNote
}`

export const RANKINGS_PAGE_QUERY = `*[_type == "rankingsPage"][0]{
  title, heroHeading, heroSubheading,
  rankingsIntro, rankings, rankingsMethodNote, highlights,
  strengthsIntro, researchStrengths,
  awardsIntro, awards,
  scholarsIntro, scholars,
  sources, lastUpdatedNote
}`

export const TETFUND_RESEARCH_QUERY = `*[_type == "tetfundResearch"]{
  _id, title, fundingType, fundingNote, researchers, year, publication,
  paperUrl, featured, summary, links[]{_key, label, url}, order
}`

export const STATISTIC_INDICATORS_LIST_QUERY = `*[_type == "statisticIndicator"] | order(order asc, indicatorNumber asc){
  _id, title, "slug": slug.current, indicatorNumber, summary, stats[0...3]
}`

export const STATISTIC_INDICATOR_BY_SLUG_QUERY = `*[_type == "statisticIndicator" && slug.current == $slug][0]{
  title, indicatorNumber, summary, stats,
  sections[]{
    ...,
    _type == "factsTable" => { heading, intro, columns, rows[]{cells, emphasis}, footerRow },
    _type == "barPanel" => { heading, bars[]{label, percent, displayValue} },
    _type == "note" => { tone, text, linkHref, linkLabel },
    _type == "richText" => { heading, body }
  },
  sourceNotes, lastUpdatedNote
}`

// ── Conferences & proceedings ────────────────────────────────────────────
// Shared projection for anywhere a conference appears as a card or list row.
const CONFERENCE_SUMMARY_FIELDS = `
  _id, title, shortName, edition, year, "slug": slug.current, series, theme,
  startDate, endDate, timezone, mode, featured, heroImage,
  "organiserName": coalesce(organiser->name, organiserOther),
  "organiserId": organiser._ref,
  "venueCity": venue.city, "venueName": venue.name,
  "importantDates": importantDates[]{_key, label, date, note},
  "hasProceedings": count(*[_type == "proceedings" && references(^._id)]) > 0
`

export const CONFERENCES_LIST_QUERY = `*[_type == "conference" && defined(slug.current)] | order(startDate desc){
  ${CONFERENCE_SUMMARY_FIELDS}
}`

export const FEATURED_CONFERENCES_QUERY = `*[_type == "conference" && defined(slug.current) && featured == true && endDate >= now()] | order(startDate asc)[0...3]{
  ${CONFERENCE_SUMMARY_FIELDS}
}`

export const CONFERENCE_BY_SLUG_QUERY = `*[_type == "conference" && slug.current == $slug][0]{
  ${CONFERENCE_SUMMARY_FIELDS},
  organiserOther, logo, subThemes, overview,
  venue{name, address, city, mapEmbedUrl, latitude, longitude, directions},
  callForPapers, submissionGuidelines, submissionUrl,
  "templateFileUrl": templateFile.asset->url,
  registration{fees[]{_key, category, amount, currency, note}, instructions, registrationUrl},
  programme[]{_key, date, label, sessions[]{_key, startTime, endTime, title, type, speaker, room}},
  "programmePdfUrl": programmePdf.asset->url,
  keynoteSpeakers[]{_key, name, title, affiliation, photo, bio, talkTitle},
  committees[]{_key, committeeName, members[]{_key, name, role, affiliation}},
  publication, travelAndAccommodation,
  sponsors[]{_key, name, logo, url},
  contact, gallery, seo,
  "proceedingsTitle": *[_type == "proceedings" && references(^._id)][0].title,
  "otherEditions": select(
    defined(series) => *[_type == "conference" && series == ^.series && _id != ^._id && defined(slug.current)] | order(year desc){
      _id, title, shortName, edition, year, "slug": slug.current, startDate, endDate, heroImage
    },
    []
  )
}`

export const PROCEEDINGS_BY_CONFERENCE_SLUG_QUERY = `*[_type == "proceedings" && conference->slug.current == $slug][0]{
  _id, title, "slug": slug.current, year, coverImage, isbn, issn, doi, publisher, editors, publishedDate,
  "fullVolumeUrl": fullVolumePdf.asset->url,
  "fullVolumeSize": fullVolumePdf.asset->size,
  papers[]{_key, title, authors, affiliations, abstract, pages, doi, keywords, "pdfUrl": pdf.asset->url},
  "conference": conference->{
    title, shortName, edition, year, "slug": slug.current, startDate, endDate, theme,
    "organiserName": coalesce(organiser->name, organiserOther),
    "venueCity": venue.city
  }
}`

export const PROCEEDINGS_ARCHIVE_QUERY = `*[_type == "proceedings" && defined(conference->slug.current)] | order(year desc, title asc){
  _id, title, year, coverImage, publisher, isbn,
  "paperCount": count(papers),
  "hasFullVolume": defined(fullVolumePdf.asset),
  "conference": conference->{
    title, shortName, "slug": slug.current,
    "organiserName": coalesce(organiser->name, organiserOther)
  }
}`

export const CONFERENCE_SITEMAP_QUERY = `{
  "conferences": *[_type == "conference" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "proceedings": *[_type == "proceedings" && defined(conference->slug.current)]{"slug": conference->slug.current, _updatedAt}
}`
