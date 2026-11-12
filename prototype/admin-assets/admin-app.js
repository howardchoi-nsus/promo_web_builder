//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), c = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, l = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, u = (n, r, a) => (a = n == null ? {} : e(i(n)), l(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n));
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.39/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function d(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
function f(e, t) {
	return e + JSON.stringify(t, (e, t) => typeof t == "function" ? t.toString() : t);
}
function p(e) {
	if (M(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = F(r) ? m(r) : p(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (F(e) || I(e)) return e;
}
function m(e) {
	let t = {};
	return e.replace(Pe, "").split(Me).forEach((e) => {
		if (e) {
			let n = e.split(Ne);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function h(e) {
	if (!e) return "";
	if (F(e)) return e;
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (F(r) || typeof r == "number") {
			let e = n.startsWith("--") ? n : xe(n);
			t += `${e}:${r};`;
		}
	}
	return t;
}
function g(e) {
	let t = "";
	if (F(e)) t = e;
	else if (M(e)) for (let n = 0; n < e.length; n++) {
		let r = g(e[n]);
		r && (t += r + " ");
	}
	else if (I(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function _(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !F(t) && (e.class = g(t)), n && (e.style = p(n)), e;
}
function v(e) {
	return !!e || e === "";
}
function y(e) {
	if (qe.hasOwnProperty(e)) return qe[e];
	let t = Ke.test(e);
	return t && console.error(`unsafe attribute name: ${e}`), qe[e] = !t;
}
function b(e) {
	if (e == null) return !1;
	let t = typeof e;
	return t === "string" || t === "number" || t === "boolean";
}
function x(e) {
	let t = "" + e, n = Ye.exec(t);
	if (!n) return t;
	let r = "", i, a, o = 0;
	for (a = n.index; a < t.length; a++) {
		switch (t.charCodeAt(a)) {
			case 34:
				i = "&quot;";
				break;
			case 38:
				i = "&amp;";
				break;
			case 39:
				i = "&#39;";
				break;
			case 60:
				i = "&lt;";
				break;
			case 62:
				i = "&gt;";
				break;
			default: continue;
		}
		o !== a && (r += t.slice(o, a)), o = a + 1, r += i;
	}
	return o === a ? r : r + t.slice(o, a);
}
function S(e) {
	return e.replace(Xe, "");
}
function ee(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = C(e[r], t[r]);
	return n;
}
function C(e, t) {
	if (e === t) return !0;
	let n = oe(e), r = oe(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = ce(e), r = ce(t), n || r) return e === t;
	if (n = M(e), r = M(t), n || r) return n && r ? ee(e, t) : !1;
	if (n = I(e), r = I(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !C(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function w(e, t) {
	return e.findIndex((e) => C(e, t));
}
function T(e) {
	return e == null ? "initial" : typeof e == "string" ? e === "" ? " " : e : String(e);
}
var E, D, O, k, te, ne, A, re, ie, j, M, ae, N, oe, se, P, F, ce, I, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne, Pe, Fe, Ie, Le, Re, ze, Be, Ve, He, Ue, We, Ge, Ke, qe, Je, Ye, Xe, Ze, L, Qe, $e, et = o((() => {
	E = {}, D = [], O = () => {}, k = () => !1, te = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ne = (e) => e.startsWith("onUpdate:"), A = Object.assign, re = (e, t) => {
		let n = e.indexOf(t);
		n > -1 && e.splice(n, 1);
	}, ie = Object.prototype.hasOwnProperty, j = (e, t) => ie.call(e, t), M = Array.isArray, ae = (e) => de(e) === "[object Map]", N = (e) => de(e) === "[object Set]", oe = (e) => de(e) === "[object Date]", se = (e) => de(e) === "[object RegExp]", P = (e) => typeof e == "function", F = (e) => typeof e == "string", ce = (e) => typeof e == "symbol", I = (e) => typeof e == "object" && !!e, le = (e) => (I(e) || P(e)) && P(e.then) && P(e.catch), ue = Object.prototype.toString, de = (e) => ue.call(e), fe = (e) => de(e).slice(8, -1), pe = (e) => de(e) === "[object Object]", me = (e) => F(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, he = /* @__PURE__ */ d(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ge = /* @__PURE__ */ d("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), _e = (e) => {
		let t = /* @__PURE__ */ Object.create(null);
		return ((n) => t[n] || (t[n] = e(n)));
	}, ve = /-\w/g, ye = _e((e) => e.replace(ve, (e) => e.slice(1).toUpperCase())), be = /\B([A-Z])/g, xe = _e((e) => e.replace(be, "-$1").toLowerCase()), Se = _e((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ce = _e((e) => e ? `on${Se(e)}` : ""), we = (e, t) => !Object.is(e, t), Te = (e, ...t) => {
		for (let n = 0; n < e.length; n++) e[n](...t);
	}, Ee = (e, t, n, r = !1) => {
		Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !1,
			writable: r,
			value: n
		});
	}, De = (e) => {
		let t = parseFloat(e);
		return isNaN(t) ? e : t;
	}, Oe = (e) => {
		let t = F(e) ? Number(e) : NaN;
		return isNaN(t) ? e : t;
	}, Ae = () => ke ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}, je = /* @__PURE__ */ d("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol"), Me = /;(?![^(]*\))/g, Ne = /:([^]+)/, Pe = /\/\*[^]*?\*\//g, Fe = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", Ie = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Le = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", Re = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", ze = /* @__PURE__ */ d(Fe), Be = /* @__PURE__ */ d(Ie), Ve = /* @__PURE__ */ d(Le), He = /* @__PURE__ */ d(Re), Ue = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", We = /* @__PURE__ */ d(Ue), Ge = /* @__PURE__ */ d(Ue + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"), Ke = /[>/="'\u0009\u000a\u000c\u0020]/, qe = {}, Je = {
		acceptCharset: "accept-charset",
		className: "class",
		htmlFor: "for",
		httpEquiv: "http-equiv"
	}, Ye = /["'&<>]/, Xe = /^-?>|<!--|-->|--!>|<!-$/g, Ze = (e) => !!(e && e.__v_isRef === !0), L = (e) => F(e) ? e : e == null ? "" : M(e) || I(e) && (e.toString === ue || !P(e.toString)) ? Ze(e) ? L(e.value) : JSON.stringify(e, Qe, 2) : String(e), Qe = (e, t) => Ze(t) ? Qe(e, t.value) : ae(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[$e(t, r) + " =>"] = n, e), {}) } : N(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => $e(e)) } : ce(t) ? $e(t) : I(t) && !M(t) && !pe(t) ? String(t) : t, $e = (e, t = "") => ce(e) ? `Symbol(${e.description ?? t})` : e;
}));
//#endregion
//#region node_modules/.pnpm/@vue+reactivity@3.5.39/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
function tt(e) {
	return new dn(e);
}
function nt() {
	return un;
}
function rt(e, t = !1) {
	un && un.cleanups.push(e);
}
function it(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = _n, _n = e;
		return;
	}
	e.next = gn, gn = e;
}
function at() {
	hn++;
}
function ot() {
	if (--hn > 0) return;
	if (_n) {
		let e = _n;
		for (_n = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; gn;) {
		let t = gn;
		for (gn = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function st(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ct(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), dt(r), ft(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function lt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ut(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ut(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === bn) || (e.globalVersion = bn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !lt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = fn, r = vn;
	fn = e, vn = !0;
	try {
		st(e);
		let n = e.fn(e._value);
		(t.version === 0 || we(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		fn = n, vn = r, ct(e), e.flags &= -3;
	}
}
function dt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) dt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ft(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function pt(e, t) {
	e.effect instanceof mn && (e = e.effect.fn);
	let n = new mn(e);
	t && A(n, t);
	try {
		n.run();
	} catch (e) {
		throw n.stop(), e;
	}
	let r = n.run.bind(n);
	return r.effect = n, r;
}
function mt(e) {
	e.effect.stop();
}
function ht() {
	yn.push(vn), vn = !1;
}
function gt() {
	let e = yn.pop();
	vn = e === void 0 || e;
}
function _t(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = fn;
		fn = void 0;
		try {
			t();
		} finally {
			fn = e;
		}
	}
}
function vt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) vt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
function yt(e, t, n) {
	if (vn && fn) {
		let t = Cn.get(e);
		t || Cn.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Sn()), r.map = t, r.key = n), r.track();
	}
}
function bt(e, t, n, r, i, a) {
	let o = Cn.get(e);
	if (!o) {
		bn++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (at(), t === "clear") o.forEach(s);
	else {
		let i = M(e), a = i && me(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === En || !ce(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(En)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(wn)), ae(e) && s(o.get(Tn)));
				break;
			case "delete":
				i || (s(o.get(wn)), ae(e) && s(o.get(Tn)));
				break;
			case "set":
				ae(e) && s(o.get(wn));
				break;
		}
	}
	ot();
}
function xt(e, t) {
	let n = Cn.get(e);
	return n && n.get(t);
}
function St(e) {
	let t = /* @__PURE__ */ Gt(e);
	return t === e ? t : (yt(t, "iterate", En), /* @__PURE__ */ Ut(e) ? t : t.map(Jn));
}
function Ct(e) {
	return yt(e = /* @__PURE__ */ Gt(e), "iterate", En), e;
}
function wt(e, t) {
	return /* @__PURE__ */ Ht(e) ? Yn(/* @__PURE__ */ Vt(e) ? Jn(t) : t) : Jn(t);
}
function Tt(e, t, n) {
	let r = Ct(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Ut(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
function Et(e, t, n, r, i, a) {
	let o = Ct(e), s = o !== e && !/* @__PURE__ */ Ut(e), c = o[t];
	if (c !== On[t]) {
		let t = c.apply(e, a);
		return s ? Jn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, wt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Dt(e, t, n, r) {
	let i = Ct(e), a = i !== e && !/* @__PURE__ */ Ut(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = wt(e, t)), n.call(this, t, wt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? wt(e, c) : c;
}
function Ot(e, t, n) {
	let r = /* @__PURE__ */ Gt(e);
	yt(r, "iterate", En);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Wt(n[0]) ? (n[0] = /* @__PURE__ */ Gt(n[0]), r[t](...n)) : i;
}
function kt(e, t, n = []) {
	ht(), at();
	let r = (/* @__PURE__ */ Gt(e))[t].apply(e, n);
	return ot(), gt(), r;
}
function At(e) {
	ce(e) || (e = String(e));
	let t = /* @__PURE__ */ Gt(this);
	return yt(t, "has", e), t.hasOwnProperty(e);
}
function jt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Gt(i), o = ae(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Rn : t ? Yn : Jn;
		return !t && yt(a, "iterate", c ? Tn : wn), A(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Mt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Nt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Gt(r), a = /* @__PURE__ */ Gt(n);
			e || (we(n, a) && yt(i, "get", n), yt(i, "get", a));
			let { has: o } = zn(i), s = t ? Rn : e ? Yn : Jn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && yt(/* @__PURE__ */ Gt(t), "iterate", wn), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Gt(n), i = /* @__PURE__ */ Gt(t);
			return e || (we(t, i) && yt(r, "has", t), yt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Gt(a), s = t ? Rn : e ? Yn : Jn;
			return !e && yt(o, "iterate", wn), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return A(n, e ? {
		add: Mt("add"),
		set: Mt("set"),
		delete: Mt("delete"),
		clear: Mt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Gt(this), r = zn(n), i = /* @__PURE__ */ Gt(e), a = !t && !/* @__PURE__ */ Ut(e) && !/* @__PURE__ */ Ht(e) ? i : e;
			return r.has.call(n, a) || we(e, a) && r.has.call(n, e) || we(i, a) && r.has.call(n, i) || (n.add(a), bt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (n = /* @__PURE__ */ Gt(n));
			let r = /* @__PURE__ */ Gt(this), { has: i, get: a } = zn(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Gt(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? we(n, s) && bt(r, "set", e, n, s) : bt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Gt(this), { has: n, get: r } = zn(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Gt(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && bt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Gt(this), t = e.size !== 0, n = e.clear();
			return t && bt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = jt(r, e, t);
	}), n;
}
function Pt(e, t) {
	let n = Nt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(j(n, r) && r in t ? n : t, r, i);
}
function Ft(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return /* @__PURE__ */ Ht(e) ? e : Bt(e, !1, Pn, Bn, Wn);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Bt(e, !1, In, Vn, Gn);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return Bt(e, !0, Fn, Hn, Kn);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return Bt(e, !0, Ln, Un, qn);
}
function Bt(e, t, n, r, i) {
	if (!I(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ft(fe(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return /* @__PURE__ */ Ht(e) ? /* @__PURE__ */ Vt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Gt(t) : e;
}
function Kt(e) {
	return !j(e, "__v_skip") && Object.isExtensible(e) && Ee(e, "__v_skip", !0), e;
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return Yt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return Yt(e, !0);
}
function Yt(e, t) {
	return /* @__PURE__ */ qt(e) ? e : new Xn(e, t);
}
function Xt(e) {
	e.dep && e.dep.trigger();
}
function Zt(e) {
	return /* @__PURE__ */ qt(e) ? e.value : e;
}
function Qt(e) {
	return P(e) ? e() : Zt(e);
}
function $t(e) {
	return /* @__PURE__ */ Vt(e) ? e : new Proxy(e, Zn);
}
function en(e) {
	return new Qn(e);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	let t = M(e) ? Array(e.length) : {};
	for (let n in e) t[n] = rn(e, n);
	return t;
}
// @__NO_SIDE_EFFECTS__
function nn(e, t, n) {
	return /* @__PURE__ */ qt(e) ? e : P(e) ? new er(e) : I(e) && arguments.length > 1 ? rn(e, t, n) : /* @__PURE__ */ R(e);
}
function rn(e, t, n) {
	return new $n(e, t, n);
}
// @__NO_SIDE_EFFECTS__
function an(e, t, n = !1) {
	let r, i;
	return P(e) ? r = e : (r = e.get, i = e.set), new tr(r, i, n);
}
function on() {
	return or;
}
function sn(e, t = !1, n = or) {
	if (n) {
		let t = ar.get(n);
		t || ar.set(n, t = []), t.push(e);
	}
}
function cn(e, t, n = E) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ Ut(e) || i === !1 || i === 0 ? ln(e, 1) : ln(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ qt(e) ? (d = () => e.value, m = /* @__PURE__ */ Ut(e)) : /* @__PURE__ */ Vt(e) ? (d = () => l(e), m = !0) : M(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Ut(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ qt(e)) return e.value;
		if (/* @__PURE__ */ Vt(e)) return l(e);
		if (P(e)) return c ? c(e, 2) : e();
	})) : d = P(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			ht();
			try {
				f();
			} finally {
				gt();
			}
		}
		let t = or;
		or = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			or = t;
		}
	} : O, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => ln(e(), t);
	}
	let g = nt(), _ = () => {
		u.stop(), g && g.active && re(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return _(), n;
		};
	}
	let v = h ? Array(e.length).fill(ir) : ir, y = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || m || (h ? n.some((e, t) => we(e, v[t])) : we(n, v))) {
				f && f();
				let e = or;
				or = u;
				try {
					let e = [
						n,
						v === ir ? void 0 : h && v[0] === ir ? [] : v,
						p
					];
					v = n, c ? c(t, 3, e) : t(...e);
				} finally {
					or = e;
				}
			}
		} else u.run();
	};
	return s && s(y), u = new mn(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => sn(e, !1, u), f = u.onStop = () => {
		let e = ar.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			ar.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function ln(e, t = Infinity, n) {
	if (t <= 0 || !I(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ qt(e)) ln(e.value, t, n);
	else if (M(e)) for (let r = 0; r < e.length; r++) ln(e[r], t, n);
	else if (N(e) || ae(e)) e.forEach((e) => {
		ln(e, t, n);
	});
	else if (pe(e)) {
		for (let r in e) ln(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && ln(e[r], t, n);
	}
	return e;
}
var un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An, jn, Mn, Nn, Pn, Fn, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, Kn, qn, Jn, Yn, Xn, Zn, Qn, $n, er, tr, nr, rr, ir, ar, or, sr = o((() => {
	et(), dn = class {
		constructor(e = !1) {
			this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && un && (un.active ? (this.parent = un, this.index = (un.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
		}
		get active() {
			return this._active;
		}
		pause() {
			if (this._active) {
				this._isPaused = !0;
				let e, t;
				if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].pause();
				for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
			}
		}
		resume() {
			if (this._active && this._isPaused) {
				this._isPaused = !1;
				let e, t;
				if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].resume();
				for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].resume();
			}
		}
		run(e) {
			if (this._active) {
				let t = un;
				try {
					return un = this, e();
				} finally {
					un = t;
				}
			}
		}
		on() {
			++this._on === 1 && (this.prevScope = un, un = this);
		}
		off() {
			if (this._on > 0 && --this._on === 0) {
				if (un === this) un = this.prevScope;
				else {
					let e = un;
					for (; e;) {
						if (e.prevScope === this) {
							e.prevScope = this.prevScope;
							break;
						}
						e = e.prevScope;
					}
				}
				this.prevScope = void 0;
			}
		}
		stop(e) {
			if (this._active) {
				this._active = !1;
				let t, n;
				for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
				for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
				if (this.cleanups.length = 0, this.scopes) {
					for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].stop(!0);
					this.scopes.length = 0;
				}
				if (!this.detached && this.parent && !e) {
					let e = this.parent.scopes.pop();
					e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
				}
				this.parent = void 0;
			}
		}
	}, pn = /* @__PURE__ */ new WeakSet(), mn = class {
		constructor(e) {
			this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, un && (un.active ? un.effects.push(this) : this.flags &= -2);
		}
		pause() {
			this.flags |= 64;
		}
		resume() {
			this.flags & 64 && (this.flags &= -65, pn.has(this) && (pn.delete(this), this.trigger()));
		}
		notify() {
			this.flags & 2 && !(this.flags & 32) || this.flags & 8 || it(this);
		}
		run() {
			if (!(this.flags & 1)) return this.fn();
			this.flags |= 2, _t(this), st(this);
			let e = fn, t = vn;
			fn = this, vn = !0;
			try {
				return this.fn();
			} finally {
				ct(this), fn = e, vn = t, this.flags &= -3;
			}
		}
		stop() {
			if (this.flags & 1) {
				for (let e = this.deps; e; e = e.nextDep) dt(e);
				this.deps = this.depsTail = void 0, _t(this), this.onStop && this.onStop(), this.flags &= -2;
			}
		}
		trigger() {
			this.flags & 64 ? pn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
		}
		runIfDirty() {
			lt(this) && this.run();
		}
		get dirty() {
			return lt(this);
		}
	}, hn = 0, vn = !0, yn = [], bn = 0, xn = class {
		constructor(e, t) {
			this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
		}
	}, Sn = class {
		constructor(e) {
			this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
		}
		track(e) {
			if (!fn || !vn || fn === this.computed) return;
			let t = this.activeLink;
			if (t === void 0 || t.sub !== fn) t = this.activeLink = new xn(fn, this), fn.deps ? (t.prevDep = fn.depsTail, fn.depsTail.nextDep = t, fn.depsTail = t) : fn.deps = fn.depsTail = t, vt(t);
			else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
				let e = t.nextDep;
				e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = fn.depsTail, t.nextDep = void 0, fn.depsTail.nextDep = t, fn.depsTail = t, fn.deps === t && (fn.deps = e);
			}
			return t;
		}
		trigger(e) {
			this.version++, bn++, this.notify(e);
		}
		notify(e) {
			at();
			try {
				for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
			} finally {
				ot();
			}
		}
	}, Cn = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ Symbol(""), Tn = /* @__PURE__ */ Symbol(""), En = /* @__PURE__ */ Symbol(""), Dn = {
		__proto__: null,
		[Symbol.iterator]() {
			return Tt(this, Symbol.iterator, (e) => wt(this, e));
		},
		concat(...e) {
			return St(this).concat(...e.map((e) => M(e) ? St(e) : e));
		},
		entries() {
			return Tt(this, "entries", (e) => (e[1] = wt(this, e[1]), e));
		},
		every(e, t) {
			return Et(this, "every", e, t, void 0, arguments);
		},
		filter(e, t) {
			return Et(this, "filter", e, t, (e) => e.map((e) => wt(this, e)), arguments);
		},
		find(e, t) {
			return Et(this, "find", e, t, (e) => wt(this, e), arguments);
		},
		findIndex(e, t) {
			return Et(this, "findIndex", e, t, void 0, arguments);
		},
		findLast(e, t) {
			return Et(this, "findLast", e, t, (e) => wt(this, e), arguments);
		},
		findLastIndex(e, t) {
			return Et(this, "findLastIndex", e, t, void 0, arguments);
		},
		forEach(e, t) {
			return Et(this, "forEach", e, t, void 0, arguments);
		},
		includes(...e) {
			return Ot(this, "includes", e);
		},
		indexOf(...e) {
			return Ot(this, "indexOf", e);
		},
		join(e) {
			return St(this).join(e);
		},
		lastIndexOf(...e) {
			return Ot(this, "lastIndexOf", e);
		},
		map(e, t) {
			return Et(this, "map", e, t, void 0, arguments);
		},
		pop() {
			return kt(this, "pop");
		},
		push(...e) {
			return kt(this, "push", e);
		},
		reduce(e, ...t) {
			return Dt(this, "reduce", e, t);
		},
		reduceRight(e, ...t) {
			return Dt(this, "reduceRight", e, t);
		},
		shift() {
			return kt(this, "shift");
		},
		some(e, t) {
			return Et(this, "some", e, t, void 0, arguments);
		},
		splice(...e) {
			return kt(this, "splice", e);
		},
		toReversed() {
			return St(this).toReversed();
		},
		toSorted(e) {
			return St(this).toSorted(e);
		},
		toSpliced(...e) {
			return St(this).toSpliced(...e);
		},
		unshift(...e) {
			return kt(this, "unshift", e);
		},
		values() {
			return Tt(this, "values", (e) => wt(this, e));
		}
	}, On = Array.prototype, kn = /* @__PURE__ */ d("__proto__,__v_isRef,__isVue"), An = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ce)), jn = class {
		constructor(e = !1, t = !1) {
			this._isReadonly = e, this._isShallow = t;
		}
		get(e, t, n) {
			if (t === "__v_skip") return e.__v_skip;
			let r = this._isReadonly, i = this._isShallow;
			if (t === "__v_isReactive") return !r;
			if (t === "__v_isReadonly") return r;
			if (t === "__v_isShallow") return i;
			if (t === "__v_raw") return n === (r ? i ? qn : Kn : i ? Gn : Wn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
			let a = M(e);
			if (!r) {
				let e;
				if (a && (e = Dn[t])) return e;
				if (t === "hasOwnProperty") return At;
			}
			let o = Reflect.get(e, t, /* @__PURE__ */ qt(e) ? e : n);
			if ((ce(t) ? An.has(t) : kn(t)) || (r || yt(e, "get", t), i)) return o;
			if (/* @__PURE__ */ qt(o)) {
				let e = a && me(t) ? o : o.value;
				return r && I(e) ? /* @__PURE__ */ Rt(e) : e;
			}
			return I(o) ? r ? /* @__PURE__ */ Rt(o) : /* @__PURE__ */ It(o) : o;
		}
	}, Mn = class extends jn {
		constructor(e = !1) {
			super(!1, e);
		}
		set(e, t, n, r) {
			let i = e[t], a = M(e) && me(t);
			if (!this._isShallow) {
				let e = /* @__PURE__ */ Ht(i);
				if (!/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (i = /* @__PURE__ */ Gt(i), n = /* @__PURE__ */ Gt(n)), !a && /* @__PURE__ */ qt(i) && !/* @__PURE__ */ qt(n)) return e || (i.value = n), !0;
			}
			let o = a ? Number(t) < e.length : j(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ qt(e) ? e : r);
			return e === /* @__PURE__ */ Gt(r) && s && (o ? we(n, i) && bt(e, "set", t, n, i) : bt(e, "add", t, n)), s;
		}
		deleteProperty(e, t) {
			let n = j(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
			return i && n && bt(e, "delete", t, void 0, r), i;
		}
		has(e, t) {
			let n = Reflect.has(e, t);
			return (!ce(t) || !An.has(t)) && yt(e, "has", t), n;
		}
		ownKeys(e) {
			return yt(e, "iterate", M(e) ? "length" : wn), Reflect.ownKeys(e);
		}
	}, Nn = class extends jn {
		constructor(e = !1) {
			super(!0, e);
		}
		set(e, t) {
			return !0;
		}
		deleteProperty(e, t) {
			return !0;
		}
	}, Pn = /* @__PURE__ */ new Mn(), Fn = /* @__PURE__ */ new Nn(), In = /* @__PURE__ */ new Mn(!0), Ln = /* @__PURE__ */ new Nn(!0), Rn = (e) => e, zn = (e) => Reflect.getPrototypeOf(e), Bn = { get: /* @__PURE__ */ Pt(!1, !1) }, Vn = { get: /* @__PURE__ */ Pt(!1, !0) }, Hn = { get: /* @__PURE__ */ Pt(!0, !1) }, Un = { get: /* @__PURE__ */ Pt(!0, !0) }, Wn = /* @__PURE__ */ new WeakMap(), Gn = /* @__PURE__ */ new WeakMap(), Kn = /* @__PURE__ */ new WeakMap(), qn = /* @__PURE__ */ new WeakMap(), Jn = (e) => I(e) ? /* @__PURE__ */ It(e) : e, Yn = (e) => I(e) ? /* @__PURE__ */ Rt(e) : e, Xn = class {
		constructor(e, t) {
			this.dep = new Sn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Gt(e), this._value = t ? e : Jn(e), this.__v_isShallow = t;
		}
		get value() {
			return this.dep.track(), this._value;
		}
		set value(e) {
			let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Ut(e) || /* @__PURE__ */ Ht(e);
			e = n ? e : /* @__PURE__ */ Gt(e), we(e, t) && (this._rawValue = e, this._value = n ? e : Jn(e), this.dep.trigger());
		}
	}, Zn = {
		get: (e, t, n) => t === "__v_raw" ? e : Zt(Reflect.get(e, t, n)),
		set: (e, t, n, r) => {
			let i = e[t];
			return /* @__PURE__ */ qt(i) && !/* @__PURE__ */ qt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
		}
	}, Qn = class {
		constructor(e) {
			this.__v_isRef = !0, this._value = void 0;
			let t = this.dep = new Sn(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
			this._get = n, this._set = r;
		}
		get value() {
			return this._value = this._get();
		}
		set value(e) {
			this._set(e);
		}
	}, $n = class {
		constructor(e, t, n) {
			this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = ce(t) ? t : String(t), this._raw = /* @__PURE__ */ Gt(e);
			let r = !0, i = e;
			if (!M(e) || ce(this._key) || !me(this._key)) do
				r = !/* @__PURE__ */ Wt(i) || /* @__PURE__ */ Ut(i);
			while (r && (i = i.__v_raw));
			this._shallow = r;
		}
		get value() {
			let e = this._object[this._key];
			return this._shallow && (e = Zt(e)), this._value = e === void 0 ? this._defaultValue : e;
		}
		set value(e) {
			if (this._shallow && /* @__PURE__ */ qt(this._raw[this._key])) {
				let t = this._object[this._key];
				if (/* @__PURE__ */ qt(t)) {
					t.value = e;
					return;
				}
			}
			this._object[this._key] = e;
		}
		get dep() {
			return xt(this._raw, this._key);
		}
	}, er = class {
		constructor(e) {
			this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
		}
		get value() {
			return this._value = this._getter();
		}
	}, tr = class {
		constructor(e, t, n) {
			this.fn = e, this.setter = t, this._value = void 0, this.dep = new Sn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = bn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
		}
		notify() {
			if (this.flags |= 16, !(this.flags & 8) && fn !== this) return it(this, !0), !0;
		}
		get value() {
			let e = this.dep.track();
			return ut(this), e && (e.version = this.dep.version), this._value;
		}
		set value(e) {
			this.setter && this.setter(e);
		}
	}, nr = {
		GET: "get",
		HAS: "has",
		ITERATE: "iterate"
	}, rr = {
		SET: "set",
		ADD: "add",
		DELETE: "delete",
		CLEAR: "clear"
	}, ir = {}, ar = /* @__PURE__ */ new WeakMap(), or = void 0;
}));
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function cr(e) {
	Co.push(e);
}
function lr() {
	Co.pop();
}
function ur(e, t) {}
function dr(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		pr(e, t, n);
	}
}
function fr(e, t, n, r) {
	if (P(e)) {
		let i = dr(e, t, n, r);
		return i && le(i) && i.catch((e) => {
			pr(e, t, n);
		}), i;
	}
	if (M(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(fr(e[a], t, n, r));
		return i;
	}
}
function pr(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || E;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			ht(), dr(a, null, 10, [
				e,
				i,
				o
			]), gt();
			return;
		}
	}
	mr(e, n, i, r, o);
}
function mr(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
function hr(e) {
	let t = Mo || jo;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function gr(e) {
	let t = Do + 1, n = Eo.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Eo[r], a = No(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function _r(e) {
	if (!(e.flags & 1)) {
		let t = No(e), n = Eo[Eo.length - 1];
		!n || !(e.flags & 2) && t >= No(n) ? Eo.push(e) : Eo.splice(gr(t), 0, e), e.flags |= 1, vr();
	}
}
function vr() {
	Mo ||= jo.then(Sr);
}
function yr(e) {
	M(e) ? Oo.push(...e) : ko && e.id === -1 ? ko.splice(Ao + 1, 0, e) : e.flags & 1 || (Oo.push(e), e.flags |= 1), vr();
}
function br(e, t, n = Do + 1) {
	for (; n < Eo.length; n++) {
		let t = Eo[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Eo.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function xr(e) {
	if (Oo.length) {
		let e = [...new Set(Oo)].sort((e, t) => No(e) - No(t));
		if (Oo.length = 0, ko) {
			ko.push(...e);
			return;
		}
		for (ko = e, Ao = 0; Ao < ko.length; Ao++) {
			let e = ko[Ao];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ko = null, Ao = 0;
	}
}
function Sr(e) {
	try {
		for (Do = 0; Do < Eo.length; Do++) {
			let e = Eo[Do];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), dr(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Do < Eo.length; Do++) {
			let e = Eo[Do];
			e && (e.flags &= -2);
		}
		Do = -1, Eo.length = 0, xr(e), Mo = null, (Eo.length || Oo.length) && Sr(e);
	}
}
function Cr(e, t) {
	Po = e, Po ? (Po.enabled = !0, Fo.forEach(({ event: e, args: t }) => Po.emit(e, ...t)), Fo = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		Cr(e, t);
	}), setTimeout(() => {
		Po || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, Fo = []);
	}, 3e3)) : Fo = [];
}
function wr(e) {
	let t = Io;
	return Io = e, Lo = e && e.type.__scopeId || null, t;
}
function Tr(e) {
	Lo = e;
}
function Er() {
	Lo = null;
}
function Dr(e, t = Io, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ka(-1);
		let i = wr(t), a;
		try {
			a = e(...n);
		} finally {
			wr(i), r._d && Ka(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function z(e, t) {
	if (Io === null) return e;
	let n = go(Io), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = E] = t[e];
		i && (P(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && ln(a), r.push({
			dir: i,
			instance: n,
			value: a,
			oldValue: void 0,
			arg: o,
			modifiers: s
		}));
	}
	return e;
}
function Or(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ht(), fr(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), gt());
	}
}
function kr(e, t) {
	if (xc) {
		let n = xc.provides, r = xc.parent && xc.parent.provides;
		r === n && (n = xc.provides = Object.create(r)), n[e] = t;
	}
}
function Ar(e, t, n = !1) {
	let r = Sc();
	if (r || Us) {
		let i = Us ? Us._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && P(t) ? t.call(r && r.proxy) : t;
	}
}
function jr() {
	return !!(Sc() || Us);
}
function Mr(e, t) {
	return Ir(e, null, t);
}
function Nr(e, t) {
	return Ir(e, null, { flush: "post" });
}
function Pr(e, t) {
	return Ir(e, null, { flush: "sync" });
}
function Fr(e, t, n) {
	return Ir(e, t, n);
}
function Ir(e, t, n = E) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = A({}, n), c = t && r || !t && a !== "post", l;
	if (Dc) {
		if (a === "sync") {
			let e = Bo();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = O, e.resume = O, e.pause = O, e;
		}
	}
	let u = xc;
	s.call = (e, t, n) => fr(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		oc(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : _r(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = cn(e, t, s);
	return Dc && (l ? l.push(f) : c && f()), f;
}
function Lr(e, t, n) {
	let r = this.proxy, i = F(e) ? e.includes(".") ? Rr(r, e) : () => r[e] : e.bind(r, r), a;
	P(t) ? a = t : (a = t.handler, n = t);
	let o = Tc(this), s = Ir(i, a.bind(r), n);
	return o(), s;
}
function Rr(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
function zr(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Vo.has(e) && (!d || Wo(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Br(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
	function f(e, n) {
		let r = n;
		for (; r;) {
			if (r && r.nodeType === 8) {
				if (r.data === "teleport start anchor") t.targetStart = r;
				else if (r.data === "teleport anchor") {
					t.targetAnchor = r, e._lpa = t.targetAnchor && o(t.targetAnchor);
					break;
				}
			}
			r = o(r);
		}
	}
	function p(e, t) {
		t.anchor = d(o(e), t, s(e), n, r, i, a);
	}
	let m = t.target = Jo(t.props, c), h = Wo(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || Hr(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || Hr(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), Vr(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
function Vr(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function Hr(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[Ho] = o, e && (r(a, e, i), r(o, e, i)), o;
}
function Ur() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return ws(() => {
		e.isMounted = !0;
	}), Ds(() => {
		e.isUnmounting = !0;
	}), e;
}
function Wr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== dc) {
			t = n;
			break;
		}
	}
	return t;
}
function Gr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Kr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Gr(n, e), S = (e, t) => {
		e && fr(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		S(e, t), M(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, C = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) if (a) r = g || c;
			else return;
			t[Zo] && t[Zo](!0);
			let i = x[b];
			i && Xa(e, i) && i.el[Zo] && i.el[Zo](), S(r, [t]);
		},
		enter(t) {
			if (x[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) if (a) r = _ || l, i = v || u, o = y || d;
			else return;
			let s = !1;
			t[Qo] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), C.delayedLeave && C.delayedLeave(), t[Qo] = void 0);
			};
			let c = t[Qo].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Qo] && t[Qo](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[Zo] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[Zo] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[Zo].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = Kr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return C;
}
function qr(e) {
	if (bs(e)) return e = eo(e), e.children = null, e;
}
function Jr(e) {
	if (!bs(e)) return Uo(e.type) && e.children ? Wr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && P(n.default)) return n.default();
	}
}
function Yr(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Yr(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Xr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === K ? (o.patchFlag & 128 && i++, r = r.concat(Xr(o.children, t, s))) : (t || o.type !== dc) && r.push(s == null ? o : eo(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
// @__NO_SIDE_EFFECTS__
function Zr(e, t) {
	return P(e) ? /* @__PURE__ */ A({ name: e.name }, t, { setup: e }) : e;
}
function Qr() {
	let e = Sc();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function $r(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function ei(e) {
	let t = Sc(), n = /* @__PURE__ */ Jt(null);
	if (t) {
		let r = t.refs === E ? t.refs = {} : t.refs;
		Object.defineProperty(r, e, {
			enumerable: !0,
			get: () => n.value,
			set: (e) => n.value = e
		});
	}
	return n;
}
function ti(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
function ni(e, t, n, r, i = !1) {
	if (M(e)) {
		e.forEach((e, a) => ni(e, t && (M(t) ? t[a] : t), n, r, i));
		return;
	}
	if (ys(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && ni(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? go(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === E ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ Gt(d), p = d === E ? k : (e) => !ti(u, e) && j(f, e), m = (e, t) => !(t && ti(u, t));
	if (l != null && l !== c) {
		if (ri(t), F(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ qt(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (P(c)) {
		ht();
		try {
			dr(c, s, 12, [o, u]);
		} finally {
			gt();
		}
	} else {
		let t = F(c), r = /* @__PURE__ */ qt(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) M(n) && re(n, a);
					else if (M(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), is.delete(e);
				};
				t.id = -1, is.set(e, t), oc(t, n);
			} else ri(e), s();
		}
	}
}
function ri(e) {
	let t = is.get(e);
	t && (t.flags |= 8, is.delete(e));
}
function ii(e) {
	let { mt: t, p: n, o: { patchProp: r, createText: i, nextSibling: a, parentNode: o, remove: s, insert: c, createComment: l } } = e, u = (e, t) => {
		if (!t.hasChildNodes()) {
			n(null, e, t), xr(), t._vnode = e;
			return;
		}
		d(t.firstChild, e, null, null, null), xr(), t._vnode = e;
	}, d = (n, r, s, l, u, y = !1) => {
		y ||= !!r.dynamicChildren;
		let b = us(n) && n.data === "[", x = () => h(n, r, s, l, u, b), { type: S, ref: ee, shapeFlag: C, patchFlag: w } = r, T = n.nodeType;
		r.el = n, w === -2 && (y = !1, r.dynamicChildren = null);
		let E = null;
		switch (S) {
			case uc:
				T === 3 ? (n.data !== r.children && (os(), n.data = r.children), E = a(n)) : r.children === "" ? (c(r.el = i(""), o(n), n), E = n) : E = x();
				break;
			case dc:
				v(n) ? (E = a(n), _(r.el = n.content.firstChild, n, s)) : E = T !== 8 || b ? x() : a(n);
				break;
			case fc:
				if (b && (n = a(n), T = n.nodeType), T === 1 || T === 3) {
					E = n;
					let e = !r.children.length;
					for (let t = 0; t < r.staticCount; t++) e && (r.children += E.nodeType === 1 ? E.outerHTML : E.data), t === r.staticCount - 1 && (r.anchor = E), E = a(E);
					return b ? a(E) : E;
				} else x();
				break;
			case K:
				E = b ? m(n, r, s, l, u, y) : x();
				break;
			default: if (C & 1) E = (T !== 1 || r.type.toLowerCase() !== n.tagName.toLowerCase()) && !v(n) ? x() : f(n, r, s, l, u, y);
			else if (C & 6) {
				r.slotScopeIds = u;
				let e = o(n);
				if (E = b ? g(n) : us(n) && n.data === "teleport start" ? g(n, n.data, "teleport end") : a(n), t(r, e, null, s, l, ls(e), y), ys(r) && !r.type.__asyncResolved) {
					let t;
					b ? (t = vc(K), t.anchor = E ? E.previousSibling : e.lastChild) : t = n.nodeType === 3 ? W("") : vc("div"), t.el = n, r.component.subTree = t;
				}
			} else C & 64 ? E = T === 8 ? r.type.hydrate(n, r, s, l, u, y, e, p) : x() : C & 128 && (E = r.type.hydrate(n, r, s, l, ls(o(n)), u, y, e, d));
		}
		return ee != null && ni(ee, null, l, r), E;
	}, f = (e, t, n, i, a, o) => {
		o ||= !!t.dynamicChildren;
		let { type: c, dynamicProps: l, props: u, patchFlag: d, shapeFlag: f, dirs: m, transition: h } = t, g = c === "input" || c === "option", y = !!l;
		if (g || y || d !== -1) {
			m && Or(t, null, n, "created");
			let c = !1;
			if (v(e)) {
				c = ka(null, h) && n && n.vnode.props && n.vnode.props.appear;
				let r = e.content.firstChild;
				if (c) {
					let e = r.getAttribute("class");
					e && (r.$cls = e), h.beforeEnter(r);
				}
				_(r, e, n), t.el = e = r;
			}
			if (f & 16 && !(u && (u.innerHTML || u.textContent))) {
				let r = p(e.firstChild, t, e, n, i, a, o);
				for (r && !ai(e, 1) && os(); r;) {
					let e = r;
					r = r.nextSibling, s(e);
				}
			} else if (f & 8) {
				let n = t.children;
				n[0] === "\n" && (e.tagName === "PRE" || e.tagName === "TEXTAREA") && (n = n.slice(1));
				let { textContent: r } = e;
				r !== n && r !== n.replace(/\r\n|\r/g, "\n") && (ai(e, 0) || os(), e.textContent = t.children);
			}
			if (u) {
				if (g || y || !o || d & 48) {
					let t = e.tagName.includes("-");
					for (let i in u) (g && (i.endsWith("value") || i === "indeterminate") || te(i) && !he(i) || i[0] === "." || t && !he(i) || l && l.includes(i)) && r(e, i, null, u[i], void 0, n);
				} else if (u.onClick) r(e, "onClick", null, u.onClick, void 0, n);
				else if (d & 4 && /* @__PURE__ */ Vt(u.style)) for (let e in u.style) u.style[e];
			}
			let b;
			(b = u && u.onVnodeBeforeMount) && oo(b, n, t), m && Or(t, null, n, "beforeMount"), ((b = u && u.onVnodeMounted) || m || c) && Ha(() => {
				b && oo(b, n, t), c && h.enter(e), m && Or(t, null, n, "mounted");
			}, i);
		}
		return e.nextSibling;
	}, p = (e, t, r, o, s, l, u) => {
		u ||= !!t.dynamicChildren;
		let f = t.children, p = f.length, m = !1;
		for (let t = 0; t < p; t++) {
			let h = u ? f[t] : f[t] = no(f[t]), g = h.type === uc;
			e ? (g && !u && t + 1 < p && no(f[t + 1]).type === uc && (c(i(e.data.slice(h.children.length)), r, a(e)), e.data = h.children), e = d(e, h, o, s, l, u)) : g && !h.children ? c(h.el = i(""), r) : (m || (m = !0, ai(r, 1) || os()), n(null, h, r, null, o, s, ls(r), l));
		}
		return e;
	}, m = (e, t, n, r, i, s) => {
		let { slotScopeIds: u } = t;
		u && (i = i ? i.concat(u) : u);
		let d = o(e), f = p(a(e), t, d, n, r, i, s);
		return f && us(f) && f.data === "]" ? a(t.anchor = f) : (os(), c(t.anchor = l("]"), d, f), f);
	}, h = (e, t, r, i, c, l) => {
		if (si(e, t) || os(), t.el = null, l) {
			let t = g(e);
			for (;;) {
				let n = a(e);
				if (n && n !== t) s(n);
				else break;
			}
		}
		let u = a(e), d = o(e);
		return s(e), n(null, t, d, u, r, i, ls(d), c), r && (r.vnode.el = t.el, _a(r, t.el)), u;
	}, g = (e, t = "[", n = "]") => {
		let r = 0;
		for (; e;) if (e = a(e), e && us(e) && (e.data === t && r++, e.data === n)) {
			if (r === 0) return a(e);
			r--;
		}
		return e;
	}, _ = (e, t, n) => {
		let r = t.parentNode;
		r && r.replaceChild(e, t);
		let i = n;
		for (; i;) i.vnode.el === t && (i.vnode.el = i.subTree.el = e), i = i.parent;
	}, v = (e) => e.nodeType === 1 && e.tagName === "TEMPLATE";
	return [u, d];
}
function ai(e, t) {
	if (t === 0 || t === 1) for (; e && !e.hasAttribute(ds);) e = e.parentElement;
	return oi(e && e.getAttribute(ds), t);
}
function oi(e, t) {
	if (e == null) return !1;
	if (e === "") return !0;
	{
		let n = e.split(",");
		return t === 0 && n.includes("children") ? !0 : n.includes(fs[t]);
	}
}
function si(e, t) {
	return ai(e.parentElement, 1) || ci(e) || li(t);
}
function ci(e) {
	return e.nodeType === 1 && oi(e.getAttribute(ds), 1);
}
function li({ props: e }) {
	let t = e && e[ds];
	return typeof t == "string" && oi(t, 1);
}
function ui(e) {
	let { top: t, left: n, bottom: r, right: i } = e.getBoundingClientRect(), { innerHeight: a, innerWidth: o } = window;
	return (t > 0 && t < a || r > 0 && r < a) && (n > 0 && n < o || i > 0 && i < o);
}
function di(e, t) {
	if (us(e) && e.data === "[") {
		let n = 1, r = e.nextSibling;
		for (; r;) {
			if (r.nodeType === 1) {
				if (t(r) === !1) break;
			} else if (us(r)) if (r.data === "]") {
				if (--n === 0) break;
			} else r.data === "[" && n++;
			r = r.nextSibling;
		}
	} else t(e);
}
// @__NO_SIDE_EFFECTS__
function fi(e) {
	P(e) && (e = { loader: e });
	let { loader: t, loadingComponent: n, errorComponent: r, delay: i = 200, hydrate: a, timeout: o, suspensible: s = !0, onError: c } = e, l = null, u, d = 0, f = () => (d++, l = null, p()), p = () => {
		let e;
		return l || (e = l = t().catch((e) => {
			if (e = e instanceof Error ? e : Error(String(e)), c) return new Promise((t, n) => {
				c(e, () => t(f()), () => n(e), d + 1);
			});
			throw e;
		}).then((t) => e !== l && l ? l : (t && (t.__esModule || t[Symbol.toStringTag] === "Module") && (t = t.default), u = t, t)));
	};
	return /* @__PURE__ */ Zr({
		name: "AsyncComponentWrapper",
		__asyncLoader: p,
		__asyncHydrate(e, t, n) {
			let r = !1;
			(t.bu ||= []).push(() => r = !0);
			let i = () => {
				r || n();
			}, o = a ? () => {
				let n = a(i, (t) => di(e, t));
				n && (t.bum ||= []).push(n);
			} : i;
			u ? o() : p().then(() => !t.isUnmounted && o());
		},
		get __asyncResolved() {
			return u;
		},
		setup() {
			let e = xc;
			if ($r(e), u) return () => pi(u, e);
			let t = (t) => {
				l = null, pr(t, e, 13, !r);
			};
			if (s && e.suspense || Dc) return p().then((t) => () => pi(t, e)).catch((e) => (t(e), () => r ? vc(r, { error: e }) : null));
			let a = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(), d = /* @__PURE__ */ R(!!i), f, m;
			return Os(() => {
				f != null && clearTimeout(f), m != null && clearTimeout(m);
			}), i && (m = setTimeout(() => {
				e.isUnmounted || (d.value = !1);
			}, i)), o != null && (f = setTimeout(() => {
				if (!e.isUnmounted && !a.value && !c.value) {
					let e = /* @__PURE__ */ Error(`Async component timed out after ${o}ms.`);
					t(e), c.value = e;
				}
			}, o)), p().then(() => {
				e.isUnmounted || (a.value = !0, e.parent && bs(e.parent.vnode) && e.parent.update());
			}).catch((n) => {
				if (e.isUnmounted) {
					l = null;
					return;
				}
				t(n), c.value = n;
			}), () => {
				if (a.value && u) return pi(u, e);
				if (c.value && r) return vc(r, { error: c.value });
				if (n && !d.value) return pi(n, e);
			};
		}
	});
}
function pi(e, t) {
	let { ref: n, props: r, children: i, ce: a } = t.vnode, o = vc(e, r, i);
	return o.ref = n, o.ce = a, delete t.vnode.ce, o;
}
function mi(e, t) {
	return M(e) ? e.some((e) => mi(e, t)) : F(e) ? e.split(",").includes(t) : se(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function hi(e, t) {
	_i(e, "a", t);
}
function gi(e, t) {
	_i(e, "da", t);
}
function _i(e, t, n = xc) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (xi(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) bs(e.parent.vnode) && vi(r, t, n, e), e = e.parent;
	}
}
function vi(e, t, n, r) {
	let i = xi(t, e, r, !0);
	Os(() => {
		re(r[t], i);
	}, n);
}
function yi(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function bi(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function xi(e, t, n = xc, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ht();
			let i = Tc(n), a = fr(t, n, e, r);
			return i(), gt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
function Si(e, t = xc) {
	xi("ec", e, t);
}
function Ci(e, t) {
	return Ei(Ms, e, !0, t) || e;
}
function wi(e) {
	return F(e) ? Ei(Ms, e, !1) || e : e || Ps;
}
function Ti(e) {
	return Ei(Ns, e);
}
function Ei(e, t, n = !0, r = !1) {
	let i = Io || xc;
	if (i) {
		let n = i.type;
		if (e === Ms) {
			let e = _o(n, !1);
			if (e && (e === t || e === ye(t) || e === Se(ye(t)))) return n;
		}
		let a = Di(i[e] || n[e], t) || Di(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Di(e, t) {
	return e && (e[t] || e[ye(t)] || e[Se(ye(t))]);
}
function B(e, t, n, r) {
	let i, a = n && n[r], o = M(e);
	if (o || F(e)) {
		let n = o && /* @__PURE__ */ Vt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Ut(e), s = /* @__PURE__ */ Ht(e), e = Ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Yn(Jn(e[n])) : Jn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (I(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
function Oi(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (M(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function ki(e, t, n = {}, r, i) {
	if (Io.ce || Io.parent && ys(Io.parent) && Io.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), V(), Ja(K, null, [vc("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), V();
	let o = a && Ai(a(n)), s = n.key || o && o.key, c = Ja(K, { key: (s && !ce(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Ai(e) {
	return e.some((e) => !Ya(e) || !(e.type === dc || e.type === K && !Ai(e.children))) ? e : null;
}
function ji(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : Ce(r)] = e[r];
	return n;
}
function Mi() {
	return null;
}
function Ni() {
	return null;
}
function Pi(e) {}
function Fi(e) {}
function Ii() {
	return null;
}
function Li() {}
function Ri(e, t) {
	return null;
}
function zi() {
	return Vi("useSlots").slots;
}
function Bi() {
	return Vi("useAttrs").attrs;
}
function Vi(e) {
	let t = Sc();
	return t.setupContext ||= ho(t);
}
function Hi(e) {
	return M(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Ui(e, t) {
	let n = Hi(e);
	for (let e in t) {
		if (e.startsWith("__skip")) continue;
		let r = n[e];
		r ? M(r) || P(r) ? r = n[e] = {
			type: r,
			default: t[e]
		} : r.default = t[e] : r === null && (r = n[e] = { default: t[e] }), r && t[`__skip_${e}`] && (r.skipFactory = !0);
	}
	return n;
}
function Wi(e, t) {
	return !e || !t ? e || t : M(e) && M(t) ? e.concat(t) : A({}, Hi(e), Hi(t));
}
function Gi(e, t) {
	let n = {};
	for (let r in e) t.includes(r) || Object.defineProperty(n, r, {
		enumerable: !0,
		get: () => e[r]
	});
	return n;
}
function Ki(e) {
	let t = Sc(), n = Dc, r = e();
	Ec(), n && wc(!1);
	let i = () => {
		Tc(t), n && wc(!0);
	}, a = () => {
		Sc() !== t && t.scope.off(), Ec(), n && wc(!1);
	};
	return le(r) && (r = r.catch((e) => {
		throw i(), Promise.resolve().then(() => Promise.resolve().then(a)), e;
	})), [r, () => {
		i(), Promise.resolve().then(a);
	}];
}
function qi(e) {
	let t = Zi(e), n = e.proxy, r = e.ctx;
	Bs = !1, t.beforeCreate && Yi(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: ee, errorCaptured: C, serverPrefetch: w, expose: T, inheritAttrs: E, components: D, directives: k, filters: te } = t;
	if (l && Ji(l, r, null), o) for (let e in o) {
		let t = o[e];
		P(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		I(t) && (e.data = /* @__PURE__ */ It(t));
	}
	if (Bs = !0, a) for (let e in a) {
		let t = a[e], i = P(t) ? t.bind(n, n) : P(t.get) ? t.get.bind(n, n) : O, o = !P(t) && P(t.set) ? t.set.bind(n) : O, s = q({
			get: i,
			set: o
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => s.value,
			set: (e) => s.value = e
		});
	}
	if (s) for (let e in s) Xi(s[e], r, n, e);
	if (c) {
		let e = P(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			kr(t, e[t]);
		});
	}
	u && Yi(u, e, "c");
	function ne(e, t) {
		M(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ne(Cs, d), ne(ws, f), ne(Ts, p), ne(Es, m), ne(hi, h), ne(gi, g), ne(Si, C), ne(js, S), ne(As, ee), ne(Ds, v), ne(Os, b), ne(ks, w), M(T)) if (T.length) {
		let t = e.exposed ||= {};
		T.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	x && e.render === O && (e.render = x), E != null && (e.inheritAttrs = E), D && (e.components = D), k && (e.directives = k), w && $r(e);
}
function Ji(e, t, n = O) {
	M(e) && (e = ta(e));
	for (let n in e) {
		let r = e[n], i;
		i = I(r) ? "default" in r ? Ar(r.from || n, r.default, !0) : Ar(r.from || n) : Ar(r), /* @__PURE__ */ qt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Yi(e, t, n) {
	fr(M(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Xi(e, t, n, r) {
	let i = r.includes(".") ? Rr(n, r) : () => n[r];
	if (F(e)) {
		let n = t[e];
		P(n) && Fr(i, n);
	} else if (P(e)) Fr(i, e.bind(n));
	else if (I(e)) if (M(e)) e.forEach((e) => Xi(e, t, n, r));
	else {
		let r = P(e.handler) ? e.handler.bind(n) : t[e.handler];
		P(r) && Fr(i, r, e);
	}
}
function Zi(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Qi(c, e, o, !0)), Qi(c, t, o)), I(t) && a.set(t, c), c;
}
function Qi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Qi(e, a, n, !0), i && i.forEach((t) => Qi(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Vs[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
function $i(e, t) {
	return t ? e ? function() {
		return A(P(e) ? e.call(this, this) : e, P(t) ? t.call(this, this) : t);
	} : t : e;
}
function ea(e, t) {
	return ra(ta(e), ta(t));
}
function ta(e) {
	if (M(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function na(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function ra(e, t) {
	return e ? A(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function ia(e, t) {
	return e ? M(e) && M(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : A(/* @__PURE__ */ Object.create(null), Hi(e), Hi(t ?? {})) : t;
}
function aa(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = A(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = na(e[r], t[r]);
	return n;
}
function oa() {
	return {
		app: null,
		config: {
			isNativeTag: k,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
function sa(e, t) {
	return function(n, r = null) {
		P(n) || (n = A({}, n)), r != null && !I(r) && (r = null);
		let i = oa(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Hs++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Mc,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && P(e.install) ? (a.add(e), e.install(c, ...t)) : P(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || vc(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, go(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (fr(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Us;
				Us = c;
				try {
					return e();
				} finally {
					Us = t;
				}
			}
		};
		return c;
	};
}
function ca(e, t, n = E) {
	let r = Sc(), i = ye(t), a = xe(t), o = Ws(e, i), s = en((o, s) => {
		let c, l = E, u;
		return Pr(() => {
			let t = e[i];
			we(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!we(o, c) && !(l !== E && we(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), we(e, l) && (we(e, o) && !we(o, u) || f && l !== E && !we(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || E : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
function la(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || E, i = n, a = t.startsWith("update:"), o = a && Ws(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => F(e) ? e.trim() : e)), o.number && (i = n.map(De)));
	let s, c = r[s = Ce(t)] || r[s = Ce(ye(t))];
	!c && a && (c = r[s = Ce(xe(t))]), c && fr(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, fr(l, e, 6, i);
	}
}
function ua(e, t, n = !1) {
	let r = n ? Gs : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!P(e)) {
		let r = (e) => {
			let n = ua(e, t, !0);
			n && (s = !0, A(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (I(e) && r.set(e, null), null) : (M(a) ? a.forEach((e) => o[e] = null) : A(o, a), I(e) && r.set(e, o), o);
}
function da(e, t) {
	return !e || !te(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), j(e, t[0].toLowerCase() + t.slice(1)) || j(e, xe(t)) || j(e, t));
}
function fa(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = wr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = no(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = no(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : Ks(s);
		}
	} catch (t) {
		pc.length = 0, pr(t, e, 1), _ = vc(dc);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(ne) && (v = qs(v, a)), y = eo(y, v, !1, !0));
	}
	return n.dirs && (y = eo(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Yr(y, n.transition), _ = y, wr(g), _;
}
function pa(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Ya(r)) {
			if (r.type !== dc || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
function ma(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ha(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ga(o, r, n) && !da(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ha(r, o, l) : !!o;
	return !1;
}
function ha(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ga(t, e, a) && !da(n, a)) return !0;
	}
	return !1;
}
function ga(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && I(r) && I(i) ? !C(r, i) : r !== i;
}
function _a({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
function va(e, t, n, r = !1) {
	let i = {}, a = Ys();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ba(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Lt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function ya(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Gt(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (da(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (j(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = ye(o);
					i[t] = xa(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ba(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !j(t, a) && ((r = xe(a)) === a || !j(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = xa(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !j(t, e)) && (delete a[e], l = !0);
	}
	l && bt(e.attrs, "set", "");
}
function ba(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (he(c)) continue;
		let l = t[c], u;
		i && j(i, u = ye(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : da(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ Gt(n), r = s || E;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = xa(i, t, s, r[s], e, !j(r, s));
		}
	}
	return o;
}
function xa(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = j(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && P(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Tc(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === xe(n)) && (r = !0));
	}
	return r;
}
function Sa(e, t, n = !1) {
	let r = n ? Zs : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!P(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Sa(e, t, !0);
			A(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return I(e) && r.set(e, D), D;
	if (M(a)) for (let e = 0; e < a.length; e++) {
		let t = ye(a[e]);
		Ca(t) && (o[t] = E);
	}
	else if (a) for (let e in a) {
		let t = ye(e);
		if (Ca(t)) {
			let n = a[e], r = o[t] = M(n) || P(n) ? { type: n } : A({}, n), i = r.type, c = !1, l = !0;
			if (M(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = P(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = P(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || j(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return I(e) && r.set(e, l), l;
}
function Ca(e) {
	return e[0] !== "$" && !he(e);
}
function wa(e) {
	return Ea(e);
}
function Ta(e) {
	return Ea(e, ii);
}
function Ea(e, t) {
	let n = Ae();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = O, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Xa(e, t) && (r = le(e), se(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case uc:
				g(e, t, n, r);
				break;
			case dc:
				_(e, t, n, r);
				break;
			case fc:
				e ?? v(t, n, r, o);
				break;
			case K:
				te(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? ne(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, fe);
		}
		u != null && i ? ni(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && ni(e.ref, null, a, e, !0);
	}, g = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, _ = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, v = (e, t, n, r) => {
		[e.el, e.anchor] = m(e.children, t, n, r, e.el, e.anchor);
	}, y = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, b = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, x = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) S(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), w(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && C(e.children, f, null, i, s, Da(e, c), l, d), _ && Or(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !he(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && oo(p, i, e);
		}
		_ && Or(e, null, i, "beforeMount");
		let v = ka(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && oc(() => {
			try {
				p && oo(p, i, e), v && g.enter(f), _ && Or(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || sc(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, C = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ro(e[l]) : no(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, w = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || E, m = t.props || E, h;
		if (n && Oa(n, !1), (h = m.onVnodeBeforeUpdate) && oo(h, n, t, e), f && Or(t, e, n, "beforeUpdate"), n && Oa(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? T(e.dynamicChildren, d, c, n, r, Da(t, i), o) : s || M(e, t, c, null, n, r, Da(t, i), o, !1), l > 0) {
			if (l & 16) k(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && k(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && oc(() => {
			h && oo(h, n, t, e), f && Or(t, e, n, "updated");
		}, r);
	}, T = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === K || !Xa(c, l) || c.shapeFlag & 198) ? d(c.el) : n;
			h(c, l, u, null, r, i, a, o, !0);
		}
	}, k = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== E) for (let o in t) !he(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (he(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, te = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), C(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (T(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Aa(e, t, !0)) : M(e, t, n, f, a, o, c, l, u);
	}, ne = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : re(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = so(e, r, i);
		if (bs(e) && (s.ctx.renderer = fe), lo(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = vc(dc);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (ma(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			j(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ma(e);
					if (n) {
						t && (t.el = c.el, j(e, t, o)), n.asyncDep.then(() => {
							oc(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Oa(e, !1), t ? (t.el = c.el, j(e, t, o)) : t = c, n && Te(n), (f = t.props && t.props.onVnodeBeforeUpdate) && oo(f, s, t, c), Oa(e, !0);
				let p = fa(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), le(m), e, i, a), t.el = p.el, u === null && _a(e, p.el), r && oc(r, i), (f = t.props && t.props.onVnodeUpdated) && oc(() => oo(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = ys(t);
				if (Oa(e, !1), l && Te(l), !m && (o = c && c.onVnodeBeforeMount) && oo(o, d, t), Oa(e, !0), s && me) {
					let t = () => {
						e.subTree = fa(e), me(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = fa(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && oc(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					oc(() => oo(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && ys(d.vnode) && d.vnode.shapeFlag & 256) && e.a && oc(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new mn(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => _r(u), Oa(e, !0), l();
	}, j = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ya(e, t.props, r, n), ac(e, t.children, n), ht(), br(e), gt();
	}, M = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				N(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				ae(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && I(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? N(l, f, n, r, i, a, o, s, c) : I(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && C(f, n, r, i, a, o, s, c));
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		e ||= D, t ||= D;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? ro(t[f]) : no(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? I(e, i, a, !0, !1, d) : C(t, n, r, i, a, o, s, c, d);
	}, N = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ro(t[l]) : no(t[l]);
			if (Xa(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ro(t[f]) : no(t[f]);
			if (Xa(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ro(t[l]) : no(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) se(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ro(t[l]) : no(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					se(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && Xa(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? se(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? ja(S) : D;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Pa(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? oe(d, n, p, 2) : _--);
			}
		}
	}, oe = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			oe(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, fe);
			return;
		}
		if (c === K) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) oe(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === fc) {
			y(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[Zo] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), oc(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[Zo];
				s._isLeaving && s[Zo](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, se = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (ht(), ni(s, null, n, e, !0), gt()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !ys(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && oo(_, t, e), u & 6) ce(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Or(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, fe, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? I(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && I(c, t, n), r && P(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && oc(() => {
			_ && oo(_, t, e), h && Or(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, P = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === K) {
			F(n, r);
			return;
		}
		if (t === fc) {
			b(e);
			return;
		}
		let o = () => {
			i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (e.shapeFlag & 1 && a && !a.persisted) {
			let { leave: t, delayLeave: r } = a, i = () => t(n, o);
			r ? r(e.el, o, i) : i();
		} else o();
	}, F = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, ce = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Na(c), Na(l), r && Te(r), i.stop(), a && (a.flags |= 8, se(o, e, t, n)), s && oc(s, t), oc(() => {
			e.isUnmounted = !0;
		}, t);
	}, I = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) se(e[o], t, n, r, i);
	}, le = (e) => {
		if (e.shapeFlag & 6) return le(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[Ho];
		return n ? f(n) : t;
	}, ue = !1, de = (e, t, n) => {
		let r;
		e == null ? t._vnode && (se(t._vnode, null, null, !0), r = t._vnode.component) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e, ue ||= (ue = !0, br(r), xr(), !1);
	}, fe = {
		p: h,
		um: se,
		m: oe,
		r: P,
		mt: A,
		mc: C,
		pc: M,
		pbc: T,
		n: le,
		o: e
	}, pe, me;
	return t && ([pe, me] = t(fe)), {
		render: de,
		hydrate: pe,
		createApp: sa(de, pe)
	};
}
function Da({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Oa({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ka(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Aa(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (M(r) && M(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ro(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Aa(t, a)), a.type === uc && (a.patchFlag === -1 && (a = i[e] = ro(a)), a.el = t.el), a.type === dc && !a.el && (a.el = t.el);
	}
}
function ja(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Ma(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ma(t);
}
function Na(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Pa(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Pa(t.subTree) : null;
}
function Fa(e, t) {
	let n = e.props && e.props[t];
	P(n) && n();
}
function Ia(e, t, n, r, i, a, o, s, c) {
	let { p: l, o: { createElement: u } } = c, d = u("div"), f = e.suspense = Ra(e, i, r, t, d, n, a, o, s, c);
	l(null, f.pendingBranch = e.ssContent, d, null, r, f, a, o), f.deps > 0 ? (Fa(e, "onPending"), Fa(e, "onFallback"), l(null, e.ssFallback, t, n, r, null, a, o), Ua(f, e.ssFallback)) : f.resolve(!1, !0);
}
function La(e, t, n, r, i, a, o, s, { p: c, um: l, o: { createElement: u } }) {
	let d = t.suspense = e.suspense;
	d.vnode = t, t.el = e.el;
	let f = t.ssContent, p = t.ssFallback, { activeBranch: m, pendingBranch: h, isInFallback: g, isHydrating: _ } = d;
	if (h) d.pendingBranch = f, Xa(h, f) ? (c(h, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : g && (_ || (c(m, p, n, r, i, null, a, o, s), Ua(d, p)))) : (d.pendingId = cc++, _ ? (d.isHydrating = !1, d.activeBranch = h) : l(h, i, d), d.deps = 0, d.effects.length = 0, d.hiddenContainer = u("div"), g ? (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : (c(m, p, n, r, i, null, a, o, s), Ua(d, p))) : m && Xa(m, f) ? (c(m, f, n, r, i, d, a, o, s), d.resolve(!0)) : (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 && d.resolve()));
	else if (m && Xa(m, f)) c(m, f, n, r, i, d, a, o, s), Ua(d, f);
	else if (Fa(t, "onPending"), d.pendingBranch = f, f.shapeFlag & 512 ? d.pendingId = f.component.suspenseId : d.pendingId = cc++, c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0) d.resolve();
	else {
		let { timeout: e, pendingId: t } = d;
		e > 0 ? setTimeout(() => {
			d.pendingId === t && d.fallback(p);
		}, e) : e === 0 && d.fallback(p);
	}
}
function Ra(e, t, n, r, i, a, o, s, c, l, u = !1) {
	let { p: d, m: f, um: p, n: m, o: { parentNode: h, remove: g } } = l, _, v = Wa(e);
	v && t && t.pendingBranch && (_ = t.pendingId, t.deps++);
	let y = e.props ? Oe(e.props.timeout) : void 0, b = a, x = {
		vnode: e,
		parent: t,
		parentComponent: n,
		namespace: o,
		container: r,
		hiddenContainer: i,
		deps: 0,
		pendingId: cc++,
		timeout: typeof y == "number" ? y : -1,
		activeBranch: null,
		isFallbackMountPending: !1,
		pendingBranch: null,
		isInFallback: !u,
		isHydrating: u,
		isUnmounted: !1,
		effects: [],
		resolve(e = !1, n = !1) {
			let { vnode: r, activeBranch: i, pendingBranch: o, pendingId: s, effects: c, parentComponent: l, container: u, isInFallback: d } = x, g = !1;
			if (x.isHydrating) x.isHydrating = !1;
			else if (!e) {
				g = i && o.transition && o.transition.mode === "out-in";
				let e = !1;
				g && (i.transition.afterLeave = () => {
					s === x.pendingId && (f(o, u, a === b && !e ? m(i) : a, 0), yr(c), d && r.ssFallback && (r.ssFallback.el = null));
				}), i && !x.isFallbackMountPending && (h(i.el) === u && (a = m(i), e = !0), p(i, l, x, !0), !g && d && r.ssFallback && oc(() => r.ssFallback.el = null, x)), g || f(o, u, a, 0);
			}
			x.isFallbackMountPending = !1, Ua(x, o), x.pendingBranch = null, x.isInFallback = !1;
			let y = x.parent, S = !1;
			for (; y;) {
				if (y.pendingBranch) {
					y.effects.push(...c), S = !0;
					break;
				}
				y = y.parent;
			}
			!S && !g && yr(c), x.effects = [], v && t && t.pendingBranch && _ === t.pendingId && (t.deps--, t.deps === 0 && !n && t.resolve()), Fa(r, "onResolve");
		},
		fallback(e) {
			if (!x.pendingBranch) return;
			let { vnode: t, activeBranch: n, parentComponent: r, container: i, namespace: a } = x;
			Fa(t, "onFallback");
			let o = m(n), l = () => {
				x.isFallbackMountPending = !1, x.isInFallback && (d(null, e, i, o, r, null, a, s, c), Ua(x, e));
			}, u = e.transition && e.transition.mode === "out-in";
			u && (x.isFallbackMountPending = !0, n.transition.afterLeave = l), x.isInFallback = !0, p(n, r, null, !0), u || l();
		},
		move(e, t, n) {
			x.activeBranch && f(x.activeBranch, e, t, n), x.container = e;
		},
		next() {
			return x.activeBranch && m(x.activeBranch);
		},
		registerDep(e, t, n) {
			let r = !!x.pendingBranch;
			r && x.deps++;
			let i = e.vnode.el;
			e.asyncDep.catch((t) => {
				pr(t, e, 0);
			}).then((a) => {
				if (e.isUnmounted || x.isUnmounted || x.pendingId !== e.suspenseId) return;
				Ec(), e.asyncResolved = !0;
				let { vnode: s } = e;
				fo(e, a, !1), i && (s.el = i);
				let c = !i && e.subTree.el;
				t(e, s, h(i || e.subTree.el), i ? null : m(e.subTree), x, o, n), c && (s.placeholder = null, g(c)), _a(e, s.el), r && --x.deps === 0 && x.resolve();
			});
		},
		unmount(e, t) {
			x.isUnmounted = !0, x.activeBranch && p(x.activeBranch, n, e, t), x.pendingBranch && p(x.pendingBranch, n, e, t);
		}
	};
	return x;
}
function za(e, t, n, r, i, a, o, s, c) {
	let l = t.suspense = Ra(t, r, n, e.parentNode, document.createElement("div"), null, i, a, o, s, !0), u = c(e, l.pendingBranch = t.ssContent, n, l, a, o);
	return l.deps === 0 && l.resolve(!1, !0), u;
}
function Ba(e) {
	let { shapeFlag: t, children: n } = e, r = t & 32;
	e.ssContent = Va(r ? n.default : n), e.ssFallback = r ? Va(n.fallback) : vc(dc);
}
function Va(e) {
	let t;
	if (P(e)) {
		let n = hc && e._c;
		n && (e._d = !1, V()), e = e(), n && (e._d = !0, t = mc, Ga());
	}
	return M(e) && (e = pa(e)), e = no(e), t && !e.dynamicChildren && (e.dynamicChildren = t.filter((t) => t !== e)), e;
}
function Ha(e, t) {
	t && t.pendingBranch ? M(e) ? t.effects.push(...e) : t.effects.push(e) : yr(e);
}
function Ua(e, t) {
	e.activeBranch = t;
	let { vnode: n, parentComponent: r } = e, i = t.el;
	for (; !i && t.component;) t = t.component.subTree, i = t.el;
	n.el = i, r && r.subTree === n && (r.vnode.el = i, _a(r, i));
}
function Wa(e) {
	let t = e.props && e.props.suspensible;
	return t != null && t !== !1;
}
function V(e = !1) {
	pc.push(mc = e ? null : []);
}
function Ga() {
	pc.pop(), mc = pc[pc.length - 1] || null;
}
function Ka(e, t = !1) {
	hc += e, e < 0 && mc && t && (mc.hasOnce = !0);
}
function qa(e) {
	return e.dynamicChildren = hc > 0 ? mc || D : null, Ga(), hc > 0 && mc && mc.push(e), e;
}
function H(e, t, n, r, i, a) {
	return qa(U(e, t, n, r, i, a, !0));
}
function Ja(e, t, n, r, i) {
	return qa(vc(e, t, n, r, i, !0));
}
function Ya(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Xa(e, t) {
	return e.type === t.type && e.key === t.key;
}
function Za(e) {}
function U(e, t = null, n = null, r = 0, i = null, a = e === K ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && gc(t),
		ref: t && _c(t),
		scopeId: Lo,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Io
	};
	return s ? (io(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= F(n) ? 8 : 16), hc > 0 && !o && mc && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && mc.push(c), c;
}
function Qa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Ps) && (e = dc), Ya(e)) {
		let r = eo(e, t, !0);
		return n && io(r, n), hc > 0 && !a && mc && (r.shapeFlag & 6 ? mc[mc.indexOf(e)] = r : mc.push(r)), r.patchFlag = -2, r;
	}
	if (vo(e) && (e = e.__vccOpts), t) {
		t = $a(t);
		let { class: e, style: n } = t;
		e && !F(e) && (t.class = g(e)), I(n) && (/* @__PURE__ */ Wt(n) && !M(n) && (n = A({}, n)), t.style = p(n));
	}
	let o = F(e) ? 1 : sc(e) ? 128 : Uo(e) ? 64 : I(e) ? 4 : P(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function $a(e) {
	return e ? /* @__PURE__ */ Wt(e) || Xs(e) ? A({}, e) : e : null;
}
function eo(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ao(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && gc(l),
		ref: t && t.ref ? n && a ? M(a) ? a.concat(_c(t)) : [a, _c(t)] : _c(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== K ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && eo(e.ssContent),
		ssFallback: e.ssFallback && eo(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Yr(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return vc(uc, null, e, t);
}
function to(e, t) {
	let n = vc(fc, null, e);
	return n.staticCount = t, n;
}
function G(e = "", t = !1) {
	return t ? (V(), Ja(dc, null, e)) : vc(dc, null, e);
}
function no(e) {
	return e == null || typeof e == "boolean" ? vc(dc) : M(e) ? vc(K, null, e.slice()) : Ya(e) ? ro(e) : vc(uc, null, String(e));
}
function ro(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : eo(e);
}
function io(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (M(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), io(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Xs(t) ? t._ctx = Io : r === 3 && Io && (Io.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (P(t)) {
		if (r & 65) {
			io(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Io
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ao(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = g([t.class, r.class]));
		else if (e === "style") t.style = p([t.style, r.style]);
		else if (te(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(M(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !ne(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function oo(e, t, n, r = null) {
	fr(e, t, 7, [n, r]);
}
function so(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || yc, a = {
		uid: bc++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new dn(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Sa(r, i),
		emitsOptions: ua(r, i),
		emit: null,
		emitted: null,
		propsDefaults: E,
		inheritAttrs: r.inheritAttrs,
		ctx: E,
		data: E,
		props: E,
		attrs: E,
		slots: E,
		refs: E,
		setupState: E,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = la.bind(null, a), e.ce && e.ce(a), a;
}
function co(e) {
	return e.vnode.shapeFlag & 4;
}
function lo(e, t = !1, n = !1) {
	t && wc(t);
	let { props: r, children: i } = e.vnode, a = co(e);
	va(e, r, a, t), ic(e, i, n || t);
	let o = a ? uo(e, t) : void 0;
	return t && wc(!1), o;
}
function uo(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Rs);
	let { setup: r } = n;
	if (r) {
		ht();
		let n = e.setupContext = r.length > 1 ? ho(e) : null, i = Tc(e), a = dr(r, e, 0, [e.props, n]), o = le(a);
		if (gt(), i(), (o || e.sp) && !ys(e) && $r(e), o) {
			if (a.then(Ec, Ec), t) return a.then((n) => {
				fo(e, n, t);
			}).catch((t) => {
				pr(t, e, 0);
			});
			e.asyncDep = a;
		} else fo(e, a, t);
	} else mo(e, t);
}
function fo(e, t, n) {
	P(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : I(t) && (e.setupState = $t(t)), mo(e, n);
}
function po(e) {
	Oc = e, kc = (e) => {
		e.render._rc && (e.withProxy = new Proxy(e.ctx, zs));
	};
}
function mo(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && Oc && !r.render) {
			let t = r.template || Zi(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r, s = A(A({
					isCustomElement: n,
					delimiters: a
				}, i), o);
				r.render = Oc(t, s);
			}
		}
		e.render = r.render || O, kc && kc(e);
	}
	{
		let t = Tc(e);
		ht();
		try {
			qi(e);
		} finally {
			gt(), t();
		}
	}
}
function ho(e) {
	return {
		attrs: new Proxy(e.attrs, jc),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function go(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy($t(Kt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Is) return Is[n](e);
		},
		has(e, t) {
			return t in e || t in Is;
		}
	}) : e.proxy;
}
function _o(e, t = !0) {
	return P(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function vo(e) {
	return P(e) && "__vccOpts" in e;
}
function yo(e, t, n) {
	try {
		Ka(-1);
		let r = arguments.length;
		return r === 2 ? I(t) && !M(t) ? Ya(t) ? vc(e, null, [t]) : vc(e, t) : vc(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ya(n) && (n = [n]), vc(e, t, n));
	} finally {
		Ka(1);
	}
}
function bo() {
	return;
	function e(t, n, r) {
		let i = t[r];
		if (M(i) && i.includes(n) || I(i) && n in i || t.extends && e(t.extends, n, r) || t.mixins && t.mixins.some((t) => e(t, n, r))) return !0;
	}
}
function xo(e, t, n, r) {
	let i = n[r];
	if (i && So(i, e)) return i;
	let a = t();
	return a.memo = e.slice(), a.cacheIndex = r, n[r] = a;
}
function So(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (we(n[e], t[e])) return !1;
	return hc > 0 && mc && mc.push(e), !0;
}
var Co, wo, To, Eo, Do, Oo, ko, Ao, jo, Mo, No, Po, Fo, Io, Lo, Ro, zo, Bo, Vo, Ho, Uo, Wo, Go, Ko, qo, Jo, Yo, Xo, Zo, Qo, $o, es, ts, ns, rs, is, as, os, ss, cs, ls, us, ds, fs, ps, ms, hs, gs, _s, vs, ys, bs, xs, Ss, Cs, ws, Ts, Es, Ds, Os, ks, As, js, Ms, Ns, Ps, Fs, Is, Ls, Rs, zs, Bs, Vs, Hs, Us, Ws, Gs, Ks, qs, Js, Ys, Xs, Zs, Qs, $s, ec, tc, nc, rc, ic, ac, oc, sc, cc, lc, K, uc, dc, fc, pc, mc, hc, gc, _c, vc, yc, bc, xc, Sc, Cc, wc, Tc, Ec, Dc, Oc, kc, Ac, jc, q, Mc, Nc, Pc, Fc, Ic, Lc, Rc = o((() => {
	sr(), et(), Co = [], wo = {
		SETUP_FUNCTION: 0,
		0: "SETUP_FUNCTION",
		RENDER_FUNCTION: 1,
		1: "RENDER_FUNCTION",
		NATIVE_EVENT_HANDLER: 5,
		5: "NATIVE_EVENT_HANDLER",
		COMPONENT_EVENT_HANDLER: 6,
		6: "COMPONENT_EVENT_HANDLER",
		VNODE_HOOK: 7,
		7: "VNODE_HOOK",
		DIRECTIVE_HOOK: 8,
		8: "DIRECTIVE_HOOK",
		TRANSITION_HOOK: 9,
		9: "TRANSITION_HOOK",
		APP_ERROR_HANDLER: 10,
		10: "APP_ERROR_HANDLER",
		APP_WARN_HANDLER: 11,
		11: "APP_WARN_HANDLER",
		FUNCTION_REF: 12,
		12: "FUNCTION_REF",
		ASYNC_COMPONENT_LOADER: 13,
		13: "ASYNC_COMPONENT_LOADER",
		SCHEDULER: 14,
		14: "SCHEDULER",
		COMPONENT_UPDATE: 15,
		15: "COMPONENT_UPDATE",
		APP_UNMOUNT_CLEANUP: 16,
		16: "APP_UNMOUNT_CLEANUP"
	}, To = {
		sp: "serverPrefetch hook",
		bc: "beforeCreate hook",
		c: "created hook",
		bm: "beforeMount hook",
		m: "mounted hook",
		bu: "beforeUpdate hook",
		u: "updated",
		bum: "beforeUnmount hook",
		um: "unmounted hook",
		a: "activated hook",
		da: "deactivated hook",
		ec: "errorCaptured hook",
		rtc: "renderTracked hook",
		rtg: "renderTriggered hook",
		0: "setup function",
		1: "render function",
		2: "watcher getter",
		3: "watcher callback",
		4: "watcher cleanup function",
		5: "native event handler",
		6: "component event handler",
		7: "vnode hook",
		8: "directive hook",
		9: "transition hook",
		10: "app errorHandler",
		11: "app warnHandler",
		12: "ref function",
		13: "async component loader",
		14: "scheduler flush",
		15: "component update",
		16: "app unmount cleanup function"
	}, Eo = [], Do = -1, Oo = [], ko = null, Ao = 0, jo = /* @__PURE__ */ Promise.resolve(), Mo = null, No = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id, Fo = [], Io = null, Lo = null, Ro = (e) => Dr, zo = /* @__PURE__ */ Symbol.for("v-scx"), Bo = () => Ar(zo), Vo = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ Symbol("_vte"), Uo = (e) => e.__isTeleport, Wo = (e) => e && (e.disabled || e.disabled === ""), Go = (e) => e && (e.defer || e.defer === ""), Ko = (e) => typeof SVGElement < "u" && e instanceof SVGElement, qo = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Jo = (e, t) => {
		let n = e && e.to;
		return F(n) ? t ? t(n) : null : n;
	}, Yo = {
		name: "Teleport",
		__isTeleport: !0,
		process(e, t, n, r, i, a, o, s, c, l) {
			let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = Wo(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
				e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
			}, x = (e = t) => {
				let n = Wo(e.props), r = e.target = Jo(e.props, m), a = Hr(r, e, h, p);
				r && (o !== "svg" && Ko(r) ? o = "svg" : o !== "mathml" && qo(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), Vr(e, !1)));
			}, S = (e) => {
				let t = () => {
					if (Vo.get(e) === t) {
						if (Vo.delete(e), Wo(e.props)) {
							let t = _(e.el) || n;
							b(e, t, e.anchor), Vr(e, !0);
						}
						x(e);
					}
				};
				Vo.set(e, t), oc(t, a);
			};
			if (e == null) {
				let e = t.el = h(""), i = t.anchor = h("");
				if (p(e, n, r), p(i, n, r), Go(t.props) || a && a.pendingBranch) {
					S(t);
					return;
				}
				v && (b(t, n, i), Vr(t, !0)), x();
			} else {
				t.el = e.el;
				let r = t.anchor = e.anchor, u = Vo.get(e);
				if (u) {
					u.flags |= 8, Vo.delete(e), S(t);
					return;
				}
				t.targetStart = e.targetStart;
				let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = Wo(e.props), _ = g ? n : p, b = g ? r : h;
				if (o === "svg" || Ko(p) ? o = "svg" : (o === "mathml" || qo(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), Aa(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : zr(t, n, r, l, 1);
				else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
					let e = Jo(t.props, m);
					e && (t.target = e, zr(t, e, null, l, 0));
				} else g && zr(t, p, h, l, 1);
				Vr(t, v);
			}
		},
		remove(e, t, n, { um: r, o: { remove: i } }, a) {
			let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = Wo(f), m = a || !p, h = Vo.get(e);
			if (h && (h.flags |= 8, Vo.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
				let i = s[e];
				r(i, t, n, m, !!i.dynamicChildren);
			}
		},
		move: zr,
		hydrate: Br
	}, Xo = Yo, Zo = /* @__PURE__ */ Symbol("_leaveCb"), Qo = /* @__PURE__ */ Symbol("_enterCb"), $o = [Function, Array], es = {
		mode: String,
		appear: Boolean,
		persisted: Boolean,
		onBeforeEnter: $o,
		onEnter: $o,
		onAfterEnter: $o,
		onEnterCancelled: $o,
		onBeforeLeave: $o,
		onLeave: $o,
		onAfterLeave: $o,
		onLeaveCancelled: $o,
		onBeforeAppear: $o,
		onAppear: $o,
		onAfterAppear: $o,
		onAppearCancelled: $o
	}, ts = (e) => {
		let t = e.subTree;
		return t.component ? ts(t.component) : t;
	}, ns = {
		name: "BaseTransition",
		props: es,
		setup(e, { slots: t }) {
			let n = Sc(), r = Ur();
			return () => {
				let i = t.default && Xr(t.default(), !0), a = i && i.length ? Wr(i) : n.subTree ? G() : void 0;
				if (!a) return;
				let o = /* @__PURE__ */ Gt(e), { mode: s } = o;
				if (r.isLeaving) return qr(a);
				let c = Jr(a);
				if (!c) return qr(a);
				let l = Kr(c, o, r, n, (e) => l = e);
				c.type !== dc && Yr(c, l);
				let u = n.subTree && Jr(n.subTree);
				if (u && u.type !== dc && !Xa(u, c) && ts(n).type !== dc) {
					let e = Kr(u, o, r, n);
					if (Yr(u, e), s === "out-in" && c.type !== dc) return r.isLeaving = !0, e.afterLeave = () => {
						r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
					}, qr(a);
					s === "in-out" && c.type !== dc ? e.delayLeave = (e, t, n) => {
						let i = Gr(r, u);
						i[String(u.key)] = u, e[Zo] = () => {
							t(), e[Zo] = void 0, delete l.delayedLeave, u = void 0;
						}, l.delayedLeave = () => {
							n(), delete l.delayedLeave, u = void 0;
						};
					} : u = void 0;
				} else u &&= void 0;
				return a;
			};
		}
	}, rs = ns, is = /* @__PURE__ */ new WeakMap(), as = !1, os = () => {
		as ||= (console.error("Hydration completed but contains mismatches."), !0);
	}, ss = (e) => e.namespaceURI.includes("svg") && e.tagName !== "foreignObject", cs = (e) => e.namespaceURI.includes("MathML"), ls = (e) => {
		if (e.nodeType === 1) {
			if (ss(e)) return "svg";
			if (cs(e)) return "mathml";
		}
	}, us = (e) => e.nodeType === 8, ds = "data-allow-mismatch", fs = {
		0: "text",
		1: "children",
		2: "class",
		3: "style",
		4: "attribute"
	}, ps = Ae().requestIdleCallback || ((e) => setTimeout(e, 1)), ms = Ae().cancelIdleCallback || ((e) => clearTimeout(e)), hs = (e = 1e4) => (t) => {
		let n = ps(t, { timeout: e });
		return () => ms(n);
	}, gs = (e) => (t, n) => {
		let r = new IntersectionObserver((e) => {
			for (let n of e) if (n.isIntersecting) {
				r.disconnect(), t();
				break;
			}
		}, e);
		return n((e) => {
			if (e instanceof Element) {
				if (ui(e)) return t(), r.disconnect(), !1;
				r.observe(e);
			}
		}), () => r.disconnect();
	}, _s = (e) => (t) => {
		if (e) {
			let n = matchMedia(e);
			if (n.matches) t();
			else return n.addEventListener("change", t, { once: !0 }), () => n.removeEventListener("change", t);
		}
	}, vs = (e = []) => (t, n) => {
		F(e) && (e = [e]);
		let r = !1, i = (e) => {
			r || (r = !0, a(), t(), e.target.dispatchEvent(new e.constructor(e.type, e)));
		}, a = () => {
			n((t) => {
				for (let n of e) t.removeEventListener(n, i);
			});
		};
		return n((t) => {
			for (let n of e) t.addEventListener(n, i, { once: !0 });
		}), a;
	}, ys = (e) => !!e.type.__asyncLoader, bs = (e) => e.type.__isKeepAlive, xs = {
		name: "KeepAlive",
		__isKeepAlive: !0,
		props: {
			include: [
				String,
				RegExp,
				Array
			],
			exclude: [
				String,
				RegExp,
				Array
			],
			max: [String, Number]
		},
		setup(e, { slots: t }) {
			let n = Sc(), r = n.ctx;
			if (!r.renderer) return () => {
				let e = t.default && t.default();
				return e && e.length === 1 ? e[0] : e;
			};
			let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
			r.activate = (e, t, n, r, i) => {
				let a = e.component;
				l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), oc(() => {
					a.isDeactivated = !1, a.a && Te(a.a);
					let t = e.props && e.props.onVnodeMounted;
					t && oo(t, a.parent, e);
				}, s);
			}, r.deactivate = (e) => {
				let t = e.component;
				Na(t.m), Na(t.a), l(e, f, null, 1, s), oc(() => {
					t.da && Te(t.da);
					let n = e.props && e.props.onVnodeUnmounted;
					n && oo(n, t.parent, e), t.isDeactivated = !0;
				}, s);
			};
			function p(e) {
				yi(e), u(e, n, s, !0);
			}
			function m(e) {
				i.forEach((t, n) => {
					let r = _o(ys(t) ? t.type.__asyncResolved || {} : t.type);
					r && !e(r) && h(n);
				});
			}
			function h(e) {
				let t = i.get(e);
				t && (!o || !Xa(t, o)) ? p(t) : o && yi(o), i.delete(e), a.delete(e);
			}
			Fr(() => [e.include, e.exclude], ([e, t]) => {
				e && m((t) => mi(e, t)), t && m((e) => !mi(t, e));
			}, {
				flush: "post",
				deep: !0
			});
			let g = null, _ = () => {
				g != null && (sc(n.subTree.type) ? oc(() => {
					i.set(g, bi(n.subTree));
				}, n.subTree.suspense) : i.set(g, bi(n.subTree)));
			};
			return ws(_), Es(_), Ds(() => {
				i.forEach((e) => {
					let { subTree: t, suspense: r } = n, i = bi(t);
					if (e.type === i.type && e.key === i.key) {
						yi(i);
						let e = i.component.da;
						e && oc(e, r);
						return;
					}
					p(e);
				});
			}), () => {
				if (g = null, !t.default) return o = null;
				let n = t.default(), r = n[0];
				if (n.length > 1) return o = null, n;
				if (!Ya(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
				let s = bi(r);
				if (s.type === dc) return o = null, s;
				let c = s.type, l = _o(ys(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
				if (u && (!l || !mi(u, l)) || d && l && mi(d, l)) return s.shapeFlag &= -257, o = s, r;
				let p = s.key == null ? c : s.key, m = i.get(p);
				return s.el && (s = eo(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Yr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, sc(r.type) ? r : s;
			};
		}
	}, Ss = (e) => (t, n = xc) => {
		(!Dc || e === "sp") && xi(e, (...e) => t(...e), n);
	}, Cs = Ss("bm"), ws = Ss("m"), Ts = Ss("bu"), Es = Ss("u"), Ds = Ss("bum"), Os = Ss("um"), ks = Ss("sp"), As = Ss("rtg"), js = Ss("rtc"), Ms = "components", Ns = "directives", Ps = /* @__PURE__ */ Symbol.for("v-ndc"), Fs = (e) => e ? co(e) ? go(e) : Fs(e.parent) : null, Is = /* @__PURE__ */ A(/* @__PURE__ */ Object.create(null), {
		$: (e) => e,
		$el: (e) => e.vnode.el,
		$data: (e) => e.data,
		$props: (e) => e.props,
		$attrs: (e) => e.attrs,
		$slots: (e) => e.slots,
		$refs: (e) => e.refs,
		$parent: (e) => Fs(e.parent),
		$root: (e) => Fs(e.root),
		$host: (e) => e.ce,
		$emit: (e) => e.emit,
		$options: (e) => Zi(e),
		$forceUpdate: (e) => e.f ||= () => {
			_r(e.update);
		},
		$nextTick: (e) => e.n ||= hr.bind(e.proxy),
		$watch: (e) => Lr.bind(e)
	}), Ls = (e, t) => e !== E && !e.__isScriptSetup && j(e, t), Rs = {
		get({ _: e }, t) {
			if (t === "__v_skip") return !0;
			let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
			if (t[0] !== "$") {
				let e = o[t];
				if (e !== void 0) switch (e) {
					case 1: return r[t];
					case 2: return i[t];
					case 4: return n[t];
					case 3: return a[t];
				}
				else if (Ls(r, t)) return o[t] = 1, r[t];
				else if (i !== E && j(i, t)) return o[t] = 2, i[t];
				else if (j(a, t)) return o[t] = 3, a[t];
				else if (n !== E && j(n, t)) return o[t] = 4, n[t];
				else Bs && (o[t] = 0);
			}
			let l = Is[t], u, d;
			if (l) return t === "$attrs" && yt(e.attrs, "get", ""), l(e);
			if ((u = s.__cssModules) && (u = u[t])) return u;
			if (n !== E && j(n, t)) return o[t] = 4, n[t];
			if (d = c.config.globalProperties, j(d, t)) return d[t];
		},
		set({ _: e }, t, n) {
			let { data: r, setupState: i, ctx: a } = e;
			return Ls(i, t) ? (i[t] = n, !0) : r !== E && j(r, t) ? (r[t] = n, !0) : j(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
		},
		has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
			let c;
			return !!(n[s] || e !== E && s[0] !== "$" && j(e, s) || Ls(t, s) || j(a, s) || j(r, s) || j(Is, s) || j(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
		},
		defineProperty(e, t, n) {
			return n.get == null ? j(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
		}
	}, zs = /* @__PURE__ */ A({}, Rs, {
		get(e, t) {
			if (t !== Symbol.unscopables) return Rs.get(e, t, e);
		},
		has(e, t) {
			return t[0] !== "_" && !je(t);
		}
	}), Bs = !0, Vs = {
		data: $i,
		props: ia,
		emits: ia,
		methods: ra,
		computed: ra,
		beforeCreate: na,
		created: na,
		beforeMount: na,
		mounted: na,
		beforeUpdate: na,
		updated: na,
		beforeDestroy: na,
		beforeUnmount: na,
		destroyed: na,
		unmounted: na,
		activated: na,
		deactivated: na,
		errorCaptured: na,
		serverPrefetch: na,
		components: ra,
		directives: ra,
		watch: aa,
		provide: $i,
		inject: ea
	}, Hs = 0, Us = null, Ws = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ye(t)}Modifiers`] || e[`${xe(t)}Modifiers`], Gs = /* @__PURE__ */ new WeakMap(), Ks = (e) => {
		let t;
		for (let n in e) (n === "class" || n === "style" || te(n)) && ((t ||= {})[n] = e[n]);
		return t;
	}, qs = (e, t) => {
		let n = {};
		for (let r in e) (!ne(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
		return n;
	}, Js = {}, Ys = () => Object.create(Js), Xs = (e) => Object.getPrototypeOf(e) === Js, Zs = /* @__PURE__ */ new WeakMap(), Qs = (e) => e === "_" || e === "_ctx" || e === "$stable", $s = (e) => M(e) ? e.map(no) : [no(e)], ec = (e, t, n) => {
		if (t._n) return t;
		let r = Dr((...e) => $s(t(...e)), n);
		return r._c = !1, r;
	}, tc = (e, t, n) => {
		let r = e._ctx;
		for (let n in e) {
			if (Qs(n)) continue;
			let i = e[n];
			if (P(i)) t[n] = ec(n, i, r);
			else if (i != null) {
				let e = $s(i);
				t[n] = () => e;
			}
		}
	}, nc = (e, t) => {
		let n = $s(t);
		e.slots.default = () => n;
	}, rc = (e, t, n) => {
		for (let r in t) (n || !Qs(r)) && (e[r] = t[r]);
	}, ic = (e, t, n) => {
		let r = e.slots = Ys();
		if (e.vnode.shapeFlag & 32) {
			let e = t._;
			e ? (rc(r, t, n), n && Ee(r, "_", e, !0)) : tc(t, r);
		} else t && nc(e, t);
	}, ac = (e, t, n) => {
		let { vnode: r, slots: i } = e, a = !0, o = E;
		if (r.shapeFlag & 32) {
			let e = t._;
			e ? n && e === 1 ? a = !1 : rc(i, t, n) : (a = !t.$stable, tc(t, i)), o = t;
		} else t && (nc(e, t), o = { default: 1 });
		if (a) for (let e in i) !Qs(e) && o[e] == null && delete i[e];
	}, oc = Ha, sc = (e) => e.__isSuspense, cc = 0, lc = {
		name: "Suspense",
		__isSuspense: !0,
		process(e, t, n, r, i, a, o, s, c, l) {
			if (e == null) Ia(t, n, r, i, a, o, s, c, l);
			else {
				if (a && a.deps > 0 && !e.suspense.isInFallback) {
					t.suspense = e.suspense, t.suspense.vnode = t, t.el = e.el;
					return;
				}
				La(e, t, n, r, i, o, s, c, l);
			}
		},
		hydrate: za,
		normalize: Ba
	}, K = /* @__PURE__ */ Symbol.for("v-fgt"), uc = /* @__PURE__ */ Symbol.for("v-txt"), dc = /* @__PURE__ */ Symbol.for("v-cmt"), fc = /* @__PURE__ */ Symbol.for("v-stc"), pc = [], mc = null, hc = 1, gc = ({ key: e }) => e ?? null, _c = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : F(e) || /* @__PURE__ */ qt(e) || P(e) ? {
		i: Io,
		r: e,
		k: t,
		f: !!n
	} : e), vc = Qa, yc = oa(), bc = 0, xc = null, Sc = () => xc || Io;
	{
		let e = Ae(), t = (t, n) => {
			let r;
			return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
				r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
			};
		};
		Cc = t("__VUE_INSTANCE_SETTERS__", (e) => xc = e), wc = t("__VUE_SSR_SETTERS__", (e) => Dc = e);
	}
	Tc = (e) => {
		let t = xc;
		return Cc(e), e.scope.on(), () => {
			e.scope.off(), Cc(t);
		};
	}, Ec = () => {
		xc && xc.scope.off(), Cc(null);
	}, Dc = !1, Ac = () => !Oc, jc = { get(e, t) {
		return yt(e, "get", ""), e[t];
	} }, q = (e, t) => /* @__PURE__ */ an(e, t, Dc), Mc = "3.5.39", Nc = O, Pc = To, Fc = Po, Ic = Cr, Lc = {
		createComponentInstance: so,
		setupComponent: lo,
		renderComponentRoot: fa,
		setCurrentRenderingInstance: wr,
		isVNode: Ya,
		normalizeVNode: no,
		getComponentPublicInstance: go,
		ensureValidVNode: Ai,
		pushWarningContext: cr,
		popWarningContext: lr
	};
})), zc = /* @__PURE__ */ c({
	BaseTransition: () => rs,
	BaseTransitionPropsValidators: () => es,
	Comment: () => dc,
	DeprecationTypes: () => null,
	EffectScope: () => dn,
	ErrorCodes: () => wo,
	ErrorTypeStrings: () => Pc,
	Fragment: () => K,
	KeepAlive: () => xs,
	ReactiveEffect: () => mn,
	Static: () => fc,
	Suspense: () => lc,
	Teleport: () => Xo,
	Text: () => uc,
	TrackOpTypes: () => nr,
	Transition: () => $l,
	TransitionGroup: () => ku,
	TriggerOpTypes: () => rr,
	VueElement: () => Cu,
	assertNumber: () => ur,
	callWithAsyncErrorHandling: () => fr,
	callWithErrorHandling: () => dr,
	camelize: () => ye,
	capitalize: () => Se,
	cloneVNode: () => eo,
	compatUtils: () => null,
	computed: () => q,
	createApp: () => Gu,
	createBlock: () => Ja,
	createCommentVNode: () => G,
	createElementBlock: () => H,
	createElementVNode: () => U,
	createHydrationRenderer: () => Ta,
	createPropsRestProxy: () => Gi,
	createRenderer: () => wa,
	createSSRApp: () => Ku,
	createSlots: () => Oi,
	createStaticVNode: () => to,
	createTextVNode: () => W,
	createVNode: () => vc,
	customRef: () => en,
	defineAsyncComponent: () => fi,
	defineComponent: () => Zr,
	defineCustomElement: () => gl,
	defineEmits: () => Ni,
	defineExpose: () => Pi,
	defineModel: () => Li,
	defineOptions: () => Fi,
	defineProps: () => Mi,
	defineSSRCustomElement: () => xu,
	defineSlots: () => Ii,
	devtools: () => Fc,
	effect: () => pt,
	effectScope: () => tt,
	getCurrentInstance: () => Sc,
	getCurrentScope: () => nt,
	getCurrentWatcher: () => on,
	getTransitionRawChildren: () => Xr,
	guardReactiveProps: () => $a,
	h: () => yo,
	handleError: () => pr,
	hasInjectionContext: () => jr,
	hydrate: () => Wu,
	hydrateOnIdle: () => hs,
	hydrateOnInteraction: () => vs,
	hydrateOnMediaQuery: () => _s,
	hydrateOnVisible: () => gs,
	initCustomFormatter: () => bo,
	initDirectivesForSSR: () => Ju,
	inject: () => Ar,
	isMemoSame: () => So,
	isProxy: () => Wt,
	isReactive: () => Vt,
	isReadonly: () => Ht,
	isRef: () => qt,
	isRuntimeOnly: () => Ac,
	isShallow: () => Ut,
	isVNode: () => Ya,
	markRaw: () => Kt,
	mergeDefaults: () => Ui,
	mergeModels: () => Wi,
	mergeProps: () => ao,
	nextTick: () => hr,
	nodeOps: () => Kl,
	normalizeClass: () => g,
	normalizeProps: () => _,
	normalizeStyle: () => p,
	onActivated: () => hi,
	onBeforeMount: () => Cs,
	onBeforeUnmount: () => Ds,
	onBeforeUpdate: () => Ts,
	onDeactivated: () => gi,
	onErrorCaptured: () => Si,
	onMounted: () => ws,
	onRenderTracked: () => js,
	onRenderTriggered: () => As,
	onScopeDispose: () => rt,
	onServerPrefetch: () => ks,
	onUnmounted: () => Os,
	onUpdated: () => Es,
	onWatcherCleanup: () => sn,
	openBlock: () => V,
	patchProp: () => yu,
	popScopeId: () => Er,
	provide: () => kr,
	proxyRefs: () => $t,
	pushScopeId: () => Tr,
	queuePostFlushCb: () => yr,
	reactive: () => It,
	readonly: () => Rt,
	ref: () => R,
	registerRuntimeCompiler: () => po,
	render: () => Uu,
	renderList: () => B,
	renderSlot: () => ki,
	resolveComponent: () => Ci,
	resolveDirective: () => Ti,
	resolveDynamicComponent: () => wi,
	resolveFilter: () => null,
	resolveTransitionHooks: () => Kr,
	setBlockTracking: () => Ka,
	setDevtoolsHook: () => Ic,
	setTransitionHooks: () => Yr,
	shallowReactive: () => Lt,
	shallowReadonly: () => zt,
	shallowRef: () => Jt,
	ssrContextKey: () => zo,
	ssrUtils: () => Lc,
	stop: () => mt,
	toDisplayString: () => L,
	toHandlerKey: () => Ce,
	toHandlers: () => ji,
	toRaw: () => Gt,
	toRef: () => nn,
	toRefs: () => tn,
	toValue: () => Qt,
	transformVNodeArgs: () => Za,
	triggerRef: () => Xt,
	unref: () => Zt,
	useAttrs: () => Bi,
	useCssModule: () => yl,
	useCssVars: () => el,
	useHost: () => _l,
	useId: () => Qr,
	useModel: () => ca,
	useSSRContext: () => Bo,
	useShadowRoot: () => vl,
	useSlots: () => zi,
	useTemplateRef: () => ei,
	useTransitionState: () => Ur,
	vModelCheckbox: () => Mu,
	vModelDynamic: () => Pu,
	vModelRadio: () => Nu,
	vModelSelect: () => Y,
	vModelText: () => J,
	vShow: () => au,
	version: () => Mc,
	warn: () => Nc,
	watch: () => Fr,
	watchEffect: () => Mr,
	watchPostEffect: () => Nr,
	watchSyncEffect: () => Pr,
	withAsyncContext: () => Ki,
	withCtx: () => Dr,
	withDefaults: () => Ri,
	withDirectives: () => z,
	withKeys: () => zu,
	withMemo: () => xo,
	withModifiers: () => Lu,
	withScopeId: () => Ro
});
function Bc(e) {
	let t = {};
	for (let n in e) n in Xl || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = Vc(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: C = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, Wc(e, t ? u : s), Wc(e, t ? l : o), n && n();
	}, T = (e, t) => {
		e._isLeaving = !1, Wc(e, d), Wc(e, p), Wc(e, f), t && t();
	}, E = (e) => (t, n) => {
		let i = e ? ee : v, o = () => w(t, e, n);
		eu(i, [t, o]), Gc(() => {
			Wc(t, e ? c : a), Uc(t, e ? u : s), tu(i) || Kc(t, r, h, o);
		});
	};
	return A(t, {
		onBeforeEnter(e) {
			eu(_, [e]), Uc(e, a), Uc(e, o);
		},
		onBeforeAppear(e) {
			eu(S, [e]), Uc(e, c), Uc(e, l);
		},
		onEnter: E(!1),
		onAppear: E(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => T(e, t);
			Uc(e, d), e._enterCancelled ? (Uc(e, f), Xc(e)) : (Xc(e), Uc(e, f)), Gc(() => {
				e._isLeaving && (Wc(e, d), Uc(e, p), tu(b) || Kc(e, r, g, n));
			}), eu(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), eu(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), eu(C, [e]);
		},
		onLeaveCancelled(e) {
			T(e), eu(x, [e]);
		}
	});
}
function Vc(e) {
	if (e == null) return null;
	if (I(e)) return [Hc(e.enter), Hc(e.leave)];
	{
		let t = Hc(e);
		return [t, t];
	}
}
function Hc(e) {
	return Oe(e);
}
function Uc(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Yl] || (e[Yl] = /* @__PURE__ */ new Set())).add(t);
}
function Wc(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Yl];
	n && (n.delete(t), n.size || (e[Yl] = void 0));
}
function Gc(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
function Kc(e, t, n, r) {
	let i = e._endId = ++nu, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = qc(e, t);
	if (!o) return r();
	let l = o + "end", u = 0, d = () => {
		e.removeEventListener(l, f), a();
	}, f = (t) => {
		t.target === e && ++u >= c && d();
	};
	setTimeout(() => {
		u < c && d();
	}, s + 1), e.addEventListener(l, f);
}
function qc(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${ql}Delay`), a = r(`${ql}Duration`), o = Jc(i, a), s = r(`${Jl}Delay`), c = r(`${Jl}Duration`), l = Jc(s, c), u = null, d = 0, f = 0;
	t === ql ? o > 0 && (u = ql, d = o, f = a.length) : t === Jl ? l > 0 && (u = Jl, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? ql : Jl : null, f = u ? u === ql ? a.length : c.length : 0);
	let p = u === ql && /\b(?:transform|all)(?:,|$)/.test(r(`${ql}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function Jc(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => Yc(t) + Yc(e[n])));
}
function Yc(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Xc(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Zc(e, t, n) {
	let r = e[Yl];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
function Qc(e, t) {
	e.style.display = t ? e[ru] : "none", e[iu] = !t;
}
function $c() {
	au.getSSRProps = ({ value: e }) => {
		if (!e) return { style: { display: "none" } };
	};
}
function el(e) {
	let t = Sc();
	if (!t) return;
	let n = t.ut = (n = e(t.proxy)) => {
		Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach((e) => nl(e, n));
	}, r = () => {
		let r = e(t.proxy);
		t.ce ? nl(t.ce, r) : tl(t.subTree, r), n(r);
	};
	Ts(() => {
		yr(r);
	}), ws(() => {
		Fr(r, O, { flush: "post" });
		let e = new MutationObserver(r);
		e.observe(t.subTree.el.parentNode, { childList: !0 }), Os(() => e.disconnect());
	});
}
function tl(e, t) {
	if (e.shapeFlag & 128) {
		let n = e.suspense;
		e = n.activeBranch, n.pendingBranch && !n.isHydrating && n.effects.push(() => {
			tl(n.activeBranch, t);
		});
	}
	for (; e.component;) e = e.component.subTree;
	if (e.shapeFlag & 1 && e.el) nl(e.el, t);
	else if (e.type === K) e.children.forEach((e) => tl(e, t));
	else if (e.type === fc) {
		let { el: n, anchor: r } = e;
		for (; n && (nl(n, t), n !== r);) n = n.nextSibling;
	}
}
function nl(e, t) {
	if (e.nodeType === 1) {
		let n = e.style, r = "";
		for (let e in t) {
			let i = T(t[e]);
			n.setProperty(`--${e}`, i), r += `--${e}: ${i};`;
		}
		n[ou] = r;
	}
}
function rl(e, t, n) {
	let r = e.style, i = F(n), a = !1;
	if (n && !i) {
		if (t) if (F(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? il(r, t, "");
		}
		else for (let e in t) n[e] ?? il(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? il(r, i, "") : ol(e, i, !F(t) && t ? t[i] : void 0, o) || il(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ou];
			e && (n += ";" + e), r.cssText = n, a = su.test(n);
		}
	} else t && e.removeAttribute("style");
	ru in e && (e[ru] = a ? r.display : "", e[iu] && (r.display = "none"));
}
function il(e, t, n) {
	if (M(n)) n.forEach((n) => il(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = al(e, t);
		cu.test(n) ? e.setProperty(xe(r), n.replace(cu, ""), "important") : e[r] = n;
	}
}
function al(e, t) {
	let n = uu[t];
	if (n) return n;
	let r = ye(t);
	if (r !== "filter" && r in e) return uu[t] = r;
	r = Se(r);
	for (let n = 0; n < lu.length; n++) {
		let i = lu[n] + r;
		if (i in e) return uu[t] = i;
	}
	return t;
}
function ol(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && F(r) && n === r;
}
function sl(e, t, n, r, i, a = We(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(du, t.slice(6, t.length)) : e.setAttributeNS(du, t, n) : n == null || a && !v(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : ce(n) ? String(n) : n);
}
function cl(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Vl(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = v(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ll(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ul(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
function dl(e, t, n, r, i = null) {
	let a = e[fu] || (e[fu] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = fl(t);
		r ? ll(e, n, a[t] = pl(r, i), s) : o && (ul(e, n, o, s), a[t] = void 0);
	}
}
function fl(e) {
	let t, n;
	for (; (n = e.match(pu)) && !mu.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : xe(e.slice(2)), t];
}
function pl(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (M(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && fr(e, t, 5, a);
			}
		} else fr(r, t, 5, [e]);
	};
	return n.value = e, n.attached = _u(), n;
}
function ml(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && vu(t) && P(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return vu(t) && F(n) ? !1 : t in e;
}
function hl(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ye(t);
	return Array.isArray(n) ? n.some((e) => ye(e) === r) : Object.keys(n).some((e) => ye(e) === r);
}
// @__NO_SIDE_EFFECTS__
function gl(e, t, n) {
	let r = /* @__PURE__ */ Zr(e, t);
	pe(r) && (r = A({}, r, t));
	class i extends Cu {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
function _l(e) {
	let t = Sc();
	return t && t.ce || null;
}
function vl() {
	let e = _l();
	return e && e.shadowRoot;
}
function yl(e = "$style") {
	{
		let t = Sc();
		if (!t) return E;
		let n = t.type.__cssModules;
		return n && n[e] || E;
	}
}
function bl(e) {
	let t = e.el;
	t[Eu] && t[Eu](), t[Du] && t[Du]();
}
function xl(e) {
	Tu.set(e, Cl(e.el));
}
function Sl(e) {
	let t = wu.get(e), n = Tu.get(e), r = t.left - n.left, i = t.top - n.top;
	if (r || i) {
		let t = e.el, n = t.style, a = t.getBoundingClientRect(), o = 1, s = 1;
		return t.offsetWidth && (o = a.width / t.offsetWidth), t.offsetHeight && (s = a.height / t.offsetHeight), (!Number.isFinite(o) || o === 0) && (o = 1), (!Number.isFinite(s) || s === 0) && (s = 1), Math.abs(o - 1) < .01 && (o = 1), Math.abs(s - 1) < .01 && (s = 1), n.transform = n.webkitTransform = `translate(${r / o}px,${i / s}px)`, n.transitionDuration = "0s", e;
	}
}
function Cl(e) {
	let t = e.getBoundingClientRect();
	return {
		left: t.left,
		top: t.top
	};
}
function wl(e, t, n) {
	let r = e.cloneNode(), i = e[Yl];
	i && i.forEach((e) => {
		e.split(/\s+/).forEach((e) => e && r.classList.remove(e));
	}), n.split(/\s+/).forEach((e) => e && r.classList.add(e)), r.style.display = "none";
	let a = t.nodeType === 1 ? t : t.parentNode;
	a.appendChild(r);
	let { hasTransform: o } = qc(r);
	return a.removeChild(r), o;
}
function Tl(e) {
	e.target.composing = !0;
}
function El(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
function Dl(e, t, n) {
	return t && (e = e.trim()), n && (e = De(e)), e;
}
function Ol(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (M(t)) i = w(t, r.props.value) > -1;
	else if (N(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = C(t, jl(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
function kl(e, t) {
	let n = e.multiple, r = M(t);
	if (!(n && !r && !N(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Al(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = w(t, o) > -1;
			} else a.selected = t.has(o);
			else if (C(Al(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Al(e) {
	return "_value" in e ? e._value : e.value;
}
function jl(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
function Ml(e, t) {
	switch (e) {
		case "SELECT": return Y;
		case "TEXTAREA": return J;
		default: switch (t) {
			case "checkbox": return Mu;
			case "radio": return Nu;
			default: return J;
		}
	}
}
function Nl(e, t, n, r, i) {
	let a = Ml(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
function Pl() {
	J.getSSRProps = ({ value: e }) => ({ value: e }), Nu.getSSRProps = ({ value: e }, t) => {
		if (t.props && C(t.props.value, e)) return { checked: !0 };
	}, Mu.getSSRProps = ({ value: e }, t) => {
		if (M(e)) {
			if (t.props && w(e, t.props.value) > -1) return { checked: !0 };
		} else if (N(e)) {
			if (t.props && e.has(t.props.value)) return { checked: !0 };
		} else if (e) return { checked: !0 };
	}, Pu.getSSRProps = (e, t) => {
		if (typeof t.type != "string") return;
		let n = Ml(t.type.toUpperCase(), t.props && t.props.type);
		if (n.getSSRProps) return n.getSSRProps(e, t);
	};
}
function Fl() {
	return Vu ||= wa(Bu);
}
function Il() {
	return Vu = Hu ? Vu : Ta(Bu), Hu = !0, Vu;
}
function Ll(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Rl(e) {
	return F(e) ? document.querySelector(e) : e;
}
var zl, Bl, Vl, Hl, Ul, Wl, Gl, Kl, ql, Jl, Yl, Xl, Zl, Ql, $l, eu, tu, nu, ru, iu, au, ou, su, cu, lu, uu, du, fu, pu, mu, hu, gu, _u, vu, yu, bu, xu, Su, Cu, wu, Tu, Eu, Du, Ou, ku, Au, ju, J, Mu, Nu, Y, Pu, Fu, Iu, Lu, Ru, zu, Bu, Vu, Hu, Uu, Wu, Gu, Ku, qu, Ju, Yu = o((() => {
	if (Rc(), Rc(), et(), zl = void 0, Bl = typeof window < "u" && window.trustedTypes, Bl) try {
		zl = /* @__PURE__ */ Bl.createPolicy("vue", { createHTML: (e) => e });
	} catch {}
	Vl = zl ? (e) => zl.createHTML(e) : (e) => e, Hl = "http://www.w3.org/2000/svg", Ul = "http://www.w3.org/1998/Math/MathML", Wl = typeof document < "u" ? document : null, Gl = Wl && /* @__PURE__ */ Wl.createElement("template"), Kl = {
		insert: (e, t, n) => {
			t.insertBefore(e, n || null);
		},
		remove: (e) => {
			let t = e.parentNode;
			t && t.removeChild(e);
		},
		createElement: (e, t, n, r) => {
			let i = t === "svg" ? Wl.createElementNS(Hl, e) : t === "mathml" ? Wl.createElementNS(Ul, e) : n ? Wl.createElement(e, { is: n }) : Wl.createElement(e);
			return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
		},
		createText: (e) => Wl.createTextNode(e),
		createComment: (e) => Wl.createComment(e),
		setText: (e, t) => {
			e.nodeValue = t;
		},
		setElementText: (e, t) => {
			e.textContent = t;
		},
		parentNode: (e) => e.parentNode,
		nextSibling: (e) => e.nextSibling,
		querySelector: (e) => Wl.querySelector(e),
		setScopeId(e, t) {
			e.setAttribute(t, "");
		},
		insertStaticContent(e, t, n, r, i, a) {
			let o = n ? n.previousSibling : t.lastChild;
			if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
			else {
				Gl.innerHTML = Vl(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
				let i = Gl.content;
				if (r === "svg" || r === "mathml") {
					let e = i.firstChild;
					for (; e.firstChild;) i.appendChild(e.firstChild);
					i.removeChild(e);
				}
				t.insertBefore(i, n);
			}
			return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
		}
	}, ql = "transition", Jl = "animation", Yl = /* @__PURE__ */ Symbol("_vtc"), Xl = {
		name: String,
		type: String,
		css: {
			type: Boolean,
			default: !0
		},
		duration: [
			String,
			Number,
			Object
		],
		enterFromClass: String,
		enterActiveClass: String,
		enterToClass: String,
		appearFromClass: String,
		appearActiveClass: String,
		appearToClass: String,
		leaveFromClass: String,
		leaveActiveClass: String,
		leaveToClass: String
	}, Zl = /* @__PURE__ */ A({}, es, Xl), Ql = (e) => (e.displayName = "Transition", e.props = Zl, e), $l = /* @__PURE__ */ Ql((e, { slots: t }) => yo(rs, Bc(e), t)), eu = (e, t = []) => {
		M(e) ? e.forEach((e) => e(...t)) : e && e(...t);
	}, tu = (e) => e ? M(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1, nu = 0, ru = /* @__PURE__ */ Symbol("_vod"), iu = /* @__PURE__ */ Symbol("_vsh"), au = {
		name: "show",
		beforeMount(e, { value: t }, { transition: n }) {
			e[ru] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Qc(e, t);
		},
		mounted(e, { value: t }, { transition: n }) {
			n && t && n.enter(e);
		},
		updated(e, { value: t, oldValue: n }, { transition: r }) {
			!t != !n && (r ? t ? (r.beforeEnter(e), Qc(e, !0), r.enter(e)) : r.leave(e, () => {
				Qc(e, !1);
			}) : Qc(e, t));
		},
		beforeUnmount(e, { value: t }) {
			Qc(e, t);
		}
	}, ou = /* @__PURE__ */ Symbol(""), su = /(?:^|;)\s*display\s*:/, cu = /\s*!important$/, lu = [
		"Webkit",
		"Moz",
		"ms"
	], uu = {}, du = "http://www.w3.org/1999/xlink", fu = /* @__PURE__ */ Symbol("_vei"), pu = /(Once|Passive|Capture)$/, mu = /^on:?(?:Once|Passive|Capture)$/, hu = 0, gu = /* @__PURE__ */ Promise.resolve(), _u = () => hu ||= (gu.then(() => hu = 0), Date.now()), vu = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, yu = (e, t, n, r, i, a) => {
		let o = i === "svg";
		t === "class" ? Zc(e, r, o) : t === "style" ? rl(e, n, r) : te(t) ? ne(t) || dl(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : ml(e, t, r, o)) ? (cl(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && sl(e, t, r, o, a, t !== "value")) : e._isVueCE && (hl(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !F(r))) ? cl(e, ye(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), sl(e, t, r, o));
	}, bu = {}, xu = /* @__NO_SIDE_EFFECTS__ */ ((e, t) => /* @__PURE__ */ gl(e, t, Ku)), Su = typeof HTMLElement < "u" ? HTMLElement : class {}, Cu = class e extends Su {
		constructor(e, t = {}, n = Gu) {
			super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== Gu ? this._root = this.shadowRoot : e.shadowRoot === !1 ? this._root = this : (this.attachShadow(A({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot);
		}
		connectedCallback() {
			if (!this.isConnected) return;
			!this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
			let t = this;
			for (; t &&= t.assignedSlot || t.parentNode || t.host;) if (t instanceof e) {
				this._parent = t;
				break;
			}
			this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
				this._pendingResolve = void 0, this._resolveDef();
			}) : this._resolveDef());
		}
		_setParent(e = this._parent) {
			e && (this._instance.parent = e._instance, this._inheritParentContext(e));
		}
		_inheritParentContext(e = this._parent) {
			e && this._app && Object.setPrototypeOf(this._app._context.provides, e._instance.provides);
		}
		disconnectedCallback() {
			this._connected = !1, hr(() => {
				this._connected || (this._ob &&= (this._ob.disconnect(), null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets &&= (this._teleportTargets.clear(), void 0));
			});
		}
		_processMutations(e) {
			for (let t of e) this._setAttr(t.attributeName);
		}
		_resolveDef() {
			if (this._pendingResolve) return;
			for (let e = 0; e < this.attributes.length; e++) this._setAttr(this.attributes[e].name);
			this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
			let e = (e, t = !1) => {
				this._resolved = !0, this._pendingResolve = void 0;
				let { props: n, styles: r } = e, i;
				if (n && !M(n)) for (let e in n) {
					let t = n[e];
					(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = Oe(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[ye(e)] = !0);
				}
				this._numberProps = i, this._resolveProps(e), this.shadowRoot && this._applyStyles(r), this._mount(e);
			}, t = this._def.__asyncLoader;
			t ? this._pendingResolve = t().then((t) => {
				t.configureApp = this._def.configureApp, e(this._def = t, !0);
			}) : e(this._def);
		}
		_mount(e) {
			this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
			let t = this._instance && this._instance.exposed;
			if (t) for (let e in t) j(this, e) || Object.defineProperty(this, e, { get: () => Zt(t[e]) });
		}
		_resolveProps(e) {
			let { props: t } = e, n = M(t) ? t : Object.keys(t || {});
			for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
			for (let e of n.map(ye)) Object.defineProperty(this, e, {
				get() {
					return this._getProp(e);
				},
				set(t) {
					this._setProp(e, t, !0, !this._patching);
				}
			});
		}
		_setAttr(e) {
			if (e.startsWith("data-v-")) return;
			let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : bu, r = ye(e);
			t && this._numberProps && this._numberProps[r] && (n = Oe(n)), this._setProp(r, n, !1, !0);
		}
		_getProp(e) {
			return this._props[e];
		}
		_setProp(e, t, n = !0, r = !1) {
			if (t !== this._props[e] && (this._dirty = !0, t === bu ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
				let n = this._ob;
				n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(xe(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(xe(e), t + "") : t || this.removeAttribute(xe(e)), n && n.observe(this, { attributes: !0 });
			}
		}
		_update() {
			let e = this._createVNode();
			this._app && (e.appContext = this._app._context), Uu(e, this._root);
		}
		_createVNode() {
			let e = {};
			this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
			let t = vc(this._def, A(e, this._props));
			return this._instance || (t.ce = (e) => {
				this._instance = e, e.ce = this, e.isCE = !0;
				let t = (e, t) => {
					this.dispatchEvent(new CustomEvent(e, pe(t[0]) ? A({ detail: t }, t[0]) : { detail: t }));
				};
				e.emit = (e, ...n) => {
					t(e, n), xe(e) !== e && t(xe(e), n);
				}, this._setParent();
			}), t;
		}
		_applyStyles(e, t, n) {
			if (!e) return;
			if (t) {
				if (t === this._def || this._styleChildren.has(t)) return;
				this._styleChildren.add(t);
			}
			let r = this._nonce, i = this.shadowRoot, a = n ? this._getStyleAnchor(n) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(i), o = null;
			for (let s = e.length - 1; s >= 0; s--) {
				let c = document.createElement("style");
				r && c.setAttribute("nonce", r), c.textContent = e[s], i.insertBefore(c, o || a), o = c, s === 0 && (n || this._styleAnchors.set(this._def, c), t && this._styleAnchors.set(t, c));
			}
		}
		_getStyleAnchor(e) {
			if (!e) return null;
			let t = this._styleAnchors.get(e);
			return t && t.parentNode === this.shadowRoot ? t : (t && this._styleAnchors.delete(e), null);
		}
		_getRootStyleInsertionAnchor(e) {
			for (let t = 0; t < e.childNodes.length; t++) {
				let n = e.childNodes[t];
				if (!(n instanceof HTMLStyleElement)) return n;
			}
			return null;
		}
		_parseSlots() {
			let e = this._slots = {}, t;
			for (; t = this.firstChild;) {
				let n = t.nodeType === 1 && t.getAttribute("slot") || "default";
				(e[n] || (e[n] = [])).push(t), this.removeChild(t);
			}
		}
		_renderSlots() {
			let e = this._getSlots(), t = this._instance.type.__scopeId;
			for (let n = 0; n < e.length; n++) {
				let r = e[n], i = r.getAttribute("name") || "default", a = this._slots[i], o = r.parentNode;
				if (a) for (let e of a) {
					if (t && e.nodeType === 1) {
						let n = t + "-s", r = document.createTreeWalker(e, 1);
						e.setAttribute(n, "");
						let i;
						for (; i = r.nextNode();) i.setAttribute(n, "");
					}
					o.insertBefore(e, r);
				}
				else for (; r.firstChild;) o.insertBefore(r.firstChild, r);
				o.removeChild(r);
			}
		}
		_getSlots() {
			let e = [this];
			this._teleportTargets && e.push(...this._teleportTargets);
			let t = /* @__PURE__ */ new Set();
			for (let n of e) {
				let e = n.querySelectorAll("slot");
				for (let n = 0; n < e.length; n++) t.add(e[n]);
			}
			return Array.from(t);
		}
		_injectChildStyle(e, t) {
			this._applyStyles(e.styles, e, t);
		}
		_beginPatch() {
			this._patching = !0, this._dirty = !1;
		}
		_endPatch() {
			this._patching = !1, this._dirty && this._instance && this._update();
		}
		_hasShadowRoot() {
			return this._def.shadowRoot !== !1;
		}
		_removeChildStyle(e) {}
	}, wu = /* @__PURE__ */ new WeakMap(), Tu = /* @__PURE__ */ new WeakMap(), Eu = /* @__PURE__ */ Symbol("_moveCb"), Du = /* @__PURE__ */ Symbol("_enterCb"), Ou = (e) => (delete e.props.mode, e), ku = /* @__PURE__ */ Ou({
		name: "TransitionGroup",
		props: /* @__PURE__ */ A({}, Zl, {
			tag: String,
			moveClass: String
		}),
		setup(e, { slots: t }) {
			let n = Sc(), r = Ur(), i, a;
			return Es(() => {
				if (!i.length) return;
				let t = e.moveClass || `${e.name || "v"}-move`;
				if (!wl(i[0].el, n.vnode.el, t)) {
					i = [];
					return;
				}
				i.forEach(bl), i.forEach(xl);
				let r = i.filter(Sl);
				Xc(n.vnode.el), r.forEach((e) => {
					let n = e.el, r = n.style;
					Uc(n, t), r.transform = r.webkitTransform = r.transitionDuration = "";
					let i = n[Eu] = (e) => {
						e && e.target !== n || (!e || e.propertyName.endsWith("transform")) && (n.removeEventListener("transitionend", i), n[Eu] = null, Wc(n, t));
					};
					n.addEventListener("transitionend", i);
				}), i = [];
			}), () => {
				let o = /* @__PURE__ */ Gt(e), s = Bc(o), c = o.tag || K;
				if (i = [], a) for (let e = 0; e < a.length; e++) {
					let t = a[e];
					t.el && t.el instanceof Element && !t.el[iu] && (i.push(t), Yr(t, Kr(t, s, r, n)), wu.set(t, Cl(t.el)));
				}
				a = t.default ? Xr(t.default()) : [];
				for (let e = 0; e < a.length; e++) {
					let t = a[e];
					t.key != null && Yr(t, Kr(t, s, r, n));
				}
				return vc(c, null, a);
			};
		}
	}), Au = (e) => {
		let t = e.props["onUpdate:modelValue"] || !1;
		return M(t) ? (e) => Te(t, e) : t;
	}, ju = /* @__PURE__ */ Symbol("_assign"), J = {
		created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
			e[ju] = Au(i);
			let a = r || i.props && i.props.type === "number";
			ll(e, t ? "change" : "input", (t) => {
				t.target.composing || e[ju](Dl(e.value, n, a));
			}), (n || a) && ll(e, "change", () => {
				e.value = Dl(e.value, n, a);
			}), t || (ll(e, "compositionstart", Tl), ll(e, "compositionend", El), ll(e, "change", El));
		},
		mounted(e, { value: t }) {
			e.value = t ?? "";
		},
		beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
			if (e[ju] = Au(o), e.composing) return;
			let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? De(e.value) : e.value, c = t ?? "";
			if (s === c) return;
			let l = e.getRootNode();
			(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
		}
	}, Mu = {
		deep: !0,
		created(e, t, n) {
			e[ju] = Au(n), ll(e, "change", () => {
				let t = e._modelValue, n = Al(e), r = e.checked, i = e[ju];
				if (M(t)) {
					let e = w(t, n), a = e !== -1;
					if (r && !a) i(t.concat(n));
					else if (!r && a) {
						let n = [...t];
						n.splice(e, 1), i(n);
					}
				} else if (N(t)) {
					let e = new Set(t);
					r ? e.add(n) : e.delete(n), i(e);
				} else i(jl(e, r));
			});
		},
		mounted: Ol,
		beforeUpdate(e, t, n) {
			e[ju] = Au(n), Ol(e, t, n);
		}
	}, Nu = {
		created(e, { value: t }, n) {
			e.checked = C(t, n.props.value), e[ju] = Au(n), ll(e, "change", () => {
				e[ju](Al(e));
			});
		},
		beforeUpdate(e, { value: t, oldValue: n }, r) {
			e[ju] = Au(r), t !== n && (e.checked = C(t, r.props.value));
		}
	}, Y = {
		deep: !0,
		created(e, { value: t, modifiers: { number: n } }, r) {
			let i = N(t);
			ll(e, "change", () => {
				let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? De(Al(e)) : Al(e));
				e[ju](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, hr(() => {
					e._assigning = !1;
				});
			}), e[ju] = Au(r);
		},
		mounted(e, { value: t }) {
			kl(e, t);
		},
		beforeUpdate(e, t, n) {
			e[ju] = Au(n);
		},
		updated(e, { value: t }) {
			e._assigning || kl(e, t);
		}
	}, Pu = {
		created(e, t, n) {
			Nl(e, t, n, null, "created");
		},
		mounted(e, t, n) {
			Nl(e, t, n, null, "mounted");
		},
		beforeUpdate(e, t, n, r) {
			Nl(e, t, n, r, "beforeUpdate");
		},
		updated(e, t, n, r) {
			Nl(e, t, n, r, "updated");
		}
	}, Fu = [
		"ctrl",
		"shift",
		"alt",
		"meta"
	], Iu = {
		stop: (e) => e.stopPropagation(),
		prevent: (e) => e.preventDefault(),
		self: (e) => e.target !== e.currentTarget,
		ctrl: (e) => !e.ctrlKey,
		shift: (e) => !e.shiftKey,
		alt: (e) => !e.altKey,
		meta: (e) => !e.metaKey,
		left: (e) => "button" in e && e.button !== 0,
		middle: (e) => "button" in e && e.button !== 1,
		right: (e) => "button" in e && e.button !== 2,
		exact: (e, t) => Fu.some((n) => e[`${n}Key`] && !t.includes(n))
	}, Lu = (e, t) => {
		if (!e) return e;
		let n = e._withMods ||= {}, r = t.join(".");
		return n[r] || (n[r] = ((n, ...r) => {
			for (let e = 0; e < t.length; e++) {
				let r = Iu[t[e]];
				if (r && r(n, t)) return;
			}
			return e(n, ...r);
		}));
	}, Ru = {
		esc: "escape",
		space: " ",
		up: "arrow-up",
		left: "arrow-left",
		right: "arrow-right",
		down: "arrow-down",
		delete: "backspace"
	}, zu = (e, t) => {
		let n = e._withKeys ||= {}, r = t.join(".");
		return n[r] || (n[r] = ((n) => {
			if (!("key" in n)) return;
			let r = xe(n.key);
			if (t.some((e) => e === r || Ru[e] === r)) return e(n);
		}));
	}, Bu = /* @__PURE__ */ A({ patchProp: yu }, Kl), Hu = !1, Uu = ((...e) => {
		Fl().render(...e);
	}), Wu = ((...e) => {
		Il().hydrate(...e);
	}), Gu = ((...e) => {
		let t = Fl().createApp(...e), { mount: n } = t;
		return t.mount = (e) => {
			let r = Rl(e);
			if (!r) return;
			let i = t._component;
			!P(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
			let a = n(r, !1, Ll(r));
			return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
		}, t;
	}), Ku = ((...e) => {
		let t = Il().createApp(...e), { mount: n } = t;
		return t.mount = (e) => {
			let t = Rl(e);
			if (t) return n(t, !0, Ll(t));
		}, t;
	}), qu = !1, Ju = () => {
		qu || (qu = !0, Pl(), $c());
	};
}));
Yu(), et();
var Xu = /* @__PURE__ */ Symbol(""), Zu = /* @__PURE__ */ Symbol(""), Qu = /* @__PURE__ */ Symbol(""), $u = /* @__PURE__ */ Symbol(""), ed = /* @__PURE__ */ Symbol(""), td = /* @__PURE__ */ Symbol(""), nd = /* @__PURE__ */ Symbol(""), rd = /* @__PURE__ */ Symbol(""), id = /* @__PURE__ */ Symbol(""), ad = /* @__PURE__ */ Symbol(""), od = /* @__PURE__ */ Symbol(""), sd = /* @__PURE__ */ Symbol(""), cd = /* @__PURE__ */ Symbol(""), ld = /* @__PURE__ */ Symbol(""), ud = /* @__PURE__ */ Symbol(""), dd = /* @__PURE__ */ Symbol(""), fd = /* @__PURE__ */ Symbol(""), pd = /* @__PURE__ */ Symbol(""), md = /* @__PURE__ */ Symbol(""), hd = /* @__PURE__ */ Symbol(""), gd = /* @__PURE__ */ Symbol(""), _d = /* @__PURE__ */ Symbol(""), vd = /* @__PURE__ */ Symbol(""), yd = /* @__PURE__ */ Symbol(""), bd = /* @__PURE__ */ Symbol(""), xd = /* @__PURE__ */ Symbol(""), Sd = /* @__PURE__ */ Symbol(""), Cd = /* @__PURE__ */ Symbol(""), wd = /* @__PURE__ */ Symbol(""), Td = /* @__PURE__ */ Symbol(""), Ed = /* @__PURE__ */ Symbol(""), Dd = /* @__PURE__ */ Symbol(""), Od = /* @__PURE__ */ Symbol(""), kd = /* @__PURE__ */ Symbol(""), Ad = /* @__PURE__ */ Symbol(""), jd = /* @__PURE__ */ Symbol(""), Md = /* @__PURE__ */ Symbol(""), Nd = /* @__PURE__ */ Symbol(""), Pd = /* @__PURE__ */ Symbol(""), Fd = {
	[Xu]: "Fragment",
	[Zu]: "Teleport",
	[Qu]: "Suspense",
	[$u]: "KeepAlive",
	[ed]: "BaseTransition",
	[td]: "openBlock",
	[nd]: "createBlock",
	[rd]: "createElementBlock",
	[id]: "createVNode",
	[ad]: "createElementVNode",
	[od]: "createCommentVNode",
	[sd]: "createTextVNode",
	[cd]: "createStaticVNode",
	[ld]: "resolveComponent",
	[ud]: "resolveDynamicComponent",
	[dd]: "resolveDirective",
	[fd]: "resolveFilter",
	[pd]: "withDirectives",
	[md]: "renderList",
	[hd]: "renderSlot",
	[gd]: "createSlots",
	[_d]: "toDisplayString",
	[vd]: "mergeProps",
	[yd]: "normalizeClass",
	[bd]: "normalizeStyle",
	[xd]: "normalizeProps",
	[Sd]: "guardReactiveProps",
	[Cd]: "toHandlers",
	[wd]: "camelize",
	[Td]: "capitalize",
	[Ed]: "toHandlerKey",
	[Dd]: "setBlockTracking",
	[Od]: "pushScopeId",
	[kd]: "popScopeId",
	[Ad]: "withCtx",
	[jd]: "unref",
	[Md]: "isRef",
	[Nd]: "withMemo",
	[Pd]: "isMemoSame"
};
function Id(e) {
	Object.getOwnPropertySymbols(e).forEach((t) => {
		Fd[t] = e[t];
	});
}
var Ld = {
	start: {
		line: 1,
		column: 1,
		offset: 0
	},
	end: {
		line: 1,
		column: 1,
		offset: 0
	},
	source: ""
};
function Rd(e, t = "") {
	return {
		type: 0,
		source: t,
		children: e,
		helpers: /* @__PURE__ */ new Set(),
		components: [],
		directives: [],
		hoists: [],
		imports: [],
		cached: [],
		temps: 0,
		codegenNode: void 0,
		loc: Ld
	};
}
function zd(e, t, n, r, i, a, o, s = !1, c = !1, l = !1, u = Ld) {
	return e && (s ? (e.helper(td), e.helper(Xd(e.inSSR, l))) : e.helper(Yd(e.inSSR, l)), o && e.helper(pd)), {
		type: 13,
		tag: t,
		props: n,
		children: r,
		patchFlag: i,
		dynamicProps: a,
		directives: o,
		isBlock: s,
		disableTracking: c,
		isComponent: l,
		loc: u
	};
}
function Bd(e, t = Ld) {
	return {
		type: 17,
		loc: t,
		elements: e
	};
}
function Vd(e, t = Ld) {
	return {
		type: 15,
		loc: t,
		properties: e
	};
}
function Hd(e, t) {
	return {
		type: 16,
		loc: Ld,
		key: F(e) ? X(e, !0) : e,
		value: t
	};
}
function X(e, t = !1, n = Ld, r = 0) {
	return {
		type: 4,
		loc: n,
		content: e,
		isStatic: t,
		constType: t ? 3 : r
	};
}
function Ud(e, t = Ld) {
	return {
		type: 8,
		loc: t,
		children: e
	};
}
function Wd(e, t = [], n = Ld) {
	return {
		type: 14,
		loc: n,
		callee: e,
		arguments: t
	};
}
function Gd(e, t = void 0, n = !1, r = !1, i = Ld) {
	return {
		type: 18,
		params: e,
		returns: t,
		newline: n,
		isSlot: r,
		loc: i
	};
}
function Kd(e, t, n, r = !0) {
	return {
		type: 19,
		test: e,
		consequent: t,
		alternate: n,
		newline: r,
		loc: Ld
	};
}
function qd(e, t, n = !1, r = !1) {
	return {
		type: 20,
		index: e,
		value: t,
		needPauseTracking: n,
		inVOnce: r,
		needArraySpread: !1,
		loc: Ld
	};
}
function Jd(e) {
	return {
		type: 21,
		body: e,
		loc: Ld
	};
}
function Yd(e, t) {
	return e || t ? id : ad;
}
function Xd(e, t) {
	return e || t ? nd : rd;
}
function Zd(e, { helper: t, removeHelper: n, inSSR: r }) {
	e.isBlock || (e.isBlock = !0, n(Yd(r, e.isComponent)), t(td), t(Xd(r, e.isComponent)));
}
var Qd = new Uint8Array([123, 123]), $d = new Uint8Array([125, 125]);
function ef(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function tf(e) {
	return e === 32 || e === 10 || e === 9 || e === 12 || e === 13;
}
function nf(e) {
	return e === 47 || e === 62 || tf(e);
}
function rf(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}
var af = {
	Cdata: new Uint8Array([
		67,
		68,
		65,
		84,
		65,
		91
	]),
	CdataEnd: new Uint8Array([
		93,
		93,
		62
	]),
	CommentEnd: new Uint8Array([
		45,
		45,
		62
	]),
	ScriptEnd: new Uint8Array([
		60,
		47,
		115,
		99,
		114,
		105,
		112,
		116
	]),
	StyleEnd: new Uint8Array([
		60,
		47,
		115,
		116,
		121,
		108,
		101
	]),
	TitleEnd: new Uint8Array([
		60,
		47,
		116,
		105,
		116,
		108,
		101
	]),
	TextareaEnd: new Uint8Array([
		60,
		47,
		116,
		101,
		120,
		116,
		97,
		114,
		101,
		97
	])
}, of = class {
	constructor(e, t) {
		this.stack = e, this.cbs = t, this.state = 1, this.buffer = "", this.sectionStart = 0, this.index = 0, this.entityStart = 0, this.baseState = 1, this.inRCDATA = !1, this.inXML = !1, this.inVPre = !1, this.newlines = [], this.mode = 0, this.delimiterOpen = Qd, this.delimiterClose = $d, this.delimiterIndex = -1, this.currentSequence = void 0, this.sequenceIndex = 0;
	}
	get inSFCRoot() {
		return this.mode === 2 && this.stack.length === 0;
	}
	reset() {
		this.state = 1, this.mode = 0, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = 1, this.inRCDATA = !1, this.currentSequence = void 0, this.newlines.length = 0, this.delimiterOpen = Qd, this.delimiterClose = $d;
	}
	getPos(e) {
		let t = 1, n = e + 1, r = this.newlines.length, i = -1;
		if (r > 100) {
			let t = -1, n = r;
			for (; t + 1 < n;) {
				let r = t + n >>> 1;
				this.newlines[r] < e ? t = r : n = r;
			}
			i = t;
		} else for (let t = r - 1; t >= 0; t--) if (e > this.newlines[t]) {
			i = t;
			break;
		}
		return i >= 0 && (t = i + 2, n = e - this.newlines[i]), {
			column: n,
			line: t,
			offset: e
		};
	}
	peek() {
		return this.buffer.charCodeAt(this.index + 1);
	}
	stateText(e) {
		e === 60 ? (this.index > this.sectionStart && this.cbs.ontext(this.sectionStart, this.index), this.state = 5, this.sectionStart = this.index) : !this.inVPre && e === this.delimiterOpen[0] && (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(e));
	}
	stateInterpolationOpen(e) {
		if (e === this.delimiterOpen[this.delimiterIndex]) if (this.delimiterIndex === this.delimiterOpen.length - 1) {
			let e = this.index + 1 - this.delimiterOpen.length;
			e > this.sectionStart && this.cbs.ontext(this.sectionStart, e), this.state = 3, this.sectionStart = e;
		} else this.delimiterIndex++;
		else this.inRCDATA ? (this.state = 32, this.stateInRCDATA(e)) : (this.state = 1, this.stateText(e));
	}
	stateInterpolation(e) {
		e === this.delimiterClose[0] && (this.state = 4, this.delimiterIndex = 0, this.stateInterpolationClose(e));
	}
	stateInterpolationClose(e) {
		e === this.delimiterClose[this.delimiterIndex] ? this.delimiterIndex === this.delimiterClose.length - 1 ? (this.cbs.oninterpolation(this.sectionStart, this.index + 1), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : this.delimiterIndex++ : (this.state = 3, this.stateInterpolation(e));
	}
	stateSpecialStartSequence(e) {
		let t = this.sequenceIndex === this.currentSequence.length;
		if (!(t ? nf(e) : (e | 32) === this.currentSequence[this.sequenceIndex])) this.inRCDATA = !1;
		else if (!t) {
			this.sequenceIndex++;
			return;
		}
		this.sequenceIndex = 0, this.state = 6, this.stateInTagName(e);
	}
	stateInRCDATA(e) {
		if (this.sequenceIndex === this.currentSequence.length) {
			if (e === 62 || tf(e)) {
				let t = this.index - this.currentSequence.length;
				if (this.sectionStart < t) {
					let e = this.index;
					this.index = t, this.cbs.ontext(this.sectionStart, t), this.index = e;
				}
				this.sectionStart = t + 2, this.stateInClosingTagName(e), this.inRCDATA = !1;
				return;
			}
			this.sequenceIndex = 0;
		}
		(e | 32) === this.currentSequence[this.sequenceIndex] ? this.sequenceIndex += 1 : this.sequenceIndex === 0 ? this.currentSequence === af.TitleEnd || this.currentSequence === af.TextareaEnd && !this.inSFCRoot ? !this.inVPre && e === this.delimiterOpen[0] && (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(e)) : this.fastForwardTo(60) && (this.sequenceIndex = 1) : this.sequenceIndex = Number(e === 60);
	}
	stateCDATASequence(e) {
		e === af.Cdata[this.sequenceIndex] ? ++this.sequenceIndex === af.Cdata.length && (this.state = 28, this.currentSequence = af.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1) : (this.sequenceIndex = 0, this.state = 23, this.stateInDeclaration(e));
	}
	fastForwardTo(e) {
		for (; ++this.index < this.buffer.length;) {
			let t = this.buffer.charCodeAt(this.index);
			if (t === 10 && this.newlines.push(this.index), t === e) return !0;
		}
		return this.index = this.buffer.length - 1, !1;
	}
	stateInCommentLike(e) {
		e === this.currentSequence[this.sequenceIndex] ? ++this.sequenceIndex === this.currentSequence.length && (this.currentSequence === af.CdataEnd ? this.cbs.oncdata(this.sectionStart, this.index - 2) : this.cbs.oncomment(this.sectionStart, this.index - 2), this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = 1) : this.sequenceIndex === 0 ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1) : e !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
	}
	startSpecial(e, t) {
		this.enterRCDATA(e, t), this.state = 31;
	}
	enterRCDATA(e, t) {
		this.inRCDATA = !0, this.currentSequence = e, this.sequenceIndex = t;
	}
	stateBeforeTagName(e) {
		e === 33 ? (this.state = 22, this.sectionStart = this.index + 1) : e === 63 ? (this.state = 24, this.sectionStart = this.index + 1) : ef(e) ? (this.sectionStart = this.index, this.mode === 0 ? this.state = 6 : this.inSFCRoot ? this.state = 34 : this.inXML ? this.state = 6 : e === 116 ? this.state = 30 : this.state = e === 115 ? 29 : 6) : e === 47 ? this.state = 8 : (this.state = 1, this.stateText(e));
	}
	stateInTagName(e) {
		nf(e) && this.handleTagName(e);
	}
	stateInSFCRootTagName(e) {
		if (nf(e)) {
			let t = this.buffer.slice(this.sectionStart, this.index);
			t !== "template" && this.enterRCDATA(rf("</" + t), 0), this.handleTagName(e);
		}
	}
	handleTagName(e) {
		this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e);
	}
	stateBeforeClosingTagName(e) {
		tf(e) || (e === 62 ? (this.state = 1, this.sectionStart = this.index + 1) : (this.state = ef(e) ? 9 : 27, this.sectionStart = this.index));
	}
	stateInClosingTagName(e) {
		(e === 62 || tf(e)) && (this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = 10, this.stateAfterClosingTagName(e));
	}
	stateAfterClosingTagName(e) {
		e === 62 && (this.state = 1, this.sectionStart = this.index + 1);
	}
	stateBeforeAttrName(e) {
		e === 62 ? (this.cbs.onopentagend(this.index), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : e === 47 ? this.state = 7 : e === 60 && this.peek() === 47 ? (this.cbs.onopentagend(this.index), this.state = 5, this.sectionStart = this.index) : tf(e) || this.handleAttrStart(e);
	}
	handleAttrStart(e) {
		e === 118 && this.peek() === 45 ? (this.state = 13, this.sectionStart = this.index) : e === 46 || e === 58 || e === 64 || e === 35 ? (this.cbs.ondirname(this.index, this.index + 1), this.state = 14, this.sectionStart = this.index + 1) : (this.state = 12, this.sectionStart = this.index);
	}
	stateInSelfClosingTag(e) {
		e === 62 ? (this.cbs.onselfclosingtag(this.index), this.state = 1, this.sectionStart = this.index + 1, this.inRCDATA = !1) : tf(e) || (this.state = 11, this.stateBeforeAttrName(e));
	}
	stateInAttrName(e) {
		(e === 61 || nf(e)) && (this.cbs.onattribname(this.sectionStart, this.index), this.handleAttrNameEnd(e));
	}
	stateInDirName(e) {
		e === 61 || nf(e) ? (this.cbs.ondirname(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 58 ? (this.cbs.ondirname(this.sectionStart, this.index), this.state = 14, this.sectionStart = this.index + 1) : e === 46 && (this.cbs.ondirname(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
	}
	stateInDirArg(e) {
		e === 61 || nf(e) ? (this.cbs.ondirarg(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 91 ? this.state = 15 : e === 46 && (this.cbs.ondirarg(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
	}
	stateInDynamicDirArg(e) {
		e === 93 ? this.state = 14 : (e === 61 || nf(e)) && (this.cbs.ondirarg(this.sectionStart, this.index + 1), this.handleAttrNameEnd(e));
	}
	stateInDirModifier(e) {
		e === 61 || nf(e) ? (this.cbs.ondirmodifier(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 46 && (this.cbs.ondirmodifier(this.sectionStart, this.index), this.sectionStart = this.index + 1);
	}
	handleAttrNameEnd(e) {
		this.sectionStart = this.index, this.state = 17, this.cbs.onattribnameend(this.index), this.stateAfterAttrName(e);
	}
	stateAfterAttrName(e) {
		e === 61 ? this.state = 18 : e === 47 || e === 62 ? (this.cbs.onattribend(0, this.sectionStart), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e)) : tf(e) || (this.cbs.onattribend(0, this.sectionStart), this.handleAttrStart(e));
	}
	stateBeforeAttrValue(e) {
		e === 34 ? (this.state = 19, this.sectionStart = this.index + 1) : e === 39 ? (this.state = 20, this.sectionStart = this.index + 1) : tf(e) || (this.sectionStart = this.index, this.state = 21, this.stateInAttrValueNoQuotes(e));
	}
	handleInAttrValue(e, t) {
		(e === t || this.fastForwardTo(t)) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(t === 34 ? 3 : 2, this.index + 1), this.state = 11);
	}
	stateInAttrValueDoubleQuotes(e) {
		this.handleInAttrValue(e, 34);
	}
	stateInAttrValueSingleQuotes(e) {
		this.handleInAttrValue(e, 39);
	}
	stateInAttrValueNoQuotes(e) {
		tf(e) || e === 62 ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(1, this.index), this.state = 11, this.stateBeforeAttrName(e)) : (e === 39 || e === 60 || e === 61 || e === 96) && this.cbs.onerr(18, this.index);
	}
	stateBeforeDeclaration(e) {
		e === 91 ? (this.state = 26, this.sequenceIndex = 0) : this.state = e === 45 ? 25 : 23;
	}
	stateInDeclaration(e) {
		(e === 62 || this.fastForwardTo(62)) && (this.state = 1, this.sectionStart = this.index + 1);
	}
	stateInProcessingInstruction(e) {
		(e === 62 || this.fastForwardTo(62)) && (this.cbs.onprocessinginstruction(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
	}
	stateBeforeComment(e) {
		e === 45 ? (this.state = 28, this.currentSequence = af.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1) : this.state = 23;
	}
	stateInSpecialComment(e) {
		(e === 62 || this.fastForwardTo(62)) && (this.cbs.oncomment(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
	}
	stateBeforeSpecialS(e) {
		e === af.ScriptEnd[3] ? this.startSpecial(af.ScriptEnd, 4) : e === af.StyleEnd[3] ? this.startSpecial(af.StyleEnd, 4) : (this.state = 6, this.stateInTagName(e));
	}
	stateBeforeSpecialT(e) {
		e === af.TitleEnd[3] ? this.startSpecial(af.TitleEnd, 4) : e === af.TextareaEnd[3] ? this.startSpecial(af.TextareaEnd, 4) : (this.state = 6, this.stateInTagName(e));
	}
	startEntity() {}
	stateInEntity() {}
	parse(e) {
		for (this.buffer = e; this.index < this.buffer.length;) {
			let e = this.buffer.charCodeAt(this.index);
			switch (e === 10 && this.state !== 33 && this.newlines.push(this.index), this.state) {
				case 1:
					this.stateText(e);
					break;
				case 2:
					this.stateInterpolationOpen(e);
					break;
				case 3:
					this.stateInterpolation(e);
					break;
				case 4:
					this.stateInterpolationClose(e);
					break;
				case 31:
					this.stateSpecialStartSequence(e);
					break;
				case 32:
					this.stateInRCDATA(e);
					break;
				case 26:
					this.stateCDATASequence(e);
					break;
				case 19:
					this.stateInAttrValueDoubleQuotes(e);
					break;
				case 12:
					this.stateInAttrName(e);
					break;
				case 13:
					this.stateInDirName(e);
					break;
				case 14:
					this.stateInDirArg(e);
					break;
				case 15:
					this.stateInDynamicDirArg(e);
					break;
				case 16:
					this.stateInDirModifier(e);
					break;
				case 28:
					this.stateInCommentLike(e);
					break;
				case 27:
					this.stateInSpecialComment(e);
					break;
				case 11:
					this.stateBeforeAttrName(e);
					break;
				case 6:
					this.stateInTagName(e);
					break;
				case 34:
					this.stateInSFCRootTagName(e);
					break;
				case 9:
					this.stateInClosingTagName(e);
					break;
				case 5:
					this.stateBeforeTagName(e);
					break;
				case 17:
					this.stateAfterAttrName(e);
					break;
				case 20:
					this.stateInAttrValueSingleQuotes(e);
					break;
				case 18:
					this.stateBeforeAttrValue(e);
					break;
				case 8:
					this.stateBeforeClosingTagName(e);
					break;
				case 10:
					this.stateAfterClosingTagName(e);
					break;
				case 29:
					this.stateBeforeSpecialS(e);
					break;
				case 30:
					this.stateBeforeSpecialT(e);
					break;
				case 21:
					this.stateInAttrValueNoQuotes(e);
					break;
				case 7:
					this.stateInSelfClosingTag(e);
					break;
				case 23:
					this.stateInDeclaration(e);
					break;
				case 22:
					this.stateBeforeDeclaration(e);
					break;
				case 25:
					this.stateBeforeComment(e);
					break;
				case 24:
					this.stateInProcessingInstruction(e);
					break;
				case 33:
					this.stateInEntity();
					break;
			}
			this.index++;
		}
		this.cleanup(), this.finish();
	}
	cleanup() {
		this.sectionStart !== this.index && (this.state === 1 || this.state === 32 && this.sequenceIndex === 0 ? (this.cbs.ontext(this.sectionStart, this.index), this.sectionStart = this.index) : (this.state === 19 || this.state === 20 || this.state === 21) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = this.index));
	}
	finish() {
		this.handleTrailingData(), this.cbs.onend();
	}
	handleTrailingData() {
		let e = this.buffer.length;
		this.sectionStart >= e || (this.state === 28 ? this.currentSequence === af.CdataEnd ? this.cbs.oncdata(this.sectionStart, e) : this.cbs.oncomment(this.sectionStart, e) : this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9 || this.cbs.ontext(this.sectionStart, e));
	}
	emitCodePoint(e, t) {}
};
function sf(e, { compatConfig: t }) {
	let n = t && t[e];
	return e === "MODE" ? n || 3 : n;
}
function cf(e, t) {
	let n = sf("MODE", t), r = sf(e, t);
	return n === 3 ? r === !0 : r !== !1;
}
function lf(e, t, n, ...r) {
	return cf(e, t);
}
function uf(e) {
	throw e;
}
function df(e) {}
function ff(e, t, n, r) {
	let i = `https://vuejs.org/error-reference/#compiler-${e}`, a = SyntaxError(String(i));
	return a.code = e, a.loc = t, a;
}
var pf = (e) => e.type === 4 && e.isStatic;
function mf(e) {
	switch (e) {
		case "Teleport":
		case "teleport": return Zu;
		case "Suspense":
		case "suspense": return Qu;
		case "KeepAlive":
		case "keep-alive": return $u;
		case "BaseTransition":
		case "base-transition": return ed;
	}
}
var hf = /^$|^\d|[^\$\w\xA0-\uFFFF]/, gf = (e) => !hf.test(e), _f = /[A-Za-z_$\xA0-\uFFFF]/, vf = /[\.\?\w$\xA0-\uFFFF]/, yf = /\s+[.[]\s*|\s*[.[]\s+/g, bf = (e) => e.type === 4 ? e.content : e.loc.source, xf = (e) => {
	let t = bf(e).trim().replace(yf, (e) => e.trim()), n = 0, r = [], i = 0, a = 0, o = null;
	for (let e = 0; e < t.length; e++) {
		let s = t.charAt(e);
		switch (n) {
			case 0:
				if (s === "[") r.push(n), n = 1, i++;
				else if (s === "(") r.push(n), n = 2, a++;
				else if (!(e === 0 ? _f : vf).test(s)) return !1;
				break;
			case 1:
				s === "'" || s === "\"" || s === "`" ? (r.push(n), n = 3, o = s) : s === "[" ? i++ : s === "]" && (--i || (n = r.pop()));
				break;
			case 2:
				if (s === "'" || s === "\"" || s === "`") r.push(n), n = 3, o = s;
				else if (s === "(") a++;
				else if (s === ")") {
					if (e === t.length - 1) return !1;
					--a || (n = r.pop());
				}
				break;
			case 3:
				s === o && (n = r.pop(), o = null);
				break;
		}
	}
	return !i && !a;
}, Sf = /^\s*(?:async\s*)?(?:\([^)]*?\)|[\w$_]+)\s*(?::[^=]+)?=>|^\s*(?:async\s+)?function(?:\s+[\w$]+)?\s*\(/, Cf = (e) => Sf.test(bf(e));
function wf(e, t, n = !1) {
	for (let r = 0; r < e.props.length; r++) {
		let i = e.props[r];
		if (i.type === 7 && (n || i.exp) && (F(t) ? i.name === t : t.test(i.name))) return i;
	}
}
function Tf(e, t, n = !1, r = !1) {
	for (let i = 0; i < e.props.length; i++) {
		let a = e.props[i];
		if (a.type === 6) {
			if (n) continue;
			if (a.name === t && (a.value || r)) return a;
		} else if (a.name === "bind" && (a.exp || r) && Ef(a.arg, t)) return a;
	}
}
function Ef(e, t) {
	return !!(e && pf(e) && e.content === t);
}
function Df(e) {
	return e.props.some((e) => e.type === 7 && e.name === "bind" && (!e.arg || e.arg.type !== 4 || !e.arg.isStatic));
}
function Of(e) {
	return e.type === 5 || e.type === 2;
}
function kf(e) {
	return e.type === 7 && e.name === "pre";
}
function Af(e) {
	return e.type === 7 && e.name === "slot";
}
function jf(e) {
	return e.type === 1 && e.tagType === 3;
}
function Mf(e) {
	return e.type === 1 && e.tagType === 2;
}
var Nf = /* @__PURE__ */ new Set([xd, Sd]);
function Pf(e, t = []) {
	if (e && !F(e) && e.type === 14) {
		let n = e.callee;
		if (!F(n) && Nf.has(n)) return Pf(e.arguments[0], t.concat(e));
	}
	return [e, t];
}
function Ff(e, t, n) {
	let r, i = e.type === 13 ? e.props : e.arguments[2], a = [], o;
	if (i && !F(i) && i.type === 14) {
		let e = Pf(i);
		i = e[0], a = e[1], o = a[a.length - 1];
	}
	if (i == null || F(i)) r = Vd([t]);
	else if (i.type === 14) {
		let e = i.arguments[0];
		!F(e) && e.type === 15 ? If(t, e) || e.properties.unshift(t) : i.callee === Cd ? r = Wd(n.helper(vd), [Vd([t]), i]) : i.arguments.unshift(Vd([t])), !r && (r = i);
	} else i.type === 15 ? (If(t, i) || i.properties.unshift(t), r = i) : (r = Wd(n.helper(vd), [Vd([t]), i]), o && o.callee === Sd && (o = a[a.length - 2]));
	e.type === 13 ? o ? o.arguments[0] = r : e.props = r : o ? o.arguments[0] = r : e.arguments[2] = r;
}
function If(e, t) {
	let n = !1;
	if (e.key.type === 4) {
		let r = e.key.content;
		n = t.properties.some((e) => e.key.type === 4 && e.key.content === r);
	}
	return n;
}
function Lf(e, t) {
	return `_${t}_${e.replace(/[^\w]/g, (t, n) => t === "-" ? "_" : e.charCodeAt(n).toString())}`;
}
function Rf(e) {
	return e.type === 14 && e.callee === Nd ? e.arguments[1].returns : e;
}
var zf = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
function Bf(e) {
	for (let t = 0; t < e.length; t++) if (!tf(e.charCodeAt(t))) return !1;
	return !0;
}
function Vf(e) {
	return e.type === 2 && Bf(e.content) || e.type === 12 && Vf(e.content);
}
function Hf(e) {
	return e.type === 3 || Vf(e);
}
var Uf = {
	parseMode: "base",
	ns: 0,
	delimiters: ["{{", "}}"],
	getNamespace: () => 0,
	isVoidTag: k,
	isPreTag: k,
	isIgnoreNewlineTag: k,
	isCustomElement: k,
	onError: uf,
	onWarn: df,
	comments: !1,
	prefixIdentifiers: !1
}, Wf = Uf, Gf = null, Kf = "", qf = null, Jf = null, Yf = "", Xf = -1, Zf = -1, Qf = 0, $f = !1, ep = null, tp = [], np = new of(tp, {
	onerr: Ep,
	ontext(e, t) {
		cp(op(e, t), e, t);
	},
	ontextentity(e, t, n) {
		cp(e, t, n);
	},
	oninterpolation(e, t) {
		if ($f) return cp(op(e, t), e, t);
		let n = e + np.delimiterOpen.length, r = t - np.delimiterClose.length;
		for (; tf(Kf.charCodeAt(n));) n++;
		for (; tf(Kf.charCodeAt(r - 1));) r--;
		let i = op(n, r);
		i.includes("&") && (i = Wf.decodeEntities(i, !1)), bp({
			type: 5,
			content: Tp(i, !1, xp(n, r)),
			loc: xp(e, t)
		});
	},
	onopentagname(e, t) {
		let n = op(e, t);
		qf = {
			type: 1,
			tag: n,
			ns: Wf.getNamespace(n, tp[0], Wf.ns),
			tagType: 0,
			props: [],
			children: [],
			loc: xp(e - 1, t),
			codegenNode: void 0
		};
	},
	onopentagend(e) {
		sp(e);
	},
	onclosetag(e, t) {
		let n = op(e, t);
		if (!Wf.isVoidTag(n)) {
			let r = !1;
			for (let e = 0; e < tp.length; e++) if (tp[e].tag.toLowerCase() === n.toLowerCase()) {
				r = !0, e > 0 && Ep(24, tp[0].loc.start.offset);
				for (let n = 0; n <= e; n++) lp(tp.shift(), t, n < e);
				break;
			}
			r || Ep(23, dp(e, 60));
		}
	},
	onselfclosingtag(e) {
		let t = qf.tag;
		qf.isSelfClosing = !0, sp(e), tp[0] && tp[0].tag === t && lp(tp.shift(), e);
	},
	onattribname(e, t) {
		Jf = {
			type: 6,
			name: op(e, t),
			nameLoc: xp(e, t),
			value: void 0,
			loc: xp(e)
		};
	},
	ondirname(e, t) {
		let n = op(e, t), r = n === "." || n === ":" ? "bind" : n === "@" ? "on" : n === "#" ? "slot" : n.slice(2);
		if (!$f && r === "" && Ep(26, e), $f || r === "") Jf = {
			type: 6,
			name: n,
			nameLoc: xp(e, t),
			value: void 0,
			loc: xp(e)
		};
		else if (Jf = {
			type: 7,
			name: r,
			rawName: n,
			exp: void 0,
			arg: void 0,
			modifiers: n === "." ? [X("prop")] : [],
			loc: xp(e)
		}, r === "pre") {
			$f = np.inVPre = !0, ep = qf;
			let e = qf.props;
			for (let t = 0; t < e.length; t++) e[t].type === 7 && (e[t] = wp(e[t]));
		}
	},
	ondirarg(e, t) {
		if (e === t) return;
		let n = op(e, t);
		if ($f && !kf(Jf)) Jf.name += n, Cp(Jf.nameLoc, t);
		else {
			let r = n[0] !== "[";
			Jf.arg = Tp(r ? n : n.slice(1, -1), r, xp(e, t), r ? 3 : 0);
		}
	},
	ondirmodifier(e, t) {
		let n = op(e, t);
		if ($f && !kf(Jf)) Jf.name += "." + n, Cp(Jf.nameLoc, t);
		else if (Jf.name === "slot") {
			let e = Jf.arg;
			e && (e.content += "." + n, Cp(e.loc, t));
		} else {
			let r = X(n, !0, xp(e, t));
			Jf.modifiers.push(r);
		}
	},
	onattribdata(e, t) {
		Yf += op(e, t), Xf < 0 && (Xf = e), Zf = t;
	},
	onattribentity(e, t, n) {
		Yf += e, Xf < 0 && (Xf = t), Zf = n;
	},
	onattribnameend(e) {
		let t = Jf.loc.start.offset, n = op(t, e);
		Jf.type === 7 && (Jf.rawName = n), qf.props.some((e) => (e.type === 7 ? e.rawName : e.name) === n) && Ep(2, t);
	},
	onattribend(e, t) {
		if (qf && Jf) {
			if (Cp(Jf.loc, t), e !== 0) if (Yf.includes("&") && (Yf = Wf.decodeEntities(Yf, !0)), Jf.type === 6) Jf.name === "class" && (Yf = yp(Yf).trim()), e === 1 && !Yf && Ep(13, t), Jf.value = {
				type: 2,
				content: Yf,
				loc: e === 1 ? xp(Xf, Zf) : xp(Xf - 1, Zf + 1)
			}, np.inSFCRoot && qf.tag === "template" && Jf.name === "lang" && Yf && Yf !== "html" && np.enterRCDATA(rf("</template"), 0);
			else {
				Jf.exp = Tp(Yf, !1, xp(Xf, Zf), 0, 0), Jf.name === "for" && (Jf.forParseResult = ap(Jf.exp));
				let e = -1;
				Jf.name === "bind" && (e = Jf.modifiers.findIndex((e) => e.content === "sync")) > -1 && lf("COMPILER_V_BIND_SYNC", Wf, Jf.loc, Jf.arg.loc.source) && (Jf.name = "model", Jf.modifiers.splice(e, 1));
			}
			(Jf.type !== 7 || Jf.name !== "pre") && qf.props.push(Jf);
		}
		Yf = "", Xf = Zf = -1;
	},
	oncomment(e, t) {
		Wf.comments && bp({
			type: 3,
			content: op(e, t),
			loc: xp(e - 4, t + 3)
		});
	},
	onend() {
		let e = Kf.length;
		for (let t = 0; t < tp.length; t++) lp(tp[t], e - 1), Ep(24, tp[t].loc.start.offset);
	},
	oncdata(e, t) {
		(tp[0] ? tp[0].ns : Wf.ns) === 0 ? Ep(1, e - 9) : cp(op(e, t), e, t);
	},
	onprocessinginstruction(e) {
		(tp[0] ? tp[0].ns : Wf.ns) === 0 && Ep(21, e - 1);
	}
}), rp = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, ip = /^\(|\)$/g;
function ap(e) {
	let t = e.loc, n = e.content, r = n.match(zf);
	if (!r) return;
	let [, i, a] = r, o = (e, n, r = !1) => {
		let i = t.start.offset + n;
		return Tp(e, !1, xp(i, i + e.length), 0, +!!r);
	}, s = {
		source: o(a.trim(), n.indexOf(a, i.length)),
		value: void 0,
		key: void 0,
		index: void 0,
		finalized: !1
	}, c = i.trim().replace(ip, "").trim(), l = i.indexOf(c), u = c.match(rp);
	if (u) {
		c = c.replace(rp, "").trim();
		let e = u[1].trim(), t;
		if (e && (t = n.indexOf(e, l + c.length), s.key = o(e, t, !0)), u[2]) {
			let r = u[2].trim();
			r && (s.index = o(r, n.indexOf(r, s.key ? t + e.length : l + c.length), !0));
		}
	}
	return c && (s.value = o(c, l, !0)), s;
}
function op(e, t) {
	return Kf.slice(e, t);
}
function sp(e) {
	np.inSFCRoot && (qf.innerLoc = xp(e + 1, e + 1)), bp(qf);
	let { tag: t, ns: n } = qf;
	n === 0 && Wf.isPreTag(t) && Qf++, Wf.isVoidTag(t) ? lp(qf, e) : (tp.unshift(qf), (n === 1 || n === 2) && (np.inXML = !0)), qf = null;
}
function cp(e, t, n) {
	{
		let t = tp[0] && tp[0].tag;
		t !== "script" && t !== "style" && e.includes("&") && (e = Wf.decodeEntities(e, !1));
	}
	let r = tp[0] || Gf, i = r.children[r.children.length - 1];
	i && i.type === 2 ? (i.content += e, Cp(i.loc, n)) : r.children.push({
		type: 2,
		content: e,
		loc: xp(t, n)
	});
}
function lp(e, t, n = !1) {
	n ? Cp(e.loc, dp(t, 60)) : Cp(e.loc, up(t, 62) + 1), np.inSFCRoot && (e.children.length ? e.innerLoc.end = A({}, e.children[e.children.length - 1].loc.end) : e.innerLoc.end = A({}, e.innerLoc.start), e.innerLoc.source = op(e.innerLoc.start.offset, e.innerLoc.end.offset));
	let { tag: r, ns: i, children: a } = e;
	if ($f || (r === "slot" ? e.tagType = 2 : pp(e) ? e.tagType = 3 : mp(e) && (e.tagType = 1)), np.inRCDATA || (e.children = _p(a)), i === 0 && Wf.isIgnoreNewlineTag(r)) {
		let e = a[0];
		e && e.type === 2 && (e.content = e.content.replace(/^\r?\n/, ""));
	}
	i === 0 && Wf.isPreTag(r) && Qf--, ep === e && ($f = np.inVPre = !1, ep = null), np.inXML && (tp[0] ? tp[0].ns : Wf.ns) === 0 && (np.inXML = !1);
	{
		let t = e.props;
		if (!np.inSFCRoot && cf("COMPILER_NATIVE_TEMPLATE", Wf) && e.tag === "template" && !pp(e)) {
			let t = tp[0] || Gf, n = t.children.indexOf(e);
			t.children.splice(n, 1, ...e.children);
		}
		let n = t.find((e) => e.type === 6 && e.name === "inline-template");
		n && lf("COMPILER_INLINE_TEMPLATE", Wf, n.loc) && e.children.length && (n.value = {
			type: 2,
			content: op(e.children[0].loc.start.offset, e.children[e.children.length - 1].loc.end.offset),
			loc: n.loc
		});
	}
}
function up(e, t) {
	let n = e;
	for (; Kf.charCodeAt(n) !== t && n < Kf.length - 1;) n++;
	return n;
}
function dp(e, t) {
	let n = e;
	for (; Kf.charCodeAt(n) !== t && n >= 0;) n--;
	return n;
}
var fp = /* @__PURE__ */ new Set([
	"if",
	"else",
	"else-if",
	"for",
	"slot"
]);
function pp({ tag: e, props: t }) {
	if (e === "template") {
		for (let e = 0; e < t.length; e++) if (t[e].type === 7 && fp.has(t[e].name)) return !0;
	}
	return !1;
}
function mp({ tag: e, props: t }) {
	if (Wf.isCustomElement(e)) return !1;
	if (e === "component" || hp(e.charCodeAt(0)) || mf(e) || Wf.isBuiltInComponent && Wf.isBuiltInComponent(e) || Wf.isNativeTag && !Wf.isNativeTag(e)) return !0;
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (n.type === 6) {
			if (n.name === "is" && n.value && (n.value.content.startsWith("vue:") || lf("COMPILER_IS_ON_ELEMENT", Wf, n.loc))) return !0;
		} else if (n.name === "bind" && Ef(n.arg, "is") && lf("COMPILER_IS_ON_ELEMENT", Wf, n.loc)) return !0;
	}
	return !1;
}
function hp(e) {
	return e > 64 && e < 91;
}
var gp = /\r\n/g;
function _p(e) {
	let t = Wf.whitespace !== "preserve", n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.type === 2) if (Qf) i.content = i.content.replace(gp, "\n");
		else if (Bf(i.content)) {
			let a = e[r - 1] && e[r - 1].type, o = e[r + 1] && e[r + 1].type;
			!a || !o || t && (a === 3 && (o === 3 || o === 1) || a === 1 && (o === 3 || o === 1 && vp(i.content))) ? (n = !0, e[r] = null) : i.content = " ";
		} else t && (i.content = yp(i.content));
	}
	return n ? e.filter(Boolean) : e;
}
function vp(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n === 10 || n === 13) return !0;
	}
	return !1;
}
function yp(e) {
	let t = "", n = !1;
	for (let r = 0; r < e.length; r++) tf(e.charCodeAt(r)) ? n ||= (t += " ", !0) : (t += e[r], n = !1);
	return t;
}
function bp(e) {
	(tp[0] || Gf).children.push(e);
}
function xp(e, t) {
	return {
		start: np.getPos(e),
		end: t == null ? t : np.getPos(t),
		source: t == null ? t : op(e, t)
	};
}
function Sp(e) {
	return xp(e.start.offset, e.end.offset);
}
function Cp(e, t) {
	e.end = np.getPos(t), e.source = op(e.start.offset, t);
}
function wp(e) {
	let t = {
		type: 6,
		name: e.rawName,
		nameLoc: xp(e.loc.start.offset, e.loc.start.offset + e.rawName.length),
		value: void 0,
		loc: e.loc
	};
	if (e.exp) {
		let n = e.exp.loc;
		n.end.offset < e.loc.end.offset && (n.start.offset--, n.start.column--, n.end.offset++, n.end.column++), t.value = {
			type: 2,
			content: e.exp.content,
			loc: n
		};
	}
	return t;
}
function Tp(e, t = !1, n, r = 0, i = 0) {
	return X(e, t, n, r);
}
function Ep(e, t, n) {
	Wf.onError(ff(e, xp(t, t), void 0, n));
}
function Dp() {
	np.reset(), qf = null, Jf = null, Yf = "", Xf = -1, Zf = -1, tp.length = 0;
}
function Op(e, t) {
	if (Dp(), Kf = e, Wf = A({}, Uf), t) {
		let e;
		for (e in t) t[e] != null && (Wf[e] = t[e]);
	}
	np.mode = Wf.parseMode === "html" ? 1 : Wf.parseMode === "sfc" ? 2 : 0, np.inXML = Wf.ns === 1 || Wf.ns === 2;
	let n = t && t.delimiters;
	n && (np.delimiterOpen = rf(n[0]), np.delimiterClose = rf(n[1]));
	let r = Gf = Rd([], e);
	return np.parse(Kf), r.loc = xp(0, e.length), r.children = _p(r.children), Gf = null, r;
}
function kp(e, t) {
	jp(e, void 0, t, !!Ap(e));
}
function Ap(e) {
	let t = e.children.filter((e) => e.type !== 3);
	return t.length === 1 && t[0].type === 1 && !Mf(t[0]) ? t[0] : null;
}
function jp(e, t, n, r = !1, i = !1) {
	let { children: a } = e, o = [];
	for (let t = 0; t < a.length; t++) {
		let s = a[t];
		if (s.type === 1 && s.tagType === 0) {
			let e = r ? 0 : Mp(s, n);
			if (e > 0) {
				if (e >= 2) {
					s.codegenNode.patchFlag = -1, o.push(s);
					continue;
				}
			} else {
				let e = s.codegenNode;
				if (e.type === 13) {
					let t = e.patchFlag;
					if ((t === void 0 || t === 512 || t === 1) && Fp(s, n) >= 2) {
						let t = Ip(s);
						t && (e.props = n.hoist(t));
					}
					e.dynamicProps &&= n.hoist(e.dynamicProps);
				}
			}
		} else if (s.type === 12 && (r ? 0 : Mp(s, n)) >= 2) {
			s.codegenNode.type === 14 && s.codegenNode.arguments.length > 0 && s.codegenNode.arguments.push("-1"), o.push(s);
			continue;
		}
		if (s.type === 1) {
			let t = s.tagType === 1;
			t && n.scopes.vSlot++, jp(s, e, n, !1, i), t && n.scopes.vSlot--;
		} else if (s.type === 11) jp(s, e, n, s.children.length === 1, !0);
		else if (s.type === 9) for (let t = 0; t < s.branches.length; t++) jp(s.branches[t], e, n, s.branches[t].children.length === 1, i);
	}
	let s = !1;
	if (o.length === a.length && e.type === 1) {
		if (e.tagType === 0 && e.codegenNode && e.codegenNode.type === 13 && M(e.codegenNode.children)) e.codegenNode.children = c(Bd(e.codegenNode.children)), s = !0;
		else if (e.tagType === 1 && e.codegenNode && e.codegenNode.type === 13 && e.codegenNode.children && !M(e.codegenNode.children) && e.codegenNode.children.type === 15) {
			let t = l(e.codegenNode, "default");
			t && (t.returns = c(Bd(t.returns)), s = !0);
		} else if (e.tagType === 3 && t && t.type === 1 && t.tagType === 1 && t.codegenNode && t.codegenNode.type === 13 && t.codegenNode.children && !M(t.codegenNode.children) && t.codegenNode.children.type === 15) {
			let n = wf(e, "slot", !0), r = n && n.arg && l(t.codegenNode, n.arg);
			r && (r.returns = c(Bd(r.returns)), s = !0);
		}
	}
	if (!s) for (let e of o) e.codegenNode = n.cache(e.codegenNode);
	function c(e) {
		let t = n.cache(e);
		return t.needArraySpread = !0, t;
	}
	function l(e, t) {
		if (e.children && !M(e.children) && e.children.type === 15) {
			let n = e.children.properties.find((e) => e.key === t || e.key.content === t);
			return n && n.value;
		}
	}
	o.length && n.transformHoist && n.transformHoist(a, n, e);
}
function Mp(e, t) {
	let { constantCache: n } = t;
	switch (e.type) {
		case 1:
			if (e.tagType !== 0) return 0;
			let r = n.get(e);
			if (r !== void 0) return r;
			let i = e.codegenNode;
			if (i.type !== 13 || i.isBlock && e.tag !== "svg" && e.tag !== "foreignObject" && e.tag !== "math") return 0;
			if (i.patchFlag === void 0) {
				let r = 3, a = Fp(e, t);
				if (a === 0) return n.set(e, 0), 0;
				a < r && (r = a);
				for (let i = 0; i < e.children.length; i++) {
					let a = Mp(e.children[i], t);
					if (a === 0) return n.set(e, 0), 0;
					a < r && (r = a);
				}
				if (r > 1) for (let i = 0; i < e.props.length; i++) {
					let a = e.props[i];
					if (a.type === 7 && a.name === "bind" && a.exp) {
						let i = Mp(a.exp, t);
						if (i === 0) return n.set(e, 0), 0;
						i < r && (r = i);
					}
				}
				if (i.isBlock) {
					for (let t = 0; t < e.props.length; t++) if (e.props[t].type === 7) return n.set(e, 0), 0;
					t.removeHelper(td), t.removeHelper(Xd(t.inSSR, i.isComponent)), i.isBlock = !1, t.helper(Yd(t.inSSR, i.isComponent));
				}
				return n.set(e, r), r;
			} else return n.set(e, 0), 0;
		case 2:
		case 3: return 3;
		case 9:
		case 11:
		case 10: return 0;
		case 5:
		case 12: return Mp(e.content, t);
		case 4: return e.constType;
		case 8:
			let a = 3;
			for (let n = 0; n < e.children.length; n++) {
				let r = e.children[n];
				if (F(r) || ce(r)) continue;
				let i = Mp(r, t);
				if (i === 0) return 0;
				i < a && (a = i);
			}
			return a;
		case 20: return 2;
		default: return 0;
	}
}
var Np = /* @__PURE__ */ new Set([
	yd,
	bd,
	xd,
	Sd
]);
function Pp(e, t) {
	if (e.type === 14 && !F(e.callee) && Np.has(e.callee)) {
		let n = e.arguments[0];
		if (n.type === 4) return Mp(n, t);
		if (n.type === 14) return Pp(n, t);
	}
	return 0;
}
function Fp(e, t) {
	let n = 3, r = Ip(e);
	if (r && r.type === 15) {
		let { properties: e } = r;
		for (let r = 0; r < e.length; r++) {
			let { key: i, value: a } = e[r], o = Mp(i, t);
			if (o === 0) return o;
			o < n && (n = o);
			let s;
			if (s = a.type === 4 ? Mp(a, t) : a.type === 14 ? Pp(a, t) : 0, s === 0) return s;
			s < n && (n = s);
		}
	}
	return n;
}
function Ip(e) {
	let t = e.codegenNode;
	if (t.type === 13) return t.props;
}
function Lp(e, { filename: t = "", prefixIdentifiers: n = !1, hoistStatic: r = !1, hmr: i = !1, cacheHandlers: a = !1, nodeTransforms: o = [], directiveTransforms: s = {}, transformHoist: c = null, isBuiltInComponent: l = O, isCustomElement: u = O, expressionPlugins: d = [], scopeId: f = null, slotted: p = !0, ssr: m = !1, inSSR: h = !1, ssrCssVars: g = "", bindingMetadata: _ = E, inline: v = !1, isTS: y = !1, onError: b = uf, onWarn: x = df, compatConfig: S }) {
	let ee = t.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/), C = {
		filename: t,
		selfName: ee && Se(ye(ee[1])),
		prefixIdentifiers: n,
		hoistStatic: r,
		hmr: i,
		cacheHandlers: a,
		nodeTransforms: o,
		directiveTransforms: s,
		transformHoist: c,
		isBuiltInComponent: l,
		isCustomElement: u,
		expressionPlugins: d,
		scopeId: f,
		slotted: p,
		ssr: m,
		inSSR: h,
		ssrCssVars: g,
		bindingMetadata: _,
		inline: v,
		isTS: y,
		onError: b,
		onWarn: x,
		compatConfig: S,
		root: e,
		helpers: /* @__PURE__ */ new Map(),
		components: /* @__PURE__ */ new Set(),
		directives: /* @__PURE__ */ new Set(),
		hoists: [],
		imports: [],
		cached: [],
		constantCache: /* @__PURE__ */ new WeakMap(),
		vForMemoKeyedNodes: /* @__PURE__ */ new WeakSet(),
		temps: 0,
		identifiers: /* @__PURE__ */ Object.create(null),
		scopes: {
			vFor: 0,
			vSlot: 0,
			vPre: 0,
			vOnce: 0
		},
		parent: null,
		grandParent: null,
		currentNode: e,
		childIndex: 0,
		inVOnce: !1,
		helper(e) {
			let t = C.helpers.get(e) || 0;
			return C.helpers.set(e, t + 1), e;
		},
		removeHelper(e) {
			let t = C.helpers.get(e);
			if (t) {
				let n = t - 1;
				n ? C.helpers.set(e, n) : C.helpers.delete(e);
			}
		},
		helperString(e) {
			return `_${Fd[C.helper(e)]}`;
		},
		replaceNode(e) {
			C.parent.children[C.childIndex] = C.currentNode = e;
		},
		removeNode(e) {
			let t = C.parent.children, n = e ? t.indexOf(e) : C.currentNode ? C.childIndex : -1;
			!e || e === C.currentNode ? (C.currentNode = null, C.onNodeRemoved()) : C.childIndex > n && (C.childIndex--, C.onNodeRemoved()), C.parent.children.splice(n, 1);
		},
		onNodeRemoved: O,
		addIdentifiers(e) {},
		removeIdentifiers(e) {},
		hoist(e) {
			F(e) && (e = X(e)), C.hoists.push(e);
			let t = X(`_hoisted_${C.hoists.length}`, !1, e.loc, 2);
			return t.hoisted = e, t;
		},
		cache(e, t = !1, n = !1) {
			let r = qd(C.cached.length, e, t, n);
			return C.cached.push(r), r;
		}
	};
	return C.filters = /* @__PURE__ */ new Set(), C;
}
function Rp(e, t) {
	let n = Lp(e, t);
	Vp(e, n), t.hoistStatic && kp(e, n), t.ssr || zp(e, n), e.helpers = /* @__PURE__ */ new Set([...n.helpers.keys()]), e.components = [...n.components], e.directives = [...n.directives], e.imports = n.imports, e.hoists = n.hoists, e.temps = n.temps, e.cached = n.cached, e.transformed = !0, e.filters = [...n.filters];
}
function zp(e, t) {
	let { helper: n } = t, { children: r } = e;
	if (r.length === 1) {
		let n = Ap(e);
		if (n && n.codegenNode) {
			let r = n.codegenNode;
			r.type === 13 && Zd(r, t), e.codegenNode = r;
		} else e.codegenNode = r[0];
	} else r.length > 1 && (e.codegenNode = zd(t, n(Xu), void 0, e.children, 64, void 0, void 0, !0, void 0, !1));
}
function Bp(e, t) {
	let n = 0, r = () => {
		n--;
	};
	for (; n < e.children.length; n++) {
		let i = e.children[n];
		F(i) || (t.grandParent = t.parent, t.parent = e, t.childIndex = n, t.onNodeRemoved = r, Vp(i, t));
	}
}
function Vp(e, t) {
	t.currentNode = e;
	let { nodeTransforms: n } = t, r = [];
	for (let i = 0; i < n.length; i++) {
		let a = n[i](e, t);
		if (a && (M(a) ? r.push(...a) : r.push(a)), t.currentNode) e = t.currentNode;
		else return;
	}
	switch (e.type) {
		case 3:
			t.ssr || t.helper(od);
			break;
		case 5:
			t.ssr || t.helper(_d);
			break;
		case 9:
			for (let n = 0; n < e.branches.length; n++) Vp(e.branches[n], t);
			break;
		case 10:
		case 11:
		case 1:
		case 0:
			Bp(e, t);
			break;
	}
	t.currentNode = e;
	let i = r.length;
	for (; i--;) r[i]();
}
function Hp(e, t) {
	let n = F(e) ? (t) => t === e : (t) => e.test(t);
	return (e, r) => {
		if (e.type === 1) {
			let { props: i } = e;
			if (e.tagType === 3 && i.some(Af)) return;
			let a = [];
			for (let o = 0; o < i.length; o++) {
				let s = i[o];
				if (s.type === 7 && n(s.name)) {
					i.splice(o, 1), o--;
					let n = t(e, s, r);
					n && a.push(n);
				}
			}
			return a;
		}
	};
}
var Up = "/*@__PURE__*/", Wp = (e) => `${Fd[e]}: _${Fd[e]}`;
function Gp(e, { mode: t = "function", prefixIdentifiers: n = t === "module", sourceMap: r = !1, filename: i = "template.vue.html", scopeId: a = null, optimizeImports: o = !1, runtimeGlobalName: s = "Vue", runtimeModuleName: c = "vue", ssrRuntimeModuleName: l = "vue/server-renderer", ssr: u = !1, isTS: d = !1, inSSR: f = !1 }) {
	let p = {
		mode: t,
		prefixIdentifiers: n,
		sourceMap: r,
		filename: i,
		scopeId: a,
		optimizeImports: o,
		runtimeGlobalName: s,
		runtimeModuleName: c,
		ssrRuntimeModuleName: l,
		ssr: u,
		isTS: d,
		inSSR: f,
		source: e.source,
		code: "",
		column: 1,
		line: 1,
		offset: 0,
		indentLevel: 0,
		pure: !1,
		map: void 0,
		helper(e) {
			return `_${Fd[e]}`;
		},
		push(e, t = -2, n) {
			p.code += e;
		},
		indent() {
			m(++p.indentLevel);
		},
		deindent(e = !1) {
			e ? --p.indentLevel : m(--p.indentLevel);
		},
		newline() {
			m(p.indentLevel);
		}
	};
	function m(e) {
		p.push("\n" + "  ".repeat(e), 0);
	}
	return p;
}
function Kp(e, t = {}) {
	let n = Gp(e, t);
	t.onContextCreated && t.onContextCreated(n);
	let { mode: r, push: i, prefixIdentifiers: a, indent: o, deindent: s, newline: c, scopeId: l, ssr: u } = n, d = Array.from(e.helpers), f = d.length > 0, p = !a && r !== "module";
	if (qp(e, n), i(`function ${u ? "ssrRender" : "render"}(${(u ? [
		"_ctx",
		"_push",
		"_parent",
		"_attrs"
	] : ["_ctx", "_cache"]).join(", ")}) {`), o(), p && (i("with (_ctx) {"), o(), f && (i(`const { ${d.map(Wp).join(", ")} } = _Vue
`, -1), c())), e.components.length && (Jp(e.components, "component", n), (e.directives.length || e.temps > 0) && c()), e.directives.length && (Jp(e.directives, "directive", n), e.temps > 0 && c()), e.filters && e.filters.length && (c(), Jp(e.filters, "filter", n), c()), e.temps > 0) {
		i("let ");
		for (let t = 0; t < e.temps; t++) i(`${t > 0 ? ", " : ""}_temp${t}`);
	}
	return (e.components.length || e.directives.length || e.temps) && (i("\n", 0), c()), u || i("return "), e.codegenNode ? Qp(e.codegenNode, n) : i("null"), p && (s(), i("}")), s(), i("}"), {
		ast: e,
		code: n.code,
		preamble: "",
		map: n.map ? n.map.toJSON() : void 0
	};
}
function qp(e, t) {
	let { ssr: n, prefixIdentifiers: r, push: i, newline: a, runtimeModuleName: o, runtimeGlobalName: s, ssrRuntimeModuleName: c } = t, l = s, u = Array.from(e.helpers);
	u.length > 0 && (i(`const _Vue = ${l}
`, -1), e.hoists.length && i(`const { ${[
		id,
		ad,
		od,
		sd,
		cd
	].filter((e) => u.includes(e)).map(Wp).join(", ")} } = _Vue
`, -1)), Yp(e.hoists, t), a(), i("return ");
}
function Jp(e, t, { helper: n, push: r, newline: i, isTS: a }) {
	let o = n(t === "filter" ? fd : t === "component" ? ld : dd);
	for (let n = 0; n < e.length; n++) {
		let s = e[n], c = s.endsWith("__self");
		c && (s = s.slice(0, -6)), r(`const ${Lf(s, t)} = ${o}(${JSON.stringify(s)}${c ? ", true" : ""})${a ? "!" : ""}`), n < e.length - 1 && i();
	}
}
function Yp(e, t) {
	if (!e.length) return;
	t.pure = !0;
	let { push: n, newline: r } = t;
	r();
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a && (n(`const _hoisted_${i + 1} = `), Qp(a, t), r());
	}
	t.pure = !1;
}
function Xp(e, t) {
	let n = e.length > 3 || !1;
	t.push("["), n && t.indent(), Zp(e, t, n), n && t.deindent(), t.push("]");
}
function Zp(e, t, n = !1, r = !0) {
	let { push: i, newline: a } = t;
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		F(s) ? i(s, -3) : M(s) ? Xp(s, t) : Qp(s, t), o < e.length - 1 && (n ? (r && i(","), a()) : r && i(", "));
	}
}
function Qp(e, t) {
	if (F(e)) {
		t.push(e, -3);
		return;
	}
	if (ce(e)) {
		t.push(t.helper(e));
		return;
	}
	switch (e.type) {
		case 1:
		case 9:
		case 11:
			Qp(e.codegenNode, t);
			break;
		case 2:
			$p(e, t);
			break;
		case 4:
			em(e, t);
			break;
		case 5:
			tm(e, t);
			break;
		case 12:
			Qp(e.codegenNode, t);
			break;
		case 8:
			nm(e, t);
			break;
		case 3:
			im(e, t);
			break;
		case 13:
			am(e, t);
			break;
		case 14:
			sm(e, t);
			break;
		case 15:
			cm(e, t);
			break;
		case 17:
			lm(e, t);
			break;
		case 18:
			um(e, t);
			break;
		case 19:
			dm(e, t);
			break;
		case 20:
			fm(e, t);
			break;
		case 21:
			Zp(e.body, t, !0, !1);
			break;
		case 22: break;
		case 23: break;
		case 24: break;
		case 25: break;
		case 26: break;
		/* v8 ignore start */
		case 10: break;
		default:
	}
}
function $p(e, t) {
	t.push(JSON.stringify(e.content), -3, e);
}
function em(e, t) {
	let { content: n, isStatic: r } = e;
	t.push(r ? JSON.stringify(n) : n, -3, e);
}
function tm(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Up), n(`${r(_d)}(`), Qp(e.content, t), n(")");
}
function nm(e, t) {
	for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		F(r) ? t.push(r, -3) : Qp(r, t);
	}
}
function rm(e, t) {
	let { push: n } = t;
	e.type === 8 ? (n("["), nm(e, t), n("]")) : e.isStatic ? n(gf(e.content) ? e.content : JSON.stringify(e.content), -2, e) : n(`[${e.content}]`, -3, e);
}
function im(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Up), n(`${r(od)}(${JSON.stringify(e.content)})`, -3, e);
}
function am(e, t) {
	let { push: n, helper: r, pure: i } = t, { tag: a, props: o, children: s, patchFlag: c, dynamicProps: l, directives: u, isBlock: d, disableTracking: f, isComponent: p } = e, m;
	c && (m = String(c)), u && n(r(pd) + "("), d && n(`(${r(td)}(${f ? "true" : ""}), `), i && n(Up), n(r(d ? Xd(t.inSSR, p) : Yd(t.inSSR, p)) + "(", -2, e), Zp(om([
		a,
		o,
		s,
		m,
		l
	]), t), n(")"), d && n(")"), u && (n(", "), Qp(u, t), n(")"));
}
function om(e) {
	let t = e.length;
	for (; t-- && e[t] == null;);
	return e.slice(0, t + 1).map((e) => e || "null");
}
function sm(e, t) {
	let { push: n, helper: r, pure: i } = t, a = F(e.callee) ? e.callee : r(e.callee);
	i && n(Up), n(a + "(", -2, e), Zp(e.arguments, t), n(")");
}
function cm(e, t) {
	let { push: n, indent: r, deindent: i, newline: a } = t, { properties: o } = e;
	if (!o.length) {
		n("{}", -2, e);
		return;
	}
	let s = o.length > 1 || !1;
	n(s ? "{" : "{ "), s && r();
	for (let e = 0; e < o.length; e++) {
		let { key: r, value: i } = o[e];
		rm(r, t), n(": "), Qp(i, t), e < o.length - 1 && (n(","), a());
	}
	s && i(), n(s ? "}" : " }");
}
function lm(e, t) {
	Xp(e.elements, t);
}
function um(e, t) {
	let { push: n, indent: r, deindent: i } = t, { params: a, returns: o, body: s, newline: c, isSlot: l } = e;
	l && n(`_${Fd[Ad]}(`), n("(", -2, e), M(a) ? Zp(a, t) : a && Qp(a, t), n(") => "), (c || s) && (n("{"), r()), o ? (c && n("return "), M(o) ? Xp(o, t) : Qp(o, t)) : s && Qp(s, t), (c || s) && (i(), n("}")), l && (e.isNonScopedSlot && n(", undefined, true"), n(")"));
}
function dm(e, t) {
	let { test: n, consequent: r, alternate: i, newline: a } = e, { push: o, indent: s, deindent: c, newline: l } = t;
	if (n.type === 4) {
		let e = !gf(n.content);
		e && o("("), em(n, t), e && o(")");
	} else o("("), Qp(n, t), o(")");
	a && s(), t.indentLevel++, a || o(" "), o("? "), Qp(r, t), t.indentLevel--, a && l(), a || o(" "), o(": ");
	let u = i.type === 19;
	u || t.indentLevel++, Qp(i, t), u || t.indentLevel--, a && c(!0);
}
function fm(e, t) {
	let { push: n, helper: r, indent: i, deindent: a, newline: o } = t, { needPauseTracking: s, needArraySpread: c } = e;
	c && n("[...("), n(`_cache[${e.index}] || (`), s && (i(), n(`${r(Dd)}(-1`), e.inVOnce && n(", true"), n("),"), o(), n("(")), n(`_cache[${e.index}] = `), Qp(e.value, t), s && (n(`).cacheIndex = ${e.index},`), o(), n(`${r(Dd)}(1),`), o(), n(`_cache[${e.index}]`), a()), n(")"), c && n(")]");
}
RegExp("\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b");
var pm = Hp(/^(?:if|else|else-if)$/, (e, t, n) => mm(e, t, n, (e, t, r) => {
	let i = n.parent.children, a = i.indexOf(e), o = 0;
	for (; a-- >= 0;) {
		let e = i[a];
		e && e.type === 9 && (o += e.branches.length);
	}
	return () => {
		if (r) e.codegenNode = gm(t, o, n);
		else {
			let r = vm(e.codegenNode);
			r.alternate = gm(t, o + e.branches.length - 1, n);
		}
	};
}));
function mm(e, t, n, r) {
	if (t.name !== "else" && (!t.exp || !t.exp.content.trim())) {
		let r = t.exp ? t.exp.loc : e.loc;
		n.onError(ff(28, t.loc)), t.exp = X("true", !1, r);
	}
	if (t.name === "if") {
		let i = hm(e, t), a = {
			type: 9,
			loc: Sp(e.loc),
			branches: [i]
		};
		if (n.replaceNode(a), r) return r(a, i, !0);
	} else {
		let i = n.parent.children, a = i.indexOf(e);
		for (; a-- >= -1;) {
			let o = i[a];
			if (o && Hf(o)) {
				n.removeNode(o);
				continue;
			}
			if (o && o.type === 9) {
				(t.name === "else-if" || t.name === "else") && o.branches[o.branches.length - 1].condition === void 0 && n.onError(ff(30, e.loc)), n.removeNode();
				let i = hm(e, t);
				o.branches.push(i);
				let a = r && r(o, i, !1);
				Vp(i, n), a && a(), n.currentNode = null;
			} else n.onError(ff(30, e.loc));
			break;
		}
	}
}
function hm(e, t) {
	let n = e.tagType === 3;
	return {
		type: 10,
		loc: e.loc,
		condition: t.name === "else" ? void 0 : t.exp,
		children: n && !wf(e, "for") ? e.children : [e],
		userKey: Tf(e, "key"),
		isTemplateIf: n
	};
}
function gm(e, t, n) {
	return e.condition ? Kd(e.condition, _m(e, t, n), Wd(n.helper(od), ["\"\"", "true"])) : _m(e, t, n);
}
function _m(e, t, n) {
	let { helper: r } = n, i = Hd("key", X(`${t}`, !1, Ld, 2)), { children: a } = e, o = a[0];
	if (a.length !== 1 || o.type !== 1) if (a.length === 1 && o.type === 11) {
		let e = o.codegenNode;
		return Ff(e, i, n), e;
	} else return zd(n, r(Xu), Vd([i]), a, 64, void 0, void 0, !0, !1, !1, e.loc);
	else {
		let e = o.codegenNode, t = Rf(e);
		return t.type === 13 && Zd(t, n), Ff(t, i, n), e;
	}
}
function vm(e) {
	for (;;) if (e.type === 19) if (e.alternate.type === 19) e = e.alternate;
	else return e;
	else e.type === 20 && (e = e.value);
}
var ym = Hp("for", (e, t, n) => {
	let { helper: r, removeHelper: i } = n;
	return bm(e, t, n, (t) => {
		let a = Wd(r(md), [t.source]), o = jf(e), s = wf(e, "memo"), c = Tf(e, "key", !1, !0);
		c && c.type;
		let l = c && (c.type === 6 ? c.value ? X(c.value.content, !0) : void 0 : c.exp), u = l ? Hd("key", l) : null, d = t.source.type === 4 && t.source.constType > 0, f = d ? 64 : c ? 128 : 256;
		return t.codegenNode = zd(n, r(Xu), void 0, a, f, void 0, void 0, !0, !d, !1, e.loc), () => {
			let c, { children: f } = t, p = f.length !== 1 || f[0].type !== 1, m = Mf(e) ? e : o && e.children.length === 1 && Mf(e.children[0]) ? e.children[0] : null;
			if (m ? (c = m.codegenNode, o && u && Ff(c, u, n)) : p ? c = zd(n, r(Xu), u ? Vd([u]) : void 0, e.children, 64, void 0, void 0, !0, void 0, !1) : (c = f[0].codegenNode, o && u && Ff(c, u, n), c.isBlock !== !d && (c.isBlock ? (i(td), i(Xd(n.inSSR, c.isComponent))) : i(Yd(n.inSSR, c.isComponent))), c.isBlock = !d, c.isBlock ? (r(td), r(Xd(n.inSSR, c.isComponent))) : r(Yd(n.inSSR, c.isComponent))), s) {
				let e = Gd(Sm(t.parseResult, [X("_cached")]));
				e.body = Jd([
					Ud([
						"const _memo = (",
						s.exp,
						")"
					]),
					Ud([
						"if (_cached && _cached.el",
						...l ? [" && _cached.key === ", l] : [],
						` && ${n.helperString(Pd)}(_cached, _memo)) return _cached`
					]),
					Ud(["const _item = ", c]),
					X("_item.memo = _memo"),
					X("return _item")
				]), a.arguments.push(e, X("_cache"), X(String(n.cached.length))), n.cached.push(null);
			} else a.arguments.push(Gd(Sm(t.parseResult), c, !0));
		};
	});
});
function bm(e, t, n, r) {
	if (!t.exp) {
		n.onError(ff(31, t.loc));
		return;
	}
	let i = t.forParseResult;
	if (!i) {
		n.onError(ff(32, t.loc));
		return;
	}
	xm(i, n);
	let { addIdentifiers: a, removeIdentifiers: o, scopes: s } = n, { source: c, value: l, key: u, index: d } = i, f = {
		type: 11,
		loc: t.loc,
		source: c,
		valueAlias: l,
		keyAlias: u,
		objectIndexAlias: d,
		parseResult: i,
		children: jf(e) ? e.children : [e]
	};
	n.replaceNode(f), s.vFor++;
	let p = r && r(f);
	return () => {
		s.vFor--, p && p();
	};
}
function xm(e, t) {
	e.finalized ||= !0;
}
function Sm({ value: e, key: t, index: n }, r = []) {
	return Cm([
		e,
		t,
		n,
		...r
	]);
}
function Cm(e) {
	let t = e.length;
	for (; t-- && !e[t];);
	return e.slice(0, t + 1).map((e, t) => e || X("_".repeat(t + 1), !1));
}
var wm = X("undefined", !1), Tm = (e, t) => {
	if (e.type === 1 && (e.tagType === 1 || e.tagType === 3)) {
		let n = wf(e, "slot");
		if (n) return n.exp, t.scopes.vSlot++, () => {
			t.scopes.vSlot--;
		};
	}
}, Em = (e, t, n, r) => Gd(e, n, !1, !0, n.length ? n[0].loc : r);
function Dm(e, t, n = Em) {
	t.helper(Ad);
	let { children: r, loc: i } = e, a = [], o = [], s = t.scopes.vSlot > 0 || t.scopes.vFor > 0, c = wf(e, "slot", !0);
	if (c) {
		let { arg: e, exp: t } = c;
		e && !pf(e) && (s = !0), a.push(Hd(e || X("default", !0), n(t, void 0, r, i)));
	}
	let l = !1, u = !1, d = [], f = /* @__PURE__ */ new Set(), p = 0;
	for (let e = 0; e < r.length; e++) {
		let i = r[e], m;
		if (!jf(i) || !(m = wf(i, "slot", !0))) {
			i.type !== 3 && d.push(i);
			continue;
		}
		if (c) {
			t.onError(ff(37, m.loc));
			break;
		}
		l = !0;
		let { children: h, loc: g } = i, { arg: _ = X("default", !0), exp: v, loc: y } = m, b;
		pf(_) ? b = _ ? _.content : "default" : s = !0;
		let x = wf(i, "for"), S = n(v, x, h, g), ee, C;
		if (ee = wf(i, "if")) s = !0, o.push(Kd(ee.exp, Om(_, S, p++), wm));
		else if (C = wf(i, /^else(?:-if)?$/, !0)) {
			let n = e, i;
			for (; n-- && (i = r[n], Hf(i)););
			if (i && jf(i) && wf(i, /^(?:else-)?if$/)) {
				let e = o[o.length - 1];
				for (; e.alternate.type === 19;) e = e.alternate;
				e.alternate = C.exp ? Kd(C.exp, Om(_, S, p++), wm) : Om(_, S, p++);
			} else t.onError(ff(30, C.loc));
		} else if (x) {
			s = !0;
			let e = x.forParseResult;
			e ? (xm(e, t), o.push(Wd(t.helper(md), [e.source, Gd(Sm(e), Om(_, S), !0)]))) : t.onError(ff(32, x.loc));
		} else {
			if (b) {
				if (f.has(b)) {
					t.onError(ff(38, y));
					continue;
				}
				f.add(b), b === "default" && (u = !0);
			}
			a.push(Hd(_, S));
		}
	}
	if (!c) {
		let e = (e, r) => {
			let a = n(e, void 0, r, i);
			return t.compatConfig && (a.isNonScopedSlot = !0), Hd("default", a);
		};
		l ? d.length && !d.every(Vf) && (u ? t.onError(ff(39, d[0].loc)) : a.push(e(void 0, d))) : a.push(e(void 0, r));
	}
	let m = s ? 2 : km(e.children) ? 3 : 1, h = Vd(a.concat(Hd("_", X(m + "", !1))), i);
	return o.length && (h = Wd(t.helper(gd), [h, Bd(o)])), {
		slots: h,
		hasDynamicSlots: s
	};
}
function Om(e, t, n) {
	let r = [Hd("name", e), Hd("fn", t)];
	return n != null && r.push(Hd("key", X(String(n), !0))), Vd(r);
}
function km(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		switch (n.type) {
			case 1:
				if (n.tagType === 2 || km(n.children)) return !0;
				break;
			case 9:
				if (km(n.branches)) return !0;
				break;
			case 10:
			case 11:
				if (km(n.children)) return !0;
				break;
		}
	}
	return !1;
}
var Am = /* @__PURE__ */ new WeakMap(), jm = (e, t) => function() {
	if (e = t.currentNode, !(e.type === 1 && (e.tagType === 0 || e.tagType === 1))) return;
	let { tag: n, props: r } = e, i = e.tagType === 1, a = i ? Mm(e, t) : `"${n}"`, o = I(a) && a.callee === ud, s, c, l = 0, u, d, f, p = o || a === Zu || a === Qu || !i && (n === "svg" || n === "foreignObject" || n === "math");
	if (r.length > 0) {
		let n = Nm(e, t, void 0, i, o);
		s = n.props, l = n.patchFlag, d = n.dynamicPropNames;
		let r = n.directives;
		f = r && r.length ? Bd(r.map((e) => Im(e, t))) : void 0, n.shouldUseBlock && (p = !0);
	}
	if (e.children.length > 0) if (a === $u && (p = !0, l |= 1024), i && a !== Zu && a !== $u) {
		let { slots: n, hasDynamicSlots: r } = Dm(e, t);
		c = n, r && (l |= 1024);
	} else if (e.children.length === 1 && a !== Zu) {
		let n = e.children[0], r = n.type, i = r === 5 || r === 8;
		i && Mp(n, t) === 0 && (l |= 1), c = i || r === 2 ? n : e.children;
	} else c = e.children;
	d && d.length && (u = Lm(d)), e.codegenNode = zd(t, a, s, c, l === 0 ? void 0 : l, u, f, !!p, !1, i, e.loc);
};
function Mm(e, t, n = !1) {
	let { tag: r } = e, i = Rm(r), a = Tf(e, "is", !1, !0);
	if (a) if (i || cf("COMPILER_IS_ON_ELEMENT", t)) {
		let e;
		if (a.type === 6 ? e = a.value && X(a.value.content, !0) : (e = a.exp, e ||= X("is", !1, a.arg.loc)), e) return Wd(t.helper(ud), [e]);
	} else a.type === 6 && a.value.content.startsWith("vue:") && (r = a.value.content.slice(4));
	let o = mf(r) || t.isBuiltInComponent(r);
	return o ? (n || t.helper(o), o) : (t.helper(ld), t.components.add(r), Lf(r, "component"));
}
function Nm(e, t, n = e.props, r, i, a = !1) {
	let { tag: o, loc: s, children: c } = e, l = [], u = [], d = [], f = c.length > 0, p = !1, m = 0, h = !1, g = !1, _ = !1, v = !1, y = !1, b = !1, x = [], S = (e) => {
		l.length && (u.push(Vd(Pm(l), s)), l = []), e && u.push(e);
	}, ee = () => {
		t.scopes.vFor > 0 && l.push(Hd(X("ref_for", !0), X("true")));
	}, C = ({ key: e, value: n }) => {
		if (pf(e)) {
			let a = e.content, o = te(a);
			if (o && (!r || i) && a.toLowerCase() !== "onclick" && a !== "onUpdate:modelValue" && !he(a) && (v = !0), o && he(a) && (b = !0), o && n.type === 14 && (n = n.arguments[0]), n.type === 20 || (n.type === 4 || n.type === 8) && Mp(n, t) > 0) return;
			a === "ref" ? h = !0 : a === "class" ? g = !0 : a === "style" ? _ = !0 : a !== "key" && !x.includes(a) && x.push(a), r && (a === "class" || a === "style") && !x.includes(a) && x.push(a);
		} else y = !0;
	};
	for (let i = 0; i < n.length; i++) {
		let c = n[i];
		if (c.type === 6) {
			let { loc: e, name: n, nameLoc: r, value: i } = c;
			if (n === "ref" && (h = !0, ee()), n === "is" && (Rm(o) || i && i.content.startsWith("vue:") || cf("COMPILER_IS_ON_ELEMENT", t))) continue;
			l.push(Hd(X(n, !0, r), X(i ? i.content : "", !0, i ? i.loc : e)));
		} else {
			let { name: n, arg: i, exp: h, loc: g, modifiers: _ } = c, v = n === "bind", b = n === "on";
			if (n === "slot") {
				r || t.onError(ff(40, g));
				continue;
			}
			if (n === "once" || n === "memo" || n === "is" || v && Ef(i, "is") && (Rm(o) || cf("COMPILER_IS_ON_ELEMENT", t)) || b && a) continue;
			if ((v && Ef(i, "key") || b && f && Ef(i, "vue:before-update")) && (p = !0), v && Ef(i, "ref") && ee(), !i && (v || b)) {
				if (y = !0, h) if (v) {
					if (S(), cf("COMPILER_V_BIND_OBJECT_ORDER", t)) {
						u.unshift(h);
						continue;
					}
					ee(), S(), u.push(h);
				} else S({
					type: 14,
					loc: g,
					callee: t.helper(Cd),
					arguments: r ? [h] : [h, "true"]
				});
				else t.onError(ff(v ? 34 : 35, g));
				continue;
			}
			v && _.some((e) => e.content === "prop") && (m |= 32);
			let x = t.directiveTransforms[n];
			if (x) {
				let { props: n, needRuntime: r } = x(c, e, t);
				!a && n.forEach(C), b && i && !pf(i) ? S(Vd(n, s)) : l.push(...n), r && (d.push(c), ce(r) && Am.set(c, r));
			} else ge(n) || (d.push(c), f && (p = !0));
		}
	}
	let w;
	if (u.length ? (S(), w = u.length > 1 ? Wd(t.helper(vd), u, s) : u[0]) : l.length && (w = Vd(Pm(l), s)), y ? m |= 16 : (g && !r && (m |= 2), _ && !r && (m |= 4), x.length && (m |= 8), v && (m |= 32)), !p && (m === 0 || m === 32) && (h || b || d.length > 0) && (m |= 512), !t.inSSR && w) switch (w.type) {
		case 15:
			let e = -1, n = -1, r = !1;
			for (let t = 0; t < w.properties.length; t++) {
				let i = w.properties[t].key;
				pf(i) ? i.content === "class" ? e = t : i.content === "style" && (n = t) : i.isHandlerKey || (r = !0);
			}
			let i = w.properties[e], a = w.properties[n];
			r ? w = Wd(t.helper(xd), [w]) : (i && !pf(i.value) && (i.value = Wd(t.helper(yd), [i.value])), a && (_ || a.value.type === 4 && a.value.content.trim()[0] === "[" || a.value.type === 17) && (a.value = Wd(t.helper(bd), [a.value])));
			break;
		case 14: break;
		default:
			w = Wd(t.helper(xd), [Wd(t.helper(Sd), [w])]);
			break;
	}
	return {
		props: w,
		directives: d,
		patchFlag: m,
		dynamicPropNames: x,
		shouldUseBlock: p
	};
}
function Pm(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.key.type === 8 || !i.key.isStatic) {
			n.push(i);
			continue;
		}
		let a = i.key.content, o = t.get(a);
		o ? (a === "style" || a === "class" || te(a)) && Fm(o, i) : (t.set(a, i), n.push(i));
	}
	return n;
}
function Fm(e, t) {
	e.value.type === 17 ? e.value.elements.push(t.value) : e.value = Bd([e.value, t.value], e.loc);
}
function Im(e, t) {
	let n = [], r = Am.get(e);
	r ? n.push(t.helperString(r)) : (t.helper(dd), t.directives.add(e.name), n.push(Lf(e.name, "directive")));
	let { loc: i } = e;
	if (e.exp && n.push(e.exp), e.arg && (e.exp || n.push("void 0"), n.push(e.arg)), Object.keys(e.modifiers).length) {
		e.arg || (e.exp || n.push("void 0"), n.push("void 0"));
		let t = X("true", !1, i);
		n.push(Vd(e.modifiers.map((e) => Hd(e, t)), i));
	}
	return Bd(n, e.loc);
}
function Lm(e) {
	let t = "[";
	for (let n = 0, r = e.length; n < r; n++) t += JSON.stringify(e[n]), n < r - 1 && (t += ", ");
	return t + "]";
}
function Rm(e) {
	return e === "component" || e === "Component";
}
var zm = (e, t) => {
	if (Mf(e)) {
		let { children: n, loc: r } = e, { slotName: i, slotProps: a } = Bm(e, t), o = [
			t.prefixIdentifiers ? "_ctx.$slots" : "$slots",
			i,
			"{}",
			"undefined",
			"true"
		], s = 2;
		a && (o[2] = a, s = 3), n.length && (o[3] = Gd([], n, !1, !1, r), s = 4), t.scopeId && !t.slotted && (s = 5), o.splice(s), e.codegenNode = Wd(t.helper(hd), o, r);
	}
};
function Bm(e, t) {
	let n = "\"default\"", r, i = [];
	for (let t = 0; t < e.props.length; t++) {
		let r = e.props[t];
		r.type === 6 ? r.value && (r.name === "name" ? n = JSON.stringify(r.value.content) : (r.name = ye(r.name), i.push(r))) : r.name === "bind" && Ef(r.arg, "name") ? r.exp ? n = r.exp : r.arg && r.arg.type === 4 && (n = r.exp = X(ye(r.arg.content), !1, r.arg.loc)) : (r.name === "bind" && r.arg && pf(r.arg) && (r.arg.content = ye(r.arg.content)), i.push(r));
	}
	if (i.length > 0) {
		let { props: n, directives: a } = Nm(e, t, i, !1, !1);
		r = n, a.length && t.onError(ff(36, a[0].loc));
	}
	return {
		slotName: n,
		slotProps: r
	};
}
var Vm = (e, t, n, r) => {
	let { loc: i, modifiers: a, arg: o } = e;
	!e.exp && !a.length && n.onError(ff(35, i));
	let s;
	if (o.type === 4) if (o.isStatic) {
		let e = o.content;
		e.startsWith("vue:") && (e = `vnode-${e.slice(4)}`), s = X(t.tagType !== 0 || e.startsWith("vnode") || !/[A-Z]/.test(e) ? Ce(ye(e)) : `on:${e}`, !0, o.loc);
	} else s = Ud([
		`${n.helperString(Ed)}(`,
		o,
		")"
	]);
	else s = o, s.children.unshift(`${n.helperString(Ed)}(`), s.children.push(")");
	let c = e.exp;
	c && !c.content.trim() && (c = void 0);
	let l = n.cacheHandlers && !c && !n.inVOnce;
	if (c) {
		let e = xf(c), t = !(e || Cf(c)), n = c.content.includes(";");
		(t || l && e) && (c = Ud([
			`${t ? "$event" : "(...args)"} => ${n ? "{" : "("}`,
			c,
			n ? "}" : ")"
		]));
	}
	let u = { props: [Hd(s, c || X("() => {}", !1, i))] };
	return r && (u = r(u)), l && (u.props[0].value = n.cache(u.props[0].value)), u.props.forEach((e) => e.key.isHandlerKey = !0), u;
}, Hm = (e, t, n) => {
	let { modifiers: r, loc: i } = e, a = e.arg, { exp: o } = e;
	return o && o.type === 4 && !o.content.trim() && (o = void 0), a.type === 4 ? a.isStatic || (a.content = a.content ? `${a.content} || ""` : "\"\"") : (a.children.unshift("("), a.children.push(") || \"\"")), r.some((e) => e.content === "camel") && (a.type === 4 ? a.isStatic ? a.content = ye(a.content) : a.content = `${n.helperString(wd)}(${a.content})` : (a.children.unshift(`${n.helperString(wd)}(`), a.children.push(")"))), n.inSSR || (r.some((e) => e.content === "prop") && Um(a, "."), r.some((e) => e.content === "attr") && Um(a, "^")), { props: [Hd(a, o)] };
}, Um = (e, t) => {
	e.type === 4 ? e.isStatic ? e.content = t + e.content : e.content = `\`${t}\${${e.content}}\`` : (e.children.unshift(`'${t}' + (`), e.children.push(")"));
}, Wm = (e, t) => {
	if (e.type === 0 || e.type === 1 || e.type === 11 || e.type === 10) return () => {
		let n = e.children, r, i = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			if (Of(t)) {
				i = !0;
				for (let i = e + 1; i < n.length; i++) {
					let a = n[i];
					if (Of(a)) r ||= n[e] = Ud([t], t.loc), r.children.push(" + ", a), n.splice(i, 1), i--;
					else {
						r = void 0;
						break;
					}
				}
			}
		}
		if (!(!i || n.length === 1 && (e.type === 0 || e.type === 1 && e.tagType === 0 && !e.props.find((e) => e.type === 7 && !t.directiveTransforms[e.name]) && e.tag !== "template"))) for (let e = 0; e < n.length; e++) {
			let r = n[e];
			if (Of(r) || r.type === 8) {
				let i = [];
				(r.type !== 2 || r.content !== " ") && i.push(r), !t.ssr && Mp(r, t) === 0 && i.push("1"), n[e] = {
					type: 12,
					content: r,
					loc: r.loc,
					codegenNode: Wd(t.helper(sd), i)
				};
			}
		}
	};
}, Gm = /* @__PURE__ */ new WeakSet(), Km = (e, t) => {
	if (e.type === 1 && wf(e, "once", !0)) return Gm.has(e) || t.inVOnce || t.inSSR ? void 0 : (Gm.add(e), t.inVOnce = !0, t.helper(Dd), () => {
		t.inVOnce = !1;
		let e = t.currentNode;
		e.codegenNode &&= t.cache(e.codegenNode, !0, !0);
	});
}, qm = (e, t, n) => {
	let { exp: r, arg: i } = e;
	if (!r) return n.onError(ff(41, e.loc)), Jm();
	let a = r.loc.source.trim(), o = r.type === 4 ? r.content : a, s = n.bindingMetadata[a];
	if (s === "props" || s === "props-aliased") return n.onError(ff(44, r.loc)), Jm();
	if (s === "literal-const" || s === "setup-const") return n.onError(ff(45, r.loc)), Jm();
	if (!o.trim() || !xf(r)) return n.onError(ff(42, r.loc)), Jm();
	let c = i || X("modelValue", !0), l = i ? pf(i) ? `onUpdate:${ye(i.content)}` : Ud(["\"onUpdate:\" + ", i]) : "onUpdate:modelValue", u;
	u = Ud([
		`${n.isTS ? "($event: any)" : "$event"} => ((`,
		r,
		") = $event)"
	]);
	let d = [Hd(c, e.exp), Hd(l, u)];
	if (e.modifiers.length && t.tagType === 1) {
		let t = e.modifiers.map((e) => e.content).map((e) => (gf(e) ? e : JSON.stringify(e)) + ": true").join(", "), n = i ? pf(i) ? `${i.content}Modifiers` : Ud([i, " + \"Modifiers\""]) : "modelModifiers";
		d.push(Hd(n, X(`{ ${t} }`, !1, e.loc, 2)));
	}
	return Jm(d);
};
function Jm(e = []) {
	return { props: e };
}
var Ym = /[\w).+\-_$\]]/, Xm = (e, t) => {
	cf("COMPILER_FILTERS", t) && (e.type === 5 ? Zm(e.content, t) : e.type === 1 && e.props.forEach((e) => {
		e.type === 7 && e.name !== "for" && e.exp && Zm(e.exp, t);
	}));
};
function Zm(e, t) {
	if (e.type === 4) Qm(e, t);
	else for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		typeof r == "object" && (r.type === 4 ? Qm(r, t) : r.type === 8 ? Zm(r, t) : r.type === 5 && Zm(r.content, t));
	}
}
function Qm(e, t) {
	let n = e.content, r = !1, i = !1, a = !1, o = !1, s = 0, c = 0, l = 0, u = 0, d, f, p, m, h = [];
	for (p = 0; p < n.length; p++) if (f = d, d = n.charCodeAt(p), r) d === 39 && f !== 92 && (r = !1);
	else if (i) d === 34 && f !== 92 && (i = !1);
	else if (a) d === 96 && f !== 92 && (a = !1);
	else if (o) d === 47 && f !== 92 && (o = !1);
	else if (d === 124 && n.charCodeAt(p + 1) !== 124 && n.charCodeAt(p - 1) !== 124 && !s && !c && !l) m === void 0 ? (u = p + 1, m = n.slice(0, p).trim()) : g();
	else {
		switch (d) {
			case 34:
				i = !0;
				break;
			case 39:
				r = !0;
				break;
			case 96:
				a = !0;
				break;
			case 40:
				l++;
				break;
			case 41:
				l--;
				break;
			case 91:
				c++;
				break;
			case 93:
				c--;
				break;
			case 123:
				s++;
				break;
			case 125:
				s--;
				break;
		}
		if (d === 47) {
			let e = p - 1, t;
			for (; e >= 0 && (t = n.charAt(e), t === " "); e--);
			(!t || !Ym.test(t)) && (o = !0);
		}
	}
	m === void 0 ? m = n.slice(0, p).trim() : u !== 0 && g();
	function g() {
		h.push(n.slice(u, p).trim()), u = p + 1;
	}
	if (h.length) {
		for (p = 0; p < h.length; p++) m = $m(m, h[p], t);
		e.content = m, e.ast = void 0;
	}
}
function $m(e, t, n) {
	n.helper(fd);
	let r = t.indexOf("(");
	if (r < 0) return n.filters.add(t), `${Lf(t, "filter")}(${e})`;
	{
		let i = t.slice(0, r), a = t.slice(r + 1);
		return n.filters.add(i), `${Lf(i, "filter")}(${e}${a === ")" ? a : "," + a}`;
	}
}
var eh = /* @__PURE__ */ new WeakSet(), th = (e, t) => {
	if (e.type === 1) {
		let n = wf(e, "memo");
		return !n || eh.has(e) || t.inSSR ? void 0 : (eh.add(e), () => {
			let r = e.codegenNode || t.currentNode.codegenNode;
			r && r.type === 13 && (e.tagType !== 1 && Zd(r, t), e.codegenNode = Wd(t.helper(Nd), [
				n.exp,
				Gd(void 0, r),
				"_cache",
				String(t.cached.length)
			]), t.cached.push(null));
		});
	}
}, nh = (e, t) => {
	if (e.type === 1) {
		for (let n of e.props) if (n.type === 7 && n.name === "bind" && (!n.exp || n.exp.type === 4 && !n.exp.content.trim()) && n.arg) {
			let e = n.arg;
			if (e.type !== 4 || !e.isStatic) t.onError(ff(53, e.loc)), n.exp = X("", !0, e.loc);
			else {
				let t = ye(e.content);
				(_f.test(t[0]) || t[0] === "-") && (n.exp = X(t, !1, e.loc));
			}
		}
	}
};
function rh(e) {
	return [[
		nh,
		Km,
		pm,
		th,
		ym,
		Xm,
		zm,
		jm,
		Tm,
		Wm
	], {
		on: Vm,
		bind: Hm,
		model: qm
	}];
}
function ih(e, t = {}) {
	let n = t.onError || uf, r = t.mode === "module";
	t.prefixIdentifiers === !0 ? n(ff(48)) : r && n(ff(49)), t.cacheHandlers && n(ff(50)), t.scopeId && !r && n(ff(51));
	let i = A({}, t, { prefixIdentifiers: !1 }), a = F(e) ? Op(e, i) : e, [o, s] = rh();
	return Rp(a, A({}, i, {
		nodeTransforms: [...o, ...t.nodeTransforms || []],
		directiveTransforms: A({}, s, t.directiveTransforms || {})
	})), Kp(a, i);
}
var ah = () => ({ props: [] });
//#endregion
//#region node_modules/.pnpm/@vue+compiler-dom@3.5.39/node_modules/@vue/compiler-dom/dist/compiler-dom.esm-bundler.js
et();
var oh = /* @__PURE__ */ Symbol(""), sh = /* @__PURE__ */ Symbol(""), ch = /* @__PURE__ */ Symbol(""), lh = /* @__PURE__ */ Symbol(""), uh = /* @__PURE__ */ Symbol(""), dh = /* @__PURE__ */ Symbol(""), fh = /* @__PURE__ */ Symbol(""), ph = /* @__PURE__ */ Symbol(""), mh = /* @__PURE__ */ Symbol(""), hh = /* @__PURE__ */ Symbol("");
Id({
	[oh]: "vModelRadio",
	[sh]: "vModelCheckbox",
	[ch]: "vModelText",
	[lh]: "vModelSelect",
	[uh]: "vModelDynamic",
	[dh]: "withModifiers",
	[fh]: "withKeys",
	[ph]: "vShow",
	[mh]: "Transition",
	[hh]: "TransitionGroup"
});
var gh;
function _h(e, t = !1) {
	return gh ||= document.createElement("div"), t ? (gh.innerHTML = `<div foo="${e.replace(/"/g, "&quot;")}">`, gh.children[0].getAttribute("foo")) : (gh.innerHTML = e, gh.textContent);
}
var vh = {
	parseMode: "html",
	isVoidTag: He,
	isNativeTag: (e) => ze(e) || Be(e) || Ve(e),
	isPreTag: (e) => e === "pre",
	isIgnoreNewlineTag: (e) => e === "pre" || e === "textarea",
	decodeEntities: _h,
	isBuiltInComponent: (e) => {
		if (e === "Transition" || e === "transition") return mh;
		if (e === "TransitionGroup" || e === "transition-group") return hh;
	},
	getNamespace(e, t, n) {
		let r = t ? t.ns : n;
		if (t && r === 2) if (t.tag === "annotation-xml") {
			if (e === "svg") return 1;
			t.props.some((e) => e.type === 6 && e.name === "encoding" && e.value != null && (e.value.content === "text/html" || e.value.content === "application/xhtml+xml")) && (r = 0);
		} else /^m(?:[ions]|text)$/.test(t.tag) && e !== "mglyph" && e !== "malignmark" && (r = 0);
		else t && r === 1 && (t.tag === "foreignObject" || t.tag === "desc" || t.tag === "title") && (r = 0);
		if (r === 0) {
			if (e === "svg") return 1;
			if (e === "math") return 2;
		}
		return r;
	}
}, yh = (e) => {
	e.type === 1 && e.props.forEach((t, n) => {
		t.type === 6 && t.name === "style" && t.value && (e.props[n] = {
			type: 7,
			name: "bind",
			arg: X("style", !0, t.loc),
			exp: bh(t.value.content, t.loc),
			modifiers: [],
			loc: t.loc
		});
	});
}, bh = (e, t) => {
	let n = m(e);
	return X(JSON.stringify(n), !1, t, 3);
};
function xh(e, t) {
	return ff(e, t, void 0);
}
var Sh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(xh(54, i)), t.children.length && (n.onError(xh(55, i)), t.children.length = 0), { props: [Hd(X("innerHTML", !0, i), r || X("", !0))] };
}, Ch = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(xh(56, i)), t.children.length && (n.onError(xh(57, i)), t.children.length = 0), { props: [Hd(X("textContent", !0), r ? Mp(r, n) > 0 ? r : Wd(n.helperString(_d), [r], i) : X("", !0))] };
}, wh = (e, t, n) => {
	let r = qm(e, t, n);
	if (!r.props.length || t.tagType === 1) return r;
	e.arg && n.onError(xh(59, e.arg.loc));
	let { tag: i } = t, a = n.isCustomElement(i);
	if (i === "input" || i === "textarea" || i === "select" || a) {
		let o = ch, s = !1;
		if (i === "input" || a) {
			let r = Tf(t, "type");
			if (r) {
				if (r.type === 7) o = uh;
				else if (r.value) switch (r.value.content) {
					case "radio":
						o = oh;
						break;
					case "checkbox":
						o = sh;
						break;
					case "file":
						s = !0, n.onError(xh(60, e.loc));
						break;
					default: break;
				}
			} else Df(t) && (o = uh);
		} else i === "select" && (o = lh);
		s || (r.needRuntime = n.helper(o));
	} else n.onError(xh(58, e.loc));
	return r.props = r.props.filter((e) => !(e.key.type === 4 && e.key.content === "modelValue")), r;
}, Th = /* @__PURE__ */ d("passive,once,capture"), Eh = /* @__PURE__ */ d("stop,prevent,self,ctrl,shift,alt,meta,exact,middle"), Dh = /* @__PURE__ */ d("left,right"), Oh = /* @__PURE__ */ d("onkeyup,onkeydown,onkeypress"), kh = (e, t, n, r) => {
	let i = [], a = [], o = [];
	for (let s = 0; s < t.length; s++) {
		let c = t[s].content;
		c === "native" && lf("COMPILER_V_ON_NATIVE", n, r) || Th(c) ? o.push(c) : Dh(c) ? pf(e) ? Oh(e.content.toLowerCase()) ? i.push(c) : a.push(c) : (i.push(c), a.push(c)) : Eh(c) ? a.push(c) : i.push(c);
	}
	return {
		keyModifiers: i,
		nonKeyModifiers: a,
		eventOptionModifiers: o
	};
}, Ah = (e, t) => pf(e) && e.content.toLowerCase() === "onclick" ? X(t, !0) : e.type === 4 ? e : Ud([
	"(",
	e,
	`) === "onClick" ? "${t}" : (`,
	e,
	")"
]), jh = (e, t, n) => Vm(e, t, n, (t) => {
	let { modifiers: r } = e;
	if (!r.length) return t;
	let { key: i, value: a } = t.props[0], { keyModifiers: o, nonKeyModifiers: s, eventOptionModifiers: c } = kh(i, r, n, e.loc);
	if (s.includes("right") && (i = Ah(i, "onContextmenu")), s.includes("middle") && (i = Ah(i, "onMouseup")), s.length && (a = Wd(n.helper(dh), [a, JSON.stringify(s)])), o.length && (!pf(i) || Oh(i.content.toLowerCase())) && (a = Wd(n.helper(fh), [a, JSON.stringify(o)])), c.length) {
		let e = c.map(Se).join("");
		i = pf(i) ? X(`${i.content}${e}`, !0) : Ud([
			"(",
			i,
			`) + "${e}"`
		]);
	}
	return { props: [Hd(i, a)] };
}), Mh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(xh(62, i)), {
		props: [],
		needRuntime: n.helper(ph)
	};
}, Nh = (e, t) => {
	e.type === 1 && e.tagType === 0 && (e.tag === "script" || e.tag === "style") && t.removeNode();
}, Ph = [yh], Fh = {
	cloak: ah,
	html: Sh,
	text: Ch,
	model: wh,
	on: jh,
	show: Mh
};
function Ih(e, t = {}) {
	return ih(e, A({}, vh, t, {
		nodeTransforms: [
			Nh,
			...Ph,
			...t.nodeTransforms || []
		],
		directiveTransforms: A({}, Fh, t.directiveTransforms || {}),
		transformHoist: null
	}));
}
//#endregion
//#region node_modules/.pnpm/vue@3.5.39/node_modules/vue/dist/vue.esm-bundler.js
var Lh = /* @__PURE__ */ c({
	BaseTransition: () => rs,
	BaseTransitionPropsValidators: () => es,
	Comment: () => dc,
	DeprecationTypes: () => null,
	EffectScope: () => dn,
	ErrorCodes: () => wo,
	ErrorTypeStrings: () => Pc,
	Fragment: () => K,
	KeepAlive: () => xs,
	ReactiveEffect: () => mn,
	Static: () => fc,
	Suspense: () => lc,
	Teleport: () => Xo,
	Text: () => uc,
	TrackOpTypes: () => nr,
	Transition: () => $l,
	TransitionGroup: () => ku,
	TriggerOpTypes: () => rr,
	VueElement: () => Cu,
	assertNumber: () => ur,
	callWithAsyncErrorHandling: () => fr,
	callWithErrorHandling: () => dr,
	camelize: () => ye,
	capitalize: () => Se,
	cloneVNode: () => eo,
	compatUtils: () => null,
	compile: () => zh,
	computed: () => q,
	createApp: () => Gu,
	createBlock: () => Ja,
	createCommentVNode: () => G,
	createElementBlock: () => H,
	createElementVNode: () => U,
	createHydrationRenderer: () => Ta,
	createPropsRestProxy: () => Gi,
	createRenderer: () => wa,
	createSSRApp: () => Ku,
	createSlots: () => Oi,
	createStaticVNode: () => to,
	createTextVNode: () => W,
	createVNode: () => vc,
	customRef: () => en,
	defineAsyncComponent: () => fi,
	defineComponent: () => Zr,
	defineCustomElement: () => gl,
	defineEmits: () => Ni,
	defineExpose: () => Pi,
	defineModel: () => Li,
	defineOptions: () => Fi,
	defineProps: () => Mi,
	defineSSRCustomElement: () => xu,
	defineSlots: () => Ii,
	devtools: () => Fc,
	effect: () => pt,
	effectScope: () => tt,
	getCurrentInstance: () => Sc,
	getCurrentScope: () => nt,
	getCurrentWatcher: () => on,
	getTransitionRawChildren: () => Xr,
	guardReactiveProps: () => $a,
	h: () => yo,
	handleError: () => pr,
	hasInjectionContext: () => jr,
	hydrate: () => Wu,
	hydrateOnIdle: () => hs,
	hydrateOnInteraction: () => vs,
	hydrateOnMediaQuery: () => _s,
	hydrateOnVisible: () => gs,
	initCustomFormatter: () => bo,
	initDirectivesForSSR: () => Ju,
	inject: () => Ar,
	isMemoSame: () => So,
	isProxy: () => Wt,
	isReactive: () => Vt,
	isReadonly: () => Ht,
	isRef: () => qt,
	isRuntimeOnly: () => Ac,
	isShallow: () => Ut,
	isVNode: () => Ya,
	markRaw: () => Kt,
	mergeDefaults: () => Ui,
	mergeModels: () => Wi,
	mergeProps: () => ao,
	nextTick: () => hr,
	nodeOps: () => Kl,
	normalizeClass: () => g,
	normalizeProps: () => _,
	normalizeStyle: () => p,
	onActivated: () => hi,
	onBeforeMount: () => Cs,
	onBeforeUnmount: () => Ds,
	onBeforeUpdate: () => Ts,
	onDeactivated: () => gi,
	onErrorCaptured: () => Si,
	onMounted: () => ws,
	onRenderTracked: () => js,
	onRenderTriggered: () => As,
	onScopeDispose: () => rt,
	onServerPrefetch: () => ks,
	onUnmounted: () => Os,
	onUpdated: () => Es,
	onWatcherCleanup: () => sn,
	openBlock: () => V,
	patchProp: () => yu,
	popScopeId: () => Er,
	provide: () => kr,
	proxyRefs: () => $t,
	pushScopeId: () => Tr,
	queuePostFlushCb: () => yr,
	reactive: () => It,
	readonly: () => Rt,
	ref: () => R,
	registerRuntimeCompiler: () => po,
	render: () => Uu,
	renderList: () => B,
	renderSlot: () => ki,
	resolveComponent: () => Ci,
	resolveDirective: () => Ti,
	resolveDynamicComponent: () => wi,
	resolveFilter: () => null,
	resolveTransitionHooks: () => Kr,
	setBlockTracking: () => Ka,
	setDevtoolsHook: () => Ic,
	setTransitionHooks: () => Yr,
	shallowReactive: () => Lt,
	shallowReadonly: () => zt,
	shallowRef: () => Jt,
	ssrContextKey: () => zo,
	ssrUtils: () => Lc,
	stop: () => mt,
	toDisplayString: () => L,
	toHandlerKey: () => Ce,
	toHandlers: () => ji,
	toRaw: () => Gt,
	toRef: () => nn,
	toRefs: () => tn,
	toValue: () => Qt,
	transformVNodeArgs: () => Za,
	triggerRef: () => Xt,
	unref: () => Zt,
	useAttrs: () => Bi,
	useCssModule: () => yl,
	useCssVars: () => el,
	useHost: () => _l,
	useId: () => Qr,
	useModel: () => ca,
	useSSRContext: () => Bo,
	useShadowRoot: () => vl,
	useSlots: () => zi,
	useTemplateRef: () => ei,
	useTransitionState: () => Ur,
	vModelCheckbox: () => Mu,
	vModelDynamic: () => Pu,
	vModelRadio: () => Nu,
	vModelSelect: () => Y,
	vModelText: () => J,
	vShow: () => au,
	version: () => Mc,
	warn: () => Nc,
	watch: () => Fr,
	watchEffect: () => Mr,
	watchPostEffect: () => Nr,
	watchSyncEffect: () => Pr,
	withAsyncContext: () => Ki,
	withCtx: () => Dr,
	withDefaults: () => Ri,
	withDirectives: () => z,
	withKeys: () => zu,
	withMemo: () => xo,
	withModifiers: () => Lu,
	withScopeId: () => Ro
});
Yu(), et();
var Rh = /* @__PURE__ */ Object.create(null);
function zh(e, t) {
	if (!F(e)) if (e.nodeType) e = e.innerHTML;
	else return O;
	let n = f(e, t), r = Rh[n];
	if (r) return r;
	if (e[0] === "#") {
		let t = document.querySelector(e);
		e = t ? t.innerHTML : "";
	}
	let i = A({
		hoistStatic: !0,
		onError: void 0,
		onWarn: O
	}, t);
	!i.isCustomElement && typeof customElements < "u" && (i.isCustomElement = (e) => !!customElements.get(e));
	let { code: a } = Ih(e, i), o = Function("Vue", a)(zc);
	return o._rc = !0, Rh[n] = o;
}
po(zh);
//#endregion
//#region admin-app/src/shell-contract.mjs
function Bh(e = globalThis.document) {
	let t = e?.querySelector?.("#app");
	if (!t) throw Error("Admin mount target #app was not found");
	if (!t.matches("[data-shell-frame]")) throw Error("Admin mount target must define the shared App Shell boundary");
	return Object.freeze({
		mountSelector: "#app",
		mountTarget: t,
		shellVersion: 1
	});
}
//#endregion
//#region visual-editor/src/platform/visual-editor-entry.mjs
var Vh = "/prototype/visual-editor.html";
function Hh(e, t = {}, n = globalThis.location?.origin) {
	if (!n) throw Error("Visual Editor origin is required");
	let r = String(e || "").trim();
	if (!r) throw Error("Visual Editor mode is required");
	let i = new URL(Vh, n);
	return i.searchParams.set("mode", r), Object.entries(t).forEach(([e, t]) => {
		t != null && t !== "" && i.searchParams.set(e, String(t));
	}), i.toString();
}
var Uh = Object.freeze({
	sectionPreset(e, t, n) {
		return Hh("section-preset", {
			sectionId: e,
			layoutKey: t
		}, n);
	},
	adminLayout(e, t) {
		return Hh("admin-layout", { templateId: e }, t);
	},
	aiDocument(e, t, n) {
		return Hh("ai-document", {
			builderDocumentId: e,
			revision: t
		}, n);
	},
	output(e, t, n, r) {
		return Hh("output", {
			builderDocumentId: e,
			revision: t,
			returnUrl: n
		}, r);
	}
});
//#endregion
//#region admin-app/src/services/template-layout-service.mjs
async function Wh(e, { fetchImpl: t = globalThis.fetch } = {}) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	let r = await t(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(n)}`, { cache: "no-store" }), i = await r.json().catch(() => ({}));
	if (!r.ok) throw Error(i.message || i.error || `Layout request failed (${r.status})`);
	return i;
}
function Gh(e, t = globalThis.location?.origin) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	return Uh.adminLayout(n, t);
}
var Kh = Object.freeze({
	requestLayout: Wh,
	editorUrl: Gh
}), qh = o((() => {
	Yu();
}));
//#endregion
//#region admin-app/src/components/VisualEditorDialogHost.vue?vue&type=style&index=0&scoped=ba4ee7ed&lang.css
qh();
//#endregion
//#region \0plugin-vue:export-helper
var Jh = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, Yh = { class: "visual-editor-dialog-host__surface" }, Xh = { id: "visual-editor-dialog-title" }, Zh = { id: "visual-editor-dialog-description" }, Qh = { class: "visual-editor-dialog-host__save-target" }, $h = ["aria-busy"], eg = ["src", "title"], tg = {
	key: 0,
	class: "visual-editor-dialog-host__loading",
	role: "status"
}, ng = {
	key: 1,
	class: "visual-editor-dialog-host__readonly"
}, rg = /*#__PURE__*/ Jh({
	__name: "VisualEditorDialogHost",
	props: {
		title: {
			type: String,
			required: !0
		},
		description: {
			type: String,
			default: ""
		},
		editorUrl: {
			type: String,
			required: !0
		},
		iframeTitle: {
			type: String,
			required: !0
		},
		saveTargetLabel: {
			type: String,
			required: !0
		},
		readOnly: {
			type: Boolean,
			default: !1
		},
		readOnlyMessage: {
			type: String,
			default: "읽기 전용 상태입니다."
		}
	},
	emits: ["close", "editor-message"],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ R(null), i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ R(!0), o = /* @__PURE__ */ R(!1), s = null;
		function c(e) {
			if (e.origin !== globalThis.location.origin || e.source !== i.value?.contentWindow) return;
			let t = e.data || {};
			t.type === "promo-visual-editor-dirty-state" && (o.value = !!t.dirty), [
				"promo-section-layout-saved",
				"promo-admin-layout-saved",
				"promo-ai-document-saved"
			].includes(t.type) && (o.value = !1), n("editor-message", t);
		}
		function l() {
			o.value && !globalThis.confirm("저장하지 않은 변경사항이 있습니다. 편집기를 닫을까요?") || (r.value?.open ? r.value.close() : n("close"));
		}
		function u(e) {
			e.target === r.value && l();
		}
		function d() {
			globalThis.document.body.classList.remove("visual-editor-dialog-open"), n("close"), hr(() => s?.focus?.());
		}
		return ws(async () => {
			s = globalThis.document.activeElement, globalThis.addEventListener("message", c), globalThis.document.body.classList.add("visual-editor-dialog-open"), await hr(), r.value && !r.value.open && r.value.showModal();
		}), Ds(() => {
			globalThis.removeEventListener("message", c), r.value?.open && r.value.close(), globalThis.document.body.classList.remove("visual-editor-dialog-open");
		}), (t, n) => (V(), H("dialog", {
			ref_key: "dialog",
			ref: r,
			class: "visual-editor-dialog-host",
			"aria-labelledby": "visual-editor-dialog-title",
			"aria-describedby": "visual-editor-dialog-description",
			onClick: u,
			onCancel: Lu(l, ["prevent"]),
			onClose: d
		}, [U("section", Yh, [U("header", null, [U("div", null, [
			U("strong", Xh, L(e.title), 1),
			U("small", Zh, L(e.description), 1),
			U("span", Qh, "저장 대상: " + L(e.saveTargetLabel), 1)
		]), U("button", {
			class: "tiny-button",
			type: "button",
			"aria-label": "Visual Editor 모달 닫기",
			onClick: l
		}, "닫기")]), U("div", {
			class: "visual-editor-dialog-host__frame-wrap",
			"aria-busy": a.value ? "true" : "false"
		}, [U("iframe", {
			ref_key: "frame",
			ref: i,
			class: g(["visual-editor-dialog-host__frame", { "is-readonly": e.readOnly }]),
			src: e.editorUrl,
			title: e.iframeTitle,
			onLoad: n[0] ||= (e) => a.value = !1
		}, null, 42, eg), a.value ? (V(), H("div", tg, "공통 Visual Editor를 불러오는 중입니다.")) : e.readOnly ? (V(), H("div", ng, L(e.readOnlyMessage), 1)) : G("", !0)], 8, $h)])], 544));
	}
}, [["__scopeId", "data-v-ba4ee7ed"]]);
//#endregion
//#region admin-app/src/components/TemplateLayoutManager.vue
qh();
var ig = {
	name: "TemplateLayoutManager",
	components: { VisualEditorDialogHost: rg },
	props: {
		template: {
			type: Object,
			required: !0
		},
		statusLabel: {
			type: Function,
			required: !0
		},
		translate: {
			type: Function,
			required: !0
		}
	},
	emits: ["layout-saved"],
	data() {
		return {
			layoutRevision: null,
			loading: !1,
			error: "",
			requestRevision: 0,
			frameRevision: 0,
			editorOpen: !1
		};
	},
	computed: {
		headingId() {
			return `template-layout-manager-${String(this.template?.id || "none").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
		},
		editable() {
			return this.template?.status === "draft";
		},
		editorUrl() {
			if (!this.template?.id) return "";
			let e = new URL(Kh.editorUrl(this.template.id));
			return e.searchParams.set("embedded", "1"), e.searchParams.set("frameRevision", String(this.frameRevision)), e.toString();
		}
	},
	watch: { "template.id": {
		immediate: !0,
		handler() {
			this.editorOpen = !1, this.loadLayout();
		}
	} },
	beforeUnmount() {
		this.requestRevision += 1;
	},
	methods: {
		async loadLayout() {
			let e = ++this.requestRevision;
			if (this.layoutRevision = null, this.error = "", !this.template?.id) {
				this.loading = !1;
				return;
			}
			this.loading = !0;
			try {
				let t = await Kh.requestLayout(this.template.id);
				if (e !== this.requestRevision) return;
				this.layoutRevision = Number(t.layout?.layoutRevision || 1);
			} catch (t) {
				if (e !== this.requestRevision) return;
				this.error = t.message;
			} finally {
				e === this.requestRevision && (this.loading = !1);
			}
		},
		openEditor() {
			this.frameRevision += 1, this.editorOpen = !0;
		},
		closeEditor() {
			this.editorOpen = !1;
		},
		handleEditorMessage(e) {
			e.type !== "promo-admin-layout-saved" || e.templateId !== this.template?.id || (this.layoutRevision = Number(e.layoutRevision || this.layoutRevision || 1), this.$emit("layout-saved", e));
		}
	}
}, ag = ["aria-labelledby"], og = { class: "template-layout-manager__header" }, sg = { class: "template-layout-settings-eyebrow" }, cg = ["id"], lg = ["disabled"], ug = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
};
function dg(e, t, n, r, i, a) {
	let o = Ci("visual-editor-dialog-host");
	return V(), H("section", {
		class: "template-layout-manager",
		"aria-labelledby": a.headingId
	}, [
		U("div", og, [U("div", null, [
			U("span", sg, L(n.translate("admin.templateLayout.eyebrow")), 1),
			U("h3", { id: a.headingId }, L(n.template.name) + " · 템플릿 기본 레이아웃", 9, cg),
			U("small", null, [W(" v" + L(n.template.version) + " · " + L(n.statusLabel(n.template.status)) + " ", 1), i.layoutRevision ? (V(), H(K, { key: 0 }, [W(" · " + L(n.translate("admin.templateLayout.revision")) + " r" + L(i.layoutRevision), 1)], 64)) : G("", !0)]),
			t[1] ||= U("small", null, "저장 범위: 선택한 템플릿의 기본 레이아웃", -1)
		]), U("button", {
			class: "tiny-button",
			type: "button",
			"aria-haspopup": "dialog",
			disabled: i.loading || !a.editorUrl,
			onClick: t[0] ||= (...e) => a.openEditor && a.openEditor(...e)
		}, L(a.editable ? "템플릿 기본 레이아웃 편집" : "템플릿 기본 레이아웃 보기"), 9, lg)]),
		i.error ? (V(), H("div", ug, [t[2] ||= U("strong", null, "템플릿 기본 레이아웃 오류", -1), U("span", null, L(i.error), 1)])) : G("", !0),
		i.editorOpen ? (V(), Ja(o, {
			key: 1,
			title: `${n.template.name} · 템플릿 기본 레이아웃 편집기`,
			description: `v${n.template.version} · layout r${i.layoutRevision || 1}`,
			"editor-url": a.editorUrl,
			"iframe-title": `${n.template.name} 템플릿 기본 레이아웃 편집기`,
			"save-target-label": "선택한 템플릿의 기본 레이아웃",
			"read-only": !a.editable,
			"read-only-message": "읽기 전용 템플릿입니다. 왼쪽 템플릿 설정에서 수정하여 초안을 만든 뒤 편집하세요.",
			onEditorMessage: a.handleEditorMessage,
			onClose: a.closeEditor
		}, null, 8, [
			"title",
			"description",
			"editor-url",
			"iframe-title",
			"read-only",
			"onEditorMessage",
			"onClose"
		])) : G("", !0)
	], 8, ag);
}
var fg = /*#__PURE__*/ Jh(ig, [["render", dg], ["__scopeId", "data-v-989daa96"]]);
//#endregion
//#region admin-app/src/services/design-token-service.mjs
async function pg(e, t = {}, n = globalThis.fetch) {
	let r = await n(e, {
		cache: "no-store",
		...t,
		headers: {
			...t.body ? { "Content-Type": "application/json" } : {},
			...t.headers || {}
		}
	}), i = await r.json().catch(() => ({}));
	if (!r.ok) {
		let e = Error(i.message || i.error || `Request failed (${r.status})`);
		throw e.status = r.status, e.details = i, e;
	}
	return i;
}
var mg = (e, t) => ({
	method: e,
	body: JSON.stringify(t)
}), hg = Object.freeze({
	usagePolicy: (e = "") => pg(`/api/design-token-usage-policy${e ? `?versionId=${encodeURIComponent(e)}` : ""}`),
	saveUsagePolicy: (e) => pg("/api/design-token-usage-policy", mg("POST", e)),
	library: (e = "") => pg(`/api/design-token-library${e ? `?versionId=${encodeURIComponent(e)}` : ""}`),
	saveLibrary: (e) => pg("/api/design-token-library", mg("POST", e)),
	list: () => pg("/api/design-token-sets"),
	catalog: () => pg("/api/design-token-catalog-import"),
	registerDefinitions: (e) => pg("/api/design-token-catalog-import", mg("POST", e)),
	detail: (e) => pg(`/api/design-token-set?versionId=${encodeURIComponent(e)}`),
	usage: (e) => pg(`/api/design-token-set-usage?tokenSetId=${encodeURIComponent(e)}`),
	createSet: (e) => pg("/api/design-token-sets", mg("POST", e)),
	cloneSet: (e) => pg("/api/design-token-set-clone", mg("POST", e)),
	updateMetadata: (e) => pg("/api/design-token-set-metadata", mg("PATCH", e)),
	createDraft: (e) => pg("/api/design-token-set-draft", mg("POST", e)),
	saveVersion: (e) => pg("/api/design-token-set-version", mg("PUT", e)),
	importCsv: (e) => pg("/api/design-token-set-import", mg("POST", e)),
	validate: (e) => pg("/api/design-token-set-validate", mg("POST", e)),
	activate: (e) => pg("/api/design-token-set-activate", mg("POST", e)),
	publish: (e) => pg("/api/design-token-set-publish", mg("POST", e)),
	updateStatus: (e) => pg("/api/design-token-set-status", mg("POST", e)),
	deleteSet: (e) => pg("/api/design-token-set-delete", mg("POST", e)),
	archive: (e) => pg("/api/design-token-set-archive", mg("POST", e))
}), gg = (e, t, n, r, i = [], a = !1, o = "default") => ({
	key: e,
	target: t,
	property: n,
	label: r,
	defaults: i,
	required: a,
	state: o
}), _g = Object.freeze([
	gg("page.background", "page", "background-color", "페이지 배경", ["--color-bg-dark-800"], !0),
	gg("text.primary", "text", "color", "일반 텍스트 · 기본", [], !0),
	gg("text.muted", "text", "color", "일반 텍스트 · 보조"),
	gg("text.font", "text", "font-family", "기본 글꼴", ["--typography-body-lg-typeface", "--typeface-roboto"], !0),
	gg("text.bodySize", "text", "font-size", "본문 크기", ["--typography-body-md-font-size"], !0),
	gg("text.titleSize", "text", "font-size", "제목 크기", ["--typography-title-lg-font-size"], !0),
	gg("text.bodyWeight", "text", "font-weight", "본문 굵기", ["--font-weight-400"]),
	gg("text.titleWeight", "text", "font-weight", "제목 굵기", ["--font-weight-700"]),
	gg("text.bodyLineHeight", "text", "line-height", "본문 줄 높이", ["--typography-body-md-line-height", "--typography-body-md-line-hight"]),
	gg("text.titleLineHeight", "text", "line-height", "제목 줄 높이", ["--typography-title-lg-line-height", "--typography-title-lg-line-hight"]),
	gg("card.background", "card", "background-color", "카드 배경", ["--card-container-default"], !0),
	gg("card.radius", "card", "border-radius", "카드 모서리", ["--border-radius-md"]),
	gg("card.shadow", "card", "box-shadow", "카드 그림자", ["--shadow-elevation-1"]),
	gg("card.padding", "card", "padding", "카드 패딩", ["--spacing-24"]),
	gg("layout.gap", "layout", "gap", "요소 간격", ["--spacing-16"]),
	gg("layout.padding", "layout", "padding", "섹션 패딩", ["--spacing-32"]),
	gg("button.background", "button", "background-color", "주요 버튼 배경", ["--button-container-brand-default"], !0),
	gg("button.color", "button", "color", "주요 버튼 문구", ["--button-label-on-color", "--button-label-default"], !0),
	gg("button.radius", "button", "border-radius", "버튼 모서리", ["--border-radius-md"]),
	gg("button.padding", "button", "padding", "버튼 좌우 패딩", ["--spacing-16"]),
	gg("button.border", "button", "border-color", "버튼 테두리", ["--button-border-brand-default"]),
	gg("button.borderWidth", "button", "border-width", "버튼 테두리 두께", ["--border-width-sm", "--border-width-1"]),
	gg("button.font", "button", "font-family", "버튼 글꼴", ["--typography-body-lg-typeface", "--typeface-roboto"]),
	gg("button.lineHeight", "button", "line-height", "버튼 줄 높이", ["--typography-body-md-line-height", "--typography-body-md-line-hight"]),
	gg("button.size", "button", "font-size", "버튼 글자 크기", ["--typography-label-md-font-size"]),
	gg("button.weight", "button", "font-weight", "버튼 글자 굵기", ["--font-weight-600"]),
	gg("button.hoverBackground", "button", "background-color", "버튼 배경 · hover", ["--button-container-brand-hover"], !1, "hover"),
	gg("button.pressedBackground", "button", "background-color", "버튼 배경 · pressed", ["--button-container-brand-pressed"], !1, "pressed"),
	gg("button.disabledBackground", "button", "background-color", "버튼 배경 · disabled", ["--button-container-brand-disable"], !1, "disabled"),
	gg("button.disabledColor", "button", "color", "버튼 문구 · disabled", ["--button-label-disable"], !1, "disabled"),
	gg("divider.color", "divider", "border-color", "구분선 색상"),
	gg("divider.width", "divider", "border-width", "구분선 두께", ["--border-width-sm", "--border-width-1"])
]), vg = Object.freeze({
	text: [
		"color",
		"font-size",
		"font-family",
		"font-weight",
		"line-height",
		"letter-spacing"
	],
	page: [
		"background-color",
		"background-image",
		"border-color",
		"border-width",
		"border-style"
	],
	card: [
		"background-color",
		"border-color",
		"border-width",
		"border-style"
	],
	button: [
		"background-color",
		"color",
		"border-color",
		"border-width",
		"border-style"
	],
	icon: ["color", "font-size"],
	divider: [
		"border-color",
		"border-width",
		"border-style"
	],
	layout: ["min-height", "height"]
});
function yg(e) {
	let t = 2166136261, n = 2246822519;
	for (let r of e) {
		let e = r.charCodeAt(0);
		t = Math.imul(t ^ e, 16777619), n = Math.imul(n ^ e, 3266489917);
	}
	return (t >>> 0).toString(36).padStart(7, "0") + (n >>> 0).toString(36).padStart(7, "0");
}
function bg(e = {}, { bounded: t = !1 } = {}) {
	let n = [..._g];
	if (e.styleChoicesVersion !== 1) return n;
	let r = e.tokenCatalog || [], i = e.tokenValues || {};
	for (let [e, a] of Object.entries(vg)) for (let o of a) {
		let a = {
			target: e,
			property: o,
			state: "default"
		}, s = r.filter((t) => {
			let n = t.name || t.tokenKey;
			return /^--[a-zA-Z][a-zA-Z0-9-]*$/.test(n || "") && !n.startsWith("--app-") && typeof i[n] == "string" && i[n] === t.value && !/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(i[n]) && !(e === "text" && o === "color" && /^--color-bg-/.test(n)) && Tg(t, a, r);
		}).sort((e, t) => {
			let n = (e) => +!/typography-(title|body|label)|text-|label-|border-/.test(e.name || e.tokenKey), r = e.name || e.tokenKey, i = t.name || t.tokenKey;
			return n(e) - n(t) || (r < i ? -1 : +(r > i));
		});
		if (t) {
			let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
			for (let e of s) {
				let n = e.name || e.tokenKey, r = n.match(/^--(?:typography-(?:title|body|label)|color-[a-z]+|[a-z]+-[a-z]+)/)?.[0] || n;
				t.has(r) || t.set(r, []), t.get(r).push(e);
			}
			let r = e === "text" ? {
				color: 6,
				"font-size": 8,
				"font-family": 2,
				"font-weight": 4,
				"line-height": 8
			}[o] || 4 : e === "icon" ? 6 : e === "layout" || o === "border-width" || o === "border-style" || o === "background-image" ? 3 : 4;
			for (s = []; s.length < r && [...t.values()].some((e) => e.length);) for (let e of t.values()) {
				let t = e.shift();
				if (!(!t || n.has(t.value)) && (n.add(t.value), s.push(t), s.length === r)) break;
			}
		}
		for (let t of s) {
			let r = t.name || t.tokenKey;
			n.push({
				key: `registered.${e}.v${yg(o + ":" + r)}`,
				target: e,
				property: o,
				state: "default",
				label: r,
				token: r,
				registeredVariant: !0
			});
		}
	}
	return n;
}
function xg(e, t) {
	return t?.registeredVariant ? t.token : e.usagePolicy?.bindings?.[t?.key];
}
function Sg(e, t, n, r, i = bg(n)) {
	let a = /* @__PURE__ */ new Map(), o = e.type === "text" ? [
		"text.primary",
		"text.font",
		e.role === "heading" ? "text.titleSize" : "text.bodySize"
	] : e.type === "button" ? ["button.background", "button.color"] : e.type === "divider" ? ["divider.color", "divider.width"] : e.type === "container" && e.role === "page" ? ["page.background"] : [];
	for (let s of [
		...o,
		...e.styles.base,
		...t === "desktop" ? [] : e.styles[t] || []
	]) {
		let e = i.find((e) => e.key === s), t = xg(n, e);
		e && r.includes(e.target) && /^--[a-zA-Z][a-zA-Z0-9-]*$/.test(t || "") && Object.hasOwn(n.tokenValues || {}, t) && a.set(`${e.property}:${e.state}`, {
			...e,
			token: t
		});
	}
	if (n.styleChoicesVersion === 1 && e.type === "icon") {
		for (let [e, t] of [["color", "text.primary"], ["font-size", "text.bodySize"]]) if (!a.has(e + ":default")) {
			let r = i.filter((t) => t.target === "icon" && t.property === e && xg(n, t)), o = r.find((e) => xg(n, e) === n.usagePolicy?.bindings?.[t]) || r[0];
			o && a.set(e + ":default", {
				...o,
				token: xg(n, o)
			});
		}
	}
	if (n.styleChoicesVersion === 1 && (e.type === "divider" || [
		"border-color:default",
		"border-width:default",
		"border-style:default"
	].some((e) => a.has(e)))) {
		for (let e of [
			"border-color",
			"border-width",
			"border-style"
		]) if (!a.has(e + ":default")) {
			let t = i.filter((t) => r.includes(t.target) && t.property === e && xg(n, t)), o = e === "border-style" && t.find((e) => n.tokenValues[xg(n, e)] === "solid") || t[0];
			o && a.set(e + ":default", {
				...o,
				token: xg(n, o)
			});
		}
	}
	return [...a.values()];
}
var Cg = /* @__PURE__ */ new Set([
	"button",
	"card",
	"icon",
	"checkbox",
	"chip",
	"field",
	"modal",
	"navigation",
	"radio",
	"select",
	"tab",
	"tooltip",
	"toast",
	"badge",
	"switch",
	"avatar",
	"divider",
	"progress",
	"slider"
]);
function wg(e) {
	let t = String(e || "").replace(/^--/, "").split("-")[0];
	return Cg.has(t) ? t : "shared";
}
function Tg(e, t, n = []) {
	if (!e || !t || e.state === "incomplete" || e.state === "draft") return !1;
	let r = e.name || e.tokenKey;
	if (/^--render-policy-/.test(r)) return !1;
	let i = wg(r);
	if (i !== "shared" && i !== t.target || !(e.cssProperties || []).includes(t.property)) return !1;
	if (e.reference && n.length) {
		let i = new Map(n.map((e) => [e.name || e.tokenKey, e])), a = /* @__PURE__ */ new Set([r]), o = e.reference;
		for (; o;) {
			if (a.has(o)) return !1;
			a.add(o);
			let e = i.get(o);
			if (!e) return !1;
			let n = wg(o);
			if (n !== "shared" && n !== t.target) return !1;
			o = e.reference;
		}
	}
	if (t.state === "default" && /-(hover|pressed|disable|disabled|selected|focused)$/.test(r)) return !1;
	if (t.state !== "default") {
		let e = t.state === "disabled" ? "(?:disable|disabled)" : t.state;
		if (i !== "shared" && !RegExp(`-${e}$`).test(r)) return !1;
	}
	return !0;
}
function Eg(e, t = [], { activation: n = !1 } = {}) {
	let r = [], i = [], a = new Map(t.map((e) => [e.name || e.tokenKey, e]));
	if (e?.schemaVersion !== 1 || !e.bindings || typeof e.bindings != "object" || Array.isArray(e.bindings)) return {
		ok: !1,
		errors: [{
			code: "INVALID_POLICY",
			message: "정책 형식이 올바르지 않습니다."
		}],
		missing: []
	};
	for (let t of Object.keys(e.bindings)) _g.some((e) => e.key === t) || r.push({
		key: t,
		code: "UNKNOWN_POLICY_RULE",
		message: "지원하지 않는 정책 항목입니다."
	});
	for (let n of _g) {
		let o = e.bindings[n.key];
		if (!o) {
			n.required && i.push(n.key);
			continue;
		}
		(typeof o != "string" || !Tg(a.get(o), n, t)) && r.push({
			key: n.key,
			token: o,
			code: "TOKEN_USAGE_MISMATCH",
			message: `${n.label}: 등록 여부·대상·속성·상태를 확인하세요.`
		});
	}
	if (n) for (let e of i) r.push({
		key: e,
		code: "REQUIRED_MAPPING_MISSING",
		message: `필수 연결이 없습니다: ${_g.find((t) => t.key === e).label}`
	});
	return {
		ok: !r.length,
		errors: r,
		missing: i
	};
}
function Dg(e, t, n = {}) {
	let r = e?.bindings?.[t];
	return typeof r == "string" && typeof n[r] == "string" && n[r].trim() ? r : "";
}
function Og(e, t = {}) {
	return Object.fromEntries(Object.entries({
		"--promo-bg": "page.background",
		"--promo-ink": "text.primary",
		"--promo-muted-ink": "text.muted",
		"--promo-font": "text.font",
		"--promo-font-size-body": "text.bodySize",
		"--promo-title-size": "text.titleSize",
		"--promo-font-weight-body": "text.bodyWeight",
		"--promo-font-weight-title": "text.titleWeight",
		"--promo-line-height-body": "text.bodyLineHeight",
		"--promo-line-height-title": "text.titleLineHeight",
		"--promo-component-radius": "card.radius",
		"--promo-component-shadow": "card.shadow",
		"--component-content-padding": "card.padding",
		"--component-field-gap": "layout.gap",
		"--promo-layout-gap": "layout.gap",
		"--promo-layout-padding": "layout.padding",
		"--promo-cta-bg": "button.background",
		"--promo-cta": "button.background",
		"--promo-accent": "button.background",
		"--promo-cta-ink": "button.color",
		"--promo-cta-radius": "button.radius",
		"--promo-space-4": "button.padding",
		"--promo-button-border": "button.border",
		"--promo-border-width": "button.borderWidth",
		"--promo-button-font": "button.font",
		"--promo-button-line-height": "button.lineHeight",
		"--promo-font-size-button": "button.size",
		"--promo-button-weight": "button.weight",
		"--promo-button-hover-bg": "button.hoverBackground",
		"--promo-button-pressed-bg": "button.pressedBackground",
		"--promo-button-disabled-bg": "button.disabledBackground",
		"--promo-button-disabled-color": "button.disabledColor"
	}).flatMap(([n, r]) => {
		let i = Dg(e, r, t);
		return i ? [[n.replace(/^--promo-/, "--render-policy-").replace(/^--component-/, "--render-policy-component-"), `var(${i})`]] : [];
	}));
}
function kg(e, { target: t, property: n, state: r = "default", tokenKey: i }) {
	return _g.some((a) => a.target === t && a.property === n && a.state === r && e?.bindings?.[a.key] === i);
}
function Ag(e, { fieldKind: t = "", tag: n = "", sectionRole: r = "" } = {}) {
	return t === "cta" || ["a", "button"].includes(n) ? "button" : [
		"gap",
		"padding",
		"margin"
	].includes(e) ? e === "padding" ? "card" : "layout" : [
		"background-color",
		"border-radius",
		"box-shadow"
	].includes(e) ? ["section", "main"].includes(n) || r === "page" ? "page" : "card" : "text";
}
function jg(e, { tokenKey: t, property: n, target: r, state: i = "default", path: a = "" }) {
	return kg(e, {
		target: r,
		property: n,
		state: i,
		tokenKey: t
	}) ? [] : [{
		code: "TOKEN_USAGE_POLICY_MISMATCH",
		path: a,
		tokenKey: t,
		target: r,
		property: n,
		state: i,
		message: "등록 토큰의 대상·속성·상태가 중앙 정책과 다릅니다."
	}];
}
//#endregion
//#region admin-app/src/components/TokenUsagePolicyManager.vue
qh();
var Mg = { class: "token-usage-policy" }, Ng = {
	key: 0,
	role: "alert",
	class: "policy-error"
}, Pg = {
	key: 1,
	role: "status"
}, Fg = ["disabled"], Ig = { class: "policy-toolbar" }, Lg = ["value", "disabled"], Rg = {
	key: 0,
	value: ""
}, zg = ["value"], Bg = ["disabled"], Vg = ["disabled"], Hg = ["disabled"], Ug = { key: 0 }, Wg = {
	key: 1,
	role: "status"
}, Gg = {
	key: 2,
	class: "policy-error"
}, Kg = { class: "policy-table" }, qg = { scope: "row" }, Jg = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], Yg = ["value"], Xg = ["value"], Zg = /*#__PURE__*/ Jh({
	__name: "TokenUsagePolicyManager",
	props: {
		tokenVersionId: { default: null },
		blocked: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(null), r = /* @__PURE__ */ R([]), i = /* @__PURE__ */ R([]), a = /* @__PURE__ */ R(null), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(null), c = /* @__PURE__ */ R(null), l = /* @__PURE__ */ R(!1), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R(""), p = q(() => n.value && JSON.stringify(n.value) !== f.value), m = q(() => n.value ? Eg(n.value, r.value, { activation: !0 }) : {
			errors: [],
			missing: []
		});
		async function h(e = "") {
			if (!(p.value && !globalThis.confirm("저장하지 않은 정책 변경사항을 버릴까요?"))) {
				l.value = !0, u.value = "";
				try {
					let t = await hg.usagePolicy(e);
					n.value = t.policy, r.value = t.catalog, i.value = t.versions, a.value = t.headId, o.value = t.activeId, s.value = t.selectedId, c.value = t.tokenVersionId, f.value = JSON.stringify(n.value);
				} catch (e) {
					u.value = e.message;
				} finally {
					l.value = !1;
				}
			}
		}
		async function g(e = !1) {
			l.value = !0, u.value = "", d.value = "";
			try {
				await hg.saveUsagePolicy({
					policy: n.value,
					tokenVersionId: c.value,
					expectedHeadId: a.value,
					activate: e
				}), f.value = JSON.stringify(n.value), await h(), d.value = e ? "정책을 활성화했습니다. 새 생성부터 적용됩니다." : "정책 Draft를 저장했습니다.";
			} catch (e) {
				u.value = e.details?.errors?.map((e) => e.message).join("\n") || e.message;
			} finally {
				l.value = !1;
			}
		}
		let _ = (e) => r.value.filter((t) => Tg(t, e, r.value));
		function v(e) {
			p.value && (e.preventDefault(), e.returnValue = "");
		}
		return ws(() => {
			h(), globalThis.addEventListener("beforeunload", v);
		}), Ds(() => globalThis.removeEventListener("beforeunload", v)), Fr(() => t.tokenVersionId, () => {
			p.value || h();
		}), (t, r) => (V(), H("details", Mg, [
			r[8] ||= U("summary", null, "토큰 사용 정책", -1),
			r[9] ||= U("p", null, "용도별 토큰을 한곳에서 연결합니다. 미연결 필수 항목은 다른 용도의 토큰으로 대체하지 않습니다.", -1),
			u.value ? (V(), H("p", Ng, L(u.value), 1)) : G("", !0),
			d.value ? (V(), H("p", Pg, L(d.value), 1)) : G("", !0),
			n.value ? G("", !0) : (V(), H("button", {
				key: 2,
				type: "button",
				disabled: l.value,
				onClick: r[0] ||= (e) => h()
			}, "정책 불러오기", 8, Fg)),
			n.value ? (V(), H(K, { key: 3 }, [
				U("div", Ig, [
					U("span", null, L(o.value ? "활성 정책 있음" : "활성 정책 없음") + " · 필수 미연결 " + L(m.value.missing.length) + "개", 1),
					U("label", null, [r[5] ||= W("정책 이력 ", -1), U("select", {
						value: s.value || "",
						disabled: l.value,
						onChange: r[1] ||= (e) => h(e.target.value)
					}, [i.value.length ? G("", !0) : (V(), H("option", Rg, "초기 Draft")), (V(!0), H(K, null, B(i.value, (e) => (V(), H("option", {
						key: e.id,
						value: e.id
					}, "v" + L(e.version) + " · " + L(e.status), 9, zg))), 128))], 40, Lg)]),
					U("button", {
						type: "button",
						disabled: l.value || e.blocked,
						onClick: r[2] ||= (e) => g(!1)
					}, "Draft 저장", 8, Bg),
					U("button", {
						type: "button",
						disabled: l.value || e.blocked || !!m.value.errors.length,
						onClick: r[3] ||= (e) => g(!0)
					}, "검증 후 활성화", 8, Vg),
					U("button", {
						type: "button",
						disabled: l.value,
						onClick: r[4] ||= (e) => h()
					}, "새로고침", 8, Hg)
				]),
				e.blocked ? (V(), H("p", Ug, "토큰 변경사항을 먼저 저장한 후 정책을 저장하세요.")) : G("", !0),
				p.value ? (V(), H("p", Wg, "저장하지 않은 정책 변경사항이 있습니다.")) : G("", !0),
				m.value.errors.length ? (V(), H("ul", Gg, [(V(!0), H(K, null, B(m.value.errors, (e, t) => (V(), H("li", { key: t }, L(e.message), 1))), 128))])) : G("", !0),
				U("div", Kg, [U("table", null, [r[7] ||= U("thead", null, [U("tr", null, [
					U("th", null, "용도"),
					U("th", null, "대상"),
					U("th", null, "속성"),
					U("th", null, "상태"),
					U("th", null, "등록 토큰"),
					U("th", null, "누락 처리")
				])], -1), U("tbody", null, [(V(!0), H(K, null, B(Zt(_g), (t) => (V(), H("tr", { key: t.key }, [
					U("th", qg, L(t.label), 1),
					U("td", null, L(t.target), 1),
					U("td", null, L(t.property), 1),
					U("td", null, L(t.state), 1),
					U("td", null, [z(U("select", {
						"onUpdate:modelValue": (e) => n.value.bindings[t.key] = e,
						"aria-label": `${t.label} 토큰`,
						disabled: l.value || e.blocked
					}, [
						r[6] ||= U("option", { value: "" }, "미연결", -1),
						n.value.bindings[t.key] && !_(t).some((e) => e.tokenKey === n.value.bindings[t.key]) ? (V(), H("option", {
							key: 0,
							value: n.value.bindings[t.key]
						}, L(n.value.bindings[t.key]) + " · 사용 불가", 9, Yg)) : G("", !0),
						(V(!0), H(K, null, B(_(t), (e) => (V(), H("option", {
							key: e.tokenKey,
							value: e.tokenKey
						}, L(e.tokenKey) + " · " + L(e.value), 9, Xg))), 128))
					], 8, Jg), [[Y, n.value.bindings[t.key]]])]),
					U("td", null, L(t.required ? "필수 · 생성 차단" : "선택 · 생략"), 1)
				]))), 128))])])])
			], 64)) : G("", !0)
		]));
	}
}, [["__scopeId", "data-v-4ccd3e35"]]), Qg = [
	"color",
	"dimension",
	"number",
	"fontFamily",
	"fontWeight",
	"shadow",
	"typography",
	"borderStyle",
	"gradient"
], $g = [
	"Color",
	"Spacing",
	"Border Width",
	"Border Radius",
	"Typography",
	"Shadow",
	"Grid",
	"Breakpoint",
	"Measurement",
	"Border Style",
	"Gradient"
], e_ = [
	"카테고리",
	"토큰 유형",
	"토큰명",
	"값",
	"참조 토큰"
], t_ = /^--[a-z][a-z0-9-]*$/, n_ = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|svh|dvh|ch)$/, r_ = /url\s*\(|expression\s*\(|[;{}<>]/i;
function i_(e) {
	let t = [], n = [], r = "", i = !1;
	e = String(e).replace(/^\uFEFF/, "");
	for (let a = 0; a < e.length; a++) {
		let o = e[a];
		if (o === "\"") if (i && e[a + 1] === "\"") r += "\"", a++;
		else if (i || r === "") i = !i;
		else throw Error("CSV 따옴표 위치가 올바르지 않습니다.");
		else !i && o === "," ? (n.push(r), r = "") : !i && (o === "\n" || o === "\r") ? (o === "\r" && e[a + 1] === "\n" && a++, n.push(r), n.some((e) => e.trim()) && t.push(n), n = [], r = "") : r += o;
	}
	if (i) throw Error("CSV 따옴표가 닫히지 않았습니다.");
	if ((r || n.length) && (n.push(r), n.some((e) => e.trim()) && t.push(n)), !t.length) throw Error("CSV에 데이터가 없습니다.");
	let a = t.shift().map((e) => e.trim());
	if (new Set(a).size !== a.length || e_.some((e) => !a.includes(e))) throw Error(`CSV 필수 컬럼: ${e_.join(", ")}`);
	return t.map((e, t) => {
		if (e.length !== a.length) throw Error(`CSV ${t + 2}행의 컬럼 수가 다릅니다.`);
		let n = Object.fromEntries(a.map((t, n) => [t, e[n].trim()]));
		return {
			category: n.카테고리,
			type: n["토큰 유형"],
			name: n.토큰명,
			value: n.값,
			reference: n["참조 토큰"]
		};
	});
}
function a_(e) {
	let t = (e) => {
		let t = String(e ?? "");
		return /[",\r\n]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
	};
	return "﻿" + [e_, ...e.map((e) => [
		e.category,
		e.type,
		e.name,
		e.value,
		e.reference
	])].map((e) => e.map(t).join(",")).join("\r\n") + "\r\n";
}
function o_(e) {
	if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(e)) return !0;
	let t = e.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/);
	return !!t && t.slice(1, 4).every((e) => Number(e) <= 255) && (t[4] === void 0 || Number(t[4]) <= 1);
}
function s_(e) {
	if (e === "none") return !0;
	let t = e.split(/,(?![^()]*\))/);
	return t.length > 0 && t.length <= 8 && t.every((e) => {
		let t = e.trim().match(/^(inset\s+)?(.+?)\s+(#[\da-f]{6,8}|rgba?\([^()]+\))$/i);
		if (!t || !o_(t[3])) return !1;
		let n = t[2].trim().split(/\s+/);
		return n.length >= 2 && n.length <= 4 && n.every((e) => e === "0" || /^-?(?:\d+|\d*\.\d+)(px|rem|em)$/.test(e)) && (n.length < 3 || parseFloat(n[2]) >= 0);
	});
}
function c_(e) {
	let t = JSON.parse(e);
	if (!t || Array.isArray(t) || typeof t != "object") throw Error("Typography는 JSON 속성 객체여야 합니다.");
	let n = {
		fontFamily: "fontFamily",
		fontSize: "dimension",
		lineHeight: "dimension",
		fontWeight: "fontWeight",
		letterSpacing: "dimension",
		textDecoration: "decoration"
	};
	if (Object.keys(t).some((e) => !n[e])) throw Error("Typography에 지원하지 않는 속성이 있습니다.");
	for (let [e, r] of Object.entries(t)) {
		if (r === null) continue;
		let t = String(r);
		if (e === "textDecoration" ? ![
			"none",
			"underline",
			"line-through"
		].includes(t) : !u_(n[e], t)) throw Error(`Typography ${e} 값이 올바르지 않습니다.`);
	}
	return t;
}
function l_(e) {
	let t = e.match(/^linear-gradient\((.+)\)$/i);
	if (!t || e.length > 1200) return !1;
	let n = t[1].split(/,(?![^()]*\))/).map((e) => e.trim());
	return /^(?:-?(?:\d+|\d*\.\d+)deg|to (?:top|bottom|left|right)(?: (?:top|bottom|left|right))?)$/.test(n[0]) && n.shift(), n.length >= 2 && n.length <= 8 && n.every((e) => {
		let t = e.replace(/\s+(?:\d+|\d*\.\d+)%$/, "");
		return t === "transparent" || o_(t);
	});
}
function u_(e, t) {
	if (e !== "typography" && r_.test(t)) return !1;
	switch (e) {
		case "color": return o_(t);
		case "dimension": return t === "0" || n_.test(t);
		case "number": return /^-?(?:\d+|\d*\.\d+)$/.test(t) && Number.isFinite(Number(t));
		case "fontWeight": return /^\d+$/.test(t) && Number(t) >= 1 && Number(t) <= 1e3;
		case "fontFamily": return /^[\p{L}\p{N}\s,'"-]+$/u.test(t) && t.length <= 200;
		case "shadow": return s_(t);
		case "borderStyle": return [
			"none",
			"solid",
			"dashed",
			"dotted",
			"double"
		].includes(t);
		case "gradient": return l_(t);
		case "typography": try {
			return c_(t), !0;
		} catch {
			return !1;
		}
		default: return !1;
	}
}
function d_(e) {
	let t = [], n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	if (!Array.isArray(e) || e.length === 0 || e.length > 5e3) return {
		tokens: [],
		errors: [{ message: "토큰은 1~5000개가 필요합니다." }],
		warnings: n,
		resolved: {}
	};
	let a = e.map((e, n) => {
		let i = Object.fromEntries([
			"category",
			"type",
			"name",
			"value",
			"reference"
		].map((t) => [t, String(e?.[t] ?? "").trim()]));
		i.state = "active";
		let a = (e) => t.push({
			row: n + 2,
			token: i.name,
			message: e
		});
		if ((!i.category || i.category.length > 80) && a("카테고리를 입력하세요(80자 이하)."), Qg.includes(i.type) || a("지원하지 않는 토큰 유형입니다."), (!t_.test(i.name) || i.name.length > 180) && a("토큰명은 --영문소문자로 시작하며 숫자·하이픈만 사용할 수 있습니다."), r.has(i.name) && a("토큰명이 중복됩니다."), i.value && i.reference && a("값과 참조 토큰 중 하나만 입력하세요."), i.reference && !t_.test(i.reference) && a("참조 토큰명이 올바르지 않습니다."), !i.value && !i.reference && (i.state = "incomplete"), i.value && !u_(i.type, i.value) && a("토큰 유형에 맞지 않는 값입니다."), i.name.startsWith("--grid-") && i.name.endsWith("-columns") && i.value && (!Number.isInteger(Number(i.value)) || Number(i.value) < 1 || Number(i.value) > 64) && a("그리드 컬럼 수는 1~64 사이 정수여야 합니다."), i.type === "typography" && i.value && u_(i.type, i.value)) {
			let e = c_(i.value);
			[
				"fontFamily",
				"fontSize",
				"lineHeight",
				"fontWeight",
				"letterSpacing"
			].some((t) => e[t] == null) && (i.state = "incomplete");
		}
		return r.set(i.name, i), i;
	});
	function o(e, n = []) {
		if (i.has(e.name)) return i.get(e.name);
		if (n.length > 64) return t.push({
			token: e.name,
			message: "참조 깊이가 64단계를 초과합니다."
		}), "";
		if (n.includes(e.name)) return t.push({
			token: e.name,
			message: "참조가 순환합니다."
		}), "";
		let a = e.value;
		if (e.reference) {
			let i = r.get(e.reference);
			i ? i.type === e.type ? (a = o(i, [...n, e.name]), i.state !== "active" && (e.state = "incomplete")) : t.push({
				token: e.name,
				message: "참조 대상의 토큰 유형이 다릅니다."
			}) : t.push({
				token: e.name,
				message: `참조 토큰이 없습니다: ${e.reference}`
			});
		}
		return i.set(e.name, a || ""), a || "";
	}
	return a.forEach((e) => o(e)), a.filter((e) => e.state !== "active").forEach((e) => n.push({
		token: e.name,
		message: "필수 값이 없어 저장만 하고 실제 적용·AI 선택에서는 제외합니다."
	})), {
		tokens: a,
		errors: t,
		warnings: n,
		resolved: Object.fromEntries(i)
	};
}
//#endregion
//#region admin-app/src/components/DesignTokenManager.vue
qh();
var f_ = {
	name: "DesignTokenManager",
	components: { TokenUsagePolicyManager: Zg },
	props: { translate: {
		type: Function,
		required: !0
	} },
	emits: ["status", "token-sets-changed"],
	data() {
		return {
			tokens: [],
			versionId: null,
			activeVersionId: null,
			versions: [],
			initial: !1,
			busy: !1,
			loaded: !1,
			error: "",
			message: "",
			selectedCategory: "",
			search: "",
			types: Qg,
			extraCategories: [],
			showAdd: !1,
			categoryName: "",
			form: {
				category: "Color",
				type: "color",
				name: "",
				value: "",
				reference: ""
			},
			importPreview: null,
			baseline: "",
			selectedHistory: ""
		};
	},
	computed: {
		categories() {
			return [.../* @__PURE__ */ new Set([
				...$g,
				...this.extraCategories,
				...this.tokens.map((e) => e.category)
			])];
		},
		filteredTokens() {
			let e = this.search.trim().toLowerCase();
			return this.tokens.filter((t) => (!this.selectedCategory || t.category === this.selectedCategory) && (!e || [
				t.name,
				t.type,
				t.value,
				t.reference
			].some((t) => String(t).toLowerCase().includes(e))));
		},
		analysis() {
			return d_(this.tokens);
		},
		states() {
			return Object.fromEntries(this.analysis.tokens.map((e) => [e.name, e.state]));
		},
		dirty() {
			return this.loaded && a_(this.tokens) !== this.baseline;
		},
		activeCount() {
			return this.analysis.tokens.filter((e) => e.state === "active").length;
		}
	},
	mounted() {
		globalThis.addEventListener("beforeunload", this.beforeLeave), this.load();
	},
	beforeUnmount() {
		globalThis.removeEventListener("beforeunload", this.beforeLeave);
	},
	methods: {
		beforeLeave(e) {
			this.dirty && (e.preventDefault(), e.returnValue = "");
		},
		async run(e) {
			this.busy = !0, this.error = "", this.message = "";
			try {
				return await e();
			} catch (e) {
				return this.error = e.message, null;
			} finally {
				this.busy = !1;
			}
		},
		async load(e = "") {
			this.dirty && !globalThis.confirm("저장하지 않은 변경사항을 버릴까요?") || await this.run(async () => {
				let t = await hg.library(e);
				this.tokens = t.tokens, this.versionId = t.versionId, this.activeVersionId = t.activeVersionId, this.versions = t.versions, this.initial = t.initial, this.loaded = !0, this.baseline = a_(this.tokens), this.selectedHistory = t.versionId || "";
			});
		},
		async save() {
			if (this.analysis.errors.length) {
				this.error = "아래 오류를 수정한 후 저장하세요.";
				return;
			}
			await this.run(async () => {
				let e = await hg.saveLibrary({
					tokens: this.tokens,
					expectedVersionId: this.activeVersionId
				});
				this.baseline = a_(this.tokens);
				let t = await hg.library();
				this.tokens = t.tokens, this.versionId = t.versionId, this.activeVersionId = t.activeVersionId, this.versions = t.versions, this.selectedHistory = t.versionId, this.initial = !1, this.baseline = a_(this.tokens), this.message = `공통 디자인 토큰을 저장했습니다. 미완성 ${e.warnings.length}개는 실제 적용에서 제외됩니다.`, this.$emit("token-sets-changed"), this.$emit("status", this.message);
			});
		},
		categoryCount(e) {
			return this.tokens.filter((t) => t.category === e).length;
		},
		onTabKey(e) {
			if (![
				"ArrowLeft",
				"ArrowRight",
				"Home",
				"End"
			].includes(e.key)) return;
			let t = [...e.currentTarget.querySelectorAll("[role=\"tab\"]")], n = t.indexOf(e.target);
			if (n < 0) return;
			e.preventDefault();
			let r = e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : (n + (e.key === "ArrowRight" ? 1 : -1) + t.length) % t.length;
			t[r].click(), t[r].focus();
		},
		addCategory() {
			let e = this.categoryName.trim();
			!e || e.length > 80 || (this.categories.includes(e) || this.extraCategories.push(e), this.selectedCategory = e, this.categoryName = "", this.openAdd());
		},
		openAdd() {
			let e = this.selectedCategory || "Color", t = {
				Color: "color",
				Typography: "typography",
				Shadow: "shadow",
				Grid: "number",
				"Border Style": "borderStyle",
				Gradient: "gradient"
			}[e] || "dimension";
			this.form = {
				category: e,
				type: t,
				name: "",
				value: "",
				reference: ""
			}, this.showAdd = !0, this.error = "";
		},
		addToken() {
			let e = { ...this.form }, t = d_([...this.tokens, e]);
			if (t.errors.length) {
				this.error = t.errors.map((e) => `${e.token}: ${e.message}`).join("\n");
				return;
			}
			this.tokens.push(e), this.selectedCategory = e.category, this.showAdd = !1;
		},
		removeToken(e) {
			let t = this.tokens.filter((t) => t.reference === e.name);
			if (t.length) {
				this.error = `참조 중인 토큰이 있습니다: ${t.map((e) => e.name).join(", ")}`;
				return;
			}
			globalThis.confirm(`${e.name}을 목록에서 제거할까요? 저장 전까지 실제 반영되지 않습니다.`) && (this.tokens = this.tokens.filter((t) => t !== e));
		},
		downloadCsv() {
			let e = URL.createObjectURL(new Blob([a_(this.tokens)], { type: "text/csv;charset=utf-8" })), t = document.createElement("a");
			t.href = e, t.download = "design-tokens-dark.csv", t.click(), URL.revokeObjectURL(e);
		},
		async uploadCsv(e) {
			let t = e.target.files?.[0];
			if (e.target.value = "", t) {
				if (t.size > 2 * 1024 * 1024) {
					this.error = "CSV 파일은 2MB 이하여야 합니다.";
					return;
				}
				await this.run(async () => {
					let e = d_(i_(await t.text()));
					if (e.errors.length) throw Error(e.errors.slice(0, 20).map((e) => `${e.row || ""}행 ${e.token || ""}: ${e.message}`).join("\n"));
					this.importPreview = {
						...e,
						fileName: t.name
					};
				});
			}
		},
		applyImport() {
			this.tokens = this.importPreview.tokens, this.message = "CSV를 편집 목록에 반영했습니다. 저장 버튼을 눌러야 실제 적용됩니다.", this.importPreview = null, this.selectedCategory = "";
		}
	}
}, p_ = {
	class: "token-library",
	"aria-labelledby": "token-library-title"
}, m_ = { class: "token-library-header" }, h_ = { class: "token-library-actions" }, g_ = ["disabled"], __ = { class: "token-library-upload" }, v_ = ["disabled"], y_ = ["disabled"], b_ = {
	key: 0,
	role: "status"
}, x_ = {
	key: 1,
	class: "token-library-notice"
}, S_ = {
	key: 2,
	role: "status"
}, C_ = {
	key: 3,
	class: "token-library-error",
	role: "alert"
}, w_ = {
	key: 4,
	role: "status"
}, T_ = {
	key: 5,
	class: "token-library-meta"
}, E_ = ["value", "disabled"], D_ = {
	key: 0,
	value: ""
}, O_ = ["value"], k_ = ["disabled"], A_ = [
	"aria-selected",
	"tabindex",
	"disabled"
], j_ = [
	"id",
	"aria-selected",
	"tabindex",
	"disabled",
	"onClick"
], M_ = { class: "token-library-toolbar" }, N_ = ["disabled"], P_ = ["disabled"], F_ = ["disabled"], I_ = ["disabled"], L_ = {
	key: 1,
	class: "token-library-import",
	role: "region",
	"aria-label": "CSV 가져오기 미리보기"
}, R_ = {
	key: 2,
	class: "token-library-error",
	role: "alert"
}, z_ = ["aria-labelledby"], B_ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], V_ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], H_ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], U_ = [
	"aria-label",
	"disabled",
	"onClick"
], W_ = { key: 0 };
function G_(e, t, n, r, i, a) {
	let o = Ci("TokenUsagePolicyManager");
	return V(), H("section", p_, [
		U("header", m_, [t[21] ||= U("div", null, [U("h2", { id: "token-library-title" }, "디자인 토큰"), U("p", null, "하나의 공통 라이브러리를 카테고리별로 관리합니다. Dark 전용입니다.")], -1), U("div", h_, [
			U("button", {
				type: "button",
				disabled: i.busy || !i.loaded,
				onClick: t[0] ||= (...e) => a.downloadCsv && a.downloadCsv(...e)
			}, "전체 CSV 다운로드", 8, g_),
			U("label", __, [t[20] ||= W("전체 CSV 업로드", -1), U("input", {
				"aria-label": "전체 CSV 업로드",
				type: "file",
				accept: ".csv,text/csv",
				disabled: i.busy || !i.loaded,
				onChange: t[1] ||= (...e) => a.uploadCsv && a.uploadCsv(...e)
			}, null, 40, v_)]),
			U("button", {
				type: "button",
				class: "primary",
				disabled: i.busy || !i.loaded || !!a.analysis.errors.length || !a.dirty && !i.initial && i.versionId === i.activeVersionId,
				onClick: t[2] ||= (...e) => a.save && a.save(...e)
			}, L(i.busy ? "처리 중…" : i.versionId === i.activeVersionId ? "변경사항 저장" : "이 버전을 새 버전으로 복원"), 9, y_)
		])]),
		!i.loaded && i.busy ? (V(), H("p", b_, "디자인 토큰을 불러오고 있습니다.")) : G("", !0),
		i.initial && i.loaded ? (V(), H("p", x_, "공통 라이브러리의 초기 값입니다. 저장하면 새로운 페이지 생성에 적용됩니다. 이전 결과물은 유지됩니다.")) : G("", !0),
		a.dirty ? (V(), H("p", S_, "저장하지 않은 변경사항이 있습니다.")) : G("", !0),
		i.error ? (V(), H("p", C_, L(i.error), 1)) : G("", !0),
		i.message ? (V(), H("p", w_, L(i.message), 1)) : G("", !0),
		i.loaded ? (V(), H("div", T_, [
			U("span", null, "전체 " + L(i.tokens.length) + "개 · 적용 가능 " + L(a.activeCount) + "개 · 미완성 " + L(a.analysis.warnings.length) + "개", 1),
			U("label", null, [t[22] ||= W("버전 이력 ", -1), U("select", {
				value: i.selectedHistory,
				disabled: i.busy,
				onChange: t[3] ||= (e) => a.load(e.target.value)
			}, [i.versions.length ? G("", !0) : (V(), H("option", D_, "초기 토큰")), (V(!0), H(K, null, B(i.versions, (e) => (V(), H("option", {
				key: e.id,
				value: e.id
			}, "v" + L(e.version) + L(e.id === i.activeVersionId ? " · 현재" : ""), 9, O_))), 128))], 40, E_)]),
			U("button", {
				type: "button",
				disabled: i.busy,
				onClick: t[4] ||= (e) => a.load()
			}, "새로고침", 8, k_)
		])) : G("", !0),
		i.loaded ? (V(), Ja(o, {
			key: 6,
			"token-version-id": i.activeVersionId,
			blocked: a.dirty
		}, null, 8, ["token-version-id", "blocked"])) : G("", !0),
		i.loaded ? (V(), H(K, { key: 7 }, [
			U("div", {
				class: "token-library-tabs",
				role: "tablist",
				"aria-label": "디자인 토큰 카테고리",
				onKeydown: t[6] ||= (...e) => a.onTabKey && a.onTabKey(...e)
			}, [U("button", {
				type: "button",
				role: "tab",
				id: "token-tab-all",
				"aria-selected": !i.selectedCategory,
				tabindex: i.selectedCategory ? -1 : 0,
				"aria-controls": "token-panel",
				disabled: i.busy,
				onClick: t[5] ||= (e) => i.selectedCategory = ""
			}, "전체 (" + L(i.tokens.length) + ")", 9, A_), (V(!0), H(K, null, B(a.categories, (e, t) => (V(), H("button", {
				id: `token-tab-${t}`,
				key: e,
				type: "button",
				role: "tab",
				"aria-selected": i.selectedCategory === e,
				tabindex: i.selectedCategory === e ? 0 : -1,
				"aria-controls": "token-panel",
				disabled: i.busy,
				onClick: (t) => i.selectedCategory = e
			}, L(e) + " (" + L(a.categoryCount(e)) + ")", 9, j_))), 128))], 32),
			U("div", M_, [
				z(U("input", {
					"onUpdate:modelValue": t[7] ||= (e) => i.search = e,
					"aria-label": "토큰 검색",
					placeholder: "토큰명·유형·값 검색",
					disabled: i.busy
				}, null, 8, N_), [[J, i.search]]),
				U("button", {
					type: "button",
					disabled: i.busy,
					onClick: t[8] ||= (...e) => a.openAdd && a.openAdd(...e)
				}, L(i.selectedCategory || "카테고리") + " 토큰 추가", 9, P_),
				U("form", { onSubmit: t[10] ||= Lu((...e) => a.addCategory && a.addCategory(...e), ["prevent"]) }, [z(U("input", {
					"onUpdate:modelValue": t[9] ||= (e) => i.categoryName = e,
					"aria-label": "새 카테고리 이름",
					maxlength: "80",
					placeholder: "새 카테고리"
				}, null, 512), [[J, i.categoryName]]), U("button", { disabled: i.busy || !i.categoryName.trim() }, "카테고리 추가", 8, F_)], 32)
			]),
			i.showAdd ? (V(), H("form", {
				key: 0,
				class: "token-library-add",
				"aria-label": "토큰 추가",
				onSubmit: t[17] ||= Lu((...e) => a.addToken && a.addToken(...e), ["prevent"])
			}, [
				U("label", null, [t[23] ||= W("카테고리", -1), z(U("select", { "onUpdate:modelValue": t[11] ||= (e) => i.form.category = e }, [(V(!0), H(K, null, B(a.categories, (e) => (V(), H("option", { key: e }, L(e), 1))), 128))], 512), [[Y, i.form.category]])]),
				U("label", null, [t[24] ||= W("토큰 유형", -1), z(U("select", { "onUpdate:modelValue": t[12] ||= (e) => i.form.type = e }, [(V(!0), H(K, null, B(i.types, (e) => (V(), H("option", { key: e }, L(e), 1))), 128))], 512), [[Y, i.form.type]])]),
				U("label", null, [t[25] ||= W("토큰명", -1), z(U("input", {
					"onUpdate:modelValue": t[13] ||= (e) => i.form.name = e,
					required: "",
					placeholder: "--spacing-20"
				}, null, 512), [[
					J,
					i.form.name,
					void 0,
					{ trim: !0 }
				]])]),
				U("label", null, [t[26] ||= W("값", -1), z(U("textarea", {
					"onUpdate:modelValue": t[14] ||= (e) => i.form.value = e,
					placeholder: "직접 값 또는 Typography JSON"
				}, null, 512), [[J, i.form.value]])]),
				U("label", null, [t[27] ||= W("참조 토큰", -1), z(U("input", {
					"onUpdate:modelValue": t[15] ||= (e) => i.form.reference = e,
					placeholder: "--unit-20"
				}, null, 512), [[
					J,
					i.form.reference,
					void 0,
					{ trim: !0 }
				]])]),
				U("button", { disabled: i.busy }, "목록에 추가", 8, I_),
				U("button", {
					type: "button",
					onClick: t[16] ||= (e) => i.showAdd = !1
				}, "취소")
			], 32)) : G("", !0),
			i.importPreview ? (V(), H("div", L_, [
				t[28] ||= U("h3", null, "CSV 가져오기 확인", -1),
				U("p", null, L(i.importPreview.fileName) + " · " + L(i.importPreview.tokens.length) + "개 · 미완성 " + L(i.importPreview.warnings.length) + "개", 1),
				t[29] ||= U("p", null, "적용하면 현재 편집 목록 전체를 교체합니다. 미완성 항목은 보관되지만 실제 적용에서 제외됩니다.", -1),
				U("button", {
					type: "button",
					onClick: t[18] ||= (...e) => a.applyImport && a.applyImport(...e)
				}, "편집 목록에 반영"),
				U("button", {
					type: "button",
					onClick: t[19] ||= (e) => i.importPreview = null
				}, "취소")
			])) : G("", !0),
			a.analysis.errors.length ? (V(), H("div", R_, [U("strong", null, "검증 오류 " + L(a.analysis.errors.length) + "개", 1), (V(!0), H(K, null, B(a.analysis.errors.slice(0, 20), (e, t) => (V(), H("p", { key: t }, L(e.token) + ": " + L(e.message), 1))), 128))])) : G("", !0),
			U("div", {
				id: "token-panel",
				role: "tabpanel",
				"aria-labelledby": i.selectedCategory ? `token-tab-${a.categories.indexOf(i.selectedCategory)}` : "token-tab-all",
				class: "token-library-table"
			}, [U("table", null, [t[31] ||= U("thead", null, [U("tr", null, [
				U("th", null, "카테고리"),
				U("th", null, "토큰 유형"),
				U("th", null, "토큰명"),
				U("th", null, "값"),
				U("th", null, "참조 토큰"),
				U("th", null, "적용"),
				U("th", null, [U("span", { class: "token-library-sr" }, "작업")])
			])], -1), U("tbody", null, [(V(!0), H(K, null, B(a.filteredTokens, (e, t) => (V(), H("tr", { key: i.tokens.indexOf(e) }, [
				U("td", null, L(e.category), 1),
				U("td", null, [z(U("select", {
					"onUpdate:modelValue": (t) => e.type = t,
					"aria-label": `${e.name} 유형`,
					disabled: i.busy
				}, [(V(!0), H(K, null, B(i.types, (e) => (V(), H("option", { key: e }, L(e), 1))), 128))], 8, B_), [[Y, e.type]])]),
				U("td", null, [U("code", null, L(e.name), 1)]),
				U("td", null, [z(U("textarea", {
					"onUpdate:modelValue": (t) => e.value = t,
					"aria-label": `${e.name} 값`,
					disabled: i.busy,
					rows: "2",
					placeholder: "직접 값"
				}, null, 8, V_), [[J, e.value]])]),
				U("td", null, [z(U("input", {
					"onUpdate:modelValue": (t) => e.reference = t,
					"aria-label": `${e.name} 참조`,
					disabled: i.busy,
					placeholder: "참조 토큰명"
				}, null, 8, H_), [[
					J,
					e.reference,
					void 0,
					{ trim: !0 }
				]])]),
				U("td", null, L(a.states[e.name] === "active" ? "가능" : "미완성"), 1),
				U("td", null, [U("button", {
					type: "button",
					"aria-label": `${e.name} 제거`,
					disabled: i.busy,
					onClick: (t) => a.removeToken(e)
				}, "제거", 8, U_)])
			]))), 128)), a.filteredTokens.length ? G("", !0) : (V(), H("tr", W_, [...t[30] ||= [U("td", { colspan: "7" }, "이 카테고리에 토큰을 추가하세요.", -1)]]))])])], 8, z_)
		], 64)) : G("", !0)
	]);
}
var K_ = /*#__PURE__*/ Jh(f_, [["render", G_], ["__scopeId", "data-v-cb36ab1e"]]);
Object.freeze({
	active: 0,
	validated: 1,
	draft: 2,
	inactive: 3,
	archived: 4
});
var q_ = Object.freeze([
	{
		key: "promotion-overview",
		label: "프로모션 개요",
		description: "사용자의 자연어 요청을 프로모션 기획 정보로 구조화합니다.",
		order: 10
	},
	{
		key: "template-selection",
		label: "템플릿 선택 및 구성",
		description: "개요에 맞는 템플릿을 추천하고 섹션·컴포넌트 구성을 계획합니다.",
		order: 41
	},
	{
		key: "section-layout",
		label: "섹션 구성 및 레이아웃",
		description: "섹션의 컴포넌트 구성, 레이아웃과 다중 선택 정렬을 계획합니다.",
		order: 30
	},
	{
		key: "ai-page-composition",
		label: "AI 페이지 구성",
		description: "승인된 섹션·레이아웃 후보로 페이지를 구성하고 자연어 수정안을 만듭니다.",
		order: 20
	},
	{
		key: "promotion-image",
		label: "프로모션 이미지",
		description: "섹션 키비주얼과 컴포넌트 필드 이미지를 필요할 때 생성합니다.",
		order: 40
	},
	{
		key: "design-research",
		label: "디자인 레퍼런스 조사",
		description: "웹사이트 스크린샷을 분석해 재사용 가능한 레이아웃 원리를 구조화합니다.",
		order: 42
	},
	{
		key: "component-generation",
		label: "컴포넌트 생성",
		description: "참조 이미지를 DOM RenderSpec과 재사용 가능한 컴포넌트 제안으로 분석합니다.",
		order: 45
	},
	{
		key: "design-generator",
		label: "디자인 생성기",
		description: "통합 브리프부터 LO-FI 시안과 최종 디자인까지 생성합니다.",
		order: 50
	},
	{
		key: "shared-execution",
		label: "독립·공통 실행",
		description: "특정 화면 흐름과 분리되어 독립적으로 호출되는 실행 프롬프트입니다.",
		order: 60
	},
	{
		key: "other",
		label: "기타",
		description: "아직 관리 그룹이 지정되지 않은 프롬프트입니다.",
		order: 999
	}
]), J_ = Object.freeze({
	promo_overview_parser: {
		journeyStep: 1,
		group: "promotion-overview",
		order: 10,
		label: "프로모션 개요 분석",
		description: "간단한 자연어 요청을 제목, 목적, 대상, 톤과 주요 혜택으로 구조화합니다.",
		executionMode: "사용자 요청"
	},
	promo_template_recommender: {
		group: "template-selection",
		order: 10,
		label: "프로모션 템플릿 추천",
		description: "확정된 프로모션 개요에 적합한 활성 템플릿 후보를 추천합니다.",
		executionMode: "사용자 요청"
	},
	promo_template_composer: {
		group: "template-selection",
		order: 20,
		label: "템플릿 구성 계획",
		description: "선택한 템플릿의 섹션과 컴포넌트에 프로모션 콘텐츠를 매핑합니다.",
		executionMode: "사용자 요청"
	},
	promo_page_schema_planner: {
		journeyStep: 3,
		group: "ai-page-composition",
		order: 11,
		label: "AI 동적 페이지 구조 설계",
		description: "범용 UI 요소와 중앙 토큰 정책으로 PageSchema를 생성합니다.",
		executionMode: "사용자 요청"
	},
	promo_page_composer: {
		journeyStep: 3,
		group: "ai-page-composition",
		order: 10,
		label: "AI 페이지 구성 계획",
		description: "승인된 Section과 Layout Preset 후보를 사용해 프로모션 페이지 구성을 계획합니다.",
		executionMode: "사용자 요청"
	},
	promo_composition_editor: {
		journeyStep: 4,
		group: "ai-page-composition",
		order: 20,
		label: "AI 페이지 구성 수정",
		description: "현재 AI 페이지 구성에 적용할 자연어 수정 작업을 제안합니다.",
		executionMode: "사용자 요청"
	},
	section_composition_planner: {
		journeyStep: 5,
		group: "section-layout",
		order: 10,
		label: "자연어 섹션 구성 계획",
		description: "자연어 요청을 바탕으로 섹션 컴포넌트, 콘텐츠와 디자인 토큰을 제안합니다.",
		executionMode: "선택 실행"
	},
	section_layout_planner: {
		journeyStep: 6,
		group: "section-layout",
		order: 20,
		label: "섹션 레이아웃 계획",
		description: "섹션 전체의 허용 레이아웃과 스타일 슬롯을 안전한 명령으로 계획합니다.",
		executionMode: "선택 실행"
	},
	multi_component_layout_planner: {
		journeyStep: 7,
		group: "section-layout",
		order: 30,
		label: "다중 컴포넌트 정렬 계획",
		description: "선택한 여러 컴포넌트의 정렬, 간격과 배치를 안전한 명령으로 제안합니다.",
		executionMode: "선택 실행"
	},
	section_background_image: {
		journeyStep: 8,
		group: "promotion-image",
		order: 10,
		label: "섹션 키비주얼 생성",
		description: "섹션 콘텐츠와 배경색을 바탕으로 프로모션 키비주얼을 생성합니다.",
		executionMode: "선택 실행"
	},
	component_image: {
		journeyStep: 9,
		group: "promotion-image",
		order: 20,
		label: "컴포넌트 이미지 생성",
		description: "특정 컴포넌트 이미지 필드의 목적에 맞는 이미지를 생성합니다.",
		executionMode: "선택 실행"
	},
	component_visual_analyzer: {
		group: "component-generation",
		order: 10,
		label: "컴포넌트 이미지 분석",
		description: "업로드한 디자인 영역을 DOM RenderSpec, 필드와 토큰 바인딩 제안으로 분석합니다.",
		executionMode: "선택 실행"
	},
	layout_reference_analyzer: {
		group: "design-research",
		order: 10,
		label: "레이아웃 레퍼런스 분석",
		description: "웹사이트 스크린샷에서 섹션 유형, 디자인 원리, 품질점수와 추상화 Layout Spec을 생성합니다.",
		executionMode: "관리자 요청"
	},
	integrated_brief: {
		group: "design-generator",
		order: 10,
		label: "통합 디자인 브리프",
		description: "프로모션 입력과 선택 문서를 통합해 디자인 생성 기준을 구성합니다.",
		executionMode: "자동 실행"
	},
	integrated_brief_v2: {
		group: "design-generator",
		order: 15,
		label: "통합 디자인 브리프 V2",
		description: "LO-FI 없는 V2 파이프라인을 위한 통합 생성 기준을 구성합니다.",
		executionMode: "자동 실행"
	},
	lofi_draft: {
		group: "design-generator",
		order: 20,
		label: "LO-FI 시안 생성",
		description: "통합 디자인 브리프를 바탕으로 검토용 저충실도 시안을 생성합니다.",
		executionMode: "자동 실행"
	},
	final_design: {
		group: "design-generator",
		order: 30,
		label: "최종 디자인 생성",
		description: "승인된 LO-FI 시안과 브리프를 바탕으로 최종 디자인을 생성합니다.",
		executionMode: "사용자 요청"
	},
	final_design_v2: {
		group: "design-generator",
		order: 35,
		label: "최종 디자인 V2 생성",
		description: "통합 브리프에서 LO-FI 참조 없이 최종 디자인을 직접 생성합니다.",
		executionMode: "사용자 요청"
	},
	image_execution: {
		group: "shared-execution",
		order: 10,
		label: "이미지 실행 프롬프트",
		description: "LO-FI·최종 디자인 흐름과 분리된 독립 이미지 생성 요청에 사용합니다.",
		executionMode: "독립 실행"
	},
	admin_prompt_translation: {
		group: "shared-execution",
		order: 20,
		label: "관리자 프롬프트 번역",
		description: "영문 프롬프트를 관리자 검토용 한국어로 번역합니다.",
		executionMode: "관리자 요청"
	},
	promo_page_generation: {
		group: "design-generator",
		order: 40,
		label: "프로모션 페이지 코드 생성",
		description: "디자인 분석과 프로모션 입력으로 페이지 결과를 생성합니다.",
		executionMode: "사용자 요청"
	}
});
function Y_(e) {
	let t = String(e || "").trim();
	return J_[t] || {
		group: "other",
		order: 999,
		label: t || "알 수 없음",
		description: "이 프롬프트 유형의 관리 설명이 아직 등록되지 않았습니다.",
		executionMode: "실행 방식 미지정"
	};
}
function X_(e) {
	return q_.find((t) => t.key === e) || q_[q_.length - 1];
}
function Z_(e) {
	let t = Number(e?.version);
	return Number.isFinite(t) ? t : 0;
}
function Q_(e) {
	let t = Date.parse(e?.updatedAt || "");
	return Number.isFinite(t) ? t : 0;
}
function $_(e, t) {
	return Z_(t) - Z_(e) || Q_(t) - Q_(e) || String(e?.id || "").localeCompare(String(t?.id || ""));
}
function ev(e) {
	return String(e?.lineageId || "").trim() || `legacy:${String(e?.type || "unknown")}:${String(e?.id || "unknown")}`;
}
function tv(e) {
	return e && (e.active || e.validated || e.draft || e.latestInactive || e.latestArchived || e.versions?.[0]) || null;
}
function nv(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.filter((e) => e && typeof e == "object").forEach((e) => {
		let n = ev(e);
		t.has(n) || t.set(n, {
			lineageId: n,
			versions: []
		}), t.get(n).versions.push(e);
	}), [...t.values()].map((e) => {
		let t = [...e.versions].sort($_), n = t.find((e) => e.status === "active") || null, r = t.find((e) => e.status === "validated") || null, i = t.find((e) => e.status === "draft") || null, a = t.find((e) => e.status === "inactive") || null, o = t.find((e) => e.status === "archived") || null, s = {
			...e,
			versions: t,
			active: n,
			validated: r,
			draft: i,
			latestInactive: a,
			latestArchived: o,
			archivedCount: t.filter((e) => e.status === "archived").length,
			hasCandidate: !!(r || i)
		}, c = tv(s);
		return {
			...s,
			primary: c,
			type: c?.type || t[0]?.type || "",
			name: c?.name || t[0]?.name || "",
			updatedAt: t.reduce((e, t) => Q_(t) > Q_(e) ? t : e, t[0] || null)?.updatedAt || null
		};
	}).sort((e, t) => X_(Y_(e.type).group).order - X_(Y_(t.type).group).order || Y_(e.type).order - Y_(t.type).order || String(e.name || "").localeCompare(String(t.name || "")) || String(e.lineageId).localeCompare(String(t.lineageId)));
}
function rv(e = [], t = "") {
	let n = String(t || "").trim();
	return n ? e.filter((e) => e.type === n) : e;
}
function iv(e = [], t = "") {
	let n = String(t || "");
	return e.find((e) => e.versions.some((e) => e.id === n)) || null;
}
function av(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let n = X_(Y_(e?.type).group);
		t.has(n.key) || t.set(n.key, {
			...n,
			promptGroups: []
		}), t.get(n.key).promptGroups.push(e);
	}), [...t.values()].map((e) => ({
		...e,
		promptGroups: [...e.promptGroups].sort((e, t) => Y_(e?.type).order - Y_(t?.type).order || String(e?.name || "").localeCompare(String(t?.name || "")))
	})).sort((e, t) => e.order - t.order);
}
function ov(e = [], t = "", n = "image_execution") {
	let r = iv(e, t);
	return r ? r.versions.find((e) => e.id === t) || r.primary || null : e.find((e) => e.type === n && e.active)?.active || e.find((e) => e.active)?.active || e[0]?.primary || null;
}
var sv = Object.freeze({
	filterPromptGroups: rv,
	findPromptGroup: iv,
	groupPromptTemplateSections: av,
	groupPromptTemplates: nv,
	promptLineageId: ev,
	promptTypeMeta: Y_,
	promptWorkflowGroupMeta: X_,
	resolvePromptSelection: ov,
	selectPromptGroupPrimary: tv
}), cv = /* @__PURE__ */ new Set([
	"image_execution",
	"lofi_draft",
	"final_design",
	"final_design_v2",
	"section_background_image",
	"component_image"
]), lv = /* @__PURE__ */ new Set([
	"integrated_brief",
	"integrated_brief_v2",
	"section_layout_planner",
	"multi_component_layout_planner",
	"section_composition_planner",
	"promo_overview_parser",
	"promo_template_recommender",
	"promo_template_composer",
	"promo_page_schema_planner",
	"promo_page_composer",
	"promo_composition_editor",
	"component_visual_analyzer",
	"promo_page_generation"
]), uv = Object.freeze([
	{
		provider: "openai",
		model: "gpt-6.1-sol",
		label: "GPT-6.1 Sol · 권장",
		description: "복잡한 브리프와 구조화 작업의 품질·비용 균형 모델",
		modality: "text",
		recommended: !0,
		temperature: null,
		maxTokens: 24e3,
		options: { reasoning: { effort: "medium" } }
	},
	{
		provider: "openai",
		model: "gpt-6-astra",
		label: "GPT-6 Astra · 최고 품질",
		description: "가장 복잡한 추론과 정밀한 지시 이행을 위한 상위 모델",
		modality: "text",
		temperature: null,
		maxTokens: 32e3,
		options: { reasoning: { effort: "high" } }
	},
	{
		provider: "openai",
		model: "gpt-6-luna",
		label: "GPT-6 Luna · 빠른 처리",
		description: "반복적이고 대량인 구조화 작업을 위한 비용 우선 모델",
		modality: "text",
		temperature: null,
		maxTokens: 12e3,
		options: { reasoning: { effort: "low" } }
	},
	{
		provider: "openai",
		model: "gpt-4.1-mini",
		label: "GPT-4.1 Mini · 기존 호환",
		description: "기존 Prompt Version과의 호환성을 위한 레거시 선택지",
		modality: "text",
		temperature: .1,
		maxTokens: 12e3,
		legacy: !0,
		options: {}
	},
	{
		provider: "openai",
		model: "gpt-4o-mini",
		label: "GPT-4o Mini · 기존 호환",
		description: "기존 통합 브리프 설정을 유지할 때 사용하는 레거시 모델",
		modality: "text",
		temperature: .1,
		maxTokens: 12e3,
		legacy: !0,
		options: {}
	},
	{
		provider: "openai",
		model: "gpt-image-2.5-sunburst",
		label: "GPT Image 2.5 Sunburst · 품질 권장",
		description: "고품질 프로모션 이미지 생성과 정밀 편집에 적합",
		modality: "image",
		recommended: !0,
		options: {
			quality: "high",
			size: "1024x1536",
			outputFormat: "png",
			background: "opaque"
		}
	},
	{
		provider: "openai",
		model: "gpt-image-2.5-flare",
		label: "GPT Image 2.5 Flare · 속도 권장",
		description: "빠른 고품질 이미지 생성과 대량 시안 제작에 적합",
		modality: "image",
		options: {
			quality: "high",
			size: "1024x1536",
			outputFormat: "png",
			background: "opaque"
		}
	},
	{
		provider: "openai",
		model: "gpt-image-2",
		label: "GPT Image 2",
		description: "기존 이미지 생성 작업과의 호환 선택지",
		modality: "image",
		options: {
			quality: "high",
			size: "1024x1536",
			outputFormat: "png",
			background: "opaque"
		}
	},
	{
		provider: "openai",
		model: "gpt-image-1.5",
		label: "GPT Image 1.5 · 기존 호환",
		description: "이전 세대 GPT Image 작업을 유지할 때 사용",
		modality: "image",
		legacy: !0,
		options: {
			quality: "high",
			size: "1024x1536",
			outputFormat: "png",
			background: "opaque"
		}
	},
	{
		provider: "openai",
		model: "gpt-image-1",
		label: "GPT Image 1 · 기존 호환",
		description: "기존 V1 이미지 생성 설정을 유지할 때 사용",
		modality: "image",
		legacy: !0,
		options: {
			quality: "high",
			size: "1024x1536",
			outputFormat: "png",
			background: "opaque"
		}
	},
	{
		provider: "google",
		model: "gemini-nano-banana-2.1",
		label: "Nano Banana 2.1 · 권장",
		description: "고품질 이미지 생성·편집과 텍스트 표현을 위한 기본 권장 모델",
		modality: "image",
		recommended: !0,
		imageSize: "2K",
		supportedImageSizes: [
			"1K",
			"2K",
			"4K"
		],
		options: { imageSize: "2K" }
	},
	{
		provider: "google",
		model: "gemini-3.1-flash-lite-image",
		label: "Nano Banana 2 Lite · 속도·비용",
		description: "대량 이미지 생성에서 속도와 비용을 우선할 때 사용",
		modality: "image",
		imageSize: "1K",
		supportedImageSizes: ["1K"],
		options: { imageSize: "1K" }
	},
	{
		provider: "google",
		model: "gemini-3.1-flash-image",
		label: "Nano Banana 2 · 기존 호환",
		description: "현재 운영 중인 이전 세대 Gemini 이미지 모델",
		modality: "image",
		legacy: !0,
		imageSize: "2K",
		supportedImageSizes: [
			"1K",
			"2K",
			"4K"
		],
		options: { imageSize: "2K" }
	},
	{
		provider: "google",
		model: "gemini-3-pro-image",
		label: "Nano Banana Pro · 최고 품질",
		description: "브랜드 일관성과 정밀 제어가 중요한 고난도 이미지 작업용",
		modality: "image",
		imageSize: "2K",
		supportedImageSizes: [
			"1K",
			"2K",
			"4K"
		],
		options: { imageSize: "2K" }
	},
	{
		provider: "google",
		model: "gemini-2.5-flash-image",
		label: "Gemini 2.5 Flash Image · 레거시",
		description: "이전 Gemini 이미지 실행 호환을 위한 레거시 모델",
		modality: "image",
		legacy: !0,
		imageSize: "1K",
		supportedImageSizes: ["1K"],
		options: { imageSize: "1K" }
	}
]);
function dv(e) {
	return cv.has(String(e || "")) ? "image" : "text";
}
function fv(e) {
	return cv.has(String(e || "")) ? "image" : lv.has(String(e || "")) ? "json_object" : "text";
}
function pv({ provider: e, type: t } = {}) {
	let n = dv(t);
	return uv.filter((t) => t.provider === e && t.modality === n);
}
function mv(e, t) {
	return uv.find((n) => n.provider === e && n.model === t) || null;
}
function hv({ provider: e, type: t } = {}) {
	let n = pv({
		provider: e,
		type: t
	});
	return n.find((e) => e.recommended) || n[0] || null;
}
function gv({ provider: e, model: t, type: n } = {}) {
	let r = mv(e, t);
	if (!r) return null;
	let i = fv(n), a = {
		provider: e,
		model: t,
		responseFormat: i,
		...r.options
	};
	return {
		...r,
		responseFormat: i,
		imageSize: r.imageSize || "2K",
		modelOptions: a,
		capabilitySnapshot: {
			provider: e,
			model: t,
			modality: r.modality,
			legacy: !!r.legacy,
			supportsStructuredOutput: r.modality === "text",
			supportsImageGeneration: r.modality === "image",
			...e === "google" && r.modality === "image" ? { supportedImageSizes: r.supportedImageSizes || [
				"1K",
				"2K",
				"4K"
			] } : {}
		}
	};
}
var _v = Object.freeze({
	findModel: mv,
	listModels: pv,
	presetFor: gv,
	promptModality: dv,
	recommendedModel: hv,
	responseFormatForPrompt: fv
});
//#endregion
//#region admin-app/src/services/llm-model-registry-service.mjs
async function vv(e = {}) {
	let t = await fetch("/api/llm-models", {
		cache: "no-store",
		...e,
		headers: {
			"Content-Type": "application/json",
			...e.headers || {}
		}
	}), n = await t.json().catch(() => ({}));
	if (!t.ok) {
		let e = Error(n.error || `LLM 모델 요청 오류(${t.status})`);
		throw e.code = n.code || "LLM_MODEL_REQUEST_FAILED", e;
	}
	return n;
}
var yv = Object.freeze({
	async list() {
		return vv();
	},
	async create(e) {
		return vv({
			method: "POST",
			body: JSON.stringify(e)
		});
	},
	async update(e, t) {
		return vv({
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				...t
			})
		});
	}
});
//#endregion
//#region admin-app/src/components/LlmModelManager.vue
qh();
var bv = {
	class: "llm-registry",
	"aria-labelledby": "llm-registry-title"
}, xv = { class: "llm-registry__header" }, Sv = { class: "llm-registry__header-actions" }, Cv = ["disabled"], wv = {
	class: "llm-registry__summary",
	"aria-label": "LLM 모델 현황"
}, Tv = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, Ev = { class: "llm-registry__workspace" }, Dv = { class: "llm-registry__list" }, Ov = { class: "llm-registry__filters" }, kv = {
	class: "llm-registry__rows",
	"aria-live": "polite"
}, Av = ["onClick"], jv = { class: "llm-registry__row-main" }, Mv = { class: "llm-registry__row-details" }, Nv = { class: "llm-registry__row-meta" }, Pv = {
	key: 0,
	class: "llm-registry__empty"
}, Fv = { class: "llm-registry__editor-heading" }, Iv = { key: 0 }, Lv = ["disabled"], Rv = { class: "llm-registry__grid" }, zv = ["disabled"], Bv = ["disabled"], Vv = { class: "llm-registry__field-title" }, Hv = ["aria-expanded"], Uv = { key: 0 }, Wv = { class: "llm-registry__wide" }, Gv = { class: "llm-registry__checks" }, Kv = { class: "llm-registry__wide" }, qv = { class: "llm-registry__wide" }, Jv = { class: "llm-registry__actions" }, Yv = ["disabled"], Xv = ["disabled"], Zv = ["disabled"], Qv = {
	key: 0,
	class: "llm-registry__history",
	open: ""
}, $v = { class: "llm-registry__history-list" }, ey = ["datetime"], ty = {
	key: 0,
	class: "llm-registry__empty"
}, ny = /*#__PURE__*/ Jh({
	__name: "LlmModelManager",
	emits: ["status"],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ R(!1), i = /* @__PURE__ */ R(!1), a = /* @__PURE__ */ R(""), o = /* @__PURE__ */ R([]), s = /* @__PURE__ */ R([]), c = /* @__PURE__ */ R(""), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R(!1), p = /* @__PURE__ */ R(null), m = () => ({
			provider: "openai",
			modelId: "",
			displayName: "",
			description: "",
			modality: "text",
			status: "draft",
			isRecommended: !1,
			isLegacy: !1,
			defaultTemperature: "",
			defaultMaxTokens: "",
			defaultResponseFormat: "json_object",
			supportedImageSizesText: "",
			modelOptionsText: "{}",
			changeNote: ""
		}), h = /* @__PURE__ */ It(m()), _ = q(() => o.value.find((e) => e.id === c.value) || null), v = q(() => _.value ? s.value.filter((e) => e.llmModelId === _.value.id || e.provider === _.value.provider && e.modelId === _.value.modelId) : []), y = q(() => {
			let e = l.value.trim().toLowerCase();
			return o.value.filter((t) => u.value && t.provider !== u.value || d.value && t.status !== d.value ? !1 : !e || [
				t.displayName,
				t.modelId,
				t.description
			].some((t) => String(t || "").toLowerCase().includes(e))).sort((e, t) => Number(t.usage?.total || 0) - Number(e.usage?.total || 0) || String(e.provider || "").localeCompare(String(t.provider || ""), "en", { sensitivity: "base" }) || String(e.displayName || "").localeCompare(String(t.displayName || ""), "en", {
				sensitivity: "base",
				numeric: !0
			}));
		}), b = q(() => ({
			total: o.value.length,
			active: o.value.filter((e) => e.status === "active").length,
			used: o.value.filter((e) => e.usage?.total > 0).length
		}));
		function x(e) {
			return {
				draft: "초안",
				active: "활성",
				inactive: "사용 중지"
			}[e] || e;
		}
		function S(e) {
			return e === "image" ? "이미지 생성·편집" : "텍스트·JSON";
		}
		function ee(e) {
			return e.previousStatus ? e.previousStatus === e.newStatus ? "설정 수정" : `${x(e.previousStatus)} → ${x(e.newStatus)}` : "모델 등록";
		}
		function C(e) {
			if (!e) return "-";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? String(e) : new Intl.DateTimeFormat("ko-KR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit"
			}).format(t);
		}
		function w(e) {
			e?.type === "keydown" && e.key !== "Escape" || e?.type === "click" && p.value?.contains(e.target) || (f.value = !1);
		}
		function T() {
			c.value = "", Object.assign(h, m()), a.value = "";
		}
		function E(e) {
			c.value = e.id, Object.assign(h, {
				provider: e.provider,
				modelId: e.modelId,
				displayName: e.displayName,
				description: e.description || "",
				modality: e.modality,
				status: e.status,
				isRecommended: !!e.isRecommended,
				isLegacy: !!e.isLegacy,
				defaultTemperature: e.defaultTemperature ?? "",
				defaultMaxTokens: e.defaultMaxTokens ?? "",
				defaultResponseFormat: e.defaultResponseFormat || (e.modality === "image" ? "image" : "text"),
				supportedImageSizesText: (e.supportedImageSizes || []).join(", "),
				modelOptionsText: JSON.stringify(e.modelOptions || {}, null, 2),
				changeNote: ""
			}), a.value = "";
		}
		function D() {
			h.defaultResponseFormat = h.modality === "image" ? "image" : "json_object", h.modality !== "image" && (h.supportedImageSizesText = "");
		}
		function O() {
			let e;
			try {
				e = JSON.parse(h.modelOptionsText || "{}");
			} catch {
				throw Error("Provider 기본 옵션을 올바른 JSON 객체로 입력해 주세요.");
			}
			if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Provider 기본 옵션은 JSON 객체여야 합니다.");
			return {
				provider: h.provider,
				modelId: h.modelId.trim(),
				displayName: h.displayName.trim(),
				description: h.description.trim(),
				modality: h.modality,
				status: h.status,
				isRecommended: h.isRecommended,
				isLegacy: h.isLegacy,
				defaultTemperature: h.defaultTemperature,
				defaultMaxTokens: h.defaultMaxTokens,
				defaultResponseFormat: h.defaultResponseFormat,
				supportedImageSizes: h.supportedImageSizesText.split(",").map((e) => e.trim()).filter(Boolean),
				modelOptions: e,
				changeNote: h.changeNote.trim()
			};
		}
		async function k(e = c.value) {
			r.value = !0, a.value = "";
			try {
				let t = await yv.list();
				o.value = t.models || [], s.value = t.histories || [];
				let n = o.value.find((t) => t.id === e);
				n ? E(n) : o.value.length && !c.value ? E(o.value[0]) : o.value.length || T();
			} catch (e) {
				a.value = e.message;
			} finally {
				r.value = !1;
			}
		}
		async function te() {
			i.value = !0, a.value = "";
			try {
				let e = O();
				if (!e.modelId || !e.displayName) throw Error("모델 ID와 표시 이름을 입력해 주세요.");
				let t = !_.value;
				await k((t ? await yv.create({
					...e,
					status: "draft"
				}) : await yv.update(_.value.id, e)).model.id), n("status", t ? "LLM 모델 초안을 등록했습니다." : "LLM 모델 설정을 저장했습니다.");
			} catch (e) {
				a.value = e.message;
			} finally {
				i.value = !1;
			}
		}
		async function ne(e) {
			if (_.value) {
				i.value = !0, a.value = "";
				try {
					await k((await yv.update(_.value.id, {
						status: e,
						changeNote: h.changeNote.trim() || `${e} 상태로 변경`
					})).model.id), n("status", e === "active" ? "LLM 모델을 활성화했습니다." : "LLM 모델을 사용 중지했습니다.");
				} catch (e) {
					a.value = e.message;
				} finally {
					i.value = !1;
				}
			}
		}
		return ws(() => {
			k(), document.addEventListener("click", w), document.addEventListener("keydown", w);
		}), Ds(() => {
			document.removeEventListener("click", w), document.removeEventListener("keydown", w);
		}), (e, t) => (V(), H("section", bv, [
			U("header", xv, [t[22] ||= U("div", null, [
				U("span", { class: "llm-registry__eyebrow" }, "LLM Registry"),
				U("h2", { id: "llm-registry-title" }, "LLM 모델 관리"),
				U("p", null, "프로모션 생성기에서 사용할 모델과 기본 실행값을 중앙에서 등록하고 관리합니다. API Key는 이 화면에 저장하지 않습니다.")
			], -1), U("div", Sv, [U("button", {
				class: "tiny-button",
				type: "button",
				disabled: r.value,
				onClick: t[0] ||= (e) => k()
			}, "새로고침", 8, Cv), U("button", {
				class: "tiny-button primary",
				type: "button",
				onClick: T
			}, "신규 모델 등록")])]),
			U("div", wv, [
				U("div", null, [U("strong", null, L(b.value.total), 1), t[23] ||= U("span", null, "전체 모델", -1)]),
				U("div", null, [U("strong", null, L(b.value.active), 1), t[24] ||= U("span", null, "활성 모델", -1)]),
				U("div", null, [U("strong", null, L(b.value.used), 1), t[25] ||= U("span", null, "프롬프트 연결", -1)])
			]),
			a.value ? (V(), H("div", Tv, [t[26] ||= U("strong", null, "LLM 모델 관리 오류", -1), U("span", null, L(a.value), 1)])) : G("", !0),
			U("div", Ev, [U("aside", Dv, [U("div", Ov, [
				z(U("input", {
					"onUpdate:modelValue": t[1] ||= (e) => l.value = e,
					type: "search",
					"aria-label": "LLM 모델 검색",
					placeholder: "모델 이름 또는 ID 검색"
				}, null, 512), [[J, l.value]]),
				z(U("select", {
					"onUpdate:modelValue": t[2] ||= (e) => u.value = e,
					"aria-label": "LLM Provider 필터"
				}, [...t[27] ||= [
					U("option", { value: "" }, "전체 Provider", -1),
					U("option", { value: "openai" }, "OpenAI", -1),
					U("option", { value: "google" }, "Google", -1)
				]], 512), [[Y, u.value]]),
				z(U("select", {
					"onUpdate:modelValue": t[3] ||= (e) => d.value = e,
					"aria-label": "LLM 상태 필터"
				}, [...t[28] ||= [
					U("option", { value: "" }, "전체 상태", -1),
					U("option", { value: "active" }, "활성", -1),
					U("option", { value: "draft" }, "초안", -1),
					U("option", { value: "inactive" }, "사용 중지", -1)
				]], 512), [[Y, d.value]])
			]), U("div", kv, [(V(!0), H(K, null, B(y.value, (e) => (V(), H("button", {
				key: e.id,
				type: "button",
				class: g(["llm-registry__row", { selected: e.id === c.value }]),
				onClick: (t) => E(e)
			}, [U("span", jv, [
				U("strong", null, L(e.displayName), 1),
				U("small", null, L(e.modelId), 1),
				U("span", Mv, [U("small", null, [t[29] ||= U("b", null, "모델 용도", -1), W(L(S(e.modality)), 1)]), U("small", null, [t[30] ||= U("b", null, "연결 프롬프트", -1), W(L(e.usage?.total || 0) + "개", 1)])])
			]), U("span", Nv, [U("em", { class: g(`is-${e.status}`) }, L(x(e.status)), 3), U("small", null, L(e.provider), 1)])], 10, Av))), 128)), !r.value && !y.value.length ? (V(), H("p", Pv, "조건에 맞는 모델이 없습니다.")) : G("", !0)])]), U("form", {
				class: "llm-registry__editor",
				onSubmit: Lu(te, ["prevent"])
			}, [
				U("div", Fv, [U("div", null, [U("strong", null, L(_.value ? _.value.displayName : "신규 LLM 모델"), 1), _.value ? (V(), H("span", Iv, "프롬프트 " + L(_.value.usage?.total || 0) + "개 연결 · 운영 상태 " + L(_.value.usage?.active || 0) + "개", 1)) : G("", !0)]), _.value ? (V(), H("span", {
					key: 0,
					class: g(["llm-registry__status", `is-${_.value.status}`])
				}, L(x(_.value.status)), 3)) : G("", !0)]),
				U("fieldset", {
					disabled: i.value,
					class: "llm-registry__fields"
				}, [
					U("div", Rv, [
						U("label", null, [t[32] ||= U("span", null, "Provider", -1), z(U("select", {
							"onUpdate:modelValue": t[4] ||= (e) => h.provider = e,
							disabled: !!_.value
						}, [...t[31] ||= [U("option", { value: "openai" }, "OpenAI", -1), U("option", { value: "google" }, "Google", -1)]], 8, zv), [[Y, h.provider]])]),
						U("label", null, [t[33] ||= U("span", null, "모델 ID", -1), z(U("input", {
							"onUpdate:modelValue": t[5] ||= (e) => h.modelId = e,
							disabled: !!_.value,
							type: "text",
							autocomplete: "off",
							placeholder: "gpt-... / gemini-..."
						}, null, 8, Bv), [[J, h.modelId]])]),
						U("label", null, [t[34] ||= U("span", null, "표시 이름", -1), z(U("input", {
							"onUpdate:modelValue": t[6] ||= (e) => h.displayName = e,
							type: "text",
							autocomplete: "off"
						}, null, 512), [[J, h.displayName]])]),
						U("label", null, [t[36] ||= U("span", null, "모델 용도", -1), z(U("select", {
							"onUpdate:modelValue": t[7] ||= (e) => h.modality = e,
							onChange: D
						}, [...t[35] ||= [U("option", { value: "text" }, "텍스트·JSON", -1), U("option", { value: "image" }, "이미지 생성·편집", -1)]], 544), [[Y, h.modality]])]),
						U("label", null, [U("span", Vv, [t[41] ||= W(" 기본 Temperature ", -1), U("span", {
							ref_key: "temperatureGuideRoot",
							ref: p,
							class: "llm-registry__guide-anchor"
						}, [U("button", {
							class: "llm-registry__guide-button",
							type: "button",
							"aria-label": "기본 Temperature 가이드",
							"aria-controls": "temperature-guide-popover",
							"aria-expanded": String(f.value),
							onClick: t[8] ||= Lu((e) => f.value = !f.value, ["stop"])
						}, "i", 8, Hv), f.value ? (V(), H("span", {
							key: 0,
							id: "temperature-guide-popover",
							class: "llm-registry__guide-popover",
							role: "dialog",
							"aria-label": "Temperature 설정 가이드",
							onClick: t[10] ||= Lu(() => {}, ["stop"])
						}, [
							t[37] ||= U("strong", null, "Temperature 설정 가이드", -1),
							t[38] ||= U("span", null, [U("b", null, "0~0.2"), W(" 구조화 JSON·레이아웃처럼 일관성이 중요한 작업")], -1),
							t[39] ||= U("span", null, [U("b", null, "0.3~0.7"), W(" 프로모션 카피와 아이디어처럼 적당한 다양성이 필요한 작업")], -1),
							t[40] ||= U("span", null, [U("b", null, "미설정"), W(" 모델 기본값 사용. GPT-6 Reasoning·이미지 모델에 권장")], -1),
							U("button", {
								type: "button",
								onClick: t[9] ||= (e) => f.value = !1
							}, "닫기")
						])) : G("", !0)], 512)]), z(U("input", {
							"onUpdate:modelValue": t[11] ||= (e) => h.defaultTemperature = e,
							type: "number",
							min: "0",
							max: "2",
							step: "0.1",
							placeholder: "미설정"
						}, null, 512), [[J, h.defaultTemperature]])]),
						U("label", null, [t[42] ||= U("span", null, "기본 Max Tokens", -1), z(U("input", {
							"onUpdate:modelValue": t[12] ||= (e) => h.defaultMaxTokens = e,
							type: "number",
							min: "1",
							step: "1",
							placeholder: "미설정"
						}, null, 512), [[J, h.defaultMaxTokens]])]),
						U("label", null, [t[44] ||= U("span", null, "기본 응답 형식", -1), z(U("select", { "onUpdate:modelValue": t[13] ||= (e) => h.defaultResponseFormat = e }, [...t[43] ||= [
							U("option", { value: "text" }, "text", -1),
							U("option", { value: "json_object" }, "json_object", -1),
							U("option", { value: "image" }, "image", -1)
						]], 512), [[Y, h.defaultResponseFormat]])]),
						h.modality === "image" ? (V(), H("label", Uv, [
							t[45] ||= U("span", null, "지원 이미지 크기", -1),
							z(U("input", {
								"onUpdate:modelValue": t[14] ||= (e) => h.supportedImageSizesText = e,
								type: "text",
								placeholder: "1K, 2K, 4K"
							}, null, 512), [[J, h.supportedImageSizesText]]),
							t[46] ||= U("small", null, "쉼표로 구분합니다.", -1)
						])) : G("", !0)
					]),
					U("label", Wv, [t[47] ||= U("span", null, "설명", -1), z(U("textarea", {
						"onUpdate:modelValue": t[15] ||= (e) => h.description = e,
						rows: "3"
					}, null, 512), [[J, h.description]])]),
					U("div", Gv, [U("label", null, [z(U("input", {
						"onUpdate:modelValue": t[16] ||= (e) => h.isRecommended = e,
						type: "checkbox"
					}, null, 512), [[Mu, h.isRecommended]]), t[48] ||= W(" 권장 모델", -1)]), U("label", null, [z(U("input", {
						"onUpdate:modelValue": t[17] ||= (e) => h.isLegacy = e,
						type: "checkbox"
					}, null, 512), [[Mu, h.isLegacy]]), t[49] ||= W(" 레거시 모델", -1)])]),
					U("label", Kv, [t[50] ||= U("span", null, "Provider 기본 옵션(JSON)", -1), z(U("textarea", {
						"onUpdate:modelValue": t[18] ||= (e) => h.modelOptionsText = e,
						rows: "7",
						spellcheck: "false"
					}, null, 512), [[J, h.modelOptionsText]])]),
					U("label", qv, [t[51] ||= U("span", null, "변경 사유", -1), z(U("input", {
						"onUpdate:modelValue": t[19] ||= (e) => h.changeNote = e,
						type: "text",
						autocomplete: "off",
						placeholder: "등록 또는 변경 이유"
					}, null, 512), [[J, h.changeNote]])])
				], 8, Lv),
				U("div", Jv, [
					U("button", {
						class: "tiny-button primary",
						type: "submit",
						disabled: i.value || !h.modelId || !h.displayName
					}, L(_.value ? "설정 저장" : "초안 등록"), 9, Yv),
					_.value?.status === "active" ? G("", !0) : (V(), H("button", {
						key: 0,
						class: "tiny-button",
						type: "button",
						disabled: i.value,
						onClick: t[20] ||= (e) => ne("active")
					}, "활성화", 8, Xv)),
					_.value?.status === "active" ? (V(), H("button", {
						key: 1,
						class: "tiny-button danger",
						type: "button",
						disabled: i.value,
						onClick: t[21] ||= (e) => ne("inactive")
					}, "사용 중지", 8, Zv)) : G("", !0)
				]),
				t[53] ||= U("p", { class: "llm-registry__guard" }, "Provider와 모델 ID는 등록 후 변경할 수 없습니다. 사용 중인 프롬프트가 있으면 모델을 중지할 수 없습니다.", -1),
				_.value ? (V(), H("details", Qv, [U("summary", null, [U("span", null, [t[52] ||= U("strong", null, "LLM 업데이트 내역", -1), U("small", null, "등록·설정 수정·상태 변경 " + L(v.value.length) + "건", 1)])]), U("div", $v, [(V(!0), H(K, null, B(v.value, (e) => (V(), H("article", {
					key: e.id,
					class: "llm-registry__history-item"
				}, [
					U("div", null, [U("strong", null, L(ee(e)), 1), U("time", { datetime: e.changedAt }, L(C(e.changedAt)), 9, ey)]),
					U("p", null, L(e.changeNote || "변경 사유 없음"), 1),
					U("span", null, L(e.changedBy || "system") + " · " + L(e.snapshot?.defaultResponseFormat || "-") + " · Max " + L(e.snapshot?.defaultMaxTokens || "-"), 1)
				]))), 128)), v.value.length ? G("", !0) : (V(), H("p", ty, "기록된 업데이트 내역이 없습니다."))])])) : G("", !0)
			], 32)])
		]));
	}
}, [["__scopeId", "data-v-990ebc13"]]);
//#endregion
//#region admin-app/src/services/prompt-variable-service.mjs
async function ry() {
	let e = await fetch("/api/prompt-variables", { cache: "no-store" }), t = await e.json().catch(() => ({}));
	if (!e.ok) throw Error(t.message || t.error || `프롬프트 변수 요청 오류(${e.status})`);
	return t;
}
var iy = Object.freeze({ list: ry });
//#endregion
//#region admin-app/src/components/PromptVariableManager.vue
qh();
var ay = {
	class: "prompt-variable-manager",
	"aria-labelledby": "prompt-variable-title"
}, oy = { class: "prompt-variable-manager__header" }, sy = ["disabled"], cy = {
	class: "prompt-variable-manager__summary",
	"aria-label": "프롬프트 변수 현황"
}, ly = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, uy = { class: "prompt-variable-manager__workspace" }, dy = { class: "prompt-variable-manager__list" }, fy = { class: "prompt-variable-manager__filters" }, py = {
	class: "prompt-variable-manager__rows",
	"aria-live": "polite"
}, my = ["onClick"], hy = { class: "prompt-variable-manager__badges" }, gy = {
	key: 0,
	class: "is-required"
}, _y = {
	key: 1,
	class: "is-optional"
}, vy = {
	key: 0,
	class: "prompt-variable-manager__empty"
}, yy = { class: "prompt-variable-manager__detail" }, by = { class: "prompt-variable-manager__detail-heading" }, xy = { class: "prompt-variable-manager__usage-list" }, Sy = {
	key: 1,
	class: "prompt-variable-manager__empty"
}, Cy = /*#__PURE__*/ Jh({
	__name: "PromptVariableManager",
	setup(e) {
		let t = /* @__PURE__ */ R(!1), n = /* @__PURE__ */ R(""), r = /* @__PURE__ */ R([]), i = /* @__PURE__ */ R({
			variableCount: 0,
			promptTypeCount: 0,
			requiredUsageCount: 0,
			optionalUsageCount: 0
		}), a = /* @__PURE__ */ R(""), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R(""), c = q(() => {
			let e = o.value.trim().toLowerCase();
			return r.value.filter((t) => s.value === "required" && !t.requiredCount || s.value === "optional" && !t.optionalCount ? !1 : !e || t.key.toLowerCase().includes(e) || t.usages.some((t) => `${t.promptType} ${t.promptName}`.toLowerCase().includes(e)));
		}), l = q(() => r.value.find((e) => e.key === a.value) || null);
		function u(e) {
			return e === "required" ? "필수" : "선택";
		}
		async function d() {
			t.value = !0, n.value = "";
			try {
				let e = await iy.list();
				r.value = e.variables || [], i.value = e.summary || i.value, r.value.some((e) => e.key === a.value) || (a.value = r.value[0]?.key || "");
			} catch (e) {
				n.value = e.message;
			} finally {
				t.value = !1;
			}
		}
		return ws(d), (e, r) => (V(), H("section", ay, [
			U("header", oy, [r[2] ||= U("div", null, [
				U("span", { class: "prompt-variable-manager__eyebrow" }, "Prompt Contract Registry"),
				U("h2", { id: "prompt-variable-title" }, "프롬프트 변수 관리"),
				U("p", null, "현재 실행 코드와 프롬프트 사이에 등록된 필수·선택 변수 계약을 조회합니다.")
			], -1), U("button", {
				class: "tiny-button",
				type: "button",
				disabled: t.value,
				onClick: d
			}, "새로고침", 8, sy)]),
			r[10] ||= U("div", { class: "prompt-variable-manager__notice" }, [U("strong", null, "현재는 읽기 전용입니다."), U("span", null, "신규 변수는 실행 코드가 값을 공급할 수 있도록 개발된 뒤 계약에 등록해야 합니다.")], -1),
			U("div", cy, [
				U("div", null, [U("strong", null, L(i.value.variableCount), 1), r[3] ||= U("span", null, "고유 변수", -1)]),
				U("div", null, [U("strong", null, L(i.value.promptTypeCount), 1), r[4] ||= U("span", null, "프롬프트 유형", -1)]),
				U("div", null, [U("strong", null, L(i.value.requiredUsageCount), 1), r[5] ||= U("span", null, "필수 연결", -1)]),
				U("div", null, [U("strong", null, L(i.value.optionalUsageCount), 1), r[6] ||= U("span", null, "선택 연결", -1)])
			]),
			n.value ? (V(), H("div", ly, [r[7] ||= U("strong", null, "변수 목록 오류", -1), U("span", null, L(n.value), 1)])) : G("", !0),
			U("div", uy, [U("aside", dy, [U("div", fy, [z(U("input", {
				"onUpdate:modelValue": r[0] ||= (e) => o.value = e,
				type: "search",
				"aria-label": "프롬프트 변수 검색",
				placeholder: "변수명 또는 프롬프트 검색"
			}, null, 512), [[J, o.value]]), z(U("select", {
				"onUpdate:modelValue": r[1] ||= (e) => s.value = e,
				"aria-label": "변수 구분 필터"
			}, [...r[8] ||= [
				U("option", { value: "" }, "전체 구분", -1),
				U("option", { value: "required" }, "필수 변수", -1),
				U("option", { value: "optional" }, "선택 변수", -1)
			]], 512), [[Y, s.value]])]), U("div", py, [(V(!0), H(K, null, B(c.value, (e) => (V(), H("button", {
				key: e.key,
				type: "button",
				class: g(["prompt-variable-manager__row", { selected: e.key === a.value }]),
				onClick: (t) => a.value = e.key
			}, [U("span", null, [U("strong", null, L(e.key), 1), U("small", null, "연결된 프롬프트 유형 " + L(e.promptTypeCount) + "개", 1)]), U("span", hy, [e.requiredCount ? (V(), H("em", gy, "필수 " + L(e.requiredCount), 1)) : G("", !0), e.optionalCount ? (V(), H("em", _y, "선택 " + L(e.optionalCount), 1)) : G("", !0)])], 10, my))), 128)), !t.value && !c.value.length ? (V(), H("p", vy, "조건에 맞는 변수가 없습니다.")) : G("", !0)])]), U("section", yy, [l.value ? (V(), H(K, { key: 0 }, [U("div", by, [U("div", null, [r[9] ||= U("small", null, "변수 키", -1), U("strong", null, L(l.value.key), 1)]), U("span", null, "총 " + L(l.value.promptTypeCount) + "개 프롬프트 유형에서 사용", 1)]), U("div", xy, [(V(!0), H(K, null, B(l.value.usages, (e) => (V(), H("article", { key: `${e.promptType}-${e.requirement}` }, [U("div", null, [U("strong", null, L(e.promptName), 1), U("code", null, L(e.promptType), 1)]), U("em", { class: g(`is-${e.requirement}`) }, L(u(e.requirement)), 3)]))), 128))])], 64)) : (V(), H("p", Sy, "왼쪽에서 변수를 선택해 주세요."))])])
		]));
	}
}, [["__scopeId", "data-v-7c369cc6"]]);
//#endregion
//#region admin-app/src/services/section-layout-preset-service.mjs
async function wy(e, t = {}, n = globalThis.fetch) {
	let r = await n(e, {
		cache: "no-store",
		...t,
		headers: {
			"Content-Type": "application/json",
			...t.headers || {}
		}
	}), i = await r.json().catch(() => ({}));
	if (!r.ok) {
		let e = Error(i.message || i.error || `Request failed (${r.status})`);
		throw e.validationErrors = i.errors || [], e;
	}
	return i;
}
function Ty(e = []) {
	let t = e.filter((e) => e.isVisibleInWizard !== !1), n = (e) => Object.fromEntries(t.map((t, n) => [t.itemKey, {
		positionMode: "free",
		xPct: e === "mobile" ? 5 : 4 + n % 2 * 48,
		yPx: 16 + Math.floor(n / (e === "mobile" ? 1 : 2)) * 72,
		widthPct: e === "mobile" ? 90 : 44,
		heightPx: 52,
		zIndex: 1
	}]));
	return {
		contractVersion: 1,
		layoutMode: "free",
		sectionStyle: {
			minHeight: Math.max(50, 40 + Math.ceil(t.length / 2) * 72, t.length ? 40 + t.length * 72 : 50),
			backgroundColor: "#0B0D12"
		},
		viewports: {
			desktop: {
				items: n("desktop"),
				visibility: { items: {} }
			},
			mobile: {
				items: n("mobile"),
				visibility: { items: {} }
			}
		}
	};
}
function Ey(e, t, n = globalThis.location?.origin) {
	return Uh.sectionPreset(e, t, n);
}
var Dy = Object.freeze({
	list(e, t) {
		return wy(`/api/wizard-content-section-layouts?sectionId=${encodeURIComponent(e)}`, {}, t);
	},
	create(e, t) {
		return wy("/api/wizard-content-section-layouts", {
			method: "POST",
			body: JSON.stringify(e)
		}, t);
	},
	update(e, t, n, r) {
		return wy("/api/wizard-content-section-layout", {
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				sectionId: t,
				...n
			})
		}, r);
	},
	remove(e, t, n) {
		return wy(`/api/wizard-content-section-layout?id=${encodeURIComponent(e)}&sectionId=${encodeURIComponent(t)}`, { method: "DELETE" }, n);
	},
	setDefault(e, t, n) {
		return wy("/api/wizard-content-section-layout-default", {
			method: "POST",
			body: JSON.stringify({
				id: e,
				sectionId: t
			})
		}, n);
	},
	updateAiLayoutVariants(e, t, n) {
		return wy("/api/wizard-content-section", {
			method: "PATCH",
			body: JSON.stringify({
				id: e.id,
				aiDesign: {
					...e.aiDesign || {},
					allowedLayoutVariants: t
				},
				changeNote: "레이아웃 프리셋의 AI 선택 후보 정책 변경."
			})
		}, n);
	},
	editorUrl: Ey
});
//#endregion
//#region admin-app/src/components/SectionLayoutVisualEditorFrame.vue
qh();
var Oy = {
	__name: "SectionLayoutVisualEditorFrame",
	props: {
		section: {
			type: Object,
			required: !0
		},
		layout: {
			type: Object,
			required: !0
		}
	},
	emits: ["saved", "close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => {
			let e = new URL(Dy.editorUrl(n.section.id, n.layout.layoutKey));
			return e.searchParams.set("embedded", "1"), e.toString();
		});
		function a(e) {
			e.type === "promo-section-layout-saved" && (e.sectionId !== n.section.id || e.layoutId !== n.layout.id || r("saved", e));
		}
		return (t, n) => (V(), Ja(rg, {
			title: `${e.layout.name} · 레이아웃 프리셋 편집기`,
			description: `${e.layout.layoutKey} · 실제 텍스트·이미지·CTA 렌더링 기준`,
			"editor-url": i.value,
			"iframe-title": `${e.section.name} ${e.layout.name} 레이아웃 프리셋 편집기`,
			"save-target-label": "선택한 레이아웃 프리셋",
			"read-only": e.section.status !== "draft",
			"read-only-message": "활성·비활성 섹션은 읽기 전용입니다. 초안을 만든 후 레이아웃을 편집하세요.",
			onEditorMessage: a,
			onClose: n[0] ||= (e) => r("close")
		}, null, 8, [
			"title",
			"description",
			"editor-url",
			"iframe-title",
			"read-only"
		]));
	}
}, ky = Object.freeze({
	desktopWide: "desktop-1920",
	desktop: "desktop-1440",
	tablet: "tablet-768",
	mobile: "mobile-375"
});
function Ay(e = {}) {
	let t = e.tokenValues || {}, n = new Map((e.tokenCatalog || []).map((e) => [e.name || e.tokenKey, e])), r = [], i = {}, a = (e, i) => {
		let a = t[e], o = n.get(e);
		return !o || o.state === "draft" || o.state === "incomplete" || typeof a != "string" || !a.trim() ? r.push({
			code: "LAYOUT_TOKEN_REQUIRED",
			path: e,
			message: `등록된 레이아웃 토큰이 필요합니다: ${e}`
		}) : (i === "count" ? !/^[1-9]\d*$/.test(a) || Number(a) > 64 : !/^\d+(?:\.\d+)?px$/.test(a)) && r.push({
			code: "LAYOUT_TOKEN_INVALID",
			path: e,
			message: `레이아웃 기준은 컬럼 정수 또는 px 단위여야 합니다: ${e}`
		}), e;
	};
	for (let [e, t] of Object.entries(ky)) i[e] = {
		columns: a(`--grid-${t}-columns`, "count"),
		gutter: a(`--grid-${t}-gutter`),
		margin: a(`--grid-${t}-margin-inline`)
	};
	let o = a("--breakpoint-tablet-min"), s = a("--breakpoint-desktop-min"), c = a("--grid-reference-desktop-1920-width");
	!r.length && !(parseFloat(t[o]) > 0 && parseFloat(t[o]) < parseFloat(t[s]) && parseFloat(t[s]) < parseFloat(t[c])) && r.push({
		code: "LAYOUT_BREAKPOINT_ORDER",
		path: "breakpoints",
		message: "태블릿·데스크톱·와이드 기준을 오름차순으로 설정하세요."
	});
	let l = Object.keys(t).filter((e) => /^--spacing-[a-z0-9-]+$/.test(e) && n.has(e) && /^(?:0|\d+(?:\.\d+)?(?:px|rem|em))$/.test(t[e]));
	return {
		ok: !r.length,
		errors: r,
		profiles: i,
		breakpoints: {
			tablet: o,
			desktop: s,
			wide: c
		},
		spacing: l
	};
}
//#endregion
//#region shared/registered-token-policy.mjs
var jy = {
	radius: "border-radius",
	shadow: "box-shadow",
	font: "font-family",
	color: "color",
	textColor: "color",
	backgroundColor: "background-color",
	backgroundFadeColor: "background-color",
	surfaceColor: "background-color",
	accentColor: "color",
	ctaColor: "color",
	borderColor: "border-color",
	fontStyle: "font-style",
	textDecoration: "text-decoration",
	fontFamily: "font-family",
	fontSize: "font-size",
	fontWeight: "font-weight",
	lineHeight: "line-height",
	letterSpacing: "letter-spacing",
	borderRadius: "border-radius",
	boxShadow: "box-shadow",
	textBackground: "background-color",
	textGradient: "background-image",
	textStyle: "typography",
	marginTopPx: "margin",
	marginBottomPx: "margin",
	paddingPx: "padding",
	layoutGapPx: "gap",
	mobileLayoutGapPx: "gap",
	layoutPaddingBlockPx: "padding",
	mobileLayoutPaddingBlockPx: "padding"
}, My = (e) => String(e ?? "").trim().toLowerCase().replace(/\s+/g, " "), Ny = /* @__PURE__ */ new Set([
	"marginTopPx",
	"marginBottomPx",
	"fontSize",
	"letterSpacing",
	"paddingPx",
	"layoutGapPx",
	"mobileLayoutGapPx",
	"layoutPaddingBlockPx",
	"mobileLayoutPaddingBlockPx"
]);
function Py(e, t = {}, n = [], r = null, i = []) {
	let a = Object.fromEntries(Object.entries(t).filter(([e, t]) => /^--[a-z][a-z0-9-]*$/.test(e) && typeof t == "string" && t.trim())), o = new Map(n.map((e) => [e.tokenKey, e])), s = [];
	function c(e, t) {
		if (!Object.hasOwn(a, e)) return !1;
		let n = o.get(e), r = n?.cssProperties || (n?.cssProperty ? [n.cssProperty] : []);
		return !r.length || !t || r.includes(t) || t === "color" && r.includes("background-color");
	}
	let l = (i || []).flatMap((e) => (e.items || []).flatMap((t) => [{
		key: `${e.sectionKey}.${t.itemKey}`,
		fieldKind: t.fieldKind
	}, ...(t.fields || []).map((n) => ({
		key: `${e.sectionKey}.${t.itemKey}.${n.fieldKey}`,
		fieldKind: n.fieldKind
	}))])).sort((e, t) => t.key.length - e.key.length);
	function u(e, t, n, i) {
		if (!c(e, t)) return !1;
		if (!r || !t) return !0;
		let a = l.find((e) => n.includes(e.key)) || {};
		return !jg(r, {
			tokenKey: e,
			property: t,
			target: /(?:layoutGapPx|mobileLayoutGapPx|layoutPaddingBlockPx|mobileLayoutPaddingBlockPx)$/.test(n) ? "layout" : Ag(t, {
				...a,
				tag: i?.tag,
				sectionRole: n.startsWith("designSpec.theme") || n.includes(".sectionStyles.") ? "page" : ""
			}),
			path: n
		}).length;
	}
	function d(e, t, n = null) {
		if (Array.isArray(e)) return e.map((e, n) => d(e, `${t}[${n}]`));
		if (!e || typeof e != "object") return e;
		let r = {};
		for (let [i, o] of Object.entries(e)) {
			let c = jy[i.endsWith("Token") ? i.slice(0, -5) : i];
			if (i.endsWith("Token") || t.endsWith(".tokenBindings")) u(o, c, `${t}.${i}`, n) ? r[i] = o : s.push({
				code: "UNREGISTERED_DESIGN_TOKEN",
				path: `${t}.${i}`,
				value: o
			});
			else if (c) {
				let e = My(typeof o == "number" && Ny.has(i) ? `${o}px` : o);
				Object.keys(a).some((r) => u(r, c, `${t}.${i}`, n) && My(a[r]) === e) ? r[i] = o : s.push({
					code: "UNREGISTERED_DESIGN_VALUE",
					path: `${t}.${i}`,
					value: o
				});
			} else r[i] = d(o, `${t}.${i}`, e.nodeType ? e : n);
		}
		return r;
	}
	return {
		spec: d(e, "designSpec"),
		errors: s
	};
}
//#endregion
//#region shared/promo-token-runtime.mjs
var Fy = /^--[a-z][a-z0-9-]*$/;
function Iy(e) {
	if (Array.isArray(e)) {
		let t = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			if (e?.metadata?.libraryToken && (e.metadata.state !== "active" || e.metadata.libraryToken.type === "typography" || e.valueType === "typography")) return;
			let n = String(e?.tokenKey || e?.token_key || "").trim(), r = String(e?.value ?? e?.tokenValue ?? e?.token_value ?? "").trim();
			!Fy.test(n) || !r || (t.has(n) || t.set(n, []), t.get(n).push({
				value: r,
				valueIndex: Math.max(0, Number.parseInt(e?.valueIndex ?? e?.value_index ?? 0, 10) || 0)
			}));
		}), Object.fromEntries([...t.entries()].map(([e, t]) => [e, t.sort((e, t) => e.valueIndex - t.valueIndex).map((e) => e.value).join(", ")]));
	}
	return !e || typeof e != "object" ? {} : Object.fromEntries(Object.entries(e).map(([e, t]) => [String(e).trim(), String(t ?? "").trim()]).filter(([e, t]) => Fy.test(e) && t));
}
function Ly(e, t = {}) {
	let n = Iy(e);
	if (t.usagePolicy) return {
		...n,
		...Og(t.usagePolicy, n)
	};
	let r = t.registeredOnly === !0;
	r && (t = {});
	let i = (...e) => e.map((e) => String(e || "").trim()).find(Boolean) || "", a = i(n["--promo-bg"], n["--app-bg"], n["--promo-surface"], n["--app-surface"], n["--color-bg-dark-800"], t.background), o = i(n["--promo-text"], n["--app-ink"], n["--app-text"], n["--button-label-default"], t.text), s = i(n["--promo-muted"], n["--app-muted"], n["--app-ink-soft"], t.muted), c = i(n["--promo-accent"], n["--app-accent"], n["--color-brand-500"], t.accent, t.cta), l = i(n["--app-on-accent"], t.ctaInk, o), u = i(n["--promo-radius"], n["--app-radius"], n["--border-radius-md"], t.radius), d = i(n["--promo-shadow"], n["--app-shadow"], n["--shadow-elevation-1"], t.shadow), f = i(n["--app-font-body"], n["--app-font-family"], n["--promo-font"], n["--typography-body-lg-typeface"], n["--typeface-roboto"], t.font), p = { ...n }, m = (e, t) => {
		t && (p[e] = t);
	};
	return m("--promo-bg", a), m("--promo-ink", o), m("--promo-muted-ink", s), m("--promo-accent", c), m("--promo-cta", c ? "var(--promo-accent)" : ""), m("--promo-cta-bg", t.ctaTransparent === !0 ? "transparent" : c ? "var(--promo-accent)" : ""), m("--promo-cta-ink", t.ctaTransparent === !0 && c ? "var(--promo-accent)" : l), m("--promo-cta-radius", u), m("--promo-image-radius", u), m("--promo-component-radius", u), m("--promo-component-shadow", d), m("--promo-font", f), m("--promo-radius", u), m("--promo-shadow", d), m("--promo-hero-bg-image", n["--app-hero-bg-image"]), m("--promo-button-height", n["--app-button-height"]), m("--promo-space-4", n["--app-space-4"]), m("--promo-border-width", n["--app-border-width"]), m("--promo-font-size-body", i(n["--promo-font-size-body"], n["--app-font-size-body"], n["--typography-body-md-font-size"], r ? "" : "1rem")), m("--promo-title-size", i(n["--promo-font-size-main-title"], n["--promo-title-size"], n["--typography-title-lg-font-size"], t.titleSize)), m("--promo-font-weight-strong", n["--app-font-weight-strong"]), m("--promo-transition-duration", n["--app-transition-duration-normal"]), m("--promo-transition-delay", n["--app-transition-delay"]), m("--promo-transition-ease", n["--app-ease"]), p;
}
//#endregion
//#region visual-editor/src/editor-utils.mjs
var Ry = /* @__PURE__ */ new Set(["http:", "https:"]);
function zy(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return Ry.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
var By = 24e3;
function Vy(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
}
function Hy(e) {
	return Math.round(Number(e) * 100) / 100;
}
function Uy(e, t) {
	let n = Number(e);
	return Vy(Number.isFinite(n) && n > 0 ? n : t, 50, By, 50);
}
function Wy(e = [], t = () => ({}), n = (e) => Gy(e), r = 20) {
	let i = 0, a = 0, o = 0, s = 0;
	return (Array.isArray(e) ? e : []).forEach((e) => {
		let r = t(e) || {}, c = Math.max(0, Number(n(e, r)) || Gy(e));
		if (r.positionMode === "free") {
			s += 1, a = Math.max(a, Math.max(0, Number(r.yPx) || 0) + c);
			return;
		}
		o += 1, i += c;
	}), Math.max(50, o ? i + r : 0, s ? a + r : 0);
}
function Gy(e = {}) {
	let t = Array.isArray(e.fields) ? e.fields : [];
	return t.length > 1 ? t.reduce((e, t) => e + Gy(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
}
function Ky(e = {}) {
	return (Array.isArray(e.fields) ? e.fields : []).length > 1 ? 100 : e.fieldKind === "image" ? 44 : e.fieldKind === "cta" ? 24 : e.textType === "title" || e.textType === "headline" ? 72 : (e.textType === "lead" || e.textType === "multi" || e.fieldKind, 60);
}
function qy(e = {}, t = {}) {
	return e.fieldKind === "image" ? !1 : t.heightMode === "auto" || e.fieldKind === "text" && t.heightMode !== "fixed";
}
function Jy(e = {}, t = {}) {
	if (!qy(e, t)) return Vy(t.heightPx, 24, 900, Gy(e));
}
function Yy({ item: e = {}, style: t = {}, canvasWidth: n, fallbackX: r = 0, fallbackY: i = 0 } = {}) {
	let a = Math.max(1, Number(n) || 1280), o = Vy(t.widthPct, 4, 100, Ky(e)), s = Vy(t.heightPx, 24, 900, Gy(e));
	return {
		x: Vy(t.xPct, 0, 100, r) / 100 * a,
		y: Vy(t.yPx, 0, By, i),
		width: o / 100 * a,
		height: s,
		widthPct: o,
		fontSize: Vy(t.fontSize, 0, 80, 18)
	};
}
function Xy(e, t, { includeHeight: n = !0, includeFontSize: r = !0 } = {}) {
	let i = Math.max(1, Number(t) || 1280);
	return {
		positionMode: "free",
		xPct: Hy(e.x / i * 100),
		yPx: Hy(e.y),
		widthPct: Hy(e.width / i * 100),
		...n ? { heightPx: Hy(e.height) } : {},
		...r ? { fontSize: Hy(e.fontSize) } : {}
	};
}
//#endregion
//#region visual-editor/src/platform/layout-engine/resize.mjs
function Zy(e, t) {
	return String(e || "se").includes(t);
}
function Qy({ geometry: e, deltaX: t = 0, deltaY: n = 0, direction: r = "se", minimumWidth: i = 1, minimumHeight: a = 1, maximumWidth: o = Infinity, maximumHeight: s = 900, aspectRatioLocked: c = !1, aspectRatio: l = 1, scaleFont: u = !0, maximumFontSize: d = 80 } = {}) {
	let f = {
		x: Number(e?.x) || 0,
		y: Number(e?.y) || 0,
		width: Math.max(i, Number(e?.width) || i),
		height: Math.max(a, Number(e?.height) || a),
		fontSize: Vy(e?.fontSize, 0, d, 18)
	}, p = Zy(r, "w"), m = Zy(r, "e"), h = Zy(r, "n"), g = Zy(r, "s"), _ = p || m, v = h || g, y = _ ? p ? -t : t : 0, b = v ? h ? -n : n : 0, x = _ ? Vy(f.width + y, i, o, f.width) : f.width, S = v ? Vy(f.height + b, a, s, f.height) : f.height;
	if (c) {
		let e = Number(l) > 0 ? Number(l) : 1;
		v && (!_ || Math.abs(n) > Math.abs(t)) ? (x = Vy(S * e, i, o, f.width), S = Vy(x / e, a, s, f.height)) : (S = Vy(x / e, a, s, f.height), x = Vy(S * e, i, o, f.width));
	}
	let ee = p ? f.x + f.width - x : f.x, C = h ? f.y + f.height - S : f.y, w = f.width ? x / f.width : 1, T = f.height ? S / f.height : 1, E = _ && v ? Math.sqrt(w * T) : _ ? w : T, D = Math.max(_ ? x - f.width : 0, v ? S - f.height : 0, 0), O = f.fontSize === 0 ? D / 4 : f.fontSize * E, k = u ? Vy(O, 0, d, f.fontSize) : f.fontSize;
	return {
		x: Hy(ee),
		y: Hy(C),
		width: Hy(x),
		height: Hy(S),
		fontSize: Hy(k),
		widthScale: w,
		heightScale: T
	};
}
//#endregion
//#region visual-editor/src/platform/render-spec/RenderSpecNode.vue
qh();
var $y = ["src", "alt"], eb = /*@__PURE__*/ Object.assign({ name: "RenderSpecNode" }, {
	__name: "RenderSpecNode",
	props: {
		node: {
			type: Object,
			required: !0
		},
		editable: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["select-field"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => n.editable ? {
			"data-render-path": n.node.path,
			...n.node.fieldKey ? { "data-field-key": n.node.fieldKey } : {}
		} : {});
		function a(e) {
			!n.editable || !n.node.fieldKey || (e.preventDefault(), e.stopPropagation(), r("select-field", {
				fieldKey: n.node.fieldKey,
				field: n.node.field
			}));
		}
		return (t, n) => {
			let o = Ci("RenderSpecNode", !0);
			return V(), Ja(wi(e.node.tag), ao({
				...e.node.attributes,
				...i.value
			}, {
				class: ["render-spec-node", [
					`render-spec-node--${e.node.nodeType}`,
					e.node.fieldKind ? `render-spec-node--${e.node.fieldKind}` : "",
					e.node.field?.textType ? `render-spec-node--text-${e.node.field.textType}` : ""
				]],
				style: e.node.style,
				onClick: a
			}), {
				default: Dr(() => [e.node.nodeType === "field" && e.node.tag === "picture" && e.node.imageSrc ? (V(), H("img", {
					key: 0,
					class: "render-spec-picture-image",
					src: e.node.imageSrc,
					alt: e.node.imageAlt
				}, null, 8, $y)) : e.node.nodeType === "field" && e.node.tag !== "img" ? (V(), H(K, { key: 1 }, [W(L(e.node.text), 1)], 64)) : G("", !0), (V(!0), H(K, null, B(e.node.tag === "img" ? [] : e.node.children, (t) => (V(), Ja(o, {
					key: t.path,
					node: t,
					editable: e.editable,
					onSelectField: n[0] ||= (e) => r("select-field", e)
				}, null, 8, ["node", "editable"]))), 128))]),
				_: 1
			}, 16, ["class", "style"]);
		};
	}
}), tb = /* @__PURE__ */ new Set([
	"div",
	"section",
	"article",
	"header",
	"footer",
	"nav",
	"main",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"p",
	"span",
	"strong",
	"small",
	"img",
	"picture",
	"a",
	"button",
	"ul",
	"ol",
	"li"
]), nb = /* @__PURE__ */ new Set([
	"role",
	"aria-label",
	"aria-labelledby",
	"aria-describedby",
	"aria-hidden",
	"alt",
	"href",
	"target",
	"rel",
	"data-render-id"
]), rb = Object.freeze({
	color: "color",
	backgroundColor: "backgroundColor",
	borderColor: "borderColor",
	fontFamily: "fontFamily",
	fontSize: "fontSize",
	lineHeight: "lineHeight",
	letterSpacing: "letterSpacing",
	fontWeight: "fontWeight",
	padding: "padding",
	gap: "gap",
	margin: "margin",
	borderRadius: "borderRadius",
	boxShadow: "boxShadow",
	maxWidth: "maxWidth",
	minHeight: "minHeight"
}), ib = Object.freeze({
	gapToken: "gap",
	rowGapToken: "rowGap",
	columnGapToken: "columnGap",
	paddingToken: "padding",
	paddingTopToken: "paddingTop",
	paddingRightToken: "paddingRight",
	paddingBottomToken: "paddingBottom",
	paddingLeftToken: "paddingLeft"
});
function ab(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function ob(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function sb(e) {
	let t = String(e || "").trim();
	return /^--[a-z][a-z0-9-]*$/.test(t) ? `var(${t})` : void 0;
}
function cb(e) {
	let t = String(e || "").trim();
	return sb(t) || (/^(?:0|[1-9]\d{0,3}px|(?:100|\d{1,2})(?:\.\d+)?%)$/.test(t) ? t : void 0);
}
function lb(e) {
	let t = String(e || "").trim();
	return /^(?:https?:|mailto:|tel:|\/|#)/i.test(t) && !/^(?:javascript|data|vbscript):/i.test(t) ? t : "#";
}
function ub(e) {
	let t = String(e || "").trim();
	return /^(?:https?:\/\/|\/api\/)/i.test(t) ? t : "";
}
function db({ viewport: e = "", viewportWidth: t = 1280, mobileBreakpoint: n = 720, tabletBreakpoint: r = 1024 } = {}) {
	if ([
		"desktop",
		"tablet",
		"mobile"
	].includes(e)) return e;
	let i = Number(t) || 1280;
	return i <= Number(n || 720) ? "mobile" : i <= Number(r || 1024) ? "tablet" : "desktop";
}
function fb(e, t) {
	let n = String(t || "").split(".");
	if (n.shift() !== "root") return null;
	let r = e;
	for (; n[0] === "children";) {
		n.shift();
		let e = Number(n.shift());
		if (!Number.isInteger(e) || !Array.isArray(r?.children) || !r.children[e]) return null;
		r = r.children[e];
	}
	let i = n.shift(), a = n.shift();
	return n.length || !["layout", "tokenBindings"].includes(i) || !a ? null : {
		target: r,
		group: i,
		property: a
	};
}
function pb(e, t = "desktop") {
	let n = ob(e);
	if (!n?.root || ![
		"desktop",
		"tablet",
		"mobile"
	].includes(t)) return n;
	let r = ab(n.responsive?.[t]);
	return Object.entries(r).forEach(([e, t]) => {
		let r = fb(n.root, e);
		r && (r.target[r.group] = {
			...ab(r.target[r.group]),
			[r.property]: ob(t)
		});
	}), n;
}
function mb(e, t, n) {
	let r = Array.isArray(t) ? t : [];
	if (e?.fields && Object.prototype.hasOwnProperty.call(e.fields, n)) return e.fields[n];
	if (r.length <= 1 && String(r[0]?.fieldKey || "") === String(n || "")) return e;
}
function hb(e) {
	let t = ab(e), n = {};
	[
		"block",
		"flex",
		"grid"
	].includes(t.display) && (n.display = t.display), ["row", "column"].includes(t.direction) && (n.flexDirection = t.direction), ["nowrap", "wrap"].includes(t.wrap) && (n.flexWrap = t.wrap), [
		"start",
		"center",
		"end",
		"stretch"
	].includes(t.alignItems) && (n.alignItems = t.alignItems), [
		"start",
		"center",
		"end",
		"space-between",
		"space-around",
		"space-evenly"
	].includes(t.justifyContent) && (n.justifyContent = t.justifyContent), Number.isInteger(t.columns) && t.columns >= 1 && t.columns <= 12 && (n.gridTemplateColumns = `repeat(${t.columns}, minmax(0, 1fr))`), Object.entries(ib).forEach(([e, r]) => {
		let i = sb(t[e]);
		i && (n[r] = i);
	}), (t.width === "auto" || /^(?:100|\d{1,2})(?:\.\d+)?%$/.test(String(t.width || ""))) && (n.width = t.width);
	let r = cb(t.minHeight), i = cb(t.maxWidth);
	return r && (n.minHeight = r), i && (n.maxWidth = i), /^(?:[1-9]\d?(?:\.\d+)?)\/(?:[1-9]\d?(?:\.\d+)?)$/.test(String(t.aspectRatio || "")) && (n.aspectRatio = String(t.aspectRatio).replace("/", " / ")), [
		"visible",
		"hidden",
		"clip"
	].includes(t.overflow) && (n.overflow = t.overflow), n;
}
function gb(e) {
	return Object.entries(ab(e)).reduce((e, [t, n]) => {
		let r = rb[t], i = sb(n);
		return r && i && (e[r] = i), e;
	}, {});
}
function _b(e) {
	let t = {};
	return Object.entries(ab(e)).forEach(([e, n]) => {
		!nb.has(e) || /^on/i.test(e) || ![
			"string",
			"number",
			"boolean"
		].includes(typeof n) || (e === "href" ? t.href = lb(n) : e === "target" && ["_self", "_blank"].includes(String(n)) ? t.target = String(n) : t[e] = n);
	}), t.target === "_blank" && (t.rel = "noopener noreferrer"), t;
}
function vb(e, t) {
	return String(e && typeof e == "object" ? e.label ?? e.value ?? e.description ?? "" : e ?? t?.defaultValue ?? "");
}
function yb(e, t, n, r) {
	let i = { ...t };
	if (e === "a") {
		i.href = lb(n?.link || i.href);
		let e = ["_self", "_blank"].includes(String(n?.target || "")) ? n.target : i.target;
		e && (i.target = e), i.target === "_blank" && (i.rel = "noopener noreferrer");
	}
	if (e === "img") {
		let e = ub(n?.value);
		e ? i.src = e : delete i.src, i.alt = String(n?.alt || n?.description || i.alt || r?.name || "").trim();
	}
	return i;
}
function bb(e, t, n, r, i = !1) {
	let a = { ...e }, o = ["title", "headline"].includes(String(t?.textType || "").toLowerCase()) || /^h[1-6]$/u.test(n);
	if (i || r !== "mobile" || !o) return a;
	let s = "clamp(2rem, 10vw, 3.25rem)";
	return a.fontSize = a.fontSize ? `min(${a.fontSize}, ${s})` : s, a.lineHeight ||= "1.08", a;
}
function xb({ renderSpec: e, fields: t = [], componentValue: n, breakpoint: r = "desktop", registeredOnly: i = !1 } = {}) {
	if (Number(e?.contractVersion) !== 1 || !e?.root) return null;
	let a = pb(e, r), o = new Map((Array.isArray(t) ? t : []).map((e) => [String(e?.fieldKey || ""), e]));
	function s(e, a) {
		if (!e || typeof e != "object" || Array.isArray(e)) return null;
		let c = tb.has(String(e.tag || "").toLowerCase()) ? String(e.tag).toLowerCase() : "div", l = e.nodeType === "field", u = l ? String(e.fieldKey || "") : "", d = l && o.get(u) || null, f = l ? mb(n, t, u) : void 0, p = yb(c, _b(e.attributes), f, d), m = l && (c === "img" || c === "picture") ? ub(f?.value) : "", h = l && (c === "img" || c === "picture") ? String(f?.alt || f?.description || p.alt || d?.name || "").trim() : "";
		return {
			path: a,
			nodeType: l ? "field" : "element",
			tag: c,
			semanticRole: String(e.semanticRole || ""),
			fieldKey: u,
			field: d,
			fieldKind: String(d?.fieldKind || ""),
			value: f,
			text: l ? vb(f, d) : "",
			imageSrc: m,
			imageAlt: h,
			attributes: p,
			style: bb({
				...hb(e.layout),
				...gb(e.tokenBindings)
			}, d, c, r, i),
			children: (Array.isArray(e.children) ? e.children : []).map((e, t) => s(e, `${a}.children.${t}`)).filter(Boolean)
		};
	}
	return s(a.root, "root");
}
//#endregion
//#region visual-editor/src/platform/render-spec/RenderSpecTree.vue
qh();
var Sb = {
	__name: "RenderSpecTree",
	props: {
		renderSpec: {
			type: Object,
			required: !0
		},
		fields: {
			type: Array,
			default: () => []
		},
		value: { default: null },
		viewport: {
			type: String,
			default: ""
		},
		viewportWidth: {
			type: Number,
			default: 1280
		},
		mobileBreakpoint: {
			type: Number,
			default: 720
		},
		tabletBreakpoint: {
			type: Number,
			default: 1024
		},
		editable: {
			type: Boolean,
			default: !1
		},
		registeredOnly: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["select-field"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => db({
			viewport: n.viewport,
			viewportWidth: n.viewportWidth,
			mobileBreakpoint: n.mobileBreakpoint,
			tabletBreakpoint: n.tabletBreakpoint
		})), a = q(() => xb({
			renderSpec: n.renderSpec,
			registeredOnly: n.registeredOnly,
			fields: n.fields,
			componentValue: n.value,
			breakpoint: i.value
		}));
		return (t, n) => a.value ? (V(), Ja(eb, {
			key: 0,
			node: a.value,
			editable: e.editable,
			onSelectField: n[0] ||= (e) => r("select-field", e)
		}, null, 8, ["node", "editable"])) : G("", !0);
	}
};
//#endregion
//#region visual-editor/src/PromoPageRenderer.vue
qh();
var Cb = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, wb = {
	key: 1,
	class: "promo-resize-announcement",
	"aria-live": "polite"
}, Tb = [
	"data-section-key",
	"data-section-role",
	"data-motion-target",
	"aria-busy"
], Eb = ["title"], Db = {
	key: 0,
	"aria-hidden": "true"
}, Ob = { class: "rendered-section__inner" }, kb = [
	"data-item-key",
	"data-style-key",
	"data-collection-key",
	"data-collection-index",
	"data-motion-target",
	"onClick",
	"onDblclickCapture",
	"onPointerdown"
], Ab = [
	"aria-label",
	"title",
	"onPointerdown",
	"onKeydown"
], jb = [
	"aria-label",
	"title",
	"onClick"
], Mb = {
	key: 2,
	class: "output-hidden-badge"
}, Nb = {
	key: 3,
	class: "item-outline-label",
	"aria-hidden": "true"
}, Pb = { key: 0 }, Fb = { key: 1 }, Ib = [
	"data-field-key",
	"data-field-kind",
	"data-field-style-key",
	"aria-selected",
	"tabindex",
	"onClick"
], Lb = [
	"href",
	"target",
	"rel",
	"draggable",
	"onClick"
], Rb = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], zb = ["data-asset-target-key"], Bb = {
	key: 0,
	"aria-hidden": "true"
}, Vb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], Hb = ["data-text-line-index"], Ub = { class: "rendered-text-line__content" }, Wb = { class: "rendered-text__content" }, Gb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], Kb = { class: "rendered-text__content" }, qb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], Jb = [
	"aria-label",
	"title",
	"onClick"
], Yb = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Xb = [
	"href",
	"target",
	"rel",
	"draggable"
], Zb = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Qb = ["data-asset-target-key"], $b = ["title"], ex = {
	key: 0,
	"aria-hidden": "true"
}, tx = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], nx = ["onClick", "onDblclick"], rx = ["data-text-line-index"], ix = { class: "rendered-text-line__content" }, ax = { class: "rendered-text__content" }, ox = ["onClick", "onDblclick"], sx = { class: "rendered-text__content" }, cx = ["onClick", "onDblclick"], lx = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], ux = [
	"aria-label",
	"title",
	"onPointerdown"
], dx = 20, fx = 7, px = {
	__name: "PromoPageRenderer",
	props: {
		content: {
			type: Object,
			required: !0
		},
		designSpec: {
			type: Object,
			required: !0
		},
		assets: {
			type: Object,
			required: !0
		},
		editable: {
			type: Boolean,
			default: !1
		},
		showGuides: {
			type: Boolean,
			default: !0
		},
		outlineMode: {
			type: Boolean,
			default: !1
		},
		selectedItemKey: {
			type: String,
			default: ""
		},
		selectedItemKeys: {
			type: Array,
			default: () => []
		},
		selectedFieldKey: {
			type: String,
			default: ""
		},
		sectionDesignRuns: {
			type: Object,
			default: () => ({})
		},
		motionSpec: {
			type: Object,
			default: () => ({
				sections: {},
				items: {}
			})
		},
		viewportOverride: {
			type: String,
			default: ""
		}
	},
	emits: [
		"select-item",
		"select-text-lines",
		"open-item-inspector",
		"open-field-inspector",
		"update-item-style",
		"update-renderer-item-style",
		"update-renderer-field-style",
		"update-item-content",
		"update-section-style"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = /* @__PURE__ */ R(typeof globalThis.innerWidth == "number" ? globalThis.innerWidth : 1280), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(/* @__PURE__ */ new Set()), c = /* @__PURE__ */ R({}), l = null, u = null, d = null, f = null, m = null, h = "idle", _ = 0, v = !1, y = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ R("");
		function x() {
			if (!o.value || h !== "idle") return;
			let e = new Set(o.value.querySelectorAll("[data-auto-height-measure=\"true\"]"));
			y.forEach((t) => {
				e.has(t) || (u?.unobserve(t), y.delete(t));
			});
			let t = { ...c.value }, n = !1;
			e.forEach((e) => {
				u?.observe(e), y.add(e);
				let r = e.dataset.styleKey, i = e.getBoundingClientRect().height;
				!r || !Number.isFinite(i) || i <= 0 || Math.abs(Number(t[r] || 0) - i) < .5 || (t[r] = i, n = !0);
			}), n && (c.value = t);
		}
		function S() {
			v || (_ && cancelAnimationFrame(_), hr(() => {
				v || (_ = requestAnimationFrame(() => {
					_ = 0, x();
				}));
			}));
		}
		function ee(e) {
			h = e;
		}
		function C(e) {
			h === e && (h = "idle", S());
		}
		function w() {
			a.value = globalThis.innerWidth || 1280;
		}
		ws(async () => {
			v = !1, globalThis.addEventListener("resize", w), await hr(), typeof ResizeObserver < "u" && (u = new ResizeObserver(x)), x(), !(r.editable || typeof IntersectionObserver > "u") && (l = new IntersectionObserver((e) => {
				let t = new Set(s.value);
				e.forEach((e) => {
					e.isIntersecting && (t.add(e.target.dataset.motionTarget), l?.unobserve(e.target));
				}), s.value = t;
			}, {
				threshold: .15,
				rootMargin: "0px 0px -10% 0px"
			}), o.value?.querySelectorAll("[data-motion-target]").forEach((e) => l.observe(e)));
		}), Ds(() => {
			v = !0, globalThis.removeEventListener("resize", w), d?.(), d = null, f?.(), f = null, _ && cancelAnimationFrame(_), _ = 0, y.clear(), u?.disconnect(), l?.disconnect();
		});
		let T = q(() => r.viewportOverride ? r.viewportOverride === "mobile" : a.value < Number.parseFloat(D.value["--breakpoint-tablet-min"])), E = q(() => {
			let e = r.content?.sectionSnapshot || [], t = r.content?.sectionOrder || [], n = new Map(t.map((e, t) => [e, t]));
			return [...e].sort((e, t) => (n.get(e.sectionKey) ?? e.sortOrder ?? 0) - (n.get(t.sectionKey) ?? t.sortOrder ?? 0));
		}), D = q(() => Iy(r.content?.runtimeTheme?.designTokens?.values || r.content?.formTemplate?.designTokens?.values)), O = q(() => r.content?.runtimeTheme?.designTokens?.policy === "registered-only"), k = q(() => O.value ? Py(r.designSpec, D.value, r.content?.runtimeTheme?.designTokens?.catalog || [], r.content?.runtimeTheme?.designTokens?.usagePolicy, r.content?.sectionSnapshot || []).spec : r.designSpec), te = q(() => Ly(D.value, {
			registeredOnly: O.value,
			usagePolicy: r.content?.runtimeTheme?.designTokens?.usagePolicy,
			background: k.value?.theme?.backgroundColor,
			text: k.value?.theme?.textColor,
			accent: k.value?.theme?.accentColor,
			cta: k.value?.theme?.ctaColor || k.value?.theme?.accentColor,
			ctaTransparent: k.value?.theme?.ctaVariant === "ghost",
			font: k.value?.theme?.fontFamily
		}));
		function ne(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function A(e) {
			let t = Number(e?.renderSpec?.contractVersion) === 1 && e?.renderSpec?.root ? e.renderSpec : null;
			return !t || !O.value ? t : Py(t, D.value, r.content?.runtimeTheme?.designTokens?.catalog || [], r.content?.runtimeTheme?.designTokens?.usagePolicy, r.content?.sectionSnapshot || []).spec;
		}
		function re(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function ie(e, t, n) {
			return `${re(e, t)}.${n.fieldKey}`;
		}
		function j(e, t) {
			if (t?.isRequired || t?.isLocked) return !0;
			let n = re(e, t);
			return ((T.value ? k.value?.responsiveLayouts?.mobile?.visibility?.items?.[n] : void 0) ?? k.value?.visibility?.items?.[n]) !== !1;
		}
		function M(e, t, n) {
			return n?.isRequired || n?.isLocked ? !0 : k.value?.visibility?.fields?.[ie(e, t, n)] !== !1;
		}
		function ae(e, t) {
			return ne(t).map((n, r) => ({
				field: n,
				index: r,
				order: Number(Be(e, t, n).order)
			})).filter(({ field: n }) => r.editable || M(e, t, n)).sort((e, t) => (Number.isFinite(e.order) ? e.order : e.index * 10) - (Number.isFinite(t.order) ? t.order : t.index * 10)).map(({ field: e }) => e);
		}
		function N(e, t, n = null) {
			let i = r.content?.sectionInputs?.[e.sectionKey]?.[t.itemKey];
			return !n || ne(t).length <= 1 ? i : i?.fields?.[n.fieldKey];
		}
		function oe(e) {
			let t = String(e?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(t) ? t : "";
		}
		function se(e, t) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) && e.aiDesign.imageTargetItemKeys.includes(t?.itemKey);
		}
		function P(e, t, n) {
			if (se(e, t)) return !1;
			let r = String(n?.value || "").trim();
			return n?.source === "ai" || r.startsWith("/api/promo-section-design-image?");
		}
		function F(e) {
			return (e.items || []).filter((t) => (r.editable || j(e, t)) && (t.fieldKind !== "image" || !P(e, t, N(e, t))) && (ne(t).length <= 1 || ae(e, t).length > 0));
		}
		function ce(e, t) {
			return ne(t).every((n) => !ue(N(e, t, n)));
		}
		function I(e) {
			let t = String(_e(e).backgroundImage || "").trim(), n = (e.items || []).filter((e) => e.fieldKind === "image").map((t) => ({
				item: t,
				value: N(e, t)
			})).find(({ item: t, value: n }) => P(e, t, n)), r = t || String(n?.value?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(r) ? r : "";
		}
		function le(e) {
			return zy(e?.link);
		}
		function ue(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function de(e, t = null) {
			let n = t || e;
			return String(n?.description || n?.editorSchema?.description || (t ? "" : e?.description) || "내용을 입력하세요").trim();
		}
		function fe(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function pe(e, t) {
			let n = fe(e, t), r = k.value?.itemStyles?.[n] || {};
			return T.value ? {
				...r,
				...k.value?.responsiveLayouts?.mobile?.itemStyles?.[n] || {}
			} : r;
		}
		function me(e, t) {
			return k.value?.responsiveLayouts?.mobile?.itemStyles?.[fe(e, t)] || {};
		}
		function he(e) {
			return [e, ...ne(e)].some((e) => ["title", "headline"].includes(String(e?.textType || "").toLowerCase()));
		}
		function ge(e, t, n) {
			let r = me(e, t), i = r.fontSize !== void 0 || !!r.fontSizeToken, a = n.fontSizeToken ? `var(${n.fontSizeToken})` : n.fontSize === void 0 ? "" : `${n.fontSize}px`;
			if (O.value || !T.value || i || !he(t)) return a || void 0;
			let o = "clamp(2rem, 10vw, 3.25rem)";
			return a ? `min(${a}, ${o})` : o;
		}
		function _e(e) {
			return k.value?.sectionStyles?.[e.sectionKey] || {};
		}
		function ve(e) {
			return _e(e).layoutMode === "flow";
		}
		function ye(e) {
			let t = _e(e), n = T.value ? t.mobileLayoutColumns : t.layoutColumns, i = r.viewportOverride || (T.value ? "mobile" : a.value < parseFloat(D.value["--breakpoint-desktop-min"]) ? "tablet" : "desktop"), o = !r.editable && O.value ? Number(D.value[`--grid-${{
				desktop: "desktop-1440",
				tablet: "tablet-768",
				mobile: "mobile-375"
			}[i]}-columns`]) : T.value ? 2 : 6;
			return Math.max(1, Math.min(o, Number(n) || 1));
		}
		function be(e, t) {
			let n = e === "section" ? r.motionSpec?.sections : r.motionSpec?.items;
			return n?.[t] || (e === "item" ? n?.[String(t).split(".").at(-1)] : null) || null;
		}
		function xe(e, t) {
			return !e?.presetVersionId || !r.editable && e.trigger === "viewport-enter" && !s.value.has(t) ? "" : [
				"motion-fade-up",
				"motion-fade-in",
				"motion-scale-in"
			].includes(e.className) ? e.className : String(e.presetVersionId).includes("fade-up") ? "motion-fade-up" : String(e.presetVersionId).includes("fade-in") ? "motion-fade-in" : String(e.presetVersionId).includes("scale-in") ? "motion-scale-in" : "motion-fade-in";
		}
		function Se(e, t) {
			return xe(be(e, t), `${e}:${t}`);
		}
		function Ce(e, t) {
			let n = be(e, t);
			return n ? {
				"--motion-duration": n.durationToken || void 0,
				"--motion-easing": n.easingToken || void 0,
				"--motion-delay": n.delayToken || void 0
			} : {};
		}
		function we(e, t, n) {
			let r = be("item", fe(e, t));
			if (r?.inherit === !1) return r;
			let i = be("section", e.sectionKey);
			if (!i?.presetVersionId || i.childrenMode !== "stagger") return null;
			let a = Math.max(0, Math.min(160, Number.parseInt(i.staggerToken, 10) || 0)), o = Math.max(0, Number.parseInt(i.delayToken, 10) || 0), s = Number.isFinite(Number(r?.motionOrder)) ? Number(r.motionOrder) : n;
			return {
				...i,
				delayToken: `${Math.min(800, o + a * s)}ms`
			};
		}
		function Te(e, t, n) {
			return xe(we(e, t, n), `item:${fe(e, t)}`);
		}
		function Ee(e, t, n) {
			let r = we(e, t, n);
			return r ? {
				"--motion-duration": r.durationToken || void 0,
				"--motion-easing": r.easingToken || void 0,
				"--motion-delay": r.delayToken || void 0
			} : {};
		}
		let De = /* @__PURE__ */ new Set([
			"queued",
			"analyzing_content",
			"generating_layout",
			"validating_layout",
			"generating_assets",
			"validating_assets",
			"applying"
		]);
		function Oe(e) {
			return r.sectionDesignRuns?.[e.sectionKey] || null;
		}
		function ke(e, t) {
			let n = t === "item" ? "AI 이미지" : "AI 키비주얼";
			return {
				queued: `${n} 생성 준비 중`,
				analyzing_content: "콘텐츠 분석 중",
				generating_layout: "레이아웃 생성 중",
				validating_layout: "레이아웃 검증 중",
				generating_assets: `${n} 생성 중`,
				validating_assets: `${n} 검증 중`,
				applying: `${n} 적용 중`
			}[e] || `${n} 처리 중`;
		}
		function Ae(e, t = null, n = null) {
			let r = Oe(e), i = r?.constraintsSnapshot?.imageTarget;
			return (t ? i?.type === "item" && i.itemKey === t.itemKey && (!n || !i.fieldKey || i.fieldKey === n.fieldKey) : i?.type === "section-background") ? De.has(r.status) ? {
				kind: "processing",
				label: ke(r.status, i.type)
			} : r.status === "failed" ? {
				kind: "failed",
				label: i.type === "item" ? "AI 이미지 생성 실패" : "AI 키비주얼 생성 실패",
				detail: String(r.errorMessage || "").trim()
			} : null : null;
		}
		function je(e, t) {
			let n = pe(e, t);
			return t.fieldKind === "image" && (n.shape === "circle" || n.aspectRatioLocked !== !1) ? [
				"nw",
				"ne",
				"se",
				"sw"
			] : qy(t, n) ? ["e", "w"] : [
				"nw",
				"n",
				"ne",
				"e",
				"se",
				"s",
				"sw",
				"w"
			];
		}
		let Me = {
			nw: "왼쪽 위",
			n: "위",
			ne: "오른쪽 위",
			e: "오른쪽",
			se: "오른쪽 아래",
			s: "아래",
			sw: "왼쪽 아래",
			w: "왼쪽"
		};
		function Ne(e, t) {
			let n = e.fieldKind === "image" ? "이미지" : "컴포넌트";
			return `${e.name} ${n} ${Me[t] || t} 방향 크기 조절`;
		}
		function Pe(e, t, n, r) {
			let i = [
				"left",
				"center",
				"right"
			].includes(e.horizontalAnchor) ? e.horizontalAnchor : "center", a = [
				"top",
				"middle",
				"bottom"
			].includes(e.verticalAnchor) ? e.verticalAnchor : "middle", o = {
				left: 0,
				center: .5,
				right: 1
			}[i], s = {
				top: 0,
				middle: .5,
				bottom: 1
			}[a];
			return {
				offsetX: Math.round((t.x - n * o + t.width * o) * 100) / 100,
				offsetY: Math.round((t.y - r * s + t.height * s) * 100) / 100
			};
		}
		function Fe(e, t, n) {
			let r = n ? Math.round(t.width / n * 1e4) / 100 : 0;
			b.value = `${e.name} 너비 ${r}%, 높이 ${Math.round(t.height)}픽셀`;
		}
		function Ie(e, t, n, r) {
			let i = Number(e);
			return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
		}
		function Le(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function Re(e, t) {
			return t.shape === "circle" ? "1 / 1" : Le(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function ze(e, t) {
			let n = pe(e, t), r = oe(N(e, t)), i = [
				"square",
				"rounded",
				"circle"
			].includes(n.shape) ? n.shape : "square";
			return {
				backgroundImage: r ? `url(${JSON.stringify(r)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(n.imageFit) ? n.imageFit : "contain",
				backgroundPosition: n.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				borderRadius: n.borderRadiusToken ? `var(${n.borderRadiusToken})` : i === "circle" ? "50%" : i === "rounded" ? "var(--promo-image-radius)" : "0"
			};
		}
		function Be(e, t, n) {
			let r = `${fe(e, t)}.${n.fieldKey}`, i = k.value?.itemStyles?.[r] || {}, a = T.value && k.value?.responsiveLayouts?.mobile?.itemStyles?.[r] || {};
			return {
				...i,
				...a
			};
		}
		function Ve(e, t, n) {
			let r = Be(e, t, n), { order: i, widthPct: a, minHeightPx: o, horizontalAlign: s, alignSelf: c, marginTopPx: l, marginBottomPx: u, ...d } = r;
			return {
				...d,
				color: r.colorToken ? `var(${r.colorToken})` : r.color,
				backgroundColor: r.backgroundColorToken ? `var(${r.backgroundColorToken})` : r.backgroundColor,
				borderRadius: r.borderRadiusToken ? `var(${r.borderRadiusToken})` : r.borderRadius,
				boxShadow: r.boxShadowToken ? `var(${r.boxShadowToken})` : r.boxShadow,
				fontFamily: r.fontFamilyToken ? `var(${r.fontFamilyToken})` : r.fontFamily,
				fontSize: r.fontSizeToken ? `var(${r.fontSizeToken})` : r.fontSize,
				fontWeight: r.fontWeightToken ? `var(${r.fontWeightToken})` : r.fontWeight,
				lineHeight: r.lineHeightToken ? `var(${r.lineHeightToken})` : r.lineHeight,
				letterSpacing: r.letterSpacingToken ? `var(${r.letterSpacingToken})` : r.letterSpacing
			};
		}
		function He(e, t, n) {
			let r = Be(e, t, n), i = Math.min(100, Math.max(5, Number(r.widthPct) || 100)), a = [
				"left",
				"center",
				"right",
				"stretch"
			].includes(r.horizontalAlign) ? r.horizontalAlign : "stretch";
			return {
				order: Number.isFinite(Number(r.order)) ? Number(r.order) : void 0,
				width: `${i}%`,
				minHeight: Number(r.minHeightPx) > 0 ? `${Math.min(1200, Math.max(28, Number(r.minHeightPx)))}px` : void 0,
				justifySelf: a === "stretch" ? "stretch" : a === "left" ? "start" : a === "right" ? "end" : "center",
				alignSelf: [
					"start",
					"center",
					"end",
					"stretch"
				].includes(r.alignSelf) ? r.alignSelf : void 0,
				marginTop: Number(r.marginTopPx) > 0 ? `${Math.min(240, Number(r.marginTopPx))}px` : void 0,
				marginBottom: Number(r.marginBottomPx) > 0 ? `${Math.min(240, Number(r.marginBottomPx))}px` : void 0
			};
		}
		function Ue(e, t, n) {
			return `${fe(e, t)}.${n.fieldKey}`;
		}
		function We(e, t, n) {
			return r.selectedFieldKey === Ue(e, t, n);
		}
		function Ge(e, t, n, a) {
			r.editable && (e.preventDefault(), e.stopPropagation(), i("open-field-inspector", t, n, a));
		}
		function Ke(e) {
			return e.fieldKind === "text" ? ["e", "w"] : [
				"e",
				"s",
				"w",
				"se"
			];
		}
		function qe(e, t) {
			return `${e.name || e.fieldKey} ${Me[t] || t} 방향 크기 조절`;
		}
		function Je(e, t, n, a, o) {
			if (!r.editable || n.isLocked || a.isLocked || e.button !== 0) return;
			let s = e.currentTarget, c = s.closest(".rendered-component-field-shell"), l = c?.closest(".rendered-component-fields");
			if (!c || !l) return;
			e.preventDefault(), e.stopPropagation(), d?.(), f?.(), c.querySelector("[contenteditable=\"true\"]")?.blur();
			try {
				s.setPointerCapture(e.pointerId);
			} catch {
				return;
			}
			ee("component-field-resize"), c.classList.add("is-resizing-field");
			let u = l.getBoundingClientRect(), p = c.getBoundingClientRect(), m = e.clientX, h = e.clientY, g = o.includes("e") || o.includes("w"), _ = o.includes("s") && a.fieldKind !== "text", v = p.width, y = p.height, b = !1, x = !1, S = (t) => {
				if (x || t.pointerId !== e.pointerId) return;
				if ((t.buttons & 1) != 1) {
					w(!0);
					return;
				}
				t.cancelable && t.preventDefault();
				let n = t.clientX - m, r = t.clientY - h;
				if (!(Math.hypot(n, r) < .5)) {
					if (b = !0, g) {
						let e = o.includes("w") ? -1 : 1;
						v = Math.min(u.width, Math.max(u.width * .05, p.width + n * e));
					}
					_ && (y = Math.min(1200, Math.max(28, p.height + t.clientY - h))), g && (c.style.width = `${v}px`), _ && (c.style.minHeight = `${y}px`);
				}
			}, w = (r = !1) => {
				if (!x) {
					if (x = !0, r && b && i("update-renderer-field-style", t, n, a, {
						...g ? { widthPct: Math.round(v / u.width * 1e4) / 100 } : {},
						..._ ? { minHeightPx: Math.round(y) } : {}
					}), c.style.removeProperty("width"), c.style.removeProperty("min-height"), c.classList.remove("is-resizing-field"), s.hasPointerCapture(e.pointerId)) try {
						s.releasePointerCapture(e.pointerId);
					} catch {}
					globalThis.removeEventListener("pointermove", S), globalThis.removeEventListener("pointerup", T), globalThis.removeEventListener("pointercancel", E), globalThis.removeEventListener("blur", D), s.removeEventListener("lostpointercapture", D), f === D && (f = null), C("component-field-resize");
				}
			}, T = (t) => {
				t.pointerId === e.pointerId && w(!0);
			}, E = (t) => {
				t.pointerId === e.pointerId && w(!1);
			}, D = () => w(!1);
			f = D, globalThis.addEventListener("pointermove", S, { passive: !1 }), globalThis.addEventListener("pointerup", T), globalThis.addEventListener("pointercancel", E), globalThis.addEventListener("blur", D), s.addEventListener("lostpointercapture", D);
		}
		function Ye(e, t, n, r, a) {
			if (!e.key.startsWith("Arrow") || n.isLocked || r.isLocked) return;
			let o = e.currentTarget.closest(".rendered-component-field-shell"), s = o?.closest(".rendered-component-fields");
			if (!o || !s) return;
			e.preventDefault(), e.stopPropagation();
			let c = e.shiftKey ? 10 : 1, l = Be(t, n, r), u = a.includes("e") || a.includes("w"), d = a.includes("s") && r.fieldKind !== "text", f = u ? e.key === "ArrowLeft" ? -c : e.key === "ArrowRight" ? c : 0 : 0, p = d ? e.key === "ArrowUp" ? -c : e.key === "ArrowDown" ? c : 0 : 0;
			!f && !p || i("update-renderer-field-style", t, n, r, {
				...f ? { widthPct: Math.min(100, Math.max(5, (Number(l.widthPct) || 100) + f)) } : {},
				...p ? { minHeightPx: Math.min(1200, Math.max(28, (Number(l.minHeightPx) || o.getBoundingClientRect().height) + p)) } : {}
			});
		}
		function Xe(e, t, n) {
			let r = Ve(e, t, n), i = oe(N(e, t, n)), a = [
				"square",
				"rounded",
				"circle"
			].includes(r.shape) ? r.shape : "square";
			return {
				backgroundImage: i ? `url(${JSON.stringify(i)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(r.imageFit) ? r.imageFit : "contain",
				backgroundPosition: r.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				aspectRatio: Le(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: r.borderRadiusToken ? `var(${r.borderRadiusToken})` : a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius)" : "0"
			};
		}
		function Ze(e, t, n) {
			let r = Ve(e, t, n), i = N(e, t, n);
			return r.decorative === !0 ? {
				ariaHidden: "true",
				role: void 0,
				label: void 0
			} : {
				ariaHidden: void 0,
				role: "img",
				label: String(r.accessibleLabel || i?.alt || i?.description || n.name || "Promotion image").trim()
			};
		}
		function Qe(e, t) {
			let n = pe(e, t), r = N(e, t);
			return n.decorative === !0 ? {
				ariaHidden: "true",
				role: void 0,
				label: void 0
			} : {
				ariaHidden: void 0,
				role: "img",
				label: String(n.accessibleLabel || r?.alt || r?.description || t.name || "Promotion image").trim()
			};
		}
		function $e(e) {
			return Gy(e);
		}
		function et(e, t) {
			let n = pe(e, t), r = c.value[fe(e, t)];
			if (Number.isFinite(r) && r > 0) return r;
			let i = Number(n.heightPx);
			return n.positionMode === "free" && Number.isFinite(i) && i > 0 ? i : (t.fieldKind === "text" && qy(t, n), $e(t));
		}
		function tt(e) {
			return Wy(e.items || [], (t) => pe(e, t), (t) => et(e, t), dx);
		}
		function nt(e) {
			let t = tt(e);
			return Math.max(t, Uy(_e(e).minHeight, t));
		}
		function rt(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((t, n) => t + et(e, n), 0), a = nt(e), o = Math.max(50, a - dx);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function it(e) {
			return [
				"none",
				"left",
				"right",
				"both"
			].includes(e.backgroundFadeMode) ? e.backgroundFadeMode : e.backgroundFadeSafeArea === "left-copy" ? "left" : e.backgroundFadeSafeArea === "right-copy" ? "right" : e.backgroundFadeSafeArea === "center-copy" ? "both" : "none";
		}
		function at(e) {
			let t = String(e || "").trim();
			return /^--[a-z][a-z0-9-]*$/.test(t) && (!O.value || Object.hasOwn(D.value, t)) ? `var(${t})` : "";
		}
		function ot(e) {
			let t = String(e || "").trim();
			return String(D.value[t] || "").trim();
		}
		function st(e) {
			return at(e.backgroundColorToken) || String(e.backgroundColor || "").trim() || at(k.value?.theme?.backgroundColorToken) || String(k.value?.theme?.backgroundColor || "").trim() || (r.content?.runtimeTheme?.designTokens?.usagePolicy ? "var(--render-policy-bg)" : "var(--promo-bg)");
		}
		function ct(e) {
			return ot(e.backgroundFadeColorToken || e.backgroundColorToken) || String(e.backgroundFadeColor || e.backgroundColor || "").trim() || ot(k.value?.theme?.backgroundColorToken) || String(k.value?.theme?.backgroundColor || "").trim();
		}
		function lt(e, t, n = "medium", r = {}) {
			if (!/^#[0-9a-f]{6}$/i.test(String(t || ""))) return "";
			let i = r?.[n] || {
				soft: {
					solid: 8,
					clear: 38,
					edge: 18
				},
				medium: {
					solid: 14,
					clear: 48,
					edge: 24
				},
				strong: {
					solid: 22,
					clear: 62,
					edge: 32
				}
			}[n] || {
				solid: 14,
				clear: 48,
				edge: 24
			};
			return e === "left" ? `linear-gradient(to right, ${t} 0%, ${t} ${i.solid}%, transparent ${i.clear}%)` : e === "right" ? `linear-gradient(to left, ${t} 0%, ${t} ${i.solid}%, transparent ${i.clear}%)` : e === "both" ? `linear-gradient(to right, ${t} 0%, transparent ${i.edge}%, transparent ${100 - i.edge}%, ${t} 100%)` : "";
		}
		function ut(e) {
			let t = _e(e), n = nt(e), r = I(e), i = st(t), a = r ? lt(it(t), ct(t), t.backgroundFadeStrength, t.backgroundFadeStops) : "", o = t.backgroundFitMode || (t.backgroundSize === "100% auto" ? "width-fill" : t.backgroundSize), s = o === "width-fill" ? "100% auto" : ["contain", "cover"].includes(o) ? o : "cover", c = ve(e);
			return {
				height: c ? void 0 : `${Math.max(50, n)}px`,
				minHeight: c ? `${Math.max(50, n)}px` : void 0,
				backgroundColor: i,
				backgroundImage: r ? [a, `url(${JSON.stringify(r)})`].filter(Boolean).join(", ") : void 0,
				backgroundSize: r ? a ? `100% 100%, ${s}` : s : void 0,
				backgroundPosition: r ? a ? `center, ${t.backgroundPosition || "center center"}` : t.backgroundPosition || "center center" : void 0,
				backgroundRepeat: r ? a ? `no-repeat, ${t.backgroundRepeat || "no-repeat"}` : t.backgroundRepeat || "no-repeat" : void 0
			};
		}
		function dt(e) {
			let t = nt(e);
			if (!r.editable && O.value) {
				let t = Ay({
					tokenValues: D.value,
					tokenCatalog: r.content?.runtimeTheme?.designTokens?.catalog || []
				});
				if (!t.ok) return {};
				let n = r.viewportOverride || (a.value < parseFloat(D.value["--breakpoint-tablet-min"]) ? "mobile" : a.value < parseFloat(D.value["--breakpoint-desktop-min"]) ? "tablet" : "desktop"), i = t.profiles[n], o = r.content.runtimeTheme.designTokens.usagePolicy;
				return ve(e) ? {
					display: "grid",
					height: "auto",
					gridTemplateColumns: `repeat(${Math.min(ye(e), Number(D.value[i.columns]))},minmax(0,1fr))`,
					gap: `var(${o.bindings["layout.gap"] || i.gutter})`,
					paddingBlock: o.bindings["layout.padding"] ? `var(${o.bindings["layout.padding"]})` : void 0
				} : {};
			}
			if (ve(e)) {
				let n = _e(e), r = T.value ? n.mobileLayoutGapPx : n.layoutGapPx, i = T.value ? n.mobileLayoutPaddingBlockPx : n.layoutPaddingBlockPx, a = [
					"start",
					"center",
					"end",
					"stretch"
				].includes(n.contentAlignment) ? n.contentAlignment : "stretch";
				return {
					height: "auto",
					minHeight: `${Math.max(0, t - dx)}px`,
					display: "grid",
					gridTemplateColumns: `repeat(${ye(e)}, minmax(0, 1fr))`,
					gridAutoRows: "max-content",
					gap: O.value && r === void 0 ? void 0 : `${Math.max(0, Math.min(120, Number(r) || (O.value ? 0 : 24)))}px`,
					alignContent: a === "stretch" ? "center" : a,
					alignItems: a,
					justifyItems: a,
					paddingBlock: O.value && i === void 0 ? void 0 : `${Math.max(0, Math.min(200, Number(i) || (O.value ? 0 : 40)))}px`,
					boxSizing: "border-box"
				};
			}
			return { height: `${Math.max(0, t - dx)}px` };
		}
		function ft(e, t) {
			let n = pe(e, t), r = ge(e, t, n), i = n.positionMode === "anchored", a = n.positionMode === "free" ? n : rt(e, t), o = t.fieldKind === "image", s = Ie(n.widthPct, 4, 100, Ky(t));
			qy(t, n);
			let l = !o && n.widthMode === "fit-content", u = Jy(t, n), d = [
				"left",
				"center",
				"right"
			].includes(n.horizontalAnchor) ? n.horizontalAnchor : "center", f = [
				"top",
				"middle",
				"bottom"
			].includes(n.verticalAnchor) ? n.verticalAnchor : "middle", p = {
				left: "0%",
				center: "50%",
				right: "100%"
			}[d], m = {
				left: "0%",
				center: "-50%",
				right: "-100%"
			}[d], h = Math.max(0, nt(e) - dx), g = c.value[fe(e, t)], _ = Number.isFinite(g) && g > 0 ? g : u || et(e, t), v = Math.max(0, h - _), y = {
				top: 0,
				middle: .5,
				bottom: 1
			}[f], b = i ? h * y + (Number(n.offsetY) || 0) - _ * y : n.yPx === void 0 ? (Number(a.yPct) || 0) / 100 * h : Number(n.yPx) || 0, x = Math.min(v, Math.max(0, b)), S = i ? void 0 : Math.min(Math.max(0, 100 - s), Math.max(0, Number(a.xPct) || 0)), ee = {
				left: i ? p : `${S}%`,
				top: `${x}px`,
				transform: i ? `translateX(${m}) translateX(${Number(n.offsetX) || 0}px)` : void 0,
				zIndex: n.zIndex || 2,
				color: n.colorToken ? `var(${n.colorToken})` : n.color,
				backgroundColor: n.backgroundColorToken ? `var(${n.backgroundColorToken})` : n.backgroundColor,
				borderRadius: n.borderRadiusToken ? `var(${n.borderRadiusToken})` : n.borderRadius,
				boxShadow: n.boxShadowToken ? `var(${n.boxShadowToken})` : n.boxShadow,
				"--item-color": n.colorToken ? `var(${n.colorToken})` : n.color,
				fontFamily: n.fontFamilyToken ? `var(${n.fontFamilyToken})` : n.fontFamily,
				fontSize: r,
				"--item-font-size": r,
				fontWeight: n.fontWeightToken ? `var(${n.fontWeightToken})` : n.fontWeight,
				"--item-font-weight": n.fontWeightToken ? `var(${n.fontWeightToken})` : n.fontWeight,
				"--item-text-gradient": n.textGradientToken ? `var(${n.textGradientToken})` : void 0,
				"--item-text-background": n.textBackgroundToken ? `var(${n.textBackgroundToken})` : n.textBackground,
				"--item-list-padding": `${1.35 + Ie(n.listIndent, 0, 6, 0) * 1.5}em`,
				lineHeight: n.lineHeightToken ? `var(${n.lineHeightToken})` : n.lineHeight,
				letterSpacing: n.letterSpacingToken ? `var(${n.letterSpacingToken})` : n.letterSpacing,
				fontStyle: n.fontStyle,
				textDecoration: n.textDecoration,
				textAlign: n.textAlign,
				width: l ? "fit-content" : n.widthMode === "fill" ? "100%" : `${s}%`,
				maxWidth: l ? n.maxWidthToken ? `var(${n.maxWidthToken})` : `${Ie(n.maxWidthPct, 10, 100, 80)}%` : void 0,
				height: u && (!o || n.shape !== "circle") ? `${u}px` : void 0,
				aspectRatio: o && (!u || n.shape === "circle") ? Re(t, n) : void 0
			};
			return n.positionMode === "flow" ? {
				...ee,
				position: "relative",
				left: "auto",
				top: "auto",
				transform: void 0,
				width: l ? "fit-content" : "100%",
				maxWidth: n.maxWidthToken ? `var(${n.maxWidthToken})` : n.maxWidthPct ? `${Ie(n.maxWidthPct, 10, 100, 100)}%` : void 0,
				height: "auto",
				aspectRatio: o ? Re(t, n) : void 0,
				justifySelf: n.justifySelf,
				alignSelf: n.alignSelf,
				padding: Number(n.paddingPx) > 0 ? `${Math.min(160, Number(n.paddingPx))}px` : void 0,
				boxSizing: "border-box"
			} : ee;
		}
		function pt(e, t, n = null) {
			return (n ? Be(e, t, n) : pe(e, t)).listType === "number" ? "ol" : "ul";
		}
		function mt(e) {
			return String(e ?? "").split(/\r?\n/u).map((e) => e.trim()).filter(Boolean);
		}
		function ht(e = null) {
			return e?.fieldKey || "$item";
		}
		function gt(e, t, n = null) {
			return (n ? Be(e, t, n) : pe(e, t)).lineStyles?.[ht(n)] || {};
		}
		function _t(e, t, n = null) {
			return Object.keys(gt(e, t, n)).length > 0;
		}
		function vt(e, t, n = null) {
			return _t(e, t, n) || /\r?\n/u.test(String(N(e, t, n) ?? ""));
		}
		function yt(e, t, n = null) {
			let r = n ? Be(e, t, n) : pe(e, t), i = gt(e, t, n), a = 0;
			return String(N(e, t, n) ?? "").split(/\r?\n/u).map((e, t) => {
				let n = {
					...r,
					...i[t] || {}
				};
				return n.listType === "number" ? a += 1 : a = 0, {
					index: t,
					text: e,
					style: n,
					number: a
				};
			});
		}
		function bt(e) {
			let t = e.style || {};
			return {
				color: t.colorToken ? `var(${t.colorToken})` : t.color,
				backgroundColor: t.backgroundColorToken ? `var(${t.backgroundColorToken})` : t.backgroundColor,
				borderRadius: t.borderRadiusToken ? `var(${t.borderRadiusToken})` : t.borderRadius,
				boxShadow: t.boxShadowToken ? `var(${t.boxShadowToken})` : t.boxShadow,
				fontFamily: t.fontFamilyToken ? `var(${t.fontFamilyToken})` : t.fontFamily,
				fontSize: t.fontSizeToken ? `var(${t.fontSizeToken})` : t.fontSize === void 0 ? void 0 : `${t.fontSize}px`,
				fontWeight: t.fontWeightToken ? `var(${t.fontWeightToken})` : t.fontWeight,
				fontStyle: t.fontStyle,
				textDecoration: t.textDecoration,
				textAlign: t.textAlign,
				lineHeight: t.lineHeightToken ? `var(${t.lineHeightToken})` : t.lineHeight,
				letterSpacing: t.letterSpacingToken ? `var(${t.letterSpacingToken})` : t.letterSpacing,
				"--line-text-gradient": t.textGradientToken ? `var(${t.textGradientToken})` : void 0,
				"--line-text-background": t.textBackgroundToken ? `var(${t.textBackgroundToken})` : t.textBackground,
				"--line-list-padding": `${1.35 + Ie(t.listIndent, 0, 6, 0) * 1.5}em`
			};
		}
		function xt(e) {
			return {
				"is-bullet": e.style.listType === "bullet",
				"is-number": e.style.listType === "number",
				"is-number-start": e.style.listType === "number" && e.number === 1,
				"has-line-gradient": !!e.style.textGradientToken
			};
		}
		function St(e, t, n = null) {
			if (!r.editable) return;
			if (n?.type === "click" && n.pointerId === m) {
				m = null;
				return;
			}
			let a = !!(n?.ctrlKey || n?.metaKey || n?.shiftKey), o = fe(e, t), s = n?.fieldKey ? `${o}.${n.fieldKey}` : "", c = r.selectedItemKey === o && r.selectedItemKeys.length <= 1 && r.selectedFieldKey === s;
			!a && c || i("select-item", e, t, {
				additive: a,
				fieldKey: n?.fieldKey || ""
			});
		}
		function Ct(e, t, n, i) {
			r.editable && (e.preventDefault(), St(t, n, {
				type: e.type,
				pointerId: e.pointerId,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				shiftKey: e.shiftKey,
				fieldKey: i.fieldKey
			}));
		}
		function wt(e, t, n) {
			!r.editable || !n?.fieldKey || St(e, t, {
				type: "click",
				fieldKey: n.fieldKey
			});
		}
		function Tt(e) {
			r.editable && e.preventDefault();
		}
		function Et(e) {
			r.editable && e.preventDefault();
		}
		function Dt(e, t, n, a = {}) {
			m = null;
			let o = a.target || e.currentTarget, s = a.fromMoveHandle === !0;
			if (!r.editable || n.isLocked || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest(".item-resize-handle") || !s && e.target.closest("[data-field-style-key]") || !s && o.classList.contains("is-editing")) return;
			let c = o.closest(".rendered-items");
			if (!c) return;
			f?.(), d?.(), m = e.pointerId, St(t, n);
			let l = e.clientX, u = e.clientY, p = null, h = 0, g = 0, _ = 0, v = 0, y = 0, b = !1, x = !1, S = (t) => {
				if (t.pointerId !== e.pointerId || x) return;
				if ((t.buttons & 1) != 1) {
					T();
					return;
				}
				let n = t.clientX - l, r = t.clientY - u;
				if (!b) {
					if (Math.hypot(n, r) < fx) return;
					if (t.cancelable && t.preventDefault(), !o.hasPointerCapture(t.pointerId)) try {
						o.setPointerCapture(t.pointerId);
					} catch {
						T();
						return;
					}
					p = c.getBoundingClientRect();
					let e = o.getBoundingClientRect();
					h = e.left - p.left, g = e.top - p.top, _ = h, v = g, o.style.transform = "none", o.style.left = `${h}px`, o.style.top = `${g}px`, o.classList.add("is-dragging"), ee("component-drag"), b = !0;
				}
				let i = p.width - o.offsetWidth, a = By - o.offsetHeight - dx, s = Math.min(0, i), d = Math.max(0, i), f = Math.min(0, a), m = Math.max(0, a);
				_ = Math.min(d, Math.max(s, h + n)), v = Math.min(m, Math.max(f, g + r)), !y && (y = requestAnimationFrame(() => {
					y = 0, o.style.left = `${_}px`, o.style.top = `${v}px`;
				}));
			}, w = () => {
				document.visibilityState === "hidden" && T();
			}, T = () => {
				if (!x) {
					if (x = !0, y && cancelAnimationFrame(y), b && p) {
						let e = p.width ? _ / p.width * 100 : 0;
						i("update-renderer-item-style", t, n, {
							positionMode: "free",
							xPct: e,
							yPx: v
						});
						let r = Math.min(By, Math.ceil(v + o.offsetHeight + dx * 2));
						r > Number(_e(t).minHeight || tt(t)) && i("update-section-style", t.sectionKey, { minHeight: r });
					}
					if (o.hasPointerCapture(e.pointerId)) try {
						o.releasePointerCapture(e.pointerId);
					} catch {}
					o.classList.remove("is-dragging"), b && (o.style.removeProperty("transform"), o.style.removeProperty("left"), o.style.removeProperty("top")), globalThis.removeEventListener("pointermove", S), globalThis.removeEventListener("pointerup", T), globalThis.removeEventListener("pointercancel", T), globalThis.removeEventListener("blur", T), document.removeEventListener("visibilitychange", w), o.removeEventListener("lostpointercapture", T), d === T && (d = null), b && C("component-drag");
				}
			};
			d = T, globalThis.addEventListener("pointermove", S, { passive: !1 }), globalThis.addEventListener("pointerup", T), globalThis.addEventListener("pointercancel", T), globalThis.addEventListener("blur", T), document.addEventListener("visibilitychange", w), o.addEventListener("lostpointercapture", T);
		}
		function Ot(e, t, n) {
			let r = e.currentTarget.closest(".rendered-item");
			r && (e.preventDefault(), e.stopPropagation(), r.querySelector("[contenteditable=\"true\"]")?.blur(), Dt(e, t, n, {
				target: r,
				fromMoveHandle: !0
			}));
		}
		function kt(e, t, n) {
			r.editable && (e.preventDefault(), e.stopPropagation(), i("open-item-inspector", t, n));
		}
		function At(e, t, n) {
			let r = {
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				ArrowUp: [0, -1],
				ArrowDown: [0, 1]
			};
			if (!r[e.key] || n.isLocked) return;
			e.preventDefault(), e.stopPropagation();
			let a = e.currentTarget.closest(".rendered-item"), o = a?.closest(".rendered-items");
			if (!a || !o) return;
			a.querySelector("[contenteditable=\"true\"]")?.blur();
			let s = o.getBoundingClientRect(), c = a.getBoundingClientRect(), l = e.shiftKey ? 10 : 1, [u, d] = r[e.key], f = Math.min(Math.max(0, s.width - c.width), Math.max(0, c.left - s.left + u * l)), p = Math.min(Math.max(0, By - c.height - dx), Math.max(0, c.top - s.top + d * l));
			i("update-renderer-item-style", t, n, {
				positionMode: "free",
				xPct: s.width ? f / s.width * 100 : 0,
				yPx: p
			});
			let m = Math.min(By, Math.ceil(p + c.height + dx * 2));
			m > Number(_e(t).minHeight || tt(t)) && i("update-section-style", t.sectionKey, { minHeight: m });
		}
		function jt(e, t, n, a = "se") {
			if (!r.editable || n.isLocked || e.button !== 0) return;
			d?.(), f?.();
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c || s.classList.contains("is-editing")) return;
			e.preventDefault(), e.stopPropagation(), St(t, n);
			try {
				o.setPointerCapture(e.pointerId);
			} catch {
				return;
			}
			s.classList.add("is-resizing"), ee("component-resize");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), p = e.clientX, m = e.clientY, h = pe(t, n), g = n.fieldKind === "image", _ = qy(n, h), v = h.positionMode === "anchored", y = g && h.aspectRatioLocked !== !1, b = Math.max(24, l.width * (4 / 100)), x = a.includes("w") || a.includes("e"), S = a.includes("n") || a.includes("s"), w = rt(t, n), T = Math.max(50, (_e(t).minHeight || tt(t)) - dx), E = Yy({
				item: n,
				style: h,
				canvasWidth: l.width,
				fallbackX: w.xPct || 0,
				fallbackY: (w.yPct || 0) / 100 * T
			});
			E.x = u.left - l.left, E.y = u.top - l.top, E.width = u.width, E.height = u.height, v && (s.style.transform = "none", s.style.left = `${E.x}px`, s.style.top = `${E.y}px`);
			let D = E.height ? E.width / E.height : 1, O = { ...E }, k = 0, te = !1, ne = !1, A = (t) => {
				if (ne || t.pointerId !== e.pointerId) return;
				if ((t.buttons & 1) != 1) {
					ie(te);
					return;
				}
				let n = t.clientX - p, r = t.clientY - m;
				if (!te && Math.hypot(n, r) < .5) return;
				te = !0, t.cancelable && t.preventDefault();
				let i = Math.max(b, a.includes("w") ? E.width + E.x : l.width - E.x), o = Math.max(24, a.includes("n") ? E.height + E.y : l.height - E.y), c = a.includes("n") ? Math.min(900, o) : 900;
				O = Qy({
					geometry: E,
					deltaX: n,
					deltaY: r,
					direction: a,
					minimumWidth: b,
					minimumHeight: 24,
					maximumWidth: i,
					maximumHeight: c,
					aspectRatioLocked: y || g && h.shape === "circle",
					aspectRatio: h.shape === "circle" ? 1 : D,
					scaleFont: !1
				}), !k && (k = requestAnimationFrame(() => {
					k = 0, s.style.left = `${O.x}px`, s.style.top = `${O.y}px`, (x || y) && (s.style.width = `${O.width}px`), (S || y) && (s.style.height = `${O.height}px`), g && (s.style.aspectRatio = "auto");
				}));
			}, re = () => {
				document.visibilityState === "hidden" && ie(!1);
			}, ie = (r) => {
				if (!ne) {
					if (ne = !0, k && cancelAnimationFrame(k), r && te) {
						let e = Xy(O, l.width, {
							includeHeight: S && !y && !_ && !(g && h.shape === "circle"),
							includeFontSize: !1
						});
						v && (delete e.positionMode, delete e.xPct, delete e.yPx, Object.assign(e, Pe(h, O, l.width, l.height))), i("update-renderer-item-style", t, n, {
							...e,
							...x && !g ? { widthMode: "fixed" } : {},
							...!S && !y ? { heightPx: h.heightPx } : {},
							...g ? { aspectRatio: `${Math.max(1, Math.round(O.width))}/${Math.max(1, Math.round(O.height))}` } : {}
						}), Fe(n, O, l.width);
					}
					if (o.hasPointerCapture(e.pointerId)) try {
						o.releasePointerCapture(e.pointerId);
					} catch {}
					s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("left"), s.style.removeProperty("top"), s.style.removeProperty("transform"), globalThis.removeEventListener("pointermove", A), globalThis.removeEventListener("pointerup", j), globalThis.removeEventListener("pointercancel", M), globalThis.removeEventListener("blur", ae), document.removeEventListener("visibilitychange", re), o.removeEventListener("lostpointercapture", N), f === oe && (f = null), C("component-resize");
				}
			}, j = (t) => {
				t.pointerId === e.pointerId && ie(!0);
			}, M = (t) => {
				t.pointerId === e.pointerId && ie(!1);
			}, ae = () => ie(!1), N = () => ie(!1), oe = () => ie(!1);
			f = oe, globalThis.addEventListener("pointermove", A, { passive: !1 }), globalThis.addEventListener("pointerup", j), globalThis.addEventListener("pointercancel", M), globalThis.addEventListener("blur", ae), document.addEventListener("visibilitychange", re), o.addEventListener("lostpointercapture", N);
		}
		function Mt(e, t, n, a = "se") {
			if (!r.editable || n.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = pe(t, n), s = n.fieldKind === "image", c = qy(n, o), l = o.positionMode === "anchored", u = s && o.aspectRatioLocked !== !1, d = e.shiftKey ? 4 : 1, f = a.includes("w") || a.includes("e"), p = a.includes("n") || a.includes("s"), m = e.currentTarget, h = m.closest(".rendered-items"), g = m.closest(".rendered-item");
			if (!h || !g) return;
			let _ = h.getBoundingClientRect(), v = g.getBoundingClientRect(), y = Math.max(1, _.width), b = f ? e.key === "ArrowRight" ? y * d / 100 : e.key === "ArrowLeft" ? -y * d / 100 : 0 : 0, x = p ? e.key === "ArrowDown" ? d * 4 : e.key === "ArrowUp" ? d * -4 : 0 : 0;
			if (!b && !x) return;
			let S = rt(t, n), ee = Math.max(50, (_e(t).minHeight || tt(t)) - dx), C = Yy({
				item: n,
				style: o,
				canvasWidth: y,
				fallbackX: S.xPct || 0,
				fallbackY: (S.yPct || 0) / 100 * ee
			});
			C.x = v.left - _.left, C.y = v.top - _.top, C.width = v.width, C.height = v.height;
			let w = Math.max(24, a.includes("n") ? C.height + C.y : _.height - C.y), T = Qy({
				geometry: C,
				deltaX: b,
				deltaY: x,
				direction: a,
				minimumWidth: Math.max(24, 4 / 100 * y),
				minimumHeight: 24,
				maximumWidth: a.includes("w") ? C.width + C.x : y - C.x,
				maximumHeight: a.includes("n") ? Math.min(900, w) : 900,
				aspectRatioLocked: u || s && o.shape === "circle",
				aspectRatio: o.shape === "circle" ? 1 : C.width / C.height,
				scaleFont: !1
			}), E = Xy(T, y, {
				includeHeight: p && !u && !c && !(s && o.shape === "circle"),
				includeFontSize: !1
			});
			l && (delete E.positionMode, delete E.xPct, delete E.yPx, Object.assign(E, Pe(o, T, _.width, _.height))), i("update-renderer-item-style", t, n, {
				...E,
				...f && !s ? { widthMode: "fixed" } : {},
				...!p && !u ? { heightPx: o.heightPx } : {}
			}), Fe(n, T, y);
		}
		function Nt(e, t, n) {
			let r = document.createRange();
			r.selectNodeContents(e);
			try {
				r.setEnd(t, n);
			} catch {
				return 0;
			}
			return r.toString().length;
		}
		function Pt(e) {
			let t = window.getSelection();
			if (!t?.rangeCount || !e.contains(t.anchorNode) || !e.contains(t.focusNode)) return [];
			let n = t.getRangeAt(0), r = [...e.querySelectorAll("[data-text-line-index]")];
			if (r.length) {
				if (t.isCollapsed) {
					let e = t.anchorNode.nodeType === Node.ELEMENT_NODE ? t.anchorNode.closest?.("[data-text-line-index]") : t.anchorNode.parentElement?.closest("[data-text-line-index]");
					return e ? [Number(e.dataset.textLineIndex)] : [];
				}
				return r.filter((e) => n.intersectsNode(e)).map((e) => Number(e.dataset.textLineIndex));
			}
			let i = e.innerText.replace(/\r\n?/gu, "\n"), a = Nt(e, t.anchorNode, t.anchorOffset), o = Nt(e, t.focusNode, t.focusOffset), s = Math.min(a, o), c = Math.max(a, o), l = (e) => i.slice(0, Math.max(0, e)).split("\n").length - 1, u = l(s), d = l(c > s ? c - 1 : c);
			return Array.from({ length: Math.max(1, d - u + 1) }, (e, t) => u + t);
		}
		function Ft(e, t, n, a = null, o = null) {
			if (!r.editable || n.isLocked) return;
			let s = o || e.currentTarget, c = s.closest(".rendered-item");
			if (!c || c.classList.contains("is-editing") || (a || n).isLocked) return;
			e.preventDefault(), e.stopPropagation(), St(t, n);
			let l = N(t, n, a), u = String(l ?? "").replace(/\r\n?/g, "\n"), d = !ue(l), f = de(n, a), p = !1, m = !1;
			ee("text-edit"), c.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", d && (s.textContent = f), s.focus();
			let h = window.getSelection(), g = document.createRange();
			g.selectNodeContents(s), h.removeAllRanges(), h.addRange(g);
			let _ = () => {
				let e = Pt(s);
				i("select-text-lines", t, n, {
					scopeKey: ht(a),
					indexes: e
				});
			};
			_(), document.addEventListener("selectionchange", _);
			let v = () => {
				if (m) return;
				m = !0;
				let e = s.innerText.replace(/\r\n?/g, "\n");
				p ? d ? (s.classList.remove("rendered-text"), s.classList.add("rendered-empty"), s.textContent = f) : s.textContent = u : d && e === f ? (s.classList.remove("rendered-text"), s.classList.add("rendered-empty"), s.textContent = f) : i("update-item-content", t, n, e, a), s.contentEditable = "false", c.classList.remove("is-editing"), s.removeEventListener("blur", v), s.removeEventListener("keydown", y), document.removeEventListener("selectionchange", _), i("select-text-lines", t, n, null), C("text-edit");
			}, y = (e) => {
				e.key === "Escape" && (e.preventDefault(), p = !0, s.blur(), m || v());
			};
			s.addEventListener("blur", v), s.addEventListener("keydown", y);
		}
		function It(e, t, n, r = null) {
			if (St(t, n, r ? {
				type: e.type,
				pointerId: e.pointerId,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				shiftKey: e.shiftKey,
				fieldKey: r.fieldKey
			} : e), e.currentTarget.closest(".rendered-item")?.classList.contains("is-editing")) {
				let a = e.target.closest?.("[data-text-line-index]");
				a && i("select-text-lines", t, n, {
					scopeKey: ht(r),
					indexes: [Number(a.dataset.textLineIndex)]
				});
				return;
			}
		}
		function Lt(e, t, n) {
			if (!r.editable || n.isLocked) return;
			let i = e.currentTarget, a = e.target.closest?.(".rendered-text, .rendered-empty"), o = a && i.contains(a) ? a : i.querySelector(".rendered-text, .rendered-empty");
			if (!o) return;
			let s = o.dataset.fieldKey;
			Ft(e, t, n, s && ne(n).find((e) => e.fieldKey === s) || null, o);
		}
		function Rt(e, t) {
			if (!r.editable || e.button !== 0) return;
			d?.(), f?.();
			let n = e.currentTarget, a = n.closest(".rendered-section");
			if (!a) return;
			let o = a.querySelector(".rendered-items");
			e.preventDefault(), e.stopPropagation(), t.items?.[0] && i("select-item", t, t.items[0]);
			try {
				n.setPointerCapture(e.pointerId);
			} catch {
				return;
			}
			a.classList.add("is-resizing"), ee("section-resize");
			let s = e.clientY, c = a.getBoundingClientRect().height, l = o?.getBoundingClientRect();
			o && l && [...o.querySelectorAll(".rendered-item")].forEach((e) => {
				let n = (t.items || []).find((t) => t.itemKey === e.dataset.itemKey);
				if (!n) return;
				let r = e.getBoundingClientRect().top - l.top;
				e.style.top = `${r}px`, i("update-renderer-item-style", t, n, {
					positionMode: "free",
					yPx: r
				});
			});
			let u = l ? Math.max(0, c - l.height) : dx, p = o ? [...o.querySelectorAll(".rendered-item")].reduce((e, t) => {
				let n = t.getBoundingClientRect();
				return Math.max(e, n.bottom - l.top);
			}, 0) : 0, m = Math.max(50, Math.ceil(p + u)), h = By, g = !1, _ = (n) => {
				if (g || n.pointerId !== e.pointerId) return;
				if ((n.buttons & 1) != 1) {
					y();
					return;
				}
				n.cancelable && n.preventDefault();
				let r = Math.min(h, Math.max(m, c + n.clientY - s));
				i("update-section-style", t.sectionKey, { minHeight: r });
			}, v = () => {
				document.visibilityState === "hidden" && y();
			}, y = () => {
				if (!g) {
					if (g = !0, n.hasPointerCapture(e.pointerId)) try {
						n.releasePointerCapture(e.pointerId);
					} catch {}
					a.classList.remove("is-resizing"), globalThis.removeEventListener("pointermove", _), globalThis.removeEventListener("pointerup", b), globalThis.removeEventListener("pointercancel", b), globalThis.removeEventListener("blur", y), document.removeEventListener("visibilitychange", v), n.removeEventListener("lostpointercapture", y), f === y && (f = null), C("section-resize");
				}
			}, b = (t) => {
				t.pointerId === e.pointerId && y();
			};
			f = y, globalThis.addEventListener("pointermove", _, { passive: !1 }), globalThis.addEventListener("pointerup", b), globalThis.addEventListener("pointercancel", b), globalThis.addEventListener("blur", y), document.addEventListener("visibilitychange", v), n.addEventListener("lostpointercapture", y);
		}
		function zt() {
			if (!o.value) return {
				count: 0,
				itemPatches: {},
				sectionPatches: {},
				viewport: T.value ? "mobile" : "desktop"
			};
			let e = {}, t = {}, n = 0;
			return o.value.querySelectorAll(".rendered-section").forEach((r) => {
				let i = r.dataset.sectionKey, a = r.querySelector(".rendered-items"), o = a?.getBoundingClientRect();
				if (!i || !a || !o?.width) return;
				let s = E.value.find((e) => e.sectionKey === i), c = new Map((s?.items || []).map((e) => [e.itemKey, e])), l = 0, u = [...a.querySelectorAll(".rendered-item[data-style-key]")].flatMap((e, t) => {
					let n = c.get(e.dataset.itemKey), r = e.getBoundingClientRect(), i = globalThis.getComputedStyle?.(e);
					return !n || n.isLocked || i?.display === "none" || i?.visibility === "hidden" || r.width <= 0 || r.height <= 0 ? [] : [{
						key: e.dataset.styleKey,
						item: n,
						order: t,
						left: r.left - o.left,
						top: r.top - o.top,
						width: r.width,
						height: r.height
					}];
				}).sort((e, t) => e.top - t.top || e.order - t.order), d = [];
				u.forEach((t) => {
					let r = Math.max(0, t.top);
					for (let e = 0; e <= d.length; e += 1) {
						let e = d.filter((e) => t.left < e.left + e.width && t.left + t.width > e.left && r < e.top + e.height && r + t.height > e.top);
						if (!e.length) break;
						r = Math.max(...e.map((e) => e.top + e.height)) + 20;
					}
					r - t.top >= .5 && (n += 1, l += 1, e[t.key] = {
						positionMode: "free",
						xPct: Math.max(0, t.left) / o.width * 100,
						yPx: Math.round(r),
						heightMode: "auto",
						heightPx: void 0
					}), d.push({
						...t,
						top: r
					});
				});
				let f = d.reduce((e, t) => Math.max(e, t.top + t.height), 0), p = Math.min(By, Math.ceil(f + dx * 2));
				l > 0 && p > r.getBoundingClientRect().height + .5 && (t[i] = { minHeight: p });
			}), {
				count: n,
				itemPatches: e,
				sectionPatches: t,
				viewport: T.value ? "mobile" : "desktop"
			};
		}
		function Bt() {
			if (!o.value) return {
				count: 0,
				blockingCount: 0,
				warningCount: 0,
				collisionCount: 0,
				placeholderAssetCount: 0,
				clippedItemCount: 0,
				overflowItemCount: 0,
				deadSpaceSectionCount: 0,
				emptySectionCount: 0,
				duplicateCollectionCopyCount: 0,
				genericCopyCount: 0,
				lowContrastTextCount: 0,
				viewport: T.value ? "mobile" : "desktop",
				diagnostics: []
			};
			let e = [], t = 0, n = 0, i = 0, a = 0, s = 0, c = 0, l = 0, u = 0, d = [...o.value.querySelectorAll(".rendered-image__placeholder")], f = Array.isArray(r.assets?.expected) ? r.assets.expected.filter((e) => e?.required !== !1) : null, p = f ? f.filter((e) => e.targetType === "component-field-image") : null, m = p ? new Set(p.map((e) => [
				e.pageSectionInstanceId,
				e.pageComponentInstanceId,
				e.fieldKey
			].map((e) => String(e || "")).join(":"))) : null, h = m ? d.filter((e) => m.has(e.dataset.assetTargetKey || "")).length : d.length, g = f ? f.filter((e) => {
				if (e.targetType !== "section-key-visual") return !1;
				let t = (r.content?.sectionSnapshot || []).find((t) => (t.pageSectionInstanceId || t.sectionKey) === e.pageSectionInstanceId);
				return !t || !I(t);
			}) : [], _ = h + g.length, v = (e) => String(e || "").replace(/\s+/gu, " ").trim().toLocaleLowerCase(), y = /^(?:기본 (?:제목|설명)|프로모션 혜택을 확인하세요\.?|자세히 보기)$/u, b = /* @__PURE__ */ new Map();
			return o.value.querySelectorAll(".rendered-item[data-collection-key]").forEach((e) => {
				let t = e.dataset.collectionKey || "";
				if (!t) return;
				let n = v([...e.querySelectorAll(".rendered-text__content, .rendered-text-line__content")].map((e) => e.textContent).join(" "));
				n && (b.has(t) || b.set(t, []), b.get(t).push({
					payload: n,
					styleKey: e.dataset.styleKey || ""
				}));
			}), b.forEach((t, n) => {
				let r = /* @__PURE__ */ new Map();
				t.forEach((e) => r.set(e.payload, [...r.get(e.payload) || [], e.styleKey])), r.forEach((t, r) => {
					t.length < 2 || r.length < 4 || (c += t.length, e.push({
						code: "DUPLICATE_COLLECTION_COPY",
						collectionKey: n,
						styleKeys: t,
						message: r.slice(0, 160)
					}));
				});
			}), o.value.querySelectorAll(".rendered-text__content, .rendered-text-line__content").forEach((t) => {
				let n = String(t.textContent || "").replace(/\s+/gu, " ").trim();
				y.test(n) && (l += 1, e.push({
					code: "GENERIC_DEFAULT_COPY",
					styleKey: t.closest(".rendered-item")?.dataset.styleKey || "",
					message: n
				}));
				let r = globalThis.getComputedStyle?.(t), i = r?.color?.match(/[\d.]+/g)?.slice(0, 3).map(Number), a = t.parentElement, s = null;
				for (; a && a !== o.value.parentElement;) {
					let e = (globalThis.getComputedStyle?.(a)?.backgroundColor)?.match(/[\d.]+/g)?.map(Number) || [];
					if (e.length >= 3 && (e.length < 4 || e[3] > .95)) {
						s = e.slice(0, 3);
						break;
					}
					a = a.parentElement;
				}
				if (!i || !s) return;
				let c = (e) => e.map((e) => {
					let t = e / 255;
					return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
				}).reduce((e, t, n) => e + t * [
					.2126,
					.7152,
					.0722
				][n], 0), d = c(i), f = c(s), p = (Math.max(d, f) + .05) / (Math.min(d, f) + .05), m = Number.parseFloat(r?.fontSize || "16"), h = Number.parseInt(r?.fontWeight || "400", 10);
				p < (m >= 24 || m >= 18.66 && h >= 700 ? 3 : 4.5) && (u += 1, e.push({
					code: "TEXT_CONTRAST_LOW",
					level: "warning",
					ratio: Number(p.toFixed(2)),
					message: n.slice(0, 120)
				}));
			}), o.value.querySelectorAll(".rendered-section").forEach((r) => {
				let o = r.dataset.sectionKey || "", c = r.querySelector(".rendered-items"), l = c?.getBoundingClientRect();
				if (!c || !l?.width || !l?.height) return;
				let u = [...c.querySelectorAll(".rendered-item[data-style-key]")].flatMap((t, r) => {
					let a = globalThis.getComputedStyle?.(t), s = t.getBoundingClientRect();
					if (a?.display === "none" || a?.visibility === "hidden" || s.width <= 0 || s.height <= 0) return [];
					let c = t.dataset.styleKey || t.dataset.itemKey || String(r);
					return (s.left < l.left - 1 || s.top < l.top - 1 || s.right > l.right + 1 || s.bottom > l.bottom + 1) && (n += 1, e.push({
						code: "ITEM_CLIPPED",
						sectionKey: o,
						styleKey: c
					})), (t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > t.clientHeight + 1) && (i += 1, e.push({
						code: "ITEM_CONTENT_OVERFLOW",
						sectionKey: o,
						styleKey: c,
						clientWidth: t.clientWidth,
						scrollWidth: t.scrollWidth,
						clientHeight: t.clientHeight,
						scrollHeight: t.scrollHeight
					})), [{
						styleKey: c,
						order: r,
						left: s.left,
						top: s.top,
						right: s.right,
						bottom: s.bottom
					}];
				});
				if (!u.length) {
					let t = E.value.find((e) => e.sectionKey === o), n = globalThis.getComputedStyle?.(r)?.backgroundImage || "none";
					!(t?.compositionPolicy?.allowEmpty === !0 || t?.aiDesign?.allowEmpty === !0) && n === "none" && (s += 1, e.push({
						code: "EMPTY_VISIBLE_SECTION",
						sectionKey: o,
						message: `${t?.name || o} 섹션에 표시할 콘텐츠가 없습니다.`
					}));
				}
				for (let n = 0; n < u.length; n += 1) for (let r = n + 1; r < u.length; r += 1) {
					let i = u[n], a = u[r];
					i.left < a.right && i.right > a.left && i.top < a.bottom && i.bottom > a.top && (t += 1, e.push({
						code: "ITEM_COLLISION",
						sectionKey: o,
						styleKey: a.styleKey,
						relatedStyleKey: i.styleKey
					}));
				}
				if (u.length) {
					let t = Math.max(...u.map((e) => e.bottom - l.top)), n = Math.max(0, l.height - t);
					n > Math.max(320, l.height * .5) && (a += 1, e.push({
						code: "SECTION_DEAD_SPACE_EXCESS",
						sectionKey: o,
						emptyHeight: Math.round(n)
					}));
				}
			}), _ && e.push({
				code: "REQUIRED_ASSET_PLACEHOLDER",
				count: _
			}), g.forEach((t) => e.push({
				code: "REQUIRED_SECTION_KEY_VISUAL_MISSING",
				sectionKey: t.pageSectionInstanceId,
				assetRequestId: t.assetRequestId
			})), {
				count: t + _ + n + i + a + s + c + l + u,
				blockingCount: t + _ + n + i + s + c + l,
				warningCount: a + u,
				collisionCount: t,
				placeholderAssetCount: _,
				clippedItemCount: n,
				overflowItemCount: i,
				deadSpaceSectionCount: a,
				emptySectionCount: s,
				duplicateCollectionCopyCount: c,
				genericCopyCount: l,
				lowContrastTextCount: u,
				viewport: T.value ? "mobile" : "desktop",
				diagnostics: e
			};
		}
		return t({
			inspectLayoutCollisions: zt,
			inspectLayoutQuality: Bt
		}), (t, n) => (V(), H("div", {
			ref_key: "rendererRoot",
			ref: o,
			class: g(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-token-usage-policy": !!e.content?.runtimeTheme?.designTokens?.usagePolicy,
				"has-editor-guides": e.editable && e.showGuides,
				"is-outline-mode": e.editable && e.outlineMode
			}]),
			style: p({
				...e.editable ? {
					"--promo-font": k.value.theme.fontFamilyToken ? `var(${k.value.theme.fontFamilyToken})` : k.value.theme.fontFamily,
					"--promo-width": `${Math.min(1280, Number(k.value.responsive.contentMaxWidth || 1280))}px`,
					"--promo-min-width": `${k.value.responsive.contentMinWidth || 0}px`
				} : {},
				...Object.fromEntries(Object.entries(te.value).filter(([t]) => e.editable || !t.startsWith("--app-")))
			})
		}, [
			e.editable && e.showGuides ? (V(), H("div", Cb)) : G("", !0),
			e.editable ? (V(), H("p", wb, L(b.value), 1)) : G("", !0),
			(V(!0), H(K, null, B(E.value, (t) => (V(), H("section", {
				key: t.sectionKey,
				class: g(["rendered-section", [
					`rendered-section--${t.sectionKey}`,
					Se("section", t.sectionKey),
					{
						"is-outline-section": e.editable && e.outlineMode,
						"is-flow-layout": ve(t)
					}
				]]),
				"data-section-key": t.sectionKey,
				"data-section-role": t.sectionRole || null,
				"data-motion-target": be("section", t.sectionKey)?.trigger === "viewport-enter" ? `section:${t.sectionKey}` : null,
				style: p({
					...ut(t),
					...Ce("section", t.sectionKey)
				}),
				"aria-busy": Ae(t)?.kind === "processing" ? "true" : void 0
			}, [
				e.editable && Ae(t) ? (V(), H("div", {
					key: 0,
					class: g(["section-ai-state", `is-${Ae(t).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: Ae(t).detail || void 0
				}, [Ae(t).kind === "processing" ? (V(), H("i", Db)) : G("", !0), U("span", null, L(Ae(t).label), 1)], 10, Eb)) : G("", !0),
				U("div", Ob, [U("div", {
					class: g(["rendered-items", { "is-flow-layout": ve(t) }]),
					style: p(dt(t))
				}, [(V(!0), H(K, null, B(F(t), (r, i) => (V(), H("article", {
					key: r.itemKey,
					class: g(["rendered-item", [
						`rendered-item--${r.fieldKind || "text"}`,
						Te(t, r, i),
						{
							"is-editable": e.editable && !r.isLocked,
							"is-selected": e.editable && (e.selectedItemKey === fe(t, r) || e.selectedItemKeys.includes(fe(t, r))),
							"has-selected-field": e.editable && e.selectedFieldKey.startsWith(`${fe(t, r)}.`),
							"is-hidden-in-output": e.editable && !j(t, r),
							"is-locked": e.editable && r.isLocked,
							"is-empty": e.editable && ce(t, r),
							"is-free-positioned": pe(t, r).positionMode === "free",
							"is-anchored-positioned": pe(t, r).positionMode === "anchored",
							"is-flow-positioned": pe(t, r).positionMode === "flow",
							"is-fixed-height": r.fieldKind === "text" && !Zt(qy)(r, pe(t, r)),
							"has-text-gradient": !!pe(t, r).textGradientToken,
							"has-text-background": !!(pe(t, r).textBackgroundToken || pe(t, r).textBackground)
						}
					]]),
					"data-item-key": r.itemKey,
					"data-style-key": fe(t, r),
					"data-collection-key": r.collection?.collectionKey || null,
					"data-collection-index": r.collection?.index ?? null,
					"data-auto-height-measure": "true",
					"data-motion-target": we(t, r, i)?.trigger === "viewport-enter" ? `item:${fe(t, r)}` : null,
					style: p({
						...ft(t, r),
						...Ee(t, r, i)
					}),
					onClick: Lu((e) => St(t, r, e), ["stop"]),
					onDblclickCapture: (e) => Lt(e, t, r),
					onPointerdown: (e) => Dt(e, t, r)
				}, [
					e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === fe(t, r) ? (V(), H("button", {
						key: 0,
						type: "button",
						class: "component-action-handle component-move-handle",
						"aria-label": `${r.name || r.itemKey} 이동`,
						title: `${r.name || r.itemKey} 이동 (Shift + 방향키: 10px)`,
						onPointerdown: (e) => Ot(e, t, r),
						onKeydown: (e) => At(e, t, r)
					}, null, 40, Ab)) : G("", !0),
					e.editable && e.showGuides && e.selectedItemKey === fe(t, r) ? (V(), H("button", {
						key: 1,
						type: "button",
						class: "component-action-handle component-properties-handle",
						"aria-label": `${r.name || r.itemKey} 속성`,
						title: `${r.name || r.itemKey} 속성 열기`,
						onPointerdown: n[0] ||= Lu(() => {}, ["stop"]),
						onClick: (e) => kt(e, t, r)
					}, null, 40, jb)) : G("", !0),
					e.editable && !j(t, r) ? (V(), H("span", Mb, "비노출")) : G("", !0),
					e.editable && e.outlineMode ? (V(), H("span", Nb, [
						W(L(r.name || r.itemKey) + " ", 1),
						U("small", null, L(r.fieldKind || "text"), 1),
						r.isLocked ? (V(), H("em", Pb, "잠금")) : G("", !0),
						ce(t, r) ? (V(), H("em", Fb, "비어 있음")) : G("", !0)
					])) : G("", !0),
					A(r) ? (V(), Ja(Sb, {
						key: 4,
						"render-spec": A(r),
						"registered-only": O.value,
						fields: ne(r),
						value: N(t, r),
						viewport: e.viewportOverride,
						"viewport-width": a.value,
						"mobile-breakpoint": O.value ? parseFloat(D.value["--breakpoint-tablet-min"]) : Number(k.value.responsive?.mobileBreakpoint || 720),
						"tablet-breakpoint": O.value ? parseFloat(D.value["--breakpoint-desktop-min"]) : 1024,
						editable: e.editable,
						onSelectField: (e) => wt(t, r, e)
					}, null, 8, [
						"render-spec",
						"registered-only",
						"fields",
						"value",
						"viewport",
						"viewport-width",
						"mobile-breakpoint",
						"tablet-breakpoint",
						"editable",
						"onSelectField"
					])) : ne(r).length > 1 ? (V(), H("div", {
						key: 5,
						class: "rendered-component-fields",
						style: p({
							"--component-field-gap": `${Math.min(240, Math.max(0, Number(pe(t, r).fieldGapPx) || 14))}px`,
							"--component-content-padding": `${Math.min(240, Math.max(0, Number(pe(t, r).contentPaddingPx) || 0))}px`
						})
					}, [(V(!0), H(K, null, B(ae(t, r), (i) => (V(), H("div", {
						key: i.fieldKey,
						class: g(["rendered-component-field-shell", {
							"is-hidden-in-output": e.editable && !M(t, r, i),
							"is-selected-field": e.editable && We(t, r, i),
							"is-locked-field": e.editable && i.isLocked
						}]),
						style: p(He(t, r, i)),
						"data-field-key": i.fieldKey,
						"data-field-kind": i.fieldKind,
						"data-field-style-key": Ue(t, r, i),
						"aria-selected": e.editable ? String(We(t, r, i)) : void 0,
						tabindex: e.editable && We(t, r, i) ? 0 : -1,
						onClick: Lu((e) => Ct(e, t, r, i), ["stop"])
					}, [
						i.fieldKind === "cta" ? (V(), H("a", {
							key: 0,
							class: "rendered-cta rendered-component-field",
							style: p(Ve(t, r, i)),
							href: le(N(t, r, i)),
							target: N(t, r, i)?.target || "_self",
							rel: N(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0,
							draggable: !e.editable && void 0,
							onClick: Lu((e) => Ct(e, t, r, i), ["stop"]),
							onDragstart: Et
						}, L(N(t, r, i)?.label || i.name), 45, Lb)) : i.fieldKind === "image" ? (V(), H(K, { key: 1 }, [U("div", {
							class: "rendered-image-frame rendered-component-image-frame rendered-component-field",
							style: p(Xe(t, r, i)),
							role: Ze(t, r, i).role,
							"aria-label": Ze(t, r, i).label,
							"aria-hidden": Ze(t, r, i).ariaHidden,
							"aria-busy": Ae(t, r, i)?.kind === "processing" ? "true" : void 0
						}, [oe(N(t, r, i)) ? G("", !0) : (V(), H("div", {
							key: 0,
							class: "rendered-image__placeholder",
							"data-asset-target-key": `${t.sectionKey}:${r.itemKey}:${i.fieldKey}`
						}, [U("span", null, L(i.name), 1), n[2] ||= U("small", null, "이미지 준비 중", -1)], 8, zb))], 12, Rb), e.editable && Ae(t, r, i) ? (V(), H("div", {
							key: 0,
							class: g(["item-ai-state", `is-${Ae(t, r, i).kind}`]),
							role: "status",
							"aria-live": "polite"
						}, [Ae(t, r, i).kind === "processing" ? (V(), H("i", Bb)) : G("", !0), U("span", null, L(Ae(t, r, i).label), 1)], 2)) : G("", !0)], 64)) : ue(N(t, r, i)) && vt(t, r, i) ? (V(), H("div", {
							key: 2,
							class: g(["rendered-text rendered-text--lines rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: p(Ve(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: Lu((e) => It(e, t, r, i), ["stop"]),
							onDblclick: Lu((e) => Ft(e, t, r, i), ["stop"])
						}, [(V(!0), H(K, null, B(yt(t, r, i), (e) => (V(), H("div", {
							key: `${i.fieldKey}-line-${e.index}`,
							class: g(["rendered-text-line", xt(e)]),
							style: p(bt(e)),
							"data-text-line-index": e.index
						}, [U("span", Ub, L(e.text), 1)], 14, Hb))), 128))], 46, Vb)) : ue(N(t, r, i)) && Be(t, r, i).listType ? (V(), Ja(wi(pt(t, r, i)), {
							key: 3,
							class: g(["rendered-text rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: p(Ve(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: Lu((e) => It(e, t, r, i), ["stop"]),
							onDblclick: Lu((e) => Ft(e, t, r, i), ["stop"])
						}, {
							default: Dr(() => [(V(!0), H(K, null, B(mt(N(t, r, i)), (e, t) => (V(), H("li", { key: `${i.fieldKey}-${t}` }, [U("span", Wb, L(e), 1)]))), 128))]),
							_: 2
						}, 1064, [
							"class",
							"style",
							"data-field-key",
							"onClick",
							"onDblclick"
						])) : ue(N(t, r, i)) ? (V(), H("p", {
							key: 4,
							class: g(["rendered-text rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: p(Ve(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: Lu((e) => It(e, t, r, i), ["stop"]),
							onDblclick: Lu((e) => Ft(e, t, r, i), ["stop"])
						}, [U("span", Kb, L(N(t, r, i)), 1)], 46, Gb)) : (V(), H("p", {
							key: 5,
							class: "rendered-empty rendered-component-field",
							"data-field-key": i.fieldKey,
							onClick: Lu((e) => It(e, t, r, i), ["stop"]),
							onDblclick: Lu((e) => Ft(e, t, r, i), ["stop"])
						}, L(de(r, i)), 41, qb)),
						e.editable && e.showGuides && We(t, r, i) ? (V(), H("button", {
							key: 6,
							type: "button",
							class: "component-action-handle component-field-properties-handle",
							"aria-label": `${i.name || i.fieldKey} 속성 열기`,
							title: `${i.name || i.fieldKey} 속성 열기`,
							onPointerdown: n[1] ||= Lu(() => {}, ["stop"]),
							onClick: (e) => Ge(e, t, r, i)
						}, null, 40, Jb)) : G("", !0),
						e.editable && e.showGuides && We(t, r, i) && !r.isLocked && !i.isLocked ? (V(!0), H(K, { key: 7 }, B(Ke(i), (e) => (V(), H("button", {
							key: e,
							type: "button",
							class: g(["item-resize-handle component-field-resize-handle", `item-resize-handle--${e}`]),
							"aria-label": qe(i, e),
							onPointerdown: Lu((n) => Je(n, t, r, i, e), ["stop"]),
							onKeydown: (n) => Ye(n, t, r, i, e)
						}, null, 42, Yb))), 128)) : G("", !0)
					], 14, Ib))), 128))], 4)) : r.fieldKind === "cta" ? (V(), H("a", {
						key: 6,
						class: "rendered-cta",
						href: le(N(t, r)),
						target: N(t, r)?.target || "_self",
						rel: N(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0,
						draggable: !e.editable && void 0,
						onClick: Tt,
						onDragstart: Et
					}, L(N(t, r)?.label || r.name), 41, Xb)) : r.fieldKind === "image" ? (V(), H(K, { key: 7 }, [
						U("div", {
							class: g(["rendered-image-frame", `rendered-image-frame--${pe(t, r).shape || "square"}`]),
							style: p(ze(t, r)),
							role: Qe(t, r).role,
							"aria-label": Qe(t, r).label,
							"aria-hidden": Qe(t, r).ariaHidden,
							"aria-busy": Ae(t, r)?.kind === "processing" ? "true" : void 0
						}, [oe(N(t, r)) ? G("", !0) : (V(), H("div", {
							key: 0,
							class: "rendered-image__placeholder",
							"data-asset-target-key": `${t.sectionKey}:${r.itemKey}:`
						}, [U("span", null, L(r.name), 1), U("small", null, L(N(t, r)?.value || "이미지 준비 중"), 1)], 8, Qb))], 14, Zb),
						e.editable && Ae(t, r) ? (V(), H("div", {
							key: 0,
							class: g(["item-ai-state", `is-${Ae(t, r).kind}`]),
							role: "status",
							"aria-live": "polite",
							title: Ae(t, r).detail || void 0
						}, [Ae(t, r).kind === "processing" ? (V(), H("i", ex)) : G("", !0), U("span", null, L(Ae(t, r).label), 1)], 10, $b)) : G("", !0),
						e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === fe(t, r) ? (V(!0), H(K, { key: 1 }, B(je(t, r), (e) => (V(), H("button", {
							key: e,
							type: "button",
							class: g(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
							"aria-label": Ne(r, e),
							onPointerdown: Lu((n) => jt(n, t, r, e), ["stop"]),
							onKeydown: (n) => Mt(n, t, r, e)
						}, null, 42, tx))), 128)) : G("", !0)
					], 64)) : (V(), H(K, { key: 8 }, [ue(N(t, r)) && vt(t, r) ? (V(), H("div", {
						key: 0,
						class: g(["rendered-text rendered-text--lines", { "rendered-text--title": r.textType === "title" }]),
						onClick: Lu((e) => It(e, t, r), ["stop"]),
						onDblclick: Lu((e) => Ft(e, t, r), ["stop"])
					}, [(V(!0), H(K, null, B(yt(t, r), (e) => (V(), H("div", {
						key: `${r.itemKey}-line-${e.index}`,
						class: g(["rendered-text-line", xt(e)]),
						style: p(bt(e)),
						"data-text-line-index": e.index
					}, [U("span", ix, L(e.text), 1)], 14, rx))), 128))], 42, nx)) : ue(N(t, r)) && pe(t, r).listType ? (V(), Ja(wi(pt(t, r)), {
						key: 1,
						class: g(["rendered-text", { "rendered-text--title": r.textType === "title" }]),
						onClick: Lu((e) => It(e, t, r), ["stop"]),
						onDblclick: Lu((e) => Ft(e, t, r), ["stop"])
					}, {
						default: Dr(() => [(V(!0), H(K, null, B(mt(N(t, r)), (e, t) => (V(), H("li", { key: `${r.itemKey}-${t}` }, [U("span", ax, L(e), 1)]))), 128))]),
						_: 2
					}, 1064, [
						"class",
						"onClick",
						"onDblclick"
					])) : ue(N(t, r)) ? (V(), H("p", {
						key: 2,
						class: g(["rendered-text", { "rendered-text--title": r.textType === "title" }]),
						onClick: Lu((e) => It(e, t, r), ["stop"]),
						onDblclick: Lu((e) => Ft(e, t, r), ["stop"])
					}, [U("span", sx, L(N(t, r)), 1)], 42, ox)) : (V(), H("p", {
						key: 3,
						class: "rendered-empty",
						onClick: Lu((e) => It(e, t, r), ["stop"]),
						onDblclick: Lu((e) => Ft(e, t, r), ["stop"])
					}, L(de(r)), 41, cx))], 64)),
					e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === fe(t, r) ? (V(!0), H(K, { key: 9 }, B(je(t, r), (e) => (V(), H("button", {
						key: e,
						type: "button",
						class: g(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
						"aria-label": Ne(r, e),
						onPointerdown: Lu((n) => jt(n, t, r, e), ["stop"]),
						onKeydown: (n) => Mt(n, t, r, e)
					}, null, 42, lx))), 128)) : G("", !0)
				], 46, kb))), 128))], 6)]),
				e.editable && e.showGuides ? (V(), H("button", {
					key: 1,
					class: "section-resize-handle",
					type: "button",
					"aria-label": `${t.name} 섹션 높이 조절`,
					title: `${t.name} 섹션 높이 조절`,
					onPointerdown: (e) => Rt(e, t)
				}, null, 40, ux)) : G("", !0)
			], 14, Tb))), 128))
		], 6));
	}
}, mx = [
	"desktop",
	"tablet",
	"mobile"
];
function hx(e) {
	let t = String(e || "");
	if (!t || /[\s\\\u0000-\u001f\u007f]/u.test(t) || t.startsWith("//")) return "";
	if (/^(?:\/(?!\/)|#)/u.test(t)) return t;
	try {
		let e = new URL(t), n = e.hostname.toLowerCase();
		return e.protocol === "https:" && !e.username && !e.password && n !== "localhost" && !n.endsWith(".local") && !n.includes(":") && !/^(127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(n) ? t : "";
	} catch {
		return "";
	}
}
function gx(e) {
	let t = [], n = [e?.root];
	for (; n.length && t.length < 201;) {
		let e = n.pop();
		e && (t.push(e), Array.isArray(e.children) && n.push(...[...e.children].reverse()));
	}
	return t;
}
function _x(e, t) {
	let n = e.layout.desktop, r = e.layout[t], i = {
		...n,
		...Object.fromEntries(Object.entries(r || {}).filter(([, e]) => e !== null))
	};
	return t === "mobile" && !r && (e.type === "grid" && (i.columns = [1]), e.type === "stack" && (i.direction = "column"), i.columnSpan = 1), t === "tablet" && !r && e.type === "grid" && i.columns.length > 2 && (i.columns = [1, 1]), i;
}
function vx(e) {
	return e.type === "container" ? e.role === "group" ? ["layout"] : ["page", "layout"] : {
		grid: ["layout"],
		stack: ["layout"],
		card: ["card", "layout"],
		text: ["text"],
		button: ["button", "layout"],
		input: ["input", "layout"],
		image: ["image", "layout"],
		divider: ["divider", "layout"],
		icon: ["icon", "layout"],
		video: ["video", "layout"]
	}[e.type] || [];
}
function yx(e, t, n, r = bg(n)) {
	return Sg(e, t, n, vx(e), r);
}
function bx(e) {
	return Object.fromEntries(Object.entries(e.tokenValues || {}).filter(([t, n]) => (e.tokenCatalog || []).some((e) => (e.name || e.tokenKey) === t && e.state !== "draft" && e.state !== "incomplete") && /^--[a-zA-Z][a-zA-Z0-9-]*$/.test(t) && !t.startsWith("--app-") && typeof n == "string" && !/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(n)));
}
function xx(e, t) {
	return e.contentMode === "source" ? String(t.contentSources?.[e.sourceIds?.[0]]?.text || "") : String(e.text || "");
}
function Sx(e, t) {
	let n = e.map((n) => t * n / e.reduce((e, t) => e + t, 0)), r = n.map((e) => Math.max(1, Math.floor(e))), i = t - r.reduce((e, t) => e + t, 0);
	for (; i !== 0;) {
		let e = r.map((e, t) => t).filter((e) => i > 0 || r[e] > 1);
		if (!e.length) break;
		e.sort((e, t) => i > 0 ? n[t] - r[t] - (n[e] - r[e]) : r[t] - n[t] - (r[e] - n[e])), r[e[0]] += i > 0 ? 1 : -1, i += i > 0 ? -1 : 1;
	}
	return r;
}
function Cx(e, t, n) {
	if (!/^ps-[a-zA-Z0-9_-]+$/.test(n)) return "";
	let r = Ay(t);
	if (!r.ok) return "";
	let i = bg(t), a = {
		desktop: [],
		desktopWide: [],
		tablet: [],
		mobile: []
	};
	for (let o of gx(e)) if (/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(o.id || "")) for (let s of [
		"desktop",
		"desktopWide",
		"tablet",
		"mobile"
	]) {
		let c = _x(o, s === "desktopWide" ? "desktop" : s), l = `[data-ps-scope="${n}"] [data-ps-node="${o.id}"]`, u = {
			"align-items": {
				start: "flex-start",
				end: "flex-end",
				center: "center",
				stretch: "stretch"
			}[c.align],
			"justify-content": {
				start: "flex-start",
				end: "flex-end",
				center: "center",
				"space-between": "space-between"
			}[c.justify],
			width: c.width === "fill" ? "100%" : c.width === "fit-content" ? "fit-content" : "auto",
			"grid-column": `span ${Math.max(1, Math.min(12, Number(c.columnSpan) || 1))}`
		};
		[
			"container",
			"stack",
			"card"
		].includes(o.type) && (u.display = "flex", u["flex-direction"] = c.direction === "row" ? "row" : "column", u["flex-wrap"] = "wrap"), o.type === "divider" && (t.styleChoicesVersion === 1 ? u["border-style"] = "none" : u[o.direction === "vertical" ? "border-left-style" : "border-top-style"] = "solid"), o.type === "grid" && (u.display = "grid", u["grid-template-columns"] = `repeat(var(${r.profiles[s].columns}),minmax(0,1fr))`);
		let d = {
			...o.styles.spacing?.base || {},
			...["desktop", "desktopWide"].includes(s) ? {} : Object.fromEntries(Object.entries(o.styles.spacing?.[s] || {}).filter(([, e]) => e !== null))
		};
		for (let [e, t] of Object.entries(d)) t && r.spacing.includes(t) && (u[e] = `var(${t})`);
		o.type === "grid" && !d.gap && !o.styles.base.some((e) => e === "layout.gap") && (u["column-gap"] = `var(${r.profiles[s].gutter})`), o === e.root && (u["padding-inline"] = `var(${r.profiles[s].margin})`);
		let f = Object.entries(u).filter(([, e]) => e).map(([e, t]) => `${e}:${t}`).join(";"), p = {
			default: [],
			hover: [],
			pressed: [],
			disabled: []
		};
		for (let e of yx(o, s, t, i)) d[e.property] || p[e.state]?.push(`${o.type === "divider" && /^border-(color|width|style)$/.test(e.property) ? e.property.replace("border-", o.direction === "vertical" ? "border-left-" : "border-top-") : e.property}:var(${e.token})`);
		if (a[s].push(`${l}{${f};${p.default.join(";")}${o === e.root ? `;padding-inline:var(${r.profiles[s].margin})` : ""}}`), o.type === "grid") {
			let e = c.columns?.length ? c.columns : [1], n = Sx(e, Number(t.tokenValues[r.profiles[s].columns])), i = 0;
			for (let t of o.children) {
				let r = Math.min(e.length, _x(t, s === "desktopWide" ? "desktop" : s).columnSpan);
				i + r > e.length && (i = 0);
				let o = 1 + n.slice(0, i).reduce((e, t) => e + t, 0), c = o + n.slice(i, i + r).reduce((e, t) => e + t, 0);
				a[s].push(`${l}>[data-ps-node="${t.id}"]{grid-column:${o}/${c}}`), i = (i + r) % e.length;
			}
		}
		for (let [e, t] of [
			["hover", ":hover"],
			["pressed", ":active"],
			["disabled", ":disabled"]
		]) p[e].length && a[s].push(`${l}${t}{${p[e].join(";")}}`);
	}
	let o = (e) => a[e].join("\n").replaceAll(`[data-ps-scope="${n}"]`, `[data-ps-scope="${n}"][data-ps-viewport="${e}"]`), s = (e) => a[e].join("\n").replaceAll(`[data-ps-scope="${n}"]`, `[data-ps-scope="${n}"]:not([data-ps-viewport])`);
	return `${s("mobile")}\n@media(min-width:${t.tokenValues[r.breakpoints.tablet]}){${s("tablet")}}\n@media(min-width:${t.tokenValues[r.breakpoints.desktop]}){${s("desktop")}}\n@media(min-width:${t.tokenValues[r.breakpoints.wide]}){${s("desktopWide")}}\n${mx.map(o).join("\n")}`;
}
//#endregion
//#region shared/page-schema/quality-colors.mjs
function wx(e) {
	let t = String(e || "").trim();
	if (t === "transparent") return [
		0,
		0,
		0,
		0
	];
	let n = t.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
	if (n) {
		let e = n[1];
		return e.length === 3 && (e = [...e].map((e) => e + e).join("")), [
			0,
			2,
			4
		].map((t) => parseInt(e.slice(t, t + 2), 16)).concat(e.length === 8 ? parseInt(e.slice(6), 16) / 255 : 1);
	}
	let r = t.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
	if (!r) return null;
	let i = r.slice(1, 4).map(Number), a = r[4] === void 0 ? 1 : Number(r[4]);
	return i.every((e) => e >= 0 && e <= 255) && a >= 0 && a <= 1 ? [...i, a] : null;
}
function Tx(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = e[3] + t[3] * (1 - e[3]);
	return n ? [...e.slice(0, 3).map((r, i) => (r * e[3] + t[i] * t[3] * (1 - e[3])) / n), n] : [
		0,
		0,
		0,
		0
	];
}
function Ex(e, t) {
	let n = (e) => e.slice(0, 3).map((e) => {
		let t = e / 255;
		return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
	}).reduce((e, t, n) => e + t * [
		.2126,
		.7152,
		.0722
	][n], 0), r = n(Tx(e, t)), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Dx(e, t, n) {
	let r = String(e || "").match(/^linear-gradient\((.*)\)$/i);
	if (!r) return null;
	let i = r[1].split(/,(?![^()]*\))/).map((e) => e.trim()), a = "to bottom";
	/^(?:to |[-\d.]+deg)/.test(i[0]) && (a = i.shift());
	let o = i.map((e, t) => {
		let n = e.match(/^(.*?)(?:\s+([\d.]+)%)?$/);
		return {
			color: wx(n[1]),
			position: n[2] === void 0 ? t / (i.length - 1) : Number(n[2]) / 100
		};
	});
	if (o.length < 2 || o.some((e) => !e.color)) return null;
	let s = {
		"to top": 0,
		"to right": 90,
		"to bottom": 180,
		"to left": 270,
		"to top right": 45,
		"to right top": 45,
		"to bottom right": 135,
		"to right bottom": 135,
		"to bottom left": 225,
		"to left bottom": 225,
		"to top left": 315,
		"to left top": 315
	}, c = a in s ? s[a] : parseFloat(a);
	if (!Number.isFinite(c)) return null;
	let l = c * Math.PI / 180, u = Math.sin(l), d = -Math.cos(l), f = Math.max(0, Math.min(1, .5 + ((t - .5) * u + (n - .5) * d) / (Math.abs(u) + Math.abs(d))));
	if (f <= o[0].position) return o[0].color;
	for (let e = 1; e < o.length; e++) if (f <= o[e].position) {
		let t = o[e - 1], n = o[e], r = (f - t.position) / (n.position - t.position || 1), i = t.color[3] + (n.color[3] - t.color[3]) * r;
		return [
			0,
			1,
			2
		].map((e) => i ? (t.color[e] * t.color[3] * (1 - r) + n.color[e] * n.color[3] * r) / i : 0).concat(i);
	}
	return o.at(-1).color;
}
//#endregion
//#region visual-editor/src/runtime/page-schema-quality.mjs
function Ox(e, t) {
	return Math.max(0, Math.min(e.right, t.right) - Math.max(e.left, t.left)) * Math.max(0, Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top));
}
function kx(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = (e) => {
		r.set(e.id, e);
		for (let t of e.children || []) i(t);
	};
	i(t.root);
	let a = [...e.querySelectorAll("[data-ps-node]")], o = new Map(a.map((e) => [e.dataset.psNode, e])), s = e.ownerDocument.defaultView;
	for (let t of a) {
		let i = r.get(t.dataset.psNode);
		if (!i || (i.type === "button" && !i.actionId && n.push({
			code: "ACTION_NOT_CONFIGURED",
			level: "warning",
			path: i.id,
			message: "이동 경로가 미정인 CTA는 클릭 동작 없이 문구로 표시합니다."
		}), i.type !== "text" && i.type !== "button")) continue;
		let a = s.getComputedStyle(t), c = t.getBoundingClientRect(), l = wx(a.color), u = parseFloat(a.fontSize);
		if (!l || !c.width || !c.height) continue;
		i.type === "text" && t.textContent.length > 40 && c.width / u < 12 && n.push({
			code: "CONTENT_NARROW",
			level: "blocking",
			path: i.id,
			fontSize: u,
			message: "긴 문구가 지나치게 좁은 컬럼에 배치됐습니다."
		});
		let d = t, f = [], p = null, m = null;
		for (; d && d !== e;) {
			let e = wx(s.getComputedStyle(d).backgroundColor);
			f.push({
				paint: e,
				element: d
			});
			let t = r.get(d.dataset?.psNode)?.children?.find((e) => e.type === "image" && e.presentation === "background");
			if (t) {
				p = t, m = o.get(t.id);
				break;
			}
			if (e?.[3] === 1) break;
			d = d.parentElement;
		}
		let h = [], g = !1;
		if (p && m?.tagName === "IMG" && m.complete && m.naturalWidth) try {
			let t = m.getBoundingClientRect(), n = e.ownerDocument.createElement("canvas");
			n.width = 5, n.height = 5;
			let r = n.getContext("2d", { willReadFrequently: !0 }), i = (p.fit === "contain" ? Math.min : Math.max)(t.width / m.naturalWidth, t.height / m.naturalHeight), a = m.naturalWidth * i, o = m.naturalHeight * i, l = [...d.children].find((e) => e.hasAttribute("data-ps-overlay")), u = l ? s.getComputedStyle(l).backgroundImage : null;
			for (let e = 0; e < 5; e++) for (let n = 0; n < 5; n++) {
				let s = c.left + (n + .5) / 5 * c.width, l = c.top + (e + .5) / 5 * c.height, d = (s - t.left - (t.width - a) / 2) / i, p = (l - t.top - (t.height - o) / 2) / i, _ = f.at(-1)?.paint;
				if (d >= 0 && p >= 0 && d < m.naturalWidth && p < m.naturalHeight) {
					r.clearRect(0, 0, 1, 1), r.drawImage(m, Math.floor(d), Math.floor(p), 1, 1, 0, 0, 1, 1);
					let e = r.getImageData(0, 0, 1, 1).data;
					_ = Tx([
						e[0],
						e[1],
						e[2],
						e[3] / 255
					], _);
				}
				if (u && u !== "none") {
					let e = Dx(u, (s - t.left) / t.width, (l - t.top) / t.height);
					e ? _ = Tx(e, _) : g = !0;
				}
				for (let e of f.slice(0, -1).reverse()) _ = Tx(e.paint, _);
				_?.[3] === 1 && h.push(_);
			}
		} catch {
			g = !0;
		}
		else if (p) g = !0;
		else {
			let e = null;
			for (let t of [...f].reverse()) e = Tx(t.paint, e);
			e?.[3] === 1 ? h = [e] : g = !0;
		}
		let _ = u >= 24 || u >= 18.66 && Number(a.fontWeight) >= 700 ? 3 : 4.5, v = h.length ? Math.min(...h.map((e) => Ex(l, e))) : 0;
		(g || !h.length || v < _) && n.push({
			code: p ? "IMAGE_TEXT_CONTRAST" : "TEXT_CONTRAST",
			level: "blocking",
			path: i.id,
			imageNodeId: p?.id,
			samples: h.map((e) => e.map((e) => Math.round(e * 1e3) / 1e3)),
			threshold: _,
			fontSize: u,
			ratio: Math.round(v * 100) / 100,
			message: p ? "이미지 위 문구의 가독성을 확보하지 못했습니다. 등록 색상 보정 또는 이미지 분리 배치가 필요합니다." : "등록된 글자색과 배경색의 명암 대비가 부족하거나 확인되지 않았습니다."
		});
	}
	for (let e of a) {
		let t = [...e.children].filter((e) => e.hasAttribute("data-ps-node") && r.get(e.dataset.psNode)?.presentation !== "background");
		for (let e = 0; e < t.length; e++) for (let r = e + 1; r < t.length; r++) {
			let i = t[e].getBoundingClientRect(), a = t[r].getBoundingClientRect();
			i.width && i.height && a.width && a.height && Ox(i, a) > 4 && n.push({
				code: "CONTENT_OVERLAP",
				level: "blocking",
				path: t[r].dataset.psNode,
				message: "같은 영역의 콘텐츠가 겹칩니다."
			});
		}
		let i = r.get(e.dataset.psNode)?.children?.find((e) => e.presentation === "background");
		if (i) {
			let e = o.get(i.id)?.getBoundingClientRect();
			if (!e?.width || !e.height) continue;
			t.filter((e) => wx(s.getComputedStyle(e).backgroundColor)?.[3] === 1).map((t) => Ox(e, t.getBoundingClientRect())).reduce((e, t) => e + t, 0) / (e.width * e.height) > .7 && n.push({
				code: "IMAGE_OCCLUDED",
				level: "blocking",
				path: i.id,
				imageNodeId: i.id,
				message: "불투명 콘텐츠가 배경 이미지 대부분을 가립니다. 이미지와 콘텐츠를 분리 배치해야 합니다."
			});
		}
	}
	return n;
}
//#endregion
//#region visual-editor/src/runtime/PageSchemaRenderer.vue
qh();
function Ax(e) {
	let t = `[data-ps-scope="${e}"]`;
	return `${t}{background:#fff!important;color:#333!important}
 ${t} [data-ps-node]{background-color:#fff!important;background-image:none!important;color:#333!important;border-color:#aaa!important;box-shadow:none!important;text-shadow:none!important;animation:none!important;transition:none!important}
 ${t} [data-ps-type="container"],${t} [data-ps-type="card"]{outline:1px dashed #bbb;outline-offset:-1px}
 ${t} [data-ps-type="button"],${t} input{background:#eee!important;outline:1px solid #888;outline-offset:-1px}
 ${t} img,${t} video{object-fit:none!important;object-position:-100000px -100000px!important;background:#eee!important;outline:1px dashed #999;outline-offset:-1px}
 ${t} [data-ps-overlay]{display:none!important}
 ${t} [data-ps-type="image"],${t} [data-ps-type="video"]{background:#eee!important;outline:1px dashed #999;outline-offset:-1px}`;
}
var jx = /* @__PURE__ */ Zr({
	name: "PageSchemaRenderer",
	props: {
		page: {
			type: Object,
			required: !0
		},
		context: {
			type: Object,
			required: !0
		},
		viewportOverride: {
			type: String,
			default: ""
		},
		wireframe: {
			type: Boolean,
			default: !1
		}
	},
	setup(e, { expose: t }) {
		let n = q(() => bg(e.context)), r = /* @__PURE__ */ R(null), i = `ps-${Qr().replace(/[^a-zA-Z0-9_-]/g, "")}`;
		function a() {
			let t = [], i = n.value;
			for (let n of gx(e.page)) {
				if (e.context.styleChoicesVersion === 1) {
					let r = yx(n, e.viewportOverride || "desktop", e.context, i).filter((e) => [
						"border-color",
						"border-width",
						"border-style"
					].includes(e.property));
					r.length && new Set(r.map((e) => e.property)).size !== 3 && t.push({
						code: "STYLE_TOKEN_REQUIRED",
						level: "blocking",
						path: n.id,
						message: "테두리 색상·두께·선 종류를 모두 등록 토큰으로 연결해 주세요."
					});
				}
				n.type === "icon" && !e.context.icons?.[n.iconId] && t.push({
					code: "ICON_ASSET_REQUIRED",
					level: "blocking",
					path: n.id,
					message: "등록된 아이콘 연결이 필요합니다."
				}), n.type === "divider" && e.context.styleChoicesVersion !== 1 && (!e.context.usagePolicy?.bindings?.["divider.color"] || !e.context.usagePolicy?.bindings?.["divider.width"]) && t.push({
					code: "STYLE_TOKEN_REQUIRED",
					level: "blocking",
					path: n.id,
					message: "구분선 색상과 두께를 등록 토큰 정책에 연결해 주세요."
				}), n.type === "image" && (!n.assetId || !hx(e.context.assets?.[n.assetId]?.url)) && t.push({
					code: "IMAGE_GENERATION_PENDING",
					level: "blocking",
					path: n.id,
					message: "이미지 에셋을 연결해 주세요."
				}), n.type === "video" && !hx(e.context.assets?.[n.assetId]?.url) && t.push({
					code: "VIDEO_ASSET_REQUIRED",
					level: "blocking",
					path: n.id,
					message: "동영상을 연결해 주세요."
				}), n.type === "button" && n.actionId && !e.context.actions?.[n.actionId] && t.push({
					code: "ACTION_BINDING_REQUIRED",
					level: "blocking",
					path: n.id,
					message: "버튼에 허용된 이동 경로가 필요합니다."
				}), n.type === "input" && !e.context.formFields?.[n.fieldId] && t.push({
					code: "FORM_BINDING_REQUIRED",
					level: "blocking",
					path: n.id,
					message: "입력 필드 연결이 필요합니다."
				});
			}
			for (let e of r.value?.querySelectorAll("[data-ps-node]") || []) {
				if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && t.push({
					code: "CONTENT_OVERFLOW",
					level: "blocking",
					path: e.dataset.psNode,
					message: "콘텐츠가 사용 가능한 너비를 초과합니다."
				}), e.dataset.psType === "text") {
					let n = getComputedStyle(e), r = parseFloat(n.fontSize), i = parseFloat(n.lineHeight);
					(Number.isFinite(i) && i < r || e.scrollHeight > e.clientHeight + 2) && t.push({
						code: "TEXT_CLIPPING_OR_LINE_HEIGHT",
						level: "blocking",
						path: e.dataset.psNode,
						message: "등록된 글자 크기·줄 높이 또는 잘림을 확인해 주세요."
					});
				}
				e.tagName === "VIDEO" && (e.error || e.readyState === 0) && t.push({
					code: "VIDEO_LOAD_PENDING_OR_FAILED",
					level: "blocking",
					path: e.dataset.psNode,
					message: "동영상 메타데이터 로딩을 확인해 주세요."
				}), e.tagName === "IMG" && (!e.complete || !e.naturalWidth) && t.push({
					code: "IMAGE_LOAD_FAILED",
					level: "blocking",
					path: e.dataset.psNode,
					message: "이미지를 불러오지 못했습니다."
				});
			}
			return r.value && !e.wireframe && t.push(...kx(r.value, e.page)), {
				viewport: e.viewportOverride || "auto",
				count: t.length,
				blockingCount: t.filter((e) => e.level === "blocking").length,
				warningCount: t.filter((e) => e.level === "warning").length,
				diagnostics: t
			};
		}
		t({ inspectLayoutQuality: a });
		function o(t) {
			let r = {
				key: t.id,
				id: t.id,
				"data-ps-node": t.id,
				"data-ps-type": t.type,
				"data-wireframe-node": e.wireframe ? t.id : void 0,
				"data-wireframe-type": e.wireframe ? t.type : void 0
			}, i = () => t.children.map(o);
			if (t.type === "container") {
				let a = {
					page: e.viewportOverride ? "div" : "main",
					section: "section",
					header: "header",
					footer: "footer",
					navigation: "nav",
					form: "form",
					group: "div"
				}[t.role] || "div", o = e.context.actions?.[t.formActionId], s = t.children.some((e) => e.type === "image" && e.presentation === "background"), c = n.value.find((e) => e.key === t.overlayRole), l = c && xg(e.context, c), u = i();
				if (s) for (let e of u) (e.props?.["data-ps-type"] !== "image" || !t.children.find((t) => t.id === e.key && t.presentation === "background")) && (e.props = {
					...e.props,
					style: {
						...e.props?.style,
						position: "relative",
						zIndex: 2
					}
				});
				return l && u.unshift(yo("div", {
					"data-ps-overlay": !0,
					"aria-hidden": "true",
					style: {
						position: "absolute",
						inset: 0,
						zIndex: 1,
						pointerEvents: "none",
						backgroundImage: `var(${l})`
					}
				})), yo(a, {
					...r,
					style: s || l ? {
						position: "relative",
						isolation: "isolate"
					} : void 0,
					"aria-label": t.label || void 0,
					...a === "form" ? {
						action: o?.kind === "submit" ? hx(o.href) : void 0,
						method: "post",
						onSubmit: (t) => {
							(e.wireframe || !o) && t.preventDefault();
						}
					} : {}
				}, u);
			}
			if ([
				"grid",
				"stack",
				"card"
			].includes(t.type)) return yo(t.type === "card" ? "article" : "div", {
				...r,
				"aria-label": t.label || void 0
			}, i());
			if (t.type === "text") return yo(t.role === "heading" ? `h${t.headingLevel}` : t.role === "body" ? "p" : "span", r, xx(t, e.context));
			if (t.type === "button") {
				if (e.wireframe || !t.actionId) return yo("span", {
					...r,
					"data-ps-action-state": t.actionId ? void 0 : "unbound"
				}, t.label);
				let n = e.context.actions?.[t.actionId], i = n?.kind === "navigate" ? hx(n.href) : "", a = n?.kind === "submit" && hx(n.href).startsWith("/");
				return yo(i ? "a" : "button", {
					...r,
					...i ? {
						href: i,
						rel: "noopener noreferrer"
					} : {
						type: a ? "submit" : "button",
						disabled: !a
					}
				}, t.label);
			}
			if (t.type === "image") {
				let n = e.context.assets?.[t.assetId], i = hx(n?.url), a = e.page.mediaRequests.find((e) => e.id === t.requestId), o = t.aspectRatio === "auto" ? n?.displayAspectRatio || a?.aspectRatio || (n?.width && n?.height ? `${n.width}/${n.height}` : void 0) : t.aspectRatio, s = t.presentation === "background" ? {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: t.fit,
					zIndex: 0,
					pointerEvents: "none"
				} : {
					aspectRatio: o?.replace(":", "/"),
					objectFit: t.fit,
					maxWidth: "100%",
					height: "auto"
				};
				return i ? yo("img", {
					...r,
					src: i,
					alt: t.alt,
					loading: "lazy",
					style: s
				}) : yo("div", {
					...r,
					style: s,
					role: "img",
					"aria-label": t.alt || "이미지 생성 대기"
				}, "이미지 생성 대기");
			}
			if (t.type === "input") return yo("label", r, [yo("span", t.label), yo("input", {
				type: t.inputType,
				name: e.context.formFields?.[t.fieldId]?.name,
				placeholder: t.placeholder,
				required: t.required,
				disabled: e.wireframe || !e.context.formFields?.[t.fieldId]
			})]);
			if (t.type === "divider") return yo("hr", {
				...r,
				"aria-orientation": t.direction
			});
			if (t.type === "icon") {
				let n = e.context.icons?.[t.iconId], i = hx(n?.url), a = {
					...r,
					role: t.decorative ? void 0 : "img",
					"aria-label": t.decorative ? void 0 : t.label,
					"aria-hidden": t.decorative ? "true" : void 0
				};
				return i ? yo("img", {
					...a,
					src: i,
					alt: t.decorative ? "" : t.label,
					style: {
						width: "1em",
						height: "1em",
						objectFit: "contain"
					}
				}) : yo("span", a, n?.text || {
					check: "✓",
					arrow: "→",
					star: "★",
					info: "ⓘ"
				}[n?.glyph] || "");
			}
			if (t.type === "video") {
				let n = hx(e.context.assets?.[t.assetId]?.url);
				return n ? yo("video", {
					...r,
					src: n,
					poster: hx(e.context.assets?.[t.posterAssetId]?.url) || void 0,
					controls: !e.wireframe,
					preload: "metadata",
					"aria-label": t.label
				}, t.captionAssetId ? [yo("track", {
					kind: "captions",
					src: hx(e.context.assets?.[t.captionAssetId]?.url),
					srclang: e.context.language || "ko",
					default: !0
				})] : []) : yo("div", r, "동영상 연결 대기");
			}
			return null;
		}
		return () => yo("div", {
			ref: r,
			class: "page-schema-renderer",
			"data-ps-scope": i,
			"data-ps-viewport": [
				"desktop",
				"tablet",
				"mobile"
			].includes(e.viewportOverride) ? e.viewportOverride : void 0,
			style: bx(e.context)
		}, [yo("style", { innerHTML: Cx(e.page, e.context, i) + (e.wireframe ? Ax(i) : "") }), o(e.page.root)]);
	}
}), Mx = "html,body{width:100%;min-width:0;margin:0;padding:0}*{box-sizing:border-box}body,[data-output-boundary]{font-family:var(--render-policy-font);font-size:var(--render-policy-font-size-body);color:var(--render-policy-ink);background-color:var(--render-policy-bg);line-height:normal}h1,h2,h3,h4,h5,h6,p,figure{font:inherit;color:inherit;margin:0}button,input,select,textarea{font:inherit;color:inherit;background:0 0;border:0;border-radius:0;padding:0}a{color:inherit;text-decoration:none}button{cursor:pointer;background:0 0;border:0}hr{border:0;height:auto;margin:0;padding:0}img,video{max-width:100%;height:auto;display:block}.promo-renderer{background-color:var(--render-policy-bg);width:100%;min-width:0;color:var(--render-policy-ink);font-family:var(--render-policy-font);font-size:var(--render-policy-font-size-body);line-height:var(--render-policy-line-height-body);position:relative}.rendered-section{width:100%;min-width:0;position:relative}.rendered-section__inner{width:100%;height:100%;padding-inline:var(--output-grid-margin);margin-inline:auto;position:relative}.rendered-items{width:100%;min-width:0;height:100%;position:relative}.rendered-items.is-flow-layout,.rendered-section.is-flow-layout .rendered-section__inner{height:auto}.rendered-item{min-width:0;max-width:100%;position:absolute}.rendered-item.is-flow-positioned{min-width:0;position:relative}.rendered-component-fields{gap:var(--render-policy-layout-gap);width:100%;min-width:0;padding:var(--render-policy-component-content-padding);display:grid}.rendered-component-field-shell{min-width:0;max-width:100%}.rendered-text,.render-spec-node{overflow-wrap:anywhere;white-space:pre-wrap;min-width:0;max-width:100%;font-size:var(--render-policy-font-size-body);font-weight:var(--render-policy-font-weight-body);line-height:var(--render-policy-line-height-body);margin:0}.rendered-text--title,h1.render-spec-node,h2.render-spec-node,h3.render-spec-node,h4.render-spec-node,h5.render-spec-node,h6.render-spec-node{font-size:var(--render-policy-title-size);font-weight:var(--render-policy-font-weight-title);line-height:var(--render-policy-line-height-title)}.rendered-cta,.render-spec-node--cta{background-color:var(--render-policy-cta-bg);color:var(--render-policy-cta-ink);border-radius:var(--render-policy-cta-radius);padding:var(--render-policy-space-4);font-family:var(--render-policy-button-font);font-size:var(--render-policy-font-size-button);font-weight:var(--render-policy-button-weight);line-height:var(--render-policy-button-line-height);justify-content:center;align-items:center;display:inline-flex}.rendered-cta:hover,.render-spec-node--cta:hover{background-color:var(--render-policy-button-hover-bg)}.rendered-cta:active,.render-spec-node--cta:active{background-color:var(--render-policy-button-pressed-bg)}.rendered-image{max-width:100%;height:auto;display:block}.page-schema-renderer{width:100%;min-width:0}.page-schema-renderer [data-ps-node]{box-sizing:border-box;overflow-wrap:anywhere;min-width:0;max-width:100%;margin:0}.page-schema-renderer :is(h1,h2,h3,h4,h5,h6,p){white-space:pre-wrap;height:auto}.page-schema-renderer :is(img,video){max-width:100%;height:auto;display:block}.page-schema-renderer :is(button,input){font:inherit}.page-schema-renderer [data-ps-type=button]{text-decoration:none}";
//#endregion
//#region node_modules/.pnpm/@vue+server-renderer@3.5.39_vue@3.5.39/node_modules/@vue/server-renderer/dist/server-renderer.esm-bundler.js
function Nx(e, t) {
	let n = "";
	for (let r in e) {
		if (yS(r) || te(r) || t === "textarea" && r === "value" || r.startsWith(".")) continue;
		let i = e[r];
		r.startsWith("^") && (r = r.slice(1)), r === "class" ? n += ` class="${Ix(i)}"` : r === "style" ? n += ` style="${Lx(i)}"` : r === "className" ? i != null && (n += ` class="${x(String(i))}"`) : n += Px(r, i, t);
	}
	return n;
}
function Px(e, t, n) {
	if (!b(t)) return "";
	let r = n && (n.indexOf("-") > 0 || Be(n)) ? e : Je[e] || e.toLowerCase();
	return Ge(r) ? v(t) ? ` ${r}` : "" : y(r) ? t === "" ? ` ${r}` : ` ${r}="${x(t)}"` : (console.warn(`[@vue/server-renderer] Skipped rendering unsafe attribute name: ${r}`), "");
}
function Fx(e, t) {
	return b(t) ? ` ${e}="${x(t)}"` : "";
}
function Ix(e) {
	return x(g(e));
}
function Lx(e) {
	return e ? F(e) ? x(e) : x(h(p(Rx(e)))) : "";
}
function Rx(e) {
	if (!M(e) && I(e)) {
		let t = {};
		for (let n in e) n.startsWith(":--") ? t[n.slice(1)] = T(e[n]) : t[n] = e[n];
		return t;
	}
	return e;
}
function zx(e, t = null, n = null, r = null, i) {
	return $x(vc(e, t, n), r, i);
}
function Bx(e, t, n, r, i, a, o) {
	i("<!--[-->"), Vx(e, t, n, r, i, a, o), i("<!--]-->");
}
function Vx(e, t, n, r, i, a, o, s) {
	let c = e[t];
	if (c) {
		let e = [], t = c(n, (t) => {
			e.push(t);
		}, a, o ? " " + o : "");
		if (M(t)) {
			let e = bS(t);
			e ? nS(i, e, a, o) : r ? r() : s && i("<!---->");
		} else {
			let t = !0;
			if (s) t = !1;
			else for (let n = 0; n < e.length; n++) if (!Hx(e[n])) {
				t = !1;
				break;
			}
			if (t) r && r();
			else {
				let t = 0, n = e.length;
				if (s && e[0] === "<!--[-->" && e[n - 1] === "<!--]-->" && (t++, n--), t < n) for (let r = t; r < n; r++) i(e[r]);
				else s && i("<!---->");
			}
		}
	} else r ? r() : s && i("<!---->");
}
function Hx(e) {
	return typeof e != "string" || !xS.test(e) ? !1 : e.length <= 8 || !e.replace(SS, "").trim();
}
function Ux(e, t, n, r, i) {
	e("<!--teleport start-->");
	let a = i.appContext.provides[zo], o = a.__teleportBuffers ||= {}, s = o[n] || (o[n] = []), c = s.length, l;
	if (r) t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
	else {
		let { getBuffer: e, push: n } = Qx();
		n("<!--teleport start anchor-->"), t(n), n("<!--teleport anchor-->"), l = e();
	}
	s.splice(c, 0, l), (le(l) || M(l) && l.hasAsync) && (s.hasAsync = !0), e("<!--teleport end-->");
}
function Wx(e) {
	return x(L(e));
}
function Gx(e, t) {
	if (M(e) || F(e)) for (let n = 0, r = e.length; n < r; n++) t(e[n], n);
	else if (typeof e == "number") for (let n = 0; n < e; n++) t(n + 1, n);
	else if (I(e)) if (e[Symbol.iterator]) {
		let n = 0;
		for (let r of e) t(r, n++);
	} else {
		let n = Object.keys(e);
		for (let r = 0, i = n.length; r < i; r++) {
			let i = n[r];
			t(e[i], i, r);
		}
	}
}
function Kx(e, { default: t }) {
	t ? t() : e("<!---->");
}
function qx(e, t, n, r, i = {}) {
	return typeof t != "function" && t.getSSRProps && t.getSSRProps({
		dir: t,
		instance: Lc.getComponentPublicInstance(e.$),
		value: n,
		oldValue: void 0,
		arg: r,
		modifiers: i
	}, null) || {};
}
function Jx(e, t) {
	return w(e, t) > -1;
}
function Yx(e, t, n) {
	switch (e) {
		case "radio": return C(t, n) ? " checked" : "";
		case "checkbox": return (M(t) ? Jx(t, n) : t) ? " checked" : "";
		default: return Fx("value", t);
	}
}
function Xx(e = {}, t) {
	let { type: n, value: r } = e;
	switch (n) {
		case "radio": return C(t, r) ? { checked: !0 } : null;
		case "checkbox": return (M(t) ? Jx(t, r) : t) ? { checked: !0 } : null;
		default: return { value: t };
	}
}
function Zx(e, t) {
	throw Error("On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions.");
}
function Qx() {
	let e = !1, t = [];
	return {
		getBuffer() {
			return t;
		},
		push(n) {
			let r = F(n);
			if (e && r) {
				t[t.length - 1] += n;
				return;
			}
			t.push(n), e = r, (le(n) || M(n) && n.hasAsync) && (t.hasAsync = !0);
		}
	};
}
function $x(e, t = null, n) {
	let r = e.component = wS(e, t, null), i = ES(r, !0), a = le(i), o = r.sp;
	return a || o ? Promise.resolve(i).then(() => {
		if (a && (o = r.sp), o) return Promise.all(o.map((e) => e.call(r.proxy)));
	}).catch(O).then(() => eS(r, n)) : eS(r, n);
}
function eS(e, t) {
	let n = e.type, { getBuffer: r, push: i } = Qx();
	if (P(n)) {
		let r = DS(e);
		if (!n.props) for (let t in e.attrs) t.startsWith("data-v-") && ((r.props ||= {})[t] = "");
		tS(i, e.subTree = r, e, t);
	} else {
		(!e.render || e.render === O) && !e.ssrRender && !n.ssrRender && F(n.template) && (n.ssrRender = Zx(n.template));
		let r = e.ssrRender || n.ssrRender;
		if (r) {
			let n = e.inheritAttrs === !1 ? void 0 : e.attrs, a = !1, o = e;
			for (;;) {
				let e = o.vnode.scopeId;
				e && (a ||= (n = { ...n }, !0), n[e] = "");
				let t = o.parent;
				if (t && t.subTree && t.subTree === o.vnode) o = t;
				else break;
			}
			if (t) {
				a || (n = { ...n });
				let e = t.trim().split(" ");
				for (let t = 0; t < e.length; t++) n[e[t]] = "";
			}
			let s = TS(e);
			try {
				r(e.proxy, i, e, n, e.props, e.setupState, e.data, e.ctx);
			} finally {
				TS(s);
			}
		} else e.render && e.render !== O ? tS(i, e.subTree = DS(e), e, t) : (Nc(`Component ${n.name || n.__file || "<Anonymous>"} is missing template or render function.`), i("<!---->"));
	}
	return r();
}
function tS(e, t, n, r) {
	let { type: i, shapeFlag: a, children: o, dirs: s, props: c } = t;
	switch (s && (t.props = iS(t, c, s)), i) {
		case uc:
			e(x(o));
			break;
		case dc:
			e(o ? `<!--${S(o)}-->` : "<!---->");
			break;
		case fc:
			e(o);
			break;
		case K:
			t.slotScopeIds && (r = (r ? r + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), nS(e, o, n, r), e("<!--]-->");
			break;
		default: a & 1 ? rS(e, t, n, r) : a & 6 ? e($x(t, n, r)) : a & 64 ? aS(e, t, n, r) : a & 128 ? tS(e, t.ssContent, n, r) : Nc("[@vue/server-renderer] Invalid VNode type:", i, `(${typeof i})`);
	}
}
function nS(e, t, n, r) {
	for (let i = 0; i < t.length; i++) tS(e, OS(t[i]), n, r);
}
function rS(e, t, n, r) {
	let i = t.type, { props: a, children: o, shapeFlag: s, scopeId: c } = t, l = `<${i}`;
	a && (l += Nx(a, i));
	let u = [], d = (e) => {
		e && (!a || !j(a, e)) && !u.includes(e) && (l += ` ${e}`, u.push(e));
	};
	c && d(c);
	let f = n, p = t;
	for (; f && p === f.subTree;) p = f.vnode, p.scopeId && d(p.scopeId), f = f.parent;
	if (r) {
		let e = r.trim().split(" ");
		for (let t = 0; t < e.length; t++) d(e[t]);
	}
	if (e(l + ">"), !He(i)) {
		let t = !1;
		a && (a.innerHTML ? (t = !0, e(a.innerHTML)) : a.textContent ? (t = !0, e(x(a.textContent))) : i === "textarea" && a.value && (t = !0, e(x(a.value)))), t || (s & 8 ? e(x(o)) : s & 16 && nS(e, o, n, r)), e(`</${i}>`);
	}
}
function iS(e, t, n) {
	let r = [];
	for (let t = 0; t < n.length; t++) {
		let i = n[t], { dir: { getSSRProps: a } } = i;
		if (a) {
			let t = a(i, e);
			t && r.push(t);
		}
	}
	return ao(t || {}, ...r);
}
function aS(e, t, n, r) {
	let i = t.props && t.props.to, a = t.props && t.props.disabled;
	if (!i) return a || Nc("[@vue/server-renderer] Teleport is missing target prop."), [];
	if (!F(i)) return Nc("[@vue/server-renderer] Teleport target must be a query selector string."), [];
	Ux(e, (e) => {
		nS(e, t.children, n, r);
	}, i, a || a === "", n);
}
function oS(e, t, n) {
	if (!e.hasAsync) return t + cS(e);
	let r = t;
	for (let t = n; t < e.length; t += 1) {
		let n = e[t];
		if (F(n)) {
			r += n;
			continue;
		}
		if (le(n)) return n.then((n) => (e[t] = n, oS(e, r, t)));
		let i = oS(n, r, 0);
		if (le(i)) return i.then((n) => (e[t] = n, oS(e, "", t)));
		r = i;
	}
	return r;
}
function sS(e) {
	return oS(e, "", 0);
}
function cS(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		F(r) ? t += r : t += cS(r);
	}
	return t;
}
async function lS(e, t = {}) {
	if (jS(e)) return lS(Gu({ render: () => e }), t);
	let n = vc(e._component, e._props);
	n.appContext = e._context, e.provide(zo, t);
	let r = await sS(await $x(n));
	if (await uS(t), t.__watcherHandles) for (let e of t.__watcherHandles) e();
	return r;
}
async function uS(e) {
	if (e.__teleportBuffers) {
		e.teleports = e.teleports || {};
		for (let t in e.__teleportBuffers) e.teleports[t] = await sS(e.__teleportBuffers[t]);
	}
}
async function dS(e, t) {
	if (e.hasAsync) for (let n = 0; n < e.length; n++) {
		let r = e[n];
		le(r) && (r = await r), F(r) ? t.push(r) : await dS(r, t);
	}
	else fS(e, t);
}
function fS(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		F(r) ? t.push(r) : fS(r, t);
	}
}
function pS(e, t, n) {
	if (MS(e)) return pS(Gu({ render: () => e }), t, n);
	let r = vc(e._component, e._props);
	return r.appContext = e._context, e.provide(zo, t), Promise.resolve($x(r)).then((e) => dS(e, n)).then(() => uS(t)).then(() => {
		if (t.__watcherHandles) for (let e of t.__watcherHandles) e();
	}).then(() => n.push(null)).catch((e) => {
		n.destroy(e);
	}), n;
}
function mS(e, t = {}) {
	return console.warn("[@vue/server-renderer] renderToStream is deprecated - use renderToNodeStream instead."), hS(e, t);
}
function hS(e, t = {}) {
	throw Error("ESM build of renderToStream() does not support renderToNodeStream(). Use pipeToNodeWritable() with an existing Node.js Writable stream instance instead.");
}
function gS(e, t = {}, n) {
	pS(e, t, {
		push(e) {
			e == null ? n.end() : n.write(e);
		},
		destroy(e) {
			n.destroy(e);
		}
	});
}
function _S(e, t = {}) {
	if (typeof ReadableStream != "function") throw Error("ReadableStream constructor is not available in the global scope. If the target environment does support web streams, consider using pipeToWebWritable() with an existing WritableStream instance instead.");
	let n = new TextEncoder(), r = !1;
	return new ReadableStream({
		start(i) {
			pS(e, t, {
				push(e) {
					r || (e == null ? i.close() : i.enqueue(n.encode(e)));
				},
				destroy(e) {
					i.error(e);
				}
			});
		},
		cancel() {
			r = !0;
		}
	});
}
function vS(e, t = {}, n) {
	let r = n.getWriter(), i = new TextEncoder(), a = !1;
	try {
		a = le(r.ready);
	} catch {}
	pS(e, t, {
		async push(e) {
			return a && await r.ready, e == null ? r.close() : r.write(i.encode(e));
		},
		destroy(e) {
			console.log(e), r.close();
		}
	});
}
var yS, bS, xS, SS, CS, wS, TS, ES, DS, OS, kS, AS, jS, MS, NS = o((() => {
	qh(), et(), yS = /* @__PURE__ */ d(",key,ref,innerHTML,textContent,ref_key,ref_for"), {ensureValidVNode: bS} = Lc, xS = /^<!--[\s\S]*-->$/, SS = /<!--[^]*?-->/gm;
	{
		let e = Ae(), t = (t, n) => {
			let r;
			return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
				r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
			};
		};
		t("__VUE_INSTANCE_SETTERS__", (e) => e), t("__VUE_SSR_SETTERS__", (e) => e);
	}
	CS = C, {createComponentInstance: wS, setCurrentRenderingInstance: TS, setupComponent: ES, renderComponentRoot: DS, normalizeVNode: OS, pushWarningContext: kS, popWarningContext: AS} = Lc, {isVNode: jS} = Lc, {isVNode: MS} = Lc, Ju();
})), PS = /* @__PURE__ */ c({
	pipeToNodeWritable: () => gS,
	pipeToWebWritable: () => vS,
	renderToNodeStream: () => hS,
	renderToSimpleStream: () => pS,
	renderToStream: () => mS,
	renderToString: () => lS,
	renderToWebStream: () => _S,
	ssrGetDirectiveProps: () => qx,
	ssrGetDynamicModelProps: () => Xx,
	ssrIncludeBooleanAttr: () => v,
	ssrInterpolate: () => Wx,
	ssrLooseContain: () => Jx,
	ssrLooseEqual: () => CS,
	ssrRenderAttr: () => Fx,
	ssrRenderAttrs: () => Nx,
	ssrRenderClass: () => Ix,
	ssrRenderComponent: () => zx,
	ssrRenderDynamicAttr: () => Px,
	ssrRenderDynamicModel: () => Yx,
	ssrRenderList: () => Gx,
	ssrRenderSlot: () => Bx,
	ssrRenderSlotInner: () => Vx,
	ssrRenderStyle: () => Lx,
	ssrRenderSuspense: () => Kx,
	ssrRenderTeleport: () => Ux,
	ssrRenderVNode: () => tS
}), FS = o((() => {
	NS();
}));
//#endregion
//#region visual-editor/src/runtime/IsolatedOutputFrame.vue
qh();
var IS = ["title", "srcdoc"], LS = {
	__name: "IsolatedOutputFrame",
	props: {
		title: {
			type: String,
			default: "프로모션 페이지"
		},
		viewport: {
			type: String,
			default: ""
		},
		variables: {
			type: Object,
			default: () => ({})
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = zi(), i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ Jt(null), o = /* @__PURE__ */ R(0), s = `output-${Qr().replace(/[^a-zA-Z0-9_-]/g, "")}`, c = () => Object.entries(n.variables).filter(([e, t]) => /^--[a-zA-Z0-9-]+$/.test(e) && typeof t == "string" && !/[;{}<>]/.test(t)).map(([e, t]) => `${e}:${t}`).join(";"), l = (e) => `<!doctype html><html><head><meta charset="utf-8"><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${Mx}</style><style id="output-token-values">body{${c()}}</style></head><body><div id="output-content">${e}</div></body></html>`, u = /* @__PURE__ */ R(typeof document > "u" ? l("") : document.getElementById(s)?.getAttribute("srcdoc") || l(""));
		ks(async () => {
			let { renderToString: e } = await Promise.resolve().then(() => (FS(), PS));
			u.value = l(await e(Ku({ render: () => yo("div", r.default?.()) })));
		});
		let d, f, m = !1;
		function h() {
			if (m) return;
			let e = i.value?.contentDocument?.getElementById("output-content");
			e && (o.value = Math.max(1, Math.ceil(e.getBoundingClientRect().height)));
		}
		async function g() {
			if (m || a.value) return;
			let e = i.value?.contentDocument;
			if (!e?.body || e.URL !== "about:srcdoc") return;
			let t = e.getElementById("output-content");
			t && (e.body.style.cssText = "", e.getElementById("output-token-values").textContent = `body{${c()}}`, t.replaceChildren(), a.value = t, await hr(), h(), d = new MutationObserver(h), d.observe(t, {
				childList: !0,
				subtree: !0,
				attributes: !0,
				characterData: !0
			}), f = new ResizeObserver(h), f.observe(t), e.addEventListener("load", h, !0));
		}
		return Fr(() => n.variables, () => {
			let e = i.value?.contentDocument;
			e?.getElementById("output-token-values") && (e.body.style.cssText = "", e.getElementById("output-token-values").textContent = `body{${c()}}`);
		}, { deep: !0 }), ws(() => {
			g();
		}), Ds(() => {
			m = !0, d?.disconnect(), f?.disconnect();
		}), t({
			getDocument: () => i.value?.contentDocument,
			syncHeight: h
		}), (t, n) => (V(), H(K, null, [U("iframe", {
			id: s,
			ref_key: "frame",
			ref: i,
			title: e.title,
			srcdoc: u.value,
			sandbox: "allow-same-origin allow-forms allow-top-navigation-by-user-activation",
			style: p({
				display: "block",
				width: "100%",
				height: o.value ? `${o.value}px` : "auto",
				minHeight: e.viewport ? void 0 : "100vh",
				border: 0
			}),
			onLoad: g
		}, null, 44, IS), a.value ? (V(), Ja(Xo, {
			key: 0,
			to: a.value
		}, [ki(t.$slots, "default")], 8, ["to"])) : G("", !0)], 64));
	}
}, RS = Object.freeze({
	contractVersion: 2,
	formTemplate: Object.freeze({ designTokens: Object.freeze({ values: Object.freeze({}) }) }),
	sectionSnapshot: Object.freeze([]),
	sectionInputs: Object.freeze({}),
	sectionOrder: Object.freeze([]),
	resourceReferences: Object.freeze([])
}), zS = Object.freeze({
	contractVersion: 1,
	theme: Object.freeze({}),
	responsive: Object.freeze({
		contentMaxWidth: 1280,
		contentMinWidth: 0,
		mobileBreakpoint: 720
	}),
	itemStyles: Object.freeze({}),
	sectionStyles: Object.freeze({}),
	visibility: Object.freeze({
		items: Object.freeze({}),
		fields: Object.freeze({})
	}),
	responsiveLayouts: Object.freeze({ mobile: Object.freeze({
		itemStyles: Object.freeze({}),
		visibility: Object.freeze({ items: Object.freeze({}) })
	}) })
}), BS = Object.freeze({
	contractVersion: 1,
	items: Object.freeze({})
}), VS = Object.freeze({
	contractVersion: 2,
	sections: Object.freeze({}),
	items: Object.freeze({})
});
function HS(e, t) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : t;
}
function US(e = {}) {
	let t = HS(e, {}), n = HS(t.snapshot, {});
	return {
		content: HS(t.content || n.content, RS),
		designSpec: HS(t.designSpec || n.designSpec, zS),
		assets: HS(t.assets || n.assets, BS),
		motionSpec: HS(t.motionSpec || n.motionSpec, VS),
		viewportOverride: [
			"desktop",
			"tablet",
			"mobile"
		].includes(t.viewportOverride) ? t.viewportOverride : ""
	};
}
//#endregion
//#region visual-editor/src/runtime/PromoReadonlyRenderer.vue
qh();
var WS = {
	key: 0,
	role: "alert",
	class: "output-policy-error"
}, GS = {
	__name: "PromoReadonlyRenderer",
	props: {
		snapshot: {
			type: Object,
			default: null
		},
		content: {
			type: Object,
			default: null
		},
		designSpec: {
			type: Object,
			default: null
		},
		assets: {
			type: Object,
			default: null
		},
		motionSpec: {
			type: Object,
			default: null
		},
		viewportOverride: {
			type: String,
			default: ""
		},
		wireframe: {
			type: Boolean,
			default: !1
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = q(() => US(n)), i = q(() => r.value.content.runtimeTheme?.designTokens || r.value.content.formTemplate?.designTokens || {}), a = q(() => r.value.content.pageContext || {
			tokenValues: i.value.values || {},
			tokenCatalog: i.value.catalog || [],
			usagePolicy: i.value.usagePolicy
		}), o = q(() => Ay(a.value)), s = q(() => [
			...o.value.errors,
			...r.value.content.pageSchema ? [] : Py(r.value.designSpec, a.value.tokenValues, a.value.tokenCatalog, a.value.usagePolicy, r.value.content.sectionSnapshot || []).errors,
			...Eg(a.value.usagePolicy, a.value.tokenCatalog, { activation: !0 }).errors,
			...Object.entries(a.value.usagePolicy?.bindings || {}).filter(([, e]) => typeof e == "string" && e.startsWith("--app-")).map(([e]) => ({
				code: "BUILDER_TOKEN_FORBIDDEN",
				path: e,
				message: "출력에 빌더 토큰을 사용할 수 없습니다."
			}))
		]), c = q(() => ({
			...bx(a.value),
			...Og(a.value.usagePolicy, a.value.tokenValues)
		})), l = /* @__PURE__ */ R(null), u = /* @__PURE__ */ R(null);
		function d() {
			if (!o.value.ok) return "";
			let e = o.value, t = a.value.tokenValues, r = (t) => `.promo-renderer{--output-grid-margin:var(${e.profiles[t].margin});--output-grid-gutter:var(${e.profiles[t].gutter})}`;
			return `${r("mobile")}@media(min-width:${t[e.breakpoints.tablet]}){${r("tablet")}}@media(min-width:${t[e.breakpoints.desktop]}){${r("desktop")}}@media(min-width:${t[e.breakpoints.wide]}){${r("desktopWide")}}${n.viewportOverride ? r(n.viewportOverride) : ""}`;
		}
		function f() {
			return {
				count: 1,
				blockingCount: 1,
				warningCount: 0,
				diagnostics: s.value.length ? s.value.map((e) => ({
					...e,
					level: "blocking"
				})) : [{
					code: "OUTPUT_RENDERER_NOT_READY",
					level: "blocking",
					message: "출력 렌더러가 준비되지 않았습니다."
				}]
			};
		}
		return t({
			getOutputDocument: () => l.value?.getDocument(),
			inspectLayoutQuality: () => s.value.length ? f() : u.value?.inspectLayoutQuality?.() || f(),
			inspectLayoutCollisions: () => u.value?.inspectLayoutCollisions?.() || {
				itemPatches: {},
				sectionPatches: {}
			},
			syncHeight: () => l.value?.syncHeight()
		}), (t, n) => s.value.length ? (V(), H("section", WS, [n[0] ||= U("strong", null, "등록된 디자인 토큰을 확인해 주세요.", -1), U("ul", null, [(V(!0), H(K, null, B(s.value, (e, t) => (V(), H("li", { key: t }, L(e.message || e.path || e.key), 1))), 128))])])) : (V(), Ja(LS, {
			key: 1,
			ref_key: "frame",
			ref: l,
			viewport: r.value.viewportOverride,
			variables: c.value
		}, {
			default: Dr(() => [U("div", {
				"data-output-boundary": "",
				style: p(c.value)
			}, [(V(), Ja(wi("style"), null, {
				default: Dr(() => [W(L(d()), 1)]),
				_: 1
			})), r.value.content.pageSchema ? (V(), Ja(jx, {
				key: 0,
				ref_key: "renderer",
				ref: u,
				page: r.value.content.pageSchema,
				context: a.value,
				"viewport-override": r.value.viewportOverride,
				wireframe: e.wireframe
			}, null, 8, [
				"page",
				"context",
				"viewport-override",
				"wireframe"
			])) : (V(), Ja(px, {
				key: 1,
				ref_key: "renderer",
				ref: u,
				class: "promo-readonly-renderer",
				content: {
					...r.value.content,
					runtimeTheme: {
						...r.value.content.runtimeTheme,
						designTokens: {
							...i.value,
							policy: "registered-only"
						}
					}
				},
				"design-spec": r.value.designSpec,
				assets: r.value.assets,
				"motion-spec": r.value.motionSpec,
				"viewport-override": r.value.viewportOverride,
				editable: !1,
				"show-guides": !1,
				"outline-mode": !1
			}, null, 8, [
				"content",
				"design-spec",
				"assets",
				"motion-spec",
				"viewport-override"
			]))], 4)]),
			_: 1
		}, 8, ["viewport", "variables"]));
	}
};
//#endregion
//#region admin-app/src/services/section-layout-workbench.mjs
function KS(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function qS(e = {}) {
	return e.fieldKind === "image" ? {
		source: "url",
		value: "",
		alt: e.name || "미리보기 이미지"
	} : e.fieldKind === "cta" ? {
		label: e.defaultValue || e.name || "자세히 보기",
		link: "#",
		target: "_self"
	} : e.defaultValue || (e.textType === "title" ? "프로모션 제목 미리보기" : `${e.name || "텍스트"} 미리보기`);
}
function JS(e = {}) {
	let t = Array.isArray(e.fields) && e.fields.length ? e.fields : [e];
	return t.length === 1 ? qS(t[0]) : { fields: Object.fromEntries(t.map((e) => [e.fieldKey, qS(e)])) };
}
function YS(e = {}, t = []) {
	let n = KS(e) || {}, r = t.map((e) => String(e.itemKey || "")).filter(Boolean), i = (e) => ({
		items: Object.fromEntries(r.map((t) => [t, {
			positionMode: "free",
			xPct: e === "mobile" ? 5 : 4,
			yPx: 16,
			widthPct: e === "mobile" ? 90 : 44,
			heightPx: 52,
			zIndex: 1,
			...n.viewports?.[e]?.items?.[t] || {}
		}])),
		visibility: { items: Object.fromEntries(r.map((t) => [t, n.viewports?.[e]?.visibility?.items?.[t] !== !1])) }
	});
	return {
		contractVersion: 1,
		layoutMode: "free",
		sectionStyle: {
			minHeight: 320,
			backgroundColor: "#ffffff",
			...n.sectionStyle || {}
		},
		content: Object.fromEntries(t.map((e) => [e.itemKey, Object.prototype.hasOwnProperty.call(n.content || {}, e.itemKey) ? n.content[e.itemKey] : JS(e)])),
		viewports: {
			desktop: i("desktop"),
			mobile: i("mobile")
		}
	};
}
function XS(e = {}, t = []) {
	return [{
		path: "root",
		depth: 0,
		tag: "section",
		kind: "section",
		label: e.name || e.sectionKey || "Section"
	}, ...t.map((e, t) => ({
		path: `root.children.${t}`,
		depth: 1,
		tag: "article",
		kind: "component",
		itemKey: e.itemKey,
		label: e.name || e.itemKey,
		node: e
	}))];
}
function ZS(e, t, n, r) {
	let i = KS(e), a = t === "mobile" ? "mobile" : "desktop", o = i.viewports?.[a]?.items?.[n];
	return o && (i.viewports[a].items[n] = {
		...o,
		...KS(r)
	}), i;
}
function QS(e, t, n, r) {
	let i = KS(e), a = t === "mobile" ? "mobile" : "desktop";
	return i.viewports[a].visibility.items[n] = r !== !1, i;
}
function $S(e = {}, t = [], n = {}) {
	let r = YS(n, t), i = e.sectionKey || "preview-section", a = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, KS(r.viewports.desktop.items[e.itemKey])])), o = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, KS(r.viewports.mobile.items[e.itemKey])])), s = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, r.viewports.desktop.visibility.items[e.itemKey] !== !1])), c = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, r.viewports.mobile.visibility.items[e.itemKey] !== !1]));
	return {
		contractVersion: 3,
		content: {
			contractVersion: 3,
			formTemplate: {
				id: "section-preview",
				designTokens: { values: {} }
			},
			runtimeTheme: {
				sourceType: "admin-preview",
				designTokens: { values: {} }
			},
			sectionSnapshot: [{
				...KS(e),
				sectionKey: i,
				items: KS(t)
			}],
			sectionInputs: { [i]: KS(r.content) },
			sectionOrder: [i],
			resourceReferences: []
		},
		designSpec: {
			contractVersion: 1,
			theme: {
				backgroundColor: "#f5f7fb",
				textColor: "#172033",
				accentColor: "#156b5b",
				ctaColor: "#156b5b",
				ctaVariant: "fill",
				fontFamily: "Inter, Pretendard, sans-serif"
			},
			responsive: {
				contentMaxWidth: 1280,
				contentMinWidth: 0,
				mobileBreakpoint: 720
			},
			sectionStyles: { [i]: KS(r.sectionStyle) },
			itemStyles: a,
			visibility: {
				items: s,
				fields: {}
			},
			responsiveLayouts: { mobile: {
				itemStyles: o,
				visibility: { items: c }
			} }
		},
		assets: {
			contractVersion: 1,
			items: {}
		},
		motionSpec: {
			contractVersion: 2,
			sections: {},
			items: {}
		}
	};
}
//#endregion
//#region admin-app/src/components/DomStructureTree.vue
qh();
var eC = ["aria-label"], tC = [
	"aria-current",
	"data-dom-path",
	"onClick"
], nC = { key: 0 }, rC = /*#__PURE__*/ Jh({
	__name: "DomStructureTree",
	props: {
		nodes: {
			type: Array,
			default: () => []
		},
		selectedPath: {
			type: String,
			default: ""
		},
		ariaLabel: {
			type: String,
			default: "DOM 구조"
		},
		emptyMessage: {
			type: String,
			default: "표시할 구조가 없습니다."
		}
	},
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (V(), H("nav", {
			class: "dom-structure-tree",
			"aria-label": e.ariaLabel
		}, [(V(!0), H(K, null, B(e.nodes, (t) => (V(), H("button", {
			key: t.path,
			type: "button",
			class: g({ active: t.path === e.selectedPath }),
			style: p({ paddingLeft: `${10 + Number(t.depth || 0) * 16}px` }),
			"aria-current": t.path === e.selectedPath ? "true" : void 0,
			"data-dom-path": t.path,
			onClick: (e) => n("select", t.path)
		}, [U("small", null, L(t.tag || t.node?.tag || t.kind || "node"), 1), U("span", null, L(t.label || t.path), 1)], 14, tC))), 128)), e.nodes.length ? G("", !0) : (V(), H("p", nC, L(e.emptyMessage), 1))], 8, eC));
	}
}, [["__scopeId", "data-v-e9c62dcf"]]);
//#endregion
//#region admin-app/src/components/LivePreviewHost.vue
qh();
var iC = ["data-preview-mode"], aC = {
	class: "live-preview-host__viewports",
	role: "group",
	"aria-label": "미리보기 화면 크기"
}, oC = ["aria-pressed", "onClick"], sC = { class: "live-preview-host__stage" }, cC = /*#__PURE__*/ Jh({
	__name: "LivePreviewHost",
	props: {
		modelValue: {
			type: String,
			default: "desktop"
		},
		mode: {
			type: String,
			default: "component"
		},
		selectedNodeKey: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: "Live Preview"
		}
	},
	emits: ["update:modelValue", "select-node"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(null), a = q(() => ({
			desktop: "100%",
			tablet: "760px",
			mobile: "390px"
		})[n.modelValue] || "100%");
		function o(e) {
			let t = e?.closest?.("[data-render-path],[data-item-key],[data-section-key]");
			return t ? {
				path: t.dataset.renderPath || "",
				fieldKey: t.dataset.fieldKey || "",
				itemKey: t.dataset.itemKey || "",
				sectionKey: t.dataset.sectionKey || ""
			} : null;
		}
		function s(e) {
			let t = o(e.target);
			t && r("select-node", t);
		}
		async function c() {
			await hr(), (i.value?.querySelectorAll?.("[data-render-path],[data-item-key],[data-section-key]") || []).forEach((e) => {
				let t = n.selectedNodeKey && [
					e.dataset.renderPath,
					e.dataset.fieldKey,
					e.dataset.itemKey,
					e.dataset.sectionKey
				].includes(n.selectedNodeKey);
				e.classList.toggle("is-live-preview-selected", !!t);
			});
		}
		return Fr(() => [n.selectedNodeKey, n.modelValue], c), ws(c), (t, n) => (V(), H("section", {
			class: "live-preview-host",
			"data-preview-mode": e.mode
		}, [U("header", null, [U("strong", null, L(e.title), 1), U("div", aC, [(V(), H(K, null, B([
			"desktop",
			"tablet",
			"mobile"
		], (t) => U("button", {
			key: t,
			type: "button",
			class: g({ active: e.modelValue === t }),
			"aria-pressed": e.modelValue === t,
			onClick: (e) => r("update:modelValue", t)
		}, L(t), 11, oC)), 64))])]), U("div", sC, [U("div", {
			ref_key: "previewRoot",
			ref: i,
			class: "live-preview-host__viewport",
			style: p({ width: a.value }),
			onClick: s
		}, [ki(t.$slots, "default", { viewport: e.modelValue }, void 0, !0)], 4)])], 8, iC));
	}
}, [["__scopeId", "data-v-0cec6315"]]);
//#endregion
//#region admin-app/src/components/SectionLayoutDomWorkbench.vue
qh();
var lC = {
	class: "section-layout-dom-workbench",
	"aria-label": "섹션 DOM 구성 Workbench"
}, uC = { class: "action-row" }, dC = ["disabled"], fC = {
	key: 0,
	class: "field-error"
}, pC = {
	key: 1,
	class: "empty-state compact"
}, mC = { class: "section-layout-dom-workbench__grid" }, hC = {
	class: "section-layout-dom-workbench__inspector",
	"aria-label": "선택 구성 속성"
}, gC = ["value", "disabled"], _C = ["value", "disabled"], vC = ["value", "disabled"], yC = ["value", "disabled"], bC = ["value", "disabled"], xC = ["value", "disabled"], SC = ["value", "disabled"], CC = { class: "inline-check" }, wC = ["checked", "disabled"], TC = /*#__PURE__*/ Jh({
	__name: "SectionLayoutDomWorkbench",
	props: {
		section: {
			type: Object,
			required: !0
		},
		layout: {
			type: Object,
			required: !0
		},
		items: {
			type: Array,
			default: () => []
		}
	},
	emits: ["saved", "close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R("desktop"), a = /* @__PURE__ */ R("root"), o = /* @__PURE__ */ R(YS(n.layout.layoutSnapshot, n.items)), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(""), l = q(() => n.section.status === "draft"), u = q(() => XS(n.section, n.items)), d = q(() => u.value.find((e) => e.path === a.value) || u.value[0]), f = q(() => d.value?.itemKey && n.items.find((e) => e.itemKey === d.value.itemKey) || null), p = q(() => i.value === "mobile" ? "mobile" : "desktop"), m = q(() => f.value ? o.value.viewports[p.value].items[f.value.itemKey] : null), h = q(() => !f.value || o.value.viewports[p.value].visibility.items[f.value.itemKey] !== !1), g = q(() => $S(n.section, n.items, o.value)), _ = q(() => f.value?.itemKey || n.section.sectionKey);
		Fr(() => [n.layout.id, n.items], () => {
			o.value = YS(n.layout.layoutSnapshot, n.items), a.value = "root";
		}, { deep: !0 });
		function v(e, t = 0) {
			let n = Number(e);
			return Number.isFinite(n) ? n : t;
		}
		function y(e, t) {
			o.value = {
				...o.value,
				sectionStyle: {
					...o.value.sectionStyle,
					[e]: t
				}
			};
		}
		function b(e, t) {
			f.value && (o.value = ZS(o.value, p.value, f.value.itemKey, { [e]: v(t, m.value?.[e] || 0) }));
		}
		function x(e) {
			f.value && (o.value = QS(o.value, p.value, f.value.itemKey, e));
		}
		function S(e) {
			if (!e.itemKey) return;
			let t = u.value.find((t) => t.itemKey === e.itemKey);
			t && (a.value = t.path);
		}
		async function ee() {
			if (!(!l.value || s.value)) {
				s.value = !0, c.value = "";
				try {
					let e = await Dy.update(n.layout.id, n.section.id, {
						layoutSnapshot: o.value,
						changeNote: "관리자 DOM 구성 Workbench에서 레이아웃 프리셋 변경."
					});
					r("saved", e);
				} catch (e) {
					c.value = e.validationErrors?.[0]?.message || e.message;
				} finally {
					s.value = !1;
				}
			}
		}
		return (t, n) => (V(), H("section", lC, [
			U("header", null, [U("div", null, [U("strong", null, L(e.layout.name) + " · DOM 구성", 1), U("small", null, L(e.layout.layoutKey) + " · 저장 대상: 선택한 레이아웃 프리셋", 1)]), U("div", uC, [U("button", {
				class: "tiny-button",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, "닫기"), U("button", {
				class: "tiny-button primary",
				type: "button",
				disabled: !l.value || s.value,
				onClick: ee
			}, L(s.value ? "저장 중…" : "프리셋 저장"), 9, dC)])]),
			c.value ? (V(), H("p", fC, L(c.value), 1)) : G("", !0),
			l.value ? G("", !0) : (V(), H("p", pC, "활성·비활성 섹션은 읽기 전용입니다.")),
			U("div", mC, [
				vc(rC, {
					nodes: u.value,
					"selected-path": a.value,
					"aria-label": "섹션 구성 구조",
					onSelect: n[1] ||= (e) => a.value = e
				}, null, 8, ["nodes", "selected-path"]),
				U("section", hC, [f.value ? (V(), H(K, { key: 1 }, [
					U("strong", null, L(f.value.name || f.value.itemKey), 1),
					U("small", null, L(p.value) + " Geometry", 1),
					U("label", null, [n[14] ||= W("X (%)", -1), U("input", {
						type: "number",
						min: "0",
						max: "100",
						step: "0.5",
						value: m.value.xPct,
						disabled: !l.value,
						onInput: n[4] ||= (e) => b("xPct", e.target.value)
					}, null, 40, vC)]),
					U("label", null, [n[15] ||= W("Y (px)", -1), U("input", {
						type: "number",
						min: "0",
						max: "2400",
						value: m.value.yPx,
						disabled: !l.value,
						onInput: n[5] ||= (e) => b("yPx", e.target.value)
					}, null, 40, yC)]),
					U("label", null, [n[16] ||= W("너비 (%)", -1), U("input", {
						type: "number",
						min: "1",
						max: "100",
						step: "0.5",
						value: m.value.widthPct,
						disabled: !l.value,
						onInput: n[6] ||= (e) => b("widthPct", e.target.value)
					}, null, 40, bC)]),
					U("label", null, [n[17] ||= W("높이 (px)", -1), U("input", {
						type: "number",
						min: "20",
						max: "2400",
						value: m.value.heightPx,
						disabled: !l.value,
						onInput: n[7] ||= (e) => b("heightPx", e.target.value)
					}, null, 40, xC)]),
					U("label", null, [n[18] ||= W("Z-index", -1), U("input", {
						type: "number",
						min: "0",
						max: "100",
						value: m.value.zIndex,
						disabled: !l.value,
						onInput: n[8] ||= (e) => b("zIndex", e.target.value)
					}, null, 40, SC)]),
					U("label", CC, [U("input", {
						type: "checkbox",
						checked: h.value,
						disabled: !l.value || f.value.isRequired || f.value.isLocked,
						onChange: n[9] ||= (e) => x(e.target.checked)
					}, null, 40, wC), n[19] ||= U("span", null, "이 화면에서 표시", -1)])
				], 64)) : (V(), H(K, { key: 0 }, [
					n[13] ||= U("strong", null, "Section", -1),
					U("label", null, [n[11] ||= W("최소 높이", -1), U("input", {
						type: "number",
						min: "50",
						max: "2400",
						value: o.value.sectionStyle.minHeight,
						disabled: !l.value,
						onInput: n[2] ||= (e) => y("minHeight", v(e.target.value, 320))
					}, null, 40, gC)]),
					U("label", null, [n[12] ||= W("배경색", -1), U("input", {
						type: "color",
						value: o.value.sectionStyle.backgroundColor || "#ffffff",
						disabled: !l.value,
						onInput: n[3] ||= (e) => y("backgroundColor", e.target.value)
					}, null, 40, _C)])
				], 64))]),
				vc(cC, {
					modelValue: i.value,
					"onUpdate:modelValue": n[10] ||= (e) => i.value = e,
					mode: "section",
					"selected-node-key": _.value,
					title: "Section Live Preview",
					onSelectNode: S
				}, {
					default: Dr(() => [vc(GS, {
						snapshot: g.value,
						"viewport-override": p.value
					}, null, 8, ["snapshot", "viewport-override"])]),
					_: 1
				}, 8, ["modelValue", "selected-node-key"])
			])
		]));
	}
}, [["__scopeId", "data-v-10b3829e"]]), EC = ["desktop", "mobile"];
function DC(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function OC(e, t, n, r = "error") {
	return {
		code: e,
		path: t,
		message: n,
		level: r
	};
}
function kC(e, t = []) {
	let n = [], r = DC(e) ? e : {}, i = new Set(t.map(String));
	return r.contractVersion !== 1 && n.push(OC("LAYOUT_CONTRACT_UNSUPPORTED", "$.contractVersion", "contractVersion 1만 지원합니다.")), r.layoutMode !== "free" && n.push(OC("LAYOUT_MODE_UNSUPPORTED", "$.layoutMode", "layoutMode는 free여야 합니다.")), EC.forEach((e) => {
		let a = `$.viewports.${e}`, o = r.viewports?.[e];
		if (!DC(o)) {
			n.push(OC("LAYOUT_VIEWPORT_REQUIRED", a, `${e} viewport가 필요합니다.`));
			return;
		}
		let s = DC(o.items) ? o.items : {};
		t.forEach((t) => {
			DC(s[t]) || n.push(OC("LAYOUT_GEOMETRY_INCOMPLETE", `${a}.items.${t}`, `${t} 컴포넌트의 ${e} geometry가 없습니다.`, "warning"));
		}), Object.entries(s).forEach(([e, t]) => {
			let r = `${a}.items.${e}`;
			if (i.size && !i.has(e) && n.push(OC("LAYOUT_ITEM_KEY_UNKNOWN", r, `현재 Section에 없는 itemKey입니다: ${e}`)), !DC(t)) {
				n.push(OC("LAYOUT_GEOMETRY_INVALID", r, "Geometry는 JSON Object여야 합니다."));
				return;
			}
			[
				[
					"xPct",
					0,
					100
				],
				[
					"widthPct",
					.01,
					100
				],
				[
					"yPx",
					0,
					1e4
				],
				[
					"heightPx",
					1,
					1e4
				]
			].forEach(([e, i, a]) => {
				if (t[e] === void 0) return;
				let o = Number(t[e]);
				(!Number.isFinite(o) || o < i || o > a) && n.push(OC("LAYOUT_GEOMETRY_OUT_OF_RANGE", `${r}.${e}`, `${e} 값이 허용 범위를 벗어났습니다.`));
			});
		});
	}), n;
}
function AC(e, t, n = !1) {
	return {
		id: e?.id || "",
		sectionId: e?.sectionId || t?.id || "",
		layoutKey: e?.layoutKey || "",
		name: e?.name || "",
		description: e?.description || "",
		isDefault: !!e?.isDefault,
		aiSelectable: !!n,
		selectionMetadata: e?.selectionMetadata || {},
		layoutSnapshot: e?.layoutSnapshot || {},
		changeNote: e?.changeNote || "",
		createdAt: e?.createdAt || null,
		updatedAt: e?.updatedAt || null
	};
}
function jC(e) {
	return `${String(e?.layoutKey || "layout-preset").replace(/[^a-zA-Z0-9_-]+/g, "-") || "layout-preset"}.json`;
}
//#endregion
//#region admin-app/src/components/JsonTreeView.vue
qh();
var MC = { class: "json-tree__row" }, NC = ["aria-label", "aria-expanded"], PC = {
	key: 1,
	class: "json-tree__spacer",
	"aria-hidden": "true"
}, FC = ["title"], IC = {
	key: 2,
	class: "json-tree__preview"
}, LC = { key: 3 }, RC = {
	key: 0,
	class: "json-tree__children"
}, zC = /*#__PURE__*/ Jh({
	__name: "JsonTreeView",
	props: {
		value: {
			type: null,
			required: !0
		},
		path: {
			type: String,
			default: "$"
		},
		query: {
			type: String,
			default: ""
		},
		expandRevision: {
			type: Number,
			default: 0
		},
		collapseRevision: {
			type: Number,
			default: 0
		}
	},
	emits: ["copy-path"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(!0), a = q(() => n.value !== null && typeof n.value == "object"), o = q(() => a.value ? Object.entries(n.value) : []), s = q(() => Array.isArray(n.value) ? `Array(${n.value.length})` : `{${o.value.length}}`), c = q(() => typeof n.value == "string" ? JSON.stringify(n.value) : String(n.value)), l = q(() => {
			let e = n.query.trim().toLocaleLowerCase();
			return e ? `${n.path} ${a.value ? s.value : c.value}`.toLocaleLowerCase().includes(e) : !1;
		});
		function u(e) {
			return Array.isArray(n.value) ? `${n.path}[${e}]` : /^[A-Za-z_$][\w$]*$/.test(e) ? `${n.path}.${e}` : `${n.path}[${JSON.stringify(e)}]`;
		}
		return Fr(() => n.expandRevision, () => {
			i.value = !0;
		}), Fr(() => n.collapseRevision, () => {
			i.value = !1;
		}), (t, n) => {
			let d = Ci("JsonTreeView", !0);
			return V(), H("li", { class: g(["json-tree__node", { "is-match": l.value }]) }, [U("div", MC, [
				a.value ? (V(), H("button", {
					key: 0,
					class: "json-tree__toggle",
					type: "button",
					"aria-label": `${e.path} ${i.value ? "접기" : "펼치기"}`,
					"aria-expanded": i.value,
					onClick: n[0] ||= (e) => i.value = !i.value
				}, L(i.value ? "−" : "+"), 9, NC)) : (V(), H("span", PC)),
				U("button", {
					class: "json-tree__path",
					type: "button",
					title: `${e.path} 경로 복사`,
					onClick: n[1] ||= (t) => r("copy-path", e.path)
				}, L(e.path), 9, FC),
				a.value ? (V(), H("span", IC, L(s.value), 1)) : (V(), H("code", LC, L(c.value), 1))
			]), a.value && i.value ? (V(), H("ul", RC, [(V(!0), H(K, null, B(o.value, ([t, i]) => (V(), Ja(d, {
				key: u(t),
				value: i,
				path: u(t),
				query: e.query,
				"expand-revision": e.expandRevision,
				"collapse-revision": e.collapseRevision,
				onCopyPath: n[2] ||= (e) => r("copy-path", e)
			}, null, 8, [
				"value",
				"path",
				"query",
				"expand-revision",
				"collapse-revision"
			]))), 128))])) : G("", !0)], 2);
		};
	}
}, [["__scopeId", "data-v-0a8b684d"]]);
//#endregion
//#region admin-app/src/components/JsonSnapshotDialog.vue
qh();
var BC = { class: "json-snapshot-dialog__surface" }, VC = { class: "json-snapshot-dialog__summary" }, HC = { key: 0 }, UC = { key: 1 }, WC = {
	class: "json-snapshot-dialog__tabs",
	"aria-label": "저장 JSON 종류"
}, GC = ["aria-pressed", "onClick"], KC = { class: "json-snapshot-dialog__toolbar" }, qC = { key: 0 }, JC = ["aria-pressed"], YC = ["aria-pressed"], XC = {
	key: 0,
	class: "json-snapshot-dialog__tree",
	role: "tree",
	"aria-label": "저장 JSON 트리"
}, ZC = {
	key: 1,
	class: "json-snapshot-dialog__code",
	tabindex: "0"
}, QC = {
	class: "json-snapshot-dialog__validation",
	"aria-live": "polite"
}, $C = { key: 0 }, ew = { key: 1 }, tw = { key: 2 }, nw = {
	key: 3,
	role: "status"
}, rw = { key: 4 }, iw = /*#__PURE__*/ Jh({
	__name: "JsonSnapshotDialog",
	props: {
		layout: {
			type: Object,
			required: !0
		},
		section: {
			type: Object,
			required: !0
		},
		items: {
			type: Array,
			default: () => []
		},
		aiSelectable: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ R("snapshot"), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R(""), c = /* @__PURE__ */ R("tree"), l = /* @__PURE__ */ R(0), u = /* @__PURE__ */ R(0), d = null, f = null, p = Object.freeze([
			{
				key: "snapshot",
				label: "Layout Snapshot"
			},
			{
				key: "metadata",
				label: "AI 선택 기준"
			},
			{
				key: "full",
				label: "전체 보기"
			}
		]), m = q(() => AC(n.layout, n.section, n.aiSelectable)), h = q(() => ({
			snapshot: n.layout.layoutSnapshot || {},
			metadata: n.layout.selectionMetadata || {},
			full: m.value
		})[a.value]), _ = q(() => JSON.stringify(h.value, null, 2)), v = q(() => _.value.split("\n")), y = q(() => o.value.trim().toLocaleLowerCase()), b = q(() => y.value ? v.value.filter((e) => e.toLocaleLowerCase().includes(y.value)).length : 0), x = q(() => kC(n.layout.layoutSnapshot, n.items.map((e) => e.itemKey))), S = q(() => x.value.filter((e) => e.level === "error")), ee = q(() => x.value.filter((e) => e.level === "warning"));
		function C() {
			i.value?.open ? i.value.close() : r("close");
		}
		function w() {
			r("close"), hr(() => d?.focus?.());
		}
		function T(e) {
			e.target === i.value && C();
		}
		async function E() {
			try {
				await globalThis.navigator.clipboard.writeText(_.value), s.value = "JSON을 복사했습니다.";
			} catch {
				s.value = "JSON을 복사하지 못했습니다.";
			}
			globalThis.clearTimeout(f), f = globalThis.setTimeout(() => {
				s.value = "";
			}, 2400);
		}
		async function D(e) {
			try {
				await globalThis.navigator.clipboard.writeText(e), s.value = `${e} 경로를 복사했습니다.`;
			} catch {
				s.value = "경로를 복사하지 못했습니다.";
			}
			globalThis.clearTimeout(f), f = globalThis.setTimeout(() => {
				s.value = "";
			}, 2400);
		}
		function O() {
			let e = new Blob([`${_.value}\n`], { type: "application/json;charset=utf-8" }), t = URL.createObjectURL(e), r = globalThis.document.createElement("a");
			r.href = t, r.download = jC(n.layout), r.click(), URL.revokeObjectURL(t);
		}
		return Fr(a, () => {
			o.value = "";
		}), ws(async () => {
			d = globalThis.document.activeElement, await hr(), i.value && !i.value.open && i.value.showModal();
		}), Ds(() => {
			globalThis.clearTimeout(f), i.value?.open && i.value.close();
		}), (t, n) => (V(), H("dialog", {
			ref_key: "dialog",
			ref: i,
			class: "json-snapshot-dialog",
			"aria-labelledby": "json-snapshot-dialog-title",
			onClick: T,
			onCancel: Lu(C, ["prevent"]),
			onClose: w
		}, [U("section", BC, [
			U("header", null, [U("div", null, [n[5] ||= U("strong", { id: "json-snapshot-dialog-title" }, "Layout Preset 저장 JSON", -1), U("small", null, L(e.layout.name) + " · " + L(e.layout.layoutKey), 1)]), U("button", {
				class: "tiny-button",
				type: "button",
				"aria-label": "저장 JSON 모달 닫기",
				onClick: C
			}, "닫기")]),
			U("div", VC, [
				U("span", null, L(e.section.status), 1),
				e.layout.isDefault ? (V(), H("span", HC, "기본")) : G("", !0),
				e.aiSelectable ? (V(), H("span", UC, "AI 선택 후보")) : G("", !0),
				U("small", null, "마지막 저장: " + L(e.layout.updatedAt || "기록 없음"), 1)
			]),
			U("nav", WC, [(V(!0), H(K, null, B(Zt(p), (e) => (V(), H("button", {
				key: e.key,
				type: "button",
				class: g({ active: a.value === e.key }),
				"aria-pressed": a.value === e.key,
				onClick: (t) => a.value = e.key
			}, L(e.label), 11, GC))), 128))]),
			U("div", KC, [
				U("label", null, [n[6] ||= U("span", { class: "sr-only" }, "JSON 경로 또는 값 검색", -1), z(U("input", {
					"onUpdate:modelValue": n[0] ||= (e) => o.value = e,
					type: "search",
					placeholder: "경로 또는 값 검색"
				}, null, 512), [[J, o.value]])]),
				y.value ? (V(), H("small", qC, "일치하는 줄 " + L(b.value) + "개", 1)) : G("", !0),
				U("div", null, [
					U("button", {
						class: "tiny-button",
						type: "button",
						"aria-pressed": c.value === "tree",
						onClick: n[1] ||= (e) => c.value = "tree"
					}, "트리 보기", 8, JC),
					U("button", {
						class: "tiny-button",
						type: "button",
						"aria-pressed": c.value === "code",
						onClick: n[2] ||= (e) => c.value = "code"
					}, "코드 보기", 8, YC),
					c.value === "tree" ? (V(), H("button", {
						key: 0,
						class: "tiny-button",
						type: "button",
						onClick: n[3] ||= (e) => l.value += 1
					}, "모두 펼치기")) : G("", !0),
					c.value === "tree" ? (V(), H("button", {
						key: 1,
						class: "tiny-button",
						type: "button",
						onClick: n[4] ||= (e) => u.value += 1
					}, "모두 접기")) : G("", !0),
					U("button", {
						class: "tiny-button",
						type: "button",
						onClick: E
					}, "JSON 복사"),
					U("button", {
						class: "tiny-button",
						type: "button",
						onClick: O
					}, "JSON 다운로드")
				])
			]),
			c.value === "tree" ? (V(), H("ul", XC, [vc(zC, {
				value: h.value,
				query: y.value,
				"expand-revision": l.value,
				"collapse-revision": u.value,
				onCopyPath: D
			}, null, 8, [
				"value",
				"query",
				"expand-revision",
				"collapse-revision"
			])])) : (V(), H("pre", ZC, [U("code", null, [(V(!0), H(K, null, B(v.value, (e, t) => (V(), H("span", {
				key: t,
				class: g({ "is-match": y.value && e.toLocaleLowerCase().includes(y.value) })
			}, L(e) + L(t < v.value.length - 1 ? "\n" : ""), 3))), 128))])])),
			U("section", QC, [
				x.value.length ? (V(), H("strong", ew, "검증 결과: 오류 " + L(S.value.length) + "건 · 경고 " + L(ee.value.length) + "건", 1)) : (V(), H("strong", $C, "검증 결과: 정상")),
				x.value.length ? (V(), H("ul", tw, [(V(!0), H(K, null, B(x.value, (e) => (V(), H("li", {
					key: `${e.code}:${e.path}`,
					class: g(`is-${e.level}`)
				}, [U("code", null, L(e.path), 1), U("span", null, L(e.code) + " · " + L(e.message), 1)], 2))), 128))])) : G("", !0),
				s.value ? (V(), H("small", nw, L(s.value), 1)) : G("", !0),
				a.value === "full" ? (V(), H("small", rw, "aiSelectable은 Section의 허용 Layout Key를 기준으로 계산한 표시용 값입니다.")) : G("", !0)
			])
		])], 544));
	}
}, [["__scopeId", "data-v-99e83bdc"]]);
//#endregion
//#region admin-app/src/components/SectionLayoutPresetManager.vue
qh();
var aw = {
	name: "SectionLayoutPresetManager",
	components: {
		JsonSnapshotDialog: iw,
		SectionLayoutDomWorkbench: TC,
		SectionLayoutVisualEditorFrame: Oy
	},
	props: {
		section: {
			type: Object,
			required: !0
		},
		items: {
			type: Array,
			default: () => []
		},
		domWorkbenchEnabled: {
			type: Boolean,
			default: !0
		},
		legacyVisualEditorEnabled: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["section-updated"],
	data() {
		return {
			loading: !1,
			saving: !1,
			error: "",
			layouts: [],
			newPresetEditor: null,
			requestRevision: 0,
			selectedLayoutId: "",
			jsonLayoutId: ""
		};
	},
	computed: {
		editable() {
			return this.section?.status === "draft";
		},
		selectedLayout() {
			return this.layouts.find((e) => e.id === this.selectedLayoutId) || null;
		},
		jsonLayout() {
			return this.layouts.find((e) => e.id === this.jsonLayoutId) || null;
		}
	},
	watch: { "section.id": {
		immediate: !0,
		handler() {
			this.selectedLayoutId = "", this.newPresetEditor = null, this.jsonLayoutId = "", this.load();
		}
	} },
	beforeUnmount() {
		this.requestRevision += 1;
	},
	methods: {
		async load() {
			let e = ++this.requestRevision;
			this.loading = !0, this.error = "";
			try {
				let t = await Dy.list(this.section.id);
				e === this.requestRevision && (this.layouts = (t.layouts || []).map((e) => ({
					...e,
					selectionMetadata: {
						alignment: "auto",
						contentRegion: "auto",
						visualBalance: "auto",
						density: "auto",
						widthProfile: "auto",
						archetype: "auto",
						headlineCapacity: "auto",
						bodyCapacity: "auto",
						visualEmphasis: "auto",
						mediaSafeSide: "auto",
						mobileStrategy: "auto",
						ctaProminence: "auto",
						contentComplexity: "auto",
						purposeTags: [],
						selectionWeight: 1,
						avoidImmediateRepeat: !1,
						...e.selectionMetadata || {}
					}
				})), this.selectedLayoutId && !this.layouts.some((e) => e.id === this.selectedLayoutId) && (this.selectedLayoutId = ""));
			} catch (t) {
				e === this.requestRevision && (this.error = t.message);
			} finally {
				e === this.requestRevision && (this.loading = !1);
			}
		},
		startNewPreset() {
			!this.editable || this.saving || (this.error = "", this.newPresetEditor = {
				name: "",
				description: "",
				isDefault: this.layouts.length === 0,
				allowAi: this.section?.aiDesign?.enabled !== !1,
				selectionMetadata: {
					alignment: "auto",
					contentRegion: "auto",
					visualBalance: "auto",
					density: "auto",
					widthProfile: "auto",
					archetype: "auto",
					headlineCapacity: "auto",
					bodyCapacity: "auto",
					visualEmphasis: "auto",
					mediaSafeSide: "auto",
					mobileStrategy: "auto",
					ctaProminence: "auto",
					contentComplexity: "auto",
					purposeTagsText: "",
					selectionWeight: 1,
					avoidImmediateRepeat: !1
				}
			}, this.selectedLayoutId = "");
		},
		async createPreset() {
			if (!this.editable || this.saving || !this.newPresetEditor) return;
			let e = String(this.newPresetEditor.name || "").trim();
			if (!e) {
				this.error = "레이아웃 프리셋 이름을 입력해 주세요.";
				return;
			}
			this.saving = !0, this.error = "";
			let t = null, n = !1;
			try {
				let r = await Dy.create({
					sectionId: this.section.id,
					name: e,
					description: this.newPresetEditor.description || "",
					isDefault: this.newPresetEditor.isDefault,
					selectionMetadata: {
						...this.newPresetEditor.selectionMetadata,
						purposeTags: String(this.newPresetEditor.selectionMetadata.purposeTagsText || "").split(",").map((e) => e.trim()).filter(Boolean),
						purposeTagsText: void 0
					},
					changeNote: "DOM 구성 Workbench 편집을 위한 레이아웃 프리셋 생성.",
					layoutSnapshot: Ty(this.items)
				});
				n = this.newPresetEditor.allowAi, t = r.layout, await this.load(), this.selectedLayoutId = r.layout.id, this.newPresetEditor = null;
			} catch (e) {
				this.error = e.validationErrors?.[0]?.message || e.message;
			} finally {
				this.saving = !1;
			}
			t && n && await this.setAiLayoutAllowed(t, !0);
		},
		selectLayout(e) {
			this.selectedLayoutId = e.id, this.newPresetEditor = null, this.error = "";
		},
		showStoredJson(e) {
			this.jsonLayoutId = e.id;
		},
		async handleVisualEditorSaved() {
			await this.load();
		},
		async setDefault(e) {
			if (!(!this.editable || e.isDefault || this.saving)) {
				this.saving = !0, this.error = "";
				try {
					await Dy.setDefault(e.id, this.section.id), await this.load();
				} catch (e) {
					this.error = e.message;
				} finally {
					this.saving = !1;
				}
			}
		},
		async saveSelectionMetadata(e) {
			if (!(!this.editable || this.saving)) {
				this.saving = !0, this.error = "";
				try {
					await Dy.update(e.id, this.section.id, {
						selectionMetadata: {
							...e.selectionMetadata || {},
							purposeTags: Array.isArray(e.selectionMetadata?.purposeTags) ? e.selectionMetadata.purposeTags : String(e.selectionMetadata?.purposeTags || "").split(",").map((e) => e.trim()).filter(Boolean)
						},
						changeNote: "AI 레이아웃 선택 메타데이터 변경."
					}), await this.load();
				} catch (e) {
					this.error = e.validationErrors?.[0]?.message || e.message;
				} finally {
					this.saving = !1;
				}
			}
		},
		async remove(e) {
			if (!(!this.editable || this.saving)) {
				if (this.aiAllows(e)) {
					this.error = "AI 선택 후보를 먼저 해제한 뒤 레이아웃 프리셋을 삭제하세요.";
					return;
				}
				if (globalThis.confirm(`"${e.name}" 레이아웃 프리셋을 삭제할까요?`)) {
					this.saving = !0, this.error = "";
					try {
						await Dy.remove(e.id, this.section.id), await this.load(), this.selectedLayoutId === e.id && (this.selectedLayoutId = "");
					} catch (e) {
						this.error = e.message;
					} finally {
						this.saving = !1;
					}
				}
			}
		},
		aiAllows(e) {
			return (this.section.aiDesign?.allowedLayoutVariants || []).includes(e.layoutKey);
		},
		async toggleAiLayout(e) {
			return this.setAiLayoutAllowed(e, !this.aiAllows(e));
		},
		async setAiLayoutAllowed(e, t) {
			if (!this.editable || this.saving) return;
			let n = new Set(this.layouts.map((e) => e.layoutKey)), r = new Set((this.section.aiDesign?.allowedLayoutVariants || []).filter((e) => n.has(e)));
			t ? r.add(e.layoutKey) : r.delete(e.layoutKey), this.saving = !0, this.error = "";
			try {
				await Dy.updateAiLayoutVariants(this.section, [...r]), this.$emit("section-updated");
			} catch (e) {
				this.error = e.message;
			} finally {
				this.saving = !1;
			}
		}
	}
}, ow = { class: "section-layout-manager" }, sw = { class: "subsection-title" }, cw = { class: "action-row" }, lw = ["disabled"], uw = ["disabled"], dw = {
	key: 0,
	class: "empty-state compact"
}, fw = {
	key: 1,
	class: "field-error"
}, pw = {
	key: 2,
	class: "empty-state compact"
}, mw = {
	key: 3,
	class: "history-list"
}, hw = {
	key: 0,
	class: "status-active"
}, gw = {
	key: 1,
	class: "status-active"
}, _w = { class: "action-row align-right" }, vw = ["onClick"], yw = ["onClick"], bw = ["disabled", "onClick"], xw = ["disabled", "onClick"], Sw = ["disabled", "onClick"], Cw = {
	key: 0,
	class: "layout-selection-metadata"
}, ww = { class: "new-layout-preset-form" }, Tw = ["onUpdate:modelValue"], Ew = ["onUpdate:modelValue"], Dw = ["onUpdate:modelValue"], Ow = ["onUpdate:modelValue"], kw = ["onUpdate:modelValue"], Aw = ["onUpdate:modelValue"], jw = ["onUpdate:modelValue"], Mw = ["onUpdate:modelValue"], Nw = ["onUpdate:modelValue"], Pw = ["onUpdate:modelValue"], Fw = ["onUpdate:modelValue"], Iw = ["onUpdate:modelValue"], Lw = ["onUpdate:modelValue"], Rw = ["value", "onInput"], zw = ["onUpdate:modelValue"], Bw = { class: "inline-check" }, Vw = ["onUpdate:modelValue"], Hw = ["disabled", "onClick"], Uw = {
	key: 0,
	class: "empty-state compact"
}, Ww = { class: "inline-check" }, Gw = { class: "inline-check" }, Kw = ["disabled"], qw = { class: "inline-check" }, Jw = ["disabled"], Yw = { class: "action-row" }, Xw = ["disabled"], Zw = {
	key: 7,
	class: "empty-state compact"
};
function Qw(e, t, n, r, i, a) {
	let o = Ci("section-layout-dom-workbench"), s = Ci("section-layout-visual-editor-frame"), c = Ci("json-snapshot-dialog");
	return V(), H("section", ow, [
		U("div", sw, [t[27] ||= U("div", null, [U("h3", null, "레이아웃 프리셋"), U("small", null, "DOM 구성과 하나의 Live Preview에서 Desktop/Mobile 배치를 확인하고 저장합니다.")], -1), U("div", cw, [U("button", {
			class: "tiny-button",
			type: "button",
			disabled: i.loading,
			onClick: t[0] ||= (...e) => a.load && a.load(...e)
		}, "새로고침", 8, lw), U("button", {
			class: "tiny-button primary",
			type: "button",
			disabled: !a.editable || i.saving,
			onClick: t[1] ||= (...e) => a.startNewPreset && a.startNewPreset(...e)
		}, "+ 레이아웃 프리셋 추가", 8, uw)])]),
		a.editable ? G("", !0) : (V(), H("div", dw, "활성·비활성 버전의 레이아웃 프리셋은 읽기 전용입니다. 초안을 만든 후 편집하세요.")),
		i.error ? (V(), H("div", fw, L(i.error), 1)) : G("", !0),
		i.loading ? (V(), H("div", pw, "레이아웃 프리셋을 불러오는 중...")) : (V(), H("div", mw, [(V(!0), H(K, null, B(i.layouts, (e) => (V(), H("div", {
			key: e.id,
			class: "history-item section-layout-row"
		}, [
			U("div", null, [U("strong", null, [
				W(L(e.name) + " ", 1),
				e.isDefault ? (V(), H("em", hw, "기본")) : G("", !0),
				a.aiAllows(e) ? (V(), H("em", gw, "AI 선택 후보")) : G("", !0)
			]), U("span", null, L(e.layoutKey) + " · " + L(e.description || "설명 없음"), 1)]),
			U("div", _w, [
				U("button", {
					class: "tiny-button",
					type: "button",
					onClick: (t) => a.selectLayout(e)
				}, L(a.editable ? "DOM 구성 편집" : "DOM 구성 보기"), 9, vw),
				U("button", {
					class: "tiny-button",
					type: "button",
					"aria-haspopup": "dialog",
					onClick: (t) => a.showStoredJson(e)
				}, "저장 JSON", 8, yw),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: !a.editable || i.saving || e.isDefault,
					onClick: (t) => a.setDefault(e)
				}, "기본 지정", 8, bw),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: !a.editable || i.saving,
					onClick: (t) => a.toggleAiLayout(e)
				}, L(a.aiAllows(e) ? "AI 후보 해제" : "AI 선택 후보로 지정"), 9, xw),
				U("button", {
					class: "tiny-button danger",
					type: "button",
					disabled: !a.editable || i.saving || a.aiAllows(e),
					onClick: (t) => a.remove(e)
				}, "삭제", 8, Sw)
			]),
			a.editable ? (V(), H("details", Cw, [t[57] ||= U("summary", null, "AI 선택 기준", -1), U("div", ww, [
				U("label", null, [t[29] ||= U("span", null, "콘텐츠 정렬", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.alignment = t }, [...t[28] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"stretch\" data-v-5d03fa39>전체 폭</option>", 5)]], 8, Tw), [[Y, e.selectionMetadata.alignment]])]),
				U("label", null, [t[31] ||= U("span", null, "콘텐츠 영역", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.contentRegion = t }, [...t[30] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"top-left\" data-v-5d03fa39>왼쪽 상단</option><option value=\"top-center\" data-v-5d03fa39>중앙 상단</option><option value=\"top-right\" data-v-5d03fa39>오른쪽 상단</option><option value=\"center-left\" data-v-5d03fa39>왼쪽 중앙</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"center-right\" data-v-5d03fa39>오른쪽 중앙</option><option value=\"bottom-left\" data-v-5d03fa39>왼쪽 하단</option><option value=\"bottom-center\" data-v-5d03fa39>중앙 하단</option><option value=\"bottom-right\" data-v-5d03fa39>오른쪽 하단</option>", 10)]], 8, Ew), [[Y, e.selectionMetadata.contentRegion]])]),
				U("label", null, [t[33] ||= U("span", null, "비주얼 균형", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.visualBalance = t }, [...t[32] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"media-left\" data-v-5d03fa39>이미지 왼쪽</option><option value=\"media-center\" data-v-5d03fa39>이미지 중앙</option><option value=\"media-right\" data-v-5d03fa39>이미지 오른쪽</option><option value=\"full-background\" data-v-5d03fa39>전체 배경</option>", 5)]], 8, Dw), [[Y, e.selectionMetadata.visualBalance]])]),
				U("label", null, [t[35] ||= U("span", null, "밀도", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.density = t }, [...t[34] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "compact" }, "간결", -1),
					U("option", { value: "standard" }, "기본", -1),
					U("option", { value: "spacious" }, "여유", -1)
				]], 8, Ow), [[Y, e.selectionMetadata.density]])]),
				U("label", null, [t[37] ||= U("span", null, "텍스트 폭", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.widthProfile = t }, [...t[36] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"compact\" data-v-5d03fa39>좁게</option><option value=\"balanced\" data-v-5d03fa39>균형</option><option value=\"wide\" data-v-5d03fa39>넓게</option><option value=\"full\" data-v-5d03fa39>전체 폭</option>", 5)]], 8, kw), [[Y, e.selectionMetadata.widthProfile]])]),
				U("label", null, [t[39] ||= U("span", null, "구성 유형", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.archetype = t }, [...t[38] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"minimal\" data-v-5d03fa39>미니멀</option><option value=\"editorial-split\" data-v-5d03fa39>에디토리얼 분할</option><option value=\"media-led\" data-v-5d03fa39>미디어 중심</option><option value=\"full-bleed\" data-v-5d03fa39>풀 블리드</option><option value=\"overlap\" data-v-5d03fa39>오버랩</option><option value=\"card-grid\" data-v-5d03fa39>카드 그리드</option><option value=\"feature-list\" data-v-5d03fa39>기능 목록</option><option value=\"comparison\" data-v-5d03fa39>비교</option><option value=\"cta-focused\" data-v-5d03fa39>CTA 중심</option>", 10)]], 8, Aw), [[Y, e.selectionMetadata.archetype]])]),
				U("label", null, [t[41] ||= U("span", null, "제목 수용량", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.headlineCapacity = t }, [...t[40] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "short" }, "짧음", -1),
					U("option", { value: "medium" }, "보통", -1),
					U("option", { value: "long" }, "김", -1)
				]], 8, jw), [[Y, e.selectionMetadata.headlineCapacity]])]),
				U("label", null, [t[43] ||= U("span", null, "본문 수용량", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.bodyCapacity = t }, [...t[42] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "short" }, "짧음", -1),
					U("option", { value: "medium" }, "보통", -1),
					U("option", { value: "long" }, "김", -1)
				]], 8, Mw), [[Y, e.selectionMetadata.bodyCapacity]])]),
				U("label", null, [t[45] ||= U("span", null, "비주얼 강조", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.visualEmphasis = t }, [...t[44] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "copy-led" }, "카피 중심", -1),
					U("option", { value: "balanced" }, "균형", -1),
					U("option", { value: "media-led" }, "미디어 중심", -1)
				]], 8, Nw), [[Y, e.selectionMetadata.visualEmphasis]])]),
				U("label", null, [t[47] ||= U("span", null, "미디어 안전영역", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.mediaSafeSide = t }, [...t[46] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"either\" data-v-5d03fa39>양쪽</option><option value=\"none\" data-v-5d03fa39>없음</option>", 6)]], 8, Pw), [[Y, e.selectionMetadata.mediaSafeSide]])]),
				U("label", null, [t[49] ||= U("span", null, "모바일 전략", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.mobileStrategy = t }, [...t[48] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"preserve\" data-v-5d03fa39>구성 유지</option><option value=\"copy-first\" data-v-5d03fa39>카피 우선</option><option value=\"media-first\" data-v-5d03fa39>미디어 우선</option><option value=\"media-after-copy\" data-v-5d03fa39>카피 다음 미디어</option><option value=\"stack\" data-v-5d03fa39>순차 적층</option><option value=\"hide-supporting-media\" data-v-5d03fa39>보조 미디어 숨김</option>", 7)]], 8, Fw), [[Y, e.selectionMetadata.mobileStrategy]])]),
				U("label", null, [t[51] ||= U("span", null, "CTA 강조", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.ctaProminence = t }, [...t[50] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "low" }, "낮음", -1),
					U("option", { value: "medium" }, "보통", -1),
					U("option", { value: "high" }, "높음", -1)
				]], 8, Iw), [[Y, e.selectionMetadata.ctaProminence]])]),
				U("label", null, [t[53] ||= U("span", null, "콘텐츠 복잡도", -1), z(U("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.contentComplexity = t }, [...t[52] ||= [
					U("option", { value: "auto" }, "자동", -1),
					U("option", { value: "low" }, "낮음", -1),
					U("option", { value: "medium" }, "보통", -1),
					U("option", { value: "high" }, "높음", -1)
				]], 8, Lw), [[Y, e.selectionMetadata.contentComplexity]])]),
				U("label", null, [t[54] ||= U("span", null, "권장 용도", -1), U("input", {
					value: (e.selectionMetadata.purposeTags || []).join(", "),
					onInput: (t) => e.selectionMetadata.purposeTags = t.target.value.split(",").map((e) => e.trim()).filter(Boolean),
					placeholder: "event, brand-intro"
				}, null, 40, Rw)]),
				U("label", null, [t[55] ||= U("span", null, "선택 가중치", -1), z(U("input", {
					"onUpdate:modelValue": (t) => e.selectionMetadata.selectionWeight = t,
					type: "number",
					min: "0.1",
					max: "10",
					step: "0.1"
				}, null, 8, zw), [[
					J,
					e.selectionMetadata.selectionWeight,
					void 0,
					{ number: !0 }
				]])]),
				U("label", Bw, [z(U("input", {
					"onUpdate:modelValue": (t) => e.selectionMetadata.avoidImmediateRepeat = t,
					type: "checkbox"
				}, null, 8, Vw), [[Mu, e.selectionMetadata.avoidImmediateRepeat]]), t[56] ||= U("span", null, "연속 선택 지양", -1)]),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: i.saving,
					onClick: (t) => a.saveSelectionMetadata(e)
				}, "선택 기준 저장", 8, Hw)
			])])) : G("", !0)
		]))), 128)), i.layouts.length ? G("", !0) : (V(), H("div", Uw, "등록된 레이아웃 프리셋이 없습니다. 기존 자동 배치가 계속 사용됩니다."))])),
		i.newPresetEditor ? (V(), H("form", {
			key: 4,
			class: "new-layout-preset-form",
			onSubmit: t[23] ||= Lu((...e) => a.createPreset && a.createPreset(...e), ["prevent"])
		}, [
			U("label", null, [t[58] ||= U("span", null, "프리셋 이름", -1), z(U("input", {
				"onUpdate:modelValue": t[2] ||= (e) => i.newPresetEditor.name = e,
				required: ""
			}, null, 512), [[J, i.newPresetEditor.name]])]),
			U("label", null, [t[59] ||= U("span", null, "설명", -1), z(U("input", { "onUpdate:modelValue": t[3] ||= (e) => i.newPresetEditor.description = e }, null, 512), [[J, i.newPresetEditor.description]])]),
			U("label", null, [t[61] ||= U("span", null, "콘텐츠 정렬", -1), z(U("select", { "onUpdate:modelValue": t[4] ||= (e) => i.newPresetEditor.selectionMetadata.alignment = e }, [...t[60] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"stretch\" data-v-5d03fa39>전체 폭</option>", 5)]], 512), [[Y, i.newPresetEditor.selectionMetadata.alignment]])]),
			U("label", null, [t[63] ||= U("span", null, "콘텐츠 영역", -1), z(U("select", { "onUpdate:modelValue": t[5] ||= (e) => i.newPresetEditor.selectionMetadata.contentRegion = e }, [...t[62] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"top-left\" data-v-5d03fa39>왼쪽 상단</option><option value=\"top-center\" data-v-5d03fa39>중앙 상단</option><option value=\"top-right\" data-v-5d03fa39>오른쪽 상단</option><option value=\"center-left\" data-v-5d03fa39>왼쪽 중앙</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"center-right\" data-v-5d03fa39>오른쪽 중앙</option><option value=\"bottom-left\" data-v-5d03fa39>왼쪽 하단</option><option value=\"bottom-center\" data-v-5d03fa39>중앙 하단</option><option value=\"bottom-right\" data-v-5d03fa39>오른쪽 하단</option>", 10)]], 512), [[Y, i.newPresetEditor.selectionMetadata.contentRegion]])]),
			U("label", null, [t[65] ||= U("span", null, "비주얼 균형", -1), z(U("select", { "onUpdate:modelValue": t[6] ||= (e) => i.newPresetEditor.selectionMetadata.visualBalance = e }, [...t[64] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"media-left\" data-v-5d03fa39>이미지 왼쪽</option><option value=\"media-center\" data-v-5d03fa39>이미지 중앙</option><option value=\"media-right\" data-v-5d03fa39>이미지 오른쪽</option><option value=\"full-background\" data-v-5d03fa39>전체 배경</option>", 5)]], 512), [[Y, i.newPresetEditor.selectionMetadata.visualBalance]])]),
			U("label", null, [t[67] ||= U("span", null, "밀도", -1), z(U("select", { "onUpdate:modelValue": t[7] ||= (e) => i.newPresetEditor.selectionMetadata.density = e }, [...t[66] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "compact" }, "간결", -1),
				U("option", { value: "standard" }, "기본", -1),
				U("option", { value: "spacious" }, "여유", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.density]])]),
			U("label", null, [t[69] ||= U("span", null, "텍스트 폭", -1), z(U("select", { "onUpdate:modelValue": t[8] ||= (e) => i.newPresetEditor.selectionMetadata.widthProfile = e }, [...t[68] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"compact\" data-v-5d03fa39>좁게</option><option value=\"balanced\" data-v-5d03fa39>균형</option><option value=\"wide\" data-v-5d03fa39>넓게</option><option value=\"full\" data-v-5d03fa39>전체 폭</option>", 5)]], 512), [[Y, i.newPresetEditor.selectionMetadata.widthProfile]])]),
			U("label", null, [t[71] ||= U("span", null, "구성 유형", -1), z(U("select", { "onUpdate:modelValue": t[9] ||= (e) => i.newPresetEditor.selectionMetadata.archetype = e }, [...t[70] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"minimal\" data-v-5d03fa39>미니멀</option><option value=\"editorial-split\" data-v-5d03fa39>에디토리얼 분할</option><option value=\"media-led\" data-v-5d03fa39>미디어 중심</option><option value=\"full-bleed\" data-v-5d03fa39>풀 블리드</option><option value=\"overlap\" data-v-5d03fa39>오버랩</option><option value=\"card-grid\" data-v-5d03fa39>카드 그리드</option><option value=\"feature-list\" data-v-5d03fa39>기능 목록</option><option value=\"comparison\" data-v-5d03fa39>비교</option><option value=\"cta-focused\" data-v-5d03fa39>CTA 중심</option>", 10)]], 512), [[Y, i.newPresetEditor.selectionMetadata.archetype]])]),
			U("label", null, [t[73] ||= U("span", null, "제목 수용량", -1), z(U("select", { "onUpdate:modelValue": t[10] ||= (e) => i.newPresetEditor.selectionMetadata.headlineCapacity = e }, [...t[72] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "short" }, "짧음", -1),
				U("option", { value: "medium" }, "보통", -1),
				U("option", { value: "long" }, "김", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.headlineCapacity]])]),
			U("label", null, [t[75] ||= U("span", null, "본문 수용량", -1), z(U("select", { "onUpdate:modelValue": t[11] ||= (e) => i.newPresetEditor.selectionMetadata.bodyCapacity = e }, [...t[74] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "short" }, "짧음", -1),
				U("option", { value: "medium" }, "보통", -1),
				U("option", { value: "long" }, "김", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.bodyCapacity]])]),
			U("label", null, [t[77] ||= U("span", null, "비주얼 강조", -1), z(U("select", { "onUpdate:modelValue": t[12] ||= (e) => i.newPresetEditor.selectionMetadata.visualEmphasis = e }, [...t[76] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "copy-led" }, "카피 중심", -1),
				U("option", { value: "balanced" }, "균형", -1),
				U("option", { value: "media-led" }, "미디어 중심", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.visualEmphasis]])]),
			U("label", null, [t[79] ||= U("span", null, "미디어 안전영역", -1), z(U("select", { "onUpdate:modelValue": t[13] ||= (e) => i.newPresetEditor.selectionMetadata.mediaSafeSide = e }, [...t[78] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"either\" data-v-5d03fa39>양쪽</option><option value=\"none\" data-v-5d03fa39>없음</option>", 6)]], 512), [[Y, i.newPresetEditor.selectionMetadata.mediaSafeSide]])]),
			U("label", null, [t[81] ||= U("span", null, "모바일 전략", -1), z(U("select", { "onUpdate:modelValue": t[14] ||= (e) => i.newPresetEditor.selectionMetadata.mobileStrategy = e }, [...t[80] ||= [to("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"preserve\" data-v-5d03fa39>구성 유지</option><option value=\"copy-first\" data-v-5d03fa39>카피 우선</option><option value=\"media-first\" data-v-5d03fa39>미디어 우선</option><option value=\"media-after-copy\" data-v-5d03fa39>카피 다음 미디어</option><option value=\"stack\" data-v-5d03fa39>순차 적층</option><option value=\"hide-supporting-media\" data-v-5d03fa39>보조 미디어 숨김</option>", 7)]], 512), [[Y, i.newPresetEditor.selectionMetadata.mobileStrategy]])]),
			U("label", null, [t[83] ||= U("span", null, "CTA 강조", -1), z(U("select", { "onUpdate:modelValue": t[15] ||= (e) => i.newPresetEditor.selectionMetadata.ctaProminence = e }, [...t[82] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "low" }, "낮음", -1),
				U("option", { value: "medium" }, "보통", -1),
				U("option", { value: "high" }, "높음", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.ctaProminence]])]),
			U("label", null, [t[85] ||= U("span", null, "콘텐츠 복잡도", -1), z(U("select", { "onUpdate:modelValue": t[16] ||= (e) => i.newPresetEditor.selectionMetadata.contentComplexity = e }, [...t[84] ||= [
				U("option", { value: "auto" }, "자동", -1),
				U("option", { value: "low" }, "낮음", -1),
				U("option", { value: "medium" }, "보통", -1),
				U("option", { value: "high" }, "높음", -1)
			]], 512), [[Y, i.newPresetEditor.selectionMetadata.contentComplexity]])]),
			U("label", null, [t[86] ||= U("span", null, "권장 용도", -1), z(U("input", {
				"onUpdate:modelValue": t[17] ||= (e) => i.newPresetEditor.selectionMetadata.purposeTagsText = e,
				placeholder: "event, brand-intro"
			}, null, 512), [[J, i.newPresetEditor.selectionMetadata.purposeTagsText]])]),
			U("label", null, [t[87] ||= U("span", null, "선택 가중치", -1), z(U("input", {
				"onUpdate:modelValue": t[18] ||= (e) => i.newPresetEditor.selectionMetadata.selectionWeight = e,
				type: "number",
				min: "0.1",
				max: "10",
				step: "0.1"
			}, null, 512), [[
				J,
				i.newPresetEditor.selectionMetadata.selectionWeight,
				void 0,
				{ number: !0 }
			]])]),
			U("label", Ww, [z(U("input", {
				"onUpdate:modelValue": t[19] ||= (e) => i.newPresetEditor.selectionMetadata.avoidImmediateRepeat = e,
				type: "checkbox"
			}, null, 512), [[Mu, i.newPresetEditor.selectionMetadata.avoidImmediateRepeat]]), t[88] ||= U("span", null, "연속 선택 지양", -1)]),
			U("label", Gw, [z(U("input", {
				"onUpdate:modelValue": t[20] ||= (e) => i.newPresetEditor.isDefault = e,
				type: "checkbox",
				disabled: !i.layouts.length
			}, null, 8, Kw), [[Mu, i.newPresetEditor.isDefault]]), t[89] ||= U("span", null, "기본 프리셋", -1)]),
			U("label", qw, [z(U("input", {
				"onUpdate:modelValue": t[21] ||= (e) => i.newPresetEditor.allowAi = e,
				type: "checkbox",
				disabled: n.section.aiDesign?.enabled === !1
			}, null, 8, Jw), [[Mu, i.newPresetEditor.allowAi]]), t[90] ||= U("span", null, "AI 선택 후보", -1)]),
			U("div", Yw, [U("button", {
				class: "tiny-button",
				type: "button",
				onClick: t[22] ||= (e) => i.newPresetEditor = null
			}, "취소"), U("button", {
				class: "tiny-button primary",
				type: "submit",
				disabled: i.saving
			}, L(i.saving ? "생성 중…" : "프리셋 만들고 DOM 구성 열기"), 9, Xw)])
		], 32)) : G("", !0),
		a.selectedLayout && n.domWorkbenchEnabled ? (V(), Ja(o, {
			key: 5,
			section: n.section,
			layout: a.selectedLayout,
			items: n.items,
			onSaved: a.handleVisualEditorSaved,
			onClose: t[24] ||= (e) => i.selectedLayoutId = ""
		}, null, 8, [
			"section",
			"layout",
			"items",
			"onSaved"
		])) : a.selectedLayout && n.legacyVisualEditorEnabled ? (V(), Ja(s, {
			key: 6,
			section: n.section,
			layout: a.selectedLayout,
			onSaved: a.handleVisualEditorSaved,
			onClose: t[25] ||= (e) => i.selectedLayoutId = ""
		}, null, 8, [
			"section",
			"layout",
			"onSaved"
		])) : a.selectedLayout ? (V(), H("div", Zw, " 관리자 DOM 구성 Workbench가 비활성화되어 있습니다. 기능 설정을 확인해 주세요. ")) : G("", !0),
		a.jsonLayout ? (V(), Ja(c, {
			key: 8,
			layout: a.jsonLayout,
			section: n.section,
			items: n.items,
			"ai-selectable": a.aiAllows(a.jsonLayout),
			onClose: t[26] ||= (e) => i.jsonLayoutId = ""
		}, null, 8, [
			"layout",
			"section",
			"items",
			"ai-selectable"
		])) : G("", !0)
	]);
}
var $w = /*#__PURE__*/ Jh(aw, [["render", Qw], ["__scopeId", "data-v-5d03fa39"]]);
//#endregion
//#region admin-app/src/components/RenderSpecNodeInspector.vue
qh();
var eT = {
	key: 0,
	class: "render-spec-node-inspector",
	"aria-label": "선택 노드 속성"
}, tT = ["value", "disabled"], nT = ["value", "disabled"], rT = { key: 0 }, iT = ["value", "disabled"], aT = ["value"], oT = { key: 1 }, sT = ["value", "disabled"], cT = ["value", "disabled"], lT = ["value", "disabled"], uT = ["value", "disabled"], dT = ["value", "disabled"], fT = { id: "render-spec-token-keys" }, pT = ["value"], mT = /*#__PURE__*/ Jh({
	__name: "RenderSpecNodeInspector",
	props: {
		selected: {
			type: Object,
			default: null
		},
		fields: {
			type: Array,
			default: () => []
		},
		tokenKeys: {
			type: Array,
			default: () => []
		},
		disabled: {
			type: Boolean,
			default: !1
		},
		rootPath: {
			type: String,
			default: "root"
		}
	},
	emits: [
		"set-node-property",
		"set-field-key",
		"set-nested"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			n("set-node-property", {
				property: e,
				value: t
			});
		}
		function i(e, t, r) {
			n("set-nested", {
				group: e,
				property: t,
				value: r
			});
		}
		return (t, a) => e.selected ? (V(), H("section", eT, [
			U("label", null, [a[9] ||= W(" 노드 유형 ", -1), U("select", {
				value: e.selected.node.nodeType,
				disabled: e.disabled || e.selected.path === e.rootPath,
				onChange: a[0] ||= (e) => r("nodeType", e.target.value)
			}, [...a[8] ||= [U("option", { value: "element" }, "그룹", -1), U("option", { value: "field" }, "필드", -1)]], 40, tT)]),
			U("label", null, [a[10] ||= W(" 태그 ", -1), U("select", {
				value: e.selected.node.tag,
				disabled: e.disabled,
				onChange: a[1] ||= (e) => r("tag", e.target.value)
			}, [(V(), H(K, null, B([
				"div",
				"section",
				"article",
				"header",
				"footer",
				"h1",
				"h2",
				"h3",
				"p",
				"span",
				"strong",
				"small",
				"img",
				"picture",
				"a",
				"button",
				"ul",
				"ol",
				"li"
			], (e) => U("option", { key: e }, L(e), 1)), 64))], 40, nT)]),
			e.selected.node.nodeType === "field" ? (V(), H("label", rT, [a[11] ||= W(" 연결 필드 ", -1), U("select", {
				value: e.selected.node.fieldKey,
				disabled: e.disabled,
				onChange: a[2] ||= (e) => n("set-field-key", e.target.value)
			}, [(V(!0), H(K, null, B(e.fields, (e) => (V(), H("option", {
				key: e.fieldKey,
				value: e.fieldKey
			}, L(e.name) + " · " + L(e.fieldKey), 9, aT))), 128))], 40, iT)])) : (V(), H("label", oT, [a[12] ||= W(" 의미 역할 ", -1), U("input", {
				value: e.selected.node.semanticRole || "",
				disabled: e.disabled,
				onInput: a[3] ||= (e) => r("semanticRole", e.target.value)
			}, null, 40, sT)])),
			U("label", null, [a[14] ||= W(" 배치 ", -1), U("select", {
				value: e.selected.node.layout?.display || "",
				disabled: e.disabled,
				onChange: a[4] ||= (e) => i("layout", "display", e.target.value)
			}, [...a[13] ||= [
				U("option", { value: "" }, "기본", -1),
				U("option", { value: "block" }, "Block", -1),
				U("option", { value: "flex" }, "Flex", -1),
				U("option", { value: "grid" }, "Grid", -1)
			]], 40, cT)]),
			U("label", null, [a[15] ||= W(" 열 수 ", -1), U("input", {
				type: "number",
				min: "1",
				max: "12",
				value: e.selected.node.layout?.columns || "",
				disabled: e.disabled,
				onInput: a[5] ||= (e) => i("layout", "columns", Number(e.target.value) || "")
			}, null, 40, lT)]),
			U("label", null, [a[16] ||= W(" 글자색 토큰 ", -1), U("input", {
				list: "render-spec-token-keys",
				value: e.selected.node.tokenBindings?.color || "",
				disabled: e.disabled,
				onChange: a[6] ||= (e) => i("tokenBindings", "color", e.target.value)
			}, null, 40, uT)]),
			U("label", null, [a[17] ||= W(" 배경색 토큰 ", -1), U("input", {
				list: "render-spec-token-keys",
				value: e.selected.node.tokenBindings?.backgroundColor || "",
				disabled: e.disabled,
				onChange: a[7] ||= (e) => i("tokenBindings", "backgroundColor", e.target.value)
			}, null, 40, dT)]),
			U("datalist", fT, [(V(!0), H(K, null, B(e.tokenKeys, (e) => (V(), H("option", {
				key: e,
				value: e
			}, null, 8, pT))), 128))])
		])) : G("", !0);
	}
}, [["__scopeId", "data-v-585b6a8f"]]);
//#endregion
//#region admin-app/src/components/RenderSpecEditor.vue
qh();
var hT = { class: "rs-editor" }, gT = { class: "rs-toolbar" }, _T = ["disabled"], vT = ["disabled"], yT = ["disabled"], bT = ["disabled"], xT = ["disabled"], ST = ["disabled"], CT = ["disabled"], wT = {
	key: 0,
	class: "rs-empty"
}, TT = {
	key: 1,
	class: "rs-grid"
}, ET = { key: 0 }, DT = {
	key: 3,
	class: "rs-debug"
}, OT = ["disabled"], kT = { key: 0 }, AT = ["disabled"], jT = /*#__PURE__*/ Jh({
	__name: "RenderSpecEditor",
	props: {
		modelValue: {
			type: Object,
			default: null
		},
		fields: {
			type: Array,
			default: () => []
		},
		disabled: {
			type: Boolean,
			default: !1
		},
		sourceImageUrl: {
			type: String,
			default: ""
		}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R("root"), a = /* @__PURE__ */ R("desktop"), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(""), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R([]), d = q(() => n.modelValue || null), f = q(() => {
			let e = [], t = (n, r, i) => {
				n && (e.push({
					node: n,
					path: r,
					depth: i,
					label: n.fieldKey || n.semanticRole || n.tag
				}), (n.children || []).forEach((e, n) => t(e, `${r}.children.${n}`, i + 1)));
			};
			return t(d.value?.root, "root", 0), e;
		}), p = q(() => f.value.find((e) => e.path === i.value) || f.value[0] || null), m = q(() => ({ fields: Object.fromEntries(n.fields.map((e) => e.fieldKind === "image" ? [e.fieldKey, {
			value: n.sourceImageUrl,
			alt: e.name || "미리보기 이미지"
		}] : e.fieldKind === "cta" ? [e.fieldKey, {
			label: e.defaultValue || e.name || "자세히 보기",
			link: "#"
		}] : [e.fieldKey, e.defaultValue || (e.textType === "title" ? "프로모션 제목 미리보기" : `${e.name || "텍스트"} 내용 미리보기`)])) }));
		Fr(() => n.modelValue, (e) => {
			c.value = e ? JSON.stringify(e, null, 2) : "";
		}, {
			immediate: !0,
			deep: !0
		});
		function h(e) {
			return JSON.parse(JSON.stringify(e));
		}
		function _(e) {
			return e.fieldKind === "image" ? "img" : e.fieldKind === "cta" ? "a" : e.textType === "title" ? "h2" : "p";
		}
		function v() {
			!n.fields.length || n.fields.some((e) => !e.fieldKey) || (y({
				contractVersion: 1,
				root: {
					nodeType: "element",
					tag: "article",
					semanticRole: "component",
					layout: {
						display: "grid",
						columns: 1,
						overflow: "hidden"
					},
					children: n.fields.map((e) => ({
						nodeType: "field",
						tag: _(e),
						fieldKey: e.fieldKey
					}))
				},
				responsive: { mobile: { "root.layout.columns": 1 } },
				accessibility: {}
			}), i.value = "root");
		}
		function y(e) {
			r("update:modelValue", e), o.value = null;
		}
		function b(e) {
			let t = h(d.value);
			e(t), y(t);
		}
		function x(e, t) {
			return t.split(".children.").slice(1).reduce((e, t) => e?.children?.[Number(t)], e);
		}
		function S(e) {
			b((t) => e(x(t.root, i.value)));
		}
		function ee(e) {
			if (!p.value) return;
			let t = n.fields.find((e) => e.fieldKey) || null;
			S((n) => {
				n.children ||= [], n.children.push(e === "field" && t ? {
					nodeType: "field",
					tag: _(t),
					fieldKey: t.fieldKey
				} : {
					nodeType: "element",
					tag: "div",
					semanticRole: "group",
					layout: { display: "block" },
					children: []
				});
			});
		}
		function C() {
			if (i.value === "root") return;
			let e = i.value.split(".children."), t = Number(e.pop()), n = e.join(".children.");
			b((e) => x(e.root, n).children.splice(t, 1)), i.value = n;
		}
		function w(e) {
			if (i.value === "root") return;
			let t = i.value.split(".children."), n = Number(t.pop()), r = t.join(".children.");
			b((t) => {
				let i = x(t.root, r).children, a = n + e;
				a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
			}), i.value = `${r}.children.${Math.max(0, n + e)}`;
		}
		function T(e) {
			let t = f.value.find((t) => t.node.fieldKey === e.fieldKey);
			t && (i.value = t.path);
		}
		function E(e) {
			e.path ? i.value = e.path : e.fieldKey && T(e);
		}
		function D(e) {
			let t = n.fields.find((t) => t.fieldKey === e);
			S((n) => {
				n.fieldKey = e, n.tag = _(t);
			});
		}
		function O(e, t, n) {
			S((r) => {
				r[e] ||= {}, n === "" || n == null ? delete r[e][t] : r[e][t] = n;
			});
		}
		function k({ property: e, value: t }) {
			S((n) => {
				n[e] = t;
			});
		}
		function te({ group: e, property: t, value: n }) {
			O(e, t, n);
		}
		async function ne() {
			if (d.value) {
				s.value = !0;
				try {
					let e = await fetch("/api/item-component-render-spec-validate", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							renderSpec: d.value,
							fields: n.fields
						})
					});
					o.value = (await e.json()).validation || null;
				} catch (e) {
					o.value = {
						ok: !1,
						errors: [{
							path: "request",
							message: e.message
						}]
					};
				} finally {
					s.value = !1;
				}
			}
		}
		function A() {
			try {
				y(JSON.parse(c.value)), l.value = "";
			} catch (e) {
				l.value = e.message;
			}
		}
		return ws(async () => {
			try {
				let e = await fetch("/api/design-token-sets?scope=public").then((e) => e.json());
				u.value = [...new Set((e.tokenSets || []).flatMap((e) => Object.keys(e.values || {})))].sort();
			} catch {}
		}), (t, n) => (V(), H("section", hT, [
			U("div", gT, [n[7] ||= U("strong", null, "DOM RenderSpec", -1), d.value ? (V(), H(K, { key: 1 }, [
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || p.value?.node?.tag === "img",
					onClick: n[0] ||= (e) => ee("element")
				}, "+ 그룹", 8, vT),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || !e.fields.length || p.value?.node?.tag === "img",
					onClick: n[1] ||= (e) => ee("field")
				}, "+ 필드", 8, yT),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: n[2] ||= (e) => w(-1)
				}, "위", 8, bT),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: n[3] ||= (e) => w(1)
				}, "아래", 8, xT),
				U("button", {
					class: "tiny-button danger",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: C
				}, "삭제", 8, ST),
				U("button", {
					class: "tiny-button primary",
					type: "button",
					disabled: s.value,
					onClick: ne
				}, L(s.value ? "검증 중" : "검증"), 9, CT)
			], 64)) : (V(), H("button", {
				key: 0,
				class: "tiny-button primary",
				type: "button",
				disabled: e.disabled || e.fields.some((e) => !e.fieldKey),
				onClick: v
			}, "기본 DOM 생성", 8, _T))]),
			d.value ? (V(), H("div", TT, [
				vc(rC, {
					nodes: f.value,
					"selected-path": i.value,
					onSelect: n[4] ||= (e) => i.value = e
				}, null, 8, ["nodes", "selected-path"]),
				vc(mT, {
					selected: p.value,
					fields: e.fields,
					"token-keys": u.value,
					disabled: e.disabled,
					onSetNodeProperty: k,
					onSetFieldKey: D,
					onSetNested: te
				}, null, 8, [
					"selected",
					"fields",
					"token-keys",
					"disabled"
				]),
				vc(cC, {
					modelValue: a.value,
					"onUpdate:modelValue": n[5] ||= (e) => a.value = e,
					mode: "component",
					"selected-node-key": i.value,
					title: "Component Live Preview",
					onSelectNode: E
				}, {
					default: Dr(({ viewport: t }) => [vc(Sb, {
						"render-spec": d.value,
						fields: e.fields,
						value: m.value,
						viewport: t,
						editable: "",
						onSelectField: T
					}, null, 8, [
						"render-spec",
						"fields",
						"value",
						"viewport"
					])]),
					_: 1
				}, 8, ["modelValue", "selected-node-key"])
			])) : (V(), H("p", wT, "서버가 생성한 필드 키가 있는 초안에서 DOM 구조를 만들 수 있습니다.")),
			o.value ? (V(), H("div", {
				key: 2,
				class: g(["rs-validation", { ok: o.value.ok }])
			}, [U("strong", null, L(o.value.ok ? "검증 통과" : `오류 ${o.value.errors?.length || 0}건`), 1), o.value.ok ? G("", !0) : (V(), H("ul", ET, [(V(!0), H(K, null, B(o.value.errors, (e) => (V(), H("li", { key: `${e.path}:${e.code}` }, L(e.path) + " · " + L(e.message), 1))), 128))]))], 2)) : G("", !0),
			d.value ? (V(), H("details", DT, [
				n[8] ||= U("summary", null, "고급: Raw JSON", -1),
				z(U("textarea", {
					"onUpdate:modelValue": n[6] ||= (e) => c.value = e,
					rows: "14",
					disabled: e.disabled
				}, null, 8, OT), [[J, c.value]]),
				l.value ? (V(), H("p", kT, L(l.value), 1)) : G("", !0),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled,
					onClick: A
				}, "JSON 적용", 8, AT)
			])) : G("", !0)
		]));
	}
}, [["__scopeId", "data-v-0ea819a6"]]);
//#endregion
//#region admin-app/src/components/ComponentGenerationWorkspace.vue
qh();
var MT = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp"
]), NT = 10 * 1024 * 1024, PT = "promo-component-generation-active-run", FT = {
	name: "ComponentGenerationWorkspace",
	components: { RenderSpecEditor: jT },
	emits: ["notify"],
	data: () => ({
		file: null,
		sourceUrl: "",
		imageDataUrl: "",
		sourceName: "",
		sourceSize: 0,
		sourceDimensions: null,
		crop: {
			x: 0,
			y: 0,
			width: 1,
			height: 1
		},
		sourceId: "",
		sourceImageUrl: "",
		sourceError: "",
		componentIntent: "",
		selectedRoles: [],
		tokenSets: [],
		targetTokenVersionId: "",
		run: null,
		proposals: [],
		proposal: null,
		selectedProposalId: "",
		busy: !1,
		saving: !1,
		applying: !1,
		applyResults: [],
		error: "",
		viewport: "desktop",
		mobileReviewed: !1,
		pollTimer: null
	}),
	computed: {
		currentStep() {
			return this.proposal ? 4 : this.busy || this.run ? 3 : this.sourceUrl ? 2 : 1;
		},
		statusLabel() {
			return this.busy ? "AI 분석 중" : this.run?.status === "failed" ? "분석 실패" : this.proposal ? "검토 가능" : "이미지 선택 대기";
		},
		canAnalyze() {
			return !!((this.sourceId || this.imageDataUrl) && this.componentIntent.trim() && !this.busy);
		},
		cropStyle() {
			return {
				left: `${this.crop.x * 100}%`,
				top: `${this.crop.y * 100}%`,
				width: `${this.crop.width * 100}%`,
				height: `${this.crop.height * 100}%`
			};
		},
		fields() {
			return this.proposal?.componentDefinition?.fields || [];
		},
		validation() {
			return this.proposal?.validationResult || {};
		}
	},
	async mounted() {
		this.loadTokenSets();
		let e = localStorage.getItem(PT);
		e && await this.restoreRun(e);
	},
	beforeUnmount() {
		this.releaseUrl(), this.pollTimer && clearTimeout(this.pollTimer);
	},
	methods: {
		releaseUrl() {
			this.sourceUrl?.startsWith("blob:") && URL.revokeObjectURL(this.sourceUrl), this.sourceUrl = "";
		},
		async selectSource(e) {
			let t = e.target.files?.[0];
			if (this.sourceError = "", this.error = "", t) {
				if (!MT.has(t.type)) return this.rejectSource("PNG, JPEG 또는 WebP 이미지를 선택해 주세요.");
				if (t.size > NT) return this.rejectSource("이미지 크기는 10MB 이하여야 합니다.");
				this.releaseUrl(), this.file = t, this.sourceUrl = URL.createObjectURL(t), this.sourceName = t.name, this.sourceSize = t.size, this.imageDataUrl = await this.readDataUrl(t), this.sourceDimensions = await this.readDimensions(this.sourceUrl), this.sourceId = "", this.sourceImageUrl = "", this.run = null, this.proposals = [], this.proposal = null, this.selectedProposalId = "", this.crop = {
					x: 0,
					y: 0,
					width: 1,
					height: 1
				}, localStorage.removeItem(PT), this.$emit("notify", "분석할 이미지를 선택했습니다. 영역을 조정해 주세요.");
			}
		},
		rejectSource(e) {
			this.clearSource(), this.sourceError = e;
		},
		clearSource() {
			this.releaseUrl(), this.file = null, this.imageDataUrl = "", this.sourceName = "", this.sourceSize = 0, this.sourceDimensions = null, this.sourceId = "", this.sourceImageUrl = "", this.run = null, this.proposals = [], this.proposal = null, this.selectedProposalId = "", this.$refs.sourceInput && (this.$refs.sourceInput.value = ""), localStorage.removeItem(PT);
		},
		readDataUrl(e) {
			return new Promise((t, n) => {
				let r = new FileReader();
				r.onload = () => t(r.result), r.onerror = n, r.readAsDataURL(e);
			});
		},
		readDimensions(e) {
			return new Promise((t, n) => {
				let r = new Image();
				r.onload = () => t({
					width: r.naturalWidth,
					height: r.naturalHeight
				}), r.onerror = n, r.src = e;
			});
		},
		createAnalysisDataUrl() {
			return new Promise((e, t) => {
				let n = new Image();
				n.onload = () => {
					let t = Math.round(n.naturalWidth * this.crop.x), r = Math.round(n.naturalHeight * this.crop.y), i = Math.max(1, Math.round(n.naturalWidth * this.crop.width)), a = Math.max(1, Math.round(n.naturalHeight * this.crop.height)), o = Math.min(1, 2048 / Math.max(i, a)), s = document.createElement("canvas");
					s.width = Math.max(1, Math.round(i * o)), s.height = Math.max(1, Math.round(a * o)), s.getContext("2d").drawImage(n, t, r, i, a, 0, 0, s.width, s.height), e(s.toDataURL(this.file?.type === "image/jpeg" ? "image/jpeg" : "image/png", .9));
				}, n.onerror = t, n.src = this.sourceUrl;
			});
		},
		formatBytes(e) {
			return e < 1024 * 1024 ? `${Math.max(1, Math.round(e / 1024))}KB` : `${(e / 1024 / 1024).toFixed(1)}MB`;
		},
		clampCrop() {
			this.crop.x = Math.min(.98, Math.max(0, Number(this.crop.x))), this.crop.y = Math.min(.98, Math.max(0, Number(this.crop.y))), this.crop.width = Math.min(1 - this.crop.x, Math.max(.02, Number(this.crop.width))), this.crop.height = Math.min(1 - this.crop.y, Math.max(.02, Number(this.crop.height)));
		},
		async loadTokenSets() {
			try {
				let e = await fetch("/api/design-token-sets?scope=public").then((e) => e.json());
				this.tokenSets = e.tokenSets || [], this.targetTokenVersionId = this.tokenSets.find((e) => e.isDefault)?.versionId || this.tokenSets[0]?.versionId || "";
			} catch {}
		},
		async uploadSource() {
			if (this.sourceId) return this.sourceId;
			let e = await fetch("/api/component-design-sources", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					imageDataUrl: this.imageDataUrl,
					analysisImageDataUrl: await this.createAnalysisDataUrl(),
					fileName: this.sourceName,
					cropSpec: this.crop
				})
			}), t = await e.json().catch(() => ({}));
			if (!e.ok) throw Error(t.message || t.error || `이미지 업로드 오류(${e.status})`);
			return this.sourceId = t.source.id, this.sourceImageUrl = t.source.imageUrl, this.sourceId;
		},
		async analyze() {
			if (this.canAnalyze) {
				this.busy = !0, this.error = "", this.proposals = [], this.proposal = null;
				try {
					let e = await this.uploadSource(), t = await fetch("/api/component-generation-runs", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							sourceId: e,
							componentIntent: this.componentIntent,
							allowedSectionRoles: this.selectedRoles,
							targetDesignTokenSetVersionId: this.targetTokenVersionId
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw n.runId && (localStorage.setItem(PT, n.runId), await this.restoreRun(n.runId)), Error(n.message || n.error || `이미지 분석 오류(${t.status})`);
					this.setRun(n.run), this.$emit("notify", "이미지 분석과 RenderSpec 검증이 완료되었습니다.");
				} catch (e) {
					this.error = e.message, this.$emit("notify", `컴포넌트 분석 실패: ${e.message}`);
				} finally {
					this.busy = !1;
				}
			}
		},
		setRun(e) {
			this.run = e, this.proposals = e?.proposals || (e?.proposal ? [e.proposal] : []);
			let t = this.proposals.find((e) => e.id === this.selectedProposalId) || this.proposals[0] || null;
			this.proposal = t, this.selectedProposalId = t?.id || "", e?.id && localStorage.setItem(PT, e.id), e?.source?.imageUrl && (this.sourceImageUrl = e.source.imageUrl, this.sourceUrl ||= e.source.imageUrl), e?.componentIntent && (this.componentIntent = e.componentIntent), e?.allowedSectionRoles && (this.selectedRoles = e.allowedSectionRoles), e?.source?.cropSpec && (this.crop = e.source.cropSpec), [
				"queued",
				"analyzing",
				"validating"
			].includes(e?.status) && this.schedulePoll(e.id);
		},
		selectProposal(e) {
			this.selectedProposalId = e.id, this.proposal = e;
		},
		candidateRegionStyle(e) {
			let t = e?.componentDefinition?.sourceRegion || {
				x: 0,
				y: 0,
				width: 1,
				height: 1
			};
			return {
				left: `${(this.crop.x + t.x * this.crop.width) * 100}%`,
				top: `${(this.crop.y + t.y * this.crop.height) * 100}%`,
				width: `${t.width * this.crop.width * 100}%`,
				height: `${t.height * this.crop.height * 100}%`
			};
		},
		schedulePoll(e) {
			this.pollTimer && clearTimeout(this.pollTimer), this.pollTimer = setTimeout(() => this.restoreRun(e), 2e3);
		},
		async restoreRun(e) {
			try {
				let t = await fetch(`/api/component-generation-runs?id=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error();
				this.setRun(n.run);
			} catch {
				localStorage.removeItem(PT);
			}
		},
		async saveReview() {
			if (this.proposal?.id) {
				this.saving = !0, this.error = "";
				try {
					let e = await fetch(`/api/component-generation-proposals?id=${encodeURIComponent(this.proposal.id)}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							componentDefinition: this.proposal.componentDefinition,
							renderSpec: this.proposal.renderSpec
						})
					}), t = await e.json();
					if (!e.ok && !t.proposal) throw Error(t.message || "검증 저장에 실패했습니다.");
					this.proposal = {
						...this.proposal,
						...t.proposal || {}
					}, this.proposals = this.proposals.map((e) => e.id === this.proposal.id ? this.proposal : e), this.$emit("notify", this.proposal.validationResult?.ok ? "검토 내용과 검증 결과를 저장했습니다." : "검증 오류가 남아 있습니다.");
				} catch (e) {
					this.error = e.message;
				} finally {
					this.saving = !1;
				}
			}
		},
		async applySelected() {
			let e = this.proposals.filter((e) => e.componentDefinition?.selected !== !1 && !e.appliedAt && e.validationResult?.ok && e.componentDefinition?.creationMode !== "new-version").map((e) => e.id);
			if (!(!e.length || this.applying)) {
				this.applying = !0, this.error = "";
				try {
					let t = await fetch("/api/component-generation-proposals-apply", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ proposalIds: e })
					}), n = await t.json();
					if (this.applyResults = n.results || [], !t.ok && !n.succeeded) throw Error(n.message || n.error || "컴포넌트 Draft 생성에 실패했습니다.");
					await this.restoreRun(this.run.id), this.$emit("notify", `${n.succeeded || 0}개 컴포넌트 Draft를 생성했습니다.`);
				} catch (e) {
					this.error = e.message;
				} finally {
					this.applying = !1;
				}
			}
		},
		resetForNew() {
			this.clearSource(), this.componentIntent = "", this.selectedRoles = [], this.error = "";
		}
	}
}, IT = {
	class: "generation",
	"aria-labelledby": "generation-title"
}, LT = { class: "generation-header" }, RT = { class: "steps" }, zT = {
	key: 0,
	class: "work-grid"
}, BT = { class: "card" }, VT = { class: "card-title" }, HT = {
	key: 0,
	class: "dropzone"
}, UT = {
	key: 1,
	class: "crop-stage"
}, WT = ["src"], GT = {
	key: 2,
	class: "file-info"
}, KT = {
	key: 3,
	class: "error"
}, qT = {
	key: 4,
	class: "crop-controls"
}, JT = ["onUpdate:modelValue"], YT = { class: "field" }, XT = { class: "roles" }, ZT = ["value"], QT = {
	key: 5,
	class: "field"
}, $T = ["value"], eE = { class: "card readiness" }, tE = { class: "checklist" }, nE = {
	key: 0,
	class: "error"
}, rE = ["disabled"], iE = { key: 1 }, aE = { key: 2 }, oE = {
	key: 1,
	class: "result-stack"
}, sE = { class: "card candidate-panel" }, cE = { class: "card-title" }, lE = { class: "candidate-list" }, uE = ["onUpdate:modelValue", "disabled"], dE = ["onClick"], fE = { class: "card" }, pE = { class: "card-title" }, mE = { class: "confidence" }, hE = { class: "badges" }, gE = { key: 0 }, _E = { class: "field" }, vE = { class: "field" }, yE = { class: "comparison" }, bE = { class: "card" }, xE = { class: "crop-stage" }, SE = ["src"], CE = ["onClick"], wE = { class: "card" }, TE = {
	key: 0,
	class: "file-info"
}, EE = {
	key: 1,
	class: "validation-errors"
}, DE = {
	key: 2,
	class: "empty"
}, OE = { class: "comparison" }, kE = { class: "card" }, AE = { class: "field-list" }, jE = { class: "card" }, ME = {
	key: 0,
	class: "field-list"
}, NE = {
	key: 1,
	class: "empty"
}, PE = { class: "roles" }, FE = { key: 0 }, IE = {
	key: 2,
	class: "field"
}, LE = ["value"], RE = {
	key: 0,
	class: "card"
}, zE = {
	key: 1,
	class: "error"
}, BE = {
	key: 2,
	class: "field-list"
}, VE = { class: "result-actions" }, HE = ["disabled"], UE = ["disabled"], WE = { class: "mobile-check" };
function GE(e, t, n, r, i, a) {
	let o = Ci("RenderSpecEditor");
	return V(), H("section", IT, [
		U("header", LT, [t[18] ||= U("div", null, [
			U("p", { class: "eyebrow" }, "Component Generation · CDR-09"),
			U("h2", { id: "generation-title" }, "이미지에서 DOM 컴포넌트 생성"),
			U("p", null, "이미지 영역을 분석해 필드, 안전한 DOM RenderSpec과 디자인 토큰 연결을 제안합니다.")
		], -1), U("span", { class: g(["status", e.run?.status]) }, L(a.statusLabel), 3)]),
		U("ol", RT, [(V(), H(K, null, B([
			"이미지 선택",
			"영역 선택",
			"AI 분석",
			"결과 검토",
			"Draft 준비"
		], (e, t) => U("li", {
			key: e,
			class: g({
				active: a.currentStep === t + 1,
				done: a.currentStep > t + 1
			})
		}, [U("strong", null, L(t + 1), 1), U("span", null, L(e), 1)], 2)), 64))]),
		e.proposal ? (V(), H("div", oE, [
			U("section", sE, [U("div", cE, [U("div", null, [
				t[34] ||= U("span", null, "Detected components", -1),
				U("h3", null, L(e.proposals.length) + "개 컴포넌트 후보", 1),
				t[35] ||= U("p", null, "큰 이미지에서 분리된 후보를 선택해 각각의 DOM과 필드를 검토하세요.", -1)
			])]), U("div", lE, [(V(!0), H(K, null, B(e.proposals, (t, n) => (V(), H("div", {
				key: t.id,
				class: g(["candidate-row", { active: t.id === e.selectedProposalId }])
			}, [U("label", null, [z(U("input", {
				"onUpdate:modelValue": (e) => t.componentDefinition.selected = e,
				type: "checkbox",
				disabled: !!t.appliedAt
			}, null, 8, uE), [[Mu, t.componentDefinition.selected]]), U("span", null, L(t.appliedAt ? "생성됨" : "생성 선택"), 1)]), U("button", {
				type: "button",
				onClick: (e) => a.selectProposal(t)
			}, [
				U("span", null, L(n + 1), 1),
				U("strong", null, L(t.componentDefinition.name), 1),
				U("em", null, L(Math.round((t.confidence || 0) * 100)) + "%", 1)
			], 8, dE)], 2))), 128))])]),
			U("section", fE, [
				U("div", pE, [U("div", null, [
					t[36] ||= U("span", null, "Step 4", -1),
					U("h3", null, L(e.proposal.componentDefinition.name), 1),
					U("p", null, L(e.proposal.componentDefinition.description), 1)
				]), U("div", mE, [U("strong", null, L(Math.round((e.proposal.confidence || 0) * 100)) + "%", 1), t[37] ||= U("span", null, "분석 신뢰도", -1)])]),
				U("div", hE, [
					U("span", { class: g({ good: a.validation.ok }) }, L(a.validation.ok ? "RenderSpec 검증 통과" : `검증 오류 ${a.validation.errors?.length || 0}건`), 3),
					e.proposal.componentDefinition.reviewRequired ? (V(), H("span", gE, "관리자 검토 필요")) : G("", !0),
					U("span", null, L(a.fields.length) + "개 필드", 1)
				]),
				U("label", _E, [t[38] ||= U("span", null, "컴포넌트 이름", -1), z(U("input", { "onUpdate:modelValue": t[7] ||= (t) => e.proposal.componentDefinition.name = t }, null, 512), [[J, e.proposal.componentDefinition.name]])]),
				U("label", vE, [t[39] ||= U("span", null, "설명", -1), z(U("input", { "onUpdate:modelValue": t[8] ||= (t) => e.proposal.componentDefinition.description = t }, null, 512), [[J, e.proposal.componentDefinition.description]])])
			]),
			U("section", yE, [U("article", bE, [t[40] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Original"), U("h3", null, "자동 분리 영역")])], -1), U("div", xE, [U("img", {
				src: e.sourceImageUrl || e.sourceUrl,
				alt: "분석 원본"
			}, null, 8, SE), (V(!0), H(K, null, B(e.proposals, (t, n) => (V(), H("button", {
				key: t.id,
				class: g(["candidate-box", { active: t.id === e.selectedProposalId }]),
				style: p(a.candidateRegionStyle(t)),
				type: "button",
				onClick: (e) => a.selectProposal(t)
			}, [U("span", null, L(n + 1), 1)], 14, CE))), 128))])]), U("article", wE, [
				t[42] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Validation"), U("h3", null, "분석 품질 확인")])], -1),
				a.validation.metrics ? (V(), H("p", TE, "노드 " + L(a.validation.metrics.nodeCount) + " · 필드 노드 " + L(a.validation.metrics.fieldNodeCount) + " · 깊이 " + L(a.validation.metrics.maxDepth), 1)) : G("", !0),
				a.validation.errors?.length ? (V(), H("div", EE, [t[41] ||= U("strong", null, "수정할 항목", -1), (V(!0), H(K, null, B(a.validation.errors, (e) => (V(), H("p", { key: `${e.path}:${e.code}` }, L(e.path) + " · " + L(e.message), 1))), 128))])) : (V(), H("p", DE, "보안·접근성·필드 참조 검증을 통과했습니다."))
			])]),
			vc(o, {
				modelValue: e.proposal.renderSpec,
				"onUpdate:modelValue": t[9] ||= (t) => e.proposal.renderSpec = t,
				fields: a.fields,
				"source-image-url": e.sourceImageUrl || e.sourceUrl
			}, null, 8, [
				"modelValue",
				"fields",
				"source-image-url"
			]),
			U("section", OE, [U("article", kE, [t[43] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Detected fields"), U("h3", null, "콘텐츠 필드")])], -1), U("ul", AE, [(V(!0), H(K, null, B(a.fields, (e) => (V(), H("li", { key: e.fieldKey }, [U("strong", null, L(e.name), 1), U("span", null, L(e.fieldKind) + " · " + L(e.fieldKey), 1)]))), 128))])]), U("article", jE, [
				t[47] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Similarity"), U("h3", null, "유사 컴포넌트와 생성 방식")])], -1),
				e.proposal.similarComponents?.length ? (V(), H("ul", ME, [(V(!0), H(K, null, B(e.proposal.similarComponents, (e) => (V(), H("li", { key: e.componentId }, [U("strong", null, L(e.name), 1), U("span", null, "유사도 " + L(Math.round(e.score * 100)) + "% · " + L(e.score >= .75 ? "새 버전 후보" : "참고"), 1)]))), 128))])) : (V(), H("p", NE, "유사한 기존 컴포넌트가 없습니다.")),
				U("div", PE, [U("label", null, [z(U("input", {
					"onUpdate:modelValue": t[10] ||= (t) => e.proposal.componentDefinition.creationMode = t,
					type: "radio",
					value: "new-component"
				}, null, 512), [[Nu, e.proposal.componentDefinition.creationMode]]), t[44] ||= U("span", null, "새 컴포넌트", -1)]), e.proposal.similarComponents?.length ? (V(), H("label", FE, [z(U("input", {
					"onUpdate:modelValue": t[11] ||= (t) => e.proposal.componentDefinition.creationMode = t,
					type: "radio",
					value: "new-version"
				}, null, 512), [[Nu, e.proposal.componentDefinition.creationMode]]), t[45] ||= U("span", null, "기존 컴포넌트의 새 버전", -1)])) : G("", !0)]),
				e.proposal.componentDefinition.creationMode === "new-version" ? (V(), H("label", IE, [t[46] ||= U("span", null, "대상 컴포넌트", -1), z(U("select", { "onUpdate:modelValue": t[12] ||= (t) => e.proposal.componentDefinition.targetComponentId = t }, [(V(!0), H(K, null, B(e.proposal.similarComponents, (e) => (V(), H("option", {
					key: e.componentId,
					value: e.componentId
				}, L(e.name) + " · " + L(Math.round(e.score * 100)) + "%", 9, LE))), 128))], 512), [[Y, e.proposal.componentDefinition.targetComponentId]])])) : G("", !0)
			])]),
			e.proposal.reviewNotes?.length ? (V(), H("section", RE, [t[48] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Review notes"), U("h3", null, "검토 메모")])], -1), U("ul", null, [(V(!0), H(K, null, B(e.proposal.reviewNotes, (e) => (V(), H("li", { key: e }, L(e), 1))), 128))])])) : G("", !0),
			e.error ? (V(), H("p", zE, L(e.error), 1)) : G("", !0),
			e.applyResults.length ? (V(), H("ul", BE, [(V(!0), H(K, null, B(e.applyResults, (e) => (V(), H("li", { key: e.proposalId }, [U("strong", null, L(e.name || e.proposalId), 1), U("span", null, L(e.ok ? "Draft 생성 완료" : e.message), 1)]))), 128))])) : G("", !0),
			U("div", VE, [
				U("button", {
					class: "tiny-button",
					type: "button",
					onClick: t[13] ||= (...e) => a.analyze && a.analyze(...e)
				}, "같은 이미지로 다시 분석"),
				U("button", {
					class: "tiny-button",
					type: "button",
					onClick: t[14] ||= (...e) => a.resetForNew && a.resetForNew(...e)
				}, "새 이미지 분석"),
				U("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.saving,
					onClick: t[15] ||= (...e) => a.saveReview && a.saveReview(...e)
				}, L(e.saving ? "저장 중" : "현재 후보 재검증·저장"), 9, HE),
				U("button", {
					class: "tiny-button primary",
					type: "button",
					disabled: e.applying || !e.mobileReviewed || !e.proposals.some((e) => e.componentDefinition?.selected !== !1 && !e.appliedAt && e.validationResult?.ok && e.componentDefinition?.creationMode !== "new-version"),
					onClick: t[16] ||= (...e) => a.applySelected && a.applySelected(...e)
				}, L(e.applying ? "Draft 생성 중" : "선택 후보 컴포넌트 Draft 생성"), 9, UE)
			]),
			U("label", WE, [z(U("input", {
				"onUpdate:modelValue": t[17] ||= (t) => e.mobileReviewed = t,
				type: "checkbox"
			}, null, 512), [[Mu, e.mobileReviewed]]), t[49] ||= U("span", null, "Mobile 미리보기와 오버플로를 확인했습니다.", -1)]),
			t[50] ||= U("p", { class: "next-note" }, "검증을 통과한 새 컴포넌트 후보만 일괄 Draft로 생성됩니다. 기존 컴포넌트의 새 버전 후보는 충돌 방지를 위해 개별 검토가 필요합니다.", -1)
		])) : (V(), H("div", zT, [U("section", BT, [
			U("div", VT, [t[19] ||= U("div", null, [U("span", null, "Step 1–2"), U("h3", null, "분석 이미지와 영역")], -1), e.sourceUrl ? (V(), H("button", {
				key: 0,
				class: "tiny-button",
				type: "button",
				onClick: t[0] ||= (...e) => a.clearSource && a.clearSource(...e)
			}, "다시 선택")) : G("", !0)]),
			e.sourceUrl ? (V(), H("div", UT, [U("img", {
				src: e.sourceUrl,
				alt: "분석 원본"
			}, null, 8, WT), U("div", {
				class: "crop-box",
				style: p(a.cropStyle)
			}, [...t[23] ||= [U("span", null, "분석 영역", -1)]], 4)])) : (V(), H("label", HT, [
				U("input", {
					ref: "sourceInput",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: t[1] ||= (...e) => a.selectSource && a.selectSource(...e)
				}, null, 544),
				t[20] ||= U("strong", null, "디자인 이미지 선택", -1),
				t[21] ||= U("span", null, "PNG, JPEG, WebP · 최대 10MB", -1),
				t[22] ||= U("small", null, "생성할 컴포넌트가 선명하게 보이는 이미지를 권장합니다.", -1)
			])),
			e.sourceUrl ? (V(), H("p", GT, [
				W(L(e.sourceName || "기존 업로드 이미지"), 1),
				e.sourceSize ? (V(), H(K, { key: 0 }, [W(" · " + L(a.formatBytes(e.sourceSize)), 1)], 64)) : G("", !0),
				e.sourceDimensions ? (V(), H(K, { key: 1 }, [W(" · " + L(e.sourceDimensions.width) + "×" + L(e.sourceDimensions.height), 1)], 64)) : G("", !0)
			])) : G("", !0),
			e.sourceError ? (V(), H("p", KT, L(e.sourceError), 1)) : G("", !0),
			e.sourceUrl ? (V(), H("fieldset", qT, [t[24] ||= U("legend", null, "영역 좌표 (이미지 비율)", -1), (V(), H(K, null, B([
				"x",
				"y",
				"width",
				"height"
			], (n) => U("label", { key: n }, [
				U("span", null, L(n), 1),
				z(U("input", {
					"onUpdate:modelValue": (t) => e.crop[n] = t,
					type: "range",
					min: "0",
					max: "1",
					step: "0.01",
					onInput: t[2] ||= (...e) => a.clampCrop && a.clampCrop(...e)
				}, null, 40, JT), [[
					J,
					e.crop[n],
					void 0,
					{ number: !0 }
				]]),
				U("em", null, L(Math.round(e.crop[n] * 100)) + "%", 1)
			])), 64))])) : G("", !0),
			U("label", YT, [t[25] ||= U("span", null, "생성 목적", -1), z(U("textarea", {
				"onUpdate:modelValue": t[3] ||= (t) => e.componentIntent = t,
				rows: "3",
				placeholder: "예: 이미지, 제목, 설명, CTA가 포함된 프로모션 카드"
			}, null, 512), [[J, e.componentIntent]])]),
			U("fieldset", null, [t[26] ||= U("legend", null, "사용할 섹션 역할", -1), U("div", XT, [(V(), H(K, null, B([
				"header",
				"hero",
				"benefit",
				"content",
				"cta",
				"notice",
				"terms",
				"legal",
				"footer"
			], (n) => U("label", { key: n }, [z(U("input", {
				"onUpdate:modelValue": t[4] ||= (t) => e.selectedRoles = t,
				type: "checkbox",
				value: n
			}, null, 8, ZT), [[Mu, e.selectedRoles]]), U("span", null, L(n), 1)])), 64))])]),
			e.tokenSets.length ? (V(), H("label", QT, [t[27] ||= U("span", null, "대상 디자인 토큰", -1), z(U("select", { "onUpdate:modelValue": t[5] ||= (t) => e.targetTokenVersionId = t }, [(V(!0), H(K, null, B(e.tokenSets, (e) => (V(), H("option", {
				key: e.versionId,
				value: e.versionId
			}, [W(L(e.name), 1), e.isDefault ? (V(), H(K, { key: 0 }, [W(" · 기본")], 64)) : G("", !0)], 8, $T))), 128))], 512), [[Y, e.targetTokenVersionId]])])) : G("", !0)
		]), U("aside", eE, [
			t[33] ||= U("div", { class: "card-title" }, [U("div", null, [U("span", null, "Step 3"), U("h3", null, "AI 이미지 분석")])], -1),
			U("ul", tE, [
				U("li", null, [t[28] ||= U("span", null, "실제 파일 형식·크기 검증", -1), U("em", null, L(e.sourceUrl ? "준비" : "대기"), 1)]),
				U("li", null, [t[29] ||= U("span", null, "정규화 Crop 영역", -1), U("em", null, L(e.sourceUrl ? "준비" : "대기"), 1)]),
				U("li", null, [t[30] ||= U("span", null, "DOM·필드·토큰 분석", -1), U("em", null, L(e.busy ? "진행 중" : "대기"), 1)]),
				t[31] ||= U("li", null, [U("span", null, "보안·접근성 검증"), U("em", null, "자동")], -1),
				t[32] ||= U("li", null, [U("span", null, "기존 컴포넌트 유사도"), U("em", null, "자동")], -1)
			]),
			e.error ? (V(), H("p", nE, L(e.error), 1)) : G("", !0),
			U("button", {
				class: "tiny-button primary analyze",
				type: "button",
				disabled: !a.canAnalyze,
				onClick: t[6] ||= (...e) => a.analyze && a.analyze(...e)
			}, L(e.busy ? "이미지를 분석하고 있습니다…" : e.run?.status === "failed" ? "원본 업로드 없이 다시 분석" : "분석 시작"), 9, rE),
			e.busy ? (V(), H("small", iE, "프롬프트 설정과 모델에 따라 최대 3분이 걸릴 수 있습니다.")) : (V(), H("small", aE, "관리자에서 활성화한 컴포넌트 이미지 분석 프롬프트와 모델 설정을 사용합니다."))
		])]))
	]);
}
var KE = /*#__PURE__*/ Jh(FT, [["render", GE], ["__scopeId", "data-v-f0661921"]]);
//#endregion
//#region admin-app/src/components/DirectusIntegrationSettings.vue
qh();
var qE = { class: "directus-settings" }, JE = { class: "directus-settings__header" }, YE = ["disabled"], XE = { class: "directus-settings__flags" }, ZE = {
	key: 0,
	class: "directus-settings__notice"
}, QE = {
	key: 1,
	class: "outline-item danger-state"
}, $E = { class: "directus-settings__grid" }, eD = { class: "directus-settings__history" }, tD = { class: "directus-settings__environment" }, nD = ["onClick"], rD = { key: 0 }, iD = { class: "directus-settings__editor" }, aD = { class: "app-form-grid" }, oD = { class: "app-field" }, sD = { class: "app-field" }, cD = { class: "app-field" }, lD = { class: "app-field" }, uD = { class: "app-field" }, dD = { class: "app-checkbox" }, fD = { class: "app-actions app-actions--end" }, pD = ["disabled"], mD = ["disabled"], hD = ["disabled"], gD = ["disabled"], _D = ["disabled"], vD = {
	key: 0,
	class: "directus-settings__validation"
}, yD = { class: "directus-settings__checks" }, bD = { key: 0 }, xD = /*#__PURE__*/ Jh({
	__name: "DirectusIntegrationSettings",
	props: { capabilities: {
		type: Object,
		default: () => ({})
	} },
	emits: ["notify"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(!1), a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R([]), s = /* @__PURE__ */ R(""), c = /* @__PURE__ */ R(""), l = /* @__PURE__ */ R(null), u = /* @__PURE__ */ R([]), d = /* @__PURE__ */ It({
			environment: "development",
			baseUrl: "",
			secretRef: "env:DIRECTUS_SECRET_CONNECTION",
			timeoutMs: 5e3,
			retryCount: 0,
			verifyAuthentication: !0
		}), f = q(() => o.value.find((e) => e.id === s.value) || null), p = q(() => n.capabilities.directusIntegration === !0 && n.capabilities.directusConnectionTunnel === !0), m = q(() => [
			"development",
			"preview",
			"production"
		].map((e) => ({
			environment: e,
			rows: o.value.filter((t) => t.environment === e)
		})).filter((e) => e.rows.length)), h = q(() => u.value.find((e) => e.configId === s.value) || null);
		async function _(e, t = {}) {
			let n = await fetch(e, {
				cache: "no-store",
				...t,
				headers: {
					"Content-Type": "application/json",
					...t.headers || {}
				}
			}), r = await n.json().catch(() => ({}));
			if (!n.ok) {
				let e = Error(r.error || `요청 오류(${n.status})`);
				throw e.result = r, e;
			}
			return r;
		}
		function v(e) {
			s.value = e.id, Object.assign(d, {
				environment: e.environment,
				...e.config
			}), l.value = null;
		}
		async function y() {
			i.value = !0, c.value = "";
			try {
				let e = await _("/api/directus-integration-config");
				o.value = e.configs || [], u.value = e.checks || [], s.value &&= o.value.some((e) => e.id === s.value) ? s.value : "";
			} catch (e) {
				c.value = e.message;
			} finally {
				i.value = !1;
			}
		}
		async function b() {
			a.value = !0, c.value = "";
			try {
				let e = await _("/api/directus-integration-config", {
					method: "POST",
					body: JSON.stringify({
						environment: d.environment,
						config: {
							baseUrl: d.baseUrl,
							secretRef: d.secretRef,
							timeoutMs: Number(d.timeoutMs),
							retryCount: Number(d.retryCount),
							verifyAuthentication: d.verifyAuthentication
						}
					})
				});
				await y(), v(o.value.find((t) => t.id === e.config.id) || e.config), r("notify", "Directus 연결 설정 초안을 저장했습니다.");
			} catch (e) {
				c.value = e.message;
			} finally {
				a.value = !1;
			}
		}
		async function x(e) {
			if (f.value) {
				a.value = !0, c.value = "";
				try {
					let t = await _("/api/directus-integration-config", {
						method: "PATCH",
						body: JSON.stringify({
							id: f.value.id,
							action: e
						})
					});
					await y(), v(o.value.find((e) => e.id === t.config.id) || t.config), r("notify", e === "activate" ? "Directus 연결 설정을 활성화했습니다." : e === "suspend" ? "Directus 연결 설정을 중지했습니다." : "Directus 연결 설정 검증을 완료했습니다.");
				} catch (e) {
					c.value = e.message;
				} finally {
					a.value = !1;
				}
			}
		}
		async function S() {
			if (f.value) {
				a.value = !0, c.value = "", l.value = null;
				try {
					let e = await _("/api/directus-connection-test", {
						method: "POST",
						body: JSON.stringify({ id: f.value.id })
					});
					l.value = e.result, await y(), r("notify", "Directus 연결 테스트를 통과했습니다.");
				} catch (e) {
					c.value = e.message, l.value = e.result?.result || null;
				} finally {
					a.value = !1;
				}
			}
		}
		return ws(y), (t, n) => (V(), H("div", qE, [
			U("header", JE, [n[9] ||= U("div", null, [
				U("span", { class: "eyebrow" }, "Integration Config"),
				U("h2", null, "Directus 연결 터널"),
				U("p", null, "현재 단계에서는 URL·비밀키 참조·연결 검증만 관리합니다. 컬렉션 매핑, 데이터 마이그레이션, 런타임 읽기·쓰기는 포함하지 않습니다.")
			], -1), U("button", {
				class: "tiny-button",
				type: "button",
				disabled: i.value,
				onClick: y
			}, "새로고침", 8, YE)]),
			U("div", XE, [
				U("span", { class: g({ on: e.capabilities.directusConfigManagement }) }, "Config 관리 " + L(e.capabilities.directusConfigManagement ? "ON" : "OFF"), 3),
				U("span", { class: g({ on: e.capabilities.directusIntegration }) }, "Directus 연동 " + L(e.capabilities.directusIntegration ? "ON" : "OFF"), 3),
				U("span", { class: g({ on: e.capabilities.directusConnectionTunnel }) }, "연결 터널 " + L(e.capabilities.directusConnectionTunnel ? "ON" : "OFF"), 3)
			]),
			p.value ? G("", !0) : (V(), H("div", ZE, [...n[10] ||= [
				W(" 설정 초안은 준비할 수 있습니다. 실제 연결 테스트는 ", -1),
				U("code", null, "DIRECTUS_INTEGRATION_ENABLED=true", -1),
				W("와 ", -1),
				U("code", null, "DIRECTUS_CONNECTION_TUNNEL_ENABLED=true", -1),
				W("일 때만 실행됩니다. ", -1)
			]])),
			c.value ? (V(), H("div", QE, [n[11] ||= U("strong", null, "Directus 설정 오류", -1), U("span", null, L(c.value), 1)])) : G("", !0),
			U("div", $E, [U("aside", eD, [
				n[12] ||= U("h3", null, "설정 버전", -1),
				(V(!0), H(K, null, B(m.value, (e) => (V(), H(K, { key: e.environment }, [U("strong", tD, L(e.environment), 1), (V(!0), H(K, null, B(e.rows, (e) => (V(), H("button", {
					key: e.id,
					type: "button",
					class: g({ selected: s.value === e.id }),
					onClick: (t) => v(e)
				}, [U("span", null, "v" + L(e.version), 1), U("em", null, L(e.status), 1)], 10, nD))), 128))], 64))), 128)),
				!i.value && !o.value.length ? (V(), H("p", rD, "저장된 설정이 없습니다.")) : G("", !0)
			]), U("section", iD, [
				U("div", aD, [
					U("label", oD, [n[14] ||= U("span", null, "환경", -1), z(U("select", { "onUpdate:modelValue": n[0] ||= (e) => d.environment = e }, [...n[13] ||= [
						U("option", { value: "development" }, "development", -1),
						U("option", { value: "preview" }, "preview", -1),
						U("option", { value: "production" }, "production", -1)
					]], 512), [[Y, d.environment]])]),
					U("label", sD, [n[15] ||= U("span", null, "Directus Base URL", -1), z(U("input", {
						"onUpdate:modelValue": n[1] ||= (e) => d.baseUrl = e,
						type: "url",
						placeholder: "https://directus.example.com"
					}, null, 512), [[
						J,
						d.baseUrl,
						void 0,
						{ trim: !0 }
					]])]),
					U("label", cD, [
						n[16] ||= U("span", null, "비밀키 참조", -1),
						z(U("input", {
							"onUpdate:modelValue": n[2] ||= (e) => d.secretRef = e,
							type: "text",
							placeholder: "env:DIRECTUS_SECRET_CONNECTION"
						}, null, 512), [[
							J,
							d.secretRef,
							void 0,
							{ trim: !0 }
						]]),
						n[17] ||= U("small", null, "토큰 값이 아니라 서버 환경변수 이름만 저장합니다.", -1)
					]),
					U("label", lD, [n[18] ||= U("span", null, "Timeout (ms)", -1), z(U("input", {
						"onUpdate:modelValue": n[3] ||= (e) => d.timeoutMs = e,
						type: "number",
						min: "1000",
						max: "15000",
						step: "500"
					}, null, 512), [[
						J,
						d.timeoutMs,
						void 0,
						{ number: !0 }
					]])]),
					U("label", uD, [n[19] ||= U("span", null, "Retry", -1), z(U("input", {
						"onUpdate:modelValue": n[4] ||= (e) => d.retryCount = e,
						type: "number",
						min: "0",
						max: "2"
					}, null, 512), [[
						J,
						d.retryCount,
						void 0,
						{ number: !0 }
					]])]),
					U("label", dD, [z(U("input", {
						"onUpdate:modelValue": n[5] ||= (e) => d.verifyAuthentication = e,
						type: "checkbox"
					}, null, 512), [[Mu, d.verifyAuthentication]]), n[20] ||= U("span", null, [U("code", null, "/users/me"), W(" 인증 확인")], -1)])
				]),
				U("div", fD, [
					U("button", {
						class: "tiny-button primary",
						type: "button",
						disabled: a.value || !d.baseUrl,
						onClick: b
					}, "새 초안 저장", 8, pD),
					U("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "draft",
						onClick: n[6] ||= (e) => x("validate")
					}, "구성 검증", 8, mD),
					U("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "draft" || f.value?.validation?.ok !== !0 || h.value?.status !== "passed",
						onClick: n[7] ||= (e) => x("activate")
					}, "활성화", 8, hD),
					U("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "active",
						onClick: n[8] ||= (e) => x("suspend")
					}, "중지", 8, gD),
					U("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || !f.value || !p.value,
						onClick: S
					}, "연결 테스트", 8, _D)
				]),
				f.value?.validation?.errors?.length ? (V(), H("div", vD, [n[21] ||= U("strong", null, "검증 오류", -1), U("ul", null, [(V(!0), H(K, null, B(f.value.validation.errors, (e) => (V(), H("li", { key: e.code }, L(e.message), 1))), 128))])])) : G("", !0),
				l.value ? (V(), H("div", {
					key: 1,
					class: g(["directus-settings__result", l.value.status])
				}, [U("strong", null, L(l.value.status === "passed" ? "연결 성공" : "연결 실패"), 1), U("span", null, "Health: " + L(l.value.healthStatus || "-") + " · Auth: " + L(l.value.authVerified ? "확인" : "미확인") + " · " + L(l.value.durationMs) + "ms", 1)], 2)) : G("", !0),
				U("div", yD, [
					n[22] ||= U("strong", null, "최근 연결 검사", -1),
					(V(!0), H(K, null, B(u.value.slice(0, 10), (e) => (V(), H("div", {
						key: e.id,
						class: "directus-settings__check"
					}, [U("span", null, L(e.environment) + " v" + L(e.version) + " · " + L(e.status), 1), U("em", null, L(e.healthStatus || e.errorCode || "-") + " · " + L(e.durationMs) + "ms", 1)]))), 128)),
					u.value.length ? G("", !0) : (V(), H("small", bD, "연결 검사 이력이 없습니다."))
				])
			])])
		]));
	}
}, [["__scopeId", "data-v-57361789"]]);
//#endregion
//#region node_modules/.pnpm/is-node-process@1.2.0/node_modules/is-node-process/lib/index.mjs
function SD() {
	if (typeof navigator < "u" && navigator.product === "ReactNative") return !0;
	if (typeof process < "u") {
		let e = process.type;
		return e === "renderer" || e === "worker" ? !1 : !!(process.versions && process.versions.node);
	}
	return !1;
}
//#endregion
//#region node_modules/.pnpm/@vercel+blob@2.5.0/node_modules/@vercel/blob/dist/stream-browser.js
var CD = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	t.exports = function(e) {
		return e != null && e.constructor != null && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
	};
})))(), 1), wD = { toWeb() {
	throw Error("Vercel Blob: Sorry, we cannot get a Readable stream in this environment. If you see this message please open an issue here: https://github.com/vercel/storage/ with details on your environment.");
} }, TD = /* @__PURE__ */ s(((e, t) => {
	var n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = (e, t) => {
		for (var r in t) n(e, r, {
			get: t[r],
			enumerable: !0
		});
	}, s = (e, t, o, s) => {
		if (t && typeof t == "object" || typeof t == "function") for (let c of i(t)) !a.call(e, c) && c !== o && n(e, c, {
			get: () => t[c],
			enumerable: !(s = r(t, c)) || s.enumerable
		});
		return e;
	}, c = (e) => s(n({}, "__esModule", { value: !0 }), e), l = {};
	o(l, {
		SYMBOL_FOR_REQ_CONTEXT: () => u,
		getContext: () => d
	}), t.exports = c(l);
	var u = Symbol.for("@vercel/request-context");
	function d() {
		return globalThis[u]?.get?.() ?? {};
	}
	0 && (t.exports = {
		SYMBOL_FOR_REQ_CONTEXT: u,
		getContext: d
	});
})), Z, ED, DD = o((() => {
	Z = crypto, ED = (e) => e instanceof CryptoKey;
})), OD, kD = o((() => {
	DD(), OD = async (e, t) => {
		let n = `SHA-${e.slice(-3)}`;
		return new Uint8Array(await Z.subtle.digest(n, t));
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/buffer_utils.js
function AD(...e) {
	let t = e.reduce((e, { length: t }) => e + t, 0), n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
function jD(e, t) {
	return AD(LD.encode(e), new Uint8Array([0]), t);
}
function MD(e, t, n) {
	if (t < 0 || t >= zD) throw RangeError(`value must be >= 0 and <= ${zD - 1}. Received ${t}`);
	e.set([
		t >>> 24,
		t >>> 16,
		t >>> 8,
		t & 255
	], n);
}
function ND(e) {
	let t = Math.floor(e / zD), n = e % zD, r = /* @__PURE__ */ new Uint8Array(8);
	return MD(r, t, 0), MD(r, n, 4), r;
}
function PD(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return MD(t, e), t;
}
function FD(e) {
	return AD(PD(e.length), e);
}
async function ID(e, t, n) {
	let r = Math.ceil((t >> 3) / 32), i = new Uint8Array(r * 32);
	for (let t = 0; t < r; t++) {
		let r = new Uint8Array(4 + e.length + n.length);
		r.set(PD(t + 1)), r.set(e, 4), r.set(n, 4 + e.length), i.set(await OD("sha256", r), t * 32);
	}
	return i.slice(0, t >> 3);
}
var LD, RD, zD, BD = o((() => {
	kD(), LD = new TextEncoder(), RD = new TextDecoder(), zD = 2 ** 32;
})), VD, HD, UD, WD, GD = o((() => {
	BD(), VD = (e) => {
		let t = e;
		typeof t == "string" && (t = LD.encode(t));
		let n = 32768, r = [];
		for (let e = 0; e < t.length; e += n) r.push(String.fromCharCode.apply(null, t.subarray(e, e + n)));
		return btoa(r.join(""));
	}, HD = (e) => VD(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), UD = (e) => {
		let t = atob(e), n = new Uint8Array(t.length);
		for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
		return n;
	}, WD = (e) => {
		let t = e;
		t instanceof Uint8Array && (t = RD.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
		try {
			return UD(t);
		} catch {
			throw TypeError("The input to be decoded is not correctly encoded.");
		}
	};
})), KD = /* @__PURE__ */ c({
	JOSEAlgNotAllowed: () => XD,
	JOSEError: () => qD,
	JOSENotSupported: () => ZD,
	JWEDecryptionFailed: () => QD,
	JWEInvalid: () => Q,
	JWKInvalid: () => tO,
	JWKSInvalid: () => nO,
	JWKSMultipleMatchingKeys: () => iO,
	JWKSNoMatchingKey: () => rO,
	JWKSTimeout: () => aO,
	JWSInvalid: () => $D,
	JWSSignatureVerificationFailed: () => oO,
	JWTClaimValidationFailed: () => JD,
	JWTExpired: () => YD,
	JWTInvalid: () => eO
}), qD, JD, YD, XD, ZD, QD, Q, $D, eO, tO, nO, rO, iO, aO, oO, sO = o((() => {
	qD = class extends Error {
		constructor(e, t) {
			super(e, t), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
		}
	}, qD.code = "ERR_JOSE_GENERIC", JD = class extends qD {
		constructor(e, t, n = "unspecified", r = "unspecified") {
			super(e, { cause: {
				claim: n,
				reason: r,
				payload: t
			} }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = n, this.reason = r, this.payload = t;
		}
	}, JD.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", YD = class extends qD {
		constructor(e, t, n = "unspecified", r = "unspecified") {
			super(e, { cause: {
				claim: n,
				reason: r,
				payload: t
			} }), this.code = "ERR_JWT_EXPIRED", this.claim = n, this.reason = r, this.payload = t;
		}
	}, YD.code = "ERR_JWT_EXPIRED", XD = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
		}
	}, XD.code = "ERR_JOSE_ALG_NOT_ALLOWED", ZD = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
		}
	}, ZD.code = "ERR_JOSE_NOT_SUPPORTED", QD = class extends qD {
		constructor(e = "decryption operation failed", t) {
			super(e, t), this.code = "ERR_JWE_DECRYPTION_FAILED";
		}
	}, QD.code = "ERR_JWE_DECRYPTION_FAILED", Q = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JWE_INVALID";
		}
	}, Q.code = "ERR_JWE_INVALID", $D = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JWS_INVALID";
		}
	}, $D.code = "ERR_JWS_INVALID", eO = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JWT_INVALID";
		}
	}, eO.code = "ERR_JWT_INVALID", tO = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JWK_INVALID";
		}
	}, tO.code = "ERR_JWK_INVALID", nO = class extends qD {
		constructor() {
			super(...arguments), this.code = "ERR_JWKS_INVALID";
		}
	}, nO.code = "ERR_JWKS_INVALID", rO = class extends qD {
		constructor(e = "no applicable key found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_NO_MATCHING_KEY";
		}
	}, rO.code = "ERR_JWKS_NO_MATCHING_KEY", iO = class extends qD {
		constructor(e = "multiple matching keys found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
		}
	}, iO.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS", aO = class extends qD {
		constructor(e = "request timed out", t) {
			super(e, t), this.code = "ERR_JWKS_TIMEOUT";
		}
	}, aO.code = "ERR_JWKS_TIMEOUT", oO = class extends qD {
		constructor(e = "signature verification failed", t) {
			super(e, t), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
		}
	}, oO.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
})), cO, lO = o((() => {
	DD(), cO = Z.getRandomValues.bind(Z);
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/iv.js
function uO(e) {
	switch (e) {
		case "A128GCM":
		case "A128GCMKW":
		case "A192GCM":
		case "A192GCMKW":
		case "A256GCM":
		case "A256GCMKW": return 96;
		case "A128CBC-HS256":
		case "A192CBC-HS384":
		case "A256CBC-HS512": return 128;
		default: throw new ZD(`Unsupported JWE Algorithm: ${e}`);
	}
}
var dO, fO = o((() => {
	sO(), lO(), dO = (e) => cO(new Uint8Array(uO(e) >> 3));
})), pO, mO = o((() => {
	sO(), fO(), pO = (e, t) => {
		if (t.length << 3 !== uO(e)) throw new Q("Invalid Initialization Vector length");
	};
})), hO, gO = o((() => {
	sO(), hO = (e, t) => {
		let n = e.byteLength << 3;
		if (n !== t) throw new Q(`Invalid Content Encryption Key length. Expected ${t} bits, got ${n} bits`);
	};
})), _O, vO = o((() => {
	_O = (e, t) => {
		if (!(e instanceof Uint8Array)) throw TypeError("First argument must be a buffer");
		if (!(t instanceof Uint8Array)) throw TypeError("Second argument must be a buffer");
		if (e.length !== t.length) throw TypeError("Input buffers must have the same length");
		let n = e.length, r = 0, i = -1;
		for (; ++i < n;) r |= e[i] ^ t[i];
		return r === 0;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/crypto_key.js
function yO(e, t = "algorithm.name") {
	return /* @__PURE__ */ TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
function bO(e, t) {
	return e.name === t;
}
function xO(e) {
	return parseInt(e.name.slice(4), 10);
}
function SO(e) {
	switch (e) {
		case "ES256": return "P-256";
		case "ES384": return "P-384";
		case "ES512": return "P-521";
		default: throw Error("unreachable");
	}
}
function CO(e, t) {
	if (t.length && !t.some((t) => e.usages.includes(t))) {
		let e = "CryptoKey does not support this operation, its usages must include ";
		if (t.length > 2) {
			let n = t.pop();
			e += `one of ${t.join(", ")}, or ${n}.`;
		} else t.length === 2 ? e += `one of ${t[0]} or ${t[1]}.` : e += `${t[0]}.`;
		throw TypeError(e);
	}
}
function wO(e, t, ...n) {
	switch (t) {
		case "HS256":
		case "HS384":
		case "HS512": {
			if (!bO(e.algorithm, "HMAC")) throw yO("HMAC");
			let n = parseInt(t.slice(2), 10);
			if (xO(e.algorithm.hash) !== n) throw yO(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "RS256":
		case "RS384":
		case "RS512": {
			if (!bO(e.algorithm, "RSASSA-PKCS1-v1_5")) throw yO("RSASSA-PKCS1-v1_5");
			let n = parseInt(t.slice(2), 10);
			if (xO(e.algorithm.hash) !== n) throw yO(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "PS256":
		case "PS384":
		case "PS512": {
			if (!bO(e.algorithm, "RSA-PSS")) throw yO("RSA-PSS");
			let n = parseInt(t.slice(2), 10);
			if (xO(e.algorithm.hash) !== n) throw yO(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "EdDSA":
			if (e.algorithm.name !== "Ed25519" && e.algorithm.name !== "Ed448") throw yO("Ed25519 or Ed448");
			break;
		case "Ed25519":
			if (!bO(e.algorithm, "Ed25519")) throw yO("Ed25519");
			break;
		case "ES256":
		case "ES384":
		case "ES512": {
			if (!bO(e.algorithm, "ECDSA")) throw yO("ECDSA");
			let n = SO(t);
			if (e.algorithm.namedCurve !== n) throw yO(n, "algorithm.namedCurve");
			break;
		}
		default: throw TypeError("CryptoKey does not support this operation");
	}
	CO(e, n);
}
function TO(e, t, ...n) {
	switch (t) {
		case "A128GCM":
		case "A192GCM":
		case "A256GCM": {
			if (!bO(e.algorithm, "AES-GCM")) throw yO("AES-GCM");
			let n = parseInt(t.slice(1, 4), 10);
			if (e.algorithm.length !== n) throw yO(n, "algorithm.length");
			break;
		}
		case "A128KW":
		case "A192KW":
		case "A256KW": {
			if (!bO(e.algorithm, "AES-KW")) throw yO("AES-KW");
			let n = parseInt(t.slice(1, 4), 10);
			if (e.algorithm.length !== n) throw yO(n, "algorithm.length");
			break;
		}
		case "ECDH":
			switch (e.algorithm.name) {
				case "ECDH":
				case "X25519":
				case "X448": break;
				default: throw yO("ECDH, X25519, or X448");
			}
			break;
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW":
			if (!bO(e.algorithm, "PBKDF2")) throw yO("PBKDF2");
			break;
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512": {
			if (!bO(e.algorithm, "RSA-OAEP")) throw yO("RSA-OAEP");
			let n = parseInt(t.slice(9), 10) || 1;
			if (xO(e.algorithm.hash) !== n) throw yO(`SHA-${n}`, "algorithm.hash");
			break;
		}
		default: throw TypeError("CryptoKey does not support this operation");
	}
	CO(e, n);
}
var EO = o((() => {}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/invalid_key_input.js
function DO(e, t, ...n) {
	if (n = n.filter(Boolean), n.length > 2) {
		let t = n.pop();
		e += `one of type ${n.join(", ")}, or ${t}.`;
	} else n.length === 2 ? e += `one of type ${n[0]} or ${n[1]}.` : e += `of type ${n[0]}.`;
	return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
function OO(e, t, ...n) {
	return DO(`Key for the ${e} algorithm must be `, t, ...n);
}
var kO, AO = o((() => {
	kO = (e, ...t) => DO("Key must be ", e, ...t);
})), jO, MO, NO = o((() => {
	DD(), jO = (e) => ED(e) ? !0 : e?.[Symbol.toStringTag] === "KeyObject", MO = ["CryptoKey"];
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/decrypt.js
async function PO(e, t, n, r, i, a) {
	if (!(t instanceof Uint8Array)) throw TypeError(kO(t, "Uint8Array"));
	let o = parseInt(e.slice(1, 4), 10), s = await Z.subtle.importKey("raw", t.subarray(o >> 3), "AES-CBC", !1, ["decrypt"]), c = await Z.subtle.importKey("raw", t.subarray(0, o >> 3), {
		hash: `SHA-${o << 1}`,
		name: "HMAC"
	}, !1, ["sign"]), l = AD(a, r, n, ND(a.length << 3)), u = new Uint8Array((await Z.subtle.sign("HMAC", c, l)).slice(0, o >> 3)), d;
	try {
		d = _O(i, u);
	} catch {}
	if (!d) throw new QD();
	let f;
	try {
		f = new Uint8Array(await Z.subtle.decrypt({
			iv: r,
			name: "AES-CBC"
		}, s, n));
	} catch {}
	if (!f) throw new QD();
	return f;
}
async function FO(e, t, n, r, i, a) {
	let o;
	t instanceof Uint8Array ? o = await Z.subtle.importKey("raw", t, "AES-GCM", !1, ["decrypt"]) : (TO(t, e, "decrypt"), o = t);
	try {
		return new Uint8Array(await Z.subtle.decrypt({
			additionalData: a,
			iv: r,
			name: "AES-GCM",
			tagLength: 128
		}, o, AD(n, i)));
	} catch {
		throw new QD();
	}
}
var IO, LO = o((() => {
	BD(), mO(), gO(), vO(), sO(), DD(), EO(), AO(), NO(), IO = async (e, t, n, r, i, a) => {
		if (!ED(t) && !(t instanceof Uint8Array)) throw TypeError(kO(t, ...MO, "Uint8Array"));
		if (!r) throw new Q("JWE Initialization Vector missing");
		if (!i) throw new Q("JWE Authentication Tag missing");
		switch (pO(e, r), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512": return t instanceof Uint8Array && hO(t, parseInt(e.slice(-3), 10)), PO(e, t, n, r, i, a);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM": return t instanceof Uint8Array && hO(t, parseInt(e.slice(1, 4), 10)), FO(e, t, n, r, i, a);
			default: throw new ZD("Unsupported JWE Content Encryption Algorithm");
		}
	};
})), RO, zO = o((() => {
	RO = (...e) => {
		let t = e.filter(Boolean);
		if (t.length === 0 || t.length === 1) return !0;
		let n;
		for (let e of t) {
			let t = Object.keys(e);
			if (!n || n.size === 0) {
				n = new Set(t);
				continue;
			}
			for (let e of t) {
				if (n.has(e)) return !1;
				n.add(e);
			}
		}
		return !0;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/is_object.js
function BO(e) {
	return typeof e == "object" && !!e;
}
function VO(e) {
	if (!BO(e) || Object.prototype.toString.call(e) !== "[object Object]") return !1;
	if (Object.getPrototypeOf(e) === null) return !0;
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t;
}
var HO = o((() => {})), UO, WO = o((() => {
	UO = [
		{
			hash: "SHA-256",
			name: "HMAC"
		},
		!0,
		["sign"]
	];
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/aeskw.js
function GO(e, t) {
	if (e.algorithm.length !== parseInt(t.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${t}`);
}
function KO(e, t, n) {
	if (ED(e)) return TO(e, t, n), e;
	if (e instanceof Uint8Array) return Z.subtle.importKey("raw", e, "AES-KW", !0, [n]);
	throw TypeError(kO(e, ...MO, "Uint8Array"));
}
var qO, JO, YO = o((() => {
	WO(), DD(), EO(), AO(), NO(), qO = async (e, t, n) => {
		let r = await KO(t, e, "wrapKey");
		GO(r, e);
		let i = await Z.subtle.importKey("raw", n, ...UO);
		return new Uint8Array(await Z.subtle.wrapKey("raw", i, r, "AES-KW"));
	}, JO = async (e, t, n) => {
		let r = await KO(t, e, "unwrapKey");
		GO(r, e);
		let i = await Z.subtle.unwrapKey("raw", n, r, "AES-KW", ...UO);
		return new Uint8Array(await Z.subtle.exportKey("raw", i));
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/ecdhes.js
async function XO(e, t, n, r, i = /* @__PURE__ */ new Uint8Array(), a = /* @__PURE__ */ new Uint8Array()) {
	if (!ED(e)) throw TypeError(kO(e, ...MO));
	if (TO(e, "ECDH"), !ED(t)) throw TypeError(kO(t, ...MO));
	TO(t, "ECDH", "deriveBits");
	let o = AD(FD(LD.encode(n)), FD(i), FD(a), PD(r)), s;
	return s = e.algorithm.name === "X25519" ? 256 : e.algorithm.name === "X448" ? 448 : Math.ceil(parseInt(e.algorithm.namedCurve.substr(-3), 10) / 8) << 3, ID(new Uint8Array(await Z.subtle.deriveBits({
		name: e.algorithm.name,
		public: e
	}, t, s)), r, o);
}
async function ZO(e) {
	if (!ED(e)) throw TypeError(kO(e, ...MO));
	return Z.subtle.generateKey(e.algorithm, !0, ["deriveBits"]);
}
function QO(e) {
	if (!ED(e)) throw TypeError(kO(e, ...MO));
	return [
		"P-256",
		"P-384",
		"P-521"
	].includes(e.algorithm.namedCurve) || e.algorithm.name === "X25519" || e.algorithm.name === "X448";
}
var $O = o((() => {
	BD(), DD(), EO(), AO(), NO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/check_p2s.js
function ek(e) {
	if (!(e instanceof Uint8Array) || e.length < 8) throw new Q("PBES2 Salt Input must be 8 or more octets");
}
var tk = o((() => {
	sO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/pbes2kw.js
function nk(e, t) {
	if (e instanceof Uint8Array) return Z.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]);
	if (ED(e)) return TO(e, t, "deriveBits", "deriveKey"), e;
	throw TypeError(kO(e, ...MO, "Uint8Array"));
}
async function rk(e, t, n, r) {
	ek(e);
	let i = jD(t, e), a = parseInt(t.slice(13, 16), 10), o = {
		hash: `SHA-${t.slice(8, 11)}`,
		iterations: n,
		name: "PBKDF2",
		salt: i
	}, s = {
		length: a,
		name: "AES-KW"
	}, c = await nk(r, t);
	if (c.usages.includes("deriveBits")) return new Uint8Array(await Z.subtle.deriveBits(o, c, a));
	if (c.usages.includes("deriveKey")) return Z.subtle.deriveKey(o, c, s, !1, ["wrapKey", "unwrapKey"]);
	throw TypeError("PBKDF2 key \"usages\" must include \"deriveBits\" or \"deriveKey\"");
}
var ik, ak, ok = o((() => {
	lO(), BD(), GD(), YO(), tk(), DD(), EO(), AO(), NO(), ik = async (e, t, n, r = 2048, i = cO(/* @__PURE__ */ new Uint8Array(16))) => {
		let a = await rk(i, e, r, t);
		return {
			encryptedKey: await qO(e.slice(-6), a, n),
			p2c: r,
			p2s: HD(i)
		};
	}, ak = async (e, t, n, r, i) => {
		let a = await rk(i, e, r, t);
		return JO(e.slice(-6), a, n);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/subtle_rsaes.js
function sk(e) {
	switch (e) {
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512": return "RSA-OAEP";
		default: throw new ZD(`alg ${e} is not supported either by JOSE or your javascript runtime`);
	}
}
var ck = o((() => {
	sO();
})), lk, uk = o((() => {
	lk = (e, t) => {
		if (e.startsWith("RS") || e.startsWith("PS")) {
			let { modulusLength: n } = t.algorithm;
			if (typeof n != "number" || n < 2048) throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
		}
	};
})), dk, fk, pk = o((() => {
	ck(), WO(), DD(), EO(), uk(), AO(), NO(), dk = async (e, t, n) => {
		if (!ED(t)) throw TypeError(kO(t, ...MO));
		if (TO(t, e, "encrypt", "wrapKey"), lk(e, t), t.usages.includes("encrypt")) return new Uint8Array(await Z.subtle.encrypt(sk(e), t, n));
		if (t.usages.includes("wrapKey")) {
			let r = await Z.subtle.importKey("raw", n, ...UO);
			return new Uint8Array(await Z.subtle.wrapKey("raw", r, t, sk(e)));
		}
		throw TypeError("RSA-OAEP key \"usages\" must include \"encrypt\" or \"wrapKey\" for this operation");
	}, fk = async (e, t, n) => {
		if (!ED(t)) throw TypeError(kO(t, ...MO));
		if (TO(t, e, "decrypt", "unwrapKey"), lk(e, t), t.usages.includes("decrypt")) return new Uint8Array(await Z.subtle.decrypt(sk(e), t, n));
		if (t.usages.includes("unwrapKey")) {
			let r = await Z.subtle.unwrapKey("raw", n, t, sk(e), ...UO);
			return new Uint8Array(await Z.subtle.exportKey("raw", r));
		}
		throw TypeError("RSA-OAEP key \"usages\" must include \"decrypt\" or \"unwrapKey\" for this operation");
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/is_jwk.js
function mk(e) {
	return VO(e) && typeof e.kty == "string";
}
function hk(e) {
	return e.kty !== "oct" && typeof e.d == "string";
}
function gk(e) {
	return e.kty !== "oct" && e.d === void 0;
}
function _k(e) {
	return mk(e) && e.kty === "oct" && typeof e.k == "string";
}
var vk = o((() => {
	HO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/jwk_to_key.js
function yk(e) {
	let t, n;
	switch (e.kty) {
		case "RSA":
			switch (e.alg) {
				case "PS256":
				case "PS384":
				case "PS512":
					t = {
						name: "RSA-PSS",
						hash: `SHA-${e.alg.slice(-3)}`
					}, n = e.d ? ["sign"] : ["verify"];
					break;
				case "RS256":
				case "RS384":
				case "RS512":
					t = {
						name: "RSASSA-PKCS1-v1_5",
						hash: `SHA-${e.alg.slice(-3)}`
					}, n = e.d ? ["sign"] : ["verify"];
					break;
				case "RSA-OAEP":
				case "RSA-OAEP-256":
				case "RSA-OAEP-384":
				case "RSA-OAEP-512":
					t = {
						name: "RSA-OAEP",
						hash: `SHA-${parseInt(e.alg.slice(-3), 10) || 1}`
					}, n = e.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
					break;
				default: throw new ZD("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			}
			break;
		case "EC":
			switch (e.alg) {
				case "ES256":
					t = {
						name: "ECDSA",
						namedCurve: "P-256"
					}, n = e.d ? ["sign"] : ["verify"];
					break;
				case "ES384":
					t = {
						name: "ECDSA",
						namedCurve: "P-384"
					}, n = e.d ? ["sign"] : ["verify"];
					break;
				case "ES512":
					t = {
						name: "ECDSA",
						namedCurve: "P-521"
					}, n = e.d ? ["sign"] : ["verify"];
					break;
				case "ECDH-ES":
				case "ECDH-ES+A128KW":
				case "ECDH-ES+A192KW":
				case "ECDH-ES+A256KW":
					t = {
						name: "ECDH",
						namedCurve: e.crv
					}, n = e.d ? ["deriveBits"] : [];
					break;
				default: throw new ZD("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			}
			break;
		case "OKP":
			switch (e.alg) {
				case "Ed25519":
					t = { name: "Ed25519" }, n = e.d ? ["sign"] : ["verify"];
					break;
				case "EdDSA":
					t = { name: e.crv }, n = e.d ? ["sign"] : ["verify"];
					break;
				case "ECDH-ES":
				case "ECDH-ES+A128KW":
				case "ECDH-ES+A192KW":
				case "ECDH-ES+A256KW":
					t = { name: e.crv }, n = e.d ? ["deriveBits"] : [];
					break;
				default: throw new ZD("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			}
			break;
		default: throw new ZD("Invalid or unsupported JWK \"kty\" (Key Type) Parameter value");
	}
	return {
		algorithm: t,
		keyUsages: n
	};
}
var bk, xk = o((() => {
	DD(), sO(), bk = async (e) => {
		if (!e.alg) throw TypeError("\"alg\" argument is required when \"jwk.alg\" is not present");
		let { algorithm: t, keyUsages: n } = yk(e), r = [
			t,
			e.ext ?? !1,
			e.key_ops ?? n
		], i = { ...e };
		return delete i.alg, delete i.use, Z.subtle.importKey("jwk", i, ...r);
	};
})), Sk, Ck, wk, Tk, Ek, Dk, Ok, kk, Ak = o((() => {
	vk(), GD(), xk(), Sk = (e) => WD(e), Tk = (e) => e?.[Symbol.toStringTag] === "KeyObject", Ek = async (e, t, n, r, i = !1) => {
		let a = e.get(t);
		if (a?.[r]) return a[r];
		let o = await bk({
			...n,
			alg: r
		});
		return i && Object.freeze(t), a ? a[r] = o : e.set(t, { [r]: o }), o;
	}, Dk = (e, t) => {
		if (Tk(e)) {
			let n = e.export({ format: "jwk" });
			return delete n.d, delete n.dp, delete n.dq, delete n.p, delete n.q, delete n.qi, n.k ? Sk(n.k) : (wk ||= /* @__PURE__ */ new WeakMap(), Ek(wk, e, n, t));
		}
		return mk(e) ? e.k ? WD(e.k) : (wk ||= /* @__PURE__ */ new WeakMap(), Ek(wk, e, e, t, !0)) : e;
	}, Ok = (e, t) => {
		if (Tk(e)) {
			let n = e.export({ format: "jwk" });
			return n.k ? Sk(n.k) : (Ck ||= /* @__PURE__ */ new WeakMap(), Ek(Ck, e, n, t));
		}
		return mk(e) ? e.k ? WD(e.k) : (Ck ||= /* @__PURE__ */ new WeakMap(), Ek(Ck, e, e, t, !0)) : e;
	}, kk = {
		normalizePublicKey: Dk,
		normalizePrivateKey: Ok
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/cek.js
function jk(e) {
	switch (e) {
		case "A128GCM": return 128;
		case "A192GCM": return 192;
		case "A256GCM":
		case "A128CBC-HS256": return 256;
		case "A192CBC-HS384": return 384;
		case "A256CBC-HS512": return 512;
		default: throw new ZD(`Unsupported JWE Algorithm: ${e}`);
	}
}
var Mk, Nk = o((() => {
	sO(), lO(), Mk = (e) => cO(new Uint8Array(jk(e) >> 3));
})), Pk, Fk = o((() => {
	Pk = (e, t) => `-----BEGIN ${t}-----\n${(e.match(/.{1,64}/g) || []).join("\n")}\n-----END ${t}-----`;
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/asn1.js
function Ik(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = Lk(e.subarray(n));
		t.push(r), n += r.byteLength;
	}
	return t;
}
function Lk(e) {
	let t = 0, n = e[0] & 31;
	if (t++, n === 31) {
		for (n = 0; e[t] >= 128;) n = n * 128 + e[t] - 128, t++;
		n = n * 128 + e[t] - 128, t++;
	}
	let r = 0;
	if (e[t] < 128) r = e[t], t++;
	else if (r === 128) {
		for (r = 0; e[t + r] !== 0 || e[t + r + 1] !== 0;) {
			if (r > e.byteLength) throw TypeError("invalid indefinite form length");
			r++;
		}
		let n = t + r + 2;
		return {
			byteLength: n,
			contents: e.subarray(t, t + r),
			raw: e.subarray(0, n)
		};
	} else {
		let n = e[t] & 127;
		t++, r = 0;
		for (let i = 0; i < n; i++) r = r * 256 + e[t], t++;
	}
	let i = t + r;
	return {
		byteLength: i,
		contents: e.subarray(t, i),
		raw: e.subarray(0, i)
	};
}
function Rk(e) {
	let t = Ik(Ik(Lk(e).contents)[0].contents);
	return VD(t[t[0].raw[0] === 160 ? 6 : 5].raw);
}
function zk(e) {
	return Pk(Rk(UD(e.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ""))), "PUBLIC KEY");
}
var Bk, Vk, Hk, Uk, Wk, Gk, Kk, qk, Jk, Yk = o((() => {
	DD(), AO(), GD(), Fk(), sO(), NO(), Bk = async (e, t, n) => {
		if (!ED(n)) throw TypeError(kO(n, ...MO));
		if (!n.extractable) throw TypeError("CryptoKey is not extractable");
		if (n.type !== e) throw TypeError(`key is not a ${e} key`);
		return Pk(VD(new Uint8Array(await Z.subtle.exportKey(t, n))), `${e.toUpperCase()} KEY`);
	}, Vk = (e) => Bk("public", "spki", e), Hk = (e) => Bk("private", "pkcs8", e), Uk = (e, t, n = 0) => {
		n === 0 && (t.unshift(t.length), t.unshift(6));
		let r = e.indexOf(t[0], n);
		if (r === -1) return !1;
		let i = e.subarray(r, r + t.length);
		return i.length === t.length ? i.every((e, n) => e === t[n]) || Uk(e, t, r + 1) : !1;
	}, Wk = (e) => {
		switch (!0) {
			case Uk(e, [
				42,
				134,
				72,
				206,
				61,
				3,
				1,
				7
			]): return "P-256";
			case Uk(e, [
				43,
				129,
				4,
				0,
				34
			]): return "P-384";
			case Uk(e, [
				43,
				129,
				4,
				0,
				35
			]): return "P-521";
			case Uk(e, [
				43,
				101,
				110
			]): return "X25519";
			case Uk(e, [
				43,
				101,
				111
			]): return "X448";
			case Uk(e, [
				43,
				101,
				112
			]): return "Ed25519";
			case Uk(e, [
				43,
				101,
				113
			]): return "Ed448";
			default: throw new ZD("Invalid or unsupported EC Key Curve or OKP Key Sub Type");
		}
	}, Gk = async (e, t, n, r, i) => {
		let a, o, s = new Uint8Array(atob(n.replace(e, "")).split("").map((e) => e.charCodeAt(0))), c = t === "spki";
		switch (r) {
			case "PS256":
			case "PS384":
			case "PS512":
				a = {
					name: "RSA-PSS",
					hash: `SHA-${r.slice(-3)}`
				}, o = c ? ["verify"] : ["sign"];
				break;
			case "RS256":
			case "RS384":
			case "RS512":
				a = {
					name: "RSASSA-PKCS1-v1_5",
					hash: `SHA-${r.slice(-3)}`
				}, o = c ? ["verify"] : ["sign"];
				break;
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512":
				a = {
					name: "RSA-OAEP",
					hash: `SHA-${parseInt(r.slice(-3), 10) || 1}`
				}, o = c ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
				break;
			case "ES256":
				a = {
					name: "ECDSA",
					namedCurve: "P-256"
				}, o = c ? ["verify"] : ["sign"];
				break;
			case "ES384":
				a = {
					name: "ECDSA",
					namedCurve: "P-384"
				}, o = c ? ["verify"] : ["sign"];
				break;
			case "ES512":
				a = {
					name: "ECDSA",
					namedCurve: "P-521"
				}, o = c ? ["verify"] : ["sign"];
				break;
			case "ECDH-ES":
			case "ECDH-ES+A128KW":
			case "ECDH-ES+A192KW":
			case "ECDH-ES+A256KW": {
				let e = Wk(s);
				a = e.startsWith("P-") ? {
					name: "ECDH",
					namedCurve: e
				} : { name: e }, o = c ? [] : ["deriveBits"];
				break;
			}
			case "Ed25519":
				a = { name: "Ed25519" }, o = c ? ["verify"] : ["sign"];
				break;
			case "EdDSA":
				a = { name: Wk(s) }, o = c ? ["verify"] : ["sign"];
				break;
			default: throw new ZD("Invalid or unsupported \"alg\" (Algorithm) value");
		}
		return Z.subtle.importKey(t, s, a, i?.extractable ?? !1, o);
	}, Kk = (e, t, n) => Gk(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", e, t, n), qk = (e, t, n) => Gk(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", e, t, n), Jk = (e, t, n) => {
		let r;
		try {
			r = zk(e);
		} catch (e) {
			throw TypeError("Failed to parse the X.509 certificate", { cause: e });
		}
		return qk(r, t, n);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/import.js
async function Xk(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) throw TypeError("\"spki\" must be SPKI formatted string");
	return qk(e, t, n);
}
async function Zk(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN CERTIFICATE-----") !== 0) throw TypeError("\"x509\" must be X.509 formatted string");
	return Jk(e, t, n);
}
async function Qk(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) throw TypeError("\"pkcs8\" must be PKCS#8 formatted string");
	return Kk(e, t, n);
}
async function $k(e, t) {
	if (!VO(e)) throw TypeError("JWK must be an object");
	switch (t ||= e.alg, e.kty) {
		case "oct":
			if (typeof e.k != "string" || !e.k) throw TypeError("missing \"k\" (Key Value) Parameter value");
			return WD(e.k);
		case "RSA": if ("oth" in e && e.oth !== void 0) throw new ZD("RSA JWK \"oth\" (Other Primes Info) Parameter value is not supported");
		case "EC":
		case "OKP": return bk({
			...e,
			alg: t
		});
		default: throw new ZD("Unsupported \"kty\" (Key Type) Parameter value");
	}
}
var eA = o((() => {
	GD(), Yk(), xk(), sO(), HO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/check_key_type.js
function tA(e, t, n, r) {
	t.startsWith("HS") || t === "dir" || t.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t) ? iA(t, n, r, e) : aA(t, n, r, e);
}
var nA, rA, iA, aA, oA, sA, cA = o((() => {
	AO(), NO(), vk(), nA = (e) => e?.[Symbol.toStringTag], rA = (e, t, n) => {
		if (t.use !== void 0 && t.use !== "sig") throw TypeError("Invalid key for this operation, when present its use must be sig");
		if (t.key_ops !== void 0 && t.key_ops.includes?.(n) !== !0) throw TypeError(`Invalid key for this operation, when present its key_ops must include ${n}`);
		if (t.alg !== void 0 && t.alg !== e) throw TypeError(`Invalid key for this operation, when present its alg must be ${e}`);
		return !0;
	}, iA = (e, t, n, r) => {
		if (!(t instanceof Uint8Array)) {
			if (r && mk(t)) {
				if (_k(t) && rA(e, t, n)) return;
				throw TypeError("JSON Web Key for symmetric algorithms must have JWK \"kty\" (Key Type) equal to \"oct\" and the JWK \"k\" (Key Value) present");
			}
			if (!jO(t)) throw TypeError(OO(e, t, ...MO, "Uint8Array", r ? "JSON Web Key" : null));
			if (t.type !== "secret") throw TypeError(`${nA(t)} instances for symmetric algorithms must be of type "secret"`);
		}
	}, aA = (e, t, n, r) => {
		if (r && mk(t)) switch (n) {
			case "sign":
				if (hk(t) && rA(e, t, n)) return;
				throw TypeError("JSON Web Key for this operation be a private JWK");
			case "verify":
				if (gk(t) && rA(e, t, n)) return;
				throw TypeError("JSON Web Key for this operation be a public JWK");
		}
		if (!jO(t)) throw TypeError(OO(e, t, ...MO, r ? "JSON Web Key" : null));
		if (t.type === "secret") throw TypeError(`${nA(t)} instances for asymmetric algorithms must not be of type "secret"`);
		if (n === "sign" && t.type === "public") throw TypeError(`${nA(t)} instances for asymmetric algorithm signing must be of type "private"`);
		if (n === "decrypt" && t.type === "public") throw TypeError(`${nA(t)} instances for asymmetric algorithm decryption must be of type "private"`);
		if (t.algorithm && n === "verify" && t.type === "private") throw TypeError(`${nA(t)} instances for asymmetric algorithm verifying must be of type "public"`);
		if (t.algorithm && n === "encrypt" && t.type === "private") throw TypeError(`${nA(t)} instances for asymmetric algorithm encryption must be of type "public"`);
	}, oA = tA.bind(void 0, !1), sA = tA.bind(void 0, !0);
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/encrypt.js
async function lA(e, t, n, r, i) {
	if (!(n instanceof Uint8Array)) throw TypeError(kO(n, "Uint8Array"));
	let a = parseInt(e.slice(1, 4), 10), o = await Z.subtle.importKey("raw", n.subarray(a >> 3), "AES-CBC", !1, ["encrypt"]), s = await Z.subtle.importKey("raw", n.subarray(0, a >> 3), {
		hash: `SHA-${a << 1}`,
		name: "HMAC"
	}, !1, ["sign"]), c = new Uint8Array(await Z.subtle.encrypt({
		iv: r,
		name: "AES-CBC"
	}, o, t)), l = AD(i, r, c, ND(i.length << 3));
	return {
		ciphertext: c,
		tag: new Uint8Array((await Z.subtle.sign("HMAC", s, l)).slice(0, a >> 3)),
		iv: r
	};
}
async function uA(e, t, n, r, i) {
	let a;
	n instanceof Uint8Array ? a = await Z.subtle.importKey("raw", n, "AES-GCM", !1, ["encrypt"]) : (TO(n, e, "encrypt"), a = n);
	let o = new Uint8Array(await Z.subtle.encrypt({
		additionalData: i,
		iv: r,
		name: "AES-GCM",
		tagLength: 128
	}, a, t)), s = o.slice(-16);
	return {
		ciphertext: o.slice(0, -16),
		tag: s,
		iv: r
	};
}
var dA, fA = o((() => {
	BD(), mO(), gO(), DD(), EO(), AO(), fO(), sO(), NO(), dA = async (e, t, n, r, i) => {
		if (!ED(n) && !(n instanceof Uint8Array)) throw TypeError(kO(n, ...MO, "Uint8Array"));
		switch (r ? pO(e, r) : r = dO(e), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512": return n instanceof Uint8Array && hO(n, parseInt(e.slice(-3), 10)), lA(e, t, n, r, i);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM": return n instanceof Uint8Array && hO(n, parseInt(e.slice(1, 4), 10)), uA(e, t, n, r, i);
			default: throw new ZD("Unsupported JWE Content Encryption Algorithm");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/aesgcmkw.js
async function pA(e, t, n, r) {
	let i = await dA(e.slice(0, 7), n, t, r, /* @__PURE__ */ new Uint8Array());
	return {
		encryptedKey: i.ciphertext,
		iv: HD(i.iv),
		tag: HD(i.tag)
	};
}
async function mA(e, t, n, r, i) {
	return IO(e.slice(0, 7), t, n, r, i, /* @__PURE__ */ new Uint8Array());
}
var hA = o((() => {
	fA(), LO(), GD();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/decrypt_key_management.js
async function gA(e, t, n, r, i) {
	switch (oA(e, t, "decrypt"), t = await kk.normalizePrivateKey?.(t, e) || t, e) {
		case "dir":
			if (n !== void 0) throw new Q("Encountered unexpected JWE Encrypted Key");
			return t;
		case "ECDH-ES": if (n !== void 0) throw new Q("Encountered unexpected JWE Encrypted Key");
		case "ECDH-ES+A128KW":
		case "ECDH-ES+A192KW":
		case "ECDH-ES+A256KW": {
			if (!VO(r.epk)) throw new Q("JOSE Header \"epk\" (Ephemeral Public Key) missing or invalid");
			if (!QO(t)) throw new ZD("ECDH with the provided key is not allowed or not supported by your javascript runtime");
			let i = await $k(r.epk, e), a, o;
			if (r.apu !== void 0) {
				if (typeof r.apu != "string") throw new Q("JOSE Header \"apu\" (Agreement PartyUInfo) invalid");
				try {
					a = WD(r.apu);
				} catch {
					throw new Q("Failed to base64url decode the apu");
				}
			}
			if (r.apv !== void 0) {
				if (typeof r.apv != "string") throw new Q("JOSE Header \"apv\" (Agreement PartyVInfo) invalid");
				try {
					o = WD(r.apv);
				} catch {
					throw new Q("Failed to base64url decode the apv");
				}
			}
			let s = await XO(i, t, e === "ECDH-ES" ? r.enc : e, e === "ECDH-ES" ? jk(r.enc) : parseInt(e.slice(-5, -2), 10), a, o);
			if (e === "ECDH-ES") return s;
			if (n === void 0) throw new Q("JWE Encrypted Key missing");
			return JO(e.slice(-6), s, n);
		}
		case "RSA1_5":
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512":
			if (n === void 0) throw new Q("JWE Encrypted Key missing");
			return fk(e, t, n);
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW": {
			if (n === void 0) throw new Q("JWE Encrypted Key missing");
			if (typeof r.p2c != "number") throw new Q("JOSE Header \"p2c\" (PBES2 Count) missing or invalid");
			let a = i?.maxPBES2Count || 1e4;
			if (r.p2c > a) throw new Q("JOSE Header \"p2c\" (PBES2 Count) out is of acceptable bounds");
			if (typeof r.p2s != "string") throw new Q("JOSE Header \"p2s\" (PBES2 Salt) missing or invalid");
			let o;
			try {
				o = WD(r.p2s);
			} catch {
				throw new Q("Failed to base64url decode the p2s");
			}
			return ak(e, t, n, r.p2c, o);
		}
		case "A128KW":
		case "A192KW":
		case "A256KW":
			if (n === void 0) throw new Q("JWE Encrypted Key missing");
			return JO(e, t, n);
		case "A128GCMKW":
		case "A192GCMKW":
		case "A256GCMKW": {
			if (n === void 0) throw new Q("JWE Encrypted Key missing");
			if (typeof r.iv != "string") throw new Q("JOSE Header \"iv\" (Initialization Vector) missing or invalid");
			if (typeof r.tag != "string") throw new Q("JOSE Header \"tag\" (Authentication Tag) missing or invalid");
			let i;
			try {
				i = WD(r.iv);
			} catch {
				throw new Q("Failed to base64url decode the iv");
			}
			let a;
			try {
				a = WD(r.tag);
			} catch {
				throw new Q("Failed to base64url decode the tag");
			}
			return mA(e, t, n, i, a);
		}
		default: throw new ZD("Invalid or unsupported \"alg\" (JWE Algorithm) header value");
	}
}
var _A = o((() => {
	YO(), $O(), ok(), pk(), GD(), Ak(), sO(), Nk(), eA(), cA(), HO(), hA();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/validate_crit.js
function vA(e, t, n, r, i) {
	if (i.crit !== void 0 && r?.crit === void 0) throw new e("\"crit\" (Critical) Header Parameter MUST be integrity protected");
	if (!r || r.crit === void 0) return /* @__PURE__ */ new Set();
	if (!Array.isArray(r.crit) || r.crit.length === 0 || r.crit.some((e) => typeof e != "string" || e.length === 0)) throw new e("\"crit\" (Critical) Header Parameter MUST be an array of non-empty strings when present");
	let a;
	a = n === void 0 ? t : new Map([...Object.entries(n), ...t.entries()]);
	for (let t of r.crit) {
		if (!a.has(t)) throw new ZD(`Extension Header Parameter "${t}" is not recognized`);
		if (i[t] === void 0) throw new e(`Extension Header Parameter "${t}" is missing`);
		if (a.get(t) && r[t] === void 0) throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`);
	}
	return new Set(r.crit);
}
var yA = o((() => {
	sO();
})), bA, xA = o((() => {
	bA = (e, t) => {
		if (t !== void 0 && (!Array.isArray(t) || t.some((e) => typeof e != "string"))) throw TypeError(`"${e}" option must be an array of strings`);
		if (t) return new Set(t);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/flattened/decrypt.js
async function SA(e, t, n) {
	if (!VO(e)) throw new Q("Flattened JWE must be an object");
	if (e.protected === void 0 && e.header === void 0 && e.unprotected === void 0) throw new Q("JOSE Header missing");
	if (e.iv !== void 0 && typeof e.iv != "string") throw new Q("JWE Initialization Vector incorrect type");
	if (typeof e.ciphertext != "string") throw new Q("JWE Ciphertext missing or incorrect type");
	if (e.tag !== void 0 && typeof e.tag != "string") throw new Q("JWE Authentication Tag incorrect type");
	if (e.protected !== void 0 && typeof e.protected != "string") throw new Q("JWE Protected Header incorrect type");
	if (e.encrypted_key !== void 0 && typeof e.encrypted_key != "string") throw new Q("JWE Encrypted Key incorrect type");
	if (e.aad !== void 0 && typeof e.aad != "string") throw new Q("JWE AAD incorrect type");
	if (e.header !== void 0 && !VO(e.header)) throw new Q("JWE Shared Unprotected Header incorrect type");
	if (e.unprotected !== void 0 && !VO(e.unprotected)) throw new Q("JWE Per-Recipient Unprotected Header incorrect type");
	let r;
	if (e.protected) try {
		let t = WD(e.protected);
		r = JSON.parse(RD.decode(t));
	} catch {
		throw new Q("JWE Protected Header is invalid");
	}
	if (!RO(r, e.header, e.unprotected)) throw new Q("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
	let i = {
		...r,
		...e.header,
		...e.unprotected
	};
	if (vA(Q, /* @__PURE__ */ new Map(), n?.crit, r, i), i.zip !== void 0) throw new ZD("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
	let { alg: a, enc: o } = i;
	if (typeof a != "string" || !a) throw new Q("missing JWE Algorithm (alg) in JWE Header");
	if (typeof o != "string" || !o) throw new Q("missing JWE Encryption Algorithm (enc) in JWE Header");
	let s = n && bA("keyManagementAlgorithms", n.keyManagementAlgorithms), c = n && bA("contentEncryptionAlgorithms", n.contentEncryptionAlgorithms);
	if (s && !s.has(a) || !s && a.startsWith("PBES2")) throw new XD("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (c && !c.has(o)) throw new XD("\"enc\" (Encryption Algorithm) Header Parameter value not allowed");
	let l;
	if (e.encrypted_key !== void 0) try {
		l = WD(e.encrypted_key);
	} catch {
		throw new Q("Failed to base64url decode the encrypted_key");
	}
	let u = !1;
	typeof t == "function" && (t = await t(r, e), u = !0);
	let d;
	try {
		d = await gA(a, t, l, i, n);
	} catch (e) {
		if (e instanceof TypeError || e instanceof Q || e instanceof ZD) throw e;
		d = Mk(o);
	}
	let f, p;
	if (e.iv !== void 0) try {
		f = WD(e.iv);
	} catch {
		throw new Q("Failed to base64url decode the iv");
	}
	if (e.tag !== void 0) try {
		p = WD(e.tag);
	} catch {
		throw new Q("Failed to base64url decode the tag");
	}
	let m = LD.encode(e.protected ?? ""), h;
	h = e.aad === void 0 ? m : AD(m, LD.encode("."), LD.encode(e.aad));
	let g;
	try {
		g = WD(e.ciphertext);
	} catch {
		throw new Q("Failed to base64url decode the ciphertext");
	}
	let _ = { plaintext: await IO(o, d, g, f, p, h) };
	if (e.protected !== void 0 && (_.protectedHeader = r), e.aad !== void 0) try {
		_.additionalAuthenticatedData = WD(e.aad);
	} catch {
		throw new Q("Failed to base64url decode the aad");
	}
	return e.unprotected !== void 0 && (_.sharedUnprotectedHeader = e.unprotected), e.header !== void 0 && (_.unprotectedHeader = e.header), u ? {
		..._,
		key: t
	} : _;
}
var CA = o((() => {
	GD(), LO(), sO(), zO(), HO(), _A(), BD(), Nk(), yA(), xA();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/compact/decrypt.js
async function wA(e, t, n) {
	if (e instanceof Uint8Array && (e = RD.decode(e)), typeof e != "string") throw new Q("Compact JWE must be a string or Uint8Array");
	let { 0: r, 1: i, 2: a, 3: o, 4: s, length: c } = e.split(".");
	if (c !== 5) throw new Q("Invalid Compact JWE");
	let l = await SA({
		ciphertext: o,
		iv: a || void 0,
		protected: r,
		tag: s || void 0,
		encrypted_key: i || void 0
	}, t, n), u = {
		plaintext: l.plaintext,
		protectedHeader: l.protectedHeader
	};
	return typeof t == "function" ? {
		...u,
		key: l.key
	} : u;
}
var TA = o((() => {
	CA(), sO(), BD();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/general/decrypt.js
async function EA(e, t, n) {
	if (!VO(e)) throw new Q("General JWE must be an object");
	if (!Array.isArray(e.recipients) || !e.recipients.every(VO)) throw new Q("JWE Recipients missing or incorrect type");
	if (!e.recipients.length) throw new Q("JWE Recipients has no members");
	for (let r of e.recipients) try {
		return await SA({
			aad: e.aad,
			ciphertext: e.ciphertext,
			encrypted_key: r.encrypted_key,
			header: r.header,
			iv: e.iv,
			protected: e.protected,
			tag: e.tag,
			unprotected: e.unprotected
		}, t, n);
	} catch {}
	throw new QD();
}
var DA = o((() => {
	CA(), sO(), HO();
})), OA, kA = o((() => {
	OA = Symbol();
})), AA, jA = o((() => {
	DD(), AO(), GD(), NO(), AA = async (e) => {
		if (e instanceof Uint8Array) return {
			kty: "oct",
			k: HD(e)
		};
		if (!ED(e)) throw TypeError(kO(e, ...MO, "Uint8Array"));
		if (!e.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
		let { ext: t, key_ops: n, alg: r, use: i, ...a } = await Z.subtle.exportKey("jwk", e);
		return a;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/export.js
async function MA(e) {
	return Vk(e);
}
async function NA(e) {
	return Hk(e);
}
async function PA(e) {
	return AA(e);
}
var FA = o((() => {
	Yk(), jA();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/encrypt_key_management.js
async function IA(e, t, n, r, i = {}) {
	let a, o, s;
	switch (oA(e, n, "encrypt"), n = await kk.normalizePublicKey?.(n, e) || n, e) {
		case "dir":
			s = n;
			break;
		case "ECDH-ES":
		case "ECDH-ES+A128KW":
		case "ECDH-ES+A192KW":
		case "ECDH-ES+A256KW": {
			if (!QO(n)) throw new ZD("ECDH with the provided key is not allowed or not supported by your javascript runtime");
			let { apu: c, apv: l } = i, { epk: u } = i;
			u ||= (await ZO(n)).privateKey;
			let { x: d, y: f, crv: p, kty: m } = await PA(u), h = await XO(n, u, e === "ECDH-ES" ? t : e, e === "ECDH-ES" ? jk(t) : parseInt(e.slice(-5, -2), 10), c, l);
			if (o = { epk: {
				x: d,
				crv: p,
				kty: m
			} }, m === "EC" && (o.epk.y = f), c && (o.apu = HD(c)), l && (o.apv = HD(l)), e === "ECDH-ES") {
				s = h;
				break;
			}
			s = r || Mk(t), a = await qO(e.slice(-6), h, s);
			break;
		}
		case "RSA1_5":
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512":
			s = r || Mk(t), a = await dk(e, n, s);
			break;
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW": {
			s = r || Mk(t);
			let { p2c: c, p2s: l } = i;
			({encryptedKey: a, ...o} = await ik(e, n, s, c, l));
			break;
		}
		case "A128KW":
		case "A192KW":
		case "A256KW":
			s = r || Mk(t), a = await qO(e, n, s);
			break;
		case "A128GCMKW":
		case "A192GCMKW":
		case "A256GCMKW": {
			s = r || Mk(t);
			let { iv: c } = i;
			({encryptedKey: a, ...o} = await pA(e, n, s, c));
			break;
		}
		default: throw new ZD("Invalid or unsupported \"alg\" (JWE Algorithm) header value");
	}
	return {
		cek: s,
		encryptedKey: a,
		parameters: o
	};
}
var LA = o((() => {
	YO(), $O(), ok(), pk(), GD(), Ak(), Nk(), sO(), FA(), cA(), hA();
})), RA, zA = o((() => {
	GD(), kA(), fA(), LA(), sO(), zO(), BD(), yA(), RA = class {
		constructor(e) {
			if (!(e instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
			this._plaintext = e;
		}
		setKeyManagementParameters(e) {
			if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
			return this._keyManagementParameters = e, this;
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this;
		}
		setSharedUnprotectedHeader(e) {
			if (this._sharedUnprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
			return this._sharedUnprotectedHeader = e, this;
		}
		setUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this;
		}
		setAdditionalAuthenticatedData(e) {
			return this._aad = e, this;
		}
		setContentEncryptionKey(e) {
			if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
			return this._cek = e, this;
		}
		setInitializationVector(e) {
			if (this._iv) throw TypeError("setInitializationVector can only be called once");
			return this._iv = e, this;
		}
		async encrypt(e, t) {
			if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) throw new Q("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
			if (!RO(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) throw new Q("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
			let n = {
				...this._protectedHeader,
				...this._unprotectedHeader,
				...this._sharedUnprotectedHeader
			};
			if (vA(Q, /* @__PURE__ */ new Map(), t?.crit, this._protectedHeader, n), n.zip !== void 0) throw new ZD("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
			let { alg: r, enc: i } = n;
			if (typeof r != "string" || !r) throw new Q("JWE \"alg\" (Algorithm) Header Parameter missing or invalid");
			if (typeof i != "string" || !i) throw new Q("JWE \"enc\" (Encryption Algorithm) Header Parameter missing or invalid");
			let a;
			if (this._cek && (r === "dir" || r === "ECDH-ES")) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${r}`);
			let o;
			{
				let n;
				({cek: o, encryptedKey: a, parameters: n} = await IA(r, i, e, this._cek, this._keyManagementParameters)), n && (t && OA in t ? this._unprotectedHeader ? this._unprotectedHeader = {
					...this._unprotectedHeader,
					...n
				} : this.setUnprotectedHeader(n) : this._protectedHeader ? this._protectedHeader = {
					...this._protectedHeader,
					...n
				} : this.setProtectedHeader(n));
			}
			let s, c, l;
			c = this._protectedHeader ? LD.encode(HD(JSON.stringify(this._protectedHeader))) : LD.encode(""), this._aad ? (l = HD(this._aad), s = AD(c, LD.encode("."), LD.encode(l))) : s = c;
			let { ciphertext: u, tag: d, iv: f } = await dA(i, this._plaintext, o, this._iv, s), p = { ciphertext: HD(u) };
			return f && (p.iv = HD(f)), d && (p.tag = HD(d)), a && (p.encrypted_key = HD(a)), l && (p.aad = l), this._protectedHeader && (p.protected = RD.decode(c)), this._sharedUnprotectedHeader && (p.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (p.header = this._unprotectedHeader), p;
		}
	};
})), BA, VA, HA = o((() => {
	zA(), kA(), sO(), Nk(), zO(), LA(), GD(), yA(), BA = class {
		constructor(e, t, n) {
			this.parent = e, this.key = t, this.options = n;
		}
		setUnprotectedHeader(e) {
			if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this.unprotectedHeader = e, this;
		}
		addRecipient(...e) {
			return this.parent.addRecipient(...e);
		}
		encrypt(...e) {
			return this.parent.encrypt(...e);
		}
		done() {
			return this.parent;
		}
	}, VA = class {
		constructor(e) {
			this._recipients = [], this._plaintext = e;
		}
		addRecipient(e, t) {
			let n = new BA(this, e, { crit: t?.crit });
			return this._recipients.push(n), n;
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this;
		}
		setSharedUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this;
		}
		setAdditionalAuthenticatedData(e) {
			return this._aad = e, this;
		}
		async encrypt() {
			if (!this._recipients.length) throw new Q("at least one recipient must be added");
			if (this._recipients.length === 1) {
				let [e] = this._recipients, t = await new RA(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(e.unprotectedHeader).encrypt(e.key, { ...e.options }), n = {
					ciphertext: t.ciphertext,
					iv: t.iv,
					recipients: [{}],
					tag: t.tag
				};
				return t.aad && (n.aad = t.aad), t.protected && (n.protected = t.protected), t.unprotected && (n.unprotected = t.unprotected), t.encrypted_key && (n.recipients[0].encrypted_key = t.encrypted_key), t.header && (n.recipients[0].header = t.header), n;
			}
			let e;
			for (let t = 0; t < this._recipients.length; t++) {
				let n = this._recipients[t];
				if (!RO(this._protectedHeader, this._unprotectedHeader, n.unprotectedHeader)) throw new Q("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
				let r = {
					...this._protectedHeader,
					...this._unprotectedHeader,
					...n.unprotectedHeader
				}, { alg: i } = r;
				if (typeof i != "string" || !i) throw new Q("JWE \"alg\" (Algorithm) Header Parameter missing or invalid");
				if (i === "dir" || i === "ECDH-ES") throw new Q("\"dir\" and \"ECDH-ES\" alg may only be used with a single recipient");
				if (typeof r.enc != "string" || !r.enc) throw new Q("JWE \"enc\" (Encryption Algorithm) Header Parameter missing or invalid");
				if (!e) e = r.enc;
				else if (e !== r.enc) throw new Q("JWE \"enc\" (Encryption Algorithm) Header Parameter must be the same for all recipients");
				if (vA(Q, /* @__PURE__ */ new Map(), n.options.crit, this._protectedHeader, r), r.zip !== void 0) throw new ZD("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
			}
			let t = Mk(e), n = {
				ciphertext: "",
				iv: "",
				recipients: [],
				tag: ""
			};
			for (let r = 0; r < this._recipients.length; r++) {
				let i = this._recipients[r], a = {};
				n.recipients.push(a);
				let o = {
					...this._protectedHeader,
					...this._unprotectedHeader,
					...i.unprotectedHeader
				}.alg.startsWith("PBES2") ? 2048 + r : void 0;
				if (r === 0) {
					let e = await new RA(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(t).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(i.unprotectedHeader).setKeyManagementParameters({ p2c: o }).encrypt(i.key, {
						...i.options,
						[OA]: !0
					});
					n.ciphertext = e.ciphertext, n.iv = e.iv, n.tag = e.tag, e.aad && (n.aad = e.aad), e.protected && (n.protected = e.protected), e.unprotected && (n.unprotected = e.unprotected), a.encrypted_key = e.encrypted_key, e.header && (a.header = e.header);
					continue;
				}
				let { encryptedKey: s, parameters: c } = await IA(i.unprotectedHeader?.alg || this._protectedHeader?.alg || this._unprotectedHeader?.alg, e, i.key, t, { p2c: o });
				a.encrypted_key = HD(s), (i.unprotectedHeader || c) && (a.header = {
					...i.unprotectedHeader,
					...c
				});
			}
			return n;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/subtle_dsa.js
function UA(e, t) {
	let n = `SHA-${e.slice(-3)}`;
	switch (e) {
		case "HS256":
		case "HS384":
		case "HS512": return {
			hash: n,
			name: "HMAC"
		};
		case "PS256":
		case "PS384":
		case "PS512": return {
			hash: n,
			name: "RSA-PSS",
			saltLength: e.slice(-3) >> 3
		};
		case "RS256":
		case "RS384":
		case "RS512": return {
			hash: n,
			name: "RSASSA-PKCS1-v1_5"
		};
		case "ES256":
		case "ES384":
		case "ES512": return {
			hash: n,
			name: "ECDSA",
			namedCurve: t.namedCurve
		};
		case "Ed25519": return { name: "Ed25519" };
		case "EdDSA": return { name: t.name };
		default: throw new ZD(`alg ${e} is not supported either by JOSE or your javascript runtime`);
	}
}
var WA = o((() => {
	sO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
async function GA(e, t, n) {
	if (n === "sign" && (t = await kk.normalizePrivateKey(t, e)), n === "verify" && (t = await kk.normalizePublicKey(t, e)), ED(t)) return wO(t, e, n), t;
	if (t instanceof Uint8Array) {
		if (!e.startsWith("HS")) throw TypeError(kO(t, ...MO));
		return Z.subtle.importKey("raw", t, {
			hash: `SHA-${e.slice(-3)}`,
			name: "HMAC"
		}, !1, [n]);
	}
	throw TypeError(kO(t, ...MO, "Uint8Array", "JSON Web Key"));
}
var KA = o((() => {
	DD(), EO(), AO(), NO(), Ak();
})), qA, JA = o((() => {
	WA(), DD(), uk(), KA(), qA = async (e, t, n, r) => {
		let i = await GA(e, t, "verify");
		lk(e, i);
		let a = UA(e, i.algorithm);
		try {
			return await Z.subtle.verify(a, i, n, r);
		} catch {
			return !1;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/flattened/verify.js
async function YA(e, t, n) {
	if (!VO(e)) throw new $D("Flattened JWS must be an object");
	if (e.protected === void 0 && e.header === void 0) throw new $D("Flattened JWS must have either of the \"protected\" or \"header\" members");
	if (e.protected !== void 0 && typeof e.protected != "string") throw new $D("JWS Protected Header incorrect type");
	if (e.payload === void 0) throw new $D("JWS Payload missing");
	if (typeof e.signature != "string") throw new $D("JWS Signature missing or incorrect type");
	if (e.header !== void 0 && !VO(e.header)) throw new $D("JWS Unprotected Header incorrect type");
	let r = {};
	if (e.protected) try {
		let t = WD(e.protected);
		r = JSON.parse(RD.decode(t));
	} catch {
		throw new $D("JWS Protected Header is invalid");
	}
	if (!RO(r, e.header)) throw new $D("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
	let i = {
		...r,
		...e.header
	}, a = vA($D, /* @__PURE__ */ new Map([["b64", !0]]), n?.crit, r, i), o = !0;
	if (a.has("b64") && (o = r.b64, typeof o != "boolean")) throw new $D("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
	let { alg: s } = i;
	if (typeof s != "string" || !s) throw new $D("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
	let c = n && bA("algorithms", n.algorithms);
	if (c && !c.has(s)) throw new XD("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (o) {
		if (typeof e.payload != "string") throw new $D("JWS Payload must be a string");
	} else if (typeof e.payload != "string" && !(e.payload instanceof Uint8Array)) throw new $D("JWS Payload must be a string or an Uint8Array instance");
	let l = !1;
	typeof t == "function" ? (t = await t(r, e), l = !0, sA(s, t, "verify"), mk(t) && (t = await $k(t, s))) : sA(s, t, "verify");
	let u = AD(LD.encode(e.protected ?? ""), LD.encode("."), typeof e.payload == "string" ? LD.encode(e.payload) : e.payload), d;
	try {
		d = WD(e.signature);
	} catch {
		throw new $D("Failed to base64url decode the signature");
	}
	if (!await qA(s, t, d, u)) throw new oO();
	let f;
	if (o) try {
		f = WD(e.payload);
	} catch {
		throw new $D("Failed to base64url decode the payload");
	}
	else f = typeof e.payload == "string" ? LD.encode(e.payload) : e.payload;
	let p = { payload: f };
	return e.protected !== void 0 && (p.protectedHeader = r), e.header !== void 0 && (p.unprotectedHeader = e.header), l ? {
		...p,
		key: t
	} : p;
}
var XA = o((() => {
	GD(), JA(), sO(), BD(), zO(), HO(), cA(), yA(), xA(), vk(), eA();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/compact/verify.js
async function ZA(e, t, n) {
	if (e instanceof Uint8Array && (e = RD.decode(e)), typeof e != "string") throw new $D("Compact JWS must be a string or Uint8Array");
	let { 0: r, 1: i, 2: a, length: o } = e.split(".");
	if (o !== 3) throw new $D("Invalid Compact JWS");
	let s = await YA({
		payload: i,
		protected: r,
		signature: a
	}, t, n), c = {
		payload: s.payload,
		protectedHeader: s.protectedHeader
	};
	return typeof t == "function" ? {
		...c,
		key: s.key
	} : c;
}
var QA = o((() => {
	XA(), sO(), BD();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/general/verify.js
async function $A(e, t, n) {
	if (!VO(e)) throw new $D("General JWS must be an object");
	if (!Array.isArray(e.signatures) || !e.signatures.every(VO)) throw new $D("JWS Signatures missing or incorrect type");
	for (let r of e.signatures) try {
		return await YA({
			header: r.header,
			payload: e.payload,
			protected: r.protected,
			signature: r.signature
		}, t, n);
	} catch {}
	throw new oO();
}
var ej = o((() => {
	XA(), sO(), HO();
})), tj, nj = o((() => {
	tj = (e) => Math.floor(e.getTime() / 1e3);
})), rj, ij, aj, oj, sj, cj, lj, uj = o((() => {
	rj = 60, ij = rj * 60, aj = ij * 24, oj = aj * 7, sj = aj * 365.25, cj = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, lj = (e) => {
		let t = cj.exec(e);
		if (!t || t[4] && t[1]) throw TypeError("Invalid time period format");
		let n = parseFloat(t[2]), r = t[3].toLowerCase(), i;
		switch (r) {
			case "sec":
			case "secs":
			case "second":
			case "seconds":
			case "s":
				i = Math.round(n);
				break;
			case "minute":
			case "minutes":
			case "min":
			case "mins":
			case "m":
				i = Math.round(n * rj);
				break;
			case "hour":
			case "hours":
			case "hr":
			case "hrs":
			case "h":
				i = Math.round(n * ij);
				break;
			case "day":
			case "days":
			case "d":
				i = Math.round(n * aj);
				break;
			case "week":
			case "weeks":
			case "w":
				i = Math.round(n * oj);
				break;
			default:
				i = Math.round(n * sj);
				break;
		}
		return t[1] === "-" || t[4] === "ago" ? -i : i;
	};
})), dj, fj, pj, mj = o((() => {
	sO(), BD(), nj(), uj(), HO(), dj = (e) => e.toLowerCase().replace(/^application\//, ""), fj = (e, t) => typeof e == "string" ? t.includes(e) : Array.isArray(e) ? t.some(Set.prototype.has.bind(new Set(e))) : !1, pj = (e, t, n = {}) => {
		let r;
		try {
			r = JSON.parse(RD.decode(t));
		} catch {}
		if (!VO(r)) throw new eO("JWT Claims Set must be a top-level JSON object");
		let { typ: i } = n;
		if (i && (typeof e.typ != "string" || dj(e.typ) !== dj(i))) throw new JD("unexpected \"typ\" JWT header value", r, "typ", "check_failed");
		let { requiredClaims: a = [], issuer: o, subject: s, audience: c, maxTokenAge: l } = n, u = [...a];
		l !== void 0 && u.push("iat"), c !== void 0 && u.push("aud"), s !== void 0 && u.push("sub"), o !== void 0 && u.push("iss");
		for (let e of new Set(u.reverse())) if (!(e in r)) throw new JD(`missing required "${e}" claim`, r, e, "missing");
		if (o && !(Array.isArray(o) ? o : [o]).includes(r.iss)) throw new JD("unexpected \"iss\" claim value", r, "iss", "check_failed");
		if (s && r.sub !== s) throw new JD("unexpected \"sub\" claim value", r, "sub", "check_failed");
		if (c && !fj(r.aud, typeof c == "string" ? [c] : c)) throw new JD("unexpected \"aud\" claim value", r, "aud", "check_failed");
		let d;
		switch (typeof n.clockTolerance) {
			case "string":
				d = lj(n.clockTolerance);
				break;
			case "number":
				d = n.clockTolerance;
				break;
			case "undefined":
				d = 0;
				break;
			default: throw TypeError("Invalid clockTolerance option type");
		}
		let { currentDate: f } = n, p = tj(f || /* @__PURE__ */ new Date());
		if ((r.iat !== void 0 || l) && typeof r.iat != "number") throw new JD("\"iat\" claim must be a number", r, "iat", "invalid");
		if (r.nbf !== void 0) {
			if (typeof r.nbf != "number") throw new JD("\"nbf\" claim must be a number", r, "nbf", "invalid");
			if (r.nbf > p + d) throw new JD("\"nbf\" claim timestamp check failed", r, "nbf", "check_failed");
		}
		if (r.exp !== void 0) {
			if (typeof r.exp != "number") throw new JD("\"exp\" claim must be a number", r, "exp", "invalid");
			if (r.exp <= p - d) throw new YD("\"exp\" claim timestamp check failed", r, "exp", "check_failed");
		}
		if (l) {
			let e = p - r.iat, t = typeof l == "number" ? l : lj(l);
			if (e - d > t) throw new YD("\"iat\" claim timestamp check failed (too far in the past)", r, "iat", "check_failed");
			if (e < 0 - d) throw new JD("\"iat\" claim timestamp check failed (it should be in the past)", r, "iat", "check_failed");
		}
		return r;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/verify.js
async function hj(e, t, n) {
	let r = await ZA(e, t, n);
	if (r.protectedHeader.crit?.includes("b64") && r.protectedHeader.b64 === !1) throw new eO("JWTs MUST NOT use unencoded payload");
	let i = {
		payload: pj(r.protectedHeader, r.payload, n),
		protectedHeader: r.protectedHeader
	};
	return typeof t == "function" ? {
		...i,
		key: r.key
	} : i;
}
var gj = o((() => {
	QA(), mj(), sO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/decrypt.js
async function _j(e, t, n) {
	let r = await wA(e, t, n), i = pj(r.protectedHeader, r.plaintext, n), { protectedHeader: a } = r;
	if (a.iss !== void 0 && a.iss !== i.iss) throw new JD("replicated \"iss\" claim header parameter mismatch", i, "iss", "mismatch");
	if (a.sub !== void 0 && a.sub !== i.sub) throw new JD("replicated \"sub\" claim header parameter mismatch", i, "sub", "mismatch");
	if (a.aud !== void 0 && JSON.stringify(a.aud) !== JSON.stringify(i.aud)) throw new JD("replicated \"aud\" claim header parameter mismatch", i, "aud", "mismatch");
	let o = {
		payload: i,
		protectedHeader: a
	};
	return typeof t == "function" ? {
		...o,
		key: r.key
	} : o;
}
var vj = o((() => {
	TA(), mj(), sO();
})), yj, bj = o((() => {
	zA(), yj = class {
		constructor(e) {
			this._flattened = new RA(e);
		}
		setContentEncryptionKey(e) {
			return this._flattened.setContentEncryptionKey(e), this;
		}
		setInitializationVector(e) {
			return this._flattened.setInitializationVector(e), this;
		}
		setProtectedHeader(e) {
			return this._flattened.setProtectedHeader(e), this;
		}
		setKeyManagementParameters(e) {
			return this._flattened.setKeyManagementParameters(e), this;
		}
		async encrypt(e, t) {
			let n = await this._flattened.encrypt(e, t);
			return [
				n.protected,
				n.encrypted_key,
				n.iv,
				n.ciphertext,
				n.tag
			].join(".");
		}
	};
})), xj, Sj = o((() => {
	WA(), DD(), uk(), KA(), xj = async (e, t, n) => {
		let r = await GA(e, t, "sign");
		lk(e, r);
		let i = await Z.subtle.sign(UA(e, r.algorithm), r, n);
		return new Uint8Array(i);
	};
})), Cj, wj = o((() => {
	GD(), Sj(), zO(), sO(), BD(), cA(), yA(), Cj = class {
		constructor(e) {
			if (!(e instanceof Uint8Array)) throw TypeError("payload must be an instance of Uint8Array");
			this._payload = e;
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this;
		}
		setUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this;
		}
		async sign(e, t) {
			if (!this._protectedHeader && !this._unprotectedHeader) throw new $D("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
			if (!RO(this._protectedHeader, this._unprotectedHeader)) throw new $D("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
			let n = {
				...this._protectedHeader,
				...this._unprotectedHeader
			}, r = vA($D, /* @__PURE__ */ new Map([["b64", !0]]), t?.crit, this._protectedHeader, n), i = !0;
			if (r.has("b64") && (i = this._protectedHeader.b64, typeof i != "boolean")) throw new $D("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
			let { alg: a } = n;
			if (typeof a != "string" || !a) throw new $D("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
			sA(a, e, "sign");
			let o = this._payload;
			i && (o = LD.encode(HD(o)));
			let s;
			s = this._protectedHeader ? LD.encode(HD(JSON.stringify(this._protectedHeader))) : LD.encode("");
			let c = {
				signature: HD(await xj(a, e, AD(s, LD.encode("."), o))),
				payload: ""
			};
			return i && (c.payload = RD.decode(o)), this._unprotectedHeader && (c.header = this._unprotectedHeader), this._protectedHeader && (c.protected = RD.decode(s)), c;
		}
	};
})), Tj, Ej = o((() => {
	wj(), Tj = class {
		constructor(e) {
			this._flattened = new Cj(e);
		}
		setProtectedHeader(e) {
			return this._flattened.setProtectedHeader(e), this;
		}
		async sign(e, t) {
			let n = await this._flattened.sign(e, t);
			if (n.payload === void 0) throw TypeError("use the flattened module for creating JWS with b64: false");
			return `${n.protected}.${n.payload}.${n.signature}`;
		}
	};
})), Dj, Oj, kj = o((() => {
	wj(), sO(), Dj = class {
		constructor(e, t, n) {
			this.parent = e, this.key = t, this.options = n;
		}
		setProtectedHeader(e) {
			if (this.protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this.protectedHeader = e, this;
		}
		setUnprotectedHeader(e) {
			if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this.unprotectedHeader = e, this;
		}
		addSignature(...e) {
			return this.parent.addSignature(...e);
		}
		sign(...e) {
			return this.parent.sign(...e);
		}
		done() {
			return this.parent;
		}
	}, Oj = class {
		constructor(e) {
			this._signatures = [], this._payload = e;
		}
		addSignature(e, t) {
			let n = new Dj(this, e, t);
			return this._signatures.push(n), n;
		}
		async sign() {
			if (!this._signatures.length) throw new $D("at least one signature must be added");
			let e = {
				signatures: [],
				payload: ""
			};
			for (let t = 0; t < this._signatures.length; t++) {
				let n = this._signatures[t], r = new Cj(this._payload);
				r.setProtectedHeader(n.protectedHeader), r.setUnprotectedHeader(n.unprotectedHeader);
				let { payload: i, ...a } = await r.sign(n.key, n.options);
				if (t === 0) e.payload = i;
				else if (e.payload !== i) throw new $D("inconsistent use of JWS Unencoded Payload (RFC7797)");
				e.signatures.push(a);
			}
			return e;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/produce.js
function Aj(e, t) {
	if (!Number.isFinite(t)) throw TypeError(`Invalid ${e} input`);
	return t;
}
var jj, Mj = o((() => {
	nj(), HO(), uj(), jj = class {
		constructor(e = {}) {
			if (!VO(e)) throw TypeError("JWT Claims Set MUST be an object");
			this._payload = e;
		}
		setIssuer(e) {
			return this._payload = {
				...this._payload,
				iss: e
			}, this;
		}
		setSubject(e) {
			return this._payload = {
				...this._payload,
				sub: e
			}, this;
		}
		setAudience(e) {
			return this._payload = {
				...this._payload,
				aud: e
			}, this;
		}
		setJti(e) {
			return this._payload = {
				...this._payload,
				jti: e
			}, this;
		}
		setNotBefore(e) {
			return typeof e == "number" ? this._payload = {
				...this._payload,
				nbf: Aj("setNotBefore", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				nbf: Aj("setNotBefore", tj(e))
			} : this._payload = {
				...this._payload,
				nbf: tj(/* @__PURE__ */ new Date()) + lj(e)
			}, this;
		}
		setExpirationTime(e) {
			return typeof e == "number" ? this._payload = {
				...this._payload,
				exp: Aj("setExpirationTime", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				exp: Aj("setExpirationTime", tj(e))
			} : this._payload = {
				...this._payload,
				exp: tj(/* @__PURE__ */ new Date()) + lj(e)
			}, this;
		}
		setIssuedAt(e) {
			return e === void 0 ? this._payload = {
				...this._payload,
				iat: tj(/* @__PURE__ */ new Date())
			} : e instanceof Date ? this._payload = {
				...this._payload,
				iat: Aj("setIssuedAt", tj(e))
			} : typeof e == "string" ? this._payload = {
				...this._payload,
				iat: Aj("setIssuedAt", tj(/* @__PURE__ */ new Date()) + lj(e))
			} : this._payload = {
				...this._payload,
				iat: Aj("setIssuedAt", e)
			}, this;
		}
	};
})), Nj, Pj = o((() => {
	Ej(), sO(), BD(), Mj(), Nj = class extends jj {
		setProtectedHeader(e) {
			return this._protectedHeader = e, this;
		}
		async sign(e, t) {
			let n = new Tj(LD.encode(JSON.stringify(this._payload)));
			if (n.setProtectedHeader(this._protectedHeader), Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1) throw new eO("JWTs MUST NOT use unencoded payload");
			return n.sign(e, t);
		}
	};
})), Fj, Ij = o((() => {
	bj(), BD(), Mj(), Fj = class extends jj {
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this;
		}
		setKeyManagementParameters(e) {
			if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
			return this._keyManagementParameters = e, this;
		}
		setContentEncryptionKey(e) {
			if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
			return this._cek = e, this;
		}
		setInitializationVector(e) {
			if (this._iv) throw TypeError("setInitializationVector can only be called once");
			return this._iv = e, this;
		}
		replicateIssuerAsHeader() {
			return this._replicateIssuerAsHeader = !0, this;
		}
		replicateSubjectAsHeader() {
			return this._replicateSubjectAsHeader = !0, this;
		}
		replicateAudienceAsHeader() {
			return this._replicateAudienceAsHeader = !0, this;
		}
		async encrypt(e, t) {
			let n = new yj(LD.encode(JSON.stringify(this._payload)));
			return this._replicateIssuerAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				iss: this._payload.iss
			}), this._replicateSubjectAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				sub: this._payload.sub
			}), this._replicateAudienceAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				aud: this._payload.aud
			}), n.setProtectedHeader(this._protectedHeader), this._iv && n.setInitializationVector(this._iv), this._cek && n.setContentEncryptionKey(this._cek), this._keyManagementParameters && n.setKeyManagementParameters(this._keyManagementParameters), n.encrypt(e, t);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwk/thumbprint.js
async function Lj(e, t) {
	if (!VO(e)) throw TypeError("JWK must be an object");
	if (t ??= "sha256", t !== "sha256" && t !== "sha384" && t !== "sha512") throw TypeError("digestAlgorithm must one of \"sha256\", \"sha384\", or \"sha512\"");
	let n;
	switch (e.kty) {
		case "EC":
			zj(e.crv, "\"crv\" (Curve) Parameter"), zj(e.x, "\"x\" (X Coordinate) Parameter"), zj(e.y, "\"y\" (Y Coordinate) Parameter"), n = {
				crv: e.crv,
				kty: e.kty,
				x: e.x,
				y: e.y
			};
			break;
		case "OKP":
			zj(e.crv, "\"crv\" (Subtype of Key Pair) Parameter"), zj(e.x, "\"x\" (Public Key) Parameter"), n = {
				crv: e.crv,
				kty: e.kty,
				x: e.x
			};
			break;
		case "RSA":
			zj(e.e, "\"e\" (Exponent) Parameter"), zj(e.n, "\"n\" (Modulus) Parameter"), n = {
				e: e.e,
				kty: e.kty,
				n: e.n
			};
			break;
		case "oct":
			zj(e.k, "\"k\" (Key Value) Parameter"), n = {
				k: e.k,
				kty: e.kty
			};
			break;
		default: throw new ZD("\"kty\" (Key Type) Parameter missing or unsupported");
	}
	let r = LD.encode(JSON.stringify(n));
	return HD(await OD(t, r));
}
async function Rj(e, t) {
	t ??= "sha256";
	let n = await Lj(e, t);
	return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${n}`;
}
var zj, Bj = o((() => {
	kD(), GD(), sO(), BD(), HO(), zj = (e, t) => {
		if (typeof e != "string" || !e) throw new tO(`${t} missing or invalid`);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwk/embedded.js
async function Vj(e, t) {
	let n = {
		...e,
		...t?.header
	};
	if (!VO(n.jwk)) throw new $D("\"jwk\" (JSON Web Key) Header Parameter must be a JSON object");
	let r = await $k({
		...n.jwk,
		ext: !0
	}, n.alg);
	if (r instanceof Uint8Array || r.type !== "public") throw new $D("\"jwk\" (JSON Web Key) Header Parameter must be a public key");
	return r;
}
var Hj = o((() => {
	eA(), HO(), sO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwks/local.js
function Uj(e) {
	switch (typeof e == "string" && e.slice(0, 2)) {
		case "RS":
		case "PS": return "RSA";
		case "ES": return "EC";
		case "Ed": return "OKP";
		default: throw new ZD("Unsupported \"alg\" value for a JSON Web Key Set");
	}
}
function Wj(e) {
	return e && typeof e == "object" && Array.isArray(e.keys) && e.keys.every(Gj);
}
function Gj(e) {
	return VO(e);
}
function Kj(e) {
	return typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
async function qj(e, t, n) {
	let r = e.get(t) || e.set(t, {}).get(t);
	if (r[n] === void 0) {
		let e = await $k({
			...t,
			ext: !0
		}, n);
		if (e instanceof Uint8Array || e.type !== "public") throw new nO("JSON Web Key Set members must be public keys");
		r[n] = e;
	}
	return r[n];
}
function Jj(e) {
	let t = new Yj(e), n = async (e, n) => t.getKey(e, n);
	return Object.defineProperties(n, { jwks: {
		value: () => Kj(t._jwks),
		enumerable: !0,
		configurable: !1,
		writable: !1
	} }), n;
}
var Yj, Xj = o((() => {
	eA(), sO(), HO(), Yj = class {
		constructor(e) {
			if (this._cached = /* @__PURE__ */ new WeakMap(), !Wj(e)) throw new nO("JSON Web Key Set malformed");
			this._jwks = Kj(e);
		}
		async getKey(e, t) {
			let { alg: n, kid: r } = {
				...e,
				...t?.header
			}, i = Uj(n), a = this._jwks.keys.filter((e) => {
				let t = i === e.kty;
				if (t && typeof r == "string" && (t = r === e.kid), t && typeof e.alg == "string" && (t = n === e.alg), t && typeof e.use == "string" && (t = e.use === "sig"), t && Array.isArray(e.key_ops) && (t = e.key_ops.includes("verify")), t) switch (n) {
					case "ES256":
						t = e.crv === "P-256";
						break;
					case "ES256K":
						t = e.crv === "secp256k1";
						break;
					case "ES384":
						t = e.crv === "P-384";
						break;
					case "ES512":
						t = e.crv === "P-521";
						break;
					case "Ed25519":
						t = e.crv === "Ed25519";
						break;
					case "EdDSA":
						t = e.crv === "Ed25519" || e.crv === "Ed448";
						break;
				}
				return t;
			}), { 0: o, length: s } = a;
			if (s === 0) throw new rO();
			if (s !== 1) {
				let e = new iO(), { _cached: t } = this;
				throw e[Symbol.asyncIterator] = async function* () {
					for (let e of a) try {
						yield await qj(t, e, n);
					} catch {}
				}, e;
			}
			return qj(this._cached, o, n);
		}
	};
})), Zj, Qj = o((() => {
	sO(), Zj = async (e, t, n) => {
		let r, i, a = !1;
		typeof AbortController == "function" && (r = new AbortController(), i = setTimeout(() => {
			a = !0, r.abort();
		}, t));
		let o = await fetch(e.href, {
			signal: r ? r.signal : void 0,
			redirect: "manual",
			headers: n.headers
		}).catch((e) => {
			throw a ? new aO() : e;
		});
		if (i !== void 0 && clearTimeout(i), o.status !== 200) throw new qD("Expected 200 OK from the JSON Web Key Set HTTP response");
		try {
			return await o.json();
		} catch {
			throw new qD("Failed to parse the JSON Web Key Set HTTP response as JSON");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwks/remote.js
function $j() {
	return typeof WebSocketPair < "u" || typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime < "u" && EdgeRuntime === "vercel";
}
function eM(e, t) {
	return !(typeof e != "object" || !e || !("uat" in e) || typeof e.uat != "number" || Date.now() - e.uat >= t || !("jwks" in e) || !VO(e.jwks) || !Array.isArray(e.jwks.keys) || !Array.prototype.every.call(e.jwks.keys, VO));
}
function tM(e, t) {
	let n = new iM(e, t), r = async (e, t) => n.getKey(e, t);
	return Object.defineProperties(r, {
		coolingDown: {
			get: () => n.coolingDown(),
			enumerable: !0,
			configurable: !1
		},
		fresh: {
			get: () => n.fresh(),
			enumerable: !0,
			configurable: !1
		},
		reload: {
			value: () => n.reload(),
			enumerable: !0,
			configurable: !1,
			writable: !1
		},
		reloading: {
			get: () => !!n._pendingFetch,
			enumerable: !0,
			configurable: !1
		},
		jwks: {
			value: () => n._local?.jwks(),
			enumerable: !0,
			configurable: !1,
			writable: !1
		}
	}), r;
}
var nM, rM, iM, aM, oM = o((() => {
	Qj(), sO(), Xj(), HO(), (typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (nM = "jose/v5.10.0"), rM = Symbol(), iM = class {
		constructor(e, t) {
			if (!(e instanceof URL)) throw TypeError("url must be an instance of URL");
			this._url = new URL(e.href), this._options = {
				agent: t?.agent,
				headers: t?.headers
			}, this._timeoutDuration = typeof t?.timeoutDuration == "number" ? t?.timeoutDuration : 5e3, this._cooldownDuration = typeof t?.cooldownDuration == "number" ? t?.cooldownDuration : 3e4, this._cacheMaxAge = typeof t?.cacheMaxAge == "number" ? t?.cacheMaxAge : 6e5, t?.[rM] !== void 0 && (this._cache = t?.[rM], eM(t?.[rM], this._cacheMaxAge) && (this._jwksTimestamp = this._cache.uat, this._local = Jj(this._cache.jwks)));
		}
		coolingDown() {
			return typeof this._jwksTimestamp == "number" && Date.now() < this._jwksTimestamp + this._cooldownDuration;
		}
		fresh() {
			return typeof this._jwksTimestamp == "number" && Date.now() < this._jwksTimestamp + this._cacheMaxAge;
		}
		async getKey(e, t) {
			(!this._local || !this.fresh()) && await this.reload();
			try {
				return await this._local(e, t);
			} catch (n) {
				if (n instanceof rO && this.coolingDown() === !1) return await this.reload(), this._local(e, t);
				throw n;
			}
		}
		async reload() {
			this._pendingFetch && $j() && (this._pendingFetch = void 0);
			let e = new Headers(this._options.headers);
			nM && !e.has("User-Agent") && (e.set("User-Agent", nM), this._options.headers = Object.fromEntries(e.entries())), this._pendingFetch ||= Zj(this._url, this._timeoutDuration, this._options).then((e) => {
				this._local = Jj(e), this._cache && (this._cache.uat = Date.now(), this._cache.jwks = e), this._jwksTimestamp = Date.now(), this._pendingFetch = void 0;
			}).catch((e) => {
				throw this._pendingFetch = void 0, e;
			}), await this._pendingFetch;
		}
	}, aM = rM;
})), sM, cM = o((() => {
	GD(), BD(), sO(), mj(), Mj(), sM = class extends jj {
		encode() {
			return `${HD(JSON.stringify({ alg: "none" }))}.${HD(JSON.stringify(this._payload))}.`;
		}
		static decode(e, t) {
			if (typeof e != "string") throw new eO("Unsecured JWT must be a string");
			let { 0: n, 1: r, 2: i, length: a } = e.split(".");
			if (a !== 3 || i !== "") throw new eO("Invalid Unsecured JWT");
			let o;
			try {
				if (o = JSON.parse(RD.decode(WD(n))), o.alg !== "none") throw Error();
			} catch {
				throw new eO("Invalid Unsecured JWT");
			}
			return {
				payload: pj(o, WD(r), t),
				header: o
			};
		}
	};
})), lM = /* @__PURE__ */ c({
	decode: () => dM,
	encode: () => uM
}), uM, dM, fM = o((() => {
	GD(), uM = HD, dM = WD;
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/util/decode_protected_header.js
function pM(e) {
	let t;
	if (typeof e == "string") {
		let n = e.split(".");
		(n.length === 3 || n.length === 5) && ([t] = n);
	} else if (typeof e == "object" && e) if ("protected" in e) t = e.protected;
	else throw TypeError("Token does not contain a Protected Header");
	try {
		if (typeof t != "string" || !t) throw Error();
		let e = JSON.parse(RD.decode(dM(t)));
		if (!VO(e)) throw Error();
		return e;
	} catch {
		throw TypeError("Invalid Token or Protected Header formatting");
	}
}
var mM = o((() => {
	fM(), BD(), HO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/util/decode_jwt.js
function hM(e) {
	if (typeof e != "string") throw new eO("JWTs must use Compact JWS serialization, JWT must be a string");
	let { 1: t, length: n } = e.split(".");
	if (n === 5) throw new eO("Only JWTs using Compact JWS serialization can be decoded");
	if (n !== 3) throw new eO("Invalid JWT");
	if (!t) throw new eO("JWTs must contain a payload");
	let r;
	try {
		r = dM(t);
	} catch {
		throw new eO("Failed to base64url decode the payload");
	}
	let i;
	try {
		i = JSON.parse(RD.decode(r));
	} catch {
		throw new eO("Failed to parse the decoded payload as JSON");
	}
	if (!VO(i)) throw new eO("Invalid JWT Claims Set");
	return i;
}
var gM = o((() => {
	fM(), BD(), HO(), sO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/generate.js
async function _M(e, t) {
	let n, r, i;
	switch (e) {
		case "HS256":
		case "HS384":
		case "HS512":
			n = parseInt(e.slice(-3), 10), r = {
				name: "HMAC",
				hash: `SHA-${n}`,
				length: n
			}, i = ["sign", "verify"];
			break;
		case "A128CBC-HS256":
		case "A192CBC-HS384":
		case "A256CBC-HS512": return n = parseInt(e.slice(-3), 10), cO(new Uint8Array(n >> 3));
		case "A128KW":
		case "A192KW":
		case "A256KW":
			n = parseInt(e.slice(1, 4), 10), r = {
				name: "AES-KW",
				length: n
			}, i = ["wrapKey", "unwrapKey"];
			break;
		case "A128GCMKW":
		case "A192GCMKW":
		case "A256GCMKW":
		case "A128GCM":
		case "A192GCM":
		case "A256GCM":
			n = parseInt(e.slice(1, 4), 10), r = {
				name: "AES-GCM",
				length: n
			}, i = ["encrypt", "decrypt"];
			break;
		default: throw new ZD("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	}
	return Z.subtle.generateKey(r, t?.extractable ?? !1, i);
}
function vM(e) {
	let t = e?.modulusLength ?? 2048;
	if (typeof t != "number" || t < 2048) throw new ZD("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
	return t;
}
async function yM(e, t) {
	let n, r;
	switch (e) {
		case "PS256":
		case "PS384":
		case "PS512":
			n = {
				name: "RSA-PSS",
				hash: `SHA-${e.slice(-3)}`,
				publicExponent: new Uint8Array([
					1,
					0,
					1
				]),
				modulusLength: vM(t)
			}, r = ["sign", "verify"];
			break;
		case "RS256":
		case "RS384":
		case "RS512":
			n = {
				name: "RSASSA-PKCS1-v1_5",
				hash: `SHA-${e.slice(-3)}`,
				publicExponent: new Uint8Array([
					1,
					0,
					1
				]),
				modulusLength: vM(t)
			}, r = ["sign", "verify"];
			break;
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512":
			n = {
				name: "RSA-OAEP",
				hash: `SHA-${parseInt(e.slice(-3), 10) || 1}`,
				publicExponent: new Uint8Array([
					1,
					0,
					1
				]),
				modulusLength: vM(t)
			}, r = [
				"decrypt",
				"unwrapKey",
				"encrypt",
				"wrapKey"
			];
			break;
		case "ES256":
			n = {
				name: "ECDSA",
				namedCurve: "P-256"
			}, r = ["sign", "verify"];
			break;
		case "ES384":
			n = {
				name: "ECDSA",
				namedCurve: "P-384"
			}, r = ["sign", "verify"];
			break;
		case "ES512":
			n = {
				name: "ECDSA",
				namedCurve: "P-521"
			}, r = ["sign", "verify"];
			break;
		case "Ed25519":
			n = { name: "Ed25519" }, r = ["sign", "verify"];
			break;
		case "EdDSA": {
			r = ["sign", "verify"];
			let e = t?.crv ?? "Ed25519";
			switch (e) {
				case "Ed25519":
				case "Ed448":
					n = { name: e };
					break;
				default: throw new ZD("Invalid or unsupported crv option provided");
			}
			break;
		}
		case "ECDH-ES":
		case "ECDH-ES+A128KW":
		case "ECDH-ES+A192KW":
		case "ECDH-ES+A256KW": {
			r = ["deriveKey", "deriveBits"];
			let e = t?.crv ?? "P-256";
			switch (e) {
				case "P-256":
				case "P-384":
				case "P-521":
					n = {
						name: "ECDH",
						namedCurve: e
					};
					break;
				case "X25519":
				case "X448":
					n = { name: e };
					break;
				default: throw new ZD("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
			}
			break;
		}
		default: throw new ZD("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	}
	return Z.subtle.generateKey(n, t?.extractable ?? !1, r);
}
var bM = o((() => {
	DD(), sO(), lO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/generate_key_pair.js
async function xM(e, t) {
	return yM(e, t);
}
var SM = o((() => {
	bM();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/generate_secret.js
async function CM(e, t) {
	return _M(e, t);
}
var wM = o((() => {
	bM();
})), TM, EM = o((() => {
	TM = "WebCryptoAPI";
})), DM, OM = o((() => {
	EM(), DM = TM;
})), kM = /* @__PURE__ */ c({
	CompactEncrypt: () => yj,
	CompactSign: () => Tj,
	EmbeddedJWK: () => Vj,
	EncryptJWT: () => Fj,
	FlattenedEncrypt: () => RA,
	FlattenedSign: () => Cj,
	GeneralEncrypt: () => VA,
	GeneralSign: () => Oj,
	SignJWT: () => Nj,
	UnsecuredJWT: () => sM,
	base64url: () => lM,
	calculateJwkThumbprint: () => Lj,
	calculateJwkThumbprintUri: () => Rj,
	compactDecrypt: () => wA,
	compactVerify: () => ZA,
	createLocalJWKSet: () => Jj,
	createRemoteJWKSet: () => tM,
	cryptoRuntime: () => DM,
	decodeJwt: () => hM,
	decodeProtectedHeader: () => pM,
	errors: () => KD,
	experimental_jwksCache: () => aM,
	exportJWK: () => PA,
	exportPKCS8: () => NA,
	exportSPKI: () => MA,
	flattenedDecrypt: () => SA,
	flattenedVerify: () => YA,
	generalDecrypt: () => EA,
	generalVerify: () => $A,
	generateKeyPair: () => xM,
	generateSecret: () => CM,
	importJWK: () => $k,
	importPKCS8: () => Qk,
	importSPKI: () => Xk,
	importX509: () => Zk,
	jwksCache: () => rM,
	jwtDecrypt: () => _j,
	jwtVerify: () => hj
}), AM = o((() => {
	TA(), CA(), DA(), HA(), QA(), XA(), ej(), gj(), vj(), bj(), zA(), Ej(), wj(), kj(), Pj(), Ij(), Bj(), Hj(), Xj(), oM(), cM(), FA(), eA(), mM(), gM(), sO(), SM(), wM(), fM(), OM();
})), jM = /* @__PURE__ */ s(((e, t) => {
	var n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = (e, t) => {
		for (var r in t) n(e, r, {
			get: t[r],
			enumerable: !0
		});
	}, s = (e, t, o, s) => {
		if (t && typeof t == "object" || typeof t == "function") for (let c of i(t)) !a.call(e, c) && c !== o && n(e, c, {
			get: () => t[c],
			enumerable: !(s = r(t, c)) || s.enumerable
		});
		return e;
	}, c = (e) => s(n({}, "__esModule", { value: !0 }), e), l = {};
	o(l, { verifyVercelOidcToken: () => h }), t.exports = c(l);
	var u = (AM(), c(kM)), d = "https://oidc.vercel.com", f = new URL("https://oidc.vercel.com/.well-known/jwks"), p = ["RS256"], m = (0, u.createRemoteJWKSet)(f);
	async function h(e, t) {
		let { algorithms: n, projectId: r = process.env.VERCEL_PROJECT_ID, environment: i = process.env.VERCEL_TARGET_ENV || process.env.VERCEL_ENV, ownerId: a, ...o } = t ?? {};
		if (r === "*" && a === void 0 && !g(o.audience)) throw TypeError("Expected ownerId or audience to be provided when projectId is '*'.");
		let s = await (0, u.jwtVerify)(e, m, {
			...o,
			algorithms: n ?? p
		});
		return _(s.payload.iss), v({
			actual: s.payload.project_id,
			claim: "project_id",
			env: "VERCEL_PROJECT_ID",
			expected: r,
			option: "projectId"
		}), v({
			actual: s.payload.environment,
			claim: "environment",
			env: "VERCEL_TARGET_ENV or VERCEL_ENV",
			expected: i,
			option: "environment"
		}), y({
			actual: s.payload.owner_id,
			claim: "owner_id",
			expected: a
		}), s;
	}
	function g(e) {
		return Array.isArray(e) ? e.length > 0 : e !== void 0;
	}
	function _(e) {
		if (e !== d && (typeof e != "string" || !e.startsWith(`${d}/`))) throw TypeError(`Expected Vercel OIDC token iss claim to be "${d}" or to start with "${d}/".`);
	}
	function v({ actual: e, claim: t, env: n, expected: r, option: i }) {
		if (r !== "*") {
			if (r === void 0 || r.length === 0) throw TypeError(`Expected ${n} to be set or ${i} to be provided. Pass ${i}: '*' to allow any ${t} claim.`);
			if (!(Array.isArray(r) && typeof e == "string" && r.includes(e)) && e !== r) throw TypeError(Array.isArray(r) ? `Expected Vercel OIDC token ${t} claim to be one of: ${r.map((e) => `"${e}"`).join(", ")}.` : `Expected Vercel OIDC token ${t} claim to be "${r}".`);
		}
	}
	function y({ actual: e, claim: t, expected: n }) {
		if (n !== void 0 && e !== n) throw TypeError(`Expected Vercel OIDC token ${t} claim to be "${n}".`);
	}
	0 && (t.exports = { verifyVercelOidcToken: h });
})), MM = /* @__PURE__ */ s(((e, t) => {
	var n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = (e, t) => {
		for (var r in t) n(e, r, {
			get: t[r],
			enumerable: !0
		});
	}, s = (e, t, o, s) => {
		if (t && typeof t == "object" || typeof t == "function") for (let c of i(t)) !a.call(e, c) && c !== o && n(e, c, {
			get: () => t[c],
			enumerable: !(s = r(t, c)) || s.enumerable
		});
		return e;
	}, c = (e) => s(n({}, "__esModule", { value: !0 }), e), l = {};
	o(l, {
		AccessTokenMissingError: () => u,
		RefreshAccessTokenFailedError: () => d
	}), t.exports = c(l);
	var u = class extends Error {
		constructor() {
			super("No authentication found. Please log in with the Vercel CLI (vercel login)."), this.name = "AccessTokenMissingError";
		}
	}, d = class extends Error {
		constructor(e) {
			super("Failed to refresh authentication token."), this.name = "RefreshAccessTokenFailedError", e !== void 0 && (this.cause = e);
		}
	};
	0 && (t.exports = {
		AccessTokenMissingError: u,
		RefreshAccessTokenFailedError: d
	});
})), NM = /* @__PURE__ */ s(((e, t) => {
	var n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = (e, t) => {
		for (var r in t) n(e, r, {
			get: t[r],
			enumerable: !0
		});
	}, s = (e, t, o, s) => {
		if (t && typeof t == "object" || typeof t == "function") for (let c of i(t)) !a.call(e, c) && c !== o && n(e, c, {
			get: () => t[c],
			enumerable: !(s = r(t, c)) || s.enumerable
		});
		return e;
	}, c = (e) => s(n({}, "__esModule", { value: !0 }), e), l = {};
	o(l, {
		AccessTokenMissingError: () => f.AccessTokenMissingError,
		RefreshAccessTokenFailedError: () => f.RefreshAccessTokenFailedError,
		getContext: () => u.getContext,
		getVercelOidcToken: () => p,
		getVercelOidcTokenSync: () => m,
		getVercelToken: () => h,
		verifyVercelOidcToken: () => d.verifyVercelOidcToken
	}), t.exports = c(l);
	var u = TD(), d = jM(), f = MM();
	async function p() {
		return "";
	}
	function m() {
		return "";
	}
	async function h() {
		throw Error("getVercelToken is not supported in browser environments");
	}
	0 && (t.exports = {
		AccessTokenMissingError,
		RefreshAccessTokenFailedError,
		getContext,
		getVercelOidcToken: p,
		getVercelOidcTokenSync: m,
		getVercelToken: h,
		verifyVercelOidcToken
	});
})), PM = /* @__PURE__ */ s(((e, t) => {
	function n(e, t) {
		typeof t == "boolean" && (t = { forever: t }), this._originalTimeouts = JSON.parse(JSON.stringify(e)), this._timeouts = e, this._options = t || {}, this._maxRetryTime = t && t.maxRetryTime || Infinity, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
	}
	t.exports = n, n.prototype.reset = function() {
		this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0);
	}, n.prototype.stop = function() {
		this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), this._timeouts = [], this._cachedTimeouts = null;
	}, n.prototype.retry = function(e) {
		if (this._timeout && clearTimeout(this._timeout), !e) return !1;
		var t = (/* @__PURE__ */ new Date()).getTime();
		if (e && t - this._operationStart >= this._maxRetryTime) return this._errors.push(e), this._errors.unshift(/* @__PURE__ */ Error("RetryOperation timeout occurred")), !1;
		this._errors.push(e);
		var n = this._timeouts.shift();
		if (n === void 0) if (this._cachedTimeouts) this._errors.splice(0, this._errors.length - 1), n = this._cachedTimeouts.slice(-1);
		else return !1;
		var r = this;
		return this._timer = setTimeout(function() {
			r._attempts++, r._operationTimeoutCb && (r._timeout = setTimeout(function() {
				r._operationTimeoutCb(r._attempts);
			}, r._operationTimeout), r._options.unref && r._timeout.unref()), r._fn(r._attempts);
		}, n), this._options.unref && this._timer.unref(), !0;
	}, n.prototype.attempt = function(e, t) {
		this._fn = e, t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
		var n = this;
		this._operationTimeoutCb && (this._timeout = setTimeout(function() {
			n._operationTimeoutCb();
		}, n._operationTimeout)), this._operationStart = (/* @__PURE__ */ new Date()).getTime(), this._fn(this._attempts);
	}, n.prototype.try = function(e) {
		console.log("Using RetryOperation.try() is deprecated"), this.attempt(e);
	}, n.prototype.start = function(e) {
		console.log("Using RetryOperation.start() is deprecated"), this.attempt(e);
	}, n.prototype.start = n.prototype.try, n.prototype.errors = function() {
		return this._errors;
	}, n.prototype.attempts = function() {
		return this._attempts;
	}, n.prototype.mainError = function() {
		if (this._errors.length === 0) return null;
		for (var e = {}, t = null, n = 0, r = 0; r < this._errors.length; r++) {
			var i = this._errors[r], a = i.message, o = (e[a] || 0) + 1;
			e[a] = o, o >= n && (t = i, n = o);
		}
		return t;
	};
})), FM = /* @__PURE__ */ s(((e) => {
	var t = PM();
	e.operation = function(n) {
		return new t(e.timeouts(n), {
			forever: n && (n.forever || n.retries === Infinity),
			unref: n && n.unref,
			maxRetryTime: n && n.maxRetryTime
		});
	}, e.timeouts = function(e) {
		if (e instanceof Array) return [].concat(e);
		var t = {
			retries: 10,
			factor: 2,
			minTimeout: 1 * 1e3,
			maxTimeout: Infinity,
			randomize: !1
		};
		for (var n in e) t[n] = e[n];
		if (t.minTimeout > t.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
		for (var r = [], i = 0; i < t.retries; i++) r.push(this.createTimeout(i, t));
		return e && e.forever && !r.length && r.push(this.createTimeout(i, t)), r.sort(function(e, t) {
			return e - t;
		}), r;
	}, e.createTimeout = function(e, t) {
		var n = t.randomize ? Math.random() + 1 : 1, r = Math.round(n * Math.max(t.minTimeout, 1) * t.factor ** +e);
		return r = Math.min(r, t.maxTimeout), r;
	}, e.wrap = function(t, n, r) {
		if (n instanceof Array && (r = n, n = null), !r) for (var i in r = [], t) typeof t[i] == "function" && r.push(i);
		for (var a = 0; a < r.length; a++) {
			var o = r[a], s = t[o];
			t[o] = function(r) {
				var i = e.operation(n), a = Array.prototype.slice.call(arguments, 1), o = a.pop();
				a.push(function(e) {
					i.retry(e) || (e && (arguments[0] = i.mainError()), o.apply(this, arguments));
				}), i.attempt(function() {
					r.apply(t, a);
				});
			}.bind(t, s), t[o].options = n;
		}
	};
})), IM = /* @__PURE__ */ s(((e, t) => {
	t.exports = FM();
})), LM = /* @__PURE__ */ s(((e, t) => {
	var n = IM();
	function r(e, t) {
		function r(r, i) {
			var a = t || {}, o;
			"randomize" in a || (a.randomize = !0), o = n.operation(a);
			function s(e) {
				i(e || /* @__PURE__ */ Error("Aborted"));
			}
			function c(e, t) {
				if (e.bail) {
					s(e);
					return;
				}
				o.retry(e) ? a.onRetry && a.onRetry(e, t) : i(o.mainError());
			}
			function l(t) {
				var n;
				try {
					n = e(s, t);
				} catch (e) {
					c(e, t);
					return;
				}
				Promise.resolve(n).then(r).catch(function(e) {
					c(e, t);
				});
			}
			o.attempt(l);
		}
		return new Promise(r);
	}
	t.exports = r;
})), RM = NM(), zM = /* @__PURE__ */ u(LM(), 1), BM = globalThis.fetch.bind(globalThis), VM = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	function n(e, t) {
		if (typeof e != "function") throw TypeError(`Expected the first argument to be a \`function\`, got \`${typeof e}\`.`);
		let n, r = 0;
		return function(...i) {
			clearTimeout(n);
			let a = Date.now(), o = t - (a - r);
			o <= 0 ? (r = a, e.apply(this, i)) : n = setTimeout(() => {
				r = Date.now(), e.apply(this, i);
			}, o);
		};
	}
	t.exports = n;
})))(), 1), HM = new Promise((e) => {
	try {
		let t = new Uint8Array([
			104,
			101,
			108,
			108,
			111
		]);
		new Blob([t]).text().then((t) => {
			e(t === "hello");
		}).catch(() => {
			e(!1);
		});
	} catch {
		e(!1);
	}
});
async function UM(e) {
	if (e instanceof ReadableStream) return e;
	if (e instanceof Blob) return e.stream();
	if (WM(e)) return wD.toWeb(e);
	let t;
	return t = e instanceof ArrayBuffer ? new Uint8Array(e) : KM(e) ? e : GM(e), await HM ? new Blob([t]).stream() : new ReadableStream({ start(e) {
		e.enqueue(t), e.close();
	} });
}
function WM(e) {
	return typeof e == "object" && typeof e.pipe == "function" && e.readable && typeof e._read == "function" && typeof e._readableState == "object";
}
function GM(e) {
	return new TextEncoder().encode(e);
}
function KM(e) {
	return (0, CD.default)(e);
}
async function qM() {
	try {
		let e = (await (0, RM.getVercelOidcToken)()).trim();
		return e === "" ? void 0 : e;
	} catch {
		return;
	}
}
var JM = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i, YM = {
	b: 1,
	kb: 1024,
	mb: 1 << 20,
	gb: 1 << 30,
	tb: 1024 ** 4,
	pb: 1024 ** 5
};
function XM(e) {
	if (typeof e == "number" && !Number.isNaN(e)) return e;
	if (typeof e != "string") return null;
	let t = JM.exec(e), n, r = "b";
	if (!t) n = parseInt(e, 10);
	else {
		let [, e, , , i] = t;
		if (!e) return null;
		n = parseFloat(e), i && (r = i.toLowerCase());
	}
	return Number.isNaN(n) ? null : Math.floor(YM[r] * n);
}
var ZM = "https://vercel.com/api/blob";
function QM(e) {
	try {
		let t = process.env[e];
		return typeof t == "string" && t.trim() !== "" ? t.trim() : void 0;
	} catch {
		return;
	}
}
function $M(e) {
	let [, , , t = ""] = e.split("_");
	return t;
}
function eN(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = 4 - t.length % 4;
	if (n !== 4 && (t += "=".repeat(n)), typeof atob == "function") return atob(t);
	if (typeof Buffer < "u") return Buffer.from(t, "base64").toString("utf8");
	throw new $("Cannot decode base64: no atob or Buffer available.");
}
function tN(e) {
	let t = e.indexOf(".");
	if (t < 0) throw new $("Invalid delegation token format.");
	let n = e.slice(0, t), r;
	try {
		r = JSON.parse(eN(n));
	} catch {
		throw new $("Invalid delegation token payload.");
	}
	if (!r.storeId || typeof r.storeId != "string") throw new $("Delegation token payload is missing `storeId`.");
	return nN(r.storeId);
}
function nN(e) {
	return e.startsWith("store_") ? e.slice(6) : e;
}
async function rN(e) {
	if (e?.presignedUrlPayload) return {
		kind: "presigned",
		storeId: tN(e.presignedUrlPayload.delegationToken)
	};
	if (e?.token) {
		let t = $M(e.token);
		return {
			kind: "readWrite",
			token: e.token,
			storeId: t
		};
	}
	let t = (e?.oidcToken)?.trim(), n = t || await qM();
	if (n) {
		let r = (e?.storeId)?.trim();
		if (r) return {
			kind: "oidc",
			token: n,
			storeId: nN(r)
		};
		let i = QM("BLOB_STORE_ID");
		if (i) return {
			kind: "oidc",
			token: n,
			storeId: nN(i)
		};
		if (t) throw new $("oidcToken was passed, but no storeId was found. Pass a `storeId` option or set `BLOB_STORE_ID` to use OIDC auth");
	}
	let r = QM("BLOB_READ_WRITE_TOKEN");
	if (r) return {
		kind: "readWrite",
		token: r,
		storeId: $M(r)
	};
	throw new $("No blob credentials found. Pass a `token` option, set `BLOB_READ_WRITE_TOKEN`, or use `oidcToken` (or `VERCEL_OIDC_TOKEN`) with `storeId` or `BLOB_STORE_ID`.");
}
var $ = class extends Error {
	constructor(e) {
		super(`Vercel Blob: ${e}`);
	}
};
function iN(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
var aN = ["//"], oN = (() => {
	if (SD()) return !0;
	if (sN().startsWith("http://localhost")) return !1;
	let e = !1, t = new Request(sN(), {
		body: new ReadableStream(),
		method: "POST",
		get duplex() {
			return e = !0, "half";
		}
	}).headers.has("Content-Type");
	return e && !t;
})();
function sN(e = "") {
	let t = null;
	try {
		t = process.env.VERCEL_BLOB_API_URL || process.env.NEXT_PUBLIC_VERCEL_BLOB_API_URL;
	} catch {}
	return `${t || ZM}${e}`;
}
var cN = typeof TextEncoder == "function" ? new TextEncoder() : null;
function lN(e) {
	return e ? typeof e == "string" ? cN ? cN.encode(e).byteLength : new Blob([e]).size : "byteLength" in e && typeof e.byteLength == "number" ? e.byteLength : "size" in e && typeof e.size == "number" ? e.size : 0 : 0;
}
var uN = (e, t) => {
	let n = /* @__PURE__ */ new Uint8Array();
	return new TransformStream({
		transform(r, i) {
			let a = new Uint8Array(n.length + r.byteLength);
			for (a.set(n), a.set(new Uint8Array(r), n.length), n = a; n.length >= e;) {
				let r = n.slice(0, e);
				i.enqueue(r), t?.(r.byteLength), n = n.slice(e);
			}
		},
		flush(e) {
			n.length > 0 && (e.enqueue(n), t?.(n.byteLength));
		}
	});
};
function dN(e) {
	return globalThis.ReadableStream && e instanceof ReadableStream;
}
function fN(e) {
	return !!(dN(e) || WM(e));
}
var pN = (e, t) => {
	let n = new URL(e);
	for (let [e, r] of Object.entries(t.params)) n.searchParams.set(e, r);
	return n.searchParams.set("vercel-blob-delegation", t.delegationToken), n.searchParams.set("vercel-blob-signature", t.signature), n.toString();
}, mN = !1;
try {
	(process.env.DEBUG?.includes("blob") || process.env.NEXT_PUBLIC_DEBUG?.includes("blob")) && (mN = !0);
} catch {}
function hN(e, ...t) {
	mN && console.debug(`vercel-blob: ${e}`, ...t);
}
var gN = globalThis.DOMException ?? (() => {
	try {
		atob("~");
	} catch (e) {
		return Object.getPrototypeOf(e).constructor;
	}
})(), _N = Object.prototype.toString, vN = (e) => _N.call(e) === "[object Error]", yN = /* @__PURE__ */ new Set([
	"network error",
	"Failed to fetch",
	"NetworkError when attempting to fetch resource.",
	"The Internet connection appears to be offline.",
	"Load failed",
	"Network request failed",
	"fetch failed",
	"terminated"
]);
function bN(e) {
	return e && vN(e) && e.name === "TypeError" && typeof e.message == "string" ? e.message === "Load failed" ? e.stack === void 0 : yN.has(e.message) : !1;
}
var xN = typeof BM == "function", SN = xN && oN, CN = 64 * 1024, wN = async ({ input: e, init: t, onUploadProgress: n }) => {
	hN("using fetch");
	let r;
	if (t.body) if (n) {
		let e = await UM(t.body), i = 0, a = uN(CN, (e) => {
			i += e, n(i);
		});
		r = e.pipeThrough(a);
	} else r = t.body;
	let i = oN && r && fN(r) ? "half" : void 0;
	return BM(e, {
		...t,
		...t.body ? { body: r } : {},
		duplex: i
	});
}, TN = typeof XMLHttpRequest < "u", EN = async ({ input: e, init: t, onUploadProgress: n }) => {
	hN("using xhr");
	let r = null;
	return t.body && (r = dN(t.body) ? await new Response(t.body).blob() : t.body), new Promise((i, a) => {
		let o = new XMLHttpRequest();
		if (o.open(t.method || "GET", e.toString(), !0), n && o.upload.addEventListener("progress", (e) => {
			e.lengthComputable && n(e.loaded);
		}), o.onload = () => {
			if (t.signal?.aborted) {
				a(new DOMException("The user aborted the request.", "AbortError"));
				return;
			}
			let e = new Headers();
			o.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach((t) => {
				let n = t.split(": "), r = n.shift(), i = n.join(": ");
				r && e.set(r.toLowerCase(), i);
			}), i(new Response(o.response, {
				status: o.status,
				statusText: o.statusText,
				headers: e
			}));
		}, o.onerror = () => {
			a(/* @__PURE__ */ TypeError("Network request failed"));
		}, o.ontimeout = () => {
			a(/* @__PURE__ */ TypeError("Network request timed out"));
		}, o.onabort = () => {
			a(new DOMException("The user aborted a request.", "AbortError"));
		}, t.headers && new Headers(t.headers).forEach((e, t) => {
			o.setRequestHeader(t, e);
		}), t.signal && (t.signal.addEventListener("abort", () => {
			o.abort();
		}), t.signal.aborted)) {
			o.abort();
			return;
		}
		o.send(r);
	});
}, DN = async ({ input: e, init: t, onUploadProgress: n }) => {
	if (n) {
		if (SN) return wN({
			input: e,
			init: t,
			onUploadProgress: n
		});
		if (TN) return EN({
			input: e,
			init: t,
			onUploadProgress: n
		});
	}
	if (xN) return wN({
		input: e,
		init: t
	});
	if (TN) return EN({
		input: e,
		init: t
	});
	throw Error("No request implementation available");
}, ON = class extends $ {
	constructor() {
		super("Access denied, please provide a valid token for this resource.");
	}
}, kN = class extends $ {
	constructor(e) {
		super(e ?? "OIDC is enabled for this project, but not for this token's environment.");
	}
}, AN = class extends $ {
	constructor(e) {
		super(`Content type mismatch, ${e}.`);
	}
}, jN = class extends $ {
	constructor(e) {
		super(`Pathname mismatch, ${e}. Check the pathname used in upload() or put() matches the one from the client token.`);
	}
}, MN = class extends $ {
	constructor() {
		super("Client token has expired.");
	}
}, NN = class extends $ {
	constructor(e) {
		super(`File is too large, ${e}.`);
	}
}, PN = class extends $ {
	constructor() {
		super("This store does not exist.");
	}
}, FN = class extends $ {
	constructor() {
		super("This store has been suspended.");
	}
}, IN = class extends $ {
	constructor() {
		super("Unknown error, please visit https://vercel.com/help.");
	}
}, LN = class extends $ {
	constructor() {
		super("The requested blob does not exist");
	}
}, RN = class extends $ {
	constructor() {
		super("The blob service is currently not available. Please try again.");
	}
}, zN = class extends $ {
	constructor(e) {
		super(`Too many requests please lower the number of concurrent requests ${e ? ` - try again in ${e} seconds` : ""}.`), this.retryAfter = e ?? 0;
	}
}, BN = class extends $ {
	constructor() {
		super("The request was aborted.");
	}
}, VN = class extends $ {
	constructor() {
		super("Precondition failed: ETag mismatch.");
	}
}, HN = 12;
function UN() {
	let e = null;
	try {
		e = process.env.VERCEL_BLOB_API_VERSION_OVERRIDE || process.env.NEXT_PUBLIC_VERCEL_BLOB_API_VERSION_OVERRIDE;
	} catch {}
	return `${e ?? HN}`;
}
function WN() {
	try {
		let e = process.env.VERCEL_BLOB_RETRIES || "10";
		return parseInt(e, 10);
	} catch {
		return 10;
	}
}
function GN(e) {
	let t = e.headers.get("retry-after");
	return new zN(t ? parseInt(t, 10) : void 0);
}
async function KN(e) {
	let t, n;
	try {
		let r = await e.json();
		t = r.error?.code ?? "unknown_error", n = r.error?.message;
	} catch {
		t = "unknown_error";
	}
	n?.includes("contentType") && n.includes("is not allowed") && (t = "content_type_not_allowed"), n?.includes("\"pathname\"") && n.includes("does not match the token payload") && (t = "client_token_pathname_mismatch"), n === "Token expired" && (t = "client_token_expired"), n?.includes("the file length cannot be greater than") && (t = "file_too_large"), n?.startsWith("OIDC is enabled for this project, but not for the") && n.includes("environment.") && (t = "oidc_environment_not_allowed");
	let r;
	switch (t) {
		case "store_suspended":
			r = new FN();
			break;
		case "forbidden":
			r = new ON();
			break;
		case "oidc_environment_not_allowed":
			r = new kN(n);
			break;
		case "content_type_not_allowed":
			r = new AN(n);
			break;
		case "client_token_pathname_mismatch":
			r = new jN(n);
			break;
		case "client_token_expired":
			r = new MN();
			break;
		case "file_too_large":
			r = new NN(n);
			break;
		case "not_found":
			r = new LN();
			break;
		case "client_token_not_allowed":
			r = new $(n ?? "This operation is not available when using a client token. Use a read–write or OIDC token on the server.");
			break;
		case "store_not_found":
			r = new PN();
			break;
		case "bad_request":
			r = new $(n ?? "Bad request");
			break;
		case "service_unavailable":
			r = new RN();
			break;
		case "rate_limited":
			r = GN(e);
			break;
		case "precondition_failed":
			r = new VN();
			break;
		default:
			r = new IN();
			break;
	}
	return {
		code: t,
		error: r
	};
}
async function qN(e, t, n) {
	let r = UN(), i = await rN(n), a = i.kind === "presigned" ? void 0 : i.token, o = JN(), s = sN(e);
	n?.presignedUrlPayload && (s = pN(s, n.presignedUrlPayload));
	let c = `${i.storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`, l = 0, u = 0, d = 0, f = n?.onUploadProgress || YN();
	t.body && f && (u = lN(t.body)), n?.onUploadProgress && n.onUploadProgress({
		loaded: 0,
		total: u,
		percentage: 0
	});
	let p = await (0, zM.default)(async (e) => {
		let p;
		try {
			p = await DN({
				input: s,
				init: {
					...t,
					headers: {
						"x-api-blob-request-id": c,
						"x-vercel-blob-store-id": i.storeId,
						"x-api-blob-request-attempt": String(l),
						"x-api-version": r,
						...f ? { "x-content-length": String(u) } : {},
						...a === void 0 ? {} : { authorization: `Bearer ${a}` },
						...o,
						...t.headers
					}
				},
				onUploadProgress: n?.onUploadProgress ? (e) => {
					var t;
					let r = u === 0 ? e : u;
					d = e;
					let i = u > 0 ? Number((e / r * 100).toFixed(2)) : 0;
					i === 100 && u > 0 || (t = n.onUploadProgress) == null || t.call(n, {
						loaded: e,
						total: r,
						percentage: i
					});
				} : void 0
			});
		} catch (t) {
			if (t instanceof gN && t.name === "AbortError") {
				e(new BN());
				return;
			}
			if (bN(t)) throw t;
			if (t instanceof TypeError) {
				e(t);
				return;
			}
			throw t;
		}
		if (p.ok) return p;
		let { code: m, error: h } = await KN(p);
		if (m === "unknown_error" || m === "service_unavailable" || m === "internal_server_error") throw h;
		e(h);
	}, {
		retries: WN(),
		onRetry: (t) => {
			t instanceof Error && hN(`retrying API request to ${e}`, t.message), l += 1;
		}
	});
	if (!p) throw new IN();
	return n?.onUploadProgress && n.onUploadProgress({
		loaded: d,
		total: d,
		percentage: 100
	}), await p.json();
}
function JN() {
	let e = {};
	try {
		"VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in process.env && process.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API !== void 0 ? e["x-proxy-through-alternative-api"] = process.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API : "NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in process.env && process.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API !== void 0 && (e["x-proxy-through-alternative-api"] = process.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API);
	} catch {}
	return e;
}
function YN() {
	try {
		return process.env.VERCEL_BLOB_USE_X_CONTENT_LENGTH === "1";
	} catch {
		return !1;
	}
}
var XN = {
	cacheControlMaxAge: "x-cache-control-max-age",
	addRandomSuffix: "x-add-random-suffix",
	allowOverwrite: "x-allow-overwrite",
	contentType: "x-content-type",
	access: "x-vercel-blob-access",
	ifMatch: "x-if-match"
};
function ZN(e, t) {
	let n = {};
	if (n[XN.access] = t.access, e.includes("contentType") && t.contentType && (n[XN.contentType] = t.contentType), e.includes("addRandomSuffix") && t.addRandomSuffix !== void 0 && (n[XN.addRandomSuffix] = t.addRandomSuffix ? "1" : "0"), e.includes("ifMatch") && t.ifMatch) {
		if (t.allowOverwrite === !1) throw new $("ifMatch and allowOverwrite: false are contradictory. ifMatch is used for conditional overwrites, which requires allowOverwrite to be true.");
		n[XN.ifMatch] = t.ifMatch, e.includes("allowOverwrite") && t.allowOverwrite === void 0 && (n[XN.allowOverwrite] = "1");
	}
	return e.includes("allowOverwrite") && t.allowOverwrite !== void 0 && (n[XN.allowOverwrite] = t.allowOverwrite ? "1" : "0"), e.includes("cacheControlMaxAge") && t.cacheControlMaxAge !== void 0 && (n[XN.cacheControlMaxAge] = t.cacheControlMaxAge.toString()), n;
}
async function QN({ pathname: e, options: t, extraChecks: n, getToken: r }) {
	if (!e) throw new $("pathname is required");
	if (e.length > 950) throw new $("pathname is too long, maximum length is 950");
	for (let t of aN) if (e.includes(t)) throw new $(`pathname cannot contain "${t}", please encode it if needed`);
	if (!t) throw new $("missing options, see usage");
	if (t.access !== "public" && t.access !== "private") throw new $("access must be \"private\" or \"public\", see https://vercel.com/docs/vercel-blob");
	return n && n(t), r && (t.token = await r(e, t)), t;
}
function $N({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i, a) => {
		let o = await QN({
			pathname: r,
			options: a,
			extraChecks: n,
			getToken: t
		}), s = ZN(e, o);
		return eP({
			uploadId: o.uploadId,
			key: o.key,
			pathname: r,
			headers: s,
			options: o,
			parts: i
		});
	};
}
async function eP({ uploadId: e, key: t, pathname: n, parts: r, headers: i, options: a }) {
	let o = new URLSearchParams({ pathname: n });
	try {
		let n = await qN(`/mpu?${o.toString()}`, {
			method: "POST",
			headers: {
				...i,
				"content-type": "application/json",
				"x-mpu-action": "complete",
				"x-mpu-upload-id": e,
				"x-mpu-key": encodeURIComponent(t)
			},
			body: JSON.stringify(r),
			signal: a.abortSignal
		}, a);
		return hN("mpu: complete", n), n;
	} catch (e) {
		throw e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? new RN() : e;
	}
}
function tP({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i) => {
		let a = await QN({
			pathname: r,
			options: i,
			extraChecks: n,
			getToken: t
		}), o = await nP(r, ZN(e, a), a);
		return {
			key: o.key,
			uploadId: o.uploadId
		};
	};
}
async function nP(e, t, n) {
	hN("mpu: create", "pathname:", e);
	let r = new URLSearchParams({ pathname: e });
	try {
		let e = await qN(`/mpu?${r.toString()}`, {
			method: "POST",
			headers: {
				...t,
				"x-mpu-action": "create"
			},
			signal: n.abortSignal
		}, n);
		return hN("mpu: create", e), e;
	} catch (e) {
		throw e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? new RN() : e;
	}
}
function rP({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i, a) => {
		let o = await QN({
			pathname: r,
			options: a,
			extraChecks: n,
			getToken: t
		}), s = ZN(e, o);
		if (iN(i)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
		return {
			etag: (await iP({
				uploadId: o.uploadId,
				key: o.key,
				pathname: r,
				part: {
					blob: i,
					partNumber: o.partNumber
				},
				headers: s,
				options: o
			})).etag,
			partNumber: o.partNumber
		};
	};
}
async function iP({ uploadId: e, key: t, pathname: n, headers: r, options: i, internalAbortController: a = new AbortController(), part: o }) {
	var s, c;
	let l = qN(`/mpu?${new URLSearchParams({ pathname: n }).toString()}`, {
		signal: a.signal,
		method: "POST",
		headers: {
			...r,
			"x-mpu-action": "upload",
			"x-mpu-key": encodeURIComponent(t),
			"x-mpu-upload-id": e,
			"x-mpu-part-number": o.partNumber.toString()
		},
		body: o.blob
	}, i);
	function u() {
		a.abort();
	}
	i.abortSignal?.aborted ? u() : (s = i.abortSignal) == null || s.addEventListener("abort", u);
	let d = await l;
	return (c = i.abortSignal) == null || c.removeEventListener("abort", u), d;
}
var aP = typeof window < "u" ? 6 : 8, oP = 8 * 1024 * 1024, sP = aP * oP * 2;
function cP({ uploadId: e, key: t, pathname: n, stream: r, headers: i, options: a, totalToLoad: o }) {
	hN("mpu: upload init", "key:", t);
	let s = new AbortController();
	return new Promise((c, l) => {
		let u = [], d = [], f = r.getReader(), p = 0, m = !1, h = 1, g = !1, _ = 0, v = !1, y = 0, b = [], x = 0, S, ee = {};
		a.onUploadProgress && (S = (0, VM.default)(() => {
			var e;
			let t = Object.values(ee).reduce((e, t) => e + t, 0), n = o || t, r = o > 0 ? Number(((t / o || t) * 100).toFixed(2)) : 0;
			(e = a.onUploadProgress) == null || e.call(a, {
				loaded: t,
				total: n,
				percentage: r
			});
		}, 150)), C().catch(E);
		async function C() {
			for (hN("mpu: upload read start", "activeUploads:", p, "currentBytesInMemory:", `${XM(_)}/${XM(sP)}`, "bytesSent:", XM(y)), m = !0; _ < sP && !g;) try {
				let { value: e, done: t } = await f.read();
				if (t) {
					v = !0, hN("mpu: upload read consumed the whole stream"), b.length > 0 ? (u.push({
						partNumber: h++,
						blob: new Blob(b, { type: "application/octet-stream" })
					}), T()) : p === 0 && (f.releaseLock(), c(d)), m = !1;
					return;
				}
				_ += e.byteLength;
				let n = 0;
				for (; n < e.byteLength;) {
					let t = oP - x, r = Math.min(n + t, e.byteLength), i = e.slice(n, r);
					b.push(i), x += i.byteLength, n = r, x === oP && (u.push({
						partNumber: h++,
						blob: new Blob(b, { type: "application/octet-stream" })
					}), b = [], x = 0, T());
				}
			} catch (e) {
				E(e);
			}
			hN("mpu: upload read end", "activeUploads:", p, "currentBytesInMemory:", `${XM(_)}/${XM(sP)}`, "bytesSent:", XM(y)), m = !1;
		}
		async function w(r) {
			p++, hN("mpu: upload send part start", "partNumber:", r.partNumber, "size:", r.blob.size, "activeUploads:", p, "currentBytesInMemory:", `${XM(_)}/${XM(sP)}`, "bytesSent:", XM(y));
			try {
				let o = a.onUploadProgress ? (e) => {
					ee[r.partNumber] = e.loaded, S && S();
				} : void 0, l = await iP({
					uploadId: e,
					key: t,
					pathname: n,
					headers: i,
					options: {
						...a,
						onUploadProgress: o
					},
					internalAbortController: s,
					part: r
				});
				if (hN("mpu: upload send part end", "partNumber:", r.partNumber, "activeUploads", p, "currentBytesInMemory:", `${XM(_)}/${XM(sP)}`, "bytesSent:", XM(y)), g) return;
				if (d.push({
					partNumber: r.partNumber,
					etag: l.etag
				}), _ -= r.blob.size, p--, y += r.blob.size, u.length > 0 && T(), v) {
					p === 0 && (f.releaseLock(), c(d));
					return;
				}
				m || C().catch(E);
			} catch (e) {
				E(e);
			}
		}
		function T() {
			if (!g) for (hN("send parts", "activeUploads", p, "partsToUpload", u.length); p < aP && u.length > 0;) {
				let e = u.shift();
				e && w(e);
			}
		}
		function E(e) {
			g || (g = !0, s.abort(), f.releaseLock(), e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? l(new RN()) : l(e));
		}
	});
}
function lP({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i) => {
		let a = await QN({
			pathname: r,
			options: i,
			extraChecks: n,
			getToken: t
		}), o = ZN(e, a), s = await nP(r, o, a);
		return {
			key: s.key,
			uploadId: s.uploadId,
			async uploadPart(e, t) {
				if (iN(t)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
				return {
					etag: (await iP({
						uploadId: s.uploadId,
						key: s.key,
						pathname: r,
						part: {
							partNumber: e,
							blob: t
						},
						headers: o,
						options: a
					})).etag,
					partNumber: e
				};
			},
			async complete(e) {
				return eP({
					uploadId: s.uploadId,
					key: s.key,
					pathname: r,
					parts: e,
					headers: o,
					options: a
				});
			}
		};
	};
}
async function uP(e, t, n, r) {
	hN("mpu: init", "pathname:", e, "headers:", n);
	let i = {
		...r,
		onUploadProgress: void 0
	};
	if (r.maximumSizeInBytes !== void 0 && !fN(t) && lN(t) > r.maximumSizeInBytes) throw new $(`Body size of ${lN(t)} bytes exceeds the maximum allowed size of ${r.maximumSizeInBytes} bytes`);
	let a = await nP(e, n, i), o = lN(t), s = await UM(t), c = await cP({
		uploadId: a.uploadId,
		key: a.key,
		pathname: e,
		stream: s,
		headers: n,
		options: r,
		totalToLoad: o
	});
	return await eP({
		uploadId: a.uploadId,
		key: a.key,
		pathname: e,
		parts: c,
		headers: n,
		options: i
	});
}
function dP({ allowedOptions: e, getToken: t, getPresignedUrlPayload: n, extraChecks: r }) {
	return async function(i, a, o) {
		if (!a) throw new $("body is required");
		if (iN(a)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
		let s = await QN({
			pathname: i,
			options: o,
			extraChecks: r,
			getToken: t
		}), c = await n?.(i, s), l = {
			...s,
			presignedUrlPayload: c
		}, u = ZN(e, s);
		if (s.multipart === !0) return uP(i, a, u, l);
		let d = s.onUploadProgress ? (0, VM.default)(s.onUploadProgress, 100) : void 0, f = await qN(`/?${new URLSearchParams({ pathname: i }).toString()}`, {
			method: "PUT",
			body: a,
			headers: u,
			signal: s.abortSignal
		}, {
			...l,
			onUploadProgress: d
		});
		return {
			url: f.url,
			downloadUrl: f.downloadUrl,
			pathname: f.pathname,
			contentType: f.contentType,
			contentDisposition: f.contentDisposition,
			etag: f.etag
		};
	};
}
new TextEncoder();
//#endregion
//#region node_modules/.pnpm/@vercel+blob@2.5.0/node_modules/@vercel/blob/dist/client.js
function fP(e) {
	return function(t) {
		if (!t.token.startsWith("vercel_blob_client_")) throw new $(`${e} must be called with a client token`);
		if (t.addRandomSuffix !== void 0 || t.allowOverwrite !== void 0 || t.cacheControlMaxAge !== void 0) throw new $(`${e} doesn't allow \`addRandomSuffix\`, \`cacheControlMaxAge\` or \`allowOverwrite\`. Configure these options at the server side when generating client tokens.`);
	};
}
dP({
	allowedOptions: ["contentType"],
	extraChecks: fP("client/`put`")
}), tP({
	allowedOptions: ["contentType"],
	extraChecks: fP("client/`createMultipartUpload`")
}), lP({
	allowedOptions: ["contentType"],
	extraChecks: fP("client/`createMultipartUpload`")
}), rP({
	allowedOptions: ["contentType"],
	extraChecks: fP("client/`multipartUpload`")
}), $N({
	allowedOptions: ["contentType"],
	extraChecks: fP("client/`completeMultipartUpload`")
});
var pP = dP({
	allowedOptions: ["contentType"],
	extraChecks(e) {
		if (e.handleUploadUrl === void 0) throw new $("client/`upload` requires the 'handleUploadUrl' parameter");
		if (e.addRandomSuffix !== void 0 || e.allowOverwrite !== void 0 || e.cacheControlMaxAge !== void 0 || e.ifMatch !== void 0) throw new $("client/`upload` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating client tokens.");
	},
	async getToken(e, t) {
		return hP({
			handleUploadUrl: t.handleUploadUrl,
			pathname: e,
			clientPayload: t.clientPayload ?? null,
			multipart: t.multipart ?? !1,
			headers: t.headers
		});
	}
});
dP({
	allowedOptions: ["contentType"],
	extraChecks(e) {
		if (e.handleUploadUrl === void 0) throw new $("client/`upload` requires the 'handleUploadUrl' parameter");
		if (e.addRandomSuffix !== void 0 || e.allowOverwrite !== void 0 || e.cacheControlMaxAge !== void 0 || e.ifMatch !== void 0) throw new $("client/`uploadPresigned` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating presigned URLs.");
	},
	async getPresignedUrlPayload(e, t) {
		return gP({
			pathname: e,
			handleUploadUrl: t.handleUploadUrl,
			clientPayload: t.clientPayload ?? null,
			multipart: t.multipart ?? !1,
			headers: t.headers
		});
	}
});
var mP = {
	generateClientToken: "blob.generate-client-token",
	generatePresignedUrl: "blob.generate-presigned-url",
	uploadCompleted: "blob.upload-completed"
};
async function hP(e) {
	let { handleUploadUrl: t, pathname: n } = e, r = vP(t) ? t : _P(t), i = {
		type: mP.generateClientToken,
		payload: {
			pathname: n,
			clientPayload: e.clientPayload,
			multipart: e.multipart
		}
	}, a = await BM(r, {
		method: "POST",
		body: JSON.stringify(i),
		headers: {
			"content-type": "application/json",
			...e.headers
		},
		signal: e.abortSignal
	});
	if (!a.ok) throw new $("Failed to  retrieve the client token");
	try {
		let { clientToken: e } = await a.json();
		return e;
	} catch {
		throw new $("Failed to retrieve the client token");
	}
}
async function gP(e) {
	let { handleUploadUrl: t, pathname: n } = e, r = vP(t) ? t : _P(t), i = {
		type: mP.generatePresignedUrl,
		payload: {
			pathname: n,
			clientPayload: e.clientPayload,
			multipart: e.multipart
		}
	}, a = await BM(r, {
		method: "POST",
		body: JSON.stringify(i),
		headers: {
			"content-type": "application/json",
			...e.headers
		},
		signal: e.abortSignal
	});
	if (!a.ok) throw new $("Failed to retrieve the presigned URL");
	try {
		let { presignedUrlPayload: e } = await a.json();
		if (e) return e;
		throw new $("Missing presignedUrlPayload");
	} catch (e) {
		throw e instanceof $ ? e : new $("Failed to retrieve the presigned URL");
	}
}
function _P(e) {
	return new URL(e, location.href).href;
}
function vP(e) {
	try {
		return !!new URL(e);
	} catch {
		return !1;
	}
}
//#endregion
//#region admin-app/src/services/layout-reference-service.mjs
async function yP(e = {}) {
	let { endpoint: t = "/api/layout-references", ...n } = e, r = await fetch(t, {
		cache: "no-store",
		credentials: "same-origin",
		...n,
		headers: {
			"Content-Type": "application/json",
			...n.headers || {}
		}
	}), i = await r.json().catch(() => ({}));
	if (!r.ok) {
		let e = Error(i.message || i.error || `레이아웃 레퍼런스 요청 오류(${r.status})`);
		throw e.code = i.code || "LAYOUT_REFERENCE_REQUEST_FAILED", e;
	}
	return i;
}
var bP = Object.freeze({
	list() {
		return yP();
	},
	create(e) {
		return yP({
			method: "POST",
			body: JSON.stringify(e)
		});
	},
	update(e, t) {
		return yP({
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				...t
			})
		});
	},
	analyze(e) {
		return yP({
			method: "POST",
			body: JSON.stringify(e),
			endpoint: "/api/layout-reference-analyze"
		});
	}
});
//#endregion
//#region admin-app/src/components/LayoutReferenceManager.vue
qh();
var xP = {
	class: "reference-library",
	"aria-labelledby": "reference-library-title"
}, SP = { class: "reference-library__header" }, CP = { class: "reference-library__actions" }, wP = ["disabled"], TP = {
	class: "reference-library__summary",
	"aria-label": "레이아웃 레퍼런스 현황"
}, EP = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, DP = { class: "reference-library__workspace" }, OP = { class: "reference-library__list" }, kP = { class: "reference-library__filters" }, AP = ["value"], jP = {
	class: "reference-library__rows",
	"aria-live": "polite"
}, MP = ["onClick"], NP = ["src"], PP = {
	key: 1,
	"aria-hidden": "true"
}, FP = { class: "reference-library__row-copy" }, IP = { class: "reference-library__row-meta" }, LP = {
	key: 0,
	class: "reference-library__empty"
}, RP = { class: "reference-library__editor-heading" }, zP = ["disabled"], BP = { class: "reference-library__grid" }, VP = { class: "wide" }, HP = { class: "wide" }, UP = { class: "wide reference-library__upload" }, WP = ["disabled"], GP = { class: "wide" }, KP = { class: "reference-library__analysis-action" }, qP = ["disabled"], JP = {
	key: 0,
	class: "reference-library__analysis-meta"
}, YP = { key: 0 }, XP = { class: "reference-library__grid" }, ZP = { class: "wide" }, QP = { class: "wide" }, $P = { class: "wide" }, eF = { class: "wide" }, tF = { class: "reference-library__grid" }, nF = { class: "reference-library__score-heading" }, rF = { class: "reference-library__scores" }, iF = ["onUpdate:modelValue"], aF = { class: "reference-library__check" }, oF = { class: "reference-library__approval" }, sF = { key: 0 }, cF = { key: 1 }, lF = { class: "reference-library__footer" }, uF = ["href"], dF = ["disabled"], fF = ["disabled"], pF = ["disabled"], mF = ["disabled"], hF = {
	key: 0,
	class: "reference-library__history"
}, gF = /*#__PURE__*/ Jh({
	__name: "LayoutReferenceManager",
	emits: ["status"],
	setup(e, { emit: t }) {
		let n = t, r = [
			["hierarchy", "시각적 위계"],
			["composition", "구성 완성도"],
			["originality", "차별성"],
			["responsiveness", "반응형 품질"],
			["reusability", "재사용성"]
		], i = {
			draft: "초안",
			review: "검토중",
			approved: "승인",
			archived: "보관"
		}, a = /* @__PURE__ */ R([]), o = /* @__PURE__ */ R([]), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(!1), l = /* @__PURE__ */ R(!1), u = /* @__PURE__ */ R(!1), d = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R(""), p = /* @__PURE__ */ R(""), m = /* @__PURE__ */ R(""), h = /* @__PURE__ */ R(""), _ = () => ({
			title: "",
			sourceSite: "",
			sourceUrl: "",
			previewImageUrl: "",
			status: "draft",
			pageType: "promotion-landing",
			industry: "",
			promotionGoal: "",
			viewport: "responsive",
			visualStylesText: "",
			sectionTypesText: "hero",
			tagsText: "",
			designSummary: "",
			strengths: "",
			risks: "",
			layoutSpecText: JSON.stringify({
				layoutFamily: "",
				primitives: [],
				desktop: {},
				mobile: {}
			}, null, 2),
			qualityScores: {
				hierarchy: 0,
				composition: 0,
				originality: 0,
				responsiveness: 0,
				reusability: 0
			},
			copyrightReviewed: !1,
			capturedAt: "",
			adminNotes: "",
			analysisMeta: {},
			changeNote: ""
		}), v = /* @__PURE__ */ It(_()), y = q(() => a.value.find((e) => e.id === f.value) || null), b = q(() => Array.from(new Set(a.value.flatMap((e) => e.sectionTypes || []))).sort((e, t) => e.localeCompare(t, "ko"))), x = q(() => {
			let e = p.value.trim().toLowerCase();
			return a.value.filter((t) => m.value && t.status !== m.value || h.value && !(t.sectionTypes || []).includes(h.value) ? !1 : !e || [
				t.title,
				t.sourceSite,
				t.sourceUrl,
				t.pageType,
				t.industry,
				t.promotionGoal,
				...t.visualStyles || [],
				...t.tags || []
			].some((t) => String(t || "").toLowerCase().includes(e)));
		}), S = q(() => ({
			total: a.value.length,
			review: a.value.filter((e) => e.status === "review").length,
			approved: a.value.filter((e) => e.status === "approved").length,
			highQuality: a.value.filter((e) => Number(e.qualityScore || 0) >= 4).length,
			plannerReady: a.value.filter((e) => e.plannerReadiness?.ready).length
		})), ee = q(() => o.value.filter((e) => e.layoutReferenceId === f.value)), C = q(() => {
			let e = r.map(([e]) => Number(v.qualityScores[e] || 0));
			return Math.round(e.reduce((e, t) => e + t, 0) / e.length * 100) / 100;
		}), w = q(() => [
			{
				label: "출처 URL",
				passed: !!v.sourceUrl.trim()
			},
			{
				label: "섹션 유형",
				passed: E(v.sectionTypesText).length > 0
			},
			{
				label: "디자인 분석",
				passed: !!v.designSummary.trim()
			},
			{
				label: "Layout Spec",
				passed: (() => {
					try {
						return Object.keys(JSON.parse(v.layoutSpecText || "{}") || {}).length > 0;
					} catch {
						return !1;
					}
				})()
			},
			{
				label: "품질점수 4.0 이상",
				passed: C.value >= 4
			},
			{
				label: "5개 평가항목 입력",
				passed: r.every(([e]) => Number(v.qualityScores[e] || 0) > 0)
			},
			{
				label: "권리·출처 확인",
				passed: v.copyrightReviewed
			}
		]), T = q(() => w.value.every((e) => e.passed));
		function E(e) {
			return Array.from(new Set(String(e || "").split(",").map((e) => e.trim()).filter(Boolean)));
		}
		function D(e) {
			return i[e] || e;
		}
		function O(e) {
			try {
				return new URL(String(e || "")).hostname;
			} catch {
				return "출처 미확인";
			}
		}
		function k(e) {
			if (!e) return "-";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? String(e) : new Intl.DateTimeFormat("ko-KR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit"
			}).format(t);
		}
		function te(e) {
			if (!e) return "";
			let t = new Date(e);
			if (Number.isNaN(t.getTime())) return "";
			let n = t.getTimezoneOffset() * 6e4;
			return new Date(t.getTime() - n).toISOString().slice(0, 16);
		}
		function ne() {
			f.value = "", Object.assign(v, _()), d.value = "";
		}
		function A(e) {
			f.value = e.id, Object.assign(v, {
				title: e.title || "",
				sourceSite: e.sourceSite || "",
				sourceUrl: e.sourceUrl || "",
				previewImageUrl: e.previewImageUrl || "",
				status: e.status || "draft",
				pageType: e.pageType || "",
				industry: e.industry || "",
				promotionGoal: e.promotionGoal || "",
				viewport: e.viewport || "responsive",
				visualStylesText: (e.visualStyles || []).join(", "),
				sectionTypesText: (e.sectionTypes || []).join(", "),
				tagsText: (e.tags || []).join(", "),
				designSummary: e.designSummary || "",
				strengths: e.strengths || "",
				risks: e.risks || "",
				layoutSpecText: JSON.stringify(e.layoutSpec || {}, null, 2),
				qualityScores: Object.fromEntries(r.map(([t]) => [t, Number(e.qualityScores?.[t] || 0)])),
				copyrightReviewed: !!e.copyrightReviewed,
				capturedAt: te(e.capturedAt),
				adminNotes: "",
				analysisMeta: e.analysisMeta || {},
				changeNote: ""
			}), d.value = "";
		}
		function re(e = v.status) {
			let t;
			try {
				t = JSON.parse(v.layoutSpecText || "{}");
			} catch {
				throw Error("Layout Spec을 올바른 JSON 객체로 입력해 주세요.");
			}
			if (!t || typeof t != "object" || Array.isArray(t)) throw Error("Layout Spec은 JSON 객체여야 합니다.");
			return {
				title: v.title.trim(),
				sourceSite: v.sourceSite.trim(),
				sourceUrl: v.sourceUrl.trim(),
				previewImageUrl: v.previewImageUrl.trim(),
				status: e,
				pageType: v.pageType.trim(),
				industry: v.industry.trim(),
				promotionGoal: v.promotionGoal.trim(),
				viewport: v.viewport,
				visualStyles: E(v.visualStylesText),
				sectionTypes: E(v.sectionTypesText),
				tags: E(v.tagsText),
				designSummary: v.designSummary.trim(),
				strengths: v.strengths.trim(),
				risks: v.risks.trim(),
				layoutSpec: t,
				qualityScores: Object.fromEntries(r.map(([e]) => [e, Number(v.qualityScores[e] || 0)])),
				copyrightReviewed: v.copyrightReviewed,
				capturedAt: v.capturedAt ? new Date(v.capturedAt).toISOString() : null,
				analysisMeta: v.analysisMeta,
				changeNote: v.changeNote.trim()
			};
		}
		async function ie(e) {
			let t = e.target.files?.[0];
			if (t) {
				if (![
					"image/png",
					"image/jpeg",
					"image/webp"
				].includes(t.type)) {
					d.value = "PNG, JPEG 또는 WebP 이미지를 선택해 주세요.", e.target.value = "";
					return;
				}
				if (t.size > 10 * 1024 * 1024) {
					d.value = "레퍼런스 이미지는 10MB 이하여야 합니다.", e.target.value = "";
					return;
				}
				u.value = !0, d.value = "";
				try {
					let e = t.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "reference-image", r = await pP(`layout-reference-uploads/${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`, t, {
						access: "public",
						handleUploadUrl: "/api/layout-reference-image-upload"
					});
					v.previewImageUrl = r.url, v.capturedAt ||= te((/* @__PURE__ */ new Date()).toISOString()), n("status", "레퍼런스 이미지를 업로드했습니다. AI 자동 분석을 실행할 수 있습니다.");
				} catch (e) {
					d.value = e.message || "레퍼런스 이미지 업로드에 실패했습니다.";
				} finally {
					u.value = !1, e.target.value = "";
				}
			}
		}
		async function j() {
			if (!v.sourceUrl.trim() || !v.previewImageUrl.trim()) {
				d.value = "AI 분석에는 출처 URL과 공개 HTTPS 미리보기 이미지 URL이 필요합니다.";
				return;
			}
			l.value = !0, d.value = "";
			try {
				let e = await bP.analyze({
					title: v.title.trim(),
					sourceSite: v.sourceSite.trim(),
					sourceUrl: v.sourceUrl.trim(),
					previewImageUrl: v.previewImageUrl.trim(),
					pageType: v.pageType.trim(),
					industry: v.industry.trim(),
					promotionGoal: v.promotionGoal.trim(),
					viewport: v.viewport,
					adminNotes: v.adminNotes.trim()
				}), t = e.analysis || {};
				Object.assign(v, {
					title: t.title || v.title,
					sourceSite: t.sourceSite || v.sourceSite,
					pageType: t.pageType || v.pageType,
					industry: t.industry || v.industry,
					promotionGoal: t.promotionGoal || v.promotionGoal,
					viewport: t.viewport || v.viewport,
					visualStylesText: (t.visualStyles || []).join(", "),
					sectionTypesText: (t.sectionTypes || []).join(", "),
					tagsText: (t.tags || []).join(", "),
					designSummary: t.designSummary || "",
					strengths: t.strengths || "",
					risks: [t.risks || "", ...(t.warnings || []).map((e) => `- ${e}`)].filter(Boolean).join("\n"),
					layoutSpecText: JSON.stringify(t.layoutSpec || {}, null, 2),
					qualityScores: Object.fromEntries(r.map(([e]) => [e, Number(t.qualityScores?.[e] || 0)])),
					analysisMeta: {
						analyzedAt: e.analyzedAt || (/* @__PURE__ */ new Date()).toISOString(),
						confidence: Number(t.confidence || 0),
						warnings: t.warnings || [],
						prompt: e.prompt || {},
						provider: e.provider || {},
						executionDisplay: e.executionDisplay || null,
						usage: e.usage || {}
					},
					status: v.status === "approved" ? "review" : v.status,
					changeNote: "AI 레이아웃 레퍼런스 분석 초안 적용"
				}), n("status", "AI 분석 초안을 적용했습니다. 내용을 검토한 뒤 저장해 주세요.");
			} catch (e) {
				d.value = e.message;
			} finally {
				l.value = !1;
			}
		}
		async function M(e = f.value) {
			s.value = !0, d.value = "";
			try {
				let t = await bP.list();
				a.value = t.references || [], o.value = t.histories || [];
				let n = a.value.find((t) => t.id === e);
				n ? A(n) : a.value.length && !f.value ? A(a.value[0]) : a.value.length || ne();
			} catch (e) {
				d.value = e.message;
			} finally {
				s.value = !1;
			}
		}
		async function ae(e = v.status) {
			c.value = !0, d.value = "";
			try {
				if (!v.title.trim() || !v.sourceUrl.trim()) throw Error("레퍼런스명과 출처 URL을 입력해 주세요.");
				let t = !y.value;
				await M((t ? await bP.create(re("draft")) : await bP.update(y.value.id, re(e))).reference.id), n("status", t ? "레이아웃 레퍼런스 초안을 등록했습니다." : "레이아웃 레퍼런스를 저장했습니다.");
			} catch (e) {
				d.value = e.message;
			} finally {
				c.value = !1;
			}
		}
		async function N(e) {
			if (y.value) {
				if (e === "approved" && !T.value) {
					d.value = "승인 조건을 모두 충족해야 LLM 검색 후보로 사용할 수 있습니다.";
					return;
				}
				v.status = e, v.changeNote.trim() || (v.changeNote = `${D(e)} 상태로 변경`), await ae(e);
			}
		}
		return ws(() => M()), (e, t) => (V(), H("section", xP, [
			U("header", SP, [t[27] ||= U("div", null, [
				U("span", { class: "reference-library__eyebrow" }, "Design Research Library"),
				U("h2", { id: "reference-library-title" }, "레이아웃 레퍼런스"),
				U("p", null, "우수 웹사이트의 출처와 디자인 원리를 조사해 저장합니다. 승인 자료만 향후 LLM 레이아웃 검색 후보로 사용합니다.")
			], -1), U("div", CP, [U("button", {
				class: "tiny-button",
				type: "button",
				disabled: s.value,
				onClick: t[0] ||= (e) => M()
			}, "새로고침", 8, wP), U("button", {
				class: "tiny-button primary",
				type: "button",
				onClick: ne
			}, "신규 레퍼런스")])]),
			t[65] ||= U("div", { class: "reference-library__notice" }, [U("strong", null, "Research only"), U("span", null, "원본 코드·카피·이미지를 복제하지 않고, 추상화된 Layout Primitive와 품질 평가만 저장합니다.")], -1),
			U("div", TP, [
				U("div", null, [U("strong", null, L(S.value.total), 1), t[28] ||= U("span", null, "전체", -1)]),
				U("div", null, [U("strong", null, L(S.value.review), 1), t[29] ||= U("span", null, "검토중", -1)]),
				U("div", null, [U("strong", null, L(S.value.approved), 1), t[30] ||= U("span", null, "LLM 사용 승인", -1)]),
				U("div", null, [U("strong", null, L(S.value.highQuality), 1), t[31] ||= U("span", null, "품질 4.0 이상", -1)]),
				U("div", null, [U("strong", null, L(S.value.plannerReady), 1), t[32] ||= U("span", null, "Planner 사용 가능", -1)])
			]),
			d.value ? (V(), H("div", EP, [t[33] ||= U("strong", null, "레이아웃 레퍼런스 오류", -1), U("span", null, L(d.value), 1)])) : G("", !0),
			U("div", DP, [U("aside", OP, [U("div", kP, [
				z(U("input", {
					"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
					type: "search",
					"aria-label": "레이아웃 레퍼런스 검색",
					placeholder: "사이트·스타일·목적 검색"
				}, null, 512), [[J, p.value]]),
				z(U("select", {
					"onUpdate:modelValue": t[2] ||= (e) => m.value = e,
					"aria-label": "레퍼런스 상태 필터"
				}, [...t[34] ||= [to("<option value=\"\" data-v-53d013e4>전체 상태</option><option value=\"draft\" data-v-53d013e4>초안</option><option value=\"review\" data-v-53d013e4>검토중</option><option value=\"approved\" data-v-53d013e4>승인</option><option value=\"archived\" data-v-53d013e4>보관</option>", 5)]], 512), [[Y, m.value]]),
				z(U("select", {
					"onUpdate:modelValue": t[3] ||= (e) => h.value = e,
					"aria-label": "섹션 유형 필터"
				}, [t[35] ||= U("option", { value: "" }, "전체 섹션", -1), (V(!0), H(K, null, B(b.value, (e) => (V(), H("option", {
					key: e,
					value: e
				}, L(e), 9, AP))), 128))], 512), [[Y, h.value]])
			]), U("div", jP, [(V(!0), H(K, null, B(x.value, (e) => (V(), H("button", {
				key: e.id,
				class: g(["reference-library__row", { selected: f.value === e.id }]),
				type: "button",
				onClick: (t) => A(e)
			}, [
				U("span", { class: g(["reference-library__thumb", { empty: !e.previewImageUrl }]) }, [e.previewImageUrl ? (V(), H("img", {
					key: 0,
					src: e.previewImageUrl,
					alt: "",
					loading: "lazy",
					referrerpolicy: "no-referrer"
				}, null, 8, NP)) : (V(), H("span", PP, "REF"))], 2),
				U("span", FP, [
					U("strong", null, L(e.title), 1),
					U("small", null, L(e.sourceSite || O(e.sourceUrl)), 1),
					U("span", null, [(V(!0), H(K, null, B(e.sectionTypes.slice(0, 2), (e) => (V(), H("em", { key: e }, L(e), 1))), 128))])
				]),
				U("span", IP, [
					U("b", null, L(Number(e.qualityScore || 0).toFixed(1)), 1),
					U("em", { class: g(`is-${e.status}`) }, L(D(e.status)), 3),
					U("em", { class: g(e.plannerReadiness?.ready ? "is-ready" : "is-blocked") }, L(e.plannerReadiness?.ready ? "사용 가능" : "차단"), 3)
				])
			], 10, MP))), 128)), !s.value && !x.value.length ? (V(), H("p", LP, "조건에 맞는 레퍼런스가 없습니다.")) : G("", !0)])]), U("form", {
				class: "reference-library__editor",
				onSubmit: t[26] ||= Lu((e) => ae(), ["prevent"])
			}, [
				U("div", RP, [U("div", null, [U("strong", null, L(y.value ? y.value.title : "신규 레이아웃 레퍼런스"), 1), U("span", null, L(y.value ? `최근 수정 ${k(y.value.updatedAt)}` : "출처와 분석 결과를 입력해 주세요."), 1)]), y.value ? (V(), H("span", {
					key: 0,
					class: g(["reference-library__status", `is-${v.status}`])
				}, L(D(v.status)), 3)) : G("", !0)]),
				U("fieldset", {
					disabled: c.value || l.value,
					class: "reference-library__fields"
				}, [
					U("section", null, [
						t[46] ||= U("h3", null, "1. 조사 출처", -1),
						U("div", BP, [
							U("label", null, [t[36] ||= U("span", null, "레퍼런스명 *", -1), z(U("input", {
								"onUpdate:modelValue": t[4] ||= (e) => v.title = e,
								type: "text",
								maxlength: "200",
								autocomplete: "off"
							}, null, 512), [[J, v.title]])]),
							U("label", null, [t[37] ||= U("span", null, "사이트명", -1), z(U("input", {
								"onUpdate:modelValue": t[5] ||= (e) => v.sourceSite = e,
								type: "text",
								maxlength: "160",
								autocomplete: "off"
							}, null, 512), [[J, v.sourceSite]])]),
							U("label", VP, [t[38] ||= U("span", null, "출처 URL *", -1), z(U("input", {
								"onUpdate:modelValue": t[6] ||= (e) => v.sourceUrl = e,
								type: "url",
								placeholder: "https://example.com/campaign",
								autocomplete: "off"
							}, null, 512), [[J, v.sourceUrl]])]),
							U("label", HP, [t[39] ||= U("span", null, "미리보기 이미지 URL", -1), z(U("input", {
								"onUpdate:modelValue": t[7] ||= (e) => v.previewImageUrl = e,
								type: "url",
								placeholder: "HTTPS 이미지 URL",
								autocomplete: "off"
							}, null, 512), [[J, v.previewImageUrl]])]),
							U("label", UP, [
								t[40] ||= U("span", null, [W("스크린샷 업로드 "), U("small", null, "PNG, JPEG, WebP · 최대 10MB")], -1),
								U("input", {
									type: "file",
									accept: ".png,.jpg,.jpeg,.webp",
									disabled: u.value,
									onChange: ie
								}, null, 40, WP),
								U("em", null, L(u.value ? "업로드 중…" : v.previewImageUrl ? "업로드 또는 URL 준비됨" : "분석할 화면을 선택해 주세요."), 1)
							]),
							U("label", GP, [t[41] ||= U("span", null, "AI 분석 참고사항", -1), z(U("textarea", {
								"onUpdate:modelValue": t[8] ||= (e) => v.adminNotes = e,
								rows: "3",
								placeholder: "관찰할 영역, 캠페인 유형 또는 제외할 요소를 입력해 주세요."
							}, null, 512), [[J, v.adminNotes]])]),
							U("label", null, [t[43] ||= U("span", null, "수집 화면", -1), z(U("select", { "onUpdate:modelValue": t[9] ||= (e) => v.viewport = e }, [...t[42] ||= [
								U("option", { value: "responsive" }, "Desktop + Mobile", -1),
								U("option", { value: "desktop" }, "Desktop", -1),
								U("option", { value: "mobile" }, "Mobile", -1)
							]], 512), [[Y, v.viewport]])]),
							U("label", null, [t[44] ||= U("span", null, "조사 일시", -1), z(U("input", {
								"onUpdate:modelValue": t[10] ||= (e) => v.capturedAt = e,
								type: "datetime-local"
							}, null, 512), [[J, v.capturedAt]])])
						]),
						U("div", KP, [t[45] ||= U("div", null, [U("strong", null, "스크린샷 AI 분석"), U("span", null, "원본 자산을 복제하지 않고 구성 원리와 Layout Spec 초안만 생성합니다.")], -1), U("button", {
							class: "tiny-button primary",
							type: "button",
							disabled: l.value || u.value || !v.sourceUrl || !v.previewImageUrl,
							onClick: j
						}, L(l.value ? "분석 중…" : "AI 자동 분석"), 9, qP)]),
						v.analysisMeta?.analyzedAt ? (V(), H("div", JP, [
							U("span", null, "최근 분석 " + L(k(v.analysisMeta.analyzedAt)), 1),
							U("span", null, "신뢰도 " + L(Math.round(Number(v.analysisMeta.confidence || 0) * 100)) + "%", 1),
							v.analysisMeta.executionDisplay ? (V(), H("span", YP, L(v.analysisMeta.executionDisplay.providerLabel) + " · " + L(v.analysisMeta.executionDisplay.modelLabel), 1)) : G("", !0)
						])) : G("", !0)
					]),
					U("section", null, [t[53] ||= U("h3", null, "2. 검색 분류", -1), U("div", XP, [
						U("label", null, [t[47] ||= U("span", null, "페이지 유형", -1), z(U("input", {
							"onUpdate:modelValue": t[11] ||= (e) => v.pageType = e,
							type: "text",
							placeholder: "promotion-landing"
						}, null, 512), [[J, v.pageType]])]),
						U("label", null, [t[48] ||= U("span", null, "산업", -1), z(U("input", {
							"onUpdate:modelValue": t[12] ||= (e) => v.industry = e,
							type: "text",
							placeholder: "gaming, retail"
						}, null, 512), [[J, v.industry]])]),
						U("label", ZP, [t[49] ||= U("span", null, "전환 목표", -1), z(U("input", {
							"onUpdate:modelValue": t[13] ||= (e) => v.promotionGoal = e,
							type: "text",
							placeholder: "이벤트 참여, 구매 전환"
						}, null, 512), [[J, v.promotionGoal]])]),
						U("label", QP, [t[50] ||= U("span", null, [W("섹션 유형 * "), U("small", null, "쉼표로 구분")], -1), z(U("input", {
							"onUpdate:modelValue": t[14] ||= (e) => v.sectionTypesText = e,
							type: "text",
							placeholder: "hero, benefits, offer"
						}, null, 512), [[J, v.sectionTypesText]])]),
						U("label", $P, [t[51] ||= U("span", null, [W("시각 스타일 "), U("small", null, "쉼표로 구분")], -1), z(U("input", {
							"onUpdate:modelValue": t[15] ||= (e) => v.visualStylesText = e,
							type: "text",
							placeholder: "cinematic, dark, immersive"
						}, null, 512), [[J, v.visualStylesText]])]),
						U("label", eF, [t[52] ||= U("span", null, [W("검색 태그 "), U("small", null, "쉼표로 구분")], -1), z(U("input", {
							"onUpdate:modelValue": t[16] ||= (e) => v.tagsText = e,
							type: "text",
							placeholder: "full-bleed, layered-media, high-contrast"
						}, null, 512), [[J, v.tagsText]])])
					])]),
					U("section", null, [
						t[58] ||= U("h3", null, "3. 디자인 원리 분석", -1),
						U("label", null, [t[54] ||= U("span", null, "디자인 요약 *", -1), z(U("textarea", {
							"onUpdate:modelValue": t[17] ||= (e) => v.designSummary = e,
							rows: "4",
							placeholder: "시각적 위계, 섹션 흐름, 이미지·CTA 전략을 설명합니다."
						}, null, 512), [[J, v.designSummary]])]),
						U("div", tF, [U("label", null, [t[55] ||= U("span", null, "강점", -1), z(U("textarea", {
							"onUpdate:modelValue": t[18] ||= (e) => v.strengths = e,
							rows: "4",
							placeholder: "재사용할 가치가 있는 디자인 원리"
						}, null, 512), [[J, v.strengths]])]), U("label", null, [t[56] ||= U("span", null, "위험·제약", -1), z(U("textarea", {
							"onUpdate:modelValue": t[19] ||= (e) => v.risks = e,
							rows: "4",
							placeholder: "모방 위험, 접근성, 모바일 제약"
						}, null, 512), [[J, v.risks]])])]),
						U("label", null, [t[57] ||= U("span", null, "추상화 Layout Spec *", -1), z(U("textarea", {
							"onUpdate:modelValue": t[20] ||= (e) => v.layoutSpecText = e,
							class: "reference-library__code",
							rows: "12",
							spellcheck: "false"
						}, null, 512), [[J, v.layoutSpecText]])])
					]),
					U("section", null, [
						U("div", nF, [t[59] ||= U("h3", null, "4. 품질 평가", -1), U("strong", null, L(C.value.toFixed(1)) + " / 5.0", 1)]),
						U("div", rF, [(V(), H(K, null, B(r, ([e, n]) => U("label", { key: e }, [U("span", null, L(n), 1), z(U("select", { "onUpdate:modelValue": (t) => v.qualityScores[e] = t }, [...t[60] ||= [
							U("option", { value: 0 }, "미평가", -1),
							U("option", { value: 1 }, "1 · 부족", -1),
							U("option", { value: 2 }, "2", -1),
							U("option", { value: 3 }, "3 · 보통", -1),
							U("option", { value: 4 }, "4 · 우수", -1),
							U("option", { value: 5 }, "5 · 탁월", -1)
						]], 8, iF), [[
							Y,
							v.qualityScores[e],
							void 0,
							{ number: !0 }
						]])])), 64))]),
						U("label", aF, [z(U("input", {
							"onUpdate:modelValue": t[21] ||= (e) => v.copyrightReviewed = e,
							type: "checkbox"
						}, null, 512), [[Mu, v.copyrightReviewed]]), t[61] ||= U("span", null, [U("strong", null, "출처와 사용 범위를 확인했습니다."), W(" 원본 코드·카피·이미지를 저장하거나 복제하지 않고 디자인 원리만 연구 목적으로 사용합니다.")], -1)])
					]),
					U("section", oF, [
						t[62] ||= U("div", null, [U("h3", null, "5. LLM 검색 후보 승인"), U("p", null, "모든 조건을 통과한 승인 자료만 생성 워크플로우에서 검색할 수 있습니다.")], -1),
						U("ul", null, [(V(!0), H(K, null, B(w.value, (e) => (V(), H("li", {
							key: e.label,
							class: g({ passed: e.passed })
						}, [U("span", null, L(e.passed ? "✓" : "–"), 1), W(L(e.label), 1)], 2))), 128))]),
						y.value?.plannerReadiness ? (V(), H("div", {
							key: 0,
							class: g(["reference-library__readiness", { ready: y.value.plannerReadiness.ready }])
						}, [U("strong", null, L(y.value.plannerReadiness.ready ? "Planner 사용 가능" : "Planner 사용 차단"), 1), y.value.plannerReadiness.ready ? (V(), H("span", sF, "현재 저장 상태가 모든 검색 조건을 충족합니다.")) : (V(), H("ul", cF, [(V(!0), H(K, null, B(y.value.plannerReadiness.blockers, (e) => (V(), H("li", { key: e.code }, [U("code", null, L(e.code), 1), W(L(e.message), 1)]))), 128))]))], 2)) : G("", !0)
					]),
					U("label", null, [t[63] ||= U("span", null, "레퍼런스 변경 사유", -1), z(U("input", {
						"onUpdate:modelValue": t[22] ||= (e) => v.changeNote = e,
						type: "text",
						maxlength: "1000",
						placeholder: "레퍼런스 등록·수정·승인 사유"
					}, null, 512), [[J, v.changeNote]])])
				], 8, zP),
				U("div", lF, [
					v.sourceUrl ? (V(), H("a", {
						key: 0,
						class: "tiny-button",
						href: v.sourceUrl,
						target: "_blank",
						rel: "noopener noreferrer"
					}, "원본 사이트 열기", 8, uF)) : G("", !0),
					t[64] ||= U("span", { class: "reference-library__footer-spacer" }, null, -1),
					y.value && v.status !== "archived" ? (V(), H("button", {
						key: 1,
						class: "tiny-button",
						type: "button",
						disabled: c.value || l.value,
						onClick: t[23] ||= (e) => N("archived")
					}, "보관", 8, dF)) : G("", !0),
					y.value && v.status === "draft" ? (V(), H("button", {
						key: 2,
						class: "tiny-button",
						type: "button",
						disabled: c.value || l.value,
						onClick: t[24] ||= (e) => N("review")
					}, "검토 요청", 8, fF)) : G("", !0),
					y.value && v.status !== "approved" && v.status !== "archived" ? (V(), H("button", {
						key: 3,
						class: "tiny-button primary",
						type: "button",
						disabled: c.value || l.value || !T.value,
						onClick: t[25] ||= (e) => N("approved")
					}, "LLM 사용 승인", 8, pF)) : G("", !0),
					U("button", {
						class: "tiny-button primary",
						type: "submit",
						disabled: c.value
					}, L(c.value ? "저장 중…" : y.value ? "변경 저장" : "초안 등록"), 9, mF)
				]),
				y.value ? (V(), H("details", hF, [U("summary", null, "변경 이력 " + L(ee.value.length) + "건", 1), U("ol", null, [(V(!0), H(K, null, B(ee.value, (e) => (V(), H("li", { key: e.id }, [
					U("strong", null, L(e.action === "created" ? "등록" : e.action === "status_changed" ? "상태 변경" : "수정"), 1),
					U("span", null, L(e.previousStatus ? `${D(e.previousStatus)} → ` : "") + L(D(e.newStatus)), 1),
					U("small", null, L(e.changedBy) + " · " + L(k(e.changedAt)) + " · " + L(e.changeNote || "사유 없음"), 1)
				]))), 128))])])) : G("", !0)
			], 32)])
		]));
	}
}, [["__scopeId", "data-v-53d013e4"]]), _F = /* @__PURE__ */ s((() => {
	var e = {
		documents: "promoPrototype.documents.abc",
		generatedPages: "promoPrototype.generatedPages.abc",
		selectedDocumentId: "promoPrototype.selectedDocumentId.abc",
		generatedPage: "promoPrototype.generatedPage",
		themeMode: "promoPrototype.themeMode"
	}, t = {
		integrated_brief: 360 * 1e3,
		lofi_draft: 240 * 1e3,
		final_design: 360 * 1e3
	}, n = [
		{
			id: "preset-001",
			name: "GGPoker 글로벌 기본",
			brandId: "brand-ggpoker",
			market: "Global",
			description: "GGPoker 기본 레드/블랙 프로모션 스타일입니다.",
			isDefault: !0,
			colorTokens: {
				primary: "#d52b1e",
				cta: "#e12d25",
				canvas: "#f3f3f3",
				ink: "#151515"
			},
			typographyTokens: {
				headingFont: "Pretendard, Arial, sans-serif",
				bodyFont: "Pretendard, Arial, sans-serif",
				heroTitleWeight: "800"
			}
		},
		{
			id: "preset-002",
			name: "GGPoker 다크 프로모션",
			brandId: "brand-ggpoker",
			market: "Global",
			description: "어두운 고대비 캠페인 스타일입니다.",
			isDefault: !1,
			colorTokens: {
				primary: "#ff3b30",
				cta: "#ff2d25",
				canvas: "#111318",
				ink: "#ffffff"
			},
			typographyTokens: {
				headingFont: "'Arial Black', Arial, sans-serif",
				bodyFont: "Pretendard, Arial, sans-serif",
				heroTitleWeight: "900"
			}
		},
		{
			id: "preset-003",
			name: "GGVegas 기본",
			brandId: "brand-ggvegas",
			market: "Global",
			description: "카지노 분위기의 골드 포인트 스타일입니다.",
			isDefault: !1,
			colorTokens: {
				primary: "#c99700",
				cta: "#f2b705",
				canvas: "#f8f4e8",
				ink: "#18130a"
			},
			typographyTokens: {
				headingFont: "Georgia, serif",
				bodyFont: "Pretendard, Arial, sans-serif",
				heroTitleWeight: "800"
			}
		},
		{
			id: "preset-004",
			name: "브라질 컴플라이언스 스타일",
			brandId: "brand-ggpoker",
			market: "Brazil",
			description: "브라질 마켓 정책을 고려한 차분한 대비 스타일입니다.",
			isDefault: !1,
			colorTokens: {
				primary: "#007a33",
				cta: "#d52b1e",
				canvas: "#f4f7f1",
				ink: "#1b1f1a"
			},
			typographyTokens: {
				headingFont: "Pretendard, Arial, sans-serif",
				bodyFont: "Pretendard, Arial, sans-serif",
				heroTitleWeight: "700"
			}
		}
	], r = {
		id: "temp4",
		templateId: "default_temp",
		name: "Template 4",
		templateName: "Default Temp",
		version: "1.0.0",
		sectionOrder: [
			"header",
			"heroBanner",
			"stepBar",
			"contentCta",
			"imageTextRow",
			"titleDescription",
			"footer"
		],
		visualSections: [
			"heroBanner",
			"contentCta",
			"imageTextRow"
		],
		governance: {
			ignorePreviousConfig: !0,
			requiredMissingAlert: !0,
			progressRequired: !0,
			designStyleSelectionRemoved: !0,
			applySelectedDesignTokens: !0
		},
		promotionInputSchema: {
			purpose: {
				label: "프로모션 목적",
				required: !0,
				inputType: "select",
				options: [
					"할인쿠폰",
					"웰컴",
					"이벤트",
					"기타"
				],
				otherInputRequiredWhen: "기타"
			},
			targetCustomer: {
				label: "대상고객",
				required: !0,
				inputType: "select",
				options: [
					"신규",
					"기존고객",
					"윈백고객"
				]
			},
			campaignTone: {
				label: "캠페인톤",
				required: !0,
				inputType: "select",
				options: [
					"활기찬",
					"신중한",
					"럭키",
					"프리미엄",
					"긴급한",
					"친근한"
				]
			}
		},
		templateForm: {
			mode: "default_template",
			sectionVisibilityDefault: !0,
			dragOrderEnabled: !0,
			fixedTopSection: "header",
			fixedBottomSection: "footer",
			itemVisibilityEnabled: !0,
			ctaMovesWithSection: !0
		},
		generationRules: {
			settings: ["AI 자동 생성", "템플릿 선택"],
			pocWebhookInputEnabled: !0,
			useSelectedDesignTokensOnly: !0,
			requestImageGenerationForMarkedItems: !0
		},
		validationRules: {
			requiredInputs: [
				"purpose",
				"targetCustomer",
				"campaignTone",
				"template"
			],
			missingInputBehavior: "show_missing_alert"
		},
		progress: {
			enabled: !0,
			message: "디자인 생성되고 있습니다.",
			animation: !0,
			canClose: !0,
			stages: [
				"db",
				"data",
				"process",
				"design_generation"
			]
		},
		sections: [
			{
				sectionId: "header",
				name: "Header",
				defaultVisible: !0,
				fixedPosition: "top",
				orderChangeAllowed: !1,
				items: [{
					itemId: "logoText",
					label: "LOGO",
					required: !0,
					defaultVisible: !0,
					inputPath: "header.logoText",
					description: "로고이미지"
				}, {
					itemId: "badgeText",
					label: "Badges",
					required: !0,
					defaultVisible: !0,
					inputPath: "header.badgeText",
					imageGenerationRequest: !0,
					description: "뱃지 이미지"
				}]
			},
			{
				sectionId: "heroBanner",
				name: "Hero Banner",
				defaultVisible: !0,
				orderChangeAllowed: !0,
				items: [
					{
						itemId: "leaderText",
						label: "Lead Text",
						defaultVisible: !0,
						inputPath: "heroBanner.leaderText",
						description: "주요 문구"
					},
					{
						itemId: "title",
						label: "Title",
						required: !0,
						defaultVisible: !0,
						inputPath: "heroBanner.title",
						description: "제목"
					},
					{
						itemId: "sublineText",
						label: "Subline Text",
						defaultVisible: !0,
						inputPath: "heroBanner.sublineText",
						description: "부제목"
					},
					{
						itemId: "button",
						label: "Button",
						defaultVisible: !0,
						inputPath: "heroBanner.cta.label",
						imageGenerationRequest: !0,
						movesWithSection: !0,
						description: "버튼 텍스트"
					},
					{
						itemId: "alphaText",
						label: "Alpha Text",
						defaultVisible: !0,
						inputPath: "heroBanner.alphaText",
						description: "추가 안내 문구"
					}
				]
			},
			{
				sectionId: "stepBar",
				name: "Step Bar",
				defaultVisible: !0,
				orderChangeAllowed: !0,
				repeatableSet: {
					label: "Step Set",
					addLabel: "Step Set 추가",
					note: "Title, Description, CTA Button이 1개 세트입니다."
				},
				items: [
					{
						itemId: "title",
						label: "Title",
						defaultVisible: !0,
						inputKey: "title",
						description: "제목"
					},
					{
						itemId: "description",
						label: "Description",
						defaultVisible: !0,
						inputKey: "description",
						description: "설명"
					},
					{
						itemId: "ctaButton",
						label: "CTA Button",
						defaultVisible: !0,
						inputKey: "ctaLabel",
						description: "버튼 텍스트"
					}
				]
			},
			{
				sectionId: "contentCta",
				name: "Contents",
				defaultVisible: !0,
				orderChangeAllowed: !0,
				items: [
					{
						itemId: "title",
						label: "Title",
						defaultVisible: !0,
						inputPath: "contentCta.title",
						imageGenerationRequest: !0,
						description: "제목"
					},
					{
						itemId: "description",
						label: "Description",
						defaultVisible: !0,
						inputPath: "contentCta.longText",
						imageGenerationRequest: !0,
						inputType: "textarea",
						description: "이미지와 텍스트 및 CTA 버튼으로 자유롭게 구성"
					},
					{
						itemId: "image",
						label: "Image",
						defaultVisible: !0,
						inputPath: "contentCta.imageText",
						imageGenerationRequest: !0,
						description: "이미지"
					},
					{
						itemId: "button",
						label: "button",
						defaultVisible: !0,
						inputPath: "contentCta.cta.label",
						imageGenerationRequest: !0,
						movesWithSection: !0,
						description: "버튼 텍스트"
					}
				]
			},
			{
				sectionId: "imageTextRow",
				name: "Image Text Row",
				defaultVisible: !0,
				orderChangeAllowed: !0,
				repeatableSet: {
					label: "Image Text Set",
					addLabel: "Image Text Set 추가",
					maxPerRow: 3,
					note: "Image, Title, Description이 1개 세트이며 1 row 최대 3개까지 배치합니다."
				},
				items: [
					{
						itemId: "image",
						label: "Image",
						defaultVisible: !0,
						inputKey: "imageText",
						imageGenerationRequest: !0,
						description: "이미지"
					},
					{
						itemId: "title",
						label: "Title",
						defaultVisible: !0,
						inputKey: "title",
						description: "제목"
					},
					{
						itemId: "description",
						label: "Description",
						defaultVisible: !0,
						inputKey: "description",
						description: "설명"
					}
				]
			},
			{
				sectionId: "titleDescription",
				name: "Title and Description",
				defaultVisible: !0,
				orderChangeAllowed: !0,
				items: [{
					itemId: "title",
					label: "Title",
					defaultVisible: !0,
					inputPath: "titleDescription.title"
				}, {
					itemId: "contents",
					label: "Contents",
					defaultVisible: !0,
					inputPath: "titleDescription.contents",
					imageGenerationRequest: !0,
					inputType: "textarea",
					description: "텍스트 등록, Bold/블릿 적용 가능"
				}]
			},
			{
				sectionId: "footer",
				name: "Footer",
				defaultVisible: !0,
				fixedPosition: "bottom",
				orderChangeAllowed: !1,
				items: [
					{
						itemId: "logoText",
						label: "Logo",
						required: !0,
						defaultVisible: !0,
						inputPath: "footer.logoText",
						imageGenerationRequest: !0,
						description: "로고"
					},
					{
						itemId: "licenseBadges",
						label: "License Badges",
						required: !0,
						defaultVisible: !0,
						inputPath: "footer.licenseBadges",
						imageGenerationRequest: !0,
						description: "라이선스 뱃지"
					},
					{
						itemId: "content",
						label: "content",
						required: !0,
						defaultVisible: !0,
						inputPath: "footer.content",
						inputType: "textarea",
						description: "푸터 내용"
					}
				]
			}
		]
	};
	function i(e) {
		return Array.isArray(e?.sections) ? e.sections : [];
	}
	function a(e) {
		let t = i(e), n = new Map(t.map((e) => [e.sectionId || e.key, e]));
		return (Array.isArray(e?.sectionOrder) && e.sectionOrder.length ? e.sectionOrder : t.map((e) => e.sectionId || e.key)).map((e) => n.get(e)).filter(Boolean);
	}
	function o(e) {
		let t = a(e);
		return {
			orderedSections: t.map((e) => e.sectionId || e.key),
			sectionVisibility: Object.fromEntries(t.map((e) => [e.sectionId || e.key, e.defaultVisible !== !1])),
			itemVisibility: Object.fromEntries(t.map((e) => [e.sectionId || e.key, Object.fromEntries((e.items || []).map((e) => [e.itemId || e.key, e.defaultVisible !== !1]))])),
			imageGenerationMode: Object.fromEntries(t.map((e) => [e.sectionId || e.key, Object.fromEntries((e.items || []).map((e) => {
				let t = e.itemId || e.key;
				return e.imageGenerationRequest || e.sendToImagePrompt ? [t, "generate"] : [t, "none"];
			}))]))
		};
	}
	function s(e) {
		return e?.imageGenerationRequest || e?.sendToImagePrompt ? "generate" : "none";
	}
	function c(e, t = null) {
		let n = i(e), r = a(e).map((e) => e.sectionId || e.key), o = Array.isArray(t?.orderedSections) && t.orderedSections.length ? t.orderedSections.filter((e) => n.some((t) => (t.sectionId || t.key) === e)) : r, c = Object.fromEntries(n.map((e) => {
			let n = e.sectionId || e.key;
			return [n, t?.sectionVisibility?.[n] ?? e.defaultVisible !== !1];
		})), l = Object.fromEntries(n.map((e) => [e.sectionId || e.key, Object.fromEntries((e.items || []).map((n) => {
			let r = e.sectionId || e.key, i = n.itemId || n.key;
			return [i, t?.itemVisibility?.[r]?.[i] ?? n.defaultVisible !== !1];
		}))])), u = t?.imageGenerationMode || {};
		return {
			templateId: e?.templateId || e?.id,
			templateName: e?.templateName || e?.name,
			schemaVersion: e?.version || "1.0.0",
			orderedSections: o,
			visibleSections: o.filter((e) => c[e] !== !1),
			sectionVisibility: c,
			itemVisibility: l,
			fixedSections: n.filter((e) => e.fixedPosition).map((e) => ({
				sectionId: e.sectionId || e.key,
				fixedPosition: e.fixedPosition
			})),
			draggableSections: n.filter((e) => e.orderChangeAllowed !== !1 && !e.fixedPosition).map((e) => e.sectionId || e.key),
			imageGenerationTargets: n.flatMap((e) => (e.items || []).filter((t) => {
				if (e.repeatableSet) return !1;
				let n = e.sectionId || e.key, r = t.itemId || t.key;
				return c[n] === !1 || l[n]?.[r] === !1 ? !1 : (u?.[n]?.[r] || s(t)) === "generate";
			}).map((t) => ({
				sectionId: e.sectionId || e.key,
				itemId: t.itemId || t.key,
				label: t.label,
				inputPath: t.inputPath,
				mode: u?.[e.sectionId || e.key]?.[t.itemId || t.key] || s(t)
			}))),
			governance: e?.governance || {},
			promotionInputSchema: e?.promotionInputSchema || {},
			templateForm: e?.templateForm || {},
			generationRules: e?.generationRules || {},
			validationRules: e?.validationRules || {},
			progress: e?.progress || {}
		};
	}
	function l(e) {
		let t = String(e || "").trim();
		return {
			market: t,
			primaryUse: "image_generation",
			textCopyInfluence: "low",
			visualInfluence: t ? "medium_high" : "neutral",
			instruction: "",
			avoid: [],
			visualMood: ""
		};
	}
	function u() {
		return {
			header: {
				logoText: "GGPoker",
				badgeText: "프로모션"
			},
			heroBanner: {
				leaderText: "",
				title: "",
				sublineText: "",
				cta: {
					label: "",
					link: "",
					target: "_blank"
				},
				alphaText: "",
				visualMode: "auto"
			},
			stepBar: [
				{
					title: "",
					description: "",
					ctaLabel: "",
					link: "",
					target: "_blank"
				},
				{
					title: "",
					description: "",
					ctaLabel: "",
					link: "",
					target: "_blank"
				},
				{
					title: "",
					description: "",
					ctaLabel: "",
					link: "",
					target: "_blank"
				}
			],
			contentCta: {
				title: "",
				longText: "",
				imageText: "",
				cta: {
					label: "",
					link: "",
					target: "_blank"
				},
				visualMode: "auto"
			},
			imageTextRow: [{
				imageText: "",
				title: "",
				description: "",
				visualMode: "auto"
			}],
			titleDescription: {
				title: "이용약관",
				contents: ""
			},
			footer: {
				logoText: "GGPoker",
				licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
				content: ""
			}
		};
	}
	function d() {
		let e = {
			label: "Qualify on GGPoker",
			link: "https://www.ggpoker.com/promotions/",
			target: "_blank"
		}, t = [
			"Players must be aged 18+ to participate in all GGPoker promotions.",
			"GGPoker's game currency is USD ($). Other currencies, such as GBP (£), are only used for illustrative purposes and subject to currency exchange rate fluctuations.",
			"Please note that prize pools and jackpot guarantees are subject to change and some amounts listed on this website may not be current; please check the guarantee amounts listed in the tournament lobby of the GGPoker app for up-to-date prize pool information.",
			"Welcome Bonus promotion for new players is available for 90 days.",
			"Honeymoon promotion for new players is available for 30 days.",
			"If any players fall under suspicion of fraudulent activity, GGPoker has the right to investigate and remove the players once it's confirmed.",
			"The promotion terms and conditions are subject to the site terms and conditions, which can be found here.",
			"GGPoker reserves the right to modify or suspend the promotion at any time.",
			"GGPoker standard rules apply."
		].join("\n"), n = [
			"Disclaimer: GG International Limited, trading as GGPoker; is regulated by the Isle of Man Gambling Supervision Commission under a Licence issued under the Online Gambling Regulations Act 2001 on 15 October 2020. Registered address is The Hubb, Queen Victoria House, Victoria Street, Douglas, IM1 2LF, Isle of Man.",
			"All debts are enforceable in Law on the Isle of Man. GG International Limited strictly prohibits access and services to those under the legal age of Eighteen (18). Customers should check the laws and regulations in their own country and comply with them. Information on this website is subject to change without notice. GGPoker | © 2018 - 2026",
			"Please play responsibly."
		].join("\n");
		return {
			promo: {
				title: "LIVE EVENTS GOT BIGGER!",
				template: "default_temp",
				promotionPurpose: "이벤트",
				promotionPurposeOther: "",
				market: "United Kingdom",
				leadText: "For GGPoker Qualifiers",
				subline: "Not on GGPoker? You're missing up to 20% live event cashes.",
				alphaText: "18+. Cash boost paid in C$ (cash game credit). Selected Main Events only. Entry via GGPoker only (qualify or buy-in direct). T&Cs apply. GambleAware.org. Please play responsibly.",
				ctaLabel: e.label,
				ctaUrl: e.link,
				termsText: t
			},
			simpleBrief: {
				mainOffer: "You're missing up to 20% live event cashes",
				targetAction: "Qualify or buy-in online for Grosvenor live poker events via GGPoker",
				audience: "기존고객",
				campaignTone: "활기찬",
				secondaryMessage: "Get more value on live event cashes and qualify online for the biggest UK poker tournaments."
			},
			sectionInputs: {
				header: {
					logoText: "GGPoker logo",
					badgeText: "World Series of Poker official partner badges, Best Poker Software 2021, world's biggest poker room"
				},
				heroBanner: {
					leaderText: "For GGPoker Qualifiers",
					title: "LIVE EVENTS GOT BIGGER!",
					sublineText: "Not on GGPoker? You're missing up to 20% live event cashes.",
					cta: e,
					alphaText: "18+. Cash boost paid in C$ (cash game credit). Selected Main Events only. Entry via GGPoker only (qualify or buy-in direct). T&Cs apply. GambleAware.org. Please play responsibly.",
					visualMode: "auto"
				},
				stepBar: [{
					title: "QUALIFY OR BUY-IN ONLINE",
					description: "Enter Grosvenor live poker events via GGPoker",
					ctaLabel: "Qualify on GGPOKER",
					link: e.link,
					target: "_blank"
				}],
				contentCta: {
					title: "Get up to 20% MORE on live event cashes - only via GGPoker.",
					longText: [
						"Qualify or buy-in online for the biggest UK poker tournaments - including the iconic Goliath, GUKPT and G200 & G300 - and get more value on your cash finishes. Exclusive to GGPoker Players.",
						"The path to Goliath is LIVE. Satellites run Sunday to Friday from just £1 - bag your seat to the biggest poker event outside of Vegas!",
						"G200 & G300 qualifiers are also available, with G200 Round 11 next in Newcastle, Blackpool & Walsall (14-19 July) and G300 London at The Victoria (15-20 Sep).",
						"Get MORE with GGPoker"
					].join("\n"),
					imageText: "[이미지 컨텐츠]",
					cta: e,
					visualMode: "auto"
				},
				imageTextRow: [{
					imageText: "[이미지 컨텐츠]",
					title: "Your Safety Comes First",
					description: "The most advanced Security System in the Industry",
					visualMode: "auto"
				}],
				titleDescription: {
					title: "Terms and Conditions",
					contents: t
				},
				footer: {
					logoText: "GGPoker logo",
					licenseBadges: "Visa, Mastercard, 18+, bmm testlabs, GamCare, BeGambleAware.org",
					content: n
				}
			}
		};
	}
	function f({ promo: e, simpleBrief: t, selectedDocument: n, visualMode: r }) {
		let i = n?.brandName || "GGPoker", a = e.title.trim(), o = t.mainOffer.trim(), s = t.targetAction.trim(), c = t.audience.trim(), l = t.campaignTone.trim(), u = t.secondaryMessage.trim(), d = e.termsText.trim(), f = {
			label: e.ctaLabel.trim(),
			link: e.ctaUrl.trim(),
			target: "_blank"
		}, p = o || e.leadText.trim() || a, m = s || "가입 후 프로모션 단계를 진행하세요", h = c ? `${c} can ` : "", g = l ? ` Tone: ${l}.` : "";
		return {
			header: {
				logoText: i,
				badgeText: e.market || "Global"
			},
			heroBanner: {
				leaderText: p ? "추천 프로모션" : "",
				title: a,
				sublineText: p,
				cta: f,
				alphaText: e.alphaText.trim() || d,
				visualMode: r
			},
			stepBar: [
				{
					title: "시작",
					description: h ? `${h}${m.toLowerCase()}.` : m,
					ctaLabel: f.label,
					link: f.link,
					target: f.target
				},
				{
					title: "혜택 받기",
					description: p ? `혜택을 확인하세요: ${p}` : "캠페인 참여 조건을 확인하세요.",
					ctaLabel: f.label,
					link: f.link,
					target: f.target
				},
				{
					title: "플레이",
					description: u || "프로모션을 즐기기 전에 최종 조건을 확인하세요.",
					ctaLabel: f.label,
					link: f.link,
					target: f.target
				}
			],
			contentCta: {
				title: a || "프로모션 안내",
				longText: u || `${p}. ${m}.${g}`,
				imageText: p || a,
				cta: f,
				visualMode: r
			},
			imageTextRow: [{
				imageText: m,
				title: m,
				description: u || d || "프로모션 상세 내용을 확인한 뒤 CTA를 통해 참여하세요.",
				visualMode: r
			}],
			titleDescription: {
				title: "이용약관",
				contents: d
			},
			footer: {
				logoText: i,
				licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
				content: d
			}
		};
	}
	function p(e, t) {
		localStorage.setItem(e, JSON.stringify(t));
	}
	function m(e) {
		return e.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}
	function h(e) {
		return String(e || "").replace(/\.[^.]+$/, "").replace(/(?:-?design-?system|-?eng|-?kor)$/gi, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim() || "Untitled Design Style";
	}
	function g(e, t = {}) {
		try {
			return JSON.parse(e);
		} catch {
			return t;
		}
	}
	var _ = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	});
	function v(e = /* @__PURE__ */ new Date()) {
		let t = e instanceof Date ? e : new Date(e);
		return Number.isNaN(t.getTime()) ? null : _.formatToParts(t).reduce((e, t) => (t.type !== "literal" && (e[t.type] = t.value), e), {});
	}
	function y(e = /* @__PURE__ */ new Date()) {
		let t = v(e);
		return t ? `${t.year}-${t.month}-${t.day} ${t.hour}:${t.minute}` : String(e || "");
	}
	function b() {
		return y(/* @__PURE__ */ new Date());
	}
	function x(e = /* @__PURE__ */ new Date()) {
		let t = (e) => String(e).padStart(2, "0"), n = String(e || ""), r = n.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
		if (r) {
			let [, e, t, n, i, a] = r;
			return `${e.slice(-2)}${t}${n}${i}${a}`;
		}
		let i = v(e);
		return i ? [
			String(i.year).slice(-2),
			t(i.month),
			t(i.day),
			t(i.hour),
			t(i.minute)
		].join("") : n.replace(/\D/g, "").slice(2, 12);
	}
	function S(e, t) {
		let n = String(e || "").trim();
		if (!n || !t || !/promo-ui-design-generate\/?(?:\?.*)?$/.test(n)) return n;
		let r = `promo-ui-design-view?id=${encodeURIComponent(t)}`, i = n.replace(/promo-ui-design-generate\/?(?:\?.*)?$/, r);
		if (i !== n) return i;
		try {
			let e = new URL(n);
			return e.pathname = e.pathname.replace(/\/$/, "").replace(/promo-ui-design-generate$/, "promo-ui-design-view"), e.search = `?id=${encodeURIComponent(t)}`, e.toString();
		} catch {
			return n;
		}
	}
	function ee(e) {
		return /promo-ui-design-view|promo-ui-design-generate/.test(String(e || ""));
	}
	function C(e, t) {
		let n = String(e || "").trim();
		if (!n) return !1;
		if (n.startsWith("data:image/")) return !0;
		if (ee(n)) return !1;
		let r = String(t?.designUrl || t?.pageUrl || "").trim();
		return !(r && n === r);
	}
	function w(e) {
		return e ? `/api/promo-design-view?id=${encodeURIComponent(e)}` : "";
	}
	function T(e) {
		return e ? `/api/promo-design-image?id=${encodeURIComponent(e)}` : "";
	}
	function E(e) {
		return e ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(e)}` : "";
	}
	function D(e) {
		return e ? `/api/promo-generation-final-design-image?finalDesignId=${encodeURIComponent(e)}` : "";
	}
	function O(e) {
		if (!e || e.asset_type !== "generated_image") return !1;
		let t = Number(e.file_size || 0), n = String(e.mime_type || "").toLowerCase();
		return t > 0 && (t < 1024 || !n.startsWith("image/"));
	}
	function k(e = 5) {
		let t = new Uint8Array(e);
		if (window.crypto?.getRandomValues) window.crypto.getRandomValues(t);
		else for (let n = 0; n < e; n += 1) t[n] = Math.floor(Math.random() * 256);
		return Array.from(t, (e) => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[e % 62]).join("");
	}
	function te() {
		return `promo-${x(/* @__PURE__ */ new Date())}-${k(5)}`;
	}
	function ne(e) {
		return new Promise((t) => {
			window.setTimeout(t, e);
		});
	}
	function A(e) {
		let n = String(e?.stage || ""), r = String(e?.status || ""), i = t[n] || 0, a = e?.updatedAt || e?.updated_at || "", o = a ? new Date(a).getTime() : 0, s = o ? Math.max(0, Date.now() - o) : 0, c = /queued|generating|running|pending|accepted/i.test(r), l = !!(i && c && s > i);
		return {
			stage: n,
			status: r,
			ageMs: s,
			staleLimitMs: i,
			isActive: c,
			isStale: l,
			staleMessage: l ? "작업이 예상보다 오래 걸리고 있습니다. Worker 상태를 확인하거나 현재 단계를 다시 시도해 주세요." : ""
		};
	}
	function re(e) {
		let t = e.toLowerCase().replace(/^\d+\.\s*/, "");
		return t.includes("color") || t.includes("palette") ? "colors" : t.includes("typography") || t.includes("font") ? "typography" : t.includes("layout") || t.includes("spacing") || t.includes("grid") ? "layout" : t.includes("elevation") || t.includes("depth") || t.includes("shadow") ? "elevation" : t.includes("shape") || t.includes("radius") || t.includes("geometry") ? "shapes" : t.includes("component") || t.includes("styling") ? "components" : t.includes("responsive") || t.includes("breakpoint") ? "responsive" : t.includes("do's") || t.includes("don't") || t.includes("dos") ? "dos_donts" : t.includes("gap") ? "known_gaps" : t.includes("overview") || t.includes("theme") || t.includes("atmosphere") ? "overview" : "other";
	}
	function ie(e) {
		let t = e.split(/\r?\n/), n = [], r = null;
		for (let e of t) {
			let t = /^(#{1,4})\s+(.+)$/.exec(e);
			t ? (r = {
				level: t[1].length,
				title: t[2].trim(),
				category: re(t[2].trim()),
				excerpt: ""
			}, n.push(r)) : r && e.trim() && r.excerpt.length < 180 && (r.excerpt += `${e.trim()} `);
		}
		return n;
	}
	function j(e) {
		let t = ie(e), n = Array.from(new Set(e.match(/#[0-9a-fA-F]{6}\b/g) || [])).slice(0, 8), r = Array.from(new Set((e.match(/(?:fontFamily|font-family|Heading|Body|Primary):?\s*["'`]?([A-Za-z][A-Za-z0-9\s,-]*(?:Pretendard|sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia|system-ui))/gi) || []).map((e) => e.replace(/^(fontFamily|font-family|Heading|Body|Primary):?\s*/i, "").replace(/["'`]/g, "").trim()))).slice(0, 4), i = Array.from(new Set(t.map((e) => e.category))).filter((e) => e !== "other");
		return {
			headings: t,
			colors: n,
			fonts: r.length ? r : ["Pretendard, Arial, sans-serif"],
			categories: i,
			sectionCount: t.filter((e) => e.level <= 2).length,
			tokenCount: n.length + r.length
		};
	}
	function M({ id: e, brandId: t, brandName: n, slug: r, markdown: i, sourceName: a, designTokenFileName: o = "", designTokensJson: s = {}, status: c, updatedAt: l }) {
		return {
			id: e,
			brandId: t,
			brandName: n,
			designStyleName: n,
			slug: r,
			sourceName: a,
			designTokenFileName: o,
			designTokensJson: s,
			rawDesignTokens: s,
			status: c,
			updatedAt: l,
			markdown: i,
			designConcept: {
				summary: "",
				json: null,
				promptContext: "",
				analyzedAt: "",
				analysisModel: ""
			},
			summary: j(i)
		};
	}
	function ae() {
		return [
			M({
				id: "doc-001",
				brandId: "brand-ggpoker",
				brandName: "GGPoker",
				slug: "ggpoker",
				markdown: "---\nname: GGPoker-promo-design\ndescription: A high-contrast promo system with black casino surfaces, red CTA emphasis, compact step bars, and legal-first footer treatment.\ncolors:\n  primary: \"#d52b1e\"\n  cta: \"#e12d25\"\n  canvas: \"#f3f3f3\"\n  ink: \"#151515\"\ntypography:\n  heading: \"Pretendard, Arial, sans-serif\"\n  body: \"Pretendard, Arial, sans-serif\"\n---\n\n## Overview\n\nHigh contrast promotional landing pages that prioritize bonus clarity, quick CTA access, and market-specific responsible gaming compliance.\n\n## Colors\n\n### Brand & Accent\n\n- Primary red: #d52b1e\n- CTA red: #e12d25\n- Dark surface: #151515\n\n### Surface\n\n- Canvas: #f3f3f3\n- Content card: #ffffff\n\n## Typography\n\n### Font Family\n\n- Heading: Pretendard, Arial, sans-serif\n- Body: Pretendard, Arial, sans-serif\n\n## Layout\n\nTemplate 4 uses a fixed sequence of Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, and Footer.\n\n## Components\n\nButtons are pill-shaped red CTAs. Step bars use a dark background with large red numbers.\n\n## Responsive Behavior\n\nHero background and minimum height should be configurable separately for desktop and mobile.\n\n## Do's and Don'ts\n\nDo keep legal text visible. Do not hide responsible gaming badges or market-specific terms.",
				sourceName: "docs/design-md/ggpoker/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:00"
			}),
			M({
				id: "doc-002",
				brandId: "brand-apple",
				brandName: "Apple",
				slug: "apple",
				markdown: "---\nname: Apple-design-analysis\ndescription: Photography-first product presentation with minimal chrome, SF-style typography, and a single blue action color.\ncolors:\n  primary: \"#0066cc\"\n  canvas: \"#ffffff\"\n  ink: \"#1d1d1f\"\ntypography:\n  heading: \"SF Pro Display, system-ui, sans-serif\"\n  body: \"SF Pro Text, system-ui, sans-serif\"\n---\n\n## Overview\n\nA clean product-gallery design system with restrained UI and high emphasis on product imagery.\n\n## Colors\n\n- Action Blue: #0066cc\n- Ink: #1d1d1f\n- Canvas: #ffffff\n- Soft Surface: #f5f5f7\n\n## Typography\n\n- Heading: SF Pro Display, system-ui, sans-serif\n- Body: SF Pro Text, system-ui, sans-serif\n\n## Layout\n\nWide, calm sections with strong product focus and large vertical rhythm.\n\n## Components\n\nButtons are compact pills or text links, with minimal border and shadow use.",
				sourceName: "docs/design-md/apple/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:05"
			}),
			M({
				id: "doc-003",
				brandId: "brand-starbucks",
				brandName: "Starbucks",
				slug: "starbucks",
				markdown: "# Design System Inspired by Starbucks\n\n## 1. Visual Theme & Atmosphere\n\nWarm retail flagship surfaces anchored by Starbucks green and cream canvas tones.\n\n## 2. Color Palette & Roles\n\n- Starbucks Green: #006241\n- Green Accent: #00754A\n- House Green: #1E3932\n- Cream: #f2f0eb\n- Gold: #cba258\n\n## 3. Typography Rules\n\n- Primary: SoDoSans, Helvetica Neue, Arial, sans-serif\n- Rewards serif moments: Georgia, serif\n\n## 4. Component Stylings\n\nFull-pill buttons, 12px cards, restrained shadows, and compliance-aware footer blocks.\n\n## 8. Responsive Behavior\n\nMobile stacks content into vertical bands and keeps CTA targets large.",
				sourceName: "docs/design-md/starbucks/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:08"
			})
		];
	}
	function N(e) {
		let t = Array.isArray(e?.summary?.colors) ? e.summary.colors : [], n = Array.isArray(e?.summary?.fonts) ? e.summary.fonts : [], r = t[0] || "#d52b1e";
		return {
			primaryColor: r,
			ctaColor: t[1] || r,
			canvasColor: t[2] || "#f3f3f3",
			headingFont: n[0] || "Pretendard, Arial, sans-serif",
			bodyFont: n[1] || n[0] || "Pretendard, Arial, sans-serif",
			titleWeight: "800"
		};
	}
	function oe(e) {
		return {
			primaryColor: e.colorTokens.primary,
			ctaColor: e.colorTokens.cta,
			canvasColor: e.colorTokens.canvas,
			headingFont: e.typographyTokens.headingFont,
			bodyFont: e.typographyTokens.bodyFont,
			titleWeight: e.typographyTokens.heroTitleWeight
		};
	}
	var { createApp: se } = Vue, P = new URLSearchParams(window.location.search), F = P.get("view") === "admin" ? "prompts" : "builder", ce = P.get("tab"), I = [
		"webhook",
		"llm-models",
		"llm",
		"prompt-variables",
		"layout-references",
		"component-generation",
		"components",
		"section-presets",
		"promo-form",
		"design-tokens",
		"i18n",
		"integrations",
		"audit"
	].includes(ce) ? ce : "promo-form", le = se({
		data() {
			return {
				status: "준비 완료",
				builderCapabilities: {
					templateLayoutManagement: !0,
					adminDomConfigWorkbench: !0,
					adminLegacyVisualConfigEditor: !1,
					nuxtRuntime: !0,
					nuxtSsr: !0,
					directusConfigManagement: !0,
					directusIntegration: !1,
					directusConnectionTunnel: !1
				},
				localeRevision: 0,
				localeUnsubscribe: null,
				currentView: F,
				adminTab: I,
				sectionWidths: [
					30,
					30,
					40
				],
				resizeState: null,
				adminSectionWidths: [50, 50],
				adminResizeState: null,
				designDocuments: [],
				mdListSource: "불러오는 중",
				validationErrors: {},
				handoffDocuments: [],
				selectedHandoffFile: "",
				handoffMarkdown: "",
				handoffLoading: !1,
				handoffError: "",
				activeHandoffDocument: null,
				expandedStyleGroupSlug: "",
				selectedStyleGroupSlug: "",
				activeDesignTokenSectionKey: "color",
				styleGroupSearch: "",
				companyStylePresets: n,
				selectedDocumentId: localStorage.getItem(e.selectedDocumentId) || "",
				themeMode: localStorage.getItem(e.themeMode) || "light",
				selectedPresetId: "preset-001",
				styleSource: "design_md",
				templateSchema: r,
				sectionConfig: o(r),
				designMode: "ai",
				generationMode: "ai_agent",
				inputMode: "simple",
				globalVisualMode: "auto",
				promoBuilderStarted: !1,
				promoBuilderModalOpen: !1,
				promoBuilderSessionKey: 0,
				currentBuilderStep: 1,
				isGeneratingDesign: !1,
				generationStatusIndex: 0,
				generationStatusTimer: null,
				detailDoc: null,
				selectedDesignDetail: null,
				promptModalPage: null,
				promptModalLoading: !1,
				promptModalError: "",
				promptModalDesignMarkdown: "",
				promptModalIntegratedMarkdown: "",
				promptModalPromoMarkdown: "",
				adminAuthState: "checking",
				adminAuthAccessKey: "",
				adminAuthError: "",
				adminAuthBusy: !1,
				adminAuthSubject: "",
				promptTemplates: [],
				promptTemplatesLoading: !1,
				promptTemplatesError: "",
				llmRegistryModels: [],
				llmRegistryModelsLoading: !1,
				llmRegistryModelsError: "",
				promptDetailLoading: !1,
				promptDetailRequestRevision: 0,
				selectedPromptTemplateId: "",
				promptTypeFilter: "",
				expandedPromptLineageIds: [],
				expandedPromptWorkflowKeys: [
					"promotion-overview",
					"template-selection",
					"section-layout",
					"ai-page-composition",
					"promotion-image",
					"design-research",
					"design-generator",
					"shared-execution",
					"other"
				],
				promptArchivedVisibilityByLineage: {},
				promptSaving: !1,
				promptEditorBaseline: "",
				promptHistories: [],
				promptBodyTranslationKo: "",
				promptBodyTranslationSource: "",
				promptBodyTranslationLoading: !1,
				promptBodyTranslationError: "",
				promptBodyTranslationTimer: null,
				promptBodyLanguageError: "",
				promptBodyTranslationCache: {},
				locales: [],
				localesLoading: !1,
				localeMessages: [],
				localeMessagesByLocale: {},
				localeMessagesLoading: !1,
				localeManagerError: "",
				selectedLocaleCode: "ko",
				selectedLocaleNamespace: "",
				selectedLocaleMessageKey: "",
				selectedLocaleMessageIds: [],
				localeMessageEditor: {
					value: "",
					changeNote: ""
				},
				localeMessageHistory: [],
				newLocaleEditor: {
					code: "",
					label: ""
				},
				showNewLocaleForm: !1,
				localeManagerSaving: !1,
				workerWebhookSettings: [],
				workerWebhookSettingsLoading: !1,
				workerWebhookSettingsError: "",
				workerWebhookSavingStage: "",
				workerWebhookEditors: {},
				itemComponents: [],
				itemComponentsLoading: !1,
				itemComponentsError: "",
				selectedItemComponentId: "",
				itemComponentSaving: !1,
				itemComponentUsageLoading: !1,
				itemComponentUsage: {
					usageCount: 0,
					sections: [],
					generationReadiness: null
				},
				referencePublishLoading: !1,
				referencePublishOptions: {
					sections: [],
					references: []
				},
				referencePublishPlan: null,
				referencePublishForm: {
					sectionId: "",
					itemKey: "",
					layoutPresetIds: [],
					referenceIds: [],
					changeNote: ""
				},
				showNewItemComponentForm: !1,
				itemComponentEditor: {
					name: "",
					description: "",
					fieldKind: "text",
					textType: "title",
					imagePolicy: {
						allowedSources: ["file", "url"],
						promptText: "",
						aspectRatio: ""
					},
					capabilities: {
						layoutRegions: [
							"copy-primary",
							"copy-secondary",
							"center"
						],
						pageSchemaAsset: {
							kind: "",
							url: "",
							text: ""
						}
					},
					styleSlots: [],
					changeNote: "",
					libraryPresentation: {
						category: "text",
						iconKey: "heading",
						displayOrder: 100,
						isFeatured: !1
					},
					libraryKeywords: "",
					placementPolicy: {
						allowedSectionRoles: [],
						deniedSectionRoles: [],
						maxInstancesPerSection: null,
						requiresParentCapabilities: [],
						defaultGeometry: {
							desktop: {
								widthPct: 44,
								heightPx: 120
							},
							mobile: {
								widthPct: 90,
								heightPx: 120
							}
						}
					},
					renderSpec: null,
					fields: [{
						name: "Title",
						description: "",
						fieldKind: "text",
						textType: "title",
						sortOrder: 0,
						isRequired: !1,
						isLocked: !1,
						defaultValue: null,
						editorSchema: { multiline: !0 },
						capabilities: {},
						imagePolicy: {},
						ctaPolicy: {},
						styleSlots: []
					}]
				},
				designTokenSets: [],
				designTokenSetsLoading: !1,
				wizardFormTemplates: [],
				wizardFormTemplatesLoading: !1,
				wizardFormTemplatesError: "",
				wizardFormTemplateSaving: !1,
				selectedWizardFormTemplateKey: "",
				expandedWizardFormTemplateSettingsKey: "",
				wizardFormTemplateDetail: null,
				wizardFormTemplateEditor: {
					name: "",
					description: "",
					isDefault: !1,
					changeNote: "",
					recommendationProfileText: "{}"
				},
				showNewWizardFormTemplateForm: !1,
				newWizardFormTemplateForm: {
					name: "",
					description: ""
				},
				showDuplicateWizardFormTemplateForm: !1,
				duplicateWizardFormTemplateForm: {
					sourceId: "",
					name: "",
					description: ""
				},
				duplicateWizardFormTemplateError: "",
				selectedWizardFormTemplateSectionId: "",
				expandedWizardFormTemplateSectionId: "",
				wizardFormTemplateSectionEditor: {
					name: "",
					description: "",
					isRequired: !1,
					isVisible: !0,
					userReorderAllowed: !0,
					fixedPosition: "",
					aiDesign: {
						enabled: !0,
						allowedLayoutVariants: [
							"split-left",
							"split-right",
							"centered-hero"
						],
						allowSectionBackground: !0,
						imageTarget: "section-background",
						imageTargetItemKeys: [],
						imageAspectRatio: "16:9",
						backgroundPromptText: ""
					}
				},
				wizardFormTemplateSectionSaving: !1,
				showNewWizardFormTemplateSectionForm: !1,
				newWizardFormTemplateSectionForm: { sectionId: "" },
				wizardFormTemplateSectionItems: [],
				wizardFormTemplateSectionItemsLoading: !1,
				wizardFormTemplateItemEditorOpenId: "",
				wizardFormTemplateItemEditor: null,
				draggedWizardFormTemplateItemId: "",
				wizardFormTemplateItemDropTargetId: "",
				wizardFormTemplateItemDropPosition: "",
				draggedWizardFormTemplateSectionKey: "",
				wizardFormTemplateSectionDropTargetKey: "",
				wizardFormTemplateSectionDropPosition: "",
				wizardSections: [],
				wizardSectionAuditLogs: [],
				wizardSectionAuditLoading: !1,
				wizardSectionAuditError: "",
				wizardSectionAuditFilters: {
					templateKey: "",
					action: ""
				},
				wizardSectionsLoading: !1,
				wizardSectionsError: "",
				wizardSectionSaving: !1,
				wizardSectionOrderSaving: !1,
				wizardSectionComponentOrderSaving: !1,
				draggedWizardSectionKey: "",
				wizardSectionDropTargetKey: "",
				wizardSectionDropPosition: "",
				draggedWizardSectionComponentId: "",
				wizardSectionComponentDropTargetId: "",
				wizardSectionComponentDropPosition: "",
				selectedWizardSectionKey: "",
				wizardSectionDetail: null,
				wizardSectionDetailLoading: !1,
				wizardSectionDetailRequestRevision: 0,
				wizardSectionUsage: [],
				wizardSectionUsageLoading: !1,
				wizardSectionFieldsEditor: {
					name: "",
					description: "",
					isRequired: !1,
					orderChangeAllowed: !0,
					fixedPosition: "",
					isVisibleInWizard: !0,
					compositionScope: "template",
					sectionRole: "content",
					compositionPolicy: {
						selectionPolicy: "optional",
						allowedMarkets: [],
						allowedPromotionPurposes: [],
						aiEditable: !0,
						contentLocked: !1,
						layoutLocked: !1,
						duplicatePolicy: "forbidden",
						maxInstances: 1,
						allowedLayoutVariants: [],
						allowedMotionPresets: []
					},
					aiDesign: {
						enabled: !0,
						allowedLayoutVariants: [
							"split-left",
							"split-right",
							"centered-hero"
						],
						allowSectionBackground: !0,
						imageTarget: "section-background",
						imageTargetItemKeys: [],
						imageAspectRatio: "16:9",
						backgroundPromptText: ""
					},
					changeNote: ""
				},
				showNewWizardSectionForm: !1,
				newWizardSectionForm: {
					sectionKey: "",
					name: "",
					description: "",
					compositionScope: "shared"
				},
				wizardItemEditorOpenId: "",
				wizardItemEditor: {
					id: "",
					componentVersionId: "",
					itemKey: "",
					name: "",
					isVisibleInWizard: !0,
					isRequired: !1,
					sortOrder: 0,
					fieldKind: "text",
					textType: "title",
					image: {
						allowedSources: [],
						promptText: "",
						descriptionEnabled: !1,
						altTextRequired: !1,
						aspectRatio: "",
						maxSizeKb: ""
					},
					ctaUtm: {
						source: "",
						medium: "",
						campaign: "",
						content: "",
						term: ""
					},
					isLocked: !1,
					lockedValueText: ""
				},
				promptEditor: {
					name: "",
					body: "",
					requiredVariablesText: "",
					optionalVariablesText: "",
					provider: "",
					modelChoice: "",
					model: "",
					temperature: "",
					maxTokens: "",
					responseFormat: "",
					imageSize: "2K",
					executionSnapshotVersion: 2,
					timeoutMs: "",
					maxAttempts: "",
					retryBaseMs: "",
					retryMaxMs: "",
					outputMimeType: "",
					generationPolicyText: "{}",
					renderPolicyText: "{}",
					validationPolicyText: "{}",
					harnessConfigText: "{}",
					promptLayersText: "{}",
					modelCapabilitySnapshotText: "{}",
					safetyContractText: "{}",
					modelOptionsText: "{}",
					changeNote: ""
				},
				modalTab: "outline",
				newMd: {
					id: "",
					designStyleName: "",
					brandName: "",
					slug: "",
					text: "",
					sourceName: "",
					tokenText: "",
					tokenFileName: ""
				},
				promo: {
					title: "",
					template: "AI Auto",
					promotionPurpose: "",
					promotionPurposeOther: "",
					market: "",
					leadText: "",
					ctaLabel: "",
					ctaUrl: "",
					subline: "",
					alphaText: "",
					termsText: ""
				},
				simpleBrief: {
					mainOffer: "",
					targetAction: "",
					audience: "",
					campaignTone: "",
					secondaryMessage: ""
				},
				sectionInputs: u(),
				sectionInputsDirty: !1,
				override: {
					primaryColor: "#d52b1e",
					ctaColor: "#e12d25",
					canvasColor: "#f3f3f3",
					headingFont: "Pretendard, Arial, sans-serif",
					bodyFont: "Pretendard, Arial, sans-serif",
					titleWeight: "800"
				},
				generatedPages: [],
				generatedPagesLoading: !1,
				generatedPagesError: "",
				generatedPagesLoaded: !1,
				generationRunPollingTimer: null
			};
		},
		computed: {
			templateLayoutManagementEnabled() {
				return this.builderCapabilities.templateLayoutManagement !== !1;
			},
			abcGridStyle() {
				return { gridTemplateColumns: `${this.sectionWidths[0]}fr 8px ${this.sectionWidths[1]}fr 8px ${this.sectionWidths[2]}fr` };
			},
			adminGridStyle() {
				return { gridTemplateColumns: `${this.adminSectionWidths[0]}fr 8px ${this.adminSectionWidths[1]}fr` };
			},
			selectedDocument() {
				return this.designDocuments.find((e) => e.id === this.selectedDocumentId) || null;
			},
			selectedDocumentGroupLabel() {
				return this.styleGroupName(this.groupInfoForDocument(this.selectedDocument));
			},
			selectedDocumentTags() {
				return this.tagsForDocument(this.selectedDocument).slice(0, 6);
			},
			selectedDesignDataSource() {
				return this.selectedDesignDetail?.id === this.selectedDocumentId ? this.selectedDesignDetail : this.selectedDocument;
			},
			selectedDesignTokenSections() {
				let e = this.selectedDesignDataSource;
				return [
					{
						key: "color",
						label: "Colors",
						rows: this.normalizedTokenRows(e, "color"),
						open: this.activeDesignTokenSectionKey === "color"
					},
					{
						key: "typography",
						label: "Typography",
						rows: this.normalizedTokenRows(e, "typography"),
						open: this.activeDesignTokenSectionKey === "typography"
					},
					{
						key: "radius",
						label: "Radius",
						rows: this.normalizedTokenRows(e, "radius"),
						open: this.activeDesignTokenSectionKey === "radius"
					},
					{
						key: "spacing",
						label: "Spacing",
						rows: this.normalizedTokenRows(e, "spacing"),
						open: this.activeDesignTokenSectionKey === "spacing"
					},
					{
						key: "elevation",
						label: "Elevation",
						rows: this.normalizedTokenRows(e, "elevation"),
						open: this.activeDesignTokenSectionKey === "elevation"
					},
					{
						key: "breakpoint",
						label: "Breakpoints",
						rows: this.normalizedTokenRows(e, "breakpoint"),
						open: this.activeDesignTokenSectionKey === "breakpoint"
					},
					{
						key: "component",
						label: "Components",
						rows: this.patternRows(e, "component"),
						open: this.activeDesignTokenSectionKey === "component"
					},
					{
						key: "layout",
						label: "Layouts",
						rows: this.patternRows(e, "layout"),
						open: this.activeDesignTokenSectionKey === "layout"
					},
					{
						key: "guideline",
						label: "Guidelines",
						rows: this.guidelineRows(e),
						open: this.activeDesignTokenSectionKey === "guideline"
					}
				];
			},
			filteredDesignDocuments() {
				let e = this.styleGroupSearch.trim().toLowerCase();
				return e ? this.designDocuments.filter((t) => {
					let n = this.groupInfoForDocument(t), r = this.tagsForDocument(t);
					return [
						t.brandName,
						t.slug,
						n.name,
						n.description,
						...r,
						t.styleClassification?.layoutModel,
						t.styleClassification?.colorMode,
						t.styleClassification?.typographyTone
					].filter(Boolean).join(" ").toLowerCase().includes(e);
				}) : this.designDocuments;
			},
			groupedDocuments() {
				let e = this.styleGroupSearch.trim().toLowerCase(), t = /* @__PURE__ */ new Map();
				for (let n of this.designDocuments) {
					let r = this.groupInfoForDocument(n), i = this.tagsForDocument(n), a = [
						n.brandName,
						n.slug,
						r.name,
						r.description,
						...i,
						n.styleClassification?.layoutModel,
						n.styleClassification?.colorMode,
						n.styleClassification?.typographyTone
					].filter(Boolean).join(" ").toLowerCase();
					if (e && !a.includes(e)) continue;
					t.has(r.slug) || t.set(r.slug, {
						...r,
						documents: [],
						tags: /* @__PURE__ */ new Set(),
						confidenceTotal: 0,
						confidenceCount: 0
					});
					let o = t.get(r.slug);
					o.documents.push(n), i.forEach((e) => o.tags.add(e));
					let s = Number(n.styleClassification?.confidence);
					Number.isFinite(s) && (o.confidenceTotal += s, o.confidenceCount += 1);
				}
				return Array.from(t.values()).map((e) => ({
					...e,
					tags: Array.from(e.tags).slice(0, 6),
					confidence: e.confidenceCount ? e.confidenceTotal / e.confidenceCount : null
				})).sort((e, t) => e.slug === "unclassified" ? 1 : t.slug === "unclassified" ? -1 : e.name.localeCompare(t.name));
			},
			selectedStyleGroup() {
				return this.groupedDocuments.find((e) => e.slug === this.selectedStyleGroupSlug) || this.groupedDocuments[0] || null;
			},
			selectedStyleGroupDocuments() {
				return this.selectedStyleGroup?.documents || [];
			},
			selectedPreset() {
				return this.companyStylePresets.find((e) => e.id === this.selectedPresetId) || this.companyStylePresets[0];
			},
			sourceStyle() {
				return this.styleSource === "design_md" && this.selectedDocument ? N(this.selectedDocument) : oe(this.selectedPreset);
			},
			finalStyle() {
				return {
					...this.sourceStyle,
					...this.override
				};
			},
			lastGenerated() {
				return this.generatedPages[0] || null;
			},
			designModeLabel() {
				return this.designMode === "advanced" ? "고급 모드 / Default Temp" : "AI 모드 / 디자인 토큰 기반 자동 구성";
			},
			builderSteps() {
				return [
					{
						step: 1,
						title: "디자인 모드 선택",
						summary: "AI 모드, 고급 모드, 마켓"
					},
					{
						step: 2,
						title: "프로모션 입력 및 섹션 구성",
						summary: "개요, 섹션/아이템"
					},
					{
						step: 3,
						title: "디자인 생성",
						summary: "n8n 실행"
					}
				];
			},
			currentBuilderStepInfo() {
				return this.builderSteps.find((e) => e.step === this.currentBuilderStep) || this.builderSteps[0];
			},
			generationStatusMessage() {
				let e = [
					"AI가 요청 사항을 접수하고 있어요",
					"디자인 브리프를 정리하고 있어요",
					"프로모션 섹션을 조합하고 있어요",
					"UI 디자인 이미지를 생성하고 있어요",
					"결과를 저장하고 있어요"
				];
				return e[this.generationStatusIndex % e.length];
			},
			sectionConfigSections() {
				let e = i(this.templateSchema), t = new Map(e.map((e) => [e.sectionId || e.key, e]));
				return (Array.isArray(this.sectionConfig.orderedSections) && this.sectionConfig.orderedSections.length ? this.sectionConfig.orderedSections : e.map((e) => e.sectionId || e.key)).map((e) => t.get(e)).filter(Boolean).map((e) => {
					let t = e.sectionId || e.key;
					return {
						...e,
						sectionId: t,
						visible: this.sectionConfig.sectionVisibility?.[t] !== !1,
						items: (e.items || []).map((e) => {
							let n = e.itemId || e.key;
							return {
								...e,
								itemId: n,
								visible: this.sectionConfig.itemVisibility?.[t]?.[n] !== !1,
								imageGenerationMode: this.sectionConfig.imageGenerationMode?.[t]?.[n] || s(e)
							};
						})
					};
				});
			},
			filteredPromptTemplates() {
				return this.promptTypeFilter ? this.promptTemplates.filter((e) => e.type === this.promptTypeFilter) : this.promptTemplates;
			},
			promptTemplateGroups() {
				return window.PromoAdminPromptGroups.groupPromptTemplates(this.promptTemplates);
			},
			filteredPromptTemplateGroups() {
				return window.PromoAdminPromptGroups.filterPromptGroups(this.promptTemplateGroups, this.promptTypeFilter);
			},
			filteredPromptTemplateSections() {
				return window.PromoAdminPromptGroups.groupPromptTemplateSections(this.filteredPromptTemplateGroups);
			},
			promptModelChoices() {
				let e = window.PromoAdminModelCatalog?.promptModality(this.selectedPromptTemplate?.type) || "text";
				return this.llmRegistryModels.filter((t) => t.status === "active" && t.provider === this.promptEditor.provider && t.modality === e).map((e) => ({
					...e,
					model: e.modelId,
					purposeLabel: e.modality === "image" ? "이미지 생성·편집" : "텍스트·JSON",
					label: `${e.displayName}${e.isRecommended ? " · 권장" : ""}${e.isLegacy ? " · 레거시" : ""}`
				}));
			},
			selectedPromptModelPreset() {
				return this.llmRegistryModels.find((e) => e.status === "active" && e.provider === this.promptEditor.provider && e.modelId === this.promptEditor.modelChoice) || null;
			},
			promptImageSizeChoices() {
				return this.selectedPromptModelPreset?.supportedImageSizes || [
					"1K",
					"2K",
					"4K"
				];
			},
			localeNamespaces() {
				let e = Object.values(this.localeMessagesByLocale).flat();
				return [...new Set(e.map((e) => e.namespace).filter(Boolean))].sort();
			},
			localeMessageRows() {
				let e = this.localeMessagesByLocale, t = (e = []) => {
					let t = /* @__PURE__ */ new Map();
					return e.forEach((e) => {
						t.has(e.messageKey) || t.set(e.messageKey, []), t.get(e.messageKey).push(e);
					}), t;
				}, n = t(e[this.selectedLocaleCode] || this.localeMessages), r = t(e.ko), i = t(e.en), a = /* @__PURE__ */ new Set([
					...n.keys(),
					...r.keys(),
					...i.keys()
				]), o = (e = []) => {
					let t = [...e].sort((e, t) => t.version - e.version), n = t.find((e) => e.status === "draft") || null, r = t.find((e) => e.status === "active") || null;
					return {
						draft: n,
						active: r,
						current: n || r || t[0] || null
					};
				};
				return [...a].map((e) => {
					let t = o(n.get(e)), a = o(r.get(e)), s = o(i.get(e));
					return {
						messageKey: e,
						namespace: t.current?.namespace || a.current?.namespace || s.current?.namespace || "",
						...t,
						koValue: a.current?.value || "",
						enValue: s.current?.value || ""
					};
				}).sort((e, t) => e.messageKey.localeCompare(t.messageKey));
			},
			selectedLocaleMessageRow() {
				return this.localeMessageRows.find((e) => e.messageKey === this.selectedLocaleMessageKey) || null;
			},
			selectedLocaleDraftIds() {
				let e = new Set(this.selectedLocaleMessageIds);
				return this.localeMessageRows.filter((t) => e.has(t.messageKey) && t.draft).map((e) => e.draft.id);
			},
			localeTranslationProgress() {
				let e = this.localeMessageRows.length, t = this.localeMessageRows.filter((e) => String(e.active?.value || "").trim()).length;
				return {
					total: e,
					translated: t,
					percent: e ? Math.round(t / e * 100) : 0
				};
			},
			selectedPromptTemplate() {
				return this.promptTemplates.find((e) => e.id === this.selectedPromptTemplateId) || null;
			},
			selectedPromptTemplateGroup() {
				return window.PromoAdminPromptGroups.findPromptGroup(this.promptTemplateGroups, this.selectedPromptTemplateId);
			},
			promptEditorReadOnly() {
				return this.promptDetailLoading;
			},
			selectedPromptEditorTitle() {
				return this.selectedPromptTemplate ? this.promptTypeLabel(this.selectedPromptTemplate.type) : "프롬프트 편집기";
			},
			groupedWizardFormTemplates() {
				let e = /* @__PURE__ */ new Map();
				return this.wizardFormTemplates.forEach((t) => {
					e.has(t.templateKey) || e.set(t.templateKey, {
						templateKey: t.templateKey,
						versions: []
					}), e.get(t.templateKey).versions.push(t);
				}), Array.from(e.values()).map((e) => {
					let t = [...e.versions].sort((e, t) => t.version - e.version), n = t.find((e) => e.status === "draft") || null, r = t.find((e) => e.status === "active") || null, i = t.find((e) => e.status === "inactive") || null, a = n || r || i || t[0];
					return {
						...e,
						versions: t,
						primary: a,
						draft: n,
						active: r,
						inactive: i
					};
				}).sort((e, t) => Number(!!(t.active?.isDefault || t.primary?.isDefault)) - Number(!!(e.active?.isDefault || e.primary?.isDefault)) || String(e.primary?.name || "").localeCompare(String(t.primary?.name || "")));
			},
			selectedWizardFormTemplateGroup() {
				return this.groupedWizardFormTemplates.find((e) => e.templateKey === this.selectedWizardFormTemplateKey) || null;
			},
			selectedWizardFormTemplateHasDraft() {
				return !!this.selectedWizardFormTemplateGroup?.versions.some((e) => e.status === "draft");
			},
			wizardFormTemplateCanEdit() {
				return this.wizardFormTemplateDetail?.template?.status === "draft";
			},
			selectedWizardFormTemplateSection() {
				return this.wizardFormTemplateDetail?.sections?.find((e) => e.id === this.selectedWizardFormTemplateSectionId) || null;
			},
			selectedWizardFormTemplateSectionSource() {
				let e = this.selectedWizardFormTemplateSection?.sectionKey;
				return e && this.groupedWizardSections.find((t) => t.sectionKey === e)?.versions.find((e) => e.status === "active") || null;
			},
			availableWizardSectionsForTemplate() {
				let e = new Set((this.wizardFormTemplateDetail?.sections || []).map((e) => e.sectionKey));
				return this.groupedWizardSections.filter((e) => e.versions.some((e) => e.status === "active")).filter((t) => !e.has(t.sectionKey));
			},
			wizardSectionsForCurrentTemplate() {
				let e = new Map(this.groupedWizardSections.map((e) => [e.sectionKey, e]));
				return (this.wizardFormTemplateDetail?.sections || []).flatMap((t) => {
					let n = e.get(t.sectionKey);
					if (!n) return [];
					let r = n.versions.find((e) => e.id === t.sectionId) || {
						id: t.sectionId,
						sectionKey: t.sectionKey,
						name: t.sectionName,
						description: t.sectionDescription,
						version: t.sectionVersion,
						status: t.sectionStatus,
						sortOrder: t.sortOrder,
						fixedPosition: t.fixedPosition,
						orderChangeAllowed: t.orderChangeAllowed
					};
					return [{
						...n,
						logicalPrimary: n.primary,
						primary: r,
						templateMembership: t
					}];
				});
			},
			activeItemComponents() {
				return this.itemComponents.flatMap((e) => {
					if (e.status !== "active") return [];
					let t = e.activeVersion || (e.versionStatus === "active" ? {
						id: e.versionId,
						version: e.version,
						status: e.versionStatus,
						fieldKind: e.fieldKind,
						textType: e.textType
					} : null);
					return !t?.id || t.status !== "active" ? [] : [{
						...e,
						versionId: t.id,
						version: t.version,
						versionStatus: t.status,
						fieldKind: t.fieldKind,
						textType: t.textType,
						renderSpec: t.renderSpec || null,
						renderValidation: t.renderValidation || null,
						renderContractVersion: t.renderSpec?.contractVersion || null,
						renderSpecHash: t.renderValidation?.hash ? `sha256:${t.renderValidation.hash}` : null,
						fields: t.fields || []
					}];
				});
			},
			selectedItemComponent() {
				return this.itemComponents.find((e) => e.id === this.selectedItemComponentId) || null;
			},
			groupedWizardSections() {
				let e = /* @__PURE__ */ new Map();
				return this.wizardSections.forEach((t) => {
					e.has(t.sectionKey) || e.set(t.sectionKey, {
						sectionKey: t.sectionKey,
						versions: []
					}), e.get(t.sectionKey).versions.push(t);
				}), Array.from(e.values()).map((e) => {
					let t = [...e.versions].sort((e, t) => t.version - e.version), n = t.find((e) => e.status === "draft") || t.find((e) => e.status === "active") || t[0];
					return {
						...e,
						versions: t,
						primary: n
					};
				}).sort((e, t) => (e.primary?.sortOrder ?? 0) - (t.primary?.sortOrder ?? 0));
			},
			selectedWizardGroup() {
				return this.groupedWizardSections.find((e) => e.sectionKey === this.selectedWizardSectionKey) || null;
			},
			selectedWizardSectionHasDraft() {
				return !!this.selectedWizardGroup?.versions.some((e) => e.status === "draft");
			}
		},
		watch: {
			styleSource() {
				this.resetOverride();
			},
			selectedPresetId() {
				this.styleSource === "company_default" && this.resetOverride();
			},
			selectedDocumentId() {
				this.activeDesignTokenSectionKey = "color", this.styleSource === "design_md" && this.resetOverride();
			},
			designMode() {
				this.generationMode = this.designMode === "advanced" ? "template_advanced" : "ai_agent", this.inputMode = this.designMode === "advanced" ? "advanced" : "simple", this.promo.template = this.designMode === "advanced" ? "default_temp" : "AI Auto";
			},
			promo: {
				deep: !0,
				handler() {
					this.clearResolvedValidationErrors();
				}
			},
			simpleBrief: {
				deep: !0,
				handler() {
					this.clearResolvedValidationErrors();
				}
			},
			promptTypeFilter() {
				this.ensureFilteredPromptSelection();
			}
		},
		mounted() {
			if (this.localeUnsubscribe = window.PromoI18n?.subscribe(() => {
				this.localeRevision += 1;
			}) || null, localStorage.removeItem(e.generatedPages), localStorage.removeItem(e.generatedPage), this.applyThemeMode(), this.loadDesignDocuments(), this.loadGeneratedPagesFromServer({ silent: !0 }), this.loadHandoffDocuments(), this.resetOverride(), this.currentView === "prompts") {
				let e = this.takeAdminRemoteLoginToken();
				e ? this.signInAdminWithRemoteToken(e) : this.openPromptManager();
			}
		},
		unmounted() {
			this.localeUnsubscribe && this.localeUnsubscribe(), this.stopGenerationRunPolling();
		},
		methods: {
			t(e, t = {}) {
				return this.localeRevision, window.PromoI18n?.t(e, t) || e;
			},
			async loadAdminCapabilities() {
				try {
					let e = await fetch("/api/promo-builder-capabilities", { cache: "no-store" }), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.error || `기능 설정 요청 오류(${e.status})`);
					if (this.builderCapabilities = {
						...this.builderCapabilities,
						...t.capabilities || {}
					}, !this.templateLayoutManagementEnabled && this.adminTab === "promo-form") {
						this.adminTab = "components";
						let e = new URL(window.location.href);
						return e.searchParams.set("view", "admin"), e.searchParams.set("tab", "components"), window.history.replaceState({}, "", `${e.pathname}${e.search}${e.hash}`), this.setStatus("템플릿·페이지 레이아웃 관리는 비활성화되었습니다. 컴포넌트와 섹션 프리셋을 이용해 주세요."), !0;
					}
					return !1;
				} catch (e) {
					return this.setStatus(`기능 설정을 확인하지 못했습니다: ${e.message}`), !0;
				}
			},
			async localeApi(e, t = {}) {
				let n = await fetch(e, {
					...t,
					headers: {
						"Content-Type": "application/json",
						...t.headers || {}
					}
				}), r = await n.json().catch(() => ({}));
				if (!n.ok) throw Error(r.message || r.error || `언어 관리 요청 오류(${n.status})`);
				return r;
			},
			async loadLocales() {
				if (!this.localesLoading) {
					this.localesLoading = !0, this.localeManagerError = "";
					try {
						let e = await this.localeApi("/api/locales?includeDisabled=true");
						this.locales = e.locales || [], this.locales.some((e) => e.code === this.selectedLocaleCode) || (this.selectedLocaleCode = this.locales.find((e) => e.isDefault)?.code || this.locales[0]?.code || "ko"), await this.loadLocaleMessages();
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localesLoading = !1;
					}
				}
			},
			async loadLocaleMessages() {
				if (!(!this.selectedLocaleCode || this.localeMessagesLoading)) {
					this.localeMessagesLoading = !0, this.localeManagerError = "";
					try {
						let e = [.../* @__PURE__ */ new Set([
							this.selectedLocaleCode,
							"ko",
							"en"
						])], t = await Promise.all(e.map(async (e) => {
							let t = new URLSearchParams({ locale: e });
							return this.selectedLocaleNamespace && t.set("namespace", this.selectedLocaleNamespace), [e, (await this.localeApi(`/api/locale-messages?${t}`)).messages || []];
						}));
						this.localeMessagesByLocale = {
							...this.localeMessagesByLocale,
							...Object.fromEntries(t)
						}, this.localeMessages = this.localeMessagesByLocale[this.selectedLocaleCode] || [], this.selectedLocaleMessageIds = this.selectedLocaleMessageIds.filter((e) => this.localeMessageRows.some((t) => t.messageKey === e)), this.selectedLocaleMessageKey && !this.localeMessageRows.some((e) => e.messageKey === this.selectedLocaleMessageKey) && (this.selectedLocaleMessageKey = "", this.localeMessageHistory = []);
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeMessagesLoading = !1;
					}
				}
			},
			async changeManagedLocale() {
				this.selectedLocaleMessageIds = [], this.selectedLocaleMessageKey = "", this.localeMessageEditor = {
					value: "",
					changeNote: ""
				}, this.localeMessageHistory = [], await this.loadLocaleMessages();
			},
			async selectLocaleMessage(e) {
				this.selectedLocaleMessageKey = e.messageKey, this.localeMessageEditor = {
					value: e.current?.value || "",
					changeNote: ""
				}, await this.loadLocaleMessageHistory();
			},
			async loadLocaleMessageHistory() {
				if (this.selectedLocaleMessageKey) try {
					let e = new URLSearchParams({
						locale: this.selectedLocaleCode,
						messageKey: this.selectedLocaleMessageKey
					}), t = await this.localeApi(`/api/locale-message-history?${e}`);
					this.localeMessageHistory = t.versions || [];
				} catch (e) {
					this.localeManagerError = e.message;
				}
			},
			async saveLocaleMessageDraft() {
				if (!(!this.selectedLocaleMessageKey || this.localeManagerSaving)) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-message", {
							method: "POST",
							body: JSON.stringify({
								locale: this.selectedLocaleCode,
								messageKey: this.selectedLocaleMessageKey,
								value: this.localeMessageEditor.value,
								changeNote: this.localeMessageEditor.changeNote,
								actor: "admin"
							})
						}), await this.loadLocaleMessages();
						let e = this.localeMessageRows.find((e) => e.messageKey === this.selectedLocaleMessageKey);
						e && await this.selectLocaleMessage(e), this.setStatus(this.t("admin.i18n.savedDraft"));
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async activateLocaleMessage(e) {
				if (!(!e || this.localeManagerSaving)) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-message-activate", {
							method: "POST",
							body: JSON.stringify({
								id: e,
								actor: "admin",
								changeNote: this.localeMessageEditor.changeNote
							})
						});
						let t = window.PromoI18n?.reloadSnapshot?.() || Promise.resolve();
						await Promise.all([this.loadLocaleMessages(), t.catch(() => {})]), this.setStatus(this.t("admin.i18n.activated"));
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async activateSelectedLocaleMessages() {
				let e = this.selectedLocaleDraftIds;
				if (!(!e.length || this.localeManagerSaving)) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-messages-activate", {
							method: "POST",
							body: JSON.stringify({
								ids: e,
								actor: "admin",
								changeNote: "선택 문구 일괄 활성화"
							})
						}), this.selectedLocaleMessageIds = [];
						let t = window.PromoI18n?.reloadSnapshot?.() || Promise.resolve();
						await Promise.all([this.loadLocaleMessages(), t.catch(() => {})]), this.setStatus(this.t("admin.i18n.activatedCount", { count: e.length }));
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async archiveLocaleMessage(e) {
				if (!(!e || this.localeManagerSaving)) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-message-archive", {
							method: "POST",
							body: JSON.stringify({
								id: e,
								actor: "admin",
								changeNote: this.localeMessageEditor.changeNote
							})
						}), await this.loadLocaleMessages(), this.setStatus(this.t("admin.i18n.archived"));
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async rollbackLocaleMessage(e) {
				if (!(!e || this.localeManagerSaving)) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-message-rollback", {
							method: "POST",
							body: JSON.stringify({
								id: e,
								actor: "admin",
								changeNote: "과거 버전으로 새 초안 생성"
							})
						}), await this.loadLocaleMessages(), this.setStatus(this.t("admin.i18n.rollbackCreated"));
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async createManagedLocale() {
				if (!this.localeManagerSaving) {
					this.localeManagerSaving = !0;
					try {
						let e = await this.localeApi("/api/locales", {
							method: "POST",
							body: JSON.stringify(this.newLocaleEditor)
						});
						this.newLocaleEditor = {
							code: "",
							label: ""
						}, this.showNewLocaleForm = !1, this.selectedLocaleCode = e.locale.code, await this.loadLocales();
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async updateManagedLocale(e, t) {
				if (!this.localeManagerSaving) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locales", {
							method: "PATCH",
							body: JSON.stringify({
								code: e.code,
								...t
							})
						}), await this.loadLocales();
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async setManagedDefaultLocale(e) {
				if (!this.localeManagerSaving) {
					this.localeManagerSaving = !0;
					try {
						await this.localeApi("/api/locale-default", {
							method: "POST",
							body: JSON.stringify({ code: e })
						}), await this.loadLocales(), await (window.PromoI18n?.reloadSnapshot?.() || Promise.resolve()).catch(() => {});
					} catch (e) {
						this.localeManagerError = e.message;
					} finally {
						this.localeManagerSaving = !1;
					}
				}
			},
			async applyManagedLocale() {
				await window.PromoI18n?.setLocale?.(this.selectedLocaleCode), this.setStatus(`${this.selectedLocaleCode} 언어를 현재 화면에 적용했습니다`);
			},
			localeStatusLabel(e) {
				let t = {
					active: "common.state.active",
					inactive: "common.state.inactive",
					draft: "common.state.draft",
					archived: "common.state.archived"
				}[e];
				return t ? this.t(t) : e;
			},
			formatLocaleDate(e) {
				return e ? new Intl.DateTimeFormat(this.selectedLocaleCode || "ko", {
					dateStyle: "medium",
					timeStyle: "short"
				}).format(new Date(e)) : "-";
			},
			applyThemeMode() {
				document.documentElement.setAttribute("data-theme", this.themeMode === "dark" ? "dark" : "light"), localStorage.setItem(e.themeMode, this.themeMode);
			},
			toggleThemeMode() {
				this.themeMode = this.themeMode === "dark" ? "light" : "dark", this.applyThemeMode(), this.setStatus(this.themeMode === "dark" ? "다크모드를 적용했습니다" : "라이트모드를 적용했습니다");
			},
			showBuilderPage() {
				this.currentView = "builder";
				let e = new URL(window.location.href);
				e.searchParams.delete("view"), window.history.replaceState({}, "", `${e.pathname}${e.search}${e.hash}`), this.setStatus("프로모션 빌더로 이동했습니다");
			},
			async openPromptManager() {
				this.currentView = "prompts";
				let e = new URL(window.location.href);
				if (e.searchParams.set("view", "admin"), window.history.replaceState({}, "", `${e.pathname}${e.search}${e.hash}`), !await this.checkAdminSession()) {
					this.setStatus(this.adminAuthState === "error" ? this.adminAuthError : "관리자 로그인이 필요합니다.");
					return;
				}
				await this.loadPromptManagerData();
			},
			takeAdminRemoteLoginToken() {
				let e = new URLSearchParams(window.location.hash.replace(/^#/, "")), t = String(e.get("adminLogin") || "").trim();
				if (!t) return "";
				e.delete("adminLogin");
				let n = e.toString();
				return window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}${n ? `#${n}` : ""}`), t;
			},
			async signInAdminWithRemoteToken(e) {
				this.adminAuthState = "checking", this.adminAuthBusy = !0, this.adminAuthError = "";
				try {
					let t = await fetch("/api/promo-admin-session", {
						method: "POST",
						credentials: "same-origin",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ loginToken: e })
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.error || `관리자 로그인 오류(${t.status})`);
					this.adminAuthState = "authenticated", this.adminAuthSubject = n.subject || "promo-admin", this.setStatus("원격 관리자 로그인이 완료되었습니다."), await this.loadPromptManagerData();
				} catch {
					this.adminAuthState = "required", this.adminAuthError = "원격 로그인 링크가 만료되었거나 유효하지 않습니다. 새 링크를 발급해 주세요.", this.setStatus(`관리자 로그인 실패: ${this.adminAuthError}`);
				} finally {
					this.adminAuthBusy = !1;
				}
			},
			async checkAdminSession() {
				this.adminAuthState = "checking", this.adminAuthError = "";
				try {
					let e = await fetch("/api/promo-admin-session", {
						credentials: "same-origin",
						cache: "no-store"
					}), t = await e.json().catch(() => ({}));
					if (e.ok && t.authenticated) return this.adminAuthState = "authenticated", this.adminAuthSubject = t.subject || "promo-admin", !0;
					let n = ["localhost", "127.0.0.1"].includes(window.location.hostname), r = e.status === 404 || e.ok && t.authenticated === void 0;
					return n && r ? (this.adminAuthState = "authenticated", this.adminAuthSubject = "local-admin", !0) : (this.adminAuthState = t.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "error" : "required", this.adminAuthError = t.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "관리자 인증 환경변수가 설정되지 않았습니다." : "관리자 로그인이 필요합니다.", !1);
				} catch (e) {
					return this.adminAuthState = "error", this.adminAuthError = `관리자 인증 상태를 확인하지 못했습니다: ${e.message}`, !1;
				}
			},
			async signInAdmin() {
				if (!(this.adminAuthBusy || !this.adminAuthAccessKey.trim())) {
					this.adminAuthBusy = !0, this.adminAuthError = "";
					try {
						let e = await fetch("/api/promo-admin-session", {
							method: "POST",
							credentials: "same-origin",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ accessKey: this.adminAuthAccessKey })
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Object.assign(Error(t.error || `관리자 로그인 오류(${e.status})`), { code: t.code || "ADMIN_LOGIN_FAILED" });
						this.adminAuthAccessKey = "", this.adminAuthState = "authenticated", this.adminAuthSubject = t.subject || "promo-admin", this.setStatus("관리자 로그인이 완료되었습니다."), await this.loadPromptManagerData();
					} catch (e) {
						this.adminAuthState = e.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "error" : "required", this.adminAuthError = e.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "관리자 인증 환경변수가 설정되지 않았습니다." : "관리자 액세스 키를 확인해 주세요.", this.setStatus(`관리자 로그인 실패: ${this.adminAuthError}`);
					} finally {
						this.adminAuthBusy = !1;
					}
				}
			},
			async signOutAdmin() {
				if (!this.adminAuthBusy) {
					this.adminAuthBusy = !0;
					try {
						await fetch("/api/promo-admin-session", {
							method: "DELETE",
							credentials: "same-origin",
							headers: { "Content-Type": "application/json" }
						});
					} finally {
						this.adminAuthState = "required", this.adminAuthSubject = "", this.adminAuthAccessKey = "", this.promptTemplates = [], this.selectedPromptTemplateId = "", this.adminAuthBusy = !1, this.setStatus("관리자 로그아웃이 완료되었습니다.");
					}
				}
			},
			async loadPromptManagerData() {
				let e = await this.loadAdminCapabilities();
				await this.loadLlmRegistryModels(), await Promise.all([
					this.loadPromptTemplates(),
					this.loadWorkerWebhookSettings(),
					this.loadWizardFormTemplates(),
					this.loadWizardSections(),
					this.loadWizardSectionAuditLogs(),
					this.loadItemComponents(),
					this.loadDesignTokenSets()
				]), this.adminTab === "i18n" && await this.loadLocales(), e || this.setStatus("관리자 페이지로 이동했습니다");
			},
			selectAdminTab(e) {
				if (![
					"webhook",
					"llm-models",
					"llm",
					"prompt-variables",
					"layout-references",
					"component-generation",
					"components",
					"section-presets",
					"promo-form",
					"design-tokens",
					"i18n",
					"integrations",
					"audit"
				].includes(e)) return;
				if (e === "promo-form" && !this.templateLayoutManagementEnabled) {
					this.setStatus("템플릿·페이지 레이아웃 관리는 비활성화되었습니다.");
					return;
				}
				this.adminTab = e, e === "i18n" && this.loadLocales(), (e === "llm" || e === "llm-models") && this.loadLlmRegistryModels({ fresh: !0 }), e === "components" && this.loadItemComponents(), e === "section-presets" && (this.loadWizardSections({ fresh: !0 }), this.loadItemComponents()), e === "audit" && this.loadWizardSectionAuditLogs();
				let t = new URL(window.location.href);
				t.searchParams.set("view", "admin"), t.searchParams.set("tab", e), window.history.replaceState({}, "", `${t.pathname}${t.search}${t.hash}`);
			},
			resetItemComponentEditor() {
				this.itemComponentEditor = {
					name: "",
					description: "",
					fieldKind: "text",
					textType: "title",
					editorSchema: { multiline: !0 },
					defaultValue: null,
					imagePolicy: {
						allowedSources: ["file", "url"],
						promptText: "",
						aspectRatio: ""
					},
					capabilities: {
						layoutRegions: [
							"copy-primary",
							"copy-secondary",
							"center"
						],
						pageSchemaAsset: {
							kind: "",
							url: "",
							text: ""
						}
					},
					libraryPresentation: {
						category: "",
						iconKey: "",
						displayOrder: 100,
						isFeatured: !1
					},
					libraryKeywords: "",
					placementPolicy: {
						allowedSectionRoles: [],
						deniedSectionRoles: [],
						maxInstancesPerSection: null,
						requiresParentCapabilities: [],
						defaultGeometry: {
							desktop: {
								widthPct: 44,
								heightPx: 120
							},
							mobile: {
								widthPct: 90,
								heightPx: 120
							}
						}
					},
					styleSlots: [],
					changeNote: "",
					renderSpec: null,
					fields: [{
						name: "Title",
						description: "",
						fieldKind: "text",
						textType: "title",
						sortOrder: 0,
						isRequired: !1,
						isLocked: !1,
						defaultValue: null,
						editorSchema: { multiline: !0 },
						capabilities: {},
						imagePolicy: {},
						ctaPolicy: {},
						styleSlots: []
					}]
				};
			},
			async loadItemComponents() {
				if (!this.itemComponentsLoading) {
					this.itemComponentsLoading = !0, this.itemComponentsError = "";
					try {
						let e = await fetch("/api/item-components?includeArchived=true"), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `컴포넌트 목록 요청 오류(${e.status})`);
						this.itemComponents = Array.isArray(t.components) ? t.components : [], this.itemComponents.some((e) => e.id === this.selectedItemComponentId) ? this.selectedItemComponentId && this.loadItemComponentUsage(this.selectedItemComponentId) : (this.selectedItemComponentId = this.itemComponents[0]?.id || "", this.itemComponents[0] && this.selectItemComponent(this.itemComponents[0]));
					} catch (e) {
						this.itemComponentsError = e.message;
					} finally {
						this.itemComponentsLoading = !1;
					}
				}
			},
			selectItemComponent(e) {
				this.selectedItemComponentId = e.id, this.itemComponentUsage = {
					usageCount: 0,
					sections: [],
					generationReadiness: null
				}, this.referencePublishOptions = {
					sections: [],
					references: []
				}, this.referencePublishPlan = null, this.referencePublishForm = {
					sectionId: "",
					itemKey: "",
					layoutPresetIds: [],
					referenceIds: [],
					changeNote: ""
				};
				let t = Array.isArray(e.fields) && e.fields.length ? e.fields : [{
					name: e.name || "Field",
					description: e.description || "",
					fieldKind: e.fieldKind || "text",
					textType: e.textType || "title",
					sortOrder: 0,
					isRequired: !1,
					isLocked: !1,
					defaultValue: e.defaultValue ?? null,
					editorSchema: e.editorSchema || {},
					capabilities: e.capabilities || {},
					imagePolicy: e.imagePolicy || {},
					ctaPolicy: {},
					styleSlots: e.styleSlots || []
				}];
				this.itemComponentEditor = {
					name: e.name,
					description: e.description || "",
					fieldKind: e.fieldKind || "text",
					textType: e.textType || "title",
					editorSchema: e.editorSchema || {},
					defaultValue: e.defaultValue ?? null,
					imagePolicy: { ...e.imagePolicy || {} },
					capabilities: {
						...e.capabilities || {},
						pageSchemaAsset: {
							kind: "",
							url: "",
							text: "",
							...e.capabilities?.pageSchemaAsset
						}
					},
					styleSlots: [...e.styleSlots || []],
					changeNote: "",
					libraryPresentation: {
						category: e.libraryPresentation?.category || "",
						iconKey: e.libraryPresentation?.iconKey || "",
						displayOrder: e.libraryPresentation?.displayOrder ?? 100,
						isFeatured: e.libraryPresentation?.isFeatured === !0
					},
					libraryKeywords: (e.libraryPresentation?.keywords || []).join(", "),
					placementPolicy: {
						allowedSectionRoles: [...e.placementPolicy?.allowedSectionRoles || []],
						deniedSectionRoles: [...e.placementPolicy?.deniedSectionRoles || []],
						maxInstancesPerSection: e.placementPolicy?.maxInstancesPerSection ?? null,
						requiresParentCapabilities: [...e.placementPolicy?.requiresParentCapabilities || []],
						defaultGeometry: {
							desktop: {
								widthPct: e.placementPolicy?.defaultGeometry?.desktop?.widthPct ?? 44,
								heightPx: e.placementPolicy?.defaultGeometry?.desktop?.heightPx ?? 120
							},
							mobile: {
								widthPct: e.placementPolicy?.defaultGeometry?.mobile?.widthPct ?? 90,
								heightPx: e.placementPolicy?.defaultGeometry?.mobile?.heightPx ?? 120
							}
						}
					},
					renderSpec: e.renderSpec || null,
					fields: t.map((e) => ({
						...e,
						editorSchema: { ...e.editorSchema || {} },
						capabilities: { ...e.capabilities || {} },
						imagePolicy: {
							...e.imagePolicy || {},
							allowedSources: [...e.imagePolicy?.allowedSources || []]
						},
						ctaPolicy: { ...e.ctaPolicy || {} },
						styleSlots: [...e.styleSlots || []]
					}))
				}, this.showNewItemComponentForm = !1, this.loadItemComponentUsage(e.id), (String(e.systemSeedCode || "").startsWith("ref-pattern-") || e.capabilities?.referenceDerived === !0) && this.loadReferencePublishOptions(e);
			},
			async loadReferencePublishOptions(e = this.selectedItemComponent) {
				if (e?.versionId) {
					this.referencePublishLoading = !0;
					try {
						let t = await fetch(`/api/reference-component-publish-options?componentVersionId=${encodeURIComponent(e.versionId)}`), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `사용 준비 옵션 조회 오류(${t.status})`);
						if (e.id !== this.selectedItemComponentId) return;
						this.referencePublishOptions = {
							sections: Array.isArray(n.sections) ? n.sections : [],
							references: Array.isArray(n.references) ? n.references : []
						};
						let r = this.itemComponentUsage.sections?.[0], i = this.referencePublishOptions.sections.find((e) => e.id === r?.id) || this.referencePublishOptions.sections[0];
						this.referencePublishForm.sectionId = i?.id || "", this.referencePublishForm.itemKey = r?.itemKey || e.componentKey || "component", this.referencePublishForm.layoutPresetIds = (i?.layouts || []).map((e) => e.id);
					} catch (e) {
						this.referencePublishOptions = {
							sections: [],
							references: [],
							error: e.message
						};
					} finally {
						this.referencePublishLoading = !1;
					}
				}
			},
			selectReferencePublishSection(e) {
				this.referencePublishForm.sectionId = e;
				let t = this.referencePublishOptions.sections.find((t) => t.id === e);
				this.referencePublishForm.layoutPresetIds = (t?.layouts || []).map((e) => e.id), this.referencePublishPlan = null;
			},
			referencePublishPayload(e = this.selectedItemComponent) {
				return {
					componentVersionId: e?.versionId || "",
					sectionId: this.referencePublishForm.sectionId,
					itemKey: this.referencePublishForm.itemKey,
					layoutPresetIds: [...this.referencePublishForm.layoutPresetIds],
					referenceIds: [...this.referencePublishForm.referenceIds]
				};
			},
			async prepareReferenceComponentPublish() {
				if (!(!this.selectedItemComponent?.versionId || this.referencePublishLoading)) {
					this.referencePublishLoading = !0, this.referencePublishPlan = null;
					try {
						let e = await fetch("/api/reference-component-publish-plan", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(this.referencePublishPayload())
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `발행 계획 오류(${e.status})`);
						this.referencePublishPlan = t.plan || null, this.setStatus(this.referencePublishPlan?.readiness?.ready ? "사용 준비 검사가 완료되었습니다." : "사용 준비 차단 항목을 확인해 주세요.");
					} catch (e) {
						this.referencePublishPlan = { readiness: {
							ready: !1,
							blockers: [{
								code: "PLAN_REQUEST_FAILED",
								message: e.message
							}]
						} }, this.setStatus(`사용 준비 검사 실패: ${e.message}`);
					} finally {
						this.referencePublishLoading = !1;
					}
				}
			},
			async publishReferenceComponent() {
				if (!(!this.referencePublishPlan?.readiness?.ready || !this.referencePublishForm.changeNote.trim() || this.referencePublishLoading) && window.confirm("검증된 컴포넌트 버전을 활성화하고 선택한 Section에 연결할까요?")) {
					this.referencePublishLoading = !0;
					try {
						let e = await fetch("/api/reference-component-publish", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Idempotency-Key": crypto.randomUUID()
							},
							body: JSON.stringify({
								...this.referencePublishPayload(),
								changeNote: this.referencePublishForm.changeNote.trim()
							})
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `컴포넌트 발행 오류(${e.status})`);
						this.setStatus("레퍼런스 컴포넌트를 발행했습니다."), await this.loadItemComponents(), await this.loadItemComponentUsage(this.selectedItemComponentId), this.referencePublishPlan = null;
					} catch (e) {
						this.setStatus(`컴포넌트 발행 실패: ${e.message}`);
					} finally {
						this.referencePublishLoading = !1;
					}
				}
			},
			async loadItemComponentUsage(e = this.selectedItemComponentId) {
				if (e) {
					this.itemComponentUsageLoading = !0;
					try {
						let t = await fetch(`/api/item-component-usage?componentId=${encodeURIComponent(e)}`), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `컴포넌트 사용처 조회 오류(${t.status})`);
						e === this.selectedItemComponentId && (this.itemComponentUsage = {
							usageCount: Number(n.usageCount || 0),
							sections: Array.isArray(n.sections) ? n.sections : [],
							generationReadiness: n.generationReadiness || null
						});
					} catch (t) {
						e === this.selectedItemComponentId && (this.itemComponentUsage = {
							usageCount: 0,
							sections: [],
							generationReadiness: null,
							error: t.message
						});
					} finally {
						this.itemComponentUsageLoading = !1;
					}
				}
			},
			async archiveItemComponent(e) {
				if (!(!e?.id || e.status === "archived" || this.itemComponentSaving)) {
					if (await this.loadItemComponentUsage(e.id), this.itemComponentUsage.usageCount > 0) {
						this.setStatus(`사용 중인 컴포넌트는 보관할 수 없습니다 (${this.itemComponentUsage.usageCount}개 사용처)`);
						return;
					}
					if (window.confirm(`${e.name} 컴포넌트를 보관할까요? 보관 후 새 섹션에서 사용할 수 없습니다.`)) {
						this.itemComponentSaving = !0;
						try {
							let t = await fetch("/api/item-component-archive", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ componentId: e.id })
							}), n = await t.json().catch(() => ({}));
							if (!t.ok) throw t.status === 409 && await this.loadItemComponentUsage(e.id), Error(n.message || n.error || `컴포넌트 보관 오류(${t.status})`);
							this.selectedItemComponentId = "", this.itemComponentUsage = {
								usageCount: 0,
								sections: []
							}, await this.loadItemComponents();
							let r = this.itemComponents.find((e) => e.status !== "archived");
							r && this.selectItemComponent(r), this.setStatus("컴포넌트를 보관했습니다");
						} catch (e) {
							this.setStatus(`컴포넌트 보관 실패: ${e.message}`);
						} finally {
							this.itemComponentSaving = !1;
						}
					}
				}
			},
			async deleteItemComponent(e) {
				if (!(!e?.id || this.itemComponentSaving)) {
					if (e.systemSeedCode) {
						this.setStatus("시스템 기본 컴포넌트는 삭제할 수 없습니다");
						return;
					}
					if (await this.loadItemComponentUsage(e.id), this.itemComponentUsage.usageCount > 0) {
						let e = this.itemComponentUsage.sections.slice(0, 3).map((e) => `${e.name} v${e.sectionVersion}`).join(", ");
						this.setStatus(`컴포넌트 삭제 불가: 활성·초안 Section Preset ${this.itemComponentUsage.usageCount}곳에서 사용 중입니다${e ? ` (${e}${this.itemComponentUsage.usageCount > 3 ? " 외" : ""})` : ""}`);
						return;
					}
					if (window.confirm(`${e.name} 컴포넌트를 영구 삭제할까요? 모든 버전과 과거 섹션의 배치 정보가 삭제되며 복구할 수 없습니다.`)) {
						this.itemComponentSaving = !0;
						try {
							let t = await fetch(`/api/item-component-delete?componentId=${encodeURIComponent(e.id)}`, { method: "DELETE" }), n = await t.json().catch(() => ({}));
							if (!t.ok) throw t.status === 409 && await this.loadItemComponentUsage(e.id), Error(n.message || n.error || `컴포넌트 삭제 오류(${t.status})`);
							this.selectedItemComponentId = "", this.itemComponentUsage = {
								usageCount: 0,
								sections: []
							}, await this.loadItemComponents(), this.setStatus(`컴포넌트를 삭제했습니다 (버전 ${n.deletedVersionCount || 0}개, 과거 배치 ${n.deletedInstanceCount || 0}개 정리)`);
						} catch (e) {
							this.setStatus(`컴포넌트 삭제 실패: ${e.message}`);
						} finally {
							this.itemComponentSaving = !1;
						}
					}
				}
			},
			openNewItemComponentForm() {
				this.selectedItemComponentId = "", this.resetItemComponentEditor(), this.showNewItemComponentForm = !0;
			},
			addItemComponentField() {
				let e = this.itemComponentEditor.fields || (this.itemComponentEditor.fields = []);
				e.push({
					name: `Field ${e.length + 1}`,
					description: "",
					fieldKind: "text",
					textType: "title",
					sortOrder: e.length * 10,
					isRequired: !1,
					isLocked: !1,
					defaultValue: null,
					editorSchema: { multiline: !0 },
					capabilities: {},
					imagePolicy: {
						allowedSources: ["file", "url"],
						promptText: "",
						aspectRatio: ""
					},
					ctaPolicy: {},
					styleSlots: []
				});
			},
			addItemComponentStyleSlot(e) {
				if (!e) return;
				let t = e.styleSlots ||= [], n = e.fieldKind === "cta";
				t.push({
					slotKey: `style${t.length + 1}`,
					semanticRole: n ? "accent-color" : "text-color",
					targetProperty: n ? "backgroundColorToken" : "colorToken",
					aiSelectable: !0
				});
			},
			removeItemComponentStyleSlot(e, t) {
				Array.isArray(e?.styleSlots) && e.styleSlots.splice(t, 1);
			},
			removeItemComponentField(e) {
				if ((this.itemComponentEditor.fields || []).length <= 1) {
					this.setStatus("컴포넌트에는 요소가 하나 이상 필요합니다");
					return;
				}
				this.itemComponentEditor.fields.splice(e, 1), this.itemComponentEditor.fields.forEach((e, t) => {
					e.sortOrder = t * 10;
				});
			},
			duplicateItemComponentField(e) {
				let t = this.itemComponentEditor.fields || [], n = t[e];
				if (!n) return;
				let r = JSON.parse(JSON.stringify(n));
				delete r.id, delete r.fieldKey, r.name = `${n.name || `Field ${e + 1}`} 복사본`, t.splice(e + 1, 0, r), t.forEach((e, t) => {
					e.sortOrder = t * 10;
				});
			},
			moveItemComponentField(e, t) {
				let n = this.itemComponentEditor.fields || [], r = e + t;
				if (!n[e] || r < 0 || r >= n.length) return;
				let [i] = n.splice(e, 1);
				n.splice(r, 0, i), n.forEach((e, t) => {
					e.sortOrder = t * 10;
				});
			},
			async saveNewItemComponent() {
				if (!(!this.itemComponentEditor.name || this.itemComponentSaving)) {
					this.itemComponentSaving = !0;
					try {
						let e = {
							...this.itemComponentEditor,
							libraryPresentation: {
								...this.itemComponentEditor.libraryPresentation,
								keywords: String(this.itemComponentEditor.libraryKeywords || "").split(",").map((e) => e.trim()).filter(Boolean)
							}
						}, t = await fetch("/api/item-components", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(e)
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `컴포넌트 생성 오류(${t.status})`);
						this.showNewItemComponentForm = !1, this.selectedItemComponentId = n.component.id, await this.loadItemComponents(), this.setStatus("컴포넌트 초안을 생성했습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 생성 실패: ${e.message}`);
					} finally {
						this.itemComponentSaving = !1;
					}
				}
			},
			async activateItemComponent(e) {
				if (!(!e?.versionId || this.itemComponentSaving)) {
					this.itemComponentSaving = !0;
					try {
						let t = await fetch("/api/item-component-activate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								componentId: e.id,
								versionId: e.versionId,
								changeNote: "관리자 페이지에서 활성화"
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `컴포넌트 활성화 오류(${t.status})`);
						await this.loadItemComponents(), this.setStatus("컴포넌트 버전을 활성화했습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 활성화 실패: ${e.message}`);
					} finally {
						this.itemComponentSaving = !1;
					}
				}
			},
			async createItemComponentDraft(e) {
				if (!(!e?.id || this.itemComponentSaving)) {
					this.itemComponentSaving = !0;
					try {
						let t = await fetch("/api/item-component-draft", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								componentId: e.id,
								changeNote: "관리자 페이지에서 새 초안 생성"
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `컴포넌트 초안 오류(${t.status})`);
						await this.loadItemComponents(), this.selectItemComponent(n.component), this.setStatus("컴포넌트 새 초안을 만들었습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 초안 생성 실패: ${e.message}`);
					} finally {
						this.itemComponentSaving = !1;
					}
				}
			},
			async saveItemComponentDraft(e) {
				if (!(!e?.id || e.versionStatus !== "draft" || this.itemComponentSaving)) {
					this.itemComponentSaving = !0;
					try {
						let t = {
							...this.itemComponentEditor,
							libraryPresentation: {
								...this.itemComponentEditor.libraryPresentation,
								keywords: String(this.itemComponentEditor.libraryKeywords || "").split(",").map((e) => e.trim()).filter(Boolean)
							},
							versionId: e.versionId
						}, n = await fetch(`/api/item-component?componentId=${encodeURIComponent(e.id)}`, {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(t)
						}), r = await n.json().catch(() => ({}));
						if (!n.ok) throw Error(r.message || r.error || `컴포넌트 저장 오류(${n.status})`);
						await this.loadItemComponents(), this.selectItemComponent(r.component), this.setStatus("컴포넌트 초안을 저장했습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 저장 실패: ${e.message}`);
					} finally {
						this.itemComponentSaving = !1;
					}
				}
			},
			async loadDesignTokenSets() {
				if (!this.designTokenSetsLoading) {
					this.designTokenSetsLoading = !0;
					try {
						let e = await fetch("/api/design-token-sets"), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `디자인 토큰 요청 오류(${e.status})`);
						this.designTokenSets = Array.isArray(t.tokenSets) ? t.tokenSets : [];
					} catch (e) {
						this.setStatus(`디자인 토큰 목록 실패: ${e.message}`);
					} finally {
						this.designTokenSetsLoading = !1;
					}
				}
			},
			async loadWizardSectionAuditLogs() {
				if (!this.wizardSectionAuditLoading) {
					this.wizardSectionAuditLoading = !0, this.wizardSectionAuditError = "";
					try {
						let e = new URLSearchParams({ limit: "200" });
						this.wizardSectionAuditFilters.templateKey && e.set("templateKey", this.wizardSectionAuditFilters.templateKey), this.wizardSectionAuditFilters.action && e.set("action", this.wizardSectionAuditFilters.action);
						let t = await fetch(`/api/wizard-section-audit-logs?${e}`), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `섹션 작업 이력 요청 오류(${t.status})`);
						this.wizardSectionAuditLogs = Array.isArray(n.logs) ? n.logs : [];
					} catch (e) {
						this.wizardSectionAuditLogs = [], this.wizardSectionAuditError = e.message;
					} finally {
						this.wizardSectionAuditLoading = !1;
					}
				}
			},
			wizardSectionAuditActionLabel(e, t = "") {
				return e === "delete" ? t === "section" ? "보관" : "삭제" : {
					create: "생성",
					update: "수정",
					reorder: "순서 변경",
					draft: "초안 생성",
					activate: "활성화"
				}[e] || e;
			},
			formatAuditDate(e) {
				return e ? new Intl.DateTimeFormat("ko-KR", {
					dateStyle: "short",
					timeStyle: "medium"
				}).format(new Date(e)) : "-";
			},
			formatAuditState(e) {
				return e ? JSON.stringify(e, null, 2) : "없음";
			},
			promptGroupPanelId(e) {
				return `prompt-versions-${String(e?.lineageId || "unknown").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
			},
			promptWorkflowPanelId(e) {
				return `prompt-workflow-${String(e?.key || "other").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
			},
			promptWorkflowExpanded(e) {
				return this.expandedPromptWorkflowKeys.includes(e?.key);
			},
			togglePromptWorkflow(e) {
				let t = e?.key;
				if (!t) return;
				let n = this.expandedPromptWorkflowKeys.includes(t);
				this.expandedPromptWorkflowKeys = n ? this.expandedPromptWorkflowKeys.filter((e) => e !== t) : [...this.expandedPromptWorkflowKeys, t];
			},
			expandPromptWorkflowForType(e) {
				let t = window.PromoAdminPromptGroups.promptTypeMeta(e).group;
				t && !this.expandedPromptWorkflowKeys.includes(t) && (this.expandedPromptWorkflowKeys = [...this.expandedPromptWorkflowKeys, t]);
			},
			promptGroupExpanded(e) {
				return this.expandedPromptLineageIds.includes(e?.lineageId);
			},
			promptGroupContainsSelection(e) {
				return !!e?.versions?.some((e) => e.id === this.selectedPromptTemplateId);
			},
			togglePromptGroup(e) {
				let t = e?.lineageId;
				if (!t) return;
				let n = this.expandedPromptLineageIds.includes(t);
				this.expandedPromptLineageIds = n ? this.expandedPromptLineageIds.filter((e) => e !== t) : [...this.expandedPromptLineageIds, t];
			},
			expandPromptGroupForPromptId(e) {
				let t = window.PromoAdminPromptGroups.findPromptGroup(this.promptTemplateGroups, e);
				t && this.expandPromptWorkflowForType(t.type), t && !this.expandedPromptLineageIds.includes(t.lineageId) && (this.expandedPromptLineageIds = [...this.expandedPromptLineageIds, t.lineageId]);
			},
			promptGroupArchivedVisible(e) {
				return !!this.promptArchivedVisibilityByLineage[e?.lineageId];
			},
			togglePromptGroupArchived(e) {
				let t = e?.lineageId;
				t && (this.promptArchivedVisibilityByLineage = {
					...this.promptArchivedVisibilityByLineage,
					[t]: !this.promptGroupArchivedVisible(e)
				});
			},
			promptGroupVisibleVersions(e) {
				let t = Array.isArray(e?.versions) ? e.versions : [];
				return this.promptGroupArchivedVisible(e) ? t : t.filter((e) => e.status !== "archived");
			},
			promptGroupProviderSummary(e) {
				let t = e?.active || e?.primary;
				return [t?.provider, t?.model].filter(Boolean).join(" · ") || "모델 설정 없음";
			},
			formatPromptDate(e) {
				if (!e) return "-";
				let t = new Date(e);
				return Number.isNaN(t.getTime()) ? "-" : new Intl.DateTimeFormat("ko-KR", {
					dateStyle: "short",
					timeStyle: "short"
				}).format(t);
			},
			ensureFilteredPromptSelection() {
				let e = this.filteredPromptTemplateGroups;
				if (!e.length) return;
				if (e.some((e) => this.promptGroupContainsSelection(e))) {
					this.expandPromptGroupForPromptId(this.selectedPromptTemplateId);
					return;
				}
				let t = e.find((e) => e.active)?.active || e[0]?.primary;
				t && this.selectPromptTemplate(t.id, { silent: !0 });
			},
			handleAdminAuthResponse(e, t = {}) {
				return ![401, 403].includes(e.status) || !String(t.code || "").startsWith("ADMIN_") ? !1 : (this.adminAuthState = t.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "error" : "required", this.adminAuthSubject = "", this.adminAuthError = t.code === "ADMIN_AUTH_NOT_CONFIGURED" ? "관리자 인증 환경변수가 설정되지 않았습니다." : "관리자 세션이 만료되었습니다. 다시 로그인해 주세요.", !0);
			},
			async loadPromptTemplates(e = {}) {
				if (!(this.promptTemplatesLoading && !e.fresh)) {
					this.promptTemplatesLoading = !0, this.promptTemplatesError = "";
					try {
						let e = await fetch("/api/prompt-templates?includeArchived=true"), t = await e.json().catch(() => ({}));
						if (this.handleAdminAuthResponse(e, t), !e.ok) throw Error(t.message || t.error || `프롬프트 목록 요청 오류(${e.status})`);
						this.promptTemplates = Array.isArray(t.prompts) ? t.prompts : [];
						let n = window.PromoAdminPromptGroups.groupPromptTemplates(this.promptTemplates), r = window.PromoAdminPromptGroups.resolvePromptSelection(n, this.selectedPromptTemplateId);
						this.selectedPromptTemplateId = r?.id || "", this.expandPromptGroupForPromptId(this.selectedPromptTemplateId), this.selectedPromptTemplateId && await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: !0 });
					} catch (e) {
						this.promptTemplatesError = e.message, this.setStatus(`프롬프트 목록을 불러오지 못했습니다: ${e.message}`);
					} finally {
						this.promptTemplatesLoading = !1;
					}
				}
			},
			async loadLlmRegistryModels(e = {}) {
				if (!(this.llmRegistryModelsLoading && !e.fresh)) {
					this.llmRegistryModelsLoading = !0, this.llmRegistryModelsError = "";
					try {
						let e = await window.PromoAdminLlmModels.service.list();
						this.llmRegistryModels = Array.isArray(e.models) ? e.models : [];
					} catch (e) {
						this.llmRegistryModels = [], this.llmRegistryModelsError = e.message, this.setStatus(`LLM 모델 목록을 불러오지 못했습니다: ${e.message}`);
					} finally {
						this.llmRegistryModelsLoading = !1;
					}
				}
			},
			async loadWorkerWebhookSettings(e = {}) {
				if (!(this.workerWebhookSettingsLoading && !e.fresh)) {
					this.workerWebhookSettingsLoading = !0, this.workerWebhookSettingsError = "";
					try {
						let t = await fetch("/api/promo-generation-worker-settings"), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `작업자 설정 요청 오류(${t.status})`);
						this.workerWebhookSettings = Array.isArray(n.settings) ? n.settings : [];
						let r = {};
						this.workerWebhookSettings.forEach((t) => {
							let n = this.workerWebhookEditors[t.stage] || {}, i = !!e.preserveDrafts;
							r[t.stage] = {
								webhookUrl: i && n.webhookUrl || "",
								isActive: i ? n.isActive ?? !!t.isActive : !!t.isActive,
								timeoutMs: i ? n.timeoutMs ?? t.timeoutMs ?? "" : t.timeoutMs ?? "",
								description: i ? n.description ?? (t.description || "") : t.description || "",
								changeNote: ""
							};
						}), this.workerWebhookEditors = r;
					} catch (e) {
						this.workerWebhookSettingsError = e.message, this.setStatus(`웹훅 설정을 불러오지 못했습니다: ${e.message}`);
					} finally {
						this.workerWebhookSettingsLoading = !1;
					}
				}
			},
			workerWebhookEditor(e) {
				return this.workerWebhookEditors[e] || (this.workerWebhookEditors[e] = {
					webhookUrl: "",
					isActive: !1,
					timeoutMs: "",
					description: "",
					changeNote: ""
				}), this.workerWebhookEditors[e];
			},
			workerStageLabel(e, t = "") {
				return {
					integrated_brief: "통합 디자인 브리프",
					integrated_brief_v2: "통합 디자인 브리프 V2",
					lofi_draft: "LO-FI 시안",
					final_design: "최종 디자인",
					final_design_v2: "최종 디자인 V2",
					promo_ui_design: "프로모션 UI 디자인"
				}[e] || t || e;
			},
			promptJourneyStepLabel(e) {
				let t = window.PromoAdminPromptGroups.promptTypeMeta(e).journeyStep;
				return t ? `${t}단계` : "";
			},
			promptTypeLabel(e) {
				return window.PromoAdminPromptGroups.promptTypeMeta(e).label;
			},
			promptTypeDescription(e) {
				return window.PromoAdminPromptGroups.promptTypeMeta(e).description;
			},
			promptExecutionModeLabel(e) {
				return window.PromoAdminPromptGroups.promptTypeMeta(e).executionMode;
			},
			promptWorkflowGroupLabel(e) {
				let t = window.PromoAdminPromptGroups.promptTypeMeta(e);
				return window.PromoAdminPromptGroups.promptWorkflowGroupMeta(t.group).label;
			},
			promptStatusLabel(e) {
				return {
					draft: "초안",
					validated: "검증 완료",
					active: "활성",
					inactive: "비활성",
					archived: "보관됨"
				}[e] || e || "알 수 없음";
			},
			async saveWorkerWebhookSetting(e) {
				if (!e?.stage || this.workerWebhookSavingStage) return;
				let t = this.workerWebhookEditor(e.stage);
				this.workerWebhookSavingStage = e.stage;
				try {
					let n = await fetch("/api/promo-generation-worker-settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							stage: e.stage,
							webhookUrl: t.webhookUrl,
							preserveExistingWebhook: !t.webhookUrl && e.isConfigured,
							isActive: t.isActive,
							timeoutMs: t.timeoutMs === "" ? null : Number(t.timeoutMs),
							description: t.description,
							changeNote: t.changeNote || "관리자 페이지에서 작업자 웹훅 설정을 변경했습니다."
						})
					}), r = await n.json().catch(() => ({}));
					if (!n.ok) throw Error(r.message || r.error || `작업자 설정 저장 오류(${n.status})`);
					await this.loadWorkerWebhookSettings({ fresh: !0 }), this.setStatus(`${this.workerStageLabel(e.stage, e.label)} 웹훅 설정을 저장했습니다`);
				} catch (e) {
					this.setStatus(`웹훅 설정 저장 실패: ${e.message}`);
				} finally {
					this.workerWebhookSavingStage = "";
				}
			},
			async selectPromptTemplate(e, t = {}) {
				let n = ++this.promptDetailRequestRevision;
				this.selectedPromptTemplateId = e, this.promptDetailLoading = !0, this.expandPromptGroupForPromptId(e), this.promptBodyTranslationKo = "", this.promptBodyTranslationSource = "", this.promptBodyTranslationError = "", this.promptBodyTranslationLoading = !1, this.promptBodyLanguageError = "", this.promptEditorBaseline = "";
				let r = this.promptTemplates.find((t) => t.id === e);
				if (!r) {
					n === this.promptDetailRequestRevision && (this.promptDetailLoading = !1);
					return;
				}
				try {
					let i = await fetch(`/api/prompt-template?id=${encodeURIComponent(e)}`), a = await i.json().catch(() => ({}));
					if (!i.ok) throw Error(a.message || a.error || `프롬프트 요청 오류(${i.status})`);
					if (n !== this.promptDetailRequestRevision || e !== this.selectedPromptTemplateId) return;
					let o = a.prompt || r, s = this.promptTemplates.findIndex((t) => t.id === e);
					s >= 0 && this.promptTemplates.splice(s, 1, o), this.promptHistories = Array.isArray(a.histories) ? a.histories : [];
					let c = /* @__PURE__ */ new Set([
						"executionSnapshotVersion",
						"harnessConfig",
						"runtimeConfig",
						"modelCapabilitySnapshot",
						"safetyContract",
						"policySchemaVersion",
						"generationPolicy",
						"renderPolicy",
						"validationPolicy",
						"promptLayers"
					]), l = Object.fromEntries(Object.entries(o.modelOptions || {}).filter(([e]) => !c.has(e))), u = this.promptUsesSectionAiControlPlane(o), d = this.promptUsesSectionImagePolicy(o), f = o.runtimeConfig || o.modelOptions?.runtimeConfig || {}, p = d ? {
						timeoutMs: 24e4,
						maxAttempts: 3,
						retryBaseMs: 15e3,
						retryMaxMs: 75e3
					} : o.type === "promo_page_schema_planner" ? {
						timeoutMs: 24e4,
						maxAttempts: 1,
						retryBaseMs: 0,
						retryMaxMs: 0
					} : {
						timeoutMs: 9e4,
						maxAttempts: 1,
						retryBaseMs: 0,
						retryMaxMs: 0
					};
					this.promptEditor = {
						name: o.name || "",
						body: o.body || "",
						requiredVariablesText: (o.requiredVariables || []).join(", "),
						optionalVariablesText: (o.optionalVariables || []).join(", "),
						provider: o.provider || "",
						modelChoice: this.llmRegistryModels.some((e) => e.status === "active" && e.provider === o.provider && e.modelId === o.model) ? o.model : "",
						model: o.model || "",
						temperature: o.temperature ?? "",
						maxTokens: o.maxTokens ?? "",
						responseFormat: o.responseFormat || "",
						imageSize: [
							"1K",
							"2K",
							"4K"
						].includes(String(o.generationPolicy?.requestedTier || o.modelOptions?.generationPolicy?.requestedTier || o.modelOptions?.imageSize || o.modelOptions?.image_size || "").toUpperCase()) ? String(o.generationPolicy?.requestedTier || o.modelOptions?.generationPolicy?.requestedTier || o.modelOptions?.imageSize || o.modelOptions?.image_size).toUpperCase() : "2K",
						executionSnapshotVersion: Number(o.executionSnapshotVersion || o.modelOptions?.executionSnapshotVersion || (d ? 3 : 2)),
						timeoutMs: o.type === "promo_page_schema_planner" && Number(f.timeoutMs) === 9e4 ? 24e4 : f.timeoutMs ?? (u ? p.timeoutMs : ""),
						maxAttempts: f.maxAttempts ?? (u ? p.maxAttempts : ""),
						retryBaseMs: f.retryBaseMs ?? (u ? p.retryBaseMs : ""),
						retryMaxMs: f.retryMaxMs ?? (u ? p.retryMaxMs : ""),
						outputMimeType: o.generationPolicy?.outputMimeType ?? o.modelOptions?.generationPolicy?.outputMimeType ?? o.runtimeConfig?.outputMimeType ?? o.modelOptions?.runtimeConfig?.outputMimeType ?? "",
						generationPolicyText: JSON.stringify(o.generationPolicy || o.modelOptions?.generationPolicy || {}, null, 2),
						renderPolicyText: JSON.stringify(o.renderPolicy || o.modelOptions?.renderPolicy || {}, null, 2),
						validationPolicyText: JSON.stringify(o.validationPolicy || o.modelOptions?.validationPolicy || {}, null, 2),
						harnessConfigText: JSON.stringify(o.harnessConfig || o.modelOptions?.harnessConfig || {}, null, 2),
						promptLayersText: JSON.stringify(o.promptLayers || o.modelOptions?.promptLayers || {}, null, 2),
						modelCapabilitySnapshotText: JSON.stringify(o.modelCapabilitySnapshot || o.modelOptions?.modelCapabilitySnapshot || {}, null, 2),
						safetyContractText: JSON.stringify(o.safetyContract || o.modelOptions?.safetyContract || {}, null, 2),
						modelOptionsText: JSON.stringify(l, null, 2),
						changeNote: ""
					}, this.promptEditorBaseline = JSON.stringify(this.promptEditorSavePayload(o)), this.promptBodyLanguageError = this.promptBodyContainsKorean(o.body) ? "영문 원문에는 한글을 입력할 수 없습니다." : "", o.type !== "admin_prompt_translation" && this.translatePromptBody(), t.silent || this.setStatus(`${o.name} 프롬프트를 열었습니다`);
				} catch (e) {
					n === this.promptDetailRequestRevision && this.setStatus(`프롬프트 상세를 불러오지 못했습니다: ${e.message}`);
				} finally {
					n === this.promptDetailRequestRevision && (this.promptDetailLoading = !1);
				}
			},
			variableTextToList(e) {
				return String(e || "").split(",").map((e) => e.trim()).filter(Boolean);
			},
			parseModelOptionsText(e) {
				let t = String(e || "").trim();
				if (!t) return {};
				try {
					let e = JSON.parse(t);
					return e && typeof e == "object" && !Array.isArray(e) ? e : {};
				} catch (e) {
					throw Error(`모델 상세 옵션 JSON 형식이 올바르지 않습니다: ${e.message}`);
				}
			},
			schedulePromptBodyTranslation() {
				this.promptBodyTranslationTimer && clearTimeout(this.promptBodyTranslationTimer), this.promptBodyTranslationError = "", this.promptBodyTranslationTimer = setTimeout(() => {
					this.promptBodyTranslationTimer = null, this.translatePromptBody();
				}, 900);
			},
			promptBodyContainsKorean(e) {
				return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(String(e || ""));
			},
			handlePromptBodyInput() {
				this.promptBodyLanguageError = this.promptBodyContainsKorean(this.promptEditor.body) ? "영문 원문에는 한글을 입력할 수 없습니다." : "", this.schedulePromptBodyTranslation();
			},
			async translatePromptBody(e = {}) {
				let t = String(this.promptEditor.body || "");
				if (!t.trim()) {
					this.promptBodyTranslationKo = "", this.promptBodyTranslationSource = "", this.promptBodyTranslationError = "", this.promptBodyTranslationLoading = !1;
					return;
				}
				if (!e.force && t === this.promptBodyTranslationSource && this.promptBodyTranslationKo) return;
				let n = this.selectedPromptTemplateId, r = this.promptBodyTranslationCache[n];
				if (!e.force && r?.source === t && r.translation) {
					this.promptBodyTranslationKo = r.translation, this.promptBodyTranslationSource = t, this.promptBodyTranslationLoading = !1;
					return;
				}
				this.promptBodyTranslationLoading = !0, this.promptBodyTranslationError = "";
				try {
					let e = await fetch("/api/prompt-template-translate", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ text: t })
					}), r = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(r.message || r.error || `프롬프트 번역 오류(${e.status})`);
					if (n !== this.selectedPromptTemplateId || t !== this.promptEditor.body) return;
					this.promptBodyTranslationKo = String(r.translation || ""), this.promptBodyTranslationSource = t, this.promptBodyTranslationCache = {
						...this.promptBodyTranslationCache,
						[n]: {
							source: t,
							translation: this.promptBodyTranslationKo
						}
					};
				} catch (e) {
					if (n !== this.selectedPromptTemplateId || t !== this.promptEditor.body) return;
					this.promptBodyTranslationKo = "", this.promptBodyTranslationSource = "", this.promptBodyTranslationError = e.message;
				} finally {
					n === this.selectedPromptTemplateId && t === this.promptEditor.body && (this.promptBodyTranslationLoading = !1);
				}
			},
			async copyPromptBody() {
				let e = String(this.promptEditor.body || "");
				if (!e) {
					this.setStatus("복사할 영문 프롬프트가 없습니다.");
					return;
				}
				try {
					if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(e);
					else {
						let t = document.createElement("textarea");
						t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select(), document.execCommand("copy"), t.remove();
					}
					this.setStatus("영문 프롬프트 본문을 복사했습니다.");
				} catch (e) {
					this.setStatus(`프롬프트 복사 실패: ${e.message}`);
				}
			},
			promptSupportsImageSize(e = this.selectedPromptTemplate) {
				return this.promptEditor.provider === "google" && [
					"image_execution",
					"final_design",
					"section_background_image",
					"component_image"
				].includes(e?.type);
			},
			onPromptProviderChange() {
				if (!this.promptEditor.provider) {
					this.promptEditor.modelChoice = "", this.promptEditor.model = "";
					return;
				}
				let e = this.promptModelChoices.find((e) => e.isRecommended) || this.promptModelChoices[0];
				if (!e) {
					this.promptEditor.modelChoice = "", this.promptEditor.model = "", this.setStatus("선택한 Provider에 활성화된 LLM 모델이 없습니다. LLM 모델 관리에서 먼저 등록·활성화해 주세요.");
					return;
				}
				this.promptEditor.modelChoice = e.modelId, this.applyPromptModelPreset();
			},
			applyPromptModelPreset() {
				let e = this.selectedPromptModelPreset;
				if (!e) return;
				let t = e.defaultResponseFormat || (e.modality === "image" ? "image" : "text"), n = e.modelOptions?.imageSize || e.supportedImageSizes?.[0] || "2K";
				this.promptEditor.model = e.modelId, this.promptEditor.temperature = e.defaultTemperature ?? "", this.promptEditor.maxTokens = e.defaultMaxTokens ?? "", this.promptEditor.responseFormat = t, this.promptEditor.imageSize = n, this.promptEditor.modelOptionsText = JSON.stringify({
					provider: e.provider,
					model: e.modelId,
					responseFormat: t,
					...e.modelOptions || {}
				}, null, 2), this.promptUsesSectionAiControlPlane(this.selectedPromptTemplate) && (this.promptEditor.modelCapabilitySnapshotText = JSON.stringify({
					provider: e.provider,
					model: e.modelId,
					modality: e.modality,
					legacy: !!e.isLegacy,
					supportsStructuredOutput: e.modality === "text",
					supportsImageGeneration: e.modality === "image",
					...e.modality === "image" ? { supportedImageSizes: e.supportedImageSizes || [] } : {}
				}, null, 2)), this.promptUsesSectionImagePolicy(this.selectedPromptTemplate) && (this.promptEditor.outputMimeType = this.promptEditor.outputMimeType || "image/jpeg"), this.setStatus(`${e.displayName} Registry 기본 설정을 적용했습니다. 저장 전 각 항목을 수정할 수 있습니다.`);
			},
			promptUsesSectionAiControlPlane(e = this.selectedPromptTemplate) {
				return [
					"section_layout_planner",
					"multi_component_layout_planner",
					"section_composition_planner",
					"promo_overview_parser",
					"promo_template_recommender",
					"promo_template_composer",
					"promo_page_schema_planner",
					"promo_page_composer",
					"promo_composition_editor",
					"section_background_image",
					"component_image",
					"component_visual_analyzer"
				].includes(e?.type);
			},
			promptUsesSectionImagePolicy(e = this.selectedPromptTemplate) {
				return ["section_background_image", "component_image"].includes(e?.type);
			},
			promptModelOptionsForSave(e) {
				let t = this.parseModelOptionsText(this.promptEditor.modelOptionsText);
				if (t.promptLayers = this.parseModelOptionsText(this.promptEditor.promptLayersText), this.promptSupportsImageSize(e) && (t.imageSize = [
					"1K",
					"2K",
					"4K"
				].includes(this.promptEditor.imageSize) ? this.promptEditor.imageSize : "2K", delete t.image_size), this.promptUsesSectionAiControlPlane(e)) {
					let n = this.promptUsesSectionImagePolicy(e);
					if (t.executionSnapshotVersion = n ? Math.max(3, Number(this.promptEditor.executionSnapshotVersion || 3)) : Number(this.promptEditor.executionSnapshotVersion || 2), t.runtimeConfig = {
						timeoutMs: Number(this.promptEditor.timeoutMs),
						maxAttempts: Number(this.promptEditor.maxAttempts),
						retryBaseMs: Number(this.promptEditor.retryBaseMs),
						retryMaxMs: Number(this.promptEditor.retryMaxMs)
					}, t.harnessConfig = this.parseModelOptionsText(this.promptEditor.harnessConfigText), t.modelCapabilitySnapshot = this.parseModelOptionsText(this.promptEditor.modelCapabilitySnapshotText), t.safetyContract = this.parseModelOptionsText(this.promptEditor.safetyContractText), n) {
						t.policySchemaVersion = 1;
						let e = this.parseModelOptionsText(this.promptEditor.generationPolicyText);
						t.generationPolicy = {
							...e,
							requestedTier: [
								"1K",
								"2K",
								"4K"
							].includes(this.promptEditor.imageSize) ? this.promptEditor.imageSize : "2K",
							outputMimeType: this.promptEditor.outputMimeType || e.outputMimeType || "image/jpeg"
						}, t.renderPolicy = this.parseModelOptionsText(this.promptEditor.renderPolicyText), t.validationPolicy = this.parseModelOptionsText(this.promptEditor.validationPolicyText), delete t.imageSize, delete t.image_size, delete t.quality, delete t.runtimeConfig.outputMimeType, delete t.runtimeConfig.minimumImagePolicy;
					}
				}
				return t;
			},
			promptEditorSavePayload(e) {
				return {
					name: this.promptEditor.name,
					body: this.promptEditor.body,
					requiredVariables: this.variableTextToList(this.promptEditor.requiredVariablesText),
					optionalVariables: this.variableTextToList(this.promptEditor.optionalVariablesText),
					provider: this.promptEditor.provider,
					model: this.promptEditor.model,
					temperature: this.promptEditor.temperature === "" ? null : Number(this.promptEditor.temperature),
					maxTokens: this.promptEditor.maxTokens === "" ? null : Number(this.promptEditor.maxTokens),
					responseFormat: this.promptEditor.responseFormat,
					modelOptions: this.promptModelOptionsForSave(e)
				};
			},
			async requestPromptLifecycle(e, t, n) {
				let r = await fetch(e, {
					method: e === "/api/prompt-template" ? "PATCH" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(t)
				}), i = await r.json().catch(() => ({}));
				if (!r.ok) {
					this.handleAdminAuthResponse(r, i);
					let e = Error(i.message || i.error || `${n}(${r.status})`);
					throw e.result = i, e;
				}
				return i;
			},
			async savePromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!e || this.promptSaving) return;
				if (this.promptBodyContainsKorean(this.promptEditor.body)) {
					this.promptBodyLanguageError = "영문 원문에는 한글을 입력할 수 없습니다.", this.setStatus(this.promptBodyLanguageError);
					return;
				}
				if (!this.selectedPromptModelPreset || this.promptEditor.model !== this.selectedPromptModelPreset.modelId) {
					this.setStatus("LLM 모델 관리에 등록되고 활성화된 모델을 선택해 주세요.");
					return;
				}
				let t;
				try {
					t = this.promptEditorSavePayload(e);
				} catch (e) {
					this.setStatus(`프롬프트 저장 실패: ${e.message}`);
					return;
				}
				if (JSON.stringify(t) === this.promptEditorBaseline && e.status === "active") {
					this.setStatus("변경된 내용이 없어 새 버전을 생성하지 않았습니다.");
					return;
				}
				this.promptSaving = !0;
				try {
					let n = this.promptEditor.changeNote || `관리자 페이지에서 v${e.version} 프롬프트를 변경했습니다.`, r = e.id, i = e.version;
					if (e.status !== "draft") {
						try {
							let t = await this.requestPromptLifecycle("/api/prompt-template-draft", {
								id: e.id,
								changeNote: n
							}, "프롬프트 신규 버전 생성 오류");
							r = t.prompt?.id || "", i = t.prompt?.version || i;
						} catch (e) {
							let t = e.result;
							if (t?.code !== "PROMPT_CANDIDATE_EXISTS" || t.status !== "draft" || !t.promptId) throw e;
							r = t.promptId;
						}
						if (!r) throw Error("생성된 프롬프트 버전 ID를 확인할 수 없습니다.");
					}
					let a = (await this.requestPromptLifecycle("/api/prompt-template", {
						id: r,
						...t,
						changeNote: n
					}, "프롬프트 저장 오류")).prompt?.id || r, o = (await this.requestPromptLifecycle("/api/prompt-template-validate", {
						id: a,
						changeNote: `${n} · 자동 검증`
					}, "프롬프트 자동 검증 오류")).prompt?.id || a, s = await this.requestPromptLifecycle("/api/prompt-template-activate", {
						id: o,
						changeNote: `${n} · 저장 후 자동 활성화`
					}, "프롬프트 자동 활성화 오류");
					this.selectedPromptTemplateId = s.prompt?.id || o, await this.loadPromptTemplates({ fresh: !0 }), this.setStatus(`프롬프트 v${s.prompt?.version || i}을 생성하고 활성화했습니다.`);
				} catch (e) {
					this.setStatus(`프롬프트 저장 실패: ${e.message}`);
				} finally {
					this.promptSaving = !1;
				}
			},
			async createPromptDraft() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving || ["draft", "validated"].includes(e.status))) {
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template-draft", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: `관리자 페이지에서 v${e.version}을 기준으로 새 초안을 만들었습니다.`
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw n.promptId && (this.selectedPromptTemplateId = n.promptId, await this.loadPromptTemplates({ fresh: !0 })), Error(n.message || n.error || `프롬프트 초안 생성 오류(${t.status})`);
						this.selectedPromptTemplateId = n.prompt?.id || "", await this.loadPromptTemplates({ fresh: !0 }), this.setStatus(`v${n.prompt?.version || ""} 프롬프트 초안을 만들었습니다`);
					} catch (e) {
						this.setStatus(`프롬프트 초안 생성 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
				}
			},
			async validatePromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving || e.status !== "draft")) {
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template-validate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: "관리자 페이지에서 프롬프트 변수와 모델 계약을 검증했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `프롬프트 검증 오류(${t.status})`);
						this.selectedPromptTemplateId = n.prompt?.id || e.id, await this.loadPromptTemplates({ fresh: !0 }), this.setStatus("프롬프트 검증을 완료했습니다. 활성화할 수 있습니다.");
					} catch (e) {
						this.setStatus(`프롬프트 검증 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
				}
			},
			async activatePromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving)) {
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template-activate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: "관리자 페이지에서 활성 프롬프트로 지정했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `프롬프트 활성화 오류(${t.status})`);
						this.selectedPromptTemplateId = n.prompt?.id || e.id, await this.loadPromptTemplates({ fresh: !0 }), this.setStatus("활성 프롬프트로 지정했습니다");
					} catch (e) {
						this.setStatus(`활성 프롬프트 지정 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
				}
			},
			async archivePromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving)) {
					if (e.status === "active") {
						this.setStatus("활성 프롬프트는 보관할 수 없습니다");
						return;
					}
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template-archive", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: "관리자 페이지에서 프롬프트를 보관했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `프롬프트 보관 오류(${t.status})`);
						this.selectedPromptTemplateId = "", await this.loadPromptTemplates({ fresh: !0 }), this.setStatus("프롬프트를 보관했습니다");
					} catch (e) {
						this.setStatus(`프롬프트 보관 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
				}
			},
			async rollbackPromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving || !["inactive", "archived"].includes(e.status))) {
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template-rollback", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: `관리자 페이지에서 v${e.version} 프롬프트로 롤백했습니다.`
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `프롬프트 롤백 오류(${t.status})`);
						this.selectedPromptTemplateId = n.prompt?.id || e.id, await this.loadPromptTemplates({ fresh: !0 }), this.setStatus(`v${n.prompt?.version || e.version} 프롬프트로 롤백했습니다`);
					} catch (e) {
						this.setStatus(`프롬프트 롤백 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
				}
			},
			async loadWizardFormTemplates(e = {}) {
				if (!(this.wizardFormTemplatesLoading && !e.fresh)) {
					this.wizardFormTemplatesLoading = !0, this.wizardFormTemplatesError = "";
					try {
						let e = await fetch("/api/wizard-form-templates?includeArchived=true"), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `템플릿 목록 요청 오류(${e.status})`);
						this.wizardFormTemplates = Array.isArray(t.templates) ? t.templates : [], this.groupedWizardFormTemplates.some((e) => e.templateKey === this.selectedWizardFormTemplateKey) || (this.selectedWizardFormTemplateKey = this.groupedWizardFormTemplates[0]?.templateKey || ""), this.selectedWizardFormTemplateKey ? await this.selectWizardFormTemplate(this.selectedWizardFormTemplateKey, { silent: !0 }) : this.wizardFormTemplateDetail = null;
					} catch (e) {
						this.wizardFormTemplatesError = e.message, this.setStatus(`템플릿 목록을 불러오지 못했습니다: ${e.message}`);
					} finally {
						this.wizardFormTemplatesLoading = !1;
					}
				}
			},
			async selectWizardFormTemplate(e, t = {}) {
				this.selectedWizardFormTemplateKey = e, this.showDuplicateWizardFormTemplateForm = !1, this.duplicateWizardFormTemplateError = "", this.wizardFormTemplateDetail = null;
				let n = this.groupedWizardFormTemplates.find((t) => t.templateKey === e), r = n?.versions.find((e) => e.status === "draft") || n?.primary;
				if (!r) {
					this.wizardFormTemplateDetail = null;
					return;
				}
				await this.loadWizardFormTemplateDetail(r.id, t);
			},
			async loadWizardFormTemplateDetail(e, t = {}) {
				try {
					let t = await fetch(`/api/wizard-form-template?id=${encodeURIComponent(e)}`), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `템플릿 상세 요청 오류(${t.status})`);
					this.wizardFormTemplateDetail = {
						template: n.template,
						sections: n.sections || []
					}, this.wizardFormTemplateEditor = {
						name: n.template.name,
						description: n.template.description,
						isDefault: n.template.isDefault,
						changeNote: "",
						recommendationProfileText: JSON.stringify(n.template.recommendationProfile || {}, null, 2)
					};
					let r = this.wizardFormTemplateDetail.sections.find((e) => e.id === this.selectedWizardFormTemplateSectionId) || this.wizardFormTemplateDetail.sections[0] || null;
					r ? await this.selectWizardFormTemplateSection(r) : (this.selectedWizardFormTemplateSectionId = "", this.wizardFormTemplateSectionItems = []);
				} catch (e) {
					t.silent || this.setStatus(`템플릿 상세를 불러오지 못했습니다: ${e.message}`);
				}
			},
			toggleNewWizardFormTemplateForm() {
				this.showNewWizardFormTemplateForm = !this.showNewWizardFormTemplateForm, this.showDuplicateWizardFormTemplateForm = !1, this.newWizardFormTemplateForm = {
					name: "",
					description: ""
				};
			},
			openDuplicateWizardFormTemplate(e = this.selectedWizardFormTemplateGroup) {
				let t = e?.active || e?.draft || e?.primary || this.wizardFormTemplateDetail?.template;
				t && (this.selectedWizardFormTemplateKey = e?.templateKey || t.templateKey, this.showDuplicateWizardFormTemplateForm = !0, this.duplicateWizardFormTemplateError = "", this.showNewWizardFormTemplateForm = !1, this.duplicateWizardFormTemplateForm = {
					sourceId: t.id,
					name: `${t.name} Copy`,
					description: t.description || ""
				});
			},
			toggleWizardFormTemplateSettings(e) {
				let t = this.expandedWizardFormTemplateSettingsKey !== e.templateKey;
				this.expandedWizardFormTemplateSettingsKey = t ? e.templateKey : "", t && this.selectWizardFormTemplate(e.templateKey, { silent: !0 });
			},
			async createWizardFormTemplate() {
				if (!this.wizardFormTemplateSaving) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-templates", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								name: this.newWizardFormTemplateForm.name,
								description: this.newWizardFormTemplateForm.description
							})
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `템플릿 생성 오류(${e.status})`);
						this.showNewWizardFormTemplateForm = !1, this.selectedWizardFormTemplateKey = t.template.templateKey, await this.loadWizardFormTemplates({ fresh: !0 }), this.setStatus("템플릿 초안을 생성했습니다");
					} catch (e) {
						this.setStatus(`템플릿 생성 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async duplicateWizardFormTemplate() {
				let e = this.wizardFormTemplates.find((e) => e.id === this.duplicateWizardFormTemplateForm.sourceId) || this.wizardFormTemplateDetail?.template;
				if (!(!e || this.wizardFormTemplateSaving)) {
					this.duplicateWizardFormTemplateError = "", this.wizardFormTemplateSaving = !0;
					try {
						let t = await fetch("/api/wizard-form-templates", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								sourceId: e.id,
								name: this.duplicateWizardFormTemplateForm.name,
								description: this.duplicateWizardFormTemplateForm.description
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `템플릿 복사본 생성 오류(${t.status})`);
						this.showDuplicateWizardFormTemplateForm = !1, this.selectedWizardFormTemplateKey = n.template.templateKey, await this.loadWizardFormTemplates({ fresh: !0 }), this.setStatus("템플릿 복사본을 새 초안으로 만들었습니다");
					} catch (e) {
						this.duplicateWizardFormTemplateError = e.message, this.setStatus(`템플릿 복사본 생성 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async createWizardFormTemplateDraft(e = this.wizardFormTemplateDetail?.template) {
				let t = e;
				if (!(!t || this.wizardFormTemplateSaving)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-templates", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: t.id,
								changeNote: "관리자 페이지에서 새 초안을 만들었습니다."
							})
						}), n = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(n.message || n.error || `템플릿 초안 생성 오류(${e.status})`);
						await this.loadWizardFormTemplates({ fresh: !0 }), await this.loadWizardFormTemplateDetail(n.template.id), this.setStatus("템플릿 새 초안을 만들었습니다");
					} catch (e) {
						this.setStatus(`템플릿 초안 생성 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async editWizardFormTemplate(e) {
				if (!e || this.wizardFormTemplateSaving) return;
				if (this.selectedWizardFormTemplateKey = e.templateKey, this.expandedWizardFormTemplateSettingsKey = e.templateKey, e.draft) {
					await this.loadWizardFormTemplateDetail(e.draft.id);
					return;
				}
				let t = e.active || e.inactive || e.primary;
				t && await this.createWizardFormTemplateDraft(t);
			},
			async saveWizardFormTemplate() {
				let e = this.wizardFormTemplateDetail?.template;
				if (!(!e || e.status !== "draft" || this.wizardFormTemplateSaving)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let t = {};
						try {
							t = JSON.parse(this.wizardFormTemplateEditor.recommendationProfileText || "{}");
						} catch {
							throw Error("추천 메타데이터는 올바른 JSON 형식이어야 합니다.");
						}
						let n = await fetch("/api/wizard-form-template", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								name: this.wizardFormTemplateEditor.name,
								description: this.wizardFormTemplateEditor.description,
								isDefault: this.wizardFormTemplateEditor.isDefault,
								changeNote: this.wizardFormTemplateEditor.changeNote,
								recommendationProfile: t
							})
						}), r = await n.json().catch(() => ({}));
						if (!n.ok) throw Error(r.message || r.error || `템플릿 저장 오류(${n.status})`);
						await this.loadWizardFormTemplates({ fresh: !0 }), await this.loadWizardFormTemplateDetail(r.template.id), this.setStatus("템플릿 정보를 저장했습니다");
					} catch (e) {
						this.setStatus(`템플릿 저장 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async activateWizardFormTemplate(e = null) {
				let t = e || this.wizardFormTemplateDetail?.template;
				if (!(!t || this.wizardFormTemplateSaving)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-template-activate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: t.id,
								changeNote: "관리자 페이지에서 템플릿을 활성화했습니다."
							})
						}), n = await e.json().catch(() => ({}));
						if (!e.ok) {
							let t = (Array.isArray(n.errors) ? n.errors : []).map((e) => {
								let t = this.wizardFormTemplateDetail?.sections?.find((t) => t.sectionKey === e.path);
								return `${t ? `${t.sectionName || t.sectionKey} v${t.sectionVersion || "?"} · ${this.wizardSectionStatusLabel(t.sectionStatus)}` : e.path || "Section"}: ${e.message || e.code}`;
							});
							throw Error(t.length ? `${n.error || "Form template validation failed"} — ${t.join(" / ")}` : n.message || n.error || `템플릿 활성화 오류(${e.status})`);
						}
						await this.loadWizardFormTemplates({ fresh: !0 });
						let r = Number(n.layoutIdentity?.layoutRevision || 1);
						this.setStatus(`템플릿 v${n.template?.version || t.version} · 레이아웃 r${r}을 활성화했습니다`);
					} catch (e) {
						this.setStatus(`템플릿 활성화 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async deactivateWizardFormTemplate(e = null) {
				let t = e || this.wizardFormTemplateDetail?.template;
				if (!(!t || t.status !== "active" || this.wizardFormTemplateSaving)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-template-deactivate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: t.id,
								changeNote: "관리자 페이지에서 템플릿을 비활성화했습니다."
							})
						}), n = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(n.message || n.error || `템플릿 비활성화 오류(${e.status})`);
						await this.loadWizardFormTemplates({ fresh: !0 }), this.setStatus(`템플릿 v${n.template?.version || t.version}을 비활성화했습니다`);
					} catch (e) {
						this.setStatus(`템플릿 비활성화 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async toggleWizardFormTemplateActive(e, t) {
				if (!(!e || this.wizardFormTemplateSaving)) {
					if (t) {
						let t = e.draft || e.inactive || e.primary;
						t && await this.activateWizardFormTemplate(t);
						return;
					}
					e.active && await this.deactivateWizardFormTemplate(e.active);
				}
			},
			async deleteWizardFormTemplate(e) {
				let t = e?.draft || e?.inactive || e?.primary || null;
				if (!t || this.wizardFormTemplateSaving) return;
				if (e.active || e.versions.some((e) => e.isDefault)) {
					this.setStatus("활성 또는 기본 템플릿은 삭제할 수 없습니다. 먼저 다른 템플릿을 활성화해 주세요.");
					return;
				}
				let n = e.versions.length;
				if (window.confirm(`${t.name} 템플릿을 영구 삭제할까요? ${n}개 버전과 저장된 레이아웃이 함께 삭제됩니다. 진행 중인 AI 디자인 작업은 취소되며 복구할 수 없습니다.`)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch(`/api/wizard-form-template-delete?id=${encodeURIComponent(t.id)}`, { method: "DELETE" }), r = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(r.message || r.error || `템플릿 삭제 오류(${e.status})`);
						this.expandedWizardFormTemplateSettingsKey = "", await this.loadWizardFormTemplates({ fresh: !0 });
						let i = Number(r.cancelledDesignRunCount || 0);
						this.setStatus(`${t.name} 템플릿과 ${Number(r.deletedVersionCount || n)}개 버전을 삭제했습니다${i ? ` · AI 디자인 작업 ${i}건 취소` : ""}`);
					} catch (e) {
						this.setStatus(`템플릿 삭제 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async archiveWizardFormTemplate() {
				let e = this.wizardFormTemplateDetail?.template;
				if (!(!e || this.wizardFormTemplateSaving)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let t = await fetch("/api/wizard-form-template-archive", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: "관리자 페이지에서 템플릿을 보관했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `템플릿 보관 오류(${t.status})`);
						await this.loadWizardFormTemplates({ fresh: !0 }), this.setStatus("템플릿 버전을 보관했습니다");
					} catch (e) {
						this.setStatus(`템플릿 보관 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSaving = !1;
					}
				}
			},
			async selectWizardFormTemplateSection(e) {
				e && (this.selectedWizardFormTemplateSectionId = e.id, this.wizardFormTemplateSectionEditor = {
					name: e.sectionName || "",
					description: e.sectionDescription || "",
					isRequired: e.isRequired,
					isVisible: e.isVisible,
					userReorderAllowed: e.userReorderAllowed,
					fixedPosition: e.fixedPosition || "",
					aiDesign: {
						enabled: e.aiDesign?.enabled !== !1,
						allowedLayoutVariants: Array.isArray(e.aiDesign?.allowedLayoutVariants) ? [...e.aiDesign.allowedLayoutVariants] : [
							"split-left",
							"split-right",
							"centered-hero"
						],
						allowSectionBackground: e.aiDesign?.allowSectionBackground !== !1,
						imageTarget: e.aiDesign?.imageTarget === "item" ? "item" : "section-background",
						imageTargetItemKeys: Array.isArray(e.aiDesign?.imageTargetItemKeys) ? [...e.aiDesign.imageTargetItemKeys] : [],
						imageAspectRatio: e.aiDesign?.imageAspectRatio || "16:9",
						backgroundPromptText: e.aiDesign?.backgroundPromptText || ""
					}
				}, this.wizardFormTemplateItemEditorOpenId = "", await this.loadWizardFormTemplateSectionItems(e));
			},
			async toggleWizardFormTemplateSection(e) {
				if (e) {
					if (this.expandedWizardFormTemplateSectionId === e.id) {
						this.expandedWizardFormTemplateSectionId = "";
						return;
					}
					this.expandedWizardFormTemplateSectionId = e.id, this.selectedWizardFormTemplateSectionId !== e.id && await this.selectWizardFormTemplateSection(e);
				}
			},
			async loadWizardFormTemplateSectionItems(e = this.selectedWizardFormTemplateSection) {
				let t = e?.sectionId || this.selectedWizardFormTemplateSectionSource?.id;
				if (!t) {
					this.wizardFormTemplateSectionItems = [];
					return;
				}
				this.wizardFormTemplateSectionItemsLoading = !0;
				try {
					let e = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(t)}`), n = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(n.message || n.error || `섹션 Item 요청 오류(${e.status})`);
					this.wizardFormTemplateSectionItems = Array.isArray(n.items) ? n.items : [];
				} catch (e) {
					this.wizardFormTemplateSectionItems = [], this.setStatus(`섹션 Item을 불러오지 못했습니다: ${e.message}`);
				} finally {
					this.wizardFormTemplateSectionItemsLoading = !1;
				}
			},
			async addWizardFormTemplateSection() {
				let e = this.wizardFormTemplateDetail?.template;
				if (!(!e || !this.newWizardFormTemplateSectionForm.sectionId || this.wizardFormTemplateSectionSaving)) {
					this.wizardFormTemplateSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-form-template-sections", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								templateId: e.id,
								sectionId: this.newWizardFormTemplateSectionForm.sectionId
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `템플릿 Section 추가 오류(${t.status})`);
						this.selectedWizardFormTemplateSectionId = n.section.id, this.expandedWizardFormTemplateSectionId = n.section.id, this.showNewWizardFormTemplateSectionForm = !1, this.newWizardFormTemplateSectionForm = { sectionId: "" }, await this.loadWizardFormTemplateDetail(e.id), this.setStatus("템플릿에 Section을 추가했습니다");
					} catch (e) {
						this.setStatus(`템플릿 Section 추가 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSectionSaving = !1;
					}
				}
			},
			async saveWizardFormTemplateSection() {
				let e = this.selectedWizardFormTemplateSection;
				if (!(!e || !this.wizardFormTemplateCanEdit || this.wizardFormTemplateSectionSaving)) {
					this.wizardFormTemplateSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-form-template-sections", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								isRequired: this.wizardFormTemplateSectionEditor.isRequired,
								isVisible: this.wizardFormTemplateSectionEditor.isVisible,
								userReorderAllowed: this.wizardFormTemplateSectionEditor.userReorderAllowed,
								fixedPosition: this.wizardFormTemplateSectionEditor.fixedPosition,
								aiDesign: this.wizardFormTemplateSectionEditor.aiDesign
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `템플릿 Section 저장 오류(${t.status})`);
						await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id), this.setStatus("템플릿 Section 설정을 저장했습니다");
					} catch (e) {
						this.setStatus(`템플릿 Section 저장 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSectionSaving = !1;
					}
				}
			},
			async removeWizardFormTemplateSection(e = null) {
				let t = e || this.selectedWizardFormTemplateSection;
				if (!(!t || !this.wizardFormTemplateCanEdit || this.wizardFormTemplateSectionSaving) && window.confirm(`템플릿에서 ${t.sectionName || t.sectionKey} Section을 제외할까요?`)) {
					this.wizardFormTemplateSectionSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-template-sections", {
							method: "DELETE",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ id: t.id })
						}), n = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(n.message || n.error || `템플릿 Section 제외 오류(${e.status})`);
						this.selectedWizardFormTemplateSectionId === t.id && (this.selectedWizardFormTemplateSectionId = "", this.expandedWizardFormTemplateSectionId = ""), await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id), this.setStatus("템플릿에서 Section을 제외했습니다");
					} catch (e) {
						this.setStatus(`템플릿 Section 제외 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSectionSaving = !1;
					}
				}
			},
			wizardFormTemplateSectionCanReorder(e) {
				return !!(this.wizardFormTemplateCanEdit && !e?.fixedPosition);
			},
			async moveWizardFormTemplateSection(e, t) {
				if (!this.wizardFormTemplateSectionCanReorder(e) || this.wizardFormTemplateSectionSaving) return;
				let n = this.wizardFormTemplateDetail.sections.filter((e) => !e.fixedPosition), r = n.findIndex((t) => t.id === e.id), i = r + t;
				if (r < 0 || i < 0 || i >= n.length) return;
				let a = [...n], [o] = a.splice(r, 1);
				a.splice(i, 0, o);
				let s = [...this.wizardFormTemplateDetail.sections], c = [...a];
				this.wizardFormTemplateDetail.sections = s.map((e) => e.fixedPosition ? e : c.shift()), this.wizardFormTemplateSectionSaving = !0;
				try {
					let e = await fetch("/api/wizard-form-template-sections-order", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							templateId: this.wizardFormTemplateDetail.template.id,
							sectionIds: a.map((e) => e.sectionId)
						})
					}), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.message || t.error || `템플릿 Section 순서 오류(${e.status})`);
					this.wizardFormTemplateDetail.sections = t.sections || this.wizardFormTemplateDetail.sections, this.setStatus("템플릿 Section 순서를 저장했습니다");
				} catch (e) {
					this.wizardFormTemplateDetail.sections = s, this.setStatus(`템플릿 Section 순서 저장 실패: ${e.message}`);
				} finally {
					this.wizardFormTemplateSectionSaving = !1;
				}
			},
			startWizardFormTemplateSectionDrag(e, t) {
				if (!this.wizardFormTemplateSectionCanReorder(e) || this.wizardFormTemplateSectionSaving) {
					t.preventDefault();
					return;
				}
				this.draggedWizardFormTemplateSectionKey = e.sectionKey, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.sectionKey);
			},
			dragOverWizardFormTemplateSection(e, t) {
				if (!this.draggedWizardFormTemplateSectionKey || this.draggedWizardFormTemplateSectionKey === e.sectionKey || !this.wizardFormTemplateSectionCanReorder(e)) return;
				let n = t.currentTarget.getBoundingClientRect();
				this.wizardFormTemplateSectionDropTargetKey = e.sectionKey, this.wizardFormTemplateSectionDropPosition = t.clientY < n.top + n.height / 2 ? "before" : "after", t.dataTransfer.dropEffect = "move";
			},
			stopWizardFormTemplateSectionDrag() {
				this.draggedWizardFormTemplateSectionKey = "", this.wizardFormTemplateSectionDropTargetKey = "", this.wizardFormTemplateSectionDropPosition = "";
			},
			async dropWizardFormTemplateSection(e) {
				let t = this.draggedWizardFormTemplateSectionKey, n = this.wizardFormTemplateSectionDropPosition || "before";
				if (this.stopWizardFormTemplateSectionDrag(), !t || t === e.sectionKey) return;
				let r = this.wizardFormTemplateDetail.sections.filter((e) => !e.fixedPosition), i = r.find((e) => e.sectionKey === t), a = r.filter((e) => e.sectionKey !== t), o = a.findIndex((t) => t.sectionKey === e.sectionKey);
				if (!i || o < 0) return;
				a.splice(o + +(n === "after"), 0, i);
				let s = [...this.wizardFormTemplateDetail.sections], c = [...a];
				this.wizardFormTemplateDetail.sections = s.map((e) => e.fixedPosition ? e : c.shift()), this.setStatus("템플릿 Section 순서를 저장하는 중입니다"), this.wizardFormTemplateSectionSaving = !0;
				try {
					let e = await fetch("/api/wizard-form-template-sections-order", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							templateId: this.wizardFormTemplateDetail.template.id,
							sectionIds: a.map((e) => e.sectionId)
						})
					}), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.message || t.error || `템플릿 Section 순서 오류(${e.status})`);
					this.wizardFormTemplateDetail.sections = t.sections || this.wizardFormTemplateDetail.sections, this.setStatus("템플릿 Section 순서를 저장했습니다");
				} catch (e) {
					this.wizardFormTemplateDetail.sections = s, this.setStatus(`템플릿 Section 순서 저장 실패: ${e.message}`);
				} finally {
					this.wizardFormTemplateSectionSaving = !1;
				}
			},
			newWizardFormTemplateItem(e = null) {
				return {
					id: e?.id || "",
					itemKey: e?.itemKey || "",
					name: e?.name || "",
					isVisibleInWizard: e?.isVisibleInWizard ?? !0,
					isRequired: e?.isRequired ?? !1,
					userReorderAllowed: e?.userReorderAllowed ?? !0,
					sortOrder: e?.sortOrder ?? this.wizardFormTemplateSectionItems.length * 10,
					fieldKind: e?.fieldKind || "text",
					textType: e?.textType || "title",
					image: e?.image ? {
						...e.image,
						allowedSources: [...e.image.allowedSources || []]
					} : {
						allowedSources: [],
						promptText: "",
						descriptionEnabled: !1,
						altTextRequired: !1,
						aspectRatio: "",
						maxSizeKb: ""
					},
					ctaUtm: e?.ctaUtm ? { ...e.ctaUtm } : {
						source: "",
						medium: "",
						campaign: "",
						content: "",
						term: ""
					},
					isLocked: e?.isLocked ?? !1,
					lockedValueText: e?.lockedValue === null || e?.lockedValue === void 0 ? "" : JSON.stringify(e.lockedValue, null, 2)
				};
			},
			openNewWizardFormTemplateItemEditor() {
				this.wizardFormTemplateItemEditor = this.newWizardFormTemplateItem(), this.wizardFormTemplateItemEditorOpenId = "new";
			},
			openWizardFormTemplateItemEditor(e) {
				if (this.wizardFormTemplateItemEditorOpenId === e.id) {
					this.wizardFormTemplateItemEditorOpenId = "", this.wizardFormTemplateItemEditor = null;
					return;
				}
				this.wizardFormTemplateItemEditor = this.newWizardFormTemplateItem(e), this.wizardFormTemplateItemEditorOpenId = e.id;
			},
			toggleWizardFormTemplateItemImageSource(e) {
				let t = this.wizardFormTemplateItemEditor.image.allowedSources, n = t.indexOf(e);
				n >= 0 ? t.splice(n, 1) : t.push(e);
			},
			async prepareWizardFormTemplateSectionDraft() {
				let e = this.selectedWizardFormTemplateSection;
				if (!e?.sectionId) throw Error("선택한 섹션의 원본 연결이 없습니다. DB 마이그레이션 021을 적용해 주세요.");
				if (e.sectionStatus === "draft") return {
					sectionId: e.sectionId,
					items: this.wizardFormTemplateSectionItems
				};
				let t = await fetch("/api/wizard-form-template-sections", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: e.id })
				}), n = await t.json().catch(() => ({}));
				if (!t.ok) throw Error(n.message || n.error || `편집용 Section 준비 오류(${t.status})`);
				let r = n.section?.sectionId;
				if (!r) throw Error("편집용 Section 연결을 확인할 수 없습니다");
				let i = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(r)}`), a = await i.json().catch(() => ({}));
				if (!i.ok) throw Error(a.message || a.error || `편집용 Item 요청 오류(${i.status})`);
				let o = Array.isArray(a.items) ? a.items : [];
				this.wizardFormTemplateSectionItems = o;
				let s = this.wizardFormTemplateDetail.sections.findIndex((t) => t.id === e.id);
				return s >= 0 && this.wizardFormTemplateDetail.sections.splice(s, 1, n.section), {
					sectionId: r,
					items: o
				};
			},
			async saveWizardFormTemplateItem() {
				let e = this.wizardFormTemplateItemEditor, t = this.wizardFormTemplateItemEditorOpenId === "new";
				if (!e || this.wizardFormTemplateSectionSaving) return;
				let n = null;
				if (e.isLocked && e.lockedValueText.trim()) try {
					n = JSON.parse(e.lockedValueText);
				} catch (e) {
					this.setStatus(`고정값 JSON 형식 오류: ${e.message}`);
					return;
				}
				this.wizardFormTemplateSectionSaving = !0;
				try {
					let r = await this.prepareWizardFormTemplateSectionDraft();
					e.id = r.items.find((t) => t.itemKey === e.itemKey)?.id || "";
					let i = await fetch("/api/wizard-content-section-items", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							...e,
							sectionId: r.sectionId,
							fieldKind: e.fieldKind,
							image: { ...e.image },
							lockedValue: n
						})
					}), a = await i.json().catch(() => ({}));
					if (!i.ok) throw Error(a.message || a.error || `컴포넌트 저장 오류(${i.status})`);
					await this.loadWizardFormTemplateSectionItems(), t ? (this.openNewWizardFormTemplateItemEditor(), this.setStatus("섹션 컴포넌트를 저장했습니다. 다음 컴포넌트를 계속 추가할 수 있습니다")) : (this.wizardFormTemplateItemEditorOpenId = "", this.wizardFormTemplateItemEditor = null, this.setStatus("섹션 컴포넌트 변경사항을 저장했습니다"));
				} catch (e) {
					this.setStatus(`컴포넌트 저장 실패: ${e.message}`);
				} finally {
					this.wizardFormTemplateSectionSaving = !1;
				}
			},
			async deleteWizardFormTemplateItem(e) {
				if (!(this.wizardFormTemplateSectionSaving || !window.confirm(`${e.name} 아이템을 삭제할까요?`))) {
					this.wizardFormTemplateSectionSaving = !0;
					try {
						let t = await this.prepareWizardFormTemplateSectionDraft(), n = t.items.find((t) => t.itemKey === e.itemKey);
						if (!n) throw Error("삭제할 아이템을 편집용 Section에서 찾을 수 없습니다");
						let r = await fetch(`/api/wizard-content-section-items?id=${encodeURIComponent(n.id)}&sectionId=${encodeURIComponent(t.sectionId)}`, { method: "DELETE" }), i = await r.json().catch(() => ({}));
						if (!r.ok) throw Error(i.message || i.error || `컴포넌트 삭제 오류(${r.status})`);
						await this.loadWizardFormTemplateSectionItems(), this.wizardFormTemplateItemEditorOpenId = "", this.setStatus("섹션 컴포넌트를 삭제했습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 삭제 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSectionSaving = !1;
					}
				}
			},
			startWizardFormTemplateItemDrag(e, t) {
				if (this.wizardFormTemplateSectionSaving) {
					t.preventDefault();
					return;
				}
				this.draggedWizardFormTemplateItemId = e.id, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			dragOverWizardFormTemplateItem(e, t) {
				if (!this.draggedWizardFormTemplateItemId || this.draggedWizardFormTemplateItemId === e.id) return;
				let n = t.currentTarget.getBoundingClientRect();
				this.wizardFormTemplateItemDropTargetId = e.id, this.wizardFormTemplateItemDropPosition = t.clientY < n.top + n.height / 2 ? "before" : "after", t.dataTransfer.dropEffect = "move";
			},
			stopWizardFormTemplateItemDrag() {
				this.draggedWizardFormTemplateItemId = "", this.wizardFormTemplateItemDropTargetId = "", this.wizardFormTemplateItemDropPosition = "";
			},
			async dropWizardFormTemplateItem(e) {
				let t = this.draggedWizardFormTemplateItemId, n = this.wizardFormTemplateItemDropPosition || "before";
				if (this.stopWizardFormTemplateItemDrag(), !t || t === e.id || this.wizardFormTemplateSectionSaving) return;
				let r = [...this.wizardFormTemplateSectionItems], i = r.find((e) => e.id === t), a = r.filter((e) => e.id !== t), o = a.findIndex((t) => t.id === e.id);
				if (!(!i || o < 0)) {
					a.splice(o + +(n === "after"), 0, i), this.wizardFormTemplateSectionItems = a, this.setStatus("Section Item 순서를 저장하는 중입니다"), this.wizardFormTemplateSectionSaving = !0;
					try {
						let e = await this.prepareWizardFormTemplateSectionDraft(), t = new Map(e.items.map((e) => [e.itemKey, e])), n = a.map((e) => t.get(e.itemKey));
						if (n.some((e) => !e)) throw Error("아이템 순서 정보가 최신 상태와 일치하지 않습니다");
						let r = await fetch("/api/wizard-content-section-items-order", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								sectionId: e.sectionId,
								itemIds: n.map((e) => e.id)
							})
						}), i = await r.json().catch(() => ({}));
						if (!r.ok) throw Error(i.message || i.error || `아이템 순서 오류(${r.status})`);
						this.wizardFormTemplateSectionItems = i.items, this.setStatus("Section Item 순서를 저장했습니다");
					} catch (e) {
						this.wizardFormTemplateSectionItems = r, this.setStatus(`아이템 순서 저장 실패: ${e.message}`);
					} finally {
						this.wizardFormTemplateSectionSaving = !1;
					}
				}
			},
			async loadWizardSections(e = {}) {
				if (!(this.wizardSectionsLoading && !e.fresh)) {
					this.wizardSectionsLoading = !0, this.wizardSectionsError = "";
					try {
						let e = await fetch("/api/wizard-content-sections?includeArchived=true"), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `섹션 목록 요청 오류(${e.status})`);
						this.wizardSections = Array.isArray(t.sections) ? t.sections : [], this.groupedWizardSections.some((e) => e.sectionKey === this.selectedWizardSectionKey) || (this.selectedWizardSectionKey = this.groupedWizardSections[0]?.sectionKey || ""), this.selectedWizardSectionKey ? await this.selectWizardSection(this.selectedWizardSectionKey, { silent: !0 }) : (this.wizardSectionDetail = null, this.wizardSectionUsage = []);
					} catch (e) {
						this.wizardSectionsError = e.message, this.setStatus(`Wizard 섹션 목록을 불러오지 못했습니다: ${e.message}`);
					} finally {
						this.wizardSectionsLoading = !1;
					}
				}
			},
			async selectWizardSection(e, t = {}) {
				this.selectedWizardSectionKey = e;
				let n = this.groupedWizardSections.find((t) => t.sectionKey === e), r = String(t.sectionId || "").trim(), i = r ? n?.versions.find((e) => e.id === r) : n?.versions.find((e) => e.status === "draft") || n?.primary;
				if (!i) {
					this.wizardSectionDetail = null;
					return;
				}
				await this.loadWizardSectionDetail(i.id, t);
			},
			async loadWizardSectionDetail(e, t = {}) {
				let n = ++this.wizardSectionDetailRequestRevision;
				this.wizardSectionDetailLoading = !0, this.wizardSectionDetail = null;
				try {
					let t = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(e)}`), r = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(r.message || r.error || `섹션 상세 요청 오류(${t.status})`);
					if (n !== this.wizardSectionDetailRequestRevision) return;
					this.wizardSectionDetail = {
						section: r.section,
						items: r.items || [],
						histories: r.histories || []
					}, await this.loadWizardSectionUsage(r.section), this.wizardSectionFieldsEditor = {
						name: r.section.name,
						description: r.section.description,
						isRequired: r.section.isRequired,
						orderChangeAllowed: r.section.orderChangeAllowed,
						fixedPosition: r.section.fixedPosition || "",
						isVisibleInWizard: r.section.isVisibleInWizard,
						compositionScope: r.section.compositionScope || "template",
						sectionRole: r.section.sectionRole || "content",
						compositionPolicy: {
							selectionPolicy: r.section.compositionPolicy?.selectionPolicy || "optional",
							allowedMarkets: [...r.section.compositionPolicy?.allowedMarkets || []],
							allowedPromotionPurposes: [...r.section.compositionPolicy?.allowedPromotionPurposes || []],
							aiEditable: r.section.compositionPolicy?.aiEditable !== !1,
							contentLocked: r.section.compositionPolicy?.contentLocked === !0,
							layoutLocked: r.section.compositionPolicy?.layoutLocked === !0,
							duplicatePolicy: r.section.compositionPolicy?.duplicatePolicy === "limited" ? "limited" : "forbidden",
							maxInstances: Number(r.section.compositionPolicy?.maxInstances || 1),
							allowedLayoutVariants: [...r.section.compositionPolicy?.allowedLayoutVariants || []],
							allowedMotionPresets: [...r.section.compositionPolicy?.allowedMotionPresets || []]
						},
						aiDesign: {
							enabled: r.section.aiDesign?.enabled !== !1,
							allowedLayoutVariants: Array.isArray(r.section.aiDesign?.allowedLayoutVariants) ? [...r.section.aiDesign.allowedLayoutVariants] : [
								"split-left",
								"split-right",
								"centered-hero"
							],
							allowSectionBackground: r.section.aiDesign?.allowSectionBackground !== !1,
							imageTarget: r.section.aiDesign?.imageTarget === "item" ? "item" : "section-background",
							imageTargetItemKeys: Array.isArray(r.section.aiDesign?.imageTargetItemKeys) ? [...r.section.aiDesign.imageTargetItemKeys] : [],
							imageAspectRatio: r.section.aiDesign?.imageAspectRatio || "16:9",
							backgroundPromptText: r.section.aiDesign?.backgroundPromptText || ""
						},
						changeNote: ""
					}, this.wizardItemEditorOpenId = "";
				} catch (e) {
					n === this.wizardSectionDetailRequestRevision && !t.silent && this.setStatus(`섹션 상세를 불러오지 못했습니다: ${e.message}`);
				} finally {
					n === this.wizardSectionDetailRequestRevision && (this.wizardSectionDetailLoading = !1);
				}
			},
			async loadWizardSectionUsage(e = this.wizardSectionDetail?.section) {
				let t = String(e?.id || "").trim();
				if (!t) {
					this.wizardSectionUsage = [];
					return;
				}
				this.wizardSectionUsageLoading = !0;
				try {
					let e = await fetch(`/api/wizard-content-section-usage?sectionId=${encodeURIComponent(t)}`), n = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(n.message || n.error || `섹션 사용처 요청 오류(${e.status})`);
					this.wizardSectionUsage = Array.isArray(n.templates) ? n.templates : [];
				} catch (e) {
					this.wizardSectionUsage = [], this.setStatus(`섹션 사용처를 불러오지 못했습니다: ${e.message}`);
				} finally {
					this.wizardSectionUsageLoading = !1;
				}
			},
			wizardSectionStatusLabel(e) {
				return this.promptStatusLabel(e);
			},
			wizardSectionSelectionPolicyOptions() {
				return [
					{
						value: "required",
						label: "항상 포함",
						description: "모든 AI 페이지 구성에 반드시 포함합니다."
					},
					{
						value: "required-by-market",
						label: "마켓 조건부",
						description: "지정한 마켓에서만 반드시 포함합니다."
					},
					{
						value: "required-by-purpose",
						label: "목적 조건부",
						description: "지정한 프로모션 목적에서만 반드시 포함합니다."
					},
					{
						value: "recommended",
						label: "우선 추천",
						description: "AI가 적합성을 판단해 우선적으로 포함합니다."
					},
					{
						value: "optional",
						label: "선택 가능",
						description: "필요한 경우에만 AI가 선택할 수 있습니다."
					}
				];
			},
			wizardSectionSelectionPolicyLabel(e) {
				return this.wizardSectionSelectionPolicyOptions().find((t) => t.value === e)?.label || e || "미지정";
			},
			wizardSectionRoleOptions() {
				return [
					["header", "헤더"],
					["footer", "푸터"],
					["terms", "이용약관"],
					["legal", "법적 고지"],
					["responsible-gaming", "책임 게임"],
					["hero", "키비주얼·히어로"],
					["benefit", "혜택"],
					["content", "본문 콘텐츠"],
					["cta", "행동 유도"],
					["notice", "안내·주의사항"]
				].map(([e, t]) => ({
					value: e,
					label: t
				}));
			},
			applyWizardSectionRoleDefaults() {
				this.wizardSectionFieldsEditor.sectionRole === "header" ? (this.wizardSectionFieldsEditor.fixedPosition = "top", this.wizardSectionFieldsEditor.isRequired = !0, this.wizardSectionFieldsEditor.orderChangeAllowed = !1, this.wizardSectionFieldsEditor.compositionPolicy.selectionPolicy = "required", this.wizardSectionFieldsEditor.compositionPolicy.layoutLocked = !0) : this.wizardSectionFieldsEditor.fixedPosition === "top" && (this.wizardSectionFieldsEditor.fixedPosition = "", this.wizardSectionFieldsEditor.orderChangeAllowed = !0);
			},
			wizardSectionContentModeOptions() {
				return [
					{
						value: "editable",
						label: "AI 수정 허용",
						description: "AI가 입력 콘텐츠를 문맥에 맞게 작성·수정할 수 있습니다."
					},
					{
						value: "manual-only",
						label: "관리자 입력만",
						description: "AI는 수정하지 않고 관리자와 사용자가 입력한 값을 사용합니다."
					},
					{
						value: "locked",
						label: "고정 콘텐츠",
						description: "저장된 콘텐츠를 그대로 유지하고 다른 입력도 허용하지 않습니다."
					}
				];
			},
			wizardSectionContentMode() {
				let e = this.wizardSectionFieldsEditor.compositionPolicy;
				return e.contentLocked ? "locked" : e.aiEditable ? "editable" : "manual-only";
			},
			setWizardSectionContentMode(e) {
				let t = this.wizardSectionFieldsEditor.compositionPolicy;
				t.aiEditable = e === "editable", t.contentLocked = e === "locked";
			},
			wizardSectionCompositionSummary() {
				let e = this.wizardSectionFieldsEditor, t = e.compositionPolicy, n = [{
					template: "현재 템플릿 전용",
					registry: "AI Registry 후보",
					shared: "공용 섹션 프리셋"
				}[e.compositionScope] || e.compositionScope, this.wizardSectionSelectionPolicyLabel(t.selectionPolicy)];
				t.selectionPolicy === "required-by-market" && n.push(t.allowedMarkets.length ? `${t.allowedMarkets.join(", ")} 마켓` : "모든 마켓"), t.selectionPolicy === "required-by-purpose" && n.push(t.allowedPromotionPurposes.length ? `${t.allowedPromotionPurposes.join(", ")} 목적` : "모든 목적"), n.push(t.duplicatePolicy === "limited" ? `최대 ${Math.max(2, Number(t.maxInstances || 2))}회` : "페이지당 1회");
				let r = {
					editable: "AI 콘텐츠 수정 허용",
					"manual-only": "관리자 입력 사용",
					locked: "콘텐츠 고정"
				}[this.wizardSectionContentMode()];
				return n.push(r), n.push(t.layoutLocked ? "기본 레이아웃 프리셋 유지" : "AI가 레이아웃 프리셋 선택"), n.join(" · ");
			},
			fieldKindLabel(e) {
				return {
					text: "텍스트",
					image: "이미지",
					cta: "CTA 버튼"
				}[e] || e;
			},
			textTypeLabel(e) {
				return {
					title: "Title",
					remark: "remark (참고)",
					multi: "Multi (설명)"
				}[e] || e || "";
			},
			imageSourceLabel(e) {
				return {
					file: "파일첨부",
					url: "URL첨부",
					ai: "AI 생성"
				}[e] || e;
			},
			wizardSectionCanReorder(e) {
				let t = e?.versions?.find((e) => e.status === "active") || e?.primary;
				return !!(t?.status === "active" && t.orderChangeAllowed && !t.fixedPosition);
			},
			startWizardSectionDrag(e, t) {
				if (!this.wizardSectionCanReorder(e) || this.wizardSectionOrderSaving) {
					t.preventDefault();
					return;
				}
				this.draggedWizardSectionKey = e.sectionKey, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.sectionKey);
			},
			stopWizardSectionDrag() {
				this.draggedWizardSectionKey = "", this.wizardSectionDropTargetKey = "", this.wizardSectionDropPosition = "";
			},
			dragOverWizardSection(e, t) {
				if (!this.draggedWizardSectionKey || this.draggedWizardSectionKey === e.sectionKey || !this.wizardSectionCanReorder(e)) return;
				let n = t.currentTarget.getBoundingClientRect();
				this.wizardSectionDropTargetKey = e.sectionKey, this.wizardSectionDropPosition = t.clientY < n.top + n.height / 2 ? "before" : "after", t.dataTransfer.dropEffect = "move";
			},
			async dropWizardSection(e) {
				let t = this.draggedWizardSectionKey, n = this.wizardSectionDropPosition || "before";
				if (this.draggedWizardSectionKey = "", this.wizardSectionDropTargetKey = "", this.wizardSectionDropPosition = "", !t || t === e?.sectionKey || !this.wizardSectionCanReorder(e)) return;
				let r = this.groupedWizardSections.filter((e) => this.wizardSectionCanReorder(e)), i = r.findIndex((e) => e.sectionKey === t);
				if (i < 0) return;
				let a = r[i], o = r.filter((e) => e.sectionKey !== t), s = o.findIndex((t) => t.sectionKey === e.sectionKey);
				if (s < 0) return;
				o.splice(s + +(n === "after"), 0, a);
				let c = o.map((e) => e.sectionKey), l = this.wizardSections, u = new Map(c.map((e, t) => [e, t * 10]));
				this.wizardSections = this.wizardSections.map((e) => u.has(e.sectionKey) ? {
					...e,
					sortOrder: u.get(e.sectionKey)
				} : e), this.wizardSectionOrderSaving = !0;
				try {
					let e = await fetch("/api/wizard-content-sections-order", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ sectionKeys: c })
					}), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.message || t.error || `섹션 순서 저장 오류(${e.status})`);
					this.wizardSections = Array.isArray(t.sections) ? t.sections : this.wizardSections, await this.selectWizardSection(this.selectedWizardSectionKey, { silent: !0 }), this.setStatus("섹션 순서를 저장했습니다");
				} catch (e) {
					this.wizardSections = l, await this.loadWizardSections({ fresh: !0 }), this.setStatus(`섹션 순서 저장 실패: ${e.message}`);
				} finally {
					this.wizardSectionOrderSaving = !1;
				}
			},
			toggleNewWizardSectionForm() {
				this.showNewWizardSectionForm = !this.showNewWizardSectionForm, this.showNewWizardSectionForm && (this.newWizardSectionForm = {
					sectionKey: "",
					name: "",
					description: "",
					compositionScope: "shared"
				});
			},
			async createWizardSection() {
				if (!this.wizardSectionSaving) {
					this.wizardSectionSaving = !0;
					try {
						let e = await fetch("/api/wizard-content-sections", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(this.newWizardSectionForm)
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `Section Preset 생성 오류(${e.status})`);
						let n = t.section;
						await this.loadWizardSections({ fresh: !0 }), await this.selectWizardSection(n.sectionKey), this.newWizardSectionForm = {
							sectionKey: "",
							name: "",
							description: "",
							compositionScope: "shared"
						}, this.showNewWizardSectionForm = !1, this.setStatus(`"${n.name}" Section Preset 초안을 생성했습니다.`);
					} catch (e) {
						this.setStatus(`Section Preset 생성 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			async createWizardSectionDraft() {
				let e = this.selectedWizardGroup?.primary;
				if (!(!e || this.wizardSectionSaving)) {
					this.wizardSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-content-sections", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								changeNote: "관리자 페이지에서 새 초안을 만들었습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `초안 생성 오류(${t.status})`);
						await this.loadWizardSections({ fresh: !0 }), await this.loadWizardSectionDetail(n.section.id), this.setStatus("새 초안을 만들었습니다");
					} catch (e) {
						this.setStatus(`초안 생성 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			async saveWizardSectionFields() {
				let e = this.wizardSectionDetail?.section;
				if (!(!e || this.wizardSectionSaving)) {
					this.wizardSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-content-section", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								...this.wizardSectionFieldsEditor
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `섹션 저장 오류(${t.status})`);
						await this.loadWizardSections({ fresh: !0 }), await this.loadWizardSectionDetail(e.id), this.setStatus("섹션 정보를 저장했습니다");
					} catch (e) {
						this.setStatus(`섹션 저장 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			async activateWizardSection(e) {
				if (!this.wizardSectionSaving) {
					this.wizardSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-content-section-activate", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e,
								changeNote: "관리자 페이지에서 활성 버전으로 지정했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) {
							let e = (n.errors || []).map((e) => ({
								AI_IMAGE_TARGET_REQUIRED: "AI 이미지 대상으로 사용할 컴포넌트를 선택하거나 섹션 배경 생성을 허용해 주세요.",
								SECTION_COMPONENT_REQUIRED: "필수 Section에는 프로모션 빌더에 노출되는 컴포넌트가 최소 1개 필요합니다.",
								REQUIRED_SECTION_ITEM: "필수 Section에는 노출되는 필수 컴포넌트가 필요합니다.",
								AI_LAYOUT_VARIANT_REQUIRED: "AI 디자인을 사용하려면 AI 사용이 허용된 Layout Preset을 최소 1개 지정해 주세요.",
								DEFAULT_LAYOUT_REQUIRED: "Layout Preset을 사용하려면 기본 Preset을 1개 지정해 주세요.",
								HEADER_LOGO_REQUIRED: "Header에는 프로모션 빌더에 노출되는 Logo 컴포넌트가 필요합니다.",
								HEADER_DEFAULT_LAYOUT_REQUIRED: "Header에는 기본 Layout Preset이 필요합니다.",
								HEADER_LOGO_GEOMETRY_REQUIRED: "기본 Layout의 Desktop과 Mobile에 Logo 위치와 크기를 저장해 주세요.",
								HEADER_LOGO_VISIBILITY_REQUIRED: "Header Logo는 Desktop과 Mobile에서 표시되어야 합니다."
							})[e.code] || e.message).filter(Boolean);
							throw Error(e.length ? e.join(" ") : n.message || n.error || `섹션 활성화 오류(${t.status})`);
						}
						await this.loadWizardSections({ fresh: !0 }), await this.loadWizardSectionDetail(e), this.wizardFormTemplateDetail?.template?.id && await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id, { silent: !0 }), this.setStatus("섹션을 활성 버전으로 지정했습니다. Wizard에 즉시 반영됩니다.");
					} catch (e) {
						this.setStatus(`섹션 활성화 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			async archiveWizardSection(e) {
				if (!this.wizardSectionSaving) {
					this.wizardSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-content-section-archive", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e,
								changeNote: "관리자 페이지에서 보관 처리했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `섹션 보관 오류(${t.status})`);
						await this.loadWizardSections({ fresh: !0 }), this.setStatus("섹션을 보관 처리했습니다 (Wizard에서 즉시 숨겨짐)");
					} catch (e) {
						this.setStatus(`섹션 보관 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			async deleteWizardSection(e = this.selectedWizardGroup) {
				let t = e?.primary || null;
				if (!t || this.wizardSectionSaving || this.wizardSectionUsageLoading) return;
				if (this.wizardSectionUsage.length) {
					this.setStatus("활성 또는 초안 템플릿에서 사용 중인 Section Preset은 삭제할 수 없습니다.");
					return;
				}
				let n = e.versions.length;
				if (window.confirm(`${t.name} Section Preset을 영구 삭제할까요? ${n}개 버전과 컴포넌트 배치·레이아웃이 함께 삭제됩니다. 진행 중인 AI 디자인 작업은 취소되며 복구할 수 없습니다.`)) {
					this.wizardSectionSaving = !0;
					try {
						let e = await fetch(`/api/wizard-content-section-delete?id=${encodeURIComponent(t.id)}`, { method: "DELETE" }), r = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(r.message || r.error || `Section Preset 삭제 오류(${e.status})`);
						this.selectedWizardSectionKey = "", this.wizardSectionDetail = null, this.wizardSectionUsage = [], await this.loadWizardSections({ fresh: !0 });
						let i = Number(r.cancelledDesignRunCount || 0);
						this.setStatus(`${t.name} Section Preset과 ${Number(r.deletedVersionCount || n)}개 버전을 삭제했습니다${i ? ` · AI 디자인 작업 ${i}건 취소` : ""}`);
					} catch (e) {
						this.setStatus(`Section Preset 삭제 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			openNewWizardItemEditor() {
				this.wizardItemEditor = {
					id: "",
					componentVersionId: "",
					itemKey: "",
					name: "",
					isVisibleInWizard: !0,
					isRequired: !1,
					sortOrder: Math.max(-10, ...(this.wizardSectionDetail?.items || []).map((e) => Number(e.sortOrder) || 0)) + 10,
					fieldKind: "text",
					textType: "title",
					image: {
						allowedSources: [],
						promptText: "",
						descriptionEnabled: !1,
						altTextRequired: !1,
						aspectRatio: "",
						maxSizeKb: ""
					},
					ctaUtm: {
						source: "",
						medium: "",
						campaign: "",
						content: "",
						term: ""
					},
					isLocked: !1,
					lockedValueText: ""
				}, this.wizardItemEditorOpenId = "new";
			},
			openWizardItemEditor(e) {
				this.wizardItemEditor = {
					id: e.id,
					componentVersionId: e.componentVersionId || "",
					itemKey: e.itemKey,
					name: e.name,
					isVisibleInWizard: e.isVisibleInWizard,
					isRequired: e.isRequired,
					sortOrder: e.sortOrder,
					fieldKind: e.fieldKind,
					textType: e.textType || "title",
					image: e.image ? {
						...e.image,
						allowedSources: [...e.image.allowedSources || []]
					} : {
						allowedSources: [],
						promptText: "",
						descriptionEnabled: !1,
						altTextRequired: !1,
						aspectRatio: "",
						maxSizeKb: ""
					},
					ctaUtm: e.ctaUtm ? { ...e.ctaUtm } : {
						source: "",
						medium: "",
						campaign: "",
						content: "",
						term: ""
					},
					isLocked: e.isLocked,
					lockedValueText: e.lockedValue !== null && e.lockedValue !== void 0 ? JSON.stringify(e.lockedValue, null, 2) : ""
				}, this.wizardItemEditorOpenId = e.id;
			},
			closeWizardItemEditor() {
				this.wizardItemEditorOpenId = "";
			},
			toggleWizardItemImageSource(e) {
				let t = this.wizardItemEditor.image.allowedSources, n = t.indexOf(e);
				n >= 0 ? t.splice(n, 1) : t.push(e);
			},
			wizardSectionComponentCanReorder() {
				return this.wizardSectionDetail?.section?.status === "draft" && !this.wizardSectionSaving && !this.wizardSectionComponentOrderSaving;
			},
			startWizardSectionComponentDrag(e, t) {
				if (!this.wizardSectionComponentCanReorder()) {
					t.preventDefault();
					return;
				}
				this.draggedWizardSectionComponentId = e.id, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			dragOverWizardSectionComponent(e, t) {
				if (!this.draggedWizardSectionComponentId || this.draggedWizardSectionComponentId === e.id || !this.wizardSectionComponentCanReorder()) return;
				let n = t.currentTarget.getBoundingClientRect();
				this.wizardSectionComponentDropTargetId = e.id, this.wizardSectionComponentDropPosition = t.clientY < n.top + n.height / 2 ? "before" : "after", t.dataTransfer.dropEffect = "move";
			},
			stopWizardSectionComponentDrag() {
				this.draggedWizardSectionComponentId = "", this.wizardSectionComponentDropTargetId = "", this.wizardSectionComponentDropPosition = "";
			},
			async saveWizardSectionComponentOrder(e, t) {
				let n = this.wizardSectionDetail?.section;
				if (!n || n.status !== "draft" || this.wizardSectionComponentOrderSaving) return;
				let r = n.id;
				this.wizardSectionDetail.items = e, this.wizardSectionComponentOrderSaving = !0, this.setStatus("섹션 컴포넌트 순서를 저장하는 중입니다");
				try {
					let t = await fetch("/api/wizard-content-section-items-order", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							sectionId: r,
							itemIds: e.map((e) => e.id)
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `컴포넌트 순서 오류(${t.status})`);
					this.wizardSectionDetail?.section?.id === r && (this.wizardSectionDetail.items = Array.isArray(n.items) ? n.items : e), this.setStatus("섹션 컴포넌트 순서를 초안에 저장했습니다. 프로모션 빌더에 반영하려면 섹션을 활성화하세요");
				} catch (e) {
					this.wizardSectionDetail?.section?.id === r && (this.wizardSectionDetail.items = t), this.setStatus(`컴포넌트 순서 저장 실패: ${e.message}`);
				} finally {
					this.wizardSectionComponentOrderSaving = !1;
				}
			},
			async dropWizardSectionComponent(e) {
				let t = this.draggedWizardSectionComponentId, n = this.wizardSectionComponentDropPosition || "before";
				if (this.stopWizardSectionComponentDrag(), !t || t === e?.id || !this.wizardSectionComponentCanReorder()) return;
				let r = [...this.wizardSectionDetail?.items || []], i = r.find((e) => e.id === t), a = r.filter((e) => e.id !== t), o = a.findIndex((t) => t.id === e.id);
				!i || o < 0 || (a.splice(o + +(n === "after"), 0, i), !a.every((e, t) => e.id === r[t]?.id) && await this.saveWizardSectionComponentOrder(a, r));
			},
			async moveWizardSectionComponent(e, t) {
				if (!this.wizardSectionComponentCanReorder()) return;
				let n = [...this.wizardSectionDetail?.items || []], r = n.findIndex((t) => t.id === e.id), i = r + t;
				if (r < 0 || i < 0 || i >= n.length) return;
				let a = [...n], [o] = a.splice(r, 1);
				a.splice(i, 0, o), await this.saveWizardSectionComponentOrder(a, n);
			},
			async saveWizardItem() {
				let e = this.wizardSectionDetail?.section;
				if (!e || this.wizardSectionSaving) return;
				let t = null;
				if (this.wizardItemEditor.isLocked && this.wizardItemEditor.lockedValueText.trim()) try {
					t = JSON.parse(this.wizardItemEditor.lockedValueText);
				} catch (e) {
					this.setStatus(`고정값 JSON 형식이 올바르지 않습니다: ${e.message}`);
					return;
				}
				this.wizardSectionSaving = !0;
				try {
					let n = await fetch("/api/wizard-content-section-items", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.wizardItemEditor.id || void 0,
							sectionId: e.id,
							componentVersionId: this.wizardItemEditor.componentVersionId,
							...this.wizardItemEditor.id ? { itemKey: this.wizardItemEditor.itemKey } : {},
							name: this.wizardItemEditor.name,
							isVisibleInWizard: this.wizardItemEditor.isVisibleInWizard,
							isRequired: this.wizardItemEditor.isRequired,
							sortOrder: Number(this.wizardItemEditor.sortOrder) || 0,
							isLocked: this.wizardItemEditor.isLocked,
							lockedValue: t
						})
					}), r = await n.json().catch(() => ({}));
					if (!n.ok) throw Error(r.message || r.error || `컴포넌트 저장 오류(${n.status})`);
					await this.loadWizardSectionDetail(e.id), this.wizardItemEditorOpenId = "", this.setStatus("섹션 컴포넌트를 저장했습니다");
				} catch (e) {
					this.setStatus(`컴포넌트 저장 실패: ${e.message}`);
				} finally {
					this.wizardSectionSaving = !1;
				}
			},
			async deleteWizardItem(e) {
				let t = this.wizardSectionDetail?.section;
				if (!(!t || this.wizardSectionSaving)) {
					this.wizardSectionSaving = !0;
					try {
						let n = await fetch(`/api/wizard-content-section-items?id=${encodeURIComponent(e.id)}&sectionId=${encodeURIComponent(t.id)}`, { method: "DELETE" }), r = await n.json().catch(() => ({}));
						if (!n.ok) throw Error(r.message || r.error || `컴포넌트 삭제 오류(${n.status})`);
						await this.loadWizardSectionDetail(t.id), this.setStatus("섹션 컴포넌트를 삭제했습니다");
					} catch (e) {
						this.setStatus(`컴포넌트 삭제 실패: ${e.message}`);
					} finally {
						this.wizardSectionSaving = !1;
					}
				}
			},
			onDesignTokenSectionToggle(e, t) {
				t.target.open ? this.activeDesignTokenSectionKey = e : this.activeDesignTokenSectionKey === e && (this.activeDesignTokenSectionKey = "");
			},
			async loadHandoffDocuments() {
				if (window.location.protocol !== "file:") try {
					let e = await fetch("/api/handoff-documents"), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.message || t.error || `API ${e.status}`);
					this.handoffDocuments = t.documents || [], !this.selectedHandoffFile && this.handoffDocuments.length && (this.selectedHandoffFile = this.handoffDocuments[0].file);
				} catch (e) {
					this.handoffError = e.message;
				}
			},
			async openSelectedHandoff() {
				if (!this.selectedHandoffFile) {
					this.setStatus("선택된 handoff 문서가 없습니다");
					return;
				}
				this.handoffLoading = !0, this.handoffError = "", this.handoffMarkdown = "", this.activeHandoffDocument = this.handoffDocuments.find((e) => e.file === this.selectedHandoffFile) || null, this.$nextTick(() => {
					this.$refs.handoffModal.open || this.$refs.handoffModal.showModal();
				});
				try {
					let e = await fetch(`/api/handoff-documents?file=${encodeURIComponent(this.selectedHandoffFile)}`), t = await e.json().catch(() => ({}));
					if (!e.ok) throw Error(t.message || t.error || `API ${e.status}`);
					this.activeHandoffDocument = t.document || this.activeHandoffDocument, this.handoffMarkdown = t.document?.markdown || "";
				} catch (e) {
					this.handoffError = e.message;
				} finally {
					this.handoffLoading = !1;
				}
			},
			closeHandoff() {
				this.$refs.handoffModal.close();
			},
			async loadDesignDocuments(t = {}) {
				try {
					let n = t.fresh ? `/api/design-documents?ts=${Date.now()}` : "/api/design-documents", r = await fetch(n);
					if (!r.ok) throw Error(`API ${r.status}`);
					let i = await r.json();
					this.designDocuments = i.documents || [], this.mdListSource = "Neon Postgres", (!this.selectedDocumentId || !this.selectedDocument) && (this.selectedDocumentId = this.designDocuments[0]?.id || ""), localStorage.setItem(e.selectedDocumentId, this.selectedDocumentId), this.resetOverride(), this.setStatus(`Neon에서 MD ${this.designDocuments.length}개를 불러왔습니다`);
				} catch {
					this.designDocuments = ae(), this.mdListSource = "fallback 더미", (!this.selectedDocumentId || !this.selectedDocument) && (this.selectedDocumentId = this.designDocuments[0]?.id || ""), localStorage.setItem(e.selectedDocumentId, this.selectedDocumentId), this.resetOverride(), this.selectedDesignDetail = null, this.setStatus("Neon API를 사용할 수 없어 더미 데이터를 사용합니다");
				}
			},
			conceptValue(e) {
				return this.selectedDocument?.designConcept?.json?.[e] || "";
			},
			conceptList(e) {
				let t = this.selectedDocument?.designConcept?.json?.[e];
				return Array.isArray(t) ? t : [];
			},
			designDataCategoryRows(e) {
				let t = e?.summary || {}, n = e?.tokenSet?.normalizedSchema || e?.normalizedSchema || {}, r = Array.isArray(e?.tokenItems) ? e.tokenItems : [], i = (e) => r.filter((t) => String(t.tokenPath || "").startsWith(`${e}.`)).length, a = (e) => r.filter((t) => t.tokenType === e).length, o = (e) => Object.values(n?.tokens?.[e] || {}).filter((e) => this.formatDesignTokenValue(e) !== "unknown").length, s = (t) => this.rawTokenRowsForGroup(e, t).length;
				return [
					[
						"color",
						"Colors",
						o("color") || s("color") || i("color") || a("color")
					],
					[
						"typography",
						"Typography",
						o("typography") || s("typography") || i("typography") || a("fontFamily")
					],
					[
						"radius",
						"Radius",
						o("radius") || s("radius") || i("radius")
					],
					[
						"spacing",
						"Spacing",
						o("spacing") || s("spacing") || i("spacing")
					],
					[
						"dimension",
						"Layout / Size",
						o("breakpoint") || s("breakpoint") || i("dimension") + i("breakpoint")
					],
					[
						"elevation",
						"Elevation",
						o("elevation") || s("elevation") || i("shadow") || a("shadow")
					],
					[
						"component",
						"Components",
						t.componentPatternCount || e?.componentPatterns?.length || this.rawPatternRows(e, "component").length || 0
					],
					[
						"layout",
						"Layouts",
						t.layoutPatternCount || e?.layoutPatterns?.length || this.rawPatternRows(e, "layout").length || 0
					],
					[
						"guideline",
						"Guidelines",
						t.guidelineCount || e?.guidelineItems?.length || this.rawGuidelineRows(e).length || 0
					],
					[
						"metadata",
						"Metadata",
						t.metadataCount || e?.metadataItems?.length || 0
					]
				].map(([e, t, n]) => ({
					key: e,
					label: t,
					value: Number(n || 0).toLocaleString()
				}));
			},
			designTokenCategoryLabel(e) {
				let t = this.designDataCategoryRows(e).filter((e) => Number(String(e.value).replace(/,/g, "")) > 0).map((e) => e.label);
				if (!t.length) return "토큰 unknown";
				let n = t.slice(0, 3), r = t.length - n.length;
				return `${n.join(" / ")}${r > 0 ? ` +${r}` : ""}`;
			},
			stylePopularityLabel(e) {
				let t = Number(e?.styleClassification?.confidence);
				return Number.isFinite(t) ? `인기 ${Math.round(t * 100)}%` : "인기 unknown";
			},
			documentDateLabel(e) {
				let t = e?.updatedAt || e?.createdAt || "", n = String(t).match(/\d{4}-\d{2}-\d{2}/);
				return n ? n[0] : "날짜 unknown";
			},
			designSchemaClassification(e) {
				let t = (e?.tokenSet?.normalizedSchema || e?.normalizedSchema || {}).classification || e?.styleClassification || {};
				return [
					`group: ${t.primaryGroup?.slug || t.primaryGroup || e?.styleClassification?.primaryGroup?.slug || "unknown"}`,
					`color: ${t.colorMode || "unknown"}`,
					`depth: ${t.depthModel || "unknown"}`,
					`shape: ${t.shapeModel || "unknown"}`,
					`type: ${t.typographyTone || "unknown"}`
				].join(" / ");
			},
			normalizedTokenRows(e, t) {
				let n = (e?.tokenSet?.normalizedSchema || e?.normalizedSchema || {})?.tokens?.[t] || {}, r = {
					color: ["color"],
					typography: [
						"typography",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight"
					],
					radius: ["radius", "borderRadius"],
					spacing: ["spacing", "space"],
					elevation: ["shadow", "elevation"],
					breakpoint: ["breakpoint", "dimension"]
				}, i = Object.entries(n).map(([e, t]) => ({
					key: e,
					value: this.formatDesignTokenValue(t)
				})).filter((e) => e.value && e.value !== "unknown");
				if (i.length) return i;
				let a = this.rawTokenRowsForGroup(e, t);
				if (a.length) return a;
				let o = Array.isArray(e?.tokenItems) ? e.tokenItems : [], s = r[t] || [t];
				return o.filter((e) => String(e.tokenPath || "").startsWith(`${t}.`) || s.includes(e.tokenType)).slice(0, 30).map((e) => ({
					key: e.tokenPath || e.tokenType || "unknown",
					value: this.formatDesignTokenValue(e.valueJson ?? e.rawValue ?? e.description)
				})).filter((e) => e.value);
			},
			rawTokenRowsForGroup(e, t) {
				let n = e?.designTokensJson || e?.rawDesignTokens || {}, r = ({
					color: [
						"color",
						"colors",
						"tokens.color",
						"tokens.colors"
					],
					typography: [
						"typography",
						"typographies",
						"font",
						"fontFamily",
						"tokens.typography"
					],
					radius: [
						"radius",
						"borderRadius",
						"dimension.radius",
						"tokens.radius"
					],
					spacing: [
						"spacing",
						"space",
						"dimension.spacing",
						"tokens.spacing"
					],
					elevation: [
						"elevation",
						"shadow",
						"shadows",
						"tokens.elevation",
						"tokens.shadow"
					],
					breakpoint: [
						"breakpoint",
						"breakpoints",
						"dimension.breakpoint",
						"dimension.breakpoints",
						"tokens.breakpoint"
					]
				}[t] || [t]).map((e) => ({
					path: e,
					value: this.valueAtPath(n, e)
				})).filter((e) => e.value && typeof e.value == "object" && !Array.isArray(e.value)).flatMap(({ path: e, value: t }) => this.rawTokenGroupRows(t, e)).slice(0, 40);
				return !r.length && n.$extends ? [{
					key: `${t}.inheritance`,
					value: `Inherited from ${n.$extends}`
				}] : r;
			},
			rawTokenGroupRows(e, t = "") {
				if (!e || typeof e != "object" || Array.isArray(e)) return [];
				let n = [];
				for (let [r, i] of Object.entries(e)) {
					if (r.startsWith("$")) continue;
					let e = t ? `${t}.${r}` : r, a = this.formatDesignTokenValue(i);
					a && a !== "unknown" && n.push({
						key: e,
						value: a
					});
				}
				return !n.length && e.$description && n.push({
					key: `${t}.$description`,
					value: this.formatDesignTokenValue(e.$description)
				}), !n.length && e.$extensions && n.push({
					key: `${t}.$extensions`,
					value: this.formatDesignTokenValue(e.$extensions)
				}), n;
			},
			formatDesignTokenValue(e) {
				if (e == null || e === "") return "unknown";
				if (Array.isArray(e)) {
					let t = e.map((e) => this.formatDesignTokenValue(e)).filter(Boolean);
					return t.length ? t.slice(0, 4).join(", ") : "unknown";
				}
				if (typeof e != "object") return String(e);
				if (e.hex) return String(e.hex);
				if (e.$value?.hex) return String(e.$value.hex);
				if (e.value !== void 0 && e.unit) return `${e.value}${e.unit}`;
				let t = [
					e.$value ?? e.value ?? e.summary ?? e.$description ?? e.description ?? e.role ?? e.pattern ?? e.guideline,
					e.$type || e.type,
					e.confidence == null ? "" : `confidence ${e.confidence}`,
					e.source ? `source ${e.source}` : ""
				].filter(Boolean).map((e) => typeof e == "object" ? this.formatDesignTokenValue(e) : String(e));
				if (t.length) return t.join(" | ");
				let n = Object.entries(e).filter(([e, t]) => !e.startsWith("$") && t != null && t !== "" && t !== "unknown").slice(0, 4).map(([e, t]) => `${e}: ${this.formatDesignTokenValue(t)}`);
				return n.length ? n.join(" | ") : "unknown";
			},
			colorTokenHex(e) {
				let t = String(e || "").match(/#[0-9a-fA-F]{3,8}\b/);
				return t ? t[0] : "";
			},
			patternRows(e, t) {
				let n = t === "component" ? e?.componentPatterns : e?.layoutPatterns, r = (Array.isArray(n) ? n : []).slice(0, 30).map((e) => ({
					key: e.patternName || e.patternType || e.sectionName || "unknown",
					value: this.formatDesignTokenValue(e.valueJson || e.description || e.sourceText)
				}));
				return r.length ? r : this.rawPatternRows(e, t);
			},
			guidelineRows(e) {
				let t = (Array.isArray(e?.guidelineItems) ? e.guidelineItems : []).slice(0, 30).map((e) => ({
					key: e.guidelineType || e.severity || e.sourcePath || "guideline",
					value: this.formatDesignTokenValue(e.valueJson || e.description || e.sourceText)
				}));
				return t.length ? t : this.rawGuidelineRows(e);
			},
			rawPatternRows(e, t) {
				let n = e?.designTokensJson || e?.rawDesignTokens || {};
				return (t === "component" ? [
					"component",
					"components",
					"componentStyle",
					"tokens.component",
					"patterns.component"
				] : [
					"layout",
					"layouts",
					"composition",
					"dimension",
					"shadow",
					"tokens.layout",
					"patterns.layout"
				]).map((e) => ({
					path: e,
					value: this.valueAtPath(n, e)
				})).filter((e) => e.value && typeof e.value == "object" && !Array.isArray(e.value)).flatMap(({ path: e, value: t }) => {
					let n = t.$description || t.description || "", r = t.$extensions || t.extensions || null, i = [];
					return n && i.push({
						key: `${e}.description`,
						value: this.formatDesignTokenValue(n)
					}), r && i.push({
						key: `${e}.extensions`,
						value: this.formatDesignTokenValue(r)
					}), i.push(...this.rawTokenGroupRows(t, e)), i;
				}).slice(0, 30);
			},
			rawGuidelineRows(e) {
				let t = e?.designTokensJson || e?.rawDesignTokens || {}, n = [];
				t.$description && n.push({
					key: "$description",
					value: this.formatDesignTokenValue(t.$description)
				}), t.$extends && n.push({
					key: "$extends",
					value: `inherits ${t.$extends}`
				});
				let r = (e, t, i = 0) => {
					if (!(!e || typeof e != "object" || Array.isArray(e) || i > 2 || n.length >= 30)) {
						t && e.$description && n.push({
							key: `${t}.$description`,
							value: this.formatDesignTokenValue(e.$description)
						}), t && e.$extensions && n.push({
							key: `${t}.$extensions`,
							value: this.formatDesignTokenValue(e.$extensions)
						});
						for (let [n, a] of Object.entries(e)) n.startsWith("$") || r(a, t ? `${t}.${n}` : n, i + 1);
					}
				};
				return r(t, "", 0), n.slice(0, 30);
			},
			designTokenGroupSummary(e) {
				let t = Array.isArray(e?.tokenItems) ? e.tokenItems : [];
				if (!t.length) return "no token items";
				let n = t.reduce((e, t) => {
					let n = String(t.tokenPath || t.tokenType || "unknown").split(".")[0] || "unknown";
					return e[n] = (e[n] || 0) + 1, e;
				}, {});
				return Object.entries(n).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => `${e}: ${t}`).join(" / ");
			},
			groupInfoForDocument(e) {
				let t = {
					slug: "unclassified",
					name: "미분류",
					description: "디자인 분석 또는 스타일 분류가 필요합니다"
				}, n = e?.styleClassification?.primaryGroup;
				return !n || typeof n != "object" ? t : {
					slug: n.slug || "unclassified",
					name: n.name || "미분류",
					description: n.description || t.description
				};
			},
			tagsForDocument(e) {
				let t = e?.styleClassification?.styleTags;
				return Array.isArray(t) ? t.filter(Boolean) : [];
			},
			styleGroupName(e) {
				let t = e?.name || "";
				return {
					Unclassified: "미분류",
					"Editorial / Media": "에디토리얼 / 미디어",
					"Product / SaaS": "프로덕트 / SaaS",
					"Commerce / Finance": "커머스 / 금융",
					"Luxury / Automotive": "럭셔리 / 오토모티브",
					"Consumer / Lifestyle": "소비자 / 라이프스타일",
					"AI / Developer Tools": "AI / 개발자 도구",
					"Gaming / Entertainment": "게임 / 엔터테인먼트"
				}[t] || t || "미분류";
			},
			styleGroupDescription(e) {
				let t = e?.description || "";
				return { "Needs design analysis or style classification": "디자인 분석 또는 스타일 분류가 필요합니다" }[t] || t || "디자인 분석 또는 스타일 분류가 필요합니다";
			},
			visualModeLabel(e) {
				return {
					auto: "자동",
					use_visual: "비주얼 사용",
					no_visual: "비주얼 없음"
				}[e] || e || "자동";
			},
			imageGenerationModeLabel(e) {
				return {
					none: "없음",
					generate: "AI 생성",
					upload_or_reference: "참조/업로드",
					brand_asset: "브랜드 자산"
				}[e] || "없음";
			},
			sectionStatusLabel(e) {
				return e.fixedPosition === "top" ? "상단 고정" : e.fixedPosition === "bottom" ? "하단 고정" : e.orderChangeAllowed === !1 ? "순서 고정" : "순서 변경 가능";
			},
			sectionRequiredLabel(e) {
				return e.sectionExposure === "required" || e.required ? "필수" : "선택";
			},
			setSectionVisible(e, t) {
				this.sectionConfig.sectionVisibility = {
					...this.sectionConfig.sectionVisibility,
					[e]: !!t
				}, t && this.ensureRequiredItemsVisible(e);
			},
			setItemVisible(e, t, n) {
				if ((i(this.templateSchema).find((t) => (t.sectionId || t.key) === e)?.items || []).find((e) => (e.itemId || e.key) === t)?.required && this.sectionConfig.sectionVisibility?.[e] !== !1 && !n) {
					this.setStatus("필수 아이템은 섹션 사용 중에는 숨길 수 없습니다");
					return;
				}
				this.sectionConfig.itemVisibility = {
					...this.sectionConfig.itemVisibility,
					[e]: {
						...this.sectionConfig.itemVisibility?.[e] || {},
						[t]: !!n
					}
				};
			},
			setImageGenerationMode(e, t, n) {
				this.sectionConfig.imageGenerationMode = {
					...this.sectionConfig.imageGenerationMode,
					[e]: {
						...this.sectionConfig.imageGenerationMode?.[e] || {},
						[t]: n
					}
				};
			},
			repeatableSectionSets(e) {
				let t = this.sectionInputs?.[e];
				return Array.isArray(t) ? t : t && typeof t == "object" ? (this.sectionInputs[e] = [t], this.sectionInputs[e]) : (this.sectionInputs[e] = [this.defaultRepeatableSet(e)], this.sectionInputs[e]);
			},
			defaultRepeatableSet(e) {
				return e === "stepBar" ? {
					title: "",
					description: "",
					ctaLabel: "",
					link: "",
					target: "_blank"
				} : e === "imageTextRow" ? {
					imageText: "",
					title: "",
					description: "",
					visualMode: "auto"
				} : {};
			},
			addRepeatableSet(e) {
				this.repeatableSectionSets(e).push(this.defaultRepeatableSet(e)), this.sectionInputsDirty = !0, this.setStatus("세트를 추가했습니다");
			},
			removeRepeatableSet(e, t) {
				let n = this.repeatableSectionSets(e);
				if (n.length <= 1) {
					this.setStatus("최소 1개 세트는 필요합니다");
					return;
				}
				n.splice(t, 1), this.sectionInputsDirty = !0, this.setStatus("세트를 삭제했습니다");
			},
			repeatItemKey(e, t) {
				return `${e}.${t}`;
			},
			repeatItemVisible(e, t, n) {
				let r = this.repeatItemKey(t, n.itemId);
				return this.sectionConfig.itemVisibility?.[e]?.[r] ?? n.defaultVisible !== !1;
			},
			setRepeatItemVisible(e, t, n, r) {
				let i = this.repeatItemKey(t, n);
				this.sectionConfig.itemVisibility = {
					...this.sectionConfig.itemVisibility,
					[e]: {
						...this.sectionConfig.itemVisibility?.[e] || {},
						[i]: !!r
					}
				};
			},
			repeatImageGenerationMode(e, t, n) {
				if (!n.imageGenerationRequest) return "none";
				let r = this.repeatItemKey(t, n.itemId);
				return this.sectionConfig.imageGenerationMode?.[e]?.[r] || "generate";
			},
			setRepeatImageGenerationMode(e, t, n, r) {
				let i = this.repeatItemKey(t, n);
				this.sectionConfig.imageGenerationMode = {
					...this.sectionConfig.imageGenerationMode,
					[e]: {
						...this.sectionConfig.imageGenerationMode?.[e] || {},
						[i]: r
					}
				};
			},
			repeatItemInputPath(e, t, n) {
				return `${e}.${t}.${n.inputKey || n.itemId}`;
			},
			repeatImageGenerationTargets(e = this.sectionInputs) {
				return this.sectionConfigSections.flatMap((t) => !t.repeatableSet || this.sectionConfig.sectionVisibility?.[t.sectionId] === !1 ? [] : (Array.isArray(e?.[t.sectionId]) ? e[t.sectionId] : []).flatMap((e, n) => t.items.filter((e) => !e.imageGenerationRequest || !this.repeatItemVisible(t.sectionId, n, e) ? !1 : this.repeatImageGenerationMode(t.sectionId, n, e) === "generate").map((e) => ({
					sectionId: t.sectionId,
					setIndex: n,
					itemId: e.itemId,
					label: e.label,
					inputPath: this.repeatItemInputPath(t.sectionId, n, e),
					mode: "generate"
				}))));
			},
			sectionInputValue(e) {
				let t = this.valueAtPath(this.sectionInputs, e);
				return t == null ? "" : typeof t == "object" ? t.label || t.text || JSON.stringify(t, null, 2) : String(t);
			},
			setSectionInputValue(e, t) {
				let n = String(e || "").split(".").filter(Boolean);
				if (!n.length) return;
				let r = this.sectionInputs;
				for (let e = 0; e < n.length - 1; e += 1) {
					let t = n[e], i = n[e + 1];
					r[t] ?? (r[t] = /^\d+$/.test(i) ? [] : {}), r = r[t];
				}
				let i = n[n.length - 1], a = r?.[i];
				if (a && typeof a == "object" && !Array.isArray(a)) {
					r[i] = {
						...a,
						label: t
					}, this.sectionInputsDirty = !0;
					return;
				}
				r[i] = t, this.sectionInputsDirty = !0;
			},
			valueAtPath(e, t) {
				return String(t || "").split(".").filter(Boolean).reduce((e, t) => e?.[t], e);
			},
			ensureRequiredItemsVisible(e) {
				let t = i(this.templateSchema).find((t) => (t.sectionId || t.key) === e);
				if (!t) return;
				let n = Object.fromEntries((t.items || []).filter((e) => e.required).map((e) => [e.itemId || e.key, !0]));
				this.sectionConfig.itemVisibility = {
					...this.sectionConfig.itemVisibility,
					[e]: {
						...this.sectionConfig.itemVisibility?.[e] || {},
						...n
					}
				};
			},
			resetSectionConfig() {
				this.sectionConfig = o(this.templateSchema), this.setStatus("섹션 구성을 기본값으로 되돌렸습니다");
			},
			templateLabel(e) {
				return e === "Template 4" ? "템플릿 4" : e || "";
			},
			statusLabel(e) {
				return {
					n8n_ui_design_pending: "n8n 생성 중",
					n8n_ui_design_generated: "n8n 생성 완료",
					n8n_failed: "n8n 실패",
					draft: "초안"
				}[e] || e || "";
			},
			startPromoBuilder() {
				if (!this.selectedDocument) {
					this.setStatus("먼저 디자인 MD를 선택해 주세요");
					return;
				}
				let e = this.promoBuilderStarted;
				this.promoBuilderStarted ||= (this.resetPromoBuilderState({ rerender: !0 }), !0), this.openPromoBuilderModal(), this.setStatus(e ? "프로모션 생성 단계를 이어서 진행합니다" : "프로모션 생성 단계를 시작했습니다");
			},
			openPromoBuilderModal() {
				this.promoBuilderModalOpen = !0, this.$nextTick(() => {
					this.$refs.promoBuilderModal.open || this.$refs.promoBuilderModal.showModal();
				});
			},
			closePromoBuilder(e = {}) {
				this.$refs.promoBuilderModal?.open && this.$refs.promoBuilderModal.close(), this.onPromoBuilderClosed(e);
			},
			onPromoBuilderClosed(e = {}) {
				this.promoBuilderModalOpen = !1, e.endSession === !0 && (this.promoBuilderStarted = !1, this.stopGenerationMotion());
			},
			builderStepClass(e) {
				return {
					active: e.step === this.currentBuilderStep,
					done: e.step < this.currentBuilderStep
				};
			},
			validateBuilderStep(e = this.currentBuilderStep) {
				if (e === 1 && !String(this.promo.market || "").trim()) return this.validationErrors = { market: !0 }, this.setStatus("마켓 / 지역을 선택해 주세요"), !1;
				if (e === 1 && (this.validationErrors = {}), e === 2) {
					let e = this.validatePromoInputs() && this.validateSectionConfig();
					return e && !this.hasSectionDraft() && this.refreshSectionDraft({ silent: !0 }), e;
				}
				return !0;
			},
			validateBuilderStepsUntil(e) {
				for (let t = 1; t < e; t += 1) if (!this.validateBuilderStep(t)) return !1;
				return !0;
			},
			goBuilderStep(e) {
				if (!this.promoBuilderStarted) return;
				let t = Math.max(1, Math.min(this.builderSteps.length, e));
				t > this.currentBuilderStep && !this.validateBuilderStepsUntil(t) || (this.currentBuilderStep = t);
			},
			nextBuilderStep() {
				this.validateBuilderStep(this.currentBuilderStep) && (this.currentBuilderStep = Math.min(this.builderSteps.length, this.currentBuilderStep + 1));
			},
			prevBuilderStep() {
				this.currentBuilderStep = Math.max(1, this.currentBuilderStep - 1);
			},
			resultType(e) {
				return e ? e.status === "n8n_failed" || e.errorMessage ? "failed" : e.status === "n8n_ui_design_pending" ? "pending" : C(e.imageUrl, e) ? "image" : e.finalDesignPreviewUrl ? "final_design" : e.lofiDraftPreviewUrl ? "lofi_draft" : /queued|generating|running|pending|accepted/i.test(e.generationRunStatus || "") ? "pending" : e.designUrl || e.pageUrl || ee(e.imageUrl) ? "view" : e.payload ? "draft" : "empty" : "empty";
			},
			resultTypeLabel(e) {
				return {
					image: "이미지 생성 완료",
					final_design: "최종 디자인 준비",
					lofi_draft: "LO-FI 초안 준비",
					view: "디자인 보기 가능",
					pending: "생성 중",
					failed: "생성 실패",
					draft: "로컬 초안",
					empty: "대기"
				}[this.resultType(e)] || "대기";
			},
			resultOutputLabel(e) {
				return {
					image: "이미지 미리보기",
					final_design: "최종 디자인 미리보기",
					lofi_draft: "LO-FI 초안 미리보기",
					view: "결과 화면 미리보기",
					pending: "생성 대기 중",
					failed: "오류 확인 필요",
					draft: "로컬 미리보기",
					empty: "산출물 없음"
				}[this.resultType(e)] || "산출물 없음";
			},
			previewImageUrl(e) {
				return C(e?.imageUrl, e) ? e.imageUrl : e?.finalDesignPreviewUrl ? e.finalDesignPreviewUrl : e?.lofiDraftPreviewUrl || "";
			},
			previewFrameUrl(e) {
				return e && S(e.designUrl || e.pageUrl || (ee(e.imageUrl) ? e.imageUrl : ""), e.id) || "";
			},
			storedResultToPage(e, t = {}) {
				let n = e?.run || {}, r = Array.isArray(e?.assets) ? e.assets : [], i = r.find((e) => e.asset_type === "generated_image") || {}, a = r.filter((e) => /_markdown$/.test(e.asset_type || "")), o = n.run_key || t.id || "", s = n.created_at || t.createdAt || "", c = i.created_at || t.committedAt || s, l = s ? y(s) : "", u = c ? y(c) : l, d = O(i), f = Number(i.file_size || 0);
				return {
					id: o,
					title: n.promo_title || t.title || o,
					selectedMd: n.selected_md_name || t.selectedMd || "",
					styleSourceLabel: n.style_source_label || t.styleSourceLabel || "",
					template: n.template_name || t.template || "",
					market: n.market || t.market || "",
					createdAt: l,
					committedAt: u,
					timestampStamp: x(c || s || u || l),
					status: n.status || t.status || "generated",
					designUrl: w(o),
					imageUrl: T(o),
					pageUrl: w(o),
					layoutMapping: n.layout_mapping || t.layoutMapping || null,
					mdComplianceMap: n.md_compliance_map || t.mdComplianceMap || null,
					imagePrompt: n.image_prompt || t.imagePrompt || "",
					promptGroupId: n.prompt_group_id || i.prompt_group_id || i.metadata?.promptGroupId || t.promptGroupId || "",
					imageFileSize: f,
					imageMimeType: i.mime_type || t.imageMimeType || "",
					imageInvalid: d || t.imageInvalid || !1,
					designPromptStorageKey: a.find((e) => e.asset_type === "design_prompt_markdown")?.storage_key || t.designPromptStorageKey || "",
					promoInputStorageKey: a.find((e) => e.asset_type === "promo_input_markdown")?.storage_key || t.promoInputStorageKey || "",
					integratedBriefStorageKey: a.find((e) => e.asset_type === "integrated_design_brief_markdown")?.storage_key || t.integratedBriefStorageKey || "",
					errorMessage: n.error_message || t.errorMessage || (d ? "저장된 이미지 파일이 유효하지 않습니다. 다시 생성해 주세요." : ""),
					hasOverride: t.hasOverride || !1,
					resultType: n.result_type || t.resultType || "image",
					payload: n.request_payload || t.payload || null,
					generationRunId: t.generationRunId || "",
					generationRunStatus: t.generationRunStatus || "",
					generationRunStage: t.generationRunStage || "",
					generationRunUpdatedAt: t.generationRunUpdatedAt || "",
					generationPolling: t.generationPolling || null,
					lofiDrafts: t.lofiDrafts || [],
					confirmedLofiDraft: t.confirmedLofiDraft || null,
					currentLofiDraft: t.currentLofiDraft || null,
					lofiDraftPreviewUrl: t.lofiDraftPreviewUrl || "",
					finalDesigns: t.finalDesigns || [],
					currentFinalDesign: t.currentFinalDesign || null,
					finalDesignPreviewUrl: t.finalDesignPreviewUrl || ""
				};
			},
			generationRunStateToPage(e, t = {}) {
				let n = e?.run || {}, r = n.inputSnapshot || {}, i = r.promo || {}, a = r.md || {}, o = n.createdAt ? y(n.createdAt) : t.createdAt || "", s = {
					id: n.runKey || t.id || n.runId || "",
					title: n.promoTitle || i.title || t.title || n.runKey || "",
					selectedMd: n.selectedMdName || a.brand || a.name || t.selectedMd || "",
					styleSourceLabel: r.styleSourceLabel || t.styleSourceLabel || "",
					template: i.template || r.template?.templateName || t.template || "",
					market: i.market || t.market || "",
					createdAt: o,
					committedAt: t.committedAt || "",
					timestampStamp: x(n.updatedAt || n.createdAt || o),
					status: t.status || n.status || "generation_run",
					designUrl: t.designUrl || "",
					imageUrl: t.imageUrl || "",
					pageUrl: t.pageUrl || "",
					layoutMapping: t.layoutMapping || null,
					mdComplianceMap: t.mdComplianceMap || null,
					imagePrompt: t.imagePrompt || "",
					promptGroupId: t.promptGroupId || "",
					imageFileSize: t.imageFileSize || 0,
					imageMimeType: t.imageMimeType || "",
					imageInvalid: t.imageInvalid || !1,
					designPromptStorageKey: t.designPromptStorageKey || "",
					promoInputStorageKey: t.promoInputStorageKey || "",
					integratedBriefStorageKey: t.integratedBriefStorageKey || "",
					errorMessage: n.errorMessage || t.errorMessage || "",
					hasOverride: t.hasOverride || !1,
					resultType: t.resultType || "generation_run",
					payload: r || t.payload || null
				};
				return this.applyGenerationRunStateToPage(s, e), s;
			},
			applyGenerationRunStateToPage(e, t) {
				let n = t?.run || {}, r = Array.isArray(t?.drafts) ? t.drafts : [], i = Array.isArray(t?.finalDesigns) ? t.finalDesigns : [], a = t?.confirmedDraft || null, o = r.filter((e) => ["ready", "completed"].includes(String(e.status || "")) && e.imageProxyAvailable !== !1), s = a || o[o.length - 1] || r[r.length - 1] || null, c = ["ready", "completed"].includes(String(s?.status || "")) && s?.imageProxyAvailable !== !1 ? s : o[o.length - 1] || null, l = i[0] || null, u = ["ready", "completed"].includes(String(l?.status || "")) && l?.imageProxyAvailable !== !1, d = i.filter((e) => ["ready", "completed"].includes(String(e.status || "")) && e.imageProxyAvailable !== !1), f = u ? l : d[0] || null;
				return Object.assign(e, {
					generationRunId: n.runId || e.generationRunId || "",
					generationRunStatus: n.status || "",
					generationRunStage: n.stage || "",
					generationRunUpdatedAt: n.updatedAt || e.generationRunUpdatedAt || "",
					generationPolling: A(n),
					lofiDrafts: r,
					confirmedLofiDraft: a,
					currentLofiDraft: s,
					lofiDraftPreviewUrl: c ? E(c.draftId) : "",
					finalDesigns: i,
					currentFinalDesign: l,
					finalDesignPreviewUrl: f ? D(f.finalDesignId) : ""
				}), e;
			},
			currentLofiDraft(e) {
				return e?.currentLofiDraft || e?.confirmedLofiDraft || null;
			},
			isReadyLofiDraft(e) {
				return ["ready", "completed"].includes(String(e?.status || ""));
			},
			canConfirmLofiDraft(e) {
				let t = this.currentLofiDraft(e);
				return !!(t?.draftId && this.isReadyLofiDraft(t) && !t.confirmedAt);
			},
			canRetryLofiDraft(e) {
				if (!e?.generationRunId || e.confirmedLofiDraft) return !1;
				let t = this.currentLofiDraft(e), n = String(t?.status || ""), r = String(e?.currentFinalDesign?.status || ""), i = /queued|generating|running|pending/i.test(n), a = /queued|generating|running|pending/i.test(r);
				return !!(t?.draftId && !i && !a);
			},
			lofiDraftRetryLabel(e) {
				let t = this.currentLofiDraft(e), n = Number(t?.draftAttempt || 0) + 1;
				return n > 1 ? `초안 재시도 #${n}` : "초안 재시도";
			},
			lofiDraftConfirmLabel(e) {
				return this.currentLofiDraft(e)?.confirmedAt ? "확정됨" : "초안 확정";
			},
			lofiDraftStatusLabel(e) {
				return {
					queued: "대기",
					ready: "준비 완료",
					completed: "준비 완료",
					failed: "실패",
					trigger_failed: "Worker 시작 실패"
				}[String(e?.status || "")] || e?.status || "";
			},
			finalDesignStatusLabel(e) {
				return {
					queued: "대기",
					ready: "준비 완료",
					completed: "준비 완료",
					failed: "실패",
					trigger_failed: "Worker 시작 실패"
				}[String(e?.status || "")] || e?.status || "";
			},
			canGenerateFinalDesign(e) {
				let t = e?.confirmedLofiDraft, n = e?.currentFinalDesign, r = String(n?.status || ""), i = /queued|generating|running|pending/i.test(r);
				return !!(t?.draftId && !i);
			},
			finalDesignActionLabel(e) {
				let t = e?.currentFinalDesign;
				if (!t) return "최종 디자인 생성";
				let n = String(t.status || "");
				return /queued|generating|running|pending/i.test(n) ? "최종 생성 중" : ["ready", "completed"].includes(n) ? "최종 재생성" : "최종 디자인 생성";
			},
			async confirmLofiDraft(e) {
				let t = this.currentLofiDraft(e);
				if (!t?.draftId) {
					this.setStatus("확정할 LO-FI 초안이 없습니다");
					return;
				}
				if (!this.isReadyLofiDraft(t)) {
					this.setStatus("준비 완료된 LO-FI 초안만 확정할 수 있습니다");
					return;
				}
				try {
					let n = await fetch("/api/promo-generation-lofi-draft-confirm", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ draftId: t.draftId })
					}), r = await n.json().catch(() => ({}));
					if (!n.ok) throw Error(r.message || r.error || `Confirm ${n.status}`);
					this.applyGenerationRunStateToPage(e, r.state || r), this.syncGenerationRunPolling(), this.setStatus(`LO-FI 초안 #${t.draftAttempt || ""}을 확정했습니다`);
				} catch (e) {
					this.setStatus(`LO-FI 초안 확정 실패: ${e.message}`);
				}
			},
			async retryLofiDraft(e) {
				if (!this.canRetryLofiDraft(e)) {
					this.setStatus("현재 상태에서는 LO-FI 초안을 다시 생성할 수 없습니다");
					return;
				}
				try {
					let t = await fetch("/api/promo-generation-lofi-drafts", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							runId: e.generationRunId || e.id,
							triggerWorker: !0
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || n.workerTrigger?.error || `LO-FI draft ${t.status}`);
					await this.refreshGenerationRunState(e).catch(() => !1), this.syncGenerationRunPolling(), this.setStatus("새 LO-FI 초안 생성을 요청했습니다");
				} catch (t) {
					await this.refreshGenerationRunState(e).catch(() => !1), this.syncGenerationRunPolling(), this.setStatus(`LO-FI 초안 재시도 실패: ${t.message}`);
				}
			},
			async generateFinalDesign(e) {
				let t = e?.confirmedLofiDraft;
				if (!t?.draftId) {
					this.setStatus("최종 디자인 생성 전에 LO-FI 초안을 확정해 주세요");
					return;
				}
				try {
					let n = await fetch("/api/promo-generation-final-designs", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							runId: e.generationRunId || e.id,
							confirmedDraftId: t.draftId,
							triggerWorker: !0
						})
					}), r = await n.json().catch(() => ({}));
					if (!n.ok) throw Error(r.message || r.error || r.workerTrigger?.error || `Final design ${n.status}`);
					await this.refreshGenerationRunState(e).catch(() => !1), this.syncGenerationRunPolling(), this.setStatus("최종 디자인 생성을 요청했습니다");
				} catch (t) {
					await this.refreshGenerationRunState(e).catch(() => !1), this.syncGenerationRunPolling(), this.setStatus(`최종 디자인 생성 요청 실패: ${t.message}`);
				}
			},
			async refreshGenerationRunState(e) {
				if (!e?.id || window.location.protocol === "file:") return !1;
				let t = await fetch(`/api/promo-generation-runs?runId=${encodeURIComponent(e.generationRunId || e.id)}`), n = await t.json().catch(() => ({}));
				if (t.status === 404) return !1;
				if (!t.ok) throw Error(n.message || n.error || `Generation run ${t.status}`);
				return this.applyGenerationRunStateToPage(e, n), !0;
			},
			async refreshGenerationRunStates(e) {
				let t = (e || []).filter((e) => e?.id).slice(0, 20);
				await Promise.all(t.map((e) => this.refreshGenerationRunState(e).catch(() => !1)));
			},
			generationRunNeedsPolling(e) {
				return !e?.generationRunId || (e.generationPolling = A({
					stage: e.generationRunStage,
					status: e.generationRunStatus,
					updatedAt: e.generationRunUpdatedAt
				}), (e.generationPolling || {}).isStale) ? !1 : [
					e.generationRunStatus,
					e.currentLofiDraft?.status,
					e.currentFinalDesign?.status
				].map((e) => String(e || "")).some((e) => /queued|generating|running|pending|accepted/i.test(e));
			},
			syncGenerationRunPolling() {
				this.generatedPages.some((e) => this.generationRunNeedsPolling(e)) ? this.startGenerationRunPolling() : this.stopGenerationRunPolling();
			},
			startGenerationRunPolling() {
				this.generationRunPollingTimer || window.location.protocol === "file:" || (this.generationRunPollingTimer = window.setInterval(() => {
					this.pollActiveGenerationRuns();
				}, 5e3));
			},
			stopGenerationRunPolling() {
				this.generationRunPollingTimer &&= (window.clearInterval(this.generationRunPollingTimer), null);
			},
			async pollActiveGenerationRuns() {
				let e = this.generatedPages.filter((e) => this.generationRunNeedsPolling(e));
				if (!e.length) {
					this.stopGenerationRunPolling();
					return;
				}
				await Promise.all(e.map((e) => this.refreshGenerationRunState(e).catch(() => !1))), this.syncGenerationRunPolling();
			},
			async loadGenerationRunPages(e = {}) {
				let t = new URLSearchParams({ limit: "50" });
				e.fresh && t.set("ts", String(Date.now()));
				let n = await fetch(`/api/promo-generation-runs?${t.toString()}`), r = await n.json().catch(() => ({}));
				if (!n.ok) throw Error(r.message || r.error || `Generation runs ${n.status}`);
				return (r.runs || []).map((e) => this.generationRunStateToPage(e)).filter((e) => e.id);
			},
			async loadGeneratedPagesFromServer(e = {}) {
				if (window.location.protocol === "file:") {
					this.generatedPages = [], this.generatedPagesError = "", this.generatedPagesLoaded = !0;
					return;
				}
				this.generatedPagesLoading = !0, this.generatedPagesError = "";
				try {
					let t = new URLSearchParams({ limit: "50" });
					e.fresh && t.set("ts", String(Date.now()));
					let n = await fetch(`/api/promo-design-assets?${t.toString()}`), r = await n.json().catch(() => ({}));
					if (!n.ok) throw Error(r.message || r.error || `API ${n.status}`);
					let i = (r.runs || []).map((e) => this.storedResultToPage(e)).filter((e) => e.id), a = await this.loadGenerationRunPages(e).catch(() => []), o = new Map(a.map((e) => [e.id, e]));
					for (let e of i) {
						let t = o.get(e.id);
						t && (this.applyGenerationRunStateToPage(e, {
							run: {
								runId: t.generationRunId,
								status: t.generationRunStatus,
								stage: t.generationRunStage,
								updatedAt: t.generationRunUpdatedAt,
								polling: t.generationPolling
							},
							drafts: t.lofiDrafts,
							confirmedDraft: t.confirmedLofiDraft
						}), o.delete(e.id));
					}
					let s = new Set(i.map((e) => e.id)), c = new Set(o.keys()), l = new Set(e.preserveIds || []), u = this.generatedPages.filter((e) => e.status === "n8n_ui_design_pending" || e.status === "n8n_failed" || l.has(e.id) && !s.has(e.id));
					this.generatedPages = [
						...u.filter((e) => !s.has(e.id) && !c.has(e.id)),
						...Array.from(o.values()).filter((e) => !s.has(e.id)),
						...i
					], await this.refreshGenerationRunStates(this.generatedPages), this.syncGenerationRunPolling(), this.generatedPagesLoaded = !0, e.silent || this.setStatus(`서버에서 생성 결과 ${i.length}개를 불러왔습니다`);
				} catch (t) {
					this.generatedPagesError = t.message, this.generatedPagesLoaded = !0, e.silent || this.setStatus(`생성 결과 목록을 불러오지 못했습니다: ${t.message}`);
				} finally {
					this.generatedPagesLoading = !1;
				}
			},
			refreshGeneratedPages() {
				return this.loadGeneratedPagesFromServer({ fresh: !0 });
			},
			selectStyleGroup(e) {
				this.selectedStyleGroupSlug = e.slug, this.expandedStyleGroupSlug = e.slug;
			},
			syncSlug() {
				this.newMd.slug = m(this.newMd.brandName);
			},
			startResize(e, t) {
				let n = e.currentTarget.closest(".abc-layout");
				n && (e.currentTarget.setPointerCapture(e.pointerId), this.resizeState = {
					handleIndex: t,
					startX: e.clientX,
					startWidths: [...this.sectionWidths],
					totalWidth: n.getBoundingClientRect().width
				}, document.body.classList.add("is-resizing"));
			},
			onResizeMove(e) {
				if (!this.resizeState) return;
				let t = (e.clientX - this.resizeState.startX) / this.resizeState.totalWidth * 100, n = [...this.resizeState.startWidths], r = this.resizeState.handleIndex, i = r + 1;
				n[r] = this.resizeState.startWidths[r] + t, n[i] = this.resizeState.startWidths[i] - t, !(n[r] < 18 || n[i] < 18) && (this.sectionWidths = n);
			},
			stopResize() {
				this.resizeState && (this.resizeState = null, document.body.classList.remove("is-resizing"));
			},
			startAdminResize(e) {
				let t = e.currentTarget.closest(".admin-ab-layout");
				t && (e.currentTarget.setPointerCapture(e.pointerId), this.adminResizeState = {
					startX: e.clientX,
					startWidths: [...this.adminSectionWidths],
					totalWidth: t.getBoundingClientRect().width
				}, document.body.classList.add("is-resizing"));
			},
			onAdminResizeMove(e) {
				if (!this.adminResizeState) return;
				let t = (e.clientX - this.adminResizeState.startX) / this.adminResizeState.totalWidth * 100, n = [this.adminResizeState.startWidths[0] + t, this.adminResizeState.startWidths[1] - t];
				n[0] < 25 || n[1] < 25 || (this.adminSectionWidths = n);
			},
			stopAdminResize() {
				this.adminResizeState && (this.adminResizeState = null, document.body.classList.remove("is-resizing"));
			},
			setStatus(e) {
				this.status = e;
			},
			fieldClass(e) {
				return { "field-invalid": !!this.validationErrors[e] };
			},
			fieldError(e) {
				return this.validationErrors[e] ? "입력해 주세요." : "";
			},
			clearResolvedValidationErrors() {
				if (!Object.keys(this.validationErrors).length) return;
				let e = { ...this.validationErrors }, t = (e, t) => String(e?.[t] || "").trim(), n = {
					title: t(this.promo, "title"),
					promotionPurpose: t(this.promo, "promotionPurpose"),
					promotionPurposeOther: this.promo.promotionPurpose !== "기타" || t(this.promo, "promotionPurposeOther"),
					market: t(this.promo, "market"),
					audience: t(this.simpleBrief, "audience"),
					campaignTone: t(this.simpleBrief, "campaignTone")
				};
				for (let [t, r] of Object.entries(n)) r && delete e[t];
				this.validationErrors = e;
			},
			clearPromoInputs() {
				this.resetPromoBuilderState(), this.setStatus("프로모션 입력값을 초기화했습니다");
			},
			resetPromoBuilderState(e = {}) {
				this.promo = {
					title: "",
					template: "AI Auto",
					promotionPurpose: "",
					promotionPurposeOther: "",
					market: "",
					leadText: "",
					ctaLabel: "",
					ctaUrl: "",
					subline: "",
					alphaText: "",
					termsText: ""
				}, this.simpleBrief = {
					mainOffer: "",
					targetAction: "",
					audience: "",
					campaignTone: "",
					secondaryMessage: ""
				}, this.validationErrors = {}, this.designMode = "ai", this.inputMode = "simple", this.generationMode = "ai_agent", this.globalVisualMode = "auto", this.currentBuilderStep = 1, this.sectionInputs = u(), this.sectionInputsDirty = !1, this.sectionConfig = o(this.templateSchema), this.stopGenerationMotion(), e.rerender && (this.promoBuilderSessionKey += 1);
			},
			autoFillPromoInputs() {
				let e = d();
				this.promo = {
					...this.promo,
					...e.promo,
					template: this.designMode === "advanced" ? "default_temp" : "AI Auto"
				}, this.simpleBrief = { ...e.simpleBrief }, this.inputMode = this.designMode === "advanced" ? "advanced" : "simple", this.generationMode = this.designMode === "advanced" ? "template_advanced" : "ai_agent", this.globalVisualMode = "auto", this.promoBuilderStarted = !0, this.currentBuilderStep = 2, this.sectionInputs = JSON.parse(JSON.stringify(e.sectionInputs)), this.sectionInputsDirty = !0, this.setStatus("Default Temp PDF 기준 프로모션 입력값을 자동등록했습니다");
			},
			openAddDesign() {
				this.newMd = {
					id: "",
					designStyleName: "",
					brandName: "",
					slug: "",
					text: "",
					sourceName: "",
					tokenText: "",
					tokenFileName: ""
				}, this.$nextTick(() => this.$refs.addDesignModal.showModal());
			},
			closeAddDesign() {
				this.$refs.addDesignModal.close();
			},
			async onFileChange(e) {
				let t = e.target.files[0];
				if (t) {
					if (!t.name.toLowerCase().endsWith(".md")) {
						this.setStatus("지원하지 않는 파일입니다");
						return;
					}
					this.newMd.text = await t.text(), this.newMd.sourceName = t.name, this.newMd.designStyleName = h(t.name), this.newMd.brandName = this.newMd.designStyleName, this.newMd.slug = m(this.newMd.designStyleName), this.setStatus("MD 파일을 불러왔습니다");
				}
			},
			async onTokenFileChange(e) {
				let t = e.target.files[0];
				t && (this.newMd.tokenText = await t.text(), this.newMd.tokenFileName = t.name, this.setStatus("디자인 토큰 파일을 불러왔습니다"));
			},
			async registerMarkdown() {
				let t = this.newMd.text.trim();
				if (!t) {
					this.setStatus("MD 파일을 선택해 주세요");
					return;
				}
				if (!this.newMd.tokenText.trim()) {
					this.setStatus("디자인 토큰 파일을 선택해 주세요");
					return;
				}
				let n = this.newMd.designStyleName.trim() || h(this.newMd.sourceName), r = this.newMd.slug.trim() || m(n);
				if (window.location.protocol !== "file:") {
					let e = !!this.newMd.id;
					this.setStatus(e ? "디자인 스타일을 수정 중입니다" : "디자인 스타일을 저장 중입니다");
					try {
						let i = await fetch(e ? `/api/design-document?id=${encodeURIComponent(this.newMd.id)}` : "/api/register-design-md", {
							method: e ? "PATCH" : "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								designStyleName: n,
								brandName: n,
								slug: r,
								rawMarkdown: t,
								designMdMarkdown: t,
								sourceName: this.newMd.sourceName,
								designMdFileName: this.newMd.sourceName,
								designTokenFileName: this.newMd.tokenFileName,
								rawDesignTokensJson: this.newMd.tokenText
							})
						}), a = await i.json().catch(() => ({}));
						if (!i.ok) throw Error(a.message || a.error || `Register ${i.status}`);
						let o = a.document;
						this.closeAddDesign(), await this.loadDesignDocuments({ fresh: !0 }), this.selectDocument(o.id), this.setStatus(e ? "디자인 스타일 수정이 완료되었습니다" : "디자인 스타일 추가가 완료되었습니다");
						return;
					} catch (e) {
						this.setStatus(`등록 실패: ${e.message}`);
						return;
					}
				}
				let i = M({
					id: `doc-${String(this.designDocuments.length + 1).padStart(3, "0")}`,
					brandId: `brand-${r}`,
					brandName: n,
					slug: r,
					markdown: t,
					sourceName: this.newMd.sourceName,
					designTokenFileName: this.newMd.tokenFileName,
					designTokensJson: g(this.newMd.tokenText || "{}"),
					status: "uploaded",
					updatedAt: b()
				});
				this.designDocuments.unshift(i), this.selectDocument(i.id), p(e.documents, this.designDocuments), this.setStatus("디자인 스타일이 등록되었습니다"), this.closeAddDesign();
			},
			selectDocument(t) {
				this.selectedDocumentId = t, this.selectedDesignDetail = null, localStorage.setItem(e.selectedDocumentId, t);
				let n = this.groupInfoForDocument(this.selectedDocument);
				this.expandedStyleGroupSlug = n.slug, this.selectedStyleGroupSlug = n.slug, this.styleSource === "design_md" && this.resetOverride(), this.setStatus("MD를 선택했습니다");
			},
			openDetail(e) {
				this.detailDoc = e, this.modalTab = "outline", this.$nextTick(() => this.$refs.detailModal.showModal()), window.location.protocol !== "file:" && this.loadDesignDocumentDetail(e.id);
			},
			async openSelectedDocumentSource() {
				if (!this.selectedDocument || (this.detailDoc = this.selectedDesignDataSource || this.selectedDocument, this.modalTab = "raw", this.$nextTick(() => this.$refs.detailModal.showModal()), window.location.protocol === "file:")) return;
				let e = await this.fetchDesignDocumentDetail(this.selectedDocument.id);
				!e || e.id !== this.selectedDocumentId || (this.selectedDesignDetail = e, this.detailDoc = e, this.modalTab = "raw");
			},
			closeDetail() {
				this.$refs.detailModal.close();
			},
			async fetchDesignDocumentDetail(e) {
				try {
					let t = await fetch(`/api/design-document?id=${encodeURIComponent(e)}`), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `Detail ${t.status}`);
					return n.document;
				} catch (e) {
					return this.setStatus(`MD 상세 로딩 실패: ${e.message}`), null;
				}
			},
			async loadDesignDocumentDetail(e) {
				let t = await this.fetchDesignDocumentDetail(e);
				return t && (this.detailDoc = t), t;
			},
			async loadSelectedDesignDetail(e) {
				if (!e || window.location.protocol === "file:") return null;
				let t = await this.fetchDesignDocumentDetail(e);
				return !t || t.id !== this.selectedDocumentId ? null : (this.selectedDesignDetail = t, t);
			},
			editDetailDocument() {
				this.detailDoc && (this.newMd = {
					id: this.detailDoc.id,
					designStyleName: this.detailDoc.designStyleName || this.detailDoc.brandName,
					brandName: this.detailDoc.designStyleName || this.detailDoc.brandName,
					slug: this.detailDoc.slug,
					text: this.detailDoc.markdown || "",
					sourceName: this.detailDoc.sourceName || "DESIGN.md",
					tokenText: JSON.stringify(this.detailDoc.designTokensJson || this.detailDoc.rawDesignTokens || {}, null, 2),
					tokenFileName: this.detailDoc.designTokenFileName || "tokens.json"
				}, this.closeDetail(), this.$nextTick(() => this.$refs.addDesignModal.showModal()));
			},
			async reextractDetailDocument() {
				if (!(!this.detailDoc || window.location.protocol === "file:")) {
					this.setStatus("Design MD를 재추출 중입니다");
					try {
						let e = await fetch(`/api/design-document?id=${encodeURIComponent(this.detailDoc.id)}`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ action: "extract" })
						}), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `Extract ${e.status}`);
						this.detailDoc = t.document, await this.loadDesignDocuments({ fresh: !0 }), this.setStatus("Design MD 재추출이 완료되었습니다");
					} catch (e) {
						this.setStatus(`재추출 실패: ${e.message}`);
					}
				}
			},
			async archiveDetailDocument() {
				if (!(!this.detailDoc || window.location.protocol === "file:") && window.confirm(`${this.detailDoc.brandName} MD를 보관 처리할까요?`)) {
					this.setStatus("Design MD를 보관 처리 중입니다");
					try {
						let e = await fetch(`/api/design-document?id=${encodeURIComponent(this.detailDoc.id)}`, { method: "DELETE" }), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `Archive ${e.status}`);
						this.closeDetail(), await this.loadDesignDocuments({ fresh: !0 }), this.selectedDocumentId = this.designDocuments[0]?.id || "", this.setStatus("Design MD를 보관 처리했습니다");
					} catch (e) {
						this.setStatus(`보관 실패: ${e.message}`);
					}
				}
			},
			openConceptDetail() {
				this.$nextTick(() => this.$refs.conceptModal.showModal());
			},
			closeConceptDetail() {
				this.$refs.conceptModal.close();
			},
			resetOverride() {
				this.override = { ...this.sourceStyle };
			},
			hasOverride(e, t) {
				return Object.keys(e).some((n) => e[n] !== t[n]);
			},
			styleSourceLabel() {
				return this.styleSource === "design_md" ? `디자인 MD / ${this.selectedDocument?.brandName || "없음"}` : `회사 기본값 / ${this.selectedPreset.name}`;
			},
			refreshSectionDraft(e = {}) {
				let t = {
					heroBanner: this.sectionInputs?.heroBanner?.visualMode || "auto",
					contentCta: this.sectionInputs?.contentCta?.visualMode || "auto",
					imageTextRow: this.sectionInputs?.imageTextRow?.[0]?.visualMode || "auto"
				};
				this.sectionInputs = f({
					promo: this.promo,
					simpleBrief: this.simpleBrief,
					selectedDocument: this.selectedDocument,
					visualMode: "auto"
				}), this.sectionInputs.heroBanner.visualMode = t.heroBanner, this.sectionInputs.contentCta.visualMode = t.contentCta, Array.isArray(this.sectionInputs.imageTextRow) && this.sectionInputs.imageTextRow[0] && (this.sectionInputs.imageTextRow[0].visualMode = t.imageTextRow), this.promo.leadText = this.simpleBrief.mainOffer || this.sectionInputs.heroBanner.sublineText, this.promo.subline = this.simpleBrief.secondaryMessage || this.sectionInputs.contentCta.longText, this.promo.template = this.designMode === "advanced" ? "default_temp" : "AI Auto", e.silent || this.setStatus("섹션 입력값을 갱신했습니다"), this.sectionInputsDirty = !1;
			},
			hasSectionDraft() {
				let e = String(this.sectionInputs.heroBanner.title || "").trim(), t = String(this.sectionInputs.contentCta.longText || "").trim();
				return !!(e || t);
			},
			sectionInputsForPayload() {
				return !this.sectionInputsDirty && (this.inputMode === "simple" || !this.hasSectionDraft() && String(this.promo.title || "").trim()) && this.refreshSectionDraft({ silent: !0 }), JSON.parse(JSON.stringify(this.sectionInputs));
			},
			buildGeneratedPayload(e) {
				let t = this.sourceStyle, n = this.selectedDesignDataSource || this.selectedDocument, r = this.sectionInputsForPayload(), i = c(this.templateSchema, this.sectionConfig), a = this.repeatImageGenerationTargets(r), o = [...i.imageGenerationTargets, ...a], s = {
					...JSON.parse(JSON.stringify(this.sectionConfig)),
					fixedSections: Object.fromEntries(i.fixedSections.map((e) => [e.sectionId, e.fixedPosition])),
					imageGenerationTargets: o,
					repeatableSets: Object.fromEntries(this.sectionConfigSections.filter((e) => e.repeatableSet).map((e) => [e.sectionId, e.repeatableSet]))
				}, u = r.heroBanner?.cta?.label || r.contentCta?.cta?.label || r.stepBar?.[0]?.ctaLabel || "Learn More", d = r.heroBanner?.cta?.link || r.contentCta?.cta?.link || r.stepBar?.[0]?.link || "#", f = r.titleDescription?.contents || r.footer?.content || "Terms and conditions apply. Please play responsibly.", p = {
					...this.promo,
					template: this.promo.template,
					leadText: this.promo.leadText || r.heroBanner.sublineText || this.simpleBrief.mainOffer,
					subline: this.promo.subline || r.contentCta.longText || this.simpleBrief.secondaryMessage,
					alphaText: this.promo.alphaText || r.heroBanner.alphaText,
					ctaLabel: this.promo.ctaLabel || u,
					ctaUrl: this.promo.ctaUrl || d,
					termsText: this.promo.termsText || f
				}, m = {
					purpose: this.promo.promotionPurpose || this.promo.purpose || "",
					purposeOther: this.promo.promotionPurposeOther || "",
					targetCustomer: this.simpleBrief.audience || "",
					campaignTone: this.simpleBrief.campaignTone || ""
				}, h = l(this.promo.market);
				return {
					id: e,
					generatedAt: b(),
					md: {
						id: n.id,
						brand: n.brandName,
						designStyleId: n.id,
						designStyleName: n.designStyleName || n.brandName,
						slug: n.slug,
						summary: n.summary,
						designMdMarkdown: n.markdown || "",
						designTokenFileName: n.designTokenFileName || "",
						selectedTokens: n.designTokensJson || n.rawDesignTokens || {},
						designConcept: n.designConcept,
						styleClassification: n.styleClassification,
						designPromptContext: n.designConcept?.promptContext || "",
						designData: {
							summary: n.summary,
							metadata: n.metadata || n.metadataItems || [],
							normalizedSchema: n.normalizedSchema || n.tokenSet?.normalizedSchema || null,
							tokenItems: n.tokenItems || [],
							componentPatterns: n.componentPatterns || [],
							layoutPatterns: n.layoutPatterns || [],
							guidelineItems: n.guidelineItems || [],
							componentPatternCount: n.summary?.componentPatternCount || n.componentPatterns?.length || 0,
							layoutPatternCount: n.summary?.layoutPatternCount || n.layoutPatterns?.length || 0,
							guidelineCount: n.summary?.guidelineCount || n.guidelineItems?.length || 0,
							extractionStatus: n.extractionStatus || n.status,
							sourceHash: n.sourceHash || n.tokenSet?.sourceHash || ""
						}
					},
					selectedDesignStyleId: n.id,
					promo: p,
					promotionInput: m,
					marketVisualGuidance: h,
					sectionConfig: s,
					template: {
						id: this.templateSchema.id,
						name: this.templateSchema.name,
						designMode: this.designMode,
						selectionMode: this.designMode === "advanced" ? "manual" : "auto",
						selectedTemplateId: this.designMode === "advanced" ? "default_temp" : "",
						templateId: i.templateId,
						templateName: i.templateName,
						schemaVersion: i.schemaVersion,
						generationMode: this.generationMode,
						inputMode: this.inputMode,
						sectionOrder: i.orderedSections,
						visibleSections: i.visibleSections,
						sectionVisibility: i.sectionVisibility,
						itemVisibility: i.itemVisibility,
						fixedSections: i.fixedSections,
						draggableSections: i.draggableSections,
						imageGenerationTargets: o,
						governance: i.governance,
						promotionInputSchema: i.promotionInputSchema,
						templateForm: i.templateForm,
						generationRules: i.generationRules,
						validationRules: i.validationRules,
						progress: i.progress
					},
					simpleBrief: { ...this.simpleBrief },
					sectionInputs: r,
					design: {
						...this.finalStyle,
						canvasColor: "#000000",
						pageBackgroundColor: "#000000",
						backgroundPolicy: "full_bleed_pure_black_no_gray_artboard"
					},
					selectedDesignTokens: { ...this.finalStyle },
					sourceDesign: { ...t },
					styleSource: this.styleSource,
					styleSourceLabel: this.styleSourceLabel(),
					companyPreset: this.styleSource === "company_default" ? this.selectedPreset.name : null,
					hasOverride: this.hasOverride(this.finalStyle, t),
					inputSnapshot: {
						promo: p,
						promotionInput: m,
						marketVisualGuidance: h,
						simpleBrief: { ...this.simpleBrief },
						sectionInputs: r,
						sectionConfig: s,
						templateRuntime: i
					}
				};
			},
			validatePromoInputs() {
				if (this.validationErrors = {}, !this.selectedDocument) return this.setStatus("먼저 디자인 MD를 선택해 주세요"), !1;
				let e = this.selectedDocument.extractionStatus || this.selectedDocument.status;
				if (window.location.protocol !== "file:" && e !== "ready") return this.setStatus(`선택한 MD가 아직 생성 가능 상태가 아닙니다: ${e || "unknown"}`), !1;
				let t = [
					[
						"title",
						"프로모션 제목",
						this.promo
					],
					[
						"promotionPurpose",
						"프로모션 목적",
						this.promo
					],
					[
						"market",
						"마켓 / 지역",
						this.promo
					]
				].filter(([e, , t]) => !String(t[e] || "").trim());
				this.promo.promotionPurpose === "기타" && !String(this.promo.promotionPurposeOther || "").trim() && t.push([
					"promotionPurposeOther",
					"기타 목적",
					this.promo
				]);
				let n = [[
					"audience",
					"대상 고객",
					this.simpleBrief
				], [
					"campaignTone",
					"캠페인 톤",
					this.simpleBrief
				]].filter(([e, , t]) => !String(t[e] || "").trim()), r = [...t, ...n], i = r.map(([, e]) => e);
				return i.length ? (this.validationErrors = Object.fromEntries(r.map(([e]) => [e, !0])), this.setStatus(`필수 입력 누락: ${i.slice(0, 2).join(", ")}${i.length > 2 ? "..." : ""}`), !1) : (this.validationErrors = {}, !0);
			},
			validateSectionConfig() {
				let e = [];
				for (let t of this.sectionConfigSections) if (t.visible) for (let n of t.items) n.required && n.visible === !1 && e.push(`${t.name} / ${n.label}`);
				return e.length ? (this.setStatus(`필수 섹션 아이템 누락: ${e[0]}`), !1) : !0;
			},
			async triggerN8n(e) {
				let t = window.location.protocol === "file:" ? "" : "/api/generate-ui-design";
				if (!t) throw Error("로컬 파일 모드에서는 서버 Webhook 설정을 사용할 수 없습니다");
				let n = await fetch(t, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(e)
				}), r = (n.headers.get("content-type") || "").includes("application/json") ? await n.json() : { html: await n.text() };
				if (!n.ok) throw Error(r.message || r.error || `n8n ${n.status}`);
				return r;
			},
			startGenerationMotion() {
				this.stopGenerationMotion(), this.isGeneratingDesign = !0, this.generationStatusIndex = 0, this.generationStatusTimer = window.setInterval(() => {
					this.generationStatusIndex += 1;
				}, 2600);
			},
			stopGenerationMotion() {
				this.generationStatusTimer &&= (window.clearInterval(this.generationStatusTimer), null), this.isGeneratingDesign = !1;
			},
			applyStoredDesignResult(e, t) {
				let n = this.storedResultToPage(t, e);
				return n.id ? (Object.assign(e, n, {
					status: "n8n_ui_design_generated",
					errorMessage: ""
				}), !0) : !1;
			},
			async refreshStoredDesignResult(e) {
				if (!e?.id || window.location.protocol === "file:") return !1;
				let t = await fetch(`/api/promo-design-assets?runKey=${encodeURIComponent(e.id)}`), n = await t.json().catch(() => ({}));
				return t.ok ? this.applyStoredDesignResult(e, n) : !1;
			},
			async waitForStoredDesignResult(e, t = {}) {
				let n = t.attempts || 4, r = t.delayMs || 900;
				for (let t = 0; t < n; t += 1) {
					if (await this.refreshStoredDesignResult(e).catch(() => !1)) return !0;
					t < n - 1 && await ne(r);
				}
				return !1;
			},
			async generateUiDesign() {
				if (this.isGeneratingDesign) return;
				if (!this.selectedDocument) {
					this.setStatus("먼저 MD를 선택해 주세요");
					return;
				}
				if (!this.validatePromoInputs() || !this.validateSectionConfig()) return;
				await this.loadSelectedDesignDetail(this.selectedDocumentId);
				let e = te(), t = this.buildGeneratedPayload(e), n = x(t.generatedAt);
				this.setStatus("AI가 요청 사항을 접수 중입니다"), this.startGenerationMotion(), await this.$nextTick(), await new Promise((e) => {
					window.requestAnimationFrame ? window.requestAnimationFrame(e) : window.setTimeout(e, 0);
				});
				let r = {
					id: e,
					title: t.promo.title,
					selectedMd: t.md.brand,
					styleSourceLabel: t.styleSourceLabel,
					template: t.promo.template,
					market: t.promo.market,
					createdAt: t.generatedAt,
					committedAt: "",
					timestampStamp: n,
					status: "n8n_ui_design_pending",
					designUrl: "",
					imageUrl: "",
					pageUrl: "",
					layoutMapping: null,
					mdComplianceMap: null,
					imagePrompt: "",
					promptGroupId: "",
					designPromptStorageKey: "",
					promoInputStorageKey: "",
					integratedBriefStorageKey: "",
					generationRunId: "",
					generationRunStatus: "",
					generationRunStage: "",
					generationPolling: null,
					lofiDrafts: [],
					confirmedLofiDraft: null,
					currentLofiDraft: null,
					lofiDraftPreviewUrl: "",
					errorMessage: "",
					hasOverride: t.hasOverride,
					resultType: "pending",
					payload: t
				};
				this.generatedPages.unshift(r);
				let i = null;
				try {
					i = await this.triggerN8n(t);
				} catch (e) {
					if (await this.waitForStoredDesignResult(r, {
						attempts: 5,
						delayMs: 1200
					}).catch(() => !1)) {
						this.currentBuilderStep = this.builderSteps.length, this.setStatus("n8n 응답은 지연됐지만 저장된 UI 디자인을 확인했습니다"), this.stopGenerationMotion(), this.closePromoBuilder({ endSession: !0 }), r.pageUrl && window.open(r.pageUrl, "_blank");
						return;
					}
					r.status = "n8n_failed", r.errorMessage = e.message, this.setStatus(`n8n 실행 실패. 서버 저장 결과를 확인하지 못했습니다: ${e.message}`), this.stopGenerationMotion();
					return;
				}
				r.status = i ? "n8n_ui_design_generated" : "draft", r.designUrl = S(i?.designUrl || w(r.id), r.id), r.imageUrl = i?.imageUrl || "", r.pageUrl = S(i?.designUrl || i?.pageUrl || i?.previewUrl || w(r.id), r.id) || i?.imageUrl || "", r.resultType = i?.resultType || this.resultType(r), r.layoutMapping = i?.layoutMapping || null, r.mdComplianceMap = i?.mdComplianceMap || null, r.imagePrompt = i?.imagePrompt || "", r.promptGroupId = i?.promptGroupId || "", r.designPromptStorageKey = i?.designPromptStorageKey || "", r.promoInputStorageKey = i?.promoInputStorageKey || "", r.integratedBriefStorageKey = i?.integratedBriefStorageKey || "";
				let a = i?.committedAt || r.committedAt;
				r.committedAt = a ? y(a) : r.committedAt, r.timestampStamp = i?.timestampStamp || x(a || r.createdAt), r.payload = i?.payload || t, await this.waitForStoredDesignResult(r, {
					attempts: 5,
					delayMs: 900
				}).catch(() => !1), await this.loadGeneratedPagesFromServer({
					silent: !0,
					fresh: !0,
					preserveIds: [r.id]
				}), this.currentBuilderStep = this.builderSteps.length, this.setStatus(i ? "n8n UI 디자인 생성이 완료되었습니다" : "로컬 UI 디자인 생성이 완료되었습니다"), this.stopGenerationMotion(), this.closePromoBuilder({ endSession: !0 }), r.pageUrl && window.open(r.pageUrl, "_blank");
			},
			generatePage() {
				return this.generateUiDesign();
			},
			async openGenerated(t) {
				(t.status === "n8n_failed" || !t.pageUrl || !t.designUrl) && await this.refreshStoredDesignResult(t).catch(() => !1);
				let n = S(t.pageUrl || t.designUrl || "", t.id);
				if (n) {
					window.open(n, "_blank");
					return;
				}
				let r = this.previewImageUrl(t);
				if (r) {
					window.open(r, "_blank");
					return;
				}
				p(e.generatedPage, t.payload), window.open("generated.html", "_blank");
			},
			canOpenPromptFiles(e) {
				return !!(e?.promptGroupId || e?.designPromptStorageKey || e?.promoInputStorageKey || e?.integratedBriefStorageKey || e?.id && !e?.generationRunId);
			},
			async openPromptFiles(e) {
				if (!this.canOpenPromptFiles(e)) {
					this.setStatus("저장된 프롬프트 MD 파일 정보가 없습니다");
					return;
				}
				e.promptGroupId || await this.refreshStoredDesignResult(e).catch(() => !1), this.promptModalPage = e, this.promptModalLoading = !0, this.promptModalError = "", this.promptModalDesignMarkdown = "", this.promptModalIntegratedMarkdown = "", this.promptModalPromoMarkdown = "", this.$nextTick(() => {
					this.$refs.promptFilesModal.open || this.$refs.promptFilesModal.showModal();
				});
				try {
					let [t, n] = await Promise.all([this.fetchPromptMarkdown(e, "design_prompt_markdown"), this.fetchPromptMarkdown(e, "promo_input_markdown")]), r = await this.fetchPromptMarkdown(e, "integrated_design_brief_markdown").catch(() => null);
					this.promptModalDesignMarkdown = t.markdown || "", this.promptModalPromoMarkdown = n.markdown || "", this.promptModalIntegratedMarkdown = r?.markdown || this.extractIntegratedDesignBrief(t.markdown || ""), this.setStatus("프롬프트 MD 파일을 불러왔습니다");
				} catch (e) {
					this.promptModalError = e.message, this.setStatus(`프롬프트 MD 파일을 불러오지 못했습니다: ${e.message}`);
				} finally {
					this.promptModalLoading = !1;
				}
			},
			async fetchPromptMarkdown(e, t) {
				let n = new URLSearchParams({ type: t });
				e.promptGroupId ? n.set("promptGroupId", e.promptGroupId) : n.set("runKey", e.id);
				let r = await fetch(`/api/promo-design-markdown?${n.toString()}`), i = await r.json().catch(() => ({}));
				if (!r.ok) throw Error(i.message || i.error || `Markdown ${r.status}`);
				return i;
			},
			extractIntegratedDesignBrief(e) {
				let t = String(e || ""), n = t.match(/## Integrated Design Brief\s*\n([\s\S]*?)(?=\n## Integrated Design Brief JSON|\n## Layout Mapping|\n## MD Compliance Map|\n## [^\n]+|$)/)?.[1]?.trim() || "";
				if (n && !/^_No integrated design brief markdown/i.test(n)) return n;
				let r = t.match(/## Integrated Design Brief JSON\s*\n\s*```json\s*([\s\S]*?)```/);
				return r?.[1] ? r[1].trim() : "";
			},
			downloadPromptMarkdown(e) {
				let t = {
					design: {
						markdown: this.promptModalDesignMarkdown,
						storageKey: this.promptModalPage?.designPromptStorageKey,
						fallbackName: "design-prompt"
					},
					promo: {
						markdown: this.promptModalPromoMarkdown,
						storageKey: this.promptModalPage?.promoInputStorageKey,
						fallbackName: "promo-input"
					},
					integrated: {
						markdown: this.promptModalIntegratedMarkdown,
						storageKey: this.promptModalPage?.integratedBriefStorageKey,
						fallbackName: "integrated-design-brief"
					}
				}[e];
				if (!t?.markdown) {
					this.setStatus("다운로드할 Markdown 내용이 없습니다");
					return;
				}
				let n = this.promptModalPage?.id || "promo", r = this.promptModalPage?.timestampStamp || x(/* @__PURE__ */ new Date()), i = this.markdownDownloadFilename(t.storageKey, `${t.fallbackName}-${n}-${r}.md`), a = new Blob([t.markdown], { type: "text/markdown;charset=utf-8" }), o = URL.createObjectURL(a), s = document.createElement("a");
				s.href = o, s.download = i, document.body.appendChild(s), s.click(), s.remove(), URL.revokeObjectURL(o), this.setStatus(`${i} 다운로드를 시작했습니다`);
			},
			markdownDownloadFilename(e, t) {
				let n = String(e || "").split("/").pop() || t;
				return (n.endsWith(".md") ? n : `${n}.md`).replace(/[<>:"/\\|?*\x00-\x1F]/g, "-").replace(/\s+/g, " ").trim();
			},
			closePromptFilesModal() {
				this.$refs.promptFilesModal.close();
			}
		}
	});
	le.component("template-layout-manager", window.PromoAdminTemplateLayout.component), le.component("section-layout-preset-manager", window.PromoAdminSectionLayouts.component), le.component("design-token-manager", window.PromoAdminDesignTokens.component), le.component("llm-model-manager", window.PromoAdminLlmModels.component), le.component("prompt-variable-manager", window.PromoAdminPromptVariables.component), le.component("component-generation-workspace", window.PromoAdminComponentGeneration.component), le.component("render-spec-editor", window.PromoAdminComponentGeneration.renderSpecEditor), le.component("directus-integration-settings", window.PromoAdminIntegrations.directusSettings), le.component("layout-reference-manager", window.PromoAdminLayoutReferences.component), (window.PromoI18n?.init?.() || Promise.resolve()).finally(() => le.mount("#app"));
}));
Bh(document), globalThis.Vue = Lh, globalThis.PromoAdminTemplateLayout = Object.freeze({
	service: Kh,
	component: fg
}), globalThis.PromoAdminDesignTokens = Object.freeze({
	service: hg,
	component: K_
}), globalThis.PromoAdminPromptGroups = sv, globalThis.PromoAdminModelCatalog = _v, globalThis.PromoAdminLlmModels = Object.freeze({
	service: yv,
	component: ny
}), globalThis.PromoAdminPromptVariables = Object.freeze({
	service: iy,
	component: Cy
}), globalThis.PromoAdminSectionLayouts = Object.freeze({
	service: Dy,
	component: $w
}), globalThis.PromoAdminComponentGeneration = Object.freeze({
	component: KE,
	renderSpecEditor: jT
}), globalThis.PromoAdminIntegrations = Object.freeze({ directusSettings: xD }), globalThis.PromoAdminLayoutReferences = Object.freeze({
	service: bP,
	component: gF
}), await Promise.resolve().then(() => /* @__PURE__ */ u(_F()));
//#endregion
