"use client"
import React, { useEffect } from 'react';

const loading: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'radial-gradient(circle, rgba(20, 20, 40, 1) 0%, rgba(0, 0, 0, 1) 70%)',  // Space-themed background
    position: 'relative',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden',  // Preventing overflow of floating elements
  };

  // Darker moon style with smooth scaling animation
  const moonStyle: React.CSSProperties = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(165deg, rgba(80,80,80,1) 0%, rgba(140, 140, 140, 1) 40%, rgba(50, 50, 50, 1) 98%, rgba(10, 10, 10, 1) 100%)',
    position: 'absolute',
    animation: 'rotate 5s linear infinite, pulse 2s alternate infinite, scale 6s ease-in-out infinite', // Added smoother scale effect
    boxShadow: '0 -10px 20px 20px #ffffff40 inset, 0 -5px 15px 10px #ffffff50 inset, 0 -2px 5px #ffffff80 inset, 0 -3px 2px #ffffffBB inset, 0 2px 0px #ffffff, 0 2px 3px #ffffff, 0 5px 5px #ffffff90, 0 10px 15px #ffffff60, 0 10px 20px 20px #ffffff40',  // Enhanced shadow
    filter: 'blur(3px)',  // Stronger blur effect
    zIndex: 1,
  };


  // Creating background stars dynamically
  const stars: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    animation: 'stars 3s ease-out infinite',
    transformOrigin: 'center center',
  };

  useEffect(() => {
    // Create the @keyframes for the animations
    const styleSheet = document.styleSheets[0];

    styleSheet.insertRule(`
      @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }
    `, styleSheet.cssRules.length);

    styleSheet.insertRule(`
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.2);
        }
      }
    `, styleSheet.cssRules.length);

    styleSheet.insertRule(`
      @keyframes scale {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
    `, styleSheet.cssRules.length);

    styleSheet.insertRule(`
      @keyframes stars {
        0% {
          transform: scale(0.8);
        }
        100% {
          transform: scale(1.2);
        }
      }
    `, styleSheet.cssRules.length);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={moonStyle}></div>
      <div 
  className="z-10 font-Acme text-xl md:text-2xl xl:text-3xl font-semibold text-zinc-950" 
  style={{
    WebkitTextStroke: '0.2px white',
    color: 'transparent',
    WebkitTextFillColor: 'blavk'
  }}
>
  Loading the Universe...
</div>

      {/* Floating Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i}
          style={{
            ...stars,
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }} 
        />
      ))}
    </div>
  );
};

export default loading;
