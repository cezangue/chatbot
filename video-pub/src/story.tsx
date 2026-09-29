import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BigText, C, CL, FONT, KenBurns, MessySlide, PPTWindow, ProductBox, SlideBox, Symbol} from './kit';
import {Portrait, Projector, TitleCard} from './cast';
import {BSlide, BVariant} from './slides';
import {Beat, Timed} from './timeline';

const P = (who: string, lines: string[] = [], o: Partial<Beat> & {mood?: string; min?: number; focus?: string} = {}): Beat => ({
	lines,
	min: o.min ?? (lines.length ? 0 : 40),
	lead: o.lead ?? 6,
	tail: o.tail ?? 6,
	place: o.place,
	sfx: o.sfx,
	render: ({dur}) => <Portrait who={who} mood={o.mood} dur={dur} focus={o.focus} />,
});

const Title = (text: string, frames = 55, sub?: string): Beat => ({min: frames, render: () => <TitleCard text={text} sub={sub} />});

// Répartit n repères régulièrement sur la durée des répliques
const marks = (t: Timed[], perLine: number) => t.flatMap((tm) => [...Array(perLine)].map((_, k) => tm.from + ((tm.to - tm.from) * k) / perLine));

const Cursor: React.FC = () => {
	const f = useCurrentFrame();
	const cx = 900 + Math.sin(f / 13) * 420 + Math.sin(f / 5) * 60;
	const cy = 480 + Math.cos(f / 17) * 260;
	return (
		<>
			<div style={{position: 'absolute', left: cx, top: cy, fontSize: 60, transform: 'rotate(-20deg)', zIndex: 40, color: '#111', textShadow: '0 0 4px #fff'}}>➤</div>
			{f % 40 < 8 && <div style={{position: 'absolute', left: cx - 20, top: cy - 20, width: 60, height: 60, borderRadius: '50%', border: '4px solid #ff3b30', zIndex: 39}} />}
		</>
	);
};

const EstherBuild: React.FC = () => {
	const f = useCurrentFrame();
	const step = Math.floor((f - 10) / 30);
	const labels = ['+ un titre « WordArt »', '+ beaucoup de texte', '+ des effets', '+ un tableau multicolore', '+ des images', '+ des formes', '+ encore une police'];
	return (
		<AbsoluteFill style={{background: '#1a1f2b'}}>
			<PPTWindow w={1500} x={210} y={60}>
				<SlideBox w={(1000 * 1500) / 1400}>
					<MessySlide step={step} />
				</SlideBox>
			</PPTWindow>
			{labels.map((l, i) =>
				step >= i ? (
					<div key={i} style={{position: 'absolute', right: 40, top: 110 + i * 70, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff', background: C.ppt, padding: '8px 18px', borderRadius: 10, zIndex: 40}}>
						{l}
					</div>
				) : null,
			)}
		</AbsoluteFill>
	);
};

const Kinetic: React.FC<{items: [string, number, number?, string?][]; photo?: string}> = ({items, photo}) => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1d3a8a, #050a1a 75%)'}}>
		{photo && (
			<AbsoluteFill style={{opacity: 0.35}}>
				<KenBurns src={photo} dur={400} fit="cover" />
			</AbsoluteFill>
		)}
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 24, paddingBottom: 160, paddingLeft: 100, paddingRight: 100}}>
			{items.map(([t, at, size, color], i) => (
				<Show key={i} at={at}>
					<BigText text={t} start={at} size={size ?? 64} color={color} />
				</Show>
			))}
		</AbsoluteFill>
	</AbsoluteFill>
);

const Show: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => (useCurrentFrame() >= at ? <>{children}</> : null);

