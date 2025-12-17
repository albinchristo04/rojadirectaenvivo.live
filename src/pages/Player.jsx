import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { getAllMatches, formatMatchTime, formatMatchDate } from '../utils/dataHelpers';
import { fetchRelatedNews, fetchHeadToHead, fetchOdds, extractTeams, formatH2HDate } from '../services/sportsData';
import { autoSubmitCurrentPage } from '../services/indexnow';
import {
    ArrowLeft, Share2, AlertTriangle, Tv, Users, Calendar,
    Newspaper, TrendingUp, History, Trophy, ChevronRight,
    ExternalLink, Clock, Zap
} from 'lucide-react';
import MatchCard from '../components/MatchCard';
import MatchCountdown from '../components/MatchCountdown';

const Player = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [relatedMatches, setRelatedMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStream, setActiveStream] = useState(null);
    const [showPlayer, setShowPlayer] = useState(false);

    // New state for enhanced data
    const [news, setNews] = useState([]);
    const [h2h, setH2H] = useState(null);
    const [odds, setOdds] = useState(null);
    const [loadingExtras, setLoadingExtras] = useState(true);

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

                    // Check if stream should be shown (30 min before start or during match)
                    const now = Math.floor(Date.now() / 1000);
                    const thirtyMinBefore = found.starts_at - (30 * 60);
                    setShowPlayer(now >= thirtyMinBefore);

                    // Related: Same Category
                    const related = all.filter(m => m.categoryName === found.categoryName && m.id !== found.id).slice(0, 4);
                    setRelatedMatches(related);

                    // Fetch enhanced data
                    loadEnhancedData(found.name, found.categoryName);
                }
            }
            setLoading(false);
        };

        loadMatch();
        autoSubmitCurrentPage();
        window.scrollTo(0, 0);
    }, [id]);

    const loadEnhancedData = async (matchName, category) => {
        setLoadingExtras(true);
        try {
            const [newsData, h2hData, oddsData] = await Promise.all([
                fetchRelatedNews(matchName, category),
                fetchHeadToHead(matchName, category),
                fetchOdds(matchName)
            ]);

            setNews(newsData);
            setH2H(h2hData);
            setOdds(oddsData);
        } catch (error) {
            console.error('Error loading enhanced data:', error);
        }
        setLoadingExtras(false);
    };

    const handleStreamReady = (ready) => {
        setShowPlayer(ready);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-primary">Cargando partido...</p>
                </div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="h-screen flex items-center justify-center bg-background text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-heading font-bold mb-4">Evento no encontrado</h1>
                    <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    const isLive = match.starts_at <= Math.floor(Date.now() / 1000) && match.ends_at > Math.floor(Date.now() / 1000);
    const teams = extractTeams(match.name);

    return (
        <div className="bg-background min-h-screen">
            {/* Player / Countdown Container */}
            <div className="w-full bg-black relative group">
                <div className="w-full md:max-w-7xl mx-auto bg-black relative">
                    {showPlayer ? (
                        // Show iframe when ready (30 min before or during match)
                        <div className="aspect-video w-full">
                            {activeStream ? (
                                <iframe
                                    src={activeStream.url}
                                    className="w-full h-full border-none"
                                    allowFullScreen
                                    scrolling="no"
                                    allow="autoplay; encrypted-media; fullscreen"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-gray-500">Seleccione una opción para ver.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show countdown when not ready yet
                        <MatchCountdown
                            startsAt={match.starts_at}
                            matchName={match.name}
                            poster={match.poster}
                            onStreamReady={handleStreamReady}
                        />
                    )}
                </div>

                {/* Back Button Overlay */}
                <Link to="/" className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 z-20">
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
                        <div className="text-gray-400 text-sm mt-1 flex items-center flex-wrap gap-4">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" /> {formatMatchTime(match.starts_at)}
                            </span>
                            {match.tag && (
                                <span className="flex items-center text-primary">
                                    <Tv className="w-4 h-4 mr-1" /> {match.tag}
                                </span>
                            )}
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

                {/* Stream Sources - Only show when player is visible */}
                {showPlayer && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Opciones de Reproducción</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setActiveStream({ name: 'Principal', url: match.iframe })}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${activeStream?.name === 'Principal' ? 'bg-primary text-black' : 'bg-card text-white hover:bg-white/10 border border-white/10'}`}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Stream Principal (HD)
                            </button>
                            {match.substreams && match.substreams.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStream({ name: `Opción ${idx + 2}`, url: sub.iframe || sub.url })}
                                    className="px-4 py-2 rounded-lg text-sm font-bold bg-card text-white hover:bg-white/10 border border-white/10 flex items-center hover:border-primary/50 transition-all"
                                >
                                    Stream {idx + 2} (Alt)
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Odds Section */}
                        {odds && (
                            <div className="bg-card rounded-xl p-6 border border-white/5">
                                <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                                    Cuotas y Probabilidades
                                </h3>

                                {/* Match Winner Odds */}
                                <div className="mb-6">
                                    <p className="text-gray-400 text-sm mb-3">Resultado Final</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-background rounded-lg p-4 text-center border border-white/5 hover:border-primary/50 transition-colors cursor-pointer">
                                            <p className="text-gray-400 text-xs mb-1 truncate">{teams.homeTeam}</p>
                                            <p className="text-2xl font-bold text-primary">{odds.markets.matchWinner.home}</p>
                                        </div>
                                        <div className="bg-background rounded-lg p-4 text-center border border-white/5 hover:border-primary/50 transition-colors cursor-pointer">
                                            <p className="text-gray-400 text-xs mb-1">Empate</p>
                                            <p className="text-2xl font-bold text-white">{odds.markets.matchWinner.draw}</p>
                                        </div>
                                        <div className="bg-background rounded-lg p-4 text-center border border-white/5 hover:border-primary/50 transition-colors cursor-pointer">
                                            <p className="text-gray-400 text-xs mb-1 truncate">{teams.awayTeam}</p>
                                            <p className="text-2xl font-bold text-secondary">{odds.markets.matchWinner.away}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Markets */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background rounded-lg p-4 border border-white/5">
                                        <p className="text-gray-400 text-xs mb-2">Más/Menos 2.5 Goles</p>
                                        <div className="flex justify-between">
                                            <span className="text-white">Más: <span className="text-primary font-bold">{odds.markets.overUnder.over25}</span></span>
                                            <span className="text-white">Menos: <span className="text-secondary font-bold">{odds.markets.overUnder.under25}</span></span>
                                        </div>
                                    </div>
                                    <div className="bg-background rounded-lg p-4 border border-white/5">
                                        <p className="text-gray-400 text-xs mb-2">Ambos Equipos Marcan</p>
                                        <div className="flex justify-between">
                                            <span className="text-white">Sí: <span className="text-primary font-bold">{odds.markets.bothTeamsScore.yes}</span></span>
                                            <span className="text-white">No: <span className="text-secondary font-bold">{odds.markets.bothTeamsScore.no}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Head to Head Section */}
                        {h2h && (
                            <div className="bg-card rounded-xl p-6 border border-white/5">
                                <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center">
                                    <History className="w-5 h-5 mr-2 text-secondary" />
                                    Enfrentamientos Directos (H2H)
                                </h3>

                                {/* H2H Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-background rounded-lg p-4 text-center border border-white/5">
                                        <p className="text-3xl font-bold text-primary">{h2h.stats.homeTeamWins}</p>
                                        <p className="text-gray-400 text-xs mt-1 truncate">{teams.homeTeam}</p>
                                    </div>
                                    <div className="bg-background rounded-lg p-4 text-center border border-white/5">
                                        <p className="text-3xl font-bold text-gray-400">{h2h.stats.draws}</p>
                                        <p className="text-gray-400 text-xs mt-1">Empates</p>
                                    </div>
                                    <div className="bg-background rounded-lg p-4 text-center border border-white/5">
                                        <p className="text-3xl font-bold text-secondary">{h2h.stats.awayTeamWins}</p>
                                        <p className="text-gray-400 text-xs mt-1 truncate">{teams.awayTeam}</p>
                                    </div>
                                </div>

                                {/* Previous Matches */}
                                <p className="text-gray-400 text-sm mb-3">Últimos {h2h.matches.length} partidos</p>
                                <div className="space-y-2">
                                    {h2h.matches.map((prevMatch, idx) => (
                                        <div key={idx} className="bg-background rounded-lg p-3 flex items-center justify-between border border-white/5">
                                            <span className="text-gray-500 text-xs w-20">{formatH2HDate(prevMatch.date)}</span>
                                            <div className="flex items-center flex-1 justify-center">
                                                <span className={`text-sm ${prevMatch.homeScore > prevMatch.awayScore ? 'text-primary font-bold' : 'text-gray-300'} truncate max-w-[100px]`}>
                                                    {prevMatch.homeTeam}
                                                </span>
                                                <span className="mx-3 bg-card px-3 py-1 rounded font-bold text-white">
                                                    {prevMatch.homeScore} - {prevMatch.awayScore}
                                                </span>
                                                <span className={`text-sm ${prevMatch.awayScore > prevMatch.homeScore ? 'text-secondary font-bold' : 'text-gray-300'} truncate max-w-[100px]`}>
                                                    {prevMatch.awayTeam}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Match Info Card */}
                        <div className="bg-card rounded-xl p-6 border border-white/5">
                            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center">
                                <Trophy className="w-5 h-5 mr-2 text-primary" />
                                Información del Partido
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Competición</span>
                                    <span className="text-white font-medium">{match.categoryName}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Fecha</span>
                                    <span className="text-white font-medium">{formatMatchTime(match.starts_at)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Canal</span>
                                    <span className="text-primary font-medium">{match.tag || 'HD'}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Estado</span>
                                    <span className={`font-medium ${isLive ? 'text-live' : 'text-secondary'}`}>
                                        {isLive ? 'EN VIVO' : 'Próximamente'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related News */}
                        <div className="bg-card rounded-xl p-6 border border-white/5">
                            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center">
                                <Newspaper className="w-5 h-5 mr-2 text-secondary" />
                                Noticias Relacionadas
                            </h3>

                            {loadingExtras ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-4 bg-white/10 rounded w-full mb-2" />
                                            <div className="h-3 bg-white/5 rounded w-2/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {news.slice(0, 5).map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-background rounded-lg border border-white/5 hover:border-primary/50 transition-colors group"
                                        >
                                            <h4 className="text-white text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-gray-500 text-xs">{item.source}</span>
                                                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-primary" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommended Matches */}
                {relatedMatches.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-heading font-bold mb-4 border-l-4 border-primary pl-3 flex items-center">
                            También te puede interesar
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500" />
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedMatches.map(m => (
                                <MatchCard
                                    key={m.id}
                                    match={m}
                                    isLive={m.starts_at <= Math.floor(Date.now() / 1000) && m.ends_at > Math.floor(Date.now() / 1000)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Player;
