// Builds the Facts & Figures statisticIndicator Sanity documents.
// Run: node scripts/build-facts-figures.mjs
// then: pnpm exec sanity dataset import scripts/facts-figures-content.ndjson production --replace
//
// Editorial rules: publish verified figures only. Do not add placeholder rows,
// empty cells or "pending" notes; leave a section out until its data arrives.
// Table cells may contain links written as [label](url).
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

// A table's _key is its slugified heading, which is also the section's anchor
// on the page (e.g. /facts-and-figures/research-funding#research-funding-by-year).
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

// Internal routes for cross-links between indicator pages.
const FF = '/facts-and-figures'
const R = {
  ratio: `${FF}/staff-student-statistics-academic-staff-to-student-ratio`,
  collab: `${FF}/international-african-research-collaboration`,
  grants: `${FF}/international-african-research-collaboration#international-research-grants-and-projects`,
  cited: `${FF}/highly-cited-top-ranked-researchers`,
  access: `${FF}/access-inclusion-statistics`,
  africa: `${FF}/africa-priority-research`,
  industry: `${FF}/industry-employer-linkages`,
  training: `${FF}/industry-employer-linkages#sponsored-training-and-capacity-building`,
  threeMtt: `${FF}/industry-employer-linkages#3-million-technical-talent-3mtt-training-centre`,
  power: `${FF}/power-ict-reliability`,
  nuc: `${FF}/nuc-accreditation-register`,
}

const AD_INDEX = 'https://adscientificindex.com/h-index-ranking/?ft_university=8723'

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
      note(
        'info',
        'Two TSU researchers are on the Stanford–Elsevier World’s Top 2% Scientists list (2026), and 15 are ranked among Scholarly Index’s Top1000 Scholars in their fields, four of them 1st in Nigeria.',
        { href: R.cited, label: 'See TSU’s top-cited and top-ranked researchers' }
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
      'Researcher recognition: Stanford–Elsevier World’s Top 2% Scientists 2026 (via TopSciNet); Scholarly Index Top1000 Scholars 2026 (public beta).',
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
      { value: '4', label: 'Foreign-national academic staff' },
      { value: '1', label: 'Country represented (Cameroon)' },
      { value: '0.4%', label: 'International staff (% of total)' },
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
        [['Cameroon', '4', '100%']],
        ['Total', '4', '100%']
      ),
      table(
        'International Staff Profile',
        ['Rank', 'Department', 'Faculty', 'Country'],
        [
          ['Professor', 'History & Diplomatic Studies', 'Arts', 'Cameroon'],
          ['Professor (contract)', 'Biological Sciences', 'Science', 'Cameroon'],
          ['Lecturer I', 'Physics', 'Science', 'Cameroon'],
          ['Lecturer II', 'Christian Religious Studies', 'Religion and Philosophy', 'Cameroon'],
        ],
        undefined,
        'Three of the four are tenured staff; one is a contract professor.'
      ),
      table(
        'Staff by Faculty',
        ['Faculty', 'Tenured', 'Visiting / part-time', 'Total', 'Foreign-national'],
        [
          ['Education', '157', '48', '205', ''],
          ['Social Sciences', '103', '22', '125', ''],
          ['Management Sciences', '71', '32', '103', ''],
          ['Science', '83', '19', '102', '2'],
          ['Arts', '74', '13', '87', '1'],
          ['Agriculture', '67', '16', '83', ''],
          ['Engineering', '38', '22', '60', ''],
          ['Religion and Philosophy', '39', '16', '55', '1'],
          ['Health Sciences', '22', '28', '50', ''],
          ['Communication and Media', '32', '5', '37', ''],
          ['Computing and Artificial Intelligence', '16', '8', '24', ''],
          ['Law', '14', '3', '17', ''],
        ],
        ['All faculties', '716', '232', '948', '4']
      ),
      note('formula', 'How the percentage is calculated: foreign-national academic staff ÷ 948 total academic staff × 100.'),
    ],
    [
      'Academic staff numbers: Academic Staff-to-Student Ratio Report, DVC Academic Office, April 2026, and the underlying departmental returns.',
      'Foreign-national staff: university academic staff list (state/country of origin), nationality confirmed October 2026. Biological Sciences contract professor confirmed by the department’s return, October 2026.',
    ],
    'October 2026'
  )
)

// 4 — International Student Statistics
// International student figures are not yet compiled; only enrolment is shown.
docs.push(
  doc(
    'International Student Statistics',
    4,
    4,
    'Student enrolment at Taraba State University by level and faculty for the 2025/2026 session.',
    [
      { value: '30,976', label: 'Total enrolment, 2025/2026' },
      { value: '9,303', label: 'New students admitted, 2025/2026' },
    ],
    [
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
      note(
        'info',
        'A nationally diverse student body: TSU’s students come from all 36 states and the Federal Capital Territory, and 22.7% come from outside Taraba State.',
        { href: R.access, label: 'See where TSU’s students come from' }
      ),
    ],
    [
      'Enrolment by level and faculty: student population by faculty, department and level, April 2026 (30,976 students).',
      'New intake: 2025/2026 UTME and Direct Entry admission lists (9,303 students).',
    ],
    'October 2026'
  )
)