const STEPS = ['Définir l’objectif', 'Organiser ses idées', 'Construire une structure logique', 'Sélectionner l’essentiel', 'Travailler le visuel', 'Images et graphiques pertinents', 'Harmoniser couleurs et polices', 'Répéter à voix haute'];
const Steps: React.FC<{m: number[]}> = ({m}) => {
	const f = useCurrentFrame();
	const cur = m.filter((x) => f >= x).length - 1;
	const slides: BVariant[] = ['idea', 'idea', 'title', 'levers', 'levers', 'chart', 'compare', 'compare'];
	return (
		<AbsoluteFill style={{background: 'linear-gradient(135deg,#0b1f4d,#132b66 60%,#1d3a8a)'}}>
			<div style={{position: 'absolute', left: 70, top: 44, fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff'}}>
				LA MÉTHODE APPLIQUÉE PAR PAUL <span style={{color: C.orange}}>— 8 ÉTAPES</span>
			</div>
			<div style={{position: 'absolute', left: 70, top: 130, width: 720}}>
				{STEPS.map((s, i) => {
					const on = i <= cur;
					const active = i === cur;
					return (
						<div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, opacity: on ? 1 : 0.3, transform: `translateX(${active ? 14 : 0}px)`, fontFamily: FONT}}>
							<div style={{width: 58, height: 58, borderRadius: 29, background: on ? (active ? C.orange : C.green) : '#334', color: '#fff', fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{on && !active ? '✓' : i + 1}</div>
							<div style={{fontSize: 32, fontWeight: active ? 800 : 600, color: '#fff'}}>{s}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 840, top: 150, padding: 10, background: '#fff', borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.4)'}}>
				<SlideBox w={1000} key={slides[Math.max(0, cur)]}>
					<BSlide v={slides[Math.max(0, cur)]} />
				</SlideBox>
			</div>
			<div style={{position: 'absolute', left: 840, top: 740, fontFamily: FONT, fontSize: 24, color: '#c7d2fe', fontWeight: 600}}>Aperçu : les diapositives « Bonhomme » de Paul</div>
		</AbsoluteFill>
	);
};

const Split: React.FC = () => {
	const f = useCurrentFrame();
	const col = (title: string, color: string, items: string[], slide: React.ReactNode, start: number) => (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT}}>
			<div style={{fontSize: 46, fontWeight: 900, color, marginBottom: 18}}>{title}</div>
			<div style={{border: `6px solid ${color}`, borderRadius: 10}}>
				<SlideBox w={780}>{slide}</SlideBox>
			</div>
			<div style={{marginTop: 22}}>
				{items.map((it, i) => (
					<div key={it} style={{fontSize: 30, color: '#fff', fontWeight: 600, marginBottom: 6, opacity: f > start + i * 20 ? 1 : 0}}>
						<span style={{color}}>{color === C.red ? '✗ ' : '✓ '}</span>
						{it}
					</div>
				))}
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#0a0f1f', flexDirection: 'row', padding: '50px 60px 0', gap: 60}}>
			{col('JEAN', C.red, ['Beaucoup de texte', 'Trop de couleurs', 'Aucune structure'], <MessySlide />, 20)}
			<div style={{width: 4, background: '#334', marginBottom: 300}} />
			{col('PAUL', C.green, ['Un message par diapositive', 'Hiérarchie claire', 'Visuels « Bonhomme » pertinents'], <BSlide v="chart" />, 80)}
		</AbsoluteFill>
	);
};

const ProductPan: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const x = interpolate(f, [0, dur], [0, -38], CL);
	const s = interpolate(f, [0, 150, dur], [1, 1.45, 1.45], CL);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${s}) translateX(${x}%)`, transformOrigin: 'left center'}}>
				<Img src={staticFile('3.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const ProductReveal: React.FC = () => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, 25], [0, 1], CL);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 40% 45%, #3a2a12, #07090f 70%)'}}>
			<div style={{position: 'absolute', left: 700, top: 60, transform: `scale(${0.85 + 0.15 * p}) rotate(${(1 - p) * -8}deg)`, opacity: p}}>
				<ProductBox w={520} style={{boxShadow: '0 50px 120px rgba(0,0,0,0.8)'}} />
			</div>
		</AbsoluteFill>
	);
};

const PRINC = [['🧠', 'Organiser vos idées'], ['🧱', 'Construire une présentation logique'], ['🎯', 'Sélectionner l’essentiel'], ['🖼️', 'Créer des diapositives claires'], ['📊', 'Utiliser les visuels au bon moment'], ['🚫', 'Éviter les erreurs classiques'], ['🎤', 'Présenter de façon professionnelle']];
const Principles: React.FC<{m: number[]}> = ({m}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#0b1f4d'}}>
			<AbsoluteFill style={{opacity: 0.18, filter: 'blur(6px)'}}>
				<Img src={staticFile('4.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 100, top: 50, fontFamily: FONT, fontSize: 50, fontWeight: 900, color: '#fff'}}>
				Vous allez apprendre <span style={{color: C.orange}}>à…</span>
			</div>
			<div style={{position: 'absolute', left: 100, top: 150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 60px', width: 1720}}>
				{PRINC.map(([e, t], i) => {
					const o = interpolate(f, [m[i], m[i] + 10], [0, 1], CL);
					return (
						<div key={t} style={{opacity: o, transform: `translateY(${(1 - o) * 30}px)`, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '16px 26px', borderLeft: `8px solid ${C.orange}`}}>
							<span style={{fontSize: 50}}>{e}</span>
							<span style={{fontFamily: FONT, fontSize: 36, fontWeight: 700, color: '#fff'}}>{t}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Profile: React.FC<{emoji: string; title: string; v: BVariant}> = ({emoji, title, v}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, 12], [0, 1], CL);
	return (
		<AbsoluteFill style={{background: 'linear-gradient(135deg,#f5f7fb,#dde4ef)'}}>
			<div style={{position: 'absolute', left: 90, top: 70, fontFamily: FONT, opacity: p}}>
				<div style={{fontSize: 28, fontWeight: 800, color: C.orange, letterSpacing: 4}}>POUR QUI ?</div>
				<div style={{fontSize: 76, fontWeight: 900, color: C.navy}}>
					{emoji} {title}
				</div>
			</div>
			<div style={{position: 'absolute', left: 330, top: 230, padding: 10, background: '#111', borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
				<SlideBox w={1260}>
					<BSlide v={v} />
				</SlideBox>
			</div>
		</AbsoluteFill>
	);
};

const Morph: React.FC<{at: number}> = ({at}) => {
	const f = useCurrentFrame();
	const m = interpolate(f, [at, at + 50], [0, 100], CL);
	return (
		<AbsoluteFill style={{background: '#0a0f1f', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{position: 'relative', width: 1400, height: 787, marginBottom: 120, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
				<SlideBox w={1400}>
					<MessySlide />
				</SlideBox>
				<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - m}% 0 0)`}}>
					<SlideBox w={1400}>{m > 0 && <BSlide v="compare" />}</SlideBox>
				</div>
				<div style={{position: 'absolute', top: 0, bottom: 0, left: `${m}%`, width: 8, background: C.orange, opacity: m > 0 && m < 100 ? 1 : 0}} />
			</div>
			<div style={{position: 'absolute', top: 26, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: '#fff'}}>{m < 50 ? 'AVANT' : 'APRÈS'}</div>
		</AbsoluteFill>
	);
};

