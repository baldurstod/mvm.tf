import { createElement } from 'harmony-ui';
import { Spawner } from './spawner.js';
import { getClassIcon } from '../../view/elements/classicon.js';

import botAttributes from '../../../json/attributes/bot.json';

const CLASS_TO_ICON = {
	'scout': 'scout',
	'sniper': 'sniper',
	'soldier': 'soldier',
	'demoman': 'demo',
	'medic': 'medic',
	'heavyweapons': 'heavy',
	'pyro': 'pyro',
	'spy': 'spy',
	'engineer': 'engineer',
}

export class BotSpawner extends Spawner {
	#templateName;
	#template;
	constructor() {
		super();
		this.setAttributes(botAttributes);
		super.setAttribute('Class', 'Scout');
		super.setAttribute('ClassIcon', 'scout');
		this.isBotSpawner = true;
	}

	setAttribute(name, value) {
		switch (name.toLowerCase()) {
			case 'class':
				let valueLower = value.toLowerCase();
				if (valueLower == 'heavy') {
					value = 'Heavyweapons';
				}

				super.setAttribute('ClassIcon', CLASS_TO_ICON[value.toLowerCase()]);
				break;
			case 'template':
				this.#templateName = value.toLowerCase();
				this.#template = null;
				//console.info(value, this.getRoot());
				break;
		}

		super.setAttribute(name, value);
	}

	getIcons() {
		const classIcon = this.getAttributeValue('ClassIcon');
		//console.info(template);
		return createElement('img', {
			src: getClassIcon(classIcon),
		});
	}

	getAttributeValue(name) {
		// First look at the defined value
		const attribute = this.getAttribute(name);
		if (attribute && !attribute.isDefault()) {
			return attribute.getValue();
		}

		//
		if (this.#templateName) {
			//#template
			const root = this.getRoot();
			if (root.isPopulation) {
				const template = root.getTemplate(this.#templateName);
				console.info(template);
				if (template) {
					// Template value are always sets
					let value = template.getAttributeValue(name);
					if (value) {
						if (attribute?.isMultiple()) {
							return value;
						} else {
							return value.values().next().value;
						}
					}
				}
			}
		}

		// Fallback to default attribute value
		return attribute?.getValue();
	}

	static getSpawnerName() {
		return 'Bot';
	}
}

Spawner.registerSpawner(BotSpawner)
