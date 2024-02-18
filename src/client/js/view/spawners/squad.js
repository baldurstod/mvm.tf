import { createElement, updateElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import squad from '../../../json/attributes/squad.json';
import { Spawner } from '../../population/spawners/spawner.js';

export class SquadView extends SpawnerView {
	#htmlControls;
	#htmlSubSpawners;
	constructor() {
		super(squad);
	}

	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-squad', {
			parent: this.htmlSpawner,
			childs: [
				createElement('div', {
					innerText: 'create bot',
					events: {
						click: () => this.#createSpawner('Bot'),
					}
				}),
				createElement('div', {
					innerText: 'create tank',
					events: {
						click: () => this.#createSpawner('Tank'),
					}
				}),
				/*createElement('div', {
					innerText: 'create sentry gun',
					events: {
						click: () => this.#createSpawner('SentryGun'),
					}
				}),*/
				this.#htmlSubSpawners = createElement('mvm-spawners', ),
			]
		});

		updateElement(this.htmlTitle, { i18n: '#squad' });

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		if (!this.htmlInitialized) {
			return;
		}
		super.updateHTML();
		const entity = this.getEntity();
		if (!entity) {
			return;
		}

		const childs = [];
		for (const spawner of entity.getChilds()) {
			const spawnerView = SpawnerView.getSpawner(spawner.getSpawnerName());
			spawnerView?.setEntity(spawner);
			childs.push(spawnerView?.htmlElement);
		}

		this.#htmlSubSpawners.replaceChildren(...childs);
	}

	#createSpawner(name) {
		const spawner = Spawner.getSpawner(name);
		if (spawner) {
			this.getEntity()?.addChild(spawner);
		}
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

SpawnerView.registerSpawner(SquadView);
