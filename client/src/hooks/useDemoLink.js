import { useState } from 'react';
import { api } from '../services/api.service';
import { orderService } from '../services/order.service';
import { aiService } from '../services/ai.service';

function getDreamIcon(title) {
  if (!title) return 'Sparkles';
  const lowercase = title.toLowerCase();
  if (lowercase.includes('travel') || lowercase.includes('trip') || lowercase.includes('world') || lowercase.includes('explore')) return 'Globe';
  if (lowercase.includes('home') || lowercase.includes('house') || lowercase.includes('stay') || lowercase.includes('flat')) return 'Home';
  if (lowercase.includes('money') || lowercase.includes('rich') || lowercase.includes('success') || lowercase.includes('career') || lowercase.includes('business')) return 'Coins';
  if (lowercase.includes('baby') || lowercase.includes('child') || lowercase.includes('kid') || lowercase.includes('family')) return 'Heart';
  if (lowercase.includes('car') || lowercase.includes('drive') || lowercase.includes('bike') || lowercase.includes('ride')) return 'Car';
  if (lowercase.includes('pet') || lowercase.includes('dog') || lowercase.includes('cat') || lowercase.includes('animal')) return 'Smile';
  return 'Sparkles';
}

export function useDemoLink() {
  const [isDemoLinkModalOpen, setIsDemoLinkModalOpen] = useState(false);
  const [demoLinkCategory, setDemoLinkCategory] = useState(null);
  const [demoLinkDemo, setDemoLinkDemo] = useState(null);
  const [demoLinkRecipientName, setDemoLinkRecipientName] = useState('My Sweetheart');
  const [demoLinkSenderName, setDemoLinkSenderName] = useState('With Love');
  const [demoLinkMessage, setDemoLinkMessage] = useState('Happy Surprise! You mean the world to me. Open this envelope to unlock memories, songs, and firework celebrations.');
  const [demoLinkThemeColor, setDemoLinkThemeColor] = useState('#E11D48');
  const [demoLinkSongChoice, setDemoLinkSongChoice] = useState('romantic');
  const [demoLinkMusicUrl, setDemoLinkMusicUrl] = useState('');
  const [demoLinkCustomSlug, setDemoLinkCustomSlug] = useState('');
  const [demoLinkPhotos, setDemoLinkPhotos] = useState([]);
  const [demoLinkTimeline, setDemoLinkTimeline] = useState([]);
  const [demoLinkCreatedUrl, setDemoLinkCreatedUrl] = useState('');
  const [isSubmittingDemoLink, setIsSubmittingDemoLink] = useState(false);

  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDate, setTimelineDate] = useState('');
  const [timelineDescription, setTimelineDescription] = useState('');
  const [timelinePhoto, setTimelinePhoto] = useState('');

  const [aiMessagePrompt, setAiMessagePrompt] = useState('');
  const [isGeneratingAiMessage, setIsGeneratingAiMessage] = useState(false);
  const [showAiPromptField, setShowAiPromptField] = useState(false);
  const [isGeneratingTimelineDesc, setIsGeneratingTimelineDesc] = useState(false);
  const [demoLinkBirthdaySongUrl, setDemoLinkBirthdaySongUrl] = useState('');

  const [demoLinkMode, setDemoLinkMode] = useState('create'); // 'choose', 'edit', 'create'
  const [existingDemoLinkInstance, setExistingDemoLinkInstance] = useState(null);
  const [deleteOldInstanceId, setDeleteOldInstanceId] = useState(null);

  const [isUploadingDemoBackgroundMusic, setIsUploadingDemoBackgroundMusic] = useState(false);
  const [isUploadingDemoBirthdaySong, setIsUploadingDemoBirthdaySong] = useState(false);
  const [isUploadingDemoPhotos, setIsUploadingDemoPhotos] = useState(false);
  const [isUploadingDemoTimelinePhoto, setIsUploadingDemoTimelinePhoto] = useState(false);

  // Dynamic Birthday-specific customizer states
  const [birthdaySong, setBirthdaySong] = useState('');
  const [cakeImage, setCakeImage] = useState('');
  const [cakeFeedingImage, setCakeFeedingImage] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('');
  const [memories, setMemories] = useState([]);
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemImage, setNewMemImage] = useState('');
  const [newMemDesc, setNewMemDesc] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [uploadingBdaySong, setUploadingBdaySong] = useState(false);
  const [uploadingCakeFeedingA, setUploadingCakeFeedingA] = useState(false);
  const [uploadingCakeFeedingB, setUploadingCakeFeedingB] = useState(false);
  const [uploadingMemoryNode, setUploadingMemoryNode] = useState(false);
  const [malePhoto, setMalePhoto] = useState('');
  const [femalePhoto, setFemalePhoto] = useState('');
  const [maleName, setMaleName] = useState('');
  const [femaleName, setFemaleName] = useState('');

  // Dynamic Valentine-specific states
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
  const [vTimeline, setVTimeline] = useState([]);
  const [vThingsILove, setVThingsILove] = useState([]);
  const [vFutureDreams, setVFutureDreams] = useState([]);
  const [newVTimelineDate, setNewVTimelineDate] = useState('');
  const [newVTimelineTitle, setNewVTimelineTitle] = useState('');
  const [newVTimelineImage, setNewVTimelineImage] = useState('');
  const [newVTimelineDesc, setNewVTimelineDesc] = useState('');
  const [generatingVTimelineAI, setGeneratingVTimelineAI] = useState(false);
  const [uploadingVTimeline, setUploadingVTimeline] = useState(false);
  const [uploadingVoiceFile, setUploadingVoiceFile] = useState(false);
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
  const [vPromisePoints, setVPromisePoints] = useState([]);
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
  const [proposalMoments, setProposalMoments] = useState([]);
  const [proposalReasons, setProposalReasons] = useState([]);
  const [proposalLetters, setProposalLetters] = useState([]);
  const [proposalSkyMemories, setProposalSkyMemories] = useState([]);
  const [proposalQuestion, setProposalQuestion] = useState('Will You Be Mine Forever?');
  const [proposalYesBtn, setProposalYesBtn] = useState('💍 YES');
  const [proposalThinkBtn, setProposalThinkBtn] = useState('🤍 Let Me Think');
  const [proposalThinkResponse, setProposalThinkResponse] = useState('');
  const [proposalCelebrationMusic, setProposalCelebrationMusic] = useState('');
  const [proposalCelebrateLetter, setProposalCelebrateLetter] = useState('');

  // Stub recording helpers
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const startRecording = () => {};
  const stopRecording = () => {};
  const formatSeconds = (s) => `${s}s`;
  const uploadRecordedVoice = async () => '';
  const previewAudioUrl = '';
  const uploadingVoice = false;

  const handleOpenCreateDemoLinkModal = (category, demo, instances) => {
    setDemoLinkCategory(category);
    setDemoLinkDemo(demo);
    setDemoLinkCreatedUrl('');
    setIsSubmittingDemoLink(false);
    setTimelineTitle('');
    setTimelineDate('');
    setTimelineDescription('');
    setTimelinePhoto('');
    setDeleteOldInstanceId(null);

    // Search for an existing surprise instance linked to this demo
    const existing = instances.find(inst => inst.demo === demo._id || (inst.demo?._id ? inst.demo._id === demo._id : inst.demo === demo._id));
    if (existing) {
      setExistingDemoLinkInstance(existing);
      setDemoLinkMode('choose');

      const conf = existing.config || {};
      
      // Load envelope & customizer properties
      setDemoLinkRecipientName(conf.recipientName || 'My Sweetheart');
      setDemoLinkSenderName(conf.senderName || 'With Love');
      setDemoLinkMessage(conf.message || 'Happy Surprise!');
      setDemoLinkThemeColor(conf.themeColor || '#E11D48');
      setDemoLinkSongChoice(conf.songChoice || 'romantic');
      setDemoLinkMusicUrl(conf.musicUrl || '');
      setDemoLinkBirthdaySongUrl(conf.birthdaySongUrl || '');
      setDemoLinkCustomSlug(existing.instanceId || '');
      setDemoLinkPhotos(conf.photos || []);

      // Birthday specific
      setBirthdaySong(conf.birthdaySong || '');
      setCakeImage(conf.cakeImage || '');
      setCakeFeedingImage(conf.cakeFeedingImage || '');
      setFinalMessage(conf.finalMessage || '');
      setBackgroundMusic(conf.backgroundMusic || '');
      setMemories(conf.memories || []);
      setMalePhoto(conf.malePhotoUrl || '');
      setFemalePhoto(conf.femalePhotoUrl || '');
      setMaleName(conf.maleName || '');
      setFemaleName(conf.femaleName || '');

      // Valentine specific
      setVMemory1Date(conf.vMemory1Date || '');
      setVMemory1Title(conf.vMemory1Title || '');
      setVMemory1Desc(conf.vMemory1Desc || '');
      setVMemory2Date(conf.vMemory2Date || '');
      setVMemory2Title(conf.vMemory2Title || '');
      setVMemory2Desc(conf.vMemory2Desc || '');
      setVMemory3Date(conf.vMemory3Date || '');
      setVMemory3Title(conf.vMemory3Title || '');
      setVMemory3Desc(conf.vMemory3Desc || '');
      setVLove1Title(conf.vLove1Title || '');
      setVLove1Desc(conf.vLove1Desc || '');
      setVLove2Title(conf.vLove2Title || '');
      setVLove2Desc(conf.vLove2Desc || '');
      setVLove3Title(conf.vLove3Title || '');
      setVLove3Desc(conf.vLove3Desc || '');
      setVVoiceIntro(conf.vVoiceIntro || '');
      setVVoiceUrl(conf.vVoiceUrl || '');
      setVWhisper1(conf.vWhisper1 || '');
      setVWhisper2(conf.vWhisper2 || '');
      setVWhisper3(conf.vWhisper3 || '');
      setVTimeline(conf.vTimeline || []);
      setVThingsILove(conf.thingsILove || []);
      setVFutureDreams(conf.futureDreams || []);
      setValentineGreeting(conf.valentineGreeting || '');
      setValentineProposalText(conf.valentineProposalText || '');
      setVRoseTitle(conf.vRoseTitle || '');
      setVRoseDesc1(conf.vRoseDesc1 || '');
      setVRoseDesc2(conf.vRoseDesc2 || '');
      setVChocTitle(conf.vChocTitle || '');
      setVChocText(conf.vChocText || '');
      setVTeddyWait(conf.vTeddyWait || '');
      setVTeddyGo(conf.vTeddyGo || '');
      setVTeddyFound(conf.vTeddyFound || '');
      setVTeddyText(conf.vTeddyText || '');
      setVPromiseTitle(conf.vPromiseTitle || '');
      setVPromiseSub(conf.vPromiseSub || '');
      setVPromisePoints(conf.vPromisePoints || []);
      setVHugIntro(conf.vHugIntro || '');
      setVHugTitle(conf.vHugTitle || '');
      setVHugDesc(conf.vHugDesc || '');
      setVHugBtn(conf.vHugBtn || '');
      setUnlockAllDays(conf.unlockAllDays || false);

      // Proposal specific
      setProposalStarPhoto(conf.proposalStarPhoto || '');
      setProposalStarName(conf.proposalStarName || '');
      setProposalStarNickname(conf.proposalStarNickname || '');
      setProposalStarIntro(conf.proposalStarIntro || '');
      setProposalHobbies(conf.proposalHobbies || '');
      setProposalFavFood(conf.proposalFavFood || '');
      setProposalFavSongs(conf.proposalFavSongs || '');
      setProposalFavPlace(conf.proposalFavPlace || '');
      setProposalFavCafe(conf.proposalFavCafe || '');
      setProposalFavMovie(conf.proposalFavMovie || '');
      setProposalFavFlower(conf.proposalFavFlower || '');
      setProposalFirstPhoto(conf.proposalFirstPhoto || '');
      setProposalFirstDate(conf.proposalFirstDate || '');
      setProposalFirstLocation(conf.proposalFirstLocation || '');
      setProposalFirstTitle(conf.proposalFirstTitle || '');
      setProposalFirstDesc(conf.proposalFirstDesc || '');
      setProposalTimeline(conf.proposalTimeline || []);
      setProposalMoments(conf.proposalMoments || []);
      setProposalReasons(conf.proposalReasons || []);
      setProposalLetters(conf.proposalLetters || []);
      setProposalSkyMemories(conf.proposalSkyMemories || []);
      setProposalQuestion(conf.proposalQuestion || 'Will You Be Mine Forever?');
      setProposalYesBtn(conf.proposalYesBtn || '💍 YES');
      setProposalThinkBtn(conf.proposalThinkBtn || '🤍 Let Me Think');
      setProposalThinkResponse(conf.proposalThinkResponse || '');
      setProposalCelebrationMusic(conf.proposalCelebrationMusic || '');
      setProposalCelebrateLetter(conf.proposalCelebrateLetter || '');

      const rawTimeline = conf.memories || conf.timeline || [];
      const mappedTimeline = rawTimeline.map(item => ({
        title: item.title || '',
        date: item.date || '',
        description: item.description || '',
        photo: item.imageUrl || item.photo || ''
      }));
      setDemoLinkTimeline(mappedTimeline);
    } else {
      setExistingDemoLinkInstance(null);
      setDemoLinkMode('create');
      // Reset values to defaults
      setDemoLinkRecipientName('My Sweetheart');
      setDemoLinkSenderName('With Love');
      setDemoLinkMessage('Happy Surprise! You mean the world to me. Open this envelope to unlock memories, songs, and firework celebrations.');
      setDemoLinkThemeColor('#E11D48');
      setDemoLinkSongChoice('romantic');
      setDemoLinkMusicUrl('');
      setDemoLinkBirthdaySongUrl('');
      setDemoLinkCustomSlug('');
      setDemoLinkPhotos([]);
      setDemoLinkTimeline([]);

      // Reset birthday
      setBirthdaySong('');
      setCakeImage('');
      setCakeFeedingImage('');
      setFinalMessage('');
      setBackgroundMusic('');
      setMemories([]);
      setMalePhoto('');
      setFemalePhoto('');
      setMaleName('');
      setFemaleName('');

      // Reset Valentine
      setVMemory1Date('');
      setVMemory1Title('');
      setVMemory1Desc('');
      setVMemory2Date('');
      setVMemory2Title('');
      setVMemory2Desc('');
      setVMemory3Date('');
      setVMemory3Title('');
      setVMemory3Desc('');
      setVLove1Title('');
      setVLove1Desc('');
      setVLove2Title('');
      setVLove2Desc('');
      setVLove3Title('');
      setVLove3Desc('');
      setVVoiceIntro('');
      setVVoiceUrl('');
      setVWhisper1('');
      setVWhisper2('');
      setVWhisper3('');
      setVTimeline([]);
      setVThingsILove([]);
      setVFutureDreams([]);
      setValentineGreeting('');
      setValentineProposalText('');
      setVRoseTitle('');
      setVRoseDesc1('');
      setVRoseDesc2('');
      setVChocTitle('');
      setVChocText('');
      setVTeddyWait('');
      setVTeddyGo('');
      setVTeddyFound('');
      setVTeddyText('');
      setVPromiseTitle('');
      setVPromiseSub('');
      setVPromisePoints([]);
      setVHugIntro('');
      setVHugTitle('');
      setVHugDesc('');
      setVHugBtn('');
      setUnlockAllDays(false);

      // Reset Proposal spec
      setProposalStarPhoto('');
      setProposalStarName('');
      setProposalStarNickname('');
      setProposalStarIntro('');
      setProposalHobbies('');
      setProposalFavFood('');
      setProposalFavSongs('');
      setProposalFavPlace('');
      setProposalFavCafe('');
      setProposalFavMovie('');
      setProposalFavFlower('');
      setProposalFirstPhoto('');
      setProposalFirstDate('');
      setProposalFirstLocation('');
      setProposalFirstTitle('');
      setProposalFirstDesc('');
      setProposalTimeline([]);
      setProposalMoments([]);
      setProposalReasons([]);
      setProposalLetters([]);
      setProposalSkyMemories([]);
      setProposalQuestion('Will You Be Mine Forever?');
      setProposalYesBtn('💍 YES');
      setProposalThinkBtn('🤍 Let Me Think');
      setProposalThinkResponse('');
      setProposalCelebrationMusic('');
      setProposalCelebrateLetter('');
    }
    
    setIsDemoLinkModalOpen(true);
  };

  const handleAddTimelineItem = (e) => {
    e.preventDefault();
    if (!timelineTitle) return;
    setDemoLinkTimeline([...demoLinkTimeline, {
      title: timelineTitle,
      date: timelineDate || new Date().toISOString().split('T')[0],
      description: timelineDescription || '',
      photo: timelinePhoto || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400'
    }]);
    setTimelineTitle('');
    setTimelineDate('');
    setTimelineDescription('');
    setTimelinePhoto('');
  };

  const handleRemoveTimelineItem = (index) => {
    setDemoLinkTimeline(demoLinkTimeline.filter((_, idx) => idx !== index));
  };

  const handleCreateDemoLinkSubmit = async (e, token, setInstances, setCategories, modalOverlayRef) => {
    e.preventDefault();
    setIsSubmittingDemoLink(true);
    try {
      const configPayload = {
        recipientName: demoLinkRecipientName,
        senderName: demoLinkSenderName,
        message: demoLinkMessage,
        themeColor: demoLinkThemeColor,
        songChoice: demoLinkSongChoice,
        musicUrl: demoLinkMusicUrl,
        birthdaySongUrl: demoLinkBirthdaySongUrl,
        photos: demoLinkPhotos,
        // Birthday settings
        birthdaySong,
        cakeImage,
        cakeFeedingImage,
        finalMessage,
        backgroundMusic,
        memories,
        malePhotoUrl: malePhoto,
        femalePhotoUrl: femalePhoto,
        maleName,
        femaleName,
        // Valentine / Virtual Date settings
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
        unlockAllDays,
        // Proposal specific settings
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
        proposalMoments,
        proposalReasons,
        proposalLetters,
        proposalSkyMemories,
        proposalQuestion,
        proposalYesBtn,
        proposalThinkBtn,
        proposalThinkResponse,
        proposalCelebrationMusic,
        proposalCelebrateLetter
      };

      if (demoLinkMode === 'edit') {
        const payload = {
          customSlug: demoLinkCustomSlug,
          config: configPayload
        };
        const res = await orderService.updateInstanceConfig(existingDemoLinkInstance.instanceId, payload, token);
        if (res.success && res.instance) {
          setDemoLinkCreatedUrl(`${window.location.origin}/s/${res.instance.instanceId}`);
          if (modalOverlayRef.current) modalOverlayRef.current.scrollTop = 0;
          try {
            const instData = await orderService.getAllInstances(token);
            if (instData.success) setInstances(instData.instances);
            const catData = await api.getCategories();
            if (catData.success) setCategories(catData.categories);
          } catch (err) { console.warn(err); }
        } else {
          alert(res.message || 'Error updating demo page.');
        }
      } else {
        // Create Mode
        if (deleteOldInstanceId) {
          try {
            await orderService.deleteInstance(deleteOldInstanceId, token);
          } catch (err) {
            console.warn('Failed to clean up old demo link instance:', err);
          }
        }
        
        const res = await orderService.adminCreateInstance({
          categoryId: demoLinkCategory._id,
          demoId: demoLinkDemo?._id,
          tier: 'Premium',
          customerName: 'Admin Demo Vibe',
          customerEmail: 'admin@ankasurprises.com',
          customerPhone: '0000055555',
          customSlug: demoLinkCustomSlug,
          config: configPayload
        }, token);
        if (res.success && res.instance) {
          setDemoLinkCreatedUrl(`${window.location.origin}/s/${res.instance.instanceId}`);
          if (modalOverlayRef.current) modalOverlayRef.current.scrollTop = 0;
          try {
            const instData = await orderService.getAllInstances(token);
            if (instData.success) setInstances(instData.instances);
            const catData = await api.getCategories();
            if (catData.success) setCategories(catData.categories);
          } catch (err) { console.warn(err); }
        } else {
          alert(res.message || 'Error generating demo page.');
        }
      }
    } catch (err) {
      alert('Network error handling demo page submission.');
    } finally {
      setIsSubmittingDemoLink(false);
    }
  };

  const handleGenerateAiMessage = async () => {
    if (!aiMessagePrompt) return;
    setIsGeneratingAiMessage(true);
    try {
      const data = await aiService.generateAILetter(aiMessagePrompt, demoLinkRecipientName, demoLinkSenderName);
      if (data.success && data.letter) {
        setDemoLinkMessage(data.letter);
        setShowAiPromptField(false);
        setAiMessagePrompt('');
      } else { alert('Failed to generate AI message.'); }
    } catch (err) { alert('Error generating AI message.'); }
    finally { setIsGeneratingAiMessage(false); }
  };

  const handleGenerateTimelineDesc = async () => {
    if (!timelineTitle) { alert('Please enter a memory title first!'); return; }
    setIsGeneratingTimelineDesc(true);
    try {
      const data = await aiService.generateAIMemoryDescription(timelineTitle, demoLinkRecipientName);
      if (data.success && data.description) setTimelineDescription(data.description);
      else alert('Failed to generate memory description.');
    } catch (err) { alert('Error generating memory description.'); }
    finally { setIsGeneratingTimelineDesc(false); }
  };

  return {
    isDemoLinkModalOpen,
    setIsDemoLinkModalOpen,
    demoLinkCategory,
    setDemoLinkCategory,
    demoLinkDemo,
    setDemoLinkDemo,
    demoLinkRecipientName,
    setDemoLinkRecipientName,
    demoLinkSenderName,
    setDemoLinkSenderName,
    demoLinkMessage,
    setDemoLinkMessage,
    demoLinkThemeColor,
    setDemoLinkThemeColor,
    demoLinkSongChoice,
    setDemoLinkSongChoice,
    demoLinkMusicUrl,
    setDemoLinkMusicUrl,
    demoLinkCustomSlug,
    setDemoLinkCustomSlug,
    demoLinkPhotos,
    setDemoLinkPhotos,
    demoLinkTimeline,
    setDemoLinkTimeline,
    demoLinkCreatedUrl,
    setDemoLinkCreatedUrl,
    isSubmittingDemoLink,
    setIsSubmittingDemoLink,
    timelineTitle,
    setTimelineTitle,
    timelineDate,
    setTimelineDate,
    timelineDescription,
    setTimelineDescription,
    timelinePhoto,
    setTimelinePhoto,
    aiMessagePrompt,
    setAiMessagePrompt,
    isGeneratingAiMessage,
    setIsGeneratingAiMessage,
    showAiPromptField,
    setShowAiPromptField,
    isGeneratingTimelineDesc,
    setIsGeneratingTimelineDesc,
    demoLinkBirthdaySongUrl,
    setDemoLinkBirthdaySongUrl,
    demoLinkMode,
    setDemoLinkMode,
    existingDemoLinkInstance,
    setExistingDemoLinkInstance,
    deleteOldInstanceId,
    setDeleteOldInstanceId,
    isUploadingDemoBackgroundMusic,
    setIsUploadingDemoBackgroundMusic,
    isUploadingDemoBirthdaySong,
    setIsUploadingDemoBirthdaySong,
    isUploadingDemoPhotos,
    setIsUploadingDemoPhotos,
    isUploadingDemoTimelinePhoto,
    setIsUploadingDemoTimelinePhoto,
    handleOpenCreateDemoLinkModal,
    handleAddTimelineItem,
    handleRemoveTimelineItem,
    handleCreateDemoLinkSubmit,
    handleGenerateAiMessage,
    handleGenerateTimelineDesc,

    // Customizer properties mapped to useDemoLink properties
    birthdaySong, setBirthdaySong,
    cakeImage, setCakeImage,
    cakeFeedingImage, setCakeFeedingImage,
    finalMessage, setFinalMessage,
    backgroundMusic, setBackgroundMusic,
    memories, setMemories,
    newMemTitle, setNewMemTitle,
    newMemImage, setNewMemImage,
    newMemDesc, setNewMemDesc,
    generatingAI, setGeneratingAI,
    uploadingBdaySong, setUploadingBdaySong,
    uploadingCakeFeedingA, setUploadingCakeFeedingA,
    uploadingCakeFeedingB, setUploadingCakeFeedingB,
    uploadingMemoryNode, setUploadingMemoryNode,
    malePhoto, setMalePhoto,
    femalePhoto, setFemalePhoto,
    maleName, setMaleName,
    femaleName, setFemaleName,

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

    // Proposal specific
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
    proposalMoments, setProposalMoments,
    proposalReasons, setProposalReasons,
    proposalLetters, setProposalLetters,
    proposalSkyMemories, setProposalSkyMemories,
    proposalQuestion, setProposalQuestion,
    proposalYesBtn, setProposalYesBtn,
    proposalThinkBtn, setProposalThinkBtn,
    proposalThinkResponse, setProposalThinkResponse,
    proposalCelebrationMusic, setProposalCelebrationMusic,
    proposalCelebrateLetter, setProposalCelebrateLetter,

    isRecording, startRecording, stopRecording, recordingSeconds, formatSeconds, uploadRecordedVoice, previewAudioUrl, uploadingVoice,
    getDreamIcon,
    api
  };
}