// 5 (and 21) — International & African Research Collaboration
docs.push(
  doc(
    'International & African Research Collaboration',
    5,
    5,
    'TSU researchers work with universities and research institutes across Africa, Asia, Europe and the Americas. Together they publish peer-reviewed research in international journals indexed in Scopus and Web of Science.',
    [
      { value: '24', label: 'International partner institutions (co-authorship or research partnership)' },
      { value: '18', label: 'Partner countries' },
      { value: '13', label: 'Co-authored publications with DOI, 2021–2026' },
      { value: '₦225m', label: 'International research grants (one researcher)' },
    ],
    [
      table(
        'Partner Institutions',
        ['Institution', 'Country', 'Collaboration', 'TSU department'],
        [
          ['University of Fort Hare', 'South Africa', 'Land use and land cover change research (geospatial science)', 'Geography'],
          ['University of Pretoria', 'South Africa', 'Land use and land cover change research (geospatial science)', 'Geography'],
          ['Federal University of Paraíba', 'Brazil', 'Land use and land cover change research (environmental engineering)', 'Geography'],
          ['Western Michigan University', 'United States', 'Land use and land cover change research (environment and sustainability)', 'Geography'],
          ['Universiti Putra Malaysia', 'Malaysia', 'Plant biodiversity of Gashaka Gumti National Park; social media crisis informatics; postgraduate research training', 'Biological Sciences; Computer Science'],
          ['Islamic University of Madinah', 'Saudi Arabia', 'Probiotics and food safety (chemistry)', 'Biological Sciences'],
          ['Qassim University', 'Saudi Arabia', 'Social media crisis management and communication (information systems)', 'Computer Science'],
          ['Weill Cornell Medicine–Qatar', 'Qatar', 'Gut microbiome, food safety and cancer research (Prof. Dietrich Büsselberg)', 'Biological Sciences'],
          ['Al-Nahrain University', 'Iraq', 'Food science, probiotics and biopolymer packaging research', 'Biological Sciences'],
          ['Rongo University', 'Kenya', 'Indigenous mushroom domestication in Nigeria and Kenya', 'Biological Sciences'],
          ['Universidad Espíritu Santo', 'Ecuador', 'Bioactive compounds and functional foods (Prof. Javad Sharifi-Rad)', 'Biological Sciences'],
          ['Centro de Estudios Tecnológicos y Universitarios del Golfo', 'Mexico', 'Bioactive compounds and functional foods (Prof. Javad Sharifi-Rad)', 'Biological Sciences'],
          ['Korea University', 'South Korea', 'Bioactive compounds and functional foods', 'Biological Sciences'],
          ['North-West University (Potchefstroom)', 'South Africa', 'Microbiological and toxicological safety of calabash chalk', 'Biological Sciences'],
          ['University of Medicine and Pharmacy of Craiova', 'Romania', 'Anticancer natural products and postbiotics (Prof. Daniela Calina)', 'Biological Sciences'],
          ['University of Hull', 'United Kingdom', 'Bacteriophage control of E. coli infections (conference paper, 2024)', 'Biological Sciences'],
          ['University of Lincoln', 'United Kingdom', 'Dietary fibre and food polymers research', 'Biological Sciences'],
          ['Near East University', 'Cyprus', 'Probiotics, food safety and biopolymer research', 'Biological Sciences'],
          ['Cyprus International University', 'Cyprus', 'Nanomaterials for food packaging', 'Biological Sciences'],
          ['George Brown College', 'Canada', 'Traditional Nigerian foods and antimicrobial activity', 'Biological Sciences'],
          ['University of Sharjah', 'United Arab Emirates', 'Probiotics research', 'Biological Sciences'],
          ['Lancaster University', 'United Kingdom', 'Research partnership (Prof. Elkanah Obadiah Sambo)', 'Biological Sciences'],
          ['Western Institute for Advanced Learning', 'Trinidad and Tobago', 'Research partnership (Prof. Elkanah Obadiah Sambo)', 'Biological Sciences'],
          ['Ifakara Health Institute', 'Tanzania', 'Research partnership in public health (Prof. Elkanah Obadiah Sambo)', 'Biological Sciences'],
        ],
        undefined,
        'Universities and research institutes whose researchers have co-authored work with TSU academics or hold a research partnership with them, in 18 countries: Brazil, Canada, Cyprus, Ecuador, Iraq, Kenya, Malaysia, Mexico, Qatar, Romania, Saudi Arabia, South Africa, South Korea, Tanzania, Trinidad and Tobago, the United Arab Emirates, the United Kingdom and the United States.'
      ),
      table(
        'Collaborative Publications',
        ['Year', 'Publication', 'TSU researchers', 'International partners', 'Indexing'],
        [
          ['2021', '[How social media crisis response and social interaction is helping people recover from Covid-19: an empirical investigation](https://doi.org/10.1007/s42001-021-00151-7) (Journal of Computational Social Science)', 'Umar Ali Bukar (Computer Science)', 'Universiti Putra Malaysia', 'Scopus'],
          ['2022', '[How advanced technological approaches are reshaping sustainable social media crisis management and communication: a systematic review](https://doi.org/10.3390/su14105854) (Sustainability 14(10))', 'Umar Ali Bukar (Computer Science)', 'Universiti Putra Malaysia; Qassim University, Saudi Arabia', 'Scopus; Web of Science (SCIE, SSCI)'],
          ['2024', '[Global trend assessment of land use and land cover changes: a systematic approach to future research development and planning](https://doi.org/10.1016/j.jksus.2024.103262) (Journal of King Saud University – Science)', 'Vincent Nduka Ojeh (Geography)', 'University of Fort Hare and University of Pretoria, South Africa; Federal University of Paraíba, Brazil; Western Michigan University, USA', 'Scopus; Web of Science (SCIE)'],
          ['2025', '[Diversity assessments of native and alien vascular plants in Gashaka Gumti National Park, northeast Nigeria](https://doi.org/10.11646/phytotaxa.717.2.4) (Phytotaxa 717)', 'Salihu Abba Hammanjoda, Umaru Buba Nformi (Biological Sciences)', 'Universiti Putra Malaysia', 'Scopus; Web of Science (SCIE)'],
          ['2026', '[Development, functional profiling, and probiotic evaluation of indigenous LAB from Nigerian fermented foods](https://doi.org/10.1007/s11274-026-05051-4) (World Journal of Microbiology and Biotechnology)', 'Alice Njolke Mafe (Biological Sciences)', 'Islamic University of Madinah, Saudi Arabia', 'Scopus; Web of Science (SCIE)'],
        ],
        undefined,
        'Peer-reviewed articles co-authored by TSU researchers and international partners. Indexing refers to the journal’s listing in Scopus and, where shown, the Web of Science Core Collection.'
      ),
      table(
        'More Co-authored Publications, 2024–2025',
        ['Publication', 'Journal', 'Partner countries'],
        [
          ['[Mycotoxins in food: cancer risks and strategies for control](https://doi.org/10.3390/foods13213502)', 'Foods 13(21), 2024', 'Qatar'],
          ['[Domestication and market potential of indigenous mushrooms in Nigeria and Kenya](https://doi.org/10.1007/s44187-025-00452-0)', 'Discover Food 5, 2025', 'Kenya; Iraq; Cyprus'],
          ['[Geophagia among pregnant women: microbiological and toxicological safety of calabash chalk](https://doi.org/10.1007/s10653-025-02656-w)', 'Environmental Geochemistry and Health 47, 2025', 'South Africa'],
          ['[Alantolactone as a bioactive sesquiterpene lactone: molecular mechanisms and anticancer potential](https://doi.org/10.1002/ardp.70170)', 'Archiv der Pharmazie 358(12), 2025', 'Ecuador; Mexico; South Korea; Romania'],
          ['[Pepper soup: a cultural and culinary exploration of a traditional Nigerian dish](https://doi.org/10.1016/j.ijgfs.2024.101036)', 'International Journal of Gastronomy and Food Science 38, 2024', 'Canada; Iraq; Cyprus'],
          ['[Genesis, health benefits, and future perspectives of probiotics](https://doi.org/10.1007/s12602-025-10756-3)', 'Probiotics and Antimicrobial Proteins, 2025', 'United Arab Emirates; Cyprus; Iraq'],
          ['[Investigating nanomaterials for improved barrier properties in food packaging](https://doi.org/10.62723/2959-5932.1018)', 'Al-Mustaqbal Journal of Sustainability in Engineering Sciences 2(2), 2025', 'Cyprus; Iraq'],
          ['[Indigestible carbohydrate polymers as dietary fiber](https://doi.org/10.1007/s40495-025-00434-x)', 'Current Pharmacology Reports 11, 2025', 'United Kingdom; Iraq; Cyprus'],
        ],
        undefined,
        'Further papers from the Department of Biological Sciences (lead TSU author: Alice Njolke Mafe), selected from 49 internationally co-authored publications in her staff record. Partner countries follow the co-author affiliations.'
      ),
      table(
        'International Research Grants and Projects',
        ['Grant', 'Field', 'Amount'],
        [
          ['Global Fund Research Grant', 'Public health entomology', '₦60,000,000'],
          ['ANOSTEP Grant', 'Public health entomology', '₦140,000,000'],
          ['Pfizer Medical Grant for Antimicrobial Resistance Studies', 'Biomedical sciences', '₦25,000,000'],
        ],
        ['Total', '', '₦225,000,000'],
        'Externally funded research led by Prof. Elkanah Obadiah Sambo (Department of Biological Sciences) in malaria vectors, public health entomology and antimicrobial resistance.'
      ),
      note(
        'info',
        'Global Fund multi-country project: a joint research project covering Ghana, Malawi, Mozambique, Côte d’Ivoire, Burundi, Burkina Faso, DR Congo, Liberia and Kenya.'
      ),
      table(
        'Intra-African Research Collaboration',
        ['African partner', 'Country', 'Publication', 'Indexing'],
        [
          ['University of Fort Hare', 'South Africa', '[Global trend assessment of land use and land cover changes](https://doi.org/10.1016/j.jksus.2024.103262) (Journal of King Saud University – Science, 2024)', 'Scopus; Web of Science (SCIE)'],
          ['University of Pretoria', 'South Africa', '[Global trend assessment of land use and land cover changes](https://doi.org/10.1016/j.jksus.2024.103262) (Journal of King Saud University – Science, 2024)', 'Scopus; Web of Science (SCIE)'],
          ['Rongo University', 'Kenya', '[Domestication and market potential of indigenous mushrooms in Nigeria and Kenya](https://doi.org/10.1007/s44187-025-00452-0) (Discover Food, 2025)', ''],
          ['North-West University', 'South Africa', '[Geophagia among pregnant women: safety of calabash chalk](https://doi.org/10.1007/s10653-025-02656-w) (Environmental Geochemistry and Health, 2025)', 'Scopus; Web of Science (SCIE)'],
          ['Ifakara Health Institute', 'Tanzania', 'Research partnership in public health', ''],
        ],
        undefined,
        'TSU researchers: Dr Vincent Nduka Ojeh, Geography (Fort Hare, Pretoria); Alice Njolke Mafe, Biological Sciences (Rongo, North-West); Prof. Elkanah Obadiah Sambo, Biological Sciences (Ifakara). The Global Fund project above also covers nine African countries.'
      ),
      note(
        'info',
        'For more on TSU’s academic staff and their research profiles, see the Taraba State University researcher ranking on the AD Scientific Index.',
        { href: AD_INDEX, label: 'View TSU researchers on AD Scientific Index' }
      ),
    ],
    [
      'Publications, authors and affiliations: each article’s publisher page, linked through its DOI.',
      'Indexing: journal coverage in Scopus and the Web of Science Core Collection. Follow each DOI to confirm the journal’s current listing.',
      'Biological Sciences partners, publications and grants: staff data forms of Alice Njolke Mafe and Prof. Elkanah Obadiah Sambo, Department of Biological Sciences return, October 2026.',
      'This page shows a selection of verified international collaborations, not a complete list of TSU’s international co-authored research.',
    ],
    'October 2026'
  )
)

// 6 — Research Output Dashboard
docs.push(
  doc(
    'Research Output Dashboard',
    6,
    6,
    'A summary of TSU’s research output: the academic staff who produce it, its citation impact, and a breakdown of documented publications by year and discipline.',
    [
      { value: '29,113', label: 'Google Scholar citations (100 staff profiles)' },
      { value: '107', label: 'Researchers profiled on AD Scientific Index' },
      { value: '716', label: 'Tenured academic staff (staff denominator)' },
    ],
    [
      note(
        'info',
        'Explore TSU researchers: the AD Scientific Index lists 107 TSU researchers with their H-index, i10-index, citations and publication records, ranked within the university, Nigeria, Africa and the world.',
        { href: AD_INDEX, label: 'View TSU researcher rankings' }
      ),
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
        ],
        undefined,
        'Citation figures from the Google Scholar profiles of 100 TSU academic staff, collected in September–October 2026.'
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
        ['Law', 0, '11'],
      ]),
      note(
        'info',
        'Figures are self-reported by staff from their Google Scholar profiles and change as new citations are recorded.',
        { href: R.cited, label: 'View TSU’s top-cited and top-ranked researchers' }
      ),
      table(
        'Staff Denominator',
        ['Measure', 'Value'],
        [
          ['Tenured academic staff (the denominator)', '716'],
          ['All academic staff, including visiting, part-time and contract', '948'],
          ['TSU researchers profiled on the AD Scientific Index', '107'],
          ['Share of tenured staff with an AD Scientific Index profile', '14.9%'],
        ],
        undefined,
        'Research output per staff member is measured against tenured academic staff, the permanent staff expected to publish.'
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
          ['Year not stated', '1'],
        ],
        ['Total', '14'],
        'The 14 publications documented on TSU’s international collaboration and TETFund research pages. 5 of them appeared in journals indexed in Scopus.'
      ),
      bars('Documented Publications by Discipline', [
        ['Geography & Environment', 100, '5'],
        ['Biological Sciences', 60, '3'],
        ['Computer Science', 40, '2'],
        ['Agriculture', 20, '1'],
        ['Social Sciences', 20, '1'],
        ['Communication & Media', 20, '1'],
        ['Education', 20, '1'],
      ]),
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

