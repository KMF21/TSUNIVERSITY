// Builds the News post announcing the Department of Peace Studies and
// Conflict Resolution's maiden national conference and its published Book
// of Proceedings. Run: node scripts/build-peace-studies-post.mjs
// then: npx sanity dataset import scripts/peace-studies-post.ndjson production
//
// Uses Sanity's "_sanityAsset" import convention to upload the cover image
// and the PDF straight from scripts/assets/ as part of the dataset import —
// no manual upload through Studio needed.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// _sanityAsset only resolves reliably with an ABSOLUTE file:// path — a
// relative one (file://./assets/x.jpg) depends on the current working
// directory the import command happens to be run from, which is fragile.
// Resolving it here from this script's own location makes it work no
// matter where `sanity dataset import` is invoked from.
const assetPath = (name) => `file://${fileURLToPath(new URL(`./assets/${name}`, import.meta.url))}`

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: Math.random().toString(36).slice(2),
  style,
  children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  markDefs: [],
})

const bulletItem = (text) => ({
  _type: 'block',
  _key: Math.random().toString(36).slice(2),
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  markDefs: [],
})

// Paper title, authors (as printed in the table of contents)
const papers = [
  'Lead Paper: Violent Conflict and the Challenges of Development and Peacebuilding in Taraba State, Northeast Nigeria — John Tor Tsuwa',
  'Xenophobic Attacks and Nigerian-South African Investment Relations — Gambo J. Danlami, Buhari Shehu Miapyen and Emmanuel Adi',
  'Counter-Terrorism Strategies of the Nigerian Military and Socio-Economic Conditions of Civilians in the North-East, Nigeria — Jev Amos Asongo, Datol John Kojji, Danjuma Yusuf and Jessey Dearsley Dabale',
  'Farmers-Herders Conflict and Food Security: An Exploration of New Evidence from the Northeast, Nigeria — Isa Mohammed, Wonotanzokan Nzeda Tagowa, Agbo Uchechukwu Johnson and Ekanem Asukwo Ekanem',
  'Governance and Security Sector Reform in Nigeria: Toward Human Security and Resilient Peace — Shaku Justine Orangoholga and Korna Williams Kajiva',
  'Women Peacebuilders in Mediation Efforts: Challenges and Pathways for Inclusion in Taraba State — Ovenaone Jennifer Uniga, Grace Moses and Irisim Emmanuel Tabki',
  'The Role of Identity Politics in Fueling Political Divisions and Conflict in Nigeria — Onuk Bulus Ojem, Yahaya Abubakar Sadiq and Angama Chimegbe Dubagari',
  'An Assessment of Youth Contributions and Challenges in Peacebuilding in Taraba State, Nigeria (1991–2025) — Atando Dauda Agbu, Babale, Tanimu Shitta and Mikin Sam Ahmadu',
  'An Investigation of the Relationship between Communal Violence and Rural-Urban Migration in Wukari Local Government Area of Taraba State, 1991-2021 — Ayimishi Habila Ahima, Atando Dauda Agbu and Solomon Egashi Ahima',
  'Climate Variability and Irregular Internal Migration in Taraba State, Nigeria — Galadima Fredrick',
  'Communal Conflict and Social Cohesion Among Selected Communities in Wukari Local Government Area of Taraba State, Nigeria — Christiana Simon Josiah',
  'Gender and Peace Building in Nigeria: A Study of Participation in Conflict Resolution and Sustainable Peace — John Tobi',
  'The Influence of Insecurity on Business Activities in Jalingo Local Government Area, Taraba State, Nigeria — Nwosu Chinedu Everest',
  'The Role of Private Security Companies in Filling the Policing Gap in Abuja, Nigeria — Akintomide David Oladayo and Sani Gambo Yusuf',
  'Farmer-Herder Contestation and Development in Northern Senatorial District of Taraba State, Nigeria — Zaki Msem, Amos Asongo Jev and Patience Kondu Jacob',
  'Through a Comparative Lens: Unraveling the Public Perception of the Coverage of Farmers/Herders Conflict by Adamawa Broadcasting Corporation and Taraba State Broadcasting Service — Gibson Pwashikai and Oberiri Destiny Apuke',
  'Indigenous Conflict Resolution Mechanisms and Traditional Authority in Taraba State, Nigeria — John Tobi',
  'Impact of Climate Change on Farmers-Herders’ Conflict in North-East Nigeria — Bukar Alhaji Mustapha, Maryam Kyari Kaanami and Abubakar Ali',
  'Good Governance and Security Sector Reforms in Nigeria — Dandak, V. B. and Matawal, A. B.',
  'Grassroots Authority and Peacebuilding: Traditional Institutions and Inter-Ethnic Conflict Management in Southern Taraba, Nigeria — Ibrahim Salamatu Manu',
  'Impact of Boko Haram Insurgency on Organisational Viability in Northeast Nigeria — Nwosu Chinedu Everest',
  'From Localized Violence to Regional Insecurity: The Drivers and Spillover Mechanisms of Banditry and Kidnaping in Taraba State, Nigeria — Korna Williams Kajiva and Shaku Justine Orangoholga',
  'Nigeria-Cameroon Obligations under the 1951 Refugee Convention: Implications of Ambazonia-Biafra Separatist Agitations — Clement Peter, Yamte Teri Samaila and Christiana Simon Josiah',
  'Nigeria-China Trade Relations and Economic Development in Nigeria, 2015-2023 — Daniel Amos',
  'Peace Education and Socio-Economic Development in Taraba State, 2015-2024 — John Moses Maikomo and John Joseph',
  'Investigating Preferential Treatment of Inmates and Criminal Justice System in North-Central Nigeria — Clinton Odeh Agadas, Abdurrahman Imam Nuruddeen, Namaliya Nazeer Mukhtar and Agana E. Achinyang',
  'Evaluating the Role of Traditional and Religious Leadership in Promoting Peace in Taraba State: An Impact Assessment — Tanko Ibrahim Asetiya and Giwa Ande',
  'Western Education and Peaceful Coexistence in Taraba State: A Study of Communities in Southern Senatorial District — Irisim Tabki Emmanuel and Ovenaone Jennifer Uniga',
  'Traditional Rulers and Interfaith Dialogue in Wukari Local Government Area, Taraba State, Nigeria — John Samson Yamusa',
  'Discursive Constructions of Violence: A Study of Media Narratives, Rumor Mongering, and Conflict Escalation in Taraba State, Nigeria — Giwa Ande',
  'Artisanal Mining and Violent Conflict in Nigeria — John Tobi',
  'A Decade of Kidnapping in Adamawa and Taraba States, Northeastern Nigeria: Trends in Gender, Time, and Space — Nucha Suntai Gambo, Grace Moses Ako and Mercy Enocha Shiatia',
  'Women’s Participation in Peace Building and Post-Conflict Recovery: A Case Study of Internally Displaced Communities in Lau Local Government — Charity Amos',
  'Traditional Leaders, Religious Leaders and Peace Building in Taraba State, Nigeria — Sirajo Isa El-Yakub',
  'Traditional Leaders, Religious Leaders and Peace Building in Taraba State, Nigeria — Ibrahim Salamatu Manu',
  'The Role of Economic Sanctions in International Conflict Resolution: An Analysis of the Russia-Ukraine War — Akpurr Justin Aondohemba and Talatu B. Bello',
  'Farmer-Herder Crisis and Food Security in Northeast Nigeria — Hamidu Bello Abbare, Nucha Suntai Gambo and Grace Moses',
  'The Impact of Security Agencies on Peacebuilding in Taraba State, Northeast Nigeria — Caleb Yusuf',
  'Humanitarian Intervention and Refugee Protection: Assessing UNHCR’s Response to the Cameroonian Refugee Crisis in Benue State, Nigeria — Eunice Dooshima Akume and Nkemakolam Okorie',
  'Civil Society Organizations and Conflict Management in Takum Local Government Area of Taraba State, Nigeria — Rimamshon Tawum and Danjuma Yusuf',
  'The Multinational Joint Task Force in the Lake Chad Basin: A Strategic Look at Counterinsurgency Results — Ibrahim Abubakar and Tahir Mustapha Ibrahim',
  'Violent Conflicts and Grassroots Peacebuilding in Taraba State: Understanding Local Peace Processes in Sardauna Local Government Area — Victoria Daniel Gellah',
  'Women as Victims and Survival of Violent Conflicts in Taraba State — Kaya Lord Manaseh',
  'Gender-Based Violence (GBV) and the Socioeconomic Development of Women in the Informal Sector in Taraba State, Nigeria (2019 – 2024) — Samuel Ibrahim Jatau',
]

