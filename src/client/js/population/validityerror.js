export class ValidityError {
	#entity;
	#message;
	#attributeName;
	constructor(entity, message, attributeName) {
		this.#entity = entity;
		this.#message = message;
	}

	getEntity() {
		return this.#entity;
	}

	getMessage() {
		return this.#message;
	}

	getAttributeName() {
		return this.#attributeName;
	}
}
