// Models
Product = Backbone.Model.extend({});
Page = Backbone.Model.extend({});
Bullet = Backbone.Model.extend({});

// Collections
ProductList = Backbone.Collection.extend({
  model: Product,
  prodsPerPage: 2,
});

// Views
ProductListView = Backbone.View.extend({
  el: $('#page-viewport'),
  initialize: function() {
    this.$bulletContainer = $('#bullet-container').hide();
  },
  render: function() {
    var numPages = Math.ceil(this.collection.length/this.collection.prodsPerPage);
    if(numPages > 1) this.$bulletContainer.show(); // Only show when there is more than one page
    for(pageIx in _.range(numPages)) {
      var page = new Page({id: pageIx});
      var pageView = new PageView({model: page});
      var bulletView = new BulletView({model: page});

      this.$el.append(pageView.render().el);
      this.$bulletContainer.append(bulletView.render().el);
    }
    var ix = 0;
    this.collection.each(function(prod) {
    }, this);

    return this;
  }
});
PageView = Backbone.View.extend({
  className: 'page',
  render: function() {
    this.$el.attr('id', 'page-' + this.model.id);
    return this;
  }
});
ProductView = Backbone.View.extend({
  className: 'product',
  render: function() {return this}
});
BulletView = Backbone.View.extend({
  className: 'bullet',
  hovered: false,
  hoverDelay: 1000,
  events: {
    'click'      : 'slideTo',
    'mouseenter' : 'mouseIn',
    'mouseleave' : 'mouseOut'
  },
  initialize: function() {
    this.page = this.model;
  },
  render: function() {
    this.$el.attr('title', 'Page ' + this.page.get('id'));
    return this;
  },
  mouseIn: function() {
    this.$el.addClass('active');
    this.hovered = true;
    var self = this;
    setTimeout(function() {
      if(self.hovered) {
        self.$el.addClass('sliding');
        self.slideTo();
      }
    }, this.hoverDelay);
  },
  mouseOut: function() {
    this.$el.removeClass('active');
    this.$el.removeClass('sliding');
    this.hovered = false;
  },
  slideTo: function() {
    var id = '#page-' + this.page.get('id');
    $('.page').removeClass('active');
    $(id).addClass('active');
    $('#page-viewport').scrollTo(id, 350, {over: -0.12});
  }
});
