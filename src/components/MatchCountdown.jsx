import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Bell, Play } from 'lucide-react';

const MatchCountdown = ({ startsAt, matchName, poster, onStreamReady }) => {
    const [timeLeft, setTimeLeft] = useState({});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000);
            const difference = startsAt - now;
            const thirtyMinutes = 30 * 60; // 30 minutes in seconds

            // Stream is ready 30 minutes before start
            if (difference <= thirtyMinutes) {
                setIsReady(true);
                onStreamReady && onStreamReady(true);
                return null;
            }

            const days = Math.floor(difference / (60 * 60 * 24));
            const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((difference % (60 * 60)) / 60);
            const seconds = difference % 60;

            return { days, hours, minutes, seconds, total: difference };
        };

        // Initial check
        const initial = calculateTimeLeft();
        if (initial) setTimeLeft(initial);

        const timer = setInterval(() => {
            const result = calculateTimeLeft();
            if (result) {
                setTimeLeft(result);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startsAt, onStreamReady]);

    if (isReady) {
        return null; // Will show iframe instead
    }

    const formatDate = () => {
        return new Date(startsAt * 1000).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {/* Background Image with Strong Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
                style={{ backgroundImage: `url(${poster})` }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 py-12">
                {/* Match Title */}
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                    {matchName}
                </h2>

                {/* Countdown Timer */}
                <div className="flex justify-center gap-4 md:gap-6 mb-8">
                    {/* Days */}
                    {timeLeft.days > 0 && (
                        <div className="flex flex-col items-center">
                            <div className="bg-card/80 backdrop-blur border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                                <span className="text-3xl md:text-5xl font-heading font-bold text-primary">
                                    {String(timeLeft.days).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="text-gray-400 text-xs md:text-sm mt-2 uppercase tracking-wider">Días</span>
                        </div>
                    )}

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <div className="bg-card/80 backdrop-blur border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                            <span className="text-3xl md:text-5xl font-heading font-bold text-primary">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-gray-400 text-xs md:text-sm mt-2 uppercase tracking-wider">Horas</span>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center text-3xl md:text-5xl text-primary font-bold self-start mt-3 md:mt-4">:</div>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                        <div className="bg-card/80 backdrop-blur border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                            <span className="text-3xl md:text-5xl font-heading font-bold text-white">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-gray-400 text-xs md:text-sm mt-2 uppercase tracking-wider">Minutos</span>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center text-3xl md:text-5xl text-primary font-bold self-start mt-3 md:mt-4">:</div>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                        <div className="bg-card/80 backdrop-blur border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                            <span className="text-3xl md:text-5xl font-heading font-bold text-white">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-gray-400 text-xs md:text-sm mt-2 uppercase tracking-wider">Segundos</span>
                    </div>
                </div>

                {/* Match Date */}
                <div className="flex items-center justify-center text-gray-300 mb-6">
                    <Calendar className="w-5 h-5 mr-2 text-secondary" />
                    <span className="capitalize">{formatDate()}</span>
                </div>

                {/* Info Message */}
                <div className="bg-secondary/20 border border-secondary/30 rounded-lg px-6 py-4 inline-flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-secondary" />
                    <span className="text-secondary text-sm md:text-base">
                        La transmisión estará disponible 30 minutos antes del inicio
                    </span>
                </div>

                {/* Reminder Button */}
                <div className="mt-8">
                    <button className="bg-card hover:bg-white/10 text-white px-6 py-3 rounded-full flex items-center mx-auto border border-white/10 transition-all group">
                        <Bell className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                        Recordarme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchCountdown;
