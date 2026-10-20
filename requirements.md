# ShetiMitra AI --- Software Requirements Specification (SRS)

**Status:** Initial draft for implementation planning\
**Project:** ShetiMitra AI\
**Platform:** Responsive web application\
**Application stack:** React.js, Node.js, Express.js, MongoDB Atlas\
**AI stack proposed by synopsis:** Python 3.10, YOLOv8, Whisper, gTTS

------------------------------------------------------------------------

## 1. Purpose

This document lists functional and non-functional requirements for the
ShetiMitra AI application. It is intended to guide implementation,
testing, and project review. Requirements marked as pending must be
finalized with the project guide or validated through experiments.

## 2. Scope

The application accepts leaf images and provides AI-assisted crop
disease predictions, confidence-aware result handling, curated
agricultural guidance, multilingual UI/voice support, and weather-based
disease-risk alerts.

The initial scope prioritizes tomato. Additional crops may be enabled
only after the team confirms dataset availability, supported model
labels, and suitable advisory content.

## 3. System Users

-   **Farmer:** submits leaf images, views results and advisories,
    selects language, uses voice and checks weather risk.
-   **Administrator/reviewer:** maintains approved disease information,
    translations, and risk rules.
-   **Researcher/tester:** evaluates model, speech, and application
    performance using approved test data.

Farmer accounts are optional for the first release and must be decided
before scan history is implemented. Admin authentication and
authorization are required for administrative changes.

## 4. Functional Requirements

  --------------------------------------------------------------------------------------
  ID                Requirement                Priority          Verification
  ----------------- -------------------------- ----------------- -----------------------
  REQ-F-001         The system shall provide a Must              UI test
                    mobile-first farmer                          
                    dashboard.                                   

  REQ-F-002         The system shall provide   Must              Translation review
                    Marathi, Hindi, and                          
                    English UI language                          
                    options.                                     

  REQ-F-003         The system shall allow     Must              Functional test
                    selecting a supported                        
                    crop.                                        

  REQ-F-004         The system shall accept a  Must              Browser/device test
                    leaf image from file                         
                    selection and supported                      
                    camera capture.                              

  REQ-F-005         The system shall validate  Must              Positive/negative tests
                    image type, size, and                        
                    readability before                           
                    inference.                                   

  REQ-F-006         The system shall send      Must              Integration test
                    accepted images to the                       
                    configured AI inference                      
                    service.                                     

  REQ-F-007         The system shall display   Must              Integration test
                    predictions only from the                    
                    configured model response.                   

  REQ-F-008         The system shall expose    Must              API/UI test
                    prediction scores and                        
                    model metadata where                         
                    available.                                   

  REQ-F-009         The system shall implement Must              Threshold tests
                    an uncertainty outcome                       
                    using a threshold                            
                    validated on held-out                        
                    data.                                        

  REQ-F-010         The system shall not       Must              Safety test
                    present disease-specific                     
                    treatment as confirmed for                   
                    uncertain results.                           

  REQ-F-011         The system shall retrieve  Must              Database/API test
                    farmer-facing guidance                       
                    from curated advisory                        
                    records.                                     

  REQ-F-012         Published                  Must              Data validation test
                    treatment-related guidance                   
                    shall have review status                     
                    and source metadata.                         

  REQ-F-013         The system shall support   Should            Browser permission test
                    speech recording with user                   
                    permission.                                  

  REQ-F-014         The system shall           Should            Integration test
                    transcribe supported                         
                    speech through the                           
                    configured speech-to-text                    
                    service.                                     

  REQ-F-015         The system shall provide   Should            Integration/usability
                    text and supported audio                     test
                    responses.                                   

  REQ-F-016         The system shall retrieve  Should            API integration test
                    weather information from                     
                    the configured provider.                     

  REQ-F-017         Weather-risk output shall  Must for weather  Rule tests/review
                    use documented             release           
                    disease-specific rules and                   
                    show an explanation.                         

  REQ-F-018         The system shall label     Must for weather  UI test
                    weather risk as a warning, release           
                    not a confirmed diagnosis.                   

  REQ-F-019         The system shall save scan Should            Persistence/privacy
                    history only according to                    test
                    the selected                                 
                    retention/authentication                     
                    policy.                                      

  REQ-F-020         Users shall be able to     Should            Functional test
                    delete their saved history                   
                    where history is enabled.                    

  REQ-F-021         Administrative routes      Must              Security test
                    shall require                                
                    authorization.                               

  REQ-F-022         Administrators shall be    Should            Role-based test
                    able to manage advisory                      
                    content and risk rules.                      

  REQ-F-023         The system shall show      Must              UI tests
                    useful loading, empty,                       
                    success, and error states.                   

  REQ-F-024         The system shall handle    Must              Failure-injection tests
                    AI, database, and                            
                    weather-provider failures                    
                    without fabricating                          
                    successful results.                          

  REQ-F-025         The project shall report   Must for final    Reproducible evaluation
                    model and speech           research report   
                    evaluation results from                      
                    actual experiments.                          
  --------------------------------------------------------------------------------------

