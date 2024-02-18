import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';

export class RandomChoiceSpawner extends Spawner {
	constructor() {
		super();
		this.isRandomChoiceSpawner = true;
	}

	getIcons() {
		const htmlChilds = [];
		const childs = this.getChilds()
		for (const child of childs) {
			htmlChilds.push(child.getIcons());
			htmlChilds.push(createElement('span', { i18n: '#or' }));
		}
		htmlChilds.pop();
		if (childs.size > 1) {
			htmlChilds.unshift(createElement('span', { innerText: '(' }));
			htmlChilds.push(createElement('span', { innerText: ')' }));
		}

		return createElement('div', {
			childs: htmlChilds,
		});
	}

	static getSpawnerName() {
		return 'RandomChoice';
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

Spawner.registerSpawner(RandomChoiceSpawner)
