import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { CLASS_ICONS } from '../../view/elements/classicons.js';

import tank from '../../../json/attributes/tank.json';

export class TankSpawner extends Spawner {
	constructor() {
		super();
		this.setAttributes(tank);
		this.isTankSpawner = true;
	}

	getIcons() {
		return createElement('img', {
			src: CLASS_ICONS['tank'],
		});
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

Spawner.registerSpawner(TankSpawner)
