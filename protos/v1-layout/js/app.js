var Backplane = Backbone.Model.extend({
  initialize: function() {
    // Initialize dispensers as a collection
    this.set('dispensers', new Dispensers(this.get('dispensers')));
  }
});

var Dispenser = Backbone.Model.extend({});

var Dispensers = Backbone.Collection.extend({
  model: Dispenser,
  comparator: 'id'
});

var DispenserView = Backbone.View.extend({
  className: 'dispenser',
  initialize: function(opts) {
    // Apply the same scaleFactor in both width and height to maintain the same
    // aspect ratio.
    this.displayWidth = this.model.get('width') * opts.scaleFactor;
    this.displayHeight = this.model.get('height') * opts.scaleFactor;
  },
  render: function() {
    this.$el.text(this.model.id);
    // Set the display width/height
    this.$el.css({width: this.displayWidth, height: this.displayHeight});
    // Set the title text for info when hover
    this.$el.attr('title', 'Dispenser #' + this.model.id + ', dimensions: ' + this.model.get('width') + 'w x ' + this.model.get('height') + 'h [mm]');
    return this;
  }
});

/**
 * Represents a line of dispensers. Each line can be horizontal (row oriented)
 * or vertical (column oriented).
 */
var DispensersLineView = Backbone.View.extend({
  className: 'line',
  initialize: function(opts) {
    this.dispenserFlow = opts.dispenserFlow;
    this.scaleFactor = opts.scaleFactor;
    this.line = opts.line;
  },
  render: function() {
    this.$el.addClass(this.dispenserFlow);

    _.each(this.line, function(disp) {
      this.$el.append(new DispenserView({model: disp, scaleFactor: this.scaleFactor}).render().el);
    }, this);

    return this;
  }
});

var BackplaneView = Backbone.View.extend({
  id: 'backplane',
  initialize: function() {
    this.dispenserFlow = this.model.get('dispenserFlow');
    this.dispenserLines = this.getDispenserLines();
  },
  render: function() {
    this.$el.addClass(this.dispenserFlow + '-oriented');

    // The scale factor for the backplane, based on the available display area.
    var scaleFactor = this.calculateScaleFactor();

    _.each(this.dispenserLines, function(line) {
      this.$el.append(new DispensersLineView({line: line, dispenserFlow: this.dispenserFlow, scaleFactor: scaleFactor}).render().el);
    }, this);

    return this;
  },
  getDispenserLines: function() {
    // Break it in lines for display. Each line will be either horizontal (row)
    // or vertical (column).
    var dispensers = this.model.get('dispensers');
    var linesNum = dispensers.where({end: true}).length;
    return dispensers.reduce(function(acc, disp) {
      acc[acc.length-1].push(disp);
      if (disp.get('end') && acc.length < linesNum) {
        acc.push([]);
      }
      return acc;
    }, [[]]);
  },
  calculateScaleFactor: function() {
    var container = $('#backplane-container');
    // We do a pixel to millimeter mapping (1mm = 1px). If it doesn't fit the
    // available area, we scale them down to fit. Requires the
    // #backplane-container to have rendered css width/height.
    var mmDimen = this.calculateBackplaneDimensions();
    var pxDimen = {width: container.width(), height: container.height()};

    var widthRatio  = pxDimen.width / mmDimen.width;
    var heightRatio = pxDimen.height / mmDimen.height;

    // Choose the smallest one since it is the most extreme one that has to fit
    // in the space available.
    var scaleFactor = widthRatio < heightRatio ? widthRatio : heightRatio;
    // Give it a little breathing space (1%) for the borders
    scaleFactor = scaleFactor - 0.01;

    return scaleFactor;
  },
  // Calculates the backplane dimensions (in millimiters) adding the widths and
  // heights of the composing dispensers.
  calculateBackplaneDimensions: function() {
    switch(this.dispenserFlow) {
      case 'row':
        // Find the widths of every line
        var lineWidths = _.map(this.dispenserLines, function(line) {
          // return total width of line adding all widths of its dispensers
          return _.reduce(line, function(acc, disp) {return acc + disp.get('width')}, 0);
        });
        // The width of the backplane is the width of the longest line.
        var width = _.max(lineWidths);

        // Add the heights of the first dispenser of every line. Assumes all
        // dispensers on the same row are the same height as row oriented.  The
        // first sample is representative.
        var height = _.reduce(this.dispenserLines, function(acc, line) {return acc + line[0].get('height')}, 0);

        return {width: width, height: height};

      case 'column':
        // Add the widths of the first dispensers of every line.  Assumes all
        // dispensers on the same column to be the same width as column
        // oriented. The first sample is representative.
        var width = _.reduce(this.dispenserLines, function(acc, line) {return acc + line[0].get('width')}, 0);

        // Find the heights of every line
        var lineHeights = _.map(this.dispenserLines, function(line) {
          // return total height of line adding all heights of its dispensers
          return _.reduce(line, function(acc, disp) {return acc + disp.get('height')}, 0);
        });
        // The height of the backplane is the height of the longest line.
        var height = _.max(lineHeights);

        return {width: width, height: height};
    }
  }
});

var AppView = Backbone.View.extend({
  events: {
    'change #backplane-select' : 'selectBackplane'
  },
  initialize: function() {
    // Select the active option (first) on the select.
    this.selectBackplane();
  },
  render: function() {
    this.$('#backplane-container').html(new BackplaneView({model: this.model}).render().el);
    return this;
  },
  selectBackplane: function(evt) {
    // Note: The backplane's JSON comes from `js/data.js`
    switch(this.$('#backplane-select').val()) {
      case '120A':
        this.model = new Backplane(backplane120A);
        break;
      case '50A':
        this.model = new Backplane(backplane50A);
        break;
    }

    // render it.
    this.render();
  }
});
