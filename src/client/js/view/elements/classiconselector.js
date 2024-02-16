import { createElement, hide, toggle } from 'harmony-ui';
import { getClassIcon } from './classicon';

import '../../../css/classiconselector.css';

import classIcons from '../../../json/datas/classicons.json';

export class HTMLClassIcon extends HTMLElement {
	#doOnce = true;
	#htmlSelected;
	static #htmlSelector;
	static #current;

	static {
		HTMLClassIcon.#htmlSelector = createElement('div', {
			class: 'mvm-class-icon-selector',
			parent: document.body,
			hidden: true,
			//popover: 'auto',
		});

		for (const classIcon of classIcons) {
			createElement('img', {
				parent: HTMLClassIcon.#htmlSelector,
				src: getClassIcon(classIcon),
				events: {
					click: () => HTMLClassIcon.#current.#selectIcon(classIcon),
				},
			});
		}
	}

	constructor() {
		super();
		this.#htmlSelected = createElement('img', {
			class: 'mvm-class-icon-selected',
			events: {
				click: event => this.#toggleSelector(event),
			},
		});
	}

	connectedCallback() {
		if (this.#doOnce) {
			this.#doOnce = false;
			this.append(this.#htmlSelected);
		}
	}

	#selectIcon(classIcon) {
		this.#htmlSelected.src = getClassIcon(classIcon);
		this.dispatchEvent(new CustomEvent('change', { detail: classIcon }));
		hide(HTMLClassIcon.#htmlSelector);
	}

	#toggleSelector(event) {
		console.info(event);

		HTMLClassIcon.#htmlSelector.style.left = `${event.clientX}px`;
		HTMLClassIcon.#htmlSelector.style.top = `${event.clientY}px`;

		HTMLClassIcon.#current = this;
		toggle(HTMLClassIcon.#htmlSelector);
		//HTMLClassIcon.#htmlSelector.showPopover();
	}

	set value(value) {
		this.#htmlSelected.src = getClassIcon(value);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'value':
				this.newValue = newValue;
				break;
		}
	}

	static get observedAttributes() {
		return ['value'];
	}
}

if (window.customElements) {
	customElements.define('mvm-class-icon', HTMLClassIcon);
}
