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
            active = false, //当屏幕小于300则默认关闭雪花
            snowflakes = [],
            snowflake = null;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';

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
        }

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
            active = width > 300;
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
(function ($) {
    // To top button
    $("#back-to-top").on('click', function () {
        $('body, html').animate({ scrollTop: 0 }, 600);
    });

    // Nav bar toggle
    $('#main-nav-toggle').on('click', function () {
        $('.nav-container-inner').slideToggle();
    });

    // Caption
    $('.article-entry').each(function (i) {
        $(this).find('img').each(function () {
            if ($(this).parent().hasClass('fancybox')) {
                return;
            }
            var alt = this.alt;
            if (alt) {
                $(this).after('<span class="caption">' + alt + '</span>');
            }

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function(){
            $(this).attr('rel', 'article' + i);
        });
    });
    if ($.fancybox) {
        $('.fancybox').fancybox();
    }

    // Sidebar expend
    $('#sidebar .sidebar-toggle').click(function () {
        if($('#sidebar').hasClass('expend')) {
            $('#sidebar').removeClass('expend');
        } else {
            $('#sidebar').addClass('expend');
        }
    });


    // Remove extra main nav wrap
    $('.main-nav-list > li').unwrap();

    // Highlight current nav item
    $('#main-nav > li > .main-nav-list-link').each(function () {
        if($('.page-title-link').length > 0){
            if ($(this).html().toUpperCase() == $('.page-title-link').html().toUpperCase()) {
                $(this).addClass('current');
            } else if ($(this).attr('href') == $('.page-title-link').attr('data-url')) {
                $(this).addClass('current');
            }
        }
    });

    // Auto hide main nav menus
    function autoHideMenus(){
        var max_width = $('.nav-container-inner').width() - 10;
        var main_nav_width = $('#main-nav').width();
        var sub_nav_width = $('#sub-nav').width();
        if (main_nav_width + sub_nav_width > max_width) {
            // If more link not exists
            if ($('.main-nav-more').length == 0) {
                $(['<li class="main-nav-list-item top-level-menu main-nav-more">',
                    '<a class="main-nav-list-link" href="javascript:;">More</a>',
                    '<ul class="main-nav-list-child">',
                    '</ul></li>'].join('')).appendTo($('#main-nav'));
                // Bind hover event
                $('.main-nav-more').hover(function () {
                    if($(window).width() < 480) {
                        return;
                    }
                    $(this).children('.main-nav-list-child').slideDown('fast');
                }, function () {
                    if($(window).width() < 480) {
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

    $(window).resize(function () {
        autoHideMenus();
    });

    // Fold second-level menu
    $('.main-nav-list-item').hover(function () {
        if ($(window).width() < 480) {
            return;
        }
        $(this).children('.main-nav-list-child').slideDown('fast');
    }, function () {
        if ($(window).width() < 480) {
            return;
        }
        $(this).children('.main-nav-list-child').slideUp('fast');
    });

    // Add second-level menu mark
    $('.main-nav-list-item').each(function () {
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
            win = $(window)
            ;

        function scroll() {
            var scrollTopPosition = win.scrollTop();
            if (scrollTopPosition > top && !sidebar.hasClass('expend')) {
                sidebarTop.addClass('fixSidebar');
            } else {
                sidebarTop.removeClass('fixSidebar');

            }
        }
        win.scroll(scroll);
    }

    fixSideBar();

})(jQuery);
