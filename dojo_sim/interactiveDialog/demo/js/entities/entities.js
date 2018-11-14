
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

            if (this.name == "student") {
              this.currentState = this.StateEnum.stopped;
            }

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

    // calculateStepPathfinding -- calculate step using pathfinding for every updated
    _calculateStepPathfinding: function(dt) {
      var now = Date.now()
      // this.updateColRect(0, 16, 16, 16);

      // if ((this.target == null) && !this.reachedTarget) {
      //     // we should globally store this value
      //     //this.target = me.game.getEntityByName('hero')[0];
      //     this.target = me.game.world.getChildByName("hero")[0];
      //     console.log("ChaserEntity: update target: ", this.target.name);
      // }

      // chessboard distance
      var cbdist = this.chessboard();

      // is the path valid?
      // is chessboard distance too far?
      // is the path too old?
      //if (!this.myPath || this.myPath.length < 1 || (cbdist >= 96 && this.pathAge+5000 < now)) {
      if (!this.myPath ||
        (this.myPath.length < 1 && this.dest == null) ||
        (cbdist >= 96 && this.pathAge+5000 < now)) {

          // not moving anywhere
          // friction takes over
          if (this._target != null) {

              // use Entity.pos.x,y instead of body.pos and shape.pos
                this.myPath = me.astar.search(
                  this.pos.x,
                  this.pos.y,
                  this._target.x,
                  this._target.y);

              if (this.myPath) {
                  for (var i =0; i < this.myPath.length; i++) {
                    let graphNode = this.myPath[i];
                    console.log("BaseEntity: update: myPath[",i,"]: ",graphNode.x,",",graphNode.y);
                  }

                  this.dest = this.myPath.pop();
                  if (this.dest) {
                    // console.log("ChaserEntity: update: dest: ",this.dest.pos.x,",",this.dest.pos.y);
                    // console.log("ChaserEntity: update: pos: ",this.pos.x,",",this.pos.y);
                  }

              }

              if (this.debugLevel > 1) console.log("BaseEntity: update: myPath.length: ",this.myPath.length);

              this.pathAge = now;
              //console.log(this.dest);
              // debugger;
          }
      } else {
          // path is valid - proceed to next node in path (dest)

          // if (this.chessboard() < 96) {
          //     // just go for it
          //     console.log("Chaser: update: go for direct line to target!");
          //
          //     this.dest = this.target;
          //     this.pathAge = now-5000;
          // } else if (this.body.overlaps(this.dest.rect) && this.myPath.length > 0) {
          //     // TODO - do this with non constant, add some fuzz factor
          //     console.log("Reached "+this.dest.pos.x+","+this.dest.pos.y);
          //     this.dest = this.myPath.pop();
          // }

          // check overlaps
          let bodyBounds = new me.Rect(this.pos.x,this.pos.y,this.body.width,this.body.height);

          if (this.debugLevel > 1) {
            console.log("check overlap: this.left: ",bodyBounds.left," dest.right: ",this.dest.rect.right);
            console.log("check overlap: dest.left: ",this.dest.rect.left," this.right: ",bodyBounds.right);
            console.log("check overlap: this.top: ",bodyBounds.top," dest.bottom: ",this.dest.rect.bottom);
            console.log("check overlap: dest.top: ",this.dest.rect.top," this.bottom: ",bodyBounds.bottom);
          }

          // reached path node - go to next node on path
          if (bodyBounds.overlaps(this.dest.rect) && this.myPath.length > 0) {
              // TODO - do this with non constant, add some fuzz factor
              console.log("BaseEntity: Reached "+this.dest.pos.x+","+this.dest.pos.y," myPath.length:",this.myPath.length);
              this.dest = this.myPath.pop();

              if (this.dest && (this.debugLevel > 1)) {
                console.log("BaseEntity: pos: ", this.pos.x,",",this.pos.y);
                console.log("BaseEntity: next dest: ", this.dest.pos.x,",",this.dest.pos.y);
                console.log("BaseEntity: next dest.rect: ", this.dest.rect.pos.x,",",this.dest.rect.pos.y,",",this.dest.rect.width,",",this.dest.rect.height);

                console.log("check overlap: this.left: ",bodyBounds.left," dest.right: ",this.dest.rect.right);
                console.log("check overlap: dest.left: ",this.dest.rect.left," this.right: ",bodyBounds.right);
                console.log("check overlap: this.top: ",bodyBounds.top," dest.bottom: ",this.dest.rect.bottom);
                console.log("check overlap: dest.top: ",this.dest.rect.top," this.bottom: ",bodyBounds.bottom);
              }
          } else if (bodyBounds.overlaps(this.dest.rect) && this.myPath.length == 0) {
              //this.dest = null;
          }



          // keep moving towards next node on path
          if (this.dest != null) {

              // console.log("@",this.pos.x,this.pos.y);
              // console.log("Moving toward ",this.dest.pos.x,this.dest.pos.y);
              // move based on next position

              var xdiff = this.dest.pos.x - (this.pos.x + this.anchorPoint.x)
                , ydiff = this.dest.pos.y - (this.pos.y + this.anchorPoint.y);

              if (this.debugLevel > 1) console.log("BaseEntity: update: dest distance:",xdiff,",",ydiff);

              let distThreshold = 2;
              let belowXdistThreshold = false;
              let belowYdistThreshold = false;

              if (xdiff < (distThreshold * -1)) {
                  this.body.force.x = -this.body.maxVel.x;
                  this.direction = "left";
              } else if (xdiff > distThreshold) {
                  // this.flipX(true);
                  this.body.force.x = this.body.maxVel.x;
                  this.direction = "right";
              } else {
                belowXdistThreshold = true;
              }

              if (ydiff < (distThreshold * -1)) {
                  this.body.force.y = -this.body.maxVel.y;
                  this.direction = "up";
              } else if (ydiff > distThreshold) {
                  this.body.force.y = this.body.maxVel.y;
                  this.direction = "down";
              } else {
                belowYdistThreshold = true;
              }

              // below threshold and at last dest on path?
              if (this.myPath.length == 0 && belowXdistThreshold && belowYdistThreshold) {
                console.log("BaseEntity: update: dest distance:",
                  Number(xdiff).toFixed(2),",",Number(ydiff).toFixed(2), " below threshold!");
                this.dest = null;
              }


              if (this.direction != this.lastDirection) {
                  this.renderable.setCurrentAnimation( this.direction );
                  this.lastDirection = this.direction;
              }

          }

          if (this.myPath && this.myPath.length == 0 && this.dest == null) {
            // STOP!!!
            console.log("BaseEntity: reached target!");
            this._target = null;
            this.reachedTarget = true;

            this.body.vel.x = 0;
        		this.body.vel.y = 0;
            this.body.setVelocity(0,0);

            if (this.currentState == this.StateEnum.movingToPosition) {
              this.currentState = this.StateEnum.stoppedAtPosition;

              game.studentManager.onStudentAdded();
            } else {
              this.currentState = this.StateEnum.stopped;
            }

          }
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
         if (this.renderable) {
           this.renderable.setCurrentAnimation( this.direction );
         } else {
           console.log("_setTargetPosition: renderable is undefined!");
         }

         // this.body.setVelocity(3,3);
         if (this.body) {
           this.body.setVelocity(1,1); // not needed for pathfinding algorithm?
           this.body.falling = false;
         } else {
           console.log("_setTargetPosition: body is undefined!");
         }

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
            return false;
          }
        } else if ((res.a.name == "hero") && (res.b.name == "oldman")) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          delete this._target;

          // start conversation with girl entity
          //this.doTalk( res.a );
          if (!res.b.isTalking) {
            this.doTalk( res.b );
            //this.doTalk( "student" );
            return false;
          }
        } else if ((res.a.name == "hero") && (res.b.name == "student") && (res.b.currentState == res.b.StateEnum.stopped)) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          // stops the hero from moving if colliding with student
          // delete this._target;

          // start conversation with entity
          if (!res.b.isTalking && !res.a.talkWith) {
            console.log("onCollision: ", res.b.name, " isTalking: ", res.b.isTalking);
            this.doTalk( res.b );
            return false;
          } else {
            //console.log("onCollision: ", res.b.name, " isTalking: ", res.b.isTalking);
          }
        } else if ((res.a.name == "hero") && (res.b.name == "exit")) {
          if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);
          return false;
        } else if ((res.a.name == "student") && (res.b.name == "exit") && (res.a.currentState == res.a.StateEnum.leaving)) {

          if (this.debugLevel > 0) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

          res.a.collidable = false;
          res.a.collisionType = me.collision.types.NO_OBJECT;
          delete this._target;

          // spawn a new student using studentManager after a random period of time...
          game.studentManager = me.game.world.getChildByName("studentManager")[0];
          game.studentManager.removeStudent(this);
          game.studentManager.onStudentRemoved();

          return false;
        } else if ((res.a.name == "student") && (res.b.name == "hero")) {
          // ignore this one
          //console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);
          return true;
        } else if ((res.a.name == "student") && (res.b.name == "student")) {
          // ignore this one
          //console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);
          return false;
        } else if (res.a.name == "student") {
          // console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

        } // collision test

        return true;
      }

      //if (res && obj.type == me.game.WORLD_SHAPE) {
      //if (res && obj.type == me.collision.types.WORLD_SHAPE) {
      if (res.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
        // if (this.debugLevel > 1)
        console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name);

        // debugger;

        delete this._target;

        // bounce the entity away from the collision
        this.pos.x -= this.body.vel.x;
        this.pos.y -= this.body.vel.y;

      	// this._setDirection( -res.x, -res.y );
      	// this.renderable.setCurrentAnimation( this.direction );
        // return false;
      }

      return true;
    },

    /**
     * Start conversation
     * @param {Object} entity
     */
    doTalk:function( entity ){
      console.log("doTalk: ", this.name," -> ", entity.name);

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
        // console.log("onDialogReset: ", this.name, " dialog.testrandom: ", this.dialog.testrandom);
        console.log("onDialogReset: ", this.name, this.id, " dialog.signedup: ", this.dialog.signedup);
        console.log("onDialogReset: ", this.name, this.id, " dialog.turnedaway: ", this.dialog.turnedaway);

        if (this.currentState == this.StateEnum.stopped) {
            if (this.dialog.turnedaway) {
                //this.currentState = this.StateEnum.moving;
                this.currentState = this.StateEnum.leaving;

                // get position from game.StudentManager.exitChild .pos.x , pos.y
                game.ExitEntity = me.game.world.getChildByName("exit")[0];
                var exitPos = game.ExitEntity.pos;

                if (this.renderable) {
                    this._setTargetPosition(exitPos);
                } else {
                  console.log("onDialogReset: ", this.name, " renderable is undefined!");
                }

                this.isTalking = false;
            } else if (this.dialog.signedup) {
              this.currentState = this.StateEnum.movingToPosition;

              // navigate back to target position
              game.studentManager = me.game.world.getChildByName("studentManager")[0];
              var studentPos = game.studentManager.getAvailablePosition(this.id);

              this._setTargetPosition(studentPos);
              this.isTalking = false;

            } else {
              this.isTalking = false;
            }
          }

          // spawn a new student using studentManager after a random period of time...
        	// wait for 2 sec - let the hero go away
        	var waitFor = 2000;
        	window.setTimeout(function(){
        		//delete this.isTalking;
            this.isTalking = false;
            console.log("onDialogReset: ", this.name, " isTalking: ", this.isTalking);
        	}.bind(this), waitFor);

        } else if (this.currentState == this.StateEnum.stoppedAtPosition) {
          this.currentState = this.StateEnum.movingToPosition;

          // navigate back to target position
          game.studentManager = me.game.world.getChildByName("studentManager")[0];
          var studentPos = game.studentManager.getAvailablePosition(this.id);

          this._setTargetPosition(studentPos);
          this.isTalking = false;
        }

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

    // return chessboard distance to target - for pathfinding
    chessboard: function() {

        if (this.target) {
          var collisionBox = this.body.getShape(0);
          var targetCollisionBox = this.target.body.getShape(0);
          //return Math.max( Math.abs(this.collisionBox.left - this.target.collisionBox.left), Math.abs(this.collisionBox.top - this.target.collisionBox.top));

          return Math.max(
              Math.abs(collisionBox.pos.x - targetCollisionBox.pos.x),
              Math.abs(collisionBox.pos.y - targetCollisionBox.pos.y));
        }

        return 0;
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

        // this.gravity = 0;
        this.body.gravity = new me.Vector2d(0,0);

        this.debugLevel = 0;

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
      if (this.debugLevel > 0) console.log("onMouseDown: pos: ", Number(this.pos.x).toFixed(2), Number(this.pos.y).toFixed(2));
      if (this.debugLevel > 1) console.log("onMouseDown: pos: ", Number(this.pos.x).toFixed(2), Number(this.pos.y).toFixed(2));
      if (this.debugLevel > 0) console.log("onMouseDown: target: ", Number(this._target.x).toFixed(2), Number(this._target.y).toFixed(2));
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

        // this.gravity = 0;
        this.body.gravity = new me.Vector2d(0,0);

        this.debugLevel = 1;

        // set the default horizontal & vertical speed (accel vector)
        // walking & jumping speed
        //this.body.setVelocity(3,3);
        this.body.setVelocity(0,0);
        this.body.setFriction(0.4,0.4);

        this.collidable = true;
        //this.type = me.game.ENEMY_OBJECT;
        this.collisionType = me.collision.types.ENEMY_OBJECT;

        // create a new sprite object

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

        this.createRenderable();

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

				// create dialog
				//this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));
        this.dialog = new game.Dialog( DIALOGUES[ "student" ],
            this.onDialogReset.bind(this),
            this.onDialogShow.bind(this),
            this.onSpriteLookup.bind(this));

        this.StateEnum = Object.freeze({"stopped":1, "moving":2, "leaving":3, "movingToPosition":4, "stoppedAtPosition":5});

        this.currentState = this.StateEnum.stopped;
        // this.currentState = this.StateEnum.moving;

        // conversation dialogue
        this.isTalking = false;

        // pathfinding variables
        this.target = null;
        this.myPath = [];
        this.dest = null;
        this.lastPos = {x: -1, y: -1};
        this.pathAge = 0;
        this.reachedTarget = false;
        this.lastDirection = this.direction;

        // create timeout for signedup or turnedaway dialog result
        // wait for 2 sec - let the hero go away
        var waitFor = 10000;
        this.timer = me.timer.setTimeout(function () {
          console.log("Student:",this.name,this.id," leave check timeout");

          if (this.isTalking) {
            console.log("Student: leave check timeout: ",this.name,this.id," isTalking");
          } else {
            if (this.dialog.signedup) {
              console.log("Student: leave check timeout: ",this.name,this.id," signedup");
            } else if (this.dialog.turnedaway) {
              console.log("Student: leave check timeout: ",this.name,this.id," turnedaway");
            } else {
              console.log("Student: leave check timeout: ",this.name,this.id," not signedup or turnedaway");

              this.currentState = this.StateEnum.leaving;

              // get position from game.StudentManager.exitChild .pos.x , pos.y
              game.ExitEntity = me.game.world.getChildByName("exit")[0];
              var exitPos = game.ExitEntity.pos;
              this._setTargetPosition(exitPos);
            }
          }


          me.timer.clearInterval(this.timer);
        }.bind(this), waitFor);

    },

    createRenderable: function() {

      var texture =  new me.video.renderer.Texture(
          { framewidth: 48, frameheight: 48 },
          me.loader.getImage("boys_martial_arts")
      );

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
        // offset 0 - instructor Hero
        this.renderable.addAnimation("down", [0,1,2]);
        this.renderable.addAnimation("left", [12,13,14]);
        this.renderable.addAnimation("right", [24,25,26]);
        this.renderable.addAnimation("up", [36,37,38]);
      } else if (this.spriteSheetGroup == 1) {
        // offset 1 - bald in black gi
        this.renderable.addAnimation("down", [3,4,5]);
        this.renderable.addAnimation("left", [15,16,17]);
        this.renderable.addAnimation("right", [27,28,29]);
        this.renderable.addAnimation("up", [39,40,41]);
      } else if (this.spriteSheetGroup == 2) {
        // offset 2 - yellow hair in red gi
        this.renderable.addAnimation("down", [6,7,8]);
        this.renderable.addAnimation("left", [18,19,20]);
        this.renderable.addAnimation("right", [30,31,32]);
        this.renderable.addAnimation("up", [42,43,44]);
      } else if (this.spriteSheetGroup == 3) {
        // offset 3 - old man
        this.renderable.addAnimation("down", [9,10,11]);
        this.renderable.addAnimation("left", [21,22,23]);
        this.renderable.addAnimation("right", [33,34,35]);
        this.renderable.addAnimation("up", [45,46,47]);
      } else if (this.spriteSheetGroup == 4) {
        // offset 4 - girl in white gi and pink hair
        this.renderable.addAnimation("down", [48,49,50]);
        this.renderable.addAnimation("left", [60,61,62]);
        this.renderable.addAnimation("right", [72,73,74]);
        this.renderable.addAnimation("up", [84,85,86]);
      } else if (this.spriteSheetGroup == 5) {
        // offset 5 - man with black gi and blond hair
        this.renderable.addAnimation("down", [51,52,53]);
        this.renderable.addAnimation("left", [63,64,65]);
        this.renderable.addAnimation("right", [75,76,77]);
        this.renderable.addAnimation("up", [87,88,89]);
      } else if (this.spriteSheetGroup == 6) {
        // offset 6 - man with blue hair and red gi
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

      this.renderable.anchorPoint.set(0,0);
    },

    // called by dialogue to get proper sprite index
    onSpriteLookup:function(){
      console.log("onSpriteLookup: ", this.name);

      return this.spriteSheetGroup;
    },

    update: function(dt) {

        //if (!this._target && (this.currentState != this.StateEnum.stopped)) {
        // if (!this._target && (this.currentState == this.StateEnum.moving)) {
       	// 	this._setRandomTargetPosition();
        // }

        if(!this.isTalking &&
          (this.currentState != this.StateEnum.stopped) &&
          (this.currentState != this.StateEnum.stoppedAtPosition)) {
        	// this._calculateStep(dt);
          this._calculateStepPathfinding(dt);
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
    },

    /*
    draw debug pathfinding boxes and sprite
    */
    draw: function(renderer, region) {
        renderer.save();

        this._super(me.Entity, "draw", [renderer, region]);

        // draw the sprite if defined
        if (this.renderable) {
            // translate the renderable position (relative to the entity)
            // and keeps it in the entity defined bounds
            // anyway to optimize this ?
            // var x = ~~(this.pos.x + (this.anchorPoint.x * (this.width - this.renderable.width)));
            // var y = ~~(this.pos.y + (this.anchorPoint.y * (this.height - this.renderable.height)));
            // context.translate(x, y);
            // this.renderable.draw(context);
            // context.translate(-x, -y);
        }

        // draw dest rect
        debugAStar = true;

        // translate the renderable position (relative to the entity)
        // and keeps it in the entity defined bounds
        // anyway to optimize this ?
        var x = ~~(this.pos.x + (this.anchorPoint.x * (this.width - this.renderable.width)));
        var y = ~~(this.pos.y + (this.anchorPoint.y * (this.height - this.renderable.height)));

        region.translate(-x, -y);

        // draw the region for a sanity check?
        var color = renderer.getColor();
        renderer.setColor('#5EFF7E'); // green
        // renderer.setColor('#ff4023'); // red
        renderer.strokeRect(
            region.pos.x,
            region.pos.y,
            region.width,
            region.height
          );
        renderer.setColor(color);

        region.translate(x, y);

        if (debugAStar && this.dest) {

            for (var i = 0, ii = this.myPath.length; i < ii; i+=1) {
                if (this.myPath[i] && this.myPath[i].rect) {
                    //this.myPath[i].rect.draw(context, "red");

                    var color = renderer.getColor();
                    // renderer.setColor('#5EFF7E'); // green
                    renderer.setColor('#ff4023'); // red

                    this.myPath[i].rect.translate(-x, -y);
                    renderer.strokeRect(
                        this.myPath[i].rect.pos.x,
                        this.myPath[i].rect.pos.y,
                        this.myPath[i].rect.width,
                        this.myPath[i].rect.height
                      );
                    this.myPath[i].rect.translate(x, y);

                    renderer.setColor(color);

                    // debugger;
                }
            }

            if (this.dest && this.dest.rect) {
                // this.dest.rect.draw(context, "green");

                var color = renderer.getColor();
                renderer.setColor('#5EFF7E'); // green
                // renderer.setColor('#ff4023'); // red

                this.dest.rect.translate(-x, -y);
                renderer.strokeRect(
                    this.dest.rect.pos.x,
                    this.dest.rect.pos.y,
                    this.dest.rect.width,
                    this.dest.rect.height
                  );
                this.dest.rect.translate(x,y);

                renderer.setColor(color);
            }
        }

        renderer.restore();
    },
});

game.ExitEntity = me.Entity.extend({

  init: function(x, y, settings) {
    console.log("ExitEntity: init: x:",x," y:",y);
    // call the constructor
    this._super(me.Entity, "init", [x, y , settings]);
  }

});

game.SpawnEntity = me.Entity.extend({

  init: function(x, y, settings) {
    console.log("SpawnEntity: init: x:",x," y:",y);
    // call the constructor
    this._super(me.Entity, "init", [x, y , settings]);

    // disable collision detection with all other objects
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
  }

});
