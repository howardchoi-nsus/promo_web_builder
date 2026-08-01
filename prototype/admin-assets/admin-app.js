//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, a) => (a = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n));
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.39/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function u(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var d = {}, f = [], p = () => {}, m = () => !1, h = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), g = (e) => e.startsWith("onUpdate:"), _ = Object.assign, v = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, y = Object.prototype.hasOwnProperty, b = (e, t) => y.call(e, t), x = Array.isArray, S = (e) => re(e) === "[object Map]", C = (e) => re(e) === "[object Set]", w = (e) => re(e) === "[object Date]", ee = (e) => re(e) === "[object RegExp]", T = (e) => typeof e == "function", E = (e) => typeof e == "string", D = (e) => typeof e == "symbol", O = (e) => typeof e == "object" && !!e, te = (e) => (O(e) || T(e)) && T(e.then) && T(e.catch), ne = Object.prototype.toString, re = (e) => ne.call(e), ie = (e) => re(e).slice(8, -1), ae = (e) => re(e) === "[object Object]", oe = (e) => E(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, se = /* @__PURE__ */ u(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ce = /* @__PURE__ */ u("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), le = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ue = /-\w/g, k = le((e) => e.replace(ue, (e) => e.slice(1).toUpperCase())), de = /\B([A-Z])/g, A = le((e) => e.replace(de, "-$1").toLowerCase()), fe = le((e) => e.charAt(0).toUpperCase() + e.slice(1)), pe = le((e) => e ? `on${fe(e)}` : ""), j = (e, t) => !Object.is(e, t), me = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, he = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ge = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, _e = (e) => {
	let t = E(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ve, ye = () => ve ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function be(e, t) {
	return e + JSON.stringify(t, (e, t) => typeof t == "function" ? t.toString() : t);
}
var xe = /* @__PURE__ */ u("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");
function Se(e) {
	if (x(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = E(r) ? Ee(r) : Se(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (E(e) || O(e)) return e;
}
var Ce = /;(?![^(]*\))/g, we = /:([^]+)/, Te = /\/\*[^]*?\*\//g;
function Ee(e) {
	let t = {};
	return e.replace(Te, "").split(Ce).forEach((e) => {
		if (e) {
			let n = e.split(we);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function De(e) {
	let t = "";
	if (E(e)) t = e;
	else if (x(e)) for (let n = 0; n < e.length; n++) {
		let r = De(e[n]);
		r && (t += r + " ");
	}
	else if (O(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function Oe(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !E(t) && (e.class = De(t)), n && (e.style = Se(n)), e;
}
var ke = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", Ae = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", je = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", Me = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Ne = /* @__PURE__ */ u(ke), Pe = /* @__PURE__ */ u(Ae), Fe = /* @__PURE__ */ u(je), Ie = /* @__PURE__ */ u(Me), Le = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Re = /* @__PURE__ */ u(Le);
Le + "";
function ze(e) {
	return !!e || e === "";
}
function Be(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Ve(e[r], t[r]);
	return n;
}
function Ve(e, t) {
	if (e === t) return !0;
	let n = w(e), r = w(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = D(e), r = D(t), n || r) return e === t;
	if (n = x(e), r = x(t), n || r) return n && r ? Be(e, t) : !1;
	if (n = O(e), r = O(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Ve(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function He(e, t) {
	return e.findIndex((e) => Ve(e, t));
}
var Ue = (e) => !!(e && e.__v_isRef === !0), M = (e) => E(e) ? e : e == null ? "" : x(e) || O(e) && (e.toString === ne || !T(e.toString)) ? Ue(e) ? M(e.value) : JSON.stringify(e, We, 2) : String(e), We = (e, t) => Ue(t) ? We(e, t.value) : S(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ge(t, r) + " =>"] = n, e), {}) } : C(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ge(e)) } : D(t) ? Ge(t) : O(t) && !x(t) && !ae(t) ? String(t) : t, Ge = (e, t = "") => D(e) ? `Symbol(${e.description ?? t})` : e;
function Ke(e) {
	return e == null ? "initial" : typeof e == "string" ? e === "" ? " " : e : String(e);
}
//#endregion
//#region node_modules/.pnpm/@vue+reactivity@3.5.39/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var qe, Je = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && qe && (qe.active ? (this.parent = qe, this.index = (qe.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = qe;
			try {
				return qe = this, e();
			} finally {
				qe = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = qe, qe = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (qe === this) qe = this.prevScope;
			else {
				let e = qe;
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
};
function Ye(e) {
	return new Je(e);
}
function Xe() {
	return qe;
}
function Ze(e, t = !1) {
	qe && qe.cleanups.push(e);
}
var N, Qe = /* @__PURE__ */ new WeakSet(), $e = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, qe && (qe.active ? qe.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Qe.has(this) && (Qe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || rt(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, vt(this), ot(this);
		let e = N, t = mt;
		N = this, mt = !0;
		try {
			return this.fn();
		} finally {
			st(this), N = e, mt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ut(e);
			this.deps = this.depsTail = void 0, vt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Qe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ct(this) && this.run();
	}
	get dirty() {
		return ct(this);
	}
}, et = 0, tt, nt;
function rt(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = nt, nt = e;
		return;
	}
	e.next = tt, tt = e;
}
function it() {
	et++;
}
function at() {
	if (--et > 0) return;
	if (nt) {
		let e = nt;
		for (nt = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; tt;) {
		let t = tt;
		for (tt = void 0; t;) {
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
function ot(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function st(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ut(r), dt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ct(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (lt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function lt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === yt) || (e.globalVersion = yt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ct(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = N, r = mt;
	N = e, mt = !0;
	try {
		ot(e);
		let n = e.fn(e._value);
		(t.version === 0 || j(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, mt = r, st(e), e.flags &= -3;
	}
}
function ut(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ut(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function dt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function ft(e, t) {
	e.effect instanceof $e && (e = e.effect.fn);
	let n = new $e(e);
	t && _(n, t);
	try {
		n.run();
	} catch (e) {
		throw n.stop(), e;
	}
	let r = n.run.bind(n);
	return r.effect = n, r;
}
function pt(e) {
	e.effect.stop();
}
var mt = !0, ht = [];
function gt() {
	ht.push(mt), mt = !1;
}
function _t() {
	let e = ht.pop();
	mt = e === void 0 || e;
}
function vt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = N;
		N = void 0;
		try {
			t();
		} finally {
			N = e;
		}
	}
}
var yt = 0, bt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, xt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!N || !mt || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new bt(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, St(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, yt++, this.notify(e);
	}
	notify(e) {
		it();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			at();
		}
	}
};
function St(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) St(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ct = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ Symbol(""), Tt = /* @__PURE__ */ Symbol(""), Et = /* @__PURE__ */ Symbol("");
function Dt(e, t, n) {
	if (mt && N) {
		let t = Ct.get(e);
		t || Ct.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new xt()), r.map = t, r.key = n), r.track();
	}
}
function Ot(e, t, n, r, i, a) {
	let o = Ct.get(e);
	if (!o) {
		yt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (it(), t === "clear") o.forEach(s);
	else {
		let i = x(e), a = i && oe(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Et || !D(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Et)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(wt)), S(e) && s(o.get(Tt)));
				break;
			case "delete":
				i || (s(o.get(wt)), S(e) && s(o.get(Tt)));
				break;
			case "set":
				S(e) && s(o.get(wt));
				break;
		}
	}
	at();
}
function kt(e, t) {
	let n = Ct.get(e);
	return n && n.get(t);
}
function At(e) {
	let t = /* @__PURE__ */ P(e);
	return t === e ? t : (Dt(t, "iterate", Et), /* @__PURE__ */ yn(e) ? t : t.map(Sn));
}
function jt(e) {
	return Dt(e = /* @__PURE__ */ P(e), "iterate", Et), e;
}
function Mt(e, t) {
	return /* @__PURE__ */ vn(e) ? Cn(/* @__PURE__ */ _n(e) ? Sn(t) : t) : Sn(t);
}
var Nt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Pt(this, Symbol.iterator, (e) => Mt(this, e));
	},
	concat(...e) {
		return At(this).concat(...e.map((e) => x(e) ? At(e) : e));
	},
	entries() {
		return Pt(this, "entries", (e) => (e[1] = Mt(this, e[1]), e));
	},
	every(e, t) {
		return It(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return It(this, "filter", e, t, (e) => e.map((e) => Mt(this, e)), arguments);
	},
	find(e, t) {
		return It(this, "find", e, t, (e) => Mt(this, e), arguments);
	},
	findIndex(e, t) {
		return It(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return It(this, "findLast", e, t, (e) => Mt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return It(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return It(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Rt(this, "includes", e);
	},
	indexOf(...e) {
		return Rt(this, "indexOf", e);
	},
	join(e) {
		return At(this).join(e);
	},
	lastIndexOf(...e) {
		return Rt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return It(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return zt(this, "pop");
	},
	push(...e) {
		return zt(this, "push", e);
	},
	reduce(e, ...t) {
		return Lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Lt(this, "reduceRight", e, t);
	},
	shift() {
		return zt(this, "shift");
	},
	some(e, t) {
		return It(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return zt(this, "splice", e);
	},
	toReversed() {
		return At(this).toReversed();
	},
	toSorted(e) {
		return At(this).toSorted(e);
	},
	toSpliced(...e) {
		return At(this).toSpliced(...e);
	},
	unshift(...e) {
		return zt(this, "unshift", e);
	},
	values() {
		return Pt(this, "values", (e) => Mt(this, e));
	}
};
function Pt(e, t, n) {
	let r = jt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ yn(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Ft = Array.prototype;
function It(e, t, n, r, i, a) {
	let o = jt(e), s = o !== e && !/* @__PURE__ */ yn(e), c = o[t];
	if (c !== Ft[t]) {
		let t = c.apply(e, a);
		return s ? Sn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Mt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Lt(e, t, n, r) {
	let i = jt(e), a = i !== e && !/* @__PURE__ */ yn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Mt(e, t)), n.call(this, t, Mt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Mt(e, c) : c;
}
function Rt(e, t, n) {
	let r = /* @__PURE__ */ P(e);
	Dt(r, "iterate", Et);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ bn(n[0]) ? (n[0] = /* @__PURE__ */ P(n[0]), r[t](...n)) : i;
}
function zt(e, t, n = []) {
	gt(), it();
	let r = (/* @__PURE__ */ P(e))[t].apply(e, n);
	return at(), _t(), r;
}
var Bt = /* @__PURE__ */ u("__proto__,__v_isRef,__isVue"), Vt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(D));
function Ht(e) {
	D(e) || (e = String(e));
	let t = /* @__PURE__ */ P(this);
	return Dt(t, "has", e), t.hasOwnProperty(e);
}
var Ut = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? un : ln : i ? cn : sn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = x(e);
		if (!r) {
			let e;
			if (a && (e = Nt[t])) return e;
			if (t === "hasOwnProperty") return Ht;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ F(e) ? e : n);
		if ((D(t) ? Vt.has(t) : Bt(t)) || (r || Dt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ F(o)) {
			let e = a && oe(t) ? o : o.value;
			return r && O(e) ? /* @__PURE__ */ mn(e) : e;
		}
		return O(o) ? r ? /* @__PURE__ */ mn(o) : /* @__PURE__ */ fn(o) : o;
	}
}, Wt = class extends Ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = x(e) && oe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ vn(i);
			if (!/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : b(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ F(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? j(n, i) && Ot(e, "set", t, n, i) : Ot(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = b(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ot(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!D(t) || !Vt.has(t)) && Dt(e, "has", t), n;
	}
	ownKeys(e) {
		return Dt(e, "iterate", x(e) ? "length" : wt), Reflect.ownKeys(e);
	}
}, Gt = class extends Ut {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Kt = /* @__PURE__ */ new Wt(), qt = /* @__PURE__ */ new Gt(), Jt = /* @__PURE__ */ new Wt(!0), Yt = /* @__PURE__ */ new Gt(!0), Xt = (e) => e, Zt = (e) => Reflect.getPrototypeOf(e);
function Qt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ P(i), o = S(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Xt : t ? Cn : Sn;
		return !t && Dt(a, "iterate", c ? Tt : wt), _(Object.create(l), { next() {
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
function $t(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function en(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ P(r), a = /* @__PURE__ */ P(n);
			e || (j(n, a) && Dt(i, "get", n), Dt(i, "get", a));
			let { has: o } = Zt(i), s = t ? Xt : e ? Cn : Sn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Dt(/* @__PURE__ */ P(t), "iterate", wt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ P(n), i = /* @__PURE__ */ P(t);
			return e || (j(t, i) && Dt(r, "has", t), Dt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ P(a), s = t ? Xt : e ? Cn : Sn;
			return !e && Dt(o, "iterate", wt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return _(n, e ? {
		add: $t("add"),
		set: $t("set"),
		delete: $t("delete"),
		clear: $t("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ P(this), r = Zt(n), i = /* @__PURE__ */ P(e), a = !t && !/* @__PURE__ */ yn(e) && !/* @__PURE__ */ vn(e) ? i : e;
			return r.has.call(n, a) || j(e, a) && r.has.call(n, e) || j(i, a) && r.has.call(n, i) || (n.add(a), Ot(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = Zt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? j(n, s) && Ot(r, "set", e, n, s) : Ot(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ P(this), { has: n, get: r } = Zt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ P(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ot(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ P(this), t = e.size !== 0, n = e.clear();
			return t && Ot(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Qt(r, e, t);
	}), n;
}
function tn(e, t) {
	let n = en(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(b(n, r) && r in t ? n : t, r, i);
}
var nn = { get: /* @__PURE__ */ tn(!1, !1) }, rn = { get: /* @__PURE__ */ tn(!1, !0) }, an = { get: /* @__PURE__ */ tn(!0, !1) }, on = { get: /* @__PURE__ */ tn(!0, !0) }, sn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap();
function dn(e) {
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
function fn(e) {
	return /* @__PURE__ */ vn(e) ? e : gn(e, !1, Kt, nn, sn);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	return gn(e, !1, Jt, rn, cn);
}
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return gn(e, !0, qt, an, ln);
}
// @__NO_SIDE_EFFECTS__
function hn(e) {
	return gn(e, !0, Yt, on, un);
}
function gn(e, t, n, r, i) {
	if (!O(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = dn(ie(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return /* @__PURE__ */ vn(e) ? /* @__PURE__ */ _n(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function yn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function bn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ P(t) : e;
}
function xn(e) {
	return !b(e, "__v_skip") && Object.isExtensible(e) && he(e, "__v_skip", !0), e;
}
var Sn = (e) => O(e) ? /* @__PURE__ */ fn(e) : e, Cn = (e) => O(e) ? /* @__PURE__ */ mn(e) : e;
// @__NO_SIDE_EFFECTS__
function F(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function wn(e) {
	return En(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Tn(e) {
	return En(e, !0);
}
function En(e, t) {
	return /* @__PURE__ */ F(e) ? e : new Dn(e, t);
}
var Dn = class {
	constructor(e, t) {
		this.dep = new xt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ P(e), this._value = t ? e : Sn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ yn(e) || /* @__PURE__ */ vn(e);
		e = n ? e : /* @__PURE__ */ P(e), j(e, t) && (this._rawValue = e, this._value = n ? e : Sn(e), this.dep.trigger());
	}
};
function On(e) {
	e.dep && e.dep.trigger();
}
function kn(e) {
	return /* @__PURE__ */ F(e) ? e.value : e;
}
function An(e) {
	return T(e) ? e() : kn(e);
}
var jn = {
	get: (e, t, n) => t === "__v_raw" ? e : kn(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Mn(e) {
	return /* @__PURE__ */ _n(e) ? e : new Proxy(e, jn);
}
var Nn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new xt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Pn(e) {
	return new Nn(e);
}
// @__NO_SIDE_EFFECTS__
function Fn(e) {
	let t = x(e) ? Array(e.length) : {};
	for (let n in e) t[n] = zn(e, n);
	return t;
}
var In = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = D(t) ? t : String(t), this._raw = /* @__PURE__ */ P(e);
		let r = !0, i = e;
		if (!x(e) || D(this._key) || !oe(this._key)) do
			r = !/* @__PURE__ */ bn(i) || /* @__PURE__ */ yn(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = kn(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ F(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ F(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return kt(this._raw, this._key);
	}
}, Ln = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function Rn(e, t, n) {
	return /* @__PURE__ */ F(e) ? e : T(e) ? new Ln(e) : O(e) && arguments.length > 1 ? zn(e, t, n) : /* @__PURE__ */ wn(e);
}
function zn(e, t, n) {
	return new In(e, t, n);
}
var Bn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new xt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = yt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && N !== this) return rt(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return lt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Vn(e, t, n = !1) {
	let r, i;
	return T(e) ? r = e : (r = e.get, i = e.set), new Bn(r, i, n);
}
var Hn = {
	GET: "get",
	HAS: "has",
	ITERATE: "iterate"
}, Un = {
	SET: "set",
	ADD: "add",
	DELETE: "delete",
	CLEAR: "clear"
}, Wn = {}, Gn = /* @__PURE__ */ new WeakMap(), Kn = void 0;
function qn() {
	return Kn;
}
function Jn(e, t = !1, n = Kn) {
	if (n) {
		let t = Gn.get(n);
		t || Gn.set(n, t = []), t.push(e);
	}
}
function Yn(e, t, n = d) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ yn(e) || i === !1 || i === 0 ? Xn(e, 1) : Xn(e), u, f, m, h, g = !1, _ = !1;
	if (/* @__PURE__ */ F(e) ? (f = () => e.value, g = /* @__PURE__ */ yn(e)) : /* @__PURE__ */ _n(e) ? (f = () => l(e), g = !0) : x(e) ? (_ = !0, g = e.some((e) => /* @__PURE__ */ _n(e) || /* @__PURE__ */ yn(e)), f = () => e.map((e) => {
		if (/* @__PURE__ */ F(e)) return e.value;
		if (/* @__PURE__ */ _n(e)) return l(e);
		if (T(e)) return c ? c(e, 2) : e();
	})) : f = T(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (m) {
			gt();
			try {
				m();
			} finally {
				_t();
			}
		}
		let t = Kn;
		Kn = u;
		try {
			return c ? c(e, 3, [h]) : e(h);
		} finally {
			Kn = t;
		}
	} : p, t && i) {
		let e = f, t = i === !0 ? Infinity : i;
		f = () => Xn(e(), t);
	}
	let y = Xe(), b = () => {
		u.stop(), y && y.active && v(y.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return b(), n;
		};
	}
	let S = _ ? Array(e.length).fill(Wn) : Wn, C = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || g || (_ ? n.some((e, t) => j(e, S[t])) : j(n, S))) {
				m && m();
				let e = Kn;
				Kn = u;
				try {
					let e = [
						n,
						S === Wn ? void 0 : _ && S[0] === Wn ? [] : S,
						h
					];
					S = n, c ? c(t, 3, e) : t(...e);
				} finally {
					Kn = e;
				}
			}
		} else u.run();
	};
	return s && s(C), u = new $e(f), u.scheduler = o ? () => o(C, !1) : C, h = (e) => Jn(e, !1, u), m = u.onStop = () => {
		let e = Gn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Gn.delete(u);
		}
	}, t ? r ? C(!0) : S = u.run() : o ? o(C.bind(null, !0), !0) : u.run(), b.pause = u.pause.bind(u), b.resume = u.resume.bind(u), b.stop = b, b;
}
function Xn(e, t = Infinity, n) {
	if (t <= 0 || !O(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ F(e)) Xn(e.value, t, n);
	else if (x(e)) for (let r = 0; r < e.length; r++) Xn(e[r], t, n);
	else if (C(e) || S(e)) e.forEach((e) => {
		Xn(e, t, n);
	});
	else if (ae(e)) {
		for (let r in e) Xn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Xn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var Zn = [];
function Qn(e) {
	Zn.push(e);
}
function $n() {
	Zn.pop();
}
function er(e, t) {}
var tr = {
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
}, nr = {
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
};
function rr(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		ar(e, t, n);
	}
}
function ir(e, t, n, r) {
	if (T(e)) {
		let i = rr(e, t, n, r);
		return i && te(i) && i.catch((e) => {
			ar(e, t, n);
		}), i;
	}
	if (x(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(ir(e[a], t, n, r));
		return i;
	}
}
function ar(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || d;
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
			gt(), rr(a, null, 10, [
				e,
				i,
				o
			]), _t();
			return;
		}
	}
	or(e, n, i, r, o);
}
function or(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var sr = [], cr = -1, lr = [], ur = null, dr = 0, fr = /* @__PURE__ */ Promise.resolve(), pr = null;
function mr(e) {
	let t = pr || fr;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function hr(e) {
	let t = cr + 1, n = sr.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = sr[r], a = xr(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function gr(e) {
	if (!(e.flags & 1)) {
		let t = xr(e), n = sr[sr.length - 1];
		!n || !(e.flags & 2) && t >= xr(n) ? sr.push(e) : sr.splice(hr(t), 0, e), e.flags |= 1, _r();
	}
}
function _r() {
	pr ||= fr.then(Sr);
}
function vr(e) {
	x(e) ? lr.push(...e) : ur && e.id === -1 ? ur.splice(dr + 1, 0, e) : e.flags & 1 || (lr.push(e), e.flags |= 1), _r();
}
function yr(e, t, n = cr + 1) {
	for (; n < sr.length; n++) {
		let t = sr[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			sr.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function br(e) {
	if (lr.length) {
		let e = [...new Set(lr)].sort((e, t) => xr(e) - xr(t));
		if (lr.length = 0, ur) {
			ur.push(...e);
			return;
		}
		for (ur = e, dr = 0; dr < ur.length; dr++) {
			let e = ur[dr];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ur = null, dr = 0;
	}
}
var xr = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Sr(e) {
	try {
		for (cr = 0; cr < sr.length; cr++) {
			let e = sr[cr];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), rr(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; cr < sr.length; cr++) {
			let e = sr[cr];
			e && (e.flags &= -2);
		}
		cr = -1, sr.length = 0, br(e), pr = null, (sr.length || lr.length) && Sr(e);
	}
}
var Cr, wr = [];
function Tr(e, t) {
	Cr = e, Cr ? (Cr.enabled = !0, wr.forEach(({ event: e, args: t }) => Cr.emit(e, ...t)), wr = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		Tr(e, t);
	}), setTimeout(() => {
		Cr || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, wr = []);
	}, 3e3)) : wr = [];
}
var Er = null, Dr = null;
function Or(e) {
	let t = Er;
	return Er = e, Dr = e && e.type.__scopeId || null, t;
}
function kr(e) {
	Dr = e;
}
function Ar() {
	Dr = null;
}
var jr = (e) => Mr;
function Mr(e, t = Er, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Os(-1);
		let i = Or(t), a;
		try {
			a = e(...n);
		} finally {
			Or(i), r._d && Os(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function I(e, t) {
	if (Er === null) return e;
	let n = pc(Er), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = d] = t[e];
		i && (T(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Xn(a), r.push({
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
function Nr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (gt(), ir(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), _t());
	}
}
function Pr(e, t) {
	if (Ys) {
		let n = Ys.provides, r = Ys.parent && Ys.parent.provides;
		r === n && (n = Ys.provides = Object.create(r)), n[e] = t;
	}
}
function Fr(e, t, n = !1) {
	let r = Xs();
	if (r || yo) {
		let i = yo ? yo._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && T(t) ? t.call(r && r.proxy) : t;
	}
}
function Ir() {
	return !!(Xs() || yo);
}
var Lr = /* @__PURE__ */ Symbol.for("v-scx"), Rr = () => Fr(Lr);
function zr(e, t) {
	return Ur(e, null, t);
}
function Br(e, t) {
	return Ur(e, null, { flush: "post" });
}
function Vr(e, t) {
	return Ur(e, null, { flush: "sync" });
}
function Hr(e, t, n) {
	return Ur(e, t, n);
}
function Ur(e, t, n = d) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = _({}, n), c = t && r || !t && a !== "post", l;
	if (nc) {
		if (a === "sync") {
			let e = Rr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = p, e.resume = p, e.pause = p, e;
		}
	}
	let u = Ys;
	s.call = (e, t, n) => ir(e, u, t, n);
	let f = !1;
	a === "post" ? s.scheduler = (e) => {
		L(e, u && u.suspense);
	} : a !== "sync" && (f = !0, s.scheduler = (e, t) => {
		t ? e() : gr(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), f && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let m = Yn(e, t, s);
	return nc && (l ? l.push(m) : c && m()), m;
}
function Wr(e, t, n) {
	let r = this.proxy, i = E(e) ? e.includes(".") ? Gr(r, e) : () => r[e] : e.bind(r, r), a;
	T(t) ? a = t : (a = t.handler, n = t);
	let o = $s(this), s = Ur(i, a.bind(r), n);
	return o(), s;
}
function Gr(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Kr = /* @__PURE__ */ new WeakMap(), qr = /* @__PURE__ */ Symbol("_vte"), Jr = (e) => e.__isTeleport, Yr = (e) => e && (e.disabled || e.disabled === ""), Xr = (e) => e && (e.defer || e.defer === ""), Zr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Qr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, $r = (e, t) => {
	let n = e && e.to;
	return E(n) ? t ? t(n) : null : n;
}, ei = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = Yr(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = Yr(e.props), r = e.target = $r(e.props, m), a = ai(r, e, h, p);
			r && (o !== "svg" && Zr(r) ? o = "svg" : o !== "mathml" && Qr(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), ii(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (Kr.get(e) === t) {
					if (Kr.delete(e), Yr(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), ii(e, !0);
					}
					x(e);
				}
			};
			Kr.set(e, t), L(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), Xr(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), ii(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = Kr.get(e);
			if (u) {
				u.flags |= 8, Kr.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = Yr(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || Zr(p) ? o = "svg" : (o === "mathml" || Qr(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), is(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : ti(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = $r(t.props, m);
				e && (t.target = e, ti(t, e, null, l, 0));
			} else g && ti(t, p, h, l, 1);
			ii(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = Yr(f), m = a || !p, h = Kr.get(e);
		if (h && (h.flags |= 8, Kr.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: ti,
	hydrate: ni
};
function ti(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Kr.has(e) && (!d || Yr(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function ni(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = $r(t.props, c), h = Yr(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || ai(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || ai(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), ii(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var ri = ei;
function ii(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function ai(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[qr] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var oi = /* @__PURE__ */ Symbol("_leaveCb"), si = /* @__PURE__ */ Symbol("_enterCb");
function ci() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return fa(() => {
		e.isMounted = !0;
	}), ha(() => {
		e.isUnmounting = !0;
	}), e;
}
var li = [Function, Array], ui = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: li,
	onEnter: li,
	onAfterEnter: li,
	onEnterCancelled: li,
	onBeforeLeave: li,
	onLeave: li,
	onAfterLeave: li,
	onLeaveCancelled: li,
	onBeforeAppear: li,
	onAppear: li,
	onAfterAppear: li,
	onAppearCancelled: li
}, di = (e) => {
	let t = e.subTree;
	return t.component ? di(t.component) : t;
}, fi = {
	name: "BaseTransition",
	props: ui,
	setup(e, { slots: t }) {
		let n = Xs(), r = ci();
		return () => {
			let i = t.default && bi(t.default(), !0), a = i && i.length ? pi(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ P(e), { mode: s } = o;
			if (r.isLeaving) return _i(a);
			let c = vi(a);
			if (!c) return _i(a);
			let l = gi(c, o, r, n, (e) => l = e);
			c.type !== z && yi(c, l);
			let u = n.subTree && vi(n.subTree);
			if (u && u.type !== z && !Ms(u, c) && di(n).type !== z) {
				let e = gi(u, o, r, n);
				if (yi(u, e), s === "out-in" && c.type !== z) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, _i(a);
				s === "in-out" && c.type !== z ? e.delayLeave = (e, t, n) => {
					let i = hi(r, u);
					i[String(u.key)] = u, e[oi] = () => {
						t(), e[oi] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function pi(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== z) {
			t = n;
			break;
		}
	}
	return t;
}
var mi = fi;
function hi(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function gi(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), S = hi(n, e), C = (e, t) => {
		e && ir(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		C(e, t), x(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, ee = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) if (a) r = g || c;
			else return;
			t[oi] && t[oi](!0);
			let i = S[b];
			i && Ms(e, i) && i.el[oi] && i.el[oi](), C(r, [t]);
		},
		enter(t) {
			if (S[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) if (a) r = _ || l, i = v || u, o = y || d;
			else return;
			let s = !1;
			t[si] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[si] = void 0);
			};
			let c = t[si].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[si] && t[si](!0), n.isUnmounting) return r();
			C(f, [t]);
			let a = !1;
			t[oi] = (n) => {
				a || (a = !0, r(), C(n ? h : m, [t]), t[oi] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[oi].bind(null, !1);
			S[i] = e, p ? w(p, [t, o]) : o();
		},
		clone(e) {
			let a = gi(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
}
function _i(e) {
	if (ea(e)) return e = Rs(e), e.children = null, e;
}
function vi(e) {
	if (!ea(e)) return Jr(e.type) && e.children ? pi(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && T(n.default)) return n.default();
	}
}
function yi(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, yi(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function bi(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(bi(o.children, t, s))) : (t || o.type !== z) && r.push(s == null ? o : Rs(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
// @__NO_SIDE_EFFECTS__
function xi(e, t) {
	return T(e) ? /* @__PURE__ */ _({ name: e.name }, t, { setup: e }) : e;
}
function Si() {
	let e = Xs();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Ci(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function wi(e) {
	let t = Xs(), n = /* @__PURE__ */ Tn(null);
	if (t) {
		let r = t.refs === d ? t.refs = {} : t.refs;
		Object.defineProperty(r, e, {
			enumerable: !0,
			get: () => n.value,
			set: (e) => n.value = e
		});
	}
	return n;
}
function Ti(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Ei = /* @__PURE__ */ new WeakMap();
function Di(e, t, n, r, i = !1) {
	if (x(e)) {
		e.forEach((e, a) => Di(e, t && (x(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Zi(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Di(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? pc(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === d ? s.refs = {} : s.refs, f = s.setupState, p = /* @__PURE__ */ P(f), h = f === d ? m : (e) => !Ti(u, e) && b(p, e), g = (e, t) => !(t && Ti(u, t));
	if (l != null && l !== c) {
		if (Oi(t), E(l)) u[l] = null, h(l) && (f[l] = null);
		else if (/* @__PURE__ */ F(l)) {
			let e = t;
			g(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (T(c)) {
		gt();
		try {
			rr(c, s, 12, [o, u]);
		} finally {
			_t();
		}
	} else {
		let t = E(c), r = /* @__PURE__ */ F(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? h(c) ? f[c] : u[c] : g(c) || !e.k ? c.value : u[e.k];
					if (i) x(n) && v(n, a);
					else if (x(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], h(c) && (f[c] = u[c]);
					else {
						let t = [a];
						g(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, h(c) && (f[c] = o)) : r && (g(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Ei.delete(e);
				};
				t.id = -1, Ei.set(e, t), L(t, n);
			} else Oi(e), s();
		}
	}
}
function Oi(e) {
	let t = Ei.get(e);
	t && (t.flags |= 8, Ei.delete(e));
}
var ki = !1, Ai = () => {
	ki ||= (console.error("Hydration completed but contains mismatches."), !0);
}, ji = (e) => e.namespaceURI.includes("svg") && e.tagName !== "foreignObject", Mi = (e) => e.namespaceURI.includes("MathML"), Ni = (e) => {
	if (e.nodeType === 1) {
		if (ji(e)) return "svg";
		if (Mi(e)) return "mathml";
	}
}, Pi = (e) => e.nodeType === 8;
function Fi(e) {
	let { mt: t, p: n, o: { patchProp: r, createText: i, nextSibling: a, parentNode: o, remove: s, insert: c, createComment: l } } = e, u = (e, t) => {
		if (!t.hasChildNodes()) {
			n(null, e, t), br(), t._vnode = e;
			return;
		}
		d(t.firstChild, e, null, null, null), br(), t._vnode = e;
	}, d = (n, r, s, l, u, h = !1) => {
		h ||= !!r.dynamicChildren;
		let b = Pi(n) && n.data === "[", x = () => g(n, r, s, l, u, b), { type: S, ref: C, shapeFlag: w, patchFlag: ee } = r, T = n.nodeType;
		r.el = n, ee === -2 && (h = !1, r.dynamicChildren = null);
		let E = null;
		switch (S) {
			case Ss:
				T === 3 ? (n.data !== r.children && (Ai(), n.data = r.children), E = a(n)) : r.children === "" ? (c(r.el = i(""), o(n), n), E = n) : E = x();
				break;
			case z:
				y(n) ? (E = a(n), v(r.el = n.content.firstChild, n, s)) : E = T !== 8 || b ? x() : a(n);
				break;
			case Cs:
				if (b && (n = a(n), T = n.nodeType), T === 1 || T === 3) {
					E = n;
					let e = !r.children.length;
					for (let t = 0; t < r.staticCount; t++) e && (r.children += E.nodeType === 1 ? E.outerHTML : E.data), t === r.staticCount - 1 && (r.anchor = E), E = a(E);
					return b ? a(E) : E;
				} else x();
				break;
			case R:
				E = b ? m(n, r, s, l, u, h) : x();
				break;
			default: if (w & 1) E = (T !== 1 || r.type.toLowerCase() !== n.tagName.toLowerCase()) && !y(n) ? x() : f(n, r, s, l, u, h);
			else if (w & 6) {
				r.slotScopeIds = u;
				let e = o(n);
				if (E = b ? _(n) : Pi(n) && n.data === "teleport start" ? _(n, n.data, "teleport end") : a(n), t(r, e, null, s, l, Ni(e), h), Zi(r) && !r.type.__asyncResolved) {
					let t;
					b ? (t = U(R), t.anchor = E ? E.previousSibling : e.lastChild) : t = n.nodeType === 3 ? zs("") : U("div"), t.el = n, r.component.subTree = t;
				}
			} else w & 64 ? E = T === 8 ? r.type.hydrate(n, r, s, l, u, h, e, p) : x() : w & 128 && (E = r.type.hydrate(n, r, s, l, Ni(o(n)), u, h, e, d));
		}
		return C != null && Di(C, null, l, r), E;
	}, f = (e, t, n, i, a, o) => {
		o ||= !!t.dynamicChildren;
		let { type: c, dynamicProps: l, props: u, patchFlag: d, shapeFlag: f, dirs: m, transition: g } = t, _ = c === "input" || c === "option", b = !!l;
		if (_ || b || d !== -1) {
			m && Nr(t, null, n, "created");
			let c = !1;
			if (y(e)) {
				c = rs(null, g) && n && n.vnode.props && n.vnode.props.appear;
				let r = e.content.firstChild;
				if (c) {
					let e = r.getAttribute("class");
					e && (r.$cls = e), g.beforeEnter(r);
				}
				v(r, e, n), t.el = e = r;
			}
			if (f & 16 && !(u && (u.innerHTML || u.textContent))) {
				let r = p(e.firstChild, t, e, n, i, a, o);
				for (r && !Ri(e, 1) && Ai(); r;) {
					let e = r;
					r = r.nextSibling, s(e);
				}
			} else if (f & 8) {
				let n = t.children;
				n[0] === "\n" && (e.tagName === "PRE" || e.tagName === "TEXTAREA") && (n = n.slice(1));
				let { textContent: r } = e;
				r !== n && r !== n.replace(/\r\n|\r/g, "\n") && (Ri(e, 0) || Ai(), e.textContent = t.children);
			}
			if (u) {
				if (_ || b || !o || d & 48) {
					let t = e.tagName.includes("-");
					for (let i in u) (_ && (i.endsWith("value") || i === "indeterminate") || h(i) && !se(i) || i[0] === "." || t && !se(i) || l && l.includes(i)) && r(e, i, null, u[i], void 0, n);
				} else if (u.onClick) r(e, "onClick", null, u.onClick, void 0, n);
				else if (d & 4 && /* @__PURE__ */ _n(u.style)) for (let e in u.style) u.style[e];
			}
			let x;
			(x = u && u.onVnodeBeforeMount) && Gs(x, n, t), m && Nr(t, null, n, "beforeMount"), ((x = u && u.onVnodeMounted) || m || c) && ys(() => {
				x && Gs(x, n, t), c && g.enter(e), m && Nr(t, null, n, "mounted");
			}, i);
		}
		return e.nextSibling;
	}, p = (e, t, r, o, s, l, u) => {
		u ||= !!t.dynamicChildren;
		let f = t.children, p = f.length, m = !1;
		for (let t = 0; t < p; t++) {
			let h = u ? f[t] : f[t] = Vs(f[t]), g = h.type === Ss;
			e ? (g && !u && t + 1 < p && Vs(f[t + 1]).type === Ss && (c(i(e.data.slice(h.children.length)), r, a(e)), e.data = h.children), e = d(e, h, o, s, l, u)) : g && !h.children ? c(h.el = i(""), r) : (m || (m = !0, Ri(r, 1) || Ai()), n(null, h, r, null, o, s, Ni(r), l));
		}
		return e;
	}, m = (e, t, n, r, i, s) => {
		let { slotScopeIds: u } = t;
		u && (i = i ? i.concat(u) : u);
		let d = o(e), f = p(a(e), t, d, n, r, i, s);
		return f && Pi(f) && f.data === "]" ? a(t.anchor = f) : (Ai(), c(t.anchor = l("]"), d, f), f);
	}, g = (e, t, r, i, c, l) => {
		if (Bi(e, t) || Ai(), t.el = null, l) {
			let t = _(e);
			for (;;) {
				let n = a(e);
				if (n && n !== t) s(n);
				else break;
			}
		}
		let u = a(e), d = o(e);
		return s(e), n(null, t, d, u, r, i, Ni(d), c), r && (r.vnode.el = t.el, No(r, t.el)), u;
	}, _ = (e, t = "[", n = "]") => {
		let r = 0;
		for (; e;) if (e = a(e), e && Pi(e) && (e.data === t && r++, e.data === n)) {
			if (r === 0) return a(e);
			r--;
		}
		return e;
	}, v = (e, t, n) => {
		let r = t.parentNode;
		r && r.replaceChild(e, t);
		let i = n;
		for (; i;) i.vnode.el === t && (i.vnode.el = i.subTree.el = e), i = i.parent;
	}, y = (e) => e.nodeType === 1 && e.tagName === "TEMPLATE";
	return [u, d];
}
var Ii = "data-allow-mismatch", Li = {
	0: "text",
	1: "children",
	2: "class",
	3: "style",
	4: "attribute"
};
function Ri(e, t) {
	if (t === 0 || t === 1) for (; e && !e.hasAttribute(Ii);) e = e.parentElement;
	return zi(e && e.getAttribute(Ii), t);
}
function zi(e, t) {
	if (e == null) return !1;
	if (e === "") return !0;
	{
		let n = e.split(",");
		return t === 0 && n.includes("children") ? !0 : n.includes(Li[t]);
	}
}
function Bi(e, t) {
	return Ri(e.parentElement, 1) || Vi(e) || Hi(t);
}
function Vi(e) {
	return e.nodeType === 1 && zi(e.getAttribute(Ii), 1);
}
function Hi({ props: e }) {
	let t = e && e[Ii];
	return typeof t == "string" && zi(t, 1);
}
var Ui = ye().requestIdleCallback || ((e) => setTimeout(e, 1)), Wi = ye().cancelIdleCallback || ((e) => clearTimeout(e)), Gi = (e = 1e4) => (t) => {
	let n = Ui(t, { timeout: e });
	return () => Wi(n);
};
function Ki(e) {
	let { top: t, left: n, bottom: r, right: i } = e.getBoundingClientRect(), { innerHeight: a, innerWidth: o } = window;
	return (t > 0 && t < a || r > 0 && r < a) && (n > 0 && n < o || i > 0 && i < o);
}
var qi = (e) => (t, n) => {
	let r = new IntersectionObserver((e) => {
		for (let n of e) if (n.isIntersecting) {
			r.disconnect(), t();
			break;
		}
	}, e);
	return n((e) => {
		if (e instanceof Element) {
			if (Ki(e)) return t(), r.disconnect(), !1;
			r.observe(e);
		}
	}), () => r.disconnect();
}, Ji = (e) => (t) => {
	if (e) {
		let n = matchMedia(e);
		if (n.matches) t();
		else return n.addEventListener("change", t, { once: !0 }), () => n.removeEventListener("change", t);
	}
}, Yi = (e = []) => (t, n) => {
	E(e) && (e = [e]);
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
};
function Xi(e, t) {
	if (Pi(e) && e.data === "[") {
		let n = 1, r = e.nextSibling;
		for (; r;) {
			if (r.nodeType === 1) {
				if (t(r) === !1) break;
			} else if (Pi(r)) if (r.data === "]") {
				if (--n === 0) break;
			} else r.data === "[" && n++;
			r = r.nextSibling;
		}
	} else t(e);
}
var Zi = (e) => !!e.type.__asyncLoader;
// @__NO_SIDE_EFFECTS__
function Qi(e) {
	T(e) && (e = { loader: e });
	let { loader: t, loadingComponent: n, errorComponent: r, delay: i = 200, hydrate: a, timeout: o, suspensible: s = !0, onError: c } = e, l = null, u, d = 0, f = () => (d++, l = null, p()), p = () => {
		let e;
		return l || (e = l = t().catch((e) => {
			if (e = e instanceof Error ? e : Error(String(e)), c) return new Promise((t, n) => {
				c(e, () => t(f()), () => n(e), d + 1);
			});
			throw e;
		}).then((t) => e !== l && l ? l : (t && (t.__esModule || t[Symbol.toStringTag] === "Module") && (t = t.default), u = t, t)));
	};
	return /* @__PURE__ */ xi({
		name: "AsyncComponentWrapper",
		__asyncLoader: p,
		__asyncHydrate(e, t, n) {
			let r = !1;
			(t.bu ||= []).push(() => r = !0);
			let i = () => {
				r || n();
			}, o = a ? () => {
				let n = a(i, (t) => Xi(e, t));
				n && (t.bum ||= []).push(n);
			} : i;
			u ? o() : p().then(() => !t.isUnmounted && o());
		},
		get __asyncResolved() {
			return u;
		},
		setup() {
			let e = Ys;
			if (Ci(e), u) return () => $i(u, e);
			let t = (t) => {
				l = null, ar(t, e, 13, !r);
			};
			if (s && e.suspense || nc) return p().then((t) => () => $i(t, e)).catch((e) => (t(e), () => r ? U(r, { error: e }) : null));
			let a = /* @__PURE__ */ wn(!1), c = /* @__PURE__ */ wn(), d = /* @__PURE__ */ wn(!!i), f, m;
			return ga(() => {
				f != null && clearTimeout(f), m != null && clearTimeout(m);
			}), i && (m = setTimeout(() => {
				e.isUnmounted || (d.value = !1);
			}, i)), o != null && (f = setTimeout(() => {
				if (!e.isUnmounted && !a.value && !c.value) {
					let e = /* @__PURE__ */ Error(`Async component timed out after ${o}ms.`);
					t(e), c.value = e;
				}
			}, o)), p().then(() => {
				e.isUnmounted || (a.value = !0, e.parent && ea(e.parent.vnode) && e.parent.update());
			}).catch((n) => {
				if (e.isUnmounted) {
					l = null;
					return;
				}
				t(n), c.value = n;
			}), () => {
				if (a.value && u) return $i(u, e);
				if (c.value && r) return U(r, { error: c.value });
				if (n && !d.value) return $i(n, e);
			};
		}
	});
}
function $i(e, t) {
	let { ref: n, props: r, children: i, ce: a } = t.vnode, o = U(e, r, i);
	return o.ref = n, o.ce = a, delete t.vnode.ce, o;
}
var ea = (e) => e.type.__isKeepAlive, ta = {
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
		let n = Xs(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), L(() => {
				a.isDeactivated = !1, a.a && me(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && Gs(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ss(t.m), ss(t.a), l(e, f, null, 1, s), L(() => {
				t.da && me(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && Gs(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			sa(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = mc(Zi(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !Ms(t, o)) ? p(t) : o && sa(o), i.delete(e), a.delete(e);
		}
		Hr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => na(e, t)), t && m((e) => !na(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (ls(n.subTree.type) ? L(() => {
				i.set(g, ca(n.subTree));
			}, n.subTree.suspense) : i.set(g, ca(n.subTree)));
		};
		return fa(_), ma(_), ha(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = ca(t);
				if (e.type === i.type && e.key === i.key) {
					sa(i);
					let e = i.component.da;
					e && L(e, r);
					return;
				}
				p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!js(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = ca(r);
			if (s.type === z) return o = null, s;
			let c = s.type, l = mc(Zi(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !na(u, l)) || d && l && na(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = Rs(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && yi(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, ls(r.type) ? r : s;
		};
	}
};
function na(e, t) {
	return x(e) ? e.some((e) => na(e, t)) : E(e) ? e.split(",").includes(t) : ee(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function ra(e, t) {
	aa(e, "a", t);
}
function ia(e, t) {
	aa(e, "da", t);
}
function aa(e, t, n = Ys) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (la(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) ea(e.parent.vnode) && oa(r, t, n, e), e = e.parent;
	}
}
function oa(e, t, n, r) {
	let i = la(t, e, r, !0);
	ga(() => {
		v(r[t], i);
	}, n);
}
function sa(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function ca(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function la(e, t, n = Ys, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			gt();
			let i = $s(n), a = ir(t, n, e, r);
			return i(), _t(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ua = (e) => (t, n = Ys) => {
	(!nc || e === "sp") && la(e, (...e) => t(...e), n);
}, da = ua("bm"), fa = ua("m"), pa = ua("bu"), ma = ua("u"), ha = ua("bum"), ga = ua("um"), _a = ua("sp"), va = ua("rtg"), ya = ua("rtc");
function ba(e, t = Ys) {
	la("ec", e, t);
}
var xa = "components", Sa = "directives";
function Ca(e, t) {
	return Da(xa, e, !0, t) || e;
}
var wa = /* @__PURE__ */ Symbol.for("v-ndc");
function Ta(e) {
	return E(e) ? Da(xa, e, !1) || e : e || wa;
}
function Ea(e) {
	return Da(Sa, e);
}
function Da(e, t, n = !0, r = !1) {
	let i = Er || Ys;
	if (i) {
		let n = i.type;
		if (e === xa) {
			let e = mc(n, !1);
			if (e && (e === t || e === k(t) || e === fe(k(t)))) return n;
		}
		let a = Oa(i[e] || n[e], t) || Oa(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Oa(e, t) {
	return e && (e[t] || e[k(t)] || e[fe(k(t))]);
}
function ka(e, t, n, r) {
	let i, a = n && n[r], o = x(e);
	if (o || E(e)) {
		let n = o && /* @__PURE__ */ _n(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ yn(e), s = /* @__PURE__ */ vn(e), e = jt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Cn(Sn(e[n])) : Sn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (O(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
function Aa(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (x(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function ja(e, t, n = {}, r, i) {
	if (Er.ce || Er.parent && Zi(Er.parent) && Er.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), B(), As(R, null, [U("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), B();
	let o = a && Ma(a(n)), s = n.key || o && o.key, c = As(R, { key: (s && !D(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Ma(e) {
	return e.some((e) => !js(e) || !(e.type === z || e.type === R && !Ma(e.children))) ? e : null;
}
function Na(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : pe(r)] = e[r];
	return n;
}
var Pa = (e) => e ? tc(e) ? pc(e) : Pa(e.parent) : null, Fa = /* @__PURE__ */ _(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Pa(e.parent),
	$root: (e) => Pa(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => ao(e),
	$forceUpdate: (e) => e.f ||= () => {
		gr(e.update);
	},
	$nextTick: (e) => e.n ||= mr.bind(e.proxy),
	$watch: (e) => Wr.bind(e)
}), Ia = (e, t) => e !== d && !e.__isScriptSetup && b(e, t), La = {
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
			else if (Ia(r, t)) return o[t] = 1, r[t];
			else if (i !== d && b(i, t)) return o[t] = 2, i[t];
			else if (b(a, t)) return o[t] = 3, a[t];
			else if (n !== d && b(n, t)) return o[t] = 4, n[t];
			else eo && (o[t] = 0);
		}
		let l = Fa[t], u, f;
		if (l) return t === "$attrs" && Dt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== d && b(n, t)) return o[t] = 4, n[t];
		if (f = c.config.globalProperties, b(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Ia(i, t) ? (i[t] = n, !0) : r !== d && b(r, t) ? (r[t] = n, !0) : b(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== d && s[0] !== "$" && b(e, s) || Ia(t, s) || b(a, s) || b(r, s) || b(Fa, s) || b(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? b(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
}, Ra = /* @__PURE__ */ _({}, La, {
	get(e, t) {
		if (t !== Symbol.unscopables) return La.get(e, t, e);
	},
	has(e, t) {
		return t[0] !== "_" && !xe(t);
	}
});
function za() {
	return null;
}
function Ba() {
	return null;
}
function Va(e) {}
function Ha(e) {}
function Ua() {
	return null;
}
function Wa() {}
function Ga(e, t) {
	return null;
}
function Ka() {
	return Ja("useSlots").slots;
}
function qa() {
	return Ja("useAttrs").attrs;
}
function Ja(e) {
	let t = Xs();
	return t.setupContext ||= fc(t);
}
function Ya(e) {
	return x(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Xa(e, t) {
	let n = Ya(e);
	for (let e in t) {
		if (e.startsWith("__skip")) continue;
		let r = n[e];
		r ? x(r) || T(r) ? r = n[e] = {
			type: r,
			default: t[e]
		} : r.default = t[e] : r === null && (r = n[e] = { default: t[e] }), r && t[`__skip_${e}`] && (r.skipFactory = !0);
	}
	return n;
}
function Za(e, t) {
	return !e || !t ? e || t : x(e) && x(t) ? e.concat(t) : _({}, Ya(e), Ya(t));
}
function Qa(e, t) {
	let n = {};
	for (let r in e) t.includes(r) || Object.defineProperty(n, r, {
		enumerable: !0,
		get: () => e[r]
	});
	return n;
}
function $a(e) {
	let t = Xs(), n = nc, r = e();
	ec(), n && Qs(!1);
	let i = () => {
		$s(t), n && Qs(!0);
	}, a = () => {
		Xs() !== t && t.scope.off(), ec(), n && Qs(!1);
	};
	return te(r) && (r = r.catch((e) => {
		throw i(), Promise.resolve().then(() => Promise.resolve().then(a)), e;
	})), [r, () => {
		i(), Promise.resolve().then(a);
	}];
}
var eo = !0;
function to(e) {
	let t = ao(e), n = e.proxy, r = e.ctx;
	eo = !1, t.beforeCreate && ro(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: m, updated: h, activated: g, deactivated: _, beforeDestroy: v, beforeUnmount: y, destroyed: b, unmounted: S, render: C, renderTracked: w, renderTriggered: ee, errorCaptured: E, serverPrefetch: D, expose: te, inheritAttrs: ne, components: re, directives: ie, filters: ae } = t;
	if (l && no(l, r, null), o) for (let e in o) {
		let t = o[e];
		T(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		O(t) && (e.data = /* @__PURE__ */ fn(t));
	}
	if (eo = !0, a) for (let e in a) {
		let t = a[e], i = gc({
			get: T(t) ? t.bind(n, n) : T(t.get) ? t.get.bind(n, n) : p,
			set: !T(t) && T(t.set) ? t.set.bind(n) : p
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) io(s[e], r, n, e);
	if (c) {
		let e = T(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			Pr(t, e[t]);
		});
	}
	u && ro(u, e, "c");
	function oe(e, t) {
		x(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (oe(da, d), oe(fa, f), oe(pa, m), oe(ma, h), oe(ra, g), oe(ia, _), oe(ba, E), oe(ya, w), oe(va, ee), oe(ha, y), oe(ga, S), oe(_a, D), x(te)) if (te.length) {
		let t = e.exposed ||= {};
		te.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	C && e.render === p && (e.render = C), ne != null && (e.inheritAttrs = ne), re && (e.components = re), ie && (e.directives = ie), D && Ci(e);
}
function no(e, t, n = p) {
	x(e) && (e = uo(e));
	for (let n in e) {
		let r = e[n], i;
		i = O(r) ? "default" in r ? Fr(r.from || n, r.default, !0) : Fr(r.from || n) : Fr(r), /* @__PURE__ */ F(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function ro(e, t, n) {
	ir(x(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function io(e, t, n, r) {
	let i = r.includes(".") ? Gr(n, r) : () => n[r];
	if (E(e)) {
		let n = t[e];
		T(n) && Hr(i, n);
	} else if (T(e)) Hr(i, e.bind(n));
	else if (O(e)) if (x(e)) e.forEach((e) => io(e, t, n, r));
	else {
		let r = T(e.handler) ? e.handler.bind(n) : t[e.handler];
		T(r) && Hr(i, r, e);
	}
}
function ao(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => oo(c, e, o, !0)), oo(c, t, o)), O(t) && a.set(t, c), c;
}
function oo(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && oo(e, a, n, !0), i && i.forEach((t) => oo(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = so[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var so = {
	data: co,
	props: mo,
	emits: mo,
	methods: po,
	computed: po,
	beforeCreate: fo,
	created: fo,
	beforeMount: fo,
	mounted: fo,
	beforeUpdate: fo,
	updated: fo,
	beforeDestroy: fo,
	beforeUnmount: fo,
	destroyed: fo,
	unmounted: fo,
	activated: fo,
	deactivated: fo,
	errorCaptured: fo,
	serverPrefetch: fo,
	components: po,
	directives: po,
	watch: ho,
	provide: co,
	inject: lo
};
function co(e, t) {
	return t ? e ? function() {
		return _(T(e) ? e.call(this, this) : e, T(t) ? t.call(this, this) : t);
	} : t : e;
}
function lo(e, t) {
	return po(uo(e), uo(t));
}
function uo(e) {
	if (x(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function fo(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function po(e, t) {
	return e ? _(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function mo(e, t) {
	return e ? x(e) && x(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : _(/* @__PURE__ */ Object.create(null), Ya(e), Ya(t ?? {})) : t;
}
function ho(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = _(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = fo(e[r], t[r]);
	return n;
}
function go() {
	return {
		app: null,
		config: {
			isNativeTag: m,
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
var _o = 0;
function vo(e, t) {
	return function(n, r = null) {
		T(n) || (n = _({}, n)), r != null && !O(r) && (r = null);
		let i = go(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: _o++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: xc,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && T(e.install) ? (a.add(e), e.install(c, ...t)) : T(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || U(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, pc(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (ir(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = yo;
				yo = c;
				try {
					return e();
				} finally {
					yo = t;
				}
			}
		};
		return c;
	};
}
var yo = null;
function bo(e, t, n = d) {
	let r = Xs(), i = k(t), a = A(t), o = xo(e, i), s = Pn((o, s) => {
		let c, l = d, u;
		return Vr(() => {
			let t = e[i];
			j(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!j(o, c) && !(l !== d && j(e, l))) return;
				let f = r.vnode.props, p = !!(f && (t in f || i in f || a in f) && (`onUpdate:${t}` in f || `onUpdate:${i}` in f || `onUpdate:${a}` in f));
				p || (c = e, s()), r.emit(`update:${t}`, o), j(e, l) && (j(e, o) && !j(o, u) || p && l !== d && !j(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || d : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var xo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${k(t)}Modifiers`] || e[`${A(t)}Modifiers`];
function So(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || d, i = n, a = t.startsWith("update:"), o = a && xo(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => E(e) ? e.trim() : e)), o.number && (i = n.map(ge)));
	let s, c = r[s = pe(t)] || r[s = pe(k(t))];
	!c && a && (c = r[s = pe(A(t))]), c && ir(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, ir(l, e, 6, i);
	}
}
var Co = /* @__PURE__ */ new WeakMap();
function wo(e, t, n = !1) {
	let r = n ? Co : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!T(e)) {
		let r = (e) => {
			let n = wo(e, t, !0);
			n && (s = !0, _(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (O(e) && r.set(e, null), null) : (x(a) ? a.forEach((e) => o[e] = null) : _(o, a), O(e) && r.set(e, o), o);
}
function To(e, t) {
	return !e || !h(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), b(e, t[0].toLowerCase() + t.slice(1)) || b(e, A(t)) || b(e, t));
}
function Eo(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, _ = Or(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Vs(l.call(t, e, u, d, p, f, m)), y = s;
		} else {
			let e = t;
			v = Vs(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), y = t.props ? s : Oo(s);
		}
	} catch (t) {
		ws.length = 0, ar(t, e, 1), v = U(z);
	}
	let b = v;
	if (y && h !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(g) && (y = ko(y, a)), b = Rs(b, y, !1, !0));
	}
	return n.dirs && (b = Rs(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && yi(b, n.transition), v = b, Or(_), v;
}
function Do(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (js(r)) {
			if (r.type !== z || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Oo = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || h(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ko = (e, t) => {
	let n = {};
	for (let r in e) (!g(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Ao(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? jo(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Mo(o, r, n) && !To(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || jo(r, o, l) : !!o;
	return !1;
}
function jo(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Mo(t, e, a) && !To(n, a)) return !0;
	}
	return !1;
}
function Mo(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && O(r) && O(i) ? !Ve(r, i) : r !== i;
}
function No({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Po = {}, Fo = () => Object.create(Po), Io = (e) => Object.getPrototypeOf(e) === Po;
function Lo(e, t, n, r = !1) {
	let i = {}, a = Fo();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), zo(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ pn(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Ro(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (To(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (b(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = k(o);
					i[t] = Bo(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		zo(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !b(t, a) && ((r = A(a)) === a || !b(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Bo(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !b(t, e)) && (delete a[e], l = !0);
	}
	l && Ot(e.attrs, "set", "");
}
function zo(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (se(c)) continue;
		let l = t[c], u;
		i && b(i, u = k(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : To(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ P(n), r = s || d;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Bo(i, t, s, r[s], e, !b(r, s));
		}
	}
	return o;
}
function Bo(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = b(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && T(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = $s(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === A(n)) && (r = !0));
	}
	return r;
}
var Vo = /* @__PURE__ */ new WeakMap();
function Ho(e, t, n = !1) {
	let r = n ? Vo : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!T(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Ho(e, t, !0);
			_(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return O(e) && r.set(e, f), f;
	if (x(a)) for (let e = 0; e < a.length; e++) {
		let t = k(a[e]);
		Uo(t) && (o[t] = d);
	}
	else if (a) for (let e in a) {
		let t = k(e);
		if (Uo(t)) {
			let n = a[e], r = o[t] = x(n) || T(n) ? { type: n } : _({}, n), i = r.type, c = !1, l = !0;
			if (x(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = T(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = T(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || b(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return O(e) && r.set(e, l), l;
}
function Uo(e) {
	return e[0] !== "$" && !se(e);
}
var Wo = (e) => e === "_" || e === "_ctx" || e === "$stable", Go = (e) => x(e) ? e.map(Vs) : [Vs(e)], Ko = (e, t, n) => {
	if (t._n) return t;
	let r = Mr((...e) => Go(t(...e)), n);
	return r._c = !1, r;
}, qo = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Wo(n)) continue;
		let i = e[n];
		if (T(i)) t[n] = Ko(n, i, r);
		else if (i != null) {
			let e = Go(i);
			t[n] = () => e;
		}
	}
}, Jo = (e, t) => {
	let n = Go(t);
	e.slots.default = () => n;
}, Yo = (e, t, n) => {
	for (let r in t) (n || !Wo(r)) && (e[r] = t[r]);
}, Xo = (e, t, n) => {
	let r = e.slots = Fo();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Yo(r, t, n), n && he(r, "_", e, !0)) : qo(t, r);
	} else t && Jo(e, t);
}, Zo = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = d;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Yo(i, t, n) : (a = !t.$stable, qo(t, i)), o = t;
	} else t && (Jo(e, t), o = { default: 1 });
	if (a) for (let e in i) !Wo(e) && o[e] == null && delete i[e];
}, L = ys;
function Qo(e) {
	return es(e);
}
function $o(e) {
	return es(e, Fi);
}
function es(e, t) {
	let n = ye();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: m, nextSibling: h, setScopeId: g = p, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ms(e, t) && (r = ge(e), A(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ss:
				y(e, t, n, r);
				break;
			case z:
				b(e, t, n, r);
				break;
			case Cs:
				e ?? x(t, n, r, o);
				break;
			case R:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? re(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? Di(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Di(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = h(e), r(e, n, i), e = a;
		r(t, n, i);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && E(e.children, f, null, i, s, ts(e, c), l, d), _ && Nr(e, null, i, "created"), T(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !se(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Gs(p, i, e);
		}
		_ && Nr(e, null, i, "beforeMount");
		let v = rs(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && L(() => {
			try {
				p && Gs(p, i, e), v && g.enter(f), _ && Nr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, T = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ls(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				T(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Hs(e[l]) : Vs(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: f, dirs: p } = t;
		l |= e.patchFlag & 16;
		let m = e.props || d, h = t.props || d, g;
		if (n && ns(n, !1), (g = h.onVnodeBeforeUpdate) && Gs(g, n, t, e), p && Nr(t, e, n, "beforeUpdate"), n && ns(n, !0), f && (!e.dynamicChildren || e.dynamicChildren.length !== f.length) && (l = 0, s = !1, f = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && u(c, ""), f ? O(e.dynamicChildren, f, c, n, r, ts(t, i), o) : s || le(e, t, c, null, n, r, ts(t, i), o, !1), l > 0) {
			if (l & 16) te(c, m, h, n, i);
			else if (l & 2 && m.class !== h.class && a(c, "class", null, h.class, i), l & 4 && a(c, "style", m.style, h.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && f == null && te(c, m, h, n, i);
		((g = h.onVnodeUpdated) || p) && L(() => {
			g && Gs(g, n, t, e), p && Nr(t, e, n, "updated");
		}, r);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === R || !Ms(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, te = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== d) for (let o in t) !se(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (se(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ne = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), E(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && is(e, t, !0)) : le(e, t, n, f, a, o, c, l, u);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : ae(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = Js(e, r, i);
		if (ea(e) && (s.ctx.renderer = be), rc(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, oe, o), !e.el) {
				let r = s.subTree = U(z);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else oe(s, e, t, n, i, a, o);
	}, ae = (e, t, n) => {
		let r = t.component = e.component;
		if (Ao(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			ce(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, oe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = os(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							L(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				ns(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && me(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Gs(d, s, t, c), ns(e, !0);
				let f = Eo(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && No(e, f.el), r && L(r, i), (d = t.props && t.props.onVnodeUpdated) && L(() => Gs(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Zi(t);
				if (ns(e, !1), l && me(l), !m && (o = c && c.onVnodeBeforeMount) && Gs(o, d, t), ns(e, !0), s && Se) {
					let t = () => {
						e.subTree = Eo(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Eo(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && L(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					L(() => Gs(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Zi(d.vnode) && d.vnode.shapeFlag & 256) && e.a && L(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new $e(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => gr(u), ns(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ro(e, t.props, r, n), Zo(e, t.children, n), gt(), yr(e), _t();
	}, le = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				k(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				ue(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && he(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? k(l, f, n, r, i, a, o, s, c) : he(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && E(f, n, r, i, a, o, s, c));
	}, ue = (e, t, n, r, i, a, o, s, c) => {
		e ||= f, t ||= f;
		let l = e.length, u = t.length, d = Math.min(l, u), p;
		for (p = 0; p < d; p++) {
			let r = t[p] = c ? Hs(t[p]) : Vs(t[p]);
			v(e[p], r, n, null, i, a, o, s, c);
		}
		l > u ? he(e, i, a, !0, !1, d) : E(t, n, r, i, a, o, s, c, d);
	}, k = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, p = u - 1;
		for (; l <= d && l <= p;) {
			let r = e[l], u = t[l] = c ? Hs(t[l]) : Vs(t[l]);
			if (Ms(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= p;) {
			let r = e[d], l = t[p] = c ? Hs(t[p]) : Vs(t[p]);
			if (Ms(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			d--, p--;
		}
		if (l > d) {
			if (l <= p) {
				let e = p + 1, d = e < u ? t[e].el : r;
				for (; l <= p;) v(null, t[l] = c ? Hs(t[l]) : Vs(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > p) for (; l <= d;) A(e[l], i, a, !0), l++;
		else {
			let m = l, h = l, g = /* @__PURE__ */ new Map();
			for (l = h; l <= p; l++) {
				let e = t[l] = c ? Hs(t[l]) : Vs(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = m; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					A(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ms(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? A(r, i, a, !0) : (C[u - h] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let w = x ? as(C) : f;
			for (_ = w.length - 1, l = b - 1; l >= 0; l--) {
				let e = h + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || cs(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? de(d, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			de(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, be);
			return;
		}
		if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === Cs) {
			S(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[oi] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), L(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[oi];
				s._isLeaving && s[oi](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (gt(), Di(s, null, n, e, !0), _t()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Zi(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Gs(_, t, e), u & 6) j(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Nr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && L(() => {
			_ && Gs(_, t, e), h && Nr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === R) {
			pe(n, r);
			return;
		}
		if (t === Cs) {
			C(e);
			return;
		}
		let o = () => {
			i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (e.shapeFlag & 1 && a && !a.persisted) {
			let { leave: t, delayLeave: r } = a, i = () => t(n, o);
			r ? r(e.el, o, i) : i();
		} else o();
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, j = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ss(c), ss(l), r && me(r), i.stop(), a && (a.flags |= 8, A(o, e, t, n)), s && L(s, t), L(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[qr];
		return n ? h(n) : t;
	}, _e = !1, ve = (e, t, n) => {
		let r;
		e == null ? t._vnode && (A(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, yr(r), br(), !1);
	}, be = {
		p: v,
		um: A,
		m: de,
		r: fe,
		mt: ie,
		mc: E,
		pc: le,
		pbc: O,
		n: ge,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(be)), {
		render: ve,
		hydrate: xe,
		createApp: vo(ve, xe)
	};
}
function ts({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ns({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function rs(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function is(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (x(r) && x(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Hs(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && is(t, a)), a.type === Ss && (a.patchFlag === -1 && (a = i[e] = Hs(a)), a.el = t.el), a.type === z && !a.el && (a.el = t.el);
	}
}
function as(e) {
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
function os(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : os(t);
}
function ss(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function cs(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? cs(t.subTree) : null;
}
var ls = (e) => e.__isSuspense, us = 0, ds = {
	name: "Suspense",
	__isSuspense: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		if (e == null) ps(t, n, r, i, a, o, s, c, l);
		else {
			if (a && a.deps > 0 && !e.suspense.isInFallback) {
				t.suspense = e.suspense, t.suspense.vnode = t, t.el = e.el;
				return;
			}
			ms(e, t, n, r, i, o, s, c, l);
		}
	},
	hydrate: gs,
	normalize: _s
};
function fs(e, t) {
	let n = e.props && e.props[t];
	T(n) && n();
}
function ps(e, t, n, r, i, a, o, s, c) {
	let { p: l, o: { createElement: u } } = c, d = u("div"), f = e.suspense = hs(e, i, r, t, d, n, a, o, s, c);
	l(null, f.pendingBranch = e.ssContent, d, null, r, f, a, o), f.deps > 0 ? (fs(e, "onPending"), fs(e, "onFallback"), l(null, e.ssFallback, t, n, r, null, a, o), bs(f, e.ssFallback)) : f.resolve(!1, !0);
}
function ms(e, t, n, r, i, a, o, s, { p: c, um: l, o: { createElement: u } }) {
	let d = t.suspense = e.suspense;
	d.vnode = t, t.el = e.el;
	let f = t.ssContent, p = t.ssFallback, { activeBranch: m, pendingBranch: h, isInFallback: g, isHydrating: _ } = d;
	if (h) d.pendingBranch = f, Ms(h, f) ? (c(h, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : g && (_ || (c(m, p, n, r, i, null, a, o, s), bs(d, p)))) : (d.pendingId = us++, _ ? (d.isHydrating = !1, d.activeBranch = h) : l(h, i, d), d.deps = 0, d.effects.length = 0, d.hiddenContainer = u("div"), g ? (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : (c(m, p, n, r, i, null, a, o, s), bs(d, p))) : m && Ms(m, f) ? (c(m, f, n, r, i, d, a, o, s), d.resolve(!0)) : (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 && d.resolve()));
	else if (m && Ms(m, f)) c(m, f, n, r, i, d, a, o, s), bs(d, f);
	else if (fs(t, "onPending"), d.pendingBranch = f, f.shapeFlag & 512 ? d.pendingId = f.component.suspenseId : d.pendingId = us++, c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0) d.resolve();
	else {
		let { timeout: e, pendingId: t } = d;
		e > 0 ? setTimeout(() => {
			d.pendingId === t && d.fallback(p);
		}, e) : e === 0 && d.fallback(p);
	}
}
function hs(e, t, n, r, i, a, o, s, c, l, u = !1) {
	let { p: d, m: f, um: p, n: m, o: { parentNode: h, remove: g } } = l, _, v = xs(e);
	v && t && t.pendingBranch && (_ = t.pendingId, t.deps++);
	let y = e.props ? _e(e.props.timeout) : void 0, b = a, x = {
		vnode: e,
		parent: t,
		parentComponent: n,
		namespace: o,
		container: r,
		hiddenContainer: i,
		deps: 0,
		pendingId: us++,
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
					s === x.pendingId && (f(o, u, a === b && !e ? m(i) : a, 0), vr(c), d && r.ssFallback && (r.ssFallback.el = null));
				}), i && !x.isFallbackMountPending && (h(i.el) === u && (a = m(i), e = !0), p(i, l, x, !0), !g && d && r.ssFallback && L(() => r.ssFallback.el = null, x)), g || f(o, u, a, 0);
			}
			x.isFallbackMountPending = !1, bs(x, o), x.pendingBranch = null, x.isInFallback = !1;
			let y = x.parent, S = !1;
			for (; y;) {
				if (y.pendingBranch) {
					y.effects.push(...c), S = !0;
					break;
				}
				y = y.parent;
			}
			!S && !g && vr(c), x.effects = [], v && t && t.pendingBranch && _ === t.pendingId && (t.deps--, t.deps === 0 && !n && t.resolve()), fs(r, "onResolve");
		},
		fallback(e) {
			if (!x.pendingBranch) return;
			let { vnode: t, activeBranch: n, parentComponent: r, container: i, namespace: a } = x;
			fs(t, "onFallback");
			let o = m(n), l = () => {
				x.isFallbackMountPending = !1, x.isInFallback && (d(null, e, i, o, r, null, a, s, c), bs(x, e));
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
				ar(t, e, 0);
			}).then((a) => {
				if (e.isUnmounted || x.isUnmounted || x.pendingId !== e.suspenseId) return;
				ec(), e.asyncResolved = !0;
				let { vnode: s } = e;
				ac(e, a, !1), i && (s.el = i);
				let c = !i && e.subTree.el;
				t(e, s, h(i || e.subTree.el), i ? null : m(e.subTree), x, o, n), c && (s.placeholder = null, g(c)), No(e, s.el), r && --x.deps === 0 && x.resolve();
			});
		},
		unmount(e, t) {
			x.isUnmounted = !0, x.activeBranch && p(x.activeBranch, n, e, t), x.pendingBranch && p(x.pendingBranch, n, e, t);
		}
	};
	return x;
}
function gs(e, t, n, r, i, a, o, s, c) {
	let l = t.suspense = hs(t, r, n, e.parentNode, document.createElement("div"), null, i, a, o, s, !0), u = c(e, l.pendingBranch = t.ssContent, n, l, a, o);
	return l.deps === 0 && l.resolve(!1, !0), u;
}
function _s(e) {
	let { shapeFlag: t, children: n } = e, r = t & 32;
	e.ssContent = vs(r ? n.default : n), e.ssFallback = r ? vs(n.fallback) : U(z);
}
function vs(e) {
	let t;
	if (T(e)) {
		let n = Ds && e._c;
		n && (e._d = !1, B()), e = e(), n && (e._d = !0, t = Ts, Es());
	}
	return x(e) && (e = Do(e)), e = Vs(e), t && !e.dynamicChildren && (e.dynamicChildren = t.filter((t) => t !== e)), e;
}
function ys(e, t) {
	t && t.pendingBranch ? x(e) ? t.effects.push(...e) : t.effects.push(e) : vr(e);
}
function bs(e, t) {
	e.activeBranch = t;
	let { vnode: n, parentComponent: r } = e, i = t.el;
	for (; !i && t.component;) t = t.component.subTree, i = t.el;
	n.el = i, r && r.subTree === n && (r.vnode.el = i, No(r, i));
}
function xs(e) {
	let t = e.props && e.props.suspensible;
	return t != null && t !== !1;
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Ss = /* @__PURE__ */ Symbol.for("v-txt"), z = /* @__PURE__ */ Symbol.for("v-cmt"), Cs = /* @__PURE__ */ Symbol.for("v-stc"), ws = [], Ts = null;
function B(e = !1) {
	ws.push(Ts = e ? null : []);
}
function Es() {
	ws.pop(), Ts = ws[ws.length - 1] || null;
}
var Ds = 1;
function Os(e, t = !1) {
	Ds += e, e < 0 && Ts && t && (Ts.hasOnce = !0);
}
function ks(e) {
	return e.dynamicChildren = Ds > 0 ? Ts || f : null, Es(), Ds > 0 && Ts && Ts.push(e), e;
}
function V(e, t, n, r, i, a) {
	return ks(H(e, t, n, r, i, a, !0));
}
function As(e, t, n, r, i) {
	return ks(U(e, t, n, r, i, !0));
}
function js(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ms(e, t) {
	return e.type === t.type && e.key === t.key;
}
function Ns(e) {}
var Ps = ({ key: e }) => e ?? null, Fs = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : E(e) || /* @__PURE__ */ F(e) || T(e) ? {
	i: Er,
	r: e,
	k: t,
	f: !!n
} : e);
function H(e, t = null, n = null, r = 0, i = null, a = e === R ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ps(t),
		ref: t && Fs(t),
		scopeId: Dr,
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
		ctx: Er
	};
	return s ? (Us(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= E(n) ? 8 : 16), Ds > 0 && !o && Ts && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ts.push(c), c;
}
var U = Is;
function Is(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === wa) && (e = z), js(e)) {
		let r = Rs(e, t, !0);
		return n && Us(r, n), Ds > 0 && !a && Ts && (r.shapeFlag & 6 ? Ts[Ts.indexOf(e)] = r : Ts.push(r)), r.patchFlag = -2, r;
	}
	if (hc(e) && (e = e.__vccOpts), t) {
		t = Ls(t);
		let { class: e, style: n } = t;
		e && !E(e) && (t.class = De(e)), O(n) && (/* @__PURE__ */ bn(n) && !x(n) && (n = _({}, n)), t.style = Se(n));
	}
	let o = E(e) ? 1 : ls(e) ? 128 : Jr(e) ? 64 : O(e) ? 4 : T(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function Ls(e) {
	return e ? /* @__PURE__ */ bn(e) || Io(e) ? _({}, e) : e : null;
}
function Rs(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ws(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ps(l),
		ref: t && t.ref ? n && a ? x(a) ? a.concat(Fs(t)) : [a, Fs(t)] : Fs(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== R ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Rs(e.ssContent),
		ssFallback: e.ssFallback && Rs(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && yi(u, c.clone(u)), u;
}
function zs(e = " ", t = 0) {
	return U(Ss, null, e, t);
}
function Bs(e, t) {
	let n = U(Cs, null, e);
	return n.staticCount = t, n;
}
function W(e = "", t = !1) {
	return t ? (B(), As(z, null, e)) : U(z, null, e);
}
function Vs(e) {
	return e == null || typeof e == "boolean" ? U(z) : x(e) ? U(R, null, e.slice()) : js(e) ? Hs(e) : U(Ss, null, String(e));
}
function Hs(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Rs(e);
}
function Us(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (x(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Us(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Io(t) ? t._ctx = Er : r === 3 && Er && (Er.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (T(t)) {
		if (r & 65) {
			Us(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Er
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [zs(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ws(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = De([t.class, r.class]));
		else if (e === "style") t.style = Se([t.style, r.style]);
		else if (h(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(x(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !g(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Gs(e, t, n, r = null) {
	ir(e, t, 7, [n, r]);
}
var Ks = go(), qs = 0;
function Js(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Ks, a = {
		uid: qs++,
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
		scope: new Je(!0),
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
		propsOptions: Ho(r, i),
		emitsOptions: wo(r, i),
		emit: null,
		emitted: null,
		propsDefaults: d,
		inheritAttrs: r.inheritAttrs,
		ctx: d,
		data: d,
		props: d,
		attrs: d,
		slots: d,
		refs: d,
		setupState: d,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = So.bind(null, a), e.ce && e.ce(a), a;
}
var Ys = null, Xs = () => Ys || Er, Zs, Qs;
{
	let e = ye(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Zs = t("__VUE_INSTANCE_SETTERS__", (e) => Ys = e), Qs = t("__VUE_SSR_SETTERS__", (e) => nc = e);
}
var $s = (e) => {
	let t = Ys;
	return Zs(e), e.scope.on(), () => {
		e.scope.off(), Zs(t);
	};
}, ec = () => {
	Ys && Ys.scope.off(), Zs(null);
};
function tc(e) {
	return e.vnode.shapeFlag & 4;
}
var nc = !1;
function rc(e, t = !1, n = !1) {
	t && Qs(t);
	let { props: r, children: i } = e.vnode, a = tc(e);
	Lo(e, r, a, t), Xo(e, i, n || t);
	let o = a ? ic(e, t) : void 0;
	return t && Qs(!1), o;
}
function ic(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, La);
	let { setup: r } = n;
	if (r) {
		gt();
		let n = e.setupContext = r.length > 1 ? fc(e) : null, i = $s(e), a = rr(r, e, 0, [e.props, n]), o = te(a);
		if (_t(), i(), (o || e.sp) && !Zi(e) && Ci(e), o) {
			if (a.then(ec, ec), t) return a.then((n) => {
				ac(e, n, t);
			}).catch((t) => {
				ar(t, e, 0);
			});
			e.asyncDep = a;
		} else ac(e, a, t);
	} else uc(e, t);
}
function ac(e, t, n) {
	T(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : O(t) && (e.setupState = Mn(t)), uc(e, n);
}
var oc, sc;
function cc(e) {
	oc = e, sc = (e) => {
		e.render._rc && (e.withProxy = new Proxy(e.ctx, Ra));
	};
}
var lc = () => !oc;
function uc(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && oc && !r.render) {
			let t = r.template || ao(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r, s = _(_({
					isCustomElement: n,
					delimiters: a
				}, i), o);
				r.render = oc(t, s);
			}
		}
		e.render = r.render || p, sc && sc(e);
	}
	{
		let t = $s(e);
		gt();
		try {
			to(e);
		} finally {
			_t(), t();
		}
	}
}
var dc = { get(e, t) {
	return Dt(e, "get", ""), e[t];
} };
function fc(e) {
	return {
		attrs: new Proxy(e.attrs, dc),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function pc(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Mn(xn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Fa) return Fa[n](e);
		},
		has(e, t) {
			return t in e || t in Fa;
		}
	}) : e.proxy;
}
function mc(e, t = !0) {
	return T(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function hc(e) {
	return T(e) && "__vccOpts" in e;
}
var gc = (e, t) => /* @__PURE__ */ Vn(e, t, nc);
function _c(e, t, n) {
	try {
		Os(-1);
		let r = arguments.length;
		return r === 2 ? O(t) && !x(t) ? js(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && js(n) && (n = [n]), U(e, t, n));
	} finally {
		Os(1);
	}
}
function vc() {
	return;
	function e(t, n, r) {
		let i = t[r];
		if (x(i) && i.includes(n) || O(i) && n in i || t.extends && e(t.extends, n, r) || t.mixins && t.mixins.some((t) => e(t, n, r))) return !0;
	}
}
function yc(e, t, n, r) {
	let i = n[r];
	if (i && bc(i, e)) return i;
	let a = t();
	return a.memo = e.slice(), a.cacheIndex = r, n[r] = a;
}
function bc(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (j(n[e], t[e])) return !1;
	return Ds > 0 && Ts && Ts.push(e), !0;
}
var xc = "3.5.39", Sc = p, Cc = nr, wc = Cr, Tc = Tr, Ec = {
	createComponentInstance: Js,
	setupComponent: rc,
	renderComponentRoot: Eo,
	setCurrentRenderingInstance: Or,
	isVNode: js,
	normalizeVNode: Vs,
	getComponentPublicInstance: pc,
	ensureValidVNode: Ma,
	pushWarningContext: Qn,
	popWarningContext: $n
}, Dc = /* @__PURE__ */ s({
	BaseTransition: () => mi,
	BaseTransitionPropsValidators: () => ui,
	Comment: () => z,
	DeprecationTypes: () => null,
	EffectScope: () => Je,
	ErrorCodes: () => tr,
	ErrorTypeStrings: () => Cc,
	Fragment: () => R,
	KeepAlive: () => ta,
	ReactiveEffect: () => $e,
	Static: () => Cs,
	Suspense: () => ds,
	Teleport: () => ri,
	Text: () => Ss,
	TrackOpTypes: () => Hn,
	Transition: () => Vc,
	TransitionGroup: () => Xl,
	TriggerOpTypes: () => Un,
	VueElement: () => Hl,
	assertNumber: () => er,
	callWithAsyncErrorHandling: () => ir,
	callWithErrorHandling: () => rr,
	camelize: () => k,
	capitalize: () => fe,
	cloneVNode: () => Rs,
	compatUtils: () => null,
	computed: () => gc,
	createApp: () => Au,
	createBlock: () => As,
	createCommentVNode: () => W,
	createElementBlock: () => V,
	createElementVNode: () => H,
	createHydrationRenderer: () => $o,
	createPropsRestProxy: () => Qa,
	createRenderer: () => Qo,
	createSSRApp: () => ju,
	createSlots: () => Aa,
	createStaticVNode: () => Bs,
	createTextVNode: () => zs,
	createVNode: () => U,
	customRef: () => Pn,
	defineAsyncComponent: () => Qi,
	defineComponent: () => xi,
	defineCustomElement: () => zl,
	defineEmits: () => Ba,
	defineExpose: () => Va,
	defineModel: () => Wa,
	defineOptions: () => Ha,
	defineProps: () => za,
	defineSSRCustomElement: () => Bl,
	defineSlots: () => Ua,
	devtools: () => wc,
	effect: () => ft,
	effectScope: () => Ye,
	getCurrentInstance: () => Xs,
	getCurrentScope: () => Xe,
	getCurrentWatcher: () => qn,
	getTransitionRawChildren: () => bi,
	guardReactiveProps: () => Ls,
	h: () => _c,
	handleError: () => ar,
	hasInjectionContext: () => Ir,
	hydrate: () => ku,
	hydrateOnIdle: () => Gi,
	hydrateOnInteraction: () => Yi,
	hydrateOnMediaQuery: () => Ji,
	hydrateOnVisible: () => qi,
	initCustomFormatter: () => vc,
	initDirectivesForSSR: () => Fu,
	inject: () => Fr,
	isMemoSame: () => bc,
	isProxy: () => bn,
	isReactive: () => _n,
	isReadonly: () => vn,
	isRef: () => F,
	isRuntimeOnly: () => lc,
	isShallow: () => yn,
	isVNode: () => js,
	markRaw: () => xn,
	mergeDefaults: () => Xa,
	mergeModels: () => Za,
	mergeProps: () => Ws,
	nextTick: () => mr,
	nodeOps: () => Fc,
	normalizeClass: () => De,
	normalizeProps: () => Oe,
	normalizeStyle: () => Se,
	onActivated: () => ra,
	onBeforeMount: () => da,
	onBeforeUnmount: () => ha,
	onBeforeUpdate: () => pa,
	onDeactivated: () => ia,
	onErrorCaptured: () => ba,
	onMounted: () => fa,
	onRenderTracked: () => ya,
	onRenderTriggered: () => va,
	onScopeDispose: () => Ze,
	onServerPrefetch: () => _a,
	onUnmounted: () => ga,
	onUpdated: () => ma,
	onWatcherCleanup: () => Jn,
	openBlock: () => B,
	patchProp: () => Fl,
	popScopeId: () => Ar,
	provide: () => Pr,
	proxyRefs: () => Mn,
	pushScopeId: () => kr,
	queuePostFlushCb: () => vr,
	reactive: () => fn,
	readonly: () => mn,
	ref: () => wn,
	registerRuntimeCompiler: () => cc,
	render: () => Ou,
	renderList: () => ka,
	renderSlot: () => ja,
	resolveComponent: () => Ca,
	resolveDirective: () => Ea,
	resolveDynamicComponent: () => Ta,
	resolveFilter: () => null,
	resolveTransitionHooks: () => gi,
	setBlockTracking: () => Os,
	setDevtoolsHook: () => Tc,
	setTransitionHooks: () => yi,
	shallowReactive: () => pn,
	shallowReadonly: () => hn,
	shallowRef: () => Tn,
	ssrContextKey: () => Lr,
	ssrUtils: () => Ec,
	stop: () => pt,
	toDisplayString: () => M,
	toHandlerKey: () => pe,
	toHandlers: () => Na,
	toRaw: () => P,
	toRef: () => Rn,
	toRefs: () => Fn,
	toValue: () => An,
	transformVNodeArgs: () => Ns,
	triggerRef: () => On,
	unref: () => kn,
	useAttrs: () => qa,
	useCssModule: () => Gl,
	useCssVars: () => ll,
	useHost: () => Ul,
	useId: () => Si,
	useModel: () => bo,
	useSSRContext: () => Rr,
	useShadowRoot: () => Wl,
	useSlots: () => Ka,
	useTemplateRef: () => wi,
	useTransitionState: () => ci,
	vModelCheckbox: () => su,
	vModelDynamic: () => mu,
	vModelRadio: () => lu,
	vModelSelect: () => uu,
	vModelText: () => G,
	vShow: () => al,
	version: () => xc,
	warn: () => Sc,
	watch: () => Hr,
	watchEffect: () => zr,
	watchPostEffect: () => Br,
	watchSyncEffect: () => Vr,
	withAsyncContext: () => $a,
	withCtx: () => Mr,
	withDefaults: () => Ga,
	withDirectives: () => I,
	withKeys: () => Su,
	withMemo: () => yc,
	withModifiers: () => bu,
	withScopeId: () => jr
}), Oc = void 0, kc = typeof window < "u" && window.trustedTypes;
if (kc) try {
	Oc = /* @__PURE__ */ kc.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ac = Oc ? (e) => Oc.createHTML(e) : (e) => e, jc = "http://www.w3.org/2000/svg", Mc = "http://www.w3.org/1998/Math/MathML", Nc = typeof document < "u" ? document : null, Pc = Nc && /* @__PURE__ */ Nc.createElement("template"), Fc = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Nc.createElementNS(jc, e) : t === "mathml" ? Nc.createElementNS(Mc, e) : n ? Nc.createElement(e, { is: n }) : Nc.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Nc.createTextNode(e),
	createComment: (e) => Nc.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Nc.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Pc.innerHTML = Ac(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Pc.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ic = "transition", Lc = "animation", Rc = /* @__PURE__ */ Symbol("_vtc"), zc = {
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
}, Bc = /* @__PURE__ */ _({}, ui, zc), Vc = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Bc, e))((e, { slots: t }) => _c(mi, Wc(e), t)), Hc = (e, t = []) => {
	x(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Uc = (e) => e ? x(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Wc(e) {
	let t = {};
	for (let n in e) n in zc || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = Gc(i), h = m && m[0], g = m && m[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: w = y, onAppearCancelled: ee = b } = t, T = (e, t, n, r) => {
		e._enterCancelled = r, Jc(e, t ? u : s), Jc(e, t ? l : o), n && n();
	}, E = (e, t) => {
		e._isLeaving = !1, Jc(e, d), Jc(e, p), Jc(e, f), t && t();
	}, D = (e) => (t, n) => {
		let i = e ? w : y, o = () => T(t, e, n);
		Hc(i, [t, o]), Yc(() => {
			Jc(t, e ? c : a), qc(t, e ? u : s), Uc(i) || Zc(t, r, h, o);
		});
	};
	return _(t, {
		onBeforeEnter(e) {
			Hc(v, [e]), qc(e, a), qc(e, o);
		},
		onBeforeAppear(e) {
			Hc(C, [e]), qc(e, c), qc(e, l);
		},
		onEnter: D(!1),
		onAppear: D(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => E(e, t);
			qc(e, d), e._enterCancelled ? (qc(e, f), tl(e)) : (tl(e), qc(e, f)), Yc(() => {
				e._isLeaving && (Jc(e, d), qc(e, p), Uc(x) || Zc(e, r, g, n));
			}), Hc(x, [e, n]);
		},
		onEnterCancelled(e) {
			T(e, !1, void 0, !0), Hc(b, [e]);
		},
		onAppearCancelled(e) {
			T(e, !0, void 0, !0), Hc(ee, [e]);
		},
		onLeaveCancelled(e) {
			E(e), Hc(S, [e]);
		}
	});
}
function Gc(e) {
	if (e == null) return null;
	if (O(e)) return [Kc(e.enter), Kc(e.leave)];
	{
		let t = Kc(e);
		return [t, t];
	}
}
function Kc(e) {
	return _e(e);
}
function qc(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Rc] || (e[Rc] = /* @__PURE__ */ new Set())).add(t);
}
function Jc(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Rc];
	n && (n.delete(t), n.size || (e[Rc] = void 0));
}
function Yc(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var Xc = 0;
function Zc(e, t, n, r) {
	let i = e._endId = ++Xc, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = Qc(e, t);
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
function Qc(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ic}Delay`), a = r(`${Ic}Duration`), o = $c(i, a), s = r(`${Lc}Delay`), c = r(`${Lc}Duration`), l = $c(s, c), u = null, d = 0, f = 0;
	t === Ic ? o > 0 && (u = Ic, d = o, f = a.length) : t === Lc ? l > 0 && (u = Lc, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ic : Lc : null, f = u ? u === Ic ? a.length : c.length : 0);
	let p = u === Ic && /\b(?:transform|all)(?:,|$)/.test(r(`${Ic}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function $c(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => el(t) + el(e[n])));
}
function el(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function tl(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function nl(e, t, n) {
	let r = e[Rc];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var rl = /* @__PURE__ */ Symbol("_vod"), il = /* @__PURE__ */ Symbol("_vsh"), al = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[rl] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : ol(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), ol(e, !0), r.enter(e)) : r.leave(e, () => {
			ol(e, !1);
		}) : ol(e, t));
	},
	beforeUnmount(e, { value: t }) {
		ol(e, t);
	}
};
function ol(e, t) {
	e.style.display = t ? e[rl] : "none", e[il] = !t;
}
function sl() {
	al.getSSRProps = ({ value: e }) => {
		if (!e) return { style: { display: "none" } };
	};
}
var cl = /* @__PURE__ */ Symbol("");
function ll(e) {
	let t = Xs();
	if (!t) return;
	let n = t.ut = (n = e(t.proxy)) => {
		Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach((e) => dl(e, n));
	}, r = () => {
		let r = e(t.proxy);
		t.ce ? dl(t.ce, r) : ul(t.subTree, r), n(r);
	};
	pa(() => {
		vr(r);
	}), fa(() => {
		Hr(r, p, { flush: "post" });
		let e = new MutationObserver(r);
		e.observe(t.subTree.el.parentNode, { childList: !0 }), ga(() => e.disconnect());
	});
}
function ul(e, t) {
	if (e.shapeFlag & 128) {
		let n = e.suspense;
		e = n.activeBranch, n.pendingBranch && !n.isHydrating && n.effects.push(() => {
			ul(n.activeBranch, t);
		});
	}
	for (; e.component;) e = e.component.subTree;
	if (e.shapeFlag & 1 && e.el) dl(e.el, t);
	else if (e.type === R) e.children.forEach((e) => ul(e, t));
	else if (e.type === Cs) {
		let { el: n, anchor: r } = e;
		for (; n && (dl(n, t), n !== r);) n = n.nextSibling;
	}
}
function dl(e, t) {
	if (e.nodeType === 1) {
		let n = e.style, r = "";
		for (let e in t) {
			let i = Ke(t[e]);
			n.setProperty(`--${e}`, i), r += `--${e}: ${i};`;
		}
		n[cl] = r;
	}
}
var fl = /(?:^|;)\s*display\s*:/;
function pl(e, t, n) {
	let r = e.style, i = E(n), a = !1;
	if (n && !i) {
		if (t) if (E(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? hl(r, t, "");
		}
		else for (let e in t) n[e] ?? hl(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? hl(r, i, "") : yl(e, i, !E(t) && t ? t[i] : void 0, o) || hl(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[cl];
			e && (n += ";" + e), r.cssText = n, a = fl.test(n);
		}
	} else t && e.removeAttribute("style");
	rl in e && (e[rl] = a ? r.display : "", e[il] && (r.display = "none"));
}
var ml = /\s*!important$/;
function hl(e, t, n) {
	if (x(n)) n.forEach((n) => hl(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = vl(e, t);
		ml.test(n) ? e.setProperty(A(r), n.replace(ml, ""), "important") : e[r] = n;
	}
}
var gl = [
	"Webkit",
	"Moz",
	"ms"
], _l = {};
function vl(e, t) {
	let n = _l[t];
	if (n) return n;
	let r = k(t);
	if (r !== "filter" && r in e) return _l[t] = r;
	r = fe(r);
	for (let n = 0; n < gl.length; n++) {
		let i = gl[n] + r;
		if (i in e) return _l[t] = i;
	}
	return t;
}
function yl(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && E(r) && n === r;
}
var bl = "http://www.w3.org/1999/xlink";
function xl(e, t, n, r, i, a = Re(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(bl, t.slice(6, t.length)) : e.setAttributeNS(bl, t, n) : n == null || a && !ze(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : D(n) ? String(n) : n);
}
function Sl(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ac(n) : n);
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
		r === "boolean" ? n = ze(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Cl(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function wl(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Tl = /* @__PURE__ */ Symbol("_vei");
function El(e, t, n, r, i = null) {
	let a = e[Tl] || (e[Tl] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = kl(t);
		r ? Cl(e, n, a[t] = Nl(r, i), s) : o && (wl(e, n, o, s), a[t] = void 0);
	}
}
var Dl = /(Once|Passive|Capture)$/, Ol = /^on:?(?:Once|Passive|Capture)$/;
function kl(e) {
	let t, n;
	for (; (n = e.match(Dl)) && !Ol.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : A(e.slice(2)), t];
}
var Al = 0, jl = /* @__PURE__ */ Promise.resolve(), Ml = () => Al ||= (jl.then(() => Al = 0), Date.now());
function Nl(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (x(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && ir(e, t, 5, a);
			}
		} else ir(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ml(), n;
}
var Pl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Fl = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? nl(e, r, o) : t === "style" ? pl(e, n, r) : h(t) ? g(t) || El(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Il(e, t, r, o)) ? (Sl(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && xl(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ll(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !E(r))) ? Sl(e, k(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), xl(e, t, r, o));
};
function Il(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Pl(t) && T(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Pl(t) && E(n) ? !1 : t in e;
}
function Ll(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = k(t);
	return Array.isArray(n) ? n.some((e) => k(e) === r) : Object.keys(n).some((e) => k(e) === r);
}
var Rl = {};
// @__NO_SIDE_EFFECTS__
function zl(e, t, n) {
	let r = /* @__PURE__ */ xi(e, t);
	ae(r) && (r = _({}, r, t));
	class i extends Hl {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
var Bl = /* @__NO_SIDE_EFFECTS__ */ ((e, t) => /* @__PURE__ */ zl(e, t, ju)), Vl = typeof HTMLElement < "u" ? HTMLElement : class {}, Hl = class e extends Vl {
	constructor(e, t = {}, n = Au) {
		super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== Au ? this._root = this.shadowRoot : e.shadowRoot === !1 ? this._root = this : (this.attachShadow(_({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot);
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
		this._connected = !1, mr(() => {
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
			if (n && !x(n)) for (let e in n) {
				let t = n[e];
				(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = _e(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[k(e)] = !0);
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
		if (t) for (let e in t) b(this, e) || Object.defineProperty(this, e, { get: () => kn(t[e]) });
	}
	_resolveProps(e) {
		let { props: t } = e, n = x(t) ? t : Object.keys(t || {});
		for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
		for (let e of n.map(k)) Object.defineProperty(this, e, {
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
		let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : Rl, r = k(e);
		t && this._numberProps && this._numberProps[r] && (n = _e(n)), this._setProp(r, n, !1, !0);
	}
	_getProp(e) {
		return this._props[e];
	}
	_setProp(e, t, n = !0, r = !1) {
		if (t !== this._props[e] && (this._dirty = !0, t === Rl ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
			let n = this._ob;
			n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(A(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(A(e), t + "") : t || this.removeAttribute(A(e)), n && n.observe(this, { attributes: !0 });
		}
	}
	_update() {
		let e = this._createVNode();
		this._app && (e.appContext = this._app._context), Ou(e, this._root);
	}
	_createVNode() {
		let e = {};
		this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
		let t = U(this._def, _(e, this._props));
		return this._instance || (t.ce = (e) => {
			this._instance = e, e.ce = this, e.isCE = !0;
			let t = (e, t) => {
				this.dispatchEvent(new CustomEvent(e, ae(t[0]) ? _({ detail: t }, t[0]) : { detail: t }));
			};
			e.emit = (e, ...n) => {
				t(e, n), A(e) !== e && t(A(e), n);
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
};
function Ul(e) {
	let t = Xs();
	return t && t.ce || null;
}
function Wl() {
	let e = Ul();
	return e && e.shadowRoot;
}
function Gl(e = "$style") {
	{
		let t = Xs();
		if (!t) return d;
		let n = t.type.__cssModules;
		return n && n[e] || d;
	}
}
var Kl = /* @__PURE__ */ new WeakMap(), ql = /* @__PURE__ */ new WeakMap(), Jl = /* @__PURE__ */ Symbol("_moveCb"), Yl = /* @__PURE__ */ Symbol("_enterCb"), Xl = /* @__PURE__ */ ((e) => (delete e.props.mode, e))({
	name: "TransitionGroup",
	props: /* @__PURE__ */ _({}, Bc, {
		tag: String,
		moveClass: String
	}),
	setup(e, { slots: t }) {
		let n = Xs(), r = ci(), i, a;
		return ma(() => {
			if (!i.length) return;
			let t = e.moveClass || `${e.name || "v"}-move`;
			if (!tu(i[0].el, n.vnode.el, t)) {
				i = [];
				return;
			}
			i.forEach(Zl), i.forEach(Ql);
			let r = i.filter($l);
			tl(n.vnode.el), r.forEach((e) => {
				let n = e.el, r = n.style;
				qc(n, t), r.transform = r.webkitTransform = r.transitionDuration = "";
				let i = n[Jl] = (e) => {
					e && e.target !== n || (!e || e.propertyName.endsWith("transform")) && (n.removeEventListener("transitionend", i), n[Jl] = null, Jc(n, t));
				};
				n.addEventListener("transitionend", i);
			}), i = [];
		}), () => {
			let o = /* @__PURE__ */ P(e), s = Wc(o), c = o.tag || R;
			if (i = [], a) for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.el && t.el instanceof Element && !t.el[il] && (i.push(t), yi(t, gi(t, s, r, n)), Kl.set(t, eu(t.el)));
			}
			a = t.default ? bi(t.default()) : [];
			for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.key != null && yi(t, gi(t, s, r, n));
			}
			return U(c, null, a);
		};
	}
});
function Zl(e) {
	let t = e.el;
	t[Jl] && t[Jl](), t[Yl] && t[Yl]();
}
function Ql(e) {
	ql.set(e, eu(e.el));
}
function $l(e) {
	let t = Kl.get(e), n = ql.get(e), r = t.left - n.left, i = t.top - n.top;
	if (r || i) {
		let t = e.el, n = t.style, a = t.getBoundingClientRect(), o = 1, s = 1;
		return t.offsetWidth && (o = a.width / t.offsetWidth), t.offsetHeight && (s = a.height / t.offsetHeight), (!Number.isFinite(o) || o === 0) && (o = 1), (!Number.isFinite(s) || s === 0) && (s = 1), Math.abs(o - 1) < .01 && (o = 1), Math.abs(s - 1) < .01 && (s = 1), n.transform = n.webkitTransform = `translate(${r / o}px,${i / s}px)`, n.transitionDuration = "0s", e;
	}
}
function eu(e) {
	let t = e.getBoundingClientRect();
	return {
		left: t.left,
		top: t.top
	};
}
function tu(e, t, n) {
	let r = e.cloneNode(), i = e[Rc];
	i && i.forEach((e) => {
		e.split(/\s+/).forEach((e) => e && r.classList.remove(e));
	}), n.split(/\s+/).forEach((e) => e && r.classList.add(e)), r.style.display = "none";
	let a = t.nodeType === 1 ? t : t.parentNode;
	a.appendChild(r);
	let { hasTransform: o } = Qc(r);
	return a.removeChild(r), o;
}
var nu = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return x(t) ? (e) => me(t, e) : t;
};
function ru(e) {
	e.target.composing = !0;
}
function iu(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var au = /* @__PURE__ */ Symbol("_assign");
function ou(e, t, n) {
	return t && (e = e.trim()), n && (e = ge(e)), e;
}
var G = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[au] = nu(i);
		let a = r || i.props && i.props.type === "number";
		Cl(e, t ? "change" : "input", (t) => {
			t.target.composing || e[au](ou(e.value, n, a));
		}), (n || a) && Cl(e, "change", () => {
			e.value = ou(e.value, n, a);
		}), t || (Cl(e, "compositionstart", ru), Cl(e, "compositionend", iu), Cl(e, "change", iu));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[au] = nu(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ge(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, su = {
	deep: !0,
	created(e, t, n) {
		e[au] = nu(n), Cl(e, "change", () => {
			let t = e._modelValue, n = fu(e), r = e.checked, i = e[au];
			if (x(t)) {
				let e = He(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (C(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(pu(e, r));
		});
	},
	mounted: cu,
	beforeUpdate(e, t, n) {
		e[au] = nu(n), cu(e, t, n);
	}
};
function cu(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (x(t)) i = He(t, r.props.value) > -1;
	else if (C(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ve(t, pu(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var lu = {
	created(e, { value: t }, n) {
		e.checked = Ve(t, n.props.value), e[au] = nu(n), Cl(e, "change", () => {
			e[au](fu(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[au] = nu(r), t !== n && (e.checked = Ve(t, r.props.value));
	}
}, uu = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = C(t);
		Cl(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ge(fu(e)) : fu(e));
			e[au](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, mr(() => {
				e._assigning = !1;
			});
		}), e[au] = nu(r);
	},
	mounted(e, { value: t }) {
		du(e, t);
	},
	beforeUpdate(e, t, n) {
		e[au] = nu(n);
	},
	updated(e, { value: t }) {
		e._assigning || du(e, t);
	}
};
function du(e, t) {
	let n = e.multiple, r = x(t);
	if (!(n && !r && !C(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = fu(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = He(t, o) > -1;
			} else a.selected = t.has(o);
			else if (Ve(fu(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function fu(e) {
	return "_value" in e ? e._value : e.value;
}
function pu(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var mu = {
	created(e, t, n) {
		gu(e, t, n, null, "created");
	},
	mounted(e, t, n) {
		gu(e, t, n, null, "mounted");
	},
	beforeUpdate(e, t, n, r) {
		gu(e, t, n, r, "beforeUpdate");
	},
	updated(e, t, n, r) {
		gu(e, t, n, r, "updated");
	}
};
function hu(e, t) {
	switch (e) {
		case "SELECT": return uu;
		case "TEXTAREA": return G;
		default: switch (t) {
			case "checkbox": return su;
			case "radio": return lu;
			default: return G;
		}
	}
}
function gu(e, t, n, r, i) {
	let a = hu(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
function _u() {
	G.getSSRProps = ({ value: e }) => ({ value: e }), lu.getSSRProps = ({ value: e }, t) => {
		if (t.props && Ve(t.props.value, e)) return { checked: !0 };
	}, su.getSSRProps = ({ value: e }, t) => {
		if (x(e)) {
			if (t.props && He(e, t.props.value) > -1) return { checked: !0 };
		} else if (C(e)) {
			if (t.props && e.has(t.props.value)) return { checked: !0 };
		} else if (e) return { checked: !0 };
	}, mu.getSSRProps = (e, t) => {
		if (typeof t.type != "string") return;
		let n = hu(t.type.toUpperCase(), t.props && t.props.type);
		if (n.getSSRProps) return n.getSSRProps(e, t);
	};
}
var vu = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], yu = {
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
	exact: (e, t) => vu.some((n) => e[`${n}Key`] && !t.includes(n))
}, bu = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = yu[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, xu = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Su = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = A(n.key);
		if (t.some((e) => e === r || xu[e] === r)) return e(n);
	}));
}, Cu = /* @__PURE__ */ _({ patchProp: Fl }, Fc), wu, Tu = !1;
function Eu() {
	return wu ||= Qo(Cu);
}
function Du() {
	return wu = Tu ? wu : $o(Cu), Tu = !0, wu;
}
var Ou = ((...e) => {
	Eu().render(...e);
}), ku = ((...e) => {
	Du().hydrate(...e);
}), Au = ((...e) => {
	let t = Eu().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Nu(e);
		if (!r) return;
		let i = t._component;
		!T(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Mu(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
}), ju = ((...e) => {
	let t = Du().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let t = Nu(e);
		if (t) return n(t, !0, Mu(t));
	}, t;
});
function Mu(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Nu(e) {
	return E(e) ? document.querySelector(e) : e;
}
var Pu = !1, Fu = () => {
	Pu || (Pu = !0, _u(), sl());
}, Iu = /* @__PURE__ */ Symbol(""), Lu = /* @__PURE__ */ Symbol(""), Ru = /* @__PURE__ */ Symbol(""), zu = /* @__PURE__ */ Symbol(""), Bu = /* @__PURE__ */ Symbol(""), Vu = /* @__PURE__ */ Symbol(""), Hu = /* @__PURE__ */ Symbol(""), Uu = /* @__PURE__ */ Symbol(""), Wu = /* @__PURE__ */ Symbol(""), Gu = /* @__PURE__ */ Symbol(""), Ku = /* @__PURE__ */ Symbol(""), qu = /* @__PURE__ */ Symbol(""), Ju = /* @__PURE__ */ Symbol(""), Yu = /* @__PURE__ */ Symbol(""), Xu = /* @__PURE__ */ Symbol(""), Zu = /* @__PURE__ */ Symbol(""), Qu = /* @__PURE__ */ Symbol(""), $u = /* @__PURE__ */ Symbol(""), ed = /* @__PURE__ */ Symbol(""), td = /* @__PURE__ */ Symbol(""), nd = /* @__PURE__ */ Symbol(""), rd = /* @__PURE__ */ Symbol(""), id = /* @__PURE__ */ Symbol(""), ad = /* @__PURE__ */ Symbol(""), od = /* @__PURE__ */ Symbol(""), sd = /* @__PURE__ */ Symbol(""), cd = /* @__PURE__ */ Symbol(""), ld = /* @__PURE__ */ Symbol(""), ud = /* @__PURE__ */ Symbol(""), dd = /* @__PURE__ */ Symbol(""), fd = /* @__PURE__ */ Symbol(""), pd = /* @__PURE__ */ Symbol(""), md = /* @__PURE__ */ Symbol(""), hd = /* @__PURE__ */ Symbol(""), gd = /* @__PURE__ */ Symbol(""), _d = /* @__PURE__ */ Symbol(""), vd = /* @__PURE__ */ Symbol(""), yd = /* @__PURE__ */ Symbol(""), bd = /* @__PURE__ */ Symbol(""), xd = {
	[Iu]: "Fragment",
	[Lu]: "Teleport",
	[Ru]: "Suspense",
	[zu]: "KeepAlive",
	[Bu]: "BaseTransition",
	[Vu]: "openBlock",
	[Hu]: "createBlock",
	[Uu]: "createElementBlock",
	[Wu]: "createVNode",
	[Gu]: "createElementVNode",
	[Ku]: "createCommentVNode",
	[qu]: "createTextVNode",
	[Ju]: "createStaticVNode",
	[Yu]: "resolveComponent",
	[Xu]: "resolveDynamicComponent",
	[Zu]: "resolveDirective",
	[Qu]: "resolveFilter",
	[$u]: "withDirectives",
	[ed]: "renderList",
	[td]: "renderSlot",
	[nd]: "createSlots",
	[rd]: "toDisplayString",
	[id]: "mergeProps",
	[ad]: "normalizeClass",
	[od]: "normalizeStyle",
	[sd]: "normalizeProps",
	[cd]: "guardReactiveProps",
	[ld]: "toHandlers",
	[ud]: "camelize",
	[dd]: "capitalize",
	[fd]: "toHandlerKey",
	[pd]: "setBlockTracking",
	[md]: "pushScopeId",
	[hd]: "popScopeId",
	[gd]: "withCtx",
	[_d]: "unref",
	[vd]: "isRef",
	[yd]: "withMemo",
	[bd]: "isMemoSame"
};
function Sd(e) {
	Object.getOwnPropertySymbols(e).forEach((t) => {
		xd[t] = e[t];
	});
}
var Cd = {
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
function wd(e, t = "") {
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
		loc: Cd
	};
}
function Td(e, t, n, r, i, a, o, s = !1, c = !1, l = !1, u = Cd) {
	return e && (s ? (e.helper(Vu), e.helper(Fd(e.inSSR, l))) : e.helper(Pd(e.inSSR, l)), o && e.helper($u)), {
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
function Ed(e, t = Cd) {
	return {
		type: 17,
		loc: t,
		elements: e
	};
}
function Dd(e, t = Cd) {
	return {
		type: 15,
		loc: t,
		properties: e
	};
}
function K(e, t) {
	return {
		type: 16,
		loc: Cd,
		key: E(e) ? q(e, !0) : e,
		value: t
	};
}
function q(e, t = !1, n = Cd, r = 0) {
	return {
		type: 4,
		loc: n,
		content: e,
		isStatic: t,
		constType: t ? 3 : r
	};
}
function Od(e, t = Cd) {
	return {
		type: 8,
		loc: t,
		children: e
	};
}
function kd(e, t = [], n = Cd) {
	return {
		type: 14,
		loc: n,
		callee: e,
		arguments: t
	};
}
function Ad(e, t = void 0, n = !1, r = !1, i = Cd) {
	return {
		type: 18,
		params: e,
		returns: t,
		newline: n,
		isSlot: r,
		loc: i
	};
}
function jd(e, t, n, r = !0) {
	return {
		type: 19,
		test: e,
		consequent: t,
		alternate: n,
		newline: r,
		loc: Cd
	};
}
function Md(e, t, n = !1, r = !1) {
	return {
		type: 20,
		index: e,
		value: t,
		needPauseTracking: n,
		inVOnce: r,
		needArraySpread: !1,
		loc: Cd
	};
}
function Nd(e) {
	return {
		type: 21,
		body: e,
		loc: Cd
	};
}
function Pd(e, t) {
	return e || t ? Wu : Gu;
}
function Fd(e, t) {
	return e || t ? Hu : Uu;
}
function Id(e, { helper: t, removeHelper: n, inSSR: r }) {
	e.isBlock || (e.isBlock = !0, n(Pd(r, e.isComponent)), t(Vu), t(Fd(r, e.isComponent)));
}
var Ld = new Uint8Array([123, 123]), Rd = new Uint8Array([125, 125]);
function zd(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function Bd(e) {
	return e === 32 || e === 10 || e === 9 || e === 12 || e === 13;
}
function Vd(e) {
	return e === 47 || e === 62 || Bd(e);
}
function Hd(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}
var Ud = {
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
}, Wd = class {
	constructor(e, t) {
		this.stack = e, this.cbs = t, this.state = 1, this.buffer = "", this.sectionStart = 0, this.index = 0, this.entityStart = 0, this.baseState = 1, this.inRCDATA = !1, this.inXML = !1, this.inVPre = !1, this.newlines = [], this.mode = 0, this.delimiterOpen = Ld, this.delimiterClose = Rd, this.delimiterIndex = -1, this.currentSequence = void 0, this.sequenceIndex = 0;
	}
	get inSFCRoot() {
		return this.mode === 2 && this.stack.length === 0;
	}
	reset() {
		this.state = 1, this.mode = 0, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = 1, this.inRCDATA = !1, this.currentSequence = void 0, this.newlines.length = 0, this.delimiterOpen = Ld, this.delimiterClose = Rd;
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
		if (!(t ? Vd(e) : (e | 32) === this.currentSequence[this.sequenceIndex])) this.inRCDATA = !1;
		else if (!t) {
			this.sequenceIndex++;
			return;
		}
		this.sequenceIndex = 0, this.state = 6, this.stateInTagName(e);
	}
	stateInRCDATA(e) {
		if (this.sequenceIndex === this.currentSequence.length) {
			if (e === 62 || Bd(e)) {
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
		(e | 32) === this.currentSequence[this.sequenceIndex] ? this.sequenceIndex += 1 : this.sequenceIndex === 0 ? this.currentSequence === Ud.TitleEnd || this.currentSequence === Ud.TextareaEnd && !this.inSFCRoot ? !this.inVPre && e === this.delimiterOpen[0] && (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(e)) : this.fastForwardTo(60) && (this.sequenceIndex = 1) : this.sequenceIndex = Number(e === 60);
	}
	stateCDATASequence(e) {
		e === Ud.Cdata[this.sequenceIndex] ? ++this.sequenceIndex === Ud.Cdata.length && (this.state = 28, this.currentSequence = Ud.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1) : (this.sequenceIndex = 0, this.state = 23, this.stateInDeclaration(e));
	}
	fastForwardTo(e) {
		for (; ++this.index < this.buffer.length;) {
			let t = this.buffer.charCodeAt(this.index);
			if (t === 10 && this.newlines.push(this.index), t === e) return !0;
		}
		return this.index = this.buffer.length - 1, !1;
	}
	stateInCommentLike(e) {
		e === this.currentSequence[this.sequenceIndex] ? ++this.sequenceIndex === this.currentSequence.length && (this.currentSequence === Ud.CdataEnd ? this.cbs.oncdata(this.sectionStart, this.index - 2) : this.cbs.oncomment(this.sectionStart, this.index - 2), this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = 1) : this.sequenceIndex === 0 ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1) : e !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
	}
	startSpecial(e, t) {
		this.enterRCDATA(e, t), this.state = 31;
	}
	enterRCDATA(e, t) {
		this.inRCDATA = !0, this.currentSequence = e, this.sequenceIndex = t;
	}
	stateBeforeTagName(e) {
		e === 33 ? (this.state = 22, this.sectionStart = this.index + 1) : e === 63 ? (this.state = 24, this.sectionStart = this.index + 1) : zd(e) ? (this.sectionStart = this.index, this.mode === 0 ? this.state = 6 : this.inSFCRoot ? this.state = 34 : this.inXML ? this.state = 6 : e === 116 ? this.state = 30 : this.state = e === 115 ? 29 : 6) : e === 47 ? this.state = 8 : (this.state = 1, this.stateText(e));
	}
	stateInTagName(e) {
		Vd(e) && this.handleTagName(e);
	}
	stateInSFCRootTagName(e) {
		if (Vd(e)) {
			let t = this.buffer.slice(this.sectionStart, this.index);
			t !== "template" && this.enterRCDATA(Hd("</" + t), 0), this.handleTagName(e);
		}
	}
	handleTagName(e) {
		this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e);
	}
	stateBeforeClosingTagName(e) {
		Bd(e) || (e === 62 ? (this.state = 1, this.sectionStart = this.index + 1) : (this.state = zd(e) ? 9 : 27, this.sectionStart = this.index));
	}
	stateInClosingTagName(e) {
		(e === 62 || Bd(e)) && (this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = 10, this.stateAfterClosingTagName(e));
	}
	stateAfterClosingTagName(e) {
		e === 62 && (this.state = 1, this.sectionStart = this.index + 1);
	}
	stateBeforeAttrName(e) {
		e === 62 ? (this.cbs.onopentagend(this.index), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : e === 47 ? this.state = 7 : e === 60 && this.peek() === 47 ? (this.cbs.onopentagend(this.index), this.state = 5, this.sectionStart = this.index) : Bd(e) || this.handleAttrStart(e);
	}
	handleAttrStart(e) {
		e === 118 && this.peek() === 45 ? (this.state = 13, this.sectionStart = this.index) : e === 46 || e === 58 || e === 64 || e === 35 ? (this.cbs.ondirname(this.index, this.index + 1), this.state = 14, this.sectionStart = this.index + 1) : (this.state = 12, this.sectionStart = this.index);
	}
	stateInSelfClosingTag(e) {
		e === 62 ? (this.cbs.onselfclosingtag(this.index), this.state = 1, this.sectionStart = this.index + 1, this.inRCDATA = !1) : Bd(e) || (this.state = 11, this.stateBeforeAttrName(e));
	}
	stateInAttrName(e) {
		(e === 61 || Vd(e)) && (this.cbs.onattribname(this.sectionStart, this.index), this.handleAttrNameEnd(e));
	}
	stateInDirName(e) {
		e === 61 || Vd(e) ? (this.cbs.ondirname(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 58 ? (this.cbs.ondirname(this.sectionStart, this.index), this.state = 14, this.sectionStart = this.index + 1) : e === 46 && (this.cbs.ondirname(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
	}
	stateInDirArg(e) {
		e === 61 || Vd(e) ? (this.cbs.ondirarg(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 91 ? this.state = 15 : e === 46 && (this.cbs.ondirarg(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
	}
	stateInDynamicDirArg(e) {
		e === 93 ? this.state = 14 : (e === 61 || Vd(e)) && (this.cbs.ondirarg(this.sectionStart, this.index + 1), this.handleAttrNameEnd(e));
	}
	stateInDirModifier(e) {
		e === 61 || Vd(e) ? (this.cbs.ondirmodifier(this.sectionStart, this.index), this.handleAttrNameEnd(e)) : e === 46 && (this.cbs.ondirmodifier(this.sectionStart, this.index), this.sectionStart = this.index + 1);
	}
	handleAttrNameEnd(e) {
		this.sectionStart = this.index, this.state = 17, this.cbs.onattribnameend(this.index), this.stateAfterAttrName(e);
	}
	stateAfterAttrName(e) {
		e === 61 ? this.state = 18 : e === 47 || e === 62 ? (this.cbs.onattribend(0, this.sectionStart), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e)) : Bd(e) || (this.cbs.onattribend(0, this.sectionStart), this.handleAttrStart(e));
	}
	stateBeforeAttrValue(e) {
		e === 34 ? (this.state = 19, this.sectionStart = this.index + 1) : e === 39 ? (this.state = 20, this.sectionStart = this.index + 1) : Bd(e) || (this.sectionStart = this.index, this.state = 21, this.stateInAttrValueNoQuotes(e));
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
		Bd(e) || e === 62 ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(1, this.index), this.state = 11, this.stateBeforeAttrName(e)) : (e === 39 || e === 60 || e === 61 || e === 96) && this.cbs.onerr(18, this.index);
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
		e === 45 ? (this.state = 28, this.currentSequence = Ud.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1) : this.state = 23;
	}
	stateInSpecialComment(e) {
		(e === 62 || this.fastForwardTo(62)) && (this.cbs.oncomment(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
	}
	stateBeforeSpecialS(e) {
		e === Ud.ScriptEnd[3] ? this.startSpecial(Ud.ScriptEnd, 4) : e === Ud.StyleEnd[3] ? this.startSpecial(Ud.StyleEnd, 4) : (this.state = 6, this.stateInTagName(e));
	}
	stateBeforeSpecialT(e) {
		e === Ud.TitleEnd[3] ? this.startSpecial(Ud.TitleEnd, 4) : e === Ud.TextareaEnd[3] ? this.startSpecial(Ud.TextareaEnd, 4) : (this.state = 6, this.stateInTagName(e));
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
		this.sectionStart >= e || (this.state === 28 ? this.currentSequence === Ud.CdataEnd ? this.cbs.oncdata(this.sectionStart, e) : this.cbs.oncomment(this.sectionStart, e) : this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9 || this.cbs.ontext(this.sectionStart, e));
	}
	emitCodePoint(e, t) {}
};
function Gd(e, { compatConfig: t }) {
	let n = t && t[e];
	return e === "MODE" ? n || 3 : n;
}
function Kd(e, t) {
	let n = Gd("MODE", t), r = Gd(e, t);
	return n === 3 ? r === !0 : r !== !1;
}
function qd(e, t, n, ...r) {
	return Kd(e, t);
}
function Jd(e) {
	throw e;
}
function Yd(e) {}
function J(e, t, n, r) {
	let i = `https://vuejs.org/error-reference/#compiler-${e}`, a = SyntaxError(String(i));
	return a.code = e, a.loc = t, a;
}
var Xd = (e) => e.type === 4 && e.isStatic;
function Zd(e) {
	switch (e) {
		case "Teleport":
		case "teleport": return Lu;
		case "Suspense":
		case "suspense": return Ru;
		case "KeepAlive":
		case "keep-alive": return zu;
		case "BaseTransition":
		case "base-transition": return Bu;
	}
}
var Qd = /^$|^\d|[^\$\w\xA0-\uFFFF]/, $d = (e) => !Qd.test(e), ef = /[A-Za-z_$\xA0-\uFFFF]/, tf = /[\.\?\w$\xA0-\uFFFF]/, nf = /\s+[.[]\s*|\s*[.[]\s+/g, rf = (e) => e.type === 4 ? e.content : e.loc.source, af = (e) => {
	let t = rf(e).trim().replace(nf, (e) => e.trim()), n = 0, r = [], i = 0, a = 0, o = null;
	for (let e = 0; e < t.length; e++) {
		let s = t.charAt(e);
		switch (n) {
			case 0:
				if (s === "[") r.push(n), n = 1, i++;
				else if (s === "(") r.push(n), n = 2, a++;
				else if (!(e === 0 ? ef : tf).test(s)) return !1;
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
}, of = /^\s*(?:async\s*)?(?:\([^)]*?\)|[\w$_]+)\s*(?::[^=]+)?=>|^\s*(?:async\s+)?function(?:\s+[\w$]+)?\s*\(/, sf = (e) => of.test(rf(e));
function cf(e, t, n = !1) {
	for (let r = 0; r < e.props.length; r++) {
		let i = e.props[r];
		if (i.type === 7 && (n || i.exp) && (E(t) ? i.name === t : t.test(i.name))) return i;
	}
}
function lf(e, t, n = !1, r = !1) {
	for (let i = 0; i < e.props.length; i++) {
		let a = e.props[i];
		if (a.type === 6) {
			if (n) continue;
			if (a.name === t && (a.value || r)) return a;
		} else if (a.name === "bind" && (a.exp || r) && uf(a.arg, t)) return a;
	}
}
function uf(e, t) {
	return !!(e && Xd(e) && e.content === t);
}
function df(e) {
	return e.props.some((e) => e.type === 7 && e.name === "bind" && (!e.arg || e.arg.type !== 4 || !e.arg.isStatic));
}
function ff(e) {
	return e.type === 5 || e.type === 2;
}
function pf(e) {
	return e.type === 7 && e.name === "pre";
}
function mf(e) {
	return e.type === 7 && e.name === "slot";
}
function hf(e) {
	return e.type === 1 && e.tagType === 3;
}
function gf(e) {
	return e.type === 1 && e.tagType === 2;
}
var _f = /* @__PURE__ */ new Set([sd, cd]);
function vf(e, t = []) {
	if (e && !E(e) && e.type === 14) {
		let n = e.callee;
		if (!E(n) && _f.has(n)) return vf(e.arguments[0], t.concat(e));
	}
	return [e, t];
}
function yf(e, t, n) {
	let r, i = e.type === 13 ? e.props : e.arguments[2], a = [], o;
	if (i && !E(i) && i.type === 14) {
		let e = vf(i);
		i = e[0], a = e[1], o = a[a.length - 1];
	}
	if (i == null || E(i)) r = Dd([t]);
	else if (i.type === 14) {
		let e = i.arguments[0];
		!E(e) && e.type === 15 ? bf(t, e) || e.properties.unshift(t) : i.callee === ld ? r = kd(n.helper(id), [Dd([t]), i]) : i.arguments.unshift(Dd([t])), !r && (r = i);
	} else i.type === 15 ? (bf(t, i) || i.properties.unshift(t), r = i) : (r = kd(n.helper(id), [Dd([t]), i]), o && o.callee === cd && (o = a[a.length - 2]));
	e.type === 13 ? o ? o.arguments[0] = r : e.props = r : o ? o.arguments[0] = r : e.arguments[2] = r;
}
function bf(e, t) {
	let n = !1;
	if (e.key.type === 4) {
		let r = e.key.content;
		n = t.properties.some((e) => e.key.type === 4 && e.key.content === r);
	}
	return n;
}
function xf(e, t) {
	return `_${t}_${e.replace(/[^\w]/g, (t, n) => t === "-" ? "_" : e.charCodeAt(n).toString())}`;
}
function Sf(e) {
	return e.type === 14 && e.callee === yd ? e.arguments[1].returns : e;
}
var Cf = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
function wf(e) {
	for (let t = 0; t < e.length; t++) if (!Bd(e.charCodeAt(t))) return !1;
	return !0;
}
function Tf(e) {
	return e.type === 2 && wf(e.content) || e.type === 12 && Tf(e.content);
}
function Ef(e) {
	return e.type === 3 || Tf(e);
}
var Df = {
	parseMode: "base",
	ns: 0,
	delimiters: ["{{", "}}"],
	getNamespace: () => 0,
	isVoidTag: m,
	isPreTag: m,
	isIgnoreNewlineTag: m,
	isCustomElement: m,
	onError: Jd,
	onWarn: Yd,
	comments: !1,
	prefixIdentifiers: !1
}, Y = Df, Of = null, kf = "", Af = null, X = null, jf = "", Mf = -1, Nf = -1, Pf = 0, Ff = !1, If = null, Z = [], Q = new Wd(Z, {
	onerr: ap,
	ontext(e, t) {
		Hf(Bf(e, t), e, t);
	},
	ontextentity(e, t, n) {
		Hf(e, t, n);
	},
	oninterpolation(e, t) {
		if (Ff) return Hf(Bf(e, t), e, t);
		let n = e + Q.delimiterOpen.length, r = t - Q.delimiterClose.length;
		for (; Bd(kf.charCodeAt(n));) n++;
		for (; Bd(kf.charCodeAt(r - 1));) r--;
		let i = Bf(n, r);
		i.includes("&") && (i = Y.decodeEntities(i, !1)), ep({
			type: 5,
			content: ip(i, !1, $(n, r)),
			loc: $(e, t)
		});
	},
	onopentagname(e, t) {
		let n = Bf(e, t);
		Af = {
			type: 1,
			tag: n,
			ns: Y.getNamespace(n, Z[0], Y.ns),
			tagType: 0,
			props: [],
			children: [],
			loc: $(e - 1, t),
			codegenNode: void 0
		};
	},
	onopentagend(e) {
		Vf(e);
	},
	onclosetag(e, t) {
		let n = Bf(e, t);
		if (!Y.isVoidTag(n)) {
			let r = !1;
			for (let e = 0; e < Z.length; e++) if (Z[e].tag.toLowerCase() === n.toLowerCase()) {
				r = !0, e > 0 && ap(24, Z[0].loc.start.offset);
				for (let n = 0; n <= e; n++) Uf(Z.shift(), t, n < e);
				break;
			}
			r || ap(23, Gf(e, 60));
		}
	},
	onselfclosingtag(e) {
		let t = Af.tag;
		Af.isSelfClosing = !0, Vf(e), Z[0] && Z[0].tag === t && Uf(Z.shift(), e);
	},
	onattribname(e, t) {
		X = {
			type: 6,
			name: Bf(e, t),
			nameLoc: $(e, t),
			value: void 0,
			loc: $(e)
		};
	},
	ondirname(e, t) {
		let n = Bf(e, t), r = n === "." || n === ":" ? "bind" : n === "@" ? "on" : n === "#" ? "slot" : n.slice(2);
		if (!Ff && r === "" && ap(26, e), Ff || r === "") X = {
			type: 6,
			name: n,
			nameLoc: $(e, t),
			value: void 0,
			loc: $(e)
		};
		else if (X = {
			type: 7,
			name: r,
			rawName: n,
			exp: void 0,
			arg: void 0,
			modifiers: n === "." ? [q("prop")] : [],
			loc: $(e)
		}, r === "pre") {
			Ff = Q.inVPre = !0, If = Af;
			let e = Af.props;
			for (let t = 0; t < e.length; t++) e[t].type === 7 && (e[t] = rp(e[t]));
		}
	},
	ondirarg(e, t) {
		if (e === t) return;
		let n = Bf(e, t);
		if (Ff && !pf(X)) X.name += n, np(X.nameLoc, t);
		else {
			let r = n[0] !== "[";
			X.arg = ip(r ? n : n.slice(1, -1), r, $(e, t), r ? 3 : 0);
		}
	},
	ondirmodifier(e, t) {
		let n = Bf(e, t);
		if (Ff && !pf(X)) X.name += "." + n, np(X.nameLoc, t);
		else if (X.name === "slot") {
			let e = X.arg;
			e && (e.content += "." + n, np(e.loc, t));
		} else {
			let r = q(n, !0, $(e, t));
			X.modifiers.push(r);
		}
	},
	onattribdata(e, t) {
		jf += Bf(e, t), Mf < 0 && (Mf = e), Nf = t;
	},
	onattribentity(e, t, n) {
		jf += e, Mf < 0 && (Mf = t), Nf = n;
	},
	onattribnameend(e) {
		let t = X.loc.start.offset, n = Bf(t, e);
		X.type === 7 && (X.rawName = n), Af.props.some((e) => (e.type === 7 ? e.rawName : e.name) === n) && ap(2, t);
	},
	onattribend(e, t) {
		if (Af && X) {
			if (np(X.loc, t), e !== 0) if (jf.includes("&") && (jf = Y.decodeEntities(jf, !0)), X.type === 6) X.name === "class" && (jf = $f(jf).trim()), e === 1 && !jf && ap(13, t), X.value = {
				type: 2,
				content: jf,
				loc: e === 1 ? $(Mf, Nf) : $(Mf - 1, Nf + 1)
			}, Q.inSFCRoot && Af.tag === "template" && X.name === "lang" && jf && jf !== "html" && Q.enterRCDATA(Hd("</template"), 0);
			else {
				X.exp = ip(jf, !1, $(Mf, Nf), 0, 0), X.name === "for" && (X.forParseResult = zf(X.exp));
				let e = -1;
				X.name === "bind" && (e = X.modifiers.findIndex((e) => e.content === "sync")) > -1 && qd("COMPILER_V_BIND_SYNC", Y, X.loc, X.arg.loc.source) && (X.name = "model", X.modifiers.splice(e, 1));
			}
			(X.type !== 7 || X.name !== "pre") && Af.props.push(X);
		}
		jf = "", Mf = Nf = -1;
	},
	oncomment(e, t) {
		Y.comments && ep({
			type: 3,
			content: Bf(e, t),
			loc: $(e - 4, t + 3)
		});
	},
	onend() {
		let e = kf.length;
		for (let t = 0; t < Z.length; t++) Uf(Z[t], e - 1), ap(24, Z[t].loc.start.offset);
	},
	oncdata(e, t) {
		(Z[0] ? Z[0].ns : Y.ns) === 0 ? ap(1, e - 9) : Hf(Bf(e, t), e, t);
	},
	onprocessinginstruction(e) {
		(Z[0] ? Z[0].ns : Y.ns) === 0 && ap(21, e - 1);
	}
}), Lf = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, Rf = /^\(|\)$/g;
function zf(e) {
	let t = e.loc, n = e.content, r = n.match(Cf);
	if (!r) return;
	let [, i, a] = r, o = (e, n, r = !1) => {
		let i = t.start.offset + n;
		return ip(e, !1, $(i, i + e.length), 0, +!!r);
	}, s = {
		source: o(a.trim(), n.indexOf(a, i.length)),
		value: void 0,
		key: void 0,
		index: void 0,
		finalized: !1
	}, c = i.trim().replace(Rf, "").trim(), l = i.indexOf(c), u = c.match(Lf);
	if (u) {
		c = c.replace(Lf, "").trim();
		let e = u[1].trim(), t;
		if (e && (t = n.indexOf(e, l + c.length), s.key = o(e, t, !0)), u[2]) {
			let r = u[2].trim();
			r && (s.index = o(r, n.indexOf(r, s.key ? t + e.length : l + c.length), !0));
		}
	}
	return c && (s.value = o(c, l, !0)), s;
}
function Bf(e, t) {
	return kf.slice(e, t);
}
function Vf(e) {
	Q.inSFCRoot && (Af.innerLoc = $(e + 1, e + 1)), ep(Af);
	let { tag: t, ns: n } = Af;
	n === 0 && Y.isPreTag(t) && Pf++, Y.isVoidTag(t) ? Uf(Af, e) : (Z.unshift(Af), (n === 1 || n === 2) && (Q.inXML = !0)), Af = null;
}
function Hf(e, t, n) {
	{
		let t = Z[0] && Z[0].tag;
		t !== "script" && t !== "style" && e.includes("&") && (e = Y.decodeEntities(e, !1));
	}
	let r = Z[0] || Of, i = r.children[r.children.length - 1];
	i && i.type === 2 ? (i.content += e, np(i.loc, n)) : r.children.push({
		type: 2,
		content: e,
		loc: $(t, n)
	});
}
function Uf(e, t, n = !1) {
	n ? np(e.loc, Gf(t, 60)) : np(e.loc, Wf(t, 62) + 1), Q.inSFCRoot && (e.children.length ? e.innerLoc.end = _({}, e.children[e.children.length - 1].loc.end) : e.innerLoc.end = _({}, e.innerLoc.start), e.innerLoc.source = Bf(e.innerLoc.start.offset, e.innerLoc.end.offset));
	let { tag: r, ns: i, children: a } = e;
	if (Ff || (r === "slot" ? e.tagType = 2 : qf(e) ? e.tagType = 3 : Jf(e) && (e.tagType = 1)), Q.inRCDATA || (e.children = Zf(a)), i === 0 && Y.isIgnoreNewlineTag(r)) {
		let e = a[0];
		e && e.type === 2 && (e.content = e.content.replace(/^\r?\n/, ""));
	}
	i === 0 && Y.isPreTag(r) && Pf--, If === e && (Ff = Q.inVPre = !1, If = null), Q.inXML && (Z[0] ? Z[0].ns : Y.ns) === 0 && (Q.inXML = !1);
	{
		let t = e.props;
		if (!Q.inSFCRoot && Kd("COMPILER_NATIVE_TEMPLATE", Y) && e.tag === "template" && !qf(e)) {
			let t = Z[0] || Of, n = t.children.indexOf(e);
			t.children.splice(n, 1, ...e.children);
		}
		let n = t.find((e) => e.type === 6 && e.name === "inline-template");
		n && qd("COMPILER_INLINE_TEMPLATE", Y, n.loc) && e.children.length && (n.value = {
			type: 2,
			content: Bf(e.children[0].loc.start.offset, e.children[e.children.length - 1].loc.end.offset),
			loc: n.loc
		});
	}
}
function Wf(e, t) {
	let n = e;
	for (; kf.charCodeAt(n) !== t && n < kf.length - 1;) n++;
	return n;
}
function Gf(e, t) {
	let n = e;
	for (; kf.charCodeAt(n) !== t && n >= 0;) n--;
	return n;
}
var Kf = /* @__PURE__ */ new Set([
	"if",
	"else",
	"else-if",
	"for",
	"slot"
]);
function qf({ tag: e, props: t }) {
	if (e === "template") {
		for (let e = 0; e < t.length; e++) if (t[e].type === 7 && Kf.has(t[e].name)) return !0;
	}
	return !1;
}
function Jf({ tag: e, props: t }) {
	if (Y.isCustomElement(e)) return !1;
	if (e === "component" || Yf(e.charCodeAt(0)) || Zd(e) || Y.isBuiltInComponent && Y.isBuiltInComponent(e) || Y.isNativeTag && !Y.isNativeTag(e)) return !0;
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (n.type === 6) {
			if (n.name === "is" && n.value && (n.value.content.startsWith("vue:") || qd("COMPILER_IS_ON_ELEMENT", Y, n.loc))) return !0;
		} else if (n.name === "bind" && uf(n.arg, "is") && qd("COMPILER_IS_ON_ELEMENT", Y, n.loc)) return !0;
	}
	return !1;
}
function Yf(e) {
	return e > 64 && e < 91;
}
var Xf = /\r\n/g;
function Zf(e) {
	let t = Y.whitespace !== "preserve", n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.type === 2) if (Pf) i.content = i.content.replace(Xf, "\n");
		else if (wf(i.content)) {
			let a = e[r - 1] && e[r - 1].type, o = e[r + 1] && e[r + 1].type;
			!a || !o || t && (a === 3 && (o === 3 || o === 1) || a === 1 && (o === 3 || o === 1 && Qf(i.content))) ? (n = !0, e[r] = null) : i.content = " ";
		} else t && (i.content = $f(i.content));
	}
	return n ? e.filter(Boolean) : e;
}
function Qf(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n === 10 || n === 13) return !0;
	}
	return !1;
}
function $f(e) {
	let t = "", n = !1;
	for (let r = 0; r < e.length; r++) Bd(e.charCodeAt(r)) ? n ||= (t += " ", !0) : (t += e[r], n = !1);
	return t;
}
function ep(e) {
	(Z[0] || Of).children.push(e);
}
function $(e, t) {
	return {
		start: Q.getPos(e),
		end: t == null ? t : Q.getPos(t),
		source: t == null ? t : Bf(e, t)
	};
}
function tp(e) {
	return $(e.start.offset, e.end.offset);
}
function np(e, t) {
	e.end = Q.getPos(t), e.source = Bf(e.start.offset, t);
}
function rp(e) {
	let t = {
		type: 6,
		name: e.rawName,
		nameLoc: $(e.loc.start.offset, e.loc.start.offset + e.rawName.length),
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
function ip(e, t = !1, n, r = 0, i = 0) {
	return q(e, t, n, r);
}
function ap(e, t, n) {
	Y.onError(J(e, $(t, t), void 0, n));
}
function op() {
	Q.reset(), Af = null, X = null, jf = "", Mf = -1, Nf = -1, Z.length = 0;
}
function sp(e, t) {
	if (op(), kf = e, Y = _({}, Df), t) {
		let e;
		for (e in t) t[e] != null && (Y[e] = t[e]);
	}
	Q.mode = Y.parseMode === "html" ? 1 : Y.parseMode === "sfc" ? 2 : 0, Q.inXML = Y.ns === 1 || Y.ns === 2;
	let n = t && t.delimiters;
	n && (Q.delimiterOpen = Hd(n[0]), Q.delimiterClose = Hd(n[1]));
	let r = Of = wd([], e);
	return Q.parse(kf), r.loc = $(0, e.length), r.children = Zf(r.children), Of = null, r;
}
function cp(e, t) {
	up(e, void 0, t, !!lp(e));
}
function lp(e) {
	let t = e.children.filter((e) => e.type !== 3);
	return t.length === 1 && t[0].type === 1 && !gf(t[0]) ? t[0] : null;
}
function up(e, t, n, r = !1, i = !1) {
	let { children: a } = e, o = [];
	for (let t = 0; t < a.length; t++) {
		let s = a[t];
		if (s.type === 1 && s.tagType === 0) {
			let e = r ? 0 : dp(s, n);
			if (e > 0) {
				if (e >= 2) {
					s.codegenNode.patchFlag = -1, o.push(s);
					continue;
				}
			} else {
				let e = s.codegenNode;
				if (e.type === 13) {
					let t = e.patchFlag;
					if ((t === void 0 || t === 512 || t === 1) && mp(s, n) >= 2) {
						let t = hp(s);
						t && (e.props = n.hoist(t));
					}
					e.dynamicProps &&= n.hoist(e.dynamicProps);
				}
			}
		} else if (s.type === 12 && (r ? 0 : dp(s, n)) >= 2) {
			s.codegenNode.type === 14 && s.codegenNode.arguments.length > 0 && s.codegenNode.arguments.push("-1"), o.push(s);
			continue;
		}
		if (s.type === 1) {
			let t = s.tagType === 1;
			t && n.scopes.vSlot++, up(s, e, n, !1, i), t && n.scopes.vSlot--;
		} else if (s.type === 11) up(s, e, n, s.children.length === 1, !0);
		else if (s.type === 9) for (let t = 0; t < s.branches.length; t++) up(s.branches[t], e, n, s.branches[t].children.length === 1, i);
	}
	let s = !1;
	if (o.length === a.length && e.type === 1) {
		if (e.tagType === 0 && e.codegenNode && e.codegenNode.type === 13 && x(e.codegenNode.children)) e.codegenNode.children = c(Ed(e.codegenNode.children)), s = !0;
		else if (e.tagType === 1 && e.codegenNode && e.codegenNode.type === 13 && e.codegenNode.children && !x(e.codegenNode.children) && e.codegenNode.children.type === 15) {
			let t = l(e.codegenNode, "default");
			t && (t.returns = c(Ed(t.returns)), s = !0);
		} else if (e.tagType === 3 && t && t.type === 1 && t.tagType === 1 && t.codegenNode && t.codegenNode.type === 13 && t.codegenNode.children && !x(t.codegenNode.children) && t.codegenNode.children.type === 15) {
			let n = cf(e, "slot", !0), r = n && n.arg && l(t.codegenNode, n.arg);
			r && (r.returns = c(Ed(r.returns)), s = !0);
		}
	}
	if (!s) for (let e of o) e.codegenNode = n.cache(e.codegenNode);
	function c(e) {
		let t = n.cache(e);
		return t.needArraySpread = !0, t;
	}
	function l(e, t) {
		if (e.children && !x(e.children) && e.children.type === 15) {
			let n = e.children.properties.find((e) => e.key === t || e.key.content === t);
			return n && n.value;
		}
	}
	o.length && n.transformHoist && n.transformHoist(a, n, e);
}
function dp(e, t) {
	let { constantCache: n } = t;
	switch (e.type) {
		case 1:
			if (e.tagType !== 0) return 0;
			let r = n.get(e);
			if (r !== void 0) return r;
			let i = e.codegenNode;
			if (i.type !== 13 || i.isBlock && e.tag !== "svg" && e.tag !== "foreignObject" && e.tag !== "math") return 0;
			if (i.patchFlag === void 0) {
				let r = 3, a = mp(e, t);
				if (a === 0) return n.set(e, 0), 0;
				a < r && (r = a);
				for (let i = 0; i < e.children.length; i++) {
					let a = dp(e.children[i], t);
					if (a === 0) return n.set(e, 0), 0;
					a < r && (r = a);
				}
				if (r > 1) for (let i = 0; i < e.props.length; i++) {
					let a = e.props[i];
					if (a.type === 7 && a.name === "bind" && a.exp) {
						let i = dp(a.exp, t);
						if (i === 0) return n.set(e, 0), 0;
						i < r && (r = i);
					}
				}
				if (i.isBlock) {
					for (let t = 0; t < e.props.length; t++) if (e.props[t].type === 7) return n.set(e, 0), 0;
					t.removeHelper(Vu), t.removeHelper(Fd(t.inSSR, i.isComponent)), i.isBlock = !1, t.helper(Pd(t.inSSR, i.isComponent));
				}
				return n.set(e, r), r;
			} else return n.set(e, 0), 0;
		case 2:
		case 3: return 3;
		case 9:
		case 11:
		case 10: return 0;
		case 5:
		case 12: return dp(e.content, t);
		case 4: return e.constType;
		case 8:
			let a = 3;
			for (let n = 0; n < e.children.length; n++) {
				let r = e.children[n];
				if (E(r) || D(r)) continue;
				let i = dp(r, t);
				if (i === 0) return 0;
				i < a && (a = i);
			}
			return a;
		case 20: return 2;
		default: return 0;
	}
}
var fp = /* @__PURE__ */ new Set([
	ad,
	od,
	sd,
	cd
]);
function pp(e, t) {
	if (e.type === 14 && !E(e.callee) && fp.has(e.callee)) {
		let n = e.arguments[0];
		if (n.type === 4) return dp(n, t);
		if (n.type === 14) return pp(n, t);
	}
	return 0;
}
function mp(e, t) {
	let n = 3, r = hp(e);
	if (r && r.type === 15) {
		let { properties: e } = r;
		for (let r = 0; r < e.length; r++) {
			let { key: i, value: a } = e[r], o = dp(i, t);
			if (o === 0) return o;
			o < n && (n = o);
			let s;
			if (s = a.type === 4 ? dp(a, t) : a.type === 14 ? pp(a, t) : 0, s === 0) return s;
			s < n && (n = s);
		}
	}
	return n;
}
function hp(e) {
	let t = e.codegenNode;
	if (t.type === 13) return t.props;
}
function gp(e, { filename: t = "", prefixIdentifiers: n = !1, hoistStatic: r = !1, hmr: i = !1, cacheHandlers: a = !1, nodeTransforms: o = [], directiveTransforms: s = {}, transformHoist: c = null, isBuiltInComponent: l = p, isCustomElement: u = p, expressionPlugins: f = [], scopeId: m = null, slotted: h = !0, ssr: g = !1, inSSR: _ = !1, ssrCssVars: v = "", bindingMetadata: y = d, inline: b = !1, isTS: x = !1, onError: S = Jd, onWarn: C = Yd, compatConfig: w }) {
	let ee = t.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/), T = {
		filename: t,
		selfName: ee && fe(k(ee[1])),
		prefixIdentifiers: n,
		hoistStatic: r,
		hmr: i,
		cacheHandlers: a,
		nodeTransforms: o,
		directiveTransforms: s,
		transformHoist: c,
		isBuiltInComponent: l,
		isCustomElement: u,
		expressionPlugins: f,
		scopeId: m,
		slotted: h,
		ssr: g,
		inSSR: _,
		ssrCssVars: v,
		bindingMetadata: y,
		inline: b,
		isTS: x,
		onError: S,
		onWarn: C,
		compatConfig: w,
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
			let t = T.helpers.get(e) || 0;
			return T.helpers.set(e, t + 1), e;
		},
		removeHelper(e) {
			let t = T.helpers.get(e);
			if (t) {
				let n = t - 1;
				n ? T.helpers.set(e, n) : T.helpers.delete(e);
			}
		},
		helperString(e) {
			return `_${xd[T.helper(e)]}`;
		},
		replaceNode(e) {
			T.parent.children[T.childIndex] = T.currentNode = e;
		},
		removeNode(e) {
			let t = T.parent.children, n = e ? t.indexOf(e) : T.currentNode ? T.childIndex : -1;
			!e || e === T.currentNode ? (T.currentNode = null, T.onNodeRemoved()) : T.childIndex > n && (T.childIndex--, T.onNodeRemoved()), T.parent.children.splice(n, 1);
		},
		onNodeRemoved: p,
		addIdentifiers(e) {},
		removeIdentifiers(e) {},
		hoist(e) {
			E(e) && (e = q(e)), T.hoists.push(e);
			let t = q(`_hoisted_${T.hoists.length}`, !1, e.loc, 2);
			return t.hoisted = e, t;
		},
		cache(e, t = !1, n = !1) {
			let r = Md(T.cached.length, e, t, n);
			return T.cached.push(r), r;
		}
	};
	return T.filters = /* @__PURE__ */ new Set(), T;
}
function _p(e, t) {
	let n = gp(e, t);
	bp(e, n), t.hoistStatic && cp(e, n), t.ssr || vp(e, n), e.helpers = /* @__PURE__ */ new Set([...n.helpers.keys()]), e.components = [...n.components], e.directives = [...n.directives], e.imports = n.imports, e.hoists = n.hoists, e.temps = n.temps, e.cached = n.cached, e.transformed = !0, e.filters = [...n.filters];
}
function vp(e, t) {
	let { helper: n } = t, { children: r } = e;
	if (r.length === 1) {
		let n = lp(e);
		if (n && n.codegenNode) {
			let r = n.codegenNode;
			r.type === 13 && Id(r, t), e.codegenNode = r;
		} else e.codegenNode = r[0];
	} else r.length > 1 && (e.codegenNode = Td(t, n(Iu), void 0, e.children, 64, void 0, void 0, !0, void 0, !1));
}
function yp(e, t) {
	let n = 0, r = () => {
		n--;
	};
	for (; n < e.children.length; n++) {
		let i = e.children[n];
		E(i) || (t.grandParent = t.parent, t.parent = e, t.childIndex = n, t.onNodeRemoved = r, bp(i, t));
	}
}
function bp(e, t) {
	t.currentNode = e;
	let { nodeTransforms: n } = t, r = [];
	for (let i = 0; i < n.length; i++) {
		let a = n[i](e, t);
		if (a && (x(a) ? r.push(...a) : r.push(a)), t.currentNode) e = t.currentNode;
		else return;
	}
	switch (e.type) {
		case 3:
			t.ssr || t.helper(Ku);
			break;
		case 5:
			t.ssr || t.helper(rd);
			break;
		case 9:
			for (let n = 0; n < e.branches.length; n++) bp(e.branches[n], t);
			break;
		case 10:
		case 11:
		case 1:
		case 0:
			yp(e, t);
			break;
	}
	t.currentNode = e;
	let i = r.length;
	for (; i--;) r[i]();
}
function xp(e, t) {
	let n = E(e) ? (t) => t === e : (t) => e.test(t);
	return (e, r) => {
		if (e.type === 1) {
			let { props: i } = e;
			if (e.tagType === 3 && i.some(mf)) return;
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
var Sp = "/*@__PURE__*/", Cp = (e) => `${xd[e]}: _${xd[e]}`;
function wp(e, { mode: t = "function", prefixIdentifiers: n = t === "module", sourceMap: r = !1, filename: i = "template.vue.html", scopeId: a = null, optimizeImports: o = !1, runtimeGlobalName: s = "Vue", runtimeModuleName: c = "vue", ssrRuntimeModuleName: l = "vue/server-renderer", ssr: u = !1, isTS: d = !1, inSSR: f = !1 }) {
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
			return `_${xd[e]}`;
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
function Tp(e, t = {}) {
	let n = wp(e, t);
	t.onContextCreated && t.onContextCreated(n);
	let { mode: r, push: i, prefixIdentifiers: a, indent: o, deindent: s, newline: c, scopeId: l, ssr: u } = n, d = Array.from(e.helpers), f = d.length > 0, p = !a && r !== "module";
	if (Ep(e, n), i(`function ${u ? "ssrRender" : "render"}(${(u ? [
		"_ctx",
		"_push",
		"_parent",
		"_attrs"
	] : ["_ctx", "_cache"]).join(", ")}) {`), o(), p && (i("with (_ctx) {"), o(), f && (i(`const { ${d.map(Cp).join(", ")} } = _Vue
`, -1), c())), e.components.length && (Dp(e.components, "component", n), (e.directives.length || e.temps > 0) && c()), e.directives.length && (Dp(e.directives, "directive", n), e.temps > 0 && c()), e.filters && e.filters.length && (c(), Dp(e.filters, "filter", n), c()), e.temps > 0) {
		i("let ");
		for (let t = 0; t < e.temps; t++) i(`${t > 0 ? ", " : ""}_temp${t}`);
	}
	return (e.components.length || e.directives.length || e.temps) && (i("\n", 0), c()), u || i("return "), e.codegenNode ? jp(e.codegenNode, n) : i("null"), p && (s(), i("}")), s(), i("}"), {
		ast: e,
		code: n.code,
		preamble: "",
		map: n.map ? n.map.toJSON() : void 0
	};
}
function Ep(e, t) {
	let { ssr: n, prefixIdentifiers: r, push: i, newline: a, runtimeModuleName: o, runtimeGlobalName: s, ssrRuntimeModuleName: c } = t, l = s, u = Array.from(e.helpers);
	u.length > 0 && (i(`const _Vue = ${l}
`, -1), e.hoists.length && i(`const { ${[
		Wu,
		Gu,
		Ku,
		qu,
		Ju
	].filter((e) => u.includes(e)).map(Cp).join(", ")} } = _Vue
`, -1)), Op(e.hoists, t), a(), i("return ");
}
function Dp(e, t, { helper: n, push: r, newline: i, isTS: a }) {
	let o = n(t === "filter" ? Qu : t === "component" ? Yu : Zu);
	for (let n = 0; n < e.length; n++) {
		let s = e[n], c = s.endsWith("__self");
		c && (s = s.slice(0, -6)), r(`const ${xf(s, t)} = ${o}(${JSON.stringify(s)}${c ? ", true" : ""})${a ? "!" : ""}`), n < e.length - 1 && i();
	}
}
function Op(e, t) {
	if (!e.length) return;
	t.pure = !0;
	let { push: n, newline: r } = t;
	r();
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a && (n(`const _hoisted_${i + 1} = `), jp(a, t), r());
	}
	t.pure = !1;
}
function kp(e, t) {
	let n = e.length > 3 || !1;
	t.push("["), n && t.indent(), Ap(e, t, n), n && t.deindent(), t.push("]");
}
function Ap(e, t, n = !1, r = !0) {
	let { push: i, newline: a } = t;
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		E(s) ? i(s, -3) : x(s) ? kp(s, t) : jp(s, t), o < e.length - 1 && (n ? (r && i(","), a()) : r && i(", "));
	}
}
function jp(e, t) {
	if (E(e)) {
		t.push(e, -3);
		return;
	}
	if (D(e)) {
		t.push(t.helper(e));
		return;
	}
	switch (e.type) {
		case 1:
		case 9:
		case 11:
			jp(e.codegenNode, t);
			break;
		case 2:
			Mp(e, t);
			break;
		case 4:
			Np(e, t);
			break;
		case 5:
			Pp(e, t);
			break;
		case 12:
			jp(e.codegenNode, t);
			break;
		case 8:
			Fp(e, t);
			break;
		case 3:
			Lp(e, t);
			break;
		case 13:
			Rp(e, t);
			break;
		case 14:
			Bp(e, t);
			break;
		case 15:
			Vp(e, t);
			break;
		case 17:
			Hp(e, t);
			break;
		case 18:
			Up(e, t);
			break;
		case 19:
			Wp(e, t);
			break;
		case 20:
			Gp(e, t);
			break;
		case 21:
			Ap(e.body, t, !0, !1);
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
function Mp(e, t) {
	t.push(JSON.stringify(e.content), -3, e);
}
function Np(e, t) {
	let { content: n, isStatic: r } = e;
	t.push(r ? JSON.stringify(n) : n, -3, e);
}
function Pp(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Sp), n(`${r(rd)}(`), jp(e.content, t), n(")");
}
function Fp(e, t) {
	for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		E(r) ? t.push(r, -3) : jp(r, t);
	}
}
function Ip(e, t) {
	let { push: n } = t;
	e.type === 8 ? (n("["), Fp(e, t), n("]")) : e.isStatic ? n($d(e.content) ? e.content : JSON.stringify(e.content), -2, e) : n(`[${e.content}]`, -3, e);
}
function Lp(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Sp), n(`${r(Ku)}(${JSON.stringify(e.content)})`, -3, e);
}
function Rp(e, t) {
	let { push: n, helper: r, pure: i } = t, { tag: a, props: o, children: s, patchFlag: c, dynamicProps: l, directives: u, isBlock: d, disableTracking: f, isComponent: p } = e, m;
	c && (m = String(c)), u && n(r($u) + "("), d && n(`(${r(Vu)}(${f ? "true" : ""}), `), i && n(Sp), n(r(d ? Fd(t.inSSR, p) : Pd(t.inSSR, p)) + "(", -2, e), Ap(zp([
		a,
		o,
		s,
		m,
		l
	]), t), n(")"), d && n(")"), u && (n(", "), jp(u, t), n(")"));
}
function zp(e) {
	let t = e.length;
	for (; t-- && e[t] == null;);
	return e.slice(0, t + 1).map((e) => e || "null");
}
function Bp(e, t) {
	let { push: n, helper: r, pure: i } = t, a = E(e.callee) ? e.callee : r(e.callee);
	i && n(Sp), n(a + "(", -2, e), Ap(e.arguments, t), n(")");
}
function Vp(e, t) {
	let { push: n, indent: r, deindent: i, newline: a } = t, { properties: o } = e;
	if (!o.length) {
		n("{}", -2, e);
		return;
	}
	let s = o.length > 1 || !1;
	n(s ? "{" : "{ "), s && r();
	for (let e = 0; e < o.length; e++) {
		let { key: r, value: i } = o[e];
		Ip(r, t), n(": "), jp(i, t), e < o.length - 1 && (n(","), a());
	}
	s && i(), n(s ? "}" : " }");
}
function Hp(e, t) {
	kp(e.elements, t);
}
function Up(e, t) {
	let { push: n, indent: r, deindent: i } = t, { params: a, returns: o, body: s, newline: c, isSlot: l } = e;
	l && n(`_${xd[gd]}(`), n("(", -2, e), x(a) ? Ap(a, t) : a && jp(a, t), n(") => "), (c || s) && (n("{"), r()), o ? (c && n("return "), x(o) ? kp(o, t) : jp(o, t)) : s && jp(s, t), (c || s) && (i(), n("}")), l && (e.isNonScopedSlot && n(", undefined, true"), n(")"));
}
function Wp(e, t) {
	let { test: n, consequent: r, alternate: i, newline: a } = e, { push: o, indent: s, deindent: c, newline: l } = t;
	if (n.type === 4) {
		let e = !$d(n.content);
		e && o("("), Np(n, t), e && o(")");
	} else o("("), jp(n, t), o(")");
	a && s(), t.indentLevel++, a || o(" "), o("? "), jp(r, t), t.indentLevel--, a && l(), a || o(" "), o(": ");
	let u = i.type === 19;
	u || t.indentLevel++, jp(i, t), u || t.indentLevel--, a && c(!0);
}
function Gp(e, t) {
	let { push: n, helper: r, indent: i, deindent: a, newline: o } = t, { needPauseTracking: s, needArraySpread: c } = e;
	c && n("[...("), n(`_cache[${e.index}] || (`), s && (i(), n(`${r(pd)}(-1`), e.inVOnce && n(", true"), n("),"), o(), n("(")), n(`_cache[${e.index}] = `), jp(e.value, t), s && (n(`).cacheIndex = ${e.index},`), o(), n(`${r(pd)}(1),`), o(), n(`_cache[${e.index}]`), a()), n(")"), c && n(")]");
}
RegExp("\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b");
var Kp = xp(/^(?:if|else|else-if)$/, (e, t, n) => qp(e, t, n, (e, t, r) => {
	let i = n.parent.children, a = i.indexOf(e), o = 0;
	for (; a-- >= 0;) {
		let e = i[a];
		e && e.type === 9 && (o += e.branches.length);
	}
	return () => {
		if (r) e.codegenNode = Yp(t, o, n);
		else {
			let r = Zp(e.codegenNode);
			r.alternate = Yp(t, o + e.branches.length - 1, n);
		}
	};
}));
function qp(e, t, n, r) {
	if (t.name !== "else" && (!t.exp || !t.exp.content.trim())) {
		let r = t.exp ? t.exp.loc : e.loc;
		n.onError(J(28, t.loc)), t.exp = q("true", !1, r);
	}
	if (t.name === "if") {
		let i = Jp(e, t), a = {
			type: 9,
			loc: tp(e.loc),
			branches: [i]
		};
		if (n.replaceNode(a), r) return r(a, i, !0);
	} else {
		let i = n.parent.children, a = i.indexOf(e);
		for (; a-- >= -1;) {
			let o = i[a];
			if (o && Ef(o)) {
				n.removeNode(o);
				continue;
			}
			if (o && o.type === 9) {
				(t.name === "else-if" || t.name === "else") && o.branches[o.branches.length - 1].condition === void 0 && n.onError(J(30, e.loc)), n.removeNode();
				let i = Jp(e, t);
				o.branches.push(i);
				let a = r && r(o, i, !1);
				bp(i, n), a && a(), n.currentNode = null;
			} else n.onError(J(30, e.loc));
			break;
		}
	}
}
function Jp(e, t) {
	let n = e.tagType === 3;
	return {
		type: 10,
		loc: e.loc,
		condition: t.name === "else" ? void 0 : t.exp,
		children: n && !cf(e, "for") ? e.children : [e],
		userKey: lf(e, "key"),
		isTemplateIf: n
	};
}
function Yp(e, t, n) {
	return e.condition ? jd(e.condition, Xp(e, t, n), kd(n.helper(Ku), ["\"\"", "true"])) : Xp(e, t, n);
}
function Xp(e, t, n) {
	let { helper: r } = n, i = K("key", q(`${t}`, !1, Cd, 2)), { children: a } = e, o = a[0];
	if (a.length !== 1 || o.type !== 1) if (a.length === 1 && o.type === 11) {
		let e = o.codegenNode;
		return yf(e, i, n), e;
	} else return Td(n, r(Iu), Dd([i]), a, 64, void 0, void 0, !0, !1, !1, e.loc);
	else {
		let e = o.codegenNode, t = Sf(e);
		return t.type === 13 && Id(t, n), yf(t, i, n), e;
	}
}
function Zp(e) {
	for (;;) if (e.type === 19) if (e.alternate.type === 19) e = e.alternate;
	else return e;
	else e.type === 20 && (e = e.value);
}
var Qp = xp("for", (e, t, n) => {
	let { helper: r, removeHelper: i } = n;
	return $p(e, t, n, (t) => {
		let a = kd(r(ed), [t.source]), o = hf(e), s = cf(e, "memo"), c = lf(e, "key", !1, !0);
		c && c.type;
		let l = c && (c.type === 6 ? c.value ? q(c.value.content, !0) : void 0 : c.exp), u = l ? K("key", l) : null, d = t.source.type === 4 && t.source.constType > 0, f = d ? 64 : c ? 128 : 256;
		return t.codegenNode = Td(n, r(Iu), void 0, a, f, void 0, void 0, !0, !d, !1, e.loc), () => {
			let c, { children: f } = t, p = f.length !== 1 || f[0].type !== 1, m = gf(e) ? e : o && e.children.length === 1 && gf(e.children[0]) ? e.children[0] : null;
			if (m ? (c = m.codegenNode, o && u && yf(c, u, n)) : p ? c = Td(n, r(Iu), u ? Dd([u]) : void 0, e.children, 64, void 0, void 0, !0, void 0, !1) : (c = f[0].codegenNode, o && u && yf(c, u, n), c.isBlock !== !d && (c.isBlock ? (i(Vu), i(Fd(n.inSSR, c.isComponent))) : i(Pd(n.inSSR, c.isComponent))), c.isBlock = !d, c.isBlock ? (r(Vu), r(Fd(n.inSSR, c.isComponent))) : r(Pd(n.inSSR, c.isComponent))), s) {
				let e = Ad(tm(t.parseResult, [q("_cached")]));
				e.body = Nd([
					Od([
						"const _memo = (",
						s.exp,
						")"
					]),
					Od([
						"if (_cached && _cached.el",
						...l ? [" && _cached.key === ", l] : [],
						` && ${n.helperString(bd)}(_cached, _memo)) return _cached`
					]),
					Od(["const _item = ", c]),
					q("_item.memo = _memo"),
					q("return _item")
				]), a.arguments.push(e, q("_cache"), q(String(n.cached.length))), n.cached.push(null);
			} else a.arguments.push(Ad(tm(t.parseResult), c, !0));
		};
	});
});
function $p(e, t, n, r) {
	if (!t.exp) {
		n.onError(J(31, t.loc));
		return;
	}
	let i = t.forParseResult;
	if (!i) {
		n.onError(J(32, t.loc));
		return;
	}
	em(i, n);
	let { addIdentifiers: a, removeIdentifiers: o, scopes: s } = n, { source: c, value: l, key: u, index: d } = i, f = {
		type: 11,
		loc: t.loc,
		source: c,
		valueAlias: l,
		keyAlias: u,
		objectIndexAlias: d,
		parseResult: i,
		children: hf(e) ? e.children : [e]
	};
	n.replaceNode(f), s.vFor++;
	let p = r && r(f);
	return () => {
		s.vFor--, p && p();
	};
}
function em(e, t) {
	e.finalized ||= !0;
}
function tm({ value: e, key: t, index: n }, r = []) {
	return nm([
		e,
		t,
		n,
		...r
	]);
}
function nm(e) {
	let t = e.length;
	for (; t-- && !e[t];);
	return e.slice(0, t + 1).map((e, t) => e || q("_".repeat(t + 1), !1));
}
var rm = q("undefined", !1), im = (e, t) => {
	if (e.type === 1 && (e.tagType === 1 || e.tagType === 3)) {
		let n = cf(e, "slot");
		if (n) return n.exp, t.scopes.vSlot++, () => {
			t.scopes.vSlot--;
		};
	}
}, am = (e, t, n, r) => Ad(e, n, !1, !0, n.length ? n[0].loc : r);
function om(e, t, n = am) {
	t.helper(gd);
	let { children: r, loc: i } = e, a = [], o = [], s = t.scopes.vSlot > 0 || t.scopes.vFor > 0, c = cf(e, "slot", !0);
	if (c) {
		let { arg: e, exp: t } = c;
		e && !Xd(e) && (s = !0), a.push(K(e || q("default", !0), n(t, void 0, r, i)));
	}
	let l = !1, u = !1, d = [], f = /* @__PURE__ */ new Set(), p = 0;
	for (let e = 0; e < r.length; e++) {
		let i = r[e], m;
		if (!hf(i) || !(m = cf(i, "slot", !0))) {
			i.type !== 3 && d.push(i);
			continue;
		}
		if (c) {
			t.onError(J(37, m.loc));
			break;
		}
		l = !0;
		let { children: h, loc: g } = i, { arg: _ = q("default", !0), exp: v, loc: y } = m, b;
		Xd(_) ? b = _ ? _.content : "default" : s = !0;
		let x = cf(i, "for"), S = n(v, x, h, g), C, w;
		if (C = cf(i, "if")) s = !0, o.push(jd(C.exp, sm(_, S, p++), rm));
		else if (w = cf(i, /^else(?:-if)?$/, !0)) {
			let n = e, i;
			for (; n-- && (i = r[n], Ef(i)););
			if (i && hf(i) && cf(i, /^(?:else-)?if$/)) {
				let e = o[o.length - 1];
				for (; e.alternate.type === 19;) e = e.alternate;
				e.alternate = w.exp ? jd(w.exp, sm(_, S, p++), rm) : sm(_, S, p++);
			} else t.onError(J(30, w.loc));
		} else if (x) {
			s = !0;
			let e = x.forParseResult;
			e ? (em(e, t), o.push(kd(t.helper(ed), [e.source, Ad(tm(e), sm(_, S), !0)]))) : t.onError(J(32, x.loc));
		} else {
			if (b) {
				if (f.has(b)) {
					t.onError(J(38, y));
					continue;
				}
				f.add(b), b === "default" && (u = !0);
			}
			a.push(K(_, S));
		}
	}
	if (!c) {
		let e = (e, r) => {
			let a = n(e, void 0, r, i);
			return t.compatConfig && (a.isNonScopedSlot = !0), K("default", a);
		};
		l ? d.length && !d.every(Tf) && (u ? t.onError(J(39, d[0].loc)) : a.push(e(void 0, d))) : a.push(e(void 0, r));
	}
	let m = s ? 2 : cm(e.children) ? 3 : 1, h = Dd(a.concat(K("_", q(m + "", !1))), i);
	return o.length && (h = kd(t.helper(nd), [h, Ed(o)])), {
		slots: h,
		hasDynamicSlots: s
	};
}
function sm(e, t, n) {
	let r = [K("name", e), K("fn", t)];
	return n != null && r.push(K("key", q(String(n), !0))), Dd(r);
}
function cm(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		switch (n.type) {
			case 1:
				if (n.tagType === 2 || cm(n.children)) return !0;
				break;
			case 9:
				if (cm(n.branches)) return !0;
				break;
			case 10:
			case 11:
				if (cm(n.children)) return !0;
				break;
		}
	}
	return !1;
}
var lm = /* @__PURE__ */ new WeakMap(), um = (e, t) => function() {
	if (e = t.currentNode, !(e.type === 1 && (e.tagType === 0 || e.tagType === 1))) return;
	let { tag: n, props: r } = e, i = e.tagType === 1, a = i ? dm(e, t) : `"${n}"`, o = O(a) && a.callee === Xu, s, c, l = 0, u, d, f, p = o || a === Lu || a === Ru || !i && (n === "svg" || n === "foreignObject" || n === "math");
	if (r.length > 0) {
		let n = fm(e, t, void 0, i, o);
		s = n.props, l = n.patchFlag, d = n.dynamicPropNames;
		let r = n.directives;
		f = r && r.length ? Ed(r.map((e) => hm(e, t))) : void 0, n.shouldUseBlock && (p = !0);
	}
	if (e.children.length > 0) if (a === zu && (p = !0, l |= 1024), i && a !== Lu && a !== zu) {
		let { slots: n, hasDynamicSlots: r } = om(e, t);
		c = n, r && (l |= 1024);
	} else if (e.children.length === 1 && a !== Lu) {
		let n = e.children[0], r = n.type, i = r === 5 || r === 8;
		i && dp(n, t) === 0 && (l |= 1), c = i || r === 2 ? n : e.children;
	} else c = e.children;
	d && d.length && (u = gm(d)), e.codegenNode = Td(t, a, s, c, l === 0 ? void 0 : l, u, f, !!p, !1, i, e.loc);
};
function dm(e, t, n = !1) {
	let { tag: r } = e, i = _m(r), a = lf(e, "is", !1, !0);
	if (a) if (i || Kd("COMPILER_IS_ON_ELEMENT", t)) {
		let e;
		if (a.type === 6 ? e = a.value && q(a.value.content, !0) : (e = a.exp, e ||= q("is", !1, a.arg.loc)), e) return kd(t.helper(Xu), [e]);
	} else a.type === 6 && a.value.content.startsWith("vue:") && (r = a.value.content.slice(4));
	let o = Zd(r) || t.isBuiltInComponent(r);
	return o ? (n || t.helper(o), o) : (t.helper(Yu), t.components.add(r), xf(r, "component"));
}
function fm(e, t, n = e.props, r, i, a = !1) {
	let { tag: o, loc: s, children: c } = e, l = [], u = [], d = [], f = c.length > 0, p = !1, m = 0, g = !1, _ = !1, v = !1, y = !1, b = !1, x = !1, S = [], C = (e) => {
		l.length && (u.push(Dd(pm(l), s)), l = []), e && u.push(e);
	}, w = () => {
		t.scopes.vFor > 0 && l.push(K(q("ref_for", !0), q("true")));
	}, ee = ({ key: e, value: n }) => {
		if (Xd(e)) {
			let a = e.content, o = h(a);
			if (o && (!r || i) && a.toLowerCase() !== "onclick" && a !== "onUpdate:modelValue" && !se(a) && (y = !0), o && se(a) && (x = !0), o && n.type === 14 && (n = n.arguments[0]), n.type === 20 || (n.type === 4 || n.type === 8) && dp(n, t) > 0) return;
			a === "ref" ? g = !0 : a === "class" ? _ = !0 : a === "style" ? v = !0 : a !== "key" && !S.includes(a) && S.push(a), r && (a === "class" || a === "style") && !S.includes(a) && S.push(a);
		} else b = !0;
	};
	for (let i = 0; i < n.length; i++) {
		let c = n[i];
		if (c.type === 6) {
			let { loc: e, name: n, nameLoc: r, value: i } = c;
			if (n === "ref" && (g = !0, w()), n === "is" && (_m(o) || i && i.content.startsWith("vue:") || Kd("COMPILER_IS_ON_ELEMENT", t))) continue;
			l.push(K(q(n, !0, r), q(i ? i.content : "", !0, i ? i.loc : e)));
		} else {
			let { name: n, arg: i, exp: h, loc: g, modifiers: _ } = c, v = n === "bind", y = n === "on";
			if (n === "slot") {
				r || t.onError(J(40, g));
				continue;
			}
			if (n === "once" || n === "memo" || n === "is" || v && uf(i, "is") && (_m(o) || Kd("COMPILER_IS_ON_ELEMENT", t)) || y && a) continue;
			if ((v && uf(i, "key") || y && f && uf(i, "vue:before-update")) && (p = !0), v && uf(i, "ref") && w(), !i && (v || y)) {
				if (b = !0, h) if (v) {
					if (C(), Kd("COMPILER_V_BIND_OBJECT_ORDER", t)) {
						u.unshift(h);
						continue;
					}
					w(), C(), u.push(h);
				} else C({
					type: 14,
					loc: g,
					callee: t.helper(ld),
					arguments: r ? [h] : [h, "true"]
				});
				else t.onError(J(v ? 34 : 35, g));
				continue;
			}
			v && _.some((e) => e.content === "prop") && (m |= 32);
			let x = t.directiveTransforms[n];
			if (x) {
				let { props: n, needRuntime: r } = x(c, e, t);
				!a && n.forEach(ee), y && i && !Xd(i) ? C(Dd(n, s)) : l.push(...n), r && (d.push(c), D(r) && lm.set(c, r));
			} else ce(n) || (d.push(c), f && (p = !0));
		}
	}
	let T;
	if (u.length ? (C(), T = u.length > 1 ? kd(t.helper(id), u, s) : u[0]) : l.length && (T = Dd(pm(l), s)), b ? m |= 16 : (_ && !r && (m |= 2), v && !r && (m |= 4), S.length && (m |= 8), y && (m |= 32)), !p && (m === 0 || m === 32) && (g || x || d.length > 0) && (m |= 512), !t.inSSR && T) switch (T.type) {
		case 15:
			let e = -1, n = -1, r = !1;
			for (let t = 0; t < T.properties.length; t++) {
				let i = T.properties[t].key;
				Xd(i) ? i.content === "class" ? e = t : i.content === "style" && (n = t) : i.isHandlerKey || (r = !0);
			}
			let i = T.properties[e], a = T.properties[n];
			r ? T = kd(t.helper(sd), [T]) : (i && !Xd(i.value) && (i.value = kd(t.helper(ad), [i.value])), a && (v || a.value.type === 4 && a.value.content.trim()[0] === "[" || a.value.type === 17) && (a.value = kd(t.helper(od), [a.value])));
			break;
		case 14: break;
		default:
			T = kd(t.helper(sd), [kd(t.helper(cd), [T])]);
			break;
	}
	return {
		props: T,
		directives: d,
		patchFlag: m,
		dynamicPropNames: S,
		shouldUseBlock: p
	};
}
function pm(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.key.type === 8 || !i.key.isStatic) {
			n.push(i);
			continue;
		}
		let a = i.key.content, o = t.get(a);
		o ? (a === "style" || a === "class" || h(a)) && mm(o, i) : (t.set(a, i), n.push(i));
	}
	return n;
}
function mm(e, t) {
	e.value.type === 17 ? e.value.elements.push(t.value) : e.value = Ed([e.value, t.value], e.loc);
}
function hm(e, t) {
	let n = [], r = lm.get(e);
	r ? n.push(t.helperString(r)) : (t.helper(Zu), t.directives.add(e.name), n.push(xf(e.name, "directive")));
	let { loc: i } = e;
	if (e.exp && n.push(e.exp), e.arg && (e.exp || n.push("void 0"), n.push(e.arg)), Object.keys(e.modifiers).length) {
		e.arg || (e.exp || n.push("void 0"), n.push("void 0"));
		let t = q("true", !1, i);
		n.push(Dd(e.modifiers.map((e) => K(e, t)), i));
	}
	return Ed(n, e.loc);
}
function gm(e) {
	let t = "[";
	for (let n = 0, r = e.length; n < r; n++) t += JSON.stringify(e[n]), n < r - 1 && (t += ", ");
	return t + "]";
}
function _m(e) {
	return e === "component" || e === "Component";
}
var vm = (e, t) => {
	if (gf(e)) {
		let { children: n, loc: r } = e, { slotName: i, slotProps: a } = ym(e, t), o = [
			t.prefixIdentifiers ? "_ctx.$slots" : "$slots",
			i,
			"{}",
			"undefined",
			"true"
		], s = 2;
		a && (o[2] = a, s = 3), n.length && (o[3] = Ad([], n, !1, !1, r), s = 4), t.scopeId && !t.slotted && (s = 5), o.splice(s), e.codegenNode = kd(t.helper(td), o, r);
	}
};
function ym(e, t) {
	let n = "\"default\"", r, i = [];
	for (let t = 0; t < e.props.length; t++) {
		let r = e.props[t];
		r.type === 6 ? r.value && (r.name === "name" ? n = JSON.stringify(r.value.content) : (r.name = k(r.name), i.push(r))) : r.name === "bind" && uf(r.arg, "name") ? r.exp ? n = r.exp : r.arg && r.arg.type === 4 && (n = r.exp = q(k(r.arg.content), !1, r.arg.loc)) : (r.name === "bind" && r.arg && Xd(r.arg) && (r.arg.content = k(r.arg.content)), i.push(r));
	}
	if (i.length > 0) {
		let { props: n, directives: a } = fm(e, t, i, !1, !1);
		r = n, a.length && t.onError(J(36, a[0].loc));
	}
	return {
		slotName: n,
		slotProps: r
	};
}
var bm = (e, t, n, r) => {
	let { loc: i, modifiers: a, arg: o } = e;
	!e.exp && !a.length && n.onError(J(35, i));
	let s;
	if (o.type === 4) if (o.isStatic) {
		let e = o.content;
		e.startsWith("vue:") && (e = `vnode-${e.slice(4)}`), s = q(t.tagType !== 0 || e.startsWith("vnode") || !/[A-Z]/.test(e) ? pe(k(e)) : `on:${e}`, !0, o.loc);
	} else s = Od([
		`${n.helperString(fd)}(`,
		o,
		")"
	]);
	else s = o, s.children.unshift(`${n.helperString(fd)}(`), s.children.push(")");
	let c = e.exp;
	c && !c.content.trim() && (c = void 0);
	let l = n.cacheHandlers && !c && !n.inVOnce;
	if (c) {
		let e = af(c), t = !(e || sf(c)), n = c.content.includes(";");
		(t || l && e) && (c = Od([
			`${t ? "$event" : "(...args)"} => ${n ? "{" : "("}`,
			c,
			n ? "}" : ")"
		]));
	}
	let u = { props: [K(s, c || q("() => {}", !1, i))] };
	return r && (u = r(u)), l && (u.props[0].value = n.cache(u.props[0].value)), u.props.forEach((e) => e.key.isHandlerKey = !0), u;
}, xm = (e, t, n) => {
	let { modifiers: r, loc: i } = e, a = e.arg, { exp: o } = e;
	return o && o.type === 4 && !o.content.trim() && (o = void 0), a.type === 4 ? a.isStatic || (a.content = a.content ? `${a.content} || ""` : "\"\"") : (a.children.unshift("("), a.children.push(") || \"\"")), r.some((e) => e.content === "camel") && (a.type === 4 ? a.isStatic ? a.content = k(a.content) : a.content = `${n.helperString(ud)}(${a.content})` : (a.children.unshift(`${n.helperString(ud)}(`), a.children.push(")"))), n.inSSR || (r.some((e) => e.content === "prop") && Sm(a, "."), r.some((e) => e.content === "attr") && Sm(a, "^")), { props: [K(a, o)] };
}, Sm = (e, t) => {
	e.type === 4 ? e.isStatic ? e.content = t + e.content : e.content = `\`${t}\${${e.content}}\`` : (e.children.unshift(`'${t}' + (`), e.children.push(")"));
}, Cm = (e, t) => {
	if (e.type === 0 || e.type === 1 || e.type === 11 || e.type === 10) return () => {
		let n = e.children, r, i = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			if (ff(t)) {
				i = !0;
				for (let i = e + 1; i < n.length; i++) {
					let a = n[i];
					if (ff(a)) r ||= n[e] = Od([t], t.loc), r.children.push(" + ", a), n.splice(i, 1), i--;
					else {
						r = void 0;
						break;
					}
				}
			}
		}
		if (!(!i || n.length === 1 && (e.type === 0 || e.type === 1 && e.tagType === 0 && !e.props.find((e) => e.type === 7 && !t.directiveTransforms[e.name]) && e.tag !== "template"))) for (let e = 0; e < n.length; e++) {
			let r = n[e];
			if (ff(r) || r.type === 8) {
				let i = [];
				(r.type !== 2 || r.content !== " ") && i.push(r), !t.ssr && dp(r, t) === 0 && i.push("1"), n[e] = {
					type: 12,
					content: r,
					loc: r.loc,
					codegenNode: kd(t.helper(qu), i)
				};
			}
		}
	};
}, wm = /* @__PURE__ */ new WeakSet(), Tm = (e, t) => {
	if (e.type === 1 && cf(e, "once", !0)) return wm.has(e) || t.inVOnce || t.inSSR ? void 0 : (wm.add(e), t.inVOnce = !0, t.helper(pd), () => {
		t.inVOnce = !1;
		let e = t.currentNode;
		e.codegenNode &&= t.cache(e.codegenNode, !0, !0);
	});
}, Em = (e, t, n) => {
	let { exp: r, arg: i } = e;
	if (!r) return n.onError(J(41, e.loc)), Dm();
	let a = r.loc.source.trim(), o = r.type === 4 ? r.content : a, s = n.bindingMetadata[a];
	if (s === "props" || s === "props-aliased") return n.onError(J(44, r.loc)), Dm();
	if (s === "literal-const" || s === "setup-const") return n.onError(J(45, r.loc)), Dm();
	if (!o.trim() || !af(r)) return n.onError(J(42, r.loc)), Dm();
	let c = i || q("modelValue", !0), l = i ? Xd(i) ? `onUpdate:${k(i.content)}` : Od(["\"onUpdate:\" + ", i]) : "onUpdate:modelValue", u;
	u = Od([
		`${n.isTS ? "($event: any)" : "$event"} => ((`,
		r,
		") = $event)"
	]);
	let d = [K(c, e.exp), K(l, u)];
	if (e.modifiers.length && t.tagType === 1) {
		let t = e.modifiers.map((e) => e.content).map((e) => ($d(e) ? e : JSON.stringify(e)) + ": true").join(", "), n = i ? Xd(i) ? `${i.content}Modifiers` : Od([i, " + \"Modifiers\""]) : "modelModifiers";
		d.push(K(n, q(`{ ${t} }`, !1, e.loc, 2)));
	}
	return Dm(d);
};
function Dm(e = []) {
	return { props: e };
}
var Om = /[\w).+\-_$\]]/, km = (e, t) => {
	Kd("COMPILER_FILTERS", t) && (e.type === 5 ? Am(e.content, t) : e.type === 1 && e.props.forEach((e) => {
		e.type === 7 && e.name !== "for" && e.exp && Am(e.exp, t);
	}));
};
function Am(e, t) {
	if (e.type === 4) jm(e, t);
	else for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		typeof r == "object" && (r.type === 4 ? jm(r, t) : r.type === 8 ? Am(r, t) : r.type === 5 && Am(r.content, t));
	}
}
function jm(e, t) {
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
			(!t || !Om.test(t)) && (o = !0);
		}
	}
	m === void 0 ? m = n.slice(0, p).trim() : u !== 0 && g();
	function g() {
		h.push(n.slice(u, p).trim()), u = p + 1;
	}
	if (h.length) {
		for (p = 0; p < h.length; p++) m = Mm(m, h[p], t);
		e.content = m, e.ast = void 0;
	}
}
function Mm(e, t, n) {
	n.helper(Qu);
	let r = t.indexOf("(");
	if (r < 0) return n.filters.add(t), `${xf(t, "filter")}(${e})`;
	{
		let i = t.slice(0, r), a = t.slice(r + 1);
		return n.filters.add(i), `${xf(i, "filter")}(${e}${a === ")" ? a : "," + a}`;
	}
}
var Nm = /* @__PURE__ */ new WeakSet(), Pm = (e, t) => {
	if (e.type === 1) {
		let n = cf(e, "memo");
		return !n || Nm.has(e) || t.inSSR ? void 0 : (Nm.add(e), () => {
			let r = e.codegenNode || t.currentNode.codegenNode;
			r && r.type === 13 && (e.tagType !== 1 && Id(r, t), e.codegenNode = kd(t.helper(yd), [
				n.exp,
				Ad(void 0, r),
				"_cache",
				String(t.cached.length)
			]), t.cached.push(null));
		});
	}
}, Fm = (e, t) => {
	if (e.type === 1) {
		for (let n of e.props) if (n.type === 7 && n.name === "bind" && (!n.exp || n.exp.type === 4 && !n.exp.content.trim()) && n.arg) {
			let e = n.arg;
			if (e.type !== 4 || !e.isStatic) t.onError(J(53, e.loc)), n.exp = q("", !0, e.loc);
			else {
				let t = k(e.content);
				(ef.test(t[0]) || t[0] === "-") && (n.exp = q(t, !1, e.loc));
			}
		}
	}
};
function Im(e) {
	return [[
		Fm,
		Tm,
		Kp,
		Pm,
		Qp,
		km,
		vm,
		um,
		im,
		Cm
	], {
		on: bm,
		bind: xm,
		model: Em
	}];
}
function Lm(e, t = {}) {
	let n = t.onError || Jd, r = t.mode === "module";
	t.prefixIdentifiers === !0 ? n(J(48)) : r && n(J(49)), t.cacheHandlers && n(J(50)), t.scopeId && !r && n(J(51));
	let i = _({}, t, { prefixIdentifiers: !1 }), a = E(e) ? sp(e, i) : e, [o, s] = Im();
	return _p(a, _({}, i, {
		nodeTransforms: [...o, ...t.nodeTransforms || []],
		directiveTransforms: _({}, s, t.directiveTransforms || {})
	})), Tp(a, i);
}
var Rm = () => ({ props: [] }), zm = /* @__PURE__ */ Symbol(""), Bm = /* @__PURE__ */ Symbol(""), Vm = /* @__PURE__ */ Symbol(""), Hm = /* @__PURE__ */ Symbol(""), Um = /* @__PURE__ */ Symbol(""), Wm = /* @__PURE__ */ Symbol(""), Gm = /* @__PURE__ */ Symbol(""), Km = /* @__PURE__ */ Symbol(""), qm = /* @__PURE__ */ Symbol(""), Jm = /* @__PURE__ */ Symbol("");
Sd({
	[zm]: "vModelRadio",
	[Bm]: "vModelCheckbox",
	[Vm]: "vModelText",
	[Hm]: "vModelSelect",
	[Um]: "vModelDynamic",
	[Wm]: "withModifiers",
	[Gm]: "withKeys",
	[Km]: "vShow",
	[qm]: "Transition",
	[Jm]: "TransitionGroup"
});
var Ym;
function Xm(e, t = !1) {
	return Ym ||= document.createElement("div"), t ? (Ym.innerHTML = `<div foo="${e.replace(/"/g, "&quot;")}">`, Ym.children[0].getAttribute("foo")) : (Ym.innerHTML = e, Ym.textContent);
}
var Zm = {
	parseMode: "html",
	isVoidTag: Ie,
	isNativeTag: (e) => Ne(e) || Pe(e) || Fe(e),
	isPreTag: (e) => e === "pre",
	isIgnoreNewlineTag: (e) => e === "pre" || e === "textarea",
	decodeEntities: Xm,
	isBuiltInComponent: (e) => {
		if (e === "Transition" || e === "transition") return qm;
		if (e === "TransitionGroup" || e === "transition-group") return Jm;
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
}, Qm = (e) => {
	e.type === 1 && e.props.forEach((t, n) => {
		t.type === 6 && t.name === "style" && t.value && (e.props[n] = {
			type: 7,
			name: "bind",
			arg: q("style", !0, t.loc),
			exp: $m(t.value.content, t.loc),
			modifiers: [],
			loc: t.loc
		});
	});
}, $m = (e, t) => {
	let n = Ee(e);
	return q(JSON.stringify(n), !1, t, 3);
};
function eh(e, t) {
	return J(e, t, void 0);
}
var th = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(eh(54, i)), t.children.length && (n.onError(eh(55, i)), t.children.length = 0), { props: [K(q("innerHTML", !0, i), r || q("", !0))] };
}, nh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(eh(56, i)), t.children.length && (n.onError(eh(57, i)), t.children.length = 0), { props: [K(q("textContent", !0), r ? dp(r, n) > 0 ? r : kd(n.helperString(rd), [r], i) : q("", !0))] };
}, rh = (e, t, n) => {
	let r = Em(e, t, n);
	if (!r.props.length || t.tagType === 1) return r;
	e.arg && n.onError(eh(59, e.arg.loc));
	let { tag: i } = t, a = n.isCustomElement(i);
	if (i === "input" || i === "textarea" || i === "select" || a) {
		let o = Vm, s = !1;
		if (i === "input" || a) {
			let r = lf(t, "type");
			if (r) {
				if (r.type === 7) o = Um;
				else if (r.value) switch (r.value.content) {
					case "radio":
						o = zm;
						break;
					case "checkbox":
						o = Bm;
						break;
					case "file":
						s = !0, n.onError(eh(60, e.loc));
						break;
					default: break;
				}
			} else df(t) && (o = Um);
		} else i === "select" && (o = Hm);
		s || (r.needRuntime = n.helper(o));
	} else n.onError(eh(58, e.loc));
	return r.props = r.props.filter((e) => !(e.key.type === 4 && e.key.content === "modelValue")), r;
}, ih = /* @__PURE__ */ u("passive,once,capture"), ah = /* @__PURE__ */ u("stop,prevent,self,ctrl,shift,alt,meta,exact,middle"), oh = /* @__PURE__ */ u("left,right"), sh = /* @__PURE__ */ u("onkeyup,onkeydown,onkeypress"), ch = (e, t, n, r) => {
	let i = [], a = [], o = [];
	for (let s = 0; s < t.length; s++) {
		let c = t[s].content;
		c === "native" && qd("COMPILER_V_ON_NATIVE", n, r) || ih(c) ? o.push(c) : oh(c) ? Xd(e) ? sh(e.content.toLowerCase()) ? i.push(c) : a.push(c) : (i.push(c), a.push(c)) : ah(c) ? a.push(c) : i.push(c);
	}
	return {
		keyModifiers: i,
		nonKeyModifiers: a,
		eventOptionModifiers: o
	};
}, lh = (e, t) => Xd(e) && e.content.toLowerCase() === "onclick" ? q(t, !0) : e.type === 4 ? e : Od([
	"(",
	e,
	`) === "onClick" ? "${t}" : (`,
	e,
	")"
]), uh = (e, t, n) => bm(e, t, n, (t) => {
	let { modifiers: r } = e;
	if (!r.length) return t;
	let { key: i, value: a } = t.props[0], { keyModifiers: o, nonKeyModifiers: s, eventOptionModifiers: c } = ch(i, r, n, e.loc);
	if (s.includes("right") && (i = lh(i, "onContextmenu")), s.includes("middle") && (i = lh(i, "onMouseup")), s.length && (a = kd(n.helper(Wm), [a, JSON.stringify(s)])), o.length && (!Xd(i) || sh(i.content.toLowerCase())) && (a = kd(n.helper(Gm), [a, JSON.stringify(o)])), c.length) {
		let e = c.map(fe).join("");
		i = Xd(i) ? q(`${i.content}${e}`, !0) : Od([
			"(",
			i,
			`) + "${e}"`
		]);
	}
	return { props: [K(i, a)] };
}), dh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(eh(62, i)), {
		props: [],
		needRuntime: n.helper(Km)
	};
}, fh = (e, t) => {
	e.type === 1 && e.tagType === 0 && (e.tag === "script" || e.tag === "style") && t.removeNode();
}, ph = [Qm], mh = {
	cloak: Rm,
	html: th,
	text: nh,
	model: rh,
	on: uh,
	show: dh
};
function hh(e, t = {}) {
	return Lm(e, _({}, Zm, t, {
		nodeTransforms: [
			fh,
			...ph,
			...t.nodeTransforms || []
		],
		directiveTransforms: _({}, mh, t.directiveTransforms || {}),
		transformHoist: null
	}));
}
//#endregion
//#region node_modules/.pnpm/vue@3.5.39/node_modules/vue/dist/vue.esm-bundler.js
var gh = /* @__PURE__ */ s({
	BaseTransition: () => mi,
	BaseTransitionPropsValidators: () => ui,
	Comment: () => z,
	DeprecationTypes: () => null,
	EffectScope: () => Je,
	ErrorCodes: () => tr,
	ErrorTypeStrings: () => Cc,
	Fragment: () => R,
	KeepAlive: () => ta,
	ReactiveEffect: () => $e,
	Static: () => Cs,
	Suspense: () => ds,
	Teleport: () => ri,
	Text: () => Ss,
	TrackOpTypes: () => Hn,
	Transition: () => Vc,
	TransitionGroup: () => Xl,
	TriggerOpTypes: () => Un,
	VueElement: () => Hl,
	assertNumber: () => er,
	callWithAsyncErrorHandling: () => ir,
	callWithErrorHandling: () => rr,
	camelize: () => k,
	capitalize: () => fe,
	cloneVNode: () => Rs,
	compatUtils: () => null,
	compile: () => vh,
	computed: () => gc,
	createApp: () => Au,
	createBlock: () => As,
	createCommentVNode: () => W,
	createElementBlock: () => V,
	createElementVNode: () => H,
	createHydrationRenderer: () => $o,
	createPropsRestProxy: () => Qa,
	createRenderer: () => Qo,
	createSSRApp: () => ju,
	createSlots: () => Aa,
	createStaticVNode: () => Bs,
	createTextVNode: () => zs,
	createVNode: () => U,
	customRef: () => Pn,
	defineAsyncComponent: () => Qi,
	defineComponent: () => xi,
	defineCustomElement: () => zl,
	defineEmits: () => Ba,
	defineExpose: () => Va,
	defineModel: () => Wa,
	defineOptions: () => Ha,
	defineProps: () => za,
	defineSSRCustomElement: () => Bl,
	defineSlots: () => Ua,
	devtools: () => wc,
	effect: () => ft,
	effectScope: () => Ye,
	getCurrentInstance: () => Xs,
	getCurrentScope: () => Xe,
	getCurrentWatcher: () => qn,
	getTransitionRawChildren: () => bi,
	guardReactiveProps: () => Ls,
	h: () => _c,
	handleError: () => ar,
	hasInjectionContext: () => Ir,
	hydrate: () => ku,
	hydrateOnIdle: () => Gi,
	hydrateOnInteraction: () => Yi,
	hydrateOnMediaQuery: () => Ji,
	hydrateOnVisible: () => qi,
	initCustomFormatter: () => vc,
	initDirectivesForSSR: () => Fu,
	inject: () => Fr,
	isMemoSame: () => bc,
	isProxy: () => bn,
	isReactive: () => _n,
	isReadonly: () => vn,
	isRef: () => F,
	isRuntimeOnly: () => lc,
	isShallow: () => yn,
	isVNode: () => js,
	markRaw: () => xn,
	mergeDefaults: () => Xa,
	mergeModels: () => Za,
	mergeProps: () => Ws,
	nextTick: () => mr,
	nodeOps: () => Fc,
	normalizeClass: () => De,
	normalizeProps: () => Oe,
	normalizeStyle: () => Se,
	onActivated: () => ra,
	onBeforeMount: () => da,
	onBeforeUnmount: () => ha,
	onBeforeUpdate: () => pa,
	onDeactivated: () => ia,
	onErrorCaptured: () => ba,
	onMounted: () => fa,
	onRenderTracked: () => ya,
	onRenderTriggered: () => va,
	onScopeDispose: () => Ze,
	onServerPrefetch: () => _a,
	onUnmounted: () => ga,
	onUpdated: () => ma,
	onWatcherCleanup: () => Jn,
	openBlock: () => B,
	patchProp: () => Fl,
	popScopeId: () => Ar,
	provide: () => Pr,
	proxyRefs: () => Mn,
	pushScopeId: () => kr,
	queuePostFlushCb: () => vr,
	reactive: () => fn,
	readonly: () => mn,
	ref: () => wn,
	registerRuntimeCompiler: () => cc,
	render: () => Ou,
	renderList: () => ka,
	renderSlot: () => ja,
	resolveComponent: () => Ca,
	resolveDirective: () => Ea,
	resolveDynamicComponent: () => Ta,
	resolveFilter: () => null,
	resolveTransitionHooks: () => gi,
	setBlockTracking: () => Os,
	setDevtoolsHook: () => Tc,
	setTransitionHooks: () => yi,
	shallowReactive: () => pn,
	shallowReadonly: () => hn,
	shallowRef: () => Tn,
	ssrContextKey: () => Lr,
	ssrUtils: () => Ec,
	stop: () => pt,
	toDisplayString: () => M,
	toHandlerKey: () => pe,
	toHandlers: () => Na,
	toRaw: () => P,
	toRef: () => Rn,
	toRefs: () => Fn,
	toValue: () => An,
	transformVNodeArgs: () => Ns,
	triggerRef: () => On,
	unref: () => kn,
	useAttrs: () => qa,
	useCssModule: () => Gl,
	useCssVars: () => ll,
	useHost: () => Ul,
	useId: () => Si,
	useModel: () => bo,
	useSSRContext: () => Rr,
	useShadowRoot: () => Wl,
	useSlots: () => Ka,
	useTemplateRef: () => wi,
	useTransitionState: () => ci,
	vModelCheckbox: () => su,
	vModelDynamic: () => mu,
	vModelRadio: () => lu,
	vModelSelect: () => uu,
	vModelText: () => G,
	vShow: () => al,
	version: () => xc,
	warn: () => Sc,
	watch: () => Hr,
	watchEffect: () => zr,
	watchPostEffect: () => Br,
	watchSyncEffect: () => Vr,
	withAsyncContext: () => $a,
	withCtx: () => Mr,
	withDefaults: () => Ga,
	withDirectives: () => I,
	withKeys: () => Su,
	withMemo: () => yc,
	withModifiers: () => bu,
	withScopeId: () => jr
}), _h = /* @__PURE__ */ Object.create(null);
function vh(e, t) {
	if (!E(e)) if (e.nodeType) e = e.innerHTML;
	else return p;
	let n = be(e, t), r = _h[n];
	if (r) return r;
	if (e[0] === "#") {
		let t = document.querySelector(e);
		e = t ? t.innerHTML : "";
	}
	let i = _({
		hoistStatic: !0,
		onError: void 0,
		onWarn: p
	}, t);
	!i.isCustomElement && typeof customElements < "u" && (i.isCustomElement = (e) => !!customElements.get(e));
	let { code: a } = hh(e, i), o = Function("Vue", a)(Dc);
	return o._rc = !0, _h[n] = o;
}
cc(vh);
//#endregion
//#region admin-app/src/shell-contract.mjs
function yh(e = globalThis.document) {
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
//#region admin-app/src/services/template-layout-service.mjs
async function bh(e, { fetchImpl: t = globalThis.fetch } = {}) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	let r = await t(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(n)}`, { cache: "no-store" }), i = await r.json().catch(() => ({}));
	if (!r.ok) throw Error(i.message || i.error || `Layout request failed (${r.status})`);
	return i;
}
function xh(e, t = globalThis.location?.origin) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	let r = new URL("/prototype/visual-editor.html", t);
	return r.searchParams.set("mode", "admin-layout"), r.searchParams.set("templateId", n), r.toString();
}
var Sh = Object.freeze({
	requestLayout: bh,
	editorUrl: xh
}), Ch = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, wh = {
	name: "TemplateLayoutManager",
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
	data() {
		return {
			layoutRevision: null,
			loading: !1,
			error: "",
			requestRevision: 0
		};
	},
	computed: { headingId() {
		return `template-layout-manager-${String(this.template?.id || "none").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
	} },
	watch: { "template.id": {
		immediate: !0,
		handler() {
			this.loadLayout();
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
				let t = await Sh.requestLayout(this.template.id);
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
			!this.template?.id || this.template.status !== "draft" || globalThis.open(Sh.editorUrl(this.template.id), "_blank", "noopener");
		}
	}
}, Th = ["aria-labelledby"], Eh = { class: "template-layout-settings-copy" }, Dh = { class: "template-layout-settings-eyebrow" }, Oh = ["id"], kh = { key: 0 }, Ah = {
	key: 1,
	class: "field-error"
}, jh = { class: "template-layout-settings-actions" }, Mh = ["disabled"], Nh = { key: 0 }, Ph = { key: 1 };
function Fh(e, t, n, r, i, a) {
	return B(), V("section", {
		class: "template-layout-settings",
		"aria-labelledby": a.headingId
	}, [H("div", Eh, [
		H("span", Dh, M(n.translate("admin.templateLayout.eyebrow")), 1),
		H("h3", { id: a.headingId }, M(n.translate("admin.templateLayout.title")), 9, Oh),
		H("p", null, M(n.translate("admin.templateLayout.description")), 1),
		H("span", { class: De(["template-layout-settings-state", "status-" + n.template.status]) }, [zs(" v" + M(n.template.version) + " · " + M(n.statusLabel(n.template.status)), 1), i.layoutRevision ? (B(), V(R, { key: 0 }, [zs(" · " + M(n.translate("admin.templateLayout.revision")) + " r" + M(i.layoutRevision), 1)], 64)) : W("", !0)], 2),
		i.loading ? (B(), V("small", kh, M(n.translate("admin.templateLayout.loading")), 1)) : i.error ? (B(), V("small", Ah, M(i.error), 1)) : W("", !0)
	]), H("div", jh, [H("button", {
		class: "tiny-button primary template-layout-settings-button",
		type: "button",
		disabled: n.template.status !== "draft",
		onClick: t[0] ||= (...e) => a.openEditor && a.openEditor(...e)
	}, M(n.translate("admin.templateLayout.openEditor")), 9, Mh), n.template.status === "draft" ? (B(), V("small", Ph, M(n.translate("admin.templateLayout.draftHelp")), 1)) : (B(), V("small", Nh, M(n.translate("admin.templateLayout.readOnlyHelp")), 1))])], 8, Th);
}
var Ih = /*#__PURE__*/ Ch(wh, [["render", Fh]]), Lh = /^--(?:promo|app)-[a-z0-9-]+$/;
function Rh(e) {
	if (Array.isArray(e)) {
		let t = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			let n = String(e?.tokenKey || e?.token_key || "").trim(), r = String(e?.value ?? e?.tokenValue ?? e?.token_value ?? "").trim();
			!Lh.test(n) || !r || (t.has(n) || t.set(n, []), t.get(n).push({
				value: r,
				valueIndex: Math.max(0, Number.parseInt(e?.valueIndex ?? e?.value_index ?? 0, 10) || 0)
			}));
		}), Object.fromEntries([...t.entries()].map(([e, t]) => [e, t.sort((e, t) => e.valueIndex - t.valueIndex).map((e) => e.value).join(", ")]));
	}
	return !e || typeof e != "object" ? {} : Object.fromEntries(Object.entries(e).map(([e, t]) => [String(e).trim(), String(t ?? "").trim()]).filter(([e, t]) => Lh.test(e) && t));
}
function zh(e, t = {}) {
	let n = Rh(e), r = String(t.background || "#f5f7fb"), i = String(t.text || "#172033"), a = String(t.muted || "#64748b"), o = String(t.accent || "#2563eb"), s = String(t.cta || o), c = String(t.ctaInk || "#ffffff"), l = String(t.radius || "2px"), u = String(t.shadow || "0 10px 32px rgba(33, 43, 61, .12)"), d = n["--promo-bg"] || n["--app-bg"] || n["--promo-surface"] || n["--app-surface"], f = n["--promo-text"] || n["--app-ink"], p = n["--promo-muted"] || n["--app-muted"], m = n["--promo-accent"] || n["--app-accent"], h = n["--promo-radius"] || n["--app-radius"], g = n["--promo-shadow"] || n["--app-shadow"];
	return {
		"--promo-bg": d || r,
		"--promo-ink": f || i,
		"--promo-muted-ink": p || a,
		"--promo-accent": m || o,
		"--promo-cta": `var(--promo-accent, ${s})`,
		"--promo-cta-bg": t.ctaTransparent === !0 ? "transparent" : `var(--promo-accent, ${s})`,
		"--promo-cta-ink": t.ctaTransparent === !0 ? `var(--promo-accent, ${s})` : c,
		"--promo-cta-radius": h || l,
		"--promo-image-radius": h || l,
		"--promo-component-radius": h || l,
		"--promo-component-shadow": g || u,
		"--promo-font": n["--app-font-body"] || n["--app-font-family"] || n["--promo-font"] || t.font || "",
		"--promo-radius": h || l,
		"--promo-shadow": g || u,
		"--promo-hero-bg-image": n["--app-hero-bg-image"] || "none",
		"--promo-button-height": n["--app-button-height"] || "44px",
		"--promo-space-4": n["--app-space-4"] || "18px",
		"--promo-border-width": n["--app-border-width"] || "2px",
		"--promo-font-size-body": n["--app-font-size-body"] || "16px",
		"--promo-title-size": n["--promo-font-size-main-title"] || n["--promo-title-size"] || t.titleSize || "clamp(28px, 5vw, 72px)",
		"--promo-font-weight-strong": n["--app-font-weight-strong"] || "800",
		"--promo-transition-duration": n["--app-transition-duration-normal"] || "200ms",
		"--promo-transition-delay": n["--app-transition-delay"] || "0ms",
		"--promo-transition-ease": n["--app-ease"] || "ease",
		...n
	};
}
//#endregion
//#region admin-app/src/services/design-token-service.mjs
async function Bh(e, t = {}, n = globalThis.fetch) {
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
var Vh = (e, t) => ({
	method: e,
	body: JSON.stringify(t)
}), Hh = Object.freeze({
	list: () => Bh("/api/design-token-sets"),
	catalog: () => Bh("/api/design-token-catalog-import"),
	registerDefinitions: (e) => Bh("/api/design-token-catalog-import", Vh("POST", e)),
	detail: (e) => Bh(`/api/design-token-set?versionId=${encodeURIComponent(e)}`),
	usage: (e) => Bh(`/api/design-token-set-usage?tokenSetId=${encodeURIComponent(e)}`),
	createSet: (e) => Bh("/api/design-token-sets", Vh("POST", e)),
	cloneSet: (e) => Bh("/api/design-token-set-clone", Vh("POST", e)),
	updateMetadata: (e) => Bh("/api/design-token-set-metadata", Vh("PATCH", e)),
	createDraft: (e) => Bh("/api/design-token-set-draft", Vh("POST", e)),
	saveVersion: (e) => Bh("/api/design-token-set-version", Vh("PUT", e)),
	importCsv: (e) => Bh("/api/design-token-set-import", Vh("POST", e)),
	validate: (e) => Bh("/api/design-token-set-validate", Vh("POST", e)),
	activate: (e) => Bh("/api/design-token-set-activate", Vh("POST", e)),
	publish: (e) => Bh("/api/design-token-set-publish", Vh("POST", e)),
	updateStatus: (e) => Bh("/api/design-token-set-status", Vh("POST", e)),
	deleteSet: (e) => Bh("/api/design-token-set-delete", Vh("POST", e)),
	archive: (e) => Bh("/api/design-token-set-archive", Vh("POST", e))
}), Uh = 2 * 1024 * 1024, Wh = /* @__PURE__ */ new Set(["font-size"]), Gh = [
	"font-size",
	"font-weight",
	"line-height",
	"letter-spacing",
	"color",
	"background-color",
	"background-image",
	"border-color",
	"border-radius",
	"box-shadow",
	"gap",
	"padding",
	"margin",
	"width",
	"height"
];
function Kh(e) {
	let t = String(e ?? "");
	return /[",\r\n]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
}
function qh(e) {
	return `${e.tokenKey}:${Number(e.valueIndex || 0)}`;
}
function Jh(e) {
	return JSON.stringify({
		value: String(e.value || ""),
		valueLight: String(e.valueLight || ""),
		valueDark: String(e.valueDark || ""),
		activeTheme: String(e.activeTheme || "dark")
	});
}
var Yh = {
	name: "DesignTokenManager",
	props: { translate: {
		type: Function,
		required: !0
	} },
	emits: ["status", "token-sets-changed"],
	data() {
		return {
			loading: !1,
			saving: !1,
			error: "",
			tokenSets: [],
			definitions: [],
			selectedSetId: "",
			selectedVersionId: "",
			detail: null,
			editorValues: [],
			originalValues: {},
			metadata: {
				name: "",
				description: "",
				changeNote: ""
			},
			createForm: {
				name: "",
				description: ""
			},
			cloneForm: {
				name: "",
				description: ""
			},
			showCreate: !1,
			showSettings: !1,
			showClone: !1,
			showAddToken: !1,
			addTokenError: "",
			tokenForm: {
				tokenKey: "--promo-font-size-",
				label: "",
				category: "typography",
				valueType: "length",
				cssProperty: "font-size",
				unit: "rem",
				valueLight: "1rem",
				valueDark: "1rem",
				themeable: !1
			},
			tokenCssProperties: Gh,
			searchTerm: "",
			categoryFilter: "",
			changedOnly: !1,
			csvSourceName: "",
			importErrors: [],
			validationErrors: [],
			previewViewport: "desktop",
			usage: {
				templates: [],
				aiRuns: {
					total: 0,
					active: 0
				}
			},
			histories: []
		};
	},
	computed: {
		selectedSet() {
			return this.tokenSets.find((e) => e.id === this.selectedSetId) || null;
		},
		activeVersionId() {
			return this.selectedSet?.activeVersion?.id || "";
		},
		workingVersionId() {
			return this.detail?.status === "draft" ? this.detail.id : "";
		},
		isDarkOnlySet() {
			return `${this.selectedSet?.setKey || ""} ${this.selectedSet?.name || ""}`.toLowerCase().includes("ggpoker");
		},
		setIsActive() {
			return this.selectedSet?.status === "active";
		},
		categories() {
			return [...new Set(this.editorValues.map((e) => e.category || "general"))].sort();
		},
		filteredValues() {
			let e = this.searchTerm.trim().toLowerCase();
			return this.editorValues.filter((t) => this.categoryFilter && t.category !== this.categoryFilter || this.changedOnly && !this.isTokenChanged(t) ? !1 : !e || [
				t.tokenKey,
				t.semanticRole,
				t.category
			].some((t) => String(t || "").toLowerCase().includes(e)));
		},
		isDirty() {
			return this.editorValues.some((e) => this.isTokenChanged(e));
		},
		previewStyle() {
			return {
				...zh(this.tokenPayload(), {
					background: "var(--app-surface)",
					text: "var(--app-ink)",
					muted: "var(--app-muted)",
					accent: "var(--app-accent)",
					radius: "var(--app-radius-small)"
				}),
				"--promo-width": "1280px"
			};
		}
	},
	mounted() {
		globalThis.addEventListener("beforeunload", this.preventUnsavedExit), this.reload();
	},
	beforeUnmount() {
		globalThis.removeEventListener("beforeunload", this.preventUnsavedExit);
	},
	methods: {
		tokenIdentity: qh,
		t(e, t) {
			return this.translate(e, t);
		},
		notify(e, t) {
			this.$emit("status", this.t(e, t));
		},
		async run(e) {
			this.saving = !0, this.error = "";
			try {
				return await e();
			} catch (e) {
				throw this.error = e.message, e;
			} finally {
				this.saving = !1;
			}
		},
		async reload(e = this.selectedSetId) {
			this.loading = !0, this.error = "";
			try {
				let [t, n] = await Promise.all([Hh.list(), Hh.catalog()]);
				this.tokenSets = t.tokenSets || [], this.definitions = n.definitions || [], this.selectedSetId = this.tokenSets.some((t) => t.id === e) ? e : this.tokenSets[0]?.id || "", await this.selectSet(this.selectedSetId, !0), this.$emit("token-sets-changed");
			} catch (e) {
				this.error = e.message;
			} finally {
				this.loading = !1;
			}
		},
		async selectSet(e, t = !1) {
			if (!t && e !== this.selectedSetId && this.isDirty && !globalThis.confirm(this.t("admin.designToken.unsavedConfirm"))) return;
			this.selectedSetId = e;
			let n = this.selectedSet;
			this.metadata = {
				name: n?.name || "",
				description: n?.description || "",
				changeNote: ""
			};
			let r = n?.draftVersion?.id || n?.activeVersion?.id || n?.versions?.[0]?.id || "";
			r ? await this.selectVersion(r) : this.clearDetail();
		},
		clearDetail() {
			this.selectedVersionId = "", this.detail = null, this.editorValues = this.definitions.map((e) => ({
				...e,
				valueIndex: 0,
				value: "",
				valueLight: "",
				valueDark: "",
				activeTheme: "dark",
				metadata: {}
			})), this.originalValues = Object.fromEntries(this.editorValues.map((e) => [qh(e), Jh(e)])), this.usage = {
				templates: [],
				aiRuns: {
					total: 0,
					active: 0
				}
			}, this.histories = [];
		},
		async selectVersion(e) {
			this.selectedVersionId = e;
			let t = await Hh.detail(e);
			this.detail = t.tokenSet, this.usage = t.usage || {
				templates: [],
				aiRuns: {
					total: 0,
					active: 0
				}
			}, this.histories = t.histories || [];
			let n = new Map(this.definitions.map((e) => [e.tokenKey, e])), r = this.detail.values || [];
			this.editorValues = r.length ? r.map((e) => ({
				...n.get(e.tokenKey) || {},
				...e
			})) : this.definitions.map((e) => ({
				...e,
				valueIndex: 0,
				value: "",
				valueLight: "",
				valueDark: "",
				activeTheme: "dark",
				metadata: {}
			})), this.isDarkOnlySet && (this.editorValues = this.editorValues.map((e) => {
				let t = String(e.valueDark || e.valueLight || e.value || "").trim();
				return {
					...e,
					value: t,
					valueLight: "",
					valueDark: t,
					activeTheme: "dark"
				};
			})), this.originalValues = Object.fromEntries(this.editorValues.map((e) => [qh(e), Jh(e)])), this.importErrors = [], this.validationErrors = [];
		},
		tokenPayload() {
			return this.editorValues.map((e) => ({
				tokenKey: e.tokenKey,
				valueIndex: Number(e.valueIndex || 0),
				value: this.isDarkOnlySet && e.valueDark || e.value,
				valueLight: this.isDarkOnlySet ? "" : e.valueLight || e.value,
				valueDark: this.isDarkOnlySet ? e.valueDark || e.value : e.valueDark || "",
				activeTheme: this.isDarkOnlySet ? "dark" : e.activeTheme || "dark",
				metadata: e.metadata || {}
			}));
		},
		isTokenChanged(e) {
			return Jh(e) !== String(this.originalValues[qh(e)] || "");
		},
		restoreToken(e) {
			let t = JSON.parse(this.originalValues[qh(e)] || "{}");
			Object.assign(e, t);
		},
		restoreAll() {
			this.editorValues = this.editorValues.filter((e) => !this.isNewToken(e)), this.editorValues.forEach((e) => this.restoreToken(e));
		},
		fieldType(e) {
			return e.valueType === "color" ? "color" : "text";
		},
		updateResolvedValue(e) {
			e.value = this.isDarkOnlySet ? e.valueDark || e.valueLight : e.activeTheme === "light" ? e.valueLight || e.valueDark : e.valueDark || e.valueLight, this.isDarkOnlySet && (e.valueLight = "", e.activeTheme = "dark");
		},
		isNewToken(e) {
			return !this.definitions.some((t) => t.tokenKey === e.tokenKey);
		},
		currentTokenValue(e) {
			return String(e.value || e.valueDark || e.valueLight || "").trim();
		},
		isFontSizeToken(e) {
			return (e.cssProperties || [e.cssProperty].filter(Boolean)).some((e) => Wh.has(e));
		},
		isFixedFontSize(e) {
			return this.isFontSizeToken(e) && /^-?(?:\d+|\d*\.\d+)px$/i.test(this.currentTokenValue(e));
		},
		tokenVisualKind(e) {
			let t = e.cssProperties || [e.cssProperty].filter(Boolean);
			return e.valueType === "color" ? "color" : e.valueType === "gradient" ? "gradient" : t.includes("font-size") ? "font-size" : t.includes("font-weight") ? "font-weight" : t.includes("border-radius") ? "radius" : t.includes("box-shadow") ? "shadow" : t.some((e) => [
				"gap",
				"padding",
				"margin",
				"width",
				"height"
			].includes(e)) ? "length" : "text";
		},
		tokenVisualStyle(e) {
			let t = this.currentTokenValue(e);
			if (!t || /url\s*\(|expression\s*\(|[;{}]/i.test(t)) return {};
			let n = this.tokenVisualKind(e);
			return n === "color" ? { backgroundColor: t } : n === "gradient" ? { backgroundImage: t } : n === "font-size" ? { fontSize: t } : n === "font-weight" ? { fontWeight: t } : n === "radius" ? { borderRadius: t } : n === "shadow" ? { boxShadow: t } : n === "length" ? { width: `min(${t}, 4rem)` } : {};
		},
		convertPxValue(e, t) {
			let n = String(e || "").trim().match(/^(-?(?:\d+|\d*\.\d+))px$/i);
			if (!n) return e;
			let r = Number(n[1]), i = (e) => Number(e.toFixed(4));
			if (t === "rem") return `${i(r / 16)}rem`;
			let a = r <= 20 ? Math.max(14, r * .875) : r * .75, o = r * 1.125, s = (o - a) / 1065 * 100, c = a - s * 375 / 100;
			return `clamp(${i(a / 16)}rem, calc(${i(c / 16)}rem + ${i(s)}vw), ${i(o / 16)}rem)`;
		},
		convertFontSize(e, t) {
			e.valueLight = this.convertPxValue(e.valueLight || e.value, t), (e.themeable || this.isDarkOnlySet) && (e.valueDark = this.convertPxValue(e.valueDark || e.value, t)), this.updateResolvedValue(e);
		},
		resetTokenForm() {
			this.tokenForm = {
				tokenKey: "--promo-font-size-",
				label: "",
				category: "typography",
				valueType: "length",
				cssProperty: "font-size",
				unit: "rem",
				valueLight: "1rem",
				valueDark: "1rem",
				themeable: !1
			}, this.addTokenError = "";
		},
		addToken() {
			this.addTokenError = "";
			let e = { ...this.tokenForm };
			if (!/^(?:--promo-|--app-)[a-z0-9-]+$/.test(e.tokenKey)) {
				this.addTokenError = "토큰 키는 --promo-* 또는 --app-* 형식이어야 합니다.";
				return;
			}
			if (this.editorValues.some((t) => t.tokenKey === e.tokenKey)) {
				this.addTokenError = "이미 등록된 토큰 키입니다.";
				return;
			}
			if (!e.label.trim() || !e.valueLight.trim()) {
				this.addTokenError = "이름과 Light 값을 입력하세요.";
				return;
			}
			let t = this.isDarkOnlySet ? e.valueLight : e.themeable ? e.valueDark || e.valueLight : "", n = this.isDarkOnlySet ? t : e.valueLight;
			this.editorValues.push({
				tokenKey: e.tokenKey,
				label: e.label.trim(),
				semanticRole: e.label.trim(),
				category: e.category.trim() || "general",
				categoryLabel: e.category.trim() || "general",
				valueType: e.valueType,
				cssProperty: e.cssProperty,
				cssProperties: [e.cssProperty],
				unit: e.unit.trim(),
				themeable: !this.isDarkOnlySet && e.themeable,
				cardinality: "single",
				required: !1,
				aiSelectable: !1,
				editable: !0,
				valueIndex: 0,
				value: n,
				valueLight: this.isDarkOnlySet ? "" : e.valueLight,
				valueDark: t,
				activeTheme: this.isDarkOnlySet ? "dark" : "light",
				metadata: {}
			}), this.showAddToken = !1, this.resetTokenForm();
		},
		removeNewToken(e) {
			this.editorValues = this.editorValues.filter((t) => qh(t) !== qh(e));
		},
		pendingDefinitions() {
			return this.editorValues.filter((e) => this.isNewToken(e)).map((e) => ({
				tokenKey: e.tokenKey,
				category: e.category || "general",
				categoryLabel: e.categoryLabel || e.category || "general",
				label: e.label || e.semanticRole || e.tokenKey,
				valueType: e.valueType,
				semanticRole: e.semanticRole || e.label || e.tokenKey,
				cssProperty: e.cssProperty,
				cssProperties: e.cssProperties || [e.cssProperty].filter(Boolean),
				unit: e.unit || "",
				themeable: e.themeable === !0,
				cardinality: e.cardinality || "single",
				allowedValues: e.allowedValues || [],
				required: !1,
				aiSelectable: e.aiSelectable === !0,
				editable: !0
			}));
		},
		async publish() {
			this.validationErrors = [];
			try {
				let e = this.pendingDefinitions();
				e.length && await this.run(() => Hh.registerDefinitions({ definitions: e })), await this.run(() => Hh.publish({
					tokenSetId: this.selectedSetId,
					sourceVersionId: this.activeVersionId,
					workingVersionId: this.workingVersionId,
					tokens: this.tokenPayload(),
					sourceName: this.csvSourceName,
					changeNote: this.metadata.changeNote
				})), await this.reload(this.selectedSetId), this.notify("admin.designToken.saveSuccess");
			} catch (e) {
				this.validationErrors = e.details?.errors || [];
			}
		},
		save() {
			return this.publish();
		},
		async onCsvFile(e) {
			this.importErrors = [];
			let t = e.target.files?.[0];
			if (e.target.value = "", t) {
				if (!/\.csv$/i.test(t.name) && t.type !== "text/csv") {
					this.error = this.t("admin.designToken.csvTypeError");
					return;
				}
				if (t.size > Uh) {
					this.error = this.t("admin.designToken.csvSizeError");
					return;
				}
				this.csvSourceName = t.name;
				try {
					let e = (await t.text()).replace(/^\uFEFF/, "");
					await this.run(() => Hh.importCsv({
						tokenSetId: this.selectedSetId,
						csvText: e,
						sourceName: t.name,
						dryRun: !1,
						registerCatalog: !0,
						activeTheme: "dark",
						changeNote: "CSV 전체 토큰을 Dark 기준 초안으로 가져왔습니다."
					})), await this.reload(this.selectedSetId), this.notify("admin.designToken.importValidated");
				} catch (e) {
					this.importErrors = e.details?.errors || [];
				}
			}
		},
		exportCsv() {
			let e = [[
				"category",
				"category_label",
				"token",
				"label",
				"type",
				"unit",
				"themeable",
				"cardinality",
				"value_index",
				"css_properties",
				"value_light",
				"value_dark"
			], ...this.editorValues.map((e) => [
				e.category || "",
				e.categoryLabel || e.metadata?.categoryLabel || "",
				e.tokenKey,
				e.label || e.metadata?.label || e.semanticRole || "",
				e.valueType || e.metadata?.type || "",
				e.unit || e.metadata?.unit || "",
				e.themeable === !0 || e.metadata?.themeable === !0 ? "TRUE" : "FALSE",
				e.cardinality || e.metadata?.cardinality || "single",
				Number(e.valueIndex || 0),
				(e.cssProperties || e.metadata?.cssProperties || [e.cssProperty]).filter(Boolean).join(";"),
				e.valueLight || "",
				e.valueDark || ""
			])].map((e) => e.map(Kh).join(",")), t = new Blob([`\uFEFF${e.join("\r\n")}`], { type: "text/csv;charset=utf-8" }), n = URL.createObjectURL(t), r = document.createElement("a");
			r.href = n, r.download = `${this.selectedSet?.setKey || "promo-design-tokens"}.csv`, r.click(), URL.revokeObjectURL(n);
		},
		async createSet() {
			let e = await this.run(() => Hh.createSet(this.createForm));
			this.showCreate = !1, this.createForm = {
				name: "",
				description: ""
			}, await this.reload(e.tokenSet.id), this.notify("admin.designToken.created");
		},
		async saveMetadata() {
			await this.run(() => Hh.updateMetadata({
				tokenSetId: this.selectedSetId,
				...this.metadata
			})), await this.reload(this.selectedSetId), this.notify("admin.designToken.metadataSaved");
		},
		async cloneSet() {
			let e = await this.run(() => Hh.cloneSet({
				sourceVersionId: this.selectedVersionId,
				...this.cloneForm
			}));
			this.showClone = !1, this.cloneForm = {
				name: "",
				description: ""
			}, await this.reload(e.tokenSet.tokenSetId), this.notify("admin.designToken.cloned");
		},
		async archiveSet() {
			globalThis.confirm(this.t("admin.designToken.deleteConfirm")) && (await this.run(() => Hh.deleteSet({ tokenSetId: this.selectedSetId })), await this.reload(""), this.notify("admin.designToken.deleted"));
		},
		async updateSetStatus(e) {
			await this.run(() => Hh.updateStatus({
				tokenSetId: this.selectedSetId,
				action: e
			})), await this.reload(this.selectedSetId), this.notify(e === "activate" ? "admin.designToken.setActivated" : e === "deactivate" ? "admin.designToken.setDeactivated" : "admin.designToken.defaultChanged");
		},
		preventUnsavedExit(e) {
			this.isDirty && (e.preventDefault(), e.returnValue = "");
		}
	}
}, Xh = { class: "design-token-manager" }, Zh = { class: "design-token-toolbar" }, Qh = { class: "design-token-actions" }, $h = ["disabled"], eg = {
	key: 0,
	class: "outline-item danger-state"
}, tg = { class: "field" }, ng = { class: "field" }, rg = ["disabled"], ig = { class: "design-token-grid" }, ag = { class: "design-token-column design-token-list" }, og = ["onClick"], sg = {
	key: 0,
	class: "empty-state"
}, cg = { class: "design-token-column design-token-editor" }, lg = { class: "design-token-table-toolbar" }, ug = ["placeholder"], dg = { value: "" }, fg = ["value"], pg = { class: "app-checkbox design-token-check" }, mg = ["disabled"], hg = ["disabled"], gg = { class: "form-grid compact" }, _g = { class: "field" }, vg = { class: "field" }, yg = { class: "field" }, bg = { class: "field" }, xg = { class: "field" }, Sg = ["value"], Cg = { class: "field" }, wg = { class: "field" }, Tg = {
	key: 0,
	class: "field"
}, Eg = ["disabled", "placeholder"], Dg = {
	key: 0,
	class: "app-checkbox design-token-check"
}, Og = {
	key: 1,
	class: "danger-state"
}, kg = { class: "design-token-actions" }, Ag = { class: "design-token-table-wrap" }, jg = { class: "design-token-table" }, Mg = { key: 0 }, Ng = { key: 0 }, Pg = { key: 0 }, Fg = { class: "design-token-value-control" }, Ig = [
	"onUpdate:modelValue",
	"disabled",
	"onInput"
], Lg = { class: "design-token-value-control" }, Rg = [
	"onUpdate:modelValue",
	"disabled",
	"placeholder",
	"onInput"
], zg = {
	key: 0,
	class: "design-token-responsive-warning"
}, Bg = ["onClick"], Vg = ["onClick"], Hg = ["onClick"], Ug = ["onClick"], Wg = {
	key: 1,
	class: "design-token-errors"
}, Gg = { class: "design-token-actions sticky-actions" }, Kg = { class: "tiny-button file-button" }, qg = ["disabled"], Jg = {
	key: 0,
	class: "source-name"
}, Yg = ["disabled"], Xg = { class: "design-token-column design-token-inspector" }, Zg = { class: "design-token-section" }, Qg = { class: "design-token-actions" }, $g = { class: "rendered-section" }, e_ = { class: "rendered-section__inner" }, t_ = { class: "rendered-empty" }, n_ = { class: "rendered-text rendered-text--title" }, r_ = { class: "rendered-cta" }, i_ = { class: "design-token-section" }, a_ = { class: "field" }, o_ = { class: "field" }, s_ = { class: "field" }, c_ = { class: "design-token-actions" }, l_ = ["disabled"], u_ = ["disabled"], d_ = ["disabled"], f_ = ["disabled", "title"], p_ = ["disabled"], m_ = ["disabled"], h_ = { class: "field" }, g_ = { class: "field" }, __ = ["disabled"];
function v_(e, t, n, r, i, a) {
	return B(), V("section", Xh, [
		H("div", Zh, [H("div", null, [H("h2", null, M(a.t("admin.designToken.title")), 1), H("p", null, M(a.t("admin.designToken.scopeNotice")), 1)]), H("div", Qh, [H("button", {
			class: "tiny-button",
			type: "button",
			disabled: i.loading,
			onClick: t[0] ||= (e) => a.reload()
		}, M(a.t("common.action.refresh")), 9, $h), H("button", {
			class: "tiny-button primary",
			type: "button",
			onClick: t[1] ||= (e) => i.showCreate = !i.showCreate
		}, M(a.t("admin.designToken.addSet")), 1)])]),
		i.error ? (B(), V("div", eg, M(i.error), 1)) : W("", !0),
		i.showCreate ? (B(), V("form", {
			key: 1,
			class: "design-token-create",
			onSubmit: t[4] ||= bu((...e) => a.createSet && a.createSet(...e), ["prevent"])
		}, [
			H("label", tg, [H("span", null, M(a.t("admin.designToken.name")), 1), I(H("input", {
				"onUpdate:modelValue": t[2] ||= (e) => i.createForm.name = e,
				required: ""
			}, null, 512), [[
				G,
				i.createForm.name,
				void 0,
				{ trim: !0 }
			]])]),
			H("label", ng, [H("span", null, M(a.t("admin.designToken.description")), 1), I(H("input", { "onUpdate:modelValue": t[3] ||= (e) => i.createForm.description = e }, null, 512), [[
				G,
				i.createForm.description,
				void 0,
				{ trim: !0 }
			]])]),
			H("button", {
				class: "tiny-button primary",
				type: "submit",
				disabled: i.saving
			}, M(a.t("common.action.create")), 9, rg)
		], 32)) : W("", !0),
		H("div", ig, [
			H("aside", ag, [
				H("strong", null, M(a.t("admin.designToken.setList")), 1),
				(B(!0), V(R, null, ka(i.tokenSets, (e) => (B(), V("button", {
					key: e.id,
					class: De(["design-token-set", { active: i.selectedSetId === e.id }]),
					type: "button",
					onClick: (t) => a.selectSet(e.id)
				}, [
					H("span", null, M(e.name), 1),
					H("small", null, [zs(M(e.setKey) + " · " + M(a.t(e.status === "inactive" ? "common.state.inactive" : "common.state.active")) + " ", 1), e.isDefault ? (B(), V(R, { key: 0 }, [zs(" · " + M(a.t("admin.designToken.defaultBadge")), 1)], 64)) : W("", !0)]),
					H("small", null, "v" + M(e.draftVersion?.version || e.activeVersion?.version || e.version), 1)
				], 10, og))), 128)),
				!i.loading && !i.tokenSets.length ? (B(), V("div", sg, M(a.t("admin.designToken.emptySets")), 1)) : W("", !0)
			]),
			H("main", cg, [a.selectedSet && i.detail ? (B(), V(R, { key: 0 }, [
				H("div", lg, [
					I(H("input", {
						"onUpdate:modelValue": t[5] ||= (e) => i.searchTerm = e,
						type: "search",
						placeholder: a.t("admin.designToken.search")
					}, null, 8, ug), [[
						G,
						i.searchTerm,
						void 0,
						{ trim: !0 }
					]]),
					I(H("select", { "onUpdate:modelValue": t[6] ||= (e) => i.categoryFilter = e }, [H("option", dg, M(a.t("admin.designToken.allCategories")), 1), (B(!0), V(R, null, ka(a.categories, (e) => (B(), V("option", {
						key: e,
						value: e
					}, M(e), 9, fg))), 128))], 512), [[uu, i.categoryFilter]]),
					H("label", pg, [I(H("input", {
						"onUpdate:modelValue": t[7] ||= (e) => i.changedOnly = e,
						type: "checkbox"
					}, null, 512), [[su, i.changedOnly]]), zs(" " + M(a.t("admin.designToken.changedOnly")), 1)]),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: !a.isDirty,
						onClick: t[8] ||= (...e) => a.restoreAll && a.restoreAll(...e)
					}, M(a.t("common.action.reset")), 9, mg),
					H("button", {
						class: "tiny-button primary",
						type: "button",
						disabled: !a.setIsActive,
						onClick: t[9] ||= (e) => i.showAddToken = !i.showAddToken
					}, "+ 토큰 추가", 8, hg)
				]),
				i.showAddToken ? (B(), V("form", {
					key: 0,
					class: "design-token-add-form",
					onSubmit: t[20] ||= bu((...e) => a.addToken && a.addToken(...e), ["prevent"])
				}, [
					H("div", gg, [
						H("label", _g, [t[38] ||= H("span", null, "토큰 키", -1), I(H("input", {
							"onUpdate:modelValue": t[10] ||= (e) => i.tokenForm.tokenKey = e,
							required: "",
							placeholder: "--promo-font-size-caption"
						}, null, 512), [[
							G,
							i.tokenForm.tokenKey,
							void 0,
							{ trim: !0 }
						]])]),
						H("label", vg, [t[39] ||= H("span", null, "표시 이름", -1), I(H("input", {
							"onUpdate:modelValue": t[11] ||= (e) => i.tokenForm.label = e,
							required: "",
							placeholder: "캡션 글자 크기"
						}, null, 512), [[
							G,
							i.tokenForm.label,
							void 0,
							{ trim: !0 }
						]])]),
						H("label", yg, [t[40] ||= H("span", null, "분류", -1), I(H("input", {
							"onUpdate:modelValue": t[12] ||= (e) => i.tokenForm.category = e,
							placeholder: "typography"
						}, null, 512), [[
							G,
							i.tokenForm.category,
							void 0,
							{ trim: !0 }
						]])]),
						H("label", bg, [t[42] ||= H("span", null, "값 유형", -1), I(H("select", { "onUpdate:modelValue": t[13] ||= (e) => i.tokenForm.valueType = e }, [...t[41] ||= [Bs("<option value=\"length\" data-v-e8497526>length</option><option value=\"color\" data-v-e8497526>color</option><option value=\"number\" data-v-e8497526>number</option><option value=\"gradient\" data-v-e8497526>gradient</option><option value=\"shadow\" data-v-e8497526>shadow</option><option value=\"font\" data-v-e8497526>font</option>", 6)]], 512), [[uu, i.tokenForm.valueType]])]),
						H("label", xg, [t[43] ||= H("span", null, "CSS 속성", -1), I(H("select", { "onUpdate:modelValue": t[14] ||= (e) => i.tokenForm.cssProperty = e }, [(B(!0), V(R, null, ka(i.tokenCssProperties, (e) => (B(), V("option", {
							key: e,
							value: e
						}, M(e), 9, Sg))), 128))], 512), [[uu, i.tokenForm.cssProperty]])]),
						H("label", Cg, [t[45] ||= H("span", null, "권장 단위", -1), I(H("select", { "onUpdate:modelValue": t[15] ||= (e) => i.tokenForm.unit = e }, [...t[44] ||= [Bs("<option value=\"rem\" data-v-e8497526>rem</option><option value=\"responsive\" data-v-e8497526>clamp / calc</option><option value=\"vw\" data-v-e8497526>vw</option><option value=\"vh\" data-v-e8497526>vh</option><option value=\"px\" data-v-e8497526>px</option><option value=\"\" data-v-e8497526>해당 없음</option>", 6)]], 512), [[uu, i.tokenForm.unit]])]),
						H("label", wg, [H("span", null, M(a.isDarkOnlySet ? "Dark (Default) 값" : "Light 값"), 1), I(H("input", {
							"onUpdate:modelValue": t[16] ||= (e) => i.tokenForm.valueLight = e,
							required: "",
							placeholder: "1rem 또는 clamp(...)"
						}, null, 512), [[
							G,
							i.tokenForm.valueLight,
							void 0,
							{ trim: !0 }
						]])]),
						a.isDarkOnlySet ? W("", !0) : (B(), V("label", Tg, [t[46] ||= H("span", null, "Dark 값", -1), I(H("input", {
							"onUpdate:modelValue": t[17] ||= (e) => i.tokenForm.valueDark = e,
							disabled: !i.tokenForm.themeable,
							placeholder: i.tokenForm.themeable ? "1rem" : "Light 공통 사용"
						}, null, 8, Eg), [[
							G,
							i.tokenForm.valueDark,
							void 0,
							{ trim: !0 }
						]])]))
					]),
					a.isDarkOnlySet ? W("", !0) : (B(), V("label", Dg, [I(H("input", {
						"onUpdate:modelValue": t[18] ||= (e) => i.tokenForm.themeable = e,
						type: "checkbox"
					}, null, 512), [[su, i.tokenForm.themeable]]), t[47] ||= zs(" Light/Dark 개별 값 사용", -1)])),
					t[49] ||= H("small", null, "글꼴 크기는 `rem` 또는 `clamp(최소, 유동값, 최대)` 사용을 권장합니다. `vh` 단독 사용은 화면 높이에 따라 과도하게 변할 수 있습니다.", -1),
					i.addTokenError ? (B(), V("span", Og, M(i.addTokenError), 1)) : W("", !0),
					H("div", kg, [H("button", {
						class: "tiny-button",
						type: "button",
						onClick: t[19] ||= (e) => {
							i.showAddToken = !1, a.resetTokenForm();
						}
					}, "취소"), t[48] ||= H("button", {
						class: "tiny-button primary",
						type: "submit"
					}, "목록에 추가", -1)])
				], 32)) : W("", !0),
				H("div", Ag, [H("table", jg, [H("thead", null, [H("tr", null, [
					H("th", null, M(a.t("admin.designToken.category")), 1),
					H("th", null, M(a.t("admin.designToken.token")), 1),
					H("th", null, M(a.t("admin.designToken.type")), 1),
					a.isDarkOnlySet ? W("", !0) : (B(), V("th", Mg, "Light")),
					H("th", null, M(a.isDarkOnlySet ? "Dark (Default)" : "Dark"), 1),
					H("th", null, M(a.t("admin.designToken.value")), 1),
					H("th", null, M(a.t("admin.designToken.status")), 1)
				])]), H("tbody", null, [(B(!0), V(R, null, ka(a.filteredValues, (e) => (B(), V("tr", {
					key: a.tokenIdentity(e),
					class: De(["design-token-value", { changed: a.isTokenChanged(e) }])
				}, [
					H("td", null, [zs(M(e.categoryLabel || e.category), 1), H("small", null, M(e.category), 1)]),
					H("td", null, [H("code", null, M(e.tokenKey), 1), H("small", null, [zs(M(e.label || e.semanticRole), 1), e.cardinality === "list" ? (B(), V(R, { key: 0 }, [zs(" · #" + M(e.valueIndex), 1)], 64)) : W("", !0)])]),
					H("td", null, [zs(M(e.valueType), 1), e.unit ? (B(), V("small", Ng, M(e.unit), 1)) : W("", !0)]),
					a.isDarkOnlySet ? W("", !0) : (B(), V("td", Pg, [H("span", Fg, [I(H("input", {
						"onUpdate:modelValue": (t) => e.valueLight = t,
						type: "text",
						disabled: !e.editable || !a.setIsActive,
						onInput: (t) => a.updateResolvedValue(e)
					}, null, 40, Ig), [[G, e.valueLight]])])])),
					H("td", null, [H("span", Lg, [I(H("input", {
						"onUpdate:modelValue": (t) => e.valueDark = t,
						type: "text",
						disabled: !e.editable || !a.setIsActive || !a.isDarkOnlySet && !e.themeable,
						placeholder: !a.isDarkOnlySet && !e.themeable ? "Light 공통 사용" : "",
						onInput: (t) => a.updateResolvedValue(e)
					}, null, 40, Rg), [[G, e.valueDark]])])]),
					H("td", null, [H("div", { class: De(["design-token-actual-preview", `is-${a.tokenVisualKind(e)}`]) }, [H("span", {
						class: "design-token-sample",
						style: Se(a.tokenVisualStyle(e))
					}, M(["font-size", "font-weight"].includes(a.tokenVisualKind(e)) ? "Aa" : ""), 5), H("span", null, [H("code", null, M(a.currentTokenValue(e)), 1), H("small", null, M(a.isDarkOnlySet || e.activeTheme === "dark" ? "Dark 기준" : "Light 기준"), 1)])], 2), a.isFixedFontSize(e) ? (B(), V("div", zg, [
						t[50] ||= H("small", null, "고정 px · 반응형 전환 권장", -1),
						H("button", {
							class: "text-button",
							type: "button",
							onClick: (t) => a.convertFontSize(e, "rem")
						}, "rem 변환", 8, Bg),
						H("button", {
							class: "text-button",
							type: "button",
							onClick: (t) => a.convertFontSize(e, "fluid")
						}, "유동형 clamp", 8, Vg)
					])) : W("", !0)]),
					H("td", null, [H("span", null, M(a.t(a.isTokenChanged(e) ? "admin.designToken.changed" : "admin.designToken.normal")), 1), a.isNewToken(e) ? (B(), V("button", {
						key: 0,
						class: "text-button danger",
						type: "button",
						onClick: (t) => a.removeNewToken(e)
					}, "추가 취소", 8, Hg)) : a.isTokenChanged(e) ? (B(), V("button", {
						key: 1,
						class: "text-button",
						type: "button",
						onClick: (t) => a.restoreToken(e)
					}, M(a.t("common.action.reset")), 9, Ug)) : W("", !0)])
				], 2))), 128))])])]),
				i.validationErrors.length || i.importErrors.length ? (B(), V("div", Wg, [H("strong", null, M(a.t("admin.designToken.validationErrors")), 1), (B(!0), V(R, null, ka([...i.validationErrors, ...i.importErrors], (e) => (B(), V("span", { key: `${e.tokenKey}-${e.message}` }, M(e.tokenKey) + ": " + M(e.message), 1))), 128))])) : W("", !0),
				H("div", Gg, [
					H("label", Kg, [zs(M(a.t("admin.designToken.csvImport")) + " ", 1), H("input", {
						type: "file",
						accept: ".csv,text/csv",
						disabled: !a.setIsActive,
						onChange: t[21] ||= (...e) => a.onCsvFile && a.onCsvFile(...e)
					}, null, 40, qg)]),
					H("button", {
						class: "tiny-button",
						type: "button",
						onClick: t[22] ||= (...e) => a.exportCsv && a.exportCsv(...e)
					}, M(a.t("admin.designToken.csvExport")), 1),
					i.csvSourceName ? (B(), V("span", Jg, M(i.csvSourceName), 1)) : W("", !0),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: i.saving || !a.setIsActive || !a.isDirty,
						onClick: t[23] ||= (...e) => a.save && a.save(...e)
					}, M(a.t("common.action.save")), 9, Yg)
				])
			], 64)) : W("", !0)]),
			H("aside", Xg, [a.selectedSet && i.detail ? (B(), V(R, { key: 0 }, [H("section", Zg, [
				H("h3", null, M(a.t("admin.designToken.preview")), 1),
				H("div", Qg, [H("button", {
					class: De(["tiny-button", { primary: i.previewViewport === "desktop" }]),
					type: "button",
					onClick: t[24] ||= (e) => i.previewViewport = "desktop"
				}, M(a.t("admin.designToken.desktop")), 3), H("button", {
					class: De(["tiny-button", { primary: i.previewViewport === "mobile" }]),
					type: "button",
					onClick: t[25] ||= (e) => i.previewViewport = "mobile"
				}, M(a.t("admin.designToken.mobile")), 3)]),
				H("div", { class: De(["design-token-preview-stage", `is-${i.previewViewport}`]) }, [H("div", {
					class: "promo-renderer",
					style: Se(a.previewStyle)
				}, [H("section", $g, [H("div", e_, [
					H("small", t_, M(a.t("admin.designToken.previewEyebrow")), 1),
					H("h4", n_, M(a.t("admin.designToken.previewTitle")), 1),
					H("p", null, M(a.t("admin.designToken.previewBody")), 1),
					H("a", r_, M(a.t("admin.designToken.previewButton")), 1)
				])])], 4)], 2)
			]), H("details", i_, [
				H("summary", null, M(a.t("admin.designToken.settings")), 1),
				H("label", a_, [H("span", null, M(a.t("admin.designToken.name")), 1), I(H("input", { "onUpdate:modelValue": t[26] ||= (e) => i.metadata.name = e }, null, 512), [[G, i.metadata.name]])]),
				H("label", o_, [H("span", null, M(a.t("admin.designToken.description")), 1), I(H("textarea", {
					"onUpdate:modelValue": t[27] ||= (e) => i.metadata.description = e,
					rows: "2"
				}, null, 512), [[G, i.metadata.description]])]),
				H("label", s_, [H("span", null, M(a.t("admin.designToken.changeNote")), 1), I(H("input", { "onUpdate:modelValue": t[28] ||= (e) => i.metadata.changeNote = e }, null, 512), [[G, i.metadata.changeNote]])]),
				H("div", c_, [
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: i.saving,
						onClick: t[29] ||= (...e) => a.saveMetadata && a.saveMetadata(...e)
					}, M(a.t("common.action.save")), 9, l_),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: !a.setIsActive,
						onClick: t[30] ||= (e) => i.showClone = !i.showClone
					}, M(a.t("common.action.duplicate")), 9, u_),
					a.setIsActive && !a.selectedSet.isDefault ? (B(), V("button", {
						key: 0,
						class: "tiny-button",
						type: "button",
						disabled: i.saving,
						onClick: t[31] ||= (e) => a.updateSetStatus("set-default")
					}, M(a.t("admin.designToken.setDefault")), 9, d_)) : W("", !0),
					a.setIsActive ? (B(), V("button", {
						key: 1,
						class: "tiny-button",
						type: "button",
						disabled: i.saving || a.selectedSet.isDefault,
						title: a.selectedSet.isDefault ? a.t("admin.designToken.defaultDeactivateHint") : "",
						onClick: t[32] ||= (e) => a.updateSetStatus("deactivate")
					}, M(a.t("common.action.deactivate")), 9, f_)) : a.selectedSet.status === "inactive" ? (B(), V("button", {
						key: 2,
						class: "tiny-button",
						type: "button",
						disabled: i.saving,
						onClick: t[33] ||= (e) => a.updateSetStatus("activate")
					}, M(a.t("common.action.activate")), 9, p_)) : W("", !0),
					a.selectedSet.status === "inactive" ? (B(), V("button", {
						key: 3,
						class: "tiny-button danger",
						type: "button",
						disabled: i.saving,
						onClick: t[34] ||= (...e) => a.archiveSet && a.archiveSet(...e)
					}, M(a.t("common.action.delete")), 9, m_)) : W("", !0)
				]),
				i.showClone ? (B(), V("form", {
					key: 0,
					class: "design-token-clone",
					onSubmit: t[37] ||= bu((...e) => a.cloneSet && a.cloneSet(...e), ["prevent"])
				}, [
					H("label", h_, [H("span", null, M(a.t("admin.designToken.cloneName")), 1), I(H("input", {
						"onUpdate:modelValue": t[35] ||= (e) => i.cloneForm.name = e,
						required: ""
					}, null, 512), [[
						G,
						i.cloneForm.name,
						void 0,
						{ trim: !0 }
					]])]),
					H("label", g_, [H("span", null, M(a.t("admin.designToken.description")), 1), I(H("input", { "onUpdate:modelValue": t[36] ||= (e) => i.cloneForm.description = e }, null, 512), [[
						G,
						i.cloneForm.description,
						void 0,
						{ trim: !0 }
					]])]),
					H("button", {
						class: "tiny-button primary",
						type: "submit",
						disabled: i.saving
					}, M(a.t("common.action.duplicate")), 9, __)
				], 32)) : W("", !0)
			])], 64)) : W("", !0)])
		])
	]);
}
var y_ = /*#__PURE__*/ Ch(Yh, [["render", v_], ["__scopeId", "data-v-e8497526"]]);
Object.freeze({
	active: 0,
	validated: 1,
	draft: 2,
	inactive: 3,
	archived: 4
});
var b_ = Object.freeze([
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
		order: 20
	},
	{
		key: "section-layout",
		label: "섹션 구성 및 레이아웃",
		description: "섹션의 컴포넌트 구성, 레이아웃과 다중 선택 정렬을 계획합니다.",
		order: 30
	},
	{
		key: "promotion-image",
		label: "프로모션 이미지",
		description: "섹션 키비주얼과 컴포넌트 필드 이미지를 필요할 때 생성합니다.",
		order: 40
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
]), x_ = Object.freeze({
	promo_overview_parser: {
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
	section_composition_planner: {
		group: "section-layout",
		order: 10,
		label: "자연어 섹션 구성 계획",
		description: "자연어 요청을 바탕으로 섹션 컴포넌트, 콘텐츠와 디자인 토큰을 제안합니다.",
		executionMode: "선택 실행"
	},
	section_layout_planner: {
		group: "section-layout",
		order: 20,
		label: "섹션 레이아웃 계획",
		description: "섹션 전체의 허용 레이아웃과 스타일 슬롯을 안전한 명령으로 계획합니다.",
		executionMode: "선택 실행"
	},
	multi_component_layout_planner: {
		group: "section-layout",
		order: 30,
		label: "다중 컴포넌트 정렬 계획",
		description: "선택한 여러 컴포넌트의 정렬, 간격과 배치를 안전한 명령으로 제안합니다.",
		executionMode: "선택 실행"
	},
	section_background_image: {
		group: "promotion-image",
		order: 10,
		label: "섹션 키비주얼 생성",
		description: "섹션 콘텐츠와 배경색을 바탕으로 프로모션 키비주얼을 생성합니다.",
		executionMode: "선택 실행"
	},
	component_image: {
		group: "promotion-image",
		order: 20,
		label: "컴포넌트 이미지 생성",
		description: "특정 컴포넌트 이미지 필드의 목적에 맞는 이미지를 생성합니다.",
		executionMode: "선택 실행"
	},
	integrated_brief: {
		group: "design-generator",
		order: 10,
		label: "통합 디자인 브리프",
		description: "프로모션 입력과 선택 문서를 통합해 디자인 생성 기준을 구성합니다.",
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
	image_execution: {
		group: "shared-execution",
		order: 10,
		label: "이미지 실행 프롬프트",
		description: "LO-FI·최종 디자인 흐름과 분리된 독립 이미지 생성 요청에 사용합니다.",
		executionMode: "독립 실행"
	}
});
function S_(e) {
	let t = String(e || "").trim();
	return x_[t] || {
		group: "other",
		order: 999,
		label: t || "알 수 없음",
		description: "이 프롬프트 유형의 관리 설명이 아직 등록되지 않았습니다.",
		executionMode: "실행 방식 미지정"
	};
}
function C_(e) {
	return b_.find((t) => t.key === e) || b_[b_.length - 1];
}
function w_(e) {
	let t = Number(e?.version);
	return Number.isFinite(t) ? t : 0;
}
function T_(e) {
	let t = Date.parse(e?.updatedAt || "");
	return Number.isFinite(t) ? t : 0;
}
function E_(e, t) {
	return w_(t) - w_(e) || T_(t) - T_(e) || String(e?.id || "").localeCompare(String(t?.id || ""));
}
function D_(e) {
	return String(e?.lineageId || "").trim() || `legacy:${String(e?.type || "unknown")}:${String(e?.id || "unknown")}`;
}
function O_(e) {
	return e && (e.active || e.validated || e.draft || e.latestInactive || e.latestArchived || e.versions?.[0]) || null;
}
function k_(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.filter((e) => e && typeof e == "object").forEach((e) => {
		let n = D_(e);
		t.has(n) || t.set(n, {
			lineageId: n,
			versions: []
		}), t.get(n).versions.push(e);
	}), [...t.values()].map((e) => {
		let t = [...e.versions].sort(E_), n = t.find((e) => e.status === "active") || null, r = t.find((e) => e.status === "validated") || null, i = t.find((e) => e.status === "draft") || null, a = t.find((e) => e.status === "inactive") || null, o = t.find((e) => e.status === "archived") || null, s = {
			...e,
			versions: t,
			active: n,
			validated: r,
			draft: i,
			latestInactive: a,
			latestArchived: o,
			archivedCount: t.filter((e) => e.status === "archived").length,
			hasCandidate: !!(r || i)
		}, c = O_(s);
		return {
			...s,
			primary: c,
			type: c?.type || t[0]?.type || "",
			name: c?.name || t[0]?.name || "",
			updatedAt: t.reduce((e, t) => T_(t) > T_(e) ? t : e, t[0] || null)?.updatedAt || null
		};
	}).sort((e, t) => C_(S_(e.type).group).order - C_(S_(t.type).group).order || S_(e.type).order - S_(t.type).order || String(e.name || "").localeCompare(String(t.name || "")) || String(e.lineageId).localeCompare(String(t.lineageId)));
}
function A_(e = [], t = "") {
	let n = String(t || "").trim();
	return n ? e.filter((e) => e.type === n) : e;
}
function j_(e = [], t = "") {
	let n = String(t || "");
	return e.find((e) => e.versions.some((e) => e.id === n)) || null;
}
function M_(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let n = C_(S_(e?.type).group);
		t.has(n.key) || t.set(n.key, {
			...n,
			promptGroups: []
		}), t.get(n.key).promptGroups.push(e);
	}), [...t.values()].map((e) => ({
		...e,
		promptGroups: [...e.promptGroups].sort((e, t) => S_(e?.type).order - S_(t?.type).order || String(e?.name || "").localeCompare(String(t?.name || "")))
	})).sort((e, t) => e.order - t.order);
}
function N_(e = [], t = "", n = "image_execution") {
	let r = j_(e, t);
	return r ? r.versions.find((e) => e.id === t) || r.primary || null : e.find((e) => e.type === n && e.active)?.active || e.find((e) => e.active)?.active || e[0]?.primary || null;
}
var P_ = Object.freeze({
	filterPromptGroups: A_,
	findPromptGroup: j_,
	groupPromptTemplateSections: M_,
	groupPromptTemplates: k_,
	promptLineageId: D_,
	promptTypeMeta: S_,
	promptWorkflowGroupMeta: C_,
	resolvePromptSelection: N_,
	selectPromptGroupPrimary: O_
});
//#endregion
//#region admin-app/src/services/section-layout-preset-service.mjs
async function F_(e, t = {}, n = globalThis.fetch) {
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
function I_(e = []) {
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
			minHeight: Math.max(160, 40 + Math.ceil(t.length / 2) * 72, 40 + t.length * 72),
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
function L_(e, t, n = globalThis.location?.origin) {
	let r = new URL("/prototype/visual-editor.html", n);
	return r.searchParams.set("mode", "section-preset"), r.searchParams.set("sectionId", e), r.searchParams.set("layoutKey", t), r.toString();
}
var R_ = Object.freeze({
	list(e, t) {
		return F_(`/api/wizard-content-section-layouts?sectionId=${encodeURIComponent(e)}`, {}, t);
	},
	create(e, t) {
		return F_("/api/wizard-content-section-layouts", {
			method: "POST",
			body: JSON.stringify(e)
		}, t);
	},
	remove(e, t, n) {
		return F_(`/api/wizard-content-section-layout?id=${encodeURIComponent(e)}&sectionId=${encodeURIComponent(t)}`, { method: "DELETE" }, n);
	},
	setDefault(e, t, n) {
		return F_("/api/wizard-content-section-layout-default", {
			method: "POST",
			body: JSON.stringify({
				id: e,
				sectionId: t
			})
		}, n);
	},
	updateAiLayoutVariants(e, t, n) {
		return F_("/api/wizard-content-section", {
			method: "PATCH",
			body: JSON.stringify({
				id: e.id,
				aiDesign: {
					...e.aiDesign || {},
					allowedLayoutVariants: t
				},
				changeNote: "Layout Preset의 AI 사용 정책 변경."
			})
		}, n);
	},
	editorUrl: L_
}), z_ = {
	name: "SectionLayoutPresetManager",
	props: {
		section: {
			type: Object,
			required: !0
		},
		items: {
			type: Array,
			default: () => []
		}
	},
	emits: ["section-updated"],
	data() {
		return {
			loading: !1,
			saving: !1,
			error: "",
			layouts: [],
			showCreate: !1,
			createForm: {
				name: "",
				description: ""
			},
			requestRevision: 0
		};
	},
	computed: { editable() {
		return this.section?.status === "draft";
	} },
	watch: { "section.id": {
		immediate: !0,
		handler() {
			this.load();
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
				let t = await R_.list(this.section.id);
				e === this.requestRevision && (this.layouts = t.layouts || []);
			} catch (t) {
				e === this.requestRevision && (this.error = t.message);
			} finally {
				e === this.requestRevision && (this.loading = !1);
			}
		},
		async createPreset() {
			let e = this.createForm.name.trim();
			if (!(!e || !this.editable || this.saving)) {
				this.saving = !0, this.error = "";
				try {
					let t = await R_.create({
						sectionId: this.section.id,
						name: e,
						description: this.createForm.description.trim(),
						isDefault: this.layouts.length === 0,
						layoutSnapshot: I_(this.items),
						changeNote: "Admin에서 Layout Preset 생성."
					});
					this.createForm = {
						name: "",
						description: ""
					}, this.showCreate = !1, await this.load(), this.openEditor(t.layout);
				} catch (e) {
					this.error = e.validationErrors?.[0]?.message || e.message;
				} finally {
					this.saving = !1;
				}
			}
		},
		openEditor(e) {
			globalThis.open(R_.editorUrl(this.section.id, e.layoutKey), "_blank", "noopener");
		},
		async setDefault(e) {
			if (!(!this.editable || e.isDefault || this.saving)) {
				this.saving = !0, this.error = "";
				try {
					await R_.setDefault(e.id, this.section.id), await this.load();
				} catch (e) {
					this.error = e.message;
				} finally {
					this.saving = !1;
				}
			}
		},
		async remove(e) {
			if (!(!this.editable || this.saving)) {
				if (this.aiAllows(e)) {
					this.error = "AI 허용을 먼저 해제한 뒤 Layout Preset을 삭제하세요.";
					return;
				}
				if (globalThis.confirm(`"${e.name}" Layout Preset을 삭제할까요?`)) {
					this.saving = !0, this.error = "";
					try {
						await R_.remove(e.id, this.section.id), await this.load();
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
			if (!this.editable || this.saving) return;
			let t = new Set(this.layouts.map((e) => e.layoutKey)), n = new Set((this.section.aiDesign?.allowedLayoutVariants || []).filter((e) => t.has(e)));
			n.has(e.layoutKey) ? n.delete(e.layoutKey) : n.add(e.layoutKey), this.saving = !0, this.error = "";
			try {
				await R_.updateAiLayoutVariants(this.section, [...n]), this.$emit("section-updated");
			} catch (e) {
				this.error = e.message;
			} finally {
				this.saving = !1;
			}
		}
	}
}, B_ = { class: "section-layout-manager" }, V_ = { class: "subsection-title" }, H_ = { class: "action-row" }, U_ = ["disabled"], W_ = ["disabled"], G_ = {
	key: 0,
	class: "empty-state compact"
}, K_ = {
	key: 1,
	class: "field-error"
}, q_ = {
	key: 2,
	class: "section-layout-create"
}, J_ = { class: "field compact-field" }, Y_ = { class: "field compact-field" }, X_ = ["disabled"], Z_ = {
	key: 3,
	class: "empty-state compact"
}, Q_ = {
	key: 4,
	class: "history-list"
}, $_ = {
	key: 0,
	class: "status-active"
}, ev = { class: "action-row align-right" }, tv = ["onClick"], nv = ["disabled", "onClick"], rv = ["disabled", "onClick"], iv = ["disabled", "onClick"], av = {
	key: 0,
	class: "empty-state compact"
};
function ov(e, t, n, r, i, a) {
	return B(), V("section", B_, [
		H("div", V_, [t[5] ||= H("div", null, [H("h3", null, "Layout Preset"), H("small", null, "섹션을 추가할 때 적용할 Desktop/Mobile 배치를 미리 설정합니다.")], -1), H("div", H_, [H("button", {
			class: "tiny-button",
			type: "button",
			disabled: i.loading,
			onClick: t[0] ||= (...e) => a.load && a.load(...e)
		}, "새로고침", 8, U_), H("button", {
			class: "tiny-button primary",
			type: "button",
			disabled: !a.editable || i.saving,
			onClick: t[1] ||= (e) => i.showCreate = !i.showCreate
		}, "+ Preset", 8, W_)])]),
		a.editable ? W("", !0) : (B(), V("div", G_, "활성·비활성 버전의 Layout은 읽기 전용입니다. 초안을 만든 후 편집하세요.")),
		i.error ? (B(), V("div", K_, M(i.error), 1)) : W("", !0),
		i.showCreate && a.editable ? (B(), V("div", q_, [
			H("label", J_, [t[6] ||= H("span", null, "이름", -1), I(H("input", {
				"onUpdate:modelValue": t[2] ||= (e) => i.createForm.name = e,
				type: "text",
				placeholder: "예: Standard Header"
			}, null, 512), [[G, i.createForm.name]])]),
			H("label", Y_, [t[7] ||= H("span", null, "설명", -1), I(H("input", {
				"onUpdate:modelValue": t[3] ||= (e) => i.createForm.description = e,
				type: "text",
				placeholder: "사용 목적"
			}, null, 512), [[G, i.createForm.description]])]),
			H("button", {
				class: "tiny-button primary",
				type: "button",
				disabled: !i.createForm.name.trim() || i.saving,
				onClick: t[4] ||= (...e) => a.createPreset && a.createPreset(...e)
			}, "생성 후 편집", 8, X_)
		])) : W("", !0),
		i.loading ? (B(), V("div", Z_, "Layout Preset을 불러오는 중...")) : (B(), V("div", Q_, [(B(!0), V(R, null, ka(i.layouts, (e) => (B(), V("div", {
			key: e.id,
			class: "history-item section-layout-row"
		}, [H("div", null, [H("strong", null, [zs(M(e.name) + " ", 1), e.isDefault ? (B(), V("em", $_, "기본")) : W("", !0)]), H("span", null, M(e.layoutKey) + " · " + M(e.description || "설명 없음"), 1)]), H("div", ev, [
			H("button", {
				class: "tiny-button",
				type: "button",
				onClick: (t) => a.openEditor(e)
			}, M(a.editable ? "편집" : "보기"), 9, tv),
			H("button", {
				class: "tiny-button",
				type: "button",
				disabled: !a.editable || e.isDefault || i.saving,
				onClick: (t) => a.setDefault(e)
			}, "기본값", 8, nv),
			H("button", {
				class: "tiny-button",
				type: "button",
				disabled: !a.editable || i.saving,
				onClick: (t) => a.toggleAiLayout(e)
			}, M(a.aiAllows(e) ? "AI 허용됨" : "AI 허용"), 9, rv),
			H("button", {
				class: "tiny-button danger",
				type: "button",
				disabled: !a.editable || i.saving || a.aiAllows(e),
				onClick: (t) => a.remove(e)
			}, "삭제", 8, iv)
		])]))), 128)), i.layouts.length ? W("", !0) : (B(), V("div", av, "등록된 Layout Preset이 없습니다. 기존 자동 배치가 계속 사용됩니다."))]))
	]);
}
var sv = /*#__PURE__*/ Ch(z_, [["render", ov], ["__scopeId", "data-v-d128f75e"]]), cv = /* @__PURE__ */ o((() => {
	var e = {
		documents: "promoPrototype.documents.abc",
		generatedPages: "promoPrototype.generatedPages.abc",
		selectedDocumentId: "promoPrototype.selectedDocumentId.abc",
		generatedPage: "promoPrototype.generatedPage",
		themeMode: "promoPrototype.themeMode"
	}, t = {
		text: "gpt-4o-mini",
		image: "gemini-3.1-flash-image"
	}, n = {
		integrated_brief: 360 * 1e3,
		lofi_draft: 240 * 1e3,
		final_design: 360 * 1e3
	}, r = [
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
	], i = {
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
	function a(e) {
		return Array.isArray(e?.sections) ? e.sections : [];
	}
	function o(e) {
		let t = a(e), n = new Map(t.map((e) => [e.sectionId || e.key, e]));
		return (Array.isArray(e?.sectionOrder) && e.sectionOrder.length ? e.sectionOrder : t.map((e) => e.sectionId || e.key)).map((e) => n.get(e)).filter(Boolean);
	}
	function s(e) {
		let t = o(e);
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
	function c(e) {
		return e?.imageGenerationRequest || e?.sendToImagePrompt ? "generate" : "none";
	}
	function l(e, t = null) {
		let n = a(e), r = o(e).map((e) => e.sectionId || e.key), i = Array.isArray(t?.orderedSections) && t.orderedSections.length ? t.orderedSections.filter((e) => n.some((t) => (t.sectionId || t.key) === e)) : r, s = Object.fromEntries(n.map((e) => {
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
			orderedSections: i,
			visibleSections: i.filter((e) => s[e] !== !1),
			sectionVisibility: s,
			itemVisibility: l,
			fixedSections: n.filter((e) => e.fixedPosition).map((e) => ({
				sectionId: e.sectionId || e.key,
				fixedPosition: e.fixedPosition
			})),
			draggableSections: n.filter((e) => e.orderChangeAllowed !== !1 && !e.fixedPosition).map((e) => e.sectionId || e.key),
			imageGenerationTargets: n.flatMap((e) => (e.items || []).filter((t) => {
				if (e.repeatableSet) return !1;
				let n = e.sectionId || e.key, r = t.itemId || t.key;
				return s[n] === !1 || l[n]?.[r] === !1 ? !1 : (u?.[n]?.[r] || c(t)) === "generate";
			}).map((t) => ({
				sectionId: e.sectionId || e.key,
				itemId: t.itemId || t.key,
				label: t.label,
				inputPath: t.inputPath,
				mode: u?.[e.sectionId || e.key]?.[t.itemId || t.key] || c(t)
			}))),
			governance: e?.governance || {},
			promotionInputSchema: e?.promotionInputSchema || {},
			templateForm: e?.templateForm || {},
			generationRules: e?.generationRules || {},
			validationRules: e?.validationRules || {},
			progress: e?.progress || {}
		};
	}
	function u(e) {
		let t = String(e || "").trim(), n = t.toLowerCase(), r = {
			market: t,
			primaryUse: "image_generation",
			textCopyInfluence: "low",
			visualInfluence: t ? "medium_high" : "neutral",
			instruction: t ? "Use the selected market as subtle visual localization context for mood, audience relevance, environment, and compliance sensitivity. Do not render the market name as a visible UI label unless it is part of user-facing promo copy." : "Use neutral global promotional web UI visuals without region-specific cues.",
			avoid: [
				"flag-heavy compositions",
				"map graphics",
				"stereotyped cultural symbols",
				"traditional costume clichés",
				"visible market labels used as annotations"
			]
		};
		return /brazil/.test(n) ? {
			...r,
			visualMood: "warm, energetic, social, mobile-friendly, subtly relevant to Brazil/Latam audiences",
			avoid: [
				...r.avoid,
				"carnival stereotypes",
				"Brazil flag collage"
			]
		} : /latam|latin/.test(n) ? {
			...r,
			visualMood: "warm, dynamic, social, accessible, subtly relevant to Latam audiences",
			avoid: [...r.avoid, "generic Latin festival stereotypes"]
		} : /europe|germany|united kingdom|canada ontario|french/.test(n) ? {
			...r,
			visualMood: "restrained, premium, regulation-aware, clean, trust-forward",
			avoid: [
				...r.avoid,
				"EU flag collage",
				"literal landmark montage"
			]
		} : /global/.test(n) ? {
			...r,
			visualMood: "international, neutral, broad-audience, non-region-specific"
		} : {
			...r,
			visualMood: t ? `subtly localized for ${t} without literal labels or stereotypes` : "neutral global"
		};
	}
	function d() {
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
	function f() {
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
	function p({ promo: e, simpleBrief: t, selectedDocument: n, visualMode: r }) {
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
	function m(e, t) {
		localStorage.setItem(e, JSON.stringify(t));
	}
	function h(e) {
		return e.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}
	function g(e) {
		return String(e || "").replace(/\.[^.]+$/, "").replace(/(?:-?design-?system|-?eng|-?kor)$/gi, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim() || "Untitled Design Style";
	}
	function _(e, t = {}) {
		try {
			return JSON.parse(e);
		} catch {
			return t;
		}
	}
	var v = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	});
	function y(e = /* @__PURE__ */ new Date()) {
		let t = e instanceof Date ? e : new Date(e);
		return Number.isNaN(t.getTime()) ? null : v.formatToParts(t).reduce((e, t) => (t.type !== "literal" && (e[t.type] = t.value), e), {});
	}
	function b(e = /* @__PURE__ */ new Date()) {
		let t = y(e);
		return t ? `${t.year}-${t.month}-${t.day} ${t.hour}:${t.minute}` : String(e || "");
	}
	function x() {
		return b(/* @__PURE__ */ new Date());
	}
	function S(e = /* @__PURE__ */ new Date()) {
		let t = (e) => String(e).padStart(2, "0"), n = String(e || ""), r = n.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
		if (r) {
			let [, e, t, n, i, a] = r;
			return `${e.slice(-2)}${t}${n}${i}${a}`;
		}
		let i = y(e);
		return i ? [
			String(i.year).slice(-2),
			t(i.month),
			t(i.day),
			t(i.hour),
			t(i.minute)
		].join("") : n.replace(/\D/g, "").slice(2, 12);
	}
	function C(e, t) {
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
	function w(e) {
		return /promo-ui-design-view|promo-ui-design-generate/.test(String(e || ""));
	}
	function ee(e, t) {
		let n = String(e || "").trim();
		if (!n) return !1;
		if (n.startsWith("data:image/")) return !0;
		if (w(n)) return !1;
		let r = String(t?.designUrl || t?.pageUrl || "").trim();
		return !(r && n === r);
	}
	function T(e) {
		return e ? `/api/promo-design-view?id=${encodeURIComponent(e)}` : "";
	}
	function E(e) {
		return e ? `/api/promo-design-image?id=${encodeURIComponent(e)}` : "";
	}
	function D(e) {
		return e ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(e)}` : "";
	}
	function O(e) {
		return e ? `/api/promo-generation-final-design-image?finalDesignId=${encodeURIComponent(e)}` : "";
	}
	function te(e) {
		if (!e || e.asset_type !== "generated_image") return !1;
		let t = Number(e.file_size || 0), n = String(e.mime_type || "").toLowerCase();
		return t > 0 && (t < 1024 || !n.startsWith("image/"));
	}
	function ne(e = 5) {
		let t = new Uint8Array(e);
		if (window.crypto?.getRandomValues) window.crypto.getRandomValues(t);
		else for (let n = 0; n < e; n += 1) t[n] = Math.floor(Math.random() * 256);
		return Array.from(t, (e) => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[e % 62]).join("");
	}
	function re() {
		return `promo-${S(/* @__PURE__ */ new Date())}-${ne(5)}`;
	}
	function ie(e) {
		return new Promise((t) => {
			window.setTimeout(t, e);
		});
	}
	function ae(e) {
		let t = String(e?.stage || ""), r = String(e?.status || ""), i = n[t] || 0, a = e?.updatedAt || e?.updated_at || "", o = a ? new Date(a).getTime() : 0, s = o ? Math.max(0, Date.now() - o) : 0, c = /queued|generating|running|pending|accepted/i.test(r), l = !!(i && c && s > i);
		return {
			stage: t,
			status: r,
			ageMs: s,
			staleLimitMs: i,
			isActive: c,
			isStale: l,
			staleMessage: l ? "작업이 예상보다 오래 걸리고 있습니다. Worker 상태를 확인하거나 현재 단계를 다시 시도해 주세요." : ""
		};
	}
	function oe(e) {
		let t = e.toLowerCase().replace(/^\d+\.\s*/, "");
		return t.includes("color") || t.includes("palette") ? "colors" : t.includes("typography") || t.includes("font") ? "typography" : t.includes("layout") || t.includes("spacing") || t.includes("grid") ? "layout" : t.includes("elevation") || t.includes("depth") || t.includes("shadow") ? "elevation" : t.includes("shape") || t.includes("radius") || t.includes("geometry") ? "shapes" : t.includes("component") || t.includes("styling") ? "components" : t.includes("responsive") || t.includes("breakpoint") ? "responsive" : t.includes("do's") || t.includes("don't") || t.includes("dos") ? "dos_donts" : t.includes("gap") ? "known_gaps" : t.includes("overview") || t.includes("theme") || t.includes("atmosphere") ? "overview" : "other";
	}
	function se(e) {
		let t = e.split(/\r?\n/), n = [], r = null;
		for (let e of t) {
			let t = /^(#{1,4})\s+(.+)$/.exec(e);
			t ? (r = {
				level: t[1].length,
				title: t[2].trim(),
				category: oe(t[2].trim()),
				excerpt: ""
			}, n.push(r)) : r && e.trim() && r.excerpt.length < 180 && (r.excerpt += `${e.trim()} `);
		}
		return n;
	}
	function ce(e) {
		let t = se(e), n = Array.from(new Set(e.match(/#[0-9a-fA-F]{6}\b/g) || [])).slice(0, 8), r = Array.from(new Set((e.match(/(?:fontFamily|font-family|Heading|Body|Primary):?\s*["'`]?([A-Za-z][A-Za-z0-9\s,-]*(?:Pretendard|sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia|system-ui))/gi) || []).map((e) => e.replace(/^(fontFamily|font-family|Heading|Body|Primary):?\s*/i, "").replace(/["'`]/g, "").trim()))).slice(0, 4), i = Array.from(new Set(t.map((e) => e.category))).filter((e) => e !== "other");
		return {
			headings: t,
			colors: n,
			fonts: r.length ? r : ["Pretendard, Arial, sans-serif"],
			categories: i,
			sectionCount: t.filter((e) => e.level <= 2).length,
			tokenCount: n.length + r.length
		};
	}
	function le({ id: e, brandId: t, brandName: n, slug: r, markdown: i, sourceName: a, designTokenFileName: o = "", designTokensJson: s = {}, status: c, updatedAt: l }) {
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
			summary: ce(i)
		};
	}
	function ue() {
		return [
			le({
				id: "doc-001",
				brandId: "brand-ggpoker",
				brandName: "GGPoker",
				slug: "ggpoker",
				markdown: "---\nname: GGPoker-promo-design\ndescription: A high-contrast promo system with black casino surfaces, red CTA emphasis, compact step bars, and legal-first footer treatment.\ncolors:\n  primary: \"#d52b1e\"\n  cta: \"#e12d25\"\n  canvas: \"#f3f3f3\"\n  ink: \"#151515\"\ntypography:\n  heading: \"Pretendard, Arial, sans-serif\"\n  body: \"Pretendard, Arial, sans-serif\"\n---\n\n## Overview\n\nHigh contrast promotional landing pages that prioritize bonus clarity, quick CTA access, and market-specific responsible gaming compliance.\n\n## Colors\n\n### Brand & Accent\n\n- Primary red: #d52b1e\n- CTA red: #e12d25\n- Dark surface: #151515\n\n### Surface\n\n- Canvas: #f3f3f3\n- Content card: #ffffff\n\n## Typography\n\n### Font Family\n\n- Heading: Pretendard, Arial, sans-serif\n- Body: Pretendard, Arial, sans-serif\n\n## Layout\n\nTemplate 4 uses a fixed sequence of Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, and Footer.\n\n## Components\n\nButtons are pill-shaped red CTAs. Step bars use a dark background with large red numbers.\n\n## Responsive Behavior\n\nHero background and minimum height should be configurable separately for desktop and mobile.\n\n## Do's and Don'ts\n\nDo keep legal text visible. Do not hide responsible gaming badges or market-specific terms.",
				sourceName: "docs/design-md/ggpoker/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:00"
			}),
			le({
				id: "doc-002",
				brandId: "brand-apple",
				brandName: "Apple",
				slug: "apple",
				markdown: "---\nname: Apple-design-analysis\ndescription: Photography-first product presentation with minimal chrome, SF-style typography, and a single blue action color.\ncolors:\n  primary: \"#0066cc\"\n  canvas: \"#ffffff\"\n  ink: \"#1d1d1f\"\ntypography:\n  heading: \"SF Pro Display, system-ui, sans-serif\"\n  body: \"SF Pro Text, system-ui, sans-serif\"\n---\n\n## Overview\n\nA clean product-gallery design system with restrained UI and high emphasis on product imagery.\n\n## Colors\n\n- Action Blue: #0066cc\n- Ink: #1d1d1f\n- Canvas: #ffffff\n- Soft Surface: #f5f5f7\n\n## Typography\n\n- Heading: SF Pro Display, system-ui, sans-serif\n- Body: SF Pro Text, system-ui, sans-serif\n\n## Layout\n\nWide, calm sections with strong product focus and large vertical rhythm.\n\n## Components\n\nButtons are compact pills or text links, with minimal border and shadow use.",
				sourceName: "docs/design-md/apple/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:05"
			}),
			le({
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
	function k(e) {
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
	function de(e) {
		return {
			primaryColor: e.colorTokens.primary,
			ctaColor: e.colorTokens.cta,
			canvasColor: e.colorTokens.canvas,
			headingFont: e.typographyTokens.headingFont,
			bodyFont: e.typographyTokens.bodyFont,
			titleWeight: e.typographyTokens.heroTitleWeight
		};
	}
	var { createApp: A } = Vue, fe = new URLSearchParams(window.location.search), pe = fe.get("view") === "admin" ? "prompts" : "builder", j = fe.get("tab"), me = [
		"webhook",
		"llm",
		"components",
		"promo-form",
		"design-tokens",
		"i18n",
		"audit"
	].includes(j) ? j : "promo-form", he = A({
		data() {
			return {
				status: "준비 완료",
				localeRevision: 0,
				localeUnsubscribe: null,
				currentView: pe,
				adminTab: me,
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
				companyStylePresets: r,
				selectedDocumentId: localStorage.getItem(e.selectedDocumentId) || "",
				themeMode: localStorage.getItem(e.themeMode) || "light",
				selectedPresetId: "preset-001",
				styleSource: "design_md",
				templateSchema: i,
				sectionConfig: s(i),
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
				promptTemplates: [],
				promptTemplatesLoading: !1,
				promptTemplatesError: "",
				selectedPromptTemplateId: "",
				promptTypeFilter: "",
				expandedPromptLineageIds: [],
				expandedPromptWorkflowKeys: [
					"promotion-overview",
					"template-selection",
					"section-layout",
					"promotion-image",
					"design-generator",
					"shared-execution",
					"other"
				],
				promptArchivedVisibilityByLineage: {},
				promptSaving: !1,
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
					sections: []
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
					capabilities: { layoutRegions: [
						"copy-primary",
						"copy-secondary",
						"center"
					] },
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
					description: ""
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
				sectionInputs: d(),
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
				return this.styleSource === "design_md" && this.selectedDocument ? k(this.selectedDocument) : de(this.selectedPreset);
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
				let e = a(this.templateSchema), t = new Map(e.map((e) => [e.sectionId || e.key, e]));
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
								imageGenerationMode: this.sectionConfig.imageGenerationMode?.[t]?.[n] || c(e)
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
				return this.selectedPromptTemplate?.status !== "draft";
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
					let t = [...e.versions].sort((e, t) => t.version - e.version), n = t.find((e) => e.status === "active") || t.find((e) => e.status === "draft") || t[0];
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
			this.localeUnsubscribe = window.PromoI18n?.subscribe(() => {
				this.localeRevision += 1;
			}) || null, localStorage.removeItem(e.generatedPages), localStorage.removeItem(e.generatedPage), this.applyThemeMode(), this.loadDesignDocuments(), this.loadGeneratedPagesFromServer({ silent: !0 }), this.loadHandoffDocuments(), this.resetOverride(), this.currentView === "prompts" && this.openPromptManager();
		},
		unmounted() {
			this.localeUnsubscribe && this.localeUnsubscribe(), this.stopGenerationRunPolling();
		},
		methods: {
			t(e, t = {}) {
				return this.localeRevision, window.PromoI18n?.t(e, t) || e;
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
				e.searchParams.set("view", "admin"), window.history.replaceState({}, "", `${e.pathname}${e.search}${e.hash}`), await Promise.all([
					this.loadPromptTemplates(),
					this.loadWorkerWebhookSettings(),
					this.loadWizardFormTemplates(),
					this.loadWizardSections(),
					this.loadWizardSectionAuditLogs(),
					this.loadItemComponents(),
					this.loadDesignTokenSets()
				]), this.adminTab === "i18n" && await this.loadLocales(), this.setStatus("관리자 페이지로 이동했습니다");
			},
			selectAdminTab(e) {
				if (![
					"webhook",
					"llm",
					"components",
					"promo-form",
					"design-tokens",
					"i18n",
					"audit"
				].includes(e)) return;
				this.adminTab = e, e === "i18n" && this.loadLocales(), e === "components" && this.loadItemComponents(), e === "audit" && this.loadWizardSectionAuditLogs();
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
					capabilities: { layoutRegions: [
						"copy-primary",
						"copy-secondary",
						"center"
					] },
					styleSlots: [],
					changeNote: "",
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
					sections: []
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
					capabilities: { ...e.capabilities || {} },
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
				}, this.showNewItemComponentForm = !1, this.loadItemComponentUsage(e.id);
			},
			async loadItemComponentUsage(e = this.selectedItemComponentId) {
				if (e) {
					this.itemComponentUsageLoading = !0;
					try {
						let t = await fetch(`/api/item-component-usage?componentId=${encodeURIComponent(e)}`), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `컴포넌트 사용처 조회 오류(${t.status})`);
						e === this.selectedItemComponentId && (this.itemComponentUsage = {
							usageCount: Number(n.usageCount || 0),
							sections: Array.isArray(n.sections) ? n.sections : []
						});
					} catch (t) {
						e === this.selectedItemComponentId && (this.itemComponentUsage = {
							usageCount: 0,
							sections: [],
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
			async loadPromptTemplates(e = {}) {
				if (!(this.promptTemplatesLoading && !e.fresh)) {
					this.promptTemplatesLoading = !0, this.promptTemplatesError = "";
					try {
						let e = await fetch("/api/prompt-templates?includeArchived=true"), t = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(t.message || t.error || `프롬프트 목록 요청 오류(${e.status})`);
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
					lofi_draft: "LO-FI 시안",
					final_design: "최종 디자인",
					promo_ui_design: "프로모션 UI 디자인"
				}[e] || t || e;
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
				this.selectedPromptTemplateId = e, this.expandPromptGroupForPromptId(e), this.promptBodyTranslationKo = "", this.promptBodyTranslationSource = "", this.promptBodyTranslationError = "", this.promptBodyTranslationLoading = !1, this.promptBodyLanguageError = "";
				let n = this.promptTemplates.find((t) => t.id === e);
				if (n) try {
					let r = await fetch(`/api/prompt-template?id=${encodeURIComponent(e)}`), i = await r.json().catch(() => ({}));
					if (!r.ok) throw Error(i.message || i.error || `프롬프트 요청 오류(${r.status})`);
					let a = i.prompt || n, o = this.promptTemplates.findIndex((t) => t.id === e);
					o >= 0 && this.promptTemplates.splice(o, 1, a), this.promptHistories = Array.isArray(i.histories) ? i.histories : [];
					let s = /* @__PURE__ */ new Set([
						"executionSnapshotVersion",
						"harnessConfig",
						"runtimeConfig",
						"modelCapabilitySnapshot",
						"safetyContract",
						"policySchemaVersion",
						"generationPolicy",
						"renderPolicy",
						"validationPolicy"
					]), c = Object.fromEntries(Object.entries(a.modelOptions || {}).filter(([e]) => !s.has(e)));
					this.promptEditor = {
						name: a.name || "",
						body: a.body || "",
						requiredVariablesText: (a.requiredVariables || []).join(", "),
						optionalVariablesText: (a.optionalVariables || []).join(", "),
						provider: a.provider || "",
						model: a.model || "",
						temperature: a.temperature ?? "",
						maxTokens: a.maxTokens ?? "",
						responseFormat: a.responseFormat || "",
						imageSize: [
							"1K",
							"2K",
							"4K"
						].includes(String(a.generationPolicy?.requestedTier || a.modelOptions?.generationPolicy?.requestedTier || a.modelOptions?.imageSize || a.modelOptions?.image_size || "").toUpperCase()) ? String(a.generationPolicy?.requestedTier || a.modelOptions?.generationPolicy?.requestedTier || a.modelOptions?.imageSize || a.modelOptions?.image_size).toUpperCase() : "2K",
						executionSnapshotVersion: Number(a.executionSnapshotVersion || a.modelOptions?.executionSnapshotVersion || 2),
						timeoutMs: a.runtimeConfig?.timeoutMs ?? a.modelOptions?.runtimeConfig?.timeoutMs ?? "",
						maxAttempts: a.runtimeConfig?.maxAttempts ?? a.modelOptions?.runtimeConfig?.maxAttempts ?? "",
						retryBaseMs: a.runtimeConfig?.retryBaseMs ?? a.modelOptions?.runtimeConfig?.retryBaseMs ?? "",
						retryMaxMs: a.runtimeConfig?.retryMaxMs ?? a.modelOptions?.runtimeConfig?.retryMaxMs ?? "",
						outputMimeType: a.generationPolicy?.outputMimeType ?? a.modelOptions?.generationPolicy?.outputMimeType ?? a.runtimeConfig?.outputMimeType ?? a.modelOptions?.runtimeConfig?.outputMimeType ?? "",
						generationPolicyText: JSON.stringify(a.generationPolicy || a.modelOptions?.generationPolicy || {}, null, 2),
						renderPolicyText: JSON.stringify(a.renderPolicy || a.modelOptions?.renderPolicy || {}, null, 2),
						validationPolicyText: JSON.stringify(a.validationPolicy || a.modelOptions?.validationPolicy || {}, null, 2),
						harnessConfigText: JSON.stringify(a.harnessConfig || a.modelOptions?.harnessConfig || {}, null, 2),
						modelCapabilitySnapshotText: JSON.stringify(a.modelCapabilitySnapshot || a.modelOptions?.modelCapabilitySnapshot || {}, null, 2),
						safetyContractText: JSON.stringify(a.safetyContract || a.modelOptions?.safetyContract || {}, null, 2),
						modelOptionsText: JSON.stringify(c, null, 2),
						changeNote: ""
					}, this.promptBodyLanguageError = this.promptBodyContainsKorean(a.body) ? "영문 원문에는 한글을 입력할 수 없습니다." : "", this.translatePromptBody(), t.silent || this.setStatus(`${a.name} 프롬프트를 열었습니다`);
				} catch (e) {
					this.setStatus(`프롬프트 상세를 불러오지 못했습니다: ${e.message}`);
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
			promptUsesSectionAiControlPlane(e = this.selectedPromptTemplate) {
				return [
					"section_layout_planner",
					"multi_component_layout_planner",
					"section_composition_planner",
					"section_background_image",
					"component_image"
				].includes(e?.type);
			},
			promptUsesSectionImagePolicy(e = this.selectedPromptTemplate) {
				return ["section_background_image", "component_image"].includes(e?.type);
			},
			promptModelOptionsForSave(e) {
				let t = this.parseModelOptionsText(this.promptEditor.modelOptionsText);
				if (this.promptSupportsImageSize(e) && (t.imageSize = [
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
			async savePromptTemplate() {
				let e = this.selectedPromptTemplate;
				if (!(!e || this.promptSaving)) {
					if (e.status !== "draft") {
						this.setStatus("활성·검증 완료·이전 버전은 직접 수정할 수 없습니다. 새 초안을 만들어 주세요.");
						return;
					}
					if (this.promptBodyContainsKorean(this.promptEditor.body)) {
						this.promptBodyLanguageError = "영문 원문에는 한글을 입력할 수 없습니다.", this.setStatus(this.promptBodyLanguageError);
						return;
					}
					this.promptSaving = !0;
					try {
						let t = await fetch("/api/prompt-template", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: e.id,
								name: this.promptEditor.name,
								body: this.promptEditor.body,
								requiredVariables: this.variableTextToList(this.promptEditor.requiredVariablesText),
								optionalVariables: this.variableTextToList(this.promptEditor.optionalVariablesText),
								provider: this.promptEditor.provider,
								model: this.promptEditor.model,
								temperature: this.promptEditor.temperature === "" ? null : Number(this.promptEditor.temperature),
								maxTokens: this.promptEditor.maxTokens === "" ? null : Number(this.promptEditor.maxTokens),
								responseFormat: this.promptEditor.responseFormat,
								modelOptions: this.promptModelOptionsForSave(e),
								changeNote: this.promptEditor.changeNote || "관리자 페이지에서 프롬프트를 변경했습니다."
							})
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `프롬프트 저장 오류(${t.status})`);
						this.selectedPromptTemplateId = n.prompt?.id || e.id, await this.loadPromptTemplates({ fresh: !0 }), this.setStatus("프롬프트 초안을 저장하고 변경 이력을 생성했습니다");
					} catch (e) {
						this.setStatus(`프롬프트 저장 실패: ${e.message}`);
					} finally {
						this.promptSaving = !1;
					}
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
				let t = e?.draft || e?.inactive || null;
				if (!t || this.wizardFormTemplateSaving) {
					this.setStatus("활성 템플릿은 삭제할 수 없습니다. 먼저 다른 버전을 활성화하거나 비활성화해 주세요.");
					return;
				}
				if (window.confirm(`${t.name} v${t.version}을 삭제(보관)할까요?`)) {
					this.wizardFormTemplateSaving = !0;
					try {
						let e = await fetch("/api/wizard-form-template-archive", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								id: t.id,
								changeNote: "관리자 페이지 템플릿 목록에서 삭제(보관)했습니다."
							})
						}), n = await e.json().catch(() => ({}));
						if (!e.ok) throw Error(n.message || n.error || `템플릿 보관 오류(${e.status})`);
						this.expandedWizardFormTemplateSettingsKey = "", await this.loadWizardFormTemplates({ fresh: !0 }), this.setStatus("템플릿 버전을 보관했습니다");
					} catch (e) {
						this.setStatus(`템플릿 보관 실패: ${e.message}`);
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
			async removeWizardFormTemplateSection() {
				let e = this.selectedWizardFormTemplateSection;
				if (!(!e || !this.wizardFormTemplateCanEdit || this.wizardFormTemplateSectionSaving) && window.confirm(`템플릿에서 ${e.sectionName || e.sectionKey} Section을 제외할까요?`)) {
					this.wizardFormTemplateSectionSaving = !0;
					try {
						let t = await fetch("/api/wizard-form-template-sections", {
							method: "DELETE",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ id: e.id })
						}), n = await t.json().catch(() => ({}));
						if (!t.ok) throw Error(n.message || n.error || `템플릿 Section 제외 오류(${t.status})`);
						this.selectedWizardFormTemplateSectionId = "", this.expandedWizardFormTemplateSectionId = "", await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id), this.setStatus("템플릿에서 Section을 제외했습니다");
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
						this.wizardSections = Array.isArray(t.sections) ? t.sections : [], !this.selectedWizardSectionKey && this.groupedWizardSections.length ? await this.selectWizardSection(this.groupedWizardSections[0].sectionKey) : this.selectedWizardSectionKey && await this.selectWizardSection(this.selectedWizardSectionKey, { silent: !0 });
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
				this.wizardSectionDetailLoading = !0;
				try {
					let t = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(e)}`), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `섹션 상세 요청 오류(${t.status})`);
					this.wizardSectionDetail = {
						section: n.section,
						items: n.items || [],
						histories: n.histories || []
					}, await this.loadWizardSectionUsage(n.section), this.wizardSectionFieldsEditor = {
						name: n.section.name,
						description: n.section.description,
						isRequired: n.section.isRequired,
						orderChangeAllowed: n.section.orderChangeAllowed,
						fixedPosition: n.section.fixedPosition || "",
						isVisibleInWizard: n.section.isVisibleInWizard,
						compositionScope: n.section.compositionScope || "template",
						sectionRole: n.section.sectionRole || "content",
						compositionPolicy: {
							selectionPolicy: n.section.compositionPolicy?.selectionPolicy || "optional",
							allowedMarkets: [...n.section.compositionPolicy?.allowedMarkets || []],
							allowedPromotionPurposes: [...n.section.compositionPolicy?.allowedPromotionPurposes || []],
							aiEditable: n.section.compositionPolicy?.aiEditable !== !1,
							contentLocked: n.section.compositionPolicy?.contentLocked === !0,
							layoutLocked: n.section.compositionPolicy?.layoutLocked === !0,
							duplicatePolicy: n.section.compositionPolicy?.duplicatePolicy === "limited" ? "limited" : "forbidden",
							maxInstances: Number(n.section.compositionPolicy?.maxInstances || 1),
							allowedLayoutVariants: [...n.section.compositionPolicy?.allowedLayoutVariants || []],
							allowedMotionPresets: [...n.section.compositionPolicy?.allowedMotionPresets || []]
						},
						aiDesign: {
							enabled: n.section.aiDesign?.enabled !== !1,
							allowedLayoutVariants: Array.isArray(n.section.aiDesign?.allowedLayoutVariants) ? [...n.section.aiDesign.allowedLayoutVariants] : [
								"split-left",
								"split-right",
								"centered-hero"
							],
							allowSectionBackground: n.section.aiDesign?.allowSectionBackground !== !1,
							imageTarget: n.section.aiDesign?.imageTarget === "item" ? "item" : "section-background",
							imageTargetItemKeys: Array.isArray(n.section.aiDesign?.imageTargetItemKeys) ? [...n.section.aiDesign.imageTargetItemKeys] : [],
							imageAspectRatio: n.section.aiDesign?.imageAspectRatio || "16:9",
							backgroundPromptText: n.section.aiDesign?.backgroundPromptText || ""
						},
						changeNote: ""
					}, this.wizardItemEditorOpenId = "";
				} catch (e) {
					t.silent || this.setStatus(`섹션 상세를 불러오지 못했습니다: ${e.message}`);
				} finally {
					this.wizardSectionDetailLoading = !1;
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
				return !!(e?.primary?.status === "active" && e.primary.orderChangeAllowed && !e.primary.fixedPosition);
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
					description: ""
				});
			},
			async createWizardSection() {
				if (this.wizardSectionSaving) return;
				let e = this.wizardFormTemplateDetail?.template;
				if (!e || e.status !== "draft") {
					this.setStatus("섹션을 추가하려면 템플릿 수정 버튼을 눌러 초안을 먼저 만들어 주세요.");
					return;
				}
				this.wizardSectionSaving = !0;
				try {
					let t = await fetch("/api/wizard-content-sections", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(this.newWizardSectionForm)
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `섹션 생성 오류(${t.status})`);
					let r = n.section, i = await fetch("/api/wizard-form-template-sections", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							templateId: e.id,
							sectionId: r.id
						})
					}), a = await i.json().catch(() => ({}));
					if (!i.ok) throw Error(`섹션은 생성됐지만 템플릿 추가에 실패했습니다: ${a.message || a.error || `오류(${i.status})`}`);
					await this.loadWizardSections({ fresh: !0 }), await this.selectWizardSection(r.sectionKey), await this.loadWizardFormTemplateDetail(e.id, { silent: !0 }), this.newWizardSectionForm = {
						sectionKey: "",
						name: "",
						description: ""
					}, this.setStatus(`"${r.name}" 섹션을 생성하고 현재 템플릿 초안에 추가했습니다.`);
				} catch (e) {
					this.setStatus(`섹션 생성 실패: ${e.message}`);
				} finally {
					this.wizardSectionSaving = !1;
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
						if (!t.ok) throw Error(n.message || n.error || `섹션 활성화 오류(${t.status})`);
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
					this.designDocuments = ue(), this.mdListSource = "fallback 더미", (!this.selectedDocumentId || !this.selectedDocument) && (this.selectedDocumentId = this.designDocuments[0]?.id || ""), localStorage.setItem(e.selectedDocumentId, this.selectedDocumentId), this.resetOverride(), this.selectedDesignDetail = null, this.setStatus("Neon API를 사용할 수 없어 더미 데이터를 사용합니다");
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
				if ((a(this.templateSchema).find((t) => (t.sectionId || t.key) === e)?.items || []).find((e) => (e.itemId || e.key) === t)?.required && this.sectionConfig.sectionVisibility?.[e] !== !1 && !n) {
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
				let t = a(this.templateSchema).find((t) => (t.sectionId || t.key) === e);
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
				this.sectionConfig = s(this.templateSchema), this.setStatus("섹션 구성을 기본값으로 되돌렸습니다");
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
				return e ? e.status === "n8n_failed" || e.errorMessage ? "failed" : e.status === "n8n_ui_design_pending" ? "pending" : ee(e.imageUrl, e) ? "image" : e.finalDesignPreviewUrl ? "final_design" : e.lofiDraftPreviewUrl ? "lofi_draft" : /queued|generating|running|pending|accepted/i.test(e.generationRunStatus || "") ? "pending" : e.designUrl || e.pageUrl || w(e.imageUrl) ? "view" : e.payload ? "draft" : "empty" : "empty";
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
				return ee(e?.imageUrl, e) ? e.imageUrl : e?.finalDesignPreviewUrl ? e.finalDesignPreviewUrl : e?.lofiDraftPreviewUrl || "";
			},
			previewFrameUrl(e) {
				return e && C(e.designUrl || e.pageUrl || (w(e.imageUrl) ? e.imageUrl : ""), e.id) || "";
			},
			storedResultToPage(e, t = {}) {
				let n = e?.run || {}, r = Array.isArray(e?.assets) ? e.assets : [], i = r.find((e) => e.asset_type === "generated_image") || {}, a = r.filter((e) => /_markdown$/.test(e.asset_type || "")), o = n.run_key || t.id || "", s = n.created_at || t.createdAt || "", c = i.created_at || t.committedAt || s, l = s ? b(s) : "", u = c ? b(c) : l, d = te(i), f = Number(i.file_size || 0);
				return {
					id: o,
					title: n.promo_title || t.title || o,
					selectedMd: n.selected_md_name || t.selectedMd || "",
					styleSourceLabel: n.style_source_label || t.styleSourceLabel || "",
					template: n.template_name || t.template || "",
					market: n.market || t.market || "",
					createdAt: l,
					committedAt: u,
					timestampStamp: S(c || s || u || l),
					status: n.status || t.status || "generated",
					designUrl: T(o),
					imageUrl: E(o),
					pageUrl: T(o),
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
				let n = e?.run || {}, r = n.inputSnapshot || {}, i = r.promo || {}, a = r.md || {}, o = n.createdAt ? b(n.createdAt) : t.createdAt || "", s = {
					id: n.runKey || t.id || n.runId || "",
					title: n.promoTitle || i.title || t.title || n.runKey || "",
					selectedMd: n.selectedMdName || a.brand || a.name || t.selectedMd || "",
					styleSourceLabel: r.styleSourceLabel || t.styleSourceLabel || "",
					template: i.template || r.template?.templateName || t.template || "",
					market: i.market || t.market || "",
					createdAt: o,
					committedAt: t.committedAt || "",
					timestampStamp: S(n.updatedAt || n.createdAt || o),
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
					generationPolling: ae(n),
					lofiDrafts: r,
					confirmedLofiDraft: a,
					currentLofiDraft: s,
					lofiDraftPreviewUrl: c ? D(c.draftId) : "",
					finalDesigns: i,
					currentFinalDesign: l,
					finalDesignPreviewUrl: f ? O(f.finalDesignId) : ""
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
				return !e?.generationRunId || (e.generationPolling = ae({
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
				this.newMd.slug = h(this.newMd.brandName);
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
				}, this.validationErrors = {}, this.designMode = "ai", this.inputMode = "simple", this.generationMode = "ai_agent", this.globalVisualMode = "auto", this.currentBuilderStep = 1, this.sectionInputs = d(), this.sectionInputsDirty = !1, this.sectionConfig = s(this.templateSchema), this.stopGenerationMotion(), e.rerender && (this.promoBuilderSessionKey += 1);
			},
			autoFillPromoInputs() {
				let e = f();
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
					this.newMd.text = await t.text(), this.newMd.sourceName = t.name, this.newMd.designStyleName = g(t.name), this.newMd.brandName = this.newMd.designStyleName, this.newMd.slug = h(this.newMd.designStyleName), this.setStatus("MD 파일을 불러왔습니다");
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
				let n = this.newMd.designStyleName.trim() || g(this.newMd.sourceName), r = this.newMd.slug.trim() || h(n);
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
				let i = le({
					id: `doc-${String(this.designDocuments.length + 1).padStart(3, "0")}`,
					brandId: `brand-${r}`,
					brandName: n,
					slug: r,
					markdown: t,
					sourceName: this.newMd.sourceName,
					designTokenFileName: this.newMd.tokenFileName,
					designTokensJson: _(this.newMd.tokenText || "{}"),
					status: "uploaded",
					updatedAt: x()
				});
				this.designDocuments.unshift(i), this.selectDocument(i.id), m(e.documents, this.designDocuments), this.setStatus("디자인 스타일이 등록되었습니다"), this.closeAddDesign();
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
				this.sectionInputs = p({
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
				let n = this.sourceStyle, r = this.selectedDesignDataSource || this.selectedDocument, i = this.sectionInputsForPayload(), a = l(this.templateSchema, this.sectionConfig), o = this.repeatImageGenerationTargets(i), s = [...a.imageGenerationTargets, ...o], c = {
					...JSON.parse(JSON.stringify(this.sectionConfig)),
					fixedSections: Object.fromEntries(a.fixedSections.map((e) => [e.sectionId, e.fixedPosition])),
					imageGenerationTargets: s,
					repeatableSets: Object.fromEntries(this.sectionConfigSections.filter((e) => e.repeatableSet).map((e) => [e.sectionId, e.repeatableSet]))
				}, d = i.heroBanner?.cta?.label || i.contentCta?.cta?.label || i.stepBar?.[0]?.ctaLabel || "Learn More", f = i.heroBanner?.cta?.link || i.contentCta?.cta?.link || i.stepBar?.[0]?.link || "#", p = i.titleDescription?.contents || i.footer?.content || "Terms and conditions apply. Please play responsibly.", m = {
					...this.promo,
					template: this.promo.template,
					leadText: this.promo.leadText || i.heroBanner.sublineText || this.simpleBrief.mainOffer,
					subline: this.promo.subline || i.contentCta.longText || this.simpleBrief.secondaryMessage,
					alphaText: this.promo.alphaText || i.heroBanner.alphaText,
					ctaLabel: this.promo.ctaLabel || d,
					ctaUrl: this.promo.ctaUrl || f,
					termsText: this.promo.termsText || p
				}, h = {
					purpose: this.promo.promotionPurpose || this.promo.purpose || "",
					purposeOther: this.promo.promotionPurposeOther || "",
					targetCustomer: this.simpleBrief.audience || "",
					campaignTone: this.simpleBrief.campaignTone || ""
				}, g = u(this.promo.market);
				return {
					id: e,
					model: t.text,
					imageModel: t.image,
					generatedAt: x(),
					md: {
						id: r.id,
						brand: r.brandName,
						designStyleId: r.id,
						designStyleName: r.designStyleName || r.brandName,
						slug: r.slug,
						summary: r.summary,
						designMdMarkdown: r.markdown || "",
						designTokenFileName: r.designTokenFileName || "",
						selectedTokens: r.designTokensJson || r.rawDesignTokens || {},
						designConcept: r.designConcept,
						styleClassification: r.styleClassification,
						designPromptContext: r.designConcept?.promptContext || "",
						designData: {
							summary: r.summary,
							metadata: r.metadata || r.metadataItems || [],
							normalizedSchema: r.normalizedSchema || r.tokenSet?.normalizedSchema || null,
							tokenItems: r.tokenItems || [],
							componentPatterns: r.componentPatterns || [],
							layoutPatterns: r.layoutPatterns || [],
							guidelineItems: r.guidelineItems || [],
							componentPatternCount: r.summary?.componentPatternCount || r.componentPatterns?.length || 0,
							layoutPatternCount: r.summary?.layoutPatternCount || r.layoutPatterns?.length || 0,
							guidelineCount: r.summary?.guidelineCount || r.guidelineItems?.length || 0,
							extractionStatus: r.extractionStatus || r.status,
							sourceHash: r.sourceHash || r.tokenSet?.sourceHash || ""
						}
					},
					selectedDesignStyleId: r.id,
					promo: m,
					promotionInput: h,
					marketVisualGuidance: g,
					sectionConfig: c,
					template: {
						id: this.templateSchema.id,
						name: this.templateSchema.name,
						designMode: this.designMode,
						selectionMode: this.designMode === "advanced" ? "manual" : "auto",
						selectedTemplateId: this.designMode === "advanced" ? "default_temp" : "",
						templateId: a.templateId,
						templateName: a.templateName,
						schemaVersion: a.schemaVersion,
						generationMode: this.generationMode,
						inputMode: this.inputMode,
						sectionOrder: a.orderedSections,
						visibleSections: a.visibleSections,
						sectionVisibility: a.sectionVisibility,
						itemVisibility: a.itemVisibility,
						fixedSections: a.fixedSections,
						draggableSections: a.draggableSections,
						imageGenerationTargets: s,
						governance: a.governance,
						promotionInputSchema: a.promotionInputSchema,
						templateForm: a.templateForm,
						generationRules: a.generationRules,
						validationRules: a.validationRules,
						progress: a.progress
					},
					simpleBrief: { ...this.simpleBrief },
					sectionInputs: i,
					design: {
						...this.finalStyle,
						canvasColor: "#000000",
						pageBackgroundColor: "#000000",
						backgroundPolicy: "full_bleed_pure_black_no_gray_artboard"
					},
					selectedDesignTokens: { ...this.finalStyle },
					sourceDesign: { ...n },
					styleSource: this.styleSource,
					styleSourceLabel: this.styleSourceLabel(),
					companyPreset: this.styleSource === "company_default" ? this.selectedPreset.name : null,
					hasOverride: this.hasOverride(this.finalStyle, n),
					inputSnapshot: {
						promo: m,
						promotionInput: h,
						marketVisualGuidance: g,
						simpleBrief: { ...this.simpleBrief },
						sectionInputs: i,
						sectionConfig: c,
						templateRuntime: a
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
					t < n - 1 && await ie(r);
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
				let e = re(), t = this.buildGeneratedPayload(e), n = S(t.generatedAt);
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
				r.status = i ? "n8n_ui_design_generated" : "draft", r.designUrl = C(i?.designUrl || T(r.id), r.id), r.imageUrl = i?.imageUrl || "", r.pageUrl = C(i?.designUrl || i?.pageUrl || i?.previewUrl || T(r.id), r.id) || i?.imageUrl || "", r.resultType = i?.resultType || this.resultType(r), r.layoutMapping = i?.layoutMapping || null, r.mdComplianceMap = i?.mdComplianceMap || null, r.imagePrompt = i?.imagePrompt || "", r.promptGroupId = i?.promptGroupId || "", r.designPromptStorageKey = i?.designPromptStorageKey || "", r.promoInputStorageKey = i?.promoInputStorageKey || "", r.integratedBriefStorageKey = i?.integratedBriefStorageKey || "";
				let a = i?.committedAt || r.committedAt;
				r.committedAt = a ? b(a) : r.committedAt, r.timestampStamp = i?.timestampStamp || S(a || r.createdAt), r.payload = i?.payload || t, await this.waitForStoredDesignResult(r, {
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
				let n = C(t.pageUrl || t.designUrl || "", t.id);
				if (n) {
					window.open(n, "_blank");
					return;
				}
				let r = this.previewImageUrl(t);
				if (r) {
					window.open(r, "_blank");
					return;
				}
				m(e.generatedPage, t.payload), window.open("generated.html", "_blank");
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
				let n = this.promptModalPage?.id || "promo", r = this.promptModalPage?.timestampStamp || S(/* @__PURE__ */ new Date()), i = this.markdownDownloadFilename(t.storageKey, `${t.fallbackName}-${n}-${r}.md`), a = new Blob([t.markdown], { type: "text/markdown;charset=utf-8" }), o = URL.createObjectURL(a), s = document.createElement("a");
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
	he.component("template-layout-manager", window.PromoAdminTemplateLayout.component), he.component("section-layout-preset-manager", window.PromoAdminSectionLayouts.component), he.component("design-token-manager", window.PromoAdminDesignTokens.component), (window.PromoI18n?.init?.() || Promise.resolve()).finally(() => he.mount("#app"));
}));
yh(document), globalThis.Vue = gh, globalThis.PromoAdminTemplateLayout = Object.freeze({
	service: Sh,
	component: Ih
}), globalThis.PromoAdminDesignTokens = Object.freeze({
	service: Hh,
	component: y_
}), globalThis.PromoAdminPromptGroups = P_, globalThis.PromoAdminSectionLayouts = Object.freeze({
	service: R_,
	component: sv
}), await Promise.resolve().then(() => /* @__PURE__ */ l(cv()));
//#endregion
