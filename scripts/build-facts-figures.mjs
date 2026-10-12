// Converts the 9 NiTERAC indicator source pages into statisticIndicator
// Sanity documents. Run: node scripts/build-facts-figures.mjs
// then: npx sanity dataset import scripts/facts-figures-content.ndjson production --replace
import { writeFileSync } from 'node:fs'

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function doc(title, indicatorNumber, order, summary, stats, sections, sourceNotes, lastUpdatedNote) {
  const slug = slugify(title)
  return {
    _id: `statisticIndicator-${slug}`,
    _type: 'statisticIndicator',
    title,
    slug: { _type: 'slug', current: slug },
    indicatorNumber,
    order,
    summary,
    stats,
    sections,
    sourceNotes,
    lastUpdatedNote,
  }
}

const table = (heading, columns, rows, footerRow, intro) => ({
  _type: 'factsTable',
  _key: slugify(heading || Math.random().toString(36).slice(2)),
  heading,
  intro,
  columns,
  rows: rows.map((cells) => ({ _type: 'tableRow', _key: Math.random().toString(36).slice(2), cells: cells.map(String) })),
  footerRow: footerRow?.map(String),
})

const bars = (heading, items) => ({
  _type: 'barPanel',
  _key: slugify(heading || Math.random().toString(36).slice(2)),
  heading,
  bars: items.map(([label, percent, displayValue]) => ({
    _key: Math.random().toString(36).slice(2),
    label,
    percent,
    displayValue: String(displayValue),
  })),
})

const note = (tone, text, link) => ({
  _type: 'note',
  _key: Math.random().toString(36).slice(2),
  tone,
  text,
  ...(link ? { linkHref: link.href, linkLabel: link.label } : {}),
})

const docs = []

// 1 — Academic Reputation & Institutional Profile
docs.push(
  doc(
    'Academic Reputation & Institutional Profile',
    1,
    1,
    'A public, NUC-accredited university established in 2008 by the Taraba State Government to widen access to university education and drive economic growth in Taraba State and across Nigeria.',
    [
      { value: '#7,686', label: 'World rank by H-index (AD Scientific Index 2027)' },
      { value: '30,976', label: 'Students enrolled, 2025/2026 session' },
      { value: '12', label: 'Faculties, 51 departments, 78 programmes' },
      { value: '2008', label: 'Year established, Jalingo, Taraba State' },
    ],
    [
      note(
        'info',
        'Globally ranked for research impact: in the 2027 edition of the AD Scientific Index, TSU holds a world position of 7,686 by H-index, with 107 academic researchers profiled on the index. For the full set of rankings, awards and research strengths, see the Rankings & Recognition page.',
        { href: '/rankings', label: 'See the full Rankings & Recognition page' }
      ),
      table(
        'Institutional Profile',
        ['Field', 'Detail'],
        [
          ['Full name', 'Taraba State University, Jalingo'],
          ['Established', '2008, by the Taraba State Government'],
          ['Ownership', 'Public (state university)'],
          ['Accreditation', 'National Universities Commission (NUC)'],
          ['Motto', 'Harnessing Nature’s Gift'],
          ['First convocation', '2018, with 5,900 graduates from five sets'],
        ]
      ),
      table(
        'Faculties',
        ['Faculty'],
        [
          ['Faculty of Agriculture'],
          ['Faculty of Arts'],
          ['Faculty of Communication and Media Studies'],
          ['Faculty of Computing and Artificial Intelligence (new)'],
          ['Faculty of Education'],
          ['Faculty of Engineering'],
          ['Faculty of Health Sciences'],
          ['Faculty of Law'],
          ['Faculty of Management Sciences'],
          ['Faculty of Religion and Philosophy (new)'],
          ['Faculty of Science'],
          ['Faculty of Social Sciences'],
        ]
      ),
    ],
    [
      'Research ranking: AD Scientific Index, 2027 Edition (data updated 25 September 2026).',
      'National ranking: uniRank 2026.',
      'Enrolment: Taraba State University student population by faculty, department and level, April 2026 (30,976 students).',
      'Staff: DVC Academic Office, Academic Staff-to-Student Ratio Report, April 2026.',
    ],
    'October 2026'
  )
)

