'use client';

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
      <h1 style={{ color: 'white', fontSize: '24px' }}>GIF Test Page</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Karate</h2>
          <img 
            src="/lottie/karate.gif" 
            alt="karate" 
            style={{ width: '200px', height: '200px', borderRadius: '10px' }} 
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Music</h2>
          <img 
            src="/lottie/music.gif" 
            alt="music" 
            style={{ width: '200px', height: '200px', borderRadius: '10px' }} 
          />
        </div>
      </div>
    </div>
  );
}
