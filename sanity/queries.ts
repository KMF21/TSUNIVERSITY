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
  "authorName": coalesce(author->name, authorNameOverride)
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
  _type in ["page", "post", "event", "faculty", "department", "studentLifeCategory", "staffMember"] &&
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
  "excerpt": coalesce(excerpt, summary, heroSubheading, specialization),
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