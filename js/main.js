// main.js - El Director de Orquesta
let allGames = [];
let wishlistGames = [];
let currentPlatform = "TODAS";

/**
 * INICIALIZACIÓN
 * Carga los dos CSV (Juegos y Deseados) simultáneamente
 */
async function init() {
    const loadCSV = (url) => {
        return new Promise((resolve, reject) => {
            Papa.parse(url, {
                download: true, 
                header: true, 
                skipEmptyLines: true,
                transformHeader: h => h.trim(),
                complete: (results) => resolve(results.data),
                error: (err) => reject(err)
            });
        });
    };

    try {
        // Usamos las variables definidas en config.js
        const [dataJuegos, dataDeseados] = await Promise.all([
            loadCSV(CSV_URL_JUEGOS),
            loadCSV(CSV_URL_DESEADOS)
        ]);

        // Limpieza de datos: eliminamos filas sin nombre
        allGames = dataJuegos.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== "");
        wishlistGames = dataDeseados.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== "");

        // Renderizado inicial
        createFilters(allGames);
        renderGames(allGames); // Esta función debe estar en games.js

    } catch (error) {
        console.error("Error crítico al cargar las hojas de Google Sheets:", error);
    }
}

// Arrancar la aplicación
init();

/**
 * LÓGICA DE NAVEGACIÓN
 * Cambia entre la pestaña de Colección y Deseados
 */
function switchSection(sectionId, btn) {
    // Gestión de botones
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Gestión de visibilidad de secciones
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + sectionId).classList.add('active');
    
    // Al cambiar, pintamos los datos correspondientes
    if(sectionId === 'videojuegos') {
        renderGames(allGames); 
    } else if(sectionId === 'deseados') {
        renderWishlist(wishlistGames); // Esta función debe estar en wishlist_games.js
    }
}

/**
 * LÓGICA DE FILTRADO
 * Crea los iconos de marcas y botones de consolas
 */
function createFilters(games) {
    const counts = games.reduce((acc, game) => {
        const p = game["Plataforma"];
        if (p) acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});

    const container = document.getElementById('platform-filters');
    if (!container) return;
    
    let html = `<div class="brand-selector" style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">`;

    // Botón Global "TODAS"
    html += `
        <div class="brand-icon active" onclick="showBrand('TODAS', this)" 
             style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px;">
            <i class="fa-solid fa-house" style="font-size: 1.5em; min-width: 30px; text-align: center;"></i>
            <span style="font-weight: 600; font-size: 1em;">TODAS</span>
        </div>`;

    // Iconos de Marcas (Nintendo, Sega, etc.)
    for (const [brandName, data] of Object.entries(BRANDS_CONFIG)) {
        html += `
            <div class="brand-icon ${data.class}" onclick="showBrand('${brandName}', this)" 
                 style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px;">
                <img src="${data.logo}" alt="" class="brand-logo-img" 
                     style="height: 25px; width: auto; max-width: 100px; object-fit: contain;">
                <span style="font-weight: 600; font-size: 1em;">${brandName}</span>
            </div>`;
    }
    
    html += `</div>`; 

    // Subgrupos de plataformas por marca
    for (const [brandName, data] of Object.entries(BRANDS_CONFIG)) {
        html += `<div id="group-${brandName}" class="platform-subgroup">`;
        data.platforms.forEach(p => {
            if (counts[p]) {
                const icon = data.icons?.[p] ? `<img src="${data.icons[p]}" class="btn-console-icon">` : '';
                html += `<button class="filter-btn ${data.class}" onclick="filterByPlatform('${p}', this)">
                            ${icon} <span>${p} (${counts[p]})</span>
                         </button>`;
            }
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}

function showBrand(brand, element) {
    document.querySelectorAll('.brand-icon').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.platform-subgroup').forEach(g => g.classList.remove('show'));
    
    if (brand === 'TODAS') { 
        currentPlatform = "TODAS"; 
        applyFilters(); 
    } else {
        document.getElementById(`group-${brand}`)?.classList.add('show');
    }
}

function filterByPlatform(p, btn) {
    currentPlatform = p;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function applyFilters() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allGames.filter(j => {
        const matchesP = (currentPlatform === "TODAS" || j["Plataforma"] === currentPlatform);
        const matchesS = (j["Nombre Juego"] || "").toLowerCase().includes(q);
        return matchesP && matchesS;
    });
    renderGames(filtered);
}

function filterGames() { applyFilters(); }

/**
 * HELPERS COMPARTIDOS
 * Funciones que utilizan tanto la Colección como los Deseados
 */
function getFlag(region) {
    if (!region) return '<span class="fi fi-xx"></span>';
    const codes = { 
        "ESP": "es", "JAP": "jp", "USA": "us", "EU": "eu", 
        "UK": "gb", "ITA": "it", "GER": "de", "AUS": "au", "ASIA": "hk"
    };
    const r = region.toUpperCase();
    let code = "xx";
    for (let key in codes) { if (r.includes(key)) code = codes[key]; }
    return `<span class="fi fi-${code}"></span>`;
}

function getPlatformIcon(platformName) {
    for (const brand in BRANDS_CONFIG) {
        const icons = BRANDS_CONFIG[brand].icons;
        if (icons && icons[platformName]) {
            return `<img src="${icons[platformName]}" alt="${platformName}" style="height: 20px; width: auto; object-fit: contain;">`;
        }
    }
    return `<span class="platform-tag">${platformName}</span>`;
}
