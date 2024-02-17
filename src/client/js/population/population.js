import { Entity } from './entity.js';

import population from '../../json/attributes/population.json';

export class Population extends Entity {
	#waveSchedule;

	constructor() {
		super();
		this.setAttributes(population);
		this.isPopulation = true;
	}

	addChild(child) {
		this.#waveSchedule = child;
		super.addChild(child);
	}

	getWaveSchedule() {
		return this.#waveSchedule;
	}
}
