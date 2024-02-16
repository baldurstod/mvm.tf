import { createElement } from 'harmony-ui';
import { Entity } from '../entity.js';

export class Spawner extends Entity {
	static #spawners = new Map();
	constructor() {
		super();
		this.isSpawner = true;
	}

	static registerSpawner(spawnerClass) {
		this.#spawners.set(spawnerClass.getSpawnerName(), spawnerClass);
	}

	static getSpawner(name) {
		const spawnerClass = this.#spawners.get(name);
		if (spawnerClass) {
			return new spawnerClass();
		}
	}

	getIcons() {
		return createElement('span');
	}

	getSpawnerName() {
		return this.constructor.getSpawnerName();
	}
}
