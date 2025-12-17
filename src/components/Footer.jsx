import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-card border-t border-white/5 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-xl font-heading font-bold italic mb-4">
                    ROJADIRECTA<span className="text-primary">ENVIVO</span>
                </h2>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-6">
                    Ver deportes en vivo online gratis. Fútbol, baloncesto, tenis y más.
                    La mejor calidad en HD para todos los dispositivos.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-primary transition-colors">DMCA</a>
                    <a href="#" className="hover:text-primary transition-colors">Contacto</a>
                    <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
                </div>
                <p className="text-gray-600 text-xs mt-8">
                    &copy; {new Date().getFullYear()} Rojadirectaenvivo.live. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
