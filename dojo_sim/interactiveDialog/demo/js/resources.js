game.resources = [

	 /* images */
	 {name: "girl", type:"image", src: "data/img/girl.png"},
	 {name: "boy", type:"image", src: "data/img/boy.png"},
	 {name: "boys_martial_arts", type:"image", src: "data/img/boys_martial_arts.png"},

	 {name: "TileA2", type:"image", src: "data/map/tileset/TileA2.png"},
	 {name: "Ship_A5", type:"image", src: "data/map/Ship_A5.png"},
	 {name: "Ship_C", type:"image", src: "data/map/Ship_C.png"},

	 /* Graphics. */
	 // UI Texture
	 { name: "UI_Assets",    type: "image",  src: "data/img/UI_Assets.png" },
	 { name: "grey_panel", type:"image", src: "data/img/PNG/grey_panel.png"},

	 /* JSON Content. */
	 // texturePacker Atlas
	 { name: "UI_Assets",         type: "json",   src: "data/img/UI_Assets.json" },

	/* Atlases
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
	 // atlas parsing is BROKEN!  merge tsx into original tmx map!

	/* Maps */
	 {name: "dojo-32x32", type: "tmx", src: "data/map/dojo-32x32.tmx"},

	 // title screen
	 {name: "storefront800x600", type:"image",	src: "data/img/storefront800x600.png"},

	/* Background music.
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/", channel : 1},
	 */

	 /* Sound effects.
		* @example
		* { name: "example_sfx", type: "audio", src: "data/sfx/" }
		*/
	 {name: "misc_menu", type: "audio", src: "data/sfx/"},
	 {name: "misc_sound", type: "audio", src: "data/sfx/"},
	 {name: "load", type: "audio", src: "data/sfx/"},
	 {name: "save", type: "audio", src: "data/sfx/"},
	 {name: "positive",  type: "audio", src: "data/sfx/"},
	 {name: "negative_2",  type: "audio", src: "data/sfx/"},
	 {name: "sfx_movement_portal1",  type: "audio", src: "data/sfx/"},

];
