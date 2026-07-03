import React, { useState, useEffect, useRef } from 'react';
import { WalkthroughFeatureId } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  featureId: WalkthroughFeatureId | null;
  onClose: () => void;
}

interface MockDialog {
  time: number;
  text: string;
}

const mockDialogs: MockDialog[] = [
  { time: 0, text: 'AI Interviewer: Welcome! Can you describe the difference between TCP and UDP?' },
  { time: 10, text: 'Student: Sure. TCP is connection-oriented, guarantees delivery, and is used for web pages.' },
  { time: 22, text: 'AI Interviewer: Excellent. And what about UDP\'s typical use cases?' },
  { time: 32, text: 'Student: UDP is stateless and faster, ideal for streaming where speed is key.' },
  { time: 40, text: 'AI Interviewer: Spot on! Analyzing your responses for filler words...' }
];

const codingCode = `function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quicksort(left), pivot, ...quicksort(right)];
}

// Executing test cases...
console.log(quicksort([3, 6, 8, 10, 1, 2, 1]));
// Output: [1, 1, 2, 3, 6, 8, 10]
// Status: ALL TESTS PASSED!`;

const technicalLogs = [
  '[INFO] Initializing DBMS Connection Pool...',
  '[INFO] Pool size: 10 connections.',
  '[SUCCESS] Database connection established.',
  '[QUERY] SELECT * FROM students WHERE branch = \'CSE\' AND eligibility = \'TPO_OK\';',
  '[CACHE] Cache miss. Accessing disk storage...',
  '[INFO] Scanning B+ Tree indexes...',
  '[SUCCESS] Query returned 142 records. (Execution time: 4.2ms)',
  '[QUERY] BEGIN TRANSACTION;',
  '[QUERY] UPDATE students SET status = \'PLACED\' WHERE id = \'DTU/2K23/CO/142\';',
  '[SUCCESS] Write-Ahead Logging (WAL) finalized.',
  '[SUCCESS] TRANSACTION COMMITTED. (Status: ACID OK)',
  '[INFO] DB Pool session closed successfully.'
];

const resumeSteps = [
  'Analyzing PDF Document Metadata... Done.',
  'Extracting Section Headers (Skills, Experience, Projects)...',
  'Cross-referencing skills against ATS Keyword Matrix...',
  'Analyzing readability index, font compatibility, and margins...',
  'Computing overall ATS Compatibility Score...',
  'Review Complete! Score: 92% (ATS Compliant • Excellent)'
];

const videoDuration = 45; // 45 seconds length

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, featureId, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80); // 0-100
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen, featureId]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= videoDuration) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return videoDuration;
          }
          return prev + 0.2;
        });
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  if (!isOpen || !featureId) return null;

  const titles: Record<WalkthroughFeatureId, string> = {
    coding: 'Walkthrough: Coding Practice Playground',
    technical: 'Walkthrough: Technical Core Revision Guides',
    mock: 'Walkthrough: AI Mock Technical Interviewer',
    resume: 'Walkthrough: ATS Resume Optimization Scanner'
  };

  const handlePlayPause = () => {
    if (currentTime >= videoDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.min(videoDuration, Math.max(0, (clickX / width) * videoDuration));
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.min(100, Math.max(0, Math.round((clickX / width) * 100)));
    setVolume(newVolume);
  };

  const formatSecs = (time: number) => {
    const secs = Math.floor(time);
    return secs < 10 ? `0${secs}` : `${secs}`;
  };

  const renderFrameContent = () => {
    if (featureId === 'coding') {
      const charCount = Math.floor((currentTime / videoDuration) * codingCode.length);
      const textToRender = codingCode.substring(0, charCount);
      return (
        <div className="player-ide-screen">
          <div className="player-ide-line" style={{ whiteSpace: 'pre-wrap' }}>
            {textToRender}
            <span className="cursor">|</span>
          </div>
        </div>
      );
    }

    if (featureId === 'technical') {
      const linesCount = Math.floor((currentTime / videoDuration) * (technicalLogs.length + 3));
      const visibleLines = technicalLogs.slice(0, Math.min(linesCount, technicalLogs.length));
      return (
        <div className="player-ide-screen" style={{ color: '#34D399' }}>
          {visibleLines.map((line, idx) => (
            <div key={idx} className="player-ide-line">
              {line}
            </div>
          ))}
          {linesCount < technicalLogs.length && (
            <div className="player-ide-line">
              <span className="cursor">_</span>
            </div>
          )}
        </div>
      );
    }

    if (featureId === 'mock') {
      let activeText = mockDialogs[0].text;
      mockDialogs.forEach((dialog) => {
        if (currentTime >= dialog.time) {
          activeText = dialog.text;
        }
      });

      // Simple pseudo-random waveform animation
      return (
        <div className="player-interview-screen">
          <div className="interview-avatar-sim">
            <svg className="interview-avatar-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="voice-wave-container-large">
            {Array.from({ length: 15 }).map((_, idx) => {
              // Standard visualizer bouncing effect
              const height = isPlaying ? Math.floor(Math.sin((currentTime * 5) + idx) * 20) + 30 : 20;
              return <div key={idx} className="voice-large-bar" style={{ height: `${height}px` }} />;
            })}
          </div>
          <div className="interview-subtitles-bubble">{activeText}</div>
        </div>
      );
    }

    if (featureId === 'resume') {
      const stepIndex = Math.floor((currentTime / videoDuration) * resumeSteps.length);
      const scorePercentage = Math.min(Math.floor((currentTime / (videoDuration * 0.85)) * 92), 92);
      return (
        <div className="player-interview-screen" style={{ gap: '14px', padding: '20px' }}>
          <div className="mini-resume-score" style={{ width: '80px', height: '80px' }}>
            <svg className="score-circle-svg" viewBox="0 0 36 36" style={{ width: '80px', height: '80px' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <path strokeDasharray={`${scorePercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="2.5" />
            </svg>
            <span className="score-percent" style={{ fontSize: '18px', color: '#10B981' }}>
              {scorePercentage}%
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {resumeSteps.slice(0, Math.min(stepIndex + 1, resumeSteps.length)).map((step, idx) => (
              <div key={idx} style={{ marginBottom: '6px', ...(step.includes('Complete') ? { color: '#10B981', fontWeight: 700 } : {}) }}>
                {step}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="video-modal-overlay">
      <div className="video-modal-card">
        <div className="video-modal-header">
          <span className="video-modal-title">{titles[featureId] || 'Feature Walkthrough'}</span>
          <button className="video-modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="video-modal-player-screen">
          {currentTime >= videoDuration && (
            <div className="screen-play-overlay" onClick={handlePlayPause}>
              <div className="screen-play-btn-large">▶</div>
            </div>
          )}
          <div className="simulated-player-content">{renderFrameContent()}</div>
        </div>

        <div className="video-modal-controls-row">
          <button className="control-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <div className="video-progress-container" onClick={handleTimelineClick}>
            <div className="video-progress-bar" style={{ width: `${(currentTime / videoDuration) * 100}%` }}></div>
          </div>

          <div className="video-timer">
            0:{formatSecs(currentTime)} / 0:{videoDuration}
          </div>

          <div className="video-volume-flex">
            <svg className="volume-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <div className="volume-slider" onClick={handleVolumeClick}>
              <div className="volume-slider-filled" style={{ width: `${volume}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
