import React, { useState, useCallback, useEffect } from 'react';
import type { Gender, SelectedStyles, StyleCategory, AspectRatio, SavedPreset, OperatingMode, RepairSubMode } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import AspectRatioSelector from './components/AspectRatioSelector';
import ModeSelector from './components/ModeSelector';
import RepairControls from './components/RepairControls';
import EditorControls from './components/EditorControls';
import { buildIdPhotoPrompt, buildRestorePrompt, buildMemorialPrompt, buildEnhancePrompt, buildEditorPrompt } from './services/promptBuilder';
import { generateEditedImage, analyzeGenderFromImage, getAiExplanation, analyzeImage, enhanceEditPrompt } from './services/gemini';
import { resizeImageToAspectRatio } from './services/imageUtils';

// Helper function to translate technical errors into user-friendly Thai messages.
function getFriendlyErrorMessage(error: any): { message: string; retryAfter?: number } {
    const defaultMessage = "เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการสร้างภาพ กรุณาลองใหม่อีกครั้งค่ะ หากยังพบปัญหาเดิม กรุณาติดต่อผู้ดูแลค่ะ";
    
    if (!error) return { message: defaultMessage };

    // Normalize error message for easier matching
    const errorMessage = String(error.message || error);
    const lowerCaseErrorMessage = errorMessage.toLowerCase();
    
    if (lowerCaseErrorMessage.includes('did not return valid json for gender analysis')) {
        return { message: "AI ไม่สามารถวิเคราะห์เพศได้ในขณะนี้เนื่องจากมีปัญหาในการประมวลผลข้อมูล กรุณาลองใหม่อีกครั้งค่ะ" };
    }

    // Category 1: API Key & Authentication Errors
    if (lowerCaseErrorMessage.includes('api_key_missing') || lowerCaseErrorMessage.includes('api key not valid')) {
        return { message: "API Key ไม่ถูกต้องหรือไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบเพื่อแก้ไขค่ะ" };
    }

    // Category 2: Rate Limiting & Quota Errors
    if (lowerCaseErrorMessage.includes('resource_exhausted') || lowerCaseErrorMessage.includes('exceeded your current quota') || lowerCaseErrorMessage.includes('429')) {
        let retrySeconds: number | undefined = undefined;
        
        try {
            const jsonStart = errorMessage.indexOf('{');
            if (jsonStart !== -1) {
                const potentialJson = errorMessage.substring(jsonStart).replace(/`/g, '');
                const errorJson = JSON.parse(potentialJson);
                const retryInfo = errorJson?.error?.details?.find(
                    (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
                );
                if (retryInfo?.retryDelay) {
                    retrySeconds = parseFloat(retryInfo.retryDelay);
                }
            }
        } catch (jsonError) {
            // Fallback if JSON parsing fails
        }

        if (retrySeconds === undefined) {
            const match = errorMessage.match(/Please retry in (\d+(?:\.\d+)?)/);
            if (match && match[1]) {
                retrySeconds = parseFloat(match[1]);
            }
        }
        
        const message = "ขออภัยค่ะ, มีผู้ใช้งานหนาแน่น (โควต้าเต็ม) กรุณารอสักครู่แล้วลองใหม่อีกครั้งตามเวลาที่แสดงบนปุ่มนะคะ";
        const finalRetry = retrySeconds ? Math.ceil(Math.max(retrySeconds, 1)) : 60;
        return { message, retryAfter: finalRetry };
    }
    
    // Category 3: Safety & Policy Blocks
    if (lowerCaseErrorMessage.includes('safety') || lowerCaseErrorMessage.includes('blocked')) {
        const match = errorMessage.match(/category: (\w+)/);
        const categoryInfo = match ? ` (หมวดหมู่: ${match[1]})` : '';
        return { message: `AI ปฏิเสธการสร้างภาพเนื่องจากขัดต่อนโยบายความปลอดภัย${categoryInfo} กรุณาลองเปลี่ยนรูปภาพอ้างอิงหรือปรับคำสั่งพิเศษนะคะ` };
    }
    
    // Category 4: Image Quality, Dimension, and Format Errors
    if (lowerCaseErrorMessage.includes('face') && (lowerCaseErrorMessage.includes('not clear') || lowerCaseErrorMessage.includes('not detected'))) {
        return { message: "AI ไม่สามารถตรวจจับใบหน้าที่ชัดเจนในภาพได้ กรุณาใช้ภาพที่เห็นใบหน้าตรงและชัดเจน ไม่มีสิ่งบดบังค่ะ" };
    }
    if (lowerCaseErrorMessage.includes('image is too small') || lowerCaseErrorMessage.includes('resolution is too low')) {
        return { message: "รูปภาพที่อัปโหลดมีขนาดเล็กเกินไป กรุณาใช้รูปภาพที่มีความละเอียดสูงกว่านี้ค่ะ" };
    }
    if (lowerCaseErrorMessage.includes('image is too large') || lowerCaseErrorMessage.includes('resolution is too high')) {
        return { message: "รูปภาพที่อัปโหลดมีขนาดใหญ่เกินไป กรุณาลลดขนาดรูปภาพแล้วลองใหม่อีกครั้งค่ะ" };
    }
    if (lowerCaseErrorMessage.includes('invalid data url') || lowerCaseErrorMessage.includes('image may be corrupted')) {
        return { message: "รูปภาพที่อัปโหลดเสียหายหรือไม่รองรับ กรุณาลองใช้ไฟล์ .jpeg หรือ .png อื่นๆ ค่ะ" };
    }
    
    // Category 5: Invalid Arguments & User Input Errors
    if (lowerCaseErrorMessage.includes('invalid argument')) {
         return { message: "AI พบว่าข้อมูลที่ส่งไปไม่ถูกต้อง อาจเกิดจากรูปภาพเสียหายหรือคำสั่งพิเศษมีความซับซ้อนเกินไป กรุณาลองใหม่อีกครั้งด้วยรูปภาพหรือคำสั่งที่ง่ายขึ้นค่ะ" };
    }
    
    // Category 6: Model & Generation Errors
    if (lowerCaseErrorMessage.includes('model did not return an image but provided a text response:')) {
        const modelResponse = errorMessage.split('text response: "')[1]?.slice(0, -1);
        return { message: `AI ไม่สามารถสร้างรูปภาพได้ และตอบกลับมาว่า: "${modelResponse || 'ไม่มีคำอธิบาย'}" กรุณาลองปรับเปลี่ยนสไตล์หรือรูปภาพค่ะ` };
    }
    if (lowerCaseErrorMessage.includes('did not return an image')) {
        return { message: "AI ไม่สามารถสร้างรูปภาพได้ในครั้งนี้ อาจเป็นปัญหาชั่วคราว หรือรูปภาพอ้างอิงไม่ชัดเจน กรุณาลองใช้รูปภาพอื่นที่เห็นใบหน้าชัดเจนค่ะ" };
    }
    if (lowerCaseErrorMessage.includes('404 not_found')) {
         return { message: "ไม่พบโมเดล AI ที่ร้องขอ อาจเป็นปัญหาชั่วคราวของระบบ กรุณาลองใหม่อีกครั้งในภายหลังค่ะ" };
    }

    // Category 7: Network & Server Errors
    if (error instanceof TypeError && lowerCaseErrorMessage.includes('fetch')) {
        return { message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้งค่ะ" };
    }
    if (lowerCaseErrorMessage.includes('internal') || lowerCaseErrorMessage.includes('unavailable') || lowerCaseErrorMessage.includes('500') || lowerCaseErrorMessage.includes('503')) {
        return { message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ของ AI ชั่วคราว กรุณารอประมาณ 1-2 นาทีแล้วลองใหม่อีกครั้งค่ะ" };
    }

    // Default fallback for any other errors
    console.error("Unhandled API Error:", errorMessage); // Log new errors for future handling
    return { message: defaultMessage };
}


// Modal component for explaining how AI works
interface HowAiWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowAiWorksModal: React.FC<HowAiWorksModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState('Copy Code');

  const codeSnippet = `import { GoogleGenAI } from '@google/genai';

// The API key is securely accessed from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function getExplanation() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Explain how AI works in a few words, in Thai language for a non-technical audience.',
  });
  
  // The text you see above is from response.text
  return response.text;
}`;

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Code'), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  }, [codeSnippet]);

  useEffect(() => {
    if (isOpen) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation('');
        try {
          const result = await getAiExplanation();
          setExplanation(result);
        } catch (err) {
          console.error("Failed to fetch AI explanation:", err);
          setError("ขออภัย, ไม่สามารถโหลดคำอธิบายได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="main-container p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-cyber-pink mb-4">AI ทำงานอย่างไร?</h3>
        <div className="min-h-[100px] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <svg className="animate-spin h-8 w-8 text-cyber-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3">กำลังสอบถาม AI...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-400">
              <p>{error}</p>
            </div>
          )}
          {explanation && (
            <p className="text-slate-300 whitespace-pre-wrap">{explanation}</p>
          )}
        </div>
        
        {explanation && !isLoading && !error && (
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-400 mb-2">โค้ดที่ใช้สร้างคำตอบนี้:</h4>
                <div className="code-snippet relative">
                    <button
                        onClick={handleCopyCode}
                        className="absolute top-2 right-2 cyber-tag-button"
                        aria-label="Copy code to clipboard"
                    >
                        {copyText}
                    </button>
                    <pre className="text-sm text-left p-4 overflow-x-auto">
                        <code className="font-mono whitespace-pre-wrap">
                            <span className="token-keyword">import</span> {'{'} <span className="token-class-name">GoogleGenAI</span> {'}'} <span className="token-keyword">from</span> <span className="token-string">'@google/genai'</span>;
                            <br /><br />
                            <span className="token-comment">// The API key is securely accessed from environment variables.</span>
                            <br />
                            <span className="token-keyword">const</span> <span className="token-constant">ai</span> = <span className="token-keyword">new</span> <span className="token-class-name">GoogleGenAI</span>({'{'} <span className="token-function">apiKey</span>: <span className="token-constant">process.env.API_KEY</span> {'}'});
                            <br /><br />
                            <span className="token-keyword">async function</span> <span className="token-function">getExplanation</span>() {'{'}
                            <br />
                            {'  '}<span className="token-keyword">const</span> response = <span className="token-keyword">await</span> ai.models.<span className="token-function">generateContent</span>({'{'}
                            <br />
                            {'    '}model: <span className="token-string">'gemini-2.5-flash'</span>,
                            <br />
                            {'    '}contents: <span className="token-string">'Explain how AI works in a few words, in Thai language for a non-technical audience.'</span>,
                            <br />
                            {'  '}{'}'});
                            <br /><br />
                            {'  '}<span className="token-comment">// The text you see is from response.text</span>
                            <br />
                            {'  '}<span className="token-keyword">return</span> response.text;
                            <br />
                            {'}'}
                        </code>
                    </pre>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- Global States ---
  const [activeMode, setActiveMode] = useState<OperatingMode>('studio');
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);
  const [isHowAiWorksModalOpen, setIsHowAiWorksModalOpen] = useState(false);

  // --- Studio & Headshot Mode States ---
  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(null);
  const [analyzedGender, setAnalyzedGender] = useState<Gender | null>(null);
  const [isAnalyzingGender, setIsAnalyzingGender] = useState<boolean>(false);
  const [genderAnalysisError, setGenderAnalysisError] = useState<string | null>(null);
  
  // --- Studio & Headshot Mode Specific States ---
  const [selectedStyles, setSelectedStyles] = useState<SelectedStyles>({ retouching: [], lighting: [] });
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
  const [details, setDetails] = useState<string>('');
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  
  // --- Repair Mode Specific States ---
  const [repairSubMode, setRepairSubMode] = useState<RepairSubMode>('selection');
  const [memorialOutfit, setMemorialOutfit] = useState<string | null>(null);
  const [memorialBackground, setMemorialBackground] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  
  // --- Editor Mode Specific State ---
  const [editorPrompt, setEditorPrompt] = useState<string>('');
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [isProcessingEnhancement, setIsProcessingEnhancement] = useState(false);


  // --- Effects ---

  // Load saved presets from localStorage on initial render
  useEffect(() => {
    try {
        const storedPresets = localStorage.getItem('miximage_presets');
        if (storedPresets) {
            setSavedPresets(JSON.parse(storedPresets));
        }
    } catch (e) {
        console.error("Failed to load presets from localStorage", e);
    }
  }, []);

  // Countdown timer effect for rate limiting
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);
  
  // Reset state when mode changes, preserving the main Studio configuration for better UX.
  useEffect(() => {
    // Only reset transient states, inputs, and results.
    setPrimaryImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setRetryAfter(0);
    setAnalyzedGender(null);

    // Also reset secondary inputs and states that depend on the primary image/mode.
    setOutfitImagePreview(null);
    setGenderAnalysisError(null);
    setIsLoading(false);
    
    // Reset states specific to non-Studio modes to prevent state leakage.
    setRepairSubMode('selection');
    setMemorialOutfit(null);
    setMemorialBackground(null);
    setIsNightMode(false);
    setEditorPrompt('');
    
    // NOTE: `selectedStyles`, `details`, and `aspectRatio` are intentionally preserved to allow users
    // to switch modes and come back to their Studio/Headshot configuration.
  }, [activeMode]);


  // --- Handlers ---

  const handlePrimaryImageSelect = useCallback(async (imageData: string | null) => {
    setPrimaryImage(imageData);
    setGeneratedImage(null); // Clear previous results
    setError(null);
    setGenderAnalysisError(null);
    setPrompt(''); // Clear prompt on new image
    
    // Analyze gender for studio, headshot, and repair modes
    if (activeMode === 'studio' || activeMode === 'headshot' || activeMode === 'repair') {
        setAnalyzedGender(null);
        setSelectedStyles(prev => ({...prev, clothes: undefined, hairstyle: undefined}));
        if (!imageData) return;

        setIsAnalyzingGender(true);
        try {
            const gender = await analyzeGenderFromImage(imageData);
            setAnalyzedGender(gender);
        } catch (err: any) {
            console.error("Gender analysis failed:", err);
            const { message } = getFriendlyErrorMessage(err);
            setGenderAnalysisError(`ไม่สามารถวิเคราะห์เพศได้: ${message}`);
        } finally {
            setIsAnalyzingGender(false);
        }
    }
  }, [activeMode]);

  const handleOutfitImageUpload = useCallback((imageData: string | null) => {
    setOutfitImagePreview(imageData);
    setPrompt(''); // Clear prompt on new image
    if (activeMode === 'studio') {
        setSelectedStyles(prev => {
          const { clothes, ...rest } = prev;
          return rest;
        });
    }
    if (activeMode === 'repair' && repairSubMode === 'memorial') {
        setMemorialOutfit(null);
    }
  }, [activeMode, repairSubMode]);

  const handleStyleSelect = useCallback((category: StyleCategory, value: string, payload?: any) => {
    if (category === 'saved') {
        setSelectedStyles(payload as SelectedStyles);
        setGeneratedImage(null);
        setError(null);
        setRetryAfter(0);
        return;
    }

    setSelectedStyles(prev => {
      const newStyles = { ...prev };
      
      switch (category) {
        case 'retouching':
        case 'lighting': {
          const currentSelection = newStyles[category] || [];
          if (currentSelection.includes(value)) {
            newStyles[category] = currentSelection.filter(p => p !== value);
          } else {
            newStyles[category] = [...currentSelection, value];
          }
          break;
        }
        case 'clothes_color': {
            if (newStyles.clothes_color === value) {
                delete newStyles.clothes_color;
            } else {
                newStyles.clothes_color = value;
            }
            break;
        }
        case 'clothes':
        case 'background':
        case 'hair_color':
        case 'hairstyle':
        case 'pose': {
          if (newStyles[category] === value) {
            delete newStyles[category];
            if (category === 'clothes') {
                delete newStyles.clothes_color;
            }
          } else {
            newStyles[category] = value;
            if (category === 'clothes') {
                // Reset color when changing clothes
                delete newStyles.clothes_color;
            }
          }
          break;
        }
      }
      return newStyles;
    });
  }, []);

   const handleSaveStyle = useCallback(() => {
    const name = window.prompt("ตั้งชื่อสไตล์ที่บันทึก:");
    if (name && name.trim()) {
        const newPreset = { name: name.trim(), styles: selectedStyles };
        const updatedPresets = [...savedPresets, newPreset];
        setSavedPresets(updatedPresets);
        try {
            localStorage.setItem('miximage_presets', JSON.stringify(updatedPresets));
            setSaveNotification('บันทึกสไตล์สำเร็จ!');
            setTimeout(() => setSaveNotification(null), 3000);
        } catch (e) {
             console.error("Failed to save presets to localStorage", e);
             setError("ไม่สามารถบันทึกสไตล์ได้ พื้นที่จัดเก็บอาจเต็ม");
        }
    }
  }, [selectedStyles, savedPresets]);

  const handleDeletePreset = useCallback((presetName: string) => {
    const updatedPresets = savedPresets.filter(p => p.name !== presetName);
    setSavedPresets(updatedPresets);
    try {
        localStorage.setItem('miximage_presets', JSON.stringify(updatedPresets));
    } catch (e) {
        console.error("Failed to update presets in localStorage", e);
        setError("ไม่สามารถลบสไตล์ได้");
    }
  }, [savedPresets]);
  
  const buildPromptForCurrentMode = useCallback((): string | null => {
    const isStudioLikeMode = activeMode === 'studio' || activeMode === 'headshot';

    if (isStudioLikeMode) {
        if (!primaryImage) {
            setError("การสร้างพรอมต์จำเป็นต้องใช้รูปภาพใบหน้าอ้างอิง");
            return null;
        }
        if (!analyzedGender) {
            setGenderAnalysisError("กรุณารอ AI วิเคราะห์เพศก่อน จึงจะสร้างพรอมต์ได้");
            return null;
        }
        return buildIdPhotoPrompt({
            gender: analyzedGender,
            selections: selectedStyles,
            details,
            hasFaceImage: !!primaryImage,
            hasOutfitImage: activeMode === 'studio' && !!outfitImagePreview,
            aspectRatio,
            isHalfBody: activeMode === 'headshot',
        });
    } else {
        switch (activeMode) {
          case 'repair':
            if (!primaryImage) {
                setError("กรุณาอัปโหลดรูปภาพที่ต้องการแก้ไข");
                return null;
            }
            if (repairSubMode === 'restore') {
                return buildRestorePrompt();
            } else if (repairSubMode === 'enhance') {
                return buildEnhancePrompt({ isNightMode });
            } else if (repairSubMode === 'memorial') {
                if (!analyzedGender) {
                    setGenderAnalysisError("กรุณารอ AI วิเคราะห์เพศให้เสร็จสิ้นก่อน");
                    return null;
                }
                if ((!memorialOutfit && !outfitImagePreview) || !memorialBackground) {
                    setError("กรุณาเลือกชุด (จากสไตล์หรือจากภาพ) และฉากหลังสำหรับภาพหน้าตรง");
                    return null;
                }
                return buildMemorialPrompt({ 
                    gender: analyzedGender, 
                    outfitPrompt: memorialOutfit, 
                    backgroundPrompt: memorialBackground,
                    hasOutfitImage: !!outfitImagePreview
                });
            } else {
                setError("กรุณาเลือกประเภทการแก้ไขก่อน (ฟื้นฟูสภาพ หรือ สร้างภาพหน้าตรง)");
                return null;
            }
          case 'editor':
            if (!primaryImage) {
                setError("กรุณาอัปโหลดรูปภาพที่ต้องการแก้ไข");
                return null;
            }
            if (!editorPrompt) {
                setError("กรุณาใส่คำสั่งสำหรับแก้ไขภาพ");
                return null;
            }
            return buildEditorPrompt(editorPrompt);
        }
    }
    return null;
  }, [activeMode, analyzedGender, selectedStyles, details, primaryImage, outfitImagePreview, aspectRatio, repairSubMode, memorialOutfit, memorialBackground, isNightMode, editorPrompt]);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setGeneratedImage(null);
    setRetryAfter(0);

    const builtPrompt = buildPromptForCurrentMode();
    
    if (!builtPrompt) {
      // An error message should have been set by the builder function
      return;
    }
    
    setPrompt(builtPrompt);

    if (retryAfter > 0) return;

    setIsLoading(true);

    try {
      let resultImage: string;
      
      switch(activeMode) {
        case 'studio':
        case 'headshot':
            if (!primaryImage) throw new Error("Missing primary image for generation.");
            const framedFaceImage = await resizeImageToAspectRatio(primaryImage, aspectRatio);
            const outfitForGen = activeMode === 'studio' ? outfitImagePreview : null;
            resultImage = await generateEditedImage(builtPrompt, framedFaceImage, outfitForGen);
            break;
        case 'repair':
            if (!primaryImage) throw new Error("Missing image for repair mode.");
            const outfitForRepair = repairSubMode === 'memorial' ? outfitImagePreview : null;
            resultImage = await generateEditedImage(builtPrompt, primaryImage, outfitForRepair);
            break;
        case 'editor':
            if (!primaryImage) throw new Error("Missing image for editor mode.");
            resultImage = await generateEditedImage(builtPrompt, primaryImage, null);
            break;
        default:
            throw new Error("Invalid active mode for image generation.");
      }
      setGeneratedImage(resultImage);

    } catch (e: any) {
      console.error("Image generation failed:", e);
      const { message, retryAfter: delay } = getFriendlyErrorMessage(e);
      setError(message);
      if (delay) {
        setRetryAfter(delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [buildPromptForCurrentMode, activeMode, primaryImage, outfitImagePreview, aspectRatio, retryAfter, repairSubMode]);

  const handleAnalyzeImage = useCallback(async () => {
    if (!primaryImage) {
        setError("กรุณาอัปโหลดรูปภาพเพื่อวิเคราะห์");
        return;
    }
    setIsProcessingAnalysis(true);
    setError(null);
    try {
        const description = await analyzeImage(primaryImage);
        setEditorPrompt(description);
    } catch (e) {
        const { message } = getFriendlyErrorMessage(e);
        setError(`การวิเคราะห์ภาพล้มเหลว: ${message}`);
    } finally {
        setIsProcessingAnalysis(false);
    }
  }, [primaryImage]);

  const handleEnhancePrompt = useCallback(async () => {
      if (!editorPrompt) {
          setError("กรุณาใส่พรอมต์เพื่อปรับปรุง");
          return;
      }
      setIsProcessingEnhancement(true);
      setError(null);
      try {
          const enhanced = await enhanceEditPrompt(editorPrompt);
          setEditorPrompt(enhanced);
      } catch (e) {
          const { message } = getFriendlyErrorMessage(e);
          setError(`การปรับปรุงพรอมต์ล้มเหลว: ${message}`);
      } finally {
          setIsProcessingEnhancement(false);
      }
  }, [editorPrompt]);
  
  // --- Dynamic Content Renderers ---

  const getUploaderLabel = (position: 'left' | 'right') => {
      switch(activeMode) {
          case 'editor':
          case 'repair':
          case 'headshot':
              return "รูปภาพอ้างอิง (บังคับ)";
          case 'studio':
          default:
              return position === 'left' ? "รูปใบหน้า (บังคับ)" : "รูปชุดตัวอย่าง (ถ้ามี)";
      }
  }
  
  const isStudioLikeMode = activeMode === 'studio' || activeMode === 'headshot';

  return (
    <div className="bg-transparent text-slate-200 flex flex-col h-screen p-4 sm:p-6 md:p-8">
      <div className="main-container p-6 sm:p-8 shadow-2xl w-full max-w-full mx-auto flex flex-col h-full overflow-hidden">
        <Header />
        <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0 overflow-hidden">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 -mr-4">
            {/* Section 1: Uploads & Mode-Specific Controls */}
            <section className="cyber-panel p-6 flex-shrink-0">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className={`w-full ${activeMode === 'studio' ? 'lg:w-1/2' : 'lg:w-full'}`}>
                      <label className="block text-lg font-medium text-slate-300 mb-2">
                        <div className='flex items-center gap-2'>
                          <span>{getUploaderLabel('left')}</span>
                          {isAnalyzingGender && (
                              <svg className="animate-spin h-5 w-5 text-cyber-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                          )}
                        </div>
                        <div className="min-h-[21px] text-sm mt-1">
                          {analyzedGender && <span className="text-cyber-blue">AI วิเคราะห์ว่าเป็น: {analyzedGender}</span>}
                          {genderAnalysisError && <span className="text-cyber-pink">{genderAnalysisError}</span>}
                        </div>
                      </label>
                      <ImageUploader imagePreview={primaryImage} onImageSelect={handlePrimaryImageSelect} />
                    </div>
                    {activeMode === 'studio' && (
                      <div className="w-full lg:w-1/2">
                        <label className="block text-lg font-medium text-slate-300 mb-2">
                          {getUploaderLabel('right')}
                        </label>
                        <div className="min-h-[21px] mt-1"></div>
                        <ImageUploader imagePreview={outfitImagePreview} onImageSelect={handleOutfitImageUpload} />
                      </div>
                    )}
                </div>
                {isStudioLikeMode && <div className="mt-6"><AspectRatioSelector selectedRatio={aspectRatio} setRatio={setAspectRatio} /></div>}
            </section>
            
            {/* Section 2: Mode-Specific Selections */}
            {isStudioLikeMode && (
              <section className="cyber-panel p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-300">2. เลือกสไตล์</h2>
                    <div className="flex items-center gap-4">
                      {saveNotification && <span className="text-cyber-blue text-sm transition-opacity duration-300">{saveNotification}</span>}
                      <button
                          id="save-style-btn"
                          className="cyber-button secondary text-sm"
                          onClick={handleSaveStyle}
                      >
                          บันทึกสไตล์
                      </button>
                    </div>
                </div>
                <StyleSelector 
                  selectedStyles={selectedStyles} 
                  onStyleSelect={handleStyleSelect}
                  onDeletePreset={handleDeletePreset}
                  isOutfitUploaded={activeMode === 'studio' && !!outfitImagePreview}
                  savedPresets={savedPresets}
                  analyzedGender={analyzedGender}
                />
                <div className="mt-6 max-w-3xl mx-auto">
                  <label htmlFor="details-input" className="block text-sm font-medium text-slate-300 mb-2 text-center">
                    เพิ่มคำสั่งพิเศษ (ถ้ามี)
                  </label>
                  <textarea
                    id="details-input"
                    className="w-full p-3"
                    placeholder="เช่น: ไม่เอาต่างหู, ขอผมสีน้ำตาลเข้ม..."
                    rows={2}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  ></textarea>
                </div>
              </section>
            )}

            {activeMode === 'repair' && (
                <section className="cyber-panel p-6">
                    <RepairControls
                        subMode={repairSubMode}
                        setSubMode={setRepairSubMode}
                        selectedOutfit={memorialOutfit}
                        setSelectedOutfit={(prompt: string) => {
                            setMemorialOutfit(prompt);
                            if (outfitImagePreview) {
                                setOutfitImagePreview(null);
                            }
                        }}
                        selectedBackground={memorialBackground}
                        setSelectedBackground={setMemorialBackground}
                        isNightMode={isNightMode}
                        setIsNightMode={setIsNightMode}
                        outfitImage={outfitImagePreview}
                        onOutfitImageUpload={handleOutfitImageUpload}
                    />
                </section>
            )}
            
            {activeMode === 'editor' && (
                <section className="cyber-panel p-6">
                    <EditorControls 
                        editorPrompt={editorPrompt} 
                        setEditorPrompt={setEditorPrompt}
                        onAnalyze={handleAnalyzeImage}
                        onEnhance={handleEnhancePrompt}
                        isProcessingAnalysis={isProcessingAnalysis}
                        isProcessingEnhancement={isProcessingEnhancement}
                        hasImage={!!primaryImage}
                    />
                </section>
            )}

            {/* Section 3: UNIFIED ACTION BUTTONS */}
            <section className="flex flex-col sm:flex-row gap-4 pt-2 flex-shrink-0">
                <button
                  id="generate-image-btn"
                  className="w-full cyber-button primary font-bold py-3 px-4 text-lg flex items-center justify-center gap-2"
                  onClick={handleGenerate}
                  disabled={isLoading || retryAfter > 0 || isProcessingAnalysis || isProcessingEnhancement || isAnalyzingGender}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {isLoading
                    ? 'กำลังสร้างภาพ...'
                    : retryAfter > 0
                    ? `โปรดรอ (${retryAfter}s)`
                    : 'สร้างภาพ'}
                </button>
            </section>
          </div>
          
          {/* Right Column: Results */}
          <section className="flex-grow flex flex-col min-h-0">
              <ResultDisplay 
                prompt={prompt}
                generatedImage={generatedImage}
                isLoading={isLoading}
                error={error}
                onRegenerate={handleGenerate}
              />
          </section>
        </main>
        
        <div className="mt-6 text-center text-slate-500 text-sm leading-relaxed flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-4 text-cyber-blue">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Nano banana powered app</span>
          </div>
          <p>ผู้ออกแบบ Artwork</p>
          <p>MIX NATTANON</p>
          <p>ร้าน PIS COPY</p>
          <button
            onClick={() => setIsHowAiWorksModalOpen(true)}
            className="mt-4 text-cyber-pink hover:text-white hover:underline transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            สงสัยไหม AI ทำงานอย่างไร?
          </button>
        </div>
      </div>
      <HowAiWorksModal
        isOpen={isHowAiWorksModalOpen}
        onClose={() => setIsHowAiWorksModalOpen(false)}
      />
    </div>
  );
};

export default App;