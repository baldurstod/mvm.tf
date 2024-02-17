import { Entity } from './entity.js';

export class Templates extends Entity {
	constructor() {
		super();
		this.isTemplates = true;
	}

	getTemplate(name) {
		for (const child of this.getChilds()) {
			if (child.getName().toLowerCase() == name) {
				return child;
			}
		}
	}
}
