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
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), D = /\B([A-Z])/g, O = ee((e) => e.replace(D, "-$1").toLowerCase()), k = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = ee((e) => e ? `on${k(e)}` : ""), A = (e, t) => !Object.is(e, t), re = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, j = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ie = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, M, ae = () => M ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function oe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ce(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var N = /;(?![^(]*\))/g, P = /:([^]+)/, se = /\/\*[^]*?\*\//g;
function ce(e) {
	let t = {};
	return e.replace(se, "").split(N).forEach((e) => {
		if (e) {
			let n = e.split(P);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function F(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = F(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var le = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ue = /* @__PURE__ */ e(le);
le + "";
function de(e) {
	return !!e || e === "";
}
function fe(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = pe(e[r], t[r]);
	return n;
}
function pe(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? fe(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !pe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function me(e, t) {
	return e.findIndex((e) => pe(e, t));
}
var he = (e) => !!(e && e.__v_isRef === !0), I = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? he(e) ? I(e.value) : JSON.stringify(e, ge, 2) : String(e), ge = (e, t) => he(t) ? ge(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[_e(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => _e(e)) } : _(t) ? _e(t) : v(t) && !d(t) && !C(t) ? String(t) : t, _e = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, L, ve = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && L && (L.active ? (this.parent = L, this.index = (L.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = L;
			try {
				return L = this, e();
			} finally {
				L = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = L, L = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (L === this) L = this.prevScope;
			else {
				let e = L;
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
function ye() {
	return L;
}
var R, be = /* @__PURE__ */ new WeakSet(), xe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, L && (L.active ? L.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, be.has(this) && (be.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || we(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Fe(this), De(this);
		let e = R, t = B;
		R = this, B = !0;
		try {
			return this.fn();
		} finally {
			Oe(this), R = e, B = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) je(e);
			this.deps = this.depsTail = void 0, Fe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? be.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ke(this) && this.run();
	}
	get dirty() {
		return ke(this);
	}
}, Se = 0, Ce, z;
function we(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = z, z = e;
		return;
	}
	e.next = Ce, Ce = e;
}
function Te() {
	Se++;
}
function Ee() {
	if (--Se > 0) return;
	if (z) {
		let e = z;
		for (z = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ce;) {
		let t = Ce;
		for (Ce = void 0; t;) {
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
		r.version === -1 ? (r === n && (n = e), je(r), Me(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
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
	let t = e.dep, n = R, r = B;
	R = e, B = !0;
	try {
		De(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, B = r, Oe(e), e.flags &= -3;
	}
}
function je(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) je(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Me(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var B = !0, Ne = [];
function V() {
	Ne.push(B), B = !1;
}
function Pe() {
	let e = Ne.pop();
	B = e === void 0 || e;
}
function Fe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = R;
		R = void 0;
		try {
			t();
		} finally {
			R = e;
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
		if (!R || !B || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new Le(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
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
var Be = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ Symbol(""), He = /* @__PURE__ */ Symbol(""), H = /* @__PURE__ */ Symbol("");
function U(e, t, n) {
	if (B && R) {
		let t = Be.get(e);
		t || Be.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Re()), r.map = t, r.key = n), r.track();
	}
}
function W(e, t, n, r, i, a) {
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
				(n === "length" || n === H || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(H)), t) {
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
function Ue(e) {
	let t = /* @__PURE__ */ G(e);
	return t === e ? t : (U(t, "iterate", H), /* @__PURE__ */ Ot(e) ? t : t.map(jt));
}
function We(e) {
	return U(e = /* @__PURE__ */ G(e), "iterate", H), e;
}
function Ge(e, t) {
	return /* @__PURE__ */ Dt(e) ? Mt(/* @__PURE__ */ Et(e) ? jt(t) : t) : jt(t);
}
var Ke = {
	__proto__: null,
	[Symbol.iterator]() {
		return qe(this, Symbol.iterator, (e) => Ge(this, e));
	},
	concat(...e) {
		return Ue(this).concat(...e.map((e) => d(e) ? Ue(e) : e));
	},
	entries() {
		return qe(this, "entries", (e) => (e[1] = Ge(this, e[1]), e));
	},
	every(e, t) {
		return Ye(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Ye(this, "filter", e, t, (e) => e.map((e) => Ge(this, e)), arguments);
	},
	find(e, t) {
		return Ye(this, "find", e, t, (e) => Ge(this, e), arguments);
	},
	findIndex(e, t) {
		return Ye(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Ye(this, "findLast", e, t, (e) => Ge(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Ye(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Ye(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Ze(this, "includes", e);
	},
	indexOf(...e) {
		return Ze(this, "indexOf", e);
	},
	join(e) {
		return Ue(this).join(e);
	},
	lastIndexOf(...e) {
		return Ze(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Ye(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Qe(this, "pop");
	},
	push(...e) {
		return Qe(this, "push", e);
	},
	reduce(e, ...t) {
		return Xe(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Xe(this, "reduceRight", e, t);
	},
	shift() {
		return Qe(this, "shift");
	},
	some(e, t) {
		return Ye(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Qe(this, "splice", e);
	},
	toReversed() {
		return Ue(this).toReversed();
	},
	toSorted(e) {
		return Ue(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ue(this).toSpliced(...e);
	},
	unshift(...e) {
		return Qe(this, "unshift", e);
	},
	values() {
		return qe(this, "values", (e) => Ge(this, e));
	}
};
function qe(e, t, n) {
	let r = We(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Ot(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Je = Array.prototype;
function Ye(e, t, n, r, i, a) {
	let o = We(e), s = o !== e && !/* @__PURE__ */ Ot(e), c = o[t];
	if (c !== Je[t]) {
		let t = c.apply(e, a);
		return s ? jt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Ge(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Xe(e, t, n, r) {
	let i = We(e), a = i !== e && !/* @__PURE__ */ Ot(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ge(e, t)), n.call(this, t, Ge(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ge(e, c) : c;
}
function Ze(e, t, n) {
	let r = /* @__PURE__ */ G(e);
	U(r, "iterate", H);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ kt(n[0]) ? (n[0] = /* @__PURE__ */ G(n[0]), r[t](...n)) : i;
}
function Qe(e, t, n = []) {
	V(), Te();
	let r = (/* @__PURE__ */ G(e))[t].apply(e, n);
	return Ee(), Pe(), r;
}
var $e = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), et = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function tt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ G(this);
	return U(t, "has", e), t.hasOwnProperty(e);
}
var nt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? bt : yt : i ? vt : _t).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Ke[t])) return e;
			if (t === "hasOwnProperty") return tt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ K(e) ? e : n);
		if ((_(t) ? et.has(t) : $e(t)) || (r || U(e, "get", t), i)) return o;
		if (/* @__PURE__ */ K(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ wt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ wt(o) : /* @__PURE__ */ St(o) : o;
	}
}, rt = class extends nt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Dt(i);
			if (!/* @__PURE__ */ Ot(n) && !/* @__PURE__ */ Dt(n) && (i = /* @__PURE__ */ G(i), n = /* @__PURE__ */ G(n)), !a && /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ K(e) ? e : r);
		return e === /* @__PURE__ */ G(r) && s && (o ? A(n, i) && W(e, "set", t, n, i) : W(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && W(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !et.has(t)) && U(e, "has", t), n;
	}
	ownKeys(e) {
		return U(e, "iterate", d(e) ? "length" : Ve), Reflect.ownKeys(e);
	}
}, it = class extends nt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, at = /* @__PURE__ */ new rt(), ot = /* @__PURE__ */ new it(), st = /* @__PURE__ */ new rt(!0), ct = (e) => e, lt = (e) => Reflect.getPrototypeOf(e);
function ut(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ G(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? ct : t ? Mt : jt;
		return !t && U(a, "iterate", l ? He : Ve), s(Object.create(u), { next() {
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
function dt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function ft(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ G(r), a = /* @__PURE__ */ G(n);
			e || (A(n, a) && U(i, "get", n), U(i, "get", a));
			let { has: o } = lt(i), s = t ? ct : e ? Mt : jt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && U(/* @__PURE__ */ G(t), "iterate", Ve), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ G(n), i = /* @__PURE__ */ G(t);
			return e || (A(t, i) && U(r, "has", t), U(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ G(a), s = t ? ct : e ? Mt : jt;
			return !e && U(o, "iterate", Ve), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: dt("add"),
		set: dt("set"),
		delete: dt("delete"),
		clear: dt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ G(this), r = lt(n), i = /* @__PURE__ */ G(e), a = !t && !/* @__PURE__ */ Ot(e) && !/* @__PURE__ */ Dt(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), W(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Ot(n) && !/* @__PURE__ */ Dt(n) && (n = /* @__PURE__ */ G(n));
			let r = /* @__PURE__ */ G(this), { has: i, get: a } = lt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ G(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && W(r, "set", e, n, s) : W(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ G(this), { has: n, get: r } = lt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ G(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && W(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ G(this), t = e.size !== 0, n = e.clear();
			return t && W(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = ut(r, e, t);
	}), n;
}
function pt(e, t) {
	let n = ft(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var mt = { get: /* @__PURE__ */ pt(!1, !1) }, ht = { get: /* @__PURE__ */ pt(!1, !0) }, gt = { get: /* @__PURE__ */ pt(!0, !1) }, _t = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap();
function xt(e) {
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
function St(e) {
	return /* @__PURE__ */ Dt(e) ? e : Tt(e, !1, at, mt, _t);
}
// @__NO_SIDE_EFFECTS__
function Ct(e) {
	return Tt(e, !1, st, ht, vt);
}
// @__NO_SIDE_EFFECTS__
function wt(e) {
	return Tt(e, !0, ot, gt, yt);
}
function Tt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = xt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return /* @__PURE__ */ Dt(e) ? /* @__PURE__ */ Et(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ G(t) : e;
}
function At(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && j(e, "__v_skip", !0), e;
}
var jt = (e) => v(e) ? /* @__PURE__ */ St(e) : e, Mt = (e) => v(e) ? /* @__PURE__ */ wt(e) : e;
// @__NO_SIDE_EFFECTS__
function K(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function q(e) {
	return Nt(e, !1);
}
function Nt(e, t) {
	return /* @__PURE__ */ K(e) ? e : new Pt(e, t);
}
var Pt = class {
	constructor(e, t) {
		this.dep = new Re(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ G(e), this._value = t ? e : jt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Ot(e) || /* @__PURE__ */ Dt(e);
		e = n ? e : /* @__PURE__ */ G(e), A(e, t) && (this._rawValue = e, this._value = n ? e : jt(e), this.dep.trigger());
	}
};
function Ft(e) {
	return /* @__PURE__ */ K(e) ? e.value : e;
}
var It = {
	get: (e, t, n) => t === "__v_raw" ? e : Ft(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Lt(e) {
	return /* @__PURE__ */ Et(e) ? e : new Proxy(e, It);
}
var Rt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Re(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ie - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return we(this, !0), !0;
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
function zt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Rt(r, i, n);
}
var Bt = {}, Vt = /* @__PURE__ */ new WeakMap(), Ht = void 0;
function Ut(e, t = !1, n = Ht) {
	if (n) {
		let t = Vt.get(n);
		t || Vt.set(n, t = []), t.push(e);
	}
}
function Wt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Ot(e) || o === !1 || o === 0 ? Gt(e, 1) : Gt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ K(e) ? (g = () => e.value, y = /* @__PURE__ */ Ot(e)) : /* @__PURE__ */ Et(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Et(e) || /* @__PURE__ */ Ot(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ K(e)) return e.value;
		if (/* @__PURE__ */ Et(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			V();
			try {
				_();
			} finally {
				Pe();
			}
		}
		let t = Ht;
		Ht = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Ht = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Gt(e(), t);
	}
	let x = ye(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Bt) : Bt, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => A(e, C[t])) : A(t, C))) {
				_ && _();
				let e = Ht;
				Ht = m;
				try {
					let e = [
						t,
						C === Bt ? void 0 : b && C[0] === Bt ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Ht = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new xe(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Ut(e, !1, m), _ = m.onStop = () => {
		let e = Vt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Vt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Gt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ K(e)) Gt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Gt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Gt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Gt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Gt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Kt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Jt(e, t, n);
	}
}
function qt(e, t, n, r) {
	if (h(e)) {
		let i = Kt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Jt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(qt(e[a], t, n, r));
		return i;
	}
}
function Jt(e, n, r, i = !0) {
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
			V(), Kt(o, null, 10, [
				e,
				i,
				a
			]), Pe();
			return;
		}
	}
	Yt(e, r, a, i, s);
}
function Yt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var J = [], Xt = -1, Zt = [], Qt = null, $t = 0, en = /* @__PURE__ */ Promise.resolve(), tn = null;
function nn(e) {
	let t = tn || en;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function rn(e) {
	let t = Xt + 1, n = J.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = J[r], a = un(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function an(e) {
	if (!(e.flags & 1)) {
		let t = un(e), n = J[J.length - 1];
		!n || !(e.flags & 2) && t >= un(n) ? J.push(e) : J.splice(rn(t), 0, e), e.flags |= 1, on();
	}
}
function on() {
	tn ||= en.then(dn);
}
function sn(e) {
	d(e) ? Zt.push(...e) : Qt && e.id === -1 ? Qt.splice($t + 1, 0, e) : e.flags & 1 || (Zt.push(e), e.flags |= 1), on();
}
function cn(e, t, n = Xt + 1) {
	for (; n < J.length; n++) {
		let t = J[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			J.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function ln(e) {
	if (Zt.length) {
		let e = [...new Set(Zt)].sort((e, t) => un(e) - un(t));
		if (Zt.length = 0, Qt) {
			Qt.push(...e);
			return;
		}
		for (Qt = e, $t = 0; $t < Qt.length; $t++) {
			let e = Qt[$t];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Qt = null, $t = 0;
	}
}
var un = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function dn(e) {
	try {
		for (Xt = 0; Xt < J.length; Xt++) {
			let e = J[Xt];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Kt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Xt < J.length; Xt++) {
			let e = J[Xt];
			e && (e.flags &= -2);
		}
		Xt = -1, J.length = 0, ln(e), tn = null, (J.length || Zt.length) && dn(e);
	}
}
var fn = null, pn = null;
function mn(e) {
	let t = fn;
	return fn = e, pn = e && e.type.__scopeId || null, t;
}
function hn(e, t = fn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && xi(-1);
		let i = mn(t), a;
		try {
			a = e(...n);
		} finally {
			mn(i), r._d && xi(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function gn(e, n) {
	if (fn === null) return e;
	let r = ia(fn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Gt(o), i.push({
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
function _n(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (V(), qt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Pe());
	}
}
function vn(e, t) {
	if (Hi) {
		let n = Hi.provides, r = Hi.parent && Hi.parent.provides;
		r === n && (n = Hi.provides = Object.create(r)), n[e] = t;
	}
}
function yn(e, t, n = !1) {
	let r = Ui();
	if (r || wr) {
		let i = wr ? wr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var bn = /* @__PURE__ */ Symbol.for("v-scx"), xn = () => yn(bn);
function Sn(e, t, n) {
	return Cn(e, t, n);
}
function Cn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Yi) {
		if (c === "sync") {
			let e = xn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Hi;
	u.call = (e, t, n) => qt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ti(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : an(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Wt(e, n, u);
	return Yi && (f ? f.push(h) : d && h()), h;
}
function wn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Tn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Ki(this), s = Cn(i, a.bind(r), n);
	return o(), s;
}
function Tn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var En = /* @__PURE__ */ Symbol("_vte"), Dn = (e) => e.__isTeleport, On = /* @__PURE__ */ Symbol("_leaveCb");
function kn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, kn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function An(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function jn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Mn = /* @__PURE__ */ new WeakMap();
function Nn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Nn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Fn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Nn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? ia(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ G(v), b = v === t ? i : (e) => !jn(_, e) && u(y, e), x = (e, t) => !(t && jn(_, t));
	if (m != null && m !== p) {
		if (Pn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ K(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		V();
		try {
			Kt(p, f, 12, [l, _]);
		} finally {
			Pe();
		}
	} else {
		let t = g(p), n = /* @__PURE__ */ K(p);
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
					i(), Mn.delete(e);
				};
				t.id = -1, Mn.set(e, t), ti(t, r);
			} else Pn(e), i();
		}
	}
}
function Pn(e) {
	let t = Mn.get(e);
	t && (t.flags |= 8, Mn.delete(e));
}
ae().requestIdleCallback, ae().cancelIdleCallback;
var Fn = (e) => !!e.type.__asyncLoader, In = (e) => e.type.__isKeepAlive;
function Ln(e, t) {
	zn(e, "a", t);
}
function Rn(e, t) {
	zn(e, "da", t);
}
function zn(e, t, n = Hi) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Vn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) In(e.parent.vnode) && Bn(r, t, n, e), e = e.parent;
	}
}
function Bn(e, t, n, r) {
	let i = Vn(t, e, r, !0);
	Jn(() => {
		c(r[t], i);
	}, n);
}
function Vn(e, t, n = Hi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			V();
			let i = Ki(n), a = qt(t, n, e, r);
			return i(), Pe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Hn = (e) => (t, n = Hi) => {
	(!Yi || e === "sp") && Vn(e, (...e) => t(...e), n);
}, Un = Hn("bm"), Wn = Hn("m"), Gn = Hn("bu"), Kn = Hn("u"), qn = Hn("bum"), Jn = Hn("um"), Yn = Hn("sp"), Xn = Hn("rtg"), Zn = Hn("rtc");
function Qn(e, t = Hi) {
	Vn("ec", e, t);
}
var $n = /* @__PURE__ */ Symbol.for("v-ndc");
function er(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Et(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Ot(e), s = /* @__PURE__ */ Dt(e), e = We(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Mt(jt(e[n])) : jt(e[n]) : e[n], n, void 0, a && a[n]);
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
var tr = (e) => e ? Ji(e) ? ia(e) : tr(e.parent) : null, nr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => tr(e.parent),
	$root: (e) => tr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => dr(e),
	$forceUpdate: (e) => e.f ||= () => {
		an(e.update);
	},
	$nextTick: (e) => e.n ||= nn.bind(e.proxy),
	$watch: (e) => wn.bind(e)
}), rr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), ir = {
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
			else if (rr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else or && (s[n] = 0);
		}
		let d = nr[n], f, p;
		if (d) return n === "$attrs" && U(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return rr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || rr(n, c) || u(o, c) || u(i, c) || u(nr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ar(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var or = !0;
function sr(e) {
	let t = dr(e), n = e.proxy, i = e.ctx;
	or = !1, t.beforeCreate && lr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: ee, renderTriggered: te, errorCaptured: E, serverPrefetch: D, expose: O, inheritAttrs: k, components: ne, directives: A, filters: re } = t;
	if (u && cr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ St(t));
	}
	if (or = !0, o) for (let e in o) {
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
	if (c) for (let e in c) ur(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			vn(t, e[t]);
		});
	}
	f && lr(f, e, "c");
	function j(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (j(Un, p), j(Wn, m), j(Gn, g), j(Kn, _), j(Ln, y), j(Rn, b), j(Qn, E), j(Zn, ee), j(Xn, te), j(qn, S), j(Jn, w), j(Yn, D), d(O)) if (O.length) {
		let t = e.exposed ||= {};
		O.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), k != null && (e.inheritAttrs = k), ne && (e.components = ne), A && (e.directives = A), D && An(e);
}
function cr(e, t, n = r) {
	d(e) && (e = gr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? yn(r.from || n, r.default, !0) : yn(r.from || n) : yn(r), /* @__PURE__ */ K(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function lr(e, t, n) {
	qt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function ur(e, t, n, r) {
	let i = r.includes(".") ? Tn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Sn(i, n);
	} else if (h(e)) Sn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => ur(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && Sn(i, r, e);
	}
}
function dr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => fr(c, e, o, !0)), fr(c, t, o)), v(t) && a.set(t, c), c;
}
function fr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && fr(e, a, n, !0), i && i.forEach((t) => fr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = pr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var pr = {
	data: mr,
	props: yr,
	emits: yr,
	methods: vr,
	computed: vr,
	beforeCreate: _r,
	created: _r,
	beforeMount: _r,
	mounted: _r,
	beforeUpdate: _r,
	updated: _r,
	beforeDestroy: _r,
	beforeUnmount: _r,
	destroyed: _r,
	unmounted: _r,
	activated: _r,
	deactivated: _r,
	errorCaptured: _r,
	serverPrefetch: _r,
	components: vr,
	directives: vr,
	watch: br,
	provide: mr,
	inject: hr
};
function mr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function hr(e, t) {
	return vr(gr(e), gr(t));
}
function gr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function _r(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function vr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function yr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), ar(e), ar(t ?? {})) : t;
}
function br(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = _r(e[r], t[r]);
	return n;
}
function xr() {
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
var Sr = 0;
function Cr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = xr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Sr++,
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
					let u = l._ceVNode || Oi(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, ia(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (qt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = wr;
				wr = l;
				try {
					return e();
				} finally {
					wr = t;
				}
			}
		};
		return l;
	};
}
var wr = null, Tr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function Er(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Tr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(ie)));
	let c, l = i[c = ne(n)] || i[c = ne(E(n))];
	!l && o && (l = i[c = ne(O(n))]), l && qt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, qt(u, e, 6, a);
	}
}
var Dr = /* @__PURE__ */ new WeakMap();
function Or(e, t, n = !1) {
	let r = n ? Dr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Or(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function kr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function Ar(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = mn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Pi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Pi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : jr(c);
		}
	} catch (t) {
		_i.length = 0, Jt(t, e, 1), v = Oi(hi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Mr(y, a)), b = ji(b, y, !1, !0));
	}
	return n.dirs && (b = ji(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && kn(b, n.transition), v = b, mn(_), v;
}
var jr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Mr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Nr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Pr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Fr(o, r, n) && !kr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Pr(r, o, l) : !!o;
	return !1;
}
function Pr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Fr(t, e, a) && !kr(n, a)) return !0;
	}
	return !1;
}
function Fr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !pe(r, i) : r !== i;
}
function Ir({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Lr = {}, Rr = () => Object.create(Lr), zr = (e) => Object.getPrototypeOf(e) === Lr;
function Br(e, t, n, r = !1) {
	let i = {}, a = Rr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Hr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Ct(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Vr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ G(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (kr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = E(o);
					i[t] = Ur(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Hr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = O(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ur(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && W(e.attrs, "set", "");
}
function Hr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : kr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ G(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Ur(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Ur(e, t, n, r, i, a) {
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
var Wr = /* @__PURE__ */ new WeakMap();
function Gr(e, r, i = !1) {
	let a = i ? Wr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Gr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		Kr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (Kr(t)) {
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
function Kr(e) {
	return e[0] !== "$" && !T(e);
}
var qr = (e) => e === "_" || e === "_ctx" || e === "$stable", Jr = (e) => d(e) ? e.map(Pi) : [Pi(e)], Yr = (e, t, n) => {
	if (t._n) return t;
	let r = hn((...e) => Jr(t(...e)), n);
	return r._c = !1, r;
}, Xr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (qr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Yr(n, i, r);
		else if (i != null) {
			let e = Jr(i);
			t[n] = () => e;
		}
	}
}, Zr = (e, t) => {
	let n = Jr(t);
	e.slots.default = () => n;
}, Qr = (e, t, n) => {
	for (let r in t) (n || !qr(r)) && (e[r] = t[r]);
}, $r = (e, t, n) => {
	let r = e.slots = Rr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Qr(r, t, n), n && j(r, "_", e, !0)) : Xr(t, r);
	} else t && Zr(e, t);
}, ei = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Qr(a, n, r) : (o = !n.$stable, Xr(n, a)), s = n;
	} else n && (Zr(e, n), s = { default: 1 });
	if (o) for (let e in a) !qr(e) && s[e] == null && delete a[e];
}, ti = pi;
function ni(e) {
	return ri(e);
}
function ri(e, i) {
	let a = ae();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ti(e, t) && (r = pe(e), F(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case mi:
				y(e, t, n, r);
				break;
			case hi:
				b(e, t, n, r);
				break;
			case gi:
				e ?? x(t, n, r, o);
				break;
			case Y:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? A(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, I);
		}
		u != null && i ? Nn(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Nn(e.ref, null, a, e, !0);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, ii(e, a), s, u), _ && _n(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ri(f, r, e);
		}
		_ && _n(e, null, r, "beforeMount");
		let v = oi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ti(() => {
			try {
				f && Ri(f, r, e), v && g.enter(d), _ && _n(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || fi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Fi(e[l]) : Pi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && ai(r, !1), (g = h.onVnodeBeforeUpdate) && Ri(g, r, n, e), f && _n(n, e, r, "beforeUpdate"), r && ai(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, ii(n, a), o) : s || N(e, n, l, null, r, i, ii(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && ti(() => {
			g && Ri(g, r, n, e), f && _n(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === Y || !Ti(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
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
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && si(e, t, !0)) : N(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : ie(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = Vi(e, r, i);
		if (In(e) && (s.ctx.renderer = I), Xi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, M, o), !e.el) {
				let r = s.subTree = Oi(hi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else M(s, e, t, n, i, a, o);
	}, ie = (e, t, n) => {
		let r = t.component = e.component;
		if (Nr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			oe(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, M = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = li(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							ti(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				ai(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ri(d, s, t, c), ai(e, !0);
				let f = Ar(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), pe(p), e, i, a), t.el = f.el, u === null && Ir(e, f.el), r && ti(r, i), (d = t.props && t.props.onVnodeUpdated) && ti(() => Ri(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Fn(t);
				if (ai(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && Ri(o, d, t), ai(e, !0), s && _e) {
					let t = () => {
						e.subTree = Ar(e), _e(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Ar(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ti(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ti(() => Ri(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Fn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ti(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new xe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => an(u), ai(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Vr(e, t.props, r, n), ei(e, t.children, n), V(), cn(e), Pe();
	}, N = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				P(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && fe(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : fe(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, P = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Fi(t[p]) : Pi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? fe(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, se = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Fi(t[u]) : Pi(t[u]);
			if (Ti(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Fi(t[p]) : Pi(t[p]);
			if (Ti(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Fi(t[u]) : Pi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) F(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Fi(t[u]) : Pi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					F(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ti(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? F(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? ci(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || di(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ce(n, r, p, 2) : _--);
			}
		}
	}, ce = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ce(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, I);
			return;
		}
		if (c === Y) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === gi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[On] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ti(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[On];
				a._isLeaving && a[On](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, F = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (V(), Nn(s, null, n, e, !0), Pe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Fn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ri(_, t, e), u & 6) de(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && _n(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, I, r) : l && !l.hasOnce && (a !== Y || d > 0 && d & 64) ? fe(l, t, n, !1, !0) : (a === Y && d & 384 || !i && u & 16) && fe(c, t, n), r && le(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ti(() => {
			_ && Ri(_, t, e), h && _n(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, le = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === Y) {
			ue(n, r);
			return;
		}
		if (t === gi) {
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
	}, ue = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, de = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ui(c), ui(l), r && re(r), i.stop(), a && (a.flags |= 8, F(o, e, t, n)), s && ti(s, t), ti(() => {
			e.isUnmounted = !0;
		}, t);
	}, fe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) F(e[o], t, n, r, i);
	}, pe = (e) => {
		if (e.shapeFlag & 6) return pe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[En];
		return n ? h(n) : t;
	}, me = !1, he = (e, t, n) => {
		let r;
		e == null ? t._vnode && (F(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, me ||= (me = !0, cn(r), ln(), !1);
	}, I = {
		p: v,
		um: F,
		m: ce,
		r: le,
		mt: j,
		mc: E,
		pc: N,
		pbc: O,
		n: pe,
		o: e
	}, ge, _e;
	return i && ([ge, _e] = i(I)), {
		render: he,
		hydrate: ge,
		createApp: Cr(he, ge)
	};
}
function ii({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ai({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function oi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function si(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Fi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && si(t, a)), a.type === mi && (a.patchFlag === -1 && (a = i[e] = Fi(a)), a.el = t.el), a.type === hi && !a.el && (a.el = t.el);
	}
}
function ci(e) {
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
function li(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : li(t);
}
function ui(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function di(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? di(t.subTree) : null;
}
var fi = (e) => e.__isSuspense;
function pi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : sn(e);
}
var Y = /* @__PURE__ */ Symbol.for("v-fgt"), mi = /* @__PURE__ */ Symbol.for("v-txt"), hi = /* @__PURE__ */ Symbol.for("v-cmt"), gi = /* @__PURE__ */ Symbol.for("v-stc"), _i = [], vi = null;
function X(e = !1) {
	_i.push(vi = e ? null : []);
}
function yi() {
	_i.pop(), vi = _i[_i.length - 1] || null;
}
var bi = 1;
function xi(e, t = !1) {
	bi += e, e < 0 && vi && t && (vi.hasOnce = !0);
}
function Si(e) {
	return e.dynamicChildren = bi > 0 ? vi || n : null, yi(), bi > 0 && vi && vi.push(e), e;
}
function Z(e, t, n, r, i, a) {
	return Si(Q(e, t, n, r, i, a, !0));
}
function Ci(e, t, n, r, i) {
	return Si(Oi(e, t, n, r, i, !0));
}
function wi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ti(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ei = ({ key: e }) => e ?? null, Di = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ K(e) || h(e) ? {
	i: fn,
	r: e,
	k: t,
	f: !!n
} : e);
function Q(e, t = null, n = null, r = 0, i = null, a = e === Y ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ei(t),
		ref: t && Di(t),
		scopeId: pn,
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
		ctx: fn
	};
	return s ? (Ii(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), bi > 0 && !o && vi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && vi.push(c), c;
}
var Oi = ki;
function ki(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === $n) && (e = hi), wi(e)) {
		let r = ji(e, t, !0);
		return n && Ii(r, n), bi > 0 && !a && vi && (r.shapeFlag & 6 ? vi[vi.indexOf(e)] = r : vi.push(r)), r.patchFlag = -2, r;
	}
	if (aa(e) && (e = e.__vccOpts), t) {
		t = Ai(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = F(e)), v(n) && (/* @__PURE__ */ kt(n) && !d(n) && (n = s({}, n)), t.style = oe(n));
	}
	let o = g(e) ? 1 : fi(e) ? 128 : Dn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Q(e, t, n, r, i, o, a, !0);
}
function Ai(e) {
	return e ? /* @__PURE__ */ kt(e) || zr(e) ? s({}, e) : e : null;
}
function ji(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Li(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ei(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Di(t)) : [a, Di(t)] : Di(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== Y ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ji(e.ssContent),
		ssFallback: e.ssFallback && ji(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && kn(u, c.clone(u)), u;
}
function Mi(e = " ", t = 0) {
	return Oi(mi, null, e, t);
}
function Ni(e, t) {
	let n = Oi(gi, null, e);
	return n.staticCount = t, n;
}
function $(e = "", t = !1) {
	return t ? (X(), Ci(hi, null, e)) : Oi(hi, null, e);
}
function Pi(e) {
	return e == null || typeof e == "boolean" ? Oi(hi) : d(e) ? Oi(Y, null, e.slice()) : wi(e) ? Fi(e) : Oi(mi, null, String(e));
}
function Fi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ji(e);
}
function Ii(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Ii(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !zr(t) ? t._ctx = fn : r === 3 && fn && (fn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Ii(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: fn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Mi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Li(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = F([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ri(e, t, n, r = null) {
	qt(e, t, 7, [n, r]);
}
var zi = xr(), Bi = 0;
function Vi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || zi, o = {
		uid: Bi++,
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
		scope: new ve(!0),
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
		propsOptions: Gr(i, a),
		emitsOptions: Or(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Er.bind(null, o), e.ce && e.ce(o), o;
}
var Hi = null, Ui = () => Hi || fn, Wi, Gi;
{
	let e = ae(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Wi = t("__VUE_INSTANCE_SETTERS__", (e) => Hi = e), Gi = t("__VUE_SSR_SETTERS__", (e) => Yi = e);
}
var Ki = (e) => {
	let t = Hi;
	return Wi(e), e.scope.on(), () => {
		e.scope.off(), Wi(t);
	};
}, qi = () => {
	Hi && Hi.scope.off(), Wi(null);
};
function Ji(e) {
	return e.vnode.shapeFlag & 4;
}
var Yi = !1;
function Xi(e, t = !1, n = !1) {
	t && Gi(t);
	let { props: r, children: i } = e.vnode, a = Ji(e);
	Br(e, r, a, t), $r(e, i, n || t);
	let o = a ? Zi(e, t) : void 0;
	return t && Gi(!1), o;
}
function Zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ir);
	let { setup: r } = n;
	if (r) {
		V();
		let n = e.setupContext = r.length > 1 ? ra(e) : null, i = Ki(e), a = Kt(r, e, 0, [e.props, n]), o = y(a);
		if (Pe(), i(), (o || e.sp) && !Fn(e) && An(e), o) {
			if (a.then(qi, qi), t) return a.then((n) => {
				Qi(e, n, t);
			}).catch((t) => {
				Jt(t, e, 0);
			});
			e.asyncDep = a;
		} else Qi(e, a, t);
	} else ta(e, t);
}
function Qi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Lt(t)), ta(e, n);
}
var $i, ea;
function ta(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && $i && !i.render) {
			let t = i.template || dr(e).template;
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
		V();
		try {
			sr(e);
		} finally {
			Pe(), t();
		}
	}
}
var na = { get(e, t) {
	return U(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Lt(At(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in nr) return nr[n](e);
		},
		has(e, t) {
			return t in e || t in nr;
		}
	}) : e.proxy;
}
function aa(e) {
	return h(e) && "__vccOpts" in e;
}
var oa = (e, t) => /* @__PURE__ */ zt(e, t, Yi), sa = "3.5.39", ca = void 0, la = typeof window < "u" && window.trustedTypes;
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
function Aa(e, t, n, r, i, a = ue(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ka, t.slice(6, t.length)) : e.setAttributeNS(ka, t, n) : n == null || a && !de(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = de(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
				e && qt(e, t, 5, a);
			}
		} else qt(r, t, 5, [e]);
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
	return d(t) ? (e) => re(t, e) : t;
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
	return t && (e = e.trim()), n && (e = ie(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ie(e.value) : e.value, c = t ?? "";
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
				let e = me(t, n), a = e !== -1;
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
	if (d(t)) i = me(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = pe(t, no(e, !0));
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
	return so ||= ni(oo);
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
	"onPointerdown",
	"onKeydown"
], Xo = [
	"aria-label",
	"title",
	"onPointerdown"
], Zo = {
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
		selectedItemKeys: {
			type: Array,
			default: () => []
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
			return t.fieldKind === "image" && (n.shape === "circle" || n.aspectRatioLocked !== !1) ? [
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
		function C(e) {
			return Math.round(Number(e) * 100) / 100;
		}
		function w(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function T(e, t) {
			return t.shape === "circle" ? "1 / 1" : w(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function ee(e, t) {
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
		function te(e, t, r) {
			return n.designSpec?.itemStyles?.[`${m(e, t)}.${r.fieldKey}`] || {};
		}
		function E(e, t, n) {
			let r = te(e, t, n), i = s(o(e, t, n)), a = [
				"square",
				"rounded",
				"circle"
			].includes(r.shape) ? r.shape : "square";
			return {
				backgroundImage: i ? `url(${JSON.stringify(i)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(r.imageFit) ? r.imageFit : "contain",
				backgroundPosition: r.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				aspectRatio: w(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius, 24px)" : "0"
			};
		}
		function D(e, t, n) {
			let r = te(e, t, n), i = o(e, t, n);
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
		function O(e, t) {
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
		function k(e) {
			return a(e).length > 1 ? a(e).reduce((e, t) => e + k(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
		}
		function ne(e) {
			return Math.max(180, (e.items || []).reduce((e, t) => e + k(t), 0) + 52);
		}
		function A(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((e, t) => e + k(t), 0), a = g(e).minHeight || ne(e), o = Math.max(50, a - 76);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function re(e) {
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
		function ie(e, t, n = "medium") {
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
		function M(e) {
			let t = g(e), n = t.minHeight || ne(e), r = d(e), i = j(t), a = r ? ie(re(t), i, t.backgroundFadeStrength) : "";
			return {
				height: `${Math.max(50, n)}px`,
				backgroundColor: i,
				backgroundImage: r ? [a, `url(${JSON.stringify(r)})`].filter(Boolean).join(", ") : void 0,
				backgroundSize: r ? a ? `100% 100%, ${t.backgroundSize || "contain"}` : t.backgroundSize || "contain" : void 0,
				backgroundPosition: r ? a ? `center, ${t.backgroundPosition || "center center"}` : t.backgroundPosition || "center center" : void 0,
				backgroundRepeat: r ? a ? `no-repeat, ${t.backgroundRepeat || "no-repeat"}` : t.backgroundRepeat || "no-repeat" : void 0
			};
		}
		function ae(e) {
			let t = g(e).minHeight || ne(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function N(e, t) {
			let n = h(e, t), r = n.positionMode === "free" ? n : A(e, t), i = t.fieldKind === "image", a = S(n.widthPct, 10, 100, 32), o = S(n.heightPx, 80, 900, void 0);
			return {
				left: `${r.xPct || 0}%`,
				top: n.yPx === void 0 ? `${r.yPct || 0}%` : `${n.yPx}px`,
				zIndex: n.zIndex || 2,
				color: n.color,
				"--item-color": n.color,
				fontSize: n.fontSize === void 0 ? void 0 : `${n.fontSize}px`,
				"--item-font-size": n.fontSize === void 0 ? void 0 : `${n.fontSize}px`,
				fontWeight: n.fontWeight,
				"--item-font-weight": n.fontWeight,
				width: n.widthPct !== void 0 || i ? `${a}%` : void 0,
				height: o && (!i || n.shape !== "circle") ? `${o}px` : void 0,
				aspectRatio: i && (!o || n.shape === "circle") ? T(t, n) : void 0
			};
		}
		function P(e, t, i = null) {
			n.editable && r("select-item", e, t, { additive: !!(i?.ctrlKey || i?.metaKey || i?.shiftKey) });
		}
		function se(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest(".item-resize-handle") || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), P(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
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
			if (!n.editable || i.isLocked || e.button !== 0) return;
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c) return;
			e.preventDefault(), e.stopPropagation(), P(t, i), o.setPointerCapture(e.pointerId), s.classList.add("is-resizing");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = u.width, m = u.height, _ = u.left - l.left, v = u.top - l.top, y = m ? p / m : 1, b = h(t, i), x = i.fieldKind === "image", w = x && b.aspectRatioLocked !== !1, T = a.includes("w") || a.includes("e"), ee = a.includes("n") || a.includes("s"), te = x ? null : s.querySelector(".rendered-text, .rendered-empty, .rendered-cta"), E = te ? Number.parseFloat(getComputedStyle(te).fontSize) : 18, D = S(b.fontSize, 0, 80, E || 18), O = p, k = m, A = D, re = _, j = v, ie = 0, M = (e) => {
				let t = a.includes("w") ? -1 : 1, n = a.includes("n") ? -1 : 1, r = (e.clientX - d) * t, i = (e.clientY - f) * n, o = Math.max(80, a.includes("w") ? p + _ : l.width - _), c = Math.max(80, a.includes("n") ? m + v : 1124 - v), u = T ? Math.min(o, Math.max(80, p + r)) : p, h = ee ? Math.min(c, Math.max(80, m + i)) : m;
				if (w || x && b.shape === "circle") {
					let e = b.shape === "circle" ? 1 : y;
					Math.abs(i) > Math.abs(r) ? (k = h, O = Math.min(o, Math.max(80, k * e)), k = O / e) : (O = u, k = Math.min(c, Math.max(80, O / e)), O = k * e);
				} else O = u, k = h;
				if (!x) {
					let e = p ? O / p : 1, t = m ? k / m : 1, n = T && ee ? Math.sqrt(e * t) : T ? e : t;
					A = C(S(D * n, 0, 80, D));
				}
				re = a.includes("w") ? _ + p - O : _, j = a.includes("n") ? v + m - k : v, !ie && (ie = requestAnimationFrame(() => {
					ie = 0, s.style.left = `${re}px`, s.style.top = `${j}px`, (T || w) && (s.style.width = `${O}px`), (ee || w) && (s.style.height = `${k}px`), x ? s.style.aspectRatio = "auto" : s.style.setProperty("--item-font-size", `${A}px`);
				}));
			}, ae = () => {
				ie && cancelAnimationFrame(ie);
				let e = Math.ceil(j + k + 76);
				e > (g(t).minHeight || ne(t)) && r("update-section-style", t.sectionKey, { minHeight: Math.min(1200, e) }), r("update-renderer-item-style", t, i, {
					positionMode: "free",
					xPct: l.width ? re / l.width * 100 : 0,
					yPx: j,
					widthPct: l.width ? O / l.width * 100 : 32,
					heightPx: w || x && b.shape === "circle" ? void 0 : ee ? k : b.heightPx,
					...x ? { aspectRatio: `${Math.max(1, Math.round(O))}/${Math.max(1, Math.round(k))}` } : { fontSize: A }
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("--item-font-size"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", M), o.removeEventListener("pointerup", ae), o.removeEventListener("pointercancel", ae);
			};
			o.addEventListener("pointermove", M), o.addEventListener("pointerup", ae), o.addEventListener("pointercancel", ae);
		}
		function le(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = h(t, i), s = i.fieldKind === "image", c = s && o.aspectRatioLocked !== !1, l = e.shiftKey ? 4 : 1, u = a.includes("w") || a.includes("e"), d = a.includes("n") || a.includes("s"), f = u ? a.includes("w") ? e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0 : e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0 : 0, p = d ? a.includes("n") ? e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0 : e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0 : 0, m = f || p;
			if (c && !m || !c && !f && !p) return;
			let g = S((o.widthPct ?? 32) + (c ? m : f) * l, 10, 100, 32), _ = S(o.heightPx, 80, 900, 240), v = c || s && o.shape === "circle" ? void 0 : d ? S(_ + p * l * 4, 80, 900, 240) : _, y = g / (o.widthPct ?? 32), b = v ? v / _ : 1, x = u && d ? Math.sqrt(y * b) : u ? y : b;
			r("update-renderer-item-style", t, i, {
				widthPct: g,
				heightPx: v,
				...s ? {} : { fontSize: C(S((o.fontSize ?? 18) * x, 0, 80, 18)) }
			});
		}
		function ue(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "text") return;
			e.preventDefault(), e.stopPropagation(), P(t, i);
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
		return (t, n) => (X(), Z("div", {
			class: F(["promo-renderer", {
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
		}, [e.editable && e.showGuides ? (X(), Z("div", Do)) : $("", !0), (X(!0), Z(Y, null, er(i.value, (t) => (X(), Z("section", {
			key: t.sectionKey,
			class: F(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: oe(M(t)),
			"aria-busy": b(t)?.kind === "processing" ? "true" : void 0
		}, [
			e.editable && b(t) ? (X(), Z("div", {
				key: 0,
				class: F(["section-ai-state", `is-${b(t).kind}`]),
				role: "status",
				"aria-live": "polite",
				title: b(t).detail || void 0
			}, [b(t).kind === "processing" ? (X(), Z("i", Ao)) : $("", !0), Q("span", null, I(b(t).label), 1)], 10, ko)) : $("", !0),
			Q("div", jo, [Q("div", {
				class: "rendered-items",
				style: oe(ae(t))
			}, [(X(!0), Z(Y, null, er(u(t), (r) => (X(), Z("article", {
				key: r.itemKey,
				class: F(["rendered-item", [`rendered-item--${r.fieldKind || "text"}`, {
					"is-editable": e.editable && !r.isLocked,
					"is-selected": e.editable && (e.selectedItemKey === m(t, r) || e.selectedItemKeys.includes(m(t, r))),
					"is-free-positioned": !0
				}]]),
				"data-item-key": r.itemKey,
				"data-style-key": m(t, r),
				style: oe(N(t, r)),
				onClick: ao((e) => P(t, r, e), ["stop"]),
				onPointerdown: (e) => se(e, t, r),
				onDblclick: (e) => ue(e, t, r)
			}, [a(r).length > 1 ? (X(), Z("div", No, [(X(!0), Z(Y, null, er(a(r), (i) => (X(), Z(Y, { key: i.fieldKey }, [i.fieldKind === "cta" ? (X(), Z("a", {
				key: 0,
				class: "rendered-cta rendered-component-field",
				href: f(o(t, r, i)),
				target: o(t, r, i)?.target || "_self",
				rel: o(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, I(o(t, r, i)?.label || i.name), 9, Po)) : i.fieldKind === "image" ? (X(), Z("div", Fo, [Q("div", {
				class: "rendered-image-frame rendered-component-image-frame",
				style: oe(E(t, r, i)),
				role: D(t, r, i).role,
				"aria-label": D(t, r, i).label,
				"aria-hidden": D(t, r, i).ariaHidden,
				"aria-busy": b(t, r, i)?.kind === "processing" ? "true" : void 0
			}, [s(o(t, r, i)) ? $("", !0) : (X(), Z("div", Lo, [Q("span", null, I(i.name), 1), n[0] ||= Q("small", null, "이미지 준비 중", -1)]))], 12, Io), e.editable && b(t, r, i) ? (X(), Z("div", {
				key: 0,
				class: F(["item-ai-state", `is-${b(t, r, i).kind}`]),
				role: "status",
				"aria-live": "polite"
			}, [b(t, r, i).kind === "processing" ? (X(), Z("i", Ro)) : $("", !0), Q("span", null, I(b(t, r, i).label), 1)], 2)) : $("", !0)])) : p(o(t, r, i)) ? (X(), Z("p", zo, I(o(t, r, i)), 1)) : (X(), Z("p", Bo, I(i.name), 1))], 64))), 128))])) : r.fieldKind === "cta" ? (X(), Z("a", {
				key: 1,
				class: "rendered-cta",
				href: f(o(t, r)),
				target: o(t, r)?.target || "_self",
				rel: o(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, I(o(t, r)?.label || r.name), 9, Vo)) : r.fieldKind === "image" ? (X(), Z(Y, { key: 2 }, [
				Q("div", {
					class: F(["rendered-image-frame", `rendered-image-frame--${h(t, r).shape || "square"}`]),
					style: oe(ee(t, r)),
					role: O(t, r).role,
					"aria-label": O(t, r).label,
					"aria-hidden": O(t, r).ariaHidden,
					"aria-busy": b(t, r)?.kind === "processing" ? "true" : void 0
				}, [s(o(t, r)) ? $("", !0) : (X(), Z("div", Uo, [Q("span", null, I(r.name), 1), Q("small", null, I(o(t, r)?.value || "이미지 준비 중"), 1)]))], 14, Ho),
				e.editable && b(t, r) ? (X(), Z("div", {
					key: 0,
					class: F(["item-ai-state", `is-${b(t, r).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: b(t, r).detail || void 0
				}, [b(t, r).kind === "processing" ? (X(), Z("i", Go)) : $("", !0), Q("span", null, I(b(t, r).label), 1)], 10, Wo)) : $("", !0),
				e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === m(t, r) ? (X(!0), Z(Y, { key: 1 }, er(x(t, r), (e) => (X(), Z("button", {
					key: e,
					type: "button",
					class: F(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
					"aria-label": `${r.name} 이미지 ${e} 방향 크기 조절`,
					onPointerdown: ao((n) => ce(n, t, r, e), ["stop"]),
					onKeydown: (n) => le(n, t, r, e)
				}, null, 42, Ko))), 128)) : $("", !0)
			], 64)) : (X(), Z(Y, { key: 3 }, [p(o(t, r)) ? (X(), Z("p", qo, I(o(t, r)), 1)) : (X(), Z("p", Jo, I(r.name), 1))], 64)), e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === m(t, r) ? (X(!0), Z(Y, { key: 4 }, er(x(t, r), (e) => (X(), Z("button", {
				key: e,
				type: "button",
				class: F(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
				"aria-label": `${r.name} ${e} 방향 크기 조절`,
				onPointerdown: ao((n) => ce(n, t, r, e), ["stop"]),
				onKeydown: (n) => le(n, t, r, e)
			}, null, 42, Yo))), 128)) : $("", !0)], 46, Mo))), 128))], 4)]),
			e.editable && e.showGuides ? (X(), Z("button", {
				key: 1,
				class: "section-resize-handle",
				type: "button",
				"aria-label": `${t.name} 섹션 높이 조절`,
				title: `${t.name} 섹션 높이 조절`,
				onPointerdown: (e) => de(e, t)
			}, null, 40, Xo)) : $("", !0)
		], 14, Oo))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/layout-utils.mjs
function Qo(e) {
	return JSON.parse(JSON.stringify(e));
}
function $o(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = $o(n[e], t) : n[e] = Qo(t));
	}), n;
}
function es(e = {}) {
	return ts(go, e);
}
function ts(e = go, t = {}) {
	let n = $o(Qo(e || go), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, Object.values(n.itemStyles).forEach((e) => {
		e && typeof e == "object" && delete e.textAlign;
	}), n.sectionStyles = n.sectionStyles || {}, n;
}
function ns(e = {}) {
	let t = es(e), n = [], r = /* @__PURE__ */ new Set(["contain"]), i = /* @__PURE__ */ new Set([
		"left center",
		"center center",
		"right center"
	]), a = /* @__PURE__ */ new Set([
		"none",
		"left",
		"right",
		"both"
	]), o = /* @__PURE__ */ new Set([
		"soft",
		"medium",
		"strong"
	]), s = /* @__PURE__ */ new Set(["contain", "cover"]), c = /* @__PURE__ */ new Set([
		"left top",
		"center top",
		"right top",
		"left center",
		"center center",
		"right center",
		"left bottom",
		"center bottom",
		"right bottom"
	]), l = /* @__PURE__ */ new Set([
		"square",
		"rounded",
		"circle"
	]);
	return Object.entries(t.sectionStyles).forEach(([e, t]) => {
		let s = Number(t?.minHeight);
		t?.minHeight !== void 0 && (!Number.isFinite(s) || s < 50 || s > 1200) && n.push({
			path: `sectionStyles.${e}.minHeight`,
			message: "Section height must be between 50 and 1200."
		}), t?.backgroundSize !== void 0 && !r.has(t.backgroundSize) && n.push({
			path: `sectionStyles.${e}.backgroundSize`,
			message: "Unsupported section background size."
		}), t?.backgroundPosition !== void 0 && !i.has(t.backgroundPosition) && n.push({
			path: `sectionStyles.${e}.backgroundPosition`,
			message: "Unsupported section background position."
		}), t?.backgroundFadeMode !== void 0 && !a.has(t.backgroundFadeMode) && n.push({
			path: `sectionStyles.${e}.backgroundFadeMode`,
			message: "Unsupported section background fade mode."
		}), t?.backgroundFadeStrength !== void 0 && !o.has(t.backgroundFadeStrength) && n.push({
			path: `sectionStyles.${e}.backgroundFadeStrength`,
			message: "Unsupported section background fade strength."
		});
		for (let r of ["backgroundColor", "backgroundFadeColor"]) t?.[r] !== void 0 && !/^#[0-9a-f]{6}$/i.test(String(t[r])) && n.push({
			path: `sectionStyles.${e}.${r}`,
			message: "Section colors must use six-digit hex values."
		});
	}), Object.entries(t.itemStyles).forEach(([e, t]) => {
		let r = Number(t?.xPct), i = Number(t?.yPx), a = Number(t?.fontSize);
		t?.xPct !== void 0 && (!Number.isFinite(r) || r < 0 || r > 100) && n.push({
			path: `itemStyles.${e}.xPct`,
			message: "xPct must be between 0 and 100."
		}), t?.yPx !== void 0 && (!Number.isFinite(i) || i < 0 || i > 1200) && n.push({
			path: `itemStyles.${e}.yPx`,
			message: "yPx must be between 0 and 1200."
		}), t?.fontSize !== void 0 && (!Number.isFinite(a) || a < 0 || a > 80) && n.push({
			path: `itemStyles.${e}.fontSize`,
			message: "fontSize must be between 0 and 80."
		});
		let o = Number(t?.widthPct), u = Number(t?.heightPx);
		t?.widthPct !== void 0 && (!Number.isFinite(o) || o < 10 || o > 100) && n.push({
			path: `itemStyles.${e}.widthPct`,
			message: "Component width must be between 10 and 100 percent."
		}), t?.heightPx !== void 0 && (!Number.isFinite(u) || u < 80 || u > 900) && n.push({
			path: `itemStyles.${e}.heightPx`,
			message: "Component height must be between 80 and 900."
		}), t?.imageFit !== void 0 && !s.has(t.imageFit) && n.push({
			path: `itemStyles.${e}.imageFit`,
			message: "Unsupported image fit."
		}), t?.imagePosition !== void 0 && !c.has(t.imagePosition) && n.push({
			path: `itemStyles.${e}.imagePosition`,
			message: "Unsupported image position."
		}), t?.shape !== void 0 && !l.has(t.shape) && n.push({
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
//#region visual-editor/src/multi-layout.mjs
var rs = Object.freeze([
	"align-left",
	"align-center",
	"align-right",
	"align-top",
	"align-middle",
	"align-bottom",
	"distribute-horizontal",
	"distribute-vertical",
	"equal-width",
	"equal-height",
	"set-gap",
	"group-stack-horizontal",
	"group-stack-vertical"
]), is = Object.freeze({
	"space-2": 8,
	"space-3": 12,
	"space-4": 16,
	"space-6": 24,
	"space-8": 32
});
function as(e) {
	return Math.round(Number(e) * 1e3) / 1e3;
}
function os(e) {
	if (!Array.isArray(e) || e.length < 2) throw Error("2개 이상의 컴포넌트 geometry가 필요합니다.");
	let t = /* @__PURE__ */ new Set();
	return e.map((e) => {
		let n = String(e?.itemKey || "").trim(), r = {
			itemKey: n,
			xPct: Number(e?.xPct),
			yPx: Number(e?.yPx),
			widthPct: Number(e?.widthPct),
			heightPx: Number(e?.heightPx)
		};
		if (!n || t.has(n)) throw Error("중복되거나 비어 있는 컴포넌트 key가 있습니다.");
		if (![
			r.xPct,
			r.yPx,
			r.widthPct,
			r.heightPx
		].every(Number.isFinite)) throw Error(`${n}의 geometry 값이 올바르지 않습니다.`);
		return t.add(n), r;
	});
}
function ss(e) {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((n, r) => {
		e.slice(r + 1).forEach((e) => {
			let r = n.xPct < e.xPct + e.widthPct && n.xPct + n.widthPct > e.xPct, i = n.yPx < e.yPx + e.heightPx && n.yPx + n.heightPx > e.yPx;
			r && i && t.add([n.itemKey, e.itemKey].sort().join("|"));
		});
	}), t;
}
function cs(e, t) {
	e.forEach((e) => {
		if (e.xPct < -.001 || e.yPx < -.001 || e.widthPct < 10 || e.widthPct > 100 || e.heightPx < 80 || e.heightPx > 900 || e.xPct + e.widthPct > 100.001 || e.yPx + e.heightPx > t + .001) throw Error(`${e.itemKey} 결과가 섹션 경계를 벗어납니다.`);
	});
}
function ls(e, t) {
	return [...e].sort((e, n) => t === "horizontal" ? e.xPct - n.xPct : e.yPx - n.yPx);
}
function us(e, t, n = {}) {
	let r = os(e).map((e) => ({ ...e })), i = String(t?.operation || "");
	if (!rs.includes(i)) throw Error("허용되지 않은 레이아웃 명령입니다.");
	if ([...Array.isArray(t?.targetItemKeys) ? t.targetItemKeys.map(String) : []].sort().join("\n") !== r.map((e) => e.itemKey).sort().join("\n")) throw Error("레이아웃 명령의 대상이 현재 선택과 일치하지 않습니다.");
	let a = Math.max(1, Number(n.canvasWidthPx || 1280)), o = Math.max(80, Number(n.canvasHeightPx || 900)), s = is[t?.gapToken || "space-4"];
	if (s === void 0) throw Error("허용되지 않은 gap token입니다.");
	let c = ss(r), l = Math.min(...r.map((e) => e.xPct)), u = Math.max(...r.map((e) => e.xPct + e.widthPct)), d = Math.min(...r.map((e) => e.yPx)), f = Math.max(...r.map((e) => e.yPx + e.heightPx));
	if (i === "align-left" && r.forEach((e) => {
		e.xPct = l;
	}), i === "align-center") {
		let e = (l + u) / 2;
		r.forEach((t) => {
			t.xPct = e - t.widthPct / 2;
		});
	}
	if (i === "align-right" && r.forEach((e) => {
		e.xPct = u - e.widthPct;
	}), i === "align-top" && r.forEach((e) => {
		e.yPx = d;
	}), i === "align-middle") {
		let e = (d + f) / 2;
		r.forEach((t) => {
			t.yPx = e - t.heightPx / 2;
		});
	}
	if (i === "align-bottom" && r.forEach((e) => {
		e.yPx = f - e.heightPx;
	}), i === "equal-width") {
		let e = r.reduce((e, t) => e + t.widthPct, 0) / r.length;
		r.forEach((t) => {
			t.widthPct = e;
		});
	}
	if (i === "equal-height") {
		let e = r.reduce((e, t) => e + t.heightPx, 0) / r.length;
		r.forEach((t) => {
			t.heightPx = e;
		});
	}
	if (i === "distribute-horizontal") {
		let e = ls(r, "horizontal"), t = u - l - e.reduce((e, t) => e + t.widthPct, 0);
		if (t < 0) throw Error("가로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = l;
		e.forEach((e) => {
			e.xPct = i, i += e.widthPct + n;
		});
	}
	if (i === "distribute-vertical") {
		let e = ls(r, "vertical"), t = f - d - e.reduce((e, t) => e + t.heightPx, 0);
		if (t < 0) throw Error("세로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = d;
		e.forEach((e) => {
			e.yPx = i, i += e.heightPx + n;
		});
	}
	if (i === "set-gap" || i === "group-stack-horizontal" || i === "group-stack-vertical") {
		let e = i === "group-stack-horizontal" ? "horizontal" : i === "group-stack-vertical" ? "vertical" : t?.axis;
		if (!["horizontal", "vertical"].includes(e)) throw Error("간격 적용 방향이 필요합니다.");
		let n = ls(r, e), o = e === "horizontal" ? l : d;
		n.forEach((t) => {
			e === "horizontal" ? (t.xPct = o, o += t.widthPct + s / a * 100) : (t.yPx = o, o += t.heightPx + s);
		});
	}
	r.forEach((e) => {
		e.xPct = as(e.xPct), e.yPx = as(e.yPx), e.widthPct = as(e.widthPct), e.heightPx = as(e.heightPx);
	}), cs(r, o);
	let p = [...ss(r)].find((e) => !c.has(e));
	if (p) throw Error(`레이아웃 결과에 새 충돌이 발생했습니다: ${p}`);
	return r;
}
function ds(e) {
	return Object.fromEntries(os(e).map((e) => [e.itemKey, {
		positionMode: "free",
		xPct: as(e.xPct),
		yPx: as(e.yPx),
		widthPct: as(e.widthPct),
		heightPx: as(e.heightPx)
	}]));
}
function fs(e, t, n = {}) {
	try {
		return {
			geometry: us(e, t, n),
			plan: t,
			adjusted: !1,
			adjustmentReason: ""
		};
	} catch (r) {
		let i = String(r?.message || "");
		if (!/새 충돌|경계를 벗어|공간이 부족/.test(i)) throw r;
		let a = t?.gapToken || "space-4", o = [
			"align-top",
			"align-middle",
			"align-bottom"
		].includes(t?.operation) ? ["group-stack-horizontal", "group-stack-vertical"] : ["group-stack-vertical", "group-stack-horizontal"], s = r;
		for (let r of o) {
			let o = {
				...t,
				operation: r,
				axis: r.endsWith("horizontal") ? "horizontal" : "vertical",
				gapToken: a
			};
			try {
				return {
					geometry: us(e, o, n),
					plan: o,
					adjusted: !0,
					adjustmentReason: `${i} 충돌을 피하기 위해 ${r} 명령으로 자동 보정했습니다.`
				};
			} catch (e) {
				s = e;
			}
		}
		throw s;
	}
}
//#endregion
//#region visual-editor/src/App.vue
var ps = {
	key: 0,
	class: "output-shell"
}, ms = { class: "output-toolbar" }, hs = {
	key: 0,
	class: "system-message system-message--error"
}, gs = ["data-shell-frame"], _s = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, vs = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, ys = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], bs = ["data-lucide"], xs = { "data-shell-nav-label": "" }, Ss = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, Cs = { class: "shell-page-identity" }, ws = { class: "shell-page-actions" }, Ts = {
	class: "shell-status",
	role: "status"
}, Es = {
	key: 0,
	class: "editor-header editor-toolbar"
}, Ds = {
	key: 0,
	class: "editor-mode-note"
}, Os = { class: "editor-global-actions" }, ks = {
	key: 0,
	class: "global-token-menu"
}, As = { class: "global-token-swatches" }, js = [
	"title",
	"aria-label",
	"onClick"
], Ms = {
	key: 1,
	"aria-label": "Visual Editor navigation"
}, Ns = ["disabled"], Ps = {
	key: 1,
	class: "system-message"
}, Fs = {
	key: 2,
	class: "system-message system-message--error"
}, Is = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, Ls = {
	key: 4,
	class: "system-message",
	role: "status"
}, Rs = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, zs = { class: "panel-heading" }, Bs = { class: "section-list" }, Vs = ["onClick"], Hs = ["aria-label"], Us = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, Ws = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, Gs = { class: "preview-panel" }, Ks = { class: "preview-toolbar" }, qs = { class: "preview-title-group" }, Js = ["disabled"], Ys = {
	key: 1,
	class: "preview-edit-hint"
}, Xs = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, Zs = { class: "preview-controls" }, Qs = ["disabled"], $s = { class: "guide-toggle" }, ec = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, tc = { class: "property-panel" }, nc = { class: "panel-heading" }, rc = {
	key: 0,
	class: "property-form"
}, ic = { class: "section-properties" }, ac = { class: "section-properties__heading" }, oc = {
	key: 0,
	class: "section-ai-actions"
}, sc = ["disabled"], cc = ["disabled", "title"], lc = {
	key: 1,
	class: "section-background-alignment"
}, uc = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, dc = ["onClick"], fc = {
	key: 2,
	class: "section-background-fade"
}, pc = ["value"], mc = { key: 0 }, hc = ["value"], gc = { class: "section-size-control" }, _c = ["disabled"], vc = {
	key: 0,
	class: "multi-layout-panel"
}, yc = { class: "multi-layout-panel__heading" }, bc = ["disabled"], xc = { class: "multi-layout-panel__actions" }, Sc = ["disabled"], Cc = ["disabled"], wc = {
	key: 0,
	class: "multi-layout-error",
	role: "alert"
}, Tc = {
	key: 1,
	class: "multi-layout-preview"
}, Ec = {
	key: 0,
	class: "multi-layout-adjustment"
}, Dc = { key: 1 }, Oc = { class: "multi-layout-preview__comparison" }, kc = { class: "multi-layout-panel__actions" }, Ac = { class: "component-property-list" }, jc = { class: "component-property-header" }, Mc = ["title"], Nc = [
	"checked",
	"disabled",
	"aria-label",
	"onChange"
], Pc = ["aria-expanded", "onClick"], Fc = { class: "component-property-body" }, Ic = {
	key: 0,
	class: "component-property-content"
}, Lc = {
	key: 0,
	class: "component-field-property-list"
}, Rc = [
	"disabled",
	"value",
	"onInput"
], zc = [
	"disabled",
	"value",
	"onInput"
], Bc = ["disabled", "onClick"], Vc = [
	"disabled",
	"value",
	"onChange"
], Hc = ["value"], Uc = [
	"disabled",
	"value",
	"onInput"
], Wc = { key: 1 }, Gc = [
	"disabled",
	"value",
	"onInput"
], Kc = ["onClick"], qc = { key: 2 }, Jc = [
	"disabled",
	"rows",
	"value",
	"onInput"
], Yc = { key: 1 }, Xc = ["disabled", "value"], Zc = { key: 2 }, Qc = ["disabled", "value"], $c = ["disabled", "title"], el = ["disabled", "value"], tl = ["value"], nl = ["disabled", "value"], rl = { key: 1 }, il = ["disabled", "value"], al = { key: 2 }, ol = ["disabled", "value"], sl = { key: 4 }, cl = ["disabled", "rows"], ll = { class: "item-meta" }, ul = { class: "design-controls" }, dl = { class: "design-controls__heading" }, fl = ["disabled"], pl = {
	key: 0,
	class: "image-frame-controls"
}, ml = { class: "image-resize-mode" }, hl = {
	role: "group",
	"aria-label": "이미지 크기 조절 방식"
}, gl = ["disabled"], _l = ["disabled"], vl = { key: 0 }, yl = { class: "range-field" }, bl = ["disabled", "value"], xl = ["disabled", "value"], Sl = { key: 0 }, Cl = { class: "range-field" }, wl = ["disabled", "value"], Tl = ["disabled", "value"], El = ["disabled", "value"], Dl = ["disabled", "value"], Ol = ["disabled", "value"], kl = { class: "toggle-field" }, Al = ["disabled", "checked"], jl = { key: 1 }, Ml = ["disabled", "value"], Nl = {
	key: 1,
	class: "component-frame-controls"
}, Pl = { class: "range-field" }, Fl = ["disabled", "value"], Il = ["disabled", "value"], Ll = { class: "range-field" }, Rl = ["disabled", "value"], zl = ["disabled", "value"], Bl = ["disabled", "value"], Vl = { class: "range-field" }, Hl = ["disabled", "value"], Ul = ["disabled", "value"], Wl = { class: "position-status" }, Gl = { key: 0 }, Kl = { key: 1 }, ql = ["disabled"], Jl = {
	key: 0,
	class: "component-property-empty"
}, Yl = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, Xl = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ q(t.mode !== "output"), r = /* @__PURE__ */ q(""), i = /* @__PURE__ */ q([]), a = /* @__PURE__ */ q(null), o = /* @__PURE__ */ q(""), s = /* @__PURE__ */ q([]), c = /* @__PURE__ */ q({}), l = /* @__PURE__ */ q(JSON.parse(JSON.stringify(go))), u = /* @__PURE__ */ q(""), d = /* @__PURE__ */ q(""), f = /* @__PURE__ */ q([]), p = /* @__PURE__ */ q(""), m = /* @__PURE__ */ q(null), h = /* @__PURE__ */ q("desktop"), g = /* @__PURE__ */ q(!0), _ = /* @__PURE__ */ q(""), v = /* @__PURE__ */ q(null), y = /* @__PURE__ */ q(1), b = /* @__PURE__ */ q(null), x = /* @__PURE__ */ q(""), S = /* @__PURE__ */ q(!1), C = /* @__PURE__ */ q(""), w = /* @__PURE__ */ q(!1), T = /* @__PURE__ */ q(!1), ee = /* @__PURE__ */ q(""), te = /* @__PURE__ */ q({}), E = /* @__PURE__ */ q(!1), D = /* @__PURE__ */ q(""), O = /* @__PURE__ */ q(null), k = /* @__PURE__ */ q([]), ne = /* @__PURE__ */ q(0), A = !1, re = oa(() => t.mode === "admin-layout"), j = oa(() => t.mode === "wizard-layout"), ie = new URLSearchParams(window.location.search).get("source") || "", M = oa(() => j.value && ie === "create-promo"), ae = window.PromoShell?.navItems || [], N = oa(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), P = oa(() => N.value?.items?.find((e) => e.itemKey === d.value) || N.value?.items?.[0]), se = oa({
			get: () => c.value?.[N.value?.sectionKey]?.[P.value?.itemKey],
			set: (e) => Se(e)
		}), ce = oa(() => a.value ? So({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), le = oa(() => t.mode === "output" ? v.value : ce.value);
		function ue(e, t, { preserveMulti: n = !1 } = {}) {
			if (!e) return;
			let r = u.value && u.value !== e.sectionKey;
			u.value = e.sectionKey, d.value = t?.itemKey || "", (!n || r) && (f.value = t?.itemKey ? [t.itemKey] : []);
		}
		function de(e, t) {
			return e && t ? `${e.sectionKey}.${t.itemKey}` : "";
		}
		async function fe(e, t, n = {}) {
			if (n.additive && !t?.isLocked && u.value === e.sectionKey) {
				let n = new Set(f.value);
				n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], ue(e, t, { preserveMulti: !0 });
			} else ue(e, t);
			p.value = de(e, t), await nn();
		}
		function pe(e) {
			if (!e || !m.value) return;
			let t = m.value.querySelector(`[data-section-key="${CSS.escape(e.sectionKey)}"]`);
			if (!t) return;
			let n = m.value.getBoundingClientRect(), r = t.getBoundingClientRect();
			m.value.scrollTo({
				top: Math.max(0, m.value.scrollTop + r.top - n.top),
				behavior: "smooth"
			});
		}
		async function me(e) {
			if (!e) return;
			let t = e.items?.[0] || null;
			ue(e, t), p.value = de(e, t), await nn(), pe(e);
		}
		function he(e) {
			return !!(e?.itemKey && f.value.includes(e.itemKey));
		}
		function ge(e, t) {
			if (!e || !t || t.isLocked) return;
			u.value !== e.sectionKey && (f.value = []);
			let n = new Set(f.value);
			n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], ue(e, t, { preserveMulti: !0 }), p.value = de(e, t), O.value = null, D.value = "";
		}
		function _e() {
			f.value = P.value?.itemKey ? [P.value.itemKey] : [], O.value = null, D.value = "";
		}
		function L(e) {
			return {
				"align-left": "왼쪽 정렬",
				"align-center": "가운데 정렬",
				"align-right": "오른쪽 정렬",
				"align-top": "위쪽 정렬",
				"align-middle": "세로 중앙 정렬",
				"align-bottom": "아래쪽 정렬",
				"distribute-horizontal": "가로 균등 배치",
				"distribute-vertical": "세로 균등 배치",
				"equal-width": "동일 너비",
				"equal-height": "동일 높이",
				"set-gap": "지정 간격 적용",
				"group-stack-horizontal": "가로 스택",
				"group-stack-vertical": "세로 스택"
			}[e] || e;
		}
		function ve(e) {
			if (!e || !m.value) throw Error("미리보기 영역을 찾지 못했습니다.");
			let t = m.value.querySelector(`[data-section-key="${CSS.escape(e.sectionKey)}"]`)?.querySelector(".rendered-items");
			if (!t) throw Error("선택한 섹션의 레이아웃 영역을 찾지 못했습니다.");
			let n = t.getBoundingClientRect();
			if (!n.width || !n.height) throw Error("레이아웃 영역 크기를 계산하지 못했습니다.");
			let r = [...t.querySelectorAll("[data-style-key]")];
			return {
				geometry: f.value.map((t) => {
					let i = `${e.sectionKey}.${t}`, a = r.find((e) => e.dataset.styleKey === i);
					if (!a) throw Error(`${t} 컴포넌트 위치를 찾지 못했습니다.`);
					let o = a.getBoundingClientRect();
					return {
						itemKey: t,
						xPct: (o.left - n.left) / n.width * 100,
						yPx: o.top - n.top,
						widthPct: o.width / n.width * 100,
						heightPx: Math.max(80, o.height)
					};
				}),
				canvasWidthPx: n.width,
				canvasHeightPx: n.height
			};
		}
		async function ye() {
			if (!(!N.value || f.value.length < 2 || E.value)) {
				E.value = !0, D.value = "", O.value = null;
				try {
					let e = ve(N.value), t = await fetch("/api/promo-multi-component-layout-plan", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							formTemplateId: a.value?.id,
							sectionKey: N.value.sectionKey,
							selectedItemKeys: f.value,
							geometry: e.geometry,
							sectionInputs: c.value?.[N.value.sectionKey] || {}
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `AI 정렬 요청 오류(${t.status})`);
					let r = fs(e.geometry, n.suggestion, e);
					O.value = {
						...r.plan,
						requestedOperation: n.suggestion.operation,
						adjusted: r.adjusted,
						adjustmentReason: r.adjustmentReason,
						sectionKey: N.value.sectionKey,
						before: e.geometry,
						after: r.geometry
					};
				} catch (e) {
					D.value = e.message;
				} finally {
					E.value = !1;
				}
			}
		}
		function R() {
			let e = O.value;
			if (!e || e.sectionKey !== N.value?.sectionKey) return;
			let t = JSON.parse(JSON.stringify(l.value)), n = ds(e.after), r = { ...l.value.itemStyles || {} };
			Object.entries(n).forEach(([t, n]) => {
				let i = `${e.sectionKey}.${t}`;
				r[i] = {
					...r[i] || {},
					...n
				};
			}), k.value = [...k.value.slice(-19), {
				designSpec: t,
				revision: ne.value,
				label: L(e.operation)
			}], l.value = {
				...l.value,
				itemStyles: r
			}, ne.value += 1, O.value = null, D.value = "";
		}
		function be() {
			let e = k.value.at(-1);
			e && (l.value = JSON.parse(JSON.stringify(e.designSpec)), ne.value = e.revision, k.value = k.value.slice(0, -1), O.value = null, D.value = "");
		}
		function xe(e, t) {
			let n = de(e, t);
			ue(e, t, { preserveMulti: f.value.includes(t.itemKey) }), p.value = p.value === n ? "" : n;
		}
		function Se(e) {
			!N.value || !P.value || (c.value = {
				...c.value,
				[N.value.sectionKey]: {
					...c.value[N.value.sectionKey],
					[P.value.itemKey]: e
				}
			});
		}
		function Ce(e, t) {
			Se({
				...se.value || {},
				[e]: t
			});
		}
		function z(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function we(e, t) {
			let n = c.value?.[N.value?.sectionKey]?.[e?.itemKey];
			return z(e).length <= 1 ? n : n?.fields?.[t.fieldKey];
		}
		function Te(e, t, n) {
			if (!N.value || !e || !t || e.isLocked || t.isLocked) return;
			if (z(e).length <= 1) {
				Se(n);
				return;
			}
			let r = N.value.sectionKey, i = c.value?.[r]?.[e.itemKey] || {};
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
		function Ee(e, t, n, r) {
			Te(e, t, {
				...we(e, t) || {},
				[n]: r
			});
		}
		function De(e, t, n) {
			ue(e, t), !(t.fieldKind !== "text" || t.isLocked) && Se(n);
		}
		function Oe(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			if (z(t).length > 1) {
				let e = z(t), r = e.filter((e) => e.isRequired || e.isLocked), i = (r.length ? r : e).map((e) => {
					let t = n?.fields?.[e.fieldKey];
					return e.fieldKind === "cta" ? !!(String(t?.label || "").trim() && String(t?.link || "").trim()) : e.fieldKind === "image" ? !!String(t?.value || "").trim() : !!String(t || "").trim();
				});
				return r.length ? i.every(Boolean) : i.some(Boolean);
			}
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function ke(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => Oe(e, t)) : t.some((t) => Oe(e, t));
		}
		function Ae() {
			!M.value || T.value || (T.value = !0, ee.value = "", window.parent.postMessage({
				type: "create-promo-auto-register-request",
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin));
		}
		function je(e) {
			return te.value?.[e.sectionKey] || null;
		}
		function Me(e) {
			let t = je(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function B(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets",
				"applying"
			].includes(je(e)?.status);
		}
		function Ne(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1) return !1;
				let n = t[e.itemKey];
				if (z(e).length > 1) return z(e).some((e) => {
					if (e.fieldKind === "image") return !1;
					let t = n?.fields?.[e.fieldKey], r = e.fieldKind === "cta" ? t?.label : t;
					return String(r || "").trim().length >= 2;
				});
				if (e.fieldKind === "image") return !1;
				let r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function V(e) {
			let t = je(e), n = t?.constraintsSnapshot?.imageTarget?.type === "section-background";
			return B(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : n && t?.status === "ready" && !Me(e) ? {
				action: "generate",
				label: "AI 적용 중",
				disabled: !0
			} : n && t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !Ne(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !Ne(e)
			};
		}
		function Pe(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function Fe(e, t, n = null) {
			let r = n || t;
			return !!(e?.aiDesign?.enabled !== !1 && r?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && !r?.isLocked && r?.image?.allowedSources?.includes("ai") && Pe(e).includes(t.itemKey));
		}
		function Ie(e) {
			let t = je(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function Le(e, t, n = null) {
			let r = je(e), i = r?.constraintsSnapshot?.imageTarget, a = Ie(e) === t?.itemKey && (!n || i?.fieldKey === n.fieldKey);
			return B(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : a && r?.status === "ready" && !Me(e) ? {
				action: "generate",
				label: "AI 이미지 적용 중",
				disabled: !0
			} : a && r?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !Ne(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !Ne(e)
			};
		}
		function Re(e, t, n = "", r = "", i = "") {
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
		function ze(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function Be(e = null) {
			!N.value || !P.value || P.value.isLocked || e?.isLocked || window.confirm(`${e?.name || P.value.name} 이미지를 삭제할까요?`) && window.parent.postMessage({
				type: "create-promo-remove-image",
				sectionKey: N.value.sectionKey,
				itemKey: P.value.itemKey,
				fieldKey: e?.fieldKey || null
			}, window.location.origin);
		}
		function Ve(e) {
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
		let He = oa(() => N.value && P.value ? `${N.value.sectionKey}.${P.value.itemKey}` : ""), H = oa(() => l.value.itemStyles?.[He.value] || {}), U = oa(() => N.value && l.value.sectionStyles?.[N.value.sectionKey] || {});
		function W(e) {
			!He.value || P.value?.isLocked || (l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[He.value]: {
						...H.value,
						...e
					}
				}
			});
		}
		function Ue(e, t, n) {
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
		function We() {
			if (!He.value || P.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} };
			delete e[He.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Ge() {
			if (!He.value || P.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} }, t = To(e[He.value]);
			Object.keys(t).length ? e[He.value] = t : delete e[He.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Ke(e, t) {
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
		function qe(e) {
			!N.value || ![
				"left",
				"center",
				"right"
			].includes(e) || Ke(N.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function Je(e) {
			!N.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || Ke(N.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: U.value.backgroundFadeStrength || "medium"
			});
		}
		function Ye(e) {
			[
				"square",
				"rounded",
				"circle"
			].includes(e) && W(e === "circle" ? {
				shape: e,
				aspectRatio: "1/1",
				aspectRatioLocked: !0,
				heightPx: void 0
			} : { shape: e });
		}
		function Xe(e) {
			if (!He.value || P.value?.isLocked || !["locked", "free"].includes(e)) return;
			let t = { ...l.value.itemStyles || {} }, n = { ...H.value };
			e === "locked" || n.shape === "circle" ? (n.aspectRatioLocked = !0, n.aspectRatio = n.shape === "circle" ? "1/1" : n.aspectRatio || P.value?.image?.aspectRatio || "1/1", delete n.heightPx) : (n.aspectRatioLocked = !1, n.heightPx = Number(n.heightPx || 240)), t[He.value] = n, l.value = {
				...l.value,
				itemStyles: t
			};
		}
		function Ze() {
			if (!N.value) return;
			let e = { ...l.value.sectionStyles || {} }, t = { ...e[N.value.sectionKey] || {} };
			delete t.minHeight, Object.keys(t).length ? e[N.value.sectionKey] = t : delete e[N.value.sectionKey], l.value = {
				...l.value,
				sectionStyles: e
			};
		}
		async function Qe() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = l.template, o.value = l.configRevision || "", s.value = l.sections || [], c.value = bo(s.value), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = de(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function $e() {
			if (!ce.value) return;
			_.value = "";
			let e = Eo(localStorage, mo, ce.value);
			if (!e.ok) {
				_.value = e.message;
				return;
			}
			window.open("/prototype/visual-output.html", "_blank", "noopener");
		}
		async function et() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error(n.message || n.error || "기본 레이아웃을 불러오지 못했습니다.");
				a.value = n.template, s.value = n.sections || [], c.value = bo(s.value), l.value = es(n.layout?.layoutSpec), y.value = Number(n.layout?.layoutRevision || 1), b.value = n.layout?.id || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = de(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function tt() {
			if (!a.value?.id || S.value) return;
			C.value = "";
			let e = ns(l.value);
			if (!e.ok) {
				C.value = `레이아웃 검증 실패: ${e.errors[0]?.path || "unknown"}`;
				return;
			}
			S.value = !0;
			try {
				let t = await fetch("/api/wizard-form-template-layout", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						templateId: a.value.id,
						expectedRevision: y.value,
						rendererKey: "default-promo-renderer",
						rendererVersion: 1,
						layoutSpec: e.spec,
						changeNote: x.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
					})
				}), n = await t.json().catch(() => ({}));
				if (!t.ok) throw Error(n.message || n.error || `레이아웃 저장 오류(${t.status})`);
				l.value = es(n.layout.layoutSpec), y.value = Number(n.layout.layoutRevision || y.value + 1), b.value = n.layout.id || b.value, x.value = "", C.value = `기본 레이아웃을 Draft에 저장했습니다. revision ${y.value} · Create Promo 반영을 위해 관리자 페이지에서 템플릿을 활성화하세요.`;
			} catch (e) {
				C.value = e.message;
			} finally {
				S.value = !1;
			}
		}
		async function nt(e) {
			if (!e?.content) return;
			let t = N.value?.sectionKey || u.value, i = P.value?.itemKey || d.value, m = p.value;
			A = !0, a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, te.value = e.content.sectionDesignRuns || {}, l.value = es(e.designSpec), y.value = Number(e.layoutRevision || 1);
			let h = s.value.find((e) => e.sectionKey === t) || s.value[0];
			u.value = h?.sectionKey || "", d.value = h?.items?.some((e) => e.itemKey === i) ? i : h?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], O.value = null;
			let g = de(h, h?.items?.find((e) => e.itemKey === d.value));
			p.value = s.value.some((e) => (e.items || []).some((t) => de(e, t) === m)) ? m : g, w.value = !0, n.value = !1, r.value = "", await nn(), A = !1;
		}
		function rt(e) {
			if (!(!j.value || e.origin !== window.location.origin)) {
				if (e.data?.type === "create-promo-auto-register-result") {
					T.value = !1;
					let t = Number(e.data.registeredCount || 0);
					ee.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e.data?.type === "promo-wizard-layout-snapshot" && nt(e.data.snapshot);
			}
		}
		Sn([l, c], () => {
			!j.value || !w.value || A || window.parent.postMessage({
				type: "promo-wizard-layout-change",
				designSpec: JSON.parse(JSON.stringify(l.value)),
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin);
		}, { deep: !0 });
		function it() {
			try {
				let e = localStorage.getItem(mo);
				if (!e) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
				v.value = JSON.parse(e);
			} catch (e) {
				r.value = e.message;
			}
		}
		return Wn(() => {
			M.value && (document.documentElement.classList.add("create-promo-editor-document"), document.body.classList.add("create-promo-editor-document")), window.PromoShell?.init(document), t.mode === "output" ? it() : re.value ? et() : j.value ? (n.value = !0, window.addEventListener("message", rt), window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin)) : Qe();
		}), qn(() => {
			window.removeEventListener("message", rt), document.documentElement.classList.remove("create-promo-editor-document"), document.body.classList.remove("create-promo-editor-document");
		}), (t, i) => e.mode === "output" ? (X(), Z("div", ps, [Q("header", ms, [Q("div", null, [i[36] ||= Q("span", null, "WEB OUTPUT", -1), Q("strong", null, I(le.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[37] ||= Q("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (X(), Z("div", hs, I(r.value), 1)) : le.value ? (X(), Ci(Zo, {
			key: 1,
			content: le.value.content,
			"design-spec": le.value.designSpec,
			assets: le.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : $("", !0)])) : (X(), Z("main", {
			key: 1,
			class: F(["editor-shell", {
				"shell-frame": !j.value,
				"editor-shell--embedded": M.value
			}]),
			"data-shell-frame": j.value ? null : ""
		}, [
			j.value ? $("", !0) : (X(), Z("aside", _s, [
				i[38] ||= Ni("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[39] ||= Q("div", {
					class: "shell-sidebar__mode",
					role: "group",
					"aria-label": "사이드바 표시 방식"
				}, [Q("button", {
					type: "button",
					"data-shell-sidebar-mode": "min",
					"aria-label": "사이드바 최소화",
					title: "최소"
				}, [Q("i", {
					"data-lucide": "panel-left-close",
					"aria-hidden": "true"
				}), Q("span", null, "최소")]), Q("button", {
					type: "button",
					"data-shell-sidebar-mode": "max",
					"aria-label": "사이드바 최대화",
					title: "최대"
				}, [Q("i", {
					"data-lucide": "panel-left-open",
					"aria-hidden": "true"
				}), Q("span", null, "최대")])], -1),
				Q("nav", vs, [(X(!0), Z(Y, null, er(Ft(ae), (e) => (X(), Z("a", {
					key: e.key,
					href: e.href,
					class: F({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [Q("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, bs), Q("span", xs, I(e.label), 1)], 10, ys))), 128))]),
				i[40] ||= Q("div", { class: "shell-sidebar__footer" }, [Q("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [Q("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), Q("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			Q("div", { class: F(j.value ? "editor-embedded-main" : "shell-main") }, [j.value ? $("", !0) : (X(), Z("header", Ss, [Q("div", Cs, [i[41] ||= Q("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), Q("strong", null, I(re.value ? "Admin Template Layout" : "Visual Editor"), 1)]), Q("div", ws, [Q("div", Ts, I(re.value ? `Layout revision ${y.value}` : "편집 준비"), 1)])])), Q("div", { class: F(["editor-content", {
				"shell-content": !j.value,
				"editor-content--embedded": M.value
			}]) }, [
				M.value ? $("", !0) : (X(), Z("header", Es, [Q("div", null, [
					Q("span", null, I(re.value ? "ADMIN TEMPLATE LAYOUT" : j.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					Q("h2", null, I(a.value?.name || "Default Renderer"), 1),
					re.value ? (X(), Z("small", Ds, " v" + I(a.value?.version || 1) + " · " + I(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : $("", !0)
				]), Q("div", Os, [M.value ? $("", !0) : (X(), Z("fieldset", ks, [i[42] ||= Q("legend", null, "페이지 배경", -1), Q("div", As, [(X(!0), Z(Y, null, er(Ft(ho), (e) => (X(), Z("button", {
					key: e.key,
					type: "button",
					class: F({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => Ve(e)
				}, [Q("i", { style: oe({ backgroundColor: e.value }) }, null, 4)], 10, js))), 128))])])), re.value ? (X(), Z("nav", Ms, [gn(Q("input", {
					"onUpdate:modelValue": i[0] ||= (e) => x.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[Qa, x.value]]), Q("button", {
					type: "button",
					disabled: !ce.value || S.value,
					onClick: tt
				}, I(S.value ? "저장 중" : "기본 레이아웃 저장"), 9, Ns)])) : $("", !0)])])),
				n.value ? (X(), Z("div", Ps, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (X(), Z("div", Fs, I(r.value), 1)) : $("", !0),
				_.value ? (X(), Z("div", Is, I(_.value), 1)) : $("", !0),
				C.value ? (X(), Z("div", Ls, I(C.value), 1)) : $("", !0),
				!n.value && !r.value ? (X(), Z("section", {
					key: 5,
					class: F(["editor-workspace", { "is-create-promo-wizard": M.value }])
				}, [
					Q("aside", Rs, [Q("div", zs, [i[43] ||= Q("span", null, "SECTIONS", -1), Q("strong", null, I(s.value.length), 1)]), Q("div", Bs, [(X(!0), Z(Y, null, er(s.value, (e) => (X(), Z("button", {
						key: e.sectionKey,
						type: "button",
						class: F(["section-trigger", { active: e.sectionKey === N.value?.sectionKey }]),
						onClick: (t) => me(e)
					}, [Q("span", null, I(e.name), 1), (X(), Z("svg", {
						class: F(["section-registration-icon", ke(e) ? "is-complete" : "is-incomplete"]),
						viewBox: "0 0 20 20",
						role: "img",
						"aria-label": ke(e) ? `${e.name} 콘텐츠 등록 완료` : `${e.name} 콘텐츠 등록 필요`
					}, [i[44] ||= Q("circle", {
						cx: "10",
						cy: "10",
						r: "9"
					}, null, -1), ke(e) ? (X(), Z("path", Us)) : (X(), Z("path", Ws))], 10, Hs))], 10, Vs))), 128))])]),
					Q("section", Gs, [Q("div", Ks, [Q("div", qs, [
						i[45] ||= Q("strong", null, "Live Preview", -1),
						Q("small", null, I(a.value.templateKey) + " · v" + I(a.value.version), 1),
						M.value ? (X(), Z("button", {
							key: 0,
							class: "auto-register-action",
							type: "button",
							disabled: T.value,
							onClick: Ae
						}, I(T.value ? "등록 중" : "자동등록"), 9, Js)) : $("", !0),
						M.value ? (X(), Z("small", Ys, "미리보기 요소를 선택해 내용을 입력하세요.")) : $("", !0),
						ee.value ? (X(), Z("small", Xs, I(ee.value), 1)) : $("", !0)
					]), Q("div", Zs, [
						re.value ? $("", !0) : (X(), Z("button", {
							key: 0,
							type: "button",
							class: "web-output-action",
							disabled: !ce.value,
							onClick: $e
						}, "Web Output", 8, Qs)),
						Q("label", $s, [
							gn(Q("input", {
								"onUpdate:modelValue": i[1] ||= (e) => g.value = e,
								type: "checkbox"
							}, null, 512), [[$a, g.value]]),
							i[46] ||= Q("span", null, "Guides", -1),
							Q("strong", null, I(g.value ? "ON" : "OFF"), 1)
						]),
						Q("div", ec, [Q("button", {
							type: "button",
							class: F({ active: h.value === "desktop" }),
							onClick: i[2] ||= (e) => h.value = "desktop"
						}, "Desktop", 2), Q("button", {
							type: "button",
							class: F({ active: h.value === "mobile" }),
							onClick: i[3] ||= (e) => h.value = "mobile"
						}, "Mobile", 2)])
					])]), Q("div", {
						ref_key: "previewStageRef",
						ref: m,
						class: F(["preview-stage", `preview-stage--${h.value}`])
					}, [le.value ? (X(), Ci(Zo, {
						key: 0,
						content: le.value.content,
						"design-spec": le.value.designSpec,
						assets: le.value.assets,
						"section-design-runs": te.value,
						editable: "",
						"show-guides": g.value,
						"selected-item-key": He.value,
						"selected-item-keys": f.value.map((e) => `${N.value?.sectionKey}.${e}`),
						onSelectItem: fe,
						onUpdateItemStyle: W,
						onUpdateRendererItemStyle: Ue,
						onUpdateItemContent: De,
						onUpdateSectionStyle: Ke
					}, null, 8, [
						"content",
						"design-spec",
						"assets",
						"section-design-runs",
						"show-guides",
						"selected-item-key",
						"selected-item-keys"
					])) : $("", !0)], 2)]),
					Q("aside", tc, [Q("div", nc, [i[47] ||= Q("span", null, "CONTENT", -1), Q("strong", null, I(N.value?.name || "섹션 선택"), 1)]), N.value ? (X(), Z("div", rc, [
						Q("section", ic, [
							Q("div", ac, [i[48] ||= Q("strong", null, "섹션 속성", -1), Q("small", null, I(N.value.name), 1)]),
							M.value ? (X(), Z("div", oc, [
								N.value.aiDesign?.enabled === !1 ? $("", !0) : (X(), Z("button", {
									key: 0,
									type: "button",
									class: "section-ai-action",
									disabled: V(N.value).disabled,
									onClick: i[4] ||= (e) => Re(N.value, "generate-layout", "", "layout")
								}, "AI 레이아웃 제안", 8, sc)),
								N.value.aiDesign?.enabled !== !1 && N.value.aiDesign?.allowSectionBackground !== !1 ? (X(), Z("button", {
									key: 1,
									type: "button",
									class: "section-ai-action",
									disabled: V(N.value).disabled,
									title: V(N.value).disabled && !B(N.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
									onClick: i[5] ||= (e) => Re(N.value, V(N.value).action, "", "section-background")
								}, I(V(N.value).label), 9, cc)) : $("", !0),
								ze(N.value) ? (X(), Z("button", {
									key: 2,
									type: "button",
									class: "section-ai-remove",
									onClick: i[6] ||= (e) => Re(N.value, "remove-background")
								}, "배경 삭제")) : $("", !0)
							])) : $("", !0),
							ze(N.value) ? (X(), Z("div", lc, [i[49] ||= Q("span", null, "배경 이미지 정렬", -1), Q("div", uc, [(X(), Z(Y, null, er([
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
							], (e) => Q("button", {
								key: e.value,
								type: "button",
								class: F({ active: (U.value.backgroundPosition || "center center") === `${e.value} center` }),
								onClick: (t) => qe(e.value)
							}, I(e.label), 11, dc)), 64))])])) : $("", !0),
							ze(N.value) || N.value.aiDesign?.enabled !== !1 ? (X(), Z("div", fc, [Q("label", null, [i[51] ||= Q("span", null, "배경 이미지 페이드", -1), Q("select", {
								value: U.value.backgroundFadeMode || "none",
								onChange: i[7] ||= (e) => Je(e.target.value)
							}, [...i[50] ||= [
								Q("option", { value: "none" }, "페이드 없음", -1),
								Q("option", { value: "left" }, "왼쪽 페이드", -1),
								Q("option", { value: "right" }, "오른쪽 페이드", -1),
								Q("option", { value: "both" }, "양끝 페이드", -1)
							]], 40, pc)]), (U.value.backgroundFadeMode || "none") === "none" ? $("", !0) : (X(), Z("label", mc, [i[53] ||= Q("span", null, "페이드 강도", -1), Q("select", {
								value: U.value.backgroundFadeStrength || "medium",
								onChange: i[8] ||= (e) => Ke(N.value.sectionKey, { backgroundFadeStrength: e.target.value })
							}, [...i[52] ||= [
								Q("option", { value: "soft" }, "약하게", -1),
								Q("option", { value: "medium" }, "보통", -1),
								Q("option", { value: "strong" }, "강하게", -1)
							]], 40, hc)]))])) : $("", !0),
							Q("div", gc, [Q("div", null, [i[54] ||= Q("span", null, "섹션 높이", -1), Q("strong", null, I(U.value.minHeight ? `${Math.round(U.value.minHeight)}px` : "자동"), 1)]), Q("button", {
								type: "button",
								disabled: !U.value.minHeight,
								onClick: Ze
							}, " 높이 초기화 ", 8, _c)])
						]),
						M.value ? (X(), Z("section", vc, [
							Q("div", yc, [Q("div", null, [i[55] ||= Q("strong", null, "AI 다중 정렬", -1), Q("small", null, I(f.value.length) + "개 컴포넌트 선택 · revision " + I(ne.value), 1)]), Q("button", {
								type: "button",
								disabled: f.value.length <= 1,
								onClick: _e
							}, "선택 초기화", 8, bc)]),
							i[56] ||= Q("p", null, "아래 체크박스 또는 Ctrl/Cmd+미리보기 클릭으로 같은 섹션의 컴포넌트를 2개 이상 선택하세요.", -1),
							Q("div", xc, [Q("button", {
								type: "button",
								class: "section-ai-action",
								disabled: f.value.length < 2 || E.value,
								onClick: ye
							}, I(E.value ? "AI 제안 생성 중" : "AI 정렬 제안"), 9, Sc), Q("button", {
								type: "button",
								disabled: !k.value.length,
								onClick: be
							}, "마지막 적용 취소", 8, Cc)]),
							D.value ? (X(), Z("p", wc, I(D.value), 1)) : $("", !0),
							O.value ? (X(), Z("div", Tc, [
								Q("strong", null, I(L(O.value.operation)), 1),
								Q("span", null, I(O.value.rationale), 1),
								O.value.adjusted ? (X(), Z("span", Ec, I(O.value.adjustmentReason), 1)) : $("", !0),
								O.value.gapToken ? (X(), Z("small", Dc, "간격: " + I(O.value.gapToken), 1)) : $("", !0),
								Q("div", Oc, [(X(!0), Z(Y, null, er(O.value.before, (e) => (X(), Z("div", { key: e.itemKey }, [
									Q("b", null, I(e.itemKey), 1),
									Q("span", null, "전 X " + I(Math.round(e.xPct)) + "% · Y " + I(Math.round(e.yPx)) + "px", 1),
									Q("span", null, "후 X " + I(Math.round(O.value.after.find((t) => t.itemKey === e.itemKey)?.xPct || 0)) + "% · Y " + I(Math.round(O.value.after.find((t) => t.itemKey === e.itemKey)?.yPx || 0)) + "px", 1)
								]))), 128))]),
								Q("div", kc, [Q("button", {
									type: "button",
									class: "section-ai-action",
									onClick: R
								}, "제안 적용"), Q("button", {
									type: "button",
									onClick: i[9] ||= (e) => O.value = null
								}, "취소")])
							])) : $("", !0)
						])) : $("", !0),
						Q("div", Ac, [(X(!0), Z(Y, null, er(N.value.items || [], (e) => (X(), Z("section", {
							key: e.itemKey,
							class: F(["component-property-accordion", { open: p.value === de(N.value, e) }])
						}, [Q("div", jc, [M.value ? (X(), Z("label", {
							key: 0,
							class: "component-multi-select",
							title: e.isLocked ? "잠긴 컴포넌트는 다중 정렬할 수 없습니다." : "다중 정렬 대상 선택"
						}, [Q("input", {
							type: "checkbox",
							checked: he(e),
							disabled: e.isLocked,
							"aria-label": `${e.name} 다중 정렬 대상 선택`,
							onChange: (t) => ge(N.value, e)
						}, null, 40, Nc)], 8, Mc)) : $("", !0), Q("button", {
							type: "button",
							class: "component-property-trigger",
							"aria-expanded": p.value === de(N.value, e),
							onClick: (t) => xe(N.value, e)
						}, [
							Q("span", null, I(e.name), 1),
							Q("small", null, I(e.fieldKind), 1),
							i[57] ||= Q("i", { "aria-hidden": "true" }, null, -1)
						], 8, Pc)]), Q("div", Fc, [Q("div", null, [P.value && P.value.itemKey === e.itemKey ? (X(), Z("div", Ic, [
							z(P.value).length > 1 ? (X(), Z("div", Lc, [(X(!0), Z(Y, null, er(z(P.value), (e) => (X(), Z("section", {
								key: e.fieldKey,
								class: "component-field-property"
							}, [Q("header", null, [Q("strong", null, I(e.name), 1), Q("small", null, I(e.fieldKind) + " · " + I(e.fieldKey), 1)]), e.fieldKind === "cta" ? (X(), Z(Y, { key: 0 }, [Q("label", null, [i[58] ||= Q("span", null, "버튼 텍스트", -1), Q("input", {
								disabled: P.value.isLocked || e.isLocked,
								value: we(P.value, e)?.label,
								onInput: (t) => Ee(P.value, e, "label", t.target.value)
							}, null, 40, Rc)]), Q("label", null, [i[59] ||= Q("span", null, "버튼 URL", -1), Q("input", {
								disabled: P.value.isLocked || e.isLocked,
								type: "url",
								value: we(P.value, e)?.link,
								onInput: (t) => Ee(P.value, e, "link", t.target.value)
							}, null, 40, zc)])], 64)) : e.fieldKind === "image" ? (X(), Z(Y, { key: 1 }, [
								M.value && Fe(N.value, P.value, e) ? (X(), Z("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: Le(N.value, P.value, e).disabled,
									onClick: (t) => Re(N.value, "generate", P.value.itemKey, "item", e.fieldKey)
								}, I(Le(N.value, P.value, e).label), 9, Bc)) : $("", !0),
								Q("label", null, [i[60] ||= Q("span", null, "이미지 입력 방식", -1), Q("select", {
									disabled: P.value.isLocked || e.isLocked,
									value: we(P.value, e)?.source,
									onChange: (t) => Ee(P.value, e, "source", t.target.value)
								}, [(X(!0), Z(Y, null, er(e.image?.allowedSources || ["url"], (e) => (X(), Z("option", {
									key: e,
									value: e
								}, I(e), 9, Hc))), 128))], 40, Vc)]),
								Q("label", null, [i[61] ||= Q("span", null, "URL 또는 이미지 설명", -1), Q("textarea", {
									disabled: P.value.isLocked || e.isLocked,
									rows: "4",
									value: we(P.value, e)?.value,
									onInput: (t) => Ee(P.value, e, "value", t.target.value)
								}, null, 40, Uc)]),
								e.image?.altTextRequired ? (X(), Z("label", Wc, [i[62] ||= Q("span", null, "대체 텍스트", -1), Q("input", {
									disabled: P.value.isLocked || e.isLocked,
									value: we(P.value, e)?.alt,
									onInput: (t) => Ee(P.value, e, "alt", t.target.value)
								}, null, 40, Gc)])) : $("", !0),
								!P.value.isLocked && !e.isLocked && we(P.value, e)?.value ? (X(), Z("button", {
									key: 2,
									type: "button",
									class: "image-remove-action",
									onClick: (t) => Be(e)
								}, "이미지 삭제", 8, Kc)) : $("", !0)
							], 64)) : (X(), Z("label", qc, [Q("span", null, I(e.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), Q("textarea", {
								disabled: P.value.isLocked || e.isLocked,
								rows: e.textType === "multi" ? 8 : 3,
								value: we(P.value, e),
								onInput: (t) => Te(P.value, e, t.target.value),
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 40, Jc)]))]))), 128))])) : $("", !0),
							z(P.value).length <= 1 && P.value.fieldKind === "cta" ? (X(), Z("label", Yc, [i[63] ||= Q("span", null, "버튼 텍스트", -1), Q("input", {
								disabled: P.value.isLocked,
								value: se.value?.label,
								onInput: i[10] ||= (e) => Ce("label", e.target.value)
							}, null, 40, Xc)])) : $("", !0),
							z(P.value).length <= 1 && P.value.fieldKind === "cta" ? (X(), Z("label", Zc, [i[64] ||= Q("span", null, "버튼 URL", -1), Q("input", {
								disabled: P.value.isLocked,
								type: "url",
								value: se.value?.link,
								onInput: i[11] ||= (e) => Ce("link", e.target.value)
							}, null, 40, Qc)])) : z(P.value).length <= 1 && P.value.fieldKind === "image" ? (X(), Z(Y, { key: 3 }, [
								M.value && Fe(N.value, P.value) ? (X(), Z("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: Le(N.value, P.value).disabled,
									title: Le(N.value, P.value).disabled && !B(N.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
									onClick: i[12] ||= (e) => Re(N.value, Le(N.value, P.value).action, P.value.itemKey)
								}, I(Le(N.value, P.value).label), 9, $c)) : $("", !0),
								Q("label", null, [i[65] ||= Q("span", null, "이미지 입력 방식", -1), Q("select", {
									disabled: P.value.isLocked,
									value: se.value?.source,
									onChange: i[13] ||= (e) => Ce("source", e.target.value)
								}, [(X(!0), Z(Y, null, er(P.value.image?.allowedSources || ["url"], (e) => (X(), Z("option", {
									key: e,
									value: e
								}, I(e), 9, tl))), 128))], 40, el)]),
								Q("label", null, [i[66] ||= Q("span", null, "URL 또는 이미지 설명", -1), Q("textarea", {
									disabled: P.value.isLocked,
									rows: "4",
									value: se.value?.value,
									onInput: i[14] ||= (e) => Ce("value", e.target.value)
								}, null, 40, nl)]),
								P.value.image?.descriptionEnabled ? (X(), Z("label", rl, [i[67] ||= Q("span", null, "설명", -1), Q("textarea", {
									disabled: P.value.isLocked,
									rows: "3",
									value: se.value?.description,
									onInput: i[15] ||= (e) => Ce("description", e.target.value)
								}, null, 40, il)])) : $("", !0),
								P.value.image?.altTextRequired ? (X(), Z("label", al, [i[68] ||= Q("span", null, "대체 텍스트", -1), Q("input", {
									disabled: P.value.isLocked,
									value: se.value?.alt,
									onInput: i[16] ||= (e) => Ce("alt", e.target.value)
								}, null, 40, ol)])) : $("", !0),
								!P.value.isLocked && se.value?.value ? (X(), Z("button", {
									key: 3,
									type: "button",
									class: "image-remove-action",
									onClick: Be
								}, "이미지 삭제")) : $("", !0)
							], 64)) : z(P.value).length <= 1 ? (X(), Z("label", sl, [Q("span", null, I(P.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), gn(Q("textarea", {
								"onUpdate:modelValue": i[17] ||= (e) => se.value = e,
								disabled: P.value.isLocked,
								rows: P.value.textType === "multi" ? 8 : 3,
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 8, cl), [[Qa, se.value]])])) : $("", !0),
							Q("dl", ll, [
								Q("div", null, [i[69] ||= Q("dt", null, "Item key", -1), Q("dd", null, I(P.value.itemKey), 1)]),
								Q("div", null, [i[70] ||= Q("dt", null, "필수", -1), Q("dd", null, I(P.value.isRequired ? "Y" : "N"), 1)]),
								Q("div", null, [i[71] ||= Q("dt", null, "고정", -1), Q("dd", null, I(P.value.isLocked ? "Y" : "N"), 1)])
							]),
							Q("section", ul, [
								Q("div", dl, [i[72] ||= Q("strong", null, "DESIGN", -1), Q("button", {
									type: "button",
									disabled: P.value.isLocked,
									onClick: We
								}, "초기화", 8, fl)]),
								P.value.fieldKind === "image" ? (X(), Z("div", pl, [
									Q("div", ml, [
										i[73] ||= Q("span", null, "크기 조절 방식", -1),
										Q("div", hl, [Q("button", {
											type: "button",
											class: F({ active: H.value.aspectRatioLocked !== !1 }),
											disabled: P.value.isLocked,
											onClick: i[18] ||= (e) => Xe("locked")
										}, "비율 유지", 10, gl), Q("button", {
											type: "button",
											class: F({ active: H.value.aspectRatioLocked === !1 }),
											disabled: P.value.isLocked || H.value.shape === "circle",
											onClick: i[19] ||= (e) => Xe("free")
										}, "자유 조절", 10, _l)]),
										H.value.shape === "circle" ? (X(), Z("small", vl, "원형 이미지는 1:1 비율로 고정됩니다.")) : $("", !0)
									]),
									Q("label", null, [i[74] ||= Q("span", null, "이미지 너비", -1), Q("div", yl, [Q("input", {
										type: "range",
										min: "10",
										max: "100",
										step: "1",
										disabled: P.value.isLocked,
										value: H.value.widthPct || 32,
										onInput: i[20] ||= (e) => W({ widthPct: Number(e.target.value) })
									}, null, 40, bl), Q("input", {
										class: "dimension-input",
										type: "number",
										min: "10",
										max: "100",
										step: "1",
										disabled: P.value.isLocked,
										value: Math.round(H.value.widthPct || 32),
										"aria-label": "이미지 너비 퍼센트",
										onChange: i[21] ||= (e) => W({ widthPct: Math.min(100, Math.max(10, Number(e.target.value) || 32)) })
									}, null, 40, xl)])]),
									H.value.shape !== "circle" && H.value.aspectRatioLocked === !1 ? (X(), Z("label", Sl, [i[75] ||= Q("span", null, "이미지 높이", -1), Q("div", Cl, [Q("input", {
										type: "range",
										min: "80",
										max: "900",
										step: "10",
										disabled: P.value.isLocked,
										value: H.value.heightPx || 240,
										onInput: i[22] ||= (e) => W({ heightPx: Number(e.target.value) })
									}, null, 40, wl), Q("input", {
										class: "dimension-input",
										type: "number",
										min: "80",
										max: "900",
										step: "10",
										disabled: P.value.isLocked,
										value: Math.round(H.value.heightPx || 240),
										"aria-label": "이미지 높이 픽셀",
										onChange: i[23] ||= (e) => W({ heightPx: Math.min(900, Math.max(80, Number(e.target.value) || 240)) })
									}, null, 40, Tl)])])) : $("", !0),
									Q("label", null, [i[77] ||= Q("span", null, "이미지 맞춤", -1), Q("select", {
										disabled: P.value.isLocked,
										value: H.value.imageFit || "contain",
										onChange: i[24] ||= (e) => W({ imageFit: e.target.value })
									}, [...i[76] ||= [Q("option", { value: "contain" }, "전체 표시", -1), Q("option", { value: "cover" }, "영역 채우기", -1)]], 40, El)]),
									Q("label", null, [i[79] ||= Q("span", null, "이미지 초점", -1), Q("select", {
										disabled: P.value.isLocked,
										value: H.value.imagePosition || "center center",
										onChange: i[25] ||= (e) => W({ imagePosition: e.target.value })
									}, [...i[78] ||= [Ni("<option value=\"left top\">왼쪽 위</option><option value=\"center top\">중앙 위</option><option value=\"right top\">오른쪽 위</option><option value=\"left center\">왼쪽 중앙</option><option value=\"center center\">중앙</option><option value=\"right center\">오른쪽 중앙</option><option value=\"left bottom\">왼쪽 아래</option><option value=\"center bottom\">중앙 아래</option><option value=\"right bottom\">오른쪽 아래</option>", 9)]], 40, Dl)]),
									Q("label", null, [i[81] ||= Q("span", null, "이미지 형태", -1), Q("select", {
										disabled: P.value.isLocked,
										value: H.value.shape || "square",
										onChange: i[26] ||= (e) => Ye(e.target.value)
									}, [...i[80] ||= [
										Q("option", { value: "square" }, "사각형", -1),
										Q("option", { value: "rounded" }, "둥근 사각형", -1),
										Q("option", { value: "circle" }, "원형", -1)
									]], 40, Ol)]),
									Q("label", kl, [Q("input", {
										type: "checkbox",
										disabled: P.value.isLocked,
										checked: H.value.decorative === !0,
										onChange: i[27] ||= (e) => W({ decorative: e.target.checked })
									}, null, 40, Al), i[82] ||= Q("span", null, "장식 이미지", -1)]),
									H.value.decorative === !0 ? $("", !0) : (X(), Z("label", jl, [i[83] ||= Q("span", null, "이미지 설명", -1), Q("input", {
										type: "text",
										maxlength: "240",
										disabled: P.value.isLocked,
										value: H.value.accessibleLabel || se.value?.alt || P.value.name,
										onInput: i[28] ||= (e) => W({ accessibleLabel: e.target.value })
									}, null, 40, Ml)]))
								])) : (X(), Z("div", Nl, [
									i[86] ||= Q("strong", null, "컴포넌트 영역 크기", -1),
									i[87] ||= Q("small", null, "프리뷰의 모서리와 변을 드래그하면 영역과 글자 크기가 함께 변경됩니다.", -1),
									Q("label", null, [i[84] ||= Q("span", null, "컴포넌트 너비", -1), Q("div", Pl, [Q("input", {
										type: "range",
										min: "10",
										max: "100",
										step: "1",
										disabled: P.value.isLocked,
										value: H.value.widthPct || 32,
										onInput: i[29] ||= (e) => W({ widthPct: Number(e.target.value) })
									}, null, 40, Fl), Q("input", {
										class: "dimension-input",
										type: "number",
										min: "10",
										max: "100",
										step: "1",
										disabled: P.value.isLocked,
										value: Math.round(H.value.widthPct || 32),
										"aria-label": "컴포넌트 너비 퍼센트",
										onChange: i[30] ||= (e) => W({ widthPct: Math.min(100, Math.max(10, Number(e.target.value) || 32)) })
									}, null, 40, Il)])]),
									Q("label", null, [i[85] ||= Q("span", null, "컴포넌트 높이", -1), Q("div", Ll, [Q("input", {
										type: "range",
										min: "80",
										max: "900",
										step: "10",
										disabled: P.value.isLocked,
										value: H.value.heightPx || 120,
										onInput: i[31] ||= (e) => W({ heightPx: Number(e.target.value) })
									}, null, 40, Rl), Q("input", {
										class: "dimension-input",
										type: "number",
										min: "80",
										max: "900",
										step: "10",
										disabled: P.value.isLocked,
										value: Math.round(H.value.heightPx || 120),
										"aria-label": "컴포넌트 높이 픽셀",
										onChange: i[32] ||= (e) => W({ heightPx: Math.min(900, Math.max(80, Number(e.target.value) || 120)) })
									}, null, 40, zl)])])
								])),
								P.value.fieldKind === "image" ? $("", !0) : (X(), Z(Y, { key: 2 }, [
									Q("label", null, [i[88] ||= Q("span", null, "글자 색상", -1), Q("input", {
										type: "color",
										disabled: P.value.isLocked,
										value: H.value.color || "#172033",
										onInput: i[33] ||= (e) => W({ color: e.target.value })
									}, null, 40, Bl)]),
									Q("label", null, [i[89] ||= Q("span", null, "폰트 크기", -1), Q("div", Vl, [Q("input", {
										type: "range",
										min: "0",
										max: "80",
										step: "1",
										disabled: P.value.isLocked,
										value: H.value.fontSize ?? 18,
										onInput: i[34] ||= (e) => W({ fontSize: Number(e.target.value) })
									}, null, 40, Hl), Q("output", null, I(H.value.fontSize ?? 18) + "px", 1)])]),
									Q("label", null, [i[91] ||= Q("span", null, "폰트 굵기", -1), Q("select", {
										disabled: P.value.isLocked,
										value: H.value.fontWeight || 400,
										onChange: i[35] ||= (e) => W({ fontWeight: Number(e.target.value) })
									}, [...i[90] ||= [
										Q("option", { value: 400 }, "Regular", -1),
										Q("option", { value: 500 }, "Medium", -1),
										Q("option", { value: 700 }, "Bold", -1),
										Q("option", { value: 800 }, "Extra Bold", -1)
									]], 40, Ul)])
								], 64)),
								Q("div", Wl, [i[92] ||= Q("span", null, "위치", -1), H.value.positionMode === "free" ? (X(), Z("strong", Gl, " X " + I(Math.round(H.value.xPct || 0)) + "% · Y " + I(Math.round(H.value.yPx || 0)) + "px ", 1)) : (X(), Z("strong", Kl, "자동 배치"))]),
								H.value.positionMode === "free" ? (X(), Z("button", {
									key: 3,
									class: "secondary-control",
									type: "button",
									disabled: P.value.isLocked,
									onClick: Ge
								}, " 자동 배치로 복원 ", 8, ql)) : $("", !0)
							])
						])) : $("", !0)])])], 2))), 128)), N.value.items?.length ? $("", !0) : (X(), Z("span", Jl, "등록된 컴포넌트 없음"))])
					])) : $("", !0)])
				], 2)) : $("", !0)
			], 2)], 2),
			j.value ? $("", !0) : (X(), Z("button", Yl))
		], 10, gs));
	}
}, Zl = document.querySelector("#visual-editor-app");
Zl && lo(Xl, { mode: new URLSearchParams(window.location.search).get("mode") || Zl.dataset.mode || "editor" }).mount(Zl);
//#endregion
