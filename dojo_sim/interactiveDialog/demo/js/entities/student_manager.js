game.StudentManager = me.Container.extend({
    init: function () {
        this.COLS = 5;
        this.ROWS = 2;
        this.xoffset = 4*32;
        this.yoffset = 4*32;

        this._super(me.Container, "init", [0, 32, this.COLS * 64 - 32, this.ROWS * 64 - 32]);

        this.vel = 16;

        console.log("StudentManager: init");

        this.totalStudents = 0;
        this.activeStudents = 0;
    },

    createEnemies: function () {
        console.log("StudentManager: createEnemies");

        settings = {width: 32, height: 32};

        for (var i = 0; i < this.COLS; i++) {
            for (var j = 0; j < this.ROWS; j++) {
                //this.addChild(me.pool.pull("enemy", i * 64, j * 64));
                //this.addChild(me.pool.pull("oldman", i * 64, j * 64, settings));
                // add them to me.game.world instead of this container?
                var tempChild = me.game.world.addChild(me.pool.pull("student",
                  this.xoffset + (i * 64),
                  this.yoffset + (j * 64),
                   settings));
                //tempChild.name = "oldman-generated";
                tempChild.name = "student";
            }
        }
        this.createdEnemies = true;
        this.updateChildBounds();

        // save link to ExitEntity
        this.exitChild = null;

        // show entities in level
        for (var i = 0; i < me.game.world.children.length; i++) {
            var levelChild = me.game.world.children[i];
            console.log("StudentManager: world(",i,"): ", levelChild.name);

            if (levelChild.name == "exit") {
              this.exitChild = levelChild;
              console.log("StudentManager: found exit: x:", this.exitChild.pos.x," y:",this.exitChild.pos.y);
            }
        }
    },

    spawnStudent: function() {
      console.log("StudentManager: spawnStudent: id: ", this.totalStudents);

      // get position from spawn point in level - .pos.x , pos.y
      game.spawnEntity = me.game.world.getChildByName("spawn")[0];
      var spawnPos = game.spawnEntity.pos;

      // add student at spawn point
      settings = {width: 32, height: 32};
      var tempChild = me.game.world.addChild(me.pool.pull("student",
        spawnPos.x,
        spawnPos.y,
        settings));
      //tempChild.name = "oldman-generated";
      tempChild.name = "student";

      this.activeStudents += 1;
      this.totalStudents += 1;
      
      // copy value
      tempChild.id = JSON.parse(JSON.stringify(this.activeStudents));
      // tempChild.id = this.totalStudents;
      // debugger;



    },

    removeStudent: function(tempStudent) {
      console.log("StudentManager: removeStudent:", tempStudent.id);

      // remove it - student leaves through exit
      me.game.world.removeChild(tempStudent);

      this.activeStudents -= 1;
    },

    getAvailablePosition: function(studentId) {
      console.log("StudentManager: getAvailablePosition:", studentId);

      // 0,1,2,3,4
      // 5,6,7,8,9
      var currentCol = (studentId -1 )% this.COLS;
      var currentRow = Math.floor((studentId -1) / this.COLS);
      // var currentCol = (this.activeStudents -1 )% this.COLS;
      // var currentRow = Math.floor((this.activeStudents -1) / this.COLS);

      console.log("StudentManager: getAvailablePosition: row: ",currentRow," col: ",currentCol);

      var pos = new me.Vector2d(
          this.xoffset + (currentCol * 64),
          this.yoffset + (currentRow * 64));

      console.log("StudentManager: getAvailablePosition: pos.x: ",pos.x," pos.y: ",pos.y);

      return pos;
    },

    onActivateEvent: function () {
        console.log("StudentManager: onActivateEvent");

        var _this = this;
        // don't periodically move children around inside container using a timer
    },

    onDeactivateEvent: function () {
        //me.timer.clearInterval(this.timer);
    },

    removeChildNow: function (child) {
        this._super(me.Container, "removeChildNow", [child]);
        this.updateChildBounds();
    },

    update: function (time) {
        // were all children destroyed?
        // if (this.children.length === 0 && this.createdEnemies) {
        //     game.playScreen.reset();
        // }

        this._super(me.Container, "update", [time]);
        this.updateChildBounds();
    },

    onStudentAdded: function() {
      console.log("StudentManager: onStudentAdded: totalStudents:",this.totalStudents," activeStudents:",this.activeStudents);

      if (this.activeStudents < 5) {
        // wait for 2 sec - let the hero go away
        var waitFor = 2000;
        this.timer = me.timer.setTimeout(function () {
          console.log("StudentManager: add new student");

          // spawn a new student using studentManager after a random period of time...
          // game.studentManager = me.game.world.getChildByName("studentManager")[0];
          // game.studentManager.spawnStudent();
          this.spawnStudent();

          me.timer.clearInterval(this.timer);
        }.bind(this), waitFor);
      }

    },

    onStudentRemoved: function() {
      console.log("StudentManager: onStudentRemoved: totalStudents:",this.totalStudents," activeStudents:",this.activeStudents);

      if (this.activeStudents < 5) {
        // wait for 2 sec - let the hero go away
        var waitFor = 2000;
        this.timer = me.timer.setTimeout(function () {
          console.log("StudentManager: add new student");

          // spawn a new student using studentManager after a random period of time...
          // game.studentManager = me.game.world.getChildByName("studentManager")[0];
          // game.studentManager.spawnStudent();
          this.spawnStudent();

          me.timer.clearInterval(this.timer);
        }.bind(this), waitFor);
      }

    },


});
