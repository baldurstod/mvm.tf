import { createElement, hide, show } from 'harmony-ui';
import { OptionsManager } from 'harmony-browser-utils/src/optionsmanager.js';
import { I18n } from 'harmony-browser-utils/src/i18n.js';

import { PRODUCTION } from './bundleoptions.js';
import { Controller } from './controller.js';
import { EVENT_ENTITY_UPDATED, EVENT_EXPORT_POPULATION, EVENT_FILE_LOADED, EVENT_FOCUS_ENTITY, EVENT_REMOVE_ENTITY } from './controllerevents.js';
import { createBasicPopulation } from './createpopulation.js';
import { initPopulation } from './datas/officialpopulation.js';
import { writePopFile } from './serialization/writer.js';
import { readPopFile } from './serialization/reader.js';
import { Toolbar } from './view/toolbar.js';
import { TimelineView } from './view/timeline.js';
import { WaveScheduleView } from './view/wavescheduleview.js';

export { BotSpawner } from './population/spawners/bot.js';
export { RandomChoiceSpawner } from './population/spawners/randomchoice.js';
export { SentryGunSpawner } from './population/spawners/sentrygun.js';
export { SquadSpawner } from './population/spawners/squad.js';
export { TankSpawner } from './population/spawners/tank.js';

import '../css/application.css';
import '../css/vars.css';

import english from '../json/i18n/english.json';
import optionsmanager from '../json/optionsmanager.json';
//import { GOOGLE_ANALYTICS_ID } from './googleconstants.js';

class Application {
	#waveScheduleView = new WaveScheduleView();
	#timelineView = new TimelineView();
	#htmlElement;
	#appToolbar = new Toolbar();
	#population;

	constructor() {
		I18n.setOptions({ translations:[english] });
		I18n.start();
		this.#initListeners();
		this.#initHTML();
		this.#initOptions();
		//this.#setupAnalytics();
		this.#createNewPopulation();
	}

	#createNewPopulation() {
		this.#setPopulation(createBasicPopulation());
	}

	#setPopulation(population) {
		this.#population = population;
		const waveSchedule = population.getWaveSchedule();
		this.#waveScheduleView.setEntity(waveSchedule);
		this.#timelineView.setEntity(waveSchedule);

		this.#initTemplates(population);
	}

	async #initTemplates(population) {
		for (const base of population.getBases()) {
			console.log(await initPopulation(base));
		}

		Controller.dispatchEvent(new CustomEvent(EVENT_ENTITY_UPDATED));
	}

	#initOptions() {
		OptionsManager.init({ json: optionsmanager });
	}

	#initListeners() {
		window.addEventListener('beforeunload', event => this.#beforeUnload(event));
		Controller.addEventListener(EVENT_REMOVE_ENTITY, event => this.#removeEntity(event.detail));

		Controller.addEventListener(EVENT_FILE_LOADED, event => this.#setPopulation(readPopFile(event.detail)));
		Controller.addEventListener(EVENT_EXPORT_POPULATION, () => this.#exportPopulation());
		Controller.addEventListener(EVENT_FOCUS_ENTITY, () => this.#waveScheduleView.focusChildEntity(event.detail));
	}

	#initHTML() {
		this.#htmlElement = createElement('div', {
			className: 'application',
			parent: document.body,
			childs: [
				this.#appToolbar.htmlElement,
				createElement('div', {
					class: 'main-content',
					childs: [
						this.#waveScheduleView.htmlElement,
						this.#timelineView.htmlElement,
					],
				}),
			],
		});
	}

	#removeEntity(entity) {
		console.error(entity);
		entity?.remove();
	}

	#beforeUnload() {
		//TODO
	}

	#exportPopulation() {
		const errors = new Set();
		this.#population.isValid(errors);
		if (errors.size == 0) {
			writePopFile(this.#population);
		} else {
			console.error(errors);
		}
	}
/*
	#setupAnalytics() {
		if (PRODUCTION) {
			createElement('script', {
				src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
				parent: document.body,
				async: 1,
			});
			createElement('script', {
				innerText: `window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());

				gtag('config', '${GOOGLE_ANALYTICS_ID}');`,
				parent: document.body,
			});
		}
	}*/
}
new Application();
