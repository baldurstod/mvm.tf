import { createElement, updateElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import sentrygun from '../../../json/attributes/sentrygun.json';

export class SentryGunView extends SpawnerView {
	constructor() {
		super(sentrygun);
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-bot', {
			parent: this.htmlSpawner,
			innerHTML: 'SentryGunView',
		});

		updateElement(this.htmlTitle, { i18n: '#sentry_gun' });

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