// 7 — Highly Cited & Top-Ranked Researchers
const SI = (id) => `https://scholarlyindex.com/scholars/SI-${id}`
const GS = (user) => `https://scholar.google.com/citations?hl=en&user=${user}`
docs.push(
  doc(
    'Highly Cited & Top-Ranked Researchers',
    7,
    7,
    'TSU researchers recognised in international citation rankings: the Stanford–Elsevier World’s Top 2% Scientists list, the Scholarly Index Top1000 Scholars, and the university’s most-cited researchers on Google Scholar.',
    [
      { value: '2', label: 'Stanford–Elsevier Top 2% Scientists' },
      { value: '15', label: 'Scholarly Index Top1000 Scholars' },
      { value: '4', label: 'Researchers ranked 1st in Nigeria in a field' },
      { value: '29,113', label: 'Citations to TSU staff (100 Google Scholar profiles)' },
      { value: '28', label: 'Highest h-index at TSU' },
    ],
    [
      table(
        'World’s Top 2% Scientists',
        ['Researcher', 'Field', 'Years listed', 'Global rank (2026)', 'Rank in sub-field', 'h-index (Scopus)'],
        [
          [
            '[Dr Oberiri Destiny Apuke](https://topscinet.com/scientist_profile/Apuke,%20Oberiri%20Destiny/2018/?stype=single_year)',
            'Mass Communication · Information & Library Sciences',
            '2023, 2024, 2026',
            '176,039',
            '132 of 15,996',
            '10',
          ],
          [
            '[Dr Umar Ali Bukar](https://topscinet.com/scientist_profile/Bukar,%20Umar%20Ali/2019/?stype=single_year)',
            'Computer Science · Networking & Telecommunications',
            '2026',
            '189,789',
            '2,311 of 228,312',
            '10',
          ],
        ],
        undefined,
        'The Stanford University and Elsevier list ranks scientists worldwide by a composite citation score based on Scopus data. Two TSU researchers appear in the 2026 edition (single-year data). Names link to each TopSciNet profile.'
      ),
      table(
        'Top1000 Scholars',
        ['Scholar', 'Position · Department', 'Best world rank', 'Field (world rank)', 'Best Nigeria rank', 'Field (Nigeria rank)'],
        [
          [`[Prof. Emeka Daniel Oruonye](${SI('a13b1b14f78782902209271db1638a62')})`, 'Professor · Geography', '35', 'Gender, Education, and Development Issues', '6', 'Gender, Education, and Development Issues'],
          [`[Dr Nsemba Edward Lenshie](${SI('d4ebc50ee5a848bfa746d0ba85fb514f')})`, 'Lecturer I · Political Science', '43', 'Global Political and Social Dynamics', '1', 'Political Conflict and Governance'],
          [`[Dr Oberiri Destiny Apuke](${SI('fb476a726afd6a418877674e868c236c')})`, 'Senior Lecturer · Mass Communication', '47', 'Child Therapy and Development', '1', 'Misinformation and Its Impacts'],
          [`[Dr Umar Ali Bukar](${SI('59c16026d90f02eed1575f2093505e26')})`, 'Senior Lecturer · Computer Science', '149', 'Public Relations and Crisis Communication', '1', 'Public Relations and Crisis Communication'],
          [`[Mr Ajibola Adebayo Lukman](${SI('4d6e5c23f8db9c7f44361b5eebca304a')})`, 'Assistant Lecturer · Educational Foundations', '210', 'African Education and Politics', '134', 'African Education and Politics'],
          [`[Dr Susan Peter Teru](${SI('0b0623eb04b58d86db034640f5f0a121')})`, 'Senior Lecturer · Accounting', '227', 'Financial Reporting and XBRL', '1', 'Financial Reporting and XBRL'],
          [`[Mr Chukwuemeka Chukwueke](${SI('aea77bd8ec7896d76fa24648e1a770fb')})`, 'Lecturer II · Library & Information Science', '322', 'Library Science and Information Literacy', '28', 'Library Science and Information Literacy'],
          [`[Dr Vincent Nduka Ojeh](${SI('a975ea9b92413d92f40d968ad89feeb2')})`, 'Senior Lecturer · Geography', '374', 'Oil, Gas, and Environmental Issues', '47', 'Oil, Gas, and Environmental Issues'],
          [`[Dr Bello Ali](${SI('81ca0f5cf347115b833fa0599121ca0c')})`, 'Senior Lecturer · Islamic Studies', '416', 'Education and Islamic Studies', '6', 'Education and Islamic Studies'],
          [`[Mrs Alice Njolke Mafe](${SI('21e431505b2b901bfded8858fc1a5051')})`, 'Lecturer II · Biological Sciences', '674', 'Probiotics and Fermented Foods', '2', 'Probiotics and Fermented Foods'],
          [`[Dr Buhari Shehu Miapyen](${SI('021de48dfa4e55d8a7d15dcd6766644e')})`, 'Senior Lecturer · Political Science', '736', 'Politics and Conflicts in Afghanistan, Pakistan, and Middle East', '10', 'Politics and Conflicts in Afghanistan, Pakistan, and Middle East'],
          [`[Dr Gladys Amos Shewa](${SI('9cf103d910c33f25c14bbea6cfb2bf8f')})`, 'Lecturer I · Statistics', '763', 'Advanced Statistical Methods and Models', '8', 'Advanced Statistical Methods and Models'],
          [`[Dr Adamu Halilu Jabire](${SI('4d63b15191a5f29f1e60da997734ca2e')})`, 'Senior Lecturer · Electrical & Electronic Engineering', '819', 'Currency Recognition and Detection', '4', 'Currency Recognition and Detection'],
          [`[Assoc. Prof. Christiana Tanko Audu](${SI('c777b2abb57d3e174f8d9fb42cc646cf')})`, 'Associate Professor · Science Education', '830', 'African Education and Politics', '517', 'African Education and Politics'],
          [`[Prof. Mustapha Baba Ibi](${SI('7f28340cf0fceda050f1a1b559f3b745')})`, 'Professor · Educational Foundations', '919', 'African Education and Politics', '567', 'African Education and Politics'],
        ],
        undefined,
        '15 TSU researchers are ranked among the top 1,000 scholars in the world in at least one research field by Scholarly Index (2026 edition, public beta); 4 of them rank 1st in Nigeria in a field. Ranks are within each field, so the best world and Nigeria ranks may come from different fields. Names link to each Scholarly Index profile.'
      ),
      table(
        'Top 20 Most-Cited Researchers (Google Scholar)',
        ['#', 'Researcher', 'Discipline', 'Citations', 'Since 2021', 'h-index', 'i10-index'],
        [
          ['1', '[Dr Oberiri Destiny Apuke](https://scholar.google.com/citations?user=Gwryd7AAAAAJ), Senior Lecturer', 'Mass Communication', '7,557', '6,928', '28', '74'],
          ['2', `[Prof. Victor Oluwatosin Ajayi](${GS('d1vh0OUAAAAJ')}), Professor`, 'Science Education (Chemistry)', '1,922', '1,647', '16', '23'],
          ['3', `[Dr Umar Ali Bukar](${GS('Tq_hUT4AAAAJ')}), Senior Lecturer`, 'Computer Science', '1,844', '1,838', '20', '30'],
          ['4', `[Mrs Alice Njolke Mafe](${GS('aHh7iyoAAAAJ')}), Lecturer II`, 'Biological Sciences', '1,788', '1,786', '22', '38'],
          ['5', `[Prof. Emeka Daniel Oruonye](${GS('-Xb26N0AAAAJ')}), Professor`, 'Geography', '1,423', '894', '21', '46'],
          ['6', `[Dr Vincent Nduka Ojeh](${GS('MmofKzIAAAAJ')}), Senior Lecturer`, 'Geography', '1,286', '995', '17', '24'],
          ['7', `[Dr Nsemba Edward Lenshie](${GS('dLREieIAAAAJ')}), Lecturer I`, 'Political Science', '1,034', '878', '17', '28'],
          ['8', `[Prof. Houmsou Robert Soumay](${GS('g0wn7hgAAAAJ')}), Professor`, 'Biological Sciences', '910', '376', '16', '24'],
          ['9', `[Dr Miftahu Idris](${GS('Hw6TBZ4AAAAJ')}), Senior Lecturer`, 'Economics', '836', '502', '16', '20'],
          ['10', `[Prof. John Tyavbee Ajai](${GS('v874O0kAAAAJ')}), Professor`, 'Science Education', '749', '453', '7', '7'],
          ['11', `[Dr Adamu Halilu Jabire](${GS('uhBv6HkAAAAJ')}), Senior Lecturer`, 'Electrical & Electronic Engineering', '714', '677', '14', '16'],
          ['12', `[Prof. Mohammed Bakoji Yusuf](${GS('u0wBvMoAAAAJ')}), Professor`, 'Geography', '628', '417', '13', '16'],
          ['13', `[Prof. Weltime Medjor](${GS('05_Bq6kAAAAJ')}), Professor`, 'Chemical Sciences', '476', '238', '12', '12'],
          ['14', `[Dr Susan Peter Teru](${GS('IEbwUXgAAAAJ')}), Senior Lecturer`, 'Accounting', '438', '335', '10', '10'],
          ['15', `[Prof. Delphine Leila David](${GS('0B5Fl3AAAAAJ')}), Professor`, 'Biological Sciences', '412', '223', '9', '9'],
          ['16', `[Dr Joseph Abutu](${GS('ksSK7rIAAAAJ')}), Senior Lecturer`, 'Mechanical Engineering', '390', '351', '10', '10'],
          ['17', `[Dr Aminu Sani](${GS('DGyl0oMAAAAJ')}), Senior Lecturer`, 'Educational Foundations', '366', '243', '11', '13'],
          ['18', `[Dr Yahaya Saidu](${GS('rkKeSr8AAAAJ')}), Lecturer I`, 'Computer Science', '338', '325', '10', '10'],
          ['19', `[Dr Tanko Bako](${GS('o736q94AAAAJ')}), Senior Lecturer`, 'Agricultural & Bio-Resources Engineering', '282', '229', '10', '10'],
          ['20', `[Mr Chukwuemeka Chukwueke](${GS('COYSIWMAAAAJ')}), Lecturer II`, 'Library and Information Science Education', '278', '255', '9', '8'],
        ],
        undefined,
        'Ranked by total citations. Names link to each Google Scholar profile. h-index: the researcher has h papers each cited at least h times. i10-index: the number of papers cited at least 10 times.'
      ),
      note(
        'info',
        'Rankings of all TSU researchers: the AD Scientific Index ranks TSU’s researchers by h-index, i10-index and citations within the university, Nigeria, Africa and the world.',
        { href: AD_INDEX, label: 'View TSU researcher rankings' }
      ),
    ],
    [
      'World’s Top 2% Scientists: Stanford University and Elsevier, 2026 edition (single-year data), via TopSciNet.',
      'Top1000 Scholars: Scholarly Index, 2026 edition (public beta).',
      'Citation figures: Google Scholar profiles of 100 TSU academic staff, self-reported by staff in September–October 2026. Figures change as new citations are recorded; follow each link for the current count.',
      'Researcher rankings: AD Scientific Index – Taraba State University.',
    ],
    'October 2026'
  )
)

