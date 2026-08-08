import React from 'react';
import GirlfriendCustomizer from './GirlfriendCustomizer';

export default function GirlfriendDemoConfig(props) {
  // Bind demoLinkHook state & handlers to GirlfriendCustomizer props
  const customizerProps = {
    recipientName: props.demoLinkRecipientName,
    setRecipientName: props.setDemoLinkRecipientName,
    senderName: props.demoLinkSenderName,
    setSenderName: props.setDemoLinkSenderName,
    message: props.demoLinkMessage,
    setMessage: props.setDemoLinkMessage,
    selectedTheme: props.demoLinkThemeSlug || props.selectedTheme || 'girlfriend-day-dark',
    musicUrl: props.demoLinkMusicUrl || props.musicUrl || '',
    setMusicUrl: props.setDemoLinkMusicUrl || props.setMusicUrl || (() => {}),
    photos: props.demoLinkPhotos || props.photos || [],
    setPhotos: props.setDemoLinkPhotos || props.setPhotos || (() => {}),
    tierName: "Premium",
    ...props
  };

  return <GirlfriendCustomizer {...customizerProps} />;
}
