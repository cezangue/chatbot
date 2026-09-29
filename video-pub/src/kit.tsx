import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const FONT = 'Montserrat, "Liberation Sans", sans-serif';

export const C = {
	navy: '#0b1f4d',
	navy2: '#132b66',
	orange: '#ff7a00',
	red: '#e3262e',
	yellow: '#ffc400',
	ppt: '#c43e1c',
	green: '#22c55e',
	blue: '#2f7cf6',
};

export const WHO: Record<string, string> = {
	DIRECTEUR: '#aab4c8',
	JEAN: '#ff6a5e',
	PAUL: '#4b95ff',
	ESTHER: '#ea6ad8',
	POSE: '#ffb400',
	SONIA: '#b07cff',
	'COLLÈGUE': '#3ed598',
};

export const usePop = (start: number, damping = 12) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: f - start, fps, config: {damping, stiffness: 120}});
};

// Fondu d'entrée/sortie d'une scène
export const Fade: React.FC<{dur: number; a?: number; children: React.ReactNode}> = ({dur, a = 12, children}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [0, a, dur - a, dur], [0, 1, 1, 0], CL);
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Sous-titre / réplique avec effet machine à écrire
export const Caption: React.FC<{from: number; to: number; who?: string; text: string; top?: boolean}> = ({
	from,
	to,
	who,
	text,
	top,
}) => {
	const f = useCurrentFrame();
	if (f < from || f > to) return null;
	const o = interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], CL);
	const y = interpolate(f, [from, from + 10], [24, 0], CL);
	const n = Math.floor((f - from) * 1.8);
	const color = who ? WHO[who] ?? '#fff' : '#fff';
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				[top ? 'top' : 'bottom']: 60,
				display: 'flex',
				justifyContent: 'center',
				opacity: o,
				transform: `translateY(${y}px)`,
				fontFamily: FONT,
				zIndex: 50,
			}}
		>
			<div
				style={{
					maxWidth: 1500,
					background: 'rgba(7,12,30,0.9)', border: '1px solid rgba(255,255,255,0.14)',
					borderRadius: 20,
					padding: '20px 40px 24px',
					color: '#fff',
					fontSize: 42,
					fontWeight: 600,
					lineHeight: 1.28,
					textAlign: 'center',
					borderLeft: `8px solid ${color}`,
					boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
				}}
			>
				{who && (
					<div style={{fontSize: 24, fontWeight: 900, color, letterSpacing: 4, marginBottom: 6}}>{who}</div>
				)}
				<span>{text.slice(0, n)}</span>
				<span style={{color: 'transparent'}}>{text.slice(n)}</span>
			</div>
		</div>
	);
};

// Étiquette de lieu (style « INT. BUREAU — JOUR »)
export const Place: React.FC<{text: string}> = ({text}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [5, 20, 80, 100], [0, 1, 1, 0], CL);
	return (
		<div
			style={{
				position: 'absolute',
				top: 50,
				left: 60,
				opacity: o,
				fontFamily: FONT,
				fontWeight: 800,
				fontSize: 26,
				letterSpacing: 5,
				color: '#fff',
				background: 'rgba(11,31,77,0.85)',
				padding: '10px 22px',
				borderRadius: 8,
				zIndex: 40,
			}}
		>
			{text}
		</div>
	);
};

