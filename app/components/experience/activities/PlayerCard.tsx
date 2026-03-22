import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

interface PlayerCardProps {
  src: string;
}

const PlayerCard = ({ src }: PlayerCardProps) => {
  return (
    <Player
      src={src}
      autoplay
      loop
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PlayerCard;
