import { Spawner } from './spawner.js';

import sentryGun from '../../../json/attributes/sentrygun.json';

export class SentryGunSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(sentryGun);
		this.isSentryGunSpawner = true;
	}

	static getSpawnerName() {
		return 'SentryGun';
	}
}


Spawner.registerSpawner(SentryGunSpawner)
