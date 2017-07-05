angular
  .module('spotifyApp')
  .directive('play', play);

function play() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/js/views/directives/play.html',
    scope: {
      track: '='
    },
    link: function(scope, element) {
      const audio = element[0].querySelector('audio');
      audio.src = scope.track;

      scope.playTrack = function() {
        audio.play();
        scope.trackIsPlaying = true;
      };

      scope.pauseTrack = function() {
        audio.pause();
        scope.trackIsPlaying = false;
      };
    }
  };
}
