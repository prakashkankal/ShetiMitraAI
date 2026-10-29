import mongoose from 'mongoose'

const cropSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    crop: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, required: true },
    pathogenType: { type: String, required: true },
    reviewedBy: { type: String, default: '' },
    weatherRisk: { type: String, default: '' },
    symptoms: { type: [String], default: [] },
    cultural: { type: [String], default: [] },
    chemical: { type: [String], default: [] },
  },
  { timestamps: true }
)

export const Crop = mongoose.model('Crop', cropSchema)
