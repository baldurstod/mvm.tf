import { Spawner } from './spawner.js';

import tank from '../../../json/attributes/tank.json';

export class TankSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(tank);
		this.isTankSpawner = true;
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

Spawner.registerSpawner(TankSpawner)
