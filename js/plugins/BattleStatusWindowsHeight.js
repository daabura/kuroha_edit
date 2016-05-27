//=============================================================================
// BattleStatusWindowsHeight.js
//=============================================================================

var Imported = Imported || {};
Imported.BattleStatusWindowsHeight = true;
var BattleStatusWindowsHeight = BattleStatusWindowsHeight || {};

/*:
 * @plugindesc BattleStatusWindowsHeight
 * @author Michael Dionne
 *
 * @help ....
 * @param Height
 * @desc Use this to set the quantity of line height. Def: 5
 * @default 5
 *
 */

(function() {


	Window_BattleStatus.prototype.initialize = function()
	{
		BattleStatusWindowsHeight.Parameters = PluginManager.parameters('BattleStatusWindowsHeight');
		BattleStatusWindowsHeight.Param = BattleStatusWindowsHeight.Param || {};
		BattleStatusWindowsHeight.Param.lineheightx = Number(BattleStatusWindowsHeight.Parameters['Height'] || 5);
	
		var width = this.windowWidth();
		var height = this.windowHeight();
		var lineHeight = this.lineHeight();
		var linesqt = BattleStatusWindowsHeight.Param.lineheightx;

		
		height = lineHeight*linesqt;
		var x = Graphics.boxWidth - width;
		var y = Graphics.boxHeight - height;
		var selectable = Window_Selectable.prototype.initialize.call(this, x, y + BattleStatusWindowsHeight.Param.lineheightx, width, height);
		this.refresh();
		this.openness = 0;
    };




	
})();




