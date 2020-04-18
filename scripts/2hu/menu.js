/*
	MENU
*/

class Menu {
	constructor(e) {
		this.canCall = 1;

		keyboard('Escape').press = () => {
			this.Call();
		};

		this.container = new Container;
		let menu = this.container;
		menu.zIndex = G.zIndex.Menu;
		menu.visible = false;
		stage.addChild(menu);

		menu.button = new Container;
		menu.addChild(menu.button);
		menu.button.interactive = true;
		menu.button.buttonMode = true;

		menu.button.resume = G.DrawText('RESUME', menu.button, G.Fonts.Menu);
		menu.button.resume.y = _h / 1.8;

		menu.button.restart = G.DrawText('RESTART', menu.button, G.Fonts.Menu);
		menu.button.restart.y = menu.button.resume.y + 75;
		menu.button.restart.on('pointerdown', () => {
			G.RestartStage();
		});

		menu.button.start = G.DrawText('HOME', menu.button, G.Fonts.Menu);
		menu.button.start.y = menu.button.restart.y + 75;
		menu.button.start.on('pointerdown', () => {
			G.LoadStage('stageMenu', 0);
		});

		menu.button.setting = G.DrawText('SETTING', menu.button, G.Fonts.Menu);
		menu.button.setting.y = menu.button.start.y + 75;
		menu.setting = new Container;
		menu.addChild(menu.setting);
			menu.setting.visible = false;

			menu.setting.sound = G.DrawText('SOUND', menu.setting, G.Fonts.Menu);
			menu.setting.percent = G.DrawText(G.Volume, menu.setting, G.Fonts.Menu);
			
			const sliderParams =
			{
				bg:
				{
					texture: PIXI.Texture.WHITE,
					anchorX: 0.5,
					anchorY: 1,
					tint: 0x404040,
					width: 32,
					height: 256
				},

				fg:
				{
					texture: PIXI.Texture.WHITE,
					anchorX: 0.5,
					anchorY: 1,
				}
			};

			menu.setting.slider = new Slider(sliderParams).addTo(menu.setting);
			let slider = menu.setting.slider;
			slider.value = G.Volume;
			slider.rotation = Math.Deg2Rad(90);
			slider.on('pointerdown', SliderSetVolume);
			slider.on('pointerup', SliderSetVolume);
			slider.on('pointerupoutside', SliderSetVolume);

			function SliderSetVolume() {
				G.Volume = Math.Round(slider.value, 2);
				localStorage.G_Volume = G.Volume;
			}

			menu.setting.ok = G.DrawText('OK', menu.setting, G.Fonts.Menu);
			
			menu.setting.sound.y = menu.setting.percent.y = menu.button.setting.y;
			slider.y = menu.setting.sound.y + 40;
			

			menu.setting.ok.y = menu.setting.sound.y + 100;
			
			menu.setting.children.forEach(check => {
				check.interactive = true;
				check.buttonMode = true;
				check.x = _w / 2; //1.25
			});

			slider.x = menu.setting.sound.x + 275;
			menu.setting.percent.x = menu.setting.sound.x + 600;

			menu.setting.ok.on('pointerdown', () => {
				this.unSelected();
			});


		menu.button.children.forEach(checkButton => {
			checkButton.interactive = true;
			checkButton.buttonMode = true;
			checkButton.x = _w / 3.1;

			checkButton
				.on('pointerdown', () => {
					G.PlaySound('changeitem', null, null);
					if (checkButton == menu.button.resume) {
						this.Resume();
					}
					if (checkButton == menu.button.setting) {
						menu.setting.visible = true;
						this.Selected();
					}

				})
				.on('pointerup', () => { })
				.on('pointerupoutside', () => { })
				.on('pointerover', () => {
					checkButton.style = G.Fonts.MenuSelected;
					G.PlaySound('item00', null, null);
				})
				.on('pointerout', () => {
					checkButton.style = G.Fonts.Menu;
				});
		});

		menu.logo = new Sprite(resources.logo.texture);
		menu.logo.x = _w / 2;
		menu.logo.y = _h / 2.5;
		menu.logo.anchor.set(0.5);
		menu.addChild(menu.logo);


	}

	Call() {
		if(!this.canCall) return;

		if (!this.active) {
			this.Pause();
		} else {
			this.Resume();
		}
	}

	Resume() {
		this.container.visible = false;
		G.Timescale = 0;
		this.active = 0;
	}

	Pause() {
		this.container.visible = true;
		G.Timescale = 0.000000001;
		this.active = 1;
	}

	Selected() {
		this.container.button.children.forEach(checkButton => {
			checkButton.style = G.Fonts.MenuSelected;
			checkButton.interactive = false;
		});
	}
	unSelected() {
		this.container.button.children.forEach(checkButton => {
			checkButton.style = G.Fonts.Menu;
			checkButton.interactive = true;
		});
		this.container.setting.visible = false;
	}

	Update(delta) {
		let menu = this.container;
		menu.setting.percent.text = Math.Round(menu.setting.slider.value, 2);
	}
}