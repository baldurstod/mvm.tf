import { COMPRESSED_OFFICIAL_POPULATION } from "./compressedofficialpopulation";

const OFFICIAL_POPULATION = {};

export async function getPopulation(name) {
	try {
		name = name.replace(/\.pop$/, '');
		let population = OFFICIAL_POPULATION[name];

		if (!population) {
			population = await decompress(COMPRESSED_OFFICIAL_POPULATION[name]);
			OFFICIAL_POPULATION[name] = population;
		}

		return population;
	} catch(e) {}
}

async function decompress(url) {
	const ds = new DecompressionStream('gzip');
	const response = await fetch(url);
	const blobIn = await response.blob();
	const streamIn = blobIn.stream().pipeThrough(ds);
	const blobOut = await new Response(streamIn).blob();
	return await blobOut.text();
};
