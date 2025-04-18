// 5m 2h 1d 30s => ms
module.exports = txt => {
    const m = txt.match(/^(\d+)([smhdw])$/i);
    if (!m) return null;
    const n = Number(m[1]);
    return { s:1e3, m:6e4, h:3.6e6, d:8.64e7, w:6.048e8 }[m[2]] * n;
};
