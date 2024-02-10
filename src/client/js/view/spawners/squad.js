import { createElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import squad from '../../../json/attributes/squad.json';

export class SquadView extends SpawnerView {
	constructor() {
		super(squad);
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-bot', {
			parent: this.htmlSpawner,
			innerHTML: 'SquadView',
		});

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
	}

	static getSpawnerName() {
		return 'Squad';
	}
}

SpawnerView.registerSpawner(SquadView);
