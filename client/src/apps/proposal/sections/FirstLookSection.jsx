import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import MediaViewer from '../../../components/shared/MediaViewer';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function FirstLookSection() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 select-none text-center">
      <AnimatedTitle
        subtitle="First Time I Saw You"
        title="Where Our Universe Collided"
      />

      <GlassCard glowColor="rose" hoverEffect={false} className="border-rose-500/10 p-5 md:p-6 w-full text-left space-y-4">
        {config.proposalFirstPhoto && (
          <MediaViewer
            src={config.proposalFirstPhoto}
            alt={config.proposalFirstTitle || 'A Memory Frozen in Time'}
            aspectRatio="aspect-[4/3] sm:aspect-video"
          />
        )}
        <div className="space-y-2">
          <h3 className="font-heading font-black text-xl text-rose-100">
            {config.proposalFirstTitle || 'A Memory Frozen in Time'}
          </h3>
          <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
            {config.proposalFirstDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-450" /> {config.proposalFirstDate}
              </span>
            )}
            {config.proposalFirstLocation && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-450" /> {config.proposalFirstLocation}
              </span>
            )}
          </div>
          {config.proposalFirstDesc && (
            <p className="text-xs text-slate-350 leading-relaxed font-light font-serif pt-1">
              "{config.proposalFirstDesc}"
            </p>
          )}
        </div>
      </GlassCard>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
