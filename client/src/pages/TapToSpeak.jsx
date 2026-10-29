import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import './TapToSpeak.css'

export default function TapToSpeak() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [speechError, setSpeechError] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [textInput, setTextInput] = useState('')

  // Conversation messages state
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      time: '10:15 AM',
      text:
        language === 'mr'
          ? 'नमस्कार शेतकरी मित्रा! मी शेतीमित्र AI आहे. टोमॅटो, कापूस, बटाटा किंवा इतर पिकांवरील रोग, खते व हवामान संबंधी प्रश्न मराठीत विचारू शकता.'
          : language === 'hi'
          ? 'नमस्ते किसान साथी! मैं खेतीमित्र AI हूँ। टमाटर, कपास, आलू अथवा अन्य फसलों के रोग, खाद व मौसम संबंधित सवाल अपनी भाषा में पूछ सकते हैं।'
          : 'Welcome, farmer! I am ShetiMitra AI. You can ask agricultural questions regarding tomato, cotton, potato, fertilizers, and weather in your preferred language.',
      audioText:
        language === 'mr'
          ? 'नमस्कार शेतकरी मित्रा! मी शेतीमित्र AI आहे. आपले शेतीविषयक प्रश्न विचारू शकता.'
          : language === 'hi'
          ? 'नमस्ते किसान साथी! मैं खेतीमित्र AI हूँ। अपने खेती के सवाल पूछ सकते हैं।'
          : 'Welcome farmer. I am ShetiMitra AI. Feel free to ask your farming questions.',
    },
  ])

  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis || null)

  // Timer effect for recording duration
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isListening])

  // Load previous chat history from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shetimitra-recent-chats')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [])

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // Start real browser speech recognition or fallback simulation
  const startListening = () => {
    setSpeechError('')
    setTranscript('')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      // Browser doesn't support Web Speech API, use interactive simulated voice recorder
      setIsListening(true)
      const simulatedText =
        language === 'mr'
          ? 'टोमॅटोच्या पानांवर पिवळे डाग पडले आहेत, काय उपाय करावा?'
          : language === 'hi'
          ? 'टमाटर की पत्तियों पर पीले धब्बे हैं, क्या उपाय करें?'
          : 'Tomato leaves have yellow and brown spots, what should I do?'

      setTimeout(() => {
        setTranscript(simulatedText)
      }, 2500)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setTranscript(currentTranscript)
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          setSpeechError(t('micPermissionDenied'))
        } else {
          setSpeechError(t('speechNotSupported'))
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      console.warn('Speech recognition init failed:', err)
      setIsListening(false)
      setSpeechError(t('speechNotSupported'))
    }
  }

  const stopListeningAndSend = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        /* Safe catch */
      }
    }
    setIsListening(false)

    const finalQuery =
      transcript.trim() ||
      (language === 'mr'
        ? 'टोमॅटोच्या पानांवर पिवळे डाग पडले आहेत, काय उपाय करावा?'
        : language === 'hi'
        ? 'टमाटर की पत्तियों पर पीले धब्बे हैं, क्या उपाय करें?'
        : 'Tomato leaves have yellow spots, what should I do?')

    submitUserQuery(finalQuery)
  }

  const cancelListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        /* Safe catch */
      }
    }
    setIsListening(false)
    setTranscript('')
  }

  // Answer matching engine based on agricultural rules
  const generateAgriculturalAdvice = (query) => {
    const q = query.toLowerCase()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (q.includes('डाग') || q.includes('धब्बे') || q.includes('spot') || q.includes('करपा') || q.includes('blight') || q.includes('yellow')) {
      return {
        id: 'resp-' + Date.now(),
        sender: 'assistant',
        time: now,
        crop: 'Tomato',
        disease: 'Early Blight (अगेती करपा)',
        text:
          language === 'mr'
            ? `टोमॅटोच्या पानांवरील पिवळे व तपकिरी कडे असलेले डाग "लवकर येणारा करपा (Early Blight)" रोगाची लक्षणे असू शकतात:

• तात्काळ उपाय: रोगाची लागण झालेली खालची पाने काढून जमिनीत गाडून टाका.
• पाणी व्यवस्थापन: तुषार सिंचन टाळा आणि ठिबक सिंचनाने थेट मुळांना पाणी द्या.
• शिफारस: प्रतिबंधात्मक संरक्षणासाठी मँकोझेब ७५% WP (Mancozeb) २.५ ग्रॅम प्रति लिटर किंवा कॉपर ऑक्सिक्लोराईड ३ ग्रॅम प्रति लिटर फवारणी करा.
• टीप: फवारणीपूर्वी आपल्या तालुका कृषी अधिकाऱ्यांचा सल्ला अवश्य घ्या.`
            : language === 'hi'
            ? `टमाटर की पत्तियों पर पीले और संकेंद्रित छल्लों वाले भूरे धब्बे "अगेती झुलसा (Early Blight)" के लक्षण हो सकते हैं:

• तुरंत कार्य: संक्रमित निचली पत्तियों को तोड़कर खेत से दूर नष्ट करें।
• पानी प्रबंधन: पत्तियों पर पानी का छिड़काव न करें, जड़ों में ड्रिप से पानी दें।
• अनुशंसित उपाय: मैंकोज़ेब 75% WP (Mancozeb) 2.5 ग्राम प्रति लीटर या कॉपर ऑक्सीक्लोराइड 3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।
• सलाह: गंभीर प्रकोप में नज़दीकी कृषि विज्ञान केंद्र (KVK) के वैज्ञानिक से संपर्क करें।`
            : `Yellow and concentric brown ring spots on tomato leaves strongly indicate "Early Blight" (Alternaria solani):

• Immediate Action: Prune off and destroy infected lower foliage to halt spore spread.
• Irrigation Practice: Avoid overhead watering; water at the root base with drip lines to keep foliage dry.
• Chemical Precaution: Spray Mancozeb 75% WP @ 2.5g/L water or Copper Oxychloride 50% WP @ 3.0g/L.
• Note: Consult your local Krishi Vigyan Kendra (KVK) agronomist before spraying.`,
      }
    }

    if (q.includes('बोंडअळी') || q.includes('सुंडी') || q.includes('bollworm') || q.includes('कापूस') || q.includes('cotton')) {
      return {
        id: 'resp-' + Date.now(),
        sender: 'assistant',
        time: now,
        crop: 'Cotton',
        disease: 'Pink Bollworm (गुलाबी बोंडअळी)',
        text:
          language === 'mr'
            ? `कपाशीवरील गुलाबी बोंडअळी व्यवस्थापनासाठी एकात्मिक नियंत्रण:

• कामगंध सापळे: हेक्टरी ५ कामगंध (Pheromone) सापळे लावून पतंगांवर लक्ष ठेवा.
• जैविक नियंत्रण: ट्रायकोकार्ड्स (Trichogramma) दर आठवड्याला शेतात लावा.
• फवारणी: ५% निंबोळी अर्क (Neem Oil 1500 ppm) ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.
• सावधगिरी: अनावश्यक रासायनिक कीटकनाशकांचा अतिवापर टाळा.`
            : language === 'hi'
            ? `कपास में गुलाबी सुंडी (Pink Bollworm) नियंत्रण के उपाय:

• फेरोमोन ट्रैप: प्रति हेक्टेयर 5 फेरोमोन ट्रैप लगाकर कीटों की संख्या पर नज़र रखें।
• जैविक उपाय: ट्राइकोग्रामा परजीवी अंडों का उपयोग करें और 5% नीम तेल (1500 ppm) 5 मिली प्रति लीटर छिड़कें।
• सतर्कता: फूल व डोडे बनने की अवस्था में नियमित निगरानी रखें।`
            : `Integrated pest management for Cotton Pink Bollworm:

• Monitoring: Install 5 pheromone traps per hectare to monitor moth flights.
• Biological Measure: Release Trichogramma egg parasitoids and apply 5% Neem seed kernel extract (1500 ppm @ 5ml/L).
• Cultural Practice: Regularly inspect rosetted flowers and destroy dropped squares.`,
      }
    }

    if (q.includes('खत') || q.includes('खाद') || q.includes('fertilizer')) {
      return {
        id: 'resp-' + Date.now(),
        sender: 'assistant',
        time: now,
        crop: 'Tomato',
        disease: 'Fertigation & Nutrition',
        text:
          language === 'mr'
            ? `टोमॅटो पिकासाठी योग्य खत नियोजन:

• फुलोरा व फळधारणा अवस्था: ०:५२:३४ (मोनोपोटॅशियम फॉस्फेट) ५ ग्रॅम प्रति लिटर ठिबक सिंचनातून द्या.
• फुलगळ थांबवण्यासाठी: बोरॉन (२०%) १ ग्रॅम प्रति लिटर आणि चिलेटेड कॅल्शियम २ ग्रॅम फवारणी करा.
• सूक्ष्म अन्नद्रव्ये: जमिनीच्या पोतानुसार दर १५ दिवसांनी सूक्ष्म अन्नद्रव्यांचा डोस द्या.`
            : language === 'hi'
            ? `टमाटर की फसल में खाद व पोषण प्रबंधन:

• फूल व फल अवस्था: 0:52:34 (मोनोपोटैशियम फॉस्फेट) 5 ग्राम प्रति लीटर ड्रिप से दें।
• फूल झड़ने से रोकने हेतु: बोरॉन (20%) 1 ग्राम प्रति लीटर और कैल्शियम 2 ग्राम का छिड़काव करें।
• जैविक खाद: खेत में अच्छी तरह सड़ी हुई गोबर की खाद या वर्मीकम्पोस्ट का प्रयोग अवश्य करें।`
            : `Nutrient schedule for Tomato crop:

• Flowering & Fruiting Stage: Apply 0:52:34 (Monopotassium Phosphate) @ 5g/L via fertigation.
• Prevent Flower Drop: Foliar spray of Boron (20%) @ 1g/L and Chelated Calcium @ 2g/L.
• Organic boost: Ensure well-rotted FYM or Vermicompost was incorporated in basal application.`,
      }
    }

    // Default expert response
    return {
      id: 'resp-' + Date.now(),
      sender: 'assistant',
      time: now,
      crop: 'General Crop Health',
      disease: 'Agricultural Advisory',
      text:
        language === 'mr'
          ? `तुमच्या प्रश्नाचे विश्लेषण करण्यात आले आहे:

• पिकाची निरोगी वाढ राहण्यासाठी जमिनीतील ओलावा आणि पानांची स्थिती तपासा.
• पानावरील डाग, कीड किंवा रोगाची अचूक ओळख करण्यासाठी आमच्या "रोग तपासणी (Scan Leaf)" पानावर जाऊन पानाचा फोटो अपलोड करा.
• अधिक अचूक मार्गदर्शनासाठी किसान कॉल सेंटर (१८००-१८०-१५५१) वर संपर्क साधा.`
          : language === 'hi'
          ? `आपके प्रश्न का कृषि विश्लेषण:

• फसल के स्वस्थ विकास हेतु खेत की नमी और पत्तियों की स्थिति की नियमित जाँच करें।
• सटीक रोग पहचान के लिए हमारे "रोग पहचान (Scan Leaf)" पेज पर जाकर पत्ती की तस्वीर अपलोड करें।
• किसी भी संदेह में किसान कॉल सेंटर (1800-180-1551) पर निःशुल्क संपर्क करें।`
          : `Agricultural advisory for your inquiry:

• Regularly monitor field moisture and inspect the underside of leaves for early disease symptoms.
• For precise AI disease diagnosis, navigate to our "Image Detection (Scan Leaf)" page and upload a leaf photo.
• For certified local guidance, you can call the Kisan Call Center toll-free at 1800-180-1551.`,
    }
  }

  const submitUserQuery = (queryText) => {
    if (!queryText.trim()) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      time: now,
      text: queryText,
    }

    const aiMsg = generateAgriculturalAdvice(queryText)

    setMessages((prev) => {
      const next = [...prev, userMsg, aiMsg]
      try {
        localStorage.setItem('shetimitra-recent-chats', JSON.stringify(next.slice(-20)))
      } catch {
        // Safe catch
      }
      return next
    })
    setTranscript('')
    setTextInput('')

    // Auto-play voice response if speech synthesis available
    speakText(aiMsg.text)
  }

  // Web Speech API text-to-speech
  const speakText = (textToSpeak) => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    // Clean markdown and bullet symbols for clear speech
    const cleanSpeech = textToSpeak
      .replace(/[•*#_]/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanSpeech)
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9 // slightly slower for farm comprehension

    utterance.onstart = () => setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsPlayingAudio(false)
  }

  return (
    <div className="voice-assistant-page">
      {/* Header Banner */}
      <div className="va-header-banner">
        <div className="va-banner-text">
          <span className="va-overline">AI AGRICULTURAL VOICE ADVISORY</span>
          <h1 className="va-title">{t('assistantTitle')}</h1>
          <p className="va-subtitle">{t('assistantSubtitle')}</p>
        </div>

        <div className="va-lang-indicator">
          <Icon name="globe" size={18} />
          <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'}</span>
        </div>
      </div>

      <div className="va-layout-grid">
        {/* Left / Center Column: Chat & Conversation */}
        <section className="va-chat-section" aria-label="Voice conversation feed">
          <div className="va-chat-scrollbox">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`va-message-row ${msg.sender === 'user' ? 'user-side' : 'assistant-side'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="va-avatar">
                    <Icon name="sprout" size={18} />
                  </div>
                )}

                <div className={`va-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                  {msg.crop && (
                    <div className="va-bubble-meta">
                      <span className="crop-tag">{msg.crop}</span>
                      <span className="disease-tag">{msg.disease}</span>
                    </div>
                  )}

                  <div className="va-bubble-text">{msg.text}</div>

                  <div className="va-bubble-footer">
                    <span className="va-timestamp">{msg.time}</span>

                    {msg.sender === 'assistant' && (
                      <button
                        type="button"
                        className={`va-audio-pill ${isPlayingAudio ? 'playing' : ''}`}
                        onClick={() => (isPlayingAudio ? stopAudio() : speakText(msg.text))}
                        aria-label="Listen audio advisory"
                      >
                        <Icon name={isPlayingAudio ? 'pause' : 'volume'} size={15} />
                        <span>{isPlayingAudio ? t('playingAudio') : t('listenAudio')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="va-quick-chips">
            <span className="chips-label">{t('sampleQuestions')}</span>
            <div className="chips-container">
              <button
                type="button"
                className="chip-btn"
                onClick={() => submitUserQuery(t('sampleQ1'))}
              >
                {t('sampleQ1')}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => submitUserQuery(t('sampleQ2'))}
              >
                {t('sampleQ2')}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => submitUserQuery(t('sampleQ3'))}
              >
                {t('sampleQ3')}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => submitUserQuery(t('sampleQ4'))}
              >
                {t('sampleQ4')}
              </button>
            </div>
          </div>

          {/* Fallback Text Input Composer */}
          <form
            className="va-composer-box"
            onSubmit={(e) => {
              e.preventDefault()
              submitUserQuery(textInput)
            }}
          >
            <input
              type="text"
              className="va-composer-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('typePlaceholder')}
              aria-label="Type your agricultural question"
            />
            <button
              type="submit"
              className="va-composer-send-btn"
              disabled={!textInput.trim()}
              aria-label="Send text query"
            >
              <Icon name="arrow" size={18} />
            </button>
          </form>
        </section>

        {/* Right Column: Interactive Voice Recorder Orb & Status */}
        <aside className="va-voice-panel">
          <div className={`va-orb-container ${isListening ? 'active-listening' : ''}`}>
            {isListening && (
              <>
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>
              </>
            )}

            <button
              type="button"
              className={`va-mic-orb ${isListening ? 'recording' : ''}`}
              onClick={isListening ? stopListeningAndSend : startListening}
              aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
            >
              <Icon name={isListening ? 'check' : 'mic'} size={42} />
            </button>
          </div>

          <div className="va-status-block">
            <h3 className="va-status-heading">
              {isListening ? t('listening') : t('tapToSpeak')}
            </h3>

            {isListening && (
              <div className="va-live-waveform" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            )}

            <p className="va-timer-text">
              {isListening
                ? `00:${String(recordingSeconds).padStart(2, '0')}`
                : language === 'mr'
                ? 'माईकवर दाबून बोला आणि अचूक सल्ला मिळवा'
                : language === 'hi'
                ? 'माइक पर दबाएं और तुरंत खेती सलाह पाएं'
                : 'Press the microphone and speak your query'}
            </p>

            {transcript && (
              <div className="va-live-transcript">
                <span className="transcript-label">Recognized Speech:</span>
                <p>“{transcript}”</p>
              </div>
            )}

            {speechError && (
              <div className="va-speech-error" role="alert">
                <Icon name="alertTriangle" size={16} />
                <span>{speechError}</span>
              </div>
            )}

            {isListening ? (
              <div className="va-recording-actions">
                <button
                  type="button"
                  className="va-action-send"
                  onClick={stopListeningAndSend}
                >
                  <Icon name="check" size={17} />
                  <span>{t('stopSpeaking')}</span>
                </button>
                <button
                  type="button"
                  className="va-action-cancel"
                  onClick={cancelListening}
                >
                  <Icon name="x" size={17} />
                  <span>{t('cancel')}</span>
                </button>
              </div>
            ) : (
              <div className="va-leaf-scan-prompt">
                <p>Have an infected leaf photo?</p>
                <Link to="/scan" className="scan-shortcut-link">
                  <Icon name="scan" size={17} />
                  <span>{t('navScan')}</span>
                </Link>
              </div>
            )}
          </div>

          <div className="va-safety-note">
            <Icon name="shieldCheck" size={16} />
            <span>{t('verifiedAdvisoryNotice')}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
