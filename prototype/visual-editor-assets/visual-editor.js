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
}, E = /-\w/g, D = ee((e) => e.replace(E, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, O = ee((e) => e.replace(te, "-$1").toLowerCase()), ne = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), k = ee((e) => e ? `on${ne(e)}` : ""), A = (e, t) => !Object.is(e, t), j = (e, ...t) => {
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
			let r = e[n], i = g(r) ? ue(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var se = /;(?![^(]*\))/g, ce = /:([^]+)/, le = /\/\*[^]*?\*\//g;
function ue(e) {
	let t = {};
	return e.replace(le, "").split(se).forEach((e) => {
		if (e) {
			let n = e.split(ce);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function N(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = N(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var de = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", fe = /* @__PURE__ */ e(de);
de + "";
function pe(e) {
	return !!e || e === "";
}
function me(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = P(e[r], t[r]);
	return n;
}
function P(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? me(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !P(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function he(e, t) {
	return e.findIndex((e) => P(e, t));
}
var ge = (e) => !!(e && e.__v_isRef === !0), F = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? ge(e) ? F(e.value) : JSON.stringify(e, _e, 2) : String(e), _e = (e, t) => ge(t) ? _e(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ve(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ve(e)) } : _(t) ? ve(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ve = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, I, ye = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && I && (I.active ? (this.parent = I, this.index = (I.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = I;
			try {
				return I = this, e();
			} finally {
				I = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = I, I = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (I === this) I = this.prevScope;
			else {
				let e = I;
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
function be() {
	return I;
}
var L, xe = /* @__PURE__ */ new WeakSet(), Se = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, I && (I.active ? I.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, xe.has(this) && (xe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || B(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ie(this), Ee(this);
		let e = L, t = Me;
		L = this, Me = !0;
		try {
			return this.fn();
		} finally {
			De(this), L = e, Me = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ae(e);
			this.deps = this.depsTail = void 0, Ie(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? xe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Oe(this) && this.run();
	}
	get dirty() {
		return Oe(this);
	}
}, Ce = 0, R, z;
function B(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = z, z = e;
		return;
	}
	e.next = R, R = e;
}
function we() {
	Ce++;
}
function Te() {
	if (--Ce > 0) return;
	if (z) {
		let e = z;
		for (z = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; R;) {
		let t = R;
		for (R = void 0; t;) {
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
function Ee(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function De(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ae(r), je(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Oe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ke(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ke(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Le) || (e.globalVersion = Le, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Oe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = Me;
	L = e, Me = !0;
	try {
		Ee(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, Me = r, De(e), e.flags &= -3;
	}
}
function Ae(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ae(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function je(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Me = !0, Ne = [];
function Pe() {
	Ne.push(Me), Me = !1;
}
function Fe() {
	let e = Ne.pop();
	Me = e === void 0 || e;
}
function Ie(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = L;
		L = void 0;
		try {
			t();
		} finally {
			L = e;
		}
	}
}
var Le = 0, Re = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, ze = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!L || !Me || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new Re(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, Be(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Le++, this.notify(e);
	}
	notify(e) {
		we();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Te();
		}
	}
};
function Be(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Be(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ve = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ Symbol(""), Ue = /* @__PURE__ */ Symbol(""), We = /* @__PURE__ */ Symbol("");
function V(e, t, n) {
	if (Me && L) {
		let t = Ve.get(e);
		t || Ve.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new ze()), r.map = t, r.key = n), r.track();
	}
}
function Ge(e, t, n, r, i, a) {
	let o = Ve.get(e);
	if (!o) {
		Le++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (we(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === We || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(We)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(He)), f(e) && s(o.get(Ue)));
				break;
			case "delete":
				i || (s(o.get(He)), f(e) && s(o.get(Ue)));
				break;
			case "set":
				f(e) && s(o.get(He));
				break;
		}
	}
	Te();
}
function Ke(e) {
	let t = /* @__PURE__ */ H(e);
	return t === e ? t : (V(t, "iterate", We), /* @__PURE__ */ jt(e) ? t : t.map(Pt));
}
function qe(e) {
	return V(e = /* @__PURE__ */ H(e), "iterate", We), e;
}
function Je(e, t) {
	return /* @__PURE__ */ At(e) ? Ft(/* @__PURE__ */ kt(e) ? Pt(t) : t) : Pt(t);
}
var Ye = {
	__proto__: null,
	[Symbol.iterator]() {
		return Xe(this, Symbol.iterator, (e) => Je(this, e));
	},
	concat(...e) {
		return Ke(this).concat(...e.map((e) => d(e) ? Ke(e) : e));
	},
	entries() {
		return Xe(this, "entries", (e) => (e[1] = Je(this, e[1]), e));
	},
	every(e, t) {
		return Qe(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Qe(this, "filter", e, t, (e) => e.map((e) => Je(this, e)), arguments);
	},
	find(e, t) {
		return Qe(this, "find", e, t, (e) => Je(this, e), arguments);
	},
	findIndex(e, t) {
		return Qe(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Qe(this, "findLast", e, t, (e) => Je(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Qe(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Qe(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return et(this, "includes", e);
	},
	indexOf(...e) {
		return et(this, "indexOf", e);
	},
	join(e) {
		return Ke(this).join(e);
	},
	lastIndexOf(...e) {
		return et(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Qe(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return tt(this, "pop");
	},
	push(...e) {
		return tt(this, "push", e);
	},
	reduce(e, ...t) {
		return $e(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return $e(this, "reduceRight", e, t);
	},
	shift() {
		return tt(this, "shift");
	},
	some(e, t) {
		return Qe(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return tt(this, "splice", e);
	},
	toReversed() {
		return Ke(this).toReversed();
	},
	toSorted(e) {
		return Ke(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ke(this).toSpliced(...e);
	},
	unshift(...e) {
		return tt(this, "unshift", e);
	},
	values() {
		return Xe(this, "values", (e) => Je(this, e));
	}
};
function Xe(e, t, n) {
	let r = qe(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ jt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Ze = Array.prototype;
function Qe(e, t, n, r, i, a) {
	let o = qe(e), s = o !== e && !/* @__PURE__ */ jt(e), c = o[t];
	if (c !== Ze[t]) {
		let t = c.apply(e, a);
		return s ? Pt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Je(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function $e(e, t, n, r) {
	let i = qe(e), a = i !== e && !/* @__PURE__ */ jt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Je(e, t)), n.call(this, t, Je(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Je(e, c) : c;
}
function et(e, t, n) {
	let r = /* @__PURE__ */ H(e);
	V(r, "iterate", We);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Mt(n[0]) ? (n[0] = /* @__PURE__ */ H(n[0]), r[t](...n)) : i;
}
function tt(e, t, n = []) {
	Pe(), we();
	let r = (/* @__PURE__ */ H(e))[t].apply(e, n);
	return Te(), Fe(), r;
}
var nt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), rt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function it(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ H(this);
	return V(t, "has", e), t.hasOwnProperty(e);
}
var at = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ct : St : i ? xt : bt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Ye[t])) return e;
			if (t === "hasOwnProperty") return it;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ U(e) ? e : n);
		if ((_(t) ? rt.has(t) : nt(t)) || (r || V(e, "get", t), i)) return o;
		if (/* @__PURE__ */ U(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Dt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Dt(o) : /* @__PURE__ */ Tt(o) : o;
	}
}, ot = class extends at {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ At(i);
			if (!/* @__PURE__ */ jt(n) && !/* @__PURE__ */ At(n) && (i = /* @__PURE__ */ H(i), n = /* @__PURE__ */ H(n)), !a && /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ U(e) ? e : r);
		return e === /* @__PURE__ */ H(r) && s && (o ? A(n, i) && Ge(e, "set", t, n, i) : Ge(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ge(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !rt.has(t)) && V(e, "has", t), n;
	}
	ownKeys(e) {
		return V(e, "iterate", d(e) ? "length" : He), Reflect.ownKeys(e);
	}
}, st = class extends at {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ct = /* @__PURE__ */ new ot(), lt = /* @__PURE__ */ new st(), ut = /* @__PURE__ */ new ot(!0), dt = (e) => e, ft = (e) => Reflect.getPrototypeOf(e);
function pt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ H(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? dt : t ? Ft : Pt;
		return !t && V(a, "iterate", l ? Ue : He), s(Object.create(u), { next() {
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
function mt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function ht(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ H(r), a = /* @__PURE__ */ H(n);
			e || (A(n, a) && V(i, "get", n), V(i, "get", a));
			let { has: o } = ft(i), s = t ? dt : e ? Ft : Pt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && V(/* @__PURE__ */ H(t), "iterate", He), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ H(n), i = /* @__PURE__ */ H(t);
			return e || (A(t, i) && V(r, "has", t), V(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ H(a), s = t ? dt : e ? Ft : Pt;
			return !e && V(o, "iterate", He), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: mt("add"),
		set: mt("set"),
		delete: mt("delete"),
		clear: mt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ H(this), r = ft(n), i = /* @__PURE__ */ H(e), a = !t && !/* @__PURE__ */ jt(e) && !/* @__PURE__ */ At(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Ge(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ jt(n) && !/* @__PURE__ */ At(n) && (n = /* @__PURE__ */ H(n));
			let r = /* @__PURE__ */ H(this), { has: i, get: a } = ft(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ H(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Ge(r, "set", e, n, s) : Ge(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ H(this), { has: n, get: r } = ft(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ H(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ge(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ H(this), t = e.size !== 0, n = e.clear();
			return t && Ge(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = pt(r, e, t);
	}), n;
}
function gt(e, t) {
	let n = ht(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var _t = { get: /* @__PURE__ */ gt(!1, !1) }, vt = { get: /* @__PURE__ */ gt(!1, !0) }, yt = { get: /* @__PURE__ */ gt(!0, !1) }, bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap();
function wt(e) {
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
function Tt(e) {
	return /* @__PURE__ */ At(e) ? e : Ot(e, !1, ct, _t, bt);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return Ot(e, !1, ut, vt, xt);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
	return Ot(e, !0, lt, yt, St);
}
function Ot(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = wt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return /* @__PURE__ */ At(e) ? /* @__PURE__ */ kt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ H(t) : e;
}
function Nt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && M(e, "__v_skip", !0), e;
}
var Pt = (e) => v(e) ? /* @__PURE__ */ Tt(e) : e, Ft = (e) => v(e) ? /* @__PURE__ */ Dt(e) : e;
// @__NO_SIDE_EFFECTS__
function U(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function W(e) {
	return It(e, !1);
}
function It(e, t) {
	return /* @__PURE__ */ U(e) ? e : new Lt(e, t);
}
var Lt = class {
	constructor(e, t) {
		this.dep = new ze(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ H(e), this._value = t ? e : Pt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ jt(e) || /* @__PURE__ */ At(e);
		e = n ? e : /* @__PURE__ */ H(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Pt(e), this.dep.trigger());
	}
};
function Rt(e) {
	return /* @__PURE__ */ U(e) ? e.value : e;
}
var zt = {
	get: (e, t, n) => t === "__v_raw" ? e : Rt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Bt(e) {
	return /* @__PURE__ */ kt(e) ? e : new Proxy(e, zt);
}
var Vt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new ze(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Le - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return B(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ke(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Ht(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Vt(r, i, n);
}
var Ut = {}, Wt = /* @__PURE__ */ new WeakMap(), Gt = void 0;
function Kt(e, t = !1, n = Gt) {
	if (n) {
		let t = Wt.get(n);
		t || Wt.set(n, t = []), t.push(e);
	}
}
function qt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ jt(e) || o === !1 || o === 0 ? Jt(e, 1) : Jt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ U(e) ? (g = () => e.value, y = /* @__PURE__ */ jt(e)) : /* @__PURE__ */ kt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ kt(e) || /* @__PURE__ */ jt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ U(e)) return e.value;
		if (/* @__PURE__ */ kt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Pe();
			try {
				_();
			} finally {
				Fe();
			}
		}
		let t = Gt;
		Gt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Gt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Jt(e(), t);
	}
	let x = be(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Ut) : Ut, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => A(e, C[t])) : A(t, C))) {
				_ && _();
				let e = Gt;
				Gt = m;
				try {
					let e = [
						t,
						C === Ut ? void 0 : b && C[0] === Ut ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Gt = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new Se(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Kt(e, !1, m), _ = m.onStop = () => {
		let e = Wt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Wt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Jt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ U(e)) Jt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Jt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Jt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Jt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Jt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Yt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Zt(e, t, n);
	}
}
function Xt(e, t, n, r) {
	if (h(e)) {
		let i = Yt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Zt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Xt(e[a], t, n, r));
		return i;
	}
}
function Zt(e, n, r, i = !0) {
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
			Pe(), Yt(o, null, 10, [
				e,
				i,
				a
			]), Fe();
			return;
		}
	}
	Qt(e, r, a, i, s);
}
function Qt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var G = [], $t = -1, en = [], tn = null, nn = 0, rn = /* @__PURE__ */ Promise.resolve(), an = null;
function on(e) {
	let t = an || rn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function sn(e) {
	let t = $t + 1, n = G.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = G[r], a = pn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function cn(e) {
	if (!(e.flags & 1)) {
		let t = pn(e), n = G[G.length - 1];
		!n || !(e.flags & 2) && t >= pn(n) ? G.push(e) : G.splice(sn(t), 0, e), e.flags |= 1, ln();
	}
}
function ln() {
	an ||= rn.then(mn);
}
function un(e) {
	d(e) ? en.push(...e) : tn && e.id === -1 ? tn.splice(nn + 1, 0, e) : e.flags & 1 || (en.push(e), e.flags |= 1), ln();
}
function dn(e, t, n = $t + 1) {
	for (; n < G.length; n++) {
		let t = G[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			G.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function fn(e) {
	if (en.length) {
		let e = [...new Set(en)].sort((e, t) => pn(e) - pn(t));
		if (en.length = 0, tn) {
			tn.push(...e);
			return;
		}
		for (tn = e, nn = 0; nn < tn.length; nn++) {
			let e = tn[nn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		tn = null, nn = 0;
	}
}
var pn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function mn(e) {
	try {
		for ($t = 0; $t < G.length; $t++) {
			let e = G[$t];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Yt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; $t < G.length; $t++) {
			let e = G[$t];
			e && (e.flags &= -2);
		}
		$t = -1, G.length = 0, fn(e), an = null, (G.length || en.length) && mn(e);
	}
}
var hn = null, gn = null;
function _n(e) {
	let t = hn;
	return hn = e, gn = e && e.type.__scopeId || null, t;
}
function vn(e, t = hn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Si(-1);
		let i = _n(t), a;
		try {
			a = e(...n);
		} finally {
			_n(i), r._d && Si(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function yn(e, n) {
	if (hn === null) return e;
	let r = ia(hn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Jt(o), i.push({
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
function bn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Pe(), Xt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Fe());
	}
}
function xn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function Sn(e, t, n = !1) {
	let r = Ui();
	if (r || Er) {
		let i = Er ? Er._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Cn = /* @__PURE__ */ Symbol.for("v-scx"), wn = () => Sn(Cn);
function Tn(e, t, n) {
	return En(e, t, n);
}
function En(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Yi) {
		if (c === "sync") {
			let e = wn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => Xt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		q(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : cn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = qt(e, n, u);
	return Yi && (f ? f.push(h) : d && h()), h;
}
function Dn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? On(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Ki(this), s = En(i, a.bind(r), n);
	return o(), s;
}
function On(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var kn = /* @__PURE__ */ Symbol("_vte"), An = (e) => e.__isTeleport, jn = /* @__PURE__ */ Symbol("_leaveCb");
function Mn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Mn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Nn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Pn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Fn = /* @__PURE__ */ new WeakMap();
function In(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => In(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Rn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && In(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? ia(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ H(v), b = v === t ? i : (e) => !Pn(_, e) && u(y, e), x = (e, t) => !(t && Pn(_, t));
	if (m != null && m !== p) {
		if (Ln(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ U(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Pe();
		try {
			Yt(p, f, 12, [l, _]);
		} finally {
			Fe();
		}
	} else {
		let t = g(p), n = /* @__PURE__ */ U(p);
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
					i(), Fn.delete(e);
				};
				t.id = -1, Fn.set(e, t), q(t, r);
			} else Ln(e), i();
		}
	}
}
function Ln(e) {
	let t = Fn.get(e);
	t && (t.flags |= 8, Fn.delete(e));
}
ae().requestIdleCallback, ae().cancelIdleCallback;
var Rn = (e) => !!e.type.__asyncLoader, zn = (e) => e.type.__isKeepAlive;
function Bn(e, t) {
	Hn(e, "a", t);
}
function Vn(e, t) {
	Hn(e, "da", t);
}
function Hn(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Wn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) zn(e.parent.vnode) && Un(r, t, n, e), e = e.parent;
	}
}
function Un(e, t, n, r) {
	let i = Wn(t, e, r, !0);
	Zn(() => {
		c(r[t], i);
	}, n);
}
function Wn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Pe();
			let i = Ki(n), a = Xt(t, n, e, r);
			return i(), Fe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Gn = (e) => (t, n = $) => {
	(!Yi || e === "sp") && Wn(e, (...e) => t(...e), n);
}, Kn = Gn("bm"), qn = Gn("m"), Jn = Gn("bu"), Yn = Gn("u"), Xn = Gn("bum"), Zn = Gn("um"), Qn = Gn("sp"), $n = Gn("rtg"), er = Gn("rtc");
function tr(e, t = $) {
	Wn("ec", e, t);
}
var nr = /* @__PURE__ */ Symbol.for("v-ndc");
function rr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ kt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ jt(e), s = /* @__PURE__ */ At(e), e = qe(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ft(Pt(e[n])) : Pt(e[n]) : e[n], n, void 0, a && a[n]);
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
var ir = (e) => e ? Ji(e) ? ia(e) : ir(e.parent) : null, ar = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ir(e.parent),
	$root: (e) => ir(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => mr(e),
	$forceUpdate: (e) => e.f ||= () => {
		cn(e.update);
	},
	$nextTick: (e) => e.n ||= on.bind(e.proxy),
	$watch: (e) => Dn.bind(e)
}), or = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), sr = {
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
			else if (or(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else lr && (s[n] = 0);
		}
		let d = ar[n], f, p;
		if (d) return n === "$attrs" && V(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return or(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || or(n, c) || u(o, c) || u(i, c) || u(ar, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function cr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var lr = !0;
function ur(e) {
	let t = mr(e), n = e.proxy, i = e.ctx;
	lr = !1, t.beforeCreate && fr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: ee, renderTriggered: E, errorCaptured: D, serverPrefetch: te, expose: O, inheritAttrs: ne, components: k, directives: A, filters: j } = t;
	if (u && dr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Tt(t));
	}
	if (lr = !0, o) for (let e in o) {
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
	if (c) for (let e in c) pr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			xn(t, e[t]);
		});
	}
	f && fr(f, e, "c");
	function M(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(Kn, p), M(qn, m), M(Jn, g), M(Yn, _), M(Bn, y), M(Vn, b), M(tr, D), M(er, ee), M($n, E), M(Xn, S), M(Zn, w), M(Qn, te), d(O)) if (O.length) {
		let t = e.exposed ||= {};
		O.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), ne != null && (e.inheritAttrs = ne), k && (e.components = k), A && (e.directives = A), te && Nn(e);
}
function dr(e, t, n = r) {
	d(e) && (e = yr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? Sn(r.from || n, r.default, !0) : Sn(r.from || n) : Sn(r), /* @__PURE__ */ U(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function fr(e, t, n) {
	Xt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function pr(e, t, n, r) {
	let i = r.includes(".") ? On(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Tn(i, n);
	} else if (h(e)) Tn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => pr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && Tn(i, r, e);
	}
}
function mr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => hr(c, e, o, !0)), hr(c, t, o)), v(t) && a.set(t, c), c;
}
function hr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && hr(e, a, n, !0), i && i.forEach((t) => hr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = gr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var gr = {
	data: _r,
	props: xr,
	emits: xr,
	methods: br,
	computed: br,
	beforeCreate: K,
	created: K,
	beforeMount: K,
	mounted: K,
	beforeUpdate: K,
	updated: K,
	beforeDestroy: K,
	beforeUnmount: K,
	destroyed: K,
	unmounted: K,
	activated: K,
	deactivated: K,
	errorCaptured: K,
	serverPrefetch: K,
	components: br,
	directives: br,
	watch: Sr,
	provide: _r,
	inject: vr
};
function _r(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function vr(e, t) {
	return br(yr(e), yr(t));
}
function yr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function K(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function br(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function xr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), cr(e), cr(t ?? {})) : t;
}
function Sr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = K(e[r], t[r]);
	return n;
}
function Cr() {
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
var wr = 0;
function Tr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Cr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: wr++,
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
				c && (Xt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Er;
				Er = l;
				try {
					return e();
				} finally {
					Er = t;
				}
			}
		};
		return l;
	};
}
var Er = null, Dr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function Or(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Dr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(re)));
	let c, l = i[c = k(n)] || i[c = k(D(n))];
	!l && o && (l = i[c = k(O(n))]), l && Xt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Xt(u, e, 6, a);
	}
}
var kr = /* @__PURE__ */ new WeakMap();
function Ar(e, t, n = !1) {
	let r = n ? kr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Ar(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function jr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function Mr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = _n(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : Nr(c);
		}
	} catch (t) {
		vi.length = 0, Zt(t, e, 1), v = ki(gi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Pr(y, a)), b = Mi(b, y, !1, !0));
	}
	return n.dirs && (b = Mi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Mn(b, n.transition), v = b, _n(_), v;
}
var Nr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Pr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Fr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ir(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Lr(o, r, n) && !jr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Ir(r, o, l) : !!o;
	return !1;
}
function Ir(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Lr(t, e, a) && !jr(n, a)) return !0;
	}
	return !1;
}
function Lr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !P(r, i) : r !== i;
}
function Rr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var zr = {}, Br = () => Object.create(zr), Vr = (e) => Object.getPrototypeOf(e) === zr;
function Hr(e, t, n, r = !1) {
	let i = {}, a = Br();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Wr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Et(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Ur(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ H(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (jr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = D(o);
					i[t] = Gr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Wr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = O(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Gr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ge(e.attrs, "set", "");
}
function Wr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : jr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ H(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Gr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Gr(e, t, n, r, i, a) {
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
var Kr = /* @__PURE__ */ new WeakMap();
function qr(e, r, i = !1) {
	let a = i ? Kr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = qr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		Jr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (Jr(t)) {
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
function Jr(e) {
	return e[0] !== "$" && !T(e);
}
var Yr = (e) => e === "_" || e === "_ctx" || e === "$stable", Xr = (e) => d(e) ? e.map(Fi) : [Fi(e)], Zr = (e, t, n) => {
	if (t._n) return t;
	let r = vn((...e) => Xr(t(...e)), n);
	return r._c = !1, r;
}, Qr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Yr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Zr(n, i, r);
		else if (i != null) {
			let e = Xr(i);
			t[n] = () => e;
		}
	}
}, $r = (e, t) => {
	let n = Xr(t);
	e.slots.default = () => n;
}, ei = (e, t, n) => {
	for (let r in t) (n || !Yr(r)) && (e[r] = t[r]);
}, ti = (e, t, n) => {
	let r = e.slots = Br();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ei(r, t, n), n && M(r, "_", e, !0)) : Qr(t, r);
	} else t && $r(e, t);
}, ni = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ei(a, n, r) : (o = !n.$stable, Qr(n, a)), s = n;
	} else n && ($r(e, n), s = { default: 1 });
	if (o) for (let e in a) !Yr(e) && s[e] == null && delete a[e];
}, q = mi;
function ri(e) {
	return ii(e);
}
function ii(e, i) {
	let a = ae();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ei(e, t) && (r = P(e), N(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
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
				k(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? A(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, F);
		}
		u != null && i ? In(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && In(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, ai(e, a), s, u), _ && bn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && zi(f, r, e);
		}
		_ && bn(e, null, r, "beforeMount");
		let v = si(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && q(() => {
			try {
				f && zi(f, r, e), v && g.enter(d), _ && bn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || pi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ii(e[l]) : Fi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && oi(r, !1), (g = h.onVnodeBeforeUpdate) && zi(g, r, n, e), f && bn(n, e, r, "beforeUpdate"), r && oi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, ai(n, a), o) : s || se(e, n, l, null, r, i, ai(n, a), o, !1), u > 0) {
			if (u & 16) ne(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ne(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && q(() => {
			g && zi(g, r, n, e), f && bn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === J || !Ei(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ne = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, k = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ci(e, t, !0)) : se(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : re(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = Hi(e, r, i);
		if (zn(e) && (s.ctx.renderer = F), Xi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = ki(gi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (Fr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
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
							q(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				oi(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && j(n), (d = t.props && t.props.onVnodeBeforeUpdate) && zi(d, s, t, c), oi(e, !0);
				let f = Mr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), P(p), e, i, a), t.el = f.el, u === null && Rr(e, f.el), r && q(r, i), (d = t.props && t.props.onVnodeUpdated) && q(() => zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Rn(t);
				if (oi(e, !1), l && j(l), !m && (o = c && c.onVnodeBeforeMount) && zi(o, d, t), oi(e, !0), s && ve) {
					let t = () => {
						e.subTree = Mr(e), ve(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Mr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && q(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					q(() => zi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Rn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && q(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Se(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => cn(u), oi(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ur(e, t.props, r, n), ni(e, t.children, n), Pe(), dn(e), Fe();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, ce = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ii(t[p]) : Fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? me(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, le = (e, t, r, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) N(e[u], a, o, !0), u++;
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
					N(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ei(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? N(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? li(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || fi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(n, r, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ue(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, F);
			return;
		}
		if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === _i) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[jn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), q(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[jn];
				a._isLeaving && a[jn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, N = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Pe(), In(s, null, n, e, !0), Fe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Rn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && zi(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && bn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, F, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && me(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && q(() => {
			_ && zi(_, t, e), h && bn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === J) {
			fe(n, r);
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
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		di(c), di(l), r && j(r), i.stop(), a && (a.flags |= 8, N(o, e, t, n)), s && q(s, t), q(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) N(e[o], t, n, r, i);
	}, P = (e) => {
		if (e.shapeFlag & 6) return P(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[kn];
		return n ? h(n) : t;
	}, he = !1, ge = (e, t, n) => {
		let r;
		e == null ? t._vnode && (N(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, he ||= (he = !0, dn(r), fn(), !1);
	}, F = {
		p: v,
		um: N,
		m: ue,
		r: de,
		mt: M,
		mc: D,
		pc: se,
		pbc: O,
		n: P,
		o: e
	}, _e, ve;
	return i && ([_e, ve] = i(F)), {
		render: ge,
		hydrate: _e,
		createApp: Tr(ge, _e)
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : un(e);
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
var Di = ({ key: e }) => e ?? null, Oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ U(e) || h(e) ? {
	i: hn,
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
		scopeId: gn,
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
		ctx: hn
	};
	return s ? (Li(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), xi > 0 && !o && yi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && yi.push(c), c;
}
var ki = Ai;
function Ai(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === nr) && (e = gi), Ti(e)) {
		let r = Mi(e, t, !0);
		return n && Li(r, n), xi > 0 && !a && yi && (r.shapeFlag & 6 ? yi[yi.indexOf(e)] = r : yi.push(r)), r.patchFlag = -2, r;
	}
	if (aa(e) && (e = e.__vccOpts), t) {
		t = ji(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = N(e)), v(n) && (/* @__PURE__ */ Mt(n) && !d(n) && (n = s({}, n)), t.style = oe(n));
	}
	let o = g(e) ? 1 : pi(e) ? 128 : An(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function ji(e) {
	return e ? /* @__PURE__ */ Mt(e) || Vr(e) ? s({}, e) : e : null;
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
	return c && r && Mn(u, c.clone(u)), u;
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
		!r && !Vr(t) ? t._ctx = hn : r === 3 && hn && (hn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Li(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: hn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ni(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ri(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = N([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function zi(e, t, n, r = null) {
	Xt(e, t, 7, [n, r]);
}
var Bi = Cr(), Vi = 0;
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
		scope: new ye(!0),
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
		propsOptions: qr(i, a),
		emitsOptions: Ar(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Or.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Ui = () => $ || hn, Wi, Gi;
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
	Hr(e, r, a, t), ti(e, i, n || t);
	let o = a ? Zi(e, t) : void 0;
	return t && Gi(!1), o;
}
function Zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, sr);
	let { setup: r } = n;
	if (r) {
		Pe();
		let n = e.setupContext = r.length > 1 ? ra(e) : null, i = Ki(e), a = Yt(r, e, 0, [e.props, n]), o = y(a);
		if (Fe(), i(), (o || e.sp) && !Rn(e) && Nn(e), o) {
			if (a.then(qi, qi), t) return a.then((n) => {
				Qi(e, n, t);
			}).catch((t) => {
				Zt(t, e, 0);
			});
			e.asyncDep = a;
		} else Qi(e, a, t);
	} else ta(e, t);
}
function Qi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Bt(t)), ta(e, n);
}
var $i, ea;
function ta(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && $i && !i.render) {
			let t = i.template || mr(e).template;
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
		Pe();
		try {
			ur(e);
		} finally {
			Fe(), t();
		}
	}
}
var na = { get(e, t) {
	return V(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Bt(Nt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ar) return ar[n](e);
		},
		has(e, t) {
			return t in e || t in ar;
		}
	}) : e.proxy;
}
function aa(e) {
	return h(e) && "__vccOpts" in e;
}
var oa = (e, t) => /* @__PURE__ */ Ht(e, t, Yi), sa = "3.5.39", ca = void 0, la = typeof window < "u" && window.trustedTypes;
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
	let r = D(t);
	if (r !== "filter" && r in e) return Ea[t] = r;
	r = ne(r);
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
function Aa(e, t, n, r, i, a = fe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ka, t.slice(6, t.length)) : e.setAttributeNS(ka, t, n) : n == null || a && !pe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = pe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
				e && Xt(e, t, 5, a);
			}
		} else Xt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Va(), n;
}
var Ua = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Wa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? _a(e, r, c) : t === "style" ? Sa(e, n, r) : a(t) ? o(t) || Fa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Ga(e, t, r, c)) ? (ja(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Aa(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ka(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ja(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Aa(e, t, r, c));
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
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
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
				let e = he(t, n), a = e !== -1;
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
	if (d(t)) i = he(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = P(t, no(e, !0));
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
	return Object.fromEntries((e || []).map((e) => [e.sectionKey, Object.fromEntries((e.items || []).map((n) => [n.itemKey, t?.[e.sectionKey]?.[n.itemKey] ?? yo(n)]))]));
}
function xo({ template: e, configRevision: t, sections: n, sectionInputs: r, designSpec: i = go }) {
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
var So = /* @__PURE__ */ new Set(["http:", "https:"]);
function Co(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return So.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
function wo(e = {}) {
	let t = { ...e };
	return delete t.positionMode, delete t.xPct, delete t.yPx, delete t.yPct, t;
}
function To(e, t, n) {
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
var Eo = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, Do = ["data-section-key"], Oo = { class: "rendered-section__inner" }, ko = [
	"data-item-key",
	"data-style-key",
	"onClick",
	"onPointerdown",
	"onDblclick"
], Ao = [
	"href",
	"target",
	"rel"
], jo = [
	"role",
	"aria-label",
	"aria-hidden"
], Mo = {
	key: 0,
	class: "rendered-image__placeholder"
}, No = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Po = {
	key: 0,
	class: "rendered-text"
}, Fo = {
	key: 1,
	class: "rendered-empty"
}, Io = [
	"aria-label",
	"title",
	"onPointerdown"
], Lo = {
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
		function a(e, t) {
			return n.content?.sectionInputs?.[e.sectionKey]?.[t.itemKey];
		}
		function o(e) {
			let t = String(e?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(t) ? t : "";
		}
		function s(e, t) {
			return e?.aiDesign?.imageTarget === "item" && Array.isArray(e.aiDesign.imageTargetItemKeys) && e.aiDesign.imageTargetItemKeys.includes(t?.itemKey);
		}
		function c(e, t, n) {
			if (s(e, t)) return !1;
			let r = String(n?.value || "").trim();
			return n?.source === "ai" || r.startsWith("/api/promo-section-design-image?");
		}
		function l(e) {
			return (e.items || []).filter((t) => t.fieldKind !== "image" || !c(e, t, a(e, t)));
		}
		function u(e) {
			let t = String(h(e).backgroundImage || "").trim(), n = (e.items || []).filter((e) => e.fieldKind === "image").map((t) => ({
				item: t,
				value: a(e, t)
			})).find(({ item: t, value: n }) => c(e, t, n)), r = t || String(n?.value?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(r) ? r : "";
		}
		function d(e) {
			return Co(e?.link);
		}
		function f(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function p(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function m(e, t) {
			return n.designSpec?.itemStyles?.[p(e, t)] || {};
		}
		function h(e) {
			return n.designSpec?.sectionStyles?.[e.sectionKey] || {};
		}
		function g(e, t, n, r) {
			let i = Number(e);
			return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
		}
		function _(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function v(e, t) {
			return t.shape === "circle" ? "1 / 1" : _(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function y(e, t) {
			let n = m(e, t), r = o(a(e, t)), i = [
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
		function b(e, t) {
			let n = m(e, t), r = a(e, t);
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
		function x(e) {
			return e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
		}
		function S(e) {
			return Math.max(180, (e.items || []).reduce((e, t) => e + x(t), 0) + 52);
		}
		function C(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((e, t) => e + x(t), 0), a = h(e).minHeight || S(e), o = Math.max(50, a - 76);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function w(e) {
			return [
				"none",
				"left",
				"right",
				"both"
			].includes(e.backgroundFadeMode) ? e.backgroundFadeMode : e.backgroundFadeSafeArea === "left-copy" ? "left" : e.backgroundFadeSafeArea === "right-copy" ? "right" : e.backgroundFadeSafeArea === "center-copy" ? "both" : "none";
		}
		function T(e) {
			let t = String(e.backgroundColor || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(t)) return t;
			let r = String(e.backgroundFadeColor || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(r)) return r;
			let i = String(n.designSpec?.theme?.backgroundColor || "").trim();
			return /^#[0-9a-f]{6}$/i.test(i) ? i : "#f5f7fb";
		}
		function ee(e, t, n = "medium") {
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
		function E(e) {
			let t = h(e), n = t.minHeight || S(e), r = u(e), i = T(t), a = r ? ee(w(t), i, t.backgroundFadeStrength) : "";
			return {
				height: `${Math.max(50, n)}px`,
				backgroundColor: i,
				backgroundImage: r ? [a, `url(${JSON.stringify(r)})`].filter(Boolean).join(", ") : void 0,
				backgroundSize: r ? a ? `100% 100%, ${t.backgroundSize || "contain"}` : t.backgroundSize || "contain" : void 0,
				backgroundPosition: r ? a ? `center, ${t.backgroundPosition || "center center"}` : t.backgroundPosition || "center center" : void 0,
				backgroundRepeat: r ? a ? `no-repeat, ${t.backgroundRepeat || "no-repeat"}` : t.backgroundRepeat || "no-repeat" : void 0
			};
		}
		function D(e) {
			let t = h(e).minHeight || S(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function te(e, t) {
			let n = m(e, t), r = n.positionMode === "free" ? n : C(e, t), i = t.fieldKind === "image", a = g(n.widthPct, 10, 100, 32), o = g(n.heightPx, 80, 900, void 0);
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
				aspectRatio: i && (!o || n.shape === "circle") ? v(t, n) : void 0
			};
		}
		function O(e, t) {
			n.editable && r("select-item", e, t);
		}
		function ne(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.target.closest(".image-resize-handle") || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), O(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
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
		function k(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || i.fieldKind !== "image" || e.button !== 0) return;
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c) return;
			e.preventDefault(), e.stopPropagation(), O(t, i), o.setPointerCapture(e.pointerId), s.classList.add("is-resizing");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = u.width, h = u.height, g = u.left - l.left, _ = u.top - l.top, v = h ? p / h : 1, y = m(t, i), b = y.aspectRatioLocked !== !1, x = p, S = h, C = g, w = _, T = 0, ee = (e) => {
				let t = a.includes("w") ? -1 : 1, n = a.includes("n") ? -1 : 1, r = (e.clientX - d) * t, i = (e.clientY - f) * n, o = Math.max(80, a.includes("w") ? p + g : l.width - g), c = Math.max(80, a.includes("n") ? h + _ : l.height - _), u = Math.min(o, Math.max(80, p + r)), m = Math.min(c, Math.max(80, h + i));
				if (b || y.shape === "circle") {
					let e = y.shape === "circle" ? 1 : v;
					Math.abs(i) > Math.abs(r) ? (S = m, x = Math.min(o, Math.max(80, S * e)), S = x / e) : (x = u, S = Math.min(c, Math.max(80, x / e)), x = S * e);
				} else x = u, S = m;
				C = a.includes("w") ? g + p - x : g, w = a.includes("n") ? _ + h - S : _, !T && (T = requestAnimationFrame(() => {
					T = 0, s.style.left = `${C}px`, s.style.top = `${w}px`, s.style.width = `${x}px`, s.style.height = `${S}px`, s.style.aspectRatio = "auto";
				}));
			}, E = () => {
				T && cancelAnimationFrame(T), r("update-renderer-item-style", t, i, {
					positionMode: "free",
					xPct: l.width ? C / l.width * 100 : 0,
					yPx: w,
					widthPct: l.width ? x / l.width * 100 : 32,
					heightPx: b || y.shape === "circle" ? void 0 : S,
					aspectRatio: `${Math.max(1, Math.round(x))}/${Math.max(1, Math.round(S))}`
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", ee), o.removeEventListener("pointerup", E), o.removeEventListener("pointercancel", E);
			};
			o.addEventListener("pointermove", ee), o.addEventListener("pointerup", E), o.addEventListener("pointercancel", E);
		}
		function A(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "image" || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let a = m(t, i), o = a.aspectRatioLocked !== !1, s = e.shiftKey ? 4 : 1, c = ["ArrowRight", "ArrowDown"].includes(e.key) ? 1 : -1, l = g((a.widthPct ?? 32) + c * s, 10, 100, 32), u = g(a.heightPx, 80, 900, 240);
			r("update-renderer-item-style", t, i, {
				widthPct: l,
				heightPx: o || a.shape === "circle" ? void 0 : g(u + c * s * 4, 80, 900, 240)
			});
		}
		function j(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "text") return;
			e.preventDefault(), e.stopPropagation(), O(t, i);
			let o = e.currentTarget, s = o.querySelector(".rendered-text, .rendered-empty");
			if (!s) return;
			o.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", String(a(t, i) || "").trim() || (s.textContent = _o), s.focus();
			let c = window.getSelection(), l = document.createRange();
			l.selectNodeContents(s), c.removeAllRanges(), c.addRange(l);
			let u = () => {
				let e = s.innerText.replace(/\r\n?/g, "\n").trim() || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
				r("update-item-content", t, i, e), s.contentEditable = "false", o.classList.remove("is-editing"), s.removeEventListener("blur", u), s.removeEventListener("keydown", d);
			}, d = (e) => {
				e.key === "Escape" && (e.preventDefault(), s.blur());
			};
			s.addEventListener("blur", u), s.addEventListener("keydown", d);
		}
		function M(e, t) {
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
			class: N(["promo-renderer", {
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
		}, [e.editable && e.showGuides ? (Y(), X("div", Eo)) : Q("", !0), (Y(!0), X(J, null, rr(i.value, (t) => (Y(), X("section", {
			key: t.sectionKey,
			class: N(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: oe(E(t))
		}, [Z("div", Oo, [Z("div", {
			class: "rendered-items",
			style: oe(D(t))
		}, [(Y(!0), X(J, null, rr(l(t), (n) => (Y(), X("article", {
			key: n.itemKey,
			class: N(["rendered-item", [`rendered-item--${n.fieldKind || "text"}`, {
				"is-editable": e.editable && !n.isLocked,
				"is-selected": e.editable && e.selectedItemKey === p(t, n),
				"is-free-positioned": !0
			}]]),
			"data-item-key": n.itemKey,
			"data-style-key": p(t, n),
			style: oe(te(t, n)),
			onClick: ao((e) => O(t, n), ["stop"]),
			onPointerdown: (e) => ne(e, t, n),
			onDblclick: (e) => j(e, t, n)
		}, [n.fieldKind === "cta" ? (Y(), X("a", {
			key: 0,
			class: "rendered-cta",
			href: d(a(t, n)),
			target: a(t, n)?.target || "_self",
			rel: a(t, n)?.target === "_blank" ? "noopener noreferrer" : void 0
		}, F(a(t, n)?.label || n.name), 9, Ao)) : n.fieldKind === "image" ? (Y(), X(J, { key: 1 }, [Z("div", {
			class: N(["rendered-image-frame", `rendered-image-frame--${m(t, n).shape || "square"}`]),
			style: oe(y(t, n)),
			role: b(t, n).role,
			"aria-label": b(t, n).label,
			"aria-hidden": b(t, n).ariaHidden
		}, [o(a(t, n)) ? Q("", !0) : (Y(), X("div", Mo, [Z("span", null, F(n.name), 1), Z("small", null, F(a(t, n)?.value || "이미지 준비 중"), 1)]))], 14, jo), e.editable && e.showGuides && !n.isLocked && e.selectedItemKey === p(t, n) ? (Y(), X(J, { key: 0 }, rr([
			"nw",
			"ne",
			"se",
			"sw"
		], (e) => Z("button", {
			key: e,
			type: "button",
			class: N(["image-resize-handle", `image-resize-handle--${e}`]),
			"aria-label": `${n.name} 이미지 크기 조절`,
			onPointerdown: ao((r) => k(r, t, n, e), ["stop"]),
			onKeydown: (e) => A(e, t, n)
		}, null, 42, No)), 64)) : Q("", !0)], 64)) : (Y(), X(J, { key: 2 }, [f(a(t, n)) ? (Y(), X("p", Po, F(a(t, n)), 1)) : (Y(), X("p", Fo, F(n.name), 1))], 64))], 46, ko))), 128))], 4)]), e.editable && e.showGuides ? (Y(), X("button", {
			key: 0,
			class: "section-resize-handle",
			type: "button",
			"aria-label": `${t.name} 섹션 높이 조절`,
			title: `${t.name} 섹션 높이 조절`,
			onPointerdown: (e) => M(e, t)
		}, null, 40, Io)) : Q("", !0)], 14, Do))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/layout-utils.mjs
function Ro(e) {
	return JSON.parse(JSON.stringify(e));
}
function zo(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = zo(n[e], t) : n[e] = Ro(t));
	}), n;
}
function Bo(e = {}) {
	return Vo(go, e);
}
function Vo(e = go, t = {}) {
	let n = zo(Ro(e || go), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, n.sectionStyles = n.sectionStyles || {}, n;
}
function Ho(e = {}) {
	let t = Bo(e), n = [], r = /* @__PURE__ */ new Set([
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
var Uo = {
	key: 0,
	class: "output-shell"
}, Wo = { class: "output-toolbar" }, Go = {
	key: 0,
	class: "system-message system-message--error"
}, Ko = ["data-shell-frame"], qo = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, Jo = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, Yo = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], Xo = ["data-lucide"], Zo = { "data-shell-nav-label": "" }, Qo = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, $o = { class: "shell-page-identity" }, es = { class: "shell-page-actions" }, ts = {
	class: "shell-status",
	role: "status"
}, ns = { class: "editor-header editor-toolbar" }, rs = {
	key: 0,
	class: "editor-mode-note"
}, is = { class: "editor-global-actions" }, as = {
	key: 0,
	class: "global-token-menu"
}, os = { class: "global-token-swatches" }, ss = [
	"title",
	"aria-label",
	"onClick"
], cs = { "aria-label": "Visual Editor navigation" }, ls = ["disabled"], us = ["disabled"], ds = {
	key: 0,
	class: "system-message"
}, fs = {
	key: 1,
	class: "system-message system-message--error"
}, ps = {
	key: 2,
	class: "system-message system-message--error",
	role: "alert"
}, ms = {
	key: 3,
	class: "system-message",
	role: "status"
}, hs = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, gs = { class: "panel-heading" }, _s = { class: "section-list" }, vs = { class: "section-trigger-row" }, ys = ["aria-expanded", "onClick"], bs = ["aria-label"], xs = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, Ss = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, Cs = {
	key: 0,
	class: "section-ai-actions"
}, ws = [
	"disabled",
	"title",
	"onClick"
], Ts = ["onClick"], Es = { class: "section-accordion__body" }, Ds = { class: "section-accordion__items" }, Os = ["onClick"], ks = { key: 0 }, As = { class: "preview-panel" }, js = { class: "preview-toolbar" }, Ms = { class: "preview-title-group" }, Ns = ["disabled"], Ps = {
	key: 1,
	class: "preview-edit-hint"
}, Fs = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, Is = { class: "preview-controls" }, Ls = { class: "guide-toggle" }, Rs = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, zs = { class: "property-panel" }, Bs = { class: "panel-heading" }, Vs = {
	key: 0,
	class: "property-form"
}, Hs = { key: 0 }, Us = ["disabled", "value"], Ws = { key: 1 }, Gs = ["disabled", "value"], Ks = ["disabled", "title"], qs = ["disabled", "value"], Js = ["value"], Ys = ["disabled", "value"], Xs = { key: 1 }, Zs = ["disabled", "value"], Qs = { key: 2 }, $s = ["disabled", "value"], ec = { key: 3 }, tc = ["disabled", "rows"], nc = { class: "item-meta" }, rc = { class: "design-controls" }, ic = { class: "design-controls__heading" }, ac = ["disabled"], oc = {
	key: 0,
	class: "image-frame-controls"
}, sc = { class: "range-field" }, cc = ["disabled", "value"], lc = { key: 0 }, uc = { class: "range-field" }, dc = ["disabled", "value"], fc = { class: "toggle-field" }, pc = ["disabled", "checked"], mc = ["disabled", "value"], hc = ["disabled", "value"], gc = ["disabled", "value"], _c = { class: "toggle-field" }, vc = ["disabled", "checked"], yc = { key: 1 }, bc = ["disabled", "value"], xc = ["disabled", "value"], Sc = { class: "range-field" }, Cc = ["disabled", "value"], wc = ["disabled", "value"], Tc = ["disabled", "value"], Ec = { class: "position-status" }, Dc = { key: 0 }, Oc = { key: 1 }, kc = ["disabled"], Ac = {
	key: 3,
	class: "section-background-alignment"
}, jc = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, Mc = ["onClick"], Nc = {
	key: 4,
	class: "section-background-fade"
}, Pc = ["value"], Fc = { key: 0 }, Ic = ["value"], Lc = { class: "section-size-control" }, Rc = ["disabled"], zc = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, Bc = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ W(t.mode !== "output"), r = /* @__PURE__ */ W(""), i = /* @__PURE__ */ W([]), a = /* @__PURE__ */ W(null), o = /* @__PURE__ */ W(""), s = /* @__PURE__ */ W([]), c = /* @__PURE__ */ W({}), l = /* @__PURE__ */ W(JSON.parse(JSON.stringify(go))), u = /* @__PURE__ */ W(""), d = /* @__PURE__ */ W(""), f = /* @__PURE__ */ W(""), p = /* @__PURE__ */ W("desktop"), m = /* @__PURE__ */ W(!0), h = /* @__PURE__ */ W(""), g = /* @__PURE__ */ W(null), _ = /* @__PURE__ */ W(1), v = /* @__PURE__ */ W(null), y = /* @__PURE__ */ W(""), b = /* @__PURE__ */ W(!1), x = /* @__PURE__ */ W(""), S = /* @__PURE__ */ W(!1), C = /* @__PURE__ */ W(!1), w = /* @__PURE__ */ W(""), T = /* @__PURE__ */ W({}), ee = !1, E = oa(() => t.mode === "admin-layout"), D = oa(() => t.mode === "wizard-layout"), te = new URLSearchParams(window.location.search).get("source") || "", O = oa(() => D.value && te === "create-promo"), ne = window.PromoShell?.navItems || [], k = oa(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), A = oa(() => k.value?.items?.find((e) => e.itemKey === d.value) || k.value?.items?.[0]), j = oa({
			get: () => c.value?.[k.value?.sectionKey]?.[A.value?.itemKey],
			set: (e) => se(e)
		}), M = oa(() => a.value ? xo({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), re = oa(() => t.mode === "output" ? g.value : M.value);
		function ie(e, t) {
			e && (u.value = e.sectionKey, d.value = t?.itemKey || "");
		}
		function ae(e) {
			if (e) {
				if (f.value === e.sectionKey) {
					f.value = "";
					return;
				}
				f.value = e.sectionKey, ie(e, e.items?.[0]);
			}
		}
		function se(e) {
			!k.value || !A.value || (c.value = {
				...c.value,
				[k.value.sectionKey]: {
					...c.value[k.value.sectionKey],
					[A.value.itemKey]: e
				}
			});
		}
		function ce(e, t) {
			se({
				...j.value || {},
				[e]: t
			});
		}
		function le(e, t, n) {
			ie(e, t), !(t.fieldKind !== "text" || t.isLocked) && se(n);
		}
		function ue(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function de(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => ue(e, t)) : t.some((t) => ue(e, t));
		}
		function fe() {
			!O.value || C.value || (C.value = !0, w.value = "", window.parent.postMessage({
				type: "create-promo-auto-register-request",
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin));
		}
		function pe(e) {
			return T.value?.[e.sectionKey] || null;
		}
		function me(e) {
			let t = pe(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function P(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets"
			].includes(pe(e)?.status);
		}
		function he(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1 || e.fieldKind === "image") return !1;
				let n = t[e.itemKey], r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function ge(e) {
			let t = pe(e);
			return P(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : t?.status === "ready" && !me(e) ? {
				action: "apply",
				label: "AI 적용",
				disabled: !1
			} : t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !he(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !he(e)
			};
		}
		function _e(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function ve(e, t) {
			return !!(e?.aiDesign?.enabled !== !1 && e?.aiDesign?.imageTarget === "item" && t?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && t?.image?.allowedSources?.includes("ai") && _e(e).includes(t.itemKey));
		}
		function I(e) {
			let t = pe(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function ye(e, t) {
			let n = pe(e), r = I(e) === t?.itemKey;
			return P(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : r && n?.status === "ready" && !me(e) ? {
				action: "apply",
				label: "AI 이미지 적용",
				disabled: !1
			} : r && n?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !he(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !he(e)
			};
		}
		function be(e, t, n = "") {
			window.parent.postMessage({
				type: "create-promo-section-ai-action",
				sectionKey: e.sectionKey,
				action: t,
				targetItemKey: String(n || "").trim() || null
			}, window.location.origin);
		}
		function L(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function xe() {
			!k.value || !A.value || A.value.isLocked || window.confirm(`${A.value.name} 이미지를 삭제할까요?`) && window.parent.postMessage({
				type: "create-promo-remove-image",
				sectionKey: k.value.sectionKey,
				itemKey: A.value.itemKey
			}, window.location.origin);
		}
		function Se(e) {
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
		let Ce = oa(() => k.value && A.value ? `${k.value.sectionKey}.${A.value.itemKey}` : ""), R = oa(() => l.value.itemStyles?.[Ce.value] || {}), z = oa(() => k.value && l.value.sectionStyles?.[k.value.sectionKey] || {});
		function B(e) {
			!Ce.value || A.value?.isLocked || (l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[Ce.value]: {
						...R.value,
						...e
					}
				}
			});
		}
		function we(e, t, n) {
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
		function Te() {
			if (!Ce.value || A.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} };
			delete e[Ce.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Ee() {
			if (!Ce.value || A.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} }, t = wo(e[Ce.value]);
			Object.keys(t).length ? e[Ce.value] = t : delete e[Ce.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function De(e, t) {
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
		function Oe(e) {
			!k.value || ![
				"left",
				"center",
				"right"
			].includes(e) || De(k.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function ke(e) {
			!k.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || De(k.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: z.value.backgroundFadeStrength || "medium"
			});
		}
		function Ae(e) {
			[
				"square",
				"rounded",
				"circle"
			].includes(e) && B(e === "circle" ? {
				shape: e,
				aspectRatio: "1/1",
				aspectRatioLocked: !0,
				heightPx: void 0
			} : { shape: e });
		}
		function je() {
			if (!k.value) return;
			let e = { ...l.value.sectionStyles || {} }, t = { ...e[k.value.sectionKey] || {} };
			delete t.minHeight, Object.keys(t).length ? e[k.value.sectionKey] = t : delete e[k.value.sectionKey], l.value = {
				...l.value,
				sectionStyles: e
			};
		}
		async function Me() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = l.template, o.value = l.configRevision || "", s.value = l.sections || [], c.value = bo(s.value), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = s.value[0]?.sectionKey || "";
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function Ne() {
			if (!M.value) return;
			h.value = "";
			let e = To(localStorage, mo, M.value);
			if (!e.ok) {
				h.value = e.message;
				return;
			}
			window.open("/prototype/visual-output.html", "_blank", "noopener");
		}
		async function Pe() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error(n.message || n.error || "기본 레이아웃을 불러오지 못했습니다.");
				a.value = n.template, s.value = n.sections || [], c.value = bo(s.value), l.value = Bo(n.layout?.layoutSpec), _.value = Number(n.layout?.layoutRevision || 1), v.value = n.layout?.id || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = s.value[0]?.sectionKey || "";
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function Fe() {
			if (!a.value?.id || b.value) return;
			x.value = "";
			let e = Ho(l.value);
			if (!e.ok) {
				x.value = `레이아웃 검증 실패: ${e.errors[0]?.path || "unknown"}`;
				return;
			}
			b.value = !0;
			try {
				let t = await fetch("/api/wizard-form-template-layout", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						templateId: a.value.id,
						expectedRevision: _.value,
						rendererKey: "default-promo-renderer",
						rendererVersion: 1,
						layoutSpec: e.spec,
						changeNote: y.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
					})
				}), n = await t.json().catch(() => ({}));
				if (!t.ok) throw Error(n.message || n.error || `레이아웃 저장 오류(${t.status})`);
				l.value = Bo(n.layout.layoutSpec), _.value = Number(n.layout.layoutRevision || _.value + 1), v.value = n.layout.id || v.value, y.value = "", x.value = `기본 레이아웃을 Draft에 저장했습니다. revision ${_.value} · Create Promo 반영을 위해 관리자 페이지에서 템플릿을 활성화하세요.`;
			} catch (e) {
				x.value = e.message;
			} finally {
				b.value = !1;
			}
		}
		async function Ie(e) {
			if (!e?.content) return;
			let t = k.value?.sectionKey || u.value, i = A.value?.itemKey || d.value, p = f.value;
			ee = !0, a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, T.value = e.content.sectionDesignRuns || {}, l.value = Bo(e.designSpec), _.value = Number(e.layoutRevision || 1);
			let m = s.value.find((e) => e.sectionKey === t) || s.value[0];
			u.value = m?.sectionKey || "", d.value = m?.items?.some((e) => e.itemKey === i) ? i : m?.items?.[0]?.itemKey || "", f.value = s.value.some((e) => e.sectionKey === p) ? p : m?.sectionKey || "", S.value = !0, n.value = !1, r.value = "", await on(), ee = !1;
		}
		function Le(e) {
			if (!(!D.value || e.origin !== window.location.origin)) {
				if (e.data?.type === "create-promo-auto-register-result") {
					C.value = !1;
					let t = Number(e.data.registeredCount || 0);
					w.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e.data?.type === "promo-wizard-layout-snapshot" && Ie(e.data.snapshot);
			}
		}
		Tn([l, c], () => {
			!D.value || !S.value || ee || window.parent.postMessage({
				type: "promo-wizard-layout-change",
				designSpec: JSON.parse(JSON.stringify(l.value)),
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin);
		}, { deep: !0 });
		function Re() {
			try {
				let e = localStorage.getItem(mo);
				if (!e) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
				g.value = JSON.parse(e);
			} catch (e) {
				r.value = e.message;
			}
		}
		return qn(() => {
			window.PromoShell?.init(document), t.mode === "output" ? Re() : E.value ? Pe() : D.value ? (n.value = !0, window.addEventListener("message", Le), window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin)) : Me();
		}), Xn(() => window.removeEventListener("message", Le)), (t, i) => e.mode === "output" ? (Y(), X("div", Uo, [Z("header", Wo, [Z("div", null, [i[26] ||= Z("span", null, "WEB OUTPUT", -1), Z("strong", null, F(re.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[27] ||= Z("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (Y(), X("div", Go, F(r.value), 1)) : re.value ? (Y(), wi(Lo, {
			key: 1,
			content: re.value.content,
			"design-spec": re.value.designSpec,
			assets: re.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Q("", !0)])) : (Y(), X("main", {
			key: 1,
			class: N(["editor-shell", { "shell-frame": !D.value }]),
			"data-shell-frame": D.value ? null : ""
		}, [
			D.value ? Q("", !0) : (Y(), X("aside", qo, [
				i[28] ||= Pi("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[29] ||= Z("div", {
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
				Z("nav", Jo, [(Y(!0), X(J, null, rr(Rt(ne), (e) => (Y(), X("a", {
					key: e.key,
					href: e.href,
					class: N({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [Z("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, Xo), Z("span", Zo, F(e.label), 1)], 10, Yo))), 128))]),
				i[30] ||= Z("div", { class: "shell-sidebar__footer" }, [Z("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [Z("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), Z("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			Z("div", { class: N(D.value ? "editor-embedded-main" : "shell-main") }, [D.value ? Q("", !0) : (Y(), X("header", Qo, [Z("div", $o, [i[31] ||= Z("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), Z("strong", null, F(E.value ? "Admin Template Layout" : "Visual Editor"), 1)]), Z("div", es, [Z("div", ts, F(E.value ? `Layout revision ${_.value}` : "편집 준비"), 1)])])), Z("div", { class: N({ "shell-content": !D.value }) }, [
				Z("header", ns, [Z("div", null, [
					Z("span", null, F(E.value ? "ADMIN TEMPLATE LAYOUT" : D.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					Z("h2", null, F(a.value?.name || "Default Renderer"), 1),
					E.value ? (Y(), X("small", rs, " v" + F(a.value?.version || 1) + " · " + F(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : Q("", !0)
				]), Z("div", is, [O.value ? Q("", !0) : (Y(), X("fieldset", as, [i[32] ||= Z("legend", null, "페이지 배경", -1), Z("div", os, [(Y(!0), X(J, null, rr(Rt(ho), (e) => (Y(), X("button", {
					key: e.key,
					type: "button",
					class: N({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => Se(e)
				}, [Z("i", { style: oe({ backgroundColor: e.value }) }, null, 4)], 10, ss))), 128))])])), Z("nav", cs, [E.value ? (Y(), X(J, { key: 0 }, [yn(Z("input", {
					"onUpdate:modelValue": i[0] ||= (e) => y.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[Qa, y.value]]), Z("button", {
					type: "button",
					disabled: !M.value || b.value,
					onClick: Fe
				}, F(b.value ? "저장 중" : "기본 레이아웃 저장"), 9, ls)], 64)) : D.value ? Q("", !0) : (Y(), X("button", {
					key: 1,
					type: "button",
					disabled: !M.value,
					onClick: Ne
				}, "Web Output 열기", 8, us))])])]),
				n.value ? (Y(), X("div", ds, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (Y(), X("div", fs, F(r.value), 1)) : Q("", !0),
				h.value ? (Y(), X("div", ps, F(h.value), 1)) : Q("", !0),
				x.value ? (Y(), X("div", ms, F(x.value), 1)) : Q("", !0),
				!n.value && !r.value ? (Y(), X("section", {
					key: 4,
					class: N(["editor-workspace", { "is-create-promo-wizard": O.value }])
				}, [
					Z("aside", hs, [Z("div", gs, [i[33] ||= Z("span", null, "SECTIONS", -1), Z("strong", null, F(s.value.length), 1)]), Z("div", _s, [(Y(!0), X(J, null, rr(s.value, (e) => (Y(), X("div", {
						key: e.sectionKey,
						class: N(["section-accordion", { open: e.sectionKey === f.value }])
					}, [Z("div", vs, [Z("button", {
						type: "button",
						class: N(["section-trigger", { active: e.sectionKey === k.value?.sectionKey }]),
						"aria-expanded": e.sectionKey === f.value,
						onClick: (t) => ae(e)
					}, [
						Z("span", null, F(e.name), 1),
						(Y(), X("svg", {
							class: N(["section-registration-icon", de(e) ? "is-complete" : "is-incomplete"]),
							viewBox: "0 0 20 20",
							role: "img",
							"aria-label": de(e) ? `${e.name} 콘텐츠 등록 완료` : `${e.name} 콘텐츠 등록 필요`
						}, [i[34] ||= Z("circle", {
							cx: "10",
							cy: "10",
							r: "9"
						}, null, -1), de(e) ? (Y(), X("path", xs)) : (Y(), X("path", Ss))], 10, bs)),
						i[35] ||= Z("i", { "aria-hidden": "true" }, null, -1)
					], 10, ys), O.value ? (Y(), X("div", Cs, [e.aiDesign?.enabled !== !1 && e.aiDesign?.imageTarget !== "item" ? (Y(), X("button", {
						key: 0,
						type: "button",
						class: "section-ai-action",
						disabled: ge(e).disabled,
						title: ge(e).disabled && !P(e) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
						onClick: (t) => be(e, ge(e).action)
					}, F(ge(e).label), 9, ws)) : Q("", !0), L(e) ? (Y(), X("button", {
						key: 1,
						type: "button",
						class: "section-ai-remove",
						onClick: (t) => be(e, "remove-background")
					}, "배경 삭제", 8, Ts)) : Q("", !0)])) : Q("", !0)]), Z("div", Es, [Z("div", Ds, [(Y(!0), X(J, null, rr(e.items || [], (t) => (Y(), X("button", {
						key: t.itemKey,
						type: "button",
						class: N({ active: e.sectionKey === k.value?.sectionKey && t.itemKey === A.value?.itemKey }),
						onClick: (n) => ie(e, t)
					}, F(t.name), 11, Os))), 128)), e.items?.length ? Q("", !0) : (Y(), X("span", ks, "등록된 아이템 없음"))])])], 2))), 128))])]),
					Z("section", As, [Z("div", js, [Z("div", Ms, [
						i[36] ||= Z("strong", null, "Live Preview", -1),
						Z("small", null, F(a.value.templateKey) + " · v" + F(a.value.version), 1),
						O.value ? (Y(), X("button", {
							key: 0,
							class: "auto-register-action",
							type: "button",
							disabled: C.value,
							onClick: fe
						}, F(C.value ? "등록 중" : "자동등록"), 9, Ns)) : Q("", !0),
						O.value ? (Y(), X("small", Ps, "미리보기 요소를 선택해 내용을 입력하세요.")) : Q("", !0),
						w.value ? (Y(), X("small", Fs, F(w.value), 1)) : Q("", !0)
					]), Z("div", Is, [Z("label", Ls, [
						yn(Z("input", {
							"onUpdate:modelValue": i[1] ||= (e) => m.value = e,
							type: "checkbox"
						}, null, 512), [[$a, m.value]]),
						i[37] ||= Z("span", null, "Guides", -1),
						Z("strong", null, F(m.value ? "ON" : "OFF"), 1)
					]), Z("div", Rs, [Z("button", {
						type: "button",
						class: N({ active: p.value === "desktop" }),
						onClick: i[2] ||= (e) => p.value = "desktop"
					}, "Desktop", 2), Z("button", {
						type: "button",
						class: N({ active: p.value === "mobile" }),
						onClick: i[3] ||= (e) => p.value = "mobile"
					}, "Mobile", 2)])])]), Z("div", { class: N(["preview-stage", `preview-stage--${p.value}`]) }, [re.value ? (Y(), wi(Lo, {
						key: 0,
						content: re.value.content,
						"design-spec": re.value.designSpec,
						assets: re.value.assets,
						editable: "",
						"show-guides": m.value,
						"selected-item-key": Ce.value,
						onSelectItem: ie,
						onUpdateItemStyle: B,
						onUpdateRendererItemStyle: we,
						onUpdateItemContent: le,
						onUpdateSectionStyle: De
					}, null, 8, [
						"content",
						"design-spec",
						"assets",
						"show-guides",
						"selected-item-key"
					])) : Q("", !0)], 2)]),
					Z("aside", zs, [Z("div", Bs, [i[38] ||= Z("span", null, "CONTENT", -1), Z("strong", null, F(A.value?.name || "항목 선택"), 1)]), A.value ? (Y(), X("div", Vs, [
						A.value.fieldKind === "cta" ? (Y(), X("label", Hs, [i[39] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
							disabled: A.value.isLocked,
							value: j.value?.label,
							onInput: i[4] ||= (e) => ce("label", e.target.value)
						}, null, 40, Us)])) : Q("", !0),
						A.value.fieldKind === "cta" ? (Y(), X("label", Ws, [i[40] ||= Z("span", null, "버튼 URL", -1), Z("input", {
							disabled: A.value.isLocked,
							type: "url",
							value: j.value?.link,
							onInput: i[5] ||= (e) => ce("link", e.target.value)
						}, null, 40, Gs)])) : A.value.fieldKind === "image" ? (Y(), X(J, { key: 2 }, [
							O.value && ve(k.value, A.value) ? (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action item-ai-generation-action",
								disabled: ye(k.value, A.value).disabled,
								title: ye(k.value, A.value).disabled && !P(k.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
								onClick: i[6] ||= (e) => be(k.value, ye(k.value, A.value).action, A.value.itemKey)
							}, F(ye(k.value, A.value).label), 9, Ks)) : Q("", !0),
							Z("label", null, [i[41] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
								disabled: A.value.isLocked,
								value: j.value?.source,
								onChange: i[7] ||= (e) => ce("source", e.target.value)
							}, [(Y(!0), X(J, null, rr(A.value.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, F(e), 9, Js))), 128))], 40, qs)]),
							Z("label", null, [i[42] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
								disabled: A.value.isLocked,
								rows: "4",
								value: j.value?.value,
								onInput: i[8] ||= (e) => ce("value", e.target.value)
							}, null, 40, Ys)]),
							A.value.image?.descriptionEnabled ? (Y(), X("label", Xs, [i[43] ||= Z("span", null, "설명", -1), Z("textarea", {
								disabled: A.value.isLocked,
								rows: "3",
								value: j.value?.description,
								onInput: i[9] ||= (e) => ce("description", e.target.value)
							}, null, 40, Zs)])) : Q("", !0),
							A.value.image?.altTextRequired ? (Y(), X("label", Qs, [i[44] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
								disabled: A.value.isLocked,
								value: j.value?.alt,
								onInput: i[10] ||= (e) => ce("alt", e.target.value)
							}, null, 40, $s)])) : Q("", !0),
							!A.value.isLocked && j.value?.value ? (Y(), X("button", {
								key: 3,
								type: "button",
								class: "image-remove-action",
								onClick: xe
							}, "이미지 삭제")) : Q("", !0)
						], 64)) : (Y(), X("label", ec, [Z("span", null, F(A.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), yn(Z("textarea", {
							"onUpdate:modelValue": i[11] ||= (e) => j.value = e,
							disabled: A.value.isLocked,
							rows: A.value.textType === "multi" ? 8 : 3,
							placeholder: "Enter 키로 줄바꿈할 수 있습니다."
						}, null, 8, tc), [[Qa, j.value]])])),
						Z("dl", nc, [
							Z("div", null, [i[45] ||= Z("dt", null, "Item key", -1), Z("dd", null, F(A.value.itemKey), 1)]),
							Z("div", null, [i[46] ||= Z("dt", null, "필수", -1), Z("dd", null, F(A.value.isRequired ? "Y" : "N"), 1)]),
							Z("div", null, [i[47] ||= Z("dt", null, "고정", -1), Z("dd", null, F(A.value.isLocked ? "Y" : "N"), 1)])
						]),
						Z("section", rc, [
							Z("div", ic, [i[48] ||= Z("strong", null, "DESIGN", -1), Z("button", {
								type: "button",
								disabled: A.value.isLocked,
								onClick: Te
							}, "초기화", 8, ac)]),
							A.value.fieldKind === "image" ? (Y(), X("div", oc, [
								Z("label", null, [i[49] ||= Z("span", null, "이미지 너비", -1), Z("div", sc, [Z("input", {
									type: "range",
									min: "10",
									max: "100",
									step: "1",
									disabled: A.value.isLocked,
									value: R.value.widthPct || 32,
									onInput: i[12] ||= (e) => B({ widthPct: Number(e.target.value) })
								}, null, 40, cc), Z("output", null, F(Math.round(R.value.widthPct || 32)) + "%", 1)])]),
								R.value.shape !== "circle" && R.value.aspectRatioLocked === !1 ? (Y(), X("label", lc, [i[50] ||= Z("span", null, "이미지 높이", -1), Z("div", uc, [Z("input", {
									type: "range",
									min: "80",
									max: "900",
									step: "10",
									disabled: A.value.isLocked,
									value: R.value.heightPx || 240,
									onInput: i[13] ||= (e) => B({ heightPx: Number(e.target.value) })
								}, null, 40, dc), Z("output", null, F(Math.round(R.value.heightPx || 240)) + "px", 1)])])) : Q("", !0),
								Z("label", fc, [Z("input", {
									type: "checkbox",
									disabled: A.value.isLocked,
									checked: R.value.aspectRatioLocked !== !1,
									onChange: i[14] ||= (e) => B({ aspectRatioLocked: e.target.checked })
								}, null, 40, pc), i[51] ||= Z("span", null, "비율 고정", -1)]),
								Z("label", null, [i[53] ||= Z("span", null, "이미지 맞춤", -1), Z("select", {
									disabled: A.value.isLocked,
									value: R.value.imageFit || "contain",
									onChange: i[15] ||= (e) => B({ imageFit: e.target.value })
								}, [...i[52] ||= [Z("option", { value: "contain" }, "전체 표시", -1), Z("option", { value: "cover" }, "영역 채우기", -1)]], 40, mc)]),
								Z("label", null, [i[55] ||= Z("span", null, "이미지 초점", -1), Z("select", {
									disabled: A.value.isLocked,
									value: R.value.imagePosition || "center center",
									onChange: i[16] ||= (e) => B({ imagePosition: e.target.value })
								}, [...i[54] ||= [Pi("<option value=\"left top\">왼쪽 위</option><option value=\"center top\">중앙 위</option><option value=\"right top\">오른쪽 위</option><option value=\"left center\">왼쪽 중앙</option><option value=\"center center\">중앙</option><option value=\"right center\">오른쪽 중앙</option><option value=\"left bottom\">왼쪽 아래</option><option value=\"center bottom\">중앙 아래</option><option value=\"right bottom\">오른쪽 아래</option>", 9)]], 40, hc)]),
								Z("label", null, [i[57] ||= Z("span", null, "이미지 형태", -1), Z("select", {
									disabled: A.value.isLocked,
									value: R.value.shape || "square",
									onChange: i[17] ||= (e) => Ae(e.target.value)
								}, [...i[56] ||= [
									Z("option", { value: "square" }, "사각형", -1),
									Z("option", { value: "rounded" }, "둥근 사각형", -1),
									Z("option", { value: "circle" }, "원형", -1)
								]], 40, gc)]),
								Z("label", _c, [Z("input", {
									type: "checkbox",
									disabled: A.value.isLocked,
									checked: R.value.decorative === !0,
									onChange: i[18] ||= (e) => B({ decorative: e.target.checked })
								}, null, 40, vc), i[58] ||= Z("span", null, "장식 이미지", -1)]),
								R.value.decorative === !0 ? Q("", !0) : (Y(), X("label", yc, [i[59] ||= Z("span", null, "이미지 설명", -1), Z("input", {
									type: "text",
									maxlength: "240",
									disabled: A.value.isLocked,
									value: R.value.accessibleLabel || j.value?.alt || A.value.name,
									onInput: i[19] ||= (e) => B({ accessibleLabel: e.target.value })
								}, null, 40, bc)]))
							])) : Q("", !0),
							A.value.fieldKind === "image" ? Q("", !0) : (Y(), X(J, { key: 1 }, [
								Z("label", null, [i[60] ||= Z("span", null, "글자 색상", -1), Z("input", {
									type: "color",
									disabled: A.value.isLocked,
									value: R.value.color || "#172033",
									onInput: i[20] ||= (e) => B({ color: e.target.value })
								}, null, 40, xc)]),
								Z("label", null, [i[61] ||= Z("span", null, "폰트 크기", -1), Z("div", Sc, [Z("input", {
									type: "range",
									min: "10",
									max: "80",
									step: "1",
									disabled: A.value.isLocked,
									value: R.value.fontSize || 18,
									onInput: i[21] ||= (e) => B({ fontSize: Number(e.target.value) })
								}, null, 40, Cc), Z("output", null, F(R.value.fontSize || 18) + "px", 1)])]),
								Z("label", null, [i[63] ||= Z("span", null, "폰트 굵기", -1), Z("select", {
									disabled: A.value.isLocked,
									value: R.value.fontWeight || 400,
									onChange: i[22] ||= (e) => B({ fontWeight: Number(e.target.value) })
								}, [...i[62] ||= [
									Z("option", { value: 400 }, "Regular", -1),
									Z("option", { value: 500 }, "Medium", -1),
									Z("option", { value: 700 }, "Bold", -1),
									Z("option", { value: 800 }, "Extra Bold", -1)
								]], 40, wc)]),
								Z("label", null, [i[65] ||= Z("span", null, "정렬", -1), Z("select", {
									disabled: A.value.isLocked,
									value: R.value.textAlign || "left",
									onChange: i[23] ||= (e) => B({ textAlign: e.target.value })
								}, [...i[64] ||= [
									Z("option", { value: "left" }, "왼쪽", -1),
									Z("option", { value: "center" }, "가운데", -1),
									Z("option", { value: "right" }, "오른쪽", -1)
								]], 40, Tc)])
							], 64)),
							Z("div", Ec, [i[66] ||= Z("span", null, "위치", -1), R.value.positionMode === "free" ? (Y(), X("strong", Dc, " X " + F(Math.round(R.value.xPct || 0)) + "% · Y " + F(Math.round(R.value.yPx || 0)) + "px ", 1)) : (Y(), X("strong", Oc, "자동 배치"))]),
							R.value.positionMode === "free" ? (Y(), X("button", {
								key: 2,
								class: "secondary-control",
								type: "button",
								disabled: A.value.isLocked,
								onClick: Ee
							}, " 자동 배치로 복원 ", 8, kc)) : Q("", !0),
							L(k.value) ? (Y(), X("div", Ac, [i[67] ||= Z("span", null, "배경 이미지 정렬", -1), Z("div", jc, [(Y(), X(J, null, rr([
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
								class: N({ active: (z.value.backgroundPosition || "center center") === `${e.value} center` }),
								onClick: (t) => Oe(e.value)
							}, F(e.label), 11, Mc)), 64))])])) : Q("", !0),
							L(k.value) || k.value?.aiDesign?.enabled !== !1 ? (Y(), X("div", Nc, [Z("label", null, [i[69] ||= Z("span", null, "배경 이미지 페이드", -1), Z("select", {
								value: z.value.backgroundFadeMode || "none",
								onChange: i[24] ||= (e) => ke(e.target.value)
							}, [...i[68] ||= [
								Z("option", { value: "none" }, "페이드 없음", -1),
								Z("option", { value: "left" }, "왼쪽 페이드", -1),
								Z("option", { value: "right" }, "오른쪽 페이드", -1),
								Z("option", { value: "both" }, "양끝 페이드", -1)
							]], 40, Pc)]), (z.value.backgroundFadeMode || "none") === "none" ? Q("", !0) : (Y(), X("label", Fc, [i[71] ||= Z("span", null, "페이드 강도", -1), Z("select", {
								value: z.value.backgroundFadeStrength || "medium",
								onChange: i[25] ||= (e) => De(k.value.sectionKey, { backgroundFadeStrength: e.target.value })
							}, [...i[70] ||= [
								Z("option", { value: "soft" }, "약하게", -1),
								Z("option", { value: "medium" }, "보통", -1),
								Z("option", { value: "strong" }, "강하게", -1)
							]], 40, Ic)]))])) : Q("", !0),
							Z("div", Lc, [Z("div", null, [i[72] ||= Z("span", null, "섹션 높이", -1), Z("strong", null, F(z.value.minHeight ? `${Math.round(z.value.minHeight)}px` : "자동"), 1)]), Z("button", {
								type: "button",
								disabled: !z.value.minHeight,
								onClick: je
							}, " 높이 초기화 ", 8, Rc)])
						])
					])) : Q("", !0)])
				], 2)) : Q("", !0)
			], 2)], 2),
			D.value ? Q("", !0) : (Y(), X("button", zc))
		], 10, Ko));
	}
}, Vc = document.querySelector("#visual-editor-app");
Vc && lo(Bc, { mode: new URLSearchParams(window.location.search).get("mode") || Vc.dataset.mode || "editor" }).mount(Vc);
//#endregion
