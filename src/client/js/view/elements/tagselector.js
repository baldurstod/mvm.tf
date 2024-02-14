import { createElement, hide, toggle } from 'harmony-ui';

import '../../../css/tagselector.css';
import { closeSVG } from 'harmony-svg';

export class HTMLTagSelector extends HTMLElement {
	#doOnce = true;
	#htmlContainer;
	#htmlTagContainer;
	#htmlSelector;
	#htmlTags = new Map();
	#tags = new Set();
/*
	static {
		HTMLTagSelector.#htmlSelector = createElement('div', {
			class: 'mvm-class-icon-selector',
			parent: document.body,
			hidden: true,
			//popover: 'auto',
		});

		for (const classIcon of classIcons) {
			createElement('img', {
				parent: HTMLTagSelector.#htmlSelector,
				src: CLASS_ICONS[classIcon],
				events: {
					click: () => HTMLTagSelector.#current.#selectIcon(classIcon),
				},
			});
		}
	}*/

	constructor() {
		super();
		this.#htmlTagContainer = createElement('span', {
			class: 'tags',
			/*events: {
				click: event => this.#toggleSelector(event),
			},*/
		});
		this.#htmlSelector = createElement('input', {
			parent: this.#htmlTagContainer,
			events: {
				change: event => {
					this.#addTag(event.target.value);
					this.dispatchEvent(new CustomEvent('change', { detail: this.#tags }));
					event.stopPropagation();
				},
			},
		});
	}

	connectedCallback() {
		if (this.#doOnce) {
			this.#doOnce = false;
			this.append(this.#htmlTagContainer);
		}
	}

	#addTag(tag) {
		this.#tags.add(tag);
		if (this.#htmlTags.has(tag)) {
			return;
		}

		const htmlTag = createElement('span', {
			class: 'tag',
			parent: this.#htmlTagContainer,
			childs: [
				createElement('span', {
					innerText: tag,
				}),
				createElement('span', {
					class: 'close',
					innerHTML: closeSVG,
					events: {
						click: () => this.#removeTag(tag),
					}
				}),
			],
		});

		this.#htmlTags.set(tag, htmlTag);
	}

	#removeTag(tag) {
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
				this.#addTag(tag);
			}
		} else {
			this.#addTag(value);
		}
	}

	set list(list) {
		this.#htmlSelector.setAttribute('list', list);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'value':
				this.value = newValue;
				break;
			case 'list':
				this.list = newValue;
				break;
		}
	}

	static get observedAttributes() {
		return ['value', 'list'];
	}
}

if (window.customElements) {
	customElements.define('mvm-tag-selector', HTMLTagSelector);
}
