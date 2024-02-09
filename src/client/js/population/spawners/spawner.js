
export class Spawner {
	static #spawners = new Map();
	constructor() {
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

	getSpawnerName() {
		return this.constructor.getSpawnerName();
	}
}
