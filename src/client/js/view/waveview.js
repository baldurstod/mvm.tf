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
	#htmlTabs = new Map();
	#htmlWaveSpawnsViews = new Map();
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
		this.#htmlWaveSpawnsViews.clear();
		let waveSpawn = 0;
		for(const child of entity.getChilds()) {
			if (!child.isWaveSpawn) {
				continue;
			}
			const waveSpawnView = new WaveSpawnView(child);

			const htmlTab = createElement('harmony-tab', {
				'data-text': ++waveSpawn,
				parent: this.#htmlWaveSpawns,
				child: waveSpawnView.htmlElement,
			});

			this.#htmlTabs.set(child, htmlTab);
			this.#htmlWaveSpawnsViews.set(child, waveSpawnView);
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

	focusChildEntity(entity) {
		if (this.getEntity().isDescendant(entity)) {
			for (const [child, htmlTab] of this.#htmlTabs) {
				if (child.isDescendant(entity)) {
					htmlTab.activate();
					this.#htmlWaveSpawnsViews.get(child)?.focusChildEntity(entity);
					return;
				}
			}
		}
	}
}
