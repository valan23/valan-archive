/**
 * played.js - Diario de Juegos Finalizados (Versión con Edición e Iconos)
 */

function renderPlayed(games) {
    const container = document.getElementById('played-grid');
    if (!container) return;

    // 1. Filtros y navegación
    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-played', 'played');
    }
    updateYearButtons(games);

    // 2. Filtro de año
    const filteredByYear = games.filter(j => {
        if (currentPlayedYear === 'all') return true;
        const fechaVal = j["Ultima fecha"] || j["Ultima Fecha"] || j["Última Fecha"] || j["Año"] || "";
        return String(fechaVal).includes(currentPlayedYear);
    });

    // 3. Renderizado
    container.innerHTML = filteredByYear.map(j => {
        try {
            if (typeof AppUtils === 'undefined') return "";

            const toRgba = (hex, alpha = 0.15) => {
                if (!hex || typeof hex !== 'string' || hex[0] !== '#') return `rgba(255,255,255,${alpha})`;
                const r = parseInt(hex.slice(1, 3), 16),
                      g = parseInt(hex.slice(3, 5), 16),
                      b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };
            
            const plat = j["Plataforma"] || "";
            const carpeta = AppUtils.getPlatformFolder(plat);
            const portada = (j["Portada"] || "").trim();
            const fotoUrl = AppUtils.isValid(portada) ? `images/covers/${carpeta}/${portada}` : `images/covers/default.webp`;
            
            // --- LÓGICA DE EDICIÓN INTELIGENTE ---
            let edicionHTML = "";
            const edicionTexto = j["Edición"] || "";
            if (AppUtils.isValid(edicionTexto) && edicionTexto.toUpperCase() !== "ESTÁNDAR") {
                let icono = '<i class="fa-solid fa-star"></i>'; // Icono por defecto
                const upperEd = edicionTexto.toUpperCase();
                
                if (upperEd.includes("STEAM")) icono = '<i class="fa-brands fa-steam"></i>';
                else if (upperEd.includes("GAME PASS")) icono = '<i class="fa-brands fa-xbox"></i>';
                else if (upperEd.includes("PS PLUS")) icono = '<i class="fa-brands fa-playstation"></i>';
                else if (upperEd.includes("RETROARCH") || upperEd.includes("NSO")) icono = '<i class="fa-solid fa-gamepad"></i>';
                else if (upperEd.includes("BATTLE.NET")) icono = '<i class="fa-solid fa-bolt"></i>';
                else if (upperEd.includes("EPIC")) icono = '<i class="fa-solid fa-e"></i>';

                edicionHTML = `<div style="color: var(--cyan); font-size: 0.65em; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">${icono} ${edicionTexto}</div>`;
            } else {
                edicionHTML = `<div style="height: 12px;"></div>`;
            }

            // --- LÓGICA DE LOGROS ---
            const ganados = parseInt(j["RA_Ganados"] || 0);
            const totales = parseInt(j["RA_Totales"] || 0);
            const tieneLogros = totales > 0;
            const pct = tieneLogros ? Math.round((ganados / totales) * 100) : 0;
            const master = (ganados === totales && totales > 0);
            const raID = j["RA_ID"];

            const nota = parseFloat(String(j["Nota"]).replace(',', '.')) || 0;
            const hue = Math.min(Math.max(nota * 12, 0), 120);
            const proceso = (j["Proceso Juego"] || j["Estado"] || "Terminado").toUpperCase();
            let colorProceso = "#2E9E7F"; 
            if (proceso.includes("COMPLETADO") || proceso.includes("100%")) colorProceso = "#9825DA";

            const horas = (j["Tiempo Juego"] || j["Tiempo"] || "0").toString().replace("h", "").trim();
            const esDigital = (j["Formato"] || "").toString().toUpperCase().includes("DIGITAL");

            return `
            <div class="card ${AppUtils.getBrandClass(plat)}" style="display: flex; flex-direction: column; position: relative; min-height: 520px; overflow: hidden; border-radius: 12px; ${master ? 'box-shadow: 0 0 15px rgba(212, 189, 102, 0.25); border: 1px solid rgba(212, 189, 102, 0.3);' : ''}">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 45px; z-index: 10; display: flex; align-items: stretch;">
                    <div class="icon-gradient-area">
                        <div class="card-platform-box">${AppUtils.getPlatformIcon(plat)}</div>
                    </div>
                    <div style="flex: 0 0 40%; display: flex; flex-direction: column; align-items: stretch; overflow: hidden;">
                        <div style="flex: 1; background: ${toRgba(colorProceso, 0.2)}; color: ${colorProceso}; font-size: 0.55em; font-weight: 900; display: flex; align-items: center; justify-content: center; text-transform: uppercase;">
                            ${proceso}
                        </div>
                        <div style="flex: 1.5; background: hsla(${hue}, 80%, 45%, 0.15); color: hsl(${hue}, 80%, 60%); font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 1.2em;">
                            ${nota.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div style="margin-top: 55px; padding: 0 12px;">
                    ${edicionHTML}
                    <div class="game-title" style="font-size: 1.1em; color: var(--accent); font-weight: 700; line-height: 1.2;">${j["Nombre Juego"]}</div>
                    <div style="font-size: 0.7em; color: #888; font-family: 'Noto Sans JP', sans-serif; min-height: 1.2em; margin-top: 2px;">${j["Nombre Japones"] || ""}</div>
                    <div style="margin-top: 8px; line-height: 1.2; display: flex; align-items: center; gap: 8px;">
                        <div style="font-size: 0.6em; padding: 2px 6px; border-radius: 4px; background: ${AppUtils.getRegionStyle(j["Región"]).bg}; color: ${AppUtils.getRegionStyle(j["Región"]).text}; font-weight: bold;">
                            ${AppUtils.getFlag(j["Región"])} ${j["Región"] || "N/A"}
                        </div>
                        <span style="font-size: 0.7em; color: #888; font-weight: bold;">${j["Año"] || "????"}</span>
                    </div>
                </div>

                <div style="height: 145px; margin: 15px 12px 5px; background: rgba(0,0,0,0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="${fotoUrl}" loading="lazy" style="max-width: 90%; max-height: 90%; object-fit: contain;" onerror="this.src='images/covers/default.webp'">
                </div>

                <div style="margin: 0 12px; display: flex; justify-content: flex-end; min-height: ${tieneLogros ? '22px' : '0px'};">
                    ${tieneLogros ? `
                        <a href="${raID ? `https://retroachievements.org/game/${raID}` : '#'}" target="_blank" style="text-decoration: none;">
                            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.3); padding: 2px 10px; border-radius: 20px; border: 1px solid ${master ? '#D4BD66' : 'rgba(255,255,255,0.1)'}">
                                <span style="font-size: 0.6em; font-weight: 900; color: ${master ? '#D4BD66' : '#aaa'};">
                                    ${master ? '<i class="fa-solid fa-trophy"></i> MASTERED' : `<i class="fa-solid fa-medal"></i> ${ganados}/${totales}`}
                                </span>
                                <div style="width: 30px; background: rgba(255,255,255,0.1); height: 3px; border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${pct}%; background: ${master ? '#D4BD66' : '#2e9e7f'}; height: 100%;"></div>
                                </div>
                                <span style="font-size: 0.55em; font-weight: bold; color: #777;">${pct}%</span>
                            </div>
                        </a>
                    ` : ''}
                </div>

                <div style="margin: 5px 12px 15px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent); border-radius: 4px; padding: 10px; flex-grow: 1; font-size: 0.75em; color: #bbb; font-style: italic; line-height: 1.4; display: flex; align-items: center;">
                    "${j["Comentarios"] || "Sin comentarios."}"
                </div>

                <div style="height: 55px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: stretch; background: rgba(0,0,0,0.1);">
                    <div style="flex: 0.8; background: ${esDigital ? 'rgba(0, 242, 255, 0.1)' : 'rgba(239, 195, 108, 0.1)'}; color: ${esDigital ? 'var(--cyan)' : 'var(--accent)'}; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <i class="fa-solid ${esDigital ? 'fa-cloud-download' : 'fa-compact-disc'}"></i>
                        <span style="font-size: 0.55em; font-weight: 900;">${esDigital ? 'DIGITAL' : 'FÍSICO'}</span>
                    </div>
                    <div style="flex: 1.4; display: flex; gap: 8px; align-items: center; justify-content: center; border-right: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center;">
                            <div style="font-size: 0.45em; color: #555; font-weight: 800;">INICIO</div>
                            <div style="font-size: 0.6em; color: #888;">${j["Primera fecha"] || "--/--"}</div>
                        </div>
                        <div style="color: #333; font-size: 0.7em;">➔</div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.45em; color: #555; font-weight: 800;">FIN</div>
                            <div style="font-size: 0.6em; color: var(--accent); font-weight: 700;">${j["Ultima fecha"] || "--/--"}</div>
                        </div>
                    </div>
                    <div style="flex: 0.8; background: rgba(46, 158, 127, 0.1); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <span style="font-size: 0.5em; color: #2e9e7f; font-weight: 900;">TIEMPO</span>
                        <span style="font-size: 0.9em; color: #fff; font-weight: 900;">${horas}<small style="font-size: 0.6em;">h</small></span>
                    </div>
                </div>
            </div>`;
        } catch (e) { return ""; }
    }).join('');
}
