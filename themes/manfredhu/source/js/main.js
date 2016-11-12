//-----------------------------------------------------
//nprogress
//-----------------------------------------------------
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */


;
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.NProgress = factory();
    }

})(this, function() {
    var NProgress = {};

    NProgress.version = '0.2.0';

    var Settings = NProgress.settings = {
        minimum: 0.08,
        easing: 'linear',
        positionUsing: '',
        speed: 350,
        trickle: true,
        trickleSpeed: 250,
        showSpinner: true,
        barSelector: '[role="bar"]',
        spinnerSelector: '[role="spinner"]',
        parent: 'body',
        template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };

    /**
     * Updates configuration.
     *
     *     NProgress.configure({
     *       minimum: 0.1
     *     });
     */
    NProgress.configure = function(options) {
        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        return this;
    };

    /**
     * Last number.
     */

    NProgress.status = null;

    /**
     * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
     *
     *     NProgress.set(0.4);
     *     NProgress.set(1.0);
     */

    NProgress.set = function(n) {
        var started = NProgress.isStarted();

        n = clamp(n, Settings.minimum, 1);
        NProgress.status = (n === 1 ? null : n);

        var progress = NProgress.render(!started),
            bar = progress.querySelector(Settings.barSelector),
            speed = Settings.speed,
            ease = Settings.easing;

        progress.offsetWidth; /* Repaint */

        queue(function(next) {
            // Set positionUsing if it hasn't already been set
            if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

            // Add transition
            css(bar, barPositionCSS(n, speed, ease));

            if (n === 1) {
                // Fade out
                css(progress, {
                    transition: 'none',
                    opacity: 1
                });
                progress.offsetWidth; /* Repaint */

                setTimeout(function() {
                    css(progress, {
                        transition: 'all ' + speed + 'ms linear',
                        opacity: 0
                    });
                    setTimeout(function() {
                        NProgress.remove();
                        next();
                    }, speed);
                }, speed);
            } else {
                setTimeout(next, speed);
            }
        });

        return this;
    };

    NProgress.isStarted = function() {
        return typeof NProgress.status === 'number';
    };

    /**
     * Shows the progress bar.
     * This is the same as setting the status to 0%, except that it doesn't go backwards.
     *
     *     NProgress.start();
     *
     */
    NProgress.start = function() {
        if (!NProgress.status) NProgress.set(0);

        var work = function() {
            setTimeout(function() {
                if (!NProgress.status) return;
                NProgress.trickle();
                work();
            }, Settings.trickleSpeed);
        };

        if (Settings.trickle) work();

        return this;
    };

    /**
     * Hides the progress bar.
     * This is the *sort of* the same as setting the status to 100%, with the
     * difference being `done()` makes some placebo effect of some realistic motion.
     *
     *     NProgress.done();
     *
     * If `true` is passed, it will show the progress bar even if its hidden.
     *
     *     NProgress.done(true);
     */

    NProgress.done = function(force) {
        if (!force && !NProgress.status) return this;

        return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
    };

    /**
     * Increments by a random amount.
     */

    NProgress.inc = function(amount) {
        var n = NProgress.status;

        if (!n) {
            return NProgress.start();
        } else if (n > 1) {
            return;
        } else {
            if (typeof amount !== 'number') {
                if (n >= 0 && n < 0.25) {
                    // Start out between 3 - 6% increments
                    amount = (Math.random() * (5 - 3 + 1) + 3) / 100;
                } else if (n >= 0.25 && n < 0.65) {
                    // increment between 0 - 3%
                    amount = (Math.random() * 3) / 100;
                } else if (n >= 0.65 && n < 0.9) {
                    // increment between 0 - 2%
                    amount = (Math.random() * 2) / 100;
                } else if (n >= 0.9 && n < 0.99) {
                    // finally, increment it .5 %
                    amount = 0.005;
                } else {
                    // after 99%, don't increment:
                    amount = 0;
                }
            }

            n = clamp(n + amount, 0, 0.994);
            return NProgress.set(n);
        }
    };

    NProgress.trickle = function() {
        return NProgress.inc();
    };

    /**
     * Waits for all supplied jQuery promises and
     * increases the progress as the promises resolve.
     *
     * @param $promise jQUery Promise
     */
    (function() {
        var initial = 0,
            current = 0;

        NProgress.promise = function($promise) {
            if (!$promise || $promise.state() === "resolved") {
                return this;
            }

            if (current === 0) {
                NProgress.start();
            }

            initial++;
            current++;

            $promise.always(function() {
                current--;
                if (current === 0) {
                    initial = 0;
                    NProgress.done();
                } else {
                    NProgress.set((initial - current) / initial);
                }
            });

            return this;
        };

    })();

    /**
     * (Internal) renders the progress bar markup based on the `template`
     * setting.
     */

    NProgress.render = function(fromStart) {
        if (NProgress.isRendered()) return document.getElementById('nprogress');

        addClass(document.documentElement, 'nprogress-busy');

        var progress = document.createElement('div');
        progress.id = 'nprogress';
        progress.innerHTML = Settings.template;

        var bar = progress.querySelector(Settings.barSelector),
            perc = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
            parent = document.querySelector(Settings.parent),
            spinner;

        css(bar, {
            transition: 'all 0 linear',
            transform: 'translate3d(' + perc + '%,0,0)'
        });

        if (!Settings.showSpinner) {
            spinner = progress.querySelector(Settings.spinnerSelector);
            spinner && removeElement(spinner);
        }

        if (parent != document.body) {
            addClass(parent, 'nprogress-custom-parent');
        }

        parent.appendChild(progress);
        return progress;
    };

    /**
     * Removes the element. Opposite of render().
     */

    NProgress.remove = function() {
        removeClass(document.documentElement, 'nprogress-busy');
        removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
        var progress = document.getElementById('nprogress');
        progress && removeElement(progress);
    };

    /**
     * Checks if the progress bar is rendered.
     */

    NProgress.isRendered = function() {
        return !!document.getElementById('nprogress');
    };

    /**
     * Determine which positioning CSS rule to use.
     */

    NProgress.getPositioningCSS = function() {
        // Sniff on document.body.style
        var bodyStyle = document.body.style;

        // Sniff prefixes
        var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
            ('MozTransform' in bodyStyle) ? 'Moz' :
            ('msTransform' in bodyStyle) ? 'ms' :
            ('OTransform' in bodyStyle) ? 'O' : '';

        if (vendorPrefix + 'Perspective' in bodyStyle) {
            // Modern browsers with 3D support, e.g. Webkit, IE10
            return 'translate3d';
        } else if (vendorPrefix + 'Transform' in bodyStyle) {
            // Browsers without 3D support, e.g. IE9
            return 'translate';
        } else {
            // Browsers without translate() support, e.g. IE7-8
            return 'margin';
        }
    };

    /**
     * Helpers
     */

    function clamp(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }

    /**
     * (Internal) converts a percentage (`0..1`) to a bar translateX
     * percentage (`-100%..0%`).
     */

    function toBarPerc(n) {
        return (-1 + n) * 100;
    }


    /**
     * (Internal) returns the correct CSS for changing the bar's
     * position given an n percentage, and speed and ease from Settings
     */

    function barPositionCSS(n, speed, ease) {
        var barCSS;

        if (Settings.positionUsing === 'translate3d') {
            barCSS = { transform: 'translate3d(' + toBarPerc(n) + '%,0,0)' };
        } else if (Settings.positionUsing === 'translate') {
            barCSS = { transform: 'translate(' + toBarPerc(n) + '%,0)' };
        } else {
            barCSS = { 'margin-left': toBarPerc(n) + '%' };
        }

        barCSS.transition = 'all ' + speed + 'ms ' + ease;

        return barCSS;
    }

    /**
     * (Internal) Queues a function to be executed.
     */

    var queue = (function() {
        var pending = [];

        function next() {
            var fn = pending.shift();
            if (fn) {
                fn(next);
            }
        }

        return function(fn) {
            pending.push(fn);
            if (pending.length == 1) next();
        };
    })();

    /**
     * (Internal) Applies css properties to an element, similar to the jQuery
     * css method.
     *
     * While this helper does assist with vendor prefixed property names, it
     * does not perform any manipulation of values prior to setting styles.
     */

    var css = (function() {
        var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],
            cssProps = {};

        function camelCase(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
                return letter.toUpperCase();
            });
        }

        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = cssPrefixes.length,
                capName = name.charAt(0).toUpperCase() + name.slice(1),
                vendorName;
            while (i--) {
                vendorName = cssPrefixes[i] + capName;
                if (vendorName in style) return vendorName;
            }

            return name;
        }

        function getStyleProp(name) {
            name = camelCase(name);
            return cssProps[name] || (cssProps[name] = getVendorProp(name));
        }

        function applyCss(element, prop, value) {
            prop = getStyleProp(prop);
            element.style[prop] = value;
        }

        return function(element, properties) {
            var args = arguments,
                prop,
                value;

            if (args.length == 2) {
                for (prop in properties) {
                    value = properties[prop];
                    if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
                }
            } else {
                applyCss(element, args[1], args[2]);
            }
        }
    })();

    /**
     * (Internal) Determines if an element or space separated list of class names contains a class name.
     */

    function hasClass(element, name) {
        var list = typeof element == 'string' ? element : classList(element);
        return list.indexOf(' ' + name + ' ') >= 0;
    }

    /**
     * (Internal) Adds a class to an element.
     */

    function addClass(element, name) {
        var oldList = classList(element),
            newList = oldList + name;

        if (hasClass(oldList, name)) return;

        // Trim the opening space.
        element.className = newList.substring(1);
    }

    /**
     * (Internal) Removes a class from an element.
     */

    function removeClass(element, name) {
        var oldList = classList(element),
            newList;

        if (!hasClass(element, name)) return;

        // Replace the class name.
        newList = oldList.replace(' ' + name + ' ', ' ');

        // Trim the opening and closing spaces.
        element.className = newList.substring(1, newList.length - 1);
    }

    /**
     * (Internal) Gets a space separated list of the class names on the element.
     * The list is wrapped with a single space on each end to facilitate finding
     * matches within the list.
     */

    function classList(element) {
        return (' ' + (element && element.className || '') + ' ').replace(/\s+/gi, ' ');
    }

    /**
     * (Internal) Removes an element from the DOM.
     */

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

    return NProgress;
});

