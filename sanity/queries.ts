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

export const ALL_EVENTS_QUERY = `*[_type == "event"] | order(startDateTime asc){
  _id, title, slug, eventType, startDateTime, location, capacity, summary, image, featured
}`

export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0]{
  _id, title, eventType, startDateTime, endDateTime, location, capacity, summary, image, registrationUrl
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