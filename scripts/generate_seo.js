import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_URL = "https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json";
const BASE_URL = "https://rojadirectaenvivo.live";

const BRAND_PAGES = [
    { slug: 'rojadirecta', keyword: 'rojadirecta' },
    { slug: 'roja-directa', keyword: 'roja directa' },
    { slug: 'roja-directa-en-vivo', keyword: 'roja directa en vivo' },
    { slug: 'rojadirecta-futbol', keyword: 'rojadirecta futbol' },
    { slug: 'rojadirecta-espanol', keyword: 'rojadirecta espanol' },
    { slug: 'rojadirecta-gratis', keyword: 'rojadirecta gratis' }
];

const HUB_PAGES = [
    { slug: 'futbol-en-vivo', keyword: 'futbol en vivo' },
    { slug: 'futbol-gratis', keyword: 'futbol gratis' },
    { slug: 'canales-deportivos-en-vivo', keyword: 'canales deportivos en vivo' },
    { slug: 'ver-futbol-online', keyword: 'ver futbol online' },
    { slug: 'liga-espanola-en-vivo', keyword: 'liga espanola en vivo' },
    { slug: 'champions-league-en-vivo', keyword: 'champions league en vivo' }
];

const COMMON_CSS = `
:root {
    --color-background: #0D0D0D;
    --color-card: #161616;
    --color-primary: #00FF94;
    --color-primary-hover: #00CC76;
    --color-live: #FF2D2D;
    --color-secondary: #2DE1FC;
    --font-family-sans: 'Manrope', 'Inter', sans-serif;
    --font-family-heading: 'Oswald', sans-serif;
}
body {
    background-color: var(--color-background);
    color: white;
    font-family: var(--font-family-sans);
    margin: 0;
    padding: 0;
    line-height: 1.6;
}
header {
    background: rgba(13, 13, 13, 0.8);
    backdrop-filter: blur(10px);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo {
    font-family: var(--font-family-heading);
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-primary);
    text-decoration: none;
}
main {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
}
h1, h2, h3 {
    font-family: var(--font-family-heading);
    text-transform: uppercase;
}
h1 { color: var(--color-primary); font-size: 2.5rem; margin-bottom: 1rem; }
h2 { border-left: 4px solid var(--color-primary); padding-left: 1rem; margin-top: 2rem; }
p { margin-bottom: 1.5rem; color: #ccc; }
.card {
    background: var(--color-card);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.btn {
    display: inline-block;
    background: var(--color-primary);
    color: black;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.3s;
}
.btn:hover { background: var(--color-primary-hover); }
footer {
    text-align: center;
    padding: 3rem 1rem;
    background: #050505;
    margin-top: 4rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.faq-item { margin-bottom: 2rem; }
.faq-question { font-weight: bold; color: var(--color-secondary); margin-bottom: 0.5rem; }
.internal-links {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}
.internal-links a {
    color: #888;
    text-decoration: none;
    font-size: 0.9rem;
}
.internal-links a:hover { color: var(--color-primary); }
ul { padding-left: 1.5rem; color: #ccc; }
li { margin-bottom: 0.5rem; }
`;

function getBaseTemplate(title, description, content, canonical, schema = null) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
    <style>${COMMON_CSS}</style>
    ${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}
</head>
<body>
    <header>
        <a href="/" class="logo">ROJADIRECTA ENVIVO</a>
        <nav>
            <a href="/futbol-en-vivo/" style="color: white; text-decoration: none; margin-left: 1rem;">Fútbol</a>
            <a href="/champions-league-en-vivo/" style="color: white; text-decoration: none; margin-left: 1rem;">Champions</a>
        </nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <p>&copy; 2025 Rojadirecta En Vivo - Todos los derechos reservados</p>
        <div class="internal-links">
            <a href="/">Inicio</a>
            ${BRAND_PAGES.map(p => `<a href="/${p.slug}/">${p.keyword}</a>`).join('')}
            ${HUB_PAGES.map(p => `<a href="/${p.slug}/">${p.keyword}</a>`).join('')}
        </div>
    </footer>
