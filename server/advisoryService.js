/**
 * Agricultural advisory rule-based service for ShetiMitra AI.
 * Converted from Python FastAPI to Node.js / Express.js.
 */

export const LEAF_MARKERS = {
  mr: ['पान', 'रोग', 'डाग', 'करडा', 'पिवळ', 'करपा'],
  hi: ['पत्ता', 'पत्ते', 'रोग', 'धब्ब', 'पीला', 'झुलसा'],
  en: ['leaf', 'leaves', 'symptom', 'spot', 'yellow', 'blight'],
}

export const HELP_MARKERS = {
  mr: ['मदत', 'पीक', 'काय करावे', 'उपाय', 'खत', 'पाणी'],
  hi: ['मदद', 'फसल', 'क्या करें', 'उपाय', 'खाद', 'सिंचाई'],
  en: ['crop', 'farm', 'help', 'advice', 'protect', 'fertilizer', 'water'],
}

export const DISCLAIMER = {
  mr: 'हे फक्त नियम-आधारित DEMO सल्ला आहे. रोगाचे निदान किंवा प्रमाणित उपचार नाही.',
  hi: 'यह केवल नियम-आधारित DEMO सलाह है। यह रोग निदान या प्रमाणित उपचार नहीं है।',
  en: 'This is rule-based DEMO advice only. It is not a diagnosis or verified treatment.',
}

export const UNCERTAIN = {
  mr: 'माझ्याकडे या प्रश्नाचे प्रमाणित उत्तर उपलब्ध नाही. कृपया स्थानिक कृषी केंद्र किंवा कृषि अधिकारी यांच्याशी संपर्क साधा.',
  hi: 'मेरे पास इस प्रश्न का सत्यापित उत्तर उपलब्ध नहीं है। कृपया स्थानीय कृषि केंद्र या कृषि अधिकारी से संपर्क करें।',
  en: 'I do not have a verified answer for this question. Please consult your local Krishi Kendra or agriculture officer.',
}

export const SAFE_GUIDANCE = {
  mr: 'संभाव्य संसर्ग पसरू नये म्हणून प्रभावित पाने अलग ठेवा, हात धुवून ठेवावेत आणि अधिकृत शेतकरी सल्लागाराला पानांची स्पष्ट छायाचित्रे दाखवा. औषधाचे नाव किंवा मात्रा वापरू नका.',
  hi: 'संभावित संक्रमण फैलने से रोकने के लिए प्रभावित पत्तियों को अलग रखें, हाथ धोएँ और स्पष्ट फोटो किसी अधिकृत कृषि सलाहकार को दिखाएँ। कोई दवा का नाम या मात्रा न लगाएँ।',
  en: 'To limit possible spread, isolate affected leaves, wash hands, and show clear photos to an authorized agricultural adviser. Do not apply an invented pesticide or chemical dose.',
}

export const HELP_GUIDANCE = {
  mr: 'पीकाचे निरीक्षण नियमित करा, पाण्याचा ओघ आणि मातीचे निचरा तपासा आणि तुमच्या पिकाचे नाव, लक्षणे व छायाचित्रे स्थानिक कृषी केंद्राशी शेअर करा.',
  hi: 'फसल की नियमित जाँच करें, सिंचाई और मिट्टी की जल निकासी देखें और फसल का नाम, लक्षण तथा फोटो स्थानीय कृषि केंद्र के साथ साझा करें।',
  en: 'Inspect crops regularly, check irrigation and soil drainage, and share the crop name, symptoms, and photos with a local Krishi Kendra.',
}

/**
 * Return safe agricultural demo guidance.
 * @param {string} text
 * @param {'mr'|'hi'|'en'} language
 * @returns {string}
 */
export function getAdvisory(text = '', language = 'en') {
  const lang = ['mr', 'hi', 'en'].includes(language) ? language : 'en'
  const normalized = (text || '').toLowerCase().trim()

  if (!normalized) {
    return UNCERTAIN[lang]
  }

  const leafMatch = (LEAF_MARKERS[lang] || []).some((marker) => normalized.includes(marker))
  if (leafMatch) {
    return `${DISCLAIMER[lang]}\n\n${SAFE_GUIDANCE[lang]}\n\n${UNCERTAIN[lang]}`
  }

  const helpMatch = (HELP_MARKERS[lang] || []).some((marker) => normalized.includes(marker))
  if (helpMatch) {
    return `${DISCLAIMER[lang]}\n\n${HELP_GUIDANCE[lang]}`
  }

  return UNCERTAIN[lang]
}
