Stage = new Container;
stage.addChild(Stage);

Stage.Init = function () {
	//G.SetResolution(1920, 979);
	G.SetResolution(window.innerWidth, window.innerHeight);


	G.UI.Init();

	Debug.Grid(16, 1, 0xff0909, 0.2, Stage);
	Debug.Grid(32, 1, 0x0909ff, 0.5, Stage);
	Debug.Rect(G.Screenborder, G.Screenborder, _w - G.Screenborder * 2, _h - G.Screenborder * 2, 0x09ff09, 1, 0.5, null, Stage);

  Stage.canUpdate = 1;
  

  menu = new Container;
  menu.zIndex = G.zIndex.Menu;
  Stage.addChild(menu);

  menu.logo = new Sprite(resources.logo.texture);
  menu.logo.x = _w / 2;
  menu.logo.y = _h / 2.5;
  menu.logo.anchor.set(0.5);
  menu.addChild(menu.logo);

  menu.button = new Container;
  menu.addChild(menu.button);
  menu.button.interactive = true;
  menu.button.buttonMode = true;

  menu.button.start = G.DrawText('START', menu.button, G.Fonts.Menu);
  menu.button.start.y = _h / 1.8;
  menu.button.start.on('pointerdown', () => {
    G.LoadStage('stage2', 1);
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
    menu.button.children.forEach(checkButton => {
      checkButton.style = G.Fonts.Menu;
      checkButton.interactive = true;
    });
    menu.setting.visible = false;
  });


  menu.button.children.forEach(checkButton => {
    checkButton.interactive = true;
    checkButton.buttonMode = true;
    checkButton.x = _w / 2.825; // Для всех кнопок

    checkButton
      .on('pointerdown', () => {
        G.PlaySound('changeitem', null, null);
        if (checkButton == menu.button.setting) {
          menu.setting.visible = true;
          menu.button.children.forEach(checkButton => {
            checkButton.style = G.Fonts.MenuSelected;
            checkButton.interactive = false;
          });
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


}

Stage.Update = function (delta) {
	if (G.Menu.canCall) G.Menu.canCall = 0;
    menu.setting.percent.text = Math.Round(menu.setting.slider.value, 2);
}