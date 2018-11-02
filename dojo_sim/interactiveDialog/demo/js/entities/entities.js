//game.BaseEntity = me.ObjectEntity.extend({
game.BaseEntity = me.Entity.extend({
	/**
     * Set direction
 	 * @private
 	 * @param {number} dx
 	 * @param {number} dy
     */
    _setDirection:function( dx, dy ){
    	if( Math.abs( dx ) > Math.abs( dy ) ){
    		this.direction = ( dx > 0) ? "right" : "left";
    	}else{
    		this.direction = ( dy > 0) ? "down" : "up";
    	}
      if (this.debugLevel > 1) console.log("_setDirection: ", this.direction);
    },

    /**
     * Calculate step for every update
 	 * @private
     */
    _calculateStep: function(dt){

    	if( this._target ){
        // calculate distance using this.posy
        // this.body.pos.x is invalid
    		var dx = this._target.x - this.pos.x;
    		var dy = this._target.y - this.pos.y;


    		// if(Math.abs(dx) < this.maxVel.x
        // 	&& Math.abs(dy) < this.maxVel.x){
        // 		delete this._target;
        // 		return;
        // 	}

        if(Math.abs(dx) < this.body.maxVel.x
        	&& Math.abs(dy) < this.body.maxVel.y){
            if (this.debugLevel > 1) console.log("_calculateStep(",this.name,"): reached target - dx: ",
              Number(dx).toFixed(2), " dy: ", Number(dy).toFixed(2));
        		delete this._target;
        		return;
      	}

    		var angle = Math.atan2(dy, dx);
        // var velocityX = Math.cos(angle) * this.body.accel.x * dt;
        // var velocityY = Math.sin(angle) * this.body.accel.y * dt;
        var velocityX = Math.cos(angle) * 3.0 * me.timer.tick;
        var velocityY = Math.sin(angle) * 3.0 * me.timer.tick;

        // setVelocity doesn't immediately effect body.vel???
        // this.body.setVelocity(velocityX, velocityY);

        this.body.vel.x = velocityX;
        this.body.vel.y = velocityY;

        // console.log("_calculateStep: ",this.body.vel.x, this.body.vel.y);
        //if ((Math.abs(velocityX) > 0.01) || (Math.abs(velocityY) > 0.01)) {
        if ((Math.abs(this.body.vel.x) > 0.01) || (Math.abs(this.body.vel.y) > 0.01)) {
            if (this.debugLevel > 1) console.log("_calculateStep(",this.name,"): velocity: ",Number(this.body.vel.x).toFixed(2), Number(this.body.vel.y).toFixed(2));
            //debugger;
        } else {
            // this.body.vel.x = 0;
        		// this.body.vel.y = 0;
            // this.body.setVelocity(0,0);
            console.log("_calculateStep: delete target");
          	delete this._target;
        }


    	}else{
    		this.body.vel.x = 0;
    		this.body.vel.y = 0;
        this.body.setVelocity(0,0);
    	}
    },

     /**
    * set a random target position
    */
    _setRandomTargetPosition:function(){

    	  if(!this._targetIsSet){
        	this._targetIsSet = true;

        	var min = 500;
        	var max = 3000;
        	var waitFor = Math.random() * (max - min) + min;

        	// wait from min to max before next step
        	window.setTimeout(function(){
        		this._target = {};

      			// this._target.x = Number(0).random(this.minX, this.maxX);
      			// this._target.y = Number(0).random(this.minY, this.maxY);
            this._target.x = me.Math.random(this.minX, this.maxX);
            this._target.y = me.Math.random(this.minY, this.maxY);

      			this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition(timeout): direction: ", this.direction);
      			this.renderable.setCurrentAnimation( this.direction );

            this.body.setVelocity(3,3);
            this.body.falling = false;

            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: body.falling: ", this.body.falling);
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: body.vel: ", Number(this.body.vel.x).toFixed(2), Number(this.body.vel.y).toFixed(2));
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: body.accel: ", Number(this.body.accel.x).toFixed(2), Number(this.body.accel.y).toFixed(2));
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: body.pos: ", Number(this.body.pos.x).toFixed(2), Number(this.body.pos.y).toFixed(2));
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: pos: ", Number(this.pos.x).toFixed(2), Number(this.pos.y).toFixed(2));
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: target: ", Number(this._target.x).toFixed(2), Number(this._target.y).toFixed(2));
            if (this.debugLevel > 1) console.log("_setRandomTargetPosition: ", this.direction);

				    delete this._targetIsSet;
        	}.bind(this), waitFor);
        }
    },

    /**
   * set a target position
     vector2d pos
     me.Entity->me.Renderable->me.Rect->me.Polygon.pos
   */
   _setTargetPosition:function(pos){

       if(!this._targetIsSet){
         this._targetIsSet = true;

         this._target = {};

         // this._target.x = Number(0).random(this.minX, this.maxX);
         // this._target.y = Number(0).random(this.minY, this.maxY);
         this._target.x = pos.x;
         this._target.y = pos.y

         this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);
         if (this.debugLevel > 0) console.log("_setTargetPosition: direction: ", this.direction);
         this.renderable.setCurrentAnimation( this.direction );

         // this.body.setVelocity(3,3);
         this.body.setVelocity(1,1);
         this.body.falling = false;

         if (this.debugLevel > 1) console.log("_setTargetPosition: body.falling: ", this.body.falling);
         if (this.debugLevel > 1) console.log("_setTargetPosition: body.vel: ", Number(this.body.vel.x).toFixed(2), Number(this.body.vel.y).toFixed(2));
         if (this.debugLevel > 1) console.log("_setTargetPosition: body.accel: ", Number(this.body.accel.x).toFixed(2), Number(this.body.accel.y).toFixed(2));
         if (this.debugLevel > 1) console.log("_setTargetPosition: body.pos: ", Number(this.body.pos.x).toFixed(2), Number(this.body.pos.y).toFixed(2));
         if (this.debugLevel > 0) console.log("_setTargetPosition: pos: ", Number(this.pos.x).toFixed(2), Number(this.pos.y).toFixed(2));
         if (this.debugLevel > 0) console.log("_setTargetPosition: target: ", Number(this._target.x).toFixed(2), Number(this._target.y).toFixed(2));
         if (this.debugLevel > 1) console.log("_setTargetPosition: ", this.direction);

         delete this._targetIsSet;

       }
   },

     /**
	 * default on collision handler
	 */
    onCollision : function (res, obj){

      // collide with enemy_object (girl) and start dialouge
      //if (res && (obj.type == me.game.ENEMY_OBJECT)) {
      //if (res && (obj.type == me.collision.types.ENEMY_OBJECT)) {
      if (res.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
        //if (res.a.name == "girl") {
        if ((res.a.name == "hero") && (res.b.name == "girl")) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          delete this._target;

          // start conversation with girl entity
          //this.doTalk( res.a );
          if (!res.b.isTalking) {
            this.doTalk( res.b );
          }
        } else if ((res.a.name == "hero") && (res.b.name == "oldman")) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          delete this._target;

          // start conversation with girl entity
          //this.doTalk( res.a );
          if (!res.b.isTalking) {
            this.doTalk( res.b );
            //this.doTalk( "student" );
          }
        } else if ((res.a.name == "hero") && (res.b.name == "student")) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          delete this._target;

          // start conversation with girl entity
          //this.doTalk( res.a );
          if (!res.b.isTalking) {
            this.doTalk( res.b );
            // this.doTalk( "student" );
          }

        } else if ((res.a.name == "student") && (res.b.name == "exit")) {
          if (this.debugLevel > 0) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          delete this._target;

          // remove it - student leaves through exit
          me.game.world.removeChild(this);
        }

      }

      //if (res && obj.type == me.game.WORLD_SHAPE) {
      //if (res && obj.type == me.collision.types.WORLD_SHAPE) {
      if (res.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
        if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

        // debugger;

        delete this._target;
    	// 	this.pos.x -= res.x;
    	// 	this.pos.y -= res.y;
      //
      //   delete this._target;

      	// this._setDirection( -res.x, -res.y );
      	// this.renderable.setCurrentAnimation( this.direction );
      }
    },

    /**
     * Start conversation
     * @param {Object} entity
     */
    doTalk:function( entity ){
      console.log("doTalk: ", entity.name);

      if (entity.name == "girl") {
        entity.isTalking = true;
      	this.talkWith = entity;
      	entity.dialog.show();
      } else if (entity.name == "oldman") {
        entity.isTalking = true;
      	this.talkWith = entity;
      	entity.dialog.show();
      } else if (entity.name == "student") {
        entity.isTalking = true;
      	this.talkWith = entity;
      	entity.dialog.show();
      }
    },

    onDialogReset:function(){
      console.log("onDialogReset: ", this.name);

      // check student conversation saved value
      if (this.name == "student") {
        console.log("onDialogReset: ", this.name, " dialog.testrandom: ", this.dialog.testrandom);
        console.log("onDialogReset: ", this.name, " dialog.signedup: ", this.dialog.signedup);
        console.log("onDialogReset: ", this.name, " dialog.turnedaway: ", this.dialog.turnedaway);

        if (this.dialog.turnedaway) {
            //this.currentState = this.StateEnum.moving;
            this.currentState = this.StateEnum.leaving;

            // get position from game.StudentManager.exitChild .pos.x , pos.y
            game.ExitEntity = me.game.world.getChildByName("exit")[0];
            var exitPos = game.ExitEntity.pos;

            this._setTargetPosition(exitPos);

            this.isTalking = false;
        }
      }

    	// wait for 2 sec - let the hero go away
    	var waitFor = 2000;
    	window.setTimeout(function(){
    		//delete this.isTalking;
        this.isTalking = false;
        console.log("onDialogReset: ", this.name, " isTalking: ", this.isTalking);
    	}.bind(this), waitFor);
    },

    onDialogShow:function( event ){
    	if(event.sentence.isChoice){
    		return;
    	}

    	// create sound icon
    	var icon = document.createElement( "i" );
    	icon.setAttribute( "class", "glyphicon glyphicon-volume-up");
    	icon.addEventListener( me.device.touch ? "touchstart" : "mousedown", function( e ) {
      		e.preventDefault();
      		e.stopPropagation();
  			console.log("play sound: " + event.sentence.dialogueText);
  		}.bind( this ), false );

    	var paragraph = event.DOM.querySelector("p");
    	paragraph.appendChild( icon );
    },
});

