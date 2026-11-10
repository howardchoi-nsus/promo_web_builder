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
var f = {}, p = [], m = () => {}, h = () => !1, g = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), _ = (e) => e.startsWith("onUpdate:"), v = Object.assign, y = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, b = Object.prototype.hasOwnProperty, x = (e, t) => b.call(e, t), S = Array.isArray, C = (e) => ne(e) === "[object Map]", w = (e) => ne(e) === "[object Set]", T = (e) => ne(e) === "[object Date]", E = (e) => ne(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", k = (e) => typeof e == "symbol", A = (e) => typeof e == "object" && !!e, ee = (e) => (A(e) || D(e)) && D(e.then) && D(e.catch), te = Object.prototype.toString, ne = (e) => te.call(e), re = (e) => ne(e).slice(8, -1), ie = (e) => ne(e) === "[object Object]", ae = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, j = /* @__PURE__ */ d(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), oe = /* @__PURE__ */ d("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), se = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ce = /-\w/g, le = se((e) => e.replace(ce, (e) => e.slice(1).toUpperCase())), ue = /\B([A-Z])/g, de = se((e) => e.replace(ue, "-$1").toLowerCase()), fe = se((e) => e.charAt(0).toUpperCase() + e.slice(1)), pe = se((e) => e ? `on${fe(e)}` : ""), M = (e, t) => !Object.is(e, t), me = (e, ...t) => {
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
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ve, ye = () => ve ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function be(e, t) {
	return e + JSON.stringify(t, (e, t) => typeof t == "function" ? t.toString() : t);
}
var xe = /* @__PURE__ */ d("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");
function Se(e) {
	if (S(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? Ee(r) : Se(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (O(e) || A(e)) return e;
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
function N(e) {
	let t = "";
	if (O(e)) t = e;
	else if (S(e)) for (let n = 0; n < e.length; n++) {
		let r = N(e[n]);
		r && (t += r + " ");
	}
	else if (A(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function De(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !O(t) && (e.class = N(t)), n && (e.style = Se(n)), e;
}
var Oe = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", ke = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Ae = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", je = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Me = /* @__PURE__ */ d(Oe), Ne = /* @__PURE__ */ d(ke), Pe = /* @__PURE__ */ d(Ae), Fe = /* @__PURE__ */ d(je), Ie = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Le = /* @__PURE__ */ d(Ie);
Ie + "";
function Re(e) {
	return !!e || e === "";
}
function ze(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Be(e[r], t[r]);
	return n;
}
function Be(e, t) {
	if (e === t) return !0;
	let n = T(e), r = T(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = k(e), r = k(t), n || r) return e === t;
	if (n = S(e), r = S(t), n || r) return n && r ? ze(e, t) : !1;
	if (n = A(e), r = A(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Be(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Ve(e, t) {
	return e.findIndex((e) => Be(e, t));
}
var He = (e) => !!(e && e.__v_isRef === !0), P = (e) => O(e) ? e : e == null ? "" : S(e) || A(e) && (e.toString === te || !D(e.toString)) ? He(e) ? P(e.value) : JSON.stringify(e, Ue, 2) : String(e), Ue = (e, t) => He(t) ? Ue(e, t.value) : C(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[We(t, r) + " =>"] = n, e), {}) } : w(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => We(e)) } : k(t) ? We(t) : A(t) && !S(t) && !ie(t) ? String(t) : t, We = (e, t = "") => k(e) ? `Symbol(${e.description ?? t})` : e;
function Ge(e) {
	return e == null ? "initial" : typeof e == "string" ? e === "" ? " " : e : String(e);
}
//#endregion
//#region node_modules/.pnpm/@vue+reactivity@3.5.39/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var Ke, qe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ke && (Ke.active ? (this.parent = Ke, this.index = (Ke.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ke;
			try {
				return Ke = this, e();
			} finally {
				Ke = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ke, Ke = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ke === this) Ke = this.prevScope;
			else {
				let e = Ke;
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
function Je(e) {
	return new qe(e);
}
function Ye() {
	return Ke;
}
function Xe(e, t = !1) {
	Ke && Ke.cleanups.push(e);
}
var Ze, Qe = /* @__PURE__ */ new WeakSet(), $e = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ke && (Ke.active ? Ke.effects.push(this) : this.flags &= -2);
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
		let e = Ze, t = mt;
		Ze = this, mt = !0;
		try {
			return this.fn();
		} finally {
			st(this), Ze = e, mt = t, this.flags &= -3;
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
	let t = e.dep, n = Ze, r = mt;
	Ze = e, mt = !0;
	try {
		ot(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Ze = n, mt = r, st(e), e.flags &= -3;
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
	t && v(n, t);
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
		let e = Ze;
		Ze = void 0;
		try {
			t();
		} finally {
			Ze = e;
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
		if (!Ze || !mt || Ze === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Ze) t = this.activeLink = new bt(Ze, this), Ze.deps ? (t.prevDep = Ze.depsTail, Ze.depsTail.nextDep = t, Ze.depsTail = t) : Ze.deps = Ze.depsTail = t, St(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Ze.depsTail, t.nextDep = void 0, Ze.depsTail.nextDep = t, Ze.depsTail = t, Ze.deps === t && (Ze.deps = e);
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
	if (mt && Ze) {
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
		let i = S(e), a = i && ae(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Et || !k(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Et)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(wt)), C(e) && s(o.get(Tt)));
				break;
			case "delete":
				i || (s(o.get(wt)), C(e) && s(o.get(Tt)));
				break;
			case "set":
				C(e) && s(o.get(wt));
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
	let t = /* @__PURE__ */ F(e);
	return t === e ? t : (Dt(t, "iterate", Et), /* @__PURE__ */ yn(e) ? t : t.map(Sn));
}
function jt(e) {
	return Dt(e = /* @__PURE__ */ F(e), "iterate", Et), e;
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
		return At(this).concat(...e.map((e) => S(e) ? At(e) : e));
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
	let r = /* @__PURE__ */ F(e);
	Dt(r, "iterate", Et);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ bn(n[0]) ? (n[0] = /* @__PURE__ */ F(n[0]), r[t](...n)) : i;
}
function zt(e, t, n = []) {
	gt(), it();
	let r = (/* @__PURE__ */ F(e))[t].apply(e, n);
	return at(), _t(), r;
}
var Bt = /* @__PURE__ */ d("__proto__,__v_isRef,__isVue"), Vt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(k));
function Ht(e) {
	k(e) || (e = String(e));
	let t = /* @__PURE__ */ F(this);
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
		let a = S(e);
		if (!r) {
			let e;
			if (a && (e = Nt[t])) return e;
			if (t === "hasOwnProperty") return Ht;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ wn(e) ? e : n);
		if ((k(t) ? Vt.has(t) : Bt(t)) || (r || Dt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ wn(o)) {
			let e = a && ae(t) ? o : o.value;
			return r && A(e) ? /* @__PURE__ */ mn(e) : e;
		}
		return A(o) ? r ? /* @__PURE__ */ mn(o) : /* @__PURE__ */ fn(o) : o;
	}
}, Wt = class extends Ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = S(e) && ae(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ vn(i);
			if (!/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (i = /* @__PURE__ */ F(i), n = /* @__PURE__ */ F(n)), !a && /* @__PURE__ */ wn(i) && !/* @__PURE__ */ wn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : x(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ wn(e) ? e : r);
		return e === /* @__PURE__ */ F(r) && s && (o ? M(n, i) && Ot(e, "set", t, n, i) : Ot(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = x(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ot(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!k(t) || !Vt.has(t)) && Dt(e, "has", t), n;
	}
	ownKeys(e) {
		return Dt(e, "iterate", S(e) ? "length" : wt), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ F(i), o = C(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Xt : t ? Cn : Sn;
		return !t && Dt(a, "iterate", c ? Tt : wt), v(Object.create(l), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ F(r), a = /* @__PURE__ */ F(n);
			e || (M(n, a) && Dt(i, "get", n), Dt(i, "get", a));
			let { has: o } = Zt(i), s = t ? Xt : e ? Cn : Sn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Dt(/* @__PURE__ */ F(t), "iterate", wt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ F(n), i = /* @__PURE__ */ F(t);
			return e || (M(t, i) && Dt(r, "has", t), Dt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ F(a), s = t ? Xt : e ? Cn : Sn;
			return !e && Dt(o, "iterate", wt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return v(n, e ? {
		add: $t("add"),
		set: $t("set"),
		delete: $t("delete"),
		clear: $t("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ F(this), r = Zt(n), i = /* @__PURE__ */ F(e), a = !t && !/* @__PURE__ */ yn(e) && !/* @__PURE__ */ vn(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), Ot(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (n = /* @__PURE__ */ F(n));
			let r = /* @__PURE__ */ F(this), { has: i, get: a } = Zt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ F(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && Ot(r, "set", e, n, s) : Ot(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ F(this), { has: n, get: r } = Zt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ F(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ot(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ F(this), t = e.size !== 0, n = e.clear();
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
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(x(n, r) && r in t ? n : t, r, i);
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
	if (!A(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = dn(re(e));
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
function F(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ F(t) : e;
}
function xn(e) {
	return !x(e, "__v_skip") && Object.isExtensible(e) && he(e, "__v_skip", !0), e;
}
var Sn = (e) => A(e) ? /* @__PURE__ */ fn(e) : e, Cn = (e) => A(e) ? /* @__PURE__ */ mn(e) : e;
// @__NO_SIDE_EFFECTS__
function wn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	return En(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Tn(e) {
	return En(e, !0);
}
function En(e, t) {
	return /* @__PURE__ */ wn(e) ? e : new Dn(e, t);
}
var Dn = class {
	constructor(e, t) {
		this.dep = new xt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ F(e), this._value = t ? e : Sn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ yn(e) || /* @__PURE__ */ vn(e);
		e = n ? e : /* @__PURE__ */ F(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Sn(e), this.dep.trigger());
	}
};
function On(e) {
	e.dep && e.dep.trigger();
}
function kn(e) {
	return /* @__PURE__ */ wn(e) ? e.value : e;
}
function An(e) {
	return D(e) ? e() : kn(e);
}
var jn = {
	get: (e, t, n) => t === "__v_raw" ? e : kn(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ wn(i) && !/* @__PURE__ */ wn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
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
	let t = S(e) ? Array(e.length) : {};
	for (let n in e) t[n] = zn(e, n);
	return t;
}
var In = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = k(t) ? t : String(t), this._raw = /* @__PURE__ */ F(e);
		let r = !0, i = e;
		if (!S(e) || k(this._key) || !ae(this._key)) do
			r = !/* @__PURE__ */ bn(i) || /* @__PURE__ */ yn(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = kn(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ wn(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ wn(t)) {
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
	return /* @__PURE__ */ wn(e) ? e : D(e) ? new Ln(e) : A(e) && arguments.length > 1 ? zn(e, t, n) : /* @__PURE__ */ I(e);
}
function zn(e, t, n) {
	return new In(e, t, n);
}
var Bn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new xt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = yt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Ze !== this) return rt(this, !0), !0;
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
	return D(e) ? r = e : (r = e.get, i = e.set), new Bn(r, i, n);
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
function Yn(e, t, n = f) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ yn(e) || i === !1 || i === 0 ? Xn(e, 1) : Xn(e), u, d, p, h, g = !1, _ = !1;
	if (/* @__PURE__ */ wn(e) ? (d = () => e.value, g = /* @__PURE__ */ yn(e)) : /* @__PURE__ */ _n(e) ? (d = () => l(e), g = !0) : S(e) ? (_ = !0, g = e.some((e) => /* @__PURE__ */ _n(e) || /* @__PURE__ */ yn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ wn(e)) return e.value;
		if (/* @__PURE__ */ _n(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (p) {
			gt();
			try {
				p();
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
	} : m, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Xn(e(), t);
	}
	let v = Ye(), b = () => {
		u.stop(), v && v.active && y(v.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return b(), n;
		};
	}
	let x = _ ? Array(e.length).fill(Wn) : Wn, C = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || g || (_ ? n.some((e, t) => M(e, x[t])) : M(n, x))) {
				p && p();
				let e = Kn;
				Kn = u;
				try {
					let e = [
						n,
						x === Wn ? void 0 : _ && x[0] === Wn ? [] : x,
						h
					];
					x = n, c ? c(t, 3, e) : t(...e);
				} finally {
					Kn = e;
				}
			}
		} else u.run();
	};
	return s && s(C), u = new $e(d), u.scheduler = o ? () => o(C, !1) : C, h = (e) => Jn(e, !1, u), p = u.onStop = () => {
		let e = Gn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Gn.delete(u);
		}
	}, t ? r ? C(!0) : x = u.run() : o ? o(C.bind(null, !0), !0) : u.run(), b.pause = u.pause.bind(u), b.resume = u.resume.bind(u), b.stop = b, b;
}
function Xn(e, t = Infinity, n) {
	if (t <= 0 || !A(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ wn(e)) Xn(e.value, t, n);
	else if (S(e)) for (let r = 0; r < e.length; r++) Xn(e[r], t, n);
	else if (w(e) || C(e)) e.forEach((e) => {
		Xn(e, t, n);
	});
	else if (ie(e)) {
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
	if (D(e)) {
		let i = rr(e, t, n, r);
		return i && ee(i) && i.catch((e) => {
			ar(e, t, n);
		}), i;
	}
	if (S(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(ir(e[a], t, n, r));
		return i;
	}
}
function ar(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || f;
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
	S(e) ? lr.push(...e) : ur && e.id === -1 ? ur.splice(dr + 1, 0, e) : e.flags & 1 || (lr.push(e), e.flags |= 1), _r();
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
		r._d && ks(-1);
		let i = Or(t), a;
		try {
			a = e(...n);
		} finally {
			Or(i), r._d && ks(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function L(e, t) {
	if (Er === null) return e;
	let n = mc(Er), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = f] = t[e];
		i && (D(i) && (i = {
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
	if (Xs) {
		let n = Xs.provides, r = Xs.parent && Xs.parent.provides;
		r === n && (n = Xs.provides = Object.create(r)), n[e] = t;
	}
}
function Fr(e, t, n = !1) {
	let r = Zs();
	if (r || vo) {
		let i = vo ? vo._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
function Ir() {
	return !!(Zs() || vo);
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
function Ur(e, t, n = f) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = v({}, n), c = t && r || !t && a !== "post", l;
	if (rc) {
		if (a === "sync") {
			let e = Rr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = m, e.resume = m, e.pause = m, e;
		}
	}
	let u = Xs;
	s.call = (e, t, n) => ir(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		Zo(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : gr(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let p = Yn(e, t, s);
	return rc && (l ? l.push(p) : c && p()), p;
}
function Wr(e, t, n) {
	let r = this.proxy, i = O(e) ? e.includes(".") ? Gr(r, e) : () => r[e] : e.bind(r, r), a;
	D(t) ? a = t : (a = t.handler, n = t);
	let o = ec(this), s = Ur(i, a.bind(r), n);
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
	return O(n) ? t ? t(n) : null : n;
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
			Kr.set(e, t), Zo(t, a);
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
		let n = Zs(), r = ci();
		return () => {
			let i = t.default && bi(t.default(), !0), a = i && i.length ? pi(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ F(e), { mode: s } = o;
			if (r.isLeaving) return _i(a);
			let c = vi(a);
			if (!c) return _i(a);
			let l = gi(c, o, r, n, (e) => l = e);
			c.type !== Cs && yi(c, l);
			let u = n.subTree && vi(n.subTree);
			if (u && u.type !== Cs && !Ns(u, c) && di(n).type !== Cs) {
				let e = gi(u, o, r, n);
				if (yi(u, e), s === "out-in" && c.type !== Cs) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, _i(a);
				s === "in-out" && c.type !== Cs ? e.delayLeave = (e, t, n) => {
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
		for (let n of e) if (n.type !== Cs) {
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
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = hi(n, e), C = (e, t) => {
		e && ir(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		C(e, t), S(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, T = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) if (a) r = g || c;
			else return;
			t[oi] && t[oi](!0);
			let i = x[b];
			i && Ns(e, i) && i.el[oi] && i.el[oi](), C(r, [t]);
		},
		enter(t) {
			if (x[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) if (a) r = _ || l, i = v || u, o = y || d;
			else return;
			let s = !1;
			t[si] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), T.delayedLeave && T.delayedLeave(), t[si] = void 0);
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
				a || (a = !0, r(), C(n ? h : m, [t]), t[oi] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[oi].bind(null, !1);
			x[i] = e, p ? w(p, [t, o]) : o();
		},
		clone(e) {
			let a = gi(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return T;
}
function _i(e) {
	if (ea(e)) return e = Bs(e), e.children = null, e;
}
function vi(e) {
	if (!ea(e)) return Jr(e.type) && e.children ? pi(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function yi(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, yi(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function bi(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === z ? (o.patchFlag & 128 && i++, r = r.concat(bi(o.children, t, s))) : (t || o.type !== Cs) && r.push(s == null ? o : Bs(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
// @__NO_SIDE_EFFECTS__
function xi(e, t) {
	return D(e) ? /* @__PURE__ */ v({ name: e.name }, t, { setup: e }) : e;
}
function Si() {
	let e = Zs();
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
	let t = Zs(), n = /* @__PURE__ */ Tn(null);
	if (t) {
		let r = t.refs === f ? t.refs = {} : t.refs;
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
	if (S(e)) {
		e.forEach((e, a) => Di(e, t && (S(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Zi(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Di(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? mc(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === f ? s.refs = {} : s.refs, d = s.setupState, p = /* @__PURE__ */ F(d), m = d === f ? h : (e) => !Ti(u, e) && x(p, e), g = (e, t) => !(t && Ti(u, t));
	if (l != null && l !== c) {
		if (Oi(t), O(l)) u[l] = null, m(l) && (d[l] = null);
		else if (/* @__PURE__ */ wn(l)) {
			let e = t;
			g(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) {
		gt();
		try {
			rr(c, s, 12, [o, u]);
		} finally {
			_t();
		}
	} else {
		let t = O(c), r = /* @__PURE__ */ wn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? m(c) ? d[c] : u[c] : g(c) || !e.k ? c.value : u[e.k];
					if (i) S(n) && y(n, a);
					else if (S(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], m(c) && (d[c] = u[c]);
					else {
						let t = [a];
						g(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, m(c) && (d[c] = o)) : r && (g(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Ei.delete(e);
				};
				t.id = -1, Ei.set(e, t), Zo(t, n);
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
	}, d = (n, r, s, l, u, g = !1) => {
		g ||= !!r.dynamicChildren;
		let b = Pi(n) && n.data === "[", x = () => h(n, r, s, l, u, b), { type: S, ref: C, shapeFlag: w, patchFlag: T } = r, E = n.nodeType;
		r.el = n, T === -2 && (g = !1, r.dynamicChildren = null);
		let D = null;
		switch (S) {
			case Ss:
				E === 3 ? (n.data !== r.children && (Ai(), n.data = r.children), D = a(n)) : r.children === "" ? (c(r.el = i(""), o(n), n), D = n) : D = x();
				break;
			case Cs:
				y(n) ? (D = a(n), v(r.el = n.content.firstChild, n, s)) : D = E !== 8 || b ? x() : a(n);
				break;
			case ws:
				if (b && (n = a(n), E = n.nodeType), E === 1 || E === 3) {
					D = n;
					let e = !r.children.length;
					for (let t = 0; t < r.staticCount; t++) e && (r.children += D.nodeType === 1 ? D.outerHTML : D.data), t === r.staticCount - 1 && (r.anchor = D), D = a(D);
					return b ? a(D) : D;
				} else x();
				break;
			case z:
				D = b ? m(n, r, s, l, u, g) : x();
				break;
			default: if (w & 1) D = (E !== 1 || r.type.toLowerCase() !== n.tagName.toLowerCase()) && !y(n) ? x() : f(n, r, s, l, u, g);
			else if (w & 6) {
				r.slotScopeIds = u;
				let e = o(n);
				if (D = b ? _(n) : Pi(n) && n.data === "teleport start" ? _(n, n.data, "teleport end") : a(n), t(r, e, null, s, l, Ni(e), g), Zi(r) && !r.type.__asyncResolved) {
					let t;
					b ? (t = Ls(z), t.anchor = D ? D.previousSibling : e.lastChild) : t = n.nodeType === 3 ? U("") : Ls("div"), t.el = n, r.component.subTree = t;
				}
			} else w & 64 ? D = E === 8 ? r.type.hydrate(n, r, s, l, u, g, e, p) : x() : w & 128 && (D = r.type.hydrate(n, r, s, l, Ni(o(n)), u, g, e, d));
		}
		return C != null && Di(C, null, l, r), D;
	}, f = (e, t, n, i, a, o) => {
		o ||= !!t.dynamicChildren;
		let { type: c, dynamicProps: l, props: u, patchFlag: d, shapeFlag: f, dirs: m, transition: h } = t, _ = c === "input" || c === "option", b = !!l;
		if (_ || b || d !== -1) {
			m && Nr(t, null, n, "created");
			let c = !1;
			if (y(e)) {
				c = rs(null, h) && n && n.vnode.props && n.vnode.props.appear;
				let r = e.content.firstChild;
				if (c) {
					let e = r.getAttribute("class");
					e && (r.$cls = e), h.beforeEnter(r);
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
					for (let i in u) (_ && (i.endsWith("value") || i === "indeterminate") || g(i) && !j(i) || i[0] === "." || t && !j(i) || l && l.includes(i)) && r(e, i, null, u[i], void 0, n);
				} else if (u.onClick) r(e, "onClick", null, u.onClick, void 0, n);
				else if (d & 4 && /* @__PURE__ */ _n(u.style)) for (let e in u.style) u.style[e];
			}
			let x;
			(x = u && u.onVnodeBeforeMount) && Ks(x, n, t), m && Nr(t, null, n, "beforeMount"), ((x = u && u.onVnodeMounted) || m || c) && ys(() => {
				x && Ks(x, n, t), c && h.enter(e), m && Nr(t, null, n, "mounted");
			}, i);
		}
		return e.nextSibling;
	}, p = (e, t, r, o, s, l, u) => {
		u ||= !!t.dynamicChildren;
		let f = t.children, p = f.length, m = !1;
		for (let t = 0; t < p; t++) {
			let h = u ? f[t] : f[t] = Hs(f[t]), g = h.type === Ss;
			e ? (g && !u && t + 1 < p && Hs(f[t + 1]).type === Ss && (c(i(e.data.slice(h.children.length)), r, a(e)), e.data = h.children), e = d(e, h, o, s, l, u)) : g && !h.children ? c(h.el = i(""), r) : (m || (m = !0, Ri(r, 1) || Ai()), n(null, h, r, null, o, s, Ni(r), l));
		}
		return e;
	}, m = (e, t, n, r, i, s) => {
		let { slotScopeIds: u } = t;
		u && (i = i ? i.concat(u) : u);
		let d = o(e), f = p(a(e), t, d, n, r, i, s);
		return f && Pi(f) && f.data === "]" ? a(t.anchor = f) : (Ai(), c(t.anchor = l("]"), d, f), f);
	}, h = (e, t, r, i, c, l) => {
		if (Bi(e, t) || Ai(), t.el = null, l) {
			let t = _(e);
			for (;;) {
				let n = a(e);
				if (n && n !== t) s(n);
				else break;
			}
		}
		let u = a(e), d = o(e);
		return s(e), n(null, t, d, u, r, i, Ni(d), c), r && (r.vnode.el = t.el, Mo(r, t.el)), u;
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
	O(e) && (e = [e]);
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
	D(e) && (e = { loader: e });
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
			let e = Xs;
			if (Ci(e), u) return () => $i(u, e);
			let t = (t) => {
				l = null, ar(t, e, 13, !r);
			};
			if (s && e.suspense || rc) return p().then((t) => () => $i(t, e)).catch((e) => (t(e), () => r ? Ls(r, { error: e }) : null));
			let a = /* @__PURE__ */ I(!1), c = /* @__PURE__ */ I(), d = /* @__PURE__ */ I(!!i), f, m;
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
				if (c.value && r) return Ls(r, { error: c.value });
				if (n && !d.value) return $i(n, e);
			};
		}
	});
}
function $i(e, t) {
	let { ref: n, props: r, children: i, ce: a } = t.vnode, o = Ls(e, r, i);
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
		let n = Zs(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Zo(() => {
				a.isDeactivated = !1, a.a && me(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && Ks(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ss(t.m), ss(t.a), l(e, f, null, 1, s), Zo(() => {
				t.da && me(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && Ks(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			sa(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = hc(Zi(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !Ns(t, o)) ? p(t) : o && sa(o), i.delete(e), a.delete(e);
		}
		Hr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => na(e, t)), t && m((e) => !na(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (ls(n.subTree.type) ? Zo(() => {
				i.set(g, ca(n.subTree));
			}, n.subTree.suspense) : i.set(g, ca(n.subTree)));
		};
		return fa(_), ma(_), ha(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = ca(t);
				if (e.type === i.type && e.key === i.key) {
					sa(i);
					let e = i.component.da;
					e && Zo(e, r);
					return;
				}
				p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!Ms(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = ca(r);
			if (s.type === Cs) return o = null, s;
			let c = s.type, l = hc(Zi(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !na(u, l)) || d && l && na(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = Bs(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && yi(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, ls(r.type) ? r : s;
		};
	}
};
function na(e, t) {
	return S(e) ? e.some((e) => na(e, t)) : O(e) ? e.split(",").includes(t) : E(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function ra(e, t) {
	aa(e, "a", t);
}
function ia(e, t) {
	aa(e, "da", t);
}
function aa(e, t, n = Xs) {
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
		y(r[t], i);
	}, n);
}
function sa(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function ca(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function la(e, t, n = Xs, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			gt();
			let i = ec(n), a = ir(t, n, e, r);
			return i(), _t(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ua = (e) => (t, n = Xs) => {
	(!rc || e === "sp") && la(e, (...e) => t(...e), n);
}, da = ua("bm"), fa = ua("m"), pa = ua("bu"), ma = ua("u"), ha = ua("bum"), ga = ua("um"), _a = ua("sp"), va = ua("rtg"), ya = ua("rtc");
function ba(e, t = Xs) {
	la("ec", e, t);
}
var xa = "components", Sa = "directives";
function Ca(e, t) {
	return Da(xa, e, !0, t) || e;
}
var wa = /* @__PURE__ */ Symbol.for("v-ndc");
function Ta(e) {
	return O(e) ? Da(xa, e, !1) || e : e || wa;
}
function Ea(e) {
	return Da(Sa, e);
}
function Da(e, t, n = !0, r = !1) {
	let i = Er || Xs;
	if (i) {
		let n = i.type;
		if (e === xa) {
			let e = hc(n, !1);
			if (e && (e === t || e === le(t) || e === fe(le(t)))) return n;
		}
		let a = Oa(i[e] || n[e], t) || Oa(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Oa(e, t) {
	return e && (e[t] || e[le(t)] || e[fe(le(t))]);
}
function R(e, t, n, r) {
	let i, a = n && n[r], o = S(e);
	if (o || O(e)) {
		let n = o && /* @__PURE__ */ _n(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ yn(e), s = /* @__PURE__ */ vn(e), e = jt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Cn(Sn(e[n])) : Sn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (A(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
function ka(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (S(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function Aa(e, t, n = {}, r, i) {
	if (Er.ce || Er.parent && Zi(Er.parent) && Er.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), B(), js(z, null, [Ls("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), B();
	let o = a && ja(a(n)), s = n.key || o && o.key, c = js(z, { key: (s && !k(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function ja(e) {
	return e.some((e) => !Ms(e) || !(e.type === Cs || e.type === z && !ja(e.children))) ? e : null;
}
function Ma(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : pe(r)] = e[r];
	return n;
}
var Na = (e) => e ? nc(e) ? mc(e) : Na(e.parent) : null, Pa = /* @__PURE__ */ v(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Na(e.parent),
	$root: (e) => Na(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => io(e),
	$forceUpdate: (e) => e.f ||= () => {
		gr(e.update);
	},
	$nextTick: (e) => e.n ||= mr.bind(e.proxy),
	$watch: (e) => Wr.bind(e)
}), Fa = (e, t) => e !== f && !e.__isScriptSetup && x(e, t), Ia = {
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
			else if (Fa(r, t)) return o[t] = 1, r[t];
			else if (i !== f && x(i, t)) return o[t] = 2, i[t];
			else if (x(a, t)) return o[t] = 3, a[t];
			else if (n !== f && x(n, t)) return o[t] = 4, n[t];
			else $a && (o[t] = 0);
		}
		let l = Pa[t], u, d;
		if (l) return t === "$attrs" && Dt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== f && x(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, x(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Fa(i, t) ? (i[t] = n, !0) : r !== f && x(r, t) ? (r[t] = n, !0) : x(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== f && s[0] !== "$" && x(e, s) || Fa(t, s) || x(a, s) || x(r, s) || x(Pa, s) || x(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? x(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
}, La = /* @__PURE__ */ v({}, Ia, {
	get(e, t) {
		if (t !== Symbol.unscopables) return Ia.get(e, t, e);
	},
	has(e, t) {
		return t[0] !== "_" && !xe(t);
	}
});
function Ra() {
	return null;
}
function za() {
	return null;
}
function Ba(e) {}
function Va(e) {}
function Ha() {
	return null;
}
function Ua() {}
function Wa(e, t) {
	return null;
}
function Ga() {
	return qa("useSlots").slots;
}
function Ka() {
	return qa("useAttrs").attrs;
}
function qa(e) {
	let t = Zs();
	return t.setupContext ||= pc(t);
}
function Ja(e) {
	return S(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Ya(e, t) {
	let n = Ja(e);
	for (let e in t) {
		if (e.startsWith("__skip")) continue;
		let r = n[e];
		r ? S(r) || D(r) ? r = n[e] = {
			type: r,
			default: t[e]
		} : r.default = t[e] : r === null && (r = n[e] = { default: t[e] }), r && t[`__skip_${e}`] && (r.skipFactory = !0);
	}
	return n;
}
function Xa(e, t) {
	return !e || !t ? e || t : S(e) && S(t) ? e.concat(t) : v({}, Ja(e), Ja(t));
}
function Za(e, t) {
	let n = {};
	for (let r in e) t.includes(r) || Object.defineProperty(n, r, {
		enumerable: !0,
		get: () => e[r]
	});
	return n;
}
function Qa(e) {
	let t = Zs(), n = rc, r = e();
	tc(), n && $s(!1);
	let i = () => {
		ec(t), n && $s(!0);
	}, a = () => {
		Zs() !== t && t.scope.off(), tc(), n && $s(!1);
	};
	return ee(r) && (r = r.catch((e) => {
		throw i(), Promise.resolve().then(() => Promise.resolve().then(a)), e;
	})), [r, () => {
		i(), Promise.resolve().then(a);
	}];
}
var $a = !0;
function eo(e) {
	let t = io(e), n = e.proxy, r = e.ctx;
	$a = !1, t.beforeCreate && no(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: h, activated: g, deactivated: _, beforeDestroy: v, beforeUnmount: y, destroyed: b, unmounted: x, render: C, renderTracked: w, renderTriggered: T, errorCaptured: E, serverPrefetch: O, expose: k, inheritAttrs: ee, components: te, directives: ne, filters: re } = t;
	if (l && to(l, r, null), o) for (let e in o) {
		let t = o[e];
		D(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		A(t) && (e.data = /* @__PURE__ */ fn(t));
	}
	if ($a = !0, a) for (let e in a) {
		let t = a[e], i = G({
			get: D(t) ? t.bind(n, n) : D(t.get) ? t.get.bind(n, n) : m,
			set: !D(t) && D(t.set) ? t.set.bind(n) : m
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) ro(s[e], r, n, e);
	if (c) {
		let e = D(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			Pr(t, e[t]);
		});
	}
	u && no(u, e, "c");
	function ie(e, t) {
		S(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ie(da, d), ie(fa, f), ie(pa, p), ie(ma, h), ie(ra, g), ie(ia, _), ie(ba, E), ie(ya, w), ie(va, T), ie(ha, y), ie(ga, x), ie(_a, O), S(k)) if (k.length) {
		let t = e.exposed ||= {};
		k.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	C && e.render === m && (e.render = C), ee != null && (e.inheritAttrs = ee), te && (e.components = te), ne && (e.directives = ne), O && Ci(e);
}
function to(e, t, n = m) {
	S(e) && (e = lo(e));
	for (let n in e) {
		let r = e[n], i;
		i = A(r) ? "default" in r ? Fr(r.from || n, r.default, !0) : Fr(r.from || n) : Fr(r), /* @__PURE__ */ wn(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function no(e, t, n) {
	ir(S(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function ro(e, t, n, r) {
	let i = r.includes(".") ? Gr(n, r) : () => n[r];
	if (O(e)) {
		let n = t[e];
		D(n) && Hr(i, n);
	} else if (D(e)) Hr(i, e.bind(n));
	else if (A(e)) if (S(e)) e.forEach((e) => ro(e, t, n, r));
	else {
		let r = D(e.handler) ? e.handler.bind(n) : t[e.handler];
		D(r) && Hr(i, r, e);
	}
}
function io(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => ao(c, e, o, !0)), ao(c, t, o)), A(t) && a.set(t, c), c;
}
function ao(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && ao(e, a, n, !0), i && i.forEach((t) => ao(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = oo[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var oo = {
	data: so,
	props: po,
	emits: po,
	methods: fo,
	computed: fo,
	beforeCreate: uo,
	created: uo,
	beforeMount: uo,
	mounted: uo,
	beforeUpdate: uo,
	updated: uo,
	beforeDestroy: uo,
	beforeUnmount: uo,
	destroyed: uo,
	unmounted: uo,
	activated: uo,
	deactivated: uo,
	errorCaptured: uo,
	serverPrefetch: uo,
	components: fo,
	directives: fo,
	watch: mo,
	provide: so,
	inject: co
};
function so(e, t) {
	return t ? e ? function() {
		return v(D(e) ? e.call(this, this) : e, D(t) ? t.call(this, this) : t);
	} : t : e;
}
function co(e, t) {
	return fo(lo(e), lo(t));
}
function lo(e) {
	if (S(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function uo(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function fo(e, t) {
	return e ? v(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function po(e, t) {
	return e ? S(e) && S(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : v(/* @__PURE__ */ Object.create(null), Ja(e), Ja(t ?? {})) : t;
}
function mo(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = v(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = uo(e[r], t[r]);
	return n;
}
function ho() {
	return {
		app: null,
		config: {
			isNativeTag: h,
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
var go = 0;
function _o(e, t) {
	return function(n, r = null) {
		D(n) || (n = v({}, n)), r != null && !A(r) && (r = null);
		let i = ho(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: go++,
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
				return a.has(e) || (e && D(e.install) ? (a.add(e), e.install(c, ...t)) : D(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || Ls(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, mc(u.component);
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
				let t = vo;
				vo = c;
				try {
					return e();
				} finally {
					vo = t;
				}
			}
		};
		return c;
	};
}
var vo = null;
function yo(e, t, n = f) {
	let r = Zs(), i = le(t), a = de(t), o = bo(e, i), s = Pn((o, s) => {
		let c, l = f, u;
		return Vr(() => {
			let t = e[i];
			M(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!M(o, c) && !(l !== f && M(e, l))) return;
				let d = r.vnode.props, p = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				p || (c = e, s()), r.emit(`update:${t}`, o), M(e, l) && (M(e, o) && !M(o, u) || p && l !== f && !M(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || f : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var bo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${le(t)}Modifiers`] || e[`${de(t)}Modifiers`];
function xo(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || f, i = n, a = t.startsWith("update:"), o = a && bo(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = n.map(ge)));
	let s, c = r[s = pe(t)] || r[s = pe(le(t))];
	!c && a && (c = r[s = pe(de(t))]), c && ir(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, ir(l, e, 6, i);
	}
}
var So = /* @__PURE__ */ new WeakMap();
function Co(e, t, n = !1) {
	let r = n ? So : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!D(e)) {
		let r = (e) => {
			let n = Co(e, t, !0);
			n && (s = !0, v(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (A(e) && r.set(e, null), null) : (S(a) ? a.forEach((e) => o[e] = null) : v(o, a), A(e) && r.set(e, o), o);
}
function wo(e, t) {
	return !e || !g(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), x(e, t[0].toLowerCase() + t.slice(1)) || x(e, de(t)) || x(e, t));
}
function To(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Or(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Hs(l.call(t, e, u, d, p, f, m)), y = s;
		} else {
			let e = t;
			v = Hs(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), y = t.props ? s : Do(s);
		}
	} catch (t) {
		Ts.length = 0, ar(t, e, 1), v = Ls(Cs);
	}
	let b = v;
	if (y && h !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(_) && (y = Oo(y, a)), b = Bs(b, y, !1, !0));
	}
	return n.dirs && (b = Bs(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && yi(b, n.transition), v = b, Or(g), v;
}
function Eo(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Ms(r)) {
			if (r.type !== Cs || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Do = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || g(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Oo = (e, t) => {
	let n = {};
	for (let r in e) (!_(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function ko(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ao(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (jo(o, r, n) && !wo(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Ao(r, o, l) : !!o;
	return !1;
}
function Ao(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (jo(t, e, a) && !wo(n, a)) return !0;
	}
	return !1;
}
function jo(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && A(r) && A(i) ? !Be(r, i) : r !== i;
}
function Mo({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var No = {}, Po = () => Object.create(No), Fo = (e) => Object.getPrototypeOf(e) === No;
function Io(e, t, n, r = !1) {
	let i = {}, a = Po();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ro(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ pn(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Lo(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ F(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (wo(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (x(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = le(o);
					i[t] = zo(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ro(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !x(t, a) && ((r = de(a)) === a || !x(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = zo(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !x(t, e)) && (delete a[e], l = !0);
	}
	l && Ot(e.attrs, "set", "");
}
function Ro(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (j(c)) continue;
		let l = t[c], u;
		i && x(i, u = le(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : wo(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ F(n), r = s || f;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = zo(i, t, s, r[s], e, !x(r, s));
		}
	}
	return o;
}
function zo(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = x(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ec(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === de(n)) && (r = !0));
	}
	return r;
}
var Bo = /* @__PURE__ */ new WeakMap();
function Vo(e, t, n = !1) {
	let r = n ? Bo : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!D(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Vo(e, t, !0);
			v(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return A(e) && r.set(e, p), p;
	if (S(a)) for (let e = 0; e < a.length; e++) {
		let t = le(a[e]);
		Ho(t) && (o[t] = f);
	}
	else if (a) for (let e in a) {
		let t = le(e);
		if (Ho(t)) {
			let n = a[e], r = o[t] = S(n) || D(n) ? { type: n } : v({}, n), i = r.type, c = !1, l = !0;
			if (S(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = D(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = D(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || x(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return A(e) && r.set(e, l), l;
}
function Ho(e) {
	return e[0] !== "$" && !j(e);
}
var Uo = (e) => e === "_" || e === "_ctx" || e === "$stable", Wo = (e) => S(e) ? e.map(Hs) : [Hs(e)], Go = (e, t, n) => {
	if (t._n) return t;
	let r = Mr((...e) => Wo(t(...e)), n);
	return r._c = !1, r;
}, Ko = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Uo(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = Go(n, i, r);
		else if (i != null) {
			let e = Wo(i);
			t[n] = () => e;
		}
	}
}, qo = (e, t) => {
	let n = Wo(t);
	e.slots.default = () => n;
}, Jo = (e, t, n) => {
	for (let r in t) (n || !Uo(r)) && (e[r] = t[r]);
}, Yo = (e, t, n) => {
	let r = e.slots = Po();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Jo(r, t, n), n && he(r, "_", e, !0)) : Ko(t, r);
	} else t && qo(e, t);
}, Xo = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = f;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Jo(i, t, n) : (a = !t.$stable, Ko(t, i)), o = t;
	} else t && (qo(e, t), o = { default: 1 });
	if (a) for (let e in i) !Uo(e) && o[e] == null && delete i[e];
}, Zo = ys;
function Qo(e) {
	return es(e);
}
function $o(e) {
	return es(e, Fi);
}
function es(e, t) {
	let n = ye();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: h, setScopeId: g = m, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ns(e, t) && (r = he(e), ue(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ss:
				y(e, t, n, r);
				break;
			case Cs:
				b(e, t, n, r);
				break;
			case ws:
				e ?? x(t, n, r, o);
				break;
			case z:
				ee(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? te(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ve);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && D(e.children, f, null, i, s, ts(e, c), l, d), _ && Nr(e, null, i, "created"), E(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !j(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Ks(p, i, e);
		}
		_ && Nr(e, null, i, "beforeMount");
		let v = rs(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Zo(() => {
			try {
				p && Ks(p, i, e), v && g.enter(f), _ && Nr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ls(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Us(e[l]) : Hs(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, O = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: p } = t;
		l |= e.patchFlag & 16;
		let m = e.props || f, h = t.props || f, g;
		if (n && ns(n, !1), (g = h.onVnodeBeforeUpdate) && Ks(g, n, t, e), p && Nr(t, e, n, "beforeUpdate"), n && ns(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && u(c, ""), d ? k(e.dynamicChildren, d, c, n, r, ts(t, i), o) : s || oe(e, t, c, null, n, r, ts(t, i), o, !1), l > 0) {
			if (l & 16) A(c, m, h, n, i);
			else if (l & 2 && m.class !== h.class && a(c, "class", null, h.class, i), l & 4 && a(c, "style", m.style, h.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && A(c, m, h, n, i);
		((g = h.onVnodeUpdated) || p) && Zo(() => {
			g && Ks(g, n, t, e), p && Nr(t, e, n, "updated");
		}, r);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === z || !Ns(c, l) || c.shapeFlag & 198) ? d(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, A = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== f) for (let o in t) !j(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (j(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ee = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && is(e, t, !0)) : oe(e, t, n, f, a, o, c, l, u);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ne(t, n, r, i, a, o, c) : re(e, t, c);
	}, ne = (e, t, n, r, i, a, o) => {
		let s = e.component = Ys(e, r, i);
		if (ea(e) && (s.ctx.renderer = ve), ic(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = Ls(Cs);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (ko(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			ae(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = os(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							Zo(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				ns(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && me(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Ks(f, s, t, c), ns(e, !0);
				let p = To(e), m = e.subTree;
				e.subTree = p, v(m, p, d(m.el), he(m), e, i, a), t.el = p.el, u === null && Mo(e, p.el), r && Zo(r, i), (f = t.props && t.props.onVnodeUpdated) && Zo(() => Ks(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Zi(t);
				if (ns(e, !1), l && me(l), !m && (o = c && c.onVnodeBeforeMount) && Ks(o, d, t), ns(e, !0), s && xe) {
					let t = () => {
						e.subTree = To(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = To(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Zo(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Zo(() => Ks(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Zi(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Zo(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new $e(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => gr(u), ns(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Lo(e, t.props, r, n), Xo(e, t.children, n), gt(), yr(e), _t();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ce(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				se(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && M(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ce(l, f, n, r, i, a, o, s, c) : M(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && D(f, n, r, i, a, o, s, c));
	}, se = (e, t, n, r, i, a, o, s, c) => {
		e ||= p, t ||= p;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? Us(t[f]) : Hs(t[f]);
			v(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? M(e, i, a, !0, !1, d) : D(t, n, r, i, a, o, s, c, d);
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? Us(t[l]) : Hs(t[l]);
			if (Ns(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? Us(t[f]) : Hs(t[f]);
			if (Ns(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) v(null, t[l] = c ? Us(t[l]) : Hs(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) ue(e[l], i, a, !0), l++;
		else {
			let m = l, h = l, g = /* @__PURE__ */ new Map();
			for (l = h; l <= f; l++) {
				let e = t[l] = c ? Us(t[l]) : Hs(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, y = 0, b = f - h + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = m; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					ue(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = h; _ <= f; _++) if (C[_ - h] === 0 && Ns(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? ue(r, i, a, !0) : (C[u - h] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let w = x ? as(C) : p;
			for (_ = w.length - 1, l = b - 1; l >= 0; l--) {
				let e = h + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || cs(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? le(d, n, p, 2) : _--);
			}
		}
	}, le = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			le(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, ve);
			return;
		}
		if (c === z) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) le(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === ws) {
			S(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[oi] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Zo(() => l.enter(s), o));
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
	}, ue = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (gt(), Di(s, null, n, e, !0), _t()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Zi(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ks(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Nr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? M(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && M(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Zo(() => {
			_ && Ks(_, t, e), h && Nr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === z) {
			fe(n, r);
			return;
		}
		if (t === ws) {
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
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ss(c), ss(l), r && me(r), i.stop(), a && (a.flags |= 8, ue(o, e, t, n)), s && Zo(s, t), Zo(() => {
			e.isUnmounted = !0;
		}, t);
	}, M = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) ue(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[qr];
		return n ? h(n) : t;
	}, ge = !1, _e = (e, t, n) => {
		let r;
		e == null ? t._vnode && (ue(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, ge ||= (ge = !0, yr(r), br(), !1);
	}, ve = {
		p: v,
		um: ue,
		m: le,
		r: de,
		mt: ne,
		mc: D,
		pc: oe,
		pbc: k,
		n: he,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(ve)), {
		render: _e,
		hydrate: be,
		createApp: _o(_e, be)
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
	if (S(r) && S(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Us(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && is(t, a)), a.type === Ss && (a.patchFlag === -1 && (a = i[e] = Us(a)), a.el = t.el), a.type === Cs && !a.el && (a.el = t.el);
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
	D(n) && n();
}
function ps(e, t, n, r, i, a, o, s, c) {
	let { p: l, o: { createElement: u } } = c, d = u("div"), f = e.suspense = hs(e, i, r, t, d, n, a, o, s, c);
	l(null, f.pendingBranch = e.ssContent, d, null, r, f, a, o), f.deps > 0 ? (fs(e, "onPending"), fs(e, "onFallback"), l(null, e.ssFallback, t, n, r, null, a, o), bs(f, e.ssFallback)) : f.resolve(!1, !0);
}
function ms(e, t, n, r, i, a, o, s, { p: c, um: l, o: { createElement: u } }) {
	let d = t.suspense = e.suspense;
	d.vnode = t, t.el = e.el;
	let f = t.ssContent, p = t.ssFallback, { activeBranch: m, pendingBranch: h, isInFallback: g, isHydrating: _ } = d;
	if (h) d.pendingBranch = f, Ns(h, f) ? (c(h, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : g && (_ || (c(m, p, n, r, i, null, a, o, s), bs(d, p)))) : (d.pendingId = us++, _ ? (d.isHydrating = !1, d.activeBranch = h) : l(h, i, d), d.deps = 0, d.effects.length = 0, d.hiddenContainer = u("div"), g ? (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 ? d.resolve() : (c(m, p, n, r, i, null, a, o, s), bs(d, p))) : m && Ns(m, f) ? (c(m, f, n, r, i, d, a, o, s), d.resolve(!0)) : (c(null, f, d.hiddenContainer, null, i, d, a, o, s), d.deps <= 0 && d.resolve()));
	else if (m && Ns(m, f)) c(m, f, n, r, i, d, a, o, s), bs(d, f);
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
				}), i && !x.isFallbackMountPending && (h(i.el) === u && (a = m(i), e = !0), p(i, l, x, !0), !g && d && r.ssFallback && Zo(() => r.ssFallback.el = null, x)), g || f(o, u, a, 0);
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
				tc(), e.asyncResolved = !0;
				let { vnode: s } = e;
				oc(e, a, !1), i && (s.el = i);
				let c = !i && e.subTree.el;
				t(e, s, h(i || e.subTree.el), i ? null : m(e.subTree), x, o, n), c && (s.placeholder = null, g(c)), Mo(e, s.el), r && --x.deps === 0 && x.resolve();
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
	e.ssContent = vs(r ? n.default : n), e.ssFallback = r ? vs(n.fallback) : Ls(Cs);
}
function vs(e) {
	let t;
	if (D(e)) {
		let n = Os && e._c;
		n && (e._d = !1, B()), e = e(), n && (e._d = !0, t = Es, Ds());
	}
	return S(e) && (e = Eo(e)), e = Hs(e), t && !e.dynamicChildren && (e.dynamicChildren = t.filter((t) => t !== e)), e;
}
function ys(e, t) {
	t && t.pendingBranch ? S(e) ? t.effects.push(...e) : t.effects.push(e) : vr(e);
}
function bs(e, t) {
	e.activeBranch = t;
	let { vnode: n, parentComponent: r } = e, i = t.el;
	for (; !i && t.component;) t = t.component.subTree, i = t.el;
	n.el = i, r && r.subTree === n && (r.vnode.el = i, Mo(r, i));
}
function xs(e) {
	let t = e.props && e.props.suspensible;
	return t != null && t !== !1;
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Ss = /* @__PURE__ */ Symbol.for("v-txt"), Cs = /* @__PURE__ */ Symbol.for("v-cmt"), ws = /* @__PURE__ */ Symbol.for("v-stc"), Ts = [], Es = null;
function B(e = !1) {
	Ts.push(Es = e ? null : []);
}
function Ds() {
	Ts.pop(), Es = Ts[Ts.length - 1] || null;
}
var Os = 1;
function ks(e, t = !1) {
	Os += e, e < 0 && Es && t && (Es.hasOnce = !0);
}
function As(e) {
	return e.dynamicChildren = Os > 0 ? Es || p : null, Ds(), Os > 0 && Es && Es.push(e), e;
}
function V(e, t, n, r, i, a) {
	return As(H(e, t, n, r, i, a, !0));
}
function js(e, t, n, r, i) {
	return As(Ls(e, t, n, r, i, !0));
}
function Ms(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ns(e, t) {
	return e.type === t.type && e.key === t.key;
}
function Ps(e) {}
var Fs = ({ key: e }) => e ?? null, Is = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ wn(e) || D(e) ? {
	i: Er,
	r: e,
	k: t,
	f: !!n
} : e);
function H(e, t = null, n = null, r = 0, i = null, a = e === z ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Fs(t),
		ref: t && Is(t),
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
	return s ? (Ws(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), Os > 0 && !o && Es && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Es.push(c), c;
}
var Ls = Rs;
function Rs(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === wa) && (e = Cs), Ms(e)) {
		let r = Bs(e, t, !0);
		return n && Ws(r, n), Os > 0 && !a && Es && (r.shapeFlag & 6 ? Es[Es.indexOf(e)] = r : Es.push(r)), r.patchFlag = -2, r;
	}
	if (gc(e) && (e = e.__vccOpts), t) {
		t = zs(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = N(e)), A(n) && (/* @__PURE__ */ bn(n) && !S(n) && (n = v({}, n)), t.style = Se(n));
	}
	let o = O(e) ? 1 : ls(e) ? 128 : Jr(e) ? 64 : A(e) ? 4 : D(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function zs(e) {
	return e ? /* @__PURE__ */ bn(e) || Fo(e) ? v({}, e) : e : null;
}
function Bs(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Gs(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Fs(l),
		ref: t && t.ref ? n && a ? S(a) ? a.concat(Is(t)) : [a, Is(t)] : Is(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== z ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Bs(e.ssContent),
		ssFallback: e.ssFallback && Bs(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && yi(u, c.clone(u)), u;
}
function U(e = " ", t = 0) {
	return Ls(Ss, null, e, t);
}
function Vs(e, t) {
	let n = Ls(ws, null, e);
	return n.staticCount = t, n;
}
function W(e = "", t = !1) {
	return t ? (B(), js(Cs, null, e)) : Ls(Cs, null, e);
}
function Hs(e) {
	return e == null || typeof e == "boolean" ? Ls(Cs) : S(e) ? Ls(z, null, e.slice()) : Ms(e) ? Us(e) : Ls(Ss, null, String(e));
}
function Us(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Bs(e);
}
function Ws(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (S(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Ws(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Fo(t) ? t._ctx = Er : r === 3 && Er && (Er.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (D(t)) {
		if (r & 65) {
			Ws(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Er
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [U(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Gs(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = N([t.class, r.class]));
		else if (e === "style") t.style = Se([t.style, r.style]);
		else if (g(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(S(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !_(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ks(e, t, n, r = null) {
	ir(e, t, 7, [n, r]);
}
var qs = ho(), Js = 0;
function Ys(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || qs, a = {
		uid: Js++,
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
		scope: new qe(!0),
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
		propsOptions: Vo(r, i),
		emitsOptions: Co(r, i),
		emit: null,
		emitted: null,
		propsDefaults: f,
		inheritAttrs: r.inheritAttrs,
		ctx: f,
		data: f,
		props: f,
		attrs: f,
		slots: f,
		refs: f,
		setupState: f,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = xo.bind(null, a), e.ce && e.ce(a), a;
}
var Xs = null, Zs = () => Xs || Er, Qs, $s;
{
	let e = ye(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Qs = t("__VUE_INSTANCE_SETTERS__", (e) => Xs = e), $s = t("__VUE_SSR_SETTERS__", (e) => rc = e);
}
var ec = (e) => {
	let t = Xs;
	return Qs(e), e.scope.on(), () => {
		e.scope.off(), Qs(t);
	};
}, tc = () => {
	Xs && Xs.scope.off(), Qs(null);
};
function nc(e) {
	return e.vnode.shapeFlag & 4;
}
var rc = !1;
function ic(e, t = !1, n = !1) {
	t && $s(t);
	let { props: r, children: i } = e.vnode, a = nc(e);
	Io(e, r, a, t), Yo(e, i, n || t);
	let o = a ? ac(e, t) : void 0;
	return t && $s(!1), o;
}
function ac(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ia);
	let { setup: r } = n;
	if (r) {
		gt();
		let n = e.setupContext = r.length > 1 ? pc(e) : null, i = ec(e), a = rr(r, e, 0, [e.props, n]), o = ee(a);
		if (_t(), i(), (o || e.sp) && !Zi(e) && Ci(e), o) {
			if (a.then(tc, tc), t) return a.then((n) => {
				oc(e, n, t);
			}).catch((t) => {
				ar(t, e, 0);
			});
			e.asyncDep = a;
		} else oc(e, a, t);
	} else dc(e, t);
}
function oc(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : A(t) && (e.setupState = Mn(t)), dc(e, n);
}
var sc, cc;
function lc(e) {
	sc = e, cc = (e) => {
		e.render._rc && (e.withProxy = new Proxy(e.ctx, La));
	};
}
var uc = () => !sc;
function dc(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && sc && !r.render) {
			let t = r.template || io(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r, s = v(v({
					isCustomElement: n,
					delimiters: a
				}, i), o);
				r.render = sc(t, s);
			}
		}
		e.render = r.render || m, cc && cc(e);
	}
	{
		let t = ec(e);
		gt();
		try {
			eo(e);
		} finally {
			_t(), t();
		}
	}
}
var fc = { get(e, t) {
	return Dt(e, "get", ""), e[t];
} };
function pc(e) {
	return {
		attrs: new Proxy(e.attrs, fc),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function mc(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Mn(xn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Pa) return Pa[n](e);
		},
		has(e, t) {
			return t in e || t in Pa;
		}
	}) : e.proxy;
}
function hc(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function gc(e) {
	return D(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ Vn(e, t, rc);
function _c(e, t, n) {
	try {
		ks(-1);
		let r = arguments.length;
		return r === 2 ? A(t) && !S(t) ? Ms(t) ? Ls(e, null, [t]) : Ls(e, t) : Ls(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ms(n) && (n = [n]), Ls(e, t, n));
	} finally {
		ks(1);
	}
}
function vc() {
	return;
	function e(t, n, r) {
		let i = t[r];
		if (S(i) && i.includes(n) || A(i) && n in i || t.extends && e(t.extends, n, r) || t.mixins && t.mixins.some((t) => e(t, n, r))) return !0;
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
	for (let e = 0; e < n.length; e++) if (M(n[e], t[e])) return !1;
	return Os > 0 && Es && Es.push(e), !0;
}
var xc = "3.5.39", Sc = m, Cc = nr, wc = Cr, Tc = Tr, Ec = {
	createComponentInstance: Ys,
	setupComponent: ic,
	renderComponentRoot: To,
	setCurrentRenderingInstance: Or,
	isVNode: Ms,
	normalizeVNode: Hs,
	getComponentPublicInstance: mc,
	ensureValidVNode: ja,
	pushWarningContext: Qn,
	popWarningContext: $n
}, Dc = /* @__PURE__ */ c({
	BaseTransition: () => mi,
	BaseTransitionPropsValidators: () => ui,
	Comment: () => Cs,
	DeprecationTypes: () => null,
	EffectScope: () => qe,
	ErrorCodes: () => tr,
	ErrorTypeStrings: () => Cc,
	Fragment: () => z,
	KeepAlive: () => ta,
	ReactiveEffect: () => $e,
	Static: () => ws,
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
	camelize: () => le,
	capitalize: () => fe,
	cloneVNode: () => Bs,
	compatUtils: () => null,
	computed: () => G,
	createApp: () => ku,
	createBlock: () => js,
	createCommentVNode: () => W,
	createElementBlock: () => V,
	createElementVNode: () => H,
	createHydrationRenderer: () => $o,
	createPropsRestProxy: () => Za,
	createRenderer: () => Qo,
	createSSRApp: () => Au,
	createSlots: () => ka,
	createStaticVNode: () => Vs,
	createTextVNode: () => U,
	createVNode: () => Ls,
	customRef: () => Pn,
	defineAsyncComponent: () => Qi,
	defineComponent: () => xi,
	defineCustomElement: () => zl,
	defineEmits: () => za,
	defineExpose: () => Ba,
	defineModel: () => Ua,
	defineOptions: () => Va,
	defineProps: () => Ra,
	defineSSRCustomElement: () => Bl,
	defineSlots: () => Ha,
	devtools: () => wc,
	effect: () => ft,
	effectScope: () => Je,
	getCurrentInstance: () => Zs,
	getCurrentScope: () => Ye,
	getCurrentWatcher: () => qn,
	getTransitionRawChildren: () => bi,
	guardReactiveProps: () => zs,
	h: () => _c,
	handleError: () => ar,
	hasInjectionContext: () => Ir,
	hydrate: () => Ou,
	hydrateOnIdle: () => Gi,
	hydrateOnInteraction: () => Yi,
	hydrateOnMediaQuery: () => Ji,
	hydrateOnVisible: () => qi,
	initCustomFormatter: () => vc,
	initDirectivesForSSR: () => Pu,
	inject: () => Fr,
	isMemoSame: () => bc,
	isProxy: () => bn,
	isReactive: () => _n,
	isReadonly: () => vn,
	isRef: () => wn,
	isRuntimeOnly: () => uc,
	isShallow: () => yn,
	isVNode: () => Ms,
	markRaw: () => xn,
	mergeDefaults: () => Ya,
	mergeModels: () => Xa,
	mergeProps: () => Gs,
	nextTick: () => mr,
	nodeOps: () => Fc,
	normalizeClass: () => N,
	normalizeProps: () => De,
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
	onScopeDispose: () => Xe,
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
	ref: () => I,
	registerRuntimeCompiler: () => lc,
	render: () => Du,
	renderList: () => R,
	renderSlot: () => Aa,
	resolveComponent: () => Ca,
	resolveDirective: () => Ea,
	resolveDynamicComponent: () => Ta,
	resolveFilter: () => null,
	resolveTransitionHooks: () => gi,
	setBlockTracking: () => ks,
	setDevtoolsHook: () => Tc,
	setTransitionHooks: () => yi,
	shallowReactive: () => pn,
	shallowReadonly: () => hn,
	shallowRef: () => Tn,
	ssrContextKey: () => Lr,
	ssrUtils: () => Ec,
	stop: () => pt,
	toDisplayString: () => P,
	toHandlerKey: () => pe,
	toHandlers: () => Ma,
	toRaw: () => F,
	toRef: () => Rn,
	toRefs: () => Fn,
	toValue: () => An,
	transformVNodeArgs: () => Ps,
	triggerRef: () => On,
	unref: () => kn,
	useAttrs: () => Ka,
	useCssModule: () => Gl,
	useCssVars: () => ll,
	useHost: () => Ul,
	useId: () => Si,
	useModel: () => yo,
	useSSRContext: () => Rr,
	useShadowRoot: () => Wl,
	useSlots: () => Ga,
	useTemplateRef: () => wi,
	useTransitionState: () => ci,
	vModelCheckbox: () => su,
	vModelDynamic: () => pu,
	vModelRadio: () => lu,
	vModelSelect: () => q,
	vModelText: () => K,
	vShow: () => al,
	version: () => xc,
	warn: () => Sc,
	watch: () => Hr,
	watchEffect: () => zr,
	watchPostEffect: () => Br,
	watchSyncEffect: () => Vr,
	withAsyncContext: () => Qa,
	withCtx: () => Mr,
	withDefaults: () => Wa,
	withDirectives: () => L,
	withKeys: () => xu,
	withMemo: () => yc,
	withModifiers: () => yu,
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
}, Bc = /* @__PURE__ */ v({}, ui, zc), Vc = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Bc, e))((e, { slots: t }) => _c(mi, Wc(e), t)), Hc = (e, t = []) => {
	S(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Uc = (e) => e ? S(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Wc(e) {
	let t = {};
	for (let n in e) n in zc || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = Gc(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = _, onAppear: w = y, onAppearCancelled: T = b } = t, E = (e, t, n, r) => {
		e._enterCancelled = r, Jc(e, t ? u : s), Jc(e, t ? l : o), n && n();
	}, D = (e, t) => {
		e._isLeaving = !1, Jc(e, d), Jc(e, p), Jc(e, f), t && t();
	}, O = (e) => (t, n) => {
		let i = e ? w : y, o = () => E(t, e, n);
		Hc(i, [t, o]), Yc(() => {
			Jc(t, e ? c : a), qc(t, e ? u : s), Uc(i) || Zc(t, r, h, o);
		});
	};
	return v(t, {
		onBeforeEnter(e) {
			Hc(_, [e]), qc(e, a), qc(e, o);
		},
		onBeforeAppear(e) {
			Hc(C, [e]), qc(e, c), qc(e, l);
		},
		onEnter: O(!1),
		onAppear: O(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => D(e, t);
			qc(e, d), e._enterCancelled ? (qc(e, f), tl(e)) : (tl(e), qc(e, f)), Yc(() => {
				e._isLeaving && (Jc(e, d), qc(e, p), Uc(x) || Zc(e, r, g, n));
			}), Hc(x, [e, n]);
		},
		onEnterCancelled(e) {
			E(e, !1, void 0, !0), Hc(b, [e]);
		},
		onAppearCancelled(e) {
			E(e, !0, void 0, !0), Hc(T, [e]);
		},
		onLeaveCancelled(e) {
			D(e), Hc(S, [e]);
		}
	});
}
function Gc(e) {
	if (e == null) return null;
	if (A(e)) return [Kc(e.enter), Kc(e.leave)];
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
	let t = Zs();
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
		Hr(r, m, { flush: "post" });
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
	else if (e.type === z) e.children.forEach((e) => ul(e, t));
	else if (e.type === ws) {
		let { el: n, anchor: r } = e;
		for (; n && (dl(n, t), n !== r);) n = n.nextSibling;
	}
}
function dl(e, t) {
	if (e.nodeType === 1) {
		let n = e.style, r = "";
		for (let e in t) {
			let i = Ge(t[e]);
			n.setProperty(`--${e}`, i), r += `--${e}: ${i};`;
		}
		n[cl] = r;
	}
}
var fl = /(?:^|;)\s*display\s*:/;
function pl(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) if (O(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? hl(r, t, "");
		}
		else for (let e in t) n[e] ?? hl(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? hl(r, i, "") : yl(e, i, !O(t) && t ? t[i] : void 0, o) || hl(r, i, o);
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
	if (S(n)) n.forEach((n) => hl(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = vl(e, t);
		ml.test(n) ? e.setProperty(de(r), n.replace(ml, ""), "important") : e[r] = n;
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
	let r = le(t);
	if (r !== "filter" && r in e) return _l[t] = r;
	r = fe(r);
	for (let n = 0; n < gl.length; n++) {
		let i = gl[n] + r;
		if (i in e) return _l[t] = i;
	}
	return t;
}
function yl(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var bl = "http://www.w3.org/1999/xlink";
function xl(e, t, n, r, i, a = Le(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(bl, t.slice(6, t.length)) : e.setAttributeNS(bl, t, n) : n == null || a && !Re(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : k(n) ? String(n) : n);
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
		r === "boolean" ? n = Re(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : de(e.slice(2)), t];
}
var Al = 0, jl = /* @__PURE__ */ Promise.resolve(), Ml = () => Al ||= (jl.then(() => Al = 0), Date.now());
function Nl(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (S(r)) {
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
	t === "class" ? nl(e, r, o) : t === "style" ? pl(e, n, r) : g(t) ? _(t) || El(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Il(e, t, r, o)) ? (Sl(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && xl(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ll(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? Sl(e, le(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), xl(e, t, r, o));
};
function Il(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Pl(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Pl(t) && O(n) ? !1 : t in e;
}
function Ll(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = le(t);
	return Array.isArray(n) ? n.some((e) => le(e) === r) : Object.keys(n).some((e) => le(e) === r);
}
var Rl = {};
// @__NO_SIDE_EFFECTS__
function zl(e, t, n) {
	let r = /* @__PURE__ */ xi(e, t);
	ie(r) && (r = v({}, r, t));
	class i extends Hl {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
var Bl = /* @__NO_SIDE_EFFECTS__ */ ((e, t) => /* @__PURE__ */ zl(e, t, Au)), Vl = typeof HTMLElement < "u" ? HTMLElement : class {}, Hl = class e extends Vl {
	constructor(e, t = {}, n = ku) {
		super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== ku ? this._root = this.shadowRoot : e.shadowRoot === !1 ? this._root = this : (this.attachShadow(v({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot);
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
			if (n && !S(n)) for (let e in n) {
				let t = n[e];
				(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = _e(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[le(e)] = !0);
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
		if (t) for (let e in t) x(this, e) || Object.defineProperty(this, e, { get: () => kn(t[e]) });
	}
	_resolveProps(e) {
		let { props: t } = e, n = S(t) ? t : Object.keys(t || {});
		for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
		for (let e of n.map(le)) Object.defineProperty(this, e, {
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
		let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : Rl, r = le(e);
		t && this._numberProps && this._numberProps[r] && (n = _e(n)), this._setProp(r, n, !1, !0);
	}
	_getProp(e) {
		return this._props[e];
	}
	_setProp(e, t, n = !0, r = !1) {
		if (t !== this._props[e] && (this._dirty = !0, t === Rl ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
			let n = this._ob;
			n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(de(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(de(e), t + "") : t || this.removeAttribute(de(e)), n && n.observe(this, { attributes: !0 });
		}
	}
	_update() {
		let e = this._createVNode();
		this._app && (e.appContext = this._app._context), Du(e, this._root);
	}
	_createVNode() {
		let e = {};
		this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
		let t = Ls(this._def, v(e, this._props));
		return this._instance || (t.ce = (e) => {
			this._instance = e, e.ce = this, e.isCE = !0;
			let t = (e, t) => {
				this.dispatchEvent(new CustomEvent(e, ie(t[0]) ? v({ detail: t }, t[0]) : { detail: t }));
			};
			e.emit = (e, ...n) => {
				t(e, n), de(e) !== e && t(de(e), n);
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
	let t = Zs();
	return t && t.ce || null;
}
function Wl() {
	let e = Ul();
	return e && e.shadowRoot;
}
function Gl(e = "$style") {
	{
		let t = Zs();
		if (!t) return f;
		let n = t.type.__cssModules;
		return n && n[e] || f;
	}
}
var Kl = /* @__PURE__ */ new WeakMap(), ql = /* @__PURE__ */ new WeakMap(), Jl = /* @__PURE__ */ Symbol("_moveCb"), Yl = /* @__PURE__ */ Symbol("_enterCb"), Xl = /* @__PURE__ */ ((e) => (delete e.props.mode, e))({
	name: "TransitionGroup",
	props: /* @__PURE__ */ v({}, Bc, {
		tag: String,
		moveClass: String
	}),
	setup(e, { slots: t }) {
		let n = Zs(), r = ci(), i, a;
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
			let o = /* @__PURE__ */ F(e), s = Wc(o), c = o.tag || z;
			if (i = [], a) for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.el && t.el instanceof Element && !t.el[il] && (i.push(t), yi(t, gi(t, s, r, n)), Kl.set(t, eu(t.el)));
			}
			a = t.default ? bi(t.default()) : [];
			for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.key != null && yi(t, gi(t, s, r, n));
			}
			return Ls(c, null, a);
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
	return S(t) ? (e) => me(t, e) : t;
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
var K = {
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
			let t = e._modelValue, n = du(e), r = e.checked, i = e[au];
			if (S(t)) {
				let e = Ve(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (w(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(fu(e, r));
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
	if (S(t)) i = Ve(t, r.props.value) > -1;
	else if (w(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Be(t, fu(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var lu = {
	created(e, { value: t }, n) {
		e.checked = Be(t, n.props.value), e[au] = nu(n), Cl(e, "change", () => {
			e[au](du(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[au] = nu(r), t !== n && (e.checked = Be(t, r.props.value));
	}
}, q = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = w(t);
		Cl(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ge(du(e)) : du(e));
			e[au](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, mr(() => {
				e._assigning = !1;
			});
		}), e[au] = nu(r);
	},
	mounted(e, { value: t }) {
		uu(e, t);
	},
	beforeUpdate(e, t, n) {
		e[au] = nu(n);
	},
	updated(e, { value: t }) {
		e._assigning || uu(e, t);
	}
};
function uu(e, t) {
	let n = e.multiple, r = S(t);
	if (!(n && !r && !w(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = du(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = Ve(t, o) > -1;
			} else a.selected = t.has(o);
			else if (Be(du(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function du(e) {
	return "_value" in e ? e._value : e.value;
}
function fu(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var pu = {
	created(e, t, n) {
		hu(e, t, n, null, "created");
	},
	mounted(e, t, n) {
		hu(e, t, n, null, "mounted");
	},
	beforeUpdate(e, t, n, r) {
		hu(e, t, n, r, "beforeUpdate");
	},
	updated(e, t, n, r) {
		hu(e, t, n, r, "updated");
	}
};
function mu(e, t) {
	switch (e) {
		case "SELECT": return q;
		case "TEXTAREA": return K;
		default: switch (t) {
			case "checkbox": return su;
			case "radio": return lu;
			default: return K;
		}
	}
}
function hu(e, t, n, r, i) {
	let a = mu(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
function gu() {
	K.getSSRProps = ({ value: e }) => ({ value: e }), lu.getSSRProps = ({ value: e }, t) => {
		if (t.props && Be(t.props.value, e)) return { checked: !0 };
	}, su.getSSRProps = ({ value: e }, t) => {
		if (S(e)) {
			if (t.props && Ve(e, t.props.value) > -1) return { checked: !0 };
		} else if (w(e)) {
			if (t.props && e.has(t.props.value)) return { checked: !0 };
		} else if (e) return { checked: !0 };
	}, pu.getSSRProps = (e, t) => {
		if (typeof t.type != "string") return;
		let n = mu(t.type.toUpperCase(), t.props && t.props.type);
		if (n.getSSRProps) return n.getSSRProps(e, t);
	};
}
var _u = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], vu = {
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
	exact: (e, t) => _u.some((n) => e[`${n}Key`] && !t.includes(n))
}, yu = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = vu[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, bu = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, xu = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = de(n.key);
		if (t.some((e) => e === r || bu[e] === r)) return e(n);
	}));
}, Su = /* @__PURE__ */ v({ patchProp: Fl }, Fc), Cu, wu = !1;
function Tu() {
	return Cu ||= Qo(Su);
}
function Eu() {
	return Cu = wu ? Cu : $o(Su), wu = !0, Cu;
}
var Du = ((...e) => {
	Tu().render(...e);
}), Ou = ((...e) => {
	Eu().hydrate(...e);
}), ku = ((...e) => {
	let t = Tu().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Mu(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ju(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
}), Au = ((...e) => {
	let t = Eu().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let t = Mu(e);
		if (t) return n(t, !0, ju(t));
	}, t;
});
function ju(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Mu(e) {
	return O(e) ? document.querySelector(e) : e;
}
var Nu = !1, Pu = () => {
	Nu || (Nu = !0, gu(), sl());
}, Fu = /* @__PURE__ */ Symbol(""), Iu = /* @__PURE__ */ Symbol(""), Lu = /* @__PURE__ */ Symbol(""), Ru = /* @__PURE__ */ Symbol(""), zu = /* @__PURE__ */ Symbol(""), Bu = /* @__PURE__ */ Symbol(""), Vu = /* @__PURE__ */ Symbol(""), Hu = /* @__PURE__ */ Symbol(""), Uu = /* @__PURE__ */ Symbol(""), Wu = /* @__PURE__ */ Symbol(""), Gu = /* @__PURE__ */ Symbol(""), Ku = /* @__PURE__ */ Symbol(""), qu = /* @__PURE__ */ Symbol(""), Ju = /* @__PURE__ */ Symbol(""), Yu = /* @__PURE__ */ Symbol(""), Xu = /* @__PURE__ */ Symbol(""), Zu = /* @__PURE__ */ Symbol(""), Qu = /* @__PURE__ */ Symbol(""), $u = /* @__PURE__ */ Symbol(""), ed = /* @__PURE__ */ Symbol(""), td = /* @__PURE__ */ Symbol(""), nd = /* @__PURE__ */ Symbol(""), rd = /* @__PURE__ */ Symbol(""), id = /* @__PURE__ */ Symbol(""), ad = /* @__PURE__ */ Symbol(""), od = /* @__PURE__ */ Symbol(""), sd = /* @__PURE__ */ Symbol(""), cd = /* @__PURE__ */ Symbol(""), ld = /* @__PURE__ */ Symbol(""), ud = /* @__PURE__ */ Symbol(""), dd = /* @__PURE__ */ Symbol(""), fd = /* @__PURE__ */ Symbol(""), pd = /* @__PURE__ */ Symbol(""), md = /* @__PURE__ */ Symbol(""), hd = /* @__PURE__ */ Symbol(""), gd = /* @__PURE__ */ Symbol(""), _d = /* @__PURE__ */ Symbol(""), vd = /* @__PURE__ */ Symbol(""), yd = /* @__PURE__ */ Symbol(""), bd = {
	[Fu]: "Fragment",
	[Iu]: "Teleport",
	[Lu]: "Suspense",
	[Ru]: "KeepAlive",
	[zu]: "BaseTransition",
	[Bu]: "openBlock",
	[Vu]: "createBlock",
	[Hu]: "createElementBlock",
	[Uu]: "createVNode",
	[Wu]: "createElementVNode",
	[Gu]: "createCommentVNode",
	[Ku]: "createTextVNode",
	[qu]: "createStaticVNode",
	[Ju]: "resolveComponent",
	[Yu]: "resolveDynamicComponent",
	[Xu]: "resolveDirective",
	[Zu]: "resolveFilter",
	[Qu]: "withDirectives",
	[$u]: "renderList",
	[ed]: "renderSlot",
	[td]: "createSlots",
	[nd]: "toDisplayString",
	[rd]: "mergeProps",
	[id]: "normalizeClass",
	[ad]: "normalizeStyle",
	[od]: "normalizeProps",
	[sd]: "guardReactiveProps",
	[cd]: "toHandlers",
	[ld]: "camelize",
	[ud]: "capitalize",
	[dd]: "toHandlerKey",
	[fd]: "setBlockTracking",
	[pd]: "pushScopeId",
	[md]: "popScopeId",
	[hd]: "withCtx",
	[gd]: "unref",
	[_d]: "isRef",
	[vd]: "withMemo",
	[yd]: "isMemoSame"
};
function xd(e) {
	Object.getOwnPropertySymbols(e).forEach((t) => {
		bd[t] = e[t];
	});
}
var Sd = {
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
function Cd(e, t = "") {
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
		loc: Sd
	};
}
function wd(e, t, n, r, i, a, o, s = !1, c = !1, l = !1, u = Sd) {
	return e && (s ? (e.helper(Bu), e.helper(Fd(e.inSSR, l))) : e.helper(Pd(e.inSSR, l)), o && e.helper(Qu)), {
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
function Td(e, t = Sd) {
	return {
		type: 17,
		loc: t,
		elements: e
	};
}
function Ed(e, t = Sd) {
	return {
		type: 15,
		loc: t,
		properties: e
	};
}
function Dd(e, t) {
	return {
		type: 16,
		loc: Sd,
		key: O(e) ? J(e, !0) : e,
		value: t
	};
}
function J(e, t = !1, n = Sd, r = 0) {
	return {
		type: 4,
		loc: n,
		content: e,
		isStatic: t,
		constType: t ? 3 : r
	};
}
function Od(e, t = Sd) {
	return {
		type: 8,
		loc: t,
		children: e
	};
}
function kd(e, t = [], n = Sd) {
	return {
		type: 14,
		loc: n,
		callee: e,
		arguments: t
	};
}
function Ad(e, t = void 0, n = !1, r = !1, i = Sd) {
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
		loc: Sd
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
		loc: Sd
	};
}
function Nd(e) {
	return {
		type: 21,
		body: e,
		loc: Sd
	};
}
function Pd(e, t) {
	return e || t ? Uu : Wu;
}
function Fd(e, t) {
	return e || t ? Vu : Hu;
}
function Id(e, { helper: t, removeHelper: n, inSSR: r }) {
	e.isBlock || (e.isBlock = !0, n(Pd(r, e.isComponent)), t(Bu), t(Fd(r, e.isComponent)));
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
function Xd(e, t, n, r) {
	let i = `https://vuejs.org/error-reference/#compiler-${e}`, a = SyntaxError(String(i));
	return a.code = e, a.loc = t, a;
}
var Zd = (e) => e.type === 4 && e.isStatic;
function Qd(e) {
	switch (e) {
		case "Teleport":
		case "teleport": return Iu;
		case "Suspense":
		case "suspense": return Lu;
		case "KeepAlive":
		case "keep-alive": return Ru;
		case "BaseTransition":
		case "base-transition": return zu;
	}
}
var $d = /^$|^\d|[^\$\w\xA0-\uFFFF]/, ef = (e) => !$d.test(e), tf = /[A-Za-z_$\xA0-\uFFFF]/, nf = /[\.\?\w$\xA0-\uFFFF]/, rf = /\s+[.[]\s*|\s*[.[]\s+/g, af = (e) => e.type === 4 ? e.content : e.loc.source, of = (e) => {
	let t = af(e).trim().replace(rf, (e) => e.trim()), n = 0, r = [], i = 0, a = 0, o = null;
	for (let e = 0; e < t.length; e++) {
		let s = t.charAt(e);
		switch (n) {
			case 0:
				if (s === "[") r.push(n), n = 1, i++;
				else if (s === "(") r.push(n), n = 2, a++;
				else if (!(e === 0 ? tf : nf).test(s)) return !1;
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
}, sf = /^\s*(?:async\s*)?(?:\([^)]*?\)|[\w$_]+)\s*(?::[^=]+)?=>|^\s*(?:async\s+)?function(?:\s+[\w$]+)?\s*\(/, cf = (e) => sf.test(af(e));
function lf(e, t, n = !1) {
	for (let r = 0; r < e.props.length; r++) {
		let i = e.props[r];
		if (i.type === 7 && (n || i.exp) && (O(t) ? i.name === t : t.test(i.name))) return i;
	}
}
function uf(e, t, n = !1, r = !1) {
	for (let i = 0; i < e.props.length; i++) {
		let a = e.props[i];
		if (a.type === 6) {
			if (n) continue;
			if (a.name === t && (a.value || r)) return a;
		} else if (a.name === "bind" && (a.exp || r) && df(a.arg, t)) return a;
	}
}
function df(e, t) {
	return !!(e && Zd(e) && e.content === t);
}
function ff(e) {
	return e.props.some((e) => e.type === 7 && e.name === "bind" && (!e.arg || e.arg.type !== 4 || !e.arg.isStatic));
}
function pf(e) {
	return e.type === 5 || e.type === 2;
}
function mf(e) {
	return e.type === 7 && e.name === "pre";
}
function hf(e) {
	return e.type === 7 && e.name === "slot";
}
function gf(e) {
	return e.type === 1 && e.tagType === 3;
}
function _f(e) {
	return e.type === 1 && e.tagType === 2;
}
var vf = /* @__PURE__ */ new Set([od, sd]);
function yf(e, t = []) {
	if (e && !O(e) && e.type === 14) {
		let n = e.callee;
		if (!O(n) && vf.has(n)) return yf(e.arguments[0], t.concat(e));
	}
	return [e, t];
}
function bf(e, t, n) {
	let r, i = e.type === 13 ? e.props : e.arguments[2], a = [], o;
	if (i && !O(i) && i.type === 14) {
		let e = yf(i);
		i = e[0], a = e[1], o = a[a.length - 1];
	}
	if (i == null || O(i)) r = Ed([t]);
	else if (i.type === 14) {
		let e = i.arguments[0];
		!O(e) && e.type === 15 ? xf(t, e) || e.properties.unshift(t) : i.callee === cd ? r = kd(n.helper(rd), [Ed([t]), i]) : i.arguments.unshift(Ed([t])), !r && (r = i);
	} else i.type === 15 ? (xf(t, i) || i.properties.unshift(t), r = i) : (r = kd(n.helper(rd), [Ed([t]), i]), o && o.callee === sd && (o = a[a.length - 2]));
	e.type === 13 ? o ? o.arguments[0] = r : e.props = r : o ? o.arguments[0] = r : e.arguments[2] = r;
}
function xf(e, t) {
	let n = !1;
	if (e.key.type === 4) {
		let r = e.key.content;
		n = t.properties.some((e) => e.key.type === 4 && e.key.content === r);
	}
	return n;
}
function Sf(e, t) {
	return `_${t}_${e.replace(/[^\w]/g, (t, n) => t === "-" ? "_" : e.charCodeAt(n).toString())}`;
}
function Cf(e) {
	return e.type === 14 && e.callee === vd ? e.arguments[1].returns : e;
}
var wf = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
function Tf(e) {
	for (let t = 0; t < e.length; t++) if (!Bd(e.charCodeAt(t))) return !1;
	return !0;
}
function Ef(e) {
	return e.type === 2 && Tf(e.content) || e.type === 12 && Ef(e.content);
}
function Df(e) {
	return e.type === 3 || Ef(e);
}
var Of = {
	parseMode: "base",
	ns: 0,
	delimiters: ["{{", "}}"],
	getNamespace: () => 0,
	isVoidTag: h,
	isPreTag: h,
	isIgnoreNewlineTag: h,
	isCustomElement: h,
	onError: Jd,
	onWarn: Yd,
	comments: !1,
	prefixIdentifiers: !1
}, kf = Of, Af = null, jf = "", Mf = null, Y = null, Nf = "", Pf = -1, Ff = -1, If = 0, Lf = !1, Rf = null, zf = [], Bf = new Wd(zf, {
	onerr: up,
	ontext(e, t) {
		Kf(Wf(e, t), e, t);
	},
	ontextentity(e, t, n) {
		Kf(e, t, n);
	},
	oninterpolation(e, t) {
		if (Lf) return Kf(Wf(e, t), e, t);
		let n = e + Bf.delimiterOpen.length, r = t - Bf.delimiterClose.length;
		for (; Bd(jf.charCodeAt(n));) n++;
		for (; Bd(jf.charCodeAt(r - 1));) r--;
		let i = Wf(n, r);
		i.includes("&") && (i = kf.decodeEntities(i, !1)), ip({
			type: 5,
			content: lp(i, !1, ap(n, r)),
			loc: ap(e, t)
		});
	},
	onopentagname(e, t) {
		let n = Wf(e, t);
		Mf = {
			type: 1,
			tag: n,
			ns: kf.getNamespace(n, zf[0], kf.ns),
			tagType: 0,
			props: [],
			children: [],
			loc: ap(e - 1, t),
			codegenNode: void 0
		};
	},
	onopentagend(e) {
		Gf(e);
	},
	onclosetag(e, t) {
		let n = Wf(e, t);
		if (!kf.isVoidTag(n)) {
			let r = !1;
			for (let e = 0; e < zf.length; e++) if (zf[e].tag.toLowerCase() === n.toLowerCase()) {
				r = !0, e > 0 && up(24, zf[0].loc.start.offset);
				for (let n = 0; n <= e; n++) qf(zf.shift(), t, n < e);
				break;
			}
			r || up(23, Yf(e, 60));
		}
	},
	onselfclosingtag(e) {
		let t = Mf.tag;
		Mf.isSelfClosing = !0, Gf(e), zf[0] && zf[0].tag === t && qf(zf.shift(), e);
	},
	onattribname(e, t) {
		Y = {
			type: 6,
			name: Wf(e, t),
			nameLoc: ap(e, t),
			value: void 0,
			loc: ap(e)
		};
	},
	ondirname(e, t) {
		let n = Wf(e, t), r = n === "." || n === ":" ? "bind" : n === "@" ? "on" : n === "#" ? "slot" : n.slice(2);
		if (!Lf && r === "" && up(26, e), Lf || r === "") Y = {
			type: 6,
			name: n,
			nameLoc: ap(e, t),
			value: void 0,
			loc: ap(e)
		};
		else if (Y = {
			type: 7,
			name: r,
			rawName: n,
			exp: void 0,
			arg: void 0,
			modifiers: n === "." ? [J("prop")] : [],
			loc: ap(e)
		}, r === "pre") {
			Lf = Bf.inVPre = !0, Rf = Mf;
			let e = Mf.props;
			for (let t = 0; t < e.length; t++) e[t].type === 7 && (e[t] = cp(e[t]));
		}
	},
	ondirarg(e, t) {
		if (e === t) return;
		let n = Wf(e, t);
		if (Lf && !mf(Y)) Y.name += n, sp(Y.nameLoc, t);
		else {
			let r = n[0] !== "[";
			Y.arg = lp(r ? n : n.slice(1, -1), r, ap(e, t), r ? 3 : 0);
		}
	},
	ondirmodifier(e, t) {
		let n = Wf(e, t);
		if (Lf && !mf(Y)) Y.name += "." + n, sp(Y.nameLoc, t);
		else if (Y.name === "slot") {
			let e = Y.arg;
			e && (e.content += "." + n, sp(e.loc, t));
		} else {
			let r = J(n, !0, ap(e, t));
			Y.modifiers.push(r);
		}
	},
	onattribdata(e, t) {
		Nf += Wf(e, t), Pf < 0 && (Pf = e), Ff = t;
	},
	onattribentity(e, t, n) {
		Nf += e, Pf < 0 && (Pf = t), Ff = n;
	},
	onattribnameend(e) {
		let t = Y.loc.start.offset, n = Wf(t, e);
		Y.type === 7 && (Y.rawName = n), Mf.props.some((e) => (e.type === 7 ? e.rawName : e.name) === n) && up(2, t);
	},
	onattribend(e, t) {
		if (Mf && Y) {
			if (sp(Y.loc, t), e !== 0) if (Nf.includes("&") && (Nf = kf.decodeEntities(Nf, !0)), Y.type === 6) Y.name === "class" && (Nf = rp(Nf).trim()), e === 1 && !Nf && up(13, t), Y.value = {
				type: 2,
				content: Nf,
				loc: e === 1 ? ap(Pf, Ff) : ap(Pf - 1, Ff + 1)
			}, Bf.inSFCRoot && Mf.tag === "template" && Y.name === "lang" && Nf && Nf !== "html" && Bf.enterRCDATA(Hd("</template"), 0);
			else {
				Y.exp = lp(Nf, !1, ap(Pf, Ff), 0, 0), Y.name === "for" && (Y.forParseResult = Uf(Y.exp));
				let e = -1;
				Y.name === "bind" && (e = Y.modifiers.findIndex((e) => e.content === "sync")) > -1 && qd("COMPILER_V_BIND_SYNC", kf, Y.loc, Y.arg.loc.source) && (Y.name = "model", Y.modifiers.splice(e, 1));
			}
			(Y.type !== 7 || Y.name !== "pre") && Mf.props.push(Y);
		}
		Nf = "", Pf = Ff = -1;
	},
	oncomment(e, t) {
		kf.comments && ip({
			type: 3,
			content: Wf(e, t),
			loc: ap(e - 4, t + 3)
		});
	},
	onend() {
		let e = jf.length;
		for (let t = 0; t < zf.length; t++) qf(zf[t], e - 1), up(24, zf[t].loc.start.offset);
	},
	oncdata(e, t) {
		(zf[0] ? zf[0].ns : kf.ns) === 0 ? up(1, e - 9) : Kf(Wf(e, t), e, t);
	},
	onprocessinginstruction(e) {
		(zf[0] ? zf[0].ns : kf.ns) === 0 && up(21, e - 1);
	}
}), Vf = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, Hf = /^\(|\)$/g;
function Uf(e) {
	let t = e.loc, n = e.content, r = n.match(wf);
	if (!r) return;
	let [, i, a] = r, o = (e, n, r = !1) => {
		let i = t.start.offset + n;
		return lp(e, !1, ap(i, i + e.length), 0, +!!r);
	}, s = {
		source: o(a.trim(), n.indexOf(a, i.length)),
		value: void 0,
		key: void 0,
		index: void 0,
		finalized: !1
	}, c = i.trim().replace(Hf, "").trim(), l = i.indexOf(c), u = c.match(Vf);
	if (u) {
		c = c.replace(Vf, "").trim();
		let e = u[1].trim(), t;
		if (e && (t = n.indexOf(e, l + c.length), s.key = o(e, t, !0)), u[2]) {
			let r = u[2].trim();
			r && (s.index = o(r, n.indexOf(r, s.key ? t + e.length : l + c.length), !0));
		}
	}
	return c && (s.value = o(c, l, !0)), s;
}
function Wf(e, t) {
	return jf.slice(e, t);
}
function Gf(e) {
	Bf.inSFCRoot && (Mf.innerLoc = ap(e + 1, e + 1)), ip(Mf);
	let { tag: t, ns: n } = Mf;
	n === 0 && kf.isPreTag(t) && If++, kf.isVoidTag(t) ? qf(Mf, e) : (zf.unshift(Mf), (n === 1 || n === 2) && (Bf.inXML = !0)), Mf = null;
}
function Kf(e, t, n) {
	{
		let t = zf[0] && zf[0].tag;
		t !== "script" && t !== "style" && e.includes("&") && (e = kf.decodeEntities(e, !1));
	}
	let r = zf[0] || Af, i = r.children[r.children.length - 1];
	i && i.type === 2 ? (i.content += e, sp(i.loc, n)) : r.children.push({
		type: 2,
		content: e,
		loc: ap(t, n)
	});
}
function qf(e, t, n = !1) {
	n ? sp(e.loc, Yf(t, 60)) : sp(e.loc, Jf(t, 62) + 1), Bf.inSFCRoot && (e.children.length ? e.innerLoc.end = v({}, e.children[e.children.length - 1].loc.end) : e.innerLoc.end = v({}, e.innerLoc.start), e.innerLoc.source = Wf(e.innerLoc.start.offset, e.innerLoc.end.offset));
	let { tag: r, ns: i, children: a } = e;
	if (Lf || (r === "slot" ? e.tagType = 2 : Zf(e) ? e.tagType = 3 : Qf(e) && (e.tagType = 1)), Bf.inRCDATA || (e.children = tp(a)), i === 0 && kf.isIgnoreNewlineTag(r)) {
		let e = a[0];
		e && e.type === 2 && (e.content = e.content.replace(/^\r?\n/, ""));
	}
	i === 0 && kf.isPreTag(r) && If--, Rf === e && (Lf = Bf.inVPre = !1, Rf = null), Bf.inXML && (zf[0] ? zf[0].ns : kf.ns) === 0 && (Bf.inXML = !1);
	{
		let t = e.props;
		if (!Bf.inSFCRoot && Kd("COMPILER_NATIVE_TEMPLATE", kf) && e.tag === "template" && !Zf(e)) {
			let t = zf[0] || Af, n = t.children.indexOf(e);
			t.children.splice(n, 1, ...e.children);
		}
		let n = t.find((e) => e.type === 6 && e.name === "inline-template");
		n && qd("COMPILER_INLINE_TEMPLATE", kf, n.loc) && e.children.length && (n.value = {
			type: 2,
			content: Wf(e.children[0].loc.start.offset, e.children[e.children.length - 1].loc.end.offset),
			loc: n.loc
		});
	}
}
function Jf(e, t) {
	let n = e;
	for (; jf.charCodeAt(n) !== t && n < jf.length - 1;) n++;
	return n;
}
function Yf(e, t) {
	let n = e;
	for (; jf.charCodeAt(n) !== t && n >= 0;) n--;
	return n;
}
var Xf = /* @__PURE__ */ new Set([
	"if",
	"else",
	"else-if",
	"for",
	"slot"
]);
function Zf({ tag: e, props: t }) {
	if (e === "template") {
		for (let e = 0; e < t.length; e++) if (t[e].type === 7 && Xf.has(t[e].name)) return !0;
	}
	return !1;
}
function Qf({ tag: e, props: t }) {
	if (kf.isCustomElement(e)) return !1;
	if (e === "component" || $f(e.charCodeAt(0)) || Qd(e) || kf.isBuiltInComponent && kf.isBuiltInComponent(e) || kf.isNativeTag && !kf.isNativeTag(e)) return !0;
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (n.type === 6) {
			if (n.name === "is" && n.value && (n.value.content.startsWith("vue:") || qd("COMPILER_IS_ON_ELEMENT", kf, n.loc))) return !0;
		} else if (n.name === "bind" && df(n.arg, "is") && qd("COMPILER_IS_ON_ELEMENT", kf, n.loc)) return !0;
	}
	return !1;
}
function $f(e) {
	return e > 64 && e < 91;
}
var ep = /\r\n/g;
function tp(e) {
	let t = kf.whitespace !== "preserve", n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.type === 2) if (If) i.content = i.content.replace(ep, "\n");
		else if (Tf(i.content)) {
			let a = e[r - 1] && e[r - 1].type, o = e[r + 1] && e[r + 1].type;
			!a || !o || t && (a === 3 && (o === 3 || o === 1) || a === 1 && (o === 3 || o === 1 && np(i.content))) ? (n = !0, e[r] = null) : i.content = " ";
		} else t && (i.content = rp(i.content));
	}
	return n ? e.filter(Boolean) : e;
}
function np(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n === 10 || n === 13) return !0;
	}
	return !1;
}
function rp(e) {
	let t = "", n = !1;
	for (let r = 0; r < e.length; r++) Bd(e.charCodeAt(r)) ? n ||= (t += " ", !0) : (t += e[r], n = !1);
	return t;
}
function ip(e) {
	(zf[0] || Af).children.push(e);
}
function ap(e, t) {
	return {
		start: Bf.getPos(e),
		end: t == null ? t : Bf.getPos(t),
		source: t == null ? t : Wf(e, t)
	};
}
function op(e) {
	return ap(e.start.offset, e.end.offset);
}
function sp(e, t) {
	e.end = Bf.getPos(t), e.source = Wf(e.start.offset, t);
}
function cp(e) {
	let t = {
		type: 6,
		name: e.rawName,
		nameLoc: ap(e.loc.start.offset, e.loc.start.offset + e.rawName.length),
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
function lp(e, t = !1, n, r = 0, i = 0) {
	return J(e, t, n, r);
}
function up(e, t, n) {
	kf.onError(Xd(e, ap(t, t), void 0, n));
}
function dp() {
	Bf.reset(), Mf = null, Y = null, Nf = "", Pf = -1, Ff = -1, zf.length = 0;
}
function fp(e, t) {
	if (dp(), jf = e, kf = v({}, Of), t) {
		let e;
		for (e in t) t[e] != null && (kf[e] = t[e]);
	}
	Bf.mode = kf.parseMode === "html" ? 1 : kf.parseMode === "sfc" ? 2 : 0, Bf.inXML = kf.ns === 1 || kf.ns === 2;
	let n = t && t.delimiters;
	n && (Bf.delimiterOpen = Hd(n[0]), Bf.delimiterClose = Hd(n[1]));
	let r = Af = Cd([], e);
	return Bf.parse(jf), r.loc = ap(0, e.length), r.children = tp(r.children), Af = null, r;
}
function pp(e, t) {
	hp(e, void 0, t, !!mp(e));
}
function mp(e) {
	let t = e.children.filter((e) => e.type !== 3);
	return t.length === 1 && t[0].type === 1 && !_f(t[0]) ? t[0] : null;
}
function hp(e, t, n, r = !1, i = !1) {
	let { children: a } = e, o = [];
	for (let t = 0; t < a.length; t++) {
		let s = a[t];
		if (s.type === 1 && s.tagType === 0) {
			let e = r ? 0 : gp(s, n);
			if (e > 0) {
				if (e >= 2) {
					s.codegenNode.patchFlag = -1, o.push(s);
					continue;
				}
			} else {
				let e = s.codegenNode;
				if (e.type === 13) {
					let t = e.patchFlag;
					if ((t === void 0 || t === 512 || t === 1) && yp(s, n) >= 2) {
						let t = bp(s);
						t && (e.props = n.hoist(t));
					}
					e.dynamicProps &&= n.hoist(e.dynamicProps);
				}
			}
		} else if (s.type === 12 && (r ? 0 : gp(s, n)) >= 2) {
			s.codegenNode.type === 14 && s.codegenNode.arguments.length > 0 && s.codegenNode.arguments.push("-1"), o.push(s);
			continue;
		}
		if (s.type === 1) {
			let t = s.tagType === 1;
			t && n.scopes.vSlot++, hp(s, e, n, !1, i), t && n.scopes.vSlot--;
		} else if (s.type === 11) hp(s, e, n, s.children.length === 1, !0);
		else if (s.type === 9) for (let t = 0; t < s.branches.length; t++) hp(s.branches[t], e, n, s.branches[t].children.length === 1, i);
	}
	let s = !1;
	if (o.length === a.length && e.type === 1) {
		if (e.tagType === 0 && e.codegenNode && e.codegenNode.type === 13 && S(e.codegenNode.children)) e.codegenNode.children = c(Td(e.codegenNode.children)), s = !0;
		else if (e.tagType === 1 && e.codegenNode && e.codegenNode.type === 13 && e.codegenNode.children && !S(e.codegenNode.children) && e.codegenNode.children.type === 15) {
			let t = l(e.codegenNode, "default");
			t && (t.returns = c(Td(t.returns)), s = !0);
		} else if (e.tagType === 3 && t && t.type === 1 && t.tagType === 1 && t.codegenNode && t.codegenNode.type === 13 && t.codegenNode.children && !S(t.codegenNode.children) && t.codegenNode.children.type === 15) {
			let n = lf(e, "slot", !0), r = n && n.arg && l(t.codegenNode, n.arg);
			r && (r.returns = c(Td(r.returns)), s = !0);
		}
	}
	if (!s) for (let e of o) e.codegenNode = n.cache(e.codegenNode);
	function c(e) {
		let t = n.cache(e);
		return t.needArraySpread = !0, t;
	}
	function l(e, t) {
		if (e.children && !S(e.children) && e.children.type === 15) {
			let n = e.children.properties.find((e) => e.key === t || e.key.content === t);
			return n && n.value;
		}
	}
	o.length && n.transformHoist && n.transformHoist(a, n, e);
}
function gp(e, t) {
	let { constantCache: n } = t;
	switch (e.type) {
		case 1:
			if (e.tagType !== 0) return 0;
			let r = n.get(e);
			if (r !== void 0) return r;
			let i = e.codegenNode;
			if (i.type !== 13 || i.isBlock && e.tag !== "svg" && e.tag !== "foreignObject" && e.tag !== "math") return 0;
			if (i.patchFlag === void 0) {
				let r = 3, a = yp(e, t);
				if (a === 0) return n.set(e, 0), 0;
				a < r && (r = a);
				for (let i = 0; i < e.children.length; i++) {
					let a = gp(e.children[i], t);
					if (a === 0) return n.set(e, 0), 0;
					a < r && (r = a);
				}
				if (r > 1) for (let i = 0; i < e.props.length; i++) {
					let a = e.props[i];
					if (a.type === 7 && a.name === "bind" && a.exp) {
						let i = gp(a.exp, t);
						if (i === 0) return n.set(e, 0), 0;
						i < r && (r = i);
					}
				}
				if (i.isBlock) {
					for (let t = 0; t < e.props.length; t++) if (e.props[t].type === 7) return n.set(e, 0), 0;
					t.removeHelper(Bu), t.removeHelper(Fd(t.inSSR, i.isComponent)), i.isBlock = !1, t.helper(Pd(t.inSSR, i.isComponent));
				}
				return n.set(e, r), r;
			} else return n.set(e, 0), 0;
		case 2:
		case 3: return 3;
		case 9:
		case 11:
		case 10: return 0;
		case 5:
		case 12: return gp(e.content, t);
		case 4: return e.constType;
		case 8:
			let a = 3;
			for (let n = 0; n < e.children.length; n++) {
				let r = e.children[n];
				if (O(r) || k(r)) continue;
				let i = gp(r, t);
				if (i === 0) return 0;
				i < a && (a = i);
			}
			return a;
		case 20: return 2;
		default: return 0;
	}
}
var _p = /* @__PURE__ */ new Set([
	id,
	ad,
	od,
	sd
]);
function vp(e, t) {
	if (e.type === 14 && !O(e.callee) && _p.has(e.callee)) {
		let n = e.arguments[0];
		if (n.type === 4) return gp(n, t);
		if (n.type === 14) return vp(n, t);
	}
	return 0;
}
function yp(e, t) {
	let n = 3, r = bp(e);
	if (r && r.type === 15) {
		let { properties: e } = r;
		for (let r = 0; r < e.length; r++) {
			let { key: i, value: a } = e[r], o = gp(i, t);
			if (o === 0) return o;
			o < n && (n = o);
			let s;
			if (s = a.type === 4 ? gp(a, t) : a.type === 14 ? vp(a, t) : 0, s === 0) return s;
			s < n && (n = s);
		}
	}
	return n;
}
function bp(e) {
	let t = e.codegenNode;
	if (t.type === 13) return t.props;
}
function xp(e, { filename: t = "", prefixIdentifiers: n = !1, hoistStatic: r = !1, hmr: i = !1, cacheHandlers: a = !1, nodeTransforms: o = [], directiveTransforms: s = {}, transformHoist: c = null, isBuiltInComponent: l = m, isCustomElement: u = m, expressionPlugins: d = [], scopeId: p = null, slotted: h = !0, ssr: g = !1, inSSR: _ = !1, ssrCssVars: v = "", bindingMetadata: y = f, inline: b = !1, isTS: x = !1, onError: S = Jd, onWarn: C = Yd, compatConfig: w }) {
	let T = t.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/), E = {
		filename: t,
		selfName: T && fe(le(T[1])),
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
		scopeId: p,
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
			let t = E.helpers.get(e) || 0;
			return E.helpers.set(e, t + 1), e;
		},
		removeHelper(e) {
			let t = E.helpers.get(e);
			if (t) {
				let n = t - 1;
				n ? E.helpers.set(e, n) : E.helpers.delete(e);
			}
		},
		helperString(e) {
			return `_${bd[E.helper(e)]}`;
		},
		replaceNode(e) {
			E.parent.children[E.childIndex] = E.currentNode = e;
		},
		removeNode(e) {
			let t = E.parent.children, n = e ? t.indexOf(e) : E.currentNode ? E.childIndex : -1;
			!e || e === E.currentNode ? (E.currentNode = null, E.onNodeRemoved()) : E.childIndex > n && (E.childIndex--, E.onNodeRemoved()), E.parent.children.splice(n, 1);
		},
		onNodeRemoved: m,
		addIdentifiers(e) {},
		removeIdentifiers(e) {},
		hoist(e) {
			O(e) && (e = J(e)), E.hoists.push(e);
			let t = J(`_hoisted_${E.hoists.length}`, !1, e.loc, 2);
			return t.hoisted = e, t;
		},
		cache(e, t = !1, n = !1) {
			let r = Md(E.cached.length, e, t, n);
			return E.cached.push(r), r;
		}
	};
	return E.filters = /* @__PURE__ */ new Set(), E;
}
function Sp(e, t) {
	let n = xp(e, t);
	Tp(e, n), t.hoistStatic && pp(e, n), t.ssr || Cp(e, n), e.helpers = /* @__PURE__ */ new Set([...n.helpers.keys()]), e.components = [...n.components], e.directives = [...n.directives], e.imports = n.imports, e.hoists = n.hoists, e.temps = n.temps, e.cached = n.cached, e.transformed = !0, e.filters = [...n.filters];
}
function Cp(e, t) {
	let { helper: n } = t, { children: r } = e;
	if (r.length === 1) {
		let n = mp(e);
		if (n && n.codegenNode) {
			let r = n.codegenNode;
			r.type === 13 && Id(r, t), e.codegenNode = r;
		} else e.codegenNode = r[0];
	} else r.length > 1 && (e.codegenNode = wd(t, n(Fu), void 0, e.children, 64, void 0, void 0, !0, void 0, !1));
}
function wp(e, t) {
	let n = 0, r = () => {
		n--;
	};
	for (; n < e.children.length; n++) {
		let i = e.children[n];
		O(i) || (t.grandParent = t.parent, t.parent = e, t.childIndex = n, t.onNodeRemoved = r, Tp(i, t));
	}
}
function Tp(e, t) {
	t.currentNode = e;
	let { nodeTransforms: n } = t, r = [];
	for (let i = 0; i < n.length; i++) {
		let a = n[i](e, t);
		if (a && (S(a) ? r.push(...a) : r.push(a)), t.currentNode) e = t.currentNode;
		else return;
	}
	switch (e.type) {
		case 3:
			t.ssr || t.helper(Gu);
			break;
		case 5:
			t.ssr || t.helper(nd);
			break;
		case 9:
			for (let n = 0; n < e.branches.length; n++) Tp(e.branches[n], t);
			break;
		case 10:
		case 11:
		case 1:
		case 0:
			wp(e, t);
			break;
	}
	t.currentNode = e;
	let i = r.length;
	for (; i--;) r[i]();
}
function Ep(e, t) {
	let n = O(e) ? (t) => t === e : (t) => e.test(t);
	return (e, r) => {
		if (e.type === 1) {
			let { props: i } = e;
			if (e.tagType === 3 && i.some(hf)) return;
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
var Dp = "/*@__PURE__*/", Op = (e) => `${bd[e]}: _${bd[e]}`;
function kp(e, { mode: t = "function", prefixIdentifiers: n = t === "module", sourceMap: r = !1, filename: i = "template.vue.html", scopeId: a = null, optimizeImports: o = !1, runtimeGlobalName: s = "Vue", runtimeModuleName: c = "vue", ssrRuntimeModuleName: l = "vue/server-renderer", ssr: u = !1, isTS: d = !1, inSSR: f = !1 }) {
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
			return `_${bd[e]}`;
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
function Ap(e, t = {}) {
	let n = kp(e, t);
	t.onContextCreated && t.onContextCreated(n);
	let { mode: r, push: i, prefixIdentifiers: a, indent: o, deindent: s, newline: c, scopeId: l, ssr: u } = n, d = Array.from(e.helpers), f = d.length > 0, p = !a && r !== "module";
	if (jp(e, n), i(`function ${u ? "ssrRender" : "render"}(${(u ? [
		"_ctx",
		"_push",
		"_parent",
		"_attrs"
	] : ["_ctx", "_cache"]).join(", ")}) {`), o(), p && (i("with (_ctx) {"), o(), f && (i(`const { ${d.map(Op).join(", ")} } = _Vue
`, -1), c())), e.components.length && (Mp(e.components, "component", n), (e.directives.length || e.temps > 0) && c()), e.directives.length && (Mp(e.directives, "directive", n), e.temps > 0 && c()), e.filters && e.filters.length && (c(), Mp(e.filters, "filter", n), c()), e.temps > 0) {
		i("let ");
		for (let t = 0; t < e.temps; t++) i(`${t > 0 ? ", " : ""}_temp${t}`);
	}
	return (e.components.length || e.directives.length || e.temps) && (i("\n", 0), c()), u || i("return "), e.codegenNode ? Ip(e.codegenNode, n) : i("null"), p && (s(), i("}")), s(), i("}"), {
		ast: e,
		code: n.code,
		preamble: "",
		map: n.map ? n.map.toJSON() : void 0
	};
}
function jp(e, t) {
	let { ssr: n, prefixIdentifiers: r, push: i, newline: a, runtimeModuleName: o, runtimeGlobalName: s, ssrRuntimeModuleName: c } = t, l = s, u = Array.from(e.helpers);
	u.length > 0 && (i(`const _Vue = ${l}
`, -1), e.hoists.length && i(`const { ${[
		Uu,
		Wu,
		Gu,
		Ku,
		qu
	].filter((e) => u.includes(e)).map(Op).join(", ")} } = _Vue
`, -1)), Np(e.hoists, t), a(), i("return ");
}
function Mp(e, t, { helper: n, push: r, newline: i, isTS: a }) {
	let o = n(t === "filter" ? Zu : t === "component" ? Ju : Xu);
	for (let n = 0; n < e.length; n++) {
		let s = e[n], c = s.endsWith("__self");
		c && (s = s.slice(0, -6)), r(`const ${Sf(s, t)} = ${o}(${JSON.stringify(s)}${c ? ", true" : ""})${a ? "!" : ""}`), n < e.length - 1 && i();
	}
}
function Np(e, t) {
	if (!e.length) return;
	t.pure = !0;
	let { push: n, newline: r } = t;
	r();
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a && (n(`const _hoisted_${i + 1} = `), Ip(a, t), r());
	}
	t.pure = !1;
}
function Pp(e, t) {
	let n = e.length > 3 || !1;
	t.push("["), n && t.indent(), Fp(e, t, n), n && t.deindent(), t.push("]");
}
function Fp(e, t, n = !1, r = !0) {
	let { push: i, newline: a } = t;
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		O(s) ? i(s, -3) : S(s) ? Pp(s, t) : Ip(s, t), o < e.length - 1 && (n ? (r && i(","), a()) : r && i(", "));
	}
}
function Ip(e, t) {
	if (O(e)) {
		t.push(e, -3);
		return;
	}
	if (k(e)) {
		t.push(t.helper(e));
		return;
	}
	switch (e.type) {
		case 1:
		case 9:
		case 11:
			Ip(e.codegenNode, t);
			break;
		case 2:
			Lp(e, t);
			break;
		case 4:
			Rp(e, t);
			break;
		case 5:
			zp(e, t);
			break;
		case 12:
			Ip(e.codegenNode, t);
			break;
		case 8:
			Bp(e, t);
			break;
		case 3:
			Hp(e, t);
			break;
		case 13:
			Up(e, t);
			break;
		case 14:
			Gp(e, t);
			break;
		case 15:
			Kp(e, t);
			break;
		case 17:
			qp(e, t);
			break;
		case 18:
			Jp(e, t);
			break;
		case 19:
			Yp(e, t);
			break;
		case 20:
			Xp(e, t);
			break;
		case 21:
			Fp(e.body, t, !0, !1);
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
function Lp(e, t) {
	t.push(JSON.stringify(e.content), -3, e);
}
function Rp(e, t) {
	let { content: n, isStatic: r } = e;
	t.push(r ? JSON.stringify(n) : n, -3, e);
}
function zp(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Dp), n(`${r(nd)}(`), Ip(e.content, t), n(")");
}
function Bp(e, t) {
	for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		O(r) ? t.push(r, -3) : Ip(r, t);
	}
}
function Vp(e, t) {
	let { push: n } = t;
	e.type === 8 ? (n("["), Bp(e, t), n("]")) : e.isStatic ? n(ef(e.content) ? e.content : JSON.stringify(e.content), -2, e) : n(`[${e.content}]`, -3, e);
}
function Hp(e, t) {
	let { push: n, helper: r, pure: i } = t;
	i && n(Dp), n(`${r(Gu)}(${JSON.stringify(e.content)})`, -3, e);
}
function Up(e, t) {
	let { push: n, helper: r, pure: i } = t, { tag: a, props: o, children: s, patchFlag: c, dynamicProps: l, directives: u, isBlock: d, disableTracking: f, isComponent: p } = e, m;
	c && (m = String(c)), u && n(r(Qu) + "("), d && n(`(${r(Bu)}(${f ? "true" : ""}), `), i && n(Dp), n(r(d ? Fd(t.inSSR, p) : Pd(t.inSSR, p)) + "(", -2, e), Fp(Wp([
		a,
		o,
		s,
		m,
		l
	]), t), n(")"), d && n(")"), u && (n(", "), Ip(u, t), n(")"));
}
function Wp(e) {
	let t = e.length;
	for (; t-- && e[t] == null;);
	return e.slice(0, t + 1).map((e) => e || "null");
}
function Gp(e, t) {
	let { push: n, helper: r, pure: i } = t, a = O(e.callee) ? e.callee : r(e.callee);
	i && n(Dp), n(a + "(", -2, e), Fp(e.arguments, t), n(")");
}
function Kp(e, t) {
	let { push: n, indent: r, deindent: i, newline: a } = t, { properties: o } = e;
	if (!o.length) {
		n("{}", -2, e);
		return;
	}
	let s = o.length > 1 || !1;
	n(s ? "{" : "{ "), s && r();
	for (let e = 0; e < o.length; e++) {
		let { key: r, value: i } = o[e];
		Vp(r, t), n(": "), Ip(i, t), e < o.length - 1 && (n(","), a());
	}
	s && i(), n(s ? "}" : " }");
}
function qp(e, t) {
	Pp(e.elements, t);
}
function Jp(e, t) {
	let { push: n, indent: r, deindent: i } = t, { params: a, returns: o, body: s, newline: c, isSlot: l } = e;
	l && n(`_${bd[hd]}(`), n("(", -2, e), S(a) ? Fp(a, t) : a && Ip(a, t), n(") => "), (c || s) && (n("{"), r()), o ? (c && n("return "), S(o) ? Pp(o, t) : Ip(o, t)) : s && Ip(s, t), (c || s) && (i(), n("}")), l && (e.isNonScopedSlot && n(", undefined, true"), n(")"));
}
function Yp(e, t) {
	let { test: n, consequent: r, alternate: i, newline: a } = e, { push: o, indent: s, deindent: c, newline: l } = t;
	if (n.type === 4) {
		let e = !ef(n.content);
		e && o("("), Rp(n, t), e && o(")");
	} else o("("), Ip(n, t), o(")");
	a && s(), t.indentLevel++, a || o(" "), o("? "), Ip(r, t), t.indentLevel--, a && l(), a || o(" "), o(": ");
	let u = i.type === 19;
	u || t.indentLevel++, Ip(i, t), u || t.indentLevel--, a && c(!0);
}
function Xp(e, t) {
	let { push: n, helper: r, indent: i, deindent: a, newline: o } = t, { needPauseTracking: s, needArraySpread: c } = e;
	c && n("[...("), n(`_cache[${e.index}] || (`), s && (i(), n(`${r(fd)}(-1`), e.inVOnce && n(", true"), n("),"), o(), n("(")), n(`_cache[${e.index}] = `), Ip(e.value, t), s && (n(`).cacheIndex = ${e.index},`), o(), n(`${r(fd)}(1),`), o(), n(`_cache[${e.index}]`), a()), n(")"), c && n(")]");
}
RegExp("\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b");
var Zp = Ep(/^(?:if|else|else-if)$/, (e, t, n) => Qp(e, t, n, (e, t, r) => {
	let i = n.parent.children, a = i.indexOf(e), o = 0;
	for (; a-- >= 0;) {
		let e = i[a];
		e && e.type === 9 && (o += e.branches.length);
	}
	return () => {
		if (r) e.codegenNode = em(t, o, n);
		else {
			let r = nm(e.codegenNode);
			r.alternate = em(t, o + e.branches.length - 1, n);
		}
	};
}));
function Qp(e, t, n, r) {
	if (t.name !== "else" && (!t.exp || !t.exp.content.trim())) {
		let r = t.exp ? t.exp.loc : e.loc;
		n.onError(Xd(28, t.loc)), t.exp = J("true", !1, r);
	}
	if (t.name === "if") {
		let i = $p(e, t), a = {
			type: 9,
			loc: op(e.loc),
			branches: [i]
		};
		if (n.replaceNode(a), r) return r(a, i, !0);
	} else {
		let i = n.parent.children, a = i.indexOf(e);
		for (; a-- >= -1;) {
			let o = i[a];
			if (o && Df(o)) {
				n.removeNode(o);
				continue;
			}
			if (o && o.type === 9) {
				(t.name === "else-if" || t.name === "else") && o.branches[o.branches.length - 1].condition === void 0 && n.onError(Xd(30, e.loc)), n.removeNode();
				let i = $p(e, t);
				o.branches.push(i);
				let a = r && r(o, i, !1);
				Tp(i, n), a && a(), n.currentNode = null;
			} else n.onError(Xd(30, e.loc));
			break;
		}
	}
}
function $p(e, t) {
	let n = e.tagType === 3;
	return {
		type: 10,
		loc: e.loc,
		condition: t.name === "else" ? void 0 : t.exp,
		children: n && !lf(e, "for") ? e.children : [e],
		userKey: uf(e, "key"),
		isTemplateIf: n
	};
}
function em(e, t, n) {
	return e.condition ? jd(e.condition, tm(e, t, n), kd(n.helper(Gu), ["\"\"", "true"])) : tm(e, t, n);
}
function tm(e, t, n) {
	let { helper: r } = n, i = Dd("key", J(`${t}`, !1, Sd, 2)), { children: a } = e, o = a[0];
	if (a.length !== 1 || o.type !== 1) if (a.length === 1 && o.type === 11) {
		let e = o.codegenNode;
		return bf(e, i, n), e;
	} else return wd(n, r(Fu), Ed([i]), a, 64, void 0, void 0, !0, !1, !1, e.loc);
	else {
		let e = o.codegenNode, t = Cf(e);
		return t.type === 13 && Id(t, n), bf(t, i, n), e;
	}
}
function nm(e) {
	for (;;) if (e.type === 19) if (e.alternate.type === 19) e = e.alternate;
	else return e;
	else e.type === 20 && (e = e.value);
}
var rm = Ep("for", (e, t, n) => {
	let { helper: r, removeHelper: i } = n;
	return im(e, t, n, (t) => {
		let a = kd(r($u), [t.source]), o = gf(e), s = lf(e, "memo"), c = uf(e, "key", !1, !0);
		c && c.type;
		let l = c && (c.type === 6 ? c.value ? J(c.value.content, !0) : void 0 : c.exp), u = l ? Dd("key", l) : null, d = t.source.type === 4 && t.source.constType > 0, f = d ? 64 : c ? 128 : 256;
		return t.codegenNode = wd(n, r(Fu), void 0, a, f, void 0, void 0, !0, !d, !1, e.loc), () => {
			let c, { children: f } = t, p = f.length !== 1 || f[0].type !== 1, m = _f(e) ? e : o && e.children.length === 1 && _f(e.children[0]) ? e.children[0] : null;
			if (m ? (c = m.codegenNode, o && u && bf(c, u, n)) : p ? c = wd(n, r(Fu), u ? Ed([u]) : void 0, e.children, 64, void 0, void 0, !0, void 0, !1) : (c = f[0].codegenNode, o && u && bf(c, u, n), c.isBlock !== !d && (c.isBlock ? (i(Bu), i(Fd(n.inSSR, c.isComponent))) : i(Pd(n.inSSR, c.isComponent))), c.isBlock = !d, c.isBlock ? (r(Bu), r(Fd(n.inSSR, c.isComponent))) : r(Pd(n.inSSR, c.isComponent))), s) {
				let e = Ad(om(t.parseResult, [J("_cached")]));
				e.body = Nd([
					Od([
						"const _memo = (",
						s.exp,
						")"
					]),
					Od([
						"if (_cached && _cached.el",
						...l ? [" && _cached.key === ", l] : [],
						` && ${n.helperString(yd)}(_cached, _memo)) return _cached`
					]),
					Od(["const _item = ", c]),
					J("_item.memo = _memo"),
					J("return _item")
				]), a.arguments.push(e, J("_cache"), J(String(n.cached.length))), n.cached.push(null);
			} else a.arguments.push(Ad(om(t.parseResult), c, !0));
		};
	});
});
function im(e, t, n, r) {
	if (!t.exp) {
		n.onError(Xd(31, t.loc));
		return;
	}
	let i = t.forParseResult;
	if (!i) {
		n.onError(Xd(32, t.loc));
		return;
	}
	am(i, n);
	let { addIdentifiers: a, removeIdentifiers: o, scopes: s } = n, { source: c, value: l, key: u, index: d } = i, f = {
		type: 11,
		loc: t.loc,
		source: c,
		valueAlias: l,
		keyAlias: u,
		objectIndexAlias: d,
		parseResult: i,
		children: gf(e) ? e.children : [e]
	};
	n.replaceNode(f), s.vFor++;
	let p = r && r(f);
	return () => {
		s.vFor--, p && p();
	};
}
function am(e, t) {
	e.finalized ||= !0;
}
function om({ value: e, key: t, index: n }, r = []) {
	return sm([
		e,
		t,
		n,
		...r
	]);
}
function sm(e) {
	let t = e.length;
	for (; t-- && !e[t];);
	return e.slice(0, t + 1).map((e, t) => e || J("_".repeat(t + 1), !1));
}
var cm = J("undefined", !1), lm = (e, t) => {
	if (e.type === 1 && (e.tagType === 1 || e.tagType === 3)) {
		let n = lf(e, "slot");
		if (n) return n.exp, t.scopes.vSlot++, () => {
			t.scopes.vSlot--;
		};
	}
}, um = (e, t, n, r) => Ad(e, n, !1, !0, n.length ? n[0].loc : r);
function dm(e, t, n = um) {
	t.helper(hd);
	let { children: r, loc: i } = e, a = [], o = [], s = t.scopes.vSlot > 0 || t.scopes.vFor > 0, c = lf(e, "slot", !0);
	if (c) {
		let { arg: e, exp: t } = c;
		e && !Zd(e) && (s = !0), a.push(Dd(e || J("default", !0), n(t, void 0, r, i)));
	}
	let l = !1, u = !1, d = [], f = /* @__PURE__ */ new Set(), p = 0;
	for (let e = 0; e < r.length; e++) {
		let i = r[e], m;
		if (!gf(i) || !(m = lf(i, "slot", !0))) {
			i.type !== 3 && d.push(i);
			continue;
		}
		if (c) {
			t.onError(Xd(37, m.loc));
			break;
		}
		l = !0;
		let { children: h, loc: g } = i, { arg: _ = J("default", !0), exp: v, loc: y } = m, b;
		Zd(_) ? b = _ ? _.content : "default" : s = !0;
		let x = lf(i, "for"), S = n(v, x, h, g), C, w;
		if (C = lf(i, "if")) s = !0, o.push(jd(C.exp, fm(_, S, p++), cm));
		else if (w = lf(i, /^else(?:-if)?$/, !0)) {
			let n = e, i;
			for (; n-- && (i = r[n], Df(i)););
			if (i && gf(i) && lf(i, /^(?:else-)?if$/)) {
				let e = o[o.length - 1];
				for (; e.alternate.type === 19;) e = e.alternate;
				e.alternate = w.exp ? jd(w.exp, fm(_, S, p++), cm) : fm(_, S, p++);
			} else t.onError(Xd(30, w.loc));
		} else if (x) {
			s = !0;
			let e = x.forParseResult;
			e ? (am(e, t), o.push(kd(t.helper($u), [e.source, Ad(om(e), fm(_, S), !0)]))) : t.onError(Xd(32, x.loc));
		} else {
			if (b) {
				if (f.has(b)) {
					t.onError(Xd(38, y));
					continue;
				}
				f.add(b), b === "default" && (u = !0);
			}
			a.push(Dd(_, S));
		}
	}
	if (!c) {
		let e = (e, r) => {
			let a = n(e, void 0, r, i);
			return t.compatConfig && (a.isNonScopedSlot = !0), Dd("default", a);
		};
		l ? d.length && !d.every(Ef) && (u ? t.onError(Xd(39, d[0].loc)) : a.push(e(void 0, d))) : a.push(e(void 0, r));
	}
	let m = s ? 2 : pm(e.children) ? 3 : 1, h = Ed(a.concat(Dd("_", J(m + "", !1))), i);
	return o.length && (h = kd(t.helper(td), [h, Td(o)])), {
		slots: h,
		hasDynamicSlots: s
	};
}
function fm(e, t, n) {
	let r = [Dd("name", e), Dd("fn", t)];
	return n != null && r.push(Dd("key", J(String(n), !0))), Ed(r);
}
function pm(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		switch (n.type) {
			case 1:
				if (n.tagType === 2 || pm(n.children)) return !0;
				break;
			case 9:
				if (pm(n.branches)) return !0;
				break;
			case 10:
			case 11:
				if (pm(n.children)) return !0;
				break;
		}
	}
	return !1;
}
var mm = /* @__PURE__ */ new WeakMap(), hm = (e, t) => function() {
	if (e = t.currentNode, !(e.type === 1 && (e.tagType === 0 || e.tagType === 1))) return;
	let { tag: n, props: r } = e, i = e.tagType === 1, a = i ? gm(e, t) : `"${n}"`, o = A(a) && a.callee === Yu, s, c, l = 0, u, d, f, p = o || a === Iu || a === Lu || !i && (n === "svg" || n === "foreignObject" || n === "math");
	if (r.length > 0) {
		let n = _m(e, t, void 0, i, o);
		s = n.props, l = n.patchFlag, d = n.dynamicPropNames;
		let r = n.directives;
		f = r && r.length ? Td(r.map((e) => bm(e, t))) : void 0, n.shouldUseBlock && (p = !0);
	}
	if (e.children.length > 0) if (a === Ru && (p = !0, l |= 1024), i && a !== Iu && a !== Ru) {
		let { slots: n, hasDynamicSlots: r } = dm(e, t);
		c = n, r && (l |= 1024);
	} else if (e.children.length === 1 && a !== Iu) {
		let n = e.children[0], r = n.type, i = r === 5 || r === 8;
		i && gp(n, t) === 0 && (l |= 1), c = i || r === 2 ? n : e.children;
	} else c = e.children;
	d && d.length && (u = xm(d)), e.codegenNode = wd(t, a, s, c, l === 0 ? void 0 : l, u, f, !!p, !1, i, e.loc);
};
function gm(e, t, n = !1) {
	let { tag: r } = e, i = Sm(r), a = uf(e, "is", !1, !0);
	if (a) if (i || Kd("COMPILER_IS_ON_ELEMENT", t)) {
		let e;
		if (a.type === 6 ? e = a.value && J(a.value.content, !0) : (e = a.exp, e ||= J("is", !1, a.arg.loc)), e) return kd(t.helper(Yu), [e]);
	} else a.type === 6 && a.value.content.startsWith("vue:") && (r = a.value.content.slice(4));
	let o = Qd(r) || t.isBuiltInComponent(r);
	return o ? (n || t.helper(o), o) : (t.helper(Ju), t.components.add(r), Sf(r, "component"));
}
function _m(e, t, n = e.props, r, i, a = !1) {
	let { tag: o, loc: s, children: c } = e, l = [], u = [], d = [], f = c.length > 0, p = !1, m = 0, h = !1, _ = !1, v = !1, y = !1, b = !1, x = !1, S = [], C = (e) => {
		l.length && (u.push(Ed(vm(l), s)), l = []), e && u.push(e);
	}, w = () => {
		t.scopes.vFor > 0 && l.push(Dd(J("ref_for", !0), J("true")));
	}, T = ({ key: e, value: n }) => {
		if (Zd(e)) {
			let a = e.content, o = g(a);
			if (o && (!r || i) && a.toLowerCase() !== "onclick" && a !== "onUpdate:modelValue" && !j(a) && (y = !0), o && j(a) && (x = !0), o && n.type === 14 && (n = n.arguments[0]), n.type === 20 || (n.type === 4 || n.type === 8) && gp(n, t) > 0) return;
			a === "ref" ? h = !0 : a === "class" ? _ = !0 : a === "style" ? v = !0 : a !== "key" && !S.includes(a) && S.push(a), r && (a === "class" || a === "style") && !S.includes(a) && S.push(a);
		} else b = !0;
	};
	for (let i = 0; i < n.length; i++) {
		let c = n[i];
		if (c.type === 6) {
			let { loc: e, name: n, nameLoc: r, value: i } = c;
			if (n === "ref" && (h = !0, w()), n === "is" && (Sm(o) || i && i.content.startsWith("vue:") || Kd("COMPILER_IS_ON_ELEMENT", t))) continue;
			l.push(Dd(J(n, !0, r), J(i ? i.content : "", !0, i ? i.loc : e)));
		} else {
			let { name: n, arg: i, exp: h, loc: g, modifiers: _ } = c, v = n === "bind", y = n === "on";
			if (n === "slot") {
				r || t.onError(Xd(40, g));
				continue;
			}
			if (n === "once" || n === "memo" || n === "is" || v && df(i, "is") && (Sm(o) || Kd("COMPILER_IS_ON_ELEMENT", t)) || y && a) continue;
			if ((v && df(i, "key") || y && f && df(i, "vue:before-update")) && (p = !0), v && df(i, "ref") && w(), !i && (v || y)) {
				if (b = !0, h) if (v) {
					if (C(), Kd("COMPILER_V_BIND_OBJECT_ORDER", t)) {
						u.unshift(h);
						continue;
					}
					w(), C(), u.push(h);
				} else C({
					type: 14,
					loc: g,
					callee: t.helper(cd),
					arguments: r ? [h] : [h, "true"]
				});
				else t.onError(Xd(v ? 34 : 35, g));
				continue;
			}
			v && _.some((e) => e.content === "prop") && (m |= 32);
			let x = t.directiveTransforms[n];
			if (x) {
				let { props: n, needRuntime: r } = x(c, e, t);
				!a && n.forEach(T), y && i && !Zd(i) ? C(Ed(n, s)) : l.push(...n), r && (d.push(c), k(r) && mm.set(c, r));
			} else oe(n) || (d.push(c), f && (p = !0));
		}
	}
	let E;
	if (u.length ? (C(), E = u.length > 1 ? kd(t.helper(rd), u, s) : u[0]) : l.length && (E = Ed(vm(l), s)), b ? m |= 16 : (_ && !r && (m |= 2), v && !r && (m |= 4), S.length && (m |= 8), y && (m |= 32)), !p && (m === 0 || m === 32) && (h || x || d.length > 0) && (m |= 512), !t.inSSR && E) switch (E.type) {
		case 15:
			let e = -1, n = -1, r = !1;
			for (let t = 0; t < E.properties.length; t++) {
				let i = E.properties[t].key;
				Zd(i) ? i.content === "class" ? e = t : i.content === "style" && (n = t) : i.isHandlerKey || (r = !0);
			}
			let i = E.properties[e], a = E.properties[n];
			r ? E = kd(t.helper(od), [E]) : (i && !Zd(i.value) && (i.value = kd(t.helper(id), [i.value])), a && (v || a.value.type === 4 && a.value.content.trim()[0] === "[" || a.value.type === 17) && (a.value = kd(t.helper(ad), [a.value])));
			break;
		case 14: break;
		default:
			E = kd(t.helper(od), [kd(t.helper(sd), [E])]);
			break;
	}
	return {
		props: E,
		directives: d,
		patchFlag: m,
		dynamicPropNames: S,
		shouldUseBlock: p
	};
}
function vm(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (i.key.type === 8 || !i.key.isStatic) {
			n.push(i);
			continue;
		}
		let a = i.key.content, o = t.get(a);
		o ? (a === "style" || a === "class" || g(a)) && ym(o, i) : (t.set(a, i), n.push(i));
	}
	return n;
}
function ym(e, t) {
	e.value.type === 17 ? e.value.elements.push(t.value) : e.value = Td([e.value, t.value], e.loc);
}
function bm(e, t) {
	let n = [], r = mm.get(e);
	r ? n.push(t.helperString(r)) : (t.helper(Xu), t.directives.add(e.name), n.push(Sf(e.name, "directive")));
	let { loc: i } = e;
	if (e.exp && n.push(e.exp), e.arg && (e.exp || n.push("void 0"), n.push(e.arg)), Object.keys(e.modifiers).length) {
		e.arg || (e.exp || n.push("void 0"), n.push("void 0"));
		let t = J("true", !1, i);
		n.push(Ed(e.modifiers.map((e) => Dd(e, t)), i));
	}
	return Td(n, e.loc);
}
function xm(e) {
	let t = "[";
	for (let n = 0, r = e.length; n < r; n++) t += JSON.stringify(e[n]), n < r - 1 && (t += ", ");
	return t + "]";
}
function Sm(e) {
	return e === "component" || e === "Component";
}
var Cm = (e, t) => {
	if (_f(e)) {
		let { children: n, loc: r } = e, { slotName: i, slotProps: a } = wm(e, t), o = [
			t.prefixIdentifiers ? "_ctx.$slots" : "$slots",
			i,
			"{}",
			"undefined",
			"true"
		], s = 2;
		a && (o[2] = a, s = 3), n.length && (o[3] = Ad([], n, !1, !1, r), s = 4), t.scopeId && !t.slotted && (s = 5), o.splice(s), e.codegenNode = kd(t.helper(ed), o, r);
	}
};
function wm(e, t) {
	let n = "\"default\"", r, i = [];
	for (let t = 0; t < e.props.length; t++) {
		let r = e.props[t];
		r.type === 6 ? r.value && (r.name === "name" ? n = JSON.stringify(r.value.content) : (r.name = le(r.name), i.push(r))) : r.name === "bind" && df(r.arg, "name") ? r.exp ? n = r.exp : r.arg && r.arg.type === 4 && (n = r.exp = J(le(r.arg.content), !1, r.arg.loc)) : (r.name === "bind" && r.arg && Zd(r.arg) && (r.arg.content = le(r.arg.content)), i.push(r));
	}
	if (i.length > 0) {
		let { props: n, directives: a } = _m(e, t, i, !1, !1);
		r = n, a.length && t.onError(Xd(36, a[0].loc));
	}
	return {
		slotName: n,
		slotProps: r
	};
}
var Tm = (e, t, n, r) => {
	let { loc: i, modifiers: a, arg: o } = e;
	!e.exp && !a.length && n.onError(Xd(35, i));
	let s;
	if (o.type === 4) if (o.isStatic) {
		let e = o.content;
		e.startsWith("vue:") && (e = `vnode-${e.slice(4)}`), s = J(t.tagType !== 0 || e.startsWith("vnode") || !/[A-Z]/.test(e) ? pe(le(e)) : `on:${e}`, !0, o.loc);
	} else s = Od([
		`${n.helperString(dd)}(`,
		o,
		")"
	]);
	else s = o, s.children.unshift(`${n.helperString(dd)}(`), s.children.push(")");
	let c = e.exp;
	c && !c.content.trim() && (c = void 0);
	let l = n.cacheHandlers && !c && !n.inVOnce;
	if (c) {
		let e = of(c), t = !(e || cf(c)), n = c.content.includes(";");
		(t || l && e) && (c = Od([
			`${t ? "$event" : "(...args)"} => ${n ? "{" : "("}`,
			c,
			n ? "}" : ")"
		]));
	}
	let u = { props: [Dd(s, c || J("() => {}", !1, i))] };
	return r && (u = r(u)), l && (u.props[0].value = n.cache(u.props[0].value)), u.props.forEach((e) => e.key.isHandlerKey = !0), u;
}, Em = (e, t, n) => {
	let { modifiers: r, loc: i } = e, a = e.arg, { exp: o } = e;
	return o && o.type === 4 && !o.content.trim() && (o = void 0), a.type === 4 ? a.isStatic || (a.content = a.content ? `${a.content} || ""` : "\"\"") : (a.children.unshift("("), a.children.push(") || \"\"")), r.some((e) => e.content === "camel") && (a.type === 4 ? a.isStatic ? a.content = le(a.content) : a.content = `${n.helperString(ld)}(${a.content})` : (a.children.unshift(`${n.helperString(ld)}(`), a.children.push(")"))), n.inSSR || (r.some((e) => e.content === "prop") && Dm(a, "."), r.some((e) => e.content === "attr") && Dm(a, "^")), { props: [Dd(a, o)] };
}, Dm = (e, t) => {
	e.type === 4 ? e.isStatic ? e.content = t + e.content : e.content = `\`${t}\${${e.content}}\`` : (e.children.unshift(`'${t}' + (`), e.children.push(")"));
}, Om = (e, t) => {
	if (e.type === 0 || e.type === 1 || e.type === 11 || e.type === 10) return () => {
		let n = e.children, r, i = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			if (pf(t)) {
				i = !0;
				for (let i = e + 1; i < n.length; i++) {
					let a = n[i];
					if (pf(a)) r ||= n[e] = Od([t], t.loc), r.children.push(" + ", a), n.splice(i, 1), i--;
					else {
						r = void 0;
						break;
					}
				}
			}
		}
		if (!(!i || n.length === 1 && (e.type === 0 || e.type === 1 && e.tagType === 0 && !e.props.find((e) => e.type === 7 && !t.directiveTransforms[e.name]) && e.tag !== "template"))) for (let e = 0; e < n.length; e++) {
			let r = n[e];
			if (pf(r) || r.type === 8) {
				let i = [];
				(r.type !== 2 || r.content !== " ") && i.push(r), !t.ssr && gp(r, t) === 0 && i.push("1"), n[e] = {
					type: 12,
					content: r,
					loc: r.loc,
					codegenNode: kd(t.helper(Ku), i)
				};
			}
		}
	};
}, km = /* @__PURE__ */ new WeakSet(), Am = (e, t) => {
	if (e.type === 1 && lf(e, "once", !0)) return km.has(e) || t.inVOnce || t.inSSR ? void 0 : (km.add(e), t.inVOnce = !0, t.helper(fd), () => {
		t.inVOnce = !1;
		let e = t.currentNode;
		e.codegenNode &&= t.cache(e.codegenNode, !0, !0);
	});
}, jm = (e, t, n) => {
	let { exp: r, arg: i } = e;
	if (!r) return n.onError(Xd(41, e.loc)), Mm();
	let a = r.loc.source.trim(), o = r.type === 4 ? r.content : a, s = n.bindingMetadata[a];
	if (s === "props" || s === "props-aliased") return n.onError(Xd(44, r.loc)), Mm();
	if (s === "literal-const" || s === "setup-const") return n.onError(Xd(45, r.loc)), Mm();
	if (!o.trim() || !of(r)) return n.onError(Xd(42, r.loc)), Mm();
	let c = i || J("modelValue", !0), l = i ? Zd(i) ? `onUpdate:${le(i.content)}` : Od(["\"onUpdate:\" + ", i]) : "onUpdate:modelValue", u;
	u = Od([
		`${n.isTS ? "($event: any)" : "$event"} => ((`,
		r,
		") = $event)"
	]);
	let d = [Dd(c, e.exp), Dd(l, u)];
	if (e.modifiers.length && t.tagType === 1) {
		let t = e.modifiers.map((e) => e.content).map((e) => (ef(e) ? e : JSON.stringify(e)) + ": true").join(", "), n = i ? Zd(i) ? `${i.content}Modifiers` : Od([i, " + \"Modifiers\""]) : "modelModifiers";
		d.push(Dd(n, J(`{ ${t} }`, !1, e.loc, 2)));
	}
	return Mm(d);
};
function Mm(e = []) {
	return { props: e };
}
var Nm = /[\w).+\-_$\]]/, Pm = (e, t) => {
	Kd("COMPILER_FILTERS", t) && (e.type === 5 ? Fm(e.content, t) : e.type === 1 && e.props.forEach((e) => {
		e.type === 7 && e.name !== "for" && e.exp && Fm(e.exp, t);
	}));
};
function Fm(e, t) {
	if (e.type === 4) Im(e, t);
	else for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n];
		typeof r == "object" && (r.type === 4 ? Im(r, t) : r.type === 8 ? Fm(r, t) : r.type === 5 && Fm(r.content, t));
	}
}
function Im(e, t) {
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
			(!t || !Nm.test(t)) && (o = !0);
		}
	}
	m === void 0 ? m = n.slice(0, p).trim() : u !== 0 && g();
	function g() {
		h.push(n.slice(u, p).trim()), u = p + 1;
	}
	if (h.length) {
		for (p = 0; p < h.length; p++) m = Lm(m, h[p], t);
		e.content = m, e.ast = void 0;
	}
}
function Lm(e, t, n) {
	n.helper(Zu);
	let r = t.indexOf("(");
	if (r < 0) return n.filters.add(t), `${Sf(t, "filter")}(${e})`;
	{
		let i = t.slice(0, r), a = t.slice(r + 1);
		return n.filters.add(i), `${Sf(i, "filter")}(${e}${a === ")" ? a : "," + a}`;
	}
}
var Rm = /* @__PURE__ */ new WeakSet(), zm = (e, t) => {
	if (e.type === 1) {
		let n = lf(e, "memo");
		return !n || Rm.has(e) || t.inSSR ? void 0 : (Rm.add(e), () => {
			let r = e.codegenNode || t.currentNode.codegenNode;
			r && r.type === 13 && (e.tagType !== 1 && Id(r, t), e.codegenNode = kd(t.helper(vd), [
				n.exp,
				Ad(void 0, r),
				"_cache",
				String(t.cached.length)
			]), t.cached.push(null));
		});
	}
}, Bm = (e, t) => {
	if (e.type === 1) {
		for (let n of e.props) if (n.type === 7 && n.name === "bind" && (!n.exp || n.exp.type === 4 && !n.exp.content.trim()) && n.arg) {
			let e = n.arg;
			if (e.type !== 4 || !e.isStatic) t.onError(Xd(53, e.loc)), n.exp = J("", !0, e.loc);
			else {
				let t = le(e.content);
				(tf.test(t[0]) || t[0] === "-") && (n.exp = J(t, !1, e.loc));
			}
		}
	}
};
function Vm(e) {
	return [[
		Bm,
		Am,
		Zp,
		zm,
		rm,
		Pm,
		Cm,
		hm,
		lm,
		Om
	], {
		on: Tm,
		bind: Em,
		model: jm
	}];
}
function Hm(e, t = {}) {
	let n = t.onError || Jd, r = t.mode === "module";
	t.prefixIdentifiers === !0 ? n(Xd(48)) : r && n(Xd(49)), t.cacheHandlers && n(Xd(50)), t.scopeId && !r && n(Xd(51));
	let i = v({}, t, { prefixIdentifiers: !1 }), a = O(e) ? fp(e, i) : e, [o, s] = Vm();
	return Sp(a, v({}, i, {
		nodeTransforms: [...o, ...t.nodeTransforms || []],
		directiveTransforms: v({}, s, t.directiveTransforms || {})
	})), Ap(a, i);
}
var Um = () => ({ props: [] }), Wm = /* @__PURE__ */ Symbol(""), Gm = /* @__PURE__ */ Symbol(""), Km = /* @__PURE__ */ Symbol(""), qm = /* @__PURE__ */ Symbol(""), Jm = /* @__PURE__ */ Symbol(""), Ym = /* @__PURE__ */ Symbol(""), Xm = /* @__PURE__ */ Symbol(""), Zm = /* @__PURE__ */ Symbol(""), Qm = /* @__PURE__ */ Symbol(""), $m = /* @__PURE__ */ Symbol("");
xd({
	[Wm]: "vModelRadio",
	[Gm]: "vModelCheckbox",
	[Km]: "vModelText",
	[qm]: "vModelSelect",
	[Jm]: "vModelDynamic",
	[Ym]: "withModifiers",
	[Xm]: "withKeys",
	[Zm]: "vShow",
	[Qm]: "Transition",
	[$m]: "TransitionGroup"
});
var eh;
function th(e, t = !1) {
	return eh ||= document.createElement("div"), t ? (eh.innerHTML = `<div foo="${e.replace(/"/g, "&quot;")}">`, eh.children[0].getAttribute("foo")) : (eh.innerHTML = e, eh.textContent);
}
var nh = {
	parseMode: "html",
	isVoidTag: Fe,
	isNativeTag: (e) => Me(e) || Ne(e) || Pe(e),
	isPreTag: (e) => e === "pre",
	isIgnoreNewlineTag: (e) => e === "pre" || e === "textarea",
	decodeEntities: th,
	isBuiltInComponent: (e) => {
		if (e === "Transition" || e === "transition") return Qm;
		if (e === "TransitionGroup" || e === "transition-group") return $m;
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
}, rh = (e) => {
	e.type === 1 && e.props.forEach((t, n) => {
		t.type === 6 && t.name === "style" && t.value && (e.props[n] = {
			type: 7,
			name: "bind",
			arg: J("style", !0, t.loc),
			exp: ih(t.value.content, t.loc),
			modifiers: [],
			loc: t.loc
		});
	});
}, ih = (e, t) => {
	let n = Ee(e);
	return J(JSON.stringify(n), !1, t, 3);
};
function ah(e, t) {
	return Xd(e, t, void 0);
}
var oh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(ah(54, i)), t.children.length && (n.onError(ah(55, i)), t.children.length = 0), { props: [Dd(J("innerHTML", !0, i), r || J("", !0))] };
}, sh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(ah(56, i)), t.children.length && (n.onError(ah(57, i)), t.children.length = 0), { props: [Dd(J("textContent", !0), r ? gp(r, n) > 0 ? r : kd(n.helperString(nd), [r], i) : J("", !0))] };
}, ch = (e, t, n) => {
	let r = jm(e, t, n);
	if (!r.props.length || t.tagType === 1) return r;
	e.arg && n.onError(ah(59, e.arg.loc));
	let { tag: i } = t, a = n.isCustomElement(i);
	if (i === "input" || i === "textarea" || i === "select" || a) {
		let o = Km, s = !1;
		if (i === "input" || a) {
			let r = uf(t, "type");
			if (r) {
				if (r.type === 7) o = Jm;
				else if (r.value) switch (r.value.content) {
					case "radio":
						o = Wm;
						break;
					case "checkbox":
						o = Gm;
						break;
					case "file":
						s = !0, n.onError(ah(60, e.loc));
						break;
					default: break;
				}
			} else ff(t) && (o = Jm);
		} else i === "select" && (o = qm);
		s || (r.needRuntime = n.helper(o));
	} else n.onError(ah(58, e.loc));
	return r.props = r.props.filter((e) => !(e.key.type === 4 && e.key.content === "modelValue")), r;
}, lh = /* @__PURE__ */ d("passive,once,capture"), uh = /* @__PURE__ */ d("stop,prevent,self,ctrl,shift,alt,meta,exact,middle"), dh = /* @__PURE__ */ d("left,right"), fh = /* @__PURE__ */ d("onkeyup,onkeydown,onkeypress"), ph = (e, t, n, r) => {
	let i = [], a = [], o = [];
	for (let s = 0; s < t.length; s++) {
		let c = t[s].content;
		c === "native" && qd("COMPILER_V_ON_NATIVE", n, r) || lh(c) ? o.push(c) : dh(c) ? Zd(e) ? fh(e.content.toLowerCase()) ? i.push(c) : a.push(c) : (i.push(c), a.push(c)) : uh(c) ? a.push(c) : i.push(c);
	}
	return {
		keyModifiers: i,
		nonKeyModifiers: a,
		eventOptionModifiers: o
	};
}, mh = (e, t) => Zd(e) && e.content.toLowerCase() === "onclick" ? J(t, !0) : e.type === 4 ? e : Od([
	"(",
	e,
	`) === "onClick" ? "${t}" : (`,
	e,
	")"
]), hh = (e, t, n) => Tm(e, t, n, (t) => {
	let { modifiers: r } = e;
	if (!r.length) return t;
	let { key: i, value: a } = t.props[0], { keyModifiers: o, nonKeyModifiers: s, eventOptionModifiers: c } = ph(i, r, n, e.loc);
	if (s.includes("right") && (i = mh(i, "onContextmenu")), s.includes("middle") && (i = mh(i, "onMouseup")), s.length && (a = kd(n.helper(Ym), [a, JSON.stringify(s)])), o.length && (!Zd(i) || fh(i.content.toLowerCase())) && (a = kd(n.helper(Xm), [a, JSON.stringify(o)])), c.length) {
		let e = c.map(fe).join("");
		i = Zd(i) ? J(`${i.content}${e}`, !0) : Od([
			"(",
			i,
			`) + "${e}"`
		]);
	}
	return { props: [Dd(i, a)] };
}), gh = (e, t, n) => {
	let { exp: r, loc: i } = e;
	return r || n.onError(ah(62, i)), {
		props: [],
		needRuntime: n.helper(Zm)
	};
}, _h = (e, t) => {
	e.type === 1 && e.tagType === 0 && (e.tag === "script" || e.tag === "style") && t.removeNode();
}, vh = [rh], yh = {
	cloak: Um,
	html: oh,
	text: sh,
	model: ch,
	on: hh,
	show: gh
};
function bh(e, t = {}) {
	return Hm(e, v({}, nh, t, {
		nodeTransforms: [
			_h,
			...vh,
			...t.nodeTransforms || []
		],
		directiveTransforms: v({}, yh, t.directiveTransforms || {}),
		transformHoist: null
	}));
}
//#endregion
//#region node_modules/.pnpm/vue@3.5.39/node_modules/vue/dist/vue.esm-bundler.js
var xh = /* @__PURE__ */ c({
	BaseTransition: () => mi,
	BaseTransitionPropsValidators: () => ui,
	Comment: () => Cs,
	DeprecationTypes: () => null,
	EffectScope: () => qe,
	ErrorCodes: () => tr,
	ErrorTypeStrings: () => Cc,
	Fragment: () => z,
	KeepAlive: () => ta,
	ReactiveEffect: () => $e,
	Static: () => ws,
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
	camelize: () => le,
	capitalize: () => fe,
	cloneVNode: () => Bs,
	compatUtils: () => null,
	compile: () => Ch,
	computed: () => G,
	createApp: () => ku,
	createBlock: () => js,
	createCommentVNode: () => W,
	createElementBlock: () => V,
	createElementVNode: () => H,
	createHydrationRenderer: () => $o,
	createPropsRestProxy: () => Za,
	createRenderer: () => Qo,
	createSSRApp: () => Au,
	createSlots: () => ka,
	createStaticVNode: () => Vs,
	createTextVNode: () => U,
	createVNode: () => Ls,
	customRef: () => Pn,
	defineAsyncComponent: () => Qi,
	defineComponent: () => xi,
	defineCustomElement: () => zl,
	defineEmits: () => za,
	defineExpose: () => Ba,
	defineModel: () => Ua,
	defineOptions: () => Va,
	defineProps: () => Ra,
	defineSSRCustomElement: () => Bl,
	defineSlots: () => Ha,
	devtools: () => wc,
	effect: () => ft,
	effectScope: () => Je,
	getCurrentInstance: () => Zs,
	getCurrentScope: () => Ye,
	getCurrentWatcher: () => qn,
	getTransitionRawChildren: () => bi,
	guardReactiveProps: () => zs,
	h: () => _c,
	handleError: () => ar,
	hasInjectionContext: () => Ir,
	hydrate: () => Ou,
	hydrateOnIdle: () => Gi,
	hydrateOnInteraction: () => Yi,
	hydrateOnMediaQuery: () => Ji,
	hydrateOnVisible: () => qi,
	initCustomFormatter: () => vc,
	initDirectivesForSSR: () => Pu,
	inject: () => Fr,
	isMemoSame: () => bc,
	isProxy: () => bn,
	isReactive: () => _n,
	isReadonly: () => vn,
	isRef: () => wn,
	isRuntimeOnly: () => uc,
	isShallow: () => yn,
	isVNode: () => Ms,
	markRaw: () => xn,
	mergeDefaults: () => Ya,
	mergeModels: () => Xa,
	mergeProps: () => Gs,
	nextTick: () => mr,
	nodeOps: () => Fc,
	normalizeClass: () => N,
	normalizeProps: () => De,
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
	onScopeDispose: () => Xe,
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
	ref: () => I,
	registerRuntimeCompiler: () => lc,
	render: () => Du,
	renderList: () => R,
	renderSlot: () => Aa,
	resolveComponent: () => Ca,
	resolveDirective: () => Ea,
	resolveDynamicComponent: () => Ta,
	resolveFilter: () => null,
	resolveTransitionHooks: () => gi,
	setBlockTracking: () => ks,
	setDevtoolsHook: () => Tc,
	setTransitionHooks: () => yi,
	shallowReactive: () => pn,
	shallowReadonly: () => hn,
	shallowRef: () => Tn,
	ssrContextKey: () => Lr,
	ssrUtils: () => Ec,
	stop: () => pt,
	toDisplayString: () => P,
	toHandlerKey: () => pe,
	toHandlers: () => Ma,
	toRaw: () => F,
	toRef: () => Rn,
	toRefs: () => Fn,
	toValue: () => An,
	transformVNodeArgs: () => Ps,
	triggerRef: () => On,
	unref: () => kn,
	useAttrs: () => Ka,
	useCssModule: () => Gl,
	useCssVars: () => ll,
	useHost: () => Ul,
	useId: () => Si,
	useModel: () => yo,
	useSSRContext: () => Rr,
	useShadowRoot: () => Wl,
	useSlots: () => Ga,
	useTemplateRef: () => wi,
	useTransitionState: () => ci,
	vModelCheckbox: () => su,
	vModelDynamic: () => pu,
	vModelRadio: () => lu,
	vModelSelect: () => q,
	vModelText: () => K,
	vShow: () => al,
	version: () => xc,
	warn: () => Sc,
	watch: () => Hr,
	watchEffect: () => zr,
	watchPostEffect: () => Br,
	watchSyncEffect: () => Vr,
	withAsyncContext: () => Qa,
	withCtx: () => Mr,
	withDefaults: () => Wa,
	withDirectives: () => L,
	withKeys: () => xu,
	withMemo: () => yc,
	withModifiers: () => yu,
	withScopeId: () => jr
}), Sh = /* @__PURE__ */ Object.create(null);
function Ch(e, t) {
	if (!O(e)) if (e.nodeType) e = e.innerHTML;
	else return m;
	let n = be(e, t), r = Sh[n];
	if (r) return r;
	if (e[0] === "#") {
		let t = document.querySelector(e);
		e = t ? t.innerHTML : "";
	}
	let i = v({
		hoistStatic: !0,
		onError: void 0,
		onWarn: m
	}, t);
	!i.isCustomElement && typeof customElements < "u" && (i.isCustomElement = (e) => !!customElements.get(e));
	let { code: a } = bh(e, i), o = Function("Vue", a)(Dc);
	return o._rc = !0, Sh[n] = o;
}
lc(Ch);
//#endregion
//#region admin-app/src/shell-contract.mjs
function wh(e = globalThis.document) {
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
var Th = "/prototype/visual-editor.html";
function Eh(e, t = {}, n = globalThis.location?.origin) {
	if (!n) throw Error("Visual Editor origin is required");
	let r = String(e || "").trim();
	if (!r) throw Error("Visual Editor mode is required");
	let i = new URL(Th, n);
	return i.searchParams.set("mode", r), Object.entries(t).forEach(([e, t]) => {
		t != null && t !== "" && i.searchParams.set(e, String(t));
	}), i.toString();
}
var Dh = Object.freeze({
	sectionPreset(e, t, n) {
		return Eh("section-preset", {
			sectionId: e,
			layoutKey: t
		}, n);
	},
	adminLayout(e, t) {
		return Eh("admin-layout", { templateId: e }, t);
	},
	aiDocument(e, t, n) {
		return Eh("ai-document", {
			builderDocumentId: e,
			revision: t
		}, n);
	},
	output(e, t, n, r) {
		return Eh("output", {
			builderDocumentId: e,
			revision: t,
			returnUrl: n
		}, r);
	}
});
//#endregion
//#region admin-app/src/services/template-layout-service.mjs
async function Oh(e, { fetchImpl: t = globalThis.fetch } = {}) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	let r = await t(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(n)}`, { cache: "no-store" }), i = await r.json().catch(() => ({}));
	if (!r.ok) throw Error(i.message || i.error || `Layout request failed (${r.status})`);
	return i;
}
function kh(e, t = globalThis.location?.origin) {
	let n = String(e || "").trim();
	if (!n) throw Error("Template id is required");
	return Dh.adminLayout(n, t);
}
var Ah = Object.freeze({
	requestLayout: Oh,
	editorUrl: kh
}), jh = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, Mh = { class: "visual-editor-dialog-host__surface" }, Nh = { id: "visual-editor-dialog-title" }, Ph = { id: "visual-editor-dialog-description" }, Fh = { class: "visual-editor-dialog-host__save-target" }, Ih = ["aria-busy"], Lh = ["src", "title"], Rh = {
	key: 0,
	class: "visual-editor-dialog-host__loading",
	role: "status"
}, zh = {
	key: 1,
	class: "visual-editor-dialog-host__readonly"
}, Bh = /*#__PURE__*/ jh({
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
		let n = t, r = /* @__PURE__ */ I(null), i = /* @__PURE__ */ I(null), a = /* @__PURE__ */ I(!0), o = /* @__PURE__ */ I(!1), s = null;
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
			globalThis.document.body.classList.remove("visual-editor-dialog-open"), n("close"), mr(() => s?.focus?.());
		}
		return fa(async () => {
			s = globalThis.document.activeElement, globalThis.addEventListener("message", c), globalThis.document.body.classList.add("visual-editor-dialog-open"), await mr(), r.value && !r.value.open && r.value.showModal();
		}), ha(() => {
			globalThis.removeEventListener("message", c), r.value?.open && r.value.close(), globalThis.document.body.classList.remove("visual-editor-dialog-open");
		}), (t, n) => (B(), V("dialog", {
			ref_key: "dialog",
			ref: r,
			class: "visual-editor-dialog-host",
			"aria-labelledby": "visual-editor-dialog-title",
			"aria-describedby": "visual-editor-dialog-description",
			onClick: u,
			onCancel: yu(l, ["prevent"]),
			onClose: d
		}, [H("section", Mh, [H("header", null, [H("div", null, [
			H("strong", Nh, P(e.title), 1),
			H("small", Ph, P(e.description), 1),
			H("span", Fh, "저장 대상: " + P(e.saveTargetLabel), 1)
		]), H("button", {
			class: "tiny-button",
			type: "button",
			"aria-label": "Visual Editor 모달 닫기",
			onClick: l
		}, "닫기")]), H("div", {
			class: "visual-editor-dialog-host__frame-wrap",
			"aria-busy": a.value ? "true" : "false"
		}, [H("iframe", {
			ref_key: "frame",
			ref: i,
			class: N(["visual-editor-dialog-host__frame", { "is-readonly": e.readOnly }]),
			src: e.editorUrl,
			title: e.iframeTitle,
			onLoad: n[0] ||= (e) => a.value = !1
		}, null, 42, Lh), a.value ? (B(), V("div", Rh, "공통 Visual Editor를 불러오는 중입니다.")) : e.readOnly ? (B(), V("div", zh, P(e.readOnlyMessage), 1)) : W("", !0)], 8, Ih)])], 544));
	}
}, [["__scopeId", "data-v-ba4ee7ed"]]), Vh = {
	name: "TemplateLayoutManager",
	components: { VisualEditorDialogHost: Bh },
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
			let e = new URL(Ah.editorUrl(this.template.id));
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
				let t = await Ah.requestLayout(this.template.id);
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
}, Hh = ["aria-labelledby"], Uh = { class: "template-layout-manager__header" }, Wh = { class: "template-layout-settings-eyebrow" }, Gh = ["id"], Kh = ["disabled"], qh = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
};
function Jh(e, t, n, r, i, a) {
	let o = Ca("visual-editor-dialog-host");
	return B(), V("section", {
		class: "template-layout-manager",
		"aria-labelledby": a.headingId
	}, [
		H("div", Uh, [H("div", null, [
			H("span", Wh, P(n.translate("admin.templateLayout.eyebrow")), 1),
			H("h3", { id: a.headingId }, P(n.template.name) + " · 템플릿 기본 레이아웃", 9, Gh),
			H("small", null, [U(" v" + P(n.template.version) + " · " + P(n.statusLabel(n.template.status)) + " ", 1), i.layoutRevision ? (B(), V(z, { key: 0 }, [U(" · " + P(n.translate("admin.templateLayout.revision")) + " r" + P(i.layoutRevision), 1)], 64)) : W("", !0)]),
			t[1] ||= H("small", null, "저장 범위: 선택한 템플릿의 기본 레이아웃", -1)
		]), H("button", {
			class: "tiny-button",
			type: "button",
			"aria-haspopup": "dialog",
			disabled: i.loading || !a.editorUrl,
			onClick: t[0] ||= (...e) => a.openEditor && a.openEditor(...e)
		}, P(a.editable ? "템플릿 기본 레이아웃 편집" : "템플릿 기본 레이아웃 보기"), 9, Kh)]),
		i.error ? (B(), V("div", qh, [t[2] ||= H("strong", null, "템플릿 기본 레이아웃 오류", -1), H("span", null, P(i.error), 1)])) : W("", !0),
		i.editorOpen ? (B(), js(o, {
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
		])) : W("", !0)
	], 8, Hh);
}
var Yh = /*#__PURE__*/ jh(Vh, [["render", Jh], ["__scopeId", "data-v-989daa96"]]);
//#endregion
//#region admin-app/src/services/design-token-service.mjs
async function Xh(e, t = {}, n = globalThis.fetch) {
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
var Zh = (e, t) => ({
	method: e,
	body: JSON.stringify(t)
}), Qh = Object.freeze({
	usagePolicy: (e = "") => Xh(`/api/design-token-usage-policy${e ? `?versionId=${encodeURIComponent(e)}` : ""}`),
	saveUsagePolicy: (e) => Xh("/api/design-token-usage-policy", Zh("POST", e)),
	library: (e = "") => Xh(`/api/design-token-library${e ? `?versionId=${encodeURIComponent(e)}` : ""}`),
	saveLibrary: (e) => Xh("/api/design-token-library", Zh("POST", e)),
	list: () => Xh("/api/design-token-sets"),
	catalog: () => Xh("/api/design-token-catalog-import"),
	registerDefinitions: (e) => Xh("/api/design-token-catalog-import", Zh("POST", e)),
	detail: (e) => Xh(`/api/design-token-set?versionId=${encodeURIComponent(e)}`),
	usage: (e) => Xh(`/api/design-token-set-usage?tokenSetId=${encodeURIComponent(e)}`),
	createSet: (e) => Xh("/api/design-token-sets", Zh("POST", e)),
	cloneSet: (e) => Xh("/api/design-token-set-clone", Zh("POST", e)),
	updateMetadata: (e) => Xh("/api/design-token-set-metadata", Zh("PATCH", e)),
	createDraft: (e) => Xh("/api/design-token-set-draft", Zh("POST", e)),
	saveVersion: (e) => Xh("/api/design-token-set-version", Zh("PUT", e)),
	importCsv: (e) => Xh("/api/design-token-set-import", Zh("POST", e)),
	validate: (e) => Xh("/api/design-token-set-validate", Zh("POST", e)),
	activate: (e) => Xh("/api/design-token-set-activate", Zh("POST", e)),
	publish: (e) => Xh("/api/design-token-set-publish", Zh("POST", e)),
	updateStatus: (e) => Xh("/api/design-token-set-status", Zh("POST", e)),
	deleteSet: (e) => Xh("/api/design-token-set-delete", Zh("POST", e)),
	archive: (e) => Xh("/api/design-token-set-archive", Zh("POST", e))
}), $h = (e, t, n, r, i = [], a = !1, o = "default") => ({
	key: e,
	target: t,
	property: n,
	label: r,
	defaults: i,
	required: a,
	state: o
}), eg = Object.freeze([
	$h("page.background", "page", "background-color", "페이지 배경", ["--color-bg-dark-800"], !0),
	$h("text.primary", "text", "color", "일반 텍스트 · 기본", [], !0),
	$h("text.muted", "text", "color", "일반 텍스트 · 보조"),
	$h("text.font", "text", "font-family", "기본 글꼴", ["--typography-body-lg-typeface", "--typeface-roboto"], !0),
	$h("text.bodySize", "text", "font-size", "본문 크기", ["--typography-body-md-font-size"], !0),
	$h("text.titleSize", "text", "font-size", "제목 크기", ["--typography-title-lg-font-size"], !0),
	$h("text.bodyWeight", "text", "font-weight", "본문 굵기", ["--font-weight-400"]),
	$h("text.titleWeight", "text", "font-weight", "제목 굵기", ["--font-weight-700"]),
	$h("text.bodyLineHeight", "text", "line-height", "본문 줄 높이", ["--typography-body-md-line-height", "--typography-body-md-line-hight"]),
	$h("text.titleLineHeight", "text", "line-height", "제목 줄 높이", ["--typography-title-lg-line-height", "--typography-title-lg-line-hight"]),
	$h("card.background", "card", "background-color", "카드 배경", ["--card-container-default"], !0),
	$h("card.radius", "card", "border-radius", "카드 모서리", ["--border-radius-md"]),
	$h("card.shadow", "card", "box-shadow", "카드 그림자", ["--shadow-elevation-1"]),
	$h("card.padding", "card", "padding", "카드 패딩", ["--spacing-24"]),
	$h("layout.gap", "layout", "gap", "요소 간격", ["--spacing-16"]),
	$h("layout.padding", "layout", "padding", "섹션 패딩", ["--spacing-32"]),
	$h("button.background", "button", "background-color", "주요 버튼 배경", ["--button-container-brand-default"], !0),
	$h("button.color", "button", "color", "주요 버튼 문구", ["--button-label-on-color", "--button-label-default"], !0),
	$h("button.radius", "button", "border-radius", "버튼 모서리", ["--border-radius-md"]),
	$h("button.padding", "button", "padding", "버튼 좌우 패딩", ["--spacing-16"]),
	$h("button.border", "button", "border-color", "버튼 테두리", ["--button-border-brand-default"]),
	$h("button.borderWidth", "button", "border-width", "버튼 테두리 두께", ["--border-width-1"]),
	$h("button.font", "button", "font-family", "버튼 글꼴", ["--typography-body-lg-typeface", "--typeface-roboto"]),
	$h("button.lineHeight", "button", "line-height", "버튼 줄 높이", ["--typography-body-md-line-height", "--typography-body-md-line-hight"]),
	$h("button.size", "button", "font-size", "버튼 글자 크기", ["--typography-label-md-font-size"]),
	$h("button.weight", "button", "font-weight", "버튼 글자 굵기", ["--font-weight-600"]),
	$h("button.hoverBackground", "button", "background-color", "버튼 배경 · hover", ["--button-container-brand-hover"], !1, "hover"),
	$h("button.pressedBackground", "button", "background-color", "버튼 배경 · pressed", ["--button-container-brand-pressed"], !1, "pressed"),
	$h("button.disabledBackground", "button", "background-color", "버튼 배경 · disabled", ["--button-container-brand-disable"], !1, "disabled"),
	$h("button.disabledColor", "button", "color", "버튼 문구 · disabled", ["--button-label-disable"], !1, "disabled")
]), tg = /* @__PURE__ */ new Set([
	"button",
	"card",
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
function ng(e) {
	let t = String(e || "").replace(/^--/, "").split("-")[0];
	return tg.has(t) ? t : "shared";
}
function rg(e, t, n = []) {
	if (!e || !t || e.state === "incomplete" || e.state === "draft") return !1;
	let r = e.name || e.tokenKey;
	if (/^--render-policy-/.test(r)) return !1;
	let i = ng(r);
	if (i !== "shared" && i !== t.target || !(e.cssProperties || []).includes(t.property)) return !1;
	if (e.reference && n.length) {
		let i = new Map(n.map((e) => [e.name || e.tokenKey, e])), a = /* @__PURE__ */ new Set([r]), o = e.reference;
		for (; o;) {
			if (a.has(o)) return !1;
			a.add(o);
			let e = i.get(o);
			if (!e) return !1;
			let n = ng(o);
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
function ig(e, t = [], { activation: n = !1 } = {}) {
	let r = [], i = [], a = new Map(t.map((e) => [e.name || e.tokenKey, e]));
	if (e?.schemaVersion !== 1 || !e.bindings || typeof e.bindings != "object" || Array.isArray(e.bindings)) return {
		ok: !1,
		errors: [{
			code: "INVALID_POLICY",
			message: "정책 형식이 올바르지 않습니다."
		}],
		missing: []
	};
	for (let t of Object.keys(e.bindings)) eg.some((e) => e.key === t) || r.push({
		key: t,
		code: "UNKNOWN_POLICY_RULE",
		message: "지원하지 않는 정책 항목입니다."
	});
	for (let n of eg) {
		let o = e.bindings[n.key];
		if (!o) {
			n.required && i.push(n.key);
			continue;
		}
		(typeof o != "string" || !rg(a.get(o), n, t)) && r.push({
			key: n.key,
			token: o,
			code: "TOKEN_USAGE_MISMATCH",
			message: `${n.label}: 등록 여부·대상·속성·상태를 확인하세요.`
		});
	}
	if (n) for (let e of i) r.push({
		key: e,
		code: "REQUIRED_MAPPING_MISSING",
		message: `필수 연결이 없습니다: ${eg.find((t) => t.key === e).label}`
	});
	return {
		ok: !r.length,
		errors: r,
		missing: i
	};
}
function ag(e, t, n = {}) {
	let r = e?.bindings?.[t];
	return typeof r == "string" && typeof n[r] == "string" && n[r].trim() ? r : "";
}
function og(e, t = {}) {
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
		let i = ag(e, r, t);
		return i ? [[n.replace(/^--promo-/, "--render-policy-").replace(/^--component-/, "--render-policy-component-"), `var(${i})`]] : [];
	}));
}
function sg(e, { target: t, property: n, state: r = "default", tokenKey: i }) {
	return eg.some((a) => a.target === t && a.property === n && a.state === r && e?.bindings?.[a.key] === i);
}
function cg(e, { fieldKind: t = "", tag: n = "", sectionRole: r = "" } = {}) {
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
function lg(e, { tokenKey: t, property: n, target: r, state: i = "default", path: a = "" }) {
	return sg(e, {
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
var ug = { class: "token-usage-policy" }, dg = {
	key: 0,
	role: "alert",
	class: "policy-error"
}, fg = {
	key: 1,
	role: "status"
}, pg = ["disabled"], mg = { class: "policy-toolbar" }, hg = ["value", "disabled"], gg = {
	key: 0,
	value: ""
}, _g = ["value"], vg = ["disabled"], yg = ["disabled"], bg = ["disabled"], xg = { key: 0 }, Sg = {
	key: 1,
	role: "status"
}, Cg = {
	key: 2,
	class: "policy-error"
}, wg = { class: "policy-table" }, Tg = { scope: "row" }, Eg = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], Dg = ["value"], Og = ["value"], kg = /*#__PURE__*/ jh({
	__name: "TokenUsagePolicyManager",
	props: {
		tokenVersionId: { default: null },
		blocked: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ I(null), r = /* @__PURE__ */ I([]), i = /* @__PURE__ */ I([]), a = /* @__PURE__ */ I(null), o = /* @__PURE__ */ I(null), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = /* @__PURE__ */ I(!1), u = /* @__PURE__ */ I(""), d = /* @__PURE__ */ I(""), f = /* @__PURE__ */ I(""), p = G(() => n.value && JSON.stringify(n.value) !== f.value), m = G(() => n.value ? ig(n.value, r.value, { activation: !0 }) : {
			errors: [],
			missing: []
		});
		async function h(e = "") {
			if (!(p.value && !globalThis.confirm("저장하지 않은 정책 변경사항을 버릴까요?"))) {
				l.value = !0, u.value = "";
				try {
					let t = await Qh.usagePolicy(e);
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
				await Qh.saveUsagePolicy({
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
		let _ = (e) => r.value.filter((t) => rg(t, e, r.value));
		function v(e) {
			p.value && (e.preventDefault(), e.returnValue = "");
		}
		return fa(() => {
			h(), globalThis.addEventListener("beforeunload", v);
		}), ha(() => globalThis.removeEventListener("beforeunload", v)), Hr(() => t.tokenVersionId, () => {
			p.value || h();
		}), (t, r) => (B(), V("details", ug, [
			r[8] ||= H("summary", null, "토큰 사용 정책", -1),
			r[9] ||= H("p", null, "용도별 토큰을 한곳에서 연결합니다. 미연결 필수 항목은 다른 용도의 토큰으로 대체하지 않습니다.", -1),
			u.value ? (B(), V("p", dg, P(u.value), 1)) : W("", !0),
			d.value ? (B(), V("p", fg, P(d.value), 1)) : W("", !0),
			n.value ? W("", !0) : (B(), V("button", {
				key: 2,
				type: "button",
				disabled: l.value,
				onClick: r[0] ||= (e) => h()
			}, "정책 불러오기", 8, pg)),
			n.value ? (B(), V(z, { key: 3 }, [
				H("div", mg, [
					H("span", null, P(o.value ? "활성 정책 있음" : "활성 정책 없음") + " · 필수 미연결 " + P(m.value.missing.length) + "개", 1),
					H("label", null, [r[5] ||= U("정책 이력 ", -1), H("select", {
						value: s.value || "",
						disabled: l.value,
						onChange: r[1] ||= (e) => h(e.target.value)
					}, [i.value.length ? W("", !0) : (B(), V("option", gg, "초기 Draft")), (B(!0), V(z, null, R(i.value, (e) => (B(), V("option", {
						key: e.id,
						value: e.id
					}, "v" + P(e.version) + " · " + P(e.status), 9, _g))), 128))], 40, hg)]),
					H("button", {
						type: "button",
						disabled: l.value || e.blocked,
						onClick: r[2] ||= (e) => g(!1)
					}, "Draft 저장", 8, vg),
					H("button", {
						type: "button",
						disabled: l.value || e.blocked || !!m.value.errors.length,
						onClick: r[3] ||= (e) => g(!0)
					}, "검증 후 활성화", 8, yg),
					H("button", {
						type: "button",
						disabled: l.value,
						onClick: r[4] ||= (e) => h()
					}, "새로고침", 8, bg)
				]),
				e.blocked ? (B(), V("p", xg, "토큰 변경사항을 먼저 저장한 후 정책을 저장하세요.")) : W("", !0),
				p.value ? (B(), V("p", Sg, "저장하지 않은 정책 변경사항이 있습니다.")) : W("", !0),
				m.value.errors.length ? (B(), V("ul", Cg, [(B(!0), V(z, null, R(m.value.errors, (e, t) => (B(), V("li", { key: t }, P(e.message), 1))), 128))])) : W("", !0),
				H("div", wg, [H("table", null, [r[7] ||= H("thead", null, [H("tr", null, [
					H("th", null, "용도"),
					H("th", null, "대상"),
					H("th", null, "속성"),
					H("th", null, "상태"),
					H("th", null, "등록 토큰"),
					H("th", null, "누락 처리")
				])], -1), H("tbody", null, [(B(!0), V(z, null, R(kn(eg), (t) => (B(), V("tr", { key: t.key }, [
					H("th", Tg, P(t.label), 1),
					H("td", null, P(t.target), 1),
					H("td", null, P(t.property), 1),
					H("td", null, P(t.state), 1),
					H("td", null, [L(H("select", {
						"onUpdate:modelValue": (e) => n.value.bindings[t.key] = e,
						"aria-label": `${t.label} 토큰`,
						disabled: l.value || e.blocked
					}, [
						r[6] ||= H("option", { value: "" }, "미연결", -1),
						n.value.bindings[t.key] && !_(t).some((e) => e.tokenKey === n.value.bindings[t.key]) ? (B(), V("option", {
							key: 0,
							value: n.value.bindings[t.key]
						}, P(n.value.bindings[t.key]) + " · 사용 불가", 9, Dg)) : W("", !0),
						(B(!0), V(z, null, R(_(t), (e) => (B(), V("option", {
							key: e.tokenKey,
							value: e.tokenKey
						}, P(e.tokenKey) + " · " + P(e.value), 9, Og))), 128))
					], 8, Eg), [[q, n.value.bindings[t.key]]])]),
					H("td", null, P(t.required ? "필수 · 생성 차단" : "선택 · 생략"), 1)
				]))), 128))])])])
			], 64)) : W("", !0)
		]));
	}
}, [["__scopeId", "data-v-4ccd3e35"]]), Ag = [
	"color",
	"dimension",
	"number",
	"fontFamily",
	"fontWeight",
	"shadow",
	"typography"
], jg = [
	"Color",
	"Spacing",
	"Border Width",
	"Border Radius",
	"Typography",
	"Shadow",
	"Grid",
	"Breakpoint",
	"Measurement"
], Mg = [
	"카테고리",
	"토큰 유형",
	"토큰명",
	"값",
	"참조 토큰"
], Ng = /^--[a-z][a-z0-9-]*$/, Pg = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|ch)$/, Fg = /url\s*\(|expression\s*\(|[;{}<>]/i;
function Ig(e) {
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
	if (new Set(a).size !== a.length || Mg.some((e) => !a.includes(e))) throw Error(`CSV 필수 컬럼: ${Mg.join(", ")}`);
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
function Lg(e) {
	let t = (e) => {
		let t = String(e ?? "");
		return /[",\r\n]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
	};
	return "﻿" + [Mg, ...e.map((e) => [
		e.category,
		e.type,
		e.name,
		e.value,
		e.reference
	])].map((e) => e.map(t).join(",")).join("\r\n") + "\r\n";
}
function Rg(e) {
	if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(e)) return !0;
	let t = e.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/);
	return !!t && t.slice(1, 4).every((e) => Number(e) <= 255) && (t[4] === void 0 || Number(t[4]) <= 1);
}
function zg(e) {
	if (e === "none") return !0;
	let t = e.split(/,(?![^()]*\))/);
	return t.length > 0 && t.length <= 8 && t.every((e) => {
		let t = e.trim().match(/^(inset\s+)?(.+?)\s+(#[\da-f]{6,8}|rgba?\([^()]+\))$/i);
		if (!t || !Rg(t[3])) return !1;
		let n = t[2].trim().split(/\s+/);
		return n.length >= 2 && n.length <= 4 && n.every((e) => e === "0" || /^-?(?:\d+|\d*\.\d+)(px|rem|em)$/.test(e)) && (n.length < 3 || parseFloat(n[2]) >= 0);
	});
}
function Bg(e) {
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
		].includes(t) : !Vg(n[e], t)) throw Error(`Typography ${e} 값이 올바르지 않습니다.`);
	}
	return t;
}
function Vg(e, t) {
	if (e !== "typography" && Fg.test(t)) return !1;
	switch (e) {
		case "color": return Rg(t);
		case "dimension": return t === "0" || Pg.test(t);
		case "number": return /^-?(?:\d+|\d*\.\d+)$/.test(t) && Number.isFinite(Number(t));
		case "fontWeight": return /^\d+$/.test(t) && Number(t) >= 1 && Number(t) <= 1e3;
		case "fontFamily": return /^[\p{L}\p{N}\s,'"-]+$/u.test(t) && t.length <= 200;
		case "shadow": return zg(t);
		case "typography": try {
			return Bg(t), !0;
		} catch {
			return !1;
		}
		default: return !1;
	}
}
function Hg(e) {
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
		if ((!i.category || i.category.length > 80) && a("카테고리를 입력하세요(80자 이하)."), Ag.includes(i.type) || a("지원하지 않는 토큰 유형입니다."), (!Ng.test(i.name) || i.name.length > 180) && a("토큰명은 --영문소문자로 시작하며 숫자·하이픈만 사용할 수 있습니다."), r.has(i.name) && a("토큰명이 중복됩니다."), i.value && i.reference && a("값과 참조 토큰 중 하나만 입력하세요."), i.reference && !Ng.test(i.reference) && a("참조 토큰명이 올바르지 않습니다."), !i.value && !i.reference && (i.state = "incomplete"), i.value && !Vg(i.type, i.value) && a("토큰 유형에 맞지 않는 값입니다."), i.name.startsWith("--grid-") && i.name.endsWith("-columns") && i.value && (!Number.isInteger(Number(i.value)) || Number(i.value) < 1 || Number(i.value) > 64) && a("그리드 컬럼 수는 1~64 사이 정수여야 합니다."), i.type === "typography" && i.value && Vg(i.type, i.value)) {
			let e = Bg(i.value);
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
var Ug = {
	name: "DesignTokenManager",
	components: { TokenUsagePolicyManager: kg },
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
			types: Ag,
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
				...jg,
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
			return Hg(this.tokens);
		},
		states() {
			return Object.fromEntries(this.analysis.tokens.map((e) => [e.name, e.state]));
		},
		dirty() {
			return this.loaded && Lg(this.tokens) !== this.baseline;
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
				let t = await Qh.library(e);
				this.tokens = t.tokens, this.versionId = t.versionId, this.activeVersionId = t.activeVersionId, this.versions = t.versions, this.initial = t.initial, this.loaded = !0, this.baseline = Lg(this.tokens), this.selectedHistory = t.versionId || "";
			});
		},
		async save() {
			if (this.analysis.errors.length) {
				this.error = "아래 오류를 수정한 후 저장하세요.";
				return;
			}
			await this.run(async () => {
				let e = await Qh.saveLibrary({
					tokens: this.tokens,
					expectedVersionId: this.activeVersionId
				});
				this.baseline = Lg(this.tokens);
				let t = await Qh.library();
				this.tokens = t.tokens, this.versionId = t.versionId, this.activeVersionId = t.activeVersionId, this.versions = t.versions, this.selectedHistory = t.versionId, this.initial = !1, this.baseline = Lg(this.tokens), this.message = `공통 디자인 토큰을 저장했습니다. 미완성 ${e.warnings.length}개는 실제 적용에서 제외됩니다.`, this.$emit("token-sets-changed"), this.$emit("status", this.message);
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
				Grid: "number"
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
			let e = { ...this.form }, t = Hg([...this.tokens, e]);
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
			let e = URL.createObjectURL(new Blob([Lg(this.tokens)], { type: "text/csv;charset=utf-8" })), t = document.createElement("a");
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
					let e = Hg(Ig(await t.text()));
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
}, Wg = {
	class: "token-library",
	"aria-labelledby": "token-library-title"
}, Gg = { class: "token-library-header" }, Kg = { class: "token-library-actions" }, qg = ["disabled"], Jg = { class: "token-library-upload" }, Yg = ["disabled"], Xg = ["disabled"], Zg = {
	key: 0,
	role: "status"
}, Qg = {
	key: 1,
	class: "token-library-notice"
}, $g = {
	key: 2,
	role: "status"
}, e_ = {
	key: 3,
	class: "token-library-error",
	role: "alert"
}, t_ = {
	key: 4,
	role: "status"
}, n_ = {
	key: 5,
	class: "token-library-meta"
}, r_ = ["value", "disabled"], i_ = {
	key: 0,
	value: ""
}, a_ = ["value"], o_ = ["disabled"], s_ = [
	"aria-selected",
	"tabindex",
	"disabled"
], c_ = [
	"id",
	"aria-selected",
	"tabindex",
	"disabled",
	"onClick"
], l_ = { class: "token-library-toolbar" }, u_ = ["disabled"], d_ = ["disabled"], f_ = ["disabled"], p_ = ["disabled"], m_ = {
	key: 1,
	class: "token-library-import",
	role: "region",
	"aria-label": "CSV 가져오기 미리보기"
}, h_ = {
	key: 2,
	class: "token-library-error",
	role: "alert"
}, g_ = ["aria-labelledby"], __ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], v_ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], y_ = [
	"onUpdate:modelValue",
	"aria-label",
	"disabled"
], b_ = [
	"aria-label",
	"disabled",
	"onClick"
], x_ = { key: 0 };
function S_(e, t, n, r, i, a) {
	let o = Ca("TokenUsagePolicyManager");
	return B(), V("section", Wg, [
		H("header", Gg, [t[21] ||= H("div", null, [H("h2", { id: "token-library-title" }, "디자인 토큰"), H("p", null, "하나의 공통 라이브러리를 카테고리별로 관리합니다. Dark 전용입니다.")], -1), H("div", Kg, [
			H("button", {
				type: "button",
				disabled: i.busy || !i.loaded,
				onClick: t[0] ||= (...e) => a.downloadCsv && a.downloadCsv(...e)
			}, "전체 CSV 다운로드", 8, qg),
			H("label", Jg, [t[20] ||= U("전체 CSV 업로드", -1), H("input", {
				"aria-label": "전체 CSV 업로드",
				type: "file",
				accept: ".csv,text/csv",
				disabled: i.busy || !i.loaded,
				onChange: t[1] ||= (...e) => a.uploadCsv && a.uploadCsv(...e)
			}, null, 40, Yg)]),
			H("button", {
				type: "button",
				class: "primary",
				disabled: i.busy || !i.loaded || !!a.analysis.errors.length || !a.dirty && !i.initial && i.versionId === i.activeVersionId,
				onClick: t[2] ||= (...e) => a.save && a.save(...e)
			}, P(i.busy ? "처리 중…" : i.versionId === i.activeVersionId ? "변경사항 저장" : "이 버전을 새 버전으로 복원"), 9, Xg)
		])]),
		!i.loaded && i.busy ? (B(), V("p", Zg, "디자인 토큰을 불러오고 있습니다.")) : W("", !0),
		i.initial && i.loaded ? (B(), V("p", Qg, "공통 라이브러리의 초기 값입니다. 저장하면 새로운 페이지 생성에 적용됩니다. 이전 결과물은 유지됩니다.")) : W("", !0),
		a.dirty ? (B(), V("p", $g, "저장하지 않은 변경사항이 있습니다.")) : W("", !0),
		i.error ? (B(), V("p", e_, P(i.error), 1)) : W("", !0),
		i.message ? (B(), V("p", t_, P(i.message), 1)) : W("", !0),
		i.loaded ? (B(), V("div", n_, [
			H("span", null, "전체 " + P(i.tokens.length) + "개 · 적용 가능 " + P(a.activeCount) + "개 · 미완성 " + P(a.analysis.warnings.length) + "개", 1),
			H("label", null, [t[22] ||= U("버전 이력 ", -1), H("select", {
				value: i.selectedHistory,
				disabled: i.busy,
				onChange: t[3] ||= (e) => a.load(e.target.value)
			}, [i.versions.length ? W("", !0) : (B(), V("option", i_, "초기 토큰")), (B(!0), V(z, null, R(i.versions, (e) => (B(), V("option", {
				key: e.id,
				value: e.id
			}, "v" + P(e.version) + P(e.id === i.activeVersionId ? " · 현재" : ""), 9, a_))), 128))], 40, r_)]),
			H("button", {
				type: "button",
				disabled: i.busy,
				onClick: t[4] ||= (e) => a.load()
			}, "새로고침", 8, o_)
		])) : W("", !0),
		i.loaded ? (B(), js(o, {
			key: 6,
			"token-version-id": i.activeVersionId,
			blocked: a.dirty
		}, null, 8, ["token-version-id", "blocked"])) : W("", !0),
		i.loaded ? (B(), V(z, { key: 7 }, [
			H("div", {
				class: "token-library-tabs",
				role: "tablist",
				"aria-label": "디자인 토큰 카테고리",
				onKeydown: t[6] ||= (...e) => a.onTabKey && a.onTabKey(...e)
			}, [H("button", {
				type: "button",
				role: "tab",
				id: "token-tab-all",
				"aria-selected": !i.selectedCategory,
				tabindex: i.selectedCategory ? -1 : 0,
				"aria-controls": "token-panel",
				disabled: i.busy,
				onClick: t[5] ||= (e) => i.selectedCategory = ""
			}, "전체 (" + P(i.tokens.length) + ")", 9, s_), (B(!0), V(z, null, R(a.categories, (e, t) => (B(), V("button", {
				id: `token-tab-${t}`,
				key: e,
				type: "button",
				role: "tab",
				"aria-selected": i.selectedCategory === e,
				tabindex: i.selectedCategory === e ? 0 : -1,
				"aria-controls": "token-panel",
				disabled: i.busy,
				onClick: (t) => i.selectedCategory = e
			}, P(e) + " (" + P(a.categoryCount(e)) + ")", 9, c_))), 128))], 32),
			H("div", l_, [
				L(H("input", {
					"onUpdate:modelValue": t[7] ||= (e) => i.search = e,
					"aria-label": "토큰 검색",
					placeholder: "토큰명·유형·값 검색",
					disabled: i.busy
				}, null, 8, u_), [[K, i.search]]),
				H("button", {
					type: "button",
					disabled: i.busy,
					onClick: t[8] ||= (...e) => a.openAdd && a.openAdd(...e)
				}, P(i.selectedCategory || "카테고리") + " 토큰 추가", 9, d_),
				H("form", { onSubmit: t[10] ||= yu((...e) => a.addCategory && a.addCategory(...e), ["prevent"]) }, [L(H("input", {
					"onUpdate:modelValue": t[9] ||= (e) => i.categoryName = e,
					"aria-label": "새 카테고리 이름",
					maxlength: "80",
					placeholder: "새 카테고리"
				}, null, 512), [[K, i.categoryName]]), H("button", { disabled: i.busy || !i.categoryName.trim() }, "카테고리 추가", 8, f_)], 32)
			]),
			i.showAdd ? (B(), V("form", {
				key: 0,
				class: "token-library-add",
				"aria-label": "토큰 추가",
				onSubmit: t[17] ||= yu((...e) => a.addToken && a.addToken(...e), ["prevent"])
			}, [
				H("label", null, [t[23] ||= U("카테고리", -1), L(H("select", { "onUpdate:modelValue": t[11] ||= (e) => i.form.category = e }, [(B(!0), V(z, null, R(a.categories, (e) => (B(), V("option", { key: e }, P(e), 1))), 128))], 512), [[q, i.form.category]])]),
				H("label", null, [t[24] ||= U("토큰 유형", -1), L(H("select", { "onUpdate:modelValue": t[12] ||= (e) => i.form.type = e }, [(B(!0), V(z, null, R(i.types, (e) => (B(), V("option", { key: e }, P(e), 1))), 128))], 512), [[q, i.form.type]])]),
				H("label", null, [t[25] ||= U("토큰명", -1), L(H("input", {
					"onUpdate:modelValue": t[13] ||= (e) => i.form.name = e,
					required: "",
					placeholder: "--spacing-20"
				}, null, 512), [[
					K,
					i.form.name,
					void 0,
					{ trim: !0 }
				]])]),
				H("label", null, [t[26] ||= U("값", -1), L(H("textarea", {
					"onUpdate:modelValue": t[14] ||= (e) => i.form.value = e,
					placeholder: "직접 값 또는 Typography JSON"
				}, null, 512), [[K, i.form.value]])]),
				H("label", null, [t[27] ||= U("참조 토큰", -1), L(H("input", {
					"onUpdate:modelValue": t[15] ||= (e) => i.form.reference = e,
					placeholder: "--unit-20"
				}, null, 512), [[
					K,
					i.form.reference,
					void 0,
					{ trim: !0 }
				]])]),
				H("button", { disabled: i.busy }, "목록에 추가", 8, p_),
				H("button", {
					type: "button",
					onClick: t[16] ||= (e) => i.showAdd = !1
				}, "취소")
			], 32)) : W("", !0),
			i.importPreview ? (B(), V("div", m_, [
				t[28] ||= H("h3", null, "CSV 가져오기 확인", -1),
				H("p", null, P(i.importPreview.fileName) + " · " + P(i.importPreview.tokens.length) + "개 · 미완성 " + P(i.importPreview.warnings.length) + "개", 1),
				t[29] ||= H("p", null, "적용하면 현재 편집 목록 전체를 교체합니다. 미완성 항목은 보관되지만 실제 적용에서 제외됩니다.", -1),
				H("button", {
					type: "button",
					onClick: t[18] ||= (...e) => a.applyImport && a.applyImport(...e)
				}, "편집 목록에 반영"),
				H("button", {
					type: "button",
					onClick: t[19] ||= (e) => i.importPreview = null
				}, "취소")
			])) : W("", !0),
			a.analysis.errors.length ? (B(), V("div", h_, [H("strong", null, "검증 오류 " + P(a.analysis.errors.length) + "개", 1), (B(!0), V(z, null, R(a.analysis.errors.slice(0, 20), (e, t) => (B(), V("p", { key: t }, P(e.token) + ": " + P(e.message), 1))), 128))])) : W("", !0),
			H("div", {
				id: "token-panel",
				role: "tabpanel",
				"aria-labelledby": i.selectedCategory ? `token-tab-${a.categories.indexOf(i.selectedCategory)}` : "token-tab-all",
				class: "token-library-table"
			}, [H("table", null, [t[31] ||= H("thead", null, [H("tr", null, [
				H("th", null, "카테고리"),
				H("th", null, "토큰 유형"),
				H("th", null, "토큰명"),
				H("th", null, "값"),
				H("th", null, "참조 토큰"),
				H("th", null, "적용"),
				H("th", null, [H("span", { class: "token-library-sr" }, "작업")])
			])], -1), H("tbody", null, [(B(!0), V(z, null, R(a.filteredTokens, (e, t) => (B(), V("tr", { key: i.tokens.indexOf(e) }, [
				H("td", null, P(e.category), 1),
				H("td", null, [L(H("select", {
					"onUpdate:modelValue": (t) => e.type = t,
					"aria-label": `${e.name} 유형`,
					disabled: i.busy
				}, [(B(!0), V(z, null, R(i.types, (e) => (B(), V("option", { key: e }, P(e), 1))), 128))], 8, __), [[q, e.type]])]),
				H("td", null, [H("code", null, P(e.name), 1)]),
				H("td", null, [L(H("textarea", {
					"onUpdate:modelValue": (t) => e.value = t,
					"aria-label": `${e.name} 값`,
					disabled: i.busy,
					rows: "2",
					placeholder: "직접 값"
				}, null, 8, v_), [[K, e.value]])]),
				H("td", null, [L(H("input", {
					"onUpdate:modelValue": (t) => e.reference = t,
					"aria-label": `${e.name} 참조`,
					disabled: i.busy,
					placeholder: "참조 토큰명"
				}, null, 8, y_), [[
					K,
					e.reference,
					void 0,
					{ trim: !0 }
				]])]),
				H("td", null, P(a.states[e.name] === "active" ? "가능" : "미완성"), 1),
				H("td", null, [H("button", {
					type: "button",
					"aria-label": `${e.name} 제거`,
					disabled: i.busy,
					onClick: (t) => a.removeToken(e)
				}, "제거", 8, b_)])
			]))), 128)), a.filteredTokens.length ? W("", !0) : (B(), V("tr", x_, [...t[30] ||= [H("td", { colspan: "7" }, "이 카테고리에 토큰을 추가하세요.", -1)]]))])])], 8, g_)
		], 64)) : W("", !0)
	]);
}
var C_ = /*#__PURE__*/ jh(Ug, [["render", S_], ["__scopeId", "data-v-77d6eb26"]]);
Object.freeze({
	active: 0,
	validated: 1,
	draft: 2,
	inactive: 3,
	archived: 4
});
var w_ = Object.freeze([
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
]), T_ = Object.freeze({
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
function E_(e) {
	let t = String(e || "").trim();
	return T_[t] || {
		group: "other",
		order: 999,
		label: t || "알 수 없음",
		description: "이 프롬프트 유형의 관리 설명이 아직 등록되지 않았습니다.",
		executionMode: "실행 방식 미지정"
	};
}
function D_(e) {
	return w_.find((t) => t.key === e) || w_[w_.length - 1];
}
function O_(e) {
	let t = Number(e?.version);
	return Number.isFinite(t) ? t : 0;
}
function k_(e) {
	let t = Date.parse(e?.updatedAt || "");
	return Number.isFinite(t) ? t : 0;
}
function A_(e, t) {
	return O_(t) - O_(e) || k_(t) - k_(e) || String(e?.id || "").localeCompare(String(t?.id || ""));
}
function j_(e) {
	return String(e?.lineageId || "").trim() || `legacy:${String(e?.type || "unknown")}:${String(e?.id || "unknown")}`;
}
function M_(e) {
	return e && (e.active || e.validated || e.draft || e.latestInactive || e.latestArchived || e.versions?.[0]) || null;
}
function N_(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.filter((e) => e && typeof e == "object").forEach((e) => {
		let n = j_(e);
		t.has(n) || t.set(n, {
			lineageId: n,
			versions: []
		}), t.get(n).versions.push(e);
	}), [...t.values()].map((e) => {
		let t = [...e.versions].sort(A_), n = t.find((e) => e.status === "active") || null, r = t.find((e) => e.status === "validated") || null, i = t.find((e) => e.status === "draft") || null, a = t.find((e) => e.status === "inactive") || null, o = t.find((e) => e.status === "archived") || null, s = {
			...e,
			versions: t,
			active: n,
			validated: r,
			draft: i,
			latestInactive: a,
			latestArchived: o,
			archivedCount: t.filter((e) => e.status === "archived").length,
			hasCandidate: !!(r || i)
		}, c = M_(s);
		return {
			...s,
			primary: c,
			type: c?.type || t[0]?.type || "",
			name: c?.name || t[0]?.name || "",
			updatedAt: t.reduce((e, t) => k_(t) > k_(e) ? t : e, t[0] || null)?.updatedAt || null
		};
	}).sort((e, t) => D_(E_(e.type).group).order - D_(E_(t.type).group).order || E_(e.type).order - E_(t.type).order || String(e.name || "").localeCompare(String(t.name || "")) || String(e.lineageId).localeCompare(String(t.lineageId)));
}
function P_(e = [], t = "") {
	let n = String(t || "").trim();
	return n ? e.filter((e) => e.type === n) : e;
}
function F_(e = [], t = "") {
	let n = String(t || "");
	return e.find((e) => e.versions.some((e) => e.id === n)) || null;
}
function I_(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let n = D_(E_(e?.type).group);
		t.has(n.key) || t.set(n.key, {
			...n,
			promptGroups: []
		}), t.get(n.key).promptGroups.push(e);
	}), [...t.values()].map((e) => ({
		...e,
		promptGroups: [...e.promptGroups].sort((e, t) => E_(e?.type).order - E_(t?.type).order || String(e?.name || "").localeCompare(String(t?.name || "")))
	})).sort((e, t) => e.order - t.order);
}
function L_(e = [], t = "", n = "image_execution") {
	let r = F_(e, t);
	return r ? r.versions.find((e) => e.id === t) || r.primary || null : e.find((e) => e.type === n && e.active)?.active || e.find((e) => e.active)?.active || e[0]?.primary || null;
}
var R_ = Object.freeze({
	filterPromptGroups: P_,
	findPromptGroup: F_,
	groupPromptTemplateSections: I_,
	groupPromptTemplates: N_,
	promptLineageId: j_,
	promptTypeMeta: E_,
	promptWorkflowGroupMeta: D_,
	resolvePromptSelection: L_,
	selectPromptGroupPrimary: M_
}), z_ = /* @__PURE__ */ new Set([
	"image_execution",
	"lofi_draft",
	"final_design",
	"final_design_v2",
	"section_background_image",
	"component_image"
]), B_ = /* @__PURE__ */ new Set([
	"integrated_brief",
	"integrated_brief_v2",
	"section_layout_planner",
	"multi_component_layout_planner",
	"section_composition_planner",
	"promo_overview_parser",
	"promo_template_recommender",
	"promo_template_composer",
	"promo_page_composer",
	"promo_composition_editor",
	"component_visual_analyzer",
	"promo_page_generation"
]), V_ = Object.freeze([
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
function H_(e) {
	return z_.has(String(e || "")) ? "image" : "text";
}
function U_(e) {
	return z_.has(String(e || "")) ? "image" : B_.has(String(e || "")) ? "json_object" : "text";
}
function W_({ provider: e, type: t } = {}) {
	let n = H_(t);
	return V_.filter((t) => t.provider === e && t.modality === n);
}
function G_(e, t) {
	return V_.find((n) => n.provider === e && n.model === t) || null;
}
function K_({ provider: e, type: t } = {}) {
	let n = W_({
		provider: e,
		type: t
	});
	return n.find((e) => e.recommended) || n[0] || null;
}
function q_({ provider: e, model: t, type: n } = {}) {
	let r = G_(e, t);
	if (!r) return null;
	let i = U_(n), a = {
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
var J_ = Object.freeze({
	findModel: G_,
	listModels: W_,
	presetFor: q_,
	promptModality: H_,
	recommendedModel: K_,
	responseFormatForPrompt: U_
});
//#endregion
//#region admin-app/src/services/llm-model-registry-service.mjs
async function Y_(e = {}) {
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
var X_ = Object.freeze({
	async list() {
		return Y_();
	},
	async create(e) {
		return Y_({
			method: "POST",
			body: JSON.stringify(e)
		});
	},
	async update(e, t) {
		return Y_({
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				...t
			})
		});
	}
}), Z_ = {
	class: "llm-registry",
	"aria-labelledby": "llm-registry-title"
}, Q_ = { class: "llm-registry__header" }, $_ = { class: "llm-registry__header-actions" }, ev = ["disabled"], tv = {
	class: "llm-registry__summary",
	"aria-label": "LLM 모델 현황"
}, nv = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, rv = { class: "llm-registry__workspace" }, iv = { class: "llm-registry__list" }, av = { class: "llm-registry__filters" }, ov = {
	class: "llm-registry__rows",
	"aria-live": "polite"
}, sv = ["onClick"], cv = { class: "llm-registry__row-main" }, lv = { class: "llm-registry__row-details" }, uv = { class: "llm-registry__row-meta" }, dv = {
	key: 0,
	class: "llm-registry__empty"
}, fv = { class: "llm-registry__editor-heading" }, pv = { key: 0 }, mv = ["disabled"], hv = { class: "llm-registry__grid" }, gv = ["disabled"], _v = ["disabled"], vv = { class: "llm-registry__field-title" }, yv = ["aria-expanded"], bv = { key: 0 }, xv = { class: "llm-registry__wide" }, Sv = { class: "llm-registry__checks" }, Cv = { class: "llm-registry__wide" }, wv = { class: "llm-registry__wide" }, Tv = { class: "llm-registry__actions" }, Ev = ["disabled"], Dv = ["disabled"], Ov = ["disabled"], kv = {
	key: 0,
	class: "llm-registry__history",
	open: ""
}, Av = { class: "llm-registry__history-list" }, jv = ["datetime"], Mv = {
	key: 0,
	class: "llm-registry__empty"
}, Nv = /*#__PURE__*/ jh({
	__name: "LlmModelManager",
	emits: ["status"],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ I(!1), i = /* @__PURE__ */ I(!1), a = /* @__PURE__ */ I(""), o = /* @__PURE__ */ I([]), s = /* @__PURE__ */ I([]), c = /* @__PURE__ */ I(""), l = /* @__PURE__ */ I(""), u = /* @__PURE__ */ I(""), d = /* @__PURE__ */ I(""), f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I(null), m = () => ({
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
		}), h = /* @__PURE__ */ fn(m()), g = G(() => o.value.find((e) => e.id === c.value) || null), _ = G(() => g.value ? s.value.filter((e) => e.llmModelId === g.value.id || e.provider === g.value.provider && e.modelId === g.value.modelId) : []), v = G(() => {
			let e = l.value.trim().toLowerCase();
			return o.value.filter((t) => u.value && t.provider !== u.value || d.value && t.status !== d.value ? !1 : !e || [
				t.displayName,
				t.modelId,
				t.description
			].some((t) => String(t || "").toLowerCase().includes(e))).sort((e, t) => Number(t.usage?.total || 0) - Number(e.usage?.total || 0) || String(e.provider || "").localeCompare(String(t.provider || ""), "en", { sensitivity: "base" }) || String(e.displayName || "").localeCompare(String(t.displayName || ""), "en", {
				sensitivity: "base",
				numeric: !0
			}));
		}), y = G(() => ({
			total: o.value.length,
			active: o.value.filter((e) => e.status === "active").length,
			used: o.value.filter((e) => e.usage?.total > 0).length
		}));
		function b(e) {
			return {
				draft: "초안",
				active: "활성",
				inactive: "사용 중지"
			}[e] || e;
		}
		function x(e) {
			return e === "image" ? "이미지 생성·편집" : "텍스트·JSON";
		}
		function S(e) {
			return e.previousStatus ? e.previousStatus === e.newStatus ? "설정 수정" : `${b(e.previousStatus)} → ${b(e.newStatus)}` : "모델 등록";
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
				let t = await X_.list();
				o.value = t.models || [], s.value = t.histories || [];
				let n = o.value.find((t) => t.id === e);
				n ? E(n) : o.value.length && !c.value ? E(o.value[0]) : o.value.length || T();
			} catch (e) {
				a.value = e.message;
			} finally {
				r.value = !1;
			}
		}
		async function A() {
			i.value = !0, a.value = "";
			try {
				let e = O();
				if (!e.modelId || !e.displayName) throw Error("모델 ID와 표시 이름을 입력해 주세요.");
				let t = !g.value;
				await k((t ? await X_.create({
					...e,
					status: "draft"
				}) : await X_.update(g.value.id, e)).model.id), n("status", t ? "LLM 모델 초안을 등록했습니다." : "LLM 모델 설정을 저장했습니다.");
			} catch (e) {
				a.value = e.message;
			} finally {
				i.value = !1;
			}
		}
		async function ee(e) {
			if (g.value) {
				i.value = !0, a.value = "";
				try {
					await k((await X_.update(g.value.id, {
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
		return fa(() => {
			k(), document.addEventListener("click", w), document.addEventListener("keydown", w);
		}), ha(() => {
			document.removeEventListener("click", w), document.removeEventListener("keydown", w);
		}), (e, t) => (B(), V("section", Z_, [
			H("header", Q_, [t[22] ||= H("div", null, [
				H("span", { class: "llm-registry__eyebrow" }, "LLM Registry"),
				H("h2", { id: "llm-registry-title" }, "LLM 모델 관리"),
				H("p", null, "프로모션 생성기에서 사용할 모델과 기본 실행값을 중앙에서 등록하고 관리합니다. API Key는 이 화면에 저장하지 않습니다.")
			], -1), H("div", $_, [H("button", {
				class: "tiny-button",
				type: "button",
				disabled: r.value,
				onClick: t[0] ||= (e) => k()
			}, "새로고침", 8, ev), H("button", {
				class: "tiny-button primary",
				type: "button",
				onClick: T
			}, "신규 모델 등록")])]),
			H("div", tv, [
				H("div", null, [H("strong", null, P(y.value.total), 1), t[23] ||= H("span", null, "전체 모델", -1)]),
				H("div", null, [H("strong", null, P(y.value.active), 1), t[24] ||= H("span", null, "활성 모델", -1)]),
				H("div", null, [H("strong", null, P(y.value.used), 1), t[25] ||= H("span", null, "프롬프트 연결", -1)])
			]),
			a.value ? (B(), V("div", nv, [t[26] ||= H("strong", null, "LLM 모델 관리 오류", -1), H("span", null, P(a.value), 1)])) : W("", !0),
			H("div", rv, [H("aside", iv, [H("div", av, [
				L(H("input", {
					"onUpdate:modelValue": t[1] ||= (e) => l.value = e,
					type: "search",
					"aria-label": "LLM 모델 검색",
					placeholder: "모델 이름 또는 ID 검색"
				}, null, 512), [[K, l.value]]),
				L(H("select", {
					"onUpdate:modelValue": t[2] ||= (e) => u.value = e,
					"aria-label": "LLM Provider 필터"
				}, [...t[27] ||= [
					H("option", { value: "" }, "전체 Provider", -1),
					H("option", { value: "openai" }, "OpenAI", -1),
					H("option", { value: "google" }, "Google", -1)
				]], 512), [[q, u.value]]),
				L(H("select", {
					"onUpdate:modelValue": t[3] ||= (e) => d.value = e,
					"aria-label": "LLM 상태 필터"
				}, [...t[28] ||= [
					H("option", { value: "" }, "전체 상태", -1),
					H("option", { value: "active" }, "활성", -1),
					H("option", { value: "draft" }, "초안", -1),
					H("option", { value: "inactive" }, "사용 중지", -1)
				]], 512), [[q, d.value]])
			]), H("div", ov, [(B(!0), V(z, null, R(v.value, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				class: N(["llm-registry__row", { selected: e.id === c.value }]),
				onClick: (t) => E(e)
			}, [H("span", cv, [
				H("strong", null, P(e.displayName), 1),
				H("small", null, P(e.modelId), 1),
				H("span", lv, [H("small", null, [t[29] ||= H("b", null, "모델 용도", -1), U(P(x(e.modality)), 1)]), H("small", null, [t[30] ||= H("b", null, "연결 프롬프트", -1), U(P(e.usage?.total || 0) + "개", 1)])])
			]), H("span", uv, [H("em", { class: N(`is-${e.status}`) }, P(b(e.status)), 3), H("small", null, P(e.provider), 1)])], 10, sv))), 128)), !r.value && !v.value.length ? (B(), V("p", dv, "조건에 맞는 모델이 없습니다.")) : W("", !0)])]), H("form", {
				class: "llm-registry__editor",
				onSubmit: yu(A, ["prevent"])
			}, [
				H("div", fv, [H("div", null, [H("strong", null, P(g.value ? g.value.displayName : "신규 LLM 모델"), 1), g.value ? (B(), V("span", pv, "프롬프트 " + P(g.value.usage?.total || 0) + "개 연결 · 운영 상태 " + P(g.value.usage?.active || 0) + "개", 1)) : W("", !0)]), g.value ? (B(), V("span", {
					key: 0,
					class: N(["llm-registry__status", `is-${g.value.status}`])
				}, P(b(g.value.status)), 3)) : W("", !0)]),
				H("fieldset", {
					disabled: i.value,
					class: "llm-registry__fields"
				}, [
					H("div", hv, [
						H("label", null, [t[32] ||= H("span", null, "Provider", -1), L(H("select", {
							"onUpdate:modelValue": t[4] ||= (e) => h.provider = e,
							disabled: !!g.value
						}, [...t[31] ||= [H("option", { value: "openai" }, "OpenAI", -1), H("option", { value: "google" }, "Google", -1)]], 8, gv), [[q, h.provider]])]),
						H("label", null, [t[33] ||= H("span", null, "모델 ID", -1), L(H("input", {
							"onUpdate:modelValue": t[5] ||= (e) => h.modelId = e,
							disabled: !!g.value,
							type: "text",
							autocomplete: "off",
							placeholder: "gpt-... / gemini-..."
						}, null, 8, _v), [[K, h.modelId]])]),
						H("label", null, [t[34] ||= H("span", null, "표시 이름", -1), L(H("input", {
							"onUpdate:modelValue": t[6] ||= (e) => h.displayName = e,
							type: "text",
							autocomplete: "off"
						}, null, 512), [[K, h.displayName]])]),
						H("label", null, [t[36] ||= H("span", null, "모델 용도", -1), L(H("select", {
							"onUpdate:modelValue": t[7] ||= (e) => h.modality = e,
							onChange: D
						}, [...t[35] ||= [H("option", { value: "text" }, "텍스트·JSON", -1), H("option", { value: "image" }, "이미지 생성·편집", -1)]], 544), [[q, h.modality]])]),
						H("label", null, [H("span", vv, [t[41] ||= U(" 기본 Temperature ", -1), H("span", {
							ref_key: "temperatureGuideRoot",
							ref: p,
							class: "llm-registry__guide-anchor"
						}, [H("button", {
							class: "llm-registry__guide-button",
							type: "button",
							"aria-label": "기본 Temperature 가이드",
							"aria-controls": "temperature-guide-popover",
							"aria-expanded": String(f.value),
							onClick: t[8] ||= yu((e) => f.value = !f.value, ["stop"])
						}, "i", 8, yv), f.value ? (B(), V("span", {
							key: 0,
							id: "temperature-guide-popover",
							class: "llm-registry__guide-popover",
							role: "dialog",
							"aria-label": "Temperature 설정 가이드",
							onClick: t[10] ||= yu(() => {}, ["stop"])
						}, [
							t[37] ||= H("strong", null, "Temperature 설정 가이드", -1),
							t[38] ||= H("span", null, [H("b", null, "0~0.2"), U(" 구조화 JSON·레이아웃처럼 일관성이 중요한 작업")], -1),
							t[39] ||= H("span", null, [H("b", null, "0.3~0.7"), U(" 프로모션 카피와 아이디어처럼 적당한 다양성이 필요한 작업")], -1),
							t[40] ||= H("span", null, [H("b", null, "미설정"), U(" 모델 기본값 사용. GPT-6 Reasoning·이미지 모델에 권장")], -1),
							H("button", {
								type: "button",
								onClick: t[9] ||= (e) => f.value = !1
							}, "닫기")
						])) : W("", !0)], 512)]), L(H("input", {
							"onUpdate:modelValue": t[11] ||= (e) => h.defaultTemperature = e,
							type: "number",
							min: "0",
							max: "2",
							step: "0.1",
							placeholder: "미설정"
						}, null, 512), [[K, h.defaultTemperature]])]),
						H("label", null, [t[42] ||= H("span", null, "기본 Max Tokens", -1), L(H("input", {
							"onUpdate:modelValue": t[12] ||= (e) => h.defaultMaxTokens = e,
							type: "number",
							min: "1",
							step: "1",
							placeholder: "미설정"
						}, null, 512), [[K, h.defaultMaxTokens]])]),
						H("label", null, [t[44] ||= H("span", null, "기본 응답 형식", -1), L(H("select", { "onUpdate:modelValue": t[13] ||= (e) => h.defaultResponseFormat = e }, [...t[43] ||= [
							H("option", { value: "text" }, "text", -1),
							H("option", { value: "json_object" }, "json_object", -1),
							H("option", { value: "image" }, "image", -1)
						]], 512), [[q, h.defaultResponseFormat]])]),
						h.modality === "image" ? (B(), V("label", bv, [
							t[45] ||= H("span", null, "지원 이미지 크기", -1),
							L(H("input", {
								"onUpdate:modelValue": t[14] ||= (e) => h.supportedImageSizesText = e,
								type: "text",
								placeholder: "1K, 2K, 4K"
							}, null, 512), [[K, h.supportedImageSizesText]]),
							t[46] ||= H("small", null, "쉼표로 구분합니다.", -1)
						])) : W("", !0)
					]),
					H("label", xv, [t[47] ||= H("span", null, "설명", -1), L(H("textarea", {
						"onUpdate:modelValue": t[15] ||= (e) => h.description = e,
						rows: "3"
					}, null, 512), [[K, h.description]])]),
					H("div", Sv, [H("label", null, [L(H("input", {
						"onUpdate:modelValue": t[16] ||= (e) => h.isRecommended = e,
						type: "checkbox"
					}, null, 512), [[su, h.isRecommended]]), t[48] ||= U(" 권장 모델", -1)]), H("label", null, [L(H("input", {
						"onUpdate:modelValue": t[17] ||= (e) => h.isLegacy = e,
						type: "checkbox"
					}, null, 512), [[su, h.isLegacy]]), t[49] ||= U(" 레거시 모델", -1)])]),
					H("label", Cv, [t[50] ||= H("span", null, "Provider 기본 옵션(JSON)", -1), L(H("textarea", {
						"onUpdate:modelValue": t[18] ||= (e) => h.modelOptionsText = e,
						rows: "7",
						spellcheck: "false"
					}, null, 512), [[K, h.modelOptionsText]])]),
					H("label", wv, [t[51] ||= H("span", null, "변경 사유", -1), L(H("input", {
						"onUpdate:modelValue": t[19] ||= (e) => h.changeNote = e,
						type: "text",
						autocomplete: "off",
						placeholder: "등록 또는 변경 이유"
					}, null, 512), [[K, h.changeNote]])])
				], 8, mv),
				H("div", Tv, [
					H("button", {
						class: "tiny-button primary",
						type: "submit",
						disabled: i.value || !h.modelId || !h.displayName
					}, P(g.value ? "설정 저장" : "초안 등록"), 9, Ev),
					g.value?.status === "active" ? W("", !0) : (B(), V("button", {
						key: 0,
						class: "tiny-button",
						type: "button",
						disabled: i.value,
						onClick: t[20] ||= (e) => ee("active")
					}, "활성화", 8, Dv)),
					g.value?.status === "active" ? (B(), V("button", {
						key: 1,
						class: "tiny-button danger",
						type: "button",
						disabled: i.value,
						onClick: t[21] ||= (e) => ee("inactive")
					}, "사용 중지", 8, Ov)) : W("", !0)
				]),
				t[53] ||= H("p", { class: "llm-registry__guard" }, "Provider와 모델 ID는 등록 후 변경할 수 없습니다. 사용 중인 프롬프트가 있으면 모델을 중지할 수 없습니다.", -1),
				g.value ? (B(), V("details", kv, [H("summary", null, [H("span", null, [t[52] ||= H("strong", null, "LLM 업데이트 내역", -1), H("small", null, "등록·설정 수정·상태 변경 " + P(_.value.length) + "건", 1)])]), H("div", Av, [(B(!0), V(z, null, R(_.value, (e) => (B(), V("article", {
					key: e.id,
					class: "llm-registry__history-item"
				}, [
					H("div", null, [H("strong", null, P(S(e)), 1), H("time", { datetime: e.changedAt }, P(C(e.changedAt)), 9, jv)]),
					H("p", null, P(e.changeNote || "변경 사유 없음"), 1),
					H("span", null, P(e.changedBy || "system") + " · " + P(e.snapshot?.defaultResponseFormat || "-") + " · Max " + P(e.snapshot?.defaultMaxTokens || "-"), 1)
				]))), 128)), _.value.length ? W("", !0) : (B(), V("p", Mv, "기록된 업데이트 내역이 없습니다."))])])) : W("", !0)
			], 32)])
		]));
	}
}, [["__scopeId", "data-v-990ebc13"]]);
//#endregion
//#region admin-app/src/services/prompt-variable-service.mjs
async function Pv() {
	let e = await fetch("/api/prompt-variables", { cache: "no-store" }), t = await e.json().catch(() => ({}));
	if (!e.ok) throw Error(t.message || t.error || `프롬프트 변수 요청 오류(${e.status})`);
	return t;
}
var Fv = Object.freeze({ list: Pv }), Iv = {
	class: "prompt-variable-manager",
	"aria-labelledby": "prompt-variable-title"
}, Lv = { class: "prompt-variable-manager__header" }, Rv = ["disabled"], zv = {
	class: "prompt-variable-manager__summary",
	"aria-label": "프롬프트 변수 현황"
}, Bv = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, Vv = { class: "prompt-variable-manager__workspace" }, Hv = { class: "prompt-variable-manager__list" }, Uv = { class: "prompt-variable-manager__filters" }, Wv = {
	class: "prompt-variable-manager__rows",
	"aria-live": "polite"
}, Gv = ["onClick"], Kv = { class: "prompt-variable-manager__badges" }, qv = {
	key: 0,
	class: "is-required"
}, Jv = {
	key: 1,
	class: "is-optional"
}, Yv = {
	key: 0,
	class: "prompt-variable-manager__empty"
}, Xv = { class: "prompt-variable-manager__detail" }, Zv = { class: "prompt-variable-manager__detail-heading" }, Qv = { class: "prompt-variable-manager__usage-list" }, $v = {
	key: 1,
	class: "prompt-variable-manager__empty"
}, ey = /*#__PURE__*/ jh({
	__name: "PromptVariableManager",
	setup(e) {
		let t = /* @__PURE__ */ I(!1), n = /* @__PURE__ */ I(""), r = /* @__PURE__ */ I([]), i = /* @__PURE__ */ I({
			variableCount: 0,
			promptTypeCount: 0,
			requiredUsageCount: 0,
			optionalUsageCount: 0
		}), a = /* @__PURE__ */ I(""), o = /* @__PURE__ */ I(""), s = /* @__PURE__ */ I(""), c = G(() => {
			let e = o.value.trim().toLowerCase();
			return r.value.filter((t) => s.value === "required" && !t.requiredCount || s.value === "optional" && !t.optionalCount ? !1 : !e || t.key.toLowerCase().includes(e) || t.usages.some((t) => `${t.promptType} ${t.promptName}`.toLowerCase().includes(e)));
		}), l = G(() => r.value.find((e) => e.key === a.value) || null);
		function u(e) {
			return e === "required" ? "필수" : "선택";
		}
		async function d() {
			t.value = !0, n.value = "";
			try {
				let e = await Fv.list();
				r.value = e.variables || [], i.value = e.summary || i.value, r.value.some((e) => e.key === a.value) || (a.value = r.value[0]?.key || "");
			} catch (e) {
				n.value = e.message;
			} finally {
				t.value = !1;
			}
		}
		return fa(d), (e, r) => (B(), V("section", Iv, [
			H("header", Lv, [r[2] ||= H("div", null, [
				H("span", { class: "prompt-variable-manager__eyebrow" }, "Prompt Contract Registry"),
				H("h2", { id: "prompt-variable-title" }, "프롬프트 변수 관리"),
				H("p", null, "현재 실행 코드와 프롬프트 사이에 등록된 필수·선택 변수 계약을 조회합니다.")
			], -1), H("button", {
				class: "tiny-button",
				type: "button",
				disabled: t.value,
				onClick: d
			}, "새로고침", 8, Rv)]),
			r[10] ||= H("div", { class: "prompt-variable-manager__notice" }, [H("strong", null, "현재는 읽기 전용입니다."), H("span", null, "신규 변수는 실행 코드가 값을 공급할 수 있도록 개발된 뒤 계약에 등록해야 합니다.")], -1),
			H("div", zv, [
				H("div", null, [H("strong", null, P(i.value.variableCount), 1), r[3] ||= H("span", null, "고유 변수", -1)]),
				H("div", null, [H("strong", null, P(i.value.promptTypeCount), 1), r[4] ||= H("span", null, "프롬프트 유형", -1)]),
				H("div", null, [H("strong", null, P(i.value.requiredUsageCount), 1), r[5] ||= H("span", null, "필수 연결", -1)]),
				H("div", null, [H("strong", null, P(i.value.optionalUsageCount), 1), r[6] ||= H("span", null, "선택 연결", -1)])
			]),
			n.value ? (B(), V("div", Bv, [r[7] ||= H("strong", null, "변수 목록 오류", -1), H("span", null, P(n.value), 1)])) : W("", !0),
			H("div", Vv, [H("aside", Hv, [H("div", Uv, [L(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => o.value = e,
				type: "search",
				"aria-label": "프롬프트 변수 검색",
				placeholder: "변수명 또는 프롬프트 검색"
			}, null, 512), [[K, o.value]]), L(H("select", {
				"onUpdate:modelValue": r[1] ||= (e) => s.value = e,
				"aria-label": "변수 구분 필터"
			}, [...r[8] ||= [
				H("option", { value: "" }, "전체 구분", -1),
				H("option", { value: "required" }, "필수 변수", -1),
				H("option", { value: "optional" }, "선택 변수", -1)
			]], 512), [[q, s.value]])]), H("div", Wv, [(B(!0), V(z, null, R(c.value, (e) => (B(), V("button", {
				key: e.key,
				type: "button",
				class: N(["prompt-variable-manager__row", { selected: e.key === a.value }]),
				onClick: (t) => a.value = e.key
			}, [H("span", null, [H("strong", null, P(e.key), 1), H("small", null, "연결된 프롬프트 유형 " + P(e.promptTypeCount) + "개", 1)]), H("span", Kv, [e.requiredCount ? (B(), V("em", qv, "필수 " + P(e.requiredCount), 1)) : W("", !0), e.optionalCount ? (B(), V("em", Jv, "선택 " + P(e.optionalCount), 1)) : W("", !0)])], 10, Gv))), 128)), !t.value && !c.value.length ? (B(), V("p", Yv, "조건에 맞는 변수가 없습니다.")) : W("", !0)])]), H("section", Xv, [l.value ? (B(), V(z, { key: 0 }, [H("div", Zv, [H("div", null, [r[9] ||= H("small", null, "변수 키", -1), H("strong", null, P(l.value.key), 1)]), H("span", null, "총 " + P(l.value.promptTypeCount) + "개 프롬프트 유형에서 사용", 1)]), H("div", Qv, [(B(!0), V(z, null, R(l.value.usages, (e) => (B(), V("article", { key: `${e.promptType}-${e.requirement}` }, [H("div", null, [H("strong", null, P(e.promptName), 1), H("code", null, P(e.promptType), 1)]), H("em", { class: N(`is-${e.requirement}`) }, P(u(e.requirement)), 3)]))), 128))])], 64)) : (B(), V("p", $v, "왼쪽에서 변수를 선택해 주세요."))])])
		]));
	}
}, [["__scopeId", "data-v-7c369cc6"]]);
//#endregion
//#region admin-app/src/services/section-layout-preset-service.mjs
async function ty(e, t = {}, n = globalThis.fetch) {
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
function ny(e = []) {
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
function ry(e, t, n = globalThis.location?.origin) {
	return Dh.sectionPreset(e, t, n);
}
var iy = Object.freeze({
	list(e, t) {
		return ty(`/api/wizard-content-section-layouts?sectionId=${encodeURIComponent(e)}`, {}, t);
	},
	create(e, t) {
		return ty("/api/wizard-content-section-layouts", {
			method: "POST",
			body: JSON.stringify(e)
		}, t);
	},
	update(e, t, n, r) {
		return ty("/api/wizard-content-section-layout", {
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				sectionId: t,
				...n
			})
		}, r);
	},
	remove(e, t, n) {
		return ty(`/api/wizard-content-section-layout?id=${encodeURIComponent(e)}&sectionId=${encodeURIComponent(t)}`, { method: "DELETE" }, n);
	},
	setDefault(e, t, n) {
		return ty("/api/wizard-content-section-layout-default", {
			method: "POST",
			body: JSON.stringify({
				id: e,
				sectionId: t
			})
		}, n);
	},
	updateAiLayoutVariants(e, t, n) {
		return ty("/api/wizard-content-section", {
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
	editorUrl: ry
}), ay = {
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
		let n = e, r = t, i = G(() => {
			let e = new URL(iy.editorUrl(n.section.id, n.layout.layoutKey));
			return e.searchParams.set("embedded", "1"), e.toString();
		});
		function a(e) {
			e.type === "promo-section-layout-saved" && (e.sectionId !== n.section.id || e.layoutId !== n.layout.id || r("saved", e));
		}
		return (t, n) => (B(), js(Bh, {
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
}, oy = {
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
	paddingPx: "padding",
	layoutGapPx: "gap",
	mobileLayoutGapPx: "gap",
	layoutPaddingBlockPx: "padding",
	mobileLayoutPaddingBlockPx: "padding"
}, sy = (e) => String(e ?? "").trim().toLowerCase().replace(/\s+/g, " "), cy = /* @__PURE__ */ new Set([
	"fontSize",
	"letterSpacing",
	"paddingPx",
	"layoutGapPx",
	"mobileLayoutGapPx",
	"layoutPaddingBlockPx",
	"mobileLayoutPaddingBlockPx"
]);
function ly(e, t = {}, n = [], r = null, i = []) {
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
		return !lg(r, {
			tokenKey: e,
			property: t,
			target: /(?:layoutGapPx|mobileLayoutGapPx|layoutPaddingBlockPx|mobileLayoutPaddingBlockPx)$/.test(n) ? "layout" : cg(t, {
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
			let c = oy[i.endsWith("Token") ? i.slice(0, -5) : i];
			if (i.endsWith("Token") || t.endsWith(".tokenBindings")) u(o, c, `${t}.${i}`, n) ? r[i] = o : s.push({
				code: "UNREGISTERED_DESIGN_TOKEN",
				path: `${t}.${i}`,
				value: o
			});
			else if (c) {
				let e = sy(typeof o == "number" && cy.has(i) ? `${o}px` : o);
				Object.keys(a).some((r) => u(r, c, `${t}.${i}`, n) && sy(a[r]) === e) ? r[i] = o : s.push({
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
var uy = /^--[a-z][a-z0-9-]*$/;
function dy(e) {
	if (Array.isArray(e)) {
		let t = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			if (e?.metadata?.libraryToken && (e.metadata.state !== "active" || e.metadata.libraryToken.type === "typography" || e.valueType === "typography")) return;
			let n = String(e?.tokenKey || e?.token_key || "").trim(), r = String(e?.value ?? e?.tokenValue ?? e?.token_value ?? "").trim();
			!uy.test(n) || !r || (t.has(n) || t.set(n, []), t.get(n).push({
				value: r,
				valueIndex: Math.max(0, Number.parseInt(e?.valueIndex ?? e?.value_index ?? 0, 10) || 0)
			}));
		}), Object.fromEntries([...t.entries()].map(([e, t]) => [e, t.sort((e, t) => e.valueIndex - t.valueIndex).map((e) => e.value).join(", ")]));
	}
	return !e || typeof e != "object" ? {} : Object.fromEntries(Object.entries(e).map(([e, t]) => [String(e).trim(), String(t ?? "").trim()]).filter(([e, t]) => uy.test(e) && t));
}
function fy(e, t = {}) {
	let n = dy(e);
	if (t.usagePolicy) return {
		...n,
		...og(t.usagePolicy, n)
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
var py = /* @__PURE__ */ new Set(["http:", "https:"]);
function my(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return py.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
var hy = 24e3;
function gy(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
}
function _y(e) {
	return Math.round(Number(e) * 100) / 100;
}
function vy(e, t) {
	let n = Number(e);
	return gy(Number.isFinite(n) && n > 0 ? n : t, 50, hy, 50);
}
function yy(e = [], t = () => ({}), n = (e) => by(e), r = 20) {
	let i = 0, a = 0, o = 0, s = 0;
	return (Array.isArray(e) ? e : []).forEach((e) => {
		let r = t(e) || {}, c = Math.max(0, Number(n(e, r)) || by(e));
		if (r.positionMode === "free") {
			s += 1, a = Math.max(a, Math.max(0, Number(r.yPx) || 0) + c);
			return;
		}
		o += 1, i += c;
	}), Math.max(50, o ? i + r : 0, s ? a + r : 0);
}
function by(e = {}) {
	let t = Array.isArray(e.fields) ? e.fields : [];
	return t.length > 1 ? t.reduce((e, t) => e + by(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
}
function xy(e = {}) {
	return (Array.isArray(e.fields) ? e.fields : []).length > 1 ? 100 : e.fieldKind === "image" ? 44 : e.fieldKind === "cta" ? 24 : e.textType === "title" || e.textType === "headline" ? 72 : (e.textType === "lead" || e.textType === "multi" || e.fieldKind, 60);
}
function Sy(e = {}, t = {}) {
	return e.fieldKind === "image" ? !1 : t.heightMode === "auto" || e.fieldKind === "text" && t.heightMode !== "fixed";
}
function Cy(e = {}, t = {}) {
	if (!Sy(e, t)) return gy(t.heightPx, 24, 900, by(e));
}
function wy({ item: e = {}, style: t = {}, canvasWidth: n, fallbackX: r = 0, fallbackY: i = 0 } = {}) {
	let a = Math.max(1, Number(n) || 1280), o = gy(t.widthPct, 4, 100, xy(e)), s = gy(t.heightPx, 24, 900, by(e));
	return {
		x: gy(t.xPct, 0, 100, r) / 100 * a,
		y: gy(t.yPx, 0, hy, i),
		width: o / 100 * a,
		height: s,
		widthPct: o,
		fontSize: gy(t.fontSize, 0, 80, 18)
	};
}
function Ty(e, t, { includeHeight: n = !0, includeFontSize: r = !0 } = {}) {
	let i = Math.max(1, Number(t) || 1280);
	return {
		positionMode: "free",
		xPct: _y(e.x / i * 100),
		yPx: _y(e.y),
		widthPct: _y(e.width / i * 100),
		...n ? { heightPx: _y(e.height) } : {},
		...r ? { fontSize: _y(e.fontSize) } : {}
	};
}
//#endregion
//#region visual-editor/src/platform/layout-engine/resize.mjs
function Ey(e, t) {
	return String(e || "se").includes(t);
}
function Dy({ geometry: e, deltaX: t = 0, deltaY: n = 0, direction: r = "se", minimumWidth: i = 1, minimumHeight: a = 1, maximumWidth: o = Infinity, maximumHeight: s = 900, aspectRatioLocked: c = !1, aspectRatio: l = 1, scaleFont: u = !0, maximumFontSize: d = 80 } = {}) {
	let f = {
		x: Number(e?.x) || 0,
		y: Number(e?.y) || 0,
		width: Math.max(i, Number(e?.width) || i),
		height: Math.max(a, Number(e?.height) || a),
		fontSize: gy(e?.fontSize, 0, d, 18)
	}, p = Ey(r, "w"), m = Ey(r, "e"), h = Ey(r, "n"), g = Ey(r, "s"), _ = p || m, v = h || g, y = _ ? p ? -t : t : 0, b = v ? h ? -n : n : 0, x = _ ? gy(f.width + y, i, o, f.width) : f.width, S = v ? gy(f.height + b, a, s, f.height) : f.height;
	if (c) {
		let e = Number(l) > 0 ? Number(l) : 1;
		v && (!_ || Math.abs(n) > Math.abs(t)) ? (x = gy(S * e, i, o, f.width), S = gy(x / e, a, s, f.height)) : (S = gy(x / e, a, s, f.height), x = gy(S * e, i, o, f.width));
	}
	let C = p ? f.x + f.width - x : f.x, w = h ? f.y + f.height - S : f.y, T = f.width ? x / f.width : 1, E = f.height ? S / f.height : 1, D = _ && v ? Math.sqrt(T * E) : _ ? T : E, O = Math.max(_ ? x - f.width : 0, v ? S - f.height : 0, 0), k = f.fontSize === 0 ? O / 4 : f.fontSize * D, A = u ? gy(k, 0, d, f.fontSize) : f.fontSize;
	return {
		x: _y(C),
		y: _y(w),
		width: _y(x),
		height: _y(S),
		fontSize: _y(A),
		widthScale: T,
		heightScale: E
	};
}
//#endregion
//#region visual-editor/src/platform/render-spec/RenderSpecNode.vue
var Oy = ["src", "alt"], ky = /*@__PURE__*/ Object.assign({ name: "RenderSpecNode" }, {
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
		let n = e, r = t, i = G(() => n.editable ? {
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
			let o = Ca("RenderSpecNode", !0);
			return B(), js(Ta(e.node.tag), Gs({
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
				default: Mr(() => [e.node.nodeType === "field" && e.node.tag === "picture" && e.node.imageSrc ? (B(), V("img", {
					key: 0,
					class: "render-spec-picture-image",
					src: e.node.imageSrc,
					alt: e.node.imageAlt
				}, null, 8, Oy)) : e.node.nodeType === "field" && e.node.tag !== "img" ? (B(), V(z, { key: 1 }, [U(P(e.node.text), 1)], 64)) : W("", !0), (B(!0), V(z, null, R(e.node.tag === "img" ? [] : e.node.children, (t) => (B(), js(o, {
					key: t.path,
					node: t,
					editable: e.editable,
					onSelectField: n[0] ||= (e) => r("select-field", e)
				}, null, 8, ["node", "editable"]))), 128))]),
				_: 1
			}, 16, ["class", "style"]);
		};
	}
}), Ay = /* @__PURE__ */ new Set([
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
]), jy = /* @__PURE__ */ new Set([
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
]), My = Object.freeze({
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
}), Ny = Object.freeze({
	gapToken: "gap",
	rowGapToken: "rowGap",
	columnGapToken: "columnGap",
	paddingToken: "padding",
	paddingTopToken: "paddingTop",
	paddingRightToken: "paddingRight",
	paddingBottomToken: "paddingBottom",
	paddingLeftToken: "paddingLeft"
});
function Py(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Fy(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Iy(e) {
	let t = String(e || "").trim();
	return /^--[a-z][a-z0-9-]*$/.test(t) ? `var(${t})` : void 0;
}
function Ly(e) {
	let t = String(e || "").trim();
	return Iy(t) || (/^(?:0|[1-9]\d{0,3}px|(?:100|\d{1,2})(?:\.\d+)?%)$/.test(t) ? t : void 0);
}
function Ry(e) {
	let t = String(e || "").trim();
	return /^(?:https?:|mailto:|tel:|\/|#)/i.test(t) && !/^(?:javascript|data|vbscript):/i.test(t) ? t : "#";
}
function zy(e) {
	let t = String(e || "").trim();
	return /^(?:https?:\/\/|\/api\/)/i.test(t) ? t : "";
}
function By({ viewport: e = "", viewportWidth: t = 1280, mobileBreakpoint: n = 720, tabletBreakpoint: r = 1024 } = {}) {
	if ([
		"desktop",
		"tablet",
		"mobile"
	].includes(e)) return e;
	let i = Number(t) || 1280;
	return i <= Number(n || 720) ? "mobile" : i <= Number(r || 1024) ? "tablet" : "desktop";
}
function Vy(e, t) {
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
function Hy(e, t = "desktop") {
	let n = Fy(e);
	if (!n?.root || ![
		"desktop",
		"tablet",
		"mobile"
	].includes(t)) return n;
	let r = Py(n.responsive?.[t]);
	return Object.entries(r).forEach(([e, t]) => {
		let r = Vy(n.root, e);
		r && (r.target[r.group] = {
			...Py(r.target[r.group]),
			[r.property]: Fy(t)
		});
	}), n;
}
function Uy(e, t, n) {
	let r = Array.isArray(t) ? t : [];
	if (e?.fields && Object.prototype.hasOwnProperty.call(e.fields, n)) return e.fields[n];
	if (r.length <= 1 && String(r[0]?.fieldKey || "") === String(n || "")) return e;
}
function Wy(e) {
	let t = Py(e), n = {};
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
	].includes(t.justifyContent) && (n.justifyContent = t.justifyContent), Number.isInteger(t.columns) && t.columns >= 1 && t.columns <= 12 && (n.gridTemplateColumns = `repeat(${t.columns}, minmax(0, 1fr))`), Object.entries(Ny).forEach(([e, r]) => {
		let i = Iy(t[e]);
		i && (n[r] = i);
	}), (t.width === "auto" || /^(?:100|\d{1,2})(?:\.\d+)?%$/.test(String(t.width || ""))) && (n.width = t.width);
	let r = Ly(t.minHeight), i = Ly(t.maxWidth);
	return r && (n.minHeight = r), i && (n.maxWidth = i), /^(?:[1-9]\d?(?:\.\d+)?)\/(?:[1-9]\d?(?:\.\d+)?)$/.test(String(t.aspectRatio || "")) && (n.aspectRatio = String(t.aspectRatio).replace("/", " / ")), [
		"visible",
		"hidden",
		"clip"
	].includes(t.overflow) && (n.overflow = t.overflow), n;
}
function Gy(e) {
	return Object.entries(Py(e)).reduce((e, [t, n]) => {
		let r = My[t], i = Iy(n);
		return r && i && (e[r] = i), e;
	}, {});
}
function Ky(e) {
	let t = {};
	return Object.entries(Py(e)).forEach(([e, n]) => {
		!jy.has(e) || /^on/i.test(e) || ![
			"string",
			"number",
			"boolean"
		].includes(typeof n) || (e === "href" ? t.href = Ry(n) : e === "target" && ["_self", "_blank"].includes(String(n)) ? t.target = String(n) : t[e] = n);
	}), t.target === "_blank" && (t.rel = "noopener noreferrer"), t;
}
function qy(e, t) {
	return String(e && typeof e == "object" ? e.label ?? e.value ?? e.description ?? "" : e ?? t?.defaultValue ?? "");
}
function Jy(e, t, n, r) {
	let i = { ...t };
	if (e === "a") {
		i.href = Ry(n?.link || i.href);
		let e = ["_self", "_blank"].includes(String(n?.target || "")) ? n.target : i.target;
		e && (i.target = e), i.target === "_blank" && (i.rel = "noopener noreferrer");
	}
	if (e === "img") {
		let e = zy(n?.value);
		e ? i.src = e : delete i.src, i.alt = String(n?.alt || n?.description || i.alt || r?.name || "").trim();
	}
	return i;
}
function Yy(e, t, n, r, i = !1) {
	let a = { ...e }, o = ["title", "headline"].includes(String(t?.textType || "").toLowerCase()) || /^h[1-6]$/u.test(n);
	if (i || r !== "mobile" || !o) return a;
	let s = "clamp(2rem, 10vw, 3.25rem)";
	return a.fontSize = a.fontSize ? `min(${a.fontSize}, ${s})` : s, a.lineHeight ||= "1.08", a;
}
function Xy({ renderSpec: e, fields: t = [], componentValue: n, breakpoint: r = "desktop", registeredOnly: i = !1 } = {}) {
	if (Number(e?.contractVersion) !== 1 || !e?.root) return null;
	let a = Hy(e, r), o = new Map((Array.isArray(t) ? t : []).map((e) => [String(e?.fieldKey || ""), e]));
	function s(e, a) {
		if (!e || typeof e != "object" || Array.isArray(e)) return null;
		let c = Ay.has(String(e.tag || "").toLowerCase()) ? String(e.tag).toLowerCase() : "div", l = e.nodeType === "field", u = l ? String(e.fieldKey || "") : "", d = l && o.get(u) || null, f = l ? Uy(n, t, u) : void 0, p = Jy(c, Ky(e.attributes), f, d), m = l && (c === "img" || c === "picture") ? zy(f?.value) : "", h = l && (c === "img" || c === "picture") ? String(f?.alt || f?.description || p.alt || d?.name || "").trim() : "";
		return {
			path: a,
			nodeType: l ? "field" : "element",
			tag: c,
			semanticRole: String(e.semanticRole || ""),
			fieldKey: u,
			field: d,
			fieldKind: String(d?.fieldKind || ""),
			value: f,
			text: l ? qy(f, d) : "",
			imageSrc: m,
			imageAlt: h,
			attributes: p,
			style: Yy({
				...Wy(e.layout),
				...Gy(e.tokenBindings)
			}, d, c, r, i),
			children: (Array.isArray(e.children) ? e.children : []).map((e, t) => s(e, `${a}.children.${t}`)).filter(Boolean)
		};
	}
	return s(a.root, "root");
}
//#endregion
//#region visual-editor/src/platform/render-spec/RenderSpecTree.vue
var Zy = {
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
		let n = e, r = t, i = G(() => By({
			viewport: n.viewport,
			viewportWidth: n.viewportWidth,
			mobileBreakpoint: n.mobileBreakpoint,
			tabletBreakpoint: n.tabletBreakpoint
		})), a = G(() => Xy({
			renderSpec: n.renderSpec,
			registeredOnly: n.registeredOnly,
			fields: n.fields,
			componentValue: n.value,
			breakpoint: i.value
		}));
		return (t, n) => a.value ? (B(), js(ky, {
			key: 0,
			node: a.value,
			editable: e.editable,
			onSelectField: n[0] ||= (e) => r("select-field", e)
		}, null, 8, ["node", "editable"])) : W("", !0);
	}
}, Qy = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, $y = {
	key: 1,
	class: "promo-resize-announcement",
	"aria-live": "polite"
}, eb = [
	"data-section-key",
	"data-section-role",
	"data-motion-target",
	"aria-busy"
], tb = ["title"], nb = {
	key: 0,
	"aria-hidden": "true"
}, rb = { class: "rendered-section__inner" }, ib = [
	"data-item-key",
	"data-style-key",
	"data-collection-key",
	"data-collection-index",
	"data-motion-target",
	"onClick",
	"onDblclickCapture",
	"onPointerdown"
], ab = [
	"aria-label",
	"title",
	"onPointerdown",
	"onKeydown"
], ob = [
	"aria-label",
	"title",
	"onClick"
], sb = {
	key: 2,
	class: "output-hidden-badge"
}, cb = {
	key: 3,
	class: "item-outline-label",
	"aria-hidden": "true"
}, lb = { key: 0 }, ub = { key: 1 }, db = [
	"data-field-key",
	"data-field-kind",
	"data-field-style-key",
	"aria-selected",
	"tabindex",
	"onClick"
], fb = [
	"href",
	"target",
	"rel",
	"draggable",
	"onClick"
], pb = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], mb = ["data-asset-target-key"], hb = {
	key: 0,
	"aria-hidden": "true"
}, gb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], _b = ["data-text-line-index"], vb = { class: "rendered-text-line__content" }, yb = { class: "rendered-text__content" }, bb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], xb = { class: "rendered-text__content" }, Sb = [
	"data-field-key",
	"onClick",
	"onDblclick"
], Cb = [
	"aria-label",
	"title",
	"onClick"
], wb = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Tb = [
	"href",
	"target",
	"rel",
	"draggable"
], Eb = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Db = ["data-asset-target-key"], Ob = ["title"], kb = {
	key: 0,
	"aria-hidden": "true"
}, Ab = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], jb = ["onClick", "onDblclick"], Mb = ["data-text-line-index"], Nb = { class: "rendered-text-line__content" }, Pb = { class: "rendered-text__content" }, Fb = ["onClick", "onDblclick"], Ib = { class: "rendered-text__content" }, Lb = ["onClick", "onDblclick"], Rb = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], zb = [
	"aria-label",
	"title",
	"onPointerdown"
], Bb = 20, Vb = 7, Hb = {
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
		let r = e, i = n, a = /* @__PURE__ */ I(typeof globalThis.innerWidth == "number" ? globalThis.innerWidth : 1280), o = /* @__PURE__ */ I(null), s = /* @__PURE__ */ I(/* @__PURE__ */ new Set()), c = /* @__PURE__ */ I({}), l = null, u = null, d = null, f = null, p = null, m = "idle", h = 0, g = !1, _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ I("");
		function y() {
			if (!o.value || m !== "idle") return;
			let e = new Set(o.value.querySelectorAll("[data-auto-height-measure=\"true\"]"));
			_.forEach((t) => {
				e.has(t) || (u?.unobserve(t), _.delete(t));
			});
			let t = { ...c.value }, n = !1;
			e.forEach((e) => {
				u?.observe(e), _.add(e);
				let r = e.dataset.styleKey, i = e.getBoundingClientRect().height;
				!r || !Number.isFinite(i) || i <= 0 || Math.abs(Number(t[r] || 0) - i) < .5 || (t[r] = i, n = !0);
			}), n && (c.value = t);
		}
		function b() {
			g || (h && cancelAnimationFrame(h), mr(() => {
				g || (h = requestAnimationFrame(() => {
					h = 0, y();
				}));
			}));
		}
		function x(e) {
			m = e;
		}
		function S(e) {
			m === e && (m = "idle", b());
		}
		function C() {
			a.value = globalThis.innerWidth || 1280;
		}
		fa(async () => {
			g = !1, globalThis.addEventListener("resize", C), await mr(), typeof ResizeObserver < "u" && (u = new ResizeObserver(y)), y(), !(r.editable || typeof IntersectionObserver > "u") && (l = new IntersectionObserver((e) => {
				let t = new Set(s.value);
				e.forEach((e) => {
					e.isIntersecting && (t.add(e.target.dataset.motionTarget), l?.unobserve(e.target));
				}), s.value = t;
			}, {
				threshold: .15,
				rootMargin: "0px 0px -10% 0px"
			}), o.value?.querySelectorAll("[data-motion-target]").forEach((e) => l.observe(e)));
		}), ha(() => {
			g = !0, globalThis.removeEventListener("resize", C), d?.(), d = null, f?.(), f = null, h && cancelAnimationFrame(h), h = 0, _.clear(), u?.disconnect(), l?.disconnect();
		});
		let w = G(() => r.viewportOverride ? r.viewportOverride === "mobile" : a.value <= Number(O.value?.responsive?.mobileBreakpoint || 720)), T = G(() => {
			let e = r.content?.sectionSnapshot || [], t = r.content?.sectionOrder || [], n = new Map(t.map((e, t) => [e, t]));
			return [...e].sort((e, t) => (n.get(e.sectionKey) ?? e.sortOrder ?? 0) - (n.get(t.sectionKey) ?? t.sortOrder ?? 0));
		}), E = G(() => dy(r.content?.runtimeTheme?.designTokens?.values || r.content?.formTemplate?.designTokens?.values)), D = G(() => r.content?.runtimeTheme?.designTokens?.policy === "registered-only"), O = G(() => D.value ? ly(r.designSpec, E.value, r.content?.runtimeTheme?.designTokens?.catalog || [], r.content?.runtimeTheme?.designTokens?.usagePolicy, r.content?.sectionSnapshot || []).spec : r.designSpec), k = G(() => fy(E.value, {
			registeredOnly: D.value,
			usagePolicy: r.content?.runtimeTheme?.designTokens?.usagePolicy,
			background: O.value?.theme?.backgroundColor,
			text: O.value?.theme?.textColor,
			accent: O.value?.theme?.accentColor,
			cta: O.value?.theme?.ctaColor || O.value?.theme?.accentColor,
			ctaTransparent: O.value?.theme?.ctaVariant === "ghost",
			font: O.value?.theme?.fontFamily
		}));
		function A(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function ee(e) {
			let t = Number(e?.renderSpec?.contractVersion) === 1 && e?.renderSpec?.root ? e.renderSpec : null;
			return !t || !D.value ? t : ly(t, E.value, r.content?.runtimeTheme?.designTokens?.catalog || [], r.content?.runtimeTheme?.designTokens?.usagePolicy, r.content?.sectionSnapshot || []).spec;
		}
		function te(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function ne(e, t, n) {
			return `${te(e, t)}.${n.fieldKey}`;
		}
		function re(e, t) {
			if (t?.isRequired || t?.isLocked) return !0;
			let n = te(e, t);
			return ((w.value ? O.value?.responsiveLayouts?.mobile?.visibility?.items?.[n] : void 0) ?? O.value?.visibility?.items?.[n]) !== !1;
		}
		function ie(e, t, n) {
			return n?.isRequired || n?.isLocked ? !0 : O.value?.visibility?.fields?.[ne(e, t, n)] !== !1;
		}
		function ae(e, t) {
			return A(t).map((n, r) => ({
				field: n,
				index: r,
				order: Number(Ue(e, t, n).order)
			})).filter(({ field: n }) => r.editable || ie(e, t, n)).sort((e, t) => (Number.isFinite(e.order) ? e.order : e.index * 10) - (Number.isFinite(t.order) ? t.order : t.index * 10)).map(({ field: e }) => e);
		}
		function j(e, t, n = null) {
			let i = r.content?.sectionInputs?.[e.sectionKey]?.[t.itemKey];
			return !n || A(t).length <= 1 ? i : i?.fields?.[n.fieldKey];
		}
		function oe(e) {
			let t = String(e?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(t) ? t : "";
		}
		function se(e, t) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) && e.aiDesign.imageTargetItemKeys.includes(t?.itemKey);
		}
		function ce(e, t, n) {
			if (se(e, t)) return !1;
			let r = String(n?.value || "").trim();
			return n?.source === "ai" || r.startsWith("/api/promo-section-design-image?");
		}
		function le(e) {
			return (e.items || []).filter((t) => (r.editable || re(e, t)) && (t.fieldKind !== "image" || !ce(e, t, j(e, t))) && (A(t).length <= 1 || ae(e, t).length > 0));
		}
		function ue(e, t) {
			return A(t).every((n) => !pe(j(e, t, n)));
		}
		function de(e) {
			let t = String(ye(e).backgroundImage || "").trim(), n = (e.items || []).filter((e) => e.fieldKind === "image").map((t) => ({
				item: t,
				value: j(e, t)
			})).find(({ item: t, value: n }) => ce(e, t, n)), r = t || String(n?.value?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(r) ? r : "";
		}
		function fe(e) {
			return my(e?.link);
		}
		function pe(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function M(e, t = null) {
			let n = t || e;
			return String(n?.description || n?.editorSchema?.description || (t ? "" : e?.description) || "내용을 입력하세요").trim();
		}
		function me(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function he(e, t) {
			let n = me(e, t), r = O.value?.itemStyles?.[n] || {};
			return w.value ? {
				...r,
				...O.value?.responsiveLayouts?.mobile?.itemStyles?.[n] || {}
			} : r;
		}
		function ge(e, t) {
			return O.value?.responsiveLayouts?.mobile?.itemStyles?.[me(e, t)] || {};
		}
		function _e(e) {
			return [e, ...A(e)].some((e) => ["title", "headline"].includes(String(e?.textType || "").toLowerCase()));
		}
		function ve(e, t, n) {
			let r = ge(e, t), i = r.fontSize !== void 0 || !!r.fontSizeToken, a = n.fontSizeToken ? `var(${n.fontSizeToken})` : n.fontSize === void 0 ? "" : `${n.fontSize}px`;
			if (D.value || !w.value || i || !_e(t)) return a || void 0;
			let o = "clamp(2rem, 10vw, 3.25rem)";
			return a ? `min(${a}, ${o})` : o;
		}
		function ye(e) {
			return O.value?.sectionStyles?.[e.sectionKey] || {};
		}
		function be(e) {
			return ye(e).layoutMode === "flow";
		}
		function xe(e) {
			let t = ye(e), n = w.value ? t.mobileLayoutColumns : t.layoutColumns, r = w.value ? 2 : 6;
			return Math.max(1, Math.min(r, Number(n) || 1));
		}
		function Ce(e, t) {
			let n = e === "section" ? r.motionSpec?.sections : r.motionSpec?.items;
			return n?.[t] || (e === "item" ? n?.[String(t).split(".").at(-1)] : null) || null;
		}
		function we(e, t) {
			return !e?.presetVersionId || !r.editable && e.trigger === "viewport-enter" && !s.value.has(t) ? "" : [
				"motion-fade-up",
				"motion-fade-in",
				"motion-scale-in"
			].includes(e.className) ? e.className : String(e.presetVersionId).includes("fade-up") ? "motion-fade-up" : String(e.presetVersionId).includes("fade-in") ? "motion-fade-in" : String(e.presetVersionId).includes("scale-in") ? "motion-scale-in" : "motion-fade-in";
		}
		function Te(e, t) {
			return we(Ce(e, t), `${e}:${t}`);
		}
		function Ee(e, t) {
			let n = Ce(e, t);
			return n ? {
				"--motion-duration": n.durationToken || void 0,
				"--motion-easing": n.easingToken || void 0,
				"--motion-delay": n.delayToken || void 0
			} : {};
		}
		function De(e, t, n) {
			let r = Ce("item", me(e, t));
			if (r?.inherit === !1) return r;
			let i = Ce("section", e.sectionKey);
			if (!i?.presetVersionId || i.childrenMode !== "stagger") return null;
			let a = Math.max(0, Math.min(160, Number.parseInt(i.staggerToken, 10) || 0)), o = Math.max(0, Number.parseInt(i.delayToken, 10) || 0), s = Number.isFinite(Number(r?.motionOrder)) ? Number(r.motionOrder) : n;
			return {
				...i,
				delayToken: `${Math.min(800, o + a * s)}ms`
			};
		}
		function Oe(e, t, n) {
			return we(De(e, t, n), `item:${me(e, t)}`);
		}
		function ke(e, t, n) {
			let r = De(e, t, n);
			return r ? {
				"--motion-duration": r.durationToken || void 0,
				"--motion-easing": r.easingToken || void 0,
				"--motion-delay": r.delayToken || void 0
			} : {};
		}
		let Ae = /* @__PURE__ */ new Set([
			"queued",
			"analyzing_content",
			"generating_layout",
			"validating_layout",
			"generating_assets",
			"validating_assets",
			"applying"
		]);
		function je(e) {
			return r.sectionDesignRuns?.[e.sectionKey] || null;
		}
		function Me(e, t) {
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
		function Ne(e, t = null, n = null) {
			let r = je(e), i = r?.constraintsSnapshot?.imageTarget;
			return (t ? i?.type === "item" && i.itemKey === t.itemKey && (!n || !i.fieldKey || i.fieldKey === n.fieldKey) : i?.type === "section-background") ? Ae.has(r.status) ? {
				kind: "processing",
				label: Me(r.status, i.type)
			} : r.status === "failed" ? {
				kind: "failed",
				label: i.type === "item" ? "AI 이미지 생성 실패" : "AI 키비주얼 생성 실패",
				detail: String(r.errorMessage || "").trim()
			} : null : null;
		}
		function Pe(e, t) {
			let n = he(e, t);
			return t.fieldKind === "image" && (n.shape === "circle" || n.aspectRatioLocked !== !1) ? [
				"nw",
				"ne",
				"se",
				"sw"
			] : Sy(t, n) ? ["e", "w"] : [
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
		let Fe = {
			nw: "왼쪽 위",
			n: "위",
			ne: "오른쪽 위",
			e: "오른쪽",
			se: "오른쪽 아래",
			s: "아래",
			sw: "왼쪽 아래",
			w: "왼쪽"
		};
		function Ie(e, t) {
			let n = e.fieldKind === "image" ? "이미지" : "컴포넌트";
			return `${e.name} ${n} ${Fe[t] || t} 방향 크기 조절`;
		}
		function Le(e, t, n, r) {
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
		function Re(e, t, n) {
			let r = n ? Math.round(t.width / n * 1e4) / 100 : 0;
			v.value = `${e.name} 너비 ${r}%, 높이 ${Math.round(t.height)}픽셀`;
		}
		function ze(e, t, n, r) {
			let i = Number(e);
			return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
		}
		function Be(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function Ve(e, t) {
			return t.shape === "circle" ? "1 / 1" : Be(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function He(e, t) {
			let n = he(e, t), r = oe(j(e, t)), i = [
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
		function Ue(e, t, n) {
			let r = `${me(e, t)}.${n.fieldKey}`, i = O.value?.itemStyles?.[r] || {}, a = w.value && O.value?.responsiveLayouts?.mobile?.itemStyles?.[r] || {};
			return {
				...i,
				...a
			};
		}
		function We(e, t, n) {
			let r = Ue(e, t, n), { order: i, widthPct: a, minHeightPx: o, horizontalAlign: s, alignSelf: c, marginTopPx: l, marginBottomPx: u, ...d } = r;
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
		function Ge(e, t, n) {
			let r = Ue(e, t, n), i = Math.min(100, Math.max(5, Number(r.widthPct) || 100)), a = [
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
		function Ke(e, t, n) {
			return `${me(e, t)}.${n.fieldKey}`;
		}
		function qe(e, t, n) {
			return r.selectedFieldKey === Ke(e, t, n);
		}
		function Je(e, t, n, a) {
			r.editable && (e.preventDefault(), e.stopPropagation(), i("open-field-inspector", t, n, a));
		}
		function Ye(e) {
			return e.fieldKind === "text" ? ["e", "w"] : [
				"e",
				"s",
				"w",
				"se"
			];
		}
		function Xe(e, t) {
			return `${e.name || e.fieldKey} ${Fe[t] || t} 방향 크기 조절`;
		}
		function Ze(e, t, n, a, o) {
			if (!r.editable || n.isLocked || a.isLocked || e.button !== 0) return;
			let s = e.currentTarget, c = s.closest(".rendered-component-field-shell"), l = c?.closest(".rendered-component-fields");
			if (!c || !l) return;
			e.preventDefault(), e.stopPropagation(), d?.(), f?.(), c.querySelector("[contenteditable=\"true\"]")?.blur();
			try {
				s.setPointerCapture(e.pointerId);
			} catch {
				return;
			}
			x("component-field-resize"), c.classList.add("is-resizing-field");
			let u = l.getBoundingClientRect(), p = c.getBoundingClientRect(), m = e.clientX, h = e.clientY, g = o.includes("e") || o.includes("w"), _ = o.includes("s") && a.fieldKind !== "text", v = p.width, y = p.height, b = !1, C = !1, w = (t) => {
				if (C || t.pointerId !== e.pointerId) return;
				if ((t.buttons & 1) != 1) {
					T(!0);
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
			}, T = (r = !1) => {
				if (!C) {
					if (C = !0, r && b && i("update-renderer-field-style", t, n, a, {
						...g ? { widthPct: Math.round(v / u.width * 1e4) / 100 } : {},
						..._ ? { minHeightPx: Math.round(y) } : {}
					}), c.style.removeProperty("width"), c.style.removeProperty("min-height"), c.classList.remove("is-resizing-field"), s.hasPointerCapture(e.pointerId)) try {
						s.releasePointerCapture(e.pointerId);
					} catch {}
					globalThis.removeEventListener("pointermove", w), globalThis.removeEventListener("pointerup", E), globalThis.removeEventListener("pointercancel", D), globalThis.removeEventListener("blur", O), s.removeEventListener("lostpointercapture", O), f === O && (f = null), S("component-field-resize");
				}
			}, E = (t) => {
				t.pointerId === e.pointerId && T(!0);
			}, D = (t) => {
				t.pointerId === e.pointerId && T(!1);
			}, O = () => T(!1);
			f = O, globalThis.addEventListener("pointermove", w, { passive: !1 }), globalThis.addEventListener("pointerup", E), globalThis.addEventListener("pointercancel", D), globalThis.addEventListener("blur", O), s.addEventListener("lostpointercapture", O);
		}
		function Qe(e, t, n, r, a) {
			if (!e.key.startsWith("Arrow") || n.isLocked || r.isLocked) return;
			let o = e.currentTarget.closest(".rendered-component-field-shell"), s = o?.closest(".rendered-component-fields");
			if (!o || !s) return;
			e.preventDefault(), e.stopPropagation();
			let c = e.shiftKey ? 10 : 1, l = Ue(t, n, r), u = a.includes("e") || a.includes("w"), d = a.includes("s") && r.fieldKind !== "text", f = u ? e.key === "ArrowLeft" ? -c : e.key === "ArrowRight" ? c : 0 : 0, p = d ? e.key === "ArrowUp" ? -c : e.key === "ArrowDown" ? c : 0 : 0;
			!f && !p || i("update-renderer-field-style", t, n, r, {
				...f ? { widthPct: Math.min(100, Math.max(5, (Number(l.widthPct) || 100) + f)) } : {},
				...p ? { minHeightPx: Math.min(1200, Math.max(28, (Number(l.minHeightPx) || o.getBoundingClientRect().height) + p)) } : {}
			});
		}
		function $e(e, t, n) {
			let r = We(e, t, n), i = oe(j(e, t, n)), a = [
				"square",
				"rounded",
				"circle"
			].includes(r.shape) ? r.shape : "square";
			return {
				backgroundImage: i ? `url(${JSON.stringify(i)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(r.imageFit) ? r.imageFit : "contain",
				backgroundPosition: r.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				aspectRatio: Be(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: r.borderRadiusToken ? `var(${r.borderRadiusToken})` : a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius)" : "0"
			};
		}
		function et(e, t, n) {
			let r = We(e, t, n), i = j(e, t, n);
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
		function tt(e, t) {
			let n = he(e, t), r = j(e, t);
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
		function nt(e) {
			return by(e);
		}
		function rt(e, t) {
			let n = he(e, t), r = c.value[me(e, t)];
			if (Number.isFinite(r) && r > 0) return r;
			let i = Number(n.heightPx);
			return n.positionMode === "free" && Number.isFinite(i) && i > 0 ? i : (t.fieldKind === "text" && Sy(t, n), nt(t));
		}
		function it(e) {
			return yy(e.items || [], (t) => he(e, t), (t) => rt(e, t), Bb);
		}
		function at(e) {
			let t = it(e);
			return Math.max(t, vy(ye(e).minHeight, t));
		}
		function ot(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((t, n) => t + rt(e, n), 0), a = at(e), o = Math.max(50, a - Bb);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function st(e) {
			return [
				"none",
				"left",
				"right",
				"both"
			].includes(e.backgroundFadeMode) ? e.backgroundFadeMode : e.backgroundFadeSafeArea === "left-copy" ? "left" : e.backgroundFadeSafeArea === "right-copy" ? "right" : e.backgroundFadeSafeArea === "center-copy" ? "both" : "none";
		}
		function ct(e) {
			let t = String(e || "").trim();
			return /^--[a-z][a-z0-9-]*$/.test(t) && (!D.value || Object.hasOwn(E.value, t)) ? `var(${t})` : "";
		}
		function lt(e) {
			let t = String(e || "").trim();
			return String(E.value[t] || "").trim();
		}
		function ut(e) {
			return ct(e.backgroundColorToken) || String(e.backgroundColor || "").trim() || ct(O.value?.theme?.backgroundColorToken) || String(O.value?.theme?.backgroundColor || "").trim() || (r.content?.runtimeTheme?.designTokens?.usagePolicy ? "var(--render-policy-bg)" : "var(--promo-bg)");
		}
		function dt(e) {
			return lt(e.backgroundFadeColorToken || e.backgroundColorToken) || String(e.backgroundFadeColor || e.backgroundColor || "").trim() || lt(O.value?.theme?.backgroundColorToken) || String(O.value?.theme?.backgroundColor || "").trim();
		}
		function ft(e, t, n = "medium", r = {}) {
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
		function pt(e) {
			let t = ye(e), n = at(e), r = de(e), i = ut(t), a = r ? ft(st(t), dt(t), t.backgroundFadeStrength, t.backgroundFadeStops) : "", o = t.backgroundFitMode || (t.backgroundSize === "100% auto" ? "width-fill" : t.backgroundSize), s = o === "width-fill" ? "100% auto" : ["contain", "cover"].includes(o) ? o : "cover", c = be(e);
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
		function mt(e) {
			let t = at(e);
			if (be(e)) {
				let n = ye(e), r = w.value ? n.mobileLayoutGapPx : n.layoutGapPx, i = w.value ? n.mobileLayoutPaddingBlockPx : n.layoutPaddingBlockPx, a = [
					"start",
					"center",
					"end",
					"stretch"
				].includes(n.contentAlignment) ? n.contentAlignment : "stretch";
				return {
					height: "auto",
					minHeight: `${Math.max(0, t - Bb)}px`,
					display: "grid",
					gridTemplateColumns: `repeat(${xe(e)}, minmax(0, 1fr))`,
					gridAutoRows: "max-content",
					gap: D.value && r === void 0 ? void 0 : `${Math.max(0, Math.min(120, Number(r) || (D.value ? 0 : 24)))}px`,
					alignContent: a === "stretch" ? "center" : a,
					alignItems: a,
					justifyItems: a,
					paddingBlock: D.value && i === void 0 ? void 0 : `${Math.max(0, Math.min(200, Number(i) || (D.value ? 0 : 40)))}px`,
					boxSizing: "border-box"
				};
			}
			return { height: `${Math.max(0, t - Bb)}px` };
		}
		function ht(e, t) {
			let n = he(e, t), r = ve(e, t, n), i = n.positionMode === "anchored", a = n.positionMode === "free" ? n : ot(e, t), o = t.fieldKind === "image", s = ze(n.widthPct, 4, 100, xy(t));
			Sy(t, n);
			let l = !o && n.widthMode === "fit-content", u = Cy(t, n), d = [
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
			}[d], h = Math.max(0, at(e) - Bb), g = c.value[me(e, t)], _ = Number.isFinite(g) && g > 0 ? g : u || rt(e, t), v = Math.max(0, h - _), y = {
				top: 0,
				middle: .5,
				bottom: 1
			}[f], b = i ? h * y + (Number(n.offsetY) || 0) - _ * y : n.yPx === void 0 ? (Number(a.yPct) || 0) / 100 * h : Number(n.yPx) || 0, x = Math.min(v, Math.max(0, b)), S = i ? void 0 : Math.min(Math.max(0, 100 - s), Math.max(0, Number(a.xPct) || 0)), C = {
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
				"--item-list-padding": `${1.35 + ze(n.listIndent, 0, 6, 0) * 1.5}em`,
				lineHeight: n.lineHeightToken ? `var(${n.lineHeightToken})` : n.lineHeight,
				letterSpacing: n.letterSpacingToken ? `var(${n.letterSpacingToken})` : n.letterSpacing,
				fontStyle: n.fontStyle,
				textDecoration: n.textDecoration,
				textAlign: n.textAlign,
				width: l ? "fit-content" : n.widthMode === "fill" ? "100%" : `${s}%`,
				maxWidth: l ? n.maxWidthToken ? `var(${n.maxWidthToken})` : `${ze(n.maxWidthPct, 10, 100, 80)}%` : void 0,
				height: u && (!o || n.shape !== "circle") ? `${u}px` : void 0,
				aspectRatio: o && (!u || n.shape === "circle") ? Ve(t, n) : void 0
			};
			return n.positionMode === "flow" ? {
				...C,
				position: "relative",
				left: "auto",
				top: "auto",
				transform: void 0,
				width: l ? "fit-content" : "100%",
				maxWidth: n.maxWidthToken ? `var(${n.maxWidthToken})` : n.maxWidthPct ? `${ze(n.maxWidthPct, 10, 100, 100)}%` : void 0,
				height: "auto",
				aspectRatio: o ? Ve(t, n) : void 0,
				justifySelf: n.justifySelf,
				alignSelf: n.alignSelf,
				padding: Number(n.paddingPx) > 0 ? `${Math.min(160, Number(n.paddingPx))}px` : void 0,
				boxSizing: "border-box"
			} : C;
		}
		function gt(e, t, n = null) {
			return (n ? Ue(e, t, n) : he(e, t)).listType === "number" ? "ol" : "ul";
		}
		function _t(e) {
			return String(e ?? "").split(/\r?\n/u).map((e) => e.trim()).filter(Boolean);
		}
		function vt(e = null) {
			return e?.fieldKey || "$item";
		}
		function yt(e, t, n = null) {
			return (n ? Ue(e, t, n) : he(e, t)).lineStyles?.[vt(n)] || {};
		}
		function bt(e, t, n = null) {
			return Object.keys(yt(e, t, n)).length > 0;
		}
		function xt(e, t, n = null) {
			return bt(e, t, n) || /\r?\n/u.test(String(j(e, t, n) ?? ""));
		}
		function St(e, t, n = null) {
			let r = n ? Ue(e, t, n) : he(e, t), i = yt(e, t, n), a = 0;
			return String(j(e, t, n) ?? "").split(/\r?\n/u).map((e, t) => {
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
		function Ct(e) {
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
				"--line-list-padding": `${1.35 + ze(t.listIndent, 0, 6, 0) * 1.5}em`
			};
		}
		function wt(e) {
			return {
				"is-bullet": e.style.listType === "bullet",
				"is-number": e.style.listType === "number",
				"is-number-start": e.style.listType === "number" && e.number === 1,
				"has-line-gradient": !!e.style.textGradientToken
			};
		}
		function Tt(e, t, n = null) {
			if (!r.editable) return;
			if (n?.type === "click" && n.pointerId === p) {
				p = null;
				return;
			}
			let a = !!(n?.ctrlKey || n?.metaKey || n?.shiftKey), o = me(e, t), s = n?.fieldKey ? `${o}.${n.fieldKey}` : "", c = r.selectedItemKey === o && r.selectedItemKeys.length <= 1 && r.selectedFieldKey === s;
			!a && c || i("select-item", e, t, {
				additive: a,
				fieldKey: n?.fieldKey || ""
			});
		}
		function Et(e, t, n, i) {
			r.editable && (e.preventDefault(), Tt(t, n, {
				type: e.type,
				pointerId: e.pointerId,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				shiftKey: e.shiftKey,
				fieldKey: i.fieldKey
			}));
		}
		function Dt(e, t, n) {
			!r.editable || !n?.fieldKey || Tt(e, t, {
				type: "click",
				fieldKey: n.fieldKey
			});
		}
		function Ot(e) {
			r.editable && e.preventDefault();
		}
		function kt(e) {
			r.editable && e.preventDefault();
		}
		function At(e, t, n, a = {}) {
			p = null;
			let o = a.target || e.currentTarget, s = a.fromMoveHandle === !0;
			if (!r.editable || n.isLocked || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest(".item-resize-handle") || !s && e.target.closest("[data-field-style-key]") || !s && o.classList.contains("is-editing")) return;
			let c = o.closest(".rendered-items");
			if (!c) return;
			f?.(), d?.(), p = e.pointerId, Tt(t, n);
			let l = e.clientX, u = e.clientY, m = null, h = 0, g = 0, _ = 0, v = 0, y = 0, b = !1, C = !1, w = (t) => {
				if (t.pointerId !== e.pointerId || C) return;
				if ((t.buttons & 1) != 1) {
					E();
					return;
				}
				let n = t.clientX - l, r = t.clientY - u;
				if (!b) {
					if (Math.hypot(n, r) < Vb) return;
					if (t.cancelable && t.preventDefault(), !o.hasPointerCapture(t.pointerId)) try {
						o.setPointerCapture(t.pointerId);
					} catch {
						E();
						return;
					}
					m = c.getBoundingClientRect();
					let e = o.getBoundingClientRect();
					h = e.left - m.left, g = e.top - m.top, _ = h, v = g, o.style.transform = "none", o.style.left = `${h}px`, o.style.top = `${g}px`, o.classList.add("is-dragging"), x("component-drag"), b = !0;
				}
				let i = m.width - o.offsetWidth, a = hy - o.offsetHeight - Bb, s = Math.min(0, i), d = Math.max(0, i), f = Math.min(0, a), p = Math.max(0, a);
				_ = Math.min(d, Math.max(s, h + n)), v = Math.min(p, Math.max(f, g + r)), !y && (y = requestAnimationFrame(() => {
					y = 0, o.style.left = `${_}px`, o.style.top = `${v}px`;
				}));
			}, T = () => {
				document.visibilityState === "hidden" && E();
			}, E = () => {
				if (!C) {
					if (C = !0, y && cancelAnimationFrame(y), b && m) {
						let e = m.width ? _ / m.width * 100 : 0;
						i("update-renderer-item-style", t, n, {
							positionMode: "free",
							xPct: e,
							yPx: v
						});
						let r = Math.min(hy, Math.ceil(v + o.offsetHeight + Bb * 2));
						r > Number(ye(t).minHeight || it(t)) && i("update-section-style", t.sectionKey, { minHeight: r });
					}
					if (o.hasPointerCapture(e.pointerId)) try {
						o.releasePointerCapture(e.pointerId);
					} catch {}
					o.classList.remove("is-dragging"), b && (o.style.removeProperty("transform"), o.style.removeProperty("left"), o.style.removeProperty("top")), globalThis.removeEventListener("pointermove", w), globalThis.removeEventListener("pointerup", E), globalThis.removeEventListener("pointercancel", E), globalThis.removeEventListener("blur", E), document.removeEventListener("visibilitychange", T), o.removeEventListener("lostpointercapture", E), d === E && (d = null), b && S("component-drag");
				}
			};
			d = E, globalThis.addEventListener("pointermove", w, { passive: !1 }), globalThis.addEventListener("pointerup", E), globalThis.addEventListener("pointercancel", E), globalThis.addEventListener("blur", E), document.addEventListener("visibilitychange", T), o.addEventListener("lostpointercapture", E);
		}
		function jt(e, t, n) {
			let r = e.currentTarget.closest(".rendered-item");
			r && (e.preventDefault(), e.stopPropagation(), r.querySelector("[contenteditable=\"true\"]")?.blur(), At(e, t, n, {
				target: r,
				fromMoveHandle: !0
			}));
		}
		function Mt(e, t, n) {
			r.editable && (e.preventDefault(), e.stopPropagation(), i("open-item-inspector", t, n));
		}
		function Nt(e, t, n) {
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
			let s = o.getBoundingClientRect(), c = a.getBoundingClientRect(), l = e.shiftKey ? 10 : 1, [u, d] = r[e.key], f = Math.min(Math.max(0, s.width - c.width), Math.max(0, c.left - s.left + u * l)), p = Math.min(Math.max(0, hy - c.height - Bb), Math.max(0, c.top - s.top + d * l));
			i("update-renderer-item-style", t, n, {
				positionMode: "free",
				xPct: s.width ? f / s.width * 100 : 0,
				yPx: p
			});
			let m = Math.min(hy, Math.ceil(p + c.height + Bb * 2));
			m > Number(ye(t).minHeight || it(t)) && i("update-section-style", t.sectionKey, { minHeight: m });
		}
		function Pt(e, t, n, a = "se") {
			if (!r.editable || n.isLocked || e.button !== 0) return;
			d?.(), f?.();
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c || s.classList.contains("is-editing")) return;
			e.preventDefault(), e.stopPropagation(), Tt(t, n);
			try {
				o.setPointerCapture(e.pointerId);
			} catch {
				return;
			}
			s.classList.add("is-resizing"), x("component-resize");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), p = e.clientX, m = e.clientY, h = he(t, n), g = n.fieldKind === "image", _ = Sy(n, h), v = h.positionMode === "anchored", y = g && h.aspectRatioLocked !== !1, b = Math.max(24, l.width * (4 / 100)), C = a.includes("w") || a.includes("e"), w = a.includes("n") || a.includes("s"), T = ot(t, n), E = Math.max(50, (ye(t).minHeight || it(t)) - Bb), D = wy({
				item: n,
				style: h,
				canvasWidth: l.width,
				fallbackX: T.xPct || 0,
				fallbackY: (T.yPct || 0) / 100 * E
			});
			D.x = u.left - l.left, D.y = u.top - l.top, D.width = u.width, D.height = u.height, v && (s.style.transform = "none", s.style.left = `${D.x}px`, s.style.top = `${D.y}px`);
			let O = D.height ? D.width / D.height : 1, k = { ...D }, A = 0, ee = !1, te = !1, ne = (t) => {
				if (te || t.pointerId !== e.pointerId) return;
				if ((t.buttons & 1) != 1) {
					ie(ee);
					return;
				}
				let n = t.clientX - p, r = t.clientY - m;
				if (!ee && Math.hypot(n, r) < .5) return;
				ee = !0, t.cancelable && t.preventDefault();
				let i = Math.max(b, a.includes("w") ? D.width + D.x : l.width - D.x), o = Math.max(24, a.includes("n") ? D.height + D.y : l.height - D.y), c = a.includes("n") ? Math.min(900, o) : 900;
				k = Dy({
					geometry: D,
					deltaX: n,
					deltaY: r,
					direction: a,
					minimumWidth: b,
					minimumHeight: 24,
					maximumWidth: i,
					maximumHeight: c,
					aspectRatioLocked: y || g && h.shape === "circle",
					aspectRatio: h.shape === "circle" ? 1 : O,
					scaleFont: !1
				}), !A && (A = requestAnimationFrame(() => {
					A = 0, s.style.left = `${k.x}px`, s.style.top = `${k.y}px`, (C || y) && (s.style.width = `${k.width}px`), (w || y) && (s.style.height = `${k.height}px`), g && (s.style.aspectRatio = "auto");
				}));
			}, re = () => {
				document.visibilityState === "hidden" && ie(!1);
			}, ie = (r) => {
				if (!te) {
					if (te = !0, A && cancelAnimationFrame(A), r && ee) {
						let e = Ty(k, l.width, {
							includeHeight: w && !y && !_ && !(g && h.shape === "circle"),
							includeFontSize: !1
						});
						v && (delete e.positionMode, delete e.xPct, delete e.yPx, Object.assign(e, Le(h, k, l.width, l.height))), i("update-renderer-item-style", t, n, {
							...e,
							...C && !g ? { widthMode: "fixed" } : {},
							...!w && !y ? { heightPx: h.heightPx } : {},
							...g ? { aspectRatio: `${Math.max(1, Math.round(k.width))}/${Math.max(1, Math.round(k.height))}` } : {}
						}), Re(n, k, l.width);
					}
					if (o.hasPointerCapture(e.pointerId)) try {
						o.releasePointerCapture(e.pointerId);
					} catch {}
					s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("left"), s.style.removeProperty("top"), s.style.removeProperty("transform"), globalThis.removeEventListener("pointermove", ne), globalThis.removeEventListener("pointerup", ae), globalThis.removeEventListener("pointercancel", j), globalThis.removeEventListener("blur", oe), document.removeEventListener("visibilitychange", re), o.removeEventListener("lostpointercapture", se), f === ce && (f = null), S("component-resize");
				}
			}, ae = (t) => {
				t.pointerId === e.pointerId && ie(!0);
			}, j = (t) => {
				t.pointerId === e.pointerId && ie(!1);
			}, oe = () => ie(!1), se = () => ie(!1), ce = () => ie(!1);
			f = ce, globalThis.addEventListener("pointermove", ne, { passive: !1 }), globalThis.addEventListener("pointerup", ae), globalThis.addEventListener("pointercancel", j), globalThis.addEventListener("blur", oe), document.addEventListener("visibilitychange", re), o.addEventListener("lostpointercapture", se);
		}
		function Ft(e, t, n, a = "se") {
			if (!r.editable || n.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = he(t, n), s = n.fieldKind === "image", c = Sy(n, o), l = o.positionMode === "anchored", u = s && o.aspectRatioLocked !== !1, d = e.shiftKey ? 4 : 1, f = a.includes("w") || a.includes("e"), p = a.includes("n") || a.includes("s"), m = e.currentTarget, h = m.closest(".rendered-items"), g = m.closest(".rendered-item");
			if (!h || !g) return;
			let _ = h.getBoundingClientRect(), v = g.getBoundingClientRect(), y = Math.max(1, _.width), b = f ? e.key === "ArrowRight" ? y * d / 100 : e.key === "ArrowLeft" ? -y * d / 100 : 0 : 0, x = p ? e.key === "ArrowDown" ? d * 4 : e.key === "ArrowUp" ? d * -4 : 0 : 0;
			if (!b && !x) return;
			let S = ot(t, n), C = Math.max(50, (ye(t).minHeight || it(t)) - Bb), w = wy({
				item: n,
				style: o,
				canvasWidth: y,
				fallbackX: S.xPct || 0,
				fallbackY: (S.yPct || 0) / 100 * C
			});
			w.x = v.left - _.left, w.y = v.top - _.top, w.width = v.width, w.height = v.height;
			let T = Math.max(24, a.includes("n") ? w.height + w.y : _.height - w.y), E = Dy({
				geometry: w,
				deltaX: b,
				deltaY: x,
				direction: a,
				minimumWidth: Math.max(24, 4 / 100 * y),
				minimumHeight: 24,
				maximumWidth: a.includes("w") ? w.width + w.x : y - w.x,
				maximumHeight: a.includes("n") ? Math.min(900, T) : 900,
				aspectRatioLocked: u || s && o.shape === "circle",
				aspectRatio: o.shape === "circle" ? 1 : w.width / w.height,
				scaleFont: !1
			}), D = Ty(E, y, {
				includeHeight: p && !u && !c && !(s && o.shape === "circle"),
				includeFontSize: !1
			});
			l && (delete D.positionMode, delete D.xPct, delete D.yPx, Object.assign(D, Le(o, E, _.width, _.height))), i("update-renderer-item-style", t, n, {
				...D,
				...f && !s ? { widthMode: "fixed" } : {},
				...!p && !u ? { heightPx: o.heightPx } : {}
			}), Re(n, E, y);
		}
		function It(e, t, n) {
			let r = document.createRange();
			r.selectNodeContents(e);
			try {
				r.setEnd(t, n);
			} catch {
				return 0;
			}
			return r.toString().length;
		}
		function Lt(e) {
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
			let i = e.innerText.replace(/\r\n?/gu, "\n"), a = It(e, t.anchorNode, t.anchorOffset), o = It(e, t.focusNode, t.focusOffset), s = Math.min(a, o), c = Math.max(a, o), l = (e) => i.slice(0, Math.max(0, e)).split("\n").length - 1, u = l(s), d = l(c > s ? c - 1 : c);
			return Array.from({ length: Math.max(1, d - u + 1) }, (e, t) => u + t);
		}
		function Rt(e, t, n, a = null, o = null) {
			if (!r.editable || n.isLocked) return;
			let s = o || e.currentTarget, c = s.closest(".rendered-item");
			if (!c || c.classList.contains("is-editing") || (a || n).isLocked) return;
			e.preventDefault(), e.stopPropagation(), Tt(t, n);
			let l = j(t, n, a), u = String(l ?? "").replace(/\r\n?/g, "\n"), d = !pe(l), f = M(n, a), p = !1, m = !1;
			x("text-edit"), c.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", d && (s.textContent = f), s.focus();
			let h = window.getSelection(), g = document.createRange();
			g.selectNodeContents(s), h.removeAllRanges(), h.addRange(g);
			let _ = () => {
				let e = Lt(s);
				i("select-text-lines", t, n, {
					scopeKey: vt(a),
					indexes: e
				});
			};
			_(), document.addEventListener("selectionchange", _);
			let v = () => {
				if (m) return;
				m = !0;
				let e = s.innerText.replace(/\r\n?/g, "\n");
				p ? d ? (s.classList.remove("rendered-text"), s.classList.add("rendered-empty"), s.textContent = f) : s.textContent = u : d && e === f ? (s.classList.remove("rendered-text"), s.classList.add("rendered-empty"), s.textContent = f) : i("update-item-content", t, n, e, a), s.contentEditable = "false", c.classList.remove("is-editing"), s.removeEventListener("blur", v), s.removeEventListener("keydown", y), document.removeEventListener("selectionchange", _), i("select-text-lines", t, n, null), S("text-edit");
			}, y = (e) => {
				e.key === "Escape" && (e.preventDefault(), p = !0, s.blur(), m || v());
			};
			s.addEventListener("blur", v), s.addEventListener("keydown", y);
		}
		function zt(e, t, n, r = null) {
			if (Tt(t, n, r ? {
				type: e.type,
				pointerId: e.pointerId,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				shiftKey: e.shiftKey,
				fieldKey: r.fieldKey
			} : e), e.currentTarget.closest(".rendered-item")?.classList.contains("is-editing")) {
				let a = e.target.closest?.("[data-text-line-index]");
				a && i("select-text-lines", t, n, {
					scopeKey: vt(r),
					indexes: [Number(a.dataset.textLineIndex)]
				});
				return;
			}
		}
		function Bt(e, t, n) {
			if (!r.editable || n.isLocked) return;
			let i = e.currentTarget, a = e.target.closest?.(".rendered-text, .rendered-empty"), o = a && i.contains(a) ? a : i.querySelector(".rendered-text, .rendered-empty");
			if (!o) return;
			let s = o.dataset.fieldKey;
			Rt(e, t, n, s && A(n).find((e) => e.fieldKey === s) || null, o);
		}
		function Vt(e, t) {
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
			a.classList.add("is-resizing"), x("section-resize");
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
			let u = l ? Math.max(0, c - l.height) : Bb, p = o ? [...o.querySelectorAll(".rendered-item")].reduce((e, t) => {
				let n = t.getBoundingClientRect();
				return Math.max(e, n.bottom - l.top);
			}, 0) : 0, m = Math.max(50, Math.ceil(p + u)), h = hy, g = !1, _ = (n) => {
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
					a.classList.remove("is-resizing"), globalThis.removeEventListener("pointermove", _), globalThis.removeEventListener("pointerup", b), globalThis.removeEventListener("pointercancel", b), globalThis.removeEventListener("blur", y), document.removeEventListener("visibilitychange", v), n.removeEventListener("lostpointercapture", y), f === y && (f = null), S("section-resize");
				}
			}, b = (t) => {
				t.pointerId === e.pointerId && y();
			};
			f = y, globalThis.addEventListener("pointermove", _, { passive: !1 }), globalThis.addEventListener("pointerup", b), globalThis.addEventListener("pointercancel", b), globalThis.addEventListener("blur", y), document.addEventListener("visibilitychange", v), n.addEventListener("lostpointercapture", y);
		}
		function Ht() {
			if (!o.value) return {
				count: 0,
				itemPatches: {},
				sectionPatches: {},
				viewport: w.value ? "mobile" : "desktop"
			};
			let e = {}, t = {}, n = 0;
			return o.value.querySelectorAll(".rendered-section").forEach((r) => {
				let i = r.dataset.sectionKey, a = r.querySelector(".rendered-items"), o = a?.getBoundingClientRect();
				if (!i || !a || !o?.width) return;
				let s = T.value.find((e) => e.sectionKey === i), c = new Map((s?.items || []).map((e) => [e.itemKey, e])), l = 0, u = [...a.querySelectorAll(".rendered-item[data-style-key]")].flatMap((e, t) => {
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
				let f = d.reduce((e, t) => Math.max(e, t.top + t.height), 0), p = Math.min(hy, Math.ceil(f + Bb * 2));
				l > 0 && p > r.getBoundingClientRect().height + .5 && (t[i] = { minHeight: p });
			}), {
				count: n,
				itemPatches: e,
				sectionPatches: t,
				viewport: w.value ? "mobile" : "desktop"
			};
		}
		function Ut() {
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
				viewport: w.value ? "mobile" : "desktop",
				diagnostics: []
			};
			let e = [], t = 0, n = 0, i = 0, a = 0, s = 0, c = 0, l = 0, u = 0, d = [...o.value.querySelectorAll(".rendered-image__placeholder")], f = Array.isArray(r.assets?.expected) ? r.assets.expected.filter((e) => e?.required !== !1) : null, p = f ? f.filter((e) => e.targetType === "component-field-image") : null, m = p ? new Set(p.map((e) => [
				e.pageSectionInstanceId,
				e.pageComponentInstanceId,
				e.fieldKey
			].map((e) => String(e || "")).join(":"))) : null, h = m ? d.filter((e) => m.has(e.dataset.assetTargetKey || "")).length : d.length, g = f ? f.filter((e) => {
				if (e.targetType !== "section-key-visual") return !1;
				let t = (r.content?.sectionSnapshot || []).find((t) => (t.pageSectionInstanceId || t.sectionKey) === e.pageSectionInstanceId);
				return !t || !de(t);
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
					let t = T.value.find((e) => e.sectionKey === o), n = globalThis.getComputedStyle?.(r)?.backgroundImage || "none";
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
				viewport: w.value ? "mobile" : "desktop",
				diagnostics: e
			};
		}
		return t({
			inspectLayoutCollisions: Ht,
			inspectLayoutQuality: Ut
		}), (t, n) => (B(), V("div", {
			ref_key: "rendererRoot",
			ref: o,
			class: N(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-token-usage-policy": !!e.content?.runtimeTheme?.designTokens?.usagePolicy,
				"has-editor-guides": e.editable && e.showGuides,
				"is-outline-mode": e.editable && e.outlineMode
			}]),
			style: Se({
				"--promo-font": O.value.theme.fontFamilyToken ? `var(${O.value.theme.fontFamilyToken})` : O.value.theme.fontFamily,
				"--promo-width": `${Math.min(1280, Number(O.value.responsive.contentMaxWidth || 1280))}px`,
				"--promo-min-width": `${O.value.responsive.contentMinWidth || 0}px`,
				...k.value
			})
		}, [
			e.editable && e.showGuides ? (B(), V("div", Qy)) : W("", !0),
			e.editable ? (B(), V("p", $y, P(v.value), 1)) : W("", !0),
			(B(!0), V(z, null, R(T.value, (t) => (B(), V("section", {
				key: t.sectionKey,
				class: N(["rendered-section", [
					`rendered-section--${t.sectionKey}`,
					Te("section", t.sectionKey),
					{
						"is-outline-section": e.editable && e.outlineMode,
						"is-flow-layout": be(t)
					}
				]]),
				"data-section-key": t.sectionKey,
				"data-section-role": t.sectionRole || null,
				"data-motion-target": Ce("section", t.sectionKey)?.trigger === "viewport-enter" ? `section:${t.sectionKey}` : null,
				style: Se({
					...pt(t),
					...Ee("section", t.sectionKey)
				}),
				"aria-busy": Ne(t)?.kind === "processing" ? "true" : void 0
			}, [
				e.editable && Ne(t) ? (B(), V("div", {
					key: 0,
					class: N(["section-ai-state", `is-${Ne(t).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: Ne(t).detail || void 0
				}, [Ne(t).kind === "processing" ? (B(), V("i", nb)) : W("", !0), H("span", null, P(Ne(t).label), 1)], 10, tb)) : W("", !0),
				H("div", rb, [H("div", {
					class: N(["rendered-items", { "is-flow-layout": be(t) }]),
					style: Se(mt(t))
				}, [(B(!0), V(z, null, R(le(t), (r, i) => (B(), V("article", {
					key: r.itemKey,
					class: N(["rendered-item", [
						`rendered-item--${r.fieldKind || "text"}`,
						Oe(t, r, i),
						{
							"is-editable": e.editable && !r.isLocked,
							"is-selected": e.editable && (e.selectedItemKey === me(t, r) || e.selectedItemKeys.includes(me(t, r))),
							"has-selected-field": e.editable && e.selectedFieldKey.startsWith(`${me(t, r)}.`),
							"is-hidden-in-output": e.editable && !re(t, r),
							"is-locked": e.editable && r.isLocked,
							"is-empty": e.editable && ue(t, r),
							"is-free-positioned": he(t, r).positionMode === "free",
							"is-anchored-positioned": he(t, r).positionMode === "anchored",
							"is-flow-positioned": he(t, r).positionMode === "flow",
							"is-fixed-height": r.fieldKind === "text" && !kn(Sy)(r, he(t, r)),
							"has-text-gradient": !!he(t, r).textGradientToken,
							"has-text-background": !!(he(t, r).textBackgroundToken || he(t, r).textBackground)
						}
					]]),
					"data-item-key": r.itemKey,
					"data-style-key": me(t, r),
					"data-collection-key": r.collection?.collectionKey || null,
					"data-collection-index": r.collection?.index ?? null,
					"data-auto-height-measure": "true",
					"data-motion-target": De(t, r, i)?.trigger === "viewport-enter" ? `item:${me(t, r)}` : null,
					style: Se({
						...ht(t, r),
						...ke(t, r, i)
					}),
					onClick: yu((e) => Tt(t, r, e), ["stop"]),
					onDblclickCapture: (e) => Bt(e, t, r),
					onPointerdown: (e) => At(e, t, r)
				}, [
					e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === me(t, r) ? (B(), V("button", {
						key: 0,
						type: "button",
						class: "component-action-handle component-move-handle",
						"aria-label": `${r.name || r.itemKey} 이동`,
						title: `${r.name || r.itemKey} 이동 (Shift + 방향키: 10px)`,
						onPointerdown: (e) => jt(e, t, r),
						onKeydown: (e) => Nt(e, t, r)
					}, null, 40, ab)) : W("", !0),
					e.editable && e.showGuides && e.selectedItemKey === me(t, r) ? (B(), V("button", {
						key: 1,
						type: "button",
						class: "component-action-handle component-properties-handle",
						"aria-label": `${r.name || r.itemKey} 속성`,
						title: `${r.name || r.itemKey} 속성 열기`,
						onPointerdown: n[0] ||= yu(() => {}, ["stop"]),
						onClick: (e) => Mt(e, t, r)
					}, null, 40, ob)) : W("", !0),
					e.editable && !re(t, r) ? (B(), V("span", sb, "비노출")) : W("", !0),
					e.editable && e.outlineMode ? (B(), V("span", cb, [
						U(P(r.name || r.itemKey) + " ", 1),
						H("small", null, P(r.fieldKind || "text"), 1),
						r.isLocked ? (B(), V("em", lb, "잠금")) : W("", !0),
						ue(t, r) ? (B(), V("em", ub, "비어 있음")) : W("", !0)
					])) : W("", !0),
					ee(r) ? (B(), js(Zy, {
						key: 4,
						"render-spec": ee(r),
						"registered-only": D.value,
						fields: A(r),
						value: j(t, r),
						viewport: e.viewportOverride,
						"viewport-width": a.value,
						"mobile-breakpoint": Number(O.value.responsive?.mobileBreakpoint || 720),
						"tablet-breakpoint": Number(O.value.responsive?.tabletBreakpoint || 1024),
						editable: e.editable,
						onSelectField: (e) => Dt(t, r, e)
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
					])) : A(r).length > 1 ? (B(), V("div", {
						key: 5,
						class: "rendered-component-fields",
						style: Se({
							"--component-field-gap": `${Math.min(240, Math.max(0, Number(he(t, r).fieldGapPx) || 14))}px`,
							"--component-content-padding": `${Math.min(240, Math.max(0, Number(he(t, r).contentPaddingPx) || 0))}px`
						})
					}, [(B(!0), V(z, null, R(ae(t, r), (i) => (B(), V("div", {
						key: i.fieldKey,
						class: N(["rendered-component-field-shell", {
							"is-hidden-in-output": e.editable && !ie(t, r, i),
							"is-selected-field": e.editable && qe(t, r, i),
							"is-locked-field": e.editable && i.isLocked
						}]),
						style: Se(Ge(t, r, i)),
						"data-field-key": i.fieldKey,
						"data-field-kind": i.fieldKind,
						"data-field-style-key": Ke(t, r, i),
						"aria-selected": e.editable ? String(qe(t, r, i)) : void 0,
						tabindex: e.editable && qe(t, r, i) ? 0 : -1,
						onClick: yu((e) => Et(e, t, r, i), ["stop"])
					}, [
						i.fieldKind === "cta" ? (B(), V("a", {
							key: 0,
							class: "rendered-cta rendered-component-field",
							style: Se(We(t, r, i)),
							href: fe(j(t, r, i)),
							target: j(t, r, i)?.target || "_self",
							rel: j(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0,
							draggable: !e.editable && void 0,
							onClick: yu((e) => Et(e, t, r, i), ["stop"]),
							onDragstart: kt
						}, P(j(t, r, i)?.label || i.name), 45, fb)) : i.fieldKind === "image" ? (B(), V(z, { key: 1 }, [H("div", {
							class: "rendered-image-frame rendered-component-image-frame rendered-component-field",
							style: Se($e(t, r, i)),
							role: et(t, r, i).role,
							"aria-label": et(t, r, i).label,
							"aria-hidden": et(t, r, i).ariaHidden,
							"aria-busy": Ne(t, r, i)?.kind === "processing" ? "true" : void 0
						}, [oe(j(t, r, i)) ? W("", !0) : (B(), V("div", {
							key: 0,
							class: "rendered-image__placeholder",
							"data-asset-target-key": `${t.sectionKey}:${r.itemKey}:${i.fieldKey}`
						}, [H("span", null, P(i.name), 1), n[2] ||= H("small", null, "이미지 준비 중", -1)], 8, mb))], 12, pb), e.editable && Ne(t, r, i) ? (B(), V("div", {
							key: 0,
							class: N(["item-ai-state", `is-${Ne(t, r, i).kind}`]),
							role: "status",
							"aria-live": "polite"
						}, [Ne(t, r, i).kind === "processing" ? (B(), V("i", hb)) : W("", !0), H("span", null, P(Ne(t, r, i).label), 1)], 2)) : W("", !0)], 64)) : pe(j(t, r, i)) && xt(t, r, i) ? (B(), V("div", {
							key: 2,
							class: N(["rendered-text rendered-text--lines rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: Se(We(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: yu((e) => zt(e, t, r, i), ["stop"]),
							onDblclick: yu((e) => Rt(e, t, r, i), ["stop"])
						}, [(B(!0), V(z, null, R(St(t, r, i), (e) => (B(), V("div", {
							key: `${i.fieldKey}-line-${e.index}`,
							class: N(["rendered-text-line", wt(e)]),
							style: Se(Ct(e)),
							"data-text-line-index": e.index
						}, [H("span", vb, P(e.text), 1)], 14, _b))), 128))], 46, gb)) : pe(j(t, r, i)) && Ue(t, r, i).listType ? (B(), js(Ta(gt(t, r, i)), {
							key: 3,
							class: N(["rendered-text rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: Se(We(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: yu((e) => zt(e, t, r, i), ["stop"]),
							onDblclick: yu((e) => Rt(e, t, r, i), ["stop"])
						}, {
							default: Mr(() => [(B(!0), V(z, null, R(_t(j(t, r, i)), (e, t) => (B(), V("li", { key: `${i.fieldKey}-${t}` }, [H("span", yb, P(e), 1)]))), 128))]),
							_: 2
						}, 1064, [
							"class",
							"style",
							"data-field-key",
							"onClick",
							"onDblclick"
						])) : pe(j(t, r, i)) ? (B(), V("p", {
							key: 4,
							class: N(["rendered-text rendered-component-field", { "rendered-text--title": i.textType === "title" }]),
							style: Se(We(t, r, i)),
							"data-field-key": i.fieldKey,
							onClick: yu((e) => zt(e, t, r, i), ["stop"]),
							onDblclick: yu((e) => Rt(e, t, r, i), ["stop"])
						}, [H("span", xb, P(j(t, r, i)), 1)], 46, bb)) : (B(), V("p", {
							key: 5,
							class: "rendered-empty rendered-component-field",
							"data-field-key": i.fieldKey,
							onClick: yu((e) => zt(e, t, r, i), ["stop"]),
							onDblclick: yu((e) => Rt(e, t, r, i), ["stop"])
						}, P(M(r, i)), 41, Sb)),
						e.editable && e.showGuides && qe(t, r, i) ? (B(), V("button", {
							key: 6,
							type: "button",
							class: "component-action-handle component-field-properties-handle",
							"aria-label": `${i.name || i.fieldKey} 속성 열기`,
							title: `${i.name || i.fieldKey} 속성 열기`,
							onPointerdown: n[1] ||= yu(() => {}, ["stop"]),
							onClick: (e) => Je(e, t, r, i)
						}, null, 40, Cb)) : W("", !0),
						e.editable && e.showGuides && qe(t, r, i) && !r.isLocked && !i.isLocked ? (B(!0), V(z, { key: 7 }, R(Ye(i), (e) => (B(), V("button", {
							key: e,
							type: "button",
							class: N(["item-resize-handle component-field-resize-handle", `item-resize-handle--${e}`]),
							"aria-label": Xe(i, e),
							onPointerdown: yu((n) => Ze(n, t, r, i, e), ["stop"]),
							onKeydown: (n) => Qe(n, t, r, i, e)
						}, null, 42, wb))), 128)) : W("", !0)
					], 14, db))), 128))], 4)) : r.fieldKind === "cta" ? (B(), V("a", {
						key: 6,
						class: "rendered-cta",
						href: fe(j(t, r)),
						target: j(t, r)?.target || "_self",
						rel: j(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0,
						draggable: !e.editable && void 0,
						onClick: Ot,
						onDragstart: kt
					}, P(j(t, r)?.label || r.name), 41, Tb)) : r.fieldKind === "image" ? (B(), V(z, { key: 7 }, [
						H("div", {
							class: N(["rendered-image-frame", `rendered-image-frame--${he(t, r).shape || "square"}`]),
							style: Se(He(t, r)),
							role: tt(t, r).role,
							"aria-label": tt(t, r).label,
							"aria-hidden": tt(t, r).ariaHidden,
							"aria-busy": Ne(t, r)?.kind === "processing" ? "true" : void 0
						}, [oe(j(t, r)) ? W("", !0) : (B(), V("div", {
							key: 0,
							class: "rendered-image__placeholder",
							"data-asset-target-key": `${t.sectionKey}:${r.itemKey}:`
						}, [H("span", null, P(r.name), 1), H("small", null, P(j(t, r)?.value || "이미지 준비 중"), 1)], 8, Db))], 14, Eb),
						e.editable && Ne(t, r) ? (B(), V("div", {
							key: 0,
							class: N(["item-ai-state", `is-${Ne(t, r).kind}`]),
							role: "status",
							"aria-live": "polite",
							title: Ne(t, r).detail || void 0
						}, [Ne(t, r).kind === "processing" ? (B(), V("i", kb)) : W("", !0), H("span", null, P(Ne(t, r).label), 1)], 10, Ob)) : W("", !0),
						e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === me(t, r) ? (B(!0), V(z, { key: 1 }, R(Pe(t, r), (e) => (B(), V("button", {
							key: e,
							type: "button",
							class: N(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
							"aria-label": Ie(r, e),
							onPointerdown: yu((n) => Pt(n, t, r, e), ["stop"]),
							onKeydown: (n) => Ft(n, t, r, e)
						}, null, 42, Ab))), 128)) : W("", !0)
					], 64)) : (B(), V(z, { key: 8 }, [pe(j(t, r)) && xt(t, r) ? (B(), V("div", {
						key: 0,
						class: N(["rendered-text rendered-text--lines", { "rendered-text--title": r.textType === "title" }]),
						onClick: yu((e) => zt(e, t, r), ["stop"]),
						onDblclick: yu((e) => Rt(e, t, r), ["stop"])
					}, [(B(!0), V(z, null, R(St(t, r), (e) => (B(), V("div", {
						key: `${r.itemKey}-line-${e.index}`,
						class: N(["rendered-text-line", wt(e)]),
						style: Se(Ct(e)),
						"data-text-line-index": e.index
					}, [H("span", Nb, P(e.text), 1)], 14, Mb))), 128))], 42, jb)) : pe(j(t, r)) && he(t, r).listType ? (B(), js(Ta(gt(t, r)), {
						key: 1,
						class: N(["rendered-text", { "rendered-text--title": r.textType === "title" }]),
						onClick: yu((e) => zt(e, t, r), ["stop"]),
						onDblclick: yu((e) => Rt(e, t, r), ["stop"])
					}, {
						default: Mr(() => [(B(!0), V(z, null, R(_t(j(t, r)), (e, t) => (B(), V("li", { key: `${r.itemKey}-${t}` }, [H("span", Pb, P(e), 1)]))), 128))]),
						_: 2
					}, 1064, [
						"class",
						"onClick",
						"onDblclick"
					])) : pe(j(t, r)) ? (B(), V("p", {
						key: 2,
						class: N(["rendered-text", { "rendered-text--title": r.textType === "title" }]),
						onClick: yu((e) => zt(e, t, r), ["stop"]),
						onDblclick: yu((e) => Rt(e, t, r), ["stop"])
					}, [H("span", Ib, P(j(t, r)), 1)], 42, Fb)) : (B(), V("p", {
						key: 3,
						class: "rendered-empty",
						onClick: yu((e) => zt(e, t, r), ["stop"]),
						onDblclick: yu((e) => Rt(e, t, r), ["stop"])
					}, P(M(r)), 41, Lb))], 64)),
					e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === me(t, r) ? (B(!0), V(z, { key: 9 }, R(Pe(t, r), (e) => (B(), V("button", {
						key: e,
						type: "button",
						class: N(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
						"aria-label": Ie(r, e),
						onPointerdown: yu((n) => Pt(n, t, r, e), ["stop"]),
						onKeydown: (n) => Ft(n, t, r, e)
					}, null, 42, Rb))), 128)) : W("", !0)
				], 46, ib))), 128))], 6)]),
				e.editable && e.showGuides ? (B(), V("button", {
					key: 1,
					class: "section-resize-handle",
					type: "button",
					"aria-label": `${t.name} 섹션 높이 조절`,
					title: `${t.name} 섹션 높이 조절`,
					onPointerdown: (e) => Vt(e, t)
				}, null, 40, zb)) : W("", !0)
			], 14, eb))), 128))
		], 6));
	}
}, Ub = Object.freeze({
	contractVersion: 2,
	formTemplate: Object.freeze({ designTokens: Object.freeze({ values: Object.freeze({}) }) }),
	sectionSnapshot: Object.freeze([]),
	sectionInputs: Object.freeze({}),
	sectionOrder: Object.freeze([]),
	resourceReferences: Object.freeze([])
}), Wb = Object.freeze({
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
}), Gb = Object.freeze({
	contractVersion: 1,
	items: Object.freeze({})
}), Kb = Object.freeze({
	contractVersion: 2,
	sections: Object.freeze({}),
	items: Object.freeze({})
});
function qb(e, t) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : t;
}
function Jb(e = {}) {
	let t = qb(e, {}), n = qb(t.snapshot, {});
	return {
		content: qb(t.content || n.content, Ub),
		designSpec: qb(t.designSpec || n.designSpec, Wb),
		assets: qb(t.assets || n.assets, Gb),
		motionSpec: qb(t.motionSpec || n.motionSpec, Kb),
		viewportOverride: [
			"desktop",
			"tablet",
			"mobile"
		].includes(t.viewportOverride) ? t.viewportOverride : ""
	};
}
//#endregion
//#region visual-editor/src/runtime/PromoReadonlyRenderer.vue
var Yb = {
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
		}
	},
	setup(e) {
		let t = e, n = G(() => Jb(t));
		return (e, t) => (B(), js(Hb, {
			class: "promo-readonly-renderer",
			content: n.value.content,
			"design-spec": n.value.designSpec,
			assets: n.value.assets,
			"motion-spec": n.value.motionSpec,
			"viewport-override": n.value.viewportOverride,
			editable: !1,
			"show-guides": !1,
			"outline-mode": !1
		}, null, 8, [
			"content",
			"design-spec",
			"assets",
			"motion-spec",
			"viewport-override"
		]));
	}
};
//#endregion
//#region admin-app/src/services/section-layout-workbench.mjs
function Xb(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Zb(e = {}) {
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
function Qb(e = {}) {
	let t = Array.isArray(e.fields) && e.fields.length ? e.fields : [e];
	return t.length === 1 ? Zb(t[0]) : { fields: Object.fromEntries(t.map((e) => [e.fieldKey, Zb(e)])) };
}
function $b(e = {}, t = []) {
	let n = Xb(e) || {}, r = t.map((e) => String(e.itemKey || "")).filter(Boolean), i = (e) => ({
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
		content: Object.fromEntries(t.map((e) => [e.itemKey, Object.prototype.hasOwnProperty.call(n.content || {}, e.itemKey) ? n.content[e.itemKey] : Qb(e)])),
		viewports: {
			desktop: i("desktop"),
			mobile: i("mobile")
		}
	};
}
function ex(e = {}, t = []) {
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
function tx(e, t, n, r) {
	let i = Xb(e), a = t === "mobile" ? "mobile" : "desktop", o = i.viewports?.[a]?.items?.[n];
	return o && (i.viewports[a].items[n] = {
		...o,
		...Xb(r)
	}), i;
}
function nx(e, t, n, r) {
	let i = Xb(e), a = t === "mobile" ? "mobile" : "desktop";
	return i.viewports[a].visibility.items[n] = r !== !1, i;
}
function rx(e = {}, t = [], n = {}) {
	let r = $b(n, t), i = e.sectionKey || "preview-section", a = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, Xb(r.viewports.desktop.items[e.itemKey])])), o = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, Xb(r.viewports.mobile.items[e.itemKey])])), s = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, r.viewports.desktop.visibility.items[e.itemKey] !== !1])), c = Object.fromEntries(t.map((e) => [`${i}.${e.itemKey}`, r.viewports.mobile.visibility.items[e.itemKey] !== !1]));
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
				...Xb(e),
				sectionKey: i,
				items: Xb(t)
			}],
			sectionInputs: { [i]: Xb(r.content) },
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
			sectionStyles: { [i]: Xb(r.sectionStyle) },
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
var ix = ["aria-label"], ax = [
	"aria-current",
	"data-dom-path",
	"onClick"
], ox = { key: 0 }, sx = /*#__PURE__*/ jh({
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
		return (t, r) => (B(), V("nav", {
			class: "dom-structure-tree",
			"aria-label": e.ariaLabel
		}, [(B(!0), V(z, null, R(e.nodes, (t) => (B(), V("button", {
			key: t.path,
			type: "button",
			class: N({ active: t.path === e.selectedPath }),
			style: Se({ paddingLeft: `${10 + Number(t.depth || 0) * 16}px` }),
			"aria-current": t.path === e.selectedPath ? "true" : void 0,
			"data-dom-path": t.path,
			onClick: (e) => n("select", t.path)
		}, [H("small", null, P(t.tag || t.node?.tag || t.kind || "node"), 1), H("span", null, P(t.label || t.path), 1)], 14, ax))), 128)), e.nodes.length ? W("", !0) : (B(), V("p", ox, P(e.emptyMessage), 1))], 8, ix));
	}
}, [["__scopeId", "data-v-e9c62dcf"]]), cx = ["data-preview-mode"], lx = {
	class: "live-preview-host__viewports",
	role: "group",
	"aria-label": "미리보기 화면 크기"
}, ux = ["aria-pressed", "onClick"], dx = { class: "live-preview-host__stage" }, fx = /*#__PURE__*/ jh({
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
		let n = e, r = t, i = /* @__PURE__ */ I(null), a = G(() => ({
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
			await mr(), (i.value?.querySelectorAll?.("[data-render-path],[data-item-key],[data-section-key]") || []).forEach((e) => {
				let t = n.selectedNodeKey && [
					e.dataset.renderPath,
					e.dataset.fieldKey,
					e.dataset.itemKey,
					e.dataset.sectionKey
				].includes(n.selectedNodeKey);
				e.classList.toggle("is-live-preview-selected", !!t);
			});
		}
		return Hr(() => [n.selectedNodeKey, n.modelValue], c), fa(c), (t, n) => (B(), V("section", {
			class: "live-preview-host",
			"data-preview-mode": e.mode
		}, [H("header", null, [H("strong", null, P(e.title), 1), H("div", lx, [(B(), V(z, null, R([
			"desktop",
			"tablet",
			"mobile"
		], (t) => H("button", {
			key: t,
			type: "button",
			class: N({ active: e.modelValue === t }),
			"aria-pressed": e.modelValue === t,
			onClick: (e) => r("update:modelValue", t)
		}, P(t), 11, ux)), 64))])]), H("div", dx, [H("div", {
			ref_key: "previewRoot",
			ref: i,
			class: "live-preview-host__viewport",
			style: Se({ width: a.value }),
			onClick: s
		}, [Aa(t.$slots, "default", { viewport: e.modelValue }, void 0, !0)], 4)])], 8, cx));
	}
}, [["__scopeId", "data-v-0cec6315"]]), px = {
	class: "section-layout-dom-workbench",
	"aria-label": "섹션 DOM 구성 Workbench"
}, mx = { class: "action-row" }, hx = ["disabled"], gx = {
	key: 0,
	class: "field-error"
}, _x = {
	key: 1,
	class: "empty-state compact"
}, vx = { class: "section-layout-dom-workbench__grid" }, yx = {
	class: "section-layout-dom-workbench__inspector",
	"aria-label": "선택 구성 속성"
}, bx = ["value", "disabled"], xx = ["value", "disabled"], Sx = ["value", "disabled"], Cx = ["value", "disabled"], wx = ["value", "disabled"], Tx = ["value", "disabled"], Ex = ["value", "disabled"], Dx = { class: "inline-check" }, Ox = ["checked", "disabled"], kx = /*#__PURE__*/ jh({
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
		let n = e, r = t, i = /* @__PURE__ */ I("desktop"), a = /* @__PURE__ */ I("root"), o = /* @__PURE__ */ I($b(n.layout.layoutSnapshot, n.items)), s = /* @__PURE__ */ I(!1), c = /* @__PURE__ */ I(""), l = G(() => n.section.status === "draft"), u = G(() => ex(n.section, n.items)), d = G(() => u.value.find((e) => e.path === a.value) || u.value[0]), f = G(() => d.value?.itemKey && n.items.find((e) => e.itemKey === d.value.itemKey) || null), p = G(() => i.value === "mobile" ? "mobile" : "desktop"), m = G(() => f.value ? o.value.viewports[p.value].items[f.value.itemKey] : null), h = G(() => !f.value || o.value.viewports[p.value].visibility.items[f.value.itemKey] !== !1), g = G(() => rx(n.section, n.items, o.value)), _ = G(() => f.value?.itemKey || n.section.sectionKey);
		Hr(() => [n.layout.id, n.items], () => {
			o.value = $b(n.layout.layoutSnapshot, n.items), a.value = "root";
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
			f.value && (o.value = tx(o.value, p.value, f.value.itemKey, { [e]: v(t, m.value?.[e] || 0) }));
		}
		function x(e) {
			f.value && (o.value = nx(o.value, p.value, f.value.itemKey, e));
		}
		function S(e) {
			if (!e.itemKey) return;
			let t = u.value.find((t) => t.itemKey === e.itemKey);
			t && (a.value = t.path);
		}
		async function C() {
			if (!(!l.value || s.value)) {
				s.value = !0, c.value = "";
				try {
					let e = await iy.update(n.layout.id, n.section.id, {
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
		return (t, n) => (B(), V("section", px, [
			H("header", null, [H("div", null, [H("strong", null, P(e.layout.name) + " · DOM 구성", 1), H("small", null, P(e.layout.layoutKey) + " · 저장 대상: 선택한 레이아웃 프리셋", 1)]), H("div", mx, [H("button", {
				class: "tiny-button",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, "닫기"), H("button", {
				class: "tiny-button primary",
				type: "button",
				disabled: !l.value || s.value,
				onClick: C
			}, P(s.value ? "저장 중…" : "프리셋 저장"), 9, hx)])]),
			c.value ? (B(), V("p", gx, P(c.value), 1)) : W("", !0),
			l.value ? W("", !0) : (B(), V("p", _x, "활성·비활성 섹션은 읽기 전용입니다.")),
			H("div", vx, [
				Ls(sx, {
					nodes: u.value,
					"selected-path": a.value,
					"aria-label": "섹션 구성 구조",
					onSelect: n[1] ||= (e) => a.value = e
				}, null, 8, ["nodes", "selected-path"]),
				H("section", yx, [f.value ? (B(), V(z, { key: 1 }, [
					H("strong", null, P(f.value.name || f.value.itemKey), 1),
					H("small", null, P(p.value) + " Geometry", 1),
					H("label", null, [n[14] ||= U("X (%)", -1), H("input", {
						type: "number",
						min: "0",
						max: "100",
						step: "0.5",
						value: m.value.xPct,
						disabled: !l.value,
						onInput: n[4] ||= (e) => b("xPct", e.target.value)
					}, null, 40, Sx)]),
					H("label", null, [n[15] ||= U("Y (px)", -1), H("input", {
						type: "number",
						min: "0",
						max: "2400",
						value: m.value.yPx,
						disabled: !l.value,
						onInput: n[5] ||= (e) => b("yPx", e.target.value)
					}, null, 40, Cx)]),
					H("label", null, [n[16] ||= U("너비 (%)", -1), H("input", {
						type: "number",
						min: "1",
						max: "100",
						step: "0.5",
						value: m.value.widthPct,
						disabled: !l.value,
						onInput: n[6] ||= (e) => b("widthPct", e.target.value)
					}, null, 40, wx)]),
					H("label", null, [n[17] ||= U("높이 (px)", -1), H("input", {
						type: "number",
						min: "20",
						max: "2400",
						value: m.value.heightPx,
						disabled: !l.value,
						onInput: n[7] ||= (e) => b("heightPx", e.target.value)
					}, null, 40, Tx)]),
					H("label", null, [n[18] ||= U("Z-index", -1), H("input", {
						type: "number",
						min: "0",
						max: "100",
						value: m.value.zIndex,
						disabled: !l.value,
						onInput: n[8] ||= (e) => b("zIndex", e.target.value)
					}, null, 40, Ex)]),
					H("label", Dx, [H("input", {
						type: "checkbox",
						checked: h.value,
						disabled: !l.value || f.value.isRequired || f.value.isLocked,
						onChange: n[9] ||= (e) => x(e.target.checked)
					}, null, 40, Ox), n[19] ||= H("span", null, "이 화면에서 표시", -1)])
				], 64)) : (B(), V(z, { key: 0 }, [
					n[13] ||= H("strong", null, "Section", -1),
					H("label", null, [n[11] ||= U("최소 높이", -1), H("input", {
						type: "number",
						min: "50",
						max: "2400",
						value: o.value.sectionStyle.minHeight,
						disabled: !l.value,
						onInput: n[2] ||= (e) => y("minHeight", v(e.target.value, 320))
					}, null, 40, bx)]),
					H("label", null, [n[12] ||= U("배경색", -1), H("input", {
						type: "color",
						value: o.value.sectionStyle.backgroundColor || "#ffffff",
						disabled: !l.value,
						onInput: n[3] ||= (e) => y("backgroundColor", e.target.value)
					}, null, 40, xx)])
				], 64))]),
				Ls(fx, {
					modelValue: i.value,
					"onUpdate:modelValue": n[10] ||= (e) => i.value = e,
					mode: "section",
					"selected-node-key": _.value,
					title: "Section Live Preview",
					onSelectNode: S
				}, {
					default: Mr(() => [Ls(Yb, {
						snapshot: g.value,
						"viewport-override": p.value
					}, null, 8, ["snapshot", "viewport-override"])]),
					_: 1
				}, 8, ["modelValue", "selected-node-key"])
			])
		]));
	}
}, [["__scopeId", "data-v-10b3829e"]]), Ax = ["desktop", "mobile"];
function jx(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function Mx(e, t, n, r = "error") {
	return {
		code: e,
		path: t,
		message: n,
		level: r
	};
}
function Nx(e, t = []) {
	let n = [], r = jx(e) ? e : {}, i = new Set(t.map(String));
	return r.contractVersion !== 1 && n.push(Mx("LAYOUT_CONTRACT_UNSUPPORTED", "$.contractVersion", "contractVersion 1만 지원합니다.")), r.layoutMode !== "free" && n.push(Mx("LAYOUT_MODE_UNSUPPORTED", "$.layoutMode", "layoutMode는 free여야 합니다.")), Ax.forEach((e) => {
		let a = `$.viewports.${e}`, o = r.viewports?.[e];
		if (!jx(o)) {
			n.push(Mx("LAYOUT_VIEWPORT_REQUIRED", a, `${e} viewport가 필요합니다.`));
			return;
		}
		let s = jx(o.items) ? o.items : {};
		t.forEach((t) => {
			jx(s[t]) || n.push(Mx("LAYOUT_GEOMETRY_INCOMPLETE", `${a}.items.${t}`, `${t} 컴포넌트의 ${e} geometry가 없습니다.`, "warning"));
		}), Object.entries(s).forEach(([e, t]) => {
			let r = `${a}.items.${e}`;
			if (i.size && !i.has(e) && n.push(Mx("LAYOUT_ITEM_KEY_UNKNOWN", r, `현재 Section에 없는 itemKey입니다: ${e}`)), !jx(t)) {
				n.push(Mx("LAYOUT_GEOMETRY_INVALID", r, "Geometry는 JSON Object여야 합니다."));
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
				(!Number.isFinite(o) || o < i || o > a) && n.push(Mx("LAYOUT_GEOMETRY_OUT_OF_RANGE", `${r}.${e}`, `${e} 값이 허용 범위를 벗어났습니다.`));
			});
		});
	}), n;
}
function Px(e, t, n = !1) {
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
function Fx(e) {
	return `${String(e?.layoutKey || "layout-preset").replace(/[^a-zA-Z0-9_-]+/g, "-") || "layout-preset"}.json`;
}
//#endregion
//#region admin-app/src/components/JsonTreeView.vue
var Ix = { class: "json-tree__row" }, Lx = ["aria-label", "aria-expanded"], Rx = {
	key: 1,
	class: "json-tree__spacer",
	"aria-hidden": "true"
}, zx = ["title"], Bx = {
	key: 2,
	class: "json-tree__preview"
}, Vx = { key: 3 }, Hx = {
	key: 0,
	class: "json-tree__children"
}, Ux = /*#__PURE__*/ jh({
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
		let n = e, r = t, i = /* @__PURE__ */ I(!0), a = G(() => n.value !== null && typeof n.value == "object"), o = G(() => a.value ? Object.entries(n.value) : []), s = G(() => Array.isArray(n.value) ? `Array(${n.value.length})` : `{${o.value.length}}`), c = G(() => typeof n.value == "string" ? JSON.stringify(n.value) : String(n.value)), l = G(() => {
			let e = n.query.trim().toLocaleLowerCase();
			return e ? `${n.path} ${a.value ? s.value : c.value}`.toLocaleLowerCase().includes(e) : !1;
		});
		function u(e) {
			return Array.isArray(n.value) ? `${n.path}[${e}]` : /^[A-Za-z_$][\w$]*$/.test(e) ? `${n.path}.${e}` : `${n.path}[${JSON.stringify(e)}]`;
		}
		return Hr(() => n.expandRevision, () => {
			i.value = !0;
		}), Hr(() => n.collapseRevision, () => {
			i.value = !1;
		}), (t, n) => {
			let d = Ca("JsonTreeView", !0);
			return B(), V("li", { class: N(["json-tree__node", { "is-match": l.value }]) }, [H("div", Ix, [
				a.value ? (B(), V("button", {
					key: 0,
					class: "json-tree__toggle",
					type: "button",
					"aria-label": `${e.path} ${i.value ? "접기" : "펼치기"}`,
					"aria-expanded": i.value,
					onClick: n[0] ||= (e) => i.value = !i.value
				}, P(i.value ? "−" : "+"), 9, Lx)) : (B(), V("span", Rx)),
				H("button", {
					class: "json-tree__path",
					type: "button",
					title: `${e.path} 경로 복사`,
					onClick: n[1] ||= (t) => r("copy-path", e.path)
				}, P(e.path), 9, zx),
				a.value ? (B(), V("span", Bx, P(s.value), 1)) : (B(), V("code", Vx, P(c.value), 1))
			]), a.value && i.value ? (B(), V("ul", Hx, [(B(!0), V(z, null, R(o.value, ([t, i]) => (B(), js(d, {
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
			]))), 128))])) : W("", !0)], 2);
		};
	}
}, [["__scopeId", "data-v-0a8b684d"]]), Wx = { class: "json-snapshot-dialog__surface" }, Gx = { class: "json-snapshot-dialog__summary" }, Kx = { key: 0 }, qx = { key: 1 }, Jx = {
	class: "json-snapshot-dialog__tabs",
	"aria-label": "저장 JSON 종류"
}, Yx = ["aria-pressed", "onClick"], Xx = { class: "json-snapshot-dialog__toolbar" }, Zx = { key: 0 }, Qx = ["aria-pressed"], $x = ["aria-pressed"], eS = {
	key: 0,
	class: "json-snapshot-dialog__tree",
	role: "tree",
	"aria-label": "저장 JSON 트리"
}, tS = {
	key: 1,
	class: "json-snapshot-dialog__code",
	tabindex: "0"
}, nS = {
	class: "json-snapshot-dialog__validation",
	"aria-live": "polite"
}, rS = { key: 0 }, iS = { key: 1 }, aS = { key: 2 }, oS = {
	key: 3,
	role: "status"
}, sS = { key: 4 }, cS = {
	name: "SectionLayoutPresetManager",
	components: {
		JsonSnapshotDialog: /* @__PURE__ */ jh({
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
				let n = e, r = t, i = /* @__PURE__ */ I(null), a = /* @__PURE__ */ I("snapshot"), o = /* @__PURE__ */ I(""), s = /* @__PURE__ */ I(""), c = /* @__PURE__ */ I("tree"), l = /* @__PURE__ */ I(0), u = /* @__PURE__ */ I(0), d = null, f = null, p = Object.freeze([
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
				]), m = G(() => Px(n.layout, n.section, n.aiSelectable)), h = G(() => ({
					snapshot: n.layout.layoutSnapshot || {},
					metadata: n.layout.selectionMetadata || {},
					full: m.value
				})[a.value]), g = G(() => JSON.stringify(h.value, null, 2)), _ = G(() => g.value.split("\n")), v = G(() => o.value.trim().toLocaleLowerCase()), y = G(() => v.value ? _.value.filter((e) => e.toLocaleLowerCase().includes(v.value)).length : 0), b = G(() => Nx(n.layout.layoutSnapshot, n.items.map((e) => e.itemKey))), x = G(() => b.value.filter((e) => e.level === "error")), S = G(() => b.value.filter((e) => e.level === "warning"));
				function C() {
					i.value?.open ? i.value.close() : r("close");
				}
				function w() {
					r("close"), mr(() => d?.focus?.());
				}
				function T(e) {
					e.target === i.value && C();
				}
				async function E() {
					try {
						await globalThis.navigator.clipboard.writeText(g.value), s.value = "JSON을 복사했습니다.";
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
					let e = new Blob([`${g.value}\n`], { type: "application/json;charset=utf-8" }), t = URL.createObjectURL(e), r = globalThis.document.createElement("a");
					r.href = t, r.download = Fx(n.layout), r.click(), URL.revokeObjectURL(t);
				}
				return Hr(a, () => {
					o.value = "";
				}), fa(async () => {
					d = globalThis.document.activeElement, await mr(), i.value && !i.value.open && i.value.showModal();
				}), ha(() => {
					globalThis.clearTimeout(f), i.value?.open && i.value.close();
				}), (t, n) => (B(), V("dialog", {
					ref_key: "dialog",
					ref: i,
					class: "json-snapshot-dialog",
					"aria-labelledby": "json-snapshot-dialog-title",
					onClick: T,
					onCancel: yu(C, ["prevent"]),
					onClose: w
				}, [H("section", Wx, [
					H("header", null, [H("div", null, [n[5] ||= H("strong", { id: "json-snapshot-dialog-title" }, "Layout Preset 저장 JSON", -1), H("small", null, P(e.layout.name) + " · " + P(e.layout.layoutKey), 1)]), H("button", {
						class: "tiny-button",
						type: "button",
						"aria-label": "저장 JSON 모달 닫기",
						onClick: C
					}, "닫기")]),
					H("div", Gx, [
						H("span", null, P(e.section.status), 1),
						e.layout.isDefault ? (B(), V("span", Kx, "기본")) : W("", !0),
						e.aiSelectable ? (B(), V("span", qx, "AI 선택 후보")) : W("", !0),
						H("small", null, "마지막 저장: " + P(e.layout.updatedAt || "기록 없음"), 1)
					]),
					H("nav", Jx, [(B(!0), V(z, null, R(kn(p), (e) => (B(), V("button", {
						key: e.key,
						type: "button",
						class: N({ active: a.value === e.key }),
						"aria-pressed": a.value === e.key,
						onClick: (t) => a.value = e.key
					}, P(e.label), 11, Yx))), 128))]),
					H("div", Xx, [
						H("label", null, [n[6] ||= H("span", { class: "sr-only" }, "JSON 경로 또는 값 검색", -1), L(H("input", {
							"onUpdate:modelValue": n[0] ||= (e) => o.value = e,
							type: "search",
							placeholder: "경로 또는 값 검색"
						}, null, 512), [[K, o.value]])]),
						v.value ? (B(), V("small", Zx, "일치하는 줄 " + P(y.value) + "개", 1)) : W("", !0),
						H("div", null, [
							H("button", {
								class: "tiny-button",
								type: "button",
								"aria-pressed": c.value === "tree",
								onClick: n[1] ||= (e) => c.value = "tree"
							}, "트리 보기", 8, Qx),
							H("button", {
								class: "tiny-button",
								type: "button",
								"aria-pressed": c.value === "code",
								onClick: n[2] ||= (e) => c.value = "code"
							}, "코드 보기", 8, $x),
							c.value === "tree" ? (B(), V("button", {
								key: 0,
								class: "tiny-button",
								type: "button",
								onClick: n[3] ||= (e) => l.value += 1
							}, "모두 펼치기")) : W("", !0),
							c.value === "tree" ? (B(), V("button", {
								key: 1,
								class: "tiny-button",
								type: "button",
								onClick: n[4] ||= (e) => u.value += 1
							}, "모두 접기")) : W("", !0),
							H("button", {
								class: "tiny-button",
								type: "button",
								onClick: E
							}, "JSON 복사"),
							H("button", {
								class: "tiny-button",
								type: "button",
								onClick: O
							}, "JSON 다운로드")
						])
					]),
					c.value === "tree" ? (B(), V("ul", eS, [Ls(Ux, {
						value: h.value,
						query: v.value,
						"expand-revision": l.value,
						"collapse-revision": u.value,
						onCopyPath: D
					}, null, 8, [
						"value",
						"query",
						"expand-revision",
						"collapse-revision"
					])])) : (B(), V("pre", tS, [H("code", null, [(B(!0), V(z, null, R(_.value, (e, t) => (B(), V("span", {
						key: t,
						class: N({ "is-match": v.value && e.toLocaleLowerCase().includes(v.value) })
					}, P(e) + P(t < _.value.length - 1 ? "\n" : ""), 3))), 128))])])),
					H("section", nS, [
						b.value.length ? (B(), V("strong", iS, "검증 결과: 오류 " + P(x.value.length) + "건 · 경고 " + P(S.value.length) + "건", 1)) : (B(), V("strong", rS, "검증 결과: 정상")),
						b.value.length ? (B(), V("ul", aS, [(B(!0), V(z, null, R(b.value, (e) => (B(), V("li", {
							key: `${e.code}:${e.path}`,
							class: N(`is-${e.level}`)
						}, [H("code", null, P(e.path), 1), H("span", null, P(e.code) + " · " + P(e.message), 1)], 2))), 128))])) : W("", !0),
						s.value ? (B(), V("small", oS, P(s.value), 1)) : W("", !0),
						a.value === "full" ? (B(), V("small", sS, "aiSelectable은 Section의 허용 Layout Key를 기준으로 계산한 표시용 값입니다.")) : W("", !0)
					])
				])], 544));
			}
		}, [["__scopeId", "data-v-99e83bdc"]]),
		SectionLayoutDomWorkbench: kx,
		SectionLayoutVisualEditorFrame: ay
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
				let t = await iy.list(this.section.id);
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
				let r = await iy.create({
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
					layoutSnapshot: ny(this.items)
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
					await iy.setDefault(e.id, this.section.id), await this.load();
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
					await iy.update(e.id, this.section.id, {
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
						await iy.remove(e.id, this.section.id), await this.load(), this.selectedLayoutId === e.id && (this.selectedLayoutId = "");
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
				await iy.updateAiLayoutVariants(this.section, [...r]), this.$emit("section-updated");
			} catch (e) {
				this.error = e.message;
			} finally {
				this.saving = !1;
			}
		}
	}
}, lS = { class: "section-layout-manager" }, uS = { class: "subsection-title" }, dS = { class: "action-row" }, fS = ["disabled"], pS = ["disabled"], mS = {
	key: 0,
	class: "empty-state compact"
}, hS = {
	key: 1,
	class: "field-error"
}, gS = {
	key: 2,
	class: "empty-state compact"
}, _S = {
	key: 3,
	class: "history-list"
}, vS = {
	key: 0,
	class: "status-active"
}, yS = {
	key: 1,
	class: "status-active"
}, bS = { class: "action-row align-right" }, xS = ["onClick"], SS = ["onClick"], CS = ["disabled", "onClick"], wS = ["disabled", "onClick"], TS = ["disabled", "onClick"], ES = {
	key: 0,
	class: "layout-selection-metadata"
}, DS = { class: "new-layout-preset-form" }, OS = ["onUpdate:modelValue"], kS = ["onUpdate:modelValue"], AS = ["onUpdate:modelValue"], jS = ["onUpdate:modelValue"], MS = ["onUpdate:modelValue"], NS = ["onUpdate:modelValue"], PS = ["onUpdate:modelValue"], FS = ["onUpdate:modelValue"], IS = ["onUpdate:modelValue"], LS = ["onUpdate:modelValue"], RS = ["onUpdate:modelValue"], zS = ["onUpdate:modelValue"], BS = ["onUpdate:modelValue"], VS = ["value", "onInput"], HS = ["onUpdate:modelValue"], US = { class: "inline-check" }, WS = ["onUpdate:modelValue"], GS = ["disabled", "onClick"], KS = {
	key: 0,
	class: "empty-state compact"
}, qS = { class: "inline-check" }, JS = { class: "inline-check" }, YS = ["disabled"], XS = { class: "inline-check" }, ZS = ["disabled"], QS = { class: "action-row" }, $S = ["disabled"], eC = {
	key: 7,
	class: "empty-state compact"
};
function tC(e, t, n, r, i, a) {
	let o = Ca("section-layout-dom-workbench"), s = Ca("section-layout-visual-editor-frame"), c = Ca("json-snapshot-dialog");
	return B(), V("section", lS, [
		H("div", uS, [t[27] ||= H("div", null, [H("h3", null, "레이아웃 프리셋"), H("small", null, "DOM 구성과 하나의 Live Preview에서 Desktop/Mobile 배치를 확인하고 저장합니다.")], -1), H("div", dS, [H("button", {
			class: "tiny-button",
			type: "button",
			disabled: i.loading,
			onClick: t[0] ||= (...e) => a.load && a.load(...e)
		}, "새로고침", 8, fS), H("button", {
			class: "tiny-button primary",
			type: "button",
			disabled: !a.editable || i.saving,
			onClick: t[1] ||= (...e) => a.startNewPreset && a.startNewPreset(...e)
		}, "+ 레이아웃 프리셋 추가", 8, pS)])]),
		a.editable ? W("", !0) : (B(), V("div", mS, "활성·비활성 버전의 레이아웃 프리셋은 읽기 전용입니다. 초안을 만든 후 편집하세요.")),
		i.error ? (B(), V("div", hS, P(i.error), 1)) : W("", !0),
		i.loading ? (B(), V("div", gS, "레이아웃 프리셋을 불러오는 중...")) : (B(), V("div", _S, [(B(!0), V(z, null, R(i.layouts, (e) => (B(), V("div", {
			key: e.id,
			class: "history-item section-layout-row"
		}, [
			H("div", null, [H("strong", null, [
				U(P(e.name) + " ", 1),
				e.isDefault ? (B(), V("em", vS, "기본")) : W("", !0),
				a.aiAllows(e) ? (B(), V("em", yS, "AI 선택 후보")) : W("", !0)
			]), H("span", null, P(e.layoutKey) + " · " + P(e.description || "설명 없음"), 1)]),
			H("div", bS, [
				H("button", {
					class: "tiny-button",
					type: "button",
					onClick: (t) => a.selectLayout(e)
				}, P(a.editable ? "DOM 구성 편집" : "DOM 구성 보기"), 9, xS),
				H("button", {
					class: "tiny-button",
					type: "button",
					"aria-haspopup": "dialog",
					onClick: (t) => a.showStoredJson(e)
				}, "저장 JSON", 8, SS),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: !a.editable || i.saving || e.isDefault,
					onClick: (t) => a.setDefault(e)
				}, "기본 지정", 8, CS),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: !a.editable || i.saving,
					onClick: (t) => a.toggleAiLayout(e)
				}, P(a.aiAllows(e) ? "AI 후보 해제" : "AI 선택 후보로 지정"), 9, wS),
				H("button", {
					class: "tiny-button danger",
					type: "button",
					disabled: !a.editable || i.saving || a.aiAllows(e),
					onClick: (t) => a.remove(e)
				}, "삭제", 8, TS)
			]),
			a.editable ? (B(), V("details", ES, [t[57] ||= H("summary", null, "AI 선택 기준", -1), H("div", DS, [
				H("label", null, [t[29] ||= H("span", null, "콘텐츠 정렬", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.alignment = t }, [...t[28] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"stretch\" data-v-5d03fa39>전체 폭</option>", 5)]], 8, OS), [[q, e.selectionMetadata.alignment]])]),
				H("label", null, [t[31] ||= H("span", null, "콘텐츠 영역", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.contentRegion = t }, [...t[30] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"top-left\" data-v-5d03fa39>왼쪽 상단</option><option value=\"top-center\" data-v-5d03fa39>중앙 상단</option><option value=\"top-right\" data-v-5d03fa39>오른쪽 상단</option><option value=\"center-left\" data-v-5d03fa39>왼쪽 중앙</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"center-right\" data-v-5d03fa39>오른쪽 중앙</option><option value=\"bottom-left\" data-v-5d03fa39>왼쪽 하단</option><option value=\"bottom-center\" data-v-5d03fa39>중앙 하단</option><option value=\"bottom-right\" data-v-5d03fa39>오른쪽 하단</option>", 10)]], 8, kS), [[q, e.selectionMetadata.contentRegion]])]),
				H("label", null, [t[33] ||= H("span", null, "비주얼 균형", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.visualBalance = t }, [...t[32] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"media-left\" data-v-5d03fa39>이미지 왼쪽</option><option value=\"media-center\" data-v-5d03fa39>이미지 중앙</option><option value=\"media-right\" data-v-5d03fa39>이미지 오른쪽</option><option value=\"full-background\" data-v-5d03fa39>전체 배경</option>", 5)]], 8, AS), [[q, e.selectionMetadata.visualBalance]])]),
				H("label", null, [t[35] ||= H("span", null, "밀도", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.density = t }, [...t[34] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "compact" }, "간결", -1),
					H("option", { value: "standard" }, "기본", -1),
					H("option", { value: "spacious" }, "여유", -1)
				]], 8, jS), [[q, e.selectionMetadata.density]])]),
				H("label", null, [t[37] ||= H("span", null, "텍스트 폭", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.widthProfile = t }, [...t[36] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"compact\" data-v-5d03fa39>좁게</option><option value=\"balanced\" data-v-5d03fa39>균형</option><option value=\"wide\" data-v-5d03fa39>넓게</option><option value=\"full\" data-v-5d03fa39>전체 폭</option>", 5)]], 8, MS), [[q, e.selectionMetadata.widthProfile]])]),
				H("label", null, [t[39] ||= H("span", null, "구성 유형", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.archetype = t }, [...t[38] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"minimal\" data-v-5d03fa39>미니멀</option><option value=\"editorial-split\" data-v-5d03fa39>에디토리얼 분할</option><option value=\"media-led\" data-v-5d03fa39>미디어 중심</option><option value=\"full-bleed\" data-v-5d03fa39>풀 블리드</option><option value=\"overlap\" data-v-5d03fa39>오버랩</option><option value=\"card-grid\" data-v-5d03fa39>카드 그리드</option><option value=\"feature-list\" data-v-5d03fa39>기능 목록</option><option value=\"comparison\" data-v-5d03fa39>비교</option><option value=\"cta-focused\" data-v-5d03fa39>CTA 중심</option>", 10)]], 8, NS), [[q, e.selectionMetadata.archetype]])]),
				H("label", null, [t[41] ||= H("span", null, "제목 수용량", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.headlineCapacity = t }, [...t[40] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "short" }, "짧음", -1),
					H("option", { value: "medium" }, "보통", -1),
					H("option", { value: "long" }, "김", -1)
				]], 8, PS), [[q, e.selectionMetadata.headlineCapacity]])]),
				H("label", null, [t[43] ||= H("span", null, "본문 수용량", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.bodyCapacity = t }, [...t[42] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "short" }, "짧음", -1),
					H("option", { value: "medium" }, "보통", -1),
					H("option", { value: "long" }, "김", -1)
				]], 8, FS), [[q, e.selectionMetadata.bodyCapacity]])]),
				H("label", null, [t[45] ||= H("span", null, "비주얼 강조", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.visualEmphasis = t }, [...t[44] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "copy-led" }, "카피 중심", -1),
					H("option", { value: "balanced" }, "균형", -1),
					H("option", { value: "media-led" }, "미디어 중심", -1)
				]], 8, IS), [[q, e.selectionMetadata.visualEmphasis]])]),
				H("label", null, [t[47] ||= H("span", null, "미디어 안전영역", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.mediaSafeSide = t }, [...t[46] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"either\" data-v-5d03fa39>양쪽</option><option value=\"none\" data-v-5d03fa39>없음</option>", 6)]], 8, LS), [[q, e.selectionMetadata.mediaSafeSide]])]),
				H("label", null, [t[49] ||= H("span", null, "모바일 전략", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.mobileStrategy = t }, [...t[48] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"preserve\" data-v-5d03fa39>구성 유지</option><option value=\"copy-first\" data-v-5d03fa39>카피 우선</option><option value=\"media-first\" data-v-5d03fa39>미디어 우선</option><option value=\"media-after-copy\" data-v-5d03fa39>카피 다음 미디어</option><option value=\"stack\" data-v-5d03fa39>순차 적층</option><option value=\"hide-supporting-media\" data-v-5d03fa39>보조 미디어 숨김</option>", 7)]], 8, RS), [[q, e.selectionMetadata.mobileStrategy]])]),
				H("label", null, [t[51] ||= H("span", null, "CTA 강조", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.ctaProminence = t }, [...t[50] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "low" }, "낮음", -1),
					H("option", { value: "medium" }, "보통", -1),
					H("option", { value: "high" }, "높음", -1)
				]], 8, zS), [[q, e.selectionMetadata.ctaProminence]])]),
				H("label", null, [t[53] ||= H("span", null, "콘텐츠 복잡도", -1), L(H("select", { "onUpdate:modelValue": (t) => e.selectionMetadata.contentComplexity = t }, [...t[52] ||= [
					H("option", { value: "auto" }, "자동", -1),
					H("option", { value: "low" }, "낮음", -1),
					H("option", { value: "medium" }, "보통", -1),
					H("option", { value: "high" }, "높음", -1)
				]], 8, BS), [[q, e.selectionMetadata.contentComplexity]])]),
				H("label", null, [t[54] ||= H("span", null, "권장 용도", -1), H("input", {
					value: (e.selectionMetadata.purposeTags || []).join(", "),
					onInput: (t) => e.selectionMetadata.purposeTags = t.target.value.split(",").map((e) => e.trim()).filter(Boolean),
					placeholder: "event, brand-intro"
				}, null, 40, VS)]),
				H("label", null, [t[55] ||= H("span", null, "선택 가중치", -1), L(H("input", {
					"onUpdate:modelValue": (t) => e.selectionMetadata.selectionWeight = t,
					type: "number",
					min: "0.1",
					max: "10",
					step: "0.1"
				}, null, 8, HS), [[
					K,
					e.selectionMetadata.selectionWeight,
					void 0,
					{ number: !0 }
				]])]),
				H("label", US, [L(H("input", {
					"onUpdate:modelValue": (t) => e.selectionMetadata.avoidImmediateRepeat = t,
					type: "checkbox"
				}, null, 8, WS), [[su, e.selectionMetadata.avoidImmediateRepeat]]), t[56] ||= H("span", null, "연속 선택 지양", -1)]),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: i.saving,
					onClick: (t) => a.saveSelectionMetadata(e)
				}, "선택 기준 저장", 8, GS)
			])])) : W("", !0)
		]))), 128)), i.layouts.length ? W("", !0) : (B(), V("div", KS, "등록된 레이아웃 프리셋이 없습니다. 기존 자동 배치가 계속 사용됩니다."))])),
		i.newPresetEditor ? (B(), V("form", {
			key: 4,
			class: "new-layout-preset-form",
			onSubmit: t[23] ||= yu((...e) => a.createPreset && a.createPreset(...e), ["prevent"])
		}, [
			H("label", null, [t[58] ||= H("span", null, "프리셋 이름", -1), L(H("input", {
				"onUpdate:modelValue": t[2] ||= (e) => i.newPresetEditor.name = e,
				required: ""
			}, null, 512), [[K, i.newPresetEditor.name]])]),
			H("label", null, [t[59] ||= H("span", null, "설명", -1), L(H("input", { "onUpdate:modelValue": t[3] ||= (e) => i.newPresetEditor.description = e }, null, 512), [[K, i.newPresetEditor.description]])]),
			H("label", null, [t[61] ||= H("span", null, "콘텐츠 정렬", -1), L(H("select", { "onUpdate:modelValue": t[4] ||= (e) => i.newPresetEditor.selectionMetadata.alignment = e }, [...t[60] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"stretch\" data-v-5d03fa39>전체 폭</option>", 5)]], 512), [[q, i.newPresetEditor.selectionMetadata.alignment]])]),
			H("label", null, [t[63] ||= H("span", null, "콘텐츠 영역", -1), L(H("select", { "onUpdate:modelValue": t[5] ||= (e) => i.newPresetEditor.selectionMetadata.contentRegion = e }, [...t[62] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"top-left\" data-v-5d03fa39>왼쪽 상단</option><option value=\"top-center\" data-v-5d03fa39>중앙 상단</option><option value=\"top-right\" data-v-5d03fa39>오른쪽 상단</option><option value=\"center-left\" data-v-5d03fa39>왼쪽 중앙</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"center-right\" data-v-5d03fa39>오른쪽 중앙</option><option value=\"bottom-left\" data-v-5d03fa39>왼쪽 하단</option><option value=\"bottom-center\" data-v-5d03fa39>중앙 하단</option><option value=\"bottom-right\" data-v-5d03fa39>오른쪽 하단</option>", 10)]], 512), [[q, i.newPresetEditor.selectionMetadata.contentRegion]])]),
			H("label", null, [t[65] ||= H("span", null, "비주얼 균형", -1), L(H("select", { "onUpdate:modelValue": t[6] ||= (e) => i.newPresetEditor.selectionMetadata.visualBalance = e }, [...t[64] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"media-left\" data-v-5d03fa39>이미지 왼쪽</option><option value=\"media-center\" data-v-5d03fa39>이미지 중앙</option><option value=\"media-right\" data-v-5d03fa39>이미지 오른쪽</option><option value=\"full-background\" data-v-5d03fa39>전체 배경</option>", 5)]], 512), [[q, i.newPresetEditor.selectionMetadata.visualBalance]])]),
			H("label", null, [t[67] ||= H("span", null, "밀도", -1), L(H("select", { "onUpdate:modelValue": t[7] ||= (e) => i.newPresetEditor.selectionMetadata.density = e }, [...t[66] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "compact" }, "간결", -1),
				H("option", { value: "standard" }, "기본", -1),
				H("option", { value: "spacious" }, "여유", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.density]])]),
			H("label", null, [t[69] ||= H("span", null, "텍스트 폭", -1), L(H("select", { "onUpdate:modelValue": t[8] ||= (e) => i.newPresetEditor.selectionMetadata.widthProfile = e }, [...t[68] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"compact\" data-v-5d03fa39>좁게</option><option value=\"balanced\" data-v-5d03fa39>균형</option><option value=\"wide\" data-v-5d03fa39>넓게</option><option value=\"full\" data-v-5d03fa39>전체 폭</option>", 5)]], 512), [[q, i.newPresetEditor.selectionMetadata.widthProfile]])]),
			H("label", null, [t[71] ||= H("span", null, "구성 유형", -1), L(H("select", { "onUpdate:modelValue": t[9] ||= (e) => i.newPresetEditor.selectionMetadata.archetype = e }, [...t[70] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"minimal\" data-v-5d03fa39>미니멀</option><option value=\"editorial-split\" data-v-5d03fa39>에디토리얼 분할</option><option value=\"media-led\" data-v-5d03fa39>미디어 중심</option><option value=\"full-bleed\" data-v-5d03fa39>풀 블리드</option><option value=\"overlap\" data-v-5d03fa39>오버랩</option><option value=\"card-grid\" data-v-5d03fa39>카드 그리드</option><option value=\"feature-list\" data-v-5d03fa39>기능 목록</option><option value=\"comparison\" data-v-5d03fa39>비교</option><option value=\"cta-focused\" data-v-5d03fa39>CTA 중심</option>", 10)]], 512), [[q, i.newPresetEditor.selectionMetadata.archetype]])]),
			H("label", null, [t[73] ||= H("span", null, "제목 수용량", -1), L(H("select", { "onUpdate:modelValue": t[10] ||= (e) => i.newPresetEditor.selectionMetadata.headlineCapacity = e }, [...t[72] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "short" }, "짧음", -1),
				H("option", { value: "medium" }, "보통", -1),
				H("option", { value: "long" }, "김", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.headlineCapacity]])]),
			H("label", null, [t[75] ||= H("span", null, "본문 수용량", -1), L(H("select", { "onUpdate:modelValue": t[11] ||= (e) => i.newPresetEditor.selectionMetadata.bodyCapacity = e }, [...t[74] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "short" }, "짧음", -1),
				H("option", { value: "medium" }, "보통", -1),
				H("option", { value: "long" }, "김", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.bodyCapacity]])]),
			H("label", null, [t[77] ||= H("span", null, "비주얼 강조", -1), L(H("select", { "onUpdate:modelValue": t[12] ||= (e) => i.newPresetEditor.selectionMetadata.visualEmphasis = e }, [...t[76] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "copy-led" }, "카피 중심", -1),
				H("option", { value: "balanced" }, "균형", -1),
				H("option", { value: "media-led" }, "미디어 중심", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.visualEmphasis]])]),
			H("label", null, [t[79] ||= H("span", null, "미디어 안전영역", -1), L(H("select", { "onUpdate:modelValue": t[13] ||= (e) => i.newPresetEditor.selectionMetadata.mediaSafeSide = e }, [...t[78] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"left\" data-v-5d03fa39>왼쪽</option><option value=\"center\" data-v-5d03fa39>중앙</option><option value=\"right\" data-v-5d03fa39>오른쪽</option><option value=\"either\" data-v-5d03fa39>양쪽</option><option value=\"none\" data-v-5d03fa39>없음</option>", 6)]], 512), [[q, i.newPresetEditor.selectionMetadata.mediaSafeSide]])]),
			H("label", null, [t[81] ||= H("span", null, "모바일 전략", -1), L(H("select", { "onUpdate:modelValue": t[14] ||= (e) => i.newPresetEditor.selectionMetadata.mobileStrategy = e }, [...t[80] ||= [Vs("<option value=\"auto\" data-v-5d03fa39>자동</option><option value=\"preserve\" data-v-5d03fa39>구성 유지</option><option value=\"copy-first\" data-v-5d03fa39>카피 우선</option><option value=\"media-first\" data-v-5d03fa39>미디어 우선</option><option value=\"media-after-copy\" data-v-5d03fa39>카피 다음 미디어</option><option value=\"stack\" data-v-5d03fa39>순차 적층</option><option value=\"hide-supporting-media\" data-v-5d03fa39>보조 미디어 숨김</option>", 7)]], 512), [[q, i.newPresetEditor.selectionMetadata.mobileStrategy]])]),
			H("label", null, [t[83] ||= H("span", null, "CTA 강조", -1), L(H("select", { "onUpdate:modelValue": t[15] ||= (e) => i.newPresetEditor.selectionMetadata.ctaProminence = e }, [...t[82] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "low" }, "낮음", -1),
				H("option", { value: "medium" }, "보통", -1),
				H("option", { value: "high" }, "높음", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.ctaProminence]])]),
			H("label", null, [t[85] ||= H("span", null, "콘텐츠 복잡도", -1), L(H("select", { "onUpdate:modelValue": t[16] ||= (e) => i.newPresetEditor.selectionMetadata.contentComplexity = e }, [...t[84] ||= [
				H("option", { value: "auto" }, "자동", -1),
				H("option", { value: "low" }, "낮음", -1),
				H("option", { value: "medium" }, "보통", -1),
				H("option", { value: "high" }, "높음", -1)
			]], 512), [[q, i.newPresetEditor.selectionMetadata.contentComplexity]])]),
			H("label", null, [t[86] ||= H("span", null, "권장 용도", -1), L(H("input", {
				"onUpdate:modelValue": t[17] ||= (e) => i.newPresetEditor.selectionMetadata.purposeTagsText = e,
				placeholder: "event, brand-intro"
			}, null, 512), [[K, i.newPresetEditor.selectionMetadata.purposeTagsText]])]),
			H("label", null, [t[87] ||= H("span", null, "선택 가중치", -1), L(H("input", {
				"onUpdate:modelValue": t[18] ||= (e) => i.newPresetEditor.selectionMetadata.selectionWeight = e,
				type: "number",
				min: "0.1",
				max: "10",
				step: "0.1"
			}, null, 512), [[
				K,
				i.newPresetEditor.selectionMetadata.selectionWeight,
				void 0,
				{ number: !0 }
			]])]),
			H("label", qS, [L(H("input", {
				"onUpdate:modelValue": t[19] ||= (e) => i.newPresetEditor.selectionMetadata.avoidImmediateRepeat = e,
				type: "checkbox"
			}, null, 512), [[su, i.newPresetEditor.selectionMetadata.avoidImmediateRepeat]]), t[88] ||= H("span", null, "연속 선택 지양", -1)]),
			H("label", JS, [L(H("input", {
				"onUpdate:modelValue": t[20] ||= (e) => i.newPresetEditor.isDefault = e,
				type: "checkbox",
				disabled: !i.layouts.length
			}, null, 8, YS), [[su, i.newPresetEditor.isDefault]]), t[89] ||= H("span", null, "기본 프리셋", -1)]),
			H("label", XS, [L(H("input", {
				"onUpdate:modelValue": t[21] ||= (e) => i.newPresetEditor.allowAi = e,
				type: "checkbox",
				disabled: n.section.aiDesign?.enabled === !1
			}, null, 8, ZS), [[su, i.newPresetEditor.allowAi]]), t[90] ||= H("span", null, "AI 선택 후보", -1)]),
			H("div", QS, [H("button", {
				class: "tiny-button",
				type: "button",
				onClick: t[22] ||= (e) => i.newPresetEditor = null
			}, "취소"), H("button", {
				class: "tiny-button primary",
				type: "submit",
				disabled: i.saving
			}, P(i.saving ? "생성 중…" : "프리셋 만들고 DOM 구성 열기"), 9, $S)])
		], 32)) : W("", !0),
		a.selectedLayout && n.domWorkbenchEnabled ? (B(), js(o, {
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
		])) : a.selectedLayout && n.legacyVisualEditorEnabled ? (B(), js(s, {
			key: 6,
			section: n.section,
			layout: a.selectedLayout,
			onSaved: a.handleVisualEditorSaved,
			onClose: t[25] ||= (e) => i.selectedLayoutId = ""
		}, null, 8, [
			"section",
			"layout",
			"onSaved"
		])) : a.selectedLayout ? (B(), V("div", eC, " 관리자 DOM 구성 Workbench가 비활성화되어 있습니다. 기능 설정을 확인해 주세요. ")) : W("", !0),
		a.jsonLayout ? (B(), js(c, {
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
		])) : W("", !0)
	]);
}
var nC = /*#__PURE__*/ jh(cS, [["render", tC], ["__scopeId", "data-v-5d03fa39"]]), rC = {
	key: 0,
	class: "render-spec-node-inspector",
	"aria-label": "선택 노드 속성"
}, iC = ["value", "disabled"], aC = ["value", "disabled"], oC = { key: 0 }, sC = ["value", "disabled"], cC = ["value"], lC = { key: 1 }, uC = ["value", "disabled"], dC = ["value", "disabled"], fC = ["value", "disabled"], pC = ["value", "disabled"], mC = ["value", "disabled"], hC = { id: "render-spec-token-keys" }, gC = ["value"], _C = /*#__PURE__*/ jh({
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
		return (t, a) => e.selected ? (B(), V("section", rC, [
			H("label", null, [a[9] ||= U(" 노드 유형 ", -1), H("select", {
				value: e.selected.node.nodeType,
				disabled: e.disabled || e.selected.path === e.rootPath,
				onChange: a[0] ||= (e) => r("nodeType", e.target.value)
			}, [...a[8] ||= [H("option", { value: "element" }, "그룹", -1), H("option", { value: "field" }, "필드", -1)]], 40, iC)]),
			H("label", null, [a[10] ||= U(" 태그 ", -1), H("select", {
				value: e.selected.node.tag,
				disabled: e.disabled,
				onChange: a[1] ||= (e) => r("tag", e.target.value)
			}, [(B(), V(z, null, R([
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
			], (e) => H("option", { key: e }, P(e), 1)), 64))], 40, aC)]),
			e.selected.node.nodeType === "field" ? (B(), V("label", oC, [a[11] ||= U(" 연결 필드 ", -1), H("select", {
				value: e.selected.node.fieldKey,
				disabled: e.disabled,
				onChange: a[2] ||= (e) => n("set-field-key", e.target.value)
			}, [(B(!0), V(z, null, R(e.fields, (e) => (B(), V("option", {
				key: e.fieldKey,
				value: e.fieldKey
			}, P(e.name) + " · " + P(e.fieldKey), 9, cC))), 128))], 40, sC)])) : (B(), V("label", lC, [a[12] ||= U(" 의미 역할 ", -1), H("input", {
				value: e.selected.node.semanticRole || "",
				disabled: e.disabled,
				onInput: a[3] ||= (e) => r("semanticRole", e.target.value)
			}, null, 40, uC)])),
			H("label", null, [a[14] ||= U(" 배치 ", -1), H("select", {
				value: e.selected.node.layout?.display || "",
				disabled: e.disabled,
				onChange: a[4] ||= (e) => i("layout", "display", e.target.value)
			}, [...a[13] ||= [
				H("option", { value: "" }, "기본", -1),
				H("option", { value: "block" }, "Block", -1),
				H("option", { value: "flex" }, "Flex", -1),
				H("option", { value: "grid" }, "Grid", -1)
			]], 40, dC)]),
			H("label", null, [a[15] ||= U(" 열 수 ", -1), H("input", {
				type: "number",
				min: "1",
				max: "12",
				value: e.selected.node.layout?.columns || "",
				disabled: e.disabled,
				onInput: a[5] ||= (e) => i("layout", "columns", Number(e.target.value) || "")
			}, null, 40, fC)]),
			H("label", null, [a[16] ||= U(" 글자색 토큰 ", -1), H("input", {
				list: "render-spec-token-keys",
				value: e.selected.node.tokenBindings?.color || "",
				disabled: e.disabled,
				onChange: a[6] ||= (e) => i("tokenBindings", "color", e.target.value)
			}, null, 40, pC)]),
			H("label", null, [a[17] ||= U(" 배경색 토큰 ", -1), H("input", {
				list: "render-spec-token-keys",
				value: e.selected.node.tokenBindings?.backgroundColor || "",
				disabled: e.disabled,
				onChange: a[7] ||= (e) => i("tokenBindings", "backgroundColor", e.target.value)
			}, null, 40, mC)]),
			H("datalist", hC, [(B(!0), V(z, null, R(e.tokenKeys, (e) => (B(), V("option", {
				key: e,
				value: e
			}, null, 8, gC))), 128))])
		])) : W("", !0);
	}
}, [["__scopeId", "data-v-585b6a8f"]]), vC = { class: "rs-editor" }, yC = { class: "rs-toolbar" }, bC = ["disabled"], xC = ["disabled"], SC = ["disabled"], CC = ["disabled"], wC = ["disabled"], TC = ["disabled"], EC = ["disabled"], DC = {
	key: 0,
	class: "rs-empty"
}, OC = {
	key: 1,
	class: "rs-grid"
}, kC = { key: 0 }, AC = {
	key: 3,
	class: "rs-debug"
}, jC = ["disabled"], MC = { key: 0 }, NC = ["disabled"], PC = /*#__PURE__*/ jh({
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
		let n = e, r = t, i = /* @__PURE__ */ I("root"), a = /* @__PURE__ */ I("desktop"), o = /* @__PURE__ */ I(null), s = /* @__PURE__ */ I(!1), c = /* @__PURE__ */ I(""), l = /* @__PURE__ */ I(""), u = /* @__PURE__ */ I([]), d = G(() => n.modelValue || null), f = G(() => {
			let e = [], t = (n, r, i) => {
				n && (e.push({
					node: n,
					path: r,
					depth: i,
					label: n.fieldKey || n.semanticRole || n.tag
				}), (n.children || []).forEach((e, n) => t(e, `${r}.children.${n}`, i + 1)));
			};
			return t(d.value?.root, "root", 0), e;
		}), p = G(() => f.value.find((e) => e.path === i.value) || f.value[0] || null), m = G(() => ({ fields: Object.fromEntries(n.fields.map((e) => e.fieldKind === "image" ? [e.fieldKey, {
			value: n.sourceImageUrl,
			alt: e.name || "미리보기 이미지"
		}] : e.fieldKind === "cta" ? [e.fieldKey, {
			label: e.defaultValue || e.name || "자세히 보기",
			link: "#"
		}] : [e.fieldKey, e.defaultValue || (e.textType === "title" ? "프로모션 제목 미리보기" : `${e.name || "텍스트"} 내용 미리보기`)])) }));
		Hr(() => n.modelValue, (e) => {
			c.value = e ? JSON.stringify(e, null, 2) : "";
		}, {
			immediate: !0,
			deep: !0
		});
		function h(e) {
			return JSON.parse(JSON.stringify(e));
		}
		function g(e) {
			return e.fieldKind === "image" ? "img" : e.fieldKind === "cta" ? "a" : e.textType === "title" ? "h2" : "p";
		}
		function _() {
			!n.fields.length || n.fields.some((e) => !e.fieldKey) || (v({
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
						tag: g(e),
						fieldKey: e.fieldKey
					}))
				},
				responsive: { mobile: { "root.layout.columns": 1 } },
				accessibility: {}
			}), i.value = "root");
		}
		function v(e) {
			r("update:modelValue", e), o.value = null;
		}
		function y(e) {
			let t = h(d.value);
			e(t), v(t);
		}
		function b(e, t) {
			return t.split(".children.").slice(1).reduce((e, t) => e?.children?.[Number(t)], e);
		}
		function x(e) {
			y((t) => e(b(t.root, i.value)));
		}
		function S(e) {
			if (!p.value) return;
			let t = n.fields.find((e) => e.fieldKey) || null;
			x((n) => {
				n.children ||= [], n.children.push(e === "field" && t ? {
					nodeType: "field",
					tag: g(t),
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
			y((e) => b(e.root, n).children.splice(t, 1)), i.value = n;
		}
		function w(e) {
			if (i.value === "root") return;
			let t = i.value.split(".children."), n = Number(t.pop()), r = t.join(".children.");
			y((t) => {
				let i = b(t.root, r).children, a = n + e;
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
			x((n) => {
				n.fieldKey = e, n.tag = g(t);
			});
		}
		function O(e, t, n) {
			x((r) => {
				r[e] ||= {}, n === "" || n == null ? delete r[e][t] : r[e][t] = n;
			});
		}
		function k({ property: e, value: t }) {
			x((n) => {
				n[e] = t;
			});
		}
		function A({ group: e, property: t, value: n }) {
			O(e, t, n);
		}
		async function ee() {
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
		function te() {
			try {
				v(JSON.parse(c.value)), l.value = "";
			} catch (e) {
				l.value = e.message;
			}
		}
		return fa(async () => {
			try {
				let e = await fetch("/api/design-token-sets?scope=public").then((e) => e.json());
				u.value = [...new Set((e.tokenSets || []).flatMap((e) => Object.keys(e.values || {})))].sort();
			} catch {}
		}), (t, n) => (B(), V("section", vC, [
			H("div", yC, [n[7] ||= H("strong", null, "DOM RenderSpec", -1), d.value ? (B(), V(z, { key: 1 }, [
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || p.value?.node?.tag === "img",
					onClick: n[0] ||= (e) => S("element")
				}, "+ 그룹", 8, xC),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || !e.fields.length || p.value?.node?.tag === "img",
					onClick: n[1] ||= (e) => S("field")
				}, "+ 필드", 8, SC),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: n[2] ||= (e) => w(-1)
				}, "위", 8, CC),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: n[3] ||= (e) => w(1)
				}, "아래", 8, wC),
				H("button", {
					class: "tiny-button danger",
					type: "button",
					disabled: e.disabled || i.value === "root",
					onClick: C
				}, "삭제", 8, TC),
				H("button", {
					class: "tiny-button primary",
					type: "button",
					disabled: s.value,
					onClick: ee
				}, P(s.value ? "검증 중" : "검증"), 9, EC)
			], 64)) : (B(), V("button", {
				key: 0,
				class: "tiny-button primary",
				type: "button",
				disabled: e.disabled || e.fields.some((e) => !e.fieldKey),
				onClick: _
			}, "기본 DOM 생성", 8, bC))]),
			d.value ? (B(), V("div", OC, [
				Ls(sx, {
					nodes: f.value,
					"selected-path": i.value,
					onSelect: n[4] ||= (e) => i.value = e
				}, null, 8, ["nodes", "selected-path"]),
				Ls(_C, {
					selected: p.value,
					fields: e.fields,
					"token-keys": u.value,
					disabled: e.disabled,
					onSetNodeProperty: k,
					onSetFieldKey: D,
					onSetNested: A
				}, null, 8, [
					"selected",
					"fields",
					"token-keys",
					"disabled"
				]),
				Ls(fx, {
					modelValue: a.value,
					"onUpdate:modelValue": n[5] ||= (e) => a.value = e,
					mode: "component",
					"selected-node-key": i.value,
					title: "Component Live Preview",
					onSelectNode: E
				}, {
					default: Mr(({ viewport: t }) => [Ls(Zy, {
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
			])) : (B(), V("p", DC, "서버가 생성한 필드 키가 있는 초안에서 DOM 구조를 만들 수 있습니다.")),
			o.value ? (B(), V("div", {
				key: 2,
				class: N(["rs-validation", { ok: o.value.ok }])
			}, [H("strong", null, P(o.value.ok ? "검증 통과" : `오류 ${o.value.errors?.length || 0}건`), 1), o.value.ok ? W("", !0) : (B(), V("ul", kC, [(B(!0), V(z, null, R(o.value.errors, (e) => (B(), V("li", { key: `${e.path}:${e.code}` }, P(e.path) + " · " + P(e.message), 1))), 128))]))], 2)) : W("", !0),
			d.value ? (B(), V("details", AC, [
				n[8] ||= H("summary", null, "고급: Raw JSON", -1),
				L(H("textarea", {
					"onUpdate:modelValue": n[6] ||= (e) => c.value = e,
					rows: "14",
					disabled: e.disabled
				}, null, 8, jC), [[K, c.value]]),
				l.value ? (B(), V("p", MC, P(l.value), 1)) : W("", !0),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.disabled,
					onClick: te
				}, "JSON 적용", 8, NC)
			])) : W("", !0)
		]));
	}
}, [["__scopeId", "data-v-0ea819a6"]]), FC = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp"
]), IC = 10 * 1024 * 1024, LC = "promo-component-generation-active-run", RC = {
	name: "ComponentGenerationWorkspace",
	components: { RenderSpecEditor: PC },
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
		let e = localStorage.getItem(LC);
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
				if (!FC.has(t.type)) return this.rejectSource("PNG, JPEG 또는 WebP 이미지를 선택해 주세요.");
				if (t.size > IC) return this.rejectSource("이미지 크기는 10MB 이하여야 합니다.");
				this.releaseUrl(), this.file = t, this.sourceUrl = URL.createObjectURL(t), this.sourceName = t.name, this.sourceSize = t.size, this.imageDataUrl = await this.readDataUrl(t), this.sourceDimensions = await this.readDimensions(this.sourceUrl), this.sourceId = "", this.sourceImageUrl = "", this.run = null, this.proposals = [], this.proposal = null, this.selectedProposalId = "", this.crop = {
					x: 0,
					y: 0,
					width: 1,
					height: 1
				}, localStorage.removeItem(LC), this.$emit("notify", "분석할 이미지를 선택했습니다. 영역을 조정해 주세요.");
			}
		},
		rejectSource(e) {
			this.clearSource(), this.sourceError = e;
		},
		clearSource() {
			this.releaseUrl(), this.file = null, this.imageDataUrl = "", this.sourceName = "", this.sourceSize = 0, this.sourceDimensions = null, this.sourceId = "", this.sourceImageUrl = "", this.run = null, this.proposals = [], this.proposal = null, this.selectedProposalId = "", this.$refs.sourceInput && (this.$refs.sourceInput.value = ""), localStorage.removeItem(LC);
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
					if (!t.ok) throw n.runId && (localStorage.setItem(LC, n.runId), await this.restoreRun(n.runId)), Error(n.message || n.error || `이미지 분석 오류(${t.status})`);
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
			this.proposal = t, this.selectedProposalId = t?.id || "", e?.id && localStorage.setItem(LC, e.id), e?.source?.imageUrl && (this.sourceImageUrl = e.source.imageUrl, this.sourceUrl ||= e.source.imageUrl), e?.componentIntent && (this.componentIntent = e.componentIntent), e?.allowedSectionRoles && (this.selectedRoles = e.allowedSectionRoles), e?.source?.cropSpec && (this.crop = e.source.cropSpec), [
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
				localStorage.removeItem(LC);
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
}, zC = {
	class: "generation",
	"aria-labelledby": "generation-title"
}, BC = { class: "generation-header" }, VC = { class: "steps" }, HC = {
	key: 0,
	class: "work-grid"
}, UC = { class: "card" }, WC = { class: "card-title" }, GC = {
	key: 0,
	class: "dropzone"
}, KC = {
	key: 1,
	class: "crop-stage"
}, qC = ["src"], JC = {
	key: 2,
	class: "file-info"
}, YC = {
	key: 3,
	class: "error"
}, XC = {
	key: 4,
	class: "crop-controls"
}, ZC = ["onUpdate:modelValue"], QC = { class: "field" }, $C = { class: "roles" }, ew = ["value"], tw = {
	key: 5,
	class: "field"
}, nw = ["value"], rw = { class: "card readiness" }, iw = { class: "checklist" }, aw = {
	key: 0,
	class: "error"
}, ow = ["disabled"], sw = { key: 1 }, cw = { key: 2 }, lw = {
	key: 1,
	class: "result-stack"
}, uw = { class: "card candidate-panel" }, dw = { class: "card-title" }, fw = { class: "candidate-list" }, pw = ["onUpdate:modelValue", "disabled"], mw = ["onClick"], hw = { class: "card" }, gw = { class: "card-title" }, _w = { class: "confidence" }, vw = { class: "badges" }, yw = { key: 0 }, bw = { class: "field" }, xw = { class: "field" }, Sw = { class: "comparison" }, Cw = { class: "card" }, ww = { class: "crop-stage" }, Tw = ["src"], Ew = ["onClick"], Dw = { class: "card" }, Ow = {
	key: 0,
	class: "file-info"
}, kw = {
	key: 1,
	class: "validation-errors"
}, Aw = {
	key: 2,
	class: "empty"
}, jw = { class: "comparison" }, Mw = { class: "card" }, Nw = { class: "field-list" }, Pw = { class: "card" }, Fw = {
	key: 0,
	class: "field-list"
}, Iw = {
	key: 1,
	class: "empty"
}, Lw = { class: "roles" }, Rw = { key: 0 }, zw = {
	key: 2,
	class: "field"
}, Bw = ["value"], Vw = {
	key: 0,
	class: "card"
}, Hw = {
	key: 1,
	class: "error"
}, Uw = {
	key: 2,
	class: "field-list"
}, Ww = { class: "result-actions" }, Gw = ["disabled"], Kw = ["disabled"], qw = { class: "mobile-check" };
function Jw(e, t, n, r, i, a) {
	let o = Ca("RenderSpecEditor");
	return B(), V("section", zC, [
		H("header", BC, [t[18] ||= H("div", null, [
			H("p", { class: "eyebrow" }, "Component Generation · CDR-09"),
			H("h2", { id: "generation-title" }, "이미지에서 DOM 컴포넌트 생성"),
			H("p", null, "이미지 영역을 분석해 필드, 안전한 DOM RenderSpec과 디자인 토큰 연결을 제안합니다.")
		], -1), H("span", { class: N(["status", e.run?.status]) }, P(a.statusLabel), 3)]),
		H("ol", VC, [(B(), V(z, null, R([
			"이미지 선택",
			"영역 선택",
			"AI 분석",
			"결과 검토",
			"Draft 준비"
		], (e, t) => H("li", {
			key: e,
			class: N({
				active: a.currentStep === t + 1,
				done: a.currentStep > t + 1
			})
		}, [H("strong", null, P(t + 1), 1), H("span", null, P(e), 1)], 2)), 64))]),
		e.proposal ? (B(), V("div", lw, [
			H("section", uw, [H("div", dw, [H("div", null, [
				t[34] ||= H("span", null, "Detected components", -1),
				H("h3", null, P(e.proposals.length) + "개 컴포넌트 후보", 1),
				t[35] ||= H("p", null, "큰 이미지에서 분리된 후보를 선택해 각각의 DOM과 필드를 검토하세요.", -1)
			])]), H("div", fw, [(B(!0), V(z, null, R(e.proposals, (t, n) => (B(), V("div", {
				key: t.id,
				class: N(["candidate-row", { active: t.id === e.selectedProposalId }])
			}, [H("label", null, [L(H("input", {
				"onUpdate:modelValue": (e) => t.componentDefinition.selected = e,
				type: "checkbox",
				disabled: !!t.appliedAt
			}, null, 8, pw), [[su, t.componentDefinition.selected]]), H("span", null, P(t.appliedAt ? "생성됨" : "생성 선택"), 1)]), H("button", {
				type: "button",
				onClick: (e) => a.selectProposal(t)
			}, [
				H("span", null, P(n + 1), 1),
				H("strong", null, P(t.componentDefinition.name), 1),
				H("em", null, P(Math.round((t.confidence || 0) * 100)) + "%", 1)
			], 8, mw)], 2))), 128))])]),
			H("section", hw, [
				H("div", gw, [H("div", null, [
					t[36] ||= H("span", null, "Step 4", -1),
					H("h3", null, P(e.proposal.componentDefinition.name), 1),
					H("p", null, P(e.proposal.componentDefinition.description), 1)
				]), H("div", _w, [H("strong", null, P(Math.round((e.proposal.confidence || 0) * 100)) + "%", 1), t[37] ||= H("span", null, "분석 신뢰도", -1)])]),
				H("div", vw, [
					H("span", { class: N({ good: a.validation.ok }) }, P(a.validation.ok ? "RenderSpec 검증 통과" : `검증 오류 ${a.validation.errors?.length || 0}건`), 3),
					e.proposal.componentDefinition.reviewRequired ? (B(), V("span", yw, "관리자 검토 필요")) : W("", !0),
					H("span", null, P(a.fields.length) + "개 필드", 1)
				]),
				H("label", bw, [t[38] ||= H("span", null, "컴포넌트 이름", -1), L(H("input", { "onUpdate:modelValue": t[7] ||= (t) => e.proposal.componentDefinition.name = t }, null, 512), [[K, e.proposal.componentDefinition.name]])]),
				H("label", xw, [t[39] ||= H("span", null, "설명", -1), L(H("input", { "onUpdate:modelValue": t[8] ||= (t) => e.proposal.componentDefinition.description = t }, null, 512), [[K, e.proposal.componentDefinition.description]])])
			]),
			H("section", Sw, [H("article", Cw, [t[40] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Original"), H("h3", null, "자동 분리 영역")])], -1), H("div", ww, [H("img", {
				src: e.sourceImageUrl || e.sourceUrl,
				alt: "분석 원본"
			}, null, 8, Tw), (B(!0), V(z, null, R(e.proposals, (t, n) => (B(), V("button", {
				key: t.id,
				class: N(["candidate-box", { active: t.id === e.selectedProposalId }]),
				style: Se(a.candidateRegionStyle(t)),
				type: "button",
				onClick: (e) => a.selectProposal(t)
			}, [H("span", null, P(n + 1), 1)], 14, Ew))), 128))])]), H("article", Dw, [
				t[42] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Validation"), H("h3", null, "분석 품질 확인")])], -1),
				a.validation.metrics ? (B(), V("p", Ow, "노드 " + P(a.validation.metrics.nodeCount) + " · 필드 노드 " + P(a.validation.metrics.fieldNodeCount) + " · 깊이 " + P(a.validation.metrics.maxDepth), 1)) : W("", !0),
				a.validation.errors?.length ? (B(), V("div", kw, [t[41] ||= H("strong", null, "수정할 항목", -1), (B(!0), V(z, null, R(a.validation.errors, (e) => (B(), V("p", { key: `${e.path}:${e.code}` }, P(e.path) + " · " + P(e.message), 1))), 128))])) : (B(), V("p", Aw, "보안·접근성·필드 참조 검증을 통과했습니다."))
			])]),
			Ls(o, {
				modelValue: e.proposal.renderSpec,
				"onUpdate:modelValue": t[9] ||= (t) => e.proposal.renderSpec = t,
				fields: a.fields,
				"source-image-url": e.sourceImageUrl || e.sourceUrl
			}, null, 8, [
				"modelValue",
				"fields",
				"source-image-url"
			]),
			H("section", jw, [H("article", Mw, [t[43] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Detected fields"), H("h3", null, "콘텐츠 필드")])], -1), H("ul", Nw, [(B(!0), V(z, null, R(a.fields, (e) => (B(), V("li", { key: e.fieldKey }, [H("strong", null, P(e.name), 1), H("span", null, P(e.fieldKind) + " · " + P(e.fieldKey), 1)]))), 128))])]), H("article", Pw, [
				t[47] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Similarity"), H("h3", null, "유사 컴포넌트와 생성 방식")])], -1),
				e.proposal.similarComponents?.length ? (B(), V("ul", Fw, [(B(!0), V(z, null, R(e.proposal.similarComponents, (e) => (B(), V("li", { key: e.componentId }, [H("strong", null, P(e.name), 1), H("span", null, "유사도 " + P(Math.round(e.score * 100)) + "% · " + P(e.score >= .75 ? "새 버전 후보" : "참고"), 1)]))), 128))])) : (B(), V("p", Iw, "유사한 기존 컴포넌트가 없습니다.")),
				H("div", Lw, [H("label", null, [L(H("input", {
					"onUpdate:modelValue": t[10] ||= (t) => e.proposal.componentDefinition.creationMode = t,
					type: "radio",
					value: "new-component"
				}, null, 512), [[lu, e.proposal.componentDefinition.creationMode]]), t[44] ||= H("span", null, "새 컴포넌트", -1)]), e.proposal.similarComponents?.length ? (B(), V("label", Rw, [L(H("input", {
					"onUpdate:modelValue": t[11] ||= (t) => e.proposal.componentDefinition.creationMode = t,
					type: "radio",
					value: "new-version"
				}, null, 512), [[lu, e.proposal.componentDefinition.creationMode]]), t[45] ||= H("span", null, "기존 컴포넌트의 새 버전", -1)])) : W("", !0)]),
				e.proposal.componentDefinition.creationMode === "new-version" ? (B(), V("label", zw, [t[46] ||= H("span", null, "대상 컴포넌트", -1), L(H("select", { "onUpdate:modelValue": t[12] ||= (t) => e.proposal.componentDefinition.targetComponentId = t }, [(B(!0), V(z, null, R(e.proposal.similarComponents, (e) => (B(), V("option", {
					key: e.componentId,
					value: e.componentId
				}, P(e.name) + " · " + P(Math.round(e.score * 100)) + "%", 9, Bw))), 128))], 512), [[q, e.proposal.componentDefinition.targetComponentId]])])) : W("", !0)
			])]),
			e.proposal.reviewNotes?.length ? (B(), V("section", Vw, [t[48] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Review notes"), H("h3", null, "검토 메모")])], -1), H("ul", null, [(B(!0), V(z, null, R(e.proposal.reviewNotes, (e) => (B(), V("li", { key: e }, P(e), 1))), 128))])])) : W("", !0),
			e.error ? (B(), V("p", Hw, P(e.error), 1)) : W("", !0),
			e.applyResults.length ? (B(), V("ul", Uw, [(B(!0), V(z, null, R(e.applyResults, (e) => (B(), V("li", { key: e.proposalId }, [H("strong", null, P(e.name || e.proposalId), 1), H("span", null, P(e.ok ? "Draft 생성 완료" : e.message), 1)]))), 128))])) : W("", !0),
			H("div", Ww, [
				H("button", {
					class: "tiny-button",
					type: "button",
					onClick: t[13] ||= (...e) => a.analyze && a.analyze(...e)
				}, "같은 이미지로 다시 분석"),
				H("button", {
					class: "tiny-button",
					type: "button",
					onClick: t[14] ||= (...e) => a.resetForNew && a.resetForNew(...e)
				}, "새 이미지 분석"),
				H("button", {
					class: "tiny-button",
					type: "button",
					disabled: e.saving,
					onClick: t[15] ||= (...e) => a.saveReview && a.saveReview(...e)
				}, P(e.saving ? "저장 중" : "현재 후보 재검증·저장"), 9, Gw),
				H("button", {
					class: "tiny-button primary",
					type: "button",
					disabled: e.applying || !e.mobileReviewed || !e.proposals.some((e) => e.componentDefinition?.selected !== !1 && !e.appliedAt && e.validationResult?.ok && e.componentDefinition?.creationMode !== "new-version"),
					onClick: t[16] ||= (...e) => a.applySelected && a.applySelected(...e)
				}, P(e.applying ? "Draft 생성 중" : "선택 후보 컴포넌트 Draft 생성"), 9, Kw)
			]),
			H("label", qw, [L(H("input", {
				"onUpdate:modelValue": t[17] ||= (t) => e.mobileReviewed = t,
				type: "checkbox"
			}, null, 512), [[su, e.mobileReviewed]]), t[49] ||= H("span", null, "Mobile 미리보기와 오버플로를 확인했습니다.", -1)]),
			t[50] ||= H("p", { class: "next-note" }, "검증을 통과한 새 컴포넌트 후보만 일괄 Draft로 생성됩니다. 기존 컴포넌트의 새 버전 후보는 충돌 방지를 위해 개별 검토가 필요합니다.", -1)
		])) : (B(), V("div", HC, [H("section", UC, [
			H("div", WC, [t[19] ||= H("div", null, [H("span", null, "Step 1–2"), H("h3", null, "분석 이미지와 영역")], -1), e.sourceUrl ? (B(), V("button", {
				key: 0,
				class: "tiny-button",
				type: "button",
				onClick: t[0] ||= (...e) => a.clearSource && a.clearSource(...e)
			}, "다시 선택")) : W("", !0)]),
			e.sourceUrl ? (B(), V("div", KC, [H("img", {
				src: e.sourceUrl,
				alt: "분석 원본"
			}, null, 8, qC), H("div", {
				class: "crop-box",
				style: Se(a.cropStyle)
			}, [...t[23] ||= [H("span", null, "분석 영역", -1)]], 4)])) : (B(), V("label", GC, [
				H("input", {
					ref: "sourceInput",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: t[1] ||= (...e) => a.selectSource && a.selectSource(...e)
				}, null, 544),
				t[20] ||= H("strong", null, "디자인 이미지 선택", -1),
				t[21] ||= H("span", null, "PNG, JPEG, WebP · 최대 10MB", -1),
				t[22] ||= H("small", null, "생성할 컴포넌트가 선명하게 보이는 이미지를 권장합니다.", -1)
			])),
			e.sourceUrl ? (B(), V("p", JC, [
				U(P(e.sourceName || "기존 업로드 이미지"), 1),
				e.sourceSize ? (B(), V(z, { key: 0 }, [U(" · " + P(a.formatBytes(e.sourceSize)), 1)], 64)) : W("", !0),
				e.sourceDimensions ? (B(), V(z, { key: 1 }, [U(" · " + P(e.sourceDimensions.width) + "×" + P(e.sourceDimensions.height), 1)], 64)) : W("", !0)
			])) : W("", !0),
			e.sourceError ? (B(), V("p", YC, P(e.sourceError), 1)) : W("", !0),
			e.sourceUrl ? (B(), V("fieldset", XC, [t[24] ||= H("legend", null, "영역 좌표 (이미지 비율)", -1), (B(), V(z, null, R([
				"x",
				"y",
				"width",
				"height"
			], (n) => H("label", { key: n }, [
				H("span", null, P(n), 1),
				L(H("input", {
					"onUpdate:modelValue": (t) => e.crop[n] = t,
					type: "range",
					min: "0",
					max: "1",
					step: "0.01",
					onInput: t[2] ||= (...e) => a.clampCrop && a.clampCrop(...e)
				}, null, 40, ZC), [[
					K,
					e.crop[n],
					void 0,
					{ number: !0 }
				]]),
				H("em", null, P(Math.round(e.crop[n] * 100)) + "%", 1)
			])), 64))])) : W("", !0),
			H("label", QC, [t[25] ||= H("span", null, "생성 목적", -1), L(H("textarea", {
				"onUpdate:modelValue": t[3] ||= (t) => e.componentIntent = t,
				rows: "3",
				placeholder: "예: 이미지, 제목, 설명, CTA가 포함된 프로모션 카드"
			}, null, 512), [[K, e.componentIntent]])]),
			H("fieldset", null, [t[26] ||= H("legend", null, "사용할 섹션 역할", -1), H("div", $C, [(B(), V(z, null, R([
				"header",
				"hero",
				"benefit",
				"content",
				"cta",
				"notice",
				"terms",
				"legal",
				"footer"
			], (n) => H("label", { key: n }, [L(H("input", {
				"onUpdate:modelValue": t[4] ||= (t) => e.selectedRoles = t,
				type: "checkbox",
				value: n
			}, null, 8, ew), [[su, e.selectedRoles]]), H("span", null, P(n), 1)])), 64))])]),
			e.tokenSets.length ? (B(), V("label", tw, [t[27] ||= H("span", null, "대상 디자인 토큰", -1), L(H("select", { "onUpdate:modelValue": t[5] ||= (t) => e.targetTokenVersionId = t }, [(B(!0), V(z, null, R(e.tokenSets, (e) => (B(), V("option", {
				key: e.versionId,
				value: e.versionId
			}, [U(P(e.name), 1), e.isDefault ? (B(), V(z, { key: 0 }, [U(" · 기본")], 64)) : W("", !0)], 8, nw))), 128))], 512), [[q, e.targetTokenVersionId]])])) : W("", !0)
		]), H("aside", rw, [
			t[33] ||= H("div", { class: "card-title" }, [H("div", null, [H("span", null, "Step 3"), H("h3", null, "AI 이미지 분석")])], -1),
			H("ul", iw, [
				H("li", null, [t[28] ||= H("span", null, "실제 파일 형식·크기 검증", -1), H("em", null, P(e.sourceUrl ? "준비" : "대기"), 1)]),
				H("li", null, [t[29] ||= H("span", null, "정규화 Crop 영역", -1), H("em", null, P(e.sourceUrl ? "준비" : "대기"), 1)]),
				H("li", null, [t[30] ||= H("span", null, "DOM·필드·토큰 분석", -1), H("em", null, P(e.busy ? "진행 중" : "대기"), 1)]),
				t[31] ||= H("li", null, [H("span", null, "보안·접근성 검증"), H("em", null, "자동")], -1),
				t[32] ||= H("li", null, [H("span", null, "기존 컴포넌트 유사도"), H("em", null, "자동")], -1)
			]),
			e.error ? (B(), V("p", aw, P(e.error), 1)) : W("", !0),
			H("button", {
				class: "tiny-button primary analyze",
				type: "button",
				disabled: !a.canAnalyze,
				onClick: t[6] ||= (...e) => a.analyze && a.analyze(...e)
			}, P(e.busy ? "이미지를 분석하고 있습니다…" : e.run?.status === "failed" ? "원본 업로드 없이 다시 분석" : "분석 시작"), 9, ow),
			e.busy ? (B(), V("small", sw, "프롬프트 설정과 모델에 따라 최대 3분이 걸릴 수 있습니다.")) : (B(), V("small", cw, "관리자에서 활성화한 컴포넌트 이미지 분석 프롬프트와 모델 설정을 사용합니다."))
		])]))
	]);
}
var Yw = /*#__PURE__*/ jh(RC, [["render", Jw], ["__scopeId", "data-v-f0661921"]]), Xw = { class: "directus-settings" }, Zw = { class: "directus-settings__header" }, Qw = ["disabled"], $w = { class: "directus-settings__flags" }, eT = {
	key: 0,
	class: "directus-settings__notice"
}, tT = {
	key: 1,
	class: "outline-item danger-state"
}, nT = { class: "directus-settings__grid" }, rT = { class: "directus-settings__history" }, iT = { class: "directus-settings__environment" }, aT = ["onClick"], oT = { key: 0 }, sT = { class: "directus-settings__editor" }, cT = { class: "app-form-grid" }, lT = { class: "app-field" }, uT = { class: "app-field" }, dT = { class: "app-field" }, fT = { class: "app-field" }, pT = { class: "app-field" }, mT = { class: "app-checkbox" }, hT = { class: "app-actions app-actions--end" }, gT = ["disabled"], _T = ["disabled"], vT = ["disabled"], yT = ["disabled"], bT = ["disabled"], xT = {
	key: 0,
	class: "directus-settings__validation"
}, ST = { class: "directus-settings__checks" }, CT = { key: 0 }, wT = /*#__PURE__*/ jh({
	__name: "DirectusIntegrationSettings",
	props: { capabilities: {
		type: Object,
		default: () => ({})
	} },
	emits: ["notify"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ I(!1), a = /* @__PURE__ */ I(!1), o = /* @__PURE__ */ I([]), s = /* @__PURE__ */ I(""), c = /* @__PURE__ */ I(""), l = /* @__PURE__ */ I(null), u = /* @__PURE__ */ I([]), d = /* @__PURE__ */ fn({
			environment: "development",
			baseUrl: "",
			secretRef: "env:DIRECTUS_SECRET_CONNECTION",
			timeoutMs: 5e3,
			retryCount: 0,
			verifyAuthentication: !0
		}), f = G(() => o.value.find((e) => e.id === s.value) || null), p = G(() => n.capabilities.directusIntegration === !0 && n.capabilities.directusConnectionTunnel === !0), m = G(() => [
			"development",
			"preview",
			"production"
		].map((e) => ({
			environment: e,
			rows: o.value.filter((t) => t.environment === e)
		})).filter((e) => e.rows.length)), h = G(() => u.value.find((e) => e.configId === s.value) || null);
		async function g(e, t = {}) {
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
		function _(e) {
			s.value = e.id, Object.assign(d, {
				environment: e.environment,
				...e.config
			}), l.value = null;
		}
		async function v() {
			i.value = !0, c.value = "";
			try {
				let e = await g("/api/directus-integration-config");
				o.value = e.configs || [], u.value = e.checks || [], s.value &&= o.value.some((e) => e.id === s.value) ? s.value : "";
			} catch (e) {
				c.value = e.message;
			} finally {
				i.value = !1;
			}
		}
		async function y() {
			a.value = !0, c.value = "";
			try {
				let e = await g("/api/directus-integration-config", {
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
				await v(), _(o.value.find((t) => t.id === e.config.id) || e.config), r("notify", "Directus 연결 설정 초안을 저장했습니다.");
			} catch (e) {
				c.value = e.message;
			} finally {
				a.value = !1;
			}
		}
		async function b(e) {
			if (f.value) {
				a.value = !0, c.value = "";
				try {
					let t = await g("/api/directus-integration-config", {
						method: "PATCH",
						body: JSON.stringify({
							id: f.value.id,
							action: e
						})
					});
					await v(), _(o.value.find((e) => e.id === t.config.id) || t.config), r("notify", e === "activate" ? "Directus 연결 설정을 활성화했습니다." : e === "suspend" ? "Directus 연결 설정을 중지했습니다." : "Directus 연결 설정 검증을 완료했습니다.");
				} catch (e) {
					c.value = e.message;
				} finally {
					a.value = !1;
				}
			}
		}
		async function x() {
			if (f.value) {
				a.value = !0, c.value = "", l.value = null;
				try {
					let e = await g("/api/directus-connection-test", {
						method: "POST",
						body: JSON.stringify({ id: f.value.id })
					});
					l.value = e.result, await v(), r("notify", "Directus 연결 테스트를 통과했습니다.");
				} catch (e) {
					c.value = e.message, l.value = e.result?.result || null;
				} finally {
					a.value = !1;
				}
			}
		}
		return fa(v), (t, n) => (B(), V("div", Xw, [
			H("header", Zw, [n[9] ||= H("div", null, [
				H("span", { class: "eyebrow" }, "Integration Config"),
				H("h2", null, "Directus 연결 터널"),
				H("p", null, "현재 단계에서는 URL·비밀키 참조·연결 검증만 관리합니다. 컬렉션 매핑, 데이터 마이그레이션, 런타임 읽기·쓰기는 포함하지 않습니다.")
			], -1), H("button", {
				class: "tiny-button",
				type: "button",
				disabled: i.value,
				onClick: v
			}, "새로고침", 8, Qw)]),
			H("div", $w, [
				H("span", { class: N({ on: e.capabilities.directusConfigManagement }) }, "Config 관리 " + P(e.capabilities.directusConfigManagement ? "ON" : "OFF"), 3),
				H("span", { class: N({ on: e.capabilities.directusIntegration }) }, "Directus 연동 " + P(e.capabilities.directusIntegration ? "ON" : "OFF"), 3),
				H("span", { class: N({ on: e.capabilities.directusConnectionTunnel }) }, "연결 터널 " + P(e.capabilities.directusConnectionTunnel ? "ON" : "OFF"), 3)
			]),
			p.value ? W("", !0) : (B(), V("div", eT, [...n[10] ||= [
				U(" 설정 초안은 준비할 수 있습니다. 실제 연결 테스트는 ", -1),
				H("code", null, "DIRECTUS_INTEGRATION_ENABLED=true", -1),
				U("와 ", -1),
				H("code", null, "DIRECTUS_CONNECTION_TUNNEL_ENABLED=true", -1),
				U("일 때만 실행됩니다. ", -1)
			]])),
			c.value ? (B(), V("div", tT, [n[11] ||= H("strong", null, "Directus 설정 오류", -1), H("span", null, P(c.value), 1)])) : W("", !0),
			H("div", nT, [H("aside", rT, [
				n[12] ||= H("h3", null, "설정 버전", -1),
				(B(!0), V(z, null, R(m.value, (e) => (B(), V(z, { key: e.environment }, [H("strong", iT, P(e.environment), 1), (B(!0), V(z, null, R(e.rows, (e) => (B(), V("button", {
					key: e.id,
					type: "button",
					class: N({ selected: s.value === e.id }),
					onClick: (t) => _(e)
				}, [H("span", null, "v" + P(e.version), 1), H("em", null, P(e.status), 1)], 10, aT))), 128))], 64))), 128)),
				!i.value && !o.value.length ? (B(), V("p", oT, "저장된 설정이 없습니다.")) : W("", !0)
			]), H("section", sT, [
				H("div", cT, [
					H("label", lT, [n[14] ||= H("span", null, "환경", -1), L(H("select", { "onUpdate:modelValue": n[0] ||= (e) => d.environment = e }, [...n[13] ||= [
						H("option", { value: "development" }, "development", -1),
						H("option", { value: "preview" }, "preview", -1),
						H("option", { value: "production" }, "production", -1)
					]], 512), [[q, d.environment]])]),
					H("label", uT, [n[15] ||= H("span", null, "Directus Base URL", -1), L(H("input", {
						"onUpdate:modelValue": n[1] ||= (e) => d.baseUrl = e,
						type: "url",
						placeholder: "https://directus.example.com"
					}, null, 512), [[
						K,
						d.baseUrl,
						void 0,
						{ trim: !0 }
					]])]),
					H("label", dT, [
						n[16] ||= H("span", null, "비밀키 참조", -1),
						L(H("input", {
							"onUpdate:modelValue": n[2] ||= (e) => d.secretRef = e,
							type: "text",
							placeholder: "env:DIRECTUS_SECRET_CONNECTION"
						}, null, 512), [[
							K,
							d.secretRef,
							void 0,
							{ trim: !0 }
						]]),
						n[17] ||= H("small", null, "토큰 값이 아니라 서버 환경변수 이름만 저장합니다.", -1)
					]),
					H("label", fT, [n[18] ||= H("span", null, "Timeout (ms)", -1), L(H("input", {
						"onUpdate:modelValue": n[3] ||= (e) => d.timeoutMs = e,
						type: "number",
						min: "1000",
						max: "15000",
						step: "500"
					}, null, 512), [[
						K,
						d.timeoutMs,
						void 0,
						{ number: !0 }
					]])]),
					H("label", pT, [n[19] ||= H("span", null, "Retry", -1), L(H("input", {
						"onUpdate:modelValue": n[4] ||= (e) => d.retryCount = e,
						type: "number",
						min: "0",
						max: "2"
					}, null, 512), [[
						K,
						d.retryCount,
						void 0,
						{ number: !0 }
					]])]),
					H("label", mT, [L(H("input", {
						"onUpdate:modelValue": n[5] ||= (e) => d.verifyAuthentication = e,
						type: "checkbox"
					}, null, 512), [[su, d.verifyAuthentication]]), n[20] ||= H("span", null, [H("code", null, "/users/me"), U(" 인증 확인")], -1)])
				]),
				H("div", hT, [
					H("button", {
						class: "tiny-button primary",
						type: "button",
						disabled: a.value || !d.baseUrl,
						onClick: y
					}, "새 초안 저장", 8, gT),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "draft",
						onClick: n[6] ||= (e) => b("validate")
					}, "구성 검증", 8, _T),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "draft" || f.value?.validation?.ok !== !0 || h.value?.status !== "passed",
						onClick: n[7] ||= (e) => b("activate")
					}, "활성화", 8, vT),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || f.value?.status !== "active",
						onClick: n[8] ||= (e) => b("suspend")
					}, "중지", 8, yT),
					H("button", {
						class: "tiny-button",
						type: "button",
						disabled: a.value || !f.value || !p.value,
						onClick: x
					}, "연결 테스트", 8, bT)
				]),
				f.value?.validation?.errors?.length ? (B(), V("div", xT, [n[21] ||= H("strong", null, "검증 오류", -1), H("ul", null, [(B(!0), V(z, null, R(f.value.validation.errors, (e) => (B(), V("li", { key: e.code }, P(e.message), 1))), 128))])])) : W("", !0),
				l.value ? (B(), V("div", {
					key: 1,
					class: N(["directus-settings__result", l.value.status])
				}, [H("strong", null, P(l.value.status === "passed" ? "연결 성공" : "연결 실패"), 1), H("span", null, "Health: " + P(l.value.healthStatus || "-") + " · Auth: " + P(l.value.authVerified ? "확인" : "미확인") + " · " + P(l.value.durationMs) + "ms", 1)], 2)) : W("", !0),
				H("div", ST, [
					n[22] ||= H("strong", null, "최근 연결 검사", -1),
					(B(!0), V(z, null, R(u.value.slice(0, 10), (e) => (B(), V("div", {
						key: e.id,
						class: "directus-settings__check"
					}, [H("span", null, P(e.environment) + " v" + P(e.version) + " · " + P(e.status), 1), H("em", null, P(e.healthStatus || e.errorCode || "-") + " · " + P(e.durationMs) + "ms", 1)]))), 128)),
					u.value.length ? W("", !0) : (B(), V("small", CT, "연결 검사 이력이 없습니다."))
				])
			])])
		]));
	}
}, [["__scopeId", "data-v-57361789"]]);
//#endregion
//#region node_modules/.pnpm/is-node-process@1.2.0/node_modules/is-node-process/lib/index.mjs
function TT() {
	if (typeof navigator < "u" && navigator.product === "ReactNative") return !0;
	if (typeof process < "u") {
		let e = process.type;
		return e === "renderer" || e === "worker" ? !1 : !!(process.versions && process.versions.node);
	}
	return !1;
}
//#endregion
//#region node_modules/.pnpm/@vercel+blob@2.5.0/node_modules/@vercel/blob/dist/stream-browser.js
var ET = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	t.exports = function(e) {
		return e != null && e.constructor != null && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
	};
})))(), 1), DT = { toWeb() {
	throw Error("Vercel Blob: Sorry, we cannot get a Readable stream in this environment. If you see this message please open an issue here: https://github.com/vercel/storage/ with details on your environment.");
} }, OT = /* @__PURE__ */ s(((e, t) => {
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
})), X, kT, AT = o((() => {
	X = crypto, kT = (e) => e instanceof CryptoKey;
})), jT, MT = o((() => {
	AT(), jT = async (e, t) => {
		let n = `SHA-${e.slice(-3)}`;
		return new Uint8Array(await X.subtle.digest(n, t));
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/buffer_utils.js
function NT(...e) {
	let t = e.reduce((e, { length: t }) => e + t, 0), n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
function PT(e, t) {
	return NT(BT.encode(e), new Uint8Array([0]), t);
}
function FT(e, t, n) {
	if (t < 0 || t >= HT) throw RangeError(`value must be >= 0 and <= ${HT - 1}. Received ${t}`);
	e.set([
		t >>> 24,
		t >>> 16,
		t >>> 8,
		t & 255
	], n);
}
function IT(e) {
	let t = Math.floor(e / HT), n = e % HT, r = /* @__PURE__ */ new Uint8Array(8);
	return FT(r, t, 0), FT(r, n, 4), r;
}
function LT(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return FT(t, e), t;
}
function RT(e) {
	return NT(LT(e.length), e);
}
async function zT(e, t, n) {
	let r = Math.ceil((t >> 3) / 32), i = new Uint8Array(r * 32);
	for (let t = 0; t < r; t++) {
		let r = new Uint8Array(4 + e.length + n.length);
		r.set(LT(t + 1)), r.set(e, 4), r.set(n, 4 + e.length), i.set(await jT("sha256", r), t * 32);
	}
	return i.slice(0, t >> 3);
}
var BT, VT, HT, UT = o((() => {
	MT(), BT = new TextEncoder(), VT = new TextDecoder(), HT = 2 ** 32;
})), WT, GT, KT, qT, JT = o((() => {
	UT(), WT = (e) => {
		let t = e;
		typeof t == "string" && (t = BT.encode(t));
		let n = 32768, r = [];
		for (let e = 0; e < t.length; e += n) r.push(String.fromCharCode.apply(null, t.subarray(e, e + n)));
		return btoa(r.join(""));
	}, GT = (e) => WT(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), KT = (e) => {
		let t = atob(e), n = new Uint8Array(t.length);
		for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
		return n;
	}, qT = (e) => {
		let t = e;
		t instanceof Uint8Array && (t = VT.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
		try {
			return KT(t);
		} catch {
			throw TypeError("The input to be decoded is not correctly encoded.");
		}
	};
})), YT = /* @__PURE__ */ c({
	JOSEAlgNotAllowed: () => $T,
	JOSEError: () => XT,
	JOSENotSupported: () => eE,
	JWEDecryptionFailed: () => tE,
	JWEInvalid: () => Z,
	JWKInvalid: () => iE,
	JWKSInvalid: () => aE,
	JWKSMultipleMatchingKeys: () => sE,
	JWKSNoMatchingKey: () => oE,
	JWKSTimeout: () => cE,
	JWSInvalid: () => nE,
	JWSSignatureVerificationFailed: () => lE,
	JWTClaimValidationFailed: () => ZT,
	JWTExpired: () => QT,
	JWTInvalid: () => rE
}), XT, ZT, QT, $T, eE, tE, Z, nE, rE, iE, aE, oE, sE, cE, lE, Q = o((() => {
	XT = class extends Error {
		constructor(e, t) {
			super(e, t), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
		}
	}, XT.code = "ERR_JOSE_GENERIC", ZT = class extends XT {
		constructor(e, t, n = "unspecified", r = "unspecified") {
			super(e, { cause: {
				claim: n,
				reason: r,
				payload: t
			} }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = n, this.reason = r, this.payload = t;
		}
	}, ZT.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", QT = class extends XT {
		constructor(e, t, n = "unspecified", r = "unspecified") {
			super(e, { cause: {
				claim: n,
				reason: r,
				payload: t
			} }), this.code = "ERR_JWT_EXPIRED", this.claim = n, this.reason = r, this.payload = t;
		}
	}, QT.code = "ERR_JWT_EXPIRED", $T = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
		}
	}, $T.code = "ERR_JOSE_ALG_NOT_ALLOWED", eE = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
		}
	}, eE.code = "ERR_JOSE_NOT_SUPPORTED", tE = class extends XT {
		constructor(e = "decryption operation failed", t) {
			super(e, t), this.code = "ERR_JWE_DECRYPTION_FAILED";
		}
	}, tE.code = "ERR_JWE_DECRYPTION_FAILED", Z = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JWE_INVALID";
		}
	}, Z.code = "ERR_JWE_INVALID", nE = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JWS_INVALID";
		}
	}, nE.code = "ERR_JWS_INVALID", rE = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JWT_INVALID";
		}
	}, rE.code = "ERR_JWT_INVALID", iE = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JWK_INVALID";
		}
	}, iE.code = "ERR_JWK_INVALID", aE = class extends XT {
		constructor() {
			super(...arguments), this.code = "ERR_JWKS_INVALID";
		}
	}, aE.code = "ERR_JWKS_INVALID", oE = class extends XT {
		constructor(e = "no applicable key found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_NO_MATCHING_KEY";
		}
	}, oE.code = "ERR_JWKS_NO_MATCHING_KEY", sE = class extends XT {
		constructor(e = "multiple matching keys found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
		}
	}, sE.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS", cE = class extends XT {
		constructor(e = "request timed out", t) {
			super(e, t), this.code = "ERR_JWKS_TIMEOUT";
		}
	}, cE.code = "ERR_JWKS_TIMEOUT", lE = class extends XT {
		constructor(e = "signature verification failed", t) {
			super(e, t), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
		}
	}, lE.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
})), uE, dE = o((() => {
	AT(), uE = X.getRandomValues.bind(X);
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/iv.js
function fE(e) {
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
		default: throw new eE(`Unsupported JWE Algorithm: ${e}`);
	}
}
var pE, mE = o((() => {
	Q(), dE(), pE = (e) => uE(new Uint8Array(fE(e) >> 3));
})), hE, gE = o((() => {
	Q(), mE(), hE = (e, t) => {
		if (t.length << 3 !== fE(e)) throw new Z("Invalid Initialization Vector length");
	};
})), _E, vE = o((() => {
	Q(), _E = (e, t) => {
		let n = e.byteLength << 3;
		if (n !== t) throw new Z(`Invalid Content Encryption Key length. Expected ${t} bits, got ${n} bits`);
	};
})), yE, bE = o((() => {
	yE = (e, t) => {
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
function xE(e, t = "algorithm.name") {
	return /* @__PURE__ */ TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
function SE(e, t) {
	return e.name === t;
}
function CE(e) {
	return parseInt(e.name.slice(4), 10);
}
function wE(e) {
	switch (e) {
		case "ES256": return "P-256";
		case "ES384": return "P-384";
		case "ES512": return "P-521";
		default: throw Error("unreachable");
	}
}
function TE(e, t) {
	if (t.length && !t.some((t) => e.usages.includes(t))) {
		let e = "CryptoKey does not support this operation, its usages must include ";
		if (t.length > 2) {
			let n = t.pop();
			e += `one of ${t.join(", ")}, or ${n}.`;
		} else t.length === 2 ? e += `one of ${t[0]} or ${t[1]}.` : e += `${t[0]}.`;
		throw TypeError(e);
	}
}
function EE(e, t, ...n) {
	switch (t) {
		case "HS256":
		case "HS384":
		case "HS512": {
			if (!SE(e.algorithm, "HMAC")) throw xE("HMAC");
			let n = parseInt(t.slice(2), 10);
			if (CE(e.algorithm.hash) !== n) throw xE(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "RS256":
		case "RS384":
		case "RS512": {
			if (!SE(e.algorithm, "RSASSA-PKCS1-v1_5")) throw xE("RSASSA-PKCS1-v1_5");
			let n = parseInt(t.slice(2), 10);
			if (CE(e.algorithm.hash) !== n) throw xE(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "PS256":
		case "PS384":
		case "PS512": {
			if (!SE(e.algorithm, "RSA-PSS")) throw xE("RSA-PSS");
			let n = parseInt(t.slice(2), 10);
			if (CE(e.algorithm.hash) !== n) throw xE(`SHA-${n}`, "algorithm.hash");
			break;
		}
		case "EdDSA":
			if (e.algorithm.name !== "Ed25519" && e.algorithm.name !== "Ed448") throw xE("Ed25519 or Ed448");
			break;
		case "Ed25519":
			if (!SE(e.algorithm, "Ed25519")) throw xE("Ed25519");
			break;
		case "ES256":
		case "ES384":
		case "ES512": {
			if (!SE(e.algorithm, "ECDSA")) throw xE("ECDSA");
			let n = wE(t);
			if (e.algorithm.namedCurve !== n) throw xE(n, "algorithm.namedCurve");
			break;
		}
		default: throw TypeError("CryptoKey does not support this operation");
	}
	TE(e, n);
}
function DE(e, t, ...n) {
	switch (t) {
		case "A128GCM":
		case "A192GCM":
		case "A256GCM": {
			if (!SE(e.algorithm, "AES-GCM")) throw xE("AES-GCM");
			let n = parseInt(t.slice(1, 4), 10);
			if (e.algorithm.length !== n) throw xE(n, "algorithm.length");
			break;
		}
		case "A128KW":
		case "A192KW":
		case "A256KW": {
			if (!SE(e.algorithm, "AES-KW")) throw xE("AES-KW");
			let n = parseInt(t.slice(1, 4), 10);
			if (e.algorithm.length !== n) throw xE(n, "algorithm.length");
			break;
		}
		case "ECDH":
			switch (e.algorithm.name) {
				case "ECDH":
				case "X25519":
				case "X448": break;
				default: throw xE("ECDH, X25519, or X448");
			}
			break;
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW":
			if (!SE(e.algorithm, "PBKDF2")) throw xE("PBKDF2");
			break;
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512": {
			if (!SE(e.algorithm, "RSA-OAEP")) throw xE("RSA-OAEP");
			let n = parseInt(t.slice(9), 10) || 1;
			if (CE(e.algorithm.hash) !== n) throw xE(`SHA-${n}`, "algorithm.hash");
			break;
		}
		default: throw TypeError("CryptoKey does not support this operation");
	}
	TE(e, n);
}
var OE = o((() => {}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/invalid_key_input.js
function kE(e, t, ...n) {
	if (n = n.filter(Boolean), n.length > 2) {
		let t = n.pop();
		e += `one of type ${n.join(", ")}, or ${t}.`;
	} else n.length === 2 ? e += `one of type ${n[0]} or ${n[1]}.` : e += `of type ${n[0]}.`;
	return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
function AE(e, t, ...n) {
	return kE(`Key for the ${e} algorithm must be `, t, ...n);
}
var jE, ME = o((() => {
	jE = (e, ...t) => kE("Key must be ", e, ...t);
})), NE, PE, FE = o((() => {
	AT(), NE = (e) => kT(e) ? !0 : e?.[Symbol.toStringTag] === "KeyObject", PE = ["CryptoKey"];
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/decrypt.js
async function IE(e, t, n, r, i, a) {
	if (!(t instanceof Uint8Array)) throw TypeError(jE(t, "Uint8Array"));
	let o = parseInt(e.slice(1, 4), 10), s = await X.subtle.importKey("raw", t.subarray(o >> 3), "AES-CBC", !1, ["decrypt"]), c = await X.subtle.importKey("raw", t.subarray(0, o >> 3), {
		hash: `SHA-${o << 1}`,
		name: "HMAC"
	}, !1, ["sign"]), l = NT(a, r, n, IT(a.length << 3)), u = new Uint8Array((await X.subtle.sign("HMAC", c, l)).slice(0, o >> 3)), d;
	try {
		d = yE(i, u);
	} catch {}
	if (!d) throw new tE();
	let f;
	try {
		f = new Uint8Array(await X.subtle.decrypt({
			iv: r,
			name: "AES-CBC"
		}, s, n));
	} catch {}
	if (!f) throw new tE();
	return f;
}
async function LE(e, t, n, r, i, a) {
	let o;
	t instanceof Uint8Array ? o = await X.subtle.importKey("raw", t, "AES-GCM", !1, ["decrypt"]) : (DE(t, e, "decrypt"), o = t);
	try {
		return new Uint8Array(await X.subtle.decrypt({
			additionalData: a,
			iv: r,
			name: "AES-GCM",
			tagLength: 128
		}, o, NT(n, i)));
	} catch {
		throw new tE();
	}
}
var RE, zE = o((() => {
	UT(), gE(), vE(), bE(), Q(), AT(), OE(), ME(), FE(), RE = async (e, t, n, r, i, a) => {
		if (!kT(t) && !(t instanceof Uint8Array)) throw TypeError(jE(t, ...PE, "Uint8Array"));
		if (!r) throw new Z("JWE Initialization Vector missing");
		if (!i) throw new Z("JWE Authentication Tag missing");
		switch (hE(e, r), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512": return t instanceof Uint8Array && _E(t, parseInt(e.slice(-3), 10)), IE(e, t, n, r, i, a);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM": return t instanceof Uint8Array && _E(t, parseInt(e.slice(1, 4), 10)), LE(e, t, n, r, i, a);
			default: throw new eE("Unsupported JWE Content Encryption Algorithm");
		}
	};
})), BE, VE = o((() => {
	BE = (...e) => {
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
function HE(e) {
	return typeof e == "object" && !!e;
}
function UE(e) {
	if (!HE(e) || Object.prototype.toString.call(e) !== "[object Object]") return !1;
	if (Object.getPrototypeOf(e) === null) return !0;
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t;
}
var WE = o((() => {})), GE, KE = o((() => {
	GE = [
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
function qE(e, t) {
	if (e.algorithm.length !== parseInt(t.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${t}`);
}
function JE(e, t, n) {
	if (kT(e)) return DE(e, t, n), e;
	if (e instanceof Uint8Array) return X.subtle.importKey("raw", e, "AES-KW", !0, [n]);
	throw TypeError(jE(e, ...PE, "Uint8Array"));
}
var YE, XE, ZE = o((() => {
	KE(), AT(), OE(), ME(), FE(), YE = async (e, t, n) => {
		let r = await JE(t, e, "wrapKey");
		qE(r, e);
		let i = await X.subtle.importKey("raw", n, ...GE);
		return new Uint8Array(await X.subtle.wrapKey("raw", i, r, "AES-KW"));
	}, XE = async (e, t, n) => {
		let r = await JE(t, e, "unwrapKey");
		qE(r, e);
		let i = await X.subtle.unwrapKey("raw", n, r, "AES-KW", ...GE);
		return new Uint8Array(await X.subtle.exportKey("raw", i));
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/ecdhes.js
async function QE(e, t, n, r, i = /* @__PURE__ */ new Uint8Array(), a = /* @__PURE__ */ new Uint8Array()) {
	if (!kT(e)) throw TypeError(jE(e, ...PE));
	if (DE(e, "ECDH"), !kT(t)) throw TypeError(jE(t, ...PE));
	DE(t, "ECDH", "deriveBits");
	let o = NT(RT(BT.encode(n)), RT(i), RT(a), LT(r)), s;
	return s = e.algorithm.name === "X25519" ? 256 : e.algorithm.name === "X448" ? 448 : Math.ceil(parseInt(e.algorithm.namedCurve.substr(-3), 10) / 8) << 3, zT(new Uint8Array(await X.subtle.deriveBits({
		name: e.algorithm.name,
		public: e
	}, t, s)), r, o);
}
async function $E(e) {
	if (!kT(e)) throw TypeError(jE(e, ...PE));
	return X.subtle.generateKey(e.algorithm, !0, ["deriveBits"]);
}
function eD(e) {
	if (!kT(e)) throw TypeError(jE(e, ...PE));
	return [
		"P-256",
		"P-384",
		"P-521"
	].includes(e.algorithm.namedCurve) || e.algorithm.name === "X25519" || e.algorithm.name === "X448";
}
var tD = o((() => {
	UT(), AT(), OE(), ME(), FE();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/check_p2s.js
function nD(e) {
	if (!(e instanceof Uint8Array) || e.length < 8) throw new Z("PBES2 Salt Input must be 8 or more octets");
}
var rD = o((() => {
	Q();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/pbes2kw.js
function iD(e, t) {
	if (e instanceof Uint8Array) return X.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]);
	if (kT(e)) return DE(e, t, "deriveBits", "deriveKey"), e;
	throw TypeError(jE(e, ...PE, "Uint8Array"));
}
async function aD(e, t, n, r) {
	nD(e);
	let i = PT(t, e), a = parseInt(t.slice(13, 16), 10), o = {
		hash: `SHA-${t.slice(8, 11)}`,
		iterations: n,
		name: "PBKDF2",
		salt: i
	}, s = {
		length: a,
		name: "AES-KW"
	}, c = await iD(r, t);
	if (c.usages.includes("deriveBits")) return new Uint8Array(await X.subtle.deriveBits(o, c, a));
	if (c.usages.includes("deriveKey")) return X.subtle.deriveKey(o, c, s, !1, ["wrapKey", "unwrapKey"]);
	throw TypeError("PBKDF2 key \"usages\" must include \"deriveBits\" or \"deriveKey\"");
}
var oD, sD, cD = o((() => {
	dE(), UT(), JT(), ZE(), rD(), AT(), OE(), ME(), FE(), oD = async (e, t, n, r = 2048, i = uE(/* @__PURE__ */ new Uint8Array(16))) => {
		let a = await aD(i, e, r, t);
		return {
			encryptedKey: await YE(e.slice(-6), a, n),
			p2c: r,
			p2s: GT(i)
		};
	}, sD = async (e, t, n, r, i) => {
		let a = await aD(i, e, r, t);
		return XE(e.slice(-6), a, n);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/subtle_rsaes.js
function lD(e) {
	switch (e) {
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512": return "RSA-OAEP";
		default: throw new eE(`alg ${e} is not supported either by JOSE or your javascript runtime`);
	}
}
var uD = o((() => {
	Q();
})), dD, fD = o((() => {
	dD = (e, t) => {
		if (e.startsWith("RS") || e.startsWith("PS")) {
			let { modulusLength: n } = t.algorithm;
			if (typeof n != "number" || n < 2048) throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
		}
	};
})), pD, mD, hD = o((() => {
	uD(), KE(), AT(), OE(), fD(), ME(), FE(), pD = async (e, t, n) => {
		if (!kT(t)) throw TypeError(jE(t, ...PE));
		if (DE(t, e, "encrypt", "wrapKey"), dD(e, t), t.usages.includes("encrypt")) return new Uint8Array(await X.subtle.encrypt(lD(e), t, n));
		if (t.usages.includes("wrapKey")) {
			let r = await X.subtle.importKey("raw", n, ...GE);
			return new Uint8Array(await X.subtle.wrapKey("raw", r, t, lD(e)));
		}
		throw TypeError("RSA-OAEP key \"usages\" must include \"encrypt\" or \"wrapKey\" for this operation");
	}, mD = async (e, t, n) => {
		if (!kT(t)) throw TypeError(jE(t, ...PE));
		if (DE(t, e, "decrypt", "unwrapKey"), dD(e, t), t.usages.includes("decrypt")) return new Uint8Array(await X.subtle.decrypt(lD(e), t, n));
		if (t.usages.includes("unwrapKey")) {
			let r = await X.subtle.unwrapKey("raw", n, t, lD(e), ...GE);
			return new Uint8Array(await X.subtle.exportKey("raw", r));
		}
		throw TypeError("RSA-OAEP key \"usages\" must include \"decrypt\" or \"unwrapKey\" for this operation");
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/is_jwk.js
function gD(e) {
	return UE(e) && typeof e.kty == "string";
}
function _D(e) {
	return e.kty !== "oct" && typeof e.d == "string";
}
function vD(e) {
	return e.kty !== "oct" && e.d === void 0;
}
function yD(e) {
	return gD(e) && e.kty === "oct" && typeof e.k == "string";
}
var bD = o((() => {
	WE();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/jwk_to_key.js
function xD(e) {
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
				default: throw new eE("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
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
				default: throw new eE("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
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
				default: throw new eE("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			}
			break;
		default: throw new eE("Invalid or unsupported JWK \"kty\" (Key Type) Parameter value");
	}
	return {
		algorithm: t,
		keyUsages: n
	};
}
var SD, CD = o((() => {
	AT(), Q(), SD = async (e) => {
		if (!e.alg) throw TypeError("\"alg\" argument is required when \"jwk.alg\" is not present");
		let { algorithm: t, keyUsages: n } = xD(e), r = [
			t,
			e.ext ?? !1,
			e.key_ops ?? n
		], i = { ...e };
		return delete i.alg, delete i.use, X.subtle.importKey("jwk", i, ...r);
	};
})), wD, TD, ED, DD, OD, kD, AD, jD, MD = o((() => {
	bD(), JT(), CD(), wD = (e) => qT(e), DD = (e) => e?.[Symbol.toStringTag] === "KeyObject", OD = async (e, t, n, r, i = !1) => {
		let a = e.get(t);
		if (a?.[r]) return a[r];
		let o = await SD({
			...n,
			alg: r
		});
		return i && Object.freeze(t), a ? a[r] = o : e.set(t, { [r]: o }), o;
	}, kD = (e, t) => {
		if (DD(e)) {
			let n = e.export({ format: "jwk" });
			return delete n.d, delete n.dp, delete n.dq, delete n.p, delete n.q, delete n.qi, n.k ? wD(n.k) : (ED ||= /* @__PURE__ */ new WeakMap(), OD(ED, e, n, t));
		}
		return gD(e) ? e.k ? qT(e.k) : (ED ||= /* @__PURE__ */ new WeakMap(), OD(ED, e, e, t, !0)) : e;
	}, AD = (e, t) => {
		if (DD(e)) {
			let n = e.export({ format: "jwk" });
			return n.k ? wD(n.k) : (TD ||= /* @__PURE__ */ new WeakMap(), OD(TD, e, n, t));
		}
		return gD(e) ? e.k ? qT(e.k) : (TD ||= /* @__PURE__ */ new WeakMap(), OD(TD, e, e, t, !0)) : e;
	}, jD = {
		normalizePublicKey: kD,
		normalizePrivateKey: AD
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/cek.js
function ND(e) {
	switch (e) {
		case "A128GCM": return 128;
		case "A192GCM": return 192;
		case "A256GCM":
		case "A128CBC-HS256": return 256;
		case "A192CBC-HS384": return 384;
		case "A256CBC-HS512": return 512;
		default: throw new eE(`Unsupported JWE Algorithm: ${e}`);
	}
}
var PD, FD = o((() => {
	Q(), dE(), PD = (e) => uE(new Uint8Array(ND(e) >> 3));
})), ID, LD = o((() => {
	ID = (e, t) => `-----BEGIN ${t}-----\n${(e.match(/.{1,64}/g) || []).join("\n")}\n-----END ${t}-----`;
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/asn1.js
function RD(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = zD(e.subarray(n));
		t.push(r), n += r.byteLength;
	}
	return t;
}
function zD(e) {
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
function BD(e) {
	let t = RD(RD(zD(e).contents)[0].contents);
	return WT(t[t[0].raw[0] === 160 ? 6 : 5].raw);
}
function VD(e) {
	return ID(BD(KT(e.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ""))), "PUBLIC KEY");
}
var HD, UD, WD, GD, KD, qD, JD, YD, XD, ZD = o((() => {
	AT(), ME(), JT(), LD(), Q(), FE(), HD = async (e, t, n) => {
		if (!kT(n)) throw TypeError(jE(n, ...PE));
		if (!n.extractable) throw TypeError("CryptoKey is not extractable");
		if (n.type !== e) throw TypeError(`key is not a ${e} key`);
		return ID(WT(new Uint8Array(await X.subtle.exportKey(t, n))), `${e.toUpperCase()} KEY`);
	}, UD = (e) => HD("public", "spki", e), WD = (e) => HD("private", "pkcs8", e), GD = (e, t, n = 0) => {
		n === 0 && (t.unshift(t.length), t.unshift(6));
		let r = e.indexOf(t[0], n);
		if (r === -1) return !1;
		let i = e.subarray(r, r + t.length);
		return i.length === t.length ? i.every((e, n) => e === t[n]) || GD(e, t, r + 1) : !1;
	}, KD = (e) => {
		switch (!0) {
			case GD(e, [
				42,
				134,
				72,
				206,
				61,
				3,
				1,
				7
			]): return "P-256";
			case GD(e, [
				43,
				129,
				4,
				0,
				34
			]): return "P-384";
			case GD(e, [
				43,
				129,
				4,
				0,
				35
			]): return "P-521";
			case GD(e, [
				43,
				101,
				110
			]): return "X25519";
			case GD(e, [
				43,
				101,
				111
			]): return "X448";
			case GD(e, [
				43,
				101,
				112
			]): return "Ed25519";
			case GD(e, [
				43,
				101,
				113
			]): return "Ed448";
			default: throw new eE("Invalid or unsupported EC Key Curve or OKP Key Sub Type");
		}
	}, qD = async (e, t, n, r, i) => {
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
				let e = KD(s);
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
				a = { name: KD(s) }, o = c ? ["verify"] : ["sign"];
				break;
			default: throw new eE("Invalid or unsupported \"alg\" (Algorithm) value");
		}
		return X.subtle.importKey(t, s, a, i?.extractable ?? !1, o);
	}, JD = (e, t, n) => qD(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", e, t, n), YD = (e, t, n) => qD(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", e, t, n), XD = (e, t, n) => {
		let r;
		try {
			r = VD(e);
		} catch (e) {
			throw TypeError("Failed to parse the X.509 certificate", { cause: e });
		}
		return YD(r, t, n);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/import.js
async function QD(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) throw TypeError("\"spki\" must be SPKI formatted string");
	return YD(e, t, n);
}
async function $D(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN CERTIFICATE-----") !== 0) throw TypeError("\"x509\" must be X.509 formatted string");
	return XD(e, t, n);
}
async function eO(e, t, n) {
	if (typeof e != "string" || e.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) throw TypeError("\"pkcs8\" must be PKCS#8 formatted string");
	return JD(e, t, n);
}
async function tO(e, t) {
	if (!UE(e)) throw TypeError("JWK must be an object");
	switch (t ||= e.alg, e.kty) {
		case "oct":
			if (typeof e.k != "string" || !e.k) throw TypeError("missing \"k\" (Key Value) Parameter value");
			return qT(e.k);
		case "RSA": if ("oth" in e && e.oth !== void 0) throw new eE("RSA JWK \"oth\" (Other Primes Info) Parameter value is not supported");
		case "EC":
		case "OKP": return SD({
			...e,
			alg: t
		});
		default: throw new eE("Unsupported \"kty\" (Key Type) Parameter value");
	}
}
var nO = o((() => {
	JT(), ZD(), CD(), Q(), WE();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/check_key_type.js
function rO(e, t, n, r) {
	t.startsWith("HS") || t === "dir" || t.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t) ? oO(t, n, r, e) : sO(t, n, r, e);
}
var iO, aO, oO, sO, cO, lO, uO = o((() => {
	ME(), FE(), bD(), iO = (e) => e?.[Symbol.toStringTag], aO = (e, t, n) => {
		if (t.use !== void 0 && t.use !== "sig") throw TypeError("Invalid key for this operation, when present its use must be sig");
		if (t.key_ops !== void 0 && t.key_ops.includes?.(n) !== !0) throw TypeError(`Invalid key for this operation, when present its key_ops must include ${n}`);
		if (t.alg !== void 0 && t.alg !== e) throw TypeError(`Invalid key for this operation, when present its alg must be ${e}`);
		return !0;
	}, oO = (e, t, n, r) => {
		if (!(t instanceof Uint8Array)) {
			if (r && gD(t)) {
				if (yD(t) && aO(e, t, n)) return;
				throw TypeError("JSON Web Key for symmetric algorithms must have JWK \"kty\" (Key Type) equal to \"oct\" and the JWK \"k\" (Key Value) present");
			}
			if (!NE(t)) throw TypeError(AE(e, t, ...PE, "Uint8Array", r ? "JSON Web Key" : null));
			if (t.type !== "secret") throw TypeError(`${iO(t)} instances for symmetric algorithms must be of type "secret"`);
		}
	}, sO = (e, t, n, r) => {
		if (r && gD(t)) switch (n) {
			case "sign":
				if (_D(t) && aO(e, t, n)) return;
				throw TypeError("JSON Web Key for this operation be a private JWK");
			case "verify":
				if (vD(t) && aO(e, t, n)) return;
				throw TypeError("JSON Web Key for this operation be a public JWK");
		}
		if (!NE(t)) throw TypeError(AE(e, t, ...PE, r ? "JSON Web Key" : null));
		if (t.type === "secret") throw TypeError(`${iO(t)} instances for asymmetric algorithms must not be of type "secret"`);
		if (n === "sign" && t.type === "public") throw TypeError(`${iO(t)} instances for asymmetric algorithm signing must be of type "private"`);
		if (n === "decrypt" && t.type === "public") throw TypeError(`${iO(t)} instances for asymmetric algorithm decryption must be of type "private"`);
		if (t.algorithm && n === "verify" && t.type === "private") throw TypeError(`${iO(t)} instances for asymmetric algorithm verifying must be of type "public"`);
		if (t.algorithm && n === "encrypt" && t.type === "private") throw TypeError(`${iO(t)} instances for asymmetric algorithm encryption must be of type "public"`);
	}, cO = rO.bind(void 0, !1), lO = rO.bind(void 0, !0);
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/encrypt.js
async function dO(e, t, n, r, i) {
	if (!(n instanceof Uint8Array)) throw TypeError(jE(n, "Uint8Array"));
	let a = parseInt(e.slice(1, 4), 10), o = await X.subtle.importKey("raw", n.subarray(a >> 3), "AES-CBC", !1, ["encrypt"]), s = await X.subtle.importKey("raw", n.subarray(0, a >> 3), {
		hash: `SHA-${a << 1}`,
		name: "HMAC"
	}, !1, ["sign"]), c = new Uint8Array(await X.subtle.encrypt({
		iv: r,
		name: "AES-CBC"
	}, o, t)), l = NT(i, r, c, IT(i.length << 3));
	return {
		ciphertext: c,
		tag: new Uint8Array((await X.subtle.sign("HMAC", s, l)).slice(0, a >> 3)),
		iv: r
	};
}
async function fO(e, t, n, r, i) {
	let a;
	n instanceof Uint8Array ? a = await X.subtle.importKey("raw", n, "AES-GCM", !1, ["encrypt"]) : (DE(n, e, "encrypt"), a = n);
	let o = new Uint8Array(await X.subtle.encrypt({
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
var pO, mO = o((() => {
	UT(), gE(), vE(), AT(), OE(), ME(), mE(), Q(), FE(), pO = async (e, t, n, r, i) => {
		if (!kT(n) && !(n instanceof Uint8Array)) throw TypeError(jE(n, ...PE, "Uint8Array"));
		switch (r ? hE(e, r) : r = pE(e), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512": return n instanceof Uint8Array && _E(n, parseInt(e.slice(-3), 10)), dO(e, t, n, r, i);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM": return n instanceof Uint8Array && _E(n, parseInt(e.slice(1, 4), 10)), fO(e, t, n, r, i);
			default: throw new eE("Unsupported JWE Content Encryption Algorithm");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/aesgcmkw.js
async function hO(e, t, n, r) {
	let i = await pO(e.slice(0, 7), n, t, r, /* @__PURE__ */ new Uint8Array());
	return {
		encryptedKey: i.ciphertext,
		iv: GT(i.iv),
		tag: GT(i.tag)
	};
}
async function gO(e, t, n, r, i) {
	return RE(e.slice(0, 7), t, n, r, i, /* @__PURE__ */ new Uint8Array());
}
var _O = o((() => {
	mO(), zE(), JT();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/decrypt_key_management.js
async function vO(e, t, n, r, i) {
	switch (cO(e, t, "decrypt"), t = await jD.normalizePrivateKey?.(t, e) || t, e) {
		case "dir":
			if (n !== void 0) throw new Z("Encountered unexpected JWE Encrypted Key");
			return t;
		case "ECDH-ES": if (n !== void 0) throw new Z("Encountered unexpected JWE Encrypted Key");
		case "ECDH-ES+A128KW":
		case "ECDH-ES+A192KW":
		case "ECDH-ES+A256KW": {
			if (!UE(r.epk)) throw new Z("JOSE Header \"epk\" (Ephemeral Public Key) missing or invalid");
			if (!eD(t)) throw new eE("ECDH with the provided key is not allowed or not supported by your javascript runtime");
			let i = await tO(r.epk, e), a, o;
			if (r.apu !== void 0) {
				if (typeof r.apu != "string") throw new Z("JOSE Header \"apu\" (Agreement PartyUInfo) invalid");
				try {
					a = qT(r.apu);
				} catch {
					throw new Z("Failed to base64url decode the apu");
				}
			}
			if (r.apv !== void 0) {
				if (typeof r.apv != "string") throw new Z("JOSE Header \"apv\" (Agreement PartyVInfo) invalid");
				try {
					o = qT(r.apv);
				} catch {
					throw new Z("Failed to base64url decode the apv");
				}
			}
			let s = await QE(i, t, e === "ECDH-ES" ? r.enc : e, e === "ECDH-ES" ? ND(r.enc) : parseInt(e.slice(-5, -2), 10), a, o);
			if (e === "ECDH-ES") return s;
			if (n === void 0) throw new Z("JWE Encrypted Key missing");
			return XE(e.slice(-6), s, n);
		}
		case "RSA1_5":
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512":
			if (n === void 0) throw new Z("JWE Encrypted Key missing");
			return mD(e, t, n);
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW": {
			if (n === void 0) throw new Z("JWE Encrypted Key missing");
			if (typeof r.p2c != "number") throw new Z("JOSE Header \"p2c\" (PBES2 Count) missing or invalid");
			let a = i?.maxPBES2Count || 1e4;
			if (r.p2c > a) throw new Z("JOSE Header \"p2c\" (PBES2 Count) out is of acceptable bounds");
			if (typeof r.p2s != "string") throw new Z("JOSE Header \"p2s\" (PBES2 Salt) missing or invalid");
			let o;
			try {
				o = qT(r.p2s);
			} catch {
				throw new Z("Failed to base64url decode the p2s");
			}
			return sD(e, t, n, r.p2c, o);
		}
		case "A128KW":
		case "A192KW":
		case "A256KW":
			if (n === void 0) throw new Z("JWE Encrypted Key missing");
			return XE(e, t, n);
		case "A128GCMKW":
		case "A192GCMKW":
		case "A256GCMKW": {
			if (n === void 0) throw new Z("JWE Encrypted Key missing");
			if (typeof r.iv != "string") throw new Z("JOSE Header \"iv\" (Initialization Vector) missing or invalid");
			if (typeof r.tag != "string") throw new Z("JOSE Header \"tag\" (Authentication Tag) missing or invalid");
			let i;
			try {
				i = qT(r.iv);
			} catch {
				throw new Z("Failed to base64url decode the iv");
			}
			let a;
			try {
				a = qT(r.tag);
			} catch {
				throw new Z("Failed to base64url decode the tag");
			}
			return gO(e, t, n, i, a);
		}
		default: throw new eE("Invalid or unsupported \"alg\" (JWE Algorithm) header value");
	}
}
var yO = o((() => {
	ZE(), tD(), cD(), hD(), JT(), MD(), Q(), FD(), nO(), uO(), WE(), _O();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/validate_crit.js
function bO(e, t, n, r, i) {
	if (i.crit !== void 0 && r?.crit === void 0) throw new e("\"crit\" (Critical) Header Parameter MUST be integrity protected");
	if (!r || r.crit === void 0) return /* @__PURE__ */ new Set();
	if (!Array.isArray(r.crit) || r.crit.length === 0 || r.crit.some((e) => typeof e != "string" || e.length === 0)) throw new e("\"crit\" (Critical) Header Parameter MUST be an array of non-empty strings when present");
	let a;
	a = n === void 0 ? t : new Map([...Object.entries(n), ...t.entries()]);
	for (let t of r.crit) {
		if (!a.has(t)) throw new eE(`Extension Header Parameter "${t}" is not recognized`);
		if (i[t] === void 0) throw new e(`Extension Header Parameter "${t}" is missing`);
		if (a.get(t) && r[t] === void 0) throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`);
	}
	return new Set(r.crit);
}
var xO = o((() => {
	Q();
})), SO, CO = o((() => {
	SO = (e, t) => {
		if (t !== void 0 && (!Array.isArray(t) || t.some((e) => typeof e != "string"))) throw TypeError(`"${e}" option must be an array of strings`);
		if (t) return new Set(t);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/flattened/decrypt.js
async function wO(e, t, n) {
	if (!UE(e)) throw new Z("Flattened JWE must be an object");
	if (e.protected === void 0 && e.header === void 0 && e.unprotected === void 0) throw new Z("JOSE Header missing");
	if (e.iv !== void 0 && typeof e.iv != "string") throw new Z("JWE Initialization Vector incorrect type");
	if (typeof e.ciphertext != "string") throw new Z("JWE Ciphertext missing or incorrect type");
	if (e.tag !== void 0 && typeof e.tag != "string") throw new Z("JWE Authentication Tag incorrect type");
	if (e.protected !== void 0 && typeof e.protected != "string") throw new Z("JWE Protected Header incorrect type");
	if (e.encrypted_key !== void 0 && typeof e.encrypted_key != "string") throw new Z("JWE Encrypted Key incorrect type");
	if (e.aad !== void 0 && typeof e.aad != "string") throw new Z("JWE AAD incorrect type");
	if (e.header !== void 0 && !UE(e.header)) throw new Z("JWE Shared Unprotected Header incorrect type");
	if (e.unprotected !== void 0 && !UE(e.unprotected)) throw new Z("JWE Per-Recipient Unprotected Header incorrect type");
	let r;
	if (e.protected) try {
		let t = qT(e.protected);
		r = JSON.parse(VT.decode(t));
	} catch {
		throw new Z("JWE Protected Header is invalid");
	}
	if (!BE(r, e.header, e.unprotected)) throw new Z("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
	let i = {
		...r,
		...e.header,
		...e.unprotected
	};
	if (bO(Z, /* @__PURE__ */ new Map(), n?.crit, r, i), i.zip !== void 0) throw new eE("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
	let { alg: a, enc: o } = i;
	if (typeof a != "string" || !a) throw new Z("missing JWE Algorithm (alg) in JWE Header");
	if (typeof o != "string" || !o) throw new Z("missing JWE Encryption Algorithm (enc) in JWE Header");
	let s = n && SO("keyManagementAlgorithms", n.keyManagementAlgorithms), c = n && SO("contentEncryptionAlgorithms", n.contentEncryptionAlgorithms);
	if (s && !s.has(a) || !s && a.startsWith("PBES2")) throw new $T("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (c && !c.has(o)) throw new $T("\"enc\" (Encryption Algorithm) Header Parameter value not allowed");
	let l;
	if (e.encrypted_key !== void 0) try {
		l = qT(e.encrypted_key);
	} catch {
		throw new Z("Failed to base64url decode the encrypted_key");
	}
	let u = !1;
	typeof t == "function" && (t = await t(r, e), u = !0);
	let d;
	try {
		d = await vO(a, t, l, i, n);
	} catch (e) {
		if (e instanceof TypeError || e instanceof Z || e instanceof eE) throw e;
		d = PD(o);
	}
	let f, p;
	if (e.iv !== void 0) try {
		f = qT(e.iv);
	} catch {
		throw new Z("Failed to base64url decode the iv");
	}
	if (e.tag !== void 0) try {
		p = qT(e.tag);
	} catch {
		throw new Z("Failed to base64url decode the tag");
	}
	let m = BT.encode(e.protected ?? ""), h;
	h = e.aad === void 0 ? m : NT(m, BT.encode("."), BT.encode(e.aad));
	let g;
	try {
		g = qT(e.ciphertext);
	} catch {
		throw new Z("Failed to base64url decode the ciphertext");
	}
	let _ = { plaintext: await RE(o, d, g, f, p, h) };
	if (e.protected !== void 0 && (_.protectedHeader = r), e.aad !== void 0) try {
		_.additionalAuthenticatedData = qT(e.aad);
	} catch {
		throw new Z("Failed to base64url decode the aad");
	}
	return e.unprotected !== void 0 && (_.sharedUnprotectedHeader = e.unprotected), e.header !== void 0 && (_.unprotectedHeader = e.header), u ? {
		..._,
		key: t
	} : _;
}
var TO = o((() => {
	JT(), zE(), Q(), VE(), WE(), yO(), UT(), FD(), xO(), CO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/compact/decrypt.js
async function EO(e, t, n) {
	if (e instanceof Uint8Array && (e = VT.decode(e)), typeof e != "string") throw new Z("Compact JWE must be a string or Uint8Array");
	let { 0: r, 1: i, 2: a, 3: o, 4: s, length: c } = e.split(".");
	if (c !== 5) throw new Z("Invalid Compact JWE");
	let l = await wO({
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
var DO = o((() => {
	TO(), Q(), UT();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwe/general/decrypt.js
async function OO(e, t, n) {
	if (!UE(e)) throw new Z("General JWE must be an object");
	if (!Array.isArray(e.recipients) || !e.recipients.every(UE)) throw new Z("JWE Recipients missing or incorrect type");
	if (!e.recipients.length) throw new Z("JWE Recipients has no members");
	for (let r of e.recipients) try {
		return await wO({
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
	throw new tE();
}
var kO = o((() => {
	TO(), Q(), WE();
})), AO, jO = o((() => {
	AO = Symbol();
})), MO, NO = o((() => {
	AT(), ME(), JT(), FE(), MO = async (e) => {
		if (e instanceof Uint8Array) return {
			kty: "oct",
			k: GT(e)
		};
		if (!kT(e)) throw TypeError(jE(e, ...PE, "Uint8Array"));
		if (!e.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
		let { ext: t, key_ops: n, alg: r, use: i, ...a } = await X.subtle.exportKey("jwk", e);
		return a;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/export.js
async function PO(e) {
	return UD(e);
}
async function FO(e) {
	return WD(e);
}
async function IO(e) {
	return MO(e);
}
var LO = o((() => {
	ZD(), NO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/lib/encrypt_key_management.js
async function RO(e, t, n, r, i = {}) {
	let a, o, s;
	switch (cO(e, n, "encrypt"), n = await jD.normalizePublicKey?.(n, e) || n, e) {
		case "dir":
			s = n;
			break;
		case "ECDH-ES":
		case "ECDH-ES+A128KW":
		case "ECDH-ES+A192KW":
		case "ECDH-ES+A256KW": {
			if (!eD(n)) throw new eE("ECDH with the provided key is not allowed or not supported by your javascript runtime");
			let { apu: c, apv: l } = i, { epk: u } = i;
			u ||= (await $E(n)).privateKey;
			let { x: d, y: f, crv: p, kty: m } = await IO(u), h = await QE(n, u, e === "ECDH-ES" ? t : e, e === "ECDH-ES" ? ND(t) : parseInt(e.slice(-5, -2), 10), c, l);
			if (o = { epk: {
				x: d,
				crv: p,
				kty: m
			} }, m === "EC" && (o.epk.y = f), c && (o.apu = GT(c)), l && (o.apv = GT(l)), e === "ECDH-ES") {
				s = h;
				break;
			}
			s = r || PD(t), a = await YE(e.slice(-6), h, s);
			break;
		}
		case "RSA1_5":
		case "RSA-OAEP":
		case "RSA-OAEP-256":
		case "RSA-OAEP-384":
		case "RSA-OAEP-512":
			s = r || PD(t), a = await pD(e, n, s);
			break;
		case "PBES2-HS256+A128KW":
		case "PBES2-HS384+A192KW":
		case "PBES2-HS512+A256KW": {
			s = r || PD(t);
			let { p2c: c, p2s: l } = i;
			({encryptedKey: a, ...o} = await oD(e, n, s, c, l));
			break;
		}
		case "A128KW":
		case "A192KW":
		case "A256KW":
			s = r || PD(t), a = await YE(e, n, s);
			break;
		case "A128GCMKW":
		case "A192GCMKW":
		case "A256GCMKW": {
			s = r || PD(t);
			let { iv: c } = i;
			({encryptedKey: a, ...o} = await hO(e, n, s, c));
			break;
		}
		default: throw new eE("Invalid or unsupported \"alg\" (JWE Algorithm) header value");
	}
	return {
		cek: s,
		encryptedKey: a,
		parameters: o
	};
}
var zO = o((() => {
	ZE(), tD(), cD(), hD(), JT(), MD(), FD(), Q(), LO(), uO(), _O();
})), BO, VO = o((() => {
	JT(), jO(), mO(), zO(), Q(), VE(), UT(), xO(), BO = class {
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
			if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) throw new Z("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
			if (!BE(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) throw new Z("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
			let n = {
				...this._protectedHeader,
				...this._unprotectedHeader,
				...this._sharedUnprotectedHeader
			};
			if (bO(Z, /* @__PURE__ */ new Map(), t?.crit, this._protectedHeader, n), n.zip !== void 0) throw new eE("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
			let { alg: r, enc: i } = n;
			if (typeof r != "string" || !r) throw new Z("JWE \"alg\" (Algorithm) Header Parameter missing or invalid");
			if (typeof i != "string" || !i) throw new Z("JWE \"enc\" (Encryption Algorithm) Header Parameter missing or invalid");
			let a;
			if (this._cek && (r === "dir" || r === "ECDH-ES")) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${r}`);
			let o;
			{
				let n;
				({cek: o, encryptedKey: a, parameters: n} = await RO(r, i, e, this._cek, this._keyManagementParameters)), n && (t && AO in t ? this._unprotectedHeader ? this._unprotectedHeader = {
					...this._unprotectedHeader,
					...n
				} : this.setUnprotectedHeader(n) : this._protectedHeader ? this._protectedHeader = {
					...this._protectedHeader,
					...n
				} : this.setProtectedHeader(n));
			}
			let s, c, l;
			c = this._protectedHeader ? BT.encode(GT(JSON.stringify(this._protectedHeader))) : BT.encode(""), this._aad ? (l = GT(this._aad), s = NT(c, BT.encode("."), BT.encode(l))) : s = c;
			let { ciphertext: u, tag: d, iv: f } = await pO(i, this._plaintext, o, this._iv, s), p = { ciphertext: GT(u) };
			return f && (p.iv = GT(f)), d && (p.tag = GT(d)), a && (p.encrypted_key = GT(a)), l && (p.aad = l), this._protectedHeader && (p.protected = VT.decode(c)), this._sharedUnprotectedHeader && (p.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (p.header = this._unprotectedHeader), p;
		}
	};
})), HO, UO, WO = o((() => {
	VO(), jO(), Q(), FD(), VE(), zO(), JT(), xO(), HO = class {
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
	}, UO = class {
		constructor(e) {
			this._recipients = [], this._plaintext = e;
		}
		addRecipient(e, t) {
			let n = new HO(this, e, { crit: t?.crit });
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
			if (!this._recipients.length) throw new Z("at least one recipient must be added");
			if (this._recipients.length === 1) {
				let [e] = this._recipients, t = await new BO(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(e.unprotectedHeader).encrypt(e.key, { ...e.options }), n = {
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
				if (!BE(this._protectedHeader, this._unprotectedHeader, n.unprotectedHeader)) throw new Z("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
				let r = {
					...this._protectedHeader,
					...this._unprotectedHeader,
					...n.unprotectedHeader
				}, { alg: i } = r;
				if (typeof i != "string" || !i) throw new Z("JWE \"alg\" (Algorithm) Header Parameter missing or invalid");
				if (i === "dir" || i === "ECDH-ES") throw new Z("\"dir\" and \"ECDH-ES\" alg may only be used with a single recipient");
				if (typeof r.enc != "string" || !r.enc) throw new Z("JWE \"enc\" (Encryption Algorithm) Header Parameter missing or invalid");
				if (!e) e = r.enc;
				else if (e !== r.enc) throw new Z("JWE \"enc\" (Encryption Algorithm) Header Parameter must be the same for all recipients");
				if (bO(Z, /* @__PURE__ */ new Map(), n.options.crit, this._protectedHeader, r), r.zip !== void 0) throw new eE("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
			}
			let t = PD(e), n = {
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
					let e = await new BO(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(t).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(i.unprotectedHeader).setKeyManagementParameters({ p2c: o }).encrypt(i.key, {
						...i.options,
						[AO]: !0
					});
					n.ciphertext = e.ciphertext, n.iv = e.iv, n.tag = e.tag, e.aad && (n.aad = e.aad), e.protected && (n.protected = e.protected), e.unprotected && (n.unprotected = e.unprotected), a.encrypted_key = e.encrypted_key, e.header && (a.header = e.header);
					continue;
				}
				let { encryptedKey: s, parameters: c } = await RO(i.unprotectedHeader?.alg || this._protectedHeader?.alg || this._unprotectedHeader?.alg, e, i.key, t, { p2c: o });
				a.encrypted_key = GT(s), (i.unprotectedHeader || c) && (a.header = {
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
function GO(e, t) {
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
		default: throw new eE(`alg ${e} is not supported either by JOSE or your javascript runtime`);
	}
}
var KO = o((() => {
	Q();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
async function qO(e, t, n) {
	if (n === "sign" && (t = await jD.normalizePrivateKey(t, e)), n === "verify" && (t = await jD.normalizePublicKey(t, e)), kT(t)) return EE(t, e, n), t;
	if (t instanceof Uint8Array) {
		if (!e.startsWith("HS")) throw TypeError(jE(t, ...PE));
		return X.subtle.importKey("raw", t, {
			hash: `SHA-${e.slice(-3)}`,
			name: "HMAC"
		}, !1, [n]);
	}
	throw TypeError(jE(t, ...PE, "Uint8Array", "JSON Web Key"));
}
var JO = o((() => {
	AT(), OE(), ME(), FE(), MD();
})), YO, XO = o((() => {
	KO(), AT(), fD(), JO(), YO = async (e, t, n, r) => {
		let i = await qO(e, t, "verify");
		dD(e, i);
		let a = GO(e, i.algorithm);
		try {
			return await X.subtle.verify(a, i, n, r);
		} catch {
			return !1;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/flattened/verify.js
async function ZO(e, t, n) {
	if (!UE(e)) throw new nE("Flattened JWS must be an object");
	if (e.protected === void 0 && e.header === void 0) throw new nE("Flattened JWS must have either of the \"protected\" or \"header\" members");
	if (e.protected !== void 0 && typeof e.protected != "string") throw new nE("JWS Protected Header incorrect type");
	if (e.payload === void 0) throw new nE("JWS Payload missing");
	if (typeof e.signature != "string") throw new nE("JWS Signature missing or incorrect type");
	if (e.header !== void 0 && !UE(e.header)) throw new nE("JWS Unprotected Header incorrect type");
	let r = {};
	if (e.protected) try {
		let t = qT(e.protected);
		r = JSON.parse(VT.decode(t));
	} catch {
		throw new nE("JWS Protected Header is invalid");
	}
	if (!BE(r, e.header)) throw new nE("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
	let i = {
		...r,
		...e.header
	}, a = bO(nE, /* @__PURE__ */ new Map([["b64", !0]]), n?.crit, r, i), o = !0;
	if (a.has("b64") && (o = r.b64, typeof o != "boolean")) throw new nE("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
	let { alg: s } = i;
	if (typeof s != "string" || !s) throw new nE("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
	let c = n && SO("algorithms", n.algorithms);
	if (c && !c.has(s)) throw new $T("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (o) {
		if (typeof e.payload != "string") throw new nE("JWS Payload must be a string");
	} else if (typeof e.payload != "string" && !(e.payload instanceof Uint8Array)) throw new nE("JWS Payload must be a string or an Uint8Array instance");
	let l = !1;
	typeof t == "function" ? (t = await t(r, e), l = !0, lO(s, t, "verify"), gD(t) && (t = await tO(t, s))) : lO(s, t, "verify");
	let u = NT(BT.encode(e.protected ?? ""), BT.encode("."), typeof e.payload == "string" ? BT.encode(e.payload) : e.payload), d;
	try {
		d = qT(e.signature);
	} catch {
		throw new nE("Failed to base64url decode the signature");
	}
	if (!await YO(s, t, d, u)) throw new lE();
	let f;
	if (o) try {
		f = qT(e.payload);
	} catch {
		throw new nE("Failed to base64url decode the payload");
	}
	else f = typeof e.payload == "string" ? BT.encode(e.payload) : e.payload;
	let p = { payload: f };
	return e.protected !== void 0 && (p.protectedHeader = r), e.header !== void 0 && (p.unprotectedHeader = e.header), l ? {
		...p,
		key: t
	} : p;
}
var QO = o((() => {
	JT(), XO(), Q(), UT(), VE(), WE(), uO(), xO(), CO(), bD(), nO();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/compact/verify.js
async function $O(e, t, n) {
	if (e instanceof Uint8Array && (e = VT.decode(e)), typeof e != "string") throw new nE("Compact JWS must be a string or Uint8Array");
	let { 0: r, 1: i, 2: a, length: o } = e.split(".");
	if (o !== 3) throw new nE("Invalid Compact JWS");
	let s = await ZO({
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
var ek = o((() => {
	QO(), Q(), UT();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jws/general/verify.js
async function tk(e, t, n) {
	if (!UE(e)) throw new nE("General JWS must be an object");
	if (!Array.isArray(e.signatures) || !e.signatures.every(UE)) throw new nE("JWS Signatures missing or incorrect type");
	for (let r of e.signatures) try {
		return await ZO({
			header: r.header,
			payload: e.payload,
			protected: r.protected,
			signature: r.signature
		}, t, n);
	} catch {}
	throw new lE();
}
var nk = o((() => {
	QO(), Q(), WE();
})), rk, ik = o((() => {
	rk = (e) => Math.floor(e.getTime() / 1e3);
})), ak, ok, sk, ck, lk, uk, dk, fk = o((() => {
	ak = 60, ok = ak * 60, sk = ok * 24, ck = sk * 7, lk = sk * 365.25, uk = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, dk = (e) => {
		let t = uk.exec(e);
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
				i = Math.round(n * ak);
				break;
			case "hour":
			case "hours":
			case "hr":
			case "hrs":
			case "h":
				i = Math.round(n * ok);
				break;
			case "day":
			case "days":
			case "d":
				i = Math.round(n * sk);
				break;
			case "week":
			case "weeks":
			case "w":
				i = Math.round(n * ck);
				break;
			default:
				i = Math.round(n * lk);
				break;
		}
		return t[1] === "-" || t[4] === "ago" ? -i : i;
	};
})), pk, mk, hk, gk = o((() => {
	Q(), UT(), ik(), fk(), WE(), pk = (e) => e.toLowerCase().replace(/^application\//, ""), mk = (e, t) => typeof e == "string" ? t.includes(e) : Array.isArray(e) ? t.some(Set.prototype.has.bind(new Set(e))) : !1, hk = (e, t, n = {}) => {
		let r;
		try {
			r = JSON.parse(VT.decode(t));
		} catch {}
		if (!UE(r)) throw new rE("JWT Claims Set must be a top-level JSON object");
		let { typ: i } = n;
		if (i && (typeof e.typ != "string" || pk(e.typ) !== pk(i))) throw new ZT("unexpected \"typ\" JWT header value", r, "typ", "check_failed");
		let { requiredClaims: a = [], issuer: o, subject: s, audience: c, maxTokenAge: l } = n, u = [...a];
		l !== void 0 && u.push("iat"), c !== void 0 && u.push("aud"), s !== void 0 && u.push("sub"), o !== void 0 && u.push("iss");
		for (let e of new Set(u.reverse())) if (!(e in r)) throw new ZT(`missing required "${e}" claim`, r, e, "missing");
		if (o && !(Array.isArray(o) ? o : [o]).includes(r.iss)) throw new ZT("unexpected \"iss\" claim value", r, "iss", "check_failed");
		if (s && r.sub !== s) throw new ZT("unexpected \"sub\" claim value", r, "sub", "check_failed");
		if (c && !mk(r.aud, typeof c == "string" ? [c] : c)) throw new ZT("unexpected \"aud\" claim value", r, "aud", "check_failed");
		let d;
		switch (typeof n.clockTolerance) {
			case "string":
				d = dk(n.clockTolerance);
				break;
			case "number":
				d = n.clockTolerance;
				break;
			case "undefined":
				d = 0;
				break;
			default: throw TypeError("Invalid clockTolerance option type");
		}
		let { currentDate: f } = n, p = rk(f || /* @__PURE__ */ new Date());
		if ((r.iat !== void 0 || l) && typeof r.iat != "number") throw new ZT("\"iat\" claim must be a number", r, "iat", "invalid");
		if (r.nbf !== void 0) {
			if (typeof r.nbf != "number") throw new ZT("\"nbf\" claim must be a number", r, "nbf", "invalid");
			if (r.nbf > p + d) throw new ZT("\"nbf\" claim timestamp check failed", r, "nbf", "check_failed");
		}
		if (r.exp !== void 0) {
			if (typeof r.exp != "number") throw new ZT("\"exp\" claim must be a number", r, "exp", "invalid");
			if (r.exp <= p - d) throw new QT("\"exp\" claim timestamp check failed", r, "exp", "check_failed");
		}
		if (l) {
			let e = p - r.iat, t = typeof l == "number" ? l : dk(l);
			if (e - d > t) throw new QT("\"iat\" claim timestamp check failed (too far in the past)", r, "iat", "check_failed");
			if (e < 0 - d) throw new ZT("\"iat\" claim timestamp check failed (it should be in the past)", r, "iat", "check_failed");
		}
		return r;
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/verify.js
async function _k(e, t, n) {
	let r = await $O(e, t, n);
	if (r.protectedHeader.crit?.includes("b64") && r.protectedHeader.b64 === !1) throw new rE("JWTs MUST NOT use unencoded payload");
	let i = {
		payload: hk(r.protectedHeader, r.payload, n),
		protectedHeader: r.protectedHeader
	};
	return typeof t == "function" ? {
		...i,
		key: r.key
	} : i;
}
var vk = o((() => {
	ek(), gk(), Q();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/decrypt.js
async function yk(e, t, n) {
	let r = await EO(e, t, n), i = hk(r.protectedHeader, r.plaintext, n), { protectedHeader: a } = r;
	if (a.iss !== void 0 && a.iss !== i.iss) throw new ZT("replicated \"iss\" claim header parameter mismatch", i, "iss", "mismatch");
	if (a.sub !== void 0 && a.sub !== i.sub) throw new ZT("replicated \"sub\" claim header parameter mismatch", i, "sub", "mismatch");
	if (a.aud !== void 0 && JSON.stringify(a.aud) !== JSON.stringify(i.aud)) throw new ZT("replicated \"aud\" claim header parameter mismatch", i, "aud", "mismatch");
	let o = {
		payload: i,
		protectedHeader: a
	};
	return typeof t == "function" ? {
		...o,
		key: r.key
	} : o;
}
var bk = o((() => {
	DO(), gk(), Q();
})), xk, Sk = o((() => {
	VO(), xk = class {
		constructor(e) {
			this._flattened = new BO(e);
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
})), Ck, wk = o((() => {
	KO(), AT(), fD(), JO(), Ck = async (e, t, n) => {
		let r = await qO(e, t, "sign");
		dD(e, r);
		let i = await X.subtle.sign(GO(e, r.algorithm), r, n);
		return new Uint8Array(i);
	};
})), Tk, Ek = o((() => {
	JT(), wk(), VE(), Q(), UT(), uO(), xO(), Tk = class {
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
			if (!this._protectedHeader && !this._unprotectedHeader) throw new nE("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
			if (!BE(this._protectedHeader, this._unprotectedHeader)) throw new nE("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
			let n = {
				...this._protectedHeader,
				...this._unprotectedHeader
			}, r = bO(nE, /* @__PURE__ */ new Map([["b64", !0]]), t?.crit, this._protectedHeader, n), i = !0;
			if (r.has("b64") && (i = this._protectedHeader.b64, typeof i != "boolean")) throw new nE("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
			let { alg: a } = n;
			if (typeof a != "string" || !a) throw new nE("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
			lO(a, e, "sign");
			let o = this._payload;
			i && (o = BT.encode(GT(o)));
			let s;
			s = this._protectedHeader ? BT.encode(GT(JSON.stringify(this._protectedHeader))) : BT.encode("");
			let c = {
				signature: GT(await Ck(a, e, NT(s, BT.encode("."), o))),
				payload: ""
			};
			return i && (c.payload = VT.decode(o)), this._unprotectedHeader && (c.header = this._unprotectedHeader), this._protectedHeader && (c.protected = VT.decode(s)), c;
		}
	};
})), Dk, Ok = o((() => {
	Ek(), Dk = class {
		constructor(e) {
			this._flattened = new Tk(e);
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
})), kk, Ak, jk = o((() => {
	Ek(), Q(), kk = class {
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
	}, Ak = class {
		constructor(e) {
			this._signatures = [], this._payload = e;
		}
		addSignature(e, t) {
			let n = new kk(this, e, t);
			return this._signatures.push(n), n;
		}
		async sign() {
			if (!this._signatures.length) throw new nE("at least one signature must be added");
			let e = {
				signatures: [],
				payload: ""
			};
			for (let t = 0; t < this._signatures.length; t++) {
				let n = this._signatures[t], r = new Tk(this._payload);
				r.setProtectedHeader(n.protectedHeader), r.setUnprotectedHeader(n.unprotectedHeader);
				let { payload: i, ...a } = await r.sign(n.key, n.options);
				if (t === 0) e.payload = i;
				else if (e.payload !== i) throw new nE("inconsistent use of JWS Unencoded Payload (RFC7797)");
				e.signatures.push(a);
			}
			return e;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwt/produce.js
function Mk(e, t) {
	if (!Number.isFinite(t)) throw TypeError(`Invalid ${e} input`);
	return t;
}
var Nk, Pk = o((() => {
	ik(), WE(), fk(), Nk = class {
		constructor(e = {}) {
			if (!UE(e)) throw TypeError("JWT Claims Set MUST be an object");
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
				nbf: Mk("setNotBefore", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				nbf: Mk("setNotBefore", rk(e))
			} : this._payload = {
				...this._payload,
				nbf: rk(/* @__PURE__ */ new Date()) + dk(e)
			}, this;
		}
		setExpirationTime(e) {
			return typeof e == "number" ? this._payload = {
				...this._payload,
				exp: Mk("setExpirationTime", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				exp: Mk("setExpirationTime", rk(e))
			} : this._payload = {
				...this._payload,
				exp: rk(/* @__PURE__ */ new Date()) + dk(e)
			}, this;
		}
		setIssuedAt(e) {
			return e === void 0 ? this._payload = {
				...this._payload,
				iat: rk(/* @__PURE__ */ new Date())
			} : e instanceof Date ? this._payload = {
				...this._payload,
				iat: Mk("setIssuedAt", rk(e))
			} : typeof e == "string" ? this._payload = {
				...this._payload,
				iat: Mk("setIssuedAt", rk(/* @__PURE__ */ new Date()) + dk(e))
			} : this._payload = {
				...this._payload,
				iat: Mk("setIssuedAt", e)
			}, this;
		}
	};
})), Fk, Ik = o((() => {
	Ok(), Q(), UT(), Pk(), Fk = class extends Nk {
		setProtectedHeader(e) {
			return this._protectedHeader = e, this;
		}
		async sign(e, t) {
			let n = new Dk(BT.encode(JSON.stringify(this._payload)));
			if (n.setProtectedHeader(this._protectedHeader), Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1) throw new rE("JWTs MUST NOT use unencoded payload");
			return n.sign(e, t);
		}
	};
})), Lk, Rk = o((() => {
	Sk(), UT(), Pk(), Lk = class extends Nk {
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
			let n = new xk(BT.encode(JSON.stringify(this._payload)));
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
async function zk(e, t) {
	if (!UE(e)) throw TypeError("JWK must be an object");
	if (t ??= "sha256", t !== "sha256" && t !== "sha384" && t !== "sha512") throw TypeError("digestAlgorithm must one of \"sha256\", \"sha384\", or \"sha512\"");
	let n;
	switch (e.kty) {
		case "EC":
			Vk(e.crv, "\"crv\" (Curve) Parameter"), Vk(e.x, "\"x\" (X Coordinate) Parameter"), Vk(e.y, "\"y\" (Y Coordinate) Parameter"), n = {
				crv: e.crv,
				kty: e.kty,
				x: e.x,
				y: e.y
			};
			break;
		case "OKP":
			Vk(e.crv, "\"crv\" (Subtype of Key Pair) Parameter"), Vk(e.x, "\"x\" (Public Key) Parameter"), n = {
				crv: e.crv,
				kty: e.kty,
				x: e.x
			};
			break;
		case "RSA":
			Vk(e.e, "\"e\" (Exponent) Parameter"), Vk(e.n, "\"n\" (Modulus) Parameter"), n = {
				e: e.e,
				kty: e.kty,
				n: e.n
			};
			break;
		case "oct":
			Vk(e.k, "\"k\" (Key Value) Parameter"), n = {
				k: e.k,
				kty: e.kty
			};
			break;
		default: throw new eE("\"kty\" (Key Type) Parameter missing or unsupported");
	}
	let r = BT.encode(JSON.stringify(n));
	return GT(await jT(t, r));
}
async function Bk(e, t) {
	t ??= "sha256";
	let n = await zk(e, t);
	return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${n}`;
}
var Vk, Hk = o((() => {
	MT(), JT(), Q(), UT(), WE(), Vk = (e, t) => {
		if (typeof e != "string" || !e) throw new iE(`${t} missing or invalid`);
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwk/embedded.js
async function Uk(e, t) {
	let n = {
		...e,
		...t?.header
	};
	if (!UE(n.jwk)) throw new nE("\"jwk\" (JSON Web Key) Header Parameter must be a JSON object");
	let r = await tO({
		...n.jwk,
		ext: !0
	}, n.alg);
	if (r instanceof Uint8Array || r.type !== "public") throw new nE("\"jwk\" (JSON Web Key) Header Parameter must be a public key");
	return r;
}
var Wk = o((() => {
	nO(), WE(), Q();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwks/local.js
function Gk(e) {
	switch (typeof e == "string" && e.slice(0, 2)) {
		case "RS":
		case "PS": return "RSA";
		case "ES": return "EC";
		case "Ed": return "OKP";
		default: throw new eE("Unsupported \"alg\" value for a JSON Web Key Set");
	}
}
function Kk(e) {
	return e && typeof e == "object" && Array.isArray(e.keys) && e.keys.every(qk);
}
function qk(e) {
	return UE(e);
}
function Jk(e) {
	return typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
async function Yk(e, t, n) {
	let r = e.get(t) || e.set(t, {}).get(t);
	if (r[n] === void 0) {
		let e = await tO({
			...t,
			ext: !0
		}, n);
		if (e instanceof Uint8Array || e.type !== "public") throw new aE("JSON Web Key Set members must be public keys");
		r[n] = e;
	}
	return r[n];
}
function Xk(e) {
	let t = new Zk(e), n = async (e, n) => t.getKey(e, n);
	return Object.defineProperties(n, { jwks: {
		value: () => Jk(t._jwks),
		enumerable: !0,
		configurable: !1,
		writable: !1
	} }), n;
}
var Zk, Qk = o((() => {
	nO(), Q(), WE(), Zk = class {
		constructor(e) {
			if (this._cached = /* @__PURE__ */ new WeakMap(), !Kk(e)) throw new aE("JSON Web Key Set malformed");
			this._jwks = Jk(e);
		}
		async getKey(e, t) {
			let { alg: n, kid: r } = {
				...e,
				...t?.header
			}, i = Gk(n), a = this._jwks.keys.filter((e) => {
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
			if (s === 0) throw new oE();
			if (s !== 1) {
				let e = new sE(), { _cached: t } = this;
				throw e[Symbol.asyncIterator] = async function* () {
					for (let e of a) try {
						yield await Yk(t, e, n);
					} catch {}
				}, e;
			}
			return Yk(this._cached, o, n);
		}
	};
})), $k, eA = o((() => {
	Q(), $k = async (e, t, n) => {
		let r, i, a = !1;
		typeof AbortController == "function" && (r = new AbortController(), i = setTimeout(() => {
			a = !0, r.abort();
		}, t));
		let o = await fetch(e.href, {
			signal: r ? r.signal : void 0,
			redirect: "manual",
			headers: n.headers
		}).catch((e) => {
			throw a ? new cE() : e;
		});
		if (i !== void 0 && clearTimeout(i), o.status !== 200) throw new XT("Expected 200 OK from the JSON Web Key Set HTTP response");
		try {
			return await o.json();
		} catch {
			throw new XT("Failed to parse the JSON Web Key Set HTTP response as JSON");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/jwks/remote.js
function tA() {
	return typeof WebSocketPair < "u" || typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime < "u" && EdgeRuntime === "vercel";
}
function nA(e, t) {
	return !(typeof e != "object" || !e || !("uat" in e) || typeof e.uat != "number" || Date.now() - e.uat >= t || !("jwks" in e) || !UE(e.jwks) || !Array.isArray(e.jwks.keys) || !Array.prototype.every.call(e.jwks.keys, UE));
}
function rA(e, t) {
	let n = new oA(e, t), r = async (e, t) => n.getKey(e, t);
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
var iA, aA, oA, sA, cA = o((() => {
	eA(), Q(), Qk(), WE(), (typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (iA = "jose/v5.10.0"), aA = Symbol(), oA = class {
		constructor(e, t) {
			if (!(e instanceof URL)) throw TypeError("url must be an instance of URL");
			this._url = new URL(e.href), this._options = {
				agent: t?.agent,
				headers: t?.headers
			}, this._timeoutDuration = typeof t?.timeoutDuration == "number" ? t?.timeoutDuration : 5e3, this._cooldownDuration = typeof t?.cooldownDuration == "number" ? t?.cooldownDuration : 3e4, this._cacheMaxAge = typeof t?.cacheMaxAge == "number" ? t?.cacheMaxAge : 6e5, t?.[aA] !== void 0 && (this._cache = t?.[aA], nA(t?.[aA], this._cacheMaxAge) && (this._jwksTimestamp = this._cache.uat, this._local = Xk(this._cache.jwks)));
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
				if (n instanceof oE && this.coolingDown() === !1) return await this.reload(), this._local(e, t);
				throw n;
			}
		}
		async reload() {
			this._pendingFetch && tA() && (this._pendingFetch = void 0);
			let e = new Headers(this._options.headers);
			iA && !e.has("User-Agent") && (e.set("User-Agent", iA), this._options.headers = Object.fromEntries(e.entries())), this._pendingFetch ||= $k(this._url, this._timeoutDuration, this._options).then((e) => {
				this._local = Xk(e), this._cache && (this._cache.uat = Date.now(), this._cache.jwks = e), this._jwksTimestamp = Date.now(), this._pendingFetch = void 0;
			}).catch((e) => {
				throw this._pendingFetch = void 0, e;
			}), await this._pendingFetch;
		}
	}, sA = aA;
})), lA, uA = o((() => {
	JT(), UT(), Q(), gk(), Pk(), lA = class extends Nk {
		encode() {
			return `${GT(JSON.stringify({ alg: "none" }))}.${GT(JSON.stringify(this._payload))}.`;
		}
		static decode(e, t) {
			if (typeof e != "string") throw new rE("Unsecured JWT must be a string");
			let { 0: n, 1: r, 2: i, length: a } = e.split(".");
			if (a !== 3 || i !== "") throw new rE("Invalid Unsecured JWT");
			let o;
			try {
				if (o = JSON.parse(VT.decode(qT(n))), o.alg !== "none") throw Error();
			} catch {
				throw new rE("Invalid Unsecured JWT");
			}
			return {
				payload: hk(o, qT(r), t),
				header: o
			};
		}
	};
})), dA = /* @__PURE__ */ c({
	decode: () => pA,
	encode: () => fA
}), fA, pA, mA = o((() => {
	JT(), fA = GT, pA = qT;
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/util/decode_protected_header.js
function hA(e) {
	let t;
	if (typeof e == "string") {
		let n = e.split(".");
		(n.length === 3 || n.length === 5) && ([t] = n);
	} else if (typeof e == "object" && e) if ("protected" in e) t = e.protected;
	else throw TypeError("Token does not contain a Protected Header");
	try {
		if (typeof t != "string" || !t) throw Error();
		let e = JSON.parse(VT.decode(pA(t)));
		if (!UE(e)) throw Error();
		return e;
	} catch {
		throw TypeError("Invalid Token or Protected Header formatting");
	}
}
var gA = o((() => {
	mA(), UT(), WE();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/util/decode_jwt.js
function _A(e) {
	if (typeof e != "string") throw new rE("JWTs must use Compact JWS serialization, JWT must be a string");
	let { 1: t, length: n } = e.split(".");
	if (n === 5) throw new rE("Only JWTs using Compact JWS serialization can be decoded");
	if (n !== 3) throw new rE("Invalid JWT");
	if (!t) throw new rE("JWTs must contain a payload");
	let r;
	try {
		r = pA(t);
	} catch {
		throw new rE("Failed to base64url decode the payload");
	}
	let i;
	try {
		i = JSON.parse(VT.decode(r));
	} catch {
		throw new rE("Failed to parse the decoded payload as JSON");
	}
	if (!UE(i)) throw new rE("Invalid JWT Claims Set");
	return i;
}
var vA = o((() => {
	mA(), UT(), WE(), Q();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/runtime/generate.js
async function yA(e, t) {
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
		case "A256CBC-HS512": return n = parseInt(e.slice(-3), 10), uE(new Uint8Array(n >> 3));
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
		default: throw new eE("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	}
	return X.subtle.generateKey(r, t?.extractable ?? !1, i);
}
function bA(e) {
	let t = e?.modulusLength ?? 2048;
	if (typeof t != "number" || t < 2048) throw new eE("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
	return t;
}
async function xA(e, t) {
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
				modulusLength: bA(t)
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
				modulusLength: bA(t)
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
				modulusLength: bA(t)
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
				default: throw new eE("Invalid or unsupported crv option provided");
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
				default: throw new eE("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
			}
			break;
		}
		default: throw new eE("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	}
	return X.subtle.generateKey(n, t?.extractable ?? !1, r);
}
var SA = o((() => {
	AT(), Q(), dE();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/generate_key_pair.js
async function CA(e, t) {
	return xA(e, t);
}
var wA = o((() => {
	SA();
}));
//#endregion
//#region node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/browser/key/generate_secret.js
async function TA(e, t) {
	return yA(e, t);
}
var EA = o((() => {
	SA();
})), DA, OA = o((() => {
	DA = "WebCryptoAPI";
})), kA, AA = o((() => {
	OA(), kA = DA;
})), jA = /* @__PURE__ */ c({
	CompactEncrypt: () => xk,
	CompactSign: () => Dk,
	EmbeddedJWK: () => Uk,
	EncryptJWT: () => Lk,
	FlattenedEncrypt: () => BO,
	FlattenedSign: () => Tk,
	GeneralEncrypt: () => UO,
	GeneralSign: () => Ak,
	SignJWT: () => Fk,
	UnsecuredJWT: () => lA,
	base64url: () => dA,
	calculateJwkThumbprint: () => zk,
	calculateJwkThumbprintUri: () => Bk,
	compactDecrypt: () => EO,
	compactVerify: () => $O,
	createLocalJWKSet: () => Xk,
	createRemoteJWKSet: () => rA,
	cryptoRuntime: () => kA,
	decodeJwt: () => _A,
	decodeProtectedHeader: () => hA,
	errors: () => YT,
	experimental_jwksCache: () => sA,
	exportJWK: () => IO,
	exportPKCS8: () => FO,
	exportSPKI: () => PO,
	flattenedDecrypt: () => wO,
	flattenedVerify: () => ZO,
	generalDecrypt: () => OO,
	generalVerify: () => tk,
	generateKeyPair: () => CA,
	generateSecret: () => TA,
	importJWK: () => tO,
	importPKCS8: () => eO,
	importSPKI: () => QD,
	importX509: () => $D,
	jwksCache: () => aA,
	jwtDecrypt: () => yk,
	jwtVerify: () => _k
}), MA = o((() => {
	DO(), TO(), kO(), WO(), ek(), QO(), nk(), vk(), bk(), Sk(), VO(), Ok(), Ek(), jk(), Ik(), Rk(), Hk(), Wk(), Qk(), cA(), uA(), LO(), nO(), gA(), vA(), Q(), wA(), EA(), mA(), AA();
})), NA = /* @__PURE__ */ s(((e, t) => {
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
	var u = (MA(), c(jA)), d = "https://oidc.vercel.com", f = new URL("https://oidc.vercel.com/.well-known/jwks"), p = ["RS256"], m = (0, u.createRemoteJWKSet)(f);
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
})), PA = /* @__PURE__ */ s(((e, t) => {
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
})), FA = /* @__PURE__ */ s(((e, t) => {
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
	var u = OT(), d = NA(), f = PA();
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
})), IA = /* @__PURE__ */ s(((e, t) => {
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
})), LA = /* @__PURE__ */ s(((e) => {
	var t = IA();
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
})), RA = /* @__PURE__ */ s(((e, t) => {
	t.exports = LA();
})), zA = /* @__PURE__ */ s(((e, t) => {
	var n = RA();
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
})), BA = FA(), VA = /* @__PURE__ */ u(zA(), 1), HA = globalThis.fetch.bind(globalThis), UA = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
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
})))(), 1), WA = new Promise((e) => {
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
async function GA(e) {
	if (e instanceof ReadableStream) return e;
	if (e instanceof Blob) return e.stream();
	if (KA(e)) return DT.toWeb(e);
	let t;
	return t = e instanceof ArrayBuffer ? new Uint8Array(e) : JA(e) ? e : qA(e), await WA ? new Blob([t]).stream() : new ReadableStream({ start(e) {
		e.enqueue(t), e.close();
	} });
}
function KA(e) {
	return typeof e == "object" && typeof e.pipe == "function" && e.readable && typeof e._read == "function" && typeof e._readableState == "object";
}
function qA(e) {
	return new TextEncoder().encode(e);
}
function JA(e) {
	return (0, ET.default)(e);
}
async function YA() {
	try {
		let e = (await (0, BA.getVercelOidcToken)()).trim();
		return e === "" ? void 0 : e;
	} catch {
		return;
	}
}
var XA = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i, ZA = {
	b: 1,
	kb: 1024,
	mb: 1 << 20,
	gb: 1 << 30,
	tb: 1024 ** 4,
	pb: 1024 ** 5
};
function QA(e) {
	if (typeof e == "number" && !Number.isNaN(e)) return e;
	if (typeof e != "string") return null;
	let t = XA.exec(e), n, r = "b";
	if (!t) n = parseInt(e, 10);
	else {
		let [, e, , , i] = t;
		if (!e) return null;
		n = parseFloat(e), i && (r = i.toLowerCase());
	}
	return Number.isNaN(n) ? null : Math.floor(ZA[r] * n);
}
var $A = "https://vercel.com/api/blob";
function ej(e) {
	try {
		let t = process.env[e];
		return typeof t == "string" && t.trim() !== "" ? t.trim() : void 0;
	} catch {
		return;
	}
}
function tj(e) {
	let [, , , t = ""] = e.split("_");
	return t;
}
function nj(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = 4 - t.length % 4;
	if (n !== 4 && (t += "=".repeat(n)), typeof atob == "function") return atob(t);
	if (typeof Buffer < "u") return Buffer.from(t, "base64").toString("utf8");
	throw new $("Cannot decode base64: no atob or Buffer available.");
}
function rj(e) {
	let t = e.indexOf(".");
	if (t < 0) throw new $("Invalid delegation token format.");
	let n = e.slice(0, t), r;
	try {
		r = JSON.parse(nj(n));
	} catch {
		throw new $("Invalid delegation token payload.");
	}
	if (!r.storeId || typeof r.storeId != "string") throw new $("Delegation token payload is missing `storeId`.");
	return ij(r.storeId);
}
function ij(e) {
	return e.startsWith("store_") ? e.slice(6) : e;
}
async function aj(e) {
	if (e?.presignedUrlPayload) return {
		kind: "presigned",
		storeId: rj(e.presignedUrlPayload.delegationToken)
	};
	if (e?.token) {
		let t = tj(e.token);
		return {
			kind: "readWrite",
			token: e.token,
			storeId: t
		};
	}
	let t = (e?.oidcToken)?.trim(), n = t || await YA();
	if (n) {
		let r = (e?.storeId)?.trim();
		if (r) return {
			kind: "oidc",
			token: n,
			storeId: ij(r)
		};
		let i = ej("BLOB_STORE_ID");
		if (i) return {
			kind: "oidc",
			token: n,
			storeId: ij(i)
		};
		if (t) throw new $("oidcToken was passed, but no storeId was found. Pass a `storeId` option or set `BLOB_STORE_ID` to use OIDC auth");
	}
	let r = ej("BLOB_READ_WRITE_TOKEN");
	if (r) return {
		kind: "readWrite",
		token: r,
		storeId: tj(r)
	};
	throw new $("No blob credentials found. Pass a `token` option, set `BLOB_READ_WRITE_TOKEN`, or use `oidcToken` (or `VERCEL_OIDC_TOKEN`) with `storeId` or `BLOB_STORE_ID`.");
}
var $ = class extends Error {
	constructor(e) {
		super(`Vercel Blob: ${e}`);
	}
};
function oj(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
var sj = ["//"], cj = (() => {
	if (TT()) return !0;
	if (lj().startsWith("http://localhost")) return !1;
	let e = !1, t = new Request(lj(), {
		body: new ReadableStream(),
		method: "POST",
		get duplex() {
			return e = !0, "half";
		}
	}).headers.has("Content-Type");
	return e && !t;
})();
function lj(e = "") {
	let t = null;
	try {
		t = process.env.VERCEL_BLOB_API_URL || process.env.NEXT_PUBLIC_VERCEL_BLOB_API_URL;
	} catch {}
	return `${t || $A}${e}`;
}
var uj = typeof TextEncoder == "function" ? new TextEncoder() : null;
function dj(e) {
	return e ? typeof e == "string" ? uj ? uj.encode(e).byteLength : new Blob([e]).size : "byteLength" in e && typeof e.byteLength == "number" ? e.byteLength : "size" in e && typeof e.size == "number" ? e.size : 0 : 0;
}
var fj = (e, t) => {
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
function pj(e) {
	return globalThis.ReadableStream && e instanceof ReadableStream;
}
function mj(e) {
	return !!(pj(e) || KA(e));
}
var hj = (e, t) => {
	let n = new URL(e);
	for (let [e, r] of Object.entries(t.params)) n.searchParams.set(e, r);
	return n.searchParams.set("vercel-blob-delegation", t.delegationToken), n.searchParams.set("vercel-blob-signature", t.signature), n.toString();
}, gj = !1;
try {
	(process.env.DEBUG?.includes("blob") || process.env.NEXT_PUBLIC_DEBUG?.includes("blob")) && (gj = !0);
} catch {}
function _j(e, ...t) {
	gj && console.debug(`vercel-blob: ${e}`, ...t);
}
var vj = globalThis.DOMException ?? (() => {
	try {
		atob("~");
	} catch (e) {
		return Object.getPrototypeOf(e).constructor;
	}
})(), yj = Object.prototype.toString, bj = (e) => yj.call(e) === "[object Error]", xj = /* @__PURE__ */ new Set([
	"network error",
	"Failed to fetch",
	"NetworkError when attempting to fetch resource.",
	"The Internet connection appears to be offline.",
	"Load failed",
	"Network request failed",
	"fetch failed",
	"terminated"
]);
function Sj(e) {
	return e && bj(e) && e.name === "TypeError" && typeof e.message == "string" ? e.message === "Load failed" ? e.stack === void 0 : xj.has(e.message) : !1;
}
var Cj = typeof HA == "function", wj = Cj && cj, Tj = 64 * 1024, Ej = async ({ input: e, init: t, onUploadProgress: n }) => {
	_j("using fetch");
	let r;
	if (t.body) if (n) {
		let e = await GA(t.body), i = 0, a = fj(Tj, (e) => {
			i += e, n(i);
		});
		r = e.pipeThrough(a);
	} else r = t.body;
	let i = cj && r && mj(r) ? "half" : void 0;
	return HA(e, {
		...t,
		...t.body ? { body: r } : {},
		duplex: i
	});
}, Dj = typeof XMLHttpRequest < "u", Oj = async ({ input: e, init: t, onUploadProgress: n }) => {
	_j("using xhr");
	let r = null;
	return t.body && (r = pj(t.body) ? await new Response(t.body).blob() : t.body), new Promise((i, a) => {
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
}, kj = async ({ input: e, init: t, onUploadProgress: n }) => {
	if (n) {
		if (wj) return Ej({
			input: e,
			init: t,
			onUploadProgress: n
		});
		if (Dj) return Oj({
			input: e,
			init: t,
			onUploadProgress: n
		});
	}
	if (Cj) return Ej({
		input: e,
		init: t
	});
	if (Dj) return Oj({
		input: e,
		init: t
	});
	throw Error("No request implementation available");
}, Aj = class extends $ {
	constructor() {
		super("Access denied, please provide a valid token for this resource.");
	}
}, jj = class extends $ {
	constructor(e) {
		super(e ?? "OIDC is enabled for this project, but not for this token's environment.");
	}
}, Mj = class extends $ {
	constructor(e) {
		super(`Content type mismatch, ${e}.`);
	}
}, Nj = class extends $ {
	constructor(e) {
		super(`Pathname mismatch, ${e}. Check the pathname used in upload() or put() matches the one from the client token.`);
	}
}, Pj = class extends $ {
	constructor() {
		super("Client token has expired.");
	}
}, Fj = class extends $ {
	constructor(e) {
		super(`File is too large, ${e}.`);
	}
}, Ij = class extends $ {
	constructor() {
		super("This store does not exist.");
	}
}, Lj = class extends $ {
	constructor() {
		super("This store has been suspended.");
	}
}, Rj = class extends $ {
	constructor() {
		super("Unknown error, please visit https://vercel.com/help.");
	}
}, zj = class extends $ {
	constructor() {
		super("The requested blob does not exist");
	}
}, Bj = class extends $ {
	constructor() {
		super("The blob service is currently not available. Please try again.");
	}
}, Vj = class extends $ {
	constructor(e) {
		super(`Too many requests please lower the number of concurrent requests ${e ? ` - try again in ${e} seconds` : ""}.`), this.retryAfter = e ?? 0;
	}
}, Hj = class extends $ {
	constructor() {
		super("The request was aborted.");
	}
}, Uj = class extends $ {
	constructor() {
		super("Precondition failed: ETag mismatch.");
	}
}, Wj = 12;
function Gj() {
	let e = null;
	try {
		e = process.env.VERCEL_BLOB_API_VERSION_OVERRIDE || process.env.NEXT_PUBLIC_VERCEL_BLOB_API_VERSION_OVERRIDE;
	} catch {}
	return `${e ?? Wj}`;
}
function Kj() {
	try {
		let e = process.env.VERCEL_BLOB_RETRIES || "10";
		return parseInt(e, 10);
	} catch {
		return 10;
	}
}
function qj(e) {
	let t = e.headers.get("retry-after");
	return new Vj(t ? parseInt(t, 10) : void 0);
}
async function Jj(e) {
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
			r = new Lj();
			break;
		case "forbidden":
			r = new Aj();
			break;
		case "oidc_environment_not_allowed":
			r = new jj(n);
			break;
		case "content_type_not_allowed":
			r = new Mj(n);
			break;
		case "client_token_pathname_mismatch":
			r = new Nj(n);
			break;
		case "client_token_expired":
			r = new Pj();
			break;
		case "file_too_large":
			r = new Fj(n);
			break;
		case "not_found":
			r = new zj();
			break;
		case "client_token_not_allowed":
			r = new $(n ?? "This operation is not available when using a client token. Use a read–write or OIDC token on the server.");
			break;
		case "store_not_found":
			r = new Ij();
			break;
		case "bad_request":
			r = new $(n ?? "Bad request");
			break;
		case "service_unavailable":
			r = new Bj();
			break;
		case "rate_limited":
			r = qj(e);
			break;
		case "precondition_failed":
			r = new Uj();
			break;
		default:
			r = new Rj();
			break;
	}
	return {
		code: t,
		error: r
	};
}
async function Yj(e, t, n) {
	let r = Gj(), i = await aj(n), a = i.kind === "presigned" ? void 0 : i.token, o = Xj(), s = lj(e);
	n?.presignedUrlPayload && (s = hj(s, n.presignedUrlPayload));
	let c = `${i.storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`, l = 0, u = 0, d = 0, f = n?.onUploadProgress || Zj();
	t.body && f && (u = dj(t.body)), n?.onUploadProgress && n.onUploadProgress({
		loaded: 0,
		total: u,
		percentage: 0
	});
	let p = await (0, VA.default)(async (e) => {
		let p;
		try {
			p = await kj({
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
			if (t instanceof vj && t.name === "AbortError") {
				e(new Hj());
				return;
			}
			if (Sj(t)) throw t;
			if (t instanceof TypeError) {
				e(t);
				return;
			}
			throw t;
		}
		if (p.ok) return p;
		let { code: m, error: h } = await Jj(p);
		if (m === "unknown_error" || m === "service_unavailable" || m === "internal_server_error") throw h;
		e(h);
	}, {
		retries: Kj(),
		onRetry: (t) => {
			t instanceof Error && _j(`retrying API request to ${e}`, t.message), l += 1;
		}
	});
	if (!p) throw new Rj();
	return n?.onUploadProgress && n.onUploadProgress({
		loaded: d,
		total: d,
		percentage: 100
	}), await p.json();
}
function Xj() {
	let e = {};
	try {
		"VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in process.env && process.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API !== void 0 ? e["x-proxy-through-alternative-api"] = process.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API : "NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in process.env && process.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API !== void 0 && (e["x-proxy-through-alternative-api"] = process.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API);
	} catch {}
	return e;
}
function Zj() {
	try {
		return process.env.VERCEL_BLOB_USE_X_CONTENT_LENGTH === "1";
	} catch {
		return !1;
	}
}
var Qj = {
	cacheControlMaxAge: "x-cache-control-max-age",
	addRandomSuffix: "x-add-random-suffix",
	allowOverwrite: "x-allow-overwrite",
	contentType: "x-content-type",
	access: "x-vercel-blob-access",
	ifMatch: "x-if-match"
};
function $j(e, t) {
	let n = {};
	if (n[Qj.access] = t.access, e.includes("contentType") && t.contentType && (n[Qj.contentType] = t.contentType), e.includes("addRandomSuffix") && t.addRandomSuffix !== void 0 && (n[Qj.addRandomSuffix] = t.addRandomSuffix ? "1" : "0"), e.includes("ifMatch") && t.ifMatch) {
		if (t.allowOverwrite === !1) throw new $("ifMatch and allowOverwrite: false are contradictory. ifMatch is used for conditional overwrites, which requires allowOverwrite to be true.");
		n[Qj.ifMatch] = t.ifMatch, e.includes("allowOverwrite") && t.allowOverwrite === void 0 && (n[Qj.allowOverwrite] = "1");
	}
	return e.includes("allowOverwrite") && t.allowOverwrite !== void 0 && (n[Qj.allowOverwrite] = t.allowOverwrite ? "1" : "0"), e.includes("cacheControlMaxAge") && t.cacheControlMaxAge !== void 0 && (n[Qj.cacheControlMaxAge] = t.cacheControlMaxAge.toString()), n;
}
async function eM({ pathname: e, options: t, extraChecks: n, getToken: r }) {
	if (!e) throw new $("pathname is required");
	if (e.length > 950) throw new $("pathname is too long, maximum length is 950");
	for (let t of sj) if (e.includes(t)) throw new $(`pathname cannot contain "${t}", please encode it if needed`);
	if (!t) throw new $("missing options, see usage");
	if (t.access !== "public" && t.access !== "private") throw new $("access must be \"private\" or \"public\", see https://vercel.com/docs/vercel-blob");
	return n && n(t), r && (t.token = await r(e, t)), t;
}
function tM({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i, a) => {
		let o = await eM({
			pathname: r,
			options: a,
			extraChecks: n,
			getToken: t
		}), s = $j(e, o);
		return nM({
			uploadId: o.uploadId,
			key: o.key,
			pathname: r,
			headers: s,
			options: o,
			parts: i
		});
	};
}
async function nM({ uploadId: e, key: t, pathname: n, parts: r, headers: i, options: a }) {
	let o = new URLSearchParams({ pathname: n });
	try {
		let n = await Yj(`/mpu?${o.toString()}`, {
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
		return _j("mpu: complete", n), n;
	} catch (e) {
		throw e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? new Bj() : e;
	}
}
function rM({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i) => {
		let a = await eM({
			pathname: r,
			options: i,
			extraChecks: n,
			getToken: t
		}), o = await iM(r, $j(e, a), a);
		return {
			key: o.key,
			uploadId: o.uploadId
		};
	};
}
async function iM(e, t, n) {
	_j("mpu: create", "pathname:", e);
	let r = new URLSearchParams({ pathname: e });
	try {
		let e = await Yj(`/mpu?${r.toString()}`, {
			method: "POST",
			headers: {
				...t,
				"x-mpu-action": "create"
			},
			signal: n.abortSignal
		}, n);
		return _j("mpu: create", e), e;
	} catch (e) {
		throw e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? new Bj() : e;
	}
}
function aM({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i, a) => {
		let o = await eM({
			pathname: r,
			options: a,
			extraChecks: n,
			getToken: t
		}), s = $j(e, o);
		if (oj(i)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
		return {
			etag: (await oM({
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
async function oM({ uploadId: e, key: t, pathname: n, headers: r, options: i, internalAbortController: a = new AbortController(), part: o }) {
	var s, c;
	let l = Yj(`/mpu?${new URLSearchParams({ pathname: n }).toString()}`, {
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
var sM = typeof window < "u" ? 6 : 8, cM = 8 * 1024 * 1024, lM = sM * cM * 2;
function uM({ uploadId: e, key: t, pathname: n, stream: r, headers: i, options: a, totalToLoad: o }) {
	_j("mpu: upload init", "key:", t);
	let s = new AbortController();
	return new Promise((c, l) => {
		let u = [], d = [], f = r.getReader(), p = 0, m = !1, h = 1, g = !1, _ = 0, v = !1, y = 0, b = [], x = 0, S, C = {};
		a.onUploadProgress && (S = (0, UA.default)(() => {
			var e;
			let t = Object.values(C).reduce((e, t) => e + t, 0), n = o || t, r = o > 0 ? Number(((t / o || t) * 100).toFixed(2)) : 0;
			(e = a.onUploadProgress) == null || e.call(a, {
				loaded: t,
				total: n,
				percentage: r
			});
		}, 150)), w().catch(D);
		async function w() {
			for (_j("mpu: upload read start", "activeUploads:", p, "currentBytesInMemory:", `${QA(_)}/${QA(lM)}`, "bytesSent:", QA(y)), m = !0; _ < lM && !g;) try {
				let { value: e, done: t } = await f.read();
				if (t) {
					v = !0, _j("mpu: upload read consumed the whole stream"), b.length > 0 ? (u.push({
						partNumber: h++,
						blob: new Blob(b, { type: "application/octet-stream" })
					}), E()) : p === 0 && (f.releaseLock(), c(d)), m = !1;
					return;
				}
				_ += e.byteLength;
				let n = 0;
				for (; n < e.byteLength;) {
					let t = cM - x, r = Math.min(n + t, e.byteLength), i = e.slice(n, r);
					b.push(i), x += i.byteLength, n = r, x === cM && (u.push({
						partNumber: h++,
						blob: new Blob(b, { type: "application/octet-stream" })
					}), b = [], x = 0, E());
				}
			} catch (e) {
				D(e);
			}
			_j("mpu: upload read end", "activeUploads:", p, "currentBytesInMemory:", `${QA(_)}/${QA(lM)}`, "bytesSent:", QA(y)), m = !1;
		}
		async function T(r) {
			p++, _j("mpu: upload send part start", "partNumber:", r.partNumber, "size:", r.blob.size, "activeUploads:", p, "currentBytesInMemory:", `${QA(_)}/${QA(lM)}`, "bytesSent:", QA(y));
			try {
				let o = a.onUploadProgress ? (e) => {
					C[r.partNumber] = e.loaded, S && S();
				} : void 0, l = await oM({
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
				if (_j("mpu: upload send part end", "partNumber:", r.partNumber, "activeUploads", p, "currentBytesInMemory:", `${QA(_)}/${QA(lM)}`, "bytesSent:", QA(y)), g) return;
				if (d.push({
					partNumber: r.partNumber,
					etag: l.etag
				}), _ -= r.blob.size, p--, y += r.blob.size, u.length > 0 && E(), v) {
					p === 0 && (f.releaseLock(), c(d));
					return;
				}
				m || w().catch(D);
			} catch (e) {
				D(e);
			}
		}
		function E() {
			if (!g) for (_j("send parts", "activeUploads", p, "partsToUpload", u.length); p < sM && u.length > 0;) {
				let e = u.shift();
				e && T(e);
			}
		}
		function D(e) {
			g || (g = !0, s.abort(), f.releaseLock(), e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "fetch failed") ? l(new Bj()) : l(e));
		}
	});
}
function dM({ allowedOptions: e, getToken: t, extraChecks: n }) {
	return async (r, i) => {
		let a = await eM({
			pathname: r,
			options: i,
			extraChecks: n,
			getToken: t
		}), o = $j(e, a), s = await iM(r, o, a);
		return {
			key: s.key,
			uploadId: s.uploadId,
			async uploadPart(e, t) {
				if (oj(t)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
				return {
					etag: (await oM({
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
				return nM({
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
async function fM(e, t, n, r) {
	_j("mpu: init", "pathname:", e, "headers:", n);
	let i = {
		...r,
		onUploadProgress: void 0
	};
	if (r.maximumSizeInBytes !== void 0 && !mj(t) && dj(t) > r.maximumSizeInBytes) throw new $(`Body size of ${dj(t)} bytes exceeds the maximum allowed size of ${r.maximumSizeInBytes} bytes`);
	let a = await iM(e, n, i), o = dj(t), s = await GA(t), c = await uM({
		uploadId: a.uploadId,
		key: a.key,
		pathname: e,
		stream: s,
		headers: n,
		options: r,
		totalToLoad: o
	});
	return await nM({
		uploadId: a.uploadId,
		key: a.key,
		pathname: e,
		parts: c,
		headers: n,
		options: i
	});
}
function pM({ allowedOptions: e, getToken: t, getPresignedUrlPayload: n, extraChecks: r }) {
	return async function(i, a, o) {
		if (!a) throw new $("body is required");
		if (oj(a)) throw new $("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
		let s = await eM({
			pathname: i,
			options: o,
			extraChecks: r,
			getToken: t
		}), c = await n?.(i, s), l = {
			...s,
			presignedUrlPayload: c
		}, u = $j(e, s);
		if (s.multipart === !0) return fM(i, a, u, l);
		let d = s.onUploadProgress ? (0, UA.default)(s.onUploadProgress, 100) : void 0, f = await Yj(`/?${new URLSearchParams({ pathname: i }).toString()}`, {
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
function mM(e) {
	return function(t) {
		if (!t.token.startsWith("vercel_blob_client_")) throw new $(`${e} must be called with a client token`);
		if (t.addRandomSuffix !== void 0 || t.allowOverwrite !== void 0 || t.cacheControlMaxAge !== void 0) throw new $(`${e} doesn't allow \`addRandomSuffix\`, \`cacheControlMaxAge\` or \`allowOverwrite\`. Configure these options at the server side when generating client tokens.`);
	};
}
pM({
	allowedOptions: ["contentType"],
	extraChecks: mM("client/`put`")
}), rM({
	allowedOptions: ["contentType"],
	extraChecks: mM("client/`createMultipartUpload`")
}), dM({
	allowedOptions: ["contentType"],
	extraChecks: mM("client/`createMultipartUpload`")
}), aM({
	allowedOptions: ["contentType"],
	extraChecks: mM("client/`multipartUpload`")
}), tM({
	allowedOptions: ["contentType"],
	extraChecks: mM("client/`completeMultipartUpload`")
});
var hM = pM({
	allowedOptions: ["contentType"],
	extraChecks(e) {
		if (e.handleUploadUrl === void 0) throw new $("client/`upload` requires the 'handleUploadUrl' parameter");
		if (e.addRandomSuffix !== void 0 || e.allowOverwrite !== void 0 || e.cacheControlMaxAge !== void 0 || e.ifMatch !== void 0) throw new $("client/`upload` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating client tokens.");
	},
	async getToken(e, t) {
		return _M({
			handleUploadUrl: t.handleUploadUrl,
			pathname: e,
			clientPayload: t.clientPayload ?? null,
			multipart: t.multipart ?? !1,
			headers: t.headers
		});
	}
});
pM({
	allowedOptions: ["contentType"],
	extraChecks(e) {
		if (e.handleUploadUrl === void 0) throw new $("client/`upload` requires the 'handleUploadUrl' parameter");
		if (e.addRandomSuffix !== void 0 || e.allowOverwrite !== void 0 || e.cacheControlMaxAge !== void 0 || e.ifMatch !== void 0) throw new $("client/`uploadPresigned` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating presigned URLs.");
	},
	async getPresignedUrlPayload(e, t) {
		return vM({
			pathname: e,
			handleUploadUrl: t.handleUploadUrl,
			clientPayload: t.clientPayload ?? null,
			multipart: t.multipart ?? !1,
			headers: t.headers
		});
	}
});
var gM = {
	generateClientToken: "blob.generate-client-token",
	generatePresignedUrl: "blob.generate-presigned-url",
	uploadCompleted: "blob.upload-completed"
};
async function _M(e) {
	let { handleUploadUrl: t, pathname: n } = e, r = bM(t) ? t : yM(t), i = {
		type: gM.generateClientToken,
		payload: {
			pathname: n,
			clientPayload: e.clientPayload,
			multipart: e.multipart
		}
	}, a = await HA(r, {
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
async function vM(e) {
	let { handleUploadUrl: t, pathname: n } = e, r = bM(t) ? t : yM(t), i = {
		type: gM.generatePresignedUrl,
		payload: {
			pathname: n,
			clientPayload: e.clientPayload,
			multipart: e.multipart
		}
	}, a = await HA(r, {
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
function yM(e) {
	return new URL(e, location.href).href;
}
function bM(e) {
	try {
		return !!new URL(e);
	} catch {
		return !1;
	}
}
//#endregion
//#region admin-app/src/services/layout-reference-service.mjs
async function xM(e = {}) {
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
var SM = Object.freeze({
	list() {
		return xM();
	},
	create(e) {
		return xM({
			method: "POST",
			body: JSON.stringify(e)
		});
	},
	update(e, t) {
		return xM({
			method: "PATCH",
			body: JSON.stringify({
				id: e,
				...t
			})
		});
	},
	analyze(e) {
		return xM({
			method: "POST",
			body: JSON.stringify(e),
			endpoint: "/api/layout-reference-analyze"
		});
	}
}), CM = {
	class: "reference-library",
	"aria-labelledby": "reference-library-title"
}, wM = { class: "reference-library__header" }, TM = { class: "reference-library__actions" }, EM = ["disabled"], DM = {
	class: "reference-library__summary",
	"aria-label": "레이아웃 레퍼런스 현황"
}, OM = {
	key: 0,
	class: "outline-item danger-state",
	role: "alert"
}, kM = { class: "reference-library__workspace" }, AM = { class: "reference-library__list" }, jM = { class: "reference-library__filters" }, MM = ["value"], NM = {
	class: "reference-library__rows",
	"aria-live": "polite"
}, PM = ["onClick"], FM = ["src"], IM = {
	key: 1,
	"aria-hidden": "true"
}, LM = { class: "reference-library__row-copy" }, RM = { class: "reference-library__row-meta" }, zM = {
	key: 0,
	class: "reference-library__empty"
}, BM = { class: "reference-library__editor-heading" }, VM = ["disabled"], HM = { class: "reference-library__grid" }, UM = { class: "wide" }, WM = { class: "wide" }, GM = { class: "wide reference-library__upload" }, KM = ["disabled"], qM = { class: "wide" }, JM = { class: "reference-library__analysis-action" }, YM = ["disabled"], XM = {
	key: 0,
	class: "reference-library__analysis-meta"
}, ZM = { key: 0 }, QM = { class: "reference-library__grid" }, $M = { class: "wide" }, eN = { class: "wide" }, tN = { class: "wide" }, nN = { class: "wide" }, rN = { class: "reference-library__grid" }, iN = { class: "reference-library__score-heading" }, aN = { class: "reference-library__scores" }, oN = ["onUpdate:modelValue"], sN = { class: "reference-library__check" }, cN = { class: "reference-library__approval" }, lN = { key: 0 }, uN = { key: 1 }, dN = { class: "reference-library__footer" }, fN = ["href"], pN = ["disabled"], mN = ["disabled"], hN = ["disabled"], gN = ["disabled"], _N = {
	key: 0,
	class: "reference-library__history"
}, vN = /*#__PURE__*/ jh({
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
		}, a = /* @__PURE__ */ I([]), o = /* @__PURE__ */ I([]), s = /* @__PURE__ */ I(!1), c = /* @__PURE__ */ I(!1), l = /* @__PURE__ */ I(!1), u = /* @__PURE__ */ I(!1), d = /* @__PURE__ */ I(""), f = /* @__PURE__ */ I(""), p = /* @__PURE__ */ I(""), m = /* @__PURE__ */ I(""), h = /* @__PURE__ */ I(""), g = () => ({
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
		}), _ = /* @__PURE__ */ fn(g()), v = G(() => a.value.find((e) => e.id === f.value) || null), y = G(() => Array.from(new Set(a.value.flatMap((e) => e.sectionTypes || []))).sort((e, t) => e.localeCompare(t, "ko"))), b = G(() => {
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
		}), x = G(() => ({
			total: a.value.length,
			review: a.value.filter((e) => e.status === "review").length,
			approved: a.value.filter((e) => e.status === "approved").length,
			highQuality: a.value.filter((e) => Number(e.qualityScore || 0) >= 4).length,
			plannerReady: a.value.filter((e) => e.plannerReadiness?.ready).length
		})), S = G(() => o.value.filter((e) => e.layoutReferenceId === f.value)), C = G(() => {
			let e = r.map(([e]) => Number(_.qualityScores[e] || 0));
			return Math.round(e.reduce((e, t) => e + t, 0) / e.length * 100) / 100;
		}), w = G(() => [
			{
				label: "출처 URL",
				passed: !!_.sourceUrl.trim()
			},
			{
				label: "섹션 유형",
				passed: E(_.sectionTypesText).length > 0
			},
			{
				label: "디자인 분석",
				passed: !!_.designSummary.trim()
			},
			{
				label: "Layout Spec",
				passed: (() => {
					try {
						return Object.keys(JSON.parse(_.layoutSpecText || "{}") || {}).length > 0;
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
				passed: r.every(([e]) => Number(_.qualityScores[e] || 0) > 0)
			},
			{
				label: "권리·출처 확인",
				passed: _.copyrightReviewed
			}
		]), T = G(() => w.value.every((e) => e.passed));
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
		function A(e) {
			if (!e) return "";
			let t = new Date(e);
			if (Number.isNaN(t.getTime())) return "";
			let n = t.getTimezoneOffset() * 6e4;
			return new Date(t.getTime() - n).toISOString().slice(0, 16);
		}
		function ee() {
			f.value = "", Object.assign(_, g()), d.value = "";
		}
		function te(e) {
			f.value = e.id, Object.assign(_, {
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
				capturedAt: A(e.capturedAt),
				adminNotes: "",
				analysisMeta: e.analysisMeta || {},
				changeNote: ""
			}), d.value = "";
		}
		function ne(e = _.status) {
			let t;
			try {
				t = JSON.parse(_.layoutSpecText || "{}");
			} catch {
				throw Error("Layout Spec을 올바른 JSON 객체로 입력해 주세요.");
			}
			if (!t || typeof t != "object" || Array.isArray(t)) throw Error("Layout Spec은 JSON 객체여야 합니다.");
			return {
				title: _.title.trim(),
				sourceSite: _.sourceSite.trim(),
				sourceUrl: _.sourceUrl.trim(),
				previewImageUrl: _.previewImageUrl.trim(),
				status: e,
				pageType: _.pageType.trim(),
				industry: _.industry.trim(),
				promotionGoal: _.promotionGoal.trim(),
				viewport: _.viewport,
				visualStyles: E(_.visualStylesText),
				sectionTypes: E(_.sectionTypesText),
				tags: E(_.tagsText),
				designSummary: _.designSummary.trim(),
				strengths: _.strengths.trim(),
				risks: _.risks.trim(),
				layoutSpec: t,
				qualityScores: Object.fromEntries(r.map(([e]) => [e, Number(_.qualityScores[e] || 0)])),
				copyrightReviewed: _.copyrightReviewed,
				capturedAt: _.capturedAt ? new Date(_.capturedAt).toISOString() : null,
				analysisMeta: _.analysisMeta,
				changeNote: _.changeNote.trim()
			};
		}
		async function re(e) {
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
					let e = t.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "reference-image", r = await hM(`layout-reference-uploads/${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`, t, {
						access: "public",
						handleUploadUrl: "/api/layout-reference-image-upload"
					});
					_.previewImageUrl = r.url, _.capturedAt ||= A((/* @__PURE__ */ new Date()).toISOString()), n("status", "레퍼런스 이미지를 업로드했습니다. AI 자동 분석을 실행할 수 있습니다.");
				} catch (e) {
					d.value = e.message || "레퍼런스 이미지 업로드에 실패했습니다.";
				} finally {
					u.value = !1, e.target.value = "";
				}
			}
		}
		async function ie() {
			if (!_.sourceUrl.trim() || !_.previewImageUrl.trim()) {
				d.value = "AI 분석에는 출처 URL과 공개 HTTPS 미리보기 이미지 URL이 필요합니다.";
				return;
			}
			l.value = !0, d.value = "";
			try {
				let e = await SM.analyze({
					title: _.title.trim(),
					sourceSite: _.sourceSite.trim(),
					sourceUrl: _.sourceUrl.trim(),
					previewImageUrl: _.previewImageUrl.trim(),
					pageType: _.pageType.trim(),
					industry: _.industry.trim(),
					promotionGoal: _.promotionGoal.trim(),
					viewport: _.viewport,
					adminNotes: _.adminNotes.trim()
				}), t = e.analysis || {};
				Object.assign(_, {
					title: t.title || _.title,
					sourceSite: t.sourceSite || _.sourceSite,
					pageType: t.pageType || _.pageType,
					industry: t.industry || _.industry,
					promotionGoal: t.promotionGoal || _.promotionGoal,
					viewport: t.viewport || _.viewport,
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
					status: _.status === "approved" ? "review" : _.status,
					changeNote: "AI 레이아웃 레퍼런스 분석 초안 적용"
				}), n("status", "AI 분석 초안을 적용했습니다. 내용을 검토한 뒤 저장해 주세요.");
			} catch (e) {
				d.value = e.message;
			} finally {
				l.value = !1;
			}
		}
		async function ae(e = f.value) {
			s.value = !0, d.value = "";
			try {
				let t = await SM.list();
				a.value = t.references || [], o.value = t.histories || [];
				let n = a.value.find((t) => t.id === e);
				n ? te(n) : a.value.length && !f.value ? te(a.value[0]) : a.value.length || ee();
			} catch (e) {
				d.value = e.message;
			} finally {
				s.value = !1;
			}
		}
		async function j(e = _.status) {
			c.value = !0, d.value = "";
			try {
				if (!_.title.trim() || !_.sourceUrl.trim()) throw Error("레퍼런스명과 출처 URL을 입력해 주세요.");
				let t = !v.value;
				await ae((t ? await SM.create(ne("draft")) : await SM.update(v.value.id, ne(e))).reference.id), n("status", t ? "레이아웃 레퍼런스 초안을 등록했습니다." : "레이아웃 레퍼런스를 저장했습니다.");
			} catch (e) {
				d.value = e.message;
			} finally {
				c.value = !1;
			}
		}
		async function oe(e) {
			if (v.value) {
				if (e === "approved" && !T.value) {
					d.value = "승인 조건을 모두 충족해야 LLM 검색 후보로 사용할 수 있습니다.";
					return;
				}
				_.status = e, _.changeNote.trim() || (_.changeNote = `${D(e)} 상태로 변경`), await j(e);
			}
		}
		return fa(() => ae()), (e, t) => (B(), V("section", CM, [
			H("header", wM, [t[27] ||= H("div", null, [
				H("span", { class: "reference-library__eyebrow" }, "Design Research Library"),
				H("h2", { id: "reference-library-title" }, "레이아웃 레퍼런스"),
				H("p", null, "우수 웹사이트의 출처와 디자인 원리를 조사해 저장합니다. 승인 자료만 향후 LLM 레이아웃 검색 후보로 사용합니다.")
			], -1), H("div", TM, [H("button", {
				class: "tiny-button",
				type: "button",
				disabled: s.value,
				onClick: t[0] ||= (e) => ae()
			}, "새로고침", 8, EM), H("button", {
				class: "tiny-button primary",
				type: "button",
				onClick: ee
			}, "신규 레퍼런스")])]),
			t[65] ||= H("div", { class: "reference-library__notice" }, [H("strong", null, "Research only"), H("span", null, "원본 코드·카피·이미지를 복제하지 않고, 추상화된 Layout Primitive와 품질 평가만 저장합니다.")], -1),
			H("div", DM, [
				H("div", null, [H("strong", null, P(x.value.total), 1), t[28] ||= H("span", null, "전체", -1)]),
				H("div", null, [H("strong", null, P(x.value.review), 1), t[29] ||= H("span", null, "검토중", -1)]),
				H("div", null, [H("strong", null, P(x.value.approved), 1), t[30] ||= H("span", null, "LLM 사용 승인", -1)]),
				H("div", null, [H("strong", null, P(x.value.highQuality), 1), t[31] ||= H("span", null, "품질 4.0 이상", -1)]),
				H("div", null, [H("strong", null, P(x.value.plannerReady), 1), t[32] ||= H("span", null, "Planner 사용 가능", -1)])
			]),
			d.value ? (B(), V("div", OM, [t[33] ||= H("strong", null, "레이아웃 레퍼런스 오류", -1), H("span", null, P(d.value), 1)])) : W("", !0),
			H("div", kM, [H("aside", AM, [H("div", jM, [
				L(H("input", {
					"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
					type: "search",
					"aria-label": "레이아웃 레퍼런스 검색",
					placeholder: "사이트·스타일·목적 검색"
				}, null, 512), [[K, p.value]]),
				L(H("select", {
					"onUpdate:modelValue": t[2] ||= (e) => m.value = e,
					"aria-label": "레퍼런스 상태 필터"
				}, [...t[34] ||= [Vs("<option value=\"\" data-v-53d013e4>전체 상태</option><option value=\"draft\" data-v-53d013e4>초안</option><option value=\"review\" data-v-53d013e4>검토중</option><option value=\"approved\" data-v-53d013e4>승인</option><option value=\"archived\" data-v-53d013e4>보관</option>", 5)]], 512), [[q, m.value]]),
				L(H("select", {
					"onUpdate:modelValue": t[3] ||= (e) => h.value = e,
					"aria-label": "섹션 유형 필터"
				}, [t[35] ||= H("option", { value: "" }, "전체 섹션", -1), (B(!0), V(z, null, R(y.value, (e) => (B(), V("option", {
					key: e,
					value: e
				}, P(e), 9, MM))), 128))], 512), [[q, h.value]])
			]), H("div", NM, [(B(!0), V(z, null, R(b.value, (e) => (B(), V("button", {
				key: e.id,
				class: N(["reference-library__row", { selected: f.value === e.id }]),
				type: "button",
				onClick: (t) => te(e)
			}, [
				H("span", { class: N(["reference-library__thumb", { empty: !e.previewImageUrl }]) }, [e.previewImageUrl ? (B(), V("img", {
					key: 0,
					src: e.previewImageUrl,
					alt: "",
					loading: "lazy",
					referrerpolicy: "no-referrer"
				}, null, 8, FM)) : (B(), V("span", IM, "REF"))], 2),
				H("span", LM, [
					H("strong", null, P(e.title), 1),
					H("small", null, P(e.sourceSite || O(e.sourceUrl)), 1),
					H("span", null, [(B(!0), V(z, null, R(e.sectionTypes.slice(0, 2), (e) => (B(), V("em", { key: e }, P(e), 1))), 128))])
				]),
				H("span", RM, [
					H("b", null, P(Number(e.qualityScore || 0).toFixed(1)), 1),
					H("em", { class: N(`is-${e.status}`) }, P(D(e.status)), 3),
					H("em", { class: N(e.plannerReadiness?.ready ? "is-ready" : "is-blocked") }, P(e.plannerReadiness?.ready ? "사용 가능" : "차단"), 3)
				])
			], 10, PM))), 128)), !s.value && !b.value.length ? (B(), V("p", zM, "조건에 맞는 레퍼런스가 없습니다.")) : W("", !0)])]), H("form", {
				class: "reference-library__editor",
				onSubmit: t[26] ||= yu((e) => j(), ["prevent"])
			}, [
				H("div", BM, [H("div", null, [H("strong", null, P(v.value ? v.value.title : "신규 레이아웃 레퍼런스"), 1), H("span", null, P(v.value ? `최근 수정 ${k(v.value.updatedAt)}` : "출처와 분석 결과를 입력해 주세요."), 1)]), v.value ? (B(), V("span", {
					key: 0,
					class: N(["reference-library__status", `is-${_.status}`])
				}, P(D(_.status)), 3)) : W("", !0)]),
				H("fieldset", {
					disabled: c.value || l.value,
					class: "reference-library__fields"
				}, [
					H("section", null, [
						t[46] ||= H("h3", null, "1. 조사 출처", -1),
						H("div", HM, [
							H("label", null, [t[36] ||= H("span", null, "레퍼런스명 *", -1), L(H("input", {
								"onUpdate:modelValue": t[4] ||= (e) => _.title = e,
								type: "text",
								maxlength: "200",
								autocomplete: "off"
							}, null, 512), [[K, _.title]])]),
							H("label", null, [t[37] ||= H("span", null, "사이트명", -1), L(H("input", {
								"onUpdate:modelValue": t[5] ||= (e) => _.sourceSite = e,
								type: "text",
								maxlength: "160",
								autocomplete: "off"
							}, null, 512), [[K, _.sourceSite]])]),
							H("label", UM, [t[38] ||= H("span", null, "출처 URL *", -1), L(H("input", {
								"onUpdate:modelValue": t[6] ||= (e) => _.sourceUrl = e,
								type: "url",
								placeholder: "https://example.com/campaign",
								autocomplete: "off"
							}, null, 512), [[K, _.sourceUrl]])]),
							H("label", WM, [t[39] ||= H("span", null, "미리보기 이미지 URL", -1), L(H("input", {
								"onUpdate:modelValue": t[7] ||= (e) => _.previewImageUrl = e,
								type: "url",
								placeholder: "HTTPS 이미지 URL",
								autocomplete: "off"
							}, null, 512), [[K, _.previewImageUrl]])]),
							H("label", GM, [
								t[40] ||= H("span", null, [U("스크린샷 업로드 "), H("small", null, "PNG, JPEG, WebP · 최대 10MB")], -1),
								H("input", {
									type: "file",
									accept: ".png,.jpg,.jpeg,.webp",
									disabled: u.value,
									onChange: re
								}, null, 40, KM),
								H("em", null, P(u.value ? "업로드 중…" : _.previewImageUrl ? "업로드 또는 URL 준비됨" : "분석할 화면을 선택해 주세요."), 1)
							]),
							H("label", qM, [t[41] ||= H("span", null, "AI 분석 참고사항", -1), L(H("textarea", {
								"onUpdate:modelValue": t[8] ||= (e) => _.adminNotes = e,
								rows: "3",
								placeholder: "관찰할 영역, 캠페인 유형 또는 제외할 요소를 입력해 주세요."
							}, null, 512), [[K, _.adminNotes]])]),
							H("label", null, [t[43] ||= H("span", null, "수집 화면", -1), L(H("select", { "onUpdate:modelValue": t[9] ||= (e) => _.viewport = e }, [...t[42] ||= [
								H("option", { value: "responsive" }, "Desktop + Mobile", -1),
								H("option", { value: "desktop" }, "Desktop", -1),
								H("option", { value: "mobile" }, "Mobile", -1)
							]], 512), [[q, _.viewport]])]),
							H("label", null, [t[44] ||= H("span", null, "조사 일시", -1), L(H("input", {
								"onUpdate:modelValue": t[10] ||= (e) => _.capturedAt = e,
								type: "datetime-local"
							}, null, 512), [[K, _.capturedAt]])])
						]),
						H("div", JM, [t[45] ||= H("div", null, [H("strong", null, "스크린샷 AI 분석"), H("span", null, "원본 자산을 복제하지 않고 구성 원리와 Layout Spec 초안만 생성합니다.")], -1), H("button", {
							class: "tiny-button primary",
							type: "button",
							disabled: l.value || u.value || !_.sourceUrl || !_.previewImageUrl,
							onClick: ie
						}, P(l.value ? "분석 중…" : "AI 자동 분석"), 9, YM)]),
						_.analysisMeta?.analyzedAt ? (B(), V("div", XM, [
							H("span", null, "최근 분석 " + P(k(_.analysisMeta.analyzedAt)), 1),
							H("span", null, "신뢰도 " + P(Math.round(Number(_.analysisMeta.confidence || 0) * 100)) + "%", 1),
							_.analysisMeta.executionDisplay ? (B(), V("span", ZM, P(_.analysisMeta.executionDisplay.providerLabel) + " · " + P(_.analysisMeta.executionDisplay.modelLabel), 1)) : W("", !0)
						])) : W("", !0)
					]),
					H("section", null, [t[53] ||= H("h3", null, "2. 검색 분류", -1), H("div", QM, [
						H("label", null, [t[47] ||= H("span", null, "페이지 유형", -1), L(H("input", {
							"onUpdate:modelValue": t[11] ||= (e) => _.pageType = e,
							type: "text",
							placeholder: "promotion-landing"
						}, null, 512), [[K, _.pageType]])]),
						H("label", null, [t[48] ||= H("span", null, "산업", -1), L(H("input", {
							"onUpdate:modelValue": t[12] ||= (e) => _.industry = e,
							type: "text",
							placeholder: "gaming, retail"
						}, null, 512), [[K, _.industry]])]),
						H("label", $M, [t[49] ||= H("span", null, "전환 목표", -1), L(H("input", {
							"onUpdate:modelValue": t[13] ||= (e) => _.promotionGoal = e,
							type: "text",
							placeholder: "이벤트 참여, 구매 전환"
						}, null, 512), [[K, _.promotionGoal]])]),
						H("label", eN, [t[50] ||= H("span", null, [U("섹션 유형 * "), H("small", null, "쉼표로 구분")], -1), L(H("input", {
							"onUpdate:modelValue": t[14] ||= (e) => _.sectionTypesText = e,
							type: "text",
							placeholder: "hero, benefits, offer"
						}, null, 512), [[K, _.sectionTypesText]])]),
						H("label", tN, [t[51] ||= H("span", null, [U("시각 스타일 "), H("small", null, "쉼표로 구분")], -1), L(H("input", {
							"onUpdate:modelValue": t[15] ||= (e) => _.visualStylesText = e,
							type: "text",
							placeholder: "cinematic, dark, immersive"
						}, null, 512), [[K, _.visualStylesText]])]),
						H("label", nN, [t[52] ||= H("span", null, [U("검색 태그 "), H("small", null, "쉼표로 구분")], -1), L(H("input", {
							"onUpdate:modelValue": t[16] ||= (e) => _.tagsText = e,
							type: "text",
							placeholder: "full-bleed, layered-media, high-contrast"
						}, null, 512), [[K, _.tagsText]])])
					])]),
					H("section", null, [
						t[58] ||= H("h3", null, "3. 디자인 원리 분석", -1),
						H("label", null, [t[54] ||= H("span", null, "디자인 요약 *", -1), L(H("textarea", {
							"onUpdate:modelValue": t[17] ||= (e) => _.designSummary = e,
							rows: "4",
							placeholder: "시각적 위계, 섹션 흐름, 이미지·CTA 전략을 설명합니다."
						}, null, 512), [[K, _.designSummary]])]),
						H("div", rN, [H("label", null, [t[55] ||= H("span", null, "강점", -1), L(H("textarea", {
							"onUpdate:modelValue": t[18] ||= (e) => _.strengths = e,
							rows: "4",
							placeholder: "재사용할 가치가 있는 디자인 원리"
						}, null, 512), [[K, _.strengths]])]), H("label", null, [t[56] ||= H("span", null, "위험·제약", -1), L(H("textarea", {
							"onUpdate:modelValue": t[19] ||= (e) => _.risks = e,
							rows: "4",
							placeholder: "모방 위험, 접근성, 모바일 제약"
						}, null, 512), [[K, _.risks]])])]),
						H("label", null, [t[57] ||= H("span", null, "추상화 Layout Spec *", -1), L(H("textarea", {
							"onUpdate:modelValue": t[20] ||= (e) => _.layoutSpecText = e,
							class: "reference-library__code",
							rows: "12",
							spellcheck: "false"
						}, null, 512), [[K, _.layoutSpecText]])])
					]),
					H("section", null, [
						H("div", iN, [t[59] ||= H("h3", null, "4. 품질 평가", -1), H("strong", null, P(C.value.toFixed(1)) + " / 5.0", 1)]),
						H("div", aN, [(B(), V(z, null, R(r, ([e, n]) => H("label", { key: e }, [H("span", null, P(n), 1), L(H("select", { "onUpdate:modelValue": (t) => _.qualityScores[e] = t }, [...t[60] ||= [
							H("option", { value: 0 }, "미평가", -1),
							H("option", { value: 1 }, "1 · 부족", -1),
							H("option", { value: 2 }, "2", -1),
							H("option", { value: 3 }, "3 · 보통", -1),
							H("option", { value: 4 }, "4 · 우수", -1),
							H("option", { value: 5 }, "5 · 탁월", -1)
						]], 8, oN), [[
							q,
							_.qualityScores[e],
							void 0,
							{ number: !0 }
						]])])), 64))]),
						H("label", sN, [L(H("input", {
							"onUpdate:modelValue": t[21] ||= (e) => _.copyrightReviewed = e,
							type: "checkbox"
						}, null, 512), [[su, _.copyrightReviewed]]), t[61] ||= H("span", null, [H("strong", null, "출처와 사용 범위를 확인했습니다."), U(" 원본 코드·카피·이미지를 저장하거나 복제하지 않고 디자인 원리만 연구 목적으로 사용합니다.")], -1)])
					]),
					H("section", cN, [
						t[62] ||= H("div", null, [H("h3", null, "5. LLM 검색 후보 승인"), H("p", null, "모든 조건을 통과한 승인 자료만 생성 워크플로우에서 검색할 수 있습니다.")], -1),
						H("ul", null, [(B(!0), V(z, null, R(w.value, (e) => (B(), V("li", {
							key: e.label,
							class: N({ passed: e.passed })
						}, [H("span", null, P(e.passed ? "✓" : "–"), 1), U(P(e.label), 1)], 2))), 128))]),
						v.value?.plannerReadiness ? (B(), V("div", {
							key: 0,
							class: N(["reference-library__readiness", { ready: v.value.plannerReadiness.ready }])
						}, [H("strong", null, P(v.value.plannerReadiness.ready ? "Planner 사용 가능" : "Planner 사용 차단"), 1), v.value.plannerReadiness.ready ? (B(), V("span", lN, "현재 저장 상태가 모든 검색 조건을 충족합니다.")) : (B(), V("ul", uN, [(B(!0), V(z, null, R(v.value.plannerReadiness.blockers, (e) => (B(), V("li", { key: e.code }, [H("code", null, P(e.code), 1), U(P(e.message), 1)]))), 128))]))], 2)) : W("", !0)
					]),
					H("label", null, [t[63] ||= H("span", null, "레퍼런스 변경 사유", -1), L(H("input", {
						"onUpdate:modelValue": t[22] ||= (e) => _.changeNote = e,
						type: "text",
						maxlength: "1000",
						placeholder: "레퍼런스 등록·수정·승인 사유"
					}, null, 512), [[K, _.changeNote]])])
				], 8, VM),
				H("div", dN, [
					_.sourceUrl ? (B(), V("a", {
						key: 0,
						class: "tiny-button",
						href: _.sourceUrl,
						target: "_blank",
						rel: "noopener noreferrer"
					}, "원본 사이트 열기", 8, fN)) : W("", !0),
					t[64] ||= H("span", { class: "reference-library__footer-spacer" }, null, -1),
					v.value && _.status !== "archived" ? (B(), V("button", {
						key: 1,
						class: "tiny-button",
						type: "button",
						disabled: c.value || l.value,
						onClick: t[23] ||= (e) => oe("archived")
					}, "보관", 8, pN)) : W("", !0),
					v.value && _.status === "draft" ? (B(), V("button", {
						key: 2,
						class: "tiny-button",
						type: "button",
						disabled: c.value || l.value,
						onClick: t[24] ||= (e) => oe("review")
					}, "검토 요청", 8, mN)) : W("", !0),
					v.value && _.status !== "approved" && _.status !== "archived" ? (B(), V("button", {
						key: 3,
						class: "tiny-button primary",
						type: "button",
						disabled: c.value || l.value || !T.value,
						onClick: t[25] ||= (e) => oe("approved")
					}, "LLM 사용 승인", 8, hN)) : W("", !0),
					H("button", {
						class: "tiny-button primary",
						type: "submit",
						disabled: c.value
					}, P(c.value ? "저장 중…" : v.value ? "변경 저장" : "초안 등록"), 9, gN)
				]),
				v.value ? (B(), V("details", _N, [H("summary", null, "변경 이력 " + P(S.value.length) + "건", 1), H("ol", null, [(B(!0), V(z, null, R(S.value, (e) => (B(), V("li", { key: e.id }, [
					H("strong", null, P(e.action === "created" ? "등록" : e.action === "status_changed" ? "상태 변경" : "수정"), 1),
					H("span", null, P(e.previousStatus ? `${D(e.previousStatus)} → ` : "") + P(D(e.newStatus)), 1),
					H("small", null, P(e.changedBy) + " · " + P(k(e.changedAt)) + " · " + P(e.changeNote || "사유 없음"), 1)
				]))), 128))])])) : W("", !0)
			], 32)])
		]));
	}
}, [["__scopeId", "data-v-53d013e4"]]), yN = /* @__PURE__ */ s((() => {
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
	function C(e) {
		return /promo-ui-design-view|promo-ui-design-generate/.test(String(e || ""));
	}
	function w(e, t) {
		let n = String(e || "").trim();
		if (!n) return !1;
		if (n.startsWith("data:image/")) return !0;
		if (C(n)) return !1;
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
	function k(e) {
		if (!e || e.asset_type !== "generated_image") return !1;
		let t = Number(e.file_size || 0), n = String(e.mime_type || "").toLowerCase();
		return t > 0 && (t < 1024 || !n.startsWith("image/"));
	}
	function A(e = 5) {
		let t = new Uint8Array(e);
		if (window.crypto?.getRandomValues) window.crypto.getRandomValues(t);
		else for (let n = 0; n < e; n += 1) t[n] = Math.floor(Math.random() * 256);
		return Array.from(t, (e) => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[e % 62]).join("");
	}
	function ee() {
		return `promo-${x(/* @__PURE__ */ new Date())}-${A(5)}`;
	}
	function te(e) {
		return new Promise((t) => {
			window.setTimeout(t, e);
		});
	}
	function ne(e) {
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
	function ae(e) {
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
	function j({ id: e, brandId: t, brandName: n, slug: r, markdown: i, sourceName: a, designTokenFileName: o = "", designTokensJson: s = {}, status: c, updatedAt: l }) {
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
			summary: ae(i)
		};
	}
	function oe() {
		return [
			j({
				id: "doc-001",
				brandId: "brand-ggpoker",
				brandName: "GGPoker",
				slug: "ggpoker",
				markdown: "---\nname: GGPoker-promo-design\ndescription: A high-contrast promo system with black casino surfaces, red CTA emphasis, compact step bars, and legal-first footer treatment.\ncolors:\n  primary: \"#d52b1e\"\n  cta: \"#e12d25\"\n  canvas: \"#f3f3f3\"\n  ink: \"#151515\"\ntypography:\n  heading: \"Pretendard, Arial, sans-serif\"\n  body: \"Pretendard, Arial, sans-serif\"\n---\n\n## Overview\n\nHigh contrast promotional landing pages that prioritize bonus clarity, quick CTA access, and market-specific responsible gaming compliance.\n\n## Colors\n\n### Brand & Accent\n\n- Primary red: #d52b1e\n- CTA red: #e12d25\n- Dark surface: #151515\n\n### Surface\n\n- Canvas: #f3f3f3\n- Content card: #ffffff\n\n## Typography\n\n### Font Family\n\n- Heading: Pretendard, Arial, sans-serif\n- Body: Pretendard, Arial, sans-serif\n\n## Layout\n\nTemplate 4 uses a fixed sequence of Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, and Footer.\n\n## Components\n\nButtons are pill-shaped red CTAs. Step bars use a dark background with large red numbers.\n\n## Responsive Behavior\n\nHero background and minimum height should be configurable separately for desktop and mobile.\n\n## Do's and Don'ts\n\nDo keep legal text visible. Do not hide responsible gaming badges or market-specific terms.",
				sourceName: "docs/design-md/ggpoker/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:00"
			}),
			j({
				id: "doc-002",
				brandId: "brand-apple",
				brandName: "Apple",
				slug: "apple",
				markdown: "---\nname: Apple-design-analysis\ndescription: Photography-first product presentation with minimal chrome, SF-style typography, and a single blue action color.\ncolors:\n  primary: \"#0066cc\"\n  canvas: \"#ffffff\"\n  ink: \"#1d1d1f\"\ntypography:\n  heading: \"SF Pro Display, system-ui, sans-serif\"\n  body: \"SF Pro Text, system-ui, sans-serif\"\n---\n\n## Overview\n\nA clean product-gallery design system with restrained UI and high emphasis on product imagery.\n\n## Colors\n\n- Action Blue: #0066cc\n- Ink: #1d1d1f\n- Canvas: #ffffff\n- Soft Surface: #f5f5f7\n\n## Typography\n\n- Heading: SF Pro Display, system-ui, sans-serif\n- Body: SF Pro Text, system-ui, sans-serif\n\n## Layout\n\nWide, calm sections with strong product focus and large vertical rhythm.\n\n## Components\n\nButtons are compact pills or text links, with minimal border and shadow use.",
				sourceName: "docs/design-md/apple/DESIGN.md",
				status: "seeded",
				updatedAt: "2026-06-25 12:05"
			}),
			j({
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
	function se(e) {
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
	function ce(e) {
		return {
			primaryColor: e.colorTokens.primary,
			ctaColor: e.colorTokens.cta,
			canvasColor: e.colorTokens.canvas,
			headingFont: e.typographyTokens.headingFont,
			bodyFont: e.typographyTokens.bodyFont,
			titleWeight: e.typographyTokens.heroTitleWeight
		};
	}
	var { createApp: le } = Vue, ue = new URLSearchParams(window.location.search), de = ue.get("view") === "admin" ? "prompts" : "builder", fe = ue.get("tab"), pe = [
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
	].includes(fe) ? fe : "promo-form", M = le({
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
				currentView: de,
				adminTab: pe,
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
				return this.styleSource === "design_md" && this.selectedDocument ? se(this.selectedDocument) : ce(this.selectedPreset);
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
					capabilities: { layoutRegions: [
						"copy-primary",
						"copy-secondary",
						"center"
					] },
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
						timeoutMs: f.timeoutMs ?? (u ? p.timeoutMs : ""),
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
					this.designDocuments = oe(), this.mdListSource = "fallback 더미", (!this.selectedDocumentId || !this.selectedDocument) && (this.selectedDocumentId = this.designDocuments[0]?.id || ""), localStorage.setItem(e.selectedDocumentId, this.selectedDocumentId), this.resetOverride(), this.selectedDesignDetail = null, this.setStatus("Neon API를 사용할 수 없어 더미 데이터를 사용합니다");
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
				return e ? e.status === "n8n_failed" || e.errorMessage ? "failed" : e.status === "n8n_ui_design_pending" ? "pending" : w(e.imageUrl, e) ? "image" : e.finalDesignPreviewUrl ? "final_design" : e.lofiDraftPreviewUrl ? "lofi_draft" : /queued|generating|running|pending|accepted/i.test(e.generationRunStatus || "") ? "pending" : e.designUrl || e.pageUrl || C(e.imageUrl) ? "view" : e.payload ? "draft" : "empty" : "empty";
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
				return w(e?.imageUrl, e) ? e.imageUrl : e?.finalDesignPreviewUrl ? e.finalDesignPreviewUrl : e?.lofiDraftPreviewUrl || "";
			},
			previewFrameUrl(e) {
				return e && S(e.designUrl || e.pageUrl || (C(e.imageUrl) ? e.imageUrl : ""), e.id) || "";
			},
			storedResultToPage(e, t = {}) {
				let n = e?.run || {}, r = Array.isArray(e?.assets) ? e.assets : [], i = r.find((e) => e.asset_type === "generated_image") || {}, a = r.filter((e) => /_markdown$/.test(e.asset_type || "")), o = n.run_key || t.id || "", s = n.created_at || t.createdAt || "", c = i.created_at || t.committedAt || s, l = s ? y(s) : "", u = c ? y(c) : l, d = k(i), f = Number(i.file_size || 0);
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
					generationPolling: ne(n),
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
				return !e?.generationRunId || (e.generationPolling = ne({
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
				let i = j({
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
					t < n - 1 && await te(r);
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
				let e = ee(), t = this.buildGeneratedPayload(e), n = x(t.generatedAt);
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
				r.status = i ? "n8n_ui_design_generated" : "draft", r.designUrl = S(i?.designUrl || T(r.id), r.id), r.imageUrl = i?.imageUrl || "", r.pageUrl = S(i?.designUrl || i?.pageUrl || i?.previewUrl || T(r.id), r.id) || i?.imageUrl || "", r.resultType = i?.resultType || this.resultType(r), r.layoutMapping = i?.layoutMapping || null, r.mdComplianceMap = i?.mdComplianceMap || null, r.imagePrompt = i?.imagePrompt || "", r.promptGroupId = i?.promptGroupId || "", r.designPromptStorageKey = i?.designPromptStorageKey || "", r.promoInputStorageKey = i?.promoInputStorageKey || "", r.integratedBriefStorageKey = i?.integratedBriefStorageKey || "";
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
	M.component("template-layout-manager", window.PromoAdminTemplateLayout.component), M.component("section-layout-preset-manager", window.PromoAdminSectionLayouts.component), M.component("design-token-manager", window.PromoAdminDesignTokens.component), M.component("llm-model-manager", window.PromoAdminLlmModels.component), M.component("prompt-variable-manager", window.PromoAdminPromptVariables.component), M.component("component-generation-workspace", window.PromoAdminComponentGeneration.component), M.component("render-spec-editor", window.PromoAdminComponentGeneration.renderSpecEditor), M.component("directus-integration-settings", window.PromoAdminIntegrations.directusSettings), M.component("layout-reference-manager", window.PromoAdminLayoutReferences.component), (window.PromoI18n?.init?.() || Promise.resolve()).finally(() => M.mount("#app"));
}));
wh(document), globalThis.Vue = xh, globalThis.PromoAdminTemplateLayout = Object.freeze({
	service: Ah,
	component: Yh
}), globalThis.PromoAdminDesignTokens = Object.freeze({
	service: Qh,
	component: C_
}), globalThis.PromoAdminPromptGroups = R_, globalThis.PromoAdminModelCatalog = J_, globalThis.PromoAdminLlmModels = Object.freeze({
	service: X_,
	component: Nv
}), globalThis.PromoAdminPromptVariables = Object.freeze({
	service: Fv,
	component: ey
}), globalThis.PromoAdminSectionLayouts = Object.freeze({
	service: iy,
	component: nC
}), globalThis.PromoAdminComponentGeneration = Object.freeze({
	component: Yw,
	renderSpecEditor: PC
}), globalThis.PromoAdminIntegrations = Object.freeze({ directusSettings: wT }), globalThis.PromoAdminLayoutReferences = Object.freeze({
	service: SM,
	component: vN
}), await Promise.resolve().then(() => /* @__PURE__ */ u(yN()));
//#endregion
