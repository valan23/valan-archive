function renderWishlist(games) {
    const container = document.getElementById('wishlist-grid');
    if (!container) return;

    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-wishlist', 'wishlist');
    }

    container.innerHTML = games.map(j => {
        try {
            const plataforma = j["Plataforma"] || "";
            const carpeta = AppUtils.getPlatformFolder(plataforma);
            const fotoUrl = AppUtils.isValid(j["Portada"]) ? `images/covers/${carpeta}/${j["Portada"].trim()}` : `images/covers/default.webp`;
            const priorTexto = (j["Prioridad"] || "DESEADO").trim().toUpperCase();
            
            const listaPrecios = [
                { n: 'Nuevo', v: j["Precio Nuevo"], c: '#D4BD66' },
                { n: 'CeX', v: j["Precio Cex"], c: '#ff4444' },
                { n: 'Wallapop', v: j["Precio Wallapop"], c: '#2E9E7F' },
                { n: 'eBay', v: j["Precio Ebay"], c: '#0064d2' },
                { n: 'Surugaya', v: j["Precio Surugaya"], c: '#5da9ff' },
                { n: 'Mercari', v: j["Precio Mercari"], c: '#59C0C2' }
            ].filter(p => AppUtils.isValid(p.v)).map(p => ({...p, eur: AppUtils.obtenerValorEnEuros(p.v)}));

            const precioMin = listaPrecios.length ? Math.min(...listaPrecios.map(p => p.eur)) : Infinity;

            return `
            <div class="card ${typeof getBrandClass === 'function' ? getBrandClass(plataforma) : ''}" style="display: flex; flex-direction: column; min-height: 520px; position: relative;">
                <div style="position: absolute; top: 0; right: 0; background: #555; color: #000; font-weight: 900; font-size: 0.65em; padding: 6px 14px; border-bottom-left-radius: 8px; z-index: 10;">${priorTexto}</div>
                <div style="margin-top: 45px; padding: 0 12px;">
                    <div class="game-title" style="font-size: 1.1em; color: #EFC36C; font-weight: 700;">${j["Nombre Juego"]}</div>
                </div>
                <div style="display: flex; justify-content: center; height: 150px; margin: 15px 12px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <img src="${fotoUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                </div>
                <div style="margin: 0 12px; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 4px; flex-grow: 1;">
                    ${listaPrecios.map(p => `
                        <div style="display: flex; justify-content: space-between; padding: 4px 8px; ${p.eur === precioMin ? 'background: rgba(149,0,255,0.15);' : ''}">
                            <span style="color: ${p.c}; font-size: 0.75em; font-weight: 700;">${p.eur === precioMin ? '⭐ ' : ''}${p.n}</span>
                            <span style="color: #eee; font-size: 0.8em; font-weight: 800;">${p.v}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="padding: 12px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;">
                    <span style="font-size: 0.65em; color: #ccc;">${j["Fecha revision"] || '--/--'}</span>
                    ${AppUtils.isValid(j["Link"]) ? `<a href="${j["Link"]}" target="_blank" style="color: #9500ff; font-size: 0.65em; font-weight: bold; text-decoration: none;">VER OFERTA</a>` : ''}
                </div>
            </div>`;
        } catch (e) { return ""; }
    }).join('');
}
