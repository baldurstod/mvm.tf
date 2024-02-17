import { Entity } from './entity.js';
import { getPopulation } from '../datas/officialpopulation.js';
import { readPopFile } from '../serialization/reader.js';

import population from '../../json/attributes/population.json';

export class Population extends Entity {
	#waveSchedule;
	#base = new Set();

	constructor() {
		super();
		this.setAttributes(population);
		this.isPopulation = true;
	}

	setAttribute(name, value) {
		if (name.toLowerCase() == '#base') {
			//console.info(name, value, await getPopulation(value));
			this.setBase(value);
		}

		super.setAttribute(name, value);
	}

	async setBase(base) {
		const populationText = await getPopulation(base);
		if (!populationText) {
			return;
		}
		console.log(readPopFile(populationText));
	}

	addChild(child) {
		this.#waveSchedule = child;
		super.addChild(child);
	}

	getWaveSchedule() {
		return this.#waveSchedule;
	}

	getTemplate(name) {

	}
}