// 9 — Doctoral Education
docs.push(
  doc(
    'Doctoral Education',
    9,
    8,
    'TSU’s doctoral programmes: how many students are studying for a PhD, and how many doctorates the university awards each year. Annual awards have risen from 3 in 2021/2022 to 11 in 2025/2026.',
    [
      { value: '423', label: 'PhD students enrolled, 2025/2026' },
      { value: '11 of 12', label: 'Faculties with PhD students' },
      { value: '11', label: 'Doctorates awarded, 2025/2026' },
      { value: '31', label: 'Doctorates awarded, 2021/2022 to 2025/2026' },
      { value: '1.2', label: 'Doctorates awarded per 100 academic staff (2025/2026)' },
    ],
    [
      bars('Doctorates Awarded per Session', [
        ['2021/2022', 27, '3'],
        ['2022/2023', 45, '5'],
        ['2023/2024', 45, '5'],
        ['2024/2025', 64, '7'],
        ['2025/2026', 100, '11'],
      ]),
      note('formula', 'How the ratio is calculated: doctorates awarded in the session ÷ 948 total academic staff × 100.'),
      table(
        'PhD Students by Faculty',
        ['Faculty', 'PhD students enrolled'],
        [
          ['Social Sciences', '84'],
          ['Education', '79'],
          ['Religion and Philosophy', '66'],
          ['Management Sciences', '58'],
          ['Arts', '39'],
          ['Agriculture', '27'],
          ['Science', '23'],
          ['Communication and Media', '21'],
          ['Computing and Artificial Intelligence', '20'],
          ['Engineering', '5'],
          ['Health Sciences', '1'],
          ['Law', '0'],
        ],
        ['All faculties', '423'],
        'Students registered for a PhD in the 2025/2026 session: 423 doctoral candidates in the pipeline.'
      ),
    ],
    [
      'PhD enrolment: university student population file, 2025/2026 session.',
      'Doctorates awarded per session: supplied by the university, October 2026.',
      'Academic staff: DVC Academic Office, Academic Staff-to-Student Ratio Report, April 2026 (948 staff).',
    ],
    'October 2026'
  )
)

// 10 — Research Funding
docs.push(
  doc(
    'Research Funding',
    10,
    9,
    'Research funding TSU receives through TETFund’s Institution-Based Research intervention and externally funded grants, and what it amounts to per academic staff member.',
    [
      { value: '₦238.0m', label: 'TETFund IBR funding, 2021–2025' },
      { value: '₦68.4m', label: 'TETFund IBR funding, 2025' },
      { value: '₦72,120', label: 'IBR funding per academic staff member (2025)' },
      { value: '₦225m', label: 'Other grants documented (one researcher)' },
    ],
    [
      bars('TETFund IBR Funding per Year (₦)', [
        ['2021', 58, '39,917,759'],
        ['2022', 80, '54,581,091'],
        ['2023', 52, '35,367,261'],
        ['2024', 58, '39,717,570'],
        ['2025', 100, '68,370,000'],
      ]),
      table(
        'TETFund Institution-Based Research (IBR) Funding',
        ['Year', 'IBR funding', 'Per academic staff (948)'],
        [
          ['2021', '₦39,917,759', '₦42,107'],
          ['2022', '₦54,581,091', '₦57,575'],
          ['2023', '₦35,367,261', '₦37,307'],
          ['2024', '₦39,717,570', '₦41,896'],
          ['2025', '₦68,370,000', '₦72,120'],
        ],
        ['Total 2021–2025', '₦237,953,681', ''],
        'TETFund’s Institution-Based Research intervention funds research projects by TSU staff each year. The 2025 allocation was the highest in five years.'
      ),
      note('formula', 'How the per-staff figure is calculated: research funding for the year ÷ 948 total academic staff (April 2026).'),
      table(
        'Externally Funded Grants',
        ['Grant', 'Researcher', 'Department', 'Amount'],
        [
          ['Global Fund Research Grant', 'Prof. Elkanah Obadiah Sambo', 'Biological Sciences', '₦60,000,000'],
          ['ANOSTEP Grant', 'Prof. Elkanah Obadiah Sambo', 'Biological Sciences', '₦140,000,000'],
          ['Pfizer Medical Grant (antimicrobial resistance)', 'Prof. Elkanah Obadiah Sambo', 'Biological Sciences', '₦25,000,000'],
        ],
        ['Total documented', '', '', '₦225,000,000'],
        'Grants reported by individual researchers in the 2026 departmental returns. They are separate from the TETFund IBR figures above.'
      ),
      note(
        'info',
        'These grants support malaria-vector and antimicrobial-resistance research, including a Global Fund project spanning nine African countries.',
        { href: R.grants, label: 'See TSU’s international grants and partners' }
      ),
      note(
        'info',
        'Building grant-winning capacity: TSU staff have trained in international grantsmanship (Committee of Vice-Chancellors, March 2026) and in technology transfer and commercialisation (TETFund, December 2025).',
        { href: R.training, label: 'See staff training and capacity building' }
      ),
    ],
    [
      'TETFund Institution-Based Research funding 2021–2025: supplied by the university, October 2026.',
      'Grants: staff data form of Prof. Elkanah Obadiah Sambo, Department of Biological Sciences return, October 2026.',
      'Academic staff denominator: 948 total academic staff, DVC Academic report, April 2026.',
    ],
    'October 2026'
  )
)

