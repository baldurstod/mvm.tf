import { Controller } from '../controller.js';
import { EVENT_ENTITY_UPDATED } from '../controllerevents.js';
import { EntityAttribute } from './entityattribute.js';

export class Entity {
	#name;
	#parent;
	#childs = new Set();
	#attributes = new Map();
	constructor(name) {
		this.#name = name;
		this.isEntity = true;
/*
		this.declareAttribute('Where', true);
		this.declareAttribute('Attributes', true);
		this.declareAttribute('Item', true);
		this.declareAttribute('Tag', true);
		this.declareAttribute('TeleportWhere', true);
		*/

		/*this.#attributes[Symbol.iterator] = function* () {
			for (let [name, set] of this.entries()) {
				if (set._multiple) {
					for (let [value] of set._value.entries()) {
						yield [name, value];
					}
				} else {
					yield [name, set._value];
				}
			}
		}*/
	}

	getName() {
		return this.#name;
	}

	clear() {
		this.#parent = undefined;
		this.#childs.clear();
		this.#attributes.clear();
	}

	getParent() {
		return this.#parent;
	}

	isDescendant(entity) {
		let current = entity;
		while(current) {
			if (current == this) {
				return true;
			}
			current = current.getParent();
		}
		return false;
	}


	getRoot() {
		if (this.#parent) {
			return this.#parent.getRoot();
		} else {
			return this;
		}
	}

	addChild(child) {
		this.#childs.add(child);
		child.#parent = this;
		this.dispatchUpdate();
	}

	dispatchUpdate() {
		Controller.dispatchEvent(new CustomEvent(EVENT_ENTITY_UPDATED, { detail: this }));
	}

	removeChild(child) {
		if (this.#childs.has(child)) {
			this.#childs.delete(child);
			child.#parent = null;
			Controller.dispatchEvent(new CustomEvent(EVENT_ENTITY_UPDATED, { detail: this }));
		}
	}

	getChilds() {
		return this.#childs;
	}

	remove() {
		const parent = this.#parent;
		if (parent) {
			parent.removeChild(this);
		}
	}

	setAttributes(json) {
		//console.log(json);
		for (const attributeJSON of json.attributes) {
			//console.info(attributeJSON);
			const attribute = new EntityAttribute(attributeJSON);
			this.#attributes.set(attributeJSON.name.toLowerCase(), attribute);
			//console.info(attribute);
		}
	}

	addAttribute(attribute) {
		this.#attributes.set(attribute.getName().toLowerCase(), attribute);
	}

	getAttributes() {
		return this.#attributes;
	}

	#declareAttribute(attribute, multiple) {
		if (!this._attributes.has(attribute)) {
			let att = new EntityAttribute(multiple);
			this._attributes.set(attribute, att);
		}
	}

	setAttribute(name, value) {
		const attribute = this.#attributes.get(name.toLowerCase());
		if (!attribute) {
			console.error(`attribute ${name} not found in Entity.setAttribute()`, this);
			return;
		}

		attribute.setValue(value);
		this.dispatchUpdate();
	}

	hasAttribute(attribute) {
		throw 'TODO';
		let attrib = this._attributes.get(attribute);
		if (!attrib) {
			return false;
		} else {
			if (attrib._multiple) {
				return attrib._value.size > 0;
			} else {
				return true;
			}
		}
	}

	getAttribute(name) {
		return this.#attributes.get(name.toLowerCase());
	}

	removeAttribute(attribute) {
		throw 'Error';
		this._attributes.delete(attribute);
	}

	removeValues(name) {
		this.#attributes.get(name.toLowerCase())?.clear();
	}

	getAttributeValue(name) {
		return this.#attributes.get(name.toLowerCase())?.getValue();
	}

	isValid(errors = new set()) {
		this.check(errors);
		for (let child of this.#childs) {
			child.isValid(errors);
		}
		return errors;
	}

	check(errors) {
	}

	write() {
		return true;
	}

	getTemplate(name) {
		for (const child of this.#childs) {
			const template = child.getTemplate(name);
			if (template) {
				return template;
			}
		}
	}


}
