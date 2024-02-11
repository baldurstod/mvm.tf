import { Entity } from './entity.js';

import itemAttributes from '../../json/attributes/itemattributes.json';
import { EntityAttribute } from './entityattribute.js';

export class ItemAttributes extends Entity {
	constructor() {
		super();
		this.setAttributes(itemAttributes);
		this.isItemAttributes = true;
	}

	setAttribute(name, value) {
		let attribute = this.getAttribute(name);
		if (!attribute) {
			// It's an item attribute
			attribute = new EntityAttribute({
				name: name,
				type: 'string',
			});
			this.addAttribute(attribute);
		}

		attribute.setValue(value);
	}
}
