import { createElement, hide, show } from 'harmony-ui';
import { INVENTORY_PATH } from '../../constants';

export const ItemManagerItemEventTarget = new EventTarget();

const SELECTED_CLASS = 'item-manager-item-selected';
const CONFLICTING_CLASS = 'item-manager-item-interfere';

const WORKSHOP_URL = 'http://steamcommunity.com/sharedfiles/filedetails/?id=';

export class HTMLItemSelectorItem extends HTMLElement {
	#template;
	#visible = false;
	#initialized = false;
	#it;
	#itemNameDiv;
	#itemIconDiv;

	connectedCallback() {
		let callback = (entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.visible = true;
					observer.unobserve(entry.target);
				}
			});
		};
		new IntersectionObserver(callback, { threshold:0.5 }).observe(this);
	}

	set template(template) {
		this.#template = template;
		if (template) {
			this.#refresh();
		}
	}

	/*set it(it) {
		this.#it = it;
	}*/

	set visible(visible) {
		this.#visible = visible;
		if (visible) {
			this.#refresh();
		}
	}

	#refresh() {
		if (this.#template && this.#visible && !this.#initialized) {
			this.#createHTML();

			let item = this.#template;
			if (this.#template?.imageInventory?.substring(0, 4)=='http') {
				this.#itemIconDiv.src = this.#template?.imageInventory;
			} else {
				this.#itemIconDiv.src = INVENTORY_PATH + this.#template?.imageInventory?.toLowerCase() + '.png';
			}
			this.#initialized = true;
		}
	}

	#createHTML() {
		this.setAttribute('title', this.#template.name);
		this.#itemNameDiv = createElement('div', {class:'item-manager-item-name'});
		this.#itemIconDiv = createElement('img', {class:'icon'});
		this.append(this.#itemIconDiv, this.#itemNameDiv);

		let item = this.#template;

	}

	set selected(selected) {
		if (selected) {
			this.classList.add(SELECTED_CLASS);
		} else {
			this.classList.remove(SELECTED_CLASS);
		}
	}

	set conflicting(conflicting) {
		if (conflicting) {
			this.classList.add(CONFLICTING_CLASS);
		} else {
			this.classList.remove(CONFLICTING_CLASS);
		}
	}
}
customElements.define('mvm-item-selector-item', HTMLItemSelectorItem);
