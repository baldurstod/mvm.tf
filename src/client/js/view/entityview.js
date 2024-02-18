import { closeSVG } from 'harmony-svg';
import { createElement } from 'harmony-ui';
import { Controller } from '../controller.js';
import { EVENT_ENTITY_UPDATED, EVENT_MAP_CHANGED, EVENT_REMOVE_ENTITY } from '../controllerevents.js';
import { getMap } from '../population/maps.js';

export { HTMLClassIcon } from './elements/classiconselector.js';
export { HTMLTagSelector } from './elements/tagselector.js';

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
	static #htmlWhereDataList;
	static #htmlTagDataList;
	static #currentMap;

	static {
		Controller.addEventListener(EVENT_MAP_CHANGED, event => this.#setMap(event.detail));
		this.#htmlTemplatesDataList = createElement('datalist', {
			parent: document.head,
			id: TEMPLATE_LIST_ID,
		});
		this.#htmlWhereDataList = createElement('datalist', {
			parent: document.head,
			id: 'entity-attribute-template-list-where',
		});
		this.#htmlTagDataList = createElement('datalist', {
			parent: document.head,
			id: 'entity-attribute-template-list-tag',
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
				const listName = attributeTemplate['list_name'];
				htmlAttributeInput = createElement('mvm-tag-selector', {
					list: `entity-attribute-template-list-${listName}`,
					class: `entity-dynamic-list-${listName}`,
					...(attributeTemplate.multiple) && { multiple: 1 },
					events: {
						change: event => {
							//TODO: check validity
							if (attributeTemplate.multiple) {
								this.#entity.setAttribute(attributeTemplate.name, event.detail);
							} else {
								this.#entity.setAttribute(attributeTemplate.name, event.detail[0]);
							}
						}
					},
				});
				/*switch (listName) {
					case 'where':
						EntityView.#populateWhere(htmlAttributeInput, EntityView.#currentMap);
						break;
				}*/
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
				htmlAttributeInput.value = this.getEntity()?.getIcon();
				break;
			case 'template':
				// TODO
				break;
			case 'dynamiclist':
				//console.info(htmlAttributeInput, attributeValue);
				//htmlAttributeInput.value = attributeValue;

				htmlAttributeInput.value = attributeValue;
/*
				if (attributeTemplate.multiple) {
					for (const value of attributeValue) {
						for (const option of htmlAttributeInput.options) {
							if (option.value == value) {
								option.selected = true;
							}
						}
					}
				}
				*/
				break;
			default:
				throw `FIXME: unknow type ${attributeTemplate.type}`;
				break;
		}
	}

	#entityUpdated(entity) {
		if (!entity || entity == this.#entity) {
			this.updateHTML();
		}
	}

	focusChildEntity(entity) {
	}

	static #setMap(mapName) {
		const map = getMap(mapName);
		if (!map) {
			return;
		}

		this.#currentMap = map;

		this.#populateWhere(map);
		this.#populateTag(map);
	}

	static #populateWhere(map) {
		console.info('populateWhere', map);

		this.#htmlWhereDataList.innerHTML = '';
		for (const spawn of map.spawns) {
			createElement('option', {
				innerText: spawn,
				value: spawn,
				parent: this.#htmlWhereDataList,
			});
		}
	}

	static #populateTag(map) {
		console.info('populateTag', map);

		this.#htmlTagDataList.innerHTML = '';
		for (const spawn of map.tags) {
			createElement('option', {
				innerText: spawn,
				value: spawn,
				parent: this.#htmlTagDataList,
			});
		}
	}
}