// 2 — Staff & Student Statistics: Academic Staff-to-Student Ratio
docs.push(
  doc(
    'Staff & Student Statistics: Academic Staff-to-Student Ratio',
    2,
    2,
    'Academic staff numbers, student enrolment by level and the resulting staff-to-student ratio for the 2025/2026 academic session, university-wide and by faculty.',
    [
      { value: '30,976', label: 'Students enrolled, 2025/2026' },
      { value: '948', label: 'Academic staff incl. visiting & part-time' },
      { value: '716', label: 'Tenured academic staff' },
      { value: '1 : 32.7', label: 'Staff-to-student ratio (all staff)' },
      { value: '1 : 43.3', label: 'Staff-to-student ratio (tenured staff)' },
    ],
    [
      table(
        'University-Wide Ratio, 2025/2026',
        ['Measure', 'Value'],
        [
          ['Undergraduate students', '28,537'],
          ['Postgraduate students (PGD, Master’s, PhD)', '2,439'],
          ['Tenured academic staff', '716'],
          ['Sabbatical, visiting, part-time and contract staff', '232'],
          ['Total academic staff', '948'],
        ],
        ['Total students', '30,976']
      ),
      table(
        'Staff-to-Student Ratio by Faculty',
        ['Faculty', 'Students', 'Tenured staff', 'All staff', 'Ratio (all staff)'],
        [
          ['Health Sciences', '6,338', '22', '50', '1 : 126.8'],
          ['Education', '5,051', '157', '205', '1 : 24.6'],
          ['Social Sciences', '4,227', '103', '125', '1 : 33.8'],
          ['Science', '3,653', '83', '102', '1 : 35.8'],
          ['Management Sciences', '3,446', '71', '103', '1 : 33.5'],
          ['Engineering', '1,957', '38', '60', '1 : 32.6'],
          ['Arts', '1,673', '74', '87', '1 : 19.2'],
          ['Communication and Media', '1,493', '32', '37', '1 : 40.4'],
          ['Computing and Artificial Intelligence', '1,375', '16', '24', '1 : 57.3'],
          ['Agriculture', '1,193', '67', '83', '1 : 14.4'],
          ['Religion and Philosophy', '511', '39', '55', '1 : 9.3'],
          ['Law', '59', '14', '17', '1 : 3.5'],
        ],
        ['All faculties', '30,976', '716', '948', '1 : 32.7']
      ),
      table(
        'Ratio by Academic Session',
        ['Session', 'Students', 'Academic staff', 'Ratio'],
        [
          ['2025/2026', '30,976', '948', '1 : 32.7'],
          ['2024/2025', '', '', ''],
          ['2023/2024', '', '', ''],
        ]
      ),
      note('pending', 'Earlier sessions pending: student and staff totals for 2023/2024 and 2024/2025 will be added from the Academic Planning records.'),
    ],
    [
      'Students: student population by faculty, department and level, April 2026 (30,976 students).',
      'Staff: DVC Academic Office, Academic Staff-to-Student Ratio Report, April 2026.',
    ],
    'October 2026'
  )
)

