import { createElement } from 'harmony-ui';
import '../../../css/itemselector.css';

export class HTMLItemSelectorSlot extends HTMLElement {
	#doOnce = true;
	#shadowRoot;
	#htmlTitle;
	#htmlContent;

	constructor() {
		super();
		//this.#shadowRoot = this.attachShadow({ mode: 'closed' });

		/*this.#htmlTitle = createElement('style', {
			//parent: this.#shadowRoot,
			innerText: `mvm-item-selector-item{
				width: 4rem;
				height: 4rem;
				display: inline-block;
			}
			`,
		});*/
		this.#htmlTitle = createElement('div', {
			//parent: this.#shadowRoot,
		});
		this.#htmlContent = createElement('div', {
			//parent: this.#shadowRoot,
		});

	}

	connectedCallback() {
		if (this.#doOnce) {
			this.#doOnce = false;
			super.append(this.#htmlTitle, this.#htmlContent);


			//this.append(this.#htmlItemContainer);
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'data-slot':
				this.#htmlTitle.innerText = newValue;
				break;
		}
	}

	append(toto) {
		this.#htmlContent.append(toto);
	}

	static get observedAttributes() {
		return ['data-slot'];
	}
}

if (window.customElements) {
	customElements.define('mvm-item-selector-slot', HTMLItemSelectorSlot);
}
