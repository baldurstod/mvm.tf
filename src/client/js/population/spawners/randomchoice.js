import { Spawner } from './spawner.js';

export class RandomChoiceSpawner extends Spawner {
	constructor() {
		super();
		this.isRandomChoiceSpawner = true;
	}

	static getSpawnerName() {
		return 'RandomChoice';
	}
}

Spawner.registerSpawner(RandomChoiceSpawner)
