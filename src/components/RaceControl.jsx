import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RaceControl = ({ messages, isLive = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!messages || messages.length === 0) {
    return null;
  }

  // Sort messages by date descending (newest first)
  const sortedMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Initially show only 5 messages unless expanded
  const displayMessages = isExpanded ? sortedMessages : sortedMessages.slice(0, 5);
  const hasMore = sortedMessages.length > 5;

  const getFlagColor = (flag) => {
    switch (flag?.toLowerCase()) {
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      case 'red': return 'text-red-500';
      case 'blue': return 'text-blue-400';
      case 'white': return 'text-white';
      case 'black': return 'text-black';
      case 'chequered': return 'text-neutral-100';
      default: return 'text-neutral-400';
    }
  };

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'flag': return 'flag';
      case 'safety car': return 'car-side';
      case 'incident': return 'triangle-exclamation';
      case 'session status': return 'info-circle';
      default: return 'bell';
    }
  };

  return (
    <div className="race-control mt-64 px-8 sm:px-0 w-full overflow-visible">
      <div className="flex items-center justify-between mb-16">
        <h3 className="heading-6 uppercase tracking-widest text-neutral-400 flex items-center gap-8">
          <FontAwesomeIcon icon="tower-broadcast" className="text-plum-400" />
          Race Control
        </h3>
        
        <div className="flex items-center gap-16">
          {isLive && (
            <div className="flex items-center gap-8 px-8 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-8 h-8 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Live</span>
            </div>
          )}
          
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs uppercase tracking-wider text-plum-400 hover:text-plum-300 font-bold transition-colors"
            >
              {isExpanded ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-glow-dark rounded-xlarge overflow-hidden border border-white/5 w-full">
        <div className={classNames(
          "overflow-y-auto custom-scrollbar transition-all duration-300",
          isExpanded ? "max-h-[60rem]" : "max-h-[25rem]"
        )}>
          {displayMessages.map((msg, index) => (
            <div 
              key={index} 
              className={classNames(
                "p-16 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-24 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors",
              )}
            >
              <div className="flex items-center gap-12 sm:w-24 shrink-0">
                <span className="text-xs font-mono text-neutral-500">
                  {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
              </div>
              
              <div className="flex items-center gap-12 sm:w-12 shrink-0 justify-center">
                <FontAwesomeIcon 
                  icon={getIcon(msg.category)} 
                  className={classNames(
                    "text-sm",
                    msg.flag ? getFlagColor(msg.flag) : "text-plum-400"
                  )} 
                />
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
                    {msg.category}
                  </span>
                  <p className="text-sm leading-relaxed text-neutral-200 break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceControl;
