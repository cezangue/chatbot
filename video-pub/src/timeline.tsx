import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, Series, staticFile, useCurrentFrame} from 'remotion';
import voice from './voice.json';
import lines from '../script/lines.json';
import {CL, FONT, WHO} from './kit';

type VoiceMeta = Record<string, {frames: number; env: number[]}>;
const V = voice as VoiceMeta;
const L = lines as unknown as Record<string, [string, string]>;

export type Timed = {id: string; from: number; to: number};
export type Ctx = {dur: number; t: Timed[]};
export type Beat = {
	lines?: string[];
	min?: number; // durée minimale (images)
	lead?: number; // silence avant la 1re réplique
	gap?: number; // silence entre répliques
	tail?: number; // silence après la dernière réplique
	place?: string;
	sfx?: {src: string; at: number; volume?: number}[];
	render: (c: Ctx) => React.ReactNode;
};

export const layout = (b: Beat): Ctx => {
	const gap = b.gap ?? 6;
	let cur = b.lead ?? 8;
	const t: Timed[] = [];
	for (const id of b.lines ?? []) {
		if (!V[id]) throw new Error(`Réplique sans voix : ${id} (lancer npm run voices)`);
		t.push({id, from: cur, to: cur + V[id].frames});
		cur += V[id].frames + gap;
	}
	const end = t.length ? t[t.length - 1].to + (b.tail ?? 8) : cur;
	return {dur: Math.max(b.min ?? 0, end), t};
};

export const sceneDur = (beats: Beat[]) => beats.reduce((a, b) => a + layout(b).dur, 0);

// Sous-titre synchronisé avec la voix + indicateur de parole
const SyncCaption: React.FC<{tm: Timed}> = ({tm}) => {
	const f = useCurrentFrame();
	const [who, text] = L[tm.id];
	const end = tm.to + 8;
	if (f < tm.from - 4 || f > end) return null;
	const o = interpolate(f, [tm.from - 4, tm.from + 4, end - 6, end], [0, 1, 1, 0], CL);
	const p = interpolate(f, [tm.from, tm.from + (tm.to - tm.from) * 0.92], [0, 1], CL);
	const n = Math.ceil(text.length * p);
	const env = V[tm.id].env;
	const lvl = env[Math.max(0, Math.min(env.length - 1, f - tm.from))] ?? 0;
	const color = WHO[who] ?? '#fff';
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', opacity: o, fontFamily: FONT, zIndex: 60}}>
			<div style={{maxWidth: 1560, background: 'rgba(7,12,30,0.88)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: '16px 40px 22px', color: '#fff', fontSize: 42, fontWeight: 600, lineHeight: 1.28, textAlign: 'center', borderLeft: `8px solid ${color}`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 24, fontWeight: 900, color, letterSpacing: 4, marginBottom: 4}}>
					{who}
					<div style={{display: 'flex', gap: 3, alignItems: 'center', height: 24}}>
						{[0.6, 1, 0.8, 0.5].map((k, i) => (
							<div key={i} style={{width: 4, borderRadius: 2, background: color, height: 4 + 20 * Math.min(1, lvl * k * 1.4) * (f <= tm.to ? 1 : 0)}} />
						))}
					</div>
				</div>
				<span>{text.slice(0, n)}</span>
				<span style={{color: 'transparent'}}>{text.slice(n)}</span>
			</div>
		</div>
	);
};

const PlaceTag: React.FC<{text: string}> = ({text}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [4, 16, 80, 96], [0, 1, 1, 0], CL);
	return (
		<div style={{position: 'absolute', top: 44, left: 56, opacity: o, fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '10px 20px', borderRadius: 8, zIndex: 55}}>
			{text}
		</div>
	);
};

export const BeatView: React.FC<{b: Beat}> = ({b}) => {
	const c = layout(b);
	return (
		<AbsoluteFill>
			{b.render(c)}
			{c.t.map((tm) => (
				<Sequence key={tm.id} from={tm.from} durationInFrames={tm.to - tm.from + 2} layout="none">
					<Audio src={staticFile(`voice/${tm.id}.wav`)} />
				</Sequence>
			))}
			{(b.sfx ?? []).map((s, i) => (
				<Sequence key={i} from={s.at} layout="none">
					<Audio src={staticFile(s.src)} volume={s.volume ?? 0.6} />
				</Sequence>
			))}
			{c.t.map((tm) => (
				<SyncCaption key={tm.id} tm={tm} />
			))}
			{b.place && <PlaceTag text={b.place} />}
		</AbsoluteFill>
	);
};

export const SceneView: React.FC<{beats: Beat[]}> = ({beats}) => (
	<Series>
		{beats.map((b, i) => (
			<Series.Sequence key={i} durationInFrames={layout(b).dur}>
				<BeatView b={b} />
			</Series.Sequence>
		))}
	</Series>
);
