import { Spawner } from './spawner.js';

export class SquadSpawner extends Spawner {
	#subSpawners = new Set();
	constructor() {
		super()
		this.isSquadSpawner = true;
	}

	addSpawner(spawner) {
		this.#subSpawners.add(spawner);
		this.dispatchUpdate();
	}

	getSpawners() {
		return this.#subSpawners;
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

Spawner.registerSpawner(SquadSpawner)
