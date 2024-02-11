import { Entity } from './entity.js';
import { EntityAttribute } from './entityattribute.js';

export class Template extends Entity {
	constructor(name) {
		super(name);
		this.isTemplate = true;
	}

	setAttribute(name, value) {
		let attribute = this.getAttribute(name);
		if (!attribute) {
			// It's an item attribute
			attribute = new EntityAttribute({
				name: name,
				type: 'string',
				multiple: true,
			});
			this.addAttribute(attribute);
		}

		attribute.setValue(value);
	}

}
