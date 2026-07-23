//#region node_modules/.pnpm/@vue+shared@3.5.39/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), D = /\B([A-Z])/g, O = ee((e) => e.replace(D, "-$1").toLowerCase()), k = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = ee((e) => e ? `on${k(e)}` : ""), A = (e, t) => !Object.is(e, t), j = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, M = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, re = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ie, ae = () => ie ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function oe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? le(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var N = /;(?![^(]*\))/g, se = /:([^]+)/, ce = /\/\*[^]*?\*\//g;
function le(e) {
	let t = {};
	return e.replace(ce, "").split(N).forEach((e) => {
		if (e) {
			let n = e.split(se);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function P(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = P(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ue = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", de = /* @__PURE__ */ e(ue);
ue + "";
function fe(e) {
	return !!e || e === "";
}
function F(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = I(e[r], t[r]);
	return n;
}
function I(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? F(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !I(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function pe(e, t) {
	return e.findIndex((e) => I(e, t));
}
var me = (e) => !!(e && e.__v_isRef === !0), L = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? me(e) ? L(e.value) : JSON.stringify(e, he, 2) : String(e), he = (e, t) => me(t) ? he(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ge(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ge(e)) } : _(t) ? ge(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ge = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, R, _e = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && R && (R.active ? (this.parent = R, this.index = (R.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = R;
			try {
				return R = this, e();
			} finally {
				R = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = R, R = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (R === this) R = this.prevScope;
			else {
				let e = R;
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
function ve() {
	return R;
}
var z, ye = /* @__PURE__ */ new WeakSet(), be = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, R && (R.active ? R.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, ye.has(this) && (ye.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || we(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Fe(this), De(this);
		let e = z, t = V;
		z = this, V = !0;
		try {
			return this.fn();
		} finally {
			Oe(this), z = e, V = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) B(e);
			this.deps = this.depsTail = void 0, Fe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? ye.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ke(this) && this.run();
	}
	get dirty() {
		return ke(this);
	}
}, xe = 0, Se, Ce;
function we(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ce, Ce = e;
		return;
	}
	e.next = Se, Se = e;
}
function Te() {
	xe++;
}
function Ee() {
	if (--xe > 0) return;
	if (Ce) {
		let e = Ce;
		for (Ce = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Se;) {
		let t = Se;
		for (Se = void 0; t;) {
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
function De(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Oe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), B(r), je(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ke(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ae(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ae(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ie) || (e.globalVersion = Ie, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ke(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = z, r = V;
	z = e, V = !0;
	try {
		De(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		z = n, V = r, Oe(e), e.flags &= -3;
	}
}
function B(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) B(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function je(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var V = !0, Me = [];
function Ne() {
	Me.push(V), V = !1;
}
function Pe() {
	let e = Me.pop();
	V = e === void 0 || e;
}
function Fe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = z;
		z = void 0;
		try {
			t();
		} finally {
			z = e;
		}
	}
}
var Ie = 0, Le = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Re = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!z || !V || z === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== z) t = this.activeLink = new Le(z, this), z.deps ? (t.prevDep = z.depsTail, z.depsTail.nextDep = t, z.depsTail = t) : z.deps = z.depsTail = t, ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = z.depsTail, t.nextDep = void 0, z.depsTail.nextDep = t, z.depsTail = t, z.deps === t && (z.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ie++, this.notify(e);
	}
	notify(e) {
		Te();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ee();
		}
	}
};
function ze(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ze(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Be = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ Symbol(""), He = /* @__PURE__ */ Symbol(""), Ue = /* @__PURE__ */ Symbol("");
function H(e, t, n) {
	if (V && z) {
		let t = Be.get(e);
		t || Be.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Re()), r.map = t, r.key = n), r.track();
	}
}
function We(e, t, n, r, i, a) {
	let o = Be.get(e);
	if (!o) {
		Ie++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Te(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ue || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ue)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ve)), f(e) && s(o.get(He)));
				break;
			case "delete":
				i || (s(o.get(Ve)), f(e) && s(o.get(He)));
				break;
			case "set":
				f(e) && s(o.get(Ve));
				break;
		}
	}
	Ee();
}
function Ge(e) {
	let t = /* @__PURE__ */ U(e);
	return t === e ? t : (H(t, "iterate", Ue), /* @__PURE__ */ At(e) ? t : t.map(Nt));
}
function Ke(e) {
	return H(e = /* @__PURE__ */ U(e), "iterate", Ue), e;
}
function qe(e, t) {
	return /* @__PURE__ */ kt(e) ? Pt(/* @__PURE__ */ Ot(e) ? Nt(t) : t) : Nt(t);
}
var Je = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ye(this, Symbol.iterator, (e) => qe(this, e));
	},
	concat(...e) {
		return Ge(this).concat(...e.map((e) => d(e) ? Ge(e) : e));
	},
	entries() {
		return Ye(this, "entries", (e) => (e[1] = qe(this, e[1]), e));
	},
	every(e, t) {
		return Ze(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Ze(this, "filter", e, t, (e) => e.map((e) => qe(this, e)), arguments);
	},
	find(e, t) {
		return Ze(this, "find", e, t, (e) => qe(this, e), arguments);
	},
	findIndex(e, t) {
		return Ze(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Ze(this, "findLast", e, t, (e) => qe(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Ze(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Ze(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return $e(this, "includes", e);
	},
	indexOf(...e) {
		return $e(this, "indexOf", e);
	},
	join(e) {
		return Ge(this).join(e);
	},
	lastIndexOf(...e) {
		return $e(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Ze(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return et(this, "pop");
	},
	push(...e) {
		return et(this, "push", e);
	},
	reduce(e, ...t) {
		return Qe(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Qe(this, "reduceRight", e, t);
	},
	shift() {
		return et(this, "shift");
	},
	some(e, t) {
		return Ze(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return et(this, "splice", e);
	},
	toReversed() {
		return Ge(this).toReversed();
	},
	toSorted(e) {
		return Ge(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ge(this).toSpliced(...e);
	},
	unshift(...e) {
		return et(this, "unshift", e);
	},
	values() {
		return Ye(this, "values", (e) => qe(this, e));
	}
};
function Ye(e, t, n) {
	let r = Ke(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ At(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Xe = Array.prototype;
function Ze(e, t, n, r, i, a) {
	let o = Ke(e), s = o !== e && !/* @__PURE__ */ At(e), c = o[t];
	if (c !== Xe[t]) {
		let t = c.apply(e, a);
		return s ? Nt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, qe(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Qe(e, t, n, r) {
	let i = Ke(e), a = i !== e && !/* @__PURE__ */ At(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = qe(e, t)), n.call(this, t, qe(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? qe(e, c) : c;
}
function $e(e, t, n) {
	let r = /* @__PURE__ */ U(e);
	H(r, "iterate", Ue);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ jt(n[0]) ? (n[0] = /* @__PURE__ */ U(n[0]), r[t](...n)) : i;
}
function et(e, t, n = []) {
	Ne(), Te();
	let r = (/* @__PURE__ */ U(e))[t].apply(e, n);
	return Ee(), Pe(), r;
}
var tt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), nt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function rt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ U(this);
	return H(t, "has", e), t.hasOwnProperty(e);
}
var it = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? St : xt : i ? bt : yt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Je[t])) return e;
			if (t === "hasOwnProperty") return rt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ W(e) ? e : n);
		if ((_(t) ? nt.has(t) : tt(t)) || (r || H(e, "get", t), i)) return o;
		if (/* @__PURE__ */ W(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Et(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Et(o) : /* @__PURE__ */ wt(o) : o;
	}
}, at = class extends it {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ kt(i);
			if (!/* @__PURE__ */ At(n) && !/* @__PURE__ */ kt(n) && (i = /* @__PURE__ */ U(i), n = /* @__PURE__ */ U(n)), !a && /* @__PURE__ */ W(i) && !/* @__PURE__ */ W(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ W(e) ? e : r);
		return e === /* @__PURE__ */ U(r) && s && (o ? A(n, i) && We(e, "set", t, n, i) : We(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && We(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !nt.has(t)) && H(e, "has", t), n;
	}
	ownKeys(e) {
		return H(e, "iterate", d(e) ? "length" : Ve), Reflect.ownKeys(e);
	}
}, ot = class extends it {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, st = /* @__PURE__ */ new at(), ct = /* @__PURE__ */ new ot(), lt = /* @__PURE__ */ new at(!0), ut = (e) => e, dt = (e) => Reflect.getPrototypeOf(e);
function ft(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ U(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? ut : t ? Pt : Nt;
		return !t && H(a, "iterate", l ? He : Ve), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function pt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function mt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ U(r), a = /* @__PURE__ */ U(n);
			e || (A(n, a) && H(i, "get", n), H(i, "get", a));
			let { has: o } = dt(i), s = t ? ut : e ? Pt : Nt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && H(/* @__PURE__ */ U(t), "iterate", Ve), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ U(n), i = /* @__PURE__ */ U(t);
			return e || (A(t, i) && H(r, "has", t), H(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ U(a), s = t ? ut : e ? Pt : Nt;
			return !e && H(o, "iterate", Ve), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: pt("add"),
		set: pt("set"),
		delete: pt("delete"),
		clear: pt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ U(this), r = dt(n), i = /* @__PURE__ */ U(e), a = !t && !/* @__PURE__ */ At(e) && !/* @__PURE__ */ kt(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), We(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ At(n) && !/* @__PURE__ */ kt(n) && (n = /* @__PURE__ */ U(n));
			let r = /* @__PURE__ */ U(this), { has: i, get: a } = dt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ U(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && We(r, "set", e, n, s) : We(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ U(this), { has: n, get: r } = dt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ U(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && We(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ U(this), t = e.size !== 0, n = e.clear();
			return t && We(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = ft(r, e, t);
	}), n;
}
function ht(e, t) {
	let n = mt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var gt = { get: /* @__PURE__ */ ht(!1, !1) }, _t = { get: /* @__PURE__ */ ht(!1, !0) }, vt = { get: /* @__PURE__ */ ht(!0, !1) }, yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap();
function Ct(e) {
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
function wt(e) {
	return /* @__PURE__ */ kt(e) ? e : Dt(e, !1, st, gt, yt);
}
// @__NO_SIDE_EFFECTS__
function Tt(e) {
	return Dt(e, !1, lt, _t, bt);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return Dt(e, !0, ct, vt, xt);
}
function Dt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ct(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return /* @__PURE__ */ kt(e) ? /* @__PURE__ */ Ot(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ U(t) : e;
}
function Mt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && M(e, "__v_skip", !0), e;
}
var Nt = (e) => v(e) ? /* @__PURE__ */ wt(e) : e, Pt = (e) => v(e) ? /* @__PURE__ */ Et(e) : e;
// @__NO_SIDE_EFFECTS__
function W(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	return Ft(e, !1);
}
function Ft(e, t) {
	return /* @__PURE__ */ W(e) ? e : new It(e, t);
}
var It = class {
	constructor(e, t) {
		this.dep = new Re(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ U(e), this._value = t ? e : Nt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ At(e) || /* @__PURE__ */ kt(e);
		e = n ? e : /* @__PURE__ */ U(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Nt(e), this.dep.trigger());
	}
};
function Lt(e) {
	return /* @__PURE__ */ W(e) ? e.value : e;
}
var Rt = {
	get: (e, t, n) => t === "__v_raw" ? e : Lt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ W(i) && !/* @__PURE__ */ W(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function zt(e) {
	return /* @__PURE__ */ Ot(e) ? e : new Proxy(e, Rt);
}
var Bt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Re(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ie - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && z !== this) return we(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ae(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Vt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Bt(r, i, n);
}
var Ht = {}, Ut = /* @__PURE__ */ new WeakMap(), Wt = void 0;
function Gt(e, t = !1, n = Wt) {
	if (n) {
		let t = Ut.get(n);
		t || Ut.set(n, t = []), t.push(e);
	}
}
function Kt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ At(e) || o === !1 || o === 0 ? qt(e, 1) : qt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ W(e) ? (g = () => e.value, y = /* @__PURE__ */ At(e)) : /* @__PURE__ */ Ot(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Ot(e) || /* @__PURE__ */ At(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ W(e)) return e.value;
		if (/* @__PURE__ */ Ot(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ne();
			try {
				_();
			} finally {
				Pe();
			}
		}
		let t = Wt;
		Wt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Wt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => qt(e(), t);
	}
	let x = ve(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Ht) : Ht, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => A(e, C[t])) : A(t, C))) {
				_ && _();
				let e = Wt;
				Wt = m;
				try {
					let e = [
						t,
						C === Ht ? void 0 : b && C[0] === Ht ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Wt = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new be(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Gt(e, !1, m), _ = m.onStop = () => {
		let e = Ut.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Ut.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function qt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ W(e)) qt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) qt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		qt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) qt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && qt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Jt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Xt(e, t, n);
	}
}
function Yt(e, t, n, r) {
	if (h(e)) {
		let i = Jt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Xt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Yt(e[a], t, n, r));
		return i;
	}
}
function Xt(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Ne(), Jt(o, null, 10, [
				e,
				i,
				a
			]), Pe();
			return;
		}
	}
	Zt(e, r, a, i, s);
}
function Zt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var K = [], Qt = -1, $t = [], en = null, tn = 0, nn = /* @__PURE__ */ Promise.resolve(), rn = null;
function an(e) {
	let t = rn || nn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function on(e) {
	let t = Qt + 1, n = K.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = K[r], a = fn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function sn(e) {
	if (!(e.flags & 1)) {
		let t = fn(e), n = K[K.length - 1];
		!n || !(e.flags & 2) && t >= fn(n) ? K.push(e) : K.splice(on(t), 0, e), e.flags |= 1, cn();
	}
}
function cn() {
	rn ||= nn.then(pn);
}
function ln(e) {
	d(e) ? $t.push(...e) : en && e.id === -1 ? en.splice(tn + 1, 0, e) : e.flags & 1 || ($t.push(e), e.flags |= 1), cn();
}
function un(e, t, n = Qt + 1) {
	for (; n < K.length; n++) {
		let t = K[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			K.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function dn(e) {
	if ($t.length) {
		let e = [...new Set($t)].sort((e, t) => fn(e) - fn(t));
		if ($t.length = 0, en) {
			en.push(...e);
			return;
		}
		for (en = e, tn = 0; tn < en.length; tn++) {
			let e = en[tn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		en = null, tn = 0;
	}
}
var fn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function pn(e) {
	try {
		for (Qt = 0; Qt < K.length; Qt++) {
			let e = K[Qt];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Jt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Qt < K.length; Qt++) {
			let e = K[Qt];
			e && (e.flags &= -2);
		}
		Qt = -1, K.length = 0, dn(e), rn = null, (K.length || $t.length) && pn(e);
	}
}
var mn = null, hn = null;
function gn(e) {
	let t = mn;
	return mn = e, hn = e && e.type.__scopeId || null, t;
}
function _n(e, t = mn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Si(-1);
		let i = gn(t), a;
		try {
			a = e(...n);
		} finally {
			gn(i), r._d && Si(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function vn(e, n) {
	if (mn === null) return e;
	let r = ia(mn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && qt(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function yn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ne(), Yt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Pe());
	}
}
function bn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function xn(e, t, n = !1) {
	let r = Ui();
	if (r || Tr) {
		let i = Tr ? Tr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Sn = /* @__PURE__ */ Symbol.for("v-scx"), Cn = () => xn(Sn);
function wn(e, t, n) {
	return Tn(e, t, n);
}
function Tn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Yi) {
		if (c === "sync") {
			let e = Cn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => Yt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ni(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : sn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Kt(e, n, u);
	return Yi && (f ? f.push(h) : d && h()), h;
}
function En(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Dn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Ki(this), s = Tn(i, a.bind(r), n);
	return o(), s;
}
function Dn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var On = /* @__PURE__ */ Symbol("_vte"), kn = (e) => e.__isTeleport, An = /* @__PURE__ */ Symbol("_leaveCb");
function jn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, jn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Mn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Nn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Pn = /* @__PURE__ */ new WeakMap();
function Fn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Fn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Ln(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Fn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? ia(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ U(v), b = v === t ? i : (e) => !Nn(_, e) && u(y, e), x = (e, t) => !(t && Nn(_, t));
	if (m != null && m !== p) {
		if (In(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ W(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Ne();
		try {
			Jt(p, f, 12, [l, _]);
		} finally {
			Pe();
		}
	} else {
		let t = g(p), n = /* @__PURE__ */ W(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Pn.delete(e);
				};
				t.id = -1, Pn.set(e, t), ni(t, r);
			} else In(e), i();
		}
	}
}
function In(e) {
	let t = Pn.get(e);
	t && (t.flags |= 8, Pn.delete(e));
}
ae().requestIdleCallback, ae().cancelIdleCallback;
var Ln = (e) => !!e.type.__asyncLoader, Rn = (e) => e.type.__isKeepAlive;
function zn(e, t) {
	Vn(e, "a", t);
}
function Bn(e, t) {
	Vn(e, "da", t);
}
function Vn(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Un(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Rn(e.parent.vnode) && Hn(r, t, n, e), e = e.parent;
	}
}
function Hn(e, t, n, r) {
	let i = Un(t, e, r, !0);
	Xn(() => {
		c(r[t], i);
	}, n);
}
function Un(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ne();
			let i = Ki(n), a = Yt(t, n, e, r);
			return i(), Pe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Wn = (e) => (t, n = $) => {
	(!Yi || e === "sp") && Un(e, (...e) => t(...e), n);
}, Gn = Wn("bm"), Kn = Wn("m"), qn = Wn("bu"), Jn = Wn("u"), Yn = Wn("bum"), Xn = Wn("um"), Zn = Wn("sp"), Qn = Wn("rtg"), $n = Wn("rtc");
function er(e, t = $) {
	Un("ec", e, t);
}
var tr = /* @__PURE__ */ Symbol.for("v-ndc");
function nr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Ot(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ At(e), s = /* @__PURE__ */ kt(e), e = Ke(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Pt(Nt(e[n])) : Nt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
var rr = (e) => e ? Ji(e) ? ia(e) : rr(e.parent) : null, ir = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => rr(e.parent),
	$root: (e) => rr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => pr(e),
	$forceUpdate: (e) => e.f ||= () => {
		sn(e.update);
	},
	$nextTick: (e) => e.n ||= an.bind(e.proxy),
	$watch: (e) => En.bind(e)
}), ar = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), or = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (ar(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else cr && (s[n] = 0);
		}
		let d = ir[n], f, p;
		if (d) return n === "$attrs" && H(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return ar(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || ar(n, c) || u(o, c) || u(i, c) || u(ir, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function sr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var cr = !0;
function lr(e) {
	let t = pr(e), n = e.proxy, i = e.ctx;
	cr = !1, t.beforeCreate && dr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: ee, renderTriggered: te, errorCaptured: E, serverPrefetch: D, expose: O, inheritAttrs: k, components: ne, directives: A, filters: j } = t;
	if (u && ur(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ wt(t));
	}
	if (cr = !0, o) for (let e in o) {
		let t = o[e], a = oa({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) fr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			bn(t, e[t]);
		});
	}
	f && dr(f, e, "c");
	function M(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(Gn, p), M(Kn, m), M(qn, g), M(Jn, _), M(zn, y), M(Bn, b), M(er, E), M($n, ee), M(Qn, te), M(Yn, S), M(Xn, w), M(Zn, D), d(O)) if (O.length) {
		let t = e.exposed ||= {};
		O.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), k != null && (e.inheritAttrs = k), ne && (e.components = ne), A && (e.directives = A), D && Mn(e);
}
function ur(e, t, n = r) {
	d(e) && (e = vr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? xn(r.from || n, r.default, !0) : xn(r.from || n) : xn(r), /* @__PURE__ */ W(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function dr(e, t, n) {
	Yt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function fr(e, t, n, r) {
	let i = r.includes(".") ? Dn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && wn(i, n);
	} else if (h(e)) wn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => fr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && wn(i, r, e);
	}
}
function pr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => mr(c, e, o, !0)), mr(c, t, o)), v(t) && a.set(t, c), c;
}
function mr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && mr(e, a, n, !0), i && i.forEach((t) => mr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = hr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var hr = {
	data: gr,
	props: br,
	emits: br,
	methods: yr,
	computed: yr,
	beforeCreate: q,
	created: q,
	beforeMount: q,
	mounted: q,
	beforeUpdate: q,
	updated: q,
	beforeDestroy: q,
	beforeUnmount: q,
	destroyed: q,
	unmounted: q,
	activated: q,
	deactivated: q,
	errorCaptured: q,
	serverPrefetch: q,
	components: yr,
	directives: yr,
	watch: xr,
	provide: gr,
	inject: _r
};
function gr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function _r(e, t) {
	return yr(vr(e), vr(t));
}
function vr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function q(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function yr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function br(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), sr(e), sr(t ?? {})) : t;
}
function xr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = q(e[r], t[r]);
	return n;
}
function Sr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
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
var Cr = 0;
function wr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Sr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Cr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: sa,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || ki(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, ia(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (Yt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Tr;
				Tr = l;
				try {
					return e();
				} finally {
					Tr = t;
				}
			}
		};
		return l;
	};
}
var Tr = null, Er = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function Dr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Er(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(re)));
	let c, l = i[c = ne(n)] || i[c = ne(E(n))];
	!l && o && (l = i[c = ne(O(n))]), l && Yt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Yt(u, e, 6, a);
	}
}
var Or = /* @__PURE__ */ new WeakMap();
function kr(e, t, n = !1) {
	let r = n ? Or : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = kr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Ar(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function jr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = gn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Fi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Fi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Mr(c);
		}
	} catch (t) {
		vi.length = 0, Xt(t, e, 1), v = ki(gi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Nr(y, a)), b = Mi(b, y, !1, !0));
	}
	return n.dirs && (b = Mi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && jn(b, n.transition), v = b, gn(_), v;
}
var Mr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Nr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Pr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Fr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ir(o, r, n) && !Ar(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Fr(r, o, l) : !!o;
	return !1;
}
function Fr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Ir(t, e, a) && !Ar(n, a)) return !0;
	}
	return !1;
}
function Ir(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !I(r, i) : r !== i;
}
function Lr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Rr = {}, zr = () => Object.create(Rr), Br = (e) => Object.getPrototypeOf(e) === Rr;
function Vr(e, t, n, r = !1) {
	let i = {}, a = zr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ur(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Tt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Hr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ U(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Ar(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = E(o);
					i[t] = Wr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Ur(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = O(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Wr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && We(e.attrs, "set", "");
}
function Ur(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Ar(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ U(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Wr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Wr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ki(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
var Gr = /* @__PURE__ */ new WeakMap();
function Kr(e, r, i = !1) {
	let a = i ? Gr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Kr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		qr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (qr(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				} else n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function qr(e) {
	return e[0] !== "$" && !T(e);
}
var Jr = (e) => e === "_" || e === "_ctx" || e === "$stable", Yr = (e) => d(e) ? e.map(Fi) : [Fi(e)], Xr = (e, t, n) => {
	if (t._n) return t;
	let r = _n((...e) => Yr(t(...e)), n);
	return r._c = !1, r;
}, Zr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Jr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Xr(n, i, r);
		else if (i != null) {
			let e = Yr(i);
			t[n] = () => e;
		}
	}
}, Qr = (e, t) => {
	let n = Yr(t);
	e.slots.default = () => n;
}, $r = (e, t, n) => {
	for (let r in t) (n || !Jr(r)) && (e[r] = t[r]);
}, ei = (e, t, n) => {
	let r = e.slots = zr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? ($r(r, t, n), n && M(r, "_", e, !0)) : Zr(t, r);
	} else t && Qr(e, t);
}, ti = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : $r(a, n, r) : (o = !n.$stable, Zr(n, a)), s = n;
	} else n && (Qr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Jr(e) && s[e] == null && delete a[e];
}, ni = mi;
function ri(e) {
	return ii(e);
}
function ii(e, i) {
	let a = ae();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ei(e, t) && (r = I(e), P(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case hi:
				y(e, t, n, r);
				break;
			case gi:
				b(e, t, n, r);
				break;
			case _i:
				e ?? x(t, n, r, o);
				break;
			case J:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? A(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, L);
		}
		u != null && i ? Fn(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Fn(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
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
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, ai(e, a), s, u), _ && yn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && zi(f, r, e);
		}
		_ && yn(e, null, r, "beforeMount");
		let v = si(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ni(() => {
			try {
				f && zi(f, r, e), v && g.enter(d), _ && yn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || pi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ii(e[l]) : Fi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && oi(r, !1), (g = h.onVnodeBeforeUpdate) && zi(g, r, n, e), f && yn(n, e, r, "beforeUpdate"), r && oi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, ai(n, a), o) : s || N(e, n, l, null, r, i, ai(n, a), o, !1), u > 0) {
			if (u & 16) k(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && k(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && ni(() => {
			g && zi(g, r, n, e), f && yn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === J || !Ei(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, k = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ne = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ci(e, t, !0)) : N(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : re(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = Hi(e, r, i);
		if (Rn(e) && (s.ctx.renderer = L), Xi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = ki(gi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (Pr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			oe(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ui(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							ni(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				oi(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && j(n), (d = t.props && t.props.onVnodeBeforeUpdate) && zi(d, s, t, c), oi(e, !0);
				let f = jr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), I(p), e, i, a), t.el = f.el, u === null && Lr(e, f.el), r && ni(r, i), (d = t.props && t.props.onVnodeUpdated) && ni(() => zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ln(t);
				if (oi(e, !1), l && j(l), !m && (o = c && c.onVnodeBeforeMount) && zi(o, d, t), oi(e, !0), s && ge) {
					let t = () => {
						e.subTree = jr(e), ge(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = jr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ni(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ni(() => zi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ln(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ni(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new be(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => sn(u), oi(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Hr(e, t.props, r, n), ti(e, t.children, n), Ne(), un(e), Pe();
	}, N = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && F(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ce(l, d, n, r, i, a, o, s, c) : F(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, se = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ii(t[p]) : Fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? F(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, ce = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Ii(t[u]) : Fi(t[u]);
			if (Ei(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Ii(t[p]) : Fi(t[p]);
			if (Ei(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ii(t[u]) : Fi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) P(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Ii(t[u]) : Fi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					P(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ei(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? P(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? li(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || fi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? le(n, r, p, 2) : _--);
			}
		}
	}, le = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			le(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, L);
			return;
		}
		if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) le(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === _i) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[An] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ni(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[An];
				a._isLeaving && a[An](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, P = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ne(), Fn(s, null, n, e, !0), Pe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ln(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && zi(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && yn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, L, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? F(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && F(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ni(() => {
			_ && zi(_, t, e), h && yn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === J) {
			de(n, r);
			return;
		}
		if (t === _i) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, de = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, fe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		di(c), di(l), r && j(r), i.stop(), a && (a.flags |= 8, P(o, e, t, n)), s && ni(s, t), ni(() => {
			e.isUnmounted = !0;
		}, t);
	}, F = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) P(e[o], t, n, r, i);
	}, I = (e) => {
		if (e.shapeFlag & 6) return I(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[On];
		return n ? h(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (P(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, un(r), dn(), !1);
	}, L = {
		p: v,
		um: P,
		m: le,
		r: ue,
		mt: M,
		mc: E,
		pc: N,
		pbc: O,
		n: I,
		o: e
	}, he, ge;
	return i && ([he, ge] = i(L)), {
		render: me,
		hydrate: he,
		createApp: wr(me, he)
	};
}
function ai({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function oi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function si(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ci(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ii(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ci(t, a)), a.type === hi && (a.patchFlag === -1 && (a = i[e] = Ii(a)), a.el = t.el), a.type === gi && !a.el && (a.el = t.el);
	}
}
function li(e) {
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
function ui(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ui(t);
}
function di(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function fi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? fi(t.subTree) : null;
}
var pi = (e) => e.__isSuspense;
function mi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : ln(e);
}
var J = /* @__PURE__ */ Symbol.for("v-fgt"), hi = /* @__PURE__ */ Symbol.for("v-txt"), gi = /* @__PURE__ */ Symbol.for("v-cmt"), _i = /* @__PURE__ */ Symbol.for("v-stc"), vi = [], yi = null;
function Y(e = !1) {
	vi.push(yi = e ? null : []);
}
function bi() {
	vi.pop(), yi = vi[vi.length - 1] || null;
}
var xi = 1;
function Si(e, t = !1) {
	xi += e, e < 0 && yi && t && (yi.hasOnce = !0);
}
function Ci(e) {
	return e.dynamicChildren = xi > 0 ? yi || n : null, bi(), xi > 0 && yi && yi.push(e), e;
}
function X(e, t, n, r, i, a) {
	return Ci(Z(e, t, n, r, i, a, !0));
}
function wi(e, t, n, r, i) {
	return Ci(ki(e, t, n, r, i, !0));
}
function Ti(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ei(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Di = ({ key: e }) => e ?? null, Oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ W(e) || h(e) ? {
	i: mn,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === J ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Di(t),
		ref: t && Oi(t),
		scopeId: hn,
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
		ctx: mn
	};
	return s ? (Li(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), xi > 0 && !o && yi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && yi.push(c), c;
}
var ki = Ai;
function Ai(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === tr) && (e = gi), Ti(e)) {
		let r = Mi(e, t, !0);
		return n && Li(r, n), xi > 0 && !a && yi && (r.shapeFlag & 6 ? yi[yi.indexOf(e)] = r : yi.push(r)), r.patchFlag = -2, r;
	}
	if (aa(e) && (e = e.__vccOpts), t) {
		t = ji(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = P(e)), v(n) && (/* @__PURE__ */ jt(n) && !d(n) && (n = s({}, n)), t.style = oe(n));
	}
	let o = g(e) ? 1 : pi(e) ? 128 : kn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function ji(e) {
	return e ? /* @__PURE__ */ jt(e) || Br(e) ? s({}, e) : e : null;
}
function Mi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ri(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Di(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Oi(t)) : [a, Oi(t)] : Oi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== J ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Mi(e.ssContent),
		ssFallback: e.ssFallback && Mi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && jn(u, c.clone(u)), u;
}
function Ni(e = " ", t = 0) {
	return ki(hi, null, e, t);
}
function Pi(e, t) {
	let n = ki(_i, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (Y(), wi(gi, null, e)) : ki(gi, null, e);
}
function Fi(e) {
	return e == null || typeof e == "boolean" ? ki(gi) : d(e) ? ki(J, null, e.slice()) : Ti(e) ? Ii(e) : ki(hi, null, String(e));
}
function Ii(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Mi(e);
}
function Li(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Li(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Br(t) ? t._ctx = mn : r === 3 && mn && (mn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Li(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: mn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ni(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ri(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = P([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function zi(e, t, n, r = null) {
	Yt(e, t, 7, [n, r]);
}
var Bi = Sr(), Vi = 0;
function Hi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Bi, o = {
		uid: Vi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new _e(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Kr(i, a),
		emitsOptions: kr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Dr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Ui = () => $ || mn, Wi, Gi;
{
	let e = ae(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Wi = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), Gi = t("__VUE_SSR_SETTERS__", (e) => Yi = e);
}
var Ki = (e) => {
	let t = $;
	return Wi(e), e.scope.on(), () => {
		e.scope.off(), Wi(t);
	};
}, qi = () => {
	$ && $.scope.off(), Wi(null);
};
function Ji(e) {
	return e.vnode.shapeFlag & 4;
}
var Yi = !1;
function Xi(e, t = !1, n = !1) {
	t && Gi(t);
	let { props: r, children: i } = e.vnode, a = Ji(e);
	Vr(e, r, a, t), ei(e, i, n || t);
	let o = a ? Zi(e, t) : void 0;
	return t && Gi(!1), o;
}
function Zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, or);
	let { setup: r } = n;
	if (r) {
		Ne();
		let n = e.setupContext = r.length > 1 ? ra(e) : null, i = Ki(e), a = Jt(r, e, 0, [e.props, n]), o = y(a);
		if (Pe(), i(), (o || e.sp) && !Ln(e) && Mn(e), o) {
			if (a.then(qi, qi), t) return a.then((n) => {
				Qi(e, n, t);
			}).catch((t) => {
				Xt(t, e, 0);
			});
			e.asyncDep = a;
		} else Qi(e, a, t);
	} else ta(e, t);
}
function Qi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = zt(t)), ta(e, n);
}
var $i, ea;
function ta(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && $i && !i.render) {
			let t = i.template || pr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = $i(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o));
			}
		}
		e.render = i.render || r, ea && ea(e);
	}
	{
		let t = Ki(e);
		Ne();
		try {
			lr(e);
		} finally {
			Pe(), t();
		}
	}
}
var na = { get(e, t) {
	return H(e, "get", ""), e[t];
} };
function ra(e) {
	return {
		attrs: new Proxy(e.attrs, na),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ia(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(zt(Mt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ir) return ir[n](e);
		},
		has(e, t) {
			return t in e || t in ir;
		}
	}) : e.proxy;
}
function aa(e) {
	return h(e) && "__vccOpts" in e;
}
var oa = (e, t) => /* @__PURE__ */ Vt(e, t, Yi), sa = "3.5.39", ca = void 0, la = typeof window < "u" && window.trustedTypes;
if (la) try {
	ca = /* @__PURE__ */ la.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ua = ca ? (e) => ca.createHTML(e) : (e) => e, da = "http://www.w3.org/2000/svg", fa = "http://www.w3.org/1998/Math/MathML", pa = typeof document < "u" ? document : null, ma = pa && /* @__PURE__ */ pa.createElement("template"), ha = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? pa.createElementNS(da, e) : t === "mathml" ? pa.createElementNS(fa, e) : n ? pa.createElement(e, { is: n }) : pa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => pa.createTextNode(e),
	createComment: (e) => pa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => pa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			ma.innerHTML = ua(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ma.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ga = /* @__PURE__ */ Symbol("_vtc");
function _a(e, t, n) {
	let r = e[ga];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var va = /* @__PURE__ */ Symbol("_vod"), ya = /* @__PURE__ */ Symbol("_vsh"), ba = /* @__PURE__ */ Symbol(""), xa = /(?:^|;)\s*display\s*:/;
function Sa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? wa(r, t, "");
		}
		else for (let e in t) n[e] ?? wa(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? wa(r, i, "") : Oa(e, i, !g(t) && t ? t[i] : void 0, o) || wa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ba];
			e && (n += ";" + e), r.cssText = n, a = xa.test(n);
		}
	} else t && e.removeAttribute("style");
	va in e && (e[va] = a ? r.display : "", e[ya] && (r.display = "none"));
}
var Ca = /\s*!important$/;
function wa(e, t, n) {
	if (d(n)) n.forEach((n) => wa(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = Da(e, t);
		Ca.test(n) ? e.setProperty(O(r), n.replace(Ca, ""), "important") : e[r] = n;
	}
}
var Ta = [
	"Webkit",
	"Moz",
	"ms"
], Ea = {};
function Da(e, t) {
	let n = Ea[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return Ea[t] = r;
	r = k(r);
	for (let n = 0; n < Ta.length; n++) {
		let i = Ta[n] + r;
		if (i in e) return Ea[t] = i;
	}
	return t;
}
function Oa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ka = "http://www.w3.org/1999/xlink";
function Aa(e, t, n, r, i, a = de(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ka, t.slice(6, t.length)) : e.setAttributeNS(ka, t, n) : n == null || a && !fe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ja(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ua(n) : n);
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
		r === "boolean" ? n = fe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ma(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Na(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Pa = /* @__PURE__ */ Symbol("_vei");
function Fa(e, t, n, r, i = null) {
	let a = e[Pa] || (e[Pa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ra(t);
		r ? Ma(e, n, a[t] = Ha(r, i), s) : o && (Na(e, n, o, s), a[t] = void 0);
	}
}
var Ia = /(Once|Passive|Capture)$/, La = /^on:?(?:Once|Passive|Capture)$/;
function Ra(e) {
	let t, n;
	for (; (n = e.match(Ia)) && !La.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var za = 0, Ba = /* @__PURE__ */ Promise.resolve(), Va = () => za ||= (Ba.then(() => za = 0), Date.now());
function Ha(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && Yt(e, t, 5, a);
			}
		} else Yt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Va(), n;
}
var Ua = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Wa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? _a(e, r, c) : t === "style" ? Sa(e, n, r) : a(t) ? o(t) || Fa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Ga(e, t, r, c)) ? (ja(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Aa(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ka(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ja(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Aa(e, t, r, c));
};
function Ga(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ua(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ua(t) && g(n) ? !1 : t in e;
}
function Ka(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var qa = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => j(t, e) : t;
};
function Ja(e) {
	e.target.composing = !0;
}
function Ya(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Xa = /* @__PURE__ */ Symbol("_assign");
function Za(e, t, n) {
	return t && (e = e.trim()), n && (e = re(e)), e;
}
var Qa = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[Xa] = qa(i);
		let a = r || i.props && i.props.type === "number";
		Ma(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Xa](Za(e.value, n, a));
		}), (n || a) && Ma(e, "change", () => {
			e.value = Za(e.value, n, a);
		}), t || (Ma(e, "compositionstart", Ja), Ma(e, "compositionend", Ya), Ma(e, "change", Ya));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Xa] = qa(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? re(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, $a = {
	deep: !0,
	created(e, t, n) {
		e[Xa] = qa(n), Ma(e, "change", () => {
			let t = e._modelValue, n = to(e), r = e.checked, i = e[Xa];
			if (d(t)) {
				let e = pe(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(no(e, r));
		});
	},
	mounted: eo,
	beforeUpdate(e, t, n) {
		e[Xa] = qa(n), eo(e, t, n);
	}
};
function eo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = pe(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = I(t, no(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
function to(e) {
	return "_value" in e ? e._value : e.value;
}
function no(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ro = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], io = {
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
	exact: (e, t) => ro.some((n) => e[`${n}Key`] && !t.includes(n))
}, ao = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = io[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, oo = /* @__PURE__ */ s({ patchProp: Wa }, ha), so;
function co() {
	return so ||= ri(oo);
}
var lo = ((...e) => {
	let t = co().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = fo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, uo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function uo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function fo(e) {
	return g(e) ? document.querySelector(e) : e;
}
var po = "default-promo-renderer", mo = "promoVisualEditor.snapshot.v1", ho = Object.freeze([
	{
		key: "canvas-light",
		name: "Canvas Light",
		value: "#f5f7fb",
		textColor: "#172033"
	},
	{
		key: "surface-light",
		name: "Surface Light",
		value: "#ffffff",
		textColor: "#172033"
	},
	{
		key: "canvas-dark",
		name: "Canvas Dark",
		value: "#0b0f17",
		textColor: "#f5f7fb"
	},
	{
		key: "surface-dark",
		name: "Surface Dark",
		value: "#171d29",
		textColor: "#f5f7fb"
	},
	{
		key: "brand-forest",
		name: "Brand Forest",
		value: "#123e36",
		textColor: "#ffffff"
	},
	{
		key: "brand-red",
		name: "Brand Red",
		value: "#8f1d2c",
		textColor: "#ffffff"
	}
]), go = Object.freeze({
	contractVersion: 1,
	specKey: "default",
	theme: {
		backgroundColor: "#f5f7fb",
		textColor: "#172033",
		accentColor: "#156b5b",
		ctaColor: "#156b5b",
		ctaShape: "round",
		ctaVariant: "fill",
		fontFamily: "Inter, Pretendard, sans-serif"
	},
	responsive: {
		contentMaxWidth: 1280,
		contentMinWidth: 1140,
		mobileBreakpoint: 720
	},
	itemStyles: {},
	sectionStyles: {}
}), _o = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
function vo(e) {
	return JSON.parse(JSON.stringify(e));
}
function yo(e) {
	return e?.isLocked && e.lockedValue !== null && e.lockedValue !== void 0 ? vo(e.lockedValue) : e?.fieldKind === "cta" ? {
		label: e.defaultValue || "",
		link: "",
		target: "_self"
	} : e?.fieldKind === "image" ? {
		source: e.image?.allowedSources?.[0] || "url",
		value: e.defaultValue || "",
		description: "",
		alt: ""
	} : e?.defaultValue || "";
}
function bo(e, t = {}) {
	return Object.fromEntries((e || []).map((e) => [e.sectionKey, Object.fromEntries((e.items || []).map((n) => [n.itemKey, xo(n, t?.[e.sectionKey]?.[n.itemKey])]))]));
}
function xo(e, t) {
	let n = Array.isArray(e?.fields) ? e.fields : [];
	if (n.length <= 1) return t ?? yo(n[0] || e);
	let r = t?.fields && typeof t.fields == "object" ? t.fields : {};
	return { fields: Object.fromEntries(n.map((e) => [e.fieldKey, r[e.fieldKey] ?? yo(e)])) };
}
function So({ template: e, configRevision: t, sections: n, sectionInputs: r, designSpec: i = go }) {
	return {
		snapshotVersion: 1,
		renderer: {
			key: po,
			version: 1,
			buildId: "visual-editor-p1-v1"
		},
		content: {
			contractVersion: 1,
			formTemplate: {
				...e,
				configRevision: t
			},
			sectionSnapshot: vo(n),
			sectionInputs: vo(r),
			sectionOrder: n.map((e) => e.sectionKey)
		},
		designSpec: vo(i),
		assets: {
			contractVersion: 1,
			items: {}
		},
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region visual-editor/src/editor-utils.mjs
var Co = /* @__PURE__ */ new Set(["http:", "https:"]);
function wo(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return Co.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
function To(e = {}) {
	let t = { ...e };
	return delete t.positionMode, delete t.xPct, delete t.yPx, delete t.yPct, t;
}
function Eo(e, t, n) {
	try {
		return e.setItem(t, JSON.stringify(n)), {
			ok: !0,
			code: "saved",
			message: ""
		};
	} catch (e) {
		let t = e?.name === "QuotaExceededError" || e?.name === "NS_ERROR_DOM_QUOTA_REACHED" || e?.code === 22 || e?.code === 1014;
		return {
			ok: !1,
			code: t ? "quota-exceeded" : "storage-failed",
			message: t ? "브라우저 저장 공간이 부족합니다. 배경 이미지 용량을 줄이거나 제거한 뒤 다시 시도해주세요." : "Web Output Snapshot을 저장하지 못했습니다. 다시 시도해주세요."
		};
	}
}
//#endregion
//#region visual-editor/src/PromoPageRenderer.vue
var Do = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, Oo = ["data-section-key", "aria-busy"], ko = ["title"], Ao = {
	key: 0,
	"aria-hidden": "true"
}, jo = { class: "rendered-section__inner" }, Mo = [
	"data-item-key",
	"data-style-key",
	"onClick",
	"onPointerdown",
	"onDblclick"
], No = {
	key: 0,
	class: "rendered-component-fields"
}, Po = [
	"href",
	"target",
	"rel"
], Fo = {
	key: 1,
	class: "rendered-component-field"
}, Io = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Lo = {
	key: 0,
	class: "rendered-image__placeholder"
}, Ro = {
	key: 0,
	"aria-hidden": "true"
}, zo = {
	key: 2,
	class: "rendered-text rendered-component-field"
}, Bo = {
	key: 3,
	class: "rendered-empty rendered-component-field"
}, Vo = [
	"href",
	"target",
	"rel"
], Ho = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Uo = {
	key: 0,
	class: "rendered-image__placeholder"
}, Wo = ["title"], Go = {
	key: 0,
	"aria-hidden": "true"
}, Ko = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], qo = {
	key: 0,
	class: "rendered-text"
}, Jo = {
	key: 1,
	class: "rendered-empty"
}, Yo = [
	"aria-label",
	"title",
	"onPointerdown"
], Xo = {
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
		selectedItemKey: {
			type: String,
			default: ""
		},
		sectionDesignRuns: {
			type: Object,
			default: () => ({})
		}
	},
	emits: [
		"select-item",
		"update-item-style",
		"update-renderer-item-style",
		"update-item-content",
		"update-section-style"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = oa(() => {
			let e = n.content?.sectionSnapshot || [], t = n.content?.sectionOrder || [], r = new Map(t.map((e, t) => [e, t]));
			return [...e].sort((e, t) => (r.get(e.sectionKey) ?? e.sortOrder ?? 0) - (r.get(t.sectionKey) ?? t.sortOrder ?? 0));
		});
		function a(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function o(e, t, r = null) {
			let i = n.content?.sectionInputs?.[e.sectionKey]?.[t.itemKey];
			return !r || a(t).length <= 1 ? i : i?.fields?.[r.fieldKey];
		}
		function s(e) {
			let t = String(e?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(t) ? t : "";
		}
		function c(e, t) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) && e.aiDesign.imageTargetItemKeys.includes(t?.itemKey);
		}
		function l(e, t, n) {
			if (c(e, t)) return !1;
			let r = String(n?.value || "").trim();
			return n?.source === "ai" || r.startsWith("/api/promo-section-design-image?");
		}
		function u(e) {
			return (e.items || []).filter((t) => t.fieldKind !== "image" || !l(e, t, o(e, t)));
		}
		function d(e) {
			let t = String(g(e).backgroundImage || "").trim(), n = (e.items || []).filter((e) => e.fieldKind === "image").map((t) => ({
				item: t,
				value: o(e, t)
			})).find(({ item: t, value: n }) => l(e, t, n)), r = t || String(n?.value?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(r) ? r : "";
		}
		function f(e) {
			return wo(e?.link);
		}
		function p(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function m(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function h(e, t) {
			return n.designSpec?.itemStyles?.[m(e, t)] || {};
		}
		function g(e) {
			return n.designSpec?.sectionStyles?.[e.sectionKey] || {};
		}
		let _ = /* @__PURE__ */ new Set([
			"queued",
			"analyzing_content",
			"generating_layout",
			"validating_layout",
			"generating_assets",
			"validating_assets",
			"applying"
		]);
		function v(e) {
			return n.sectionDesignRuns?.[e.sectionKey] || null;
		}
		function y(e, t) {
			let n = t === "item" ? "AI 이미지" : "AI 배경";
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
		function b(e, t = null, n = null) {
			let r = v(e), i = r?.constraintsSnapshot?.imageTarget;
			return (t ? i?.type === "item" && i.itemKey === t.itemKey && (!n || !i.fieldKey || i.fieldKey === n.fieldKey) : i?.type === "section-background") ? _.has(r.status) ? {
				kind: "processing",
				label: y(r.status, i.type)
			} : r.status === "failed" ? {
				kind: "failed",
				label: i.type === "item" ? "AI 이미지 생성 실패" : "AI 배경 생성 실패",
				detail: String(r.errorMessage || "").trim()
			} : null : null;
		}
		function x(e, t) {
			let n = h(e, t);
			return n.shape === "circle" || n.aspectRatioLocked !== !1 ? [
				"nw",
				"ne",
				"se",
				"sw"
			] : [
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
		function S(e, t, n, r) {
			let i = Number(e);
			return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
		}
		function C(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function w(e, t) {
			return t.shape === "circle" ? "1 / 1" : C(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function T(e, t) {
			let n = h(e, t), r = s(o(e, t)), i = [
				"square",
				"rounded",
				"circle"
			].includes(n.shape) ? n.shape : "square";
			return {
				backgroundImage: r ? `url(${JSON.stringify(r)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(n.imageFit) ? n.imageFit : "contain",
				backgroundPosition: n.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				borderRadius: i === "circle" ? "50%" : i === "rounded" ? "var(--promo-image-radius, 24px)" : "0"
			};
		}
		function ee(e, t, r) {
			return n.designSpec?.itemStyles?.[`${m(e, t)}.${r.fieldKey}`] || {};
		}
		function te(e, t, n) {
			let r = ee(e, t, n), i = s(o(e, t, n)), a = [
				"square",
				"rounded",
				"circle"
			].includes(r.shape) ? r.shape : "square";
			return {
				backgroundImage: i ? `url(${JSON.stringify(i)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(r.imageFit) ? r.imageFit : "contain",
				backgroundPosition: r.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				aspectRatio: C(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius, 24px)" : "0"
			};
		}
		function E(e, t, n) {
			let r = ee(e, t, n), i = o(e, t, n);
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
		function D(e, t) {
			let n = h(e, t), r = o(e, t);
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
		function O(e) {
			return a(e).length > 1 ? a(e).reduce((e, t) => e + O(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
		}
		function k(e) {
			return Math.max(180, (e.items || []).reduce((e, t) => e + O(t), 0) + 52);
		}
		function ne(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((e, t) => e + O(t), 0), a = g(e).minHeight || k(e), o = Math.max(50, a - 76);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function A(e) {
			return [
				"none",
				"left",
				"right",
				"both"
			].includes(e.backgroundFadeMode) ? e.backgroundFadeMode : e.backgroundFadeSafeArea === "left-copy" ? "left" : e.backgroundFadeSafeArea === "right-copy" ? "right" : e.backgroundFadeSafeArea === "center-copy" ? "both" : "none";
		}
		function j(e) {
			let t = String(e.backgroundColor || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(t)) return t;
			let r = String(n.designSpec?.theme?.backgroundColor || "").trim();
			return /^#[0-9a-f]{6}$/i.test(r) ? r : "#f5f7fb";
		}
		function M(e, t, n = "medium") {
			if (!/^#[0-9a-f]{6}$/i.test(String(t || ""))) return "";
			let r = {
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
			return e === "left" ? `linear-gradient(to right, ${t} 0%, ${t} ${r.solid}%, transparent ${r.clear}%)` : e === "right" ? `linear-gradient(to left, ${t} 0%, ${t} ${r.solid}%, transparent ${r.clear}%)` : e === "both" ? `linear-gradient(to right, ${t} 0%, transparent ${r.edge}%, transparent ${100 - r.edge}%, ${t} 100%)` : "";
		}
		function re(e) {
			let t = g(e), n = t.minHeight || k(e), r = d(e), i = j(t), a = r ? M(A(t), i, t.backgroundFadeStrength) : "";
			return {
				height: `${Math.max(50, n)}px`,
				backgroundColor: i,
				backgroundImage: r ? [a, `url(${JSON.stringify(r)})`].filter(Boolean).join(", ") : void 0,
				backgroundSize: r ? a ? `100% 100%, ${t.backgroundSize || "contain"}` : t.backgroundSize || "contain" : void 0,
				backgroundPosition: r ? a ? `center, ${t.backgroundPosition || "center center"}` : t.backgroundPosition || "center center" : void 0,
				backgroundRepeat: r ? a ? `no-repeat, ${t.backgroundRepeat || "no-repeat"}` : t.backgroundRepeat || "no-repeat" : void 0
			};
		}
		function ie(e) {
			let t = g(e).minHeight || k(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function ae(e, t) {
			let n = h(e, t), r = n.positionMode === "free" ? n : ne(e, t), i = t.fieldKind === "image", a = S(n.widthPct, 10, 100, 32), o = S(n.heightPx, 80, 900, void 0);
			return {
				left: `${r.xPct || 0}%`,
				top: n.yPx === void 0 ? `${r.yPct || 0}%` : `${n.yPx}px`,
				zIndex: n.zIndex || 2,
				color: n.color,
				"--item-color": n.color,
				fontSize: n.fontSize ? `${n.fontSize}px` : void 0,
				"--item-font-size": n.fontSize ? `${n.fontSize}px` : void 0,
				fontWeight: n.fontWeight,
				"--item-font-weight": n.fontWeight,
				textAlign: n.textAlign,
				width: i ? `${a}%` : void 0,
				height: i && n.shape !== "circle" && o ? `${o}px` : void 0,
				aspectRatio: i && (!o || n.shape === "circle") ? w(t, n) : void 0
			};
		}
		function N(e, t) {
			n.editable && r("select-item", e, t);
		}
		function se(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.target.closest(".image-resize-handle") || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), N(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
			let s = o.getBoundingClientRect(), c = a.getBoundingClientRect(), l = e.clientX, u = e.clientY, d = c.left - s.left, f = c.top - s.top, p = d, m = f, h = 0, g = (e) => {
				p = Math.min(Math.max(0, s.width - a.offsetWidth), Math.max(0, d + e.clientX - l)), m = Math.min(Math.max(0, s.height - a.offsetHeight), Math.max(0, f + e.clientY - u)), !h && (h = requestAnimationFrame(() => {
					h = 0, a.style.left = `${p}px`, a.style.top = `${m}px`;
				}));
			}, _ = () => {
				h && cancelAnimationFrame(h);
				let e = s.width ? p / s.width * 100 : 0;
				r("update-item-style", {
					positionMode: "free",
					xPct: e,
					yPx: m
				}), a.classList.remove("is-dragging"), a.removeEventListener("pointermove", g), a.removeEventListener("pointerup", _), a.removeEventListener("pointercancel", _);
			};
			a.addEventListener("pointermove", g), a.addEventListener("pointerup", _), a.addEventListener("pointercancel", _);
		}
		function ce(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || i.fieldKind !== "image" || e.button !== 0) return;
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c) return;
			e.preventDefault(), e.stopPropagation(), N(t, i), o.setPointerCapture(e.pointerId), s.classList.add("is-resizing");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = u.width, m = u.height, g = u.left - l.left, _ = u.top - l.top, v = m ? p / m : 1, y = h(t, i), b = y.aspectRatioLocked !== !1, x = p, S = m, C = g, w = _, T = 0, ee = (e) => {
				let t = a.includes("w") || a.includes("e"), n = a.includes("n") || a.includes("s"), r = a.includes("w") ? -1 : 1, i = a.includes("n") ? -1 : 1, o = (e.clientX - d) * r, c = (e.clientY - f) * i, u = Math.max(80, a.includes("w") ? p + g : l.width - g), h = Math.max(80, a.includes("n") ? m + _ : l.height - _), ee = t ? Math.min(u, Math.max(80, p + o)) : p, te = n ? Math.min(h, Math.max(80, m + c)) : m;
				if (b || y.shape === "circle") {
					let e = y.shape === "circle" ? 1 : v;
					Math.abs(c) > Math.abs(o) ? (S = te, x = Math.min(u, Math.max(80, S * e)), S = x / e) : (x = ee, S = Math.min(h, Math.max(80, x / e)), x = S * e);
				} else x = ee, S = te;
				C = a.includes("w") ? g + p - x : g, w = a.includes("n") ? _ + m - S : _, !T && (T = requestAnimationFrame(() => {
					T = 0, s.style.left = `${C}px`, s.style.top = `${w}px`, s.style.width = `${x}px`, s.style.height = `${S}px`, s.style.aspectRatio = "auto";
				}));
			}, te = () => {
				T && cancelAnimationFrame(T), r("update-renderer-item-style", t, i, {
					positionMode: "free",
					xPct: l.width ? C / l.width * 100 : 0,
					yPx: w,
					widthPct: l.width ? x / l.width * 100 : 32,
					heightPx: b || y.shape === "circle" ? void 0 : S,
					aspectRatio: `${Math.max(1, Math.round(x))}/${Math.max(1, Math.round(S))}`
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", ee), o.removeEventListener("pointerup", te), o.removeEventListener("pointercancel", te);
			};
			o.addEventListener("pointermove", ee), o.addEventListener("pointerup", te), o.addEventListener("pointercancel", te);
		}
		function le(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || i.fieldKind !== "image" || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = h(t, i), s = o.aspectRatioLocked !== !1, c = e.shiftKey ? 4 : 1, l = a.includes("w") || a.includes("e"), u = a.includes("n") || a.includes("s"), d = l ? a.includes("w") ? e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0 : e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0 : 0, f = u ? a.includes("n") ? e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0 : e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0 : 0, p = d || f;
			if (s && !p || !s && !d && !f) return;
			let m = S((o.widthPct ?? 32) + (s ? p : d) * c, 10, 100, 32), g = S(o.heightPx, 80, 900, 240);
			r("update-renderer-item-style", t, i, {
				widthPct: m,
				heightPx: s || o.shape === "circle" ? void 0 : u ? S(g + f * c * 4, 80, 900, 240) : g
			});
		}
		function ue(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "text") return;
			e.preventDefault(), e.stopPropagation(), N(t, i);
			let a = e.currentTarget, s = a.querySelector(".rendered-text, .rendered-empty");
			if (!s) return;
			a.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", String(o(t, i) || "").trim() || (s.textContent = _o), s.focus();
			let c = window.getSelection(), l = document.createRange();
			l.selectNodeContents(s), c.removeAllRanges(), c.addRange(l);
			let u = () => {
				let e = s.innerText.replace(/\r\n?/g, "\n").trim() || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
				r("update-item-content", t, i, e), s.contentEditable = "false", a.classList.remove("is-editing"), s.removeEventListener("blur", u), s.removeEventListener("keydown", d);
			}, d = (e) => {
				e.key === "Escape" && (e.preventDefault(), s.blur());
			};
			s.addEventListener("blur", u), s.addEventListener("keydown", d);
		}
		function de(e, t) {
			if (!n.editable || e.button !== 0) return;
			let i = e.currentTarget, a = i.closest(".rendered-section");
			if (!a) return;
			let o = a.querySelector(".rendered-items");
			e.preventDefault(), e.stopPropagation(), t.items?.[0] && r("select-item", t, t.items[0]), i.setPointerCapture(e.pointerId), a.classList.add("is-resizing");
			let s = e.clientY, c = a.getBoundingClientRect().height, l = o?.getBoundingClientRect();
			o && l && [...o.querySelectorAll(".rendered-item")].forEach((e) => {
				let n = (t.items || []).find((t) => t.itemKey === e.dataset.itemKey);
				if (!n) return;
				let i = e.getBoundingClientRect().top - l.top;
				e.style.top = `${i}px`, r("update-renderer-item-style", t, n, {
					positionMode: "free",
					yPx: i
				});
			});
			let u = l ? Math.max(0, c - l.height) : 76, d = o ? [...o.querySelectorAll(".rendered-item")].reduce((e, t) => {
				let n = t.getBoundingClientRect();
				return Math.max(e, n.bottom - l.top);
			}, 0) : 0, f = Math.max(50, Math.ceil(d + u)), p = (e) => {
				let n = Math.min(1200, Math.max(f, c + e.clientY - s));
				r("update-section-style", t.sectionKey, { minHeight: n });
			}, m = () => {
				a.classList.remove("is-resizing"), i.removeEventListener("pointermove", p), i.removeEventListener("pointerup", m), i.removeEventListener("pointercancel", m);
			};
			i.addEventListener("pointermove", p), i.addEventListener("pointerup", m), i.addEventListener("pointercancel", m);
		}
		return (t, n) => (Y(), X("div", {
			class: P(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-editor-guides": e.editable && e.showGuides
			}]),
			style: oe({
				"--promo-bg": e.designSpec.theme.backgroundColor,
				"--promo-ink": e.designSpec.theme.textColor,
				"--promo-accent": e.designSpec.theme.accentColor,
				"--promo-cta": e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor,
				"--promo-cta-bg": e.designSpec.theme.ctaVariant === "ghost" ? "transparent" : e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor,
				"--promo-cta-ink": e.designSpec.theme.ctaVariant === "ghost" ? e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor : "#ffffff",
				"--promo-cta-radius": e.designSpec.theme.ctaShape === "round" ? "999px" : "2px",
				"--promo-font": e.designSpec.theme.fontFamily,
				"--promo-width": `${Math.min(1280, Number(e.designSpec.responsive.contentMaxWidth || 1280))}px`,
				"--promo-min-width": `${e.designSpec.responsive.contentMinWidth || 0}px`
			})
		}, [e.editable && e.showGuides ? (Y(), X("div", Do)) : Q("", !0), (Y(!0), X(J, null, nr(i.value, (t) => (Y(), X("section", {
			key: t.sectionKey,
			class: P(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: oe(re(t)),
			"aria-busy": b(t)?.kind === "processing" ? "true" : void 0
		}, [
			e.editable && b(t) ? (Y(), X("div", {
				key: 0,
				class: P(["section-ai-state", `is-${b(t).kind}`]),
				role: "status",
				"aria-live": "polite",
				title: b(t).detail || void 0
			}, [b(t).kind === "processing" ? (Y(), X("i", Ao)) : Q("", !0), Z("span", null, L(b(t).label), 1)], 10, ko)) : Q("", !0),
			Z("div", jo, [Z("div", {
				class: "rendered-items",
				style: oe(ie(t))
			}, [(Y(!0), X(J, null, nr(u(t), (r) => (Y(), X("article", {
				key: r.itemKey,
				class: P(["rendered-item", [`rendered-item--${r.fieldKind || "text"}`, {
					"is-editable": e.editable && !r.isLocked,
					"is-selected": e.editable && e.selectedItemKey === m(t, r),
					"is-free-positioned": !0
				}]]),
				"data-item-key": r.itemKey,
				"data-style-key": m(t, r),
				style: oe(ae(t, r)),
				onClick: ao((e) => N(t, r), ["stop"]),
				onPointerdown: (e) => se(e, t, r),
				onDblclick: (e) => ue(e, t, r)
			}, [a(r).length > 1 ? (Y(), X("div", No, [(Y(!0), X(J, null, nr(a(r), (i) => (Y(), X(J, { key: i.fieldKey }, [i.fieldKind === "cta" ? (Y(), X("a", {
				key: 0,
				class: "rendered-cta rendered-component-field",
				href: f(o(t, r, i)),
				target: o(t, r, i)?.target || "_self",
				rel: o(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, L(o(t, r, i)?.label || i.name), 9, Po)) : i.fieldKind === "image" ? (Y(), X("div", Fo, [Z("div", {
				class: "rendered-image-frame rendered-component-image-frame",
				style: oe(te(t, r, i)),
				role: E(t, r, i).role,
				"aria-label": E(t, r, i).label,
				"aria-hidden": E(t, r, i).ariaHidden,
				"aria-busy": b(t, r, i)?.kind === "processing" ? "true" : void 0
			}, [s(o(t, r, i)) ? Q("", !0) : (Y(), X("div", Lo, [Z("span", null, L(i.name), 1), n[0] ||= Z("small", null, "이미지 준비 중", -1)]))], 12, Io), e.editable && b(t, r, i) ? (Y(), X("div", {
				key: 0,
				class: P(["item-ai-state", `is-${b(t, r, i).kind}`]),
				role: "status",
				"aria-live": "polite"
			}, [b(t, r, i).kind === "processing" ? (Y(), X("i", Ro)) : Q("", !0), Z("span", null, L(b(t, r, i).label), 1)], 2)) : Q("", !0)])) : p(o(t, r, i)) ? (Y(), X("p", zo, L(o(t, r, i)), 1)) : (Y(), X("p", Bo, L(i.name), 1))], 64))), 128))])) : r.fieldKind === "cta" ? (Y(), X("a", {
				key: 1,
				class: "rendered-cta",
				href: f(o(t, r)),
				target: o(t, r)?.target || "_self",
				rel: o(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, L(o(t, r)?.label || r.name), 9, Vo)) : r.fieldKind === "image" ? (Y(), X(J, { key: 2 }, [
				Z("div", {
					class: P(["rendered-image-frame", `rendered-image-frame--${h(t, r).shape || "square"}`]),
					style: oe(T(t, r)),
					role: D(t, r).role,
					"aria-label": D(t, r).label,
					"aria-hidden": D(t, r).ariaHidden,
					"aria-busy": b(t, r)?.kind === "processing" ? "true" : void 0
				}, [s(o(t, r)) ? Q("", !0) : (Y(), X("div", Uo, [Z("span", null, L(r.name), 1), Z("small", null, L(o(t, r)?.value || "이미지 준비 중"), 1)]))], 14, Ho),
				e.editable && b(t, r) ? (Y(), X("div", {
					key: 0,
					class: P(["item-ai-state", `is-${b(t, r).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: b(t, r).detail || void 0
				}, [b(t, r).kind === "processing" ? (Y(), X("i", Go)) : Q("", !0), Z("span", null, L(b(t, r).label), 1)], 10, Wo)) : Q("", !0),
				e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === m(t, r) ? (Y(!0), X(J, { key: 1 }, nr(x(t, r), (e) => (Y(), X("button", {
					key: e,
					type: "button",
					class: P(["image-resize-handle", `image-resize-handle--${e}`]),
					"aria-label": `${r.name} 이미지 ${e} 방향 크기 조절`,
					onPointerdown: ao((n) => ce(n, t, r, e), ["stop"]),
					onKeydown: (n) => le(n, t, r, e)
				}, null, 42, Ko))), 128)) : Q("", !0)
			], 64)) : (Y(), X(J, { key: 3 }, [p(o(t, r)) ? (Y(), X("p", qo, L(o(t, r)), 1)) : (Y(), X("p", Jo, L(r.name), 1))], 64))], 46, Mo))), 128))], 4)]),
			e.editable && e.showGuides ? (Y(), X("button", {
				key: 1,
				class: "section-resize-handle",
				type: "button",
				"aria-label": `${t.name} 섹션 높이 조절`,
				title: `${t.name} 섹션 높이 조절`,
				onPointerdown: (e) => de(e, t)
			}, null, 40, Yo)) : Q("", !0)
		], 14, Oo))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/layout-utils.mjs
function Zo(e) {
	return JSON.parse(JSON.stringify(e));
}
function Qo(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = Qo(n[e], t) : n[e] = Zo(t));
	}), n;
}
function $o(e = {}) {
	return es(go, e);
}
function es(e = go, t = {}) {
	let n = Qo(Zo(e || go), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, n.sectionStyles = n.sectionStyles || {}, n;
}
function ts(e = {}) {
	let t = $o(e), n = [], r = /* @__PURE__ */ new Set([
		"left",
		"center",
		"right"
	]), i = /* @__PURE__ */ new Set(["contain"]), a = /* @__PURE__ */ new Set([
		"left center",
		"center center",
		"right center"
	]), o = /* @__PURE__ */ new Set([
		"none",
		"left",
		"right",
		"both"
	]), s = /* @__PURE__ */ new Set([
		"soft",
		"medium",
		"strong"
	]), c = /* @__PURE__ */ new Set(["contain", "cover"]), l = /* @__PURE__ */ new Set([
		"left top",
		"center top",
		"right top",
		"left center",
		"center center",
		"right center",
		"left bottom",
		"center bottom",
		"right bottom"
	]), u = /* @__PURE__ */ new Set([
		"square",
		"rounded",
		"circle"
	]);
	return Object.entries(t.sectionStyles).forEach(([e, t]) => {
		let r = Number(t?.minHeight);
		t?.minHeight !== void 0 && (!Number.isFinite(r) || r < 50 || r > 1200) && n.push({
			path: `sectionStyles.${e}.minHeight`,
			message: "Section height must be between 50 and 1200."
		}), t?.backgroundSize !== void 0 && !i.has(t.backgroundSize) && n.push({
			path: `sectionStyles.${e}.backgroundSize`,
			message: "Unsupported section background size."
		}), t?.backgroundPosition !== void 0 && !a.has(t.backgroundPosition) && n.push({
			path: `sectionStyles.${e}.backgroundPosition`,
			message: "Unsupported section background position."
		}), t?.backgroundFadeMode !== void 0 && !o.has(t.backgroundFadeMode) && n.push({
			path: `sectionStyles.${e}.backgroundFadeMode`,
			message: "Unsupported section background fade mode."
		}), t?.backgroundFadeStrength !== void 0 && !s.has(t.backgroundFadeStrength) && n.push({
			path: `sectionStyles.${e}.backgroundFadeStrength`,
			message: "Unsupported section background fade strength."
		});
		for (let r of ["backgroundColor", "backgroundFadeColor"]) t?.[r] !== void 0 && !/^#[0-9a-f]{6}$/i.test(String(t[r])) && n.push({
			path: `sectionStyles.${e}.${r}`,
			message: "Section colors must use six-digit hex values."
		});
	}), Object.entries(t.itemStyles).forEach(([e, t]) => {
		let i = Number(t?.xPct), a = Number(t?.yPx), o = Number(t?.fontSize);
		t?.xPct !== void 0 && (!Number.isFinite(i) || i < 0 || i > 100) && n.push({
			path: `itemStyles.${e}.xPct`,
			message: "xPct must be between 0 and 100."
		}), t?.yPx !== void 0 && (!Number.isFinite(a) || a < 0 || a > 1200) && n.push({
			path: `itemStyles.${e}.yPx`,
			message: "yPx must be between 0 and 1200."
		}), t?.fontSize !== void 0 && (!Number.isFinite(o) || o < 10 || o > 80) && n.push({
			path: `itemStyles.${e}.fontSize`,
			message: "fontSize must be between 10 and 80."
		}), t?.textAlign !== void 0 && !r.has(t.textAlign) && n.push({
			path: `itemStyles.${e}.textAlign`,
			message: "Unsupported text alignment."
		});
		let s = Number(t?.widthPct), d = Number(t?.heightPx);
		t?.widthPct !== void 0 && (!Number.isFinite(s) || s < 10 || s > 100) && n.push({
			path: `itemStyles.${e}.widthPct`,
			message: "Image width must be between 10 and 100 percent."
		}), t?.heightPx !== void 0 && (!Number.isFinite(d) || d < 80 || d > 900) && n.push({
			path: `itemStyles.${e}.heightPx`,
			message: "Image height must be between 80 and 900."
		}), t?.imageFit !== void 0 && !c.has(t.imageFit) && n.push({
			path: `itemStyles.${e}.imageFit`,
			message: "Unsupported image fit."
		}), t?.imagePosition !== void 0 && !l.has(t.imagePosition) && n.push({
			path: `itemStyles.${e}.imagePosition`,
			message: "Unsupported image position."
		}), t?.shape !== void 0 && !u.has(t.shape) && n.push({
			path: `itemStyles.${e}.shape`,
			message: "Unsupported image shape."
		}), t?.aspectRatio !== void 0 && !/^\d+(?:\.\d+)?\s*[:/]\s*\d+(?:\.\d+)?$/.test(String(t.aspectRatio)) && n.push({
			path: `itemStyles.${e}.aspectRatio`,
			message: "Unsupported image aspect ratio."
		}), t?.accessibleLabel !== void 0 && String(t.accessibleLabel).length > 240 && n.push({
			path: `itemStyles.${e}.accessibleLabel`,
			message: "Image accessibility label is too long."
		}), t?.aspectRatioLocked !== void 0 && typeof t.aspectRatioLocked != "boolean" && n.push({
			path: `itemStyles.${e}.aspectRatioLocked`,
			message: "Image aspect-ratio lock must be boolean."
		}), t?.decorative !== void 0 && typeof t.decorative != "boolean" && n.push({
			path: `itemStyles.${e}.decorative`,
			message: "Image decorative state must be boolean."
		});
	}), {
		ok: n.length === 0,
		errors: n,
		spec: t
	};
}
//#endregion
//#region visual-editor/src/App.vue
var ns = {
	key: 0,
	class: "output-shell"
}, rs = { class: "output-toolbar" }, is = {
	key: 0,
	class: "system-message system-message--error"
}, as = ["data-shell-frame"], os = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, ss = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, cs = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], ls = ["data-lucide"], us = { "data-shell-nav-label": "" }, ds = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, fs = { class: "shell-page-identity" }, ps = { class: "shell-page-actions" }, ms = {
	class: "shell-status",
	role: "status"
}, hs = {
	key: 0,
	class: "editor-header editor-toolbar"
}, gs = {
	key: 0,
	class: "editor-mode-note"
}, _s = { class: "editor-global-actions" }, vs = {
	key: 0,
	class: "global-token-menu"
}, ys = { class: "global-token-swatches" }, bs = [
	"title",
	"aria-label",
	"onClick"
], xs = {
	key: 1,
	"aria-label": "Visual Editor navigation"
}, Ss = ["disabled"], Cs = {
	key: 1,
	class: "system-message"
}, ws = {
	key: 2,
	class: "system-message system-message--error"
}, Ts = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, Es = {
	key: 4,
	class: "system-message",
	role: "status"
}, Ds = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, Os = { class: "panel-heading" }, ks = { class: "section-list" }, As = ["onClick"], js = ["aria-label"], Ms = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, Ns = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, Ps = { class: "preview-panel" }, Fs = { class: "preview-toolbar" }, Is = { class: "preview-title-group" }, Ls = ["disabled"], Rs = {
	key: 1,
	class: "preview-edit-hint"
}, zs = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, Bs = { class: "preview-controls" }, Vs = ["disabled"], Hs = { class: "guide-toggle" }, Us = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, Ws = { class: "property-panel" }, Gs = { class: "panel-heading" }, Ks = {
	key: 0,
	class: "property-form"
}, qs = { class: "section-properties" }, Js = { class: "section-properties__heading" }, Ys = {
	key: 0,
	class: "section-ai-actions"
}, Xs = ["disabled"], Zs = ["disabled", "title"], Qs = {
	key: 1,
	class: "section-background-alignment"
}, $s = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, ec = ["onClick"], tc = {
	key: 2,
	class: "section-background-fade"
}, nc = ["value"], rc = { key: 0 }, ic = ["value"], ac = { class: "section-size-control" }, oc = ["disabled"], sc = { class: "component-property-list" }, cc = ["aria-expanded", "onClick"], lc = { class: "component-property-body" }, uc = {
	key: 0,
	class: "component-property-content"
}, dc = {
	key: 0,
	class: "component-field-property-list"
}, fc = [
	"disabled",
	"value",
	"onInput"
], pc = [
	"disabled",
	"value",
	"onInput"
], mc = ["disabled", "onClick"], hc = [
	"disabled",
	"value",
	"onChange"
], gc = ["value"], _c = [
	"disabled",
	"value",
	"onInput"
], vc = { key: 1 }, yc = [
	"disabled",
	"value",
	"onInput"
], bc = ["onClick"], xc = { key: 2 }, Sc = [
	"disabled",
	"rows",
	"value",
	"onInput"
], Cc = { key: 1 }, wc = ["disabled", "value"], Tc = { key: 2 }, Ec = ["disabled", "value"], Dc = ["disabled", "title"], Oc = ["disabled", "value"], kc = ["value"], Ac = ["disabled", "value"], jc = { key: 1 }, Mc = ["disabled", "value"], Nc = { key: 2 }, Pc = ["disabled", "value"], Fc = { key: 4 }, Ic = ["disabled", "rows"], Lc = { class: "item-meta" }, Rc = {
	key: 5,
	class: "design-controls"
}, zc = { class: "design-controls__heading" }, Bc = ["disabled"], Vc = {
	key: 0,
	class: "image-frame-controls"
}, Hc = { class: "image-resize-mode" }, Uc = {
	role: "group",
	"aria-label": "이미지 크기 조절 방식"
}, Wc = ["disabled"], Gc = ["disabled"], Kc = { key: 0 }, qc = { class: "range-field" }, Jc = ["disabled", "value"], Yc = ["disabled", "value"], Xc = { key: 0 }, Zc = { class: "range-field" }, Qc = ["disabled", "value"], $c = ["disabled", "value"], el = ["disabled", "value"], tl = ["disabled", "value"], nl = ["disabled", "value"], rl = { class: "toggle-field" }, il = ["disabled", "checked"], al = { key: 1 }, ol = ["disabled", "value"], sl = ["disabled", "value"], cl = { class: "range-field" }, ll = ["disabled", "value"], ul = ["disabled", "value"], dl = ["disabled", "value"], fl = { class: "position-status" }, pl = { key: 0 }, ml = { key: 1 }, hl = ["disabled"], gl = {
	key: 0,
	class: "component-property-empty"
}, _l = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, vl = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ G(t.mode !== "output"), r = /* @__PURE__ */ G(""), i = /* @__PURE__ */ G([]), a = /* @__PURE__ */ G(null), o = /* @__PURE__ */ G(""), s = /* @__PURE__ */ G([]), c = /* @__PURE__ */ G({}), l = /* @__PURE__ */ G(JSON.parse(JSON.stringify(go))), u = /* @__PURE__ */ G(""), d = /* @__PURE__ */ G(""), f = /* @__PURE__ */ G(""), p = /* @__PURE__ */ G(null), m = /* @__PURE__ */ G("desktop"), h = /* @__PURE__ */ G(!0), g = /* @__PURE__ */ G(""), _ = /* @__PURE__ */ G(null), v = /* @__PURE__ */ G(1), y = /* @__PURE__ */ G(null), b = /* @__PURE__ */ G(""), x = /* @__PURE__ */ G(!1), S = /* @__PURE__ */ G(""), C = /* @__PURE__ */ G(!1), w = /* @__PURE__ */ G(!1), T = /* @__PURE__ */ G(""), ee = /* @__PURE__ */ G({}), te = !1, E = oa(() => t.mode === "admin-layout"), D = oa(() => t.mode === "wizard-layout"), O = new URLSearchParams(window.location.search).get("source") || "", k = oa(() => D.value && O === "create-promo"), ne = window.PromoShell?.navItems || [], A = oa(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), j = oa(() => A.value?.items?.find((e) => e.itemKey === d.value) || A.value?.items?.[0]), M = oa({
			get: () => c.value?.[A.value?.sectionKey]?.[j.value?.itemKey],
			set: (e) => de(e)
		}), re = oa(() => a.value ? So({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), ie = oa(() => t.mode === "output" ? _.value : re.value);
		function ae(e, t) {
			e && (u.value = e.sectionKey, d.value = t?.itemKey || "");
		}
		function N(e, t) {
			return e && t ? `${e.sectionKey}.${t.itemKey}` : "";
		}
		async function se(e, t) {
			ae(e, t), f.value = N(e, t), await an();
		}
		function ce(e) {
			if (!e || !p.value) return;
			let t = p.value.querySelector(`[data-section-key="${CSS.escape(e.sectionKey)}"]`);
			if (!t) return;
			let n = p.value.getBoundingClientRect(), r = t.getBoundingClientRect();
			p.value.scrollTo({
				top: Math.max(0, p.value.scrollTop + r.top - n.top),
				behavior: "smooth"
			});
		}
		async function le(e) {
			if (!e) return;
			let t = e.items?.[0] || null;
			ae(e, t), f.value = N(e, t), await an(), ce(e);
		}
		function ue(e, t) {
			let n = N(e, t);
			ae(e, t), f.value = f.value === n ? "" : n;
		}
		function de(e) {
			!A.value || !j.value || (c.value = {
				...c.value,
				[A.value.sectionKey]: {
					...c.value[A.value.sectionKey],
					[j.value.itemKey]: e
				}
			});
		}
		function fe(e, t) {
			de({
				...M.value || {},
				[e]: t
			});
		}
		function F(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function I(e, t) {
			let n = c.value?.[A.value?.sectionKey]?.[e?.itemKey];
			return F(e).length <= 1 ? n : n?.fields?.[t.fieldKey];
		}
		function pe(e, t, n) {
			if (!A.value || !e || !t || e.isLocked || t.isLocked) return;
			if (F(e).length <= 1) {
				de(n);
				return;
			}
			let r = A.value.sectionKey, i = c.value?.[r]?.[e.itemKey] || {};
			c.value = {
				...c.value,
				[r]: {
					...c.value[r],
					[e.itemKey]: {
						...i,
						fields: {
							...i.fields || {},
							[t.fieldKey]: n
						}
					}
				}
			};
		}
		function me(e, t, n, r) {
			pe(e, t, {
				...I(e, t) || {},
				[n]: r
			});
		}
		function he(e, t, n) {
			ae(e, t), !(t.fieldKind !== "text" || t.isLocked) && de(n);
		}
		function ge(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			if (F(t).length > 1) {
				let e = F(t), r = e.filter((e) => e.isRequired || e.isLocked), i = (r.length ? r : e).map((e) => {
					let t = n?.fields?.[e.fieldKey];
					return e.fieldKind === "cta" ? !!(String(t?.label || "").trim() && String(t?.link || "").trim()) : e.fieldKind === "image" ? !!String(t?.value || "").trim() : !!String(t || "").trim();
				});
				return r.length ? i.every(Boolean) : i.some(Boolean);
			}
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function R(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => ge(e, t)) : t.some((t) => ge(e, t));
		}
		function _e() {
			!k.value || w.value || (w.value = !0, T.value = "", window.parent.postMessage({
				type: "create-promo-auto-register-request",
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin));
		}
		function ve(e) {
			return ee.value?.[e.sectionKey] || null;
		}
		function z(e) {
			let t = ve(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function ye(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets",
				"applying"
			].includes(ve(e)?.status);
		}
		function be(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1) return !1;
				let n = t[e.itemKey];
				if (F(e).length > 1) return F(e).some((e) => {
					if (e.fieldKind === "image") return !1;
					let t = n?.fields?.[e.fieldKey], r = e.fieldKind === "cta" ? t?.label : t;
					return String(r || "").trim().length >= 2;
				});
				if (e.fieldKind === "image") return !1;
				let r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function xe(e) {
			let t = ve(e), n = t?.constraintsSnapshot?.imageTarget?.type === "section-background";
			return ye(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : n && t?.status === "ready" && !z(e) ? {
				action: "generate",
				label: "AI 적용 중",
				disabled: !0
			} : n && t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !be(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !be(e)
			};
		}
		function Se(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function Ce(e, t, n = null) {
			let r = n || t;
			return !!(e?.aiDesign?.enabled !== !1 && r?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && !r?.isLocked && r?.image?.allowedSources?.includes("ai") && Se(e).includes(t.itemKey));
		}
		function we(e) {
			let t = ve(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function Te(e, t, n = null) {
			let r = ve(e), i = r?.constraintsSnapshot?.imageTarget, a = we(e) === t?.itemKey && (!n || i?.fieldKey === n.fieldKey);
			return ye(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : a && r?.status === "ready" && !z(e) ? {
				action: "generate",
				label: "AI 이미지 적용 중",
				disabled: !0
			} : a && r?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !be(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !be(e)
			};
		}
		function Ee(e, t, n = "", r = "", i = "") {
			let a = r || (n ? "item" : "section-background");
			window.parent.postMessage({
				type: "create-promo-section-ai-action",
				sectionKey: e.sectionKey,
				action: t,
				targetType: a,
				targetItemKey: String(n || "").trim() || null,
				targetFieldKey: String(i || "").trim() || null
			}, window.location.origin);
		}
		function De(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function Oe(e = null) {
			!A.value || !j.value || j.value.isLocked || e?.isLocked || window.confirm(`${e?.name || j.value.name} 이미지를 삭제할까요?`) && window.parent.postMessage({
				type: "create-promo-remove-image",
				sectionKey: A.value.sectionKey,
				itemKey: j.value.itemKey,
				fieldKey: e?.fieldKey || null
			}, window.location.origin);
		}
		function ke(e) {
			l.value = {
				...l.value,
				theme: {
					...l.value.theme,
					backgroundColor: e.value,
					backgroundToken: e.key,
					textColor: e.textColor
				}
			};
		}
		let Ae = oa(() => A.value && j.value ? `${A.value.sectionKey}.${j.value.itemKey}` : ""), B = oa(() => l.value.itemStyles?.[Ae.value] || {}), je = oa(() => A.value && l.value.sectionStyles?.[A.value.sectionKey] || {});
		function V(e) {
			!Ae.value || j.value?.isLocked || (l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[Ae.value]: {
						...B.value,
						...e
					}
				}
			});
		}
		function Me(e, t, n) {
			if (!e || !t || t.isLocked) return;
			let r = `${e.sectionKey}.${t.itemKey}`;
			l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[r]: {
						...l.value.itemStyles?.[r] || {},
						...n
					}
				}
			};
		}
		function Ne() {
			if (!Ae.value || j.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} };
			delete e[Ae.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Pe() {
			if (!Ae.value || j.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} }, t = To(e[Ae.value]);
			Object.keys(t).length ? e[Ae.value] = t : delete e[Ae.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Fe(e, t) {
			e && (l.value = {
				...l.value,
				sectionStyles: {
					...l.value.sectionStyles || {},
					[e]: {
						...l.value.sectionStyles?.[e] || {},
						...t
					}
				}
			});
		}
		function Ie(e) {
			!A.value || ![
				"left",
				"center",
				"right"
			].includes(e) || Fe(A.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function Le(e) {
			!A.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || Fe(A.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: je.value.backgroundFadeStrength || "medium"
			});
		}
		function Re(e) {
			[
				"square",
				"rounded",
				"circle"
			].includes(e) && V(e === "circle" ? {
				shape: e,
				aspectRatio: "1/1",
				aspectRatioLocked: !0,
				heightPx: void 0
			} : { shape: e });
		}
		function ze(e) {
			if (!Ae.value || j.value?.isLocked || !["locked", "free"].includes(e)) return;
			let t = { ...l.value.itemStyles || {} }, n = { ...B.value };
			e === "locked" || n.shape === "circle" ? (n.aspectRatioLocked = !0, n.aspectRatio = n.shape === "circle" ? "1/1" : n.aspectRatio || j.value?.image?.aspectRatio || "1/1", delete n.heightPx) : (n.aspectRatioLocked = !1, n.heightPx = Number(n.heightPx || 240)), t[Ae.value] = n, l.value = {
				...l.value,
				itemStyles: t
			};
		}
		function Be() {
			if (!A.value) return;
			let e = { ...l.value.sectionStyles || {} }, t = { ...e[A.value.sectionKey] || {} };
			delete t.minHeight, Object.keys(t).length ? e[A.value.sectionKey] = t : delete e[A.value.sectionKey], l.value = {
				...l.value,
				sectionStyles: e
			};
		}
		async function Ve() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = l.template, o.value = l.configRevision || "", s.value = l.sections || [], c.value = bo(s.value), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = N(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function He() {
			if (!re.value) return;
			g.value = "";
			let e = Eo(localStorage, mo, re.value);
			if (!e.ok) {
				g.value = e.message;
				return;
			}
			window.open("/prototype/visual-output.html", "_blank", "noopener");
		}
		async function Ue() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error(n.message || n.error || "기본 레이아웃을 불러오지 못했습니다.");
				a.value = n.template, s.value = n.sections || [], c.value = bo(s.value), l.value = $o(n.layout?.layoutSpec), v.value = Number(n.layout?.layoutRevision || 1), y.value = n.layout?.id || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = N(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function H() {
			if (!a.value?.id || x.value) return;
			S.value = "";
			let e = ts(l.value);
			if (!e.ok) {
				S.value = `레이아웃 검증 실패: ${e.errors[0]?.path || "unknown"}`;
				return;
			}
			x.value = !0;
			try {
				let t = await fetch("/api/wizard-form-template-layout", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						templateId: a.value.id,
						expectedRevision: v.value,
						rendererKey: "default-promo-renderer",
						rendererVersion: 1,
						layoutSpec: e.spec,
						changeNote: b.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
					})
				}), n = await t.json().catch(() => ({}));
				if (!t.ok) throw Error(n.message || n.error || `레이아웃 저장 오류(${t.status})`);
				l.value = $o(n.layout.layoutSpec), v.value = Number(n.layout.layoutRevision || v.value + 1), y.value = n.layout.id || y.value, b.value = "", S.value = `기본 레이아웃을 Draft에 저장했습니다. revision ${v.value} · Create Promo 반영을 위해 관리자 페이지에서 템플릿을 활성화하세요.`;
			} catch (e) {
				S.value = e.message;
			} finally {
				x.value = !1;
			}
		}
		async function We(e) {
			if (!e?.content) return;
			let t = A.value?.sectionKey || u.value, i = j.value?.itemKey || d.value, p = f.value;
			te = !0, a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, ee.value = e.content.sectionDesignRuns || {}, l.value = $o(e.designSpec), v.value = Number(e.layoutRevision || 1);
			let m = s.value.find((e) => e.sectionKey === t) || s.value[0];
			u.value = m?.sectionKey || "", d.value = m?.items?.some((e) => e.itemKey === i) ? i : m?.items?.[0]?.itemKey || "";
			let h = N(m, m?.items?.find((e) => e.itemKey === d.value));
			f.value = s.value.some((e) => (e.items || []).some((t) => N(e, t) === p)) ? p : h, C.value = !0, n.value = !1, r.value = "", await an(), te = !1;
		}
		function Ge(e) {
			if (!(!D.value || e.origin !== window.location.origin)) {
				if (e.data?.type === "create-promo-auto-register-result") {
					w.value = !1;
					let t = Number(e.data.registeredCount || 0);
					T.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e.data?.type === "promo-wizard-layout-snapshot" && We(e.data.snapshot);
			}
		}
		wn([l, c], () => {
			!D.value || !C.value || te || window.parent.postMessage({
				type: "promo-wizard-layout-change",
				designSpec: JSON.parse(JSON.stringify(l.value)),
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin);
		}, { deep: !0 });
		function Ke() {
			try {
				let e = localStorage.getItem(mo);
				if (!e) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
				_.value = JSON.parse(e);
			} catch (e) {
				r.value = e.message;
			}
		}
		return Kn(() => {
			k.value && (document.documentElement.classList.add("create-promo-editor-document"), document.body.classList.add("create-promo-editor-document")), window.PromoShell?.init(document), t.mode === "output" ? Ke() : E.value ? Ue() : D.value ? (n.value = !0, window.addEventListener("message", Ge), window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin)) : Ve();
		}), Yn(() => {
			window.removeEventListener("message", Ge), document.documentElement.classList.remove("create-promo-editor-document"), document.body.classList.remove("create-promo-editor-document");
		}), (t, i) => e.mode === "output" ? (Y(), X("div", ns, [Z("header", rs, [Z("div", null, [i[32] ||= Z("span", null, "WEB OUTPUT", -1), Z("strong", null, L(ie.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[33] ||= Z("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (Y(), X("div", is, L(r.value), 1)) : ie.value ? (Y(), wi(Xo, {
			key: 1,
			content: ie.value.content,
			"design-spec": ie.value.designSpec,
			assets: ie.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Q("", !0)])) : (Y(), X("main", {
			key: 1,
			class: P(["editor-shell", {
				"shell-frame": !D.value,
				"editor-shell--embedded": k.value
			}]),
			"data-shell-frame": D.value ? null : ""
		}, [
			D.value ? Q("", !0) : (Y(), X("aside", os, [
				i[34] ||= Pi("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[35] ||= Z("div", {
					class: "shell-sidebar__mode",
					role: "group",
					"aria-label": "사이드바 표시 방식"
				}, [Z("button", {
					type: "button",
					"data-shell-sidebar-mode": "min",
					"aria-label": "사이드바 최소화",
					title: "최소"
				}, [Z("i", {
					"data-lucide": "panel-left-close",
					"aria-hidden": "true"
				}), Z("span", null, "최소")]), Z("button", {
					type: "button",
					"data-shell-sidebar-mode": "max",
					"aria-label": "사이드바 최대화",
					title: "최대"
				}, [Z("i", {
					"data-lucide": "panel-left-open",
					"aria-hidden": "true"
				}), Z("span", null, "최대")])], -1),
				Z("nav", ss, [(Y(!0), X(J, null, nr(Lt(ne), (e) => (Y(), X("a", {
					key: e.key,
					href: e.href,
					class: P({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [Z("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, ls), Z("span", us, L(e.label), 1)], 10, cs))), 128))]),
				i[36] ||= Z("div", { class: "shell-sidebar__footer" }, [Z("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [Z("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), Z("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			Z("div", { class: P(D.value ? "editor-embedded-main" : "shell-main") }, [D.value ? Q("", !0) : (Y(), X("header", ds, [Z("div", fs, [i[37] ||= Z("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), Z("strong", null, L(E.value ? "Admin Template Layout" : "Visual Editor"), 1)]), Z("div", ps, [Z("div", ms, L(E.value ? `Layout revision ${v.value}` : "편집 준비"), 1)])])), Z("div", { class: P(["editor-content", {
				"shell-content": !D.value,
				"editor-content--embedded": k.value
			}]) }, [
				k.value ? Q("", !0) : (Y(), X("header", hs, [Z("div", null, [
					Z("span", null, L(E.value ? "ADMIN TEMPLATE LAYOUT" : D.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					Z("h2", null, L(a.value?.name || "Default Renderer"), 1),
					E.value ? (Y(), X("small", gs, " v" + L(a.value?.version || 1) + " · " + L(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : Q("", !0)
				]), Z("div", _s, [k.value ? Q("", !0) : (Y(), X("fieldset", vs, [i[38] ||= Z("legend", null, "페이지 배경", -1), Z("div", ys, [(Y(!0), X(J, null, nr(Lt(ho), (e) => (Y(), X("button", {
					key: e.key,
					type: "button",
					class: P({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => ke(e)
				}, [Z("i", { style: oe({ backgroundColor: e.value }) }, null, 4)], 10, bs))), 128))])])), E.value ? (Y(), X("nav", xs, [vn(Z("input", {
					"onUpdate:modelValue": i[0] ||= (e) => b.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[Qa, b.value]]), Z("button", {
					type: "button",
					disabled: !re.value || x.value,
					onClick: H
				}, L(x.value ? "저장 중" : "기본 레이아웃 저장"), 9, Ss)])) : Q("", !0)])])),
				n.value ? (Y(), X("div", Cs, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (Y(), X("div", ws, L(r.value), 1)) : Q("", !0),
				g.value ? (Y(), X("div", Ts, L(g.value), 1)) : Q("", !0),
				S.value ? (Y(), X("div", Es, L(S.value), 1)) : Q("", !0),
				!n.value && !r.value ? (Y(), X("section", {
					key: 5,
					class: P(["editor-workspace", { "is-create-promo-wizard": k.value }])
				}, [
					Z("aside", Ds, [Z("div", Os, [i[39] ||= Z("span", null, "SECTIONS", -1), Z("strong", null, L(s.value.length), 1)]), Z("div", ks, [(Y(!0), X(J, null, nr(s.value, (e) => (Y(), X("button", {
						key: e.sectionKey,
						type: "button",
						class: P(["section-trigger", { active: e.sectionKey === A.value?.sectionKey }]),
						onClick: (t) => le(e)
					}, [Z("span", null, L(e.name), 1), (Y(), X("svg", {
						class: P(["section-registration-icon", R(e) ? "is-complete" : "is-incomplete"]),
						viewBox: "0 0 20 20",
						role: "img",
						"aria-label": R(e) ? `${e.name} 콘텐츠 등록 완료` : `${e.name} 콘텐츠 등록 필요`
					}, [i[40] ||= Z("circle", {
						cx: "10",
						cy: "10",
						r: "9"
					}, null, -1), R(e) ? (Y(), X("path", Ms)) : (Y(), X("path", Ns))], 10, js))], 10, As))), 128))])]),
					Z("section", Ps, [Z("div", Fs, [Z("div", Is, [
						i[41] ||= Z("strong", null, "Live Preview", -1),
						Z("small", null, L(a.value.templateKey) + " · v" + L(a.value.version), 1),
						k.value ? (Y(), X("button", {
							key: 0,
							class: "auto-register-action",
							type: "button",
							disabled: w.value,
							onClick: _e
						}, L(w.value ? "등록 중" : "자동등록"), 9, Ls)) : Q("", !0),
						k.value ? (Y(), X("small", Rs, "미리보기 요소를 선택해 내용을 입력하세요.")) : Q("", !0),
						T.value ? (Y(), X("small", zs, L(T.value), 1)) : Q("", !0)
					]), Z("div", Bs, [
						E.value ? Q("", !0) : (Y(), X("button", {
							key: 0,
							type: "button",
							class: "web-output-action",
							disabled: !re.value,
							onClick: He
						}, "Web Output", 8, Vs)),
						Z("label", Hs, [
							vn(Z("input", {
								"onUpdate:modelValue": i[1] ||= (e) => h.value = e,
								type: "checkbox"
							}, null, 512), [[$a, h.value]]),
							i[42] ||= Z("span", null, "Guides", -1),
							Z("strong", null, L(h.value ? "ON" : "OFF"), 1)
						]),
						Z("div", Us, [Z("button", {
							type: "button",
							class: P({ active: m.value === "desktop" }),
							onClick: i[2] ||= (e) => m.value = "desktop"
						}, "Desktop", 2), Z("button", {
							type: "button",
							class: P({ active: m.value === "mobile" }),
							onClick: i[3] ||= (e) => m.value = "mobile"
						}, "Mobile", 2)])
					])]), Z("div", {
						ref_key: "previewStageRef",
						ref: p,
						class: P(["preview-stage", `preview-stage--${m.value}`])
					}, [ie.value ? (Y(), wi(Xo, {
						key: 0,
						content: ie.value.content,
						"design-spec": ie.value.designSpec,
						assets: ie.value.assets,
						"section-design-runs": ee.value,
						editable: "",
						"show-guides": h.value,
						"selected-item-key": Ae.value,
						onSelectItem: se,
						onUpdateItemStyle: V,
						onUpdateRendererItemStyle: Me,
						onUpdateItemContent: he,
						onUpdateSectionStyle: Fe
					}, null, 8, [
						"content",
						"design-spec",
						"assets",
						"section-design-runs",
						"show-guides",
						"selected-item-key"
					])) : Q("", !0)], 2)]),
					Z("aside", Ws, [Z("div", Gs, [i[43] ||= Z("span", null, "CONTENT", -1), Z("strong", null, L(A.value?.name || "섹션 선택"), 1)]), A.value ? (Y(), X("div", Ks, [Z("section", qs, [
						Z("div", Js, [i[44] ||= Z("strong", null, "섹션 속성", -1), Z("small", null, L(A.value.name), 1)]),
						k.value ? (Y(), X("div", Ys, [
							A.value.aiDesign?.enabled === !1 ? Q("", !0) : (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action",
								disabled: xe(A.value).disabled,
								onClick: i[4] ||= (e) => Ee(A.value, "generate-layout", "", "layout")
							}, "AI 레이아웃 제안", 8, Xs)),
							A.value.aiDesign?.enabled !== !1 && A.value.aiDesign?.allowSectionBackground !== !1 ? (Y(), X("button", {
								key: 1,
								type: "button",
								class: "section-ai-action",
								disabled: xe(A.value).disabled,
								title: xe(A.value).disabled && !ye(A.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
								onClick: i[5] ||= (e) => Ee(A.value, xe(A.value).action, "", "section-background")
							}, L(xe(A.value).label), 9, Zs)) : Q("", !0),
							De(A.value) ? (Y(), X("button", {
								key: 2,
								type: "button",
								class: "section-ai-remove",
								onClick: i[6] ||= (e) => Ee(A.value, "remove-background")
							}, "배경 삭제")) : Q("", !0)
						])) : Q("", !0),
						De(A.value) ? (Y(), X("div", Qs, [i[45] ||= Z("span", null, "배경 이미지 정렬", -1), Z("div", $s, [(Y(), X(J, null, nr([
							{
								value: "left",
								label: "왼쪽"
							},
							{
								value: "center",
								label: "중앙"
							},
							{
								value: "right",
								label: "오른쪽"
							}
						], (e) => Z("button", {
							key: e.value,
							type: "button",
							class: P({ active: (je.value.backgroundPosition || "center center") === `${e.value} center` }),
							onClick: (t) => Ie(e.value)
						}, L(e.label), 11, ec)), 64))])])) : Q("", !0),
						De(A.value) || A.value.aiDesign?.enabled !== !1 ? (Y(), X("div", tc, [Z("label", null, [i[47] ||= Z("span", null, "배경 이미지 페이드", -1), Z("select", {
							value: je.value.backgroundFadeMode || "none",
							onChange: i[7] ||= (e) => Le(e.target.value)
						}, [...i[46] ||= [
							Z("option", { value: "none" }, "페이드 없음", -1),
							Z("option", { value: "left" }, "왼쪽 페이드", -1),
							Z("option", { value: "right" }, "오른쪽 페이드", -1),
							Z("option", { value: "both" }, "양끝 페이드", -1)
						]], 40, nc)]), (je.value.backgroundFadeMode || "none") === "none" ? Q("", !0) : (Y(), X("label", rc, [i[49] ||= Z("span", null, "페이드 강도", -1), Z("select", {
							value: je.value.backgroundFadeStrength || "medium",
							onChange: i[8] ||= (e) => Fe(A.value.sectionKey, { backgroundFadeStrength: e.target.value })
						}, [...i[48] ||= [
							Z("option", { value: "soft" }, "약하게", -1),
							Z("option", { value: "medium" }, "보통", -1),
							Z("option", { value: "strong" }, "강하게", -1)
						]], 40, ic)]))])) : Q("", !0),
						Z("div", ac, [Z("div", null, [i[50] ||= Z("span", null, "섹션 높이", -1), Z("strong", null, L(je.value.minHeight ? `${Math.round(je.value.minHeight)}px` : "자동"), 1)]), Z("button", {
							type: "button",
							disabled: !je.value.minHeight,
							onClick: Be
						}, " 높이 초기화 ", 8, oc)])
					]), Z("div", sc, [(Y(!0), X(J, null, nr(A.value.items || [], (e) => (Y(), X("section", {
						key: e.itemKey,
						class: P(["component-property-accordion", { open: f.value === N(A.value, e) }])
					}, [Z("button", {
						type: "button",
						class: "component-property-trigger",
						"aria-expanded": f.value === N(A.value, e),
						onClick: (t) => ue(A.value, e)
					}, [
						Z("span", null, L(e.name), 1),
						Z("small", null, L(e.fieldKind), 1),
						i[51] ||= Z("i", { "aria-hidden": "true" }, null, -1)
					], 8, cc), Z("div", lc, [Z("div", null, [j.value && j.value.itemKey === e.itemKey ? (Y(), X("div", uc, [
						F(j.value).length > 1 ? (Y(), X("div", dc, [(Y(!0), X(J, null, nr(F(j.value), (e) => (Y(), X("section", {
							key: e.fieldKey,
							class: "component-field-property"
						}, [Z("header", null, [Z("strong", null, L(e.name), 1), Z("small", null, L(e.fieldKind) + " · " + L(e.fieldKey), 1)]), e.fieldKind === "cta" ? (Y(), X(J, { key: 0 }, [Z("label", null, [i[52] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
							disabled: j.value.isLocked || e.isLocked,
							value: I(j.value, e)?.label,
							onInput: (t) => me(j.value, e, "label", t.target.value)
						}, null, 40, fc)]), Z("label", null, [i[53] ||= Z("span", null, "버튼 URL", -1), Z("input", {
							disabled: j.value.isLocked || e.isLocked,
							type: "url",
							value: I(j.value, e)?.link,
							onInput: (t) => me(j.value, e, "link", t.target.value)
						}, null, 40, pc)])], 64)) : e.fieldKind === "image" ? (Y(), X(J, { key: 1 }, [
							k.value && Ce(A.value, j.value, e) ? (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action item-ai-generation-action",
								disabled: Te(A.value, j.value, e).disabled,
								onClick: (t) => Ee(A.value, "generate", j.value.itemKey, "item", e.fieldKey)
							}, L(Te(A.value, j.value, e).label), 9, mc)) : Q("", !0),
							Z("label", null, [i[54] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
								disabled: j.value.isLocked || e.isLocked,
								value: I(j.value, e)?.source,
								onChange: (t) => me(j.value, e, "source", t.target.value)
							}, [(Y(!0), X(J, null, nr(e.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, L(e), 9, gc))), 128))], 40, hc)]),
							Z("label", null, [i[55] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
								disabled: j.value.isLocked || e.isLocked,
								rows: "4",
								value: I(j.value, e)?.value,
								onInput: (t) => me(j.value, e, "value", t.target.value)
							}, null, 40, _c)]),
							e.image?.altTextRequired ? (Y(), X("label", vc, [i[56] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
								disabled: j.value.isLocked || e.isLocked,
								value: I(j.value, e)?.alt,
								onInput: (t) => me(j.value, e, "alt", t.target.value)
							}, null, 40, yc)])) : Q("", !0),
							!j.value.isLocked && !e.isLocked && I(j.value, e)?.value ? (Y(), X("button", {
								key: 2,
								type: "button",
								class: "image-remove-action",
								onClick: (t) => Oe(e)
							}, "이미지 삭제", 8, bc)) : Q("", !0)
						], 64)) : (Y(), X("label", xc, [Z("span", null, L(e.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), Z("textarea", {
							disabled: j.value.isLocked || e.isLocked,
							rows: e.textType === "multi" ? 8 : 3,
							value: I(j.value, e),
							onInput: (t) => pe(j.value, e, t.target.value),
							placeholder: "Enter 키로 줄바꿈할 수 있습니다."
						}, null, 40, Sc)]))]))), 128))])) : Q("", !0),
						F(j.value).length <= 1 && j.value.fieldKind === "cta" ? (Y(), X("label", Cc, [i[57] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
							disabled: j.value.isLocked,
							value: M.value?.label,
							onInput: i[9] ||= (e) => fe("label", e.target.value)
						}, null, 40, wc)])) : Q("", !0),
						F(j.value).length <= 1 && j.value.fieldKind === "cta" ? (Y(), X("label", Tc, [i[58] ||= Z("span", null, "버튼 URL", -1), Z("input", {
							disabled: j.value.isLocked,
							type: "url",
							value: M.value?.link,
							onInput: i[10] ||= (e) => fe("link", e.target.value)
						}, null, 40, Ec)])) : F(j.value).length <= 1 && j.value.fieldKind === "image" ? (Y(), X(J, { key: 3 }, [
							k.value && Ce(A.value, j.value) ? (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action item-ai-generation-action",
								disabled: Te(A.value, j.value).disabled,
								title: Te(A.value, j.value).disabled && !ye(A.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
								onClick: i[11] ||= (e) => Ee(A.value, Te(A.value, j.value).action, j.value.itemKey)
							}, L(Te(A.value, j.value).label), 9, Dc)) : Q("", !0),
							Z("label", null, [i[59] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
								disabled: j.value.isLocked,
								value: M.value?.source,
								onChange: i[12] ||= (e) => fe("source", e.target.value)
							}, [(Y(!0), X(J, null, nr(j.value.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, L(e), 9, kc))), 128))], 40, Oc)]),
							Z("label", null, [i[60] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
								disabled: j.value.isLocked,
								rows: "4",
								value: M.value?.value,
								onInput: i[13] ||= (e) => fe("value", e.target.value)
							}, null, 40, Ac)]),
							j.value.image?.descriptionEnabled ? (Y(), X("label", jc, [i[61] ||= Z("span", null, "설명", -1), Z("textarea", {
								disabled: j.value.isLocked,
								rows: "3",
								value: M.value?.description,
								onInput: i[14] ||= (e) => fe("description", e.target.value)
							}, null, 40, Mc)])) : Q("", !0),
							j.value.image?.altTextRequired ? (Y(), X("label", Nc, [i[62] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
								disabled: j.value.isLocked,
								value: M.value?.alt,
								onInput: i[15] ||= (e) => fe("alt", e.target.value)
							}, null, 40, Pc)])) : Q("", !0),
							!j.value.isLocked && M.value?.value ? (Y(), X("button", {
								key: 3,
								type: "button",
								class: "image-remove-action",
								onClick: Oe
							}, "이미지 삭제")) : Q("", !0)
						], 64)) : F(j.value).length <= 1 ? (Y(), X("label", Fc, [Z("span", null, L(j.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), vn(Z("textarea", {
							"onUpdate:modelValue": i[16] ||= (e) => M.value = e,
							disabled: j.value.isLocked,
							rows: j.value.textType === "multi" ? 8 : 3,
							placeholder: "Enter 키로 줄바꿈할 수 있습니다."
						}, null, 8, Ic), [[Qa, M.value]])])) : Q("", !0),
						Z("dl", Lc, [
							Z("div", null, [i[63] ||= Z("dt", null, "Item key", -1), Z("dd", null, L(j.value.itemKey), 1)]),
							Z("div", null, [i[64] ||= Z("dt", null, "필수", -1), Z("dd", null, L(j.value.isRequired ? "Y" : "N"), 1)]),
							Z("div", null, [i[65] ||= Z("dt", null, "고정", -1), Z("dd", null, L(j.value.isLocked ? "Y" : "N"), 1)])
						]),
						F(j.value).length <= 1 ? (Y(), X("section", Rc, [
							Z("div", zc, [i[66] ||= Z("strong", null, "DESIGN", -1), Z("button", {
								type: "button",
								disabled: j.value.isLocked,
								onClick: Ne
							}, "초기화", 8, Bc)]),
							j.value.fieldKind === "image" ? (Y(), X("div", Vc, [
								Z("div", Hc, [
									i[67] ||= Z("span", null, "크기 조절 방식", -1),
									Z("div", Uc, [Z("button", {
										type: "button",
										class: P({ active: B.value.aspectRatioLocked !== !1 }),
										disabled: j.value.isLocked,
										onClick: i[17] ||= (e) => ze("locked")
									}, "비율 유지", 10, Wc), Z("button", {
										type: "button",
										class: P({ active: B.value.aspectRatioLocked === !1 }),
										disabled: j.value.isLocked || B.value.shape === "circle",
										onClick: i[18] ||= (e) => ze("free")
									}, "자유 조절", 10, Gc)]),
									B.value.shape === "circle" ? (Y(), X("small", Kc, "원형 이미지는 1:1 비율로 고정됩니다.")) : Q("", !0)
								]),
								Z("label", null, [i[68] ||= Z("span", null, "이미지 너비", -1), Z("div", qc, [Z("input", {
									type: "range",
									min: "10",
									max: "100",
									step: "1",
									disabled: j.value.isLocked,
									value: B.value.widthPct || 32,
									onInput: i[19] ||= (e) => V({ widthPct: Number(e.target.value) })
								}, null, 40, Jc), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "10",
									max: "100",
									step: "1",
									disabled: j.value.isLocked,
									value: Math.round(B.value.widthPct || 32),
									"aria-label": "이미지 너비 퍼센트",
									onChange: i[20] ||= (e) => V({ widthPct: Math.min(100, Math.max(10, Number(e.target.value) || 32)) })
								}, null, 40, Yc)])]),
								B.value.shape !== "circle" && B.value.aspectRatioLocked === !1 ? (Y(), X("label", Xc, [i[69] ||= Z("span", null, "이미지 높이", -1), Z("div", Zc, [Z("input", {
									type: "range",
									min: "80",
									max: "900",
									step: "10",
									disabled: j.value.isLocked,
									value: B.value.heightPx || 240,
									onInput: i[21] ||= (e) => V({ heightPx: Number(e.target.value) })
								}, null, 40, Qc), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "80",
									max: "900",
									step: "10",
									disabled: j.value.isLocked,
									value: Math.round(B.value.heightPx || 240),
									"aria-label": "이미지 높이 픽셀",
									onChange: i[22] ||= (e) => V({ heightPx: Math.min(900, Math.max(80, Number(e.target.value) || 240)) })
								}, null, 40, $c)])])) : Q("", !0),
								Z("label", null, [i[71] ||= Z("span", null, "이미지 맞춤", -1), Z("select", {
									disabled: j.value.isLocked,
									value: B.value.imageFit || "contain",
									onChange: i[23] ||= (e) => V({ imageFit: e.target.value })
								}, [...i[70] ||= [Z("option", { value: "contain" }, "전체 표시", -1), Z("option", { value: "cover" }, "영역 채우기", -1)]], 40, el)]),
								Z("label", null, [i[73] ||= Z("span", null, "이미지 초점", -1), Z("select", {
									disabled: j.value.isLocked,
									value: B.value.imagePosition || "center center",
									onChange: i[24] ||= (e) => V({ imagePosition: e.target.value })
								}, [...i[72] ||= [Pi("<option value=\"left top\">왼쪽 위</option><option value=\"center top\">중앙 위</option><option value=\"right top\">오른쪽 위</option><option value=\"left center\">왼쪽 중앙</option><option value=\"center center\">중앙</option><option value=\"right center\">오른쪽 중앙</option><option value=\"left bottom\">왼쪽 아래</option><option value=\"center bottom\">중앙 아래</option><option value=\"right bottom\">오른쪽 아래</option>", 9)]], 40, tl)]),
								Z("label", null, [i[75] ||= Z("span", null, "이미지 형태", -1), Z("select", {
									disabled: j.value.isLocked,
									value: B.value.shape || "square",
									onChange: i[25] ||= (e) => Re(e.target.value)
								}, [...i[74] ||= [
									Z("option", { value: "square" }, "사각형", -1),
									Z("option", { value: "rounded" }, "둥근 사각형", -1),
									Z("option", { value: "circle" }, "원형", -1)
								]], 40, nl)]),
								Z("label", rl, [Z("input", {
									type: "checkbox",
									disabled: j.value.isLocked,
									checked: B.value.decorative === !0,
									onChange: i[26] ||= (e) => V({ decorative: e.target.checked })
								}, null, 40, il), i[76] ||= Z("span", null, "장식 이미지", -1)]),
								B.value.decorative === !0 ? Q("", !0) : (Y(), X("label", al, [i[77] ||= Z("span", null, "이미지 설명", -1), Z("input", {
									type: "text",
									maxlength: "240",
									disabled: j.value.isLocked,
									value: B.value.accessibleLabel || M.value?.alt || j.value.name,
									onInput: i[27] ||= (e) => V({ accessibleLabel: e.target.value })
								}, null, 40, ol)]))
							])) : Q("", !0),
							j.value.fieldKind === "image" ? Q("", !0) : (Y(), X(J, { key: 1 }, [
								Z("label", null, [i[78] ||= Z("span", null, "글자 색상", -1), Z("input", {
									type: "color",
									disabled: j.value.isLocked,
									value: B.value.color || "#172033",
									onInput: i[28] ||= (e) => V({ color: e.target.value })
								}, null, 40, sl)]),
								Z("label", null, [i[79] ||= Z("span", null, "폰트 크기", -1), Z("div", cl, [Z("input", {
									type: "range",
									min: "10",
									max: "80",
									step: "1",
									disabled: j.value.isLocked,
									value: B.value.fontSize || 18,
									onInput: i[29] ||= (e) => V({ fontSize: Number(e.target.value) })
								}, null, 40, ll), Z("output", null, L(B.value.fontSize || 18) + "px", 1)])]),
								Z("label", null, [i[81] ||= Z("span", null, "폰트 굵기", -1), Z("select", {
									disabled: j.value.isLocked,
									value: B.value.fontWeight || 400,
									onChange: i[30] ||= (e) => V({ fontWeight: Number(e.target.value) })
								}, [...i[80] ||= [
									Z("option", { value: 400 }, "Regular", -1),
									Z("option", { value: 500 }, "Medium", -1),
									Z("option", { value: 700 }, "Bold", -1),
									Z("option", { value: 800 }, "Extra Bold", -1)
								]], 40, ul)]),
								Z("label", null, [i[83] ||= Z("span", null, "정렬", -1), Z("select", {
									disabled: j.value.isLocked,
									value: B.value.textAlign || "left",
									onChange: i[31] ||= (e) => V({ textAlign: e.target.value })
								}, [...i[82] ||= [
									Z("option", { value: "left" }, "왼쪽", -1),
									Z("option", { value: "center" }, "가운데", -1),
									Z("option", { value: "right" }, "오른쪽", -1)
								]], 40, dl)])
							], 64)),
							Z("div", fl, [i[84] ||= Z("span", null, "위치", -1), B.value.positionMode === "free" ? (Y(), X("strong", pl, " X " + L(Math.round(B.value.xPct || 0)) + "% · Y " + L(Math.round(B.value.yPx || 0)) + "px ", 1)) : (Y(), X("strong", ml, "자동 배치"))]),
							B.value.positionMode === "free" ? (Y(), X("button", {
								key: 2,
								class: "secondary-control",
								type: "button",
								disabled: j.value.isLocked,
								onClick: Pe
							}, " 자동 배치로 복원 ", 8, hl)) : Q("", !0)
						])) : Q("", !0)
					])) : Q("", !0)])])], 2))), 128)), A.value.items?.length ? Q("", !0) : (Y(), X("span", gl, "등록된 컴포넌트 없음"))])])) : Q("", !0)])
				], 2)) : Q("", !0)
			], 2)], 2),
			D.value ? Q("", !0) : (Y(), X("button", _l))
		], 10, as));
	}
}, yl = document.querySelector("#visual-editor-app");
yl && lo(vl, { mode: new URLSearchParams(window.location.search).get("mode") || yl.dataset.mode || "editor" }).mount(yl);
//#endregion
