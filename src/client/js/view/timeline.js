import { createElement } from 'harmony-ui';
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
		Controller.addEventListener(EVENT_WAVE_ACTIVATED, event => this.setEntity(event.detail));
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
			if (!child.isWaveSpawn) {
				continue;
			}
			this.#createWaveSpawnContent(child);
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
			parent: this.#htmlElement,
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
