import { createElement } from 'harmony-ui';
import { EntityView } from '../entityview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../../css/spawner.css';

export class SpawnerView extends EntityView {
	static #spawners = new Map();
	#htmlSpawner;
	constructor(attributeTemplates, entity) {
		super(attributeTemplates, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();

		this.#htmlSpawner = createElement('mvm-spawner', {
			parent: this.htmlChilds,
		});

		return htmlElement;
	}

	updateHTML() {
		if (!this.htmlInitialized) {
			return;
		}
		super.updateHTML();
		this.htmlTitle.innerText = this.getSpawnerName();

		const entity = this.getEntity();
		if (!entity) {
			return;
		}
/*
		const spawner = entity.getSpawner();
		const spawnerView = getSpawnerView(spawner.constructor.getSpawnerName());
*/

	}

	get htmlSpawner() {
		return this.#htmlSpawner;
	}

	static registerSpawner(spawnerClass) {
		this.#spawners.set(spawnerClass.getSpawnerName(), spawnerClass);
	}

	static getSpawner(name) {
		const spawnerViewClass = this.#spawners.get(name);
		if (spawnerViewClass) {
			return new spawnerViewClass();
		}
	}

	getSpawnerName() {
		return this.constructor.getSpawnerName();
	}
}
