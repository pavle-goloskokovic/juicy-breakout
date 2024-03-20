﻿package com.grapefrukt.games.general.gameobjects {
	
	import com.grapefrukt.games.general.collections.GameObjectCollection;
	import com.grapefrukt.games.general.events.GameObjectEvent;
	import flash.display.Sprite;
	import com.grapefrukt.games.general.namespaces.grapelib;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	/**
	 * ...
	 * @author Martin Jonasson (grapefrukt@grapefrukt.com)
	 */
	[Event(name = "gameobjectevent_detach", type = "com.grapefrukt.games.general.events.GameObjectEvent")]
	
	public class GameObject extends Sprite {
		
		public var velocityX:Number = 0;
		public var velocityY:Number = 0;
		
		protected var _flagged_for_removal	:Boolean = false;
		protected var _auto_remove			:Boolean = true;
		
		public function GameObject() {
		
		}

		public function update(timeDelta:Number = 1):void {
			x += velocityX * timeDelta;
			y += velocityY * timeDelta;
		}
		
		public function get flaggedForRemoval():Boolean { return _flagged_for_removal; }
		
		public function remove():void {
			_flagged_for_removal = true;
			dispatchEvent(new GameObjectEvent(GameObjectEvent.REMOVE, this, null));
			if (_auto_remove) handleRemoveComplete();
		}
		
		protected function handleRemoveComplete():void {
			if(parent) parent.removeChild(this);
		}
		
		grapelib function handleDetach(collection:GameObjectCollection):void {
			dispatchEvent(new GameObjectEvent(GameObjectEvent.DETACH, this, collection));
		}
		
		public function getDistance(other:GameObject):Number {
			return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
		}
		
		public function get velocity():Number {
			return Math.sqrt(velocityX * velocityX + velocityY * velocityY);
		}
		
		public function set velocity(value:Number):void {
			var ratio:Number = value / velocity;
			velocityX = velocityX * ratio;
			velocityY = velocityY * ratio;
		}
	}
	
}