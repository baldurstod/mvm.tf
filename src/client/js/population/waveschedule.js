import {Entity} from './entity.js';
import { Wave } from './wave.js';
import { WaveSpawn } from './wavespawn.js';

import waveschedule from '../../json/attributes/waveschedule.json';

export class WaveSchedule extends Entity {
	constructor() {
		super();
		this.setAttributes(waveschedule);
		this.isWaveSchedule = true;
	}

	reset() {
		this.base.clear();
		this.base.add('robot_standard.pop');
		this.base.add('robot_giant.pop');
		this.base.add('robot_gatebot.pop');

		this._navigationTags.clear();
		this._where.clear();
		this._startingPathTrackNode.clear();
	}

	addNewWave() {
		const wave = new Wave();
		const waveSpawn = new WaveSpawn();
		wave.addChild(waveSpawn);
		this.addChild(wave);
	}

	addBase(base) {
		this.base.add(base);
	}

	get navigationTags() {
		return this._navigationTags;
	}

	get where() {
		return this._where;
	}

	get startingPathTrackNode() {
		return this._startingPathTrackNode;
	}

	set startingPathTrackNode(startingPathTrackNode) {
		startingPathTrackNode = startingPathTrackNode.toLowerCase();
		if (!this._startingPathTrackNode.has(startingPathTrackNode)) {
			this._startingPathTrackNode.add(startingPathTrackNode);
		}
	}

}
