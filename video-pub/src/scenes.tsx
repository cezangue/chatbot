import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
	BigText,
	Bonhomme,
	C,
	CL,
	Caption,
	CleanSlide,
	Desk,
	FONT,
	KenBurns,
	MessySlide,
	Office,
	Place,
	PPTWindow,
	ProductBox,
	SlideBox,
	Symbol,
	usePop,
} from './kit';

const bob = (f: number, speed = 20, amp = 3) => Math.sin(f / speed) * amp;

const Room: React.FC<{slide: React.ReactNode; audienceMood?: 'lost' | 'happy'; presenter: 'jean' | 'paul' | 'sonia'; jury?: boolean}> = ({slide, audienceMood, presenter, jury}) => {
	const f = useCurrentFrame();
	const people = jury ? [0, 1, 2] : [0, 1, 2, 3, 4];
	return (
		<AbsoluteFill style={{background: 'linear-gradient(#dfe5ee,#c3ccd9)'}}>
			<div style={{position: 'absolute', left: 520, top: 50, width: 880, height: 495, background: '#111', padding: 10, boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
				<SlideBox w={860}>{slide}</SlideBox>
			</div>
			{presenter === 'jean' && <Bonhomme x={170} y={300 + bob(f, 6, 2)} s={1.15} tie={C.red} armR={-30 + bob(f, 5, 12)} tilt={bob(f, 7, 4)} />}
			{presenter === 'paul' && <Bonhomme x={170} y={300} s={1.15} tie={C.blue} armR={-70 + bob(f, 25, 8)} tilt={bob(f, 30, 3)} />}
			{presenter === 'sonia' && <Bonhomme x={170} y={300} s={1.15} hair scarf="#8b5cf6" armR={-70 + bob(f, 25, 8)} />}
			{people.map((i) => {
				const lost = audienceMood === 'lost';
				const happy = audienceMood === 'happy';
				const x = (jury ? 700 : 560) + i * 250;
				return (
					<React.Fragment key={i}>
						<Bonhomme
							x={x}
							y={640}
							s={0.95}
							suit={i === 0 && !jury ? '#1f2937' : undefined}
							tie={i === 0 && !jury ? '#6b7280' : undefined}
							noLegs
							tilt={lost && i % 2 ? 15 + bob(f, 30, 5) : happy ? bob(f + i * 10, 15, 4) : 0}
							armL={happy && f > 240 ? 150 + bob(f * 3 + i, 2, 10) : 8}
							armR={happy && f > 240 ? -150 - bob(f * 3 + i, 2, 10) : -8}
						/>
					</React.Fragment>
				);
			})}
			<div style={{position: 'absolute', left: jury ? 640 : 500, right: jury ? 300 : 60, top: 880, height: 200, background: 'linear-gradient(#5b6474,#3d4452)', borderRadius: '14px 14px 0 0', zIndex: 10}} />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 1 : Jean ne fera pas la présentation ───
export const S1: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Office />
			<Bonhomme x={820} y={260} s={1.1} suit="#1f2937" tie="#7f1d1d" armL={f > 150 && f < 230 ? 40 : 8} tilt={f > 150 ? 8 : -5} />
			<Desk x={600} y={600} w={700} />
			<Bonhomme x={300} y={380 + (f > 240 ? 6 : 0)} s={1.3} tie={C.red} tilt={f > 240 ? 18 : f > 60 ? -8 : 0} />
			<Bonhomme x={1380} y={380} s={1.3} tie={C.blue} armR={f > 235 && f < 280 ? -20 : -8} />
			<Symbol ch="!" x={520} y={320} start={70} />
			<Symbol ch="?" x={520} y={320} start={250} color="#ff9500" />
			<Place text="BUREAU DU DIRECTEUR — JOUR" />
			<Caption from={15} to={135} who="DIRECTEUR" text="Jean ne fera finalement pas la présentation demain." />
			<Caption from={140} to={225} who="DIRECTEUR" text="Paul, c’est toi qui feras la présentation." />
			<Caption from={230} to={300} who="PAUL" text="D’accord, Monsieur le Directeur." />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 2 : Mais pourquoi ? ───
export const S2: React.FC = () => {
	const f = useCurrentFrame();
	const flash = interpolate(f, [185, 195], [0, 1], CL);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 30% 50%, #1d3a8a, #050a1a 70%)'}}>
			<Bonhomme x={180} y={250} s={1.6} tie={C.yellow} armR={-40 + bob(f, 10, 15)} armL={20} tilt={bob(f, 25, 4)} />
			<div style={{position: 'absolute', left: 700, top: 230, width: 1100}}>
				<BigText text="Mais savez-vous pourquoi…" start={10} size={72} />
				<div style={{height: 30}} />
				<BigText text="…le directeur a choisi Paul à la place de Jean ?" start={60} size={60} color={C.yellow} />
				<div style={{height: 30}} />
				<BigText text="Qu’est-ce qui s’est réellement passé ?" start={115} size={48} weight={600} />
			</div>
			<Caption from={8} to={180} who="POSE" text="Pour le comprendre, remontons trois jours en arrière." />
			<AbsoluteFill style={{background: '#000', opacity: flash, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				{f > 195 && <BigText text="3 JOURS PLUS TÔT…" start={197} size={110} />}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─── SCÈNE 3 : Jean doit faire la présentation, il est perdu ───
export const S3: React.FC = () => {
	const f = useCurrentFrame();
	const cx = 900 + Math.sin(f / 13) * 420 + Math.sin(f / 5) * 60;
	const cy = 480 + Math.cos(f / 17) * 260;
	return (
		<AbsoluteFill>
			<Sequence durationInFrames={130}>
				<Office />
				<Bonhomme x={1100} y={330} s={1.3} suit="#1f2937" tie="#7f1d1d" armR={-45} />
				<Bonhomme x={560} y={330} s={1.3} tie={C.red} armL={f > 80 ? 60 : 8} />
				<Place text="3 JOURS PLUS TÔT — BUREAU" />
				<Caption from={5} to={78} who="DIRECTEUR" text="Jean, j’aimerais que ce soit toi qui présentes le projet à la prochaine réunion." />
				<Caption from={80} to={130} who="JEAN" text="Oui, Monsieur. Aucun problème !" />
			</Sequence>
			<Sequence from={130}>
				<AbsoluteFill style={{background: '#1a1f2b'}}>
					<PPTWindow w={1500} x={210} y={70} />
					<div style={{position: 'absolute', left: cx, top: cy, fontSize: 60, transform: 'rotate(-20deg)', zIndex: 40}}>➤</div>
					{f % 40 < 8 && <div style={{position: 'absolute', left: cx - 20, top: cy - 20, width: 60, height: 60, borderRadius: '50%', border: '4px solid #ff3b30', zIndex: 39}} />}
					<Symbol ch="?" x={1700} y={120} start={180} size={140} color={C.yellow} />
					<Caption from={150} to={300} who="JEAN" text="Euh… on commence même comment ici ?" />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ─── SCÈNES 4-5 : Esther aide Jean ───
export const S4: React.FC = () => {
	const f = useCurrentFrame();
	const step = Math.floor((f - 110) / 30);
	const labels = ['+ un titre « WordArt »', '+ beaucoup de texte', '+ des effets', '+ un tableau multicolore', '+ des images', '+ des formes', '+ encore une police'];
	return (
		<AbsoluteFill>
			<Sequence durationInFrames={110}>
				<Office />
				<Bonhomme x={500} y={330} s={1.3} tie={C.red} armR={-60} />
				<Bonhomme x={1150} y={330} s={1.3} hair scarf="#db2777" armL={f > 60 ? 70 : 8} />
				<Caption from={5} to={60} who="JEAN" text="Esther, tu peux m’aider avec PowerPoint ? Je ne sais même pas par où commencer." />
				<Caption from={62} to={110} who="ESTHER" text="PowerPoint ? Ça, je maîtrise ! Viens." />
			</Sequence>
			<Sequence from={110}>
				<AbsoluteFill style={{background: '#1a1f2b'}}>
					<PPTWindow w={1500} x={210} y={70}>
						<SlideBox w={(1000 * 1500) / 1400}>
							<MessySlide step={step} />
						</SlideBox>
					</PPTWindow>
					{labels.map((l, i) =>
						step >= i && step < 8 ? (
							<div key={i} style={{position: 'absolute', right: 40, top: 120 + i * 70, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff', background: C.ppt, padding: '8px 18px', borderRadius: 10, zIndex: 40}}>
								{l}
							</div>
						) : null,
					)}
					<Caption from={210} to={280} who="ESTHER" text="Voilà ! C’est terminé." />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ─── SCÈNE 5 bis : « C'est… bien, non ? » (gros plan écran)
export const S5: React.FC = () => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 120], [1, 1.12], CL);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${s})`}}>
				<SlideBox w={1920}>
					<MessySlide />
				</SlideBox>
			</AbsoluteFill>
			<Caption from={5} to={55} who="JEAN" text="C’est… bien, non ?" />
			<Caption from={58} to={120} who="ESTHER" text="Bien sûr !" />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 6 : La présentation ratée de Jean ───
export const S6: React.FC = () => {
	const f = useCurrentFrame();
	const wrong = f > 250 && f < 300;
	return (
		<AbsoluteFill>
			<Room
				presenter="jean"
				audienceMood={f > 90 ? 'lost' : undefined}
				slide={wrong ? <div style={{position: 'absolute', inset: 0, background: '#000', color: '#fff', fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>Diapositive 17 / 42</div> : <MessySlide shake={f > 150 && f < 220 ? 6 : 0} />}
			/>
			<Symbol ch="?" x={880} y={560} start={100} />
			<Symbol ch="Zz" x={1380} y={560} start={140} size={60} color="#64748b" />
			<Symbol ch="?" x={1640} y={560} start={170} />
			<Symbol ch="💧" x={370} y={280} start={200} size={50} />
			<Place text="SALLE DE RÉUNION — JOUR J" />
			<Caption from={10} to={120} who="JEAN" text="Bonjour à tous. Aujourd’hui, nous allons vous présenter…" />
			<Caption from={130} to={240} who="JEAN" text="Alors ici on voit… euh… comme vous pouvez le lire…" />
			<Caption from={245} to={390} who="JEAN" text="Euh… pardon… une seconde…" />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 7 : Jean déçu + Pose explique (photo réaliste 2) ───
export const S7: React.FC = () => {
	const f = useCurrentFrame();
	const dark = interpolate(f, [120, 150], [0.25, 0.75], CL);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: 'blur(30px) brightness(0.5)'}}>
				<KenBurns src="2.png" dur={330} from={1.2} to={1.2} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 420, top: 0, width: 1080, height: 1080, overflow: 'hidden'}}>
				<KenBurns src="2.png" dur={330} from={1.05} to={1.25} oy="35%" />
			</div>
			<AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
			<Caption from={10} to={115} who="JEAN" text="Pourtant, j’ai fait tout ce qu’il fallait…" />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
				{f > 125 && <BigText text="Jean avait travaillé." start={125} size={64} />}
				{f > 160 && <BigText text="Esther savait utiliser PowerPoint." start={160} size={64} />}
				{f > 200 && <BigText text="Le problème n’était pas la bonne volonté." start={200} size={56} weight={600} />}
				{f > 250 && <BigText text="C’était la MÉTHODE." start={250} size={110} color={C.yellow} />}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─── SCÈNE 8 : Quelques temps plus tard ───
export const S8: React.FC = () => {
	const f = useCurrentFrame();
	const p = usePop(170);
	return (
		<AbsoluteFill>
			<Sequence durationInFrames={60}>
				<AbsoluteFill style={{background: '#000', justifyContent: 'center'}}>
					<BigText text="QUELQUES TEMPS PLUS TARD…" start={5} size={96} />
				</AbsoluteFill>
			</Sequence>
			<Sequence from={60}>
				<Office />
				<Bonhomme x={420} y={330} s={1.3} suit="#1f2937" tie="#7f1d1d" armR={-45} />
				<Bonhomme x={900} y={330} s={1.3} tie={C.blue} armL={f > 180 ? 50 : 8} />
				<div style={{position: 'absolute', left: 1250, top: 90, transform: `scale(${p}) rotate(${(1 - p) * 20}deg)`, transformOrigin: 'center'}}>
					<ProductBox w={520} style={{boxShadow: '0 40px 80px rgba(0,0,0,0.5)'}} />
				</div>
				<Caption from={5} to={70} who="DIRECTEUR" text="Paul, cette fois, c’est toi qui vas présenter le projet." />
				<Caption from={75} to={210} who="PAUL" text="Très bien, Monsieur." />
			</Sequence>
		</AbsoluteFill>
	);
};

// ─── SCÈNE 9 : Paul applique la méthode en 8 étapes ───
const STEPS = [
	'Définir l’objectif de la présentation',
	'Organiser ses idées',
	'Construire une structure logique',
	'Sélectionner l’essentiel',
	'Travailler la présentation visuelle',
	'Images et graphiques pertinents',
	'Harmoniser couleurs et polices',
	'Répéter à voix haute',
];
export const S9: React.FC = () => {
	const f = useCurrentFrame();
	const cur = Math.min(7, Math.floor((f - 20) / 68));
	const variant = cur < 3 ? 'title' : cur < 6 ? 'chart' : 'compare';
	return (
		<AbsoluteFill style={{background: 'linear-gradient(135deg,#0b1f4d,#132b66 60%,#1d3a8a)'}}>
			<div style={{position: 'absolute', left: 80, top: 50, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff'}}>
				LA MÉTHODE DE PAUL <span style={{color: C.orange}}>— 8 ÉTAPES</span>
			</div>
			<div style={{position: 'absolute', left: 80, top: 140, width: 760}}>
				{STEPS.map((s, i) => {
					const on = f > 20 + i * 68;
					const active = cur === i;
					return (
						<div key={s} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, opacity: on ? 1 : 0.3, transform: `translateX(${active ? 16 : 0}px)`, fontFamily: FONT}}>
							<div style={{width: 64, height: 64, borderRadius: 32, background: on ? (active ? C.orange : C.green) : '#334', color: '#fff', fontSize: 30, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								{on && !active ? '✓' : i + 1}
							</div>
							<div style={{fontSize: 34, fontWeight: active ? 800 : 600, color: '#fff'}}>{s}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 900, top: 170, padding: 12, background: '#fff', borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.4)'}}>
				<SlideBox w={920}>
					<CleanSlide variant={variant} p={interpolate(f % 204, [0, 60], [0, 1], CL)} />
				</SlideBox>
			</div>
			<Bonhomme x={1680} y={560} s={0.95} tie={C.blue} armL={30 + bob(f, 6, 15)} tilt={bob(f, 20, 5)} />
			<Caption from={20} to={300} who="POSE" text="Paul, lui, ne commence pas par PowerPoint : il commence par son objectif et son message." />
			<Caption from={310} to={600} who="POSE" text="Il simplifie, corrige, harmonise… puis il répète à voix haute." />
		</AbsoluteFill>
	);
};

// ─── SCÈNES 10-11 : La présentation réussie de Paul ───
export const S10: React.FC = () => {
	const f = useCurrentFrame();
	const slide = f < 130 ? <CleanSlide variant="title" p={interpolate(f, [0, 60], [0, 1], CL)} /> : f < 250 ? <CleanSlide variant="chart" p={interpolate(f, [130, 190], [0, 1], CL)} /> : <CleanSlide variant="compare" p={interpolate(f, [250, 290], [0, 1], CL)} />;
	return (
		<AbsoluteFill>
			<Room presenter="paul" audienceMood="happy" slide={slide} />
			<Symbol ch="✓" x={900} y={560} start={200} color={C.green} />
			<Symbol ch="👏" x={1400} y={560} start={330} size={70} />
			<Symbol ch="👍" x={1650} y={560} start={345} size={70} />
			<Place text="MÊME SALLE — MÊME ÉQUIPE" />
			<Caption from={10} to={180} who="PAUL" text="Bonjour à tous. Je vais vous présenter les résultats du projet et les trois éléments qui expliquent notre évolution." />
			<Caption from={190} to={300} who="COLLÈGUE" text="Ah oui… là, c’est beaucoup plus clair." />
			<Caption from={310} to={450} who="DIRECTEUR" text="Très bonne présentation, Paul. C’était clair, structuré et professionnel." />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 12 : Jean vs Paul (écran partagé) ───
export const S12: React.FC = () => {
	const f = useCurrentFrame();
	const col = (title: string, color: string, items: string[], slide: React.ReactNode, start: number) => (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT}}>
			<div style={{fontSize: 48, fontWeight: 900, color, marginBottom: 20}}>{title}</div>
			<div style={{border: `6px solid ${color}`, borderRadius: 10}}>
				<SlideBox w={780}>{slide}</SlideBox>
			</div>
			<div style={{marginTop: 26}}>
				{items.map((it, i) => (
					<div key={it} style={{fontSize: 32, color: '#fff', fontWeight: 600, marginBottom: 8, opacity: f > start + i * 20 ? 1 : 0}}>
						<span style={{color}}>{color === C.red ? '✗ ' : '✓ '}</span>
						{it}
					</div>
				))}
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#0a0f1f', flexDirection: 'row', padding: '60px 60px 0', gap: 60}}>
			{col('JEAN', C.red, ['Beaucoup de texte', 'Trop de couleurs', 'Aucune structure'], <MessySlide />, 20)}
			<div style={{width: 4, background: '#334', marginBottom: 280}} />
			{col('PAUL', C.green, ['Un message par diapositive', 'Hiérarchie claire', 'Visuels pertinents'], <CleanSlide variant="chart" />, 80)}
			<Caption from={150} to={250} who="POSE" text="Vous voyez la différence ? Paul n’est pas devenu magiquement expert en PowerPoint." />
			<Caption from={255} to={360} who="POSE" text="Une bonne présentation, c’est une histoire bien pensée, bien structurée et bien présentée." />
		</AbsoluteFill>
	);
};

// ─── SCÈNES 13-14 : Révélation du produit (image 3) ───
export const S13: React.FC = () => {
	const f = useCurrentFrame();
	const x = interpolate(f, [0, 450], [0, -38], CL);
	const s = interpolate(f, [0, 150, 450], [1, 1.45, 1.45], CL);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${s}) translateX(${x}%)`, transformOrigin: 'left center'}}>
				<Img src={staticFile('3.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<Caption from={10} to={140} who="POSE" text="Et c’est exactement ce que vous allez apprendre avec La Nouvelle Méthode PowerPoint." />
			<Caption from={145} to={290} who="POSE" text="Un document complet, avec des modèles et des ressources, pour progresser étape par étape." />
			<Caption from={295} to={450} who="POSE" text="Débutant ? On part des bases. Déjà utilisateur ? Vous passez à une vraie méthode de conception." />
		</AbsoluteFill>
	);
};

// ─── SCÈNE 15 : Les principes ───
const PRINC = [
	['🧠', 'Organiser vos idées'],
	['🧱', 'Construire une présentation logique'],
	['🎯', 'Sélectionner l’essentiel'],
	['🖼️', 'Créer des diapositives claires'],
	['📊', 'Utiliser les visuels au bon moment'],
	['🚫', 'Éviter les erreurs classiques'],
	['🎤', 'Présenter de façon professionnelle'],
];
export const S15: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#0b1f4d'}}>
			<AbsoluteFill style={{opacity: 0.18, filter: 'blur(6px)'}}>
				<Img src={staticFile('4.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 100, top: 60, fontFamily: FONT, fontSize: 52, fontWeight: 900, color: '#fff'}}>
				Vous allez apprendre <span style={{color: C.orange}}>à…</span>
			</div>
			<div style={{position: 'absolute', left: 100, top: 170, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px 60px', width: 1720}}>
				{PRINC.map(([e, t], i) => {
					const st = 15 + i * 42;
					const o = interpolate(f, [st, st + 12], [0, 1], CL);
					return (
						<div key={t} style={{opacity: o, transform: `translateY(${(1 - o) * 30}px)`, display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 28px', borderLeft: `8px solid ${C.orange}`}}>
							<span style={{fontSize: 56}}>{e}</span>
							<span style={{fontFamily: FONT, fontSize: 38, fontWeight: 700, color: '#fff'}}>{t}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ─── SCÈNE 16 : Pour qui ? (Sonia + profils) ───
const Profile: React.FC<{emoji: string; title: string; line: string; who: 'eleve' | 'pro' | 'prof' | 'entre'}> = ({emoji, title, line, who}) => {
	const f = useCurrentFrame();
	const p = usePop(0);
	return (
		<AbsoluteFill style={{background: 'linear-gradient(135deg,#f5f7fb,#dde4ef)'}}>
			<div style={{position: 'absolute', left: 90, top: 90, fontFamily: FONT, transform: `translateX(${(1 - p) * -80}px)`, opacity: p}}>
				<div style={{fontSize: 30, fontWeight: 800, color: C.orange, letterSpacing: 4}}>POUR QUI ?</div>
				<div style={{fontSize: 80, fontWeight: 900, color: C.navy}}>
					{emoji} {title}
				</div>
			</div>
			<div style={{position: 'absolute', right: 110, top: 250, padding: 10, background: '#111', borderRadius: 10}}>
				<SlideBox w={900}>
					<CleanSlide variant={who === 'entre' ? 'compare' : who === 'prof' ? 'title' : 'chart'} p={interpolate(f, [10, 60], [0, 1], CL)} />
				</SlideBox>
			</div>
			<Bonhomme x={260} y={330} s={1.35} tie={who === 'eleve' ? undefined : who === 'pro' ? C.blue : who === 'prof' ? '#16a34a' : C.orange} scarf={who === 'eleve' ? '#0ea5e9' : undefined} armR={-65 + bob(f, 15, 10)} />
			{who === 'pro' && <Bonhomme x={560} y={380} s={1.1} tie="#6b7280" armL={40} tilt={-10} />}
			<Caption from={8} to={130} who="POSE" text={line} />
		</AbsoluteFill>
	);
};
export const S16: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Sequence durationInFrames={170}>
				<Room presenter="sonia" jury audienceMood={f > 110 ? 'happy' : undefined} slide={<CleanSlide variant="chart" p={interpolate(f, [20, 80], [0, 1], CL)} />} />
				<Place text="SOUTENANCE D’INGÉNIEUR" />
				<Caption from={10} to={165} who="POSE" text="Prenons l’exemple de Sonia. Pour sa soutenance d’ingénieur, elle a préparé sa présentation avec La Nouvelle Méthode PowerPoint." />
			</Sequence>
			<Sequence from={170} durationInFrames={160}>
				<KenBurns src="1.png" dur={160} from={1} to={1.18} oy="30%" />
				<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,31,77,0.85), rgba(11,31,77,0) 60%)'}} />
				<div style={{position: 'absolute', left: 90, top: 330, fontFamily: FONT, color: '#fff'}}>
					<BigText text="Sonia" start={5} size={110} color={C.yellow} align="left" />
					<div style={{fontSize: 44, fontWeight: 700}}>Soutenance d’ingénieur réussie</div>
					<div style={{fontSize: 30, fontWeight: 500, marginTop: 12, maxWidth: 700}}>Une présentation préparée avec La Nouvelle Méthode PowerPoint</div>
				</div>
				<Caption from={10} to={158} who="POSE" text="Résultat : un PowerPoint clair et structuré qui a accompagné efficacement son exposé devant le jury." />
			</Sequence>
			<Sequence from={330} durationInFrames={135}>
				<Profile emoji="🎒" title="Les élèves" who="eleve" line="Un exposé devant la classe ? La méthode transforme vos idées en présentation claire et attractive." />
			</Sequence>
			<Sequence from={465} durationInFrames={135}>
				<Profile emoji="💼" title="Les professionnels" who="pro" line="Rapports, projets, résultats : améliorez la qualité de vos présentations professionnelles." />
				<Caption from={85} to={135} who="COLLÈGUE" text="Wow… c’est beaucoup plus professionnel !" top />
			</Sequence>
			<Sequence from={600} durationInFrames={135}>
				<Profile emoji="🎓" title="Enseignants & formateurs" who="prof" line="Une présentation bien conçue rend vos explications plus claires pour votre public." />
			</Sequence>
			<Sequence from={735} durationInFrames={135}>
				<Profile emoji="🚀" title="Les entrepreneurs" who="entre" line="Présentez votre projet ou vos résultats clairement et professionnellement." />
			</Sequence>
		</AbsoluteFill>
	);
};

// ─── SCÈNES 17-18 : Débutant ou expert ? + transformation ───
export const S17: React.FC = () => {
	const f = useCurrentFrame();
	const morph = interpolate(f, [230, 290], [0, 100], CL);
	return (
		<AbsoluteFill style={{background: '#0a0f1f'}}>
			<Sequence durationInFrames={200}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30}}>
					{f < 100 ? (
						<>
							<BigText text="« JE NE SAIS PAS FAIRE UN POWERPOINT. »" start={5} size={62} color={C.red} />
							<BigText text="Aucun problème : la méthode part des bases." start={35} size={50} weight={600} />
						</>
					) : (
						<>
							<BigText text="« JE SAIS DÉJÀ FAIRE DES POWERPOINT. »" start={105} size={62} color={C.green} />
							<BigText text="Très bien. Mais pouvez-vous encore les améliorer ?" start={135} size={50} weight={600} />
						</>
					)}
				</AbsoluteFill>
			</Sequence>
			<Sequence from={200}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<div style={{position: 'relative', width: 1400, height: 787, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
						<SlideBox w={1400}>
							<MessySlide />
						</SlideBox>
						<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - morph}% 0 0)`}}>
							<SlideBox w={1400}>
								<CleanSlide variant="chart" p={morph / 100} />
							</SlideBox>
						</div>
						<div style={{position: 'absolute', top: 0, bottom: 0, left: `${morph}%`, width: 8, background: C.orange, opacity: morph > 0 && morph < 100 ? 1 : 0}} />
					</div>
					<div style={{position: 'absolute', top: 30, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: '#fff'}}>
						{morph < 50 ? 'AVANT' : 'APRÈS'}
					</div>
				</AbsoluteFill>
				<Caption from={100} to={220} who="POSE" text="Savoir utiliser PowerPoint ne signifie pas savoir construire une excellente présentation." />
			</Sequence>
		</AbsoluteFill>
	);
};

export const S18: React.FC = () => {
	const f = useCurrentFrame();
	const half = (src: string, label: string, text: string, color: string, start: number) => {
		const o = interpolate(f, [start, start + 15], [0, 1], CL);
		return (
			<div style={{flex: 1, position: 'relative', overflow: 'hidden', opacity: o}}>
				<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1 + (f - start) / 1500})`}} />
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: 40, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', fontFamily: FONT, color: '#fff'}}>
					<div style={{fontSize: 34, fontWeight: 900, color, letterSpacing: 4}}>{label}</div>
					<div style={{fontSize: 44, fontWeight: 700}}>{text}</div>
				</div>
			</div>
		);
	};
	return (
		<AbsoluteFill style={{flexDirection: 'row', background: '#000', gap: 8}}>
			{half('2.png', 'AVANT', '« Je ne sais pas par où commencer. »', C.red, 0)}
			{half('1.png', 'APRÈS', '« Maintenant, je sais construire ma présentation. »', C.green, 60)}
		</AbsoluteFill>
	);
};

// ─── SCÈNE 19 : Retour à l'histoire ───
export const S19: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Office />
			<Bonhomme x={420} y={330} s={1.3} tie={C.red} tilt={f > 150 ? -10 : 0} armR={f > 160 ? -40 : -8} />
			<Bonhomme x={1150} y={330} s={1.3} tie={C.blue} armL={f > 60 ? 75 : 8} />
			{f > 60 && (
				<div style={{position: 'absolute', left: 870, top: 330, transform: `scale(${Math.min(1, (f - 60) / 12)}) rotate(-6deg)`}}>
					<ProductBox w={230} style={{boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}} />
				</div>
			)}
			<Caption from={5} to={70} who="JEAN" text="Paul, tu as fait comment pour avoir une présentation comme ça ?" />
			<Caption from={75} to={150} who="PAUL" text="J’ai simplement suivi une méthode." />
			<Caption from={155} to={215} who="JEAN" text="La Nouvelle Méthode PowerPoint ?" />
			<Caption from={220} to={270} who="PAUL" text="Exactement." />
		</AbsoluteFill>
	);
};

// ─── SCÈNES 20-21 : Message final + appel à l'action ───
const Strike: React.FC<{text: string; start: number}> = ({text, start}) => {
	const f = useCurrentFrame();
	const w = interpolate(f, [start + 30, start + 45], [0, 100], CL);
	return (
		<div style={{position: 'relative', display: 'inline-block'}}>
			<BigText text={text} start={start} size={58} weight={700} />
			<div style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${w}%`, background: C.red}} />
		</div>
	);
};
export const S20: React.FC = () => {
	const f = useCurrentFrame();
	const p = usePop(250);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 70% 40%, #1d3a8a, #050a1a 75%)'}}>
			<Sequence durationInFrames={240}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30}}>
					<Strike text="Ne dites plus : « Je ne sais pas faire PowerPoint. »" start={5} />
					<Strike text="Ne dites plus : « Je suis débutant. »" start={65} />
					{f > 130 && <BigText text="Une bonne présentation ne dépend pas que du talent." start={130} size={46} weight={600} />}
					{f > 175 && <BigText text="Commencez avec la bonne méthode." start={175} size={80} color={C.yellow} />}
				</AbsoluteFill>
			</Sequence>
			<Sequence from={240}>
				<div style={{position: 'absolute', left: 160, top: 50, transform: `scale(${p})`}}>
					<ProductBox w={480} style={{boxShadow: '0 40px 100px rgba(0,0,0,0.7)'}} />
				</div>
				<div style={{position: 'absolute', left: 820, top: 110, width: 1000, fontFamily: FONT, color: '#fff'}}>
					<BigText text="LA NOUVELLE MÉTHODE POWERPOINT" start={10} size={62} />
					<div style={{height: 24}} />
					<BigText text="Apprendre. Structurer. Présenter. Impressionner." start={40} size={40} color={C.yellow} weight={700} />
					<div style={{marginTop: 50, opacity: interpolate(f, [330, 350], [0, 1], CL), background: C.red, borderRadius: 24, padding: '30px 40px', fontSize: 38, fontWeight: 700, lineHeight: 1.6}}>
						<div style={{fontSize: 46, fontWeight: 900}}>DISPONIBLE MAINTENANT</div>
						<div>📱 WhatsApp : [NUMÉRO]</div>
						<div>💰 Prix : [PRIX]</div>
						<div>🚚 Livraison : [INFORMATIONS]</div>
					</div>
				</div>
				<Caption from={10} to={140} who="POSE" text="Étudiant, élève, enseignant, professionnel ou entrepreneur : il est temps de passer à un autre niveau." />
				<Caption from={145} to={285} who="POSE" text="Ne faites plus simplement des PowerPoint. Apprenez à créer des présentations qui impressionnent." />
			</Sequence>
		</AbsoluteFill>
	);
};
