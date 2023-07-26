if (typeof jQuery !== "undefined") {
    var $ = jQuery.noConflict();
}

(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
        ? define(factory)
        : ((global =
              typeof globalThis !== "undefined" ? globalThis : global || self),
          (global.SEMICOLON = factory()));
})(this, function () {
    // USE STRICT
    "use strict";

    var options = {
        pageTransition: false,
        cursor: false,
        headerSticky: true,
        headerMobileSticky: false,
        menuBreakpoint: 992,
        pageMenuBreakpoint: 992,
        gmapAPI: "",
        scrollOffset: 60,
        scrollExternalLinks: true,
        jsFolder: "/app/assets/js/",
        cssFolder: "/app/assets/css/",
    };

    var vars = {
        baseEl: document,
        elRoot: document.documentElement,
        elHead: document.head,
        elBody: document.body,
        hash: window.location.hash,
        topScrollOffset: 0,
        elWrapper: document.getElementById("wrapper"),
        elHeader: document.getElementById("header"),
        headerClasses: "",
        elHeaderWrap: document.getElementById("header-wrap"),
        headerWrapClasses: "",
        headerHeight: 0,
        headerOffset: 0,
        headerWrapHeight: 0,
        headerWrapOffset: 0,
        elPrimaryMenus: document.querySelectorAll(".primary-menu"),
        elPrimaryMenuTriggers: document.querySelectorAll(
            ".primary-menu-trigger"
        ),
        elPageMenu: document.getElementById("page-menu"),
        pageMenuOffset: 0,
        elSlider: document.getElementById("slider"),
        elFooter: document.getElementById("footer"),
        elAppMenu: document.querySelector(".app-menu"),
        portfolioAjax: {},
        sliderParallax: {
            el: document.querySelector(".slider-parallax"),
            caption: document.querySelector(".slider-parallax .slider-caption"),
            inner: document.querySelector(".slider-inner"),
            offset: 0,
        },
        get menuBreakpoint() {
            return (
                this.elBody.getAttribute("data-menu-breakpoint") ||
                options.menuBreakpoint
            );
        },
        get pageMenuBreakpoint() {
            return (
                this.elBody.getAttribute("data-pagemenu-breakpoint") ||
                options.pageMenuBreakpoint
            );
        },
        get customCursor() {
            var value =
                this.elBody.getAttribute("data-custom-cursor") ||
                options.cursor;
            return value == "true" || value === true ? true : false;
        },
        get pageTransition() {
            var value =
                this.elBody.classList.contains("page-transition") ||
                options.pageTransition;
            return value == "true" || value === true ? true : false;
        },
        get isRTL() {
            return this.elRoot.getAttribute("dir") == "rtl" ? true : false;
        },
        scrollPos: {
            x: 0,
            y: 0,
        },
        $jq: typeof jQuery !== "undefined" ? jQuery.noConflict() : "",
        resizers: {},
        recalls: {},
        debounced: false,
        events: {},
        modules: {},
        fn: {},
        required: {
            jQuery: {
                plugin: "jquery",
                fn: function () {
                    return typeof jQuery !== "undefined";
                },
                file: options.jsFolder + "jquery.js",
                id: "canvas-jquery",
            },
        },
        fnInit: function () {
            DocumentOnReady.init();
            DocumentOnLoad.init();
            DocumentOnResize.init();
        },
    };

    var Core = (function () {
        return {
            getOptions: options,
            getVars: vars,

            run: function (obj) {
                Object.values(obj).map(function (fn) {
                    return typeof fn === "function" && fn.call();
                });
            },

            runBase: function () {
                Core.run(Base);
            },

            runModules: function () {
                Core.run(Modules);
            },

            runContainerModules: function (parent) {
                if (typeof parent === "undefined") {
                    return false;
                }

                Core.getVars.baseEl = parent;
                Core.runModules();
                Core.getVars.baseEl = document;
            },

            breakpoints: function () {
                var viewWidth = Core.viewport().width;

                var breakpoint = {
                    xxl: {
                        enter: 1400,
                        exit: 99999,
                    },
                    xl: {
                        enter: 1200,
                        exit: 1399,
                    },
                    lg: {
                        enter: 992,
                        exit: 1199.98,
                    },
                    md: {
                        enter: 768,
                        exit: 991.98,
                    },
                    sm: {
                        enter: 576,
                        exit: 767.98,
                    },
                    xs: {
                        enter: 0,
                        exit: 575.98,
                    },
                };

                var previous = "";

                Object.keys(breakpoint).forEach(function (key) {
                    if (
                        viewWidth > breakpoint[key].enter &&
                        viewWidth <= breakpoint[key].exit
                    ) {
                        vars.elBody.classList.add("device-" + key);
                    } else {
                        vars.elBody.classList.remove("device-" + key);
                        if (previous != "") {
                            vars.elBody.classList.remove(
                                "device-down-" + previous
                            );
                        }
                    }

                    if (viewWidth <= breakpoint[key].exit) {
                        if (previous != "") {
                            vars.elBody.classList.add(
                                "device-down-" + previous
                            );
                        }
                    }

                    previous = key;

                    if (viewWidth > breakpoint[key].enter) {
                        vars.elBody.classList.add("device-up-" + key);
                        return;
                    } else {
                        vars.elBody.classList.remove("device-up-" + key);
                    }
                });
            },

            colorScheme: function () {
                if (vars.elBody.classList.contains("adaptive-color-scheme")) {
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? vars.elBody.classList.add("dark")
                        : vars.elBody.classList.remove("dark");
                }

                var bodyColorScheme = localStorage.getItem(
                    "cnvsBodyColorScheme"
                );

                if (bodyColorScheme && bodyColorScheme != "") {
                    bodyColorScheme.split(" ").includes("dark")
                        ? vars.elBody.classList.add("dark")
                        : vars.elBody.classList.remove("dark");
                }
            },

            throttle: function (timer, func, delay) {
                if (timer) {
                    return;
                }

                timer = setTimeout(function () {
                    func();
                    timer = undefined;
                }, delay);
            },

            debounce: function (callback, delay) {
                clearTimeout(vars.debounced);
                vars.debounced = setTimeout(callback, delay);
            },

            debouncedResize: function (func, delay) {
                var timeoutId;
                return function () {
                    var context = this;
                    var args = arguments;
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        func.apply(context, args);
                    }, delay);
                };
            },

            addEvent: function (el, event, args = {}) {
                if (typeof el === "undefined" || typeof event === "undefined") {
                    return;
                }

                var createEvent = new CustomEvent(event, {
                    detail: args,
                });

                el.dispatchEvent(createEvent);
                vars.events[event] = true;
            },

            scrollEnd: function (callback, refresh = 199) {
                if (!callback || typeof callback !== "function") return;

                window.addEventListener(
                    "scroll",
                    function () {
                        Core.debounce(callback, refresh);
                    },
                    { passive: true }
                );
            },

            viewport: function () {
                var viewport = {
                    width: window.innerWidth || vars.elRoot.clientWidth,
                    height: window.innerHeight || vars.elRoot.clientHeight,
                };

                document.documentElement.style.setProperty(
                    "--cnvs-viewport-width",
                    viewport.width
                );
                document.documentElement.style.setProperty(
                    "--cnvs-viewport-height",
                    viewport.height
                );

                return viewport;
            },

            isElement: function (selector) {
                if (!selector || typeof selector !== "object") {
                    return false;
                }

                if (typeof selector.jquery !== "undefined") {
                    selector = selector[0];
                }

                return typeof selector.nodeType !== "undefined";
            },

            getSelector: function (selector, jquery = true, customjs = true) {
                if (jquery) {
                    if (Core.getVars.baseEl !== document) {
                        selector = jQuery(Core.getVars.baseEl).find(selector);
                    } else {
                        selector = jQuery(selector);
                    }

                    if (customjs) {
                        if (typeof customjs == "string") {
                            selector = selector.filter(
                                ":not(" + customjs + ")"
                            );
                        } else {
                            selector = selector.filter(":not(.customjs)");
                        }
                    }
                } else {
                    if (Core.isElement(selector)) {
                        selector = selector;
                    } else {
                        if (customjs) {
                            if (typeof customjs == "string") {
                                selector = Core.getVars.baseEl.querySelectorAll(
                                    selector + ":not(" + customjs + ")"
                                );
                            } else {
                                selector = Core.getVars.baseEl.querySelectorAll(
                                    selector + ":not(.customjs)"
                                );
                            }
                        } else {
                            selector =
                                Core.getVars.baseEl.querySelectorAll(selector);
                        }
                    }
                }

                return selector;
            },

            onResize: function (callback, refresh = 333) {
                if (!callback || typeof callback !== "function") return;

                window.addEventListener("resize", function () {
                    Core.debounce(callback, refresh);
                });
            },

            imagesLoaded: function (el) {
                var imgs = el.getElementsByTagName("img") || document.images,
                    len = imgs.length,
                    counter = 0;

                if (len < 1) {
                    Core.addEvent(el, "CanvasImagesLoaded");
                }

                var incrementCounter = async function () {
                    counter++;
                    if (counter === len) {
                        Core.addEvent(el, "CanvasImagesLoaded");
                    }
                };

                [].forEach.call(imgs, function (img) {
                    if (img.complete) {
                        incrementCounter();
                    } else {
                        img.addEventListener("load", incrementCounter, false);
                    }
                });
            },

            contains: function (classes, selector) {
                var classArray = classes.split(" ");
                var hasClass = false;

                classArray.forEach(function (classTxt) {
                    if (vars.elBody.classList.contains(classTxt)) {
                        hasClass = true;
                    }
                });

                return hasClass;
            },

            has: function (nodeList, selector) {
                return [].slice.call(nodeList)?.filter(function (e) {
                    return e.querySelector(selector);
                });
            },

            filtered: function (nodeList, selector) {
                return [].slice.call(nodeList)?.filter(function (e) {
                    return e.matches(selector);
                });
            },

            parents: function (elem, selector) {
                if (!Element.prototype.matches) {
                    Element.prototype.matches =
                        Element.prototype.matchesSelector ||
                        Element.prototype.mozMatchesSelector ||
                        Element.prototype.msMatchesSelector ||
                        Element.prototype.oMatchesSelector ||
                        Element.prototype.webkitMatchesSelector ||
                        function (s) {
                            var matches = (
                                    this.document || this.ownerDocument
                                ).querySelectorAll(s),
                                i = matches.length;
                            while (--i >= 0 && matches.item(i) !== this) {}
                            return i > -1;
                        };
                }

                var parents = [];

                for (; elem && elem !== document; elem = elem.parentNode) {
                    if (selector) {
                        if (elem.matches(selector)) {
                            parents.push(elem);
                        }
                        continue;
                    }
                    parents.push(elem);
                }

                return parents;
            },

            siblings: function (elem, nodes = false) {
                if (nodes) {
                    return [].slice.call(nodes).filter(function (sibling) {
                        return sibling !== elem;
                    });
                } else {
                    return [].slice
                        .call(elem.parentNode.children)
                        .filter(function (sibling) {
                            return sibling !== elem;
                        });
                }
            },

            getNext: function (elem, selector) {
                var nextElem = elem.nextElementSibling;

                if (!selector) {
                    return nextElem;
                }

                if (nextElem && nextElem.matches(selector)) {
                    return nextElem;
                }

                return null;
            },

            offset: function (el) {
                var rect = el.getBoundingClientRect(),
                    scrollLeft =
                        window.pageXOffset ||
                        document.documentElement.scrollLeft,
                    scrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop;

                return {
                    top: rect.top + scrollTop,
                    left: rect.left + scrollLeft,
                };
            },

            isHidden: function (el) {
                return el.offsetParent === null;
            },

            classesFn: function (func, classes, selector) {
                var classArray = classes.split(" ");
                classArray.forEach(function (classTxt) {
                    if (func == "add") {
                        selector.classList.add(classTxt);
                    } else if (func == "toggle") {
                        selector.classList.toggle(classTxt);
                    } else {
                        selector.classList.remove(classTxt);
                    }
                });
            },

            loadCSS: function (params) {
                var file = params.file;
                var htmlID = params.id || false;
                var cssFolder = params.cssFolder || false;

                if (!file) {
                    return false;
                }

                if (htmlID && document.getElementById(htmlID)) {
                    return false;
                }

                var htmlStyle = document.createElement("link");

                htmlStyle.id = htmlID;
                htmlStyle.href = cssFolder ? options.cssFolder + file : file;
                htmlStyle.rel = "stylesheet";
                htmlStyle.type = "text/css";

                vars.elHead.appendChild(htmlStyle);
                return true;
            },

            loadJS: function (params) {
                var file = params.file;
                var htmlID = params.id || false;
                var type = params.type || false;
                var callback = params.callback;
                var async = params.async || true;
                var defer = params.defer || true;
                var jsFolder = params.jsFolder || false;

                if (!file) {
                    return false;
                }

                if (htmlID && document.getElementById(htmlID)) {
                    return false;
                }

                var htmlScript = document.createElement("script");

                if (typeof callback !== "undefined") {
                    if (typeof callback != "function") {
                        throw new Error("Not a valid callback!");
                    } else {
                        htmlScript.onload = callback;
                    }
                }

                htmlScript.id = htmlID;
                htmlScript.src = jsFolder ? options.jsFolder + file : file;
                if (type) {
                    htmlScript.type = type;
                }
                htmlScript.async = async ? true : false;
                htmlScript.defer = defer ? true : false;

                vars.elBody.appendChild(htmlScript);
                return true;
            },

            isFuncTrue: async function (fn) {
                if ("function" !== typeof fn) {
                    return false;
                }

                var counter = 0;

                return new Promise(function (resolve, reject) {
                    if (fn()) {
                        resolve(true);
                    } else {
                        var int = setInterval(function () {
                            if (fn()) {
                                clearInterval(int);
                                resolve(true);
                            } else {
                                if (counter > 30) {
                                    clearInterval(int);
                                    reject(true);
                                }
                            }
                            counter++;
                        }, 333);
                    }
                }).catch(function (error) {
                    console.log("Function does not exist: " + fn);
                });
            },

            initFunction: function (params) {
                vars.elBody.classList.add(params.class);
                Core.addEvent(window, params.event);
                vars.events[params.event] = true;
            },

            runModule: function (params) {
                var pluginName = params.plugin.toLowerCase();
                var moduleFile =
                    options.jsFolder + "modules/" + pluginName + ".js";

                if (params.file) {
                    moduleFile = params.file;
                }

                var pluginCheck = function () {
                    return typeof CNVS[params.plugin] !== "undefined";
                };

                if (!pluginCheck()) {
                    Core.loadJS({
                        file: moduleFile,
                        id: "canvas-" + pluginName + "-fn",
                    });

                    Core.isFuncTrue(pluginCheck).then(function (cond) {
                        if (!cond) {
                            return false;
                        }

                        CNVS[params.plugin].init(params.selector);
                    });
                } else {
                    CNVS[params.plugin].init(params.selector);
                }

                return true;
            },

            initModule: function (params) {
                if ("dependent" != params.selector) {
                    if (typeof params.selector === "object") {
                        if (params.selector instanceof jQuery) {
                            params.selector = params.selector[0];
                        }

                        var _el = params.selector;
                    } else {
                        var _el = Core.getVars.baseEl.querySelectorAll(
                            params.selector
                        );
                    }

                    if (_el.length < 1) {
                        return false;
                    }
                }

                var required = true;
                var dependentActive = true;

                if (params.required && Array.isArray(params.required)) {
                    var requireAll = {};
                    params.required.forEach(function (req) {
                        return (requireAll[req.plugin] = !req.fn()
                            ? false
                            : true);
                    });

                    params.required.forEach(function (req) {
                        if (!req.fn()) {
                            required = false;
                            var getjQuery = (async function () {
                                Core.loadJS({ file: req.file, id: req.id });

                                var funcAvailable = new Promise(function (
                                    resolve
                                ) {
                                    var int = setInterval(function () {
                                        if (req.fn()) {
                                            requireAll[req.plugin] = true;
                                            var allTrue = Object.values(
                                                requireAll
                                            ).every(function (value) {
                                                return value === true;
                                            });

                                            if (allTrue) {
                                                clearInterval(int);
                                                resolve(true);
                                            }
                                        }
                                    }, 333);
                                });

                                required = await funcAvailable;
                                Core.runModule(params);
                            })();
                        }
                    });
                }

                if (
                    typeof params.dependency !== "undefined" &&
                    typeof params.dependency === "function"
                ) {
                    dependentActive = false;
                    var runDependent = async function () {
                        var depAvailable = new Promise(function (resolve) {
                            if (
                                params.dependency.call(params, "dependent") ==
                                true
                            ) {
                                resolve(true);
                            }
                        });
                        return await depAvailable;
                    };
                    dependentActive = runDependent();
                }

                if (required && dependentActive) {
                    Core.runModule(params);
                }

                return true;
            },

            topScrollOffset: function () {
                var topOffsetScroll = 0;
                var pageMenuOffset =
                    vars.elPageMenu?.querySelector("#page-menu-wrap")
                        ?.offsetHeight || 0;

                if (vars.elBody.classList.contains("is-expanded-menu")) {
                    if (vars.elHeader?.classList.contains("sticky-header")) {
                        topOffsetScroll = vars.elHeaderWrap.offsetHeight;
                    }

                    if (vars.elPageMenu?.classList.contains("dots-menu")) {
                        pageMenuOffset = 0;
                    }
                }

                topOffsetScroll = topOffsetScroll + pageMenuOffset;

                Core.getVars.topScrollOffset =
                    topOffsetScroll + options.scrollOffset;
            },
        };
    })();

    var Base = (function () {
        return {
            init: function () {
                Mobile.any() && vars.elBody.classList.add("device-touch");
            },

            menuBreakpoint: function () {
                if (Core.getVars.menuBreakpoint <= Core.viewport().width) {
                    vars.elBody.classList.add("is-expanded-menu");
                } else {
                    vars.elBody.classList.remove("is-expanded-menu");
                }

                if (vars.elPageMenu) {
                    if (
                        typeof Core.getVars.pageMenuBreakpoint === "undefined"
                    ) {
                        Core.getVars.pageMenuBreakpoint =
                            Core.getVars.menuBreakpoint;
                    }

                    if (
                        Core.getVars.pageMenuBreakpoint <= Core.viewport().width
                    ) {
                        vars.elBody.classList.add("is-expanded-pagemenu");
                    } else {
                        vars.elBody.classList.remove("is-expanded-pagemenu");
                    }
                }
            },

            scrollPos: function () {
                //document.documentElement.style.setProperty('--cnvs-scroll-ratio', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
            },

            goToTop: function () {
                return Core.initModule({
                    selector: "#gotoTop",
                    plugin: "GoToTop",
                });
            },

            stickFooterOnSmall: function () {
                return Core.initModule({
                    selector: "#footer",
                    plugin: "StickFooterOnSmall",
                });
            },

            logo: function () {
                return Core.initModule({ selector: "#logo", plugin: "Logo" });
            },

            headers: function () {
                Core.getVars.headerClasses = vars.elHeader?.className || "";
                Core.getVars.headerWrapClasses =
                    vars.elHeaderWrap?.className || "";
                return Core.initModule({
                    selector: "#header",
                    plugin: "Headers",
                });
            },

            menus: function () {
                return Core.initModule({
                    selector: "#header",
                    plugin: "Menus",
                });
            },

            pageMenu: function () {
                return Core.initModule({
                    selector: "#page-menu",
                    plugin: "PageMenu",
                });
            },

            sliderDimensions: function () {
                return Core.initModule({
                    selector: ".slider-element",
                    plugin: "SliderDimensions",
                });
            },

            sliderMenuClass: function () {
                return Core.initModule({
                    selector:
                        ".transparent-header + .swiper_wrapper,.swiper_wrapper + .transparent-header,.transparent-header + .revslider-wrap,.revslider-wrap + .transparent-header",
                    plugin: "SliderMenuClass",
                });
            },

            topSearch: function () {
                return Core.initModule({
                    selector: "#top-search-trigger",
                    plugin: "TopSearch",
                });
            },

            topCart: function () {
                return Core.initModule({
                    selector: "#top-cart",
                    plugin: "TopCart",
                });
            },

            sidePanel: function () {
                return Core.initModule({
                    selector: "#side-panel",
                    plugin: "SidePanel",
                });
            },

            adaptiveColorScheme: function () {
                return Core.initModule({
                    selector: ".adaptive-color-scheme",
                    plugin: "AdaptiveColorScheme",
                });
            },

            portfolioAjax: function () {
                return Core.initModule({
                    selector: ".portfolio-ajax",
                    plugin: "PortfolioAjax",
                });
            },

            cursor: function () {
                if (vars.customCursor) {
                    return Core.initModule({
                        selector: "body",
                        plugin: "Cursor",
                    });
                }
            },

            setBSTheme: function () {
                if (vars.elBody.classList.contains("dark")) {
                    document
                        .querySelector("html")
                        .setAttribute("data-bs-theme", "dark");
                } else {
                    document
                        .querySelector("html")
                        .removeAttribute("data-bs-theme");
                    document.querySelectorAll(".dark")?.forEach(function (el) {
                        el.setAttribute("data-bs-theme", "dark");
                    });
                }

                vars.elBody
                    .querySelectorAll(".not-dark")
                    ?.forEach(function (el) {
                        el.setAttribute("data-bs-theme", "light");
                    });
            },
        };
    })();

    var Modules = (function () {
        return {
            easing: function () {
                return Core.initModule({
                    selector: "[data-easing]",
                    plugin: "Easing",
                    required: [vars.required.jQuery],
                });
            },

            bootstrap: function () {
                var notExec = true;
                document.querySelectorAll("*").forEach(function (el) {
                    if (notExec) {
                        el.getAttributeNames().some(function (text) {
                            if (text.includes("data-bs")) {
                                notExec = false;
                                return Core.initModule({
                                    selector: "body",
                                    plugin: "Bootstrap",
                                });
                            }
                        });
                    }
                });
            },

            resizeVideos: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
                    plugin: "ResizeVideos",
                    required: [vars.required.jQuery],
                });
            },

            pageTransition: function () {
                if (vars.pageTransition) {
                    return Core.initModule({
                        selector: "body",
                        plugin: "PageTransition",
                    });
                }
            },

            lazyLoad: function (element) {
                return Core.initModule({
                    selector: element ? element : ".lazy:not(.lazy-loaded)",
                    plugin: "LazyLoad",
                });
            },

            dataClasses: function () {
                return Core.initModule({
                    selector: "[data-class]",
                    plugin: "DataClasses",
                });
            },

            dataHeights: function () {
                return Core.initModule({
                    selector:
                        "[data-height-xxl],[data-height-xl],[data-height-lg],[data-height-md],[data-height-sm],[data-height-xs]",
                    plugin: "DataHeights",
                });
            },

            lightbox: function (element) {
                return Core.initModule({
                    selector: element ? element : "[data-lightbox]",
                    plugin: "Lightbox",
                    required: [vars.required.jQuery],
                });
            },

            modal: function (element) {
                return Core.initModule({
                    selector: element ? element : ".modal-on-load",
                    plugin: "Modal",
                    required: [vars.required.jQuery],
                });
            },

            parallax: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : ".parallax .parallax-bg,.parallax .parallax-element",
                    plugin: "Parallax",
                });
            },

            animations: function (element) {
                return Core.initModule({
                    selector: element ? element : "[data-animate]",
                    plugin: "Animations",
                });
            },

            hoverAnimations: function (element) {
                return Core.initModule({
                    selector: element ? element : "[data-hover-animate]",
                    plugin: "HoverAnimations",
                });
            },

            gridInit: function (element) {
                return Core.initModule({
                    selector: element ? element : ".grid-container",
                    plugin: "Grid",
                    required: [vars.required.jQuery],
                });
            },

            filterInit: function (element) {
                return Core.initModule({
                    selector: element ? element : ".grid-filter,.custom-filter",
                    plugin: "Filter",
                    required: [vars.required.jQuery],
                });
            },

            canvasSlider: function (element) {
                return Core.initModule({
                    selector: element ? element : ".swiper_wrapper",
                    plugin: "CanvasSlider",
                });
            },

            sliderParallax: function () {
                return Core.initModule({
                    selector: ".slider-parallax",
                    plugin: "SliderParallax",
                });
            },

            flexSlider: function (element) {
                return Core.initModule({
                    selector: element ? element : ".fslider",
                    plugin: "FlexSlider",
                    required: [vars.required.jQuery],
                });
            },

            html5Video: function (element) {
                return Core.initModule({
                    selector: element ? element : ".video-wrap",
                    plugin: "FullVideo",
                });
            },

            youtubeBgVideo: function (element) {
                return Core.initModule({
                    selector: element ? element : ".yt-bg-player",
                    plugin: "YoutubeBG",
                    required: [vars.required.jQuery],
                });
            },

            toggle: function (element) {
                return Core.initModule({
                    selector: element ? element : ".toggle",
                    plugin: "Toggle",
                    required: [vars.required.jQuery],
                });
            },

            accordion: function (element) {
                return Core.initModule({
                    selector: element ? element : ".accordion",
                    plugin: "Accordion",
                    required: [vars.required.jQuery],
                });
            },

            counter: function (element) {
                return Core.initModule({
                    selector: element ? element : ".counter",
                    plugin: "Counter",
                    required: [vars.required.jQuery],
                });
            },

            countdown: function (element) {
                return Core.initModule({
                    selector: element ? element : ".countdown",
                    plugin: "Countdown",
                    required: [vars.required.jQuery],
                });
            },

            gmap: function (element) {
                return Core.initModule({
                    selector: element ? element : ".gmap",
                    plugin: "GoogleMaps",
                    required: [vars.required.jQuery],
                });
            },

            roundedSkills: function (element) {
                return Core.initModule({
                    selector: element ? element : ".rounded-skill",
                    plugin: "RoundedSkills",
                    required: [vars.required.jQuery],
                });
            },

            progress: function (element) {
                return Core.initModule({
                    selector: element ? element : ".skill-progress",
                    plugin: "Progress",
                });
            },

            twitterFeed: function (element) {
                return Core.initModule({
                    selector: element ? element : ".twitter-feed",
                    plugin: "Twitter",
                    required: [vars.required.jQuery],
                });
            },

            flickrFeed: function (element) {
                return Core.initModule({
                    selector: element ? element : ".flickr-feed",
                    plugin: "Flickr",
                    required: [vars.required.jQuery],
                });
            },

            instagram: function (element) {
                return Core.initModule({
                    selector: element ? element : ".instagram-photos",
                    plugin: "Instagram",
                });
            },

            // Dribbble Pending

            navTree: function (element) {
                return Core.initModule({
                    selector: element ? element : ".nav-tree",
                    plugin: "NavTree",
                    required: [vars.required.jQuery],
                });
            },

            carousel: function (element) {
                return Core.initModule({
                    selector: element ? element : ".carousel-widget",
                    plugin: "Carousel",
                    required: [vars.required.jQuery],
                });
            },

            masonryThumbs: function (element) {
                return Core.initModule({
                    selector: element ? element : ".masonry-thumbs",
                    plugin: "MasonryThumbs",
                    required: [vars.required.jQuery],
                });
            },

            notifications: function (element) {
                return Core.initModule({
                    selector: element ? element : false,
                    plugin: "Notifications",
                    required: [vars.required.jQuery],
                });
            },

            textRotator: function (element) {
                return Core.initModule({
                    selector: element ? element : ".text-rotater",
                    plugin: "TextRotator",
                    required: [vars.required.jQuery],
                });
            },

            onePage: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : "[data-scrollto],.one-page-menu",
                    plugin: "OnePage",
                });
            },

            ajaxForm: function (element) {
                return Core.initModule({
                    selector: element ? element : ".form-widget",
                    plugin: "AjaxForm",
                    required: [vars.required.jQuery],
                });
            },

            subscribe: function (element) {
                return Core.initModule({
                    selector: element ? element : ".subscribe-widget",
                    plugin: "Subscribe",
                    required: [vars.required.jQuery],
                });
            },

            conditional: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : ".form-group[data-condition],.form-group[data-conditions]",
                    plugin: "Conditional",
                });
            },

            shapeDivider: function (element) {
                return Core.initModule({
                    selector: element ? element : ".shape-divider",
                    plugin: "ShapeDivider",
                });
            },

            stickySidebar: function (element) {
                return Core.initModule({
                    selector: element ? element : ".sticky-sidebar-wrap",
                    plugin: "StickySidebar",
                    required: [vars.required.jQuery],
                });
            },

            cookies: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : ".gdpr-settings,[data-cookies]",
                    plugin: "Cookies",
                });
            },

            quantity: function (element) {
                return Core.initModule({
                    selector: element ? element : ".quantity",
                    plugin: "Quantity",
                });
            },

            readmore: function (element) {
                return Core.initModule({
                    selector: element ? element : "[data-readmore]",
                    plugin: "ReadMore",
                });
            },

            pricingSwitcher: function (element) {
                return Core.initModule({
                    selector: element ? element : ".pts-switcher",
                    plugin: "PricingSwitcher",
                });
            },

            ajaxButton: function (element) {
                return Core.initModule({
                    selector: element ? element : "[data-ajax-loader]",
                    plugin: "AjaxButton",
                });
            },

            videoFacade: function (element) {
                return Core.initModule({
                    selector: element ? element : ".video-facade",
                    plugin: "VideoFacade",
                });
            },

            schemeToggle: function (element) {
                return Core.initModule({
                    selector: element ? element : ".body-scheme-toggle",
                    plugin: "SchemeToggle",
                });
            },

            clipboardCopy: function (element) {
                return Core.initModule({
                    selector: element ? element : ".clipboard-copy",
                    plugin: "Clipboard",
                });
            },

            codeHighlight: function (element) {
                return Core.initModule({
                    selector: element ? element : ".code-highlight",
                    plugin: "CodeHighlight",
                });
            },

            viewportDetect: function (element) {
                return Core.initModule({
                    selector: element ? element : ".viewport-detect",
                    plugin: "ViewportDetect",
                });
            },

            bsComponents: function (element) {
                return Core.initModule({
                    selector: element
                        ? element
                        : '[data-bs-toggle="tooltip"],[data-bs-toggle="popover"],[data-bs-toggle="tab"],[data-bs-toggle="pill"],.style-msg',
                    plugin: "BSComponents",
                });
            },
        };
    })();

    var Mobile = (function () {
        return {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (
                    Mobile.Android() ||
                    Mobile.BlackBerry() ||
                    Mobile.iOS() ||
                    Mobile.Opera() ||
                    Mobile.Windows()
                );
            },
        };
    })();

    // Add your Custom JS Codes here
    var Custom = (function () {
        return {
            onReady: function () {
                // Add JS Codes here to Run on Document Ready
            },

            onLoad: function () {
                // Add JS Codes here to Run on Window Load
            },

            onResize: function () {
                // Add JS Codes here to Run on Window Resize
            },
        };
    })();

    var DocumentOnResize = (function () {
        return {
            init: function () {
                Core.viewport();
                Core.breakpoints();
                Base.menuBreakpoint();

                Core.run(vars.resizers);

                Custom.onResize();

                Core.addEvent(window, "cnvsResize");
            },
        };
    })();

    var DocumentOnReady = (function () {
        return {
            init: function () {
                Core.breakpoints();
                Core.colorScheme();
                Core.runBase();
                Core.runModules();
                Core.topScrollOffset();

                DocumentOnReady.windowscroll();

                Custom.onReady();
            },

            windowscroll: function () {
                Core.scrollEnd(function () {
                    Base.pageMenu();
                });
            },
        };
    })();

    var DocumentOnLoad = (function () {
        return {
            init: function () {
                Custom.onLoad();
            },
        };
    })();

    document.addEventListener("DOMContentLoaded", function () {
        DocumentOnReady.init();
    });

    window.onload = function () {
        DocumentOnLoad.init();
    };

    var resizeFunctions = Core.debouncedResize(function () {
        DocumentOnResize.init();
    }, 250);

    window.addEventListener("resize", function () {
        resizeFunctions();
    });

    var canvas_umd = {
        Core,
        Base,
        Modules,
        Mobile,
        Custom,
    };

    return canvas_umd;
});

(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
        ? define(factory)
        : ((global =
              typeof globalThis !== "undefined" ? globalThis : global || self),
          (global.CNVS = factory()));
})(this, function () {
    // USE STRICT
    "use strict";

    /**
     * --------------------------------------------------------------------------
     * DO NOT DELETE!! Start (Required)
     * --------------------------------------------------------------------------
     */
    if (
        SEMICOLON === "undefined" ||
        SEMICOLON.Core === "undefined" ||
        SEMICOLON.Base === "undefined" ||
        SEMICOLON.Modules === "undefined" ||
        SEMICOLON.Mobile === "undefined"
    ) {
        return false;
    }

    return {};
});
