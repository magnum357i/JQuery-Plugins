/**
 * jquery.collapselist.js
 *
 * @version: v1.01
 * @author: Magnum357 (https://github.com/magnum357i)
 * @license: MIT
 */

;( function ( $ ) {

	'use strict';

	var
	pluginName = 'collapseList',
	defaults   = {
		moreText: 'and there are %limit% items',
		limit:     3
	};

	function Plugin( element, options ) {

		this.$element = $( element );
		this.$liCount = this.$element.children().length;
		this.options  = $.extend( {}, defaults, options );

		this.init();
	}

	Plugin.prototype = {

		init: function() {

			var self = this;

			self.getAttrOption( 'moretext' );
			self.getAttrOption( 'limit' );

			if ( this.$liCount > self.options.limit ) {

				self.$element.find( 'li:nth-child( ' + self.options.limit + ' )' ).addClass( 'collapseList_hideAfter' )
				self.$element.append( '<li class="collapseList_noHide"><a href="#" data-collapselist-click>' + self.options.moreText.replace( '%limit%', this.$liCount - self.options.limit ) + '</a></li>' );
			}
		},
		getAttrOption: function( option_name ) {

			var self = this;

			self.options[ option_name ] = ( self.$element.attr( 'data-readmore-' + option_name ) == undefined ) ? self.options[ option_name ] : self.$element.attr( 'data-readmore-' + option_name );
		},
		click: function(e) {

			e.preventDefault();

			var $this = $( this );

			$this.closest( 'ul' ).find( '.collapseList_hideAfter' ).removeClass( 'collapseList_hideAfter' );
			$this.closest( 'ul' ).find( '.collapseList_noHide' ).remove();
		}
	};

	$.fn[ pluginName ] = function( options ) {

		return this.each( function() {

			if ( !$.data( this, pluginName ) ) {

				$.data( this, pluginName, new Plugin( this, options ) );
			}
		});
	};

	$( document ).on( 'click', '[data-collapselist-click]', Plugin.prototype.click );

} ) ( jQuery );