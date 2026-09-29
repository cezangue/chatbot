import React from 'react';
import {Composition} from 'remotion';
import {Pub, TOTAL} from './Pub';

export const Root: React.FC = () => (
	<Composition id="Pub" component={Pub} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
