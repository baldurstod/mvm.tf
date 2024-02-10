import { createElement } from 'harmony-ui';
import { Controller } from '../controller';
import { EVENT_FILE_LOADED } from '../controllerevents';

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
