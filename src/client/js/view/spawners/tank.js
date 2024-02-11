import { createElement, updateElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import tank from '../../../json/attributes/tank.json';

export class TankView extends SpawnerView {
	constructor() {
		super(tank);
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-bot', {
			parent: this.htmlSpawner,
			innerHTML: 'TankView',
		});

		updateElement(this.htmlTitle, { i18n: '#tank' });

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

SpawnerView.registerSpawner(TankView);
