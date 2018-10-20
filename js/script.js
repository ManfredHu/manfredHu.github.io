(function($) {
    // Highlight current nav item on HomePage
    var winPathName = window.location.pathname;
    if ($('#navigater-list').length > 0) {
        $('#navigater-list > a').each(function() {
            if (winPathName.indexOf($(this).attr('href')) != -1) {
                $(this).addClass('main-nav-link__active curpoint-normal');
            }
        });
    }
    // Highlight current nav item on achieve Page
    if ($('.nav').length > 0) {
        $('.nav a').each(function() {
            var currentHref = $(this).attr('href');
            //匹配且不为链接
            if (winPathName.indexOf(currentHref) != -1 && currentHref != '/') {
                $(this).addClass('main-nav-link__active curpoint-normal');
            } else {
                $(this).removeClass('main-nav-link__active');
            }
        });
        if ($('.main-nav-link__active').length == 0) {
            $('.nav a').eq(1).addClass('main-nav-link__active curpoint-normal');
        }
    }


    // Search
    var $searchWrap = $('#search-form-wrap'),
        isSearchAnim = false,
        searchAnimDuration = 200;

    var startSearchAnim = function() {
        isSearchAnim = true;
    };

    var stopSearchAnim = function(callback) {
        setTimeout(function() {
            isSearchAnim = false;
            callback && callback();
        }, searchAnimDuration);
    };

    $('#nav-search-btn').on('click', function() {
        if (isSearchAnim) return;

        startSearchAnim();
        $searchWrap.addClass('on');
        stopSearchAnim(function() {
            $('.search-form-input').focus();
        });
    });

    $('.search-form-input').on('blur', function() {
        startSearchAnim();
        $searchWrap.removeClass('on');
        stopSearchAnim();
    });

    // Share
    $('body').on('click', function() {
        $('.article-share-box.on').removeClass('on');
    }).on('click', '.article-share-link', function(e) {
        e.stopPropagation();

        var $this = $(this),
            url = $this.attr('data-url'),
            encodedUrl = encodeURIComponent(url),
            id = 'article-share-box-' + $this.attr('data-id'),
            offset = $this.offset();

        if ($('#' + id).length) {
            var box = $('#' + id);

            if (box.hasClass('on')) {
                box.removeClass('on');
                return;
            }
        } else {
            var html = [
                '<div id="' + id + '" class="article-share-box">',
                '<input class="article-share-input" value="' + url + '">',
                '<div class="article-share-links">',
                '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
                '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
                '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
                '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
                '</div>',
                '</div>'
            ].join('');

            var box = $(html);

            $('body').append(box);
        }

        $('.article-share-box.on').hide();

        box.css({
            top: offset.top + 25,
            left: offset.left
        }).addClass('on');
    }).on('click', '.article-share-box', function(e) {
        e.stopPropagation();
    }).on('click', '.article-share-box-input', function() {
        $(this).select();
    }).on('click', '.article-share-box-link', function(e) {
        e.preventDefault();
        e.stopPropagation();

        window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
    });

    // Caption
    $('.article-entry').each(function(i) {
        $(this).find('img').each(function() {
            if ($(this).parent().hasClass('fancybox')) return;

            var alt = this.alt;

            if (alt) $(this).after('<span class="caption">' + alt + '</span>');

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function() {
            $(this).attr('rel', 'article' + i);
        });
    });

    if ($.fancybox) {
        $('.fancybox').fancybox();
    }

    // Mobile nav
    var $container = $('#container'),
        isMobileNavAnim = false,
        mobileNavAnimDuration = 200;

    var startMobileNavAnim = function() {
        isMobileNavAnim = true;
    };

    var stopMobileNavAnim = function() {
        setTimeout(function() {
            isMobileNavAnim = false;
        }, mobileNavAnimDuration);
    }

    $('#main-nav-toggle').on('click', function() {
        if (isMobileNavAnim) return;

        startMobileNavAnim();
        $container.toggleClass('mobile-nav-on');
        stopMobileNavAnim();
    });

    $('#wrap').on('click', function() {
        if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

        $container.removeClass('mobile-nav-on');
    });

    //设置导航全屏高度
    if ($('#toc').length > 0) {
        $('#toc').height($(window).height());
    }
    //显示右边隐藏目录按钮
    $('.fix-sidebar-nav').on('click', function() {
        //已经展开了目录
        if ($('.big-sidebar').hasClass('big-sidebar__show')) {
            $('.big-sidebar').removeClass('big-sidebar__show');
            $('.fix-sidebar-nav').removeClass('fix-sidebar-nav__active');
        } else { //还没有展开目录
            $('.big-sidebar').addClass('big-sidebar__show');
            $('.fix-sidebar-nav').addClass('fix-sidebar-nav__active');
            updateMenuPosition();
        }
    });
    //点击目录的某一项
    $('.toc-item').on('click',function(){

    });


    //markdown nav
    // function hideMarkDownNav(){
    //     $('#sidebar').hide();
    //     $('#main').find('article').css('width','100%');
    // }
    // function showMarkDownNav(){
    //     $('#main').find('article').css('width','75%');
    // }
    //当没有目录的时候隐藏掉
    // if($('.toc').text() == 'None'){
    //     hideMarkDownNav();
    // }
    //按钮切换
    // $('.sidebarBtn__hide').on('click',function(){
    //     hideMarkDownNav();
    // });

    //评论按钮点击
    $('.fix-sidebar-comment').on('click', function() {
        var ids = ['comment', 'comments', 'uyan_frame'];
        for (var i = 0; i < ids.length; i++) {
            if (document.getElementById(ids[i])) {
                break;
            }
        }
        var comment = document.getElementById(ids[i]);
        $("html, body").animate({
            scrollTop: $(comment).offset().top
        }, 500, null);
    });

    $('.fix-sidebar-share').on('click', function() {
        var ids = ['baidu-share'];
        for (var i = 0; i < ids.length; i++) {
            if (document.getElementById(ids[i])) {
                break;
            }
        }
        var comment = document.getElementById(ids[i]);
        $("html, body").animate({
            scrollTop: $(comment).offset().top - $(window).height() / 2 + 30
        }, 500, null);
    });

    var musicIsLoad = false;
    $('.fix-sidebar-music').on('click', function() {
        if (musicIsLoad) return; //防止重复点击加载多个播放器
        musicIsLoad = true;
        if ($('#musicComponent').length <= 0) return; //没有dom结构,return掉
        var musicComponent = document.getElementById('musicComponent');
        musicComponent.style.margin = '0'
        musicComponent.style.padding = '0'
        musicComponent.style.border = 'none'
        musicComponent.style.width = '330px'
        musicComponent.style.height = '450px'
        musicComponent.style.overflow = 'hidden'
        musicComponent.style.position = "absolute"
        musicComponent.style.left = '-330px'
        musicComponent.style.top = "0"
        musicComponent.style.zIndex = 10
        var frame = document.createElement('iframe');
        frame.frameborder = 'no';
        frame.border = "0"
        frame.marginwidth = "0"
        frame.marginheight = "0"
        frame.width = 330
        frame.height = 450
        //应换成自己的歌单
        frame.src = "//music.163.com/outchain/player?type=0&id=700296152&auto=1&height=430"
        document.getElementById('musicComponent').appendChild(frame);
        frame.onload = function() {
            musicIsLoad = false;
            $('.fix-sidebar-music').addClass('fix-sidebar-music__active');
            $('.fix-sidebar-music').off('click').on('click', function() {
                if ($('.fix-sidebar-music').hasClass('fix-sidebar-music__active')) {
                    $('.fix-sidebar-music').removeClass('fix-sidebar-music__active');
                    $('#musicComponent').hide();
                } else {
                    $('.fix-sidebar-music').addClass('fix-sidebar-music__active');
                    $('#musicComponent').show();
                }
            });
        }
    });
    $('.fix-sidebar-search').on('click', function() {
        $('.search-form-submit').trigger('click');
        //@todo 点击会刷新页面
    });

    //记忆每个标题的位置
    var menuPosition = [];
    var sidebarLinks = [];
    function initMenuPosition() {
        if($('.article-entry').length <= 0 ) return;
        var selectTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        var tagArr = $('.article-entry').find(selectTag.join(','));
        for (var i = 0, len = tagArr.length; i < len; i++) {
            menuPosition.push({
                target: tagArr[i],//目标
                y: $(tagArr[i]).offset().top - 20 //距离顶部的位置
            });
        }
        updateMenuPosition();
    }
    initMenuPosition();

    function updateMenuPosition(){
        var scrollTop = $(document).scrollTop();
        var item = getItemFromMenuPosition(menuPosition,scrollTop);
        sidebarLinks = $('.toc').find('a');
        for(var i=0,len=sidebarLinks.length;i<len;i++){
            if($(sidebarLinks[i]).attr('href').slice(1) == item.target.id){
                $(sidebarLinks[i]).addClass('color-text__active');
            }else{
                $(sidebarLinks[i]).removeClass('color-text__active');
            }
        }
    }

    function getItemFromMenuPosition(items,value){
        if(items.length <= 0 && value ==0) return;
        if(items.length <= 0) return;
        if(value <= items[0].y) return items[0];
        if(value >= items[items.length-1].y) return items[items.length-1];
        for(var i=0,len=items.length;i<len;i++){
            if(value >= items[i].y && value < items[i+1].y){
                return items[i];
            }
        }
    }

    function throttle(method, delay, duration) {
        var timer = null,
            begin = new Date();
        return function() {
            var context = this,
                args = arguments,
                current = new Date();;
            clearTimeout(timer);
            if (current - begin >= duration) {
                method.apply(context, args);
                begin = current;
            } else {
                timer = setTimeout(function() {
                    method.apply(context, args);
                }, delay);
            }
        }
    }
    var bigSidebar = $('.big-sidebar');
    var scrollHandler = function(event) {
        //有显示目录才更新
        if(bigSidebar.hasClass('big-sidebar__show')){
            updateMenuPosition();
        }
    }
    //页面滚动，更新目录
    $(document).scroll(throttle(scrollHandler, 100, 500));
})(jQuery);


//home.js
var navbar = document.getElementsByClassName("intro-navigate")[0],
	h = window.innerHeight;

//window.addEventListener("scroll", scrollHandler);

function getStyle(obj, attri) {
 	return obj.currentStyle ? obj.currentStyle[attri] : window.getComputedStyle(obj, null)[attri];
}

function scrollHandler(e) {
	 var event = e || window.event,
	     target = event.target || event.srcElement;
	 var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	 if (scrollTop > h - navbar.offsetHeight) {
	     navbar.classList.add("fixed");
	 } else {
	     navbar.classList.remove("fixed");
	 }
}

//totop.js
$(window).scroll(function() {
    //滚动超过视口的一半
    // $(window).scrollTop() > $(window).height()*0.5 ? $("#rocket").addClass("show") : $("#rocket").removeClass("show");
    $(window).scrollTop() > $(window).height()*0.5 ? $(".fix-sidebar-totop").addClass("show") : $(".fix-sidebar-totop").removeClass("show");
});

$(".fix-sidebar-totop").click(function() {
    // $("#rocket").addClass("launch");
    $("html, body").animate({
        scrollTop: 0
    }, 500, function() {
        // $("#rocket").removeClass("show launch");
        $(".fix-sidebar-totop").removeClass("show");
    });
    return false;
});

$("#homelogo").click(function() {
    $("html, body").animate({
        scrollTop: $(window).height()
    }, 500, null);
    return false;
});

