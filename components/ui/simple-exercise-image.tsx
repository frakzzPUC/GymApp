import React, { useState } from 'react';
import Image from 'next/image';

interface SimpleExerciseImageProps {
  exercise: {
    name: string;
    gifUrl?: string;
    bodyPart?: string;
  };
  className?: string;
}

export default function SimpleExerciseImage({ 
  exercise, 
  className = "" 
}: SimpleExerciseImageProps) {
  const [imageError, setImageError] = useState(false);
  
  const getBodyPartIcon = (bodyPart: string): string => {
    const icons: Record<string, string> = {
      chest: '🫁',
      back: '🔙',
      shoulders: '💪',
      arms: '💪',
      legs: '🦵',
      abs: '🔥',
      core: '🔥',
      cardio: '❤️',
      'upper arms': '💪',
      'upper legs': '🦵',
      'lower arms': '💪',
      'lower legs': '🦵',
      waist: '⭕',
    };
    return icons[bodyPart?.toLowerCase()] || '🏋️‍♂️';
  };
  
  // Se não há GIF ou ocorreu erro, mostrar placeholder
  if (!exercise.gifUrl || imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <div className="text-3xl mb-2">
            {exercise.bodyPart ? getBodyPartIcon(exercise.bodyPart) : '🏋️‍♂️'}
          </div>
          <div className="text-sm font-medium">{exercise.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={exercise.gifUrl}
        alt={exercise.name}
        fill
        className="object-contain bg-gray-50" // Mudou de object-cover para object-contain
        onError={() => setImageError(true)}
        unoptimized // Para permitir GIFs externos
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}