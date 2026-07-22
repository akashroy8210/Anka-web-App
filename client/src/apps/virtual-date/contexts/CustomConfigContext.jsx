import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  timelineMemories, thingsILove, moodComforts, 
  starMessages, galleryPhotos, futureDreams, openWhenLetters 
} from "../data/placeholderData";

const CustomConfigContext = createContext(null);

export const useCustomConfig = () => useContext(CustomConfigContext);

export function CustomConfigProvider({ children, initialConfig = null, isEditingMode = false, instance = null }) {
  const defaultConfig = {
    welcome: {
      title: "Hey My Love ❤️",
      subtitle: "I know today may feel heavy.",
      line1: "You don't have to smile.",
      line2: "You don't have to explain.",
      line3: "You don't even have to talk.",
      prompt: "Just stay here with me for a little while.",
      buttonText: "Enter Our Little World"
    },
    timeline: timelineMemories,
    thingsILove: thingsILove,
    moodGarden: moodComforts,
    starMessages: starMessages,
    galleryPhotos: galleryPhotos,
    futureDreams: futureDreams,
    openWhenLetters: openWhenLetters,
    voiceNote: {
      intro: "Bubu, I know today wasn't the easiest day, so I thought I'd stay here with you for a bit. Put on your headphones, close your eyes, and play this."
    },
    finalScreen: {
      title: "Biwipie,",
      letter: [
        "I know today wasn't the best day.",
        "Honestly, I didn't make this because I wanted to fix anything.",
        "I just wanted to spend some time with you. That's all.",
        "And if you smiled even once while looking through this, then I'm happy."
      ],
      signoff: "— Your idiot ❤️"
    }
  };

  const [config, setConfig] = useState(defaultConfig);
  const [isEditing, setIsEditing] = useState(isEditingMode);

  useEffect(() => {
    if (initialConfig) {
      // Merge initialConfig with defaultConfig to ensure new keys exist
      setConfig({
        ...defaultConfig,
        ...initialConfig
      });
    }
  }, [initialConfig]);

  const updateConfig = (section, key, value) => {
    setConfig((prev) => {
      const copy = { ...prev };
      if (key === null) {
        copy[section] = value;
      } else {
        copy[section] = {
          ...copy[section],
          [key]: value
        };
      }
      return copy;
    });
  };

  const updateTimelineItem = (id, field, value) => {
    setConfig((prev) => {
      const updatedTimeline = prev.timeline.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, timeline: updatedTimeline };
    });
  };

  const updateThingsILoveItem = (id, field, value) => {
    setConfig((prev) => {
      const updatedItems = prev.thingsILove.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, thingsILove: updatedItems };
    });
  };

  const updateMoodComfortItem = (mood, field, value) => {
    setConfig((prev) => {
      const updatedMood = {
        ...prev.moodGarden,
        [mood]: {
          ...prev.moodGarden[mood],
          [field]: value
        }
      };
      return { ...prev, moodGarden: updatedMood };
    });
  };

  const updateStarMessageItem = (index, value) => {
    setConfig((prev) => {
      const updatedMessages = [...prev.starMessages];
      updatedMessages[index] = value;
      return { ...prev, starMessages: updatedMessages };
    });
  };

  const updateGalleryPhotoItem = (id, field, value) => {
    setConfig((prev) => {
      const updatedPhotos = prev.galleryPhotos.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, galleryPhotos: updatedPhotos };
    });
  };

  const updateFutureDreamItem = (id, field, value) => {
    setConfig((prev) => {
      const updatedDreams = prev.futureDreams.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, futureDreams: updatedDreams };
    });
  };

  const updateOpenWhenLetterItem = (id, field, value) => {
    setConfig((prev) => {
      const updatedLetters = prev.openWhenLetters.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, openWhenLetters: updatedLetters };
    });
  };

  return (
    <CustomConfigContext.Provider
      value={{
        config,
        setConfig,
        isEditing,
        setIsEditing,
        updateConfig,
        updateTimelineItem,
        updateThingsILoveItem,
        updateMoodComfortItem,
        updateStarMessageItem,
        updateGalleryPhotoItem,
        updateFutureDreamItem,
        updateOpenWhenLetterItem,
        instance
      }}
    >
      {children}
    </CustomConfigContext.Provider>
  );
}
