// One-time script: pushes the new Admissions page content into Sanity.
//
// Needs a WRITE token (not the read-only client already in sanity/client.ts).
// Get one at manage.sanity.io -> your project -> API -> Tokens -> Add API token -> Editor permissions.

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Explicitly load .env.local
config({ path: '.env.local' })

// Trim and resolve environment variables with fallback options
const token = (process.env.SANITY_WRITE_TOKEN || '').trim()
const projectId = (
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  ''
).trim()
const dataset = (
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production'
).trim()

if (!token) {
  console.error('Error: Missing or empty SANITY_WRITE_TOKEN in .env.local')
  process.exit(1)
}

if (!projectId) {
  console.error('Error: Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false, // Must be false for write operations
})

const sections = [
  {
    _type: 'contentBlock',
    _key: '0fcdfbf79c99',
    heading: 'Undergraduate Admissions',
    body: [
      {
        _type: 'block',
        _key: '7346d63c197d',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'bb615391fe3a',
            text: "Undergraduate applicants are admitted through UTME (Unified Tertiary Matriculation Examination) or Direct Entry, followed by TSU's own post-UTME screening exercise. UTME candidates must select Taraba State University as their first or second choice institution.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'contentBlock',
    _key: 'c1e520a5810b',
    heading: 'Postgraduate Admissions',
    body: [
      {
        _type: 'block',
        _key: '2bdb8e8b110b',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: '7ef2ddcdd434',
            text: "Postgraduate admissions span Postgraduate Diploma, Master's, and Doctoral study, coordinated through the School of Postgraduate Studies. Requirements vary by level, from a first degree in any discipline for PGD applicants to a strong Master's result and a research proposal for PhD applicants.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'contentBlock',
    _key: '080de4ba10fa',
    heading: 'Distance Learning Admissions',
    body: [
      {
        _type: 'block',
        _key: 'a385a2e374de',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'c80811270570',
            text: "TSU's Distance Learning Programme is designed for working professionals and mature candidates who need a flexible study schedule. Applicants need the standard O'Level requirements plus either a minimum UTME score or relevant work experience, and reliable internet access for online coursework.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'accordionGroup',
    _key: 'c036f1960365',
    groupTitle: 'Admission Requirements',
    items: [
      {
        _key: 'bdc815e3111e',
        heading: 'UTME Candidates',
        body: [
          {
            _type: 'block',
            _key: '0ee451dce573',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '901fb1779891',
                text: "Five O'level credits including English Language and Mathematics in not more than two sittings",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '00559f78a4c8',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'a340104bb426',
                text: 'Minimum UTME score of 140 (subject to change based on national policy)',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'f73290d7e3b8',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '2d9524d987dc',
                text: 'Relevant subject combination for chosen course of study',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'e95423ac993e',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '470451d10c1e',
                text: 'Must select Taraba State University as first or second choice institution',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'f3a46bcd202e',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '954dbd96bc55',
                text: 'Successful completion of Post-UTME screening',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: '3b50ba7dcf0f',
        heading: 'Direct Entry Candidates',
        body: [
          {
            _type: 'block',
            _key: 'db23156d8848',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'efb00516e67c',
                text: 'NCE (minimum merit pass) in relevant subjects',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '60d61356564c',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '21abdb819fe7',
                text: 'OND (minimum upper credit) in relevant discipline',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '10e35fc285fc',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '55d299f8c39f',
                text: "A'level passes in relevant subjects",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'e1a4e0522389',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '75fd3474380a',
                text: "Five O'level credits including English and Mathematics",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'be82cd8d70c3',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '108b0693e977',
                text: 'Successful completion of Direct Entry screening',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: '667df02fa889',
        heading: 'Postgraduate Diploma (PGD)',
        body: [
          {
            _type: 'block',
            _key: 'b444d08e7cb2',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'a9775df2dcf0',
                text: "Bachelor's degree in any discipline from a recognized university",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '85d6c26ada96',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '8bc197f2f6fd',
                text: 'Minimum of Third Class degree or HND (Lower Credit)',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: '54e319147e44',
        heading: "Master's Degree (M.Sc / M.A)",
        body: [
          {
            _type: 'block',
            _key: 'd7a29485eb2f',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '888a401ddb00',
                text: "Bachelor's degree with at least Second Class Lower division",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'd2d0016497ee',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'e92032abadf7',
                text: 'PGD with minimum of Upper Credit for candidates without relevant background',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '5d291a718394',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '3670a1250007',
                text: 'NYSC discharge or exemption certificate',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: 'ab9e12eef21f',
        heading: 'Doctoral Degree (Ph.D)',
        body: [
          {
            _type: 'block',
            _key: 'ff98d937ba3f',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'a02e9068441f',
                text: "Master's degree with minimum CGPA of 3.5 on a 5-point scale",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '7d95f93fda4d',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '7ae4ab21eaf4',
                text: 'Research proposal in the intended area of study',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'b33d0b19101d',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: 'a6d70fe9691b',
                text: 'Satisfactory performance in the entrance examination/interview',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: 'd13e089d638e',
        heading: 'Distance Learning Programme',
        body: [
          {
            _type: 'block',
            _key: '6c0809022eb4',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '466d94aced77',
                text: "Five O'level credits including English and Mathematics",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'fe973cd262e6',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '814ac551b33c',
                text: 'Minimum UTME score or work experience for mature candidates',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'c4a3a92e2b1a',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '8aa66245a6b8',
                text: 'Flexible learning schedule for working professionals',
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: '69db89a5f14c',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [
              {
                _type: 'span',
                _key: '063966389736',
                text: 'Access to reliable internet connection for online learning',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
    ],
  },
  {
    _type: 'stepList',
    _key: '9f96a63ef610',
    groupTitle: 'How to Apply',
    steps: [
      {
        _key: 'f78aade25fa6',
        title: 'Visit the Application Portal',
        description:
          'Go to the official TSU admission portal at apply.tsuniversity.edu.ng or visit the university admissions office.',
      },
      {
        _key: '897f7506f479',
        title: 'Create an Account',
        description:
          'Register with your email address and phone number to create a profile.',
      },
      {
        _key: '52b26772d7e9',
        title: 'Fill Application Form',
        description:
          'Complete the online application form with accurate personal and academic information.',
      },
      {
        _key: 'ccad61d7b4a9',
        title: 'Upload Documents',
        description:
          'Upload scanned copies of all required supporting documents.',
      },
      {
        _key: '9224f876e02d',
        title: 'Pay Application Fee',
        description:
          'Pay the non-refundable application fee through the secure payment gateway.',
      },
      {
        _key: '99c157ab7729',
        title: 'Submit and Print',
        description:
          'Submit your application and print the acknowledgment slip for reference.',
      },
    ],
  },
  {
    _type: 'checklist',
    _key: '9900651dfbc0',
    groupTitle: 'Required Documents',
    items: [
      "O'level result(s) - original and photocopy",
      'Birth certificate or declaration of age',
      'Local government certificate of origin',
      'Recent passport photographs (8 copies)',
      'JAMB result slip (for UTME candidates)',
      "A'level/NCE/OND result (for Direct Entry candidates)",
      'NYSC discharge/exemption certificate (for postgraduate)',
      'Character/Reference letter',
    ],
  },
]

async function run() {
  console.log(`Connecting to project ${projectId} (${dataset})...`)

  // Ensure document exists first before running patch operations
  await client.createIfNotExists({
    _id: 'page-admissions',
    _type: 'page',
    title: 'Admissions',
  })

  const result = await client
    .patch('page-admissions')
    .set({ sections })
    .commit()

  console.log(
    'Successfully updated page-admissions. New section count:',
    result.sections ? result.sections.length : 0
  )
}

run().catch((err) => {
  console.error('Failed to update:', err.message)
  process.exit(1)
})