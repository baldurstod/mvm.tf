const DEFAULT_VALUE_FOR_TYPE = {
	integer: 0,
	string: '',
}

export class EntityAttribute {
	#name;
	#type;
	#value;
	#min;
	#max;
	#list;
	#multiple;
	#default;
	constructor({ name, type = 'string', default: value, min, max, list, multiple = false } = {}) {
		this.#name = name;
		this.#type = type;
		this.#min = min;
		this.#max = max;
		this.#list = list;
		this.#multiple = multiple;
		this.#default = value;

		if (value === undefined) {
			value = DEFAULT_VALUE_FOR_TYPE[type];
		}

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

	getName() {
		return this.#name;
	}

	getValue() {
		return this.#value;
	}

	getDefault() {
		return this.#default;
	}

	isMultiple() {
		return this.#multiple;
	}

	removeValue(value) {
		if (this.#multiple) {
			this.#value.delete(value);
		} else {
			this.#value = undefined;
		}
	}
}
