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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Verify auth on mount/instanceId change
  useEffect(() => {
    const savedInstanceId = localStorage.getItem('instanceId');
    if (token && savedInstanceId === instanceId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [instanceId, token]);

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setAuthError('');
    try {
      const data = await api.customerLogin(instanceId, passcode);
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('instanceId', data.instance.instanceId);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Invalid passcode.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection error verifying passcode.');
    } finally {
      setVerifying(false);
    }
  };

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
  
  // Extra metadata
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const isVirtualDate = categorySlug.includes('virtual-date') || 
                        categorySlug.includes('valentine');
  const [tierName, setTierName] = useState('');
  const [status, setStatus] = useState('Paid');
  const [demoId, setDemoId] = useState(searchParams.get('demoId') || '');
  const [clientReplyText, setClientReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

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
      const data = await api.uploadFile(file);
      if (data.success) {
        setVVoiceUrl(data.url);
        alert('Voice note uploaded successfully!');
      } else {
        alert('Failed to upload voice note.');
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
        const currentToken = localStorage.getItem('customerToken');
        const data = await api.getInstanceDetails(instanceId, currentToken);
        if (data.success) {
          const config = data.instance.config || {};
          setRecipientName(config.recipientName || '');
          setSenderName(config.senderName || '');
          if (config.specialDate) {
            setSpecialDate(config.specialDate.substring(0, 10)); // YYYY-MM-DD
          }
          setMessage(config.message || '');
          setMusicUrl(config.musicUrl || '');
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
          
          // Load Birthday configurations
          setBirthdaySong(config.birthdaySongUrl || config.birthdaySong || '');
          setCakeImage(config.cakeImage || '');
          setCakeFeedingImage(config.cakeFeedingImage || '');
          setFinalMessage(config.finalMessage || '');
          setBackgroundMusic(config.backgroundMusic || '');
          setMemories(config.memories || []);
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

          setRecipientResponse(data.instance.recipientResponse || '');
          setClientReplyText(data.instance.adminResponse || '');
          setFeedbackLiked(data.instance.feedbackLiked);

          setCategoryName(data.instance.category || 'Surprise');
          setCategorySlug(data.instance.categorySlug || '');
          setTierName(data.instance.tier || 'Basic');
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
        musicUrl,
        themeColor,
        photos // saves objects array containing URL + captions
      };

      // 2. Add category-specific fields dynamically
      const occasionKey = getOccasionKey(categorySlug);
      if (occasionKey === 'birthday') {
        Object.assign(categoryConfig, {
          birthdaySong,
          cakeImage,
          cakeFeedingImage,
          finalMessage,
          backgroundMusic,
          memories,
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
          proposalCelebrateLetter
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
      await generateSurprisePDF({
        instanceId,
        closingMessage: selectedClosingMsg || 'Some Moments are too special to be explained they simply need to be experienced..',
        recipientName,
        senderName,
        qrColor,
        qrBase64: customQrBase64
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
    setPhotos([...photos, { url: newPhotoUrl, title: '', caption: '', description: '' }]);
    setNewPhotoUrl('');
  };

  const handleLocalPhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingAlbum(true);
    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
        <LivingBackground />
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl animate-pulse" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner shadow-rose-500/10">
            <Heart className="w-8 h-8 text-rose-455 fill-rose-500/20 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-extrabold text-3xl text-white">Surprise Customizer</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed font-sans font-light">
              Enter the passcode to manage and customize surprise site:<br />
              <span className="font-mono text-rose-400 font-bold bg-white/5 px-2.5 py-1 rounded-lg mt-2 inline-block border border-white/5">{instanceId}</span>
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-center text-white placeholder-rose-200/20 transition-all hover:bg-white/10"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-500/5 py-2.5 px-4 rounded-xl border border-rose-500/10">
                <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-550 hover:to-pink-550 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : '🔑 Enter Customizer'}
            </button>
          </form>

          <div className="pt-2">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-rose-300/40 hover:text-rose-300/80 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-[10px] font-bold text-rosePrimary uppercase tracking-widest">{categoryName} — {tierName}</span>
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
            
            {/* Box 1: Text Fields */}
            <div id="step-names" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
                <Settings className="w-4 h-4 text-rosePrimary" />
                <span>Text Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Recipient Name (Unka Naam)</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priye"
                    className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Sender Name (Aapka Naam)</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Rohan"
                    className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
              </div>

              {/* AI Letter Generator Section */}
              <div id="step-letter" className="bg-rose-50/50 border border-rosePrimary/15 rounded-2xl p-5 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-rosePrimary uppercase tracking-widest flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-rosePrimary animate-pulse" />
                    <span>AI Love Letter Writer</span>
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={letterPrompt}
                    onChange={(e) => setLetterPrompt(e.target.value)}
                    placeholder="e.g. Write about our trip to Delhi, tea dates, and how much they mean to me"
                    className="flex-grow px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAILetter}
                    disabled={generatingLetter}
                    className="px-5 py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {generatingLetter ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                <span className="text-xs text-slate-400 block font-light leading-relaxed">
                  Let AI write a beautiful, personalized, handwritten letter for your surprise.
                </span>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Surprise message</label>
                <textarea
                  rows="5"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Apne dil ki baat yahan likhein. Aap unke liye kya feel karte hain..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>
            </div>

            {/* Box 2: Audio & Timeline config */}
            <div id="step-music" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
                <Music className="w-4 h-4 text-rosePrimary" />
                <span>Theme Settings</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-600 tracking-wider block mb-1.5">Special Date (Countdown)</label>
                  <input
                    type="date"
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-600 tracking-wider block mb-1.5">Background Song (MP3 / YouTube Link)</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={musicUrl}
                      onChange={(e) => setMusicUrl(e.target.value)}
                      placeholder="Paste MP3 URL or YouTube video link..."
                      className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                    />
                    <ReusableUploader
                      accept="audio/*"
                      label="Upload MP3"
                      useAdminApi={true}
                      onUploadSuccess={(url) => setMusicUrl(url)}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-light mt-1.5 block leading-relaxed">Paste direct MP3 URL, YouTube link (e.g., https://youtube.com/watch?v=...) or upload a local audio file.</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1">Theme Accent Color</label>
                <div className="flex items-center space-x-3 mt-1.5">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-lg p-0.5 cursor-pointer bg-white"
                  />
                  <span className="text-xs text-slate-650 font-mono">{themeColor}</span>
                </div>
              </div>
            </div>

            {/* Box 3: Photos Manager */}
            <div id="step-photos" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
                <ImageIcon className="w-4 h-4 text-rosePrimary" />
                <span>Photos Album ({photos.length} uploaded)</span>
              </h3>

              {/* Paste Photo URL or Upload Local Image */}
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Paste Image URL here (e.g. Unsplash link)"
                    className="flex-grow px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-rosePrimary/5 pt-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Or Upload Local Image(s):</label>
                  </div>
                  <ReusableUploader
                    accept="image/*"
                    multiple={true}
                    useAdminApi={true}
                    label="Upload Images"
                    onUploadSuccess={(url) => setPhotos(prev => [...prev, { url, title: '', caption: '', description: '' }])}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Preset Gallery Showcase */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Or select from romantic presets:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetPhotos.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(url)}
                      className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:opacity-85 transition-opacity cursor-pointer"
                    >
                      <img src={url} alt="Preset option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded List */}
              {photos.length > 0 ? (
                <div className="space-y-4 mt-6 pt-4 border-t border-rosePrimary/5">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl relative shadow-sm">
                      {/* Image Preview & Delete Button */}
                      <div className="w-full md:w-32 h-32 shrink-0 relative rounded-xl overflow-hidden border bg-slate-200">
                        <img src={photo.url} alt={`Memory ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Caption Inputs */}
                      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Short Title</label>
                          <input
                            type="text"
                            value={photo.title || ''}
                            onChange={(e) => {
                              const updated = [...photos];
                              updated[index] = { ...photo, title: e.target.value };
                              setPhotos(updated);
                            }}
                            placeholder="e.g. Eiffel Tower"
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Caption / Date</label>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => {
                              const updated = [...photos];
                              updated[index] = { ...photo, caption: e.target.value };
                              setPhotos(updated);
                            }}
                            placeholder="e.g. Feb 2024"
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Memory Description</label>
                          <input
                            type="text"
                            value={photo.description || ''}
                            onChange={(e) => {
                              const updated = [...photos];
                              updated[index] = { ...photo, description: e.target.value };
                              setPhotos(updated);
                            }}
                            placeholder="e.g. We ate crepes in the rain..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Action buttons (Reordering & Delete Caption) */}
                      <div className="flex md:flex-col justify-end gap-2 md:justify-center items-center shrink-0 border-t md:border-t-0 md:border-l border-slate-200/85 pt-2 md:pt-0 md:pl-3">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            const updated = [...photos];
                            const temp = updated[index];
                            updated[index] = updated[index - 1];
                            updated[index - 1] = temp;
                            setPhotos(updated);
                          }}
                          className="p-1.5 bg-white border hover:bg-slate-50 disabled:opacity-40 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === photos.length - 1}
                          onClick={() => {
                            if (index === photos.length - 1) return;
                            const updated = [...photos];
                            const temp = updated[index];
                            updated[index] = updated[index + 1];
                            updated[index + 1] = temp;
                            setPhotos(updated);
                          }}
                          className="p-1.5 bg-white border hover:bg-slate-50 disabled:opacity-40 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Caption Button */}
                        {(photo.title || photo.caption || photo.description) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...photos];
                              updated[index] = { ...photo, title: '', caption: '', description: '' };
                              setPhotos(updated);
                            }}
                            className="p-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer text-[9px] font-bold uppercase tracking-wider px-2"
                            title="Clear caption fields"
                          >
                            Clear Text
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 font-light italic">
                  No memories added yet. Add URLs or click presets above.
                </p>
              )}
            </div>

            {/* Dynamic settings form resolved from central Registry */}
            {(() => {
              const occasionKey = getOccasionKey(categorySlug);
              const occasion = OccasionRegistry[occasionKey];
              if (!occasion || !occasion.customizer) return null;

              const CustomizerComp = occasion.customizer;

              // Birthday specific props
              const bdayProps = {
                birthdaySong, setBirthdaySong,
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
                setMalePhoto, setFemalePhoto
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
                proposalCelebrateLetter, setProposalCelebrateLetter
              };

              const mergedProps = {
                ...bdayProps,
                ...valProps,
                ...proposalProps,
                recipientName,
                api
              };

              return (
                <div id="step-customizer" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
                  <React.Suspense fallback={<div className="text-xs text-slate-400 py-6 text-center italic">Loading customizer form fields...</div>}>
                    <CustomizerComp {...mergedProps} />
                  </React.Suspense>
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

                {tierName.toLowerCase() === 'premium' && (
                  <Link
                    to={`/control/${instanceId}`}
                    target="_blank"
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-transform hover:scale-[1.02] flex items-center justify-center space-x-1.5 focus:outline-none"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-350 animate-pulse" />
                    <span>Open Live Control Room ⚡</span>
                  </Link>
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
