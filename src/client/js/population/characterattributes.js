import { Entity } from './entity.js';
import { EntityAttribute } from './entityattribute.js';

export class CharacterAttributes extends Entity {
	constructor() {
		super();
		this.isCharacterAttributes = true;
	}

	setAttribute(name, value) {
		let attribute = this.getAttribute(name);
		if (!attribute) {
			// It's a character attribute
			attribute = new EntityAttribute({
				name: name,
				type: 'string',
			});
			this.addAttribute(attribute);
		}

		attribute.setValue(value);
	}
}
