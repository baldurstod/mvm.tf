import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_GENERATE_POPULATION, EVENT_MAP_CHANGED } from '../controllerevents';


import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/waveschedule.css';
import '../../css/misc.css';

import waveschedule from '../../json/attributes/waveschedule.json';

import { EntityView } from './entityview';
import { WaveView } from './waveview';
export * from './spawners/spawners.js';

export class WaveScheduleView extends EntityView {
	#htmlWaves;
	constructor(entity) {
		super(waveschedule, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();
		htmlElement.classList.add('mvm-wave-schedule');
		this.#htmlWaves = createElement('harmony-tab-group', {
			class: 'mvm-waves',
			parent: this.htmlChilds,
		});

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
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
			const waveView = new WaveView(child);

			createElement('harmony-tab', {
				'data-text': ++wave,
				parent: this.#htmlWaves,
				child: waveView.htmlElement,
			});
		}

		createElement('harmony-tab', {
			'data-text': '+',
			parent: this.#htmlWaves,
			events: {
				click: event => {
					event.preventDefault();
					entity.addNewWave();
				},
			}
		});
	}
}
