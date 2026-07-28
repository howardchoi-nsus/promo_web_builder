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
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, D = ee((e) => e.replace(ne, "-$1").toLowerCase()), re = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = ee((e) => e ? `on${re(e)}` : ""), O = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, k = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, oe = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, se, ce = () => se ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function A(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? fe(r) : A(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var le = /;(?![^(]*\))/g, ue = /:([^]+)/, de = /\/\*[^]*?\*\//g;
function fe(e) {
	let t = {};
	return e.replace(de, "").split(le).forEach((e) => {
		if (e) {
			let n = e.split(ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function j(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = j(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var pe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", me = /* @__PURE__ */ e(pe);
pe + "";
function he(e) {
	return !!e || e === "";
}
function ge(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = M(e[r], t[r]);
	return n;
}
function M(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? ge(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !M(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
var _e = (e) => !!(e && e.__v_isRef === !0), N = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? _e(e) ? N(e.value) : JSON.stringify(e, ve, 2) : String(e), ve = (e, t) => _e(t) ? ve(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ye(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ye(e)) } : _(t) ? ye(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ye = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, P, be = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && P && (P.active ? (this.parent = P, this.index = (P.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = P;
			try {
				return P = this, e();
			} finally {
				P = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = P, P = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (P === this) P = this.prevScope;
			else {
				let e = P;
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
function xe() {
	return P;
}
var F, Se = /* @__PURE__ */ new WeakSet(), Ce = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, P && (P.active ? P.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Se.has(this) && (Se.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || De(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Re(this), L(this);
		let e = F, t = Pe;
		F = this, Pe = !0;
		try {
			return this.fn();
		} finally {
			ke(this), F = e, Pe = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Me(e);
			this.deps = this.depsTail = void 0, Re(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Se.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ae(this) && this.run();
	}
	get dirty() {
		return Ae(this);
	}
}, we = 0, Te, Ee;
function De(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ee, Ee = e;
		return;
	}
	e.next = Te, Te = e;
}
function Oe() {
	we++;
}
function I() {
	if (--we > 0) return;
	if (Ee) {
		let e = Ee;
		for (Ee = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Te;) {
		let t = Te;
		for (Te = void 0; t;) {
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
function L(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ke(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Me(r), Ne(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ae(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (je(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function je(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ze) || (e.globalVersion = ze, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ae(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = F, r = Pe;
	F = e, Pe = !0;
	try {
		L(e);
		let n = e.fn(e._value);
		(t.version === 0 || O(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		F = n, Pe = r, ke(e), e.flags &= -3;
	}
}
function Me(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Me(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ne(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Pe = !0, Fe = [];
function Ie() {
	Fe.push(Pe), Pe = !1;
}
function Le() {
	let e = Fe.pop();
	Pe = e === void 0 || e;
}
function Re(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = F;
		F = void 0;
		try {
			t();
		} finally {
			F = e;
		}
	}
}
var ze = 0, Be = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ve = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!F || !Pe || F === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== F) t = this.activeLink = new Be(F, this), F.deps ? (t.prevDep = F.depsTail, F.depsTail.nextDep = t, F.depsTail = t) : F.deps = F.depsTail = t, He(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = F.depsTail, t.nextDep = void 0, F.depsTail.nextDep = t, F.depsTail = t, F.deps === t && (F.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, ze++, this.notify(e);
	}
	notify(e) {
		Oe();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			I();
		}
	}
};
function He(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) He(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ue = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ Symbol(""), We = /* @__PURE__ */ Symbol(""), Ge = /* @__PURE__ */ Symbol("");
function z(e, t, n) {
	if (Pe && F) {
		let t = Ue.get(e);
		t || Ue.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ve()), r.map = t, r.key = n), r.track();
	}
}
function Ke(e, t, n, r, i, a) {
	let o = Ue.get(e);
	if (!o) {
		ze++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Oe(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ge || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ge)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(R)), f(e) && s(o.get(We)));
				break;
			case "delete":
				i || (s(o.get(R)), f(e) && s(o.get(We)));
				break;
			case "set":
				f(e) && s(o.get(R));
				break;
		}
	}
	I();
}
function qe(e) {
	let t = /* @__PURE__ */ B(e);
	return t === e ? t : (z(t, "iterate", Ge), /* @__PURE__ */ Mt(e) ? t : t.map(V));
}
function Je(e) {
	return z(e = /* @__PURE__ */ B(e), "iterate", Ge), e;
}
function Ye(e, t) {
	return /* @__PURE__ */ jt(e) ? H(/* @__PURE__ */ At(e) ? V(t) : t) : V(t);
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
		return s ? V(t) : t;
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
	let r = /* @__PURE__ */ B(e);
	z(r, "iterate", Ge);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Nt(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), r[t](...n)) : i;
}
function nt(e, t, n = []) {
	Ie(), Oe();
	let r = (/* @__PURE__ */ B(e))[t].apply(e, n);
	return I(), Le(), r;
}
var rt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), it = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function at(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ B(this);
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
		if (t === "__v_raw") return n === (r ? i ? wt : Ct : i ? St : xt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
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
			if (!/* @__PURE__ */ Mt(n) && !/* @__PURE__ */ jt(n) && (i = /* @__PURE__ */ B(i), n = /* @__PURE__ */ B(n)), !a && /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ U(e) ? e : r);
		return e === /* @__PURE__ */ B(r) && s && (o ? O(n, i) && Ke(e, "set", t, n, i) : Ke(e, "add", t, n)), s;
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
		return z(e, "iterate", d(e) ? "length" : R), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ B(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? ft : t ? H : V;
		return !t && z(a, "iterate", l ? We : R), s(Object.create(u), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ B(r), a = /* @__PURE__ */ B(n);
			e || (O(n, a) && z(i, "get", n), z(i, "get", a));
			let { has: o } = pt(i), s = t ? ft : e ? H : V;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && z(/* @__PURE__ */ B(t), "iterate", R), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ B(n), i = /* @__PURE__ */ B(t);
			return e || (O(t, i) && z(r, "has", t), z(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ B(a), s = t ? ft : e ? H : V;
			return !e && z(o, "iterate", R), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: ht("add"),
		set: ht("set"),
		delete: ht("delete"),
		clear: ht("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ B(this), r = pt(n), i = /* @__PURE__ */ B(e), a = !t && !/* @__PURE__ */ Mt(e) && !/* @__PURE__ */ jt(e) ? i : e;
			return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), Ke(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Mt(n) && !/* @__PURE__ */ jt(n) && (n = /* @__PURE__ */ B(n));
			let r = /* @__PURE__ */ B(this), { has: i, get: a } = pt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ B(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? O(n, s) && Ke(r, "set", e, n, s) : Ke(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ B(this), { has: n, get: r } = pt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ B(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ke(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ B(this), t = e.size !== 0, n = e.clear();
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
function B(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ B(t) : e;
}
function Pt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && k(e, "__v_skip", !0), e;
}
var V = (e) => v(e) ? /* @__PURE__ */ Et(e) : e, H = (e) => v(e) ? /* @__PURE__ */ Ot(e) : e;
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
		this.dep = new Ve(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ B(e), this._value = t ? e : V(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Mt(e) || /* @__PURE__ */ jt(e);
		e = n ? e : /* @__PURE__ */ B(e), O(e, t) && (this._rawValue = e, this._value = n ? e : V(e), this.dep.trigger());
	}
};
function Lt(e) {
	return /* @__PURE__ */ U(e) ? e.value : e;
}
var G = {
	get: (e, t, n) => t === "__v_raw" ? e : Lt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ U(i) && !/* @__PURE__ */ U(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Rt(e) {
	return /* @__PURE__ */ At(e) ? e : new Proxy(e, G);
}
var zt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ve(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ze - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && F !== this) return De(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return je(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Bt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new zt(r, i, n);
}
var Vt = {}, Ht = /* @__PURE__ */ new WeakMap(), Ut = void 0;
function Wt(e, t = !1, n = Ut) {
	if (n) {
		let t = Ht.get(n);
		t || Ht.set(n, t = []), t.push(e);
	}
}
function Gt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Mt(e) || o === !1 || o === 0 ? Kt(e, 1) : Kt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ U(e) ? (g = () => e.value, y = /* @__PURE__ */ Mt(e)) : /* @__PURE__ */ At(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ At(e) || /* @__PURE__ */ Mt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ U(e)) return e.value;
		if (/* @__PURE__ */ At(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ie();
			try {
				_();
			} finally {
				Le();
			}
		}
		let t = Ut;
		Ut = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Ut = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Kt(e(), t);
	}
	let x = xe(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Vt) : Vt, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => O(e, C[t])) : O(t, C))) {
				_ && _();
				let e = Ut;
				Ut = m;
				try {
					let e = [
						t,
						C === Vt ? void 0 : b && C[0] === Vt ? [] : C,
						v
					];
					C = t, f ? f(n, 3, e) : n(...e);
				} finally {
					Ut = e;
				}
			}
		} else m.run();
	};
	return u && u(w), m = new Ce(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Wt(e, !1, m), _ = m.onStop = () => {
		let e = Ht.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Ht.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Kt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ U(e)) Kt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Kt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Kt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Kt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Kt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.39/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function qt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Yt(e, t, n);
	}
}
function Jt(e, t, n, r) {
	if (h(e)) {
		let i = qt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Yt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Jt(e[a], t, n, r));
		return i;
	}
}
function Yt(e, n, r, i = !0) {
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
			Ie(), qt(o, null, 10, [
				e,
				i,
				a
			]), Le();
			return;
		}
	}
	Xt(e, r, a, i, s);
}
function Xt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Zt = [], Qt = -1, $t = [], en = null, tn = 0, nn = /* @__PURE__ */ Promise.resolve(), rn = null;
function an(e) {
	let t = rn || nn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function on(e) {
	let t = Qt + 1, n = Zt.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Zt[r], a = fn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function sn(e) {
	if (!(e.flags & 1)) {
		let t = fn(e), n = Zt[Zt.length - 1];
		!n || !(e.flags & 2) && t >= fn(n) ? Zt.push(e) : Zt.splice(on(t), 0, e), e.flags |= 1, cn();
	}
}
function cn() {
	rn ||= nn.then(pn);
}
function ln(e) {
	d(e) ? $t.push(...e) : en && e.id === -1 ? en.splice(tn + 1, 0, e) : e.flags & 1 || ($t.push(e), e.flags |= 1), cn();
}
function un(e, t, n = Qt + 1) {
	for (; n < Zt.length; n++) {
		let t = Zt[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Zt.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
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
		for (Qt = 0; Qt < Zt.length; Qt++) {
			let e = Zt[Qt];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), qt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Qt < Zt.length; Qt++) {
			let e = Zt[Qt];
			e && (e.flags &= -2);
		}
		Qt = -1, Zt.length = 0, dn(e), rn = null, (Zt.length || $t.length) && pn(e);
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
		r._d && wi(-1);
		let i = gn(t), a;
		try {
			a = e(...n);
		} finally {
			gn(i), r._d && wi(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function vn(e, n) {
	if (mn === null) return e;
	let r = sa(mn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Kt(o), i.push({
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
		c && (Ie(), Jt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Le());
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
	if (r || Dr) {
		let i = Dr ? Dr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
	u.call = (e, t, n) => Jt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ii(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : sn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Gt(e, n, u);
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
	let s = a.shapeFlag & 4 ? sa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ B(v), b = v === t ? i : (e) => !Nn(_, e) && u(y, e), x = (e, t) => !(t && Nn(_, t));
	if (m != null && m !== p) {
		if (In(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ U(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Ie();
		try {
			qt(p, f, 12, [l, _]);
		} finally {
			Le();
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
				t.id = -1, Pn.set(e, t), ii(t, r);
			} else In(e), i();
		}
	}
}
function In(e) {
	let t = Pn.get(e);
	t && (t.flags |= 8, Pn.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
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
			Ie();
			let i = Yi(n), a = Jt(t, n, e, r);
			return i(), Le(), a;
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
function K(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ At(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Mt(e), s = /* @__PURE__ */ jt(e), e = Je(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? H(V(e[n])) : V(e[n]) : e[n], n, void 0, a && a[n]);
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
function nr(e, t, n = {}, r, i) {
	if (mn.ce || mn.parent && Ln(mn.parent) && mn.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), J(), Ei(q, null, [ji("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), J();
	let o = a && rr(a(n)), s = n.key || o && o.key, c = Ei(q, { key: (s && !_(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function rr(e) {
	return e.some((e) => !Di(e) || !(e.type === vi || e.type === q && !rr(e.children))) ? e : null;
}
var ir = (e) => e ? Zi(e) ? sa(e) : ir(e.parent) : null, ar = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		sn(e.update);
	},
	$nextTick: (e) => e.n ||= an.bind(e.proxy),
	$watch: (e) => En.bind(e)
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
		if (d) return n === "$attrs" && z(e.attrs, "get", ""), d(e);
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
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: ee, renderTriggered: te, errorCaptured: E, serverPrefetch: ne, expose: D, inheritAttrs: re, components: ie, directives: O, filters: ae } = t;
	if (u && dr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Et(t));
	}
	if (lr = !0, o) for (let e in o) {
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
	if (c) for (let e in c) pr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			bn(t, e[t]);
		});
	}
	f && fr(f, e, "c");
	function k(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (k(Gn, p), k(Kn, m), k(qn, g), k(Jn, _), k(zn, y), k(Bn, b), k(er, E), k($n, ee), k(Qn, te), k(Yn, S), k(Xn, w), k(Zn, ne), d(D)) if (D.length) {
		let t = e.exposed ||= {};
		D.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), re != null && (e.inheritAttrs = re), ie && (e.components = ie), O && (e.directives = O), ne && Mn(e);
}
function dr(e, t, n = r) {
	d(e) && (e = yr(e));
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
function fr(e, t, n) {
	Jt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function pr(e, t, n, r) {
	let i = r.includes(".") ? Dn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && wn(i, n);
	} else if (h(e)) wn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => pr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && wn(i, r, e);
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
	props: Sr,
	emits: Sr,
	methods: xr,
	computed: xr,
	beforeCreate: br,
	created: br,
	beforeMount: br,
	mounted: br,
	beforeUpdate: br,
	updated: br,
	beforeDestroy: br,
	beforeUnmount: br,
	destroyed: br,
	unmounted: br,
	activated: br,
	deactivated: br,
	errorCaptured: br,
	serverPrefetch: br,
	components: xr,
	directives: xr,
	watch: Cr,
	provide: _r,
	inject: vr
};
function _r(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function vr(e, t) {
	return xr(yr(e), yr(t));
}
function yr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function br(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function xr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Sr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), cr(e), cr(t ?? {})) : t;
}
function Cr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = br(e[r], t[r]);
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
					let u = l._ceVNode || ji(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, sa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (Jt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
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
var Dr = null, Or = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function kr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Or(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(oe)));
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && Jt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Jt(u, e, 6, a);
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
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
function Nr(e) {
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
			}) : e(f, null)), y = t.props ? c : Pr(c);
		}
	} catch (t) {
		bi.length = 0, Yt(t, e, 1), v = ji(vi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Fr(y, a)), b = Pi(b, y, !1, !0));
	}
	return n.dirs && (b = Pi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && jn(b, n.transition), v = b, gn(_), v;
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
	return n === "style" && v(r) && v(i) ? !M(r, i) : r !== i;
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
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ B(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Mr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = E(o);
					i[t] = Kr(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Gr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = D(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Kr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ke(e.attrs, "set", "");
}
function Gr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Mr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ B(r), i = c || t;
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
					let o = Yi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
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
		let n = E(c[e]);
		Yr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
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
var Xr = (e) => e === "_" || e === "_ctx" || e === "$stable", Zr = (e) => d(e) ? e.map(Li) : [Li(e)], Qr = (e, t, n) => {
	if (t._n) return t;
	let r = _n((...e) => Zr(t(...e)), n);
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
		e ? (ti(r, t, n), n && k(r, "_", e, !0)) : $r(t, r);
	} else t && ei(e, t);
}, ri = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ti(a, n, r) : (o = !n.$stable, $r(n, a)), s = n;
	} else n && (ei(e, n), s = { default: 1 });
	if (o) for (let e in a) !Xr(e) && s[e] == null && delete a[e];
}, ii = gi;
function ai(e) {
	return oi(e);
}
function oi(e, i) {
	let a = ce();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Oi(e, t) && (r = M(e), j(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case _i:
				y(e, t, n, r);
				break;
			case vi:
				b(e, t, n, r);
				break;
			case yi:
				e ?? x(t, n, r, o);
				break;
			case q:
				ie(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? O(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ve);
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
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, si(e, a), s, u), _ && yn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Vi(f, r, e);
		}
		_ && yn(e, null, r, "beforeMount");
		let v = li(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ii(() => {
			try {
				f && Vi(f, r, e), v && g.enter(d), _ && yn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || hi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ri(e[l]) : Li(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && ci(r, !1), (g = h.onVnodeBeforeUpdate) && Vi(g, r, n, e), f && yn(n, e, r, "beforeUpdate"), r && ci(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? D(e.dynamicChildren, d, l, r, i, si(n, a), o) : s || le(e, n, l, null, r, i, si(n, a), o, !1), u > 0) {
			if (u & 16) re(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && re(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && ii(() => {
			g && Vi(g, r, n, e), f && yn(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === q || !Oi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ui(e, t, !0)) : le(e, t, n, f, i, a, s, c, l);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : k(t, n, r, i, a, o, c) : oe(e, t, c);
	}, k = (e, t, n, r, i, a, o) => {
		let s = e.component = Wi(e, r, i);
		if (Rn(e) && (s.ctx.renderer = ve), $i(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o), !e.el) {
				let r = s.subTree = ji(vi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (Ir(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			A(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = fi(e);
					if (n) {
						t && (t.el = c.el, A(e, t, o)), n.asyncDep.then(() => {
							ii(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				ci(e, !1), t ? (t.el = c.el, A(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Vi(d, s, t, c), ci(e, !0);
				let f = Nr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), M(p), e, i, a), t.el = f.el, u === null && zr(e, f.el), r && ii(r, i), (d = t.props && t.props.onVnodeUpdated) && ii(() => Vi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ln(t);
				if (ci(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Vi(o, d, t), ci(e, !0), s && P) {
					let t = () => {
						e.subTree = Nr(e), P(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Nr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ii(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ii(() => Vi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ln(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ii(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ce(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => sn(u), ci(e, !0), l();
	}, A = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Wr(e, t.props, r, n), ri(e, t.children, n), Ie(), un(e), Le();
	}, le = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				de(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ge(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? de(l, d, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, ue = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ri(t[p]) : Li(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ge(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, de = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Ri(t[u]) : Li(t[u]);
			if (Oi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Ri(t[p]) : Li(t[p]);
			if (Oi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ri(t[u]) : Li(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) j(e[u], a, o, !0), u++;
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
					j(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Oi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? j(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? di(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || mi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? fe(n, r, p, 2) : _--);
			}
		}
	}, fe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			fe(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, ve);
			return;
		}
		if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) fe(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === yi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[An] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ii(() => l.enter(a), i));
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
	}, j = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ie(), Fn(s, null, n, e, !0), Le()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ln(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Vi(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && yn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ii(() => {
			_ && Vi(_, t, e), h && yn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === q) {
			me(n, r);
			return;
		}
		if (t === yi) {
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
	}, me = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		pi(c), pi(l), r && ae(r), i.stop(), a && (a.flags |= 8, j(o, e, t, n)), s && ii(s, t), ii(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) j(e[o], t, n, r, i);
	}, M = (e) => {
		if (e.shapeFlag & 6) return M(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[On];
		return n ? h(n) : t;
	}, _e = !1, N = (e, t, n) => {
		let r;
		e == null ? t._vnode && (j(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, un(r), dn(), !1);
	}, ve = {
		p: v,
		um: j,
		m: fe,
		r: pe,
		mt: k,
		mc: E,
		pc: le,
		pbc: D,
		n: M,
		o: e
	}, ye, P;
	return i && ([ye, P] = i(ve)), {
		render: N,
		hydrate: ye,
		createApp: Er(N, ye)
	};
}
function si({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ci({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function li(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ui(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ri(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ui(t, a)), a.type === _i && (a.patchFlag === -1 && (a = i[e] = Ri(a)), a.el = t.el), a.type === vi && !a.el && (a.el = t.el);
	}
}
function di(e) {
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
function fi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : fi(t);
}
function pi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function mi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? mi(t.subTree) : null;
}
var hi = (e) => e.__isSuspense;
function gi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : ln(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), _i = /* @__PURE__ */ Symbol.for("v-txt"), vi = /* @__PURE__ */ Symbol.for("v-cmt"), yi = /* @__PURE__ */ Symbol.for("v-stc"), bi = [], xi = null;
function J(e = !1) {
	bi.push(xi = e ? null : []);
}
function Si() {
	bi.pop(), xi = bi[bi.length - 1] || null;
}
var Ci = 1;
function wi(e, t = !1) {
	Ci += e, e < 0 && xi && t && (xi.hasOnce = !0);
}
function Ti(e) {
	return e.dynamicChildren = Ci > 0 ? xi || n : null, Si(), Ci > 0 && xi && xi.push(e), e;
}
function Y(e, t, n, r, i, a) {
	return Ti(X(e, t, n, r, i, a, !0));
}
function Ei(e, t, n, r, i) {
	return Ti(ji(e, t, n, r, i, !0));
}
function Di(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Oi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ki = ({ key: e }) => e ?? null, Ai = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ U(e) || h(e) ? {
	i: mn,
	r: e,
	k: t,
	f: !!n
} : e);
function X(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ki(t),
		ref: t && Ai(t),
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
	return s ? (zi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Ci > 0 && !o && xi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && xi.push(c), c;
}
var ji = Mi;
function Mi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === tr) && (e = vi), Di(e)) {
		let r = Pi(e, t, !0);
		return n && zi(r, n), Ci > 0 && !a && xi && (r.shapeFlag & 6 ? xi[xi.indexOf(e)] = r : xi.push(r)), r.patchFlag = -2, r;
	}
	if (ca(e) && (e = e.__vccOpts), t) {
		t = Ni(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = j(e)), v(n) && (/* @__PURE__ */ Nt(n) && !d(n) && (n = s({}, n)), t.style = A(n));
	}
	let o = g(e) ? 1 : hi(e) ? 128 : kn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function Ni(e) {
	return e ? /* @__PURE__ */ Nt(e) || Hr(e) ? s({}, e) : e : null;
}
function Pi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Bi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ki(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Ai(t)) : [a, Ai(t)] : Ai(t) : a,
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
	return ji(_i, null, e, t);
}
function Ii(e, t) {
	let n = ji(yi, null, e);
	return n.staticCount = t, n;
}
function Z(e = "", t = !1) {
	return t ? (J(), Ei(vi, null, e)) : ji(vi, null, e);
}
function Li(e) {
	return e == null || typeof e == "boolean" ? ji(vi) : d(e) ? ji(q, null, e.slice()) : Di(e) ? Ri(e) : ji(_i, null, String(e));
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
		!r && !Hr(t) ? t._ctx = mn : r === 3 && mn && (mn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			zi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: mn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Fi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Bi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = j([t.class, r.class]));
		else if (e === "style") t.style = A([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Vi(e, t, n, r = null) {
	Jt(e, t, 7, [n, r]);
}
var Hi = wr(), Ui = 0;
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
		scope: new be(!0),
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
var Gi = null, Ki = () => Gi || mn, qi, Ji;
{
	let e = ce(), t = (t, n) => {
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
	Ur(e, r, a, t), ni(e, i, n || t);
	let o = a ? ea(e, t) : void 0;
	return t && Ji(!1), o;
}
function ea(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, sr);
	let { setup: r } = n;
	if (r) {
		Ie();
		let n = e.setupContext = r.length > 1 ? oa(e) : null, i = Yi(e), a = qt(r, e, 0, [e.props, n]), o = y(a);
		if (Le(), i(), (o || e.sp) && !Ln(e) && Mn(e), o) {
			if (a.then(Xi, Xi), t) return a.then((n) => {
				ta(e, n, t);
			}).catch((t) => {
				Yt(t, e, 0);
			});
			e.asyncDep = a;
		} else ta(e, a, t);
	} else ia(e, t);
}
function ta(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Rt(t)), ia(e, n);
}
var na, ra;
function ia(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && na && !i.render) {
			let t = i.template || mr(e).template;
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
		Ie();
		try {
			ur(e);
		} finally {
			Le(), t();
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Rt(Pt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ar) return ar[n](e);
		},
		has(e, t) {
			return t in e || t in ar;
		}
	}) : e.proxy;
}
function ca(e) {
	return h(e) && "__vccOpts" in e;
}
var Q = (e, t) => /* @__PURE__ */ Bt(e, t, Qi), la = "3.5.39", ua = void 0, da = typeof window < "u" && window.trustedTypes;
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
		Ta.test(n) ? e.setProperty(D(r), n.replace(Ta, ""), "important") : e[r] = n;
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
	let r = E(t);
	if (r !== "filter" && r in e) return Oa[t] = r;
	r = re(r);
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
function Ma(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ja, t.slice(6, t.length)) : e.setAttributeNS(ja, t, n) : n == null || a && !he(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = he(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
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
				e && Jt(e, t, 5, a);
			}
		} else Jt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ua(), n;
}
var Ga = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ka = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ya(e, r, c) : t === "style" ? wa(e, n, r) : a(t) ? o(t) || La(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : qa(e, t, r, c)) ? (Na(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ma(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ja(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Na(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ma(e, t, r, c));
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
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var Ya = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ae(t, e) : t;
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
	return t && (e = e.trim()), n && (e = oe(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? oe(e.value) : e.value, c = t ?? "";
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
	return ao ||= ai(io);
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
//#endregion
//#region shared/promo-token-runtime.mjs
var uo = /^--(?:promo|app)-[a-z0-9-]+$/;
function fo(e) {
	if (Array.isArray(e)) {
		let t = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			let n = String(e?.tokenKey || e?.token_key || "").trim(), r = String(e?.value ?? e?.tokenValue ?? e?.token_value ?? "").trim();
			!uo.test(n) || !r || (t.has(n) || t.set(n, []), t.get(n).push({
				value: r,
				valueIndex: Math.max(0, Number.parseInt(e?.valueIndex ?? e?.value_index ?? 0, 10) || 0)
			}));
		}), Object.fromEntries([...t.entries()].map(([e, t]) => [e, t.sort((e, t) => e.valueIndex - t.valueIndex).map((e) => e.value).join(", ")]));
	}
	return !e || typeof e != "object" ? {} : Object.fromEntries(Object.entries(e).map(([e, t]) => [String(e).trim(), String(t ?? "").trim()]).filter(([e, t]) => uo.test(e) && t));
}
function po(e, t = {}) {
	let n = fo(e), r = String(t.background || "#f5f7fb"), i = String(t.text || "#172033"), a = String(t.muted || "#64748b"), o = String(t.accent || "#2563eb"), s = String(t.cta || o), c = String(t.ctaInk || "#ffffff"), l = String(t.radius || "2px"), u = String(t.shadow || "0 10px 32px rgba(33, 43, 61, .12)"), d = n["--promo-bg"] || n["--app-bg"] || n["--promo-surface"] || n["--app-surface"], f = n["--promo-text"] || n["--app-ink"], p = n["--promo-muted"] || n["--app-muted"], m = n["--promo-accent"] || n["--app-accent"], h = n["--promo-radius"] || n["--app-radius"], g = n["--promo-shadow"] || n["--app-shadow"];
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
		"--promo-font": n["--app-font-body"] || n["--promo-font"] || t.font || "",
		"--promo-radius": h || l,
		"--promo-shadow": g || u,
		"--promo-hero-bg-image": n["--app-hero-bg-image"] || "none",
		"--promo-button-height": n["--app-button-height"] || "44px",
		"--promo-space-4": n["--app-space-4"] || "18px",
		"--promo-border-width": n["--app-border-width"] || "2px",
		"--promo-font-size-body": n["--app-font-size-body"] || "16px",
		"--promo-title-size": n["--promo-title-size"] || t.titleSize || "clamp(28px, 5vw, 72px)",
		"--promo-font-weight-strong": n["--app-font-weight-strong"] || "800",
		"--promo-transition-duration": n["--app-transition-duration-normal"] || "200ms",
		"--promo-transition-delay": n["--app-transition-delay"] || "0ms",
		"--promo-transition-ease": n["--app-ease"] || "ease",
		...n
	};
}
//#endregion
//#region visual-editor/src/editor-utils.mjs
var mo = /* @__PURE__ */ new Set(["http:", "https:"]);
function ho(e) {
	let t = String(e || "").trim();
	if (!t) return "#";
	if (t.startsWith("#") || t.startsWith("./") || t.startsWith("../") || /^\/(?!\/)/.test(t)) return t;
	try {
		let e = new URL(t);
		return mo.has(e.protocol.toLowerCase()) ? t : "#";
	} catch {
		return "#";
	}
}
function go(e = {}) {
	let t = { ...e };
	return delete t.positionMode, delete t.xPct, delete t.yPx, delete t.yPct, t;
}
function _o(e, t, n) {
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
var vo = .01;
function yo(e, t, n, r) {
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
}
function bo(e) {
	return Math.round(Number(e) * 100) / 100;
}
function xo(e = {}) {
	let t = Array.isArray(e.fields) ? e.fields : [];
	return t.length > 1 ? t.reduce((e, t) => e + xo(t), 24) : e.fieldKind === "image" ? 250 : e.fieldKind === "cta" ? 64 : 86;
}
function So({ item: e = {}, style: t = {}, canvasWidth: n, fallbackX: r = 0, fallbackY: i = 0 } = {}) {
	let a = Math.max(1, Number(n) || 1280), o = yo(t.widthPct, vo, 100, 32), s = yo(t.heightPx, 1, 900, xo(e));
	return {
		x: yo(t.xPct, 0, 100, r) / 100 * a,
		y: yo(t.yPx, 0, 1200, i),
		width: o / 100 * a,
		height: s,
		widthPct: o,
		fontSize: yo(t.fontSize, 0, 80, 18)
	};
}
function Co(e, t, { includeHeight: n = !0, includeFontSize: r = !0 } = {}) {
	let i = Math.max(1, Number(t) || 1280);
	return {
		positionMode: "free",
		xPct: bo(e.x / i * 100),
		yPx: bo(e.y),
		widthPct: bo(e.width / i * 100),
		...n ? { heightPx: bo(e.height) } : {},
		...r ? { fontSize: bo(e.fontSize) } : {}
	};
}
//#endregion
//#region visual-editor/src/platform/layout-engine/resize.mjs
function wo(e, t) {
	return String(e || "se").includes(t);
}
function To({ geometry: e, deltaX: t = 0, deltaY: n = 0, direction: r = "se", minimumWidth: i = 1, minimumHeight: a = 1, maximumWidth: o = Infinity, maximumHeight: s = 900, aspectRatioLocked: c = !1, aspectRatio: l = 1, scaleFont: u = !0, maximumFontSize: d = 80 } = {}) {
	let f = {
		x: Number(e?.x) || 0,
		y: Number(e?.y) || 0,
		width: Math.max(i, Number(e?.width) || i),
		height: Math.max(a, Number(e?.height) || a),
		fontSize: yo(e?.fontSize, 0, d, 18)
	}, p = wo(r, "w"), m = wo(r, "e"), h = wo(r, "n"), g = wo(r, "s"), _ = p || m, v = h || g, y = _ ? p ? -t : t : 0, b = v ? h ? -n : n : 0, x = _ ? yo(f.width + y, i, o, f.width) : f.width, S = v ? yo(f.height + b, a, s, f.height) : f.height;
	if (c) {
		let e = Number(l) > 0 ? Number(l) : 1;
		v && (!_ || Math.abs(n) > Math.abs(t)) ? (x = yo(S * e, i, o, f.width), S = yo(x / e, a, s, f.height)) : (S = yo(x / e, a, s, f.height), x = yo(S * e, i, o, f.width));
	}
	let C = p ? f.x + f.width - x : f.x, w = h ? f.y + f.height - S : f.y, T = f.width ? x / f.width : 1, ee = f.height ? S / f.height : 1, te = _ && v ? Math.sqrt(T * ee) : _ ? T : ee, E = Math.max(_ ? x - f.width : 0, v ? S - f.height : 0, 0), ne = f.fontSize === 0 ? E / 4 : f.fontSize * te, D = u ? yo(ne, 0, d, f.fontSize) : f.fontSize;
	return {
		x: bo(C),
		y: bo(w),
		width: bo(x),
		height: bo(S),
		fontSize: bo(D),
		widthScale: T,
		heightScale: ee
	};
}
//#endregion
//#region visual-editor/src/PromoPageRenderer.vue
var Eo = {
	key: 0,
	class: "content-width-guide",
	"aria-hidden": "true"
}, Do = ["data-section-key", "aria-busy"], Oo = ["title"], ko = {
	key: 0,
	"aria-hidden": "true"
}, Ao = { class: "rendered-section__inner" }, jo = [
	"data-item-key",
	"data-style-key",
	"onClick",
	"onPointerdown"
], Mo = {
	key: 0,
	class: "output-hidden-badge"
}, No = {
	key: 1,
	class: "rendered-component-fields"
}, Po = [
	"href",
	"target",
	"rel"
], Fo = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Io = {
	key: 0,
	class: "rendered-image__placeholder"
}, Lo = {
	key: 0,
	"aria-hidden": "true"
}, Ro = ["data-field-key", "onDblclick"], zo = ["data-field-key", "onDblclick"], Bo = [
	"href",
	"target",
	"rel"
], Vo = [
	"role",
	"aria-label",
	"aria-hidden",
	"aria-busy"
], Ho = {
	key: 0,
	class: "rendered-image__placeholder"
}, Uo = ["title"], Wo = {
	key: 0,
	"aria-hidden": "true"
}, Go = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Ko = ["onDblclick"], qo = ["onDblclick"], Jo = [
	"aria-label",
	"onPointerdown",
	"onKeydown"
], Yo = [
	"aria-label",
	"title",
	"onPointerdown"
], Xo = 20, Zo = {
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
		}), a = Q(() => fo(n.content?.formTemplate?.designTokens?.values)), o = Q(() => po(a.value, {
			background: n.designSpec?.theme?.backgroundColor,
			text: n.designSpec?.theme?.textColor,
			accent: n.designSpec?.theme?.accentColor,
			cta: n.designSpec?.theme?.ctaColor || n.designSpec?.theme?.accentColor,
			ctaTransparent: n.designSpec?.theme?.ctaVariant === "ghost",
			radius: n.designSpec?.theme?.ctaShape === "round" ? "999px" : "2px"
		}));
		function s(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function c(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function l(e, t, n) {
			return `${c(e, t)}.${n.fieldKey}`;
		}
		function u(e, t) {
			return t?.isRequired || t?.isLocked ? !0 : n.designSpec?.visibility?.items?.[c(e, t)] !== !1;
		}
		function d(e, t, r) {
			return r?.isRequired || r?.isLocked ? !0 : n.designSpec?.visibility?.fields?.[l(e, t, r)] !== !1;
		}
		function f(e, t) {
			return s(t).filter((r) => n.editable || d(e, t, r));
		}
		function p(e, t, r = null) {
			let i = n.content?.sectionInputs?.[e.sectionKey]?.[t.itemKey];
			return !r || s(t).length <= 1 ? i : i?.fields?.[r.fieldKey];
		}
		function m(e) {
			let t = String(e?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(t) ? t : "";
		}
		function h(e, t) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) && e.aiDesign.imageTargetItemKeys.includes(t?.itemKey);
		}
		function g(e, t, n) {
			if (h(e, t)) return !1;
			let r = String(n?.value || "").trim();
			return n?.source === "ai" || r.startsWith("/api/promo-section-design-image?");
		}
		function _(e) {
			return (e.items || []).filter((t) => (n.editable || u(e, t)) && (t.fieldKind !== "image" || !g(e, t, p(e, t))) && (s(t).length <= 1 || f(e, t).length > 0));
		}
		function v(e) {
			let t = String(w(e).backgroundImage || "").trim(), n = (e.items || []).filter((e) => e.fieldKind === "image").map((t) => ({
				item: t,
				value: p(e, t)
			})).find(({ item: t, value: n }) => g(e, t, n)), r = t || String(n?.value?.value || "").trim();
			return /^(https?:\/\/|\/api\/)/i.test(r) ? r : "";
		}
		function y(e) {
			return ho(e?.link);
		}
		function b(e) {
			return e && typeof e == "object" ? !!(e.value || e.label || e.description) : !!String(e || "").trim();
		}
		function x(e, t = null) {
			let n = t || e;
			return String(n?.description || n?.editorSchema?.description || (t ? "" : e?.description) || "내용을 입력하세요").trim();
		}
		function S(e, t) {
			return `${e.sectionKey}.${t.itemKey}`;
		}
		function C(e, t) {
			return n.designSpec?.itemStyles?.[S(e, t)] || {};
		}
		function w(e) {
			return n.designSpec?.sectionStyles?.[e.sectionKey] || {};
		}
		let T = /* @__PURE__ */ new Set([
			"queued",
			"analyzing_content",
			"generating_layout",
			"validating_layout",
			"generating_assets",
			"validating_assets",
			"applying"
		]);
		function ee(e) {
			return n.sectionDesignRuns?.[e.sectionKey] || null;
		}
		function te(e, t) {
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
		function E(e, t = null, n = null) {
			let r = ee(e), i = r?.constraintsSnapshot?.imageTarget;
			return (t ? i?.type === "item" && i.itemKey === t.itemKey && (!n || !i.fieldKey || i.fieldKey === n.fieldKey) : i?.type === "section-background") ? T.has(r.status) ? {
				kind: "processing",
				label: te(r.status, i.type)
			} : r.status === "failed" ? {
				kind: "failed",
				label: i.type === "item" ? "AI 이미지 생성 실패" : "AI 배경 생성 실패",
				detail: String(r.errorMessage || "").trim()
			} : null : null;
		}
		function ne(e, t) {
			let n = C(e, t);
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
		function D(e, t, n, r) {
			let i = Number(e);
			return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
		}
		function re(e, t = "1 / 1") {
			let n = String(e || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
			return !n || Number(n[1]) <= 0 || Number(n[2]) <= 0 ? t : `${Number(n[1])} / ${Number(n[2])}`;
		}
		function ie(e, t) {
			return t.shape === "circle" ? "1 / 1" : re(t.aspectRatio || e.image?.aspectRatio, "1 / 1");
		}
		function O(e, t) {
			let n = C(e, t), r = m(p(e, t)), i = [
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
		function ae(e, t, r) {
			return n.designSpec?.itemStyles?.[`${S(e, t)}.${r.fieldKey}`] || {};
		}
		function k(e, t, n) {
			let r = ae(e, t, n), i = m(p(e, t, n)), a = [
				"square",
				"rounded",
				"circle"
			].includes(r.shape) ? r.shape : "square";
			return {
				backgroundImage: i ? `url(${JSON.stringify(i)})` : void 0,
				backgroundSize: ["contain", "cover"].includes(r.imageFit) ? r.imageFit : "contain",
				backgroundPosition: r.imagePosition || "center center",
				backgroundRepeat: "no-repeat",
				aspectRatio: re(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius, 24px)" : "0"
			};
		}
		function oe(e, t, n) {
			let r = ae(e, t, n), i = p(e, t, n);
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
		function se(e, t) {
			let n = C(e, t), r = p(e, t);
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
		function ce(e) {
			return xo(e);
		}
		function le(e) {
			return Math.max(180, (e.items || []).reduce((e, t) => e + ce(t), 0) + 52);
		}
		function ue(e, t) {
			let n = e.items || [], r = Math.max(0, n.findIndex((e) => e.itemKey === t.itemKey)), i = n.slice(0, r).reduce((e, t) => e + ce(t), 0), a = w(e).minHeight || le(e), o = Math.max(50, a - Xo);
			return {
				xPct: 0,
				yPct: o ? i / o * 100 : 0
			};
		}
		function de(e) {
			return [
				"none",
				"left",
				"right",
				"both"
			].includes(e.backgroundFadeMode) ? e.backgroundFadeMode : e.backgroundFadeSafeArea === "left-copy" ? "left" : e.backgroundFadeSafeArea === "right-copy" ? "right" : e.backgroundFadeSafeArea === "center-copy" ? "both" : "none";
		}
		function fe(e) {
			let t = String(e.backgroundColor || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(t)) return t;
			let r = String(a.value["--promo-bg"] || a.value["--app-bg"] || a.value["--promo-surface"] || a.value["--app-surface"] || "").trim();
			if (/^#[0-9a-f]{6}$/i.test(r)) return r;
			let i = String(n.designSpec?.theme?.backgroundColor || "").trim();
			return /^#[0-9a-f]{6}$/i.test(i) ? i : "#f5f7fb";
		}
		function pe(e, t, n = "medium", r = {}) {
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
		function me(e) {
			let t = w(e), n = t.minHeight || le(e), r = v(e), i = fe(t), a = r ? pe(de(t), i, t.backgroundFadeStrength, t.backgroundFadeStops) : "", o = t.backgroundFitMode || (t.backgroundSize === "100% auto" ? "width-fill" : t.backgroundSize), s = o === "width-fill" ? "100% auto" : ["contain", "cover"].includes(o) ? o : "cover";
			return {
				height: `${Math.max(50, n)}px`,
				backgroundColor: i,
				backgroundImage: r ? [a, `url(${JSON.stringify(r)})`].filter(Boolean).join(", ") : void 0,
				backgroundSize: r ? a ? `100% 100%, ${s}` : s : void 0,
				backgroundPosition: r ? a ? `center, ${t.backgroundPosition || "center center"}` : t.backgroundPosition || "center center" : void 0,
				backgroundRepeat: r ? a ? `no-repeat, ${t.backgroundRepeat || "no-repeat"}` : t.backgroundRepeat || "no-repeat" : void 0
			};
		}
		function he(e) {
			let t = w(e).minHeight || le(e);
			return { height: `${Math.max(0, t - Xo)}px` };
		}
		function ge(e, t) {
			let n = C(e, t), r = n.positionMode === "free" ? n : ue(e, t), i = t.fieldKind === "image", a = D(n.widthPct, vo, 100, 32), o = D(n.heightPx, 1, 900, i ? void 0 : xo(t));
			return {
				left: `${r.xPct || 0}%`,
				top: n.yPx === void 0 ? `${r.yPct || 0}%` : `${n.yPx}px`,
				zIndex: n.zIndex || 2,
				color: n.colorToken ? `var(${n.colorToken})` : n.color,
				"--item-color": n.colorToken ? `var(${n.colorToken})` : n.color,
				fontSize: n.fontSizeToken ? `var(${n.fontSizeToken})` : n.fontSize === void 0 ? void 0 : `${n.fontSize}px`,
				"--item-font-size": n.fontSizeToken ? `var(${n.fontSizeToken})` : n.fontSize === void 0 ? void 0 : `${n.fontSize}px`,
				fontWeight: n.fontWeight,
				"--item-font-weight": n.fontWeight,
				width: `${a}%`,
				height: o && (!i || n.shape !== "circle") ? `${o}px` : void 0,
				aspectRatio: i && (!o || n.shape === "circle") ? ie(t, n) : void 0
			};
		}
		function M(e, t, i = null) {
			if (!n.editable) return;
			let a = !!(i?.ctrlKey || i?.metaKey || i?.shiftKey), o = S(e, t);
			!a && (n.selectedItemKey === o || n.selectedItemKeys.includes(o)) || r("select-item", e, t, { additive: a });
		}
		function _e(e, t, i) {
			if (!n.editable || i.isLocked || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest(".item-resize-handle") || e.currentTarget.classList.contains("is-editing")) return;
			let a = e.currentTarget, o = a.closest(".rendered-items");
			if (!o) return;
			e.preventDefault(), M(t, i), a.setPointerCapture(e.pointerId), a.classList.add("is-dragging");
			let s = o.getBoundingClientRect(), c = a.getBoundingClientRect(), l = e.clientX, u = e.clientY, d = c.left - s.left, f = c.top - s.top, p = d, m = f, h = 0, g = !1, _ = (e) => {
				!g && Math.abs(e.clientX - l) < 3 && Math.abs(e.clientY - u) < 3 || (g = !0, p = Math.min(Math.max(0, s.width - a.offsetWidth), Math.max(0, d + e.clientX - l)), m = Math.min(Math.max(0, s.height - a.offsetHeight), Math.max(0, f + e.clientY - u)), !h && (h = requestAnimationFrame(() => {
					h = 0, a.style.left = `${p}px`, a.style.top = `${m}px`;
				})));
			}, v = () => {
				if (h && cancelAnimationFrame(h), g) {
					let e = s.width ? p / s.width * 100 : 0;
					r("update-item-style", {
						positionMode: "free",
						xPct: e,
						yPx: m
					});
				}
				a.classList.remove("is-dragging"), a.removeEventListener("pointermove", _), a.removeEventListener("pointerup", v), a.removeEventListener("pointercancel", v);
			};
			a.addEventListener("pointermove", _), a.addEventListener("pointerup", v), a.addEventListener("pointercancel", v);
		}
		function ve(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || e.button !== 0) return;
			let o = e.currentTarget, s = o.closest(".rendered-item"), c = s?.closest(".rendered-items");
			if (!s || !c) return;
			e.preventDefault(), e.stopPropagation(), M(t, i), o.setPointerCapture(e.pointerId), s.classList.add("is-resizing");
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = C(t, i), m = i.fieldKind === "image", h = m && p.aspectRatioLocked !== !1, g = a.includes("w") || a.includes("e"), _ = a.includes("n") || a.includes("s"), v = ue(t, i), y = Math.max(50, (w(t).minHeight || le(t)) - Xo), b = So({
				item: i,
				style: p,
				canvasWidth: l.width,
				fallbackX: v.xPct || 0,
				fallbackY: (v.yPct || 0) / 100 * y
			});
			m && p.heightPx === void 0 && (b.height = u.height);
			let x = b.height ? b.width / b.height : 1, S = { ...b }, T = 0, ee = (e) => {
				let t = Math.max(1, a.includes("w") ? b.width + b.x : l.width - b.x), n = Math.max(1, a.includes("n") ? b.height + b.y : 1124 - b.y);
				S = To({
					geometry: b,
					deltaX: e.clientX - d,
					deltaY: e.clientY - f,
					direction: a,
					minimumWidth: 1,
					minimumHeight: 1,
					maximumWidth: t,
					maximumHeight: n,
					aspectRatioLocked: h || m && p.shape === "circle",
					aspectRatio: p.shape === "circle" ? 1 : x,
					scaleFont: !m
				}), !T && (T = requestAnimationFrame(() => {
					T = 0, s.style.left = `${S.x}px`, s.style.top = `${S.y}px`, (g || h) && (s.style.width = `${S.width}px`), (_ || h) && (s.style.height = `${S.height}px`), m ? s.style.aspectRatio = "auto" : s.style.setProperty("--item-font-size", `${S.fontSize}px`);
				}));
			}, te = () => {
				T && cancelAnimationFrame(T);
				let e = Math.ceil(S.y + S.height + Xo);
				e > (w(t).minHeight || le(t)) && r("update-section-style", t.sectionKey, { minHeight: Math.min(1200, e) });
				let n = Co(S, l.width, {
					includeHeight: _ && !h && !(m && p.shape === "circle"),
					includeFontSize: !m
				});
				r("update-renderer-item-style", t, i, {
					...n,
					...!_ && !h ? { heightPx: p.heightPx } : {},
					...m ? { aspectRatio: `${Math.max(1, Math.round(S.width))}/${Math.max(1, Math.round(S.height))}` } : {}
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("--item-font-size"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", ee), o.removeEventListener("pointerup", te), o.removeEventListener("pointercancel", te);
			};
			o.addEventListener("pointermove", ee), o.addEventListener("pointerup", te), o.addEventListener("pointercancel", te);
		}
		function ye(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = C(t, i), s = i.fieldKind === "image", c = s && o.aspectRatioLocked !== !1, l = e.shiftKey ? 4 : 1, u = a.includes("w") || a.includes("e"), d = a.includes("n") || a.includes("s"), f = e.currentTarget.closest(".rendered-items");
			if (!f) return;
			let p = Math.max(1, f.getBoundingClientRect().width), m = u ? e.key === "ArrowRight" ? p * l / 100 : e.key === "ArrowLeft" ? -p * l / 100 : 0 : 0, h = d ? e.key === "ArrowDown" ? l * 4 : e.key === "ArrowUp" ? l * -4 : 0 : 0;
			if (!m && !h) return;
			let g = ue(t, i), _ = Math.max(50, (w(t).minHeight || le(t)) - Xo), v = So({
				item: i,
				style: o,
				canvasWidth: p,
				fallbackX: g.xPct || 0,
				fallbackY: (g.yPct || 0) / 100 * _
			}), y = To({
				geometry: v,
				deltaX: m,
				deltaY: h,
				direction: a,
				minimumWidth: vo / 100 * p,
				minimumHeight: 1,
				maximumWidth: a.includes("w") ? v.width + v.x : p - v.x,
				maximumHeight: 900,
				aspectRatioLocked: c || s && o.shape === "circle",
				aspectRatio: o.shape === "circle" ? 1 : v.width / v.height,
				scaleFont: !s
			});
			r("update-renderer-item-style", t, i, {
				...Co(y, p, {
					includeHeight: d && !c && !(s && o.shape === "circle"),
					includeFontSize: !s
				}),
				...!d && !c ? { heightPx: o.heightPx } : {}
			});
		}
		function P(e, t, i, a = null) {
			if (!n.editable || i.isLocked) return;
			let o = e.currentTarget, s = o.closest(".rendered-item");
			if (!s) return;
			let c = a || i;
			if (c.fieldKind !== "text" || c.isLocked) return;
			e.preventDefault(), e.stopPropagation(), M(t, i);
			let l = !b(p(t, i, a)), u = x(i, a);
			s.classList.add("is-editing"), o.classList.remove("rendered-empty"), o.classList.add("rendered-text"), o.contentEditable = "true", l && (o.textContent = u), o.focus();
			let d = window.getSelection(), f = document.createRange();
			f.selectNodeContents(o), d.removeAllRanges(), d.addRange(f);
			let m = () => {
				let e = o.innerText.replace(/\r\n?/g, "\n").trim();
				l && e === u ? (o.classList.remove("rendered-text"), o.classList.add("rendered-empty"), o.textContent = u) : r("update-item-content", t, i, e, a), o.contentEditable = "false", s.classList.remove("is-editing"), o.removeEventListener("blur", m), o.removeEventListener("keydown", h);
			}, h = (e) => {
				e.key === "Escape" && (e.preventDefault(), o.blur());
			};
			o.addEventListener("blur", m), o.addEventListener("keydown", h);
		}
		function be(e, t) {
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
			let u = l ? Math.max(0, c - l.height) : Xo, d = o ? [...o.querySelectorAll(".rendered-item")].reduce((e, t) => {
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
		return (t, n) => (J(), Y("div", {
			class: j(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-editor-guides": e.editable && e.showGuides
			}]),
			style: A({
				"--promo-font": e.designSpec.theme.fontFamily,
				"--promo-width": `${Math.min(1280, Number(e.designSpec.responsive.contentMaxWidth || 1280))}px`,
				"--promo-min-width": `${e.designSpec.responsive.contentMinWidth || 0}px`,
				...o.value
			})
		}, [e.editable && e.showGuides ? (J(), Y("div", Eo)) : Z("", !0), (J(!0), Y(q, null, K(i.value, (t) => (J(), Y("section", {
			key: t.sectionKey,
			class: j(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: A(me(t)),
			"aria-busy": E(t)?.kind === "processing" ? "true" : void 0
		}, [
			e.editable && E(t) ? (J(), Y("div", {
				key: 0,
				class: j(["section-ai-state", `is-${E(t).kind}`]),
				role: "status",
				"aria-live": "polite",
				title: E(t).detail || void 0
			}, [E(t).kind === "processing" ? (J(), Y("i", ko)) : Z("", !0), X("span", null, N(E(t).label), 1)], 10, Oo)) : Z("", !0),
			X("div", Ao, [X("div", {
				class: "rendered-items",
				style: A(he(t))
			}, [(J(!0), Y(q, null, K(_(t), (r) => (J(), Y("article", {
				key: r.itemKey,
				class: j(["rendered-item", [`rendered-item--${r.fieldKind || "text"}`, {
					"is-editable": e.editable && !r.isLocked,
					"is-selected": e.editable && (e.selectedItemKey === S(t, r) || e.selectedItemKeys.includes(S(t, r))),
					"is-hidden-in-output": e.editable && !u(t, r),
					"is-free-positioned": !0
				}]]),
				"data-item-key": r.itemKey,
				"data-style-key": S(t, r),
				style: A(ge(t, r)),
				onClick: ro((e) => M(t, r, e), ["stop"]),
				onPointerdown: (e) => _e(e, t, r)
			}, [
				e.editable && !u(t, r) ? (J(), Y("span", Mo, "비노출")) : Z("", !0),
				s(r).length > 1 ? (J(), Y("div", No, [(J(!0), Y(q, null, K(f(t, r), (i) => (J(), Y(q, { key: i.fieldKey }, [i.fieldKind === "cta" ? (J(), Y("a", {
					key: 0,
					class: j(["rendered-cta rendered-component-field", { "is-hidden-in-output": e.editable && !d(t, r, i) }]),
					style: A(ae(t, r, i)),
					href: y(p(t, r, i)),
					target: p(t, r, i)?.target || "_self",
					rel: p(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0
				}, N(p(t, r, i)?.label || i.name), 15, Po)) : i.fieldKind === "image" ? (J(), Y("div", {
					key: 1,
					class: j(["rendered-component-field", { "is-hidden-in-output": e.editable && !d(t, r, i) }])
				}, [X("div", {
					class: "rendered-image-frame rendered-component-image-frame",
					style: A(k(t, r, i)),
					role: oe(t, r, i).role,
					"aria-label": oe(t, r, i).label,
					"aria-hidden": oe(t, r, i).ariaHidden,
					"aria-busy": E(t, r, i)?.kind === "processing" ? "true" : void 0
				}, [m(p(t, r, i)) ? Z("", !0) : (J(), Y("div", Io, [X("span", null, N(i.name), 1), n[0] ||= X("small", null, "이미지 준비 중", -1)]))], 12, Fo), e.editable && E(t, r, i) ? (J(), Y("div", {
					key: 0,
					class: j(["item-ai-state", `is-${E(t, r, i).kind}`]),
					role: "status",
					"aria-live": "polite"
				}, [E(t, r, i).kind === "processing" ? (J(), Y("i", Lo)) : Z("", !0), X("span", null, N(E(t, r, i).label), 1)], 2)) : Z("", !0)], 2)) : b(p(t, r, i)) ? (J(), Y("p", {
					key: 2,
					class: j(["rendered-text rendered-component-field", {
						"rendered-text--title": i.textType === "title",
						"is-hidden-in-output": e.editable && !d(t, r, i)
					}]),
					style: A(ae(t, r, i)),
					"data-field-key": i.fieldKey,
					onDblclick: ro((e) => P(e, t, r, i), ["stop"])
				}, N(p(t, r, i)), 47, Ro)) : (J(), Y("p", {
					key: 3,
					class: j(["rendered-empty rendered-component-field", { "is-hidden-in-output": e.editable && !d(t, r, i) }]),
					"data-field-key": i.fieldKey,
					onDblclick: ro((e) => P(e, t, r, i), ["stop"])
				}, N(x(r, i)), 43, zo))], 64))), 128))])) : r.fieldKind === "cta" ? (J(), Y("a", {
					key: 2,
					class: "rendered-cta",
					href: y(p(t, r)),
					target: p(t, r)?.target || "_self",
					rel: p(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0
				}, N(p(t, r)?.label || r.name), 9, Bo)) : r.fieldKind === "image" ? (J(), Y(q, { key: 3 }, [
					X("div", {
						class: j(["rendered-image-frame", `rendered-image-frame--${C(t, r).shape || "square"}`]),
						style: A(O(t, r)),
						role: se(t, r).role,
						"aria-label": se(t, r).label,
						"aria-hidden": se(t, r).ariaHidden,
						"aria-busy": E(t, r)?.kind === "processing" ? "true" : void 0
					}, [m(p(t, r)) ? Z("", !0) : (J(), Y("div", Ho, [X("span", null, N(r.name), 1), X("small", null, N(p(t, r)?.value || "이미지 준비 중"), 1)]))], 14, Vo),
					e.editable && E(t, r) ? (J(), Y("div", {
						key: 0,
						class: j(["item-ai-state", `is-${E(t, r).kind}`]),
						role: "status",
						"aria-live": "polite",
						title: E(t, r).detail || void 0
					}, [E(t, r).kind === "processing" ? (J(), Y("i", Wo)) : Z("", !0), X("span", null, N(E(t, r).label), 1)], 10, Uo)) : Z("", !0),
					e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === S(t, r) ? (J(!0), Y(q, { key: 1 }, K(ne(t, r), (e) => (J(), Y("button", {
						key: e,
						type: "button",
						class: j(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
						"aria-label": `${r.name} 이미지 ${e} 방향 크기 조절`,
						onPointerdown: ro((n) => ve(n, t, r, e), ["stop"]),
						onKeydown: (n) => ye(n, t, r, e)
					}, null, 42, Go))), 128)) : Z("", !0)
				], 64)) : (J(), Y(q, { key: 4 }, [b(p(t, r)) ? (J(), Y("p", {
					key: 0,
					class: j(["rendered-text", { "rendered-text--title": r.textType === "title" }]),
					onDblclick: ro((e) => P(e, t, r), ["stop"])
				}, N(p(t, r)), 43, Ko)) : (J(), Y("p", {
					key: 1,
					class: "rendered-empty",
					onDblclick: ro((e) => P(e, t, r), ["stop"])
				}, N(x(r)), 41, qo))], 64)),
				e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === S(t, r) ? (J(!0), Y(q, { key: 5 }, K(ne(t, r), (e) => (J(), Y("button", {
					key: e,
					type: "button",
					class: j(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
					"aria-label": `${r.name} ${e} 방향 크기 조절`,
					onPointerdown: ro((n) => ve(n, t, r, e), ["stop"]),
					onKeydown: (n) => ye(n, t, r, e)
				}, null, 42, Jo))), 128)) : Z("", !0)
			], 46, jo))), 128))], 4)]),
			e.editable && e.showGuides ? (J(), Y("button", {
				key: 1,
				class: "section-resize-handle",
				type: "button",
				"aria-label": `${t.name} 섹션 높이 조절`,
				title: `${t.name} 섹션 높이 조절`,
				onPointerdown: (e) => be(e, t)
			}, null, 40, Yo)) : Z("", !0)
		], 14, Do))), 128))], 6));
	}
};
//#endregion
//#region visual-editor/src/editor-context.mjs
function Qo(e = "editor", t = "") {
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
var $o = "default-promo-renderer", es = "promoVisualEditor.snapshot.v1", ts = Object.freeze({
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
	sectionStyles: {},
	visibility: {
		items: {},
		fields: {}
	}
});
function ns(e) {
	return JSON.parse(JSON.stringify(e));
}
function rs(e) {
	return e?.isLocked && e.lockedValue !== null && e.lockedValue !== void 0 ? ns(e.lockedValue) : e?.fieldKind === "cta" ? {
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
function is(e, t = {}) {
	return Object.fromEntries((e || []).map((e) => [e.sectionKey, Object.fromEntries((e.items || []).map((n) => [n.itemKey, as(n, t?.[e.sectionKey]?.[n.itemKey])]))]));
}
function as(e, t) {
	let n = Array.isArray(e?.fields) ? e.fields : [];
	if (n.length <= 1) return t ?? rs(n[0] || e);
	let r = t?.fields && typeof t.fields == "object" ? t.fields : {};
	return { fields: Object.fromEntries(n.map((e) => [e.fieldKey, r[e.fieldKey] ?? rs(e)])) };
}
function os({ template: e, configRevision: t, sections: n, sectionInputs: r, designSpec: i = ts }) {
	return {
		snapshotVersion: 1,
		renderer: {
			key: $o,
			version: 1,
			buildId: "visual-editor-p1-v1"
		},
		content: {
			contractVersion: 1,
			formTemplate: {
				...e,
				configRevision: t
			},
			sectionSnapshot: ns(n),
			sectionInputs: ns(r),
			sectionOrder: n.map((e) => e.sectionKey)
		},
		designSpec: ns(i),
		assets: {
			contractVersion: 1,
			items: {}
		},
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region visual-editor/src/layout-utils.mjs
function ss(e) {
	return JSON.parse(JSON.stringify(e));
}
function cs(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = cs(n[e], t) : n[e] = ss(t));
	}), n;
}
function ls(e = {}) {
	return us(ts, e);
}
function us(e = ts, t = {}) {
	let n = cs(ss(e || ts), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, Object.values(n.itemStyles).forEach((e) => {
		e && typeof e == "object" && delete e.textAlign;
	}), n.sectionStyles = n.sectionStyles || {}, n.visibility = {
		items: n.visibility?.items || {},
		fields: n.visibility?.fields || {}
	}, n;
}
function ds(e = {}) {
	let t = ls(e), n = [], r = /* @__PURE__ */ new Set([
		"contain",
		"cover",
		"100% auto"
	]), i = /* @__PURE__ */ new Set([
		"contain",
		"cover",
		"width-fill"
	]), a = /* @__PURE__ */ new Set([
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
	for (let [e, r] of Object.entries(t.visibility || {})) {
		if (!["items", "fields"].includes(e) || !r || typeof r != "object") {
			n.push({
				path: `visibility.${e}`,
				message: "Unsupported visibility target."
			});
			continue;
		}
		Object.entries(r).forEach(([t, r]) => {
			typeof r != "boolean" && n.push({
				path: `visibility.${e}.${t}`,
				message: "Visibility must be boolean."
			});
		});
	}
	return Object.entries(t.sectionStyles).forEach(([e, t]) => {
		let c = Number(t?.minHeight);
		t?.minHeight !== void 0 && (!Number.isFinite(c) || c < 50 || c > 1200) && n.push({
			path: `sectionStyles.${e}.minHeight`,
			message: "Section height must be between 50 and 1200."
		}), t?.backgroundSize !== void 0 && !r.has(t.backgroundSize) && n.push({
			path: `sectionStyles.${e}.backgroundSize`,
			message: "Unsupported section background size."
		}), t?.backgroundFitMode !== void 0 && !i.has(t.backgroundFitMode) && n.push({
			path: `sectionStyles.${e}.backgroundFitMode`,
			message: "Unsupported section background fit mode."
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
		let r = Number(t?.xPct), i = Number(t?.yPx), a = Number(t?.fontSize);
		for (let r of ["colorToken", "fontSizeToken"]) t?.[r] !== void 0 && !/^--(?:promo|app)-[a-z0-9-]+$/.test(String(t[r])) && n.push({
			path: `itemStyles.${e}.${r}`,
			message: "Managed design token key is required."
		});
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
		let o = Number(t?.widthPct), s = Number(t?.heightPx);
		t?.widthPct !== void 0 && (!Number.isFinite(o) || o < .01 || o > 100) && n.push({
			path: `itemStyles.${e}.widthPct`,
			message: "Component width must be between 0.01 and 100 percent."
		}), t?.heightPx !== void 0 && (!Number.isFinite(s) || s < 1 || s > 900) && n.push({
			path: `itemStyles.${e}.heightPx`,
			message: "Component height must be between 1 and 900."
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
//#region visual-editor/src/multi-layout.mjs
var fs = Object.freeze([
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
]), ps = Object.freeze({
	"space-2": 8,
	"space-3": 12,
	"space-4": 16,
	"space-6": 24,
	"space-8": 32
});
function ms(e) {
	return Math.round(Number(e) * 1e3) / 1e3;
}
function hs(e) {
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
function gs(e) {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((n, r) => {
		e.slice(r + 1).forEach((e) => {
			let r = n.xPct < e.xPct + e.widthPct && n.xPct + n.widthPct > e.xPct, i = n.yPx < e.yPx + e.heightPx && n.yPx + n.heightPx > e.yPx;
			r && i && t.add([n.itemKey, e.itemKey].sort().join("|"));
		});
	}), t;
}
function _s(e, t) {
	e.forEach((e) => {
		if (e.xPct < -.001 || e.yPx < -.001 || e.widthPct < .01 || e.widthPct > 100 || e.heightPx < 1 || e.heightPx > 900 || e.xPct + e.widthPct > 100.001 || e.yPx + e.heightPx > t + .001) throw Error(`${e.itemKey} 결과가 섹션 경계를 벗어납니다.`);
	});
}
function vs(e, t) {
	return [...e].sort((e, n) => t === "horizontal" ? e.xPct - n.xPct : e.yPx - n.yPx);
}
function ys(e, t, n = {}) {
	let r = hs(e).map((e) => ({ ...e })), i = String(t?.operation || "");
	if (!fs.includes(i)) throw Error("허용되지 않은 레이아웃 명령입니다.");
	if ([...Array.isArray(t?.targetItemKeys) ? t.targetItemKeys.map(String) : []].sort().join("\n") !== r.map((e) => e.itemKey).sort().join("\n")) throw Error("레이아웃 명령의 대상이 현재 선택과 일치하지 않습니다.");
	let a = Math.max(1, Number(n.canvasWidthPx || 1280)), o = Math.max(80, Number(n.canvasHeightPx || 900)), s = ps[t?.gapToken || "space-4"];
	if (s === void 0) throw Error("허용되지 않은 gap token입니다.");
	let c = gs(r), l = Math.min(...r.map((e) => e.xPct)), u = Math.max(...r.map((e) => e.xPct + e.widthPct)), d = Math.min(...r.map((e) => e.yPx)), f = Math.max(...r.map((e) => e.yPx + e.heightPx));
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
		let e = vs(r, "horizontal"), t = u - l - e.reduce((e, t) => e + t.widthPct, 0);
		if (t < 0) throw Error("가로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = l;
		e.forEach((e) => {
			e.xPct = i, i += e.widthPct + n;
		});
	}
	if (i === "distribute-vertical") {
		let e = vs(r, "vertical"), t = f - d - e.reduce((e, t) => e + t.heightPx, 0);
		if (t < 0) throw Error("세로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = d;
		e.forEach((e) => {
			e.yPx = i, i += e.heightPx + n;
		});
	}
	if (i === "set-gap" || i === "group-stack-horizontal" || i === "group-stack-vertical") {
		let e = i === "group-stack-horizontal" ? "horizontal" : i === "group-stack-vertical" ? "vertical" : t?.axis;
		if (!["horizontal", "vertical"].includes(e)) throw Error("간격 적용 방향이 필요합니다.");
		let n = vs(r, e), o = e === "horizontal" ? l : d;
		n.forEach((t) => {
			e === "horizontal" ? (t.xPct = o, o += t.widthPct + s / a * 100) : (t.yPx = o, o += t.heightPx + s);
		});
	}
	r.forEach((e) => {
		e.xPct = ms(e.xPct), e.yPx = ms(e.yPx), e.widthPct = ms(e.widthPct), e.heightPx = ms(e.heightPx);
	}), _s(r, o);
	let p = [...gs(r)].find((e) => !c.has(e));
	if (p) throw Error(`레이아웃 결과에 새 충돌이 발생했습니다: ${p}`);
	return r;
}
function bs(e) {
	return Object.fromEntries(hs(e).map((e) => [e.itemKey, {
		positionMode: "free",
		xPct: ms(e.xPct),
		yPx: ms(e.yPx),
		widthPct: ms(e.widthPct),
		heightPx: ms(e.heightPx)
	}]));
}
function xs(e, t, n = {}) {
	try {
		return {
			geometry: ys(e, t, n),
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
					geometry: ys(e, o, n),
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
function Ss(e, t, n) {
	return Error(e?.message || e?.error || `${t}${n ? `(${n})` : ""}`);
}
async function Cs(e) {
	return e.json().catch(() => ({}));
}
function ws({ fetchImpl: e = globalThis.fetch } = {}) {
	if (typeof e != "function") throw TypeError("fetchImpl must be a function");
	return Object.freeze({
		async loadLayout(t) {
			if (!t) throw Error("templateId가 필요합니다.");
			let n = await e(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(t)}`), r = await Cs(n);
			if (!n.ok) throw Ss(r, "기본 레이아웃을 불러오지 못했습니다.", n.status);
			return r;
		},
		async loadDesignTokenSets() {
			let t = await e("/api/design-token-sets?scope=public"), n = await Cs(t);
			if (!t.ok) throw Ss(n, "Failed to load design token sets.", t.status);
			return n.tokenSets || [];
		},
		async saveLayout(t) {
			let n = await e("/api/wizard-form-template-layout", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			}), r = await Cs(n);
			if (!n.ok) throw Ss(r, "레이아웃 저장 오류", n.status);
			return r;
		},
		async activateTemplate(t) {
			let n = await e("/api/wizard-form-template-activate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			}), r = await Cs(n);
			if (!n.ok) throw Ss(r, "템플릿 활성화 오류", n.status);
			return r;
		}
	});
}
//#endregion
//#region visual-editor/src/platform/adapters/promo-builder-adapter.mjs
var Ts = Object.freeze({
	READY: "promo-wizard-layout-ready",
	SNAPSHOT: "promo-wizard-layout-snapshot",
	CHANGE: "promo-wizard-layout-change",
	AUTO_REGISTER_REQUEST: "create-promo-auto-register-request",
	AUTO_REGISTER_RESULT: "create-promo-auto-register-result",
	SECTION_AI_ACTION: "create-promo-section-ai-action",
	REMOVE_IMAGE: "create-promo-remove-image"
});
function Es(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Ds({ hostWindow: e = globalThis.window, allowedOrigin: t = e?.location?.origin } = {}) {
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
			e.parent.postMessage({ type: Ts.READY }, t);
		},
		notifyChange({ snapshotRevision: n, designSpec: r, sectionInputs: i }) {
			e.parent.postMessage({
				type: Ts.CHANGE,
				snapshotRevision: n,
				designSpec: Es(r),
				sectionInputs: Es(i)
			}, t);
		},
		requestAutoRegister(n) {
			e.parent.postMessage({
				type: Ts.AUTO_REGISTER_REQUEST,
				sectionInputs: Es(n)
			}, t);
		},
		requestSectionAiAction({ sectionKey: n, action: r, targetType: i, targetItemKey: a, targetFieldKey: o, imageGuidance: s, imageSafeArea: c }) {
			e.parent.postMessage({
				type: Ts.SECTION_AI_ACTION,
				sectionKey: n,
				action: r,
				targetType: i,
				targetItemKey: String(a || "").trim() || null,
				targetFieldKey: String(o || "").trim() || null,
				imageGuidance: String(s || "").trim() || null,
				imageSafeArea: String(c || "").trim() || null
			}, t);
		},
		requestImageRemoval({ sectionKey: n, itemKey: r, fieldKey: i }) {
			e.parent.postMessage({
				type: Ts.REMOVE_IMAGE,
				sectionKey: n,
				itemKey: r,
				fieldKey: i || null
			}, t);
		}
	});
}
//#endregion
//#region visual-editor/src/platform/adapters/output-adapter.mjs
function Os({ storage: e = globalThis.localStorage, openWindow: t = globalThis.window?.open?.bind(globalThis.window), storageKey: n, outputUrl: r = "/prototype/visual-output.html" } = {}) {
	if (!n) throw Error("storageKey is required");
	return Object.freeze({
		save(t) {
			return _o(e, n, t);
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
	VISIBILITY_SET: "VISIBILITY_SET",
	LAYOUT_REPLACE: "LAYOUT_REPLACE",
	DOCUMENT_PATCH: "DOCUMENT_PATCH"
});
function ks(e, t = {}, n = {}) {
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
function As(e) {
	return JSON.parse(JSON.stringify(e ?? null));
}
function js({ layout: e = {}, content: t = {}, metadata: n = {} } = {}) {
	return {
		contractVersion: 1,
		layout: As(e) || {},
		content: As(t) || {},
		metadata: As(n) || {}
	};
}
function Ms(e = js()) {
	return {
		document: js(e),
		revision: 0,
		lastCommand: null,
		dirty: !1
	};
}
function Ns(e) {
	return {
		...e,
		document: js(e.document),
		lastCommand: e.lastCommand ? As(e.lastCommand) : null
	};
}
//#endregion
//#region visual-editor/src/platform/editor-core/command-reducer.mjs
function Ps(e = {}) {
	return Object.fromEntries(Object.entries(e).filter(([, e]) => e !== void 0));
}
function Fs(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t).forEach(([e, t]) => {
		t === void 0 ? delete n[e] : n[e] = t;
	}), n;
}
function Is(e, t, n, r) {
	return {
		...e,
		[t]: {
			...e?.[t] || {},
			[n]: r
		}
	};
}
function Ls(e, t) {
	let n = Ns(e), r = n.document.layout || {}, i = n.document.content || {}, a = t?.payload || {};
	switch (t?.type) {
		case $.CONTENT_VALUE_SET:
			if (!a.sectionKey || !a.itemKey) return {
				ok: !1,
				state: e,
				error: "Content target is required."
			};
			n.document.content = Is(i, a.sectionKey, a.itemKey, a.value);
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
					[a.styleKey]: Fs(t, a.patch)
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
					[a.styleKey]: Ps(a.style || {})
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
					[a.sectionKey]: Fs(t, a.patch)
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
					[a.sectionKey]: Ps(a.style || {})
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
				theme: Ps({
					...r.theme || {},
					...a.patch || {}
				})
			};
			break;
		case $.VISIBILITY_SET: {
			let t = a.targetType === "field" ? "fields" : "items";
			if (!a.targetKey) return {
				ok: !1,
				state: e,
				error: "Visibility target is required."
			};
			n.document.layout = {
				...r,
				visibility: {
					...r.visibility || {},
					[t]: {
						...r.visibility?.[t] || {},
						[a.targetKey]: a.visible !== !1
					}
				}
			};
			break;
		}
		case $.LAYOUT_REPLACE:
			n.document = js({
				...n.document,
				layout: a.layout || {}
			});
			break;
		case $.DOCUMENT_PATCH:
			if (!a.layout || !a.content) return {
				ok: !1,
				state: e,
				error: "Document layout and content are required."
			};
			n.document = js({
				...n.document,
				layout: a.layout,
				content: a.content
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
function Rs(e = js(), { historyLimit: t = 50 } = {}) {
	let n = Ms(e), r = [], i = [];
	function a() {
		return Ns(n);
	}
	function o(e, { resetHistory: t = !0, dirty: a } = {}) {
		let o = t ? 0 : n.revision;
		return n = {
			...Ms(e),
			revision: o,
			dirty: a ?? (!t && n.dirty)
		}, t && (r = [], i = []), d();
	}
	function s(e) {
		let o = a(), s = Ls(n, e);
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
		return e ? (i = [...i.slice(-(t - 1)), a()], r = r.slice(0, -1), n = Ns(e), {
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
		return e ? (r = [...r.slice(-(t - 1)), a()], i = i.slice(0, -1), n = Ns(e), {
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
		return Ns(n);
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
var zs = { class: "preview-controls" }, Bs = {
	class: "editor-history-actions",
	"aria-label": "편집 기록"
}, Vs = ["disabled"], Hs = ["disabled"], Us = { class: "app-switch app-switch--small guide-toggle" }, Ws = ["checked"], Gs = { class: "app-switch__label" }, Ks = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, qs = {
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
		return (t, r) => (J(), Y("div", zs, [
			X("div", Bs, [X("button", {
				type: "button",
				class: "secondary-control",
				disabled: !e.canUndo,
				onClick: r[0] ||= (e) => n("undo")
			}, "실행 취소", 8, Vs), X("button", {
				type: "button",
				class: "secondary-control",
				disabled: !e.canRedo,
				onClick: r[1] ||= (e) => n("redo")
			}, "다시 실행", 8, Hs)]),
			nr(t.$slots, "tokens"),
			nr(t.$slots, "host-actions"),
			X("label", Us, [
				X("input", {
					class: "app-switch__input",
					checked: e.guidesVisible,
					type: "checkbox",
					role: "switch",
					"aria-label": "미리보기 가이드 표시",
					onChange: r[2] ||= (e) => n("update:guidesVisible", e.target.checked)
				}, null, 40, Ws),
				r[5] ||= X("span", {
					class: "app-switch__track",
					"aria-hidden": "true"
				}, null, -1),
				X("span", Gs, "Guides " + N(e.guidesVisible ? "ON" : "OFF"), 1)
			]),
			X("div", Ks, [X("button", {
				type: "button",
				class: j({ active: e.viewport === "desktop" }),
				onClick: r[3] ||= (e) => n("update:viewport", "desktop")
			}, "Desktop", 2), X("button", {
				type: "button",
				class: j({ active: e.viewport === "mobile" }),
				onClick: r[4] ||= (e) => n("update:viewport", "mobile")
			}, "Mobile", 2)])
		]));
	}
}, Js = { class: "preview-panel" }, Ys = { class: "preview-toolbar" }, Xs = { class: "preview-title-group" }, Zs = ["disabled"], Qs = {
	key: 1,
	class: "preview-edit-hint"
}, $s = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, ec = {
	key: 0,
	class: "global-token-menu"
}, tc = ["value", "disabled"], nc = ["value"], rc = {
	key: 0,
	class: "admin-layout-actions"
}, ic = ["value"], ac = ["disabled"], oc = ["disabled"], sc = ["disabled"], cc = {
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
		designTokenSets: {
			type: Array,
			default: () => []
		},
		selectedDesignTokenVersionId: {
			type: String,
			default: ""
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
		"update-design-token",
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
		}), (t, n) => (J(), Y("section", Js, [X("div", Ys, [X("div", Xs, [
			n[15] ||= X("strong", null, "Live Preview", -1),
			X("small", null, N(e.templateIdentityLabel), 1),
			e.capabilities.canEditPromoContent ? (J(), Y("button", {
				key: 0,
				class: "auto-register-action",
				type: "button",
				disabled: e.autoRegisterPending,
				onClick: n[0] ||= (e) => r("request-auto-register")
			}, N(e.autoRegisterPending ? "등록 중" : "자동등록"), 9, Zs)) : Z("", !0),
			e.capabilities.canEditPromoContent ? (J(), Y("small", Qs, "미리보기 요소를 선택해 내용을 입력하세요.")) : Z("", !0),
			e.autoRegisterMessage ? (J(), Y("small", $s, N(e.autoRegisterMessage), 1)) : Z("", !0)
		]), ji(qs, {
			"guides-visible": e.guidesVisible,
			viewport: e.viewport,
			"can-undo": e.editorHistory.canUndo,
			"can-redo": e.editorHistory.canRedo,
			"onUpdate:guidesVisible": n[6] ||= (e) => r("update:guides-visible", e),
			"onUpdate:viewport": n[7] ||= (e) => r("update:viewport", e),
			onUndo: n[8] ||= (e) => r("undo"),
			onRedo: n[9] ||= (e) => r("redo")
		}, {
			tokens: _n(() => [e.capabilities.canEditTemplateDefaults ? (J(), Y("fieldset", ec, [n[17] ||= X("legend", null, "미리보기 디자인 토큰", -1), X("select", {
				class: "global-token-select",
				value: e.selectedDesignTokenVersionId,
				disabled: !e.designTokenSets.length,
				"aria-label": "템플릿 디자인 토큰",
				onChange: n[1] ||= (e) => r("update-design-token", e.target.value)
			}, [n[16] ||= X("option", {
				value: "",
				disabled: ""
			}, "디자인 토큰을 선택하세요", -1), (J(!0), Y(q, null, K(e.designTokenSets, (e) => (J(), Y("option", {
				key: e.versionId,
				value: e.versionId
			}, N(e.name) + " · v" + N(e.version) + N(e.sourceValues?.[0]?.activeTheme ? ` · ${e.sourceValues[0].activeTheme === "dark" ? "Dark" : "Light"}` : "") + N(e.isDefault ? " · 기본" : ""), 9, nc))), 128))], 40, tc)])) : Z("", !0)]),
			"host-actions": _n(() => [e.capabilities.canSaveTemplateLayout ? (J(), Y("div", rc, [
				X("input", {
					value: e.layoutChangeNote,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유",
					onInput: n[2] ||= (e) => r("update:layout-change-note", e.target.value)
				}, null, 40, ic),
				X("button", {
					type: "button",
					disabled: !e.editorSnapshot || e.layoutSaving || e.template?.status !== "draft",
					onClick: n[3] ||= (e) => r("save-admin-layout", !1)
				}, N(e.layoutSaving ? "저장 중" : "초안 저장"), 9, ac),
				X("button", {
					type: "button",
					class: "is-primary",
					disabled: !e.editorSnapshot || e.layoutSaving || e.template?.status !== "draft",
					onClick: n[4] ||= (e) => r("save-admin-layout", !0)
				}, "저장 후 활성화", 8, oc)
			])) : Z("", !0), e.capabilities.canOpenWebOutput ? (J(), Y("button", {
				key: 1,
				type: "button",
				class: "web-output-action",
				disabled: !e.editorSnapshot,
				onClick: n[5] ||= (e) => r("open-output")
			}, "Web Output", 8, sc)) : Z("", !0)]),
			_: 1
		}, 8, [
			"guides-visible",
			"viewport",
			"can-undo",
			"can-redo"
		])]), X("div", {
			ref_key: "previewStageRef",
			ref: i,
			class: j(["preview-stage", `preview-stage--${e.viewport}`])
		}, [e.rendererSnapshot ? (J(), Ei(Zo, {
			key: 0,
			content: e.rendererSnapshot.content,
			"design-spec": e.rendererSnapshot.designSpec,
			assets: e.rendererSnapshot.assets,
			"section-design-runs": e.sectionDesignRuns,
			editable: "",
			"show-guides": e.guidesVisible,
			"selected-item-key": e.selectedStyleKey,
			"selected-item-keys": e.selectedItemKeys.map((t) => `${e.selectedSection?.sectionKey}.${t}`),
			onSelectItem: n[10] ||= (...e) => r("select-item", ...e),
			onUpdateItemStyle: n[11] ||= (...e) => r("update-item-style", ...e),
			onUpdateRendererItemStyle: n[12] ||= (...e) => r("update-renderer-item-style", ...e),
			onUpdateItemContent: n[13] ||= (...e) => r("update-item-content", ...e),
			onUpdateSectionStyle: n[14] ||= (...e) => r("update-section-style", ...e)
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
}, lc = {
	class: "section-properties",
	"aria-label": "섹션 속성"
}, uc = { class: "section-properties__heading" }, dc = {
	key: 0,
	class: "section-ai-actions"
}, fc = ["disabled"], pc = ["disabled", "title"], mc = {
	key: 1,
	class: "section-background-fit"
}, hc = ["value"], gc = ["value"], _c = {
	key: 2,
	class: "section-background-alignment"
}, vc = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, yc = ["onClick"], bc = {
	key: 3,
	class: "section-background-fade"
}, xc = ["value"], Sc = { key: 0 }, Cc = ["value"], wc = { class: "section-size-control" }, Tc = ["disabled"], Ec = {
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
		return (t, n) => (J(), Y("section", lc, [
			X("div", uc, [n[7] ||= X("strong", null, "섹션 속성", -1), X("small", null, N(e.section.name), 1)]),
			e.canRunSectionAi ? (J(), Y("div", dc, [
				e.section.aiDesign?.enabled === !1 ? Z("", !0) : (J(), Y("button", {
					key: 0,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					onClick: n[0] ||= (e) => t.$emit("ai-action", "generate-layout", "", "layout")
				}, "AI 레이아웃 제안", 8, fc)),
				e.section.aiDesign?.enabled !== !1 && e.section.aiDesign?.allowSectionBackground !== !1 ? (J(), Y("button", {
					key: 1,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					title: e.primaryAction.disabled && !e.aiProcessing ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
					onClick: n[1] ||= (n) => t.$emit("ai-action", e.primaryAction.action, "", "section-background")
				}, N(e.primaryAction.label), 9, pc)) : Z("", !0),
				e.hasAiBackground ? (J(), Y("button", {
					key: 2,
					type: "button",
					class: "section-ai-remove",
					onClick: n[2] ||= (e) => t.$emit("ai-action", "remove-background")
				}, "배경 삭제")) : Z("", !0)
			])) : Z("", !0),
			e.hasAiBackground ? (J(), Y("div", mc, [X("label", null, [n[8] ||= X("span", null, "Background fit", -1), X("select", {
				value: e.sectionStyle.backgroundFitMode || (e.sectionStyle.backgroundSize === "100% auto" ? "width-fill" : e.sectionStyle.backgroundSize) || "cover",
				onChange: n[3] ||= (e) => t.$emit("update-style", {
					backgroundFitMode: e.target.value,
					backgroundSize: e.target.value === "width-fill" ? "100% auto" : e.target.value
				})
			}, [(J(!0), Y(q, null, K(e.sectionStyle.backgroundAllowedFitModes || [
				"cover",
				"contain",
				"width-fill"
			], (e) => (J(), Y("option", {
				key: e,
				value: e
			}, N(e), 9, gc))), 128))], 40, hc)])])) : Z("", !0),
			e.hasAiBackground ? (J(), Y("div", _c, [n[9] ||= X("span", null, "배경 이미지 정렬", -1), X("div", vc, [(J(), Y(q, null, K([
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
			], (n) => X("button", {
				key: n.value,
				type: "button",
				class: j({ active: (e.sectionStyle.backgroundPosition || "center center") === `${n.value} center` }),
				onClick: (e) => t.$emit("background-alignment", n.value)
			}, N(n.label), 11, yc)), 64))])])) : Z("", !0),
			e.hasAiBackground || e.section.aiDesign?.enabled !== !1 ? (J(), Y("div", bc, [X("label", null, [n[11] ||= X("span", null, "배경 이미지 페이드", -1), X("select", {
				value: e.sectionStyle.backgroundFadeMode || "none",
				onChange: n[4] ||= (e) => t.$emit("background-fade", e.target.value)
			}, [...n[10] ||= [
				X("option", { value: "none" }, "페이드 없음", -1),
				X("option", { value: "left" }, "왼쪽 페이드", -1),
				X("option", { value: "right" }, "오른쪽 페이드", -1),
				X("option", { value: "both" }, "양끝 페이드", -1)
			]], 40, xc)]), (e.sectionStyle.backgroundFadeMode || "none") === "none" ? Z("", !0) : (J(), Y("label", Sc, [n[13] ||= X("span", null, "페이드 강도", -1), X("select", {
				value: e.sectionStyle.backgroundFadeStrength || "medium",
				onChange: n[5] ||= (e) => t.$emit("update-style", { backgroundFadeStrength: e.target.value })
			}, [...n[12] ||= [
				X("option", { value: "soft" }, "약하게", -1),
				X("option", { value: "medium" }, "보통", -1),
				X("option", { value: "strong" }, "강하게", -1)
			]], 40, Cc)]))])) : Z("", !0),
			X("div", wc, [X("div", null, [n[14] ||= X("span", null, "섹션 높이", -1), X("strong", null, N(e.sectionStyle.minHeight ? `${Math.round(e.sectionStyle.minHeight)}px` : "자동"), 1)]), X("button", {
				type: "button",
				disabled: !e.sectionStyle.minHeight,
				onClick: n[6] ||= (e) => t.$emit("reset-height")
			}, " 높이 초기화 ", 8, Tc)])
		]));
	}
}, Dc = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, Oc = { class: "panel-heading" }, kc = { class: "section-list" }, Ac = [
	"aria-expanded",
	"aria-controls",
	"onClick"
], jc = ["aria-label"], Mc = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, Nc = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, Pc = ["id"], Fc = {
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
		return (t, r) => (J(), Y("aside", Dc, [X("div", Oc, [r[3] ||= X("span", null, "SECTIONS", -1), X("strong", null, N(e.sections.length), 1)]), X("div", kc, [(J(!0), Y(q, null, K(e.sections, (i) => (J(), Y("section", {
			key: i.sectionKey,
			class: j(["section-nav-item", { active: i.sectionKey === e.selectedSection?.sectionKey }])
		}, [X("button", {
			type: "button",
			class: j(["section-trigger", { active: i.sectionKey === e.selectedSection?.sectionKey }]),
			"aria-expanded": i.sectionKey === e.selectedSection?.sectionKey,
			"aria-controls": `section-properties-${i.sectionKey}`,
			onClick: (e) => n("select-section", i)
		}, [X("span", null, N(i.name), 1), (J(), Y("svg", {
			class: j(["section-registration-icon", e.sectionContentRegistered(i) ? "is-complete" : "is-incomplete"]),
			viewBox: "0 0 20 20",
			role: "img",
			"aria-label": e.sectionContentRegistered(i) ? `${i.name} 콘텐츠 등록 완료` : `${i.name} 콘텐츠 등록 필요`
		}, [r[4] ||= X("circle", {
			cx: "10",
			cy: "10",
			r: "9"
		}, null, -1), e.sectionContentRegistered(i) ? (J(), Y("path", Mc)) : (J(), Y("path", Nc))], 10, jc))], 10, Ac), i.sectionKey === e.selectedSection?.sectionKey ? (J(), Y("div", {
			key: 0,
			id: `section-properties-${i.sectionKey}`,
			class: "section-property-accordion"
		}, [nr(t.$slots, "section-composition", { section: i }), ji(Ec, {
			section: i,
			"section-style": e.selectedSectionStyle,
			"can-run-section-ai": e.capabilities.canRunSectionAi,
			"primary-action": e.sectionAiPrimaryAction(i),
			"has-ai-background": e.sectionHasAiBackground(i),
			"ai-processing": e.sectionAiIsProcessing(i),
			onAiAction: (e, t, r) => n("section-ai-action", i, e, t, r),
			onBackgroundAlignment: r[0] ||= (e) => n("background-alignment", e),
			onBackgroundFade: r[1] ||= (e) => n("background-fade", e),
			onUpdateStyle: (e) => n("update-section-style", i.sectionKey, e),
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
		])], 8, Pc)) : Z("", !0)], 2))), 128))])]));
	}
}, Ic = { class: "multi-layout-panel" }, Lc = { class: "multi-layout-panel__heading" }, Rc = ["disabled"], zc = { class: "multi-layout-panel__actions" }, Bc = ["disabled"], Vc = ["disabled"], Hc = {
	key: 0,
	class: "multi-layout-error",
	role: "alert"
}, Uc = {
	key: 1,
	class: "multi-layout-preview"
}, Wc = {
	key: 0,
	class: "multi-layout-adjustment"
}, Gc = { key: 1 }, Kc = { class: "multi-layout-preview__comparison" }, qc = { class: "multi-layout-panel__actions" }, Jc = {
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
		return (t, i) => (J(), Y("section", Ic, [
			X("div", Lc, [X("div", null, [i[5] ||= X("strong", null, "AI 다중 정렬", -1), X("small", null, N(e.selectedCount) + "개 컴포넌트 선택 · revision " + N(e.revision), 1)]), X("button", {
				type: "button",
				disabled: e.selectedCount <= 1,
				onClick: i[0] ||= (e) => n("clear-selection")
			}, "선택 초기화", 8, Rc)]),
			i[6] ||= X("p", null, "아래 체크박스 또는 Ctrl/Cmd+미리보기 클릭으로 같은 섹션의 컴포넌트를 2개 이상 선택하세요.", -1),
			X("div", zc, [X("button", {
				type: "button",
				class: "section-ai-action",
				disabled: e.selectedCount < 2 || e.planning,
				onClick: i[1] ||= (e) => n("request-suggestion")
			}, N(e.planning ? "AI 제안 생성 중" : "AI 정렬 제안"), 9, Bc), X("button", {
				type: "button",
				disabled: !e.undoCount,
				onClick: i[2] ||= (e) => n("undo")
			}, "마지막 적용 취소", 8, Vc)]),
			e.error ? (J(), Y("p", Hc, N(e.error), 1)) : Z("", !0),
			e.suggestion ? (J(), Y("div", Uc, [
				X("strong", null, N(e.operationLabel(e.suggestion.operation)), 1),
				X("span", null, N(e.suggestion.rationale), 1),
				e.suggestion.adjusted ? (J(), Y("span", Wc, N(e.suggestion.adjustmentReason), 1)) : Z("", !0),
				e.suggestion.gapToken ? (J(), Y("small", Gc, "간격: " + N(e.suggestion.gapToken), 1)) : Z("", !0),
				X("div", Kc, [(J(!0), Y(q, null, K(e.suggestion.before, (t) => (J(), Y("div", { key: t.itemKey }, [
					X("b", null, N(t.itemKey), 1),
					X("span", null, "전 X " + N(Math.round(t.xPct)) + "% · Y " + N(Math.round(t.yPx)) + "px", 1),
					X("span", null, "후 X " + N(Math.round(r(e.suggestion, t.itemKey).xPct || 0)) + "% · Y " + N(Math.round(r(e.suggestion, t.itemKey).yPx || 0)) + "px", 1)
				]))), 128))]),
				X("div", qc, [X("button", {
					type: "button",
					class: "section-ai-action",
					onClick: i[3] ||= (e) => n("apply-suggestion")
				}, "제안 적용"), X("button", {
					type: "button",
					onClick: i[4] ||= (e) => n("dismiss-suggestion")
				}, "취소")])
			])) : Z("", !0)
		]));
	}
}, Yc = { class: "section-composition-panel" }, Xc = ["value"], Zc = { class: "app-checkbox toggle-field" }, Qc = ["checked"], $c = ["value"], el = ["value"], tl = {
	key: 1,
	class: "section-composition-error",
	role: "alert"
}, nl = ["disabled"], rl = {
	key: 2,
	class: "section-composition-preview"
}, il = { key: 0 }, al = { class: "section-composition-actions" }, ol = ["disabled"], sl = ["disabled"], cl = {
	__name: "SectionCompositionControls",
	props: {
		instruction: {
			type: String,
			default: ""
		},
		generateBackgroundImage: {
			type: Boolean,
			default: !1
		},
		imageGuidance: {
			type: String,
			default: ""
		},
		fadeMode: {
			type: String,
			default: "none"
		},
		planning: {
			type: Boolean,
			default: !1
		},
		applying: {
			type: Boolean,
			default: !1
		},
		error: {
			type: String,
			default: ""
		},
		proposal: {
			type: Object,
			default: null
		}
	},
	emits: [
		"update:instruction",
		"update:generate-background-image",
		"update:image-guidance",
		"update:fade-mode",
		"request-plan",
		"apply",
		"dismiss"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (J(), Y("section", Yc, [
			r[16] ||= X("header", null, [X("div", null, [X("strong", null, "AI 섹션 구성"), X("small", null, "현재 섹션의 기존 컴포넌트만 사용합니다.")])], -1),
			X("label", null, [r[7] ||= X("span", null, "구성 요청", -1), X("textarea", {
				value: e.instruction,
				rows: "4",
				maxlength: "4000",
				placeholder: "예: 100% 이벤트 타이틀과 안내 문구, 참여 버튼을 강조해서 구성해줘.",
				onInput: r[0] ||= (e) => n("update:instruction", e.target.value)
			}, null, 40, Xc)]),
			X("label", Zc, [X("input", {
				type: "checkbox",
				checked: e.generateBackgroundImage,
				onChange: r[1] ||= (e) => n("update:generate-background-image", e.target.checked)
			}, null, 40, Qc), r[8] ||= X("span", null, "섹션 배경 이미지도 생성", -1)]),
			e.generateBackgroundImage ? (J(), Y(q, { key: 0 }, [X("label", null, [r[9] ||= X("span", null, "배경 이미지 추가 지침", -1), X("textarea", {
				value: e.imageGuidance,
				rows: "2",
				maxlength: "1200",
				onInput: r[2] ||= (e) => n("update:image-guidance", e.target.value)
			}, null, 40, $c)]), X("label", null, [r[11] ||= X("span", null, "페이드", -1), X("select", {
				value: e.fadeMode,
				onChange: r[3] ||= (e) => n("update:fade-mode", e.target.value)
			}, [...r[10] ||= [
				X("option", { value: "none" }, "없음", -1),
				X("option", { value: "left" }, "왼쪽", -1),
				X("option", { value: "right" }, "오른쪽", -1),
				X("option", { value: "both" }, "양끝", -1)
			]], 40, el)])], 64)) : Z("", !0),
			e.error ? (J(), Y("p", tl, N(e.error), 1)) : Z("", !0),
			X("button", {
				type: "button",
				class: "section-composition-request",
				disabled: e.planning || e.applying || e.instruction.trim().length < 3,
				onClick: r[4] ||= (e) => n("request-plan")
			}, N(e.planning ? "구성 제안 생성 중…" : "구성 제안"), 9, nl),
			e.proposal ? (J(), Y("div", rl, [
				r[15] ||= X("strong", null, "적용 전 확인", -1),
				X("p", null, N(e.proposal.rationale), 1),
				X("dl", null, [
					X("div", null, [r[12] ||= X("dt", null, "콘텐츠 변경", -1), X("dd", null, N(e.proposal.contentChanges?.length || 0) + "개", 1)]),
					X("div", null, [r[13] ||= X("dt", null, "토큰 적용", -1), X("dd", null, N(e.proposal.tokenBindings?.length || 0) + "개", 1)]),
					X("div", null, [r[14] ||= X("dt", null, "배경 생성", -1), X("dd", null, N(e.proposal.backgroundImage?.requested ? "포함" : "없음"), 1)])
				]),
				e.proposal.contentChanges?.length ? (J(), Y("ul", il, [(J(!0), Y(q, null, K(e.proposal.contentChanges, (e) => (J(), Y("li", { key: `${e.itemKey}.${e.fieldKey || ""}` }, [X("strong", null, N(e.name), 1), X("span", null, N(typeof e.after == "object" ? e.after?.label : e.after), 1)]))), 128))])) : Z("", !0),
				(J(!0), Y(q, null, K(e.proposal.missingInputs || [], (e) => (J(), Y("p", {
					key: `${e.field}.${e.reason}`,
					class: "section-composition-warning"
				}, N(e.field) + ": " + N(e.reason), 1))), 128)),
				X("div", al, [X("button", {
					type: "button",
					disabled: e.applying,
					onClick: r[5] ||= (e) => n("dismiss")
				}, "취소", 8, ol), X("button", {
					type: "button",
					disabled: e.applying,
					onClick: r[6] ||= (e) => n("apply")
				}, N(e.applying ? "검증 및 적용 중…" : "적용"), 9, sl)])
			])) : Z("", !0)
		]));
	}
}, ll = { class: "property-panel" }, ul = { class: "panel-heading" }, dl = {
	key: 0,
	class: "property-form"
}, fl = {
	__name: "PropertyPanel",
	props: { selectedSection: {
		type: Object,
		default: null
	} },
	setup(e) {
		return (t, n) => (J(), Y("aside", ll, [X("div", ul, [n[0] ||= X("span", null, "COMPONENTS", -1), X("strong", null, N(e.selectedSection?.name || "섹션 선택"), 1)]), e.selectedSection ? (J(), Y("div", dl, [nr(t.$slots, "ai-controls"), nr(t.$slots, "default")])) : Z("", !0)]));
	}
}, pl = {
	key: 0,
	class: "output-shell"
}, ml = { class: "output-toolbar" }, hl = {
	key: 0,
	class: "system-message system-message--error"
}, gl = ["data-shell-frame"], _l = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, vl = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, yl = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], bl = ["data-lucide"], xl = { "data-shell-nav-label": "" }, Sl = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, Cl = { class: "shell-page-identity" }, wl = { class: "shell-page-actions" }, Tl = {
	class: "shell-status",
	role: "status"
}, El = {
	key: 0,
	class: "editor-header editor-toolbar"
}, Dl = {
	key: 0,
	class: "editor-mode-note"
}, Ol = { class: "editor-global-actions" }, kl = {
	key: 0,
	"aria-label": "Visual Editor navigation"
}, Al = ["disabled"], jl = {
	key: 1,
	class: "system-message"
}, Ml = {
	key: 2,
	class: "system-message system-message--error"
}, Nl = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, Pl = {
	key: 4,
	class: "system-message",
	role: "status"
}, Fl = { class: "component-property-list" }, Il = { class: "component-property-header" }, Ll = ["title"], Rl = [
	"checked",
	"disabled",
	"aria-label",
	"onChange"
], zl = ["aria-expanded", "onClick"], Bl = ["title"], Vl = [
	"checked",
	"aria-label",
	"onChange"
], Hl = { class: "component-property-body" }, Ul = {
	key: 0,
	class: "component-property-content"
}, Wl = {
	key: 0,
	class: "component-field-property-list"
}, Gl = ["title"], Kl = [
	"checked",
	"aria-label",
	"onChange"
], ql = [
	"disabled",
	"value",
	"onInput"
], Jl = [
	"disabled",
	"value",
	"onInput"
], Yl = ["disabled", "onClick"], Xl = [
	"disabled",
	"value",
	"onChange"
], Zl = ["value"], Ql = [
	"disabled",
	"value",
	"onInput"
], $l = { key: 1 }, eu = [
	"disabled",
	"value",
	"onInput"
], tu = ["onClick"], nu = { key: 2 }, ru = [
	"disabled",
	"rows",
	"value",
	"onInput"
], iu = { key: 1 }, au = ["disabled", "value"], ou = { key: 2 }, su = ["disabled", "value"], cu = ["disabled", "title"], lu = ["disabled", "value"], uu = ["value"], du = ["disabled", "value"], fu = { key: 1 }, pu = ["disabled", "value"], mu = { key: 2 }, hu = ["disabled", "value"], gu = { key: 4 }, _u = ["disabled", "rows"], vu = { class: "item-meta" }, yu = { class: "design-controls" }, bu = { class: "design-controls__heading" }, xu = ["disabled"], Su = {
	key: 0,
	class: "image-frame-controls"
}, Cu = { class: "image-resize-mode" }, wu = {
	role: "group",
	"aria-label": "이미지 크기 조절 방식"
}, Tu = ["disabled"], Eu = ["disabled"], Du = { key: 0 }, Ou = { class: "range-field" }, ku = [
	"min",
	"disabled",
	"value"
], Au = [
	"min",
	"disabled",
	"value"
], ju = { key: 0 }, Mu = { class: "range-field" }, Nu = [
	"min",
	"disabled",
	"value"
], Pu = [
	"min",
	"disabled",
	"value"
], Fu = ["disabled", "value"], Iu = ["disabled", "value"], Lu = ["disabled", "value"], Ru = { class: "app-checkbox toggle-field" }, zu = ["disabled", "checked"], Bu = { key: 1 }, Vu = ["disabled", "value"], Hu = {
	key: 1,
	class: "component-frame-controls"
}, Uu = { class: "range-field" }, Wu = ["disabled", "value"], Gu = ["disabled", "value"], Ku = { class: "range-field" }, qu = ["disabled", "value"], Ju = ["disabled", "value"], Yu = ["disabled", "value"], Xu = ["value"], Zu = {
	key: 0,
	class: "token-value-preview token-value-preview--color"
}, Qu = {
	key: 1,
	class: "token-option-menu"
}, $u = { class: "token-option-list token-option-list--color" }, ed = ["disabled", "value"], td = ["value"], nd = {
	key: 0,
	class: "token-value-preview token-value-preview--font"
}, rd = {
	key: 1,
	class: "token-option-menu"
}, id = { class: "token-option-list token-option-list--font" }, ad = ["disabled", "value"], od = { class: "position-status" }, sd = { key: 0 }, cd = { key: 1 }, ld = ["disabled"], ud = {
	key: 0,
	class: "component-property-empty"
}, dd = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, fd = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ W(t.mode !== "output"), r = /* @__PURE__ */ W(""), i = /* @__PURE__ */ W([]), a = /* @__PURE__ */ W(null), o = /* @__PURE__ */ W(""), s = /* @__PURE__ */ W([]), c = /* @__PURE__ */ W({}), l = /* @__PURE__ */ W(JSON.parse(JSON.stringify(ts))), u = /* @__PURE__ */ W(""), d = /* @__PURE__ */ W(""), f = /* @__PURE__ */ W([]), p = /* @__PURE__ */ W(""), m = /* @__PURE__ */ W(null), h = /* @__PURE__ */ W("desktop"), g = /* @__PURE__ */ W(!0), _ = /* @__PURE__ */ W(""), v = /* @__PURE__ */ W(null), y = /* @__PURE__ */ W(1), b = /* @__PURE__ */ W(null), x = /* @__PURE__ */ W(null), S = /* @__PURE__ */ W(""), C = /* @__PURE__ */ W(!1), w = /* @__PURE__ */ W(""), T = /* @__PURE__ */ W([]), ee = /* @__PURE__ */ W(""), te = /* @__PURE__ */ W(!1), E = /* @__PURE__ */ W(!1), ne = /* @__PURE__ */ W(""), D = /* @__PURE__ */ W({}), re = /* @__PURE__ */ W(!1), ie = /* @__PURE__ */ W(""), O = /* @__PURE__ */ W(null), ae = /* @__PURE__ */ W([]), k = /* @__PURE__ */ W(0), oe = /* @__PURE__ */ W(""), se = /* @__PURE__ */ W(!1), ce = /* @__PURE__ */ W(""), le = /* @__PURE__ */ W("none"), ue = /* @__PURE__ */ W(!1), de = /* @__PURE__ */ W(!1), fe = /* @__PURE__ */ W(""), pe = /* @__PURE__ */ W(null), me = /* @__PURE__ */ W({
			undoCount: 0,
			redoCount: 0,
			canUndo: !1,
			canRedo: !1
		}), he = Rs({
			layout: JSON.parse(JSON.stringify(ts)),
			content: {}
		}), ge = ws(), M = Ds(), _e = Os({ storageKey: es }), ve = !1, ye = 0, P = null, be = 0, xe = new URLSearchParams(window.location.search).get("source") || "", F = Q(() => Qo(t.mode, xe)), Se = Q(() => F.value.capabilities), Ce = Q(() => F.value.isAdminLayout), we = Q(() => F.value.isWizardLayout), Te = Q(() => F.value.isCreatePromo), Ee = Q(() => F.value.isBuilderWorkspace), De = Q(() => F.value.capabilities.isEmbedded), Oe = window.PromoShell?.navItems || [], I = Q(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), L = Q(() => I.value?.items?.find((e) => e.itemKey === d.value) || null), ke = Q({
			get: () => c.value?.[I.value?.sectionKey]?.[L.value?.itemKey],
			set: (e) => pt(e)
		}), Ae = Q(() => a.value ? os({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), je = Q(() => t.mode === "output" ? v.value : Ae.value), Me = Q(() => {
			if (!a.value) return "템플릿 없음";
			let e = Ce.value ? a.value.status || "draft" : "active", t = String(a.value.id || "").slice(0, 8);
			return `${a.value.templateKey} · v${a.value.version || 1} · ${e} · layout r${y.value}${t ? ` · ${t}` : ""}`;
		}), Ne = Q(() => Array.isArray(a.value?.designTokens?.sourceValues) ? a.value.designTokens.sourceValues : []), Pe = Q(() => Ne.value.filter((e) => e.valueType === "color" || (e.cssProperties || []).some((e) => ["color", "background-color"].includes(e))).map((e) => ({
			key: e.tokenKey,
			label: e.label || e.tokenKey,
			value: e.value
		}))), Fe = Q(() => Ne.value.filter((e) => e.valueType === "length" && (e.cssProperties || []).includes("font-size")).map((e) => ({
			key: e.tokenKey,
			label: e.label || e.tokenKey,
			value: e.value,
			px: Number.parseFloat(e.value)
		})).filter((e) => Number.isFinite(e.px)));
		function Ie() {
			return {
				layout: l.value,
				content: c.value,
				metadata: {
					surface: F.value.surface,
					layoutRevision: y.value
				}
			};
		}
		function Le() {
			me.value = he.getHistoryState();
		}
		function Re({ resetHistory: e = !0 } = {}) {
			he.replaceDocument(Ie(), { resetHistory: e }), Le();
		}
		function ze(e) {
			return e?.ok ? (l.value = e.state.document.layout, c.value = e.state.document.content, me.value = e.history || he.getHistoryState(), !0) : !1;
		}
		function Be(e, t, { source: n = "ui", label: r = e } = {}) {
			return ze(he.execute(ks(e, t, {
				source: n,
				label: r
			})));
		}
		function Ve() {
			ze(he.undo());
		}
		function He() {
			ze(he.redo());
		}
		function Ue(e, t, { preserveMulti: n = !1 } = {}) {
			if (!e) return;
			let r = u.value && u.value !== e.sectionKey;
			u.value = e.sectionKey, d.value = t?.itemKey || "", (!n || r) && (f.value = t?.itemKey ? [t.itemKey] : []);
		}
		function R(e, t) {
			return e && t ? `${e.sectionKey}.${t.itemKey}` : "";
		}
		function We(e, t) {
			return t?.isRequired || t?.isLocked ? !0 : l.value.visibility?.items?.[R(e, t)] !== !1;
		}
		function Ge(e, t, n) {
			return `${R(e, t)}.${n.fieldKey}`;
		}
		function z(e, t, n) {
			return n?.isRequired || n?.isLocked ? !0 : l.value.visibility?.fields?.[Ge(e, t, n)] !== !1;
		}
		function Ke(e, t, n) {
			!e || !t || t.isRequired || t.isLocked || (Be($.VISIBILITY_SET, {
				targetType: "item",
				targetKey: R(e, t),
				visible: n
			}, { label: "컴포넌트 노출 변경" }), n || (f.value = f.value.filter((e) => e !== t.itemKey)));
		}
		function qe(e, t, n, r) {
			!e || !t || !n || n.isRequired || n.isLocked || Be($.VISIBILITY_SET, {
				targetType: "field",
				targetKey: Ge(e, t, n),
				visible: r
			}, { label: "컴포넌트 필드 노출 변경" });
		}
		function Je(e) {
			G({
				colorToken: Pe.value.find((t) => t.key === e)?.key,
				color: void 0
			});
		}
		function Ye(e) {
			let t = Fe.value.find((t) => t.key === e);
			G({
				fontSizeToken: t?.key,
				fontSize: t?.px
			});
		}
		function Xe() {
			be += 1, oe.value = "", se.value = !1, ce.value = "", le.value = "none", ue.value = !1, de.value = !1, fe.value = "", pe.value = null;
		}
		async function Ze(e, t, n = {}) {
			if (u.value && u.value !== e.sectionKey && Xe(), n.additive && !t?.isLocked && u.value === e.sectionKey) {
				let n = new Set(f.value);
				n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], Ue(e, t, { preserveMulti: !0 });
			} else Ue(e, t);
			p.value = R(e, t), await an();
		}
		function Qe(e) {
			e && m.value?.scrollToSection(e.sectionKey);
		}
		async function $e(e) {
			e && (u.value && u.value !== e.sectionKey && Xe(), u.value = e.sectionKey, d.value = "", f.value = [], p.value = "", O.value = null, ie.value = "", await an(), Qe(e));
		}
		function et(e) {
			return !!(e?.itemKey && f.value.includes(e.itemKey));
		}
		function tt(e, t) {
			if (!e || !t || t.isLocked) return;
			u.value !== e.sectionKey && (f.value = []);
			let n = new Set(f.value);
			n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], Ue(e, t, { preserveMulti: !0 }), p.value = R(e, t), O.value = null, ie.value = "";
		}
		function nt() {
			f.value = L.value?.itemKey ? [L.value.itemKey] : [], O.value = null, ie.value = "";
		}
		function rt(e) {
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
		function it(e) {
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
		async function at() {
			if (!(!I.value || f.value.length < 2 || re.value)) {
				re.value = !0, ie.value = "", O.value = null;
				try {
					let e = it(I.value), t = await fetch("/api/promo-multi-component-layout-plan", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							formTemplateId: a.value?.id,
							sectionKey: I.value.sectionKey,
							selectedItemKeys: f.value,
							geometry: e.geometry,
							sectionInputs: c.value?.[I.value.sectionKey] || {}
						})
					}), n = await t.json().catch(() => ({}));
					if (!t.ok) throw Error(n.message || n.error || `AI 정렬 요청 오류(${t.status})`);
					let r = xs(e.geometry, n.suggestion, e);
					O.value = {
						...r.plan,
						requestedOperation: n.suggestion.operation,
						adjusted: r.adjusted,
						adjustmentReason: r.adjustmentReason,
						sectionKey: I.value.sectionKey,
						before: e.geometry,
						after: r.geometry
					};
				} catch (e) {
					ie.value = e.message;
				} finally {
					re.value = !1;
				}
			}
		}
		function ot() {
			let e = O.value;
			if (!e || e.sectionKey !== I.value?.sectionKey) return;
			let t = bs(e.after), n = { ...l.value.itemStyles || {} };
			Object.entries(t).forEach(([t, r]) => {
				let i = `${e.sectionKey}.${t}`;
				n[i] = {
					...n[i] || {},
					...r
				};
			}), ae.value = [...ae.value.slice(-19), {
				revision: k.value,
				label: rt(e.operation)
			}], Be($.LAYOUT_REPLACE, { layout: {
				...l.value,
				itemStyles: n
			} }, {
				source: "ai",
				label: rt(e.operation)
			}), k.value += 1, O.value = null, ie.value = "";
		}
		function st() {
			let e = ae.value.at(-1);
			e && (Ve(), k.value = e.revision, ae.value = ae.value.slice(0, -1), O.value = null, ie.value = "");
		}
		function ct(e) {
			return {
				sectionStyle: l.value.sectionStyles?.[e] || {},
				itemStyles: Object.fromEntries(Object.entries(l.value.itemStyles || {}).filter(([t]) => t === e || t.startsWith(`${e}.`)))
			};
		}
		function lt() {
			let e = I.value?.sectionKey;
			return {
				formTemplateId: a.value?.id,
				designTokenSetVersionId: a.value?.designTokens?.versionId || "",
				sectionKey: e,
				instruction: oe.value,
				sectionInputs: c.value?.[e] || {},
				currentLayout: ct(e),
				generateBackgroundImage: se.value,
				imageGuidance: ce.value,
				fadeMode: le.value
			};
		}
		async function ut() {
			if (!I.value || oe.value.trim().length < 3 || ue.value) return;
			ue.value = !0, fe.value = "", pe.value = null;
			let e = ++be;
			try {
				let t = lt(), n = await fetch("/api/promo-section-composition-plan", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(t)
				}), r = await n.json().catch(() => ({}));
				if (!n.ok) throw Error(r.message || r.error || `AI 섹션 구성 요청 오류(${n.status})`);
				e === be && u.value === t.sectionKey && (pe.value = {
					...r,
					requestPayload: t
				});
			} catch (t) {
				e === be && (fe.value = t.message);
			} finally {
				e === be && (ue.value = !1);
			}
		}
		async function dt() {
			let e = pe.value;
			if (!e?.rawPlan || !I.value || de.value) return;
			de.value = !0, fe.value = "";
			let t = be, n = e.requestPayload?.sectionKey;
			try {
				let r = await fetch("/api/promo-section-composition-validate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...e.requestPayload,
						sectionInputs: c.value?.[e.requestPayload.sectionKey] || {},
						currentLayout: ct(e.requestPayload.sectionKey),
						fingerprint: e.fingerprint,
						inputFingerprint: e.inputFingerprint,
						layoutFingerprint: e.layoutFingerprint,
						rawPlan: e.rawPlan
					})
				}), i = await r.json().catch(() => ({}));
				if (!r.ok) throw Error(i.message || i.error || `AI 섹션 구성 검증 오류(${r.status})`);
				if (t !== be || u.value !== n) return;
				let a = i.proposal, o = I.value.sectionKey, s = { ...l.value.itemStyles || {} };
				Object.entries(a.layoutPatch?.itemStyles || {}).forEach(([e, t]) => {
					s[e] = {
						...s[e] || {},
						...t
					};
				});
				let d = { ...l.value.sectionStyles || {} };
				Object.entries(a.layoutPatch?.sectionStyles || {}).forEach(([e, t]) => {
					d[e] = {
						...d[e] || {},
						...t
					};
				}), a.backgroundImage?.requested && (d[o] = {
					...d[o] || {},
					backgroundFadeMode: a.backgroundImage.fadeMode,
					backgroundFadeSafeArea: a.backgroundImage.safeArea
				}), Be($.DOCUMENT_PATCH, {
					content: {
						...c.value,
						[o]: a.content
					},
					layout: {
						...l.value,
						itemStyles: s,
						sectionStyles: d
					}
				}, {
					source: "ai",
					label: "AI 섹션 구성 적용"
				}), pe.value = null, await an(), a.backgroundImage?.requested && Mt(I.value, "generate", "", "section-background", "", a.backgroundImage.guidance, a.backgroundImage.safeArea);
			} catch (e) {
				t === be && (fe.value = e.message);
			} finally {
				t === be && (de.value = !1);
			}
		}
		function ft(e, t) {
			let n = R(e, t);
			Ue(e, t, { preserveMulti: f.value.includes(t.itemKey) }), p.value = p.value === n ? "" : n;
		}
		function pt(e) {
			!I.value || !L.value || Be($.CONTENT_VALUE_SET, {
				sectionKey: I.value.sectionKey,
				itemKey: L.value.itemKey,
				value: e
			}, { label: "콘텐츠 변경" });
		}
		function mt(e, t) {
			pt({
				...ke.value || {},
				[e]: t
			});
		}
		function ht(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function gt(e, t) {
			let n = c.value?.[I.value?.sectionKey]?.[e?.itemKey];
			return ht(e).length <= 1 ? n : n?.fields?.[t.fieldKey];
		}
		function _t(e, t, n) {
			if (!I.value || !e || !t || e.isLocked || t.isLocked) return;
			if (ht(e).length <= 1) {
				pt(n);
				return;
			}
			let r = I.value.sectionKey, i = c.value?.[r]?.[e.itemKey] || {};
			Be($.CONTENT_VALUE_SET, {
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
		function vt(e, t, n, r) {
			_t(e, t, {
				...gt(e, t) || {},
				[n]: r
			});
		}
		function yt(e, t, n, r = null) {
			if (Ue(e, t), r) {
				if (r.fieldKind !== "text" || r.isLocked) return;
				_t(t, r, n);
				return;
			}
			t.fieldKind !== "text" || t.isLocked || pt(n);
		}
		function bt(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			if (ht(t).length > 1) {
				let e = ht(t), r = e.filter((e) => e.isRequired || e.isLocked), i = (r.length ? r : e).map((e) => {
					let t = n?.fields?.[e.fieldKey];
					return e.fieldKind === "cta" ? !!(String(t?.label || "").trim() && String(t?.link || "").trim()) : e.fieldKind === "image" ? !!String(t?.value || "").trim() : !!String(t || "").trim();
				});
				return r.length ? i.every(Boolean) : i.some(Boolean);
			}
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function xt(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => bt(e, t)) : t.some((t) => bt(e, t));
		}
		function St() {
			!Te.value || E.value || (E.value = !0, ne.value = "", M.requestAutoRegister(c.value));
		}
		function Ct(e) {
			return D.value?.[e.sectionKey] || null;
		}
		function wt(e) {
			let t = Ct(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function Tt(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets",
				"applying"
			].includes(Ct(e)?.status);
		}
		function Et(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1) return !1;
				let n = t[e.itemKey];
				if (ht(e).length > 1) return ht(e).some((e) => {
					if (e.fieldKind === "image") return !1;
					let t = n?.fields?.[e.fieldKey], r = e.fieldKind === "cta" ? t?.label : t;
					return String(r || "").trim().length >= 2;
				});
				if (e.fieldKind === "image") return !1;
				let r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function Dt(e) {
			let t = Ct(e), n = t?.constraintsSnapshot?.imageTarget?.type === "section-background";
			return Tt(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : n && t?.status === "ready" && !wt(e) ? {
				action: "generate",
				label: "AI 적용 중",
				disabled: !0
			} : n && t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !Et(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !Et(e)
			};
		}
		function Ot(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function kt(e, t, n = null) {
			let r = n || t;
			return !!(e?.aiDesign?.enabled !== !1 && r?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && !r?.isLocked && r?.image?.allowedSources?.includes("ai") && Ot(e).includes(t.itemKey));
		}
		function At(e) {
			let t = Ct(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function jt(e, t, n = null) {
			let r = Ct(e), i = r?.constraintsSnapshot?.imageTarget, a = At(e) === t?.itemKey && (!n || i?.fieldKey === n.fieldKey);
			return Tt(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : a && r?.status === "ready" && !wt(e) ? {
				action: "generate",
				label: "AI 이미지 적용 중",
				disabled: !0
			} : a && r?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !Et(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !Et(e)
			};
		}
		function Mt(e, t, n = "", r = "", i = "", a = "", o = "") {
			let s = r || (n ? "item" : "section-background");
			M.requestSectionAiAction({
				sectionKey: e.sectionKey,
				action: t,
				targetType: s,
				targetItemKey: n,
				targetFieldKey: i,
				imageGuidance: a,
				imageSafeArea: o
			});
		}
		function Nt(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function B(e = null) {
			!I.value || !L.value || L.value.isLocked || e?.isLocked || window.confirm(`${e?.name || L.value.name} 이미지를 삭제할까요?`) && M.requestImageRemoval({
				sectionKey: I.value.sectionKey,
				itemKey: L.value.itemKey,
				fieldKey: e?.fieldKey || null
			});
		}
		function Pt(e) {
			if (!Ce.value || !a.value?.id) return;
			let t = T.value.find((t) => t.versionId === e);
			t && (ee.value = t.versionId, a.value = {
				...a.value,
				designTokens: {
					setKey: t.setKey,
					version: t.version,
					versionId: t.versionId,
					values: t.values || {},
					sourceValues: t.sourceValues || []
				}
			}, w.value = `${t.name} v${t.version} 토큰으로 미리보는 중입니다. 템플릿에는 저장되지 않습니다.`);
		}
		let V = Q(() => I.value && L.value ? `${I.value.sectionKey}.${L.value.itemKey}` : ""), H = Q(() => l.value.itemStyles?.[V.value] || {}), U = Q(() => Pe.value.find((e) => e.key === H.value.colorToken) || null), Ft = Q(() => Fe.value.find((e) => e.key === H.value.fontSizeToken) || null), It = Q(() => I.value && l.value.sectionStyles?.[I.value.sectionKey] || {});
		function G(e) {
			!V.value || L.value?.isLocked || Be($.ITEM_STYLE_PATCH, {
				styleKey: V.value,
				patch: e
			}, { label: "컴포넌트 스타일 변경" });
		}
		function Rt(e, t, n) {
			if (!e || !t || t.isLocked) return;
			let r = `${e.sectionKey}.${t.itemKey}`, i = { ...n };
			if (i.fontSize !== void 0) {
				let e = Number(i.fontSize), t = Fe.value.reduce((t, n) => !t || Math.abs(n.px - e) < Math.abs(t.px - e) ? n : t, null);
				t ? (i.fontSize = t.px, i.fontSizeToken = t.key) : delete i.fontSize;
			}
			Be($.ITEM_STYLE_PATCH, {
				styleKey: r,
				patch: i
			}, {
				source: "pointer",
				label: "컴포넌트 위치·크기 변경"
			});
		}
		function zt() {
			!V.value || L.value?.isLocked || Be($.ITEM_STYLE_REMOVE, { styleKey: V.value }, { label: "컴포넌트 스타일 초기화" });
		}
		function Bt() {
			if (!V.value || L.value?.isLocked) return;
			let e = go(l.value.itemStyles?.[V.value]);
			Object.keys(e).length ? Be($.ITEM_STYLE_REPLACE, {
				styleKey: V.value,
				style: e
			}, { label: "자동 위치 복원" }) : Be($.ITEM_STYLE_REMOVE, { styleKey: V.value }, { label: "자동 위치 복원" });
		}
		function Vt(e, t) {
			e && Be($.SECTION_STYLE_PATCH, {
				sectionKey: e,
				patch: t
			}, { label: "섹션 스타일 변경" });
		}
		function Ht(e) {
			!I.value || ![
				"left",
				"center",
				"right"
			].includes(e) || Vt(I.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function Ut(e) {
			!I.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || Vt(I.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: It.value.backgroundFadeStrength || "medium"
			});
		}
		function Wt(e) {
			[
				"square",
				"rounded",
				"circle"
			].includes(e) && G(e === "circle" ? {
				shape: e,
				aspectRatio: "1/1",
				aspectRatioLocked: !0,
				heightPx: void 0
			} : { shape: e });
		}
		function Gt(e) {
			if (!V.value || L.value?.isLocked || !["locked", "free"].includes(e)) return;
			let t = { ...H.value };
			e === "locked" || t.shape === "circle" ? (t.aspectRatioLocked = !0, t.aspectRatio = t.shape === "circle" ? "1/1" : t.aspectRatio || L.value?.image?.aspectRatio || "1/1", delete t.heightPx) : (t.aspectRatioLocked = !1, t.heightPx = Number(t.heightPx || 240)), Be($.ITEM_STYLE_REPLACE, {
				styleKey: V.value,
				style: t
			}, { label: "이미지 크기 조절 방식 변경" });
		}
		function Kt() {
			if (!I.value) return;
			let e = I.value.sectionKey, t = { ...l.value.sectionStyles?.[e] || {} };
			delete t.minHeight, Object.keys(t).length ? Be($.SECTION_STYLE_REPLACE, {
				sectionKey: e,
				style: t
			}, { label: "섹션 높이 초기화" }) : Be($.SECTION_STYLE_REMOVE, { sectionKey: e }, { label: "섹션 높이 초기화" });
		}
		async function qt() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = {
					...l.template,
					designTokens: l.designTokens || null
				}, o.value = l.configRevision || "", s.value = l.sections || [], c.value = is(s.value, l.defaultContent || {}), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = R(s.value[0], s.value[0]?.items?.[0]), Re();
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function Jt() {
			if (!Ae.value) return;
			_.value = "";
			let e = _e.save(Ae.value);
			if (!e.ok) {
				_.value = e.message;
				return;
			}
			_e.open();
		}
		async function Yt() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let [t, n] = await Promise.all([ge.loadLayout(e), ge.loadDesignTokenSets()]);
				T.value = n, a.value = t.template;
				let r = n.find((e) => e.isDefault) || n[0] || null;
				r && (ee.value = r.versionId, a.value = {
					...a.value,
					designTokens: {
						setKey: r.setKey,
						version: r.version,
						versionId: r.versionId,
						values: r.values || {},
						sourceValues: r.sourceValues || []
					}
				}), s.value = t.sections || [], c.value = is(s.value, t.layout?.defaultContent || {}), l.value = ls(t.layout?.layoutSpec), y.value = Number(t.layout?.layoutRevision || 1), b.value = t.layout?.id || null, x.value = t.layoutIdentity || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = R(s.value[0], s.value[0]?.items?.[0]), Re();
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function Xt({ activate: e = !1 } = {}) {
			if (!a.value?.id || C.value) return;
			w.value = "";
			let t = ds(l.value);
			if (!t.ok) {
				w.value = `레이아웃 검증 실패: ${t.errors[0]?.path || "unknown"}`;
				return;
			}
			C.value = !0;
			try {
				let n = await ge.saveLayout({
					templateId: a.value.id,
					expectedRevision: y.value,
					rendererKey: "default-promo-renderer",
					rendererVersion: 1,
					layoutSpec: t.spec,
					defaultContent: c.value,
					changeNote: S.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
				});
				if (l.value = ls(n.layout.layoutSpec), y.value = Number(n.layout.layoutRevision || y.value + 1), b.value = n.layout.id || b.value, x.value = n.layoutIdentity || x.value, he.replaceDocument(Ie(), {
					resetHistory: !1,
					dirty: !1
				}), Le(), S.value = "", !e) {
					w.value = `초안 v${a.value.version || 1} · layout r${y.value} 저장 완료 · 프로모션 빌더 반영을 위해 템플릿을 활성화하세요.`;
					return;
				}
				let r = await ge.activateTemplate({
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
		async function Zt(e) {
			if (!e?.content) return;
			let t = Number(e.snapshotRevision || 0);
			if (t && t < ye) return;
			t && (ye = t);
			let i = I.value?.sectionKey || u.value, m = L.value?.itemKey || d.value, h = p.value;
			ve = !0;
			let g = !te.value;
			a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, D.value = e.content.sectionDesignRuns || {}, l.value = ls(e.designSpec), y.value = Number(e.layoutRevision || 1), x.value = e.layoutIdentity || null;
			let _ = s.value.find((e) => e.sectionKey === i) || s.value[0];
			u.value = _?.sectionKey || "", d.value = _?.items?.some((e) => e.itemKey === m) ? m : _?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], O.value = null;
			let v = R(_, _?.items?.find((e) => e.itemKey === d.value));
			p.value = s.value.some((e) => (e.items || []).some((t) => R(e, t) === h)) ? h : v, te.value = !0, Re({ resetHistory: g }), n.value = !1, r.value = "", await an(), ve = !1;
		}
		function Qt(e) {
			if (we.value) {
				if (e?.type === Ts.AUTO_REGISTER_RESULT) {
					E.value = !1;
					let t = Number(e.registeredCount || 0);
					ne.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e?.type === Ts.SNAPSHOT && Zt(e.snapshot);
			}
		}
		wn([l, c], () => {
			!we.value || !te.value || ve || M.notifyChange({
				snapshotRevision: ye,
				designSpec: l.value,
				sectionInputs: c.value
			});
		}, { deep: !0 });
		function $t() {
			try {
				v.value = _e.load();
			} catch (e) {
				r.value = e.message;
			}
		}
		return Kn(() => {
			De.value && (document.documentElement.classList.add("layout-editor-document"), document.body.classList.add("layout-editor-document")), Te.value && (document.documentElement.classList.add("create-promo-editor-document"), document.body.classList.add("create-promo-editor-document")), window.PromoShell?.init(document), t.mode === "output" ? $t() : Ce.value ? Yt() : we.value ? (n.value = !0, P = M.connect(Qt), M.notifyReady()) : qt();
		}), Yn(() => {
			P?.(), P = null, document.documentElement.classList.remove("layout-editor-document"), document.body.classList.remove("layout-editor-document"), document.documentElement.classList.remove("create-promo-editor-document"), document.body.classList.remove("create-promo-editor-document");
		}), (t, i) => e.mode === "output" ? (J(), Y("div", pl, [X("header", ml, [X("div", null, [i[39] ||= X("span", null, "WEB OUTPUT", -1), X("strong", null, N(je.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[40] ||= X("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (J(), Y("div", hl, N(r.value), 1)) : je.value ? (J(), Ei(Zo, {
			key: 1,
			content: je.value.content,
			"design-spec": je.value.designSpec,
			assets: je.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Z("", !0)])) : (J(), Y("main", {
			key: 1,
			class: j(["editor-shell", {
				"shell-frame": !De.value,
				"editor-shell--embedded": De.value
			}]),
			"data-shell-frame": De.value ? null : ""
		}, [
			De.value ? Z("", !0) : (J(), Y("aside", _l, [
				i[41] ||= Ii("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[42] ||= X("div", {
					class: "shell-sidebar__mode",
					role: "group",
					"aria-label": "사이드바 표시 방식"
				}, [X("button", {
					type: "button",
					"data-shell-sidebar-mode": "min",
					"aria-label": "사이드바 최소화",
					title: "최소"
				}, [X("i", {
					"data-lucide": "panel-left-close",
					"aria-hidden": "true"
				}), X("span", null, "최소")]), X("button", {
					type: "button",
					"data-shell-sidebar-mode": "max",
					"aria-label": "사이드바 최대화",
					title: "최대"
				}, [X("i", {
					"data-lucide": "panel-left-open",
					"aria-hidden": "true"
				}), X("span", null, "최대")])], -1),
				X("nav", vl, [(J(!0), Y(q, null, K(Lt(Oe), (e) => (J(), Y("a", {
					key: e.key,
					href: e.href,
					class: j({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [X("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, bl), X("span", xl, N(e.label), 1)], 10, yl))), 128))]),
				i[43] ||= X("div", { class: "shell-sidebar__footer" }, [X("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [X("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), X("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			X("div", { class: j(De.value ? "editor-embedded-main" : "shell-main") }, [De.value ? Z("", !0) : (J(), Y("header", Sl, [X("div", Cl, [i[44] ||= X("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), X("strong", null, N(Ce.value ? "Admin Template Layout" : "Visual Editor"), 1)]), X("div", wl, [X("div", Tl, N(Ce.value ? `Layout revision ${y.value}` : "편집 준비"), 1)])])), X("div", { class: j(["editor-content", {
				"shell-content": !De.value,
				"editor-content--embedded": De.value
			}]) }, [
				Ee.value ? Z("", !0) : (J(), Y("header", El, [X("div", null, [
					X("span", null, N(Ce.value ? "ADMIN TEMPLATE LAYOUT" : we.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					X("h2", null, N(a.value?.name || "Default Renderer"), 1),
					Ce.value ? (J(), Y("small", Dl, " v" + N(a.value?.version || 1) + " · " + N(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : Z("", !0)
				]), X("div", Ol, [Ce.value ? (J(), Y("nav", kl, [vn(X("input", {
					"onUpdate:modelValue": i[0] ||= (e) => S.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[eo, S.value]]), X("button", {
					type: "button",
					disabled: !Ae.value || C.value,
					onClick: Xt
				}, N(C.value ? "저장 중" : "기본 레이아웃 저장"), 9, Al)])) : Z("", !0)])])),
				n.value ? (J(), Y("div", jl, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (J(), Y("div", Ml, N(r.value), 1)) : Z("", !0),
				_.value ? (J(), Y("div", Nl, N(_.value), 1)) : Z("", !0),
				w.value ? (J(), Y("div", Pl, N(w.value), 1)) : Z("", !0),
				!n.value && !r.value ? (J(), Y("section", {
					key: 5,
					class: j(["editor-workspace", {
						"is-builder-workspace": Ee.value,
						"is-create-promo-wizard": Te.value,
						"is-admin-layout-workspace": Ce.value
					}])
				}, [
					ji(Fc, {
						sections: s.value,
						"selected-section": I.value,
						"selected-section-style": It.value,
						capabilities: Se.value,
						"section-content-registered": xt,
						"section-ai-primary-action": Dt,
						"section-has-ai-background": Nt,
						"section-ai-is-processing": Tt,
						onSelectSection: $e,
						onSectionAiAction: i[6] ||= (e, t, n, r) => Mt(e, t, n, r),
						onBackgroundAlignment: Ht,
						onBackgroundFade: Ut,
						onUpdateSectionStyle: Vt,
						onResetSectionHeight: Kt
					}, {
						"section-composition": _n(() => [Se.value.canRunSectionAi ? (J(), Ei(cl, {
							key: 0,
							instruction: oe.value,
							"generate-background-image": se.value,
							"image-guidance": ce.value,
							"fade-mode": le.value,
							planning: ue.value,
							applying: de.value,
							error: fe.value,
							proposal: pe.value?.proposal || null,
							"onUpdate:instruction": i[1] ||= (e) => oe.value = e,
							"onUpdate:generateBackgroundImage": i[2] ||= (e) => se.value = e,
							"onUpdate:imageGuidance": i[3] ||= (e) => ce.value = e,
							"onUpdate:fadeMode": i[4] ||= (e) => le.value = e,
							onRequestPlan: ut,
							onApply: dt,
							onDismiss: i[5] ||= (e) => pe.value = null
						}, null, 8, [
							"instruction",
							"generate-background-image",
							"image-guidance",
							"fade-mode",
							"planning",
							"applying",
							"error",
							"proposal"
						])) : Z("", !0)]),
						_: 1
					}, 8, [
						"sections",
						"selected-section",
						"selected-section-style",
						"capabilities"
					]),
					ji(cc, {
						ref_key: "previewPanelRef",
						ref: m,
						"renderer-snapshot": je.value,
						"section-design-runs": D.value,
						"guides-visible": g.value,
						viewport: h.value,
						"template-identity-label": Me.value,
						capabilities: Se.value,
						"auto-register-pending": E.value,
						"auto-register-message": ne.value,
						"editor-history": me.value,
						"design-spec": l.value,
						"design-token-sets": T.value,
						"selected-design-token-version-id": ee.value,
						"layout-change-note": S.value,
						"layout-saving": C.value,
						"editor-snapshot": Ae.value,
						template: a.value,
						"selected-style-key": V.value,
						"selected-item-keys": f.value,
						"selected-section": I.value,
						"onUpdate:guidesVisible": i[7] ||= (e) => g.value = e,
						"onUpdate:viewport": i[8] ||= (e) => h.value = e,
						"onUpdate:layoutChangeNote": i[9] ||= (e) => S.value = e,
						onRequestAutoRegister: St,
						onUndo: Ve,
						onRedo: He,
						onUpdateDesignToken: Pt,
						onSaveAdminLayout: i[10] ||= (e) => Xt({ activate: e }),
						onOpenOutput: Jt,
						onSelectItem: Ze,
						onUpdateItemStyle: G,
						onUpdateRendererItemStyle: Rt,
						onUpdateItemContent: yt,
						onUpdateSectionStyle: Vt
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
						"design-token-sets",
						"selected-design-token-version-id",
						"layout-change-note",
						"layout-saving",
						"editor-snapshot",
						"template",
						"selected-style-key",
						"selected-item-keys",
						"selected-section"
					]),
					ji(fl, { "selected-section": I.value }, {
						"ai-controls": _n(() => [Se.value.canRunMultiLayoutAi ? (J(), Ei(Jc, {
							key: 0,
							"selected-count": f.value.length,
							revision: k.value,
							planning: re.value,
							error: ie.value,
							suggestion: O.value,
							"undo-count": ae.value.length,
							"operation-label": rt,
							onClearSelection: nt,
							onRequestSuggestion: at,
							onUndo: st,
							onApplySuggestion: ot,
							onDismissSuggestion: i[11] ||= (e) => O.value = null
						}, null, 8, [
							"selected-count",
							"revision",
							"planning",
							"error",
							"suggestion",
							"undo-count"
						])) : Z("", !0)]),
						default: _n(() => [X("div", Fl, [(J(!0), Y(q, null, K(I.value.items || [], (e) => (J(), Y("section", {
							key: e.itemKey,
							class: j(["component-property-accordion", { open: p.value === R(I.value, e) }])
						}, [X("div", Il, [
							Se.value.canRunMultiLayoutAi ? (J(), Y("label", {
								key: 0,
								class: "component-multi-select",
								title: e.isLocked ? "잠긴 컴포넌트는 다중 정렬할 수 없습니다." : "다중 정렬 대상 선택"
							}, [X("input", {
								type: "checkbox",
								checked: et(e),
								disabled: e.isLocked,
								"aria-label": `${e.name} 다중 정렬 대상 선택`,
								onChange: (t) => tt(I.value, e)
							}, null, 40, Rl)], 8, Ll)) : Z("", !0),
							X("button", {
								type: "button",
								class: "component-property-trigger",
								"aria-expanded": p.value === R(I.value, e),
								onClick: (t) => ft(I.value, e)
							}, [
								X("span", null, N(e.name), 1),
								X("small", null, N(e.fieldKind), 1),
								i[45] ||= X("i", { "aria-hidden": "true" }, null, -1)
							], 8, zl),
							!e.isRequired && !e.isLocked ? (J(), Y("label", {
								key: 1,
								class: "app-switch app-switch--small component-visibility-toggle",
								title: We(I.value, e) ? "웹 출력에 노출 중" : "웹 출력에서 숨김",
								onClick: i[12] ||= ro(() => {}, ["stop"])
							}, [
								X("input", {
									class: "app-switch__input",
									type: "checkbox",
									role: "switch",
									checked: We(I.value, e),
									"aria-label": `${e.name} 노출`,
									onChange: (t) => Ke(I.value, e, t.target.checked)
								}, null, 40, Vl),
								i[46] ||= X("span", {
									class: "app-switch__track",
									"aria-hidden": "true"
								}, null, -1),
								i[47] ||= X("span", { class: "app-switch__label" }, "노출", -1)
							], 8, Bl)) : Z("", !0)
						]), X("div", Hl, [X("div", null, [L.value && L.value.itemKey === e.itemKey ? (J(), Y("div", Ul, [
							ht(L.value).length > 1 ? (J(), Y("div", Wl, [(J(!0), Y(q, null, K(ht(L.value), (e) => (J(), Y("section", {
								key: e.fieldKey,
								class: "component-field-property"
							}, [X("header", null, [
								X("strong", null, N(e.name), 1),
								X("small", null, N(e.fieldKind) + " · " + N(e.fieldKey), 1),
								!e.isRequired && !e.isLocked ? (J(), Y("label", {
									key: 0,
									class: "app-switch app-switch--small component-visibility-toggle",
									title: z(I.value, L.value, e) ? "웹 출력에 노출 중" : "웹 출력에서 숨김"
								}, [
									X("input", {
										class: "app-switch__input",
										type: "checkbox",
										role: "switch",
										checked: z(I.value, L.value, e),
										"aria-label": `${e.name} 노출`,
										onChange: (t) => qe(I.value, L.value, e, t.target.checked)
									}, null, 40, Kl),
									i[48] ||= X("span", {
										class: "app-switch__track",
										"aria-hidden": "true"
									}, null, -1),
									i[49] ||= X("span", { class: "app-switch__label" }, "노출", -1)
								], 8, Gl)) : Z("", !0)
							]), e.fieldKind === "cta" ? (J(), Y(q, { key: 0 }, [X("label", null, [i[50] ||= X("span", null, "버튼 텍스트", -1), X("input", {
								disabled: L.value.isLocked || e.isLocked,
								value: gt(L.value, e)?.label,
								onInput: (t) => vt(L.value, e, "label", t.target.value)
							}, null, 40, ql)]), X("label", null, [i[51] ||= X("span", null, "버튼 URL", -1), X("input", {
								disabled: L.value.isLocked || e.isLocked,
								type: "url",
								value: gt(L.value, e)?.link,
								onInput: (t) => vt(L.value, e, "link", t.target.value)
							}, null, 40, Jl)])], 64)) : e.fieldKind === "image" ? (J(), Y(q, { key: 1 }, [
								Se.value.canRunComponentImageAi && kt(I.value, L.value, e) ? (J(), Y("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: jt(I.value, L.value, e).disabled,
									onClick: (t) => Mt(I.value, "generate", L.value.itemKey, "item", e.fieldKey)
								}, N(jt(I.value, L.value, e).label), 9, Yl)) : Z("", !0),
								X("label", null, [i[52] ||= X("span", null, "이미지 입력 방식", -1), X("select", {
									disabled: L.value.isLocked || e.isLocked,
									value: gt(L.value, e)?.source,
									onChange: (t) => vt(L.value, e, "source", t.target.value)
								}, [(J(!0), Y(q, null, K(e.image?.allowedSources || ["url"], (e) => (J(), Y("option", {
									key: e,
									value: e
								}, N(e), 9, Zl))), 128))], 40, Xl)]),
								X("label", null, [i[53] ||= X("span", null, "URL 또는 이미지 설명", -1), X("textarea", {
									disabled: L.value.isLocked || e.isLocked,
									rows: "4",
									value: gt(L.value, e)?.value,
									onInput: (t) => vt(L.value, e, "value", t.target.value)
								}, null, 40, Ql)]),
								e.image?.altTextRequired ? (J(), Y("label", $l, [i[54] ||= X("span", null, "대체 텍스트", -1), X("input", {
									disabled: L.value.isLocked || e.isLocked,
									value: gt(L.value, e)?.alt,
									onInput: (t) => vt(L.value, e, "alt", t.target.value)
								}, null, 40, eu)])) : Z("", !0),
								!L.value.isLocked && !e.isLocked && gt(L.value, e)?.value ? (J(), Y("button", {
									key: 2,
									type: "button",
									class: "image-remove-action",
									onClick: (t) => B(e)
								}, "이미지 삭제", 8, tu)) : Z("", !0)
							], 64)) : (J(), Y("label", nu, [X("span", null, N(e.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), X("textarea", {
								disabled: L.value.isLocked || e.isLocked,
								rows: e.textType === "multi" ? 8 : 3,
								value: gt(L.value, e),
								onInput: (t) => _t(L.value, e, t.target.value),
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 40, ru)]))]))), 128))])) : Z("", !0),
							ht(L.value).length <= 1 && L.value.fieldKind === "cta" ? (J(), Y("label", iu, [i[55] ||= X("span", null, "버튼 텍스트", -1), X("input", {
								disabled: L.value.isLocked,
								value: ke.value?.label,
								onInput: i[13] ||= (e) => mt("label", e.target.value)
							}, null, 40, au)])) : Z("", !0),
							ht(L.value).length <= 1 && L.value.fieldKind === "cta" ? (J(), Y("label", ou, [i[56] ||= X("span", null, "버튼 URL", -1), X("input", {
								disabled: L.value.isLocked,
								type: "url",
								value: ke.value?.link,
								onInput: i[14] ||= (e) => mt("link", e.target.value)
							}, null, 40, su)])) : ht(L.value).length <= 1 && L.value.fieldKind === "image" ? (J(), Y(q, { key: 3 }, [
								Se.value.canRunComponentImageAi && kt(I.value, L.value) ? (J(), Y("button", {
									key: 0,
									type: "button",
									class: "section-ai-action item-ai-generation-action",
									disabled: jt(I.value, L.value).disabled,
									title: jt(I.value, L.value).disabled && !Tt(I.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
									onClick: i[15] ||= (e) => Mt(I.value, jt(I.value, L.value).action, L.value.itemKey)
								}, N(jt(I.value, L.value).label), 9, cu)) : Z("", !0),
								X("label", null, [i[57] ||= X("span", null, "이미지 입력 방식", -1), X("select", {
									disabled: L.value.isLocked,
									value: ke.value?.source,
									onChange: i[16] ||= (e) => mt("source", e.target.value)
								}, [(J(!0), Y(q, null, K(L.value.image?.allowedSources || ["url"], (e) => (J(), Y("option", {
									key: e,
									value: e
								}, N(e), 9, uu))), 128))], 40, lu)]),
								X("label", null, [i[58] ||= X("span", null, "URL 또는 이미지 설명", -1), X("textarea", {
									disabled: L.value.isLocked,
									rows: "4",
									value: ke.value?.value,
									onInput: i[17] ||= (e) => mt("value", e.target.value)
								}, null, 40, du)]),
								L.value.image?.descriptionEnabled ? (J(), Y("label", fu, [i[59] ||= X("span", null, "설명", -1), X("textarea", {
									disabled: L.value.isLocked,
									rows: "3",
									value: ke.value?.description,
									onInput: i[18] ||= (e) => mt("description", e.target.value)
								}, null, 40, pu)])) : Z("", !0),
								L.value.image?.altTextRequired ? (J(), Y("label", mu, [i[60] ||= X("span", null, "대체 텍스트", -1), X("input", {
									disabled: L.value.isLocked,
									value: ke.value?.alt,
									onInput: i[19] ||= (e) => mt("alt", e.target.value)
								}, null, 40, hu)])) : Z("", !0),
								!L.value.isLocked && ke.value?.value ? (J(), Y("button", {
									key: 3,
									type: "button",
									class: "image-remove-action",
									onClick: B
								}, "이미지 삭제")) : Z("", !0)
							], 64)) : ht(L.value).length <= 1 ? (J(), Y("label", gu, [X("span", null, N(L.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), vn(X("textarea", {
								"onUpdate:modelValue": i[20] ||= (e) => ke.value = e,
								disabled: L.value.isLocked,
								rows: L.value.textType === "multi" ? 8 : 3,
								placeholder: "Enter 키로 줄바꿈할 수 있습니다."
							}, null, 8, _u), [[eo, ke.value]])])) : Z("", !0),
							X("dl", vu, [
								X("div", null, [i[61] ||= X("dt", null, "Item key", -1), X("dd", null, N(L.value.itemKey), 1)]),
								X("div", null, [i[62] ||= X("dt", null, "필수", -1), X("dd", null, N(L.value.isRequired ? "Y" : "N"), 1)]),
								X("div", null, [i[63] ||= X("dt", null, "고정", -1), X("dd", null, N(L.value.isLocked ? "Y" : "N"), 1)])
							]),
							X("section", yu, [
								X("div", bu, [i[64] ||= X("strong", null, "DESIGN", -1), X("button", {
									type: "button",
									disabled: L.value.isLocked,
									onClick: zt
								}, "초기화", 8, xu)]),
								L.value.fieldKind === "image" ? (J(), Y("div", Su, [
									X("div", Cu, [
										i[65] ||= X("span", null, "크기 조절 방식", -1),
										X("div", wu, [X("button", {
											type: "button",
											class: j({ active: H.value.aspectRatioLocked !== !1 }),
											disabled: L.value.isLocked,
											onClick: i[21] ||= (e) => Gt("locked")
										}, "비율 유지", 10, Tu), X("button", {
											type: "button",
											class: j({ active: H.value.aspectRatioLocked === !1 }),
											disabled: L.value.isLocked || H.value.shape === "circle",
											onClick: i[22] ||= (e) => Gt("free")
										}, "자유 조절", 10, Eu)]),
										H.value.shape === "circle" ? (J(), Y("small", Du, "원형 이미지는 1:1 비율로 고정됩니다.")) : Z("", !0)
									]),
									X("label", null, [i[66] ||= X("span", null, "이미지 너비", -1), X("div", Ou, [X("input", {
										type: "range",
										min: Lt(vo),
										max: "100",
										step: "0.01",
										disabled: L.value.isLocked,
										value: H.value.widthPct || 32,
										onInput: i[23] ||= (e) => G({ widthPct: Number(e.target.value) })
									}, null, 40, ku), X("input", {
										class: "dimension-input",
										type: "number",
										min: Lt(vo),
										max: "100",
										step: "0.01",
										disabled: L.value.isLocked,
										value: Number((H.value.widthPct || 32).toFixed(2)),
										"aria-label": "이미지 너비 퍼센트",
										onChange: i[24] ||= (e) => G({ widthPct: Math.min(100, Math.max(Lt(.01), Number(e.target.value) || 32)) })
									}, null, 40, Au)])]),
									H.value.shape !== "circle" && H.value.aspectRatioLocked === !1 ? (J(), Y("label", ju, [i[67] ||= X("span", null, "이미지 높이", -1), X("div", Mu, [X("input", {
										type: "range",
										min: Lt(1),
										max: "900",
										step: "1",
										disabled: L.value.isLocked,
										value: H.value.heightPx || 240,
										onInput: i[25] ||= (e) => G({ heightPx: Number(e.target.value) })
									}, null, 40, Nu), X("input", {
										class: "dimension-input",
										type: "number",
										min: Lt(1),
										max: "900",
										step: "1",
										disabled: L.value.isLocked,
										value: Math.round(H.value.heightPx || 240),
										"aria-label": "이미지 높이 픽셀",
										onChange: i[26] ||= (e) => G({ heightPx: Math.min(900, Math.max(Lt(1), Number(e.target.value) || 240)) })
									}, null, 40, Pu)])])) : Z("", !0),
									X("label", null, [i[69] ||= X("span", null, "이미지 맞춤", -1), X("select", {
										disabled: L.value.isLocked,
										value: H.value.imageFit || "contain",
										onChange: i[27] ||= (e) => G({ imageFit: e.target.value })
									}, [...i[68] ||= [X("option", { value: "contain" }, "전체 표시", -1), X("option", { value: "cover" }, "영역 채우기", -1)]], 40, Fu)]),
									X("label", null, [i[71] ||= X("span", null, "이미지 초점", -1), X("select", {
										disabled: L.value.isLocked,
										value: H.value.imagePosition || "center center",
										onChange: i[28] ||= (e) => G({ imagePosition: e.target.value })
									}, [...i[70] ||= [
										X("option", { value: "left top" }, "왼쪽 위", -1),
										X("option", { value: "center top" }, "중앙 위", -1),
										X("option", { value: "right top" }, "오른쪽 위", -1),
										X("option", { value: "left center" }, "왼쪽 중앙", -1),
										X("option", { value: "center center" }, "중앙", -1),
										X("option", { value: "right center" }, "오른쪽 중앙", -1),
										X("option", { value: "left bottom" }, "왼쪽 아래", -1),
										X("option", { value: "center bottom" }, "중앙 아래", -1),
										X("option", { value: "right bottom" }, "오른쪽 아래", -1)
									]], 40, Iu)]),
									X("label", null, [i[73] ||= X("span", null, "이미지 형태", -1), X("select", {
										disabled: L.value.isLocked,
										value: H.value.shape || "square",
										onChange: i[29] ||= (e) => Wt(e.target.value)
									}, [...i[72] ||= [
										X("option", { value: "square" }, "사각형", -1),
										X("option", { value: "rounded" }, "둥근 사각형", -1),
										X("option", { value: "circle" }, "원형", -1)
									]], 40, Lu)]),
									X("label", Ru, [X("input", {
										type: "checkbox",
										disabled: L.value.isLocked,
										checked: H.value.decorative === !0,
										onChange: i[30] ||= (e) => G({ decorative: e.target.checked })
									}, null, 40, zu), i[74] ||= X("span", null, "장식 이미지", -1)]),
									H.value.decorative === !0 ? Z("", !0) : (J(), Y("label", Bu, [i[75] ||= X("span", null, "이미지 설명", -1), X("input", {
										type: "text",
										maxlength: "240",
										disabled: L.value.isLocked,
										value: H.value.accessibleLabel || ke.value?.alt || L.value.name,
										onInput: i[31] ||= (e) => G({ accessibleLabel: e.target.value })
									}, null, 40, Vu)]))
								])) : (J(), Y("div", Hu, [
									i[78] ||= X("strong", null, "컴포넌트 영역 크기", -1),
									i[79] ||= X("small", null, "프리뷰의 모서리와 변을 드래그하면 영역과 글자 크기가 함께 변경됩니다.", -1),
									X("label", null, [i[76] ||= X("span", null, "컴포넌트 너비", -1), X("div", Uu, [X("input", {
										type: "range",
										min: "0.01",
										max: "100",
										step: "0.1",
										disabled: L.value.isLocked,
										value: H.value.widthPct || 32,
										onInput: i[32] ||= (e) => G({ widthPct: Number(e.target.value) })
									}, null, 40, Wu), X("input", {
										class: "dimension-input",
										type: "number",
										min: "0.01",
										max: "100",
										step: "0.1",
										disabled: L.value.isLocked,
										value: Math.round(H.value.widthPct || 32),
										"aria-label": "컴포넌트 너비 퍼센트",
										onChange: i[33] ||= (e) => G({ widthPct: Math.min(100, Math.max(.01, Number(e.target.value) || 32)) })
									}, null, 40, Gu)])]),
									X("label", null, [i[77] ||= X("span", null, "컴포넌트 높이", -1), X("div", Ku, [X("input", {
										type: "range",
										min: "1",
										max: "900",
										step: "1",
										disabled: L.value.isLocked,
										value: H.value.heightPx || 120,
										onInput: i[34] ||= (e) => G({ heightPx: Number(e.target.value) })
									}, null, 40, qu), X("input", {
										class: "dimension-input",
										type: "number",
										min: "1",
										max: "900",
										step: "1",
										disabled: L.value.isLocked,
										value: Math.round(H.value.heightPx || 120),
										"aria-label": "컴포넌트 높이 픽셀",
										onChange: i[35] ||= (e) => G({ heightPx: Math.min(900, Math.max(1, Number(e.target.value) || 120)) })
									}, null, 40, Ju)])])
								])),
								L.value.fieldKind === "image" ? Z("", !0) : (J(), Y(q, { key: 2 }, [
									X("label", null, [
										i[82] ||= X("span", null, "글자 색상", -1),
										X("select", {
											disabled: L.value.isLocked,
											value: H.value.colorToken || "",
											onChange: i[36] ||= (e) => Je(e.target.value)
										}, [i[80] ||= X("option", { value: "" }, "디자인 토큰 기본값", -1), (J(!0), Y(q, null, K(Pe.value, (e) => (J(), Y("option", {
											key: e.key,
											value: e.key
										}, N(e.label) + " · " + N(e.value), 9, Xu))), 128))], 40, Yu),
										U.value ? (J(), Y("div", Zu, [
											X("i", {
												style: A({ backgroundColor: U.value.value }),
												"aria-hidden": "true"
											}, null, 4),
											X("span", null, N(U.value.label), 1),
											X("code", null, N(U.value.value), 1)
										])) : Z("", !0),
										Pe.value.length ? (J(), Y("details", Qu, [i[81] ||= X("summary", null, "실제 색상 보기", -1), X("div", $u, [(J(!0), Y(q, null, K(Pe.value, (e) => (J(), Y("div", {
											key: e.key,
											class: j({ active: e.key === H.value.colorToken })
										}, [
											X("i", {
												style: A({ backgroundColor: e.value }),
												"aria-hidden": "true"
											}, null, 4),
											X("span", null, N(e.label), 1),
											X("code", null, N(e.value), 1)
										], 2))), 128))])])) : Z("", !0)
									]),
									X("label", null, [
										i[85] ||= X("span", null, "폰트 크기", -1),
										X("select", {
											disabled: L.value.isLocked,
											value: H.value.fontSizeToken || "",
											onChange: i[37] ||= (e) => Ye(e.target.value)
										}, [i[83] ||= X("option", { value: "" }, "디자인 토큰 기본값", -1), (J(!0), Y(q, null, K(Fe.value, (e) => (J(), Y("option", {
											key: e.key,
											value: e.key
										}, N(e.label) + " · " + N(e.value), 9, td))), 128))], 40, ed),
										Ft.value ? (J(), Y("div", nd, [X("span", { style: A({ fontSize: Ft.value.value }) }, "가나다 Aa", 4), X("code", null, N(Ft.value.label) + " · " + N(Ft.value.value), 1)])) : Z("", !0),
										Fe.value.length ? (J(), Y("details", rd, [i[84] ||= X("summary", null, "실제 크기 보기", -1), X("div", id, [(J(!0), Y(q, null, K(Fe.value, (e) => (J(), Y("div", {
											key: e.key,
											class: j({ active: e.key === H.value.fontSizeToken })
										}, [X("span", { style: A({ fontSize: e.value }) }, "가나다 Aa", 4), X("code", null, N(e.label) + " · " + N(e.value), 1)], 2))), 128))])])) : Z("", !0)
									]),
									X("label", null, [i[87] ||= X("span", null, "폰트 굵기", -1), X("select", {
										disabled: L.value.isLocked,
										value: H.value.fontWeight || 400,
										onChange: i[38] ||= (e) => G({ fontWeight: Number(e.target.value) })
									}, [...i[86] ||= [
										X("option", { value: 400 }, "Regular", -1),
										X("option", { value: 500 }, "Medium", -1),
										X("option", { value: 700 }, "Bold", -1),
										X("option", { value: 800 }, "Extra Bold", -1)
									]], 40, ad)])
								], 64)),
								X("div", od, [i[88] ||= X("span", null, "위치", -1), H.value.positionMode === "free" ? (J(), Y("strong", sd, " X " + N(Math.round(H.value.xPct || 0)) + "% · Y " + N(Math.round(H.value.yPx || 0)) + "px ", 1)) : (J(), Y("strong", cd, "자동 배치"))]),
								H.value.positionMode === "free" ? (J(), Y("button", {
									key: 3,
									class: "secondary-control",
									type: "button",
									disabled: L.value.isLocked,
									onClick: Bt
								}, " 자동 배치로 복원 ", 8, ld)) : Z("", !0)
							])
						])) : Z("", !0)])])], 2))), 128)), I.value.items?.length ? Z("", !0) : (J(), Y("span", ud, "등록된 컴포넌트 없음"))])]),
						_: 1
					}, 8, ["selected-section"])
				], 2)) : Z("", !0)
			], 2)], 2),
			De.value ? Z("", !0) : (J(), Y("button", dd))
		], 10, gl));
	}
}, pd = document.querySelector("#visual-editor-app");
pd && so(fd, { mode: new URLSearchParams(window.location.search).get("mode") || pd.dataset.mode || "editor" }).mount(pd);
//#endregion
