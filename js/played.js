let selectedYear = 'all';
let selectedFormat = 'all';

function renderPlayed(games) {
    const container = document.getElementById('played-grid');
    if (!container) return;

    if (typeof renderFormatFilters === 'function') {
        renderFormatFilters(games, 'format-buttons-container-played', 'played');
    }
    updateYearFilters(games);

    container.innerHTML = games.map(j => {
        try {
            const plataforma = j["Plataforma"] || "";
            const carpeta = AppUtils.getPlatformFolder(plataforma);
            const fotoUrl = AppUtils.isValid(j["Portada"]) ? `images/covers/${carpeta}/${j["Portada"].trim()}` : `images/covers/default.webp`;
            const esDigital = (j["Formato"] || "").toString().toUpperCase().includes("DIGITAL");
            const nota = parseFloat(j["Nota"]) || 0;

            return `
            <div class="card ${typeof getBrandClass === 'function' ? getBrandClass(plataforma) : ''} ${esDigital ? 'digital-variant' : 'physical-variant'}" style="display: flex; flex-direction: column; position: relative;">
                <div style="position: absolute; top: 0; right: 0; background: #00ff88; color: #000; font-weight: 900; padding: 6px 15px; border-bottom-left-radius: 8px; z-index: 10;">${nota.toFixed(1)}</div>
                <div style="margin-top: 45px; padding: 0 12px;">
                    <span class="year-label" style="display:none;">${j["Año"] || ""} ${j["Ultima fecha"] || ""}</span>
                    <div class="game-title" style="font-size: 1.15em; color: #EFC36C; font-weight: 700;">${j["Nombre Juego"]}</div>
                </div>
                <div style="height: 160px; margin: 15px 12px; background: rgba(0,0,0,0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <img src="${fotoUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                </div>
                <div style="margin: 0 12px 15px; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 12px; flex-grow: 1; font-size: 0.75em; color: #ccc; font-style: italic;">
                    "${j["Comentario"] || "Sin comentarios."}"
                </div>
                <div style="padding: 10px 12px; background: rgba(0,0,0,0.25); border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; font-size: 0.7em;">
                    <span>START: ${j["Primera fecha"] || "---"}</span>
                    <span style="color: #EFC36C; font-weight: 700;">END: ${j["Ultima fecha"] || "---"}</span>
                </div>
            </div>`;
        } catch (e) { return ""; }
    }).join('');

    setupFormatFilterEvents();
}

function applyCombinedFilters() {
    const cards = document.querySelectorAll('#played-grid .card');
    cards.forEach(card => {
        const yearText = card.querySelector('.year-label')?.textContent || "";
        const isDigital = card.classList.contains('digital-variant');
        const matchesYear = (selectedYear === 'all' || yearText.includes(selectedYear));
        const matchesFormat = (selectedFormat === 'all') || (selectedFormat === 'digital' && isDigital) || (selectedFormat === 'fisico' && !isDigital);
        card.style.display = (matchesYear && matchesFormat) ? 'flex' : 'none';
    });
}

function updateYearFilters(games) {
    const container = document.getElementById('year-buttons-container');
    if (!container) return;
    const counts = { all: games.length };
    games.forEach(j => {
        const f = j["Ultima fecha"] || j["Año"] || "";
        const m = String(f).match(/\d{4}/);
        if (m) counts[m[0]] = (counts[m[0]] || 0) + 1;
    });
    const years = Object.keys(counts).filter(y => y !== 'all').sort((a,b) => b-a);
    container.innerHTML = `<button class="year-btn active" data-year="all">Todos (${counts.all})</button>` + 
        years.map(y => `<button class="year-btn" data-year="${y}">${y} (${counts[y]})</button>`).join('');
    
    container.querySelectorAll('.year-btn').forEach(btn => {
        btn.onclick = () => {
            selectedYear = btn.dataset.year;
            container.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCombinedFilters();
        };
    });
}

function setupFormatFilterEvents() {
    const container = document.getElementById('format-buttons-container-played');
    if (!container) return;
    container.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
            const t = btn.textContent.toUpperCase();
            selectedFormat = t.includes("DIGITAL") ? 'digital' : (t.includes("FISICO") || t.includes("FÍSICO") ? 'fisico' : 'all');
            container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCombinedFilters();
        };
    });
}
