import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import MatchCard from '../components/MatchCard';
import { fetchEvents } from '../services/api';
import { getAllMatches, getLiveMatches, getUpcomingMatches } from '../utils/dataHelpers';
import { Filter, Loader2 } from 'lucide-react';

const Home = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchEvents();
            if (data) {
                setMatches(getAllMatches(data));
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // Derived Data
    const liveMatches = getLiveMatches(matches);
    const upcomingMatches = getUpcomingMatches(matches);

    // Hero Match: Priority to Live, then First Upcoming
    const heroMatch = liveMatches.length > 0 ? liveMatches[0] : upcomingMatches[0];

    // Filtering
    const categories = ['All', ...new Set(matches.map(m => m.categoryName))].slice(0, 8); // Limit tabs

    const filterMatches = (list) => {
        return list.filter(m => {
            const matchCategory = selectedCategory === 'All' || m.categoryName === selectedCategory;
            const matchSearch = searchQuery
                ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchCategory && matchSearch;
        });
    };

    const filteredUpcoming = filterMatches(upcomingMatches);
    const filteredLive = filterMatches(liveMatches);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Hero Section */}
            {!searchQuery && <Hero match={heroMatch} />}

            <div className="container mx-auto px-4 -mt-10 relative z-20">

                {/* Live Matches Section */}
                {liveMatches.length > 0 && !searchQuery && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
                            <span className="w-2 h-8 bg-live mr-3 rounded-full"></span>
                            EN VIVO AHORA
                            <span className="ml-3 text-sm font-sans font-normal text-gray-400 bg-card px-2 py-1 rounded-full border border-white/10">
                                {liveMatches.length} Eventos
                            </span>
                        </h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                            {liveMatches.map(match => (
                                <div key={match.id} className="min-w-[300px] md:min-w-[350px]">
                                    <MatchCard match={match} isLive={true} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex space-x-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,255,148,0.3)]'
                                        : 'bg-card text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upcoming / Grid */}
                <div>
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-primary" />
                        {searchQuery ? `Resultados para "${searchQuery}"` : 'Próximos Eventos'}
                    </h2>

                    {filteredUpcoming.length === 0 && filteredLive.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No se encontraron eventos.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchQuery && filteredLive.map(match => (
                                <MatchCard key={match.id} match={match} isLive={true} />
                            ))}
                            {filteredUpcoming.map(match => (
                                <MatchCard key={match.id} match={match} isLive={false} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
