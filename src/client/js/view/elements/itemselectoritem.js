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
		if (item.paintable == '1') {
			let div2 = createElement('div', {class:'item-manager-item-icon-paint'});
			this.append(div2);
			div2.itemName = item;
			div2.addEventListener('click', event => {
				ItemManagerItemEventTarget.dispatchEvent(new CustomEvent('paintclick', {detail: event.target.itemName}));
				event.stopPropagation();
			});
		}

		if (item.attached_models_festive) {
			let divFestive = createElement('div', {class:'item-manager-item-icon-festivizer', 'i18n-title':'#festivizer'});
			this.append(divFestive);
			divFestive.itemName = item;
			divFestive.addEventListener('click', event => {
				let i = CharacterManager.getCurrentCharacter().getItemById(item.id);
				if (i) {
					i.toggleFestivizer();
				}
				event.stopPropagation();
			});
		}


		if (
				(item.item_slot == 'melee')
			|| (item.item_slot == 'primary')
			|| (item.item_slot == 'secondary')
			) {
			let div2 = createElement('div', {class:'item-manager-item-icon-crit'});
			this.append(div2);
			div2.itemName = item;
			div2.addEventListener('click', event => {
				let i = CharacterManager.getCurrentCharacter().getItemById(item.id);
				if (i) {
					i.critBoost();
				}
				i = CharacterManager.getCurrentCharacter().getItem(item.name + 'extra');
				if (i) {
					i.critBoost();
				}
				i = CharacterManager.getCurrentCharacter().getItem(item.name + 'atta2');
				if (i) {
					i.critBoost();
				}
				event.stopPropagation();
			});
		}

		let itemSlot = item.item_slot;
		if (itemSlot&&(itemSlot.indexOf('melee')!=-1||itemSlot.indexOf('pda')!=-1||itemSlot.indexOf('pda2')!=-1||itemSlot.indexOf('primary')!=-1||itemSlot.indexOf('secondary')!=-1)) {
			let div2 = createElement('div', {class:'item-manager-item-icon-sheen'});
			this.append(div2);
			div2.itemName = item;
			div2.addEventListener('click', event => {
				ItemManagerItemEventTarget.dispatchEvent(new CustomEvent('sheenclick', {detail: event.target.itemName}));
				event.stopPropagation();
			});
		}

		if (item.holiday_restriction == 'halloween_or_fullmoon') {
			let div2 = createElement('div', {class:'item-manager-item-icon-spooky'});
			this.append(div2);
		}
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
