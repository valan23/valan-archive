// main.js - El Director de Orquesta
let allGames = [];
let wishlistGames = [];
let playedGames = []; // 1. Nueva variable global
let currentPlatform = "TODAS";
let currentSection = 'videojuegos';

/**
 * INICIALIZACIÓN
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
        // 2. Añadimos la carga del tercer CSV (CSV_URL_JUGADOS)
        const [dataJuegos, dataDeseados, dataJugados] = await Promise.all([
            loadCSV(CSV_URL_JUEGOS),
            loadCSV(CSV_URL_DESEADOS),
            loadCSV(CSV_URL_JUGADOS) // Asegúrate de tener esta constante definida
        ]);

        allGames = dataJuegos.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== "");
        wishlistGames = dataDeseados.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== "");
        playedGames = dataJugados.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== ""); // 3. Guardamos los datos

        // Renderizado inicial
        createFilters(allGames, 'platform-filters');
        renderGames(allGames);

    } catch (error) {
        console.error("Error crítico al cargar las hojas de Google Sheets:", error);
    }
}

init();

/**
 * LÓGICA DE NAVEGACIÓN
 */
function switchSection(sectionId, btn) {
    currentSection = sectionId;
    currentPlatform = "TODAS"; 

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + sectionId).classList.add('active');
    
    // 4. Actualizamos el switch para incluir la sección 'jugados'
    if(sectionId === 'videojuegos') {
        createFilters(allGames, 'platform-filters');
        renderGames(allGames); 
    } else if(sectionId === 'deseados') {
        createFilters(wishlistGames, 'platform-filters-wishlist');
        renderWishlist(wishlistGames); 
    } else if(sectionId === 'jugados') {
        // Asegúrate de tener un contenedor 'platform-filters-played' en tu HTML
        createFilters(playedGames, 'platform-filters-played');
        renderPlayed(playedGames); 
    }
}

// ... (Las funciones createFilters, showBrand, filterByPlatform se mantienen igual)

function applyFilters() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    
    // 5. Ajustamos la selección de datos y función según la sección actual
    let targetData, renderFunc;

    if (currentSection === 'videojuegos') {
        targetData = allGames;
        renderFunc = renderGames;
    } else if (currentSection === 'deseados') {
        targetData = wishlistGames;
        renderFunc = renderWishlist;
    } else if (currentSection === 'jugados') {
        targetData = playedGames;
        renderFunc = renderPlayed;
    }

    const filtered = targetData.filter(j => {
        let matchesP = false;

        if (currentPlatform === "TODAS") {
            matchesP = true;
        } else if (Array.isArray(currentPlatform)) {
            matchesP = currentPlatform.includes(j["Plataforma"]);
        } else {
            matchesP = (j["Plataforma"] === currentPlatform);
        }

        const matchesS = (j["Nombre Juego"] || "").toLowerCase().includes(q);
        return matchesP && matchesS;
    });

    renderFunc(filtered);
}

// ... (El resto de funciones se mantienen igual)
