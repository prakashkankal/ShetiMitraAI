"""Demo-only agricultural advisory. Replace with verified services later."""

from typing import Literal

Language = Literal["mr", "hi", "en"]

LEAF_MARKERS = {
    "mr": ("पान", "रोग", "डाग", "करडा", "पिवळ"),
    "hi": ("पत्ता", "पत्ते", "रोग", "धब्ब", "पीला"),
    "en": ("leaf", "leaves", "symptom", "spot", "yellow"),
}

HELP_MARKERS = {
    "mr": ("मदत", "पीक", "काय करावे", "उपाय"),
    "hi": ("मदद", "फसल", "क्या करें", "उपाय"),
    "en": ("crop", "farm", "help", "advice", "protect"),
}

DISCLAIMER = {
    "mr": "हे फक्त नियम-आधारित DEMO सल्ला आहे. रोगाचे निदान किंवा प्रमाणित उपचार नाही.",
    "hi": "यह केवल नियम-आधारित DEMO सलाह है। यह रोग निदान या प्रमाणित उपचार नहीं है।",
    "en": "This is rule-based DEMO advice only. It is not a diagnosis or verified treatment.",
}

UNCERTAIN = {
    "mr": "माझ्याकडे या प्रश्नाचे प्रमाणित उत्तर उपलब्ध नाही. कृपया स्थानिक कृषी केंद्र किंवा कृषि अधिकारी यांच्याशी संपर्क साधा.",
    "hi": "मेरे पास इस प्रश्न का सत्यापित उत्तर उपलब्ध नहीं है। कृपया स्थानीय कृषि केंद्र या कृषि अधिकारी से संपर्क करें।",
    "en": "I do not have a verified answer for this question. Please consult your local Krishi Kendra or agriculture officer.",
}

SAFE_GUIDANCE = {
    "mr": "संभाव्य संसर्ग पसरू नये म्हणून प्रभावित पाने अलग ठेवा, हात धुवून ठेवावेत आणि अधिकृत शेतकरी सल्लागाराला पानांची स्पष्ट छायाचित्रे दाखवा. औषधाचे नाव किंवा मात्रा वापरू नका.",
    "hi": "संभावित संक्रमण फैलने से रोकने के लिए प्रभावित पत्तियों को अलग रखें, हाथ धोएँ और स्पष्ट फोटो किसी अधिकृत कृषि सलाहकार को दिखाएँ। कोई दवा का नाम या मात्रा न लगाएँ।",
    "en": "To limit possible spread, isolate affected leaves, wash hands, and show clear photos to an authorized agricultural adviser. Do not apply an invented pesticide or chemical dose.",
}

HELP_GUIDANCE = {
    "mr": "पीकाचे निरीक्षण नियमित करा, पाण्याचा ओघ आणि मातीचे निचरा तपासा आणि तुमच्या पिकाचे नाव, लक्षणे व छायाचित्रे स्थानिक कृषी केंद्राशी शेअर करा.",
    "hi": "फसल की नियमित जाँच करें, सिंचाई और मिट्टी की जल निकासी देखें और फसल का नाम, लक्षण तथा फोटो स्थानीय कृषि केंद्र के साथ साझा करें।",
    "en": "Inspect crops regularly, check irrigation and soil drainage, and share the crop name, symptoms, and photos with a local Krishi Kendra.",
}


def get_advisory(text: str, language: Language) -> str:
    """Return safe demo guidance; no diagnosis or confidence score is generated."""
    normalized = text.lower().strip()
    if not normalized:
        return UNCERTAIN[language]

    if any(marker in normalized for marker in LEAF_MARKERS[language]):
        return f"{DISCLAIMER[language]}\n\n{SAFE_GUIDANCE[language]}\n\n{UNCERTAIN[language]}"

    if any(marker in normalized for marker in HELP_MARKERS[language]):
        return f"{DISCLAIMER[language]}\n\n{HELP_GUIDANCE[language]}"

    return UNCERTAIN[language]
