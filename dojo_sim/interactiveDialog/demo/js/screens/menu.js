/** menu **/
var MenuButton = me.GUI_Object.extend({
    onResetEvent: function() {
      console.log("MenuButton: onResetEvent");
    },

    "onClick" : function () {
        console.log("MenuButton: onClick");
				// Change to the PLAY state when the button is clicked
        me.state.change(me.state.PLAY);
        return true;
    }
});

var MenuScreen = me.ScreenObject.extend({
		addPanelSprite : function() {
			// me.Renderable -> me.Sprite
			// back panel sprite
			this.panelSprite = game.texture.createSpriteFromName("grey_panel");
			this.panelSprite.anchorPoint.set(0, 0);
			//this.panelSprite.anchorPoint.set(100, 100);

			// scale to match the container size
			var xScale = me.game.viewport.getWidth()/ this.panelSprite.width;
			var yScale = me.game.viewport.getHeight() / this.panelSprite.height;
			this.panelSprite.scale(xScale, yScale);

			this.panelSprite.pos.x = 75;
			this.panelSprite.pos.y = 25;

			console.log("MenuScreen: panelSprite: scale: ", xScale, yScale);
			console.log("MenuScreen: panelSprite: position: ", this.panelSprite.pos.x, this.panelSprite.pos.y);
			console.log("MenuScreen: panelSprite: size: ", this.panelSprite.width, this.panelSprite.height);

      // me.game.world.addChild(this.panelSprite, 0);
		},

		addMenuImage : function() {
			// https://www.javascripture.com/HTMLImageElement
			//var menuImage = me.loader.getImage("forest");
			var menuImage = me.loader.getImage("grey_panel");

			// 800x600
			console.log("MenuScreen: viewport: ",me.game.viewport.getWidth(), me.game.viewport.getHeight());

			// 100x100
			console.log("MenuScreen: menuImage: ", menuImage.width, menuImage.height);

			//menuImage.resizeImage(me.game.viewport.getWidth(), me.game.viewport.getHeight());

			// me.Object -> me.Polygon -> me.Rect ->
			//    me.Renderable -> me.ImageLayer
			var menuImageLayer = new me.ImageLayer(0, 0, {
					image : menuImage,
					z: 0 // z-index
			});

			// Load background image
			// me.container -> me.game.world
			me.game.world.addChild(
				menuImageLayer, // me.Renderable
				0
			);
		},

		addTextArea : function() {

      var textArea = new (me.Renderable.extend ({
          // constructor
          init : function() {
              console.log("TitleScreen: onResetEvent: Renderable: init");

              this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

              this.debugLevel = 1;

							this.floating = true;

              this.panelWidth = me.game.viewport.width *.8;
              this.panelHeight = me.game.viewport.height *.8;

              this.anchorPoint.set(0, 0);

              // a default white color object
              this.color = me.pool.pull("me.Color", 255, 255, 255);

              // font for the scrolling text
              //this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
              //this.font = new me.Font("kenpixel", 50, "black");
              //this.font = new me.Font("Verdana", 15, "black");
              // arial font
              this.font = new me.Font("Arial", 24, this.color);
              // this.font.setFont("Arial", 16, "white");

              // this.font.setOpacity(1);
              this.font.textAlign = "center";
              // this.font.textBaseline = "top";
              // this.font.bold();

              // TODO: check if win or lose condition from game data?
              if (game.data.savings >= 0) {
                  this.synopsisText = 'Congratulations!  You achieved all of the mission objectives.';
              } else {
                  this.synopsisText = 'Oh no!  You ran out of money and your dojo was closed.';
              }


          },

          draw : function (renderer) {
              // console.log("TitleScreen: onResetEvent: Renderable: draw");
              //this.font.draw(renderer, this.synopsisText, me.game.viewport.width/2, me.game.viewport.height/2);

              //console.log("TextUI: labelText: draw: ",this.pos.x, this.pos.y, this.width, this.height);
              if (this.debugLevel > 1) console.log("TextUI: labelText: draw: ",this.pos.x, this.pos.y, this.panelWidth, this.panelHeight);

              let textMeasure = this.font.measureText(renderer, "x");
              if (this.debugLevel > 1) console.log("TextUI: labelText: draw: textMeasure: ", textMeasure.width, textMeasure.height);

              // 10x20 per character
              let charactersPerLine = this.panelWidth / textMeasure.width;
              let linesPerPanel = this.panelHeight / textMeasure.height;

              let charactersToRender = this.synopsisText.length;
              let linesToRender = charactersToRender / linesPerPanel;

              var i;
              var currentLineIndex = 0;
              for (i = 0; i < charactersToRender; i+= charactersPerLine) {
                  let charactersLeft = charactersToRender - (currentLineIndex * charactersPerLine);
                  let charactersThisLine = Math.min(charactersPerLine, charactersLeft);
                  let strToRender = this.synopsisText.substring(i, i + charactersThisLine);

                  this.font.draw (
                      renderer,
                      strToRender, // label
                      me.game.viewport.width/2,
                      me.game.viewport.height*.4  + (currentLineIndex * textMeasure.height));
                      //me.game.viewport.height/2 + (currentLineIndex * textMeasure.height));

                  currentLineIndex += 1;
              }


              // this.font.textAlign = "center";
              //this.font.draw(renderer, "PRESS ENTER TO PLAY", me.game.viewport.width/2, me.game.viewport.height*.9);

          },

          onDestroyEvent : function() {
              console.log("TitleScreen: onResetEvent: Renderable: onDestroyEvent");
          }
      }));

      // add a new renderable component with the scrolling text
      me.game.world.addChild(textArea, 2);

    },

    onResetEvent: function() {
        console.log("MenuScreen: onResetEvent");

				var backgroundImage = new me.Sprite(0, 0, {
							 //image: me.loader.getImage('title_screen'),
							 image: me.loader.getImage('storefront800x600'),
						}
				);

				// position and scale to fit with the viewport size
				backgroundImage.anchorPoint.set(0, 0);
				backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);

				// otherwise, the player offset the viewport to a different position and bg image will be off-screen!
				backgroundImage.floating = true;

				// add to the world container
				me.game.world.addChild(backgroundImage, 0);

				this.addTextArea();

				// buttons don't work when uicontainer in flaot mode!
				let buttonWidth = 190; // me.game.viewport.width * .1; //100;
				let buttonHeight = 49; //me.game.viewport.height * .1; //50;

        // old UIButton
        // (x, y, color, label)
        var uiButton = me.pool.pull("UIButton",
						me.game.viewport.width/2 - (buttonWidth/2),
						me.game.viewport.height * .8,
	          "green",
	          "Restart"
        );

        // new uiButton
        // (x, y, width, height, color, label, clickCallback)
				// var uiButton = me.pool.pull("UIButton",
				// 		me.game.viewport.width/2 - (buttonWidth/2),
				// 		me.game.viewport.height * .8,
				// 		buttonWidth, // getWidth
				// 		buttonHeight, // height
	      //     "green",
	      //     "Restart",
	      //     this.onClick.bind(this)
	      // );
				uiButton.floating = true;

	      me.game.world.addChild(uiButton);

        // Play music
        // me.audio.playTrack("menu");
    },

    "onClick" : function () {
        console.log("MenuScreen: onClick");

        // Change to the PLAY state when the button is clicked
        me.state.change(me.state.PLAY);
        return true;
    },

    "onDestroyEvent" : function () {
      console.log("MenuScreen: onDestroyEvent");

        // Stop music
        // me.audio.stopTrack();
    }
});
