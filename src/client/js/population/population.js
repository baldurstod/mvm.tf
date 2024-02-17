import { Entity } from './entity.js';
//import { getPopulation } from '../datas/officialpopulation.js';
//import { readPopFile } from '../serialization/reader.js';

import population from '../../json/attributes/population.json';
import { getPopulation } from '../datas/officialpopulation.js';

export class Population extends Entity {
	#waveSchedule;
	#bases = new Set();

	constructor() {
		super();
		this.setAttributes(population);
		this.isPopulation = true;
	}

	setAttribute(name, value) {
		if (name.toLowerCase() == '#base') {
			//console.info(name, value, await getPopulation(value));
			//this.setBase(value);
			this.#bases.add(value);
		}

		super.setAttribute(name, value);
	}

	/*async setBase(base) {
		const populationText = await getPopulation(base);
		if (!populationText) {
			return;
		}
		console.log(readPopFile(populationText));
	}*/

	getBases() {
		return this.#bases;
	}

	addChild(child) {
		this.#waveSchedule = child;
		super.addChild(child);
	}

	getWaveSchedule() {
		return this.#waveSchedule;
	}

	getTemplate(name) {
		//console.error(name, this.#bases);
		for (const base of this.#bases) {
			const basePopulation = getPopulation(base);
			if (!basePopulation) {
				//console.error(`Base population not found ${base}`);
				continue;
			}

			const template = basePopulation.getTemplate(name);
			if (template) {
				return template;
			}
		}

		return super.getTemplate(name);
	}
}
