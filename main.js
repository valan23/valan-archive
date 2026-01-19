let allGames = [];
let currentPlatform = "TODAS";

// Inicialización
Papa.parse(CSV_URL, {
    download: true, header: true, skipEmptyLines: true,
    transformHeader: h => h.trim(),
    complete: function(results) {
        allGames = results.data.filter(j => j["Nombre Juego"] && j["Nombre Juego"].trim() !== "");
        createFilters(allGames);
        renderGames(allGames);
    }
});

// --- Funciones de Lógica ---
function createFilters(games) {
    const counts = games.reduce((acc, game) => {
        const p = game["Plataforma"];
        if (p) acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});

    const container = document.getElementById('platform-filters');
    let html = `<div class="brand-selector">
                    <div class="brand-icon active" onclick="showBrand('TODAS', this)">
                        <i class="fa-solid fa-house"></i> <span>TODAS</span>
                    </div>`;

    for (const [brandName, data] of Object.entries(BRANDS_CONFIG)) {
        html += `<div class="brand-icon ${data.class}" onclick="showBrand('${brandName}', this)">
                    <img src="${data.logo}" alt="" class="brand-logo-img"> <span>${brandName}</span>
                 </div>`;
    }
    html += `</div>`; 

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

function renderGames(games) {
    const container = document.getElementById('game-grid');
    if (games.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No se encontraron juegos.</p>";
        return;
    }

    const isValid = (val) => val && val.trim() !== "" && val.toUpperCase() !== "NA";

    container.innerHTML = games.map(j => {
        const colorB = getColorForNota(j["Estado General"]);
        const notaG = (j["Estado General"] === "PEND" || !j["Estado General"]) ? "?" : j["Estado General"];
        const completitud = j["Completitud"] || "Desconocido";
        
        // --- INTEGRACIÓN PASO 3: Obtener estilos de región ---
        const style = getRegionStyle(j["Región"]);

        return `
        <div class="card">
            <div class="grade-badge" style="background-color: ${colorB}">${notaG}</div>
    
            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; padding-right: 35px;">
        
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="platform-tag">${j["Plataforma"]}</span>
                    <span class="year-tag">${j["Año"] || ""}</span>
                </div>

                <div class="region-badge-container" style="
                    display: inline-flex; 
                    align-items: center; 
                    gap: 4px; 
                    background: ${style.bg}; 
                    border: 1px solid ${style.border}; 
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    width: fit-content;">
                    
                    ${getFlag(j["Región"])} 
                    <span style="font-size: 0.7em; font-weight: bold; color: ${style.text};">
                        ${j["Región"] || "N/A"}
                    </span>
                </div>
            </div>

            <span class="game-title">${j["Nombre Juego"]}</span>
            ${isValid(j["Edición"]) ? `<div class="edition-text">${j["Edición"]}</div>` : ''}
            
            <div class="completitud-text">
                <span style="color: ${completitud.toLowerCase().includes('completo') ? '#00ff88' : '#ffaa00'}">● ${completitud}</span>
            </div>

            <div class="details-grid">
                ${isValid(j["Estado Caja"]) ? `<div><span>📦Caja:</span> ${formatEstado(j["Estado Caja"])}</div>` : ''}
                ${isValid(j["Estado Inserto"]) ? `<div><span>📂Inserto:</span> ${formatEstado(j["Estado Inserto"])}</div>` : ''}
                ${isValid(j["Estado Manual"]) ? `<div><span>📖Manual:</span> ${formatEstado(j["Estado Manual"])}</div>` : ''}
                ${isValid(j["Estado Juego"]) ? `<div><span>💾Juego:</span> ${formatEstado(j["Estado Juego"])}</div>` : ''}
                ${isValid(j["Estado Portada"]) ? `<div><span>🖼️Portada:</span> ${formatEstado(j["Estado Portada"])}</div>` : ''}
                ${isValid(j["Estado Spinecard"]) ? `<div><span>🔖Obi:</span> ${formatEstado(j["Estado Spinecard"])}</div>` : ''}
                ${isValid(j["Estado Extras"]) ? `<div><span>🎁Extras:</span> ${formatEstado(j["Estado Extras"])}</div>` : ''}
            </div>
            <div class="price-tag">${j["Tasación Actual"] || "S/T"}</div>
        </div>`;
    }).join('');
}

// --- Helpers (Flag, Color, Filtros) ---
function showBrand(brand, element) {
    document.querySelectorAll('.brand-icon').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.platform-subgroup').forEach(g => g.classList.remove('show'));
    if (brand === 'TODAS') { currentPlatform = "TODAS"; applyFilters(); }
    else document.getElementById(`group-${brand}`)?.classList.add('show');
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

function getFlag(region) {
    if (!region) return '<span class="fi fi-xx"></span>';
    const codes = { "ESP": "es", "JAP": "jp", "USA": "us", "EU": "eu", "UK": "gb", "ITA": "it", "GER": "de", "AUS": "au", "ASIA": "hk"};
    const r = region.toUpperCase();
    let code = "xx";
    for (let key in codes) { if (r.includes(key)) code = codes[key]; }
    return `<span class="fi fi-${code}"></span>`;
}

function getColorForNota(valor) {
    const n = parseFloat(valor);
    if (isNaN(n)) return '#333';
    let r = n < 5 ? 255 : Math.round(255 - ((n - 5) * 51));
    let g = n < 5 ? Math.round(68 + (n * 37.4)) : 255;
    return `rgb(${r}, ${g}, 68)`;
}

function formatEstado(valor) {
    if (!valor || valor.toUpperCase() === "NA") return null;
    const v = valor.toUpperCase().trim();
    if (v === "FALTA") return '<span class="status-falta">FALTA</span>';
    if (v === "?" || v === "PEND") return '<span class="status-pend">?</span>';
    return `<span class="status-ok">${v}/10</span>`;
}

function getRegionStyle(region) {
    if (!region) return { bg: "rgba(255,255,255,0.1)", text: "#ccc", border: "transparent" };
    
    const r = region.toUpperCase();
    for (let key in REGION_COLORS) {
        if (r.includes(key)) return REGION_COLORS[key];
    }
    
    return { bg: "rgba(255,255,255,0.1)", text: "#ccc", border: "transparent" };
}
