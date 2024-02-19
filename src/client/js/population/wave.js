import { Entity } from './entity.js';
import { WaveSpawn } from './wavespawn.js';
import { BotSpawner } from './spawners/bot.js';

import wave from '../../json/attributes/wave.json';

export class Wave extends Entity {
	constructor() {
		super();
		this.setAttributes(wave);
		this.isWave = true;
	}

	addNewWaveSpawn() {
		const waveSpawn = new WaveSpawn();
		this.addChild(waveSpawn);

		const bot = new BotSpawner();
		bot.setAttribute('class', 'scout');
		waveSpawn.setSpawner(bot);
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
