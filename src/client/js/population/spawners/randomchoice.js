import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { Controller } from '../../controller.js';
import { EVENT_FOCUS_ENTITY } from '../../controllerevents.js';

export class RandomChoiceSpawner extends Spawner {
	constructor() {
		super();
		this.isRandomChoiceSpawner = true;
	}

	getIcons() {
		const htmlChilds = [];
		for (const child of this.getChilds()) {
			htmlChilds.push(child.getIcons());
			htmlChilds.push(createElement('span', { i18n: '#or' }));
		}
		htmlChilds.pop();

		return createElement('div', {
			class: 'random-choice',
			childs: htmlChilds,
			events: {
				click: () => Controller.dispatchEvent(new CustomEvent(EVENT_FOCUS_ENTITY, { detail: this })),
			}
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