// 11 — Sustainability & SDGs
docs.push(
  doc(
    'Sustainability & SDGs',
    11,
    10,
    'How TSU contributes to the United Nations Sustainable Development Goals (SDGs): who it educates, what it teaches, the research its staff produce, and how it runs its campus.',
    [
      { value: '13', label: 'SDGs with documented TSU activity' },
      { value: '36 + FCT', label: 'States represented in the student body' },
      { value: '43.6%', label: 'Female students' },
      { value: '137 kVA', label: 'Solar capacity at nine buildings' },
      { value: '24', label: 'Partner institutions in 18 countries' },
    ],
    [
      table(
        'TSU and the SDGs at a Glance',
        ['Goal', 'Teaching and students', 'Research', 'Campus and partnerships'],
        [
          ['SDG 2: Zero Hunger', 'Faculty of Agriculture: 1,193 students in six departments', 'Soils, crop and food systems, indigenous mushrooms, fermented foods', ''],
          ['SDG 3: Good Health and Well-being', 'Faculty of Health Sciences: 6,338 students, the largest faculty', 'Malaria vector mapping, maternal health, medicinal plants, antimicrobial resistance', '₦225m in health research grants'],
          ['SDG 4: Quality Education', '30,976 students; 78 accredited programmes; 423 PhD students', 'Technology for online learning at TSU', 'TETFund ICT Experience Centre; CBT Centre'],
          ['SDG 5: Gender Equality', '43.6% of students and 44.7% of new entrants are women', '', ''],
          ['SDG 6: Clean Water and Sanitation', 'Environmental Health: 1,474 students', 'Agro-chemical pollution of rivers around Jalingo', ''],
          ['SDG 7: Affordable and Clean Energy', '', '', 'Solar power at nine key buildings: 137 kVA, 194 kWh of batteries'],
          ['SDG 8: Decent Work and Economic Growth', 'Faculty of Management Sciences: 3,446 students; B.Ed. Entrepreneurship from 2026/2027', '', 'Entrepreneurship Directorate; 3MTT digital skills centre at the ICT Complex'],
          ['SDG 9: Industry, Innovation and Infrastructure', 'Engineering (1,957) and Computing and AI (1,375) students', 'Digital crisis communication and online learning', '₦238m TETFund research funding 2021–2025; 100 Mbps internet and Starlink'],
          ['SDG 10: Reduced Inequalities', 'Students from all 36 states and the FCT; 76.2% from Taraba State; B.Ed. Special Needs Education from 2026/2027', '', ''],
          ['SDG 13: Climate Action', 'B.Sc. Meteorology and Climate Studies from 2026/2027', 'Flood risk, land use change and soil erosion', 'Solar power'],
          ['SDG 15: Life on Land', 'Forestry and Wildlife Conservation: 101 students', 'Biodiversity of Gashaka Gumti National Park; deforestation in Kurmi', ''],
          ['SDG 16: Peace, Justice and Strong Institutions', 'Peace and Conflict Studies: 887 students; Faculty of Law', 'Kidnapping and national security; media and civil protest', ''],
          ['SDG 17: Partnerships for the Goals', '', 'Co-authored research with 24 institutions in 18 countries', 'Global Fund multi-country malaria project'],
        ],
        undefined,
        'Thirteen goals matched to evidence published on TSU’s Facts & Figures pages.'
      ),
      note(
        'info',
        'Access, gender and quality education (SDG 4, 5 and 10): TSU educates 30,976 students from all 36 states and the FCT, including every one of Taraba State’s 16 local government areas. It offers 78 NUC-accredited programmes, with 24 more approved for 2026/2027, including B.Ed. Special Needs Education and B.Ed. Sustainable Development Studies. Women make up 43.6% of students and 44.7% of the 2025/2026 intake (4,161 of 9,303).',
        { href: R.access, label: 'See access and gender statistics' }
      ),
      note(
        'info',
        'Health, water and well-being (SDG 3 and 6): the Faculty of Health Sciences has 6,338 students in Public Health, Environmental Health, Medical Laboratory Science and Nursing. Research covers nationwide mapping of malaria mosquito species (PLOS ONE, 2025), the safety of calabash chalk eaten by pregnant women, antimicrobial resistance and medicinal plants, and agro-chemical pollution of rivers around Jalingo.',
        { href: R.africa, label: 'See the research publications' }
      ),
      note(
        'info',
        'Food, land and climate (SDG 2, 13 and 15): the Faculty of Agriculture teaches 1,193 students, and a B.Sc. Meteorology and Climate Studies starts in 2026/2027. Research covers soils, indigenous mushrooms and probiotic fermented foods; flood risk, land use change and soil erosion; and the plant biodiversity of Gashaka Gumti National Park, Nigeria’s largest national park.',
        { href: R.africa, label: 'See Africa-priority research' }
      ),
      table(
        'Clean Energy and Infrastructure',
        ['Measure', 'Value'],
        [
          ['Buildings with solar power', '9'],
          ['Solar inverter capacity', '137 kVA'],
          ['Solar battery storage', '194 kWh'],
          ['Campus internet', '100 Mbps, plus Starlink'],
          ['TETFund research funding, 2021–2025', '₦237,953,681'],
        ],
        undefined,
        'SDG 7 and SDG 9: solar power keeps TSU’s key buildings running 24 hours a day, and generators are rarely needed in these buildings.'
      ),
      note('info', 'Power, solar and internet coverage are set out building by building on the Power & ICT Reliability page.', {
        href: R.power,
        label: 'See power and ICT reliability',
      }),
      note(
        'info',
        'Decent work, peace and partnerships (SDG 8, 16 and 17): 3,446 students in Management Sciences, the Entrepreneurship Directorate and a new B.Ed. Entrepreneurship; 887 students in Peace and Conflict Studies and 1,473 in Political Science and International Relations, with research on kidnapping and national security and press coverage of the #EndSARS protests; Dr Nsemba Edward Lenshie ranks 1st in Nigeria for peacebuilding and international security research (Scholarly Index, 2026); and co-authored research with 24 institutions in 18 countries.',
        { href: R.collab, label: 'See international partnerships' }
      ),
    ],
    [
      'Students by faculty and department: university student population file, 2025/2026 (30,976). Access and gender: student register and 2025/2026 intake.',
      'Programmes: NUC approval letter NUC/AP/S31/VOL.I/310, 1 June 2026. Doctorates: Postgraduate School figures supplied October 2026.',
      'Research: publications on the Africa-Priority Research and International Collaboration pages, linked by DOI. Researcher ranking: Scholarly Index Top1000, 2026 (public beta).',
      'Solar, power and internet: Directorate of ICT/MIS and Works Department, October 2026. Research funding: TETFund IBR 2021–2025 and the Department of Biological Sciences return, October 2026.',
    ],
    'October 2026'
  )
)

// 12 — NUC Accreditation Register
docs.push(
  doc(
    'NUC Accreditation Register',
    12,
    11,
    'All of TSU’s current degree programmes are accredited by the National Universities Commission (NUC). A further 24 programmes have NUC approval to admit their first students in 2026/2027.',
    [
      { value: '78', label: 'Current degree programmes' },
      { value: '100%', label: 'Current programmes accredited by NUC' },
      { value: '24', label: 'New programmes approved to start 2026/2027' },
      { value: '102', label: 'Programmes offered from 2026/2027' },
    ],
    [
      table(
        'Accreditation Summary',
        ['Programme status', 'Programmes'],
        [
          ['Current programmes with NUC accreditation', '78'],
          ['New programmes approved after NUC resource verification (first intake 2026/2027)', '24'],
        ],
        ['Total programmes from 2026/2027', '102'],
        'New programmes are not yet due for accreditation because they have not yet admitted students.'
      ),
      table(
        'New Programmes Approved for 2026/2027',
        ['Faculty', 'Department', 'Programme', 'Code'],
        [
          ['Religion and Philosophy', 'Sharia and Islamic Studies', 'B.A. Sharia', 'TSU/FRP/SHA'],
          ['Religion and Philosophy', 'Christian Religion', 'B.A. Christian Theology', 'TSU/FRP/CTH'],
          ['Religion and Philosophy', 'Christian Religion', 'B.A. Philosophy', 'TSU/FRP/PHL'],
          ['Religion and Philosophy', 'Christian Religion', 'B.A. Religious Studies', 'TSU/FRP/RES'],
          ['Religion and Philosophy', 'Christian Religion', 'B.A. African Traditional Religion', 'TSU/FRP/ATR'],
          ['Religion and Philosophy', 'Christian Religion', 'B.A. Classics', 'TSU/FRP/CLS'],
          ['Communication and Media', 'Advertising', 'B.Sc. Advertising', 'TSU/FCMS/ADB'],
          ['Communication and Media', 'Broadcasting', 'B.Sc. Broadcasting', 'TSU/FCMS/BRC'],
          ['Communication and Media', 'Journalism and Media Studies', 'B.Sc. Journalism and Media Studies', 'TSU/FCMS/JMS'],
          ['Communication and Media', 'Public Relations', 'B.Sc. Public Relations', 'TSU/FCMS/PRS'],
          ['Computing and Artificial Intelligence', 'Computer Science', 'B.Sc. Data Science', 'TSU/FCAI/DS'],
          ['Computing and Artificial Intelligence', 'Computer Science', 'B.Sc. Information and Communication Technology', 'TSU/FCAI/ICT'],
          ['Computing and Artificial Intelligence', 'Computer Science', 'B.Sc. Software Engineering', 'TSU/FCAI/SE'],
          ['Basic Medical Sciences', 'Human Anatomy', 'B.Sc. Human Anatomy', 'TSU/FAH/ANT'],
          ['Basic Medical Sciences', 'Human Physiology', 'B.Sc. Human Physiology', 'TSU/FAH/PO'],
          ['Basic Medical Sciences / Clinical Sciences', 'Radiography', 'B.Rad. Radiography', 'TSU/FAH/RAD'],
          ['Management Sciences', 'Accounting', 'B.Sc. Banking and Finance', 'TSU/FMS/FIN'],
          ['Social Sciences', 'Geography', 'B.Sc. Meteorology and Climate Studies', 'TSU/FSS/MCS'],
          ['Social Sciences', 'Geography', 'B.Sc. Survey and Geo-Informatics', 'TSU/FSS/SGI'],
          ['Education', 'Counselling, Educational Psychology and Human Development', 'B.Ed. Special Needs Education', 'TSU/FED/SNE'],
          ['Education', 'Counselling, Educational Psychology and Human Development', 'B.Ed. Sustainable Development Studies', 'TSU/FED/SD'],
          ['Education', 'Vocational and Technical Education', 'B.Ed. Entrepreneurship', 'TSU/FED/ENT'],
          ['Education', 'Human Kinetics and Health Education', 'B.Ed. Human Kinetics', 'TSU/FED/HKE'],
          ['Education', 'Human Kinetics and Health Education', 'B.Ed. Health Education', 'TSU/FED/HED'],
        ],
        undefined,
        'Approved by the NUC after resource verification in the 2025/2026 session (letter NUC/AP/S31/VOL.I/310, 1 June 2026). Students will be admitted from the 2026/2027 session.'
      ),
      note('info', 'Explore TSU’s faculties, departments and current programmes.', {
        href: '/academics',
        label: 'Explore TSU’s faculties and programmes',
      }),
    ],
    [
      'Accreditation status of current programmes: confirmed by the university, October 2026.',
      'New programmes: NUC approval letter NUC/AP/S31/VOL.I/310, 1 June 2026; programme list and codes certified by the Directorate of ICT/MIS.',
    ],
    'October 2026'
  )
)

