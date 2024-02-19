import { Population } from './population/population.js';
import { BotSpawner } from './population/spawners/bot.js';
import { Wave } from './population/wave.js';
import { WaveSchedule } from './population/waveschedule.js';
import { WaveSpawn } from './population/wavespawn.js';

export function createBasicPopulation() {
	const population = new Population();
	population.addChild(new createBasicWaveSchedule());
	return population;
}


export function createBasicWaveSchedule() {
	const waveSchedule = new WaveSchedule();
	waveSchedule.setAttribute('StartingCurrency', 400);


	const wave = createBasicWave();
	waveSchedule.addChild(wave);

	return waveSchedule;
}

export function createBasicWave() {
	const wave = new Wave();
	wave.setAttribute('WaitWhenDone', 65);


	const waveSpawn = createBasicWaveSpawn();
	wave.addChild(waveSpawn);

	return wave;
}

export function createBasicWaveSpawn() {
	const waveSpawn = new WaveSpawn();
	waveSpawn.setAttribute('TotalCurrency', 100);
	waveSpawn.setSpawner(createBasicBot());
	return waveSpawn;
}

export function createBasicBot() {
	const bot = new BotSpawner();
	bot.setAttribute('class', 'scout');

	return bot;
}
