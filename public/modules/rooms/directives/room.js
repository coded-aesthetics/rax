'use strict';

angular.module('rooms')

.directive('roomOverview', function() {

    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            //var paper = new Raphael();


            var id = element.prop("id");
            function buildThing(room) {
                console.log(room);
                var paper = new Raphael(id, room.size.width, room.size.height);

                var walls = paper.rect(0, 0, room.size.width, room.size.height);
                walls.attr("stroke", "#000");
                walls.attr("stroke-width", "5");
                for (var i = 0; i < room.cabinets.length; i++) {
                    var cur = room.cabinets[i];
                    var cab = paper.rect(cur.pos.x, cur.pos.y, cur.size.width, cur.size.height);
                    cab.attr("stroke", "#000");
                }
            }

            attrs.$observe("room", function(test) {
                console.log(test.length);
                var obj = JSON.parse(test);
                if (obj._id) {
                    buildThing(JSON.parse(test));
                }
            });
        }
    };
});