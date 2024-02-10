import { createElement } from 'harmony-ui';
import { EntityView } from './entityview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/wavespawn.css';

import wavespawn from '../../json/attributes/wavespawn.json';
import { SpawnerView } from './spawners/spawner';
import { Spawner } from '../population/spawners/spawner';

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
					class: 'mvm-wave-spawn-controls',
					childs: [
						createElement('select', {
							childs: [
								createElement('option', {
									value: 'Bot',
									innerText: 'Bot'
								}),
								createElement('option', {
									value: 'RandomChoice',
									innerText: 'RandomChoice'
								}),
								createElement('option', {
									value: 'SentryGun',
									innerText: 'SentryGun'
								}),
								createElement('option', {
									value: 'Squad',
									innerText: 'Squad'
								}),
								createElement('option', {
									value: 'Tank',
									innerText: 'Tank'
								}),
							],
							events: {
								change: event => this.#changeSpawner(event),
							},
						}),
					],
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
		if (!this.htmlInitialized) {
			return;
		}
		super.updateHTML();
		const entity = this.getEntity();
		const spawner = entity?.getSpawner();
		if (!spawner) {
			return;
		}

		const spawnerView = SpawnerView.getSpawner(spawner.getSpawnerName());
		spawnerView?.setEntity(spawner);
		console.info(spawnerView)
		this.#htmlSpawner.replaceChildren(spawnerView?.htmlElement);
	}

	#changeSpawner(event) {
		const spawner = Spawner.getSpawner(event.target.value);
		if (spawner) {
			this.getEntity()?.setSpawner(spawner);
		}
	}
}
