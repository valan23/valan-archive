/**
 * played.js - Diario de Juegos Finalizados
 */
let currentPlayedYear = 'all';

function renderPlayed(games) {
    const container = document.getElementById('played-grid');
    if (!container) return;

    // 1. ACTUALIZACIÓN DINÁMICA DE FORMATOS
    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-played', 'played');
    }

    // 2. ACTUALIZACIÓN DINÁMICA DE AÑOS
    updateYearButtons(games);

    // 3. Aplicar el filtro de año local
    const filteredByYear = games.filter(j => {
        if (currentPlayedYear === 'all') return true;
        const fecha = j["Ultima fecha"] || j["Año"] || "";
        return String(fecha).includes(currentPlayedYear);
    });

    // 4. Renderizado final
    container.innerHTML = filteredByYear.map(j => {
        try {
            const plataforma = j["Plataforma"] || "";
            const carpeta = AppUtils.getPlatformFolder(plataforma);
            const fotoUrl = AppUtils.isValid(j["Portada"]) ? `images/covers/${carpeta}/${j["Portada"].trim()}` : `images/covers/default.webp`;
        
            const styleRegion = AppUtils.getRegionStyle(j["Región"]);
            const nota = parseFloat(j["Nota"]) || 0;
            const hue = Math.min(Math.max(nota * 12, 0), 120);

            const tiempoJuego = j["Tiempo Juego"] || "0";
            const horas = tiempoJuego.toString().replace("h", "").trim();

            // Lógica de colores para Proceso Juego
            const proceso = (j["Proceso Juego"] || "Terminado").toUpperCase();
            let colorProceso = "#888"; // Default
            if (proceso.includes("TERMINADO")) colorProceso = "#2E9E7F";
            if (proceso.includes("PLATINADO") || proceso.includes("100%")) colorProceso = "#00f2ff";
            if (proceso.includes("CURSO") || proceso.includes("JUGANDO")) colorProceso = "#efc36c";
            if (proceso.includes("ABANDONADO")) colorProceso = "#ff4444";

            return `
            <div class="card ${getBrandClass(plataforma)}" style="display: flex; flex-direction: column; position: relative; min-height: 520px;">
                
                <div style="position: absolute; top: 0; right: 0; z-index: 10; display: flex; flex-direction: column; align-items: flex-end;">
                    <div style="background: hsl(${hue}, 100%, 40%); color: #fff; font-weight: 900; padding: 8px 15px; border-bottom-left-radius: 12px; font-size: 1.1em; box-shadow: -2px 2px 10px rgba(0,0,0,0.5);">
                        ${nota.toFixed(1)}
                    </div>
                    <div style="background: ${colorProceso}; color: #000; font-size: 0.55em; font-weight: 900; padding: 3px 8px; border-bottom-left-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${proceso}
                    </div>
                </div>
            
                <div style="position: absolute; top: 12px; left: 12px; z-index: 10; display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
                    <div class="platform-icon-card" style="position: static; margin: 0;">
                        ${getPlatformIcon(plataforma)}
                    </div>
                    
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <div style="background: rgba(0,0,0,0.6); color: #fff; font-size: 0.6em; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); white-space: nowrap;">
                            ${j["Año"] || "????"}
                        </div>

                        <div style="background: ${styleRegion.bg}; border: 1px solid ${styleRegion.border}; color: ${styleRegion.text}; font-size: 0.55em; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${getFlag(j["Región"])} <span>${(j["Región"] || "N/A").toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            
                <div style="margin-top: 85px; padding: 0 15px;">
                    <div class="game-title" style="font-size: 1.15em; color: #EFC36C; font-weight: 700; line-height: 1.2; min-height: 2.4em; display: flex; align-items: center; padding: 0;">
                        ${j["Nombre Juego"]}
                    </div>
                </div>

                <div style="height: 160px; margin: 10px 15px; background: rgba(0,0,0,0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <img src="${fotoUrl}" loading="lazy" style="max-width: 90%; max-height: 90%; object-fit: contain;" onerror="this.src='images/covers/default.webp'">
                </div>

                <div style="margin: 0 15px 15px; background: rgba(255,255,255,0.03); border-left: 3px solid #EFC36C; border-radius: 4px; padding: 12px; flex-grow: 1; font-size: 0.82em; color: #bbb; font-style: italic; line-height: 1.4; display: flex; align-items: center;">
                    "${j["Comentario"] || "Sin comentarios."}"
                </div>

                <div style="padding: 12px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.08); display: grid; grid-template-columns: 1fr auto 1fr; gap: 5px; align-items: center; text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span style="font-size: 0.55em; color: #666; font-weight: 800; letter-spacing: 0.5px;">INICIO</span>
                        <span style="font-size: 0.7em; color: #aaa; font-weight: 600;">${j["Primera fecha"] || "---"}</span>
                    </div>

                    <div style="background: rgba(149, 0, 255, 0.15); border: 1px solid rgba(149, 0, 255, 0.3); padding: 4px 10px; border-radius: 20px; min-width: 70px;">
                        <span style="display: block; font-size: 0.55em; color: var(--purple); font-weight: 900; letter-spacing: 0.5px;">TIEMPO</span>
                        <span style="font-size: 0.9em; color: #fff; font-weight: 900;">${horas}<small style="font-size: 0.7em; font-weight: 400; margin-left: 2px;">h</small></span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span style="font-size: 0.55em; color: #666; font-weight: 800; letter-spacing: 0.5px;">FINALIZADO</span>
                        <span style="font-size: 0.7em; color: #EFC36C; font-weight: 700;">${j["Ultima fecha"] || "---"}</span>
                    </div>
                </div>
            </div>`;
        } catch (e) { return ""; }
    }).join('');
}

function updateYearButtons(filteredGames) {
    const container = document.getElementById('year-buttons-container');
    if (!container) return;

    const counts = { all: filteredGames.length };
    filteredGames.forEach(j => {
        const fecha = j["Ultima fecha"] || j["Año"] || "";
        const match = String(fecha).match(/\d{4}/);
        if (match) {
            const y = match[0];
            counts[y] = (counts[y] || 0) + 1;
        }
    });

    const years = Object.keys(counts).filter(y => y !== 'all').sort((a, b) => b - a);

    container.innerHTML = `
        <button class="year-btn ${currentPlayedYear === 'all' ? 'active' : ''}" onclick="filterByYear('all')">
            Todos (${counts.all})
        </button>
        ${years.map(y => `
            <button class="year-btn ${currentPlayedYear === y ? 'active' : ''}" onclick="filterByYear('${y}')">
                ${y} (${counts[y]})
            </button>
        `).join('')}
    `;
}

function filterByYear(year) {
    currentPlayedYear = year;
    if (typeof applyFilters === 'function') {
        applyFilters();
    }
}
