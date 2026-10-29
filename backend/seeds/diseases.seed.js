import 'dotenv/config'
import dns from 'node:dns'
import mongoose from 'mongoose'
import { Crop } from '../src/models/Crop.model.js'
import { Detection } from '../src/models/Detection.model.js'

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
} catch {
  // Safe fallback
}

const DEMO_DETECTIONS = [
  {
    cropType: 'Tomato',
    sampleKey: 'sampleEarlyBlight',
    diseaseName: 'Tomato Early Blight (अगेती करपा)',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal Pathogen',
    confidence: 94,
    status: 'high',
    predictions: [
      { name: 'Early Blight (Alternaria solani)', score: 94 },
      { name: 'Septoria Leaf Spot', score: 4 },
      { name: 'Late Blight', score: 2 },
    ],
    symptoms:
      'Dark brown to black spots with concentric rings ("target board" pattern) appearing primarily on older lower leaves. Surrounding tissue turns pale yellow, leading to premature leaf defoliation.',
    culturalControl:
      'Remove and destroy infected leaves immediately. Ensure 60cm plant spacing for adequate aeration. Water at the base via drip lines; avoid wetting the canopy.',
    chemicalPrecautions:
      'Spray Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3.0 g/L water. For active systemic cure, spray Azoxystrobin 23% SC @ 1.0 ml/L.',
    proTip:
      'Early blight spores overwinter in dry plant debris and soil. Practice at least a 2-year crop rotation avoiding brinjal, chilli, and potato.',
    imageUrl:
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop',
    isDemo: true,
  },
  {
    cropType: 'Tomato',
    sampleKey: 'sampleLateBlight',
    diseaseName: 'Tomato Late Blight (पछेती करपा)',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Oomycete / Water Mold',
    confidence: 91,
    status: 'high',
    predictions: [
      { name: 'Late Blight (Phytophthora infestans)', score: 91 },
      { name: 'Early Blight', score: 6 },
      { name: 'Buckeye Fruit Rot', score: 3 },
    ],
    symptoms:
      'Irregular, water-soaked dark olive lesions that rapidly expand and turn black. Under high humidity, white velvety fungal down appears on the lower leaf surface.',
    culturalControl:
      'Uproot and burn severely infected plants. Ensure fast soil drainage. Avoid excessive nitrogen applications which promote lush, vulnerable leaf growth.',
    chemicalPrecautions:
      'Preventive spray: Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L. If disease is rapidly spreading, apply Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L.',
    proTip:
      'Late blight thrives during cool, damp weather with humidity >85% and temperatures between 16-22°C. Inspect fields daily under foggy conditions.',
    imageUrl:
      'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&auto=format&fit=crop',
    isDemo: true,
  },
  {
    cropType: 'Tomato',
    sampleKey: 'sampleLeafCurl',
    diseaseName: 'Tomato Leaf Curl (चुरडा-मुरडा)',
    scientificName: 'Tomato Leaf Curl Virus (ToLCV)',
    pathogenType: 'Viral (Transmitted by Whiteflies)',
    confidence: 88,
    status: 'high',
    predictions: [
      { name: 'Tomato Leaf Curl Virus', score: 88 },
      { name: 'Tomato Mosaic Virus', score: 8 },
      { name: 'Healthy Leaf', score: 4 },
    ],
    symptoms:
      'Severe upward and downward curling of leaflets with puckering and vein clearing. Plants become stunted and bushy, with drastically reduced flowering and fruit set.',
    culturalControl:
      'Install 15-20 yellow sticky traps per acre to monitor and capture whitefly vectors. Plant border rows of maize or sorghum to block incoming insects.',
    chemicalPrecautions:
      'Chemicals cannot cure the virus once inside the plant. To control the whitefly vector, spray Diafenthiuron 50% WP @ 1.2 g/L or Acetamiprid 20% SP @ 0.3 g/L.',
    proTip:
      'Spray insecticidal solutions on the underside of leaves during the morning hours when whiteflies are less active.',
    imageUrl:
      'https://images.unsplash.com/photo-1595872018818-97555653a011?w=600&auto=format&fit=crop',
    isDemo: true,
  },
  {
    cropType: 'Tomato',
    sampleKey: 'sampleHealthy',
    diseaseName: 'Healthy Crop Foliage (निरोगी पान)',
    scientificName: 'Solanum lycopersicum',
    pathogenType: 'None (Healthy)',
    confidence: 96,
    status: 'healthy',
    predictions: [
      { name: 'Healthy Tomato Foliage', score: 96 },
      { name: 'Early Stage Blight', score: 3 },
      { name: 'Nutrient Deficiency', score: 1 },
    ],
    symptoms:
      'Uniform vibrant green color, strong leaf margins, clean venation, and zero necrotic lesions or curling.',
    culturalControl:
      'Continue regular soil health maintenance. Apply bio-agents like Trichoderma viride and Pseudomonas fluorescens near roots to build systemic resistance.',
    chemicalPrecautions: 'No chemical intervention required.',
    proTip:
      'Maintain steady drip fertigation and avoid letting the soil dry out completely between irrigation rounds to prevent calcium deficiency (Blossom End Rot).',
    imageUrl:
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop',
    isDemo: true,
  },
  {
    cropType: 'Tomato',
    sampleKey: 'sampleUncertain',
    diseaseName: 'Uncertain / Unclear Leaf Sample',
    scientificName: 'Confidence Below Validated Threshold',
    pathogenType: 'Uncertain',
    confidence: 48,
    status: 'uncertain',
    predictions: [
      { name: 'Unidentified Foliar Spot', score: 48 },
      { name: 'Leaf Mold / Sun Scald', score: 28 },
      { name: 'Mechanical Soil Injury', score: 24 },
    ],
    symptoms:
      'Image is blurry, shadowed, or leaf features are obstructed, preventing reliable computer vision classification.',
    culturalControl: 'Please retake a sharper photo under steady daylight.',
    chemicalPrecautions: 'Chemical treatment withheld for safety reasons.',
    proTip:
      'In compliance with PRD safety standards, ShetiMitra AI refuses to guess uncertain diagnoses to prevent costly and hazardous misapplications of agrochemicals.',
    imageUrl:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop',
    isDemo: true,
  },
]

