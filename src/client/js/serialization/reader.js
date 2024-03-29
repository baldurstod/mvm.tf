import { parse } from 'vdf';
import { BotSpawner } from '../population/spawners/bot';
import { CharacterAttributes } from '../population/characterattributes.js';
import { ItemAttributes } from '../population/itemattributes.js';
import { Mission } from '../population/mission.js';
import { Output } from '../population/output.js';
import { Population } from '../population/population.js';
import { SquadSpawner } from '../population/spawners/squad';
import { RandomChoiceSpawner } from '../population/spawners/randomchoice.js';
import { TankSpawner } from '../population/spawners/tank.js';
import { Template } from '../population/template.js';
import { Templates } from '../population/templates.js';
import { Wave } from '../population/wave.js';
import { WaveSchedule } from '../population/waveschedule.js';
import { WaveSpawn } from '../population/wavespawn';

import botAttributes from '../../json/attributes/bot.json';
import missionAttributes from '../../json/attributes/mission.json';
import outputAttributes from '../../json/attributes/output.json';
import populationAttributes from '../../json/attributes/population.json';
import squadAttributes from '../../json/attributes/squad.json';
import tankAttributes from '../../json/attributes/tank.json';
import waveAttributes from '../../json/attributes/wave.json';
import waveSpawnAttributes from '../../json/attributes/wavespawn.json';
import waveScheduleAttributes from '../../json/attributes/waveschedule.json';

export function readPopFile(content) {
	const population = parse(content);
	if (!population) {
		throw new Error('Unable to parse pop file');
	}

	return createPopulation(population);
}

function createPopulation(populationKV) {

	const population = new Population();

	for (const kv of populationKV.getKeys()) {
		if (isAttribute(kv.key, populationAttributes)) {
			population.setAttribute(kv.key, kv.value);
		} else {
			population.addChild(createWaveSchedule(kv));
		}
	}

	return population;
}

function createWaveSchedule(waveScheduleKV) {
	const waveSchedule = new WaveSchedule();

	for (const kv of waveScheduleKV.getKeys()) {
		if (isAttribute(kv.key, waveScheduleAttributes)) {
			waveSchedule.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'Templates':
					waveSchedule.addChild(createTemplates(kv));
					break;
				case 'Mission':
					waveSchedule.addChild(createMission(kv));
					break;
				case 'Wave':
					waveSchedule.addChild(createWave(kv));
					break;

				default:
					console.error(`Unknown key ${kv.key} in createWaveSchedule()`);
			}
		}
	}

	return waveSchedule;
}

function createWave(waveKV) {
	const wave = new Wave();

	for (const kv of waveKV.getKeys()) {
		if (isAttribute(kv.key, waveAttributes)) {
			wave.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'StartWaveOutput':
				case 'DoneOutput':
				case 'InitWaveOutput':
					wave.addChild(createOutput(kv.key, kv));
					break;
				case 'WaveSpawn':
					wave.addChild(createWaveSpawn(kv));
					break;
				case 'Checkpoint':
					// It's actually unused
					break;
				default:
					console.error(`Unknown key ${kv.key} in createWave()`);
			}
		}
	}

	return wave;
}

function createWaveSpawn(waveSpawnKV) {
	const waveSpawn = new WaveSpawn();

	for (const kv of waveSpawnKV.getKeys()) {
		if (isAttribute(kv.key, waveSpawnAttributes)) {
			waveSpawn.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'TFBot':
					waveSpawn.setSpawner(createBot(kv));
					break;
				case 'Squad':
					waveSpawn.setSpawner(createSquad(kv));
					break;
				case 'RandomChoice':
					waveSpawn.setSpawner(createRandomChoice(kv));
					break;
				case 'Tank':
					waveSpawn.setSpawner(createTank(kv));
					break;
				case 'FirstSpawnOutput':
					waveSpawn.addChild(createOutput(kv.key, kv));
					break;
				default:
					console.error(`Unknown key ${kv.key} in createWaveSpawn()`);
			}
		}
	}
	return waveSpawn;
}

