import React from 'react';
import { Link } from 'react-router-dom';
import { seoArticles } from '../data/seoArticles';

const Footer = () => {
    return (
        <footer className="bg-card border-t border-white/5 py-12 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="text-xl font-heading font-bold italic">
                            ROJADIRECTA<span className="text-primary">ENVIVO</span>
                        </Link>
                        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                            Ver deportes en vivo online gratis. Fútbol, baloncesto, tenis, F1 y más eventos deportivos en directo HD.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Deportes</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/?category=Football" className="text-gray-400 hover:text-primary transition-colors">Fútbol</Link></li>
                            <li><Link to="/?category=Basketball" className="text-gray-400 hover:text-primary transition-colors">Baloncesto / NBA</Link></li>
                            <li><Link to="/?category=Tennis" className="text-gray-400 hover:text-primary transition-colors">Tenis</Link></li>
                            <li><Link to="/?category=American Football" className="text-gray-400 hover:text-primary transition-colors">NFL</Link></li>
                            <li><Link to="/?category=Motorsport" className="text-gray-400 hover:text-primary transition-colors">Fórmula 1</Link></li>
                        </ul>
                    </div>

                    {/* SEO Articles */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Artículos</h4>
                        <ul className="space-y-2 text-sm">
                            {seoArticles.slice(0, 5).map(article => (
                                <li key={article.id}>
                                    <Link
                                        to={`/articulo/${article.id}`}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {article.title.split(' - ')[0]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">DMCA</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Términos de Uso</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                </div>

                {/* SEO Text Block */}
                <div className="border-t border-white/5 pt-8 mb-8">
                    <p className="text-gray-500 text-xs leading-relaxed max-w-4xl">
                        <strong className="text-gray-400">Rojadirecta En Vivo</strong> es tu portal de streaming deportivo gratuito.
                        Ver fútbol online gratis nunca fue tan fácil. Ofrecemos partidos en vivo de La Liga, Premier League,
                        Champions League, NBA, Fórmula 1, UFC y mucho más. Nuestra plataforma es la mejor alternativa a
                        rojadirecta, roja directa, tarjeta roja y otros sitios de deportes en vivo. Disfruta de transmisiones
                        en HD sin necesidad de registro. Rojadirecta TV online gratis para ver fútbol en directo.
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-center border-t border-white/5 pt-6">
                    <p className="text-gray-600 text-xs">
                        &copy; {new Date().getFullYear()} Rojadirectaenvivo.live - Ver Deportes en Vivo Online Gratis
                    </p>
                    <p className="text-gray-700 text-xs mt-1">
                        Todos los streams son proporcionados por terceros. No alojamos ningún contenido.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
