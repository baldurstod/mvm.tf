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
		const htmlChilds = [];
		const childs = this.getChilds()

		for (const child of childs) {
			htmlChilds.push(child.getIcons());
		}
		if (childs.size > 1) {
			htmlChilds.unshift(createElement('span', { innerText: '(' }));
			htmlChilds.push(createElement('span', { innerText: ')' }));
		}

		return createElement('div', {
			childs: htmlChilds,
		});
	}

	static getSpawnerName() {
		return 'Squad';
	}

	isSingleSpawner() {
		return false;
	}

	needWhereAttribute() {
		for (const child of this.getChilds()) {
			if (child.needWhereAttribute()) {
				return true;
			}
		}
		return false;
	}
}

Spawner.registerSpawner(SquadSpawner)