//引入NProgress
$(document).ready(function() { NProgress.start(); });
$(window).load(function() { NProgress.done(); })
$(document).on('page:fetch', function() { NProgress.start(); });
$(document).on('page:change', function() { NProgress.done(); });
$(document).on('page:restore', function() { NProgress.remove(); });
$(document).on('pjax:start', function() { NProgress.start(); });
$(document).on('pjax:end', function() { NProgress.done(); });


//-----------------------------------------------------
//jquery.fancybox.pack.js部分
//-----------------------------------------------------

/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
(function(s, H, f, w) {
    var K = f("html"),
        q = f(s),
        p = f(H),
        b = f.fancybox = function() { b.open.apply(this, arguments) },
        J = navigator.userAgent.match(/msie/i),
        C = null,
        t = H.createTouch !== w,
        u = function(a) {
            return a && a.hasOwnProperty && a instanceof f
        },
        r = function(a) {
            return a && "string" === f.type(a)
        },
        F = function(a) {
            return r(a) && 0 < a.indexOf("%")
        },
        m = function(a, d) {
            var e = parseInt(a, 10) || 0;
            d && F(a) && (e *= b.getViewport()[d] / 100);
            return Math.ceil(e)
        },
        x = function(a, b) {
            return m(a, b) + "px"
        };
    f.extend(b, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !t,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: 0.5,
            leftRatio: 0.5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3E3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: { dataType: "html", headers: { "X-fancyBox": !0 } },
            iframe: { scrolling: "auto", preload: !0 },
            swf: { wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always" },
            keys: { next: { 13: "left", 34: "up", 39: "left", 40: "up" }, prev: { 8: "right", 33: "down", 37: "right", 38: "down" }, close: [27], play: [32], toggle: [70] },
            direction: { next: "left", prev: "right" },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' +
                    (J ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: { overlay: !0, title: !0 },
            onCancel: f.noop,
            beforeLoad: f.noop,
            afterLoad: f.noop,
            beforeShow: f.noop,
            afterShow: f.noop,
            beforeChange: f.noop,
            beforeClose: f.noop,
            afterClose: f.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: { timer: null, isActive: !1 },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(a, d) {
            if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0))) return f.isArray(a) || (a = u(a) ? f(a).get() : [a]), f.each(a, function(e, c) {
                var l = {},
                    g, h, k, n, m;
                "object" === f.type(c) && (c.nodeType && (c = f(c)), u(c) ? (l = { href: c.data("fancybox-href") || c.attr("href"), title: f("<div/>").text(c.data("fancybox-title") || c.attr("title")).html(), isDom: !0, element: c },
                    f.metadata && f.extend(!0, l, c.metadata())) : l = c);
                g = d.href || l.href || (r(c) ? c : null) || c.find('img').data('url');
                h = d.title !== w ? d.title : l.title || "";
                n = (k = d.content || l.content) ? "html" : d.type || l.type;
                !n && l.isDom && (n = c.data("fancybox-type"), n || (n = (n = c.prop("class").match(/fancybox\.(\w+)/)) ? n[1] : null));
                r(g) && (n || (b.isImage(g) ? n = "image" : b.isSWF(g) ? n = "swf" : "#" === g.charAt(0) ? n = "inline" : r(c) && (n = "html", k = c)), "ajax" === n && (m = g.split(/\s+/, 2), g = m.shift(), m = m.shift()));
                k || ("inline" === n ? g ? k = f(r(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : l.isDom && (k = c) :
                    "html" === n ? k = g : n || g || !l.isDom || (n = "inline", k = c));
                f.extend(l, { href: g, type: n, content: k, title: h, selector: m });
                a[e] = l
            }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== w && (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1), b.group = a, b._start(b.opts.index)
        },
        cancel: function() {
            var a = b.coming;
            a && !1 === b.trigger("onCancel") || (b.hideLoading(), a && (b.ajaxLoad && b.ajaxLoad.abort(), b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(),
                b.coming = null, b.current || b._afterZoomOut(a)))
        },
        close: function(a) { b.cancel();!1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (b.isOpen && !0 !== a ? (b.isOpen = b.isOpened = !1, b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), b.transitions[b.current.closeMethod]()) : (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), b._afterZoomOut()))) },
        play: function(a) {
            var d = function() { clearTimeout(b.player.timer) },
                e = function() {
                    d();
                    b.current && b.player.isActive &&
                        (b.player.timer = setTimeout(b.next, b.current.playSpeed))
                },
                c = function() {
                    d();
                    p.unbind(".player");
                    b.player.isActive = !1;
                    b.trigger("onPlayEnd")
                };
            !0 === a || !b.player.isActive && !1 !== a ? b.current && (b.current.loop || b.current.index < b.group.length - 1) && (b.player.isActive = !0, p.bind({ "onCancel.player beforeClose.player": c, "onUpdate.player": e, "beforeLoad.player": d }), e(), b.trigger("onPlayStart")) : c()
        },
        next: function(a) {
            var d = b.current;
            d && (r(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"))
        },
        prev: function(a) {
            var d =
                b.current;
            d && (r(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"))
        },
        jumpto: function(a, d, e) {
            var c = b.current;
            c && (a = m(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), a %= c.group.length), c.group[a] !== w && (b.cancel(), b._start(a)))
        },
        reposition: function(a, d) {
            var e = b.current,
                c = e ? e.wrap : null,
                l;
            c && (l = b._getPosition(d), a && "scroll" === a.type ? (delete l.position, c.stop(!0, !0).animate(l, 200)) : (c.css(l), e.pos = f.extend({}, e.dim, l)))
        },
        update: function(a) {
            var d = a && a.originalEvent && a.originalEvent.type,
                e = !d || "orientationchange" === d;
            e && (clearTimeout(C), C = null);
            b.isOpen && !C && (C = setTimeout(function() {
                var c = b.current;
                c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), C = null)
            }, e && !t ? 0 : 300))
        },
        toggle: function(a) {
            b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, t && (b.wrap.removeAttr("style").addClass("fancybox-tmp"),
                b.trigger("onUpdate")), b.update())
        },
        hideLoading: function() {
            p.unbind(".loading");
            f("#fancybox-loading").remove()
        },
        showLoading: function() {
            var a, d;
            b.hideLoading();
            a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");
            p.bind("keydown.loading", function(a) { 27 === (a.which || a.keyCode) && (a.preventDefault(), b.cancel()) });
            b.defaults.fixed || (d = b.getViewport(), a.css({ position: "absolute", top: 0.5 * d.h + d.y, left: 0.5 * d.w + d.x }));
            b.trigger("onLoading")
        },
        getViewport: function() {
            var a = b.current &&
                b.current.locked || !1,
                d = { x: q.scrollLeft(), y: q.scrollTop() };
            a && a.length ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = t && s.innerWidth ? s.innerWidth : q.width(), d.h = t && s.innerHeight ? s.innerHeight : q.height());
            return d
        },
        unbindEvents: function() {
            b.wrap && u(b.wrap) && b.wrap.unbind(".fb");
            p.unbind(".fb");
            q.unbind(".fb")
        },
        bindEvents: function() {
            var a = b.current,
                d;
            a && (q.bind("orientationchange.fb" + (t ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), (d = a.keys) && p.bind("keydown.fb", function(e) {
                var c =
                    e.which || e.keyCode,
                    l = e.target || e.srcElement;
                if (27 === c && b.coming) return !1;
                e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || l && (l.type || f(l).is("[contenteditable]")) || f.each(d, function(d, l) {
                    if (1 < a.group.length && l[c] !== w) return b[d](l[c]), e.preventDefault(), !1;
                    if (-1 < f.inArray(c, l)) return b[d](), e.preventDefault(), !1
                })
            }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function(d, c, l, g) {
                for (var h = f(d.target || null), k = !1; h.length && !(k || h.is(".fancybox-skin") || h.is(".fancybox-wrap"));) k = h[0] && !(h[0].style.overflow &&
                    "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight), h = f(h).parent();
                0 !== c && !k && 1 < b.group.length && !a.canShrink && (0 < g || 0 < l ? b.prev(0 < g ? "down" : "left") : (0 > g || 0 > l) && b.next(0 > g ? "up" : "right"), d.preventDefault())
            }))
        },
        trigger: function(a, d) {
            var e, c = d || b.coming || b.current;
            if (c) {
                f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1)));
                if (!1 === e) return !1;
                c.helpers && f.each(c.helpers, function(d, e) {
                    if (e &&
                        b.helpers[d] && f.isFunction(b.helpers[d][a])) b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c)
                })
            }
            p.trigger(a)
        },
        isImage: function(a) {
            return r(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
        },
        isSWF: function(a) {
            return r(a) && a.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function(a) {
            var d = {},
                e, c;
            a = m(a);
            e = b.group[a] || null;
            if (!e) return !1;
            d = f.extend(!0, {}, b.opts, e);
            e = d.margin;
            c = d.padding;
            "number" === f.type(e) && (d.margin = [e, e, e, e]);
            "number" === f.type(c) && (d.padding = [c, c,
                c, c
            ]);
            d.modal && f.extend(!0, d, { closeBtn: !1, closeClick: !1, nextClick: !1, arrows: !1, mouseWheel: !1, keys: null, helpers: { overlay: { closeClick: !1 } } });
            d.autoSize && (d.autoWidth = d.autoHeight = !0);
            "auto" === d.width && (d.autoWidth = !0);
            "auto" === d.height && (d.autoHeight = !0);
            d.group = b.group;
            d.index = a;
            b.coming = d;
            if (!1 === b.trigger("beforeLoad")) b.coming = null;
            else {
                c = d.type;
                e = d.href;
                if (!c) return b.coming = null, b.current && b.router && "jumpto" !== b.router ? (b.current.index = a, b[b.router](b.direction)) : !1;
                b.isActive = !0;
                if ("image" ===
                    c || "swf" === c) d.autoHeight = d.autoWidth = !1, d.scrolling = "visible";
                "image" === c && (d.aspectRatio = !0);
                "iframe" === c && t && (d.scrolling = "scroll");
                d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (t ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body");
                f.extend(d, { skin: f(".fancybox-skin", d.wrap), outer: f(".fancybox-outer", d.wrap), inner: f(".fancybox-inner", d.wrap) });
                f.each(["Top", "Right", "Bottom", "Left"], function(a, b) { d.skin.css("padding" + b, x(d.padding[a])) });
                b.trigger("onReady");
                if ("inline" === c || "html" === c) {
                    if (!d.content || !d.content.length) return b._error("content")
                } else if (!e) return b._error("href");
                "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad()
            }
        },
        _error: function(a) {
            f.extend(b.coming, { type: "html", autoWidth: !0, autoHeight: !0, minWidth: 0, minHeight: 0, scrolling: "no", hasError: a, content: b.coming.tpl.error });
            b._afterLoad()
        },
        _loadImage: function() {
            var a = b.imgPreload = new Image;
            a.onload = function() {
                this.onload = this.onerror = null;
                b.coming.width =
                    this.width / b.opts.pixelRatio;
                b.coming.height = this.height / b.opts.pixelRatio;
                b._afterLoad()
            };
            a.onerror = function() {
                this.onload = this.onerror = null;
                b._error("image")
            };
            a.src = b.coming.href;
            !0 !== a.complete && b.showLoading()
        },
        _loadAjax: function() {
            var a = b.coming;
            b.showLoading();
            b.ajaxLoad = f.ajax(f.extend({}, a.ajax, { url: a.href, error: function(a, e) { b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading() }, success: function(d, e) { "success" === e && (a.content = d, b._afterLoad()) } }))
        },
        _loadIframe: function() {
            var a = b.coming,
                d = f(a.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", t ? "auto" : a.iframe.scrolling).attr("src", a.href);
            f(a.wrap).bind("onReset", function() {
                try { f(this).find("iframe").hide().attr("src", "//about:blank").end().empty() } catch (a) {}
            });
            a.iframe.preload && (b.showLoading(), d.one("load", function() {
                f(this).data("ready", 1);
                t || f(this).bind("load.fb", b.update);
                f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                b._afterLoad()
            }));
            a.content = d.appendTo(a.inner);
            a.iframe.preload ||
                b._afterLoad()
        },
        _preloadImages: function() {
            var a = b.group,
                d = b.current,
                e = a.length,
                c = d.preload ? Math.min(d.preload, e - 1) : 0,
                f, g;
            for (g = 1; g <= c; g += 1) f = a[(d.index + g) % e], "image" === f.type && f.href && ((new Image).src = f.href)
        },
        _afterLoad: function() {
            var a = b.coming,
                d = b.current,
                e, c, l, g, h;
            b.hideLoading();
            if (a && !1 !== b.isActive)
                if (!1 === b.trigger("afterLoad", a, d)) a.wrap.stop(!0).trigger("onReset").remove(), b.coming = null;
                else {
                    d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                    b.unbindEvents();
                    e = a.content;
                    c = a.type;
                    l = a.scrolling;
                    f.extend(b, { wrap: a.wrap, skin: a.skin, outer: a.outer, inner: a.inner, current: a, previous: d });
                    g = a.href;
                    switch (c) {
                        case "inline":
                        case "ajax":
                        case "html":
                            a.selector ? e = f("<div>").html(e).find(a.selector) : u(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), e = e.show().detach(), a.wrap.bind("onReset", function() {
                                f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                            }));
                            break;
                        case "image":
                            e = a.tpl.image.replace(/\{href\}/g, g);
                            break;
                        case "swf":
                            e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>', h = "", f.each(a.swf, function(a, b) {
                                e += '<param name="' + a + '" value="' + b + '"></param>';
                                h += " " + a + '="' + b + '"'
                            }), e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>"
                    }
                    u(e) && e.parent().is(a.inner) || a.inner.append(e);
                    b.trigger("beforeShow");
                    a.inner.css("overflow", "yes" === l ? "scroll" : "no" === l ? "hidden" : l);
                    b._setDimension();
                    b.reposition();
                    b.isOpen = !1;
                    b.coming = null;
                    b.bindEvents();
                    if (!b.isOpened) f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();
                    else if (d.prevMethod) b.transitions[d.prevMethod]();
                    b.transitions[b.isOpened ? a.nextMethod : a.openMethod]();
                    b._preloadImages()
                }
        },
        _setDimension: function() {
            var a = b.getViewport(),
                d = 0,
                e = !1,
                c = !1,
                e = b.wrap,
                l = b.skin,
                g = b.inner,
                h = b.current,
                c = h.width,
                k = h.height,
                n = h.minWidth,
                v = h.minHeight,
                p = h.maxWidth,
                q = h.maxHeight,
                t = h.scrolling,
                r = h.scrollOutside ? h.scrollbarWidth : 0,
                y = h.margin,
                z = m(y[1] + y[3]),
                s = m(y[0] + y[2]),
                w, A, u, D, B, G, C, E, I;
            e.add(l).add(g).width("auto").height("auto").removeClass("fancybox-tmp");
            y = m(l.outerWidth(!0) - l.width());
            w = m(l.outerHeight(!0) - l.height());
            A = z + y;
            u = s + w;
            D = F(c) ? (a.w - A) * m(c) / 100 : c;
            B = F(k) ? (a.h - u) * m(k) / 100 : k;
            if ("iframe" === h.type) {
                if (I = h.content, h.autoHeight && 1 === I.data("ready")) try {
                    I[0].contentWindow.document.location && (g.width(D).height(9999), G = I.contents().find("body"), r && G.css("overflow-x",
                        "hidden"), B = G.outerHeight(!0))
                } catch (H) {}
            } else if (h.autoWidth || h.autoHeight) g.addClass("fancybox-tmp"), h.autoWidth || g.width(D), h.autoHeight || g.height(B), h.autoWidth && (D = g.width()), h.autoHeight && (B = g.height()), g.removeClass("fancybox-tmp");
            c = m(D);
            k = m(B);
            E = D / B;
            n = m(F(n) ? m(n, "w") - A : n);
            p = m(F(p) ? m(p, "w") - A : p);
            v = m(F(v) ? m(v, "h") - u : v);
            q = m(F(q) ? m(q, "h") - u : q);
            G = p;
            C = q;
            h.fitToView && (p = Math.min(a.w - A, p), q = Math.min(a.h - u, q));
            A = a.w - z;
            s = a.h - s;
            h.aspectRatio ? (c > p && (c = p, k = m(c / E)), k > q && (k = q, c = m(k * E)), c < n && (c = n, k = m(c /
                E)), k < v && (k = v, c = m(k * E))) : (c = Math.max(n, Math.min(c, p)), h.autoHeight && "iframe" !== h.type && (g.width(c), k = g.height()), k = Math.max(v, Math.min(k, q)));
            if (h.fitToView)
                if (g.width(c).height(k), e.width(c + y), a = e.width(), z = e.height(), h.aspectRatio)
                    for (;
                        (a > A || z > s) && c > n && k > v && !(19 < d++);) k = Math.max(v, Math.min(q, k - 10)), c = m(k * E), c < n && (c = n, k = m(c / E)), c > p && (c = p, k = m(c / E)), g.width(c).height(k), e.width(c + y), a = e.width(), z = e.height();
                else c = Math.max(n, Math.min(c, c - (a - A))), k = Math.max(v, Math.min(k, k - (z - s)));
            r && "auto" === t && k < B &&
                c + y + r < A && (c += r);
            g.width(c).height(k);
            e.width(c + y);
            a = e.width();
            z = e.height();
            e = (a > A || z > s) && c > n && k > v;
            c = h.aspectRatio ? c < G && k < C && c < D && k < B : (c < G || k < C) && (c < D || k < B);
            f.extend(h, { dim: { width: x(a), height: x(z) }, origWidth: D, origHeight: B, canShrink: e, canExpand: c, wPadding: y, hPadding: w, wrapSpace: z - l.outerHeight(!0), skinSpace: l.height() - k });
            !I && h.autoHeight && k > v && k < q && !c && g.height("auto")
        },
        _getPosition: function(a) {
            var d = b.current,
                e = b.getViewport(),
                c = d.margin,
                f = b.wrap.width() + c[1] + c[3],
                g = b.wrap.height() + c[0] + c[2],
                c = {
                    position: "absolute",
                    top: c[0],
                    left: c[3]
                };
            d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, c.left += e.x);
            c.top = x(Math.max(c.top, c.top + (e.h - g) * d.topRatio));
            c.left = x(Math.max(c.left, c.left + (e.w - f) * d.leftRatio));
            return c
        },
        _afterZoomIn: function() {
            var a = b.current;
            a && ((b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function(d) {
                f(d.target).is("a") || f(d.target).parent().is("a") ||
                    (d.preventDefault(), b[a.closeClick ? "close" : "next"]())
            }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function(a) {
                a.preventDefault();
                b.close()
            }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), b.trigger("afterShow"), a.loop || a.index !== a.group.length - 1) ? b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, b.play(!0)) : b.play(!1))
        },
        _afterZoomOut: function(a) {
            a = a || b.current;
            f(".fancybox-wrap").trigger("onReset").remove();
            f.extend(b, { group: {}, opts: {}, router: !1, current: null, isActive: !1, isOpened: !1, isOpen: !1, isClosing: !1, wrap: null, skin: null, outer: null, inner: null });
            b.trigger("afterClose", a)
        }
    });
    b.transitions = {
        getOrigPosition: function() {
            var a = b.current,
                d = a.element,
                e = a.orig,
                c = {},
                f = 50,
                g = 50,
                h = a.hPadding,
                k = a.wPadding,
                n = b.getViewport();
            !e && a.isDom && d.is(":visible") && (e = d.find("img:first"), e.length || (e = d));
            u(e) ? (c = e.offset(), e.is("img") &&
                (f = e.outerWidth(), g = e.outerHeight())) : (c.top = n.y + (n.h - g) * a.topRatio, c.left = n.x + (n.w - f) * a.leftRatio);
            if ("fixed" === b.wrap.css("position") || a.locked) c.top -= n.y, c.left -= n.x;
            return c = { top: x(c.top - h * a.topRatio), left: x(c.left - k * a.leftRatio), width: x(f + k), height: x(g + h) }
        },
        step: function(a, d) {
            var e, c, f = d.prop;
            c = b.current;
            var g = c.wrapSpace,
                h = c.skinSpace;
            if ("width" === f || "height" === f) e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start), b.isClosing && (e = 1 - e), c = "width" === f ? c.wPadding : c.hPadding, c = a - c, b.skin[f](m("width" ===
                f ? c : c - g * e)), b.inner[f](m("width" === f ? c : c - g * e - h * e))
        },
        zoomIn: function() {
            var a = b.current,
                d = a.pos,
                e = a.openEffect,
                c = "elastic" === e,
                l = f.extend({ opacity: 1 }, d);
            delete l.position;
            c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = 0.1)) : "fade" === e && (d.opacity = 0.1);
            b.wrap.css(d).animate(l, { duration: "none" === e ? 0 : a.openSpeed, easing: a.openEasing, step: c ? this.step : null, complete: b._afterZoomIn })
        },
        zoomOut: function() {
            var a = b.current,
                d = a.closeEffect,
                e = "elastic" === d,
                c = { opacity: 0.1 };
            e && (c = this.getOrigPosition(), a.closeOpacity &&
                (c.opacity = 0.1));
            b.wrap.animate(c, { duration: "none" === d ? 0 : a.closeSpeed, easing: a.closeEasing, step: e ? this.step : null, complete: b._afterZoomOut })
        },
        changeIn: function() {
            var a = b.current,
                d = a.nextEffect,
                e = a.pos,
                c = { opacity: 1 },
                f = b.direction,
                g;
            e.opacity = 0.1;
            "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", "down" === f || "right" === f ? (e[g] = x(m(e[g]) - 200), c[g] = "+=200px") : (e[g] = x(m(e[g]) + 200), c[g] = "-=200px"));
            "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, { duration: a.nextSpeed, easing: a.nextEasing, complete: b._afterZoomIn })
        },
        changeOut: function() {
            var a = b.previous,
                d = a.prevEffect,
                e = { opacity: 0.1 },
                c = b.direction;
            "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px");
            a.wrap.animate(e, { duration: "none" === d ? 0 : a.prevSpeed, easing: a.prevEasing, complete: function() { f(this).trigger("onReset").remove() } })
        }
    };
    b.helpers.overlay = {
        defaults: { closeClick: !0, speedOut: 200, showEarly: !0, css: {}, locked: !t, fixed: !0 },
        overlay: null,
        fixed: !1,
        el: f("html"),
        create: function(a) {
            var d;
            a = f.extend({}, this.defaults, a);
            this.overlay &&
                this.close();
            d = b.coming ? b.coming.parent : a.parent;
            this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(d && d.lenth ? d : "body");
            this.fixed = !1;
            a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function(a) {
            var d = this;
            a = f.extend({}, this.defaults, a);
            this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a);
            this.fixed || (q.bind("resize.overlay", f.proxy(this.update, this)), this.update());
            a.closeClick && this.overlay.bind("click.overlay",
                function(a) {
                    if (f(a.target).hasClass("fancybox-overlay")) return b.isActive ? b.close() : d.close(), !1
                });
            this.overlay.css(a.css).show()
        },
        close: function() {
            q.unbind("resize.overlay");
            this.el.hasClass("fancybox-lock") && (f(".fancybox-margin").removeClass("fancybox-margin"), this.el.removeClass("fancybox-lock"), q.scrollTop(this.scrollV).scrollLeft(this.scrollH));
            f(".fancybox-overlay").remove().hide();
            f.extend(this, { overlay: null, fixed: !1 })
        },
        update: function() {
            var a = "100%",
                b;
            this.overlay.width(a).height("100%");
            J ? (b = Math.max(H.documentElement.offsetWidth, H.body.offsetWidth), p.width() > b && (a = p.width())) : p.width() > q.width() && (a = p.width());
            this.overlay.width(a).height(p.height())
        },
        onReady: function(a, b) {
            var e = this.overlay;
            f(".fancybox-overlay").stop(!0, !0);
            e || this.create(a);
            a.locked && this.fixed && b.fixed && (b.locked = this.overlay.append(b.wrap), b.fixed = !1);
            !0 === a.showEarly && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function(a, b) {
            b.locked && !this.el.hasClass("fancybox-lock") && (!1 !== this.fixPosition && f("*").filter(function() {
                return "fixed" ===
                    f(this).css("position") && !f(this).hasClass("fancybox-overlay") && !f(this).hasClass("fancybox-wrap")
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin"), this.scrollV = q.scrollTop(), this.scrollH = q.scrollLeft(), this.el.addClass("fancybox-lock"), q.scrollTop(this.scrollV).scrollLeft(this.scrollH));
            this.open(a)
        },
        onUpdate: function() { this.fixed || this.update() },
        afterClose: function(a) { this.overlay && !b.coming && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this)) }
    };
    b.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(a) {
            var d = b.current,
                e = d.title,
                c = a.type;
            f.isFunction(e) && (e = e.call(d.element, d));
            if (r(e) && "" !== f.trim(e)) {
                d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>");
                switch (c) {
                    case "inside":
                        c = b.skin;
                        break;
                    case "outside":
                        c = b.wrap;
                        break;
                    case "over":
                        c = b.inner;
                        break;
                    default:
                        c = b.skin, d.appendTo("body"), J && d.width(d.width()), d.wrapInner('<span class="child"></span>'), b.current.margin[2] += Math.abs(m(d.css("margin-bottom")))
                }
                d["top" === a.position ? "prependTo" :
                    "appendTo"](c)
            }
        }
    };
    f.fn.fancybox = function(a) {
        var d, e = f(this),
            c = this.selector || "",
            l = function(g) {
                var h = f(this).blur(),
                    k = d,
                    l, m;
                g.ctrlKey || g.altKey || g.shiftKey || g.metaKey || h.is(".fancybox-wrap") || (l = a.groupAttr || "data-fancybox-group", m = h.attr(l), m || (l = "rel", m = h.get(0)[l]), m && "" !== m && "nofollow" !== m && (h = c.length ? f(c) : e, h = h.filter("[" + l + '="' + m + '"]'), k = h.index(this)), a.index = k, !1 !== b.open(h, a) && g.preventDefault())
            };
        a = a || {};
        d = a.index || 0;
        c && !1 !== a.live ? p.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')",
            "click.fb-start", l) : e.unbind("click.fb-start").bind("click.fb-start", l);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    p.ready(function() {
        var a, d;
        f.scrollbarWidth === w && (f.scrollbarWidth = function() {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                b = a.children(),
                b = b.innerWidth() - b.height(99).innerWidth();
            a.remove();
            return b
        });
        f.support.fixedPosition === w && (f.support.fixedPosition = function() {
            var a = f('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                b = 20 === a[0].offsetTop || 15 === a[0].offsetTop;
            a.remove();
            return b
        }());
        f.extend(b.defaults, { scrollbarWidth: f.scrollbarWidth(), fixed: f.support.fixedPosition, parent: f("body") });
        a = f(s).width();
        K.addClass("fancybox-lock-test");
        d = f(s).width();
        K.removeClass("fancybox-lock-test");
        f("<style type='text/css'>.fancybox-margin{margin-right:" + (d - a) + "px;}</style>").appendTo("head")
    })
})(window, document, jQuery);

