// Génère une musique d'ambiance libre de droits (synthèse) : public/music.wav
// Partie 1 (histoire de Jean) : nappe mineure calme ; partie 2 (méthode de Paul) : progression majeure rythmée.
const fs = require('fs');
const SR = 22050, DUR = 6840 / 30, SWITCH = 70; // 70 s = début de la scène « Quelques temps plus tard »
const N = Math.floor(SR * DUR);
const buf = new Float32Array(N);
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const minor = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]]; // Am F Dm E
const major = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]; // C G Am F
const BPM = 100, beat = 60 / BPM, bar = beat * 4;
let seed = 1; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
for (let i = 0; i < N; i++) {
  const t = i / SR, part2 = t >= SWITCH, tt = part2 ? t - SWITCH : t;
  const prog = part2 ? major : minor, chordLen = part2 ? bar : bar * 2;
  const ci = Math.floor(tt / chordLen) % 4, ct = tt % chordLen;
  const env = Math.min(1, ct / 0.6) * Math.min(1, (chordLen - ct) / 0.4);
  let s = 0;
  for (const m of prog[ci]) {
    const f = hz(m);
    s += 0.12 * env * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2.003 * t) + 0.15 * Math.sin(2 * Math.PI * f * 0.999 * t));
  }
  const bt = tt % beat;
  if (part2) {
    const bf = hz(prog[ci][0] - 24);
    s += 0.28 * Math.exp(-bt * 6) * Math.sin(2 * Math.PI * bf * t);                       // basse
    s += 0.5 * Math.exp(-bt * 18) * Math.sin(2 * Math.PI * (50 + 90 * Math.exp(-bt * 30)) * bt); // grosse caisse
    const ht = (tt + beat / 2) % beat;
    s += 0.05 * Math.exp(-ht * 60) * rnd();                                                  // charleston
    const arp = prog[ci][Math.floor(tt / (beat / 2)) % 3] + 12, at = tt % (beat / 2);
    s += 0.07 * Math.exp(-at * 8) * Math.sin(2 * Math.PI * hz(arp) * t);                    // arpège
  } else {
    s += 0.04 * Math.exp(-bt * 3) * Math.sin(2 * Math.PI * hz(45) * t) * (Math.floor(tt / beat) % 2 ? 0 : 1); // pulsation sourde
  }
  const x = Math.max(0, Math.min(1, (t - SWITCH + 1) / 2));
  buf[i] = Math.tanh(s * (part2 ? 1 : 0.9)) * (part2 ? 0.8 : 0.7) * (t < SWITCH - 1 ? 1 : x || 1);
}
const out = Buffer.alloc(44 + N * 2);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 2, 4); out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) out.writeInt16LE(Math.round(buf[i] * 32000), 44 + i * 2);
fs.writeFileSync(__dirname + '/../public/music.wav', out);
console.log('music.wav', (out.length / 1e6).toFixed(1), 'MB');
