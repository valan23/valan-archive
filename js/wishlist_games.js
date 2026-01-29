/**
 * wishlist_games.js - Optimizado
 */

function obtenerValorEnEuros(precioStr) {
    if (!precioStr || precioStr.toUpperCase() === "NA") return Infinity;
    // Limpieza más robusta de strings de precio
    const num = parseFloat(precioStr.toString().replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (isNaN(num)) return Infinity;

    // Ajuste de tasa de cambio Yen a Euro (más realista)
    if (precioStr.includes('¥') || precioStr.toLowerCase().includes('surugaya') || precioStr.toLowerCase().includes('mercari')) {
        return num / 180; 
    }
    return num;
}

function renderWishlist(games) {
    const container = document.getElementById('wishlist-grid');
    if (!container) return;

    // Llamada a filtros (asegúrate de que esta función exista globalmente)
    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-wishlist', 'wishlist');
    }

    const isValid = (val) => val && val.trim() !== "" && val.toUpperCase() !== "NA";

    container.innerHTML = games.map(j => {
        try {
            const platformMap = { "Famicom": "fc", "Famicom Disk System": "fds", "Super Famicom": "sfc" };
            const valorExcel = j["Plataforma"] ? j["Plataforma"].trim() : "";
            const carpetaSistema = platformMap[valorExcel] || valorExcel.toLowerCase().replace(/\s+/g, '');
            const fotoUrl = isValid(j["Portada"]) ? `images/covers/${carpetaSistema}/${j["Portada"].trim()}` : `images/covers/default.webp`;

            const style = typeof getRegionStyle === 'function' ? getRegionStyle(j["Región"]) : {bg: '#333', text: '#eee', border: '#444'};
            const brandClass = typeof getBrandClass === 'function' ? getBrandClass(valorExcel) : "";
            
            const campoFormato = j["Formato"] || "Físico";
            const esDigital = campoFormato.toString().toUpperCase().includes("DIGITAL");
            
            const edicionRaw = j["Edición"] || "";
            const esEdicionEspecial = isValid(edicionRaw) && edicionRaw.toUpperCase() !== "ESTÁNDAR";

            // --- LÓGICA DE PRECIOS ---
            const listaPrecios = [
                { nombre: 'Nuevo', valor: j["Precio Nuevo"], eur: obtenerValorEnEuros(j["Precio Nuevo"]), color: '#D4BD66' },
                { nombre: 'CeX', valor: j["Precio Cex"], eur: obtenerValorEnEuros(j["Precio Cex"]), color: '#ff4444' }, 
                { nombre: 'Wallapop', valor: j["Precio Wallapop"], eur: obtenerValorEnEuros(j["Precio Wallapop"]), color: '#2E9E7F' },
                { nombre: 'eBay', valor: j["Precio Ebay"], eur: obtenerValorEnEuros(j["Precio Ebay"]), color: '#0064d2' },
                { nombre: 'Surugaya', valor: j["Precio Surugaya"], eur: obtenerValorEnEuros(j["Precio Surugaya"]), color: '#5da9ff' },
                { nombre: 'Mercari', valor: j["Precio Mercari"], eur: obtenerValorEnEuros(j["Precio Mercari"]), color: '#59C0C2' }
            ];

            const preciosValidos = listaPrecios.filter(p => isValid(p.valor));
            const precioMinimoEur = preciosValidos.length > 0 ? Math.min(...preciosValidos.map(p => p.eur)) : Infinity;

            const priorTexto = (j["Prioridad"] || "DESEADO").trim().toUpperCase();
            const colorPrioridad = getColorForPrioridad(priorTexto);
            
            const rarezaTexto = (j["Rareza"] || "COMÚN").trim().toUpperCase();
            const rarezaPorcentaje = { "LEGENDARIO": 100, "ÉPICO": 80, "RARO": 60, "INUSUAL": 40, "COMÚN": 20 }[rarezaTexto] || 20;

            return `
            <div class="card ${brandClass} ${esDigital ? 'digital-variant' : 'physical-variant'}" style="display: flex; flex-direction: column; min-height: 520px;">
                
                <div class="platform-icon-card" style="position: absolute; top: 12px; left: 12px; z-index: 10;">
                    ${typeof getPlatformIcon === 'function' ? getPlatformIcon(j["Plataforma"]) : ''}
                </div>

                <div style="position: absolute; top: 0; right: 0; background-color: ${colorPrioridad}; color: #000; font-weight: 900; font-size: 0.65em; padding: 6px 14px; border-bottom-left-radius: 8px; z-index: 10; box-shadow: -2px 2px 5px rgba(0,0,0,0.4);">
                    ${priorTexto}
                </div>

                <div style="margin-top: 45px;"></div>

                <div style="display: flex; align-items: center; width: 100%; gap: 10px; margin-bottom: 15px; padding: 0 12px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.7em; color: #eee; font-weight: 600;">
                            ${j["Año"] || "????"}
                        </span>
                        <div style="display: inline-flex; align-items: center; gap: 4px; background: ${style.bg}; border: 1px solid ${style.border}; padding: 2px 6px; border-radius: 4px;">
                            ${typeof getFlag === 'function' ? getFlag(j["Región"]) : ''} 
                            <span style="font-size: 0.7em; font-weight: bold; color: ${style.text};">${j["Región"] || "N/A"}</span>
                        </div>
                    </div>
                    <div style="flex-grow: 1;"></div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                         <div style="font-size: 0.7em; font-weight: 800; color: ${getColorForRareza(rarezaTexto)}; display: flex; align-items: center; gap: 3px;">
                            <span style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">💎</span>
                            <span>${rarezaTexto}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px; padding: 5px 0; padding-left: 12px;">
                    <div class="game-title" style="font-size: 1.1em; color: #EFC36C; font-weight: 700; line-height: 1.2;">
                        ${j["Nombre Juego"]}
                    </div>
                    ${esEdicionEspecial ? `<div style="font-size: 0.7em; color: #aaa; margin-top: 4px;"><i class="fa-solid fa-star" style="color: #EFC36C;"></i> ${edicionRaw}</div>` : ''}
                </div>

                <div style="position: relative; display: flex; align-items: center; justify-content: center; width: calc(100% - 24px); margin-left: 12px; height: 150px; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 15px;"> 
                    <img src="${fotoUrl}" loading="lazy" style="max-width: 90%; max-height: 90%; object-fit: contain; filter: drop-shadow(0px 5px 10px rgba(0,0,0,0.5));">
                </div>

                <div style="margin: 0 12px; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 4px; flex-grow: 1;">
                    ${preciosValidos.length > 0 ? preciosValidos.map(p => {
                        const esElMasBarato = p.eur === precioMinimoEur && p.eur !== Infinity;
                        return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 4px; margin-bottom: 2px; ${esElMasBarato ? 'background: rgba(149, 0, 255, 0.15); border: 1px solid rgba(149, 0, 255, 0.3);' : ''}">
                            <span style="color: ${p.color}; font-size: 0.75em; font-weight: 700;">
                                ${esElMasBarato ? '⭐ ' : ''}${p.nombre}
                            </span>
                            <span style="color: ${esElMasBarato ? '#00ff88' : '#eee'}; font-size: 0.8em; font-weight: 800;">
                                ${p.valor}
                            </span>
                        </div>`;
                    }).join('') : '<div style="text-align:center; padding:10px; font-size:0.7em; color:#666;">Sin precios registrados</div>'}
                </div>

                <div style="padding: 12px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 0.6em; color: #555;">
                        REV: ${isValid(j["Fecha revision"]) ? j["Fecha revision"] : '--/--'}
                    </div>
                    ${isValid(j["Link"]) ? `
                       <a href="${j["Link"].trim()}" target="_blank" style="text-decoration: none; background: #9500ff; padding: 4px 10px; border-radius: 4px; color: #fff; font-size: 0.65em; font-weight: bold; text-transform: uppercase;">
                           Ver Oferta
                       </a>
                    ` : ''}
                </div>
            </div>`;
        } catch (e) {
            console.error("Error wishlist:", e);
            return "";
        }
    }).join('');
}
