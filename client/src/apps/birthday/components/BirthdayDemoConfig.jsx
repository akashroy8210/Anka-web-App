import React from 'react';
import BirthdayCustomizer from './BirthdayCustomizer';

export default function BirthdayDemoConfig(props) {
  // Bind demoLinkHook state & handlers to BirthdayCustomizer props
  const customizerProps = {
    recipientName: props.demoLinkRecipientName,
    setRecipientName: props.setDemoLinkRecipientName,
    senderName: props.demoLinkSenderName,
    setSenderName: props.setDemoLinkSenderName,
    message: props.demoLinkMessage,
    setMessage: props.setDemoLinkMessage,
    birthdayDate: props.demoLinkBirthdayDate || props.birthdayDate || '',
    setBirthdayDate: props.setDemoLinkBirthdayDate || props.setBirthdayDate || (() => {}),
    birthdaySong: props.demoLinkBirthdaySongUrl || props.birthdaySongUrl || '',
    setBirthdaySong: props.setDemoLinkBirthdaySongUrl || props.setBirthdaySongUrl || (() => {}),
    cakeImage: props.demoLinkCakeImage || props.cakeImage || '',
    setCakeImage: props.setDemoLinkCakeImage || props.setCakeImage || (() => {}),
    cakeFeedingImage: props.demoLinkCakeFeedingImage || props.cakeFeedingImage || '',
    setCakeFeedingImage: props.setDemoLinkCakeFeedingImage || props.setCakeFeedingImage || (() => {}),
    finalMessage: props.demoLinkFinalMessage || props.finalMessage || '',
    setFinalMessage: props.setDemoLinkFinalMessage || props.setFinalMessage || (() => {}),
    backgroundMusic: props.demoLinkMusicUrl || props.musicUrl || '',
    setBackgroundMusic: props.setDemoLinkMusicUrl || props.setMusicUrl || (() => {}),
    photos: props.demoLinkPhotos || props.photos || [],
    setPhotos: props.setDemoLinkPhotos || props.setPhotos || (() => {}),
    memories: props.demoLinkTimeline || props.memories || [],
    setMemories: props.setDemoLinkTimeline || props.setMemories || (() => {}),
    
    // Passcode Lock
    passwordEnabled: props.demoLinkPasswordEnabled || false,
    setPasswordEnabled: props.setDemoLinkPasswordEnabled || (() => {}),
    password: props.demoLinkPassword || '',
    setPassword: props.setDemoLinkPassword || (() => {}),
    passwordHint: props.demoLinkPasswordHint || '',
    setPasswordHint: props.setDemoLinkPasswordHint || (() => {}),

    tierName: "Premium",
    ...props
  };

  return <BirthdayCustomizer {...customizerProps} />;
}
