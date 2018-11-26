/**
 * jquery.collapseList.js
 * @version: v1.00
 * @author: Magnum357 (https://github.com/magnum357i)
 * @licence MIT
 */

;( function ( $ ) {

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

			self.getAttrOptions();

			if ( this.$liCount > self.options.limit )
			{
				self.$element.find( 'li:nth-child( ' + self.options.limit + ' )' ).addClass( 'collapseList_hideAfter' )
				self.$element.append( '<li class="collapseList_noHide"><a href="#" data-collapselist-click>' + self.options.moreText.replace( '%limit%', this.$liCount - self.options.limit ) + '</a></li>' );
			}
		},
		getAttrOptions: function() {

			var self = this;

			self.options.limit    = ( self.$element.attr( 'data-collapselist-limit' ) == undefined ) ? self.options.limit : self.$element.attr( 'data-collapselist-limit' );
			self.options.moreText = ( self.$element.attr( 'data-collapselist-moreText' ) == undefined ) ? self.options.moreText : self.$element.attr( 'data-collapselist-moreText' );
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