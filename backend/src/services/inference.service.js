import { config } from '../config/env.js'

/**
 * Call Gemini Vision API to analyse a leaf image.
 * Returns a structured detection result.
 * If AI key absent → returns { available: false }
 */
export async function analyseLeafImage(imageBuffer, cropType = 'tomato') {
  if (!config.hasAiKey) {
    return { available: false, reason: 'AI_KEY_NOT_CONFIGURED' }
  }

  try {
    const { default: fetch } = await import('node-fetch')
    const base64Image = imageBuffer.toString('base64')
    const mimeType = 'image/jpeg'

    const prompt = `You are an expert agricultural plant pathologist AI. Analyse this ${cropType} leaf image.

Respond ONLY with valid JSON in this exact schema (no markdown, no explanation):
{
  "diseaseName": "string – disease common name",
  "scientificName": "string – Latin binomial",
  "confidence": number 0-100,
  "status": "high" | "uncertain" | "healthy",
  "predictions": [
    { "name": "string", "score": number },
    { "name": "string", "score": number },
    { "name": "string", "score": number }
  ],
  "symptoms": "string – 1-2 sentences",
  "culturalControl": "string – 1-2 sentences",
  "chemicalPrecautions": "string – 1-2 sentences",
  "proTip": "string – 1 sentence"
}

Rules:
- If confidence < 65, set status to "uncertain" and do NOT provide chemical advice
- If leaf is healthy, set status to "healthy" and diseaseName to "Healthy Crop Foliage"
- predictions must sum to approximately 100
- Be conservative: agricultural safety is paramount`

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Image } },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.AI_MODEL}:generateContent?key=${config.AI_API_KEY}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API error ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const cleaned = textContent.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return { available: true, result: parsed }
  } catch (err) {
    console.error('[Inference] Gemini call failed:', err.message)
    return { available: false, reason: 'AI_INFERENCE_FAILED', error: err.message }
  }
}
