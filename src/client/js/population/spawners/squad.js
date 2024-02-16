import { Spawner } from './spawner.js';

import squadAttributes from '../../../json/attributes/squad.json';
import { createElement } from 'harmony-ui';

export class SquadSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(squadAttributes);
		this.isSquadSpawner = true;
	}

	getIcons() {
		const childs = [];
		for (const child of this.getChilds()) {
			childs.push(child.getIcons());
			childs.push(createElement('span', { innerText: '+' }));
		}
		childs.pop();


		return createElement('span', {
			childs: childs,
		});
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

Spawner.registerSpawner(SquadSpawner)