//-----------------------------------------------------
//scrollLoading.js部分
//-----------------------------------------------------

/*!
 * jquery.scrollLoading.js
 * by zhangxinxu http://www.zhangxinxu.com/wordpress/?p=1259
 * 2010-11-19 v1.0
 * 2012-01-13 v1.1 偏移值计算修改 position → offset
 * 2012-09-25 v1.2 增加滚动容器参数, 回调参数
 * 2014-08-11 v1.3 修复设置滚动容器参数一些bug, 以及误删posb值的一些低级错误
 */
(function($) {
    $.fn.scrollLoading = function(options) {
        var defaults = {
            attr: "data-url",
            container: $(window),
            callback: $.noop
        };
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function() {
            var node = this.nodeName.toLowerCase(),
                url = $(this).attr(params["attr"]);
            //重组
            var data = {
                obj: $(this),
                tag: node,
                url: url
            };
            params.cache.push(data);
        });

        var callback = function(call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0));
            }
        };
        //动态显示数据
        var loading = function() {

            var contHeight = params.container.height();
            if (params.container.get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = params.container.offset().top;
            }

            $.each(params.cache, function(i, data) {
                var o = data.obj,
                    tag = data.tag,
                    url = data.url,
                    post, posb;
                if (o) {
                    post = o.offset().top - contop, posb = post + o.height();
                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //图片，改变src
                                callback(o.attr("src", url));
                            } else {
                                o.load(url, {}, function() {
                                    callback(o);
                                });
                            }
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;
                    }
                }
            });
        };

        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.bind("scroll", loading);
    };
})(jQuery);


