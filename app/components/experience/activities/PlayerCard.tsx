interface PlayerCardProps {
  src: string;
}

const PlayerCard = ({ src }: PlayerCardProps) => {
  return (
    <img 
      src={src} 
      alt="animation"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
    />
  );
};

export default PlayerCard;
