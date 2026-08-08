import React from 'react';
import ApologyCustomizer from './ApologyCustomizer';

export default function ApologyDemoConfig(props) {
  // Extract canonical themeSlug directly from database Demo model (props.demo.themeSlug) or demoLinkThemeSlug
  const selectedTheme = props.demoLinkThemeSlug || props.demo?.themeSlug || props.selectedTheme;
  const recipientName = props.demoLinkRecipientName || props.recipientName;
  const senderName = props.demoLinkSenderName || props.senderName;
  const message = props.demoLinkMessage || props.message;
  const musicUrl = props.demoLinkMusicUrl || props.musicUrl;
  const memories = props.memories || props.demoLinkPhotos || props.photos;
  const setMemories = props.setMemories || props.setDemoLinkPhotos || props.setPhotos;

  return (
    <ApologyCustomizer
      {...props}
      selectedTheme={selectedTheme}
      recipientName={recipientName}
      senderName={senderName}
      message={message}
      musicUrl={musicUrl}
      memories={memories}
      setMemories={setMemories}
      tierName="Premium"
    />
  );
}
