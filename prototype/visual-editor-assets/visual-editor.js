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
}, ae, M = () => ae ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function N(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ce(r) : N(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var oe = /;(?![^(]*\))/g, P = /:([^]+)/, se = /\/\*[^]*?\*\//g;
function ce(e) {
	let t = {};
	return e.replace(se, "").split(oe).forEach((e) => {
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
var le = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", I = /* @__PURE__ */ e(le);
le + "";
function L(e) {
	return !!e || e === "";
}
function R(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = ue(e[r], t[r]);
	return n;
}
function ue(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? R(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !ue(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function de(e, t) {
	return e.findIndex((e) => ue(e, t));
}
var fe = (e) => !!(e && e.__v_isRef === !0), z = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? fe(e) ? z(e.value) : JSON.stringify(e, pe, 2) : String(e), pe = (e, t) => fe(t) ? pe(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[me(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => me(e)) } : _(t) ? me(t) : v(t) && !d(t) && !C(t) ? String(t) : t, me = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, B, he = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && B && (B.active ? (this.parent = B, this.index = (B.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = B;
			try {
				return B = this, e();
			} finally {
				B = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = B, B = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (B === this) B = this.prevScope;
			else {
				let e = B;
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
function ge() {
	return B;
}
var V, _e = /* @__PURE__ */ new WeakSet(), ve = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, B && (B.active ? B.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, _e.has(this) && (_e.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Se(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Fe(this), Te(this);
		let e = V, t = je;
		V = this, je = !0;
		try {
			return this.fn();
		} finally {
			Ee(this), V = e, je = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ke(e);
			this.deps = this.depsTail = void 0, Fe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? _e.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		De(this) && this.run();
	}
	get dirty() {
		return De(this);
	}
}, ye = 0, be, xe;
function Se(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = xe, xe = e;
		return;
	}
	e.next = be, be = e;
}
function Ce() {
	ye++;
}
function we() {
	if (--ye > 0) return;
	if (xe) {
		let e = xe;
		for (xe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; be;) {
		let t = be;
		for (be = void 0; t;) {
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
function Te(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ee(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ke(r), Ae(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function De(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Oe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Oe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ie) || (e.globalVersion = Ie, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !De(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = V, r = je;
	V = e, je = !0;
	try {
		Te(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		V = n, je = r, Ee(e), e.flags &= -3;
	}
}
function ke(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ke(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ae(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var je = !0, Me = [];
function Ne() {
	Me.push(je), je = !1;
}
function Pe() {
	let e = Me.pop();
	je = e === void 0 || e;
}
function Fe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = V;
		V = void 0;
		try {
			t();
		} finally {
			V = e;
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
		if (!V || !je || V === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== V) t = this.activeLink = new Le(V, this), V.deps ? (t.prevDep = V.depsTail, V.depsTail.nextDep = t, V.depsTail = t) : V.deps = V.depsTail = t, ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = V.depsTail, t.nextDep = void 0, V.depsTail.nextDep = t, V.depsTail = t, V.deps === t && (V.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ie++, this.notify(e);
	}
	notify(e) {
		Ce();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			we();
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
	if (je && V) {
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
	if (Ce(), t === "clear") o.forEach(s);
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
	we();
}
function Ge(e) {
	let t = /* @__PURE__ */ K(e);
	return t === e ? t : (H(t, "iterate", Ue), /* @__PURE__ */ Dt(e) ? t : t.map(At));
}
function Ke(e) {
	return H(e = /* @__PURE__ */ K(e), "iterate", Ue), e;
}
function U(e, t) {
	return /* @__PURE__ */ Et(e) ? jt(/* @__PURE__ */ Tt(e) ? At(t) : t) : At(t);
}
var W = {
	__proto__: null,
	[Symbol.iterator]() {
		return qe(this, Symbol.iterator, (e) => U(this, e));
	},
	concat(...e) {
		return Ge(this).concat(...e.map((e) => d(e) ? Ge(e) : e));
	},
	entries() {
		return qe(this, "entries", (e) => (e[1] = U(this, e[1]), e));
	},
	every(e, t) {
		return Je(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Je(this, "filter", e, t, (e) => e.map((e) => U(this, e)), arguments);
	},
	find(e, t) {
		return Je(this, "find", e, t, (e) => U(this, e), arguments);
	},
	findIndex(e, t) {
		return Je(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Je(this, "findLast", e, t, (e) => U(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Je(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Je(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Xe(this, "includes", e);
	},
	indexOf(...e) {
		return Xe(this, "indexOf", e);
	},
	join(e) {
		return Ge(this).join(e);
	},
	lastIndexOf(...e) {
		return Xe(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Je(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Ze(this, "pop");
	},
	push(...e) {
		return Ze(this, "push", e);
	},
	reduce(e, ...t) {
		return Ye(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Ye(this, "reduceRight", e, t);
	},
	shift() {
		return Ze(this, "shift");
	},
	some(e, t) {
		return Je(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Ze(this, "splice", e);
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
		return Ze(this, "unshift", e);
	},
	values() {
		return qe(this, "values", (e) => U(this, e));
	}
};
function qe(e, t, n) {
	let r = Ke(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Dt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var G = Array.prototype;
function Je(e, t, n, r, i, a) {
	let o = Ke(e), s = o !== e && !/* @__PURE__ */ Dt(e), c = o[t];
	if (c !== G[t]) {
		let t = c.apply(e, a);
		return s ? At(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, U(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Ye(e, t, n, r) {
	let i = Ke(e), a = i !== e && !/* @__PURE__ */ Dt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = U(e, t)), n.call(this, t, U(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? U(e, c) : c;
}
function Xe(e, t, n) {
	let r = /* @__PURE__ */ K(e);
	H(r, "iterate", Ue);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ot(n[0]) ? (n[0] = /* @__PURE__ */ K(n[0]), r[t](...n)) : i;
}
function Ze(e, t, n = []) {
	Ne(), Ce();
	let r = (/* @__PURE__ */ K(e))[t].apply(e, n);
	return we(), Pe(), r;
}
var Qe = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), $e = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function et(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ K(this);
	return H(t, "has", e), t.hasOwnProperty(e);
}
var tt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? yt : vt : i ? _t : gt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = W[t])) return e;
			if (t === "hasOwnProperty") return et;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Mt(e) ? e : n);
		if ((_(t) ? $e.has(t) : Qe(t)) || (r || H(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Mt(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Ct(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Ct(o) : /* @__PURE__ */ xt(o) : o;
	}
}, nt = class extends tt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Et(i);
			if (!/* @__PURE__ */ Dt(n) && !/* @__PURE__ */ Et(n) && (i = /* @__PURE__ */ K(i), n = /* @__PURE__ */ K(n)), !a && /* @__PURE__ */ Mt(i) && !/* @__PURE__ */ Mt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Mt(e) ? e : r);
		return e === /* @__PURE__ */ K(r) && s && (o ? A(n, i) && We(e, "set", t, n, i) : We(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && We(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !$e.has(t)) && H(e, "has", t), n;
	}
	ownKeys(e) {
		return H(e, "iterate", d(e) ? "length" : Ve), Reflect.ownKeys(e);
	}
}, rt = class extends tt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, it = /* @__PURE__ */ new nt(), at = /* @__PURE__ */ new rt(), ot = /* @__PURE__ */ new nt(!0), st = (e) => e, ct = (e) => Reflect.getPrototypeOf(e);
function lt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ K(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? st : t ? jt : At;
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
function ut(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function dt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ K(r), a = /* @__PURE__ */ K(n);
			e || (A(n, a) && H(i, "get", n), H(i, "get", a));
			let { has: o } = ct(i), s = t ? st : e ? jt : At;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && H(/* @__PURE__ */ K(t), "iterate", Ve), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ K(n), i = /* @__PURE__ */ K(t);
			return e || (A(t, i) && H(r, "has", t), H(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ K(a), s = t ? st : e ? jt : At;
			return !e && H(o, "iterate", Ve), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: ut("add"),
		set: ut("set"),
		delete: ut("delete"),
		clear: ut("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ K(this), r = ct(n), i = /* @__PURE__ */ K(e), a = !t && !/* @__PURE__ */ Dt(e) && !/* @__PURE__ */ Et(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), We(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Dt(n) && !/* @__PURE__ */ Et(n) && (n = /* @__PURE__ */ K(n));
			let r = /* @__PURE__ */ K(this), { has: i, get: a } = ct(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ K(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && We(r, "set", e, n, s) : We(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ K(this), { has: n, get: r } = ct(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ K(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && We(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ K(this), t = e.size !== 0, n = e.clear();
			return t && We(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = lt(r, e, t);
	}), n;
}
function ft(e, t) {
	let n = dt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var pt = { get: /* @__PURE__ */ ft(!1, !1) }, mt = { get: /* @__PURE__ */ ft(!1, !0) }, ht = { get: /* @__PURE__ */ ft(!0, !1) }, gt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap();
function bt(e) {
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
function xt(e) {
	return /* @__PURE__ */ Et(e) ? e : wt(e, !1, it, pt, gt);
}
// @__NO_SIDE_EFFECTS__
function St(e) {
	return wt(e, !1, ot, mt, _t);
}
// @__NO_SIDE_EFFECTS__
function Ct(e) {
	return wt(e, !0, at, ht, vt);
}
function wt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = bt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Tt(e) {
	return /* @__PURE__ */ Et(e) ? /* @__PURE__ */ Tt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function K(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ K(t) : e;
}
function kt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && j(e, "__v_skip", !0), e;
}
var At = (e) => v(e) ? /* @__PURE__ */ xt(e) : e, jt = (e) => v(e) ? /* @__PURE__ */ Ct(e) : e;
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function q(e) {
	return Nt(e, !1);
}
function Nt(e, t) {
	return /* @__PURE__ */ Mt(e) ? e : new Pt(e, t);
}
var Pt = class {
	constructor(e, t) {
		this.dep = new Re(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ K(e), this._value = t ? e : At(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Dt(e) || /* @__PURE__ */ Et(e);
		e = n ? e : /* @__PURE__ */ K(e), A(e, t) && (this._rawValue = e, this._value = n ? e : At(e), this.dep.trigger());
	}
};
function Ft(e) {
	return /* @__PURE__ */ Mt(e) ? e.value : e;
}
var It = {
	get: (e, t, n) => t === "__v_raw" ? e : Ft(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Mt(i) && !/* @__PURE__ */ Mt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Lt(e) {
	return /* @__PURE__ */ Tt(e) ? e : new Proxy(e, It);
}
var Rt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Re(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ie - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && V !== this) return Se(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Oe(this), e && (e.version = this.dep.version), this._value;
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
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Dt(e) || o === !1 || o === 0 ? Gt(e, 1) : Gt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Mt(e) ? (g = () => e.value, y = /* @__PURE__ */ Dt(e)) : /* @__PURE__ */ Tt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Tt(e) || /* @__PURE__ */ Dt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ Mt(e)) return e.value;
		if (/* @__PURE__ */ Tt(e)) return p(e);
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
	let x = ge(), S = () => {
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
	return u && u(w), m = new ve(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Ut(e, !1, m), _ = m.onStop = () => {
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
	if (n.set(e, t), t--, /* @__PURE__ */ Mt(e)) Gt(e.value, t, n);
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
			Ne(), Kt(o, null, 10, [
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
var Xt = [], Zt = -1, Qt = [], $t = null, en = 0, tn = /* @__PURE__ */ Promise.resolve(), nn = null;
function rn(e) {
	let t = nn || tn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function an(e) {
	let t = Zt + 1, n = Xt.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Xt[r], a = dn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function on(e) {
	if (!(e.flags & 1)) {
		let t = dn(e), n = Xt[Xt.length - 1];
		!n || !(e.flags & 2) && t >= dn(n) ? Xt.push(e) : Xt.splice(an(t), 0, e), e.flags |= 1, sn();
	}
}
function sn() {
	nn ||= tn.then(fn);
}
function cn(e) {
	d(e) ? Qt.push(...e) : $t && e.id === -1 ? $t.splice(en + 1, 0, e) : e.flags & 1 || (Qt.push(e), e.flags |= 1), sn();
}
function ln(e, t, n = Zt + 1) {
	for (; n < Xt.length; n++) {
		let t = Xt[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Xt.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function un(e) {
	if (Qt.length) {
		let e = [...new Set(Qt)].sort((e, t) => dn(e) - dn(t));
		if (Qt.length = 0, $t) {
			$t.push(...e);
			return;
		}
		for ($t = e, en = 0; en < $t.length; en++) {
			let e = $t[en];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		$t = null, en = 0;
	}
}
var dn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function fn(e) {
	try {
		for (Zt = 0; Zt < Xt.length; Zt++) {
			let e = Xt[Zt];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Kt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Zt < Xt.length; Zt++) {
			let e = Xt[Zt];
			e && (e.flags &= -2);
		}
		Zt = -1, Xt.length = 0, un(e), nn = null, (Xt.length || Qt.length) && fn(e);
	}
}
var pn = null, mn = null;
function hn(e) {
	let t = pn;
	return pn = e, mn = e && e.type.__scopeId || null, t;
}
function gn(e, t = pn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Si(-1);
		let i = hn(t), a;
		try {
			a = e(...n);
		} finally {
			hn(i), r._d && Si(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function _n(e, n) {
	if (pn === null) return e;
	let r = aa(pn), i = e.dirs ||= [];
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
function vn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ne(), qt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Pe());
	}
}
function yn(e, t) {
	if (Ui) {
		let n = Ui.provides, r = Ui.parent && Ui.parent.provides;
		r === n && (n = Ui.provides = Object.create(r)), n[e] = t;
	}
}
function bn(e, t, n = !1) {
	let r = Wi();
	if (r || Tr) {
		let i = Tr ? Tr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var xn = /* @__PURE__ */ Symbol.for("v-scx"), Sn = () => bn(xn);
function Cn(e, t, n) {
	return wn(e, t, n);
}
function wn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Xi) {
		if (c === "sync") {
			let e = Sn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Ui;
	u.call = (e, t, n) => qt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ni(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : on(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Wt(e, n, u);
	return Xi && (f ? f.push(h) : d && h()), h;
}
function Tn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? En(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = qi(this), s = wn(i, a.bind(r), n);
	return o(), s;
}
function En(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Dn = /* @__PURE__ */ Symbol("_vte"), On = (e) => e.__isTeleport, kn = /* @__PURE__ */ Symbol("_leaveCb");
function An(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, An(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function jn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Mn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Nn = /* @__PURE__ */ new WeakMap();
function Pn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Pn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (In(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Pn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? aa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ K(v), b = v === t ? i : (e) => !Mn(_, e) && u(y, e), x = (e, t) => !(t && Mn(_, t));
	if (m != null && m !== p) {
		if (Fn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Mt(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) {
		Ne();
		try {
			Kt(p, f, 12, [l, _]);
		} finally {
			Pe();
		}
	} else {
		let t = g(p), n = /* @__PURE__ */ Mt(p);
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
					i(), Nn.delete(e);
				};
				t.id = -1, Nn.set(e, t), ni(t, r);
			} else Fn(e), i();
		}
	}
}
function Fn(e) {
	let t = Nn.get(e);
	t && (t.flags |= 8, Nn.delete(e));
}
M().requestIdleCallback, M().cancelIdleCallback;
var In = (e) => !!e.type.__asyncLoader, Ln = (e) => e.type.__isKeepAlive;
function Rn(e, t) {
	Bn(e, "a", t);
}
function zn(e, t) {
	Bn(e, "da", t);
}
function Bn(e, t, n = Ui) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Hn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Ln(e.parent.vnode) && Vn(r, t, n, e), e = e.parent;
	}
}
function Vn(e, t, n, r) {
	let i = Hn(t, e, r, !0);
	Yn(() => {
		c(r[t], i);
	}, n);
}
function Hn(e, t, n = Ui, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ne();
			let i = qi(n), a = qt(t, n, e, r);
			return i(), Pe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Un = (e) => (t, n = Ui) => {
	(!Xi || e === "sp") && Hn(e, (...e) => t(...e), n);
}, Wn = Un("bm"), Gn = Un("m"), Kn = Un("bu"), qn = Un("u"), Jn = Un("bum"), Yn = Un("um"), Xn = Un("sp"), Zn = Un("rtg"), Qn = Un("rtc");
function $n(e, t = Ui) {
	Hn("ec", e, t);
}
var er = /* @__PURE__ */ Symbol.for("v-ndc");
function tr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Tt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Dt(e), s = /* @__PURE__ */ Et(e), e = Ke(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? jt(At(e[n])) : At(e[n]) : e[n], n, void 0, a && a[n]);
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
var nr = (e) => e ? Yi(e) ? aa(e) : nr(e.parent) : null, rr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => nr(e.parent),
	$root: (e) => nr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => fr(e),
	$forceUpdate: (e) => e.f ||= () => {
		on(e.update);
	},
	$nextTick: (e) => e.n ||= rn.bind(e.proxy),
	$watch: (e) => Tn.bind(e)
}), ir = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), ar = {
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
			else if (ir(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else sr && (s[n] = 0);
		}
		let d = rr[n], f, p;
		if (d) return n === "$attrs" && H(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return ir(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || ir(n, c) || u(o, c) || u(i, c) || u(rr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function or(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var sr = !0;
function cr(e) {
	let t = fr(e), n = e.proxy, i = e.ctx;
	sr = !1, t.beforeCreate && ur(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: ee, errorCaptured: D, serverPrefetch: te, expose: O, inheritAttrs: k, components: ne, directives: A, filters: re } = t;
	if (u && lr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ xt(t));
	}
	if (sr = !0, o) for (let e in o) {
		let t = o[e], a = $({
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
	if (c) for (let e in c) dr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			yn(t, e[t]);
		});
	}
	f && ur(f, e, "c");
	function j(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (j(Wn, p), j(Gn, m), j(Kn, g), j(qn, _), j(Rn, y), j(zn, b), j($n, D), j(Qn, E), j(Zn, ee), j(Jn, S), j(Yn, w), j(Xn, te), d(O)) if (O.length) {
		let t = e.exposed ||= {};
		O.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === r && (e.render = T), k != null && (e.inheritAttrs = k), ne && (e.components = ne), A && (e.directives = A), te && jn(e);
}
function lr(e, t, n = r) {
	d(e) && (e = _r(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? bn(r.from || n, r.default, !0) : bn(r.from || n) : bn(r), /* @__PURE__ */ Mt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function ur(e, t, n) {
	qt(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function dr(e, t, n, r) {
	let i = r.includes(".") ? En(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Cn(i, n);
	} else if (h(e)) Cn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => dr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && Cn(i, r, e);
	}
}
function fr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => pr(c, e, o, !0)), pr(c, t, o)), v(t) && a.set(t, c), c;
}
function pr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && pr(e, a, n, !0), i && i.forEach((t) => pr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = mr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var mr = {
	data: hr,
	props: br,
	emits: br,
	methods: yr,
	computed: yr,
	beforeCreate: vr,
	created: vr,
	beforeMount: vr,
	mounted: vr,
	beforeUpdate: vr,
	updated: vr,
	beforeDestroy: vr,
	beforeUnmount: vr,
	destroyed: vr,
	unmounted: vr,
	activated: vr,
	deactivated: vr,
	errorCaptured: vr,
	serverPrefetch: vr,
	components: yr,
	directives: yr,
	watch: xr,
	provide: hr,
	inject: gr
};
function hr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function gr(e, t) {
	return yr(_r(e), _r(t));
}
function _r(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function vr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function yr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function br(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), or(e), or(t ?? {})) : t;
}
function xr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = vr(e[r], t[r]);
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
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, aa(u.component);
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
var Tr = null, Er = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function Dr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Er(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(ie)));
	let c, l = i[c = ne(n)] || i[c = ne(D(n))];
	!l && o && (l = i[c = ne(O(n))]), l && qt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, qt(u, e, 6, a);
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
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = hn(e), v, y;
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
		vi.length = 0, Jt(t, e, 1), v = ki(gi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Nr(y, a)), b = Mi(b, y, !1, !0));
	}
	return n.dirs && (b = Mi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && An(b, n.transition), v = b, hn(_), v;
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
	return n === "style" && v(r) && v(i) ? !ue(r, i) : r !== i;
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
	n ? e.props = r ? i : /* @__PURE__ */ St(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function Hr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ K(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Ar(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = D(o);
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
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Ar(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ K(r), i = c || t;
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
					let o = qi(i);
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
		let n = D(c[e]);
		qr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
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
	let r = gn((...e) => Yr(t(...e)), n);
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
		e ? ($r(r, t, n), n && j(r, "_", e, !0)) : Zr(t, r);
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
	let a = M();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ei(e, t) && (r = ue(e), F(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
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
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? A(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, z);
		}
		u != null && i ? Pn(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Pn(e.ref, null, a, e, !0);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, ai(e, a), s, u), _ && vn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && zi(f, r, e);
		}
		_ && vn(e, null, r, "beforeMount");
		let v = si(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ni(() => {
			try {
				f && zi(f, r, e), v && g.enter(d), _ && vn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || pi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
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
		if (r && oi(r, !1), (g = h.onVnodeBeforeUpdate) && zi(g, r, n, e), f && vn(n, e, r, "beforeUpdate"), r && oi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, ai(n, a), o) : s || oe(e, n, l, null, r, i, ai(n, a), o, !1), u > 0) {
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
			g && zi(g, r, n, e), f && vn(n, e, r, "updated");
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
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ci(e, t, !0)) : oe(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : ie(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = Hi(e, r, i);
		if (Ln(e) && (s.ctx.renderer = z), Zi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = ki(gi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, ie = (e, t, n) => {
		let r = t.component = e.component;
		if (Pr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			N(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ui(e);
					if (n) {
						t && (t.el = c.el, N(e, t, o)), n.asyncDep.then(() => {
							ni(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				oi(e, !1), t ? (t.el = c.el, N(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && zi(d, s, t, c), oi(e, !0);
				let f = jr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ue(p), e, i, a), t.el = f.el, u === null && Lr(e, f.el), r && ni(r, i), (d = t.props && t.props.onVnodeUpdated) && ni(() => zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = In(t);
				if (oi(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && zi(o, d, t), oi(e, !0), s && me) {
					let t = () => {
						e.subTree = jr(e), me(s, e.subTree, e, i, null);
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
				(t.shapeFlag & 256 || d && In(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ni(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ve(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => on(u), oi(e, !0), l();
	}, N = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Hr(e, t.props, r, n), ti(e, t.children, n), Ne(), ln(e), Pe();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
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
		m & 8 ? (u & 16 && R(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : R(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, P = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ii(t[p]) : Fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? R(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, se = (e, t, r, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) F(e[u], a, o, !0), u++;
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
					F(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ei(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? F(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? li(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || fi(f) : i;
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
			c.move(e, t, n, z);
			return;
		}
		if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === _i) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[kn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ni(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[kn];
				a._isLeaving && a[kn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, F = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ne(), Pn(s, null, n, e, !0), Pe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !In(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && zi(_, t, e), u & 6) L(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && vn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, z, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? R(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && R(c, t, n), r && le(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ni(() => {
			_ && zi(_, t, e), h && vn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, le = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === J) {
			I(n, r);
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
	}, I = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, L = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		di(c), di(l), r && re(r), i.stop(), a && (a.flags |= 8, F(o, e, t, n)), s && ni(s, t), ni(() => {
			e.isUnmounted = !0;
		}, t);
	}, R = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) F(e[o], t, n, r, i);
	}, ue = (e) => {
		if (e.shapeFlag & 6) return ue(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Dn];
		return n ? h(n) : t;
	}, de = !1, fe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (F(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, de ||= (de = !0, ln(r), un(), !1);
	}, z = {
		p: v,
		um: F,
		m: ce,
		r: le,
		mt: j,
		mc: D,
		pc: oe,
		pbc: O,
		n: ue,
		o: e
	}, pe, me;
	return i && ([pe, me] = i(z)), {
		render: fe,
		hydrate: pe,
		createApp: wr(fe, pe)
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : cn(e);
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
var Di = ({ key: e }) => e ?? null, Oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ Mt(e) || h(e) ? {
	i: pn,
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
		scopeId: mn,
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
		ctx: pn
	};
	return s ? (Li(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), xi > 0 && !o && yi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && yi.push(c), c;
}
var ki = Ai;
function Ai(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === er) && (e = gi), Ti(e)) {
		let r = Mi(e, t, !0);
		return n && Li(r, n), xi > 0 && !a && yi && (r.shapeFlag & 6 ? yi[yi.indexOf(e)] = r : yi.push(r)), r.patchFlag = -2, r;
	}
	if (oa(e) && (e = e.__vccOpts), t) {
		t = ji(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = F(e)), v(n) && (/* @__PURE__ */ Ot(n) && !d(n) && (n = s({}, n)), t.style = N(n));
	}
	let o = g(e) ? 1 : pi(e) ? 128 : On(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function ji(e) {
	return e ? /* @__PURE__ */ Ot(e) || Br(e) ? s({}, e) : e : null;
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
	return c && r && An(u, c.clone(u)), u;
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
		!r && !Br(t) ? t._ctx = pn : r === 3 && pn && (pn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Li(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: pn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ni(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ri(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = F([t.class, r.class]));
		else if (e === "style") t.style = N([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function zi(e, t, n, r = null) {
	qt(e, t, 7, [n, r]);
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
		scope: new he(!0),
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
var Ui = null, Wi = () => Ui || pn, Gi, Ki;
{
	let e = M(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Gi = t("__VUE_INSTANCE_SETTERS__", (e) => Ui = e), Ki = t("__VUE_SSR_SETTERS__", (e) => Xi = e);
}
var qi = (e) => {
	let t = Ui;
	return Gi(e), e.scope.on(), () => {
		e.scope.off(), Gi(t);
	};
}, Ji = () => {
	Ui && Ui.scope.off(), Gi(null);
};
function Yi(e) {
	return e.vnode.shapeFlag & 4;
}
var Xi = !1;
function Zi(e, t = !1, n = !1) {
	t && Ki(t);
	let { props: r, children: i } = e.vnode, a = Yi(e);
	Vr(e, r, a, t), ei(e, i, n || t);
	let o = a ? Qi(e, t) : void 0;
	return t && Ki(!1), o;
}
function Qi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ar);
	let { setup: r } = n;
	if (r) {
		Ne();
		let n = e.setupContext = r.length > 1 ? ia(e) : null, i = qi(e), a = Kt(r, e, 0, [e.props, n]), o = y(a);
		if (Pe(), i(), (o || e.sp) && !In(e) && jn(e), o) {
			if (a.then(Ji, Ji), t) return a.then((n) => {
				$i(e, n, t);
			}).catch((t) => {
				Jt(t, e, 0);
			});
			e.asyncDep = a;
		} else $i(e, a, t);
	} else na(e, t);
}
function $i(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Lt(t)), na(e, n);
}
var ea, ta;
function na(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && ea && !i.render) {
			let t = i.template || fr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = ea(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o));
			}
		}
		e.render = i.render || r, ta && ta(e);
	}
	{
		let t = qi(e);
		Ne();
		try {
			cr(e);
		} finally {
			Pe(), t();
		}
	}
}
var ra = { get(e, t) {
	return H(e, "get", ""), e[t];
} };
function ia(e) {
	return {
		attrs: new Proxy(e.attrs, ra),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function aa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Lt(kt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in rr) return rr[n](e);
		},
		has(e, t) {
			return t in e || t in rr;
		}
	}) : e.proxy;
}
function oa(e) {
	return h(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ zt(e, t, Xi), sa = "3.5.39", ca = void 0, la = typeof window < "u" && window.trustedTypes;
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
function Aa(e, t, n, r, i, a = I(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ka, t.slice(6, t.length)) : e.setAttributeNS(ka, t, n) : n == null || a && !L(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = L(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
				let e = de(t, n), a = e !== -1;
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
	if (d(t)) i = de(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ue(t, no(e, !0));
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
		let n = e, r = t, i = $(() => {
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
		function E(e, t) {
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
		function D(e, t, n) {
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
				aspectRatio: w(r.aspectRatio || n.image?.aspectRatio, "1 / 1"),
				borderRadius: a === "circle" ? "50%" : a === "rounded" ? "var(--promo-image-radius, 24px)" : "0"
			};
		}
		function te(e, t, n) {
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
		function ae(e) {
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
		function M(e) {
			let t = g(e).minHeight || ne(e);
			return { height: `${Math.max(0, t - 76)}px` };
		}
		function oe(e, t) {
			let n = h(e, t), r = n.positionMode === "free" ? n : A(e, t), i = t.fieldKind === "image", a = S(n.widthPct, i ? 10 : .01, 100, 32), o = S(n.heightPx, i ? 80 : 1, 900, void 0);
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
			let l = c.getBoundingClientRect(), u = s.getBoundingClientRect(), d = e.clientX, f = e.clientY, p = u.width, m = u.height, _ = u.left - l.left, v = u.top - l.top, y = m ? p / m : 1, b = h(t, i), x = i.fieldKind === "image", w = x && b.aspectRatioLocked !== !1, T = x ? 80 : 1, E = a.includes("w") || a.includes("e"), ee = a.includes("n") || a.includes("s"), D = x ? null : s.querySelector(".rendered-text, .rendered-empty, .rendered-cta"), te = D ? Number.parseFloat(getComputedStyle(D).fontSize) : 18, O = S(b.fontSize, 0, 80, te || 18), k = p, A = m, re = O, j = _, ie = v, ae = 0, M = (e) => {
				let t = a.includes("w") ? -1 : 1, n = a.includes("n") ? -1 : 1, r = (e.clientX - d) * t, i = (e.clientY - f) * n, o = Math.max(T, a.includes("w") ? p + _ : l.width - _), c = Math.max(T, a.includes("n") ? m + v : 1124 - v), u = E ? Math.min(o, Math.max(T, p + r)) : p, h = ee ? Math.min(c, Math.max(T, m + i)) : m;
				if (w || x && b.shape === "circle") {
					let e = b.shape === "circle" ? 1 : y;
					Math.abs(i) > Math.abs(r) ? (A = h, k = Math.min(o, Math.max(T, A * e)), A = k / e) : (k = u, A = Math.min(c, Math.max(T, k / e)), k = A * e);
				} else k = u, A = h;
				if (!x) {
					let e = p ? k / p : 1, t = m ? A / m : 1, n = E && ee ? Math.sqrt(e * t) : E ? e : t, r = Math.max(E ? k - p : 0, ee ? A - m : 0, 0);
					re = C(S(O === 0 ? r / 4 : O * n, 0, 80, O));
				}
				j = a.includes("w") ? _ + p - k : _, ie = a.includes("n") ? v + m - A : v, !ae && (ae = requestAnimationFrame(() => {
					ae = 0, s.style.left = `${j}px`, s.style.top = `${ie}px`, (E || w) && (s.style.width = `${k}px`), (ee || w) && (s.style.height = `${A}px`), x ? s.style.aspectRatio = "auto" : s.style.setProperty("--item-font-size", `${re}px`);
				}));
			}, N = () => {
				ae && cancelAnimationFrame(ae);
				let e = Math.ceil(ie + A + 76);
				e > (g(t).minHeight || ne(t)) && r("update-section-style", t.sectionKey, { minHeight: Math.min(1200, e) }), r("update-renderer-item-style", t, i, {
					positionMode: "free",
					xPct: l.width ? j / l.width * 100 : 0,
					yPx: ie,
					widthPct: l.width ? k / l.width * 100 : 32,
					heightPx: w || x && b.shape === "circle" ? void 0 : ee ? A : b.heightPx,
					...x ? { aspectRatio: `${Math.max(1, Math.round(k))}/${Math.max(1, Math.round(A))}` } : { fontSize: re }
				}), s.classList.remove("is-resizing"), s.style.removeProperty("width"), s.style.removeProperty("height"), s.style.removeProperty("aspect-ratio"), s.style.removeProperty("--item-font-size"), s.style.removeProperty("left"), s.style.removeProperty("top"), o.removeEventListener("pointermove", M), o.removeEventListener("pointerup", N), o.removeEventListener("pointercancel", N);
			};
			o.addEventListener("pointermove", M), o.addEventListener("pointerup", N), o.addEventListener("pointercancel", N);
		}
		function le(e, t, i, a = "se") {
			if (!n.editable || i.isLocked || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let o = h(t, i), s = i.fieldKind === "image", c = s && o.aspectRatioLocked !== !1, l = s ? 10 : .01, u = s ? 80 : 1, d = e.shiftKey ? 4 : 1, f = a.includes("w") || a.includes("e"), p = a.includes("n") || a.includes("s"), m = f ? a.includes("w") ? e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0 : e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0 : 0, g = p ? a.includes("n") ? e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0 : e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0 : 0, _ = m || g;
			if (c && !_ || !c && !m && !g) return;
			let v = S((o.widthPct ?? 32) + (c ? _ : m) * d, l, 100, 32), y = S(o.heightPx, u, 900, s ? 240 : 120), b = c || s && o.shape === "circle" ? void 0 : p ? S(y + g * d * 4, u, 900, s ? 240 : 120) : y, x = v / (o.widthPct ?? 32), w = b ? b / y : 1, T = f && p ? Math.sqrt(x * w) : f ? x : w, E = o.fontSize ?? 18, ee = E === 0 && T > 1 ? d : E * T;
			r("update-renderer-item-style", t, i, {
				widthPct: v,
				heightPx: b,
				...s ? {} : { fontSize: C(S(ee, 0, 80, E)) }
			});
		}
		function I(e, t, i) {
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
		function L(e, t) {
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
			class: F(["promo-renderer", {
				"is-editor-preview": e.editable,
				"has-editor-guides": e.editable && e.showGuides
			}]),
			style: N({
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
		}, [e.editable && e.showGuides ? (Y(), X("div", Do)) : Q("", !0), (Y(!0), X(J, null, tr(i.value, (t) => (Y(), X("section", {
			key: t.sectionKey,
			class: F(["rendered-section", `rendered-section--${t.sectionKey}`]),
			"data-section-key": t.sectionKey,
			style: N(ae(t)),
			"aria-busy": b(t)?.kind === "processing" ? "true" : void 0
		}, [
			e.editable && b(t) ? (Y(), X("div", {
				key: 0,
				class: F(["section-ai-state", `is-${b(t).kind}`]),
				role: "status",
				"aria-live": "polite",
				title: b(t).detail || void 0
			}, [b(t).kind === "processing" ? (Y(), X("i", Ao)) : Q("", !0), Z("span", null, z(b(t).label), 1)], 10, ko)) : Q("", !0),
			Z("div", jo, [Z("div", {
				class: "rendered-items",
				style: N(M(t))
			}, [(Y(!0), X(J, null, tr(u(t), (r) => (Y(), X("article", {
				key: r.itemKey,
				class: F(["rendered-item", [`rendered-item--${r.fieldKind || "text"}`, {
					"is-editable": e.editable && !r.isLocked,
					"is-selected": e.editable && (e.selectedItemKey === m(t, r) || e.selectedItemKeys.includes(m(t, r))),
					"is-free-positioned": !0
				}]]),
				"data-item-key": r.itemKey,
				"data-style-key": m(t, r),
				style: N(oe(t, r)),
				onClick: ao((e) => P(t, r, e), ["stop"]),
				onPointerdown: (e) => se(e, t, r),
				onDblclick: (e) => I(e, t, r)
			}, [a(r).length > 1 ? (Y(), X("div", No, [(Y(!0), X(J, null, tr(a(r), (i) => (Y(), X(J, { key: i.fieldKey }, [i.fieldKind === "cta" ? (Y(), X("a", {
				key: 0,
				class: "rendered-cta rendered-component-field",
				href: f(o(t, r, i)),
				target: o(t, r, i)?.target || "_self",
				rel: o(t, r, i)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, z(o(t, r, i)?.label || i.name), 9, Po)) : i.fieldKind === "image" ? (Y(), X("div", Fo, [Z("div", {
				class: "rendered-image-frame rendered-component-image-frame",
				style: N(D(t, r, i)),
				role: te(t, r, i).role,
				"aria-label": te(t, r, i).label,
				"aria-hidden": te(t, r, i).ariaHidden,
				"aria-busy": b(t, r, i)?.kind === "processing" ? "true" : void 0
			}, [s(o(t, r, i)) ? Q("", !0) : (Y(), X("div", Lo, [Z("span", null, z(i.name), 1), n[0] ||= Z("small", null, "이미지 준비 중", -1)]))], 12, Io), e.editable && b(t, r, i) ? (Y(), X("div", {
				key: 0,
				class: F(["item-ai-state", `is-${b(t, r, i).kind}`]),
				role: "status",
				"aria-live": "polite"
			}, [b(t, r, i).kind === "processing" ? (Y(), X("i", Ro)) : Q("", !0), Z("span", null, z(b(t, r, i).label), 1)], 2)) : Q("", !0)])) : p(o(t, r, i)) ? (Y(), X("p", zo, z(o(t, r, i)), 1)) : (Y(), X("p", Bo, z(i.name), 1))], 64))), 128))])) : r.fieldKind === "cta" ? (Y(), X("a", {
				key: 1,
				class: "rendered-cta",
				href: f(o(t, r)),
				target: o(t, r)?.target || "_self",
				rel: o(t, r)?.target === "_blank" ? "noopener noreferrer" : void 0
			}, z(o(t, r)?.label || r.name), 9, Vo)) : r.fieldKind === "image" ? (Y(), X(J, { key: 2 }, [
				Z("div", {
					class: F(["rendered-image-frame", `rendered-image-frame--${h(t, r).shape || "square"}`]),
					style: N(E(t, r)),
					role: O(t, r).role,
					"aria-label": O(t, r).label,
					"aria-hidden": O(t, r).ariaHidden,
					"aria-busy": b(t, r)?.kind === "processing" ? "true" : void 0
				}, [s(o(t, r)) ? Q("", !0) : (Y(), X("div", Uo, [Z("span", null, z(r.name), 1), Z("small", null, z(o(t, r)?.value || "이미지 준비 중"), 1)]))], 14, Ho),
				e.editable && b(t, r) ? (Y(), X("div", {
					key: 0,
					class: F(["item-ai-state", `is-${b(t, r).kind}`]),
					role: "status",
					"aria-live": "polite",
					title: b(t, r).detail || void 0
				}, [b(t, r).kind === "processing" ? (Y(), X("i", Go)) : Q("", !0), Z("span", null, z(b(t, r).label), 1)], 10, Wo)) : Q("", !0),
				e.editable && e.showGuides && !r.isLocked && e.selectedItemKey === m(t, r) ? (Y(!0), X(J, { key: 1 }, tr(x(t, r), (e) => (Y(), X("button", {
					key: e,
					type: "button",
					class: F(["item-resize-handle image-resize-handle", [`item-resize-handle--${e}`, `image-resize-handle--${e}`]]),
					"aria-label": `${r.name} 이미지 ${e} 방향 크기 조절`,
					onPointerdown: ao((n) => ce(n, t, r, e), ["stop"]),
					onKeydown: (n) => le(n, t, r, e)
				}, null, 42, Ko))), 128)) : Q("", !0)
			], 64)) : (Y(), X(J, { key: 3 }, [p(o(t, r)) ? (Y(), X("p", qo, z(o(t, r)), 1)) : (Y(), X("p", Jo, z(r.name), 1))], 64)), e.editable && e.showGuides && !r.isLocked && r.fieldKind !== "image" && e.selectedItemKey === m(t, r) ? (Y(!0), X(J, { key: 4 }, tr(x(t, r), (e) => (Y(), X("button", {
				key: e,
				type: "button",
				class: F(["item-resize-handle component-resize-handle", [`item-resize-handle--${e}`, `component-resize-handle--${e}`]]),
				"aria-label": `${r.name} ${e} 방향 크기 조절`,
				onPointerdown: ao((n) => ce(n, t, r, e), ["stop"]),
				onKeydown: (n) => le(n, t, r, e)
			}, null, 42, Yo))), 128)) : Q("", !0)], 46, Mo))), 128))], 4)]),
			e.editable && e.showGuides ? (Y(), X("button", {
				key: 1,
				class: "section-resize-handle",
				type: "button",
				"aria-label": `${t.name} 섹션 높이 조절`,
				title: `${t.name} 섹션 높이 조절`,
				onPointerdown: (e) => L(e, t)
			}, null, 40, Xo)) : Q("", !0)
		], 14, Oo))), 128))], 6));
	}
}, Qo = {
	class: "section-properties",
	"aria-label": "섹션 속성"
}, $o = { class: "section-properties__heading" }, es = {
	key: 0,
	class: "section-ai-actions"
}, ts = ["disabled"], ns = ["disabled", "title"], rs = {
	key: 1,
	class: "section-background-alignment"
}, is = {
	role: "group",
	"aria-label": "배경 이미지 가로 정렬"
}, as = ["onClick"], os = {
	key: 2,
	class: "section-background-fade"
}, ss = ["value"], cs = { key: 0 }, ls = ["value"], us = { class: "section-size-control" }, ds = ["disabled"], fs = {
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
		return (t, n) => (Y(), X("section", Qo, [
			Z("div", $o, [n[6] ||= Z("strong", null, "섹션 속성", -1), Z("small", null, z(e.section.name), 1)]),
			e.canRunSectionAi ? (Y(), X("div", es, [
				e.section.aiDesign?.enabled === !1 ? Q("", !0) : (Y(), X("button", {
					key: 0,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					onClick: n[0] ||= (e) => t.$emit("ai-action", "generate-layout", "", "layout")
				}, "AI 레이아웃 제안", 8, ts)),
				e.section.aiDesign?.enabled !== !1 && e.section.aiDesign?.allowSectionBackground !== !1 ? (Y(), X("button", {
					key: 1,
					type: "button",
					class: "section-ai-action",
					disabled: e.primaryAction.disabled,
					title: e.primaryAction.disabled && !e.aiProcessing ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
					onClick: n[1] ||= (n) => t.$emit("ai-action", e.primaryAction.action, "", "section-background")
				}, z(e.primaryAction.label), 9, ns)) : Q("", !0),
				e.hasAiBackground ? (Y(), X("button", {
					key: 2,
					type: "button",
					class: "section-ai-remove",
					onClick: n[2] ||= (e) => t.$emit("ai-action", "remove-background")
				}, "배경 삭제")) : Q("", !0)
			])) : Q("", !0),
			e.hasAiBackground ? (Y(), X("div", rs, [n[7] ||= Z("span", null, "배경 이미지 정렬", -1), Z("div", is, [(Y(), X(J, null, tr([
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
			], (n) => Z("button", {
				key: n.value,
				type: "button",
				class: F({ active: (e.sectionStyle.backgroundPosition || "center center") === `${n.value} center` }),
				onClick: (e) => t.$emit("background-alignment", n.value)
			}, z(n.label), 11, as)), 64))])])) : Q("", !0),
			e.hasAiBackground || e.section.aiDesign?.enabled !== !1 ? (Y(), X("div", os, [Z("label", null, [n[9] ||= Z("span", null, "배경 이미지 페이드", -1), Z("select", {
				value: e.sectionStyle.backgroundFadeMode || "none",
				onChange: n[3] ||= (e) => t.$emit("background-fade", e.target.value)
			}, [...n[8] ||= [
				Z("option", { value: "none" }, "페이드 없음", -1),
				Z("option", { value: "left" }, "왼쪽 페이드", -1),
				Z("option", { value: "right" }, "오른쪽 페이드", -1),
				Z("option", { value: "both" }, "양끝 페이드", -1)
			]], 40, ss)]), (e.sectionStyle.backgroundFadeMode || "none") === "none" ? Q("", !0) : (Y(), X("label", cs, [n[11] ||= Z("span", null, "페이드 강도", -1), Z("select", {
				value: e.sectionStyle.backgroundFadeStrength || "medium",
				onChange: n[4] ||= (e) => t.$emit("update-style", { backgroundFadeStrength: e.target.value })
			}, [...n[10] ||= [
				Z("option", { value: "soft" }, "약하게", -1),
				Z("option", { value: "medium" }, "보통", -1),
				Z("option", { value: "strong" }, "강하게", -1)
			]], 40, ls)]))])) : Q("", !0),
			Z("div", us, [Z("div", null, [n[12] ||= Z("span", null, "섹션 높이", -1), Z("strong", null, z(e.sectionStyle.minHeight ? `${Math.round(e.sectionStyle.minHeight)}px` : "자동"), 1)]), Z("button", {
				type: "button",
				disabled: !e.sectionStyle.minHeight,
				onClick: n[5] ||= (e) => t.$emit("reset-height")
			}, " 높이 초기화 ", 8, ds)])
		]));
	}
};
//#endregion
//#region visual-editor/src/editor-context.mjs
function ps(e = "editor", t = "") {
	let n = e === "admin-layout", r = e === "wizard-layout", i = r && t === "create-promo", a = n || i;
	return Object.freeze({
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
			canRunMultiLayoutAi: i,
			canSaveTemplateLayout: n,
			canSavePromoOverrides: i,
			canOpenWebOutput: !n,
			showsTemplateStatus: a,
			isEmbedded: i
		})
	});
}
//#endregion
//#region visual-editor/src/layout-utils.mjs
function ms(e) {
	return JSON.parse(JSON.stringify(e));
}
function hs(e = {}, t = {}) {
	let n = { ...e };
	return Object.entries(t || {}).forEach(([e, t]) => {
		t !== void 0 && (t && typeof t == "object" && !Array.isArray(t) && n[e] && typeof n[e] == "object" && !Array.isArray(n[e]) ? n[e] = hs(n[e], t) : n[e] = ms(t));
	}), n;
}
function gs(e = {}) {
	return _s(go, e);
}
function _s(e = go, t = {}) {
	let n = hs(ms(e || go), t || {});
	return n.contractVersion = Number(n.contractVersion || 1), n.specKey = String(n.specKey || "default"), n.theme = n.theme || {}, delete n.theme.backgroundImage, delete n.theme.backgroundImageName, n.responsive = n.responsive || {}, n.itemStyles = n.itemStyles || {}, Object.values(n.itemStyles).forEach((e) => {
		e && typeof e == "object" && delete e.textAlign;
	}), n.sectionStyles = n.sectionStyles || {}, n;
}
function vs(e = {}) {
	let t = gs(e), n = [], r = /* @__PURE__ */ new Set(["contain"]), i = /* @__PURE__ */ new Set([
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
var ys = Object.freeze([
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
]), bs = Object.freeze({
	"space-2": 8,
	"space-3": 12,
	"space-4": 16,
	"space-6": 24,
	"space-8": 32
});
function xs(e) {
	return Math.round(Number(e) * 1e3) / 1e3;
}
function Ss(e) {
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
function Cs(e) {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((n, r) => {
		e.slice(r + 1).forEach((e) => {
			let r = n.xPct < e.xPct + e.widthPct && n.xPct + n.widthPct > e.xPct, i = n.yPx < e.yPx + e.heightPx && n.yPx + n.heightPx > e.yPx;
			r && i && t.add([n.itemKey, e.itemKey].sort().join("|"));
		});
	}), t;
}
function ws(e, t) {
	e.forEach((e) => {
		if (e.xPct < -.001 || e.yPx < -.001 || e.widthPct < .01 || e.widthPct > 100 || e.heightPx < 1 || e.heightPx > 900 || e.xPct + e.widthPct > 100.001 || e.yPx + e.heightPx > t + .001) throw Error(`${e.itemKey} 결과가 섹션 경계를 벗어납니다.`);
	});
}
function Ts(e, t) {
	return [...e].sort((e, n) => t === "horizontal" ? e.xPct - n.xPct : e.yPx - n.yPx);
}
function Es(e, t, n = {}) {
	let r = Ss(e).map((e) => ({ ...e })), i = String(t?.operation || "");
	if (!ys.includes(i)) throw Error("허용되지 않은 레이아웃 명령입니다.");
	if ([...Array.isArray(t?.targetItemKeys) ? t.targetItemKeys.map(String) : []].sort().join("\n") !== r.map((e) => e.itemKey).sort().join("\n")) throw Error("레이아웃 명령의 대상이 현재 선택과 일치하지 않습니다.");
	let a = Math.max(1, Number(n.canvasWidthPx || 1280)), o = Math.max(80, Number(n.canvasHeightPx || 900)), s = bs[t?.gapToken || "space-4"];
	if (s === void 0) throw Error("허용되지 않은 gap token입니다.");
	let c = Cs(r), l = Math.min(...r.map((e) => e.xPct)), u = Math.max(...r.map((e) => e.xPct + e.widthPct)), d = Math.min(...r.map((e) => e.yPx)), f = Math.max(...r.map((e) => e.yPx + e.heightPx));
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
		let e = Ts(r, "horizontal"), t = u - l - e.reduce((e, t) => e + t.widthPct, 0);
		if (t < 0) throw Error("가로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = l;
		e.forEach((e) => {
			e.xPct = i, i += e.widthPct + n;
		});
	}
	if (i === "distribute-vertical") {
		let e = Ts(r, "vertical"), t = f - d - e.reduce((e, t) => e + t.heightPx, 0);
		if (t < 0) throw Error("세로 균등 배치를 적용할 공간이 부족합니다.");
		let n = t / (e.length - 1), i = d;
		e.forEach((e) => {
			e.yPx = i, i += e.heightPx + n;
		});
	}
	if (i === "set-gap" || i === "group-stack-horizontal" || i === "group-stack-vertical") {
		let e = i === "group-stack-horizontal" ? "horizontal" : i === "group-stack-vertical" ? "vertical" : t?.axis;
		if (!["horizontal", "vertical"].includes(e)) throw Error("간격 적용 방향이 필요합니다.");
		let n = Ts(r, e), o = e === "horizontal" ? l : d;
		n.forEach((t) => {
			e === "horizontal" ? (t.xPct = o, o += t.widthPct + s / a * 100) : (t.yPx = o, o += t.heightPx + s);
		});
	}
	r.forEach((e) => {
		e.xPct = xs(e.xPct), e.yPx = xs(e.yPx), e.widthPct = xs(e.widthPct), e.heightPx = xs(e.heightPx);
	}), ws(r, o);
	let p = [...Cs(r)].find((e) => !c.has(e));
	if (p) throw Error(`레이아웃 결과에 새 충돌이 발생했습니다: ${p}`);
	return r;
}
function Ds(e) {
	return Object.fromEntries(Ss(e).map((e) => [e.itemKey, {
		positionMode: "free",
		xPct: xs(e.xPct),
		yPx: xs(e.yPx),
		widthPct: xs(e.widthPct),
		heightPx: xs(e.heightPx)
	}]));
}
function Os(e, t, n = {}) {
	try {
		return {
			geometry: Es(e, t, n),
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
					geometry: Es(e, o, n),
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
var ks = {
	key: 0,
	class: "output-shell"
}, As = { class: "output-toolbar" }, js = {
	key: 0,
	class: "system-message system-message--error"
}, Ms = ["data-shell-frame"], Ns = {
	key: 0,
	class: "shell-sidebar",
	id: "visual-editor-global-navigation",
	"data-shell-sidebar": "",
	"aria-label": "전역 내비게이션"
}, Ps = {
	class: "shell-nav shell-nav--vertical",
	"aria-label": "프로토타입 내비게이션"
}, Fs = [
	"href",
	"aria-current",
	"aria-label",
	"title"
], Is = ["data-lucide"], Ls = { "data-shell-nav-label": "" }, Rs = {
	key: 0,
	class: "shell-utility-bar editor-shell-header"
}, zs = { class: "shell-page-identity" }, Bs = { class: "shell-page-actions" }, Vs = {
	class: "shell-status",
	role: "status"
}, Hs = {
	key: 0,
	class: "editor-header editor-toolbar"
}, Us = {
	key: 0,
	class: "editor-mode-note"
}, Ws = { class: "editor-global-actions" }, Gs = {
	key: 0,
	class: "global-token-menu"
}, Ks = { class: "global-token-swatches" }, qs = [
	"title",
	"aria-label",
	"onClick"
], Js = {
	key: 1,
	"aria-label": "Visual Editor navigation"
}, Ys = ["disabled"], Xs = {
	key: 1,
	class: "system-message"
}, Zs = {
	key: 2,
	class: "system-message system-message--error"
}, Qs = {
	key: 3,
	class: "system-message system-message--error",
	role: "alert"
}, $s = {
	key: 4,
	class: "system-message",
	role: "status"
}, ec = {
	class: "section-rail",
	"aria-label": "콘텐츠 섹션"
}, tc = { class: "panel-heading" }, nc = { class: "section-list" }, rc = [
	"aria-expanded",
	"aria-controls",
	"onClick"
], ic = ["aria-label"], ac = {
	key: 0,
	d: "M5.8 10.2 8.6 13l5.8-6"
}, oc = {
	key: 1,
	d: "M10 5.5v6M10 14.5v.1"
}, sc = ["id"], cc = { class: "preview-panel" }, lc = { class: "preview-toolbar" }, uc = { class: "preview-title-group" }, dc = ["disabled"], fc = {
	key: 1,
	class: "preview-edit-hint"
}, pc = {
	key: 2,
	class: "auto-register-message",
	role: "status"
}, mc = { class: "preview-controls" }, hc = {
	key: 0,
	class: "global-token-menu"
}, gc = { class: "global-token-swatches" }, _c = [
	"title",
	"aria-label",
	"onClick"
], vc = {
	key: 1,
	class: "admin-layout-actions"
}, yc = ["disabled"], bc = ["disabled"], xc = ["disabled"], Sc = { class: "guide-toggle" }, Cc = {
	class: "viewport-control",
	"aria-label": "Preview viewport"
}, wc = { class: "property-panel" }, Tc = { class: "panel-heading" }, Ec = {
	key: 0,
	class: "property-form"
}, Dc = {
	key: 0,
	class: "multi-layout-panel"
}, Oc = { class: "multi-layout-panel__heading" }, kc = ["disabled"], Ac = { class: "multi-layout-panel__actions" }, jc = ["disabled"], Mc = ["disabled"], Nc = {
	key: 0,
	class: "multi-layout-error",
	role: "alert"
}, Pc = {
	key: 1,
	class: "multi-layout-preview"
}, Fc = {
	key: 0,
	class: "multi-layout-adjustment"
}, Ic = { key: 1 }, Lc = { class: "multi-layout-preview__comparison" }, Rc = { class: "multi-layout-panel__actions" }, zc = { class: "component-property-list" }, Bc = { class: "component-property-header" }, Vc = ["title"], Hc = [
	"checked",
	"disabled",
	"aria-label",
	"onChange"
], Uc = ["aria-expanded", "onClick"], Wc = { class: "component-property-body" }, Gc = {
	key: 0,
	class: "component-property-content"
}, Kc = {
	key: 0,
	class: "component-field-property-list"
}, qc = [
	"disabled",
	"value",
	"onInput"
], Jc = [
	"disabled",
	"value",
	"onInput"
], Yc = ["disabled", "onClick"], Xc = [
	"disabled",
	"value",
	"onChange"
], Zc = ["value"], Qc = [
	"disabled",
	"value",
	"onInput"
], $c = { key: 1 }, el = [
	"disabled",
	"value",
	"onInput"
], tl = ["onClick"], nl = { key: 2 }, rl = [
	"disabled",
	"rows",
	"value",
	"onInput"
], il = { key: 1 }, al = ["disabled", "value"], ol = { key: 2 }, sl = ["disabled", "value"], cl = ["disabled", "title"], ll = ["disabled", "value"], ul = ["value"], dl = ["disabled", "value"], fl = { key: 1 }, pl = ["disabled", "value"], ml = { key: 2 }, hl = ["disabled", "value"], gl = { key: 4 }, _l = ["disabled", "rows"], vl = { class: "item-meta" }, yl = { class: "design-controls" }, bl = { class: "design-controls__heading" }, xl = ["disabled"], Sl = {
	key: 0,
	class: "image-frame-controls"
}, Cl = { class: "image-resize-mode" }, wl = {
	role: "group",
	"aria-label": "이미지 크기 조절 방식"
}, Tl = ["disabled"], El = ["disabled"], Dl = { key: 0 }, Ol = { class: "range-field" }, kl = ["disabled", "value"], Al = ["disabled", "value"], jl = { key: 0 }, Ml = { class: "range-field" }, Nl = ["disabled", "value"], Pl = ["disabled", "value"], Fl = ["disabled", "value"], Il = ["disabled", "value"], Ll = ["disabled", "value"], Rl = { class: "toggle-field" }, zl = ["disabled", "checked"], Bl = { key: 1 }, Vl = ["disabled", "value"], Hl = {
	key: 1,
	class: "component-frame-controls"
}, Ul = { class: "range-field" }, Wl = ["disabled", "value"], Gl = ["disabled", "value"], Kl = { class: "range-field" }, ql = ["disabled", "value"], Jl = ["disabled", "value"], Yl = ["disabled", "value"], Xl = { class: "range-field" }, Zl = ["disabled", "value"], Ql = ["disabled", "value"], $l = { class: "position-status" }, eu = { key: 0 }, tu = { key: 1 }, nu = ["disabled"], ru = {
	key: 0,
	class: "component-property-empty"
}, iu = {
	key: 1,
	class: "shell-overlay",
	type: "button",
	"data-shell-overlay": "",
	"aria-label": "메뉴 닫기"
}, au = {
	__name: "App",
	props: { mode: {
		type: String,
		default: "editor"
	} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ q(t.mode !== "output"), r = /* @__PURE__ */ q(""), i = /* @__PURE__ */ q([]), a = /* @__PURE__ */ q(null), o = /* @__PURE__ */ q(""), s = /* @__PURE__ */ q([]), c = /* @__PURE__ */ q({}), l = /* @__PURE__ */ q(JSON.parse(JSON.stringify(go))), u = /* @__PURE__ */ q(""), d = /* @__PURE__ */ q(""), f = /* @__PURE__ */ q([]), p = /* @__PURE__ */ q(""), m = /* @__PURE__ */ q(null), h = /* @__PURE__ */ q("desktop"), g = /* @__PURE__ */ q(!0), _ = /* @__PURE__ */ q(""), v = /* @__PURE__ */ q(null), y = /* @__PURE__ */ q(1), b = /* @__PURE__ */ q(null), x = /* @__PURE__ */ q(null), S = /* @__PURE__ */ q(""), C = /* @__PURE__ */ q(!1), w = /* @__PURE__ */ q(""), T = /* @__PURE__ */ q(!1), E = /* @__PURE__ */ q(!1), ee = /* @__PURE__ */ q(""), D = /* @__PURE__ */ q({}), te = /* @__PURE__ */ q(!1), O = /* @__PURE__ */ q(""), k = /* @__PURE__ */ q(null), ne = /* @__PURE__ */ q([]), A = /* @__PURE__ */ q(0), re = !1, j = 0, ie = new URLSearchParams(window.location.search).get("source") || "", ae = $(() => ps(t.mode, ie)), M = $(() => ae.value.capabilities), oe = $(() => ae.value.isAdminLayout), P = $(() => ae.value.isWizardLayout), se = $(() => ae.value.isCreatePromo), ce = $(() => ae.value.isBuilderWorkspace), le = window.PromoShell?.navItems || [], I = $(() => s.value.find((e) => e.sectionKey === u.value) || s.value[0]), L = $(() => I.value?.items?.find((e) => e.itemKey === d.value) || null), R = $({
			get: () => c.value?.[I.value?.sectionKey]?.[L.value?.itemKey],
			set: (e) => Te(e)
		}), ue = $(() => a.value ? So({
			template: a.value,
			configRevision: o.value,
			sections: s.value,
			sectionInputs: c.value,
			designSpec: l.value
		}) : null), de = $(() => t.mode === "output" ? v.value : ue.value), fe = $(() => {
			if (!a.value) return "템플릿 없음";
			let e = oe.value ? a.value.status || "draft" : "active", t = String(a.value.id || "").slice(0, 8);
			return `${a.value.templateKey} · v${a.value.version || 1} · ${e} · layout r${y.value}${t ? ` · ${t}` : ""}`;
		});
		function pe(e, t, { preserveMulti: n = !1 } = {}) {
			if (!e) return;
			let r = u.value && u.value !== e.sectionKey;
			u.value = e.sectionKey, d.value = t?.itemKey || "", (!n || r) && (f.value = t?.itemKey ? [t.itemKey] : []);
		}
		function me(e, t) {
			return e && t ? `${e.sectionKey}.${t.itemKey}` : "";
		}
		async function B(e, t, n = {}) {
			if (n.additive && !t?.isLocked && u.value === e.sectionKey) {
				let n = new Set(f.value);
				n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], pe(e, t, { preserveMulti: !0 });
			} else pe(e, t);
			p.value = me(e, t), await rn();
		}
		function he(e) {
			if (!e || !m.value) return;
			let t = m.value.querySelector(`[data-section-key="${CSS.escape(e.sectionKey)}"]`);
			if (!t) return;
			let n = m.value.getBoundingClientRect(), r = t.getBoundingClientRect();
			m.value.scrollTo({
				top: Math.max(0, m.value.scrollTop + r.top - n.top),
				behavior: "smooth"
			});
		}
		async function ge(e) {
			e && (u.value = e.sectionKey, d.value = "", f.value = [], p.value = "", k.value = null, O.value = "", await rn(), he(e));
		}
		function V(e) {
			return !!(e?.itemKey && f.value.includes(e.itemKey));
		}
		function _e(e, t) {
			if (!e || !t || t.isLocked) return;
			u.value !== e.sectionKey && (f.value = []);
			let n = new Set(f.value);
			n.has(t.itemKey) ? n.delete(t.itemKey) : n.add(t.itemKey), f.value = [...n], pe(e, t, { preserveMulti: !0 }), p.value = me(e, t), k.value = null, O.value = "";
		}
		function ve() {
			f.value = L.value?.itemKey ? [L.value.itemKey] : [], k.value = null, O.value = "";
		}
		function ye(e) {
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
		function be(e) {
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
						heightPx: Math.max(1, o.height)
					};
				}),
				canvasWidthPx: n.width,
				canvasHeightPx: n.height
			};
		}
		async function xe() {
			if (!(!I.value || f.value.length < 2 || te.value)) {
				te.value = !0, O.value = "", k.value = null;
				try {
					let e = be(I.value), t = await fetch("/api/promo-multi-component-layout-plan", {
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
					let r = Os(e.geometry, n.suggestion, e);
					k.value = {
						...r.plan,
						requestedOperation: n.suggestion.operation,
						adjusted: r.adjusted,
						adjustmentReason: r.adjustmentReason,
						sectionKey: I.value.sectionKey,
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
		function Se() {
			let e = k.value;
			if (!e || e.sectionKey !== I.value?.sectionKey) return;
			let t = JSON.parse(JSON.stringify(l.value)), n = Ds(e.after), r = { ...l.value.itemStyles || {} };
			Object.entries(n).forEach(([t, n]) => {
				let i = `${e.sectionKey}.${t}`;
				r[i] = {
					...r[i] || {},
					...n
				};
			}), ne.value = [...ne.value.slice(-19), {
				designSpec: t,
				revision: A.value,
				label: ye(e.operation)
			}], l.value = {
				...l.value,
				itemStyles: r
			}, A.value += 1, k.value = null, O.value = "";
		}
		function Ce() {
			let e = ne.value.at(-1);
			e && (l.value = JSON.parse(JSON.stringify(e.designSpec)), A.value = e.revision, ne.value = ne.value.slice(0, -1), k.value = null, O.value = "");
		}
		function we(e, t) {
			let n = me(e, t);
			pe(e, t, { preserveMulti: f.value.includes(t.itemKey) }), p.value = p.value === n ? "" : n;
		}
		function Te(e) {
			!I.value || !L.value || (c.value = {
				...c.value,
				[I.value.sectionKey]: {
					...c.value[I.value.sectionKey],
					[L.value.itemKey]: e
				}
			});
		}
		function Ee(e, t) {
			Te({
				...R.value || {},
				[e]: t
			});
		}
		function De(e) {
			let t = Array.isArray(e?.fields) ? e.fields : [];
			return t.length ? t : [e];
		}
		function Oe(e, t) {
			let n = c.value?.[I.value?.sectionKey]?.[e?.itemKey];
			return De(e).length <= 1 ? n : n?.fields?.[t.fieldKey];
		}
		function ke(e, t, n) {
			if (!I.value || !e || !t || e.isLocked || t.isLocked) return;
			if (De(e).length <= 1) {
				Te(n);
				return;
			}
			let r = I.value.sectionKey, i = c.value?.[r]?.[e.itemKey] || {};
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
		function Ae(e, t, n, r) {
			ke(e, t, {
				...Oe(e, t) || {},
				[n]: r
			});
		}
		function je(e, t, n) {
			pe(e, t), !(t.fieldKind !== "text" || t.isLocked) && Te(n);
		}
		function Me(e, t) {
			let n = c.value?.[e.sectionKey]?.[t.itemKey];
			if (De(t).length > 1) {
				let e = De(t), r = e.filter((e) => e.isRequired || e.isLocked), i = (r.length ? r : e).map((e) => {
					let t = n?.fields?.[e.fieldKey];
					return e.fieldKind === "cta" ? !!(String(t?.label || "").trim() && String(t?.link || "").trim()) : e.fieldKind === "image" ? !!String(t?.value || "").trim() : !!String(t || "").trim();
				});
				return r.length ? i.every(Boolean) : i.some(Boolean);
			}
			return t.fieldKind === "cta" ? !!(String(n?.label || "").trim() && String(n?.link || "").trim()) : t.fieldKind === "image" ? !!String(n?.value || "").trim() : !!String(n || "").trim();
		}
		function Ne(e) {
			let t = e.items || [], n = t.filter((e) => e.isRequired || e.isLocked);
			return n.length ? n.every((t) => Me(e, t)) : t.some((t) => Me(e, t));
		}
		function Pe() {
			!se.value || E.value || (E.value = !0, ee.value = "", window.parent.postMessage({
				type: "create-promo-auto-register-request",
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin));
		}
		function Fe(e) {
			return D.value?.[e.sectionKey] || null;
		}
		function Ie(e) {
			let t = Fe(e);
			return t?.sourceInputs ? JSON.stringify(t.sourceInputs) !== JSON.stringify(c.value?.[e.sectionKey] || {}) : !1;
		}
		function Le(e) {
			return [
				"queued",
				"analyzing_content",
				"generating_layout",
				"validating_layout",
				"generating_assets",
				"validating_assets",
				"applying"
			].includes(Fe(e)?.status);
		}
		function Re(e) {
			let t = c.value?.[e.sectionKey] || {};
			return (e.items || []).some((e) => {
				if (e.isVisibleInWizard === !1) return !1;
				let n = t[e.itemKey];
				if (De(e).length > 1) return De(e).some((e) => {
					if (e.fieldKind === "image") return !1;
					let t = n?.fields?.[e.fieldKey], r = e.fieldKind === "cta" ? t?.label : t;
					return String(r || "").trim().length >= 2;
				});
				if (e.fieldKind === "image") return !1;
				let r = e.fieldKind === "cta" ? n?.label : n;
				return String(r || "").trim().length >= 2;
			});
		}
		function ze(e) {
			let t = Fe(e), n = t?.constraintsSnapshot?.imageTarget?.type === "section-background";
			return Le(e) ? {
				action: "generate",
				label: "AI 생성 중",
				disabled: !0
			} : n && t?.status === "ready" && !Ie(e) ? {
				action: "generate",
				label: "AI 적용 중",
				disabled: !0
			} : n && t?.status === "applied" ? {
				action: "generate",
				label: "AI 재생성",
				disabled: !Re(e)
			} : {
				action: "generate",
				label: "AI 디자인",
				disabled: !Re(e)
			};
		}
		function Be(e) {
			return Array.isArray(e?.aiDesign?.imageTargetItemKeys) ? e.aiDesign.imageTargetItemKeys : [];
		}
		function Ve(e, t, n = null) {
			let r = n || t;
			return !!(e?.aiDesign?.enabled !== !1 && r?.fieldKind === "image" && t?.isVisibleInWizard !== !1 && !t?.isLocked && !r?.isLocked && r?.image?.allowedSources?.includes("ai") && Be(e).includes(t.itemKey));
		}
		function He(e) {
			let t = Fe(e)?.constraintsSnapshot?.imageTarget;
			return t?.type === "item" ? t.itemKey : "";
		}
		function Ue(e, t, n = null) {
			let r = Fe(e), i = r?.constraintsSnapshot?.imageTarget, a = He(e) === t?.itemKey && (!n || i?.fieldKey === n.fieldKey);
			return Le(e) ? {
				action: "generate",
				label: "AI 이미지 생성 중",
				disabled: !0
			} : a && r?.status === "ready" && !Ie(e) ? {
				action: "generate",
				label: "AI 이미지 적용 중",
				disabled: !0
			} : a && r?.status === "applied" ? {
				action: "generate",
				label: "AI 이미지 재생성",
				disabled: !Re(e)
			} : {
				action: "generate",
				label: "AI 이미지 생성",
				disabled: !Re(e)
			};
		}
		function H(e, t, n = "", r = "", i = "") {
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
		function We(e) {
			return !!l.value?.sectionStyles?.[e.sectionKey]?.backgroundImage;
		}
		function Ge(e = null) {
			!I.value || !L.value || L.value.isLocked || e?.isLocked || window.confirm(`${e?.name || L.value.name} 이미지를 삭제할까요?`) && window.parent.postMessage({
				type: "create-promo-remove-image",
				sectionKey: I.value.sectionKey,
				itemKey: L.value.itemKey,
				fieldKey: e?.fieldKey || null
			}, window.location.origin);
		}
		function Ke(e) {
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
		let U = $(() => I.value && L.value ? `${I.value.sectionKey}.${L.value.itemKey}` : ""), W = $(() => l.value.itemStyles?.[U.value] || {}), qe = $(() => I.value && l.value.sectionStyles?.[I.value.sectionKey] || {});
		function G(e) {
			!U.value || L.value?.isLocked || (l.value = {
				...l.value,
				itemStyles: {
					...l.value.itemStyles || {},
					[U.value]: {
						...W.value,
						...e
					}
				}
			});
		}
		function Je(e, t, n) {
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
		function Ye() {
			if (!U.value || L.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} };
			delete e[U.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Xe() {
			if (!U.value || L.value?.isLocked) return;
			let e = { ...l.value.itemStyles || {} }, t = To(e[U.value]);
			Object.keys(t).length ? e[U.value] = t : delete e[U.value], l.value = {
				...l.value,
				itemStyles: e
			};
		}
		function Ze(e, t) {
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
		function Qe(e) {
			!I.value || ![
				"left",
				"center",
				"right"
			].includes(e) || Ze(I.value.sectionKey, { backgroundPosition: `${e} center` });
		}
		function $e(e) {
			!I.value || ![
				"none",
				"left",
				"right",
				"both"
			].includes(e) || Ze(I.value.sectionKey, {
				backgroundFadeMode: e,
				backgroundFadeStrength: qe.value.backgroundFadeStrength || "medium"
			});
		}
		function et(e) {
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
		function tt(e) {
			if (!U.value || L.value?.isLocked || !["locked", "free"].includes(e)) return;
			let t = { ...l.value.itemStyles || {} }, n = { ...W.value };
			e === "locked" || n.shape === "circle" ? (n.aspectRatioLocked = !0, n.aspectRatio = n.shape === "circle" ? "1/1" : n.aspectRatio || L.value?.image?.aspectRatio || "1/1", delete n.heightPx) : (n.aspectRatioLocked = !1, n.heightPx = Number(n.heightPx || 240)), t[U.value] = n, l.value = {
				...l.value,
				itemStyles: t
			};
		}
		function nt() {
			if (!I.value) return;
			let e = { ...l.value.sectionStyles || {} }, t = { ...e[I.value.sectionKey] || {} };
			delete t.minHeight, Object.keys(t).length ? e[I.value.sectionKey] = t : delete e[I.value.sectionKey], l.value = {
				...l.value,
				sectionStyles: e
			};
		}
		async function rt() {
			try {
				let e = await fetch("/api/wizard-form-templates-public"), t = await e.json();
				if (!e.ok) throw Error(t.message || t.error || "템플릿 목록을 불러오지 못했습니다.");
				i.value = t.templates || [];
				let n = i.value.find((e) => e.isDefault);
				if (!n) throw Error("활성화된 기본 Form Template이 없습니다.");
				let r = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(n.id)}`), l = await r.json();
				if (!r.ok) throw Error(l.message || l.error || "템플릿 구성을 불러오지 못했습니다.");
				a.value = l.template, o.value = l.configRevision || "", s.value = l.sections || [], c.value = bo(s.value), u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = me(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		function it() {
			if (!ue.value) return;
			_.value = "";
			let e = Eo(localStorage, mo, ue.value);
			if (!e.ok) {
				_.value = e.message;
				return;
			}
			window.open("/prototype/visual-output.html", "_blank", "noopener");
		}
		async function at() {
			let e = new URLSearchParams(window.location.search).get("templateId");
			if (!e) {
				r.value = "templateId가 필요합니다.", n.value = !1;
				return;
			}
			try {
				let t = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(e)}`), n = await t.json();
				if (!t.ok) throw Error(n.message || n.error || "기본 레이아웃을 불러오지 못했습니다.");
				a.value = n.template, s.value = n.sections || [], c.value = bo(s.value), l.value = gs(n.layout?.layoutSpec), y.value = Number(n.layout?.layoutRevision || 1), b.value = n.layout?.id || null, x.value = n.layoutIdentity || null, u.value = s.value[0]?.sectionKey || "", d.value = s.value[0]?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], p.value = me(s.value[0], s.value[0]?.items?.[0]);
			} catch (e) {
				r.value = e.message;
			} finally {
				n.value = !1;
			}
		}
		async function ot({ activate: e = !1 } = {}) {
			if (!a.value?.id || C.value) return;
			w.value = "";
			let t = vs(l.value);
			if (!t.ok) {
				w.value = `레이아웃 검증 실패: ${t.errors[0]?.path || "unknown"}`;
				return;
			}
			C.value = !0;
			try {
				let n = await fetch("/api/wizard-form-template-layout", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						templateId: a.value.id,
						expectedRevision: y.value,
						rendererKey: "default-promo-renderer",
						rendererVersion: 1,
						layoutSpec: t.spec,
						changeNote: S.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다."
					})
				}), r = await n.json().catch(() => ({}));
				if (!n.ok) throw Error(r.message || r.error || `레이아웃 저장 오류(${n.status})`);
				if (l.value = gs(r.layout.layoutSpec), y.value = Number(r.layout.layoutRevision || y.value + 1), b.value = r.layout.id || b.value, x.value = r.layoutIdentity || x.value, S.value = "", !e) {
					w.value = `초안 v${a.value.version || 1} · layout r${y.value} 저장 완료 · 프로모션 빌더 반영을 위해 템플릿을 활성화하세요.`;
					return;
				}
				let i = await fetch("/api/wizard-form-template-activate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: a.value.id,
						changeNote: "Admin Layout Editor에서 기본 레이아웃 저장 후 활성화했습니다."
					})
				}), o = await i.json().catch(() => ({}));
				if (!i.ok) throw Error(`초안 저장은 완료됐지만 활성화하지 못했습니다: ${o.message || o.error || i.status}`);
				if (Number(o.layoutIdentity?.layoutRevision || 0) !== y.value) throw Error("활성화 결과의 Layout revision이 방금 저장한 초안과 일치하지 않습니다.");
				a.value = {
					...a.value,
					...o.template || {},
					status: "active"
				}, x.value = o.layoutIdentity || x.value, w.value = `활성 v${a.value.version || 1} · layout r${y.value} 반영 완료 · 신규 프로모션 빌더에서 사용됩니다.`;
			} catch (e) {
				w.value = e.message;
			} finally {
				C.value = !1;
			}
		}
		async function st(e) {
			if (!e?.content) return;
			let t = Number(e.snapshotRevision || 0);
			if (t && t < j) return;
			t && (j = t);
			let i = I.value?.sectionKey || u.value, m = L.value?.itemKey || d.value, h = p.value;
			re = !0, a.value = e.content.formTemplate || null, o.value = e.content.formTemplate?.configRevision || "", s.value = e.content.sectionSnapshot || [], c.value = e.content.sectionInputs || {}, D.value = e.content.sectionDesignRuns || {}, l.value = gs(e.designSpec), y.value = Number(e.layoutRevision || 1), x.value = e.layoutIdentity || null;
			let g = s.value.find((e) => e.sectionKey === i) || s.value[0];
			u.value = g?.sectionKey || "", d.value = g?.items?.some((e) => e.itemKey === m) ? m : g?.items?.[0]?.itemKey || "", f.value = d.value ? [d.value] : [], k.value = null;
			let _ = me(g, g?.items?.find((e) => e.itemKey === d.value));
			p.value = s.value.some((e) => (e.items || []).some((t) => me(e, t) === h)) ? h : _, T.value = !0, n.value = !1, r.value = "", await rn(), re = !1;
		}
		function ct(e) {
			if (!(!P.value || e.origin !== window.location.origin)) {
				if (e.data?.type === "create-promo-auto-register-result") {
					E.value = !1;
					let t = Number(e.data.registeredCount || 0);
					ee.value = t ? `${t}개 항목을 자동 등록했습니다.` : "자동 등록할 빈 항목이 없습니다.";
					return;
				}
				e.data?.type === "promo-wizard-layout-snapshot" && st(e.data.snapshot);
			}
		}
		Cn([l, c], () => {
			!P.value || !T.value || re || window.parent.postMessage({
				type: "promo-wizard-layout-change",
				snapshotRevision: j,
				designSpec: JSON.parse(JSON.stringify(l.value)),
				sectionInputs: JSON.parse(JSON.stringify(c.value))
			}, window.location.origin);
		}, { deep: !0 });
		function lt() {
			try {
				let e = localStorage.getItem(mo);
				if (!e) throw Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
				v.value = JSON.parse(e);
			} catch (e) {
				r.value = e.message;
			}
		}
		return Gn(() => {
			se.value && (document.documentElement.classList.add("create-promo-editor-document"), document.body.classList.add("create-promo-editor-document")), window.PromoShell?.init(document), t.mode === "output" ? lt() : oe.value ? at() : P.value ? (n.value = !0, window.addEventListener("message", ct), window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin)) : rt();
		}), Jn(() => {
			window.removeEventListener("message", ct), document.documentElement.classList.remove("create-promo-editor-document"), document.body.classList.remove("create-promo-editor-document");
		}), (t, i) => e.mode === "output" ? (Y(), X("div", ks, [Z("header", As, [Z("div", null, [i[34] ||= Z("span", null, "WEB OUTPUT", -1), Z("strong", null, z(de.value?.content?.formTemplate?.name || "Visual Editor"), 1)]), i[35] ||= Z("a", { href: "/prototype/visual-editor.html" }, "Visual Editor로 돌아가기", -1)]), r.value ? (Y(), X("div", js, z(r.value), 1)) : de.value ? (Y(), wi(Zo, {
			key: 1,
			content: de.value.content,
			"design-spec": de.value.designSpec,
			assets: de.value.assets
		}, null, 8, [
			"content",
			"design-spec",
			"assets"
		])) : Q("", !0)])) : (Y(), X("main", {
			key: 1,
			class: F(["editor-shell", {
				"shell-frame": !P.value,
				"editor-shell--embedded": se.value
			}]),
			"data-shell-frame": P.value ? null : ""
		}, [
			P.value ? Q("", !0) : (Y(), X("aside", Ns, [
				i[36] ||= Pi("<button class=\"shell-sidebar__close\" type=\"button\" data-shell-sidebar-close aria-label=\"메뉴 닫기\">닫기</button><div class=\"shell-sidebar__brand\"><span class=\"shell-sidebar__brand-mark\" aria-hidden=\"true\"><i data-lucide=\"panels-top-left\"></i></span><span class=\"shell-sidebar__brand-copy\"><strong>PROMO WEB<br>BUILDER</strong><span>Workspace</span></span></div>", 2),
				i[37] ||= Z("div", {
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
				Z("nav", Ps, [(Y(!0), X(J, null, tr(Ft(le), (e) => (Y(), X("a", {
					key: e.key,
					href: e.href,
					class: F({ active: e.key === "visual-editor" }),
					"aria-current": e.key === "visual-editor" ? "page" : null,
					"aria-label": e.label,
					title: e.label
				}, [Z("i", {
					"data-lucide": e.icon,
					"aria-hidden": "true"
				}, null, 8, Is), Z("span", Ls, z(e.label), 1)], 10, Fs))), 128))]),
				i[38] ||= Z("div", { class: "shell-sidebar__footer" }, [Z("button", {
					class: "shell-theme-toggle",
					type: "button",
					"data-shell-theme-toggle": ""
				}, [Z("i", {
					"data-lucide": "sun-moon",
					"aria-hidden": "true"
				}), Z("strong", { "data-shell-theme-label": "" }, "Light")])], -1)
			])),
			Z("div", { class: F(P.value ? "editor-embedded-main" : "shell-main") }, [P.value ? Q("", !0) : (Y(), X("header", Rs, [Z("div", zs, [i[39] ||= Z("button", {
				class: "shell-menu-toggle",
				type: "button",
				"data-shell-menu-toggle": "",
				"aria-controls": "visual-editor-global-navigation",
				"aria-expanded": "false",
				"aria-label": "메뉴 열기"
			}, "메뉴", -1), Z("strong", null, z(oe.value ? "Admin Template Layout" : "Visual Editor"), 1)]), Z("div", Bs, [Z("div", Vs, z(oe.value ? `Layout revision ${y.value}` : "편집 준비"), 1)])])), Z("div", { class: F(["editor-content", {
				"shell-content": !P.value,
				"editor-content--embedded": se.value
			}]) }, [
				ce.value ? Q("", !0) : (Y(), X("header", Hs, [Z("div", null, [
					Z("span", null, z(oe.value ? "ADMIN TEMPLATE LAYOUT" : P.value ? "WIZARD LAYOUT" : "VISUAL EDITOR"), 1),
					Z("h2", null, z(a.value?.name || "Default Renderer"), 1),
					oe.value ? (Y(), X("small", Us, " v" + z(a.value?.version || 1) + " · " + z(a.value?.status || "draft") + " · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다. ", 1)) : Q("", !0)
				]), Z("div", Ws, [se.value ? Q("", !0) : (Y(), X("fieldset", Gs, [i[40] ||= Z("legend", null, "페이지 배경", -1), Z("div", Ks, [(Y(!0), X(J, null, tr(Ft(ho), (e) => (Y(), X("button", {
					key: e.key,
					type: "button",
					class: F({ active: l.value.theme.backgroundColor === e.value }),
					title: `${e.name} ${e.value}`,
					"aria-label": `${e.name} ${e.value}`,
					onClick: (t) => Ke(e)
				}, [Z("i", { style: N({ backgroundColor: e.value }) }, null, 4)], 10, qs))), 128))])])), oe.value ? (Y(), X("nav", Js, [_n(Z("input", {
					"onUpdate:modelValue": i[0] ||= (e) => S.value = e,
					type: "text",
					placeholder: "변경 사유",
					"aria-label": "레이아웃 변경 사유"
				}, null, 512), [[Qa, S.value]]), Z("button", {
					type: "button",
					disabled: !ue.value || C.value,
					onClick: ot
				}, z(C.value ? "저장 중" : "기본 레이아웃 저장"), 9, Ys)])) : Q("", !0)])])),
				n.value ? (Y(), X("div", Xs, "기본 Form Template을 불러오는 중입니다.")) : r.value ? (Y(), X("div", Zs, z(r.value), 1)) : Q("", !0),
				_.value ? (Y(), X("div", Qs, z(_.value), 1)) : Q("", !0),
				w.value ? (Y(), X("div", $s, z(w.value), 1)) : Q("", !0),
				!n.value && !r.value ? (Y(), X("section", {
					key: 5,
					class: F(["editor-workspace", {
						"is-builder-workspace": ce.value,
						"is-create-promo-wizard": se.value,
						"is-admin-layout-workspace": oe.value
					}])
				}, [
					Z("aside", ec, [Z("div", tc, [i[41] ||= Z("span", null, "SECTIONS", -1), Z("strong", null, z(s.value.length), 1)]), Z("div", nc, [(Y(!0), X(J, null, tr(s.value, (e) => (Y(), X("section", {
						key: e.sectionKey,
						class: F(["section-nav-item", { active: e.sectionKey === I.value?.sectionKey }])
					}, [Z("button", {
						type: "button",
						class: F(["section-trigger", { active: e.sectionKey === I.value?.sectionKey }]),
						"aria-expanded": e.sectionKey === I.value?.sectionKey,
						"aria-controls": `section-properties-${e.sectionKey}`,
						onClick: (t) => ge(e)
					}, [Z("span", null, z(e.name), 1), (Y(), X("svg", {
						class: F(["section-registration-icon", Ne(e) ? "is-complete" : "is-incomplete"]),
						viewBox: "0 0 20 20",
						role: "img",
						"aria-label": Ne(e) ? `${e.name} 콘텐츠 등록 완료` : `${e.name} 콘텐츠 등록 필요`
					}, [i[42] ||= Z("circle", {
						cx: "10",
						cy: "10",
						r: "9"
					}, null, -1), Ne(e) ? (Y(), X("path", ac)) : (Y(), X("path", oc))], 10, ic))], 10, rc), e.sectionKey === I.value?.sectionKey ? (Y(), X("div", {
						key: 0,
						id: `section-properties-${e.sectionKey}`,
						class: "section-property-accordion"
					}, [ki(fs, {
						section: e,
						"section-style": qe.value,
						"can-run-section-ai": M.value.canRunSectionAi,
						"primary-action": ze(e),
						"has-ai-background": We(e),
						"ai-processing": Le(e),
						onAiAction: (t, n, r) => H(e, t, n, r),
						onBackgroundAlignment: Qe,
						onBackgroundFade: $e,
						onUpdateStyle: (t) => Ze(e.sectionKey, t),
						onResetHeight: nt
					}, null, 8, [
						"section",
						"section-style",
						"can-run-section-ai",
						"primary-action",
						"has-ai-background",
						"ai-processing",
						"onAiAction",
						"onUpdateStyle"
					])], 8, sc)) : Q("", !0)], 2))), 128))])]),
					Z("section", cc, [Z("div", lc, [Z("div", uc, [
						i[43] ||= Z("strong", null, "Live Preview", -1),
						Z("small", null, z(fe.value), 1),
						M.value.canEditPromoContent ? (Y(), X("button", {
							key: 0,
							class: "auto-register-action",
							type: "button",
							disabled: E.value,
							onClick: Pe
						}, z(E.value ? "등록 중" : "자동등록"), 9, dc)) : Q("", !0),
						M.value.canEditPromoContent ? (Y(), X("small", fc, "미리보기 요소를 선택해 내용을 입력하세요.")) : Q("", !0),
						ee.value ? (Y(), X("small", pc, z(ee.value), 1)) : Q("", !0)
					]), Z("div", mc, [
						M.value.canEditTemplateDefaults ? (Y(), X("fieldset", hc, [i[44] ||= Z("legend", null, "페이지 배경", -1), Z("div", gc, [(Y(!0), X(J, null, tr(Ft(ho), (e) => (Y(), X("button", {
							key: e.key,
							type: "button",
							class: F({ active: l.value.theme.backgroundColor === e.value }),
							title: `${e.name} ${e.value}`,
							"aria-label": `${e.name} ${e.value}`,
							onClick: (t) => Ke(e)
						}, [Z("i", { style: N({ backgroundColor: e.value }) }, null, 4)], 10, _c))), 128))])])) : Q("", !0),
						M.value.canSaveTemplateLayout ? (Y(), X("div", vc, [
							_n(Z("input", {
								"onUpdate:modelValue": i[1] ||= (e) => S.value = e,
								type: "text",
								placeholder: "변경 사유",
								"aria-label": "레이아웃 변경 사유"
							}, null, 512), [[Qa, S.value]]),
							Z("button", {
								type: "button",
								disabled: !ue.value || C.value || a.value.status !== "draft",
								onClick: i[2] ||= (e) => ot()
							}, z(C.value ? "저장 중" : "초안 저장"), 9, yc),
							Z("button", {
								type: "button",
								class: "is-primary",
								disabled: !ue.value || C.value || a.value.status !== "draft",
								onClick: i[3] ||= (e) => ot({ activate: !0 })
							}, "저장 후 활성화", 8, bc)
						])) : Q("", !0),
						M.value.canOpenWebOutput ? (Y(), X("button", {
							key: 2,
							type: "button",
							class: "web-output-action",
							disabled: !ue.value,
							onClick: it
						}, "Web Output", 8, xc)) : Q("", !0),
						Z("label", Sc, [
							_n(Z("input", {
								"onUpdate:modelValue": i[4] ||= (e) => g.value = e,
								type: "checkbox"
							}, null, 512), [[$a, g.value]]),
							i[45] ||= Z("span", null, "Guides", -1),
							Z("strong", null, z(g.value ? "ON" : "OFF"), 1)
						]),
						Z("div", Cc, [Z("button", {
							type: "button",
							class: F({ active: h.value === "desktop" }),
							onClick: i[5] ||= (e) => h.value = "desktop"
						}, "Desktop", 2), Z("button", {
							type: "button",
							class: F({ active: h.value === "mobile" }),
							onClick: i[6] ||= (e) => h.value = "mobile"
						}, "Mobile", 2)])
					])]), Z("div", {
						ref_key: "previewStageRef",
						ref: m,
						class: F(["preview-stage", `preview-stage--${h.value}`])
					}, [de.value ? (Y(), wi(Zo, {
						key: 0,
						content: de.value.content,
						"design-spec": de.value.designSpec,
						assets: de.value.assets,
						"section-design-runs": D.value,
						editable: "",
						"show-guides": g.value,
						"selected-item-key": U.value,
						"selected-item-keys": f.value.map((e) => `${I.value?.sectionKey}.${e}`),
						onSelectItem: B,
						onUpdateItemStyle: G,
						onUpdateRendererItemStyle: Je,
						onUpdateItemContent: je,
						onUpdateSectionStyle: Ze
					}, null, 8, [
						"content",
						"design-spec",
						"assets",
						"section-design-runs",
						"show-guides",
						"selected-item-key",
						"selected-item-keys"
					])) : Q("", !0)], 2)]),
					Z("aside", wc, [Z("div", Tc, [i[46] ||= Z("span", null, "COMPONENTS", -1), Z("strong", null, z(I.value?.name || "섹션 선택"), 1)]), I.value ? (Y(), X("div", Ec, [M.value.canRunMultiLayoutAi ? (Y(), X("section", Dc, [
						Z("div", Oc, [Z("div", null, [i[47] ||= Z("strong", null, "AI 다중 정렬", -1), Z("small", null, z(f.value.length) + "개 컴포넌트 선택 · revision " + z(A.value), 1)]), Z("button", {
							type: "button",
							disabled: f.value.length <= 1,
							onClick: ve
						}, "선택 초기화", 8, kc)]),
						i[48] ||= Z("p", null, "아래 체크박스 또는 Ctrl/Cmd+미리보기 클릭으로 같은 섹션의 컴포넌트를 2개 이상 선택하세요.", -1),
						Z("div", Ac, [Z("button", {
							type: "button",
							class: "section-ai-action",
							disabled: f.value.length < 2 || te.value,
							onClick: xe
						}, z(te.value ? "AI 제안 생성 중" : "AI 정렬 제안"), 9, jc), Z("button", {
							type: "button",
							disabled: !ne.value.length,
							onClick: Ce
						}, "마지막 적용 취소", 8, Mc)]),
						O.value ? (Y(), X("p", Nc, z(O.value), 1)) : Q("", !0),
						k.value ? (Y(), X("div", Pc, [
							Z("strong", null, z(ye(k.value.operation)), 1),
							Z("span", null, z(k.value.rationale), 1),
							k.value.adjusted ? (Y(), X("span", Fc, z(k.value.adjustmentReason), 1)) : Q("", !0),
							k.value.gapToken ? (Y(), X("small", Ic, "간격: " + z(k.value.gapToken), 1)) : Q("", !0),
							Z("div", Lc, [(Y(!0), X(J, null, tr(k.value.before, (e) => (Y(), X("div", { key: e.itemKey }, [
								Z("b", null, z(e.itemKey), 1),
								Z("span", null, "전 X " + z(Math.round(e.xPct)) + "% · Y " + z(Math.round(e.yPx)) + "px", 1),
								Z("span", null, "후 X " + z(Math.round(k.value.after.find((t) => t.itemKey === e.itemKey)?.xPct || 0)) + "% · Y " + z(Math.round(k.value.after.find((t) => t.itemKey === e.itemKey)?.yPx || 0)) + "px", 1)
							]))), 128))]),
							Z("div", Rc, [Z("button", {
								type: "button",
								class: "section-ai-action",
								onClick: Se
							}, "제안 적용"), Z("button", {
								type: "button",
								onClick: i[7] ||= (e) => k.value = null
							}, "취소")])
						])) : Q("", !0)
					])) : Q("", !0), Z("div", zc, [(Y(!0), X(J, null, tr(I.value.items || [], (e) => (Y(), X("section", {
						key: e.itemKey,
						class: F(["component-property-accordion", { open: p.value === me(I.value, e) }])
					}, [Z("div", Bc, [M.value.canRunMultiLayoutAi ? (Y(), X("label", {
						key: 0,
						class: "component-multi-select",
						title: e.isLocked ? "잠긴 컴포넌트는 다중 정렬할 수 없습니다." : "다중 정렬 대상 선택"
					}, [Z("input", {
						type: "checkbox",
						checked: V(e),
						disabled: e.isLocked,
						"aria-label": `${e.name} 다중 정렬 대상 선택`,
						onChange: (t) => _e(I.value, e)
					}, null, 40, Hc)], 8, Vc)) : Q("", !0), Z("button", {
						type: "button",
						class: "component-property-trigger",
						"aria-expanded": p.value === me(I.value, e),
						onClick: (t) => we(I.value, e)
					}, [
						Z("span", null, z(e.name), 1),
						Z("small", null, z(e.fieldKind), 1),
						i[49] ||= Z("i", { "aria-hidden": "true" }, null, -1)
					], 8, Uc)]), Z("div", Wc, [Z("div", null, [L.value && L.value.itemKey === e.itemKey ? (Y(), X("div", Gc, [
						De(L.value).length > 1 ? (Y(), X("div", Kc, [(Y(!0), X(J, null, tr(De(L.value), (e) => (Y(), X("section", {
							key: e.fieldKey,
							class: "component-field-property"
						}, [Z("header", null, [Z("strong", null, z(e.name), 1), Z("small", null, z(e.fieldKind) + " · " + z(e.fieldKey), 1)]), e.fieldKind === "cta" ? (Y(), X(J, { key: 0 }, [Z("label", null, [i[50] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
							disabled: L.value.isLocked || e.isLocked,
							value: Oe(L.value, e)?.label,
							onInput: (t) => Ae(L.value, e, "label", t.target.value)
						}, null, 40, qc)]), Z("label", null, [i[51] ||= Z("span", null, "버튼 URL", -1), Z("input", {
							disabled: L.value.isLocked || e.isLocked,
							type: "url",
							value: Oe(L.value, e)?.link,
							onInput: (t) => Ae(L.value, e, "link", t.target.value)
						}, null, 40, Jc)])], 64)) : e.fieldKind === "image" ? (Y(), X(J, { key: 1 }, [
							M.value.canRunComponentImageAi && Ve(I.value, L.value, e) ? (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action item-ai-generation-action",
								disabled: Ue(I.value, L.value, e).disabled,
								onClick: (t) => H(I.value, "generate", L.value.itemKey, "item", e.fieldKey)
							}, z(Ue(I.value, L.value, e).label), 9, Yc)) : Q("", !0),
							Z("label", null, [i[52] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
								disabled: L.value.isLocked || e.isLocked,
								value: Oe(L.value, e)?.source,
								onChange: (t) => Ae(L.value, e, "source", t.target.value)
							}, [(Y(!0), X(J, null, tr(e.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, z(e), 9, Zc))), 128))], 40, Xc)]),
							Z("label", null, [i[53] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
								disabled: L.value.isLocked || e.isLocked,
								rows: "4",
								value: Oe(L.value, e)?.value,
								onInput: (t) => Ae(L.value, e, "value", t.target.value)
							}, null, 40, Qc)]),
							e.image?.altTextRequired ? (Y(), X("label", $c, [i[54] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
								disabled: L.value.isLocked || e.isLocked,
								value: Oe(L.value, e)?.alt,
								onInput: (t) => Ae(L.value, e, "alt", t.target.value)
							}, null, 40, el)])) : Q("", !0),
							!L.value.isLocked && !e.isLocked && Oe(L.value, e)?.value ? (Y(), X("button", {
								key: 2,
								type: "button",
								class: "image-remove-action",
								onClick: (t) => Ge(e)
							}, "이미지 삭제", 8, tl)) : Q("", !0)
						], 64)) : (Y(), X("label", nl, [Z("span", null, z(e.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), Z("textarea", {
							disabled: L.value.isLocked || e.isLocked,
							rows: e.textType === "multi" ? 8 : 3,
							value: Oe(L.value, e),
							onInput: (t) => ke(L.value, e, t.target.value),
							placeholder: "Enter 키로 줄바꿈할 수 있습니다."
						}, null, 40, rl)]))]))), 128))])) : Q("", !0),
						De(L.value).length <= 1 && L.value.fieldKind === "cta" ? (Y(), X("label", il, [i[55] ||= Z("span", null, "버튼 텍스트", -1), Z("input", {
							disabled: L.value.isLocked,
							value: R.value?.label,
							onInput: i[8] ||= (e) => Ee("label", e.target.value)
						}, null, 40, al)])) : Q("", !0),
						De(L.value).length <= 1 && L.value.fieldKind === "cta" ? (Y(), X("label", ol, [i[56] ||= Z("span", null, "버튼 URL", -1), Z("input", {
							disabled: L.value.isLocked,
							type: "url",
							value: R.value?.link,
							onInput: i[9] ||= (e) => Ee("link", e.target.value)
						}, null, 40, sl)])) : De(L.value).length <= 1 && L.value.fieldKind === "image" ? (Y(), X(J, { key: 3 }, [
							M.value.canRunComponentImageAi && Ve(I.value, L.value) ? (Y(), X("button", {
								key: 0,
								type: "button",
								class: "section-ai-action item-ai-generation-action",
								disabled: Ue(I.value, L.value).disabled,
								title: Ue(I.value, L.value).disabled && !Le(I.value) ? "섹션 콘텐츠를 먼저 등록해 주세요." : "",
								onClick: i[10] ||= (e) => H(I.value, Ue(I.value, L.value).action, L.value.itemKey)
							}, z(Ue(I.value, L.value).label), 9, cl)) : Q("", !0),
							Z("label", null, [i[57] ||= Z("span", null, "이미지 입력 방식", -1), Z("select", {
								disabled: L.value.isLocked,
								value: R.value?.source,
								onChange: i[11] ||= (e) => Ee("source", e.target.value)
							}, [(Y(!0), X(J, null, tr(L.value.image?.allowedSources || ["url"], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, z(e), 9, ul))), 128))], 40, ll)]),
							Z("label", null, [i[58] ||= Z("span", null, "URL 또는 이미지 설명", -1), Z("textarea", {
								disabled: L.value.isLocked,
								rows: "4",
								value: R.value?.value,
								onInput: i[12] ||= (e) => Ee("value", e.target.value)
							}, null, 40, dl)]),
							L.value.image?.descriptionEnabled ? (Y(), X("label", fl, [i[59] ||= Z("span", null, "설명", -1), Z("textarea", {
								disabled: L.value.isLocked,
								rows: "3",
								value: R.value?.description,
								onInput: i[13] ||= (e) => Ee("description", e.target.value)
							}, null, 40, pl)])) : Q("", !0),
							L.value.image?.altTextRequired ? (Y(), X("label", ml, [i[60] ||= Z("span", null, "대체 텍스트", -1), Z("input", {
								disabled: L.value.isLocked,
								value: R.value?.alt,
								onInput: i[14] ||= (e) => Ee("alt", e.target.value)
							}, null, 40, hl)])) : Q("", !0),
							!L.value.isLocked && R.value?.value ? (Y(), X("button", {
								key: 3,
								type: "button",
								class: "image-remove-action",
								onClick: Ge
							}, "이미지 삭제")) : Q("", !0)
						], 64)) : De(L.value).length <= 1 ? (Y(), X("label", gl, [Z("span", null, z(L.value.textType === "multi" ? "설명 텍스트" : "텍스트"), 1), _n(Z("textarea", {
							"onUpdate:modelValue": i[15] ||= (e) => R.value = e,
							disabled: L.value.isLocked,
							rows: L.value.textType === "multi" ? 8 : 3,
							placeholder: "Enter 키로 줄바꿈할 수 있습니다."
						}, null, 8, _l), [[Qa, R.value]])])) : Q("", !0),
						Z("dl", vl, [
							Z("div", null, [i[61] ||= Z("dt", null, "Item key", -1), Z("dd", null, z(L.value.itemKey), 1)]),
							Z("div", null, [i[62] ||= Z("dt", null, "필수", -1), Z("dd", null, z(L.value.isRequired ? "Y" : "N"), 1)]),
							Z("div", null, [i[63] ||= Z("dt", null, "고정", -1), Z("dd", null, z(L.value.isLocked ? "Y" : "N"), 1)])
						]),
						Z("section", yl, [
							Z("div", bl, [i[64] ||= Z("strong", null, "DESIGN", -1), Z("button", {
								type: "button",
								disabled: L.value.isLocked,
								onClick: Ye
							}, "초기화", 8, xl)]),
							L.value.fieldKind === "image" ? (Y(), X("div", Sl, [
								Z("div", Cl, [
									i[65] ||= Z("span", null, "크기 조절 방식", -1),
									Z("div", wl, [Z("button", {
										type: "button",
										class: F({ active: W.value.aspectRatioLocked !== !1 }),
										disabled: L.value.isLocked,
										onClick: i[16] ||= (e) => tt("locked")
									}, "비율 유지", 10, Tl), Z("button", {
										type: "button",
										class: F({ active: W.value.aspectRatioLocked === !1 }),
										disabled: L.value.isLocked || W.value.shape === "circle",
										onClick: i[17] ||= (e) => tt("free")
									}, "자유 조절", 10, El)]),
									W.value.shape === "circle" ? (Y(), X("small", Dl, "원형 이미지는 1:1 비율로 고정됩니다.")) : Q("", !0)
								]),
								Z("label", null, [i[66] ||= Z("span", null, "이미지 너비", -1), Z("div", Ol, [Z("input", {
									type: "range",
									min: "10",
									max: "100",
									step: "1",
									disabled: L.value.isLocked,
									value: W.value.widthPct || 32,
									onInput: i[18] ||= (e) => G({ widthPct: Number(e.target.value) })
								}, null, 40, kl), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "10",
									max: "100",
									step: "1",
									disabled: L.value.isLocked,
									value: Math.round(W.value.widthPct || 32),
									"aria-label": "이미지 너비 퍼센트",
									onChange: i[19] ||= (e) => G({ widthPct: Math.min(100, Math.max(10, Number(e.target.value) || 32)) })
								}, null, 40, Al)])]),
								W.value.shape !== "circle" && W.value.aspectRatioLocked === !1 ? (Y(), X("label", jl, [i[67] ||= Z("span", null, "이미지 높이", -1), Z("div", Ml, [Z("input", {
									type: "range",
									min: "80",
									max: "900",
									step: "10",
									disabled: L.value.isLocked,
									value: W.value.heightPx || 240,
									onInput: i[20] ||= (e) => G({ heightPx: Number(e.target.value) })
								}, null, 40, Nl), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "80",
									max: "900",
									step: "10",
									disabled: L.value.isLocked,
									value: Math.round(W.value.heightPx || 240),
									"aria-label": "이미지 높이 픽셀",
									onChange: i[21] ||= (e) => G({ heightPx: Math.min(900, Math.max(80, Number(e.target.value) || 240)) })
								}, null, 40, Pl)])])) : Q("", !0),
								Z("label", null, [i[69] ||= Z("span", null, "이미지 맞춤", -1), Z("select", {
									disabled: L.value.isLocked,
									value: W.value.imageFit || "contain",
									onChange: i[22] ||= (e) => G({ imageFit: e.target.value })
								}, [...i[68] ||= [Z("option", { value: "contain" }, "전체 표시", -1), Z("option", { value: "cover" }, "영역 채우기", -1)]], 40, Fl)]),
								Z("label", null, [i[71] ||= Z("span", null, "이미지 초점", -1), Z("select", {
									disabled: L.value.isLocked,
									value: W.value.imagePosition || "center center",
									onChange: i[23] ||= (e) => G({ imagePosition: e.target.value })
								}, [...i[70] ||= [Pi("<option value=\"left top\">왼쪽 위</option><option value=\"center top\">중앙 위</option><option value=\"right top\">오른쪽 위</option><option value=\"left center\">왼쪽 중앙</option><option value=\"center center\">중앙</option><option value=\"right center\">오른쪽 중앙</option><option value=\"left bottom\">왼쪽 아래</option><option value=\"center bottom\">중앙 아래</option><option value=\"right bottom\">오른쪽 아래</option>", 9)]], 40, Il)]),
								Z("label", null, [i[73] ||= Z("span", null, "이미지 형태", -1), Z("select", {
									disabled: L.value.isLocked,
									value: W.value.shape || "square",
									onChange: i[24] ||= (e) => et(e.target.value)
								}, [...i[72] ||= [
									Z("option", { value: "square" }, "사각형", -1),
									Z("option", { value: "rounded" }, "둥근 사각형", -1),
									Z("option", { value: "circle" }, "원형", -1)
								]], 40, Ll)]),
								Z("label", Rl, [Z("input", {
									type: "checkbox",
									disabled: L.value.isLocked,
									checked: W.value.decorative === !0,
									onChange: i[25] ||= (e) => G({ decorative: e.target.checked })
								}, null, 40, zl), i[74] ||= Z("span", null, "장식 이미지", -1)]),
								W.value.decorative === !0 ? Q("", !0) : (Y(), X("label", Bl, [i[75] ||= Z("span", null, "이미지 설명", -1), Z("input", {
									type: "text",
									maxlength: "240",
									disabled: L.value.isLocked,
									value: W.value.accessibleLabel || R.value?.alt || L.value.name,
									onInput: i[26] ||= (e) => G({ accessibleLabel: e.target.value })
								}, null, 40, Vl)]))
							])) : (Y(), X("div", Hl, [
								i[78] ||= Z("strong", null, "컴포넌트 영역 크기", -1),
								i[79] ||= Z("small", null, "프리뷰의 모서리와 변을 드래그하면 영역과 글자 크기가 함께 변경됩니다.", -1),
								Z("label", null, [i[76] ||= Z("span", null, "컴포넌트 너비", -1), Z("div", Ul, [Z("input", {
									type: "range",
									min: "0.01",
									max: "100",
									step: "0.1",
									disabled: L.value.isLocked,
									value: W.value.widthPct || 32,
									onInput: i[27] ||= (e) => G({ widthPct: Number(e.target.value) })
								}, null, 40, Wl), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "0.01",
									max: "100",
									step: "0.1",
									disabled: L.value.isLocked,
									value: Math.round(W.value.widthPct || 32),
									"aria-label": "컴포넌트 너비 퍼센트",
									onChange: i[28] ||= (e) => G({ widthPct: Math.min(100, Math.max(.01, Number(e.target.value) || 32)) })
								}, null, 40, Gl)])]),
								Z("label", null, [i[77] ||= Z("span", null, "컴포넌트 높이", -1), Z("div", Kl, [Z("input", {
									type: "range",
									min: "1",
									max: "900",
									step: "1",
									disabled: L.value.isLocked,
									value: W.value.heightPx || 120,
									onInput: i[29] ||= (e) => G({ heightPx: Number(e.target.value) })
								}, null, 40, ql), Z("input", {
									class: "dimension-input",
									type: "number",
									min: "1",
									max: "900",
									step: "1",
									disabled: L.value.isLocked,
									value: Math.round(W.value.heightPx || 120),
									"aria-label": "컴포넌트 높이 픽셀",
									onChange: i[30] ||= (e) => G({ heightPx: Math.min(900, Math.max(1, Number(e.target.value) || 120)) })
								}, null, 40, Jl)])])
							])),
							L.value.fieldKind === "image" ? Q("", !0) : (Y(), X(J, { key: 2 }, [
								Z("label", null, [i[80] ||= Z("span", null, "글자 색상", -1), Z("input", {
									type: "color",
									disabled: L.value.isLocked,
									value: W.value.color || "#172033",
									onInput: i[31] ||= (e) => G({ color: e.target.value })
								}, null, 40, Yl)]),
								Z("label", null, [i[81] ||= Z("span", null, "폰트 크기", -1), Z("div", Xl, [Z("input", {
									type: "range",
									min: "0",
									max: "80",
									step: "1",
									disabled: L.value.isLocked,
									value: W.value.fontSize ?? 18,
									onInput: i[32] ||= (e) => G({ fontSize: Number(e.target.value) })
								}, null, 40, Zl), Z("output", null, z(W.value.fontSize ?? 18) + "px", 1)])]),
								Z("label", null, [i[83] ||= Z("span", null, "폰트 굵기", -1), Z("select", {
									disabled: L.value.isLocked,
									value: W.value.fontWeight || 400,
									onChange: i[33] ||= (e) => G({ fontWeight: Number(e.target.value) })
								}, [...i[82] ||= [
									Z("option", { value: 400 }, "Regular", -1),
									Z("option", { value: 500 }, "Medium", -1),
									Z("option", { value: 700 }, "Bold", -1),
									Z("option", { value: 800 }, "Extra Bold", -1)
								]], 40, Ql)])
							], 64)),
							Z("div", $l, [i[84] ||= Z("span", null, "위치", -1), W.value.positionMode === "free" ? (Y(), X("strong", eu, " X " + z(Math.round(W.value.xPct || 0)) + "% · Y " + z(Math.round(W.value.yPx || 0)) + "px ", 1)) : (Y(), X("strong", tu, "자동 배치"))]),
							W.value.positionMode === "free" ? (Y(), X("button", {
								key: 3,
								class: "secondary-control",
								type: "button",
								disabled: L.value.isLocked,
								onClick: Xe
							}, " 자동 배치로 복원 ", 8, nu)) : Q("", !0)
						])
					])) : Q("", !0)])])], 2))), 128)), I.value.items?.length ? Q("", !0) : (Y(), X("span", ru, "등록된 컴포넌트 없음"))])])) : Q("", !0)])
				], 2)) : Q("", !0)
			], 2)], 2),
			P.value ? Q("", !0) : (Y(), X("button", iu))
		], 10, Ms));
	}
}, ou = document.querySelector("#visual-editor-app");
ou && lo(au, { mode: new URLSearchParams(window.location.search).get("mode") || ou.dataset.mode || "editor" }).mount(ou);
//#endregion
