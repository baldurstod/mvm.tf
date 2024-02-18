import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_WAVE_ACTIVATED } from '../controllerevents';


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
	#htmlTabs = new Map();
	#htmlWaves;
	#selectedWave;
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
		this.#htmlTabs.clear();
		let wave = 0;
		let firstTab;
		for(const child of entity.getChilds()) {
			if (!child.isWave) {
				continue;
			}
			const waveView = new WaveView(child);

			const htmlTab = createElement('harmony-tab', {
				'data-text': ++wave,
				child: waveView.htmlElement,
				events: {
					activated: () => {
						console.info('activated', child);
						Controller.dispatchEvent(new CustomEvent(EVENT_WAVE_ACTIVATED, { detail: child }));
						this.#selectedWave = child;
					},
				},
				parent: this.#htmlWaves,
			});

			if (!firstTab) {
				firstTab = htmlTab;
			}

			this.#htmlTabs.set(child, htmlTab);
		}

		const activeTab = this.#htmlTabs.get(this.#selectedWave);
		if (activeTab) {
			this.#htmlWaves.active = activeTab;
		} else {
			this.#htmlWaves.active = firstTab;
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

	focusChildEntity(entity) {
		if (this.getEntity().isDescendant(entity)) {
			for (const [child, htmlTab] of this.#htmlTabs) {
				if (child.isDescendant(entity)) {
					htmlTab.activate();
					return;
				}
			}
		}
	}
}
