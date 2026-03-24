'use client';

import Lottie from 'lottie-react';
import karateAnimation from '../../public/lottie/karate.json';
import musicAnimation from '../../public/lottie/music.json';

export default function TestLottie() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px',
      padding: '20px'
    }}>
      <h1 style={{ color: 'white', fontSize: '24px' }}>Lottie Test Page</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Karate</h2>
          <Lottie animationData={karateAnimation} loop />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Music</h2>
          <Lottie animationData={musicAnimation} loop />
        </div>
      </div>
    </div>
  );
}
