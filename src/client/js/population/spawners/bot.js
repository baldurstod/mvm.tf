import { Spawner } from './spawner.js';

import botAttributes from '../../../json/attributes/bot.json';

const CLASS_TO_ICON = {
	'scout': 'scout',
	'sniper': 'sniper',
	'soldier': 'soldier',
	'demoman': 'demo',
	'medic': 'medic',
	'heavy': 'heavy',
	'pyro': 'pyro',
	'spy': 'spy',
	'engineer': 'engineer',
}

export class BotSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(botAttributes);
		super.setAttribute('Class', 'Scout');
		super.setAttribute('ClassIcon', 'scout');
		this.isBotSpawner = true;
	}

	setAttribute(name, value) {
		if (name.toLowerCase() == 'class') {
			super.setAttribute('ClassIcon', CLASS_TO_ICON[value.toLowerCase()]);
		}

		super.setAttribute(name, value);
	}

	static getSpawnerName() {
		return 'Bot';
	}
}

Spawner.registerSpawner(BotSpawner)
