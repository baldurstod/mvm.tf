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
	}

	update() {
		this.htmlStartingCurrencyInput.value = '';
		this.htmlRespawnWaveTimeInput.value = '';
		this.htmlFixedRespawnWaveTimeInput.checked = false;
		this.htmlAdvancedInput.checked = false;
		this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = false;
		this.htmlEventPopfileInput.value = '';
		this.htmlMapSelectInput.setOptions(this.entity.maps);
		this.htmlMapSelectInput.select(this.entity.map);

		this.htmlWavesTabs.clear();
		this.htmlMissionsTabs.clear();
		this.htmlTemplates.innerHTML = '';
		let iWaves = 0;
		let iMissions = 0;
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			let htmlTab;
			switch (true) {
				case child.isWave:
					htmlTab = createElement('mindalka-tab', {
						parent: this.htmlWavesTabs,
						'data-i18n': ++iWaves,
						child: view.htmlElement,
					})
					break;
				case child.isMission:
					htmlTab = createElement('mindalka-tab', {
						parent: this.htmlMissionsTabs,
						'data-i18n': ++iMissions,
						child: view.htmlElement,
					})
					break;
				case child.isTemplates:
					this.htmlTemplates.append(view.htmlElement);
					break;
				default:
					console.error(child);
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'startingcurrency' :
					this.htmlStartingCurrencyInput.value = value;
					break;
				case 'respawnwavetime' :
					this.htmlRespawnWaveTimeInput.value = value;
					break;
				case 'canbotsattackwhileinspawnroom' :
					this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'advanced' :
					this.htmlAdvancedInput.checked = value;
					break;
				case 'fixedrespawnwavetime' :
					this.htmlFixedRespawnWaveTimeInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'eventpopfile' :
					this.htmlEventPopfileInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
