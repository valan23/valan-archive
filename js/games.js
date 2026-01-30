function renderGames(games) {
    const container = document.getElementById('game-grid');
    if (!container) return;

    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-games', 'game');
    }

    container.innerHTML = "";
    if (games.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No se encontraron juegos.</p>";
        return;
    }

    const renderBatch = (start) => {
        const batch = games.slice(start, start + 24);
        const html = batch.map(j => createCardHTML(j)).join('');
        container.insertAdjacentHTML('beforeend', html);
        if (start + 24 < games.length) {
            requestAnimationFrame(() => renderBatch(start + 24));
        }
    };
    renderBatch(0);
}

function createCardHTML(j) {
    try {
        const valorPlataforma = j["Plataforma"] || "";
        const carpetaSistema = AppUtils.getPlatformFolder(valorPlataforma);
        const fotoUrl = AppUtils.isValid(j["Portada"]) ? `images/covers/${carpetaSistema}/${j["Portada"].trim()}` : `images/covers/default.webp`;
        const styleRegion = AppUtils.getRegionStyle(j["Región"]);
        const colorCompletitud = AppUtils.getCompletitudStyle(j["Completitud"]);
        const colorRareza = AppUtils.getRarezaColor(j["Rareza"]);
        const esDigital = (j["Formato"] || "").toString().toUpperCase().includes("DIGITAL");
        const edicionRaw = j["Edición"] || "";
        const esEdicionEspecial = AppUtils.isValid(edicionRaw) && edicionRaw.toUpperCase() !== "ESTÁNDAR";

        return `
        <div class="card ${typeof getBrandClass === 'function' ? getBrandClass(valorPlataforma) : ''} ${esDigital ? 'digital-variant' : 'physical-variant'}" style="display: flex; flex-direction: column; min-height: 520px; position: relative; padding-bottom: 60px;">
            <div class="platform-icon-card" style="position: absolute; top: 12px; left: 12px; z-index: 10;">
                ${typeof getPlatformIcon === 'function' ? getPlatformIcon(valorPlataforma) : ''}
            </div>
            <div style="position: absolute; top: 0; right: 0; background-color: ${colorCompletitud}; color: #000; font-weight: 900; font-size: 0.65em; padding: 6px 14px; border-bottom-left-radius: 8px; z-index: 10; box-shadow: -2px 2px 5px rgba(0,0,0,0.4);">
                ${(j["Completitud"] || "???").toUpperCase()}
            </div>
            <div style="margin-top: 45px;"></div>
            <div style="display: flex; align-items: center; width: 100%; gap: 10px; margin-bottom: 15px; padding: 0 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.7em; color: #eee; font-weight: 600;">${j["Año"] || "????"}</span>
                    <div style="display: inline-flex; align-items: center; gap: 4px; background: ${styleRegion.bg}; border: 1px solid ${styleRegion.border}; padding: 2px 6px; border-radius: 4px;">
                        ${typeof getFlag === 'function' ? getFlag(j["Región"]) : ''} 
                        <span style="font-size: 0.7em; font-weight: bold; color: ${styleRegion.text};">${j["Región"] || "N/A"}</span>
                    </div>
                </div>
                <div style="flex-grow: 1;"></div>
                <div style="font-size: 0.7em; font-weight: 800; color: ${colorRareza}; display: flex; align-items: center; gap: 3px;">
                    <span>💎 ${j["Rareza"] || "COMÚN"}</span>
                </div>
            </div>
            <div style="margin-bottom: 12px; padding: 0 12px;">
                <div class="game-title" style="font-size: 1.1em; color: #EFC36C; font-weight: 700; line-height: 1.2;">${j["Nombre Juego"]}</div>
                ${AppUtils.isValid(j["Nombre Japones"]) ? `<div style="font-size: 0.7em; color: #ced4da; margin-top: 3px; font-family: 'Noto Sans JP', sans-serif; opacity: 0.8;">${j["Nombre Japones"]}</div>` : ''}
                ${esEdicionEspecial ? `<div style="font-size: 0.7em; color: #ced4da; margin-top: 4px; opacity: 0.7;"><i class="fa-solid fa-star" style="color: #EFC36C;"></i> ${edicionRaw}</div>` : ''}
            </div>
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: calc(100% - 24px); margin-left: 12px; height: 150px; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 15px;"> 
                <div style="position: absolute; bottom: 8px; left: 8px; padding: 4px 10px; border-radius: 4px; font-size: 0.6em; font-weight: 900; text-transform: uppercase; z-index: 5; background: ${esDigital ? '#00d4ff' : '#e67e22'}; color: ${esDigital ? '#000' : '#fff'};">
                    ${esDigital ? 'Digital' : 'Físico'}
                </div>
                <img src="${fotoUrl}" loading="lazy" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            </div>
            <div style="margin: 0 12px; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 6px; flex-grow: 1;">
                ${esDigital ? `<div style="padding: 15px; text-align: center; color: #00d4ff; font-size: 0.85em; font-weight: bold;">CONTENIDO DIGITAL</div>` : 
                    [{l: '📦Caja', v: j["Estado Caja"]}, {l: '📂Inserto', v: j["Estado Inserto"]}, {l: '📖Manual', v: j["Estado Manual"]}, {l: '💾Juego', v: j["Estado Juego"]}, {l: '🖼️Portada', v: j["Estado Portada"]}, {l: '🔖Obi', v: j["Estado Spinecard"]}, {l: '🎁Extras', v: j["Estado Extras"]}]
                    .filter(i => AppUtils.isValid(i.v)).map(i => `
                    <div style="display: flex; justify-content: space-between; padding: 2px 8px; border-bottom: 1px solid rgba(255,255,255,0.03);">
                        <span style="color: #999; font-size: 0.75em;">${i.l}</span>
                        <span style="font-weight: 800; font-size: 0.8em;">${AppUtils.formatEstado(i.v)}</span>
                    </div>`).join('')}
            </div>
            <div class="card-footer" style="position: absolute; bottom: 12px; left: 15px; right: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; display: flex; justify-content: space-between;">
                <div style="font-size: 0.65em; color: #ced4da; font-style: italic;">${j["Fecha revision"] || 'Sin fecha'}</div>
                <div style="font-weight: 800; font-size: 0.9em;">💸 ${j["Tasación Actual"] || "S/T"}</div>
            </div>
        </div>`;
    } catch (e) { return ""; }
}
