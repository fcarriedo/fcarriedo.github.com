var CropView = Backbone.View.extend({
  events: {
    'click #trackpad': 'defineHandle',
    'click #discard' : 'clearInit',
  },
  activeStep: 0,
  refImgUrl: function() {
    return 'reference.jpg';
  },
  initialize: function() {
    this.tmpl = _.template($('#img-crop-tmpl').html(), {interpolate: /\{\{(.+?)\}\}/g});

    this.$imgContainer = this.$('#img-container');
  },
  render: function() {
    this.$imgContainer.html(this.tmpl({img: this.refImgUrl()}));

    // Some UI reverences
    this.$clipped = this.$('#ref-masked');
    this.$trackpad = this.$('#trackpad');
    this.$discard = this.$('#discard');

    return this;
  },
  clearInit: function() {
    // reinitialize clipped with 0 dimensions
    this.$clipped.css('clip', 'rect(0px,0px,0px,0px)');
    // remove the handles
    this.$('.handle').remove();
    // reset the step
    this.activeStep = 0;
    // select the step
    this.selectStep(this.activeStep);
    // Disable discard
    this.$discard.attr('disabled', true);
  },
  defineHandle: function(evt) {
    var coords = this.getCoords(evt);
    if (this.activeStep === 0) {
      this.selectStep(++this.activeStep);

      var $initHandle = $("<div id='init' class='handle'><hr class='vertical'/><hr class='horizontal'/></div>");
      $initHandle.css({'left': coords.x, 'top': coords.y});

      this.$trackpad.append($initHandle);

    } else if (this.activeStep === 1) {
      this.selectStep(++this.activeStep);

      var $endHandle = $("<div id='end' class='handle'><hr class='vertical'/><hr class='horizontal'/></div>");
      $endHandle.css({'left': coords.x, 'top': coords.y});

      this.$trackpad.append($endHandle);

      // mark end point and perform cropping
      var initPos = this.$('#init').position();
      var endPos = this.$('#end').position();

      var x = initPos.left;
      var y = initPos.top;
      var width = endPos.left;
      var height = endPos.top;

      var rect = 'rect(' + y + 'px, ' + width + 'px, ' + height + 'px, ' + x + 'px)';

      this.$clipped.css('clip', rect);

      // Enable discard at this point
      this.$discard.attr('disabled', false);
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
  },
  selectStep: function(step) {
    // Clear all previous active steps
    this.$('.step').removeClass('active');
    // Select new step
    this.$('#step-' + step).addClass('active');
  }
});
