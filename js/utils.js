/**
 * utils.js - Funciones globales para evitar duplicación
 */
const AppUtils = {
    isValid: (val) => val && val.toString().trim() !== "" && val.toString().toUpperCase() !== "NA",

    getPlatformFolder: (platform) => {
        const platformMap = { "Famicom": "fc", "Famicom Disk System": "fds", "Super Famicom": "sfc" };
        const p = platform ? platform.trim() : "";
        return platformMap[p] || p.toLowerCase().replace(/\s+/g, '');
    },

    formatEstado: (valor) => {
        if (!AppUtils.isValid(valor)) return "";
        const v = valor.toString().toUpperCase().trim();
        if (v === "FALTA" || v === "NO") {
            return `<span style="color: #ff4444; font-weight: 900;">FALTA</span>`;
        }
        const num = parseFloat(valor);
        if (isNaN(num)) return valor;
        const hue = Math.min(Math.max(num * 12, 0), 120); 
        return `<span style="color: hsl(${hue}, 100%, 50%);">${num}/10</span>`;
    },

    getRarezaColor: (rareza) => {
        const r = rareza ? rareza.toString().toUpperCase() : "";
        const colors = { "LEGENDARIO": "#EFC36C", "ÉPICO": "#A335EE", "RARO": "#0070DD", "INUSUAL": "#1EFF00", "COMÚN": "#FFFFFF" };
        return colors[Object.keys(colors).find(key => r.includes(key))] || "#888";
    }
};
