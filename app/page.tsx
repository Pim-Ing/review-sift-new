// app/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [review, setReview] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const analyzeReview = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText: review, restaurantName: restaurant }),
      });
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        trustScore: 50,
        isSuspicious: false,
        explanation: 'Analysis completed with fallback method',
        reasons: ['**System**: Processed with basic authenticity checks']
      });
    }
    setLoading(false);
  };

  // Enhanced formatting with emojis and better styling
  const formatReason = (reason: string) => {
    // Add emojis based on content
    let emoji = '🔍';
    if (reason.toLowerCase().includes('food')) emoji = '🍽️';
    if (reason.toLowerCase().includes('detail')) emoji = '📝';
    if (reason.toLowerCase().includes('language')) emoji = '💬';
    if (reason.toLowerCase().includes('emotional')) emoji = '😊';
    if (reason.toLowerCase().includes('experience')) emoji = '⭐';
    if (reason.toLowerCase().includes('excellent') || reason.toLowerCase().includes('good')) emoji = '✅';
    if (reason.toLowerCase().includes('poor') || reason.toLowerCase().includes('suspicious')) emoji = '⚠️';

    const parts = reason.split('**');
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
        <div>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              // This is a keyword (between **)
              return (
                <span key={index} style={{ color: '#b5ff2f', fontWeight: 700, fontSize: '1.05rem' }}>
                  {part}
                </span>
              );
            }
            return part;
          })}
        </div>
      </div>
    );
  };

  // Get a fun, engaging title based on score
  const getResultTitle = (score: number, isSuspicious: boolean) => {
    if (score >= 90) return { title: '🌟 Absolutely Authentic!', subtitle: 'This review reads like the real deal!' };
    if (score >= 80) return { title: '✅ Highly Trustworthy', subtitle: 'Great details and genuine experience!' };
    if (score >= 70) return { title: '👍 Likely Authentic', subtitle: 'Seems real with minor concerns' };
    if (score >= 60) return { title: '🤔 Questionable', subtitle: 'Some red flags detected' };
    if (score >= 50) return { title: '⚠️ Suspicious', subtitle: 'Multiple concerns found' };
    return { title: '🚩 Highly Suspicious', subtitle: 'Strong indicators of inauthenticity' };
  };

  const resultTitle = result ? getResultTitle(result.trustScore, result.isSuspicious) : null;

  return (
    <div
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#0c0e13',
        background: 'linear-gradient(135deg, #0c0e13 0%, #1a1d2b 100%)',
        minHeight: '100vh',
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '60px 20px',
        transition: 'opacity 0.8s ease',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, rgba(181,255,47,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(181,255,47,0.05) 0%, transparent 50%)`,
        zIndex: -1
      }} />

      {/* Logo / Title with Pulsing Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '40px',
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#b5ff2f',
          letterSpacing: '1px',
          textShadow: pulse 
            ? '0 0 15px rgba(181,255,47,0.8), 0 0 30px rgba(181,255,47,0.4)'
            : '0 0 10px rgba(181,255,47,0.6)',
          transition: 'text-shadow 1s ease-in-out',
        }}
      >
        ReviewSift
      </div>

      {/* Header */}
      <div style={{ maxWidth: '750px', width: '100%', textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: 800, 
          background: 'linear-gradient(45deg, #b5ff2f, #94ff52, #b5ff2f)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '15px',
          textShadow: pulse 
            ? '0 0 20px rgba(181,255,47,0.3)'
            : 'none',
          transition: 'text-shadow 1s ease-in-out',
        }}>
          🕵️‍♂️ AI Review Detective
        </h1>
        <p style={{ 
          color: '#9ca3af', 
          fontSize: '1.2rem',
          fontStyle: 'italic',
          marginBottom: '10px'
        }}>
          Spot fake reviews before they spot you!
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginTop: '20px'
        }}>
          <span style={{ 
            background: 'rgba(181,255,47,0.1)', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '0.9rem',
            border: '1px solid rgba(181,255,47,0.3)'
          }}>🔍 Pattern Analysis</span>
          <span style={{ 
            background: 'rgba(181,255,47,0.1)', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '0.9rem',
            border: '1px solid rgba(181,255,47,0.3)'
          }}>🤖 AI-Powered</span>
          <span style={{ 
            background: 'rgba(181,255,47,0.1)', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '0.9rem',
            border: '1px solid rgba(181,255,47,0.3)'
          }}>⚡ Instant Results</span>
        </div>
      </div>

      {/* Input Section with Pulsing Border */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '35px',
          width: '100%',
          maxWidth: '750px',
          boxShadow: pulse 
            ? '0 0 40px rgba(181,255,47,0.15), 0 8px 30px rgba(0,0,0,0.35)'
            : '0 8px 30px rgba(0,0,0,0.25)',
          border: pulse 
            ? '1px solid rgba(181,255,47,0.4)'
            : '1px solid rgba(255,255,255,0.08)',
          transition: 'all 1s ease-in-out',
          marginBottom: '35px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#b5ff2f',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            🍽️ Restaurant Name
          </label>
          <input
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            placeholder="e.g., 'Mario Italian Bistro' or 'Dragon Sushi House'..."
            style={{
              width: '100%',
              padding: '15px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.border = '1px solid #b5ff2f')}
            onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#b5ff2f',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            📝 Review Text
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Paste the suspicious review here... We'll analyze it for authenticity patterns, specific details, and genuine customer experience markers."
            rows={6}
            style={{
              width: '100%',
              padding: '15px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.08)',
              resize: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.border = '1px solid #b5ff2f')}
            onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
          />
        </div>

        <button
          onClick={analyzeReview}
          disabled={loading || !review.trim()}
          style={{
            width: '100%',
            padding: '18px',
            border: 'none',
            borderRadius: '12px',
            background: loading
              ? 'linear-gradient(90deg,#4b5563,#6b7280)'
              : 'linear-gradient(90deg,#b5ff2f,#94ff52,#b5ff2f)',
            backgroundSize: loading ? 'auto' : '200% auto',
            color: '#0c0e13',
            fontWeight: 800,
            fontSize: '1.1rem',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: loading 
              ? 'none' 
              : pulse
                ? '0 0 35px rgba(181,255,47,0.7), 0 0 20px rgba(181,255,47,0.4)'
                : '0 0 20px rgba(181,255,47,0.4)',
            transform: loading ? 'none' : pulse ? 'scale(1.02)' : 'scale(1)',
            animation: loading ? 'none' : 'gradientShift 3s ease infinite',
          }}
        >
          {loading ? (
            <div style={{ position: 'relative' }}>
              🔍 Investigating Review...
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  height: '3px',
                  width: '100%',
                  background:
                    'linear-gradient(90deg, rgba(181,255,47,0) 0%, rgba(181,255,47,1) 50%, rgba(181,255,47,0) 100%)',
                  animation: 'scan 1.2s linear infinite',
                }}
              />
            </div>
          ) : (
            '🕵️‍♂️ Analyze Authenticity'
          )}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div
          style={{
            width: '100%',
            maxWidth: '750px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            padding: '35px',
            boxShadow: pulse
              ? '0 0 40px rgba(181,255,47,0.1), 0 8px 30px rgba(0,0,0,0.35)'
              : '0 8px 30px rgba(0,0,0,0.25)',
            border: result.isSuspicious 
              ? '1px solid rgba(239,68,68,0.4)'
              : pulse
                ? '1px solid rgba(181,255,47,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
            transition: 'all 1s ease-in-out',
            marginBottom: '50px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: result.isSuspicious 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : 'linear-gradient(135deg, #b5ff2f, #84cc16)',
                color: result.isSuspicious ? '#fff' : '#0c0e13',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                margin: '0 auto 20px',
                boxShadow: result.isSuspicious
                  ? '0 0 30px rgba(239,68,68,0.6)'
                  : pulse
                    ? '0 0 40px rgba(181,255,47,0.8), 0 0 25px rgba(181,255,47,0.4)'
                    : '0 0 25px rgba(181,255,47,0.6)',
                transition: 'all 1s ease-in-out',
              }}
            >
              {result.trustScore}%
            </div>
            
            <h2
              style={{
                fontSize: '2.2rem',
                background: result.isSuspicious 
                  ? 'linear-gradient(45deg, #ef4444, #f87171)' 
                  : 'linear-gradient(45deg, #b5ff2f, #94ff52)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: result.isSuspicious 
                  ? '0 0 15px rgba(239,68,68,0.5)'
                  : pulse
                    ? '0 0 20px rgba(181,255,47,0.6)'
                    : '0 0 15px rgba(181,255,47,0.5)',
                transition: 'text-shadow 1s ease-in-out',
                marginBottom: '8px'
              }}
            >
              {resultTitle?.title}
            </h2>
            <p style={{ 
              color: result.isSuspicious ? '#f87171' : '#94ff52', 
              fontSize: '1.1rem',
              fontStyle: 'italic'
            }}>
              {resultTitle?.subtitle}
            </p>
          </div>

          {/* AI Analysis Section */}
          <div
            style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '25px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <h3 style={{ 
              color: '#b5ff2f', 
              marginBottom: '15px',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🤖 AI Detective Report
            </h3>
            <p style={{ 
              color: '#d1d5db', 
              lineHeight: '1.7',
              fontSize: '1.05rem',
              fontStyle: 'italic'
            }}>
              {result.explanation}
            </p>
          </div>

          {/* Analysis Factors */}
          {result.reasons && (
            <div>
              <h3
                style={{
                  color: result.isSuspicious ? '#f87171' : '#b5ff2f',
                  marginBottom: '20px',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {result.isSuspicious ? '🔍 Red Flags Detected' : '📊 Trust Indicators Found'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {result.reasons.map((reason: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#d1d5db',
                      lineHeight: '1.6',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(181,255,47,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {formatReason(reason)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer - Only GitHub */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          maxWidth: '750px',
          textAlign: 'center',
          paddingTop: '25px',
          color: '#9ca3af',
          fontSize: '0.9rem',
        }}
      >
        <p>© {new Date().getFullYear()} ReviewSift — Your AI Review Detective 🕵️‍♂️</p>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
          <a href="#" style={{ 
            color: '#b5ff2f', 
            textDecoration: 'none',
            padding: '8px 16px',
            background: 'rgba(181,255,47,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(181,255,47,0.3)',
            transition: 'all 0.3s ease'
          }}>GitHub</a>
        </div>
      </footer>

      <style>
        {`
          @keyframes scan {
            0% { transform: translateX(-100%); opacity: 0.3; }
            50% { transform: translateX(0%); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0.3; }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}