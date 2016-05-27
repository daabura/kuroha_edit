//=============================================================================

// Simple Battle Status Faces

// by lolaccount

// Last Updated: 2015.11.9

//=============================================================================



/*:

 * @plugindesc v1.01 Draws the actor's face in battle status, with the  

 * goal of not blocking the actor's faces too much.

 * <lolaccount Simple Battle Status Faces>

 *

 * @author lolaccount

 *

 * @param ---Compatibility---

 * @default

 *

 * @param Show ATB Bar

 * @desc Show ATB bar for ATB plugins?

 * Yes - true        No - false        Default: true    

 * @default true

 *

 * @param ATB Bar Position

 * @desc Options: bottomleft, bottomright Default: bottomleft

 * @default bottomleft

 *

 * @help This plugin does not provide plugin commands.

 * You can hide the tp bar for an actor by using <HideBattleStatusTp: 1> and/or

 * hide the mp bar for an actor by using <HideBattleStatusMp: 1>

 * ============================================================================

 * Patch Notes

 * ============================================================================

 * v1.01 - Added some support for Ellye's Simple ATB. The bar needs improving

 * for the default resolution, but looks good fullscreen. Will improve

 * default resolution ATB bar in an update.

 * Added some support for default resolution and 3 party members.

 * Still won't look very good with more than 3 party members with default

 * resolution.

 * ============================================================================

 * How To Use

 * ============================================================================

 * Plug and play.

 * ============================================================================

 * Terms Of Use

 * ============================================================================

 * Free to use and modify for commercial and noncommercial games, with or

 * without credit, as long as you do not claim the script as your own.

 * Credit is appreciated though.

 */

var Imported = Imported || {};

 

 // Get parameters

(function() {

    var parameters = $plugins.filter(function(p) {

        return p.description.contains('<lolaccount Simple Battle Status Faces>');

    })[0].parameters; //Thanks to Iavra

  // whether to show ATB bar if that is the battle system

  var showATBbar = String(parameters['Show ATB Bar'] || 'true');

  // where to draw atb bar

  var atbBarPos = String(parameters['ATB Bar Position'] || 'bottomleft');

  showATBbar = eval(showATBbar);

 

// override the difficult itemRect for a window

Window_BattleStatus.prototype.itemRect = function(index) {

    var rect = new Rectangle();

    var maxCols = this.maxCols();

    rect.width = this.itemWidth();

    rect.height = this.itemHeight();

    rect.x = rect.width * index;

    rect.y = 0;

    return rect;

};



Window_BattleStatus.prototype.itemWidth = function() {

// decide the width of each "item," or the space each actor occupies in battle status, by the size of the party

    return Math.floor(((this.width - this.padding * 2 +

                       this.spacing()) / 1 - this.spacing())/$gameParty.battleMembers().length);

};



Window_BattleStatus.prototype.maxCols = function() {

// the maximum amount of columns is the number of members in the party

    return $gameParty.battleMembers().length;

};



Window_BattleStatus.prototype.itemHeight = function() {

// the height of each item is the height of the battle status window minus from padding so it looks nicer

    return Math.floor((this.height - this.padding * 2 +

                       this.spacing()) / 1 - this.spacing());

};





Window_BattleStatus.prototype.drawItem = function(index) {

    // we can get the actor from the index passed to this function

    var actor = $gameParty.battleMembers()[index];            

    // the rectangle w/dimensions from another method designed for text

    var textRect = this.itemRectForText(index);            

    // a general rectangle from another method    

    var otherRect = this.itemRect(index);            

    // variable for deciding where to place state/buff icons, x axis    

    var iconPos;    

    // variable for deciding iconWidth

    var iconWidth;

    // variable for deciding where to place tp bar, y axis

    // we're setting the default here

    var tpBarY = otherRect.y + (this.lineHeight() * 2);    

    var gaugeWidth;

    var gaugeX;

    

    // decide gauge width and x

    if ((SceneManager._screenWidth <= 816 && $gameParty.battleMembers().length == 3)) {

    gaugeWidth = otherRect.width - (Window_Base._faceWidth * .8) - 11;

    gaugeX = otherRect.x + (Window_Base._faceWidth * .8) + 4;

    }

    else {

    gaugeWidth = otherRect.width - Window_Base._faceWidth - 11;

    gaugeX = otherRect.x + Window_Base._faceWidth + 4;

    }

    

    // draw the actor's face on the bottom most "layer"

    this.drawActorFace(actor, otherRect.x, otherRect.y);

    



    

    // draw Mellye's Simple ATB atb bar if imported

    if (Imported.Ellye_ATB == true && showATBbar) {

        if (atbBarPos == 'bottomleft') {

            this.drawActorATB(actor, otherRect.x + 4, textRect.y + this.lineHeight() * 3, Window_Base._faceWidth - 6);

        }

        else if (atbBarPos == 'bottomright') {

            this.drawActorATB(actor, otherRect.x + Window_Base._faceWidth + 4, textRect.y + this.lineHeight() * 3, otherRect.width - Window_Base._faceWidth - 11);

        }

    }

    

    // draw the actor's name

    this.drawActorName(actor, textRect.x, textRect.y, 150);



    // draw actor hp bar

    this.drawActorHp(actor, gaugeX, otherRect.y + (this.lineHeight() * 0), gaugeWidth);

    

    // draw the actor's mp if it is not set to be hidden for the actor

    if ($dataActors[actor._actorId].meta.HideBattleStatusMp != 1) {

        this.drawActorMp(actor, gaugeX, otherRect.y + (this.lineHeight() * 1), gaugeWidth);

    }

    else {

    // if it was set to be hidden, we should adjust the tp bar y position

    tpBarY = otherRect.y + (this.lineHeight() * 1);

    }



    // if tp is on, draw the actor's tp

    if ($dataSystem.optDisplayTp) {

        // draw the tp bar if it was not set to be hidden for the actor

        if ($dataActors[actor._actorId].meta.HideBattleStatusTp != 1) {

            this.drawActorTp(actor, gaugeX, tpBarY, gaugeWidth);

        }

    }

    

    if (Imported.Ellye_ATB != true) {



        iconWidth = otherRect.width;

        // if there are many icons taking up the actor's space in the status, shove the icons to the right

        if ((actor.allIcons().length * Window_Base._iconWidth - 3) > otherRect.width - Window_Base._faceWidth) {

            iconPos = otherRect.x + 1 + (otherRect.width - (actor.allIcons().length * Window_Base._iconWidth) - 3);

        }

        // if there's not too many icons taking up the actor's space in the status, don't shove the icons all the way to the right

        else {

            iconPos = otherRect.x + Window_Base._faceWidth + 4;

        }

    }

    else if (showATBbar) {

        if (atbBarPos == 'bottomleft') {

            iconWidth = otherRect.width - Window_Base._faceWidth - 4;

            iconPos = otherRect.x + Window_Base._faceWidth + 4;

        }

        else if (atbBarPos == 'bottomright') {

            iconWidth = Window_Base._faceWidth;

            iconPos = otherRect.x + 4;

        }

        // the default - bottom left

        else {

            iconWidth = Window_Base._faceWidth + - 4;

        }

    }

    

    // draw the icons

    this.drawActorIcons(actor, iconPos, otherRect.y + (this.lineHeight() * 3), iconWidth);

};



})();