// 3 — International Staff Statistics
docs.push(
  doc(
    'International Staff Statistics',
    3,
    3,
    'Taraba State University draws on academic staff from across Nigeria and beyond. This page reports the size of the academic workforce, the number of foreign-national staff and the countries they come from.',
    [
      { value: '948', label: 'Total academic staff incl. visiting & part-time' },
      { value: '716', label: 'Tenured academic staff' },
      { value: '3', label: 'Foreign-national academic staff' },
      { value: '1', label: 'Country represented (Cameroon)' },
      { value: '0.3%', label: 'International staff (% of total)' },
    ],
    [
      table(
        'Academic Workforce',
        ['Category', 'Staff', 'Share of total'],
        [
          ['Senior academic staff (Senior Lecturer, Associate Professor, Professor)', '204', '21.5%'],
          ['Junior academic staff (Graduate Assistant to Lecturer I)', '512', '54.0%'],
          ['Sabbatical, visiting, part-time and contract staff', '232', '24.5%'],
        ],
        ['Total academic staff', '948', '100.0%']
      ),
      table(
        'Countries Represented',
        ['Country', 'Academic staff', '% of international staff'],
        [['Cameroon', '3', '100%']],
        ['Total', '3', '100%']
      ),
      table(
        'International Staff Profile',
        ['Rank', 'Department', 'Faculty', 'Country'],
        [
          ['Professor', 'History & Diplomatic Studies', 'Arts', 'Cameroon'],
          ['Lecturer I', 'Physics', 'Science', 'Cameroon'],
          ['Lecturer II', 'Christian Religious Studies', 'Religion and Philosophy', 'Cameroon'],
        ]
      ),
    ],
    [
      'Academic staff numbers: Academic Staff-to-Student Ratio Report, DVC Academic Office, April 2026.',
      'Foreign-national staff: university academic staff list (state/country of origin), nationality confirmed October 2026.',
    ],
    'October 2026'
  )
)

// 4 — International Student Statistics
docs.push(
  doc(
    'International Student Statistics',
    4,
    4,
    'Student enrolment at Taraba State University by level and faculty, the number of international students, the countries they come from and their share of the student body, session by session.',
    [
      { value: '30,976', label: 'Total enrolment, 2025/2026' },
      { value: '9,303', label: 'New students admitted, 2025/2026' },
      { value: '', label: 'International students, 2025/2026' },
      { value: '', label: 'Countries represented' },
      { value: '', label: 'International students (% of enrolment)' },
    ],
    [
      note('pending', 'Figures pending: international student numbers are being compiled from student nationality records and will be added here.'),
      table(
        'Enrolment 2025/2026',
        ['Level', 'Students', '% of enrolment'],
        [
          ['100 Level', '7,985', '25.8%'],
          ['200 Level', '8,285', '26.7%'],
          ['300 Level', '6,066', '19.6%'],
          ['400 Level', '5,350', '17.3%'],
          ['500 Level', '851', '2.7%'],
          ['Postgraduate Diploma', '294', '0.9%'],
          ['Master’s', '1,722', '5.6%'],
          ['PhD', '423', '1.4%'],
        ],
        ['Total enrolment', '30,976', '100.0%']
      ),
      table(
        'Students by Faculty',
        ['Faculty', 'Undergraduate', 'Postgraduate', 'Total', '% of enrolment'],
        [
          ['Health Sciences', '6,164', '174', '6,338', '20.5%'],
          ['Education', '4,552', '499', '5,051', '16.3%'],
          ['Social Sciences', '3,747', '480', '4,227', '13.6%'],
          ['Science', '3,515', '138', '3,653', '11.8%'],
          ['Management Sciences', '3,077', '369', '3,446', '11.1%'],
          ['Engineering', '1,864', '93', '1,957', '6.3%'],
          ['Arts', '1,528', '145', '1,673', '5.4%'],
          ['Communication and Media', '1,401', '92', '1,493', '4.8%'],
          ['Computing and Artificial Intelligence', '1,245', '130', '1,375', '4.4%'],
          ['Agriculture', '1,065', '128', '1,193', '3.9%'],
          ['Religion and Philosophy', '320', '191', '511', '1.6%'],
          ['Law', '59', '0', '59', '0.2%'],
        ],
        ['All faculties', '28,537', '2,439', '30,976', '100.0%']
      ),
    ],
    [
      'Enrolment by level and faculty: student population by faculty, department and level, April 2026 (30,976 students).',
      'New intake: 2025/2026 UTME and Direct Entry admission lists (9,303 students).',
      'International students and countries represented: university student nationality records (to be added).',
    ],
    'October 2026'
  )
)