const DISEASES = [
  {
    slug: 'tomato-early-blight',
    crop: 'Tomato',
    name: 'Early Blight (लवकर येणारा करपा)',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal Pathogen',
    reviewedBy: 'Dr. R. V. Patil, Agronomist (MPKV Rahuri)',
    weatherRisk: 'Temp: 22-28°C, Relative Humidity: >80%, Intermittent rainfall',
    symptoms: [
      'Brown to black circular spots with concentric rings ("target board" pattern) on older foliage.',
      'Chlorotic yellow halos developing around each spot.',
      'Severe defoliation exposing green tomatoes to sunscald injury.',
    ],
    cultural: [
      'Practice 2 to 3-year crop rotation avoiding Solanaceae family (potato, chilli, brinjal).',
      'Remove and destroy diseased lower leaves; do not compost infected plant residue.',
      'Maintain 60cm plant-to-plant spacing to facilitate rapid drying of foliage.',
      'Adopt drip irrigation instead of overhead furrow or sprinkler irrigation.',
    ],
    chemical: [
      'Preventive: Spray Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3.0 g/L.',
      'Curative (Active Spread): Spray Azoxystrobin 23% SC @ 1.0 ml/L or Difenoconazole 25% EC @ 0.5 ml/L.',
      'Disclaimer: Always adhere to the 7-day pre-harvest waiting interval (PHI).',
    ],
  },
  {
    slug: 'tomato-late-blight',
    crop: 'Tomato',
    name: 'Late Blight (उशिरा येणारा करपा)',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Oomycete / Water Mold',
    reviewedBy: 'Dr. S. K. Deshmukh, Plant Pathologist',
    weatherRisk: 'Temp: 15-22°C, Continuous fog/drizzle, Humidity: >85%',
    symptoms: [
      'Water-soaked pale green lesions on leaves rapidly expanding into oily dark brown or purplish areas.',
      'Delicate white fungal down (sporangiophores) appearing on leaf undersides in humid mornings.',
      'Brown firm rot on green and ripe tomato fruits.',
    ],
    cultural: [
      'Destroy all volunteer tomato and potato plants near the plot.',
      'Avoid high nitrogen top-dressing during foggy winter weather.',
      'Ensure prompt field drainage to eliminate standing puddles.',
    ],
    chemical: [
      'Preventive: Spray Chlorothalonil 75% WP @ 2 g/L or Mancozeb 75% WP @ 2.5 g/L.',
      'Curative: Spray Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L or Dimethomorph 50% WP @ 1.0 g/L.',
    ],
  },
  {
    slug: 'tomato-leaf-curl-virus',
    crop: 'Tomato',
    name: 'Tomato Leaf Curl Virus (चुरडा-मुरडा)',
    scientificName: 'Tomato Leaf Curl New Delhi Virus (ToLCNDV)',
    pathogenType: 'Viral (Vector: Whitefly Bemisia tabaci)',
    reviewedBy: 'Prof. M. B. Shinde, KVK Pune',
    weatherRisk: 'Warm dry spells (28-35°C) which trigger explosive whitefly breeding',
    symptoms: [
      'Puckered, thickened leaves curled upward and inward into cup shapes.',
      'Severe plant stunting, shortened internodes, and bushy appearance.',
      'Blossom drop; plants fail to set marketable fruit.',
    ],
    cultural: [
      'Erect 15-20 yellow sticky cards per acre to trap adult whiteflies.',
      'Grow barrier rows of maize or sorghum (3-4 rows around the tomato plot).',
      'Rogue out and destroy infected seedlings within 30 days of transplanting.',
    ],
    chemical: [
      'Insect vector control: Spray Diafenthiuron 50% WP @ 1.2 g/L or Acetamiprid 20% SP @ 0.3 g/L.',
      'Organic vector repellent: Spray 5% Neem seed kernel extract (NSKE) @ 5 ml/L.',
    ],
  },
  {
    slug: 'cotton-pink-bollworm',
    crop: 'Cotton',
    name: 'Cotton Pink Bollworm (गुलाबी बोंडअळी)',
    scientificName: 'Pectinophora gossypiella',
    pathogenType: 'Lepidopteran Insect Pest',
    reviewedBy: 'Dr. A. N. Kale, CICR Nagpur',
    weatherRisk: 'Boll formation stage, warm humid climate',
    symptoms: [
      'Rosetted flowers with petals twisted together into a closed dome.',
      'Tiny entry holes on young green bolls that seal over with brownish callus.',
      'Internal feeding on seeds and lint staining; premature boll dropping.',
    ],
    cultural: [
      'Install 5 pheromone traps per acre at 45 days after sowing for ETL monitoring.',
      'Destroy crop residue and avoid ratooning cotton.',
      'Release Trichogramma bactrae parasitoid egg cards @ 60,000 eggs/acre.',
    ],
    chemical: [
      'If ETL exceeded (8 moths/trap/day for 3 consecutive days):',
      'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L.',
    ],
  },
  {
    slug: 'potato-black-scurf',
    crop: 'Potato',
    name: 'Potato Black Scurf & Canker (काळी चट्टे)',
    scientificName: 'Rhizoctonia solani',
    pathogenType: 'Soil-Borne Fungal Pathogen',
    reviewedBy: 'Dr. G. K. Joshi, Agronomy Extension',
    weatherRisk: 'Cold wet soil at planting time, poor soil drainage',
    symptoms: [
      'Hard black crusts (sclerotia) resembling soil particles sticking firmly to tuber skin.',
      'Sunken brown cankers on young sprouts causing delayed seedling emergence.',
      'Aerial tubers developing on leaf axils.',
    ],
    cultural: [
      'Use only certified disease-free seed tubers.',
      'Treat tubers with Trichoderma viride @ 10 g/kg seed before planting.',
      'Plant in warm, well-aerated ridges rather than deeply buried furrows.',
    ],
    chemical: [
      'Tuber dip treatment: Azoxystrobin 23% SC @ 2.5 ml/10L water before planting.',
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('[Seed] Connected to MongoDB')

  for (const item of DISEASES) {
    await Crop.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true })
    console.log(`[Seed] Upserted disease: ${item.name}`)
  }

  // Remove existing demo detections before re-seeding to keep it clean
  await Detection.deleteMany({ isDemo: true })
  for (const demo of DEMO_DETECTIONS) {
    await Detection.create(demo)
    console.log(`[Seed] Created demo detection: ${demo.diseaseName}`)
  }

  console.log('[Seed] All database demo data seeded successfully!')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('[Seed] Error:', err)
  process.exit(1)
})