const body = [
  block(
    'The Department of Peace Studies and Conflict Resolution, Faculty of Social Sciences, Taraba State University, Jalingo, has published the Book of Proceedings from its maiden National Conference on "Violent Conflicts and Peacebuilding in Taraba State, Northeast Nigeria."'
  ),
  block(
    'The conference was held at Taraba State University on 30 November 2025, organised by the Department in collaboration with the Bureau for Peace and Conflict Resolution, Office of the Governor, Taraba State. It brought together scholars, researchers, policy analysts, civil society actors and practitioners to examine the dynamics of violent conflict and the possibilities for sustainable peacebuilding in Taraba State and the wider Northeast — covering themes from banditry, kidnapping and farmer-herder conflict to gender, youth, traditional authority, displacement and security-sector reform.'
  ),
  block(
    'The resulting volume (ISBN 978-978-68-9759-2), edited by a board led by Associate Professor Amos Jev Asongo as Editor-in-Chief, compiles more than 40 peer-reviewed papers from Taraba State University and partner institutions across Nigeria.'
  ),
  block('In This Volume', 'h3'),
  ...papers.map(bulletItem),
  block(
    'The full Book of Proceedings, including the complete lead paper and all contributions in full, is available to download below.'
  ),
]

const doc = {
  _id: 'post-peace-studies-book-of-proceedings-2026',
  _type: 'post',
  title:
    'Department of Peace Studies and Conflict Resolution Publishes Book of Proceedings from Maiden National Conference',
  slug: { _type: 'slug', current: 'peace-studies-book-of-proceedings-2026' },
  category: 'research',
  excerpt:
    'The Department of Peace Studies and Conflict Resolution has published the Book of Proceedings from its maiden national conference on violent conflict and peacebuilding in Taraba State.',
  mainImage: {
    _type: 'image',
    alt: 'Cover of the Book of Proceedings — Violent Conflicts and Peacebuilding in Taraba State, Northeast Nigeria',
    _sanityAsset: `image@${assetPath('peace-studies-proceedings-cover.jpg')}`,
  },
  body,
  authorNameOverride: 'Department of Peace Studies and Conflict Resolution',
  publishedAt: new Date().toISOString(),
  featured: false,
  attachment: {
    _type: 'file',
    _sanityAsset: `file@${assetPath('peace-studies-book-of-proceedings.pdf')}`,
  },
  attachmentLabel: 'Download the Book of Proceedings (PDF)',
}

writeFileSync(new URL('./peace-studies-post.ndjson', import.meta.url), JSON.stringify(doc) + '\n')
console.log('Wrote scripts/peace-studies-post.ndjson')
