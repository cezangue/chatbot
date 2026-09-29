import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Bonhomme, C, CL, FONT} from './kit';

// Diapositives « Méthode Bonhomme » : ce que produit Paul grâce au document.
// Coordonnées dans un plan 960×540 (voir SlideBox).

export type BVariant = 'title' | 'levers' | 'chart' | 'compare' | 'idea' | 'thesis' | 'class' | 'pitch';

const useIn = (delay: number) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: f - delay, fps, config: {damping: 14, stiffness: 110}});
};

const Frame: React.FC<{kicker: string; title: string; children: React.ReactNode}> = ({kicker, title, children}) => {
	const p = useIn(0);
	return (
		<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#ffffff,#f1f4f9)', fontFamily: FONT, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: C.navy}} />
			<div style={{position: 'absolute', left: 50, top: 30, fontSize: 16, fontWeight: 800, color: C.orange, letterSpacing: 3, opacity: p}}>{kicker}</div>
			<div style={{position: 'absolute', left: 50, top: 54, fontSize: 36, fontWeight: 900, color: C.navy, width: 860, lineHeight: 1.1, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>{title}</div>
			{children}
			<div style={{position: 'absolute', right: 24, bottom: 14, fontSize: 12, color: '#98a2b3', fontWeight: 600}}>Projet 2026</div>
		</div>
	);
};

const Card: React.FC<{x: number; y: number; w: number; h: number; delay: number; dark?: boolean; children: React.ReactNode}> = ({x, y, w, h, delay, dark, children}) => {
	const p = useIn(delay);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, background: dark ? C.navy : '#fff', boxShadow: '0 10px 30px rgba(11,31,77,0.12)', opacity: p, transform: `translateY(${(1 - p) * 40}px)`, overflow: 'visible'}}>
			{children}
		</div>
	);
};