const BeforeAfter: React.FC = () => {
	const f = useCurrentFrame();
	const half = (src: string, label: string, text: string, color: string, start: number) => (
		<div style={{flex: 1, position: 'relative', overflow: 'hidden', opacity: interpolate(f, [start, start + 15], [0, 1], CL)}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1 + Math.max(0, f - start) / 1500})`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: 40, background: 'linear-gradient(rgba(0,0,0,0.8), transparent)', fontFamily: FONT, color: '#fff'}}>
				<div style={{fontSize: 34, fontWeight: 900, color, letterSpacing: 4}}>{label}</div>
				<div style={{fontSize: 40, fontWeight: 700}}>{text}</div>
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{flexDirection: 'row', background: '#000', gap: 8}}>
			{half('2.png', 'AVANT', '« Je ne sais pas par où commencer. »', C.red, 0)}
			{half('1.png', 'APRÈS', '« Je sais construire ma présentation. »', C.green, 45)}
		</AbsoluteFill>
	);
};

const Strike: React.FC<{text: string; at: number}> = ({text, at}) => {
	const f = useCurrentFrame();
	const w = interpolate(f, [at + 35, at + 50], [0, 100], CL);
	if (f < at) return null;
	return (
		<div style={{position: 'relative', display: 'inline-block'}}>
			<BigText text={text} start={at} size={56} weight={700} />
			<div style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${w}%`, background: C.red}} />
		</div>
	);
};

