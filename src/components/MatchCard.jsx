import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Clock, Timer } from 'lucide-react';
import { formatMatchTime } from '../utils/dataHelpers';
import { useCountdown } from '../hooks/useCountdown';

const MatchCard = ({ match, isLive }) => {
    const countdown = useCountdown(match.starts_at);
    const now = Math.floor(Date.now() / 1000);
    const isUpcoming = match.starts_at > now;

    return (
        <Link
            to={`/event/${match.id}`}
            className="group block relative bg-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,148,0.1)]"
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={match.poster}
                    alt={match.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80" />

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 text-black p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-current" />
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    {isLive ? (
                        <div className="bg-live text-white text-xs font-bold px-2 py-1 rounded flex items-center animate-pulse shadow-[0_0_10px_rgba(255,45,45,0.5)]">
                            <span className="w-2 h-2 bg-white rounded-full mr-1" />
                            EN VIVO
                        </div>
                    ) : (
                        <div className="bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-white/10">
                            {match.tag || 'HD'}
                        </div>
                    )}
                </div>

                {/* Countdown Badge for Upcoming */}
                {isUpcoming && (
                    <div className="absolute bottom-2 right-2 bg-secondary/90 text-black text-xs font-bold px-2 py-1 rounded flex items-center">
                        <Timer className="w-3 h-3 mr-1" />
                        {countdown}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-secondary text-xs font-bold uppercase tracking-wider">{match.categoryName}</span>
                    {isLive && match.viewers && parseInt(match.viewers) > 0 && (
                        <span className="flex items-center text-xs text-gray-400">
                            <Users className="w-3 h-3 mr-1" /> {match.viewers}
                        </span>
                    )}
                </div>

                <h3 className="text-white font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {match.name}
                </h3>

                {!isLive && (
                    <div className="flex items-center text-gray-400 text-xs mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatMatchTime(match.starts_at)}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MatchCard;
