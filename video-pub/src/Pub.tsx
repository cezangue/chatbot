import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Series, staticFile, useCurrentFrame} from 'remotion';
import {Fade, CL} from './kit';
import {S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S12, S13, S15, S16, S17, S18, S19, S20} from './scenes';

const handle = delayRender('fonts');
Promise.all(
	[400, 600, 800, 900].map((w) => {
		const ff = new FontFace('Montserrat', `url(${staticFile(`fonts/montserrat-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: String(w)});
		return ff.load().then((l) => document.fonts.add(l));
	}),
).then(() => continueRender(handle));

export const SCENES: [React.FC, number][] = [
	[S1, 300], [S2, 270], [S3, 300], [S4, 390], [S5, 120], [S6, 390], [S7, 330], [S8, 270], [S9, 600],
	[S10, 450], [S12, 360], [S13, 450], [S15, 360], [S16, 870], [S17, 420], [S18, 150], [S19, 270], [S20, 540],
];
export const TOTAL = SCENES.reduce((a, [, d]) => a + d, 0);

const Music: React.FC = () => {
	const f = useCurrentFrame();
	return <Audio src={staticFile('music.wav')} volume={() => interpolate(f, [0, 30, TOTAL - 60, TOTAL], [0, 0.55, 0.55, 0], CL)} />;
};

export const Pub: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Series>
			{SCENES.map(([S, d], i) => (
				<Series.Sequence key={i} durationInFrames={d}>
					<Fade dur={d} a={i === 0 ? 1 : 10}>
						<S />
					</Fade>
				</Series.Sequence>
			))}
		</Series>
		<Music />
	</AbsoluteFill>
);