game.HeroEntity = game.BaseEntity.extend({

    init: function(x, y, settings) {

        // 576x384px 12x8 sprites
        // width = 562px/12sprites = 47
        // height = 384px/8sprites = 48

      	//settings.spritewidth = 47;
        // settings.spritewidth = 48;
      	// settings.spriteheight = 48;
        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 48;
        settings.frameheight = settings.height = 48;

        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.gravity = 0;

        this.debugLevel = 1;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.force.set(0, 0);
        this.body.setVelocity(3,3);
        //this.body.setVelocity(0,0);

        this.body.setMaxVelocity(3, 3);
        this.body.setFriction(0.4,0.4);

        this.collidable = true;
        //this.collisionMask = me.collision.types.ALL_OBJECT;
        this.collisionMask = me.collision.types.WORLD_SHAPE;

        var texture =  new me.video.renderer.Texture(
            //{ framewidth: 47, frameheight: 48 },
            { framewidth: 48, frameheight: 48 },
            me.loader.getImage("boys_martial_arts")
        );

        // create a new sprite object
        // this.renderable = texture.createAnimationFromName([0, 1, 2,
        //   12,13,14,
        //   24,25,26,
        //   36,37,38]);

          this.renderable = texture.createAnimationFromName([
            0,1,2,3,4,5,6,7,8,9,10,11,
            12,13,14,15,16,17,18,19,20,21,22,23,
            24,25,26,27,28,29,30,31,32,33,34,35,
            36,37,38,39,40,41,42,43,44,45,46,47]);

        // this.renderable.addAnimation("down", [0,1,2]);
        // this.renderable.addAnimation("left", [3,4,5]);
        // this.renderable.addAnimation("right", [6,7,8]);
        // this.renderable.addAnimation("up", [9,10,11]);


        // 0..11
        this.renderable.addAnimation("down", [0,1,2]);
        // 12..23
        this.renderable.addAnimation("left", [12,13,14]);
        // 24..35
        this.renderable.addAnimation("right", [24,25,26]);
        // 36..47
        this.renderable.addAnimation("up", [36,37,38]);
        // debugger;

        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;
        // this.isKinematic = true;

        // change sprite anchor point
        // this.renderable.anchorPoint.set(0.5, 0.5);

        // set the renderable position to bottom center
        // this.anchorPoint.set(0.5, 0.5);
        this.anchorPoint.set(0,0);
        this.renderable.anchorPoint.set(0,0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.direction = "down";

		    //has to bee release
        // https://melonjs.github.io/melonJS/docs/me.input.html#registerPointerEvent
        // me.input.registerPointerEvent('mousedown', me.game.viewport, this.onMouseDown.bind(this));
        me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this));
    },

    //update: function() {
    update: function(dt) {
        this._calculateStep(dt);

        // check & update player movement
        // this.updateMovement();
        // this.body.update(dt);


        // check for collision - why isn't there collision with colliders on map??
        // var res =  me.game.world.collide(this);
        // if (res) {
        //   debugger;
        //   if (res.obj.type == me.game.WORLD_SHAPE) {
        //     delete this._target;
        // 		this.pos.x -= res.x;
        // 		this.pos.y -= res.y;
        //   }
        // }



        // update animation if necessary
        // if (this.vel.x!=0 || this.vel.y!=0) {
        //     // update object animation
        //     this.parent();
        //     return true;
        // }

        // if (this.body.vel.x != 0 || this.body.vel.y !=0) {
        //   // this.body.update(dt);
        //   return true;
        // }
        // // else inform the engine we did not perform
        // // any update (e.g. position, animation)
        // return false;

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        } else {
          return false;
        }
    },

    // moved doTalk to BaseEntity

    /**
	 * Mouse down handler
	 * @param {Event} e - MelonJS Event Object
	 */
    onMouseDown: function(e){
    	this._target = {};
    	this._target.x = e.gameWorldX - Math.floor( this.width / 2 );
    	this._target.y = e.gameWorldY - Math.floor( this.height / 2 );
    	this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);

      this.body.setVelocity(3,3);
      // this.body.setVelocity(0,0);
      this.body.falling = false;

      if (this.debugLevel > 1) console.log("onMouseDown: body.falling: ", this.body.falling);
      if (this.debugLevel > 1) console.log("onMouseDown: body.vel: ", Number(this.body.vel.x).toFixed(2), Number(this.body.vel.y).toFixed(2));
      if (this.debugLevel > 1) console.log("onMouseDown: body.accel: ", Number(this.body.accel.x).toFixed(2), Number(this.body.accel.y).toFixed(2));
      if (this.debugLevel > 1) console.log("onMouseDown: body.pos: ", Number(this.body.pos.x).toFixed(2), Number(this.body.pos.y).toFixed(2));
      if (this.debugLevel > 1) console.log("onMouseDown: pos: ", Number(this.pos.x).toFixed(2), Number(this.pos.y).toFixed(2));
      console.log("onMouseDown: target: ", Number(this._target.x).toFixed(2), Number(this._target.y).toFixed(2));
      if (this.debugLevel > 1) console.log("onMouseDown: ", this.direction);
    	this.renderable.setCurrentAnimation( this.direction );

    	// Hero just talking
    	if( this.talkWith ){
    		this.talkWith.dialog.reset();
    		delete this.talkWith;
    	}
    },

    onDestroyEvent : function() {
		    me.input.releasePointerEvent('mousedown', me.game.viewport);
    },
});

