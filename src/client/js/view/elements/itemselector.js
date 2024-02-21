import { closeSVG } from 'harmony-svg';
import { createElement, hide, toggle, show } from 'harmony-ui';
import { ItemManager } from '../../loadout/itemmanager.js';
import { ItemTemplates } from '../../loadout/itemtemplates.js';

//export * from './itemselectorslot.js';
export * from './itemselectoritem.js';

import '../../../css/itemselector.css';
import { ITEM_CLASS_BLACKLIST } from '../../constants.js';

const SLOTS = [
	'primary',
	'secondary',
	'melee',
	'head',
	'misc',
]

export class HTMLItemSelector extends HTMLElement {
	#doOnce = true;
	#htmlContainer;
	#htmlItemContainer;
	#htmlAddSelector;
	#htmlTags = new Map();
	#tags = new Set();
	#filter = {class: '', slot: ''};
	static #htmlSelector;
	static #current;
	static #htmlItems = new Map();
	static #initialized = false;
	static #initiator;

	static {
		this.#htmlSelector = createElement('dialog', {
			class: 'mvm-item-selector',
			parent: document.body,
			//hidden: true,
			//popover: 'auto',
		});
	}

	constructor() {
		super();
		this.#htmlItemContainer = createElement('span', {
			class: 'items',
		});
		this.#htmlAddSelector = createElement('div', {
			class: 'add',
			parent: this.#htmlItemContainer,
			i18n: '#add_item',
			events: {
				click: () => this.#openItemSelector(),
			},
		});
	}

	connectedCallback() {
		if (this.#doOnce) {
			this.#doOnce = false;
			this.append(this.#htmlItemContainer);
		}
	}

	#selectItem(classIcon) {
		this.dispatchEvent(new CustomEvent('change', { detail: classIcon }));
		hide(HTMLItemSelector.#htmlSelector);
	}

	async #openItemSelector() {
		HTMLItemSelector.#initiator = this;
		//show(HTMLItemSelector.#htmlSelector);
		HTMLItemSelector.#htmlSelector.showModal();

		if (!HTMLItemSelector.#initialized) {
			await ItemManager.getItems();
			HTMLItemSelector.#initItems();
			HTMLItemSelector.#initialized = true;
		}
		this.#applyFilter();
	}

	#applyFilter() {
		console.log(this.#filter);
		for (const [template, html] of HTMLItemSelector.#htmlItems) {
			if (HTMLItemSelector.#matchFilter(template, this.#filter)) {
				show(html);
				HTMLItemSelector.#htmlSelector.append(html);
			} else {
				hide(html);
			}
		}
	}

	static #matchFilter(template, filter) {
		return template?.getUsedByClass(filter.class);

	}

	static #initItems() {

templatesLoop:
		for (const [_, template] of ItemTemplates.getTemplates()) {
			for (const blacklist of ITEM_CLASS_BLACKLIST) {
				if (template.getItemClass() == blacklist) {
					continue templatesLoop;
				}
			}

			let slotOk = false;
			const itemSlot = template.getItemSlot();
			for (const slot of SLOTS) {
				if (slot == itemSlot) {
					slotOk = true;
					break;
				}
			}

			if (slotOk) {
				const htmlItem = createElement('mvm-item-selector-item', {
					template: template ,
					events: {
						click: () => {
							if (this.#initiator) {
								this.#initiator.#onItemClick(template);
							}
							this.#htmlSelector.close();
						},
					}
				});
				this.#htmlItems.set(template, htmlItem);
			}
		}
	}

	#onItemClick(template) {
		this.#addItem(template?.getGameName());

		this.dispatchEvent(new CustomEvent('change',{
			detail: this.#tags
		}));
	}


	#addItem(tag) {
		this.#tags.add(tag);
		if (this.#htmlTags.has(tag)) {
			return;
		}

		const htmlTag = createElement('span', {
			class: 'tag',
			parent: this.#htmlItemContainer,
			childs: [
				createElement('span', {
					innerText: tag,
				}),
				createElement('span', {
					class: 'close',
					innerHTML: closeSVG,
					events: {
						click: () => this.#removeItem(tag),
					}
				}),
			],
		});

		this.#htmlTags.set(tag, htmlTag);
	}

	#removeItem(tag) {
		this.#htmlTags.get(tag)?.remove();
		this.#tags.delete(tag);
		this.#htmlTags.delete(tag);
		this.dispatchEvent(new CustomEvent('change', { detail: this.#tags }));
	}

	#clearTags() {
		this.#tags.clear();
		for (const [_, htmlTag] of this.#htmlTags) {
			htmlTag.remove();
		}
		this.#htmlTags.clear();
	}

	set value(value) {
		this.#clearTags();

		if (value instanceof Set) {
			for (const tag of value) {
				this.#addItem(tag);
			}
		} else {
			this.#addItem(value);
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'value':
				this.value = newValue;
				break;
			case 'data-class':
				if (newValue != oldValue) {
					let valueLower = newValue.toLowerCase();

					if (valueLower == 'heavyweapons') {
						valueLower = 'heavy';
					}
					this.#filter.class = valueLower;
				}
				break;
		}
	}

	static get observedAttributes() {
		return ['value', 'data-class'];
	}
}

if (window.customElements) {
	customElements.define('mvm-item-selector', HTMLItemSelector);
}
