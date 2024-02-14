import { Entity } from './entity.js';

import wave from '../../json/attributes/wave.json';
import { WaveSpawn } from './wavespawn.js';

export class Wave extends Entity {
	constructor() {
		super();
		this.setAttributes(wave);
		this.isWave = true;
	}

	addNewWaveSpawn() {
		this.addChild(new WaveSpawn());
	}
}