function createMission(missionKV) {
	const mission = new Mission();

	for (const kv of missionKV.getKeys()) {
		if (isAttribute(kv.key, missionAttributes)) {
			mission.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'TFBot':
					mission.setSpawner(createBot(kv));
					break;
				case 'Squad':
					mission.setSpawner(createSquad(kv));
					break;
				case 'RandomChoice':
					mission.setSpawner(createRandomChoice(kv));
					break;
				case 'Tank':
					mission.setSpawner(createTank(kv));
					break;
				default:
					console.error(`Unknown key ${kv.key} in createMission()`);
			}
		}
	}
	return mission;
}

function createTemplates(templatesKV) {
	const templates = new Templates();

	for (const kv of templatesKV.getKeys()) {
		templates.addChild(createTemplate(kv));
	}
	return templates;
}

function createTemplate(templateKV) {
	const template = new Template(templateKV.key);

	for (const kv of templateKV.getKeys()) {
		template.setAttribute(kv.key, kv.value);
	}

	return template;
}

function createSquad(squadKV) {
	const squad = new SquadSpawner();

	for (const kv of squadKV.getKeys()) {
		if (isAttribute(kv.key, squadAttributes)) {
			squad.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'TFBot':
					squad.addChild(createBot(kv));
					break;
				default:
					console.error(`Unknown key ${kv.key} in createSquad()`);
			}
		}
	}

	return squad;
}

function createBot(botKV) {
	const bot = new BotSpawner();

	for (const kv of botKV.getKeys()) {
		if (isAttribute(kv.key, botAttributes)) {
			bot.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'ItemAttributes':
					bot.addChild(createItemAttributes(kv));
					break;
				case 'CharacterAttributes':
					bot.addChild(createCharacterAttributes(kv));
					break;
				default:
					console.error(`Unknown key ${kv.key} in createBot()`);
			}
		}
	}

	return bot;
}

function createTank(tankKV) {
	const tank = new TankSpawner();

	for (const kv of tankKV.getKeys()) {
		if (isAttribute(kv.key, tankAttributes)) {
			tank.setAttribute(kv.key, kv.value);
		} else {
			switch (kv.key) {
				case 'OnKilledOutput':
				case 'OnBombDroppedOutput':
					tank.addChild(createOutput(kv.key, kv));
					break;
				default:
					console.error(`Unknown key ${kv.key} in createTank()`);
			}
		}
	}

	return tank;
}

function createRandomChoice(randomChoiceKV) {
	const randomChoice = new RandomChoiceSpawner();

	for (const kv of randomChoiceKV.getKeys()) {
		switch (kv.key) {
			case 'TFBot':
				randomChoice.addChild(createBot(kv));
				break;
			default:
				console.error(`Unknown key ${kv.key} in RandomChoice()`);
		}
	}

	return randomChoice;
}

function createOutput(name, outputKV) {
	const output = new Output(name);

	for (const kv of outputKV.getKeys()) {
		if (isAttribute(kv.key, outputAttributes)) {
			output.setAttribute(kv.key, kv.value);
		} else {
			console.error(`Unknown key ${kv.key} in createOutput()`);
		}
	}

	return output;
}

function createItemAttributes(itemAttributesKV) {
	const itemAttributes = new ItemAttributes();

	for (const kv of itemAttributesKV.getKeys()) {
		itemAttributes.setAttribute(kv.key, kv.value);
	}

	return itemAttributes;
}

function createCharacterAttributes(characterAttributesKV) {
	const characterAttributes = new CharacterAttributes();

	for (const kv of characterAttributesKV.getKeys()) {
		characterAttributes.setAttribute(kv.key, kv.value);
	}

	return characterAttributes;
}

function isAttribute(attributeName, template) {
	for (const attribute of template.attributes) {
		if (attribute.name.toLowerCase() == attributeName.toLowerCase()) {
			return true;
		}
	}
	return false;
}
