import React from 'react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import ProposalQuote from '../proposalOnly/ProposalQuote';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function RevealSection() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-md" className="space-y-6 md:space-y-8 select-none text-center">
      <ProposalQuote
        firstText="Abhi tak jo kuch tumne dekha... woh sirf tum thi."
        secondText="Ab main tumhe woh dikhana chahta hoon... jo maine tum mein dekha."
      />
      <JourneyNavigation onNext={handleNext} nextText="Show Me ❤️" />
    </SectionWrapper>
  );
}