// 14 — Academic Staff Qualifications
docs.push(
  doc(
    'Academic Staff Qualifications',
    14,
    12,
    'The share of TSU’s academic staff who hold a PhD or an equivalent doctoral qualification, university-wide and by faculty.',
    [
      { value: '283', label: 'Full-time staff with a PhD or equivalent' },
      { value: '47.2%', label: 'of full-time academic staff hold a doctorate' },
      { value: '417', label: 'All staff with a doctorate (incl. visiting, sabbatical)' },
      { value: '53.4%', label: 'of all academic staff hold a doctorate' },
    ],
    [
      table(
        'Doctoral Qualifications at a Glance',
        ['Staff group', 'Academic staff', 'With PhD or equivalent', '%'],
        [
          ['Full-time academic staff', '600', '283', '47.2%'],
          ['Part-time, visiting, sabbatical, adjunct and contract staff', '181', '134', '74.0%'],
        ],
        ['All academic staff listed', '781', '417', '53.4%']
      ),
      note('formula', 'How the percentage is calculated: academic staff holding a PhD (or equivalent doctorate, such as LLD or a medical fellowship) ÷ total academic staff × 100.'),
      table(
        'Doctorate Holders by Faculty',
        ['Faculty', 'All staff', 'With doctorate', '% (all)', 'Full-time staff', 'Full-time with doctorate', '% (full-time)'],
        [
          ['Education', '132', '80', '60.6%', '90', '46', '51.1%'],
          ['Science', '102', '58', '56.9%', '82', '40', '48.8%'],
          ['Management Sciences', '92', '34', '37.0%', '62', '14', '22.6%'],
          ['Agriculture', '83', '55', '66.3%', '66', '39', '59.1%'],
          ['Social Sciences', '83', '50', '60.2%', '72', '43', '59.7%'],
          ['Arts', '77', '45', '58.4%', '68', '39', '57.4%'],
          ['Health Sciences', '52', '29', '55.8%', '34', '16', '47.1%'],
          ['Religion and Philosophy', '51', '27', '52.9%', '36', '22', '61.1%'],
          ['Engineering', '38', '16', '42.1%', '30', '10', '33.3%'],
          ['Communication and Media', '29', '13', '44.8%', '26', '10', '38.5%'],
          ['Computing and Artificial Intelligence', '29', '8', '27.6%', '21', '2', '9.5%'],
          ['Law', '13', '2', '15.4%', '13', '2', '15.4%'],
        ],
        ['All faculties', '781', '417', '53.4%', '600', '283', '47.2%']
      ),
    ],
    [
      'Academic Staff Statistical Tables, 2026 (staff listed under more than one programme counted once; staff whose highest qualification is not recorded are counted by their title of Dr or Professor).',
      'Supplemented by the Department of Biological Sciences staff list and PhD verification list (October 2026): seven staff not in the 2026 tables were added, three of them with a PhD.',
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
    13,
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
        ['Group', 'Female', 'Male', '% female', 'Female : male'],
        [
          ['All students (share of enrolment)', '43.6%', '56.2%', '43.6%', '0.78 : 1'],
          ['2025/2026 new intake', '4,161', '5,142', '44.7%', '0.81 : 1'],
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
      note(
        'info',
        'The female share of new students has risen from about 35% of those admitted in 2019/2020 and 2020/2021 to about 45% of those admitted in 2024/2025 and 2025/2026. These shares come from the 2025/2026 student register, so the 2025/2026 figure (44.8%) differs slightly from the 44.7% in the admission lists used for the intake tables above.'
      ),
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
          ['Department not specified', '10', '31', '41', '24.4%'],
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
        ],
        ['All ranks', '133', '614', '747', '17.8%']
      ),
      note(
        'info',
        'Staff figures on this page come from the university academic staff list, which records gender for 747 academic staff. The staff-to-student ratio report (948 staff, including visiting and part-time) and the qualification tables (781 staff) count staff from different records, so their totals differ.',
        { href: R.ratio, label: 'See staff and student totals' }
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
    14,
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
        ],
        undefined,
        'Every one of Taraba State’s 16 local government areas is represented in the student body.'
      ),
    ],
    [
      'State and LGA of origin: 2025/2026 student register, shown as percentages of registered students. 1.1% of students have no state of origin recorded.',
      'Geopolitical zones: Nigeria’s six zones; FCT counted with North-Central.',
    ],
    'October 2026'
  )
)

// 17 — Industry & Employer Linkages
docs.push(
  doc(
    'Industry & Employer Linkages',
    17,
    15,
    'TSU’s working relationships with employers, public bodies and organisations in Jalingo, Taraba State and beyond, including where its students are placed for industrial training.',
    [
      { value: '661', label: 'Students on industrial placements' },
      { value: '607', label: 'Placed with employers outside the university' },
      { value: '24', label: 'Placement hosts or host groups' },
      { value: '250–500', label: '3MTT Fellows trained per cohort' },
    ],
    [
      bars('Students Placed, by Sector', [
        ['Government', 100, '206'],
        ['Health', 87, '180'],
        ['Media', 52, '107'],
        ['ICT and technology', 31, '63'],
        ['University units', 26, '54'],
        ['Manufacturing and food', 25, '51'],
      ]),
      table(
        'Student Industrial Placements',
        ['Host organisation', 'Sector', 'Students placed'],
        [
          ['Local government areas of Taraba State', 'Government', '145'],
          ['Taraba State Broadcasting Service (radio)', 'Media', '57'],
          ['Private laboratories', 'Health', '56'],
          ['Federal Medical Centre, Jalingo', 'Health', '45'],
          ['Private hospitals', 'Health', '45'],
          ['Primary health care centres, Jalingo', 'Health', '34'],
          ['Bakeries', 'Manufacturing and food', '34'],
          ['Taraba Television (TTV)', 'Media', '34'],
          ['Taraba State Ministry of Urban and Regional Development', 'Government', '32'],
          ['Algaddaf Technology Hub', 'ICT and technology', '25'],
          ['Technology Incubation House, Jalingo', 'ICT and technology', '23'],
          ['Directorate of ICT/MIS, TSU', 'University units', '22'],
          ['Water factories', 'Manufacturing and food', '17'],
          ['Taraba State Transport Corporation', 'Government', '15'],
          ['Tractor Hiring Unit, Taraba State Ministry of Agriculture', 'Government', '14'],
          ['TSU Clinic', 'University units', '13'],
          ['Entrepreneurship Directorate, TSU', 'University units', '11'],
          ['Babanyaya Cyber Café', 'ICT and technology', '8'],
          ['Rock FM, Jalingo', 'Media', '8'],
          ['Stena IT Academy', 'ICT and technology', '7'],
          ['TSU Farm', 'University units', '7'],
          ['Gotel Radio FM', 'Media', '5'],
          ['Nigerian Television Authority (NTA)', 'Media', '3'],
          ['Career Development Centre, TSU', 'University units', '1'],
        ],
        ['Total', '', '661'],
        '661 students were placed for industrial training with 24 hosts across health, government, media, technology and manufacturing. 607 of them were placed with employers outside the university.'
      ),
      table(
        '3 Million Technical Talent (3MTT) Training Centre',
        ['Item', 'Details'],
        [
          ['Partnership', 'MoU with SAIL Empowerment Foundation, Airtel Networks’ 3MTT implementation partner (2025 cohort), making TSU a 3MTT Applied Learning Cluster'],
          ['Training centre', 'ICT Complex, Taraba State University (Directorate of ICT/MIS)'],
          ['Fellows per cohort', '250 to 500'],
          ['Training tracks', 'Software and product development, data science and analysis, AI and machine learning, cybersecurity, cloud computing, DevOps, UI/UX design, quality assurance, game development and animation'],
          ['Format', '16 weeks: online learning with in-person, project-based sessions; capstone projects with at least 10 SMEs and companies'],
          ['Job and internship target', '20% of Fellows placed in internships, apprenticeships or jobs'],
          ['Programme value to TSU', 'Up to ₦6,200,000 per cohort, paid against verified results'],
        ],
        undefined,
        'TSU’s ICT Complex is an Applied Learning Cluster for the Federal Government’s 3 Million Technical Talent (3MTT) programme, run by the Federal Ministry of Communications, Innovation and Digital Economy.'
      ),
      table(
        'Sponsored Training and Capacity Building',
        ['Training', 'Organiser / sponsor', 'Date', 'TSU participants'],
        [
          ['Technology Transfer and Commercialization', 'Tertiary Education Trust Fund (TETFund)', 'December 2025', 'Prof. Mahmud Hamid Umar; Dr Istifanus Akila Bardey; Dr Umar Ali Bukar'],
          ['Strategic Session on Strengthening National Cybersecurity Resilience', 'Office of the National Security Adviser (National Cybersecurity Coordinator)', 'November 2025', 'Dr Israel Habibu Idris; Dr Umar Ali Bukar'],
          ['Unlocking Global Funding: Resource Mobilization and International Grantsmanship', 'Committee of Vice-Chancellors of Nigerian Universities', '17–18 March 2026', 'Prof. Aliyu Bakari; Dr Tanko Bako; Dr Umar Ali Bukar'],
        ],
        undefined,
        'TSU staff attend externally organised training on research funding, commercialisation and cybersecurity, and report back to the Vice-Chancellor.'
      ),
    ],
    [
      'Placements: supplied by the university, October 2026. 3MTT: MoU between SAIL Empowerment Foundation and Taraba State University for the 3 Million Technical Talent training programme (2025).',
      'Training: reports to the Vice-Chancellor on the TETFund training (15 December 2025), the ONSA cybersecurity session (20 November 2025) and the CVC grantsmanship workshop (18 March 2026).',
    ],
    'October 2026'
  )
)

