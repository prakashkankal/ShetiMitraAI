import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema(
  { name: String, score: Number },
  { _id: false }
)

const detectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    cropType: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: null },
    imageThumbnailUrl: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
    diseaseName: { type: String, required: true },
    scientificName: { type: String, default: '' },
    pathogenType: { type: String, default: '' },
    sampleKey: { type: String, default: null },
    confidence: { type: Number, min: 0, max: 100, required: true },
    status: { type: String, enum: ['high', 'uncertain', 'healthy'], required: true },
    predictions: { type: [predictionSchema], default: [] },
    symptoms: { type: String, default: '' },
    culturalControl: { type: String, default: '' },
    chemicalPrecautions: { type: String, default: '' },
    proTip: { type: String, default: '' },
    selectedLanguage: { type: String, enum: ['mr', 'hi', 'en'], default: 'en' },
    modelVersion: { type: String, default: 'YOLOv8-Tomato-v1.2' },
    isDemo: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

detectionSchema.index({ userId: 1, createdAt: -1 })

export const Detection = mongoose.model('Detection', detectionSchema)
