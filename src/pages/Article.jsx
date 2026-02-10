import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, seoArticles } from '../data/seoArticles';
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { autoSubmitCurrentPage } from '../services/indexnow';
import BannerAd from '../components/BannerAd';

const Article = () => {
    const { slug } = useParams();
    const article = getArticleById(slug);

    useEffect(() => {
        // Auto-submit to IndexNow on page load
        autoSubmitCurrentPage();
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold text-white mb-4">Artículo no encontrado</h1>
                    <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    // Convert markdown-like content to HTML
    const renderContent = (content) => {
        return content
            .split('\n')
            .map((line, i) => {
                if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl md:text-4xl font-heading font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-heading font-bold text-primary mt-8 mb-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold text-secondary mt-6 mb-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                    return <li key={i} className="text-gray-300 ml-6 mb-1 list-disc">{line.slice(2)}</li>;
                }
                if (line.startsWith('✅') || line.startsWith('✓')) {
                    return <p key={i} className="text-green-400 mb-1">{line}</p>;
                }
                if (line.startsWith('|')) {
                    return null; // Skip table markdown for now
                }
                if (line.startsWith('---')) {
                    return <hr key={i} className="border-white/10 my-8" />;
                }
                if (line.startsWith('*') && line.endsWith('*')) {
                    return <p key={i} className="text-gray-400 italic my-4">{line.slice(1, -1)}</p>;
                }
                if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.')) {
                    return <li key={i} className="text-gray-300 ml-6 mb-1 list-decimal">{line.slice(3)}</li>;
                }
                if (line.trim() === '') {
                    return <br key={i} />;
                }
                // Bold text
                const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
                return <p key={i} className="text-gray-300 mb-3" dangerouslySetInnerHTML={{ __html: boldLine }} />;
            });
    };

    // JSON-LD Structured Data for Article
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.metaTitle,
        "description": article.metaDescription,
        "image": "https://rojadirectaenvivo.live/logo.png",
        "author": {
            "@type": "Organization",
            "name": "Rojadirecta En Vivo"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Rojadirecta En Vivo",
            "logo": {
                "@type": "ImageObject",
                "url": "https://rojadirectaenvivo.live/logo.png"
            }
        },
        "datePublished": article.publishedDate,
        "dateModified": article.modifiedDate,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://rojadirectaenvivo.live/articulo/${article.id}`
        }
    };

    return (
        <>
            {/* SEO Head Tags - injected via useEffect */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-background">
                {/* Hero Header */}
                <div className="bg-gradient-to-b from-card to-background py-12 border-b border-white/5">
                    <div className="container mx-auto px-4">
                        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-primary mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-primary" />
                                {article.modifiedDate}
                            </span>
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-primary" />
                                5 min lectura
                            </span>
                        </div>

                        {/* Keywords Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {article.keywords.slice(0, 5).map((keyword, idx) => (
                                <span key={idx} className="bg-card/50 text-secondary text-xs px-3 py-1 rounded-full border border-white/10">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <article className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Banner Ad - Above Content */}
                    <div className="mb-8 flex justify-center">
                        <BannerAd className="w-full max-w-2xl" />
                    </div>
                    
                    <div className="prose prose-invert prose-lg max-w-none">
                        {renderContent(article.content)}
                    </div>

                    {/* Banner Ad - Below Content */}
                    <div className="my-8 flex justify-center">
                        <BannerAd className="w-full max-w-2xl" />
                    </div>

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Compartir este artículo</h3>
                            <button className="flex items-center bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-full font-bold transition-colors">
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* Related Articles */}
                    <div className="mt-12">
                        {/* Banner Ad - Before Related Articles */}
                        <div className="mb-6 flex justify-center">
                            <BannerAd className="w-full max-w-2xl" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white mb-6 border-l-4 border-primary pl-3">
                            Artículos Relacionados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {seoArticles.filter(a => a.id !== article.id).slice(0, 4).map(relatedArticle => (
                                <Link
                                    key={relatedArticle.id}
                                    to={`/articulo/${relatedArticle.id}`}
                                    className="bg-card rounded-lg p-4 border border-white/5 hover:border-primary/50 transition-all group"
                                >
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                                        {relatedArticle.title}
                                    </h4>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                        {relatedArticle.metaDescription}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </article>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-12 mt-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-heading font-bold text-white mb-4">
                            ¿Listo para ver deportes en vivo?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Accede gratis a todos los partidos de fútbol, NBA, F1 y más
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center bg-primary hover:bg-primary-hover text-black font-bold py-3 px-8 rounded-full text-lg transition-all"
                        >
                            Ver Partidos Ahora
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Article;