game.GirlEntity = game.BaseEntity.extend({

    init: function(x, y, settings) {

        // settings.image = "girl";
        settings.spritewidth = 24;
        settings.spriteheight = 36;

        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.anchorPoint.set(0.5, 0.5);

        this.gravity = 0;

        this.debugLevel = 1;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.setVelocity(3,3);
        this.body.setFriction(0.4,0.4);

        this.collidable = true;
        //this.type = me.game.ENEMY_OBJECT;
        this.collisionType = me.collision.types.ENEMY_OBJECT;

        var texture =  new me.video.renderer.Texture(
            { framewidth: 24, frameheight: 36 },
            me.loader.getImage("girl")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 1, 2,
          3,4,5,
          6,7,8,
          9,10,11]);

        this.renderable.addAnimation("down", [0,1,2]);
        this.renderable.addAnimation("left", [3,4,5]);
        this.renderable.addAnimation("right", [6,7,8]);
        this.renderable.addAnimation("up", [9,10,11]);

				// this.minX = x;
        // this.minY = y;
        // this.maxX = x + settings.width - settings.spritewidth;
        // this.maxY = y + settings.height - settings.spriteheight;

        // give NPC the whole map area
        this.minX = settings.spritewidth;
        this.minY = settings.spriteheight;
        this.maxX = me.game.viewport.getWidth() - settings.spritewidth;
        this.maxY = me.game.viewport.getHeight() - settings.spriteheight;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.force.set(0, 0);
        // this.body.setVelocity(3,3);
        this.body.setVelocity(0,0);
        this.body.setMaxVelocity(3, 3);
        this.body.setFriction(0.4,0.4);

        // set the renderable position to bottom center
        // this.anchorPoint.set(0.5, 0.5);
        this.anchorPoint.set(0,0);
        this.renderable.anchorPoint.set(0,0);

				// create dialog
				this.dialog = new game.Dialog( DIALOGUES[ this.name ], // data
           this.onDialogReset.bind(this), // onReset
           this.onDialogShow.bind(this)); // onShow
	},

    update: function(dt) {

        if(!this._target){
       		this._setRandomTargetPosition();
        }

				if(!this.isTalking){
        	this._calculateStep(dt);
        } else {
          // disable collisions
          // this.collisionType = me.collision.types.NO_OBJECT;

          // note: If I don't let npc keep walking, it traps the player in conversation
          this.body.vel.x = 0;
      		this.body.vel.y = 0;
          this.body.setVelocity(0,0);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        } else {
          return false;
        }
    }
});

