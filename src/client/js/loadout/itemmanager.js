import { ItemTemplates } from './itemtemplates.js';
import { ITEM_URL } from '../constants.js';

export class ItemManager {
	static #loadItemsPromise;

	static async getItems() {
		return await this.#loadItems();
	}

	static #loadItems() {
		if (!this.#loadItemsPromise) {
			this.#loadItemsPromise = new Promise(async resolve => {
				try {
					const response = await fetch(ITEM_URL);
					const json = await response.json();
					console.log(json);
					ItemTemplates.addItems(json.items);
					resolve(true);
				} catch(e) {
					resolve(false);
				}
			});
		}

		return this.#loadItemsPromise;
	}
}
