import { Spawner } from './spawner.js';

export class SentryGunSpawner extends Spawner {
	constructor() {
		super()
		this.isSentryGunSpawner = true;
	}

	static getSpawnerName() {
		return 'SentryGun';
	}
}


Spawner.registerSpawner(SentryGunSpawner)
