const mapList = new Map();

import maps from '../../json/datas/maps.json';

export function addMaps(maps) {
	for (const map of maps) {
		addMap(map);
	}
}

export function addMap(map) {
	mapList.set(map.name, map);
}

export function getMap(name) {
	return mapList.get(name);
}

addMaps(maps);