</body>
</html>`;
}

function countWords(str) {
    return str.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
}

async function run() {
    console.log("Starting Daily SEO Automation Job...");
    const now = new Date();
    const todayStr = now.toLocaleDateString('es-ES');

    let allEvents = [];
    try {
        const res = await fetch(DATA_URL);
        const data = await res.json();
        const categories = data.events?.streams || [];
        allEvents = categories.flatMap(cat =>
            (cat.streams || []).map(s => ({ ...s, category: cat.category }))
        ).filter(e => e && e.name);
        console.log(`Fetched ${allEvents.length} valid events.`);
    } catch (e) {
        console.error("Failed to fetch events", e);
        process.exit(1);
    }

    // 1. Generate Brand Pages
    console.log("Generating Brand Pages...");
    for (const page of BRAND_PAGES) {
        const title = `${page.keyword.charAt(0).toUpperCase() + page.keyword.slice(1)} En Vivo - Ver Fútbol Gratis HD`;
        const description = `Disfruta de ${page.keyword} en vivo y en directo. La mejor calidad para ver fútbol online gratis sin registro. Actualizado hoy ${todayStr} con todos los partidos.`;

        let content = `<h1>${page.keyword.toUpperCase()} EN VIVO</h1>`;
        content += `<div class="card">
            <p>Bienvenido a la mejor plataforma para ver <strong>${page.keyword}</strong> en vivo. Si estás buscando una forma fiable y gratuita de seguir tus deportes favoritos, has llegado al lugar indicado. En RojadirectaEnvivo nos especializamos en ofrecer transmisiones de alta calidad para todos los fanáticos del fútbol en España y Latinoamérica.</p>
            <p>Nuestra plataforma de ${page.keyword} se actualiza constantemente para garantizar que no te pierdas ni un solo minuto de la acción. Ya sea que sigas la Liga Española, la Champions League o las ligas sudamericanas, aquí encontrarás los enlaces más estables y rápidos.</p>
            <a href="/" class="btn">VER PARTIDOS DE HOY</a>
        </div>`;

        content += `<h2>¿Por qué elegir ${page.keyword} para ver fútbol?</h2>`;
        content += `<p>A diferencia de otros sitios, nuestra versión de ${page.keyword} ofrece una experiencia sin interrupciones y con una interfaz optimizada para dispositivos móviles. No necesitas registrarte ni pagar suscripciones costosas para disfrutar del mejor deporte rey. La accesibilidad es nuestra bandera, permitiendo que cualquier usuario con una conexión a internet pueda sintonizar los encuentros más importantes del día.</p>`;
        content += `<p>Además, contamos con múltiples servidores para cada evento, asegurando que siempre tengas una alternativa en caso de que una señal falle. La calidad HD es nuestra prioridad, permitiéndote ver cada detalle del juego como si estuvieras en el estadio. La tecnología de streaming que utilizamos minimiza el retraso, para que seas el primero en gritar el gol.</p>`;
        content += `<p>En el ecosistema de ${page.keyword}, la seguridad del usuario es fundamental. Por eso, filtramos los enlaces para ofrecerte solo aquellos que son seguros y funcionales. Olvídate de las ventanas emergentes infinitas y disfruta de lo que realmente importa: el fútbol en vivo y en directo.</p>`;

        content += `<h2>Beneficios de nuestra plataforma de ${page.keyword}</h2>`;
        content += `<ul>
            <li>Acceso gratuito a todos los partidos de la jornada.</li>
            <li>Calidad de imagen en Alta Definición (HD) sin cortes.</li>
            <li>Compatibilidad total con Android, iOS, Windows y Smart TV.</li>
            <li>Actualización en tiempo real de los enlaces de transmisión.</li>
            <li>Sin necesidad de registro previo ni datos personales.</li>
        </ul>`;

        content += `<h2>Preguntas Frecuentes sobre ${page.keyword}</h2>`;
        const faqs = [
            { q: `¿Es gratis ver ${page.keyword} aquí?`, a: `Sí, todos nuestros enlaces para ${page.keyword} son totalmente gratuitos y accesibles para todo el mundo sin necesidad de suscripción.` },
            { q: `¿Necesito registrarme para ver los partidos?`, a: `No, en RojadirectaEnvivo puedes acceder a las transmisiones de ${page.keyword} de forma directa y sin registros molestos.` },
            { q: `¿Qué dispositivos son compatibles?`, a: `Puedes ver ${page.keyword} en cualquier dispositivo con navegador web, incluyendo móviles, tablets y ordenadores.` }
        ];
        faqs.forEach(f => {
            content += `<div class="faq-item"><p class="faq-question">${f.q}</p><p>${f.a}</p></div>`;
        });

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
        };

        const dir = path.join(process.cwd(), 'public', page.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(title, description, content, `${BASE_URL}/${page.slug}/`, schema));
    }

    // 2. Generate Hub Pages
    console.log("Generating Hub Pages...");
    for (const page of HUB_PAGES) {
        const title = `${page.keyword.charAt(0).toUpperCase() + page.keyword.slice(1)} - Ver Deportes Online Gratis`;
        const description = `Guía completa para ${page.keyword}. Encuentra los mejores enlaces para ver fútbol en vivo hoy ${todayStr}, canales deportivos y más. HD sin cortes.`;

        let longContent = `<h1>${page.keyword.toUpperCase()}</h1>`;
        longContent += `<div class="card"><p>El mundo del deporte ha evolucionado y hoy en día <strong>${page.keyword}</strong> es una de las búsquedas más frecuentes entre los aficionados que no quieren perderse nada. En esta guía te explicamos cómo sacar el máximo provecho a nuestra plataforma para disfrutar de la mejor experiencia de streaming deportivo en este año 2025.</p></div>`;

        const sections = [
            { h: `Cómo disfrutar de ${page.keyword} sin interrupciones`, p: `Para ver ${page.keyword} de manera óptima, te recomendamos contar con una conexión a internet estable. Nuestra tecnología de streaming se adapta a tu velocidad, pero para disfrutar de la calidad HD, una conexión de al menos 10 Mbps es ideal. Además, el uso de navegadores modernos como Chrome o Firefox garantiza la compatibilidad con todos nuestros reproductores. Evita el uso de aplicaciones en segundo plano que puedan consumir tu ancho de banda durante los partidos más importantes.` },
            { h: `La importancia de ${page.keyword} en la era digital`, p: `La importancia de ${page.keyword} en la actualidad radica en la accesibilidad. Ya no es necesario estar frente a un televisor para seguir a tu equipo. Con nuestra plataforma, puedes llevar la emoción del fútbol en tu bolsillo, accediendo desde tu smartphone o tablet en cualquier lugar del mundo, ya sea en España, México, Argentina o Colombia. La democratización del acceso al deporte es uno de nuestros pilares fundamentales.` },
            { h: `Variedad de competiciones en ${page.keyword}`, p: `En RojadirectaEnvivo, entendemos que la pasión por el fútbol no tiene fronteras. Por eso, cubrimos una amplia gama de competiciones bajo el paraguas de ${page.keyword}. Desde los clásicos europeos como La Liga, Premier League y Serie A, hasta los torneos más emocionantes de la CONMEBOL como la Copa Libertadores y la Sudamericana, nuestra cartelera está diseñada para satisfacer al fanático más exigente que busca calidad y variedad.` },
            { h: `Seguridad y fiabilidad en los enlaces de ${page.keyword}`, p: `Uno de los mayores retos al buscar ${page.keyword} es encontrar sitios seguros. En nuestra web, nos encargamos de verificar cada enlace antes de publicarlo. Esto significa que puedes navegar con tranquilidad, sabiendo que los reproductores son funcionales y que la publicidad se mantiene en niveles mínimos para no entorpecer tu visión del juego. La confianza de nuestros usuarios es lo que nos mantiene como líderes en el sector.` },
            { h: `El futuro del streaming deportivo y ${page.keyword}`, p: `Mirando hacia adelante, el concepto de ${page.keyword} seguirá evolucionando con mejores códecs de video y menor latencia. Estamos comprometidos a implementar las últimas tecnologías para que la experiencia de usuario sea cada vez más inmersiva. El objetivo es que la diferencia entre verlo por televisión tradicional y por nuestro streaming sea imperceptible, ofreciendo siempre la ventaja de la gratuidad y la movilidad.` },
            { h: `Consejos adicionales para ${page.keyword}`, p: `Si experimentas algún retraso, intenta refrescar la página o cambiar de servidor. Contamos con al menos tres opciones de respaldo para cada evento importante. También es recomendable limpiar la caché de tu navegador periódicamente para asegurar un rendimiento fluido. Recuerda que durante eventos de altísima demanda, como un Clásico o una final de Champions, llegar unos minutos antes al enlace puede asegurar una mejor conexión.` }
        ];

        sections.forEach(s => {
            longContent += `<h2>${s.h}</h2><p>${s.p}</p>`;
        });

        longContent += `<h2>Próximos Partidos Destacados</h2><ul>`;
        allEvents.slice(0, 10).forEach(e => {
            const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
            longContent += `<li><a href="/${s}/" style="color: var(--color-secondary);">${e.name}</a> - ${e.time}</li>`;
        });
        longContent += `</ul>`;

        longContent += `<h2>Preguntas Frecuentes sobre ${page.keyword}</h2>`;
        const faqs = [
            { q: `¿Dónde ver ${page.keyword} en vivo?`, a: `Puedes verlo directamente en nuestra web RojadirectaEnvivo.live, donde recopilamos los mejores enlaces de internet actualizados diariamente.` },
            { q: `¿Es legal y gratis?`, a: `Nuestra plataforma facilita el acceso a transmisiones gratuitas que circulan en la red para el disfrute de los aficionados, sin costo alguno.` },
            { q: `¿Qué canales transmiten ${page.keyword}?`, a: `Dependiendo del evento, podrás encontrar señales de ESPN, Fox Sports, Movistar+, DAZN, TyC Sports y muchos más.` },
            { q: `¿Puedo ver ${page.keyword} en mi Smart TV?`, a: `Sí, puedes usar el navegador de tu Smart TV o enviar la señal desde tu móvil usando Chromecast o AirPlay.` }
        ];
        faqs.forEach(f => {
            longContent += `<div class="faq-item"><p class="faq-question">${f.q}</p><p>${f.a}</p></div>`;
        });

        const wordCount = countWords(longContent);
        if (wordCount < 900) {
            console.warn(`Warning: Hub page ${page.slug} has only ${wordCount} words. Adding more content...`);
            longContent += `<h2>Análisis detallado de ${page.keyword} por regiones</h2>`;
            longContent += `<p>En España, la demanda de ${page.keyword} se centra en los partidos de fin de semana, especialmente cuando juegan el Real Madrid o el FC Barcelona. Los aficionados buscan alternativas a las plataformas de pago para disfrutar de la emoción de la liga. Por otro lado, en Latinoamérica, el interés por ${page.keyword} abarca tanto las ligas locales como las competiciones europeas, con un pico de tráfico durante las eliminatorias para el Mundial. Nuestra infraestructura está preparada para soportar estas oleadas de tráfico global, garantizando que todos tengan su lugar en la grada virtual.</p>`;
            longContent += `<p>La comunidad de usuarios de ${page.keyword} es muy activa y siempre está buscando la mejor calidad. Por eso, fomentamos que compartas nuestra web con otros aficionados para que la red de streaming siga creciendo y mejorando. Cuantos más seamos, mejores recursos podremos dedicar a mantener los servidores al 100% de su capacidad.</p>`;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
        };

        const dir = path.join(process.cwd(), 'public', page.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(title, description, longContent, `${BASE_URL}/${page.slug}/`, schema));
    }

    // 3. Generate Match Pages
    console.log("Generating Match Pages...");
    let newPagesCount = 0;
    for (const event of allEvents) {
        try {
            if (!event || !event.name) continue;

            const slug = `ver-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
            const title = `Ver ${event.name} EN VIVO GRATIS | RojaDirectaEnvivo ${todayStr}`;
            const description = `Sigue el partido ${event.name} en vivo y en directo hoy ${todayStr}. Streaming HD sin registro, actualizado hoy. No te pierdas el ${event.name} gratis online.`;

            let matchContent = `<h1>VER ${event.name.toUpperCase()} EN VIVO GRATIS</h1>`;
            matchContent += `<div class="card">
                <p>Hoy se enfrentan <strong>${event.name}</strong> en un duelo que promete ser emocionante. Sigue la transmisión en vivo aquí mismo en RojadirectaEnvivo.</p>
                <p><strong>Fecha:</strong> ${todayStr}<br>
                <strong>Hora:</strong> ${event.time}<br>
                <strong>Competición:</strong> ${event.category}</p>
                <a href="/event/${event.id}" class="btn">IR AL REPRODUCTOR EN VIVO</a>
            </div>`;

            matchContent += `<h2>Previa del Partido: ${event.name}</h2>`;
            matchContent += `<p>El encuentro entre ${event.name} es uno de los más esperados de la jornada en ${event.category}. Ambos equipos llegan con la necesidad de sumar puntos, lo que garantiza un espectáculo ofensivo de primer nivel. En nuestra plataforma te traemos la mejor cobertura para que no te pierdas ningún detalle de lo que ocurra en el terreno de juego.</p>`;
            matchContent += `<p>Si te preguntas cómo ver ${event.name} online de forma gratuita, la respuesta es sencilla: nuestra web ofrece enlaces directos y estables. Olvídate de las interrupciones constantes y la publicidad excesiva que arruina la experiencia. Aquí priorizamos tu comodidad como espectador, ofreciendo múltiples opciones de visualización.</p>`;
            matchContent += `<p>El historial reciente entre ${event.name} sugiere que será un partido muy disputado. Los analistas prevén un juego táctico donde cualquier error podría definir el resultado. Asegúrate de conectar con nosotros al menos 15 minutos antes del pitido inicial para verificar tu conexión y elegir el mejor servidor disponible.</p>`;

            matchContent += `<h2>¿Cómo ver ${event.name} en vivo hoy?</h2>`;
            matchContent += `<p>Para acceder a la transmisión de ${event.name}, simplemente haz clic en el botón de reproducción superior. Contamos con tecnología de punta que permite una visualización fluida incluso en conexiones de velocidad media. No importa si estás en tu casa con Wi-Fi o en la calle con datos móviles, nuestra señal se adapta a tus necesidades para que el fútbol nunca se detenga.</p>`;
            matchContent += `<p>Además de ${event.name}, en RojadirectaEnvivo cubrimos todos los eventos de la jornada. Si eres un verdadero apasionado del deporte, te invitamos a explorar nuestra cartelera completa donde encontrarás desde tenis hasta baloncesto, siempre con la misma calidad y compromiso con el usuario.</p>`;

            matchContent += `<h2>Preguntas Frecuentes sobre el ${event.name}</h2>`;
            const matchFaqs = [
                { q: `¿A qué hora empieza el ${event.name}?`, a: `El partido está programado para comenzar a las ${event.time} hora local de hoy ${todayStr}.` },
                { q: `¿Dónde ver ${event.name} gratis?`, a: `Puedes seguirlo en vivo a través de RojadirectaEnvivo.live con calidad HD y sin necesidad de registro.` },
                { q: `¿Qué canal lo transmite?`, a: `La transmisión estará disponible en varios de nuestros canales internos dedicados a ${event.category}, incluyendo opciones en español.` },
                { q: `¿Es seguro ver ${event.name} aquí?`, a: `Totalmente. Nuestros enlaces son verificados para garantizar una experiencia de usuario segura y libre de malware.` }
            ];
            matchFaqs.forEach(f => {
                matchContent += `<div class="faq-item"><p class="faq-question">${f.q}</p><p>${f.a}</p></div>`;
            });

            // Internal Links: Same Category
            const sameCategory = allEvents.filter(e => e.category === event.category && e.id !== event.id).slice(0, 8);
            if (sameCategory.length > 0) {
                matchContent += `<h2>Otros partidos de ${event.category} hoy</h2><ul>`;
                sameCategory.forEach(e => {
                    const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
                    matchContent += `<li><a href="/${s}/" style="color: var(--color-secondary);">${e.name}</a></li>`;
                });
                matchContent += `</ul>`;
            }

            // Internal Links: Same Day (all events)
            const sameDay = allEvents.filter(e => e.id !== event.id).slice(0, 8);
            matchContent += `<h2>Más partidos destacados para hoy ${todayStr}</h2><ul>`;
            sameDay.forEach(e => {
                const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
                matchContent += `<li><a href="/${s}/" style="color: var(--color-secondary);">${e.name}</a></li>`;
            });
            matchContent += `</ul>`;

            const wordCount = countWords(matchContent);
            if (wordCount < 600) {
                matchContent += `<h2>Análisis táctico y expectativas para ${event.name}</h2>`;
                matchContent += `<p>Se espera que el equipo local intente dominar la posesión desde el inicio, mientras que el visitante buscará aprovechar las contras rápidas. La clave del partido estará en el centro del campo, donde se librará la batalla por el control del ritmo. Los jugadores estrella de ambos conjuntos están en plena forma, lo que añade un atractivo extra a este choque de titanes. No te pierdas ni un segundo de la acción de ${event.name} con nosotros.</p>`;
            }

            const schema = [
                {
                    "@context": "https://schema.org",
                    "@type": "BroadcastEvent",
                    "name": event.name,
                    "isLiveBroadcast": true,
                    "startDate": new Date().toISOString(),
                    "description": description,
                    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
                    "eventStatus": "https://schema.org/EventScheduled",
                    "location": {
                        "@type": "VirtualLocation",
                        "url": `${BASE_URL}/${slug}/`
                    }
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": matchFaqs.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                }
            ];

            const dir = path.join(process.cwd(), 'public', slug);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                newPagesCount++;
            }
            fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(title, description, matchContent, `${BASE_URL}/${slug}/`, schema));
        } catch (err) {
            console.error(`Error generating page for event:`, event, err);
        }
    }
    console.log(`Generated/Updated ${allEvents.length} match pages (${newPagesCount} new).`);

    // 4. Generate Sitemaps
    console.log("Generating sitemaps...");
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap><loc>${BASE_URL}/sitemap-main.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/sitemap-hubs.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/sitemap-partidos.xml</loc></sitemap>
</sitemapindex>`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-index.xml'), sitemapIndex);

    const sitemapMain = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${BASE_URL}/</loc><priority>1.0</priority></url>
    ${BRAND_PAGES.map(p => `<url><loc>${BASE_URL}/${p.slug}/</loc><priority>0.9</priority></url>`).join('')}
</urlset>`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-main.xml'), sitemapMain);

    const sitemapHubs = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${HUB_PAGES.map(p => `<url><loc>${BASE_URL}/${p.slug}/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('')}
</urlset>`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-hubs.xml'), sitemapHubs);

    const sitemapPartidos = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allEvents.map(e => {
        const slug = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
        return `<url><loc>${BASE_URL}/${slug}/</loc><changefreq>hourly</changefreq><priority>0.7</priority></url>`;
    }).join('')}
</urlset>`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-partidos.xml'), sitemapPartidos);

    // 5. Update Robots.txt
    const robots = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap-index.xml
`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);

    console.log("Daily SEO Automation Job complete!");
}

run();
