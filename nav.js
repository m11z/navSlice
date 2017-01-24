/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

  "use strict";

    // Create the defaults once
    var pluginName = "navSlice",
      $window = $(window),
      $dom = {
        nav: null,
        navFirstItem: null,
        moreButton: null,
        moreDropdown: null
      },
      more = false,
      moreButton = false,
      initiated = false,
      navListTag = 'li',
      firstItemTopPosition,
      lvlOneClass,
      slicedTotalWidth = 0,
      sliced = [],
      settings = {},
      defaults = {
        classes: {
          init: 'navslice-init',
          more: 'navslice-more',
          moreTitle: 'navslice-more-title',
          moreDropdown: 'navslice-more-dropdown',
          sliced: 'navslice-sliced',
          unSliced: 'navslice-unsliced',
          moreButton: function () {}
        },
        caption: {
          more: 'More'
        },
        moreWidth: 120,
      };

    // The actual plugin constructor
    function Plugin ( element, options ) {
      this.element = element;
      $dom.nav = $(this.element);

      // jQuery has an extend method which merges the contents of two or
      // more objects, storing the result in the first object. The first object
      // is generally empty as we don't want to alter the default options for
      // future instances of the plugin
      this.settings = $.extend(true, {}, defaults, options );
      settings = this.settings;
      this._defaults = defaults;
      this._name = pluginName;

      this.init();

      // Added init flag
      initiated = true;

      console.log(sliced)
    };

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {

      init: function() {

        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.settings
        // you can add more functions like the one below and
        // call them like the example bellow

        this.updateVars();
        this.checkposition();
        this.createMoreButtonHtml();
        this.createMoreWrapper();
        this.moveItems();

        $window.on('resize', function() {

          Plugin.prototype.updateVars();
          Plugin.prototype.checkposition();
          Plugin.prototype.createMoreWrapper();
          Plugin.prototype.moveItems();

        });


      },

      updateVars: function () {

        if ( !initiated ) {

          // Get first navigation list item element
          if ( $dom.navFirstItem == null ) {
            $dom.navFirstItem = $dom.nav.children().first();
          }
          
          // Getting class from navigation first item
          if ( lvlOneClass == null ) {
            lvlOneClass = $dom.navFirstItem.attr('class');
          }

          // Getting and update on 'resize' value
          // Responsive navigation items can change
          // theirs position from document beguning
          firstItemTopPosition = $dom.navFirstItem.position().top;
        };

      },

      checkposition: function () {

        $dom.nav.children(':not(.' + settings.classes.more + ')').each(function (i) {

          var $cur = $(this),
              curTop = $cur.position().top;

          if ( curTop > firstItemTopPosition ) {

            var itemWidth = $cur.outerWidth(true),
                itemBP = $window.width(),
                itemTotalWidth = itemWidth + itemBP;

            $cur.addClass(settings.classes.sliced);

            if ( $cur.hasClass(settings.classes.unSliced) ) {
              $cur.removeClass(settings.classes.unSliced)
            }

            sliced[i] = {
              ID: i,
              item: $cur,
              data: {
                width: itemWidth,
                BP: itemBP,
                total: itemTotalWidth,
                showWidth: 0
              }
            };

            more = true;
          }

        });

        if ( more ) {
          $dom.nav
            .addClass(settings.classes.init)
            .css('padding-right', settings.moreWidth);
          } 

        for ( var i = 0; i < sliced.length; i++ ) {
          if ( sliced[i] != undefined ) {
            slicedTotalWidth += sliced[i].data.width;
          }
        }

        for ( var i = 0; i < sliced.length; i++ ) {
          if ( sliced[i] != undefined ) {
            sliced[i].data.showWidth = sliced[i].data.total + slicedTotalWidth + settings.moreWidth;
          }
        }

      },

      createMoreButtonHtml: function () {

        // Getting navigation list items tag name
        var _navListTag = $dom.navFirstItem[0].nodeName.toLowerCase();

        // Setting class for more wrapper
        if ( $dom.navFirstItem.attr('class') ) {
          settings.classes.moreButton = $dom.navFirstItem.attr('class') + ' ' + settings.classes.more;
        } else {
          settings.classes.moreButton = settings.classes.more;
        }

        // Getting navigation list items tag name
        if ( !_navListTag === 'li' ) {
          navListTag = 'div';
        };

        // Return html string to variable
        $dom.moreButton = '<' + navListTag + ' class="' + settings.classes.moreButton + '"><span class="' + settings.classes.moreTitle + '">' + settings.caption.more + '</span><ul class="' + settings.classes.moreDropdown + '"></ul></' + navListTag + '>';

      },

      createMoreWrapper: function () {
        // Check if more button needed
        if ( more && !moreButton ) {

          // Append our html string to initiated element
          $dom.nav.append($dom.moreButton);

          // Flag that more wrapper and submenu created
          moreButton = true;

          // Return jquery object to variable
          $dom.moreButton = $dom.nav.find($('.' + settings.classes.more));
          $dom.moreDropdown = $dom.nav.find($('.' + settings.classes.moreDropdown));
        }
      },

      moveItems: function () {

        var winWidth = $window.width(),
            _sliced;

        for ( var i = 0; i < sliced.length; i++ ) {
          if ( sliced[i] != undefined ) {

            var $cur = sliced[i].item,
                curTotal = sliced[i].data.total;

            $cur.appendTo($dom.moreDropdown);

            if ( curTotal < winWidth ) {
              $cur.removeClass(settings.classes.sliced)
                  .addClass(settings.classes.unSliced)
                  .insertBefore($dom.moreButton);

              _sliced = sliced.splice(i, 1);

              if ( sliced[i] == undefined ) {
                Plugin.prototype.destroy();
              }
            }
          }
        }

      },

      destroy: function () {

        $dom.moreButton.remove();

        $dom.nav
          .removeClass(settings.classes.init)
          .css('padding-right', 0);

        more = false,
        moreButton = false,
        // $dom.moreButton = null,
        $dom.moreDropdown = null,
        initiated = false;

      }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
      return this.each( function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" +
            pluginName, new Plugin( this, options ) );
        }
      } );
    };

})( jQuery, window, document );