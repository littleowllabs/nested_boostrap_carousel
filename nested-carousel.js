/* ========================================================================
 * Modified version of Bootstrap Carousel.js v3.0.0 that can be nested 
 * within another Bootstrap Carousel and cycled individually.
 *
 * Released under the same licence as the original, original details below.
 * ========================================================================
 * Copyright 2013 LittleOwlLabs
 * ======================================================================== */

/* ========================================================================
 * Bootstrap: Carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#Carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // NestedCarousel CLASS DEFINITION
  // =========================

  var NestedCarousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.nested-carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  NestedCarousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  NestedCarousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  NestedCarousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.nested-item.nested-active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  NestedCarousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  NestedCarousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.nested-next, .nested-prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  NestedCarousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  NestedCarousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  NestedCarousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.nested-item.nested-active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.nested-item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.nested-carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('nested-active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.nested-active').removeClass('nested-active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('nested-active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('nested-active')
          $active.removeClass(['nested-active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('nested-active')
      $next.addClass('nested-active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // NestedCarousel PLUGIN DEFINITION
  // ==========================

  var old = $.fn.NestedCarousel

  $.fn.NestedCarousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.nested-carousel')
      var options = $.extend({}, NestedCarousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.nested-carousel', (data = new NestedCarousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.NestedCarousel.Constructor = NestedCarousel


  // NestedCarousel NO CONFLICT
  // ====================

  $.fn.NestedCarousel.noConflict = function () {
    $.fn.NestedCarousel = old
    return this
  }


  // NestedCarousel DATA-API
  // =================

  $(document).on('click.bs.nested-carousel.data-api', '[data-nested-slide], [data-nested-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-nested-slide-to')
    if (slideIndex) options.interval = false

    $target.NestedCarousel(options)

    if (slideIndex = $this.attr('data-nested-slide-to')) {
      $target.data('bs.nested-carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="nested-carousel"]').each(function () {
      var $NestedCarousel = $(this)
      $NestedCarousel.NestedCarousel($NestedCarousel.data())
    })
  })

}(window.jQuery);