const CTA: React.FC = () => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, 20], [0, 1], CL);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 70% 40%, #1d3a8a, #050a1a 75%)'}}>
			<div style={{position: 'absolute', left: 160, top: 50, transform: `scale(${0.9 + 0.1 * p})`, opacity: p}}>
				<ProductBox w={470} style={{boxShadow: '0 40px 100px rgba(0,0,0,0.7)'}} />
			</div>
			<div style={{position: 'absolute', left: 800, top: 90, width: 1020, fontFamily: FONT, color: '#fff'}}>
				<BigText text="LA NOUVELLE MÉTHODE POWERPOINT" start={5} size={60} />
				<div style={{height: 20}} />
				<BigText text="Apprendre. Structurer. Présenter. Impressionner." start={40} size={38} color={C.yellow} weight={700} />
				<div style={{marginTop: 40, opacity: interpolate(f, [90, 110], [0, 1], CL), background: C.red, borderRadius: 24, padding: '26px 40px', fontSize: 36, fontWeight: 700, lineHeight: 1.6}}>
					<div style={{fontSize: 44, fontWeight: 900}}>DISPONIBLE MAINTENANT</div>
					<div>📱 WhatsApp : [NUMÉRO]</div>
					<div>💰 Prix : [PRIX]</div>
					<div>🚚 Livraison : [INFORMATIONS]</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const APPLAUSE = (at: number, volume = 0.5) => ({src: 'sfx/applause.wav', at, volume});

