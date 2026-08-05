import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.service';
import { generateSurprisePDF } from '../services/pdfService';
import { Heart, Save, Eye, Copy, LogOut, Check, Image as ImageIcon, Music, Calendar, Settings, AlertCircle, Plus, Trash2, QrCode, Star, Sparkles, Mail, Lock, Mic, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import LivingBackground from '../components/animations/LivingBackground';
import ReusableUploader from '../components/shared/ReusableUploader';
import { thingsILove as defaultThingsILove, futureDreams as defaultFutureDreams } from '../apps/virtual-date/data/placeholderData';
import DemoLinkGenerator from '../components/shared/DemoLinkGenerator';
import CustomizerWalkthrough from '../components/shared/CustomizerWalkthrough';
import { OccasionRegistry, getOccasionKey } from '../registry/occasionRegistry';
import { routePreloader } from '../utils/routePreloader';
import PageSkeleton from '../components/common/PageSkeleton';
import { getTierPermissions } from '../utils/tierPermissions';
import { getOccasionThemeName } from './CustomerDashboard';
import PasswordCustomizerTab from '../components/shared/PasswordCustomizerTab';

function getDreamIcon(title) {
  if (!title) return '✨';
  const t = title.toLowerCase();
  if (t.includes('travel') || t.includes('trip') || t.includes('flight') || t.includes('explore') || t.includes('world') || t.includes('goa') || t.includes('paris') || t.includes('vacation')) return '✈️';
  if (t.includes('sunrise') || t.includes('sunset') || t.includes('morning') || t.includes('sun') || t.includes('sky')) return '🌅';
  if (t.includes('build') || t.includes('house') || t.includes('home') || t.includes('garden') || t.includes('villa')) return '🏡';
  if (t.includes('learn') || t.includes('skill') || t.includes('pottery') || t.includes('cook') || t.includes('class') || t.includes('paint') || t.includes('art')) return '🎨';
  if (t.includes('visit') || t.includes('forest') || t.includes('hill') || t.includes('mountain') || t.includes('nature') || t.includes('lake')) return '🌲';
  if (t.includes('flat') || t.includes('apartment') || t.includes('buy') || t.includes('room') || t.includes('city') || t.includes('rent')) return '🏢';
  if (t.includes('marry') || t.includes('wedding') || t.includes('marriage') || t.includes('love') || t.includes('forever') || t.includes('together')) return '💑';
  if (t.includes('date') || t.includes('cafe') || t.includes('dinner') || t.includes('restaurant') || t.includes('food') || t.includes('lunch') || t.includes('breakfast')) return '🍴';
  if (t.includes('pet') || t.includes('dog') || t.includes('cat') || t.includes('puppy') || t.includes('kitten')) return '🐶';
  if (t.includes('baby') || t.includes('kid') || t.includes('child') || t.includes('family')) return '👶';
  if (t.includes('old') || t.includes('grow') || t.includes('future') || t.includes('age')) return '👵';
  return '💖';
}

export default function CustomerMiniPanel() {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('customerToken');

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(
      localStorage.getItem('adminToken') ||
      localStorage.getItem('customerToken') ||
      localStorage.getItem('customerEmail') ||
      localStorage.getItem('instanceId')
    );
  });

  // Verify auth on mount/instanceId change
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const customerToken = localStorage.getItem('customerToken');
    const customerEmail = localStorage.getItem('customerEmail');

    if (adminToken || customerToken || customerEmail) {
      setIsAuthenticated(true);
    } else {
      sessionStorage.setItem('returnUrl', `/customizer/${instanceId}`);
      navigate('/login');
    }
  }, [instanceId, token, navigate]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Instance Config State
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [message, setMessage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#E11D48');
  const [photos, setPhotos] = useState([]);

  // Birthday surprise specific states
  const [birthdaySong, setBirthdaySong] = useState('');
  const [cakeImage, setCakeImage] = useState('');
  const [cakeFeedingImage, setCakeFeedingImage] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('');
  const [memories, setMemories] = useState([]); // [{ imageUrl, title, description }]
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityHint, setSecurityHint] = useState('');
  
  // Global Password Protection Gateway states
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [unlockHeading, setUnlockHeading] = useState('Unlock Your Surprise');
  const [unlockSubtitle, setUnlockSubtitle] = useState('This experience was created only for you.');
  const [wrongPasswordMessage, setWrongPasswordMessage] = useState('I think your boyfriend remembers a different secret ❤️');
  const [successMessage, setSuccessMessage] = useState('Access Granted! Unlocking your magical experience...');
  const [enableNumericKeypad, setEnableNumericKeypad] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');

  const [recipientResponse, setRecipientResponse] = useState('');
  const [feedbackLiked, setFeedbackLiked] = useState(null);

  // Valentines surprise specific states
  const [vMemory1Date, setVMemory1Date] = useState('');
  const [vMemory1Title, setVMemory1Title] = useState('');
  const [vMemory1Desc, setVMemory1Desc] = useState('');
  const [vMemory2Date, setVMemory2Date] = useState('');
  const [vMemory2Title, setVMemory2Title] = useState('');
  const [vMemory2Desc, setVMemory2Desc] = useState('');
  const [vMemory3Date, setVMemory3Date] = useState('');
  const [vMemory3Title, setVMemory3Title] = useState('');
  const [vMemory3Desc, setVMemory3Desc] = useState('');

  const [vLove1Title, setVLove1Title] = useState('');
  const [vLove1Desc, setVLove1Desc] = useState('');
  const [vLove2Title, setVLove2Title] = useState('');
  const [vLove2Desc, setVLove2Desc] = useState('');
  const [vLove3Title, setVLove3Title] = useState('');
  const [vLove3Desc, setVLove3Desc] = useState('');

  const [vVoiceIntro, setVVoiceIntro] = useState('');
  const [vVoiceUrl, setVVoiceUrl] = useState('');

  const [vWhisper1, setVWhisper1] = useState('');
  const [vWhisper2, setVWhisper2] = useState('');
  const [vWhisper3, setVWhisper3] = useState('');

  // Valentine timeline memory states
  const [vTimeline, setVTimeline] = useState([]);
  const [vThingsILove, setVThingsILove] = useState([]);
  const [vFutureDreams, setVFutureDreams] = useState([]);
  const [newVTimelineDate, setNewVTimelineDate] = useState('');
  const [newVTimelineTitle, setNewVTimelineTitle] = useState('');
  const [newVTimelineImage, setNewVTimelineImage] = useState('');
  const [newVTimelineDesc, setNewVTimelineDesc] = useState('');
  const [generatingVTimelineAI, setGeneratingVTimelineAI] = useState(false);
  const [valentineGreeting, setValentineGreeting] = useState('');
  const [valentineProposalText, setValentineProposalText] = useState('');
  const [vRoseTitle, setVRoseTitle] = useState('');
  const [vRoseDesc1, setVRoseDesc1] = useState('');
  const [vRoseDesc2, setVRoseDesc2] = useState('');
  const [vChocTitle, setVChocTitle] = useState('');
  const [vChocText, setVChocText] = useState('');
  const [vTeddyWait, setVTeddyWait] = useState('');
  const [vTeddyGo, setVTeddyGo] = useState('');
  const [vTeddyFound, setVTeddyFound] = useState('');
  const [vTeddyText, setVTeddyText] = useState('');
  const [vPromiseTitle, setVPromiseTitle] = useState('');
  const [vPromiseSub, setVPromiseSub] = useState('');
  const [vPromisePoints, setVPromisePoints] = useState('');
  const [vHugIntro, setVHugIntro] = useState('');
  const [vHugTitle, setVHugTitle] = useState('');
  const [vHugDesc, setVHugDesc] = useState('');
  const [vHugBtn, setVHugBtn] = useState('');
  const [unlockAllDays, setUnlockAllDays] = useState(false);

  // Proposal specific states
  const [proposalStarPhoto, setProposalStarPhoto] = useState('');
  const [proposalStarName, setProposalStarName] = useState('');
  const [proposalStarNickname, setProposalStarNickname] = useState('');
  const [proposalStarIntro, setProposalStarIntro] = useState('');
  const [proposalHobbies, setProposalHobbies] = useState('');
  const [proposalFavFood, setProposalFavFood] = useState('');
  const [proposalFavSongs, setProposalFavSongs] = useState('');
  const [proposalFavPlace, setProposalFavPlace] = useState('');
  const [proposalFavCafe, setProposalFavCafe] = useState('');
  const [proposalFavMovie, setProposalFavMovie] = useState('');
  const [proposalFavFlower, setProposalFavFlower] = useState('');
  const [proposalFirstPhoto, setProposalFirstPhoto] = useState('');
  const [proposalFirstDate, setProposalFirstDate] = useState('');
  const [proposalFirstLocation, setProposalFirstLocation] = useState('');
  const [proposalFirstTitle, setProposalFirstTitle] = useState('');
  const [proposalFirstDesc, setProposalFirstDesc] = useState('');
  const [proposalTimeline, setProposalTimeline] = useState([]);
  const [proposalReasons, setProposalReasons] = useState([]);
  const [proposalLetters, setProposalLetters] = useState([]);
  const [proposalSkyMemories, setProposalSkyMemories] = useState([]);
  const [proposalQuestion, setProposalQuestion] = useState('Will You Be Mine Forever?');
  const [proposalYesBtn, setProposalYesBtn] = useState('💍 YES');
  const [proposalThinkBtn, setProposalThinkBtn] = useState('🤍 Let Me Think');
  const [proposalThinkResponse, setProposalThinkResponse] = useState('');
  const [proposalCelebrationMusic, setProposalCelebrationMusic] = useState('');
  const [proposalCelebrateLetter, setProposalCelebrateLetter] = useState('');
  const [proposalDreams, setProposalDreams] = useState([]);
  const [showSaveValidationPopup, setShowSaveValidationPopup] = useState(false);

  // Loading states for file uploads
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [uploadingBdaySong, setUploadingBdaySong] = useState(false);
  const [uploadingCakeFeedingA, setUploadingCakeFeedingA] = useState(false);
  const [uploadingCakeFeedingB, setUploadingCakeFeedingB] = useState(false);
  const [uploadingMemoryNode, setUploadingMemoryNode] = useState(false);
  const [uploadingVTimeline, setUploadingVTimeline] = useState(false);
  const [uploadingVoiceFile, setUploadingVoiceFile] = useState(false);

  // New memory form states
  const [newMemImage, setNewMemImage] = useState('');
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDesc, setNewMemDesc] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  // AI assistant configurations
  const [letterPrompt, setLetterPrompt] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [malePhoto, setMalePhoto] = useState('');
  const [femalePhoto, setFemalePhoto] = useState('');

  // Girlfriend's Day state
  const [girlfriendName, setGirlfriendName] = useState('');
  const [boyfriendName, setBoyfriendName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [letterText, setLetterText] = useState('');
  const [girlfriendPhoto, setGirlfriendPhoto] = useState('');
  const [boyfriendPhoto, setBoyfriendPhoto] = useState('');
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [bgMusicUrl, setBgMusicUrl] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');

  // Extra metadata
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const isVirtualDate = getOccasionKey(categorySlug) === 'virtual-date' ||
    categorySlug.includes('virtual-date') ||
    categorySlug.includes('valentine');
  const [tierName, setTierName] = useState('');
  const [categoryTiers, setCategoryTiers] = useState([]);
  const [pricePaid, setPricePaid] = useState(0);
  const [status, setStatus] = useState('Paid');
  const [demoId, setDemoId] = useState(searchParams.get('demoId') || '');
  const [clientReplyText, setClientReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const canAddPhoto = (currentCount = photos.length) => {
    const permissions = getTierPermissions(tierName, categoryTiers);
    const { isBasic, photosLimit, dbTier } = permissions;

    if (currentCount >= photosLimit) {
      if (isBasic) {
        alert(`Upgrade Required\n\nYou've reached the photo limit (${photosLimit}) for the ${dbTier?.name || 'Basic'} plan. Upgrade to Premium to add more photos and unlock all premium features! 💖`);
      } else {
        alert(`Limit Reached\n\nYou've uploaded the maximum number of photos (${photosLimit}) allowed in your ${dbTier?.name || 'Premium'} plan.`);
      }
      return false;
    }
    return true;
  };

  const handleUpgradeToPremium = async () => {
    const premiumTier = categoryTiers.find(t => t.name.toLowerCase() === 'premium');
    if (!premiumTier) {
      alert("Upgrade failed: Premium pricing is not configured for this surprise theme.");
      return;
    }

    const difference = Math.max(0, premiumTier.price - pricePaid);
    const confirmUpgrade = window.confirm(
      `Would you like to upgrade your plan to Premium? \n\nThis will unlock locked configuration settings, support up to 10 memories, 12 moments photos, and give you access to the Live Control center!\n\nUpgrade Price: ₹${difference}`
    );
    if (!confirmUpgrade) return;

    try {
      const data = await api.createUpgradePaymentOrder({ instanceId }, token);
      if (!data.success) {
        alert(data.message || 'Error creating upgrade checkout order.');
        return;
      }

      if (data.freeUpgrade) {
        setTierName('Premium');
        alert("Your surprise has been upgraded to Premium successfully for free! 🎉");
        return;
      }

      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay Payment Gateway SDK. Please check your internet connection.");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency || 'INR',
        name: "AnKa Premium Upgrade",
        description: `Upgrade Plan to Premium for ${categoryName}`,
        order_id: data.orderId,
        handler: async (response) => {
          const verifyPayload = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          };

          try {
            const verifyRes = await api.verifyUpgradeSignature(verifyPayload, token);
            if (verifyRes.success) {
              setTierName('Premium');
              setPricePaid(prev => prev + data.amount);
              alert('Congratulations! Your surprise is successfully upgraded to Premium! 🚀 Locked features are now fully functional.');
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            alert('Verification error.');
          }
        },
        prefill: {
          name: data.customerName,
          email: data.customerEmail,
          contact: data.customerPhone
        },
        theme: {
          color: "#E11D48"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Upgrade request error.');
    }
  };

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState('');
  const [uploadingVoice, setUploadingVoice] = useState(false);

  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  const recordingTimerRef = React.useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setPreviewAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const uploadRecordedVoice = async () => {
    if (!recordedBlob) return;
    setUploadingVoice(true);
    try {
      const file = new File([recordedBlob], 'voice-note.wav', { type: 'audio/wav' });

      // Enforce 20MB maximum limit for voice notes & music
      if (file.size > 20 * 1024 * 1024) {
        alert(`Voice note size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 20MB maximum limit.`);
        return;
      }

      // High-volume direct presigned Cloudinary upload (bypasses Node.js server RAM)
      let data = await api.uploadMediaDirect(file, 'anka_voice_notes');

      // Fallback to standard server uploader if presign is unavailable
      if (!data || !data.success) {
        data = await api.uploadFile(file);
      }

      if (data && data.success && data.url) {
        setVVoiceUrl(data.url);
        alert('Voice note uploaded successfully!');
      } else {
        alert(data?.message || 'Failed to upload voice note.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading voice note.');
    } finally {
      setUploadingVoice(false);
    }
  };

  const formatSeconds = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Form states
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);

  // Closing Hinglish messages
  const closingMessages = [
    "Some Moments are too Special to be Explained... they simply need to be experienced",
    "Some Gifts aren't meant to be opened with your hands... They're meant to be discovered with your heart",
    "Every unforgettable story begins with a single step This one begins with a single scan"
  ];
  const [selectedClosingMsg, setSelectedClosingMsg] = useState('');

  // Rating States
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Preset photos gallery
  const presetPhotos = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1474552226712-ac0f0962a95d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400"
  ];

  // Confetti local visual effect
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchInstance = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const currentToken = localStorage.getItem('customerToken') || localStorage.getItem('adminToken');
        const data = await api.getInstanceDetails(instanceId, currentToken);
        if (data.success) {
          const config = data.instance.config || {};
          setRecipientName(config.recipientName || '');
          setSenderName(config.senderName || '');
          const letterVal = config.letterText || config.message || '';
          setMessage(letterVal);
          setFinalMessage(config.finalMessage || '');

          const musicVal = config.backgroundMusic || config.bgMusicUrl || config.musicUrl || '';
          setMusicUrl(musicVal);
          setBackgroundMusic(musicVal);
          setThemeColor(config.themeColor || '#E11D48');

          // Backward-compatible structured photo album objects
          const normalizedPhotos = (config.photos || []).map(p => {
            if (typeof p === 'string') {
              return { url: p, title: '', caption: '', description: '' };
            }
            return {
              url: p.url || '',
              title: p.title || '',
              caption: p.caption || '',
              description: p.description || ''
            };
          });
          setPhotos(normalizedPhotos);

          // Load Birthday configurations & normalize memory tree objects
          setBirthdaySong(config.birthdaySongUrl || config.birthdaySong || '');
          setCakeImage(config.cakeImage || '');
          setCakeFeedingImage(config.cakeFeedingImage || '');
          
          const normalizedMemories = (config.memories || []).map(m => {
            if (typeof m === 'string') {
              return { imageUrl: m, url: m, title: 'Memory', description: 'A special moment' };
            }
            return {
              imageUrl: m.imageUrl || m.url || m.image || '',
              url: m.url || m.imageUrl || m.image || '',
              title: m.title || m.tag || '',
              description: m.description || '',
              question: m.question || m.securityQuestion || '',
              answer: m.answer || m.securityAnswer || ''
            };
          });
          setMemories(normalizedMemories);
          setSecurityQuestion(config.securityQuestion || '');
          setSecurityAnswer(config.securityAnswer || '');
          setSecurityHint(config.securityHint || '');
          setMalePhoto(config.malePhotoUrl || '');
          setFemalePhoto(config.femalePhotoUrl || '');

          // Load Valentine's configurations
          setVMemory1Date(config.vMemory1Date || '');
          setVMemory1Title(config.vMemory1Title || '');
          setVMemory1Desc(config.vMemory1Desc || '');
          setVMemory2Date(config.vMemory2Date || '');
          setVMemory2Title(config.vMemory2Title || '');
          setVMemory2Desc(config.vMemory2Desc || '');
          setVMemory3Date(config.vMemory3Date || '');
          setVMemory3Title(config.vMemory3Title || '');
          setVMemory3Desc(config.vMemory3Desc || '');

          setVLove1Title(config.vLove1Title || '');
          setVLove1Desc(config.vLove1Desc || '');
          setVLove2Title(config.vLove2Title || '');
          setVLove2Desc(config.vLove2Desc || '');
          setVLove3Title(config.vLove3Title || '');
          setVLove3Desc(config.vLove3Desc || '');

          setVVoiceIntro(config.vVoiceIntro || '');
          setVVoiceUrl(config.vVoiceUrl || '');

          setVWhisper1(config.vWhisper1 || '');
          setVWhisper2(config.vWhisper2 || '');
          setVWhisper3(config.vWhisper3 || '');
          setVTimeline(config.vTimeline || []);
          setVThingsILove(config.thingsILove && config.thingsILove.length > 0 ? config.thingsILove : defaultThingsILove);
          setVFutureDreams(config.futureDreams && config.futureDreams.length > 0 ? config.futureDreams : defaultFutureDreams);
          setValentineGreeting(config.valentineGreeting || '');
          setValentineProposalText(config.valentineProposalText || '');
          setVRoseTitle(config.vRoseTitle || '');
          setVRoseDesc1(config.vRoseDesc1 || '');
          setVRoseDesc2(config.vRoseDesc2 || '');
          setVChocTitle(config.vChocTitle || '');
          setVChocText(config.vChocText || '');
          setVTeddyWait(config.vTeddyWait || '');
          setVTeddyGo(config.vTeddyGo || '');
          setVTeddyFound(config.vTeddyFound || '');
          setVTeddyText(config.vTeddyText || '');
          setVPromiseTitle(config.vPromiseTitle || '');
          setVPromiseSub(config.vPromiseSub || '');
          setVPromisePoints(config.vPromisePoints || '');
          setVHugIntro(config.vHugIntro || '');
          setVHugTitle(config.vHugTitle || '');
          setVHugDesc(config.vHugDesc || '');
          setVHugBtn(config.vHugBtn || '');
          setUnlockAllDays(config.unlockAllDays || false);

          // Load Proposal configurations
          setProposalStarPhoto(config.proposalStarPhoto || '');
          setProposalStarName(config.proposalStarName || '');
          setProposalStarNickname(config.proposalStarNickname || '');
          setProposalStarIntro(config.proposalStarIntro || '');
          setProposalHobbies(config.proposalHobbies || '');
          setProposalFavFood(config.proposalFavFood || '');
          setProposalFavSongs(config.proposalFavSongs || '');
          setProposalFavPlace(config.proposalFavPlace || '');
          setProposalFavCafe(config.proposalFavCafe || '');
          setProposalFavMovie(config.proposalFavMovie || '');
          setProposalFavFlower(config.proposalFavFlower || '');
          setProposalFirstPhoto(config.proposalFirstPhoto || '');
          setProposalFirstDate(config.proposalFirstDate || '');
          setProposalFirstLocation(config.proposalFirstLocation || '');
          setProposalFirstTitle(config.proposalFirstTitle || '');
          setProposalFirstDesc(config.proposalFirstDesc || '');
          setProposalTimeline(config.proposalTimeline || []);
          setProposalReasons(config.proposalReasons || []);
          setProposalLetters(config.proposalLetters || []);
          setProposalSkyMemories(config.proposalSkyMemories || []);
          setProposalQuestion(config.proposalQuestion || 'Will You Be Mine Forever?');
          setProposalYesBtn(config.proposalYesBtn || '💍 YES');
          setProposalThinkBtn(config.proposalThinkBtn || '🤍 Let Me Think');
          setProposalThinkResponse(config.proposalThinkResponse || '');
          setProposalCelebrationMusic(config.proposalCelebrationMusic || '');
          setProposalCelebrateLetter(config.proposalCelebrateLetter || '');
          setProposalDreams(config.proposalDreams || []);

          // Populate Girlfriend's Day config
          setGirlfriendName(config.girlfriendName || config.partnerName || recipientName || '');
          setBoyfriendName(config.boyfriendName || config.yourName || senderName || '');
          setSelectedTheme(config.theme || config.selectedTheme || data.instance.demo?.themeSlug || 'dark');
          setLetterText(config.letterText || '');
          setGirlfriendPhoto(config.girlfriendPhoto || (config.photos?.[0]?.url || config.photos?.[0] || ''));
          setBoyfriendPhoto(config.boyfriendPhoto || (config.photos?.[1]?.url || config.photos?.[1] || ''));
          setChapters(config.chapters || []);
          setQuestions(config.questions || []);
          setReasons(config.reasons || []);
          setBgMusicUrl(config.bgMusicUrl || config.musicUrl || '');
          setVoiceNoteUrl(config.voiceNoteUrl || config.audioNoteUrl || '');

          // Load Password Protection configurations from database
          setPasswordEnabled(Boolean(config.passwordEnabled));
          setPassword(config.password || config.securityAnswer || '');
          setPasswordHint(config.passwordHint || config.securityHint || '');
          if (config.unlockHeading) setUnlockHeading(config.unlockHeading);
          if (config.unlockSubtitle) setUnlockSubtitle(config.unlockSubtitle);
          if (config.wrongPasswordMessage) setWrongPasswordMessage(config.wrongPasswordMessage);
          if (config.successMessage) setSuccessMessage(config.successMessage);
          if (config.enableNumericKeypad !== undefined) setEnableNumericKeypad(Boolean(config.enableNumericKeypad));
          setBackgroundImage(config.backgroundImage || '');

          setRecipientResponse(data.instance.recipientResponse || '');
          setClientReplyText(data.instance.adminResponse || '');
          setFeedbackLiked(data.instance.feedbackLiked);

          setCategoryName(data.instance.category?.name || data.instance.category || 'Surprise');
          const catSlug = typeof data.instance.category === 'object'
            ? (data.instance.category?.slug || data.instance.category?.name)
            : (data.instance.categorySlug || data.instance.category || '');
          const demoSlug = data.instance.demo?.themeSlug || data.instance.demo?.slug || data.instance.demo?.categorySlug || '';
          const resolvedCategorySlug = (demoSlug || catSlug || '').toLowerCase().trim();
          setCategorySlug(resolvedCategorySlug);
          const rawTier = data.instance.tier;
          const isExplicitDemoParam = (instanceId || '').toLowerCase().startsWith('demo-') || searchParams.get('demo') === 'true';
          setTierName(rawTier ? rawTier : (isExplicitDemoParam ? 'Premium' : 'Basic'));
          setCategoryTiers(data.instance.categoryTiers || []);
          setPricePaid(data.instance.pricePaid || 0);
          setStatus(data.instance.status || 'Paid');
          if (data.instance.demo) {
            setDemoId(data.instance.demo);
          }
          setRatingSubmitted(data.instance.ratingSubmitted || false);
        } else {
          setErrorMsg(data.message || 'Error loading configurations.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Network error fetching configurations.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstance();
  }, [instanceId, isAuthenticated]);

  const handleSave = async (e, forceSave = false) => {
    if (e) e.preventDefault();
    if (saving) return false;

    // Check empty sections validation before saving
    if (categorySlug.toLowerCase().includes('proposal') && !forceSave) {
      const isAnySectionEmpty = !proposalStarPhoto || !proposalStarName ||
        proposalTimeline.length === 0 ||
        proposalReasons.length === 0 || proposalLetters.length === 0 ||
        proposalSkyMemories.length === 0;

      if (isAnySectionEmpty) {
        setShowSaveValidationPopup(true);
        return false;
      }
    }

    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      // 1. Build common config fields
      const categoryConfig = {
        recipientName,
        senderName,
        specialDate: specialDate ? new Date(specialDate) : null,
        message,
        letterText: message,
        finalMessage: finalMessage || message,
        musicUrl,
        themeColor,
        photos, // saves objects array containing URL + captions
        passwordEnabled,
        password: password || securityAnswer,
        securityAnswer: password || securityAnswer,
        passwordHint: passwordHint || securityHint,
        securityHint: passwordHint || securityHint,
        unlockHeading,
        unlockSubtitle,
        wrongPasswordMessage,
        successMessage,
        enableNumericKeypad,
        backgroundImage
      };

      // 2. Add category-specific fields dynamically
      const occasionKey = getOccasionKey(categorySlug);
      if (occasionKey.includes('birthday')) {
        Object.assign(categoryConfig, {
          birthdaySong,
          birthdaySongUrl: birthdaySong,
          cakeImage,
          cakeFeedingImage,
          finalMessage,
          backgroundMusic,
          memories,
          securityQuestion,
          securityAnswer,
          securityHint,
          malePhotoUrl: malePhoto,
          femalePhotoUrl: femalePhoto
        });
      } else if (occasionKey === 'valentine') {
        Object.assign(categoryConfig, {
          vMemory1Date,
          vMemory1Title,
          vMemory1Desc,
          vMemory2Date,
          vMemory2Title,
          vMemory2Desc,
          vMemory3Date,
          vMemory3Title,
          vMemory3Desc,
          vLove1Title,
          vLove1Desc,
          vLove2Title,
          vLove2Desc,
          vLove3Title,
          vLove3Desc,
          vVoiceIntro,
          vVoiceUrl,
          vWhisper1,
          vWhisper2,
          vWhisper3,
          vTimeline,
          thingsILove: vThingsILove,
          futureDreams: vFutureDreams.map(dream => ({
            ...dream,
            icon: getDreamIcon(dream.title)
          })),
          valentineGreeting,
          valentineProposalText,
          vRoseTitle,
          vRoseDesc1,
          vRoseDesc2,
          vChocTitle,
          vChocText,
          vTeddyWait,
          vTeddyGo,
          vTeddyFound,
          vTeddyText,
          vPromiseTitle,
          vPromiseSub,
          vPromisePoints,
          vHugIntro,
          vHugTitle,
          vHugDesc,
          vHugBtn,
          unlockAllDays
        });
      } else if (occasionKey === 'proposal') {
        Object.assign(categoryConfig, {
          proposalStarPhoto,
          proposalStarName,
          proposalStarNickname,
          proposalStarIntro,
          proposalHobbies,
          proposalFavFood,
          proposalFavSongs,
          proposalFavPlace,
          proposalFavCafe,
          proposalFavMovie,
          proposalFavFlower,
          proposalFirstPhoto,
          proposalFirstDate,
          proposalFirstLocation,
          proposalFirstTitle,
          proposalFirstDesc,
          proposalTimeline,
          proposalReasons,
          proposalLetters,
          proposalSkyMemories,
          proposalQuestion,
          proposalYesBtn,
          proposalThinkBtn,
          proposalThinkResponse,
          proposalCelebrationMusic,
          proposalCelebrateLetter,
          proposalDreams
        });
      } else if (occasionKey.includes('girlfriend')) {
        Object.assign(categoryConfig, {
          girlfriendName,
          boyfriendName,
          theme: selectedTheme,
          selectedTheme,
          letterText,
          girlfriendPhoto,
          boyfriendPhoto,
          photos: [girlfriendPhoto, boyfriendPhoto].filter(Boolean),
          chapters,
          questions,
          reasons,
          bgMusicUrl,
          voiceNoteUrl
        });
      }

      const payload = {
        config: categoryConfig,
        status: status === 'Paid' ? 'Content Added' : status
      };

      const data = await api.updateInstanceConfig(instanceId, payload, token);
      if (data.success) {
        setSaveSuccess(true);
        setStatus(data.instance.status);
        setTimeout(() => setSaveSuccess(false), 3000);
        setSaving(false);
        return true;
      } else {
        setErrorMsg(data.message || 'Error saving changes.');
        setSaving(false);
        return false;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error saving changes.');
      setSaving(false);
      return false;
    }
  };

  const handleGenerateAILetter = async (e) => {
    e.preventDefault();
    if (!letterPrompt.trim()) {
      alert('Please enter a topic or context prompt first!');
      return;
    }
    setGeneratingLetter(true);
    try {
      const data = await api.generateAILetter(letterPrompt, recipientName, senderName);
      if (data.success) {
        setMessage(data.letter);
        alert('Emotional letter generated successfully!');
      } else {
        alert(data.message || 'AI letter generation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error generating love letter.');
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleSendClientReply = async (e) => {
    e.preventDefault();
    if (!clientReplyText.trim()) {
      alert('Please enter your response message first!');
      return;
    }
    setSubmittingReply(true);
    try {
      const data = await api.submitAdminResponse(instanceId, clientReplyText, token);
      if (data.success) {
        setClientReplyText(data.adminResponse);
        alert('Your reply has been sent successfully to the recipient!');
      } else {
        alert(data.message || 'Failed to send reply.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error sending reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('instanceId');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleCopyLink = () => {
    const liveLink = `${window.location.origin}/s/${instanceId}`;
    navigator.clipboard.writeText(liveLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const handleCopyAdminLink = () => {
    const adminLink = `${window.location.origin}/customizer/${instanceId}`;
    navigator.clipboard.writeText(adminLink);
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
  };

  const [copiedControl, setCopiedControl] = useState(false);
  const handleCopyControlLink = () => {
    const controlLink = `${window.location.origin}/control/${instanceId}`;
    navigator.clipboard.writeText(controlLink);
    setCopiedControl(true);
    setTimeout(() => setCopiedControl(false), 2000);
  };

  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const handleDownloadPDF = async (qrColor = 'be123c', customQrBase64) => {
    setDownloadingPDF(true);
    try {
      const resolvedBgImage = 
        girlfriendPhoto ||
        boyfriendPhoto ||
        proposalStarPhoto ||
        (photos && photos.length > 0 ? (photos[0]?.url || photos[0]) : '') ||
        cakeFeedingImage ||
        cakeImage ||
        (chapters && chapters.length > 0 ? (chapters[0]?.photoLeft1 || chapters[0]?.photoRight || chapters[0]?.photoLeft2) : '') ||
        (vTimeline && vTimeline.length > 0 ? (vTimeline[0]?.image || vTimeline[0]?.url) : '') ||
        malePhoto ||
        femalePhoto ||
        '';

      await generateSurprisePDF({
        instanceId,
        closingMessage: selectedClosingMsg || 'Some Moments are too special to be explained they simply need to be experienced..',
        recipientName,
        senderName,
        qrColor,
        qrBase64: customQrBase64,
        bgImage: resolvedBgImage
      });
    } catch (err) {
      console.error(err);
      alert('Error creating PDF.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    if (!canAddPhoto()) return;
    setPhotos([...photos, { url: newPhotoUrl, title: '', caption: '', description: '' }]);
    setNewPhotoUrl('');
  };

  const handleLocalPhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!canAddPhoto(photos.length)) return;

    setUploadingAlbum(true);
    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        if (!canAddPhoto(photos.length + uploadedUrls.length)) {
          break;
        }
        const file = files[i];
        const data = await api.uploadFile(file);
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        const newObjects = uploadedUrls.map(url => ({ url, title: '', caption: '', description: '' }));
        setPhotos(prev => [...prev, ...newObjects]);
        alert(`Successfully uploaded and added ${uploadedUrls.length} photo(s) to album!`);
      } else {
        alert('Could not upload any of the selected photos.');
      }
    } catch (err) {
      alert('Error uploading file to server.');
    } finally {
      setUploadingAlbum(false);
    }
  };

  // Parse Cloudinary publicId from URL
  const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
      const parts = url.split('/upload/');
      if (parts.length < 2) return null;
      let path = parts[1];
      if (path.startsWith('v')) {
        const firstSlash = path.indexOf('/');
        if (firstSlash !== -1) {
          path = path.substring(firstSlash + 1);
        }
      }
      const lastDot = path.lastIndexOf('.');
      if (lastDot !== -1) {
        path = path.substring(0, lastDot);
      }
      return path;
    } catch (err) {
      console.error('Error parsing Cloudinary URL', err);
      return null;
    }
  };

  const handleRemovePhoto = async (index) => {
    const photoToRemove = photos[index];
    if (photoToRemove && photoToRemove.url) {
      const publicId = getCloudinaryPublicId(photoToRemove.url);
      if (publicId) {
        try {
          await api.deleteFile(publicId, token);
        } catch (err) {
          console.warn('Could not delete image from Cloudinary', err);
        }
      }
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddPresetPhoto = (url) => {
    const exists = photos.some(p => p.url === url);
    if (exists) return;
    if (!canAddPhoto()) return;
    setPhotos([...photos, { url, title: '', caption: '', description: '' }]);
  };

  // Generate Link & QR Code action
  const handleGenerateLinkAndQR = async () => {
    const saved = await handleSave();
    if (!saved) return;

    // Pick random Hinglish message
    const msg = closingMessages[Math.floor(Math.random() * closingMessages.length)];
    setSelectedClosingMsg(msg);

    // Set Live status on server
    try {
      await api.updateInstanceConfig(instanceId, { status: 'Live' }, token);
      setStatus('Live');
    } catch (err) {
      console.warn('Could not auto-toggle status to live', err);
    }

    // Trigger confetti burst
    const colors = ['#E11D48', '#FDA4AF', '#881337', '#D4AF37'];
    const list = Array.from({ length: 20 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${Math.random() * 3 + 3}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 8 + 6}px`
    }));
    setConfetti(list);
    setLinkGenerated(true);
  };

  // Submit star rating review
  const handleRatingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!demoId) {
      alert('Demo reference not resolved.');
      return;
    }
    setSubmittingRating(true);

    try {
      const data = await api.submitRating({
        demoId,
        score: ratingScore,
        reviewText,
        customerName: senderName || 'A Happy Gifter'
      });
      if (data.success) {
        setRatingSubmitted(true);
        // Save flag in instance database so they cannot review again
        await api.updateInstanceConfig(instanceId, { ratingSubmitted: true }, token);
      } else {
        alert(data.message || 'Error saving review.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to rating service.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0813] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-purple-300 font-light text-xs animate-pulse">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7F5] text-slate-800 pt-20 pb-16 relative overflow-hidden font-sans">

      {/* Confetti particles */}
      {linkGenerated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="falling-petal absolute rounded-full"
              style={{
                left: c.left,
                animationDelay: c.delay,
                animationDuration: c.duration,
                backgroundColor: c.color,
                width: c.size,
                height: c.size,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Banner Nav */}
        <div className="bg-white border border-rosePrimary/10 p-6 rounded-[32px] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold text-rosePrimary uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-rosePrimary" />
              <span>{getOccasionThemeName({ categorySlug, themeSlug: selectedTheme })} — {tierName} Plan</span>
            </span>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-wineDeep">
              Surprise Customizer Panel
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-grow sm:flex-grow-0 px-4 py-2 bg-white border border-rosePrimary/25 text-rosePrimary text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-medium mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl border border-green-200 bg-green-50 text-green-600 text-xs font-medium mb-6 flex items-center space-x-2 animate-fade-in-up">
            <Check className="w-5 h-5 shrink-0" />
            <span>Surprise configurations saved successfully. Preview live!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Editor Form Panel */}
          <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">

            {/* Dynamic settings form resolved from central Registry */}
            {(() => {
              const occasionKey = getOccasionKey(categorySlug);
              routePreloader.preloadOccasion(occasionKey);
              const occasion = OccasionRegistry[occasionKey];
              if (!occasion || !occasion.customizer) return null;

              const CustomizerComp = occasion.customizer;

              // Birthday specific props
              const bdayProps = {
                recipientName, setRecipientName,
                senderName, setSenderName,
                message, setMessage,
                photos, setPhotos,
                specialDate, setSpecialDate,
                birthdaySong, setBirthdaySong,
                backgroundMusic, setBackgroundMusic,
                musicUrl, setMusicUrl,
                cakeFeedingImage, setCakeFeedingImage,
                finalMessage, setFinalMessage,
                memories, setMemories,
                newMemTitle, setNewMemTitle,
                newMemImage, setNewMemImage,
                newMemDesc, setNewMemDesc,
                generatingAI, setGeneratingAI,
                uploadingBdaySong, setUploadingBdaySong,
                uploadingCakeFeedingA, setUploadingCakeFeedingA,
                uploadingCakeFeedingB, setUploadingCakeFeedingB,
                uploadingMemoryNode, setUploadingMemoryNode,
                cakeImage, setCakeImage,
                malePhoto, setMalePhoto,
                femalePhoto, setFemalePhoto,
                setMalePhoto, setFemalePhoto,
                tierName,
                securityQuestion, setSecurityQuestion,
                securityAnswer, setSecurityAnswer,
                securityHint, setSecurityHint
              };

              // Valentine specific props
              const valProps = {
                vMemory1Date, setVMemory1Date,
                vMemory1Title, setVMemory1Title,
                vMemory1Desc, setVMemory1Desc,
                vMemory2Date, setVMemory2Date,
                vMemory2Title, setVMemory2Title,
                vMemory2Desc, setVMemory2Desc,
                vMemory3Date, setVMemory3Date,
                vMemory3Title, setVMemory3Title,
                vMemory3Desc, setVMemory3Desc,
                vLove1Title, setVLove1Title,
                vLove1Desc, setVLove1Desc,
                vLove2Title, setVLove2Title,
                vLove2Desc, setVLove2Desc,
                vLove3Title, setVLove3Title,
                vLove3Desc, setVLove3Desc,
                vVoiceIntro, setVVoiceIntro,
                vVoiceUrl, setVVoiceUrl,
                vWhisper1, setVWhisper1,
                vWhisper2, setVWhisper2,
                vWhisper3, setVWhisper3,
                vTimeline, setVTimeline,
                vThingsILove, setVThingsILove,
                vFutureDreams, setVFutureDreams,
                newVTimelineDate, setNewVTimelineDate,
                newVTimelineTitle, setNewVTimelineTitle,
                newVTimelineImage, setNewVTimelineImage,
                newVTimelineDesc, setNewVTimelineDesc,
                generatingVTimelineAI, setGeneratingVTimelineAI,
                uploadingVTimeline, setUploadingVTimeline,
                uploadingVoiceFile, setUploadingVoiceFile,
                valentineGreeting, setValentineGreeting,
                valentineProposalText, setValentineProposalText,
                vRoseTitle, setVRoseTitle,
                vRoseDesc1, setVRoseDesc1,
                vRoseDesc2, setVRoseDesc2,
                vChocTitle, setVChocTitle,
                vChocText, setVChocText,
                vTeddyWait, setVTeddyWait,
                vTeddyGo, setVTeddyGo,
                vTeddyFound, setVTeddyFound,
                vTeddyText, setVTeddyText,
                vPromiseTitle, setVPromiseTitle,
                vPromiseSub, setVPromiseSub,
                vPromisePoints, setVPromisePoints,
                vHugIntro, setVHugIntro,
                vHugTitle, setVHugTitle,
                vHugDesc, setVHugDesc,
                vHugBtn, setVHugBtn,
                unlockAllDays, setUnlockAllDays,
                isRecording, startRecording, stopRecording, recordingSeconds, formatSeconds, uploadRecordedVoice, previewAudioUrl, uploadingVoice,
                getDreamIcon
              };

              // Proposal specific props
              const proposalProps = {
                proposalStarPhoto, setProposalStarPhoto,
                proposalStarName, setProposalStarName,
                proposalStarNickname, setProposalStarNickname,
                proposalStarIntro, setProposalStarIntro,
                proposalHobbies, setProposalHobbies,
                proposalFavFood, setProposalFavFood,
                proposalFavSongs, setProposalFavSongs,
                proposalFavPlace, setProposalFavPlace,
                proposalFavCafe, setProposalFavCafe,
                proposalFavMovie, setProposalFavMovie,
                proposalFavFlower, setProposalFavFlower,
                proposalFirstPhoto, setProposalFirstPhoto,
                proposalFirstDate, setProposalFirstDate,
                proposalFirstLocation, setProposalFirstLocation,
                proposalFirstTitle, setProposalFirstTitle,
                proposalFirstDesc, setProposalFirstDesc,
                proposalTimeline, setProposalTimeline,
                proposalReasons, setProposalReasons,
                proposalLetters, setProposalLetters,
                proposalSkyMemories, setProposalSkyMemories,
                proposalQuestion, setProposalQuestion,
                proposalYesBtn, setProposalYesBtn,
                proposalThinkBtn, setProposalThinkBtn,
                proposalThinkResponse, setProposalThinkResponse,
                proposalCelebrationMusic, setProposalCelebrationMusic,
                proposalCelebrateLetter, setProposalCelebrateLetter,
                proposalDreams, setProposalDreams
              };

              // Girlfriend's Day specific props
              const gfProps = {
                girlfriendName, setGirlfriendName,
                boyfriendName, setBoyfriendName,
                selectedTheme, setSelectedTheme,
                letterText, setLetterText,
                girlfriendPhoto, setGirlfriendPhoto,
                boyfriendPhoto, setBoyfriendPhoto,
                chapters, setChapters,
                questions, setQuestions,
                reasons, setReasons,
                bgMusicUrl, setBgMusicUrl,
                voiceNoteUrl, setVoiceNoteUrl
              };

              const passwordProps = {
                passwordEnabled, setPasswordEnabled,
                password: password || securityAnswer,
                setPassword: (val) => { setPassword(val); setSecurityAnswer(val); },
                passwordHint: passwordHint || securityHint,
                setPasswordHint: (val) => { setPasswordHint(val); setSecurityHint(val); },
                unlockHeading, setUnlockHeading,
                unlockSubtitle, setUnlockSubtitle,
                wrongPasswordMessage, setWrongPasswordMessage,
                successMessage, setSuccessMessage,
                enableNumericKeypad, setEnableNumericKeypad,
                backgroundImage, setBackgroundImage
              };

              const mergedProps = {
                instanceId,
                ...bdayProps,
                ...valProps,
                ...proposalProps,
                ...gfProps,
                ...passwordProps,
                recipientName, setRecipientName,
                senderName, setSenderName,
                message, setMessage,
                birthdaySong, setBirthdaySong,
                backgroundMusic, setBackgroundMusic,
                musicUrl, setMusicUrl,
                tierName,
                handleUpgradeToPremium,
                categoryTiers,
                api
              };

              return (
                <div id="step-customizer" className="space-y-6">
                  <React.Suspense fallback={<div className="text-xs text-slate-400 py-6 text-center italic">Loading customizer form fields...</div>}>
                    <CustomizerComp {...mergedProps} />
                  </React.Suspense>
                  <PasswordCustomizerTab {...mergedProps} />
                </div>
              );
            })()}

            <div id="step-save" className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving changes...' : 'Save Configuration'}</span>
              </button>
            </div>

          </form>

          {/* Quick Actions / Link Widget Sidebar */}
          <div id="step-actions" className="space-y-6">

            {/* Status & Preview Card */}
            <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 shadow-sm text-slate-800 space-y-4">
              <h3 className="font-heading font-bold text-sm text-wineDeep uppercase tracking-wider border-b border-rosePrimary/10 pb-2">
                Launch Surprise
              </h3>

              <div className="space-y-3">
                <Link
                  to={`/s/${instanceId}`}
                  target="_blank"
                  className="w-full py-3 bg-white hover:bg-slate-50 text-rosePrimary border border-rosePrimary/20 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 focus:outline-none"
                >
                  <Eye className="w-4 h-4 text-rosePrimary" />
                  <span>Preview Live Surprise</span>
                </Link>

                {tierName.toLowerCase() === 'premium' ? (
                  <Link
                    to={`/control/${instanceId}`}
                    target="_blank"
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-transform hover:scale-[1.02] flex items-center justify-center space-x-1.5 focus:outline-none"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-350 animate-pulse" />
                    <span>Open Live Control Room ⚡</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpgradeToPremium}
                    className="w-full py-3 bg-slate-50 hover:bg-rose-50/10 text-slate-500 hover:text-rosePrimary border border-dashed border-slate-300 hover:border-rosePrimary text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer group"
                  >
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-rosePrimary" />
                    <span>Upgrade to Unlock Live Control Room ⚡</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleGenerateLinkAndQR}
                  className="w-full py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Generate Surprise Link & QR</span>
                </button>
              </div>
            </div>

            {/* Link & QR Code Reveal Panel */}
            {linkGenerated && (
              <div className="space-y-6">
                <DemoLinkGenerator
                  instanceId={instanceId}
                  categoryName={categoryName}
                  tierName={tierName}
                  selectedClosingMsg={selectedClosingMsg}
                  handleDownloadPDF={handleDownloadPDF}
                  downloadingPDF={downloadingPDF}
                />

                {/* Star Rating Submission Card */}
                {!ratingSubmitted && demoId ? (
                  <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 shadow-sm text-left space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-wineDeep uppercase tracking-wider">Rate this design theme:</h4>
                      <p className="text-[11px] text-slate-500 font-light leading-relaxed">Rate your experience to help other gifters.</p>
                    </div>

                    <form onSubmit={handleRatingSubmit} className="space-y-3">
                      {/* Interactive Stars Selector */}
                      <div className="flex space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingScore(star)}
                            className="p-1 hover:scale-115 transition-transform cursor-pointer text-amber-450"
                          >
                            <Star className={`w-6 h-6 ${star <= ratingScore ? 'fill-amber-400' : 'text-slate-250'}`} />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows="2"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Mithi yaadein share karein (optional)..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 bg-white text-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                      />

                      <button
                        type="submit"
                        disabled={submittingRating}
                        className="w-full py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : ratingSubmitted ? (
                  <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-4 text-center text-xs font-medium text-rosePrimary flex items-center justify-center space-x-1.5 shadow-sm">
                    <Heart className="w-4 h-4 fill-rosePrimary text-rosePrimary animate-pulse" />
                    <span>Review ke liye bohot shukriya!</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Editing Instructions */}
            <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-200 shadow-sm text-xs space-y-3 font-light text-slate-500">
              <h4 className="font-bold text-rosePrimary uppercase tracking-wider text-[10px]">How to edit:</h4>
              <p>1. Type in names and your customized surprise message.</p>
              <p>2. Set countdown special date (e.g. anniversary or bday date).</p>
              <p>3. Upload custom photos to fill the Polaroid gallery slideshow.</p>
              <p>4. Save configurations first, then click **Generate Surprise Link & QR**.</p>
              <p>5. Copy your custom link or save the QR Code to send to them!</p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(`restart-walkthrough-${instanceId}`));
                }}
                className="w-full mt-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restart Tutorial Guide</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <CustomizerWalkthrough
        instanceId={instanceId}
        steps={[
          { target: '#step-names', title: 'Sender & Recipient Names', content: 'Apne aur apne partner ka naam fill karein. Ye surprise page par dynamic text titles build karne ke liye use hoga.' },
          { target: '#step-letter', title: 'Emotional Letter / Message', content: 'Apne dil ki baat message box me likhein. Agar confusion me hain, toh customized AI Writer ko context dekar unique notes write kar sakte hain!' },
          { target: '#step-music', title: 'Countdown & Background Score', content: 'Occasion date select karein (jispar dynamic countdown timer chalega) aur background audio score set karein.' },
          { target: '#step-photos', title: 'Polaroid Memory Album', content: 'Memories section me photos upload karein. Aap polaroid frames ke niche custom caption aur details add kar sakte hain.' },
          { target: '#step-customizer', title: 'Occasion Special Controls', content: `Cake feeding, guest notes, timeline memories, things i love, dreams, voice notes, quotes, templates ya remote rooms config karein!` },
          { target: '#step-save', title: 'Save Configuration', content: 'Apna customized content database me save karne ke liye is save button par single click karein.' },
          { target: '#step-actions', title: 'Launch Surprise & Download QR', content: 'Surprise website preview karein, dynamic QR card generator se print-ready PDF card download karein aur launch controls manage karein!' }
        ]}
      />

      {showSaveValidationPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] border border-rosePrimary/10 p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-lg text-wineDeep">Empty Sections Detected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have left some sections empty. These sections will not appear in the final surprise.
              </p>
              <p className="text-[10px] text-slate-400">
                (Empty favorites, first photo, timeline, moments, reasons, or letters will be dynamically hidden)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSaveValidationPopup(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowSaveValidationPopup(false);
                  await handleSave(null, true);
                }}
                className="w-1/2 py-2.5 bg-rosePrimary hover:bg-rose-600 text-white text-xs font-bold uppercase rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