// 18 — Power & ICT Reliability
docs.push(
  doc(
    'Power & ICT Reliability',
    18,
    16,
    'How TSU keeps its key academic and administrative facilities powered and connected: grid electricity, solar power, backup generators, 100 Mbps internet and Starlink satellite links.',
    [
      { value: '9', label: 'Key facilities with 24-hour power' },
      { value: '137 kVA', label: 'Solar inverters, with 194 kWh battery storage' },
      { value: '~4 hrs', label: 'Average grid supply per day' },
      { value: '100 Mbps', label: 'Campus internet bandwidth' },
      { value: '2', label: 'Buildings with Starlink' },
    ],
    [
      table(
        'Power Supply by Facility',
        ['Facility', 'Grid', 'Solar', 'Generator', 'Power availability', 'Internet'],
        [
          ['Postgraduate School', '✓', '✓', '✓', '24 hours', ''],
          ['University Library', '✓', '✓', '✓', '24 hours', '100 Mbps'],
          ['e-Library', '✓', '✓', '✓', '24 hours', '100 Mbps'],
          ['ICT Complex', '✓', '✓', '✓', '24 hours', 'Starlink'],
          ['Senate Building', '✓', '✓', '✓', '24 hours', '100 Mbps + Starlink'],
          ['Computer-Based Test (CBT) Centre', '✓', '✓', '✓', '24 hours', '100 Mbps'],
          ['TETFund ICT Experience Centre', '✓', '✓', '', '24 hours', ''],
          ['Faculty of Education (Deanery)', '✓', '✓', '✓', '24 hours', ''],
          ['Faculty of Science', '✓', '✓', '✓', '24 hours', '100 Mbps'],
        ],
        undefined,
        'Each key facility draws on more than one power source, so teaching, examinations, library services and administration continue when grid supply fails. Eight facilities combine grid, solar and generator supply; the TETFund ICT Experience Centre runs on grid and solar.'
      ),
      table(
        'Solar Power Installations',
        ['Facility', 'Inverter rating (kVA)', 'Battery storage (kWh)'],
        [
          ['ICT Complex', '10', '10'],
          ['Computer-Based Test (CBT) Centre', '30', '60'],
          ['Senate Building', '24', '30'],
          ['e-Library', '10', '10'],
          ['Faculty of Science', '5', '6'],
          ['Faculty of Education (Deanery)', '3', '3'],
          ['Postgraduate School', '5', '5'],
          ['University Library', '10', '10'],
          ['TETFund ICT Experience Centre', '40', '60'],
        ],
        ['Total (9 facilities)', '137', '194'],
        'All nine key facilities have solar systems. kVA is the inverter rating (how much load the system can carry at once); kWh is the battery storage (how long it can run). Capacities as reported by the university.'
      ),
      table(
        'Buildings on the Grid',
        ['Building type', 'Number'],
        [
          ['Faculty buildings', '12'],
          ['Lecture halls and classrooms', 'about 24'],
          ['Twin lecture theatres', 'about 4'],
          ['Institutes', '3'],
          ['Postgraduate School building', '1'],
          ['ASUU hall', '1'],
        ],
        undefined,
        'Every university building is connected to the national grid. Grid supply averages about 4 hours a day, so solar and generators provide the rest: generators are rarely needed in the key facilities with solar, and other faculty buildings use at least 2 hours of generator power a day.'
      ),
      table(
        'Internet Connectivity',
        ['Service', 'Facilities covered'],
        [
          ['100 Mbps dedicated internet', 'CBT Centre; Senate Building; University Library; e-Library; Faculty of Science; Female Hostel'],
          ['Starlink satellite internet', 'Senate Building; ICT Complex'],
        ],
        undefined,
        'The Senate Building has both the 100 Mbps link and Starlink, so administration stays online if one connection fails. Students in the Female Hostel have access to the 100 Mbps network.'
      ),
      table(
        'Measured Traffic on the Main Link',
        ['Reading', 'Download', 'Upload', 'Packets per second (down / up)'],
        [
          ['Reading 1', '129.0 Mbps', '4.2 Mbps', '11,706 / 4,656'],
          ['Reading 2', '115.0 Mbps', '2.4 Mbps', '10,317 / 3,427'],
        ],
        undefined,
        'Two readings from the university’s MikroTik bandwidth manager on the main internet link (Cambium), Directorate of ICT/MIS, October 2026.'
      ),
      table(
        'ICT Infrastructure and Support',
        ['Facility or service', 'Details'],
        [
          ['TETFund ICT Experience Centre', 'Digital learning facility from the TETFund 2024 intervention, running on grid and solar power'],
          ['ICT Complex', 'Starlink connectivity and 24-hour power from grid, solar and generator'],
          ['ICT technical staff', '16 ICT technical staff, who also support computer-based examinations'],
          ['Computer-Based Test Centre', '24-hour power and 100 Mbps internet for examinations and screening'],
          ['3MTT training centre', `The ICT Complex hosts the national [3 Million Technical Talent (3MTT) programme](${R.threeMtt}) as an Applied Learning Cluster`],
          ['Cybersecurity', 'TSU was represented at the Office of the National Security Adviser’s strategic session on strengthening national cybersecurity resilience (November 2025)'],
        ]
      ),
    ],
    [
      'Power sources, solar capacity, grid and generator hours, building count, internet and Starlink coverage: Directorate of ICT/MIS and Works Department, October 2026.',
      'Traffic readings: MikroTik bandwidth manager screenshots, Directorate of ICT/MIS, October 2026.',
      'ICT Experience Centre: TSU TETFund interventions page. ICT technical staff: Directorate of ICT/MIS staff list.',
    ],
    'October 2026'
  )
)

// 19 — Africa-Priority Research
docs.push(
  doc(
    'Africa-Priority Research',
    19,
    17,
    'TSU research that addresses Africa’s development priorities, tagged by theme: food security, health, climate and environment, digital transformation, education, and peace and security.',
    [
      { value: '17', label: 'Documented publications tagged by theme' },
      { value: '6', label: 'Climate, environment & natural resources' },
      { value: '5', label: 'Food security & agriculture' },
      { value: '5', label: 'Health & disease' },
    ],
    [
      bars('Publications by Africa-Priority Theme', [
        ['Climate, environment & natural resources', 100, '6'],
        ['Health & disease', 83, '5'],
        ['Food security & agriculture', 83, '5'],
        ['Digital transformation', 50, '3'],
        ['Peace, security & governance', 33, '2'],
        ['Education', 17, '1'],
      ]),
      note('info', 'A publication can address more than one theme, so theme counts add up to more than the number of publications.'),
      table(
        'Tagged Publications',
        ['Year', 'Publication', 'Africa-priority theme(s)', 'Indexing'],
        [
          ['2021', '[How social media crisis response and social interaction is helping people recover from Covid-19: an empirical investigation](https://doi.org/10.1007/s42001-021-00151-7)', 'Health & disease; Digital transformation', 'Scopus'],
          ['2022', '[How advanced technological approaches are reshaping sustainable social media crisis management and communication: a systematic review](https://doi.org/10.3390/su14105854)', 'Digital transformation', 'Scopus; Web of Science'],
          ['2022', 'Pedometric and morphological characterization of soils of Kona District, Taraba State', 'Food security & agriculture', ''],
          ['2023', '[Multifaceted analytical flood risk assessment in major tributaries of the River Benue basin, Taraba State](https://academicjournals.org/journal/AJEST/article-full-text/D0CA05C70250)', 'Climate, environment & natural resources', ''],
          ['2023', '[Assessment of agro-allied chemical pollution on surface water quality of River Lamurde and Mayo-Gwoi, Jalingo](https://doi.org/10.21926/aeer.2301008)', 'Climate, environment & natural resources; Food security & agriculture', ''],
          ['2024', '[Global trend assessment of land use and land cover changes: a systematic approach to future research development and planning](https://doi.org/10.1016/j.jksus.2024.103262)', 'Climate, environment & natural resources', 'Scopus; Web of Science'],
          ['2024', '[Commoditizing of human beings: the implications of kidnapping on national security in Nigeria](https://www.iiste.org/Journals/index.php/DCS/article/download/62372/64410)', 'Peace, security & governance', ''],
          ['2024', '[The media and civil protests in Africa: contextualising Nigerian press coverage of #EndSARS](https://doi.org/10.1080/17447143.2024.2394105)', 'Peace, security & governance', ''],
          ['2025', '[Diversity assessments of native and alien vascular plants in Gashaka Gumti National Park, northeast Nigeria](https://doi.org/10.11646/phytotaxa.717.2.4)', 'Climate, environment & natural resources', 'Scopus; Web of Science'],
          ['2025', '[An investigation into use of technology for online learning in Taraba State University](https://rsisinternational.org/journals/ijriss/articles/an-investigation-into-use-of-technology-for-online-learning-in-taraba-state-university-nigeria/)', 'Digital transformation; Education', ''],
          ['2025', '[Spatial distribution and geospatial modeling of potential spread of secondary malaria vectors species in Nigeria](https://doi.org/10.1371/journal.pone.0320531)', 'Health & disease', 'Scopus; Web of Science (SCIE)'],
          ['2025', '[Geophagia among pregnant women: evaluating the microbiological and toxicological safety of calabash chalk](https://doi.org/10.1007/s10653-025-02656-w)', 'Health & disease', 'Scopus; Web of Science (SCIE)'],
          ['2025', '[Domestication and market potential of indigenous mushrooms in Nigeria and Kenya](https://doi.org/10.1007/s44187-025-00452-0)', 'Food security & agriculture', ''],
          ['2026', '[Development, functional profiling, and probiotic evaluation of indigenous LAB from Nigerian fermented foods](https://doi.org/10.1007/s11274-026-05051-4)', 'Food security & agriculture; Health & disease', 'Scopus; Web of Science'],
          ['2026', '[Cash crop cultivation and deforestation dynamics in Kurmi Local Government Area, Taraba State](https://www.researchgate.net/publication/410869998_Cash_Crop_Cultivation_and_Deforestation_Dynamics_in_Kurmi_Local_Government_Area_Taraba_State_Nigeria)', 'Climate, environment & natural resources; Food security & agriculture', ''],
          ['2026', '[Analysis of the impact of land use and land cover changes on soil erosion at the River Lamurde catchment area](https://www.researchgate.net/publication/410877389_Analysis_of_the_Impact_of_Land_Use_and_Land_Cover_Changes_on_Soil_Erosion_at_the_River_Lamurde_Catchment_Area)', 'Climate, environment & natural resources', ''],
          ['Year not stated', 'Evaluation of antimicrobial properties of five medicinal plants used against bacterial infections in Jalingo, Nigeria', 'Health & disease', ''],
        ]
      ),
      table(
        'Researcher Strengths in Africa-Priority Fields',
        ['Scholar', 'Field', 'World rank', 'Nigeria rank'],
        [
          [`[Prof. Emeka Daniel Oruonye](${SI('a13b1b14f78782902209271db1638a62')})`, 'Gender, Education, and Development Issues', '35', '6'],
          [`[Dr Nsemba Edward Lenshie](${SI('d4ebc50ee5a848bfa746d0ba85fb514f')})`, 'Peacebuilding and International Security', '272', '1'],
          [`[Dr Nsemba Edward Lenshie](${SI('d4ebc50ee5a848bfa746d0ba85fb514f')})`, 'Political Conflict and Governance', '346', '1'],
          [`[Dr Oberiri Destiny Apuke](${SI('fb476a726afd6a418877674e868c236c')})`, 'Misinformation and Its Impacts', '78', '1'],
          [`[Dr Umar Ali Bukar](${SI('59c16026d90f02eed1575f2093505e26')})`, 'Disaster Management and Resilience', '626', '2'],
          [`[Mrs Alice Njolke Mafe](${SI('21e431505b2b901bfded8858fc1a5051')})`, 'Probiotics and Fermented Foods', '674', '2'],
          [`[Dr Buhari Shehu Miapyen](${SI('021de48dfa4e55d8a7d15dcd6766644e')})`, 'Religion, Society, and Development', '819', '14'],
          [`[Dr Vincent Nduka Ojeh](${SI('a975ea9b92413d92f40d968ad89feeb2')})`, 'Oil, Gas, and Environmental Issues', '374', '47'],
        ],
        undefined,
        'TSU scholars ranked among the world’s top 1,000 in fields that match Africa-priority themes (Scholarly Index, 2026 edition, public beta).'
      ),
      note(
        'info',
        'Malaria and vector-borne disease research: Prof. Elkanah Obadiah Sambo and Dr Liatu Garba Columbus (Biological Sciences) co-authored a 2025 national study modelling the spread of secondary malaria vector species across Nigeria (PLOS ONE). Prof. Sambo’s Global Fund (₦60m) and ANOSTEP (₦140m) grants in public health entomology and a Pfizer grant (₦25m) for antimicrobial resistance studies total ₦225m, alongside a Global Fund project covering nine African countries and a research partnership with the Ifakara Health Institute, Tanzania.',
        { href: R.grants, label: 'See grants and partners' }
      ),
    ],
    [
      'Publications: articles verified for TSU’s International Collaboration and TETFund-Supported Research pages; themes assigned by subject.',
      'Researcher fields: Scholarly Index Top1000 Scholars, 2026 edition (public beta).',
      'Malaria research, grants and three added publications: Department of Biological Sciences return and staff data forms (October 2026); article details from each DOI.',
    ],
    'October 2026'
  )
)

