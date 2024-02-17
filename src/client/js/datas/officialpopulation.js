import { COMPRESSED_OFFICIAL_POPULATION } from './compressedofficialpopulation.js';
import { readPopFile } from '../serialization/reader.js';

const OFFICIAL_POPULATION = {};

export async function initPopulation(name) {
	try {
		name = name.replace(/\.pop$/, '');
		let population = OFFICIAL_POPULATION[name];

		if (!population) {
			const populationTxt = await decompress(COMPRESSED_OFFICIAL_POPULATION[name]);
			population = readPopFile(populationTxt);
			OFFICIAL_POPULATION[name] = population;
		}

		return population;
	} catch(e) {}
}

export function getPopulation(name) {
	name = name.replace(/\.pop$/, '');
	return OFFICIAL_POPULATION[name];
}

async function decompress(url) {
	const ds = new DecompressionStream('gzip');
	const response = await fetch(url);
	const blobIn = await response.blob();
	const streamIn = blobIn.stream().pipeThrough(ds);
	const blobOut = await new Response(streamIn).blob();
	return await blobOut.text();
};
