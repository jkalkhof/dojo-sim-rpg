game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		//me.levelDirector.loadLevel("town");
		me.levelDirector.loadLevel("dojo-32x32");

		// change the default sort property
		//me.game.world.sortOn = "y";

		// add StudentManager to create students
		this.studentManager = new game.StudentManager();
		//this.studentManager.createEnemies();
		this.studentManager.spawnStudent();
		this.studentManager.name = "studentManager"; // lookup by name later...
		me.game.world.addChild(this.studentManager, 2);

		// clear the background
		me.game.world.addChild(new me.ColorLayer("background", "rgba(248, 194, 40, 255)"), 0);


		// add the UI elements

		// center box on the screen!
		//let width = 450;
		let width = (me.game.viewport.getWidth()*0.25);
		let height = 325;
		//let xpos = (me.game.viewport.getWidth()/2) + (width/2);
		let xpos = (me.game.viewport.getWidth()*0.75);
		let ypos = (me.game.viewport.getHeight()/2) - (height/2);
		console.log("PlayScreen: UIContainer: pos: ",xpos, ypos);

		var panel = new game.UI.Container(xpos, ypos, width, height, "Dojo Sim");

		// add a few checkbox
		panel.addChild(new game.UI.CheckBoxUI(
				50, 75,
				game.texture,
				"green_boxCheckmark",
				"grey_boxCheckmark",
				"Music ON", // default
				"Music OFF"
		));

		panel.addChild(new game.UI.CheckBoxUI(
				50, 125,
				game.texture,
				"green_boxCheckmark",
				"grey_boxCheckmark",
				"Sound FX ON", // default
				"Sound FX OFF"
		));

		// a few buttons
		panel.addChild(new game.UI.ButtonUI(
				50, 175,
				"blue",
				"Video Options"
		));

		panel.addChild(new game.UI.ButtonUI(
				30, 250,
				"green",
				"Accept"
		));

		// panel.addChild(new game.UI.ButtonUI(
		// 		230, 250,
		// 		"yellow",
		// 		"Cancel"
		// ));

		// add the panel to word (root) container
		me.game.world.addChild(panel, 1);
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	}
});