export const BSlide: React.FC<{v: BVariant}> = ({v}) => {
	const f = useCurrentFrame();
	const bob = (k = 0) => Math.sin((f + k) / 10) * 4;

	if (v === 'title') {
		const p = useIn(8);
		return (
			<Frame kicker="RÉSULTATS DU PROJET" title="Notre croissance repose sur 3 leviers">
				<div style={{position: 'absolute', left: 50, top: 170, width: 420, fontSize: 24, color: '#475467', lineHeight: 1.5}}>
					Clients · Processus · Équipe
					<div style={{marginTop: 30, fontSize: 64, fontWeight: 900, color: C.orange}}>+117 %</div>
					<div style={{fontSize: 18}}>de chiffre d’affaires en 4 trimestres</div>
				</div>
				<div style={{position: 'absolute', left: 560, top: 150, width: 330, height: 250, background: '#fff', border: '6px solid #d0d5dd', borderRadius: 8, opacity: p}}>
					<svg viewBox="0 0 330 250" style={{width: '100%', height: '100%'}}>
						<polyline points="20,220 100,170 170,185 240,100 310,40" fill="none" stroke={C.orange} strokeWidth="10" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 - 500 * p} />
					</svg>
				</div>
				<Bonhomme x={470} y={230} s={0.72} tie={C.blue} armR={-110 + bob()} />
			</Frame>
		);
	}

	if (v === 'levers') {
		const items: [string, string, React.ReactNode][] = [
			['1', 'Clients', <><Bonhomme key="a" x={40} y={80} s={0.33} tie={C.orange} armR={-60} /><Bonhomme key="b" x={100} y={80} s={0.33} tie={C.blue} armL={60} /></>],
			['2', 'Processus', <><Bonhomme key="a" x={50} y={80} s={0.33} tie={C.blue} armR={-100 + bob()} /><div key="g" style={{position: 'absolute', left: 140, top: 70, fontSize: 60, transform: `rotate(${f * 3}deg)`}}>⚙️</div></>],
			['3', 'Équipe', <>{[0, 1, 2].map((i) => <Bonhomme key={i} x={20 + i * 55} y={80 + (i === 1 ? -10 : 0)} s={0.33} tie={[C.orange, C.blue, C.green][i]} armL={i === 0 ? 150 : 8} armR={i === 2 ? -150 : -8} />)}</>],
		];
		return (
			<Frame kicker="LES 3 LEVIERS" title="Ce qui explique notre évolution">
				{items.map(([n, t, fig], i) => (
					<Card key={n} x={50 + i * 295} y={140} w={265} h={340} delay={10 + i * 12} dark={i === 0}>
						<div style={{position: 'absolute', left: 22, top: 14, fontSize: 48, fontWeight: 900, color: C.orange}}>{n}</div>
						<div style={{position: 'absolute', left: 22, top: 74, fontSize: 28, fontWeight: 800, color: i === 0 ? '#fff' : C.navy}}>{t}</div>
						<div style={{position: 'absolute', left: 20, top: 110, width: 230, height: 220}}>{fig}</div>
					</Card>
				))}
			</Frame>
		);
	}

	if (v === 'chart') {
		const p = interpolate(f, [8, 50], [0, 1], CL);
		const bars = [42, 55, 68, 91];
		return (
			<Frame kicker="CHIFFRE D’AFFAIRES (M FCFA)" title="+117 % en 4 trimestres">
				{bars.map((b, i) => {
					const h = b * 3.4 * p;
					return (
						<div key={i} style={{position: 'absolute', left: 90 + i * 190, bottom: 50, width: 130}}>
							<div style={{position: 'absolute', bottom: h + 6, width: '100%', textAlign: 'center', fontSize: 22, fontWeight: 900, color: i === 3 ? C.orange : C.navy, opacity: p}}>{b}</div>
							<div style={{position: 'absolute', bottom: 0, width: '100%', height: h, background: i === 3 ? C.orange : '#c7d2e6', borderRadius: '10px 10px 0 0'}} />
							<div style={{position: 'absolute', bottom: -30, width: '100%', textAlign: 'center', fontSize: 16, color: '#667085'}}>T{i + 1}</div>
						</div>
					);
				})}
				{p > 0.95 && <Bonhomme x={660} y={10 + bob()} s={0.38} tie={C.blue} armL={150} armR={-150} />}
				{p > 0.95 && <div style={{position: 'absolute', left: 740, top: 0, fontSize: 40}}>🏆</div>}
				<Bonhomme x={420} y={250 - 60 * p} s={0.32} tie={C.orange} armR={-120} armL={40} opacity={p} />
			</Frame>
		);
	}

	if (v === 'compare') {
		const p = useIn(20);
		return (
			<Frame kicker="AVANT / APRÈS" title="Délai de traitement divisé par 4">
				<Card x={50} y={140} w={410} h={350} delay={6}>
					<div style={{position: 'absolute', left: 24, top: 18, fontSize: 22, fontWeight: 700, color: '#667085'}}>Avant</div>
					<div style={{position: 'absolute', left: 24, top: 50, fontSize: 80, fontWeight: 900, color: '#98a2b3'}}>48 h</div>
					<Bonhomme x={230} y={150} s={0.45} tilt={20} armL={0} armR={0} />
					<div style={{position: 'absolute', left: 180, top: 210, width: 60, height: 110, background: 'repeating-linear-gradient(#fff 0 8px,#d0d5dd 8px 10px)', border: '1px solid #d0d5dd'}} />
				</Card>
				<Card x={500} y={140} w={410} h={350} delay={18} dark>
					<div style={{position: 'absolute', left: 24, top: 18, fontSize: 22, fontWeight: 700, color: '#fff'}}>Après</div>
					<div style={{position: 'absolute', left: 24, top: 50, fontSize: 80, fontWeight: 900, color: C.orange}}>12 h</div>
					<Bonhomme x={240} y={140 - Math.abs(Math.sin(f / 8)) * 20 * p} s={0.45} tie={C.orange} armL={150} armR={-150} />
				</Card>
			</Frame>
		);
	}

	if (v === 'idea') {
		const p = useIn(14);
		return (
			<Frame kicker="PROBLÈME → SOLUTION" title="Une idée claire, une image simple">
				<Bonhomme x={120} y={160} s={0.8} tilt={-12} armR={-150} />
				<div style={{position: 'absolute', left: 250, top: 140, fontSize: 90, fontWeight: 900, color: C.red}}>?</div>
				<div style={{position: 'absolute', left: 420, top: 290, fontSize: 80, color: C.orange, opacity: p}}>➜</div>
				<Bonhomme x={620} y={160} s={0.8} tie={C.blue} armR={-160} armL={20} opacity={p} />
				<div style={{position: 'absolute', left: 760, top: 110, fontSize: 90, opacity: p, transform: `scale(${p})`}}>💡</div>
			</Frame>
		);
	}

	if (v === 'thesis') {
		const p = interpolate(f, [10, 60], [0, 1], CL);
		return (
			<Frame kicker="SOUTENANCE D’INGÉNIEUR" title="Réduire les pertes d’un réseau électrique">
				<Bonhomme x={60} y={170} s={0.8} scarf="#8b5cf6" hair armR={-110 + bob()} />
				<div style={{position: 'absolute', left: 280, top: 150, display: 'flex', gap: 22}}>
					{[['Pertes', '−32 %'], ['Coût', '−18 %'], ['Fiabilité', '+25 %']].map(([a, b], i) => (
						<div key={a} style={{width: 190, height: 170, borderRadius: 16, background: i === 0 ? C.navy : '#fff', boxShadow: '0 10px 30px rgba(11,31,77,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: interpolate(p, [i * 0.25, i * 0.25 + 0.3], [0, 1], CL)}}>
							<div style={{fontSize: 46, fontWeight: 900, color: C.orange}}>{b}</div>
							<div style={{fontSize: 20, fontWeight: 700, color: i === 0 ? '#fff' : C.navy}}>{a}</div>
						</div>
					))}
				</div>
				<div style={{position: 'absolute', left: 280, top: 360, width: 610, height: 110, borderRadius: 14, background: '#fff5eb', border: `2px solid ${C.orange}`, fontSize: 22, color: C.navy, fontWeight: 700, padding: '20px 26px', boxSizing: 'border-box', opacity: p}}>
					Conclusion : la solution proposée est rentable dès la 2ᵉ année.
				</div>
			</Frame>
		);
	}

	if (v === 'class') {
		return (
			<Frame kicker="EXPOSÉ — SVT" title="Le cycle de l’eau en 3 étapes">
				{['☀️ Évaporation', '☁️ Condensation', '🌧️ Précipitations'].map((t, i) => (
					<Card key={t} x={50 + i * 295} y={170} w={265} h={200} delay={8 + i * 14}>
						<div style={{fontSize: 30, fontWeight: 800, color: C.navy, padding: 24}}>{t}</div>
					</Card>
				))}
				<Bonhomme x={400} y={330} s={0.45} scarf="#0ea5e9" armR={-120 + bob()} />
			</Frame>
		);
	}

	// pitch entrepreneur
	const p = useIn(12);
	return (
		<Frame kicker="PITCH" title="Livrer les repas des étudiants en 20 minutes">
			<div style={{position: 'absolute', left: 50, top: 160, display: 'flex', gap: 30, alignItems: 'center'}}>
				{[['😩', 'Problème'], ['📱', 'Solution'], ['💰', 'Marché']].map(([e, t], i) => (
					<React.Fragment key={t}>
						<div style={{width: 220, height: 200, borderRadius: 18, background: i === 1 ? C.navy : '#fff', boxShadow: '0 10px 30px rgba(11,31,77,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: interpolate(p, [0, 1], [0, 1]) }}>
							<div style={{fontSize: 70}}>{e}</div>
							<div style={{fontSize: 26, fontWeight: 800, color: i === 1 ? '#fff' : C.navy}}>{t}</div>
						</div>
						{i < 2 && <div style={{fontSize: 50, color: C.orange}}>➜</div>}
					</React.Fragment>
				))}
			</div>
			<Bonhomme x={820} y={260} s={0.5} tie={C.orange} armL={140 + bob()} />
		</Frame>
	);
};
