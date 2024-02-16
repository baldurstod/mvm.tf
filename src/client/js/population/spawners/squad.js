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

		childs.push(createElement('span', { innerText: '(' }));
		for (const child of this.getChilds()) {
			childs.push(child.getIcons());
		}
		childs.push(createElement('span', { innerText: ')' }));


		return createElement('div', {
			childs: childs,
		});
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

Spawner.registerSpawner(SquadSpawner)
