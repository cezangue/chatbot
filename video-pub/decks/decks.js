// Génère les vraies présentations PowerPoint utilisées dans la vidéo.
// Un seul exemple cohérent : le « Projet Horizon » de l'entreprise de M. Koffi.
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');

const img = (n) => `assets/bh-${n}.png`;
const ratio = {};
const H = async (n) => {
	if (!ratio[n]) {
		const m = await sharp(img(n)).metadata();
		ratio[n] = m.width / m.height;
	}
	return ratio[n];
};
// place une illustration de hauteur h (pouces), ancrée en bas à (x, yBottom)
const bh = async (s, n, x, yBottom, h) => s.addImage({path: img(n), x, y: yBottom - h, w: h * (await H(n)), h});

const T = (s, text, o) => s.addText(text, {isTextBox: true, margin: 0, fontFace: 'Arial', ...o});
const shadow = () => ({type: 'outer', color: '0B1F4D', blur: 8, offset: 2, angle: 90, opacity: 0.12});

// ─────────────────────────────── PAUL — Méthode Bonhomme ───────────────────────────────
async function paul() {
	const NAVY = '0B1F4D', OR = 'FF7A00', LIGHT = 'F3F5F9', MUTED = '5B6475';
	const p = new pptxgen();
	p.layout = 'LAYOUT_16x9';
	p.title = 'Projet Horizon — Bilan 2026';

	// 1. Titre
	let s = p.addSlide();
	s.background = {color: NAVY};
	T(s, 'PROJET HORIZON', {x: 0.6, y: 1.2, w: 5.5, h: 0.4, fontSize: 14, bold: true, color: OR, charSpacing: 4});
	T(s, 'Bilan 2026 : ce qui a marché, et pourquoi', {x: 0.6, y: 1.65, w: 5.6, h: 1.4, fontSize: 34, bold: true, color: 'FFFFFF', valign: 'top'});
	T(s, 'Paul N. · Réunion de direction · Décembre 2026', {x: 0.6, y: 3.4, w: 5.5, h: 0.35, fontSize: 13, color: 'C7D2FE'});
	await bh(s, 'presenter', 6.2, 5.2, 3.9);
	s.addNotes('Accroche : un chiffre, puis l’annonce du plan en 3 leviers.');

	// 2. Objectif
	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'NOTRE OBJECTIF', {x: 0.6, y: 0.5, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, 'Répondre plus vite à nos clients, sans recruter', {x: 0.6, y: 0.85, w: 5.4, h: 1.2, fontSize: 30, bold: true, color: NAVY, valign: 'top'});
	s.addShape(p.shapes.ROUNDED_RECTANGLE, {x: 0.6, y: 2.45, w: 5.2, h: 2.3, fill: {color: LIGHT}, rectRadius: 0.12, line: {color: LIGHT}});
	T(s, 'Délai moyen de réponse', {x: 0.9, y: 2.65, w: 4.6, h: 0.3, fontSize: 14, color: MUTED});
	T(s, [{text: '48 h', options: {color: 'A0A8B8'}}, {text: '  →  ', options: {color: NAVY}}, {text: '12 h', options: {color: OR}}], {x: 0.9, y: 3.0, w: 4.8, h: 1.0, fontSize: 54, bold: true});
	T(s, 'cible fixée en janvier 2026', {x: 0.9, y: 4.1, w: 4.6, h: 0.3, fontSize: 13, italic: true, color: MUTED});
	await bh(s, 'target', 6.2, 5.0, 3.1);

	// 3. Les 3 leviers
	s = p.addSlide();
	s.background = {color: LIGHT};
	T(s, 'LES 3 LEVIERS', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, 'Ce qui explique notre évolution', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 30, bold: true, color: NAVY});
	const levers = [
		['1', 'Clients', 'Un seul numéro WhatsApp, réponse suivie de bout en bout', 'handshake'],
		['2', 'Processus', 'Demandes triées automatiquement par priorité', 'process'],
		['3', 'Équipe', '12 agents formés, objectifs partagés chaque semaine', 'team'],
	];
	for (let i = 0; i < 3; i++) {
		const [n, t, d, pic] = levers[i];
		const x = 0.6 + i * 3.0;
		s.addShape(p.shapes.ROUNDED_RECTANGLE, {x, y: 1.55, w: 2.75, h: 3.65, fill: {color: i === 0 ? NAVY : 'FFFFFF'}, rectRadius: 0.12, line: {color: i === 0 ? NAVY : 'FFFFFF'}, shadow: shadow()});
		T(s, n, {x: x + 0.25, y: 1.7, w: 0.6, h: 0.6, fontSize: 32, bold: true, color: OR});
		T(s, t, {x: x + 0.25, y: 2.3, w: 2.3, h: 0.4, fontSize: 20, bold: true, color: i === 0 ? 'FFFFFF' : NAVY});
		T(s, d, {x: x + 0.25, y: 2.72, w: 2.3, h: 0.75, fontSize: 12, color: i === 0 ? 'C7D2FE' : MUTED, valign: 'top'});
		const hh = pic === 'team' ? 1.45 : 1.6;
		const w = hh * (await H(pic));
		await bh(s, pic, x + (2.75 - w) / 2, 5.05, hh);
	}

	// 4. Résultats (graphique natif)
	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'RÉSULTATS', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, 'Chiffre d’affaires : +117 % en 4 trimestres', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: NAVY});
	s.addChart(p.charts.BAR, [{name: 'CA (M FCFA)', labels: ['T1', 'T2', 'T3', 'T4'], values: [42, 55, 68, 91]}], {
		x: 0.5, y: 1.45, w: 6.0, h: 3.8, barDir: 'col', chartColors: ['C7D2E6', 'C7D2E6', 'C7D2E6', OR], barGapWidthPct: 60,
		showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: NAVY, dataLabelFontSize: 14, dataLabelFontBold: true,
		catAxisLabelColor: MUTED, catAxisLabelFontSize: 13, valAxisHidden: true, valGridLine: {style: 'none'}, catGridLine: {style: 'none'},
		showLegend: false, showTitle: false,
	});
	// couleurs par barre
	T(s, '+117 %', {x: 6.8, y: 1.6, w: 2.8, h: 0.8, fontSize: 44, bold: true, color: OR});
	T(s, 'de 42 à 91 millions FCFA, porté par le levier Clients', {x: 6.8, y: 2.4, w: 2.8, h: 0.7, fontSize: 12, color: MUTED, valign: 'top'});
	await bh(s, 'climb', 6.9, 5.2, 2.0);

	// 5. Avant / Après
	s = p.addSlide();
	s.background = {color: LIGHT};
	T(s, 'AVANT / APRÈS', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, 'Délai de traitement divisé par 4', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 30, bold: true, color: NAVY});
	s.addShape(p.shapes.ROUNDED_RECTANGLE, {x: 0.6, y: 1.55, w: 4.2, h: 3.65, fill: {color: 'FFFFFF'}, rectRadius: 0.12, line: {color: 'FFFFFF'}, shadow: shadow()});
	T(s, 'Avant', {x: 0.9, y: 1.75, w: 2, h: 0.35, fontSize: 16, bold: true, color: MUTED});
	T(s, '48 h', {x: 0.9, y: 2.1, w: 2.2, h: 0.9, fontSize: 48, bold: true, color: 'A0A8B8'});
	T(s, 'dossiers papier, relances manuelles', {x: 0.9, y: 3.05, w: 1.9, h: 0.8, fontSize: 12, color: MUTED, valign: 'top'});
	await bh(s, 'tired', 2.75, 5.05, 2.0);
	s.addShape(p.shapes.ROUNDED_RECTANGLE, {x: 5.2, y: 1.55, w: 4.2, h: 3.65, fill: {color: NAVY}, rectRadius: 0.12, line: {color: NAVY}, shadow: shadow()});
	T(s, 'Après', {x: 5.5, y: 1.75, w: 2, h: 0.35, fontSize: 16, bold: true, color: 'C7D2FE'});
	T(s, '12 h', {x: 5.5, y: 2.1, w: 2.2, h: 0.9, fontSize: 48, bold: true, color: OR});
	T(s, 'suivi WhatsApp, tri automatique', {x: 5.5, y: 3.05, w: 1.9, h: 0.8, fontSize: 12, color: 'C7D2FE', valign: 'top'});
	await bh(s, 'victory', 7.5, 5.05, 2.1);

	// 6. Prochaines étapes
	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'PROCHAINES ÉTAPES', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, '2027 : étendre Horizon à toutes les agences', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: NAVY});
	const steps = [['T1 2027', 'Déployer à Douala et Yaoundé'], ['T2 2027', 'Former 30 nouveaux agents'], ['T3 2027', 'Objectif : réponse en 6 h']];
	s.addShape(p.shapes.LINE, {x: 0.9, y: 2.35, w: 5.4, h: 0, line: {color: 'D0D5DD', width: 2}});
	for (let i = 0; i < 3; i++) {
		const x = 0.7 + i * 2.1;
		s.addShape(p.shapes.OVAL, {x: x + 0.05, y: 2.1, w: 0.5, h: 0.5, fill: {color: i === 2 ? OR : NAVY}, line: {color: 'FFFFFF', width: 2}});
		T(s, String(i + 1), {x: x + 0.05, y: 2.1, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'});
		T(s, steps[i][0], {x, y: 2.8, w: 1.9, h: 0.35, fontSize: 15, bold: true, color: OR});
		T(s, steps[i][1], {x, y: 3.15, w: 2.05, h: 0.9, fontSize: 13, color: NAVY, valign: 'top'});
	}
	await bh(s, 'growth', 6.8, 5.0, 2.8);

	// 7. Conclusion
	s = p.addSlide();
	s.background = {color: NAVY};
	T(s, 'EN RÉSUMÉ', {x: 0.6, y: 1.0, w: 5, h: 0.3, fontSize: 12, bold: true, color: OR, charSpacing: 3});
	T(s, 'Horizon a tenu ses promesses : 4 fois plus rapide, +117 % de chiffre d’affaires', {x: 0.6, y: 1.35, w: 5.8, h: 1.9, fontSize: 28, bold: true, color: 'FFFFFF', valign: 'top'});
	T(s, 'Merci. Vos questions ?', {x: 0.6, y: 3.6, w: 5, h: 0.5, fontSize: 20, color: OR, bold: true});
	await bh(s, 'idea', 7.0, 5.1, 3.6);

	await p.writeFile({fileName: 'out/Paul_Projet_Horizon_Methode_Bonhomme.pptx'});
}

// ─────────────────────────────── JEAN / ESTHER — sans méthode ───────────────────────────────
async function jean() {
	const p = new pptxgen();
	p.layout = 'LAYOUT_16x9';
	p.title = 'Rapport projet Horizon';
	const lorem = [
		'Le projet Horizon a commencé en janvier 2026 avec de nombreuses réunions et actions menées par les équipes',
		'Le chiffre d’affaires a augmenté mais certains indicateurs ont aussi baissé selon les trimestres et les agences',
		'Le délai de traitement était de 48 heures en moyenne et il est maintenant d’environ 12 heures selon les dernières données',
		'Nous avons mis en place WhatsApp, un nouveau logiciel de tri, des formations et beaucoup d’autres choses',
		'Il faut noter que plusieurs facteurs externes ont influencé les résultats (saison, concurrence, météo, etc.)',
		'Budget, délais, ressources humaines, logistique, communication, partenaires, risques et perspectives 2027',
		'Les équipes ont travaillé très dur et nous les remercions tous pour leur engagement tout au long de l’année',
	];

	let s = p.addSlide();
	s.background = {color: 'FFF200'};
	s.addShape(p.shapes.OVAL, {x: -1, y: 3.2, w: 4, h: 4, fill: {color: 'FF4FD8'}});
	s.addShape(p.shapes.OVAL, {x: 7.5, y: -1.2, w: 3.5, h: 3.5, fill: {color: '00E1FF'}});
	T(s, 'RAPPORT DU PROJET HORIZON !!!', {x: 0.4, y: 1.4, w: 9.2, h: 1.2, fontFace: 'Comic Sans MS', fontSize: 44, bold: true, italic: true, color: 'D10000', rotate: -4, shadow: {type: 'outer', color: '0000AA', blur: 0, offset: 4, angle: 45, opacity: 1}});
	T(s, 'Présenté par Jean (avec l’aide d’Esther)', {x: 1.5, y: 2.9, w: 7, h: 0.5, fontFace: 'Times New Roman', fontSize: 22, color: '008800', align: 'center'});
	s.addShape(p.shapes.STAR_16_POINT, {x: 7.6, y: 3.3, w: 1.9, h: 1.9, fill: {color: 'FFEA00'}, line: {color: 'FF0000', width: 4}});
	T(s, 'NEW !!', {x: 7.6, y: 3.9, w: 1.9, h: 0.6, fontSize: 18, bold: true, color: 'FF0000', align: 'center'});

	s = p.addSlide();
	s.background = {color: 'E0F7FF'};
	T(s, 'Présentation du projet et des résultats', {x: 0.3, y: 0.15, w: 9.4, h: 0.6, fontFace: 'Courier New', fontSize: 26, bold: true, color: '7A00FF', underline: {style: 'sng'}});
	T(s, [...lorem, ...lorem.slice(0, 4)].map((t, i) => ({text: t, options: {bullet: true, breakLine: i < 10, color: ['000000', 'CC0000', '0044CC', '008800'][i % 4]}})), {x: 0.3, y: 0.85, w: 6.4, h: 4.6, fontFace: 'Times New Roman', fontSize: 11, valign: 'top'});
	s.addShape(p.shapes.RIGHT_ARROW, {x: 6.9, y: 1.0, w: 2.6, h: 1.0, fill: {color: 'FF6A00'}});
	T(s, 'IMPORTANT', {x: 6.9, y: 1.25, w: 2.2, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center'});
	s.addShape(p.shapes.OVAL, {x: 7.3, y: 2.4, w: 1.8, h: 1.8, fill: {color: 'FF4FD8'}, line: {color: '0000FF', width: 3, dashType: 'dash'}});
	T(s, '+117%', {x: 7.3, y: 3.0, w: 1.8, h: 0.6, fontFace: 'Comic Sans MS', fontSize: 20, bold: true, color: 'FFFF00', align: 'center'});

	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'LES CHIFFRES', {x: 0.3, y: 0.15, w: 9, h: 0.6, fontFace: 'Comic Sans MS', fontSize: 30, bold: true, color: '00AA00'});
	const rows = [['Trimestre', 'CA', 'Délai', 'Agents', 'Clients', 'Appels', 'Satisf.']].concat(
		['T1', 'T2', 'T3', 'T4'].map((t, i) => [t, `${[42, 55, 68, 91][i]} M`, `${[48, 36, 20, 12][i]} h`, `${8 + i}`, `${1200 + i * 450}`, `${3400 + i * 700}`, `${61 + i * 8} %`]),
	);
	s.addTable(rows.map((r, ri) => r.map((c, ci) => ({text: c, options: {fill: {color: ['FF0000', '00CC00', '0000FF', 'FFFF00', 'FF00FF'][(ri + ci) % 5]}, color: (ri + ci) % 5 === 3 ? '000000' : 'FFFFFF', fontSize: 11, fontFace: 'Arial'}}))), {x: 0.3, y: 0.95, w: 5.3, colW: [0.9, 0.7, 0.7, 0.7, 0.8, 0.75, 0.75], border: {type: 'solid', color: '000000', pt: 1}});
	s.addChart(p.charts.PIE, [{name: 'CA', labels: ['T1', 'T2', 'T3', 'T4'], values: [42, 55, 68, 91]}], {x: 5.8, y: 0.9, w: 4.0, h: 3.2, chartColors: ['FF0000', '00CC00', '0000FF', 'FFFF00'], showLegend: true, legendPos: 'r', showPercent: true, showTitle: true, title: 'Chiffre d’affaires 2026 (en millions) par trimestre', titleFontSize: 10});
	T(s, 'NB : les chiffres sont provisoires et peuvent encore changer, voir le tableau ci-dessus pour plus de détails sur chaque trimestre.', {x: 0.3, y: 4.5, w: 9.4, h: 0.8, fontFace: 'Times New Roman', fontSize: 12, italic: true, color: 'CC0000'});

	s = p.addSlide();
	s.background = {color: '00E1FF'};
	T(s, 'Merci de votre attention !!!', {x: 0.5, y: 1.8, w: 9, h: 1.2, fontFace: 'Comic Sans MS', fontSize: 48, bold: true, color: '7A00FF', align: 'center', rotate: 3});
	T(s, 'Des questions ???', {x: 2, y: 3.2, w: 6, h: 0.7, fontFace: 'Courier New', fontSize: 28, color: 'D10000', align: 'center'});
	s.addShape(p.shapes.SMILEY_FACE, {x: 8.2, y: 3.8, w: 1.4, h: 1.4, fill: {color: 'FFFF00'}});

	await p.writeFile({fileName: 'out/Jean_Esther_Rapport_Horizon_sans_methode.pptx'});
}

// ─────────────────────────────── SONIA — soutenance d'ingénieur ───────────────────────────────
async function sonia() {
	const TEAL = '065A82', DEEP = '04344D', Y = 'FFC400', LIGHT = 'EEF6FA', MUTED = '4B5B68';
	const p = new pptxgen();
	p.layout = 'LAYOUT_16x9';
	p.title = 'Soutenance — Réduction des pertes techniques';

	let s = p.addSlide();
	s.background = {color: DEEP};
	T(s, 'SOUTENANCE D’INGÉNIEUR · GÉNIE ÉLECTRIQUE', {x: 0.6, y: 1.0, w: 6, h: 0.3, fontSize: 12, bold: true, color: Y, charSpacing: 3});
	T(s, 'Réduire les pertes techniques d’un réseau de distribution électrique', {x: 0.6, y: 1.4, w: 5.8, h: 1.9, fontSize: 30, bold: true, color: 'FFFFFF', valign: 'top'});
	T(s, 'Sonia M. · Jury du 12 juin 2026', {x: 0.6, y: 3.55, w: 5, h: 0.35, fontSize: 13, color: 'B6D7E8'});
	await bh(s, 'engineer', 6.2, 5.2, 3.8);

	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'PROBLÉMATIQUE', {x: 0.6, y: 0.5, w: 5, h: 0.3, fontSize: 12, bold: true, color: TEAL, charSpacing: 3});
	T(s, 'Près d’un kilowattheure sur cinq n’arrive jamais au client', {x: 0.6, y: 0.85, w: 5.6, h: 1.3, fontSize: 28, bold: true, color: DEEP, valign: 'top'});
	T(s, '18 %', {x: 0.6, y: 2.4, w: 3, h: 1.1, fontSize: 66, bold: true, color: TEAL});
	T(s, 'de pertes techniques sur le réseau étudié (moyenne 2025)', {x: 0.6, y: 3.5, w: 4.5, h: 0.7, fontSize: 14, color: MUTED, valign: 'top'});
	await bh(s, 'thinking', 6.6, 5.0, 3.6);

	s = p.addSlide();
	s.background = {color: LIGHT};
	T(s, 'MÉTHODOLOGIE', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: TEAL, charSpacing: 3});
	T(s, 'Mesurer, modéliser, optimiser', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 30, bold: true, color: DEEP});
	const ph = [['1', 'Mesurer', '6 mois de relevés sur 42 transformateurs'], ['2', 'Modéliser', 'Simulation du réseau et des flux de charge'], ['3', 'Optimiser', 'Rééquilibrage des phases et condensateurs']];
	for (let i = 0; i < 3; i++) {
		const x = 0.6 + i * 2.2;
		s.addShape(p.shapes.ROUNDED_RECTANGLE, {x, y: 1.6, w: 2.0, h: 2.7, fill: {color: i === 2 ? TEAL : 'FFFFFF'}, rectRadius: 0.12, line: {color: i === 2 ? TEAL : 'FFFFFF'}, shadow: shadow()});
		T(s, ph[i][0], {x: x + 0.2, y: 1.75, w: 0.6, h: 0.6, fontSize: 30, bold: true, color: Y});
		T(s, ph[i][1], {x: x + 0.2, y: 2.4, w: 1.7, h: 0.4, fontSize: 18, bold: true, color: i === 2 ? 'FFFFFF' : DEEP});
		T(s, ph[i][2], {x: x + 0.2, y: 2.85, w: 1.65, h: 1.3, fontSize: 12, color: i === 2 ? 'DCEFF7' : MUTED, valign: 'top'});
	}
	await bh(s, 'process', 7.2, 5.0, 2.2);

	s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'RÉSULTATS', {x: 0.6, y: 0.4, w: 5, h: 0.3, fontSize: 12, bold: true, color: TEAL, charSpacing: 3});
	T(s, 'Pertes réduites d’un tiers', {x: 0.6, y: 0.72, w: 8.8, h: 0.6, fontSize: 30, bold: true, color: DEEP});
	s.addChart(p.charts.BAR, [{name: 'Pertes (%)', labels: ['Avant', 'Après'], values: [18, 12.2]}], {
		x: 0.5, y: 1.45, w: 4.3, h: 3.8, barDir: 'col', chartColors: ['A7B8C4', TEAL], barGapWidthPct: 70, showValue: true, dataLabelPosition: 'outEnd',
		dataLabelFormatCode: '0.0"%"', dataLabelColor: DEEP, dataLabelFontSize: 16, dataLabelFontBold: true, catAxisLabelColor: MUTED, catAxisLabelFontSize: 14,
		valAxisHidden: true, valGridLine: {style: 'none'}, catGridLine: {style: 'none'}, showLegend: false,
	});
	const kp = [['−32 %', 'pertes'], ['−18 %', 'coût d’exploitation'], ['+25 %', 'fiabilité']];
	for (let i = 0; i < 3; i++) {
		s.addShape(p.shapes.ROUNDED_RECTANGLE, {x: 5.2, y: 1.55 + i * 1.2, w: 4.2, h: 1.0, fill: {color: i === 0 ? TEAL : LIGHT}, rectRadius: 0.1, line: {color: i === 0 ? TEAL : LIGHT}});
		T(s, kp[i][0], {x: 5.45, y: 1.6 + i * 1.2, w: 1.7, h: 0.9, fontSize: 28, bold: true, color: i === 0 ? Y : TEAL, valign: 'middle'});
		T(s, kp[i][1], {x: 7.1, y: 1.6 + i * 1.2, w: 2.2, h: 0.9, fontSize: 14, color: i === 0 ? 'FFFFFF' : DEEP, valign: 'middle'});
	}

	s = p.addSlide();
	s.background = {color: DEEP};
	T(s, 'CONCLUSION', {x: 0.6, y: 1.0, w: 5, h: 0.3, fontSize: 12, bold: true, color: Y, charSpacing: 3});
	T(s, 'Une solution rentable dès la 2ᵉ année, applicable à tout le réseau', {x: 0.6, y: 1.35, w: 5.8, h: 1.9, fontSize: 28, bold: true, color: 'FFFFFF', valign: 'top'});
	T(s, 'Merci pour votre attention.', {x: 0.6, y: 3.6, w: 5, h: 0.5, fontSize: 18, color: Y, bold: true});
	await bh(s, 'victory', 6.9, 5.1, 3.6);

	await p.writeFile({fileName: 'out/Sonia_Soutenance_ingenieur.pptx'});
}