// 6 — Research Output Dashboard
docs.push(
  doc(
    'Research Output Dashboard',
    6,
    5,
    'A summary of TSU’s research output: indexed publications, the academic staff who produce them, output per staff member, and a breakdown by year and discipline.',
    [
      { value: '', label: 'Indexed publications (Scopus / Web of Science)' },
      { value: '716', label: 'Tenured academic staff (staff denominator)' },
      { value: '', label: 'Indexed publications per staff member' },
      { value: '107', label: 'Researchers profiled on AD Scientific Index' },
      { value: '29,113', label: 'Google Scholar citations (100 staff profiles)' },
    ],
    [
      note('info', 'Explore TSU researchers: the AD Scientific Index lists 107 TSU researchers with their H-index, i10-index, citations and publication records. See adscientificindex.com/h-index-ranking/?ft_university=8723'),
      table(
        'Research Impact: Google Scholar Citations',
        ['Indicator', 'Value'],
        [
          ['Staff with a Google Scholar profile', '100'],
          ['Share of tenured staff with a profile', '14.0%'],
          ['Total citations (all years)', '29,113'],
          ['Citations since 2021', '24,206'],
          ['Citations per profiled staff member', '291'],
          ['Staff with 1,000+ citations', '7'],
          ['Staff with h-index of 10 or more', '18'],
          ['Highest h-index', '28'],
          ['Stanford–Elsevier World’s Top 2% Scientists (2026)', '2'],
          ['Scholarly Index Top1000 Scholars (2026)', '15'],
        ]
      ),
      bars('Citations by Faculty', [
        ['Communication and Media Studies', 100, '8,512'],
        ['Social Sciences', 70, '5,963'],
        ['Science', 52, '4,428'],
        ['Education', 48, '4,071'],
        ['Computing and Artificial Intelligence', 27, '2,331'],
        ['Engineering', 22, '1,872'],
        ['Management Sciences', 10, '875'],
        ['Agriculture', 8, '719'],
        ['Health Sciences', 3, '236'],
        ['Arts', 1, '95'],
      ]),
      table(
        'Staff Denominator',
        ['Measure', 'Value'],
        [
          ['Tenured academic staff (the denominator)', '716'],
          ['All academic staff, including visiting, part-time and contract', '948'],
          ['TSU researchers profiled on the AD Scientific Index', '107'],
          ['Share of tenured staff with an AD Scientific Index profile', '14.9%'],
          ['Indexed publications (Scopus / Web of Science)', ''],
        ],
        ['Indexed publications per tenured staff member', '']
      ),
      table(
        'Breakdown of Documented Publications by Year',
        ['Year', 'Publications'],
        [
          ['2021', '1'],
          ['2022', '2'],
          ['2023', '2'],
          ['2024', '3'],
          ['2025', '2'],
          ['2026', '3'],
        ]
      ),
      note(
        'info',
        'The individual papers behind these numbers — including TETFund-supported studies such as the River Benue basin flood-risk assessment, the River Lamurde water-quality and soil-erosion studies, and the #EndSARS media-coverage study — are listed with full citations on the TETFund-Supported Research page.',
        { href: '/tetfund', label: 'See TETFund-supported publications' }
      ),
    ],
    [
      'Researchers profiled and world rank: AD Scientific Index, 2027 Edition (data updated 25 September 2026).',
      'Citations: Google Scholar profiles of 100 academic staff, self-reported September–October 2026.',
      'Staff numbers: Academic Staff-to-Student Ratio Report, DVC Academic Office, April 2026.',
      'Documented publications: published articles verified for TSU’s International Collaboration and TETFund-Supported Research pages — a selection, not TSU’s full publication output.',
    ],
    'October 2026'
  )
)

