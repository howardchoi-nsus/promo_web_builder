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
}, ee = /-\w/g, D = E((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, O = E((e) => e.replace(te, "-$1").toLowerCase()), k = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = E((e) => e ? `on${k(e)}` : ""), A = (e, t) => !Object.is(e, t), re = (e, ...t) => {
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
}, ae, oe = () => ae ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function se(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? de(r) : se(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var ce = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /\/\*[^]*?\*\//g;
function de(e) {
	let t = {};
	return e.replace(ue, "").split(ce).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function M(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = M(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var fe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", pe = /* @__PURE__ */ e(fe);
fe + "";
function me(e) {
	return !!e || e === "";
}
function he(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = ge(e[r], t[r]);
	return n;
}
function ge(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? he(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !ge(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
var _e = (e) => !!(e && e.__v_isRef === !0), N = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? _e(e) ? N(e.value) : JSON.stringify(e, P, 2) : String(e), P = (e, t) => _e(t) ? P(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ve(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ve(e)) } : _(t) ? ve(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ve = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, F, I = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && F && (F.active ? (this.parent = F, this.index = (F.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = F;
			try {
				return F = this, e();
			} finally {
				F = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = F, F = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (F === this) F = this.prevScope;
			else {
				let e = F;
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
	return F;
}
var L, be = /* @__PURE__ */ new WeakSet(), xe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, F && (F.active ? F.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, be.has(this) && (be.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Te(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Le(this), De(this);
		let e = L, t = Ne;
		L = this, Ne = !0;
		try {
			return this.fn();
		} finally {
			Oe(this), L = e, Ne = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) je(e);
			this.deps = this.depsTail = void 0, Le(this), this.onStop && this.onStop(), this.flags &= -2;
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
}, Se = 0, Ce, we;
function Te(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = we, we = e;
		return;
	}
	e.next = Ce, Ce = e;
}
function R() {
	Se++;
}
function Ee() {
	if (--Se > 0) return;
	if (we) {
		let e = we;
		for (we = void 0; e;) {
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
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Re) || (e.globalVersion = Re, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ke(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = Ne;
	L = e, Ne = !0;
	try {
		De(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, Ne = r, Oe(e), e.flags &= -3;
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
		let e = L;
		L = void 0;
		try {
			t();
		} finally {
			L = e;
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
		if (!L || !Ne || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new ze(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, Ve(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Re++, this.notify(e);
	}
	notify(e) {
		R();
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
function z(e, t, n) {
	if (Ne && L) {
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
	if (R(), t === "clear") o.forEach(s);
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
	let t = /* @__PURE__ */ H(e);
	return t === e ? t : (z(t, "iterate", Ge), /* @__PURE__ */ At(e) ? t : t.map(Nt));
}
function Je(e) {
	return z(e = /* @__PURE__ */ H(e), "iterate", Ge), e;
}
function Ye(e, t) {
	return /* @__PURE__ */ kt(e) ? Pt(/* @__PURE__ */ Ot(e) ? Nt(t) : t) : Nt(t);
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
	return r !== e && !/* @__PURE__ */ At(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var Qe = Array.prototype;
function $e(e, t, n, r, i, a) {
	let o = Je(e), s = o !== e && !/* @__PURE__ */ At(e), c = o[t];
	if (c !== Qe[t]) {
		let t = c.apply(e, a);
		return s ? Nt(t) : t;
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
	let i = Je(e), a = i !== e && !/* @__PURE__ */ At(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ye(e, t)), n.call(this, t, Ye(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ye(e, c) : c;
}
function tt(e, t, n) {
	let r = /* @__PURE__ */ H(e);
	z(r, "iterate", Ge);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ jt(n[0]) ? (n[0] = /* @__PURE__ */ H(n[0]), r[t](...n)) : i;
}
function nt(e, t, n = []) {
	Fe(), R();
	let r = (/* @__PURE__ */ H(e))[t].apply(e, n);
	return Ee(), Ie(), r;
}
var rt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), it = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function at(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ H(this);
	return z(t, "has", e), t.hasOwnProperty(e);
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
		if (t === "__v_raw") return n === (r ? i ? St : xt : i ? bt : yt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Xe[t])) return e;
			if (t === "hasOwnProperty") return at;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ U(e) ? e : n);
		if ((_(t) ? it.has(t) : rt(t)) || (r || z(e, "get", t), i)) return o;
		if (/* @__PURE__ */ U(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Et(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Et(o) : /* @__PURE__ */ wt(o) : o;
	}
}, st = class extends ot {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ kt(i);
			if (!/* @__PURE__ */ At(n) && !/* @__PURE__ */ kt(n) && (i = /* @__PURE__ */ H(i), n = /* @__PURE__ */ H(n)), !a && /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ U(e) ? e : r);
		return e === /* @__PURE__ */ H(r) && s && (o ? A(n, i) && Ke(e, "set", t, n, i) : Ke(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ke(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !it.has(t)) && z(e, "has", t), n;
	}
	ownKeys(e) {
		return z(e, "iterate", d(e) ? "length" : Ue), Reflect.ownKeys(e);
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
}, lt = /* @__PURE__ */ new st(), ut = /* @__PURE__ */ new ct(), B = /* @__PURE__ */ new st(!0), dt = (e) => e, V = (e) => Reflect.getPrototypeOf(e);
function ft(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ H(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? dt : t ? Pt : Nt;
		return !t && z(a, "iterate", l ? We : Ue), s(Object.create(u), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ H(r), a = /* @__PURE__ */ H(n);
			e || (A(n, a) && z(i, "get", n), z(i, "get", a));
			let { has: o } = V(i), s = t ? dt : e ? Pt : Nt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && z(/* @__PURE__ */ H(t), "iterate", Ue), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ H(n), i = /* @__PURE__ */ H(t);
			return e || (A(t, i) && z(r, "has", t), z(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ H(a), s = t ? dt : e ? Pt : Nt;
			return !e && z(o, "iterate", Ue), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: pt("add"),
		set: pt("set"),
		delete: pt("delete"),
		clear: pt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ H(this), r = V(n), i = /* @__PURE__ */ H(e), a = !t && !/* @__PURE__ */ At(e) && !/* @__PURE__ */ kt(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Ke(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ At(n) && !/* @__PURE__ */ kt(n) && (n = /* @__PURE__ */ H(n));
			let r = /* @__PURE__ */ H(this), { has: i, get: a } = V(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ H(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Ke(r, "set", e, n, s) : Ke(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ H(this), { has: n, get: r } = V(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ H(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ke(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ H(this), t = e.size !== 0, n = e.clear();
			return t && Ke(e, "clear", void 0, void 0, void 0), n;
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
	return /* @__PURE__ */ kt(e) ? e : Dt(e, !1, lt, gt, yt);
}
// @__NO_SIDE_EFFECTS__
function Tt(e) {
	return Dt(e, !1, B, _t, bt);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return Dt(e, !0, ut, vt, xt);
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
function H(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ H(t) : e;
}
function Mt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && j(e, "__v_skip", !0), e;
}
var Nt = (e) => v(e) ? /* @__PURE__ */ wt(e) : e, Pt = (e) => v(e) ? /* @__PURE__ */ Et(e) : e;
// @__NO_SIDE_EFFECTS__
function U(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function W(e) {
	return Ft(e, !1);
}
function Ft(e, t) {
	return /* @__PURE__ */ U(e) ? e : new It(e, t);
}
var It = class {
	constructor(e, t) {
		this.dep = new Be(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ H(e), this._value = t ? e : Nt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ At(e) || /* @__PURE__ */ kt(e);
		e = n ? e : /* @__PURE__ */ H(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Nt(e), this.dep.trigger());
	}
};
function Lt(e) {
	return /* @__PURE__ */ U(e) ? e.value : e;
}
var Rt = {
	get: (e, t, n) => t === "__v_raw" ? e : Lt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function zt(e) {
	return /* @__PURE__ */ Ot(e) ? e : new Proxy(e, Rt);
}
var Bt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Be(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Re - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return Te(this, !0), !0;
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
	if (/* @__PURE__ */ U(e) ? (g = () => e.value, y = /* @__PURE__ */ At(e)) : /* @__PURE__ */ Ot(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Ot(e) || /* @__PURE__ */ At(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ U(e)) return e.value;
		if (/* @__PURE__ */ Ot(e)) return p(e);
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
	return u && u(w), m = new xe(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Gt(e, !1, m), _ = m.onStop = () => {
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
	if (n.set(e, t), t--, /* @__PURE__ */ U(e)) qt(e.value, t, n);
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
			Fe(), Jt(o, null, 10, [
				e,
				i,
				a
			]), Ie();
			return;
		}
	}
	Zt(e, r, a, i, s);
}
function Zt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Qt = [], $t = -1, en = [], tn = null, nn = 0, rn = /* @__PURE__ */ Promise.resolve(), an = null;
function on(e) {
	let t = an || rn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function sn(e) {
	let t = $t + 1, n = Qt.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Qt[r], a = pn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function cn(e) {
	if (!(e.flags & 1)) {
		let t = pn(e), n = Qt[Qt.length - 1];
		!n || !(e.flags & 2) && t >= pn(n) ? Qt.push(e) : Qt.splice(sn(t), 0, e), e.flags |= 1, ln();
	}
}
function ln() {
	an ||= rn.then(mn);
}
function un(e) {
	d(e) ? en.push(...e) : tn && e.id === -1 ? tn.splice(nn + 1, 0, e) : e.flags & 1 || (en.push(e), e.flags |= 1), ln();
}
function dn(e, t, n = $t + 1) {
	for (; n < Qt.length; n++) {
		let t = Qt[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Qt.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
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
		for ($t = 0; $t < Qt.length; $t++) {
			let e = Qt[$t];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Jt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; $t < Qt.length; $t++) {
			let e = Qt[$t];
			e && (e.flags &= -2);
		}
		$t = -1, Qt.length = 0, fn(e), an = null, (Qt.length || en.length) && mn(e);
	}
}
var G = null, hn = null;
function gn(e) {
	let t = G;
	return G = e, hn = e && e.type.__scopeId || null, t;
}
function _n(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ti(-1);
		let i = gn(t), a;
		try {
			a = e(...n);
		} finally {
			gn(i), r._d && Ti(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function vn(e, n) {
	if (G === null) return e;
	let r = sa(G), i = e.dirs ||= [];
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
		c && (Fe(), Yt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ie());
	}
}
function bn(e, t) {
	if (Gi) {
		let n = Gi.provides, r = Gi.parent && Gi.parent.provides;
		r === n && (n = Gi.provides = Object.create(r)), n[e] = t;
	}
}
function xn(e, t, n = !1) {
	let r = Ki();
	if (r || Or) {
		let i = Or ? Or._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
	if (Qi) {
		if (c === "sync") {
			let e = Cn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Gi;
	u.call = (e, t, n) => Yt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ai(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : cn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Kt(e, n, u);
	return Qi && (f ? f.push(h) : d && h()), h;
}
function En(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Dn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Yi(this), s = Tn(i, a.bind(r), n);
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
	let s = a.shapeFlag & 4 ? sa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ H(v), b = v === t ? i : (e) => !Nn(_, e) && u(y, e), x = (e, t) => !(t && Nn(_, t));
	if (m != null && m !== p) {
		if (In(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ U(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Fe();
		try {
			Jt(p, f, 12, [l, _]);
		} finally {
			Ie();
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
					i(), Pn.delete(e);
				};
				t.id = -1, Pn.set(e, t), ai(t, r);
			} else In(e), i();
		}
	}
}
function In(e) {
	let t = Pn.get(e);
	t && (t.flags |= 8, Pn.delete(e));
}
oe().requestIdleCallback, oe().cancelIdleCallback;
var Ln = (e) => !!e.type.__asyncLoader, Rn = (e) => e.type.__isKeepAlive;
function zn(e, t) {
	Vn(e, "a", t);
}
function Bn(e, t) {
	Vn(e, "da", t);
}
function Vn(e, t, n = Gi) {
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
function Un(e, t, n = Gi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Fe();
			let i = Yi(n), a = Yt(t, n, e, r);
			return i(), Ie(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Wn = (e) => (t, n = Gi) => {
	(!Qi || e === "sp") && Un(e, (...e) => t(...e), n);
}, Gn = Wn("bm"), Kn = Wn("m"), qn = Wn("bu"), Jn = Wn("u"), Yn = Wn("bum"), Xn = Wn("um"), Zn = Wn("sp"), Qn = Wn("rtg"), $n = Wn("rtc");
function er(e, t = Gi) {
	Un("ec", e, t);
}
var tr = /* @__PURE__ */ Symbol.for("v-ndc");
function nr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Ot(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ At(e), s = /* @__PURE__ */ kt(e), e = Je(e)), i = Array(e.length);
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
function rr(e, t, n = {}, r, i) {
	if (G.ce || G.parent && Ln(G.parent) && G.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), q(), Di(K, null, [X("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), q();
	let o = a && ir(a(n)), s = n.key || o && o.key, c = Di(K, { key: (s && !_(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function ir(e) {
	return e.some((e) => !Oi(e) || !(e.type === yi || e.type === K && !ir(e.children))) ? e : null;
}
var ar = (e) => e ? Zi(e) ? sa(e) : ar(e.parent) : null, or = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		cn(e.update);
	},
	$nextTick: (e) => e.n ||= on.bind(e.proxy),
	$watch: (e) => En.bind(e)
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
		if (d) return n === "$attrs" && z(e.attrs, "get", ""), d(e);
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
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: ee, errorCaptured: D, serverPrefetch: te, expose: O, inheritAttrs: k, components: ne, directives: A, filters: re } = t;
	if (u && fr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ wt(t));
	}
	if (ur = !0, o) for (let e in o) {
		let t = o[e], a = Q({
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
			bn(t, e[t]);
		});
	}
	f && pr(f, e, "c");
	function j(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (j(Gn, p), j(Kn, m), j(qn, g), j(Jn, _), j(zn, y), j(Bn, b), j(er, D), j($n, E), j(Qn, ee), j(Yn, S), j(Xn, w), j(Zn, te), d(O)) if (O.length) {
		let t = e.exposed ||= {};
		O.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), k != null && (e.inheritAttrs = k), ne && (e.components = ne), A && (e.directives = A), te && Mn(e);
}
function fr(e, t, n = r) {
	d(e) && (e = br(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? xn(r.from || n, r.default, !0) : xn(r.from || n) : xn(r), /* @__PURE__ */ U(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function pr(e, t, n) {
	Yt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function mr(e, t, n, r) {
	let i = r.includes(".") ? Dn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && wn(i, n);
	} else if (h(e)) wn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => mr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && wn(i, r, e);
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
	props: Cr,
	emits: Cr,
	methods: Sr,
	computed: Sr,
	beforeCreate: xr,
	created: xr,
	beforeMount: xr,
	mounted: xr,
	beforeUpdate: xr,
	updated: xr,
	beforeDestroy: xr,
	beforeUnmount: xr,
	destroyed: xr,
	unmounted: xr,
	activated: xr,
	deactivated: xr,
	errorCaptured: xr,
	serverPrefetch: xr,
	components: Sr,
	directives: Sr,
	watch: wr,
	provide: vr,
	inject: yr
};
function vr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function yr(e, t) {
	return Sr(br(e), br(t));
}
function br(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function xr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Sr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Cr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), lr(e), lr(t ?? {})) : t;
}
function wr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = xr(e[r], t[r]);
	return n;
}
function Tr() {
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
var Er = 0;
function Dr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Tr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Er++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: la,
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
					let u = l._ceVNode || X(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, sa(u.component);
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
				let t = Or;
				Or = l;
				try {
					return e();
				} finally {
					Or = t;
				}
			}
		};
		return l;
	};
}
var Or = null, kr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function Ar(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && kr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(ie)));
	let c, l = i[c = ne(n)] || i[c = ne(D(n))];
	!l && o && (l = i[c = ne(O(n))]), l && Yt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Yt(u, e, 6, a);
	}
}
var jr = /* @__PURE__ */ new WeakMap();
function Mr(e, t, n = !1) {
	let r = n ? jr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Mr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Nr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function Pr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = gn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Li(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Li(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Fr(c);
		}
	} catch (t) {
		xi.length = 0, Xt(t, e, 1), v = X(yi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Ir(y, a)), b = Pi(b, y, !1, !0));
	}
	return n.dirs && (b = Pi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && jn(b, n.transition), v = b, gn(_), v;
}
var Fr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Ir = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Lr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Rr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (zr(o, r, n) && !Nr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Rr(r, o, l) : !!o;
	return !1;
}
function Rr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (zr(t, e, a) && !Nr(n, a)) return !0;
	}
	return !1;
}
function zr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !ge(r, i) : r !== i;
}
function Br({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Vr = {}, Hr = () => Object.create(Vr), Ur = (e) => Object.getPrototypeOf(e) === Vr;
function Wr(e, t, n, r = !1) {
	let i = {}, a = Hr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Kr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Tt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Gr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ H(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Nr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = D(o);
					i[t] = qr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Kr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = O(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = qr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ke(e.attrs, "set", "");
}
function Kr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Nr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ H(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = qr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function qr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Yi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
var Jr = /* @__PURE__ */ new WeakMap();
function Yr(e, r, i = !1) {
	let a = i ? Jr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Yr(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		Xr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (Xr(t)) {
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
function Xr(e) {
	return e[0] !== "$" && !T(e);
}
var Zr = (e) => e === "_" || e === "_ctx" || e === "$stable", Qr = (e) => d(e) ? e.map(Li) : [Li(e)], $r = (e, t, n) => {
	if (t._n) return t;
	let r = _n((...e) => Qr(t(...e)), n);
	return r._c = !1, r;
}, ei = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Zr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = $r(n, i, r);
		else if (i != null) {
			let e = Qr(i);
			t[n] = () => e;
		}
	}
}, ti = (e, t) => {
	let n = Qr(t);
	e.slots.default = () => n;
}, ni = (e, t, n) => {
	for (let r in t) (n || !Zr(r)) && (e[r] = t[r]);
}, ri = (e, t, n) => {
	let r = e.slots = Hr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ni(r, t, n), n && j(r, "_", e, !0)) : ei(t, r);
	} else t && ti(e, t);
}, ii = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ni(a, n, r) : (o = !n.$stable, ei(n, a)), s = n;
	} else n && (ti(e, n), s = { default: 1 });
	if (o) for (let e in a) !Zr(e) && s[e] == null && delete a[e];
}, ai = _i;
function oi(e) {
	return si(e);
}
function si(e, i) {
	let a = oe();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ki(e, t) && (r = ge(e), M(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case vi:
				y(e, t, n, r);
				break;
			case yi:
				b(e, t, n, r);
				break;
			case bi:
				e ?? x(t, n, r, o);
				break;
			case K:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? A(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, P);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) E(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, ci(e, a), s, u), _ && yn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Vi(f, r, e);
		}
		_ && yn(e, null, r, "beforeMount");
		let v = ui(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ai(() => {
			try {
				f && Vi(f, r, e), v && g.enter(d), _ && yn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || gi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ri(e[l]) : Li(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && li(r, !1), (g = h.onVnodeBeforeUpdate) && Vi(g, r, n, e), f && yn(n, e, r, "beforeUpdate"), r && li(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, ci(n, a), o) : s || ce(e, n, l, null, r, i, ci(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && ai(() => {
			g && Vi(g, r, n, e), f && yn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === K || !ki(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
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
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && di(e, t, !0)) : ce(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : ie(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = Wi(e, r, i);
		if (Rn(e) && (s.ctx.renderer = P), $i(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = X(yi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, ie = (e, t, n) => {
		let r = t.component = e.component;
		if (Lr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			se(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = pi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							ai(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				li(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Vi(d, s, t, c), li(e, !0);
				let f = Pr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && Br(e, f.el), r && ai(r, i), (d = t.props && t.props.onVnodeUpdated) && ai(() => Vi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ln(t);
				if (li(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && Vi(o, d, t), li(e, !0), s && F) {
					let t = () => {
						e.subTree = Pr(e), F(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Pr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ai(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ai(() => Vi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ln(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ai(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new xe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => cn(u), li(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Gr(e, t.props, r, n), ii(e, t.children, n), Fe(), dn(e), Ie();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && he(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : he(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, le = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ri(t[p]) : Li(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? he(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, ue = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Ri(t[u]) : Li(t[u]);
			if (ki(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Ri(t[p]) : Li(t[p]);
			if (ki(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ri(t[u]) : Li(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) M(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Ri(t[u]) : Li(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					M(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ki(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? M(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? fi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || hi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(n, r, p, 2) : _--);
			}
		}
	}, de = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			de(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, P);
			return;
		}
		if (c === K) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === bi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[An] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ai(() => l.enter(a), i));
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
	}, M = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Fe(), Fn(s, null, n, e, !0), Ie()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ln(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Vi(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && yn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, P, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ai(() => {
			_ && Vi(_, t, e), h && yn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === K) {
			pe(n, r);
			return;
		}
		if (t === bi) {
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
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		mi(c), mi(l), r && re(r), i.stop(), a && (a.flags |= 8, M(o, e, t, n)), s && ai(s, t), ai(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) M(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[On];
		return n ? h(n) : t;
	}, _e = !1, N = (e, t, n) => {
		let r;
		e == null ? t._vnode && (M(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, dn(r), fn(), !1);
	}, P = {
		p: v,
		um: M,
		m: de,
		r: fe,
		mt: j,
		mc: D,
		pc: ce,
		pbc: O,
		n: ge,
		o: e
	}, ve, F;
	return i && ([ve, F] = i(P)), {
		render: N,
		hydrate: ve,
		createApp: Dr(N, ve)
	};
}
function ci({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function li({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ui(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function di(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ri(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && di(t, a)), a.type === vi && (a.patchFlag === -1 && (a = i[e] = Ri(a)), a.el = t.el), a.type === yi && !a.el && (a.el = t.el);
	}
}
function fi(e) {
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
function pi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : pi(t);
}
function mi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function hi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? hi(t.subTree) : null;
}
var gi = (e) => e.__isSuspense;
function _i(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : un(e);
}
var K = /* @__PURE__ */ Symbol.for("v-fgt"), vi = /* @__PURE__ */ Symbol.for("v-txt"), yi = /* @__PURE__ */ Symbol.for("v-cmt"), bi = /* @__PURE__ */ Symbol.for("v-stc"), xi = [], Si = null;
function q(e = !1) {
	xi.push(Si = e ? null : []);
}
function Ci() {
	xi.pop(), Si = xi[xi.length - 1] || null;
}
var wi = 1;
function Ti(e, t = !1) {
	wi += e, e < 0 && Si && t && (Si.hasOnce = !0);
}
function Ei(e) {
	return e.dynamicChildren = wi > 0 ? Si || n : null, Ci(), wi > 0 && Si && Si.push(e), e;
}
function J(e, t, n, r, i, a) {
	return Ei(Y(e, t, n, r, i, a, !0));
}
function Di(e, t, n, r, i) {
	return Ei(X(e, t, n, r, i, !0));
}
function Oi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ki(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ai = ({ key: e }) => e ?? null, ji = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ U(e) || h(e) ? {
	i: G,
	r: e,
	k: t,
	f: !!n
} : e);
function Y(e, t = null, n = null, r = 0, i = null, a = e === K ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ai(t),
		ref: t && ji(t),
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
		ctx: G
	};
	return s ? (zi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), wi > 0 && !o && Si && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Si.push(c), c;
}
var X = Mi;
function Mi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === tr) && (e = yi), Oi(e)) {
		let r = Pi(e, t, !0);
		return n && zi(r, n), wi > 0 && !a && Si && (r.shapeFlag & 6 ? Si[Si.indexOf(e)] = r : Si.push(r)), r.patchFlag = -2, r;
	}
	if (ca(e) && (e = e.__vccOpts), t) {
		t = Ni(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = M(e)), v(n) && (/* @__PURE__ */ jt(n) && !d(n) && (n = s({}, n)), t.style = se(n));
	}
	let o = g(e) ? 1 : gi(e) ? 128 : kn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Y(e, t, n, r, i, o, a, !0);
}
function Ni(e) {
	return e ? /* @__PURE__ */ jt(e) || Ur(e) ? s({}, e) : e : null;
}
function Pi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Bi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ai(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(ji(t)) : [a, ji(t)] : ji(t) : a,
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
		ssContent: e.ssContent && Pi(e.ssContent),
		ssFallback: e.ssFallback && Pi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && jn(u, c.clone(u)), u;
}
function Fi(e = " ", t = 0) {
	return X(vi, null, e, t);
}
function Ii(e, t) {
	let n = X(bi, null, e);
	return n.staticCount = t, n;
}
function Z(e = "", t = !1) {
	return t ? (q(), Di(yi, null, e)) : X(yi, null, e);
}
function Li(e) {
	return e == null || typeof e == "boolean" ? X(yi) : d(e) ? X(K, null, e.slice()) : Oi(e) ? Ri(e) : X(vi, null, String(e));
}
function Ri(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Pi(e);
}
function zi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), zi(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Ur(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			zi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Fi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Bi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = M([t.class, r.class]));
		else if (e === "style") t.style = se([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Vi(e, t, n, r = null) {
	Yt(e, t, 7, [n, r]);
}
var Hi = Tr(), Ui = 0;
function Wi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Hi, o = {
		uid: Ui++,
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
		scope: new I(!0),
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
		propsOptions: Yr(i, a),
		emitsOptions: Mr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Ar.bind(null, o), e.ce && e.ce(o), o;
}
var Gi = null, Ki = () => Gi || G, qi, Ji;
{
	let e = oe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	qi = t("__VUE_INSTANCE_SETTERS__", (e) => Gi = e), Ji = t("__VUE_SSR_SETTERS__", (e) => Qi = e);
}
var Yi = (e) => {
	let t = Gi;
	return qi(e), e.scope.on(), () => {
		e.scope.off(), qi(t);
	};
}, Xi = () => {
	Gi && Gi.scope.off(), qi(null);
};
function Zi(e) {
	return e.vnode.shapeFlag & 4;
}
var Qi = !1;
function $i(e, t = !1, n = !1) {
	t && Ji(t);
	let { props: r, children: i } = e.vnode, a = Zi(e);
	Wr(e, r, a, t), ri(e, i, n || t);
	let o = a ? ea(e, t) : void 0;
	return t && Ji(!1), o;
}
function ea(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, cr);
	let { setup: r } = n;
	if (r) {
		Fe();
		let n = e.setupContext = r.length > 1 ? oa(e) : null, i = Yi(e), a = Jt(r, e, 0, [e.props, n]), o = y(a);
		if (Ie(), i(), (o || e.sp) && !Ln(e) && Mn(e), o) {
			if (a.then(Xi, Xi), t) return a.then((n) => {
				ta(e, n, t);
			}).catch((t) => {
				Xt(t, e, 0);
			});
			e.asyncDep = a;
		} else ta(e, a, t);
	} else ia(e, t);
}
function ta(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = zt(t)), ia(e, n);
}
var na, ra;
function ia(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && na && !i.render) {
			let t = i.template || hr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = na(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o));
			}
		}
		e.render = i.render || r, ra && ra(e);
	}
	{
		let t = Yi(e);
		Fe();
		try {
			dr(e);
		} finally {
			Ie(), t();
		}
	}
}
var aa = { get(e, t) {
	return z(e, "get", ""), e[t];
} };
function oa(e) {
	return {
		attrs: new Proxy(e.attrs, aa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function sa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(zt(Mt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in or) return or[n](e);
		},
		has(e, t) {
			return t in e || t in or;
		}
	}) : e.proxy;
}
function ca(e) {
	return h(e) && "__vccOpts" in e;
}
var Q = (e, t) => /* @__PURE__ */ Vt(e, t, Qi), la = "3.5.39", ua = void 0, da = typeof window < "u" && window.trustedTypes;
if (da) try {
	ua = /* @__PURE__ */ da.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var fa = ua ? (e) => ua.createHTML(e) : (e) => e, pa = "http://www.w3.org/2000/svg", ma = "http://www.w3.org/1998/Math/MathML", ha = typeof document < "u" ? document : null, ga = ha && /* @__PURE__ */ ha.createElement("template"), _a = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ha.createElementNS(pa, e) : t === "mathml" ? ha.createElementNS(ma, e) : n ? ha.createElement(e, { is: n }) : ha.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ha.createTextNode(e),
	createComment: (e) => ha.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ha.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			ga.innerHTML = fa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ga.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, va = /* @__PURE__ */ Symbol("_vtc");
function ya(e, t, n) {
	let r = e[va];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ba = /* @__PURE__ */ Symbol("_vod"), xa = /* @__PURE__ */ Symbol("_vsh"), Sa = /* @__PURE__ */ Symbol(""), Ca = /(?:^|;)\s*display\s*:/;
function wa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? Ea(r, t, "");
		}
		else for (let e in t) n[e] ?? Ea(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ea(r, i, "") : Aa(e, i, !g(t) && t ? t[i] : void 0, o) || Ea(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Sa];
			e && (n += ";" + e), r.cssText = n, a = Ca.test(n);
		}
	} else t && e.removeAttribute("style");
	ba in e && (e[ba] = a ? r.display : "", e[xa] && (r.display = "none"));
}
var Ta = /\s*!important$/;
function Ea(e, t, n) {
	if (d(n)) n.forEach((n) => Ea(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = ka(e, t);
		Ta.test(n) ? e.setProperty(O(r), n.replace(Ta, ""), "important") : e[r] = n;
	}
}
var Da = [
	"Webkit",
	"Moz",
	"ms"
], Oa = {};
function ka(e, t) {
	let n = Oa[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return Oa[t] = r;
	r = k(r);
	for (let n = 0; n < Da.length; n++) {
		let i = Da[n] + r;
		if (i in e) return Oa[t] = i;
	}
	return t;
}
function Aa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ja = "http://www.w3.org/1999/xlink";
function Ma(e, t, n, r, i, a = pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ja, t.slice(6, t.length)) : e.setAttributeNS(ja, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Na(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? fa(n) : n);
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
		r === "boolean" ? n = me(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Pa(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Fa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ia = /* @__PURE__ */ Symbol("_vei");
function La(e, t, n, r, i = null) {
	let a = e[Ia] || (e[Ia] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ba(t);
		r ? Pa(e, n, a[t] = Wa(r, i), s) : o && (Fa(e, n, o, s), a[t] = void 0);
	}
}
var Ra = /(Once|Passive|Capture)$/, za = /^on:?(?:Once|Passive|Capture)$/;
function Ba(e) {
	let t, n;
	for (; (n = e.match(Ra)) && !za.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var Va = 0, Ha = /* @__PURE__ */ Promise.resolve(), Ua = () => Va ||= (Ha.then(() => Va = 0), Date.now());
function Wa(e, t) {
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
	return n.value = e, n.attached = Ua(), n;
}
var Ga = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ka = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ya(e, r, c) : t === "style" ? wa(e, n, r) : a(t) ? o(t) || La(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : qa(e, t, r, c)) ? (Na(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ma(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ja(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Na(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ma(e, t, r, c));
};
function qa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ga(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ga(t) && g(n) ? !1 : t in e;
}
function Ja(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var Ya = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => re(t, e) : t;
};
function Xa(e) {
	e.target.composing = !0;
}
function Za(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Qa = /* @__PURE__ */ Symbol("_assign");
function $a(e, t, n) {
	return t && (e = e.trim()), n && (e = ie(e)), e;
}
var eo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[Qa] = Ya(i);
		let a = r || i.props && i.props.type === "number";
		Pa(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Qa]($a(e.value, n, a));
		}), (n || a) && Pa(e, "change", () => {
			e.value = $a(e.value, n, a);
		}), t || (Pa(e, "compositionstart", Xa), Pa(e, "compositionend", Za), Pa(e, "change", Za));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Qa] = Ya(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ie(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, to = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], no = {
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
	exact: (e, t) => to.some((n) => e[`${n}Key`] && !t.includes(n))
}, ro = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = no[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, io = /* @__PURE__ */ s({ patchProp: Ka }, _a), ao;
function oo() {
	return ao ||= oi(io);
}
var so = ((...e) => {
	let t = oo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = lo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, co(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function co(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function lo(e) {
	return g(e) ? document.querySelector(e) : e;
}
var uo = "default-promo-renderer", fo = "promoVisualEditor.snapshot.v1", po = Object.freeze([
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
]), mo = Object.freeze({
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
}), ho = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
function go(e) {
	return JSON.parse(JSON.stringify(e));
}
function _o(e) {
	return e?.isLocked && e.lockedValue !== null && e.lockedValue !== void 0 ? go(e.lockedValue) : e?.fieldKind === "cta" ? {
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
function vo(e, t = {}) {
	return Object.fromEntries((e || []).map((e) => [e.sectionKey, Object.fromEntries((e.items || []).map((n) => [n.itemKey, yo(n, t?.[e.sectionKey]?.[n.itemKey])]))]));
}
function yo(e, t) {
	let n = Array.isArray(e?.fields) ? e.fields : [];
	if (n.length <= 1) return t ?? _o(n[0] || e);
	let r = t?.fields && typeof t.fields == "object" ? t.fields : {};
	return { fields: Object.fromEntries(n.map((e) => [e.fieldKey, r[e.fieldKey] ?? _o(e)])) };
}
function bo({ template: e, configRevision: t, sections: n, sectionInputs: r, designSpec: i = mo }) {
	return {
		snapshotVersion: 1,
		renderer: {
			key: uo,
			version: 1,
			buildId: "visual-editor-p1-v1"
		},
		content: {
			contractVersion: 1,
			formTemplate: {
				...e,
				configRevision: t
			},
			sectionSnapshot: go(n),
			sectionInputs: go(r),
			sectionOrder: n.map((e) => e.sectionKey)
		},
		designSpec: go(i),
		assets: {
			contractVersion: 1,
			items: {}
		},
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region visual-editor/src/editor-utils.mjs
var xo = /* @__PURE__ */ new Set(["http:", "https:"]);
function So(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return xo.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
function Co(e = {}) {
	let t = { ...e };
	return delete t.positionMode, delete t.xPct, delete t.yPx, delete t.yPct, t;
}
function wo(e, t, n) {
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
function To(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
}
function Eo(e) {
	return Math.round(Number(e) * 100) / 100;
}
function Do(e = {}) {
	let t = Array.isArray(e.fields) ? e.fields : [];
	return t.length > 1 ? t.reduce((e, t) => e + Do(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
}
function Oo({ item: e = {}, style: t = {}, canvasWidth: n, fallbackX: r = 0, fallbackY: i = 0 } = {}) {
	let a = Math.max(1, Number(n) || 1280), o = e.fieldKind === "image", s = o ? 10 : .01, c = o ? 80 : 1, l = To(t.widthPct, s, 100, 32), u = To(t.heightPx, c, 900, Do(e));
	return {
		x: To(t.xPct, 0, 100, r) / 100 * a,
		y: To(t.yPx, 0, 1200, i),
		width: l / 100 * a,
		height: u,
		widthPct: l,
		fontSize: To(t.fontSize, 0, 80, 18)
	};
}
function ko(e, t, { includeHeight: n = !0, includeFontSize: r = !0 } = {}) {
	let i = Math.max(1, Number(t) || 1280);
	return {
		positionMode: "free",
		xPct: Eo(e.x / i * 100),
		yPx: Eo(e.y),
		widthPct: Eo(e.width / i * 100),
		...n ? { heightPx: Eo(e.height) } : {},
		...r ? { fontSize: Eo(e.fontSize) } : {}
	};
}
//#endregion
//#region visual-editor/src/platform/layout-engine/resize.mjs
function Ao(e, t) {
	return String(e || "se").includes(t);
}
function jo({ geometry: e, deltaX: t = 0, deltaY: n = 0, direction: r = "se", minimumWidth: i = 1, minimumHeight: a = 1, maximumWidth: o = Infinity, maximumHeight: s = 900, aspectRatioLocked: c = !1, aspectRatio: l = 1, scaleFont: u = !0, maximumFontSize: d = 80 } = {}) {
	let f = {
		x: Number(e?.x) || 0,
		y: Number(e?.y) || 0,
		width: Math.max(i, Number(e?.width) || i),
		height: Math.max(a, Number(e?.height) || a),
		fontSize: To(e?.fontSize, 0, d, 18)
	}, p = Ao(r, "w"), m = Ao(r, "e"), h = Ao(r, "n"), g = Ao(r, "s"), _ = p || m, v = h || g, y = _ ? p ? -t : t : 0, b = v ? h ? -n : n : 0, x = _ ? To(f.width + y, i, o, f.width) : f.width, S = v ? To(f.height + b, a, s, f.height) : f.height;
	if (c) {
		let e = Number(l) > 0 ? Number(l) : 1;
		v && (!_ || Math.abs(n) > Math.abs(t)) ? (x = To(S * e, i, o, f.width), S = To(x / e, a, s, f.height)) : (S = To(x / e, a, s, f.height), x = To(S * e, i, o, f.width));
	}
	let C = p ? f.x + f.width - x : f.x, w = h ? f.y + f.height - S : f.y, T = f.width ? x / f.width : 1, E = f.height ? S / f.height : 1, ee = _ && v ? Math.sqrt(T * E) : _ ? T : E, D = Math.max(_ ? x - f.width : 0, v ? S - f.height : 0, 0), te = f.fontSize === 0 ? D / 4 : f.fontSize * ee, O = u ? To(te, 0, d, f.fontSize) : f.fontSize;
	return {
		x: Eo(C),
		y: Eo(w),
		width: Eo(x),
		height: Eo(S),
		fontSize: Eo(O),
		widthScale: T,
		heightScale: E
	};
}
//#endregion
//#region visual-editor/src/PromoPageRenderer.vue
var Mo = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, No = ["data-section-key", "aria-busy"], Po = ["title"], Fo = {
	key: 0,
	"aria-hidden": "true"
}, Io = { class: "rendered-section__inner" }, Lo = [
	"data-item-key",
	"data-style-key",
	"onClick",
	"onPointerdown",
	"onDblclick"
], Ro = {
	key: 0,
	class: "rendered-component-fields"
}, zo = [
	"href",
	"target",
	"rel"
], Bo = {
	key: 1,
	class: "rendered-component-field"
}, Vo = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Ho = {
	key: 0,
	class: "rendered-image__placeholder"
}, Uo = {
	key: 0,
	"aria-hidden": "true"
}, Wo = {
	key: 2,
	class: "rendered-text rendered-component-field"
}, Go = {
	key: 3,
	class: "rendered-empty rendered-component-field"
}, Ko = [
	"href",
	"target",
	"rel"
], qo = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Jo = {
	key: 0,
	class: "rendered-image__placeholder"
}, Yo = ["title"], Xo = {
	key: 0,
	"aria-hidden": "true"
}, Zo = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Qo = {
	key: 0,
	class: "rendered-text"
}, $o = {
	key: 1,
	class: "rendered-empty"
}, es = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], ts = [
	"aria-label",
	"title",
	"onPointerdown"
], ns = {
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
		let n = e, r = t, i = Q(() => {
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
			return So(e?.link);
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
		function E(e, t, r) {
			return n.designSpec?.itemStyles?.[`${m(e, t)}.${r.fieldKey}`] || {};
		}
		function ee(e, t, n) {
			let r = E(e, t, n), i = s(o(e, t, n)), a = [
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
		function D(e, t, n) {
			let r = E(e, t, n), i = o(e, t, n);
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
		function te(e, t) {
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
			return Do(e);
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
		function re(e) {
			let t = String(e.backgroundColor || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(t)) return t;
			let r = String(n.designSpec?.theme?.backgroundColor || "").trim();
			return /^#[0-9a-f]{6}$/i.test(r) ? r : "#f5f7fb";
		}
		function j(e, t, n = "medium") {
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
		function ie(e) {
			let t = g(e), n = t.minHeight || k(e), r = d(e), i = re(t), a = r ? j(A(t), i, t.backgroundFadeStrength) : "";
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
			let t = g(e).minHeight || k(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function oe(e, t) {
			let n = h(e, t), r = n.positionMode === "free" ? n : ne(e, t), i = t.fieldKind === "image", a = S(n.widthPct, i ? 10 : .01, 100, 32), o = S(n.heightPx, i ? 80 : 1, 900, i ? void 0 : Do(t));
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
				width: `${a}%`,
				height: o && (!i || n.shape !== "circle") ? `${o}px` : void 0,
				aspectRatio: i && (!o || n.shape === "circle") ? w(t, n) : void 0
			};
		}
		function ce(e, t, i = null) {
			n.editable && r("select-item", e, t, { additive: !!(i?.ctrlKey || i?.metaKey || i?.shiftKey) });
		}
		function le(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest(".item-resize-handle") || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), ce(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
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
		function ue(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || e.button !== 0) return;
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c) return;
			e.preventDefault(), e.stopPropagation(), ce(t, i), o.setPointerCapture(e.pointerId), s.classList.add("is-resizing");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = h(t, i), m = i.fieldKind === "image", _ = m && p.aspectRatioLocked !== !1, v = m ? 80 : 1, y = a.includes("w") || a.includes("e"), b = a.includes("n") || a.includes("s"), x = ne(t, i), S = Math.max(50, (g(t).minHeight || k(t)) - 76), C = Oo({
				item: i,
				style: p,
				canvasWidth: l.width,
				fallbackX: x.xPct || 0,
				fallbackY: (x.yPct || 0) / 100 * S
			});
			m && p.heightPx === void 0 && (C.height = u.height);
			let w = C.height ? C.width / C.height : 1, T = { ...C }, E = 0, ee = (e) => {
				let t = Math.max(v, a.includes("w") ? C.width + C.x : l.width - C.x), n = Math.max(v, a.includes("n") ? C.height + C.y : 1124 - C.y);
				T = jo({
					geometry: C,
					deltaX: e.clientX - d,
					deltaY: e.clientY - f,
					direction: a,
					minimumWidth: v,
					minimumHeight: v,
					maximumWidth: t,
					maximumHeight: n,
					aspectRatioLocked: _ || m && p.shape === "circle",
					aspectRatio: p.shape === "circle" ? 1 : w,
					scaleFont: !m
				}), !E && (E = requestAnimationFrame(() => {
					E = 0, s.style.left = `${T.x}px`, s.style.top = `${T.y}px`, (y || _) && (s.style.width = `${T.width}px`), (b || _) && (s.style.height = `${T.height}px`), m ? s.style.aspectRatio = "auto" : s.style.setProperty("--item-font-size", `${T.fontSize}px`);
				}));
			}, D = () => {
				E && cancelAnimationFrame(E);
				let e = Math.ceil(T.y + T.height + 76);
				e > (g(t).minHeight || k(t)) && r("update-section-style", t.sectionKey, { minHeight: Math.min(1200, e) });
				let n = ko(T, l.width, {
					includeHeight: b && !_ && !(m && p.shape === "circle"),
					includeFontSize: !m
				});
				r("update-renderer-item-style", t, i, {
					...n,
					...!b && !_ ? { heightPx: p.heightPx } : {},
					...m ? { aspectRatio: `${Math.max(1, Math.round(T.width))}/${Math.max(1, Math.round(T.height))}` } : {}
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("--item-font-size"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", ee), o.removeEventListener("pointerup", D), o.removeEventListener("pointercancel", D);
			};
			o.addEventListener("pointermove", ee), o.addEventListener("pointerup", D), o.addEventListener("pointercancel", D);
		}
		function de(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = h(t, i), s = i.fieldKind === "image", c = s && o.aspectRatioLocked !== !1, l = e.shiftKey ? 4 : 1, u = a.includes("w") || a.includes("e"), d = a.includes("n") || a.includes("s"), f = e.currentTarget.closest(".rendered-items");
			if (!f) return;
			let p = Math.max(1, f.getBoundingClientRect().width), m = u ? e.key === "ArrowRight" ? p * l / 100 : e.key === "ArrowLeft" ? -p * l / 100 : 0 : 0, _ = d ? e.key === "ArrowDown" ? l * 4 : e.key === "ArrowUp" ? l * -4 : 0 : 0;
			if (!m && !_) return;
			let v = ne(t, i), y = Math.max(50, (g(t).minHeight || k(t)) - 76), b = Oo({
				item: i,
				style: o,
				canvasWidth: p,
				fallbackX: v.xPct || 0,
				fallbackY: (v.yPct || 0) / 100 * y
			}), x = jo({
				geometry: b,
				deltaX: m,
				deltaY: _,
				direction: a,
				minimumWidth: s ? p * .1 : p * 1e-4,
				minimumHeight: s ? 80 : 1,
				maximumWidth: a.includes("w") ? b.width + b.x : p - b.x,
				maximumHeight: 900,
				aspectRatioLocked: c || s && o.shape === "circle",
				aspectRatio: o.shape === "circle" ? 1 : b.width / b.height,
				scaleFont: !s
			});
			r("update-renderer-item-style", t, i, {
				...ko(x, p, {
					includeHeight: d && !c && !(s && o.shape === "circle"),
					includeFontSize: !s
				}),
				...!d && !c ? { heightPx: o.heightPx } : {}
			});
		}
		function fe(e, t, i) {
			if (!n.editable || i.isLocked || i.fieldKind !== "text") return;
			e.preventDefault(), e.stopPropagation(), ce(t, i);
			let a = e.currentTarget, s = a.querySelector(".rendered-text, .rendered-empty");
			if (!s) return;
			a.classList.add("is-editing"), s.classList.remove("rendered-empty"), s.classList.add("rendered-text"), s.contentEditable = "true", String(o(t, i) || "").trim() || (s.textContent = ho), s.focus();
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
		function pe(e, t) {
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
		return (t, n) => (q(), J("div", {
			class: M(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-editor-guides": e.editable && e.showGuides
			}]),
			style: se({
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
		}, [e.editable && e.showGuides ? (q(), J("div", Mo)) : Z("", !0), (q(!0), J(K, null, nr(i.value, (t) => (q(), J("section", {
			key: t.sectionKey,
			class: M(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: se(ie(t)),
			"aria-busy": b(t)?.kind === "processing" ? "true" : void 0
		}, [
			e.editable && b(t) ? (q(), J("div", {
				key: 0,
				class: M(["section-ai-state", `is-${b(t).kind}`]),
				role: "status",
				"aria-live": "polite",
				title: b(t).detail || void 0
			}, [b(t).kind === "processing" ? (q(), J("i", Fo)) : Z("", !0), Y("span", null, N(b(t).label), 1)], 10, Po)) : Z("", !0),
			Y("div", Io, [Y("div", {
				class: "rendered-items",
				style: se(ae(t))
			}, [(q(!0), J(K, null, nr(u(t), (r) => (q(), J("article", {
				key: r.itemKey,
				class: M(["rendered-item", [`rendered-item--${r.fieldKind || "text"}`, {
					"is-editable": e.editable && !r.isLocked,
					"is-selected": e.editable && (e.selectedItemKey === m(t, r) || e.selectedItemKeys.includes(m(t, r))),
					"is-free-positioned": !0
				}]]),
				"data-item-key": r.itemKey,
				"data-style-key": m(t, r),
				style: se(oe(t, r)),
				onClick: ro((e) => ce(t, r, e), ["stop"]),
				onPointerdown: (e) => le(e, t, r),
				onDblclick: (e) => fe(e, t, r)
			}, [a(r).length > 1 ? (q(), J("div", Ro, [(q(!0), J(K, null, nr(a(r), (i) => (q(), J(K, { key: i.fieldKey }, [i.fieldKind === "cta" ? (q(), J("a", {
				key: 0,
				class: "rendered-cta rendered-component-field",
				href: f(o(t, r, i)),
				target: o(t, r, i)?.target || "_self",
				rel: o(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, N(o(t, r, i)?.label || i.name), 9, zo)) : i.fieldKind === "image" ? (q(), J("div", Bo, [Y("div", {
				class: "rendered-image-frame rendered-component-image-frame",
				style: se(ee(t, r, i)),
				role: D(t, r, i).role,
				"aria-label": D(t, r, i).label,
				"aria-hidden": D(t, r, i).ariaHidden,
				"aria-busy": b(t, r, i)?.kind === "processing" ? "true" : void 0
			}, [s(o(t, r, i)) ? Z("", !0) : (q(), J("div", Ho, [Y("span", null, N(i.name), 1), n[0] ||= Y("small", null, "이미지 준비 중", -1)]))], 12, Vo), e.editable && b(t, r, i) ? (q(), J("div", {
				key: 0,
				class: M(["item-ai-state", `is-${b(t, r, i).kind}`]),
				role: "status",
				"aria-live": "polite"
			}, [b(t, r, i).kind === "processing" ? (q(), J("i", Uo)) : Z("", !0), Y("span", null, N(b(t, r, i).label), 1)], 2)) : Z("", !0)])) : p(o(t, r, i)) ? (q(), J("p", Wo, N(o(t, r, i)), 1)) : (q(), J("p", Go, N(i.name), 1))], 64))), 128))])) : r.fieldKind === "cta" ? (q(), J("a", {
				key: 1,
				class: "rendered-cta",
				href: f(o(t, r)),
				target: o(t, r)?.target || "_self",
				rel: o(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, N(o(t, r)?.label || r.name), 9, Ko)) : r.fieldKind === "image" ? (q(), J(K, { key: 2 }, [
				Y("div", {
					class: M(["rendered-image-frame", `rendered-image-frame--${h(t, r).shape || "square"}`]),
					style: se(T(t, r)),
					role: te(t, r).role,
					"aria-label": te(t, r).label,
					"aria-hidden": te(t, r).ariaHidden,
					"aria-busy": b(t, r)?.kind === "processing" ? "true" : void 0
				}, [s(o(t, r)) ? Z("", !0) : (q(), J("div", Jo, [Y("span", null, N(r.name), 1), Y("small", null, N(o(t, r)?.value || "이미지 준비 중"), 1)]))], 14, qo),
				e.editable && b(t, r) ? (q(), J("div", {
					key: 0,
					class: M(["item-ai-state", `is-${b(t, r).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: b(t, r).detail || void 0
				}, [b(t, r).kind === "processing" ? (q(), J("i", Xo)) : Z("", !0), Y("span", null, N(b(t, r).label), 1)], 10, Yo)) : Z("", !0),
				e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === m(t, r) ? (q(!0), J(K, { key: 1 }, nr(x(t, r), (e) => (q(), J("button", {
					key: e,
					type: "button",
					class: M(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
					"aria-label": `${r.name} 이미지 ${e} 방향 크기 조절`,
					onPointerdown: ro((n) => ue(n, t, r, e), ["stop"]),
					onKeydown: (n) => de(n, t, r, e)
				}, null, 42, Zo))), 128)) : Z("", !0)
			], 64)) : (q(), J(K, { key: 3 }, [p(o(t, r)) ? (q(), J("p", Qo, N(o(t, r)), 1)) : (q(), J("p", $o, N(r.name), 1))], 64)), e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === m(t, r) ? (q(!0), J(K, { key: 4 }, nr(x(t, r), (e) => (q(), J("button", {
				key: e,
				type: "button",
				class: M(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
				"aria-label": `${r.name} ${e} 방향 크기 조절`,
				onPointerdown: ro((n) => ue(n, t, r, e), ["stop"]),
				onKeydown: (n) => de(n, t, r, e)
			}, null, 42, es))), 128)) : Z("", !0)], 46, Lo))), 128))], 4)]),
			e.editable && e.showGuides ? (q(), J("button", {
				key: 1,
				class: "section-resize-handle",
				type: "button",
				"aria-label": `${t.name} 섹션 높이 조절`,
				title: `${t.name} 섹션 높이 조절`,
				onPointerdown: (e) => pe(e, t)
			}, null, 40, ts)) : Z("", !0)
		], 14, No))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/editor-context.mjs
function rs(e = "editor", t = "") {
	let n = e === "admin-layout", r = e === "wizard-layout", i = r && t === "create-promo", a = n || i;
	return Object.freeze({
		engineKey: "promo-live-preview",
		mode: e,
		source: t,
		surface: n ? "template-default" : i ? "promo-instance" : "standalone",
		isAdminLayout: n,
		isWizardLayout: r,
		isCreatePromo: i,
		isBuilderWorkspace: a,
		capabilities: Object.freeze({
			canEditTemplateDefaults: n,
			canEditPromoContent: i,
			canRunSectionAi: i,
			canRunComponentImageAi: i,
			canRunMultiLayoutAi: a,
			canSaveTemplateLayout: n,
			canSavePromoOverrides: i,
			canOpenWebOutput: !0,
			showsTemplateStatus: a,
			isEmbedded: a || r
		})
	});
}
//#endregion
//#region visual-editor/src/layout-utils.mjs
function is(e) {
	return JSON.parse(JSON.stringify(e));
}
function as(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = as(n[e], t) : n[e] = is(t));
	}), n;
}
function os(e = {}) {
	return ss(mo, e);
}
function ss(e = mo, t = {}) {
	let n = as(is(e || mo), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, Object.values(n.itemStyles).forEach((e) => {
		e && typeof e == "object" && delete e.textAlign;
	}), n.sectionStyles = n.sectionStyles || {}, n;
}
function cs(e = {}) {
	let t = os(e), n = [], r = /* @__PURE__ */ new Set(["contain"]), i = /* @__PURE__ */ new Set([
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
		t?.widthPct !== void 0 && (!Number.isFinite(o) || o < .01 || o > 100) && n.push({
			path: `itemStyles.${e}.widthPct`,
			message: "Component width must be between 0.01 and 100 percent."
		}), t?.heightPx !== void 0 && (!Number.isFinite(u) || u < 1 || u > 900) && n.push({
			path: `itemStyles.${e}.heightPx`,
			message: "Component height must be between 1 and 900."
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
var ls = Object.freeze([
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
]), us = Object.freeze({
	"space-2": 8,
	"space-3": 12,
	"space-4": 16,
	"space-6": 24,
	"space-8": 32
});
function ds(e) {
	return Math.round(Number(e) * 1e3) / 1e3;
}
function fs(e) {
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
function ps(e) {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((n, r) => {
		e.slice(r + 1).forEach((e) => {
			let r = n.xPct < e.xPct + e.widthPct && n.xPct + n.widthPct > e.xPct, i = n.yPx < e.yPx + e.heightPx && n.yPx + n.heightPx > e.yPx;
			r && i && t.add([n.itemKey, e.itemKey].sort().join("|"));
		});
	}), t;
}
function ms(e, t) {
	e.forEach((e) => {
		if (e.xPct < -.001 || e.yPx < -.001 || e.widthPct < .01 || e.widthPct > 100 || e.heightPx < 1 || e.heightPx > 900 || e.xPct + e.widthPct > 100.001 || e.yPx + e.heightPx > t + .001) throw Error(`${e.itemKey} 결과가 섹션 경계를 벗어납니다.`);
	});
}
function hs(e, t) {
	return [...e].sort((e, n) => t === "horizontal" ? e.xPct - n.xPct : e.yPx - n.yPx);
}
function gs(e, t, n = {}) {
	let r = fs(e).map((e) => ({ ...e })), i = String(t?.operation || "");
	if (!ls.includes(i)) throw Error("허용되지 않은 레이아웃 명령입니다.");
	if ([...Array.isArray(t?.targetItemKeys) ? t.targetItemKeys.map(String) : []].sort().join("\n") !== r.map((e) => e.itemKey).sort().join("\n")) throw Error("레이아웃 명령의 대상이 현재 선택과 일치하지 않습니다.");
	let a = Math.max(1, Number(n.canvasWidthPx || 1280)), o = Math.max(80, Number(n.canvasHeightPx || 900)), s = us[t?.gapToken || "space-4"];
	if (s === void 0) throw Error("허용되지 않은 gap token입니다.");
	let c = ps(r), l = Math.min(...r.map((e) => e.xPct)), u = Math.max(...r.map((e) => e.xPct + e.widthPct)), d = Math.min(...r.map((e) => e.yPx)), f = Math.max(...r.map((e) => e.yPx + e.heightPx));
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
		let e = hs(r, "horizontal"), t = u - l - e.reduce((e, t) => e + t.widthPct, 0);
		if (t < 0) throw Error("가로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = l;
		e.forEach((e) => {
			e.xPct = i, i += e.widthPct + n;
		});
	}
	if (i === "distribute-vertical") {
		let e = hs(r, "vertical"), t = f - d - e.reduce((e, t) => e + t.heightPx, 0);
		if (t < 0) throw Error("세로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = d;
		e.forEach((e) => {
			e.yPx = i, i += e.heightPx + n;
		});
	}
	if (i === "set-gap" || i === "group-stack-horizontal" || i === "group-stack-vertical") {
		let e = i === "group-stack-horizontal" ? "horizontal" : i === "group-stack-vertical" ? "vertical" : t?.axis;
		if (!["horizontal", "vertical"].includes(e)) throw Error("간격 적용 방향이 필요합니다.");
		let n = hs(r, e), o = e === "horizontal" ? l : d;
		n.forEach((t) => {
			e === "horizontal" ? (t.xPct = o, o += t.widthPct + s / a * 100) : (t.yPx = o, o += t.heightPx + s);
		});
	}
	r.forEach((e) => {
		e.xPct = ds(e.xPct), e.yPx = ds(e.yPx), e.widthPct = ds(e.widthPct), e.heightPx = ds(e.heightPx);
	}), ms(r, o);
	let p = [...ps(r)].find((e) => !c.has(e));
	if (p) throw Error(`레이아웃 결과에 새 충돌이 발생했습니다: ${p}`);
	return r;
}
function _s(e) {
	return Object.fromEntries(fs(e).map((e) => [e.itemKey, {
		positionMode: "free",
		xPct: ds(e.xPct),
		yPx: ds(e.yPx),
		widthPct: ds(e.widthPct),
		heightPx: ds(e.heightPx)
	}]));
}
function vs(e, t, n = {}) {
	try {
		return {
			geometry: gs(e, t, n),
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
					geometry: gs(e, o, n),
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
//#region visual-editor/src/platform/adapters/admin-template-adapter.mjs
function ys(e, t, n) {
	return Error(e?.message || e?.error || `${t}${n ? `(${n})` : ""}`);
}
async function bs(e) {
	return e.json().catch(() => ({}));
}
function xs({ fetchImpl: e = globalThis.fetch } = {}) {
	if (typeof e != "function") throw TypeError("fetchImpl must be a function");
	return Object.freeze({
		async loadLayout(t) {
			if (!t) throw Error("templateId가 필요합니다.");
			let n = await e(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(t)}`), r = await bs(n);
			if (!n.ok) throw ys(r, "기본 레이아웃을 불러오지 못했습니다.", n.status);
			return r;
		},
		async saveLayout(t) {
			let n = await e("/api/wizard-form-template-layout", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			}), r = await bs(n);
			if (!n.ok) throw ys(r, "레이아웃 저장 오류", n.status);
			return r;
		},
		async activateTemplate(t) {
			let n = await e("/api/wizard-form-template-activate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			}), r = await bs(n);
			if (!n.ok) throw ys(r, "템플릿 활성화 오류", n.status);
			return r;
		}
	});
}
//#endregion
//#region visual-editor/src/platform/adapters/promo-builder-adapter.mjs
var Ss = Object.freeze({
	READY: "promo-wizard-layout-ready",
	SNAPSHOT: "promo-wizard-layout-snapshot",
	CHANGE: "promo-wizard-layout-change",
	AUTO_REGISTER_REQUEST: "create-promo-auto-register-request",
	AUTO_REGISTER_RESULT: "create-promo-auto-register-result",
	SECTION_AI_ACTION: "create-promo-section-ai-action",
	REMOVE_IMAGE: "create-promo-remove-image"
});
function Cs(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function ws({ hostWindow: e = globalThis.window, allowedOrigin: t = e?.location?.origin } = {}) {
	if (!e?.parent || !t) throw Error("Promo Builder host window is unavailable");
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		e.origin === t && n.forEach((t) => t(e.data));
	};
	return Object.freeze({
		connect(t) {
			if (typeof t != "function") throw TypeError("listener must be a function");
			return n.add(t), n.size === 1 && e.addEventListener("message", r), () => {
				n.delete(t), n.size || e.removeEventListener("message", r);
			};
		},
		disconnect() {
			n.clear(), e.removeEventListener("message", r);
		},
		notifyReady() {
			e.parent.postMessage({ type: Ss.READY }, t);
		},
		notifyChange({ snapshotRevision: n, designSpec: r, sectionInputs: i }) {
			e.parent.postMessage({
				type: Ss.CHANGE,
				snapshotRevision: n,
				designSpec: Cs(r),
				sectionInputs: Cs(i)
			}, t);
		},
		requestAutoRegister(n) {
			e.parent.postMessage({
				type: Ss.AUTO_REGISTER_REQUEST,
				sectionInputs: Cs(n)
			}, t);
		},
		requestSectionAiAction({ sectionKey: n, action: r, targetType: i, targetItemKey: a, targetFieldKey: o }) {
			e.parent.postMessage({
				type: Ss.SECTION_AI_ACTION,
				sectionKey: n,
				action: r,
				targetType: i,
				targetItemKey: String(a || "").trim() || null,
				targetFieldKey: String(o || "").trim() || null
			}, t);
		},
		requestImageRemoval({ sectionKey: n, itemKey: r, fieldKey: i }) {
			e.parent.postMessage({
				type: Ss.REMOVE_IMAGE,
				sectionKey: n,
				itemKey: r,
				fieldKey: i || null
			}, t);
		}
	});
}
//#endregion
//#region visual-editor/src/platform/adapters/output-adapter.mjs
function Ts({ storage: e = globalThis.localStorage, openWindow: t = globalThis.window?.open?.bind(globalThis.window), storageKey: n, outputUrl: r = "/prototype/visual-output.html" } = {}) {
	if (!n) throw Error("storageKey is required");
	return Object.freeze({
		save(t) {
			return wo(e, n, t);
		},
		load() {
			let t = e.getItem(n);
			if (!t) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
			return JSON.parse(t);
		},
		open() {
			if (typeof t != "function") throw Error("Web Output 창을 열 수 없습니다.");
			t(r, "_blank", "noopener");
		}
	});
}
//#endregion
//#region visual-editor/src/platform/editor-core/editor-commands.mjs
var $ = Object.freeze({
	CONTENT_VALUE_SET: "CONTENT_VALUE_SET",
	ITEM_STYLE_PATCH: "ITEM_STYLE_PATCH",
	ITEM_STYLE_REPLACE: "ITEM_STYLE_REPLACE",
	ITEM_STYLE_REMOVE: "ITEM_STYLE_REMOVE",
	SECTION_STYLE_PATCH: "SECTION_STYLE_PATCH",
	SECTION_STYLE_REPLACE: "SECTION_STYLE_REPLACE",
	SECTION_STYLE_REMOVE: "SECTION_STYLE_REMOVE",
	THEME_STYLE_PATCH: "THEME_STYLE_PATCH",
	LAYOUT_REPLACE: "LAYOUT_REPLACE"
});
function Es(e, t = {}, n = {}) {
	return {
		id: String(n.id || `${e}:${Date.now()}:${Math.random().toString(16).slice(2)}`),
		type: e,
		payload: t,
		source: String(n.source || "ui"),
		label: String(n.label || e),
		timestamp: Number(n.timestamp || Date.now())
	};
}
//#endregion
//#region visual-editor/src/platform/editor-core/editor-state.mjs
function Ds(e) {
	return JSON.parse(JSON.stringify(e ?? null));
}
function Os({ layout: e = {}, content: t = {}, metadata: n = {} } = {}) {
	return {
		contractVersion: 1,
		layout: Ds(e) || {},
		content: Ds(t) || {},
		metadata: Ds(n) || {}
	};
}
function ks(e = Os()) {
	return {
		document: Os(e),
		revision: 0,
		lastCommand: null,
		dirty: !1
	};
}
function As(e) {
	return {
		...e,
		document: Os(e.document),
		lastCommand: e.lastCommand ? Ds(e.lastCommand) : null
	};
}
//#endregion
//#region visual-editor/src/platform/editor-core/command-reducer.mjs
function js(e = {}) {
	return Object.fromEntries(Object.entries(e).filter(([, e]) => e !== void 0));
}
function Ms(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t).forEach(([e, t]) => {
		t === void 0 ? delete n[e] : n[e] = t;
	}), n;
}
function Ns(e, t, n, r) {
	return {
		...e,
		[t]: {
			...e?.[t] || {},
			[n]: r
		}
	};
}
function Ps(e, t) {
	let n = As(e), r = n.document.layout || {}, i = n.document.content || {}, a = t?.payload || {};
	switch (t?.type) {
		case $.CONTENT_VALUE_SET:
			if (!a.sectionKey || !a.itemKey) return {
				ok: !1,
				state: e,
				error: "Content target is required."
			};
			n.document.content = Ns(i, a.sectionKey, a.itemKey, a.value);
			break;
		case $.ITEM_STYLE_PATCH: {
			if (!a.styleKey) return {
				ok: !1,
				state: e,
				error: "Item style key is required."
			};
			let t = r.itemStyles?.[a.styleKey] || {};
			n.document.layout = {
				...r,
				itemStyles: {
					...r.itemStyles || {},
					[a.styleKey]: Ms(t, a.patch)
				}
			};
			break;
		}
		case $.ITEM_STYLE_REPLACE:
			if (!a.styleKey) return {
				ok: !1,
				state: e,
				error: "Item style key is required."
			};
			n.document.layout = {
				...r,
				itemStyles: {
					...r.itemStyles || {},
					[a.styleKey]: js(a.style || {})
				}
			};
			break;
		case $.ITEM_STYLE_REMOVE: {
			if (!a.styleKey) return {
				ok: !1,
				state: e,
				error: "Item style key is required."
			};
			let t = { ...r.itemStyles || {} };
			delete t[a.styleKey], n.document.layout = {
				...r,
				itemStyles: t
			};
			break;
		}
		case $.SECTION_STYLE_PATCH: {
			if (!a.sectionKey) return {
				ok: !1,
				state: e,
				error: "Section key is required."
			};
			let t = r.sectionStyles?.[a.sectionKey] || {};
			n.document.layout = {
				...r,
				sectionStyles: {
					...r.sectionStyles || {},
					[a.sectionKey]: Ms(t, a.patch)
				}
			};
			break;
		}
		case $.SECTION_STYLE_REPLACE:
			if (!a.sectionKey) return {
				ok: !1,
				state: e,
				error: "Section key is required."
			};
			n.document.layout = {
				...r,
				sectionStyles: {
					...r.sectionStyles || {},
					[a.sectionKey]: js(a.style || {})
				}
			};
			break;
		case $.SECTION_STYLE_REMOVE: {
			if (!a.sectionKey) return {
				ok: !1,
				state: e,
				error: "Section key is required."
			};
			let t = { ...r.sectionStyles || {} };
			delete t[a.sectionKey], n.document.layout = {
				...r,
				sectionStyles: t
			};
			break;
		}
		case $.THEME_STYLE_PATCH:
			n.document.layout = {
				...r,
				theme: js({
					...r.theme || {},
					...a.patch || {}
				})
			};
			break;
		case $.LAYOUT_REPLACE:
			n.document = Os({
				...n.document,
				layout: a.layout || {}
			});
			break;
		default: return {
			ok: !1,
			state: e,
			error: `Unsupported editor command: ${t?.type || "unknown"}`
		};
	}
	return n.revision = Number(e.revision || 0) + 1, n.lastCommand = t, n.dirty = !0, {
		ok: !0,
		state: n
	};
}
//#endregion
//#region visual-editor/src/platform/editor-core/create-editor-store.mjs
function Fs(e = Os(), { historyLimit: t = 50 } = {}) {
	let n = ks(e), r = [], i = [];
	function a() {
		return As(n);
	}
	function o(e, { resetHistory: t = !0, dirty: a } = {}) {
		let o = t ? 0 : n.revision;
		return n = {
			...ks(e),
			revision: o,
			dirty: a ?? (!t && n.dirty)
		}, t && (r = [], i = []), d();
	}
	function s(e) {
		let o = a(), s = Ps(n, e);
		return s.ok ? (r = [...r.slice(-(t - 1)), o], i = [], n = s.state, {
			ok: !0,
			state: d(),
			history: f()
		}) : {
			...s,
			history: f()
		};
	}
	function c() {
		let e = r.at(-1);
		return e ? (i = [...i.slice(-(t - 1)), a()], r = r.slice(0, -1), n = As(e), {
			ok: !0,
			state: d(),
			history: f()
		}) : {
			ok: !1,
			state: d(),
			history: f(),
			error: "Nothing to undo."
		};
	}
	function l() {
		let e = i.at(-1);
		return e ? (r = [...r.slice(-(t - 1)), a()], i = i.slice(0, -1), n = As(e), {
			ok: !0,
			state: d(),
			history: f()
		}) : {
			ok: !1,
			state: d(),
			history: f(),
			error: "Nothing to redo."
		};
	}
	function u() {
		return n = {
			...n,
			dirty: !1
		}, d();
	}
	function d() {
		return As(n);
	}
	function f() {
		return {
			undoCount: r.length,
			redoCount: i.length,
			canUndo: r.length > 0,
			canRedo: i.length > 0
		};
	}
	return Object.freeze({
		execute: s,
		undo: c,
		redo: l,
		replaceDocument: o,
		markSaved: u,
		getState: d,
		getHistoryState: f
	});
}
//#endregion
//#region visual-editor/src/platform/editor-ui/EditorPreviewControls.vue
var Is = { class: "preview-controls" }, Ls = {
	class: "editor-history-actions",
	"aria-label": "편집 기록"
}, Rs = ["disabled"], zs = ["disabled"], Bs = { class: "guide-toggle" }, Vs = ["checked"], Hs = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, Us = {
	__name: "EditorPreviewControls",
	props: {
		canUndo: {
			type: Boolean,
			default: !1
		},
		canRedo: {
			type: Boolean,
			default: !1
		},
		guidesVisible: {
			type: Boolean,
			default: !0
		},
		viewport: {
			type: String,
			default: "desktop"
		}
	},
	emits: [
		"undo",
		"redo",
		"update:guidesVisible",
		"update:viewport"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (q(), J("div", Is, [
			Y("div", Ls, [Y("button", {
				type: "button",
				class: "secondary-control",
				disabled: !e.canUndo,
				onClick: r[0] ||= (e) => n("undo")
			}, "실행 취소", 8, Rs), Y("button", {
				type: "button",
				class: "secondary-control",
				disabled: !e.canRedo,
				onClick: r[1] ||= (e) => n("redo")
			}, "다시 실행", 8, zs)]),
			rr(t.$slots, "tokens"),
			rr(t.$slots, "host-actions"),
			Y("label", Bs, [
				Y("input", {
					checked: e.guidesVisible,
					type: "checkbox",
					onChange: r[2] ||= (e) => n("update:guidesVisible", e.target.checked)
				}, null, 40, Vs),
				r[5] ||= Y("span", null, "Guides", -1),
				Y("strong", null, N(e.guidesVisible ? "ON" : "OFF"), 1)
			]),
			Y("div", Hs, [Y("button", {
				type: "button",
				class: M({ active: e.viewport === "desktop" }),
				onClick: r[3] ||= (e) => n("update:viewport", "desktop")
			}, "Desktop", 2), Y("button", {
				type: "button",
				class: M({ active: e.viewport === "mobile" }),
				onClick: r[4] ||= (e) => n("update:viewport", "mobile")
			}, "Mobile", 2)])
		]));
	}
}, Ws = { class: "preview-panel" }, Gs = { class: "preview-toolbar" }, Ks = { class: "preview-title-group" }, qs = ["disabled"], Js = {
	key: 1,
	class: "preview-edit-hint"
}, Ys = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, Xs = {
	key: 0,
	class: "global-token-menu"
}, Zs = { class: "global-token-swatches" }, Qs = [
	"title",
	"aria-label",
	"onClick"
], $s = {
	key: 0,
	class: "admin-layout-actions"
}, ec = ["value"], tc = ["disabled"], nc = ["disabled"], rc = ["disabled"], ic = {
	__name: "PreviewPanel",
	props: {
		rendererSnapshot: {
			type: Object,
			default: null
		},
		sectionDesignRuns: {
			type: Object,
			default: () => ({})
		},
		guidesVisible: {
			type: Boolean,
			default: !0
		},
		viewport: {
			type: String,
			default: "desktop"
		},
		templateIdentityLabel: {
			type: String,
			default: ""
		},
		capabilities: {
			type: Object,
			required: !0
		},
		autoRegisterPending: {
			type: Boolean,
			default: !1
		},
		autoRegisterMessage: {
			type: String,
			default: ""
		},
		editorHistory: {
			type: Object,
			required: !0
		},
		designSpec: {
			type: Object,
			required: !0
		},
		designColorTokens: {
			type: Array,
			default: () => []
		},
		layoutChangeNote: {
			type: String,
			default: ""
		},
		layoutSaving: {
			type: Boolean,
			default: !1
		},
		editorSnapshot: {
			type: Object,
			default: null
		},
		template: {
			type: Object,
			default: null
		},
		selectedStyleKey: {
			type: String,
			default: ""
		},
		selectedItemKeys: {
			type: Array,
			default: () => []
		},
		selectedSection: {
			type: Object,
			default: null
		}
	},
	emits: [
		"update:guides-visible",
		"update:viewport",
		"update:layout-change-note",
		"request-auto-register",
		"undo",
		"redo",
		"update-background-token",
		"save-admin-layout",
		"open-output",
		"select-item",
		"update-item-style",
		"update-renderer-item-style",
		"update-item-content",
		"update-section-style"
	],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = /* @__PURE__ */ W(null);
		function a(e, t = "smooth") {
			if (!e || !i.value) return !1;
			let n = i.value.querySelector(`[data-section-key="${CSS.escape(e)}"]`);
			if (!n) return !1;
			let r = i.value.getBoundingClientRect(), a = n.getBoundingClientRect();
			return i.value.scrollTo({
				top: Math.max(0, i.value.scrollTop + a.top - r.top),
				behavior: t
			}), !0;
		}
		function o() {
			return i.value;
		}
		return t({
			getStageElement: o,
			scrollToSection: a
		}), (t, n) => (q(), J("section", Ws, [Y("div", Gs, [Y("div", Ks, [
			n[14] ||= Y("strong", null, "Live Preview", -1),
			Y("small", null, N(e.templateIdentityLabel), 1),
			e.capabilities.canEditPromoContent ? (q(), J("button", {
				key: 0,
				class: "auto-register-action",
				type: "button",
				disabled: e.autoRegisterPending,
				onClick: n[0] ||= (e) => r("request-auto-register")
			}, N(e.autoRegisterPending ? "등록 중" : "자동등록"), 9, qs)) : Z("", !0),
			e.capabilities.canEditPromoContent ? (q(), J("small", Js, "미리보기 요소를 선택해 내용을 입력하세요.")) : Z("", !0),
			e.autoRegisterMessage ? (q(), J("small", Ys, N(e.autoRegisterMessage), 1)) : Z("", !0)
		]), X(Us, {
			"guides-visible": e.guidesVisible,
			viewport: e.viewport,
			"can-undo": e.editorHistory.canUndo,
			"can-redo": e.editorHistory.canRedo,
			"onUpdate:guidesVisible": n[5] ||= (e) => r("update:guides-visible", e),
			"onUpdate:viewport": n[6] ||= (e) => r("update:viewport", e),
			onUndo: n[7] ||= (e) => r("undo"),
			onRedo: n[8] ||= (e) => r("redo")
		}, {
			tokens: _n(() => [e.capabilities.canEditTemplateDefaults ? (q(), J("fieldset", Xs, [n[15] ||= Y("legend", null, "페이지 배경", -1), Y("div", Zs, [(q(!0), J(K, null, nr(e.designColorTokens, (t) => (q(), J("button", {
				key: t.key,
				type: "button",
				class: M({ active: e.designSpec.theme.backgroundColor === t.value }),
				title: `${t.name} ${t.value}`,
				"aria-label": `${t.name} ${t.value}`,
				onClick: (e) => r("update-background-token", t)
			}, [Y("i", { style: se({ backgroundColor: t.value }) }, null, 4)], 10, Qs))), 128))])])) : Z("", !0)]),
			"host-actions": _n(() => [e.capabilities.canSaveTemplateLayout ? (q(), J("div", $s, [
				Y("input", {
					value: e.layoutChangeNote,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유",
					onInput: n[1] ||= (e) => r("update:layout-change-note", e.target.value)
				}, null, 40, ec),
				Y("button", {
					type: "button",
					disabled: !e.editorSnapshot || e.layoutSaving || e.template?.status !== "draft",
					onClick: n[2] ||= (e) => r("save-admin-layout", !1)
				}, N(e.layoutSaving ? "저장 중" : "초안 저장"), 9, tc),
				Y("button", {
					type: "button",
					class: "is-primary",
					disabled: !e.editorSnapshot || e.layoutSaving || e.template?.status !== "draft",
					onClick: n[3] ||= (e) => r("save-admin-layout", !0)
				}, "저장 후 활성화", 8, nc)
			])) : Z("", !0), e.capabilities.canOpenWebOutput ? (q(), J("button", {
				key: 1,
				type: "button",
				class: "web-output-action",
				disabled: !e.editorSnapshot,
				onClick: n[4] ||= (e) => r("open-output")
			}, "Web Output", 8, rc)) : Z("", !0)]),
			_: 1
		}, 8, [
			"guides-visible",
			"viewport",
			"can-undo",
			"can-redo"
		])]), Y("div", {
			ref_key: "previewStageRef",
			ref: i,
			class: M(["preview-stage", `preview-stage--${e.viewport}`])
		}, [e.rendererSnapshot ? (q(), Di(ns, {
			key: 0,
			content: e.rendererSnapshot.content,
			"design-spec": e.rendererSnapshot.designSpec,
			assets: e.rendererSnapshot.assets,
			"section-design-runs": e.sectionDesignRuns,
			editable: "",
			"show-guides": e.guidesVisible,
			"selected-item-key": e.selectedStyleKey,
			"selected-item-keys": e.selectedItemKeys.map((t) => `${e.selectedSection?.sectionKey}.${t}`),
			onSelectItem: n[9] ||= (...e) => r("select-item", ...e),
			onUpdateItemStyle: n[10] ||= (...e) => r("update-item-style", ...e),
			onUpdateRendererItemStyle: n[11] ||= (...e) => r("update-renderer-item-style", ...e),
			onUpdateItemContent: n[12] ||= (...e) => r("update-item-content", ...e),
			onUpdateSectionStyle: n[13] ||= (...e) => r("update-section-style", ...e)
		}, null, 8, [
			"content",
			"design-spec",
			"assets",
			"section-design-runs",
			"show-guides",
			"selected-item-key",
			"selected-item-keys"
		])) : Z("", !0)], 2)]));
	}
}, ac = {
	class: "section-properties",
	"aria-label": "섹션 속성"
}, oc = { class: "section-properties__heading" }, sc = {
	key: 0,
	class: "section-ai-actions"
}, cc = ["disabled"], lc = ["disabled", "title"], uc = {
	key: 1,
	class: "section-background-alignment"
}, dc = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, fc = ["onClick"], pc = {
	key: 2,
	class: "section-background-fade"
}, mc = ["value"], hc = { key: 0 }, gc = ["value"], _c = { class: "section-size-control" }, vc = ["disabled"], yc = {
	__name: "SectionProperties",
	props: {
		section: {
			type: Object,
			required: !0
		},
		sectionStyle: {
			type: Object,
			default: () => ({})
		},
		canRunSectionAi: {
			type: Boolean,
			default: !1
		},
		primaryAction: {
			type: Object,
			default: () => ({
				action: "generate",
				label: "AI 배경 이미지 생성",
				disabled: !1
			})
		},
		hasAiBackground: {
			type: Boolean,
			default: !1
		},
		aiProcessing: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"ai-action",
		"background-alignment",
		"background-fade",
		"update-style",
		"reset-height"
	],
	setup(e) {
		return (t, n) => (q(), J("section", ac, [
			Y("div", oc, [n[6] ||= Y("strong", null, "섹션 속성", -1), Y("small", null, N(e.section.name), 1)]),
			e.canRunSectionAi ? (q(), J("div", sc, [
				e.section.aiDesign?.enabled === !1 ? Z("", !0) : (q(), J("button", {
					key: 0,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					onClick: n[0] ||= (e) => t.$emit("ai-action", "generate-layout", "", "layout")
				}, "AI 레이아웃 제안", 8, cc)),
				e.section.aiDesign?.enabled !== !1 && e.section.aiDesign?.allowSectionBackground !== !1 ? (q(), J("button", {
					key: 1,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					title: e.primaryAction.disabled && !e.aiProcessing ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
					onClick: n[1] ||= (n) => t.$emit("ai-action", e.primaryAction.action, "", "section-background")
				}, N(e.primaryAction.label), 9, lc)) : Z("", !0),
				e.hasAiBackground ? (q(), J("button", {
					key: 2,
					type: "button",
					class: "section-ai-remove",
					onClick: n[2] ||= (e) => t.$emit("ai-action", "remove-background")
				}, "배경 삭제")) : Z("", !0)
			])) : Z("", !0),
			e.hasAiBackground ? (q(), J("div", uc, [n[7] ||= Y("span", null, "배경 이미지 정렬", -1), Y("div", dc, [(q(), J(K, null, nr([
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
			], (n) => Y("button", {
				key: n.value,
				type: "button",
				class: M({ active: (e.sectionStyle.backgroundPosition || "center center") === `${n.value} center` }),
				onClick: (e) => t.$emit("background-alignment", n.value)
			}, N(n.label), 11, fc)), 64))])])) : Z("", !0),
			e.hasAiBackground || e.section.aiDesign?.enabled !== !1 ? (q(), J("div", pc, [Y("label", null, [n[9] ||= Y("span", null, "배경 이미지 페이드", -1), Y("select", {
				value: e.sectionStyle.backgroundFadeMode || "none",
				onChange: n[3] ||= (e) => t.$emit("background-fade", e.target.value)
			}, [...n[8] ||= [
				Y("option", { value: "none" }, "페이드 없음", -1),
				Y("option", { value: "left" }, "왼쪽 페이드", -1),
				Y("option", { value: "right" }, "오른쪽 페이드", -1),
				Y("option", { value: "both" }, "양끝 페이드", -1)
			]], 40, mc)]), (e.sectionStyle.backgroundFadeMode || "none") === "none" ? Z("", !0) : (q(), J("label", hc, [n[11] ||= Y("span", null, "페이드 강도", -1), Y("select", {
				value: e.sectionStyle.backgroundFadeStrength || "medium",
				onChange: n[4] ||= (e) => t.$emit("update-style", { backgroundFadeStrength: e.target.value })
			}, [...n[10] ||= [
				Y("option", { value: "soft" }, "약하게", -1),
				Y("option", { value: "medium" }, "보통", -1),
				Y("option", { value: "strong" }, "강하게", -1)
			]], 40, gc)]))])) : Z("", !0),
			Y("div", _c, [Y("div", null, [n[12] ||= Y("span", null, "섹션 높이", -1), Y("strong", null, N(e.sectionStyle.minHeight ? `${Math.round(e.sectionStyle.minHeight)}px` : "자동"), 1)]), Y("button", {
				type: "button",
				disabled: !e.sectionStyle.minHeight,
				onClick: n[5] ||= (e) => t.$emit("reset-height")
			}, " 높이 초기화 ", 8, vc)])
		]));
	}
}, bc = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, xc = { class: "panel-heading" }, Sc = { class: "section-list" }, Cc = [
	"aria-expanded",
	"aria-controls",
	"onClick"
], wc = ["aria-label"], Tc = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, Ec = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, Dc = ["id"], Oc = {
	__name: "SectionPanel",
	props: {
		sections: {
			type: Array,
			default: () => []
		},
		selectedSection: {
			type: Object,
			default: null
		},
		selectedSectionStyle: {
			type: Object,
			default: () => ({})
		},
		capabilities: {
			type: Object,
			required: !0
		},
		sectionContentRegistered: {
			type: Function,
			required: !0
		},
		sectionAiPrimaryAction: {
			type: Function,
			required: !0
		},
		sectionHasAiBackground: {
			type: Function,
			required: !0
		},
		sectionAiIsProcessing: {
			type: Function,
			required: !0
		}
	},
	emits: [
		"select-section",
		"section-ai-action",
		"background-alignment",
		"background-fade",
		"update-section-style",
		"reset-section-height"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (q(), J("aside", bc, [Y("div", xc, [r[3] ||= Y("span", null, "SECTIONS", -1), Y("strong", null, N(e.sections.length), 1)]), Y("div", Sc, [(q(!0), J(K, null, nr(e.sections, (t) => (q(), J("section", {
			key: t.sectionKey,
			class: M(["section-nav-item", { active: t.sectionKey === e.selectedSection?.sectionKey }])
		}, [Y("button", {
			type: "button",
			class: M(["section-trigger", { active: t.sectionKey === e.selectedSection?.sectionKey }]),
			"aria-expanded": t.sectionKey === e.selectedSection?.sectionKey,
			"aria-controls": `section-properties-${t.sectionKey}`,
			onClick: (e) => n("select-section", t)
		}, [Y("span", null, N(t.name), 1), (q(), J("svg", {
			class: M(["section-registration-icon", e.sectionContentRegistered(t) ? "is-complete" : "is-incomplete"]),
			viewBox: "0 0 20 20",
			role: "img",
			"aria-label": e.sectionContentRegistered(t) ? `${t.name} 콘텐츠 등록 완료` : `${t.name} 콘텐츠 등록 필요`
		}, [r[4] ||= Y("circle", {
			cx: "10",
			cy: "10",
			r: "9"
		}, null, -1), e.sectionContentRegistered(t) ? (q(), J("path", Tc)) : (q(), J("path", Ec))], 10, wc))], 10, Cc), t.sectionKey === e.selectedSection?.sectionKey ? (q(), J("div", {
			key: 0,
			id: `section-properties-${t.sectionKey}`,
			class: "section-property-accordion"
		}, [X(yc, {
			section: t,
			"section-style": e.selectedSectionStyle,
			"can-run-section-ai": e.capabilities.canRunSectionAi,
			"primary-action": e.sectionAiPrimaryAction(t),
			"has-ai-background": e.sectionHasAiBackground(t),
			"ai-processing": e.sectionAiIsProcessing(t),
			onAiAction: (e, r, i) => n("section-ai-action", t, e, r, i),
			onBackgroundAlignment: r[0] ||= (e) => n("background-alignment", e),
			onBackgroundFade: r[1] ||= (e) => n("background-fade", e),
			onUpdateStyle: (e) => n("update-section-style", t.sectionKey, e),
			onResetHeight: r[2] ||= (e) => n("reset-section-height")
		}, null, 8, [
			"section",
			"section-style",
			"can-run-section-ai",
			"primary-action",
			"has-ai-background",
			"ai-processing",
			"onAiAction",
			"onUpdateStyle"
		])], 8, Dc)) : Z("", !0)], 2))), 128))])]));
	}
}, kc = { class: "multi-layout-panel" }, Ac = { class: "multi-layout-panel__heading" }, jc = ["disabled"], Mc = { class: "multi-layout-panel__actions" }, Nc = ["disabled"], Pc = ["disabled"], Fc = {
	key: 0,
	class: "multi-layout-error",
	role: "alert"
}, Ic = {
	key: 1,
	class: "multi-layout-preview"
}, Lc = {
	key: 0,
	class: "multi-layout-adjustment"
}, Rc = { key: 1 }, zc = { class: "multi-layout-preview__comparison" }, Bc = { class: "multi-layout-panel__actions" }, Vc = {
	__name: "AiLayoutControls",
	props: {
		selectedCount: {
			type: Number,
			default: 0
		},
		revision: {
			type: Number,
			default: 0
		},
		planning: {
			type: Boolean,
			default: !1
		},
		error: {
			type: String,
			default: ""
		},
		suggestion: {
			type: Object,
			default: null
		},
		undoCount: {
			type: Number,
			default: 0
		},
		operationLabel: {
			type: Function,
			required: !0
		}
	},
	emits: [
		"clear-selection",
		"request-suggestion",
		"undo",
		"apply-suggestion",
		"dismiss-suggestion"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			return e?.after?.find((e) => e.itemKey === t) || {};
		}
		return (t, i) => (q(), J("section", kc, [
			Y("div", Ac, [Y("div", null, [i[5] ||= Y("strong", null, "AI 다중 정렬", -1), Y("small", null, N(e.selectedCount) + "개 컴포넌트 선택 · revision " + N(e.revision), 1)]), Y("button", {
				type: "button",
				disabled: e.selectedCount <= 1,
				onClick: i[0] ||= (e) => n("clear-selection")
			}, "선택 초기화", 8, jc)]),
			i[6] ||= Y("p", null, "아래 체크박스 또는 Ctrl/Cmd+미리보기 클릭으로 같은 섹션의 컴포넌트를 2개 이상 선택하세요.", -1),
			Y("div", Mc, [Y("button", {
				type: "button",
				class: "section-ai-action",
				disabled: e.selectedCount < 2 || e.planning,
				onClick: i[1] ||= (e) => n("request-suggestion")
			}, N(e.planning ? "AI 제안 생성 중" : "AI 정렬 제안"), 9, Nc), Y("button", {
				type: "button",
				disabled: !e.undoCount,
				onClick: i[2] ||= (e) => n("undo")
			}, "마지막 적용 취소", 8, Pc)]),
			e.error ? (q(), J("p", Fc, N(e.error), 1)) : Z("", !0),
			e.suggestion ? (q(), J("div", Ic, [
				Y("strong", null, N(e.operationLabel(e.suggestion.operation)), 1),
				Y("span", null, N(e.suggestion.rationale), 1),
				e.suggestion.adjusted ? (q(), J("span", Lc, N(e.suggestion.adjustmentReason), 1)) : Z("", !0),
				e.suggestion.gapToken ? (q(), J("small", Rc, "간격: " + N(e.suggestion.gapToken), 1)) : Z("", !0),
				Y("div", zc, [(q(!0), J(K, null, nr(e.suggestion.before, (t) => (q(), J("div", { key: t.itemKey }, [
					Y("b", null, N(t.itemKey), 1),
					Y("span", null, "전 X " + N(Math.round(t.xPct)) + "% · Y " + N(Math.round(t.yPx)) + "px", 1),
					Y("span", null, "후 X " + N(Math.round(r(e.suggestion, t.itemKey).xPct || 0)) + "% · Y " + N(Math.round(r(e.suggestion, t.itemKey).yPx || 0)) + "px", 1)
				]))), 128))]),
				Y("div", Bc, [Y("button", {
					type: "button",
					class: "section-ai-action",
					onClick: i[3] ||= (e) => n("apply-suggestion")
				}, "제안 적용"), Y("button", {
					type: "button",
					onClick: i[4] ||= (e) => n("dismiss-suggestion")
				}, "취소")])
			])) : Z("", !0)
		]));
	}
}, Hc = { class: "property-panel" }, Uc = { class: "panel-heading" }, Wc = {
	key: 0,
	class: "property-form"
}, Gc = {
	__name: "PropertyPanel",
	props: { selectedSection: {
		type: Object,
		default: null
	} },
	setup(e) {
		return (t, n) => (q(), J("aside", Hc, [Y("div", Uc, [n[0] ||= Y("span", null, "COMPONENTS", -1), Y("strong", null, N(e.selectedSection?.name || "섹션 선택"), 1)]), e.selectedSection ? (q(), J("div", Wc, [rr(t.$slots, "ai-controls"), rr(t.$slots, "default")])) : Z("", !0)]));
	}
}, Kc = {
	key: 0,
	class: "output-shell"
}, qc = { class: "output-toolbar" }, Jc = {
	key: 0,
	class: "system-message system-message--error"
}, Yc = ["data-shell-frame"], Xc = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, Zc = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, Qc = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], $c = ["data-lucide"], el = { "data-shell-nav-label": "" }, tl = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, nl = { class: "shell-page-identity" }, rl = { class: "shell-page-actions" }, il = {
	class: "shell-status",
	role: "status"
}, al = {
	key: 0,
	class: "editor-header editor-toolbar"
}, ol = {
	key: 0,
	class: "editor-mode-note"
}, sl = { class: "editor-global-actions" }, cl = {
	key: 0,
	class: "global-token-menu"
}, ll = { class: "global-token-swatches" }, ul = [
	"title",
	"aria-label",
	"onClick"
], dl = {
	key: 1,
	"aria-label": "Visual Editor navigation"
}, fl = ["disabled"], pl = {
	key: 1,
	class: "system-message"
}, ml = {
	key: 2,
	class: "system-message system-message--error"
}, hl = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, gl = {
	key: 4,
	class: "system-message",
	role: "status"
}, _l = { class: "component-property-list" }, vl = { class: "component-property-header" }, yl = ["title"], bl = [
	"checked",
	"disabled",
	"aria-label",
	"onChange"
], xl = ["aria-expanded", "onClick"], Sl = { class: "component-property-body" }, Cl = {
	key: 0,
	class: "component-property-content"
}, wl = {
	key: 0,
	class: "component-field-property-list"
}, Tl = [
	"disabled",
	"value",
	"onInput"
], El = [
	"disabled",
	"value",
	"onInput"
], Dl = ["disabled", "onClick"], Ol = [
	"disabled",
	"value",
	"onChange"
], kl = ["value"], Al = [
	"disabled",
	"value",
	"onInput"
], jl = { key: 1 }, Ml = [
	"disabled",
	"value",
	"onInput"
], Nl = ["onClick"], Pl = { key: 2 }, Fl = [
	"disabled",
	"rows",
	"value",
	"onInput"
], Il = { key: 1 }, Ll = ["disabled", "value"], Rl = { key: 2 }, zl = ["disabled", "value"], Bl = ["disabled", "title"], Vl = ["disabled", "value"], Hl = ["value"], Ul = ["disabled", "value"], Wl = { key: 1 }, Gl = ["disabled", "value"], Kl = { key: 2 }, ql = ["disabled", "value"], Jl = { key: 4 }, Yl = ["disabled", "rows"], Xl = { class: "item-meta" }, Zl = { class: "design-controls" }, Ql = { class: "design-controls__heading" }, $l = ["disabled"], eu = {
	key: 0,
	class: "image-frame-controls"
}, tu = { class: "image-resize-mode" }, nu = {
	role: "group",
	"aria-label": "이미지 크기 조절 방식"
}, ru = ["disabled"], iu = ["disabled"], au = { key: 0 }, ou = { class: "range-field" }, su = ["disabled", "value"], cu = ["disabled", "value"], lu = { key: 0 }, uu = { class: "range-field" }, du = ["disabled", "value"], fu = ["disabled", "value"], pu = ["disabled", "value"], mu = ["disabled", "value"], hu = ["disabled", "value"], gu = { class: "toggle-field" }, _u = ["disabled", "checked"], vu = { key: 1 }, yu = ["disabled", "value"], bu = {
	key: 1,
	class: "component-frame-controls"
}, xu = { class: "range-field" }, Su = ["disabled", "value"], Cu = ["disabled", "value"], wu = { class: "range-field" }, Tu = ["disabled", "value"], Eu = ["disabled", "value"], Du = ["disabled", "value"], Ou = { class: "range-field" }, ku = ["disabled", "value"], Au = ["disabled", "value"], ju = { class: "position-status" }, Mu = { key: 0 }, Nu = { key: 1 }, Pu = ["disabled"], Fu = {
	key: 0,
	class: "component-property-empty"
}, Iu = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, Lu = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ W(t.mode !== "output"), r = /* @__PURE__ */ W(""), i = /* @__PURE__ */ W([]), a = /* @__PURE__ */ W(null), o = /* @__PURE__ */ W(""), s = /* @__PURE__ */ W([]), c = /* @__PURE__ */ W({}), l = /* @__PURE__ */ W(JSON.parse(JSON.stringify(mo))), u = /* @__PURE__ */ W(""), d = /* @__PURE__ */ W(""), f = /* @__PURE__ */ W([]), p = /* @__PURE__ */ W(""), m = /* @__PURE__ */ W(null), h = /* @__PURE__ */ W("desktop"), g = /* @__PURE__ */ W(!0), _ = /* @__PURE__ */ W(""), v = /* @__PURE__ */ W(null), y = /* @__PURE__ */ W(1), b = /* @__PURE__ */ W(null), x = /* @__PURE__ */ W(null), S = /* @__PURE__ */ W(""), C = /* @__PURE__ */ W(!1), w = /* @__PURE__ */ W(""), T = /* @__PURE__ */ W(!1), E = /* @__PURE__ */ W(!1), ee = /* @__PURE__ */ W(""), D = /* @__PURE__ */ W({}), te = /* @__PURE__ */ W(!1), O = /* @__PURE__ */ W(""), k = /* @__PURE__ */ W(null), ne = /* @__PURE__ */ W([]), A = /* @__PURE__ */ W(0), re = /* @__PURE__ */ W({
			undoCount: 0,
			redoCount: 0,
			canUndo: !1,
			canRedo: !1
		}), j = Fs({
			layout: JSON.parse(JSON.stringify(mo)),
			content: {}
		}), ie = xs(), ae = ws(), oe = Ts({ storageKey: fo }), ce = !1, le = 0, ue = null, de = new URLSearchParams(window.location.search).get("source") || "", fe = Q(() => rs(t.mode, de)), pe = Q(() => fe.value.capabilities), me = Q(() => fe.value.isAdminLayout), he = Q(() => fe.value.isWizardLayout), ge = Q(() => fe.value.isCreatePromo), _e = Q(() => fe.value.isBuilderWorkspace), P = Q(() => fe.value.capabilities.isEmbedded), ve = window.PromoShell?.navItems || [], F = Q(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), I = Q(() => F.value?.items?.find((e) => e.itemKey === d.value) || null), ye = Q({
			get: () => c.value?.[F.value?.sectionKey]?.[I.value?.itemKey],
			set: (e) => He(e)
		}), L = Q(() => a.value ? bo({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), be = Q(() => t.mode === "output" ? v.value : L.value), xe = Q(() => {
			if (!a.value) return "템플릿 없음";
			let e = me.value ? a.value.status || "draft" : "active", t = String(a.value.id || "").slice(0, 8);
			return `${a.value.templateKey} · v${a.value.version || 1} · ${e} · layout r${y.value}${t ? ` · ${t}` : ""}`;
		});
		function Se() {
			return {
				layout: l.value,
				content: c.value,
				metadata: {
					surface: fe.value.surface,
					layoutRevision: y.value
				}
			};
		}
		function Ce() {
			re.value = j.getHistoryState();
		}
		function we({ resetHistory: e = !0 } = {}) {
			j.replaceDocument(Se(), { resetHistory: e }), Ce();
		}
		function Te(e) {
			return e?.ok ? (l.value = e.state.document.layout, c.value = e.state.document.content, re.value = e.history || j.getHistoryState(), !0) : !1;
		}
		function R(e, t, { source: n = "ui", label: r = e } = {}) {
			return Te(j.execute(Es(e, t, {
				source: n,
				label: r
			})));
		}
		function Ee() {
			Te(j.undo());
		}
		function De() {
			Te(j.redo());
		}
		function Oe(e, t, { preserveMulti: n = !1 } = {}) {
			if (!e) return;
			let r = u.value && u.value !== e.sectionKey;
			u.value = e.sectionKey, d.value = t?.itemKey || "", (!n || r) && (f.value = t?.itemKey ? [t.itemKey] : []);
		}
		function ke(e, t) {
			return e && t ? `${e.sectionKey}.${t.itemKey}` : "";
		}
		async function Ae(e, t, n = {}) {
			if (n.additive && !t?.isLocked && u.value === e.sectionKey) {
				let n = new Set(f.value);
				n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], Oe(e, t, { preserveMulti: !0 });
			} else Oe(e, t);
			p.value = ke(e, t), await on();
		}
		function je(e) {
			e && m.value?.scrollToSection(e.sectionKey);
		}
		async function Me(e) {
			e && (u.value = e.sectionKey, d.value = "", f.value = [], p.value = "", k.value = null, O.value = "", await on(), je(e));
		}
		function Ne(e) {
			return !!(e?.itemKey && f.value.includes(e.itemKey));
		}
		function Pe(e, t) {
			if (!e || !t || t.isLocked) return;
			u.value !== e.sectionKey && (f.value = []);
			let n = new Set(f.value);
			n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], Oe(e, t, { preserveMulti: !0 }), p.value = ke(e, t), k.value = null, O.value = "";
		}
		function Fe() {
			f.value = I.value?.itemKey ? [I.value.itemKey] : [], k.value = null, O.value = "";
		}
		function Ie(e) {
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
		function Le(e) {
			let t = m.value?.getStageElement();
			if (!e || !t) throw Error("미리보기 영역을 찾지 못했습니다.");
			let n = t.querySelector(`[data-section-key="${CSS.escape(e.sectionKey)}"]`)?.querySelector(".rendered-items");
			if (!n) throw Error("선택한 섹션의 레이아웃 영역을 찾지 못했습니다.");
			let r = n.getBoundingClientRect();
			if (!r.width || !r.height) throw Error("레이아웃 영역 크기를 계산하지 못했습니다.");
			let i = [...n.querySelectorAll("[data-style-key]")];
			return {
				geometry: f.value.map((t) => {
					let n = `${e.sectionKey}.${t}`, a = i.find((e) => e.dataset.styleKey === n);
					if (!a) throw Error(`${t} 컴포넌트 위치를 찾지 못했습니다.`);
					let o = a.getBoundingClientRect();
					return {
						itemKey: t,
						xPct: (o.left - r.left) / r.width * 100,
						yPx: o.top - r.top,
						widthPct: o.width / r.width * 100,
						heightPx: Math.max(1, o.height)
					};
				}),
				canvasWidthPx: r.width,
				canvasHeightPx: r.height
			};
		}
		async function Re() {
			if (!(!F.value || f.value.length < 2 || te.value)) {
				te.value = !0, O.value = "", k.value = null;
				try {
					let e = Le(F.value), t = await fetch("/api/promo-multi-component-layout-plan", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							formTemplateId: a.value?.id,
							sectionKey: F.value.sectionKey,
							selectedItemKeys: f.value,
							geometry: e.geometry,
							sectionInputs: c.value?.[F.value.sectionKey] || {}
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `AI 정렬 요청 오류(${t.status})`);
					let r = vs(e.geometry, n.suggestion, e);
					k.value = {
						...r.plan,
						requestedOperation: n.suggestion.operation,
						adjusted: r.adjusted,
						adjustmentReason: r.adjustmentReason,
						sectionKey: F.value.sectionKey,
						before: e.geometry,
						after: r.geometry
					};
				} catch (e) {
					O.value = e.message;
				} finally {
					te.value = !1;
				}
			}
		}
		function ze() {
			let e = k.value;
			if (!e || e.sectionKey !== F.value?.sectionKey) return;
			let t = _s(e.after), n = { ...l.value.itemStyles || {} };
			Object.entries(t).forEach(([t, r]) => {
				let i = `${e.sectionKey}.${t}`;
				n[i] = {
					...n[i] || {},
					...r
				};
			}), ne.value = [...ne.value.slice(-19), {
				revision: A.value,
				label: Ie(e.operation)
			}], R($.LAYOUT_REPLACE, { layout: {
				...l.value,
				itemStyles: n
			} }, {
				source: "ai",
				label: Ie(e.operation)
			}), A.value += 1, k.value = null, O.value = "";
		}
		function Be() {
			let e = ne.value.at(-1);
			e && (Ee(), A.value = e.revision, ne.value = ne.value.slice(0, -1), k.value = null, O.value = "");
		}
		function Ve(e, t) {
			let n = ke(e, t);
			Oe(e, t, { preserveMulti: f.value.includes(t.itemKey) }), p.value = p.value === n ? "" : n;
		}
		function He(e) {
			!F.value || !I.value || R($.CONTENT_VALUE_SET, {
				sectionKey: F.value.sectionKey,
				itemKey: I.value.itemKey,
				value: e
			}, { label: "콘텐츠 변경" });
		}
		function Ue(e, t) {
			He({
				...ye.value || {},
				[e]: t
			});
		}
		function We(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function Ge(e, t) {
			let n = c.value?.[F.value?.sectionKey]?.[e?.itemKey];
			return We(e).length <= 1 ? n : n?.fields?.[t.fieldKey];
		}
		function z(e, t, n) {
			if (!F.value || !e || !t || e.isLocked || t.isLocked) return;
			if (We(e).length <= 1) {
				He(n);
				return;
			}
			let r = F.value.sectionKey, i = c.value?.[r]?.[e.itemKey] || {};
			R($.CONTENT_VALUE_SET, {
				sectionKey: r,
				itemKey: e.itemKey,
				value: {
					...i,
					fields: {
						...i.fields || {},
						[t.fieldKey]: n
					}
				}
			}, { label: `${t.name || t.fieldKey} 콘텐츠 변경` });
		}
		function Ke(e, t, n, r) {
			z(e, t, {
				...Ge(e, t) || {},
				[n]: r
			});
		}
		function qe(e, t, n) {
			Oe(e, t), !(t.fieldKind !== "text" || t.isLocked) && He(n);
		}
		function Je(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			if (We(t).length > 1) {
				let e = We(t), r = e.filter((e) => e.isRequired || e.isLocked), i = (r.length ? r : e).map((e) => {
					let t = n?.fields?.[e.fieldKey];
					return e.fieldKind === "cta" ? !!(String(t?.label || "").trim() && String(t?.link || "").trim()) : e.fieldKind === "image" ? !!String(t?.value || "").trim() : !!String(t || "").trim();
				});
				return r.length ? i.every(Boolean) : i.some(Boolean);
			}
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function Ye(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => Je(e, t)) : t.some((t) => Je(e, t));
		}
		function Xe() {
			!ge.value || E.value || (E.value = !0, ee.value = "", ae.requestAutoRegister(c.value));
		}
		function Ze(e) {
			return D.value?.[e.sectionKey] || null;
		}
		function Qe(e) {
			let t = Ze(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function $e(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets",
				"applying"
			].includes(Ze(e)?.status);
		}
		function et(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1) return !1;
				let n = t[e.itemKey];
				if (We(e).length > 1) return We(e).some((e) => {
					if (e.fieldKind === "image") return !1;
					let t = n?.fields?.[e.fieldKey], r = e.fieldKind === "cta" ? t?.label : t;
					return String(r || "").trim().length >= 2;
				});
				if (e.fieldKind === "image") return !1;
				let r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function tt(e) {
			let t = Ze(e), n = t?.constraintsSnapshot?.imageTarget?.type === "section-background";
			return $e(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : n && t?.status === "ready" && !Qe(e) ? {
				action: "generate",
				label: "AI 적용 중",
				disabled: !0
			} : n && t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !et(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !et(e)
			};
		}
		function nt(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function rt(e, t, n = null) {
			let r = n || t;
			return !!(e?.aiDesign?.enabled !== !1 && r?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && !r?.isLocked && r?.image?.allowedSources?.includes("ai") && nt(e).includes(t.itemKey));
		}
		function it(e) {
			let t = Ze(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function at(e, t, n = null) {
			let r = Ze(e), i = r?.constraintsSnapshot?.imageTarget, a = it(e) === t?.itemKey && (!n || i?.fieldKey === n.fieldKey);
			return $e(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : a && r?.status === "ready" && !Qe(e) ? {
				action: "generate",
				label: "AI 이미지 적용 중",
				disabled: !0
			} : a && r?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !et(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !et(e)
			};
		}
		function ot(e, t, n = "", r = "", i = "") {
			let a = r || (n ? "item" : "section-background");
			ae.requestSectionAiAction({
				sectionKey: e.sectionKey,
				action: t,
				targetType: a,
				targetItemKey: n,
				targetFieldKey: i
			});
		}
		function st(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function ct(e = null) {
			!F.value || !I.value || I.value.isLocked || e?.isLocked || window.confirm(`${e?.name || I.value.name} 이미지를 삭제할까요?`) && ae.requestImageRemoval({
				sectionKey: F.value.sectionKey,
				itemKey: I.value.itemKey,
				fieldKey: e?.fieldKey || null
			});
		}
		function lt(e) {
			R($.THEME_STYLE_PATCH, { patch: {
				backgroundColor: e.value,
				backgroundToken: e.key,
				textColor: e.textColor
			} }, { label: "배경 토큰 변경" });
		}
		let ut = Q(() => F.value && I.value ? `${F.value.sectionKey}.${I.value.itemKey}` : ""), B = Q(() => l.value.itemStyles?.[ut.value] || {}), dt = Q(() => F.value && l.value.sectionStyles?.[F.value.sectionKey] || {});
		function V(e) {
			!ut.value || I.value?.isLocked || R($.ITEM_STYLE_PATCH, {
				styleKey: ut.value,
				patch: e
			}, { label: "컴포넌트 스타일 변경" });
		}
		function ft(e, t, n) {
			if (!e || !t || t.isLocked) return;
			let r = `${e.sectionKey}.${t.itemKey}`;
			R($.ITEM_STYLE_PATCH, {
				styleKey: r,
				patch: n
			}, {
				source: "pointer",
				label: "컴포넌트 위치·크기 변경"
			});
		}
		function pt() {
			!ut.value || I.value?.isLocked || R($.ITEM_STYLE_REMOVE, { styleKey: ut.value }, { label: "컴포넌트 스타일 초기화" });
		}
		function mt() {
			if (!ut.value || I.value?.isLocked) return;
			let e = Co(l.value.itemStyles?.[ut.value]);
			Object.keys(e).length ? R($.ITEM_STYLE_REPLACE, {
				styleKey: ut.value,
				style: e
			}, { label: "자동 위치 복원" }) : R($.ITEM_STYLE_REMOVE, { styleKey: ut.value }, { label: "자동 위치 복원" });
		}
		function ht(e, t) {
			e && R($.SECTION_STYLE_PATCH, {
				sectionKey: e,
				patch: t
			}, { label: "섹션 스타일 변경" });
		}
		function gt(e) {
			!F.value || ![
				"left",
				"center",
				"right"
			].includes(e) || ht(F.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function _t(e) {
			!F.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || ht(F.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: dt.value.backgroundFadeStrength || "medium"
			});
		}
		function vt(e) {
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
		function yt(e) {
			if (!ut.value || I.value?.isLocked || !["locked", "free"].includes(e)) return;
			let t = { ...B.value };
			e === "locked" || t.shape === "circle" ? (t.aspectRatioLocked = !0, t.aspectRatio = t.shape === "circle" ? "1/1" : t.aspectRatio || I.value?.image?.aspectRatio || "1/1", delete t.heightPx) : (t.aspectRatioLocked = !1, t.heightPx = Number(t.heightPx || 240)), R($.ITEM_STYLE_REPLACE, {
				styleKey: ut.value,
				style: t
			}, { label: "이미지 크기 조절 방식 변경" });
		}
		function bt() {
			if (!F.value) return;
			let e = F.value.sectionKey, t = { ...l.value.sectionStyles?.[e] || {} };
			delete t.minHeight, Object.keys(t).length ? R($.SECTION_STYLE_REPLACE, {
				sectionKey: e,
				style: t
			}, { label: "섹션 높이 초기화" }) : R($.SECTION_STYLE_REMOVE, { sectionKey: e }, { label: "섹션 높이 초기화" });
		}
		async function xt() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = l.template, o.value = l.configRevision || "", s.value = l.sections || [], c.value = vo(s.value), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = ke(s.value[0], s.value[0]?.items?.[0]), we();
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function St() {
			if (!L.value) return;
			_.value = "";
			let e = oe.save(L.value);
			if (!e.ok) {
				_.value = e.message;
				return;
			}
			oe.open();
		}
		async function Ct() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await ie.loadLayout(e);
				a.value = t.template, s.value = t.sections || [], c.value = vo(s.value), l.value = os(t.layout?.layoutSpec), y.value = Number(t.layout?.layoutRevision || 1), b.value = t.layout?.id || null, x.value = t.layoutIdentity || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = ke(s.value[0], s.value[0]?.items?.[0]), we();
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function wt({ activate: e = !1 } = {}) {
			if (!a.value?.id || C.value) return;
			w.value = "";
			let t = cs(l.value);
			if (!t.ok) {
				w.value = `레이아웃 검증 실패: ${t.errors[0]?.path || "unknown"}`;
				return;
			}
			C.value = !0;
			try {
				let n = await ie.saveLayout({
					templateId: a.value.id,
					expectedRevision: y.value,
					rendererKey: "default-promo-renderer",
					rendererVersion: 1,
					layoutSpec: t.spec,
					changeNote: S.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
				});
				if (l.value = os(n.layout.layoutSpec), y.value = Number(n.layout.layoutRevision || y.value + 1), b.value = n.layout.id || b.value, x.value = n.layoutIdentity || x.value, j.replaceDocument(Se(), {
					resetHistory: !1,
					dirty: !1
				}), Ce(), S.value = "", !e) {
					w.value = `초안 v${a.value.version || 1} · layout r${y.value} 저장 완료 · 프로모션 빌더 반영을 위해 템플릿을 활성화하세요.`;
					return;
				}
				let r = await ie.activateTemplate({
					id: a.value.id,
					changeNote: "Admin Layout Editor에서 기본 레이아웃 저장 후 활성화했습니다."
				});
				if (Number(r.layoutIdentity?.layoutRevision || 0) !== y.value) throw Error("활성화 결과의 Layout revision이 방금 저장한 초안과 일치하지 않습니다.");
				a.value = {
					...a.value,
					...r.template || {},
					status: "active"
				}, x.value = r.layoutIdentity || x.value, w.value = `활성 v${a.value.version || 1} · layout r${y.value} 반영 완료 · 신규 프로모션 빌더에서 사용됩니다.`;
			} catch (e) {
				w.value = e.message;
			} finally {
				C.value = !1;
			}
		}
		async function Tt(e) {
			if (!e?.content) return;
			let t = Number(e.snapshotRevision || 0);
			if (t && t < le) return;
			t && (le = t);
			let i = F.value?.sectionKey || u.value, m = I.value?.itemKey || d.value, h = p.value;
			ce = !0;
			let g = !T.value;
			a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, D.value = e.content.sectionDesignRuns || {}, l.value = os(e.designSpec), y.value = Number(e.layoutRevision || 1), x.value = e.layoutIdentity || null;
			let _ = s.value.find((e) => e.sectionKey === i) || s.value[0];
			u.value = _?.sectionKey || "", d.value = _?.items?.some((e) => e.itemKey === m) ? m : _?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], k.value = null;
			let v = ke(_, _?.items?.find((e) => e.itemKey === d.value));
			p.value = s.value.some((e) => (e.items || []).some((t) => ke(e, t) === h)) ? h : v, T.value = !0, we({ resetHistory: g }), n.value = !1, r.value = "", await on(), ce = !1;
		}
		function Et(e) {
			if (he.value) {
				if (e?.type === Ss.AUTO_REGISTER_RESULT) {
					E.value = !1;
					let t = Number(e.registeredCount || 0);
					ee.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e?.type === Ss.SNAPSHOT && Tt(e.snapshot);
			}
		}
		wn([l, c], () => {
			!he.value || !T.value || ce || ae.notifyChange({
				snapshotRevision: le,
				designSpec: l.value,
				sectionInputs: c.value
			});
		}, { deep: !0 });
		function Dt() {
			try {
				v.value = oe.load();
			} catch (e) {
				r.value = e.message;
			}
		}
		return Kn(() => {
			P.value && (document.documentElement.classList.add("layout-editor-document"), document.body.classList.add("layout-editor-document")), ge.value && (document.documentElement.classList.add("create-promo-editor-document"), document.body.classList.add("create-promo-editor-document")), window.PromoShell?.init(document), t.mode === "output" ? Dt() : me.value ? Ct() : he.value ? (n.value = !0, ue = ae.connect(Et), ae.notifyReady()) : xt();
		}), Yn(() => {
			ue?.(), ue = null, document.documentElement.classList.remove("layout-editor-document"), document.body.classList.remove("layout-editor-document"), document.documentElement.classList.remove("create-promo-editor-document"), document.body.classList.remove("create-promo-editor-document");
		}), (t, i) => e.mode === "output" ? (q(), J("div", Kc, [Y("header", qc, [Y("div", null, [i[33] ||= Y("span", null, "WEB OUTPUT", -1), Y("strong", null, N(be.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[34] ||= Y("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (q(), J("div", Jc, N(r.value), 1)) : be.value ? (q(), Di(ns, {
			key: 1,
			content: be.value.content,
			"design-spec": be.value.designSpec,
			assets: be.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Z("", !0)])) : (q(), J("main", {
			key: 1,
			class: M(["editor-shell", {
				"shell-frame": !P.value,
				"editor-shell--embedded": P.value
			}]),
			"data-shell-frame": P.value ? null : ""
		}, [
			P.value ? Z("", !0) : (q(), J("aside", Xc, [
				i[35] ||= Ii("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[36] ||= Y("div", {
					class: "shell-sidebar__mode",
					role: "group",
					"aria-label": "사이드바 표시 방식"
				}, [Y("button", {
					type: "button",
					"data-shell-sidebar-mode": "min",
					"aria-label": "사이드바 최소화",
					title: "최소"
				}, [Y("i", {
					"data-lucide": "panel-left-close",
					"aria-hidden": "true"
				}), Y("span", null, "최소")]), Y("button", {
					type: "button",
					"data-shell-sidebar-mode": "max",
					"aria-label": "사이드바 최대화",
					title: "최대"
				}, [Y("i", {
					"data-lucide": "panel-left-open",
					"aria-hidden": "true"
				}), Y("span", null, "최대")])], -1),
				Y("nav", Zc, [(q(!0), J(K, null, nr(Lt(ve), (e) => (q(), J("a", {
					key: e.key,
					href: e.href,
					class: M({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [Y("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, $c), Y("span", el, N(e.label), 1)], 10, Qc))), 128))]),
				i[37] ||= Y("div", { class: "shell-sidebar__footer" }, [Y("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [Y("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), Y("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			Y("div", { class: M(P.value ? "editor-embedded-main" : "shell-main") }, [P.value ? Z("", !0) : (q(), J("header", tl, [Y("div", nl, [i[38] ||= Y("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), Y("strong", null, N(me.value ? "Admin Template Layout" : "Visual Editor"), 1)]), Y("div", rl, [Y("div", il, N(me.value ? `Layout revision ${y.value}` : "편집 준비"), 1)])])), Y("div", { class: M(["editor-content", {
				"shell-content": !P.value,
				"editor-content--embedded": P.value
			}]) }, [
				_e.value ? Z("", !0) : (q(), J("header", al, [Y("div", null, [
					Y("span", null, N(me.value ? "ADMIN TEMPLATE LAYOUT" : he.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					Y("h2", null, N(a.value?.name || "Default Renderer"), 1),
					me.value ? (q(), J("small", ol, " v" + N(a.value?.version || 1) + " · " + N(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : Z("", !0)
				]), Y("div", sl, [ge.value ? Z("", !0) : (q(), J("fieldset", cl, [i[39] ||= Y("legend", null, "페이지 배경", -1), Y("div", ll, [(q(!0), J(K, null, nr(Lt(po), (e) => (q(), J("button", {
					key: e.key,
					type: "button",
					class: M({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => lt(e)
				}, [Y("i", { style: se({ backgroundColor: e.value }) }, null, 4)], 10, ul))), 128))])])), me.value ? (q(), J("nav", dl, [vn(Y("input", {
					"onUpdate:modelValue": i[0] ||= (e) => S.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[eo, S.value]]), Y("button", {
					type: "button",
					disabled: !L.value || C.value,
					onClick: wt
				}, N(C.value ? "저장 중" : "기본 레이아웃 저장"), 9, fl)])) : Z("", !0)])])),
				n.value ? (q(), J("div", pl, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (q(), J("div", ml, N(r.value), 1)) : Z("", !0),
				_.value ? (q(), J("div", hl, N(_.value), 1)) : Z("", !0),
				w.value ? (q(), J("div", gl, N(w.value), 1)) : Z("", !0),
				!n.value && !r.value ? (q(), J("section", {
					key: 5,
					class: M(["editor-workspace", {
						"is-builder-workspace": _e.value,
						"is-create-promo-wizard": ge.value,
						"is-admin-layout-workspace": me.value
					}])
				}, [
					X(Oc, {
						sections: s.value,
						"selected-section": F.value,
						"selected-section-style": dt.value,
						capabilities: pe.value,
						"section-content-registered": Ye,
						"section-ai-primary-action": tt,
						"section-has-ai-background": st,
						"section-ai-is-processing": $e,
						onSelectSection: Me,
						onSectionAiAction: i[1] ||= (e, t, n, r) => ot(e, t, n, r),
						onBackgroundAlignment: gt,
						onBackgroundFade: _t,
						onUpdateSectionStyle: ht,
						onResetSectionHeight: bt
					}, null, 8, [
						"sections",
						"selected-section",
						"selected-section-style",
						"capabilities"
					]),
					X(ic, {
						ref_key: "previewPanelRef",
						ref: m,
						"renderer-snapshot": be.value,
						"section-design-runs": D.value,
						"guides-visible": g.value,
						viewport: h.value,
						"template-identity-label": xe.value,
						capabilities: pe.value,
						"auto-register-pending": E.value,
						"auto-register-message": ee.value,
						"editor-history": re.value,
						"design-spec": l.value,
						"design-color-tokens": Lt(po),
						"layout-change-note": S.value,
						"layout-saving": C.value,
						"editor-snapshot": L.value,
						template: a.value,
						"selected-style-key": ut.value,
						"selected-item-keys": f.value,
						"selected-section": F.value,
						"onUpdate:guidesVisible": i[2] ||= (e) => g.value = e,
						"onUpdate:viewport": i[3] ||= (e) => h.value = e,
						"onUpdate:layoutChangeNote": i[4] ||= (e) => S.value = e,
						onRequestAutoRegister: Xe,
						onUndo: Ee,
						onRedo: De,
						onUpdateBackgroundToken: lt,
						onSaveAdminLayout: i[5] ||= (e) => wt({ activate: e }),
						onOpenOutput: St,
						onSelectItem: Ae,
						onUpdateItemStyle: V,
						onUpdateRendererItemStyle: ft,
						onUpdateItemContent: qe,
						onUpdateSectionStyle: ht
					}, null, 8, [
						"renderer-snapshot",
						"section-design-runs",
						"guides-visible",
						"viewport",
						"template-identity-label",
						"capabilities",
						"auto-register-pending",
						"auto-register-message",
						"editor-history",
						"design-spec",
						"design-color-tokens",
						"layout-change-note",
						"layout-saving",
						"editor-snapshot",
						"template",
						"selected-style-key",
						"selected-item-keys",
						"selected-section"
					]),
					X(Gc, { "selected-section": F.value }, {
						"ai-controls": _n(() => [pe.value.canRunMultiLayoutAi ? (q(), Di(Vc, {
							key: 0,
							"selected-count": f.value.length,
							revision: A.value,
							planning: te.value,
							error: O.value,
							suggestion: k.value,
							"undo-count": ne.value.length,
							"operation-label": Ie,
							onClearSelection: Fe,
							onRequestSuggestion: Re,
							onUndo: Be,
							onApplySuggestion: ze,
							onDismissSuggestion: i[6] ||= (e) => k.value = null
						}, null, 8, [
							"selected-count",
							"revision",
							"planning",
							"error",
							"suggestion",
							"undo-count"
						])) : Z("", !0)]),
						default: _n(() => [Y("div", _l, [(q(!0), J(K, null, nr(F.value.items || [], (e) => (q(), J("section", {
							key: e.itemKey,
							class: M(["component-property-accordion", { open: p.value === ke(F.value, e) }])
						}, [Y("div", vl, [pe.value.canRunMultiLayoutAi ? (q(), J("label", {
							key: 0,
							class: "component-multi-select",
							title: e.isLocked ? "잠긴 컴포넌트는 다중 정렬할 수 없습니다." : "다중 정렬 대상 선택"
						}, [Y("input", {
							type: "checkbox",
							checked: Ne(e),
							disabled: e.isLocked,
							"aria-label": `${e.name} 다중 정렬 대상 선택`,
							onChange: (t) => Pe(F.value, e)
						}, null, 40, bl)], 8, yl)) : Z("", !0), Y("button", {
							type: "button",
							class: "component-property-trigger",
							"aria-expanded": p.value === ke(F.value, e),
							onClick: (t) => Ve(F.value, e)
						}, [
							Y("span", null, N(e.name), 1),
							Y("small", null, N(e.fieldKind), 1),
							i[40] ||= Y("i", { "aria-hidden": "true" }, null, -1)
						], 8, xl)]), Y("div", Sl, [Y("div", null, [I.value && I.value.itemKey === e.itemKey ? (q(), J("div", Cl, [
							We(I.value).length > 1 ? (q(), J("div", wl, [(q(!0), J(K, null, nr(We(I.value), (e) => (q(), J("section", {
								key: e.fieldKey,
								class: "component-field-property"
							}, [Y("header", null, [Y("strong", null, N(e.name), 1), Y("small", null, N(e.fieldKind) + " · " + N(e.fieldKey), 1)]), e.fieldKind === "cta" ? (q(), J(K, { key: 0 }, [Y("label", null, [i[41] ||= Y("span", null, "버튼 텍스트", -1), Y("input", {
								disabled: I.value.isLocked || e.isLocked,
								value: Ge(I.value, e)?.label,
								onInput: (t) => Ke(I.value, e, "label", t.target.value)
							}, null, 40, Tl)]), Y("label", null, [i[42] ||= Y("span", null, "버튼 URL", -1), Y("input", {
								disabled: I.value.isLocked || e.isLocked,
								type: "url",
								value: Ge(I.value, e)?.link,
								onInput: (t) => Ke(I.value, e, "link", t.target.value)
							}, null, 40, El)])], 64)) : e.fieldKind === "image" ? (q(), J(K, { key: 1 }, [
								pe.value.canRunComponentImageAi && rt(F.value, I.value, e) ? (q(), J("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: at(F.value, I.value, e).disabled,
									onClick: (t) => ot(F.value, "generate", I.value.itemKey, "item", e.fieldKey)
								}, N(at(F.value, I.value, e).label), 9, Dl)) : Z("", !0),
								Y("label", null, [i[43] ||= Y("span", null, "이미지 입력 방식", -1), Y("select", {
									disabled: I.value.isLocked || e.isLocked,
									value: Ge(I.value, e)?.source,
									onChange: (t) => Ke(I.value, e, "source", t.target.value)
								}, [(q(!0), J(K, null, nr(e.image?.allowedSources || ["url"], (e) => (q(), J("option", {
									key: e,
									value: e
								}, N(e), 9, kl))), 128))], 40, Ol)]),
								Y("label", null, [i[44] ||= Y("span", null, "URL 또는 이미지 설명", -1), Y("textarea", {
									disabled: I.value.isLocked || e.isLocked,
									rows: "4",
									value: Ge(I.value, e)?.value,
									onInput: (t) => Ke(I.value, e, "value", t.target.value)
								}, null, 40, Al)]),
								e.image?.altTextRequired ? (q(), J("label", jl, [i[45] ||= Y("span", null, "대체 텍스트", -1), Y("input", {
									disabled: I.value.isLocked || e.isLocked,
									value: Ge(I.value, e)?.alt,
									onInput: (t) => Ke(I.value, e, "alt", t.target.value)
								}, null, 40, Ml)])) : Z("", !0),
								!I.value.isLocked && !e.isLocked && Ge(I.value, e)?.value ? (q(), J("button", {
									key: 2,
									type: "button",
									class: "image-remove-action",
									onClick: (t) => ct(e)
								}, "이미지 삭제", 8, Nl)) : Z("", !0)
							], 64)) : (q(), J("label", Pl, [Y("span", null, N(e.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), Y("textarea", {
								disabled: I.value.isLocked || e.isLocked,
								rows: e.textType === "multi" ? 8 : 3,
								value: Ge(I.value, e),
								onInput: (t) => z(I.value, e, t.target.value),
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 40, Fl)]))]))), 128))])) : Z("", !0),
							We(I.value).length <= 1 && I.value.fieldKind === "cta" ? (q(), J("label", Il, [i[46] ||= Y("span", null, "버튼 텍스트", -1), Y("input", {
								disabled: I.value.isLocked,
								value: ye.value?.label,
								onInput: i[7] ||= (e) => Ue("label", e.target.value)
							}, null, 40, Ll)])) : Z("", !0),
							We(I.value).length <= 1 && I.value.fieldKind === "cta" ? (q(), J("label", Rl, [i[47] ||= Y("span", null, "버튼 URL", -1), Y("input", {
								disabled: I.value.isLocked,
								type: "url",
								value: ye.value?.link,
								onInput: i[8] ||= (e) => Ue("link", e.target.value)
							}, null, 40, zl)])) : We(I.value).length <= 1 && I.value.fieldKind === "image" ? (q(), J(K, { key: 3 }, [
								pe.value.canRunComponentImageAi && rt(F.value, I.value) ? (q(), J("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: at(F.value, I.value).disabled,
									title: at(F.value, I.value).disabled && !$e(F.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
									onClick: i[9] ||= (e) => ot(F.value, at(F.value, I.value).action, I.value.itemKey)
								}, N(at(F.value, I.value).label), 9, Bl)) : Z("", !0),
								Y("label", null, [i[48] ||= Y("span", null, "이미지 입력 방식", -1), Y("select", {
									disabled: I.value.isLocked,
									value: ye.value?.source,
									onChange: i[10] ||= (e) => Ue("source", e.target.value)
								}, [(q(!0), J(K, null, nr(I.value.image?.allowedSources || ["url"], (e) => (q(), J("option", {
									key: e,
									value: e
								}, N(e), 9, Hl))), 128))], 40, Vl)]),
								Y("label", null, [i[49] ||= Y("span", null, "URL 또는 이미지 설명", -1), Y("textarea", {
									disabled: I.value.isLocked,
									rows: "4",
									value: ye.value?.value,
									onInput: i[11] ||= (e) => Ue("value", e.target.value)
								}, null, 40, Ul)]),
								I.value.image?.descriptionEnabled ? (q(), J("label", Wl, [i[50] ||= Y("span", null, "설명", -1), Y("textarea", {
									disabled: I.value.isLocked,
									rows: "3",
									value: ye.value?.description,
									onInput: i[12] ||= (e) => Ue("description", e.target.value)
								}, null, 40, Gl)])) : Z("", !0),
								I.value.image?.altTextRequired ? (q(), J("label", Kl, [i[51] ||= Y("span", null, "대체 텍스트", -1), Y("input", {
									disabled: I.value.isLocked,
									value: ye.value?.alt,
									onInput: i[13] ||= (e) => Ue("alt", e.target.value)
								}, null, 40, ql)])) : Z("", !0),
								!I.value.isLocked && ye.value?.value ? (q(), J("button", {
									key: 3,
									type: "button",
									class: "image-remove-action",
									onClick: ct
								}, "이미지 삭제")) : Z("", !0)
							], 64)) : We(I.value).length <= 1 ? (q(), J("label", Jl, [Y("span", null, N(I.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), vn(Y("textarea", {
								"onUpdate:modelValue": i[14] ||= (e) => ye.value = e,
								disabled: I.value.isLocked,
								rows: I.value.textType === "multi" ? 8 : 3,
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 8, Yl), [[eo, ye.value]])])) : Z("", !0),
							Y("dl", Xl, [
								Y("div", null, [i[52] ||= Y("dt", null, "Item key", -1), Y("dd", null, N(I.value.itemKey), 1)]),
								Y("div", null, [i[53] ||= Y("dt", null, "필수", -1), Y("dd", null, N(I.value.isRequired ? "Y" : "N"), 1)]),
								Y("div", null, [i[54] ||= Y("dt", null, "고정", -1), Y("dd", null, N(I.value.isLocked ? "Y" : "N"), 1)])
							]),
							Y("section", Zl, [
								Y("div", Ql, [i[55] ||= Y("strong", null, "DESIGN", -1), Y("button", {
									type: "button",
									disabled: I.value.isLocked,
									onClick: pt
								}, "초기화", 8, $l)]),
								I.value.fieldKind === "image" ? (q(), J("div", eu, [
									Y("div", tu, [
										i[56] ||= Y("span", null, "크기 조절 방식", -1),
										Y("div", nu, [Y("button", {
											type: "button",
											class: M({ active: B.value.aspectRatioLocked !== !1 }),
											disabled: I.value.isLocked,
											onClick: i[15] ||= (e) => yt("locked")
										}, "비율 유지", 10, ru), Y("button", {
											type: "button",
											class: M({ active: B.value.aspectRatioLocked === !1 }),
											disabled: I.value.isLocked || B.value.shape === "circle",
											onClick: i[16] ||= (e) => yt("free")
										}, "자유 조절", 10, iu)]),
										B.value.shape === "circle" ? (q(), J("small", au, "원형 이미지는 1:1 비율로 고정됩니다.")) : Z("", !0)
									]),
									Y("label", null, [i[57] ||= Y("span", null, "이미지 너비", -1), Y("div", ou, [Y("input", {
										type: "range",
										min: "10",
										max: "100",
										step: "1",
										disabled: I.value.isLocked,
										value: B.value.widthPct || 32,
										onInput: i[17] ||= (e) => V({ widthPct: Number(e.target.value) })
									}, null, 40, su), Y("input", {
										class: "dimension-input",
										type: "number",
										min: "10",
										max: "100",
										step: "1",
										disabled: I.value.isLocked,
										value: Math.round(B.value.widthPct || 32),
										"aria-label": "이미지 너비 퍼센트",
										onChange: i[18] ||= (e) => V({ widthPct: Math.min(100, Math.max(10, Number(e.target.value) || 32)) })
									}, null, 40, cu)])]),
									B.value.shape !== "circle" && B.value.aspectRatioLocked === !1 ? (q(), J("label", lu, [i[58] ||= Y("span", null, "이미지 높이", -1), Y("div", uu, [Y("input", {
										type: "range",
										min: "80",
										max: "900",
										step: "10",
										disabled: I.value.isLocked,
										value: B.value.heightPx || 240,
										onInput: i[19] ||= (e) => V({ heightPx: Number(e.target.value) })
									}, null, 40, du), Y("input", {
										class: "dimension-input",
										type: "number",
										min: "80",
										max: "900",
										step: "10",
										disabled: I.value.isLocked,
										value: Math.round(B.value.heightPx || 240),
										"aria-label": "이미지 높이 픽셀",
										onChange: i[20] ||= (e) => V({ heightPx: Math.min(900, Math.max(80, Number(e.target.value) || 240)) })
									}, null, 40, fu)])])) : Z("", !0),
									Y("label", null, [i[60] ||= Y("span", null, "이미지 맞춤", -1), Y("select", {
										disabled: I.value.isLocked,
										value: B.value.imageFit || "contain",
										onChange: i[21] ||= (e) => V({ imageFit: e.target.value })
									}, [...i[59] ||= [Y("option", { value: "contain" }, "전체 표시", -1), Y("option", { value: "cover" }, "영역 채우기", -1)]], 40, pu)]),
									Y("label", null, [i[62] ||= Y("span", null, "이미지 초점", -1), Y("select", {
										disabled: I.value.isLocked,
										value: B.value.imagePosition || "center center",
										onChange: i[22] ||= (e) => V({ imagePosition: e.target.value })
									}, [...i[61] ||= [
										Y("option", { value: "left top" }, "왼쪽 위", -1),
										Y("option", { value: "center top" }, "중앙 위", -1),
										Y("option", { value: "right top" }, "오른쪽 위", -1),
										Y("option", { value: "left center" }, "왼쪽 중앙", -1),
										Y("option", { value: "center center" }, "중앙", -1),
										Y("option", { value: "right center" }, "오른쪽 중앙", -1),
										Y("option", { value: "left bottom" }, "왼쪽 아래", -1),
										Y("option", { value: "center bottom" }, "중앙 아래", -1),
										Y("option", { value: "right bottom" }, "오른쪽 아래", -1)
									]], 40, mu)]),
									Y("label", null, [i[64] ||= Y("span", null, "이미지 형태", -1), Y("select", {
										disabled: I.value.isLocked,
										value: B.value.shape || "square",
										onChange: i[23] ||= (e) => vt(e.target.value)
									}, [...i[63] ||= [
										Y("option", { value: "square" }, "사각형", -1),
										Y("option", { value: "rounded" }, "둥근 사각형", -1),
										Y("option", { value: "circle" }, "원형", -1)
									]], 40, hu)]),
									Y("label", gu, [Y("input", {
										type: "checkbox",
										disabled: I.value.isLocked,
										checked: B.value.decorative === !0,
										onChange: i[24] ||= (e) => V({ decorative: e.target.checked })
									}, null, 40, _u), i[65] ||= Y("span", null, "장식 이미지", -1)]),
									B.value.decorative === !0 ? Z("", !0) : (q(), J("label", vu, [i[66] ||= Y("span", null, "이미지 설명", -1), Y("input", {
										type: "text",
										maxlength: "240",
										disabled: I.value.isLocked,
										value: B.value.accessibleLabel || ye.value?.alt || I.value.name,
										onInput: i[25] ||= (e) => V({ accessibleLabel: e.target.value })
									}, null, 40, yu)]))
								])) : (q(), J("div", bu, [
									i[69] ||= Y("strong", null, "컴포넌트 영역 크기", -1),
									i[70] ||= Y("small", null, "프리뷰의 모서리와 변을 드래그하면 영역과 글자 크기가 함께 변경됩니다.", -1),
									Y("label", null, [i[67] ||= Y("span", null, "컴포넌트 너비", -1), Y("div", xu, [Y("input", {
										type: "range",
										min: "0.01",
										max: "100",
										step: "0.1",
										disabled: I.value.isLocked,
										value: B.value.widthPct || 32,
										onInput: i[26] ||= (e) => V({ widthPct: Number(e.target.value) })
									}, null, 40, Su), Y("input", {
										class: "dimension-input",
										type: "number",
										min: "0.01",
										max: "100",
										step: "0.1",
										disabled: I.value.isLocked,
										value: Math.round(B.value.widthPct || 32),
										"aria-label": "컴포넌트 너비 퍼센트",
										onChange: i[27] ||= (e) => V({ widthPct: Math.min(100, Math.max(.01, Number(e.target.value) || 32)) })
									}, null, 40, Cu)])]),
									Y("label", null, [i[68] ||= Y("span", null, "컴포넌트 높이", -1), Y("div", wu, [Y("input", {
										type: "range",
										min: "1",
										max: "900",
										step: "1",
										disabled: I.value.isLocked,
										value: B.value.heightPx || 120,
										onInput: i[28] ||= (e) => V({ heightPx: Number(e.target.value) })
									}, null, 40, Tu), Y("input", {
										class: "dimension-input",
										type: "number",
										min: "1",
										max: "900",
										step: "1",
										disabled: I.value.isLocked,
										value: Math.round(B.value.heightPx || 120),
										"aria-label": "컴포넌트 높이 픽셀",
										onChange: i[29] ||= (e) => V({ heightPx: Math.min(900, Math.max(1, Number(e.target.value) || 120)) })
									}, null, 40, Eu)])])
								])),
								I.value.fieldKind === "image" ? Z("", !0) : (q(), J(K, { key: 2 }, [
									Y("label", null, [i[71] ||= Y("span", null, "글자 색상", -1), Y("input", {
										type: "color",
										disabled: I.value.isLocked,
										value: B.value.color || "#172033",
										onInput: i[30] ||= (e) => V({ color: e.target.value })
									}, null, 40, Du)]),
									Y("label", null, [i[72] ||= Y("span", null, "폰트 크기", -1), Y("div", Ou, [Y("input", {
										type: "range",
										min: "0",
										max: "80",
										step: "1",
										disabled: I.value.isLocked,
										value: B.value.fontSize ?? 18,
										onInput: i[31] ||= (e) => V({ fontSize: Number(e.target.value) })
									}, null, 40, ku), Y("output", null, N(B.value.fontSize ?? 18) + "px", 1)])]),
									Y("label", null, [i[74] ||= Y("span", null, "폰트 굵기", -1), Y("select", {
										disabled: I.value.isLocked,
										value: B.value.fontWeight || 400,
										onChange: i[32] ||= (e) => V({ fontWeight: Number(e.target.value) })
									}, [...i[73] ||= [
										Y("option", { value: 400 }, "Regular", -1),
										Y("option", { value: 500 }, "Medium", -1),
										Y("option", { value: 700 }, "Bold", -1),
										Y("option", { value: 800 }, "Extra Bold", -1)
									]], 40, Au)])
								], 64)),
								Y("div", ju, [i[75] ||= Y("span", null, "위치", -1), B.value.positionMode === "free" ? (q(), J("strong", Mu, " X " + N(Math.round(B.value.xPct || 0)) + "% · Y " + N(Math.round(B.value.yPx || 0)) + "px ", 1)) : (q(), J("strong", Nu, "자동 배치"))]),
								B.value.positionMode === "free" ? (q(), J("button", {
									key: 3,
									class: "secondary-control",
									type: "button",
									disabled: I.value.isLocked,
									onClick: mt
								}, " 자동 배치로 복원 ", 8, Pu)) : Z("", !0)
							])
						])) : Z("", !0)])])], 2))), 128)), F.value.items?.length ? Z("", !0) : (q(), J("span", Fu, "등록된 컴포넌트 없음"))])]),
						_: 1
					}, 8, ["selected-section"])
				], 2)) : Z("", !0)
			], 2)], 2),
			P.value ? Z("", !0) : (q(), J("button", Iu))
		], 10, Yc));
	}
}, Ru = document.querySelector("#visual-editor-app");
Ru && so(Lu, { mode: new URLSearchParams(window.location.search).get("mode") || Ru.dataset.mode || "editor" }).mount(Ru);
//#endregion
