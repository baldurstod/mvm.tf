import { Spawner } from './spawner.js';

import botAttributes from '../../../json/attributes/bot.json';

export class BotSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(botAttributes);
		this.isBotSpawner = true;
	}

	static getSpawnerName() {
		return 'Bot';
	}
}

Spawner.registerSpawner(BotSpawner)
