import { createElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

export class SentryGunView extends SpawnerView {
	constructor() {
		super()
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-bot', {
			parent: htmlElement,
			innerHTML: 'SentryGunView',
		});

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
	}

	static getSpawnerName() {
		return 'SentryGun';
	}
}

SpawnerView.registerSpawner(SentryGunView);
