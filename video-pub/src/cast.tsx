import React from 'react';
import {AbsoluteFill, Img, interpolate, Loop, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import cast from './cast.json';
import {C, CL, FONT, SlideBox, WHO} from './kit';

export const ROLE: Record<string, string> = {
	JEAN: 'Employé',
	PAUL: 'Employé',
	DIRECTEUR: 'M. Koffi',
	ESTHER: 'Collègue de Jean',
	POSE: 'Narrateur',
	SONIA: 'Étudiante en ingénierie',
	'COLLÈGUE': 'Collègue',
};

// Plans vivants redécoupés dans les clips réalistes (secondes dans le clip).
// Utilisés à la place des photos : le personnage bouge, cligne des yeux, respire.
type Seg = {src: string; from: number; to: number; rate?: number; scale?: number; origin?: string};
export const LIVE: Record<string, Seg[]> = {
	DIRECTEUR: [
		{src: 'clips/s01.mp4', from: 0.9, to: 3.3, rate: 0.8, scale: 1.35, origin: '22% 30%'},
		{src: 'clips/s01.mp4', from: 5.2, to: 7.8, rate: 0.8, scale: 1.3, origin: '30% 35%'},
	],
	PAUL: [{src: 'clips/s01.mp4', from: 5.0, to: 7.8, rate: 0.7, scale: 2.1, origin: '98% 38%'}],
	JEAN: [
		{src: 'clips/s02.mp4', from: 0.0, to: 1.25, rate: 0.5, scale: 1.1, origin: '50% 30%'},
		{src: 'clips/s02.mp4', from: 5.4, to: 6.8, rate: 0.6, scale: 1.25, origin: '55% 35%'},
	],
	BUREAU: [{src: 'clips/s01.mp4', from: 8.0, to: 10.0, rate: 0.7, scale: 1.05}],
};

export const LiveShot: React.FC<{seg: Seg; dur: number}> = ({seg, dur}) => {
	const f = useCurrentFrame();
	const rate = seg.rate ?? 1;
	const len = Math.max(10, Math.floor(((seg.to - seg.from) * 30) / rate) - 1);
	const push = interpolate(f, [0, dur], [1, 1.06], CL);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${(seg.scale ?? 1) * push})`, transformOrigin: seg.origin ?? '50% 50%'}}>
				<Loop durationInFrames={len}>
					<OffthreadVideo src={staticFile(seg.src)} startFrom={Math.round(seg.from * 30)} endAt={Math.round(seg.to * 30)} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Loop>
			</AbsoluteFill>
		</AbsoluteFill>
	);
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

export const Portrait: React.FC<{who: string; mood?: string; dur: number; focus?: string; zoomOut?: boolean; noTag?: boolean; v?: number}> = ({who, mood, dur, focus = '50% 35%', zoomOut, noTag, v = 0}) => {
	const f = useCurrentFrame();
	const live = LIVE[plain(who)];
	if (live) return (
		<AbsoluteFill>
			<LiveShot seg={live[v % live.length]} dur={dur} />
			{!noTag && <NameTag who={who} />}
		</AbsoluteFill>
	);
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
