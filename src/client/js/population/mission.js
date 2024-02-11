import { Entity } from './entity.js';

import mission from '../../json/attributes/mission.json';

export class Mission extends Entity {
	#spawner;
	constructor() {
		super();
		this.setAttributes(mission);
		this.isMission = true;
	}

	setSpawner(spawner) {
		this.#spawner = spawner;
		this.dispatchUpdate();
	}

	getSpawner() {
		return this.#spawner;
	}
}
