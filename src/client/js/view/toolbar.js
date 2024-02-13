import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_EXPORT_POPULATION, EVENT_FILE_LOADED, EVENT_MAP_CHANGED } from '../controllerevents';

import '../../css/toolbar.css';

export class Toolbar {
	#htmlElement;

	#initHTML() {
		this.#htmlElement = createElement('div', {
			class: 'toolbar',
			childs: [
				createElement('div', {
					class: 'toolbar-items',
					childs: [
						createElement('input', {
							type: 'file',
							events: {
								change: event => {

									let files = [];
									if (event.target) {
										files = event.target.files;
									}

									for (let i = 0, f; f = files[i]; i++) {
										if (!f.name.toLowerCase().endsWith('.pop')) {
											continue;
										}

										let reader = new FileReader();
										reader.addEventListener('load', event => Controller.dispatchEvent(new CustomEvent(EVENT_FILE_LOADED, { detail: event.target.result })));
										reader.readAsText(f);
									}
								},
							},
						}),
						createElement('button', {
							i18n: "#export",
							events: {
								click: () => Controller.dispatchEvent(new CustomEvent(EVENT_EXPORT_POPULATION)),
							},
						}),
						createElement('input', {
							list: 'mvm-map-datalist',
							events: {
								keyup: event => Controller.dispatchEvent(new CustomEvent(EVENT_MAP_CHANGED, { detail: event.target.value })),
							},
						}),
					],
				}),
			],
		});
		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.#initHTML();
	}
}
