import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { getAllMatches, formatMatchTime } from '../utils/dataHelpers';
import { ArrowLeft, Share2, AlertTriangle, Tv, Users, Calendar } from 'lucide-react';
import MatchCard from '../components/MatchCard';

const Player = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [relatedMatches, setRelatedMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStream, setActiveStream] = useState(null);

    useEffect(() => {
        const loadMatch = async () => {
            setLoading(true);
            const data = await fetchEvents();
            if (data) {
                const all = getAllMatches(data);
                const found = all.find(m => m.id.toString() === id);
                if (found) {
                    setMatch(found);
                    setActiveStream({ name: 'Principal', url: found.iframe });

                    // Related: Same Category
                    const related = all.filter(m => m.categoryName === found.categoryName && m.id !== found.id).slice(0, 4);
                    setRelatedMatches(related);
                }
            }
            setLoading(false);
        };
        loadMatch();
        // Scroll to top
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-background text-primary">Cargando...</div>;
    if (!match) return <div className="h-screen flex items-center justify-center bg-background text-white">Evento no encontrado.</div>;

    const isLive = match.starts_at <= Math.floor(Date.now() / 1000) && match.ends_at > Math.floor(Date.now() / 1000);

    return (
        <div className="bg-background min-h-screen">
            {/* Player Container */}
            <div className="w-full bg-black relative group">
                <div className="aspect-video w-full md:max-w-7xl mx-auto bg-black relative">
                    {activeStream ? (
                        <iframe
                            src={activeStream.url}
                            className="w-full h-full border-none"
                            allowFullScreen
                            scrolling="no"
                            allow="autoplay; encrypted-media"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-500">Seleccione una opción para ver.</p>
                        </div>
                    )}
                </div>

                {/* Back Button Overlay */}
                <Link to="/" className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Match Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-card px-2 py-0.5 rounded text-xs text-secondary border border-white/10">{match.categoryName}</span>
                            {isLive ? (
                                <span className="bg-live text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">EN VIVO</span>
                            ) : (
                                <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">PRÓXIMAMENTE</span>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">{match.name}</h1>
                        <div className="text-gray-400 text-sm mt-1 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> {formatMatchTime(match.starts_at)}
                            {match.tag && <span className="ml-4 flex items-center text-primary"><Tv className="w-4 h-4 mr-1" /> {match.tag}</span>}
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex gap-2">
                        <button className="bg-card hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center border border-white/10 transition-colors">
                            <Share2 className="w-4 h-4 mr-2" /> Compartir
                        </button>
                        <button className="bg-card hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center border border-white/10 transition-colors">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Reportar
                        </button>
                    </div>
                </div>

                {/* Stream Sources */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Opciones de Reproducción</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveStream({ name: 'Principal', url: match.iframe })}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${activeStream?.name === 'Principal' ? 'bg-primary text-black' : 'bg-card text-white hover:bg-white/10 border border-white/10'}`}
                        >
                            Stream Principal (HD)
                        </button>
                        {match.substreams && match.substreams.map((sub, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveStream({ name: `Opción ${idx + 2}`, url: sub.iframe })} // Assuming substream has iframe
                                className="px-4 py-2 rounded-lg text-sm font-bold bg-card text-white hover:bg-white/10 border border-white/10 flex items-center hover:border-primary/50 transition-all"
                            >
                                Stream {idx + 2} (Alt)
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recommended */}
                {relatedMatches.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-heading font-bold mb-4 border-l-4 border-primary pl-3">También te puede interesar</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedMatches.map(m => (
                                <MatchCard key={m.id} match={m} isLive={m.starts_at <= Math.floor(Date.now() / 1000) && m.ends_at > Math.floor(Date.now() / 1000)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Player;
