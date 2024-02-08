import { createElement } from 'harmony-ui';
import { EntityView } from './entityview';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/wavespawn.css';

import wavespawn from '../../json/attributes/wavespawn.json';

export class WaveSpawnView extends EntityView {
	constructor(entity) {
		super(wavespawn, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();
		createElement('mvm-wave-spawn', {
			parent: this.htmlChilds,
			innerHTML: 'wavespawn',
		});
		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
	}
}
