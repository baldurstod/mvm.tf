import { Spawner } from './spawner.js';

export class BotSpawner extends Spawner {
	constructor() {
		super()
		this.isBotSpawner = true;
	}

	static getSpawnerName() {
		return 'Bot';
	}
}

Spawner.registerSpawner(BotSpawner)
