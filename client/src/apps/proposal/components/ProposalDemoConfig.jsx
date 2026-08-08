import React from 'react';
import ProposalCustomizer from './ProposalCustomizer';

export default function ProposalDemoConfig(props) {
  // Bind demoLinkHook state & handlers to ProposalCustomizer props
  const customizerProps = {
    recipientName: props.demoLinkRecipientName,
    setRecipientName: props.setDemoLinkRecipientName,
    senderName: props.demoLinkSenderName,
    setSenderName: props.setDemoLinkSenderName,
    message: props.demoLinkMessage,
    setMessage: props.setDemoLinkMessage,
    musicUrl: props.demoLinkMusicUrl || props.musicUrl || '',
    setMusicUrl: props.setDemoLinkMusicUrl || props.setMusicUrl || (() => {}),
    photos: props.demoLinkPhotos || props.photos || [],
    setPhotos: props.setDemoLinkPhotos || props.setPhotos || (() => {}),
    tierName: "Premium",
    ...props
  };

  return <ProposalCustomizer {...customizerProps} />;
}
