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

		var dojoSkillPanel = new game.UI.TextUI(
				30, 75, (width * 0.7),50,
				"Dojo Skill: "+this.studentManager.dojoSkillLevel
		);
		dojoSkillPanel.name = "dojoSkillPanel";
		panel.addChild(dojoSkillPanel);

		var studentsPanel = new game.UI.TextUI(
				30, 125, (width * 0.7),50,
				"Students:"
		);
		studentsPanel.name = "studentsPanel";
		panel.addChild(studentsPanel);

		var savingsPanel = new game.UI.TextUI(
				30, 175, (width * 0.7),50,
				"Savings: "+this.studentManager.savings
		);
		savingsPanel.name = "savingsPanel";
		panel.addChild(savingsPanel);

		var timePanel = new game.UI.TextUI(
				30, 225, (width * 0.7),50,
				"Time: "+this.studentManager.currentMonth
		);
		timePanel.name = "timePanel";
		panel.addChild(timePanel);

		// add the panel to word (root) container
		me.game.world.addChild(panel, 1);
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	}
});
