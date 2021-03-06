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
    this.totalPages = Math.ceil(this.collection.length/this.collection.prodsPerPage);
    if(this.totalPages > 1) this.$bulletContainer.show(); // Only show when there is more than one page
  },
  render: function() {
    // Create the pages
    var pageViews = [];
    for(pageIx in _.range(this.totalPages)) {
      var page = new Page({id: pageIx});
      var pageView = new PageView({model: page});
      var bulletView = new BulletView({model: page});

      pageViews.push(pageView);

      this.$el.append(pageView.render().el);
      this.$bulletContainer.append(bulletView.render().el);
    }

    // Fill them with products
    var pgIx = -1;
    this.collection.each(function(prod, ix) {
      if((ix % this.collection.prodsPerPage) === 0) pgIx++;
      var prodView = new ProductView({model: prod});
      pageViews[pgIx].$el.append(prodView.render().el);
    }, this);

    return this;
  },
});
PageView = Backbone.View.extend({
  className: 'page',
  render: function() {
    this.$el.sortable({revert: true});
    this.$el.attr('id', 'page-' + this.model.id);
    return this;
  }
});
ProductView = Backbone.View.extend({
  className: 'product',
  render: function() {
    this.$el.html('<span class="product-info">sku: ' + this.model.get('sku') + '</span>');
    var self = this;
    this.$el.draggable({
      connectToSortable: '.page',
      cursor: 'move',
      addClasses: false,
      revert: 'invalid',
      helper: function(evt) {
        return self.$el.data('model', $(this).data('model'));
      }
    });

    return this;
  }
});
BulletView = Backbone.View.extend({
  className: 'bullet',
  hovered: false,
  hoverDelay: 1000,
  events: {
    'click'      : 'slideTo'
  },
  initialize: function() {
    this.page = this.model;
  },
  render: function() {
    this.$el.attr('title', 'Page ' + this.page.get('id'));
    var self = this;
    this.$el.droppable({
      accept: '.product',
      tolerance: 'pointer',
      over: function(evt, ui) {
        self.mouseIn();
      },
      out: function(evt, ui) {
        self.mouseOut();
      }
    });
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
