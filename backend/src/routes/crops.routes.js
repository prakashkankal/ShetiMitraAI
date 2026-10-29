import { Router } from 'express'
import { listCrops, getCrop } from '../controllers/crops.controller.js'

const router = Router()

router.get('/', listCrops)
router.get('/:id', getCrop)

export default router
