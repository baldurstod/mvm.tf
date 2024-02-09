import { Entity } from './entity.js';

import wavespawn from '../../json/attributes/wavespawn.json';

export class WaveSpawn extends Entity {
	#spawner;
	constructor() {
		super();
		this.setAttributes(wavespawn);
		this.isWaveSpawn = true;
	}

	setSpawner(spawner) {
		this.#spawner = spawner;
		this.dispatchUpdate();
	}

	getSpawner() {
		return this.#spawner;
	}
}
