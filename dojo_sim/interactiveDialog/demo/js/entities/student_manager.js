game.StudentManager = me.Container.extend({
    init: function () {
        this.COLS = 5;
        this.ROWS = 2;
        this.xoffset = 4*32;
        this.yoffset = 4*32;

        this._super(me.Container, "init", [0, 32, this.COLS * 64 - 32, this.ROWS * 64 - 32]);

        this.debugLevel = 1;
        this.vel = 16;

        console.log("StudentManager: init");

        this.totalStudents = 0;
        this.activeStudents = 0;

        this.savings = 2000;
        // this.savings = 0; // for testing lose
        this.currentMonth = 0;
        // this.currentMonth = 7; // for testing win
        this.dojoSkillLevel = 0;
        // this.dojoSkillLevel = 5; // for testing win

        // reset the score
        game.data.score = 0;
        game.data.savings = this.savings;
        game.data.dojoSkillLevel = this.dojoSkillLevel;

        // dictionary to keep track of active students
        // this.studentDict = {};
        this.studentMap = new Map();

        this.studentTypeEnum = Object.freeze({"dabbler":0, "obsessive":1, "hacker":2, "balanced":3, "unknown":4});

        this.timer = null;

        if (this.timer == null) {
          // wait for 2 sec - let the hero go away
          var waitFor = 12000;

          //this.timer = me.timer.setTimeout(function () {
          this.timer = me.timer.setInterval(function () {
            console.log("StudentManager: add new student");

            // spawn a new student using studentManager after a random period of time...
            this.spawnStudent();

            //me.timer.clearTimeout(this.timer);
            //this.timer = null;
          }.bind(this), waitFor);
        } // otherwise timer is already active

    },

    createEnemies: function () {
        if (this.debugLevel > 0) console.log("StudentManager: createEnemies");

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
      if (this.debugLevel > 0) console.log("StudentManager: spawnStudent: id: ", this.totalStudents);

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
      tempChild.startMonth = this.currentMonth;
      tempChild.assignedPosition = -1;

      //this.activeStudents += 1;
      this.totalStudents += 1;

      // copy value
      tempChild.id = JSON.parse(JSON.stringify(this.totalStudents));
      // tempChild.id = JSON.parse(JSON.stringify(this.activeStudents+1));
      // tempChild.id = JSON.parse(JSON.stringify(this.activeStudents));
      // tempChild.id = this.totalStudents;
      // debugger;


      // 5 students per month as period
      if ((this.totalStudents % 5) == 0) {
        this.currentMonth += 1;
        // take out rent
        this.savings -= 1000;
        // add student fees
        this.savings += (this.activeStudents * 150);

        // play the "gameover_sfx" audio clip with a lower volume level
        // volume.clamp is not a function? bug in melonjs?
        //me.audio.play("sfx_movement_portal1", false, null, 0.5);
        me.audio.play("sfx_movement_portal1");

        // game over if savings < 0
        if (this.savings <= 0) {
        //if (this.savings < 2000) { // test end game
          game.dojosimPanel = me.game.world.getChildByName("dojosimPanel")[0];
          me.game.world.removeChild(game.dojosimPanel);

          // copy to game.data globals
          game.data.savings = this.savings;
          // game.data.savings = -1; // test end game
          game.data.dojoSkillLevel = this.dojoSkillLevel;

          // switch to menu state and display menu screen
          me.state.set(me.state.GAMEOVER, new MenuScreen());
          //me.state.set(me.state.MENU, new game.MenuScreen());
          me.state.change(me.state.GAMEOVER);

          me.audio.play("misc_sound");
        }



        // game over if savings < 0
        game.timePanel = me.game.world.getChildByName("timePanel")[0];
        if (game.timePanel) game.timePanel.setText("Time: "+this.currentMonth);
      }


      if (this.totalStudents >= 1) {
        game.savingsPanel = me.game.world.getChildByName("savingsPanel")[0];
        if (game.savingsPanel) game.savingsPanel.setText("Savings: "+this.savings);
      }

      // show entities in level
      // for (var i = 0; i < me.game.world.children.length; i++) {
      //     var levelChild = me.game.world.children[i];
      //     console.log("StudentManager: world(",i,"): ", levelChild.name);
      // }

      // this.studentDict[tempChild.id] = tempChild;
      // var totalSkillValues = 0;
      // for(var key in this.studentDict) {
      //   var value = this.studentDict[key];
      //   if (value != null) {
      //     // do something with "key" and "value" variables
      //     let skillLevel = this.currentMonth - value.startMonth;
      //     totalSkillValues += skillLevel;
      //     console.log("StudentManager: studentDict(",key,"): ", value.name, value.id,
      //       " startMonth:", value.startMonth,
      //       " skillLevel:", skillLevel);
      //   }
      // }


      // calculate dojoSkillLevel by checking practice time of all students
      if (this.studentMap.size > 0) {
        var totalSkillValues = 0;

        for (var [key, value] of this.studentMap.entries()) {
          let skillLevel = this.currentMonth - value.startMonth;
          totalSkillValues += skillLevel;
          console.log("StudentManager: studentDict(",key,"): ", value.name, value.id,
            " startMonth:", value.startMonth,
            " skillLevel:", skillLevel,
            " studentType:", this.studentTypeToStr(value.studentType),
            " assignedPosition:", value.entity.assignedPosition);

          //if (value.studentType == this.studentTypeEnum.dabbler) {
          //if (value.studentType != this.studentTypeEnum.balanced) {
          if ((value.studentType != this.studentTypeEnum.balanced) && (skillLevel > 0)) {
            console.log("StudentManager: studentDict(",key,"): ", value.name, value.id,
              " startMonth:", value.startMonth,
              " skillLevel:", skillLevel,
              " **MAKE LEAVE");
              value.entity.onMakeLeave();
          }

          if (key < 0) {
            debugger;
          }
        }

        // integer value
        //this.dojoSkillLevel = ~~(totalSkillValues / this.activeStudents);
        this.dojoSkillLevel = (totalSkillValues / this.activeStudents);
        game.dojoSkillPanel = me.game.world.getChildByName("dojoSkillPanel")[0];
        if (game.dojoSkillPanel) game.dojoSkillPanel.setText("Dojo Skill: "+Number(this.dojoSkillLevel).toFixed(2));

      }

      // TODO: winning game state
      // game over if skill level > 4 before 12 months
      // this.dojoSkillLevel = 7.0; // for testing win
      if ((this.dojoSkillLevel >= 4.0) && (this.currentMonth >= 7)) {
        game.dojosimPanel = me.game.world.getChildByName("dojosimPanel")[0];
        if (game.dojosimPanel) {
            me.game.world.removeChild(game.dojosimPanel);
        }


        // copy to game.data globals
        game.data.savings = this.savings;
        // game.data.savings = -1; // test end game
        game.data.dojoSkillLevel = this.dojoSkillLevel;

        // switch to menu state and display menu screen
        me.state.set(me.state.GAMEOVER, new MenuScreen());
        //me.state.set(me.state.MENU, new game.MenuScreen());
        me.state.change(me.state.GAMEOVER);

        me.audio.play("save");
      }


    },

    removeStudent: function(tempStudent) {
      if (this.debugLevel > 1) console.log("StudentManager: removeStudent:", tempStudent.id);

      // https://stackoverflow.com/questions/10822971/how-to-check-whether-a-javascript-object-has-a-value-for-a-given-key
      // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
      // some nasty overflow
      // if (tempStudent.id in this.studentDict) {
      //     delete this.studentDict[tempStudent.id];
      // }

      // if (tempStudent.id in this.studentDict) {
      //     //this.studentDict[tempStudent.id] = undefined;
      //     this.studentDict[tempStudent.id] = null;
      // }

      // this function may be called multiple times in a row, so have a sanity check
      if (this.studentMap.has(tempStudent.id)) {
          this.studentMap.delete(tempStudent.id);
          this.activeStudents -= 1;

          game.studentsPanel = me.game.world.getChildByName("studentsPanel")[0];
          game.studentsPanel.setText("Students: "+this.activeStudents);

          me.audio.play("negative_2");
      }

      // remove it - student leaves through exit
      me.game.world.removeChild(tempStudent);

    },

    getAvailablePosition: function(studentEntity) {
      if (this.debugLevel > 1) console.log("StudentManager: getAvailablePosition: studentId:", studentEntity.id);

      // scan through students for a free position
      var positionMap = new Map();
      let position = 1;
      let maxPosition = 1;
      for (var [key, value] of this.studentMap.entries()) {
        console.log("StudentManager: studentDict(",key,"): ", value.name, value.id,
          " studentType:", this.studentTypeToStr(value.studentType),
          " assignedPosition:", value.entity.assignedPosition);

        // note positions are unordered in this list!
        // npcs may leave and replace in any position - example: 1,3,5,2,4
        // so an ordered search will fail - use dictionary instead!
        positionMap.set(value.entity.assignedPosition,1);

        if (value.entity.assignedPosition > maxPosition) {
          maxPosition = value.entity.assignedPosition;
        }
      }

      if (this.debugLevel > 1) console.log("StudentManager: getAvailablePosition: maxPosition: ",maxPosition);

      let positionFound = false;
      for (i = 1; (i <= (maxPosition+1)) && !positionFound; i++) {
        if (this.debugLevel > 1) console.log("StudentManager: getAvailablePosition: check position: ",i);
        if (positionMap.get(i) == undefined) {
          if (this.debugLevel > 0) console.log("StudentManager: getAvailablePosition: found unused position: ",i);
          position = i;
          positionFound = true;
        }
      }

      // 0,1,2,3,4
      // 5,6,7,8,9
      var currentCol = (position -1 )% this.COLS;
      var currentRow = Math.floor((position -1) / this.COLS);

      studentEntity.assignedPosition = position;

      if (this.debugLevel > 1) console.log("StudentManager: getAvailablePosition: row: ",currentRow," col: ",currentCol);

      var pos = new me.Vector2d(
          this.xoffset + (currentCol * 64),
          this.yoffset + (currentRow * 64));

      if (this.debugLevel > 1) console.log("StudentManager: getAvailablePosition: pos.x: ",pos.x," pos.y: ",pos.y);

      return pos;
    },

    onActivateEvent: function () {
        console.log("StudentManager: onActivateEvent");

        var _this = this;
        // don't periodically move children around inside container using a timer
    },

    onDeactivateEvent: function () {
        if (this.debugLevel > 0) console.log("StudentManager: onDeactivateEvent")
        if (this.timer != null) {
          me.timer.clearInterval(this.timer);
        }

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

    studentTypeToStr: function(studentType) {
      for (prop in this.studentTypeEnum) {
        if (this.studentTypeEnum[prop] == studentType) {
          return prop;
        }
      }
    },

    onStudentAdded: function(tempStudent) {
      if (this.debugLevel > 0) console.log("StudentManager: onStudentAdded: totalStudents:",this.totalStudents," activeStudents:",this.activeStudents);

      if (!this.studentMap.has(tempStudent.id)) {
        this.activeStudents += 1;

        // store studentData object instead of melonjs Entity type?
        var studentData = new Object();
        studentData.name = tempStudent.name;
        studentData.id = tempStudent.id;
        studentData.startMonth = tempStudent.startMonth;
        studentData.entity = tempStudent;

        switch(tempStudent.dialog.testrandom) {
            case 0:
                studentData.studentType = this.studentTypeEnum.dabbler;
                break;
            case 1:
                studentData.studentType = this.studentTypeEnum.obsessive;
                break;
            case 2:
                studentData.studentType = this.studentTypeEnum.hacker;
                break;
            case 3:
                studentData.studentType = this.studentTypeEnum.balanced;
                break;
            default:
                studentData.studentType = this.studentTypeEnum.unknown;
        }

        this.studentMap.set(tempStudent.id, studentData);

        me.audio.play("positive");
      }

      // game.dojoSkillPanel = me.game.world.getChildByName("dojoSkillPanel")[0];
      // game.dojoSkillPanel.setText("DojoSkill:"+this.activeStudents);

      game.studentsPanel = me.game.world.getChildByName("studentsPanel")[0];
      game.studentsPanel.setText("Students: "+this.activeStudents);

    },

    onStudentRemoved: function() {
      if (this.debugLevel > 0) console.log("StudentManager: onStudentRemoved: totalStudents:",this.totalStudents," activeStudents:",this.activeStudents);

      me.audio.play("negative_2");
    },


});
