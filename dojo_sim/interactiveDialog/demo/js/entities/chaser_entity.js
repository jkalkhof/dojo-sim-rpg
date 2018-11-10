
game.ChaserEntity = me.Entity.extend({
    /* -----
    constructor
    ------ */
    init: function(x, y, settings) {
        console.log("ChaserEntity: init");

        this.debugLevel = 1;

        settings.framewidth = settings.width = 48;
        settings.frameheight = settings.height = 48;


        // call the constructor
        //this.parent(x, y, settings);
        this._super(me.Entity, "init", [x, y , settings]);


        // chase even when offscreen
        this.alwaysUpdate = true;

        // set the default horizontal & vertical speed (accel vector)
        this.body.force.set(0, 0);
        this.body.setVelocity(0.25,0.25);
        // this.body.setVelocity(0,0);
        this.body.setMaxVelocity(3, 3);
        this.body.setFriction(0.5,0.5);
        // this.gravity = 0;
        this.body.gravity = new me.Vector2d(0,0);


        this.collidable = true;
        this.collisionMask = me.collision.types.ALL_OBJECT;
        // this.collisionMask = me.collision.types.WORLD_SHAPE;

        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;
        // this.isKinematic = true;

        // adjust the bounding box
        // lower half SNES-RPG style
        console.log(this.collisionBox);
        //this.updateColRect(0, 32, 32, 32);

        // add a default collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));

        var texture =  new me.video.renderer.Texture(
            { framewidth: 48, frameheight: 48 },
            me.loader.getImage("boys_martial_arts")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([
          0,1,2,3,4,5,6,7,8,9,10,11,
          12,13,14,15,16,17,18,19,20,21,22,23,
          24,25,26,27,28,29,30,31,32,33,34,35,
          36,37,38,39,40,41,42,43,44,45,46,47]);

        this.renderable.addAnimation("down", [9,10,11]);
        this.renderable.addAnimation("left", [21,22,23]);
        this.renderable.addAnimation("right", [33,34,35]);
        this.renderable.addAnimation("up", [45,46,47]);

        this.direction = "down";
        this.renderable.setCurrentAnimation( this.direction );

        // set the renderable position to bottom center
        // this.anchorPoint.set(0.5, 0.5);
        this.anchorPoint.set(0,0);
        this.renderable.anchorPoint.set(0,0);


        // pathfinding variables
        this.target = null;
        this.myPath = [];
        this.dest = null;
        this.lastPos = {x: -1, y: -1};
        this.pathAge = 0;
        this.reachedTarget = false;
        this.lastDirection = this.direction;

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

    /* -----
    update the Entity pos
    ------ */
    update: function(dt) {
        var now = Date.now()
        // this.updateColRect(0, 16, 16, 16);

        if ((this.target == null) && !this.reachedTarget) {
            // we should globally store this value
            //this.target = me.game.getEntityByName('hero')[0];
            this.target = me.game.world.getChildByName("hero")[0];
            console.log("ChaserEntity: update target: ", this.target.name);
        }

        // chessboard distance
        var cbdist = this.chessboard();

        // is the path valid?
        // is chessboard distance too far?
        // is the path too old?
        if (!this.myPath || this.myPath.length < 1 || (cbdist >= 96 && this.pathAge+5000 < now)) {

            // not moving anywhere
            // friction takes over
            if (this.target != null) {

                // use Entity.pos.x,y instead of body.pos and shape.pos
                  this.myPath = me.astar.search(
                    this.pos.x,
                    this.pos.y,
                    this.target.pos.x,
                    this.target.pos.y);

                if (this.myPath) {
                    for (var i =0; i < this.myPath.length; i++) {
                      let graphNode = this.myPath[i];
                      console.log("ChaserEntity: update: myPath[",i,"]: ",graphNode.x,",",graphNode.y);
                    }

                    this.dest = this.myPath.pop();
                    if (this.dest) {
                      // console.log("ChaserEntity: update: dest: ",this.dest.pos.x,",",this.dest.pos.y);
                      // console.log("ChaserEntity: update: pos: ",this.pos.x,",",this.pos.y);
                    }

                }

                console.log("ChaserEntity: update: myPath.length: ",this.myPath.length);


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
                console.log("Chaser: Reached "+this.dest.pos.x+","+this.dest.pos.y," myPath.length:",this.myPath.length);
                this.dest = this.myPath.pop();

                if (this.dest && (this.debugLevel > 1)) {
                  console.log("Chaser: pos: ", this.pos.x,",",this.pos.y);
                  console.log("Chaser: next dest: ", this.dest.pos.x,",",this.dest.pos.y);
                  console.log("Chaser: next dest.rect: ", this.dest.rect.pos.x,",",this.dest.rect.pos.y,",",this.dest.rect.width,",",this.dest.rect.height);

                  console.log("check overlap: this.left: ",bodyBounds.left," dest.right: ",this.dest.rect.right);
                  console.log("check overlap: dest.left: ",this.dest.rect.left," this.right: ",bodyBounds.right);
                  console.log("check overlap: this.top: ",bodyBounds.top," dest.bottom: ",this.dest.rect.bottom);
                  console.log("check overlap: dest.top: ",this.dest.rect.top," this.bottom: ",bodyBounds.bottom);
                }
            }

            if (this.myPath && this.myPath.length == 0) {
              // STOP!!!
              this.target = null;
              this.reachedTarget = true;
            }

            // keep moving towards next node on path
            if (this.dest != null) {

                // console.log("@",this.pos.x,this.pos.y);
                // console.log("Moving toward ",this.dest.pos.x,this.dest.pos.y);
                // move based on next position

                var xdiff = this.dest.pos.x - (this.pos.x + this.anchorPoint.x)
                  , ydiff = this.dest.pos.y - (this.pos.y + this.anchorPoint.y);

                if (this.debugLevel > 1) console.log("Chaser: update: dest distance:",xdiff,",",ydiff);

                let distThreshold = 2;

                if (xdiff < (distThreshold * -1)) {
                    this.body.force.x = -this.body.maxVel.x;
                    this.direction = "left";
                } else if (xdiff > distThreshold) {
                    // this.flipX(true);
                    this.body.force.x = this.body.maxVel.x;
                    this.direction = "right";
                }

                if (ydiff < (distThreshold * -1)) {
                    this.body.force.y = -this.body.maxVel.y;
                    this.direction = "up";
                } else if (ydiff > distThreshold) {
                    this.body.force.y = this.body.maxVel.y;
                    this.direction = "down";
                }

                if (this.direction != this.lastDirection) {
                    this.renderable.setCurrentAnimation( this.direction );
                    this.lastDirection = this.direction;
                }

            }
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

  /**
  * default on collision handler
  */
   onCollision : function (res, obj){

     // collide with enemy_object (girl) and start dialouge
     //if (res && (obj.type == me.game.ENEMY_OBJECT)) {
     //if (res && (obj.type == me.collision.types.ENEMY_OBJECT)) {

     if (res.b.body.collisionType === me.collision.types.PLAYER_OBJECT) {
       if (this.debugLevel > 0) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name," id:",res.b.id);
       delete this._target;
       this.target = null;
       this.reachedTarget = true;
       return true;
     }

     if (res.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
       delete this._target;
       return true;
     }

     //if (res && obj.type == me.game.WORLD_SHAPE) {
     //if (res && obj.type == me.collision.types.WORLD_SHAPE) {
     if (res.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
       if (this.debugLevel > 1) console.log("onCollision(",this.name,"): a:",res.a.name," b:",res.b.name," id:",res.b.id);

       // debugger;

       // delete this._target;

       // bounce the entity away from the collision
       // this.pos.x -= this.body.vel.x;
       // this.pos.y -= this.body.vel.y;

       // this._setDirection( -res.x, -res.y );
       // this.renderable.setCurrentAnimation( this.direction );
       // return false;
     }

     return true;
   }
});
