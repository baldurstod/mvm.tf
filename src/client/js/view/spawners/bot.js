import { createElement, updateElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

import bot from '../../../json/attributes/bot.json';

export class BotSpawnerView extends SpawnerView {
	constructor() {
		super(bot);
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-bot', {
			parent: this.htmlSpawner,
			innerHTML: 'BotSpawnerView',
		});

		updateElement(this.htmlTitle, { i18n: '#bot' });

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
	}

	static getSpawnerName() {
		return 'Bot';
	}
}

SpawnerView.registerSpawner(BotSpawnerView);
