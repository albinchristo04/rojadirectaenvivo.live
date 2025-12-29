import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_URL = "https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json";
const BASE_URL = "https://rojadirectaenvivo.live";
const BRAND_NAME = "RojaDirectaEnvivo";

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

// Track uniqueness
const usedTitles = new Set();
const usedDescriptions = new Set();

function getBaseTemplate(title, description, content, canonical, schema = null) {
    // Bing Trust Signals: robots index,follow
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
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
        <p>&copy; 2025 ${BRAND_NAME} – Fútbol y deportes en vivo</p>
        <div class="internal-links">
            <a href="/">Inicio</a>
            <a href="/mapa-del-sitio/">Mapa del Sitio</a>
            ${BRAND_PAGES.map(p => `<a href="/${p.slug}/">${p.keyword}</a>`).join('')}
            ${HUB_PAGES.map(p => `<a href="/${p.slug}/">${p.keyword}</a>`).join('')}
        </div>
    </footer>
</body>
</html>`;
}

function generateUniqueTitle(primary, context, brand = BRAND_NAME) {
    let title = `${primary} – ${context} | ${brand}`;
    let counter = 1;
    while (usedTitles.has(title)) {
        title = `${primary} – ${context} (${counter}) | ${brand}`;
        counter++;
    }
    usedTitles.add(title);
    return title;
}

function generateUniqueDescription(type, data) {
    const templates = [
        `Ver ${data.partido} EN VIVO GRATIS hoy. Horario, canales disponibles y enlaces actualizados en ${BRAND_NAME}. Disfruta del mejor fútbol en alta calidad hoy sin cortes.`,
        `Disfruta ${data.liga || data.partido} en vivo y gratis. Partidos de hoy, horarios y streaming online sin registro en ${BRAND_NAME}. Calidad HD garantizada ahora mismo.`,
        `Mira ${data.equipoA || data.partido} vs ${data.equipoB || ''} en vivo. Fútbol online gratis, enlaces activos y cobertura completa en ${BRAND_NAME}. Actualizado hoy para ti.`
    ];

    let desc = templates[Math.floor(Math.random() * templates.length)];

    // Inject unique ID or time to ensure uniqueness
    if (data.id) {
        desc = desc.replace("hoy", `hoy (Ref: ${data.id})`);
    } else {
        desc = desc.replace("hoy", `hoy ${Math.floor(Math.random() * 1000)}`);
    }

    // Ensure length 140-160
    while (desc.length < 140) {
        desc += " Actualizado hoy sin registro en alta calidad HD.";
    }
    if (desc.length > 160) {
        desc = desc.substring(0, 157) + "...";
    }

    let finalDesc = desc;
    let counter = 1;
    while (usedDescriptions.has(finalDesc)) {
        console.warn(`Duplicate description detected: ${finalDesc}`);
        finalDesc = desc.substring(0, 150) + ` [${counter}]`;
        counter++;
    }

    usedDescriptions.add(finalDesc);
    return finalDesc;
}

function countWords(str) {
    return str.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
}

async function run() {
    console.log("Starting Bing-Optimized SEO Automation...");
    const now = new Date();
    const todayStr = now.toLocaleDateString('es-ES');

    let allEvents = [];
    try {
        const res = await fetch(DATA_URL);
        const data = await res.json();
        const categories = data.events?.streams || [];
        const seenIds = new Set();
        allEvents = categories.flatMap(cat =>
            (cat.streams || []).map(s => ({ ...s, category: cat.category }))
        ).filter(e => {
            if (!e || !e.name || !e.id || seenIds.has(e.id)) return false;
            seenIds.add(e.id);
            return true;
        });
        console.log(`Fetched ${allEvents.length} unique valid events.`);
    } catch (e) {
        console.error("Failed to fetch events", e);
        process.exit(1);
    }

    // 1. Generate Brand Pages
    console.log("Generating Brand Pages...");
    for (const page of BRAND_PAGES) {
        const title = generateUniqueTitle(page.keyword.charAt(0).toUpperCase() + page.keyword.slice(1), `Ver Fútbol Gratis Hoy ${todayStr}`);
        const description = generateUniqueDescription('brand', { partido: page.keyword });

        let content = `<h1>${page.keyword.toUpperCase()} EN VIVO</h1>`;
        content += `<div class="card">
            <p>Bienvenido a la mejor plataforma para ver <strong>${page.keyword}</strong> en vivo. Si estás buscando una forma fiable y gratuita de seguir tus deportes favoritos, has llegado al lugar indicado. En ${BRAND_NAME} nos especializamos en ofrecer transmisiones de alta calidad para todos los fanáticos del fútbol en España y Latinoamérica.</p>
            <p>Nuestra plataforma de ${page.keyword} se actualiza constantemente para garantizar que no te pierdas ni un solo minuto de la acción. Ya sea que sigas la Liga Española, la Champions League o las ligas sudamericanas, aquí encontrarás los enlaces más estables y rápidos.</p>
            <a href="/" class="btn">VER PARTIDOS DE HOY</a>
        </div>`;

        content += `<h2>¿Por qué elegir ${page.keyword} para ver fútbol?</h2>`;
        content += `<p>A diferencia de otros sitios, nuestra versión de ${page.keyword} ofrece una experiencia sin interrupciones y con una interfaz optimizada para dispositivos móviles. No necesitas registrarte ni pagar suscripciones costosas para disfrutar del mejor deporte rey. La accesibilidad es nuestra bandera, permitiendo que cualquier usuario con una conexión a internet pueda sintonizar los encuentros más importantes del día.</p>`;

        content += `<h2>Preguntas Frecuentes sobre ${page.keyword}</h2>`;
        const faqs = [
            { q: `¿Es gratis ver ${page.keyword} aquí?`, a: `Sí, todos nuestros enlaces para ${page.keyword} son totalmente gratuitos y accesibles para todo el mundo sin necesidad de suscripción.` },
            { q: `¿Necesito registrarme para ver los partidos?`, a: `No, en ${BRAND_NAME} puedes acceder a las transmisiones de ${page.keyword} de forma directa y sin registros molestos.` }
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
        const title = generateUniqueTitle(page.keyword.charAt(0).toUpperCase() + page.keyword.slice(1), `Fútbol Online Gratis ${todayStr}`);
        const description = generateUniqueDescription('hub', { partido: page.keyword });

        let longContent = `<h1>${page.keyword.toUpperCase()}</h1>`;
        longContent += `<div class="card"><p>El mundo del deporte ha evolucionado y hoy en día <strong>${page.keyword}</strong> es una de las búsquedas más frecuentes entre los aficionados que no quieren perderse nada. En esta guía te explicamos cómo sacar el máximo provecho a nuestra plataforma para disfrutar de la mejor experiencia de streaming deportivo en este año 2025.</p></div>`;

        for (let i = 1; i <= 6; i++) {
            longContent += `<h2>Sección ${i}: Cómo disfrutar de ${page.keyword}</h2>`;
            longContent += `<p>Para ver ${page.keyword} de manera óptima, te recomendamos contar con una conexión a internet estable. Nuestra tecnología de streaming se adapta a tu velocidad, pero para disfrutar de la calidad HD, una conexión de al menos 10 Mbps es ideal. Además, el uso de navegadores modernos como Chrome o Firefox garantiza la compatibilidad con todos nuestros reproductores.</p>`;
        }

        longContent += `<h2>Próximos Partidos Destacados</h2><ul>`;
        allEvents.slice(0, 10).forEach(e => {
            const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
            longContent += `<li><a href="/${s}/" style="color: var(--color-secondary);">${e.name}</a> - ${e.time}</li>`;
        });
        longContent += `</ul>`;

        const dir = path.join(process.cwd(), 'public', page.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(title, description, longContent, `${BASE_URL}/${page.slug}/`));
    }

    // 3. Generate Match Pages
    console.log("Generating Match Pages...");
    for (const event of allEvents) {
        try {
            const slug = `ver-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
            const title = generateUniqueTitle(`Ver ${event.name} En Vivo`, `${event.category} ${event.time} Hoy (ID: ${event.id})`);
            const description = generateUniqueDescription('match', { partido: event.name, liga: event.category, id: event.id });

            let matchContent = `<h1>VER ${event.name.toUpperCase()} EN VIVO GRATIS</h1>`;
            matchContent += `<div class="card">
                <p>Hoy se enfrentan <strong>${event.name}</strong> en un duelo que promete ser emocionante. Sigue la transmisión en vivo aquí mismo en ${BRAND_NAME}.</p>
                <p><strong>Fecha:</strong> ${todayStr}<br>
                <strong>Hora:</strong> ${event.time}<br>
                <strong>Competición:</strong> ${event.category}</p>
                <a href="/event/${event.id}" class="btn">IR AL REPRODUCTOR EN VIVO</a>
            </div>`;

            matchContent += `<h2>Previa del Partido: ${event.name}</h2>`;
            matchContent += `<p>El encuentro entre ${event.name} es uno de los más esperados de la jornada en ${event.category}. Ambos equipos llegan con la necesidad de sumar puntos, lo que garantiza un espectáculo ofensivo de primer nivel. En nuestra plataforma te traemos la mejor cobertura para que no te pierdas ningún detalle.</p>`;

            // Internal Links: 10+
            const related = allEvents.filter(e => e.id !== event.id).slice(0, 12);
            matchContent += `<h2>Más partidos para hoy</h2><ul>`;
            related.forEach(e => {
                const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
                matchContent += `<li><a href="/${s}/" style="color: var(--color-secondary);">${e.name}</a></li>`;
            });
            matchContent += `</ul>`;

            const dir = path.join(process.cwd(), 'public', slug);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(title, description, matchContent, `${BASE_URL}/${slug}/`));
        } catch (err) {
            console.error(`Error generating page for event:`, event, err);
        }
    }

    // 4. Generate HTML Sitemap
    console.log("Generating HTML Sitemap...");
    let sitemapContent = `<h1>Mapa del Sitio - ${BRAND_NAME}</h1>`;
    sitemapContent += `<div class="card"><h2>Páginas Principales</h2><ul>`;
    sitemapContent += `<li><a href="/">Inicio</a></li>`;
    BRAND_PAGES.forEach(p => sitemapContent += `<li><a href="/${p.slug}/">${p.keyword}</a></li>`);
    HUB_PAGES.forEach(p => sitemapContent += `<li><a href="/${p.slug}/">${p.keyword}</a></li>`);
    sitemapContent += `</ul></div>`;
    sitemapContent += `<div class="card"><h2>Partidos de Hoy</h2><ul>`;
    allEvents.forEach(e => {
        const s = `ver-${e.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-en-vivo-gratis`;
        sitemapContent += `<li><a href="/${s}/">${e.name}</a></li>`;
    });
    sitemapContent += `</ul></div>`;

    const sitemapDir = path.join(process.cwd(), 'public', 'mapa-del-sitio');
    if (!fs.existsSync(sitemapDir)) fs.mkdirSync(sitemapDir, { recursive: true });

    const sitemapTitle = generateUniqueTitle("Mapa del Sitio", "Todos los Partidos de Hoy");
    const sitemapDesc = generateUniqueDescription('sitemap', { partido: "todos los deportes" });

    fs.writeFileSync(path.join(sitemapDir, 'index.html'), getBaseTemplate(sitemapTitle, sitemapDesc, sitemapContent, `${BASE_URL}/mapa-del-sitio/`));

    // 5. Generate XML Sitemaps
    console.log("Generating XML sitemaps...");
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
    <url><loc>${BASE_URL}/mapa-del-sitio/</loc><priority>0.8</priority></url>
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

    // 6. Update Robots.txt
    const robots = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap-index.xml
`;
    fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);

    // 7. Duplicate Detection Failsafe
    const expectedPages = BRAND_PAGES.length + HUB_PAGES.length + allEvents.length + 1;
    if (usedTitles.size < expectedPages || usedDescriptions.size < expectedPages) {
        console.error(`Duplicate detected! T:${usedTitles.size} D:${usedDescriptions.size} E:${expectedPages}`);
        process.exit(1);
    }

    console.log("SEO Automation complete!");
}

run();
