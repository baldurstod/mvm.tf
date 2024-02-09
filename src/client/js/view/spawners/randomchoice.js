import { createElement } from 'harmony-ui';
import { SpawnerView } from './spawner.js';

export class RandomChoiceView extends SpawnerView {
	constructor() {
		super()
	}
	initHTML() {
		const htmlElement = super.initHTML();

		createElement('mvm-spawner-random-choice', {
			parent: this.htmlSpawner,
			innerHTML: 'RandomChoiceView',
		});

		this.updateHTML();
		return htmlElement;
	}

	updateHTML() {
		super.updateHTML();
		const entity = this.getEntity();
	}

	static getSpawnerName() {
		return 'RandomChoice';
	}
}

SpawnerView.registerSpawner(RandomChoiceView);
