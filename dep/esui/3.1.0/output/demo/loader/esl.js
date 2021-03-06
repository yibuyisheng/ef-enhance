var define;
var require;
(function (c) {
    var d = Q('');
    function M() {
        var af;
        var ae;
        var ac;
        for (var ad = 0, aa = arguments.length; ad < aa; ad++) {
            var Z = arguments[ad];
            switch (typeof Z) {
            case 'string':
                af = Z;
                break;
            case 'function':
                ac = Z;
                break;
            case 'object':
                if (!ae && x(Z)) {
                    ae = Z;
                } else {
                    ac = Z;
                }
                break;
            }
        }
        var ab = window.opera;
        if (!af && document.attachEvent && !(ab && ab.toString() === '[object Opera]')) {
            af = r().getAttribute('data-require-id');
        }
        H.push({
            id: af,
            deps: ae || [],
            factory: ac
        });
    }
    M.amd = {};
    var p = {};
    var S = 0;
    var s = 1;
    function I(Z, ae, ah, ag, ab) {
        var aa = {
                id: Z,
                factoryArgs: ah,
                hardDeps: ag,
                deps: ab || [],
                factory: ae,
                exports: {},
                state: S
            };
        p[Z] = aa;
        var ad = {
                require: Q(Z),
                exports: aa.exports,
                module: aa
            };
        k(ac);
        ac();
        function af() {
            var ai = 1;
            T(ag, function (aj) {
                ai = aj in v || h(aj);
                return ai;
            });
            return ai;
        }
        function ac() {
            if (h(Z) || !af()) {
                return;
            }
            var aj = [];
            T(ah, function (am, al) {
                aj[al] = ad[am] || t(am);
            });
            try {
                var ai = typeof ae == 'function' ? ae.apply(c, aj) : ae;
                if (typeof ai != 'undefined') {
                    aa.exports = ai;
                }
            } catch (ak) {
                if (ak.message.indexOf('[MODULE_MISS]') === 0) {
                    return;
                }
                throw ak;
            }
            aa.state = s;
            w(ac);
            X(Z);
        }
    }
    var q = [];
    var m = [];
    var A = 0;
    function X(Z) {
        A++;
        T(q, function (aa) {
            aa && aa(Z);
        });
        A--;
        G();
    }
    function G() {
        if (A < 1) {
            m.sort(function (aa, Z) {
                return Z - aa;
            });
            T(m, function (Z) {
                q.splice(Z, 1);
            });
            m = [];
        }
    }
    function w(Z) {
        T(q, function (ab, aa) {
            if (Z == ab) {
                m.push(aa);
            }
        });
    }
    function k(Z) {
        q.push(Z);
    }
    function Y(Z) {
        return Z in p;
    }
    function h(Z) {
        return Y(Z) && p[Z].state == s;
    }
    function t(Z) {
        if (Y(Z)) {
            return p[Z].exports;
        }
        return null;
    }
    function n(Z) {
        return p[Z];
    }
    function N(aa, Z) {
        p[aa] = {
            exports: Z || true,
            state: s
        };
        X(aa);
    }
    var H = [];
    var v = {
            require: d,
            exports: 1,
            module: 1
        };
    function E(aa) {
        var Z = [];
        var ad = [];
        var ac = H.slice(0);
        H.length = 0;
        H = [];
        T(ac, function (af, al) {
            var ak = af.id || aa;
            var aj = af.deps;
            var ae = af.factory;
            if (Y(ak)) {
                return;
            }
            if (aj.length === 0) {
                aj.push('require', 'exports', 'module');
            }
            var ai = [];
            af.realDeps = ai;
            ai.push.apply(ai, aj);
            var ag = /require\(\s*(['"'])([^'"]+)\1\s*\)/g;
            var ah = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm;
            if (typeof ae == 'function') {
                ae.toString().replace(ah, '').replace(ag, function (an, am, ao) {
                    ai.push(ao);
                });
            }
            T(ai, function (an) {
                var am = P(an);
                if (am.resource) {
                    ad.push(U(am.module, ak));
                }
            });
        });
        b(ad, ab);
        function ab() {
            T(ac, function (al, ak) {
                var af = al.id || aa;
                var ag = al.deps;
                var ae = al.realDeps;
                var an = [];
                var aj = ag.length;
                while (aj--) {
                    var am = U(ag[aj], af);
                    ag[aj] = am;
                    if (!o(af, am)) {
                        an.unshift(am);
                    }
                }
                var aj = ae.length;
                var ai = {};
                var ah = [];
                while (aj--) {
                    var am = U(ae[aj], af);
                    if (!am || am in ai || am in v) {
                        ae.splice(aj, 1);
                    } else {
                        ai[am] = 1;
                        ae[aj] = am;
                    }
                }
                Z.push.apply(Z, ae);
                I(af, al.factory, ag, an, ae);
            });
            b(Z);
        }
    }
    function o(ab, ac) {
        var aa = n(ac);
        var ad = aa && aa.hardDeps;
        if (ad) {
            var Z = ad.length;
            while (Z--) {
                var ae = ad[Z];
                if (ab == ae || o(ab, ae)) {
                    return 1;
                }
            }
        }
        return 0;
    }
    function b(ab, ad, Z) {
        ad = ad || new Function();
        Z = Z || '';
        if (typeof ab == 'string') {
            if (!h(ab)) {
                throw new Error('[MODULE_MISS]' + ab + ' is not exists!');
            }
            return t(ab);
        }
        if (!x(ab)) {
            return;
        }
        if (ab.length === 0) {
            ad();
            return;
        }
        var ac = 0;
        k(aa);
        T(ab, function (ae) {
            if (ae in v) {
                return;
            }
            (ae.indexOf('!') > 0 ? y : e)(ae, Z);
        });
        aa();
        function aa() {
            if (ac) {
                return;
            }
            var ah = 1;
            var ag = {};
            function ae(ai) {
                var aj = 1;
                T(ai, function (ak) {
                    if (ag[ak]) {
                        return;
                    }
                    ag[ak] = 1;
                    if (v[ak]) {
                        return;
                    }
                    if (!h(ak) || !ae(n(ak).deps)) {
                        aj = 0;
                        return false;
                    }
                });
                return aj;
            }
            if (ae(ab)) {
                ac = 1;
                w(aa);
                var af = [];
                T(ab, function (ai) {
                    af.push(v[ai] || t(ai));
                });
                ad.apply(c, af);
            }
        }
    }
    var J = {};
    function e(aa) {
        if (Y(aa) || J[aa]) {
            return;
        }
        J[aa] = 1;
        var Z = document.createElement('script');
        Z.setAttribute('data-require-id', aa);
        Z.src = B(aa) + '.js';
        Z.async = true;
        if (Z.readyState) {
            Z.onreadystatechange = ab;
        } else {
            Z.onload = ab;
        }
        W(Z);
        function ab() {
            var ac = Z.readyState;
            if (typeof ac == 'undefined' || /^(loaded|complete)$/.test(ac)) {
                Z.onload = Z.onreadystatechange = null;
                E(aa);
                delete J[aa];
                Z = null;
            }
        }
    }
    function y(Z, ab) {
        var ad = P(Z);
        var aa = ad.module;
        var ae = ad.resource;
        function ac(af) {
            if (!h(Z)) {
                af.load(ae, Q(ab), function (ag) {
                    N(Z, ag);
                }, {});
            }
        }
        if (!h(aa)) {
            b([aa], ac);
        } else {
            ac(t(aa));
        }
    }
    var l = {
            baseUrl: './',
            paths: {},
            config: {},
            map: {},
            packages: []
        };
    d.config = function (Z) {
        for (var aa in Z) {
            if (Z.hasOwnProperty(aa)) {
                l[aa] = Z[aa];
            }
        }
        V();
    };
    V();
    function V() {
        l.baseUrl = l.baseUrl.replace(/\/$/, '') + '/';
        g();
        a();
        D();
    }
    var z;
    function D() {
        z = [];
        T(l.packages, function (Z, ab) {
            var aa = Z;
            if (typeof Z == 'string') {
                aa = {
                    name: Z.split('/')[0],
                    location: Z,
                    main: 'main'
                };
            }
            aa.location = aa.location || aa.name;
            aa.main = (aa.main || 'main').replace(/\.js$/i, '');
            z.push(aa);
        });
        z.sort(j('name'));
    }
    var C;
    function g() {
        C = O(l.paths);
        C.sort(j());
    }
    var F;
    function a() {
        F = [];
        F = O(l.map);
        F.sort(j());
        T(F, function (aa) {
            var Z = aa.k;
            aa.v = O(aa.v);
            aa.v.sort(j());
            aa.reg = Z == '*' ? /^/ : R(Z);
        });
    }
    function B(ab) {
        if (!i.test(ab)) {
            return ab;
        }
        var Z = ab;
        var aa = 0;
        T(C, function (ad) {
            var ac = ad.k;
            if (R(ac).test(Z)) {
                Z = Z.replace(ac, ad.v);
                aa = 1;
                return false;
            }
        });
        if (!aa) {
            T(z, function (ac) {
                var ad = ac.name;
                if (R(ad).test(ab)) {
                    Z = Z.replace(ad, ac.location);
                    return false;
                }
            });
        }
        if (!/^([a-z]{2,10}:\/)?\//i.test(Z)) {
            Z = l.baseUrl + Z;
        }
        return Z;
    }
    function Q(Z) {
        function aa(ab, ad) {
            if (typeof ab == 'string') {
                ab = U(ab, Z);
                return b(ab, ad, Z);
            } else {
                if (x(ab)) {
                    var ac = [];
                    T(ab, function (ag) {
                        var af = P(ag);
                        var ae = U(af.module, Z);
                        if (af.resource && !h(ae)) {
                            ac.push(ae);
                        }
                    });
                    b(ac, function () {
                        var ae = [];
                        T(ab, function (af) {
                            ae.push(U(af, Z));
                        });
                        b(ae, ad, Z);
                    }, Z);
                }
            }
        }
        aa.toUrl = function (ab) {
            return B(U(ab, Z));
        };
        return aa;
    }
    function U(ae, Z) {
        if (!ae) {
            return '';
        }
        var ac = P(ae);
        if (!ac) {
            return ae;
        }
        var ad = ac.resource;
        var ab = f(ac.module, Z);
        T(z, function (ag) {
            var ah = ag.name;
            var af = ah + '/' + ag.main;
            if (ah == ab) {
                ab = ab.replace(ah, af);
                return false;
            }
        });
        ab = L(ab, Z);
        if (ad) {
            var aa = t(ab);
            ad = aa.normalize ? aa.normalize(ad, function (af) {
                return U(af, Z);
            }) : U(ad, Z);
            return ab + '!' + ad;
        }
        return ab;
    }
    function f(aa, ah) {
        if (/^\.{1,2}/.test(aa)) {
            var ai = ah.split('/');
            var ag = aa.split('/');
            var Z = ai.length - 1;
            var ab = ag.length;
            var ae = 0;
            var ac = 0;
            pathLoop:
                for (var af = 0; af < ab; af++) {
                    var ad = ag[af];
                    switch (ad) {
                    case '..':
                        if (ae < Z - 1) {
                            ae++;
                            ac++;
                        } else {
                            break pathLoop;
                        }
                        break;
                    case '.':
                        ac++;
                        break;
                    default:
                        break pathLoop;
                    }
                }
            ai.length = Z - ae;
            ag = ag.slice(ac);
            ai.push.apply(ai, ag);
            return ai.join('/');
        }
        return aa;
    }
    var i = /^([-_a-z0-9\.]+(\/[-_a-z0-9\.]+)*)(!.*)?$/i;
    function P(aa) {
        if (i.test(aa)) {
            var Z = RegExp.$3;
            return {
                module: RegExp.$1,
                resource: Z ? Z.slice(1) : ''
            };
        }
        return null;
    }
    function L(aa, Z) {
        T(F, function (ab) {
            if (ab.reg.test(Z)) {
                T(ab.v, function (ae) {
                    var ac = ae.k;
                    var ad = R(ac);
                    if (ad.test(aa)) {
                        aa = aa.replace(ac, ae.v);
                        return false;
                    }
                });
                return false;
            }
        });
        return aa;
    }
    function O(ab) {
        var aa = [];
        for (var Z in ab) {
            if (ab.hasOwnProperty(Z)) {
                aa.push({
                    k: Z,
                    v: ab[Z]
                });
            }
        }
        return aa;
    }
    var K;
    var u;
    function r() {
        if (K) {
            return K;
        } else {
            if (u && u.readyState == 'interactive') {
                return u;
            } else {
                var Z = document.getElementsByTagName('script');
                var ab = Z.length;
                while (ab--) {
                    var aa = Z[ab];
                    if (aa.readyState == 'interactive') {
                        u = aa;
                        return aa;
                    }
                }
            }
        }
    }
    function W(Z) {
        K = Z;
        var aa = document;
        (aa.getElementsByTagName('head')[0] || aa.body).appendChild(Z);
        K = null;
    }
    function R(Z) {
        return new RegExp('^' + Z + '(/|$)');
    }
    function x(Z) {
        return Z instanceof Array;
    }
    function T(ac, ab) {
        if (x(ac)) {
            for (var aa = 0, Z = ac.length; aa < Z; aa++) {
                if (ab(ac[aa], aa) === false) {
                    break;
                }
            }
        }
    }
    function j(Z) {
        Z = Z || 'k';
        return function (ab, aa) {
            var ad = ab[Z];
            var ac = aa[Z];
            if (ac == '*') {
                return -1;
            }
            if (ad == '*') {
                return 1;
            }
            return ac.length - ad.length;
        };
    }
    c.define = M;
    c.require = d;
}(this));
define('css', [], {
    load: function (f, d, e, a) {
        var c = document.createElement('link');
        c.setAttribute('rel', 'stylesheet');
        c.setAttribute('type', 'text/css');
        c.setAttribute('href', d.toUrl(f));
        var b = document.getElementsByTagName('head')[0] || document.body;
        b.appendChild(c);
        b = null;
        c = null;
        e(true);
    }
});
define('js', [], {
    load: function (g, d, e, b) {
        var a = document.createElement('script');
        a.src = d.toUrl(g);
        a.async = true;
        if (a.readyState) {
            a.onreadystatechange = f;
        } else {
            a.onload = f;
        }
        var c = document.getElementsByTagName('head')[0] || document.body;
        c.appendChild(a) && (c = null);
        function f() {
            var h = a.readyState;
            if (typeof h == 'undefined' || /^(loaded|complete)$/.test(h)) {
                a.onload = a.onreadystatechange = null;
                a = null;
                e(true);
            }
        }
    }
});