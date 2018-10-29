var DIALOGUES = {
	girl: {
		"actors": [ {
			"id": 10,
			"name": "hero"
		}, {
			"id": 20,
			"name": "girl"
		} ],
		"dialogues": [
			{
					"id": 10,
					"parent": null,
					"isChoice": false,
					"actor": 10,
					"conversant": 20,
					"menuText": "",
					"dialogueText": "Hello nice girl.",
					"conditionsString": "!this._sentence.onlyOnce",
					"codeBefore": "",
					"codeAfter": "this._sentence.onlyOnce = true;",
					"outgoingLinks": [ 20 ]
				},
				{
					"id": 20,
					"parent": 10,
					"isChoice": false,
					"actor": 20,
					"conversant": 10,
					"menuText": "",
					"dialogueText": "Nice to see you.",
					"conditionsString": "!this._sentence.onlyOnce",
					"codeBefore": "",
					"codeAfter": "this._sentence.onlyOnce = true;",
					"outgoingLinks": [ 30 ]
				},
				{
					"id": 30,
					"parent": 20,
					"isChoice": true,
					"conditionsString": "",
					"codeBefore": "",
					"codeAfter": "",
					"outgoingLinks": [ 40, 50 ]
				},
				{
					"id": 40,
					"parent": 30,
					"isChoice": false,
					"actor": 10,
					"conversant": 20,
					"menuText": "Invite to party",
					"dialogueText": "Can I invite you to a party?",
					"conditionsString": "",
					"codeBefore": "if( this._data.numberOfInvitation >= 2 ) this._sentence.outgoingLinks = [70];",
					"codeAfter": "this._data.numberOfInvitation++;",
					"outgoingLinks": [ 60 ]
				},
				{
					"id": 50,
					"parent": 30,
					"isChoice": false,
					"actor": 10,
					"conversant": 20,
					"menuText": "Leave",
					"dialogueText": "Good by.",
					"conditionsString": "",
					"codeBefore": "",
					"codeAfter": "",
					"outgoingLinks": []
				},
				{
					"id": 60,
					"parent": 40,
					"isChoice": false,
					"actor": 20,
					"conversant": 10,
					"menuText": "",
					"dialogueText": "Sorry, I am in a hurry.",
					"conditionsString": "",
					"codeBefore": "",
					"codeAfter": "",
					"outgoingLinks": []
				},
				{
					"id": 70,
					"parent": 60,
					"isChoice": false,
					"actor": 20,
					"conversant": 10,
					"menuText": "",
					"dialogueText": "Thank you for the invitation. I'm sure I will.",
					"conditionsString": "",
					"codeBefore": "",
					"codeAfter": "",
					"outgoingLinks": [ ]
				}
			],

		numberOfInvitation:0
	},
	"student": {
		"actors": [
			{
				"id": 10,
				"name": "hero"
			},
			{
				"id": 30,
				"name": "student"
			}
		],
		"dialogues": [
		{
			"id": 5,
			"parent": null,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "if (!this.signedup && !this.turnedaway) {this.testrandom=Math.floor(Math.random() * Math.floor(4));}",
			"codeAfter": "",
			"outgoingLinks": [
				10,
				20,
				30,
				40
			]
		},
		{
			"id": 10,
			"parent": 5,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "dabbler student",
			"dialogueText": "Wow I love this style of martial arts! It is so cool, all the forms, and training seem so exciting! How can I sign up for classes?",
			"conditionsString": "this.testrandom == 0 && !this.signedup && !this.turnedaway",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				15
			]
		},
		{
			"id": 15,
			"parent": 10,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				50,
				55
			]
		},
		{
			"id": 20,
			"parent": 5,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "obsessive student",
			"dialogueText": "This is the best school in the area right? I want to get my skills fast.  Of course I want to sign up for classes. What else can I do to learn?",
			"conditionsString": "this.testrandom == 1 && !this.signedup && !this.turnedaway",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				25
			]
		},
		{
			"id": 25,
			"parent": 20,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				60,
				65
			]
		},
		{
			"id": 30,
			"parent": 5,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "hacker student",
			"dialogueText": "I'm looking for a safe fun way to learn martial arts. This would be great for me to stay in shape. Is this the right place for me?  How can I sign up for classes?",
			"conditionsString": "this.testrandom == 2 && !this.signedup && !this.turnedaway",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				35
			]
		},
		{
			"id": 35,
			"parent": 30,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				70,
				75
			]
		},
		{
			"id": 40,
			"parent": 5,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "well balanced student",
			"dialogueText": "I'm looking for a challenging martial art that will help me grow as a person.  Its only through hard work that we can appreciate good progress right?  Is this a good place for me to learn?",
			"conditionsString": "this.testrandom == 3 && !this.signedup && !this.turnedaway",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				45
			]
		},
		{
			"id": 45,
			"parent": 40,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				80,
				85
			]
		},
		{
			"id": 50,
			"parent": 15,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "sign them up",
			"dialogueText": "Yes, this martial art is really cool. We have lots of forms, and other types of training as well. The classes are 3 days a week, we are happy to have you!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				51
			]
		},
		{
			"id": 51,
			"parent": 50,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Thanks, I'll see you tomorrow!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.signedup = true;",
			"outgoingLinks": []
		},
		{
			"id": 55,
			"parent": 15,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "turn them away",
			"dialogueText": "Well, the martial art is very exciting, but it takes a lot of hard work and dedication to reach a good level of expertise.  I just don't feel like this is the right martial art for you.  Perhaps you can try the another martial arts dojo that has fancier looking techniques and traditions down the street.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				56
			]
		},
		{
			"id": 56,
			"parent": 55,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Oh, I didn't realize there was a fancier, prettier form of martial arts in town, I'll go check that out.  Thanks.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.turnedaway = true;",
			"outgoingLinks": []
		},
		{
			"id": 60,
			"parent": 25,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "sign them up",
			"dialogueText": "Well, you've come to the right place.  We have an excellent program to help you learn fast.  We also sell books and videos as well. The classes are 3 days a week, we are happy to have you!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				61
			]
		},
		{
			"id": 61,
			"parent": 60,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "That's great! I'm going to be the learning the fastest in your school.  See you tomorrow!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.signedup = true;",
			"outgoingLinks": []
		},
		{
			"id": 65,
			"parent": 25,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "turn them away",
			"dialogueText": "Although you can learn very quickly at first, there will be a lot of hard difficult techniques that will take time and dedication to learn.  I just don't feel like you are going to be a consistent student when things become difficult.  Perhaps there is another school in town that will get you the fast results you want.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				66
			]
		},
		{
			"id": 66,
			"parent": 65,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Well, I won't be wasting my time with your style then, I just want fast results.  Thanks for the heads up.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.turnedaway = true;",
			"outgoingLinks": []
		},
		{
			"id": 70,
			"parent": 35,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "sign them up",
			"dialogueText": "We definitely have a good program for you.  Our instruction is very practical, and is done safely.  With all of the movement, I'm sure it will help you get into shape.  The classes are 3 days a week, we are happy to have you!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				71
			]
		},
		{
			"id": 71,
			"parent": 70,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Thanks, it will be a great break after my office job tomorrow!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.signedup = true;",
			"outgoingLinks": []
		},
		{
			"id": 75,
			"parent": 35,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "turn them away",
			"dialogueText": "Well, even though we take a lot of precautions, this martial art is inherently dangerous.  The other martial artists will be quite intense, and unless your willing to have a high degree of commitment, I feel it would be safer for you to practice another softer style of martial arts.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				76
			]
		},
		{
			"id": 76,
			"parent": 75,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Oh, I didn't realize that your dojo was like that.  Thanks for the warning, I'll try to find a safe fun place to train somewhere else.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.turnedaway = true;",
			"outgoingLinks": []
		},
		{
			"id": 80,
			"parent": 45,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "sign them up",
			"dialogueText": "Well this martial art is definitly challenging, and it will take many years to learn.  We'll be sure to guide your progress so that you will have skills and discipline as well. The classes are 3 days a week, we are happy to have you!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				81
			]
		},
		{
			"id": 81,
			"parent": 80,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Thanks!  I'll make sure to get to class on time tomorrow, see you then!",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.signedup = true;",
			"outgoingLinks": []
		},
		{
			"id": 85,
			"parent": 45,
			"isChoice": false,
			"actor": 10,
			"conversant": 30,
			"menuText": "turn them away",
			"dialogueText": "We are an intense martial arts dojo, and we don't have a flowery style of philosophy, we expect hard intense training and that's it.  If you are looking for a spiritual philosophy to go with it, I thnk you are better off training somewhere else.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [
				86
			]
		},
		{
			"id": 86,
			"parent": 85,
			"isChoice": false,
			"actor": 30,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Oh, I didn't realize you guys were like that.  Sorry I bothered you, I'll look elsewhere.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "this.turnedaway = true;",
			"outgoingLinks": []
		}

		]
	}
};
