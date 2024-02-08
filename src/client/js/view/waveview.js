import { createElement } from 'harmony-ui';
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
		createElement('mvm-wave', {
			parent: this.htmlChilds,
			childs: [
				this.#htmlWaveSpawns = createElement('harmony-tab-group'),
			]
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

		let waveSpawn = 0;
		for(const child of entity.getChilds()) {
			if (!child.isWaveSpawn) {
				break;
			}
			const waveView = new WaveSpawnView(child);

			createElement('harmony-tab', {
				'data-i18n': ++waveSpawn,
				parent: this.#htmlWaveSpawns,
				child: waveView.htmlElement,
			});
		}
	}
}
