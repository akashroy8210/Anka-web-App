import React from 'react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import ProposalTimelineCard from '../proposalOnly/ProposalTimelineCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function TimelineSection() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-2xl" className="space-y-6 select-none w-full">
      <AnimatedTitle
        subtitle="Our Journey Together"
        title="Tracing the Footpaths of Our Hearts"
      />

      <div className="relative border-l border-rose-500/20 ml-2 space-y-8 w-full py-4">
        {config.proposalTimeline.map((item, idx) => (
          <ProposalTimelineCard key={idx} item={item} index={idx} />
        ))}
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
