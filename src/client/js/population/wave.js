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

	getWaveSpawns() {
		const result = new Set();

		for (const child of this.getChilds()) {
			if (child.isWaveSpawn) {
				result.add(child);
			}
		}

		return result;
	}

	getTotalCurrency() {
		let totalCurrency = 0;
		for (const child of this.getChilds()) {
			if (child.isWaveSpawn) {
				totalCurrency += child.getCurrency();
			}
		}
		return totalCurrency;
	}
}
