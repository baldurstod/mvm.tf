import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';

export class RandomChoiceSpawner extends Spawner {
	constructor() {
		super();
		this.isRandomChoiceSpawner = true;
	}

	getIcons() {
		const childs = [];
		for (const child of this.getChilds()) {
			childs.push(child.getIcons());
			childs.push(createElement('span', { i18n: '#or' }));
		}
		childs.pop();
		childs.unshift(createElement('span', { innerText: '(' }));
		childs.push(createElement('span', { innerText: ')' }));

		return createElement('div', {
			childs: childs,
		});
	}

	static getSpawnerName() {
		return 'RandomChoice';
	}
}

Spawner.registerSpawner(RandomChoiceSpawner)
