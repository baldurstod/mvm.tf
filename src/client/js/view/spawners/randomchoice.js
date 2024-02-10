import { createElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import { Spawner } from '../../population/spawners/spawner.js';

export class RandomChoiceView extends SpawnerView {
	#htmlControls;
	#htmlSubSpawners;
	constructor() {
		super();
	}

	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-random-choice', {
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
				createElement('div', {
					innerText: 'create squad',
					events: {
						click: () => this.#createSpawner('Squad'),
					}
				}),
				createElement('div', {
					innerText: 'create random choice',
					events: {
						click: () => this.#createSpawner('RandomChoice'),
					}
				}),
				createElement('div', {
					innerText: 'create sentry gun',
					events: {
						click: () => this.#createSpawner('SentryGun'),
					}
				}),
				this.#htmlSubSpawners = createElement('mvm-spawners', ),
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
		if (!entity) {
			return;
		}

		const childs = [];
		for (const spawner of entity.getChilds()) {
			console.info(spawner);
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
		return 'RandomChoice';
	}
}

SpawnerView.registerSpawner(RandomChoiceView);