// 14 — Academic Staff Qualifications
docs.push(
  doc(
    'Academic Staff Qualifications',
    14,
    6,
    'The share of TSU’s academic staff who hold a PhD or an equivalent doctoral qualification, university-wide and by faculty.',
    [
      { value: '281', label: 'Full-time staff with a PhD or equivalent' },
      { value: '47.3%', label: 'of full-time academic staff hold a doctorate' },
      { value: '414', label: 'All staff with a doctorate (incl. visiting, sabbatical)' },
      { value: '53.5%', label: 'of all academic staff hold a doctorate' },
    ],
    [
      table(
        'Doctoral Qualifications at a Glance',
        ['Staff group', 'Academic staff', 'With PhD or equivalent', '%'],
        [
          ['Full-time academic staff', '594', '281', '47.3%'],
          ['Part-time, visiting, sabbatical, adjunct and contract staff', '180', '133', '73.9%'],
        ],
        ['All academic staff listed', '774', '414', '53.5%']
      ),
      table(
        'Doctorate Holders by Faculty',
        ['Faculty', 'All staff', 'With doctorate', '%'],
        [
          ['Education', '132', '80', '60.6%'],
          ['Science', '95', '55', '57.9%'],
          ['Management Sciences', '92', '34', '37.0%'],
          ['Agriculture', '83', '55', '66.3%'],
          ['Social Sciences', '83', '50', '60.2%'],
          ['Arts', '77', '45', '58.4%'],
          ['Health Sciences', '52', '29', '55.8%'],
          ['Religion and Philosophy', '51', '27', '52.9%'],
          ['Engineering', '38', '16', '42.1%'],
          ['Communication and Media', '29', '13', '44.8%'],
          ['Computing and Artificial Intelligence', '29', '8', '27.6%'],
          ['Law', '13', '2', '15.4%'],
        ],
        ['All faculties', '774', '414', '53.5%']
      ),
    ],
    [
      'Academic Staff Statistical Tables, 2026 (staff listed under more than one programme counted once).',
      'Headline staff totals used elsewhere on the TSU website (716 tenured, 948 total) come from the April 2026 staff-to-student ratio report; this page uses the detailed staff tables, which record each staff member’s qualification.',
    ],
    'October 2026'
  )
)

