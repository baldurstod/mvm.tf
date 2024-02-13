import { closeSVG } from 'harmony-svg';
import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_ENTITY_UPDATED, EVENT_MAP_CHANGED, EVENT_REMOVE_ENTITY } from '../controllerevents';
export { HTMLClassIcon } from './elements/classiconselector';
import { getMap } from '../population/maps';

import '../../css/entity.css';

const TEMPLATE_LIST_ID = `entity-attribute-template-list`;

export class EntityView {
	#htmlInitialized = false;
	#htmlElement;
	#htmlTitle;
	#htmlAttributes;
	#htmlAttributesInputs = new Map();
	#htmlChilds;
	#entity;
	#attributeTemplates;
	static #dataListID = 0;
	static #htmlTemplatesDataList;

	static {
		Controller.addEventListener(EVENT_MAP_CHANGED, event => this.setMap(event.detail));
		this.#htmlTemplatesDataList = createElement('datalist', {
			parent: document.body,
			id: TEMPLATE_LIST_ID,
		});
		/*for (const value of attributeTemplate.datalist) {
			createElement('option', {
				parent: htmlAttributeInput,
				value: value,
				innerHTML: value,
			});
		}*/
	}

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
				this.#htmlTitle = createElement('div', { class: 'mvm-entity-title' }),
				this.#htmlAttributes = createElement('div', { class: 'mvm-entity-attributes' }),
				this.#htmlChilds = createElement('div', { class: 'mvm-entity-childs' }),
			]
		});

		this.#initAttributes();
		this.#htmlInitialized = true;
		return this.#htmlElement;
	}

	updateHTML() {
		if (!this.#htmlInitialized) {
			return;
		}
		this.#updateAttributes();
	}

	get htmlElement() {
		return this.initHTML();
	}

	get htmlTitle() {
		return this.#htmlTitle;
	}

	get htmlChilds() {
		return this.#htmlChilds;
	}

	get htmlInitialized() {
		return this.#htmlInitialized;
	}

	#initAttributes() {
		const attributeTemplates = this.#attributeTemplates;
		if (!attributeTemplates) {
			return;
		}
		for (const attributeTemplate of attributeTemplates.attributes) {
			//console.info(attributeTemplate);
			this.#initAttribute(attributeTemplate);
		}
	}

	#initAttribute(attributeTemplate) {
		let htmlAttributeInput;
		switch (attributeTemplate.type) {
			case 'string':
				htmlAttributeInput = createElement('input', {
					events: {
						change: event => {
							//TODO: check validity
							this.#entity.setAttribute(attributeTemplate.name, event.target.value);
						},
					},
				});
				break;
			case 'float':
			case 'integer':
				htmlAttributeInput = createElement('input', {
					events: {
						change: event => {
							//TODO: check validity
							this.#entity.setAttribute(attributeTemplate.name, event.target.value);
						}
					}
				});
				break;
			case 'list':
				const listID = `entity-attribute-list-${++EntityView.#dataListID}`;
				htmlAttributeInput = createElement('select', {
					list: listID,
					events: {
						change: event => {
							//TODO: check validity
							this.#entity.setAttribute(attributeTemplate.name, event.target.value);
						}
					},
				});
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
			case 'classicon':
				htmlAttributeInput = createElement('mvm-class-icon', {
					events: {
						change: event => {
							//TODO: check validity
							this.#entity.setAttribute(attributeTemplate.name, event.detail);
						}
					}
				});
				break;
			case 'template':
				htmlAttributeInput = createElement('select', {
					list: TEMPLATE_LIST_ID,
					events: {
						change: event => {
							//TODO: check validity
							this.#entity.setAttribute(attributeTemplate.name, event.target.value);
						}
					},
				});
				break;
			case 'dynamiclist':
				htmlAttributeInput = createElement('select', {
					class: `entity-dynamic-list-${attributeTemplate['list_name']}`,
					...(attributeTemplate.multiple) && { multiple: 1 },
					events: {
						change: event => {
							//TODO: check validity
							if (attributeTemplate.multiple) {
								const values = [];
								for (const option of event.target.selectedOptions) {
									values.push(option.value);
								}
								this.#entity.setAttribute(attributeTemplate.name, values);
							} else {
								this.#entity.setAttribute(attributeTemplate.name, event.target.value);
							}
						}
					},
				});
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
		if (!attributeTemplates) {
			return;
		}

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
			case 'float':
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
			case 'classicon':
				htmlAttributeInput.value = attributeValue;
				break;
			case 'template':
				// TODO
				break;
			case 'dynamiclist':
				console.info(htmlAttributeInput, attributeValue);
				// TODO
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

	static setMap(mapName) {
		const map = getMap(mapName);
		if (!map) {
			return;
		}

		this.#populateWhere(map);
	}

	static #populateWhere(map) {
		//this.#populateWhere();
		console.info('populateWhere', map);

		const spawns = map.spawns;
		const whereLists = document.getElementsByClassName('entity-dynamic-list-where');
		console.info('populateWhere', whereLists);

		for (const whereList of whereLists) {
			whereList.innerHTML = '';
			for (const spawn of spawns) {
				createElement('option', {
					innerText: spawn,
					value: spawn,
					parent: whereList,
				});
			}
		}
	}
}
