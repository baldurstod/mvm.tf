import { CLASS_ICONS } from './classicons.js';

import classIconsRemap from '../../../json/datas/classiconsremap.json';

export function getClassIcon(classIcon) {
	classIcon = classIcon?.toLowerCase();
	const remap = classIconsRemap[classIcon];
	return CLASS_ICONS[remap ?? classIcon];
}
