import { SaveFile } from 'harmony-browser-utils';
import { KeyValue, stringify } from 'vdf';
import { INSERT_AFTER, INSERT_BEFORE } from './constants.js';
import { DEFAULT_VALUE_FOR_TYPE } from '../population/constants.js';

import botAttributes from '../../json/attributes/bot.json';
import missionAttributes from '../../json/attributes/mission.json';
import outputAttributes from '../../json/attributes/output.json';
import populationAttributes from '../../json/attributes/population.json';
import squadAttributes from '../../json/attributes/squad.json';
import tankAttributes from '../../json/attributes/tank.json';
import waveAttributes from '../../json/attributes/wave.json';
import waveSpawnAttributes from '../../json/attributes/wavespawn.json';
import waveScheduleAttributes from '../../json/attributes/waveschedule.json';
import sentryGunAttributes from '../../json/attributes/sentrygun.json';

export function writePopFile(population) {
	if (!population.isPopulation) {
		console.error('Not a population:', population);
	}

	const populationStr = exportEntity(population);

	const result = INSERT_BEFORE + stringify(populationStr) + INSERT_AFTER;

	if (result) {
		SaveFile(new File([result], 'mvm_popfile.pop'));
	}
}

function exportEntity(entity) {
	if (!entity) {
		return;
	}
	switch (true) {
		case entity.isPopulation:
			return exportPopulation(entity);
		case entity.isWaveSchedule:
			return exportWaveSchedule(entity);
		case entity.isWave:
			return exportWave(entity);
		case entity.isWaveSpawn:
			return exportWaveSpawn(entity);
		case entity.isBotSpawner:
			return exportBot(entity);
		case entity.isRandomChoiceSpawner:
			return exportRandomChoice(entity);
		case entity.isSentryGunSpawner:
			return exportSentryGun(entity);
		case entity.isSquadSpawner:
			return exportSquad(entity);
		case entity.isTankSpawner:
			return exportTank(entity);
		case entity.isOutput:
			return exportOutput(entity);
		case entity.isMission:
			return exportMission(entity);
		case entity.isItemAttributes:
			return exportItemAttributes(entity);
		case entity.isCharacterAttributes:
			return exportCharacterAttributes(entity);
		case entity.isTemplates:
			return exportTemplates(entity);
		case entity.isTemplate:
			return exportTemplate(entity);
		default:
			console.error('Can\'t export entity', entity);
			break;
	}
}

function exportChilds(kv, childs) {
	for (const child of childs) {
		const childKV = exportEntity(child);
		if (childKV) {
			kv.value.push(childKV);
		}
	}
}

function exportPopulation(population) {
	const populationKV = new KeyValue('root', []);

	populationKV.value.push(...exportAttributes(populationAttributes, population));
	exportChilds(populationKV, population.getChilds());

	return populationKV;
}

function exportWaveSchedule(waveSchedule) {
	const waveScheduleKV = new KeyValue('WaveSchedule', []);

	//const attributes = exportAttributes(waveScheduleAttributes, waveSchedule);
	waveScheduleKV.value.push(...exportAttributes(waveScheduleAttributes, waveSchedule));
	//console.info(waveSchedule.getChilds());
	exportChilds(waveScheduleKV, waveSchedule.getChilds());

	//TODO: add base
	//waveScheduleKV.value.push(exportWaveSchedule(waveSchedule));
	return waveScheduleKV;
}

function exportWave(wave) {
	const waveKV = new KeyValue('Wave', []);
	waveKV.value.push(...exportAttributes(waveAttributes, wave));
	exportChilds(waveKV, wave.getChilds());
	return waveKV;
}

function exportMission(mission) {
	const missionKV = new KeyValue('Mission', []);
	missionKV.value.push(...exportAttributes(missionAttributes, mission));
	exportChilds(missionKV, [...mission.getChilds(), mission.getSpawner()]);
	return missionKV;
}

