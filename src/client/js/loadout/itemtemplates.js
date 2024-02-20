import {ItemTemplate} from './itemtemplate.js';

export class ItemTemplates {
	static #templates = new Map();

	static addItems(items) {
		if (Array.isArray(items)) {
			for (const item of items) {
				this.#templates.set(item.id, new ItemTemplate(item));
			}
		} else {
			// object
			for (const itemId in items) {
				const item = items[itemId];
				item.id = itemId;
				this.#templates.set(item.id, new ItemTemplate(item));
			}
		}
	}

	static getTemplates() {
		return this.#templates;
	}

	static add(item) {
		this.#templates.set(item.id, new ItemTemplate(item));
	}

	static get(id) {
		return this.#templates.get(id);
	}
}
