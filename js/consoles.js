/**
 * consoles.js - Renderizado de la Colección de Hardware
 */

function renderConsolas(consolas) {
    const container = document.getElementById('consolas-grid');
    if (!container) return;
    
    container.innerHTML = "";
    
    if (!consolas || consolas.length === 0) {
        container.innerHTML = `
            <div style='grid-column: 1/-1; text-align:center; padding: 60px 20px;'>
                <i class="fa-solid fa-microchip" style="font-size: 3rem; color: #333; margin-bottom: 20px; display: block;"></i>
                <p style='color: #888; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;'>No hay consolas en esta categoría</p>
            </div>`;
        return;
    }

    const html = consolas.map(c => createConsoleCardHTML(c)).join('');
    container.innerHTML = html;
}

function createConsoleCardHTML(c) {
    try {
        if (typeof AppUtils === 'undefined') return "";

        // --- PREPARACIÓN DE DATOS ---
        const plat = c["Plataforma"] || "";
        const carpeta = AppUtils.getPlatformFolder(plat);
        const portada = c["Portada"] ? c["Portada"].trim() : "";
        // Nota: Asumo que las fotos de consolas van en una carpeta 'consoles' dentro de covers o similar
        const fotoUrl = AppUtils.isValid(portada) ? `images/covers/${carpeta}/${portada}` : `images/covers/default.webp`;
        
        const styleRegion = AppUtils.getRegionStyle(c["Región"]);
        const modelo = c["Modelo"] || "";
        const esModeloEspecial = AppUtils.isValid(modelo) && modelo.toUpperCase() !== "ESTÁNDAR";

        // Helpers de estilo
        const toRgba = (hex, alpha = 0.15) => {
            if (!hex || !hex.startsWith('#')) return `rgba(255,255,255,${alpha})`;
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const getScoreColor = (val) => {
            const n = parseFloat(val);
            if (isNaN(n)) return "#555";
            if (n < 5) return "#ff4444"; // Rojo
            if (n < 8) return "#ffbb33"; // Amarillo/Naranja
            return "#00c851"; // Verde
        };

        const scoreColor = getScoreColor(c["Estado General"]);

        // --- CONSTRUCCIÓN DEL HTML ---
        return `
        <div class="card ${AppUtils.getBrandClass(plat)}" style="display: flex; flex-direction: column; overflow: hidden; min-height: 520px;">
            
            <div style="display: flex; height: 45px; align-items: stretch; position: relative; z-index: 10;">
                <div style="flex: 0 0 60%;" class="icon-gradient-area">
                    <div class="card-platform-box">
                        ${AppUtils.getPlatformIcon(plat)}
                    </div>
                </div>
                <div style="flex: 0 0 40%; background: ${toRgba(scoreColor, 0.2)}; color: ${scoreColor}; font-weight: 900; display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 0.5rem; text-transform: uppercase; opacity: 0.8; line-height: 1;">Estado</span>
                    <span style="font-size: 1.1rem;">${c["Estado General"] || "?"}</span>
                </div>
            </div>
            
            <div style="padding: 15px 15px 0 15px;">
                ${esModeloEspecial ? 
                    `<div style="color: var(--cyan); font-size: 0.6rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 1px;">
                        <i class="fa-solid fa-microchip"></i> ${modelo}
                    </div>` : '<div style="height:12px"></div>'
                }
                <div class="game-title" style="padding:0; line-height: 1.1; margin-bottom: 4px; font-size: 1.2rem;">${c["Nombre Consola"]}</div>
                <div style="font-size: 0.7rem; color: #666; min-height: 14px;">
                    ${c["Versión"] || ""}
                </div>

                <div style="margin-top: 8px; line-height: 1.2; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <div style="font-size: 0.6em; padding: 2px 6px; border-radius: 4px; background: ${styleRegion.bg}; border: 1px solid ${styleRegion.border}; color: ${styleRegion.text}; font-weight: bold;">
                        ${AppUtils.getFlag(c["Región"])} ${c["Región"] || "N/A"}
                    </div>
                    <span style="font-size: 0.7em; color: #888; font-weight: bold;">Fab: ${c["Año Fabricación"] || "????"}</span>
                </div>
            </div>

            <div style="height: 160px; margin: 15px 15px; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(255,255,255,0.03);">
                <img src="${fotoUrl}" loading="lazy" style="max-width: 95%; max-height: 95%; object-fit: contain;" onerror="this.src='images/covers/default.webp'">
            </div>

            <div style="margin: 0 15px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px; flex-grow: 1; display: flex; flex-direction: column; gap: 6px; border: 1px solid rgba(255,255,255,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                    <span style="font-size: 0.55rem; color: #555; font-weight: 800; text-transform: uppercase;">Modificada</span>
                    <span style="font-size: 0.65rem; color: ${c["Modificada"] === 'No' ? '#888' : 'var(--cyan)'}; font-weight: 900;">${(c["Modificada"] || "NO").toUpperCase()}</span>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.5rem; color: #555; font-weight: 800; text-transform: uppercase;">Tipo Mod / Detalles</span>
                    <span style="font-size: 0.65rem; color: #bbb; line-height: 1.2;">${c["Tipo Mod"] || "Sin modificaciones"}</span>
                </div>
                <div style="display: flex; flex-direction: column; margin-top: 4px;">
                    <span style="font-size: 0.5rem; color: #555; font-weight: 800; text-transform: uppercase;">Accesorios Originales</span>
                    <span style="font-size: 0.65rem; color: #bbb;">${c["Accesorios originales"] || "Ninguno"}</span>
                </div>
            </div>

            <div style="margin-top: 15px; height: 55px; border-top: 1px solid rgba(255,255,255,0.03); display: flex; align-items: stretch; background: rgba(0,0,0,0.1);">
                <div style="flex: 1; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 2px;">
                    <span style="font-size: 0.45rem; color: #555; font-weight: 800; text-transform: uppercase;">Estado</span>
                    <span style="font-size: 0.6rem; color: var(--accent); font-weight: 900; line-height: 1;">${(c["Completitud"] || "SUELTA").toUpperCase()}</span>
                </div>
                <div style="flex: 1; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="font-size: 0.45rem; color: #555; font-weight: 800; text-transform: uppercase;">Nº Serie</span>
                    <span style="font-size: 0.55rem; color: #aaa; font-family: monospace;">${c["Número Serie"] || "S/N"}</span>
                </div>
                <div style="flex: 1; background: rgba(46, 158, 127, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 2px;">
                    <span style="font-size: 0.45rem; color: #2e9e7f; font-weight: 800; text-transform: uppercase;">Tasación</span>
                    <span style="font-size: 0.7rem; color: #fff; font-weight: 900;">${c["Tasación"] || "---"}</span>
                    <span style="font-size: 0.4rem; color: #555;">${c["Fecha revisión"] || ""}</span>
                </div>
            </div>
        </div>`;
    } catch (e) { 
        console.error("Error en card consolas:", e);
        return ""; 
    }
}
