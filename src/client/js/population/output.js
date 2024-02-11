import { Entity } from './entity';

import outputAttributes from '../../json/attributes/output.json';

export class Output extends Entity {
	#name;
	constructor(name) {
		super();
		this.#name = name;
		this.setAttributes(outputAttributes);
		this.isOutput = true;
	}

	getName() {
		return this.#name;
	}
}
