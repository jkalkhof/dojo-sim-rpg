/**
* a UI container
*/

game.UI = game.UI || {};

// a Panel type container
game.UI.Container = me.Container.extend({

    addLabelText : function(label) {
      this.LabelText = new (me.Renderable.extend({
          init: function() {
              this._super(me.Renderable, 'init', [0, 0, 10, 10]);
              this.font = new me.Font("kenpixel", 20, "black");
              this.font.textAlign = "center";
              this.font.textBaseline = "top";
              this.font.bold();
          },
          draw: function(renderer){
              this.font.draw (
                  renderer,
                  label,
                  this.pos.x,
                  this.pos.y);
          }
      }));
      this.LabelText.pos.set(
          this.width / 2,
          16, // panel border
          this.z
      )
      this.addChild(this.LabelText, 10);
    },

    init: function(x, y, width, height, label) {
        // call the constructor
        this._super(me.Container, "init", [x, y, width, height]);

        this.anchorPoint.set(0, 0);

        // persistent across level change
        this.isPersistent = true;

        // make sure our object is always draw first
        this.z = Infinity;

        this.floating = true;

        // give a name
        this.name = "UIPanel";

        // back panel sprite
        this.panelSprite = game.texture.createSpriteFromName("grey_panel");
        this.panelSprite.anchorPoint.set(0, 0);
        // scale to match the container size
        this.panelSprite.scale(
            this.width / this.panelSprite.width,
            this.height / this.panelSprite.height
        );
        this.addChild(this.panelSprite);

        // Panel Label
        if ((label != null) && (label.length > 0)) {
          this.addLabelText(label);
        }

        // input status flags
        this.selected = false;
        this.hover = false;
        // to memorize where we grab the shape
        this.grabOffset = new me.Vector2d(0,0);
    },

    onActivateEvent: function () {
        // call the parent function
        this._super(me.Container, "onActivateEvent");
    },

    onDeactivateEvent: function () {
        // call the parent function
        this._super(me.Container, "onDeactivateEvent");
    },

    // update function
    update : function(dt) {
        return this._super(me.Container, "update", [ dt ]) || this.hover;
    }
});
