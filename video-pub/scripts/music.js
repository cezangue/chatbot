// Musique et bruitages synthétisés (libres de droits) :
//  public/music-a.wav : boucle calme et mineure (histoire de Jean)
//  public/music-b.wav : boucle rythmée et majeure (méthode de Paul)
//  public/sfx/applause.wav : applaudissements
const fs = require('fs');
const SR = 22050;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function save(name, buf) {
  const N = buf.length, out = Buffer.alloc(44 + N * 2);
  out.write('RIFF', 0); out.writeUInt32LE(36 + N * 2, 4); out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++) out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i])) * 32000), 44 + i * 2);
  fs.mkdirSync(require('path').dirname(name), {recursive: true});
  fs.writeFileSync(name, out);
}

function loop(prog, bars, upbeat) {
  const BPM = 100, beat = 60 / BPM, bar = beat * 4, dur = bars * bar, N = Math.floor(SR * dur);
  const buf = new Float32Array(N);
  const chordBars = bars / prog.length;
  for (let i = 0; i < N; i++) {
    const t = i / SR, ci = Math.floor(t / (bar * chordBars)) % prog.length, ct = t % (bar * chordBars), cl = bar * chordBars;
    const env = Math.min(1, ct / 0.5) * Math.min(1, (cl - ct) / 0.3);
    let s = 0;
    for (const m of prog[ci]) {
      const f = hz(m);
      s += 0.11 * env * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t) + 0.12 * Math.sin(2 * Math.PI * f * 0.998 * t));
    }
    const bt = t % beat, bi = Math.floor(t / beat);
    if (upbeat) {
      s += 0.26 * Math.exp(-bt * 6) * Math.sin(2 * Math.PI * hz(prog[ci][0] - 24) * t);
      s += 0.45 * Math.exp(-bt * 18) * Math.sin(2 * Math.PI * (50 + 90 * Math.exp(-bt * 30)) * bt);
      const ht = (t + beat / 2) % beat;
      s += 0.05 * Math.exp(-ht * 60) * rnd();
      const at = t % (beat / 2), ai = Math.floor(t / (beat / 2));
      s += 0.06 * Math.exp(-at * 8) * Math.sin(2 * Math.PI * hz(prog[ci][ai % 3] + 12) * t);
    } else {
      s += (bi % 2 ? 0 : 0.05) * Math.exp(-bt * 3) * Math.sin(2 * Math.PI * hz(33) * t);
      const pt = t % (beat * 2);
      s += 0.03 * Math.exp(-pt * 4) * Math.sin(2 * Math.PI * hz(prog[ci][2] + 12) * t);
    }
    buf[i] = Math.tanh(s) * 0.8;
  }
  return buf;
}

save(__dirname + '/../public/music-a.wav', loop([[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], 16, false));
save(__dirname + '/../public/music-b.wav', loop([[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], 16, true));

// applaudissements : nombreux claquements brefs de bruit filtré
const A = new Float32Array(SR * 5);
for (let c = 0; c < 900; c++) {
  const t0 = Math.floor(Math.pow(Math.random(), 1.3) * (A.length - 3000));
  const amp = 0.25 + Math.random() * 0.25, dec = 300 + Math.random() * 500;
  let lp = 0;
  for (let k = 0; k < 2500; k++) { lp = lp * 0.55 + rnd() * 0.45; A[t0 + k] += amp * lp * Math.exp(-k / dec * 6); }
}
for (let i = 0; i < A.length; i++) A[i] *= Math.min(1, i / 2000) * Math.min(1, (A.length - i) / 20000);
save(__dirname + '/../public/sfx/applause.wav', A);
console.log('musique et bruitages générés');
