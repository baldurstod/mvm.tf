export class ItemTemplate {
	#definition;
	constructor(definition) {
		this.#definition = definition;
	}

	get name() {
		return this.#definition.name;
	}

	getModel(npc) {
		function convertDemo(npc) {
			if (npc == 'demoman') {
				return 'demo';
			} else {
				return npc;
			}
		}
		npc = npc.replace(/bot_/, '');

		let modelPlayerPerClass = this.#definition.model_player_per_class;

		if (modelPlayerPerClass) {
			if (modelPlayerPerClass[npc]) {
				return modelPlayerPerClass[npc];
			}

			let basename = modelPlayerPerClass['basename'];
			if (basename) {
				let usedByClasses = this.#definition.used_by_classes;
				if (usedByClasses) {
					if (usedByClasses[npc] == 1) {
						return basename.replace(/%s/g, convertDemo(npc));
					} else {
						let arr = Object.keys(usedByClasses);
						if (arr.length > 0) {
							return basename.replace(/%s/g, convertDemo(arr[0]));
						}
					}
				}
			}
		}

		let modelPlayer = this.#definition.model_player;
		if (modelPlayer) {
			return modelPlayer;
		}

		let customTauntPropPerClass = this.#definition.custom_taunt_prop_per_class;
		if (customTauntPropPerClass?.[npc]) {
			return customTauntPropPerClass[npc];
		}

		// Look for the first model_player_per_class
		if (modelPlayerPerClass) {
			let arr = Object.keys(modelPlayerPerClass);
			if (arr.length > 0) {
				return modelPlayerPerClass[arr[0]];
			}
		}
		return null;
	}

	getModelBlue(npc) {
		let modelPlayerPerClassBlue = this.#definition.model_player_per_class_blue;

		if (modelPlayerPerClassBlue) {
			return modelPlayerPerClassBlue[npc];
		}
	}

	getUsedByClass(className) {
		return this.#definition?.used_by_classes?.[className] == 1;
	}

	get imageInventory() {
		return this.#definition.image_inventory;
	}

	get name() {
		return this.#definition.name;
	}

	get id() {
		return this.#definition.id;
	}

	get redSkin() {
		let skinRed = this.#definition.skin_red;
		return isNaN(skinRed) ? 0 : Number(skinRed);
	}

	get bluSkin() {
		let skinBlu = this.#definition.skin_blu;
		return isNaN(skinBlu) ? 1 : Number(skinBlu);
	}

	get playerBodygroups() {
		return this.#definition.player_bodygroups;
	}

	get wmBodygroupOverride() {
		return this.#definition.wm_bodygroup_override;
	}

	get usePerClassBodygroups() {
		return this.#definition.use_per_class_bodygroups;
	}

	get extraWearable() {
		return this.#definition.extra_wearable;
	}

	get attachedModels() {
		return this.#definition.attached_models;
	}

	get animSlot() {
		return this.#definition.anim_slot;
	}

	getItemSlot(npc) {
		let usedByClasses = this.#definition.used_by_classes;
		if (usedByClasses) {
			let usedByClass = usedByClasses[npc];
			if (usedByClass == 'primary' || usedByClass == 'secondary') {
				return usedByClass;
			}
		}
		return this.#definition.item_slot;
	}

	get attachedModelsFestive() {
		return this.#definition.attached_models_festive;
	}

	get weaponUsesStattrakModule() {
		return this.#definition.weapon_uses_stattrak_module;
	}

	get weaponStattrakModuleScale() {
		return this.#definition.weapon_stattrak_module_scale;
	}

	get particleSuffix() {
		return this.#definition.particle_suffix;
	}

	get repository() {
		return this.#definition.repository;
	}

	get repository() {
		return this.#definition.repository;
	}

	get equipRegions() {
		return this.#definition.equip_regions;
	}

	get setItemTintRGB() {
		return this.#definition.set_item_tint_rgb;
	}

	get setItemTintRGB2() {
		return this.#definition.set_item_tint_rgb_2 ?? this.#definition.set_item_tint_rgb;
	}

	get setAttachedParticleStatic() {
		if (this.#definition.use_smoke_particle_effect == "0") {
			return null;
		}

		return this.#definition.set_attached_particle_static;
	}

	get attachedParticlesystems() {
		return this.#definition.attached_particlesystems;
	}

	get customTauntScenePerClass() {
		return this.#definition.custom_taunt_scene_per_class;
	}

	get customTauntOutroScenePerClass() {
		return this.#definition.custom_taunt_outro_scene_per_class;
	}

	get customTauntPropScenePerClass() {
		return this.#definition.custom_taunt_prop_scene_per_class;
	}

	get customTauntPropOutroScenePerClass() {
		return this.#definition.custom_taunt_prop_outro_scene_per_class;
	}

	get tauntAttackName() {
		return this.#definition.taunt_attack_name;
	}

	get tauntSuccessSoundLoop() {
		return this.#definition.taunt_success_sound_loop;
	}

	get tauntSuccessSoundLoopOffset() {
		return this.#definition.taunt_success_sound_loop_offset;
	}

	get materialOverride() {
		return this.#definition.material_override;
	}
}
