import { createElement, updateElement } from 'harmony-ui';
import { EntityView } from './entityview';
import { WaveSpawnView } from './wavespawnview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/wave.css';

import wave from '../../json/attributes/wave.json';

export class WaveView extends EntityView {
	#htmlWaveSpawns;
	constructor(entity) {
		super(wave, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();
		htmlElement.classList.add('mvm-wave');
		this.#htmlWaveSpawns = createElement('harmony-tab-group', {
			parent: this.htmlChilds,
			class: 'mvm-waves-spawns',
		});

		updateElement(this.htmlTitle, { i18n: '#wave' });

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
		if (!entity) {
			return;
		}

		this.#htmlWaveSpawns.clear();
		let waveSpawn = 0;
		for(const child of entity.getChilds()) {
			if (!child.isWaveSpawn) {
				continue;
			}
			const waveView = new WaveSpawnView(child);

			createElement('harmony-tab', {
				'data-text': ++waveSpawn,
				parent: this.#htmlWaveSpawns,
				child: waveView.htmlElement,
			});
		}

		createElement('harmony-tab', {
			'data-text': '+',
			parent: this.#htmlWaveSpawns,
			events: {
				click: event => {
					event.preventDefault();
					entity.addNewWaveSpawn();
				},
			}
		});
	}
}