game.OldManEntity = game.BaseEntity.extend({

    init: function(x, y, settings) {

      // 576x384px 12x8 sprites
      // width = 562px/12sprites = 47
      // height = 384px/8sprites = 48

        settings.spritewidth = 48;
        settings.spriteheight = 48;

        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.anchorPoint.set(0.5, 0.5);

        this.gravity = 0;

        this.debugLevel = 1;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.setVelocity(3,3);
        this.body.setFriction(0.4,0.4);

        this.collidable = true;
        //this.type = me.game.ENEMY_OBJECT;
        this.collisionType = me.collision.types.ENEMY_OBJECT;


        var texture =  new me.video.renderer.Texture(
            { framewidth: 48, frameheight: 48 },
            me.loader.getImage("boys_martial_arts")
        );

        // create a new sprite object
        // create a new sprite object
        // this.renderable = texture.createAnimationFromName([9,10,11,
        //   21,22,23,
        //   33,34,35,
        //   45,46,47]);

        this.renderable = texture.createAnimationFromName([
          0,1,2,3,4,5,6,7,8,9,10,11,
          12,13,14,15,16,17,18,19,20,21,22,23,
          24,25,26,27,28,29,30,31,32,33,34,35,
          36,37,38,39,40,41,42,43,44,45,46,47]);

        this.renderable.addAnimation("down", [9,10,11]);
        this.renderable.addAnimation("left", [21,22,23]);
        this.renderable.addAnimation("right", [33,34,35]);
        this.renderable.addAnimation("up", [45,46,47]);

				// this.minX = x;
        // this.minY = y;
        // this.maxX = x + settings.width - settings.spritewidth;
        // this.maxY = y + settings.height - settings.spriteheight;

        // give NPC the whole map area
        this.minX = settings.spritewidth;
        this.minY = settings.spriteheight;
        this.maxX = me.game.viewport.getWidth() - settings.spritewidth;
        this.maxY = me.game.viewport.getHeight() - settings.spriteheight;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.force.set(0, 0);
        // this.body.setVelocity(3,3);
        this.body.setVelocity(0,0);
        this.body.setMaxVelocity(3, 3);
        this.body.setFriction(0.4,0.4);

        this.direction = "down";
        this.renderable.setCurrentAnimation( this.direction );

        // set the renderable position to bottom center
        // this.anchorPoint.set(0.5, 0.5);
        this.anchorPoint.set(0,0);
        this.renderable.anchorPoint.set(0,0);

				// create dialog
				//this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));
        this.dialog = new game.Dialog( DIALOGUES[ "student" ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));

        this.StateEnum = Object.freeze({"stopped":1, "moving":2, "leaving":3});

        //this.currentState = this.StateEnum.stopped;
        this.currentState = this.StateEnum.moving;


	},

    update: function(dt) {

        if (!this._target && (this.currentState != this.StateEnum.stopped)) {
       		this._setRandomTargetPosition();
        }

        if(!this.isTalking){
        	this._calculateStep(dt);
        } else {
          // disable collisions
          // this.collisionType = me.collision.types.NO_OBJECT;

          // note: If I don't let npc keep walking, it traps the player in conversation
          this.body.vel.x = 0;
      		this.body.vel.y = 0;
          this.body.setVelocity(0,0);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        } else {
          return false;
        }
    }
});

