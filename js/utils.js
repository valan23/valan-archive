/**
 * utils.js - Funciones globales compartidas
 */
const TASA_CAMBIO_YEN = 180;

const AppUtils = {
    isValid: (val) => val && val.toString().trim() !== "" && val.toString().toUpperCase() !== "NA",

    getPlatformFolder: (platform) => {
        const platformMap = { "Famicom": "fc", "Famicom Disk System": "fds", "Super Famicom": "sfc" };
        const p = platform ? platform.trim() : "";
        return platformMap[p] || p.toLowerCase().replace(/\s+/g, '');
    },

    getRegionStyle: (region) => {
        const def = { bg: "rgba(255,255,255,0.1)", text: "#ccc", border: "transparent" };
        if (!region || typeof REGION_COLORS === 'undefined') return def;
        const r = region.toUpperCase().trim();
        return REGION_COLORS[r] || def;
    },

    getCompletitudStyle: (valor) => {
        if (!valor || typeof COMPLETITUD_COLORS === 'undefined') return "#555";
        const v = valor.toUpperCase().trim();
        if (COMPLETITUD_COLORS[v]) return COMPLETITUD_COLORS[v].color;
        for (let key in COMPLETITUD_COLORS) {
            if (v.includes(key)) return COMPLETITUD_COLORS[key].color;
        }
        return "#555";
    },

    obtenerValorEnEuros: (precioStr) => {
        if (!AppUtils.isValid(precioStr)) return Infinity;
        const numStr = precioStr.toString().replace(/[^\d,.]/g, '').replace(',', '.');
        const num = parseFloat(numStr);
        if (isNaN(num)) return Infinity;

        const pLow = precioStr.toLowerCase();
        const esTiendaJaponesa = precioStr.includes('¥') || pLow.includes('surugaya') || pLow.includes('mercari');
        
        return esTiendaJaponesa ? (num / TASA_CAMBIO_YEN) : num;
    },

    getRarezaColor: (rareza) => {
        const r = (rareza || "").toUpperCase();
        if (r.includes("LEGENDARIO")) return "#F2B518"; // Dorado
        if (r.includes("ÉPICO")) return "#bf00ff";     // Púrpura
        if (r.includes("RARO")) return "#0259D1";    // Azul
        if (r.includes("INUSUAL")) return "#3AE627";    // Verde
        if (r.includes("COMÚN")) return "#FFFFFF";    // Blanco
        return "#aaa";                                // Gris estándar
    },

    formatEstado: (estado) => {
        if (!estado) return "-";
        return estado.toString().toUpperCase();
    },

    // --- NUEVAS FUNCIONES INTEGRADAS ---

    getBrandClass: (plataformaStr) => {
        const p = (plataformaStr || "").toUpperCase();
        if (p.includes("PC ENGINE") || p.includes("TURBOGRAFX") || p.includes("WONDERSWAN") || p.includes("3DO")) return "otros";
        if (p.includes("NINTENDO") || p.includes("FAMICOM") || p.includes("BOY") || p.includes("CUBE") || p.includes("WII") || p.includes("SWITCH")) return "nintendo";
        if (p.includes("SEGA") || p.includes("MEGA") || p.includes("MASTER SYSTEM") || p.includes("GEAR") || p.includes("32X") || p.includes("SATURN") || p.includes("DREAMCAST")) return "sega";
        if (p.includes("PLAYSTATION") || p.includes("PS")) return "sony";
        if (p.includes("XBOX")) return "xbox";
        if (p.includes("PC") || p.includes("STEAM") || p.includes("GOG") || p.includes("EPIC") || p.includes("DOS") || p.includes("BATTLE") || p.includes("WINDOWS") || p.includes("RETROARCH")) return "pc";
        return "otros";
    },

    getPlatformIcon: (platformName) => {
        if (!platformName || typeof BRANDS_CONFIG === 'undefined') return '';
        for (const brand in BRANDS_CONFIG) {
            if (BRANDS_CONFIG[brand].icons?.[platformName]) {
                return `<img src="${BRANDS_CONFIG[brand].icons[platformName]}" alt="${platformName}" style="height: 20px; width: auto;">`;
            }
        }
        return `<span class="platform-tag">${platformName}</span>`;
    },

    getFlag: (region) => {
        if (!region) return '<span class="fi fi-xx"></span>';
        const codes = { "ESP": "es", "JAP": "jp", "USA": "us", "EU": "eu", "UK": "gb", "ITA": "it", "GER": "de", "AUS": "au", "ASIA": "hk" };
        const r = region.toUpperCase();
        let code = "xx";
        for (let key in codes) { if (r.includes(key)) code = codes[key]; }
        return `<span class="fi fi-${code}"></span>`;
    }
};
