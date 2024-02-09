import { Spawner } from './spawner.js';

export class SquadSpawner extends Spawner {
	constructor() {
		super()
		this.isSquadSpawner = true;
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

Spawner.registerSpawner(SquadSpawner)
