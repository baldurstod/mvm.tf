import { closeSVG } from 'harmony-svg';
import { createElement, hide, toggle, show } from 'harmony-ui';
import { ItemManager } from '../../loadout/itemmanager.js';
import { ItemTemplates } from '../../loadout/itemtemplates.js';

export * from './itemselectorslot.js';
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
	static #htmlSlots = new Map();
	static #htmlItems = new Map();
	static #initialized = false;

	static {
		this.#htmlSelector = createElement('dialog', {
			class: 'mvm-item-selector',
			parent: document.body,
			hidden: true,
			//popover: 'auto',
		});

		for (const slot of SLOTS) {
			/*if (slot == 'primary' && className.toLowerCase() == 'spy') {
				continue;
			}*/

			this.#htmlSlots.set(slot,
				createElement('mvm-item-selector-slot', {
				class: 'slots',
				parent: this.#htmlSelector,
				//innerText: slot,
				'data-slot': slot,
			}));
		}

		/*
		for (const classIcon of classIcons) {
			createElement('img', {
				parent: HTMLItemSelector.#htmlSelector,
				src: getClassIcon(classIcon),
				events: {
					click: () => HTMLItemSelector.#current.#selectItem(classIcon),
				},
			});
		}
		*/
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
				/*change: event => {
					this.#addItem(event.target.value);
					this.dispatchEvent(new CustomEvent('change', { detail: this.#tags }));
					event.stopPropagation();
				},*/
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
		//this.#htmlSelected.src = getClassIcon(classIcon);
		this.dispatchEvent(new CustomEvent('change', { detail: classIcon }));
		hide(HTMLItemSelector.#htmlSelector);
	}

	async #openItemSelector(className = '') {
		show(HTMLItemSelector.#htmlSelector);
		HTMLItemSelector.#htmlSelector.showModal();
		if (!HTMLItemSelector.#initialized) {
			await ItemManager.getItems();

			for (const slot of SLOTS) {
				HTMLItemSelector.#fillSlot(slot);
			}
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
				//html.remove();
			}
			//hide(html);
			//html.visible = false;
		}
	}

	static #matchFilter(template, filter) {
		return template?.getUsedByClass(filter.class);

	}

	static #fillSlot(slot) {
		/*if (slot == 'primary' && className.toLowerCase() == 'spy') {
			hide(this.#htmlSlots.get(slot));
		} else {
			show(this.#htmlSlots.get(slot));
		}*/

templatesLoop:
		for (const [_, template] of ItemTemplates.getTemplates()) {
			for (const blacklist of ITEM_CLASS_BLACKLIST) {
				if (template.getItemClass() == blacklist) {
					continue templatesLoop;
				}
			}

			//console.error(template.name);
			const slot = template.getItemSlot();
			const html = this.#htmlSlots.get(slot);
			if (html) {
				const htmlItem = createElement('mvm-item-selector-item', {
					//parent: HTMLItemSelector.#htmlSelector,
					template: template
				});

				this.#htmlItems.set(template, htmlItem);
			}
		}
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
					//this.#filter.class = CLASS_TO_ICON[newValue.toLowerCase()];
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
