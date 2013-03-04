/**
 * @package modality
 * @author Diego La Monica
 * @version 0.3
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
	var thePromptWindow = this,
		saveSettings = false;
	if($(thePromptWindow).hasClass('modality')){
		/*
		 * has just defined something?
		 */
		defaultOptions = $(thePromptWindow).data('modality-settings');
		
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
				/*
				 * Minimal distance from left border
				 */
				minPaddingLeft:	0,
				minPaddingTop: 0,
				/* 
				 * the buttons list 
				 */
				buttons: [
				    /*
				     * No default buttons defined
				     */
					/*{		label: 'Ok', 		
					 * 		callback: function(){ alert('confirm Clicked');return true; }
					 *
					 * ==================================================================
					 * 
					 * Added in version 0.2
					 * Detect if button is default cancel button or default confirm button
					 * if them are setted the ESCAPE key and ENTER key will determine their
					 * execution.
					 * 
					 *  
					 * 		isDefault: true,
					 * 		isCancel: true
					 * 
					 * ==================================================================
					 * },
					 */
				]
			};
	}
	/*
	 * If i've passed a command to method (like cancel or confirm)
	 */
	if(typeof(myOptions) === 'string'){
		
		myOptions = {action: myOptions, exec: true};
	}
	/*
	 * Override base settings
	 */
	var options = jQuery.extend(null, defaultOptions);
	options = jQuery.extend(options, myOptions);
	
	/*
	 * v0.3: bugfix: if one of the shadowCSS properties is defined, others would not be created
	 */
	options.shadowCSS = jQuery.extend({
					backgroundColor: 	'#000',
					opacity:		 	0.5,
					zIndex:				999
				}, options.shadowCSS);
	/*
	 * v 0.2: 
	 * - Moved the action outside the `each` loop to allow extra use.
	 * - Added new parameter action given to the callback function.
	 *  
	 */
	var executeAction = function(thatButton, action){
		var options = $(window.__currentModalityItem).data('modality-settings');
		if(thatButton===null || 
				typeof(thatButton['callback'])==='undefined' || 
				typeof(thatButton['callback'])==='function' && thatButton.callback(action)){
			/*
			 * if the callback function returns true or it's not defined i will fade out
			 * the obfuscator element and the prompt window. 
			 */
			$(window.__currentModalityItem).fadeOut('fast');
			$('#'+options.theShadowId).fadeOut('fast');
			window.__currentModalityItem = null;
			
		}
		
	};
	
	/*
	 * If is set action I will execute the action binded to the first button the action
	 */
	if(	typeof(options['action'])  !== 'undefined' && 
			typeof(options['exec']) && options.exec) {
		var thatButton = null;
		$(options.buttons).each(function(){
			/*
			 * Searching for the right button clicked
			 */
			if(typeof(this['action']) !== 'undefined' && this.action == options.action ){
				
				thatButton = this;
			}
		});
		/*
		 * Execute the action
		 */
		executeAction(thatButton,  (thatButton==null)?options.action:thatButton.action );
		/*
		 * Anything more!
		 */
		return;
	}
	
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
					.on('click',function(event){
						
						executeAction(thatButton, thatButton.action);
						/*
						 * Avoiding native behavior
						 */
						event.preventDefault();
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
			/*
			 * v0.3: all modality elements will be resized.
			 */
			$('.modality').each(function(){

				var viewPortWidth 	= $(window).width(),
				viewPortHeight	= $(window).height(),
				options = $(this).data('modality-settings');
					
				/*
				 * Forcing position absolute to recalculate the
				 * right prompt window size.
				 */
				$(this).css( 'position',	'absolute');
				var	thisWidth = $(thePromptWindow).width(),
					thisHeight = $(thePromptWindow).height(),
					/*
					 * Where it would be placed?
					 */
					top = (viewPortHeight - thisHeight) /2,
					left =  (viewPortWidth - thisWidth) /2;
				/*
				 * If left and top position would fall out of the minimum padding
				 * I'll set them to the minimum position;
				 */
				if(top<options.minPaddingTop) 	top = options.minPaddingTop;
				if(left<options.minPaddingLeft) left = options.minPaddingLeft;
				/*
				 * v0.3 setting position to fixed when the popup is smaller than the viewport
				 */
				var position = (top==0 || left ==0)?'absolute':'fixed';
				$(this).css(
					{
						'top':		top + 'px',
						'left':		left + 'px',
						'zIndex':	(options.shadowCSS.zIndex+1),
						'position': position
					}
				);
			});
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
		/*
		 * Setup default actions
		 */
		if(options.isDefault) 	options.action = 'confirm';
		if(options.isCancel) 	options.action = 'cancel';
		
		$(thePromptWindow).data('modality-settings', options);
		
	}
	if(typeof(window['__modalityKeydownAttached']) == 'undefined'){
		/*
		 * v0.3: To avoid the keydown to be attacched more than one time
		 */
		window.__modalityKeydownAttached = true;
		$(document).on('keydown',function(event){
			var options = $(window.__currentModalityItem).data('modality-settings');
			if(options==null) return;
			if(event.which == 13)
				/*
				 * Enter pressed then the default confirm button has been pressed 
				 */
				$(options.buttons).each(function(){
					if(this.isDefault){
					
						executeAction(this, 'confirm');
						event.preventDefault();
					}
					
				});
		
			if(event.which == 27)
				/*
				 * ESCAPE key pressed then the default cancel button has been pressed 
				 */
			
				$(options.buttons).each(function(){
					if(this.isCancel){
					
						executeAction(this, 'cancel');
						event.preventDefault();
					}
				});

		});
	}
	/*
	 * v0.3: This is useful to locate correctly the prompt window
	 */
	window.__currentModalityItem = thePromptWindow;
	
	$(window).resize();
};
