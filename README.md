# dojo-sim-rpg
A simple rpg game based on html 5 game engine melonjs

copyright 2018 Jerry Kalkhof

This project is based off the html5 game engine melonjs.

## Major features
- top down, click to navigate map movement
- simple dialogue system
- ported pathfinding system

## version 1.0
This version is very basic and only has basic movement of the main character.
Simple conversations with other NPCs.

## This project was built using the following tools:
- atom - text editor
- tiled - tilemap editor
- twinejs - dialogue tree editor
- dialogue builder tool from Tomas Jurman
-- https://github.com/Kibo/dialoguesBuilder
- interactive dialog - dialogue system for MelonJS from Tomas Jurman
-- https://github.com/Kibo/melonjs-cookbook

## CREDITS
- Interior tileset from Zarth - rpg maker
- http://zharthrpg.blogspot.com/2014/03/building-ship-map.html
- Sprite characters from Bombone studios
- https://bombonestudios.tumblr.com/

## Run Instructions for Windows
1. install ubuntu - microsoft windows subsystem
	https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6#activetab=pivot:overviewtab
2. use nodejs to install http server
	mkdir node_modules
	sudo npm install http-server -g
3. run http server		
	export PATH=./node_modules/.bin:$PATH
	echo $PATH
	http-server -a localhost -p 8000 -c-1
4. run app from localhost
	http://localhost:8000/
	http://localhost:8000/dojo_sim/interactiveDialog/demo/

## build Instructions
1. cd to dojo_sim/interactiveDialog/demo
2. zip up local directory, upload to website

## Test live version
This game can also be tested live from my itch.io page:
https://jerryartist.itch.io/dojo-sim
