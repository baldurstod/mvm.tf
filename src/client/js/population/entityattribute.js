export class EntityAttribute {
	#name;
	#type;
	#value;
	#min;
	#max;
	#list;
	#multiple;
	constructor({ name, type = 'string', value, min, max, list, multiple = false } = {}) {
		this.#name = name;
		this.#type = type;
		this.#min = min;
		this.#max = max;
		this.#list = list;
		this.#multiple = multiple;

		if (multiple) {
			this.#value = new Set();
		} else {
			this.#value = value;
		}
	}

	clear() {
		if (this.#multiple) {
			this.#value.clear();
		} else {
			this.#value = undefined;
		}
	}

	setValue(value) {
		if (this.#multiple) {
			this.#value.add(value);
		} else {
			this.#value = value;
		}
	}

	removeValue(value) {
		if (this.#multiple) {
			this.#value.delete(value);
		} else {
			this.#value = undefined;
		}
	}
}