// ─────────────────────────────── EXEMPLES — élève, enseignant, entrepreneur ───────────────────────────────
async function exemples() {
	const p = new pptxgen();
	p.layout = 'LAYOUT_16x9';
	p.title = 'Exemples — Méthode Bonhomme';

	// Élève : exposé
	let s = p.addSlide();
	s.background = {color: 'FFFFFF'};
	T(s, 'EXPOSÉ DE SVT · 4ᵉ B', {x: 0.6, y: 0.45, w: 5, h: 0.3, fontSize: 12, bold: true, color: '0E7490', charSpacing: 3});
	T(s, 'Le cycle de l’eau en 3 étapes', {x: 0.6, y: 0.78, w: 6, h: 0.6, fontSize: 30, bold: true, color: '083344'});
	const eau = [['Évaporation', 'Le soleil chauffe l’eau des mers', 'F59E0B'], ['Condensation', 'La vapeur forme les nuages', '0EA5E9'], ['Précipitations', 'La pluie retombe sur le sol', '2563EB']];
	for (let i = 0; i < 3; i++) {
		s.addShape(p.shapes.OVAL, {x: 0.7, y: 1.7 + i * 1.15, w: 0.8, h: 0.8, fill: {color: eau[i][2]}});
		T(s, String(i + 1), {x: 0.7, y: 1.7 + i * 1.15, w: 0.8, h: 0.8, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'});
		T(s, eau[i][0], {x: 1.75, y: 1.7 + i * 1.15, w: 4, h: 0.4, fontSize: 18, bold: true, color: '083344'});
		T(s, eau[i][1], {x: 1.75, y: 2.1 + i * 1.15, w: 4, h: 0.35, fontSize: 13, color: '4B5563'});
	}
	await bh(s, 'student', 6.4, 5.1, 3.6);

	// Enseignant : cours
	s = p.addSlide();
	s.background = {color: 'F0FDF4'};
	T(s, 'COURS DE MATHÉMATIQUES', {x: 0.6, y: 0.45, w: 5, h: 0.3, fontSize: 12, bold: true, color: '15803D', charSpacing: 3});
	T(s, 'Une fraction, c’est un partage', {x: 0.6, y: 0.78, w: 6, h: 0.6, fontSize: 30, bold: true, color: '14532D'});
	for (let i = 0; i < 4; i++) {
		s.addShape(p.shapes.RECTANGLE, {x: 0.7 + i * 1.05, y: 1.9, w: 1.0, h: 1.4, fill: {color: i < 3 ? '22C55E' : 'FFFFFF'}, line: {color: '14532D', width: 2}});
	}
	T(s, [{text: '3', options: {breakLine: true}}, {text: '4'}], {x: 5.2, y: 1.7, w: 0.9, h: 1.8, fontSize: 40, bold: true, color: '14532D', align: 'center', valign: 'middle'});
	s.addShape(p.shapes.LINE, {x: 5.35, y: 2.6, w: 0.6, h: 0, line: {color: '14532D', width: 3}});
	T(s, '3 parts colorées sur 4 parts égales', {x: 0.7, y: 3.55, w: 5, h: 0.4, fontSize: 16, color: '14532D'});
	await bh(s, 'teacher', 6.3, 5.1, 3.4);

	// Entrepreneur : pitch
	s = p.addSlide();
	s.background = {color: '1F1147'};
	T(s, 'PITCH · INCUBATEUR 2026', {x: 0.6, y: 0.45, w: 5, h: 0.3, fontSize: 12, bold: true, color: 'FF7A00', charSpacing: 3});
	T(s, 'Repas livrés aux étudiants en 20 minutes', {x: 0.6, y: 0.78, w: 6.2, h: 1.0, fontSize: 28, bold: true, color: 'FFFFFF', valign: 'top'});
	const pitch = [['Problème', '1 étudiant sur 2 saute le déjeuner'], ['Solution', 'Commande WhatsApp, livraison à moto'], ['Marché', '85 000 étudiants dans la ville']];
	for (let i = 0; i < 3; i++) {
		s.addShape(p.shapes.ROUNDED_RECTANGLE, {x: 0.6, y: 1.95 + i * 1.05, w: 5.6, h: 0.85, fill: {color: i === 1 ? 'FF7A00' : '2E2366'}, rectRadius: 0.1, line: {color: i === 1 ? 'FF7A00' : '2E2366'}});
		T(s, pitch[i][0], {x: 0.85, y: 1.95 + i * 1.05, w: 1.6, h: 0.85, fontSize: 16, bold: true, color: 'FFFFFF', valign: 'middle'});
		T(s, pitch[i][1], {x: 2.5, y: 1.95 + i * 1.05, w: 3.6, h: 0.85, fontSize: 14, color: 'FFFFFF', valign: 'middle'});
	}
	await bh(s, 'entrepreneur', 6.5, 5.1, 3.5);

	await p.writeFile({fileName: 'out/Exemples_eleve_enseignant_entrepreneur.pptx'});
}

(async () => {
	require('fs').mkdirSync('out', {recursive: true});
	await paul();
	await jean();
	await sonia();
	await exemples();
	console.log('4 présentations générées dans decks/out/');
})();
