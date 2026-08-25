import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is missing')
}

if (!token) {
  throw new Error('SANITY_API_TOKEN is missing')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-01-01',
  token,
  useCdn: false,
})

const applyChanges = process.argv.includes('--apply')

async function populateFacultyDepartments() {
  console.log('\n========================================')
  console.log(' TSU Faculty → Department Migration')
  console.log('========================================\n')

  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Mode: ${applyChanges ? 'APPLY CHANGES' : 'DRY RUN'}`)

  if (!applyChanges) {
    console.log('\n⚠️  DRY RUN — Nothing will be changed.\n')
  }

  // Get all faculties
  const faculties = await client.fetch(`
    *[_type == "faculty"] | order(order asc) {
      _id,
      name
    }
  `)

  // Get all departments and their faculty references
  const departments = await client.fetch(`
    *[_type == "department"] {
      _id,
      name,
      "facultyId": faculty._ref
    }
  `)

  console.log(`Found ${faculties.length} faculties.`)
  console.log(`Found ${departments.length} departments.\n`)

  let totalAssigned = 0
  let emptyFaculties = 0

  for (const faculty of faculties) {
    const facultyDepartments = departments
      .filter(
        (department) => department.facultyId === faculty._id
      )
      .sort((a, b) => a.name.localeCompare(b.name))

    console.log('----------------------------------------')
    console.log(`${faculty.name}`)
    console.log(`ID: ${faculty._id}`)

    if (facultyDepartments.length === 0) {
      console.log('  ⚠️ No departments found')
      emptyFaculties++
    } else {
      console.log(
        `  Departments: ${facultyDepartments.length}`
      )

      for (const department of facultyDepartments) {
        console.log(`  ✓ ${department.name}`)
      }

      totalAssigned += facultyDepartments.length
    }

    if (applyChanges) {
      const references = facultyDepartments.map(
        (department) => ({
          _type: 'reference',
          _ref: department._id,
        })
      )

      await client
        .patch(faculty._id)
        .set({
          departments: references,
        })
        .commit()

      console.log('  → Faculty updated successfully')
    }
  }

  console.log('\n========================================')
  console.log(' Migration Summary')
  console.log('========================================')

  console.log(`Faculties: ${faculties.length}`)
  console.log(`Departments: ${departments.length}`)
  console.log(`Department assignments: ${totalAssigned}`)
  console.log(`Faculties without departments: ${emptyFaculties}`)

  if (!applyChanges) {
    console.log('\nDRY RUN COMPLETE.')
    console.log(
      'Review the mappings above, then run:'
    )
    console.log(
      'pnpm exec node scripts/populate-faculty-departments.mjs --apply'
    )
  } else {
    console.log('\n✓ Migration completed successfully.')
  }
}

populateFacultyDepartments().catch((error) => {
  console.error('\n❌ Migration failed:')
  console.error(error)
  process.exit(1)
})