import React from 'react';
import Lottie from 'lottie-react';

interface PlayerCardProps {
  src: object;
}

const PlayerCard = ({ src }: PlayerCardProps) => {
  return (
    <Lottie
      animationData={src}
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PlayerCard;
