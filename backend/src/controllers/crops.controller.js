import { Crop } from '../models/Crop.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listCrops = asyncHandler(async (req, res) => {
  const { crop } = req.query
  const query = crop ? { crop: { $regex: new RegExp(`^${crop}$`, 'i') } } : {}
  const crops = await Crop.find(query).sort({ crop: 1, name: 1 }).lean()
  return res.json(new ApiResponse(200, 'Crops retrieved', crops))
})

export const getCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).lean()
  if (!crop) throw new ApiError(404, 'Crop/disease not found', 'NOT_FOUND')
  return res.json(new ApiResponse(200, 'Crop retrieved', crop))
})
