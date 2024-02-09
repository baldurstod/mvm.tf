import { createElement } from 'harmony-ui';
import { EntityView } from '../entityview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

//import '../../css/wavespawn.css';

//import wavespawn from '../../json/attributes/wavespawn.json';

export class SpawnerView extends EntityView {
	static #spawners = new Map();
	constructor(entity) {
		super(null, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();
/*
		createElement('mvm-wave-spawn', {
			parent: this.htmlElement,
			childs: [
				createElement('div', {
					class: 'mvm-wave-spawn-buttons',
				}),
				this.#htmlSpawner = createElement('div', {
					class: 'mvm-wave-spawn-spawners',
				}),
			]
		});
*/
		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
		if (!entity) {
			return;
		}
/*
		const spawner = entity.getSpawner();
		const spawnerView = getSpawnerView(spawner.constructor.getSpawnerName());
*/

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
}
