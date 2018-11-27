/**
 * jquery.quickEdit.js
 * @version: v1.00
 * @author: Magnum357 (https://github.com/magnum357i)
 * @licence MIT
 */

;( function ( $ ) {

	var
	pluginName = 'quickEdit',
	defaults   = {
		duration:          1500,
		rows:              10,
		title:             'Hold down to edit quickly.',
		okButtonText:      'Save',
		cancelButtonText:  'Cancel',
		okButtonClass:     'ok_button',
		cancelButtonClass: 'cancel_button',
		callback:          '',
		mode:              'multi' // multi | single
	};

	function Plugin( element, options ) {

		this.$element = $(element);
		this.options  = $.extend( {}, defaults, options );

		this.init();
	}

	Plugin.prototype = {

		init: function() {

			var self = this;

			self.getAttrOptions();
			self.writeTitle();
			self.openPanel();
		},
		getAttrOptions: function() {

			var self = this;

			self.options.mode = ( self.$element.attr( 'data-quickedit-mode' ) == undefined ) ? self.options.mode : self.$element.attr( 'data-quickedit-mode' );
		},
		writeTitle: function() {

			var self = this;

			self.$element.attr( 'title', self.options.title );
		},
		deleteTitle: function() {

			var self = this;

			self.$element.removeAttr( 'title' );
		},
		openPanel: function() {

			var self = this;
			var delay;

			self.$element.on( 'mousedown', function() {

				delay = setTimeout( function() {

					if ( self.$element.attr( 'data-quickedit-opened' ) == undefined )
					{
						self.whenPanelOpens();

						self.$element.attr( 'data-quickedit-opened', true );

						var template = [];

						if ( self.options.mode == 'multi' )
						{
							template.push( '<textarea data-quickedit-text rows="' + self.options.rows + '">' + self.cleanText( self.$element.html() ) + '</textarea>' );
							template.push( '<div data-quickedit-buttons>' );
							template.push( '<span data-quickedit-button="ok" class="' + self.options.okButtonClass + '"><i class="fa fa-check"></i> ' + self.options.okButtonText + '</span>' );
							template.push( '<span data-quickedit-button="cancel" class="' + self.options.cancelButtonClass + '"><i class="fa fa-times"></i> ' + self.options.cancelButtonText + '</span>' );
							template.push( '</div>' );
						}
						else if ( self.options.mode == 'single' )
						{
							template.push( '<input type="text" data-quickedit-text value="' + self.cleanText( self.$element.html() ) + '"></input>' );
							template.push( '<div data-quickedit-buttons>' );
							template.push( '<span data-quickedit-button="ok" class="' + self.options.okButtonClass + '"><i class="fa fa-check"></i> ' + self.options.okButtonText + '</span>' );
							template.push( '<span data-quickedit-button="cancel" class="' + self.options.cancelButtonClass + '"><i class="fa fa-times"></i> ' + self.options.cancelButtonText + '</span>' );
							template.push( '</div>' );
						}

						self.$element.html( template.join( '' ) );

						self.runPanelActions();
						self.deleteTitle();
					}

				}, self.options.duration );

			}).on( 'mouseup', function() {

    			clearTimeout( delay );

			});
		},
		whenPanelOpens: function() {

			var self = this;

			if ( self.$element.attr( 'data-readmore' ) != undefined && typeof self.$element.removeReadMore == 'function' )
			{
				self.$element.removeReadMore();
			}
		},
		runPanelActions: function() {

			var self = this;

			self.$element.find( '[data-quickedit-button="ok"]' ).on( 'click', function() {

				self.writeTitle();

				self.$element.removeAttr( 'data-quickedit-opened' );

				var editedText;

				if ( self.options.mode == 'multi' )
				{
					editedText = self.$element.find( '[data-quickedit-text]' ).val();
					editedText = self.parseText( editedText );
				}
				else if ( self.options.mode == 'single' )
				{
					editedText = self.$element.find( '[data-quickedit-text]' ).val();
				}

				self.$element.html( editedText );

				var callback = self.options.callback;

				if ( $.isFunction( callback ) )
				{
					callback.call( self );
				}
			});

			self.$element.find( '[data-quickedit-button="cancel"]' ).on( 'click', function() {

				self.writeTitle();

				self.$element.removeAttr( 'data-quickedit-opened' );

				var originalText;

				if ( self.options.mode == 'multi' )
				{
					originalText = self.$element.find( '[data-quickedit-text]' ).html();
					originalText = self.parseText( originalText );
				}
				else if ( self.options.mode == 'single' )
				{
					originalText = self.$element.find( '[data-quickedit-text]' ).val();
				}

				self.$element.html( originalText );

			});
		},
		parseText: function( t ) {

			t = String(t);
			t = t.replace( /\n/g, "<br>" );

			return t;
		},
		cleanText: function( t ) {

			t = String(t);
			t = t.trim();
			t = t.replace( /<br>/g, "\n" );

			return t;
		}
	};

	$.fn[ pluginName ] = function( options ) {

		return this.each( function() {
			if ( !$.data( this, pluginName ) ) {
				$.data( this, pluginName, new Plugin( this, options ) );
			}
		});
	};

} ) ( jQuery );