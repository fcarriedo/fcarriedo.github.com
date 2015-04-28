var CropView = Backbone.View.extend({
  events: {
    'mousedown .handle': 'startTracking',
    'mousemove #trackpad': 'onMouseMove',
    'mouseup   #trackpad': 'stopTracking',
  },
  refImgUrl: function() {
    return 'reference.jpg';
  },
  initialize: function() {
    this.tmpl = _.template($('#img-crop-tmpl').html(), {interpolate: /\{\{(.+?)\}\}/g});
  },
  render: function() {
    this.$el.html(this.tmpl({img: this.refImgUrl()}));

    // Some UI reverences
    this.$clipped = this.$('#ref-masked');
    this.$init = this.$('#init');
    this.$end = this.$('#end');

    return this;
  },
  startTracking: function(evt) {
    //console.log('started tracking');
    this.$activeHandle = $(evt.target);
    this.$activeHandle.addClass('active');
  },
  onMouseMove: function(evt) {
    if (this.$activeHandle) {
      if ($(evt.target).attr('id') === 'trackpad') {
        var coords = this.getCoords(evt);
        this.$activeHandle.css({'left': coords.x, 'top': coords.y});
        //console.log('mouse @ [' + coords.x + ', ' + coords.y + ']');

        var initPos = this.$init.position();
        var endPos = this.$end.position();

        var x = initPos.left;
        var y = initPos.top;
        var width = endPos.left;
        var height = endPos.top;

        var rect = 'rect(' + y + 'px, ' + width + 'px, ' + height + 'px, ' + x + 'px)';

        this.$clipped.css('clip', rect)
      }
    }
  },
  stopTracking: function(evt) {
    //console.log('stopped tracking');
    if (this.$activeHandle) {
      this.$activeHandle.removeClass('active');
      this.$activeHandle = null;
    }
  },
  getCoords: function(evt){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = evt.target;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while(currentElement = currentElement.offsetParent)

    canvasX = evt.pageX - totalOffsetX;
    canvasY = evt.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
  }
});
