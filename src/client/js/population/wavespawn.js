import { Entity } from './entity.js';

import wavespawn from '../../json/attributes/wavespawn.json';

export class WaveSpawn extends Entity {
	constructor() {
		super();
		this.setAttributes(wavespawn);
		this.isWaveSpawn = true;
	}
}
