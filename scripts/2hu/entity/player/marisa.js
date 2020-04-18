/*
	MARISA PLAYER ENTITY
*/

class PlayerMarisa extends Player {
	constructor(type, keyscheme) {
		super(1, keyscheme);
		this.speedDefault = 10;
		this.speedFocused = 5;
	}

	Shoot() {
		if (!this.shootingCooldown) {

		}
		super.Shoot();
	}
}