export const STORY: Beat[][] = [
	// 1 — Jean ne fera pas la présentation
	[
		P('DIRECTEUR', ['d1'], {place: 'BUREAU DU DIRECTEUR — JOUR'}),
		P('JEAN', [], {mood: 'stress', min: 40}),
		P('DIRECTEUR', ['d2']),
		P('PAUL', ['p1']),
		P('JEAN', [], {mood: 'stress', min: 45}),
	],
	// 2 — Mais pourquoi ?
	[P('POSE', ['pose1']), {lines: ['pose2'], render: ({t}) => <Kinetic items={[['Qu’est-ce qui s’est réellement passé ?', t[0].from, 64], ['Remontons trois jours en arrière…', t[0].to - 45, 50, C.yellow]]} />}, Title('3 JOURS PLUS TÔT…')],
	// 3 — Jean doit faire la présentation
	[
		P('DIRECTEUR', ['d3'], {place: 'BUREAU — 3 JOURS PLUS TÔT'}),
		P('JEAN', ['j1']),
		{
			lines: ['j2'],
			lead: 70,
			tail: 30,
			render: () => (
				<AbsoluteFill style={{background: '#1a1f2b'}}>
					<PPTWindow w={1500} x={210} y={60} />
					<Cursor />
					<Symbol ch="?" x={1720} y={100} start={60} size={140} color={C.yellow} />
				</AbsoluteFill>
			),
		},
	],
	// 4-5 — Esther aide Jean
	[
		P('JEAN', ['j3'], {mood: 'stress'}),
		P('ESTHER', ['e1']),
		{min: 235, render: () => <EstherBuild />},
		{lines: ['e2'], render: () => <EstherBuild />},
		P('JEAN', ['j4']),
		P('ESTHER', ['e3']),
		{min: 50, render: () => <AbsoluteFill><SlideBox w={1920}><MessySlide /></SlideBox></AbsoluteFill>},
	],
	// 6 — la présentation ratée
	[
		{lines: ['j5'], place: 'SALLE DE RÉUNION — JOUR J', render: () => <Projector><MessySlide /></Projector>},
		P('DIRECTEUR', [], {min: 40}),
		{lines: ['j6'], lead: 20, render: () => <Projector shake={6} audience="lost"><MessySlide /></Projector>},
		{lines: ['j7'], render: () => <Projector audience="lost"><div style={{position: 'absolute', inset: 0, background: '#000', color: '#fff', fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>Diapositive 17 / 42</div></Projector>},
		P('JEAN', [], {mood: 'stress', min: 45}),
	],
	// 7 — le problème, c'était la méthode
	[
		P('JEAN', ['j8'], {mood: 'stress'}),
		{
			lines: ['pose3', 'pose4'],
			render: ({t}) => (
				<Kinetic
					photo="2.png"
					items={[
						['Jean avait travaillé.', t[0].from, 60],
						['Esther savait utiliser PowerPoint.', t[0].from + 40, 60],
						['Le problème ? La MÉTHODE.', t[1].from + 60, 96, C.yellow],
					]}
				/>
			),
		},
	],
	// 8 — quelques temps plus tard
	[Title('QUELQUES TEMPS PLUS TARD…'), P('DIRECTEUR', ['d4']), P('PAUL', ['p2']), {lines: ['pose5'], tail: 20, render: () => <ProductReveal />}],
	// 9 — les 8 étapes (les « Bonhommes » apparaissent dans les slides de Paul)
	[{lines: ['pose6', 'pose7'], render: ({t}) => <Steps m={marks(t, 4)} />}],
	// 10-11 — la présentation réussie de Paul
	[
		{lines: ['p3'], place: 'MÊME SALLE — MÊME ÉQUIPE', render: () => <Projector audience="happy"><BSlide v="title" /></Projector>},
		{min: 75, render: () => <Projector audience="happy"><BSlide v="levers" /></Projector>},
		{lines: ['c1'], lead: 50, render: () => <Projector audience="happy"><BSlide v="chart" /></Projector>},
		{min: 60, render: () => <Projector audience="happy"><BSlide v="compare" /></Projector>},
		P('DIRECTEUR', ['d5'], {tail: 60, sfx: [APPLAUSE(150)]}),
	],
	// 11-12 — la différence
	[{lines: ['pose8', 'pose9', 'pose10'], render: () => <Split />}],
	// 13-14 — le produit
	[{lines: ['pose11', 'pose12'], render: ({dur}) => <ProductPan dur={dur} />}],
	[
		{lines: ['pose13'], render: ({t}) => <Kinetic items={[['« JE NE SAIS PAS FAIRE UN POWERPOINT. »', t[0].from, 58, C.red], ['La méthode part des bases.', t[0].to - 50, 50]]} />},
		{lines: ['pose14'], render: ({t}) => <Morph at={t[0].from + 60} />},
	],
	// 15 — les principes
	[{lines: ['pose15'], render: ({t}) => <Principles m={[...Array(7)].map((_, i) => t[0].from + ((t[0].to - t[0].from) * i) / 7.3)} />}],
	// 16 — pour qui ?
	[
		P('SONIA', ['pose16'], {focus: '50% 30%'}),
		{
			lines: ['pose17'],
			tail: 70,
			place: 'SOUTENANCE D’INGÉNIEUR — MISE EN SCÈNE',
			render: () => <Projector audience="happy"><BSlide v="thesis" /></Projector>,
		},
		P('SONIA', [], {min: 75, sfx: [APPLAUSE(0, 0.6)]}),
		{lines: ['pose18'], render: () => <Profile emoji="🎒" title="Les élèves" v="class" />},
		{lines: ['pose19', 'c2'], render: () => <Profile emoji="💼" title="Les professionnels" v="levers" />},
		{lines: ['pose20'], render: () => <Profile emoji="🎓" title="Enseignants & formateurs" v="idea" />},
		{lines: ['pose21'], render: () => <Profile emoji="🚀" title="Les entrepreneurs" v="pitch" />},
	],
	// 17-18 — débutant ou expert ? avant / après
	[{lines: ['pose22'], render: () => <BeforeAfter />}],
	// 19 — retour à l'histoire
	[
		P('JEAN', ['j9']),
		{lines: ['p4'], render: () => <ProductReveal />},
		P('JEAN', ['j10']),
		P('PAUL', ['p5'], {tail: 25}),
	],
	// 20-21 — message final et appel à l'action
	[
		{
			lines: ['pose23'],
			render: ({t}) => (
				<AbsoluteFill style={{background: 'radial-gradient(circle at 70% 40%, #1d3a8a, #050a1a 75%)', justifyContent: 'center', alignItems: 'center', gap: 28, paddingBottom: 160}}>
					<Strike text="« Je ne sais pas faire PowerPoint. »" at={t[0].from} />
					<Strike text="« Je suis débutant. »" at={t[0].from + 70} />
					<Show at={t[0].from + 140}>
						<BigText text="Une bonne présentation ne dépend pas que du talent." start={t[0].from + 140} size={44} weight={600} />
					</Show>
				</AbsoluteFill>
			),
		},
		{lines: ['pose24'], render: ({t}) => <Kinetic items={[['Commencez avec la bonne méthode.', t[0].from, 80, C.yellow], ['Créez des présentations qui impressionnent.', t[0].from + 90, 52]]} />},
		{lines: ['pose25'], tail: 150, render: () => <CTA />},
	],
];
