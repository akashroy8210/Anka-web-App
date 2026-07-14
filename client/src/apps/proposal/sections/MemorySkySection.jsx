import React from 'react';
import { useProposal } from '../hooks/useProposal';
import MessageStars from '../../virtual-date/components/MessageStars';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function MemorySkySection() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  const starsList = config.proposalTimeline && config.proposalTimeline.length > 0 
    ? config.proposalTimeline 
    : (config.proposalSkyMemories || []);

  // Map timeline descriptions / titles directly into the starlit whispers array
  const messages = starsList.map(star => {
    if (star.title && star.description) {
      return `${star.title} — ${star.description}`;
    }
    return star.description || star.title || "A precious memory star...";
  });

  return (
    <div className="w-full relative select-none">
      <MessageStars 
        customMessages={messages.length > 0 ? messages : undefined}
      />
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <JourneyNavigation onNext={handleNext} />
      </div>
    </div>
  );
}
