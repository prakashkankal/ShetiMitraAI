import { Detection } from '../models/Detection.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createDetectionSchema } from '../validators/detection.validator.js'
import { uploadImage, deleteImage } from '../services/storage.service.js'
import { analyseLeafImage } from '../services/inference.service.js'

export const createDetection = asyncHandler(async (req, res) => {
  const parsed = createDetectionSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message, 'VALIDATION_ERROR')
  }

  const { cropType, selectedLanguage = 'en' } = parsed.data
  let imageUrl = null
  let imageThumbnailUrl = null
  let cloudinaryPublicId = null

  // Upload image if provided
  if (req.file) {
    const uploadResult = await uploadImage(req.file.buffer)
    imageUrl = uploadResult.url
    imageThumbnailUrl = uploadResult.thumbnailUrl
    cloudinaryPublicId = uploadResult.publicId
  }

  // Run AI inference
  let detectionData
  if (req.file) {
    const inference = await analyseLeafImage(req.file.buffer, cropType)
    if (inference.available && inference.result) {
      detectionData = inference.result
    } else {
      return res.status(503).json(new ApiResponse(503, 'AI inference not available', {
        available: false,
        reason: inference.reason || 'AI_UNAVAILABLE',
        message: 'The AI disease detection model is not configured on this server. Please set AI_API_KEY to enable real inference.',
      }))
    }
  } else {
    throw new ApiError(400, 'Image file is required for disease detection', 'IMAGE_REQUIRED')
  }

  const detection = await Detection.create({
    userId: req.user?._id || null,
    cropType,
    imageUrl,
    imageThumbnailUrl,
    cloudinaryPublicId,
    selectedLanguage,
    modelVersion: 'gemini-vision-1.0',
    ...detectionData,
  })

  return res.status(201).json(new ApiResponse(201, 'Detection complete', detection))
})

export const getSampleDetections = asyncHandler(async (req, res) => {
  const samples = await Detection.find({ isDemo: true, isDeleted: false }).sort({ createdAt: 1 }).lean()
  return res.json(new ApiResponse(200, 'Sample detections retrieved', samples))
})

export const listDetections = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)))
  const skip = (page - 1) * limit

  // If user is authenticated, retrieve their records; otherwise return demo dataset
  const query = req.user
    ? { userId: req.user._id, isDeleted: false }
    : { isDemo: true, isDeleted: false }

  const [items, total] = await Promise.all([
    Detection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Detection.countDocuments(query),
  ])

  return res.json(new ApiResponse(200, 'Detections retrieved', {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }))
})

export const getDetection = asyncHandler(async (req, res) => {
  const detection = await Detection.findOne({ _id: req.params.id, isDeleted: false }).lean()
  if (!detection) throw new ApiError(404, 'Detection not found', 'NOT_FOUND')

  if (detection.userId && detection.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied', 'FORBIDDEN')
  }

  return res.json(new ApiResponse(200, 'Detection retrieved', detection))
})

export const deleteDetection = asyncHandler(async (req, res) => {
  const detection = await Detection.findOne({ _id: req.params.id, isDeleted: false })
  if (!detection) throw new ApiError(404, 'Detection not found', 'NOT_FOUND')

  if (detection.userId && detection.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied', 'FORBIDDEN')
  }

  // Soft delete
  detection.isDeleted = true
  await detection.save()

  // Optionally clean Cloudinary image
  if (detection.cloudinaryPublicId) {
    await deleteImage(detection.cloudinaryPublicId)
  }

  return res.json(new ApiResponse(200, 'Detection deleted'))
})
