import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { Controller } from '../../controller.js';
import { EVENT_FOCUS_ENTITY } from '../../controllerevents.js';
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
			events: {
				click: () => Controller.dispatchEvent(new CustomEvent(EVENT_FOCUS_ENTITY, { detail: this })),
			}
		});
	}

	static getSpawnerName() {
		return 'Tank';
	}
}

Spawner.registerSpawner(TankSpawner)
