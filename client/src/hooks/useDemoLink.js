import { useState } from 'react';
import { api } from '../services/api.service';
import { orderService } from '../services/order.service';
import { aiService } from '../services/ai.service';

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
      // Set values to match existing in case of edit
      setDemoLinkRecipientName(existing.config?.recipientName || 'My Sweetheart');
      setDemoLinkSenderName(existing.config?.senderName || 'With Love');
      setDemoLinkMessage(existing.config?.message || 'Happy Surprise!');
      setDemoLinkThemeColor(existing.config?.themeColor || '#E11D48');
      setDemoLinkSongChoice(existing.config?.songChoice || 'romantic');
      setDemoLinkMusicUrl(existing.config?.musicUrl || '');
      setDemoLinkBirthdaySongUrl(existing.config?.birthdaySongUrl || '');
      setDemoLinkCustomSlug(existing.instanceId || '');
      setDemoLinkPhotos(existing.config?.photos || []);
      const rawTimeline = existing.config?.memories || existing.config?.timeline || [];
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
      const memoriesArray = demoLinkTimeline.map(item => ({
        title: item.title,
        date: item.date,
        description: item.description,
        imageUrl: item.photo
      }));

      if (demoLinkMode === 'edit') {
        const payload = {
          customSlug: demoLinkCustomSlug,
          config: {
            recipientName: demoLinkRecipientName,
            senderName: demoLinkSenderName,
            message: demoLinkMessage,
            themeColor: demoLinkThemeColor,
            songChoice: demoLinkSongChoice,
            musicUrl: demoLinkMusicUrl,
            birthdaySongUrl: demoLinkBirthdaySongUrl,
            photos: demoLinkPhotos,
            timeline: demoLinkTimeline,
            memories: memoriesArray
          }
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
          config: {
            recipientName: demoLinkRecipientName,
            senderName: demoLinkSenderName,
            message: demoLinkMessage,
            themeColor: demoLinkThemeColor,
            songChoice: demoLinkSongChoice,
            musicUrl: demoLinkMusicUrl,
            birthdaySongUrl: demoLinkBirthdaySongUrl,
            photos: demoLinkPhotos,
            timeline: demoLinkTimeline,
            memories: memoriesArray
          }
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
  };
}
