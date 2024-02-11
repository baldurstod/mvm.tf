import { SaveFile } from 'harmony-browser-utils';
import { KeyValue, stringify } from 'vdf';
import { DEFAULT_VALUE_FOR_TYPE } from '../population/constants.js';


import botAttributes from '../../json/attributes/bot.json';
import outputAttributes from '../../json/attributes/output.json';
import squadAttributes from '../../json/attributes/squad.json';
import tankAttributes from '../../json/attributes/tank.json';
import waveAttributes from '../../json/attributes/wave.json';
import waveSpawnAttributes from '../../json/attributes/wavespawn.json';
import waveScheduleAttributes from '../../json/attributes/waveschedule.json';
import sentryGunAttributes from '../../json/attributes/sentrygun.json';

export function writePopFile(waveSchedule) {
	if (!waveSchedule.isWaveSchedule) {
		console.error('Not a WaveSchedule:', waveSchedule);
	}

	const population = exportPopulation(waveSchedule);

	const result = stringify(population);
	if (result) {
		SaveFile(new File([result], 'mvm_popfile.pop'));
	}


	console.info(stringify(population));
}


function exportPopulation(waveSchedule) {
	const populationKV = new KeyValue('root', []);

	//TODO: add base
	populationKV.value.push(exportEntity(waveSchedule));
	return populationKV;
}

function exportEntity(entity) {
	switch (true) {
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

function exportWaveSpawn(waveSpawn) {
	const waveSpawnKV = new KeyValue('WaveSpawn', []);
	waveSpawnKV.value.push(...exportAttributes(waveSpawnAttributes, waveSpawn));
	exportChilds(waveSpawnKV, [waveSpawn.getSpawner()]);
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

function exportOutput(output) {
	const outputKV = new KeyValue(output.getName(), []);
	outputKV.value.push(...exportAttributes(outputAttributes, output));
	//exportChilds(tankKV, tank.getChilds());
	return outputKV;
}

function exportAttributes(template, entity) {
	const attributes = [];
	for (const attributeTemplate of template.attributes) {
		const attribute = entity.getAttribute(attributeTemplate.name);
		if (!attribute) {
			continue;
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
	}

	console.info(attributes);
	return attributes;
}
