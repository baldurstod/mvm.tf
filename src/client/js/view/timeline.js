import { createElement } from 'harmony-ui';
import 'harmony-ui/dist/define/harmony-accordion.js';

import { Controller } from '../controller.js';
import { EVENT_ENTITY_UPDATED } from '../controllerevents.js';

import '../../css/timeline.css';

export class TimelineView {
	#htmlElement;
	#htmlWaves;
	#entity;
	constructor(entity) {
		Controller.addEventListener(EVENT_ENTITY_UPDATED, event => this.#entityUpdated(event.detail));
	}

	setEntity(entity) {
		this.#entity = entity;
		this.#updateHTML();
	}

	getEntity() {
		return this.#entity;
	}

	#initHTML() {
		if (this.#htmlElement) {
			return this.#htmlElement;
		}
		this.#htmlElement = createElement('div', {
			class: 'mvm-timeline',
			childs: [
				this.#htmlWaves = createElement('harmony-accordion'),
				/*createElement('button', {
					class: 'entity-remove-button',
					innerHTML: closeSVG,
					events: {
						click: () => {
							Controller.dispatchEvent(new CustomEvent(EVENT_REMOVE_ENTITY, { detail: this.getEntity() }));
						}
					},
				}),
				this.#htmlTitle = createElement('div', { class: 'mvm-entity-title' }),
				this.#htmlAttributes = createElement('div', { class: 'mvm-entity-attributes' }),
				this.#htmlChilds = createElement('div', { class: 'mvm-entity-childs' }),*/
			]
		});

		this.#updateHTML();
		return this.#htmlElement;
	}

	#updateHTML() {
		const entity = this.getEntity();
		if (!entity) {
			return;
		}

		this.#htmlWaves.clear();
		let wave = 0;
		for(const child of entity.getChilds()) {
			if (!child.isWave) {
				continue;
			}
			this.#htmlWaves.addItem(
				createElement('item', {
					childs: [
						createElement('header', {
							'i18n-json': {
								innerHTML: '#wave_number',
							},
							'i18n-values': {
								id: ++wave,
							},

						}),
						createElement('content', { child: this.#createWaveContent(child) }),
					],
				})
			);
		}
	}

	#createWaveContent(wave) {
		const htmlContent = createElement('div', {
			class: 'wave',
		});

		for (const waveSpawn of wave.getWaveSpawns()) {
			htmlContent.append(this.#createWaveSpawnContent(waveSpawn));
		}

		return htmlContent;
	}

	#createWaveSpawnContent(waveSpawn) {
		const htmlContent = createElement('div', {
			class: 'wavespawn',
			child: waveSpawn.getIcons(),
		});

		/*for (const waveSpawn of wave.getWaveSpawns()) {
			console.log(waveSpawn);
		}*/

		return htmlContent;
	}

	get htmlElement() {
		return this.#initHTML();
	}

	#entityUpdated(entity) {
		//if (entity == this.#entity) {
			this.#updateHTML();
		//}
	}
}