function exportWaveSpawn(waveSpawn) {
	const waveSpawnKV = new KeyValue('WaveSpawn', []);
	waveSpawnKV.value.push(...exportAttributes(waveSpawnAttributes, waveSpawn));
	exportChilds(waveSpawnKV, [...waveSpawn.getChilds(), waveSpawn.getSpawner()]);
	return waveSpawnKV;
}

function exportBot(bot) {
	const botKV = new KeyValue('TFBot', []);
	botKV.value.push(...exportAttributes(botAttributes, bot));
	exportChilds(botKV, bot.getChilds());
	return botKV;
}

function exportRandomChoice(randomChoice) {
	const randomChoiceKV = new KeyValue('RandomChoice', []);
	//randomChoiceKV.value.push(...exportAttributes(botAttributes, bot));
	exportChilds(randomChoiceKV, randomChoice.getChilds());
	return randomChoiceKV;
}

function exportSentryGun(sentryGun) {
	const sentryGunKV = new KeyValue('SentryGun', []);
	sentryGunKV.value.push(...exportAttributes(sentryGunAttributes, sentryGun));
	exportChilds(sentryGunKV, sentryGun.getChilds());
	return sentryGunKV;
}

function exportSquad(squad) {
	const squadKV = new KeyValue('Squad', []);
	squadKV.value.push(...exportAttributes(squadAttributes, squad));
	exportChilds(squadKV, squad.getChilds());
	return squadKV;
}

function exportTank(tank) {
	const tankKV = new KeyValue('Tank', []);
	tankKV.value.push(...exportAttributes(tankAttributes, tank));
	exportChilds(tankKV, tank.getChilds());
	return tankKV;
}

function exportTemplates(templates) {
	const templatesKV = new KeyValue('Templates', []);
	//templatesKV.value.push(...exportAttributes(tankAttributes, tank));
	exportChilds(templatesKV, templates.getChilds());
	return templatesKV;
}

function exportTemplate(template) {
	const templateKV = new KeyValue(template.getName(), []);
	templateKV.value.push(...exportAttributes(undefined, template));
	exportChilds(templateKV, template.getChilds());
	return templateKV;
}

function exportOutput(output) {
	const outputKV = new KeyValue(output.getName(), []);
	outputKV.value.push(...exportAttributes(outputAttributes, output));
	//exportChilds(tankKV, tank.getChilds());
	return outputKV;
}

function exportItemAttributes(itemAttributes) {
	const itemAttributesKV = new KeyValue('ItemAttributes', []);
	itemAttributesKV.value.push(...exportAttributes(undefined, itemAttributes));
	return itemAttributesKV;
}

function exportCharacterAttributes(characterAttributes) {
	const characterAttributesKV = new KeyValue('CharacterAttributes', []);
	characterAttributesKV.value.push(...exportAttributes(undefined, characterAttributes));
	return characterAttributesKV;
}

function exportAttributes(template, entity) {
	const attributes = [];
	if (template) {
		for (const attributeTemplate of template.attributes) {
			attributes.push(...exportAttribute(entity, attributeTemplate.name));
		}
	} else {
		for (const [name, _] of entity.getAttributes()) {
			attributes.push(...exportAttribute(entity, name));
		}
	}

	console.info(attributes);
	return attributes;
}


function exportAttribute(entity, name) {
	const attributes = [];
	const attribute = entity.getAttribute(name);
	if (!attribute) {
		console.error(`attribute ${name} not found in exportAttributes()`, entity);
		return attributes;
	}

	const attributeValue = attribute.getValue();
	let attributeDefault = attribute.getDefault();

	if (attributeDefault === undefined) {
		attributeDefault = DEFAULT_VALUE_FOR_TYPE[attribute.getType()];
	}

	if (attribute.isMultiple()) {
		//console.error('TODO');
		for (const value of attributeValue) {
			if (value !== attributeDefault) {
				attributes.push(new KeyValue(attribute.getName(), value));
			}
		}
	} else {
		if (attributeValue !== attributeDefault) {
			attributes.push(new KeyValue(attribute.getName(), attributeValue));
		}
	}
	return attributes;
}