// Personnage « Bonhomme » 3D blanc (clin d'œil à la Méthode Bonhomme du produit)
export type BP = {
	x: number;
	y: number;
	s?: number;
	tie?: string;
	suit?: string;
	armL?: number;
	armR?: number;
	tilt?: number;
	hair?: boolean;
	scarf?: string;
	opacity?: number;
	noLegs?: boolean;
};
export const Bonhomme: React.FC<BP> = ({x, y, s = 1, tie, suit, armL = 8, armR = -8, tilt = 0, hair, scarf, opacity = 1, noLegs}) => {
	const skin = 'url(#bhg)';
	const cloth = suit ?? skin;
	return (
		<svg
			style={{position: 'absolute', left: x, top: y, width: 200 * s, height: 400 * s, overflow: 'visible', opacity}}
			viewBox="0 0 200 400"
		>
			<defs>
				<radialGradient id="bhg" cx="35%" cy="28%" r="80%">
					<stop offset="0%" stopColor="#ffffff" />
					<stop offset="65%" stopColor="#e8ecf2" />
					<stop offset="100%" stopColor="#aeb7c4" />
				</radialGradient>
			</defs>
			{!noLegs && <ellipse cx="100" cy="394" rx="72" ry="10" fill="rgba(0,0,0,0.22)" />}
			{!noLegs && (
				<>
					<rect x="70" y="236" width="29" height="154" rx="14" fill={cloth} />
					<rect x="101" y="236" width="29" height="154" rx="14" fill={cloth} />
					<ellipse cx="80" cy="388" rx="20" ry="9" fill="#2b2f38" />
					<ellipse cx="120" cy="388" rx="20" ry="9" fill="#2b2f38" />
				</>
			)}
			<g transform={`rotate(${armL} 64 120)`}>
				<rect x="50" y="108" width="27" height="118" rx="13" fill={cloth} />
				<circle cx="63" cy="230" r="15" fill={skin} />
			</g>
			<g transform={`rotate(${armR} 136 120)`}>
				<rect x="123" y="108" width="27" height="118" rx="13" fill={cloth} />
				<circle cx="137" cy="230" r="15" fill={skin} />
			</g>
			<rect x="55" y="98" width="90" height="158" rx="40" fill={cloth} />
			{suit && <path d="M84 100 L100 146 L116 100 Z" fill="#f4f6fa" />}
			{tie && <path d="M96 104 L104 104 L109 162 L100 176 L91 162 Z" fill={tie} />}
			{scarf && <path d="M68 104 Q100 128 132 104 L128 118 Q100 140 72 118 Z" fill={scarf} />}
			<g transform={`rotate(${tilt} 100 96)`}>
				{hair && <circle cx="100" cy="16" r="22" fill={skin} />}
				<circle cx="100" cy="56" r="44" fill={skin} />
			</g>
		</svg>
	);
};

export const Office: React.FC<{dark?: boolean}> = ({dark}) => (
	<AbsoluteFill style={{background: dark ? 'linear-gradient(#1a2233,#0f1522)' : 'linear-gradient(#eef2f7,#d4dbe6)'}}>
		<div
			style={{
				position: 'absolute',
				left: 1180,
				top: 110,
				width: 560,
				height: 420,
				background: 'linear-gradient(#8ec5ff,#e0f0ff)',
				border: '14px solid #f9fafc',
				boxShadow: 'inset 0 0 0 2px #c9d2de',
			}}
		>
			{[...Array(9)].map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 46, height: 8, background: 'rgba(255,255,255,0.55)'}} />
			))}
			<div style={{position: 'absolute', bottom: 0, left: 40, width: 60, height: 160, background: '#6b8cb3'}} />
			<div style={{position: 'absolute', bottom: 0, left: 120, width: 90, height: 230, background: '#56779f'}} />
			<div style={{position: 'absolute', bottom: 0, left: 240, width: 70, height: 120, background: '#7a9cc4'}} />
			<div style={{position: 'absolute', bottom: 0, left: 340, width: 110, height: 270, background: '#4d6c93'}} />
		</div>
		<div style={{position: 'absolute', left: 150, top: 150, width: 300, height: 200, background: '#fff', border: '10px solid #2d3748', padding: 20, display: 'flex', alignItems: 'flex-end', gap: 16}}>
			{[50, 90, 70, 130].map((h, i) => (
				<div key={i} style={{flex: 1, height: h, background: i === 3 ? C.orange : C.navy2}} />
			))}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(#8a5a3c,#6b432b)'}} />
	</AbsoluteFill>
);

export const Desk: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, zIndex: 5}}>
		<div style={{height: 30, background: 'linear-gradient(#a8744f,#8d5d3c)', borderRadius: 6, boxShadow: '0 10px 20px rgba(0,0,0,0.3)'}} />
		<div style={{height: 220, margin: '0 30px', background: 'linear-gradient(#7b4f33,#5d3a25)'}} />
	</div>
);

