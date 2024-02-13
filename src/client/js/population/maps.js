import { createElement } from 'harmony-ui';

const mapList = new Map();

import maps from '../../json/datas/maps.json';

const htmlMapList = createElement('datalist', {
	id: 'mvm-map-datalist',
	parent: document.head,
});

export function addMaps(maps) {
	for (const map of maps) {
		addMap(map);
	}
}

export function addMap(map) {
	mapList.set(map.name, map);
	createElement('option', {
		parent: htmlMapList,
		innerText: map.name,
		value: map.name,
	});
}

export function getMap(name) {
	return mapList.get(name);
}

addMaps(maps);
