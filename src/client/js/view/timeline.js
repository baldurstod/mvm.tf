import { createElement, createElementNS } from 'harmony-ui';
import 'harmony-ui/dist/define/harmony-accordion.js';

import { Controller } from '../controller.js';
import { EVENT_ENTITY_UPDATED, EVENT_WAVE_ACTIVATED } from '../controllerevents.js';

import '../../css/timeline.css';

export class TimelineView {
	#htmlElement;
	#htmlWaves;
	#entity;
	constructor() {
		Controller.addEventListener(EVENT_ENTITY_UPDATED, event => this.#entityUpdated(event.detail));
		//Controller.addEventListener(EVENT_WAVE_ACTIVATED, event => this.setEntity(event.detail));
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

		this.#htmlElement.innerHTML = '';
		this.#htmlWaves.clear();
		let wave = 0;
		for(const child of entity.getChilds()) {
			if (!child.isWave) {
				continue;
			}
			this.#createWaveContent(child, ++wave);
		}
	}

	#createWaveContent(wave, waveID) {
		const htmlContent = createElement('div', {
			class: 'wave',
			parent: this.#htmlElement,
			childs: [
				createElement('div', {
					class: 'wave-id',
					'i18n-json': {
						innerHTML: '#wave_id_currency',
					},
					'i18n-values': {
						id: waveID,
						currency: `$${wave.getTotalCurrency()}`,
					},
				}),
			]
		});

		for (const waveSpawn of wave.getWaveSpawns()) {
			htmlContent.append(waveSpawn.getIcons());
		}

		return htmlContent;
	}

	get htmlElement() {
		return this.#initHTML();
	}

	#entityUpdated(entity) {
		this.#updateHTML();
	}
}
