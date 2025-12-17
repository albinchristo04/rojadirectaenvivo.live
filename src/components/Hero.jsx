import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Tv } from 'lucide-react';
import { formatMatchTime } from '../utils/dataHelpers';

const Hero = ({ match }) => {
    if (!match) return null;

    const isLive = match.starts_at <= Math.floor(Date.now() / 1000) && match.ends_at > Math.floor(Date.now() / 1000);

    return (
        <div className="relative w-full h-[60vh] md:h-[500px] overflow-hidden flex items-center justify-center bg-black group">
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 blur-sm"
                style={{ backgroundImage: `url(${match.poster})` }}
            ></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-black/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col justify-end h-full pb-16">
                <div className="max-w-3xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="bg-card/80 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-white/10 text-primary">
                            {match.categoryName}
                        </span>
                        {isLive && (
                            <span className="bg-live px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                                EN VIVO
                            </span>
                        )}
                        <span className="flex items-center text-gray-300 text-sm">
                            <Tv className="w-4 h-4 mr-1" /> {match.tag || 'HD'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 leading-tight">
                        {match.name}
                    </h1>

                    <div className="flex items-center text-gray-300 mb-8 space-x-4">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-primary" />
                            <span className="text-lg">{formatMatchTime(match.starts_at)}</span>
                        </div>
                    </div>

                    <Link
                        to={`/event/${match.id}`}
                        className="inline-flex items-center bg-primary hover:bg-primary-hover text-black font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,148,0.4)]"
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Ver Ahora
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
