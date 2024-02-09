
export class Spawner {
	static #spawners = new Map();
	constructor() {
		this.isSpawner = true;
	}

	static registerSpawner(spawnerClass) {
		this.#spawners.set(spawnerClass.getSpawnerName(), spawnerClass);
	}

	static getSpawner(name) {
		return this.#spawners.get(name);
	}
}
