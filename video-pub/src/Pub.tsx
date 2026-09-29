import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, Series, staticFile, useCurrentFrame} from 'remotion';
import {CL, Fade} from './kit';
import {STORY} from './story';
import {layout, sceneDur, SceneView} from './timeline';

const handle = delayRender('fonts');
Promise.all(
	[400, 600, 800, 900].map((w) => {
		const ff = new FontFace('Montserrat', `url(${staticFile(`fonts/montserrat-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: String(w)});
		return ff.load().then((l) => document.fonts.add(l));
	}),
).then(() => continueRender(handle));

const DURS = STORY.map(sceneDur);
export const TOTAL = DURS.reduce((a, b) => a + b, 0);
const SWITCH_SCENE = 6; // « Quelques temps plus tard » : la musique devient rythmée
const SWITCH = DURS.slice(0, SWITCH_SCENE).reduce((a, b) => a + b, 0);

// Intervalles où quelqu'un parle : la musique baisse (ducking)
const SPEECH: [number, number][] = [];
{
	let s0 = 0;
	STORY.forEach((beats) => {
		let b0 = s0;
		beats.forEach((b) => {
			const c = layout(b);
			[...c.t, ...(b.captions ?? [])].forEach((t) => SPEECH.push([b0 + t.from, b0 + t.to]));
			b0 += c.dur;
		});
		s0 += DURS[STORY.indexOf(beats)];
	});
}
const duck = (f: number) => {
	let d = 1e9;
	for (const [a, b] of SPEECH) d = Math.min(d, f < a ? a - f : f > b ? f - b : 0);
	return interpolate(d, [0, 12], [0.14, 0.42], CL);
};

const Music: React.FC<{src: string; offset: number; len: number}> = ({src, offset, len}) => {
	const f = useCurrentFrame();
	return <Audio src={staticFile(src)} loop volume={() => duck(f + offset) * interpolate(f, [0, 20, len - 30, len], [0, 1, 1, 0], CL)} />;
};

export const Pub: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Series>
			{STORY.map((beats, i) => (
				<Series.Sequence key={i} durationInFrames={DURS[i]}>
					<Fade dur={DURS[i]} a={i === 0 ? 1 : 8}>
						<SceneView beats={beats} />
					</Fade>
				</Series.Sequence>
			))}
		</Series>
		<Sequence durationInFrames={SWITCH}>
			<Music src="music-a.wav" offset={0} len={SWITCH} />
		</Sequence>
		<Sequence from={SWITCH}>
			<Music src="music-b.wav" offset={SWITCH} len={TOTAL - SWITCH} />
		</Sequence>
	</AbsoluteFill>
);
