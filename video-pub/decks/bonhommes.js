// Illustrations « Bonhomme » (personnages 3D blancs, style du manuel) rendues en PNG haute définition.
const sharp = require('sharp');
const fs = require('fs');

const DEFS = `<defs>
<radialGradient id="g" cx="35%" cy="28%" r="80%"><stop offset="0%" stop-color="#ffffff"/><stop offset="62%" stop-color="#e7ebf1"/><stop offset="100%" stop-color="#a9b3c1"/></radialGradient>
<radialGradient id="bulb" cx="40%" cy="35%" r="70%"><stop offset="0%" stop-color="#fff7c2"/><stop offset="70%" stop-color="#ffc400"/><stop offset="100%" stop-color="#e09a00"/></radialGradient>
<linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#ffd54a"/><stop offset="1" stop-color="#d99a00"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>`;

// Un bonhomme dans un repère 200×400, placé en (x, y) avec l'échelle s
function man({x = 0, y = 0, s = 1, tie, scarf, hair, armL = 8, armR = -8, tilt = 0, legL = 0, legR = 0}) {
	return `<g transform="translate(${x} ${y}) scale(${s})">
<ellipse cx="100" cy="394" rx="72" ry="10" fill="#000" opacity="0.18" filter="url(#sh)"/>
<g transform="rotate(${legL} 85 240)"><rect x="70" y="236" width="29" height="154" rx="14" fill="url(#g)"/><ellipse cx="82" cy="388" rx="20" ry="9" fill="#2b2f38"/></g>
<g transform="rotate(${legR} 115 240)"><rect x="101" y="236" width="29" height="154" rx="14" fill="url(#g)"/><ellipse cx="118" cy="388" rx="20" ry="9" fill="#2b2f38"/></g>
<g transform="rotate(${armL} 64 120)"><rect x="50" y="108" width="27" height="118" rx="13" fill="url(#g)"/><circle cx="63" cy="230" r="15" fill="url(#g)"/></g>
<g transform="rotate(${armR} 136 120)"><rect x="123" y="108" width="27" height="118" rx="13" fill="url(#g)"/><circle cx="137" cy="230" r="15" fill="url(#g)"/></g>
<rect x="55" y="98" width="90" height="158" rx="40" fill="url(#g)"/>
${tie ? `<path d="M96 104 L104 104 L109 162 L100 176 L91 162 Z" fill="${tie}"/>` : ''}
${scarf ? `<path d="M68 104 Q100 128 132 104 L128 118 Q100 140 72 118 Z" fill="${scarf}"/>` : ''}
<g transform="rotate(${tilt} 100 96)">${hair ? '<circle cx="100" cy="14" r="22" fill="url(#g)"/>' : ''}<circle cx="100" cy="56" r="44" fill="url(#g)"/></g>
</g>`;
}

