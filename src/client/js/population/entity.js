import { Controller } from '../controller.js';
import { EVENT_ENTITY_UPDATED } from '../controllerevents.js';
import { EntityAttribute } from './entityattribute.js';

export class Entity {
	#parent;
	#childs = new Set();
	#attributes = new Map();
	constructor() {
		this.isEntity = true;
/*
		this.declareAttribute('Where', true);
		this.declareAttribute('Attributes', true);
		this.declareAttribute('Item', true);
		this.declareAttribute('Tag', true);
		this.declareAttribute('TeleportWhere', true);
		*/

		this.#attributes[Symbol.iterator] = function* () {
			for (let [name, set] of this.entries()) {
				if (set._multiple) {
					for (let [value] of set._value.entries()) {
						yield [name, value];
					}
				} else {
					yield [name, set._value];
				}
			}
		}
	}

	clear() {
		this.#parent = undefined;
		this.#childs.clear();
		this.#attributes.clear();
	}

	getParent() {
		return this.#parent;
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
			this.#attributes.set(attributeJSON.name, attribute);
			//console.info(attribute);
		}

	}

	#declareAttribute(attribute, multiple) {
		if (!this._attributes.has(attribute)) {
			let att = new EntityAttribute(multiple);
			this._attributes.set(attribute, att);
		}
	}

	setAttribute(name, value) {
		throw 'TODO';
		if (this._attributes.has(attribute)) {
			this._attributes.get(attribute).setValue(value);
		} else {
			let att = new EntityAttribute();
			att.setValue(value);
			this._attributes.set(attribute, att);
		}
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

	getAttribute(attribute) {
		throw 'Error';
		this._attributes.get(attribute);
	}

	removeAttribute(attribute) {
		throw 'Error';
		this._attributes.delete(attribute);
	}

	removeValues(name) {
		this.#attributes.get(name)?.clear();
	}

	getAttributeValue(name) {
		return this.#attributes.get(name)?.getValue();
	}

	validate() {
		this.check();
		for (let child of this.#childs) {
			child.validate();
		}
	}

	check() {
	}

	write() {
		return true;
	}
}