// 15 — Gender Statistics
docs.push(
  doc(
    'Gender Statistics',
    15,
    7,
    'Female and male representation among TSU’s students and academic staff, with breakdowns by faculty, year of admission and academic rank.',
    [
      { value: '43.6%', label: 'Female students (all students)' },
      { value: '44.7%', label: 'Female share of the 2025/2026 intake' },
      { value: '17.8%', label: 'Female academic staff' },
      { value: '0.81', label: 'Female-to-male ratio, 2025/2026 intake' },
    ],
    [
      table(
        'Student Enrolment by Gender',
        ['Group', 'Female', 'Male', '% female'],
        [
          ['All students (share of enrolment)', '43.6%', '56.2%', '43.6%'],
          ['2025/2026 new intake', '4,161', '5,142', '44.7%'],
        ]
      ),
      table(
        '2025/2026 Intake by Faculty',
        ['Faculty', 'Female', 'Male', 'Total', '% female'],
        [
          ['Health Sciences', '1,290', '832', '2,122', '60.8%'],
          ['Education', '702', '940', '1,642', '42.8%'],
          ['Science', '736', '730', '1,466', '50.2%'],
          ['Management Sciences', '403', '556', '959', '42.0%'],
          ['Social Sciences', '280', '629', '909', '30.8%'],
          ['Communication and Media Studies', '353', '163', '516', '68.4%'],
          ['Engineering', '10', '496', '506', '2.0%'],
          ['Computing and Artificial Intelligence', '39', '371', '410', '9.5%'],
          ['Arts', '185', '223', '408', '45.3%'],
          ['Agriculture', '123', '146', '269', '45.7%'],
          ['Religion and Philosophy', '40', '56', '96', '41.7%'],
        ],
        ['All faculties', '4,161', '5,142', '9,303', '44.7%']
      ),
      bars('Female Share of Students, by Year of Admission', [
        ['2025/2026', 98, '44.8%'],
        ['2024/2025', 100, '45.9%'],
        ['2023/2024', 91, '41.8%'],
        ['2022/2023', 91, '41.7%'],
        ['2021/2022', 84, '38.5%'],
        ['2020/2021', 76, '35.0%'],
        ['2019/2020', 77, '35.4%'],
      ]),
      table(
        'Academic Staff by Gender',
        ['Faculty', 'Female', 'Male', 'Total', '% female'],
        [
          ['Education', '31', '95', '126', '24.6%'],
          ['Social Sciences', '18', '80', '98', '18.4%'],
          ['Science', '11', '79', '90', '12.2%'],
          ['Agriculture', '15', '59', '74', '20.3%'],
          ['Arts', '17', '55', '72', '23.6%'],
          ['Management Sciences', '7', '65', '72', '9.7%'],
          ['Engineering', '1', '40', '41', '2.4%'],
          ['Religion and Philosophy', '8', '33', '41', '19.5%'],
          ['Communication and Media', '4', '27', '31', '12.9%'],
          ['Health Sciences', '5', '18', '23', '21.7%'],
          ['Computing and Artificial Intelligence', '1', '18', '19', '5.3%'],
          ['Law', '5', '14', '19', '26.3%'],
        ],
        ['All faculties', '133', '614', '747', '17.8%']
      ),
      table(
        'Academic Staff by Rank and Gender',
        ['Rank', 'Female', 'Male', 'Total', '% female'],
        [
          ['Professor', '7', '38', '45', '15.6%'],
          ['Associate Professor', '2', '34', '36', '5.6%'],
          ['Senior Lecturer', '12', '47', '59', '20.3%'],
          ['Lecturer I', '25', '111', '136', '18.4%'],
          ['Lecturer II', '25', '86', '111', '22.5%'],
          ['Assistant Lecturer', '21', '121', '142', '14.8%'],
          ['Graduate Assistant', '41', '177', '218', '18.8%'],
        ]
      ),
    ],
    [
      'Student gender shares: 2025/2026 student register. 2025/2026 intake: UTME and Direct Entry admission lists (9,303 students).',
      'Academic staff gender: university academic staff list (747 staff). "Department not specified" covers staff whose department is recorded as a campus location.',
    ],
    'October 2026'
  )
)

