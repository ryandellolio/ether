
		$( document ).ready(function() {
			$('[data-dns-field]').each(function() {
				$.get( resolver, { host: $(this).data('dns-field') })
					.done(function( data ) {
						var content = jQuery.parseJSON(data);
						var selector = '[data-dns-field=' + content[0].host.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1') + ']';
						$( selector ).html( content[0].txt );
					});	
			});
		});
