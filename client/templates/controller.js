var CONTROLLER_WIDTH = 200;
var position = new ReactiveVar(0);

Template.controller.helpers({
    notSynced : function(){
        return !this.sync;
    },

    absolutePosition : function(){
        return position.get();
    }
});

Template.controller.rendered = function(){
    var draggable = this.$('.controller')[0];
    var player = Template.instance().data.player;
    var inputStream = new Meteor.Stream('inputs');



    draggable.addEventListener('touchmove', function(event) {
        var touch = event.targetTouches[0];
        // Place element where the finger is
        //draggable.style.left = touch.pageX + 'px';
        //draggable.style.top = touch.pageY-25 + 'px';
        
        // Players.update({ _id : player._id }, {
        //     $set : {
        //         position : Helpers.absolutePositionToRelative(touch.pageX)
        //     }
        // });
        
        position.set(touch.pageY);

        inputStream.emit('move', {
            playerId : player._id,
            position: Helpers.absolutePositionToRelative(touch.pageY)
        });

        event.preventDefault();
    }, false);

    
    var v = player.position || 0;

    $('html').keydown(function(e){
        function move(d){
            v = v + d;
            //PlayerPositions.update({ _id : position._id }, { left : v });
            
            // Players.update({ _id : player._id }, {
            //     $set : {
            //         position : Helpers.absolutePositionToRelative(v)
            //     }
            // });

            position.set(v);

            inputStream.emit('move', {
                playerId : player._id,
                position: Helpers.absolutePositionToRelative(v)
            });
        }

        var UP = 38;
        var DOWN = 40;

        switch(e.which){
            case UP:
                move(-10);
                break;
            case DOWN:
                move(10);
                break;
        }
    });
};