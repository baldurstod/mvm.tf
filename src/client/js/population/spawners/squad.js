import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { Controller } from '../../controller.js';
import { EVENT_FOCUS_ENTITY } from '../../controllerevents.js';

import squadAttributes from '../../../json/attributes/squad.json';

export class SquadSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(squadAttributes);
		this.isSquadSpawner = true;
	}

	getIcons() {
		const htmlChilds = [];
		for (const child of this.getChilds()) {
			htmlChilds.push(child.getIcons());
		}

		return createElement('div', {
			class: 'squad',
			childs: htmlChilds,
			events: {
				click: () => Controller.dispatchEvent(new CustomEvent(EVENT_FOCUS_ENTITY, { detail: this })),
			}
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
