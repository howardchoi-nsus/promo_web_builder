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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, D = /-\w/g, O = E((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), k = /\B([A-Z])/g, A = E((e) => e.replace(k, "-$1").toLowerCase()), j = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), ee = E((e) => e ? `on${j(e)}` : ""), M = (e, t) => !Object.is(e, t), te = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, N = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ne = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, re, ie = () => re ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ae(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? se(r) : ae(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var oe = /;(?![^(]*\))/g, P = /:([^]+)/, F = /\/\*[^]*?\*\//g;
function se(e) {
	let t = {};
	return e.replace(F, "").split(oe).forEach((e) => {
		if (e) {
			let n = e.split(P);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function I(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = I(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ce = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", le = /* @__PURE__ */ e(ce);
ce + "";
function ue(e) {
	return !!e || e === "";
}
function de(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = fe(e[r], t[r]);
	return n;
}
function fe(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? de(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !fe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function pe(e, t) {
	return e.findIndex((e) => fe(e, t));
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
		this.flags |= 2, Le(this), De(this);
		let e = z, t = Ne;
		z = this, Ne = !0;
		try {
			return this.fn();
		} finally {
			Oe(this), z = e, Ne = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) je(e);
			this.deps = this.depsTail = void 0, Le(this), this.onStop && this.onStop(), this.flags &= -2;
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
		r.version === -1 ? (r === n && (n = e), je(r), Me(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ke(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ae(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ae(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Re) || (e.globalVersion = Re, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ke(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = z, r = Ne;
	z = e, Ne = !0;
	try {
		De(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		z = n, Ne = r, Oe(e), e.flags &= -3;
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
var Ne = !0, Pe = [];
function Fe() {
	Pe.push(Ne), Ne = !1;
}
function Ie() {
	let e = Pe.pop();
	Ne = e === void 0 || e;
}
function Le(e) {
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
var Re = 0, ze = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Be = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!z || !Ne || z === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== z) t = this.activeLink = new ze(z, this), z.deps ? (t.prevDep = z.depsTail, z.depsTail.nextDep = t, z.depsTail = t) : z.deps = z.depsTail = t, Ve(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = z.depsTail, t.nextDep = void 0, z.depsTail.nextDep = t, z.depsTail = t, z.deps === t && (z.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Re++, this.notify(e);
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
function Ve(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ve(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var He = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ Symbol(""), We = /* @__PURE__ */ Symbol(""), Ge = /* @__PURE__ */ Symbol("");
function B(e, t, n) {
	if (Ne && z) {
		let t = He.get(e);
		t || He.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Be()), r.map = t, r.key = n), r.track();
	}
}
function Ke(e, t, n, r, i, a) {
	let o = He.get(e);
	if (!o) {
		Re++;
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
				(n === "length" || n === Ge || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ge)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "delete":
				i || (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "set":
				f(e) && s(o.get(Ue));
				break;
		}
	}
	Ee();
}
function qe(e) {
	let t = /* @__PURE__ */ V(e);
	return t === e ? t : (B(t, "iterate", Ge), /* @__PURE__ */ Mt(e) ? t : t.map(Ft));
}
function Je(e) {
	return B(e = /* @__PURE__ */ V(e), "iterate", Ge), e;
}
function Ye(e, t) {
	return /* @__PURE__ */ jt(e) ? It(/* @__PURE__ */ At(e) ? Ft(t) : t) : Ft(t);
}
var Xe = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ze(this, Symbol.iterator, (e) => Ye(this, e));
	},
	concat(...e) {
		return qe(this).concat(...e.map((e) => d(e) ? qe(e) : e));
	},
	entries() {
		return Ze(this, "entries", (e) => (e[1] = Ye(this, e[1]), e));
	},
	every(e, t) {
		return $e(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return $e(this, "filter", e, t, (e) => e.map((e) => Ye(this, e)), arguments);
	},
	find(e, t) {
		return $e(this, "find", e, t, (e) => Ye(this, e), arguments);
	},
	findIndex(e, t) {
		return $e(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return $e(this, "findLast", e, t, (e) => Ye(this, e), arguments);
	},
	findLastIndex(e, t) {
		return $e(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return $e(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return tt(this, "includes", e);
	},
	indexOf(...e) {
		return tt(this, "indexOf", e);
	},
	join(e) {
		return qe(this).join(e);
	},
	lastIndexOf(...e) {
		return tt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return $e(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return nt(this, "pop");
	},
	push(...e) {
		return nt(this, "push", e);
	},
	reduce(e, ...t) {
		return et(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return et(this, "reduceRight", e, t);
	},
	shift() {
		return nt(this, "shift");
	},
	some(e, t) {
		return $e(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return nt(this, "splice", e);
	},
	toReversed() {
		return qe(this).toReversed();
	},
	toSorted(e) {
		return qe(this).toSorted(e);
	},
	toSpliced(...e) {
		return qe(this).toSpliced(...e);
	},
	unshift(...e) {
		return nt(this, "unshift", e);
	},
	values() {
		return Ze(this, "values", (e) => Ye(this, e));
	}
};
function Ze(e, t, n) {
	let r = Je(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Mt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Qe = Array.prototype;
function $e(e, t, n, r, i, a) {
	let o = Je(e), s = o !== e && !/* @__PURE__ */ Mt(e), c = o[t];
	if (c !== Qe[t]) {
		let t = c.apply(e, a);
		return s ? Ft(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Ye(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function et(e, t, n, r) {
	let i = Je(e), a = i !== e && !/* @__PURE__ */ Mt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ye(e, t)), n.call(this, t, Ye(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ye(e, c) : c;
}
function tt(e, t, n) {
	let r = /* @__PURE__ */ V(e);
	B(r, "iterate", Ge);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Nt(n[0]) ? (n[0] = /* @__PURE__ */ V(n[0]), r[t](...n)) : i;
}
function nt(e, t, n = []) {
	Fe(), Te();
	let r = (/* @__PURE__ */ V(e))[t].apply(e, n);
	return Ee(), Ie(), r;
}
var rt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), it = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function at(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ V(this);
	return B(t, "has", e), t.hasOwnProperty(e);
}
var ot = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? wt : Ct : i ? St : xt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Xe[t])) return e;
			if (t === "hasOwnProperty") return at;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ H(e) ? e : n);
		if ((_(t) ? it.has(t) : rt(t)) || (r || B(e, "get", t), i)) return o;
		if (/* @__PURE__ */ H(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Ot(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Ot(o) : /* @__PURE__ */ Et(o) : o;
	}
}, st = class extends ot {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ jt(i);
			if (!/* @__PURE__ */ Mt(n) && !/* @__PURE__ */ jt(n) && (i = /* @__PURE__ */ V(i), n = /* @__PURE__ */ V(n)), !a && /* @__PURE__ */ H(i) && !/* @__PURE__ */ H(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ H(e) ? e : r);
		return e === /* @__PURE__ */ V(r) && s && (o ? M(n, i) && Ke(e, "set", t, n, i) : Ke(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ke(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !it.has(t)) && B(e, "has", t), n;
	}
	ownKeys(e) {
		return B(e, "iterate", d(e) ? "length" : Ue), Reflect.ownKeys(e);
	}
}, ct = class extends ot {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, lt = /* @__PURE__ */ new st(), ut = /* @__PURE__ */ new ct(), dt = /* @__PURE__ */ new st(!0), ft = (e) => e, pt = (e) => Reflect.getPrototypeOf(e);
function mt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ V(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? ft : t ? It : Ft;
		return !t && B(a, "iterate", l ? We : Ue), s(Object.create(u), { next() {
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
function ht(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function gt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ V(r), a = /* @__PURE__ */ V(n);
			e || (M(n, a) && B(i, "get", n), B(i, "get", a));
			let { has: o } = pt(i), s = t ? ft : e ? It : Ft;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && B(/* @__PURE__ */ V(t), "iterate", Ue), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ V(n), i = /* @__PURE__ */ V(t);
			return e || (M(t, i) && B(r, "has", t), B(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ V(a), s = t ? ft : e ? It : Ft;
			return !e && B(o, "iterate", Ue), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: ht("add"),
		set: ht("set"),
		delete: ht("delete"),
		clear: ht("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ V(this), r = pt(n), i = /* @__PURE__ */ V(e), a = !t && !/* @__PURE__ */ Mt(e) && !/* @__PURE__ */ jt(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), Ke(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Mt(n) && !/* @__PURE__ */ jt(n) && (n = /* @__PURE__ */ V(n));
			let r = /* @__PURE__ */ V(this), { has: i, get: a } = pt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ V(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && Ke(r, "set", e, n, s) : Ke(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ V(this), { has: n, get: r } = pt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ V(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ke(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ V(this), t = e.size !== 0, n = e.clear();
			return t && Ke(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = mt(r, e, t);
	}), n;
}
function _t(e, t) {
	let n = gt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var vt = { get: /* @__PURE__ */ _t(!1, !1) }, yt = { get: /* @__PURE__ */ _t(!1, !0) }, bt = { get: /* @__PURE__ */ _t(!0, !1) }, xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap();
function Tt(e) {
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
function Et(e) {
	return /* @__PURE__ */ jt(e) ? e : kt(e, !1, lt, vt, xt);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
	return kt(e, !1, dt, yt, St);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return kt(e, !0, ut, bt, Ct);
}
function kt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Tt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return /* @__PURE__ */ jt(e) ? /* @__PURE__ */ At(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ V(t) : e;
}
function Pt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && N(e, "__v_skip", !0), e;
}
var Ft = (e) => v(e) ? /* @__PURE__ */ Et(e) : e, It = (e) => v(e) ? /* @__PURE__ */ Ot(e) : e;
// @__NO_SIDE_EFFECTS__
function H(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
	return Lt(e, !1);
}
function Lt(e, t) {
	return /* @__PURE__ */ H(e) ? e : new Rt(e, t);
}
var Rt = class {
	constructor(e, t) {
		this.dep = new Be(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ V(e), this._value = t ? e : Ft(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Mt(e) || /* @__PURE__ */ jt(e);
		e = n ? e : /* @__PURE__ */ V(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Ft(e), this.dep.trigger());
	}
};
function zt(e) {
	return /* @__PURE__ */ H(e) ? e.value : e;
}
var Bt = {
	get: (e, t, n) => t === "__v_raw" ? e : zt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ H(i) && !/* @__PURE__ */ H(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Vt(e) {
	return /* @__PURE__ */ At(e) ? e : new Proxy(e, Bt);
}
var Ht = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Be(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Re - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
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
function Ut(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Ht(r, i, n);
}
var Wt = {}, Gt = /* @__PURE__ */ new WeakMap(), Kt = void 0;
function qt(e, t = !1, n = Kt) {
	if (n) {
		let t = Gt.get(n);
		t || Gt.set(n, t = []), t.push(e);
	}
}
function Jt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Mt(e) || o === !1 || o === 0 ? Yt(e, 1) : Yt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ H(e) ? (g = () => e.value, y = /* @__PURE__ */ Mt(e)) : /* @__PURE__ */ At(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ At(e) || /* @__PURE__ */ Mt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ H(e)) return e.value;
		if (/* @__PURE__ */ At(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Fe();
			try {
				_();
			} finally {
				Ie();
			}
		}
		let t = Kt;
		Kt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Kt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Yt(e(), t);
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
	let C = b ? Array(e.length).fill(Wt) : Wt, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => M(e, C[t])) : M(t, C))) {
				_ && _();
				let e = Kt;
				Kt = m;
				try {
					let e = [
						t,
						C === Wt ? void 0 : b && C[0] === Wt ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Kt = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new be(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => qt(e, !1, m), _ = m.onStop = () => {
		let e = Gt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Gt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Yt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ H(e)) Yt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Yt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Yt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Yt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Yt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Xt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Qt(e, t, n);
	}
}
function Zt(e, t, n, r) {
	if (h(e)) {
		let i = Xt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Qt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Zt(e[a], t, n, r));
		return i;
	}
}
function Qt(e, n, r, i = !0) {
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
			Fe(), Xt(o, null, 10, [
				e,
				i,
				a
			]), Ie();
			return;
		}
	}
	$t(e, r, a, i, s);
}
function $t(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var W = [], en = -1, tn = [], nn = null, rn = 0, an = /* @__PURE__ */ Promise.resolve(), on = null;
function sn(e) {
	let t = on || an;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function cn(e) {
	let t = en + 1, n = W.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = W[r], a = mn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function ln(e) {
	if (!(e.flags & 1)) {
		let t = mn(e), n = W[W.length - 1];
		!n || !(e.flags & 2) && t >= mn(n) ? W.push(e) : W.splice(cn(t), 0, e), e.flags |= 1, un();
	}
}
function un() {
	on ||= an.then(hn);
}
function dn(e) {
	d(e) ? tn.push(...e) : nn && e.id === -1 ? nn.splice(rn + 1, 0, e) : e.flags & 1 || (tn.push(e), e.flags |= 1), un();
}
function fn(e, t, n = en + 1) {
	for (; n < W.length; n++) {
		let t = W[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			W.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function pn(e) {
	if (tn.length) {
		let e = [...new Set(tn)].sort((e, t) => mn(e) - mn(t));
		if (tn.length = 0, nn) {
			nn.push(...e);
			return;
		}
		for (nn = e, rn = 0; rn < nn.length; rn++) {
			let e = nn[rn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		nn = null, rn = 0;
	}
}
var mn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function hn(e) {
	try {
		for (en = 0; en < W.length; en++) {
			let e = W[en];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Xt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; en < W.length; en++) {
			let e = W[en];
			e && (e.flags &= -2);
		}
		en = -1, W.length = 0, pn(e), on = null, (W.length || tn.length) && hn(e);
	}
}
var gn = null, _n = null;
function vn(e) {
	let t = gn;
	return gn = e, _n = e && e.type.__scopeId || null, t;
}
function yn(e, t = gn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Si(-1);
		let i = vn(t), a;
		try {
			a = e(...n);
		} finally {
			vn(i), r._d && Si(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function bn(e, n) {
	if (gn === null) return e;
	let r = ia(gn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Yt(o), i.push({
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
function xn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Fe(), Zt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ie());
	}
}
function Sn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function Cn(e, t, n = !1) {
	let r = Ui();
	if (r || Dr) {
		let i = Dr ? Dr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var wn = /* @__PURE__ */ Symbol.for("v-scx"), Tn = () => Cn(wn);
function En(e, t, n) {
	return Dn(e, t, n);
}
function Dn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Yi) {
		if (c === "sync") {
			let e = Tn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => Zt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		K(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : ln(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Jt(e, n, u);
	return Yi && (f ? f.push(h) : d && h()), h;
}
function On(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? kn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Ki(this), s = Dn(i, a.bind(r), n);
	return o(), s;
}
function kn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var An = /* @__PURE__ */ Symbol("_vte"), jn = (e) => e.__isTeleport, Mn = /* @__PURE__ */ Symbol("_leaveCb");
function Nn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Nn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Pn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Fn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var In = /* @__PURE__ */ new WeakMap();
function Ln(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Ln(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (zn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Ln(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? ia(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ V(v), b = v === t ? i : (e) => !Fn(_, e) && u(y, e), x = (e, t) => !(t && Fn(_, t));
	if (m != null && m !== p) {
		if (Rn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ H(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Fe();
		try {
			Xt(p, f, 12, [l, _]);
		} finally {
			Ie();
		}
	} else {
		let t = g(p), n = /* @__PURE__ */ H(p);
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
					i(), In.delete(e);
				};
				t.id = -1, In.set(e, t), K(t, r);
			} else Rn(e), i();
		}
	}
}
function Rn(e) {
	let t = In.get(e);
	t && (t.flags |= 8, In.delete(e));
}
ie().requestIdleCallback, ie().cancelIdleCallback;
var zn = (e) => !!e.type.__asyncLoader, Bn = (e) => e.type.__isKeepAlive;
function Vn(e, t) {
	Un(e, "a", t);
}
function Hn(e, t) {
	Un(e, "da", t);
}
function Un(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Gn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Bn(e.parent.vnode) && Wn(r, t, n, e), e = e.parent;
	}
}
function Wn(e, t, n, r) {
	let i = Gn(t, e, r, !0);
	Qn(() => {
		c(r[t], i);
	}, n);
}
function Gn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Fe();
			let i = Ki(n), a = Zt(t, n, e, r);
			return i(), Ie(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Kn = (e) => (t, n = $) => {
	(!Yi || e === "sp") && Gn(e, (...e) => t(...e), n);
}, qn = Kn("bm"), Jn = Kn("m"), Yn = Kn("bu"), Xn = Kn("u"), Zn = Kn("bum"), Qn = Kn("um"), $n = Kn("sp"), er = Kn("rtg"), tr = Kn("rtc");
function nr(e, t = $) {
	Gn("ec", e, t);
}
var rr = /* @__PURE__ */ Symbol.for("v-ndc");
function ir(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ At(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Mt(e), s = /* @__PURE__ */ jt(e), e = Je(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? It(Ft(e[n])) : Ft(e[n]) : e[n], n, void 0, a && a[n]);
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
var ar = (e) => e ? Ji(e) ? ia(e) : ar(e.parent) : null, or = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ar(e.parent),
	$root: (e) => ar(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => hr(e),
	$forceUpdate: (e) => e.f ||= () => {
		ln(e.update);
	},
	$nextTick: (e) => e.n ||= sn.bind(e.proxy),
	$watch: (e) => On.bind(e)
}), sr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), cr = {
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
			else if (sr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else ur && (s[n] = 0);
		}
		let d = or[n], f, p;
		if (d) return n === "$attrs" && B(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return sr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || sr(n, c) || u(o, c) || u(i, c) || u(or, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function lr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var ur = !0;
function dr(e) {
	let t = hr(e), n = e.proxy, i = e.ctx;
	ur = !1, t.beforeCreate && pr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: j, components: ee, directives: M, filters: te } = t;
	if (u && fr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Et(t));
	}
	if (ur = !0, o) for (let e in o) {
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
	if (c) for (let e in c) mr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Sn(t, e[t]);
		});
	}
	f && pr(f, e, "c");
	function N(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (N(qn, p), N(Jn, m), N(Yn, g), N(Xn, _), N(Vn, y), N(Hn, b), N(nr, O), N(tr, E), N(er, D), N(Zn, S), N(Qn, w), N($n, k), d(A)) if (A.length) {
		let t = e.exposed ||= {};
		A.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), j != null && (e.inheritAttrs = j), ee && (e.components = ee), M && (e.directives = M), k && Pn(e);
}
function fr(e, t, n = r) {
	d(e) && (e = br(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? Cn(r.from || n, r.default, !0) : Cn(r.from || n) : Cn(r), /* @__PURE__ */ H(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function pr(e, t, n) {
	Zt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function mr(e, t, n, r) {
	let i = r.includes(".") ? kn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && En(i, n);
	} else if (h(e)) En(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => mr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && En(i, r, e);
	}
}
function hr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => gr(c, e, o, !0)), gr(c, t, o)), v(t) && a.set(t, c), c;
}
function gr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && gr(e, a, n, !0), i && i.forEach((t) => gr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = _r[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var _r = {
	data: vr,
	props: Sr,
	emits: Sr,
	methods: xr,
	computed: xr,
	beforeCreate: G,
	created: G,
	beforeMount: G,
	mounted: G,
	beforeUpdate: G,
	updated: G,
	beforeDestroy: G,
	beforeUnmount: G,
	destroyed: G,
	unmounted: G,
	activated: G,
	deactivated: G,
	errorCaptured: G,
	serverPrefetch: G,
	components: xr,
	directives: xr,
	watch: Cr,
	provide: vr,
	inject: yr
};
function vr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function yr(e, t) {
	return xr(br(e), br(t));
}
function br(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function G(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function xr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Sr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), lr(e), lr(t ?? {})) : t;
}
function Cr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = G(e[r], t[r]);
	return n;
}
function wr() {
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
var Tr = 0;
function Er(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = wr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Tr++,
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
				c && (Zt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Dr;
				Dr = l;
				try {
					return e();
				} finally {
					Dr = t;
				}
			}
		};
		return l;
	};
}
var Dr = null, Or = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${A(t)}Modifiers`];
function kr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Or(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(ne)));
	let c, l = i[c = ee(n)] || i[c = ee(O(n))];
	!l && o && (l = i[c = ee(A(n))]), l && Zt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Zt(u, e, 6, a);
	}
}
var Ar = /* @__PURE__ */ new WeakMap();
function jr(e, t, n = !1) {
	let r = n ? Ar : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = jr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Mr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, A(t)) || u(e, t));
}
function Nr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = vn(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : Pr(c);
		}
	} catch (t) {
		yi.length = 0, Qt(t, e, 1), v = ki(_i);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Fr(y, a)), b = Mi(b, y, !1, !0));
	}
	return n.dirs && (b = Mi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Nn(b, n.transition), v = b, vn(_), v;
}
var Pr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Fr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Ir(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Lr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Rr(o, r, n) && !Mr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Lr(r, o, l) : !!o;
	return !1;
}
function Lr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Rr(t, e, a) && !Mr(n, a)) return !0;
	}
	return !1;
}
function Rr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !fe(r, i) : r !== i;
}
function zr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Br = {}, Vr = () => Object.create(Br), Hr = (e) => Object.getPrototypeOf(e) === Br;
function Ur(e, t, n, r = !1) {
	let i = {}, a = Vr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Gr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Dt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Wr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ V(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Mr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = O(o);
					i[t] = Kr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Gr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = A(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Kr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ke(e.attrs, "set", "");
}
function Gr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = O(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Mr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ V(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Kr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Kr(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === A(n)) && (r = !0));
	}
	return r;
}
var qr = /* @__PURE__ */ new WeakMap();
function Jr(e, r, i = !1) {
	let a = i ? qr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Jr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = O(c[e]);
		Yr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = O(e);
		if (Yr(t)) {
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
function Yr(e) {
	return e[0] !== "$" && !T(e);
}
var Xr = (e) => e === "_" || e === "_ctx" || e === "$stable", Zr = (e) => d(e) ? e.map(Fi) : [Fi(e)], Qr = (e, t, n) => {
	if (t._n) return t;
	let r = yn((...e) => Zr(t(...e)), n);
	return r._c = !1, r;
}, $r = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Xr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Qr(n, i, r);
		else if (i != null) {
			let e = Zr(i);
			t[n] = () => e;
		}
	}
}, ei = (e, t) => {
	let n = Zr(t);
	e.slots.default = () => n;
}, ti = (e, t, n) => {
	for (let r in t) (n || !Xr(r)) && (e[r] = t[r]);
}, ni = (e, t, n) => {
	let r = e.slots = Vr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ti(r, t, n), n && N(r, "_", e, !0)) : $r(t, r);
	} else t && ei(e, t);
}, ri = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ti(a, n, r) : (o = !n.$stable, $r(n, a)), s = n;
	} else n && (ei(e, n), s = { default: 1 });
	if (o) for (let e in a) !Xr(e) && s[e] == null && delete a[e];
}, K = hi;
function ii(e) {
	return ai(e);
}
function ai(e, i) {
	let a = ie();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ei(e, t) && (r = fe(e), I(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case gi:
				y(e, t, n, r);
				break;
			case _i:
				b(e, t, n, r);
				break;
			case vi:
				e ?? x(t, n, r, o);
				break;
			case q:
				ee(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? M(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, L);
		}
		u != null && i ? Ln(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Ln(e.ref, null, a, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) E(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, oi(e, a), s, u), _ && xn(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && zi(f, r, e);
		}
		_ && xn(e, null, r, "beforeMount");
		let v = ci(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && zi(f, r, e), v && g.enter(d), _ && xn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || mi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ii(e[l]) : Fi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && si(r, !1), (g = h.onVnodeBeforeUpdate) && zi(g, r, n, e), f && xn(n, e, r, "beforeUpdate"), r && si(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, r, i, oi(n, a), o) : s || oe(e, n, l, null, r, i, oi(n, a), o, !1), u > 0) {
			if (u & 16) j(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && j(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && zi(g, r, n, e), f && xn(n, e, r, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === q || !Ei(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, j = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ee = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && li(e, t, !0)) : oe(e, t, n, f, i, a, s, c, l);
	}, M = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : N(t, n, r, i, a, o, c) : ne(e, t, c);
	}, N = (e, t, n, r, i, a, o) => {
		let s = e.component = Hi(e, r, i);
		if (Bn(e) && (s.ctx.renderer = L), Xi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, re, o), !e.el) {
				let r = s.subTree = ki(_i);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else re(s, e, t, n, i, a, o);
	}, ne = (e, t, n) => {
		let r = t.component = e.component;
		if (Ir(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			ae(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, re = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = di(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				si(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && te(n), (d = t.props && t.props.onVnodeBeforeUpdate) && zi(d, s, t, c), si(e, !0);
				let f = Nr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), fe(p), e, i, a), t.el = f.el, u === null && zr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = zn(t);
				if (si(e, !1), l && te(l), !m && (o = c && c.onVnodeBeforeMount) && zi(o, d, t), si(e, !0), s && ge) {
					let t = () => {
						e.subTree = Nr(e), ge(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Nr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => zi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && zn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new be(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => ln(u), si(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Wr(e, t.props, r, n), ri(e, t.children, n), Fe(), fn(e), Ie();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				F(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				P(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && de(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? F(l, d, n, r, i, a, o, s, c) : de(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, P = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ii(t[p]) : Fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? de(e, a, o, !0, !1, f) : O(t, r, i, a, o, s, c, l, f);
	}, F = (e, t, r, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) I(e[u], a, o, !0), u++;
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
					I(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ei(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? I(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? ui(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || pi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? se(n, r, p, 2) : _--);
			}
		}
	}, se = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			se(e.component.subTree, t, n, r);
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
		if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) se(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === vi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Mn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Mn];
				a._isLeaving && a[Mn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, I = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Fe(), Ln(s, null, n, e, !0), Ie()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !zn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && zi(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && xn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, L, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && de(c, t, n), r && ce(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && zi(_, t, e), h && xn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ce = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === q) {
			le(n, r);
			return;
		}
		if (t === vi) {
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
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		fi(c), fi(l), r && te(r), i.stop(), a && (a.flags |= 8, I(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) I(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[An];
		return n ? h(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (I(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, fn(r), pn(), !1);
	}, L = {
		p: v,
		um: I,
		m: se,
		r: ce,
		mt: N,
		mc: O,
		pc: oe,
		pbc: A,
		n: fe,
		o: e
	}, he, ge;
	return i && ([he, ge] = i(L)), {
		render: me,
		hydrate: he,
		createApp: Er(me, he)
	};
}
function oi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function si({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ci(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function li(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ii(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && li(t, a)), a.type === gi && (a.patchFlag === -1 && (a = i[e] = Ii(a)), a.el = t.el), a.type === _i && !a.el && (a.el = t.el);
	}
}
function ui(e) {
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
function di(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : di(t);
}
function fi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function pi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? pi(t.subTree) : null;
}
var mi = (e) => e.__isSuspense;
function hi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : dn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), gi = /* @__PURE__ */ Symbol.for("v-txt"), _i = /* @__PURE__ */ Symbol.for("v-cmt"), vi = /* @__PURE__ */ Symbol.for("v-stc"), yi = [], J = null;
function Y(e = !1) {
	yi.push(J = e ? null : []);
}
function bi() {
	yi.pop(), J = yi[yi.length - 1] || null;
}
var xi = 1;
function Si(e, t = !1) {
	xi += e, e < 0 && J && t && (J.hasOnce = !0);
}
function Ci(e) {
	return e.dynamicChildren = xi > 0 ? J || n : null, bi(), xi > 0 && J && J.push(e), e;
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
var Di = ({ key: e }) => e ?? null, Oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ H(e) || h(e) ? {
	i: gn,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Di(t),
		ref: t && Oi(t),
		scopeId: _n,
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
		ctx: gn
	};
	return s ? (Li(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), xi > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var ki = Ai;
function Ai(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === rr) && (e = _i), Ti(e)) {
		let r = Mi(e, t, !0);
		return n && Li(r, n), xi > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (aa(e) && (e = e.__vccOpts), t) {
		t = ji(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = I(e)), v(n) && (/* @__PURE__ */ Nt(n) && !d(n) && (n = s({}, n)), t.style = ae(n));
	}
	let o = g(e) ? 1 : mi(e) ? 128 : jn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function ji(e) {
	return e ? /* @__PURE__ */ Nt(e) || Hr(e) ? s({}, e) : e : null;
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
		patchFlag: t && e.type !== q ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Nn(u, c.clone(u)), u;
}
function Ni(e = " ", t = 0) {
	return ki(gi, null, e, t);
}
function Pi(e, t) {
	let n = ki(vi, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (Y(), wi(_i, null, e)) : ki(_i, null, e);
}
function Fi(e) {
	return e == null || typeof e == "boolean" ? ki(_i) : d(e) ? ki(q, null, e.slice()) : Ti(e) ? Ii(e) : ki(gi, null, String(e));
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
		!r && !Hr(t) ? t._ctx = gn : r === 3 && gn && (gn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Li(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: gn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ni(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ri(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = I([t.class, r.class]));
		else if (e === "style") t.style = ae([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function zi(e, t, n, r = null) {
	Zt(e, t, 7, [n, r]);
}
var Bi = wr(), Vi = 0;
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
		propsOptions: Jr(i, a),
		emitsOptions: jr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = kr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Ui = () => $ || gn, Wi, Gi;
{
	let e = ie(), t = (t, n) => {
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
	Ur(e, r, a, t), ni(e, i, n || t);
	let o = a ? Zi(e, t) : void 0;
	return t && Gi(!1), o;
}
function Zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, cr);
	let { setup: r } = n;
	if (r) {
		Fe();
		let n = e.setupContext = r.length > 1 ? ra(e) : null, i = Ki(e), a = Xt(r, e, 0, [e.props, n]), o = y(a);
		if (Ie(), i(), (o || e.sp) && !zn(e) && Pn(e), o) {
			if (a.then(qi, qi), t) return a.then((n) => {
				Qi(e, n, t);
			}).catch((t) => {
				Qt(t, e, 0);
			});
			e.asyncDep = a;
		} else Qi(e, a, t);
	} else ta(e, t);
}
function Qi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Vt(t)), ta(e, n);
}
var $i, ea;
function ta(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && $i && !i.render) {
			let t = i.template || hr(e).template;
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
		Fe();
		try {
			dr(e);
		} finally {
			Ie(), t();
		}
	}
}
var na = { get(e, t) {
	return B(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Vt(Pt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in or) return or[n](e);
		},
		has(e, t) {
			return t in e || t in or;
		}
	}) : e.proxy;
}
function aa(e) {
	return h(e) && "__vccOpts" in e;
}
var oa = (e, t) => /* @__PURE__ */ Ut(e, t, Yi), sa = "3.5.39", ca = void 0, la = typeof window < "u" && window.trustedTypes;
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
		Ca.test(n) ? e.setProperty(A(r), n.replace(Ca, ""), "important") : e[r] = n;
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
	let r = O(t);
	if (r !== "filter" && r in e) return Ea[t] = r;
	r = j(r);
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
function Aa(e, t, n, r, i, a = le(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ka, t.slice(6, t.length)) : e.setAttributeNS(ka, t, n) : n == null || a && !ue(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = ue(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : A(e.slice(2)), t];
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
				e && Zt(e, t, 5, a);
			}
		} else Zt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Va(), n;
}
var Ua = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Wa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? _a(e, r, c) : t === "style" ? Sa(e, n, r) : a(t) ? o(t) || Fa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Ga(e, t, r, c)) ? (ja(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Aa(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ka(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ja(e, O(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Aa(e, t, r, c));
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
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var qa = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => te(t, e) : t;
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
	return t && (e = e.trim()), n && (e = ne(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ne(e.value) : e.value, c = t ?? "";
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
		i = fe(t, no(e, !0));
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
	return so ||= ii(oo);
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
		backgroundImage: "",
		backgroundImageName: "",
		textColor: "#172033",
		accentColor: "#156b5b",
		ctaColor: "#156b5b",
		ctaShape: "round",
		ctaVariant: "fill",
		fontFamily: "Inter, Pretendard, sans-serif"
	},
	responsive: {
		contentMaxWidth: 1440,
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
], jo = {
	key: 1,
	class: "rendered-image"
}, Mo = ["src", "alt"], No = {
	key: 1,
	class: "rendered-image__placeholder"
}, Po = { key: 2 }, Fo = {
	key: 0,
	class: "rendered-text"
}, Io = {
	key: 1,
	class: "rendered-empty"
}, Lo = [
	"aria-label",
	"title",
	"onPointerdown"
], Ro = {
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
			return /^https?:\/\//i.test(t) ? t : "";
		}
		function s(e) {
			return Co(e?.link);
		}
		function c(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function l(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function u(e, t) {
			return n.designSpec?.itemStyles?.[l(e, t)] || {};
		}
		function d(e) {
			return n.designSpec?.sectionStyles?.[e.sectionKey] || {};
		}
		function f(e) {
			return e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
		}
		function p(e) {
			return Math.max(180, (e.items || []).reduce((e, t) => e + f(t), 0) + 52);
		}
		function m(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((e, t) => e + f(t), 0), a = d(e).minHeight || p(e), o = Math.max(50, a - 76);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function h(e) {
			let t = d(e).minHeight || p(e);
			return { height: `${Math.max(50, t)}px` };
		}
		function g(e) {
			let t = d(e).minHeight || p(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function _(e, t) {
			let n = u(e, t), r = n.positionMode === "free" ? n : m(e, t);
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
				textAlign: n.textAlign
			};
		}
		function v(e, t) {
			n.editable && r("select-item", e, t);
		}
		function y(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), v(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
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
		function b(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "text") return;
			e.preventDefault(), e.stopPropagation(), v(t, i);
			let o = e.currentTarget, s = o.querySelector(".rendered-text, .rendered-empty");
			if (!s) return;
			o.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", String(a(t, i) || "").trim() || (s.textContent = _o), s.focus();
			let c = window.getSelection(), l = document.createRange();
			l.selectNodeContents(s), c.removeAllRanges(), c.addRange(l);
			let u = () => {
				let e = s.textContent.trim() || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
				r("update-item-content", t, i, e), s.contentEditable = "false", o.classList.remove("is-editing"), s.removeEventListener("blur", u), s.removeEventListener("keydown", d);
			}, d = (e) => {
				e.key === "Escape" && (e.preventDefault(), s.blur());
			};
			s.addEventListener("blur", u), s.addEventListener("keydown", d);
		}
		function x(e, t) {
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
			class: I(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-editor-guides": e.editable && e.showGuides
			}]),
			style: ae({
				"--promo-bg": e.designSpec.theme.backgroundColor,
				"--promo-bg-image": e.designSpec.theme.backgroundImage ? `url(${JSON.stringify(e.designSpec.theme.backgroundImage)})` : "none",
				"--promo-ink": e.designSpec.theme.textColor,
				"--promo-accent": e.designSpec.theme.accentColor,
				"--promo-cta": e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor,
				"--promo-cta-bg": e.designSpec.theme.ctaVariant === "ghost" ? "transparent" : e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor,
				"--promo-cta-ink": e.designSpec.theme.ctaVariant === "ghost" ? e.designSpec.theme.ctaColor || e.designSpec.theme.accentColor : "#ffffff",
				"--promo-cta-radius": e.designSpec.theme.ctaShape === "round" ? "999px" : "2px",
				"--promo-font": e.designSpec.theme.fontFamily,
				"--promo-width": `${e.designSpec.responsive.contentMaxWidth}px`,
				"--promo-min-width": `${e.designSpec.responsive.contentMinWidth || 0}px`
			})
		}, [e.editable && e.showGuides ? (Y(), X("div", Eo)) : Q("", !0), (Y(!0), X(q, null, ir(i.value, (t) => (Y(), X("section", {
			key: t.sectionKey,
			class: I(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: ae(h(t))
		}, [Z("div", Oo, [Z("div", {
			class: "rendered-items",
			style: ae(g(t))
		}, [(Y(!0), X(q, null, ir(t.items, (n) => (Y(), X("article", {
			key: n.itemKey,
			class: I(["rendered-item", [`rendered-item--${n.fieldKind || "text"}`, {
				"is-editable": e.editable && !n.isLocked,
				"is-selected": e.editable && e.selectedItemKey === l(t, n),
				"is-free-positioned": !0
			}]]),
			"data-item-key": n.itemKey,
			"data-style-key": l(t, n),
			style: ae(_(t, n)),
			onClick: ao((e) => v(t, n), ["stop"]),
			onPointerdown: (e) => y(e, t, n),
			onDblclick: (e) => b(e, t, n)
		}, [n.fieldKind === "cta" ? (Y(), X("a", {
			key: 0,
			class: "rendered-cta",
			href: s(a(t, n)),
			target: a(t, n)?.target || "_self",
			rel: a(t, n)?.target === "_blank" ? "noopener noreferrer" : void 0
		}, L(a(t, n)?.label || n.name), 9, Ao)) : n.fieldKind === "image" ? (Y(), X("figure", jo, [o(a(t, n)) ? (Y(), X("img", {
			key: 0,
			src: o(a(t, n)),
			alt: a(t, n)?.alt || n.name
		}, null, 8, Mo)) : (Y(), X("div", No, [Z("span", null, L(n.name), 1), Z("small", null, L(a(t, n)?.value || "이미지 준비 중"), 1)])), a(t, n)?.description ? (Y(), X("figcaption", Po, L(a(t, n).description), 1)) : Q("", !0)])) : (Y(), X(q, { key: 2 }, [c(a(t, n)) ? (Y(), X("p", Fo, L(a(t, n)), 1)) : (Y(), X("p", Io, L(n.name), 1))], 64))], 46, ko))), 128))], 4)]), e.editable && e.showGuides ? (Y(), X("button", {
			key: 0,
			class: "section-resize-handle",
			type: "button",
			"aria-label": `${t.name} 섹션 높이 조절`,
			title: `${t.name} 섹션 높이 조절`,
			onPointerdown: (e) => x(e, t)
		}, null, 40, Lo)) : Q("", !0)], 14, Do))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/layout-utils.mjs
function zo(e) {
	return JSON.parse(JSON.stringify(e));
}
function Bo(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = Bo(n[e], t) : n[e] = zo(t));
	}), n;
}
function Vo(e = {}) {
	return Ho(go, e);
}
function Ho(e = go, t = {}) {
	let n = Bo(zo(e || go), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, n.sectionStyles = n.sectionStyles || {}, n;
}
function Uo(e = {}) {
	let t = Vo(e), n = [], r = /* @__PURE__ */ new Set([
		"left",
		"center",
		"right"
	]);
	return Object.entries(t.sectionStyles).forEach(([e, t]) => {
		let r = Number(t?.minHeight);
		t?.minHeight !== void 0 && (!Number.isFinite(r) || r < 50 || r > 1200) && n.push({
			path: `sectionStyles.${e}.minHeight`,
			message: "Section height must be between 50 and 1200."
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
	}), {
		ok: n.length === 0,
		errors: n,
		spec: t
	};
}
//#endregion
//#region visual-editor/src/App.vue
var Wo = {
	key: 0,
	class: "output-shell"
}, Go = { class: "output-toolbar" }, Ko = {
	key: 0,
	class: "system-message system-message--error"
}, qo = {
	key: 1,
	class: "editor-shell"
}, Jo = {
	key: 0,
	class: "shell-header editor-shell-header"
}, Yo = { class: "shell-header__identity" }, Xo = { class: "shell-header__brand-row" }, Zo = { class: "shell-header__page-label" }, Qo = { class: "shell-header__actions" }, $o = {
	class: "shell-status",
	role: "status"
}, es = { class: "editor-header editor-toolbar" }, ts = { class: "editor-global-actions" }, ns = { class: "global-token-menu" }, rs = { class: "global-token-swatches" }, is = [
	"title",
	"aria-label",
	"onClick"
], as = { class: "background-image-control" }, os = { class: "background-image-button" }, ss = {
	key: 0,
	class: "background-image-name"
}, cs = {
	key: 2,
	class: "background-image-error"
}, ls = { "aria-label": "Visual Editor navigation" }, us = ["disabled"], ds = ["disabled"], fs = {
	key: 1,
	class: "system-message"
}, ps = {
	key: 2,
	class: "system-message system-message--error"
}, ms = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, hs = {
	key: 4,
	class: "system-message",
	role: "status"
}, gs = {
	key: 5,
	class: "editor-workspace"
}, _s = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, vs = { class: "panel-heading" }, ys = { class: "section-list" }, bs = ["aria-expanded", "onClick"], xs = { class: "section-accordion__body" }, Ss = { class: "section-accordion__items" }, Cs = ["onClick"], ws = { key: 0 }, Ts = { class: "preview-panel" }, Es = { class: "preview-toolbar" }, Ds = { class: "preview-controls" }, Os = { class: "guide-toggle" }, ks = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, As = { class: "property-panel" }, js = { class: "panel-heading" }, Ms = {
	key: 0,
	class: "property-form"
}, Ns = { key: 0 }, Ps = ["disabled", "value"], Fs = { key: 1 }, Is = ["disabled", "value"], Ls = ["disabled", "value"], Rs = ["value"], zs = ["disabled", "value"], Bs = { key: 0 }, Vs = ["disabled", "value"], Hs = { key: 1 }, Us = ["disabled", "value"], Ws = { key: 3 }, Gs = ["disabled"], Ks = ["disabled"], qs = { class: "item-meta" }, Js = { class: "design-controls" }, Ys = { class: "design-controls__heading" }, Xs = ["disabled"], Zs = ["disabled", "value"], Qs = { class: "range-field" }, $s = ["disabled", "value"], ec = ["disabled", "value"], tc = ["disabled", "value"], nc = { class: "position-status" }, rc = { key: 0 }, ic = { key: 1 }, ac = ["disabled"], oc = { class: "section-size-control" }, sc = ["disabled"], cc = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ U(t.mode !== "output"), r = /* @__PURE__ */ U(""), i = /* @__PURE__ */ U([]), a = /* @__PURE__ */ U(null), o = /* @__PURE__ */ U(""), s = /* @__PURE__ */ U([]), c = /* @__PURE__ */ U({}), l = /* @__PURE__ */ U(JSON.parse(JSON.stringify(go))), u = /* @__PURE__ */ U(""), d = /* @__PURE__ */ U(""), f = /* @__PURE__ */ U(""), p = /* @__PURE__ */ U("desktop"), m = /* @__PURE__ */ U(!0), h = /* @__PURE__ */ U(""), g = /* @__PURE__ */ U(""), _ = /* @__PURE__ */ U(null), v = /* @__PURE__ */ U(1), y = /* @__PURE__ */ U(null), b = /* @__PURE__ */ U(""), x = /* @__PURE__ */ U(!1), S = /* @__PURE__ */ U(""), C = /* @__PURE__ */ U(!1), w = !1, T = oa(() => t.mode === "admin-layout"), E = oa(() => t.mode === "wizard-layout"), D = oa(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), O = oa(() => D.value?.items?.find((e) => e.itemKey === d.value) || D.value?.items?.[0]), k = oa({
			get: () => c.value?.[D.value?.sectionKey]?.[O.value?.itemKey],
			set: (e) => te(e)
		}), A = oa(() => a.value ? xo({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), j = oa(() => t.mode === "output" ? _.value : A.value);
		function ee(e, t) {
			e && (u.value = e.sectionKey, d.value = t?.itemKey || "");
		}
		function M(e) {
			if (e) {
				if (f.value === e.sectionKey) {
					f.value = "";
					return;
				}
				f.value = e.sectionKey, ee(e, e.items?.[0]);
			}
		}
		function te(e) {
			!D.value || !O.value || (c.value = {
				...c.value,
				[D.value.sectionKey]: {
					...c.value[D.value.sectionKey],
					[O.value.itemKey]: e
				}
			});
		}
		function N(e, t) {
			te({
				...k.value || {},
				[e]: t
			});
		}
		function ne(e, t, n) {
			ee(e, t), !(t.fieldKind !== "text" || t.isLocked) && te(n);
		}
		function re(e) {
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
		function ie(e) {
			let t = e.target.files?.[0];
			if (e.target.value = "", !t) return;
			if (h.value = "", !t.type.startsWith("image/")) {
				h.value = "이미지 파일만 첨부할 수 있습니다.";
				return;
			}
			if (t.size > 3 * 1024 * 1024) {
				h.value = "배경 이미지는 3MB 이하 파일을 사용해주세요.";
				return;
			}
			let n = new FileReader();
			n.onload = () => {
				g.value = "", l.value = {
					...l.value,
					theme: {
						...l.value.theme,
						backgroundImage: String(n.result || ""),
						backgroundImageName: t.name
					}
				};
			}, n.onerror = () => {
				h.value = "배경 이미지를 불러오지 못했습니다.";
			}, n.readAsDataURL(t);
		}
		function oe() {
			l.value = {
				...l.value,
				theme: {
					...l.value.theme,
					backgroundImage: "",
					backgroundImageName: ""
				}
			}, h.value = "", g.value = "";
		}
		let P = oa(() => D.value && O.value ? `${D.value.sectionKey}.${O.value.itemKey}` : ""), F = oa(() => l.value.itemStyles?.[P.value] || {}), se = oa(() => D.value && l.value.sectionStyles?.[D.value.sectionKey] || {});
		function ce(e) {
			!P.value || O.value?.isLocked || (l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[P.value]: {
						...F.value,
						...e
					}
				}
			});
		}
		function le(e, t, n) {
			if (!e || !t) return;
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
		function ue() {
			if (!P.value || O.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} };
			delete e[P.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function de() {
			if (!P.value || O.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} }, t = wo(e[P.value]);
			Object.keys(t).length ? e[P.value] = t : delete e[P.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function fe(e, t) {
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
		function pe() {
			if (!D.value) return;
			let e = { ...l.value.sectionStyles || {} }, t = { ...e[D.value.sectionKey] || {} };
			delete t.minHeight, Object.keys(t).length ? e[D.value.sectionKey] = t : delete e[D.value.sectionKey], l.value = {
				...l.value,
				sectionStyles: e
			};
		}
		async function me() {
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
		function he() {
			if (!A.value) return;
			g.value = "";
			let e = To(localStorage, mo, A.value);
			if (!e.ok) {
				g.value = e.message;
				return;
			}
			window.open("/prototype/visual-output.html", "_blank", "noopener");
		}
		async function ge() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error(n.message || n.error || "기본 레이아웃을 불러오지 못했습니다.");
				a.value = n.template, s.value = n.sections || [], c.value = bo(s.value), l.value = Vo(n.layout?.layoutSpec), v.value = Number(n.layout?.layoutRevision || 1), y.value = n.layout?.id || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = s.value[0]?.sectionKey || "";
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function R() {
			if (!a.value?.id || x.value) return;
			S.value = "";
			let e = Uo(l.value);
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
				l.value = Vo(n.layout.layoutSpec), v.value = Number(n.layout.layoutRevision || v.value + 1), y.value = n.layout.id || y.value, b.value = "", S.value = `기본 레이아웃을 저장했습니다. revision ${v.value}`;
			} catch (e) {
				S.value = e.message;
			} finally {
				x.value = !1;
			}
		}
		async function _e(e) {
			e?.content && (w = !0, a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, l.value = Vo(e.designSpec), v.value = Number(e.layoutRevision || 1), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = s.value[0]?.sectionKey || "", C.value = !0, n.value = !1, r.value = "", await sn(), w = !1);
		}
		function ve(e) {
			!E.value || e.origin !== window.location.origin || e.data?.type === "promo-wizard-layout-snapshot" && _e(e.data.snapshot);
		}
		En([l, c], () => {
			!E.value || !C.value || w || window.parent.postMessage({
				type: "promo-wizard-layout-change",
				designSpec: JSON.parse(JSON.stringify(l.value)),
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin);
		}, { deep: !0 });
		function z() {
			try {
				let e = localStorage.getItem(mo);
				if (!e) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
				_.value = JSON.parse(e);
			} catch (e) {
				r.value = e.message;
			}
		}
		return Jn(() => {
			window.PromoShell?.init(document), t.mode === "output" ? z() : T.value ? ge() : E.value ? (n.value = !0, window.addEventListener("message", ve), window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin)) : me();
		}), Zn(() => window.removeEventListener("message", ve)), (t, i) => e.mode === "output" ? (Y(), X("div", Wo, [Z("header", Go, [Z("div", null, [i[16] ||= Z("span", null, "WEB OUTPUT", -1), Z("strong", null, L(j.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[17] ||= Z("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (Y(), X("div", Ko, L(r.value), 1)) : j.value ? (Y(), wi(Ro, {
			key: 1,
			content: j.value.content,
			"design-spec": j.value.designSpec,
			assets: j.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Q("", !0)])) : (Y(), X("main", qo, [
			E.value ? Q("", !0) : (Y(), X("header", Jo, [Z("div", Yo, [Z("div", Xo, [i[18] ||= Z("h1", { class: "shell-header__brand" }, "PROMO WEB BUILDER", -1), Z("span", Zo, L(T.value ? "Admin Template Layout" : "Visual Editor"), 1)])]), Z("div", Qo, [i[19] ||= Pi("<nav class=\"shell-nav\" aria-label=\"프로토타입 내비게이션\"><a href=\"/prototype/index.html\">프로모션 빌더</a><a href=\"/prototype/index.html?view=admin&amp;tab=promo-form\">관리자 페이지</a><a href=\"/promo-wizard.html\">Promo Wizard</a><a href=\"/create-promo.html\">Create Promo</a><a class=\"active\" href=\"/prototype/visual-editor.html\" aria-current=\"page\">Visual Editor</a><a href=\"/prototype/generated.html\">생성된 UI</a></nav><button class=\"shell-theme-toggle\" type=\"button\" data-shell-theme-toggle><span class=\"shell-theme-dot\" aria-hidden=\"true\"></span><strong data-shell-theme-label>Light</strong></button>", 2), Z("div", $o, L(T.value ? `Layout revision ${v.value}` : "편집 준비"), 1)])])),
			Z("header", es, [Z("div", null, [Z("span", null, L(T.value ? "ADMIN TEMPLATE LAYOUT" : E.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1), Z("h2", null, L(a.value?.name || "Default Renderer"), 1)]), Z("div", ts, [
				Z("fieldset", ns, [i[20] ||= Z("legend", null, "페이지 배경", -1), Z("div", rs, [(Y(!0), X(q, null, ir(zt(ho), (e) => (Y(), X("button", {
					key: e.key,
					type: "button",
					class: I({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => re(e)
				}, [Z("i", { style: ae({ backgroundColor: e.value }) }, null, 4)], 10, is))), 128))])]),
				Z("div", as, [
					Z("label", os, [Z("input", {
						type: "file",
						accept: "image/*",
						onChange: ie
					}, null, 32), Z("span", null, L(l.value.theme.backgroundImage ? "배경 이미지 교체" : "배경 이미지 첨부"), 1)]),
					l.value.theme.backgroundImageName ? (Y(), X("span", ss, L(l.value.theme.backgroundImageName), 1)) : Q("", !0),
					l.value.theme.backgroundImage ? (Y(), X("button", {
						key: 1,
						type: "button",
						class: "background-image-remove",
						onClick: oe
					}, "제거")) : Q("", !0),
					h.value ? (Y(), X("small", cs, L(h.value), 1)) : Q("", !0)
				]),
				Z("nav", ls, [T.value ? (Y(), X(q, { key: 0 }, [bn(Z("input", {
					"onUpdate:modelValue": i[0] ||= (e) => b.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[Qa, b.value]]), Z("button", {
					type: "button",
					disabled: !A.value || x.value,
					onClick: R
				}, L(x.value ? "저장 중" : "기본 레이아웃 저장"), 9, us)], 64)) : E.value ? Q("", !0) : (Y(), X("button", {
					key: 1,
					type: "button",
					disabled: !A.value,
					onClick: he
				}, "Web Output 열기", 8, ds))])
			])]),
			n.value ? (Y(), X("div", fs, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (Y(), X("div", ps, L(r.value), 1)) : Q("", !0),
			g.value ? (Y(), X("div", ms, L(g.value), 1)) : Q("", !0),
			S.value ? (Y(), X("div", hs, L(S.value), 1)) : Q("", !0),
			!n.value && !r.value ? (Y(), X("section", gs, [
				Z("aside", _s, [Z("div", vs, [i[21] ||= Z("span", null, "SECTIONS", -1), Z("strong", null, L(s.value.length), 1)]), Z("div", ys, [(Y(!0), X(q, null, ir(s.value, (e) => (Y(), X("div", {
					key: e.sectionKey,
					class: I(["section-accordion", { open: e.sectionKey === f.value }])
				}, [Z("button", {
					type: "button",
					class: I(["section-trigger", { active: e.sectionKey === D.value?.sectionKey }]),
					"aria-expanded": e.sectionKey === f.value,
					onClick: (t) => M(e)
				}, [
					Z("span", null, L(e.name), 1),
					Z("small", null, L(e.items?.length || 0) + " items", 1),
					i[22] ||= Z("i", { "aria-hidden": "true" }, null, -1)
				], 10, bs), Z("div", xs, [Z("div", Ss, [(Y(!0), X(q, null, ir(e.items || [], (t) => (Y(), X("button", {
					key: t.itemKey,
					type: "button",
					class: I({ active: e.sectionKey === D.value?.sectionKey && t.itemKey === O.value?.itemKey }),
					onClick: (n) => ee(e, t)
				}, L(t.name), 11, Cs))), 128)), e.items?.length ? Q("", !0) : (Y(), X("span", ws, "등록된 아이템 없음"))])])], 2))), 128))])]),
				Z("section", Ts, [Z("div", Es, [Z("div", null, [i[23] ||= Z("strong", null, "Live Preview", -1), Z("small", null, L(a.value.templateKey) + " · v" + L(a.value.version), 1)]), Z("div", Ds, [Z("label", Os, [
					bn(Z("input", {
						"onUpdate:modelValue": i[1] ||= (e) => m.value = e,
						type: "checkbox"
					}, null, 512), [[$a, m.value]]),
					i[24] ||= Z("span", null, "Guides", -1),
					Z("strong", null, L(m.value ? "ON" : "OFF"), 1)
				]), Z("div", ks, [Z("button", {
					type: "button",
					class: I({ active: p.value === "desktop" }),
					onClick: i[2] ||= (e) => p.value = "desktop"
				}, "Desktop", 2), Z("button", {
					type: "button",
					class: I({ active: p.value === "mobile" }),
					onClick: i[3] ||= (e) => p.value = "mobile"
				}, "Mobile", 2)])])]), Z("div", { class: I(["preview-stage", `preview-stage--${p.value}`]) }, [j.value ? (Y(), wi(Ro, {
					key: 0,
					content: j.value.content,
					"design-spec": j.value.designSpec,
					assets: j.value.assets,
					editable: "",
					"show-guides": m.value,
					"selected-item-key": P.value,
					onSelectItem: ee,
					onUpdateItemStyle: ce,
					onUpdateRendererItemStyle: le,
					onUpdateItemContent: ne,
					onUpdateSectionStyle: fe
				}, null, 8, [
					"content",
					"design-spec",
					"assets",
					"show-guides",
					"selected-item-key"
				])) : Q("", !0)], 2)]),
				Z("aside", As, [Z("div", js, [i[25] ||= Z("span", null, "CONTENT", -1), Z("strong", null, L(O.value?.name || "항목 선택"), 1)]), O.value ? (Y(), X("div", Ms, [
					O.value.fieldKind === "cta" ? (Y(), X("label", Ns, [i[26] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
						disabled: O.value.isLocked,
						value: k.value?.label,
						onInput: i[4] ||= (e) => N("label", e.target.value)
					}, null, 40, Ps)])) : Q("", !0),
					O.value.fieldKind === "cta" ? (Y(), X("label", Fs, [i[27] ||= Z("span", null, "버튼 URL", -1), Z("input", {
						disabled: O.value.isLocked,
						type: "url",
						value: k.value?.link,
						onInput: i[5] ||= (e) => N("link", e.target.value)
					}, null, 40, Is)])) : O.value.fieldKind === "image" ? (Y(), X(q, { key: 2 }, [
						Z("label", null, [i[28] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
							disabled: O.value.isLocked,
							value: k.value?.source,
							onChange: i[6] ||= (e) => N("source", e.target.value)
						}, [(Y(!0), X(q, null, ir(O.value.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
							key: e,
							value: e
						}, L(e), 9, Rs))), 128))], 40, Ls)]),
						Z("label", null, [i[29] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
							disabled: O.value.isLocked,
							rows: "4",
							value: k.value?.value,
							onInput: i[7] ||= (e) => N("value", e.target.value)
						}, null, 40, zs)]),
						O.value.image?.descriptionEnabled ? (Y(), X("label", Bs, [i[30] ||= Z("span", null, "설명", -1), Z("textarea", {
							disabled: O.value.isLocked,
							rows: "3",
							value: k.value?.description,
							onInput: i[8] ||= (e) => N("description", e.target.value)
						}, null, 40, Vs)])) : Q("", !0),
						O.value.image?.altTextRequired ? (Y(), X("label", Hs, [i[31] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
							disabled: O.value.isLocked,
							value: k.value?.alt,
							onInput: i[9] ||= (e) => N("alt", e.target.value)
						}, null, 40, Us)])) : Q("", !0)
					], 64)) : (Y(), X("label", Ws, [Z("span", null, L(O.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), O.value.textType === "multi" ? bn((Y(), X("textarea", {
						key: 0,
						"onUpdate:modelValue": i[10] ||= (e) => k.value = e,
						disabled: O.value.isLocked,
						rows: "8"
					}, null, 8, Gs)), [[Qa, k.value]]) : bn((Y(), X("input", {
						key: 1,
						"onUpdate:modelValue": i[11] ||= (e) => k.value = e,
						disabled: O.value.isLocked
					}, null, 8, Ks)), [[Qa, k.value]])])),
					Z("dl", qs, [
						Z("div", null, [i[32] ||= Z("dt", null, "Item key", -1), Z("dd", null, L(O.value.itemKey), 1)]),
						Z("div", null, [i[33] ||= Z("dt", null, "필수", -1), Z("dd", null, L(O.value.isRequired ? "Y" : "N"), 1)]),
						Z("div", null, [i[34] ||= Z("dt", null, "고정", -1), Z("dd", null, L(O.value.isLocked ? "Y" : "N"), 1)])
					]),
					Z("section", Js, [
						Z("div", Ys, [i[35] ||= Z("strong", null, "DESIGN", -1), Z("button", {
							type: "button",
							disabled: O.value.isLocked,
							onClick: ue
						}, "초기화", 8, Xs)]),
						Z("label", null, [i[36] ||= Z("span", null, "글자 색상", -1), Z("input", {
							type: "color",
							disabled: O.value.isLocked,
							value: F.value.color || "#172033",
							onInput: i[12] ||= (e) => ce({ color: e.target.value })
						}, null, 40, Zs)]),
						Z("label", null, [i[37] ||= Z("span", null, "폰트 크기", -1), Z("div", Qs, [Z("input", {
							type: "range",
							min: "10",
							max: "80",
							step: "1",
							disabled: O.value.isLocked,
							value: F.value.fontSize || 18,
							onInput: i[13] ||= (e) => ce({ fontSize: Number(e.target.value) })
						}, null, 40, $s), Z("output", null, L(F.value.fontSize || 18) + "px", 1)])]),
						Z("label", null, [i[39] ||= Z("span", null, "폰트 굵기", -1), Z("select", {
							disabled: O.value.isLocked,
							value: F.value.fontWeight || 400,
							onChange: i[14] ||= (e) => ce({ fontWeight: Number(e.target.value) })
						}, [...i[38] ||= [
							Z("option", { value: 400 }, "Regular", -1),
							Z("option", { value: 500 }, "Medium", -1),
							Z("option", { value: 700 }, "Bold", -1),
							Z("option", { value: 800 }, "Extra Bold", -1)
						]], 40, ec)]),
						Z("label", null, [i[41] ||= Z("span", null, "정렬", -1), Z("select", {
							disabled: O.value.isLocked,
							value: F.value.textAlign || "left",
							onChange: i[15] ||= (e) => ce({ textAlign: e.target.value })
						}, [...i[40] ||= [
							Z("option", { value: "left" }, "왼쪽", -1),
							Z("option", { value: "center" }, "가운데", -1),
							Z("option", { value: "right" }, "오른쪽", -1)
						]], 40, tc)]),
						Z("div", nc, [i[42] ||= Z("span", null, "위치", -1), F.value.positionMode === "free" ? (Y(), X("strong", rc, " X " + L(Math.round(F.value.xPct || 0)) + "% · Y " + L(Math.round(F.value.yPx || 0)) + "px ", 1)) : (Y(), X("strong", ic, "자동 배치"))]),
						F.value.positionMode === "free" ? (Y(), X("button", {
							key: 0,
							class: "secondary-control",
							type: "button",
							disabled: O.value.isLocked,
							onClick: de
						}, " 자동 배치로 복원 ", 8, ac)) : Q("", !0),
						Z("div", oc, [Z("div", null, [i[43] ||= Z("span", null, "섹션 높이", -1), Z("strong", null, L(se.value.minHeight ? `${Math.round(se.value.minHeight)}px` : "자동"), 1)]), Z("button", {
							type: "button",
							disabled: !se.value.minHeight,
							onClick: pe
						}, " 높이 초기화 ", 8, sc)])
					])
				])) : Q("", !0)])
			])) : Q("", !0)
		]));
	}
}, lc = document.querySelector("#visual-editor-app");
lc && lo(cc, { mode: new URLSearchParams(window.location.search).get("mode") || lc.dataset.mode || "editor" }).mount(lc);
//#endregion
