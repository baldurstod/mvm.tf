import { Entity } from './entity.js';
import { BotSpawner } from './spawners/bot.js';

import wavespawn from '../../json/attributes/wavespawn.json';
import { createElement } from 'harmony-ui';
import { ValidityError } from './validityerror.js';

export class WaveSpawn extends Entity {
	#spawner;
	constructor() {
		super();
		this.setAttributes(wavespawn);
		this.isWaveSpawn = true;
		this.setAttribute('TotalCount', 1);
	}

	setSpawner(spawner) {
		this.#spawner?.remove();
		this.addChild(spawner);
		this.#spawner = spawner;
		this.dispatchUpdate();
	}

	getSpawner() {
		return this.#spawner;
	}

	getIcons() {
		const totalCount = Number(this.getAttributeValue('TotalCount'));

		let text = '';
		if (totalCount != 1) {
			text += `${totalCount} * `;
		}

		return createElement('div', {
			childs: [
				createElement('div', {
					innerText: text,
				}),
				this.#spawner?.getIcons(),
			],
		});
	}

	check(errors) {
		const where = this.getAttribute('where');
		if (where.getValue().size == 0) {
			errors.add(new ValidityError(this, 'Missing where attribute', 'where'));
		}
	}
}
