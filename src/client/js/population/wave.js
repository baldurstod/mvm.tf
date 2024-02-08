import { Entity } from './entity.js';

import wave from '../../json/attributes/wave.json';

export class Wave extends Entity {
	constructor() {
		super();
		this.setAttributes(wave);
		this.isWave = true;
	}
}
