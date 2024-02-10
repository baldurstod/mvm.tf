import { KeyValue } from 'vdf';


import botAttributes from '../../json/attributes/bot.json';
import squadAttributes from '../../json/attributes/squad.json';
import tankAttributes from '../../json/attributes/tank.json';
import waveAttributes from '../../json/attributes/wave.json';
import waveSpawnAttributes from '../../json/attributes/wavespawn.json';
import waveScheduleAttributes from '../../json/attributes/waveschedule.json';

export function writePopFile(waveSchedule) {
	if (!waveSchedule.isWaveSchedule) {
		console.error('Not a WaveSchedule:', waveSchedule);
	}

	const population = exportPopulation(waveSchedule);
	/*const population = parse(content);
	if (!population) {
		throw new Error('Unable to parse pop file');
	}

	console.log(createPopulation(population));
	return createPopulation(population);*/
}


function exportPopulation(waveSchedule) {
	const populationKV = new KeyValue('root', []);

	//TODO: add base
	populationKV.value.push(exportWaveSchedule(waveSchedule));
	return populationKV;
}

function exportWaveSchedule(waveSchedule) {
	const waveScheduleKV = new KeyValue('WaveSchedule', []);

	exportAttributes(waveScheduleAttributes, waveSchedule);

	//TODO: add base
	//waveScheduleKV.value.push(exportWaveSchedule(waveSchedule));
	return waveScheduleKV;
}


function exportAttributes(template, entity) {
	const attributes = [];
	for (const attributeTemplate of template.attributes) {
		const attribute = entity.getAttribute(attributeTemplate.name);
		if (!attribute) {
			continue;
		}

		if (attribute.isMultiple()) {
			console.error('TODO');

		} else {
			if (attribute.getValue() != attribute.getDefault()) {
				attributes.push(new KeyValue(attribute.getName(), attribute.getValue()));
			}
		}
	}

	console.info(attributes);
	return attributes;
}
