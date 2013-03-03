/**
 * @package modality
 * @author Diego La Monica
 * @version 0.1
 * @license GPL 2 (http://www.gnu.org/licenses/gpl-2.0.html)
 */

/**
 * Modality (a modal window plugin for jQuery)
 * Copyright (C) 2013 Diego La Monica 
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 * 
 * http://github.com/diegolamonica/modality
 * http://diegolamonica.info 
 * mailto:me@diegolamonica.info
 * 
 */

jQuery.fn.modality = function(myOptions){
	var thePromptWindow = this;
	var saveSettings = false;
	if($(thePromptWindow).hasClass('.modality')){
		/*
		 * has just defined something?
		 */
		defaultOptions = $(thePromptWindow).data('modality-settings');
		console.log(defaultOptions);
		
	}else{
		
		saveSettings = true;
		$(thePromptWindow).addClass('modality');
		
		defaultOptions = {
				/*
				 * If this option is true it means that the object is just prepared,
				 * after you can invoke it just calling the  
				 */
				init: false,
				/*
				 * the button bar container node type and ID
				 */
				buttonBarType:	'div',
				buttonBarId:	'the-button-bar',
				/*
				 * the shadow ID behind the prompt window
				 * and CSS Attributes
				 */
				theShadowId:	'the-shadow-id',
				shadowCSS:	{
					backgroundColor: 	'#000',
					opacity:		 	0.5,
					zIndex:				999
				},
				minPaddingLeft:	0,
				minPaddingTop: 0,
				buttons: [
				    /*
				     * No default buttons defined
				     */
					/*{label: 'Ok', 		callback: function(){ alert('confirm Clicked');return true; }},*/
				]
			};
	}
	/*
	 * Override base settings
	 */
	var options = jQuery.extend(defaultOptions, myOptions);
	
	if(options.buttons && !options.exec){
		/*
		 * Checking if the button bar exists
		 */
		var buttonBar = $('#'+options.buttonBarId); 
		
		if(buttonBar.length == 0 && options.buttons.length>0){
			/*
			 * If the button bar is not defined and there are buttons to create,
			 * i will define it, its buttons and events
			 */
			buttonBar = $('<'+options.buttonBarType+' id="'+options.buttonBarId+'" />').appendTo(this);
			
			/*
			 * For each button i will create a link element and
			 * attach to it the callback function if it's defined
			 */
			$(options.buttons).each(function(){
				var thatButton = this;
				$('<a class="button" href="#">' + this.label + '</a>')
					.appendTo(buttonBar)
					.on('click',function(){
						
						if(typeof(thatButton['callback'])==='undefined' || typeof(thatButton['callback'])==='function' && thatButton.callback()){
							/*
							 * if the callback function returns true or it's not defined i will fade out
							 * the obfuscator element and the prompt window. 
							 */
							$(thePromptWindow).fadeOut('fast');
							$('#'+options.theShadowId).fadeOut('fast');
						}
					});
			});
		}
	}
	
	/*
	 * Check if the shadow box is defined
	 */
	var theShadowBox = $('#'+options.theShadowId);
	if(theShadowBox.length==0 && !options.exec){
		theShadowBox = $('<div id="'+ options.theShadowId + '" />').appendTo('body');
		/*
		 * Those options are however overrided because the shadow should cover all the visible
		 * area of the screen
		 */
		options.shadowCSS.position 	= 'fixed';
		options.shadowCSS.top		= 0;
		options.shadowCSS.left		= 0;
		options.shadowCSS.bottom	= 0;
		options.shadowCSS.right		= 0;
		
		theShadowBox.css(options.shadowCSS);
		/*
		 * On window resize I need to relocate correctly the 
		 * modal prompt window to the center of the screen.
		 */
		$(window).on('resize', function(){
			var viewPortWidth 	= $(window).width(),
			viewPortHeight	= $(window).height();
		
			/*
			 * Forcing position absolute to recalculate the
			 * right prompt window size.
			 */
			$(thePromptWindow).css( 'position',	'absolute');
			var	thisWidth = $(thePromptWindow).width(),
				thisHeight = $(thePromptWindow).height(),
				
				top = (viewPortHeight - thisHeight) /2,
				left =  (viewPortWidth - thisWidth) /2;
			/*
			 * If left and top position would fall out of the minimum padding
			 * I'll set them to the minimum position;
			 */
			if(top<options.minPaddingTop) 	top = options.minPaddingTop;
			if(left<options.minPaddingLeft) left = options.minPaddingLeft;
			
			$(thePromptWindow).css(
				{
					'top':		top + 'px',
					'left':		left + 'px',
					'zIndex':	options.shadowCSS.zIndex+1
				}
			);
		});
		
	}
	
	
	if(options.init){
		/*
		 * If it's just initialization
		 */
		$(thePromptWindow).hide();
		$(theShadowBox).hide();
		
	}else{
		/*
		 * display the prompt window and the shadow box behind.
		 */
		$(thePromptWindow).fadeIn();
		$(theShadowBox).fadeIn();
		
	}
	
	if(saveSettings){
		/*
		 * Disabling init and enabling exec
		 */
		options.init = false;
		options.exec = true;
		$(thePromptWindow).data('modality-settings', options);
		
	}
	
	/*
	 * This is useful to locate correctly the prompt window
	 */
	$(window).resize();
};
