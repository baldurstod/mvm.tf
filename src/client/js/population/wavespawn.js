import { Entity } from './entity.js';
import { BotSpawner } from './spawners/bot.js';

import wavespawn from '../../json/attributes/wavespawn.json';
import { createElement } from 'harmony-ui';

export class WaveSpawn extends Entity {
	#spawner = new BotSpawner();
	constructor() {
		super();
		this.setAttributes(wavespawn);
		this.isWaveSpawn = true;
		this.setAttribute('TotalCount', 1);
	}

	setSpawner(spawner) {
		this.#spawner = spawner;
		this.dispatchUpdate();
	}

	getSpawner() {
		return this.#spawner;
	}

	getIcons() {
		const totalCount = Number(this.getAttributeValue('TotalCount'));
		const spawnCount = Number(this.getAttributeValue('SpawnCount'));

		return createElement('div', {
			childs: [
				createElement('div', {
					innerText: `${totalCount} * ${spawnCount} * `,
				}),
				this.#spawner.getIcons(),
			],
		});
	}
}
