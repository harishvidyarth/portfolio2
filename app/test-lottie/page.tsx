'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import karateAnimation from '../../public/lottie/karate.json';
import musicAnimation from '../../public/lottie/music.json';

export default function TestLottie() {
  const karateRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (karateRef.current) {
      lottie.loadAnimation({
        container: karateRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: karateAnimation,
      });
    }
  }, []);

  useEffect(() => {
    if (musicRef.current) {
      lottie.loadAnimation({
        container: musicRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: musicAnimation,
      });
    }
  }, []);

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
          <div 
            ref={karateRef} 
            style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }} 
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Music</h2>
          <div 
            ref={musicRef} 
            style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }} 
          />
        </div>
      </div>
    </div>
  );
}
