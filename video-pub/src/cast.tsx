import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import cast from './cast.json';
import {C, CL, FONT, SlideBox, WHO} from './kit';

export const ROLE: Record<string, string> = {
	JEAN: 'Employé',
	PAUL: 'Employé',
	DIRECTEUR: 'Direction',
	ESTHER: 'Collègue de Jean',
	POSE: 'Narrateur',
	SONIA: 'Étudiante en ingénierie',
	'COLLÈGUE': 'Collègue',
};

// Photos déposées dans public/cast/ : NOM.jpg, ou NOM-humeur.jpg (ex. JEAN-stress.png)
const plain = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const castSrc = (whoRaw: string, mood?: string): string | null => {
	const files = cast as string[];
	const who = plain(whoRaw);
	const pick = (k: string) => files.find((f) => f.replace(/\.\w+$/, '').toUpperCase() === k.toUpperCase());
	return (mood && pick(`${who}-${mood}`)) || pick(who) || files.find((f) => f.toUpperCase().startsWith(`${who.toUpperCase()}-`)) || null;
};

const NameTag: React.FC<{who: string}> = ({who}) => (
	<div style={{position: 'absolute', top: 44, right: 56, fontFamily: FONT, textAlign: 'right', zIndex: 20}}>
		<div style={{fontSize: 40, fontWeight: 900, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>{who === 'POSE' ? 'Pose' : who.charAt(0) + who.slice(1).toLowerCase()}</div>
		<div style={{fontSize: 22, fontWeight: 700, color: WHO[who] ?? '#fff', letterSpacing: 2, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{ROLE[who]}</div>
	</div>
);

// Silhouette provisoire tant qu'aucune photo n'est fournie pour le personnage
const Placeholder: React.FC<{who: string}> = ({who}) => {
	const f = useCurrentFrame();
	const col = WHO[who] ?? '#888';
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #2a3350, #070a14 75%)'}}>
			{[...Array(7)].map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 150 + i * 260, top: 120 + ((i * 97) % 300), width: 160, height: 160, borderRadius: '50%', background: i % 2 ? col : '#ffd9a0', opacity: 0.1, filter: 'blur(30px)', transform: `translateX(${Math.sin((f + i * 30) / 60) * 20}px)`}} />
			))}
			<svg viewBox="0 0 800 800" style={{position: 'absolute', left: 560, top: 180, width: 800, height: 900}}>
				<defs>
					<linearGradient id="rim" x1="0" x2="1">
						<stop offset="0" stopColor={col} stopOpacity="0.9" />
						<stop offset="0.15" stopColor="#0b0f1c" />
						<stop offset="1" stopColor="#0b0f1c" />
					</linearGradient>
				</defs>
				<ellipse cx="400" cy="250" rx="130" ry="160" fill="url(#rim)" />
				<path d="M120 800 Q140 470 400 450 Q660 470 680 800 Z" fill="url(#rim)" />
			</svg>
			<NameTag who={who} />
		</AbsoluteFill>
	);
};

export const Portrait: React.FC<{who: string; mood?: string; dur: number; focus?: string; zoomOut?: boolean; noTag?: boolean}> = ({who, mood, dur, focus = '50% 35%', zoomOut, noTag}) => {
	const f = useCurrentFrame();
	const src = castSrc(who, mood);
	if (!src) return <Placeholder who={who} />;
	const s = interpolate(f, [0, dur], zoomOut ? [1.16, 1.04] : [1.04, 1.16], CL);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: 'blur(40px) brightness(0.5)', transform: 'scale(1.25)'}}>
				<Img src={staticFile(`cast/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: focus}}>
				<Img src={staticFile(`cast/${src}`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55))'}} />
			{!noTag && <NameTag who={who} />}
		</AbsoluteFill>
	);
};

// Plan « point de vue du public » : écran de projection dans une salle sombre
export const Projector: React.FC<{children: React.ReactNode; shake?: number; audience?: 'lost' | 'happy'}> = ({children, shake = 0, audience}) => {
	const f = useCurrentFrame();
	const sx = shake ? Math.sin(f * 1.9) * shake : 0;
	const heads = [120, 420, 760, 1120, 1460, 1780];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2b3345, #07090f 70%)'}}>
			<div style={{position: 'absolute', left: 250, top: 60, padding: 8, background: '#0c0c0c', boxShadow: '0 0 160px rgba(180,200,255,0.25)', transform: `translateX(${sx}px)`}}>
				<SlideBox w={1420}>{children}</SlideBox>
			</div>
			<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
				{heads.map((x, i) => {
					const tilt = audience === 'lost' && i % 2 ? 12 + Math.sin(f / 20 + i) * 4 : audience === 'happy' ? Math.sin(f / 9 + i) * 3 : 0;
					return (
						<g key={i} transform={`rotate(${tilt} ${x} 1000)`}>
							<ellipse cx={x} cy={930 + (i % 2) * 20} rx={70} ry={85} fill="#05070b" />
							<path d={`M${x - 190} 1080 Q${x - 170} 990 ${x} 985 Q${x + 170} 990 ${x + 190} 1080 Z`} fill="#05070b" />
						</g>
					);
				})}
			</svg>
			<AbsoluteFill style={{background: 'linear-gradient(transparent 70%, rgba(0,0,0,0.6))'}} />
		</AbsoluteFill>
	);
};

export const TitleCard: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [0, 10], [0, 1], CL);
	const ls = interpolate(f, [0, 60], [4, 14], CL);
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', fontFamily: FONT, color: '#fff', opacity: o}}>
			<div style={{fontSize: 96, fontWeight: 900, letterSpacing: ls}}>{text}</div>
			{sub && <div style={{fontSize: 34, color: C.yellow, marginTop: 20}}>{sub}</div>}
		</AbsoluteFill>
	);
};