(function($) {

    // Image scroll loading
    $('.main-body-content img').each(function() {
        $(this).attr('data-url', $(this).attr('src'));
        $(this).removeAttr('src');
        $(this).addClass('scrollLoading');
        $(this).wrap('<div class="scrollLoading-wrap"></div>');
    });

    var imgCount,
        timer = setInterval(function() {
            if (imgCount <= 0)
                clearInterval(timer);
            isLoaded();
        }, 500);

    var isLoaded = function() {
        $('.scrollLoading').each(function(i, img) {
            if ($(this).height() > 0 && $(this).parents('.scrollLoading-wrap').length) {
                if ($(this).parent().hasClass('scrollLoading-wrap'))
                    $(this).unwrap();
                else
                    $(this).parent().unwrap();
            }
        });
        imgCount = $('.scrollLoading-wrap').length;
    };

    $('.scrollLoading').scrollLoading();

})(jQuery);




//-----------------------------------------------------
//顶部雪花
//-----------------------------------------------------
(function() {
    function snow() {
        var parCount = 50, //雪花的数量
            parMax = 150, //雪花的最大数量
            sky = document.querySelector('#header'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            width = sky.clientWidth,
            height = sky.clientHeight,
            i = 0,
            active = false, //当屏幕小于480则默认关闭雪花
            snowflakes = [],
            snowflake = null;

        //定位并且设置3D变换开启GPU加速
        canvas.style.cssText = 'position:absolute;top:0;transform:translateZ(0);';

        var Snowflake = function() {
            this.x = 0;
            this.y = 0;
            this.vy = 0;
            this.vx = 0;
            this.r = 0;
            this.reset();
        };

        Snowflake.prototype.reset = function() {
            this.x = Math.random() * width; //雪花的位置
            this.y = Math.random() * -height;
            this.vy = 1 + Math.random() * 3; //位置偏移
            this.vx = 0.5 - Math.random();
            this.r = 1 + Math.random() * 2; //半径
            this.o = 0.5 + Math.random() * 0.5; //透明度
        };

        function genetateSnowFalkes() {
            for (i = 0; i < parMax; i++) {
                snowflake = new Snowflake();
                snowflake.reset();
                snowflakes.push(snowflake);
            };
        }
        genetateSnowFalkes();

        function update() {
            ctx.clearRect(0, 0, width, height);
            if (!active) {
                return;
            }
            for (i = 0; i < parCount; i++) {
                snowflake = snowflakes[i];
                snowflake.y += snowflake.vy;
                snowflake.x += snowflake.vx;
                ctx.globalAlpha = snowflake.o;
                ctx.beginPath();
                ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                if (snowflake.y > height) {
                    snowflake.reset();
                };
            };
            requestAnimFrame(update);
        }

        function onResize() {
            width = sky.clientWidth;
            height = sky.clientHeight;
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = '#fff';

            var wasActive = active;
            active = width > 480;
            if (!wasActive && active) {
                requestAnimFrame(update);
            }

        }

        window.requestAnimFrame = (function() { //浏览器兼容的requestAnimFrame方法
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        onResize();
        window.addEventListener('resize', onResize, false);
        sky.appendChild(canvas);
    }
    snow();
})();

//-----------------------------------------------------
//页面事件
//-----------------------------------------------------
(function($) {
    // To top button
    $("#back-to-top").on('click', backToTop);

    function backToTop() {
        $('body, html').animate({ scrollTop: 0 }, 600);
    }

    // Nav bar toggle
    $('#main-nav-toggle').on('click', navToggle);

    function navToggle() {
        $('.nav-container-inner').slideToggle();
    }

    // Caption
    $('.article-entry').each(function(i) {
        $(this).find('img').each(function() {
            if ($(this).parent().hasClass('fancybox')) {
                return;
            }
            var alt = this.alt;
            if (alt) {
                $(this).after('<span class="caption">' + alt + '</span>');
            }

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function() {
            $(this).attr('rel', 'article' + i);
        });
    });
    if ($.fancybox) {
        $('.fancybox').fancybox();
    }


    // Sidebar expend
    $('#sidebar .sidebar-toggle').click(function() {
        if ($('#sidebar').hasClass('expend')) {
            $('#sidebar').removeClass('expend');
        } else {
            $('#sidebar').addClass('expend');
        }
    });


    // Remove extra main nav wrap
    $('.main-nav-list > li').unwrap();

    // Highlight current nav item
    $('#main-nav > li > .main-nav-list-link').each(function() {
        if ($('.page-title-link').length > 0) {
            if ($(this).html().toUpperCase() == $('.page-title-link').html().toUpperCase()) {
                $(this).addClass('current');
            } else if ($(this).attr('href') == $('.page-title-link').attr('data-url')) {
                $(this).addClass('current');
            }
        }
    });

    // Auto hide main nav menus
    function autoHideMenus() {
        var max_width = $('.nav-container-inner').width() - 10;
        var main_nav_width = $('#main-nav').width();
        var sub_nav_width = $('#sub-nav').width();
        if (main_nav_width + sub_nav_width > max_width) {
            // If more link not exists
            if ($('.main-nav-more').length == 0) {
                $(['<li class="main-nav-list-item top-level-menu main-nav-more">',
                    '<a class="main-nav-list-link" href="javascript:;">More</a>',
                    '<ul class="main-nav-list-child">',
                    '</ul></li>'
                ].join('')).appendTo($('#main-nav'));
                // Bind hover event
                $('.main-nav-more').hover(function() {
                    if ($(window).width() < 480) {
                        return;
                    }
                    $(this).children('.main-nav-list-child').slideDown('fast');
                }, function() {
                    if ($(window).width() < 480) {
                        return;
                    }
                    $(this).children('.main-nav-list-child').slideUp('fast');
                });
            }
            var child_count = $('#main-nav').children().length;
            for (var i = child_count - 2; i >= 0; i--) {
                var element = $('#main-nav').children().eq(i);
                if (main_nav_width + sub_nav_width > max_width) {
                    element.prependTo($('.main-nav-more > ul'));
                    main_nav_width = $('#main-nav').width();
                } else {
                    return;
                }
            }
        }
        // Nav bar is wide enough
        if ($('.main-nav-more').length > 0) {
            $('.main-nav-more > ul').children().appendTo($('#main-nav'));
            $('.main-nav-more').remove();
        }
    }
    autoHideMenus();

    $(window).resize(function() {
        autoHideMenus();
        fixSideBar();
    });

    // Fold second-level menu
    $('.main-nav-list-item').hover(function() {
        if ($(window).width() < 480) {
            return;
        }
        $(this).children('.main-nav-list-child').slideDown('fast');
    }, function() {
        if ($(window).width() < 480) {
            return;
        }
        $(this).children('.main-nav-list-child').slideUp('fast');
    });

    // Add second-level menu mark
    $('.main-nav-list-item').each(function() {
        if ($(this).find('.main-nav-list-child').length > 0) {
            $(this).addClass('top-level-menu');
        }
    });

    // The sidebarTop's offset Top
    function fixSideBar() {
        //缓存变量
        var sidebarTop = $('.sidebar-top'),
            top = sidebarTop.offset().top,
            sidebar = $('#sidebar'),
            win = $(window);

        function scroll() {
            var scrollTopPosition = win.scrollTop();
            if (scrollTopPosition > top) {
                sidebarTop.addClass('fixSidebar');
            } else {
                sidebarTop.removeClass('fixSidebar');

            }
        }

        return scroll;
    }

    //这句用到了函数节流，在200ms内不停则不会
    $(window).scroll(throttle(fixSideBar(),50,200));


    /**
     * 函数节流方法
     * @param Function fn 延时调用函数
     * @param Number delay 延迟多长时间
     * @param Number atleast 至少多长时间触发一次
     * @return Function 延迟执行的方法
     */
    function throttle(fn, delay, atleast) {
        var timer = null;
        var previous = null;
     
        return function () {
            var now = +new Date();
     
            if ( !previous ) previous = now;
     
            if ( now - previous > atleast ) {
                fn();
                // 重置上一次开始时间为本次结束时间
                previous = now;
            } else {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn();
                }, delay);
            }
        }
    };


    $('.fa-wechat').on('click', function(e) {
        $.fancybox( '<div><img alt="MyWeChatCode" height="300" width="300" src="/images/myWeChatID.png"></div>', {
            title : '请扫描二维码添加我的微信'
        });
        e.preventDefault();
    });

})(jQuery);
