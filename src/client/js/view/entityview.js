import { closeSVG } from 'harmony-svg';
import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_ENTITY_UPDATED, EVENT_REMOVE_ENTITY } from '../controllerevents';

import '../../css/entity.css';

export class EntityView {
	#htmlElement;
	#htmlAttributes;
	#htmlAttributesInputs = new Map();
	#htmlChilds;
	#entity;
	#attributeTemplates;
	static #dataListID = 0;

	constructor(attributeTemplates, entity) {
		this.#attributeTemplates = attributeTemplates;
		this.#entity = entity;
		Controller.addEventListener(EVENT_ENTITY_UPDATED, event => this.#entityUpdated(event.detail));
	}

	setEntity(entity) {
		this.#entity = entity;
		this.updateHTML();
	}

	getEntity() {
		return this.#entity;
	}

	initHTML() {
		if (this.#htmlElement) {
			return this.#htmlElement;
		}
		this.#htmlElement = createElement('div', {
			class: 'mvm-entity',
			childs: [
				createElement('button', {
					class: 'entity-remove-button',
					innerHTML: closeSVG,
					events: {
						click: () => {
							Controller.dispatchEvent(new CustomEvent(EVENT_REMOVE_ENTITY, { detail: this.getEntity() }));
						}
					},
				}),
				this.#htmlAttributes = createElement('div', { class: 'mvm-entity-attributes' }),
				this.#htmlChilds = createElement('div', { class: 'mvm-entity-childs' }),
			]
		});

		this.#initAttributes();
		return this.#htmlElement;
	}

	updateHTML() {
		this.#updateAttributes();
	}

	get htmlElement() {
		return this.initHTML();
	}

	get htmlChilds() {
		return this.#htmlChilds;
	}

	#initAttributes() {
		const attributeTemplates = this.#attributeTemplates;
		for (const attributeTemplate of attributeTemplates.attributes) {
			console.info(attributeTemplate);
			this.#initAttribute(attributeTemplate);
		}
	}

	#initAttribute(attributeTemplate) {
		let htmlAttributeInput;
		switch (attributeTemplate.type) {
			case 'string':
				htmlAttributeInput = createElement('input');
				break;
			case 'integer':
				htmlAttributeInput = createElement('input');
				break;
			case 'list':
				const listID = `entity-attribute-list-${++EntityView.#dataListID}`
				htmlAttributeInput = createElement('select', { list: listID });
				if (attributeTemplate.datalist) {
					const htmlDataList = createElement('datalist', {
						parent: this.#htmlAttributes,
						 id: listID,
					});
					for (const value of attributeTemplate.datalist) {
						createElement('option', {
							parent: htmlAttributeInput,
							value: value,
							innerHTML: value,
						});
					}
				}
				//console.warn('TODO: populate list');
				break;
			case 'trueifpresent':
			case 'boolean':
				htmlAttributeInput = createElement('input', { type: 'checkbox' });
				break;
			default:
				throw `FIXME: unknow type ${attributeTemplate.type}`;
				break;
		}

		this.#htmlAttributesInputs.set(attributeTemplate.name, htmlAttributeInput);

		createElement('div', {
			parent: this.#htmlAttributes,
			childs: [
				createElement('label', {
					childs: [
						createElement('span', {
							i18n: attributeTemplate.i18n,
						}),
						htmlAttributeInput,
					],
				}),
			],
		});
	}

	#updateAttributes() {
		if (!this.#entity) {
			return;
		}
		const attributeTemplates = this.#attributeTemplates;
		for (const attributeTemplate of attributeTemplates.attributes) {
			this.#updateAttribute(attributeTemplate);
		}
	}

	#updateAttribute(attributeTemplate) {
		const htmlAttributeInput = this.#htmlAttributesInputs.get(attributeTemplate.name);
		const attributeValue = this.#entity.getAttributeValue(attributeTemplate.name);

		switch (attributeTemplate.type) {
			case 'string':
				htmlAttributeInput.value = attributeValue;
				break;
			case 'integer':
				htmlAttributeInput.value = attributeValue;
				break;
			case 'list':
				htmlAttributeInput.value = attributeValue;
				break;
			case 'trueifpresent':
			case 'boolean':
				htmlAttributeInput.checked = attributeValue;
				break;
			default:
				throw `FIXME: unknow type ${attributeTemplate.type}`;
				break;
		}
	}

	#entityUpdated(entity) {
		if (entity == this.#entity) {
			this.updateHTML();
		}
	}
}