## 5. Non-Functional Requirements

### REQ-NF-001: Security

All deployed API traffic must use HTTPS. Inputs and uploads must be
validated. Admin actions must be protected. Secrets must not be
committed to version control.

### REQ-NF-002: Privacy

The system shall minimize collection of personal data. Audio recording
and research surveys require appropriate consent. Image/audio retention
must be defined and documented.

### REQ-NF-003: Usability

The UI shall prioritize mobile use, readable text, large touch targets,
simple navigation, and plain-language error messages.

### REQ-NF-004: Accessibility

Controls shall have accessible labels, adequate contrast, and keyboard
support where applicable. Risk states must not be communicated through
color alone.

### REQ-NF-005: Maintainability

Frontend, API, database models, and AI processing shall be separated
into clear modules. Shared API contracts shall be documented.

### REQ-NF-006: Reliability

External service failures, timeouts, invalid files, and database outages
shall produce controlled error states rather than unhandled crashes or
false results.

### REQ-NF-007: Performance

The application shall show progress for time-consuming operations.
Quantitative response-time goals are pending baseline measurement and
must not be invented.

### REQ-NF-008: Scalability

AI inference shall be separated behind a service boundary so it can be
scaled or replaced without redesigning the frontend.

### REQ-NF-009: Observability

The system shall record operational errors and request status while
avoiding sensitive payloads and credentials in logs.

### REQ-NF-010: Scientific Validity

Training, validation, and test sets must be separated. Real-field
evaluation must be reported separately from laboratory-image results. No
model accuracy or speech-quality result shall be claimed before
measurement.

## 6. Data and Validation Requirements

-   Supported crop and disease labels must match the deployed model.
-   Advisory content must be reviewed before publication.
-   Each weather-risk rule must record its source, supported variables,
    and version.
-   The confidence threshold must be selected using validation data and
    evaluated on separate test data.
-   A score must not be called a calibrated probability unless
    calibration has been tested.
-   Test data from real farms should not leak into model training or
    tuning when it is being used for final evaluation.

## 7. Research Evaluation Requirements

The final evaluation should include, where applicable: - Accuracy,
precision, recall, F1-score, and confusion matrix. - mAP if the
implemented model performs object detection and that metric is
appropriate. - Comparison between laboratory images and real field
images. - Accuracy on answered cases and coverage at different
uncertainty thresholds. - Marathi speech word error rate. - Farmer
understanding/usability feedback, with consent. - Response time and
error rates measured under a documented test setup.

All values are **pending measurement**. The requirements document does
not claim any result.

## 8. Acceptance Test Scenarios

1.  **Valid image:** a supported image reaches inference and displays
    the returned result.
2.  **Invalid image:** an unsupported/corrupted file is rejected with a
    clear message.
3.  **AI unavailable:** the UI reports an inference error and does not
    show a fabricated prediction.
4.  **Low confidence:** the UI shows uncertainty and does not present
    disease-specific treatment as confirmed.
5.  **No reviewed advisory:** the UI states that verified advice is
    unavailable and suggests consulting an agricultural expert.
6.  **Voice permission denied:** the user can continue using text/image
    features.
7.  **Speech transcription failure:** an error is shown and the user can
    retry or type.
8.  **Weather API failure:** the UI indicates that current risk data is
    unavailable or stale.
9.  **Unauthorized admin request:** the API denies access.
10. **History isolation:** where accounts exist, one user cannot read or
    delete another user's records.
11. **Deletion:** a user can delete their permitted history records.
12. **Research report:** metrics are reproducible from a documented test
    dataset and evaluation script.

## 9. Requirement Traceability

  -----------------------------------------------------------------------
  Product goal                        Requirements
  ----------------------------------- -----------------------------------
  Mobile-friendly farmer experience   REQ-F-001, 002, 003, 023

  Image disease detection             REQ-F-004 to 008

  Uncertainty-aware safety            REQ-F-009, 010

  Verified agricultural guidance      REQ-F-011, 012

  Marathi voice interaction           REQ-F-013 to 015

  Disease-specific weather risk       REQ-F-016 to 018

  History and privacy                 REQ-F-019, 020; REQ-NF-002

  Secure administration               REQ-F-021, 022; REQ-NF-001

  Reliable and scientifically         REQ-F-024, 025; REQ-NF-006, 010
  evaluated system                    
  -----------------------------------------------------------------------

## 10. Pending Decisions

-   Final list of tomato diseases and model labels.
-   Whether the final inference runtime is Python YOLOv8 or
    TensorFlow.js inside Node.js.
-   Whether anonymous scans are supported and whether accounts are
    needed for history.
-   Image/audio retention period and storage provider.
-   Validated confidence threshold.
-   Agricultural sources and expert review workflow for treatment
    content and weather rules.
-   Deployment targets and service resource limits.
-   Quantitative performance targets after baseline testing.
