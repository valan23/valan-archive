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
        if (!region) return { bg: "rgba(255,255,255,0.1)", text: "#ccc", border: "transparent" };
        const r = region.toUpperCase().trim();
        // Asumimos que REGION_COLORS está definido en config.js
        return (typeof REGION_COLORS !== 'undefined' && REGION_COLORS[r]) 
            ? REGION_COLORS[r] 
            : { bg: "rgba(255,255,255,0.1)", text: "#ccc", border: "transparent" };
    },

    getCompletitudStyle: (valor) => {
        if (!valor) return "#555";
        const v = valor.toUpperCase().trim();
        if (typeof COMPLETITUD_COLORS !== 'undefined') {
            if (COMPLETITUD_COLORS[v]) return COMPLETITUD_COLORS[v].color;
            for (let key in COMPLETITUD_COLORS) {
                if (v.includes(key)) return COMPLETITUD_COLORS[key].color;
            }
        }
        return "#555";
    },

    formatEstado: (valor) => {
        if (!AppUtils.isValid(valor)) return "";
        const v = valor.toString().toUpperCase().trim();
        if (v === "FALTA" || v === "NO") {
            return `<span style="color: #ff4444; font-weight: 900; letter-spacing: 1px;">FALTA</span>`;
        }
        const num = parseFloat(valor);
        if (isNaN(num)) return valor;
        const hue = Math.min(Math.max(num * 12, 0), 120); 
        return `<span style="color: hsl(${hue}, 100%, 50%);">${num}/10</span>`;
    },

    getRarezaColor: (rareza) => {
        const r = rareza ? rareza.toString().toUpperCase() : "";
        if (r.includes("LEGENDARIO")) return "#EFC36C"; 
        if (r.includes("ÉPICO"))      return "#A335EE"; 
        if (r.includes("RARO"))       return "#0070DD"; 
        if (r.includes("INUSUAL"))    return "#1EFF00"; 
        if (r.includes("COMÚN"))      return "#FFFFFF"; 
        return "#888";
    },

    obtenerValorEnEuros: (precioStr) => {
        if (!AppUtils.isValid(precioStr)) return Infinity;
        const num = parseFloat(precioStr.toString().replace(/[^0-9.,]/g, '').replace(',', '.'));
        if (isNaN(num)) return Infinity;
        const esTiendaJaponesa = precioStr.includes('¥') || 
                                 precioStr.toLowerCase().includes('surugaya') || 
                                 precioStr.toLowerCase().includes('mercari');
        return esTiendaJaponesa ? (num / TASA_CAMBIO_YEN) : num;
    }
};
