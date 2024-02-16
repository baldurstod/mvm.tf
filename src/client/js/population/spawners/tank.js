import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { getClassIcon } from '../../view/elements/classicon.js';

import tank from '../../../json/attributes/tank.json';

export class TankSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(tank);
		this.isTankSpawner = true;
	}

	getIcons() {
		return createElement('img', {
			src: getClassIcon('tank'),
		});
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

Spawner.registerSpawner(TankSpawner)
