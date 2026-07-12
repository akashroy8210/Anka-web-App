import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Save, Eye, Copy, LogOut, Check, Image as ImageIcon, Music, Calendar, Settings, AlertCircle, Plus, Trash2, QrCode, Star, Sparkles, Mail, Lock, Mic } from 'lucide-react';
import LivingBackground from '../components/animations/LivingBackground';
import ReusableUploader from '../components/shared/ReusableUploader';
import { thingsILove as defaultThingsILove, futureDreams as defaultFutureDreams } from '../apps/virtual-date/data/placeholderData';

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
  const [guestNames, setGuestNames] = useState('');
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
  const isVirtualDate = categorySlug === 'virtual-date' || 
                        categorySlug.includes('virtual-date') || 
                        categorySlug.includes('valentines') ||
                        categorySlug === 'valentine' ||
                        categorySlug.includes('valentine-week');
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
    "Bhej do yeh pal, aur dekho unki muskaan...",
    "Pyaar ka yeh tohfa unke dil ko chhu lega...",
    "Aapka surprise taiyar hai, khushiyan baantne ke liye!"
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
          setPhotos(config.photos || []);
          
          // Load Birthday configurations
          setGuestNames(config.guestNames ? config.guestNames.join(', ') : '');
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const payload = {
        config: {
          recipientName,
          senderName,
          specialDate: specialDate ? new Date(specialDate) : null,
          message,
          musicUrl,
          themeColor,
           photos,
          guestNames: guestNames.split(',').map(n => n.trim()).filter(Boolean),
          birthdaySong,
          cakeImage,
          cakeFeedingImage,
          finalMessage,
          backgroundMusic,
          memories,
          malePhotoUrl: malePhoto,
          femalePhotoUrl: femalePhoto,
          // Valentine's Day specific settings
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
          }))
        },
        status: status === 'Paid' ? 'Content Added' : status
      };

      const data = await api.updateInstanceConfig(instanceId, payload, token);
      if (data.success) {
        setSaveSuccess(true);
        setStatus(data.instance.status);
        setTimeout(() => setSaveSuccess(false), 3000);
        return true;
      } else {
        setErrorMsg(data.message || 'Error saving changes.');
        return false;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error saving changes.');
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
  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const loadJsPDF = () => {
        return new Promise((resolve, reject) => {
          if (window.jspdf) {
            resolve(window.jspdf);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = () => resolve(window.jspdf || window.umd?.jspdf);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      const jspdfModule = await loadJsPDF();
      const jsPDF = jspdfModule.jsPDF;

      // Encode only the live surprise website URL inside the QR code
      const liveLinkTarget = `${window.location.origin}/s/${instanceId}`;
      const colorfulQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=be123c&data=${encodeURIComponent(liveLinkTarget)}`;
      
      const getBase64 = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const qrBase64 = await getBase64(colorfulQrUrl);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dark theme background matching our premium website theme
      doc.setFillColor(8, 5, 15);
      doc.rect(0, 0, 210, 297, 'F');

      // Rose/gold double border
      doc.setDrawColor(225, 29, 72); // Rose
      doc.setLineWidth(1.5);
      doc.rect(10, 10, 190, 277);
      
      doc.setDrawColor(244, 63, 94); // Light rose
      doc.setLineWidth(0.5);
      doc.rect(12, 12, 186, 273);

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text('A Beautiful Surprise Awaits...', 105, 45, { align: 'center' });

      // Subheading / Emotional Message
      doc.setTextColor(244, 63, 94);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(14);
      const emotionalMsg = `"${selectedClosingMsg || 'Bhej do yeh pal, aur dekho unki muskaan...'}"`;
      doc.text(emotionalMsg, 105, 60, { align: 'center', maxWidth: 160 });

      // Heart separator
      doc.setTextColor(225, 29, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(18);
      doc.text('💖', 105, 75, { align: 'center' });

      // QR Frame card (white backdrop)
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(57, 87, 96, 96, 4, 4, 'F');

      // Big Colorful QR Code
      doc.addImage(qrBase64, 'PNG', 60, 90, 90, 90);

      // Instructions
      doc.setTextColor(156, 163, 175);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Scan the QR code above with your phone camera to begin', 105, 198, { align: 'center' });

      // Emotional Footer Message
      doc.setTextColor(244, 63, 94);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(13);
      doc.text('Every moment with you is a gift, and I wanted to make this', 105, 222, { align: 'center' });
      doc.text('special page just to show you how much I care...', 105, 228, { align: 'center' });

      // Created for names
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(`Made with Love for: ${recipientName || 'You'} 💖`, 105, 250, { align: 'center' });
      doc.text(`From: ${senderName || 'Someone Special'} ✨`, 105, 258, { align: 'center' });

      doc.save(`Surprise_QR_Card_${instanceId}.pdf`);
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
    setPhotos([...photos, newPhotoUrl]);
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
        setPhotos(prev => [...prev, ...uploadedUrls]);
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

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddPresetPhoto = (url) => {
    if (photos.includes(url)) return;
    setPhotos([...photos, url]);
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
    e.preventDefault();
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
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-romantic text-4xl text-white">Surprise Customizer</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed">
              Enter the passcode to manage and customize surprise site:<br />
              <span className="font-mono text-rose-300 font-bold bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">{instanceId}</span>
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 text-center text-white placeholder-rose-200/20"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-500/5 py-2.5 px-4 rounded-xl border border-rose-500/10">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : '🔑 Enter Customizer'}
            </button>
          </form>

          <div className="pt-2">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-rose-300/60 hover:text-rose-300 transition-colors"
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

  const liveLinkTarget = `${window.location.origin}/s/${instanceId}`;
  const shortLinkTarget = `anka.in/s/${instanceId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=881337&data=${encodeURIComponent(liveLinkTarget)}`;

  return (
    <div className="min-h-screen bg-[#FFF7F5] text-slate-800 pt-20 pb-16 relative overflow-hidden">
      
      {/* Local Confetti particles */}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
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
              <div className="bg-rose-50/50 border border-rosePrimary/15 rounded-2xl p-5 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-rosePrimary uppercase tracking-widest flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-rosePrimary animate-pulse" />
                    <span>AI Love Letter Writer</span>
                  </span>
                  {generatingLetter && <span className="text-xs text-rosePrimary animate-pulse">Drafting emotional message...</span>}
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
                    className="px-5 py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    Generate
                  </button>
                </div>
                <span className="text-xs text-slate-400 block font-light">
                  Let Gemini write a beautiful, personalized, handwritten letter for your surprise.
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
            <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
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
                  <span className="text-xs text-slate-400 font-light mt-1.5 block">Paste direct MP3 URL, YouTube link (e.g., https://youtube.com/watch?v=...) or upload a local audio file.</span>
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
            <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
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
                    onUploadSuccess={(url) => setPhotos(prev => [...prev, url])}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Preset Gallery Showcase */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Or select from romantic presets:</label>
                <div className="grid grid-cols-6 gap-2">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-rosePrimary/5">
                  {photos.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border bg-slate-150 shadow-inner">
                      <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/85 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 font-light italic">
                  No memories added yet. Add URLs or click presets above.
                </p>
              )}
            </div>

            {/* Box 4: Birthday Specific Settings (Only for Birthday Surprise category) */}
            {categorySlug === 'birthday' && (
              <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
                  <Sparkles className="w-4 h-4 text-rosePrimary animate-spin" />
                  <span>Birthday Journey Settings 🎂</span>
                </h3>

                {/* Guest Names & Birthday Song */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Guest Names (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={guestNames}
                      onChange={(e) => setGuestNames(e.target.value)}
                      placeholder="e.g. Rohan, Ananya, Priyesh, Muskan"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-light mt-1 block">These names will pop up as cheers when recipient blows the candles.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1">
                      Birthday Song (MP3 / Audio URL)
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={birthdaySong}
                        onChange={(e) => setBirthdaySong(e.target.value)}
                        placeholder="Paste MP3 URL or upload local file..."
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                      />
                      <ReusableUploader
                        accept="audio/*"
                        label="Upload MP3"
                        useAdminApi={true}
                        onUploadSuccess={(url) => setBirthdaySong(url)}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-light mt-1 block">Custom audio file that plays during candle celebration (e.g. instrumentals or songs).</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl space-y-4 text-left">
                  <span className="text-[10px] font-black text-rosePrimary uppercase tracking-widest block mb-1">🎂 Cake Feeding Photo Selection</span>
                    
                  <div className="space-y-3.5">
                    {/* Option 1: Direct Upload */}
                    <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-4 h-4 bg-rose-500/10 text-rosePrimary text-[9px] font-black rounded-full flex items-center justify-center">1</span>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Option A: Upload Combined Photo</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light leading-normal">
                        Directly upload a real photo of you two feeding cake to each other.
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <input
                          type="url"
                          value={cakeFeedingImage}
                          onChange={(e) => setCakeFeedingImage(e.target.value)}
                          placeholder="Paste cake feeding image URL..."
                          className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                        />
                        <ReusableUploader
                          accept="image/*"
                          label="Upload File"
                          useAdminApi={true}
                          onUploadSuccess={(url) => setCakeFeedingImage(url)}
                        />
                      </div>
                      </div>

                      {/* Option 2: External AI Generator Copy-Prompt */}
                      <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-4 h-4 bg-rose-500/10 text-rosePrimary text-[9px] font-black rounded-full flex items-center justify-center">2</span>
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Option B: Generate with AI & Upload</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-light leading-normal">
                          No real cake-feeding photo? Use your uploaded face references (Male & Female photos above) in an AI tool (like Midjourney, Fooocus, or Remaker) with our custom face-matching prompt. Copy the prompt below, generate it for free, and upload the result:
                        </p>

                        {/* Copy prompt block */}
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                          <div className="text-[9px] font-mono text-slate-650 leading-relaxed pr-8 select-all">
                            Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const promptText = `Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.`;
                              navigator.clipboard.writeText(promptText);
                              alert('AI Image generation prompt copied to clipboard!');
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-500 hover:text-rosePrimary cursor-pointer"
                            title="Copy Prompt"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Upload for Option B (reuses cakeFeedingImage) */}
                        <div className="flex space-x-2">
                          <ReusableUploader
                            accept="image/*"
                            label="Upload AI Generated Photo"
                            useAdminApi={true}
                            onUploadSuccess={(url) => setCakeFeedingImage(url)}
                          />
                        </div>
                      </div>
                    </div>

                    {cakeFeedingImage && (
                      <div className="space-y-1.5 pt-2 border-t border-rosePrimary/10">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Active Feeding Photo Preview</span>
                        <div className="w-48 aspect-[4/3] rounded-lg overflow-hidden border border-rosePrimary/20 bg-slate-100 relative group">
                          <img src={cakeFeedingImage} alt="Cake Feeding preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCakeFeedingImage('')}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                {/* Final Love Letter message */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Final Love Letter Message
                  </label>
                  <textarea
                    rows                    value={finalMessage}
                    onChange={(e) => setFinalMessage(e.target.value)}
                    placeholder="Type your final birthday promise/slogan here..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>

                {/* Memory Manager Section (up to 10 memories) */}
                <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading font-bold text-sm text-wineDeep">Memory Tree Nodes ({memories.length} / 10)</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Max 10 Memories</span>
                  </div>

                  {/* Add memory form (only if < 10) */}
                  {memories.length < 10 && (
                    <div className="bg-rose-50/20 border border-rosePrimary/10 rounded-2xl p-4 space-y-3.5 text-left">
                      <span className="text-[10px] font-black text-rosePrimary uppercase tracking-widest block">Add New Memory Branch</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Memory Title</label>
                          <input
                            type="text"
                            value={newMemTitle}
                            onChange={(e) => setNewMemTitle(e.target.value)}
                            placeholder="e.g. Our First Meeting"
                            className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Memory Photo (Upload/URL)</label>
                          <div className="flex flex-col gap-2">
                            <input
                              type="url"
                              value={newMemImage}
                              onChange={(e) => setNewMemImage(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                            />
                            <ReusableUploader
                              accept="image/*"
                              label="Upload"
                              useAdminApi={true}
                              onUploadSuccess={(url) => setNewMemImage(url)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* AI generated description block */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-slate-500 uppercase block">Memory Description</label>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!newMemTitle) {
                                alert('Please enter a memory title first to generate an emotional AI description!');
                                return;
                              }
                              setGeneratingAI(true);
                              try {
                                const data = await api.generateAIMemoryDescription(newMemTitle, recipientName);
                                if (data.success) {
                                  setNewMemDesc(data.description);
                                } else {
                                  alert(data.message || 'AI generation failed.');
                                }
                              } catch (err) {
                                alert('Error generating AI description.');
                              } finally {
                                setGeneratingAI(false);
                              }
                            }}
                            disabled={generatingAI}
                            className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 text-[9px] font-bold uppercase rounded-lg border border-yellow-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3 h-3 text-yellow-600 animate-spin" />
                            <span>{generatingAI ? 'Generating...' : '✨ AI Generate Description'}</span>
                          </button>
                        </div>
                        <textarea
                          rows="3"
                          value={newMemDesc}
                          onChange={(e) => setNewMemDesc(e.target.value)}
                          placeholder="Write a custom description or click the AI button above to generate a beautiful handwritten emotional prompt..."
                          className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newMemTitle || !newMemImage || !newMemDesc) {
                            alert('Please complete all Memory fields (Title, Image, and Description) before adding!');
                            return;
                          }
                          setMemories([...memories, { imageUrl: newMemImage, title: newMemTitle, description: newMemDesc }]);
                          setNewMemTitle('');
                          setNewMemImage('');
                          setNewMemDesc('');
                        }}
                        className="w-full py-2 bg-rosePrimary hover:bg-wineDeep text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Memory Node to Tree</span>
                      </button>
                    </div>
                  )}

                  {/* Memories Grid list */}
                  {memories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {memories.map((mem, idx) => (
                        <div key={idx} className="bg-white border border-rosePrimary/10 rounded-2xl p-3 shadow-sm flex items-center space-x-3.5 relative group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-rosePrimary/10 relative">
                            <img src={mem.imageUrl} alt="Memory Thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 z-10 bg-rosePrimary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                              #{idx + 1}
                            </div>
                          </div>
                          <div className="text-left flex-grow overflow-hidden pr-6">
                            <h5 className="font-heading font-extrabold text-sm text-wineDeep truncate">{mem.title}</h5>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{mem.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMemories(memories.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer border border-rosePrimary/10"
                            title="Delete Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400 italic font-light">No memory branches added to the tree. Add memories above!</p>
                  )}
                </div>
              </div>
            )}

            {/* Box 5: Virtual Date Specific Settings (Only for Virtual Date Surprise category) */}
            {isVirtualDate && (
              <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="font-heading font-extrabold text-lg md:text-xl text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
                  <Heart className="w-5 h-5 text-rosePrimary animate-pulse" />
                  <span>Virtual Date Journey Specific Settings ❤️</span>
                </h3>

                {/* Starlit Whispers Section */}
                <div className="space-y-4">
                  <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">💫 Custom Starlit Whispers</span>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
                    These romantic whispers will float across the night sky as your partner scrolls through your surprise journey.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #1</label>
                      <input
                        type="text"
                        value={vWhisper1}
                        onChange={(e) => setVWhisper1(e.target.value)}
                        placeholder="e.g. I love you to the moon and back ❤️"
                        className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #2</label>
                      <input
                        type="text"
                        value={vWhisper2}
                        onChange={(e) => setVWhisper2(e.target.value)}
                        placeholder="e.g. You make every single day brighter ✨"
                        className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #3</label>
                      <input
                        type="text"
                        value={vWhisper3}
                        onChange={(e) => setVWhisper3(e.target.value)}
                        placeholder="e.g. Always here for you, bubu 💫"
                        className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Memories Section */}
                <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block">📅 Relationship Timeline ({vTimeline.length} / 10)</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Max 10 memories</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
                    Build a dynamic relationship story timeline. Add memories with titles, descriptions, dates, and photos!
                  </p>

                  {/* Add memory form (only if < 10) */}
                  {vTimeline.length < 10 && (
                    <div className="bg-rose-50/20 border border-rosePrimary/10 rounded-2xl p-5 space-y-4 text-left">
                      <span className="text-xs font-black text-rosePrimary uppercase tracking-widest block">Add New Timeline Memory</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Date / Label</label>
                          <input
                            type="text"
                            value={newVTimelineDate}
                            onChange={(e) => setNewVTimelineDate(e.target.value)}
                            placeholder="e.g. July 12 or Our First Meet"
                            className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Memory Title</label>
                          <input
                            type="text"
                            value={newVTimelineTitle}
                            onChange={(e) => setNewVTimelineTitle(e.target.value)}
                            placeholder="e.g. Cozy Cafe Date"
                            className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Memory Photo (Upload or URL)</label>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {/* Option 1: File Uploader */}
                          <div>
                            <ReusableUploader
                              accept="image/*"
                              label="Upload Photo File"
                              useAdminApi={true}
                              onUploadSuccess={(url) => setNewVTimelineImage(url)}
                            />
                          </div>

                          {/* Option 2: Paste URL */}
                          <input
                            type="url"
                            value={newVTimelineImage}
                            onChange={(e) => setNewVTimelineImage(e.target.value)}
                            placeholder="Or paste direct image URL link here..."
                            className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-500 uppercase block">Memory Description</label>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!newVTimelineTitle) {
                                alert('Please enter a memory title first to generate an emotional description!');
                                    return;
                              }
                              setGeneratingVTimelineAI(true);
                              try {
                                const data = await api.generateAIMemoryDescription(newVTimelineTitle, recipientName);
                                if (data.success) {
                                  setNewVTimelineDesc(data.description);
                                } else {
                                  alert(data.message || 'AI generation failed.');
                                }
                              } catch (err) {
                                alert('Error generating AI description.');
                              } finally {
                                setGeneratingVTimelineAI(false);
                              }
                            }}
                            disabled={generatingVTimelineAI}
                            className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 text-xs font-bold uppercase rounded-lg border border-yellow-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-spin-slow" />
                            <span>{generatingVTimelineAI ? 'Generating...' : '✨ AI Generate Description'}</span>
                          </button>
                        </div>
                        <textarea
                          rows="3"
                          value={newVTimelineDesc}
                          onChange={(e) => setNewVTimelineDesc(e.target.value)}
                          placeholder="Write custom description or click the AI button above..."
                          className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newVTimelineTitle || !newVTimelineImage || !newVTimelineDesc || !newVTimelineDate) {
                            alert('Please complete all Memory fields (Date, Title, Photo, and Description) before adding!');
                            return;
                          }
                          setVTimeline([...vTimeline, { 
                            date: newVTimelineDate, 
                            title: newVTimelineTitle, 
                            imageUrl: newVTimelineImage, 
                            description: newVTimelineDesc 
                          }]);
                          setNewVTimelineDate('');
                          setNewVTimelineTitle('');
                          setNewVTimelineImage('');
                          setNewVTimelineDesc('');
                        }}
                        className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Memory Node to Timeline</span>
                      </button>
                    </div>
                  )}

                  {/* Memories Grid list */}
                  {vTimeline.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {vTimeline.map((mem, idx) => (
                        <div key={idx} className="bg-white border border-rosePrimary/10 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 relative group text-left">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-rosePrimary/10 relative">
                            <img src={mem.imageUrl} alt="Memory Thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 z-10 bg-rosePrimary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                              #{idx + 1}
                            </div>
                          </div>
                          <div className="flex-grow overflow-hidden pr-8">
                            <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">{mem.date}</span>
                            <h5 className="font-heading font-extrabold text-sm text-wineDeep truncate mt-0.5">{mem.title}</h5>
                            <p className="text-xs text-slate-500 truncate mt-1">{mem.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setVTimeline(vTimeline.filter((_, i) => i !== idx))}
                            className="absolute top-2.5 right-2.5 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer border border-rosePrimary/10"
                            title="Delete Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-sm text-slate-400 italic font-light bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      No relationship timeline memories added yet. Add memories using the form above!
                    </p>
                  )}
                </div>

                {/* Things I Love Section */}
                <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
                  <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">💖 Things I Love About You (12 Reasons)</span>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
                    Customize the 12 reasons why your partner is so special to you.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vThingsILove.map((reason, idx) => (
                      <div key={reason.id || idx} className="p-4 bg-white border border-rosePrimary/10 rounded-2xl space-y-3 shadow-sm text-left">
                        <div className="flex items-center justify-between border-b border-rose-500/5 pb-2">
                          <span className="text-[11px] font-bold text-wineDeep uppercase tracking-wider">Reason #{idx + 1}</span>
                          <span className="text-[10px] bg-rose-50 text-rosePrimary px-2 py-0.5 rounded-full font-bold">Item {reason.id}</span>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Reason Title</label>
                          <input
                            type="text"
                            value={reason.title || ''}
                            onChange={(e) => {
                              const updated = [...vThingsILove];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setVThingsILove(updated);
                            }}
                            placeholder="e.g. Your beautiful smile"
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Reason Description</label>
                          <textarea
                            rows="2"
                            value={reason.desc || ''}
                            onChange={(e) => {
                              const updated = [...vThingsILove];
                              updated[idx] = { ...updated[idx], desc: e.target.value };
                              setVThingsILove(updated);
                            }}
                            placeholder="Type why you love this..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Future Dreams Section */}
                <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
                  <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">🚀 Our Future Dreams</span>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
                    Customize the 6 dreams you want to build and achieve together. Emojis will automatically update based on the title keywords!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vFutureDreams.map((dream, idx) => {
                      const iconPreview = getDreamIcon(dream.title);
                      return (
                        <div key={dream.id || idx} className="p-4 bg-white border border-rosePrimary/10 rounded-2xl space-y-3 shadow-sm text-left">
                          <div className="flex items-center justify-between border-b border-rose-500/5 pb-2">
                            <span className="text-[11px] font-bold text-wineDeep uppercase tracking-wider flex items-center gap-1.5">
                              <span>Dream #{idx + 1}</span>
                              <span className="text-sm">{iconPreview}</span>
                            </span>
                            <span className="text-[10px] bg-rose-50 text-rosePrimary px-2 py-0.5 rounded-full font-bold">Item {dream.id}</span>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Dream Title</label>
                            <input
                              type="text"
                              value={dream.title || ''}
                              onChange={(e) => {
                                const updated = [...vFutureDreams];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setVFutureDreams(updated);
                              }}
                              placeholder="e.g. Travel to Paris"
                              className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Dream Description</label>
                            <textarea
                              rows="2"
                              value={dream.desc || ''}
                              onChange={(e) => {
                                const updated = [...vFutureDreams];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setVFutureDreams(updated);
                              }}
                              placeholder="Describe this dream together..."
                              className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Note Settings */}
                <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
                  <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">🎙️ Voice Note Settings</span>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Voice Note Intro Text</label>
                    <textarea
                      rows="3"
                      value={vVoiceIntro}
                      onChange={(e) => setVVoiceIntro(e.target.value)}
                      placeholder="e.g. Put on your headphones, close your eyes, and play this..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl space-y-4 text-left">
                    <span className="text-xs font-bold text-wineDeep uppercase tracking-wider block">Voice Note Audio Source</span>
                    
                    {vVoiceUrl && (
                      <div className="p-3 bg-green-50/80 border border-green-200/50 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-green-700 uppercase block">Active Voice Note:</span>
                        <div className="flex items-center justify-between gap-2">
                          <audio src={vVoiceUrl} controls className="h-8 max-w-full" />
                          <button
                            type="button"
                            onClick={() => setVVoiceUrl('')}
                            className="p-1.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg transition-colors cursor-pointer text-xs"
                            title="Remove Voice Note"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option A: Record Audio */}
                      <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Option A: Record Live Voice</span>
                          <p className="text-[11px] text-slate-400 font-light leading-normal">
                            Record a sweet message using your microphone right now.
                          </p>
                        </div>

                        <div className="space-y-3 pt-2">
                          {isRecording ? (
                            <div className="flex items-center justify-between bg-red-50 border border-red-200 p-2.5 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                                <span className="text-xs font-bold text-red-600 font-mono">Recording: {formatSeconds(recordingSeconds)}</span>
                              </div>
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                              >
                                Stop
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="w-full py-2 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase rounded-lg shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>Start Recording</span>
                            </button>
                          )}

                          {previewAudioUrl && !isRecording && (
                            <div className="space-y-2 bg-slate-50 p-2.5 border border-slate-100 rounded-lg">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Preview Recording:</span>
                              <audio src={previewAudioUrl} controls className="w-full h-8" />
                              <button
                                type="button"
                                disabled={uploadingVoice}
                                onClick={uploadRecordedVoice}
                                className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer disabled:opacity-50 animate-pulse"
                              >
                                {uploadingVoice ? 'Uploading...' : 'Save & Upload Recording'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Option B: Upload File or Paste Link */}
                      <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Option B: Upload Audio or Paste URL</span>
                          <p className="text-[11px] text-slate-400 font-light leading-normal">
                            Select an audio file from your device, or paste a direct audio URL below.
                          </p>
                        </div>

                        <div className="space-y-3.5 pt-2">
                          <div className="flex space-x-2">
                            <ReusableUploader
                              accept="audio/*"
                              label="Upload Audio (MP3/WAV)"
                              useAdminApi={true}
                              onUploadSuccess={(url) => setVVoiceUrl(url)}
                            />
                          </div>

                          <input
                            type="text"
                            value={vVoiceUrl}
                            onChange={(e) => setVVoiceUrl(e.target.value)}
                            placeholder="Or paste direct audio link here..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              className="py-4 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 w-full focus:outline-none cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </button>

          </form>

          {/* Quick Actions / Link Widget Sidebar */}
          <div className="space-y-6">
            
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
                  <Eye className="w-4 h-4" />
                  <span>Preview Live Surprise</span>
                </Link>

                {tierName.toLowerCase() === 'premium' && (
                  <Link
                    to={`/control/${instanceId}`}
                    target="_blank"
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-transform hover:scale-[1.02] flex items-center justify-center space-x-1.5 focus:outline-none"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Open Live Control Room ⚡</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleGenerateLinkAndQR}
                  className="w-full py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate Surprise Link & QR</span>
                </button>
              </div>
            </div>

            {/* Link & QR Code Reveal Panel */}
            {linkGenerated && (
              <div className="bg-white border-2 border-rosePrimary rounded-[32px] p-6 shadow-xl text-center space-y-5 animate-fade-in-up text-slate-800">
                
                <div className="flex justify-center text-rosePrimary">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-wineDeep text-lg">Surprise Taiyar Hai!</h4>
                  <p className="font-accent text-rosePrimary text-2xl">"{selectedClosingMsg}"</p>
                </div>

                {/* QR Code Render */}
                <div className="bg-rose-50/20 p-4 border border-rosePrimary/10 rounded-2xl inline-block">
                  <img 
                    src={qrCodeUrl} 
                    alt="Surprise QR Code" 
                    className="w-40 h-40 object-cover mx-auto" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-[10px] text-rosePrimary font-mono mt-2">Scan QR to Open</div>
                </div>

                {/* PDF Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{downloadingPDF ? 'Downloading PDF...' : 'Download Premium QR Card (PDF)'}</span>
                </button>

                {/* Shareable Live Surprise Link */}
                <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Recipient Surprise Link:</span>
                  <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
                    <span className="truncate text-slate-650">{shortLinkTarget}</span>
                    <button 
                      type="button"
                      onClick={handleCopyLink}
                      className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Client Live Control Room Link */}
                {tierName.toLowerCase() === 'premium' ? (
                  <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Your Live Control Room Link (To Trigger remote events):</span>
                    <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
                      <span className="truncate text-slate-650">anka.in/control/{instanceId}</span>
                      <button 
                        type="button"
                        onClick={handleCopyControlLink}
                        className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer flex items-center gap-1"
                      >
                        {copiedControl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Your Live Control Room Link:</span>
                    <div className="flex bg-slate-100/50 border border-slate-200/60 p-3 rounded-xl text-xs justify-between items-center text-slate-500 gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-rosePrimary/60 shrink-0" />
                        <span className="text-[11px] leading-snug">
                          Real-time live controls (Fireworks, Confetti, Message alerts) are locked on the <strong className="text-slate-650 font-bold">{tierName || 'Basic'}</strong> plan. Upgrade to Premium to unlock!
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client Admin Control Panel Link */}
                <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Your Settings Editor Link (Save This):</span>
                  <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
                    <span className="truncate text-slate-650">anka.in/customizer/{instanceId}</span>
                    <button 
                      type="button"
                      onClick={handleCopyAdminLink}
                      className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer flex items-center gap-1"
                    >
                      {copiedAdmin ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Star Rating Submission Card */}
                {!ratingSubmitted && demoId ? (
                  <div className="border-t border-rosePrimary/10 pt-4 text-left space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-wineDeep uppercase tracking-wider">Rate this design theme:</h4>
                      <p className="text-[11px] text-slate-500 font-light">Rate your experience to help other gifters.</p>
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
                        className="w-full py-2 bg-rosePrimary hover:bg-wineDeep text-white text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : ratingSubmitted ? (
                  <div className="border-t border-rosePrimary/10 pt-4 text-center text-xs font-medium text-rosePrimary flex items-center justify-center space-x-1.5">
                    <Heart className="w-4 h-4 fill-rosePrimary text-rosePrimary" />
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
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
