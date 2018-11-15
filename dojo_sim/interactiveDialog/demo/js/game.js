
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0,
		savings : 0,
		dojoSkillLevel : 0
	},

	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	//if (!me.video.init("screen", 480, 320, true)) {

	// if (!me.video.init("screen", 800, 600, true)) {
	// 	alert("Your browser does not support HTML5 canvas.");
	// 	return;
	// }

	if (!me.video.init(800, 600, {wrapper : "screen", scale : "auto"})) {
			alert("Your browser does not support HTML5 canvas.");
			return;
	}


	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(debugPanel, "debug");
		});
	}

	// Plugin: AStar pathfinding
	me.plugin.register(me.astar, "aStarPlugin");

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		me.debug.renderHitBox = true;
		// note: When using the debug Panel, the sprite border is drawn in green,

		// load the texture atlas file
		// this will be used by object entities later
		game.texture = new me.video.renderer.Texture(
				me.loader.getJSON("UI_Assets"),
				me.loader.getImage("UI_Assets")
		);

		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// add our player entity in the entity pool
 		// me.entityPool.add("hero", game.HeroEntity);
 		// me.entityPool.add("girl", game.GirlEntity);

		// register our objects entity in the object pool
		me.pool.register("hero", game.HeroEntity);
		me.pool.register("girl", game.GirlEntity);
		me.pool.register("oldman", game.OldManEntity);
		me.pool.register("student", game.StudentEntity);
		me.pool.register("exit", game.ExitEntity);
		me.pool.register("spawn", game.SpawnEntity);
		me.pool.register("chaser", game.ChaserEntity);

		// User interface components
		me.pool.register("UIContainer", game.UI.Container);
		me.pool.register("UICheckBox", game.UI.CheckBoxUI);
		me.pool.register("UIButton", game.UI.ButtonUI);
		me.pool.register("UITextBox", game.UI.TextUI);

		// Start the game.
		//me.state.change(me.state.PLAY);

		// testing the end state/ gameover screens
		//me.state.set(me.state.MENU, new MenuScreen());

		// go to the menu, then start play 
		me.state.change(me.state.MENU);

	}
};
