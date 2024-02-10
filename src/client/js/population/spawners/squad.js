import { Spawner } from './spawner.js';

import squadAttributes from '../../../json/attributes/squad.json';

export class SquadSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(squadAttributes);
		this.isSquadSpawner = true;
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

Spawner.registerSpawner(SquadSpawner)