// 20 — Graduate Entrepreneurship & Start-ups
docs.push(
  doc(
    'Graduate Entrepreneurship & Start-ups',
    20,
    18,
    'How TSU prepares students to start businesses, through entrepreneurship training, mentorship and links with technology hubs.',
    [
      { value: '400–500', label: 'Levels receiving entrepreneurship training' },
      { value: '100–500', label: 'Levels covered by mentorship and coaching' },
      { value: '55', label: 'Students placed with technology hubs' },
    ],
    [
      table(
        'Entrepreneurship Training and Mentorship',
        ['Programme', 'Details'],
        [
          ['Entrepreneurship training', 'Delivered to students in 400 and 500 level, with TETFund support'],
          ['Mentorship and coaching', 'Activities for students from 100 to 500 level, with TETFund support'],
          ['Entrepreneurship Directorate', 'Hosted 11 students on industrial placement'],
          ['Technology hubs', 'Students placed with the Technology Incubation House, Jalingo (23), Algaddaf Technology Hub (25) and Stena IT Academy (7)'],
          ['Digital skills for employment', `The ICT Complex is a training centre for the national [3MTT programme](${R.threeMtt}), with Fellows matched to internships and jobs`],
          ['Commercialisation', 'TSU staff attended TETFund training on technology transfer and commercialization in December 2025'],
          ['B.Ed. Entrepreneurship', `New degree approved by the NUC, admitting students from 2026/2027 ([see the register](${R.nuc}))`],
        ]
      ),
      note('info', 'Where TSU students are placed for industrial training, by employer and sector.', {
        href: R.industry,
        label: 'See student placements by employer',
      }),
    ],
    ['Entrepreneurship training, mentorship and placements: supplied by the university, October 2026.'],
    'October 2026'
  )
)
// 22 — Institutional AI Policy
docs.push(
  doc(
    'Institutional AI Policy',
    22,
    19,
    'TSU’s draft policy on the responsible and ethical use of artificial intelligence, including generative AI, in teaching, assessment, research and administration, now before Senate for approval.',
    [
      { value: 'Draft', label: 'Before Senate for approval' },
      { value: '21', label: 'Policy sections, plus 4 appendices' },
      { value: '2 years', label: 'Maximum interval between reviews' },
    ],
    [
      table(
        'Policy at a Glance',
        ['Item', 'Details'],
        [
          ['Policy title', 'Responsible and Ethical Use of Artificial Intelligence Policy'],
          ['Status', 'Draft for Senate, version 1.0'],
          ['Applies to', 'All students, academic and non-teaching staff, researchers, visiting scholars, contractors and consultants, and all AI systems used for University purposes'],
          ['Approving body', 'Senate, with oversight by the Governing Council'],
          ['Effective date', 'On approval by Senate'],
          ['Review', 'At least every two years, or sooner if technology, law or regulation changes'],
        ]
      ),
      table(
        'What the Policy Covers',
        ['Area', 'Where in the policy'],
        [
          ['Teaching and learning', 'Section 7'],
          ['Assessment and examinations', 'Section 8 and Appendix A'],
          ['Research', 'Section 9'],
          ['Academic integrity and plagiarism', 'Sections 6, 15, 18 and 19'],
          ['Data protection and privacy', 'Section 11'],
          ['Responsible and ethical AI use', 'Sections 5, 12, 13 and 14'],
        ]
      ),
      table(
        'Key Provisions',
        ['Principle', 'What it means'],
        [
          ['Human responsibility', 'AI supports human decisions but never replaces accountable human judgement on grades, admissions, discipline, employment or finance.'],
          ['Clear rules for every assessment', 'Each assessment is classed as A (AI prohibited), B (restricted), C (permitted) or D (required), and students are told in advance.'],
          ['Disclosure', 'Students, staff and researchers declare material AI use, using the model declarations in the policy.'],
          ['Research integrity', 'AI must not fabricate data, references or results, and cannot be listed as an author.'],
          ['Data protection', 'Personal data, student records, examination material and unpublished research must not be entered into unapproved AI tools.'],
          ['Fair process', 'An AI-detector score alone is never treated as proof of misconduct, and affected people can ask for human review.'],
          ['Fairness and access', 'Users check AI output for bias, and the University will work to reduce unequal access to paid AI tools.'],
          ['AI literacy', 'Regular training for students and staff on verification, citation, privacy, bias, copyright and assessment design.'],
        ]
      ),
      table(
        'Who Is Responsible',
        ['Office', 'Role under the policy'],
        [
          ['Governing Council and Senate', 'Approve and oversee the policy and major amendments'],
          ['Vice-Chancellor and Management', 'Leadership, resources and risk oversight'],
          ['Faculties and departments', 'Set AI rules for each assessment and promote AI literacy'],
          ['Directorate of ICT/MIS', 'Secure AI infrastructure, risk assessment and technical guidance'],
          ['University Library', 'Training in information literacy, citation and source checking'],
          ['Research Directorate and Postgraduate School', 'AI guidance in research integrity and supervision'],
        ]
      ),
      note(
        'info',
        'TSU’s ICT Complex is a 3MTT training centre, and the Faculty of Computing and Artificial Intelligence has NUC approval for three new degrees from 2026/2027: B.Sc. Data Science, B.Sc. Information and Communication Technology and B.Sc. Software Engineering.',
        { href: '/academics', label: 'Explore TSU’s faculties and programmes' }
      ),
    ],
    [
      'Taraba State University, Responsible and Ethical Use of Artificial Intelligence Policy, version 1.0 (October 2026).',
      'New programmes: NUC approval letter NUC/AP/S31/VOL.I/310, 1 June 2026. 3MTT: MoU between SAIL Empowerment Foundation and TSU (2025).',
    ],
    'October 2026'
  )
)

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(new URL('./facts-figures-content.ndjson', import.meta.url), ndjson)
console.log(`Wrote ${docs.length} statisticIndicator documents to scripts/facts-figures-content.ndjson`)