const bulb = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="40" cy="40" r="60" fill="#ffe680" opacity="0.35" filter="url(#sh)"/><circle cx="40" cy="40" r="36" fill="url(#bulb)"/><rect x="26" y="72" width="28" height="22" rx="4" fill="#9aa4b2"/><rect x="30" y="94" width="20" height="8" rx="3" fill="#6b7280"/></g>`;
const qmark = (x, y, s = 1, c = '#e3262e') => `<text x="${x}" y="${y}" font-family="DejaVu Sans" font-weight="bold" font-size="${120 * s}" fill="${c}">?</text>`;
const trophy = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M10 0 H90 V30 Q90 80 50 90 Q10 80 10 30 Z" fill="url(#gold)"/><path d="M10 12 Q-18 12 -8 40 Q0 58 18 56" fill="none" stroke="#d99a00" stroke-width="8"/><path d="M90 12 Q118 12 108 40 Q100 58 82 56" fill="none" stroke="#d99a00" stroke-width="8"/><rect x="40" y="88" width="20" height="24" fill="#d99a00"/><rect x="22" y="110" width="56" height="16" rx="4" fill="#8a5a00"/></g>`;
const flag = (x, y, s = 1, c = '#ff7a00') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="6" height="140" fill="#475467"/><path d="M6 4 L80 22 L6 44 Z" fill="${c}"/></g>`;
const gear = (x, y, s = 1, c = '#2f7cf6') => {
	const teeth = [...Array(8)].map((_, i) => `<rect x="-9" y="-62" width="18" height="24" rx="3" fill="${c}" transform="rotate(${i * 45})"/>`).join('');
	return `<g transform="translate(${x} ${y}) scale(${s})">${teeth}<circle r="44" fill="${c}"/><circle r="18" fill="#fff"/></g>`;
};
const papers = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[...Array(9)].map((_, i) => `<rect x="${(i % 2) * 6}" y="${-i * 16}" width="110" height="14" rx="2" fill="#fff" stroke="#c9d1dc" stroke-width="2"/>`).join('')}</g>`;
const arrow = (x, y, s = 1, c = '#ff7a00', rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="0" y="-12" width="110" height="24" rx="12" fill="${c}"/><path d="M100 -38 L150 0 L100 38 Z" fill="${c}"/></g>`;
const stairs = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 1, 2, 3].map((i) => `<rect x="${i * 90}" y="${-i * 70}" width="90" height="${i * 70 + 40}" fill="${['#c7d2e6', '#9fb3d9', '#4b6cb7', '#ff7a00'][i]}"/>`).join('')}</g>`;
const target = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="80" fill="#e3262e"/><circle r="60" fill="#fff"/><circle r="40" fill="#e3262e"/><circle r="20" fill="#fff"/><circle r="8" fill="#e3262e"/><path d="M-4 -4 L-120 -90" stroke="#0b1f4d" stroke-width="8"/><path d="M-120 -90 l-10 -30 l30 10 Z" fill="#0b1f4d"/></g>`;
const board = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="240" height="160" rx="8" fill="#fff" stroke="#d0d5dd" stroke-width="6"/><polyline points="20,130 80,95 130,110 180,55 220,30" fill="none" stroke="#ff7a00" stroke-width="10" stroke-linecap="round"/><rect x="110" y="160" width="10" height="90" fill="#98a2b3"/></g>`;
const rocket = (x, y, s = 1) => `<g transform="translate(${x} ${y}) rotate(35) scale(${s})"><path d="M0 -90 Q40 -40 30 40 H-30 Q-40 -40 0 -90 Z" fill="#f2f4f7" stroke="#98a2b3" stroke-width="4"/><circle cy="-20" r="16" fill="#2f7cf6"/><path d="M-30 20 L-60 60 L-30 40 Z M30 20 L60 60 L30 40 Z" fill="#e3262e"/><path d="M-18 42 Q0 110 18 42 Z" fill="#ffc400"/></g>`;
const book = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q40 -12 80 0 V70 Q40 58 0 70 Z" fill="#2f7cf6"/><path d="M80 0 Q120 -12 160 0 V70 Q120 58 80 70 Z" fill="#1d5fd1"/></g>`;
const puzzle = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 H50 Q50 -20 70 -20 Q90 -20 90 0 H140 V140 H0 Z" fill="#22c55e"/></g>`;

const ORANGE = '#ff7a00', BLUE = '#2f7cf6', NAVY = '#0b1f4d', GREEN = '#16a34a', VIOLET = '#8b5cf6';

const scenes = {
	presenter: [420, 440, man({x: 20, y: 20, tie: ORANGE, armR: -100}) + board(170, 60, 1)],
	victory: [360, 440, man({x: 60, y: 30, tie: ORANGE, armL: 155, armR: -155}) + trophy(240, 20, 0.9)],
	thinking: [320, 440, man({x: 20, y: 30, tilt: -12, armR: -150}) + qmark(190, 130, 1)],
	idea: [340, 460, man({x: 20, y: 50, tie: BLUE, armR: -160, armL: 15}) + bulb(210, 10, 1)],
	handshake: [420, 420, man({x: 10, y: 10, tie: ORANGE, armR: -70}) + man({x: 200, y: 10, tie: BLUE, armL: 70})],
	team: [560, 440, man({x: 0, y: 30, tie: ORANGE, armL: 150}) + man({x: 180, y: 10, tie: BLUE, armL: 150, armR: -150}) + man({x: 360, y: 30, tie: GREEN, armR: -150}) + puzzle(230, 430, 0)],
	tired: [400, 430, man({x: 10, y: 20, tilt: 28, armL: -10, armR: 25}) + papers(240, 390, 1.1) + papers(300, 390, 0.9)],
	climb: [520, 540, stairs(40, 500, 1.1) + man({x: 330, y: 70, s: 0.95, tie: ORANGE, armL: 150, armR: -150}) + flag(460, 120, 0.8)],
	target: [480, 440, man({x: 10, y: 30, tie: BLUE, armR: -95}) + target(360, 200, 1)],
	process: [520, 420, man({x: 0, y: 10, tie: BLUE, armR: -110}) + gear(300, 150, 1) + gear(420, 250, 0.7, ORANGE)],
	engineer: [440, 440, man({x: 20, y: 30, hair: true, scarf: VIOLET, armR: -100}) + board(180, 60, 1)],
	student: [380, 440, man({x: 20, y: 30, scarf: '#0ea5e9', armR: -120}) + book(190, 120, 1)],
	teacher: [440, 440, man({x: 20, y: 30, tie: GREEN, armR: -100}) + board(180, 60, 1)],
	entrepreneur: [420, 460, man({x: 20, y: 50, tie: ORANGE, armR: -150}) + rocket(300, 140, 0.9)],
	growth: [460, 420, man({x: 10, y: 10, tie: ORANGE, armR: -120}) + arrow(200, 250, 1.2, ORANGE, -35)],
};

(async () => {
	fs.mkdirSync('assets', {recursive: true});
	for (const [name, [w, h, body]] of Object.entries(scenes)) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
		await sharp(Buffer.from(svg), {density: 300}).resize({height: 1000}).png().toFile(`assets/bh-${name}.png`);
	}
	console.log('bonhommes :', Object.keys(scenes).length);
})();
