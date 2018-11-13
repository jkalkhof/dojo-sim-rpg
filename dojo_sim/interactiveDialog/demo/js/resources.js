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
	 /* JSON Content. */
	 // texturePacker Atlas
	 { name: "UI_Assets",         type: "json",   src: "data/img/UI_Assets.json" },
		
	/* Atlases
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
	 // atlas parsing is BROKEN!  merge tsx into original tmx map!
	// {name: "Ship_A5_tmx", type: "tmx", src: "data/map/Ship_A5_tmx.tmx"},
	// {name: "Ship_C_tmx", type: "tmx", src: "data/map/Ship_C_tmx.tmx"},


	// {name: "Ship_A5_tsx", type: "tsx", src: "data/map/Ship_A5_tsx.tsx"},
	// {name: "Ship_C_tsx", type: "tsx", src: "data/map/Ship_C_tsx.tsx"},

	// {name: "Ship_A5", type: "tps", src: "data/map/Ship_A5.tps"},
	// {name: "Ship_C", type: "tps", src: "data/map/Ship_C.tps"},


	/* Maps */
	 //{name: "town", type: "tmx", src: "data/map/town.tmx"},
	 {name: "dojo-32x32", type: "tmx", src: "data/map/dojo-32x32.tmx"},

	/* Background music.
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/", channel : 1},
	 */

	/* Sound effects.
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/", channel : 2}
	 */
];
