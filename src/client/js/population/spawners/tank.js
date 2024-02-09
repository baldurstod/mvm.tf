import { Spawner } from './spawner.js';

export class TankSpawner extends Spawner {
	constructor() {
		super()
		this.isTankSpawner = true;
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

Spawner.registerSpawner(TankSpawner)