game.StudentEntity = game.BaseEntity.extend({

    init: function(x, y, settings) {

        // 576x384px 12x8 sprites
        // width = 562px/12sprites = 47
        // height = 384px/8sprites = 48

        settings.spritewidth = 48;
        settings.spriteheight = 48;

        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.anchorPoint.set(0.5, 0.5);

        this.gravity = 0;

        this.debugLevel = 1;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.setVelocity(3,3);
        this.body.setFriction(0.4,0.4);

        this.collidable = true;
        //this.type = me.game.ENEMY_OBJECT;
        this.collisionType = me.collision.types.ENEMY_OBJECT;


        var texture =  new me.video.renderer.Texture(
            { framewidth: 48, frameheight: 48 },
            me.loader.getImage("boys_martial_arts")
        );

        // create a new sprite object
        // create a new sprite object
        // this.renderable = texture.createAnimationFromName([9,10,11,
        //   21,22,23,
        //   33,34,35,
        //   45,46,47]);

        // use sprite sheet offsets 0,1,2,3,4,5,6
        // offset 0 - instructor Hero
        // offset 1 - bald in black gi
        // offset 2 - yellow in red gi
        // offset 3 - old man
        // offset 4 - girl in white gi and pink hair
        // offset 5 - man with black gi and blond hair
        // offset 6 - man with blue hair and red gi
        // we can only choose 5 out of 7, because 2 are taken
        //this.spriteSheetGroup = Math.floor(Math.random() * Math.floor(7));
        this.spriteSheetGroup = Math.floor(Math.random() * Math.floor(5));
        // remap 0->5
        // remap 3->6
        if (this.spriteSheetGroup == 0) {
          this.spriteSheetGroup = 5;
        } else if (this.spriteSheetGroup == 3) {
          this.spriteSheetGroup = 6;
        }

        console.log("StudentEntity: init: spriteSheetGroup: ", this.spriteSheetGroup);
        // debugger;

        if ((this.spriteSheetGroup >= 0) && (this.spriteSheetGroup <= 3)) {
          // first 4 rows
          // 0..11
          // 12..23
          // 24..35
          // 36..47
          this.renderable = texture.createAnimationFromName([
            0,1,2,3,4,5,6,7,8,9,10,11,
            12,13,14,15,16,17,18,19,20,21,22,23,
            24,25,26,27,28,29,30,31,32,33,34,35,
            36,37,38,39,40,41,42,43,44,45,46,47]);
        } else {
          // next 4 rows
          // 48..59
          // 60..71
          // 72..83
          // 84..95
          this.renderable = texture.createAnimationFromName([
            0,1,2,3,4,5,6,7,8,9,10,11,
            12,13,14,15,16,17,18,19,20,21,22,23,
            24,25,26,27,28,29,30,31,32,33,34,35,
            36,37,38,39,40,41,42,43,44,45,46,47,
            48,49,50,51,52,53,54,55,56,57,58,59,
            60,61,62,63,64,65,66,67,68,69,70,71,
            72,73,74,75,76,77,78,79,80,81,82,83,
            84,85,86,87,88,89,90,91,92,93,94,95]);
        }

        if (this.spriteSheetGroup == 0) {
          this.renderable.addAnimation("down", [0,1,2]);
          this.renderable.addAnimation("left", [12,13,14]);
          this.renderable.addAnimation("right", [24,25,26]);
          this.renderable.addAnimation("up", [36,37,38]);
        } else if (this.spriteSheetGroup == 1) {
          this.renderable.addAnimation("down", [3,4,5]);
          this.renderable.addAnimation("left", [15,16,17]);
          this.renderable.addAnimation("right", [27,28,29]);
          this.renderable.addAnimation("up", [40,41,42]);
        } else if (this.spriteSheetGroup == 2) {
          this.renderable.addAnimation("down", [6,7,8]);
          this.renderable.addAnimation("left", [18,19,20]);
          this.renderable.addAnimation("right", [30,31,32]);
          this.renderable.addAnimation("up", [43,44,45]);
        } else if (this.spriteSheetGroup == 3) {
          this.renderable.addAnimation("down", [9,10,11]);
          this.renderable.addAnimation("left", [21,22,23]);
          this.renderable.addAnimation("right", [33,34,35]);
          this.renderable.addAnimation("up", [45,46,47]);
        } else if (this.spriteSheetGroup == 4) {
          this.renderable.addAnimation("down", [48,49,50]);
          this.renderable.addAnimation("left", [60,61,62]);
          this.renderable.addAnimation("right", [72,73,74]);
          this.renderable.addAnimation("up", [84,85,86]);
        } else if (this.spriteSheetGroup == 5) {
          this.renderable.addAnimation("down", [51,52,53]);
          this.renderable.addAnimation("left", [63,64,65]);
          this.renderable.addAnimation("right", [75,76,77]);
          this.renderable.addAnimation("up", [87,88,89]);
        } else if (this.spriteSheetGroup == 6) {
          this.renderable.addAnimation("down", [54,55,56]);
          this.renderable.addAnimation("left", [66,67,68]);
          this.renderable.addAnimation("right", [78,79,80]);
          this.renderable.addAnimation("up", [90,91,92]);
        } else {
          this.renderable.addAnimation("down", [9,10,11]);
          this.renderable.addAnimation("left", [21,22,23]);
          this.renderable.addAnimation("right", [33,34,35]);
          this.renderable.addAnimation("up", [45,46,47]);
        }

				// this.minX = x;
        // this.minY = y;
        // this.maxX = x + settings.width - settings.spritewidth;
        // this.maxY = y + settings.height - settings.spriteheight;

        // give NPC the whole map area
        this.minX = settings.spritewidth;
        this.minY = settings.spriteheight;
        this.maxX = me.game.viewport.getWidth() - settings.spritewidth;
        this.maxY = me.game.viewport.getHeight() - settings.spriteheight;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        this.body.force.set(0, 0);
        // this.body.setVelocity(3,3);
        this.body.setVelocity(0,0);
        this.body.setMaxVelocity(3, 3);
        this.body.setFriction(0.4,0.4);

        this.direction = "down";
        this.renderable.setCurrentAnimation( this.direction );

        // set the renderable position to bottom center
        // this.anchorPoint.set(0.5, 0.5);
        this.anchorPoint.set(0,0);
        this.renderable.anchorPoint.set(0,0);

				// create dialog
				//this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));
        this.dialog = new game.Dialog( DIALOGUES[ "student" ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));

        this.StateEnum = Object.freeze({"stopped":1, "moving":2, "leaving":3});

        this.currentState = this.StateEnum.stopped;
        // this.currentState = this.StateEnum.moving;


	},

    update: function(dt) {

        //if (!this._target && (this.currentState != this.StateEnum.stopped)) {
        if (!this._target && (this.currentState == this.StateEnum.moving)) {
       		this._setRandomTargetPosition();
        }

        if(!this.isTalking){
        	this._calculateStep(dt);
        } else {
          // disable collisions
          // this.collisionType = me.collision.types.NO_OBJECT;

          // note: If I don't let npc keep walking, it traps the player in conversation
          // this.body.vel.x = 0;
      		// this.body.vel.y = 0;
          // this.body.setVelocity(0,0);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        } else {
          return false;
        }
    }
});

game.ExitEntity = me.Entity.extend({


  init: function(x, y, settings) {

    console.log("ExitEntity: init: x:",x," y:",y);

    // call the constructor
    this._super(me.Entity, "init", [x, y , settings]);

  }

});
