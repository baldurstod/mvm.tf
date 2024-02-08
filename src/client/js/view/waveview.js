import { createElement } from 'harmony-ui';
import { EntityView } from './EntityView';

import 'harmony-ui/dist/define/harmony-select.js';
import 'harmony-ui/dist/define/harmony-tab.js';
import 'harmony-ui/dist/define/harmony-tab-group.js';

import '../../css/wave.css';

import wave from '../../json/attributes/wave.json';

export class WaveView extends EntityView {
	constructor(entity) {
		super(wave, entity);
	}

	initHTML() {
		const htmlElement = super.initHTML();
		createElement('mvm-wave', {
			parent: this.htmlChilds,
			innerHTML: 'wave',
		});
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
	}
}
