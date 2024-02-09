import { createElement } from 'harmony-ui';
import { EntityView } from './entityview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/wavespawn.css';

import wavespawn from '../../json/attributes/wavespawn.json';
import { SpawnerView } from './spawners/spawner';

export class WaveSpawnView extends EntityView {
	#htmlSpawner;
	constructor(entity) {
		super(wavespawn, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-wave-spawn', {
			parent: htmlElement,
			childs: [
				createElement('div', {
					class: 'mvm-wave-spawn-buttons',
				}),
				this.#htmlSpawner = createElement('div', {
					class: 'mvm-wave-spawn-spawner',
				}),
			]
		});

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
		const spawner = entity?.getSpawner();
		if (!spawner) {
			return;
		}


		const spawnerView = SpawnerView.getSpawner(spawner.constructor.getSpawnerName());
		console.info(spawnerView)
		this.#htmlSpawner.append(spawnerView?.htmlElement);


	}
}