// 16 — Access & Inclusion Statistics
docs.push(
  doc(
    'Access & Inclusion Statistics',
    16,
    8,
    'Where TSU’s students come from: by state, geopolitical zone and local government area, with the university’s role in widening access for Taraba State and the North-East.',
    [
      { value: '36 + FCT', label: 'States represented in the student body' },
      { value: '76.2%', label: 'Students from Taraba State' },
      { value: '83.2%', label: 'Students from the North-East zone' },
      { value: '16 of 16', label: 'Taraba LGAs represented' },
    ],
    [
      bars('Students by Geopolitical Zone', [
        ['North-East', 100, '83.2%'],
        ['North-Central', 14, '11.8%'],
        ['South-East', 2, '1.9%'],
        ['South-South', 1, '0.8%'],
        ['North-West', 1, '0.6%'],
        ['South-West', 1, '0.6%'],
      ]),
      table(
        'Top 10 States of Origin',
        ['State', '% of students'],
        [
          ['Taraba', '76.2%'],
          ['Benue', '9.7%'],
          ['Adamawa', '5.7%'],
          ['Plateau', '0.8%'],
          ['Enugu', '0.7%'],
          ['Nasarawa', '0.6%'],
          ['Gombe', '0.6%'],
          ['Kogi', '0.5%'],
          ['Anambra', '0.5%'],
          ['Borno', '0.5%'],
        ]
      ),
      table(
        'Taraba State Catchment: Students by LGA',
        ['LGA', '% of Taraba students'],
        [
          ['Takum', '12.2%'],
          ['Jalingo', '11.4%'],
          ['Wukari', '10.5%'],
          ['Karim-Lamido', '9.4%'],
          ['Donga', '9.0%'],
          ['Sardauna', '8.8%'],
          ['Ussa', '5.7%'],
          ['Kurmi', '5.6%'],
          ['Gassol', '4.7%'],
          ['Lau', '4.4%'],
          ['Zing', '4.3%'],
          ['Ardo-Kola', '3.7%'],
          ['Bali', '3.6%'],
          ['Yorro', '2.9%'],
          ['Ibi', '2.2%'],
          ['Gashaka', '1.3%'],
        ]
      ),
      note('pending', 'Information pending: NiTERAC-defined disadvantaged and catchment categories, scholarships, fee waivers, bursaries and disability support, with annual numbers of beneficiaries.'),
    ],
    [
      'State and LGA of origin: 2025/2026 student register, shown as percentages of registered students.',
      'Geopolitical zones: Nigeria’s six zones; FCT counted with North-Central.',
    ],
    'October 2026'
  )
)

// 19 — Africa-Priority Research
docs.push(
  doc(
    'Africa-Priority Research',
    19,
    9,
    'TSU research that addresses Africa’s development priorities, tagged by theme: food security, health, climate and environment, digital transformation, education, and peace and security.',
    [
      { value: '14', label: 'Documented publications tagged by theme' },
      { value: '6', label: 'Climate, environment & natural resources' },
      { value: '4', label: 'Food security & agriculture' },
      { value: '3', label: 'Health & disease' },
    ],
    [
      bars('Publications by Africa-Priority Theme', [
        ['Climate, environment & natural resources', 100, '6'],
        ['Food security & agriculture', 67, '4'],
        ['Health & disease', 50, '3'],
        ['Digital transformation', 50, '3'],
        ['Peace, security & governance', 33, '2'],
        ['Education', 17, '1'],
      ]),
      table(
        'Researcher Strengths in Africa-Priority Fields',
        ['Scholar', 'Field', 'World rank', 'Nigeria rank'],
        [
          ['Prof. Emeka Daniel Oruonye', 'Gender, Education, and Development Issues', '35', '6'],
          ['Dr Nsemba Edward Lenshie', 'Peacebuilding and International Security', '272', '1'],
          ['Dr Nsemba Edward Lenshie', 'Political Conflict and Governance', '346', '1'],
          ['Dr Oberiri Destiny Apuke', 'Misinformation and Its Impacts', '78', '1'],
          ['Dr Umar Ali Bukar', 'Disaster Management and Resilience', '626', '2'],
          ['Mrs Alice Njolke Mafe', 'Probiotics and Fermented Foods', '674', '2'],
          ['Dr Buhari Shehu Miapyen', 'Religion, Society, and Development', '819', '14'],
          ['Dr Vincent Nduka Ojeh', 'Oil, Gas, and Environmental Issues', '374', '47'],
        ]
      ),
      note('pending', 'Information pending: the complete count of TSU publications tagged to Africa-priority themes, linked to Scopus/Web of Science records, from a Scopus affiliation export.'),
    ],
    [
      'Publications: articles verified for TSU’s International Collaboration and TETFund-Supported Research pages; themes assigned by subject.',
      'Researcher fields: Scholarly Index Top1000 Scholars, 2026 edition (public beta).',
    ],
    'October 2026'
  )
)

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(new URL('./facts-figures-content.ndjson', import.meta.url), ndjson)
console.log(`Wrote ${docs.length} statisticIndicator documents to scripts/facts-figures-content.ndjson`)
