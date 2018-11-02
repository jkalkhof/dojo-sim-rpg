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
		this.studentManager.createEnemies();
		me.game.world.addChild(this.studentManager, 2);
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	}
});