// Fenêtre PowerPoint simulée
export const PPTWindow: React.FC<{w: number; children?: React.ReactNode; x?: number; y?: number}> = ({w, children, x = 0, y = 0}) => {
	const h = w * 0.62;
	const k = w / 1400;
	const tabs = ['Fichier', 'Accueil', 'Insertion', 'Conception', 'Transitions', 'Animations', 'Diaporama', 'Révision'];
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#f3f3f3', borderRadius: 14 * k, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', fontFamily: FONT}}>
			<div style={{height: 44 * k, background: C.ppt, color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 20 * k, fontSize: 20 * k, fontWeight: 700}}>
				<span style={{background: '#fff', color: C.ppt, borderRadius: 4 * k, padding: `0 ${8 * k}px`, marginRight: 14 * k, fontWeight: 900}}>P</span>
				Présentation1 — PowerPoint
			</div>
			<div style={{height: 40 * k, background: '#fff', display: 'flex', gap: 30 * k, alignItems: 'center', paddingLeft: 24 * k, fontSize: 17 * k, color: '#444'}}>
				{tabs.map((t, i) => (
					<span key={t} style={{borderBottom: i === 1 ? `${3 * k}px solid ${C.ppt}` : 'none', color: i === 1 ? C.ppt : '#444'}}>{t}</span>
				))}
			</div>
			<div style={{height: 90 * k, background: '#fafafa', borderBottom: '1px solid #ddd', display: 'flex', gap: 14 * k, alignItems: 'center', paddingLeft: 24 * k}}>
				{[...Array(16)].map((_, i) => (
					<div key={i} style={{width: 44 * k, height: 44 * k, borderRadius: 6 * k, background: i % 5 === 0 ? '#e7e7e7' : '#eee', border: '1px solid #ddd'}} />
				))}
			</div>
			<div style={{display: 'flex', height: h - 174 * k}}>
				<div style={{width: 190 * k, background: '#e9e9e9', padding: 16 * k}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{height: 90 * k, background: '#fff', marginBottom: 14 * k, border: i === 0 ? `${3 * k}px solid ${C.ppt}` : '1px solid #ccc'}} />
					))}
				</div>
				<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d9d9d9'}}>
					<div style={{width: 1000 * k, height: 562 * k, background: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'}}>
						{children ?? (
							<div style={{position: 'absolute', inset: 60 * k, border: `${2 * k}px dashed #bbb`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 40 * k}}>
								Cliquez pour ajouter un titre
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Conteneur de diapositive 960x540 mis à l'échelle
export const SlideBox: React.FC<{w: number; children: React.ReactNode; style?: React.CSSProperties}> = ({w, children, style}) => (
	<div style={{width: w, height: (w * 9) / 16, position: 'relative', overflow: 'hidden', ...style}}>
		<div style={{width: 960, height: 540, transform: `scale(${w / 960})`, transformOrigin: 'top left', position: 'absolute'}}>{children}</div>
	</div>
);

// Diapositive « à la Esther » : chargée, criarde, incohérente
export const MessySlide: React.FC<{step?: number; shake?: number}> = ({step = 99, shake = 0}) => {
	const f = useCurrentFrame();
	const sx = shake ? Math.sin(f * 1.7) * shake : 0;
	const show = (i: number) => (step >= i ? 1 : 0);
	const lorem =
		'• Le projet a commencé en janvier avec beaucoup de réunions et de nombreuses actions qui ont été menées par les équipes sur le terrain • Les résultats sont en hausse de 12 % mais aussi certains indicateurs sont en baisse de 3 % selon les données du trimestre • Il faut aussi noter que plusieurs facteurs externes ont influencé les chiffres présentés ci-dessous • Budget, délais, ressources humaines, logistique, communication, partenaires, risques, perspectives et recommandations pour la suite du projet en 2026 et 2027';
	return (
		<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#ff4fd8,#fff200 45%,#00e1ff)', transform: `translateX(${sx}px)`}}>
			<div style={{opacity: show(0), position: 'absolute', top: 14, left: 30, fontFamily: 'FreeSerif', fontStyle: 'italic', fontWeight: 700, fontSize: 60, color: '#d10000', textShadow: '4px 4px 0 #00a', transform: 'rotate(-3deg)'}}>
				RAPPORT DU PROJET !!!
			</div>
			<div style={{opacity: show(1), position: 'absolute', top: 110, left: 24, width: 560, fontFamily: 'Courier 10 Pitch, monospace', fontSize: 15, lineHeight: 1.25, color: '#222', background: 'rgba(255,255,255,0.5)', padding: 8}}>
				{lorem} {lorem}
			</div>
			<svg style={{opacity: show(2), position: 'absolute', top: 20, right: 30}} width="190" height="190" viewBox="-100 -100 200 200">
				<polygon
					points={[...Array(24)].map((_, i) => {
						const r = i % 2 ? 60 : 95;
						const a = (i * Math.PI) / 12;
						return `${Math.cos(a) * r},${Math.sin(a) * r}`;
					}).join(' ')}
					fill="#ffea00"
					stroke="#f00"
					strokeWidth="5"
				/>
				<text textAnchor="middle" y="10" fontSize="30" fontWeight="900" fill="#f00" fontFamily="FreeSans">NEW !!</text>
			</svg>
			<div style={{opacity: show(3), position: 'absolute', top: 250, right: 30, display: 'grid', gridTemplateColumns: 'repeat(4,62px)', border: '3px solid #000'}}>
				{[...Array(20)].map((_, i) => (
					<div key={i} style={{height: 26, background: ['#f00', '#0f0', '#00f', '#ff0', '#f0f'][i % 5], border: '1px solid #000', fontSize: 12, color: '#fff', textAlign: 'center'}}>{(i * 37) % 100}</div>
				))}
			</div>
			<Img src={staticFile('1.png')} style={{opacity: show(4), position: 'absolute', bottom: 20, left: 60, width: 230, transform: 'rotate(8deg)', border: '8px solid #00ff00'}} />
			<div style={{opacity: show(5), position: 'absolute', bottom: 60, left: 340, fontSize: 90, color: '#7a00ff', transform: 'rotate(-20deg)'}}>➜</div>
			<div style={{opacity: show(5), position: 'absolute', bottom: 150, right: 330, width: 90, height: 90, borderRadius: '50%', background: '#ff6a00', border: '6px dashed #00f'}} />
			<div style={{opacity: show(6), position: 'absolute', bottom: 16, right: 30, fontFamily: 'Liberation Serif', fontWeight: 700, fontSize: 38, color: '#008800', textShadow: '2px 2px 0 #fff'}}>
				Merci de votre attention !!
			</div>
		</div>
	);
};

// Diapositive « à la Paul » : claire, hiérarchisée, un message par slide
export const CleanSlide: React.FC<{variant?: 'chart' | 'compare' | 'title'; p?: number}> = ({variant = 'chart', p = 1}) => {
	const bars = [42, 55, 68, 91];
	return (
		<div style={{position: 'absolute', inset: 0, background: '#fff', fontFamily: FONT}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: C.navy}} />
			<div style={{position: 'absolute', left: 60, top: 40, fontSize: 18, fontWeight: 800, color: C.orange, letterSpacing: 3}}>
				{variant === 'compare' ? 'AVANT / APRÈS' : variant === 'title' ? 'PROJET 2026' : 'RÉSULTATS'}
			</div>
			<div style={{position: 'absolute', left: 60, top: 70, fontSize: 40, fontWeight: 900, color: C.navy, width: 820, lineHeight: 1.1}}>
				{variant === 'chart' && 'Chiffre d’affaires : +117 % en 4 trimestres'}
				{variant === 'compare' && 'Délai de traitement divisé par 4'}
				{variant === 'title' && 'Résultats du projet et 3 leviers de croissance'}
			</div>
			{variant === 'chart' && (
				<div style={{position: 'absolute', left: 90, right: 90, bottom: 60, height: 300, display: 'flex', alignItems: 'flex-end', gap: 60, borderBottom: '3px solid #cfd6e0'}}>
					{bars.map((b, i) => (
						<div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
							<div style={{fontSize: 22, fontWeight: 800, color: i === 3 ? C.orange : C.navy, opacity: p > 0.8 ? 1 : 0}}>{b} M</div>
							<div style={{width: '100%', height: `${b * Math.min(1, p) * 0.95}%`, background: i === 3 ? C.orange : '#c9d3e6', borderRadius: '8px 8px 0 0'}} />
							<div style={{position: 'absolute', bottom: 20, fontSize: 16, color: '#667'}} />
						</div>
					))}
				</div>
			)}
			{variant === 'compare' && (
				<div style={{position: 'absolute', left: 60, right: 60, top: 190, display: 'flex', gap: 40}}>
					{[
						['48 h', 'Avant', '#e2e8f0', '#64748b'],
						['12 h', 'Après', C.orange, '#fff'],
					].map(([v, l, bg, fg], i) => (
						<div key={i} style={{flex: 1, height: 280, background: bg, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * Math.min(1, p)})`}}>
							<div style={{fontSize: 26, fontWeight: 700, color: fg}}>{l}</div>
							<div style={{fontSize: 110, fontWeight: 900, color: fg}}>{v}</div>
						</div>
					))}
				</div>
			)}
			{variant === 'title' && (
				<div style={{position: 'absolute', left: 60, top: 230, display: 'flex', gap: 30}}>
					{['Clients', 'Processus', 'Équipe'].map((t, i) => (
						<div key={t} style={{width: 250, height: 200, borderRadius: 18, background: i === 0 ? C.navy : '#eef2f8', color: i === 0 ? '#fff' : C.navy, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: 28, fontWeight: 800, opacity: Math.min(1, p * 3 - i)}}>
							<div style={{fontSize: 70, fontWeight: 900, color: C.orange}}>{i + 1}</div>
							{t}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Photo réaliste avec lent zoom (effet Ken Burns)
export const KenBurns: React.FC<{src: string; dur: number; from?: number; to?: number; ox?: string; oy?: string; fit?: 'cover' | 'contain'}> = ({src, dur, from = 1, to = 1.15, ox = '50%', oy = '50%', fit = 'cover'}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, dur], [from, to], CL);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, transform: `scale(${s})`, transformOrigin: `${ox} ${oy}`}} />
		</AbsoluteFill>
	);
};

// Coffret produit (recadré depuis l'image 4)
export const ProductBox: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => (
	<div style={{width: w, height: w * 1.55, overflow: 'hidden', position: 'relative', borderRadius: 8, ...style}}>
		<Img src={staticFile('4.webp')} style={{position: 'absolute', height: '100%', left: 0, top: 0, width: 'auto', objectFit: 'cover', objectPosition: 'left'}} />
	</div>
);

export const BigText: React.FC<{text: string; start: number; size?: number; color?: string; y?: number; weight?: number; align?: 'left' | 'center'}> = ({text, start, size = 90, color = '#fff', y = 0, weight = 900, align = 'center'}) => {
	const p = usePop(start);
	return (
		<div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, textAlign: align, lineHeight: 1.1, transformOrigin: align === 'left' ? 'left center' : 'center', transform: `translateY(${(1 - p) * 40 + y}px) scale(${0.9 + 0.1 * p})`, opacity: p, textShadow: '0 6px 30px rgba(0,0,0,0.35)'}}>
			{text}
		</div>
	);
};

export const Symbol: React.FC<{ch: string; x: number; y: number; start: number; size?: number; color?: string}> = ({ch, x, y, start, size = 80, color = '#ff3b30'}) => {
	const p = usePop(start, 8);
	const f = useCurrentFrame();
	if (f < start) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y + Math.sin(f / 8) * 5, fontSize: size, fontWeight: 900, color, fontFamily: FONT, transform: `scale(${p})`, zIndex: 30, textShadow: '0 4px 10px rgba(0,0,0,0.25)'}}>
			{ch}
		</div>
	);
};
