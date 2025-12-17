import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <nav className="bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-heading font-bold italic tracking-tighter text-white flex items-center">
                    <img src="/logo.png" alt="Rojadirecta" className="h-10 w-10 object-contain mr-2" />
                    ROJADIRECTA<span className="text-primary">ENVIVO</span>
                </Link>

                {/* Desktop Search */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center bg-card rounded-full px-4 py-2 border border-white/10 focus-within:border-primary transition-colors w-96">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Buscar equipos, ligas..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-card border-b border-white/10 p-4">
                    <form onSubmit={handleSearch} className="flex items-center bg-background rounded-full px-4 py-3 border border-white/10">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="bg-transparent border-none outline-none text-white w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
