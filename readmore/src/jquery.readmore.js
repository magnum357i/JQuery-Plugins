/**
 * jquery.readMore.js
 * @version: v1.00
 * @author: Magnum357 (https://github.com/magnum357i)
 * @licence MIT
 */

;( function ( $ ) {

	var
	pluginName = 'readMore',
	defaults   = {
		moreText: 'Read more',
		lessText: 'Read less',
		line:     5
	};

	function Plugin( element, options ) {

		this.$element = $(element);
		this.options  = $.extend( {}, defaults, options );

		this.init();
	}

	Plugin.prototype = {

		init: function() {

			var self       = this;
			var boxHeight  = self.$element.outerHeight();
			var lineHeight = self.$element.css( 'line-height' ).replace( /[^\d\.]+/, '' );

			self.getAttrOptions();

			var heightToView = lineHeight * self.options.line;

			if ( boxHeight > heightToView )
			{
				var readMoreId   = Math.random().toString( 36 ).substring( 3 );

				self.$element
				.css( 'height',                heightToView )
				.attr( 'data-readmore-height', heightToView )
				.css( 'overflow',              'hidden' )
				.attr( 'data-readmore-id',     readMoreId );

				$( '[data-readmore-id="' + readMoreId + '"]' ).after(
					'<a data-readmore-id="' + readMoreId + '" href="#">' + self.options.moreText + '</a>'
				);

				$( 'a[data-readmore-id=' + readMoreId + ']' )
				.attr( 'data-readmore-moreText', self.options.moreText )
				.attr( 'data-readmore-lessText', self.options.lessText )
				.attr( 'data-readmore-click',    'no' );
			}
		},
		getAttrOptions: function() {

			var self = this;

			self.options.line = ( self.$element.attr( 'data-readmore-line' ) == undefined ) ? self.options.line : self.$element.attr( 'data-readmore-line' );
		},
		click: function(e) {

			e.preventDefault();

			var $this      = $( this );
			var readMoreId = $this.attr( 'data-readmore-id' );

			if ( $this.attr( 'data-readmore-click' ) == 'no' )
			{
				$( '[data-readmore][data-readmore-id=' + readMoreId + ']' )
				.removeAttr( 'style' );

				$this.attr( 'data-readmore-click', 'yes' );
				$this.text( $this.attr( 'data-readmore-lessText' ) );
			}
			else
			{
				var heightToView = $( '[data-readmore][data-readmore-id=' + readMoreId + ']' )
				.attr( 'data-readmore-height' );

				$( '[data-readmore][data-readmore-id=' + readMoreId + ']' )
				.css( 'height', heightToView )
				.css( 'overflow', 'hidden' );

				$this.attr( 'data-readmore-click', 'no' );
				$this.text( $this.attr( 'data-readmore-moreText' ) );
			}
		}
	};

	$.fn[ pluginName ] = function( options ) {

		return this.each( function() {
			if ( !$.data( this, pluginName ) ) {
				$.data( this, pluginName, new Plugin( this, options ) );
			}
		});
	};

	$( document ).on( 'click', '[data-readmore-click]', Plugin.prototype.click );

	var removePluginName = 'removeReadMore';

	function RemovePlugin( element ) {

		this.$element = $(element);

		this.destory();
	}

	RemovePlugin.prototype = {

		destory: function() {

			var self       = this;
			var readMoreId = self.$element.attr( 'data-readmore-id' );

			$( 'a[data-readmore-id="' + readMoreId +  '"]' ).remove();

			self.$element
			.removeAttr( 'data-readmore' )
			.removeAttr( 'data-readmore-line' )
			.removeAttr( 'data-readmore-id' )
			.removeAttr( 'data-readmore-height' )
			.removeAttr( 'style' );
		}
	};

	$.fn[ removePluginName ] = function() {

		return this.each( function() {
			if ( !$.data( this, removePluginName ) ) {
				$.data( this, removePluginName, new RemovePlugin( this ) );
			}
		});
	};

} ) ( jQuery );