import { closeSVG } from 'harmony-svg';
import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_REMOVE_ENTITY } from '../controllerevents';

//import {Application} from '../Application.js';
//import {getImg} from '../Img.js';



export class EntityView {
	#htmlElement;
	#htmlAttributes;
	#htmlChilds;
	#entity;
	#attributeTemplates;
	static #dataListID = 0;
	constructor(attributeTemplates) {
		this.#attributeTemplates = attributeTemplates;
	}

	setEntity(entity) {
		this.#entity = entity;
	}

	getEntity() {
		return this.#entity;
	}

	initHTML() {
		this.#htmlElement = createElement('div', {
			childs: [
				createElement('button', {
					class: 'entity-remove-button',
					innerHTML: closeSVG,
					events: {
						click: () => {
							Controller.dispatchEvent(new CustomEvent(EVENT_REMOVE_ENTITY, { detail: entityView.getEntity() }));
						}
					},
				}),
				this.#htmlAttributes = createElement('div', { class: 'entity-attributes' }),
				this.#htmlChilds = createElement('div', { class: 'entity-childs' }),
			]
		});

		this.#initAttributes();
		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.initHTML();
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
}
