
// usage: log('inside coolFunc', this, arguments);
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*
 * Pagify - A jquery plugin for effortlessly creating single page web sites.
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2011, Chris Polis
 */

(function($) {
  $.fn.pagify = function(options) { 
    var self = this;
  
    this.defaults = {
      pages: [],
      'default': null,
      animation: 'show',
      onChange: function (page) {},
      cache: false
    };
    this.settings = $.extend({}, this.defaults, options);

    // Run after loading if caching, otherwise run immediately
    var runAfterLoading = function() {
      self.switchPage = function(page) {

        // Page is selected from: passed in value, window.location, default
        if(!page) {
          page = window.location.hash.replace('#','') || self.settings['default'];
        }
         
        // Load page content from cache 
        if(self.settings.cache) {
          $(self).hide().html(self.pages[page])[self.settings.animation]();
          self.settings.onChange(page);
 
        // Fetch page content
        } else {
          $.get(page+'.html', function(content) {
            $(self).hide().html(content)[self.settings.animation]();
            self.settings.onChange(page);
          }, 'text');      
        }
      }
    
      // Respond to hash changes
      $(window).bind('hashchange', function() {
        self.switchPage();
      });

      // Load initial page - current hash or default page
      if(window.location.hash) self.switchPage();
      else if(self.settings['default']) self.switchPage(self.settings['default']);

    };

    // Cache pages
    if(self.settings.cache) {
      self.pages = {};
      var pageLoads = self.settings.pages.length;
      $.each(self.settings.pages, function(ndx, page) {
        $.get(page+'.html', function(content) {
          self.pages[page] = content;
          pageLoads--;
          if(!pageLoads) runAfterLoading();
        }, 'text');
      });
    } else runAfterLoading();
  };
  
})(jQuery);
