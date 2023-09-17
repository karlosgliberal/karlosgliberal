var CABLES = (function (t) {
  var e = {};
  function i(s) {
    if (e[s]) return e[s].exports;
    var r = (e[s] = { i: s, l: !1, exports: {} });
    return t[s].call(r.exports, r, r.exports, i), (r.l = !0), r.exports;
  }
  return (
    (i.m = t),
    (i.c = e),
    (i.d = function (t, e, s) {
      i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: s });
    }),
    (i.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (i.t = function (t, e) {
      if ((1 & e && (t = i(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var s = Object.create(null);
      if (
        (i.r(s),
        Object.defineProperty(s, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var r in t)
          i.d(
            s,
            r,
            function (e) {
              return t[e];
            }.bind(null, r)
          );
      return s;
    }),
    (i.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(e, "a", e), e;
    }),
    (i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (i.p = ""),
    i((i.s = 0))
  );
})([
  function (t, e, i) {
    t.exports = i(2);
  },
  function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    let GLOB_EXP = /(?:^|[^\\])\*/,
      NOT_LINE_ENDING = /[^\r\n]/g;
    const Preprocessor = function (t, e, i) {
      (this.source = "" + t),
        (this.baseDir = "string" == typeof e ? e : "."),
        (this.includes = "object" == typeof e ? e : {}),
        (this.preserveLineNumbers = "boolean" == typeof i && i),
        (this.isNode = !("undefined" != typeof window && window.window)),
        (this.errorSourceAhead = 50),
        (this.defines = []);
    };
    (Preprocessor.EXPR =
      /([ ]*)\/\/[ ]+#(include_once|include|ifn?def|if|endif|else|elif|put|define)/g),
      (Preprocessor.ALL = /([^\r\n]*)\r?(?:\n|$)/),
      (Preprocessor.INCLUDE =
        /(include_once|include)[ ]+"([^"\\]*(\\.[^"\\]*)*)"[ ]*\r?(?:\n|$)/g),
      (Preprocessor.IF = /(ifdef|ifndef|if)[ ]*([^\r\n]+)\r?\n/g),
      (Preprocessor.ENDIF = /(endif|else|elif)([ ]+[^\r\n]+)?\r?(?:\n|$)/g),
      (Preprocessor.PUT = /put[ ]+([^\n]+)[ ]*/g),
      (Preprocessor.DEFINE = /define[ ]+([^\n\r]+)\r?(?:\n|$)/g),
      (Preprocessor.VAR =
        /define[ ]+var[ ]+([a-zA-Z_][a-zA-Z0-9_]*)[ ]*=[ ]*(.+)/g),
      (Preprocessor.BOOLVAR = /define[ ]+([a-zA-Z_][a-zA-Z0-9_]*)[ ]*/g),
      (Preprocessor.FUNCTION =
        /define[ ]+function[ ]+([a-zA-Z_][a-zA-Z0-9_]*)[ ]*(.+)/g),
      (Preprocessor.stripSlashes = function (t) {
        return (t + "").replace(/\\(.?)/g, function (t, e) {
          switch (e) {
            case "\\":
              return "\\";
            case "0":
              return "\0";
            case "":
              return "";
            default:
              return e;
          }
        });
      }),
      (Preprocessor.addSlashes = function (t) {
        return (t + "").replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
      }),
      (Preprocessor.indent = function (t, e) {
        let i = t.split("\n");
        for (let t = 0; t < i.length; t++) i[t] = e + i[t];
        return i.join("\n");
      }),
      (Preprocessor.nlToStr = function (t) {
        return "[" + t.replace(/\r/g, "").replace(/\n/g, "\\n") + "]";
      }),
      (Preprocessor.evaluate = function (defines, expr) {
        let evalFunction = function () {
          for (let key in defines)
            defines.hasOwnProperty(key) &&
              ("var" === defines[key].type
                ? eval("var " + key + " = " + defines[key].value + ";")
                : eval("function " + key + defines[key].value));
          return eval(expr);
        };
        return evalFunction();
      }),
      (Preprocessor.prototype.process = function (t, e) {
        (t = t || {}),
          (e = "function" == typeof e ? e : function () {})(
            "Defines: " + JSON.stringify(t)
          );
        let i,
          s,
          r,
          n,
          o,
          a,
          h = [],
          l = !1;
        for (; null !== (i = Preprocessor.EXPR.exec(this.source)); ) {
          e(i[2] + " @ " + i.index + "-" + Preprocessor.EXPR.lastIndex);
          let _ = i[1];
          if (
            l &&
            h.length > 0 &&
            "endif" !== i[2] &&
            "else" !== i[2] &&
            "elif" !== i[2]
          ) {
            if (
              ((a = h.pop()),
              e("  pop (" + h.length + "): " + JSON.stringify(a)),
              (Preprocessor.ALL.lastIndex = i.index),
              null === (s = Preprocessor.ALL.exec(this.source)))
            )
              throw new Error(
                "Illegal #" +
                  i[2] +
                  ": " +
                  this.source.substring(
                    i.index,
                    i.index + this.errorSourceAhead
                  ) +
                  "..."
              );
            h.push(
              (o = {
                include: a.include,
                index: a.index,
                lastIndex: Preprocessor.ALL.lastIndex,
              })
            ),
              e("  push (" + h.length + "): " + JSON.stringify(o));
          } else
            switch (i[2]) {
              case "ifdef":
              case "ifndef":
              case "if":
                if (
                  ((Preprocessor.IF.lastIndex = i.index),
                  null === (s = Preprocessor.IF.exec(this.source)))
                )
                  throw new Error(
                    "Illegal #" +
                      i[2] +
                      ": " +
                      this.source.substring(
                        i.index,
                        i.index + this.errorSourceAhead
                      ) +
                      "..."
                  );
                e("  test: " + s[2]),
                  e("  defines  " + JSON.stringify(t)),
                  (n =
                    "ifdef" === s[1]
                      ? void 0 !== t[s[2]]
                      : "ifndef" === s[1]
                      ? void 0 === t[s[2]]
                      : Preprocessor.evaluate(t, s[2])),
                  (l = !n),
                  e("  value: " + n + ", isSkip: " + l),
                  h.push(
                    (o = {
                      include: n,
                      index: i.index,
                      lastIndex: Preprocessor.IF.lastIndex,
                    })
                  ),
                  e("  push (" + h.length + "): " + JSON.stringify(o));
                break;
              case "endif":
              case "else":
              case "elif":
                if (
                  ((Preprocessor.ENDIF.lastIndex = i.index),
                  null === (s = Preprocessor.ENDIF.exec(this.source)))
                )
                  throw new Error(
                    "Illegal #" +
                      i[2] +
                      ': "' +
                      this.source.substring(
                        i.index,
                        i.index + this.errorSourceAhead
                      ) +
                      "..."
                  );
                if (0 === h.length)
                  throw new Error(
                    "Unexpected #" +
                      s[1] +
                      ': "' +
                      this.source.substring(
                        i.index,
                        i.index + this.errorSourceAhead
                      ) +
                      "..."
                  );
                (a = h.pop()),
                  e("  pop (" + h.length + "): " + JSON.stringify(a)),
                  (n = this.preserveLineNumbers
                    ? this.source
                        .substring(a.index, a.lastIndex)
                        .replace(NOT_LINE_ENDING, "") +
                      this.source.substring(a.lastIndex, i.index) +
                      this.source
                        .substring(i.index, Preprocessor.ENDIF.lastIndex)
                        .replace(NOT_LINE_ENDING, "")
                    : this.source.substring(a.lastIndex, i.index)),
                  a.include
                    ? (e(
                        "  incl: " +
                          Preprocessor.nlToStr(n) +
                          ", 0-" +
                          a.index +
                          " + " +
                          n.length +
                          " bytes + " +
                          Preprocessor.ENDIF.lastIndex +
                          "-" +
                          this.source.length
                      ),
                      (this.source =
                        this.source.substring(0, a.index) +
                        n +
                        this.source.substring(Preprocessor.ENDIF.lastIndex)))
                    : this.preserveLineNumbers
                    ? (e(
                        "  excl(\\n): " +
                          Preprocessor.nlToStr(n) +
                          ", 0-" +
                          a.index +
                          " + " +
                          Preprocessor.ENDIF.lastIndex +
                          "-" +
                          this.source.length
                      ),
                      (n = n.replace(NOT_LINE_ENDING, "")),
                      (this.source =
                        this.source.substring(0, a.index) +
                        n +
                        this.source.substring(Preprocessor.ENDIF.lastIndex)))
                    : (e(
                        "  excl: " +
                          Preprocessor.nlToStr(n) +
                          ", 0-" +
                          a.index +
                          " + " +
                          Preprocessor.ENDIF.lastIndex +
                          "-" +
                          this.source.length
                      ),
                      (n = ""),
                      (this.source =
                        this.source.substring(0, a.index) +
                        this.source.substring(Preprocessor.ENDIF.lastIndex))),
                  "" === this.source && e("  result empty"),
                  (l = !1),
                  (Preprocessor.EXPR.lastIndex = a.index + n.length),
                  e("  continue at " + Preprocessor.EXPR.lastIndex),
                  ("else" !== s[1] && "elif" !== s[1]) ||
                    ((n =
                      "else" === s[1]
                        ? !a.include
                        : Preprocessor.evaluate(t, s[2])),
                    (l = !n),
                    e("  isSkip: " + l),
                    h.push(
                      (o = {
                        include: n,
                        index: Preprocessor.EXPR.lastIndex,
                        lastIndex: Preprocessor.EXPR.lastIndex,
                      })
                    ),
                    e("  push (" + h.length + "): " + JSON.stringify(o)));
                break;
              case "define":
                if (
                  ((Preprocessor.DEFINE.lastIndex = i.index),
                  (Preprocessor.VAR.lastIndex = i.index),
                  (Preprocessor.FUNCTION.lastIndex = i.index),
                  (Preprocessor.BOOLVAR.lastIndex = i.index),
                  null === (s = Preprocessor.DEFINE.exec(this.source)))
                )
                  throw new Error(
                    "Illegal #" +
                      i[2] +
                      ": " +
                      this.source.substring(
                        i.index,
                        i.index + this.errorSourceAhead
                      ) +
                      "..."
                  );
                var c, u, g;
                if (
                  (e('  def: "' + s[1] + '"'),
                  null !== (r = Preprocessor.VAR.exec(this.source)))
                )
                  (g = "var"),
                    (c = r[1]),
                    (u = r[2]),
                    e(" match3(var): " + JSON.stringify(r));
                else if (null !== (r = Preprocessor.FUNCTION.exec(this.source)))
                  (g = "function"),
                    (c = r[1]),
                    (u = r[2]),
                    e(" match3(function): " + JSON.stringify(r));
                else {
                  if (null === (r = Preprocessor.BOOLVAR.exec(this.source)))
                    throw new Error(
                      "Illegal #" +
                        i[2] +
                        ": " +
                        this.source.substring(
                          i.index,
                          i.index + this.errorSourceAhead
                        ) +
                        "..."
                    );
                  (g = "var"),
                    (c = r[1]),
                    (u = !0),
                    e(" match3(boolvar): " + JSON.stringify(r));
                }
                e("  type: " + g),
                  e("  identifier: " + c),
                  e("  value: " + u),
                  (t[c] = { type: g, value: u }),
                  e("  defines  " + JSON.stringify(t));
                var p = "";
                this.preserveLineNumbers &&
                  (p = this.source
                    .substring(i.index, Preprocessor.DEFINE.lastIndex)
                    .replace(NOT_LINE_ENDING, "")),
                  (this.source =
                    this.source.substring(0, i.index) +
                    _ +
                    p +
                    this.source.substring(Preprocessor.DEFINE.lastIndex)),
                  (Preprocessor.EXPR.lastIndex = i.index),
                  e("  continue at " + Preprocessor.EXPR.lastIndex);
            }
        }
        return (
          h.length > 0 &&
            e("Still on stack (" + h.length + "): " + JSON.stringify(h.pop())),
          this.source
        );
      });
    var _unused_webpack_default_export = Preprocessor;
  },
  function (t, e, i) {
    "use strict";
    i.r(e);
    var s = {};
    i.r(s),
      i.d(s, "getShortOpName", function () {
        return p;
      }),
      i.d(s, "shuffleArray", function () {
        return _;
      }),
      i.d(s, "shortId", function () {
        return m;
      }),
      i.d(s, "uuid", function () {
        return T;
      }),
      i.d(s, "generateUUID", function () {
        return A;
      }),
      i.d(s, "simpleId", function () {
        return x;
      }),
      i.d(s, "smoothStep", function () {
        return v;
      }),
      i.d(s, "smootherStep", function () {
        return y;
      }),
      i.d(s, "clamp", function () {
        return I;
      }),
      i.d(s, "map", function () {
        return S;
      }),
      i.d(s, "cacheBust", function () {
        return R;
      }),
      i.d(s, "copyArray", function () {
        return P;
      }),
      i.d(s, "basename", function () {
        return O;
      }),
      i.d(s, "jsonp", function () {
        return F;
      }),
      i.d(s, "ajaxSync", function () {
        return C;
      }),
      i.d(s, "ajax", function () {
        return w;
      }),
      i.d(s, "request", function () {
        return M;
      }),
      i.d(s, "keyCodeToName", function () {
        return U;
      }),
      i.d(s, "UTILS", function () {
        return g;
      });
    var r = {};
    i.r(r),
      i.d(r, "base64Chars", function () {
        return k;
      }),
      i.d(r, "base64lookup", function () {
        return D;
      }),
      i.d(r, "b64encTypesArray", function () {
        return G;
      }),
      i.d(r, "b64decTypedArray", function () {
        return H;
      });
    var n = {};
    i.r(n),
      i.d(n, "easeExpoIn", function () {
        return j;
      }),
      i.d(n, "easeExpoOut", function () {
        return K;
      }),
      i.d(n, "easeExpoInOut", function () {
        return Q;
      }),
      i.d(n, "easeCubicIn", function () {
        return q;
      }),
      i.d(n, "easeCubicOut", function () {
        return J;
      }),
      i.d(n, "easeCubicInOut", function () {
        return Z;
      }),
      i.d(n, "ANIM", function () {
        return X;
      }),
      i.d(n, "Anim", function () {
        return $;
      }),
      i.d(n, "TL", function () {
        return tt;
      });
    var o = {};
    i.r(o),
      i.d(o, "PatchConnectionReceiver", function () {
        return Kt;
      }),
      i.d(o, "PatchConnectionSender", function () {
        return Qt;
      }),
      i.d(o, "PatchConnectorBroadcastChannel", function () {
        return qt;
      });
    class a {
      constructor(t) {
        (this._logs = []), (this.initiator = t);
      }
      stack(t) {
        console.error("[" + this.initiator + "] ", t),
          console.log(new Error().stack),
          window.gui &&
            window.gui.emitEvent("coreLogEvent", this.initiator, "error", t);
      }
      groupCollapsed(t) {
        console.groupCollapsed("[" + this.initiator + "] " + t);
      }
      table(t) {
        console.table(t);
      }
      groupEnd() {
        console.groupEnd();
      }
      error(t) {
        console.error("[" + this.initiator + "]", ...arguments),
          window.gui &&
            window.gui.emitEvent(
              "coreLogEvent",
              this.initiator,
              "error",
              arguments
            );
      }
      info(t) {
        console.error("[" + this.initiator + "]", ...arguments),
          window.gui &&
            window.gui.emitEvent(
              "coreLogEvent",
              this.initiator,
              "info",
              arguments
            );
      }
      warn(t) {
        console.warn("[" + this.initiator + "]", ...arguments),
          window.gui &&
            window.gui.emitEvent(
              "coreLogEvent",
              this.initiator,
              "warn",
              arguments
            );
      }
      verbose() {
        ((CABLES.UI &&
          CABLES.UI.logFilter.shouldPrint(this.initiator, ...arguments)) ||
          !CABLES.logSilent) &&
          console.log("[" + this.initiator + "]", ...arguments),
          window.gui &&
            window.gui.emitEvent(
              "coreLogEvent",
              this.initiator,
              "verbose",
              arguments
            );
      }
      log(t) {
        ((CABLES.UI &&
          CABLES.UI.logFilter.shouldPrint(this.initiator, ...arguments)) ||
          !CABLES.logSilent) &&
          console.log("[" + this.initiator + "]", ...arguments),
          window.gui &&
            window.gui.emitEvent(
              "coreLogEvent",
              this.initiator,
              "log",
              arguments
            );
      }
      userInteraction(t) {}
    }
    const h = {
        EASINGS: [
          "linear",
          "absolute",
          "smoothstep",
          "smootherstep",
          "Cubic In",
          "Cubic Out",
          "Cubic In Out",
          "Expo In",
          "Expo Out",
          "Expo In Out",
          "Sin In",
          "Sin Out",
          "Sin In Out",
          "Quart In",
          "Quart Out",
          "Quart In Out",
          "Quint In",
          "Quint Out",
          "Quint In Out",
          "Back In",
          "Back Out",
          "Back In Out",
          "Elastic In",
          "Elastic Out",
          "Bounce In",
          "Bounce Out",
        ],
        EASING_LINEAR: 0,
        EASING_ABSOLUTE: 1,
        EASING_SMOOTHSTEP: 2,
        EASING_SMOOTHERSTEP: 3,
        EASING_CUBICSPLINE: 4,
        EASING_CUBIC_IN: 5,
        EASING_CUBIC_OUT: 6,
        EASING_CUBIC_INOUT: 7,
        EASING_EXPO_IN: 8,
        EASING_EXPO_OUT: 9,
        EASING_EXPO_INOUT: 10,
        EASING_SIN_IN: 11,
        EASING_SIN_OUT: 12,
        EASING_SIN_INOUT: 13,
        EASING_BACK_IN: 14,
        EASING_BACK_OUT: 15,
        EASING_BACK_INOUT: 16,
        EASING_ELASTIC_IN: 17,
        EASING_ELASTIC_OUT: 18,
        EASING_BOUNCE_IN: 19,
        EASING_BOUNCE_OUT: 21,
        EASING_QUART_IN: 22,
        EASING_QUART_OUT: 23,
        EASING_QUART_INOUT: 24,
        EASING_QUINT_IN: 25,
        EASING_QUINT_OUT: 26,
        EASING_QUINT_INOUT: 27,
      },
      l = {
        OP_PORT_TYPE_VALUE: 0,
        OP_PORT_TYPE_FUNCTION: 1,
        OP_PORT_TYPE_OBJECT: 2,
        OP_PORT_TYPE_TEXTURE: 2,
        OP_PORT_TYPE_ARRAY: 3,
        OP_PORT_TYPE_DYNAMIC: 4,
        OP_PORT_TYPE_STRING: 5,
        OP_VERSION_PREFIX: "_v",
      },
      c = { PORT_DIR_IN: 0, PORT_DIR_OUT: 1 },
      u = {
        PACO_CLEAR: 0,
        PACO_VALUECHANGE: 1,
        PACO_OP_DELETE: 2,
        PACO_UNLINK: 3,
        PACO_LINK: 4,
        PACO_LOAD: 5,
        PACO_OP_CREATE: 6,
        PACO_OP_ENABLE: 7,
        PACO_OP_DISABLE: 8,
        PACO_UIATTRIBS: 9,
        PACO_VARIABLES: 10,
        PACO_TRIGGERS: 11,
        PACO_PORT_SETVARIABLE: 12,
        PACO_PORT_SETANIMATED: 13,
        PACO_PORT_ANIM_UPDATED: 14,
        PACO_DESERIALIZE: 15,
      },
      g = {
        float32Concat: function (t, e) {
          t instanceof Float32Array || (t = new Float32Array(t)),
            e instanceof Float32Array || (e = new Float32Array(e));
          const i = new Float32Array(t.length + e.length);
          return i.set(t), i.set(e, t.length), i;
        },
      },
      p = function (t) {
        let e = t.split(".")[t.split(".").length - 1];
        if (e.indexOf(l.OP_VERSION_PREFIX) > 0) {
          const t = e.split(l.OP_VERSION_PREFIX)[1];
          e = e.substring(0, e.length - (l.OP_VERSION_PREFIX + t).length);
        }
        return e;
      },
      _ = function (t) {
        for (let e = t.length - 1; e > 0; e--) {
          const i = Math.floor(Math.seededRandom() * (e + 1)),
            s = t[e];
          (t[e] = t[i]), (t[i] = s);
        }
        return t;
      },
      d = {},
      f = function () {
        let t = Math.random().toString(36).substr(2, 9);
        return d.hasOwnProperty(t) && (t = f()), (d[t] = !0), t;
      },
      m = f,
      E = function () {
        let t = new Date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
          const i = (t + 16 * Math.random()) % 16 | 0;
          return (
            (t = Math.floor(t / 16)), ("x" == e ? i : (3 & i) | 8).toString(16)
          );
        });
      },
      T = E,
      A = E;
    let b = 0;
    const x = function () {
        return b++, b;
      },
      v = function (t) {
        const e = Math.max(0, Math.min(1, (t - 0) / 1));
        return (t = e * e * (3 - 2 * e));
      },
      y = function (t) {
        const e = Math.max(0, Math.min(1, (t - 0) / 1));
        return (t = e * e * e * (e * (6 * e - 15) + 10));
      },
      I = function (t, e, i) {
        return Math.min(Math.max(t, e), i);
      },
      S = function (t, e, i, s, r, n) {
        if (t >= i) return r;
        if (t <= e) return s;
        let o = !1;
        const a = Math.min(e, i),
          h = Math.max(e, i);
        a != e && (o = !0);
        let l = !1;
        const c = Math.min(s, r),
          u = Math.max(s, r);
        c != s && (l = !0);
        let g = 0,
          p = 0;
        return (
          (g = o
            ? ((h - t) * (u - c)) / (h - a)
            : ((t - a) * (u - c)) / (h - a)),
          (p = l ? u - g : g + c),
          n
            ? 1 == n
              ? s +
                (t = Math.max(0, Math.min(1, (p - s) / (r - s)))) *
                  t *
                  (3 - 2 * t) *
                  (r - s)
              : 2 == n
              ? s +
                (t = Math.max(0, Math.min(1, (p - s) / (r - s)))) *
                  t *
                  t *
                  (t * (6 * t - 15) + 10) *
                  (r - s)
              : p
            : p
        );
      };
    (Math.randomSeed = 1),
      (Math.seededRandom = function (t, e) {
        0 === Math.randomSeed && (Math.randomSeed = 999 * Math.random()),
          (t = t || 1),
          (e = e || 0),
          (Math.randomSeed = (9301 * Math.randomSeed + 49297) % 233280);
        return e + (Math.randomSeed / 233280) * (t - e);
      }),
      (g.arrayWriteToEnd = function (t, e) {
        for (let e = 1; e < t.length; e++) t[e - 1] = t[e];
        t[t.length - 1] = e;
      }),
      (g.isNumeric = function (t) {
        return !isNaN(parseFloat(t)) && isFinite(t);
      }),
      (g.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      }),
      (String.prototype.endl = function () {
        return this + "\n";
      }),
      (String.prototype.startsWith = function (t) {
        return 0 === this.indexOf(t);
      }),
      (String.prototype.endsWith = function (t) {
        return this.match(t + "$") == t;
      });
    const R = function (t) {
        return (
          t.indexOf("?") > -1 ? (t += "&") : (t += "?"),
          t + "cb=" + CABLES.uuid()
        );
      },
      P = function (t, e) {
        if (!t) return null;
        (e = e || []).length = t.length;
        for (let i = 0; i < t.length; i++) e[i] = t[i];
        return e;
      },
      O = function (t) {
        let e = "";
        if (!t) return "";
        const i = (t + "").split("/");
        if (i.length > 0) {
          let t = i[i.length - 1].split("?");
          (e = t[0]), (t = e.split(".")), (e = t[0]);
        }
        return e;
      };
    let N = null;
    const F = function (t, e) {
        (N = N || 0), N++;
        const i = N;
        CABLES["jsonpFunc" + i] = function (t) {
          e(!1, t);
        };
        let s = "?";
        t.indexOf(s) > -1 && (s = "&");
        const r = document.createElement("script");
        r.setAttribute("src", t + s + "callback=CABLES.jsonpFunc" + i),
          document.body.appendChild(r);
      },
      C = function (t, e, i, s, r) {
        M({ url: t, cb: e, method: i, data: s, contenttype: r, sync: !0 });
      },
      w = function (t, e, i, s, r, n, o = {}) {
        M({
          url: t,
          cb: e,
          method: i,
          data: s,
          contenttype: r,
          sync: !1,
          jsonP: n,
          headers: o,
        });
      },
      M = function (t) {
        let e;
        t.hasOwnProperty("asynch") || (t.asynch = !0);
        try {
          e = new XMLHttpRequest();
        } catch (t) {}
        if (
          ((e.onreadystatechange = function () {
            4 == e.readyState &&
              t.cb &&
              (200 == e.status || 0 == e.status
                ? t.cb(!1, e.responseText, e)
                : t.cb(!0, e.responseText, e));
          }),
          e.addEventListener("progress", (t) => {}),
          e.open(t.method ? t.method.toUpperCase() : "GET", t.url, !t.sync),
          "object" == typeof t.headers)
        ) {
          const i = Object.keys(t.headers);
          for (let s = 0; s < i.length; s++) {
            const r = i[s],
              n = t.headers[r];
            e.setRequestHeader(r, n);
          }
        }
        t.post || t.data
          ? (e.setRequestHeader(
              "Content-type",
              t.contenttype
                ? t.contenttype
                : "application/x-www-form-urlencoded"
            ),
            e.send(t.data || t.post))
          : e.send();
      },
      U = function (t) {
        if (!t && 0 !== t) return "Unidentified";
        const e = {
          8: "Backspace",
          9: "Tab",
          12: "Clear",
          13: "Enter",
          16: "Shift",
          17: "Control",
          18: "Alt",
          19: "Pause",
          20: "CapsLock",
          27: "Escape",
          32: "Space",
          33: "PageUp",
          34: "PageDown",
          35: "End",
          36: "Home",
          37: "ArrowLeft",
          38: "ArrowUp",
          39: "ArrowRight",
          40: "ArrowDown",
          45: "Insert",
          46: "Delete",
          112: "F1",
          113: "F2",
          114: "F3",
          115: "F4",
          116: "F5",
          117: "F6",
          118: "F7",
          119: "F8",
          120: "F9",
          121: "F10",
          122: "F11",
          123: "F12",
          144: "NumLock",
          145: "ScrollLock",
          224: "Meta",
        };
        return e[t] ? e[t] : String.fromCharCode(t);
      };
    window.performance = window.performance || {
      offset: Date.now(),
      now: function () {
        return Date.now() - this.offset;
      },
    };
    const B = function (t, e) {
      if (!t) throw new Error("no cgl");
      (this._log = new a("cgl_texture")),
        (this._cgl = t),
        (this.tex = this._cgl.gl.createTexture()),
        (this.id = CABLES.uuid()),
        (this.width = 0),
        (this.height = 0),
        (this.loading = !1),
        (this.flip = !0),
        (this.flipped = !1),
        (this.shadowMap = !1),
        (this.deleted = !1),
        (this.image = null),
        (this.anisotropic = 0),
        (this.filter = B.FILTER_NEAREST),
        (this.wrap = B.WRAP_CLAMP_TO_EDGE),
        (this.texTarget = this._cgl.gl.TEXTURE_2D),
        e && e.type && (this.texTarget = e.type),
        (this.textureType = B.TYPE_DEFAULT),
        (this.unpackAlpha = !0),
        (this._fromData = !0),
        (this.name = "unknown"),
        e
          ? ((this.name = e.name || this.name),
            e.isDepthTexture && (this.textureType = B.TYPE_DEPTH),
            e.isFloatingPointTexture && (this.textureType = B.TYPE_FLOAT),
            "textureType" in e && (this.textureType = e.textureType),
            "filter" in e && (this.filter = e.filter),
            "wrap" in e && (this.wrap = e.wrap),
            "unpackAlpha" in e && (this.unpackAlpha = e.unpackAlpha),
            "flip" in e && (this.flip = e.flip),
            "shadowMap" in e && (this.shadowMap = e.shadowMap),
            "anisotropic" in e && (this.anisotropic = e.anisotropic))
          : (e = {}),
        e.width || (e.width = 8),
        e.height || (e.height = 8),
        this._cgl.profileData.profileTextureNew++,
        this._cgl.profileData.addHeavyEvent(
          "texture created",
          this.name,
          e.width + "x" + e.height
        ),
        this.setSize(e.width, e.height),
        this.getInfoOneLine();
    };
    (B.prototype.isFloatingPoint = function () {
      return this.textureType == B.TYPE_FLOAT;
    }),
      (B.prototype.compareSettings = function (t) {
        return (
          !!t &&
          t.width == this.width &&
          t.height == this.height &&
          t.filter == this.filter &&
          t.wrap == this.wrap &&
          t.textureType == this.textureType &&
          t.unpackAlpha == this.unpackAlpha &&
          t.anisotropic == this.anisotropic &&
          t.shadowMap == this.shadowMap &&
          t.texTarget == this.texTarget &&
          t.flip == this.flip
        );
      }),
      (B.prototype.clone = function () {
        const t = new B(this._cgl, {
          name: this.name,
          filter: this.filter,
          wrap: this.wrap,
          textureType: this.textureType,
          unpackAlpha: this.unpackAlpha,
          flip: this.flip,
          width: this.width,
          height: this.height,
        });
        return (
          this._cgl.profileData.addHeavyEvent(
            "texture created",
            this.name,
            this.width + "x" + this.height
          ),
          this.compareSettings(t) ||
            (this._log.error("Cloned texture settings do not compare!"),
            this._log.error(this),
            this._log.error(t)),
          t
        );
      }),
      (B.prototype.setSize = function (t, e) {
        if (
          ((t != t || t <= 0 || !t) && (t = 8),
          (e != e || e <= 0 || !e) && (e = 8),
          (t > this._cgl.maxTexSize || e > this._cgl.maxTexSize) &&
            this._log.error(
              "texture size too big! " +
                t +
                "x" +
                e +
                " / max: " +
                this._cgl.maxTexSize
            ),
          (t = Math.min(t, this._cgl.maxTexSize)),
          (e = Math.min(e, this._cgl.maxTexSize)),
          (t = Math.floor(t)),
          (e = Math.floor(e)),
          this.width == t && this.height == e)
        )
          return;
        (this.width = t),
          (this.height = e),
          (this.deleted = !1),
          (this.shortInfoString = this.getInfoOneLine()),
          this._cgl.gl.bindTexture(this.texTarget, this.tex),
          this._cgl.profileData.profileTextureResize++;
        if (
          (this._cgl.patch.config.canvas.forceTextureNearest &&
            (this.filter = B.FILTER_NEAREST),
          1 != this._cgl.glVersion ||
            this.textureType != B.TYPE_FLOAT ||
            this.filter != B.FILTER_LINEAR ||
            this._cgl.gl.getExtension("OES_texture_float_linear") ||
            (console.warn(
              "this graphics card does not support floating point texture linear interpolation! using NEAREST"
            ),
            (this.filter = B.FILTER_NEAREST)),
          this.textureType == B.TYPE_FLOAT)
        )
          if (1 == this._cgl.glVersion)
            if (this._cgl.glUseHalfFloatTex) {
              const i = this._cgl.gl.getExtension("OES_texture_half_float");
              this._cgl.gl.getExtension("EXT_color_buffer_half_float");
              if (!i) throw new Error("no half float texture extension");
              this._cgl.gl.texImage2D(
                this.texTarget,
                0,
                this._cgl.gl.RGBA,
                t,
                e,
                0,
                this._cgl.gl.RGBA,
                i.HALF_FLOAT_OES,
                null
              );
            } else
              this._cgl.gl.getExtension("OES_texture_float"),
                this._cgl.gl.texImage2D(
                  this.texTarget,
                  0,
                  this._cgl.gl.RGBA,
                  t,
                  e,
                  0,
                  this._cgl.gl.RGBA,
                  this._cgl.gl.FLOAT,
                  null
                );
          else if (this._cgl.glUseHalfFloatTex) {
            if (!this._cgl.gl.getExtension("EXT_color_buffer_half_float"))
              throw new Error("no half float texture extension");
            console.log(
              "half float",
              this._cgl.gl.RGBA16F,
              this._cgl.gl.HALF_FLOAT
            ),
              console.log("half float", this._cgl.gl.HALF_FLOAT),
              console.log("half float", this._cgl.gl.RGBA16F),
              this._cgl.gl.texImage2D(
                this.texTarget,
                0,
                this._cgl.gl.RGBA,
                t,
                e,
                0,
                this._cgl.gl.RGBA,
                this._cgl.gl.HALF_FLOAT,
                null
              );
          } else
            this._cgl.gl.getExtension("EXT_color_buffer_float"),
              this._cgl.gl.getExtension("EXT_color_buffer_float_linear"),
              this._cgl.gl.getExtension("OES_texture_float_linear"),
              this._cgl.gl.texImage2D(
                this.texTarget,
                0,
                this._cgl.gl.RGBA32F,
                t,
                e,
                0,
                this._cgl.gl.RGBA,
                this._cgl.gl.FLOAT,
                null
              );
        else if (this.textureType == B.TYPE_DEPTH)
          if (1 == this._cgl.glVersion) {
            const i = this._cgl.gl.DEPTH_COMPONENT;
            this._cgl.gl.texImage2D(
              this.texTarget,
              0,
              i,
              t,
              e,
              0,
              this._cgl.gl.DEPTH_COMPONENT,
              this._cgl.gl.UNSIGNED_SHORT,
              null
            );
          } else {
            const i = this._cgl.gl.DEPTH_COMPONENT32F;
            this._cgl.gl.texImage2D(
              this.texTarget,
              0,
              i,
              t,
              e,
              0,
              this._cgl.gl.DEPTH_COMPONENT,
              this._cgl.gl.FLOAT,
              null
            );
          }
        else
          this._cgl.gl.texImage2D(
            this.texTarget,
            0,
            this._cgl.gl.RGBA,
            t,
            e,
            0,
            this._cgl.gl.RGBA,
            this._cgl.gl.UNSIGNED_BYTE,
            null
          );
        this._setFilter(),
          this.updateMipMap(),
          this._cgl.gl.bindTexture(this.texTarget, null);
      }),
      (B.prototype.initFromData = function (t, e, i, s, r) {
        if (
          ((this.filter = s),
          (this.wrap = r),
          null == s && (this.filter = B.FILTER_LINEAR),
          null == r && (this.wrap = B.WRAP_CLAMP_TO_EDGE),
          (this.width = e),
          (this.height = i),
          (this._fromData = !0),
          (this.deleted = !1),
          this.height > this._cgl.maxTexSize ||
            this.width > this._cgl.maxTexSize)
        ) {
          const t = CGL.Texture.getTempTexture(this._cgl);
          return (
            (this.width = t.width),
            (this.height = t.height),
            (this.tex = t.tex),
            void this._log.error(
              "[cgl_texture] texture size to big!!!",
              this.width,
              this.height,
              this._cgl.maxTexSize
            )
          );
        }
        this.flip &&
          this._cgl.gl.pixelStorei(this._cgl.gl.UNPACK_FLIP_Y_WEBGL, this.flip),
          this._cgl.gl.bindTexture(this.texTarget, this.tex),
          this.textureType == B.TYPE_FLOAT
            ? this._cgl.gl.texImage2D(
                this.texTarget,
                0,
                this._cgl.gl.RGBA32F,
                e,
                i,
                0,
                this._cgl.gl.RGBA,
                this._cgl.gl.FLOAT,
                t
              )
            : this._cgl.gl.texImage2D(
                this.texTarget,
                0,
                this._cgl.gl.RGBA,
                e,
                i,
                0,
                this._cgl.gl.RGBA,
                this._cgl.gl.UNSIGNED_BYTE,
                t
              ),
          this._setFilter(),
          this.updateMipMap(),
          this.flip &&
            this._cgl.gl.pixelStorei(this._cgl.gl.UNPACK_FLIP_Y_WEBGL, !1),
          this._cgl.gl.bindTexture(this.texTarget, null);
      }),
      (B.prototype.updateMipMap = function () {
        (2 != this._cgl.glVersion && !this.isPowerOfTwo()) ||
          this.filter != B.FILTER_MIPMAP ||
          (this._cgl.gl.generateMipmap(this.texTarget),
          this._cgl.profileData.profileGenMipMap++);
      }),
      (B.prototype.initTexture = function (t, e) {
        if (
          (this._cgl.printError("before initTexture"),
          this._cgl.checkFrameStarted("texture inittexture"),
          (this._fromData = !1),
          this._cgl.gl.pixelStorei(
            this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            this.unpackAlpha
          ),
          t.width && (this.width = t.width),
          t.height && (this.height = t.height),
          e && (this.filter = e),
          t.height > this._cgl.maxTexSize || t.width > this._cgl.maxTexSize)
        ) {
          const e = CGL.Texture.getTempTexture(this._cgl);
          return (
            (this.width = e.width),
            (this.height = e.height),
            (this.tex = e.tex),
            void this._log.error(
              "[cgl_texture] texture size to big!!!",
              t.width,
              t.height,
              this._cgl.maxTexSize
            )
          );
        }
        this._cgl.gl.bindTexture(this.texTarget, this.tex),
          (this.deleted = !1),
          (this.flipped = !this.flip),
          this.flipped &&
            this._cgl.gl.pixelStorei(
              this._cgl.gl.UNPACK_FLIP_Y_WEBGL,
              this.flipped
            ),
          this._cgl.gl.texImage2D(
            this.texTarget,
            0,
            this._cgl.gl.RGBA,
            this._cgl.gl.RGBA,
            this._cgl.gl.UNSIGNED_BYTE,
            t
          ),
          this._setFilter(),
          this.updateMipMap(),
          this._cgl.gl.bindTexture(this.texTarget, null),
          this._cgl.gl.pixelStorei(
            this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            !1
          ),
          this.flipped &&
            this._cgl.gl.pixelStorei(this._cgl.gl.UNPACK_FLIP_Y_WEBGL, !1),
          this.getInfoOneLine(),
          this._cgl.printError("initTexture");
      }),
      (B.prototype.delete = function () {
        this.loading ||
          ((this.deleted = !0),
          (this.width = 0),
          (this.height = 0),
          this._cgl.profileData.profileTextureDelete++,
          this._cgl.gl.deleteTexture(this.tex),
          (this.image = null),
          (this.tex = null));
      }),
      (B.prototype.isPowerOfTwo = function () {
        return B.isPowerOfTwo(this.width) && B.isPowerOfTwo(this.height);
      }),
      (B.prototype.printInfo = function () {
        console.log(this.getInfo());
      }),
      (B.prototype.getInfoReadable = function () {
        const t = this.getInfo();
        let e = "";
        t.name = t.name.substr(0, t.name.indexOf("?rnd="));
        for (const i in t) e += "* " + i + ":  **" + t[i] + "**\n";
        return e;
      }),
      (B.prototype.getInfoOneLine = function () {
        let t = this.width + "x" + this.height;
        return (
          this.textureType === CGL.Texture.TYPE_FLOAT
            ? (t += " 32bit")
            : (t += " 8bit"),
          this.filter === CGL.Texture.FILTER_NEAREST && (t += " nearest"),
          this.filter === CGL.Texture.FILTER_LINEAR && (t += " linear"),
          this.filter === CGL.Texture.FILTER_MIPMAP && (t += " mipmap"),
          this.wrap === CGL.Texture.WRAP_CLAMP_TO_EDGE && (t += " clamp"),
          this.wrap === CGL.Texture.WRAP_REPEAT && (t += " repeat"),
          this.wrap === CGL.Texture.WRAP_MIRRORED_REPEAT && (t += " repeatmir"),
          (this.shortInfoString = t),
          t
        );
      }),
      (B.prototype.getInfo = function () {
        return B.getTexInfo(this);
      }),
      (B.prototype._setFilter = function () {
        if (
          (this._cgl.printError("before _setFilter"),
          this._fromData ||
            this._cgl.gl.pixelStorei(
              this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
              this.unpackAlpha
            ),
          this.shadowMap &&
            (this._cgl.gl.texParameteri(
              this._cgl.gl.TEXTURE_2D,
              this._cgl.gl.TEXTURE_COMPARE_MODE,
              this._cgl.gl.COMPARE_REF_TO_TEXTURE
            ),
            this._cgl.gl.texParameteri(
              this._cgl.gl.TEXTURE_2D,
              this._cgl.gl.TEXTURE_COMPARE_FUNC,
              this._cgl.gl.LEQUAL
            )),
          this.textureType == B.TYPE_FLOAT &&
            this.filter == B.FILTER_MIPMAP &&
            ((this.filter = B.FILTER_LINEAR),
            this._log.stack(
              "texture: HDR and mipmap filtering at the same time is not possible"
            )),
          1 != this._cgl.glVersion || this.isPowerOfTwo())
        ) {
          if (
            (this.wrap == B.WRAP_CLAMP_TO_EDGE
              ? (this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_S,
                  this._cgl.gl.CLAMP_TO_EDGE
                ),
                this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_T,
                  this._cgl.gl.CLAMP_TO_EDGE
                ))
              : this.wrap == B.WRAP_REPEAT
              ? (this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_S,
                  this._cgl.gl.REPEAT
                ),
                this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_T,
                  this._cgl.gl.REPEAT
                ))
              : this.wrap == B.WRAP_MIRRORED_REPEAT &&
                (this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_S,
                  this._cgl.gl.MIRRORED_REPEAT
                ),
                this._cgl.gl.texParameteri(
                  this.texTarget,
                  this._cgl.gl.TEXTURE_WRAP_T,
                  this._cgl.gl.MIRRORED_REPEAT
                )),
            this.filter == B.FILTER_NEAREST)
          )
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_MAG_FILTER,
              this._cgl.gl.NEAREST
            ),
              this._cgl.gl.texParameteri(
                this.texTarget,
                this._cgl.gl.TEXTURE_MIN_FILTER,
                this._cgl.gl.NEAREST
              );
          else if (this.filter == B.FILTER_LINEAR)
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_MIN_FILTER,
              this._cgl.gl.LINEAR
            ),
              this._cgl.gl.texParameteri(
                this.texTarget,
                this._cgl.gl.TEXTURE_MAG_FILTER,
                this._cgl.gl.LINEAR
              );
          else {
            if (this.filter != B.FILTER_MIPMAP)
              throw (
                (this._log.log("unknown texture filter!", this.filter),
                new Error("unknown texture filter!" + this.filter))
              );
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_MAG_FILTER,
              this._cgl.gl.LINEAR
            ),
              this._cgl.gl.texParameteri(
                this.texTarget,
                this._cgl.gl.TEXTURE_MIN_FILTER,
                this._cgl.gl.LINEAR_MIPMAP_LINEAR
              );
          }
          if (this.anisotropic) {
            const t = this._cgl.gl.getExtension(
              "EXT_texture_filter_anisotropic"
            );
            if (t) {
              const e = this._cgl.gl.getParameter(
                t.MAX_TEXTURE_MAX_ANISOTROPY_EXT
              );
              this._cgl.gl.texParameterf(
                this._cgl.gl.TEXTURE_2D,
                t.TEXTURE_MAX_ANISOTROPY_EXT,
                Math.min(e, this.anisotropic)
              );
            }
          }
        } else
          this._cgl.gl.texParameteri(
            this.texTarget,
            this._cgl.gl.TEXTURE_MAG_FILTER,
            this._cgl.gl.NEAREST
          ),
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_MIN_FILTER,
              this._cgl.gl.NEAREST
            ),
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_WRAP_S,
              this._cgl.gl.CLAMP_TO_EDGE
            ),
            this._cgl.gl.texParameteri(
              this.texTarget,
              this._cgl.gl.TEXTURE_WRAP_T,
              this._cgl.gl.CLAMP_TO_EDGE
            ),
            (this.filter = B.FILTER_NEAREST),
            (this.wrap = B.WRAP_CLAMP_TO_EDGE);
        this.getInfoOneLine(), this._cgl.printError("_setFilter");
      }),
      (B.load = function (t, e, i, s) {
        if (!e) return i({ error: !0 });
        let r = null;
        t.patch.loading.existByName(e) ||
          (r = t.patch.loading.start("texture", e));
        const n = new B(t);
        return (
          (n.name = e),
          t.patch.isEditorMode() &&
            gui
              .jobs()
              .start({
                id: "loadtexture" + r,
                title: "loading texture " + CABLES.basename(e),
              }),
          (n.image = new Image()),
          (n.image.crossOrigin = "anonymous"),
          (n.loading = !0),
          s && s.hasOwnProperty("filter") && (n.filter = s.filter),
          s && s.hasOwnProperty("flip") && (n.flip = s.flip),
          s && s.hasOwnProperty("wrap") && (n.wrap = s.wrap),
          s &&
            s.hasOwnProperty("anisotropic") &&
            (n.anisotropic = s.anisotropic),
          s &&
            s.hasOwnProperty("unpackAlpha") &&
            (n.unpackAlpha = s.unpackAlpha),
          (n.image.onabort = n.image.onerror =
            (s) => {
              console.warn("[cgl.texture.load] error loading texture", e, s),
                (n.loading = !1),
                r && t.patch.loading.finished(r);
              i && i({ error: !0 }, n),
                t.patch.isEditorMode() && gui.jobs().finish("loadtexture" + r);
            }),
          (n.image.onload = function (e) {
            t.addNextFrameOnceCallback(() => {
              n.initTexture(n.image),
                r && t.patch.loading.finished(r),
                (n.loading = !1),
                t.patch.isEditorMode() && gui.jobs().finish("loadtexture" + r),
                i && i(null, n);
            });
          }),
          (n.image.src = e),
          n
        );
      }),
      (B.getTempTexture = function (t) {
        return (
          t || console.error("[getTempTexture] no cgl!"),
          t.tempTexture ||
            (t.tempTexture = B.getTemporaryTexture(
              t,
              256,
              B.FILTER_LINEAR,
              B.REPEAT
            )),
          t.tempTexture
        );
      }),
      (B.getEmptyTexture = function (t, e) {
        if (e) return B.getEmptyTextureFloat(t);
        if (
          (t || console.error("[getEmptyTexture] no cgl!"), t.tempTextureEmpty)
        )
          return t.tempTextureEmpty;
        t.tempTextureEmpty = new B(t, { name: "emptyTexture" });
        const i = new Uint8Array(256).fill(0);
        for (let t = 0; t < 256; t += 4) i[t + 3] = 0;
        return (
          t.tempTextureEmpty.initFromData(
            i,
            8,
            8,
            B.FILTER_NEAREST,
            B.WRAP_REPEAT
          ),
          t.tempTextureEmpty
        );
      }),
      (B.getEmptyTextureFloat = function (t) {
        if (
          (t || console.error("[getEmptyTextureFloat] no cgl!"),
          t.tempTextureEmptyFloat)
        )
          return t.tempTextureEmptyFloat;
        t.tempTextureEmptyFloat = new B(t, {
          name: "emptyTexture",
          isFloatingPointTexture: !0,
        });
        const e = new Float32Array(256).fill(1);
        for (let t = 0; t < 256; t += 4) e[t + 3] = 0;
        return (
          t.tempTextureEmptyFloat.initFromData(
            e,
            8,
            8,
            B.FILTER_NEAREST,
            B.WRAP_REPEAT
          ),
          t.tempTextureEmptyFloat
        );
      }),
      (B.getRandomTexture = function (t) {
        if ((t || console.error("[getRandomTexture] no cgl!"), t.randomTexture))
          return t.randomTexture;
        const e = new Uint8Array(262144);
        for (let t = 0; t < 65536; t++)
          (e[4 * t + 0] = 255 * Math.random()),
            (e[4 * t + 1] = 255 * Math.random()),
            (e[4 * t + 2] = 255 * Math.random()),
            (e[4 * t + 3] = 255);
        return (
          (t.randomTexture = new B(t)),
          t.randomTexture.initFromData(
            e,
            256,
            256,
            B.FILTER_NEAREST,
            B.WRAP_REPEAT
          ),
          t.randomTexture
        );
      }),
      (B.getBlackTexture = function (t) {
        if ((t || this._log.error("[getBlackTexture] no cgl!"), t.blackTexture))
          return t.blackTexture;
        const e = new Uint8Array(256);
        for (let t = 0; t < 64; t++)
          (e[4 * t + 0] = e[4 * t + 1] = e[4 * t + 2] = 0),
            (e[4 * t + 3] = 255);
        return (
          (t.blackTexture = new B(t)),
          t.blackTexture.initFromData(e, 8, 8, B.FILTER_NEAREST, B.WRAP_REPEAT),
          t.blackTexture
        );
      }),
      (B.getEmptyCubemapTexture = function (t) {
        const e = [
            t.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            t.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            t.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            t.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            t.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            t.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
          ],
          i = t.gl.createTexture(),
          s = t.gl.TEXTURE_CUBE_MAP,
          r = B.FILTER_NEAREST,
          n = B.WRAP_CLAMP_TO_EDGE;
        t.profileData.profileTextureNew++,
          t.gl.bindTexture(s, i),
          t.profileData.profileTextureResize++;
        for (let i = 0; i < 6; i += 1) {
          const r = new Uint8Array(256);
          t.gl.texImage2D(
            e[i],
            0,
            t.gl.RGBA,
            8,
            8,
            0,
            t.gl.RGBA,
            t.gl.UNSIGNED_BYTE,
            r
          ),
            t.gl.texParameteri(s, t.gl.TEXTURE_MAG_FILTER, t.gl.NEAREST),
            t.gl.texParameteri(s, t.gl.TEXTURE_MIN_FILTER, t.gl.NEAREST),
            t.gl.texParameteri(s, t.gl.TEXTURE_WRAP_S, t.gl.CLAMP_TO_EDGE),
            t.gl.texParameteri(s, t.gl.TEXTURE_WRAP_T, t.gl.CLAMP_TO_EDGE);
        }
        return (
          t.gl.bindTexture(s, null),
          {
            id: CABLES.uuid(),
            tex: i,
            cubemap: i,
            width: 8,
            height: 8,
            filter: r,
            wrap: n,
            unpackAlpha: !0,
            flip: !0,
            _fromData: !0,
            name: "emptyCubemapTexture",
            anisotropic: 0,
          }
        );
      }),
      (B.getTempGradientTexture = function (t) {
        if (
          (t || console.error("[getTempGradientTexture] no cgl!"),
          t.tempTextureGradient)
        )
          return t.tempTextureGradient;
        const e = new B(t),
          i = new Uint8Array(262144);
        for (let t = 0; t < 256; t++)
          for (let e = 0; e < 256; e++)
            (i[4 * (e + 256 * t) + 0] =
              i[4 * (e + 256 * t) + 1] =
              i[4 * (e + 256 * t) + 2] =
                255 - t),
              (i[4 * (e + 256 * t) + 3] = 255);
        return (
          e.initFromData(i, 256, 256, B.FILTER_NEAREST, B.WRAP_REPEAT),
          (t.tempTextureGradient = e),
          e
        );
      }),
      (B.getTemporaryTexture = function (t, e, i, s) {
        const r = new B(t),
          n = [];
        for (let t = 0; t < e; t++)
          for (let i = 0; i < e; i++)
            (i + t) % 64 < 32
              ? (n.push(200 + (t / e) * 25 + (i / e) * 25),
                n.push(200 + (t / e) * 25 + (i / e) * 25),
                n.push(200 + (t / e) * 25 + (i / e) * 25))
              : (n.push(40 + (t / e) * 25 + (i / e) * 25),
                n.push(40 + (t / e) * 25 + (i / e) * 25),
                n.push(40 + (t / e) * 25 + (i / e) * 25)),
              n.push(255);
        const o = new Uint8Array(n);
        return r.initFromData(o, e, e, i, s), r;
      }),
      (B.createFromImage = function (t, e, i) {
        const s = new B(t, (i = i || {}));
        return (
          (s.flip = !1),
          (s.image = e),
          (s.width = e.width),
          (s.height = e.height),
          i.hasOwnProperty("wrap") && (s.wrap = i.wrap),
          s.initTexture(e, i.filter),
          s
        );
      }),
      (B.fromImage = function (t, e, i, s) {
        console.error("deprecated texture from image...");
        const r = new B(t);
        return (
          (r.flip = !1),
          i && (r.filter = i),
          s && (r.wrap = s),
          (r.image = e),
          r.initTexture(e),
          r
        );
      }),
      (B.isPowerOfTwo = function (t) {
        return (
          1 == t ||
          2 == t ||
          4 == t ||
          8 == t ||
          16 == t ||
          32 == t ||
          64 == t ||
          128 == t ||
          256 == t ||
          512 == t ||
          1024 == t ||
          2048 == t ||
          4096 == t ||
          8192 == t ||
          16384 == t
        );
      }),
      (B.getTexInfo = function (t) {
        const e = {};
        (e.name = t.name),
          (e["power of two"] = B.isPowerOfTwo()),
          (e.size = t.width + " x " + t.height);
        let i = t.texTarget;
        return (
          t.texTarget == t._cgl.gl.TEXTURE_2D && (i = "TEXTURE_2D"),
          (e.target = i),
          (e.unpackAlpha = t.unpackAlpha),
          t.cubemap && (e.cubemap = !0),
          t.textureType == B.TYPE_FLOAT
            ? (e.textureType = "TYPE_FLOAT")
            : t.textureType == B.TYPE_DEPTH
            ? (e.textureType = "TYPE_DEPTH")
            : t.textureType == B.TYPE_DEFAULT
            ? (e.textureType = "TYPE_DEFAULT")
            : (e.textureType = "UNKNOWN"),
          t.wrap == B.WRAP_CLAMP_TO_EDGE
            ? (e.wrap = "CLAMP_TO_EDGE")
            : t.wrap == B.WRAP_REPEAT
            ? (e.wrap = "WRAP_REPEAT")
            : t.wrap == B.WRAP_MIRRORED_REPEAT
            ? (e.wrap = "WRAP_MIRRORED_REPEAT")
            : (e.wrap = "UNKNOWN"),
          t.filter == B.FILTER_NEAREST
            ? (e.filter = "FILTER_NEAREST")
            : t.filter == B.FILTER_LINEAR
            ? (e.filter = "FILTER_LINEAR")
            : t.filter == B.FILTER_MIPMAP
            ? (e.filter = "FILTER_MIPMAP")
            : (e.filter = "UNKNOWN"),
          e
        );
      }),
      (B.FILTER_NEAREST = 0),
      (B.FILTER_LINEAR = 1),
      (B.FILTER_MIPMAP = 2),
      (B.WRAP_REPEAT = 0),
      (B.WRAP_MIRRORED_REPEAT = 1),
      (B.WRAP_CLAMP_TO_EDGE = 2),
      (B.TYPE_DEFAULT = 0),
      (B.TYPE_DEPTH = 1),
      (B.TYPE_FLOAT = 2),
      (B.PFORMATSTR_RGBA32F = "RGBA 32bit float"),
      (B.PFORMATSTR_RGBA8UB = "RGBA 8bit ubyte"),
      (B.PIXELFORMATS = [B.PFORMATSTR_RGBA8UB, B.PFORMATSTR_RGBA32F]);
    const L = function (t, e, i, s) {
      (this._log = new a("cgl_framebuffer2")),
        (this.Framebuffer2DrawTargetsDefault = null),
        (this.Framebuffer2BlittingFramebuffer = null),
        (this.Framebuffer2FinalFramebuffer = null),
        (this._cgl = t),
        this._cgl.printError("before framebuffer2 constructor"),
        (this._width = 0),
        (this._height = 0),
        (this._depthRenderbuffer = null),
        (this._frameBuffer = null),
        (this._textureFrameBuffer = null),
        (this._colorRenderbuffers = []),
        (this._drawTargetArray = []),
        (this._disposed = !1),
        this.Framebuffer2BlittingFramebuffer ||
          (this.Framebuffer2BlittingFramebuffer = t.gl.createFramebuffer()),
        this.Framebuffer2FinalFramebuffer ||
          (this.Framebuffer2FinalFramebuffer = t.gl.createFramebuffer()),
        this.Framebuffer2DrawTargetsDefault ||
          (this.Framebuffer2DrawTargetsDefault = [t.gl.COLOR_ATTACHMENT0]),
        (this._options = s || { isFloatingPointTexture: !1 }),
        (this.name = this._options.name || "unknown"),
        this._cgl.profileData.addHeavyEvent("framebuffer create", this.name),
        this._options.hasOwnProperty("numRenderBuffers") ||
          (this._options.numRenderBuffers = 1),
        this._options.hasOwnProperty("depth") || (this._options.depth = !0),
        this._options.hasOwnProperty("clear") || (this._options.clear = !0),
        this._options.hasOwnProperty("multisampling") ||
          ((this._options.multisampling = !1),
          (this._options.multisamplingSamples = 0)),
        this._options.multisamplingSamples &&
          (this._cgl.glSlowRenderer && (this._options.multisamplingSamples = 0),
          this._cgl.gl.MAX_SAMPLES
            ? (this._options.multisamplingSamples = Math.min(
                this._cgl.maxSamples,
                this._options.multisamplingSamples
              ))
            : (this._options.multisamplingSamples = 0)),
        this._options.hasOwnProperty("filter") ||
          (this._options.filter = B.FILTER_LINEAR),
        this._options.hasOwnProperty("wrap") ||
          (this._options.wrap = B.WRAP_REPEAT),
        (this._numRenderBuffers = this._options.numRenderBuffers),
        (this._colorTextures = []);
      for (let e = 0; e < this._numRenderBuffers; e++)
        this._colorTextures[e] = new B(t, {
          name: "fb2 " + this.name + " " + e,
          isFloatingPointTexture: this._options.isFloatingPointTexture,
          filter: this._options.filter,
          wrap: this._options.wrap,
        });
      let r = B.FILTER_NEAREST;
      this._options.shadowMap && (r = B.FILTER_LINEAR);
      this._options.depth &&
        (this._textureDepth = new B(t, {
          name: "fb2 depth " + this.name,
          isDepthTexture: !0,
          filter: r,
          shadowMap: this._options.shadowMap || !1,
          width: e || 512,
          height: i || 512,
        })),
        t.aborted ||
          (this.setSize(e || 512, i || 512),
          this._cgl.printError("framebuffer2 constructor"));
    };
    (L.prototype.getWidth = function () {
      return this._width;
    }),
      (L.prototype.getHeight = function () {
        return this._height;
      }),
      (L.prototype.getGlFrameBuffer = function () {
        return this._frameBuffer;
      }),
      (L.prototype.getDepthRenderBuffer = function () {
        return this._depthRenderbuffer;
      }),
      (L.prototype.getTextureColor = function () {
        return this._colorTextures[0];
      }),
      (L.prototype.getTextureColorNum = function (t) {
        return this._colorTextures[t];
      }),
      (L.prototype.getTextureDepth = function () {
        return this._textureDepth;
      }),
      (L.prototype.setFilter = function (t) {
        for (let e = 0; e < this._numRenderBuffers; e++)
          (this._colorTextures[e].filter = t),
            this._colorTextures[e].setSize(this._width, this._height);
      }),
      (L.prototype.delete = L.prototype.dispose =
        function () {
          this._disposed = !0;
          let t = 0;
          for (t = 0; t < this._numRenderBuffers; t++)
            this._colorTextures[t].delete();
          for (
            this._textureDepth && this._textureDepth.delete(), t = 0;
            t < this._numRenderBuffers;
            t++
          )
            this._cgl.gl.deleteRenderbuffer(this._colorRenderbuffers[t]);
          this._cgl.gl.deleteRenderbuffer(this._depthRenderbuffer),
            this._cgl.gl.deleteFramebuffer(this._frameBuffer),
            this._cgl.gl.deleteFramebuffer(this._textureFrameBuffer);
        }),
      (L.prototype.setSize = function (t, e) {
        if (this._disposed)
          return this._log.warn("disposed framebuffer setsize...");
        this._cgl.profileData.addHeavyEvent("framebuffer resize", this.name);
        let i = 0;
        if (
          ((this._width = Math.floor(t)),
          (this._height = Math.floor(e)),
          (this._width = Math.min(this._width, this._cgl.maxTexSize)),
          (this._height = Math.min(this._height, this._cgl.maxTexSize)),
          this._cgl.profileData.profileFrameBuffercreate++,
          this._frameBuffer)
        ) {
          for (i = 0; i < this._numRenderBuffers; i++)
            this._cgl.gl.deleteRenderbuffer(this._colorRenderbuffers[i]);
          this._cgl.gl.deleteRenderbuffer(this._depthRenderbuffer),
            this._cgl.gl.deleteFramebuffer(this._frameBuffer),
            this._cgl.gl.deleteFramebuffer(this._textureFrameBuffer);
        }
        (this._frameBuffer = this._cgl.gl.createFramebuffer()),
          (this._textureFrameBuffer = this._cgl.gl.createFramebuffer());
        const s = this._options.depth;
        for (i = 0; i < this._numRenderBuffers; i++)
          this._colorTextures[i].setSize(this._width, this._height);
        for (i = 0; i < this._numRenderBuffers; i++) {
          const t = this._cgl.gl.createRenderbuffer();
          this._cgl.gl.getExtension("EXT_color_buffer_float");
          if (
            (this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this._frameBuffer
            ),
            this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, t),
            this._options.isFloatingPointTexture)
          ) {
            this._cgl.gl.getExtension("EXT_color_buffer_float"),
              this._cgl.gl.getExtension("EXT_color_buffer_float_linear"),
              this._cgl.gl.getExtension("OES_texture_float_linear");
            if (
              this._options.multisampling &&
              this._options.multisamplingSamples
            )
              this._cgl.gl.renderbufferStorageMultisample(
                this._cgl.gl.RENDERBUFFER,
                this._options.multisamplingSamples,
                this._cgl.gl.RGBA32F,
                this._width,
                this._height
              );
            else {
              let t = this._cgl.gl.RGBA32F;
              this._cgl._isSafariCrap && (t = this._cgl.gl.RGBA16F),
                this._cgl.gl.renderbufferStorage(
                  this._cgl.gl.RENDERBUFFER,
                  t,
                  this._width,
                  this._height
                );
            }
          } else
            this._options.multisampling && this._options.multisamplingSamples
              ? this._cgl.gl.renderbufferStorageMultisample(
                  this._cgl.gl.RENDERBUFFER,
                  this._options.multisamplingSamples,
                  this._cgl.gl.RGBA8,
                  this._width,
                  this._height
                )
              : this._cgl.gl.renderbufferStorage(
                  this._cgl.gl.RENDERBUFFER,
                  this._cgl.gl.RGBA8,
                  this._width,
                  this._height
                );
          this._cgl.gl.framebufferRenderbuffer(
            this._cgl.gl.FRAMEBUFFER,
            this._cgl.gl.COLOR_ATTACHMENT0 + i,
            this._cgl.gl.RENDERBUFFER,
            t
          ),
            (this._colorRenderbuffers[i] = t);
        }
        for (
          this._cgl.gl.bindFramebuffer(
            this._cgl.gl.FRAMEBUFFER,
            this._textureFrameBuffer
          ),
            i = 0;
          i < this._numRenderBuffers;
          i++
        )
          this._cgl.gl.framebufferTexture2D(
            this._cgl.gl.FRAMEBUFFER,
            this._cgl.gl.COLOR_ATTACHMENT0 + i,
            this._cgl.gl.TEXTURE_2D,
            this._colorTextures[i].tex,
            0
          );
        this._options.depth &&
          this._cgl.gl.framebufferTexture2D(
            this._cgl.gl.FRAMEBUFFER,
            this._cgl.gl.DEPTH_ATTACHMENT,
            this._cgl.gl.TEXTURE_2D,
            this._textureDepth.tex,
            0
          ),
          this._cgl.gl.bindFramebuffer(
            this._cgl.gl.FRAMEBUFFER,
            this._frameBuffer
          );
        let r = this._cgl.gl.DEPTH_COMPONENT32F;
        for (
          this._cgl.glSlowRenderer && (r = this._cgl.gl.DEPTH_COMPONENT16),
            s &&
              (this._textureDepth.setSize(this._width, this._height),
              (this._depthRenderbuffer = this._cgl.gl.createRenderbuffer()),
              this._cgl.gl.bindRenderbuffer(
                this._cgl.gl.RENDERBUFFER,
                this._depthRenderbuffer
              ),
              this._options.isFloatingPointTexture,
              this._options.multisampling
                ? this._cgl.gl.renderbufferStorageMultisample(
                    this._cgl.gl.RENDERBUFFER,
                    this._options.multisamplingSamples,
                    r,
                    this._width,
                    this._height
                  )
                : this._cgl.gl.renderbufferStorage(
                    this._cgl.gl.RENDERBUFFER,
                    r,
                    this._width,
                    this._height
                  ),
              this._cgl.gl.framebufferRenderbuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._cgl.gl.DEPTH_ATTACHMENT,
                this._cgl.gl.RENDERBUFFER,
                this._depthRenderbuffer
              )),
            this._drawTargetArray.length = 0,
            i = 0;
          i < this._numRenderBuffers;
          i++
        )
          this._drawTargetArray.push(this._cgl.gl.COLOR_ATTACHMENT0 + i);
        this._cgl.gl.isFramebuffer(this._textureFrameBuffer) ||
          this._log.warn("invalid framebuffer");
        const n = this._cgl.gl.checkFramebufferStatus(this._cgl.gl.FRAMEBUFFER);
        if (n != this._cgl.gl.FRAMEBUFFER_COMPLETE)
          switch (
            (this._log.error("framebuffer incomplete: " + this.name, this), n)
          ) {
            case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
              throw (
                (this._log.warn("FRAMEBUFFER_INCOMPLETE_ATTACHMENT...", this),
                new Error(
                  "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT"
                ))
              );
            case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
              throw (
                (this._log.warn("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"),
                new Error(
                  "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
                ))
              );
            case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
              throw (
                (this._log.warn("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"),
                new Error(
                  "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS"
                ))
              );
            case this._cgl.gl.FRAMEBUFFER_UNSUPPORTED:
              throw (
                (this._log.warn("FRAMEBUFFER_UNSUPPORTED"),
                new Error("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED"))
              );
            default:
              throw (
                (this._log.warn("incomplete framebuffer", n),
                new Error("Incomplete framebuffer: " + n))
              );
          }
        this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
          this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null);
      }),
      (L.prototype.renderStart = function () {
        if (this._disposed)
          return this._log.warn("disposed framebuffer renderStart...");
        this._cgl.checkFrameStarted("fb2 renderstart"),
          this._cgl.pushModelMatrix(),
          this._cgl.gl.bindFramebuffer(
            this._cgl.gl.FRAMEBUFFER,
            this._frameBuffer
          ),
          this._cgl.pushGlFrameBuffer(this._frameBuffer),
          this._cgl.pushFrameBuffer(this),
          this._cgl.pushPMatrix(),
          this._cgl.gl.viewport(0, 0, this._width, this._height),
          this._cgl.gl.drawBuffers(this._drawTargetArray),
          this._options.clear &&
            (this._cgl.gl.clearColor(0, 0, 0, 0),
            this._cgl.gl.clear(
              this._cgl.gl.COLOR_BUFFER_BIT | this._cgl.gl.DEPTH_BUFFER_BIT
            ));
      }),
      (L.prototype.renderEnd = function () {
        if (this._disposed)
          return this._log.warn("disposed framebuffer renderEnd...");
        if (
          (this._cgl.popPMatrix(),
          this._cgl.profileData.profileFramebuffer++,
          this._numRenderBuffers <= 1)
        )
          this._cgl.gl.bindFramebuffer(
            this._cgl.gl.READ_FRAMEBUFFER,
            this._frameBuffer
          ),
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.DRAW_FRAMEBUFFER,
              this._textureFrameBuffer
            ),
            this._cgl.gl.clearBufferfv(this._cgl.gl.COLOR, 0, [0, 0, 0, 1]),
            this._cgl.gl.blitFramebuffer(
              0,
              0,
              this._width,
              this._height,
              0,
              0,
              this._width,
              this._height,
              this._cgl.gl.COLOR_BUFFER_BIT | this._cgl.gl.DEPTH_BUFFER_BIT,
              this._cgl.gl.NEAREST
            );
        else {
          this._cgl.gl.bindFramebuffer(
            this._cgl.gl.FRAMEBUFFER,
            this.Framebuffer2BlittingFramebuffer
          ),
            this._cgl.gl.framebufferRenderbuffer(
              this._cgl.gl.FRAMEBUFFER,
              this._cgl.gl.DEPTH_ATTACHMENT,
              this._cgl.gl.RENDERBUFFER,
              this._depthRenderbuffer
            ),
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this.Framebuffer2FinalFramebuffer
            ),
            this._cgl.gl.framebufferTexture2D(
              this._cgl.gl.FRAMEBUFFER,
              this._cgl.gl.DEPTH_ATTACHMENT,
              this._cgl.gl.TEXTURE_2D,
              this._textureDepth.tex,
              0
            );
          for (let t = 0; t < this._numRenderBuffers; t++) {
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this.Framebuffer2BlittingFramebuffer
            ),
              this._cgl.gl.framebufferRenderbuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._cgl.gl.COLOR_ATTACHMENT0,
                this._cgl.gl.RENDERBUFFER,
                this._colorRenderbuffers[t]
              ),
              this._cgl.gl.bindFramebuffer(
                this._cgl.gl.FRAMEBUFFER,
                this.Framebuffer2FinalFramebuffer
              ),
              this._cgl.gl.framebufferTexture2D(
                this._cgl.gl.FRAMEBUFFER,
                this._cgl.gl.COLOR_ATTACHMENT0,
                this._cgl.gl.TEXTURE_2D,
                this._colorTextures[t].tex,
                0
              ),
              this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
              this._cgl.gl.bindFramebuffer(
                this._cgl.gl.READ_FRAMEBUFFER,
                this.Framebuffer2BlittingFramebuffer
              ),
              this._cgl.gl.bindFramebuffer(
                this._cgl.gl.DRAW_FRAMEBUFFER,
                this.Framebuffer2FinalFramebuffer
              ),
              this._cgl.gl.clearBufferfv(this._cgl.gl.COLOR, 0, [0, 0, 0, 1]);
            let e = this._cgl.gl.COLOR_BUFFER_BIT;
            0 == t && (e |= this._cgl.gl.DEPTH_BUFFER_BIT),
              this._cgl.gl.blitFramebuffer(
                0,
                0,
                this._width,
                this._height,
                0,
                0,
                this._width,
                this._height,
                e,
                this._cgl.gl.NEAREST
              );
          }
        }
        if (
          (this._cgl.gl.bindFramebuffer(
            this._cgl.gl.FRAMEBUFFER,
            this._cgl.popGlFrameBuffer()
          ),
          this._cgl.popFrameBuffer(),
          this._cgl.popModelMatrix(),
          this._cgl.resetViewPort(),
          this._colorTextures[0].filter == B.FILTER_MIPMAP)
        )
          for (let t = 0; t < this._numRenderBuffers; t++)
            this._cgl.gl.bindTexture(
              this._cgl.gl.TEXTURE_2D,
              this._colorTextures[t].tex
            ),
              this._colorTextures[t].updateMipMap(),
              this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null);
      });
    const k =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      V = new Uint8Array(256);
    for (let t = 0; t < k.length; t++) V[k.charCodeAt(t)] = t;
    const D = V,
      G = function (t) {
        t.buffer && (t = t.buffer);
        let e,
          i = new Uint8Array(t),
          s = i.length,
          r = "";
        for (e = 0; e < s; e += 3)
          (r += k[i[e] >> 2]),
            (r += k[((3 & i[e]) << 4) | (i[e + 1] >> 4)]),
            (r += k[((15 & i[e + 1]) << 2) | (i[e + 2] >> 6)]),
            (r += k[63 & i[e + 2]]);
        return (
          s % 3 == 2
            ? (r = r.substring(0, r.length - 1) + "=")
            : s % 3 == 1 && (r = r.substring(0, r.length - 2) + "=="),
          r
        );
      },
      H = function (t) {
        let e,
          i,
          s,
          r,
          n,
          o = 0.75 * t.length,
          a = t.length,
          h = 0;
        "=" === t[t.length - 1] && (o--, "=" === t[t.length - 2] && o--);
        let l = new ArrayBuffer(o),
          c = new Uint8Array(l);
        for (e = 0; e < a; e += 4)
          (i = D[t.charCodeAt(e)]),
            (s = D[t.charCodeAt(e + 1)]),
            (r = D[t.charCodeAt(e + 2)]),
            (n = D[t.charCodeAt(e + 3)]),
            (c[h++] = (i << 2) | (s >> 4)),
            (c[h++] = ((15 & s) << 4) | (r >> 2)),
            (c[h++] = ((3 & r) << 6) | (63 & n));
        return l;
      };
    class z {
      constructor(t) {
        this._init(),
          (this._first = !0),
          (this._wireMesh = null),
          t && this.apply(t);
      }
      _init() {
        (this._max = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]),
          (this._min = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE]),
          (this._center = [0, 0, 0]),
          (this._size = [0, 0, 0]),
          (this._maxAxis = 0),
          (this._first = !0);
      }
      get maxAxis() {
        return this._maxAxis || 1;
      }
      get size() {
        return this._size;
      }
      get center() {
        return this._center;
      }
      get x() {
        return this._center[0];
      }
      get y() {
        return this._center[1];
      }
      get z() {
        return this._center[2];
      }
      get minX() {
        return this._min[0];
      }
      get minY() {
        return this._min[1];
      }
      get minZ() {
        return this._min[2];
      }
      get maxX() {
        return this._max[0];
      }
      get maxY() {
        return this._max[1];
      }
      get maxZ() {
        return this._max[2];
      }
      apply(t, e) {
        if (t) {
          if (t instanceof z) {
            const e = t;
            this.applyPos(e.maxX, e.maxY, e.maxZ),
              this.applyPos(e.minX, e.minY, e.minZ);
          } else
            for (let e = 0; e < t.vertices.length; e += 3)
              this.applyPos(
                t.vertices[e],
                t.vertices[e + 1],
                t.vertices[e + 2]
              );
          this.calcCenterSize();
        }
      }
      copy() {
        return new z(this);
      }
      get changed() {
        return !(
          this._max[0] == -Number.MAX_VALUE &&
          this._max[1] == -Number.MAX_VALUE &&
          this._max[2] == -Number.MAX_VALUE
        );
      }
      applyPos(t, e, i) {
        if (
          t != Number.MAX_VALUE &&
          t != -Number.MAX_VALUE &&
          e != Number.MAX_VALUE &&
          e != -Number.MAX_VALUE &&
          i != Number.MAX_VALUE &&
          i != -Number.MAX_VALUE &&
          CABLES.UTILS.isNumeric(t) &&
          CABLES.UTILS.isNumeric(e) &&
          CABLES.UTILS.isNumeric(i)
        ) {
          if (this._first)
            return (
              (this._max[0] = t),
              (this._max[1] = e),
              (this._max[2] = i),
              (this._min[0] = t),
              (this._min[1] = e),
              (this._min[2] = i),
              void (this._first = !1)
            );
          (this._max[0] = Math.max(this._max[0], t)),
            (this._max[1] = Math.max(this._max[1], e)),
            (this._max[2] = Math.max(this._max[2], i)),
            (this._min[0] = Math.min(this._min[0], t)),
            (this._min[1] = Math.min(this._min[1], e)),
            (this._min[2] = Math.min(this._min[2], i));
        }
      }
      calcCenterSize() {
        this._first ||
          ((this._size[0] = this._max[0] - this._min[0]),
          (this._size[1] = this._max[1] - this._min[1]),
          (this._size[2] = this._max[2] - this._min[2]),
          (this._center[0] = (this._min[0] + this._max[0]) / 2),
          (this._center[1] = (this._min[1] + this._max[1]) / 2),
          (this._center[2] = (this._min[2] + this._max[2]) / 2),
          (this._maxAxis = Math.max(
            this._size[2],
            Math.max(this._size[0], this._size[1])
          )));
      }
      mulMat4(t) {
        this._first &&
          ((this._max[0] = 0),
          (this._max[1] = 0),
          (this._max[2] = 0),
          (this._min[0] = 0),
          (this._min[1] = 0),
          (this._min[2] = 0),
          (this._first = !1)),
          vec3.transformMat4(this._max, this._max, t),
          vec3.transformMat4(this._min, this._min, t),
          this.calcCenterSize();
      }
      render(t, e) {
        this._wireMesh || (this._wireMesh = new CGL.WireCube(t)),
          t.pushModelMatrix(),
          mat4.translate(t.mMatrix, t.mMatrix, this._center),
          this._wireMesh.render(
            t,
            this._size[0] / 2,
            this._size[1] / 2,
            this._size[2] / 2
          ),
          t.popModelMatrix();
      }
    }
    const W = function (t) {
      (this.name = t || "unknown"),
        (this._log = new a("cgl_geometry")),
        (this.faceVertCount = 3),
        (this.glPrimitive = null),
        (this._attributes = {}),
        (this._vertices = []),
        (this.verticesIndices = []),
        (this.morphTargets = []),
        Object.defineProperty(this, "vertices", {
          get() {
            return this._vertices;
          },
          set(t) {
            this.setVertices(t);
          },
        }),
        Object.defineProperty(this, "texCoords", {
          get() {
            const t = this.getAttribute("texCoords");
            return t ? t.data : [];
          },
          set(t) {
            this.setAttribute("texCoords", t, 2);
          },
        }),
        Object.defineProperty(this, "vertexNormals", {
          get() {
            const t = this.getAttribute("vertexNormals");
            return t ? t.data : [];
          },
          set(t) {
            this.setAttribute("vertexNormals", t, 3);
          },
        }),
        Object.defineProperty(this, "tangents", {
          get() {
            const t = this.getAttribute("tangents");
            return t ? t.data : [];
          },
          set(t) {
            this.setAttribute("tangents", t, 3);
          },
        }),
        Object.defineProperty(this, "biTangents", {
          get() {
            const t = this.getAttribute("biTangents");
            return t ? t.data : [];
          },
          set(t) {
            this.setAttribute("biTangents", t, 3);
          },
        }),
        Object.defineProperty(this, "vertexColors", {
          get() {
            const t = this.getAttribute("vertexColors");
            return t ? t.data : [];
          },
          set(t) {
            this.setAttribute("vertexColors", t, 4);
          },
        });
    };
    (W.prototype.clear = function () {
      (this._vertices = new Float32Array([])),
        (this.verticesIndices = []),
        (this.texCoords = new Float32Array([])),
        (this.vertexNormals = new Float32Array([])),
        (this.tangents = []),
        (this.biTangents = []);
    }),
      (W.prototype.getAttributes = function () {
        return this._attributes;
      }),
      (W.prototype.getAttribute = function (t) {
        for (const e in this._attributes)
          if (this._attributes[e].name == t) return this._attributes[e];
        return null;
      }),
      (W.prototype.setAttribute = function (t, e, i) {
        let s = "";
        (!i || i > 4) &&
          (console.log("itemsize wrong?", i, t),
          this._log.stack("itemsize"),
          (i = 3)),
          1 == i
            ? (s = "float")
            : 2 == i
            ? (s = "vec2")
            : 3 == i
            ? (s = "vec3")
            : 4 == i && (s = "vec4");
        const r = { name: t, data: e, itemSize: i, type: s };
        this._attributes[t] = r;
      }),
      (W.prototype.copyAttribute = function (t, e) {
        const i = this.getAttribute(t);
        e.setAttribute(t, new Float32Array(i.data), i.itemSize);
      }),
      (W.prototype.setVertices = function (t) {
        t instanceof Float32Array
          ? (this._vertices = t)
          : (this._vertices = new Float32Array(t));
      }),
      (W.prototype.setTexCoords = function (t) {
        t instanceof Float32Array
          ? (this.texCoords = t)
          : (this.texCoords = new Float32Array(t));
      }),
      (W.prototype.calcNormals = function (t) {
        t || this.unIndex(), this.calculateNormals({});
      }),
      (W.prototype.flipNormals = function (t, e, i) {
        let s = vec3.create();
        null == t && (t = 1), null == e && (e = 1), null == i && (i = 1);
        for (let r = 0; r < this.vertexNormals.length; r += 3)
          vec3.set(
            s,
            this.vertexNormals[r + 0],
            this.vertexNormals[r + 1],
            this.vertexNormals[r + 2]
          ),
            (s[0] *= -t),
            (s[1] *= -e),
            (s[2] *= -i),
            vec3.normalize(s, s),
            (this.vertexNormals[r + 0] = s[0]),
            (this.vertexNormals[r + 1] = s[1]),
            (this.vertexNormals[r + 2] = s[2]);
      }),
      (W.prototype.getNumTriangles = function () {
        return this.verticesIndices && this.verticesIndices.length
          ? this.verticesIndices.length / 3
          : this.vertices.length / 3;
      }),
      (W.prototype.flipVertDir = function () {
        const t = [];
        t.length = this.verticesIndices.length;
        for (let e = 0; e < this.verticesIndices.length; e += 3)
          (t[e] = this.verticesIndices[e + 2]),
            (t[e + 1] = this.verticesIndices[e + 1]),
            (t[e + 2] = this.verticesIndices[e]);
        this.verticesIndices = t;
      }),
      (W.prototype.setPointVertices = function (t) {
        if (t.length % 3 == 0) {
          t instanceof Float32Array
            ? (this.vertices = t)
            : (this.vertices = new Float32Array(t)),
            this.texCoords instanceof Float32Array ||
              (this.texCoords = new Float32Array((t.length / 3) * 2)),
            (this.verticesIndices.length = t.length / 3);
          for (let e = 0; e < t.length / 3; e++)
            (this.verticesIndices[e] = e),
              (this.texCoords[2 * e] = 0),
              (this.texCoords[2 * e + 1] = 0);
        } else
          this._log.error("SetPointVertices: Array must be multiple of three.");
      }),
      (W.prototype.merge = function (t) {
        if (!t) return;
        if (
          this.isIndexed() != t.isIndexed() &&
          (this.isIndexed() && this.unIndex(!1, !0), t.isIndexed())
        ) {
          const e = t.copy();
          e.unIndex(!1, !0), (t = e);
        }
        const e = this.verticesIndices.length,
          i = this._vertices.length / 3;
        this.verticesIndices.length =
          this.verticesIndices.length + t.verticesIndices.length;
        for (let s = 0; s < t.verticesIndices.length; s++)
          this.verticesIndices[e + s] = t.verticesIndices[s] + i;
        (this.vertices = g.float32Concat(this._vertices, t.vertices)),
          (this.texCoords = g.float32Concat(this.texCoords, t.texCoords)),
          (this.vertexNormals = g.float32Concat(
            this.vertexNormals,
            t.vertexNormals
          )),
          (this.tangents = g.float32Concat(this.tangents, t.tangents)),
          (this.biTangents = g.float32Concat(this.biTangents, t.biTangents));
      }),
      (W.prototype.copy = function () {
        const t = new W(this.name + " copy");
        if (
          ((t.faceVertCount = this.faceVertCount),
          (t.glPrimitive = this.glPrimitive),
          t.setVertices(this._vertices.slice(0)),
          this.verticesIndices)
        ) {
          t.verticesIndices.length = this.verticesIndices.length;
          for (let e = 0; e < this.verticesIndices.length; e++)
            t.verticesIndices[e] = this.verticesIndices[e];
        }
        for (let e in this._attributes) this.copyAttribute(e, t);
        t.morphTargets.length = this.morphTargets.length;
        for (let e = 0; e < this.morphTargets.length; e++)
          t.morphTargets[e] = this.morphTargets[e];
        return t;
      }),
      (W.prototype.calculateNormals = function (t) {
        const e = vec3.create(),
          i = vec3.create(),
          s = vec3.create();
        function r(r) {
          return (
            vec3.subtract(e, r[0], r[1]),
            vec3.subtract(i, r[0], r[2]),
            vec3.cross(s, e, i),
            vec3.normalize(s, s),
            t &&
              t.forceZUp &&
              s[2] < 0 &&
              ((s[0] *= -1), (s[1] *= -1), (s[2] *= -1)),
            s
          );
        }
        (this.getVertexVec = function (t) {
          const e = [0, 0, 0];
          return (
            (e[0] = this.vertices[3 * t + 0]),
            (e[1] = this.vertices[3 * t + 1]),
            (e[2] = this.vertices[3 * t + 2]),
            e
          );
        }),
          (this.vertexNormals instanceof Float32Array &&
            this.vertexNormals.length == this.vertices.length) ||
            (this.vertexNormals = new Float32Array(this.vertices.length));
        for (let t = 0; t < this.vertices.length; t++)
          this.vertexNormals[t] = 0;
        if (this.isIndexed()) {
          const t = [];
          t.length = Math.floor(this.verticesIndices.length / 3);
          for (let e = 0; e < this.verticesIndices.length; e += 3) {
            const i = [
              this.getVertexVec(this.verticesIndices[e + 0]),
              this.getVertexVec(this.verticesIndices[e + 1]),
              this.getVertexVec(this.verticesIndices[e + 2]),
            ];
            (t[e / 3] = r(i)),
              (this.vertexNormals[3 * this.verticesIndices[e + 0] + 0] +=
                t[e / 3][0]),
              (this.vertexNormals[3 * this.verticesIndices[e + 0] + 1] +=
                t[e / 3][1]),
              (this.vertexNormals[3 * this.verticesIndices[e + 0] + 2] +=
                t[e / 3][2]),
              (this.vertexNormals[3 * this.verticesIndices[e + 1] + 0] +=
                t[e / 3][0]),
              (this.vertexNormals[3 * this.verticesIndices[e + 1] + 1] +=
                t[e / 3][1]),
              (this.vertexNormals[3 * this.verticesIndices[e + 1] + 2] +=
                t[e / 3][2]),
              (this.vertexNormals[3 * this.verticesIndices[e + 2] + 0] +=
                t[e / 3][0]),
              (this.vertexNormals[3 * this.verticesIndices[e + 2] + 1] +=
                t[e / 3][1]),
              (this.vertexNormals[3 * this.verticesIndices[e + 2] + 2] +=
                t[e / 3][2]);
          }
          for (let t = 0; t < this.verticesIndices.length; t += 3)
            for (let e = 0; e < 3; e++) {
              const i = [
                this.vertexNormals[3 * this.verticesIndices[t + e] + 0],
                this.vertexNormals[3 * this.verticesIndices[t + e] + 1],
                this.vertexNormals[3 * this.verticesIndices[t + e] + 2],
              ];
              vec3.normalize(i, i),
                (this.vertexNormals[3 * this.verticesIndices[t + e] + 0] =
                  i[0]),
                (this.vertexNormals[3 * this.verticesIndices[t + e] + 1] =
                  i[1]),
                (this.vertexNormals[3 * this.verticesIndices[t + e] + 2] =
                  i[2]);
            }
        } else {
          const t = [];
          for (let e = 0; e < this.vertices.length; e += 9) {
            const i = r([
              [
                this.vertices[e + 0],
                this.vertices[e + 1],
                this.vertices[e + 2],
              ],
              [
                this.vertices[e + 3],
                this.vertices[e + 4],
                this.vertices[e + 5],
              ],
              [
                this.vertices[e + 6],
                this.vertices[e + 7],
                this.vertices[e + 8],
              ],
            ]);
            t.push(i[0], i[1], i[2], i[0], i[1], i[2], i[0], i[1], i[2]);
          }
          this.vertexNormals = t;
        }
      }),
      (W.prototype.calcTangentsBitangents = function () {
        if (!this.vertices.length)
          return void this._log.error(
            "Cannot calculate tangents/bitangents without vertices."
          );
        if (!this.vertexNormals.length)
          return void this._log.error(
            "Cannot calculate tangents/bitangents without normals."
          );
        if (!this.texCoords.length) {
          const t = (this.vertices.length / 3) * 2;
          this.texCoords = new Float32Array(t);
          for (let e = 0; e < t; e += 1) this.texCoords[e] = 0;
        }
        if (!this.verticesIndices || !this.verticesIndices.length)
          return void this._log.error(
            "Cannot calculate tangents/bitangents without vertex indices."
          );
        if (this.verticesIndices.length % 3 != 0)
          return void this._log.error("Vertex indices mismatch!");
        const t = this.verticesIndices.length / 3,
          e = this.vertices.length / 3;
        (this.tangents = new Float32Array(this.vertexNormals.length)),
          (this.biTangents = new Float32Array(this.vertexNormals.length));
        const i = [];
        i.length = 2 * e;
        const s = vec3.create(),
          r = vec3.create(),
          n = vec3.create(),
          o = vec2.create(),
          a = vec2.create(),
          h = vec2.create(),
          l = vec3.create(),
          c = vec3.create();
        for (let u = 0; u < t; u += 1) {
          const t = this.verticesIndices[3 * u],
            g = this.verticesIndices[3 * u + 1],
            p = this.verticesIndices[3 * u + 2];
          vec3.set(
            s,
            this.vertices[3 * t],
            this.vertices[3 * t + 1],
            this.vertices[3 * t + 2]
          ),
            vec3.set(
              r,
              this.vertices[3 * g],
              this.vertices[3 * g + 1],
              this.vertices[3 * g + 2]
            ),
            vec3.set(
              n,
              this.vertices[3 * p],
              this.vertices[3 * p + 1],
              this.vertices[3 * p + 2]
            ),
            vec2.set(o, this.texCoords[2 * t], this.texCoords[2 * t + 1]),
            vec2.set(a, this.texCoords[2 * g], this.texCoords[2 * g + 1]),
            vec2.set(h, this.texCoords[2 * p], this.texCoords[2 * p + 1]);
          const _ = r[0] - s[0],
            d = n[0] - s[0],
            f = r[1] - s[1],
            m = n[1] - s[1],
            E = r[2] - s[2],
            T = n[2] - s[2],
            A = a[0] - o[0],
            b = h[0] - o[0],
            x = a[1] - o[1],
            v = h[1] - o[1],
            y = 1 / (A * v - b * x);
          vec3.set(
            l,
            (v * _ - x * d) * y,
            (v * f - x * m) * y,
            (v * E - x * T) * y
          ),
            vec3.set(
              c,
              (A * d - b * _) * y,
              (A * m - b * f) * y,
              (A * T - b * E) * y
            ),
            (i[t] = l),
            (i[g] = l),
            (i[p] = l),
            (i[t + e] = c),
            (i[g + e] = c),
            (i[p + e] = c);
        }
        const u = vec3.create(),
          g = vec3.create(),
          p = vec3.create(),
          _ = vec3.create(),
          d = vec3.create(),
          f = vec3.create(),
          m = vec3.create(),
          E = vec3.create();
        for (let t = 0; t < e; t += 1) {
          if (!i[t]) continue;
          vec3.set(
            u,
            this.vertexNormals[3 * t],
            this.vertexNormals[3 * t + 1],
            this.vertexNormals[3 * t + 2]
          ),
            vec3.set(g, i[t][0], i[t][1], i[t][2]);
          const s = vec3.dot(u, g);
          vec3.scale(d, u, s),
            vec3.subtract(f, g, d),
            vec3.normalize(E, f),
            vec3.cross(m, u, g);
          vec3.dot(m, i[t + e]);
          const r = 1;
          vec3.scale(p, E, 1 / r),
            vec3.cross(_, u, p),
            (this.tangents[3 * t + 0] = p[0]),
            (this.tangents[3 * t + 1] = p[1]),
            (this.tangents[3 * t + 2] = p[2]),
            (this.biTangents[3 * t + 0] = _[0]),
            (this.biTangents[3 * t + 1] = _[1]),
            (this.biTangents[3 * t + 2] = _[2]);
        }
      }),
      (W.prototype.isIndexed = function () {
        return 0 == this._vertices.length || 0 != this.verticesIndices.length;
      }),
      (W.prototype.unIndex = function (t, e) {
        const i = [],
          s = [],
          r = [],
          n = [],
          o = [],
          a = [];
        let h = 0,
          l = 0;
        for (l = 0; l < this.verticesIndices.length; l += 3)
          i.push(
            this.vertices[3 * this.verticesIndices[l + 0] + 0],
            this.vertices[3 * this.verticesIndices[l + 0] + 1],
            this.vertices[3 * this.verticesIndices[l + 0] + 2]
          ),
            n.push(
              this.vertexNormals[3 * this.verticesIndices[l + 0] + 0],
              this.vertexNormals[3 * this.verticesIndices[l + 0] + 1],
              this.vertexNormals[3 * this.verticesIndices[l + 0] + 2]
            ),
            this.tangents.length > 0 &&
              o.push(
                this.tangents[3 * this.verticesIndices[l + 0] + 0],
                this.tangents[3 * this.verticesIndices[l + 0] + 1],
                this.tangents[3 * this.verticesIndices[l + 0] + 2]
              ),
            this.biTangents.length > 0 &&
              a.push(
                this.biTangents[3 * this.verticesIndices[l + 0] + 0],
                this.biTangents[3 * this.verticesIndices[l + 0] + 1],
                this.biTangents[3 * this.verticesIndices[l + 0] + 2]
              ),
            this.texCoords
              ? r.push(
                  this.texCoords[2 * this.verticesIndices[l + 0] + 0],
                  this.texCoords[2 * this.verticesIndices[l + 0] + 1]
                )
              : r.push(0, 0),
            s.push(h),
            h++,
            i.push(
              this.vertices[3 * this.verticesIndices[l + 1] + 0],
              this.vertices[3 * this.verticesIndices[l + 1] + 1],
              this.vertices[3 * this.verticesIndices[l + 1] + 2]
            ),
            n.push(
              this.vertexNormals[3 * this.verticesIndices[l + 1] + 0],
              this.vertexNormals[3 * this.verticesIndices[l + 1] + 1],
              this.vertexNormals[3 * this.verticesIndices[l + 1] + 2]
            ),
            this.tangents.length > 0 &&
              o.push(
                this.tangents[3 * this.verticesIndices[l + 1] + 0],
                this.tangents[3 * this.verticesIndices[l + 1] + 1],
                this.tangents[3 * this.verticesIndices[l + 1] + 2]
              ),
            this.biTangents.length > 0 &&
              a.push(
                this.biTangents[3 * this.verticesIndices[l + 1] + 0],
                this.biTangents[3 * this.verticesIndices[l + 1] + 1],
                this.biTangents[3 * this.verticesIndices[l + 1] + 2]
              ),
            this.texCoords
              ? r.push(
                  this.texCoords[2 * this.verticesIndices[l + 1] + 0],
                  this.texCoords[2 * this.verticesIndices[l + 1] + 1]
                )
              : r.push(0, 0),
            s.push(h),
            h++,
            i.push(
              this.vertices[3 * this.verticesIndices[l + 2] + 0],
              this.vertices[3 * this.verticesIndices[l + 2] + 1],
              this.vertices[3 * this.verticesIndices[l + 2] + 2]
            ),
            n.push(
              this.vertexNormals[3 * this.verticesIndices[l + 2] + 0],
              this.vertexNormals[3 * this.verticesIndices[l + 2] + 1],
              this.vertexNormals[3 * this.verticesIndices[l + 2] + 2]
            ),
            this.tangents.length > 0 &&
              o.push(
                this.tangents[3 * this.verticesIndices[l + 2] + 0],
                this.tangents[3 * this.verticesIndices[l + 2] + 1],
                this.tangents[3 * this.verticesIndices[l + 2] + 2]
              ),
            this.biTangents.length > 0 &&
              a.push(
                this.biTangents[3 * this.verticesIndices[l + 2] + 0],
                this.biTangents[3 * this.verticesIndices[l + 2] + 1],
                this.biTangents[3 * this.verticesIndices[l + 2] + 2]
              ),
            this.texCoords
              ? r.push(
                  this.texCoords[2 * this.verticesIndices[l + 2] + 0],
                  this.texCoords[2 * this.verticesIndices[l + 2] + 1]
                )
              : r.push(0, 0),
            s.push(h),
            h++;
        (this.vertices = i),
          (this.texCoords = r),
          (this.vertexNormals = n),
          o.length > 0 && (this.tangents = o),
          a.length > 0 && (this.biTangents = a),
          (this.verticesIndices.length = 0),
          t && (this.verticesIndices = s),
          e || this.calculateNormals();
      }),
      (W.prototype.calcBarycentric = function () {
        let t = [];
        t.length = this.vertices.length;
        for (let e = 0; e < this.vertices.length; e++) t[e] = 0;
        let e = 0;
        for (let i = 0; i < this.vertices.length; i += 3)
          (t[i + e] = 1), e++, 3 == e && (e = 0);
        this.setAttribute("attrBarycentric", t, 3);
      }),
      (W.prototype.getBounds = function () {
        return new z(this);
      }),
      (W.prototype.center = function (t, e, i) {
        void 0 === t && ((t = !0), (e = !0), (i = !0));
        let s = 0;
        const r = this.getBounds(),
          n = [
            r.minX + (r.maxX - r.minX) / 2,
            r.minY + (r.maxY - r.minY) / 2,
            r.minZ + (r.maxZ - r.minZ) / 2,
          ];
        for (s = 0; s < this.vertices.length; s += 3)
          this.vertices[s + 0] == this.vertices[s + 0] &&
            (t && (this.vertices[s + 0] -= n[0]),
            e && (this.vertices[s + 1] -= n[1]),
            i && (this.vertices[s + 2] -= n[2]));
        return n;
      }),
      (W.prototype.mapTexCoords2d = function () {
        const t = this.getBounds(),
          e = this.vertices.length / 3;
        this.texCoords = new Float32Array(2 * e);
        for (let i = 0; i < e; i++) {
          const e = this.vertices[3 * i + 0],
            s = this.vertices[3 * i + 1];
          (this.texCoords[2 * i + 0] = e / (t.maxX - t.minX) + 0.5),
            (this.texCoords[2 * i + 1] = 1 - s / (t.maxY - t.minY) + 0.5);
        }
      }),
      (W.prototype.getInfo = function () {
        const t = {};
        return (
          3 == this.faceVertCount && this.verticesIndices
            ? (t.numFaces = this.verticesIndices.length / 3)
            : (t.numFaces = 0),
          this.verticesIndices &&
            this.verticesIndices.length &&
            (t.indices = this.verticesIndices.length),
          this.vertices
            ? (t.numVerts = this.vertices.length / 3)
            : (t.numVerts = 0),
          this.vertexNormals
            ? (t.numNormals = this.vertexNormals.length / 3)
            : (t.numNormals = 0),
          this.texCoords
            ? (t.numTexCoords = this.texCoords.length / 2)
            : (t.numTexCoords = 0),
          this.tangents
            ? (t.numTangents = this.tangents.length / 3)
            : (t.numTangents = 0),
          this.biTangents
            ? (t.numBiTangents = this.biTangents.length / 3)
            : (t.numBiTangents = 0),
          this.biTangents
            ? (t.numBiTangents = this.biTangents.length / 3)
            : (t.numBiTangents = 0),
          this.vertexColors
            ? (t.numVertexColors = this.vertexColors.length / 4)
            : (t.numVertexColors = 0),
          this.getAttributes()
            ? (t.numAttribs = Object.keys(this.getAttributes()).length)
            : (t.numAttribs = 0),
          (t.isIndexed = this.isIndexed()),
          t
        );
      }),
      (W.buildFromFaces = function (t, e, i) {
        const s = [],
          r = [];
        for (let e = 0; e < t.length; e += 3) {
          const n = t[e + 0],
            o = t[e + 1],
            a = t[e + 2],
            h = [-1, -1, -1];
          if (i)
            for (let t = 0; t < s.length; t += 3)
              s[t + 0] == n[0] &&
                s[t + 1] == n[1] &&
                s[t + 2] == n[2] &&
                (h[0] = t / 3),
                s[t + 0] == o[0] &&
                  s[t + 1] == o[1] &&
                  s[t + 2] == o[2] &&
                  (h[1] = t / 3),
                s[t + 0] == a[0] &&
                  s[t + 1] == a[1] &&
                  s[t + 2] == a[2] &&
                  (h[2] = t / 3);
          -1 == h[0] && (s.push(n[0], n[1], n[2]), (h[0] = (s.length - 1) / 3)),
            -1 == h[1] &&
              (s.push(o[0], o[1], o[2]), (h[1] = (s.length - 1) / 3)),
            -1 == h[2] &&
              (s.push(a[0], a[1], a[2]), (h[2] = (s.length - 1) / 3)),
            r.push(parseInt(h[0], 10)),
            r.push(parseInt(h[1], 10)),
            r.push(parseInt(h[2], 10));
        }
        const n = new W(e);
        return (n.name = e), (n.vertices = s), (n.verticesIndices = r), n;
      }),
      (W.json2geom = function (t) {
        const e = new W("jsonMeshGeom");
        if (
          ((e.verticesIndices = []),
          (e.vertices = t.vertices || []),
          (e.vertexNormals = t.normals || []),
          (e.vertexColors = t.colors || []),
          (e.tangents = t.tangents || []),
          (e.biTangents = t.bitangents || []),
          t.texturecoords && e.setTexCoords(t.texturecoords[0]),
          t.vertices_b64 && (e.vertices = new Float32Array(H(t.vertices_b64))),
          t.normals_b64 &&
            (e.vertexNormals = new Float32Array(H(t.normals_b64))),
          t.tangents_b64 && (e.tangents = new Float32Array(H(t.tangents_b64))),
          t.bitangents_b64 &&
            (e.biTangents = new Float32Array(H(t.bitangents_b64))),
          t.texturecoords_b64 &&
            e.setTexCoords(new Float32Array(H(t.texturecoords_b64[0]))),
          t.faces_b64)
        )
          e.verticesIndices = new Uint32Array(H(t.faces_b64));
        else {
          e.verticesIndices.length = 3 * t.faces.length;
          for (let i = 0; i < t.faces.length; i++)
            (e.verticesIndices[3 * i] = t.faces[i][0]),
              (e.verticesIndices[3 * i + 1] = t.faces[i][1]),
              (e.verticesIndices[3 * i + 2] = t.faces[i][2]);
        }
        return e;
      });
    const Y = function () {
        (this._log = new a("eventtaget")),
          (this._eventCallbacks = {}),
          (this._logName = ""),
          (this._logEvents = !1),
          (this._listeners = {}),
          (this.addEventListener = this.on =
            function (t, e, i) {
              const s = { id: (i || "") + CABLES.uuid(), name: t, cb: e };
              return (
                this._eventCallbacks[t]
                  ? this._eventCallbacks[t].push(s)
                  : (this._eventCallbacks[t] = [s]),
                (this._listeners[s.id] = s),
                s.id
              );
            }),
          (this.hasEventListener = function (t, e) {
            if (t && !e) return !!this._listeners[t];
            if (
              (this._log.warn("old eventtarget function haseventlistener!"),
              t && e && this._eventCallbacks[t])
            ) {
              return -1 != this._eventCallbacks[t].indexOf(e);
            }
          }),
          (this.removeEventListener = this.off =
            function (t, e) {
              if (null == t) return;
              if (!e) {
                const e = this._listeners[t];
                if (!e) return;
                let i = !0;
                for (; i; ) {
                  i = !1;
                  let s = -1;
                  for (let r = 0; r < this._eventCallbacks[e.name].length; r++)
                    0 === this._eventCallbacks[e.name][r].id.indexOf(t) &&
                      ((i = !0), (s = r));
                  -1 !== s &&
                    (this._eventCallbacks[e.name].splice(s, 1),
                    delete this._listeners[t]);
                }
                return;
              }
              this._log.stack(
                " old function signature: removeEventListener! use listener id"
              );
              let i = null;
              for (let s = 0; s < this._eventCallbacks[t].length; s++)
                this._eventCallbacks[t][s].cb == e && (i = s);
              null !== i
                ? delete this._eventCallbacks[i]
                : this._log.warn("removeEventListener not found " + t);
            }),
          (this.logEvents = function (t, e) {
            (this._logEvents = t), (this._logName = e);
          }),
          (this.emitEvent = function (t, e, i, s, r, n, o) {
            if (
              (this._logEvents &&
                console.log("[event] ", this._logName, t, this._eventCallbacks),
              this._eventCallbacks[t])
            )
              for (let a = 0; a < this._eventCallbacks[t].length; a++)
                this._eventCallbacks[t][a] &&
                  this._eventCallbacks[t][a].cb(e, i, s, r, n, o);
            else
              this._logEvents &&
                console.log(
                  "[event] has no event callback",
                  t,
                  this._eventCallbacks
                );
          });
      },
      X = {
        Key: function (t) {
          (this.time = 0),
            (this.value = 0),
            (this.ui = null),
            (this.onChange = null),
            (this._easing = 0),
            (this.bezTangIn = 0),
            (this.bezTangOut = 0),
            (this.cb = null),
            (this.cbTriggered = !1);
          this.setEasing(h.EASING_LINEAR), this.set(t);
        },
      };
    (X.Key.cubicSpline = function (t, e, i) {
      let s = t * t,
        r = s * t;
      return (
        (2 * r - 3 * s + 1) * e.value +
        (r - 2 * s + t) * e.bezTangOut +
        (-2 * r + 3 * s) * i.value +
        (r - s) * i.bezTangIn
      );
    }),
      (X.Key.easeCubicSpline = function (t, e) {
        return X.Key.cubicSpline(t, this, e);
      }),
      (X.Key.linear = function (t, e, i) {
        return parseFloat(e.value) + parseFloat(i.value - e.value) * t;
      }),
      (X.Key.easeLinear = function (t, e) {
        return X.Key.linear(t, this, e);
      }),
      (X.Key.easeAbsolute = function (t, e) {
        return this.value;
      });
    const j = function (t) {
      return Math.pow(2, 10 * (t - 1));
    };
    X.Key.easeExpoIn = function (t, e) {
      return (t = j(t)), X.Key.linear(t, this, e);
    };
    const K = function (t) {
      return (t = 1 - Math.pow(2, -10 * t));
    };
    X.Key.easeExpoOut = function (t, e) {
      return (t = K(t)), X.Key.linear(t, this, e);
    };
    const Q = function (t) {
      return (
        (t *= 2) < 1
          ? (t = 0.5 * Math.pow(2, 10 * (t - 1)))
          : (t--, (t = 0.5 * (2 - Math.pow(2, -10 * t)))),
        t
      );
    };
    (X.Key.easeExpoInOut = function (t, e) {
      return (t = Q(t)), X.Key.linear(t, this, e);
    }),
      (X.Key.easeSinIn = function (t, e) {
        return (
          (t = -1 * Math.cos((t * Math.PI) / 2) + 1), X.Key.linear(t, this, e)
        );
      }),
      (X.Key.easeSinOut = function (t, e) {
        return (t = Math.sin((t * Math.PI) / 2)), X.Key.linear(t, this, e);
      }),
      (X.Key.easeSinInOut = function (t, e) {
        return (
          (t = -0.5 * (Math.cos(Math.PI * t) - 1)), X.Key.linear(t, this, e)
        );
      });
    const q = function (t) {
      return (t *= t * t);
    };
    (X.Key.easeCubicIn = function (t, e) {
      return (t = q(t)), X.Key.linear(t, this, e);
    }),
      (X.Key.easeInQuint = function (t, e) {
        return (t *= t * t * t * t), X.Key.linear(t, this, e);
      }),
      (X.Key.easeOutQuint = function (t, e) {
        return (t = (t -= 1) * t * t * t * t + 1), X.Key.linear(t, this, e);
      }),
      (X.Key.easeInOutQuint = function (t, e) {
        return (
          (t /= 0.5) < 1
            ? (t *= 0.5 * t * t * t * t)
            : (t = 0.5 * ((t -= 2) * t * t * t * t + 2)),
          X.Key.linear(t, this, e)
        );
      }),
      (X.Key.easeInQuart = function (t, e) {
        return (t *= t * t * t), X.Key.linear(t, this, e);
      }),
      (X.Key.easeOutQuart = function (t, e) {
        return (t = -1 * ((t -= 1) * t * t * t - 1)), X.Key.linear(t, this, e);
      }),
      (X.Key.easeInOutQuart = function (t, e) {
        return (
          (t /= 0.5) < 1
            ? (t *= 0.5 * t * t * t)
            : (t = -0.5 * ((t -= 2) * t * t * t - 2)),
          X.Key.linear(t, this, e)
        );
      }),
      (X.Key.bounce = function (t) {
        return (
          (t /= 1) < 1 / 2.75
            ? (t *= 7.5625 * t)
            : (t =
                t < 2 / 2.75
                  ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                  : t < 2.5 / 2.75
                  ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                  : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375),
          t
        );
      }),
      (X.Key.easeInBounce = function (t, e) {
        return X.Key.linear(X.Key.bounce(t), this, e);
      }),
      (X.Key.easeOutBounce = function (t, e) {
        return X.Key.linear(X.Key.bounce(t), this, e);
      }),
      (X.Key.easeInElastic = function (t, e) {
        let i = 1.70158,
          s = 0,
          r = 1;
        return (
          0 === t
            ? (t = 0)
            : 1 == (t /= 1)
            ? (t = 1)
            : (s || (s = 0.3),
              r < Math.abs(1)
                ? ((r = 1), (i = s / 4))
                : (i = (s / (2 * Math.PI)) * Math.asin(1 / r)),
              (t =
                -r *
                  Math.pow(2, 10 * (t -= 1)) *
                  Math.sin(((1 * t - i) * (2 * Math.PI)) / s) +
                0)),
          X.Key.linear(t, this, e)
        );
      }),
      (X.Key.easeOutElastic = function (t, e) {
        let i = 1.70158,
          s = 0,
          r = 1;
        return (
          0 === t
            ? (t = 0)
            : 1 == (t /= 1)
            ? (t = 1)
            : (s || (s = 0.3),
              r < Math.abs(1)
                ? ((r = 1), (i = s / 4))
                : (i = (s / (2 * Math.PI)) * Math.asin(1 / r)),
              (t =
                r *
                  Math.pow(2, -10 * t) *
                  Math.sin(((1 * t - i) * (2 * Math.PI)) / s) +
                1 +
                0)),
          X.Key.linear(t, this, e)
        );
      }),
      (X.Key.easeInBack = function (t, e) {
        const i = 1.70158;
        return (t = t * t * ((i + 1) * t - i)), X.Key.linear(t, this, e);
      }),
      (X.Key.easeOutBack = function (t, e) {
        const i = 1.70158;
        return (
          (t = (t = t / 1 - 1) * t * ((i + 1) * t + i) + 1),
          X.Key.linear(t, this, e)
        );
      }),
      (X.Key.easeInOutBack = function (t, e) {
        let i = 1.70158;
        return (
          (t =
            (t /= 0.5) < 1
              ? t * t * ((1 + (i *= 1.525)) * t - i) * 0.5
              : 0.5 * ((t -= 2) * t * ((1 + (i *= 1.525)) * t + i) + 2)),
          X.Key.linear(t, this, e)
        );
      });
    const J = function (t) {
      return (t = --t * t * t + 1);
    };
    X.Key.easeCubicOut = function (t, e) {
      return (t = J(t)), X.Key.linear(t, this, e);
    };
    const Z = function (t) {
      return (
        (t *= 2) < 1 ? (t *= 0.5 * t * t) : (t = 0.5 * ((t -= 2) * t * t + 2)),
        t
      );
    };
    (X.Key.easeCubicInOut = function (t, e) {
      return (t = Z(t)), X.Key.linear(t, this, e);
    }),
      (X.Key.easeSmoothStep = function (t, e) {
        const i = Math.max(0, Math.min(1, t));
        return (t = i * i * (3 - 2 * i)), X.Key.linear(t, this, e);
      }),
      (X.Key.easeSmootherStep = function (t, e) {
        const i = Math.max(0, Math.min(1, (t - 0) / 1));
        return (
          (t = i * i * i * (i * (6 * i - 15) + 10)), X.Key.linear(t, this, e)
        );
      }),
      (X.Key.prototype.setEasing = function (t) {
        (this._easing = t),
          this._easing == h.EASING_LINEAR
            ? (this.ease = X.Key.easeLinear)
            : this._easing == h.EASING_ABSOLUTE
            ? (this.ease = X.Key.easeAbsolute)
            : this._easing == h.EASING_SMOOTHSTEP
            ? (this.ease = X.Key.easeSmoothStep)
            : this._easing == h.EASING_SMOOTHERSTEP
            ? (this.ease = X.Key.easeSmootherStep)
            : this._easing == h.EASING_CUBIC_IN
            ? (this.ease = X.Key.easeCubicIn)
            : this._easing == h.EASING_CUBIC_OUT
            ? (this.ease = X.Key.easeCubicOut)
            : this._easing == h.EASING_CUBIC_INOUT
            ? (this.ease = X.Key.easeCubicInOut)
            : this._easing == h.EASING_EXPO_IN
            ? (this.ease = X.Key.easeExpoIn)
            : this._easing == h.EASING_EXPO_OUT
            ? (this.ease = X.Key.easeExpoOut)
            : this._easing == h.EASING_EXPO_INOUT
            ? (this.ease = X.Key.easeExpoInOut)
            : this._easing == h.EASING_SIN_IN
            ? (this.ease = X.Key.easeSinIn)
            : this._easing == h.EASING_SIN_OUT
            ? (this.ease = X.Key.easeSinOut)
            : this._easing == h.EASING_SIN_INOUT
            ? (this.ease = X.Key.easeSinInOut)
            : this._easing == h.EASING_BACK_OUT
            ? (this.ease = X.Key.easeOutBack)
            : this._easing == h.EASING_BACK_IN
            ? (this.ease = X.Key.easeInBack)
            : this._easing == h.EASING_BACK_INOUT
            ? (this.ease = X.Key.easeInOutBack)
            : this._easing == h.EASING_ELASTIC_IN
            ? (this.ease = X.Key.easeInElastic)
            : this._easing == h.EASING_ELASTIC_OUT
            ? (this.ease = X.Key.easeOutElastic)
            : this._easing == h.EASING_ELASTIC_INOUT
            ? (this.ease = X.Key.easeElasticInOut)
            : this._easing == h.EASING_BOUNCE_IN
            ? (this.ease = X.Key.easeInBounce)
            : this._easing == h.EASING_BOUNCE_OUT
            ? (this.ease = X.Key.easeOutBounce)
            : this._easing == h.EASING_QUART_OUT
            ? (this.ease = X.Key.easeOutQuart)
            : this._easing == h.EASING_QUART_IN
            ? (this.ease = X.Key.easeInQuart)
            : this._easing == h.EASING_QUART_INOUT
            ? (this.ease = X.Key.easeInOutQuart)
            : this._easing == h.EASING_QUINT_OUT
            ? (this.ease = X.Key.easeOutQuint)
            : this._easing == h.EASING_QUINT_IN
            ? (this.ease = X.Key.easeInQuint)
            : this._easing == h.EASING_QUINT_INOUT
            ? (this.ease = X.Key.easeInOutQuint)
            : this._easing == h.EASING_CUBICSPLINE
            ? (this.ease = X.Key.easeCubicSpline)
            : ((this._easing = h.EASING_LINEAR),
              (this.ease = X.Key.easeLinear));
      }),
      (X.Key.prototype.trigger = function () {
        this.cb(), (this.cbTriggered = !0);
      }),
      (X.Key.prototype.setValue = function (t) {
        (this.value = t), null !== this.onChange && this.onChange();
      }),
      (X.Key.prototype.set = function (t) {
        t &&
          (t.e && this.setEasing(t.e),
          t.cb && ((this.cb = t.cb), (this.cbTriggered = !1)),
          t.b,
          t.hasOwnProperty("t") && (this.time = t.t),
          t.hasOwnProperty("time") && (this.time = t.time),
          t.hasOwnProperty("v")
            ? (this.value = t.v)
            : t.hasOwnProperty("value") && (this.value = t.value)),
          null !== this.onChange && this.onChange();
      }),
      (X.Key.prototype.getSerialized = function () {
        const t = {};
        return (t.t = this.time), (t.v = this.value), (t.e = this._easing), t;
      }),
      (X.Key.prototype.getEasing = function () {
        return this._easing;
      });
    const $ = function (t) {
      Y.apply(this),
        (t = t || {}),
        (this.keys = []),
        (this.onChange = null),
        (this.stayInTimeline = !1),
        (this.loop = !1),
        (this._log = new a("Anim")),
        (this.defaultEasing = t.defaultEasing || h.EASING_LINEAR),
        (this.onLooped = null),
        (this._timesLooped = 0),
        (this._needsSort = !1);
    };
    ($.prototype.forceChangeCallback = function () {
      null !== this.onChange && this.onChange(),
        this.emitEvent("onChange", this);
    }),
      ($.prototype.getLoop = function () {
        return this.loop;
      }),
      ($.prototype.setLoop = function (t) {
        (this.loop = t), this.emitEvent("onChange", this);
      }),
      ($.prototype.hasEnded = function (t) {
        return (
          0 === this.keys.length || this.keys[this.keys.length - 1].time <= t
        );
      }),
      ($.prototype.isRising = function (t) {
        if (this.hasEnded(t)) return !1;
        const e = this.getKeyIndex(t);
        return this.keys[e].value < this.keys[e + 1].value;
      }),
      ($.prototype.clearBefore = function (t) {
        const e = this.getValue(t),
          i = this.getKeyIndex(t);
        this.setValue(t, e), i > 1 && this.keys.splice(0, i);
      }),
      ($.prototype.clear = function (t) {
        let e = 0;
        t && (e = this.getValue(t)),
          (this.keys.length = 0),
          t && this.setValue(t, e),
          null !== this.onChange && this.onChange(),
          this.emitEvent("onChange", this);
      }),
      ($.prototype.sortKeys = function () {
        this.keys.sort((t, e) => parseFloat(t.time) - parseFloat(e.time)),
          (this._needsSort = !1);
      }),
      ($.prototype.getLength = function () {
        return 0 === this.keys.length
          ? 0
          : this.keys[this.keys.length - 1].time;
      }),
      ($.prototype.getKeyIndex = function (t) {
        let e = 0;
        for (let i = 0; i < this.keys.length; i++)
          if ((t >= this.keys[i].time && (e = i), this.keys[i].time > t))
            return e;
        return e;
      }),
      ($.prototype.setValue = function (t, e, i) {
        let s = null;
        for (const r in this.keys)
          if (this.keys[r].time == t) {
            (s = this.keys[r]), this.keys[r].setValue(e), (this.keys[r].cb = i);
            break;
          }
        return (
          s ||
            ((s = new X.Key({
              time: t,
              value: e,
              e: this.defaultEasing,
              cb: i,
            })),
            this.keys.push(s)),
          this.onChange && this.onChange(),
          this.emitEvent("onChange", this),
          (this._needsSort = !0),
          s
        );
      }),
      ($.prototype.setKeyEasing = function (t, e) {
        this.keys[t] &&
          (this.keys[t].setEasing(e), this.emitEvent("onChange", this));
      }),
      ($.prototype.getSerialized = function () {
        const t = { keys: [] };
        t.loop = this.loop;
        for (const e in this.keys) t.keys.push(this.keys[e].getSerialized());
        return t;
      }),
      ($.prototype.getKey = function (t) {
        const e = this.getKeyIndex(t);
        return this.keys[e];
      }),
      ($.prototype.getNextKey = function (t) {
        let e = this.getKeyIndex(t) + 1;
        return (
          e >= this.keys.length && (e = this.keys.length - 1), this.keys[e]
        );
      }),
      ($.prototype.isFinished = function (t) {
        return (
          this.keys.length <= 0 || t > this.keys[this.keys.length - 1].time
        );
      }),
      ($.prototype.isStarted = function (t) {
        return !(this.keys.length <= 0) && t >= this.keys[0].time;
      }),
      ($.prototype.getValue = function (t) {
        if (0 === this.keys.length) return 0;
        if ((this._needsSort && this.sortKeys(), t < this.keys[0].time))
          return this.keys[0].value;
        const e = this.keys.length - 1;
        if (this.loop && t > this.keys[e].time) {
          t / this.keys[e].time > this._timesLooped &&
            (this._timesLooped++, this.onLooped && this.onLooped()),
            (t =
              (t - this.keys[0].time) %
              (this.keys[e].time - this.keys[0].time)),
            (t += this.keys[0].time);
        }
        const i = this.getKeyIndex(t);
        if (i >= e)
          return (
            this.keys[e].cb &&
              !this.keys[e].cbTriggered &&
              this.keys[e].trigger(),
            this.keys[e].value
          );
        const s = parseInt(i, 10) + 1,
          r = this.keys[i],
          n = this.keys[s];
        if ((r.cb && !r.cbTriggered && r.trigger(), !n)) return -1;
        const o = (t - r.time) / (n.time - r.time);
        return r.ease || this.log._warn("has no ease", r, n), r.ease(o, n);
      }),
      ($.prototype.addKey = function (t) {
        void 0 === t.time
          ? this.log.warn("key time undefined, ignoring!")
          : (this.keys.push(t),
            null !== this.onChange && this.onChange(),
            this.emitEvent("onChange", this));
      }),
      ($.prototype.easingFromString = function (t) {
        return "linear" == t
          ? h.EASING_LINEAR
          : "absolute" == t
          ? h.EASING_ABSOLUTE
          : "smoothstep" == t
          ? h.EASING_SMOOTHSTEP
          : "smootherstep" == t
          ? h.EASING_SMOOTHERSTEP
          : "Cubic In" == t
          ? h.EASING_CUBIC_IN
          : "Cubic Out" == t
          ? h.EASING_CUBIC_OUT
          : "Cubic In Out" == t
          ? h.EASING_CUBIC_INOUT
          : "Expo In" == t
          ? h.EASING_EXPO_IN
          : "Expo Out" == t
          ? h.EASING_EXPO_OUT
          : "Expo In Out" == t
          ? h.EASING_EXPO_INOUT
          : "Sin In" == t
          ? h.EASING_SIN_IN
          : "Sin Out" == t
          ? h.EASING_SIN_OUT
          : "Sin In Out" == t
          ? h.EASING_SIN_INOUT
          : "Back In" == t
          ? h.EASING_BACK_IN
          : "Back Out" == t
          ? h.EASING_BACK_OUT
          : "Back In Out" == t
          ? h.EASING_BACK_INOUT
          : "Elastic In" == t
          ? h.EASING_ELASTIC_IN
          : "Elastic Out" == t
          ? h.EASING_ELASTIC_OUT
          : "Bounce In" == t
          ? h.EASING_BOUNCE_IN
          : "Bounce Out" == t
          ? h.EASING_BOUNCE_OUT
          : "Quart Out" == t
          ? h.EASING_QUART_OUT
          : "Quart In" == t
          ? h.EASING_QUART_IN
          : "Quart In Out" == t
          ? h.EASING_QUART_INOUT
          : "Quint Out" == t
          ? h.EASING_QUINT_OUT
          : "Quint In" == t
          ? h.EASING_QUINT_IN
          : "Quint In Out" == t
          ? h.EASING_QUINT_INOUT
          : void 0;
      }),
      ($.prototype.createPort = function (t, e, i) {
        const s = t.inDropDown(e, h.EASINGS);
        return (
          s.set("linear"),
          (s.defaultValue = "linear"),
          (s.onChange = function () {
            (this.defaultEasing = this.easingFromString(s.get())), i && i();
          }.bind(this)),
          s
        );
      }),
      ($.slerpQuaternion = function (t, e, i, s, r, n) {
        $.slerpQuaternion.q1 ||
          (($.slerpQuaternion.q1 = quat.create()),
          ($.slerpQuaternion.q2 = quat.create()));
        const o = i.getKeyIndex(t);
        let a = o + 1;
        if ((a >= i.keys.length && (a = i.keys.length - 1), o == a))
          quat.set(
            e,
            i.keys[o].value,
            s.keys[o].value,
            r.keys[o].value,
            n.keys[o].value
          );
        else {
          const h = i.keys[o].time,
            l = (t - h) / (i.keys[a].time - h);
          quat.set(
            $.slerpQuaternion.q1,
            i.keys[o].value,
            s.keys[o].value,
            r.keys[o].value,
            n.keys[o].value
          ),
            quat.set(
              $.slerpQuaternion.q2,
              i.keys[a].value,
              s.keys[a].value,
              r.keys[a].value,
              n.keys[a].value
            ),
            quat.slerp(e, $.slerpQuaternion.q1, $.slerpQuaternion.q2, l);
        }
        return e;
      });
    const tt = X;
    tt.Anim = $;
    const et = function (t, e, i, s) {
      Y.apply(this),
        (this.data = {}),
        (this._log = new a("core_port")),
        (this.direction = c.PORT_DIR_IN),
        (this.id = CABLES.simpleId()),
        (this.parent = t),
        (this.links = []),
        (this.value = 0),
        (this.name = e),
        (this.type = i || l.OP_PORT_TYPE_VALUE),
        (this.uiAttribs = s || {}),
        (this.anim = null),
        (this._oldAnimVal = -5711),
        (this.defaultValue = null),
        (this._uiActiveState = !0),
        (this.ignoreValueSerialize = !1),
        (this.onLinkChanged = null),
        (this.crashed = !1),
        (this._valueBeforeLink = null),
        (this._lastAnimFrame = -1),
        (this._animated = !1),
        (this.onValueChanged = null),
        (this.onTriggered = null),
        (this.onUiActiveStateChange = null),
        (this.changeAlways = !1),
        (this._warnedDeprecated = !1),
        (this._useVariableName = null),
        (this.activityCounter = 0),
        (this._tempLastUiValue = null),
        Object.defineProperty(this, "title", {
          get() {
            return this.uiAttribs.title || this.name;
          },
        }),
        Object.defineProperty(this, "val", {
          get() {
            return (
              this._log.warn("val getter deprecated!", this),
              this._log.stack("val getter deprecated"),
              (this._warnedDeprecated = !0),
              this.get()
            );
          },
          set(t) {
            this._log.warn("val setter deprecated!", this),
              this._log.stack("val setter deprecated"),
              this.setValue(t),
              (this._warnedDeprecated = !0);
          },
        });
    };
    (et.prototype.copyLinkedUiAttrib = function (t, e) {
      if (!CABLES.UI) return;
      if (!this.isLinked()) return;
      const i = {};
      (i[t] = this.links[0].getOtherPort(this).getUiAttrib(t)),
        e.setUiAttribs(i);
    }),
      (et.prototype.getValueForDisplay = function () {
        let t = String(this.value);
        return (
          this.uiAttribs &&
            "boolnum" == this.uiAttribs.display &&
            ((t += " - "), this.value ? (t += "true") : (t += "false")),
          (t = t.replace(/(<([^>]+)>)/gi, "")),
          t.length > 100 && (t = t.substring(0, 100)),
          t
        );
      }),
      (et.prototype.onAnimToggle = function () {}),
      (et.prototype._onAnimToggle = function () {
        this.onAnimToggle();
      }),
      (et.prototype.remove = function () {
        this.removeLinks(), this.parent.removePort(this);
      }),
      (et.prototype.setUiAttribs = function (t) {
        let e = !1;
        this.uiAttribs || (this.uiAttribs = {});
        for (const i in t)
          this.uiAttribs[i] != t[i] && (e = !0),
            (this.uiAttribs[i] = t[i]),
            "group" == i &&
              this.indexPort &&
              this.indexPort.setUiAttribs({ group: t[i] });
        e && this.emitEvent("onUiAttrChange", t, this);
      }),
      (et.prototype.getUiAttribs = function () {
        return this.uiAttribs;
      }),
      (et.prototype.getUiAttrib = function (t) {
        return this.uiAttribs && this.uiAttribs.hasOwnProperty(t)
          ? this.uiAttribs[t]
          : null;
      }),
      (et.prototype.get = function () {
        return (
          this._animated &&
            this._lastAnimFrame != this.parent.patch.getFrameNum() &&
            ((this._lastAnimFrame = this.parent.patch.getFrameNum()),
            (this.value = this.anim.getValue(
              this.parent.patch.timer.getTime()
            )),
            (this._oldAnimVal = this.value),
            this.forceChange()),
          this.value
        );
      }),
      (et.prototype.set = et.prototype.setValue =
        function (t) {
          if (
            void 0 !== t &&
            this.parent.enabled &&
            !this.crashed &&
            (t !== this.value ||
              this.changeAlways ||
              this.type == l.OP_PORT_TYPE_TEXTURE ||
              this.type == l.OP_PORT_TYPE_ARRAY)
          ) {
            if (this._animated)
              this.anim.setValue(this.parent.patch.timer.getTime(), t);
            else {
              try {
                (this.value = t), this.forceChange();
              } catch (t) {
                (this.crashed = !0),
                  (this.setValue = function (t) {}),
                  (this.onTriggered = function () {}),
                  this._log.error("onvaluechanged exception cought", t),
                  this._log.error(t.stack),
                  this._log.warn("exception in: " + this.parent.name),
                  this.parent.patch.isEditorMode() &&
                    gui.showOpCrash(this.parent),
                  this.parent.patch.emitEvent("exception", t, this.parent),
                  this.parent.onError && this.parent.onError(t);
              }
              this.parent &&
                this.parent.patch &&
                this.parent.patch.isEditorMode() &&
                this.type == l.OP_PORT_TYPE_TEXTURE &&
                gui.texturePreview().updateTexturePort(this);
            }
            if (this.direction == c.PORT_DIR_OUT)
              for (let t = 0; t < this.links.length; ++t)
                this.links[t].setValue();
          }
        }),
      (et.prototype.updateAnim = function () {
        this._animated &&
          ((this.value = this.get()),
          (this._oldAnimVal != this.value || this.changeAlways) &&
            ((this._oldAnimVal = this.value), this.forceChange()),
          (this._oldAnimVal = this.value));
      }),
      (et.args = function (t) {
        return (t + "")
          .replace(/[/][/].*$/gm, "")
          .replace(/\s+/g, "")
          .replace(/[/][*][^/*]*[*][/]/g, "")
          .split("){", 1)[0]
          .replace(/^[^(]*[(]/, "")
          .replace(/=[^,]+/g, "")
          .split(",")
          .filter(Boolean);
      }),
      (et.prototype.forceChange = function () {
        this.onValueChanged || this.onChange,
          this._activity(),
          this.emitEvent("change", this.value, this),
          this.onChange
            ? this.onChange(this, this.value)
            : this.onValueChanged && this.onValueChanged(this, this.value);
      }),
      (et.prototype.getTypeString = function () {
        return this.type == l.OP_PORT_TYPE_VALUE
          ? "Number"
          : this.type == l.OP_PORT_TYPE_FUNCTION
          ? "Trigger"
          : this.type == l.OP_PORT_TYPE_OBJECT
          ? "Object"
          : this.type == l.OP_PORT_TYPE_DYNAMIC
          ? "Dynamic"
          : this.type == l.OP_PORT_TYPE_ARRAY
          ? "Array"
          : this.type == l.OP_PORT_TYPE_STRING
          ? "String"
          : "Unknown";
      }),
      (et.prototype.deSerializeSettings = function (t) {
        if (
          t &&
          (t.animated && this.setAnimated(t.animated),
          t.useVariable && this.setVariableName(t.useVariable),
          t.anim)
        ) {
          this.anim || (this.anim = new $()),
            this.anim.addEventListener("onChange", () => {
              this.parent.patch.emitEvent(
                "portAnimUpdated",
                this.parent,
                this,
                this.anim
              );
            }),
            t.anim.loop && (this.anim.loop = t.anim.loop);
          for (const e in t.anim.keys)
            this.anim.keys.push(new X.Key(t.anim.keys[e]));
        }
      }),
      (et.prototype.getSerialized = function () {
        const t = {};
        if (
          ((t.name = this.getName()),
          this.ignoreValueSerialize ||
            0 !== this.links.length ||
            (this.type == l.OP_PORT_TYPE_OBJECT &&
              this.value &&
              this.value.tex) ||
            (t.value = this.value),
          this._useVariableName && (t.useVariable = this._useVariableName),
          this._animated && (t.animated = !0),
          this.anim && (t.anim = this.anim.getSerialized()),
          "file" == this.uiAttribs.display &&
            (t.display = this.uiAttribs.display),
          this.direction == c.PORT_DIR_OUT && this.links.length > 0)
        ) {
          t.links = [];
          for (const e in this.links)
            !this.links[e].ignoreInSerialize &&
              this.links[e].portIn &&
              this.links[e].portOut &&
              t.links.push(this.links[e].getSerialized());
        }
        return t;
      }),
      (et.prototype.shouldLink = function () {
        return !0;
      }),
      (et.prototype.removeLinks = function () {
        let t = 0;
        for (; this.links.length > 0; ) {
          if ((t++, t > 5e3)) {
            this._log.warn("could not delete links... / infinite loop"),
              (this.links.length = 0);
            break;
          }
          this.links[0].remove();
        }
      }),
      (et.prototype.removeLink = function (t) {
        for (const e in this.links)
          this.links[e] == t && this.links.splice(e, 1);
        this.direction == c.PORT_DIR_IN &&
          (this.type == l.OP_PORT_TYPE_VALUE
            ? this.setValue(this._valueBeforeLink || 0)
            : this.setValue(this._valueBeforeLink || null)),
          CABLES.UI &&
            this.parent.checkLinkTimeWarnings &&
            this.parent.checkLinkTimeWarnings(),
          this.onLinkChanged && this.onLinkChanged(),
          this.emitEvent("onLinkChanged"),
          this.parent.emitEvent("onLinkChanged");
      }),
      (et.prototype.getName = function () {
        return this.name;
      }),
      (et.prototype.addLink = function (t) {
        (this._valueBeforeLink = this.value),
          this.links.push(t),
          CABLES.UI &&
            this.parent.checkLinkTimeWarnings &&
            this.parent.checkLinkTimeWarnings(),
          this.onLinkChanged && this.onLinkChanged(),
          this.emitEvent("onLinkChanged"),
          this.parent.emitEvent("onLinkChanged");
      }),
      (et.prototype.getLinkTo = function (t) {
        for (const e in this.links)
          if (this.links[e].portIn == t || this.links[e].portOut == t)
            return this.links[e];
      }),
      (et.prototype.removeLinkTo = function (t) {
        for (const e in this.links)
          if (this.links[e].portIn == t || this.links[e].portOut == t)
            return (
              this.links[e].remove(),
              CABLES.UI &&
                this.parent.checkLinkTimeWarnings &&
                this.parent.checkLinkTimeWarnings(),
              this.onLinkChanged && this.onLinkChanged(),
              void this.emitEvent("onLinkChanged")
            );
      }),
      (et.prototype.isLinkedTo = function (t) {
        for (const e in this.links)
          if (this.links[e].portIn == t || this.links[e].portOut == t)
            return !0;
        return !1;
      }),
      (et.prototype._activity = function () {
        this.activityCounter++;
      }),
      (et.prototype.trigger = function () {
        if ((this._activity(), 0 === this.links.length)) return;
        if (!this.parent.enabled) return;
        let t = null;
        try {
          for (let e = 0; e < this.links.length; ++e)
            this.links[e].portIn &&
              ((t = this.links[e].portIn),
              t.parent.patch.pushTriggerStack(t),
              t._onTriggered(),
              t.parent.patch.popTriggerStack()),
              this.links[e] && this.links[e].activity();
        } catch (e) {
          (this.parent.enabled = !1),
            this.parent.patch.isEditorMode() &&
              (this.parent.patch.emitEvent("exception", e, t.parent),
              this.parent.patch.emitEvent("opcrash", t),
              t.parent.onError && t.parent.onError(e)),
            this._log.warn("exception!"),
            this._log.error("ontriggered exception cought", e),
            this._log.error(e.stack),
            this._log.warn("exception in: " + t.parent.name);
        }
      }),
      (et.prototype.call = function () {
        this._log.warn("call deprecated - use trigger() "), this.trigger();
      }),
      (et.prototype.execute = function () {
        this._log.warn(
          "### execute port: " + this.getName(),
          this.goals.length
        );
      }),
      (et.prototype.setVariableName = function (t) {
        this._useVariableName = t;
      }),
      (et.prototype.getVariableName = function () {
        return this._useVariableName;
      }),
      (et.prototype.setVariable = function (t) {
        this.setAnimated(!1);
        const e = { useVariable: !1 };
        this._variableIn &&
          this._varChangeListenerId &&
          (this._variableIn.off(this._varChangeListenerId),
          (this._variableIn = null)),
          t
            ? ((this._variableIn = this.parent.patch.getVar(t)),
              this._variableIn
                ? (this.type == l.OP_PORT_TYPE_OBJECT
                    ? (this._varChangeListenerId = this._variableIn.on(
                        "change",
                        () => {
                          this.set(null), this.set(this._variableIn.getValue());
                        }
                      ))
                    : (this._varChangeListenerId = this._variableIn.on(
                        "change",
                        this.set.bind(this)
                      )),
                  this.set(this._variableIn.getValue()))
                : this._log.warn("PORT VAR NOT FOUND!!!", t),
              (this._useVariableName = t),
              (e.useVariable = !0),
              (e.variableName = this._useVariableName))
            : ((e.variableName = this._useVariableName = null),
              (e.useVariable = !1)),
          this.setUiAttribs(e),
          this.parent.patch.emitEvent("portSetVariable", this.parent, this, t);
      }),
      (et.prototype._handleNoTriggerOpAnimUpdates = function (t) {
        let e = !1;
        for (let t = 0; t < this.parent.portsIn.length; t++)
          if (this.parent.portsIn.type == l.OP_PORT_TYPE_FUNCTION) {
            e = !0;
            break;
          }
        e ||
          (t
            ? (this._notriggerAnimUpdate = this.parent.patch.on(
                "onRenderFrame",
                () => {
                  this.updateAnim();
                }
              ))
            : this.parent.patch.removeEventListener(this._notriggerAnimUpdate));
      }),
      (et.prototype.setAnimated = function (t) {
        this._animated != t &&
          ((this._animated = t),
          this._animated &&
            !this.anim &&
            ((this.anim = new $()),
            this.anim.addEventListener("onChange", () => {
              this.parent.patch.emitEvent(
                "portAnimUpdated",
                this.parent,
                this,
                this.anim
              );
            })),
          this._onAnimToggle()),
          this._handleNoTriggerOpAnimUpdates(t),
          this.setUiAttribs({ isAnimated: this._animated });
      }),
      (et.prototype.toggleAnim = function () {
        (this._animated = !this._animated),
          this._animated &&
            !this.anim &&
            ((this.anim = new $()),
            this.anim.addEventListener("onChange", () => {
              this.parent.patch.emitEvent(
                "portAnimUpdated",
                this.parent,
                this,
                this.anim
              );
            })),
          this.setAnimated(this._animated),
          this._onAnimToggle(),
          this.setUiAttribs({ isAnimated: this._animated });
      }),
      (et.prototype.getType = function () {
        return this.type;
      }),
      (et.prototype.isLinked = function () {
        return (
          this.links.length > 0 ||
          this._animated ||
          null != this._useVariableName
        );
      }),
      (et.prototype.isBoundToVar = function () {
        return null != this._useVariableName;
      }),
      (et.prototype.isAnimated = function () {
        return this._animated;
      }),
      (et.prototype.isHidden = function () {
        return this.uiAttribs.hidePort;
      }),
      (et.prototype._onTriggered = function (t) {
        this._activity(),
          this.parent.updateAnims(),
          this.parent.enabled && this.onTriggered && this.onTriggered(t);
      }),
      (et.prototype._onSetProfiling = function (t) {
        this.parent.patch.profiler.add("port", this),
          this.setValue(t),
          this.parent.patch.profiler.add("port", null);
      }),
      (et.prototype._onTriggeredProfiling = function () {
        this.parent.enabled &&
          this.onTriggered &&
          (this.parent.patch.profiler.add("port", this),
          this.onTriggered(),
          this.parent.patch.profiler.add("port", null));
      }),
      (et.prototype.onValueChange = function (t) {
        this.onChange = t;
      }),
      (et.prototype.getUiActiveState = function () {
        return this._uiActiveState;
      }),
      (et.prototype.setUiActiveState = function (t) {
        (this._uiActiveState = t),
          this.onUiActiveStateChange && this.onUiActiveStateChange();
      }),
      (et.prototype.hidePort = function () {
        this._log.warn("op.hideport() is deprecated, do not use it!");
      }),
      (et.portTypeNumberToString = function (t) {
        return t == l.OP_PORT_TYPE_VALUE
          ? "value"
          : t == l.OP_PORT_TYPE_FUNCTION
          ? "function"
          : t == l.OP_PORT_TYPE_OBJECT
          ? "object"
          : t == l.OP_PORT_TYPE_ARRAY
          ? "array"
          : t == l.OP_PORT_TYPE_STRING
          ? "string"
          : t == l.OP_PORT_TYPE_DYNAMIC
          ? "dynamic"
          : "unknown";
      });
    class it extends et {
      constructor(t, e, i, s, r) {
        super(t, e, i, s),
          (this.indexPort = r),
          (this.indexPort.set = (t) => {
            const e = s.values;
            if (!e) return;
            let i = Math.floor(t);
            (i = Math.min(i, e.length - 1)),
              (i = Math.max(i, 0)),
              this.indexPort.setValue(i),
              this.set(e[i]),
              this.parent.patch.isEditorMode() &&
                window.gui &&
                gui.patchView.isCurrentOp(this.parent) &&
                gui.opParams.show(this.parent);
          });
      }
      setUiAttribs(t) {
        const e = t.hidePort;
        (t.hidePort = !0),
          super.setUiAttribs(t),
          void 0 !== e && this.indexPort.setUiAttribs({ hidePort: e });
      }
    }
    class st extends it {
      setUiAttribs(t) {
        if (this.indexPort.isLinked())
          for (const e in t) "greyout" != e || t[e] || (t[e] = "true");
        super.setUiAttribs(t);
      }
    }
    var rt = class {
      constructor(t, e, i, s, r, n, o, h, l, c) {
        if (
          ((this._log = new a("cg_uniform")),
          (this._type = e),
          (this._name = i),
          (this._shader = t),
          (this._value = 1e-5),
          (this._oldValue = null),
          (this._port = null),
          (this._structName = l),
          (this._structUniformName = h),
          (this._propertyName = c),
          this._shader._addUniform(this),
          (this.needsUpdate = !0),
          (this.shaderType = null),
          (this.comment = null),
          "f" == e)
        )
          (this.set = this.setValue = this.setValueF.bind(this)),
            (this.updateValue = this.updateValueF.bind(this));
        else if ("f[]" == e)
          (this.set = this.setValue = this.setValueArrayF.bind(this)),
            (this.updateValue = this.updateValueArrayF.bind(this));
        else if ("2f[]" == e)
          (this.set = this.setValue = this.setValueArray2F.bind(this)),
            (this.updateValue = this.updateValueArray2F.bind(this));
        else if ("3f[]" == e)
          (this.set = this.setValue = this.setValueArray3F.bind(this)),
            (this.updateValue = this.updateValueArray3F.bind(this));
        else if ("4f[]" == e)
          (this.set = this.setValue = this.setValueArray4F.bind(this)),
            (this.updateValue = this.updateValueArray4F.bind(this));
        else if ("i" == e)
          (this.set = this.setValue = this.setValueI.bind(this)),
            (this.updateValue = this.updateValueI.bind(this));
        else if ("2i" == e)
          (this.set = this.setValue = this.setValue2I.bind(this)),
            (this.updateValue = this.updateValue2I.bind(this));
        else if ("3i" == e)
          (this.set = this.setValue = this.setValue3I.bind(this)),
            (this.updateValue = this.updateValue3I.bind(this));
        else if ("4i" == e)
          (this.set = this.setValue = this.setValue4I.bind(this)),
            (this.updateValue = this.updateValue4I.bind(this));
        else if ("b" == e)
          (this.set = this.setValue = this.setValueBool.bind(this)),
            (this.updateValue = this.updateValueBool.bind(this));
        else if ("4f" == e)
          (this.set = this.setValue = this.setValue4F.bind(this)),
            (this.updateValue = this.updateValue4F.bind(this));
        else if ("3f" == e)
          (this.set = this.setValue = this.setValue3F.bind(this)),
            (this.updateValue = this.updateValue3F.bind(this));
        else if ("2f" == e)
          (this.set = this.setValue = this.setValue2F.bind(this)),
            (this.updateValue = this.updateValue2F.bind(this));
        else if ("t" == e)
          (this.set = this.setValue = this.setValueT.bind(this)),
            (this.updateValue = this.updateValueT.bind(this));
        else if ("tc" == e)
          (this.set = this.setValue = this.setValueT.bind(this)),
            (this.updateValue = this.updateValueT.bind(this));
        else if ("t[]" == e)
          (this.set = this.setValue = this.setValueArrayT.bind(this)),
            (this.updateValue = this.updateValueArrayT.bind(this));
        else {
          if ("m4" != e && "m4[]" != e) throw new Error("Unknown uniform type");
          (this.set = this.setValue = this.setValueM4.bind(this)),
            (this.updateValue = this.updateValueM4.bind(this));
        }
        "object" == typeof s && s instanceof et
          ? ((this._port = s),
            (this._value = this._port.get()),
            r && n && o
              ? ((r instanceof et && n instanceof et && o instanceof et) ||
                  this._log.error(
                    "[cgl_uniform] mixed port/value parameter for vec4 ",
                    this._name
                  ),
                (this._value = [0, 0, 0, 0]),
                (this._port2 = r),
                (this._port3 = n),
                (this._port4 = o),
                this._port.on("change", this.updateFromPort4f.bind(this)),
                this._port2.on("change", this.updateFromPort4f.bind(this)),
                this._port3.on("change", this.updateFromPort4f.bind(this)),
                this._port4.on("change", this.updateFromPort4f.bind(this)),
                this.updateFromPort4f())
              : r && n
              ? ((r instanceof et && n instanceof et) ||
                  this._log.error(
                    "[cgl_uniform] mixed port/value parameter for vec4 ",
                    this._name
                  ),
                (this._value = [0, 0, 0]),
                (this._port2 = r),
                (this._port3 = n),
                this._port.on("change", this.updateFromPort3f.bind(this)),
                this._port2.on("change", this.updateFromPort3f.bind(this)),
                this._port3.on("change", this.updateFromPort3f.bind(this)),
                this.updateFromPort3f())
              : r
              ? (r instanceof et ||
                  this._log.error(
                    "[cgl_uniform] mixed port/value parameter for vec4 ",
                    this._name
                  ),
                (this._value = [0, 0]),
                (this._port2 = r),
                this._port.on("change", this.updateFromPort2f.bind(this)),
                this._port2.on("change", this.updateFromPort2f.bind(this)),
                this.updateFromPort2f())
              : this._port.on("change", this.updateFromPort.bind(this)))
          : (this._value = s),
          this.setValue(this._value),
          (this.needsUpdate = !0);
      }
      getType() {
        return this._type;
      }
      getName() {
        return this._name;
      }
      getValue() {
        return this._value;
      }
      getShaderType() {
        return this.shaderType;
      }
      isStructMember() {
        return !!this._structName;
      }
      updateFromPort4f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          (this._value[2] = this._port3.get()),
          (this._value[3] = this._port4.get()),
          this.setValue(this._value);
      }
      updateFromPort3f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          (this._value[2] = this._port3.get()),
          this.setValue(this._value);
      }
      updateFromPort2f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          this.setValue(this._value);
      }
      updateFromPort() {
        this.setValue(this._port.get());
      }
    };
    class nt extends rt {
      constructor(t, e, i, s, r, n, o, a, h, l) {
        super(t, e, i, s, r, n, o, a, h, l),
          (this._loc = -1),
          (this._cgl = t._cgl);
      }
      copy(t) {
        const e = new nt(
          t,
          this._type,
          this._name,
          this._value,
          this._port2,
          this._port3,
          this._port4,
          this._structUniformName,
          this._structName,
          this._propertyName
        );
        return (e.shaderType = this.shaderType), e;
      }
      getGlslTypeString() {
        return nt.glslTypeString(this._type);
      }
      _isValidLoc() {
        return -1 != this._loc;
      }
      resetLoc() {
        (this._loc = -1), (this.needsUpdate = !0);
      }
      bindTextures() {}
      getLoc() {
        return this._loc;
      }
      updateFromPort4f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          (this._value[2] = this._port3.get()),
          (this._value[3] = this._port4.get()),
          this.setValue(this._value);
      }
      updateFromPort3f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          (this._value[2] = this._port3.get()),
          this.setValue(this._value);
      }
      updateFromPort2f() {
        (this._value[0] = this._port.get()),
          (this._value[1] = this._port2.get()),
          this.setValue(this._value);
      }
      updateFromPort() {
        this.setValue(this._port.get());
      }
      updateValueF() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._shader.getCgl().gl.uniform1f(this._loc, this._value),
          this._cgl.profileData.profileUniformCount++;
      }
      setValueF(t) {
        t != this._value && ((this.needsUpdate = !0), (this._value = t));
      }
      updateValueI() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._shader.getCgl().gl.uniform1i(this._loc, this._value),
          this._cgl.profileData.profileUniformCount++;
      }
      updateValue2I() {
        this._value &&
          (this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._shader
            .getCgl()
            .gl.uniform2i(this._loc, this._value[0], this._value[1]),
          (this.needsUpdate = !1),
          this._cgl.profileData.profileUniformCount++);
      }
      updateValue3I() {
        this._value &&
          (this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._shader
            .getCgl()
            .gl.uniform3i(
              this._loc,
              this._value[0],
              this._value[1],
              this._value[2]
            ),
          (this.needsUpdate = !1),
          this._cgl.profileData.profileUniformCount++);
      }
      updateValue4I() {
        this._isValidLoc() ||
          ((this._loc = this._shader
            .getCgl()
            .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._cgl.profileData.profileShaderGetUniform++,
          (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._shader
            .getCgl()
            .gl.uniform4i(
              this._loc,
              this._value[0],
              this._value[1],
              this._value[2],
              this._value[3]
            ),
          this._cgl.profileData.profileUniformCount++;
      }
      setValueI(t) {
        t != this._value && ((this.needsUpdate = !0), (this._value = t));
      }
      setValue2I(t) {
        t &&
          (this._oldValue
            ? (t[0] == this._oldValue[0] && t[1] == this._oldValue[1]) ||
              ((this._oldValue[0] = t[0]),
              (this._oldValue[1] = t[1]),
              (this.needsUpdate = !0))
            : ((this._oldValue = [t[0] - 1, 1]), (this.needsUpdate = !0)),
          (this._value = t));
      }
      setValue3I(t) {
        t &&
          (this._oldValue
            ? (t[0] == this._oldValue[0] &&
                t[1] == this._oldValue[1] &&
                t[2] == this._oldValue[2]) ||
              ((this._oldValue[0] = t[0]),
              (this._oldValue[1] = t[1]),
              (this._oldValue[2] = t[2]),
              (this.needsUpdate = !0))
            : ((this._oldValue = [t[0] - 1, 1, 2]), (this.needsUpdate = !0)),
          (this._value = t));
      }
      setValue4I(t) {
        (this.needsUpdate = !0), (this._value = t || vec4.create());
      }
      updateValueBool() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._shader.getCgl().gl.uniform1i(this._loc, this._value ? 1 : 0),
          this._cgl.profileData.profileUniformCount++;
      }
      setValueBool(t) {
        t != this._value && ((this.needsUpdate = !0), (this._value = t));
      }
      setValueArray4F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValueArray4F() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._value &&
            (this._shader.getCgl().gl.uniform4fv(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++);
      }
      setValueArray3F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValueArray3F() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._value &&
            (this._shader.getCgl().gl.uniform3fv(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++);
      }
      setValueArray2F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValueArray2F() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._value &&
            (this._shader.getCgl().gl.uniform2fv(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++);
      }
      setValueArrayF(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValueArrayF() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._value &&
            (this._shader.getCgl().gl.uniform1fv(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++);
      }
      setValueArrayT(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValue3F() {
        this._value &&
          (this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._shader
            .getCgl()
            .gl.uniform3f(
              this._loc,
              this._value[0],
              this._value[1],
              this._value[2]
            ),
          (this.needsUpdate = !1),
          this._cgl.profileData.profileUniformCount++);
      }
      setValue3F(t) {
        t &&
          (this._oldValue
            ? (t[0] == this._oldValue[0] &&
                t[1] == this._oldValue[1] &&
                t[2] == this._oldValue[2]) ||
              ((this._oldValue[0] = t[0]),
              (this._oldValue[1] = t[1]),
              (this._oldValue[2] = t[2]),
              (this.needsUpdate = !0))
            : ((this._oldValue = [t[0] - 1, 1, 2]), (this.needsUpdate = !0)),
          (this._value = t));
      }
      updateValue2F() {
        this._value &&
          (this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._shader
            .getCgl()
            .gl.uniform2f(this._loc, this._value[0], this._value[1]),
          (this.needsUpdate = !1),
          this._cgl.profileData.profileUniformCount++);
      }
      setValue2F(t) {
        t &&
          (this._oldValue
            ? (t[0] == this._oldValue[0] && t[1] == this._oldValue[1]) ||
              ((this._oldValue[0] = t[0]),
              (this._oldValue[1] = t[1]),
              (this.needsUpdate = !0))
            : ((this._oldValue = [t[0] - 1, 1]), (this.needsUpdate = !0)),
          (this._value = t));
      }
      updateValue4F() {
        this._isValidLoc() ||
          ((this._loc = this._shader
            .getCgl()
            .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._cgl.profileData.profileShaderGetUniform++,
          (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._value ||
            (this._log.warn("no value for uniform", this._name, this),
            (this._value = [0, 0, 0, 0])),
          (this.needsUpdate = !1),
          this._shader
            .getCgl()
            .gl.uniform4f(
              this._loc,
              this._value[0],
              this._value[1],
              this._value[2],
              this._value[3]
            ),
          this._cgl.profileData.profileUniformCount++;
      }
      setValue4F(t) {
        "number" == typeof this.value && (this.value = vec4.create()),
          t &&
            (this._oldValue
              ? (t[0] == this._oldValue[0] &&
                  t[1] == this._oldValue[1] &&
                  t[2] == this._oldValue[2] &&
                  t[3] == this._oldValue[3]) ||
                ((this._oldValue[0] = t[0]),
                (this._oldValue[1] = t[1]),
                (this._oldValue[2] = t[2]),
                (this.needsUpdate = !0))
              : ((this._oldValue = [t[0] - 1, 1, 2, 3]),
                (this.needsUpdate = !0)),
            (this._value = t));
      }
      updateValueM4() {
        if (
          (this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          !this._value || this._value.length % 16 != 0)
        )
          return console.log("this.name", this._name, this._value);
        this._shader.getCgl().gl.uniformMatrix4fv(this._loc, !1, this._value),
          this._cgl.profileData.profileUniformCount++;
      }
      setValueM4(t) {
        (this.needsUpdate = !0), (this._value = t || mat4.create());
      }
      updateValueArrayT() {
        this._isValidLoc()
          ? (this.needsUpdate = !1)
          : (this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._value &&
            (this._shader.getCgl().gl.uniform1iv(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++);
      }
      updateValueT() {
        this._isValidLoc() ||
          ((this._loc = this._shader
            .getCgl()
            .gl.getUniformLocation(this._shader.getProgram(), this._name)),
          this._cgl.profileData.profileShaderGetUniform++,
          (this._cgl.profileData.profileShaderGetUniformName = this._name)),
          this._cgl.profileData.profileUniformCount++,
          this._shader.getCgl().gl.uniform1i(this._loc, this._value),
          (this.needsUpdate = !1);
      }
      setValueT(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
    }
    nt.glslTypeString = (t) =>
      "f" == t
        ? "float"
        : "b" == t
        ? "bool"
        : "i" == t
        ? "int"
        : "2i" == t
        ? "ivec2"
        : "2f" == t
        ? "vec2"
        : "3f" == t
        ? "vec3"
        : "4f" == t
        ? "vec4"
        : "m4" == t
        ? "mat4"
        : "t" == t
        ? "sampler2D"
        : "tc" == t
        ? "samplerCube"
        : "3f[]" == t || "m4[]" == t || "f[]" == t
        ? null
        : void (void 0)._log.warn("[CGL UNIFORM] unknown glsl type string ", t);
    const ot = 180 / Math.PI,
      at = {
        MATH: { DEG2RAD: Math.PI / 180, RAD2DEG: ot },
        SHADER: {
          SHADERVAR_VERTEX_POSITION: "vPosition",
          SHADERVAR_VERTEX_NUMBER: "attrVertIndex",
          SHADERVAR_VERTEX_NORMAL: "attrVertNormal",
          SHADERVAR_VERTEX_TEXCOORD: "attrTexCoord",
          SHADERVAR_INSTANCE_MMATRIX: "instMat",
          SHADERVAR_VERTEX_COLOR: "attrVertColor",
          SHADERVAR_UNI_PROJMAT: "projMatrix",
          SHADERVAR_UNI_VIEWMAT: "viewMatrix",
          SHADERVAR_UNI_MODELMAT: "modelMatrix",
          SHADERVAR_UNI_NORMALMAT: "normalMatrix",
          SHADERVAR_UNI_INVVIEWMAT: "inverseViewMatrix",
          SHADERVAR_UNI_INVPROJMAT: "invProjMatrix",
          SHADERVAR_UNI_VIEWPOS: "camPos",
        },
        BLEND_MODES: {
          BLEND_NONE: 0,
          BLEND_NORMAL: 1,
          BLEND_ADD: 2,
          BLEND_SUB: 3,
          BLEND_MUL: 4,
        },
      };
    const ht = { lastMesh: null },
      lt = function (t, e, i) {
        (this._cgl = t),
          (this._log = new a("cgl_mesh")),
          (this._bufVertexAttrib = null),
          (this._bufVerticesIndizes = this._cgl.gl.createBuffer()),
          (this._indexType = this._cgl.gl.UNSIGNED_SHORT),
          (this._attributes = []),
          (this._attribLocs = {}),
          (this._geom = null),
          (this._lastShader = null),
          (this._numInstances = 0),
          (this._glPrimitive = i),
          (this._preWireframeGeom = null),
          (this.addVertexNumbers = !1),
          (this.feedBackAttributes = []),
          this.setGeom(e),
          (this._feedBacks = []),
          (this._feedBacksChanged = !1),
          (this._transformFeedBackLoc = -1),
          (this._lastAttrUpdate = 0),
          (this._name = "unknown"),
          this._cgl.profileData.addHeavyEvent("mesh constructed", this._name),
          (this._queryExt = null),
          Object.defineProperty(this, "numInstances", {
            get() {
              return this._numInstances;
            },
            set(t) {
              this.setNumInstances(t);
            },
          });
      };
    var ct;
    (lt.prototype.updateVertices = function (t) {
      this.setAttribute(at.SHADER.SHADERVAR_VERTEX_POSITION, t.vertices, 3),
        (this._numVerts = t.vertices.length / 3);
    }),
      (lt.prototype.setAttributePointer = function (t, e, i, s) {
        for (let r = 0; r < this._attributes.length; r++)
          this._attributes[r].name == t &&
            (this._attributes[r].pointer || (this._attributes[r].pointer = []),
            this._attributes[r].pointer.push({
              loc: -1,
              name: e,
              stride: i,
              offset: s,
              instanced: t == at.SHADER.SHADERVAR_INSTANCE_MMATRIX,
            }));
      }),
      (lt.prototype.getAttribute = function (t) {
        for (let e = 0; e < this._attributes.length; e++)
          if (this._attributes[e].name == t) return this._attributes[e];
      }),
      (lt.prototype.setAttributeRange = function (t, e, i, s) {
        t &&
          (i || s) &&
          (t.name || (console.log(t), this._log.stack("no attrname?!")),
          this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, t.buffer),
          (this._cgl.profileData.profileMeshAttributes += s - i || 0),
          (this._cgl.profileData.profileSingleMeshAttribute[this._name] =
            this._cgl.profileData.profileSingleMeshAttribute[this._name] || 0),
          (this._cgl.profileData.profileSingleMeshAttribute[this._name] +=
            s - i || 0),
          t.numItems < e.length / t.itemSize && this._resizeAttr(e, t),
          s >= e.length - 1 &&
            this._log.log(
              this._cgl.canvas.id +
                " " +
                t.name +
                " buffersubdata out of bounds ?",
              e.length,
              s,
              i,
              t
            ),
          1 == this._cgl.glVersion
            ? this._cgl.gl.bufferSubData(this._cgl.gl.ARRAY_BUFFER, 0, e)
            : this._cgl.gl.bufferSubData(
                this._cgl.gl.ARRAY_BUFFER,
                4 * i,
                e,
                i,
                s - i
              ));
      }),
      (lt.prototype._resizeAttr = function (t, e) {
        e.buffer && this._cgl.gl.deleteBuffer(e.buffer),
          (e.buffer = this._cgl.gl.createBuffer()),
          this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, e.buffer),
          this._bufferArray(t, e),
          (e.numItems = t.length / e.itemSize);
      }),
      (lt.prototype._bufferArray = function (t, e) {
        let i = null;
        t &&
          (this._cgl.debugOneFrame &&
            console.log("_bufferArray", t.length, e.name),
          t instanceof Float32Array
            ? (i = t)
            : e && i && i.length == t.length
            ? i.set(t)
            : ((i = new Float32Array(t)),
              this._cgl.debugOneFrame &&
                console.log(
                  "_bufferArray create new float32array",
                  t.length,
                  e.name
                ),
              this._cgl.profileData.profileNonTypedAttrib++,
              (this._cgl.profileData.profileNonTypedAttribNames =
                "(" + this._name + ":" + e.name + ")")),
          (e.arrayLength = i.length),
          this._cgl.gl.bufferData(
            this._cgl.gl.ARRAY_BUFFER,
            i,
            this._cgl.gl.DYNAMIC_DRAW
          ));
      }),
      (lt.prototype.addAttribute =
        lt.prototype.updateAttribute =
        lt.prototype.setAttribute =
          function (t, e, i, s) {
            if (!e)
              throw (
                (this._log.error("mesh addAttribute - no array given! " + t),
                new Error())
              );
            let r = null,
              n = !1,
              o = 0;
            const a = e.length / i;
            for (
              this._cgl.profileData.profileMeshAttributes += a || 0,
                "function" == typeof s && (r = s),
                "object" == typeof s &&
                  (s.cb && (r = s.cb), s.instanced && (n = s.instanced)),
                t == at.SHADER.SHADERVAR_INSTANCE_MMATRIX && (n = !0),
                o = 0;
              o < this._attributes.length;
              o++
            ) {
              const i = this._attributes[o];
              if (i.name == t)
                return (
                  i.numItems === a || this._resizeAttr(e, i),
                  this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, i.buffer),
                  this._bufferArray(e, i),
                  i
                );
            }
            const h = this._cgl.gl.createBuffer();
            this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, h);
            let l = this._cgl.gl.FLOAT;
            s && s.type && (l = s.type);
            const c = {
              buffer: h,
              name: t,
              cb: r,
              itemSize: i,
              numItems: a,
              startItem: 0,
              instanced: n,
              type: l,
            };
            return (
              this._bufferArray(e, c),
              t == at.SHADER.SHADERVAR_VERTEX_POSITION &&
                (this._bufVertexAttrib = c),
              this._attributes.push(c),
              (this._attribLocs = {}),
              c
            );
          }),
      (lt.prototype.getAttributes = function () {
        return this._attributes;
      }),
      (lt.prototype.updateTexCoords = function (t) {
        if (t.texCoords && t.texCoords.length > 0)
          this.setAttribute(
            at.SHADER.SHADERVAR_VERTEX_TEXCOORD,
            t.texCoords,
            2
          );
        else {
          const e = new Float32Array(Math.round((t.vertices.length / 3) * 2));
          this.setAttribute(at.SHADER.SHADERVAR_VERTEX_TEXCOORD, e, 2);
        }
      }),
      (lt.prototype.updateNormals = function (t) {
        if (t.vertexNormals && t.vertexNormals.length > 0)
          this.setAttribute(
            at.SHADER.SHADERVAR_VERTEX_NORMAL,
            t.vertexNormals,
            3
          );
        else {
          const e = new Float32Array(Math.round(t.vertices.length));
          this.setAttribute(at.SHADER.SHADERVAR_VERTEX_NORMAL, e, 3);
        }
      }),
      (lt.prototype._setVertexNumbers = function (t) {
        if (
          !this._verticesNumbers ||
          this._verticesNumbers.length != this._numVerts ||
          t
        ) {
          if (t) this._verticesNumbers = t;
          else {
            this._verticesNumbers = new Float32Array(this._numVerts);
            for (let t = 0; t < this._numVerts; t++)
              this._verticesNumbers[t] = t;
          }
          this.setAttribute(
            at.SHADER.SHADERVAR_VERTEX_NUMBER,
            this._verticesNumbers,
            1,
            (t, e, i) => {
              i.uniformNumVertices ||
                (i.uniformNumVertices = new nt(
                  i,
                  "f",
                  "numVertices",
                  this._numVerts
                )),
                i.uniformNumVertices.setValue(this._numVerts);
            }
          );
        }
      }),
      (lt.prototype.setVertexIndices = function (t) {
        if (this._bufVerticesIndizes)
          if (t.length > 0) {
            for (let e = 0; e < t.length; e++)
              if (t[e] >= this._numVerts)
                return void this._log.warn("invalid index in " + this._name);
            this._cgl.gl.bindBuffer(
              this._cgl.gl.ELEMENT_ARRAY_BUFFER,
              this._bufVerticesIndizes
            ),
              t instanceof Float32Array &&
                this._log.warn("vertIndices float32Array: " + this._name),
              t instanceof Uint32Array
                ? ((this.vertIndicesTyped = t),
                  (this._indexType = this._cgl.gl.UNSIGNED_INT))
                : t instanceof Uint16Array
                ? (this.vertIndicesTyped = t)
                : (this.vertIndicesTyped = new Uint16Array(t)),
              this._cgl.gl.bufferData(
                this._cgl.gl.ELEMENT_ARRAY_BUFFER,
                this.vertIndicesTyped,
                this._cgl.gl.DYNAMIC_DRAW
              ),
              (this._bufVerticesIndizes.itemSize = 1),
              (this._bufVerticesIndizes.numItems = t.length);
          } else this._bufVerticesIndizes.numItems = 0;
        else this._log.warn("no bufVerticesIndizes: " + this._name);
      }),
      (lt.prototype.setGeom = function (t, e) {
        (this._geom = t),
          null != t.glPrimitive && (this._glPrimitive = t.glPrimitive),
          this._geom &&
            this._geom.name &&
            (this._name = "mesh " + this._geom.name),
          (ht.lastMesh = null),
          this._cgl.profileData.profileMeshSetGeom++,
          this._disposeAttributes(),
          this.updateVertices(this._geom),
          this.setVertexIndices(this._geom.verticesIndices),
          this.addVertexNumbers && this._setVertexNumbers();
        const i = this._geom.getAttributes(),
          s = {
            texCoords: at.SHADER.SHADERVAR_VERTEX_TEXCOORD,
            vertexNormals: at.SHADER.SHADERVAR_VERTEX_NORMAL,
            vertexColors: at.SHADER.SHADERVAR_VERTEX_COLOR,
            tangents: "attrTangent",
            biTangents: "attrBiTangent",
          };
        for (const t in i)
          i[t].data &&
            i[t].data.length &&
            this.setAttribute(s[t] || t, i[t].data, i[t].itemSize);
        e && (this._geom = null);
      }),
      (lt.prototype._preBind = function (t) {
        for (let e = 0; e < this._attributes.length; e++)
          this._attributes[e].cb &&
            this._attributes[e].cb(this._attributes[e], this._geom, t);
      }),
      (lt.prototype._checkAttrLengths = function () {
        for (let t = 0; t < this._attributes.length; t++)
          if (
            this._attributes[t].arrayLength / this._attributes[t].itemSize <
            this._attributes[0].arrayLength / this._attributes[0].itemSize
          ) {
            let t = "unknown";
            this._geom && (t = this._geom.name);
          }
      }),
      (lt.prototype._bind = function (t) {
        if (!t.isValid()) return;
        let e = [];
        if (
          (this._attribLocs[t.id]
            ? (e = this._attribLocs[t.id])
            : (this._attribLocs[t.id] = e),
          (this._lastShader = t),
          t.lastCompile > this._lastAttrUpdate ||
            e.length != this._attributes.length)
        ) {
          this._lastAttrUpdate = t.lastCompile;
          for (let t = 0; t < this._attributes.length; t++) e[t] = -1;
        }
        for (let i = 0; i < this._attributes.length; i++) {
          const s = this._attributes[i];
          if (
            (-1 == e[i] &&
              s._attrLocationLastShaderTime != t.lastCompile &&
              ((s._attrLocationLastShaderTime = t.lastCompile),
              (e[i] = this._cgl.glGetAttribLocation(t.getProgram(), s.name)),
              this._cgl.profileData.profileAttrLoc++),
            -1 != e[i])
          )
            if (
              (this._cgl.gl.enableVertexAttribArray(e[i]),
              this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, s.buffer),
              s.instanced)
            )
              if (s.itemSize <= 4)
                (s.itemSize && 0 != s.itemSize) ||
                  this._log.warn(
                    "instanced attrib itemsize error",
                    this._geom.name,
                    s
                  ),
                  this._cgl.gl.vertexAttribPointer(
                    e[i],
                    s.itemSize,
                    s.type,
                    !1,
                    4 * s.itemSize,
                    0
                  ),
                  this._cgl.gl.vertexAttribDivisor(e[i], 1);
              else if (16 == s.itemSize) {
                const t = 64;
                this._cgl.gl.vertexAttribPointer(e[i], 4, s.type, !1, t, 0),
                  this._cgl.gl.enableVertexAttribArray(e[i] + 1),
                  this._cgl.gl.vertexAttribPointer(
                    e[i] + 1,
                    4,
                    s.type,
                    !1,
                    t,
                    16
                  ),
                  this._cgl.gl.enableVertexAttribArray(e[i] + 2),
                  this._cgl.gl.vertexAttribPointer(
                    e[i] + 2,
                    4,
                    s.type,
                    !1,
                    t,
                    32
                  ),
                  this._cgl.gl.enableVertexAttribArray(e[i] + 3),
                  this._cgl.gl.vertexAttribPointer(
                    e[i] + 3,
                    4,
                    s.type,
                    !1,
                    t,
                    48
                  ),
                  this._cgl.gl.vertexAttribDivisor(e[i], 1),
                  this._cgl.gl.vertexAttribDivisor(e[i] + 1, 1),
                  this._cgl.gl.vertexAttribDivisor(e[i] + 2, 1),
                  this._cgl.gl.vertexAttribDivisor(e[i] + 3, 1);
              } else this._log.warn("unknown instance attrib size", s.name);
            else {
              if (
                ((s.itemSize && 0 != s.itemSize) ||
                  this._log.warn("attrib itemsize error", this._name, s),
                this._cgl.gl.vertexAttribPointer(
                  e[i],
                  s.itemSize,
                  s.type,
                  !1,
                  4 * s.itemSize,
                  0
                ),
                s.pointer)
              )
                for (let e = 0; e < s.pointer.length; e++) {
                  const i = s.pointer[e];
                  -1 == i.loc &&
                    (i.loc = this._cgl.glGetAttribLocation(
                      t.getProgram(),
                      i.name
                    )),
                    this._cgl.profileData.profileAttrLoc++,
                    this._cgl.gl.enableVertexAttribArray(i.loc),
                    this._cgl.gl.vertexAttribPointer(
                      i.loc,
                      s.itemSize,
                      s.type,
                      !1,
                      i.stride,
                      i.offset
                    );
                }
              this.bindFeedback(s);
            }
        }
        0 !== this._bufVerticesIndizes.numItems &&
          this._cgl.gl.bindBuffer(
            this._cgl.gl.ELEMENT_ARRAY_BUFFER,
            this._bufVerticesIndizes
          );
      }),
      (lt.prototype.unBind = function () {
        const t = this._lastShader;
        if (((this._lastShader = null), !t)) return;
        let e = [];
        this._attribLocs[t.id]
          ? (e = this._attribLocs[t.id])
          : (this._attribLocs[t.id] = e),
          (ht.lastMesh = null);
        for (let t = 0; t < this._attributes.length; t++)
          this._attributes[t].instanced &&
            (this._attributes[t].itemSize <= 4
              ? (-1 != e[t] && this._cgl.gl.vertexAttribDivisor(e[t], 0),
                e[t] >= 0 && this._cgl.gl.disableVertexAttribArray(e[t]))
              : (this._cgl.gl.vertexAttribDivisor(e[t], 0),
                this._cgl.gl.vertexAttribDivisor(e[t] + 1, 0),
                this._cgl.gl.vertexAttribDivisor(e[t] + 2, 0),
                this._cgl.gl.vertexAttribDivisor(e[t] + 3, 0),
                this._cgl.gl.disableVertexAttribArray(e[t] + 1),
                this._cgl.gl.disableVertexAttribArray(e[t] + 2),
                this._cgl.gl.disableVertexAttribArray(e[t] + 3))),
            -1 != e[t] && this._cgl.gl.disableVertexAttribArray(e[t]);
      }),
      (lt.prototype.meshChanged = function () {
        return this._cgl.lastMesh && this._cgl.lastMesh != this;
      }),
      (lt.prototype.printDebug = function (t) {
        console.log("--attributes");
        for (let t = 0; t < this._attributes.length; t++)
          console.log("attribute " + t + " " + this._attributes[t].name);
      }),
      (lt.prototype.setNumVertices = function (t) {
        this._bufVertexAttrib.numItems = t;
      }),
      (lt.prototype.getNumVertices = function () {
        return this._bufVertexAttrib.numItems;
      }),
      (lt.prototype.render = function (t) {
        if (!t || !t.isValid()) return;
        if (
          (this._checkAttrLengths(),
          this._geom &&
            (!this._preWireframeGeom ||
              t.wireframe ||
              this._geom.isIndexed() ||
              (this.setGeom(this._preWireframeGeom),
              (this._preWireframeGeom = null)),
            t.wireframe))
        ) {
          let t = !1;
          this._geom.isIndexed() &&
            (this._preWireframeGeom ||
              ((this._preWireframeGeom = this._geom),
              (this._geom = this._geom.copy())),
            this._geom.unIndex(),
            (t = !0)),
            this._geom.getAttribute("attrBarycentric") ||
              (this._preWireframeGeom ||
                ((this._preWireframeGeom = this._geom),
                (this._geom = this._geom.copy())),
              (t = !0),
              this._geom.calcBarycentric()),
            t && this.setGeom(this._geom);
        }
        let e = !1;
        ht.lastMesh != this && (ht.lastMesh && ht.lastMesh.unBind(), (e = !0)),
          e && this._preBind(t),
          t.bind(),
          this._bind(t),
          this.addVertexNumbers && this._setVertexNumbers(),
          (ht.lastMesh = this);
        let i = this._cgl.gl.TRIANGLES;
        void 0 !== this._glPrimitive && (i = this._glPrimitive),
          null !== t.glPrimitive && (i = t.glPrimitive);
        let s = 1,
          r = this._cgl.profileData.doProfileGlQuery,
          n = !1;
        if (r) {
          let e = this._name + " " + t.getName() + " #" + t.id;
          this._numInstances && (e += " instanced " + this._numInstances + "x");
          let i = this._cgl.profileData.glQueryData[e];
          if (
            (i ||
              ((i = { id: e, num: 0 }),
              (this._cgl.profileData.glQueryData[e] = i)),
            this._queryExt ||
              !1 === this._queryExt ||
              (this._queryExt =
                this._cgl.gl.getExtension("EXT_disjoint_timer_query_webgl2") ||
                !1),
            this._queryExt)
          ) {
            if (i._drawQuery) {
              if (
                this._cgl.gl.getQueryParameter(
                  i._drawQuery,
                  this._cgl.gl.QUERY_RESULT_AVAILABLE
                )
              ) {
                const t =
                  this._cgl.gl.getQueryParameter(
                    i._drawQuery,
                    this._cgl.gl.QUERY_RESULT
                  ) / 1e6;
                (i._times += t),
                  i._numcount++,
                  (i.when = performance.now()),
                  (i._drawQuery = null),
                  (i.queryStarted = !1);
              }
            }
            i.queryStarted ||
              ((i._drawQuery = this._cgl.gl.createQuery()),
              this._cgl.gl.beginQuery(
                this._queryExt.TIME_ELAPSED_EXT,
                i._drawQuery
              ),
              (n = i.queryStarted = !0));
          }
        }
        if (
          (this.hasFeedbacks()
            ? this.drawFeedbacks(t, i)
            : 0 === this._bufVerticesIndizes.numItems
            ? (i == this._cgl.gl.TRIANGLES && (s = 3),
              0 === this._numInstances
                ? this._cgl.gl.drawArrays(
                    i,
                    this._bufVertexAttrib.startItem,
                    this._bufVertexAttrib.numItems -
                      this._bufVertexAttrib.startItem
                  )
                : this._cgl.gl.drawArraysInstanced(
                    i,
                    this._bufVertexAttrib.startItem,
                    this._bufVertexAttrib.numItems,
                    this._numInstances
                  ))
            : 0 === this._numInstances
            ? this._cgl.gl.drawElements(
                i,
                this._bufVerticesIndizes.numItems,
                this._indexType,
                0
              )
            : this._cgl.gl.drawElementsInstanced(
                i,
                this._bufVerticesIndizes.numItems,
                this._indexType,
                0,
                this._numInstances
              ),
          this._cgl.debugOneFrame &&
            this._cgl.gl.getError() != this._cgl.gl.NO_ERROR)
        ) {
          this._log.error("mesh draw gl error"),
            this._log.error("mesh", this),
            this._log.error("shader", t);
          for (
            let e = 0;
            e <
            this._cgl.gl.getProgramParameter(
              t.getProgram(),
              this._cgl.gl.ACTIVE_ATTRIBUTES
            );
            e++
          ) {
            const i = this._cgl.gl.getActiveAttrib(t.getProgram(), e).name;
            this._log.error("attrib ", i);
          }
        }
        (this._cgl.profileData.profileMeshNumElements +=
          (this._bufVertexAttrib.numItems / s) * (this._numInstances || 1)),
          this._cgl.profileData.profileMeshDraw++,
          r && n && this._cgl.gl.endQuery(this._queryExt.TIME_ELAPSED_EXT),
          this.unBind();
      }),
      (lt.prototype.setNumInstances = function (t) {
        if (((t = Math.max(0, t)), this._numInstances != t)) {
          this._numInstances = t;
          const e = new Float32Array(t);
          for (let i = 0; i < t; i++) e[i] = i;
          this.setAttribute("instanceIndex", e, 1, { instanced: !0 });
        }
      }),
      (lt.prototype._disposeAttributes = function () {
        if (this._attributes) {
          for (let t = 0; t < this._attributes.length; t++)
            this._attributes[t].buffer &&
              (this._cgl.gl.deleteBuffer(this._attributes[t].buffer),
              (this._attributes[t].buffer = null));
          this._attributes.length = 0;
        }
      }),
      (lt.prototype.dispose = function () {
        this._bufVertexAttrib &&
          this._bufVertexAttrib.buffer &&
          this._cgl.gl.deleteBuffer(this._bufVertexAttrib.buffer),
          this._bufVerticesIndizes &&
            this._cgl.gl.deleteBuffer(this._bufVerticesIndizes),
          (this._bufVerticesIndizes = null),
          this._disposeAttributes();
      }),
      ((ct = lt).prototype.hasFeedbacks = function () {
        return this._feedBacks.length > 0;
      }),
      (ct.prototype.removeFeedbacks = function (t) {
        this._feedbacks &&
          ((this._feedbacks.length = 0), (this._feedBacksChanged = !0));
      }),
      (ct.prototype.setAttributeFeedback = function () {}),
      (ct.prototype.setFeedback = function (t, e, i) {
        let s = { nameOut: e },
          r = !1;
        this.unBindFeedbacks();
        for (let t = 0; t < this._feedBacks.length; t++)
          this._feedBacks[t].nameOut == e &&
            ((s = this._feedBacks[t]), (r = !0));
        return (
          r || (this._feedBacksChanged = !0),
          (s.initialArr = i),
          (s.attrib = t),
          s.outBuffer && this._cgl.gl.deleteBuffer(s.outBuffer),
          (s.outBuffer = this._cgl.gl.createBuffer()),
          this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, s.outBuffer),
          this._cgl.gl.bufferData(
            this._cgl.gl.ARRAY_BUFFER,
            s.initialArr,
            this._cgl.gl.STATIC_DRAW
          ),
          this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, s.attrib.buffer),
          this._cgl.gl.bufferData(
            this._cgl.gl.ARRAY_BUFFER,
            s.initialArr,
            this._cgl.gl.STATIC_DRAW
          ),
          r || this._feedBacks.push(s),
          s
        );
      }),
      (ct.prototype.bindFeedback = function (t) {
        if (!this._feedBacks || 0 === this._feedBacks.length) return;
        -1 == this._transformFeedBackLoc &&
          (this._transformFeedBackLoc = this._cgl.gl.createTransformFeedback()),
          this._cgl.gl.bindTransformFeedback(
            this._cgl.gl.TRANSFORM_FEEDBACK,
            this._transformFeedBackLoc
          );
        let e = !1;
        for (let i = 0; i < this._feedBacks.length; i++) {
          const s = this._feedBacks[i];
          s.attrib == t &&
            ((e = !0),
            this._cgl.gl.bindBufferBase(
              this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER,
              i,
              s.outBuffer
            ));
        }
      }),
      (ct.prototype.drawFeedbacks = function (t, e) {
        let i = 0;
        if (this._feedBacksChanged) {
          const e = [];
          for (
            this._cgl.gl.bindTransformFeedback(
              this._cgl.gl.TRANSFORM_FEEDBACK,
              this._transformFeedBackLoc
            ),
              i = 0;
            i < this._feedBacks.length;
            i++
          )
            e.push(this._feedBacks[i].nameOut);
          return (
            t.setFeedbackNames(e),
            console.log("feedbacknames", e),
            t.compile(),
            (this._feedBacksChanged = !1),
            this._cgl.gl.bindTransformFeedback(
              this._cgl.gl.TRANSFORM_FEEDBACK,
              null
            ),
            void console.log("changed finished")
          );
        }
        this._cgl.gl.beginTransformFeedback(this.glPrimitive),
          this._cgl.gl.drawArrays(e, 0, this._feedBacks[0].attrib.numItems),
          this._cgl.gl.endTransformFeedback(),
          this.unBindFeedbacks(),
          this.feedBacksSwapBuffers();
      }),
      (ct.prototype.unBindFeedbacks = function () {
        for (let t = 0; t < this._feedBacks.length; t++)
          this._cgl.gl.bindBufferBase(
            this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER,
            t,
            null
          );
        this._cgl.gl.bindTransformFeedback(
          this._cgl.gl.TRANSFORM_FEEDBACK,
          null
        );
      }),
      (ct.prototype.feedBacksSwapBuffers = function () {
        for (let t = 0; t < this._feedBacks.length; t++) {
          const e = this._feedBacks[t].attrib.buffer;
          (this._feedBacks[t].attrib.buffer = this._feedBacks[t].outBuffer),
            (this._feedBacks[t].outBuffer = e);
        }
      });
    const ut = {
        getSimpleRect: function (t, e) {
          const i = new W(e);
          return (
            (i.vertices = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0]),
            (i.texCoords = [1, 1, 0, 1, 1, 0, 0, 0]),
            (i.verticesIndices = [0, 1, 2, 2, 1, 3]),
            (i.vertexNormals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            new lt(t, i)
          );
        },
      },
      gt = function (t, e) {
        (this._cgl = t),
          (this._log = new a("cgl_TextureEffect")),
          t.TextureEffectMesh || this.createMesh(),
          (this._textureSource = null),
          (this._options = e),
          (this.imgCompVer = 0),
          (this.aspectRatio = 1),
          (this._textureTarget = null),
          (this._frameBuf = this._cgl.gl.createFramebuffer()),
          (this._frameBuf2 = this._cgl.gl.createFramebuffer()),
          (this._renderbuffer = this._cgl.gl.createRenderbuffer()),
          (this._renderbuffer2 = this._cgl.gl.createRenderbuffer()),
          (this.switched = !1),
          (this.depth = !1);
      };
    (gt.prototype.getWidth = function () {
      return this._textureSource.width;
    }),
      (gt.prototype.getHeight = function () {
        return this._textureSource.height;
      }),
      (gt.prototype.setSourceTexture = function (t) {
        t.textureType == B.TYPE_FLOAT &&
          this._cgl.gl.getExtension("EXT_color_buffer_float"),
          null === t
            ? ((this._textureSource = new B(this._cgl)),
              this._textureSource.setSize(16, 16))
            : (this._textureSource = t),
          this._textureSource.compareSettings(this._textureTarget) ||
            (this._textureTarget && this._textureTarget.delete(),
            (this._textureTarget = this._textureSource.clone()),
            this._cgl.profileData.profileEffectBuffercreate++,
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this._frameBuf
            ),
            this._cgl.gl.bindRenderbuffer(
              this._cgl.gl.RENDERBUFFER,
              this._renderbuffer
            ),
            this.depth &&
              this._cgl.gl.renderbufferStorage(
                this._cgl.gl.RENDERBUFFER,
                this._cgl.gl.DEPTH_COMPONENT16,
                this._textureSource.width,
                this._textureSource.height
              ),
            this._cgl.gl.framebufferTexture2D(
              this._cgl.gl.FRAMEBUFFER,
              this._cgl.gl.COLOR_ATTACHMENT0,
              this._cgl.gl.TEXTURE_2D,
              this._textureTarget.tex,
              0
            ),
            this.depth &&
              this._cgl.gl.framebufferRenderbuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._cgl.gl.DEPTH_ATTACHMENT,
                this._cgl.gl.RENDERBUFFER,
                this._renderbuffer
              ),
            this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null),
            this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null),
            this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this._frameBuf2
            ),
            this._cgl.gl.bindRenderbuffer(
              this._cgl.gl.RENDERBUFFER,
              this._renderbuffer2
            ),
            this.depth &&
              this._cgl.gl.renderbufferStorage(
                this._cgl.gl.RENDERBUFFER,
                this._cgl.gl.DEPTH_COMPONENT16,
                this._textureSource.width,
                this._textureSource.height
              ),
            this._cgl.gl.framebufferTexture2D(
              this._cgl.gl.FRAMEBUFFER,
              this._cgl.gl.COLOR_ATTACHMENT0,
              this._cgl.gl.TEXTURE_2D,
              this._textureSource.tex,
              0
            ),
            this.depth &&
              this._cgl.gl.framebufferRenderbuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._cgl.gl.DEPTH_ATTACHMENT,
                this._cgl.gl.RENDERBUFFER,
                this._renderbuffer2
              ),
            this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null),
            this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null),
            this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null)),
          (this.aspectRatio =
            this._textureSource.width / this._textureSource.height);
      }),
      (gt.prototype.continueEffect = function () {
        this._cgl.pushDepthTest(!1),
          this._cgl.pushModelMatrix(),
          this._cgl.pushPMatrix(),
          this._cgl.gl.viewport(
            0,
            0,
            this.getCurrentTargetTexture().width,
            this.getCurrentTargetTexture().height
          ),
          mat4.perspective(
            this._cgl.pMatrix,
            45,
            this.getCurrentTargetTexture().width /
              this.getCurrentTargetTexture().height,
            0.1,
            1100
          ),
          this._cgl.pushPMatrix(),
          mat4.identity(this._cgl.pMatrix),
          this._cgl.pushViewMatrix(),
          mat4.identity(this._cgl.vMatrix),
          this._cgl.pushModelMatrix(),
          mat4.identity(this._cgl.mvMatrix);
      }),
      (gt.prototype.startEffect = function (t) {
        this._textureTarget
          ? ((this.switched = !1),
            this.continueEffect(),
            t && (this._bgTex = t),
            (this._countEffects = 0))
          : this._log.warn("effect has no target");
      }),
      (gt.prototype.endEffect = function () {
        this._cgl.popDepthTest(),
          this._cgl.popModelMatrix(),
          this._cgl.popPMatrix(),
          this._cgl.popModelMatrix(),
          this._cgl.popViewMatrix(),
          this._cgl.popPMatrix(),
          this._cgl.resetViewPort();
      }),
      (gt.prototype.bind = function () {
        null !== this._textureSource
          ? this.switched
            ? (this._cgl.gl.bindFramebuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._frameBuf2
              ),
              this._cgl.pushGlFrameBuffer(this._frameBuf2))
            : (this._cgl.gl.bindFramebuffer(
                this._cgl.gl.FRAMEBUFFER,
                this._frameBuf
              ),
              this._cgl.pushGlFrameBuffer(this._frameBuf))
          : this._log.warn("no base texture set!");
      }),
      (gt.prototype.finish = function () {
        null !== this._textureSource
          ? (this._cgl.TextureEffectMesh.render(this._cgl.getShader()),
            this._cgl.gl.bindFramebuffer(
              this._cgl.gl.FRAMEBUFFER,
              this._cgl.popGlFrameBuffer()
            ),
            this._cgl.profileData.profileTextureEffect++,
            this._textureTarget.filter == B.FILTER_MIPMAP &&
              (this.switched
                ? (this._cgl.gl.bindTexture(
                    this._cgl.gl.TEXTURE_2D,
                    this._textureSource.tex
                  ),
                  this._textureSource.updateMipMap())
                : (this._cgl.gl.bindTexture(
                    this._cgl.gl.TEXTURE_2D,
                    this._textureTarget.tex
                  ),
                  this._textureTarget.updateMipMap()),
              this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null)),
            (this.switched = !this.switched),
            this._countEffects++)
          : this._log.warn("no base texture set!");
      }),
      (gt.prototype.getCurrentTargetTexture = function () {
        return this.switched ? this._textureSource : this._textureTarget;
      }),
      (gt.prototype.getCurrentSourceTexture = function () {
        return 0 == this._countEffects && this._bgTex
          ? this._bgTex
          : this.switched
          ? this._textureTarget
          : this._textureSource;
      }),
      (gt.prototype.delete = function () {
        this._textureTarget && this._textureTarget.delete(),
          this._textureSource && this._textureSource.delete(),
          this._cgl.gl.deleteRenderbuffer(this._renderbuffer),
          this._cgl.gl.deleteFramebuffer(this._frameBuf);
      }),
      (gt.prototype.createMesh = function () {
        this._cgl.TextureEffectMesh = ut.getSimpleRect(
          this._cgl,
          "texEffectRect"
        );
      }),
      (gt.checkOpNotInTextureEffect = function (t) {
        return t.uiAttribs.error && !t.patch.cgl.currentTextureEffect
          ? (t.setUiError("textureeffect", null), !0)
          : !t.patch.cgl.currentTextureEffect ||
              (t.patch.cgl.currentTextureEffect && !t.uiAttribs.error
                ? (t.setUiError(
                    "textureeffect",
                    "This op can not be a child of a ImageCompose/texture effect! imagecompose should only have textureeffect childs.",
                    0
                  ),
                  !1)
                : !t.patch.cgl.currentTextureEffect);
      }),
      (gt.checkOpInEffect = function (t, e) {
        if (((e = e || 0), t.patch.cgl.currentTextureEffect)) {
          if (
            t.uiAttribs.uierrors &&
            t.patch.cgl.currentTextureEffect.imgCompVer >= e
          )
            return t.setUiError("texeffect", null), !0;
          e &&
            t.patch.cgl.currentTextureEffect.imgCompVer < e &&
            t.setUiError(
              "texeffect",
              "This op must be a child of an ImageCompose op with version >=" +
                e +
                ' <span class="button-small" onclick="gui.patchView.downGradeOp(\'' +
                t.id +
                "','" +
                t.name +
                "')\">Downgrade</span> to previous version",
              1
            );
        }
        return (
          !!t.patch.cgl.currentTextureEffect ||
          (t.patch.cgl.currentTextureEffect ||
          (t.uiAttribs.uierrors && 0 != t.uiAttribs.uierrors.length)
            ? !!t.patch.cgl.currentTextureEffect
            : (t.setUiError(
                "texeffect",
                'This op must be a child of an ImageCompose op! More infos <a href="https://docs.cables.gl/image_composition/image_composition.html" target="_blank">here</a>. ',
                1
              ),
              !1))
        );
      }),
      (gt.getBlendCode = function (t) {
        let e =
          "".endl() +
          "vec3 _blend(vec3 base,vec3 blend)".endl() +
          "{".endl() +
          "   vec3 colNew=blend;".endl() +
          "   #ifdef BM_MULTIPLY".endl() +
          "       colNew=base*blend;".endl() +
          "   #endif".endl() +
          "   #ifdef BM_MULTIPLY_INV".endl() +
          "       colNew=base* vec3(1.0)-blend;".endl() +
          "   #endif".endl() +
          "   #ifdef BM_AVERAGE".endl() +
          "       colNew=((base + blend) / 2.0);".endl() +
          "   #endif".endl() +
          "   #ifdef BM_ADD".endl() +
          "       colNew=min(base + blend, vec3(1.0));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_SUBTRACT_ONE".endl() +
          "       colNew=max(base + blend - vec3(1.0), vec3(0.0));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_SUBTRACT".endl() +
          "       colNew=base - blend;".endl() +
          "   #endif".endl() +
          "   #ifdef BM_DIFFERENCE".endl() +
          "       colNew=abs(base - blend);".endl() +
          "   #endif".endl() +
          "   #ifdef BM_NEGATION".endl() +
          "       colNew=(vec3(1.0) - abs(vec3(1.0) - base - blend));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_EXCLUSION".endl() +
          "       colNew=(base + blend - 2.0 * base * blend);".endl() +
          "   #endif".endl() +
          "   #ifdef BM_LIGHTEN".endl() +
          "       colNew=max(blend, base);".endl() +
          "   #endif".endl() +
          "   #ifdef BM_DARKEN".endl() +
          "       colNew=min(blend, base);".endl() +
          "   #endif".endl() +
          "   #ifdef BM_OVERLAY".endl() +
          "      #define BlendOverlayf(base, blend)  (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))".endl() +
          "      colNew=vec3(BlendOverlayf(base.r, blend.r),BlendOverlayf(base.g, blend.g),BlendOverlayf(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_SCREEN".endl() +
          "      #define BlendScreenf(base, blend)       (1.0 - ((1.0 - base) * (1.0 - blend)))".endl() +
          "      colNew=vec3(BlendScreenf(base.r, blend.r),BlendScreenf(base.g, blend.g),BlendScreenf(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_SOFTLIGHT".endl() +
          "      #define BlendSoftLightf(base, blend)    ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)))".endl() +
          "      colNew=vec3(BlendSoftLightf(base.r, blend.r),BlendSoftLightf(base.g, blend.g),BlendSoftLightf(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_HARDLIGHT".endl() +
          "      #define BlendOverlayf(base, blend)  (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))".endl() +
          "      colNew=vec3(BlendOverlayf(base.r, blend.r),BlendOverlayf(base.g, blend.g),BlendOverlayf(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_COLORDODGE".endl() +
          "      #define BlendColorDodgef(base, blend)   ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0))".endl() +
          "      colNew=vec3(BlendColorDodgef(base.r, blend.r),BlendColorDodgef(base.g, blend.g),BlendColorDodgef(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   #ifdef BM_COLORBURN".endl() +
          "      #define BlendColorBurnf(base, blend)    ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0))".endl() +
          "      colNew=vec3(BlendColorBurnf(base.r, blend.r),BlendColorBurnf(base.g, blend.g),BlendColorBurnf(base.b, blend.b));".endl() +
          "   #endif".endl() +
          "   return colNew;".endl() +
          "}".endl();
        return (
          t ||
            (e +=
              "vec4 cgl_blend(vec4 oldColor,vec4 newColor,float amount)".endl() +
              "{".endl() +
              "vec4 col=vec4( _blend(oldColor.rgb,newColor.rgb) ,1.0);".endl() +
              "col=vec4( mix( col.rgb, oldColor.rgb ,1.0-oldColor.a*amount),1.0);".endl() +
              "return col;".endl() +
              "}".endl()),
          t >= 3 &&
            (e +=
              "vec4 cgl_blendPixel(vec4 base,vec4 col,float amount)".endl() +
              "{".endl() +
              "vec3 colNew=_blend(base.rgb,col.rgb);".endl() +
              "float newA=clamp(base.a+(col.a*amount),0.,1.);".endl() +
              "#ifdef BM_ALPHAMASKED".endl() +
              "newA=base.a;".endl() +
              "#endif".endl() +
              "return vec4(".endl() +
              "mix(colNew,base.rgb,1.0-(amount*col.a)),".endl() +
              "newA);".endl() +
              "}".endl()),
          e
        );
      }),
      (gt.onChangeBlendSelect = function (t, e, i) {
        t.toggleDefine("BM_NORMAL", "normal" == e),
          t.toggleDefine("BM_MULTIPLY", "multiply" == e),
          t.toggleDefine("BM_MULTIPLY_INV", "multiply invert" == e),
          t.toggleDefine("BM_AVERAGE", "average" == e),
          t.toggleDefine("BM_ADD", "add" == e),
          t.toggleDefine("BM_SUBTRACT_ONE", "subtract one" == e),
          t.toggleDefine("BM_SUBTRACT", "subtract" == e),
          t.toggleDefine("BM_DIFFERENCE", "difference" == e),
          t.toggleDefine("BM_NEGATION", "negation" == e),
          t.toggleDefine("BM_EXCLUSION", "exclusion" == e),
          t.toggleDefine("BM_LIGHTEN", "lighten" == e),
          t.toggleDefine("BM_DARKEN", "darken" == e),
          t.toggleDefine("BM_OVERLAY", "overlay" == e),
          t.toggleDefine("BM_SCREEN", "screen" == e),
          t.toggleDefine("BM_SOFTLIGHT", "softlight" == e),
          t.toggleDefine("BM_HARDLIGHT", "hardlight" == e),
          t.toggleDefine("BM_COLORDODGE", "color dodge" == e),
          t.toggleDefine("BM_COLORBURN", "color burn" == e),
          t.toggleDefine("BM_ALPHAMASKED", i);
      }),
      (gt.AddBlendSelect = function (t, e, i) {
        return t.inValueSelect(
          e || "Blend Mode",
          [
            "normal",
            "lighten",
            "darken",
            "multiply",
            "multiply invert",
            "average",
            "add",
            "subtract",
            "difference",
            "negation",
            "exclusion",
            "overlay",
            "screen",
            "color dodge",
            "color burn",
            "softlight",
            "hardlight",
            "subtract one",
          ],
          i || "normal"
        );
      }),
      (gt.AddBlendAlphaMask = function (t, e, i) {
        return t.inSwitch(e || "Alpha Mask", ["Off", "On"], i || "Off");
      }),
      (gt.setupBlending = function (t, e, i, s, r) {
        const n = () => {
          let s = !1;
          r && (s = "On" == r.get()), gt.onChangeBlendSelect(e, i.get(), s);
          let n = i.get();
          "normal" == n
            ? (n = null)
            : "multiply" == n
            ? (n = "mul")
            : "multiply invert" == n
            ? (n = "mulinv")
            : "lighten" == n
            ? (n = "light")
            : "darken" == n
            ? (n = "darken")
            : "average" == n
            ? (n = "avg")
            : "subtract one" == n
            ? (n = "sub one")
            : "subtract" == n
            ? (n = "sub")
            : "difference" == n
            ? (n = "diff")
            : "negation" == n || "negation" == n || "negation" == n
            ? (n = "neg")
            : "exclusion" == n
            ? (n = "exc")
            : "overlay" == n
            ? (n = "ovl")
            : "color dodge" == n
            ? (n = "dodge")
            : "color burn" == n
            ? (n = "burn")
            : "softlight" == n
            ? (n = "soft")
            : "hardlight" == n && (n = "hard"),
            t.setUiAttrib({ extendTitle: n });
        };
        t.setPortGroup("Blending", [i, s, r]);
        let o = !1;
        (i.onChange = n),
          r && ((r.onChange = n), (o = "On" == r.get())),
          gt.onChangeBlendSelect(e, i.get(), o);
      });
    const pt = {
        "CGL.BLENDMODES": function () {
          (this.name = "blendmodes"), (this.srcHeadFrag = gt.getBlendCode());
        },
        "CGL.BLENDMODES3": function () {
          (this.name = "blendmodes3"), (this.srcHeadFrag = gt.getBlendCode(3));
        },
        "CGL.LUMINANCE": function () {
          (this.name = "luminance"),
            (this.srcHeadFrag =
              "".endl() +
              "float cgl_luminance(vec3 c)".endl() +
              "{".endl() +
              "    return dot(vec3(0.2126,0.7152,0.0722),c);".endl() +
              "}".endl());
        },
        "CGL.RANDOM_OLD": function () {
          (this.name = "randomNumber"),
            (this.srcHeadFrag =
              "".endl() +
              "float cgl_random(vec2 co)".endl() +
              "{".endl() +
              "    return fract(sin(dot(co.xy ,vec2(12.9898,4.1414))) * 432758.5453);".endl() +
              "}".endl() +
              "vec3 cgl_random3(vec2 co)".endl() +
              "{".endl() +
              "    return vec3( cgl_random(co),cgl_random(co+0.5711),cgl_random(co+1.5711));".endl() +
              "}");
        },
        "CGL.RANDOM_LOW": function () {
          (this.name = "randomNumber"),
            (this.srcHeadFrag =
              "".endl() +
              "float cgl_random(vec2 co)".endl() +
              "{".endl() +
              "    return fract(sin(dot(co.xy ,vec2(12.9898,4.1414))) * 358.5453);".endl() +
              "}".endl() +
              "vec3 cgl_random3(vec2 co)".endl() +
              "{".endl() +
              "    return vec3( cgl_random(co),cgl_random(co+0.5711),cgl_random(co+1.5711));".endl() +
              "}");
        },
        "CGL.RANDOM_TEX": function () {
          (this.name = "randomNumbertex"),
            (this.srcHeadFrag =
              "".endl() +
              "UNI sampler2D CGLRNDTEX;".endl() +
              "float cgl_random(vec2 co)".endl() +
              "{".endl() +
              "    return texture(CGLRNDTEX,co*5711.0).r;".endl() +
              "}".endl() +
              "vec3 cgl_random3(vec2 co)".endl() +
              "{".endl() +
              "    return texture(CGLRNDTEX,co*5711.0).rgb;".endl() +
              "}"),
            (this.initUniforms = function (t) {
              return [new nt(t, "t", "CGLRNDTEX", 7)];
            }),
            (this.onBind = function (t, e) {
              B.getRandomTexture(t), t.setTexture(7, B.getRandomTexture(t).tex);
            });
        },
      },
      _t = function () {
        return window.performance.now();
      },
      dt = function () {
        return _t();
      },
      ft = function () {
        CABLES.EventTarget.apply(this),
          (this._timeStart = _t()),
          (this._timeOffset = 0),
          (this._currentTime = 0),
          (this._lastTime = 0),
          (this._paused = !0),
          (this._delay = 0),
          (this.overwriteTime = -1);
      };
    (ft.prototype._getTime = function () {
      return (
        (this._lastTime = (_t() - this._timeStart) / 1e3),
        this._lastTime + this._timeOffset
      );
    }),
      (ft.prototype.setDelay = function (t) {
        (this._delay = t), this.emitEvent("timeChange");
      }),
      (ft.prototype.isPlaying = function () {
        return !this._paused;
      }),
      (ft.prototype.update = function () {
        if (!this._paused)
          return (this._currentTime = this._getTime()), this._currentTime;
      }),
      (ft.prototype.getMillis = function () {
        return 1e3 * this.get();
      }),
      (ft.prototype.get = ft.prototype.getTime =
        function () {
          return this.overwriteTime >= 0
            ? this.overwriteTime - this._delay
            : this._currentTime - this._delay;
        }),
      (ft.prototype.togglePlay = function () {
        this._paused ? this.play() : this.pause();
      }),
      (ft.prototype.setTime = function (t) {
        (isNaN(t) || t < 0) && (t = 0),
          (this._timeStart = _t()),
          (this._timeOffset = t),
          (this._currentTime = t),
          this.emitEvent("timeChange");
      }),
      (ft.prototype.setOffset = function (t) {
        this._currentTime + t < 0
          ? ((this._timeStart = _t()),
            (this._timeOffset = 0),
            (this._currentTime = 0))
          : ((this._timeOffset += t),
            (this._currentTime = this._lastTime + this._timeOffset)),
          this.emitEvent("timeChange");
      }),
      (ft.prototype.play = function () {
        (this._timeStart = _t()),
          (this._paused = !1),
          this.emitEvent("playPause");
      }),
      (ft.prototype.pause = function () {
        (this._timeOffset = this._currentTime),
          (this._paused = !0),
          this.emitEvent("playPause");
      });
    const mt = Math.PI / 180,
      Et = (Math.PI, -1 != window.navigator.userAgent.indexOf("Windows")),
      Tt = function (t) {
        let e;
        if (t.wheelDelta)
          (e =
            (t.wheelDelta % 120) - 0 == -0
              ? t.wheelDelta / 120
              : t.wheelDelta / 30),
            (e *= -1.5),
            Et && (e *= 2);
        else {
          let i = t.deltaY;
          t.shiftKey && (i = t.deltaX);
          const s = i || t.detail;
          (e = -(s % 3 ? 10 * s : s / 3)), (e *= -3);
        }
        return e > 20 && (e = 20), e < -20 && (e = -20), e;
      },
      At = Tt,
      bt = Tt,
      xt = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      },
      vt = /[&<>"']/g,
      yt = RegExp(vt.source);
    const It = function (t, e) {
      if (!t) throw new Error("shader constructed without cgl " + e);
      (this._log = new a("cgl_shader")),
        (this._cgl = t),
        e || this._log.stack("no shader name given"),
        (this._name = e || "unknown"),
        (this.glslVersion = 0),
        t.glVersion > 1 && (this.glslVersion = 300),
        (this.id = x()),
        (this._isValid = !0),
        (this._program = null),
        (this._uniforms = []),
        (this._drawBuffers = [!0]),
        (this._defines = []),
        (this._needsRecompile = !0),
        (this._compileReason = "initial"),
        (this._projMatrixUniform = null),
        (this._mvMatrixUniform = null),
        (this._mMatrixUniform = null),
        (this._vMatrixUniform = null),
        (this._camPosUniform = null),
        (this._normalMatrixUniform = null),
        (this._inverseViewMatrixUniform = null),
        (this._attrVertexPos = -1),
        (this.precision = t.patch.config.glslPrecision || "highp"),
        (this._pMatrixState = -1),
        (this._vMatrixState = -1),
        (this._modGroupCount = 0),
        (this._feedBackNames = []),
        (this._attributes = []),
        (this.glPrimitive = null),
        (this.offScreenPass = !1),
        (this._extensions = []),
        (this.srcVert = this.getDefaultVertexShader()),
        (this.srcFrag = this.getDefaultFragmentShader()),
        (this.lastCompile = 0),
        (this._moduleNames = []),
        (this._modules = []),
        (this._moduleNumId = 0),
        (this._libs = []),
        (this._structNames = []),
        (this._structUniformNames = []),
        (this._textureStackUni = []),
        (this._textureStackTex = []),
        (this._textureStackType = []),
        (this._textureStackTexCgl = []),
        (this._tempNormalMatrix = mat4.create()),
        (this._tempCamPosMatrix = mat4.create()),
        (this._tempInverseViewMatrix = mat4.create()),
        (this._tempInverseProjMatrix = mat4.create()),
        this.setModules([
          "MODULE_VERTEX_POSITION",
          "MODULE_COLOR",
          "MODULE_BEGIN_FRAG",
        ]);
    };
    (It.prototype.isValid = function () {
      return this._isValid;
    }),
      (It.prototype.getCgl = function () {
        return this._cgl;
      }),
      (It.prototype.getName = function () {
        return this._name;
      }),
      (It.prototype.enableExtension = function (t) {
        this.setWhyCompile("enable extension " + t),
          (this._needsRecompile = !0),
          this._extensions.push(t);
      }),
      (It.prototype.getAttrVertexPos = function () {
        return this._attrVertexPos;
      }),
      (It.prototype.hasTextureUniforms = function () {
        for (let t = 0; t < this._uniforms.length; t++)
          if ("t" == this._uniforms[t].getType()) return !0;
        return !1;
      }),
      (It.prototype.setWhyCompile = function (t) {
        this._compileReason = t;
      }),
      (It.prototype.copyUniformValues = function (t) {
        for (let e = 0; e < t._uniforms.length; e++)
          this._uniforms[e]
            ? (-1 != t._uniforms[e].getName().indexOf("pathPoints") &&
                console.log(
                  "copyUniformValues",
                  t._uniforms[e].getName(),
                  t._uniforms[e].getValue()
                ),
              this.getUniform(t._uniforms[e].getName()).set(
                t._uniforms[e].getValue()
              ))
            : this._log.log("unknown uniform?!");
        this.popTextures();
        for (let e = 0; e < t._textureStackUni.length; e++)
          (this._textureStackUni[e] = t._textureStackUni[e]),
            (this._textureStackTex[e] = t._textureStackTex[e]),
            (this._textureStackType[e] = t._textureStackType[e]),
            (this._textureStackTexCgl[e] = t._textureStackTexCgl[e]);
      }),
      (It.prototype.copy = function () {
        const t = new It(this._cgl, this._name + " copy");
        t.setSource(this.srcVert, this.srcFrag),
          (t._modules = JSON.parse(JSON.stringify(this._modules))),
          (t._defines = JSON.parse(JSON.stringify(this._defines))),
          (t._modGroupCount = this._modGroupCount),
          (t._moduleNames = this._moduleNames),
          (t.glPrimitive = this.glPrimitive),
          (t.offScreenPass = this.offScreenPass),
          (t._extensions = this._extensions),
          (t.wireframe = this.wireframe),
          (t._attributes = this._attributes);
        for (let e = 0; e < this._uniforms.length; e++) {
          this._uniforms[e].copy(t).resetLoc();
        }
        return this.setWhyCompile("copy"), (t._needsRecompile = !0), t;
      }),
      (It.prototype.setSource = function (t, e) {
        (this.srcVert = t),
          (this.srcFrag = e),
          this.setWhyCompile("Source changed"),
          (this._needsRecompile = !0);
      }),
      (It.prototype._addLibs = function (t) {
        for (const e in pt)
          if (t.indexOf(e) > -1) {
            const i = new pt[e]();
            (t = t.replace("{{" + e + "}}", i.srcHeadFrag)),
              this._libs.push(i),
              i.initUniforms && i.initUniforms(this);
          }
        return t;
      }),
      (It.prototype.createStructUniforms = function () {
        let t = "",
          e = "";
        (this._structNames = []),
          (this._injectedStringsFrag = {}),
          (this._injectedStringsVert = {}),
          (this._structUniformNamesIndicesFrag = []),
          (this._structUniformNamesIndicesVert = []);
        for (let i = 0; i < this._uniforms.length; i++)
          if (this._uniforms[i].isStructMember()) {
            const s =
              "{{INJECTION_POINT_STRUCT_" +
              this._uniforms[i]._structName +
              "}}";
            if (
              -1 === this._structNames.indexOf(this._uniforms[i]._structName)
            ) {
              const r =
                "struct " +
                this._uniforms[i]._structName +
                " {".endl() +
                s +
                "};".endl().endl();
              ("both" !== this._uniforms[i].getShaderType() &&
                "frag" !== this._uniforms[i].getShaderType()) ||
                (t = t.concat(r)),
                ("both" !== this._uniforms[i].getShaderType() &&
                  "vert" !== this._uniforms[i].getShaderType()) ||
                  (e = e.concat(r)),
                this._structNames.push(this._uniforms[i]._structName),
                (this._injectedStringsFrag[this._uniforms[i]._structName] = []),
                (this._injectedStringsVert[this._uniforms[i]._structName] = []);
            }
            let r = "";
            this._uniforms[i].comment &&
              (r = " // " + this._uniforms[i].comment);
            let n = "";
            if (
              (null == this._uniforms[i].getGlslTypeString() && (n += "//"),
              (n +=
                "  " +
                this._uniforms[i].getGlslTypeString() +
                " " +
                this._uniforms[i]._propertyName +
                ";" +
                r),
              "both" === this._uniforms[i].getShaderType())
            ) {
              if (
                -1 ===
                  this._injectedStringsFrag[
                    this._uniforms[i]._structName
                  ].indexOf(n) &&
                -1 ===
                  this._injectedStringsVert[
                    this._uniforms[i]._structName
                  ].indexOf(n)
              ) {
                const r = t.lastIndexOf(s),
                  o = e.lastIndexOf(s);
                (t = t.slice(0, r) + n + t.slice(r - 1)),
                  (e = e.slice(0, o) + n + e.slice(o - 1)),
                  this._injectedStringsFrag[this._uniforms[i]._structName].push(
                    n
                  ),
                  this._injectedStringsVert[this._uniforms[i]._structName].push(
                    n
                  );
              }
              -1 === this._structUniformNamesIndicesFrag.indexOf(i) &&
                this._structUniformNamesIndicesFrag.push(i),
                -1 === this._structUniformNamesIndicesVert.indexOf(i) &&
                  this._structUniformNamesIndicesVert.push(i);
            } else if ("frag" === this._uniforms[i].getShaderType()) {
              if (
                -1 ===
                this._injectedStringsFrag[
                  this._uniforms[i]._structName
                ].indexOf(n)
              ) {
                const e = t.lastIndexOf(s);
                (t = t.slice(0, e) + n + t.slice(e - 1)),
                  this._injectedStringsFrag[this._uniforms[i]._structName].push(
                    n
                  );
              }
              -1 === this._structUniformNamesIndicesFrag.indexOf(i) &&
                this._structUniformNamesIndicesFrag.push(i);
            } else if ("vert" === this._uniforms[i].getShaderType()) {
              if (
                -1 ===
                this._injectedStringsVert[
                  this._uniforms[i]._structName
                ].indexOf(n)
              ) {
                const t = e.lastIndexOf(s);
                (e = e.slice(0, t) + n + e.slice(t - 1)),
                  this._injectedStringsVert[this._uniforms[i]._structName].push(
                    n
                  );
              }
              -1 === this._structUniformNamesIndicesVert.indexOf(i) &&
                this._structUniformNamesIndicesVert.push(i);
            }
          }
        (this._uniDeclarationsFrag = []), (this._uniDeclarationsVert = []);
        for (
          let e = 0;
          e < this._structUniformNamesIndicesFrag.length;
          e += 1
        ) {
          const i = this._structUniformNamesIndicesFrag[e],
            s =
              "UNI " +
              this._uniforms[i]._structName +
              " " +
              this._uniforms[i]._structUniformName +
              ";".endl();
          if (-1 === this._uniDeclarationsFrag.indexOf(s)) {
            const e =
              "{{INJECTION_POINT_STRUCT_" +
              this._uniforms[i]._structName +
              "}}";
            (t = t.replace(e, "")), (t += s), this._uniDeclarationsFrag.push(s);
          }
        }
        for (
          let t = 0;
          t < this._structUniformNamesIndicesVert.length;
          t += 1
        ) {
          const i = this._structUniformNamesIndicesVert[t],
            s =
              "UNI " +
              this._uniforms[i]._structName +
              " " +
              this._uniforms[i]._structUniformName +
              ";".endl();
          if (-1 === this._uniDeclarationsVert.indexOf(s)) {
            const t =
              "{{INJECTION_POINT_STRUCT_" +
              this._uniforms[i]._structName +
              "}}";
            (e = e.replace(t, "")), (e += s), this._uniDeclarationsVert.push(s);
          }
        }
        return [e, t];
      }),
      (It.prototype._getAttrSrc = function (t, e) {
        const i = {};
        return (
          t.name &&
            t.type &&
            ((i.srcHeadVert = ""),
            e || (i.srcHeadVert += "#ifndef ATTRIB_" + t.name.endl()),
            (i.srcHeadVert += "#define ATTRIB_" + t.name.endl()),
            (i.srcHeadVert += "IN " + t.type + " " + t.name + ";".endl()),
            e || (i.srcHeadVert += "#endif".endl()),
            t.nameFrag &&
              ((i.srcHeadVert += ""),
              e || (i.srcHeadVert += "#ifndef ATTRIB_" + t.nameFrag.endl()),
              (i.srcHeadVert += "#define ATTRIB_" + t.nameFrag.endl()),
              (i.srcHeadVert +=
                "OUT " + t.type + " " + t.nameFrag + ";".endl()),
              e || (i.srcHeadVert += "#endif".endl()),
              (i.srcVert = "".endl() + t.nameFrag + "=" + t.name + ";"),
              (i.srcHeadFrag = ""),
              e || (i.srcHeadFrag += "#ifndef ATTRIB_" + t.nameFrag.endl()),
              (i.srcHeadFrag += "#define ATTRIB_" + t.nameFrag.endl()),
              (i.srcHeadFrag += "IN " + t.type + " " + t.nameFrag + ";".endl()),
              e || (i.srcHeadFrag += "#endif".endl()))),
          i
        );
      }),
      (It.prototype.compile = function () {
        const t = performance.now();
        this._cgl.profileData.profileShaderCompiles++,
          (this._cgl.profileData.profileShaderCompileName =
            this._name + " [" + this._compileReason + "]");
        let e = "";
        if (this._extensions)
          for (let t = 0; t < this._extensions.length; t++)
            e += "#extension " + this._extensions[t] + " : enable".endl();
        let i = "";
        this._defines.length && (i = "\n// cgl generated".endl());
        for (let t = 0; t < this._defines.length; t++)
          i +=
            "#define " +
            this._defines[t][0] +
            " " +
            this._defines[t][1] +
            "".endl();
        const s = this.createStructUniforms();
        if (
          (this._cgl.profileData.addHeavyEvent(
            "shader compile",
            this._name + " [" + this._compileReason + "]"
          ),
          (this._compileReason = ""),
          this._uniforms)
        ) {
          const t = this._uniforms.map((t) => t._name),
            e = [];
          for (let i = 0; i < this._uniforms.length; i++) {
            const s = this._uniforms[i];
            t.indexOf(s._name, i + 1) > -1 && e.push(i);
          }
          for (let t = this._uniforms.length - 1; t >= 0; t -= 1)
            e.indexOf(t) > -1
              ? this._uniforms.splice(t, 1)
              : this._uniforms[t].resetLoc();
        }
        this._cgl.printError("uniform resets"),
          this.hasTextureUniforms() && (i += "#define HAS_TEXTURES".endl());
        let r = "",
          n = "";
        this.srcFrag ||
          (this._log.error("[cgl shader] has no fragment source!", this),
          (this.srcVert = this.getDefaultVertexShader()),
          (this.srcFrag = this.getDefaultFragmentShader())),
          300 == this.glslVersion
            ? ((r =
                "#version 300 es".endl() +
                "// ".endl() +
                "// vertex shader " +
                this._name.endl() +
                "// ".endl() +
                "precision " +
                this.precision +
                " float;".endl() +
                "precision " +
                this.precision +
                " sampler2D;".endl() +
                "".endl() +
                "#define WEBGL2".endl() +
                "#define texture2D texture".endl() +
                "#define UNI uniform".endl() +
                "#define IN in".endl() +
                "#define OUT out".endl()),
              (n =
                "#version 300 es".endl() +
                "// ".endl() +
                "// fragment shader " +
                this._name.endl() +
                "// ".endl() +
                "precision " +
                this.precision +
                " float;".endl() +
                "precision " +
                this.precision +
                " sampler2D;".endl() +
                "".endl() +
                "#define WEBGL2".endl() +
                "#define texture2D texture".endl() +
                "#define IN in".endl() +
                "#define UNI uniform".endl() +
                "{{DRAWBUFFER}}".endl()))
            : ((n =
                "".endl() +
                "// ".endl() +
                "// fragment shader " +
                this._name.endl() +
                "// ".endl() +
                "#define WEBGL1".endl() +
                "#define texture texture2D".endl() +
                "#define outColor gl_FragColor".endl() +
                "#define IN varying".endl() +
                "#define UNI uniform".endl()),
              (r =
                "".endl() +
                "// ".endl() +
                "// vertex shader " +
                this._name.endl() +
                "// ".endl() +
                "#define WEBGL1".endl() +
                "#define texture texture2D".endl() +
                "#define OUT varying".endl() +
                "#define IN attribute".endl() +
                "#define UNI uniform".endl()));
        let o = "\n// cgl generated".endl(),
          a = "\n// cgl generated".endl();
        (n += "\n// active mods: --------------- "),
          (r += "\n// active mods: --------------- ");
        let h = !1,
          l = !1;
        for (let t = 0; t < this._moduleNames.length; t++)
          for (let e = 0; e < this._modules.length; e++)
            this._modules[e].name == this._moduleNames[t] &&
              ((this._modules[e].srcBodyFrag || this._modules[e].srcHeadFrag) &&
                ((h = !0),
                (n +=
                  "\n// " +
                  t +
                  "." +
                  e +
                  ". " +
                  this._modules[e].title +
                  " (" +
                  this._modules[e].name +
                  ")")),
              (this._modules[e].srcBodyVert || this._modules[e].srcHeadVert) &&
                ((r +=
                  "\n// " +
                  t +
                  "." +
                  e +
                  ". " +
                  this._modules[e].title +
                  " (" +
                  this._modules[e].name +
                  ")"),
                (l = !0)));
        l || (n += "\n// no mods used..."),
          h || (n += "\n// no mods used..."),
          (n += "\n"),
          (r += "\n");
        for (let t = 0; t < this._uniforms.length; t++)
          if (
            this._uniforms[t].shaderType &&
            !this._uniforms[t].isStructMember()
          ) {
            let e = "";
            this._uniforms[t].getGlslTypeString() || (e += "// "),
              (e +=
                "UNI " +
                this._uniforms[t].getGlslTypeString() +
                " " +
                this._uniforms[t].getName());
            let i = "";
            this._uniforms[t].comment &&
              (i = " // " + this._uniforms[t].comment),
              ("vert" != this._uniforms[t].shaderType &&
                "both" != this._uniforms[t].shaderType) ||
                (-1 == this.srcVert.indexOf(e) &&
                  -1 ==
                    this.srcVert.indexOf(
                      "uniform " +
                        this._uniforms[t].getGlslTypeString() +
                        " " +
                        this._uniforms[t].getName()
                    ) &&
                  (o += e + ";" + i.endl())),
              ("frag" != this._uniforms[t].shaderType &&
                "both" != this._uniforms[t].shaderType) ||
                (-1 == this.srcFrag.indexOf(e) &&
                  -1 ==
                    this.srcFrag.indexOf(
                      "uniform " +
                        this._uniforms[t].getGlslTypeString() +
                        " " +
                        this._uniforms[t].getName()
                    ) &&
                  (a += e + ";" + i.endl()));
          }
        let c = 0,
          u = 0;
        for (let t = 0; t < this._uniforms.length; t++)
          this._uniforms[t].shaderType &&
            !this._uniforms[t].isStructMember() &&
            (("vert" != this._uniforms[t].shaderType &&
              "both" != this._uniforms[t].shaderType) ||
              u++,
            ("frag" != this._uniforms[t].shaderType &&
              "both" != this._uniforms[t].shaderType) ||
              c++);
        c >= this._cgl.maxUniformsFrag &&
          this._log.warn(
            "[cgl_shader] num uniforms frag: " +
              c +
              " / " +
              this._cgl.maxUniformsFrag
          ),
          u >= this._cgl.maxUniformsVert &&
            this._log.warn(
              "[cgl_shader] num uniforms vert: " +
                u +
                " / " +
                this._cgl.maxUniformsVert
            ),
          -1 == n.indexOf("precision") &&
            (n = "precision " + this.precision + " float;".endl() + n),
          -1 == r.indexOf("precision") &&
            (r = "precision " + this.precision + " float;".endl() + r),
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) && ((n += "#define MOBILE".endl()), (r += "#define MOBILE".endl())),
          (r = e + r + i + s[0] + o + "\n// -- \n" + this.srcVert),
          (n = e + n + i + s[1] + a + "\n// -- \n" + this.srcFrag);
        let g = "",
          p = "";
        this._modules.sort(function (t, e) {
          return t.group - e.group;
        }),
          this._modules.sort(function (t, e) {
            return t.priority || 0 - e.priority || 0;
          });
        let _ = !1;
        for (let t = 0; t < this._moduleNames.length; t++) {
          let e = "",
            i = "";
          if (!_) {
            _ = !0;
            for (let t = 0; t < this._attributes.length; t++) {
              const i = this._getAttrSrc(this._attributes[t], !0);
              i.srcHeadVert && (g += i.srcHeadVert),
                i.srcVert && (e += i.srcVert),
                i.srcHeadFrag && (p += i.srcHeadFrag);
            }
          }
          for (let s = 0; s < this._modules.length; s++) {
            const r = this._modules[s];
            if (r.name == this._moduleNames[t]) {
              if (
                ((g +=
                  "\n//---- MOD: group:" +
                  r.group +
                  ": idx:" +
                  s +
                  " - prfx:" +
                  r.prefix +
                  " - " +
                  r.title +
                  " ------\n"),
                (p +=
                  "\n//---- MOD: group:" +
                  r.group +
                  ": idx:" +
                  s +
                  " - prfx:" +
                  r.prefix +
                  " - " +
                  r.title +
                  " ------\n"),
                (e +=
                  "\n\n//---- MOD: " +
                  r.title +
                  " / " +
                  r.priority +
                  " ------\n"),
                (i +=
                  "\n\n//---- MOD: " +
                  r.title +
                  " / " +
                  r.priority +
                  " ------\n"),
                r.attributes)
              )
                for (let t = 0; t < r.attributes.length; t++) {
                  const i = this._getAttrSrc(r.attributes[t], !1);
                  i.srcHeadVert && (g += i.srcHeadVert),
                    i.srcVert && (e += i.srcVert),
                    i.srcHeadFrag && (p += i.srcHeadFrag);
                }
              (g += r.srcHeadVert || ""),
                (p += r.srcHeadFrag || ""),
                (e += r.srcBodyVert || ""),
                (i += r.srcBodyFrag || ""),
                (g += "\n//---- end mod ------\n"),
                (p += "\n//---- end mod ------\n"),
                (e += "\n//---- end mod ------\n"),
                (i += "\n//---- end mod ------\n"),
                (e = e.replace(/{{mod}}/g, r.prefix)),
                (i = i.replace(/{{mod}}/g, r.prefix)),
                (g = g.replace(/{{mod}}/g, r.prefix)),
                (p = p.replace(/{{mod}}/g, r.prefix)),
                (e = e.replace(/MOD_/g, r.prefix)),
                (i = i.replace(/MOD_/g, r.prefix)),
                (g = g.replace(/MOD_/g, r.prefix)),
                (p = p.replace(/MOD_/g, r.prefix));
            }
          }
          (r = r.replace("{{" + this._moduleNames[t] + "}}", e)),
            (n = n.replace("{{" + this._moduleNames[t] + "}}", i));
        }
        (r = r.replace("{{MODULES_HEAD}}", g)),
          (n = n.replace("{{MODULES_HEAD}}", p)),
          (r = this._addLibs(r)),
          (n = this._addLibs(n));
        let d = "";
        if (
          (n.indexOf("outColor0") > -1 && (this._drawBuffers[0] = !0),
          n.indexOf("outColor1") > -1 && (this._drawBuffers[1] = !0),
          n.indexOf("outColor2") > -1 && (this._drawBuffers[2] = !0),
          n.indexOf("outColor3") > -1 && (this._drawBuffers[3] = !0),
          1 == this._drawBuffers.length)
        )
          (d = "out vec4 outColor;".endl()),
            (d += "#define gl_FragColor outColor".endl());
        else {
          (d += "#define MULTI_COLORTARGETS".endl()),
            (d += "vec4 outColor;".endl());
          let t = 0;
          for (let e = 0; e < this._drawBuffers.length; e++)
            0 == t && (d += "#define gl_FragColor outColor" + e + "".endl()),
              (d +=
                "layout(location = " +
                e +
                ") out vec4 outColor" +
                e +
                ";".endl()),
              t++;
        }
        if (((n = n.replace("{{DRAWBUFFER}}", d)), this._program)) {
          (this._program = this._createProgram(r, n)),
            (this._projMatrixUniform = null);
          for (let t = 0; t < this._uniforms.length; t++)
            this._uniforms[t].resetLoc();
        } else this._program = this._createProgram(r, n);
        (this.finalShaderFrag = n),
          (this.finalShaderVert = r),
          (ht.lastMesh = null),
          (ht.lastShader = null),
          (this._needsRecompile = !1),
          (this.lastCompile = dt()),
          (this._cgl.profileData.shaderCompileTime += performance.now() - t);
      }),
      (It.hasChanged = function () {
        return this._needsRecompile;
      }),
      (It.prototype.bind = function () {
        if (
          this._isValid &&
          ((ht.lastShader = this),
          (this._program && !this._needsRecompile) || this.compile(),
          this._isValid)
        ) {
          if (!this._projMatrixUniform) {
            (this._attrVertexPos = this._cgl.glGetAttribLocation(
              this._program,
              at.SHADER.SHADERVAR_VERTEX_POSITION
            )),
              (this._projMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_PROJMAT
              )),
              (this._mvMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                "mvMatrix"
              )),
              (this._vMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_VIEWMAT
              )),
              (this._mMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_MODELMAT
              )),
              (this._camPosUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_VIEWPOS
              )),
              (this._normalMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_NORMALMAT
              )),
              (this._inverseViewMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_INVVIEWMAT
              )),
              (this._inverseProjMatrixUniform = this._cgl.gl.getUniformLocation(
                this._program,
                at.SHADER.SHADERVAR_UNI_INVPROJMAT
              ));
            for (let t = 0; t < this._uniforms.length; t++)
              this._uniforms[t].needsUpdate = !0;
          }
          this._cgl.currentProgram != this._program &&
            (this._cgl.profileData.profileShaderBinds++,
            this._cgl.gl.useProgram(this._program),
            (this._cgl.currentProgram = this._program));
          for (let t = 0; t < this._uniforms.length; t++)
            this._uniforms[t].needsUpdate && this._uniforms[t].updateValue();
          if (
            (this._pMatrixState != this._cgl.getProjectionMatrixStateCount() &&
              ((this._pMatrixState = this._cgl.getProjectionMatrixStateCount()),
              this._cgl.gl.uniformMatrix4fv(
                this._projMatrixUniform,
                !1,
                this._cgl.pMatrix
              ),
              this._cgl.profileData.profileMVPMatrixCount++),
            this._vMatrixUniform)
          )
            this._vMatrixState != this._cgl.getViewMatrixStateCount() &&
              (this._cgl.gl.uniformMatrix4fv(
                this._vMatrixUniform,
                !1,
                this._cgl.vMatrix
              ),
              this._cgl.profileData.profileMVPMatrixCount++,
              (this._vMatrixState = this._cgl.getViewMatrixStateCount()),
              this._inverseViewMatrixUniform &&
                (mat4.invert(this._tempInverseViewMatrix, this._cgl.vMatrix),
                this._cgl.gl.uniformMatrix4fv(
                  this._inverseViewMatrixUniform,
                  !1,
                  this._tempInverseViewMatrix
                ),
                this._cgl.profileData.profileMVPMatrixCount++),
              this._inverseProjMatrixUniform &&
                (mat4.invert(this._tempInverseProjMatrix, this._cgl.pMatrix),
                this._cgl.gl.uniformMatrix4fv(
                  this._inverseProjMatrixUniform,
                  !1,
                  this._tempInverseProjMatrix
                ),
                this._cgl.profileData.profileMVPMatrixCount++)),
              this._cgl.gl.uniformMatrix4fv(
                this._mMatrixUniform,
                !1,
                this._cgl.mMatrix
              ),
              this._cgl.profileData.profileMVPMatrixCount++,
              this._camPosUniform &&
                (mat4.invert(this._tempCamPosMatrix, this._cgl.vMatrix),
                this._cgl.gl.uniform3f(
                  this._camPosUniform,
                  this._tempCamPosMatrix[12],
                  this._tempCamPosMatrix[13],
                  this._tempCamPosMatrix[14]
                ),
                this._cgl.profileData.profileMVPMatrixCount++);
          else {
            const t = mat4.create();
            mat4.mul(t, this._cgl.vMatrix, this._cgl.mMatrix),
              this._cgl.gl.uniformMatrix4fv(this._mvMatrixUniform, !1, t),
              this._cgl.profileData.profileMVPMatrixCount++;
          }
          this._normalMatrixUniform &&
            (mat4.invert(this._tempNormalMatrix, this._cgl.mMatrix),
            mat4.transpose(this._tempNormalMatrix, this._tempNormalMatrix),
            this._cgl.gl.uniformMatrix4fv(
              this._normalMatrixUniform,
              !1,
              this._tempNormalMatrix
            ),
            this._cgl.profileData.profileMVPMatrixCount++);
          for (let t = 0; t < this._libs.length; t++)
            this._libs[t].onBind &&
              this._libs[t].onBind.bind(this._libs[t])(this._cgl, this);
          this._bindTextures();
        }
      }),
      (It.prototype.toggleDefine = function (t, e) {
        e &&
          "object" == typeof e &&
          e.addEventListener &&
          (e.changeListener && e.removeEventListener(e.changeListener),
          (e.onToggleDefine = (e) => {
            this.toggleDefine(t, e);
          }),
          (e.changeListener = e.on("change", e.onToggleDefine)),
          (e = e.get())),
          e ? this.define(t) : this.removeDefine(t);
      }),
      (It.prototype.define = function (t, e) {
        null == e && (e = ""),
          "object" == typeof e &&
            (e.removeEventListener("change", e.onDefineChange),
            (e.onDefineChange = (e) => {
              this.define(t, e);
            }),
            e.on("change", e.onDefineChange),
            (e = e.get()));
        for (let i = 0; i < this._defines.length; i++) {
          if (this._defines[i][0] == t && this._defines[i][1] == e) return;
          if (this._defines[i][0] == t)
            return (
              (this._defines[i][1] = e),
              this.setWhyCompile("define " + t + " " + e),
              void (this._needsRecompile = !0)
            );
        }
        this.setWhyCompile("define " + t + " " + e),
          (this._needsRecompile = !0),
          this._defines.push([t, e]);
      }),
      (It.prototype.getDefines = function () {
        return this._defines;
      }),
      (It.prototype.getDefine = function (t) {
        for (let e = 0; e < this._defines.length; e++)
          if (this._defines[e][0] == t) return this._defines[e][1];
        return null;
      }),
      (It.prototype.hasDefine = function (t) {
        for (let e = 0; e < this._defines.length; e++)
          if (this._defines[e][0] == t) return !0;
      }),
      (It.prototype.removeDefine = function (t) {
        for (let e = 0; e < this._defines.length; e++)
          if (this._defines[e][0] == t)
            return (
              this._defines.splice(e, 1),
              (this._needsRecompile = !0),
              void this.setWhyCompile("define removed:" + t)
            );
      }),
      (It.prototype.removeModule = function (t) {
        for (let e = 0; e < this._modules.length; e++)
          if (t && t.id && (this._modules[e].id == t.id || !this._modules[e])) {
            let i = !0;
            for (; i; ) {
              i = !1;
              for (let e = 0; e < this._uniforms.length; e++)
                0 != this._uniforms[e].getName().indexOf(t.prefix) ||
                  (this._uniforms.splice(e, 1), (i = !0));
            }
            (this._needsRecompile = !0),
              this.setWhyCompile("remove module " + t.title),
              this._modules.splice(e, 1);
            break;
          }
      }),
      (It.prototype.getNumModules = function () {
        return this._modules.length;
      }),
      (It.prototype.getCurrentModules = function () {
        return this._modules;
      }),
      (It.prototype.addModule = function (t, e) {
        return (
          t.id || (t.id = A()),
          t.numId || (t.numId = this._moduleNumId),
          t.num || (t.num = this._modules.length),
          e && !e.group && (e.group = x()),
          t.group || (t.group = e ? e.group : x()),
          (t.prefix = "mod" + t.group + "_"),
          this._modules.push(t),
          (this._needsRecompile = !0),
          this.setWhyCompile("add module " + t.title),
          this._moduleNumId++,
          t
        );
      }),
      (It.prototype.hasModule = function (t) {
        for (let e = 0; e < this._modules.length; e++)
          if (this._modules[e].id == t) return !0;
        return !1;
      }),
      (It.prototype.setModules = function (t) {
        this._moduleNames = t;
      }),
      (It.prototype.dispose = function () {
        this._cgl.gl.deleteProgram(this._program);
      }),
      (It.prototype.needsRecompile = function () {
        return this._needsRecompile;
      }),
      (It.prototype.setDrawBuffers = function (t) {
        if (this._drawBuffers.length !== t.length)
          return (
            (this._drawBuffers = t),
            (this._needsRecompile = !0),
            void this.setWhyCompile("setDrawBuffers")
          );
        for (let e = 0; e < t.length; e++)
          if (t[e] !== this._drawBuffers[e])
            return (
              (this._drawBuffers = t),
              (this._needsRecompile = !0),
              void this.setWhyCompile("setDrawBuffers")
            );
      }),
      (It.prototype.getUniforms = function () {
        return this._uniforms;
      }),
      (It.prototype.getUniform = function (t) {
        for (let e = 0; e < this._uniforms.length; e++)
          if (this._uniforms[e].getName() == t) return this._uniforms[e];
        return null;
      }),
      (It.prototype.removeAllUniforms = function () {
        this._uniforms = [];
      }),
      (It.prototype.removeUniform = function (t) {
        for (let e = 0; e < this._uniforms.length; e++)
          this._uniforms[e].getName() == t && this._uniforms.splice(e, 1);
        (this._needsRecompile = !0), this.setWhyCompile("remove uniform " + t);
      }),
      (It.prototype._addUniform = function (t) {
        this._uniforms.push(t),
          this.setWhyCompile("add uniform " + name),
          (this._needsRecompile = !0);
      }),
      (It.prototype.addUniformFrag = function (t, e, i, s, r, n) {
        const o = new CGL.Uniform(this, t, e, i, s, r, n);
        return (o.shaderType = "frag"), o;
      }),
      (It.prototype.addUniformVert = function (t, e, i, s, r, n) {
        const o = new CGL.Uniform(this, t, e, i, s, r, n);
        return (o.shaderType = "vert"), o;
      }),
      (It.prototype.addUniformBoth = function (t, e, i, s, r, n) {
        const o = new CGL.Uniform(this, t, e, i, s, r, n);
        return (o.shaderType = "both"), o;
      }),
      (It.prototype.addUniformStructFrag = function (t, e, i) {
        const s = {};
        if (!i) return s;
        for (let r = 0; r < i.length; r += 1) {
          const n = i[r];
          if (!this.hasUniform(e + "." + n.name)) {
            const i = new CGL.Uniform(
              this,
              n.type,
              e + "." + n.name,
              n.v1,
              n.v2,
              n.v3,
              n.v4,
              e,
              t,
              n.name
            );
            (i.shaderType = "frag"), (s[e + "." + n.name] = i);
          }
        }
        return s;
      }),
      (It.prototype.addUniformStructVert = function (t, e, i) {
        const s = {};
        if (!i) return s;
        for (let r = 0; r < i.length; r += 1) {
          const n = i[r];
          if (!this.hasUniform(e + "." + n.name)) {
            const i = new CGL.Uniform(
              this,
              n.type,
              e + "." + n.name,
              n.v1,
              n.v2,
              n.v3,
              n.v4,
              e,
              t,
              n.name
            );
            (i.shaderType = "vert"), (s[e + "." + n.name] = i);
          }
        }
        return s;
      }),
      (It.prototype.addUniformStructBoth = function (t, e, i) {
        const s = {};
        if (!i) return s;
        for (let r = 0; r < i.length; r += 1) {
          const n = i[r];
          if (
            (("2i" !== n.type && "i" !== n.type && "3i" !== n.type) ||
              this._log.error(
                "Adding an integer struct member to both shaders can potentially error. Please use different structs for each shader. Error occured in struct:",
                t,
                " with member:",
                n.name,
                " of type:",
                n.type,
                "."
              ),
            !this.hasUniform(e + "." + n.name))
          ) {
            const i = new CGL.Uniform(
              this,
              n.type,
              e + "." + n.name,
              n.v1,
              n.v2,
              n.v3,
              n.v4,
              e,
              t,
              n.name
            );
            (i.shaderType = "both"), (s[e + "." + n.name] = i);
          }
        }
        return s;
      }),
      (It.prototype.hasUniform = function (t) {
        for (let e = 0; e < this._uniforms.length; e++)
          if (this._uniforms[e].getName() == t) return !0;
        return !1;
      }),
      (It.prototype._createProgram = function (t, e) {
        this._cgl.printError("before _createprogram");
        const i = this._cgl.gl.createProgram();
        return (
          (this.vshader = It.createShader(
            this._cgl,
            t,
            this._cgl.gl.VERTEX_SHADER,
            this
          )),
          (this.fshader = It.createShader(
            this._cgl,
            e,
            this._cgl.gl.FRAGMENT_SHADER,
            this
          )),
          this._cgl.gl.attachShader(i, this.vshader),
          this._cgl.gl.attachShader(i, this.fshader),
          this._linkProgram(i, t, e),
          this._cgl.printError("shader _createProgram"),
          i
        );
      }),
      (It.prototype.hasErrors = function () {
        return this._hasErrors;
      }),
      (It.prototype._linkProgram = function (t, e, i) {
        this._cgl.printError("before _linkprogram"),
          this._feedBackNames.length > 0 &&
            this._cgl.gl.transformFeedbackVaryings(
              t,
              this._feedBackNames,
              this._cgl.gl.SEPARATE_ATTRIBS
            ),
          this._cgl.gl.linkProgram(t),
          this._cgl.printError("gl.linkprogram"),
          (this._isValid = !0),
          (this._hasErrors = !1),
          !1 !== this._cgl.patch.config.glValidateShader &&
            (this._cgl.gl.validateProgram(t),
            this._cgl.gl.getProgramParameter(t, this._cgl.gl.VALIDATE_STATUS) ||
              (console.log("shaderprogram validation failed..."),
              console.log(
                this._name + " programinfo: ",
                this._cgl.gl.getProgramInfoLog(t)
              )),
            this._cgl.gl.getProgramParameter(t, this._cgl.gl.LINK_STATUS) ||
              ((this._hasErrors = !0),
              this._log.warn(
                this._cgl.gl.getShaderInfoLog(this.fshader) ||
                  "empty shader infolog"
              ),
              this._log.warn(
                this._cgl.gl.getShaderInfoLog(this.vshader) ||
                  "empty shader infolog"
              ),
              this._log.error(this._name + " shader linking fail..."),
              console.log(
                this._name + " programinfo: ",
                this._cgl.gl.getProgramInfoLog(t)
              ),
              console.log("--------------------------------------"),
              console.log(this),
              console.log("--------------------------------------"),
              (this._isValid = !1),
              (this._name = "errorshader"),
              this.setSource(
                It.getDefaultVertexShader(),
                It.getErrorFragmentShader()
              ),
              this._cgl.printError("shader link err")));
      }),
      (It.prototype.getProgram = function () {
        return this._program;
      }),
      (It.prototype.setFeedbackNames = function (t) {
        this.setWhyCompile("setFeedbackNames"),
          (this._needsRecompile = !0),
          (this._feedBackNames = t);
      }),
      (It.prototype.getDefaultVertexShader = It.getDefaultVertexShader =
        function () {
          return "{{MODULES_HEAD}}\nIN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\nIN vec3 attrTangent,attrBiTangent;\n\nIN float attrVertIndex;\n\nOUT vec2 texCoord;\nOUT vec3 norm;\nUNI mat4 projMatrix;\nUNI mat4 viewMatrix;\nUNI mat4 modelMatrix;\n\nvoid main()\n{\n    texCoord=attrTexCoord;\n    norm=attrVertNormal;\n    vec4 pos=vec4(vPosition,  1.0);\n    vec3 tangent=attrTangent;\n    vec3 bitangent=attrBiTangent;\n    mat4 mMatrix=modelMatrix;\n    {{MODULE_VERTEX_POSITION}}\n    gl_Position = projMatrix * (viewMatrix*mMatrix) * pos;\n}\n";
        }),
      (It.prototype.getDefaultFragmentShader = It.getDefaultFragmentShader =
        function (t, e, i) {
          return (
            null == t && ((t = 0.5), (e = 0.5), (i = 0.5)),
            "".endl() +
              "IN vec2 texCoord;".endl() +
              "{{MODULES_HEAD}}".endl() +
              "void main()".endl() +
              "{".endl() +
              "    vec4 col=vec4(" +
              t +
              "," +
              e +
              "," +
              i +
              ",1.0);".endl() +
              "    {{MODULE_COLOR}}".endl() +
              "    outColor = col;".endl() +
              "}"
          );
        }),
      (It.prototype.addAttribute = function (t) {
        for (let e = 0; e < this._attributes.length; e++)
          if (
            this._attributes[e].name == t.name &&
            this._attributes[e].nameFrag == t.nameFrag
          )
            return;
        this._attributes.push(t),
          (this._needsRecompile = !0),
          this.setWhyCompile("addAttribute");
      }),
      (It.prototype.bindTextures = It.prototype._bindTextures =
        function () {
          this._textureStackTex.length > this._cgl.maxTextureUnits &&
            this._log.warn(
              "[shader._bindTextures] too many textures bound",
              this._textureStackTex.length + "/" + this._cgl.maxTextureUnits
            );
          for (let t = 0; t < this._textureStackTex.length; t++)
            if (this._textureStackTex[t] || this._textureStackTexCgl[t]) {
              let e = this._textureStackTex[t];
              this._textureStackTexCgl[t] &&
                (e =
                  this._textureStackTexCgl[t].tex ||
                  CGL.Texture.getEmptyTexture(this._cgl).tex);
              let i = !0;
              this._textureStackUni[t]
                ? (this._textureStackUni[t].setValue(t),
                  (i = this._cgl.setTexture(t, e, this._textureStackType[t])))
                : (this._log.warn("no uniform for pushtexture", this._name),
                  (i = this._cgl.setTexture(t, e, this._textureStackType[t]))),
                i ||
                  this._log.warn(
                    "tex bind failed",
                    this.getName(),
                    this._textureStackUni[t]
                  );
            } else this._log.warn("no texture for pushtexture", this._name);
        }),
      (It.prototype.setUniformTexture = function (t, e) {
        for (let i = 0; i < this._textureStackUni.length; i++)
          if (this._textureStackUni[i] == t) {
            const t = this._textureStackTex[i] || this._textureStackTexCgl[i];
            return (
              e.hasOwnProperty("tex")
                ? ((this._textureStackTexCgl[i] = e),
                  (this._textureStackTex[i] = null))
                : ((this._textureStackTexCgl[i] = null),
                  (this._textureStackTex[i] = e)),
              t
            );
          }
        return null;
      }),
      (It.prototype.pushTexture = function (t, e, i) {
        if (!t) throw new Error("no uniform given to texturestack");
        if (e) {
          if (!(e.hasOwnProperty("tex") || e instanceof WebGLTexture))
            return (
              this._log.warn(new Error("invalid texture").stack),
              void this._log.warn("[cgl_shader] invalid texture...", e)
            );
          this._textureStackUni.push(t),
            e.hasOwnProperty("tex")
              ? (this._textureStackTexCgl.push(e),
                this._textureStackTex.push(null))
              : (this._textureStackTexCgl.push(null),
                this._textureStackTex.push(e)),
            this._textureStackType.push(i);
        }
      }),
      (It.prototype.popTexture = function () {
        this._textureStackUni.pop(),
          this._textureStackTex.pop(),
          this._textureStackTexCgl.pop(),
          this._textureStackType.pop();
      }),
      (It.prototype.popTextures = function () {
        this._textureStackTex.length =
          this._textureStackTexCgl.length =
          this._textureStackType.length =
          this._textureStackUni.length =
            0;
      }),
      (It.prototype.getInfo = function () {
        const t = {};
        return (
          (t.name = this._name),
          (t.defines = this.getDefines()),
          (t.hasErrors = this.hasErrors()),
          t
        );
      }),
      (It.getErrorFragmentShader = function () {
        return (
          "".endl() +
          "void main()".endl() +
          "{".endl() +
          "   float g=mod((gl_FragCoord.y+gl_FragCoord.x),50.0)/50.0;".endl() +
          "   g= step(0.1,g);".endl() +
          "   outColor = vec4( g+0.5, 0.0, 0.0, 1.0);".endl() +
          "}"
        );
      }),
      (It.createShader = function (t, e, i, s) {
        if (t.aborted) return;
        const r = t.gl.createShader(i);
        if (
          (t.gl.shaderSource(r, e),
          t.gl.compileShader(r),
          !t.gl.getShaderParameter(r, t.gl.COMPILE_STATUS))
        ) {
          console.log("compile status: "),
            i == t.gl.VERTEX_SHADER && console.log("VERTEX_SHADER"),
            i == t.gl.FRAGMENT_SHADER && console.log("FRAGMENT_SHADER");
          let o = t.gl.getShaderInfoLog(r) || "empty shader info log";
          const a = (function (t) {
            const e = [],
              i = t.split("\n");
            for (const t in i) {
              const s = i[t].split(":");
              parseInt(s[2], 10) && e.push(parseInt(s[2], 10));
            }
            return e;
          })(o);
          let h =
            '<pre style="margin-bottom:0px;"><code class="shaderErrorCode language-glsl" style="padding-bottom:0px;max-height: initial;max-width: initial;">';
          const l = e.match(/^.*((\r\n|\n|\r)|$)/gm);
          for (const t in l) {
            const e = parseInt(t, 10) + 1,
              i = e + ": " + l[t];
            console.log(i);
            let s = !1;
            for (const t in a) a[t] == e && (s = !0);
            s &&
              ((h += "</code></pre>"),
              (h +=
                '<pre style="margin:0"><code class="language-glsl" style="background-color:#660000;padding-top:0px;padding-bottom:0px">')),
              (h +=
                (n = i) && yt.test(n)
                  ? n.replace(vt, function (t) {
                      return xt[t];
                    })
                  : n || ""),
              s &&
                ((h += "</code></pre>"),
                (h +=
                  '<pre style="margin:0"><code class="language-glsl" style=";padding-top:0px;padding-bottom:0px">'));
          }
          console.warn(o),
            (o = o.replace(/\n/g, "<br/>")),
            (h = o + "<br/>" + h + "<br/><br/>"),
            (h += "</code></pre>"),
            t.patch.emitEvent("criticalError", {
              title: "Shader error " + this._name,
              text: h,
            }),
            t.patch.isEditorMode() &&
              console.log("Shader error " + this._name, h),
            (this._name = "errorshader"),
            s.setSource(
              It.getDefaultVertexShader(),
              It.getErrorFragmentShader()
            );
        }
        var n;
        return r;
      });
    class St {
      constructor(t) {
        (this._cgl = t),
          (this._lastTime = 0),
          (this.pause = !1),
          (this.profileUniformCount = 0),
          (this.profileShaderBinds = 0),
          (this.profileUniformCount = 0),
          (this.profileShaderCompiles = 0),
          (this.profileVideosPlaying = 0),
          (this.profileMVPMatrixCount = 0),
          (this.profileEffectBuffercreate = 0),
          (this.profileShaderGetUniform = 0),
          (this.profileFrameBuffercreate = 0),
          (this.profileMeshSetGeom = 0),
          (this.profileTextureNew = 0),
          (this.profileGenMipMap = 0),
          (this.profileOnAnimFrameOps = 0),
          (this.profileMainloopMs = 0),
          (this.profileMeshDraw = 0),
          (this.profileTextureEffect = 0),
          (this.profileTexPreviews = 0),
          (this.shaderCompileTime = 0),
          (this.profileMeshNumElements = 0),
          (this.profileMeshAttributes = 0),
          (this.profileSingleMeshAttribute = []),
          (this.heavyEvents = []),
          (this.doProfileGlQuery = !1),
          (this.glQueryData = {});
      }
      clear() {
        (this.profileSingleMeshAttribute = {}),
          (this.profileMeshAttributes = 0),
          (this.profileUniformCount = 0),
          (this.profileShaderGetUniform = 0),
          (this.profileShaderCompiles = 0),
          (this.profileShaderBinds = 0),
          (this.profileTextureResize = 0),
          (this.profileFrameBuffercreate = 0),
          (this.profileEffectBuffercreate = 0),
          (this.profileTextureDelete = 0),
          (this.profileMeshSetGeom = 0),
          (this.profileVideosPlaying = 0),
          (this.profileMVPMatrixCount = 0),
          (this.profileNonTypedAttrib = 0),
          (this.profileNonTypedAttribNames = ""),
          (this.profileTextureNew = 0),
          (this.profileGenMipMap = 0),
          (this.profileFramebuffer = 0),
          (this.profileMeshDraw = 0),
          (this.profileTextureEffect = 0),
          (this.profileTexPreviews = 0),
          (this.profileMeshNumElements = 0);
      }
      clearGlQuery() {
        for (let t in this.glQueryData)
          (!this.glQueryData[t].lastClear ||
            performance.now() - this.glQueryData[t].lastClear > 1e3) &&
            ((this.glQueryData[t].time =
              this.glQueryData[t]._times / this.glQueryData[t]._numcount),
            (this.glQueryData[t].num = this.glQueryData[t]._numcount),
            (this.glQueryData[t]._times = 0),
            (this.glQueryData[t]._numcount = 0),
            (this.glQueryData[t].lastClear = performance.now()));
      }
      addHeavyEvent(t, e, i) {
        const s = { event: t, name: e, info: i, date: performance.now() };
        this.heavyEvents.push(s), this._cgl.emitEvent("heavyEvent", s);
      }
    }
    const Rt = {
        GAPI_WEBGL: 0,
        GAPI_WEBGPU: 1,
        Geometry: W,
        BoundingBox: z,
        FpsCounter: class extends Y {
          constructor() {
            super(),
              (this._timeStartFrame = 0),
              (this._timeStartSecond = 0),
              (this._fpsCounter = 0),
              (this._msCounter = 0),
              (this.stats = { ms: 0, fps: 0 });
          }
          startFrame() {
            this._timeStartFrame = CABLES.now();
          }
          endFrame() {
            this._fpsCounter++;
            const t = CABLES.now() - this._timeStartFrame;
            (this._msCounter += t),
              CABLES.now() - this._timeStartSecond > 1e3 && this.endSecond();
          }
          endSecond() {
            (this.stats.fps = this._fpsCounter),
              (this.stats.ms =
                Math.round((this._msCounter / this._fpsCounter) * 100) / 100),
              this.emitEvent("performance", this.stats),
              (this._fpsCounter = 0),
              (this._msCounter = 0),
              (this._timeStartSecond = CABLES.now());
          }
        },
      },
      Pt = function (t) {
        Ut.apply(this),
          (this.patch = t),
          (this.gApi = Rt.GAPI_WEBGPU),
          (this._viewport = [0, 0, 256, 256]),
          (this._shaderStack = []),
          (this.getViewPort = function () {
            return [0, 0, this.canvasWidth, this.canvasHeight];
          }),
          (this.renderStart = function (t, e, i) {
            this.fpsCounter.startFrame(),
              this._startMatrixStacks(e, i),
              this.setViewPort(0, 0, this.canvasWidth, this.canvasHeight),
              this.emitEvent("beginFrame");
          }),
          (this.renderEnd = function (t) {
            this._endMatrixStacks(),
              this.emitEvent("endFrame"),
              this.fpsCounter.endFrame();
          });
      };
    (Pt.prototype.setViewPort = function (t, e, i, s) {
      this._viewport = [t, e, i, s];
    }),
      (Pt.prototype.getViewPort = function () {
        return this._viewPort;
      }),
      (Pt.prototype.createMesh = function (t, e) {
        return new CGP.Mesh(this, t, e);
      }),
      (Pt.prototype.getShader = function () {
        return {};
      }),
      (Pt.prototype.pushShader = function (t) {
        this._shaderStack.push(t);
      }),
      (Pt.prototype.popShader = function () {
        if (0 === this._shaderStack.length)
          throw new Error("Invalid shader stack pop!");
        this._shaderStack.pop();
      }),
      (Pt.prototype.getShader = function () {
        return this._shaderStack[this._shaderStack.length - 1];
      }),
      (Pt.prototype.pushErrorScope = function () {
        this.device.pushErrorScope("validation");
      }),
      (Pt.prototype.popErrorScope = function (t, e) {
        this.device.popErrorScope().then((i) => {
          i &&
            (this.patch.emitEvent("criticalError", {
              title: 'WebGPU error "' + t + '"',
              codeText: i.message,
            }),
            console.warn("[cgp]", t, i.message, i, e),
            e && e(i));
        });
      });
    class Ot extends rt {
      constructor(t, e, i, s, r, n, o, a, h, l) {
        super(t, e, i, s, r, n, o, a, h, l),
          (this._loc = -1),
          (this._cgl = t._cgl);
      }
      updateValueF() {}
      setValueF(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValue2F() {}
      setValue2F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValue3F() {}
      setValue3F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      updateValue4F() {}
      setValue4F(t) {
        (this.needsUpdate = !0), (this._value = t);
      }
      getSizeBytes() {
        return "f" == this._type || "i" == this._type
          ? 4
          : "2i" == this._type || "2f" == this._type
          ? 8
          : "3f" == this._type
          ? 12
          : "4f" == this._type
          ? 16
          : "m4" == this._type
          ? 64
          : void this._log.warn("unknown type getSizeBytes");
      }
    }
    class Nt {
      constructor(t, e) {
        (this._shaderType = e),
          (this._shader = t),
          (this._cgp = t._cgp),
          (this._gpuBuffer = null),
          (this._values = null),
          (this._sizeBytes = 0),
          this.update();
      }
      update() {
        this._sizeBytes = 0;
        for (let t = 0; t < this._shader.uniforms.length; t++) {
          const e = this._shader.uniforms[t];
          this._shaderType == e.shaderType &&
            (this._sizeBytes += e.getSizeBytes());
        }
        (this._gpuBuffer = this._cgp.device.createBuffer({
          size: this._sizeBytes,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })),
          (this._values = new Float32Array(this._sizeBytes / 4)),
          this.updateUniformValues();
      }
      updateUniformValues() {
        let t = 0;
        for (let e = 0; e < this._shader.uniforms.length; e++) {
          const i = this._shader.uniforms[e];
          if (i.shaderType == this._shaderType)
            if (i.getSizeBytes() / 4 > 1)
              for (let e = 0; e < i.getValue().length; e++)
                (this._values[t] = i.getValue()[e]), t++;
            else (this._values[t] = i.getValue()), t++;
        }
        this._cgp.device.queue.writeBuffer(
          this._gpuBuffer,
          0,
          this._values.buffer,
          this._values.byteOffset,
          this._values.byteLength
        );
      }
    }
    class Ft {
      constructor(t, e) {
        if (!t) throw new Error("Pipeline constructed without cgp " + e);
        (this._cgp = t),
          (this._isValid = !0),
          (this._pipeCfg = null),
          (this._renderPipeline = null),
          (this._fsUniformBuffer = null),
          (this._vsUniformBuffer = null),
          (this._old = {});
      }
      get isValid() {
        return this._isValid;
      }
      setPipeline(t, e) {
        if (!e || !t) return void console.log("pipeline unknown shader/mesh");
        (!this._renderPipeline ||
          !this._pipeCfg ||
          this._old.mesh != e ||
          this._old.shader != t ||
          e.needsPipelineUpdate ||
          t.needsPipelineUpdate) &&
          ((this._old.shader = t),
          (this._old.mesh = e),
          (this._pipeCfg = this.getPiplelineObject(t, e)),
          console.log(this._pipeCfg),
          (this._renderPipeline = this._cgp.device.createRenderPipeline(
            this._pipeCfg
          )),
          this._bindUniforms(t)),
          this._renderPipeline &&
            this._isValid &&
            (mat4.copy(this._matModel, this._cgp.mMatrix),
            mat4.copy(this._matView, this._cgp.vMatrix),
            mat4.copy(this._matProj, this._cgp.pMatrix),
            this._cgp.device.queue.writeBuffer(
              this._vsUniformBuffer,
              0,
              this._vsUniformValues.buffer,
              this._vsUniformValues.byteOffset,
              this._vsUniformValues.byteLength
            ),
            this._uniBufFrag.updateUniformValues(),
            this._cgp.passEncoder.setPipeline(this._renderPipeline),
            this._cgp.passEncoder.setBindGroup(0, this._bindGroup));
      }
      getPiplelineObject(t, e) {
        return {
          layout: "auto",
          vertex: {
            module: t.shaderModule,
            entryPoint: "myVSMain",
            buffers: [
              {
                arrayStride: 12,
                attributes: [
                  { shaderLocation: 0, offset: 0, format: "float32x3" },
                ],
              },
              {
                arrayStride: 12,
                attributes: [
                  { shaderLocation: 1, offset: 0, format: "float32x3" },
                ],
              },
              {
                arrayStride: 8,
                attributes: [
                  { shaderLocation: 2, offset: 0, format: "float32x2" },
                ],
              },
            ],
          },
          fragment: {
            module: t.shaderModule,
            entryPoint: "myFSMain",
            targets: [{ format: this._cgp.presentationFormat }],
          },
          primitive: { topology: "triangle-list", cullMode: "none" },
          depthStencil: {
            depthWriteEnabled: !0,
            depthCompare: "less",
            format: "depth24plus",
          },
        };
      }
      _bindUniforms(t) {
        this._cgp.pushErrorScope(), (this._uniBufFrag = new Nt(t, "frag"));
        (this._vsUniformBuffer = this._cgp.device.createBuffer({
          size: 192,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })),
          (this._vsUniformValues = new Float32Array(48)),
          (this._matModel = this._vsUniformValues.subarray(0, 16)),
          (this._matView = this._vsUniformValues.subarray(16, 32)),
          (this._matProj = this._vsUniformValues.subarray(32, 48)),
          (this._bindGroup = this._cgp.device.createBindGroup({
            layout: this._renderPipeline.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: this._vsUniformBuffer } },
              { binding: 1, resource: { buffer: this._uniBufFrag._gpuBuffer } },
            ],
          })),
          this._cgp.device.queue.writeBuffer(
            this._vsUniformBuffer,
            0,
            this._vsUniformValues.buffer,
            this._vsUniformValues.byteOffset,
            this._vsUniformValues.byteLength
          ),
          this._uniBufFrag.updateUniformValues(),
          this._cgp.popErrorScope("cgp_pipeline end", (t) => {
            this._isValid = !1;
          });
      }
    }
    class Ct {
      constructor(t, e) {
        if (!t) throw new Error("no cgp");
        (this._log = new a("cgp_texture")),
          (this._cgp = t),
          (this.id = CABLES.uuid()),
          (e = e || {}),
          (this.name = e.name || "unknown");
      }
      initTexture(t, e) {
        (this.width = t.width),
          (this.height = t.height),
          (this.textureType = "rgba8unorm");
        const i = {
            size: { width: t.width, height: t.height },
            format: this.textureType,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
          },
          s = this._cgp.device.createTexture(i);
        return (
          this._cgp.device.queue.copyExternalImageToTexture(
            { source: t },
            { texture: s },
            i.size
          ),
          s
        );
      }
      getInfo() {
        const t = {};
        return (
          (t.name = this.name),
          (t.size = this.width + " x " + this.height),
          (t.textureType = this.textureType),
          t
        );
      }
    }
    Ct.load = function (t, e, i, s) {
      fetch(e).then((s) => {
        s.blob().then((s) => {
          createImageBitmap(s).then((s) => {
            const r = new Ct(t, { name: e });
            r.initTexture(s),
              i ? i(r) : console.log("Texture.load no onFinished callback");
          });
        });
      });
    };
    const wt = Object.assign({
      Context: Pt,
      Shader: class {
        constructor(t, e) {
          if (!t) throw new Error("shader constructed without cgp " + e);
          (this._log = new a("cgp_shader")),
            (this._cgp = t),
            (this._name = e),
            (this._uniforms = []),
            e || this._log.stack("no shader name given"),
            (this._name = e || "unknown"),
            (this.id = x()),
            (this._isValid = !0),
            (this._compileReason = ""),
            (this.shaderModule = null),
            (this._needsRecompile = !0),
            (this._src = "");
        }
        get isValid() {
          return this._isValid;
        }
        get uniforms() {
          return this._uniforms;
        }
        getName() {
          return this._name;
        }
        setWhyCompile(t) {
          this._compileReason = t;
        }
        setSource(t) {
          (this._src = t),
            this.setWhyCompile("Source changed"),
            (this._needsRecompile = !0);
        }
        compile() {
          (this._isValid = !0),
            console.log("compiling shader...", this._compileReason),
            this._cgp.pushErrorScope(),
            (this.shaderModule = this._cgp.device.createShaderModule({
              code: this._src,
            })),
            this._cgp.popErrorScope(
              "cgp_shader " + this._name,
              this.error.bind(this)
            ),
            (this._needsRecompile = !1);
        }
        error(t) {
          this._isValid = !1;
        }
        bind() {
          for (let t = 0; t < this._uniforms.length; t++);
          this._needsRecompile && this.compile();
        }
        addUniformFrag(t, e, i, s, r, n) {
          const o = new Ot(this, t, e, i, s, r, n);
          return (o.shaderType = "frag"), o;
        }
        addUniformVert(t, e, i, s, r, n) {
          const o = new Ot(this, t, e, i, s, r, n);
          return (o.shaderType = "vert"), o;
        }
        addUniform(t, e, i, s, r, n) {
          const o = new Ot(this, t, e, i, s, r, n);
          return (o.shaderType = "both"), o;
        }
        _addUniform(t) {
          this._uniforms.push(t),
            this.setWhyCompile("add uniform " + name),
            (this._needsRecompile = !0);
        }
      },
      Mesh: class {
        constructor(t, e) {
          (this._log = new a("cgl_mesh")),
            (this._cgp = t),
            (this._geom = null),
            (this.numIndex = 0),
            (this._pipe = new Ft(this._cgp)),
            (this._numNonIndexed = 0),
            (this._positionBuffer = null),
            (this._bufVerticesIndizes = null),
            (this._attributes = []),
            (this._needsPipelineUpdate = !1),
            e && this.setGeom(e);
        }
        _createBuffer(t, e, i) {
          const s = t.createBuffer({
            size: e.byteLength,
            usage: i,
            mappedAtCreation: !0,
          });
          return new e.constructor(s.getMappedRange()).set(e), s.unmap(), s;
        }
        setGeom(t, e) {
          (this._needsPipelineUpdate = !0),
            (this._geom = t),
            this._disposeAttributes(),
            (this._positionBuffer = this._createBuffer(
              this._cgp.device,
              new Float32Array(t.vertices),
              GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            ));
          let i = t.verticesIndices;
          t.isIndexed() ||
            (i = Array.from(Array(t.vertices.length / 3).keys())),
            (this._numIndices = i.length),
            (this._indicesBuffer = this._createBuffer(
              this._cgp.device,
              new Uint32Array(i),
              GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
            )),
            t.texCoords &&
              t.texCoords.length &&
              this.setAttribute("texCoords", t.texCoords, 2),
            t.vertexNormals &&
              t.vertexNormals.length &&
              this.setAttribute("normals", t.vertexNormals, 3);
        }
        _disposeAttributes() {
          this._needsPipelineUpdate = !0;
          for (let t = 0; t < this._attributes.length; t++)
            this._attributes[t].buffer.destroy();
          this._attributes.length = 0;
        }
        dispose() {
          this._disposeAttributes();
        }
        setAttribute(t, e, i, s) {
          if (!e)
            throw (
              (this._log.error("mesh addAttribute - no array given! " + t),
              new Error())
            );
          for (let e = 0; e < this._attributes.length; e++) {
            const i = this._attributes[e];
            if (i.name == t) return i;
          }
          const r = {
            buffer: this._createBuffer(
              this._cgp.device,
              new Float32Array(e),
              GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            ),
            name: t,
          };
          return this._attributes.push(r), r;
        }
        render() {
          if (
            this._positionBuffer &&
            (this._cgp.getShader().bind(),
            this._cgp.getShader().isValid &&
              (this._pipe.setPipeline(this._cgp.getShader(), this),
              this._pipe.isValid))
          ) {
            this._cgp.passEncoder.setVertexBuffer(0, this._positionBuffer);
            for (let t = 0; t < this._attributes.length; t++)
              this._cgp.passEncoder.setVertexBuffer(
                t + 1,
                this._attributes[t].buffer
              );
            this._cgp.passEncoder.setIndexBuffer(this._indicesBuffer, "uint32"),
              this._numNonIndexed
                ? this._cgp.passEncoder.draw(this._numIndices)
                : this._cgp.passEncoder.drawIndexed(this._numIndices);
          }
        }
      },
      Pipeline: Ft,
      Texture: Ct,
    });
    window.CGP = wt;
    const Mt = function () {
      (this._arr = [mat4.create()]), (this._index = 0), (this.stateCounter = 0);
    };
    (Mt.prototype.push = function (t) {
      if (
        (this._index++, this.stateCounter++, this._index == this._arr.length)
      ) {
        const t = mat4.create();
        this._arr.push(t);
      }
      return (
        mat4.copy(this._arr[this._index], t || this._arr[this._index - 1]),
        this._arr[this._index]
      );
    }),
      (Mt.prototype.pop = function () {
        return (
          this.stateCounter++,
          this._index--,
          this._index < 0 && (this._index = 0),
          this._arr[this._index]
        );
      }),
      (Mt.prototype.length = function () {
        return this._index;
      });
    i(1);
    const Ut = function () {
        Y.apply(this),
          (this.canvas = null),
          (this.fpsCounter = new CABLES.CG.FpsCounter()),
          (this._identView = vec3.create()),
          (this._ident = vec3.create()),
          vec3.set(this._identView, 0, 0, -2),
          vec3.set(this._ident, 0, 0, 0),
          (this.pMatrix = mat4.create()),
          (this.mMatrix = mat4.create()),
          (this.vMatrix = mat4.create()),
          (this._textureslots = []),
          (this._pMatrixStack = new Mt()),
          (this._mMatrixStack = new Mt()),
          (this._vMatrixStack = new Mt()),
          (this.canvasWidth = -1),
          (this.canvasHeight = -1),
          (this.canvasScale = 1),
          (this.canvas = null),
          (this.pixelDensity = 1),
          mat4.identity(this.mMatrix),
          mat4.identity(this.vMatrix),
          (this.getGApiName = () => ["WebGL", "WebGPU"][this.gApi]),
          (this.setCanvas = function (t) {
            (this.canvas =
              "string" == typeof t ? document.getElementById(t) : t),
              this._setCanvas && this._setCanvas(t),
              this.updateSize();
          }),
          (this.updateSize = function () {
            (this.canvas.width = this.canvasWidth =
              this.canvas.clientWidth * this.pixelDensity),
              (this.canvas.height = this.canvasHeight =
                this.canvas.clientHeight * this.pixelDensity);
          }),
          (this.setSize = function (t, e, i) {
            i ||
              ((this.canvas.style.width = t + "px"),
              (this.canvas.style.height = e + "px")),
              (this.canvas.width = t * this.pixelDensity),
              (this.canvas.height = e * this.pixelDensity),
              this.updateSize();
          }),
          (this._resizeToWindowSize = function () {
            this.setSize(window.innerWidth, window.innerHeight),
              this.updateSize();
          }),
          (this._resizeToParentSize = function () {
            const t = this.canvas.parentElement;
            t
              ? (this.setSize(t.clientWidth, t.clientHeight), this.updateSize())
              : this._log.error("cables: can not resize to container element");
          }),
          (this.setAutoResize = function (t) {
            window.removeEventListener(
              "resize",
              this._resizeToWindowSize.bind(this)
            ),
              window.removeEventListener(
                "resize",
                this._resizeToParentSize.bind(this)
              ),
              "window" == t &&
                (window.addEventListener(
                  "resize",
                  this._resizeToWindowSize.bind(this)
                ),
                window.addEventListener(
                  "orientationchange",
                  this._resizeToWindowSize.bind(this)
                ),
                this._resizeToWindowSize()),
              "parent" == t &&
                (window.addEventListener(
                  "resize",
                  this._resizeToParentSize.bind(this)
                ),
                this._resizeToParentSize());
          }),
          (this.pushPMatrix = function () {
            this.pMatrix = this._pMatrixStack.push(this.pMatrix);
          }),
          (this.popPMatrix = function () {
            return (this.pMatrix = this._pMatrixStack.pop()), this.pMatrix;
          }),
          (this.getProjectionMatrixStateCount = function () {
            return this._pMatrixStack.stateCounter;
          }),
          (this.pushModelMatrix = function () {
            this.mMatrix = this._mMatrixStack.push(this.mMatrix);
          }),
          (this.popModelMatrix = function () {
            return (this.mMatrix = this._mMatrixStack.pop()), this.mMatrix;
          }),
          (this.modelMatrix = function () {
            return this.mMatrix;
          }),
          (this.pushViewMatrix = function () {
            this.vMatrix = this._vMatrixStack.push(this.vMatrix);
          }),
          (this.popViewMatrix = function () {
            this.vMatrix = this._vMatrixStack.pop();
          }),
          (this.getViewMatrixStateCount = function () {
            return this._vMatrixStack.stateCounter;
          }),
          (this._startMatrixStacks = (t, e) => {
            (t = t || this._ident),
              (e = e || this._identView),
              mat4.perspective(
                this.pMatrix,
                45,
                this.canvasWidth / this.canvasHeight,
                0.1,
                1e3
              ),
              mat4.identity(this.mMatrix),
              mat4.identity(this.vMatrix),
              mat4.translate(this.mMatrix, this.mMatrix, t),
              mat4.translate(this.vMatrix, this.vMatrix, e),
              this.pushPMatrix(),
              this.pushModelMatrix(),
              this.pushViewMatrix();
          }),
          (this._endMatrixStacks = () => {
            this.popViewMatrix(), this.popModelMatrix(), this.popPMatrix();
          });
      },
      Bt = function (t) {
        Ut.apply(this),
          (this.gApi = Rt.GAPI_WEBGL),
          (this.pushMvMatrix = this.pushModelMatrix),
          (this.popMvMatrix = this.popmMatrix = this.popModelMatrix),
          (this.profileData = new St(this)),
          (this._log = new a("cgl_context"));
        const e = [0, 0, 0, 0];
        (this.glVersion = 0),
          (this.glUseHalfFloatTex = !1),
          (this.clearCanvasTransparent = !0),
          (this.clearCanvasDepth = !0),
          (this.patch = t),
          (this.debugOneFrame = !1),
          (this.checkGlErrors = !0),
          (this.maxTextureUnits = 0),
          (this.maxVaryingVectors = 0),
          (this.currentProgram = null),
          (this._hadStackError = !1),
          (this.glSlowRenderer = !1),
          (this._isSafariCrap = !1),
          (this.temporaryTexture = null),
          (this.frameStore = {}),
          (this._onetimeCallbacks = []),
          (this.gl = null),
          (this._cursor = "auto"),
          (this._currentCursor = ""),
          (this._glFrameBufferStack = []),
          (this._frameBufferStack = []),
          (this._shaderStack = []),
          (this._stackDepthTest = []),
          Object.defineProperty(this, "mvMatrix", {
            get() {
              return this.mMatrix;
            },
            set(t) {
              this.mMatrix = t;
            },
          });
        const i = new It(this, "simpleshader");
        i.setModules([
          "MODULE_VERTEX_POSITION",
          "MODULE_COLOR",
          "MODULE_BEGIN_FRAG",
        ]),
          i.setSource(
            It.getDefaultVertexShader(),
            It.getDefaultFragmentShader()
          );
        let s = i;
        this.aborted = !1;
        const r = [];
        (this.exitError = function (t, e) {
          this.patch.exitError(t, e), (this.aborted = !0);
        }),
          (this._setCanvas = function (t) {
            if (
              (this.patch.config.canvas || (this.patch.config.canvas = {}),
              this.patch.config.canvas.hasOwnProperty(
                "preserveDrawingBuffer"
              ) || (this.patch.config.canvas.preserveDrawingBuffer = !1),
              this.patch.config.canvas.hasOwnProperty("premultipliedAlpha") ||
                (this.patch.config.canvas.premultipliedAlpha = !1),
              this.patch.config.canvas.hasOwnProperty("alpha") ||
                (this.patch.config.canvas.alpha = !1),
              (this.patch.config.canvas.stencil = !0),
              this.patch.config.hasOwnProperty("clearCanvasColor") &&
                (this.clearCanvasTransparent =
                  this.patch.config.clearCanvasColor),
              this.patch.config.hasOwnProperty("clearCanvasDepth") &&
                (this.clearCanvasDepth = this.patch.config.clearCanvasDepth),
              /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
                (this._isSafariCrap = !0),
              this.patch.config.canvas.forceWebGl1 ||
                (this.gl = this.canvas.getContext(
                  "webgl2",
                  this.patch.config.canvas
                )),
              this.gl && "WebGL 1.0" != this.gl.getParameter(this.gl.VERSION)
                ? (this.glVersion = 2)
                : ((this.gl =
                    this.canvas.getContext("webgl", this.patch.config.canvas) ||
                    this.canvas.getContext(
                      "experimental-webgl",
                      this.patch.config.canvas
                    )),
                  (this.glVersion = 1),
                  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
                    navigator.userAgent.match(/iPhone/i) &&
                    (this.glUseHalfFloatTex = !0),
                  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                    !window.MSStream &&
                    (this.patch.config.canvas.hasOwnProperty(
                      "powerPreference"
                    ) ||
                      (this.patch.config.canvas.powerPreference =
                        "high-performance"))),
              !this.gl)
            )
              return void this.exitError(
                "NO_WEBGL",
                "sorry, could not initialize WebGL. Please check if your Browser supports WebGL or try to restart your browser."
              );
            const e = this.gl.getExtension("WEBGL_debug_renderer_info");
            e &&
              ((this.glRenderer = this.gl.getParameter(
                e.UNMASKED_RENDERER_WEBGL
              )),
              "Google SwiftShader" === this.glRenderer &&
                (this.glSlowRenderer = !0)),
              this.gl.getExtension("OES_standard_derivatives");
            const i = this.gl.getExtension("ANGLE_instanced_arrays") || this.gl;
            this.canvas.addEventListener("webglcontextlost", (t) => {
              this._log.error("canvas lost...", t),
                this.emitEvent("webglcontextlost"),
                (this.aborted = !0);
            }),
              (this.maxVaryingVectors = this.gl.getParameter(
                this.gl.MAX_VARYING_VECTORS
              )),
              (this.maxTextureUnits = this.gl.getParameter(
                this.gl.MAX_TEXTURE_IMAGE_UNITS
              )),
              (this.maxTexSize = this.gl.getParameter(
                this.gl.MAX_TEXTURE_SIZE
              )),
              (this.maxUniformsFrag = this.gl.getParameter(
                this.gl.MAX_FRAGMENT_UNIFORM_VECTORS
              )),
              (this.maxUniformsVert = this.gl.getParameter(
                this.gl.MAX_VERTEX_UNIFORM_VECTORS
              )),
              (this.maxSamples = 0),
              this.gl.MAX_SAMPLES &&
                (this.maxSamples = this.gl.getParameter(this.gl.MAX_SAMPLES)),
              i.vertexAttribDivisorANGLE &&
                ((this.gl.vertexAttribDivisor =
                  i.vertexAttribDivisorANGLE.bind(i)),
                (this.gl.drawElementsInstanced =
                  i.drawElementsInstancedANGLE.bind(i)));
          }),
          (this.getInfo = function () {
            return {
              glVersion: this.glVersion,
              glRenderer: this.glRenderer,
              glUseHalfFloatTex: this.glUseHalfFloatTex,
              maxVaryingVectors: this.maxVaryingVectors,
              maxTextureUnits: this.maxTextureUnits,
              maxTexSize: this.maxTexSize,
              maxUniformsFrag: this.maxUniformsFrag,
              maxUniformsVert: this.maxUniformsVert,
              maxSamples: this.maxSamples,
            };
          });
        let n = -1,
          o = -1;
        (this.getViewPort = function () {
          return e;
        }),
          (this.resetViewPort = function () {
            this.gl.viewport(e[0], e[1], e[2], e[3]);
          }),
          (this.setViewPort = function (t, i, s, r) {
            (e[0] = Math.round(t)),
              (e[1] = Math.round(i)),
              (e[2] = Math.round(s)),
              (e[3] = Math.round(r)),
              this.gl.viewport(e[0], e[1], e[2], e[3]);
          }),
          (this.screenShot = function (t, e, i, s) {
            e &&
              (this.gl.clearColor(1, 1, 1, 1),
              this.gl.colorMask(!1, !1, !1, !0),
              this.gl.clear(this.gl.COLOR_BUFFER_BIT),
              this.gl.colorMask(!0, !0, !0, !0)),
              this.canvas &&
                this.canvas.toBlob &&
                this.canvas.toBlob(
                  (e) => {
                    t ? t(e) : this._log.log("no screenshot callback...");
                  },
                  i,
                  s
                );
          }),
          (this.endFrame = function () {
            if (
              (this.patch.isEditorMode() &&
                CABLES.GL_MARKER.drawMarkerLayer(this),
              this.setPreviousShader(),
              this._vMatrixStack.length() > 0 &&
                this.logStackError(
                  "view matrix stack length !=0 at end of rendering..."
                ),
              this._mMatrixStack.length() > 0 &&
                this.logStackError(
                  "mvmatrix stack length !=0 at end of rendering..."
                ),
              this._pMatrixStack.length() > 0 &&
                this.logStackError(
                  "pmatrix stack length !=0 at end of rendering..."
                ),
              this._glFrameBufferStack.length > 0 &&
                this.logStackError(
                  "glFrameBuffer stack length !=0 at end of rendering..."
                ),
              this._stackDepthTest.length > 0 &&
                this.logStackError(
                  "depthtest stack length !=0 at end of rendering..."
                ),
              this._stackDepthWrite.length > 0 &&
                this.logStackError(
                  "depthwrite stack length !=0 at end of rendering..."
                ),
              this._stackDepthFunc.length > 0 &&
                this.logStackError(
                  "depthfunc stack length !=0 at end of rendering..."
                ),
              this._stackBlend.length > 0 &&
                this.logStackError(
                  "blend stack length !=0 at end of rendering..."
                ),
              this._stackBlendMode.length > 0 &&
                this.logStackError(
                  "blendMode stack length !=0 at end of rendering..."
                ),
              this._shaderStack.length > 0 &&
                this.logStackError(
                  "this._shaderStack length !=0 at end of rendering..."
                ),
              this._stackCullFace.length > 0 &&
                this.logStackError(
                  "this._stackCullFace length !=0 at end of rendering..."
                ),
              this._stackCullFaceFacing.length > 0 &&
                this.logStackError(
                  "this._stackCullFaceFacing length !=0 at end of rendering..."
                ),
              (this._frameStarted = !1),
              n != this.canvasWidth || o != this.canvasHeight)
            ) {
              (n = this.canvasWidth),
                (o = this.canvasHeight),
                this.setSize(
                  this.canvasWidth / this.pixelDensity,
                  this.canvasHeight / this.pixelDensity
                ),
                this.updateSize();
              for (let t = 0; t < r.length; t++) r[t]();
              this.emitEvent("resize");
            }
            this._cursor != this._currentCursor &&
              (this._currentCursor = this.canvas.style.cursor = this._cursor),
              this.fpsCounter.endFrame();
          }),
          (this.logStackError = function (t) {
            this._hadStackError ||
              ((this._hadStackError = !0),
              this._log.warn("[" + this.canvas.id + "]: ", t));
          }),
          (this.getShader = function () {
            if (
              s &&
              (!this.frameStore ||
                ((!0 === this.frameStore.renderOffscreen) == s.offScreenPass) ==
                  !0)
            )
              return s;
            for (let t = this._shaderStack.length - 1; t >= 0; t--)
              if (
                this._shaderStack[t] &&
                this.frameStore.renderOffscreen ==
                  this._shaderStack[t].offScreenPass
              )
                return this._shaderStack[t];
          }),
          (this.getDefaultShader = function () {
            return i;
          }),
          (this.pushShader = this.setShader =
            function (t) {
              this._shaderStack.push(t), (s = t);
            }),
          (this.popShader = this.setPreviousShader =
            function () {
              if (0 === this._shaderStack.length)
                throw new Error("Invalid shader stack pop!");
              this._shaderStack.pop(),
                (s = this._shaderStack[this._shaderStack.length - 1]);
            }),
          (this.pushGlFrameBuffer = function (t) {
            this._glFrameBufferStack.push(t);
          }),
          (this.popGlFrameBuffer = function () {
            return 0 == this._glFrameBufferStack.length
              ? null
              : (this._glFrameBufferStack.pop(),
                this._glFrameBufferStack[this._glFrameBufferStack.length - 1]);
          }),
          (this.getCurrentGlFrameBuffer = function () {
            return 0 === this._glFrameBufferStack.length
              ? null
              : this._glFrameBufferStack[this._glFrameBufferStack.length - 1];
          }),
          (this.pushFrameBuffer = function (t) {
            this._frameBufferStack.push(t);
          }),
          (this.popFrameBuffer = function () {
            return 0 == this._frameBufferStack.length
              ? null
              : (this._frameBufferStack.pop(),
                this._frameBufferStack[this._frameBufferStack.length - 1]);
          }),
          (this.getCurrentFrameBuffer = function () {
            return 0 === this._frameBufferStack.length
              ? null
              : this._frameBufferStack[this._frameBufferStack.length - 1];
          }),
          (this.renderStart = function (t, e, s) {
            this.fpsCounter.startFrame(),
              this.pushDepthTest(!0),
              this.pushDepthWrite(!0),
              this.pushDepthFunc(t.gl.LEQUAL),
              this.pushCullFaceFacing(t.gl.BACK),
              this.pushCullFace(!1),
              this.clearCanvasTransparent &&
                (t.gl.clearColor(0, 0, 0, 0),
                t.gl.clear(t.gl.COLOR_BUFFER_BIT)),
              this.clearCanvasDepth && t.gl.clear(t.gl.DEPTH_BUFFER_BIT),
              t.setViewPort(0, 0, t.canvasWidth, t.canvasHeight),
              this._startMatrixStacks(e, s),
              t.pushBlendMode(at.BLEND_MODES.BLEND_NORMAL, !1);
            for (let t = 0; t < this._textureslots.length; t++)
              this._textureslots[t] = null;
            if (
              (this.pushShader(i),
              (this._frameStarted = !0),
              this._onetimeCallbacks.length > 0)
            ) {
              for (let t = 0; t < this._onetimeCallbacks.length; t++)
                this._onetimeCallbacks[t]();
              this._onetimeCallbacks.length = 0;
            }
            this.emitEvent("beginFrame");
          }),
          (this.renderEnd = function (t) {
            this._endMatrixStacks(),
              this.popDepthTest(),
              this.popDepthWrite(),
              this.popDepthFunc(),
              this.popCullFaceFacing(),
              this.popCullFace(),
              this.popBlend(),
              this.popBlendMode(),
              t.endFrame(),
              this.emitEvent("endFrame");
          }),
          (this.getTexture = function (t) {
            return this._textureslots[t];
          }),
          (this.checkFrameStarted = function (t) {
            this._frameStarted ||
              (this._log.warn("frame not started " + t),
              this.patch.printTriggerStack());
          }),
          (this.setTexture = function (t, e, i) {
            return (
              this.checkFrameStarted("cgl setTexture"),
              null === e && (e = CGL.Texture.getEmptyTexture(this).tex),
              this._textureslots[t] != e &&
                (this.gl.activeTexture(this.gl.TEXTURE0 + t),
                this.gl.bindTexture(i || this.gl.TEXTURE_2D, e),
                (this._textureslots[t] = e)),
              !0
            );
          }),
          (this.fullScreen = function () {
            this.canvas.requestFullscreen
              ? this.canvas.requestFullscreen()
              : this.canvas.mozRequestFullScreen
              ? this.canvas.mozRequestFullScreen()
              : this.canvas.webkitRequestFullscreen
              ? this.canvas.webkitRequestFullscreen()
              : this.canvas.msRequestFullscreen &&
                this.canvas.msRequestFullscreen();
          }),
          (this.printError = function (t) {
            if (!this.checkGlErrors) return;
            let e = !1,
              i = this.gl.getError();
            if (i != this.gl.NO_ERROR) {
              let s = "";
              i == this.gl.OUT_OF_MEMORY && (s = "OUT_OF_MEMORY"),
                i == this.gl.INVALID_ENUM && (s = "INVALID_ENUM"),
                i == this.gl.INVALID_OPERATION && (s = "INVALID_OPERATION"),
                i == this.gl.INVALID_FRAMEBUFFER_OPERATION &&
                  (s = "INVALID_FRAMEBUFFER_OPERATION"),
                i == this.gl.INVALID_VALUE && (s = "INVALID_VALUE"),
                i == this.gl.CONTEXT_LOST_WEBGL &&
                  ((this.aborted = !0), (s = "CONTEXT_LOST_WEBGL")),
                i == this.gl.NO_ERROR && (s = "NO_ERROR"),
                (e = !0),
                this._log.warn("gl error [" + this.canvas.id + "]: ", t, i, s),
                -1 == this.canvas.id.indexOf("glGuiCanvas") &&
                  (this._loggedGlError ||
                    (this.patch.printTriggerStack(),
                    this._log.stack("glerror"),
                    (this._loggedGlError = !0)));
            }
            return (i = this.gl.getError()), e;
          }),
          (this.saveScreenshot = function (t, e, i, s, r) {
            this.patch.renderOneFrame();
            let n = this.canvas.clientWidth,
              o = this.canvas.clientHeight;
            function a(t, e, i) {
              return Array(e - String(t).length + 1).join(i || "0") + t;
            }
            i && ((this.canvas.width = i), (n = i)),
              s && ((this.canvas.height = s), (o = s));
            const h = new Date(),
              l = ""
                .concat(
                  String(h.getFullYear()) +
                    String(h.getMonth() + 1) +
                    String(h.getDate()),
                  "_"
                )
                .concat(a(h.getHours(), 2))
                .concat(a(h.getMinutes(), 2))
                .concat(a(h.getSeconds(), 2));
            t ? (t += ".png") : (t = "cables_" + l + ".png"),
              this.patch.cgl.screenShot(
                function (i) {
                  if (((this.canvas.width = n), (this.canvas.height = o), i)) {
                    const s = document.createElement("a");
                    (s.download = t),
                      (s.href = URL.createObjectURL(i)),
                      setTimeout(function () {
                        s.click(), e && e(i);
                      }, 100);
                  } else this._log.log("screenshot: no blob");
                }.bind(this),
                r
              );
          });
      };
    (Bt.prototype.addNextFrameOnceCallback = function (t) {
      t && this._onetimeCallbacks.push(t);
    }),
      (Bt.prototype._stackDepthTest = []),
      (Bt.prototype.pushDepthTest = function (t) {
        this._stackDepthTest.push(t),
          t
            ? this.gl.enable(this.gl.DEPTH_TEST)
            : this.gl.disable(this.gl.DEPTH_TEST);
      }),
      (Bt.prototype.stateDepthTest = function () {
        return this._stackDepthTest[this._stackDepthTest.length - 1];
      }),
      (Bt.prototype.popDepthTest = function () {
        this._stackDepthTest.pop(),
          this._stackDepthTest[this._stackDepthTest.length - 1]
            ? this.gl.enable(this.gl.DEPTH_TEST)
            : this.gl.disable(this.gl.DEPTH_TEST);
      }),
      (Bt.prototype._stackDepthWrite = []),
      (Bt.prototype.pushDepthWrite = function (t) {
        (t = t || !1), this._stackDepthWrite.push(t), this.gl.depthMask(t);
      }),
      (Bt.prototype.stateDepthWrite = function () {
        return this._stackDepthWrite[this._stackDepthWrite.length - 1];
      }),
      (Bt.prototype.popDepthWrite = function () {
        this._stackDepthWrite.pop(),
          this.gl.depthMask(
            this._stackDepthWrite[this._stackDepthWrite.length - 1] || !1
          );
      }),
      (Bt.prototype._stackCullFace = []),
      (Bt.prototype.pushCullFace = function (t) {
        this._stackCullFace.push(t),
          t
            ? this.gl.enable(this.gl.CULL_FACE)
            : this.gl.disable(this.gl.CULL_FACE);
      }),
      (Bt.prototype.stateCullFace = function () {
        return this._stackCullFace[this._stackCullFace.length - 1];
      }),
      (Bt.prototype.popCullFace = function () {
        this._stackCullFace.pop(),
          this._stackCullFace[this._stackCullFace.length - 1]
            ? this.gl.enable(this.gl.CULL_FACE)
            : this.gl.disable(this.gl.CULL_FACE);
      }),
      (Bt.prototype._stackCullFaceFacing = []),
      (Bt.prototype.pushCullFaceFacing = function (t) {
        this._stackCullFaceFacing.push(t),
          this.gl.cullFace(
            this._stackCullFaceFacing[this._stackCullFaceFacing.length - 1]
          );
      }),
      (Bt.prototype.stateCullFaceFacing = function () {
        return this._stackCullFaceFacing[this._stackCullFaceFacing.length - 1];
      }),
      (Bt.prototype.popCullFaceFacing = function () {
        this._stackCullFaceFacing.pop(),
          this._stackCullFaceFacing.length > 0 &&
            this.gl.cullFace(
              this._stackCullFaceFacing[this._stackCullFaceFacing.length - 1]
            );
      }),
      (Bt.prototype._stackDepthFunc = []),
      (Bt.prototype.pushDepthFunc = function (t) {
        this._stackDepthFunc.push(t), this.gl.depthFunc(t);
      }),
      (Bt.prototype.stateDepthFunc = function () {
        return (
          this._stackDepthFunc.length > 0 &&
          this._stackDepthFunc[this._stackDepthFunc.length - 1]
        );
      }),
      (Bt.prototype.popDepthFunc = function () {
        this._stackDepthFunc.pop(),
          this._stackDepthFunc.length > 0 &&
            this.gl.depthFunc(
              this._stackDepthFunc[this._stackDepthFunc.length - 1]
            );
      }),
      (Bt.prototype._stackBlend = []),
      (Bt.prototype.pushBlend = function (t) {
        this._stackBlend.push(t),
          t ? this.gl.enable(this.gl.BLEND) : this.gl.disable(this.gl.BLEND);
      }),
      (Bt.prototype.popBlend = function () {
        this._stackBlend.pop(),
          this._stackBlend[this._stackBlend.length - 1]
            ? this.gl.enable(this.gl.BLEND)
            : this.gl.disable(this.gl.BLEND);
      }),
      (Bt.prototype.stateBlend = function () {
        return this._stackBlend[this._stackBlend.length - 1];
      });
    (Bt.prototype._stackBlendMode = []),
      (Bt.prototype._stackBlendModePremul = []),
      (Bt.prototype.pushBlendMode = function (t, e) {
        this._stackBlendMode.push(t), this._stackBlendModePremul.push(e);
        const i = this._stackBlendMode.length - 1;
        this.pushBlend(this._stackBlendMode[i] !== at.BLEND_MODES.BLEND_NONE),
          this._setBlendMode(
            this._stackBlendMode[i],
            this._stackBlendModePremul[i]
          );
      }),
      (Bt.prototype.popBlendMode = function () {
        this._stackBlendMode.pop(), this._stackBlendModePremul.pop();
        const t = this._stackBlendMode.length - 1;
        this.popBlend(this._stackBlendMode[t] !== at.BLEND_MODES.BLEND_NONE),
          t >= 0 &&
            this._setBlendMode(
              this._stackBlendMode[t],
              this._stackBlendModePremul[t]
            );
      }),
      (Bt.prototype._stackStencil = []),
      (Bt.prototype.pushStencil = function (t) {
        this._stackStencil.push(t),
          t
            ? this.gl.enable(this.gl.STENCIL_TEST)
            : this.gl.disable(this.gl.STENCIL_TEST);
      }),
      (Bt.prototype.popStencil = function () {
        this._stackStencil.pop(),
          this._stackStencil[this._stackStencil.length - 1]
            ? this.gl.enable(this.gl.STENCIL_TEST)
            : this.gl.disable(this.gl.STENCIL_TEST);
      }),
      (Bt.prototype.glGetAttribLocation = function (t, e) {
        return this.gl.getAttribLocation(t, e);
      }),
      (Bt.prototype.shouldDrawHelpers = function (t) {
        if (this.frameStore.shadowPass) return !1;
        if (!t.patch.isEditorMode()) return !1;
        const e = this.getCurrentFrameBuffer();
        if (e && e.getWidth) {
          if (
            !(
              this.canvasWidth / this.canvasHeight ==
              e.getWidth() / e.getHeight()
            )
          )
            return !1;
        }
        return (
          CABLES.UI.renderHelper ||
          (CABLES.UI.renderHelperCurrent && t.isCurrentUiOp())
        );
      }),
      (Bt.prototype._setBlendMode = function (t, e) {
        const i = this.gl;
        t == at.BLEND_MODES.BLEND_NONE ||
          (t == at.BLEND_MODES.BLEND_ADD
            ? e
              ? (i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                i.blendFuncSeparate(i.ONE, i.ONE, i.ONE, i.ONE))
              : (i.blendEquation(i.FUNC_ADD), i.blendFunc(i.SRC_ALPHA, i.ONE))
            : t == at.BLEND_MODES.BLEND_SUB
            ? e
              ? (i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                i.blendFuncSeparate(
                  i.ZERO,
                  i.ZERO,
                  i.ONE_MINUS_SRC_COLOR,
                  i.ONE_MINUS_SRC_ALPHA
                ))
              : (i.blendEquation(i.FUNC_ADD),
                i.blendFunc(i.ZERO, i.ONE_MINUS_SRC_COLOR))
            : t == at.BLEND_MODES.BLEND_MUL
            ? e
              ? (i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA))
              : (i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ZERO, i.SRC_COLOR))
            : t == at.BLEND_MODES.BLEND_NORMAL
            ? e
              ? (i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                i.blendFuncSeparate(
                  i.ONE,
                  i.ONE_MINUS_SRC_ALPHA,
                  i.ONE,
                  i.ONE_MINUS_SRC_ALPHA
                ))
              : (i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                i.blendFuncSeparate(
                  i.SRC_ALPHA,
                  i.ONE_MINUS_SRC_ALPHA,
                  i.ONE,
                  i.ONE_MINUS_SRC_ALPHA
                ))
            : this._log.log("setblendmode: unknown blendmode"));
      }),
      (Bt.prototype.createMesh = function (t, e) {
        return new CGL.Mesh(this, t, e);
      }),
      (Bt.prototype.setCursor = function (t) {
        this._cursor = t;
      });
    const Lt = Object.assign(
      {
        Framebuffer: function (t, e, i, s) {
          const r = t;
          this._log = new a("Framebuffer");
          const n =
            r.gl.getExtension("WEBGL_depth_texture") ||
            r.gl.getExtension("WEBKIT_WEBGL_depth_texture") ||
            r.gl.getExtension("MOZ_WEBGL_depth_texture") ||
            r.gl.DEPTH_TEXTURE;
          n || r.exitError("NO_DEPTH_TEXTURE", "no depth texture support");
          let o = e || 512,
            h = i || 512;
          (s = s || { isFloatingPointTexture: !1 }).hasOwnProperty("clear") ||
            (s.clear = !0),
            s.hasOwnProperty("filter") || (s.filter = B.FILTER_LINEAR);
          const l = new B(r, {
            isFloatingPointTexture: s.isFloatingPointTexture,
            filter: s.filter,
            wrap: s.wrap || B.CLAMP_TO_EDGE,
          });
          let c = null;
          n && (c = new B(r, { isDepthTexture: !0 })), (this._options = s);
          const u = r.gl.createFramebuffer(),
            g = r.gl.createRenderbuffer();
          (this.getWidth = function () {
            return o;
          }),
            (this.getHeight = function () {
              return h;
            }),
            (this.getGlFrameBuffer = function () {
              return u;
            }),
            (this.getDepthRenderBuffer = function () {
              return g;
            }),
            (this.getTextureColor = function () {
              return l;
            }),
            (this.getTextureDepth = function () {
              return c;
            }),
            (this.setFilter = function (t) {
              (l.filter = t), l.setSize(o, h);
            }),
            (this.setSize = function (t, e) {
              if (
                (t < 2 && (t = 2),
                e < 2 && (e = 2),
                (o = Math.ceil(t)),
                (h = Math.ceil(e)),
                r.profileData.profileFrameBuffercreate++,
                r.gl.bindFramebuffer(r.gl.FRAMEBUFFER, u),
                r.gl.bindRenderbuffer(r.gl.RENDERBUFFER, g),
                l.setSize(o, h),
                c && c.setSize(o, h),
                n &&
                  r.gl.renderbufferStorage(
                    r.gl.RENDERBUFFER,
                    r.gl.DEPTH_COMPONENT16,
                    o,
                    h
                  ),
                r.gl.framebufferTexture2D(
                  r.gl.FRAMEBUFFER,
                  r.gl.COLOR_ATTACHMENT0,
                  r.gl.TEXTURE_2D,
                  l.tex,
                  0
                ),
                n &&
                  (r.gl.framebufferRenderbuffer(
                    r.gl.FRAMEBUFFER,
                    r.gl.DEPTH_ATTACHMENT,
                    r.gl.RENDERBUFFER,
                    g
                  ),
                  r.gl.framebufferTexture2D(
                    r.gl.FRAMEBUFFER,
                    r.gl.DEPTH_ATTACHMENT,
                    r.gl.TEXTURE_2D,
                    c.tex,
                    0
                  )),
                !r.gl.isFramebuffer(u))
              )
                throw new Error("Invalid framebuffer");
              const i = r.gl.checkFramebufferStatus(r.gl.FRAMEBUFFER);
              switch (i) {
                case r.gl.FRAMEBUFFER_COMPLETE:
                  break;
                case r.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                  throw (
                    (this._log.warn(
                      "FRAMEBUFFER_INCOMPLETE_ATTACHMENT...",
                      o,
                      h,
                      l.tex,
                      g
                    ),
                    new Error(
                      "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT"
                    ))
                  );
                case r.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                  throw (
                    (this._log.warn(
                      "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
                    ),
                    new Error(
                      "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
                    ))
                  );
                case r.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                  throw (
                    (this._log.warn("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"),
                    new Error(
                      "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS"
                    ))
                  );
                case r.gl.FRAMEBUFFER_UNSUPPORTED:
                  throw (
                    (this._log.warn("FRAMEBUFFER_UNSUPPORTED"),
                    new Error(
                      "Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED"
                    ))
                  );
                case 36059:
                  this._log.warn(
                    "Incomplete: FRAMEBUFFER_INCOMPLETE_DRAW_BUFFER from ext. Or Safari/iOS undefined behaviour."
                  );
                  break;
                default:
                  throw (
                    (this._log.warn("incomplete framebuffer", i),
                    new Error("Incomplete framebuffer: " + i))
                  );
              }
              r.gl.bindTexture(r.gl.TEXTURE_2D, null),
                r.gl.bindRenderbuffer(r.gl.RENDERBUFFER, null),
                r.gl.bindFramebuffer(r.gl.FRAMEBUFFER, null);
            }),
            (this.renderStart = function () {
              r.pushModelMatrix(),
                r.gl.bindFramebuffer(r.gl.FRAMEBUFFER, u),
                r.pushGlFrameBuffer(u),
                r.pushFrameBuffer(this),
                r.pushPMatrix(),
                r.gl.viewport(0, 0, o, h),
                this._options.clear &&
                  (r.gl.clearColor(0, 0, 0, 0),
                  r.gl.clear(r.gl.COLOR_BUFFER_BIT | r.gl.DEPTH_BUFFER_BIT));
            }),
            (this.renderEnd = function () {
              r.popPMatrix(),
                r.gl.bindFramebuffer(r.gl.FRAMEBUFFER, r.popGlFrameBuffer()),
                r.popFrameBuffer(),
                r.popModelMatrix(),
                r.resetViewPort();
            }),
            (this.delete = function () {
              l.delete(),
                c && c.delete(),
                r.gl.deleteRenderbuffer(g),
                r.gl.deleteFramebuffer(u);
            }),
            this.setSize(o, h);
        },
        Framebuffer2: L,
        Geometry: W,
        BoundingBox: z,
        Marker: function (t) {
          const e = new W("marker");
          e.setPointVertices([
            1e-5, 0, 0, 1, 0, 0, 0, 1e-5, 0, 0, 1, 0, 0, 0, 1e-5, 0, 0, 1,
          ]);
          const i = new lt(t, e, t.gl.LINES);
          i.setGeom(e);
          const s = new It(t, "markermaterial"),
            r =
              "".endl() +
              "precision highp float;".endl() +
              "IN vec3 axisColor;".endl() +
              "void main()".endl() +
              "{".endl() +
              "    vec4 col=vec4(axisColor,1.0);".endl() +
              "    outColor = col;".endl() +
              "}",
            n =
              "".endl() +
              "IN vec3 vPosition;".endl() +
              "UNI mat4 projMatrix;".endl() +
              "UNI mat4 mvMatrix;".endl() +
              "OUT vec3 axisColor;".endl() +
              "void main()".endl() +
              "{".endl() +
              "   vec4 pos=vec4(vPosition, 1.0);".endl() +
              "   if(pos.x!=0.0)axisColor=vec3(1.0,0.3,0.0);".endl() +
              "   if(pos.y!=0.0)axisColor=vec3(0.0,1.0,0.2);".endl() +
              "   if(pos.z!=0.0)axisColor=vec3(0.0,0.5,1.0);".endl() +
              "   gl_Position = projMatrix * mvMatrix * pos;".endl() +
              "}";
          s.setSource(n, r),
            (this._vScale = vec3.create()),
            (this.draw = function (t, e, r) {
              const n = e || 2;
              t.pushModelMatrix(),
                t.pushShader(s),
                vec3.set(this._vScale, n, n, n),
                mat4.scale(t.mvMatrix, t.mvMatrix, this._vScale),
                t.pushDepthTest(1 == r),
                i.render(t.getShader()),
                t.popDepthTest(),
                t.popShader(),
                t.popModelMatrix();
            });
        },
        WirePoint: function (t) {
          const e = t.gl.createBuffer(),
            i = vec3.create();
          (this.render = function (t, s) {
            t.pushModelMatrix(),
              vec3.set(i, s, s, s),
              mat4.scale(t.mvMatrix, t.mvMatrix, i);
            const r = t.getShader();
            r &&
              (r.bind(),
              t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
              t.gl.vertexAttribPointer(
                r.getAttrVertexPos(),
                e.itemSize,
                t.gl.FLOAT,
                !1,
                0,
                0
              ),
              t.gl.enableVertexAttribArray(r.getAttrVertexPos()),
              t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
              t.gl.drawArrays(t.gl.LINE_STRIP, 0, e.numItems)),
              t.popModelMatrix();
          }),
            (function () {
              const i = [];
              let s = 0,
                r = 0;
              for (s = 0; s <= Math.round(24); s++)
                (r = (360 / Math.round(24)) * s * mt),
                  i.push(0.5 * Math.cos(r)),
                  i.push(0),
                  i.push(0.5 * Math.sin(r));
              for (s = 0; s <= Math.round(24); s++)
                (r = (360 / Math.round(24)) * s * mt),
                  i.push(0.5 * Math.cos(r)),
                  i.push(0.5 * Math.sin(r)),
                  i.push(0);
              for (s = 0; s <= Math.round(24); s++)
                (r = (360 / Math.round(24)) * s * mt),
                  i.push(0),
                  i.push(0.5 * Math.cos(r)),
                  i.push(0.5 * Math.sin(r));
              t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
                t.gl.bufferData(
                  t.gl.ARRAY_BUFFER,
                  new Float32Array(i),
                  t.gl.STATIC_DRAW
                ),
                (e.itemSize = 3),
                (e.numItems = i.length / e.itemSize);
            })();
        },
        WireCube: function (t) {
          const e = t.gl.createBuffer(),
            i = vec3.create();
          (this.render = function (t, s, r, n) {
            t.pushModelMatrix(),
              vec3.set(i, s || 1, r || 1, n || 1),
              mat4.scale(t.mvMatrix, t.mvMatrix, i);
            const o = t.getShader();
            o &&
              (o.bind(),
              t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
              t.gl.vertexAttribPointer(
                o.getAttrVertexPos(),
                e.itemSize,
                t.gl.FLOAT,
                !1,
                0,
                0
              ),
              t.gl.enableVertexAttribArray(o.getAttrVertexPos()),
              t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
              t.gl.drawArrays(t.gl.LINE_STRIP, 0, e.numItems)),
              t.popModelMatrix();
          }),
            (function () {
              const i = [];
              i.push(-1, -1, 1),
                i.push(1, -1, 1),
                i.push(1, 1, 1),
                i.push(-1, 1, 1),
                i.push(-1, -1, 1),
                i.push(-1, -1, -1),
                i.push(1, -1, -1),
                i.push(1, 1, -1),
                i.push(-1, 1, -1),
                i.push(-1, -1, -1),
                i.push(-1, -1, -1),
                i.push(-1, 1, -1),
                i.push(-1, 1, 1),
                i.push(-1, -1, 1),
                i.push(-1, -1, -1),
                i.push(1, -1, -1),
                i.push(1, 1, -1),
                i.push(1, 1, 1),
                i.push(1, -1, 1),
                i.push(1, -1, -1),
                t.gl.bindBuffer(t.gl.ARRAY_BUFFER, e),
                t.gl.bufferData(
                  t.gl.ARRAY_BUFFER,
                  new Float32Array(i),
                  t.gl.STATIC_DRAW
                ),
                (e.itemSize = 3),
                (e.numItems = i.length / e.itemSize);
            })();
        },
        MatrixStack: Mt,
        Mesh: lt,
        MESH: ht,
        ShaderLibMods: pt,
        Shader: It,
        Uniform: nt,
        MESHES: ut,
        Context: Bt,
        Texture: B,
        TextureEffect: gt,
        isWindows: Et,
        getWheelSpeed: At,
        getWheelDelta: bt,
        onLoadingAssetsFinished: null,
        ProfileData: St,
        UniColorShader: class {
          constructor(t) {
            this.shader = new CGL.Shader(t, "markermaterial");
            const e =
                "".endl() +
                "void main()".endl() +
                "{".endl() +
                "    outColor = vec4(color.rgb,1.0);".endl() +
                "}",
              i =
                "".endl() +
                "IN vec3 vPosition;".endl() +
                "UNI mat4 projMatrix;".endl() +
                "UNI mat4 mvMatrix;".endl() +
                "void main()".endl() +
                "{".endl() +
                "   gl_Position = projMatrix * mvMatrix * vec4(vPosition,1.0);".endl() +
                "}";
            this.shader.setSource(i, e),
              (this.coloruni = this.shader.addUniformFrag(
                "4f",
                "color",
                [1, 0.777, 1, 1]
              ));
          }
          setColor(t, e, i, s) {
            this.coloruni.set(t, e, i, s);
          }
        },
      },
      at.BLEND_MODES,
      at.SHADER,
      at.MATH,
      at.BLEND_MODES
    );
    window.CGL = Lt;
    const kt = function (t) {
      Y.apply(this),
        (this.id = CABLES.uuid()),
        (this.portIn = null),
        (this.portOut = null),
        (this.scene = t),
        (this.activityCounter = 0),
        (this.ignoreInSerialize = !1);
    };
    (kt.prototype.setValue = function (t) {
      void 0 === t ? this._setValue() : this.portIn.set(t);
    }),
      (kt.prototype.activity = function () {
        this.activityCounter++;
      }),
      (kt.prototype._setValue = function () {
        if (!this.portOut) return void this.remove();
        const t = this.portOut.get();
        t == t &&
          (this.portIn.type != l.OP_PORT_TYPE_FUNCTION && this.activity(),
          (this.portIn.get() !== t || this.portIn.changeAlways) &&
            this.portIn.set(t));
      }),
      (kt.prototype.getOtherPort = function (t) {
        return t == this.portIn ? this.portOut : this.portIn;
      }),
      (kt.prototype.remove = function () {
        this.portIn && this.portIn.removeLink(this),
          this.portOut && this.portOut.removeLink(this),
          this.scene &&
            this.scene.emitEvent("onUnLink", this.portIn, this.portOut, this),
          !this.portIn ||
            (this.portIn.type != l.OP_PORT_TYPE_OBJECT &&
              this.portIn.type != l.OP_PORT_TYPE_ARRAY) ||
            (this.portIn.set(null),
            this.portIn.links.length > 0 &&
              this.portIn.set(
                this.portIn.links[0].getOtherPort(this.portIn).get()
              )),
          this.portIn && this.portIn.parent._checkLinksNeededToWork(),
          this.portOut && this.portOut.parent._checkLinksNeededToWork(),
          (this.portIn = null),
          (this.portOut = null),
          (this.scene = null);
      }),
      (kt.prototype.link = function (t, e) {
        if (!kt.canLink(t, e))
          return console.warn("[core_link] cannot link ports!", t, e), !1;
        t.direction == c.PORT_DIR_IN
          ? ((this.portIn = t), (this.portOut = e))
          : ((this.portIn = e), (this.portOut = t)),
          t.addLink(this),
          e.addLink(this),
          this.setValue(),
          t.onLink && t.onLink(this),
          e.onLink && e.onLink(this),
          t.parent._checkLinksNeededToWork(),
          e.parent._checkLinksNeededToWork();
      }),
      (kt.prototype.getSerialized = function () {
        const t = {};
        return (
          (t.portIn = this.portIn.getName()),
          (t.portOut = this.portOut.getName()),
          (t.objIn = this.portIn.parent.id),
          (t.objOut = this.portOut.parent.id),
          t
        );
      }),
      (kt.canLinkText = function (t, e) {
        if (t.direction == e.direction) {
          let t = "(out)";
          return (
            e.direction == c.PORT_DIR_IN && (t = "(in)"),
            "can not link: same direction " + t
          );
        }
        return t.parent == e.parent
          ? "can not link: same op"
          : t.type != l.OP_PORT_TYPE_DYNAMIC &&
            e.type != l.OP_PORT_TYPE_DYNAMIC &&
            t.type != e.type
          ? "can not link: different type"
          : t
          ? e
            ? (t.direction == c.PORT_DIR_IN && t.isAnimated()) ||
              (e.direction == c.PORT_DIR_IN && e.isAnimated())
              ? "can not link: is animated"
              : t.isLinkedTo(e)
              ? "ports already linked"
              : (t.canLink && !t.canLink(e)) || (e.canLink && !e.canLink(t))
              ? "Incompatible"
              : "can link"
            : "can not link: port 2 invalid"
          : "can not link: port 1 invalid";
      }),
      (kt.canLink = function (t, e) {
        return (
          !!t &&
          !!e &&
          (t.direction != c.PORT_DIR_IN || !t.isAnimated()) &&
          (e.direction != c.PORT_DIR_IN || !e.isAnimated()) &&
          !t.isHidden() &&
          !e.isHidden() &&
          !t.isLinkedTo(e) &&
          t.direction != e.direction &&
          (t.type == e.type ||
            t.type == l.OP_PORT_TYPE_DYNAMIC ||
            e.type == l.OP_PORT_TYPE_DYNAMIC) &&
          (t.type == l.OP_PORT_TYPE_DYNAMIC ||
            e.type == l.OP_PORT_TYPE_DYNAMIC ||
            (t.parent != e.parent &&
              !(t.canLink && !t.canLink(e)) &&
              !(e.canLink && !e.canLink(t))))
        );
      });
    const Vt = function () {
      Y.apply(this),
        (this._log = new a("core_op")),
        (this.data = {}),
        (this.storage = {}),
        (this.objName = ""),
        (this.portsOut = []),
        (this.portsIn = []),
        (this.portsInData = []),
        (this.opId = ""),
        (this.uiAttribs = {}),
        (this.enabled = !0),
        (this.patch = arguments[0]),
        (this.name = arguments[1]),
        (this._needsLinkedToWork = []),
        (this._needsParentOp = null),
        (this._shortOpName = ""),
        (this.hasUiErrors = !1),
        (this._uiErrors = {}),
        arguments[1] &&
          ((this._shortOpName = CABLES.getShortOpName(arguments[1])),
          this.getTitle()),
        (this.id = arguments[2] || T()),
        (this.onAddPort = null),
        (this.onCreate = null),
        (this.onResize = null),
        (this.onLoaded = null),
        (this.onDelete = null),
        (this.onUiAttrChange = null),
        (this.onError = null),
        (this._instances = null),
        (this.preRender = null),
        (this.init = null);
    };
    {
      (Vt.prototype.clearUiAttrib = function (t) {
        const e = { name: null };
        this.uiAttrib(e);
      }),
        (Vt.prototype.getTitle = function () {
          return this.uiAttribs
            ? ((void 0 !== this.uiAttribs.title &&
                "" !== this.uiAttribs.title) ||
                -1 != this.objName.indexOf("Ops.Ui.") ||
                (this.uiAttribs.title = this._shortOpName),
              void 0 === this.uiAttribs.title &&
                (this.uiAttribs.title = this._shortOpName),
              this.uiAttribs.title)
            : "nouiattribs" + this.name;
        }),
        (Vt.prototype.setTitle = function (t) {
          const e = this.name != t;
          (this.name = t),
            this.uiAttr({ title: t }),
            e && this.emitEvent("onTitleChange", t);
        });
      const t = function (t) {
        if (!t) return;
        (t.error || t.warning || t.hint) &&
          this._log.warn(
            "old ui error/warning attribute in " +
              this.name +
              ", use op.setUiError !",
            t
          ),
          "object" != typeof t &&
            this._log.error("op.uiAttrib attribs are not of type object"),
          this.uiAttribs || (this.uiAttribs = {});
        let e = !1;
        for (const i in t)
          this.uiAttribs[i] != t[i] && (e = !0), (this.uiAttribs[i] = t[i]);
        this.uiAttribs.hasOwnProperty("selected") &&
          0 == this.uiAttribs.selected &&
          delete this.uiAttribs.selected,
          t.title && t.title != this.name && this.setTitle(t.title),
          e &&
            (this.emitEvent("onUiAttribsChange", t),
            this.patch.emitEvent("onUiAttribsChange", this, t));
      };
      (Vt.prototype.setUiAttribs =
        Vt.prototype.setUiAttrib =
        Vt.prototype.uiAttr =
          t),
        (Vt.prototype.getName = function () {
          return this.uiAttribs.name
            ? this.uiAttribs.name
            : this.objName.split(".");
        }),
        (Vt.prototype.addOutPort = function (t) {
          return (
            (t.direction = c.PORT_DIR_OUT),
            (t.parent = this),
            this.portsOut.push(t),
            this.emitEvent("onPortAdd", t),
            t
          );
        }),
        (Vt.prototype.hasDynamicPort = function () {
          let t = 0;
          for (t = 0; t < this.portsIn.length; t++) {
            if (this.portsIn[t].type == l.OP_PORT_TYPE_DYNAMIC) return !0;
            if ("dyn" == this.portsIn[t].getName()) return !0;
          }
          for (t = 0; t < this.portsOut.length; t++) {
            if (this.portsOut[t].type == l.OP_PORT_TYPE_DYNAMIC) return !0;
            if ("dyn" == this.portsOut[t].getName()) return !0;
          }
          return !1;
        }),
        (Vt.prototype.addInPort = function (t) {
          if (!(t instanceof et)) throw new Error("parameter is not a port!");
          return (
            (t.direction = c.PORT_DIR_IN),
            (t.parent = this),
            this.portsIn.push(t),
            this.emitEvent("onPortAdd", t),
            t
          );
        }),
        (Vt.prototype.inFunction = Vt.prototype.inTrigger =
          function (t, e) {
            const i = this.addInPort(new et(this, t, l.OP_PORT_TYPE_FUNCTION));
            return void 0 !== e && i.set(e), i;
          }),
        (Vt.prototype.inFunctionButton = Vt.prototype.inTriggerButton =
          function (t, e) {
            const i = this.addInPort(
              new et(this, t, l.OP_PORT_TYPE_FUNCTION, { display: "button" })
            );
            return void 0 !== e && i.set(e), i;
          }),
        (Vt.prototype.inFunctionButton = Vt.prototype.inUiTriggerButtons =
          function (t, e) {
            const i = this.addInPort(
              new et(this, t, l.OP_PORT_TYPE_FUNCTION, { display: "buttons" })
            );
            return void 0 !== e && i.set(e), i;
          }),
        (Vt.prototype.inValueFloat =
          Vt.prototype.inValue =
          Vt.prototype.inFloat =
            function (t, e) {
              const i = this.addInPort(new et(this, t, l.OP_PORT_TYPE_VALUE));
              return void 0 !== e && (i.set(e), (i.defaultValue = e)), i;
            }),
        (Vt.prototype.inValueBool = Vt.prototype.inBool =
          function (t, e) {
            const i = this.addInPort(
              new et(this, t, l.OP_PORT_TYPE_VALUE, { display: "bool" })
            );
            return void 0 !== e && (i.set(e), (i.defaultValue = i.get())), i;
          }),
        (Vt.prototype.inValueString = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, { type: "string" })
          );
          return (
            (i.value = ""), void 0 !== e && (i.set(e), (i.defaultValue = e)), i
          );
        }),
        (Vt.prototype.inString = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_STRING, { type: "string" })
          );
          return (
            (e = e || ""), (i.value = e), i.set(e), (i.defaultValue = e), i
          );
        }),
        (Vt.prototype.inValueText = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, {
              type: "string",
              display: "text",
            })
          );
          return (
            (i.value = ""), void 0 !== e && (i.set(e), (i.defaultValue = e)), i
          );
        }),
        (Vt.prototype.inTextarea = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_STRING, {
              type: "string",
              display: "text",
            })
          );
          return (
            (i.value = ""), void 0 !== e && (i.set(e), (i.defaultValue = e)), i
          );
        }),
        (Vt.prototype.inStringEditor = function (t, e, i, s = !0) {
          const r = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_STRING, {
              type: "string",
              display: "editor",
              editorSyntax: i,
              hideFormatButton: s,
            })
          );
          return (
            (r.value = ""), void 0 !== e && (r.set(e), (r.defaultValue = e)), r
          );
        }),
        (Vt.prototype.inValueEditor = function (t, e, i, s = !0) {
          const r = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, {
              type: "string",
              display: "editor",
              editorSyntax: i,
              hideFormatButton: s,
            })
          );
          return (
            (r.value = ""), void 0 !== e && (r.set(e), (r.defaultValue = e)), r
          );
        }),
        (Vt.prototype.inValueSelect = Vt.prototype.inDropDown =
          function (t, e, i, s) {
            let r = null;
            if (s) {
              const i = new et(this, t, l.OP_PORT_TYPE_VALUE, {
                display: "dropdown",
                hidePort: !0,
                type: "string",
                values: e,
              });
              r = this.addInPort(i);
            } else {
              const s = new et(this, t + " index", l.OP_PORT_TYPE_VALUE, {
                  increment: "integer",
                  hideParam: !0,
                }),
                n = this.addInPort(s),
                o = new st(
                  this,
                  t,
                  l.OP_PORT_TYPE_VALUE,
                  {
                    display: "dropdown",
                    hidePort: !0,
                    type: "string",
                    values: e,
                  },
                  n
                );
              if (
                ((o.indexPort = s),
                (s.onLinkChanged = function () {
                  o.setUiAttribs({ greyout: s.isLinked() });
                }),
                (r = this.addInPort(o)),
                void 0 !== i)
              ) {
                r.set(i);
                const t = e.findIndex((t) => t == i);
                n.setValue(t), (r.defaultValue = i), (n.defaultValue = t);
              }
            }
            return r;
          }),
        (Vt.prototype.inSwitch = function (t, e, i, s) {
          let r = null;
          if (s) {
            const i = new et(this, t, l.OP_PORT_TYPE_STRING, {
              display: "switch",
              hidePort: !0,
              type: "string",
              values: e,
            });
            r = this.addInPort(i);
          } else {
            const s = new et(this, t + " index", l.OP_PORT_TYPE_VALUE, {
                increment: "integer",
                hideParam: !0,
              }),
              n = this.addInPort(s),
              o = new it(
                this,
                t,
                l.OP_PORT_TYPE_STRING,
                { display: "switch", hidePort: !0, type: "string", values: e },
                n
              );
            if (
              ((s.onLinkChanged = function () {
                o.setUiAttribs({ greyout: s.isLinked() });
              }),
              (r = this.addInPort(o)),
              void 0 !== i)
            ) {
              r.set(i);
              const t = e.findIndex((t) => t == i);
              n.setValue(t), (r.defaultValue = i), (n.defaultValue = t);
            }
          }
          return r;
        }),
        (Vt.prototype.inValueInt = Vt.prototype.inInt =
          function (t, e) {
            const i = this.addInPort(
              new et(this, t, l.OP_PORT_TYPE_VALUE, { increment: "integer" })
            );
            return void 0 !== e && (i.set(e), (i.defaultValue = e)), i;
          }),
        (Vt.prototype.inFile = function (t, e, i) {
          const s = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, {
              display: "file",
              type: "string",
              filter: e,
            })
          );
          return void 0 !== i && (s.set(i), (s.defaultValue = i)), s;
        }),
        (Vt.prototype.inUrl = function (t, e, i) {
          const s = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_STRING, {
              display: "file",
              type: "string",
              filter: e,
            })
          );
          return void 0 !== i && (s.set(i), (s.defaultValue = i)), s;
        }),
        (Vt.prototype.inTexture = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_OBJECT, {
              display: "texture",
              objType: "texture",
              preview: !0,
            })
          );
          return void 0 !== e && i.set(e), i;
        }),
        (Vt.prototype.inObject = function (t, e, i) {
          const s = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_OBJECT, { objType: i })
          );
          return void 0 !== e && s.set(e), s;
        }),
        (Vt.prototype.inGradient = function (t, e) {
          const i = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, {
              display: "gradient",
              hidePort: !0,
            })
          );
          return void 0 !== e && i.set(e), i;
        }),
        (Vt.prototype.inArray = function (t, e, i) {
          !i && CABLES.UTILS.isNumeric(e) && (i = e);
          const s = this.addInPort(
            new et(this, t, l.OP_PORT_TYPE_ARRAY, { stride: i })
          );
          return (
            void 0 === e || (!Array.isArray(e) && null != e) || s.set(e), s
          );
        }),
        (Vt.prototype.inValueSlider = Vt.prototype.inFloatSlider =
          function (t, e, i, s) {
            const r = { display: "range" };
            null != i && null != s && ((r.min = i), (r.max = s));
            const n = this.addInPort(new et(this, t, l.OP_PORT_TYPE_VALUE, r));
            return void 0 !== e && (n.set(e), (n.defaultValue = e)), n;
          }),
        (Vt.prototype.outFunction = Vt.prototype.outTrigger =
          function (t, e) {
            const i = this.addOutPort(new et(this, t, l.OP_PORT_TYPE_FUNCTION));
            return void 0 !== e && i.set(e), i;
          }),
        (Vt.prototype.outValue = Vt.prototype.outNumber =
          function (t, e) {
            const i = this.addOutPort(new et(this, t, l.OP_PORT_TYPE_VALUE));
            return void 0 !== e && i.set(e), i;
          }),
        (Vt.prototype.outValueBool = Vt.prototype.outBool =
          function (t, e) {
            const i = this.addOutPort(
              new et(this, t, l.OP_PORT_TYPE_VALUE, { display: "bool" })
            );
            return void 0 !== e ? i.set(e) : i.set(0), i;
          }),
        (Vt.prototype.outBoolNum = function (t, e) {
          const i = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, { display: "boolnum" })
          );
          return (
            (i.set = function (t) {
              this.setValue(t ? 1 : 0);
            }.bind(i)),
            void 0 !== e ? i.set(e) : i.set(0),
            i
          );
        }),
        (Vt.prototype.outValueString = function (t, e) {
          const i = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_VALUE, { type: "string" })
          );
          return void 0 !== e && i.set(e), i;
        }),
        (Vt.prototype.outString = function (t, e) {
          const i = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_STRING, { type: "string" })
          );
          return void 0 !== e ? i.set(e) : i.set(""), i;
        }),
        (Vt.prototype.outObject = function (t, e, i) {
          const s = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_OBJECT, { objType: i || null })
          );
          return s.set(e || null), (s.ignoreValueSerialize = !0), s;
        }),
        (Vt.prototype.outArray = function (t, e, i) {
          !i && CABLES.UTILS.isNumeric(e) && (i = e);
          const s = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_ARRAY, { stride: i })
          );
          return (
            void 0 === e || (!Array.isArray(e) && null != e) || s.set(e),
            (s.ignoreValueSerialize = !0),
            s
          );
        }),
        (Vt.prototype.outTexture = function (t, e) {
          const i = this.addOutPort(
            new et(this, t, l.OP_PORT_TYPE_OBJECT, {
              preview: !0,
              objType: "texture",
            })
          );
          return void 0 !== e && i.set(e), (i.ignoreValueSerialize = !0), i;
        }),
        (Vt.prototype.inDynamic = function (t, e, i, s) {
          const r = new et(this, t, l.OP_PORT_TYPE_DYNAMIC, i);
          return (
            (r.shouldLink = function (t, i) {
              if (e && g.isArray(e)) {
                for (let s = 0; s < e.length; s++) {
                  if (t == this && i.type === e[s]) return !0;
                  if (i == this && t.type === e[s]) return !0;
                }
                return !1;
              }
              return !0;
            }),
            this.addInPort(r),
            void 0 !== s && (r.set(s), (r.defaultValue = s)),
            r
          );
        }),
        (Vt.prototype.printInfo = function () {
          for (let t = 0; t < this.portsIn.length; t++)
            console.log("in: " + this.portsIn[t].getName());
          for (const t in this.portsOut)
            console.log("out: " + this.portsOut[t].getName());
        }),
        (Vt.prototype.selectChilds = function () {
          this.setUiAttrib({ selected: !0 });
          for (const t in this.portsOut)
            for (const e in this.portsOut[t].links)
              this.portsOut[t].parent.setUiAttrib({ selected: !0 }),
                this.portsOut[t].links[e].portIn.parent != this &&
                  this.portsOut[t].links[e].portIn.parent.selectChilds();
        }),
        (Vt.prototype.removeLinks = function () {
          for (let t = 0; t < this.portsIn.length; t++)
            this.portsIn[t].removeLinks();
          for (let t = 0; t < this.portsOut.length; t++)
            this.portsOut[t].removeLinks();
        }),
        (Vt.prototype.getSerialized = function () {
          const t = {};
          this.opId && (t.opId = this.opId),
            (t.objName = this.objName),
            (t.id = this.id),
            (t.uiAttribs = JSON.parse(JSON.stringify(this.uiAttribs))),
            this.storage &&
              Object.keys(this.storage).length > 0 &&
              (t.storage = this.storage),
            this.uiAttribs.hasOwnProperty("working") &&
              1 == this.uiAttribs.working &&
              delete this.uiAttribs.working,
            (t.portsIn = []),
            (t.portsOut = []);
          for (let e = 0; e < this.portsIn.length; e++)
            t.portsIn.push(this.portsIn[e].getSerialized());
          for (const e in this.portsOut)
            t.portsOut.push(this.portsOut[e].getSerialized());
          return t;
        }),
        (Vt.prototype.getFirstOutPortByType = function (t) {
          for (const e in this.portsOut)
            if (this.portsOut[e].type == t) return this.portsOut[e];
        }),
        (Vt.prototype.getFirstInPortByType = function (t) {
          for (const e in this.portsIn)
            if (this.portsIn[e].type == t) return this.portsIn[e];
        }),
        (Vt.prototype.getPort = Vt.prototype.getPortByName =
          function (t, e) {
            if (e) {
              for (let e = 0; e < this.portsIn.length; e++)
                if (this.portsIn[e].getName().toLowerCase() == t)
                  return this.portsIn[e];
              for (let e = 0; e < this.portsOut.length; e++)
                if (this.portsOut[e].getName().toLowerCase() == t)
                  return this.portsOut[e];
            } else {
              for (let e = 0; e < this.portsIn.length; e++)
                if (this.portsIn[e].getName() == t) return this.portsIn[e];
              for (let e = 0; e < this.portsOut.length; e++)
                if (this.portsOut[e].getName() == t) return this.portsOut[e];
            }
          }),
        (Vt.prototype.getPortById = function (t) {
          for (let e = 0; e < this.portsIn.length; e++)
            if (this.portsIn[e].id == t) return this.portsIn[e];
          for (let e = 0; e < this.portsOut.length; e++)
            if (this.portsOut[e].id == t) return this.portsOut[e];
        }),
        (Vt.prototype.updateAnims = function () {
          for (let t = 0; t < this.portsIn.length; t++)
            this.portsIn[t].updateAnim();
        }),
        (Vt.prototype.log = function () {
          const t = "op " + this.objName;
          if (CABLES.UI && !CABLES.UI.logFilter.shouldPrint(t, ...arguments))
            return;
          if (!CABLES.UI && this.patch.silent) return;
          const e = ["[op " + CABLES.getShortOpName(this.objName) + "]"];
          e.push.apply(e, arguments),
            Function.prototype.apply.apply(console.log, [console, e]);
        }),
        (Vt.prototype.error = Vt.prototype.logError =
          function () {
            if (!this) return void console.log("no this...!!!");
            const t = ["[op " + CABLES.getShortOpName(this.objName) + "]"];
            t.push.apply(t, arguments),
              Function.prototype.apply.apply(console.error, [console, t]),
              window.gui &&
                window.gui.emitEvent(
                  "opLogEvent",
                  this.objName,
                  "error",
                  arguments
                );
          }),
        (Vt.prototype.warn = Vt.prototype.logWarn =
          function () {
            const t = ["[op " + CABLES.getShortOpName(this.objName) + "]"];
            t.push.apply(t, arguments),
              Function.prototype.apply.apply(console.warn, [console, t]);
          }),
        (Vt.prototype.verbose = Vt.prototype.logVerbose =
          function () {
            const t = "op " + CABLES.getShortOpName(this.objName);
            if (CABLES.UI && !CABLES.UI.logFilter.shouldPrint(t, ...arguments))
              return;
            if (!CABLES.UI && this.patch.silent) return;
            const e = ["[" + t + "]"];
            e.push.apply(e, arguments),
              Function.prototype.apply.apply(console.info, [console, e]);
          }),
        (Vt.prototype.profile = function (t) {
          for (let t = 0; t < this.portsIn.length; t++)
            (this.portsIn[t]._onTriggered =
              this.portsIn[t]._onTriggeredProfiling),
              (this.portsIn[t].set = this.portsIn[t]._onSetProfiling);
        }),
        (Vt.prototype.findParent = function (t) {
          for (let e = 0; e < this.portsIn.length; e++)
            if (this.portsIn[e].isLinked()) {
              if (this.portsIn[e].links[0].portOut.parent.objName == t)
                return this.portsIn[e].links[0].portOut.parent;
              let i = null;
              if (
                ((i = this.portsIn[e].links[0].portOut.parent.findParent(t)), i)
              )
                return i;
            }
          return null;
        }),
        (Vt.prototype.cleanUp = function () {
          if (this._instances) {
            for (let t = 0; t < this._instances.length; t++)
              this._instances[t].onDelete && this._instances[t].onDelete();
            this._instances.length = 0;
          }
        }),
        (Vt.prototype.instanced = function (t) {
          if (
            (console.log("instanced", this.patch.instancing.numCycles()),
            0 === this.patch.instancing.numCycles())
          )
            return !1;
          let e = 0,
            i = 0;
          if (
            !this._instances ||
            this._instances.length != this.patch.instancing.numCycles()
          ) {
            for (
              this._instances || (this._instances = []),
                this._.log(
                  "creating instances of ",
                  this.objName,
                  this.patch.instancing.numCycles(),
                  this._instances.length
                ),
                this._instances.length = this.patch.instancing.numCycles(),
                e = 0;
              e < this._instances.length;
              e++
            ) {
              (this._instances[e] = this.patch.createOp(this.objName, !0)),
                (this._instances[e].instanced = function () {
                  return !1;
                }),
                this._instances[e].uiAttr(this.uiAttribs);
              for (let t = 0; t < this.portsOut.length; t++)
                this.portsOut[t].type == l.OP_PORT_TYPE_FUNCTION &&
                  (this._instances[e].getPortByName(
                    this.portsOut[t].name
                  ).trigger = this.portsOut[t].trigger.bind(this.portsOut[t]));
            }
            for (i = 0; i < this.portsIn.length; i++)
              (this.portsIn[i].onChange = null),
                (this.portsIn[i].onValueChanged = null);
          }
          for (i = 0; i < this.portsIn.length; i++)
            (this.portsIn[i].type != l.OP_PORT_TYPE_VALUE &&
              this.portsIn[i].type != l.OP_PORT_TYPE_ARRAY) ||
              this._instances[this.patch.instancing.index()].portsIn[i].set(
                this.portsIn[i].get()
              ),
              this.portsIn[i].type,
              l.OP_PORT_TYPE_FUNCTION;
          for (i = 0; i < this.portsOut.length; i++)
            this.portsOut[i].type == l.OP_PORT_TYPE_VALUE &&
              this.portsOut[i].set(
                this._instances[this.patch.instancing.index()].portsOut[i].get()
              );
          return !0;
        }),
        (Vt.prototype.initInstancable = function () {}),
        (Vt.prototype.setValues = function (t) {
          for (const e in t) {
            const i = this.getPortByName(e);
            i
              ? i.set(t[e])
              : this._log.warn("op.setValues: port not found:", e);
          }
        }),
        (Vt.prototype.hasUiError = function (t) {
          return this._uiErrors.hasOwnProperty(t) && this._uiErrors[t];
        }),
        (Vt.prototype.setUiError = function (t, e, i) {
          if (!e && !this.hasUiErrors) return;
          if (!e && !this._uiErrors.hasOwnProperty(t)) return;
          if (this._uiErrors.hasOwnProperty(t) && this._uiErrors[t].txt == e)
            return;
          t.indexOf(" ") > -1 &&
            this._log.warn("setuierror id cant have spaces! ", t),
            !e && this._uiErrors.hasOwnProperty(t)
              ? delete this._uiErrors[t]
              : !e ||
                (this._uiErrors.hasOwnProperty(t) &&
                  this._uiErrors[t].txt == e) ||
                (null == i && (i = 2),
                (this._uiErrors[t] = { txt: e, level: i, id: t }));
          const s = [];
          for (const t in this._uiErrors) s.push(this._uiErrors[t]);
          this.uiAttr({ uierrors: s }),
            (this.hasUiErrors = Object.keys(this._uiErrors).length),
            this.emitEvent("uiErrorChange");
        }),
        (Vt.prototype.setError = function (t, e) {
          this._log.warn("old error message op.error() - use op.setUiError()");
        }),
        (Vt.prototype.setEnabled = function (t) {
          (this.enabled = t), this.emitEvent("onEnabledChange", t);
        }),
        (Vt.prototype.setPortGroup = function (t, e) {
          for (let i = 0; i < e.length; i++)
            e[i] &&
              (e[i].setUiAttribs
                ? e[i].setUiAttribs({ group: t })
                : this._log.error("setPortGroup: invalid port!"));
        }),
        (Vt.prototype.setUiAxisPorts = function (t, e, i) {
          t && t.setUiAttribs({ axis: "X" }),
            e && e.setUiAttribs({ axis: "Y" }),
            i && i.setUiAttribs({ axis: "Z" });
        }),
        (Vt.prototype.removePort = function (t) {
          for (let e = 0; e < this.portsIn.length; e++)
            if (this.portsIn[e] == t)
              return (
                this.portsIn.splice(e, 1),
                this.emitEvent("onUiAttribsChange", {}),
                void this.emitEvent("onPortRemoved", {})
              );
        }),
        (Vt.prototype._checkLinksNeededToWork = function () {}),
        (Vt.prototype.toWorkNeedsParent = function (t) {
          this.patch.isEditorMode() && (this._needsParentOp = t);
        }),
        (Vt.prototype.toWorkPortsNeedToBeLinked = function () {
          if (this.patch.isEditorMode())
            for (let t = 0; t < arguments.length; t++)
              -1 == this._needsLinkedToWork.indexOf(arguments[t]) &&
                this._needsLinkedToWork.push(arguments[t]);
        }),
        (Vt.prototype.toWorkPortsNeedToBeLinkedReset = function () {
          this.patch.isEditorMode() &&
            ((this._needsLinkedToWork.length = 0),
            this.checkLinkTimeWarnings && this.checkLinkTimeWarnings());
        }),
        (Vt.prototype.initVarPorts = function () {
          for (let t = 0; t < this.portsIn.length; t++)
            this.portsIn[t].getVariableName() &&
              this.portsIn[t].setVariable(this.portsIn[t].getVariableName());
        }),
        (Vt.prototype.refreshParams = function () {
          this.patch &&
            this.patch.isEditorMode() &&
            this.isCurrentUiOp() &&
            gui.opParams.show(this);
        }),
        (Vt.prototype.isCurrentUiOp = function () {
          if (this.patch.isEditorMode()) return gui.patchView.isCurrentOp(this);
        }),
        (Vt.prototype.renderVizLayer = null);
    }
    Vt.isSubpatchOp = function (t) {
      return "Ops.Ui.Patch" == t || "Ops.Ui.SubPatch" == t;
    };
    const Dt = function (t) {
      CABLES.EventTarget.apply(this),
        (this._log = new a("LoadingStatus")),
        (this._loadingAssets = {}),
        (this._cbFinished = []),
        (this._assetTasks = []),
        (this._percent = 0),
        (this._count = 0),
        (this._countFinished = 0),
        (this._order = 0),
        (this._startTime = 0),
        (this._patch = t),
        (this._wasFinishedPrinted = !1),
        (this._loadingAssetTaskCb = !1);
    };
    (Dt.prototype.setOnFinishedLoading = function (t) {
      this._cbFinished.push(t);
    }),
      (Dt.prototype.getNumAssets = function () {
        return this._countFinished;
      }),
      (Dt.prototype.getProgress = function () {
        return this._percent;
      }),
      (Dt.prototype.checkStatus = function () {
        (this._countFinished = 0), (this._count = 0);
        for (const t in this._loadingAssets)
          this._count++,
            this._loadingAssets[t].finished || this._countFinished++;
        if (
          ((this._percent = (this._count - this._countFinished) / this._count),
          0 === this._countFinished)
        ) {
          for (let t = 0; t < this._cbFinished.length; t++)
            if (this._cbFinished[t]) {
              const e = this._cbFinished[t];
              setTimeout(() => {
                e(this._patch), this.emitEvent("finishedAll");
              }, 100);
            }
          this._wasFinishedPrinted ||
            ((this._wasFinishedPrinted = !0), this.print()),
            this.emitEvent("finishedAll");
        }
      }),
      (Dt.prototype.getList = function () {
        let t = [];
        for (const e in this._loadingAssets) t.push(this._loadingAssets[e]);
        return t;
      }),
      (Dt.prototype.getListJobs = function () {
        let t = [];
        for (const e in this._loadingAssets)
          this._loadingAssets[e].finished ||
            t.push(this._loadingAssets[e].name);
        return t;
      }),
      (Dt.prototype.print = function () {
        if (this._patch.config.silent) return;
        const t = [];
        for (const e in this._loadingAssets)
          t.push([
            this._loadingAssets[e].order,
            this._loadingAssets[e].type,
            this._loadingAssets[e].name,
            (this._loadingAssets[e].timeEnd -
              this._loadingAssets[e].timeStart) /
              1e3 +
              "s",
          ]);
        this._log.groupCollapsed(
          "finished loading " +
            this._order +
            " assets in " +
            (Date.now() - this._startTime) / 1e3 +
            "s"
        ),
          this._log.table(t),
          this._log.groupEnd();
      }),
      (Dt.prototype.finished = function (t) {
        this._loadingAssets[t] &&
          ((this._loadingAssets[t].finished = !0),
          (this._loadingAssets[t].timeEnd = Date.now())),
          this.checkStatus(),
          this.emitEvent("finishedTask");
      }),
      (Dt.prototype._startAssetTasks = function () {
        for (let t = 0; t < this._assetTasks.length; t++) this._assetTasks[t]();
        this._assetTasks.length = 0;
      }),
      (Dt.prototype.addAssetLoadingTask = function (t) {
        this._patch.isEditorMode() && !CABLES.UI.loaded
          ? (this._assetTasks.push(t),
            this._loadingAssetTaskCb ||
              window.gui.addEventListener(
                "uiloaded",
                this._startAssetTasks.bind(this)
              ),
            (this._loadingAssetTaskCb = !0))
          : t(),
          this.emitEvent("addAssetTask");
      }),
      (Dt.prototype.existByName = function (t) {
        for (let e in this._loadingAssets)
          if (
            this._loadingAssets[e].name == t &&
            !this._loadingAssets[e].finished
          )
            return !0;
      }),
      (Dt.prototype.start = function (t, e) {
        0 == this._startTime && (this._startTime = Date.now());
        const i = A();
        return (
          (this._loadingAssets[i] = {
            id: i,
            type: t,
            name: e,
            finished: !1,
            timeStart: Date.now(),
            order: this._order,
          }),
          this._order++,
          this.emitEvent("startTask"),
          i
        );
      });
    const Gt = function () {
      (this._loops = []), (this._indizes = []), (this._index = 0);
    };
    (Gt.prototype.pushLoop = function (t) {
      this._loops.push(Math.abs(Math.floor(t))),
        this._indizes.push(this._index);
    }),
      (Gt.prototype.popLoop = function () {
        this._loops.pop(),
          (this._index = this._indizes.pop()),
          0 === this._loops.length && (this._index = 0);
      }),
      (Gt.prototype.numLoops = function () {
        return this._loops.length;
      }),
      (Gt.prototype.numCycles = function () {
        if (0 === this._loops.length) return 0;
        let t = this._loops[0];
        for (let e = 1; e < this._loops.length; e++) t *= this._loops[e];
        return t;
      }),
      (Gt.prototype.inLoop = function () {
        return this._loops.length > 0;
      }),
      (Gt.prototype.increment = function () {
        this._index++;
      }),
      (Gt.prototype.index = function () {
        return this._index;
      });
    const Ht = function (t) {
      this.startFrame = t.getFrameNum();
      let e = {},
        i = null,
        s = 0;
      (this.getItems = function () {
        return e;
      }),
        (this.clear = function () {
          e = {};
        }),
        (this.add = function (r, n) {
          null !== i &&
            ((n && n.id == i) ||
              (e[i] &&
                ((e[i].timeUsed += performance.now() - s),
                (!e[i].peakTime || dt() - e[i].peakTime > 5e3) &&
                  ((e[i].peak = 0), (e[i].peakTime = dt())),
                (e[i].peak = Math.max(e[i].peak, performance.now() - s))))),
            null !== n
              ? (e[n.id] || (e[n.id] = { numTriggers: 0, timeUsed: 0 }),
                e[n.id].lastFrame != t.getFrameNum() &&
                  (e[n.id].numTriggers = 0),
                (e[n.id].lastFrame = t.getFrameNum()),
                e[n.id].numTriggers++,
                (e[n.id].opid = n.parent.id),
                (e[n.id].title = n.parent.name + "." + n.name),
                (e[n.id].subPatch = n.parent.uiAttribs.subPatch),
                (i = n.id),
                (s = performance.now()))
              : (i = null);
        }),
        (this.print = function () {
          console.log("--------");
          for (const t in e)
            console.log(
              e[t].title + ": " + e[t].numTriggers + " / " + e[t].timeUsed
            );
        });
    };
    var zt = class extends Y {
      constructor(t, e, i) {
        super(), (this._name = t), (this.type = i), this.setValue(e);
      }
      addListener(t) {
        this.on("change", t, "var");
      }
      getValue() {
        return this._v;
      }
      getName() {
        return this._name;
      }
      setValue(t) {
        (this._v = t), this.emitEvent("change", t, this);
      }
    };
    const Wt = function (t) {
      Y.apply(this),
        (this._log = new a("core_patch")),
        (this.ops = []),
        (this.settings = {}),
        (this.config = t || {
          glCanvasResizeToWindow: !1,
          prefixAssetPath: "",
          prefixJsPath: "",
          silent: !0,
          onError: null,
          onFinishedLoading: null,
          onFirstFrameRendered: null,
          onPatchLoaded: null,
          fpsLimit: 0,
        }),
        (this.timer = new ft()),
        (this.freeTimer = new ft()),
        (this.animFrameOps = []),
        (this.animFrameCallbacks = []),
        (this.gui = !1),
        (CABLES.logSilent = this.silent = !0),
        (this.profiler = null),
        (this.aborted = !1),
        (this._crashedOps = []),
        (this._renderOneFrame = !1),
        (this._animReq = null),
        (this._opIdCache = {}),
        (this._triggerStack = []),
        (this.loading = new Dt(this)),
        (this._volumeListeners = []),
        (this._paused = !1),
        (this._frameNum = 0),
        (this.instancing = new Gt()),
        (this.onOneFrameRendered = null),
        (this.namedTriggers = {}),
        (this._origData = null),
        (this._frameNext = 0),
        (this._frameInterval = 0),
        (this._lastFrameTime = 0),
        (this._frameWasdelayed = !0),
        (function () {
          return !this;
        })() || this._log.warn("not in strict mode: core patch"),
        (this._isLocal = 0 === document.location.href.indexOf("file:")),
        this.config.hasOwnProperty("silent") &&
          (this.silent = CABLES.logSilent = this.config.silent),
        this.config.hasOwnProperty("doRequestAnimation") ||
          (this.config.doRequestAnimation = !0),
        this.config.prefixAssetPath || (this.config.prefixAssetPath = ""),
        this.config.prefixJsPath || (this.config.prefixJsPath = ""),
        this.config.masterVolume || (this.config.masterVolume = 1),
        (this._variables = {}),
        (this._variableListeners = []),
        (this.vars = {}),
        t && t.vars && (this.vars = t.vars),
        (this.cgl = new Bt(this)),
        (this.cgp = null),
        this.cgl.setCanvas(
          this.config.glCanvasId || this.config.glCanvas || "glcanvas"
        ),
        !0 === this.config.glCanvasResizeToWindow &&
          this.cgl.setAutoResize("window"),
        !0 === this.config.glCanvasResizeToParent &&
          this.cgl.setAutoResize("parent"),
        this.loading.setOnFinishedLoading(this.config.onFinishedLoading),
        this.cgl.aborted && (this.aborted = !0),
        this.cgl.silent && (this.silent = !0),
        this.freeTimer.play(),
        this.exec(),
        this.aborted ||
          (this.config.patch
            ? this.deSerialize(this.config.patch)
            : this.config.patchFile &&
              w(this.config.patchFile, (t, e) => {
                const i = JSON.parse(e);
                if (t) {
                  return (
                    this._log.error("err", t),
                    this._log.error("data", i),
                    void this._log.error("data", i.msg)
                  );
                }
                this.deSerialize(i);
              }),
          this.timer.play()),
        console.log("made with https://cables.gl");
    };
    (Wt.prototype.isPlaying = function () {
      return !this._paused;
    }),
      (Wt.prototype.isRenderingOneFrame = function () {
        return this._renderOneFrame;
      }),
      (Wt.prototype.renderOneFrame = function () {
        (this._paused = !0),
          (this._renderOneFrame = !0),
          this.exec(),
          (this._renderOneFrame = !1);
      }),
      (Wt.prototype.getFPS = function () {
        return console.log("deprecated getfps"), 0;
      }),
      (Wt.prototype.isEditorMode = function () {
        return !0 === this.config.editorMode;
      }),
      (Wt.prototype.pause = function () {
        cancelAnimationFrame(this._animReq),
          this.emitEvent("pause"),
          (this._animReq = null),
          (this._paused = !0),
          this.freeTimer.pause();
      }),
      (Wt.prototype.resume = function () {
        this._paused &&
          (cancelAnimationFrame(this._animReq),
          (this._paused = !1),
          this.freeTimer.play(),
          this.emitEvent("resume"),
          this.exec());
      }),
      (Wt.prototype.setVolume = function (t) {
        this.config.masterVolume = t;
        for (let e = 0; e < this._volumeListeners.length; e++)
          this._volumeListeners[e].onMasterVolumeChanged(t);
      }),
      (Wt.prototype.getAssetPath = function (t = null) {
        if (this.isEditorMode()) {
          return "/assets/" + (t || gui.project()._id) + "/";
        }
        if (
          document.location.href.indexOf("cables.gl") > 0 ||
          document.location.href.indexOf("cables.local") > 0
        ) {
          const e = document.location.pathname.split("/");
          return "/assets/" + (t || e[e.length - 1]) + "/";
        }
        return this.config.hasOwnProperty("assetPath")
          ? this.config.assetPath
          : "assets/";
      }),
      (Wt.prototype.getJsPath = function () {
        return this.config.hasOwnProperty("jsPath")
          ? this.config.jsPath
          : "js/";
      }),
      (Wt.prototype.getFilePath = function (t) {
        return (
          this._isLocal &&
            !this.config.allowLocalFileAccess &&
            this.exitError(
              "localAccess",
              "Browser security forbids loading files directly without a webserver. Upload files to a server to work. use allowLocalFileAccess:true to ignore this."
            ),
          t
            ? 0 === (t = String(t)).indexOf("https:") ||
              0 === t.indexOf("http:") ||
              0 === t.indexOf("data:")
              ? t
              : ((t = t.replace("//", "/")),
                this.config.prefixAssetPath +
                  t +
                  (this.config.suffixAssetPath || ""))
            : t
        );
      }),
      (Wt.prototype.clear = function () {
        for (
          this.emitEvent("patchClearStart"),
            this.cgl.TextureEffectMesh = null,
            this.animFrameOps.length = 0,
            this.timer = new ft();
          this.ops.length > 0;

        )
          this.deleteOp(this.ops[0].id);
        this.emitEvent("patchClearEnd");
      }),
      (Wt.getOpClass = function (t) {
        const e = t.split(".");
        let i = null;
        try {
          return (
            2 == e.length
              ? (i = window[e[0]][e[1]])
              : 3 == e.length
              ? (i = window[e[0]][e[1]][e[2]])
              : 4 == e.length
              ? (i = window[e[0]][e[1]][e[2]][e[3]])
              : 5 == e.length
              ? (i = window[e[0]][e[1]][e[2]][e[3]][e[4]])
              : 6 == e.length
              ? (i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]])
              : 7 == e.length
              ? (i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]])
              : 8 == e.length
              ? (i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]])
              : 9 == e.length
              ? (i =
                  window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]][e[8]])
              : 10 == e.length &&
                (i =
                  window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]][e[8]][
                    e[9]
                  ]),
            i
          );
        } catch (t) {
          return null;
        }
      }),
      (Wt.prototype.createOp = function (t, e, i = null) {
        let s = null,
          r = "";
        try {
          if (-1 === t.indexOf("Ops.")) {
            const n = t;
            if (CABLES.OPS[n])
              (r = CABLES.OPS[n].objName),
                (s = new CABLES.OPS[n].f(this, r, e, n)),
                (s.opId = n);
            else {
              if (!i) throw new Error("could not find op by id: " + n);
              (t = i), this._log.warn("could not find op by id: " + n);
            }
          }
          if (!s) {
            r = t;
            const i = t.split(".");
            if (!Wt.getOpClass(r))
              throw (
                (this.emitEvent("criticalError", {
                  title: "unknown op",
                  text: "unknown op: " + r,
                }),
                this._log.error("unknown op: " + r),
                new Error("unknown op: " + r))
              );
            if (
              (2 == i.length
                ? (s = new window[i[0]][i[1]](this, r, e))
                : 3 == i.length
                ? (s = new window[i[0]][i[1]][i[2]](this, r, e))
                : 4 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]](this, r, e))
                : 5 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]](this, r, e))
                : 6 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]](
                    this,
                    r,
                    e
                  ))
                : 7 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]](
                    this,
                    r,
                    e
                  ))
                : 8 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][
                    i[7]
                  ](this, r, e))
                : 9 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][
                    i[7]
                  ][i[8]](this, r, e))
                : 10 == i.length
                ? (s = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][
                    i[7]
                  ][i[8]][i[9]](this, r, e))
                : this._log.warn("parts.length", i.length),
              s)
            ) {
              s.opId = null;
              for (const t in CABLES.OPS)
                CABLES.OPS[t].objName == r && (s.opId = t);
            }
          }
        } catch (t) {
          if (
            (this._crashedOps.push(r),
            this.emitEvent("exceptionOp", t, r, s),
            !this.isEditorMode())
          )
            throw (
              (this._log.error(t),
              this._log.error("[instancing error] " + r, t),
              CABLES.api && CABLES.api.sendErrorReport(t),
              this.exitError("INSTANCE_ERR", "Instancing Error " + r, t),
              new Error("instancing error " + r))
            );
        }
        return (
          s
            ? ((s.objName = r), (s.patch = this))
            : this._log.log("no op was created!?", t, e),
          s
        );
      }),
      (Wt.prototype.addOp = function (t, e, i, s, r) {
        const n = this.createOp(t, i, r);
        if (n) {
          if (
            ((e = e || {}).hasOwnProperty("errors") && delete e.errors,
            e.hasOwnProperty("error") && delete e.error,
            (e.subPatch = e.subPatch || 0),
            n.uiAttr(e),
            n.onCreate && n.onCreate(),
            n.hasOwnProperty("onAnimFrame") && this.addOnAnimFrame(n),
            n.hasOwnProperty("onMasterVolumeChanged") &&
              this._volumeListeners.push(n),
            this._opIdCache[n.id])
          )
            return void this._log.warn(
              "opid with id " + n.id + " already exists in patch!"
            );
          this.ops.push(n),
            (this._opIdCache[n.id] = n),
            this.emitEvent("onOpAdd", n, s),
            n.init && n.init();
        } else this._log.error("addop: no op.....");
        return n;
      }),
      (Wt.prototype.addOnAnimFrame = function (t) {
        for (let e = 0; e < this.animFrameOps.length; e++)
          if (this.animFrameOps[e] == t) return;
        this.animFrameOps.push(t);
      }),
      (Wt.prototype.removeOnAnimFrame = function (t) {
        for (let e = 0; e < this.animFrameOps.length; e++)
          if (this.animFrameOps[e] == t)
            return void this.animFrameOps.splice(e, 1);
      }),
      (Wt.prototype.addOnAnimFrameCallback = function (t) {
        this.animFrameCallbacks.push(t);
      }),
      (Wt.prototype.removeOnAnimCallback = function (t) {
        for (let e = 0; e < this.animFrameCallbacks.length; e++)
          if (this.animFrameCallbacks[e] == t)
            return void this.animFrameCallbacks.splice(e, 1);
      }),
      (Wt.prototype.deleteOp = function (t, e, i) {
        let s = !1;
        for (const r in this.ops)
          if (this.ops[r].id == t) {
            const n = this.ops[r];
            let o = null,
              a = null;
            if (n) {
              (s = !0),
                e &&
                  n.portsIn.length > 0 &&
                  n.portsIn[0].isLinked() &&
                  n.portsOut.length > 0 &&
                  n.portsOut[0].isLinked() &&
                  n.portsIn[0].getType() == n.portsOut[0].getType() &&
                  n.portsIn[0].links[0] &&
                  ((o = n.portsIn[0].links[0].getOtherPort(n.portsIn[0])),
                  (a = n.portsOut[0].links[0].getOtherPort(n.portsOut[0])));
              const h = this.ops[r];
              h.removeLinks(),
                h.emitEvent("onDelete", this.ops[r]),
                this.onDelete &&
                  (this._log.warn("deprecated this.onDelete", this.onDelete),
                  this.onDelete(h)),
                this.ops.splice(r, 1),
                this.emitEvent("onOpDelete", h, i),
                h.onDelete && h.onDelete(i),
                h.cleanUp(),
                null !== o &&
                  null !== a &&
                  this.link(o.parent, o.getName(), a.parent, a.getName()),
                delete this._opIdCache[t];
              break;
            }
          }
        s || this._log.warn("core patch deleteop: not found...");
      }),
      (Wt.prototype.getFrameNum = function () {
        return this._frameNum;
      }),
      (Wt.prototype.emitOnAnimFrameEvent = function (t) {
        t = t || this.timer.getTime();
        for (let e = 0; e < this.animFrameCallbacks.length; ++e)
          this.animFrameCallbacks[e] &&
            this.animFrameCallbacks[e](t, this._frameNum);
        for (let e = 0; e < this.animFrameOps.length; ++e)
          this.animFrameOps[e].onAnimFrame &&
            this.animFrameOps[e].onAnimFrame(t);
      }),
      (Wt.prototype.renderFrame = function (t) {
        this.timer.update(), this.freeTimer.update();
        const e = this.timer.getTime(),
          i = performance.now();
        this.emitOnAnimFrameEvent(e),
          (this.cgl.profileData.profileOnAnimFrameOps = performance.now() - i),
          this.emitEvent("onRenderFrame", e),
          this._frameNum++,
          1 == this._frameNum &&
            this.config.onFirstFrameRendered &&
            this.config.onFirstFrameRendered();
      }),
      (Wt.prototype.exec = function (t) {
        if (!this._renderOneFrame && (this._paused || this.aborted)) return;
        (this.config.fpsLimit = this.config.fpsLimit || 0),
          this.config.fpsLimit &&
            (this._frameInterval = 1e3 / this.config.fpsLimit);
        const e = CABLES.now(),
          i = e - this._frameNext;
        if (
          this.isEditorMode() &&
          !this._renderOneFrame &&
          e - this._lastFrameTime >= 500 &&
          0 !== this._lastFrameTime &&
          !this._frameWasdelayed
        )
          return (
            (this._lastFrameTime = 0),
            setTimeout(this.exec.bind(this), 500),
            this.emitEvent("renderDelayStart"),
            void (this._frameWasdelayed = !0)
          );
        if (
          this._renderOneFrame ||
          0 === this.config.fpsLimit ||
          i > this._frameInterval ||
          this._frameWasdelayed
        ) {
          CABLES.now();
          this.renderFrame(),
            this._frameInterval &&
              (this._frameNext = e - (i % this._frameInterval));
        }
        this._frameWasdelayed &&
          (this.emitEvent("renderDelayEnd"), (this._frameWasdelayed = !1)),
          this._renderOneFrame &&
            (this.onOneFrameRendered && this.onOneFrameRendered(),
            this.emitEvent("renderedOneFrame"),
            (this._renderOneFrame = !1)),
          this.config.doRequestAnimation &&
            (this._animReq = requestAnimationFrame(this.exec.bind(this)));
      }),
      (Wt.prototype.link = function (t, e, i, s, r, n) {
        if (!t) return void this._log.warn("link: op1 is null ");
        if (!i) return void this._log.warn("link: op2 is null");
        const o = t.getPort(e, r),
          a = i.getPort(s, r);
        if (o)
          if (a) {
            if (!o.shouldLink(o, a) || !a.shouldLink(o, a)) return !1;
            if (kt.canLink(o, a)) {
              const t = new kt(this);
              return t.link(o, a), this.emitEvent("onLink", o, a, t, n), t;
            }
          } else
            this._log.warn(
              "port not found! " + s + " of " + i.name + "(" + i.objName + ")"
            );
        else this._log.warn("port not found! " + e + "(" + t.objName + ")");
      }),
      (Wt.prototype.serialize = function (t) {
        const e = {};
        (t = t || {}), (e.ops = []), (e.settings = this.settings);
        for (const t in this.ops) {
          const i = this.ops[t];
          e.ops.push(i.getSerialized());
        }
        return t.asObject ? e : JSON.stringify(e);
      }),
      (Wt.prototype.getOpById = function (t) {
        return this._opIdCache[t];
      }),
      (Wt.prototype.getOpsByName = function (t) {
        const e = [];
        for (const i in this.ops) this.ops[i].name == t && e.push(this.ops[i]);
        return e;
      }),
      (Wt.prototype.getOpsByObjName = function (t) {
        const e = [];
        for (const i in this.ops)
          this.ops[i].objName == t && e.push(this.ops[i]);
        return e;
      }),
      (Wt.prototype.loadLib = function (t) {
        C(
          "/ui/libs/" + t + ".js",
          (t, e) => {
            const i = document.createElement("script");
            (i.type = "text/javascript"),
              (i.text = e),
              document.getElementsByTagName("head")[0].appendChild(i);
          },
          "GET"
        );
      }),
      (Wt.prototype.reloadOp = function (t, e) {
        let i = 0;
        const s = [],
          r = [];
        for (const e in this.ops)
          this.ops[e].objName == t && r.push(this.ops[e]);
        for (let e = 0; e < r.length; e++) {
          i++;
          const n = r[e];
          n.deleted = !0;
          const o = this,
            a = this.addOp(t, n.uiAttribs);
          if (!a) continue;
          let h, l;
          for (h in (n && n.storage && (a.storage = n.storage),
          s.push(a),
          n.portsIn))
            if (0 === n.portsIn[h].links.length) {
              const t = a.getPort(n.portsIn[h].name);
              t
                ? (t.set(n.portsIn[h].get()),
                  n.portsIn[h].getVariableName() &&
                    t.setVariable(n.portsIn[h].getVariableName()))
                : this._log.error(
                    "[reloadOp] could not set port " +
                      n.portsIn[h].name +
                      ", propably renamed port ?"
                  );
            } else
              for (; n.portsIn[h].links.length; ) {
                const t = n.portsIn[h].links[0].portIn.name,
                  e = n.portsIn[h].links[0].portOut.name,
                  i = n.portsIn[h].links[0].portOut.parent;
                n.portsIn[h].links[0].remove(),
                  (l = o.link(a, t, i, e)),
                  l
                    ? l.setValue()
                    : this._log.warn(
                        "[reloadOp] relink after op reload not successfull for port " +
                          e
                      );
              }
          for (h in n.portsOut)
            for (; n.portsOut[h].links.length; ) {
              const t = n.portsOut[h].links[0].portOut.name,
                e = n.portsOut[h].links[0].portIn.name,
                i = n.portsOut[h].links[0].portIn.parent;
              n.portsOut[h].links[0].remove(),
                (l = o.link(a, t, i, e)),
                l
                  ? l.setValue()
                  : this._log.warn(
                      "relink after op reload not successfull for port " + e
                    );
            }
          this.deleteOp(n.id, !1, !0);
        }
        e(i, s);
      }),
      (Wt.prototype.getSubPatchOps = function (t) {
        const e = [];
        for (const i in this.ops)
          this.ops[i].uiAttribs &&
            this.ops[i].uiAttribs.subPatch == t &&
            e.push(this.ops[i]);
        return e;
      }),
      (Wt.prototype.getSubPatchOp = function (t, e) {
        for (const i in this.ops)
          if (
            this.ops[i].uiAttribs &&
            this.ops[i].uiAttribs.subPatch == t &&
            this.ops[i].objName == e
          )
            return this.ops[i];
        return !1;
      }),
      (Wt.prototype._addLink = function (t, e, i, s) {
        this.link(this.getOpById(t), i, this.getOpById(e), s, !1, !0);
      }),
      (Wt.prototype.deSerialize = function (t, e) {
        if (this.aborted) return;
        const i = [],
          s = this.loading.start("core", "deserialize");
        (this.namespace = t.namespace || ""),
          (this.name = t.name || ""),
          "string" == typeof t && (t = JSON.parse(t)),
          (this.settings = t.settings),
          this.emitEvent("patchLoadStart");
        for (const s in t.ops) {
          const r = CABLES.now(),
            n = t.ops[s];
          let o = null;
          try {
            o = n.opId
              ? this.addOp(n.opId, n.uiAttribs, n.id, !0, n.objName)
              : this.addOp(n.objName, n.uiAttribs, n.id, !0);
          } catch (t) {
            throw (
              (this._log.warn("[instancing error] op data:", n, t),
              new Error("instancing error: " + n.objName))
            );
          }
          if (o) {
            e && (o.id = T()),
              (o.portsInData = n.portsIn),
              (o._origData = n),
              (o.storage = n.storage);
            for (const t in n.portsIn) {
              const e = n.portsIn[t],
                i = o.getPort(e.name);
              !i ||
                ("bool" != i.uiAttribs.display && "bool" != i.uiAttribs.type) ||
                isNaN(e.value) ||
                (e.value = !0 === e.value),
                i &&
                  void 0 !== e.value &&
                  i.type != l.OP_PORT_TYPE_TEXTURE &&
                  i.set(e.value),
                i && i.deSerializeSettings(e);
            }
            for (const e in n.portsOut) {
              const i = o.getPort(n.portsOut[e].name);
              i &&
                i.type != l.OP_PORT_TYPE_TEXTURE &&
                n.portsOut[e].hasOwnProperty("value") &&
                i.set(t.ops[s].portsOut[e].value);
            }
            i.push(o);
          }
          const a = Math.round(100 * (CABLES.now() - r)) / 100;
          !this.silent &&
            a > 200 &&
            this._log.warn("long op init ", t.ops[s].objName, a);
        }
        for (const t in this.ops)
          this.ops[t].onLoadedValueSet &&
            (this.ops[t].onLoadedValueSet(this.ops[t]._origData),
            (this.ops[t].onLoadedValueSet = null),
            (this.ops[t]._origData = null)),
            this.ops[t].emitEvent("loadedValueSet");
        if (t.ops)
          for (let e = 0; e < t.ops.length; e++) {
            if (t.ops[e].portsIn)
              for (let i = 0; i < t.ops[e].portsIn.length; i++)
                if (t.ops[e].portsIn[i].links)
                  for (let s = 0; s < t.ops[e].portsIn[i].links.length; s++) {
                    t.ops[e].portsIn[i].links[s] &&
                      this._addLink(
                        t.ops[e].portsIn[i].links[s].objIn,
                        t.ops[e].portsIn[i].links[s].objOut,
                        t.ops[e].portsIn[i].links[s].portIn,
                        t.ops[e].portsIn[i].links[s].portOut
                      );
                  }
            if (t.ops[e].portsOut)
              for (let i = 0; i < t.ops[e].portsOut.length; i++)
                if (t.ops[e].portsOut[i].links)
                  for (let s = 0; s < t.ops[e].portsOut[i].links.length; s++) {
                    let r = !1;
                    t.ops[e].portsOut[i].links[s] &&
                      ((r = !0),
                      this._addLink(
                        t.ops[e].portsOut[i].links[s].objIn,
                        t.ops[e].portsOut[i].links[s].objOut,
                        t.ops[e].portsOut[i].links[s].portIn,
                        t.ops[e].portsOut[i].links[s].portOut
                      ));
                  }
          }
        for (const t in this.ops)
          this.ops[t].onLoaded &&
            (this.ops[t].onLoaded(), (this.ops[t].onLoaded = null));
        for (const t in this.ops)
          this.ops[t].init && (this.ops[t].init(), (this.ops[t].init = null));
        if (this.config.variables)
          for (const t in this.config.variables)
            this.setVarValue(t, this.config.variables[t]);
        for (const t in this.ops)
          this.ops[t].initVarPorts(), delete this.ops[t].uiAttribs.pasted;
        setTimeout(() => {
          this.loading.finished(s);
        }, 100),
          this.config.onPatchLoaded && this.config.onPatchLoaded(this),
          this.emitEvent("patchLoadEnd", i, t, e);
      }),
      (Wt.prototype.profile = function (t) {
        this.profiler = new Ht(this);
        for (const e in this.ops) this.ops[e].profile(t);
      }),
      (Wt.prototype.setVariable = function (t, e) {
        void 0 !== this._variables[t]
          ? this._variables[t].setValue(e)
          : this._log.warn("variable " + t + " not found!");
      }),
      (Wt.prototype._sortVars = function () {
        if (!this.isEditorMode()) return;
        const t = {};
        Object.keys(this._variables)
          .sort((t, e) => t.localeCompare(e, "en", { sensitivity: "base" }))
          .forEach((e) => {
            t[e] = this._variables[e];
          }),
          (this._variables = t);
      }),
      (Wt.prototype.hasVar = function (t) {
        return void 0 !== this._variables[t];
      }),
      (Wt.prototype.setVarValue = function (t, e, i) {
        return (
          this.hasVar(t)
            ? this._variables[t].setValue(e)
            : ((this._variables[t] = new zt(t, e, i)),
              this._sortVars(),
              this.emitEvent("variablesChanged")),
          this._variables[t]
        );
      }),
      (Wt.prototype.getVarValue = function (t, e) {
        if (this._variables.hasOwnProperty(t))
          return this._variables[t].getValue();
      }),
      (Wt.prototype.getVar = function (t) {
        if (this._variables.hasOwnProperty(t)) return this._variables[t];
      }),
      (Wt.prototype.deleteVar = function (t) {
        for (let e = 0; e < this.ops.length; e++)
          for (let i = 0; i < this.ops[e].portsIn.length; i++)
            this.ops[e].portsIn[i].getVariableName() == t &&
              this.ops[e].portsIn[i].setVariable(null);
        delete this._variables[t],
          this.emitEvent("variableDeleted", t),
          this.emitEvent("variablesChanged");
      }),
      (Wt.prototype.getVars = function (t) {
        if (void 0 === t) return this._variables;
        const e = [];
        t == CABLES.OP_PORT_TYPE_STRING && (t = "string"),
          t == CABLES.OP_PORT_TYPE_VALUE && (t = "number"),
          t == CABLES.OP_PORT_TYPE_ARRAY && (t = "array"),
          t == CABLES.OP_PORT_TYPE_OBJECT && (t = "object");
        for (const i in this._variables)
          (this._variables[i].type && this._variables[i].type != t) ||
            e.push(this._variables[i]);
        return e;
      }),
      (Wt.prototype.exitError = function (t, e, i) {
        if (((this.aborted = !0), this && this.config && this.config.onError))
          this.config.onError(t, e);
        else if (!this.isEditorMode()) {
          const s = document.createElement("div"),
            r = this.cgl.canvas.getBoundingClientRect();
          s.setAttribute(
            "style",
            "position:absolute;border:5px solid red;padding:15px;background-color:black;color:white;font-family:monospace;"
          ),
            (s.style.top = r.top + "px"),
            (s.style.left = r.left + "px");
          let n = "cables - An error occured:<br/>";
          (n += "[" + t + "] - " + e),
            i && (n += "<br/>Exception: " + i.message),
            (s.innerHTML = n);
          const o = this.cgl.canvas.parentElement;
          for (; o.hasChildNodes(); ) o.removeChild(o.lastChild);
          document.body.appendChild(s);
        }
      }),
      (Wt.prototype.preRenderOps = function () {
        this._log.log("prerendering...");
        for (let t = 0; t < this.ops.length; t++)
          this.ops[t].preRender &&
            (this.ops[t].preRender(),
            this._log.log("prerender " + this.ops[t].objName));
      }),
      (Wt.prototype.dispose = function () {
        this.pause(), this.clear();
      }),
      (Wt.prototype.pushTriggerStack = function (t) {
        this._triggerStack.push(t);
      }),
      (Wt.prototype.popTriggerStack = function () {
        this._triggerStack.pop();
      }),
      (Wt.prototype.printTriggerStack = function () {
        if (0 == this._triggerStack.length)
          return void console.log("stack length", this._triggerStack.length);
        console.groupCollapsed(
          "trigger port stack " +
            this._triggerStack[this._triggerStack.length - 1].parent.name +
            "." +
            this._triggerStack[this._triggerStack.length - 1].name
        );
        const t = [];
        for (let e = 0; e < this._triggerStack.length; e++)
          t.push(
            e +
              ". " +
              this._triggerStack[e].parent.name +
              " " +
              this._triggerStack[e].name
          );
        console.table(t), console.groupEnd();
      }),
      (Wt.replaceOpIds = function (t) {
        for (const e in t.ops) {
          const i = t.ops[e].id,
            s = (t.ops[e].id = CABLES.generateUUID());
          for (const e in t.ops) {
            if (t.ops[e].portsIn)
              for (const r in t.ops[e].portsIn)
                if (t.ops[e].portsIn[r].links) {
                  let n = t.ops[e].portsIn[r].links.length;
                  for (; n--; )
                    null === t.ops[e].portsIn[r].links[n] &&
                      t.ops[e].portsIn[r].links.splice(n, 1);
                  for (n in t.ops[e].portsIn[r].links)
                    t.ops[e].portsIn[r].links[n].objIn == i &&
                      (t.ops[e].portsIn[r].links[n].objIn = s),
                      t.ops[e].portsIn[r].links[n].objOut == i &&
                        (t.ops[e].portsIn[r].links[n].objOut = s);
                }
            if (t.ops[e].portsOut)
              for (const r in t.ops[e].portsOut)
                if (t.ops[e].portsOut[r].links) {
                  let n = t.ops[e].portsOut[r].links.length;
                  for (; n--; )
                    null === t.ops[e].portsOut[r].links[n] &&
                      t.ops[e].portsOut[r].links.splice(n, 1);
                  for (n in t.ops[e].portsOut[r].links)
                    t.ops[e].portsOut[r].links[n].objIn == i &&
                      (t.ops[e].portsOut[r].links[n].objIn = s),
                      t.ops[e].portsOut[r].links[n].objOut == i &&
                        (t.ops[e].portsOut[r].links[n].objOut = s);
                }
          }
        }
        return t;
      });
    var Yt = Wt;
    const Xt = {
        addPatch: function (t, e) {
          let i = t,
            s = A();
          if (
            "string" == typeof t &&
            ((s = t), (i = document.getElementById(s)), !i)
          )
            return void console.error(
              s + " Polyshape Container Element not found!"
            );
          const r = document.createElement("canvas");
          return (
            (r.id = "glcanvas_" + s),
            (r.width = i.clientWidth),
            (r.height = i.clientHeight),
            window.addEventListener(
              "resize",
              function () {
                this.setAttribute("width", i.clientWidth),
                  (this.height = i.clientHeight);
              }.bind(r)
            ),
            i.appendChild(r),
            ((e = e || {}).glCanvasId = r.id),
            e.onError ||
              (e.onError = function (t) {
                console.error(t);
              }),
            (CABLES.patch = new Yt(e)),
            r
          );
        },
      },
      jt = {
        toneJsInitialized: !1,
        createAudioContext: function (t) {
          if (
            ((window.AudioContext =
              window.AudioContext || window.webkitAudioContext),
            window.AudioContext)
          )
            return (
              window.audioContext || (window.audioContext = new AudioContext()),
              window.Tone &&
                !jt.toneJsInitialized &&
                (Tone.setContext(window.audioContext),
                (jt.toneJsInitialized = !0)),
              window.audioContext
            );
          t.patch.config.onError(
            "NO_WEBAUDIO",
            "Web Audio is not supported in this browser."
          );
        },
        getAudioContext: function () {
          return window.audioContext;
        },
        createAudioInPort: function (t, e, i, s) {
          if (!t || !e || !i) {
            const e =
              "ERROR: createAudioInPort needs three parameters, op, portName and audioNode";
            throw (t.log(e), new Error(e));
          }
          s || (s = 0),
            (t.webAudio = t.webAudio || {}),
            (t.webAudio.audioInPorts = t.webAudio.audioInPorts || []);
          const r = t.inObject(e);
          return (
            (r.webAudio = {}),
            (r.webAudio.previousAudioInNode = null),
            (r.webAudio.audioNode = i),
            (t.webAudio.audioInPorts[e] = r),
            (r.onChange = function () {
              const e = r.get();
              if (e)
                try {
                  e.connect
                    ? (e.connect(r.webAudio.audioNode, 0, s),
                      t.setUiError("audioCtx", null))
                    : t.setUiError(
                        "audioCtx",
                        "The passed input is not an audio context. Please make sure you connect an audio context to the input.",
                        2
                      );
                } catch (i) {
                  throw (
                    (t.log("Error: Failed to connect web audio node!", i),
                    t.log("port.webAudio.audioNode", r.webAudio.audioNode),
                    t.log("audioInNode: ", e),
                    t.log("inputChannelIndex:", s),
                    t.log("audioInNode.connect: ", e.connect),
                    i)
                  );
                }
              else if (r.webAudio.previousAudioInNode)
                try {
                  r.webAudio.previousAudioInNode.disconnect &&
                    r.webAudio.previousAudioInNode.disconnect(
                      r.webAudio.audioNode,
                      0,
                      s
                    ),
                    t.setUiError("audioCtx", null);
                } catch (e) {
                  try {
                    r.webAudio.previousAudioInNode.disconnect(
                      r.webAudio.audioNode
                    );
                  } catch (i) {
                    throw (
                      (t.log(
                        "Disconnecting audio node with in/out port index, as well as without in/out-port-index did not work ",
                        e
                      ),
                      e.printStackTrace && e.printStackTrace(),
                      e)
                    );
                  }
                }
              r.webAudio.previousAudioInNode = e;
            }),
            r
          );
        },
        replaceNodeInPort: function (t, e, i) {
          const s = t.webAudio.previousAudioInNode;
          if (s && s.disconnect) {
            try {
              s.disconnect(e);
            } catch (t) {
              throw (
                (t.printStackTrace && t.printStackTrace(),
                new Error(
                  "replaceNodeInPort: Could not disconnect old audio node. " +
                    t.name +
                    " " +
                    t.message
                ))
              );
            }
            t.webAudio.audioNode = i;
            try {
              s.connect(i);
            } catch (t) {
              throw (
                (t.printStackTrace && t.printStackTrace(),
                new Error(
                  "replaceNodeInPort: Could not connect to new node. " +
                    t.name +
                    " " +
                    t.message
                ))
              );
            }
          }
        },
        createAudioOutPort: function (t, e, i) {
          if (!t || !e || !i) {
            const e =
              "ERROR: createAudioOutPort needs three parameters, op, portName and audioNode";
            throw (t.log(e), new Error(e));
          }
          const s = t.outObject(e);
          return s.set(i), s;
        },
        createAudioParamInPort: function (t, e, i, s, r) {
          if (!t || !e || !i)
            return (
              t.log(
                "ERROR: createAudioParamInPort needs three parameters, op, portName and audioNode"
              ),
              t && t.name && t.log("opname: ", t.name),
              t.log("portName", e),
              void t.log("audioNode: ", i)
            );
          (t.webAudio = t.webAudio || {}),
            (t.webAudio.audioInPorts = t.webAudio.audioInPorts || []);
          const n = t.inDynamic(
            e,
            [l.OP_PORT_TYPE_VALUE, l.OP_PORT_TYPE_OBJECT],
            s,
            r
          );
          return (
            (n.webAudio = {}),
            (n.webAudio.previousAudioInNode = null),
            (n.webAudio.audioNode = i),
            (t.webAudio.audioInPorts[e] = n),
            (n.onChange = function () {
              const e = n.get(),
                i = n.webAudio.audioNode,
                s = jt.getAudioContext();
              if (null != e)
                if ("object" == typeof e && e.connect) {
                  try {
                    e.connect(i);
                  } catch (e) {
                    throw (
                      (t.log("Could not connect audio node: ", e),
                      e.printStackTrace && e.printStackTrace(),
                      e)
                    );
                  }
                  n.webAudio.previousAudioInNode = e;
                } else {
                  if (i._param && i._param.minValue && i._param.maxValue)
                    if (e >= i._param.minValue && e <= i._param.maxValue)
                      try {
                        i.setValueAtTime
                          ? i.setValueAtTime(e, s.currentTime)
                          : (i.value = e);
                      } catch (e) {
                        throw (
                          (t.log(
                            "Possible AudioParam problem with tone.js op: ",
                            e
                          ),
                          e.printStackTrace && e.printStackTrace(),
                          e)
                        );
                      }
                    else
                      t.log(
                        "Warning: The value for an audio parameter is out of range!"
                      );
                  else if (i.minValue && i.maxValue)
                    if (e >= i.minValue && e <= i.maxValue)
                      try {
                        i.setValueAtTime
                          ? i.setValueAtTime(e, s.currentTime)
                          : (i.value = e);
                      } catch (e) {
                        throw (
                          (t.log(
                            "AudioParam has minValue / maxValue defined, and value is in range, but setting the value failed! ",
                            e
                          ),
                          e.printStackTrace && e.printStackTrace(),
                          e)
                        );
                      }
                    else
                      t.log(
                        "Warning: The value for an audio parameter is out of range!"
                      );
                  else
                    try {
                      i.setValueAtTime
                        ? i.setValueAtTime(e, s.currentTime)
                        : (i.value = e);
                    } catch (e) {
                      throw (
                        (t.log(
                          "Possible AudioParam problem (without minValue / maxValue): ",
                          e
                        ),
                        e.printStackTrace && e.printStackTrace(),
                        e)
                      );
                    }
                  if (
                    n.webAudio.previousAudioInNode &&
                    n.webAudio.previousAudioInNode.disconnect
                  ) {
                    try {
                      n.webAudio.previousAudioInNode.disconnect(i);
                    } catch (e) {
                      throw (
                        (t.log("Could not disconnect previous audio node: ", e),
                        e)
                      );
                    }
                    n.webAudio.previousAudioInNode = void 0;
                  }
                }
              else n.webAudio.previousAudioInNode;
            }),
            n
          );
        },
        loadAudioFile: function (t, e, i, s, r) {
          const n = jt.createAudioContext();
          let o = null;
          (r || void 0 === r) &&
            ((o = t.loading.start("audio", e)),
            t.isEditorMode() &&
              gui
                .jobs()
                .start({
                  id: "loadaudio" + o,
                  title: " loading audio (" + e + ")",
                }));
          const a = new XMLHttpRequest();
          e &&
            (a.open("GET", e, !0),
            (a.responseType = "arraybuffer"),
            (a.onload = function () {
              t.loading.finished(o),
                t.isEditorMode() && gui.jobs().finish("loadaudio" + o),
                n.decodeAudioData(a.response, i, s);
            }),
            a.send());
        },
        isValidToneTime: function (t) {
          try {
            new Tone.Time(t);
          } catch (t) {
            return !1;
          }
          return !0;
        },
        isValidToneNote: function (t) {
          try {
            Tone.Frequency(t);
          } catch (t) {
            return !1;
          }
          return !0;
        },
      },
      Kt = function (t, e, i) {
        (this._patch = t),
          (this.connector = i),
          (this._log = new a("PatchConnectionReceiver"));
      };
    (Kt.prototype._addOp = function (t) {
      let e = null;
      t.vars.uiAttribs && (e = t.vars.uiAttribs);
      const i = this._patch.addOp(t.vars.objName, e, t.vars.opId, !0);
      i &&
        ((i.id = t.vars.opId),
        t.vars.portsIn &&
          t.vars.portsIn.forEach((t) => {
            const e = i.getPortByName(t.name);
            e && e.set(t.value);
          }));
    }),
      (Kt.prototype._receive = function (t) {
        let e = {};
        if (
          ((e = t.hasOwnProperty("event") ? t : JSON.parse(t.data)),
          e.event == u.PACO_OP_CREATE)
        ) {
          if (this._patch.getOpById(e.vars.opId)) return;
          this._log.verbose("op create:", e.vars.objName),
            window.gui
              ? gui.serverOps.loadOpLibs(e.vars.objName, () => {
                  this._addOp(e);
                })
              : this._addOp(e);
        } else if (e.event == u.PACO_DESERIALIZE)
          e.vars.json &&
            (window.gui
              ? gui.serverOps.loadProjectDependencies(e.vars.json, () => {
                  this._patch.deSerialize(e.vars.json, e.vars.genIds);
                })
              : this._patch.deSerialize(e.vars.json, e.vars.genIds));
        else if (e.event == u.PACO_LOAD)
          this._log.verbose("PACO load patch....."),
            this._patch.clear(),
            window.gui
              ? gui.serverOps.loadProjectDependencies(
                  JSON.parse(e.vars.patch),
                  () => {
                    this._patch.deSerialize(e.vars.patch);
                  }
                )
              : this._patch.deSerialize(e.vars.patch);
        else if (e.event == u.PACO_CLEAR)
          this._patch.clear(), this._log.log("clear");
        else if (e.event == u.PACO_OP_DELETE) {
          this._log.verbose("op delete", e.vars.objName);
          this._patch.getOpById(e.vars.op);
          this._patch.deleteOp(e.vars.op, !0);
        } else if (e.event == u.PACO_OP_ENABLE) {
          const t = this._patch.getOpById(e.vars.op);
          t && (t.enabled = !0);
        } else if (e.event == u.PACO_OP_DISABLE) {
          const t = this._patch.getOpById(e.vars.op);
          t && (t.enabled = !1);
        } else if (e.event == u.PACO_UIATTRIBS) {
          const t = this._patch.getOpById(e.vars.op);
          t && t.setUiAttrib(e.vars.uiAttribs);
        } else if (e.event == u.PACO_UNLINK) {
          const t = this._patch.getOpById(e.vars.op1),
            i = this._patch.getOpById(e.vars.op2);
          if (!t || !i) return;
          const s = t.getPort(e.vars.port1),
            r = i.getPort(e.vars.port2);
          s && r
            ? s.removeLinkTo(r)
            : this._log.warn("paco unlink could not find port...");
        } else if (e.event == u.PACO_LINK) {
          const t = this._patch.getOpById(e.vars.op1),
            i = this._patch.getOpById(e.vars.op2);
          t && i && this._patch.link(t, e.vars.port1, i, e.vars.port2);
        } else if (e.event == u.PACO_VALUECHANGE) {
          if ("+ create new one" === e.vars.v) return;
          const t = this._patch.getOpById(e.vars.op);
          if (t) {
            const i = t.getPort(e.vars.port);
            i && i.set(e.vars.v);
          }
        } else if (e.event == u.PACO_VARIABLES) {
          const t = this._patch.getOpById(e.vars.opId);
          t && t.varName && t.varName.set(e.vars.varName);
        } else if (e.event == u.PACO_TRIGGERS) {
          const t = this._patch.getOpById(e.vars.opId);
          t && t.varName && t.varName.set(e.vars.varName);
        } else if (e.event == u.PACO_PORT_SETVARIABLE) {
          const t = this._patch.getOpById(e.vars.opId);
          if (t) {
            const i = t.getPortByName(e.vars.portName);
            i && i.setVariable(e.vars.variableName);
          }
        } else if (e.event == u.PACO_PORT_SETANIMATED) {
          const t = this._patch.getOpById(e.vars.opId);
          if (t) {
            t.portsIn[e.vars.portIndex] &&
              e.vars.hasOwnProperty("targetState") &&
              this._patch.emitEvent(
                "pacoPortValueSetAnimated",
                t,
                e.vars.portIndex,
                e.vars.targetState,
                e.vars.defaultValue
              );
          }
        } else if (e.event == u.PACO_PORT_ANIM_UPDATED) {
          const t = this._patch.getOpById(e.vars.opId);
          if (t) {
            const i = t.getPortByName(e.vars.portName);
            if (i) {
              const t = i.getSerialized();
              (t.anim = e.vars.anim),
                (i.anim = null),
                i.deSerializeSettings(t),
                this._patch.emitEvent("pacoPortAnimUpdated", i);
            }
          }
        } else this._log.warn("unknown patchConnectionEvent!", t);
      });
    const Qt = function (t) {
      (this.connectors = []),
        (this.paused = !1),
        t.addEventListener("onOpDelete", (t) => {
          this.send(CABLES.PACO_OP_DELETE, { op: t.id, objName: t.objName });
        }),
        t.addEventListener("patchClearStart", () => {
          this.paused = !0;
        }),
        t.addEventListener("patchClearEnd", () => {
          this.paused = !1;
        }),
        t.addEventListener("patchLoadStart", () => {
          this.paused = !0;
        }),
        t.addEventListener("patchLoadEnd", (t, e, i) => {
          (this.paused = !1),
            this.send(CABLES.PACO_DESERIALIZE, { json: e, genIds: i });
        }),
        t.addEventListener("onOpAdd", (t) => {
          const e = [];
          t.portsIn.forEach((t) => {
            const i = { id: t.id, name: t.name, value: t.get() };
            e.push(i);
          });
          let i = {};
          t.uiAttribs && (i = { ...t.uiAttribs }),
            this.send(CABLES.PACO_OP_CREATE, {
              opId: t.id,
              objName: t.objName,
              uiAttribs: i,
              portsIn: e,
            });
        }),
        t.addEventListener("onUnLink", (t, e) => {
          this.send(CABLES.PACO_UNLINK, {
            op1: t.parent.id,
            op2: e.parent.id,
            port1: t.getName(),
            port2: e.getName(),
          });
        }),
        t.addEventListener("onUiAttribsChange", (t, e) => {
          e &&
            (delete e.extendTitle,
            delete e.history,
            delete e.translate,
            Object.keys(e).length > 0 &&
              this.send(CABLES.PACO_UIATTRIBS, { op: t.id, uiAttribs: e }));
        }),
        t.addEventListener("opVariableNameChanged", (t, e) => {
          const i = { opId: t.id, varName: e };
          this.send(CABLES.PACO_VARIABLES, i);
        }),
        t.addEventListener("opTriggerNameChanged", (t, e) => {
          const i = { opId: t.id, varName: e };
          this.send(CABLES.PACO_TRIGGERS, i);
        }),
        t.addEventListener("onLink", (t, e) => {
          this.send(CABLES.PACO_LINK, {
            op1: t.parent.id,
            op2: e.parent.id,
            port1: t.name,
            port2: e.name,
          });
        }),
        t.addEventListener("portSetVariable", (t, e, i) => {
          const s = { opId: t.id, portName: e.name, variableName: i };
          this.send(CABLES.PACO_PORT_SETVARIABLE, s);
        }),
        t.addEventListener("portAnimUpdated", (t, e, i) => {
          if (t && e) {
            const s = { opId: t.id, portName: e.name, anim: i.getSerialized() };
            this.send(CABLES.PACO_PORT_ANIM_UPDATED, s);
          }
        });
    };
    Qt.prototype.send = function (t, e) {
      if (
        !this.paused &&
        (t !== CABLES.PACO_VALUECHANGE || "+ create new one" !== e.v)
      )
        for (let i = 0; i < this.connectors.length; i++)
          this.connectors[i].send(t, e);
    };
    const qt = function () {
      window.BroadcastChannel &&
        (this.bc = new BroadcastChannel("test_channel"));
    };
    (qt.prototype.receive = function (t) {
      this.bc &&
        (this._log.log("init"), (this.bc.onmessage = t._receive.bind(t)));
    }),
      (qt.prototype.send = function (t, e) {
        if (!this.bc) return;
        const i = {};
        (i.event = t), (i.vars = e), this.bc.postMessage(JSON.stringify(i));
      });
    class Jt {
      constructor(t) {
        (this.name = t),
          (this.dur = 0),
          (this._startTime = 0),
          (this.childs = []);
      }
      start() {
        this._startTime = performance.now();
      }
      end() {
        this.dur = performance.now() - this._startTime;
      }
      push(t) {
        const e = new Jt(t);
        return this.childs.push(e), e.start(), e;
      }
      print(t) {
        t = t || 0;
        let e = "";
        for (let i = 0; i < t; i++) e += "  ";
        for (let e = 0; e < this.childs.length; e++)
          this.childs[e].print(t + 1);
      }
    }
    (window.CABLES = window.CABLES || {}),
      (CABLES.CG = Rt),
      (CABLES.CGP = wt),
      (CABLES.EventTarget = Y),
      (CABLES.EMBED = Xt),
      (CABLES.Link = kt),
      (CABLES.Port = et),
      (CABLES.Op = Vt),
      (CABLES.Profiler = Ht),
      (CABLES.Patch = Yt),
      (CABLES.Instancing = Gt),
      (CABLES.Timer = ft),
      (CABLES.WEBAUDIO = jt),
      (CABLES.Variable = function () {
        let t = null;
        const e = [];
        (this.onChanged = function (t) {
          e.push(t);
        }),
          (this.getValue = function () {
            return t;
          }),
          (this.setValue = function (e) {
            (t = e), this.emitChanged();
          }),
          (this.emitChanged = function () {
            for (let t = 0; t < e.length; t++) e[t]();
          });
      }),
      (CABLES.LoadingStatus = Dt),
      (CABLES.now = dt),
      (CABLES.internalNow = _t),
      (CABLES.BranchStack = class {
        constructor() {}
        start() {
          (this.root = new Jt("Root")),
            this.root.start(),
            (this.current = this.root);
        }
        push(t) {
          this.current || this.start();
          const e = this.current;
          return (
            (this.current = this.current.push(t)),
            (this.current.prev = e),
            this.current.start(),
            this.current
          );
        }
        pop() {
          this.current &&
            (this.current.end(), (this.current = this.current.prev));
        }
        finish() {
          this.current.end(), this.root.print(), (this.current = null);
        }
      }),
      (CABLES.Branch = Jt),
      (CABLES = Object.assign(CABLES, r, s, n, h, o, c, u, h, l));
    e.default = CABLES;
    (function () {
      return !this;
    })() || console.warn("not in strict mode: index core");
  },
]).default;
//# originalSourceMappingURL=cables.min.js.map

var CABLES = CABLES || {};
CABLES.build = {
  timestamp: 1682341866190,
  created: "2023-04-24T13:11:06.190Z",
  git: {
    branch: "master",
    commit: "a8912bdbb85d335fb4b58c228bba4c8be8498ebd",
    date: "2023-04-24T13:08:49.000Z",
    message: "fix duplicate ids",
  },
};
/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.1.0

Copyright (c) 2015-2019, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
!(function (t, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], n)
    : n(((t = t || self).glMatrix = {}));
})(this, function (t) {
  "use strict";
  var n = 1e-6,
    a = "undefined" != typeof Float32Array ? Float32Array : Array,
    r = Math.random;
  var u = Math.PI / 180;
  Math.hypot ||
    (Math.hypot = function () {
      for (var t = 0, n = arguments.length; n--; )
        t += arguments[n] * arguments[n];
      return Math.sqrt(t);
    });
  var e = Object.freeze({
    EPSILON: n,
    get ARRAY_TYPE() {
      return a;
    },
    RANDOM: r,
    setMatrixArrayType: function (t) {
      a = t;
    },
    toRadian: function (t) {
      return t * u;
    },
    equals: function (t, a) {
      return Math.abs(t - a) <= n * Math.max(1, Math.abs(t), Math.abs(a));
    },
  });
  function o(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = a[0],
      c = a[1],
      h = a[2],
      s = a[3];
    return (
      (t[0] = r * i + e * c),
      (t[1] = u * i + o * c),
      (t[2] = r * h + e * s),
      (t[3] = u * h + o * s),
      t
    );
  }
  function i(t, n, a) {
    return (
      (t[0] = n[0] - a[0]),
      (t[1] = n[1] - a[1]),
      (t[2] = n[2] - a[2]),
      (t[3] = n[3] - a[3]),
      t
    );
  }
  var c = o,
    h = i,
    s = Object.freeze({
      create: function () {
        var t = new a(4);
        return (
          a != Float32Array && ((t[1] = 0), (t[2] = 0)),
          (t[0] = 1),
          (t[3] = 1),
          t
        );
      },
      clone: function (t) {
        var n = new a(4);
        return (n[0] = t[0]), (n[1] = t[1]), (n[2] = t[2]), (n[3] = t[3]), n;
      },
      copy: function (t, n) {
        return (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), (t[3] = n[3]), t;
      },
      identity: function (t) {
        return (t[0] = 1), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
      },
      fromValues: function (t, n, r, u) {
        var e = new a(4);
        return (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = u), e;
      },
      set: function (t, n, a, r, u) {
        return (t[0] = n), (t[1] = a), (t[2] = r), (t[3] = u), t;
      },
      transpose: function (t, n) {
        if (t === n) {
          var a = n[1];
          (t[1] = n[2]), (t[2] = a);
        } else (t[0] = n[0]), (t[1] = n[2]), (t[2] = n[1]), (t[3] = n[3]);
        return t;
      },
      invert: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = a * e - u * r;
        return o
          ? ((o = 1 / o),
            (t[0] = e * o),
            (t[1] = -r * o),
            (t[2] = -u * o),
            (t[3] = a * o),
            t)
          : null;
      },
      adjoint: function (t, n) {
        var a = n[0];
        return (t[0] = n[3]), (t[1] = -n[1]), (t[2] = -n[2]), (t[3] = a), t;
      },
      determinant: function (t) {
        return t[0] * t[3] - t[2] * t[1];
      },
      multiply: o,
      rotate: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = Math.sin(a),
          c = Math.cos(a);
        return (
          (t[0] = r * c + e * i),
          (t[1] = u * c + o * i),
          (t[2] = r * -i + e * c),
          (t[3] = u * -i + o * c),
          t
        );
      },
      scale: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = a[0],
          c = a[1];
        return (
          (t[0] = r * i), (t[1] = u * i), (t[2] = e * c), (t[3] = o * c), t
        );
      },
      fromRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (t[0] = r), (t[1] = a), (t[2] = -a), (t[3] = r), t;
      },
      fromScaling: function (t, n) {
        return (t[0] = n[0]), (t[1] = 0), (t[2] = 0), (t[3] = n[1]), t;
      },
      str: function (t) {
        return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
      },
      frob: function (t) {
        return Math.hypot(t[0], t[1], t[2], t[3]);
      },
      LDU: function (t, n, a, r) {
        return (
          (t[2] = r[2] / r[0]),
          (a[0] = r[0]),
          (a[1] = r[1]),
          (a[3] = r[3] - t[2] * a[1]),
          [t, n, a]
        );
      },
      add: function (t, n, a) {
        return (
          (t[0] = n[0] + a[0]),
          (t[1] = n[1] + a[1]),
          (t[2] = n[2] + a[2]),
          (t[3] = n[3] + a[3]),
          t
        );
      },
      subtract: i,
      exactEquals: function (t, n) {
        return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3];
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = t[2],
          o = t[3],
          i = a[0],
          c = a[1],
          h = a[2],
          s = a[3];
        return (
          Math.abs(r - i) <= n * Math.max(1, Math.abs(r), Math.abs(i)) &&
          Math.abs(u - c) <= n * Math.max(1, Math.abs(u), Math.abs(c)) &&
          Math.abs(e - h) <= n * Math.max(1, Math.abs(e), Math.abs(h)) &&
          Math.abs(o - s) <= n * Math.max(1, Math.abs(o), Math.abs(s))
        );
      },
      multiplyScalar: function (t, n, a) {
        return (
          (t[0] = n[0] * a),
          (t[1] = n[1] * a),
          (t[2] = n[2] * a),
          (t[3] = n[3] * a),
          t
        );
      },
      multiplyScalarAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          (t[3] = n[3] + a[3] * r),
          t
        );
      },
      mul: c,
      sub: h,
    });
  function M(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = a[0],
      s = a[1],
      M = a[2],
      f = a[3],
      l = a[4],
      v = a[5];
    return (
      (t[0] = r * h + e * s),
      (t[1] = u * h + o * s),
      (t[2] = r * M + e * f),
      (t[3] = u * M + o * f),
      (t[4] = r * l + e * v + i),
      (t[5] = u * l + o * v + c),
      t
    );
  }
  function f(t, n, a) {
    return (
      (t[0] = n[0] - a[0]),
      (t[1] = n[1] - a[1]),
      (t[2] = n[2] - a[2]),
      (t[3] = n[3] - a[3]),
      (t[4] = n[4] - a[4]),
      (t[5] = n[5] - a[5]),
      t
    );
  }
  var l = M,
    v = f,
    b = Object.freeze({
      create: function () {
        var t = new a(6);
        return (
          a != Float32Array && ((t[1] = 0), (t[2] = 0), (t[4] = 0), (t[5] = 0)),
          (t[0] = 1),
          (t[3] = 1),
          t
        );
      },
      clone: function (t) {
        var n = new a(6);
        return (
          (n[0] = t[0]),
          (n[1] = t[1]),
          (n[2] = t[2]),
          (n[3] = t[3]),
          (n[4] = t[4]),
          (n[5] = t[5]),
          n
        );
      },
      copy: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = n[1]),
          (t[2] = n[2]),
          (t[3] = n[3]),
          (t[4] = n[4]),
          (t[5] = n[5]),
          t
        );
      },
      identity: function (t) {
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 1),
          (t[4] = 0),
          (t[5] = 0),
          t
        );
      },
      fromValues: function (t, n, r, u, e, o) {
        var i = new a(6);
        return (
          (i[0] = t),
          (i[1] = n),
          (i[2] = r),
          (i[3] = u),
          (i[4] = e),
          (i[5] = o),
          i
        );
      },
      set: function (t, n, a, r, u, e, o) {
        return (
          (t[0] = n),
          (t[1] = a),
          (t[2] = r),
          (t[3] = u),
          (t[4] = e),
          (t[5] = o),
          t
        );
      },
      invert: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = a * e - r * u;
        return c
          ? ((c = 1 / c),
            (t[0] = e * c),
            (t[1] = -r * c),
            (t[2] = -u * c),
            (t[3] = a * c),
            (t[4] = (u * i - e * o) * c),
            (t[5] = (r * o - a * i) * c),
            t)
          : null;
      },
      determinant: function (t) {
        return t[0] * t[3] - t[1] * t[2];
      },
      multiply: M,
      rotate: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = n[4],
          c = n[5],
          h = Math.sin(a),
          s = Math.cos(a);
        return (
          (t[0] = r * s + e * h),
          (t[1] = u * s + o * h),
          (t[2] = r * -h + e * s),
          (t[3] = u * -h + o * s),
          (t[4] = i),
          (t[5] = c),
          t
        );
      },
      scale: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = n[4],
          c = n[5],
          h = a[0],
          s = a[1];
        return (
          (t[0] = r * h),
          (t[1] = u * h),
          (t[2] = e * s),
          (t[3] = o * s),
          (t[4] = i),
          (t[5] = c),
          t
        );
      },
      translate: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = n[4],
          c = n[5],
          h = a[0],
          s = a[1];
        return (
          (t[0] = r),
          (t[1] = u),
          (t[2] = e),
          (t[3] = o),
          (t[4] = r * h + e * s + i),
          (t[5] = u * h + o * s + c),
          t
        );
      },
      fromRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (
          (t[0] = r),
          (t[1] = a),
          (t[2] = -a),
          (t[3] = r),
          (t[4] = 0),
          (t[5] = 0),
          t
        );
      },
      fromScaling: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = n[1]),
          (t[4] = 0),
          (t[5] = 0),
          t
        );
      },
      fromTranslation: function (t, n) {
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 1),
          (t[4] = n[0]),
          (t[5] = n[1]),
          t
        );
      },
      str: function (t) {
        return (
          "mat2d(" +
          t[0] +
          ", " +
          t[1] +
          ", " +
          t[2] +
          ", " +
          t[3] +
          ", " +
          t[4] +
          ", " +
          t[5] +
          ")"
        );
      },
      frob: function (t) {
        return Math.hypot(t[0], t[1], t[2], t[3], t[4], t[5], 1);
      },
      add: function (t, n, a) {
        return (
          (t[0] = n[0] + a[0]),
          (t[1] = n[1] + a[1]),
          (t[2] = n[2] + a[2]),
          (t[3] = n[3] + a[3]),
          (t[4] = n[4] + a[4]),
          (t[5] = n[5] + a[5]),
          t
        );
      },
      subtract: f,
      multiplyScalar: function (t, n, a) {
        return (
          (t[0] = n[0] * a),
          (t[1] = n[1] * a),
          (t[2] = n[2] * a),
          (t[3] = n[3] * a),
          (t[4] = n[4] * a),
          (t[5] = n[5] * a),
          t
        );
      },
      multiplyScalarAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          (t[3] = n[3] + a[3] * r),
          (t[4] = n[4] + a[4] * r),
          (t[5] = n[5] + a[5] * r),
          t
        );
      },
      exactEquals: function (t, n) {
        return (
          t[0] === n[0] &&
          t[1] === n[1] &&
          t[2] === n[2] &&
          t[3] === n[3] &&
          t[4] === n[4] &&
          t[5] === n[5]
        );
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = t[2],
          o = t[3],
          i = t[4],
          c = t[5],
          h = a[0],
          s = a[1],
          M = a[2],
          f = a[3],
          l = a[4],
          v = a[5];
        return (
          Math.abs(r - h) <= n * Math.max(1, Math.abs(r), Math.abs(h)) &&
          Math.abs(u - s) <= n * Math.max(1, Math.abs(u), Math.abs(s)) &&
          Math.abs(e - M) <= n * Math.max(1, Math.abs(e), Math.abs(M)) &&
          Math.abs(o - f) <= n * Math.max(1, Math.abs(o), Math.abs(f)) &&
          Math.abs(i - l) <= n * Math.max(1, Math.abs(i), Math.abs(l)) &&
          Math.abs(c - v) <= n * Math.max(1, Math.abs(c), Math.abs(v))
        );
      },
      mul: l,
      sub: v,
    });
  function m() {
    var t = new a(9);
    return (
      a != Float32Array &&
        ((t[1] = 0),
        (t[2] = 0),
        (t[3] = 0),
        (t[5] = 0),
        (t[6] = 0),
        (t[7] = 0)),
      (t[0] = 1),
      (t[4] = 1),
      (t[8] = 1),
      t
    );
  }
  function d(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = n[6],
      s = n[7],
      M = n[8],
      f = a[0],
      l = a[1],
      v = a[2],
      b = a[3],
      m = a[4],
      d = a[5],
      x = a[6],
      p = a[7],
      y = a[8];
    return (
      (t[0] = f * r + l * o + v * h),
      (t[1] = f * u + l * i + v * s),
      (t[2] = f * e + l * c + v * M),
      (t[3] = b * r + m * o + d * h),
      (t[4] = b * u + m * i + d * s),
      (t[5] = b * e + m * c + d * M),
      (t[6] = x * r + p * o + y * h),
      (t[7] = x * u + p * i + y * s),
      (t[8] = x * e + p * c + y * M),
      t
    );
  }
  function x(t, n, a) {
    return (
      (t[0] = n[0] - a[0]),
      (t[1] = n[1] - a[1]),
      (t[2] = n[2] - a[2]),
      (t[3] = n[3] - a[3]),
      (t[4] = n[4] - a[4]),
      (t[5] = n[5] - a[5]),
      (t[6] = n[6] - a[6]),
      (t[7] = n[7] - a[7]),
      (t[8] = n[8] - a[8]),
      t
    );
  }
  var p = d,
    y = x,
    q = Object.freeze({
      create: m,
      fromMat4: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = n[1]),
          (t[2] = n[2]),
          (t[3] = n[4]),
          (t[4] = n[5]),
          (t[5] = n[6]),
          (t[6] = n[8]),
          (t[7] = n[9]),
          (t[8] = n[10]),
          t
        );
      },
      clone: function (t) {
        var n = new a(9);
        return (
          (n[0] = t[0]),
          (n[1] = t[1]),
          (n[2] = t[2]),
          (n[3] = t[3]),
          (n[4] = t[4]),
          (n[5] = t[5]),
          (n[6] = t[6]),
          (n[7] = t[7]),
          (n[8] = t[8]),
          n
        );
      },
      copy: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = n[1]),
          (t[2] = n[2]),
          (t[3] = n[3]),
          (t[4] = n[4]),
          (t[5] = n[5]),
          (t[6] = n[6]),
          (t[7] = n[7]),
          (t[8] = n[8]),
          t
        );
      },
      fromValues: function (t, n, r, u, e, o, i, c, h) {
        var s = new a(9);
        return (
          (s[0] = t),
          (s[1] = n),
          (s[2] = r),
          (s[3] = u),
          (s[4] = e),
          (s[5] = o),
          (s[6] = i),
          (s[7] = c),
          (s[8] = h),
          s
        );
      },
      set: function (t, n, a, r, u, e, o, i, c, h) {
        return (
          (t[0] = n),
          (t[1] = a),
          (t[2] = r),
          (t[3] = u),
          (t[4] = e),
          (t[5] = o),
          (t[6] = i),
          (t[7] = c),
          (t[8] = h),
          t
        );
      },
      identity: function (t) {
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 1),
          (t[5] = 0),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 1),
          t
        );
      },
      transpose: function (t, n) {
        if (t === n) {
          var a = n[1],
            r = n[2],
            u = n[5];
          (t[1] = n[3]),
            (t[2] = n[6]),
            (t[3] = a),
            (t[5] = n[7]),
            (t[6] = r),
            (t[7] = u);
        } else
          (t[0] = n[0]),
            (t[1] = n[3]),
            (t[2] = n[6]),
            (t[3] = n[1]),
            (t[4] = n[4]),
            (t[5] = n[7]),
            (t[6] = n[2]),
            (t[7] = n[5]),
            (t[8] = n[8]);
        return t;
      },
      invert: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = n[6],
          h = n[7],
          s = n[8],
          M = s * o - i * h,
          f = -s * e + i * c,
          l = h * e - o * c,
          v = a * M + r * f + u * l;
        return v
          ? ((v = 1 / v),
            (t[0] = M * v),
            (t[1] = (-s * r + u * h) * v),
            (t[2] = (i * r - u * o) * v),
            (t[3] = f * v),
            (t[4] = (s * a - u * c) * v),
            (t[5] = (-i * a + u * e) * v),
            (t[6] = l * v),
            (t[7] = (-h * a + r * c) * v),
            (t[8] = (o * a - r * e) * v),
            t)
          : null;
      },
      adjoint: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = n[6],
          h = n[7],
          s = n[8];
        return (
          (t[0] = o * s - i * h),
          (t[1] = u * h - r * s),
          (t[2] = r * i - u * o),
          (t[3] = i * c - e * s),
          (t[4] = a * s - u * c),
          (t[5] = u * e - a * i),
          (t[6] = e * h - o * c),
          (t[7] = r * c - a * h),
          (t[8] = a * o - r * e),
          t
        );
      },
      determinant: function (t) {
        var n = t[0],
          a = t[1],
          r = t[2],
          u = t[3],
          e = t[4],
          o = t[5],
          i = t[6],
          c = t[7],
          h = t[8];
        return n * (h * e - o * c) + a * (-h * u + o * i) + r * (c * u - e * i);
      },
      multiply: d,
      translate: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = n[4],
          c = n[5],
          h = n[6],
          s = n[7],
          M = n[8],
          f = a[0],
          l = a[1];
        return (
          (t[0] = r),
          (t[1] = u),
          (t[2] = e),
          (t[3] = o),
          (t[4] = i),
          (t[5] = c),
          (t[6] = f * r + l * o + h),
          (t[7] = f * u + l * i + s),
          (t[8] = f * e + l * c + M),
          t
        );
      },
      rotate: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3],
          i = n[4],
          c = n[5],
          h = n[6],
          s = n[7],
          M = n[8],
          f = Math.sin(a),
          l = Math.cos(a);
        return (
          (t[0] = l * r + f * o),
          (t[1] = l * u + f * i),
          (t[2] = l * e + f * c),
          (t[3] = l * o - f * r),
          (t[4] = l * i - f * u),
          (t[5] = l * c - f * e),
          (t[6] = h),
          (t[7] = s),
          (t[8] = M),
          t
        );
      },
      scale: function (t, n, a) {
        var r = a[0],
          u = a[1];
        return (
          (t[0] = r * n[0]),
          (t[1] = r * n[1]),
          (t[2] = r * n[2]),
          (t[3] = u * n[3]),
          (t[4] = u * n[4]),
          (t[5] = u * n[5]),
          (t[6] = n[6]),
          (t[7] = n[7]),
          (t[8] = n[8]),
          t
        );
      },
      fromTranslation: function (t, n) {
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 1),
          (t[5] = 0),
          (t[6] = n[0]),
          (t[7] = n[1]),
          (t[8] = 1),
          t
        );
      },
      fromRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (
          (t[0] = r),
          (t[1] = a),
          (t[2] = 0),
          (t[3] = -a),
          (t[4] = r),
          (t[5] = 0),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 1),
          t
        );
      },
      fromScaling: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = n[1]),
          (t[5] = 0),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 1),
          t
        );
      },
      fromMat2d: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = n[1]),
          (t[2] = 0),
          (t[3] = n[2]),
          (t[4] = n[3]),
          (t[5] = 0),
          (t[6] = n[4]),
          (t[7] = n[5]),
          (t[8] = 1),
          t
        );
      },
      fromQuat: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = a + a,
          i = r + r,
          c = u + u,
          h = a * o,
          s = r * o,
          M = r * i,
          f = u * o,
          l = u * i,
          v = u * c,
          b = e * o,
          m = e * i,
          d = e * c;
        return (
          (t[0] = 1 - M - v),
          (t[3] = s - d),
          (t[6] = f + m),
          (t[1] = s + d),
          (t[4] = 1 - h - v),
          (t[7] = l - b),
          (t[2] = f - m),
          (t[5] = l + b),
          (t[8] = 1 - h - M),
          t
        );
      },
      normalFromMat4: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = n[6],
          h = n[7],
          s = n[8],
          M = n[9],
          f = n[10],
          l = n[11],
          v = n[12],
          b = n[13],
          m = n[14],
          d = n[15],
          x = a * i - r * o,
          p = a * c - u * o,
          y = a * h - e * o,
          q = r * c - u * i,
          g = r * h - e * i,
          A = u * h - e * c,
          w = s * b - M * v,
          R = s * m - f * v,
          z = s * d - l * v,
          P = M * m - f * b,
          j = M * d - l * b,
          I = f * d - l * m,
          S = x * I - p * j + y * P + q * z - g * R + A * w;
        return S
          ? ((S = 1 / S),
            (t[0] = (i * I - c * j + h * P) * S),
            (t[1] = (c * z - o * I - h * R) * S),
            (t[2] = (o * j - i * z + h * w) * S),
            (t[3] = (u * j - r * I - e * P) * S),
            (t[4] = (a * I - u * z + e * R) * S),
            (t[5] = (r * z - a * j - e * w) * S),
            (t[6] = (b * A - m * g + d * q) * S),
            (t[7] = (m * y - v * A - d * p) * S),
            (t[8] = (v * g - b * y + d * x) * S),
            t)
          : null;
      },
      projection: function (t, n, a) {
        return (
          (t[0] = 2 / n),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = -2 / a),
          (t[5] = 0),
          (t[6] = -1),
          (t[7] = 1),
          (t[8] = 1),
          t
        );
      },
      str: function (t) {
        return (
          "mat3(" +
          t[0] +
          ", " +
          t[1] +
          ", " +
          t[2] +
          ", " +
          t[3] +
          ", " +
          t[4] +
          ", " +
          t[5] +
          ", " +
          t[6] +
          ", " +
          t[7] +
          ", " +
          t[8] +
          ")"
        );
      },
      frob: function (t) {
        return Math.hypot(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
      },
      add: function (t, n, a) {
        return (
          (t[0] = n[0] + a[0]),
          (t[1] = n[1] + a[1]),
          (t[2] = n[2] + a[2]),
          (t[3] = n[3] + a[3]),
          (t[4] = n[4] + a[4]),
          (t[5] = n[5] + a[5]),
          (t[6] = n[6] + a[6]),
          (t[7] = n[7] + a[7]),
          (t[8] = n[8] + a[8]),
          t
        );
      },
      subtract: x,
      multiplyScalar: function (t, n, a) {
        return (
          (t[0] = n[0] * a),
          (t[1] = n[1] * a),
          (t[2] = n[2] * a),
          (t[3] = n[3] * a),
          (t[4] = n[4] * a),
          (t[5] = n[5] * a),
          (t[6] = n[6] * a),
          (t[7] = n[7] * a),
          (t[8] = n[8] * a),
          t
        );
      },
      multiplyScalarAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          (t[3] = n[3] + a[3] * r),
          (t[4] = n[4] + a[4] * r),
          (t[5] = n[5] + a[5] * r),
          (t[6] = n[6] + a[6] * r),
          (t[7] = n[7] + a[7] * r),
          (t[8] = n[8] + a[8] * r),
          t
        );
      },
      exactEquals: function (t, n) {
        return (
          t[0] === n[0] &&
          t[1] === n[1] &&
          t[2] === n[2] &&
          t[3] === n[3] &&
          t[4] === n[4] &&
          t[5] === n[5] &&
          t[6] === n[6] &&
          t[7] === n[7] &&
          t[8] === n[8]
        );
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = t[2],
          o = t[3],
          i = t[4],
          c = t[5],
          h = t[6],
          s = t[7],
          M = t[8],
          f = a[0],
          l = a[1],
          v = a[2],
          b = a[3],
          m = a[4],
          d = a[5],
          x = a[6],
          p = a[7],
          y = a[8];
        return (
          Math.abs(r - f) <= n * Math.max(1, Math.abs(r), Math.abs(f)) &&
          Math.abs(u - l) <= n * Math.max(1, Math.abs(u), Math.abs(l)) &&
          Math.abs(e - v) <= n * Math.max(1, Math.abs(e), Math.abs(v)) &&
          Math.abs(o - b) <= n * Math.max(1, Math.abs(o), Math.abs(b)) &&
          Math.abs(i - m) <= n * Math.max(1, Math.abs(i), Math.abs(m)) &&
          Math.abs(c - d) <= n * Math.max(1, Math.abs(c), Math.abs(d)) &&
          Math.abs(h - x) <= n * Math.max(1, Math.abs(h), Math.abs(x)) &&
          Math.abs(s - p) <= n * Math.max(1, Math.abs(s), Math.abs(p)) &&
          Math.abs(M - y) <= n * Math.max(1, Math.abs(M), Math.abs(y))
        );
      },
      mul: p,
      sub: y,
    });
  function g(t) {
    return (
      (t[0] = 1),
      (t[1] = 0),
      (t[2] = 0),
      (t[3] = 0),
      (t[4] = 0),
      (t[5] = 1),
      (t[6] = 0),
      (t[7] = 0),
      (t[8] = 0),
      (t[9] = 0),
      (t[10] = 1),
      (t[11] = 0),
      (t[12] = 0),
      (t[13] = 0),
      (t[14] = 0),
      (t[15] = 1),
      t
    );
  }
  function A(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = n[6],
      s = n[7],
      M = n[8],
      f = n[9],
      l = n[10],
      v = n[11],
      b = n[12],
      m = n[13],
      d = n[14],
      x = n[15],
      p = a[0],
      y = a[1],
      q = a[2],
      g = a[3];
    return (
      (t[0] = p * r + y * i + q * M + g * b),
      (t[1] = p * u + y * c + q * f + g * m),
      (t[2] = p * e + y * h + q * l + g * d),
      (t[3] = p * o + y * s + q * v + g * x),
      (p = a[4]),
      (y = a[5]),
      (q = a[6]),
      (g = a[7]),
      (t[4] = p * r + y * i + q * M + g * b),
      (t[5] = p * u + y * c + q * f + g * m),
      (t[6] = p * e + y * h + q * l + g * d),
      (t[7] = p * o + y * s + q * v + g * x),
      (p = a[8]),
      (y = a[9]),
      (q = a[10]),
      (g = a[11]),
      (t[8] = p * r + y * i + q * M + g * b),
      (t[9] = p * u + y * c + q * f + g * m),
      (t[10] = p * e + y * h + q * l + g * d),
      (t[11] = p * o + y * s + q * v + g * x),
      (p = a[12]),
      (y = a[13]),
      (q = a[14]),
      (g = a[15]),
      (t[12] = p * r + y * i + q * M + g * b),
      (t[13] = p * u + y * c + q * f + g * m),
      (t[14] = p * e + y * h + q * l + g * d),
      (t[15] = p * o + y * s + q * v + g * x),
      t
    );
  }
  function w(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = r + r,
      c = u + u,
      h = e + e,
      s = r * i,
      M = r * c,
      f = r * h,
      l = u * c,
      v = u * h,
      b = e * h,
      m = o * i,
      d = o * c,
      x = o * h;
    return (
      (t[0] = 1 - (l + b)),
      (t[1] = M + x),
      (t[2] = f - d),
      (t[3] = 0),
      (t[4] = M - x),
      (t[5] = 1 - (s + b)),
      (t[6] = v + m),
      (t[7] = 0),
      (t[8] = f + d),
      (t[9] = v - m),
      (t[10] = 1 - (s + l)),
      (t[11] = 0),
      (t[12] = a[0]),
      (t[13] = a[1]),
      (t[14] = a[2]),
      (t[15] = 1),
      t
    );
  }
  function R(t, n) {
    return (t[0] = n[12]), (t[1] = n[13]), (t[2] = n[14]), t;
  }
  function z(t, n) {
    var a = n[0],
      r = n[1],
      u = n[2],
      e = n[4],
      o = n[5],
      i = n[6],
      c = n[8],
      h = n[9],
      s = n[10];
    return (
      (t[0] = Math.hypot(a, r, u)),
      (t[1] = Math.hypot(e, o, i)),
      (t[2] = Math.hypot(c, h, s)),
      t
    );
  }
  function P(t, n) {
    var r = new a(3);
    z(r, n);
    var u = 1 / r[0],
      e = 1 / r[1],
      o = 1 / r[2],
      i = n[0] * u,
      c = n[1] * e,
      h = n[2] * o,
      s = n[4] * u,
      M = n[5] * e,
      f = n[6] * o,
      l = n[8] * u,
      v = n[9] * e,
      b = n[10] * o,
      m = i + M + b,
      d = 0;
    return (
      m > 0
        ? ((d = 2 * Math.sqrt(m + 1)),
          (t[3] = 0.25 * d),
          (t[0] = (f - v) / d),
          (t[1] = (l - h) / d),
          (t[2] = (c - s) / d))
        : i > M && i > b
        ? ((d = 2 * Math.sqrt(1 + i - M - b)),
          (t[3] = (f - v) / d),
          (t[0] = 0.25 * d),
          (t[1] = (c + s) / d),
          (t[2] = (l + h) / d))
        : M > b
        ? ((d = 2 * Math.sqrt(1 + M - i - b)),
          (t[3] = (l - h) / d),
          (t[0] = (c + s) / d),
          (t[1] = 0.25 * d),
          (t[2] = (f + v) / d))
        : ((d = 2 * Math.sqrt(1 + b - i - M)),
          (t[3] = (c - s) / d),
          (t[0] = (l + h) / d),
          (t[1] = (f + v) / d),
          (t[2] = 0.25 * d)),
      t
    );
  }
  function j(t, n, a) {
    return (
      (t[0] = n[0] - a[0]),
      (t[1] = n[1] - a[1]),
      (t[2] = n[2] - a[2]),
      (t[3] = n[3] - a[3]),
      (t[4] = n[4] - a[4]),
      (t[5] = n[5] - a[5]),
      (t[6] = n[6] - a[6]),
      (t[7] = n[7] - a[7]),
      (t[8] = n[8] - a[8]),
      (t[9] = n[9] - a[9]),
      (t[10] = n[10] - a[10]),
      (t[11] = n[11] - a[11]),
      (t[12] = n[12] - a[12]),
      (t[13] = n[13] - a[13]),
      (t[14] = n[14] - a[14]),
      (t[15] = n[15] - a[15]),
      t
    );
  }
  var I = A,
    S = j,
    E = Object.freeze({
      create: function () {
        var t = new a(16);
        return (
          a != Float32Array &&
            ((t[1] = 0),
            (t[2] = 0),
            (t[3] = 0),
            (t[4] = 0),
            (t[6] = 0),
            (t[7] = 0),
            (t[8] = 0),
            (t[9] = 0),
            (t[11] = 0),
            (t[12] = 0),
            (t[13] = 0),
            (t[14] = 0)),
          (t[0] = 1),
          (t[5] = 1),
          (t[10] = 1),
          (t[15] = 1),
          t
        );
      },
      clone: function (t) {
        var n = new a(16);
        return (
          (n[0] = t[0]),
          (n[1] = t[1]),
          (n[2] = t[2]),
          (n[3] = t[3]),
          (n[4] = t[4]),
          (n[5] = t[5]),
          (n[6] = t[6]),
          (n[7] = t[7]),
          (n[8] = t[8]),
          (n[9] = t[9]),
          (n[10] = t[10]),
          (n[11] = t[11]),
          (n[12] = t[12]),
          (n[13] = t[13]),
          (n[14] = t[14]),
          (n[15] = t[15]),
          n
        );
      },
      copy: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = n[1]),
          (t[2] = n[2]),
          (t[3] = n[3]),
          (t[4] = n[4]),
          (t[5] = n[5]),
          (t[6] = n[6]),
          (t[7] = n[7]),
          (t[8] = n[8]),
          (t[9] = n[9]),
          (t[10] = n[10]),
          (t[11] = n[11]),
          (t[12] = n[12]),
          (t[13] = n[13]),
          (t[14] = n[14]),
          (t[15] = n[15]),
          t
        );
      },
      fromValues: function (t, n, r, u, e, o, i, c, h, s, M, f, l, v, b, m) {
        var d = new a(16);
        return (
          (d[0] = t),
          (d[1] = n),
          (d[2] = r),
          (d[3] = u),
          (d[4] = e),
          (d[5] = o),
          (d[6] = i),
          (d[7] = c),
          (d[8] = h),
          (d[9] = s),
          (d[10] = M),
          (d[11] = f),
          (d[12] = l),
          (d[13] = v),
          (d[14] = b),
          (d[15] = m),
          d
        );
      },
      set: function (t, n, a, r, u, e, o, i, c, h, s, M, f, l, v, b, m) {
        return (
          (t[0] = n),
          (t[1] = a),
          (t[2] = r),
          (t[3] = u),
          (t[4] = e),
          (t[5] = o),
          (t[6] = i),
          (t[7] = c),
          (t[8] = h),
          (t[9] = s),
          (t[10] = M),
          (t[11] = f),
          (t[12] = l),
          (t[13] = v),
          (t[14] = b),
          (t[15] = m),
          t
        );
      },
      identity: g,
      transpose: function (t, n) {
        if (t === n) {
          var a = n[1],
            r = n[2],
            u = n[3],
            e = n[6],
            o = n[7],
            i = n[11];
          (t[1] = n[4]),
            (t[2] = n[8]),
            (t[3] = n[12]),
            (t[4] = a),
            (t[6] = n[9]),
            (t[7] = n[13]),
            (t[8] = r),
            (t[9] = e),
            (t[11] = n[14]),
            (t[12] = u),
            (t[13] = o),
            (t[14] = i);
        } else
          (t[0] = n[0]),
            (t[1] = n[4]),
            (t[2] = n[8]),
            (t[3] = n[12]),
            (t[4] = n[1]),
            (t[5] = n[5]),
            (t[6] = n[9]),
            (t[7] = n[13]),
            (t[8] = n[2]),
            (t[9] = n[6]),
            (t[10] = n[10]),
            (t[11] = n[14]),
            (t[12] = n[3]),
            (t[13] = n[7]),
            (t[14] = n[11]),
            (t[15] = n[15]);
        return t;
      },
      invert: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = n[6],
          h = n[7],
          s = n[8],
          M = n[9],
          f = n[10],
          l = n[11],
          v = n[12],
          b = n[13],
          m = n[14],
          d = n[15],
          x = a * i - r * o,
          p = a * c - u * o,
          y = a * h - e * o,
          q = r * c - u * i,
          g = r * h - e * i,
          A = u * h - e * c,
          w = s * b - M * v,
          R = s * m - f * v,
          z = s * d - l * v,
          P = M * m - f * b,
          j = M * d - l * b,
          I = f * d - l * m,
          S = x * I - p * j + y * P + q * z - g * R + A * w;
        return S
          ? ((S = 1 / S),
            (t[0] = (i * I - c * j + h * P) * S),
            (t[1] = (u * j - r * I - e * P) * S),
            (t[2] = (b * A - m * g + d * q) * S),
            (t[3] = (f * g - M * A - l * q) * S),
            (t[4] = (c * z - o * I - h * R) * S),
            (t[5] = (a * I - u * z + e * R) * S),
            (t[6] = (m * y - v * A - d * p) * S),
            (t[7] = (s * A - f * y + l * p) * S),
            (t[8] = (o * j - i * z + h * w) * S),
            (t[9] = (r * z - a * j - e * w) * S),
            (t[10] = (v * g - b * y + d * x) * S),
            (t[11] = (M * y - s * g - l * x) * S),
            (t[12] = (i * R - o * P - c * w) * S),
            (t[13] = (a * P - r * R + u * w) * S),
            (t[14] = (b * p - v * q - m * x) * S),
            (t[15] = (s * q - M * p + f * x) * S),
            t)
          : null;
      },
      adjoint: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = n[4],
          i = n[5],
          c = n[6],
          h = n[7],
          s = n[8],
          M = n[9],
          f = n[10],
          l = n[11],
          v = n[12],
          b = n[13],
          m = n[14],
          d = n[15];
        return (
          (t[0] =
            i * (f * d - l * m) - M * (c * d - h * m) + b * (c * l - h * f)),
          (t[1] = -(
            r * (f * d - l * m) -
            M * (u * d - e * m) +
            b * (u * l - e * f)
          )),
          (t[2] =
            r * (c * d - h * m) - i * (u * d - e * m) + b * (u * h - e * c)),
          (t[3] = -(
            r * (c * l - h * f) -
            i * (u * l - e * f) +
            M * (u * h - e * c)
          )),
          (t[4] = -(
            o * (f * d - l * m) -
            s * (c * d - h * m) +
            v * (c * l - h * f)
          )),
          (t[5] =
            a * (f * d - l * m) - s * (u * d - e * m) + v * (u * l - e * f)),
          (t[6] = -(
            a * (c * d - h * m) -
            o * (u * d - e * m) +
            v * (u * h - e * c)
          )),
          (t[7] =
            a * (c * l - h * f) - o * (u * l - e * f) + s * (u * h - e * c)),
          (t[8] =
            o * (M * d - l * b) - s * (i * d - h * b) + v * (i * l - h * M)),
          (t[9] = -(
            a * (M * d - l * b) -
            s * (r * d - e * b) +
            v * (r * l - e * M)
          )),
          (t[10] =
            a * (i * d - h * b) - o * (r * d - e * b) + v * (r * h - e * i)),
          (t[11] = -(
            a * (i * l - h * M) -
            o * (r * l - e * M) +
            s * (r * h - e * i)
          )),
          (t[12] = -(
            o * (M * m - f * b) -
            s * (i * m - c * b) +
            v * (i * f - c * M)
          )),
          (t[13] =
            a * (M * m - f * b) - s * (r * m - u * b) + v * (r * f - u * M)),
          (t[14] = -(
            a * (i * m - c * b) -
            o * (r * m - u * b) +
            v * (r * c - u * i)
          )),
          (t[15] =
            a * (i * f - c * M) - o * (r * f - u * M) + s * (r * c - u * i)),
          t
        );
      },
      determinant: function (t) {
        var n = t[0],
          a = t[1],
          r = t[2],
          u = t[3],
          e = t[4],
          o = t[5],
          i = t[6],
          c = t[7],
          h = t[8],
          s = t[9],
          M = t[10],
          f = t[11],
          l = t[12],
          v = t[13],
          b = t[14],
          m = t[15];
        return (
          (n * o - a * e) * (M * m - f * b) -
          (n * i - r * e) * (s * m - f * v) +
          (n * c - u * e) * (s * b - M * v) +
          (a * i - r * o) * (h * m - f * l) -
          (a * c - u * o) * (h * b - M * l) +
          (r * c - u * i) * (h * v - s * l)
        );
      },
      multiply: A,
      translate: function (t, n, a) {
        var r,
          u,
          e,
          o,
          i,
          c,
          h,
          s,
          M,
          f,
          l,
          v,
          b = a[0],
          m = a[1],
          d = a[2];
        return (
          n === t
            ? ((t[12] = n[0] * b + n[4] * m + n[8] * d + n[12]),
              (t[13] = n[1] * b + n[5] * m + n[9] * d + n[13]),
              (t[14] = n[2] * b + n[6] * m + n[10] * d + n[14]),
              (t[15] = n[3] * b + n[7] * m + n[11] * d + n[15]))
            : ((r = n[0]),
              (u = n[1]),
              (e = n[2]),
              (o = n[3]),
              (i = n[4]),
              (c = n[5]),
              (h = n[6]),
              (s = n[7]),
              (M = n[8]),
              (f = n[9]),
              (l = n[10]),
              (v = n[11]),
              (t[0] = r),
              (t[1] = u),
              (t[2] = e),
              (t[3] = o),
              (t[4] = i),
              (t[5] = c),
              (t[6] = h),
              (t[7] = s),
              (t[8] = M),
              (t[9] = f),
              (t[10] = l),
              (t[11] = v),
              (t[12] = r * b + i * m + M * d + n[12]),
              (t[13] = u * b + c * m + f * d + n[13]),
              (t[14] = e * b + h * m + l * d + n[14]),
              (t[15] = o * b + s * m + v * d + n[15])),
          t
        );
      },
      scale: function (t, n, a) {
        var r = a[0],
          u = a[1],
          e = a[2];
        return (
          (t[0] = n[0] * r),
          (t[1] = n[1] * r),
          (t[2] = n[2] * r),
          (t[3] = n[3] * r),
          (t[4] = n[4] * u),
          (t[5] = n[5] * u),
          (t[6] = n[6] * u),
          (t[7] = n[7] * u),
          (t[8] = n[8] * e),
          (t[9] = n[9] * e),
          (t[10] = n[10] * e),
          (t[11] = n[11] * e),
          (t[12] = n[12]),
          (t[13] = n[13]),
          (t[14] = n[14]),
          (t[15] = n[15]),
          t
        );
      },
      rotate: function (t, a, r, u) {
        var e,
          o,
          i,
          c,
          h,
          s,
          M,
          f,
          l,
          v,
          b,
          m,
          d,
          x,
          p,
          y,
          q,
          g,
          A,
          w,
          R,
          z,
          P,
          j,
          I = u[0],
          S = u[1],
          E = u[2],
          O = Math.hypot(I, S, E);
        return O < n
          ? null
          : ((I *= O = 1 / O),
            (S *= O),
            (E *= O),
            (e = Math.sin(r)),
            (i = 1 - (o = Math.cos(r))),
            (c = a[0]),
            (h = a[1]),
            (s = a[2]),
            (M = a[3]),
            (f = a[4]),
            (l = a[5]),
            (v = a[6]),
            (b = a[7]),
            (m = a[8]),
            (d = a[9]),
            (x = a[10]),
            (p = a[11]),
            (y = I * I * i + o),
            (q = S * I * i + E * e),
            (g = E * I * i - S * e),
            (A = I * S * i - E * e),
            (w = S * S * i + o),
            (R = E * S * i + I * e),
            (z = I * E * i + S * e),
            (P = S * E * i - I * e),
            (j = E * E * i + o),
            (t[0] = c * y + f * q + m * g),
            (t[1] = h * y + l * q + d * g),
            (t[2] = s * y + v * q + x * g),
            (t[3] = M * y + b * q + p * g),
            (t[4] = c * A + f * w + m * R),
            (t[5] = h * A + l * w + d * R),
            (t[6] = s * A + v * w + x * R),
            (t[7] = M * A + b * w + p * R),
            (t[8] = c * z + f * P + m * j),
            (t[9] = h * z + l * P + d * j),
            (t[10] = s * z + v * P + x * j),
            (t[11] = M * z + b * P + p * j),
            a !== t &&
              ((t[12] = a[12]),
              (t[13] = a[13]),
              (t[14] = a[14]),
              (t[15] = a[15])),
            t);
      },
      rotateX: function (t, n, a) {
        var r = Math.sin(a),
          u = Math.cos(a),
          e = n[4],
          o = n[5],
          i = n[6],
          c = n[7],
          h = n[8],
          s = n[9],
          M = n[10],
          f = n[11];
        return (
          n !== t &&
            ((t[0] = n[0]),
            (t[1] = n[1]),
            (t[2] = n[2]),
            (t[3] = n[3]),
            (t[12] = n[12]),
            (t[13] = n[13]),
            (t[14] = n[14]),
            (t[15] = n[15])),
          (t[4] = e * u + h * r),
          (t[5] = o * u + s * r),
          (t[6] = i * u + M * r),
          (t[7] = c * u + f * r),
          (t[8] = h * u - e * r),
          (t[9] = s * u - o * r),
          (t[10] = M * u - i * r),
          (t[11] = f * u - c * r),
          t
        );
      },
      rotateY: function (t, n, a) {
        var r = Math.sin(a),
          u = Math.cos(a),
          e = n[0],
          o = n[1],
          i = n[2],
          c = n[3],
          h = n[8],
          s = n[9],
          M = n[10],
          f = n[11];
        return (
          n !== t &&
            ((t[4] = n[4]),
            (t[5] = n[5]),
            (t[6] = n[6]),
            (t[7] = n[7]),
            (t[12] = n[12]),
            (t[13] = n[13]),
            (t[14] = n[14]),
            (t[15] = n[15])),
          (t[0] = e * u - h * r),
          (t[1] = o * u - s * r),
          (t[2] = i * u - M * r),
          (t[3] = c * u - f * r),
          (t[8] = e * r + h * u),
          (t[9] = o * r + s * u),
          (t[10] = i * r + M * u),
          (t[11] = c * r + f * u),
          t
        );
      },
      rotateZ: function (t, n, a) {
        var r = Math.sin(a),
          u = Math.cos(a),
          e = n[0],
          o = n[1],
          i = n[2],
          c = n[3],
          h = n[4],
          s = n[5],
          M = n[6],
          f = n[7];
        return (
          n !== t &&
            ((t[8] = n[8]),
            (t[9] = n[9]),
            (t[10] = n[10]),
            (t[11] = n[11]),
            (t[12] = n[12]),
            (t[13] = n[13]),
            (t[14] = n[14]),
            (t[15] = n[15])),
          (t[0] = e * u + h * r),
          (t[1] = o * u + s * r),
          (t[2] = i * u + M * r),
          (t[3] = c * u + f * r),
          (t[4] = h * u - e * r),
          (t[5] = s * u - o * r),
          (t[6] = M * u - i * r),
          (t[7] = f * u - c * r),
          t
        );
      },
      fromTranslation: function (t, n) {
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = 1),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[10] = 1),
          (t[11] = 0),
          (t[12] = n[0]),
          (t[13] = n[1]),
          (t[14] = n[2]),
          (t[15] = 1),
          t
        );
      },
      fromScaling: function (t, n) {
        return (
          (t[0] = n[0]),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = n[1]),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[10] = n[2]),
          (t[11] = 0),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 0),
          (t[15] = 1),
          t
        );
      },
      fromRotation: function (t, a, r) {
        var u,
          e,
          o,
          i = r[0],
          c = r[1],
          h = r[2],
          s = Math.hypot(i, c, h);
        return s < n
          ? null
          : ((i *= s = 1 / s),
            (c *= s),
            (h *= s),
            (u = Math.sin(a)),
            (o = 1 - (e = Math.cos(a))),
            (t[0] = i * i * o + e),
            (t[1] = c * i * o + h * u),
            (t[2] = h * i * o - c * u),
            (t[3] = 0),
            (t[4] = i * c * o - h * u),
            (t[5] = c * c * o + e),
            (t[6] = h * c * o + i * u),
            (t[7] = 0),
            (t[8] = i * h * o + c * u),
            (t[9] = c * h * o - i * u),
            (t[10] = h * h * o + e),
            (t[11] = 0),
            (t[12] = 0),
            (t[13] = 0),
            (t[14] = 0),
            (t[15] = 1),
            t);
      },
      fromXRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (
          (t[0] = 1),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = r),
          (t[6] = a),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = -a),
          (t[10] = r),
          (t[11] = 0),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 0),
          (t[15] = 1),
          t
        );
      },
      fromYRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (
          (t[0] = r),
          (t[1] = 0),
          (t[2] = -a),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = 1),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = a),
          (t[9] = 0),
          (t[10] = r),
          (t[11] = 0),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 0),
          (t[15] = 1),
          t
        );
      },
      fromZRotation: function (t, n) {
        var a = Math.sin(n),
          r = Math.cos(n);
        return (
          (t[0] = r),
          (t[1] = a),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = -a),
          (t[5] = r),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[10] = 1),
          (t[11] = 0),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 0),
          (t[15] = 1),
          t
        );
      },
      fromRotationTranslation: w,
      fromQuat2: function (t, n) {
        var r = new a(3),
          u = -n[0],
          e = -n[1],
          o = -n[2],
          i = n[3],
          c = n[4],
          h = n[5],
          s = n[6],
          M = n[7],
          f = u * u + e * e + o * o + i * i;
        return (
          f > 0
            ? ((r[0] = (2 * (c * i + M * u + h * o - s * e)) / f),
              (r[1] = (2 * (h * i + M * e + s * u - c * o)) / f),
              (r[2] = (2 * (s * i + M * o + c * e - h * u)) / f))
            : ((r[0] = 2 * (c * i + M * u + h * o - s * e)),
              (r[1] = 2 * (h * i + M * e + s * u - c * o)),
              (r[2] = 2 * (s * i + M * o + c * e - h * u))),
          w(t, n, r),
          t
        );
      },
      getTranslation: R,
      getScaling: z,
      getRotation: P,
      fromRotationTranslationScale: function (t, n, a, r) {
        var u = n[0],
          e = n[1],
          o = n[2],
          i = n[3],
          c = u + u,
          h = e + e,
          s = o + o,
          M = u * c,
          f = u * h,
          l = u * s,
          v = e * h,
          b = e * s,
          m = o * s,
          d = i * c,
          x = i * h,
          p = i * s,
          y = r[0],
          q = r[1],
          g = r[2];
        return (
          (t[0] = (1 - (v + m)) * y),
          (t[1] = (f + p) * y),
          (t[2] = (l - x) * y),
          (t[3] = 0),
          (t[4] = (f - p) * q),
          (t[5] = (1 - (M + m)) * q),
          (t[6] = (b + d) * q),
          (t[7] = 0),
          (t[8] = (l + x) * g),
          (t[9] = (b - d) * g),
          (t[10] = (1 - (M + v)) * g),
          (t[11] = 0),
          (t[12] = a[0]),
          (t[13] = a[1]),
          (t[14] = a[2]),
          (t[15] = 1),
          t
        );
      },
      fromRotationTranslationScaleOrigin: function (t, n, a, r, u) {
        var e = n[0],
          o = n[1],
          i = n[2],
          c = n[3],
          h = e + e,
          s = o + o,
          M = i + i,
          f = e * h,
          l = e * s,
          v = e * M,
          b = o * s,
          m = o * M,
          d = i * M,
          x = c * h,
          p = c * s,
          y = c * M,
          q = r[0],
          g = r[1],
          A = r[2],
          w = u[0],
          R = u[1],
          z = u[2],
          P = (1 - (b + d)) * q,
          j = (l + y) * q,
          I = (v - p) * q,
          S = (l - y) * g,
          E = (1 - (f + d)) * g,
          O = (m + x) * g,
          T = (v + p) * A,
          D = (m - x) * A,
          F = (1 - (f + b)) * A;
        return (
          (t[0] = P),
          (t[1] = j),
          (t[2] = I),
          (t[3] = 0),
          (t[4] = S),
          (t[5] = E),
          (t[6] = O),
          (t[7] = 0),
          (t[8] = T),
          (t[9] = D),
          (t[10] = F),
          (t[11] = 0),
          (t[12] = a[0] + w - (P * w + S * R + T * z)),
          (t[13] = a[1] + R - (j * w + E * R + D * z)),
          (t[14] = a[2] + z - (I * w + O * R + F * z)),
          (t[15] = 1),
          t
        );
      },
      fromQuat: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = a + a,
          i = r + r,
          c = u + u,
          h = a * o,
          s = r * o,
          M = r * i,
          f = u * o,
          l = u * i,
          v = u * c,
          b = e * o,
          m = e * i,
          d = e * c;
        return (
          (t[0] = 1 - M - v),
          (t[1] = s + d),
          (t[2] = f - m),
          (t[3] = 0),
          (t[4] = s - d),
          (t[5] = 1 - h - v),
          (t[6] = l + b),
          (t[7] = 0),
          (t[8] = f + m),
          (t[9] = l - b),
          (t[10] = 1 - h - M),
          (t[11] = 0),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 0),
          (t[15] = 1),
          t
        );
      },
      frustum: function (t, n, a, r, u, e, o) {
        var i = 1 / (a - n),
          c = 1 / (u - r),
          h = 1 / (e - o);
        return (
          (t[0] = 2 * e * i),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = 2 * e * c),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = (a + n) * i),
          (t[9] = (u + r) * c),
          (t[10] = (o + e) * h),
          (t[11] = -1),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = o * e * 2 * h),
          (t[15] = 0),
          t
        );
      },
      perspective: function (t, n, a, r, u) {
        var e,
          o = 1 / Math.tan(n / 2);
        return (
          (t[0] = o / a),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = o),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[11] = -1),
          (t[12] = 0),
          (t[13] = 0),
          (t[15] = 0),
          null != u && u !== 1 / 0
            ? ((e = 1 / (r - u)),
              (t[10] = (u + r) * e),
              (t[14] = 2 * u * r * e))
            : ((t[10] = -1), (t[14] = -2 * r)),
          t
        );
      },
      perspectiveFromFieldOfView: function (t, n, a, r) {
        var u = Math.tan((n.upDegrees * Math.PI) / 180),
          e = Math.tan((n.downDegrees * Math.PI) / 180),
          o = Math.tan((n.leftDegrees * Math.PI) / 180),
          i = Math.tan((n.rightDegrees * Math.PI) / 180),
          c = 2 / (o + i),
          h = 2 / (u + e);
        return (
          (t[0] = c),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = h),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = -(o - i) * c * 0.5),
          (t[9] = (u - e) * h * 0.5),
          (t[10] = r / (a - r)),
          (t[11] = -1),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = (r * a) / (a - r)),
          (t[15] = 0),
          t
        );
      },
      ortho: function (t, n, a, r, u, e, o) {
        var i = 1 / (n - a),
          c = 1 / (r - u),
          h = 1 / (e - o);
        return (
          (t[0] = -2 * i),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = -2 * c),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[10] = 2 * h),
          (t[11] = 0),
          (t[12] = (n + a) * i),
          (t[13] = (u + r) * c),
          (t[14] = (o + e) * h),
          (t[15] = 1),
          t
        );
      },
      lookAt: function (t, a, r, u) {
        var e,
          o,
          i,
          c,
          h,
          s,
          M,
          f,
          l,
          v,
          b = a[0],
          m = a[1],
          d = a[2],
          x = u[0],
          p = u[1],
          y = u[2],
          q = r[0],
          A = r[1],
          w = r[2];
        return Math.abs(b - q) < n && Math.abs(m - A) < n && Math.abs(d - w) < n
          ? g(t)
          : ((M = b - q),
            (f = m - A),
            (l = d - w),
            (e = p * (l *= v = 1 / Math.hypot(M, f, l)) - y * (f *= v)),
            (o = y * (M *= v) - x * l),
            (i = x * f - p * M),
            (v = Math.hypot(e, o, i))
              ? ((e *= v = 1 / v), (o *= v), (i *= v))
              : ((e = 0), (o = 0), (i = 0)),
            (c = f * i - l * o),
            (h = l * e - M * i),
            (s = M * o - f * e),
            (v = Math.hypot(c, h, s))
              ? ((c *= v = 1 / v), (h *= v), (s *= v))
              : ((c = 0), (h = 0), (s = 0)),
            (t[0] = e),
            (t[1] = c),
            (t[2] = M),
            (t[3] = 0),
            (t[4] = o),
            (t[5] = h),
            (t[6] = f),
            (t[7] = 0),
            (t[8] = i),
            (t[9] = s),
            (t[10] = l),
            (t[11] = 0),
            (t[12] = -(e * b + o * m + i * d)),
            (t[13] = -(c * b + h * m + s * d)),
            (t[14] = -(M * b + f * m + l * d)),
            (t[15] = 1),
            t);
      },
      targetTo: function (t, n, a, r) {
        var u = n[0],
          e = n[1],
          o = n[2],
          i = r[0],
          c = r[1],
          h = r[2],
          s = u - a[0],
          M = e - a[1],
          f = o - a[2],
          l = s * s + M * M + f * f;
        l > 0 && ((s *= l = 1 / Math.sqrt(l)), (M *= l), (f *= l));
        var v = c * f - h * M,
          b = h * s - i * f,
          m = i * M - c * s;
        return (
          (l = v * v + b * b + m * m) > 0 &&
            ((v *= l = 1 / Math.sqrt(l)), (b *= l), (m *= l)),
          (t[0] = v),
          (t[1] = b),
          (t[2] = m),
          (t[3] = 0),
          (t[4] = M * m - f * b),
          (t[5] = f * v - s * m),
          (t[6] = s * b - M * v),
          (t[7] = 0),
          (t[8] = s),
          (t[9] = M),
          (t[10] = f),
          (t[11] = 0),
          (t[12] = u),
          (t[13] = e),
          (t[14] = o),
          (t[15] = 1),
          t
        );
      },
      str: function (t) {
        return (
          "mat4(" +
          t[0] +
          ", " +
          t[1] +
          ", " +
          t[2] +
          ", " +
          t[3] +
          ", " +
          t[4] +
          ", " +
          t[5] +
          ", " +
          t[6] +
          ", " +
          t[7] +
          ", " +
          t[8] +
          ", " +
          t[9] +
          ", " +
          t[10] +
          ", " +
          t[11] +
          ", " +
          t[12] +
          ", " +
          t[13] +
          ", " +
          t[14] +
          ", " +
          t[15] +
          ")"
        );
      },
      frob: function (t) {
        return Math.hypot(
          t[0],
          t[1],
          t[3],
          t[4],
          t[5],
          t[6],
          t[7],
          t[8],
          t[9],
          t[10],
          t[11],
          t[12],
          t[13],
          t[14],
          t[15]
        );
      },
      add: function (t, n, a) {
        return (
          (t[0] = n[0] + a[0]),
          (t[1] = n[1] + a[1]),
          (t[2] = n[2] + a[2]),
          (t[3] = n[3] + a[3]),
          (t[4] = n[4] + a[4]),
          (t[5] = n[5] + a[5]),
          (t[6] = n[6] + a[6]),
          (t[7] = n[7] + a[7]),
          (t[8] = n[8] + a[8]),
          (t[9] = n[9] + a[9]),
          (t[10] = n[10] + a[10]),
          (t[11] = n[11] + a[11]),
          (t[12] = n[12] + a[12]),
          (t[13] = n[13] + a[13]),
          (t[14] = n[14] + a[14]),
          (t[15] = n[15] + a[15]),
          t
        );
      },
      subtract: j,
      multiplyScalar: function (t, n, a) {
        return (
          (t[0] = n[0] * a),
          (t[1] = n[1] * a),
          (t[2] = n[2] * a),
          (t[3] = n[3] * a),
          (t[4] = n[4] * a),
          (t[5] = n[5] * a),
          (t[6] = n[6] * a),
          (t[7] = n[7] * a),
          (t[8] = n[8] * a),
          (t[9] = n[9] * a),
          (t[10] = n[10] * a),
          (t[11] = n[11] * a),
          (t[12] = n[12] * a),
          (t[13] = n[13] * a),
          (t[14] = n[14] * a),
          (t[15] = n[15] * a),
          t
        );
      },
      multiplyScalarAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          (t[3] = n[3] + a[3] * r),
          (t[4] = n[4] + a[4] * r),
          (t[5] = n[5] + a[5] * r),
          (t[6] = n[6] + a[6] * r),
          (t[7] = n[7] + a[7] * r),
          (t[8] = n[8] + a[8] * r),
          (t[9] = n[9] + a[9] * r),
          (t[10] = n[10] + a[10] * r),
          (t[11] = n[11] + a[11] * r),
          (t[12] = n[12] + a[12] * r),
          (t[13] = n[13] + a[13] * r),
          (t[14] = n[14] + a[14] * r),
          (t[15] = n[15] + a[15] * r),
          t
        );
      },
      exactEquals: function (t, n) {
        return (
          t[0] === n[0] &&
          t[1] === n[1] &&
          t[2] === n[2] &&
          t[3] === n[3] &&
          t[4] === n[4] &&
          t[5] === n[5] &&
          t[6] === n[6] &&
          t[7] === n[7] &&
          t[8] === n[8] &&
          t[9] === n[9] &&
          t[10] === n[10] &&
          t[11] === n[11] &&
          t[12] === n[12] &&
          t[13] === n[13] &&
          t[14] === n[14] &&
          t[15] === n[15]
        );
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = t[2],
          o = t[3],
          i = t[4],
          c = t[5],
          h = t[6],
          s = t[7],
          M = t[8],
          f = t[9],
          l = t[10],
          v = t[11],
          b = t[12],
          m = t[13],
          d = t[14],
          x = t[15],
          p = a[0],
          y = a[1],
          q = a[2],
          g = a[3],
          A = a[4],
          w = a[5],
          R = a[6],
          z = a[7],
          P = a[8],
          j = a[9],
          I = a[10],
          S = a[11],
          E = a[12],
          O = a[13],
          T = a[14],
          D = a[15];
        return (
          Math.abs(r - p) <= n * Math.max(1, Math.abs(r), Math.abs(p)) &&
          Math.abs(u - y) <= n * Math.max(1, Math.abs(u), Math.abs(y)) &&
          Math.abs(e - q) <= n * Math.max(1, Math.abs(e), Math.abs(q)) &&
          Math.abs(o - g) <= n * Math.max(1, Math.abs(o), Math.abs(g)) &&
          Math.abs(i - A) <= n * Math.max(1, Math.abs(i), Math.abs(A)) &&
          Math.abs(c - w) <= n * Math.max(1, Math.abs(c), Math.abs(w)) &&
          Math.abs(h - R) <= n * Math.max(1, Math.abs(h), Math.abs(R)) &&
          Math.abs(s - z) <= n * Math.max(1, Math.abs(s), Math.abs(z)) &&
          Math.abs(M - P) <= n * Math.max(1, Math.abs(M), Math.abs(P)) &&
          Math.abs(f - j) <= n * Math.max(1, Math.abs(f), Math.abs(j)) &&
          Math.abs(l - I) <= n * Math.max(1, Math.abs(l), Math.abs(I)) &&
          Math.abs(v - S) <= n * Math.max(1, Math.abs(v), Math.abs(S)) &&
          Math.abs(b - E) <= n * Math.max(1, Math.abs(b), Math.abs(E)) &&
          Math.abs(m - O) <= n * Math.max(1, Math.abs(m), Math.abs(O)) &&
          Math.abs(d - T) <= n * Math.max(1, Math.abs(d), Math.abs(T)) &&
          Math.abs(x - D) <= n * Math.max(1, Math.abs(x), Math.abs(D))
        );
      },
      mul: I,
      sub: S,
    });
  function O() {
    var t = new a(3);
    return a != Float32Array && ((t[0] = 0), (t[1] = 0), (t[2] = 0)), t;
  }
  function T(t) {
    var n = t[0],
      a = t[1],
      r = t[2];
    return Math.hypot(n, a, r);
  }
  function D(t, n, r) {
    var u = new a(3);
    return (u[0] = t), (u[1] = n), (u[2] = r), u;
  }
  function F(t, n, a) {
    return (t[0] = n[0] - a[0]), (t[1] = n[1] - a[1]), (t[2] = n[2] - a[2]), t;
  }
  function L(t, n, a) {
    return (t[0] = n[0] * a[0]), (t[1] = n[1] * a[1]), (t[2] = n[2] * a[2]), t;
  }
  function V(t, n, a) {
    return (t[0] = n[0] / a[0]), (t[1] = n[1] / a[1]), (t[2] = n[2] / a[2]), t;
  }
  function Q(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1],
      u = n[2] - t[2];
    return Math.hypot(a, r, u);
  }
  function Y(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1],
      u = n[2] - t[2];
    return a * a + r * r + u * u;
  }
  function X(t) {
    var n = t[0],
      a = t[1],
      r = t[2];
    return n * n + a * a + r * r;
  }
  function Z(t, n) {
    var a = n[0],
      r = n[1],
      u = n[2],
      e = a * a + r * r + u * u;
    return (
      e > 0 && (e = 1 / Math.sqrt(e)),
      (t[0] = n[0] * e),
      (t[1] = n[1] * e),
      (t[2] = n[2] * e),
      t
    );
  }
  function _(t, n) {
    return t[0] * n[0] + t[1] * n[1] + t[2] * n[2];
  }
  function B(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = a[0],
      i = a[1],
      c = a[2];
    return (
      (t[0] = u * c - e * i), (t[1] = e * o - r * c), (t[2] = r * i - u * o), t
    );
  }
  var N,
    k = F,
    U = L,
    W = V,
    C = Q,
    G = Y,
    H = T,
    J = X,
    K =
      ((N = O()),
      function (t, n, a, r, u, e) {
        var o, i;
        for (
          n || (n = 3),
            a || (a = 0),
            i = r ? Math.min(r * n + a, t.length) : t.length,
            o = a;
          o < i;
          o += n
        )
          (N[0] = t[o]),
            (N[1] = t[o + 1]),
            (N[2] = t[o + 2]),
            u(N, N, e),
            (t[o] = N[0]),
            (t[o + 1] = N[1]),
            (t[o + 2] = N[2]);
        return t;
      }),
    $ = Object.freeze({
      create: O,
      clone: function (t) {
        var n = new a(3);
        return (n[0] = t[0]), (n[1] = t[1]), (n[2] = t[2]), n;
      },
      length: T,
      fromValues: D,
      copy: function (t, n) {
        return (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), t;
      },
      set: function (t, n, a, r) {
        return (t[0] = n), (t[1] = a), (t[2] = r), t;
      },
      add: function (t, n, a) {
        return (
          (t[0] = n[0] + a[0]), (t[1] = n[1] + a[1]), (t[2] = n[2] + a[2]), t
        );
      },
      subtract: F,
      multiply: L,
      divide: V,
      ceil: function (t, n) {
        return (
          (t[0] = Math.ceil(n[0])),
          (t[1] = Math.ceil(n[1])),
          (t[2] = Math.ceil(n[2])),
          t
        );
      },
      floor: function (t, n) {
        return (
          (t[0] = Math.floor(n[0])),
          (t[1] = Math.floor(n[1])),
          (t[2] = Math.floor(n[2])),
          t
        );
      },
      min: function (t, n, a) {
        return (
          (t[0] = Math.min(n[0], a[0])),
          (t[1] = Math.min(n[1], a[1])),
          (t[2] = Math.min(n[2], a[2])),
          t
        );
      },
      max: function (t, n, a) {
        return (
          (t[0] = Math.max(n[0], a[0])),
          (t[1] = Math.max(n[1], a[1])),
          (t[2] = Math.max(n[2], a[2])),
          t
        );
      },
      round: function (t, n) {
        return (
          (t[0] = Math.round(n[0])),
          (t[1] = Math.round(n[1])),
          (t[2] = Math.round(n[2])),
          t
        );
      },
      scale: function (t, n, a) {
        return (t[0] = n[0] * a), (t[1] = n[1] * a), (t[2] = n[2] * a), t;
      },
      scaleAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          t
        );
      },
      distance: Q,
      squaredDistance: Y,
      squaredLength: X,
      negate: function (t, n) {
        return (t[0] = -n[0]), (t[1] = -n[1]), (t[2] = -n[2]), t;
      },
      inverse: function (t, n) {
        return (t[0] = 1 / n[0]), (t[1] = 1 / n[1]), (t[2] = 1 / n[2]), t;
      },
      normalize: Z,
      dot: _,
      cross: B,
      lerp: function (t, n, a, r) {
        var u = n[0],
          e = n[1],
          o = n[2];
        return (
          (t[0] = u + r * (a[0] - u)),
          (t[1] = e + r * (a[1] - e)),
          (t[2] = o + r * (a[2] - o)),
          t
        );
      },
      hermite: function (t, n, a, r, u, e) {
        var o = e * e,
          i = o * (2 * e - 3) + 1,
          c = o * (e - 2) + e,
          h = o * (e - 1),
          s = o * (3 - 2 * e);
        return (
          (t[0] = n[0] * i + a[0] * c + r[0] * h + u[0] * s),
          (t[1] = n[1] * i + a[1] * c + r[1] * h + u[1] * s),
          (t[2] = n[2] * i + a[2] * c + r[2] * h + u[2] * s),
          t
        );
      },
      bezier: function (t, n, a, r, u, e) {
        var o = 1 - e,
          i = o * o,
          c = e * e,
          h = i * o,
          s = 3 * e * i,
          M = 3 * c * o,
          f = c * e;
        return (
          (t[0] = n[0] * h + a[0] * s + r[0] * M + u[0] * f),
          (t[1] = n[1] * h + a[1] * s + r[1] * M + u[1] * f),
          (t[2] = n[2] * h + a[2] * s + r[2] * M + u[2] * f),
          t
        );
      },
      random: function (t, n) {
        n = n || 1;
        var a = 2 * r() * Math.PI,
          u = 2 * r() - 1,
          e = Math.sqrt(1 - u * u) * n;
        return (
          (t[0] = Math.cos(a) * e), (t[1] = Math.sin(a) * e), (t[2] = u * n), t
        );
      },
      transformMat4: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = a[3] * r + a[7] * u + a[11] * e + a[15];
        return (
          (o = o || 1),
          (t[0] = (a[0] * r + a[4] * u + a[8] * e + a[12]) / o),
          (t[1] = (a[1] * r + a[5] * u + a[9] * e + a[13]) / o),
          (t[2] = (a[2] * r + a[6] * u + a[10] * e + a[14]) / o),
          t
        );
      },
      transformMat3: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2];
        return (
          (t[0] = r * a[0] + u * a[3] + e * a[6]),
          (t[1] = r * a[1] + u * a[4] + e * a[7]),
          (t[2] = r * a[2] + u * a[5] + e * a[8]),
          t
        );
      },
      transformQuat: function (t, n, a) {
        var r = a[0],
          u = a[1],
          e = a[2],
          o = a[3],
          i = n[0],
          c = n[1],
          h = n[2],
          s = u * h - e * c,
          M = e * i - r * h,
          f = r * c - u * i,
          l = u * f - e * M,
          v = e * s - r * f,
          b = r * M - u * s,
          m = 2 * o;
        return (
          (s *= m),
          (M *= m),
          (f *= m),
          (l *= 2),
          (v *= 2),
          (b *= 2),
          (t[0] = i + s + l),
          (t[1] = c + M + v),
          (t[2] = h + f + b),
          t
        );
      },
      rotateX: function (t, n, a, r) {
        var u = [],
          e = [];
        return (
          (u[0] = n[0] - a[0]),
          (u[1] = n[1] - a[1]),
          (u[2] = n[2] - a[2]),
          (e[0] = u[0]),
          (e[1] = u[1] * Math.cos(r) - u[2] * Math.sin(r)),
          (e[2] = u[1] * Math.sin(r) + u[2] * Math.cos(r)),
          (t[0] = e[0] + a[0]),
          (t[1] = e[1] + a[1]),
          (t[2] = e[2] + a[2]),
          t
        );
      },
      rotateY: function (t, n, a, r) {
        var u = [],
          e = [];
        return (
          (u[0] = n[0] - a[0]),
          (u[1] = n[1] - a[1]),
          (u[2] = n[2] - a[2]),
          (e[0] = u[2] * Math.sin(r) + u[0] * Math.cos(r)),
          (e[1] = u[1]),
          (e[2] = u[2] * Math.cos(r) - u[0] * Math.sin(r)),
          (t[0] = e[0] + a[0]),
          (t[1] = e[1] + a[1]),
          (t[2] = e[2] + a[2]),
          t
        );
      },
      rotateZ: function (t, n, a, r) {
        var u = [],
          e = [];
        return (
          (u[0] = n[0] - a[0]),
          (u[1] = n[1] - a[1]),
          (u[2] = n[2] - a[2]),
          (e[0] = u[0] * Math.cos(r) - u[1] * Math.sin(r)),
          (e[1] = u[0] * Math.sin(r) + u[1] * Math.cos(r)),
          (e[2] = u[2]),
          (t[0] = e[0] + a[0]),
          (t[1] = e[1] + a[1]),
          (t[2] = e[2] + a[2]),
          t
        );
      },
      angle: function (t, n) {
        var a = D(t[0], t[1], t[2]),
          r = D(n[0], n[1], n[2]);
        Z(a, a), Z(r, r);
        var u = _(a, r);
        return u > 1 ? 0 : u < -1 ? Math.PI : Math.acos(u);
      },
      zero: function (t) {
        return (t[0] = 0), (t[1] = 0), (t[2] = 0), t;
      },
      str: function (t) {
        return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
      },
      exactEquals: function (t, n) {
        return t[0] === n[0] && t[1] === n[1] && t[2] === n[2];
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = t[2],
          o = a[0],
          i = a[1],
          c = a[2];
        return (
          Math.abs(r - o) <= n * Math.max(1, Math.abs(r), Math.abs(o)) &&
          Math.abs(u - i) <= n * Math.max(1, Math.abs(u), Math.abs(i)) &&
          Math.abs(e - c) <= n * Math.max(1, Math.abs(e), Math.abs(c))
        );
      },
      sub: k,
      mul: U,
      div: W,
      dist: C,
      sqrDist: G,
      len: H,
      sqrLen: J,
      forEach: K,
    });
  function tt() {
    var t = new a(4);
    return (
      a != Float32Array && ((t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 0)), t
    );
  }
  function nt(t) {
    var n = new a(4);
    return (n[0] = t[0]), (n[1] = t[1]), (n[2] = t[2]), (n[3] = t[3]), n;
  }
  function at(t, n, r, u) {
    var e = new a(4);
    return (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = u), e;
  }
  function rt(t, n) {
    return (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), (t[3] = n[3]), t;
  }
  function ut(t, n, a, r, u) {
    return (t[0] = n), (t[1] = a), (t[2] = r), (t[3] = u), t;
  }
  function et(t, n, a) {
    return (
      (t[0] = n[0] + a[0]),
      (t[1] = n[1] + a[1]),
      (t[2] = n[2] + a[2]),
      (t[3] = n[3] + a[3]),
      t
    );
  }
  function ot(t, n, a) {
    return (
      (t[0] = n[0] - a[0]),
      (t[1] = n[1] - a[1]),
      (t[2] = n[2] - a[2]),
      (t[3] = n[3] - a[3]),
      t
    );
  }
  function it(t, n, a) {
    return (
      (t[0] = n[0] * a[0]),
      (t[1] = n[1] * a[1]),
      (t[2] = n[2] * a[2]),
      (t[3] = n[3] * a[3]),
      t
    );
  }
  function ct(t, n, a) {
    return (
      (t[0] = n[0] / a[0]),
      (t[1] = n[1] / a[1]),
      (t[2] = n[2] / a[2]),
      (t[3] = n[3] / a[3]),
      t
    );
  }
  function ht(t, n, a) {
    return (
      (t[0] = n[0] * a),
      (t[1] = n[1] * a),
      (t[2] = n[2] * a),
      (t[3] = n[3] * a),
      t
    );
  }
  function st(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1],
      u = n[2] - t[2],
      e = n[3] - t[3];
    return Math.hypot(a, r, u, e);
  }
  function Mt(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1],
      u = n[2] - t[2],
      e = n[3] - t[3];
    return a * a + r * r + u * u + e * e;
  }
  function ft(t) {
    var n = t[0],
      a = t[1],
      r = t[2],
      u = t[3];
    return Math.hypot(n, a, r, u);
  }
  function lt(t) {
    var n = t[0],
      a = t[1],
      r = t[2],
      u = t[3];
    return n * n + a * a + r * r + u * u;
  }
  function vt(t, n) {
    var a = n[0],
      r = n[1],
      u = n[2],
      e = n[3],
      o = a * a + r * r + u * u + e * e;
    return (
      o > 0 && (o = 1 / Math.sqrt(o)),
      (t[0] = a * o),
      (t[1] = r * o),
      (t[2] = u * o),
      (t[3] = e * o),
      t
    );
  }
  function bt(t, n) {
    return t[0] * n[0] + t[1] * n[1] + t[2] * n[2] + t[3] * n[3];
  }
  function mt(t, n, a, r) {
    var u = n[0],
      e = n[1],
      o = n[2],
      i = n[3];
    return (
      (t[0] = u + r * (a[0] - u)),
      (t[1] = e + r * (a[1] - e)),
      (t[2] = o + r * (a[2] - o)),
      (t[3] = i + r * (a[3] - i)),
      t
    );
  }
  function dt(t, n) {
    return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3];
  }
  function xt(t, a) {
    var r = t[0],
      u = t[1],
      e = t[2],
      o = t[3],
      i = a[0],
      c = a[1],
      h = a[2],
      s = a[3];
    return (
      Math.abs(r - i) <= n * Math.max(1, Math.abs(r), Math.abs(i)) &&
      Math.abs(u - c) <= n * Math.max(1, Math.abs(u), Math.abs(c)) &&
      Math.abs(e - h) <= n * Math.max(1, Math.abs(e), Math.abs(h)) &&
      Math.abs(o - s) <= n * Math.max(1, Math.abs(o), Math.abs(s))
    );
  }
  var pt = ot,
    yt = it,
    qt = ct,
    gt = st,
    At = Mt,
    wt = ft,
    Rt = lt,
    zt = (function () {
      var t = tt();
      return function (n, a, r, u, e, o) {
        var i, c;
        for (
          a || (a = 4),
            r || (r = 0),
            c = u ? Math.min(u * a + r, n.length) : n.length,
            i = r;
          i < c;
          i += a
        )
          (t[0] = n[i]),
            (t[1] = n[i + 1]),
            (t[2] = n[i + 2]),
            (t[3] = n[i + 3]),
            e(t, t, o),
            (n[i] = t[0]),
            (n[i + 1] = t[1]),
            (n[i + 2] = t[2]),
            (n[i + 3] = t[3]);
        return n;
      };
    })(),
    Pt = Object.freeze({
      create: tt,
      clone: nt,
      fromValues: at,
      copy: rt,
      set: ut,
      add: et,
      subtract: ot,
      multiply: it,
      divide: ct,
      ceil: function (t, n) {
        return (
          (t[0] = Math.ceil(n[0])),
          (t[1] = Math.ceil(n[1])),
          (t[2] = Math.ceil(n[2])),
          (t[3] = Math.ceil(n[3])),
          t
        );
      },
      floor: function (t, n) {
        return (
          (t[0] = Math.floor(n[0])),
          (t[1] = Math.floor(n[1])),
          (t[2] = Math.floor(n[2])),
          (t[3] = Math.floor(n[3])),
          t
        );
      },
      min: function (t, n, a) {
        return (
          (t[0] = Math.min(n[0], a[0])),
          (t[1] = Math.min(n[1], a[1])),
          (t[2] = Math.min(n[2], a[2])),
          (t[3] = Math.min(n[3], a[3])),
          t
        );
      },
      max: function (t, n, a) {
        return (
          (t[0] = Math.max(n[0], a[0])),
          (t[1] = Math.max(n[1], a[1])),
          (t[2] = Math.max(n[2], a[2])),
          (t[3] = Math.max(n[3], a[3])),
          t
        );
      },
      round: function (t, n) {
        return (
          (t[0] = Math.round(n[0])),
          (t[1] = Math.round(n[1])),
          (t[2] = Math.round(n[2])),
          (t[3] = Math.round(n[3])),
          t
        );
      },
      scale: ht,
      scaleAndAdd: function (t, n, a, r) {
        return (
          (t[0] = n[0] + a[0] * r),
          (t[1] = n[1] + a[1] * r),
          (t[2] = n[2] + a[2] * r),
          (t[3] = n[3] + a[3] * r),
          t
        );
      },
      distance: st,
      squaredDistance: Mt,
      length: ft,
      squaredLength: lt,
      negate: function (t, n) {
        return (
          (t[0] = -n[0]), (t[1] = -n[1]), (t[2] = -n[2]), (t[3] = -n[3]), t
        );
      },
      inverse: function (t, n) {
        return (
          (t[0] = 1 / n[0]),
          (t[1] = 1 / n[1]),
          (t[2] = 1 / n[2]),
          (t[3] = 1 / n[3]),
          t
        );
      },
      normalize: vt,
      dot: bt,
      cross: function (t, n, a, r) {
        var u = a[0] * r[1] - a[1] * r[0],
          e = a[0] * r[2] - a[2] * r[0],
          o = a[0] * r[3] - a[3] * r[0],
          i = a[1] * r[2] - a[2] * r[1],
          c = a[1] * r[3] - a[3] * r[1],
          h = a[2] * r[3] - a[3] * r[2],
          s = n[0],
          M = n[1],
          f = n[2],
          l = n[3];
        return (
          (t[0] = M * h - f * c + l * i),
          (t[1] = -s * h + f * o - l * e),
          (t[2] = s * c - M * o + l * u),
          (t[3] = -s * i + M * e - f * u),
          t
        );
      },
      lerp: mt,
      random: function (t, n) {
        var a, u, e, o, i, c;
        n = n || 1;
        do {
          i = (a = 2 * r() - 1) * a + (u = 2 * r() - 1) * u;
        } while (i >= 1);
        do {
          c = (e = 2 * r() - 1) * e + (o = 2 * r() - 1) * o;
        } while (c >= 1);
        var h = Math.sqrt((1 - i) / c);
        return (
          (t[0] = n * a),
          (t[1] = n * u),
          (t[2] = n * e * h),
          (t[3] = n * o * h),
          t
        );
      },
      transformMat4: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = n[3];
        return (
          (t[0] = a[0] * r + a[4] * u + a[8] * e + a[12] * o),
          (t[1] = a[1] * r + a[5] * u + a[9] * e + a[13] * o),
          (t[2] = a[2] * r + a[6] * u + a[10] * e + a[14] * o),
          (t[3] = a[3] * r + a[7] * u + a[11] * e + a[15] * o),
          t
        );
      },
      transformQuat: function (t, n, a) {
        var r = n[0],
          u = n[1],
          e = n[2],
          o = a[0],
          i = a[1],
          c = a[2],
          h = a[3],
          s = h * r + i * e - c * u,
          M = h * u + c * r - o * e,
          f = h * e + o * u - i * r,
          l = -o * r - i * u - c * e;
        return (
          (t[0] = s * h + l * -o + M * -c - f * -i),
          (t[1] = M * h + l * -i + f * -o - s * -c),
          (t[2] = f * h + l * -c + s * -i - M * -o),
          (t[3] = n[3]),
          t
        );
      },
      zero: function (t) {
        return (t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 0), t;
      },
      str: function (t) {
        return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
      },
      exactEquals: dt,
      equals: xt,
      sub: pt,
      mul: yt,
      div: qt,
      dist: gt,
      sqrDist: At,
      len: wt,
      sqrLen: Rt,
      forEach: zt,
    });
  function jt() {
    var t = new a(4);
    return (
      a != Float32Array && ((t[0] = 0), (t[1] = 0), (t[2] = 0)), (t[3] = 1), t
    );
  }
  function It(t, n, a) {
    a *= 0.5;
    var r = Math.sin(a);
    return (
      (t[0] = r * n[0]),
      (t[1] = r * n[1]),
      (t[2] = r * n[2]),
      (t[3] = Math.cos(a)),
      t
    );
  }
  function St(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = a[0],
      c = a[1],
      h = a[2],
      s = a[3];
    return (
      (t[0] = r * s + o * i + u * h - e * c),
      (t[1] = u * s + o * c + e * i - r * h),
      (t[2] = e * s + o * h + r * c - u * i),
      (t[3] = o * s - r * i - u * c - e * h),
      t
    );
  }
  function Et(t, n, a) {
    a *= 0.5;
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = Math.sin(a),
      c = Math.cos(a);
    return (
      (t[0] = r * c + o * i),
      (t[1] = u * c + e * i),
      (t[2] = e * c - u * i),
      (t[3] = o * c - r * i),
      t
    );
  }
  function Ot(t, n, a) {
    a *= 0.5;
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = Math.sin(a),
      c = Math.cos(a);
    return (
      (t[0] = r * c - e * i),
      (t[1] = u * c + o * i),
      (t[2] = e * c + r * i),
      (t[3] = o * c - u * i),
      t
    );
  }
  function Tt(t, n, a) {
    a *= 0.5;
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = Math.sin(a),
      c = Math.cos(a);
    return (
      (t[0] = r * c + u * i),
      (t[1] = u * c - r * i),
      (t[2] = e * c + o * i),
      (t[3] = o * c - e * i),
      t
    );
  }
  function Dt(t, n) {
    var a = n[0],
      r = n[1],
      u = n[2],
      e = n[3],
      o = Math.sqrt(a * a + r * r + u * u),
      i = Math.exp(e),
      c = o > 0 ? (i * Math.sin(o)) / o : 0;
    return (
      (t[0] = a * c),
      (t[1] = r * c),
      (t[2] = u * c),
      (t[3] = i * Math.cos(o)),
      t
    );
  }
  function Ft(t, n) {
    var a = n[0],
      r = n[1],
      u = n[2],
      e = n[3],
      o = Math.sqrt(a * a + r * r + u * u),
      i = o > 0 ? Math.atan2(o, e) / o : 0;
    return (
      (t[0] = a * i),
      (t[1] = r * i),
      (t[2] = u * i),
      (t[3] = 0.5 * Math.log(a * a + r * r + u * u + e * e)),
      t
    );
  }
  function Lt(t, a, r, u) {
    var e,
      o,
      i,
      c,
      h,
      s = a[0],
      M = a[1],
      f = a[2],
      l = a[3],
      v = r[0],
      b = r[1],
      m = r[2],
      d = r[3];
    return (
      (o = s * v + M * b + f * m + l * d) < 0 &&
        ((o = -o), (v = -v), (b = -b), (m = -m), (d = -d)),
      1 - o > n
        ? ((e = Math.acos(o)),
          (i = Math.sin(e)),
          (c = Math.sin((1 - u) * e) / i),
          (h = Math.sin(u * e) / i))
        : ((c = 1 - u), (h = u)),
      (t[0] = c * s + h * v),
      (t[1] = c * M + h * b),
      (t[2] = c * f + h * m),
      (t[3] = c * l + h * d),
      t
    );
  }
  function Vt(t, n) {
    var a,
      r = n[0] + n[4] + n[8];
    if (r > 0)
      (a = Math.sqrt(r + 1)),
        (t[3] = 0.5 * a),
        (a = 0.5 / a),
        (t[0] = (n[5] - n[7]) * a),
        (t[1] = (n[6] - n[2]) * a),
        (t[2] = (n[1] - n[3]) * a);
    else {
      var u = 0;
      n[4] > n[0] && (u = 1), n[8] > n[3 * u + u] && (u = 2);
      var e = (u + 1) % 3,
        o = (u + 2) % 3;
      (a = Math.sqrt(n[3 * u + u] - n[3 * e + e] - n[3 * o + o] + 1)),
        (t[u] = 0.5 * a),
        (a = 0.5 / a),
        (t[3] = (n[3 * e + o] - n[3 * o + e]) * a),
        (t[e] = (n[3 * e + u] + n[3 * u + e]) * a),
        (t[o] = (n[3 * o + u] + n[3 * u + o]) * a);
    }
    return t;
  }
  var Qt,
    Yt,
    Xt,
    Zt,
    _t,
    Bt,
    Nt = nt,
    kt = at,
    Ut = rt,
    Wt = ut,
    Ct = et,
    Gt = St,
    Ht = ht,
    Jt = bt,
    Kt = mt,
    $t = ft,
    tn = $t,
    nn = lt,
    an = nn,
    rn = vt,
    un = dt,
    en = xt,
    on =
      ((Qt = O()),
      (Yt = D(1, 0, 0)),
      (Xt = D(0, 1, 0)),
      function (t, n, a) {
        var r = _(n, a);
        return r < -0.999999
          ? (B(Qt, Yt, n),
            H(Qt) < 1e-6 && B(Qt, Xt, n),
            Z(Qt, Qt),
            It(t, Qt, Math.PI),
            t)
          : r > 0.999999
          ? ((t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 1), t)
          : (B(Qt, n, a),
            (t[0] = Qt[0]),
            (t[1] = Qt[1]),
            (t[2] = Qt[2]),
            (t[3] = 1 + r),
            rn(t, t));
      }),
    cn =
      ((Zt = jt()),
      (_t = jt()),
      function (t, n, a, r, u, e) {
        return (
          Lt(Zt, n, u, e), Lt(_t, a, r, e), Lt(t, Zt, _t, 2 * e * (1 - e)), t
        );
      }),
    hn =
      ((Bt = m()),
      function (t, n, a, r) {
        return (
          (Bt[0] = a[0]),
          (Bt[3] = a[1]),
          (Bt[6] = a[2]),
          (Bt[1] = r[0]),
          (Bt[4] = r[1]),
          (Bt[7] = r[2]),
          (Bt[2] = -n[0]),
          (Bt[5] = -n[1]),
          (Bt[8] = -n[2]),
          rn(t, Vt(t, Bt))
        );
      }),
    sn = Object.freeze({
      create: jt,
      identity: function (t) {
        return (t[0] = 0), (t[1] = 0), (t[2] = 0), (t[3] = 1), t;
      },
      setAxisAngle: It,
      getAxisAngle: function (t, a) {
        var r = 2 * Math.acos(a[3]),
          u = Math.sin(r / 2);
        return (
          u > n
            ? ((t[0] = a[0] / u), (t[1] = a[1] / u), (t[2] = a[2] / u))
            : ((t[0] = 1), (t[1] = 0), (t[2] = 0)),
          r
        );
      },
      getAngle: function (t, n) {
        var a = Jt(t, n);
        return Math.acos(2 * a * a - 1);
      },
      multiply: St,
      rotateX: Et,
      rotateY: Ot,
      rotateZ: Tt,
      calculateW: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2];
        return (
          (t[0] = a),
          (t[1] = r),
          (t[2] = u),
          (t[3] = Math.sqrt(Math.abs(1 - a * a - r * r - u * u))),
          t
        );
      },
      exp: Dt,
      ln: Ft,
      pow: function (t, n, a) {
        return Ft(t, n), Ht(t, t, a), Dt(t, t), t;
      },
      slerp: Lt,
      random: function (t) {
        var n = r(),
          a = r(),
          u = r(),
          e = Math.sqrt(1 - n),
          o = Math.sqrt(n);
        return (
          (t[0] = e * Math.sin(2 * Math.PI * a)),
          (t[1] = e * Math.cos(2 * Math.PI * a)),
          (t[2] = o * Math.sin(2 * Math.PI * u)),
          (t[3] = o * Math.cos(2 * Math.PI * u)),
          t
        );
      },
      invert: function (t, n) {
        var a = n[0],
          r = n[1],
          u = n[2],
          e = n[3],
          o = a * a + r * r + u * u + e * e,
          i = o ? 1 / o : 0;
        return (
          (t[0] = -a * i), (t[1] = -r * i), (t[2] = -u * i), (t[3] = e * i), t
        );
      },
      conjugate: function (t, n) {
        return (t[0] = -n[0]), (t[1] = -n[1]), (t[2] = -n[2]), (t[3] = n[3]), t;
      },
      fromMat3: Vt,
      fromEuler: function (t, n, a, r) {
        var u = (0.5 * Math.PI) / 180;
        (n *= u), (a *= u), (r *= u);
        var e = Math.sin(n),
          o = Math.cos(n),
          i = Math.sin(a),
          c = Math.cos(a),
          h = Math.sin(r),
          s = Math.cos(r);
        return (
          (t[0] = e * c * s - o * i * h),
          (t[1] = o * i * s + e * c * h),
          (t[2] = o * c * h - e * i * s),
          (t[3] = o * c * s + e * i * h),
          t
        );
      },
      str: function (t) {
        return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
      },
      clone: Nt,
      fromValues: kt,
      copy: Ut,
      set: Wt,
      add: Ct,
      mul: Gt,
      scale: Ht,
      dot: Jt,
      lerp: Kt,
      length: $t,
      len: tn,
      squaredLength: nn,
      sqrLen: an,
      normalize: rn,
      exactEquals: un,
      equals: en,
      rotationTo: on,
      sqlerp: cn,
      setAxes: hn,
    });
  function Mn(t, n, a) {
    var r = 0.5 * a[0],
      u = 0.5 * a[1],
      e = 0.5 * a[2],
      o = n[0],
      i = n[1],
      c = n[2],
      h = n[3];
    return (
      (t[0] = o),
      (t[1] = i),
      (t[2] = c),
      (t[3] = h),
      (t[4] = r * h + u * c - e * i),
      (t[5] = u * h + e * o - r * c),
      (t[6] = e * h + r * i - u * o),
      (t[7] = -r * o - u * i - e * c),
      t
    );
  }
  function fn(t, n) {
    return (
      (t[0] = n[0]),
      (t[1] = n[1]),
      (t[2] = n[2]),
      (t[3] = n[3]),
      (t[4] = n[4]),
      (t[5] = n[5]),
      (t[6] = n[6]),
      (t[7] = n[7]),
      t
    );
  }
  var ln = Ut;
  var vn = Ut;
  function bn(t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = a[4],
      c = a[5],
      h = a[6],
      s = a[7],
      M = n[4],
      f = n[5],
      l = n[6],
      v = n[7],
      b = a[0],
      m = a[1],
      d = a[2],
      x = a[3];
    return (
      (t[0] = r * x + o * b + u * d - e * m),
      (t[1] = u * x + o * m + e * b - r * d),
      (t[2] = e * x + o * d + r * m - u * b),
      (t[3] = o * x - r * b - u * m - e * d),
      (t[4] = r * s + o * i + u * h - e * c + M * x + v * b + f * d - l * m),
      (t[5] = u * s + o * c + e * i - r * h + f * x + v * m + l * b - M * d),
      (t[6] = e * s + o * h + r * c - u * i + l * x + v * d + M * m - f * b),
      (t[7] = o * s - r * i - u * c - e * h + v * x - M * b - f * m - l * d),
      t
    );
  }
  var mn = bn;
  var dn = Jt;
  var xn = $t,
    pn = xn,
    yn = nn,
    qn = yn;
  var gn = Object.freeze({
    create: function () {
      var t = new a(8);
      return (
        a != Float32Array &&
          ((t[0] = 0),
          (t[1] = 0),
          (t[2] = 0),
          (t[4] = 0),
          (t[5] = 0),
          (t[6] = 0),
          (t[7] = 0)),
        (t[3] = 1),
        t
      );
    },
    clone: function (t) {
      var n = new a(8);
      return (
        (n[0] = t[0]),
        (n[1] = t[1]),
        (n[2] = t[2]),
        (n[3] = t[3]),
        (n[4] = t[4]),
        (n[5] = t[5]),
        (n[6] = t[6]),
        (n[7] = t[7]),
        n
      );
    },
    fromValues: function (t, n, r, u, e, o, i, c) {
      var h = new a(8);
      return (
        (h[0] = t),
        (h[1] = n),
        (h[2] = r),
        (h[3] = u),
        (h[4] = e),
        (h[5] = o),
        (h[6] = i),
        (h[7] = c),
        h
      );
    },
    fromRotationTranslationValues: function (t, n, r, u, e, o, i) {
      var c = new a(8);
      (c[0] = t), (c[1] = n), (c[2] = r), (c[3] = u);
      var h = 0.5 * e,
        s = 0.5 * o,
        M = 0.5 * i;
      return (
        (c[4] = h * u + s * r - M * n),
        (c[5] = s * u + M * t - h * r),
        (c[6] = M * u + h * n - s * t),
        (c[7] = -h * t - s * n - M * r),
        c
      );
    },
    fromRotationTranslation: Mn,
    fromTranslation: function (t, n) {
      return (
        (t[0] = 0),
        (t[1] = 0),
        (t[2] = 0),
        (t[3] = 1),
        (t[4] = 0.5 * n[0]),
        (t[5] = 0.5 * n[1]),
        (t[6] = 0.5 * n[2]),
        (t[7] = 0),
        t
      );
    },
    fromRotation: function (t, n) {
      return (
        (t[0] = n[0]),
        (t[1] = n[1]),
        (t[2] = n[2]),
        (t[3] = n[3]),
        (t[4] = 0),
        (t[5] = 0),
        (t[6] = 0),
        (t[7] = 0),
        t
      );
    },
    fromMat4: function (t, n) {
      var r = jt();
      P(r, n);
      var u = new a(3);
      return R(u, n), Mn(t, r, u), t;
    },
    copy: fn,
    identity: function (t) {
      return (
        (t[0] = 0),
        (t[1] = 0),
        (t[2] = 0),
        (t[3] = 1),
        (t[4] = 0),
        (t[5] = 0),
        (t[6] = 0),
        (t[7] = 0),
        t
      );
    },
    set: function (t, n, a, r, u, e, o, i, c) {
      return (
        (t[0] = n),
        (t[1] = a),
        (t[2] = r),
        (t[3] = u),
        (t[4] = e),
        (t[5] = o),
        (t[6] = i),
        (t[7] = c),
        t
      );
    },
    getReal: ln,
    getDual: function (t, n) {
      return (t[0] = n[4]), (t[1] = n[5]), (t[2] = n[6]), (t[3] = n[7]), t;
    },
    setReal: vn,
    setDual: function (t, n) {
      return (t[4] = n[0]), (t[5] = n[1]), (t[6] = n[2]), (t[7] = n[3]), t;
    },
    getTranslation: function (t, n) {
      var a = n[4],
        r = n[5],
        u = n[6],
        e = n[7],
        o = -n[0],
        i = -n[1],
        c = -n[2],
        h = n[3];
      return (
        (t[0] = 2 * (a * h + e * o + r * c - u * i)),
        (t[1] = 2 * (r * h + e * i + u * o - a * c)),
        (t[2] = 2 * (u * h + e * c + a * i - r * o)),
        t
      );
    },
    translate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = 0.5 * a[0],
        c = 0.5 * a[1],
        h = 0.5 * a[2],
        s = n[4],
        M = n[5],
        f = n[6],
        l = n[7];
      return (
        (t[0] = r),
        (t[1] = u),
        (t[2] = e),
        (t[3] = o),
        (t[4] = o * i + u * h - e * c + s),
        (t[5] = o * c + e * i - r * h + M),
        (t[6] = o * h + r * c - u * i + f),
        (t[7] = -r * i - u * c - e * h + l),
        t
      );
    },
    rotateX: function (t, n, a) {
      var r = -n[0],
        u = -n[1],
        e = -n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = i * o + s * r + c * e - h * u,
        f = c * o + s * u + h * r - i * e,
        l = h * o + s * e + i * u - c * r,
        v = s * o - i * r - c * u - h * e;
      return (
        Et(t, n, a),
        (r = t[0]),
        (u = t[1]),
        (e = t[2]),
        (o = t[3]),
        (t[4] = M * o + v * r + f * e - l * u),
        (t[5] = f * o + v * u + l * r - M * e),
        (t[6] = l * o + v * e + M * u - f * r),
        (t[7] = v * o - M * r - f * u - l * e),
        t
      );
    },
    rotateY: function (t, n, a) {
      var r = -n[0],
        u = -n[1],
        e = -n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = i * o + s * r + c * e - h * u,
        f = c * o + s * u + h * r - i * e,
        l = h * o + s * e + i * u - c * r,
        v = s * o - i * r - c * u - h * e;
      return (
        Ot(t, n, a),
        (r = t[0]),
        (u = t[1]),
        (e = t[2]),
        (o = t[3]),
        (t[4] = M * o + v * r + f * e - l * u),
        (t[5] = f * o + v * u + l * r - M * e),
        (t[6] = l * o + v * e + M * u - f * r),
        (t[7] = v * o - M * r - f * u - l * e),
        t
      );
    },
    rotateZ: function (t, n, a) {
      var r = -n[0],
        u = -n[1],
        e = -n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = i * o + s * r + c * e - h * u,
        f = c * o + s * u + h * r - i * e,
        l = h * o + s * e + i * u - c * r,
        v = s * o - i * r - c * u - h * e;
      return (
        Tt(t, n, a),
        (r = t[0]),
        (u = t[1]),
        (e = t[2]),
        (o = t[3]),
        (t[4] = M * o + v * r + f * e - l * u),
        (t[5] = f * o + v * u + l * r - M * e),
        (t[6] = l * o + v * e + M * u - f * r),
        (t[7] = v * o - M * r - f * u - l * e),
        t
      );
    },
    rotateByQuatAppend: function (t, n, a) {
      var r = a[0],
        u = a[1],
        e = a[2],
        o = a[3],
        i = n[0],
        c = n[1],
        h = n[2],
        s = n[3];
      return (
        (t[0] = i * o + s * r + c * e - h * u),
        (t[1] = c * o + s * u + h * r - i * e),
        (t[2] = h * o + s * e + i * u - c * r),
        (t[3] = s * o - i * r - c * u - h * e),
        (i = n[4]),
        (c = n[5]),
        (h = n[6]),
        (s = n[7]),
        (t[4] = i * o + s * r + c * e - h * u),
        (t[5] = c * o + s * u + h * r - i * e),
        (t[6] = h * o + s * e + i * u - c * r),
        (t[7] = s * o - i * r - c * u - h * e),
        t
      );
    },
    rotateByQuatPrepend: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = a[0],
        c = a[1],
        h = a[2],
        s = a[3];
      return (
        (t[0] = r * s + o * i + u * h - e * c),
        (t[1] = u * s + o * c + e * i - r * h),
        (t[2] = e * s + o * h + r * c - u * i),
        (t[3] = o * s - r * i - u * c - e * h),
        (i = a[4]),
        (c = a[5]),
        (h = a[6]),
        (s = a[7]),
        (t[4] = r * s + o * i + u * h - e * c),
        (t[5] = u * s + o * c + e * i - r * h),
        (t[6] = e * s + o * h + r * c - u * i),
        (t[7] = o * s - r * i - u * c - e * h),
        t
      );
    },
    rotateAroundAxis: function (t, a, r, u) {
      if (Math.abs(u) < n) return fn(t, a);
      var e = Math.hypot(r[0], r[1], r[2]);
      u *= 0.5;
      var o = Math.sin(u),
        i = (o * r[0]) / e,
        c = (o * r[1]) / e,
        h = (o * r[2]) / e,
        s = Math.cos(u),
        M = a[0],
        f = a[1],
        l = a[2],
        v = a[3];
      (t[0] = M * s + v * i + f * h - l * c),
        (t[1] = f * s + v * c + l * i - M * h),
        (t[2] = l * s + v * h + M * c - f * i),
        (t[3] = v * s - M * i - f * c - l * h);
      var b = a[4],
        m = a[5],
        d = a[6],
        x = a[7];
      return (
        (t[4] = b * s + x * i + m * h - d * c),
        (t[5] = m * s + x * c + d * i - b * h),
        (t[6] = d * s + x * h + b * c - m * i),
        (t[7] = x * s - b * i - m * c - d * h),
        t
      );
    },
    add: function (t, n, a) {
      return (
        (t[0] = n[0] + a[0]),
        (t[1] = n[1] + a[1]),
        (t[2] = n[2] + a[2]),
        (t[3] = n[3] + a[3]),
        (t[4] = n[4] + a[4]),
        (t[5] = n[5] + a[5]),
        (t[6] = n[6] + a[6]),
        (t[7] = n[7] + a[7]),
        t
      );
    },
    multiply: bn,
    mul: mn,
    scale: function (t, n, a) {
      return (
        (t[0] = n[0] * a),
        (t[1] = n[1] * a),
        (t[2] = n[2] * a),
        (t[3] = n[3] * a),
        (t[4] = n[4] * a),
        (t[5] = n[5] * a),
        (t[6] = n[6] * a),
        (t[7] = n[7] * a),
        t
      );
    },
    dot: dn,
    lerp: function (t, n, a, r) {
      var u = 1 - r;
      return (
        dn(n, a) < 0 && (r = -r),
        (t[0] = n[0] * u + a[0] * r),
        (t[1] = n[1] * u + a[1] * r),
        (t[2] = n[2] * u + a[2] * r),
        (t[3] = n[3] * u + a[3] * r),
        (t[4] = n[4] * u + a[4] * r),
        (t[5] = n[5] * u + a[5] * r),
        (t[6] = n[6] * u + a[6] * r),
        (t[7] = n[7] * u + a[7] * r),
        t
      );
    },
    invert: function (t, n) {
      var a = yn(n);
      return (
        (t[0] = -n[0] / a),
        (t[1] = -n[1] / a),
        (t[2] = -n[2] / a),
        (t[3] = n[3] / a),
        (t[4] = -n[4] / a),
        (t[5] = -n[5] / a),
        (t[6] = -n[6] / a),
        (t[7] = n[7] / a),
        t
      );
    },
    conjugate: function (t, n) {
      return (
        (t[0] = -n[0]),
        (t[1] = -n[1]),
        (t[2] = -n[2]),
        (t[3] = n[3]),
        (t[4] = -n[4]),
        (t[5] = -n[5]),
        (t[6] = -n[6]),
        (t[7] = n[7]),
        t
      );
    },
    length: xn,
    len: pn,
    squaredLength: yn,
    sqrLen: qn,
    normalize: function (t, n) {
      var a = yn(n);
      if (a > 0) {
        a = Math.sqrt(a);
        var r = n[0] / a,
          u = n[1] / a,
          e = n[2] / a,
          o = n[3] / a,
          i = n[4],
          c = n[5],
          h = n[6],
          s = n[7],
          M = r * i + u * c + e * h + o * s;
        (t[0] = r),
          (t[1] = u),
          (t[2] = e),
          (t[3] = o),
          (t[4] = (i - r * M) / a),
          (t[5] = (c - u * M) / a),
          (t[6] = (h - e * M) / a),
          (t[7] = (s - o * M) / a);
      }
      return t;
    },
    str: function (t) {
      return (
        "quat2(" +
        t[0] +
        ", " +
        t[1] +
        ", " +
        t[2] +
        ", " +
        t[3] +
        ", " +
        t[4] +
        ", " +
        t[5] +
        ", " +
        t[6] +
        ", " +
        t[7] +
        ")"
      );
    },
    exactEquals: function (t, n) {
      return (
        t[0] === n[0] &&
        t[1] === n[1] &&
        t[2] === n[2] &&
        t[3] === n[3] &&
        t[4] === n[4] &&
        t[5] === n[5] &&
        t[6] === n[6] &&
        t[7] === n[7]
      );
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = t[3],
        i = t[4],
        c = t[5],
        h = t[6],
        s = t[7],
        M = a[0],
        f = a[1],
        l = a[2],
        v = a[3],
        b = a[4],
        m = a[5],
        d = a[6],
        x = a[7];
      return (
        Math.abs(r - M) <= n * Math.max(1, Math.abs(r), Math.abs(M)) &&
        Math.abs(u - f) <= n * Math.max(1, Math.abs(u), Math.abs(f)) &&
        Math.abs(e - l) <= n * Math.max(1, Math.abs(e), Math.abs(l)) &&
        Math.abs(o - v) <= n * Math.max(1, Math.abs(o), Math.abs(v)) &&
        Math.abs(i - b) <= n * Math.max(1, Math.abs(i), Math.abs(b)) &&
        Math.abs(c - m) <= n * Math.max(1, Math.abs(c), Math.abs(m)) &&
        Math.abs(h - d) <= n * Math.max(1, Math.abs(h), Math.abs(d)) &&
        Math.abs(s - x) <= n * Math.max(1, Math.abs(s), Math.abs(x))
      );
    },
  });
  function An() {
    var t = new a(2);
    return a != Float32Array && ((t[0] = 0), (t[1] = 0)), t;
  }
  function wn(t, n, a) {
    return (t[0] = n[0] - a[0]), (t[1] = n[1] - a[1]), t;
  }
  function Rn(t, n, a) {
    return (t[0] = n[0] * a[0]), (t[1] = n[1] * a[1]), t;
  }
  function zn(t, n, a) {
    return (t[0] = n[0] / a[0]), (t[1] = n[1] / a[1]), t;
  }
  function Pn(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1];
    return Math.hypot(a, r);
  }
  function jn(t, n) {
    var a = n[0] - t[0],
      r = n[1] - t[1];
    return a * a + r * r;
  }
  function In(t) {
    var n = t[0],
      a = t[1];
    return Math.hypot(n, a);
  }
  function Sn(t) {
    var n = t[0],
      a = t[1];
    return n * n + a * a;
  }
  var En = In,
    On = wn,
    Tn = Rn,
    Dn = zn,
    Fn = Pn,
    Ln = jn,
    Vn = Sn,
    Qn = (function () {
      var t = An();
      return function (n, a, r, u, e, o) {
        var i, c;
        for (
          a || (a = 2),
            r || (r = 0),
            c = u ? Math.min(u * a + r, n.length) : n.length,
            i = r;
          i < c;
          i += a
        )
          (t[0] = n[i]),
            (t[1] = n[i + 1]),
            e(t, t, o),
            (n[i] = t[0]),
            (n[i + 1] = t[1]);
        return n;
      };
    })(),
    Yn = Object.freeze({
      create: An,
      clone: function (t) {
        var n = new a(2);
        return (n[0] = t[0]), (n[1] = t[1]), n;
      },
      fromValues: function (t, n) {
        var r = new a(2);
        return (r[0] = t), (r[1] = n), r;
      },
      copy: function (t, n) {
        return (t[0] = n[0]), (t[1] = n[1]), t;
      },
      set: function (t, n, a) {
        return (t[0] = n), (t[1] = a), t;
      },
      add: function (t, n, a) {
        return (t[0] = n[0] + a[0]), (t[1] = n[1] + a[1]), t;
      },
      subtract: wn,
      multiply: Rn,
      divide: zn,
      ceil: function (t, n) {
        return (t[0] = Math.ceil(n[0])), (t[1] = Math.ceil(n[1])), t;
      },
      floor: function (t, n) {
        return (t[0] = Math.floor(n[0])), (t[1] = Math.floor(n[1])), t;
      },
      min: function (t, n, a) {
        return (t[0] = Math.min(n[0], a[0])), (t[1] = Math.min(n[1], a[1])), t;
      },
      max: function (t, n, a) {
        return (t[0] = Math.max(n[0], a[0])), (t[1] = Math.max(n[1], a[1])), t;
      },
      round: function (t, n) {
        return (t[0] = Math.round(n[0])), (t[1] = Math.round(n[1])), t;
      },
      scale: function (t, n, a) {
        return (t[0] = n[0] * a), (t[1] = n[1] * a), t;
      },
      scaleAndAdd: function (t, n, a, r) {
        return (t[0] = n[0] + a[0] * r), (t[1] = n[1] + a[1] * r), t;
      },
      distance: Pn,
      squaredDistance: jn,
      length: In,
      squaredLength: Sn,
      negate: function (t, n) {
        return (t[0] = -n[0]), (t[1] = -n[1]), t;
      },
      inverse: function (t, n) {
        return (t[0] = 1 / n[0]), (t[1] = 1 / n[1]), t;
      },
      normalize: function (t, n) {
        var a = n[0],
          r = n[1],
          u = a * a + r * r;
        return (
          u > 0 && (u = 1 / Math.sqrt(u)),
          (t[0] = n[0] * u),
          (t[1] = n[1] * u),
          t
        );
      },
      dot: function (t, n) {
        return t[0] * n[0] + t[1] * n[1];
      },
      cross: function (t, n, a) {
        var r = n[0] * a[1] - n[1] * a[0];
        return (t[0] = t[1] = 0), (t[2] = r), t;
      },
      lerp: function (t, n, a, r) {
        var u = n[0],
          e = n[1];
        return (t[0] = u + r * (a[0] - u)), (t[1] = e + r * (a[1] - e)), t;
      },
      random: function (t, n) {
        n = n || 1;
        var a = 2 * r() * Math.PI;
        return (t[0] = Math.cos(a) * n), (t[1] = Math.sin(a) * n), t;
      },
      transformMat2: function (t, n, a) {
        var r = n[0],
          u = n[1];
        return (t[0] = a[0] * r + a[2] * u), (t[1] = a[1] * r + a[3] * u), t;
      },
      transformMat2d: function (t, n, a) {
        var r = n[0],
          u = n[1];
        return (
          (t[0] = a[0] * r + a[2] * u + a[4]),
          (t[1] = a[1] * r + a[3] * u + a[5]),
          t
        );
      },
      transformMat3: function (t, n, a) {
        var r = n[0],
          u = n[1];
        return (
          (t[0] = a[0] * r + a[3] * u + a[6]),
          (t[1] = a[1] * r + a[4] * u + a[7]),
          t
        );
      },
      transformMat4: function (t, n, a) {
        var r = n[0],
          u = n[1];
        return (
          (t[0] = a[0] * r + a[4] * u + a[12]),
          (t[1] = a[1] * r + a[5] * u + a[13]),
          t
        );
      },
      rotate: function (t, n, a, r) {
        var u = n[0] - a[0],
          e = n[1] - a[1],
          o = Math.sin(r),
          i = Math.cos(r);
        return (t[0] = u * i - e * o + a[0]), (t[1] = u * o + e * i + a[1]), t;
      },
      angle: function (t, n) {
        var a = t[0],
          r = t[1],
          u = n[0],
          e = n[1],
          o = a * a + r * r;
        o > 0 && (o = 1 / Math.sqrt(o));
        var i = u * u + e * e;
        i > 0 && (i = 1 / Math.sqrt(i));
        var c = (a * u + r * e) * o * i;
        return c > 1 ? 0 : c < -1 ? Math.PI : Math.acos(c);
      },
      zero: function (t) {
        return (t[0] = 0), (t[1] = 0), t;
      },
      str: function (t) {
        return "vec2(" + t[0] + ", " + t[1] + ")";
      },
      exactEquals: function (t, n) {
        return t[0] === n[0] && t[1] === n[1];
      },
      equals: function (t, a) {
        var r = t[0],
          u = t[1],
          e = a[0],
          o = a[1];
        return (
          Math.abs(r - e) <= n * Math.max(1, Math.abs(r), Math.abs(e)) &&
          Math.abs(u - o) <= n * Math.max(1, Math.abs(u), Math.abs(o))
        );
      },
      len: En,
      sub: On,
      mul: Tn,
      div: Dn,
      dist: Fn,
      sqrDist: Ln,
      sqrLen: Vn,
      forEach: Qn,
    });
  (t.glMatrix = e),
    (t.mat2 = s),
    (t.mat2d = b),
    (t.mat3 = q),
    (t.mat4 = E),
    (t.quat = sn),
    (t.quat2 = gn),
    (t.vec2 = Yn),
    (t.vec3 = $),
    (t.vec4 = Pt),
    Object.defineProperty(t, "__esModule", { value: !0 });
});

// ["glMatrix", "mat2", "mat2d", "mat3", "mat4", "quat", "quat2", "vec2", "vec3", "vec4"]
window.glMatrix = glMatrix;
window.mat2 = glMatrix.mat2;
window.mat2d = glMatrix.mat2d;
window.mat3 = glMatrix.mat3;
window.mat4 = glMatrix.mat4;
window.quat = glMatrix.quat;
window.quat2 = glMatrix.quat2;
window.vec2 = glMatrix.vec2;
window.vec3 = glMatrix.vec3;
window.vec4 = glMatrix.vec4;

var CABLES = CABLES || {};
CABLES.build = {
  timestamp: 1682341866190,
  created: "2023-04-24T13:11:06.190Z",
  git: {
    branch: "master",
    commit: "a8912bdbb85d335fb4b58c228bba4c8be8498ebd",
    date: "2023-04-24T13:08:49.000Z",
    message: "fix duplicate ids",
  },
};
if (!CABLES.exportedPatches) CABLES.exportedPatches = {};
CABLES.exportedPatches["tb4p2x"] = {
  settings: { opExample: [], licence: "none", isPublic: false },
  ops: [
    {
      objName: "Ops.Gl.MainLoop",
      id: "0",
      uiAttribs: {},
      portsIn: [
        { name: "FPS Limit", value: 10 },
        { name: "Reduce FPS not focussed", value: true },
        { name: "Reduce FPS loading", value: false },
        { name: "Clear", value: true },
        { name: "ClearAlpha", value: false },
        { name: "Fullscreen Button", value: false },
        { name: "Active", value: true },
        { name: "Hires Displays", value: true },
        { name: "Pixel Unit index", value: 0 },
        { name: "Pixel Unit", value: "Display" },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "render", portOut: "trigger", objIn: "44", objOut: "0" },
          ],
        },
        { name: "width", value: 1682 },
        { name: "height", value: 1238 },
      ],
    },
    {
      objName: "Ops.Gl.Textures.CopyTexture",
      id: "1",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "Texture" },
        { name: "Alpha Mask", value: 0 },
        { name: "use original size", value: true },
        { name: "width", value: 1682 },
        { name: "height", value: 1238 },
        { name: "filter index", value: 1 },
        { name: "filter", value: "nearest" },
        { name: "wrap index", value: 0 },
        { name: "wrap", value: "clamp to edge" },
        { name: "HDR", value: false },
        { name: "Alpha Mask Source index", value: 0 },
        { name: "Alpha Mask Source", value: "A" },
        { name: "Convert Greyscale index", value: 0 },
        { name: "Convert Greyscale", value: "Off" },
        { name: "Invert R", value: false },
        { name: "Invert G", value: false },
        { name: "Invert B", value: false },
        { name: "Invert A", value: false },
      ],
      portsOut: [
        { name: "trigger", value: 0 },
        {
          name: "texture_out",
          links: [
            {
              portIn: "Image",
              portOut: "texture_out",
              objIn: "5",
              objOut: "1",
            },
          ],
        },
        { name: "Aspect Ratio", value: 1.358642972536349 },
      ],
    },
    {
      objName: "Ops.Sequence",
      id: "2",
      uiAttribs: {},
      portsIn: [
        { name: "exe" },
        { name: "Clean up connections", value: 0 },
        { name: "exe 0", value: 0 },
        { name: "exe 1", value: 0 },
        { name: "exe 2", value: 0 },
        { name: "exe 3", value: 0 },
        { name: "exe 4", value: 0 },
        { name: "exe 5", value: 0 },
        { name: "exe 6", value: 0 },
        { name: "exe 7", value: 0 },
        { name: "exe 8", value: 0 },
        { name: "exe 9", value: 0 },
        { name: "exe 10", value: 0 },
        { name: "exe 11", value: 0 },
        { name: "exe 12", value: 0 },
        { name: "exe 13", value: 0 },
        { name: "exe 14", value: 0 },
      ],
      portsOut: [
        { name: "trigger 0", value: 0 },
        {
          name: "trigger 1",
          links: [
            { portIn: "Render", portOut: "trigger 1", objIn: "6", objOut: "2" },
          ],
        },
        {
          name: "trigger 2",
          links: [
            { portIn: "exe", portOut: "trigger 2", objIn: "12", objOut: "2" },
          ],
        },
        { name: "trigger 3", value: 0 },
        { name: "trigger 4", value: 0 },
        { name: "trigger 5", value: 0 },
        { name: "trigger 6", value: 0 },
        { name: "trigger 7", value: 0 },
        {
          name: "trigger 8",
          links: [
            { portIn: "exe", portOut: "trigger 8", objIn: "38", objOut: "2" },
          ],
        },
        { name: "trigger 9", value: 0 },
        { name: "trigger 10", value: 0 },
        { name: "trigger 11", value: 0 },
        { name: "trigger 12", value: 0 },
        {
          name: "trigger 13",
          links: [
            {
              portIn: "Render",
              portOut: "trigger 13",
              objIn: "26",
              objOut: "2",
            },
          ],
        },
        { name: "trigger 14", value: 0 },
        {
          name: "trigger 15",
          links: [
            {
              portIn: "render",
              portOut: "trigger 15",
              objIn: "9",
              objOut: "2",
            },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.DrawImage_v3",
      id: "3",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "blendMode index", value: 0 },
        { name: "blendMode", value: "normal" },
        { name: "amount", value: 1 },
        { name: "Image" },
        { name: "Premultiplied", value: false },
        { name: "Alpha Mask", value: false },
        { name: "removeAlphaSrc", value: false },
        { name: "Mask", value: 0 },
        { name: "Mask Src index", value: 1 },
        { name: "Mask Src", value: "alpha channel" },
        { name: "Invert alpha channel", value: false },
        { name: "Aspect Ratio", value: true },
        { name: "Stretch Axis index", value: 0 },
        { name: "Stretch Axis", value: "X" },
        { name: "Position", value: 0.6 },
        { name: "Crop", value: true },
        { name: "flip x", value: false },
        { name: "flip y", value: false },
        { name: "Transform", value: true },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "Position X", value: 0 },
        { name: "Position Y", value: 0 },
        { name: "Rotation", value: 0 },
        { name: "Clip Repeat", value: false },
      ],
      portsOut: [{ name: "trigger", value: 0 }],
    },
    {
      objName: "Ops.Gl.TextureEffects.DrawImage_v3",
      id: "4",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "blendMode index", value: 0 },
        { name: "blendMode", value: "normal" },
        { name: "amount", value: 1 },
        { name: "Image" },
        { name: "Premultiplied", value: false },
        { name: "Alpha Mask", value: false },
        { name: "removeAlphaSrc", value: false },
        { name: "Mask", value: 0 },
        { name: "Mask Src index", value: 1 },
        { name: "Mask Src", value: "alpha channel" },
        { name: "Invert alpha channel", value: false },
        { name: "Aspect Ratio", value: false },
        { name: "Stretch Axis index", value: 0 },
        { name: "Stretch Axis", value: "X" },
        { name: "Position", value: 0 },
        { name: "Crop", value: false },
        { name: "flip x", value: false },
        { name: "flip y", value: false },
        { name: "Transform", value: false },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "Position X", value: 0 },
        { name: "Position Y", value: 0 },
        { name: "Rotation", value: 0 },
        { name: "Clip Repeat", value: false },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "Execute", portOut: "trigger", objIn: "29", objOut: "4" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.DrawImage_v3",
      id: "5",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "blendMode index", value: 0 },
        { name: "blendMode", value: "normal" },
        { name: "amount", value: 0.998 },
        { name: "Image" },
        { name: "Premultiplied", value: true },
        { name: "Alpha Mask", value: true },
        { name: "removeAlphaSrc", value: true },
        { name: "Mask", value: 0 },
        { name: "Mask Src index", value: 1 },
        { name: "Mask Src", value: "alpha channel" },
        { name: "Invert alpha channel", value: false },
        { name: "Aspect Ratio", value: false },
        { name: "Stretch Axis index", value: 0 },
        { name: "Stretch Axis", value: "X" },
        { name: "Position", value: 0 },
        { name: "Crop", value: false },
        { name: "flip x", value: false },
        { name: "flip y", value: false },
        { name: "Transform", value: false },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "Position X", value: 0 },
        { name: "Position Y", value: 0 },
        { name: "Rotation", value: 0 },
        { name: "Clip Repeat", value: false },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "render", portOut: "trigger", objIn: "8", objOut: "5" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.ImageCompose_v3",
      id: "6",
      uiAttribs: {},
      portsIn: [
        { name: "Render" },
        { name: "Base Texture", value: 0 },
        { name: "Size index", value: 0 },
        { name: "Size", value: "Auto" },
        { name: "Width", value: 640 },
        { name: "Height", value: 480 },
        { name: "Filter index", value: 1 },
        { name: "Filter", value: "nearest" },
        { name: "Wrap index", value: 1 },
        { name: "Wrap", value: "clamp to edge" },
        { name: "Pixel Format index", value: 0 },
        { name: "Pixel Format", value: "RGBA 8bit ubyte" },
        { name: "R", value: 0 },
        { name: "G", value: 0 },
        { name: "B", value: 0 },
        { name: "A", value: 0 },
      ],
      portsOut: [
        {
          name: "Next",
          links: [
            { portIn: "render", portOut: "Next", objIn: "3", objOut: "6" },
          ],
        },
        {
          name: "texture_out",
          links: [
            {
              portIn: "Image",
              portOut: "texture_out",
              objIn: "4",
              objOut: "6",
            },
          ],
        },
        { name: "Aspect Ratio", value: 1.358642972536349 },
        { name: "Texture Width", value: 1682 },
        { name: "Texture Height", value: 1238 },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.ImageCompose_v3",
      id: "7",
      uiAttribs: {},
      portsIn: [
        { name: "Render" },
        { name: "Base Texture", value: 0 },
        { name: "Size index", value: 0 },
        { name: "Size", value: "Auto" },
        { name: "Width", value: 640 },
        { name: "Height", value: 480 },
        { name: "Filter index", value: 1 },
        { name: "Filter", value: "nearest" },
        { name: "Wrap index", value: 1 },
        { name: "Wrap", value: "repeat" },
        { name: "Pixel Format index", value: 0 },
        { name: "Pixel Format", value: "RGBA 8bit ubyte" },
        { name: "R", value: 0 },
        { name: "G", value: 0 },
        { name: "B", value: 0 },
        { name: "A", value: 0 },
      ],
      portsOut: [
        {
          name: "Next",
          links: [
            { portIn: "render", portOut: "Next", objIn: "4", objOut: "7" },
          ],
        },
        {
          name: "texture_out",
          links: [
            {
              portIn: "Texture",
              portOut: "texture_out",
              objIn: "1",
              objOut: "7",
            },
            {
              portIn: "Image",
              portOut: "texture_out",
              objIn: "25",
              objOut: "7",
            },
            {
              portIn: "Image",
              portOut: "texture_out",
              objIn: "27",
              objOut: "7",
            },
          ],
        },
        { name: "Aspect Ratio", value: 1.358642972536349 },
        { name: "Texture Width", value: 1682 },
        { name: "Texture Height", value: 1238 },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.PixelDisplacement_v4",
      id: "8",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "displaceTex" },
        { name: "Blend Mode index", value: 0 },
        { name: "Blend Mode", value: "normal" },
        { name: "Amount", value: 1 },
        { name: "amount X" },
        { name: "amount Y" },
        { name: "Wrap index", value: 0 },
        { name: "Wrap", value: "Mirror" },
        { name: "Input index", value: 0 },
        { name: "Input", value: "RedGreen" },
        { name: "Zero Displace index", value: 0 },
        { name: "Zero Displace", value: "Black" },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "render", portOut: "trigger", objIn: "15", objOut: "8" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.Meshes.FullscreenRectangle",
      id: "9",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "Scale index", value: 0 },
        { name: "Scale", value: "Stretch" },
        { name: "Flip Y", value: false },
        { name: "Flip X", value: false },
        { name: "Texture" },
      ],
      portsOut: [{ name: "trigger", value: 0 }],
    },
    {
      objName: "Ops.Math.Delta",
      id: "10",
      uiAttribs: {},
      portsIn: [
        { name: "Value" },
        { name: "Change Always", value: false },
        { name: "Reset", value: null },
      ],
      portsOut: [
        {
          name: "Delta",
          links: [
            { portIn: "value", portOut: "Delta", objIn: "18", objOut: "10" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Ui.VizNumber",
      id: "11",
      uiAttribs: {},
      portsIn: [{ name: "Number", value: 0.07 }],
      portsOut: [
        {
          name: "Result",
          links: [
            { portIn: "new max", portOut: "Result", objIn: "19", objOut: "11" },
            { portIn: "new max", portOut: "Result", objIn: "18", objOut: "11" },
            { portIn: "Value", portOut: "Result", objIn: "41", objOut: "11" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Sequence",
      id: "12",
      uiAttribs: {},
      portsIn: [
        { name: "exe" },
        { name: "Clean up connections", value: 0 },
        { name: "exe 0", value: null },
        { name: "exe 1", value: 0 },
        { name: "exe 2", value: 0 },
        { name: "exe 3", value: 0 },
        { name: "exe 4", value: 0 },
        { name: "exe 5", value: 0 },
        { name: "exe 6", value: 0 },
        { name: "exe 7", value: 0 },
        { name: "exe 8", value: 0 },
        { name: "exe 9", value: 0 },
        { name: "exe 10", value: 0 },
        { name: "exe 11", value: 0 },
        { name: "exe 12", value: 0 },
        { name: "exe 13", value: 0 },
        { name: "exe 14", value: 0 },
      ],
      portsOut: [
        {
          name: "trigger 0",
          links: [
            {
              portIn: "Render",
              portOut: "trigger 0",
              objIn: "7",
              objOut: "12",
            },
          ],
        },
        { name: "trigger 1", value: 0 },
        {
          name: "trigger 2",
          links: [
            {
              portIn: "render",
              portOut: "trigger 2",
              objIn: "1",
              objOut: "12",
            },
          ],
        },
        {
          name: "trigger 3",
          links: [
            {
              portIn: "Render",
              portOut: "trigger 3",
              objIn: "24",
              objOut: "12",
            },
          ],
        },
        { name: "trigger 4", value: 0 },
        { name: "trigger 5", value: 0 },
        { name: "trigger 6", value: 0 },
        { name: "trigger 7", value: 0 },
        { name: "trigger 8", value: 0 },
        { name: "trigger 9", value: 0 },
        { name: "trigger 10", value: 0 },
        { name: "trigger 11", value: 0 },
        { name: "trigger 12", value: 0 },
        { name: "trigger 13", value: 0 },
        { name: "trigger 14", value: 0 },
        { name: "trigger 15", value: 0 },
      ],
    },
    {
      objName: "Ops.Math.Compare.LessThan",
      id: "13",
      uiAttribs: {},
      portsIn: [{ name: "number1" }, { name: "number2", value: 0.2 }],
      portsOut: [{ name: "result", value: 0 }],
    },
    {
      objName: "Ops.Sidebar.Sidebar",
      id: "14",
      uiAttribs: {},
      portsIn: [
        { name: "Visible" },
        { name: "Opacity", value: 1 },
        { name: "Default Minimized", value: false },
        { name: "Minimized Opacity", value: 1 },
        { name: "Show undo button", value: false },
        { name: "Show Minimize", value: false },
        { name: "Title", value: "Displaced pixels" },
        { name: "Side", value: true },
      ],
      portsOut: [
        {
          name: "childs",
          links: [
            { portIn: "link", portOut: "childs", objIn: "16", objOut: "14" },
          ],
        },
        { name: "Opfened", value: false },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.ScaleTexture_v2",
      id: "15",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "Multiplier", value: 0 },
        { name: "Blend Mode index", value: 0 },
        { name: "Blend Mode", value: "normal" },
        { name: "Amount", value: 1 },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "offset X", value: 0 },
        { name: "offset Y", value: 0 },
        { name: "center X", value: 0 },
        { name: "center Y", value: 0 },
        { name: "Clear", value: true },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "render", portOut: "trigger", objIn: "36", objOut: "15" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Sidebar.Slider_v3",
      id: "16",
      uiAttribs: {},
      portsIn: [
        { name: "link" },
        { name: "Text", value: "zoom speed" },
        { name: "Min", value: 0.95 },
        { name: "Max", value: 1.05 },
        { name: "Step", value: 1e-5 },
        { name: "Suffix", value: "" },
        { name: "Grey Out", value: false },
        { name: "Visible", value: true },
        { name: "Input", value: 0.99682 },
        { name: "Set Default", value: null },
        { name: "Reset", value: 0 },
        { name: "Default", value: 1.02114 },
      ],
      portsOut: [
        {
          name: "childs",
          links: [
            { portIn: "link", portOut: "childs", objIn: "17", objOut: "16" },
          ],
        },
        {
          name: "Result",
          links: [
            { portIn: "number1", portOut: "Result", objIn: "48", objOut: "16" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Sidebar.Slider_v3",
      id: "17",
      uiAttribs: {},
      portsIn: [
        { name: "link" },
        { name: "Text", value: "pixel speed" },
        { name: "Min", value: 0 },
        { name: "Max", value: 1 },
        { name: "Step", value: 1e-5 },
        { name: "Suffix", value: "" },
        { name: "Grey Out", value: false },
        { name: "Visible", value: true },
        { name: "Input", value: 0.0771 },
        { name: "Set Default", value: null },
        { name: "Reset", value: 0 },
        { name: "Default", value: 0.2 },
      ],
      portsOut: [{ name: "childs" }, { name: "Result", value: 0.0771 }],
    },
    {
      objName: "Ops.Math.MapRange",
      id: "18",
      uiAttribs: {},
      portsIn: [
        { name: "value" },
        { name: "old min", value: -1 },
        { name: "old max", value: 1 },
        { name: "new min" },
        { name: "new max" },
        { name: "Easing index", value: 0 },
        { name: "Easing", value: "Linear" },
      ],
      portsOut: [{ name: "result", value: -0.006229731634632682 }],
    },
    {
      objName: "Ops.Math.MapRange",
      id: "19",
      uiAttribs: {},
      portsIn: [
        { name: "value" },
        { name: "old min", value: -1 },
        { name: "old max", value: 1 },
        { name: "new min" },
        { name: "new max" },
        { name: "Easing index", value: 0 },
        { name: "Easing", value: "Linear" },
      ],
      portsOut: [{ name: "result", value: -0.006229731634632682 }],
    },
    {
      objName: "Ops.Trigger.TriggerSend",
      id: "20",
      uiAttribs: {},
      portsIn: [{ name: "Trigger" }, { name: "Named Trigger", value: "Clear" }],
      portsOut: [],
    },
    {
      objName: "Ops.Devices.Keyboard.KeyPressLearn",
      id: "21",
      uiAttribs: {},
      portsIn: [
        { name: "key code", value: 82 },
        { name: "canvas only", value: false },
        { name: "Mod Key index", value: 0 },
        { name: "Mod Key", value: "none" },
        { name: "Enabled", value: true },
        { name: "Prevent Default", value: false },
        { name: "learn", value: 0 },
      ],
      portsOut: [
        { name: "on press", value: 0 },
        {
          name: "on release",
          links: [
            {
              portIn: "Trigger",
              portOut: "on release",
              objIn: "20",
              objOut: "21",
            },
          ],
        },
        { name: "Pressed", value: 0 },
        { name: "Key", value: "R" },
      ],
    },
    {
      objName: "Ops.Devices.Keyboard.KeyPressLearn",
      id: "22",
      uiAttribs: {},
      portsIn: [
        { name: "key code", value: 73 },
        { name: "canvas only", value: false },
        { name: "Mod Key index", value: 0 },
        { name: "Mod Key", value: "none" },
        { name: "Enabled", value: true },
        { name: "Prevent Default", value: false },
        { name: "learn", value: 0 },
      ],
      portsOut: [
        { name: "on press", value: 0 },
        {
          name: "on release",
          links: [
            {
              portIn: "trigger",
              portOut: "on release",
              objIn: "23",
              objOut: "22",
            },
          ],
        },
        { name: "Pressed", value: 0 },
        { name: "Key", value: "I" },
      ],
    },
    {
      objName: "Ops.Boolean.ToggleBool",
      id: "23",
      uiAttribs: {},
      portsIn: [
        { name: "trigger" },
        { name: "reset", value: 0 },
        { name: "Default", value: false },
      ],
      portsOut: [
        {
          name: "result",
          links: [
            { portIn: "Visible", portOut: "result", objIn: "14", objOut: "23" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.ImageCompose_v3",
      id: "24",
      uiAttribs: {},
      portsIn: [
        { name: "Render" },
        { name: "Base Texture", value: 0 },
        { name: "Size index", value: 0 },
        { name: "Size", value: "Auto" },
        { name: "Width", value: 640 },
        { name: "Height", value: 480 },
        { name: "Filter index", value: 1 },
        { name: "Filter", value: "nearest" },
        { name: "Wrap index", value: 1 },
        { name: "Wrap", value: "clamp to edge" },
        { name: "Pixel Format index", value: 0 },
        { name: "Pixel Format", value: "RGBA 8bit ubyte" },
        { name: "R", value: 0 },
        { name: "G", value: 0 },
        { name: "B", value: 0 },
        { name: "A", value: 0 },
      ],
      portsOut: [
        {
          name: "Next",
          links: [
            { portIn: "render", portOut: "Next", objIn: "25", objOut: "24" },
          ],
        },
        {
          name: "texture_out",
          links: [
            {
              portIn: "displaceTex",
              portOut: "texture_out",
              objIn: "8",
              objOut: "24",
            },
          ],
        },
        { name: "Aspect Ratio", value: 1.358642972536349 },
        { name: "Texture Width", value: 1682 },
        { name: "Texture Height", value: 1238 },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.DrawImage_v3",
      id: "25",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "blendMode index", value: 0 },
        { name: "blendMode", value: "normal" },
        { name: "amount", value: 1 },
        { name: "Image" },
        { name: "Premultiplied", value: false },
        { name: "Alpha Mask", value: false },
        { name: "removeAlphaSrc", value: false },
        { name: "Mask", value: 0 },
        { name: "Mask Src index", value: 1 },
        { name: "Mask Src", value: "alpha channel" },
        { name: "Invert alpha channel", value: false },
        { name: "Aspect Ratio", value: false },
        { name: "Stretch Axis index", value: 0 },
        { name: "Stretch Axis", value: "X" },
        { name: "Position", value: 0 },
        { name: "Crop", value: false },
        { name: "flip x", value: false },
        { name: "flip y", value: false },
        { name: "Transform", value: false },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "Position X", value: 0 },
        { name: "Position Y", value: 0 },
        { name: "Rotation", value: 0 },
        { name: "Clip Repeat", value: false },
      ],
      portsOut: [{ name: "trigger", value: 0 }],
    },
    {
      objName: "Ops.Gl.TextureEffects.ImageCompose_v3",
      id: "26",
      uiAttribs: {},
      portsIn: [
        { name: "Render" },
        { name: "Base Texture", value: 0 },
        { name: "Size index", value: 0 },
        { name: "Size", value: "Auto" },
        { name: "Width", value: 640 },
        { name: "Height", value: 480 },
        { name: "Filter index", value: 1 },
        { name: "Filter", value: "linear" },
        { name: "Wrap index", value: 1 },
        { name: "Wrap", value: "repeat" },
        { name: "Pixel Format index", value: 0 },
        { name: "Pixel Format", value: "RGBA 8bit ubyte" },
        { name: "R", value: 0 },
        { name: "G", value: 0 },
        { name: "B", value: 0 },
        { name: "A", value: 0 },
      ],
      portsOut: [
        {
          name: "Next",
          links: [
            { portIn: "render", portOut: "Next", objIn: "27", objOut: "26" },
          ],
        },
        {
          name: "texture_out",
          links: [
            {
              portIn: "Texture",
              portOut: "texture_out",
              objIn: "9",
              objOut: "26",
            },
          ],
        },
        { name: "Aspect Ratio", value: 1.358642972536349 },
        { name: "Texture Width", value: 1682 },
        { name: "Texture Height", value: 1238 },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.DrawImage_v3",
      id: "27",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "blendMode index", value: 0 },
        { name: "blendMode", value: "normal" },
        { name: "amount", value: 1 },
        { name: "Image" },
        { name: "Premultiplied", value: false },
        { name: "Alpha Mask", value: false },
        { name: "removeAlphaSrc", value: false },
        { name: "Mask", value: 0 },
        { name: "Mask Src index", value: 1 },
        { name: "Mask Src", value: "alpha channel" },
        { name: "Invert alpha channel", value: false },
        { name: "Aspect Ratio", value: false },
        { name: "Stretch Axis index", value: 0 },
        { name: "Stretch Axis", value: "X" },
        { name: "Position", value: 0 },
        { name: "Crop", value: false },
        { name: "flip x", value: false },
        { name: "flip y", value: false },
        { name: "Transform", value: false },
        { name: "Scale X", value: 1 },
        { name: "Scale Y", value: 1 },
        { name: "Position X", value: 0 },
        { name: "Position Y", value: 0 },
        { name: "Rotation", value: 0 },
        { name: "Clip Repeat", value: false },
      ],
      portsOut: [{ name: "trigger", value: 0 }],
    },
    {
      objName: "Ops.Gl.Texture_v2",
      id: "28",
      uiAttribs: {},
      portsIn: [
        { name: "File", value: "bikolabs.png", display: "file" },
        { name: "Filter index", value: 0 },
        { name: "Filter", value: "mipmap" },
        { name: "Wrap index", value: 2 },
        { name: "Wrap", value: "repeat" },
        { name: "Anisotropic index", value: 0 },
        { name: "Anisotropic", value: 0 },
        { name: "Flip", value: false },
        { name: "Pre Multiplied Alpha", value: false },
        { name: "Active", value: true },
        { name: "Save Memory", value: true },
      ],
      portsOut: [
        {
          name: "Texture",
          links: [
            { portIn: "Image", portOut: "Texture", objIn: "3", objOut: "28" },
          ],
        },
        { name: "Width", value: 3556 },
        { name: "Height", value: 2032 },
        { name: "Aspect Ratio", value: 1.75 },
        { name: "Loaded", value: true },
        { name: "Loading", value: false },
      ],
    },
    {
      objName: "Ops.Trigger.GateTrigger",
      id: "29",
      uiAttribs: {},
      portsIn: [{ name: "Execute" }, { name: "Pass Through" }],
      portsOut: [
        {
          name: "Trigger out",
          links: [
            {
              portIn: "render",
              portOut: "Trigger out",
              objIn: "5",
              objOut: "29",
            },
          ],
        },
      ],
    },
    {
      objName: "Ops.Trigger.IsTriggered",
      id: "30",
      uiAttribs: {},
      portsIn: [{ name: "Trigger" }],
      portsOut: [
        { name: "Next", value: 0 },
        {
          name: "Was Triggered",
          links: [
            {
              portIn: "Boolean",
              portOut: "Was Triggered",
              objIn: "31",
              objOut: "30",
            },
          ],
        },
      ],
    },
    {
      objName: "Ops.Boolean.Not",
      id: "31",
      uiAttribs: {},
      portsIn: [{ name: "Boolean" }],
      portsOut: [
        {
          name: "Result",
          links: [
            {
              portIn: "Pass Through",
              portOut: "Result",
              objIn: "29",
              objOut: "31",
            },
          ],
        },
      ],
    },
    {
      objName: "Ops.Trigger.TriggerReceive",
      id: "32",
      uiAttribs: {},
      portsIn: [{ name: "Named Trigger", value: "Clear" }],
      portsOut: [
        {
          name: "Triggered",
          links: [
            {
              portIn: "Trigger",
              portOut: "Triggered",
              objIn: "30",
              objOut: "32",
            },
          ],
        },
      ],
    },
    {
      objName: "Ops.Trigger.TriggerReceive",
      id: "33",
      uiAttribs: {},
      portsIn: [{ name: "Named Trigger", value: "Clear" }],
      portsOut: [{ name: "Triggered", value: 0 }],
    },
    {
      objName: "Ops.Trigger.TriggerOnce",
      id: "34",
      uiAttribs: {},
      portsIn: [
        { name: "Exec", value: null },
        { name: "Reset", value: null },
      ],
      portsOut: [
        { name: "Next", value: 0 },
        { name: "Was Triggered", value: 1 },
      ],
    },
    {
      objName: "Ops.TimeLine.TimeLineFrame",
      id: "35",
      uiAttribs: {},
      portsIn: [],
      portsOut: [
        {
          name: "time",
          links: [
            { portIn: "number1", portOut: "time", objIn: "13", objOut: "35" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Gl.TextureEffects.ChromaticAberration_v2",
      id: "36",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "Blend Mode index", value: 0 },
        { name: "Blend Mode", value: "normal" },
        { name: "Amount", value: 1 },
        { name: "Pixel", value: 5 },
        { name: "Lens Distort", value: 0.082 },
        { name: "Smooth", value: true },
        { name: "Mask", value: 0 },
      ],
      portsOut: [{ name: "trigger", value: 0 }],
    },
    {
      objName: "Ops.Anim.RandomAnim",
      id: "37",
      uiAttribs: {},
      portsIn: [
        { name: "exe" },
        { name: "min", value: -1 },
        { name: "max", value: 1 },
        { name: "random seed", value: 0.46 },
        { name: "duration", value: 1 },
        { name: "pause between", value: 0 },
        { name: "easing index", value: 0 },
        { name: "easing", value: "smootherstep" },
      ],
      portsOut: [
        { name: "Next", value: 0 },
        {
          name: "result",
          links: [
            { portIn: "Value", portOut: "result", objIn: "10", objOut: "37" },
            { portIn: "Value", portOut: "result", objIn: "42", objOut: "37" },
          ],
        },
        {
          name: "Looped",
          links: [
            { portIn: "Trigger", portOut: "Looped", objIn: "39", objOut: "37" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Anim.SineAnim",
      id: "38",
      uiAttribs: {},
      portsIn: [
        { name: "exe" },
        { name: "Mode index", value: 0 },
        { name: "Mode", value: "Cosine" },
        { name: "phase", value: 0 },
        { name: "frequency", value: 3 },
        { name: "amplitude", value: 0.2 },
      ],
      portsOut: [
        {
          name: "Trigger out",
          links: [
            {
              portIn: "exe",
              portOut: "Trigger out",
              objIn: "37",
              objOut: "38",
            },
          ],
        },
        { name: "result", value: 0.03783310155069877 },
      ],
    },
    {
      objName: "Ops.Trigger.TriggerSend",
      id: "39",
      uiAttribs: {},
      portsIn: [
        { name: "Trigger" },
        { name: "Named Trigger", value: "mouseMoved" },
      ],
      portsOut: [],
    },
    {
      objName: "Ops.Trigger.GateTrigger",
      id: "40",
      uiAttribs: {},
      portsIn: [
        { name: "Execute", value: null },
        { name: "Pass Through", value: true },
      ],
      portsOut: [{ name: "Trigger out", value: 0 }],
    },
    {
      objName: "Ops.Math.FlipSign",
      id: "41",
      uiAttribs: {},
      portsIn: [{ name: "Value" }],
      portsOut: [
        {
          name: "Result",
          links: [
            { portIn: "new min", portOut: "Result", objIn: "19", objOut: "41" },
            { portIn: "new min", portOut: "Result", objIn: "18", objOut: "41" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Math.Delta",
      id: "42",
      uiAttribs: {},
      portsIn: [
        { name: "Value" },
        { name: "Change Always", value: false },
        { name: "Reset", value: null },
      ],
      portsOut: [
        {
          name: "Delta",
          links: [
            { portIn: "value", portOut: "Delta", objIn: "19", objOut: "42" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Devices.Mouse.Mouse_v2",
      id: "43",
      uiAttribs: {},
      portsIn: [
        { name: "Active", value: true },
        { name: "relative", value: false },
        { name: "normalize", value: false },
        { name: "flip y", value: true },
        { name: "Area index", value: 0 },
        { name: "Area", value: "Document" },
        { name: "right click prevent default", value: true },
        { name: "Touch support", value: true },
        { name: "smooth", value: false },
        { name: "smoothSpeed", value: 20 },
        { name: "multiply", value: 1 },
      ],
      portsOut: [
        { name: "x", value: 701 },
        { name: "y", value: 357 },
        { name: "button down", value: 0 },
        { name: "click", value: 0 },
        { name: "Button Up", value: 0 },
        { name: "click right", value: 0 },
        { name: "mouseOver", value: 1 },
        { name: "button", value: 0 },
      ],
    },
    {
      objName: "Ops.Gl.ClearColor",
      id: "44",
      uiAttribs: {},
      portsIn: [
        { name: "render" },
        { name: "r", value: 1 },
        { name: "g", value: 0.9996395111083984 },
        { name: "b", value: 0.9996395111083984 },
        { name: "a", value: 1 },
      ],
      portsOut: [
        {
          name: "trigger",
          links: [
            { portIn: "exe", portOut: "trigger", objIn: "2", objOut: "44" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Devices.Mouse.Mouse_v3",
      id: "45",
      uiAttribs: {},
      portsIn: [
        { name: "Coordinates index", value: 2 },
        { name: "Coordinates", value: "-1 to 1" },
        { name: "Area index", value: 0 },
        { name: "Area", value: "Canvas" },
        { name: "flip y", value: true },
        { name: "right click prevent default", value: true },
        { name: "Touch support", value: true },
        { name: "Active", value: true },
      ],
      portsOut: [
        {
          name: "x",
          links: [{ portIn: "val", portOut: "x", objIn: "51", objOut: "45" }],
        },
        {
          name: "y",
          links: [{ portIn: "val", portOut: "y", objIn: "53", objOut: "45" }],
        },
        { name: "click", value: 0 },
        { name: "click right", value: 0 },
        { name: "Button is down", value: 0 },
        { name: "Mouse is hovering", value: 0 },
      ],
    },
    {
      objName: "Ops.Math.Multiply",
      id: "46",
      uiAttribs: {},
      portsIn: [{ name: "number1" }, { name: "number2", value: 0.02 }],
      portsOut: [
        {
          name: "result",
          links: [
            { portIn: "amount Y", portOut: "result", objIn: "8", objOut: "46" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Math.Multiply",
      id: "47",
      uiAttribs: {},
      portsIn: [{ name: "number1" }, { name: "number2", value: 0.02 }],
      portsOut: [
        {
          name: "result",
          links: [
            { portIn: "amount X", portOut: "result", objIn: "8", objOut: "47" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Math.Multiply",
      id: "48",
      uiAttribs: {},
      portsIn: [{ name: "number1" }, { name: "number2", value: 1 }],
      portsOut: [{ name: "result", value: 0.99682 }],
    },
    {
      objName: "Ops.Math.MapRange",
      id: "49",
      uiAttribs: {},
      portsIn: [
        { name: "value", value: 0 },
        { name: "old min", value: -1 },
        { name: "old max", value: 1 },
        { name: "new min", value: -1 },
        { name: "new max", value: 1 },
        { name: "Easing index", value: 0 },
        { name: "Easing", value: "Linear" },
      ],
      portsOut: [{ name: "result", value: 0.0004995519513166513 }],
    },
    {
      objName: "Ops.Devices.Mouse.Mouse_v3",
      id: "50",
      uiAttribs: {},
      portsIn: [
        { name: "Coordinates index", value: 2 },
        { name: "Coordinates", value: "-1 to 1" },
        { name: "Area index", value: 0 },
        { name: "Area", value: "Canvas" },
        { name: "flip y", value: true },
        { name: "right click prevent default", value: true },
        { name: "Touch support", value: true },
        { name: "Active", value: true },
      ],
      portsOut: [
        { name: "x", value: -0.9619500594530321 },
        { name: "y", value: -0.7705977382875606 },
        { name: "click", value: 0 },
        { name: "click right", value: 0 },
        { name: "Button is down", value: 0 },
        { name: "Mouse is hovering", value: 0 },
      ],
    },
    {
      objName: "Ops.Math.Clamp",
      id: "51",
      uiAttribs: {},
      portsIn: [
        { name: "val" },
        { name: "min", value: -1 },
        { name: "max", value: 0.2 },
        { name: "ignore outside values", value: true },
      ],
      portsOut: [
        {
          name: "result",
          links: [
            { portIn: "number1", portOut: "result", objIn: "47", objOut: "51" },
          ],
        },
      ],
    },
    {
      objName: "Ops.Math.Clamp",
      id: "52",
      uiAttribs: {},
      portsIn: [
        { name: "val", value: 0.5 },
        { name: "min", value: 1.2 },
        { name: "max", value: 0 },
        { name: "ignore outside values", value: true },
      ],
      portsOut: [{ name: "result", value: 0.00356718192627814 }],
    },
    {
      objName: "Ops.Math.Clamp",
      id: "53",
      uiAttribs: {},
      portsIn: [
        { name: "val" },
        { name: "min", value: -1 },
        { name: "max", value: 0.2 },
        { name: "ignore outside values", value: true },
      ],
      portsOut: [
        {
          name: "result",
          links: [
            { portIn: "number1", portOut: "result", objIn: "46", objOut: "53" },
          ],
        },
      ],
    },
  ],
  users: ["63566672759d5b03cd7f1728"],
  usersReadOnly: [],
  userOps: [],
  tags: ["pixel", "pixel displacement", "touch", "photo", "glitch", "glitch"],
  _id: "646b1bb7685430381dd17135",
  name: "Glich_bikolabs",
  description: "RMB-click or two-finder tap for options",
  userId: "5c54b23eff421922c466b2c7",
  created: "2023-05-22T07:37:27.142Z",
  cloneOf: "63b47272c6a183d534cc3ac9",
  updated: "2023-05-23T16:27:42.749Z",
  log: [
    {
      _id: "646b1bb7685430381dd17137",
      key: "collabsatcreate",
      text: "initial list of collaborators:",
    },
  ],
  __v: 15,
  shortId: "tb4p2x",
  buildInfo: {
    core: {
      timestamp: 1682341866190,
      created: "2023-04-24T13:11:06.190Z",
      git: {
        branch: "master",
        commit: "a8912bdbb85d335fb4b58c228bba4c8be8498ebd",
        date: "2023-04-24T13:08:49.000Z",
        message: "fix duplicate ids",
      },
    },
    ui: {
      timestamp: 1682341878679,
      created: "2023-04-24T13:11:18.679Z",
      git: {
        branch: "master",
        commit: "92f3441db14505cdeafaf68ec0c717954f18584c",
        date: "2022-12-16T15:16:18.000Z",
        message:
          'do not show "automated error report" to admin users - pandrr/cables/issues/4193',
      },
    },
    host: "cables.gl",
  },
  opsHash: "98b17565684ccc881ac1b996e20c1fd6d8d823da",
  ui: {
    timeLineLength: 20,
    bookmarks: [],
    viewBoxesGl: {
      0: { x: 2.0629060116189066, y: 873.9632678127672, z: 731.9261972206862 },
    },
    renderer: { w: 841, h: 619, s: 1 },
  },
  updatedByUser: "karlosgliberal",
  deployments: { lastDeployment: { date: 1684859283775, service: "download" } },
  exports: 4,
  cachedUsername: "karlosgliberal",
  views: 0,
  statsAdmin: {
    filenameScreenshots: [
      "_screenshots/screenshot.png",
      "_screenshots/screenshot_1684741120110.png",
      "_screenshots/screenshot_1684741549615.png",
      "_screenshots/screenshot_1684743259199.png",
      "_screenshots/screenshot_1684751069214.png",
      "_screenshots/screenshot_1684751093759.png",
      "_screenshots/screenshot_converted.jpg",
      "_screenshots/screenshot_converted.webp",
    ],
    filenameExports: [
      "_exports/cables_Glich_bikolabs1.zip",
      "_exports/cables_Glich_bikolabs2.zip",
    ],
    filenameAssets: ["bikolabs.png"],
    hasOldScreenshots: false,
    hasOldExports: false,
    sizeScreenshots: 3123.919921875,
    sizeExports: 3464.892578125,
    sizeAssets: 664.5478515625,
  },
};
if (!CABLES.exportedPatch) {
  CABLES.exportedPatch = CABLES.exportedPatches["tb4p2x"];
}
("use strict");
var CABLES = CABLES || {};
CABLES.OPS = CABLES.OPS || {};
var Ops = Ops || {};
Ops.Gl = Ops.Gl || {};
Ops.Ui = Ops.Ui || {};
Ops.Anim = Ops.Anim || {};
Ops.Math = Ops.Math || {};
Ops.Boolean = Ops.Boolean || {};
Ops.Devices = Ops.Devices || {};
Ops.Sidebar = Ops.Sidebar || {};
Ops.Trigger = Ops.Trigger || {};
Ops.TimeLine = Ops.TimeLine || {};
Ops.Gl.Meshes = Ops.Gl.Meshes || {};
Ops.Gl.Textures = Ops.Gl.Textures || {};
Ops.Math.Compare = Ops.Math.Compare || {};
Ops.Devices.Mouse = Ops.Devices.Mouse || {};
Ops.Devices.Keyboard = Ops.Devices.Keyboard || {};
Ops.Gl.TextureEffects = Ops.Gl.TextureEffects || {};
Ops.Gl.MainLoop = function () {
  CABLES.Op.apply(this, arguments);
  const i = this;
  const e = {};
  const t = i.inValue("FPS Limit", 0),
    n = i.outTrigger("trigger"),
    s = i.outNumber("width"),
    r = i.outNumber("height"),
    a = i.inValueBool("Reduce FPS not focussed", true),
    o = i.inValueBool("Reduce FPS loading"),
    l = i.inValueBool("Clear", true),
    u = i.inValueBool("ClearAlpha", true),
    c = i.inValueBool("Fullscreen Button", false),
    h = i.inValueBool("Active", true),
    g = i.inValueBool("Hires Displays", false),
    d = i.inSwitch("Pixel Unit", ["Display", "CSS"], "Display");
  i.onAnimFrame = T;
  g.onChange = function () {
    if (g.get()) i.patch.cgl.pixelDensity = window.devicePixelRatio;
    else i.patch.cgl.pixelDensity = 1;
    i.patch.cgl.updateSize();
    if (CABLES.UI) gui.setLayout();
  };
  h.onChange = function () {
    i.patch.removeOnAnimFrame(i);
    if (h.get()) {
      i.setUiAttrib({ extendTitle: "" });
      i.onAnimFrame = T;
      i.patch.addOnAnimFrame(i);
      i.log("adding again!");
    } else {
      i.setUiAttrib({ extendTitle: "Inactive" });
    }
  };
  const p = i.patch.cgl;
  let m = 0;
  let f = 0;
  if (!i.patch.cgl) i.uiAttr({ error: "No webgl cgl context" });
  const _ = vec3.create();
  vec3.set(_, 0, 0, 0);
  const v = vec3.create();
  vec3.set(v, 0, 0, -2);
  c.onChange = E;
  setTimeout(E, 100);
  let b = null;
  let x = true;
  let I = true;
  window.addEventListener("blur", () => {
    x = false;
  });
  window.addEventListener("focus", () => {
    x = true;
  });
  document.addEventListener("visibilitychange", () => {
    I = !document.hidden;
  });
  y();
  d.onChange = () => {
    s.set(0);
    r.set(0);
  };
  function A() {
    if (o.get() && i.patch.loading.getProgress() < 1) return 5;
    if (a.get()) {
      if (!I) return 10;
      if (!x) return 30;
    }
    return t.get();
  }
  function E() {
    function e() {
      if (b) b.style.display = "block";
    }
    function t() {
      if (b) b.style.display = "none";
    }
    i.patch.cgl.canvas.addEventListener("mouseleave", t);
    i.patch.cgl.canvas.addEventListener("mouseenter", e);
    if (c.get()) {
      if (!b) {
        b = document.createElement("div");
        const n = i.patch.cgl.canvas.parentElement;
        if (n) n.appendChild(b);
        b.addEventListener("mouseenter", e);
        b.addEventListener("click", function (e) {
          if (CABLES.UI && !e.shiftKey) gui.cycleFullscreen();
          else p.fullScreen();
        });
      }
      b.style.padding = "10px";
      b.style.position = "absolute";
      b.style.right = "5px";
      b.style.top = "5px";
      b.style.width = "20px";
      b.style.height = "20px";
      b.style.cursor = "pointer";
      b.style["border-radius"] = "40px";
      b.style.background = "#444";
      b.style["z-index"] = "9999";
      b.style.display = "none";
      b.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="width:20px;height:20px;" xml:space="preserve" width="512px" height="512px"><g><path d="M173.792,301.792L21.333,454.251v-80.917c0-5.891-4.776-10.667-10.667-10.667C4.776,362.667,0,367.442,0,373.333V480     c0,5.891,4.776,10.667,10.667,10.667h106.667c5.891,0,10.667-4.776,10.667-10.667s-4.776-10.667-10.667-10.667H36.416     l152.459-152.459c4.093-4.237,3.975-10.99-0.262-15.083C184.479,297.799,177.926,297.799,173.792,301.792z" fill="#FFFFFF"/><path d="M480,0H373.333c-5.891,0-10.667,4.776-10.667,10.667c0,5.891,4.776,10.667,10.667,10.667h80.917L301.792,173.792     c-4.237,4.093-4.354,10.845-0.262,15.083c4.093,4.237,10.845,4.354,15.083,0.262c0.089-0.086,0.176-0.173,0.262-0.262     L469.333,36.416v80.917c0,5.891,4.776,10.667,10.667,10.667s10.667-4.776,10.667-10.667V10.667C490.667,4.776,485.891,0,480,0z" fill="#FFFFFF"/><path d="M36.416,21.333h80.917c5.891,0,10.667-4.776,10.667-10.667C128,4.776,123.224,0,117.333,0H10.667     C4.776,0,0,4.776,0,10.667v106.667C0,123.224,4.776,128,10.667,128c5.891,0,10.667-4.776,10.667-10.667V36.416l152.459,152.459     c4.237,4.093,10.99,3.975,15.083-0.262c3.992-4.134,3.992-10.687,0-14.82L36.416,21.333z" fill="#FFFFFF"/><path d="M480,362.667c-5.891,0-10.667,4.776-10.667,10.667v80.917L316.875,301.792c-4.237-4.093-10.99-3.976-15.083,0.261     c-3.993,4.134-3.993,10.688,0,14.821l152.459,152.459h-80.917c-5.891,0-10.667,4.776-10.667,10.667s4.776,10.667,10.667,10.667     H480c5.891,0,10.667-4.776,10.667-10.667V373.333C490.667,367.442,485.891,362.667,480,362.667z" fill="#FFFFFF"/></g></svg>';
    } else {
      if (b) {
        b.style.display = "none";
        b.remove();
        b = null;
      }
    }
  }
  i.onDelete = function () {
    p.gl.clearColor(0, 0, 0, 0);
    p.gl.clear(p.gl.COLOR_BUFFER_BIT | p.gl.DEPTH_BUFFER_BIT);
  };
  function T(e) {
    if (!h.get()) return;
    if (p.aborted || p.canvas.clientWidth === 0 || p.canvas.clientHeight === 0)
      return;
    i.patch.cg = p;
    const t = performance.now();
    i.patch.config.fpsLimit = A();
    if (p.canvasWidth == -1) {
      p.setCanvas(i.patch.config.glCanvasId);
      return;
    }
    if (p.canvasWidth != s.get() || p.canvasHeight != r.get()) {
      let e = 1;
      if (d.get() == "CSS") e = i.patch.cgl.pixelDensity;
      s.set(p.canvasWidth / e);
      r.set(p.canvasHeight / e);
    }
    if (CABLES.now() - f > 1e3) {
      CGL.fpsReport = CGL.fpsReport || [];
      if (i.patch.loading.getProgress() >= 1 && f !== 0) CGL.fpsReport.push(m);
      m = 0;
      f = CABLES.now();
    }
    CGL.MESH.lastShader = null;
    CGL.MESH.lastMesh = null;
    p.renderStart(p, _, v);
    if (l.get()) {
      p.gl.clearColor(0, 0, 0, 1);
      p.gl.clear(p.gl.COLOR_BUFFER_BIT | p.gl.DEPTH_BUFFER_BIT);
    }
    n.trigger();
    if (CGL.MESH.lastMesh) CGL.MESH.lastMesh.unBind();
    if (CGL.Texture.previewTexture) {
      if (!CGL.Texture.texturePreviewer)
        CGL.Texture.texturePreviewer = new CGL.Texture.texturePreview(p);
      CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture);
    }
    p.renderEnd(p);
    i.patch.cg = null;
    if (u.get()) {
      p.gl.clearColor(1, 1, 1, 1);
      p.gl.colorMask(false, false, false, true);
      p.gl.clear(p.gl.COLOR_BUFFER_BIT);
      p.gl.colorMask(true, true, true, true);
    }
    if (!p.frameStore.phong) p.frameStore.phong = {};
    m++;
    i.patch.cgl.profileData.profileMainloopMs = performance.now() - t;
  }
  function y() {
    setTimeout(() => {
      if (i.patch.getOpsByObjName(i.name).length > 1) {
        i.setUiError("multimainloop", "there should only be one mainloop op!");
        i.patch.addEventListener("onOpDelete", y);
      } else i.setUiError("multimainloop", null, 1);
    }, 500);
  }
};
Ops.Gl.MainLoop.prototype = new CABLES.Op();
CABLES.OPS["b0472a1d-db16-4ba6-8787-f300fbdc77bb"] = {
  f: Ops.Gl.MainLoop,
  objName: "Ops.Gl.MainLoop",
};
Ops.Gl.Textures.CopyTexture = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {
    copytexture_frag:
      "UNI float a;\nUNI sampler2D tex;\n\n#ifdef TEX_MASK\nUNI sampler2D texMask;\n#endif\n\nIN vec2 texCoord;\n\nvoid main()\n{\n    vec4 col=texture(tex,texCoord);\n\n    #ifdef TEX_MASK\n        col.a=texture(texMask,texCoord).r;\n    #endif\n\n\n    #ifdef GREY_R\n        col.rgb=vec3(col.r);\n    #endif\n\n    #ifdef GREY_G\n        col.rgb=vec3(col.g);\n    #endif\n\n    #ifdef GREY_B\n        col.rgb=vec3(col.b);\n    #endif\n\n    #ifdef GREY_A\n        col.rgb=vec3(col.a);\n    #endif\n\n    #ifdef GREY_LUMI\n        col.rgb=vec3( dot(vec3(0.2126,0.7152,0.0722), col.rgb) );\n    #endif\n\n\n    #ifdef INVERT_A\n        col.a=1.0-col.a;\n    #endif\n\n    #ifdef INVERT_R\n        col.r=1.0-col.r;\n    #endif\n\n    #ifdef INVERT_G\n        col.g=1.0-col.g;\n    #endif\n\n    #ifdef INVERT_B\n        col.b=1.0-col.b;\n    #endif\n\n    #ifdef ALPHA_1\n        col.a=1.0;\n    #endif\n\n\n\n\n    outColor= col;\n}",
  };
  const n = e.inTriggerButton("render"),
    i = e.inTexture("Texture"),
    s = e.inTexture("Alpha Mask"),
    r = e.inValueBool("use original size", true),
    a = e.inValueInt("width", 640),
    o = e.inValueInt("height", 360),
    l = e.inSwitch("filter", ["nearest", "linear", "mipmap"], "linear"),
    u = e.inValueSelect(
      "wrap",
      ["clamp to edge", "repeat", "mirrored repeat"],
      "clamp to edge"
    ),
    c = e.inValueBool("HDR"),
    h = e.inSwitch("Alpha Mask Source", ["A", "1"], "A"),
    g = e.inSwitch(
      "Convert Greyscale",
      ["Off", "R", "G", "B", "A", "Luminance"],
      "Off"
    ),
    d = e.inBool("Invert R", false),
    p = e.inBool("Invert G", false),
    m = e.inBool("Invert B", false),
    f = e.inBool("Invert A", false),
    _ = e.outTrigger("trigger"),
    v = e.outTexture("texture_out", null),
    b = e.outNumber("Aspect Ratio");
  h.setUiAttribs({ hidePort: true });
  g.setUiAttribs({ hidePort: true });
  d.setUiAttribs({ hidePort: true });
  p.setUiAttribs({ hidePort: true });
  m.setUiAttribs({ hidePort: true });
  let x = null;
  const I = e.patch.cgl;
  let A = null;
  let E = null;
  let T = null;
  let y = true;
  let C = 2,
    S = 2;
  const L = [0, 0, 0, 0];
  let O = true;
  e.setPortGroup("Size", [r, a, o]);
  const N = new CGL.Shader(I, "copytexture");
  N.setSource(N.getDefaultVertexShader(), t.copytexture_frag);
  const w = new CGL.Uniform(N, "t", "tex", 0);
  let M = new CGL.Uniform(N, "t", "texMask", 1);
  let B = CGL.Texture.FILTER_LINEAR;
  let P = CGL.Texture.WRAP_CLAMP_TO_EDGE;
  h.onChange =
    g.onChange =
    d.onChange =
    p.onChange =
    m.onChange =
    u.onChange =
    l.onChange =
    c.onChange =
    s.onChange =
      R;
  n.onLinkChanged =
    i.onLinkChanged =
    i.onChange =
      () => {
        R();
      };
  n.onTriggered = D;
  G();
  function k() {
    if (E) E.delete();
    if (T) {
      T.delete();
      T = null;
    }
    E = new CGL.TextureEffect(I, {
      isFloatingPointTexture: c.get(),
      clear: false,
    });
    if (
      !T ||
      T.width != Math.floor(a.get()) ||
      T.height != Math.floor(o.get()) ||
      T.wrap != P ||
      T.isFloatingPoint() != c.get()
    ) {
      if (T) T.delete();
      T = new CGL.Texture(I, {
        name: "copytexture_" + e.id,
        isFloatingPointTexture: c.get(),
        filter: B,
        wrap: P,
        width: Math.floor(a.get()),
        height: Math.floor(o.get()),
      });
    }
    E.setSourceTexture(T);
    v.set(null);
    O = false;
  }
  function R() {
    F();
    if (n.links.length === 0) {
      O = true;
      e.patch.cgl.off(x);
      x = e.patch.cgl.on("beginFrame", () => {
        e.patch.cgl.off(x);
        if (y) V();
        if (!E) e.log("has no effect");
        if (!i.get()) e.log("has no intexture");
        D();
      });
    }
  }
  function V() {
    if (!i.get() || i.get() == CGL.Texture.getEmptyTexture(I)) return;
    if (!E) k();
    if (r.get()) {
      C = i.get().width;
      S = i.get().height;
    } else {
      C = Math.floor(a.get());
      S = Math.floor(o.get());
    }
    if ((C != T.width || S != T.height) && C !== 0 && S !== 0) {
      o.set(S);
      a.set(C);
      T.filter = B;
      T.setSize(C, S);
      b.set(C / S);
      E.setSourceTexture(T);
    }
    if (v.get() && B != CGL.Texture.FILTER_NEAREST) {
      if (!v.get().isPowerOfTwo())
        e.setUiError(
          "hintnpot",
          "texture dimensions not power of two! - texture filtering when scaling will not work on ios devices.",
          0
        );
      else e.setUiError("hintnpot", null, 0);
    } else e.setUiError("hintnpot", null, 0);
    y = false;
  }
  function G() {
    a.setUiAttribs({ greyout: r.get() });
    o.setUiAttribs({ greyout: r.get() });
  }
  function U() {
    y = true;
    R();
  }
  r.onChange = function () {
    G();
    if (r.get()) {
      a.onChange = null;
      o.onChange = null;
    } else {
      a.onChange = U;
      o.onChange = U;
    }
    V();
  };
  function D() {
    if (!i.get() || i.get() == CGL.Texture.getEmptyTexture(I))
      v.set(CGL.Texture.getEmptyTexture(I));
    if (!i.get() || i.get() == CGL.Texture.getEmptyTexture(I)) {
      A = null;
      _.trigger();
      return;
    } else if (!E || O || A != i.get()) {
      k();
    }
    const e = I.getViewPort();
    L[0] = e[0];
    L[1] = e[1];
    L[2] = e[2];
    L[3] = e[3];
    V();
    A = i.get();
    const t = I.currentTextureEffect;
    I.currentTextureEffect = E;
    E.setSourceTexture(T);
    E.startEffect();
    I.pushShader(N);
    I.currentTextureEffect.bind();
    I.setTexture(0, i.get().tex);
    if (s.get()) I.setTexture(1, s.get().tex);
    I.pushBlend(false);
    I.currentTextureEffect.finish();
    I.popShader();
    I.popBlend();
    v.set(E.getCurrentSourceTexture());
    E.endEffect();
    I.setViewPort(L[0], L[1], L[2], L[3]);
    I.currentTextureEffect = t;
    I.setTexture(0, CGL.Texture.getEmptyTexture(I).tex);
    _.trigger();
  }
  function F() {
    N.toggleDefine("TEX_MASK", s.get());
    N.toggleDefine("GREY_R", g.get() === "R");
    N.toggleDefine("GREY_G", g.get() === "G");
    N.toggleDefine("GREY_B", g.get() === "B");
    N.toggleDefine("GREY_A", g.get() === "A");
    N.toggleDefine("GREY_LUMI", g.get() === "Luminance");
    N.toggleDefine("ALPHA_1", h.get() === "1");
    N.toggleDefine("ALPHA_A", h.get() === "A");
    N.toggleDefine("INVERT_R", d.get());
    N.toggleDefine("INVERT_G", p.get());
    N.toggleDefine("INVERT_B", m.get());
    N.toggleDefine("INVERT_A", f.get());
    if (u.get() == "repeat") P = CGL.Texture.WRAP_REPEAT;
    else if (u.get() == "mirrored repeat") P = CGL.Texture.WRAP_MIRRORED_REPEAT;
    else if (u.get() == "clamp to edge") P = CGL.Texture.WRAP_CLAMP_TO_EDGE;
    if (l.get() == "nearest") B = CGL.Texture.FILTER_NEAREST;
    else if (l.get() == "linear") B = CGL.Texture.FILTER_LINEAR;
    else if (l.get() == "mipmap") B = CGL.Texture.FILTER_MIPMAP;
    if (N.needsRecompile()) {
      O = true;
    }
    if (
      T &&
      (T.width != Math.floor(a.get()) ||
        T.height != Math.floor(o.get()) ||
        T.wrap != P ||
        T.isFloatingPoint() != c.get())
    ) {
      O = true;
    }
  }
};
Ops.Gl.Textures.CopyTexture.prototype = new CABLES.Op();
CABLES.OPS["18a6d1f4-a7f8-4a3e-ab1d-0c2d2efe3861"] = {
  f: Ops.Gl.Textures.CopyTexture,
  objName: "Ops.Gl.Textures.CopyTexture",
};
Ops.Sequence = function () {
  CABLES.Op.apply(this, arguments);
  const r = this;
  const e = {};
  const t = r.inTrigger("exe"),
    n = r.inTriggerButton("Clean up connections");
  const i = [],
    a = [],
    s = 16;
  let o = null;
  t.onTriggered = u;
  n.onTriggered = c;
  n.setUiAttribs({ hidePort: true });
  n.setUiAttribs({ hideParam: true });
  for (let t = 0; t < s; t++) {
    const h = r.outTrigger("trigger " + t);
    a.push(h);
    h.onLinkChanged = l;
    if (t < s - 1) {
      let e = r.inTrigger("exe " + t);
      e.onTriggered = u;
      i.push(e);
    }
  }
  function l() {
    clearTimeout(o);
    o = setTimeout(() => {
      let t = false;
      for (let e = 0; e < a.length; e++) if (a[e].links.length > 1) t = true;
      n.setUiAttribs({ hideParam: !t });
      if (r.isCurrentUiOp()) r.refreshParams();
    }, 60);
  }
  function u() {
    for (let e = 0; e < a.length; e++) a[e].trigger();
  }
  function c() {
    let i = 0;
    for (let n = 0; n < a.length; n++) {
      let t = [];
      if (a[n].links.length > 1)
        for (let e = 1; e < a[n].links.length; e++) {
          while (a[i].links.length > 0) i++;
          t.push(a[n].links[e]);
          const s = a[n].links[e].getOtherPort(a[n]);
          r.patch.link(r, "trigger " + i, s.parent, s.name);
          i++;
        }
      for (let e = 0; e < t.length; e++) t[e].remove();
    }
    l();
  }
};
Ops.Sequence.prototype = new CABLES.Op();
CABLES.OPS["a466bc1f-06e9-4595-8849-bffb9fe22f99"] = {
  f: Ops.Sequence,
  objName: "Ops.Sequence",
};
Ops.Gl.TextureEffects.DrawImage_v3 = function () {
  CABLES.Op.apply(this, arguments);
  const i = this;
  const e = {
    drawimage_frag:
      "#ifdef HAS_TEXTURES\n    IN vec2 texCoord;\n    UNI sampler2D tex;\n    UNI sampler2D image;\n#endif\n\n#ifdef TEX_TRANSFORM\n    IN mat3 transform;\n#endif\n// UNI float rotate;\n\n{{CGL.BLENDMODES}}\n\n#ifdef HAS_TEXTUREALPHA\n   UNI sampler2D imageAlpha;\n#endif\n\nUNI float amount;\n\n#ifdef ASPECT_RATIO\n    UNI float aspectTex;\n    UNI float aspectPos;\n#endif\n\nvoid main()\n{\n    vec4 blendRGBA=vec4(0.0,0.0,0.0,1.0);\n\n    #ifdef HAS_TEXTURES\n        vec2 tc=texCoord;\n\n        #ifdef TEX_FLIP_X\n            tc.x=1.0-tc.x;\n        #endif\n        #ifdef TEX_FLIP_Y\n            tc.y=1.0-tc.y;\n        #endif\n\n        #ifdef ASPECT_RATIO\n            #ifdef ASPECT_AXIS_X\n                tc.y=(1.0-aspectPos)-(((1.0-aspectPos)-tc.y)*aspectTex);\n            #endif\n            #ifdef ASPECT_AXIS_Y\n                tc.x=(1.0-aspectPos)-(((1.0-aspectPos)-tc.x)/aspectTex);\n            #endif\n        #endif\n\n        #ifdef TEX_TRANSFORM\n            vec3 coordinates=vec3(tc.x, tc.y,1.0);\n            tc=(transform * coordinates ).xy;\n        #endif\n\n        blendRGBA=texture(image,tc);\n\n        vec3 blend=blendRGBA.rgb;\n        vec4 baseRGBA=texture(tex,texCoord);\n        vec3 base=baseRGBA.rgb;\n\n\n        #ifdef PREMUL\n            blend.rgb = (blend.rgb) + (base.rgb * (1.0 - blendRGBA.a));\n        #endif\n\n        vec3 colNew=_blend(base,blend);\n\n\n\n\n        #ifdef REMOVE_ALPHA_SRC\n            blendRGBA.a=1.0;\n        #endif\n\n        #ifdef HAS_TEXTUREALPHA\n            vec4 colImgAlpha=texture(imageAlpha,tc);\n            float colImgAlphaAlpha=colImgAlpha.a;\n\n            #ifdef ALPHA_FROM_LUMINANCE\n                vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n                colImgAlphaAlpha=(gray.r+gray.g+gray.b)/3.0;\n            #endif\n\n            #ifdef ALPHA_FROM_INV_UMINANCE\n                vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n                colImgAlphaAlpha=1.0-(gray.r+gray.g+gray.b)/3.0;\n            #endif\n\n            #ifdef INVERT_ALPHA\n                colImgAlphaAlpha=clamp(colImgAlphaAlpha,0.0,1.0);\n                colImgAlphaAlpha=1.0-colImgAlphaAlpha;\n            #endif\n\n            blendRGBA.a=colImgAlphaAlpha*blendRGBA.a;\n        #endif\n    #endif\n\n    float am=amount;\n\n    #ifdef CLIP_REPEAT\n        if(tc.y>1.0 || tc.y<0.0 || tc.x>1.0 || tc.x<0.0)\n        {\n            // colNew.rgb=vec3(0.0);\n            am=0.0;\n        }\n    #endif\n\n    #ifdef ASPECT_RATIO\n        #ifdef ASPECT_CROP\n            if(tc.y>1.0 || tc.y<0.0 || tc.x>1.0 || tc.x<0.0)\n            {\n                colNew.rgb=base.rgb;\n                am=0.0;\n            }\n\n        #endif\n    #endif\n\n\n\n    #ifndef PREMUL\n        blendRGBA.rgb=mix(colNew,base,1.0-(am*blendRGBA.a));\n        blendRGBA.a=clamp(baseRGBA.a+(blendRGBA.a*am),0.,1.);\n    #endif\n\n    #ifdef PREMUL\n        // premultiply\n        // blendRGBA.rgb = (blendRGBA.rgb) + (baseRGBA.rgb * (1.0 - blendRGBA.a));\n        blendRGBA=vec4(\n            mix(colNew.rgb,base,1.0-(am*blendRGBA.a)),\n            blendRGBA.a*am+baseRGBA.a\n            );\n    #endif\n\n    #ifdef ALPHA_MASK\n    blendRGBA.a=baseRGBA.a;\n    #endif\n\n    outColor=blendRGBA;\n}\n\n\n\n\n\n\n\n",
    drawimage_vert:
      "IN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\n\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nOUT vec2 texCoord;\n// OUT vec3 norm;\n\n#ifdef TEX_TRANSFORM\n    UNI float posX;\n    UNI float posY;\n    UNI float scaleX;\n    UNI float scaleY;\n    UNI float rotate;\n    OUT mat3 transform;\n#endif\n\nvoid main()\n{\n   texCoord=attrTexCoord;\n//   norm=attrVertNormal;\n\n   #ifdef TEX_TRANSFORM\n        vec3 coordinates=vec3(attrTexCoord.x, attrTexCoord.y,1.0);\n        float angle = radians( rotate );\n        vec2 scale= vec2(scaleX,scaleY);\n        vec2 translate= vec2(posX,posY);\n\n        transform = mat3(   scale.x * cos( angle ), scale.x * sin( angle ), 0.0,\n            - scale.y * sin( angle ), scale.y * cos( angle ), 0.0,\n            - 0.5 * scale.x * cos( angle ) + 0.5 * scale.y * sin( angle ) - 0.5 * translate.x*2.0 + 0.5,  - 0.5 * scale.x * sin( angle ) - 0.5 * scale.y * cos( angle ) - 0.5 * translate.y*2.0 + 0.5, 1.0);\n   #endif\n\n   gl_Position = projMatrix * mvMatrix * vec4(vPosition,  1.0);\n}\n",
  };
  const t = i.inTrigger("render"),
    n = CGL.TextureEffect.AddBlendSelect(i, "blendMode"),
    s = i.inValueSlider("amount", 1),
    r = i.inTexture("Image"),
    a = i.inValueBool("Premultiplied", false),
    o = i.inValueBool("Alpha Mask", false),
    l = i.inValueBool("removeAlphaSrc", false),
    u = i.inTexture("Mask"),
    c = i.inValueSelect(
      "Mask Src",
      ["alpha channel", "luminance", "luminance inv"],
      "luminance"
    ),
    h = i.inValueBool("Invert alpha channel"),
    g = i.inValueBool("Aspect Ratio", false),
    d = i.inValueSelect("Stretch Axis", ["X", "Y"], "X"),
    p = i.inValueSlider("Position", 0),
    m = i.inValueBool("Crop", false),
    f = i.outTrigger("trigger");
  n.set("normal");
  const _ = i.patch.cgl;
  const v = new CGL.Shader(_, "drawimage");
  u.onLinkChanged = b;
  i.setPortGroup("Mask", [u, c, h]);
  i.setPortGroup("Aspect Ratio", [g, p, m, d]);
  function b() {
    if (u.isLinked()) {
      l.setUiAttribs({ greyout: true });
      c.setUiAttribs({ greyout: false });
      h.setUiAttribs({ greyout: false });
    } else {
      l.setUiAttribs({ greyout: false });
      c.setUiAttribs({ greyout: true });
      h.setUiAttribs({ greyout: true });
    }
  }
  i.toWorkPortsNeedToBeLinked(r);
  v.setSource(e.drawimage_vert, e.drawimage_frag);
  const x = new CGL.Uniform(v, "t", "tex", 0),
    I = new CGL.Uniform(v, "t", "image", 1),
    A = new CGL.Uniform(v, "t", "imageAlpha", 2),
    E = new CGL.Uniform(v, "f", "aspectTex", 1),
    T = new CGL.Uniform(v, "f", "aspectPos", p);
  g.onChange = m.onChange = d.onChange = y;
  function y() {
    v.removeDefine("ASPECT_AXIS_X");
    v.removeDefine("ASPECT_AXIS_Y");
    v.removeDefine("ASPECT_CROP");
    p.setUiAttribs({ greyout: !g.get() });
    m.setUiAttribs({ greyout: !g.get() });
    d.setUiAttribs({ greyout: !g.get() });
    if (g.get()) {
      v.define("ASPECT_RATIO");
      if (m.get()) v.define("ASPECT_CROP");
      if (d.get() == "X") v.define("ASPECT_AXIS_X");
      if (d.get() == "Y") v.define("ASPECT_AXIS_Y");
    } else {
      v.removeDefine("ASPECT_RATIO");
      if (m.get()) v.define("ASPECT_CROP");
      if (d.get() == "X") v.define("ASPECT_AXIS_X");
      if (d.get() == "Y") v.define("ASPECT_AXIS_Y");
    }
  }
  c.set("alpha channel");
  const C = i.inValueBool("flip x");
  const S = i.inValueBool("flip y");
  let L = i.inValueBool("Transform");
  let O = i.inValueSlider("Scale X", 1);
  let N = i.inValueSlider("Scale Y", 1);
  let w = i.inValue("Position X", 0);
  let M = i.inValue("Position Y", 0);
  let B = i.inValue("Rotation", 0);
  const P = i.inValueBool("Clip Repeat", false);
  const k = new CGL.Uniform(v, "f", "scaleX", O);
  const R = new CGL.Uniform(v, "f", "scaleY", N);
  const V = new CGL.Uniform(v, "f", "posX", w);
  const G = new CGL.Uniform(v, "f", "posY", M);
  const U = new CGL.Uniform(v, "f", "rotate", B);
  L.onChange = D;
  function D() {
    v.toggleDefine("TEX_TRANSFORM", L.get());
    O.setUiAttribs({ greyout: !L.get() });
    N.setUiAttribs({ greyout: !L.get() });
    w.setUiAttribs({ greyout: !L.get() });
    M.setUiAttribs({ greyout: !L.get() });
    B.setUiAttribs({ greyout: !L.get() });
  }
  CGL.TextureEffect.setupBlending(i, v, n, s);
  const F = new CGL.Uniform(v, "f", "amount", s);
  t.onTriggered = z;
  P.onChange =
    u.onChange =
    a.onChange =
    o.onChange =
    h.onChange =
    S.onChange =
    C.onChange =
    l.onChange =
    c.onChange =
      j;
  D();
  b();
  y();
  j();
  function j() {
    v.toggleDefine("REMOVE_ALPHA_SRC", l.get());
    v.toggleDefine("ALPHA_MASK", o.get());
    v.toggleDefine("CLIP_REPEAT", P.get());
    v.toggleDefine("HAS_TEXTUREALPHA", u.get() && u.get().tex);
    v.toggleDefine("TEX_FLIP_X", C.get());
    v.toggleDefine("TEX_FLIP_Y", S.get());
    v.toggleDefine("INVERT_ALPHA", h.get());
    v.toggleDefine("ALPHA_FROM_LUMINANCE", c.get() == "luminance");
    v.toggleDefine("ALPHA_FROM_INV_UMINANCE", c.get() == "luminance_inv");
    v.toggleDefine("PREMUL", a.get());
  }
  function z() {
    if (!CGL.TextureEffect.checkOpInEffect(i)) return;
    const e = r.get();
    if (e && e.tex && s.get() > 0) {
      _.pushShader(v);
      _.currentTextureEffect.bind();
      const t = _.currentTextureEffect.getCurrentSourceTexture();
      _.setTexture(0, t.tex);
      if (t && e) {
        if (
          e.textureType != t.textureType &&
          (e.textureType != CGL.Texture.TYPE_FLOAT ||
            t.textureType != CGL.Texture.TYPE_FLOAT)
        )
          i.setUiError(
            "textypediff",
            "Drawing 32bit texture into an 8 bit can result in data/precision loss",
            1
          );
        else i.setUiError("textypediff", null);
      }
      const n =
        (1 /
          (_.currentTextureEffect.getWidth() /
            _.currentTextureEffect.getHeight())) *
        (e.width / e.height);
      E.setValue(n);
      _.setTexture(1, e.tex);
      if (u.get() && u.get().tex) {
        _.setTexture(2, u.get().tex);
      }
      _.pushBlendMode(CGL.BLEND_NONE, true);
      _.currentTextureEffect.finish();
      _.popBlendMode();
      _.popShader();
    }
    f.trigger();
  }
};
Ops.Gl.TextureEffects.DrawImage_v3.prototype = new CABLES.Op();
CABLES.OPS["8f6b2f15-fcb0-4597-90c0-e5173f2969fe"] = {
  f: Ops.Gl.TextureEffects.DrawImage_v3,
  objName: "Ops.Gl.TextureEffects.DrawImage_v3",
};
Ops.Gl.TextureEffects.ImageCompose_v3 = function () {
  CABLES.Op.apply(this, arguments);
  const n = this;
  const e = {
    imgcomp_frag:
      "IN vec2 texCoord;\nUNI vec4 bgColor;\nUNI sampler2D tex;\n\nvoid main()\n{\n\n    #ifndef USE_TEX\n        outColor=bgColor;\n    #endif\n    #ifdef USE_TEX\n        outColor=texture(tex,texCoord);\n    #endif\n\n\n\n}\n",
  };
  const i = n.patch.cgl,
    t = n.inTrigger("Render"),
    s = n.inTexture("Base Texture"),
    r = n.inSwitch("Size", ["Auto", "Manual"], "Auto"),
    a = n.inValueInt("Width", 640),
    o = n.inValueInt("Height", 480),
    l = n.inSwitch("Filter", ["nearest", "linear", "mipmap"], "linear"),
    u = n.inValueSelect(
      "Wrap",
      ["clamp to edge", "repeat", "mirrored repeat"],
      "repeat"
    ),
    c = n.inDropDown(
      "Pixel Format",
      CGL.Texture.PIXELFORMATS,
      CGL.Texture.PFORMATSTR_RGBA8UB
    ),
    h = n.inValueSlider("R", 0),
    g = n.inValueSlider("G", 0),
    d = n.inValueSlider("B", 0),
    p = n.inValueSlider("A", 0),
    m = n.outTrigger("Next"),
    f = n.outTexture("texture_out", CGL.Texture.getEmptyTexture(i)),
    _ = n.outNumber("Aspect Ratio"),
    v = n.outNumber("Texture Width"),
    b = n.outNumber("Texture Height");
  n.setPortGroup("Texture Size", [r, a, o]);
  n.setPortGroup("Texture Parameters", [u, l, c]);
  h.setUiAttribs({ colorPick: true });
  n.setPortGroup("Color", [h, g, d, p]);
  const x = [0, 0, 0, 0];
  let I = null;
  let A = null;
  let E = true;
  let T = false;
  let y = null;
  let C = null;
  let S = null;
  u.onChange = l.onChange = c.onChange = P;
  s.onLinkChanged = r.onChange = G;
  t.onTriggered = n.preRender = D;
  G();
  function L() {
    if (I) I.delete();
    if (A) A.delete();
    I = new CGL.TextureEffect(i, { isFloatingPointTexture: w() });
    A = new CGL.Texture(i, {
      name: "image_compose_v2_" + n.id,
      isFloatingPointTexture: w(),
      filter: O(),
      wrap: N(),
      width: M(),
      height: B(),
    });
    I.setSourceTexture(A);
    v.set(M());
    b.set(B());
    _.set(M() / B());
    f.set(CGL.Texture.getEmptyTexture(i));
    E = false;
    G();
  }
  function O() {
    if (l.get() == "nearest") return CGL.Texture.FILTER_NEAREST;
    else if (l.get() == "linear") return CGL.Texture.FILTER_LINEAR;
    else if (l.get() == "mipmap") return CGL.Texture.FILTER_MIPMAP;
  }
  function N() {
    if (u.get() == "repeat") return CGL.Texture.WRAP_REPEAT;
    else if (u.get() == "mirrored repeat")
      return CGL.Texture.WRAP_MIRRORED_REPEAT;
    else if (u.get() == "clamp to edge") return CGL.Texture.WRAP_CLAMP_TO_EDGE;
  }
  function w() {
    T = c.get() == CGL.Texture.PFORMATSTR_RGBA32F;
    return T;
  }
  function M() {
    if (s.get() && r.get() == "Auto") return s.get().width;
    if (r.get() == "Auto") return i.getViewPort()[2];
    return Math.ceil(a.get());
  }
  function B() {
    if (s.get() && r.get() == "Auto") return s.get().height;
    else if (r.get() == "Auto") return i.getViewPort()[3];
    else return Math.ceil(o.get());
  }
  function P() {
    E = true;
  }
  function k() {
    if (
      (M() != A.width ||
        B() != A.height ||
        A.isFloatingPoint() != w() ||
        A.filter != O() ||
        A.wrap != N()) &&
      M() !== 0 &&
      B() !== 0
    ) {
      L();
      I.setSourceTexture(A);
      f.set(CGL.Texture.getEmptyTexture(i));
      f.set(A);
      R();
    }
  }
  function R() {
    let e = null;
    if (r.get() == "Manual") {
      e = null;
    } else if (r.get() == "Auto") {
      if (s.get()) e = "Input Texture";
      else e = "Canvas Size";
      e += ": " + M() + " x " + B();
    }
    let t = false;
    t = r.uiAttribs.info != e;
    r.setUiAttribs({ info: e });
    if (t) n.refreshParams();
  }
  function V() {
    if (y) y.toggleDefine("USE_TEX", s.isLinked());
  }
  function G() {
    h.setUiAttribs({ greyout: s.isLinked() });
    d.setUiAttribs({ greyout: s.isLinked() });
    g.setUiAttribs({ greyout: s.isLinked() });
    p.setUiAttribs({ greyout: s.isLinked() });
    a.setUiAttribs({ greyout: r.get() == "Auto" });
    o.setUiAttribs({ greyout: r.get() == "Auto" });
    a.setUiAttribs({ hideParam: r.get() != "Manual" });
    o.setUiAttribs({ hideParam: r.get() != "Manual" });
    if (A)
      if (w() && O() == CGL.Texture.FILTER_MIPMAP)
        n.setUiError(
          "fpmipmap",
          "Don't use mipmap and 32bit at the same time, many systems do not support this."
        );
      else n.setUiError("fpmipmap", null);
    R();
    V();
  }
  n.preRender = () => {
    D();
  };
  function U() {
    if (!y) {
      y = new CGL.Shader(i, "copytextureshader");
      y.setSource(y.getDefaultVertexShader(), e.imgcomp_frag);
      C = new CGL.Uniform(y, "t", "tex", 0);
      S = new CGL.Uniform(y, "4f", "bgColor", h, g, d, p);
      V();
    }
    i.pushShader(y);
    i.currentTextureEffect.bind();
    if (s.get()) i.setTexture(0, s.get().tex);
    i.currentTextureEffect.finish();
    i.popShader();
  }
  function D() {
    if (!I || E) L();
    const e = i.getViewPort();
    x[0] = e[0];
    x[1] = e[1];
    x[2] = e[2];
    x[3] = e[3];
    i.pushBlend(false);
    k();
    const t = i.currentTextureEffect;
    i.currentTextureEffect = I;
    i.currentTextureEffect.imgCompVer = 3;
    i.currentTextureEffect.width = a.get();
    i.currentTextureEffect.height = o.get();
    I.setSourceTexture(A);
    I.startEffect(s.get() || CGL.Texture.getEmptyTexture(i, T), true);
    U();
    m.trigger();
    f.set(CGL.Texture.getEmptyTexture(i));
    f.set(I.getCurrentSourceTexture());
    I.endEffect();
    i.setViewPort(x[0], x[1], x[2], x[3]);
    i.popBlend(false);
    i.currentTextureEffect = t;
  }
};
Ops.Gl.TextureEffects.ImageCompose_v3.prototype = new CABLES.Op();
CABLES.OPS["e890a050-11b7-456e-b09b-d08cd9c1ee41"] = {
  f: Ops.Gl.TextureEffects.ImageCompose_v3,
  objName: "Ops.Gl.TextureEffects.ImageCompose_v3",
};
Ops.Gl.TextureEffects.PixelDisplacement_v4 = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {
    pixeldisplace3_frag:
      "IN vec2 texCoord;\nUNI sampler2D tex;\nUNI sampler2D displaceTex;\nUNI float amountX;\nUNI float amountY;\nUNI float amount;\n\n{{CGL.BLENDMODES3}}\n\nvec3 getOffset(vec3 offset)\n{\n    #ifdef ZERO_BLACK\n        return offset;\n    #endif\n\n    #ifdef ZERO_GREY\n        return offset*2.0-1.0;\n    #endif\n}\n\nfloat getOffset(float offset)\n{\n    #ifdef ZERO_BLACK\n        return offset;\n    #endif\n\n    #ifdef ZERO_GREY\n        return offset*2.0-1.0;\n    #endif\n}\n\nvoid main()\n{\n    vec4 rgba=texture(displaceTex,texCoord);\n    vec3 offset=rgba.rgb*rgba.a;\n    float x,y;\n\n    #ifdef INPUT_REDGREEN\n        offset=getOffset(offset);\n        x=offset.r*amountX+texCoord.x;\n        y=offset.g*amountY+texCoord.y;\n    #endif\n    #ifdef INPUT_RED\n        offset=getOffset(offset);\n        x=offset.r*amountX+texCoord.x;\n        y=offset.r*amountY+texCoord.y;\n    #endif\n    #ifdef INPUT_GREEN\n        offset=getOffset(offset);\n        x=offset.g*amountX+texCoord.x;\n        y=offset.g*amountY+texCoord.y;\n    #endif\n    #ifdef INPUT_BLUE\n        offset=getOffset(offset);\n        x=offset.b*amountX+texCoord.x;\n        y=offset.b*amountY+texCoord.y;\n    #endif\n    #ifdef INPUT_LUMINANCE\n        float o=dot(vec3(0.2126,0.7152,0.0722), offset);\n        o=getOffset(o);\n        x=o*amountX+texCoord.x;\n        y=o*amountY+texCoord.y;\n    #endif\n    #ifdef WRAP_CLAMP\n        x=clamp(x,0.0,1.0);\n        y=clamp(y,0.0,1.0);\n    #endif\n    #ifdef WRAP_REPEAT\n        x=mod(x,1.0);\n        y=mod(y,1.0);\n    #endif\n    #ifdef WRAP_MIRROR\n        float mx=mod(x,2.0);\n        float my=mod(y,2.0);\n        x=abs((floor(mx)-fract(mx)));\n        y=abs((floor(my)-fract(my)));\n    #endif\n\n\n\n    vec4 col=texture(tex,vec2(x,y));\n    vec4 base=texture(tex,texCoord);\n\n    base.a=0.0;\n\n    outColor=cgl_blendPixel(base,col,amount);\n}\n",
  };
  const n = e.inTrigger("render"),
    i = e.inTexture("displaceTex"),
    s = CGL.TextureEffect.AddBlendSelect(e, "Blend Mode", "normal"),
    r = e.inValueSlider("Amount", 1),
    a = e.inValueSlider("amount X", 0.2),
    o = e.inValueSlider("amount Y", 0.2),
    l = e.inSwitch("Wrap", ["Mirror", "Clamp", "Repeat"], "Mirror"),
    u = e.inValueSelect(
      "Input",
      ["Luminance", "RedGreen", "Red", "Green", "Blue"],
      "Luminance"
    ),
    c = e.inSwitch("Zero Displace", ["Grey", "Black"], "Grey"),
    h = e.outTrigger("trigger");
  e.setPortGroup("Axis Displacement Strength", [a, o]);
  e.setPortGroup("Modes", [l, u]);
  e.toWorkPortsNeedToBeLinked(i);
  const g = e.patch.cgl,
    d = new CGL.Shader(g, e.name);
  d.setSource(d.getDefaultVertexShader(), t.pixeldisplace3_frag);
  const p = new CGL.Uniform(d, "t", "tex", 0),
    m = new CGL.Uniform(d, "t", "displaceTex", 1),
    f = new CGL.Uniform(d, "f", "amountX", a),
    _ = new CGL.Uniform(d, "f", "amountY", o),
    v = new CGL.Uniform(d, "f", "amount", r);
  c.onChange = b;
  l.onChange = x;
  u.onChange = I;
  x();
  I();
  b();
  CGL.TextureEffect.setupBlending(e, d, s, r);
  function b() {
    d.removeDefine("ZERO_BLACK");
    d.removeDefine("ZERO_GREY");
    d.define("ZERO_" + (c.get() + "").toUpperCase());
  }
  function x() {
    d.removeDefine("WRAP_CLAMP");
    d.removeDefine("WRAP_REPEAT");
    d.removeDefine("WRAP_MIRROR");
    d.define("WRAP_" + (l.get() + "").toUpperCase());
  }
  function I() {
    d.removeDefine("INPUT_LUMINANCE");
    d.removeDefine("INPUT_REDGREEN");
    d.removeDefine("INPUT_RED");
    d.define("INPUT_" + (u.get() + "").toUpperCase());
  }
  n.onTriggered = function () {
    if (!CGL.TextureEffect.checkOpInEffect(e, 3)) return;
    if (i.get()) {
      g.pushShader(d);
      g.currentTextureEffect.bind();
      g.setTexture(0, g.currentTextureEffect.getCurrentSourceTexture().tex);
      if (i.get()) g.setTexture(1, i.get().tex);
      g.currentTextureEffect.finish();
      g.popShader();
    }
    h.trigger();
  };
};
Ops.Gl.TextureEffects.PixelDisplacement_v4.prototype = new CABLES.Op();
CABLES.OPS["c00f79f2-0505-4b4f-b0bf-10ef7875dd87"] = {
  f: Ops.Gl.TextureEffects.PixelDisplacement_v4,
  objName: "Ops.Gl.TextureEffects.PixelDisplacement_v4",
};
Ops.Gl.Meshes.FullscreenRectangle = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {
    shader_frag:
      "UNI sampler2D tex;\nIN vec2 texCoord;\n\nvoid main()\n{\n    outColor= texture(tex,texCoord);\n}\n\n",
    shader_vert:
      "{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nOUT vec2 texCoord;\nIN vec2 attrTexCoord;\n\nvoid main()\n{\n   vec4 pos=vec4(vPosition,  1.0);\n\n   texCoord=vec2(attrTexCoord.x,(1.0-attrTexCoord.y));\n\n   gl_Position = projMatrix * mvMatrix * pos;\n}\n",
  };
  const n = e.inTrigger("render"),
    i = e.inSwitch("Scale", ["Stretch", "Fit"], "Fit"),
    s = e.inValueBool("Flip Y"),
    r = e.inValueBool("Flip X"),
    a = e.inTexture("Texture"),
    o = e.outTrigger("trigger");
  const l = e.patch.cgl;
  let u = null;
  let c = new CGL.Geometry("fullscreen rectangle");
  let h = 0,
    g = 0,
    d = 0,
    p = 0,
    m = 0;
  r.onChange = T;
  s.onChange = T;
  n.onTriggered = E;
  a.onLinkChanged = I;
  e.toWorkPortsNeedToBeLinked(n);
  const f = new CGL.Shader(l, "fullscreenrectangle");
  f.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG"]);
  f.setSource(t.shader_vert, t.shader_frag);
  f.fullscreenRectUniform = new CGL.Uniform(f, "t", "tex", 0);
  f.aspectUni = new CGL.Uniform(f, "f", "aspectTex", 0);
  let _ = false;
  let v = true;
  let b = false;
  let x = [];
  I();
  a.onChange = function () {
    v = true;
  };
  function I() {
    if (!CABLES.UI) return;
    s.setUiAttribs({ greyout: !a.isLinked() });
    r.setUiAttribs({ greyout: !a.isLinked() });
    i.setUiAttribs({ greyout: !a.isLinked() });
  }
  function A() {
    let e = a.get();
    if (e) _ = true;
    else _ = false;
  }
  e.preRender = function () {
    A();
    f.bind();
    if (u) u.render(f);
    E();
  };
  i.onChange = () => {
    b = i.get() == "Fit";
  };
  function E() {
    if (l.getViewPort()[2] != p || l.getViewPort()[3] != m || !u) y();
    if (v) A();
    l.pushPMatrix();
    mat4.identity(l.pMatrix);
    mat4.ortho(l.pMatrix, 0, p, m, 0, -10, 1e3);
    l.pushModelMatrix();
    mat4.identity(l.mMatrix);
    l.pushViewMatrix();
    mat4.identity(l.vMatrix);
    if (b && a.get()) {
      const n = a.get().width / a.get().height;
      let e = m;
      let t = m * n;
      if (t > p) {
        e = (p * 1) / n;
        t = p;
      }
      x[0] = l.getViewPort()[0];
      x[1] = l.getViewPort()[1];
      x[2] = l.getViewPort()[2];
      x[3] = l.getViewPort()[3];
      l.setViewPort((p - t) / 2, (m - e) / 2, t, e);
    }
    if (_) {
      if (a.get()) l.setTexture(0, a.get().tex);
      u.render(f);
    } else {
      u.render(l.getShader());
    }
    l.gl.clear(l.gl.DEPTH_BUFFER_BIT);
    l.popPMatrix();
    l.popModelMatrix();
    l.popViewMatrix();
    if (b && a.get()) l.setViewPort(x[0], x[1], x[2], x[3]);
    o.trigger();
  }
  function T() {
    u = null;
  }
  function y() {
    const e = l.getViewPort();
    if (e[2] == p && e[3] == m && u) return;
    let t = 0,
      n = 0;
    p = e[2];
    m = e[3];
    c.vertices = new Float32Array([
      t + p,
      n + m,
      0,
      t,
      n + m,
      0,
      t + p,
      n,
      0,
      t,
      n,
      0,
    ]);
    let i = null;
    if (s.get()) i = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
    else i = new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]);
    if (r.get()) {
      i[0] = 0;
      i[2] = 1;
      i[4] = 0;
      i[6] = 1;
    }
    c.setTexCoords(i);
    c.verticesIndices = new Uint16Array([2, 1, 0, 3, 1, 2]);
    c.vertexNormals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
    c.tangents = new Float32Array([-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0]);
    c.biTangents == new Float32Array([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0]);
    if (!u) u = new CGL.Mesh(l, c);
    else u.setGeom(c);
  }
};
Ops.Gl.Meshes.FullscreenRectangle.prototype = new CABLES.Op();
CABLES.OPS["255bd15b-cc91-4a12-9b4e-53c710cbb282"] = {
  f: Ops.Gl.Meshes.FullscreenRectangle,
  objName: "Ops.Gl.Meshes.FullscreenRectangle",
};
Ops.Math.Delta = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValue("Value"),
    i = e.inValueBool("Change Always", false),
    s = e.inTrigger("Reset"),
    r = e.outNumber("Delta");
  n.changeAlways = false;
  let a = 0;
  let o = true;
  i.onChange = function () {
    n.changeAlways = i.get();
  };
  s.onTriggered = function () {
    o = true;
  };
  n.onChange = function () {
    let e = a - n.get();
    a = n.get();
    if (o) {
      o = false;
      return;
    }
    r.set(e);
  };
};
Ops.Math.Delta.prototype = new CABLES.Op();
CABLES.OPS["0f203337-e13c-47ec-a09f-b309212540b0"] = {
  f: Ops.Math.Delta,
  objName: "Ops.Math.Delta",
};
Ops.Ui.VizNumber = function () {
  CABLES.Op.apply(this, arguments);
  const n = this;
  const e = {};
  const i = n.inFloat("Number", 0);
  const s = n.outNumber("Result");
  n.setUiAttrib({ widthOnlyGrow: true });
  i.onChange = () => {
    let t = i.get();
    if (n.patch.isEditorMode()) {
      let e = "";
      if (t === null) e = "null";
      else if (t === undefined) e = "undefined";
      else {
        e = "" + Math.round(t * 1e4) / 1e4;
        if (e[0] != "-") e = " " + e;
      }
      n.setUiAttribs({ extendTitle: e });
    }
    s.set(t);
  };
};
Ops.Ui.VizNumber.prototype = new CABLES.Op();
CABLES.OPS["2b60d12d-2884-4ad0-bda4-0caeb6882f5c"] = {
  f: Ops.Ui.VizNumber,
  objName: "Ops.Ui.VizNumber",
};
Ops.Math.Compare.LessThan = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValue("number1");
  const i = e.inValue("number2");
  const s = e.outBoolNum("result");
  e.setTitle("<");
  n.onChange = r;
  i.onChange = r;
  r();
  function r() {
    s.set(n.get() < i.get());
  }
};
Ops.Math.Compare.LessThan.prototype = new CABLES.Op();
CABLES.OPS["04fd113f-ade1-43fb-99fa-f8825f8814c0"] = {
  f: Ops.Math.Compare.LessThan,
  objName: "Ops.Math.Compare.LessThan",
};
Ops.Sidebar.Sidebar = function () {
  CABLES.Op.apply(this, arguments);
  const a = this;
  const n = {
    style_css:
      " /*\n * SIDEBAR\n  http://danielstern.ca/range.css/#/\n  https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-progress-value\n */\n\n.sidebar-icon-undo\n{\n    width:10px;\n    height:10px;\n    background-image: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='grey' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 7v6h6'/%3E%3Cpath d='M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13'/%3E%3C/svg%3E\");\n    background-size: 19px;\n    background-repeat: no-repeat;\n    top: -19px;\n    margin-top: -7px;\n}\n\n.icon-chevron-down {\n    top: 2px;\n    right: 9px;\n}\n\n.iconsidebar-chevron-up,.sidebar__close-button {\n\tbackground-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tdXAiPjxwb2x5bGluZSBwb2ludHM9IjE4IDE1IDEyIDkgNiAxNSI+PC9wb2x5bGluZT48L3N2Zz4=);\n}\n\n.iconsidebar-minimizebutton {\n    background-position: 98% center;\n    background-repeat: no-repeat;\n}\n\n.sidebar-cables-right\n{\n    right: 15px;\n    left: initial !important;\n}\n\n.sidebar-cables {\n    --sidebar-color: #07f78c;\n    --sidebar-width: 220px;\n    --sidebar-border-radius: 10px;\n    --sidebar-monospace-font-stack: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n    --sidebar-hover-transition-time: .2s;\n\n    position: absolute;\n    top: 15px;\n    left: 15px;\n    border-radius: var(--sidebar-border-radius);\n    z-index: 100000;\n    color: #BBBBBB;\n    width: var(  --sidebar-width);\n    max-height: 100%;\n    box-sizing: border-box;\n    overflow-y: auto;\n    overflow-x: hidden;\n    font-size: 13px;\n    font-family: Arial;\n    line-height: 1em; /* prevent emojis from breaking height of the title */\n}\n\n.sidebar-cables::selection {\n    background-color: var(--sidebar-color);\n    color: #EEEEEE;\n}\n\n.sidebar-cables::-webkit-scrollbar {\n    background-color: transparent;\n    --cables-scrollbar-width: 8px;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables::-webkit-scrollbar-track {\n    background-color: transparent;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables::-webkit-scrollbar-thumb {\n    background-color: #333333;\n    border-radius: 4px;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables--closed {\n    width: auto;\n}\n\n.sidebar__close-button {\n    background-color: #222;\n    /*-webkit-user-select: none;  */\n    /*-moz-user-select: none;     */\n    /*-ms-user-select: none;      */\n    /*user-select: none;          */\n    /*transition: background-color var(--sidebar-hover-transition-time);*/\n    /*color: #CCCCCC;*/\n    height: 2px;\n    /*border-bottom:20px solid #222;*/\n\n    /*box-sizing: border-box;*/\n    /*padding-top: 2px;*/\n    /*text-align: center;*/\n    /*cursor: pointer;*/\n    /*border-radius: 0 0 var(--sidebar-border-radius) var(--sidebar-border-radius);*/\n    /*opacity: 1.0;*/\n    /*transition: opacity 0.3s;*/\n    /*overflow: hidden;*/\n}\n\n.sidebar__close-button-icon {\n    display: inline-block;\n    /*opacity: 0;*/\n    width: 20px;\n    height: 20px;\n    /*position: relative;*/\n    /*top: -1px;*/\n\n\n}\n\n.sidebar--closed {\n    width: auto;\n    margin-right: 20px;\n}\n\n.sidebar--closed .sidebar__close-button {\n    margin-top: 8px;\n    margin-left: 8px;\n    padding:10px;\n\n    height: 25px;\n    width:25px;\n    border-radius: 50%;\n    cursor: pointer;\n    opacity: 0.3;\n    background-repeat: no-repeat;\n    background-position: center center;\n    transform:rotate(180deg);\n}\n\n.sidebar--closed .sidebar__group\n{\n    display:none;\n\n}\n.sidebar--closed .sidebar__close-button-icon {\n    background-position: 0px 0px;\n}\n\n.sidebar__close-button:hover {\n    background-color: #111111;\n    opacity: 1.0 !important;\n}\n\n/*\n * SIDEBAR ITEMS\n */\n\n.sidebar__items {\n    /* max-height: 1000px; */\n    /* transition: max-height 0.5;*/\n    background-color: #222;\n    padding-bottom: 20px;\n}\n\n.sidebar--closed .sidebar__items {\n    /* max-height: 0; */\n    height: 0;\n    display: none;\n    pointer-interactions: none;\n}\n\n.sidebar__item__right {\n    float: right;\n}\n\n/*\n * SIDEBAR GROUP\n */\n\n.sidebar__group {\n    /*background-color: #1A1A1A;*/\n    overflow: hidden;\n    box-sizing: border-box;\n    animate: height;\n    /*background-color: #151515;*/\n    /* max-height: 1000px; */\n    /* transition: max-height 0.5s; */\n--sidebar-group-header-height: 33px;\n}\n\n.sidebar__group-items\n{\n    padding-top: 15px;\n    padding-bottom: 15px;\n}\n\n.sidebar__group--closed {\n    /* max-height: 13px; */\n    height: var(--sidebar-group-header-height);\n}\n\n.sidebar__group-header {\n    box-sizing: border-box;\n    color: #EEEEEE;\n    background-color: #151515;\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n\n    /*height: 100%;//var(--sidebar-group-header-height);*/\n\n    padding-top: 7px;\n    text-transform: uppercase;\n    letter-spacing: 0.08em;\n    cursor: pointer;\n    /*transition: background-color var(--sidebar-hover-transition-time);*/\n    position: relative;\n}\n\n.sidebar__group-header:hover {\n  background-color: #111111;\n}\n\n.sidebar__group-header-title {\n  /*float: left;*/\n  overflow: hidden;\n  padding: 0 15px;\n  padding-top:5px;\n  padding-bottom:10px;\n  font-weight:bold;\n}\n\n.sidebar__group-header-undo {\n    float: right;\n    overflow: hidden;\n    padding-right: 15px;\n    padding-top:5px;\n    font-weight:bold;\n  }\n\n.sidebar__group-header-icon {\n    width: 17px;\n    height: 14px;\n    background-repeat: no-repeat;\n    display: inline-block;\n    position: absolute;\n    background-size: cover;\n\n    /* icon open */\n    /* feather icon: chevron up */\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tdXAiPjxwb2x5bGluZSBwb2ludHM9IjE4IDE1IDEyIDkgNiAxNSI+PC9wb2x5bGluZT48L3N2Zz4=);\n    top: 4px;\n    right: 5px;\n    opacity: 0.0;\n    transition: opacity 0.3;\n}\n\n.sidebar__group-header:hover .sidebar__group-header-icon {\n    opacity: 1.0;\n}\n\n/* icon closed */\n.sidebar__group--closed .sidebar__group-header-icon {\n    /* feather icon: chevron down */\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tZG93biI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+);\n    top: 4px;\n    right: 5px;\n}\n\n/*\n * SIDEBAR ITEM\n */\n\n.sidebar__item\n{\n    box-sizing: border-box;\n    padding: 7px;\n    padding-left:15px;\n    padding-right:15px;\n\n    overflow: hidden;\n    position: relative;\n}\n\n.sidebar__item-label {\n    display: inline-block;\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    width: calc(50% - 7px);\n    margin-right: 7px;\n    margin-top: 2px;\n    text-overflow: ellipsis;\n    /* overflow: hidden; */\n}\n\n.sidebar__item-value-label {\n    font-family: var(--sidebar-monospace-font-stack);\n    display: inline-block;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    white-space: nowrap;\n    max-width: 60%;\n}\n\n.sidebar__item-value-label::selection {\n    background-color: var(--sidebar-color);\n    color: #EEEEEE;\n}\n\n.sidebar__item + .sidebar__item,\n.sidebar__item + .sidebar__group,\n.sidebar__group + .sidebar__item,\n.sidebar__group + .sidebar__group {\n    /*border-top: 1px solid #272727;*/\n}\n\n/*\n * SIDEBAR ITEM TOGGLE\n */\n\n/*.sidebar__toggle */\n.icon_toggle{\n    cursor: pointer;\n}\n\n.sidebar__toggle-input {\n    --sidebar-toggle-input-color: #CCCCCC;\n    --sidebar-toggle-input-color-hover: #EEEEEE;\n    --sidebar-toggle-input-border-size: 2px;\n    display: inline;\n    float: right;\n    box-sizing: border-box;\n    border-radius: 50%;\n    cursor: pointer;\n    --toggle-size: 11px;\n    margin-top: 2px;\n    background-color: transparent !important;\n    border: var(--sidebar-toggle-input-border-size) solid var(--sidebar-toggle-input-color);\n    width: var(--toggle-size);\n    height: var(--toggle-size);\n    transition: background-color var(--sidebar-hover-transition-time);\n    transition: border-color var(--sidebar-hover-transition-time);\n}\n.sidebar__toggle:hover .sidebar__toggle-input {\n    border-color: var(--sidebar-toggle-input-color-hover);\n}\n\n.sidebar__toggle .sidebar__item-value-label {\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    max-width: calc(50% - 12px);\n}\n.sidebar__toggle-input::after { clear: both; }\n\n.sidebar__toggle--active .icon_toggle\n{\n\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1cHgiIHdpZHRoPSIzMHB4IiBmaWxsPSIjMDZmNzhiIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzA2Zjc4YiIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCBjMTIuNjUsMCwyMy0xMC4zNSwyMy0yM2wwLDBjMC0xMi42NS0xMC4zNS0yMy0yMy0yM0gzMHogTTcwLDY3Yy05LjM4OSwwLTE3LTcuNjEtMTctMTdzNy42MTEtMTcsMTctMTdzMTcsNy42MSwxNywxNyAgICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PC9nPjwvZz48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMweiBNNzAsNjdjLTkuMzg5LDAtMTctNy42MS0xNy0xN3M3LjYxMS0xNywxNy0xN3MxNyw3LjYxLDE3LDE3ICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48cGF0aCBmaWxsPSIjMDZmNzhiIiBzdHJva2U9IiMwNmY3OGIiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNyw1MGMwLDEyLjY1LDEwLjM1LDIzLDIzLDIzaDQwICAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMwQzE3LjM1LDI3LDcsMzcuMzUsNyw1MEw3LDUweiI+PC9wYXRoPjwvZz48Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwNmY3OGIiIHN0cm9rZT0iIzA2Zjc4YiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSI3MCIgY3k9IjUwIiByPSIxNyI+PC9jaXJjbGU+PC9nPjxnIGRpc3BsYXk9Im5vbmUiPjxwYXRoIGRpc3BsYXk9ImlubGluZSIgZD0iTTcwLDI1SDMwQzE2LjIxNSwyNSw1LDM2LjIxNSw1LDUwczExLjIxNSwyNSwyNSwyNWg0MGMxMy43ODUsMCwyNS0xMS4yMTUsMjUtMjVTODMuNzg1LDI1LDcwLDI1eiBNNzAsNzEgICBIMzBDMTguNDIxLDcxLDksNjEuNTc5LDksNTBzOS40MjEtMjEsMjEtMjFoNDBjMTEuNTc5LDAsMjEsOS40MjEsMjEsMjFTODEuNTc5LDcxLDcwLDcxeiBNNzAsMzFjLTEwLjQ3NywwLTE5LDguNTIzLTE5LDE5ICAgczguNTIzLDE5LDE5LDE5czE5LTguNTIzLDE5LTE5UzgwLjQ3NywzMSw3MCwzMXogTTcwLDY1Yy04LjI3MSwwLTE1LTYuNzI5LTE1LTE1czYuNzI5LTE1LDE1LTE1czE1LDYuNzI5LDE1LDE1Uzc4LjI3MSw2NSw3MCw2NXoiPjwvcGF0aD48L2c+PC9zdmc+);\n    opacity: 1;\n    transform: rotate(0deg);\n}\n\n\n.icon_toggle\n{\n    float: right;\n    width:40px;\n    height:18px;\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1cHgiIHdpZHRoPSIzMHB4IiBmaWxsPSIjYWFhYWFhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2FhYWFhYSIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCBjMTIuNjUsMCwyMy0xMC4zNSwyMy0yM2wwLDBjMC0xMi42NS0xMC4zNS0yMy0yMy0yM0gzMHogTTcwLDY3Yy05LjM4OSwwLTE3LTcuNjEtMTctMTdzNy42MTEtMTcsMTctMTdzMTcsNy42MSwxNywxNyAgICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PC9nPjwvZz48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMweiBNNzAsNjdjLTkuMzg5LDAtMTctNy42MS0xNy0xN3M3LjYxMS0xNywxNy0xN3MxNyw3LjYxLDE3LDE3ICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48cGF0aCBmaWxsPSIjYWFhYWFhIiBzdHJva2U9IiNhYWFhYWEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNyw1MGMwLDEyLjY1LDEwLjM1LDIzLDIzLDIzaDQwICAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMwQzE3LjM1LDI3LDcsMzcuMzUsNyw1MEw3LDUweiI+PC9wYXRoPjwvZz48Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNhYWFhYWEiIHN0cm9rZT0iI2FhYWFhYSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSI3MCIgY3k9IjUwIiByPSIxNyI+PC9jaXJjbGU+PC9nPjxnIGRpc3BsYXk9Im5vbmUiPjxwYXRoIGRpc3BsYXk9ImlubGluZSIgZD0iTTcwLDI1SDMwQzE2LjIxNSwyNSw1LDM2LjIxNSw1LDUwczExLjIxNSwyNSwyNSwyNWg0MGMxMy43ODUsMCwyNS0xMS4yMTUsMjUtMjVTODMuNzg1LDI1LDcwLDI1eiBNNzAsNzEgICBIMzBDMTguNDIxLDcxLDksNjEuNTc5LDksNTBzOS40MjEtMjEsMjEtMjFoNDBjMTEuNTc5LDAsMjEsOS40MjEsMjEsMjFTODEuNTc5LDcxLDcwLDcxeiBNNzAsMzFjLTEwLjQ3NywwLTE5LDguNTIzLTE5LDE5ICAgczguNTIzLDE5LDE5LDE5czE5LTguNTIzLDE5LTE5UzgwLjQ3NywzMSw3MCwzMXogTTcwLDY1Yy04LjI3MSwwLTE1LTYuNzI5LTE1LTE1czYuNzI5LTE1LDE1LTE1czE1LDYuNzI5LDE1LDE1Uzc4LjI3MSw2NSw3MCw2NXoiPjwvcGF0aD48L2c+PC9zdmc+);\n    background-size: 50px 37px;\n    background-position: -6px -10px;\n    transform: rotate(180deg);\n    opacity: 0.4;\n}\n\n\n\n/*.sidebar__toggle--active .sidebar__toggle-input {*/\n/*    transition: background-color var(--sidebar-hover-transition-time);*/\n/*    background-color: var(--sidebar-toggle-input-color);*/\n/*}*/\n/*.sidebar__toggle--active .sidebar__toggle-input:hover*/\n/*{*/\n/*    background-color: var(--sidebar-toggle-input-color-hover);*/\n/*    border-color: var(--sidebar-toggle-input-color-hover);*/\n/*    transition: background-color var(--sidebar-hover-transition-time);*/\n/*    transition: border-color var(--sidebar-hover-transition-time);*/\n/*}*/\n\n/*\n * SIDEBAR ITEM BUTTON\n */\n\n.sidebar__button {}\n\n.sidebar__button-input {\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    min-height: 24px;\n    background-color: transparent;\n    color: #CCCCCC;\n    box-sizing: border-box;\n    padding-top: 3px;\n    text-align: center;\n    border-radius: 125px;\n    border:2px solid #555;\n    cursor: pointer;\n    padding-bottom: 3px;\n}\n\n.sidebar__button-input.plus, .sidebar__button-input.minus {\n    display: inline-block;\n    min-width: 20px;\n}\n\n.sidebar__button-input:hover {\n  background-color: #333;\n  border:2px solid var(--sidebar-color);\n}\n\n/*\n * VALUE DISPLAY (shows a value)\n */\n\n.sidebar__value-display {}\n\n/*\n * SLIDER\n */\n\n.sidebar__slider {\n    --sidebar-slider-input-height: 3px;\n}\n\n.sidebar__slider-input-wrapper {\n    width: 100%;\n\n    margin-top: 8px;\n    position: relative;\n}\n\n.sidebar__slider-input {\n    -webkit-appearance: none;\n    appearance: none;\n    margin: 0;\n    width: 100%;\n    height: var(--sidebar-slider-input-height);\n    background: #555;\n    cursor: pointer;\n    outline: 0;\n\n    -webkit-transition: .2s;\n    transition: background-color .2s;\n    border: none;\n}\n\n.sidebar__slider-input:focus, .sidebar__slider-input:hover {\n    border: none;\n}\n\n.sidebar__slider-input-active-track {\n    user-select: none;\n    position: absolute;\n    z-index: 11;\n    top: 0;\n    left: 0;\n    background-color: var(--sidebar-color);\n    pointer-events: none;\n    height: var(--sidebar-slider-input-height);\n    max-width: 100%;\n}\n\n/* Mouse-over effects */\n.sidebar__slider-input:hover {\n    /*background-color: #444444;*/\n}\n\n/*.sidebar__slider-input::-webkit-progress-value {*/\n/*    background-color: green;*/\n/*    color:green;*/\n\n/*    }*/\n\n/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */\n\n.sidebar__slider-input::-moz-range-thumb\n{\n    position: absolute;\n    height: 15px;\n    width: 15px;\n    z-index: 900 !important;\n    border-radius: 20px !important;\n    cursor: pointer;\n    background: var(--sidebar-color) !important;\n    user-select: none;\n\n}\n\n.sidebar__slider-input::-webkit-slider-thumb\n{\n    position: relative;\n    appearance: none;\n    -webkit-appearance: none;\n    user-select: none;\n    height: 15px;\n    width: 15px;\n    display: block;\n    z-index: 900 !important;\n    border: 0;\n    border-radius: 20px !important;\n    cursor: pointer;\n    background: #777 !important;\n}\n\n.sidebar__slider-input:hover ::-webkit-slider-thumb {\n    background-color: #EEEEEE !important;\n}\n\n/*.sidebar__slider-input::-moz-range-thumb {*/\n\n/*    width: 0 !important;*/\n/*    height: var(--sidebar-slider-input-height);*/\n/*    background: #EEEEEE;*/\n/*    cursor: pointer;*/\n/*    border-radius: 0 !important;*/\n/*    border: none;*/\n/*    outline: 0;*/\n/*    z-index: 100 !important;*/\n/*}*/\n\n.sidebar__slider-input::-moz-range-track {\n    background-color: transparent;\n    z-index: 11;\n}\n\n/*.sidebar__slider-input::-moz-range-thumb:hover {*/\n  /* background-color: #EEEEEE; */\n/*}*/\n\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input-active-track {*/\n/*    background-color: #EEEEEE;*/\n/*}*/\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input::-moz-range-thumb {*/\n/*    background-color: #fff !important;*/\n/*}*/\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input::-webkit-slider-thumb {*/\n/*    background-color: #EEEEEE;*/\n/*}*/\n\n.sidebar__slider input[type=text],\n.sidebar__slider input[type=paddword]\n{\n    box-sizing: border-box;\n    /*background-color: #333333;*/\n    text-align: right;\n    color: #BBBBBB;\n    display: inline-block;\n    background-color: transparent !important;\n\n    width: 40%;\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n}\n\n.sidebar__slider input[type=text]:active,\n.sidebar__slider input[type=text]:focus,\n.sidebar__slider input[type=text]:hover\n.sidebar__slider input[type=password]:active,\n.sidebar__slider input[type=password]:focus,\n.sidebar__slider input[type=password]:hover\n{\n\n    color: #EEEEEE;\n}\n\n/*\n * TEXT / DESCRIPTION\n */\n\n.sidebar__text .sidebar__item-label {\n    width: auto;\n    display: block;\n    max-height: none;\n    margin-right: 0;\n    line-height: 1.1em;\n}\n\n/*\n * SIDEBAR INPUT\n */\n.sidebar__text-input textarea,\n.sidebar__text-input input[type=text],\n.sidebar__text-input input[type=password] {\n    box-sizing: border-box;\n    background-color: #333333;\n    color: #BBBBBB;\n    display: inline-block;\n    width: 50%;\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    border:1px solid #666;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n}\n\n.sidebar__text-input textarea:focus::placeholder {\n  color: transparent;\n}\n\n.sidebar__color-picker .sidebar__item-label\n{\n    width:45%;\n}\n\n.sidebar__text-input textarea,\n.sidebar__text-input input[type=text]:active,\n.sidebar__text-input input[type=text]:focus,\n.sidebar__text-input input[type=text]:hover,\n.sidebar__text-input input[type=password]:active,\n.sidebar__text-input input[type=password]:focus,\n.sidebar__text-input input[type=password]:hover {\n    background-color: transparent;\n    color: #EEEEEE;\n}\n\n.sidebar__text-input textarea\n{\n    margin-top:10px;\n    height:60px;\n    width:100%;\n}\n\n/*\n * SIDEBAR SELECT\n */\n\n\n\n .sidebar__select {}\n .sidebar__select-select {\n    color: #BBBBBB;\n    /*-webkit-appearance: none;*/\n    /*-moz-appearance: none;*/\n    appearance: none;\n    /*box-sizing: border-box;*/\n    width: 50%;\n    /*height: 20px;*/\n    background-color: #333333;\n    /*background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tZG93biI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+);*/\n    background-repeat: no-repeat;\n    background-position: right center;\n    background-size: 16px 16px;\n    margin: 0;\n    /*padding: 0 2 2 6px;*/\n    border-radius: 5px;\n    border: 1px solid #777;\n    background-color: #444;\n    cursor: pointer;\n    outline: none;\n    padding-left: 5px;\n\n }\n\n.sidebar__select-select:hover,\n.sidebar__select-select:active,\n.sidebar__select-select:active {\n    background-color: #444444;\n    color: #EEEEEE;\n}\n\n/*\n * COLOR PICKER\n */\n\n\n .sidebar__color-picker input[type=text] {\n    box-sizing: border-box;\n    background-color: #333333;\n    color: #BBBBBB;\n    display: inline-block;\n    width: calc(50% - 21px); /* 50% minus space of picker circle */\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n    margin-right: 7px;\n}\n\n.sidebar__color-picker input[type=text]:active,\n.sidebar__color-picker input[type=text]:focus,\n.sidebar__color-picker input[type=text]:hover {\n    background-color: #444444;\n    color: #EEEEEE;\n}\n\ndiv.sidebar__color-picker-color-input,\n.sidebar__color-picker input[type=color],\n.sidebar__palette-picker input[type=color] {\n    display: inline-block;\n    border-radius: 100%;\n    height: 14px;\n    width: 14px;\n\n    padding: 0;\n    border: none;\n    /*border:2px solid red;*/\n    border-color: transparent;\n    outline: none;\n    background: none;\n    appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    cursor: pointer;\n    position: relative;\n    top: 3px;\n}\n.sidebar__color-picker input[type=color]:focus,\n.sidebar__palette-picker input[type=color]:focus {\n    outline: none;\n}\n.sidebar__color-picker input[type=color]::-moz-color-swatch,\n.sidebar__palette-picker input[type=color]::-moz-color-swatch {\n    border: none;\n}\n.sidebar__color-picker input[type=color]::-webkit-color-swatch-wrapper,\n.sidebar__palette-picker input[type=color]::-webkit-color-swatch-wrapper {\n    padding: 0;\n}\n.sidebar__color-picker input[type=color]::-webkit-color-swatch,\n.sidebar__palette-picker input[type=color]::-webkit-color-swatch {\n    border: none;\n    border-radius: 100%;\n}\n\n/*\n * Palette Picker\n */\n.sidebar__palette-picker .sidebar__palette-picker-color-input.first {\n    margin-left: 0;\n}\n.sidebar__palette-picker .sidebar__palette-picker-color-input.last {\n    margin-right: 0;\n}\n.sidebar__palette-picker .sidebar__palette-picker-color-input {\n    margin: 0 4px;\n}\n\n.sidebar__palette-picker .circlebutton {\n    width: 14px;\n    height: 14px;\n    border-radius: 1em;\n    display: inline-block;\n    top: 3px;\n    position: relative;\n}\n\n/*\n * Preset\n */\n.sidebar__item-presets-preset\n{\n    padding:4px;\n    cursor:pointer;\n    padding-left:8px;\n    padding-right:8px;\n    margin-right:4px;\n    background-color:#444;\n}\n\n.sidebar__item-presets-preset:hover\n{\n    background-color:#666;\n}\n\n.sidebar__greyout\n{\n    background: #222;\n    opacity: 0.8;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 1000;\n    right: 0;\n    top: 0;\n}\n\n.sidebar_tabs\n{\n    background-color: #151515;\n    padding-bottom: 0px;\n}\n\n.sidebar_switchs\n{\n    float: right;\n}\n\n.sidebar_tab\n{\n    float:left;\n    background-color: #151515;\n    border-bottom:1px solid transparent;\n    padding-right:7px;\n    padding-left:7px;\n    padding-bottom: 5px;\n    padding-top: 5px;\n    cursor:pointer;\n}\n\n.sidebar_tab_active\n{\n    background-color: #272727;\n    color:white;\n}\n\n.sidebar_tab:hover\n{\n    border-bottom:1px solid #777;\n    color:white;\n}\n\n\n.sidebar_switch\n{\n    float:left;\n    background-color: #444;\n    padding-right:7px;\n    padding-left:7px;\n    padding-bottom: 5px;\n    padding-top: 5px;\n    cursor:pointer;\n}\n\n.sidebar_switch:last-child\n{\n    border-top-right-radius: 7px;\n    border-bottom-right-radius: 7px;\n}\n\n.sidebar_switch:first-child\n{\n    border-top-left-radius: 7px;\n    border-bottom-left-radius: 7px;\n}\n\n\n.sidebar_switch_active\n{\n    background-color: #999;\n    color:white;\n}\n\n.sidebar_switch:hover\n{\n    color:white;\n}\n",
  };
  const i = "cables-sidebar-style";
  const s = "cables-sidebar-dynamic-style";
  const o = "sidebar-cables";
  const l = "sidebar" + CABLES.uuid();
  const u = "sidebar__items";
  const c = "sidebar__close-button";
  const r = "";
  const h = "";
  let g = null;
  let e = null;
  let d = null;
  const t = a.inValueBool("Visible", true);
  const p = a.inValueSlider("Opacity", 1);
  const m = a.inValueBool("Default Minimized");
  const f = a.inValueSlider("Minimized Opacity", 0.5);
  const _ = a.inValueBool("Show undo button", false);
  const v = a.inValueBool("Show Minimize", false);
  const b = a.inString("Title", "Sidebar");
  const x = a.inValueBool("Side");
  const I = a.outObject("childs");
  I.setUiAttribs({ title: "Children" });
  const A = a.outBool("Opfened");
  A.setUiAttribs({ title: "Opened" });
  let E = document.querySelector("." + l);
  if (!E) {
    E = B();
  }
  const T = E.querySelector("." + u);
  I.set({ parentElement: T, parentOp: a });
  O();
  R();
  M();
  t.onChange = w;
  p.onChange = N;
  m.onChange = O;
  f.onChange = y;
  _.onChange = S;
  a.onDelete = V;
  function y() {
    M();
  }
  v.onChange = C;
  function C(e) {
    if (!e || e.uiAttribs)
      e = document.querySelector(".sidebar-cables .sidebar__group-header");
    if (!e) return;
    const t = document.querySelector(
      ".sidebar-cables .sidebar__group-header .sidebar__group-header-undo"
    );
    if (v.get()) {
      e.classList.add("iconsidebar-chevron-up");
      e.classList.add("iconsidebar-minimizebutton");
      if (t) t.style.marginRight = "20px";
    } else {
      e.classList.remove("iconsidebar-chevron-up");
      e.classList.remove("iconsidebar-minimizebutton");
      if (t) t.style.marginRight = "initial";
    }
  }
  x.onChange = function () {
    if (x.get()) E.classList.add("sidebar-cables-right");
    else E.classList.remove("sidebar-cables-right");
  };
  function S() {
    const e = document.querySelector(".sidebar-cables .sidebar__group-header");
    if (e) {
      L(e);
    }
  }
  function L(e) {
    if (e) {
      const t = document.querySelector(
        ".sidebar-cables .sidebar__group-header .sidebar__group-header-undo"
      );
      if (t) {
        if (!_.get()) {
          t.remove();
        }
      } else {
        if (_.get()) {
          const n = document.createElement("span");
          n.classList.add("sidebar__group-header-undo");
          n.classList.add("sidebar-icon-undo");
          n.addEventListener("click", function (e) {
            e.stopPropagation();
            const t = document.querySelectorAll(
              ".sidebar-cables .sidebar__reloadable"
            );
            const n = document.createEvent("MouseEvents");
            n.initEvent("dblclick", true, true);
            t.forEach((e) => {
              e.dispatchEvent(n);
            });
          });
          e.appendChild(n);
        }
      }
    }
    C(e);
  }
  function O() {
    if (!g) {
      return;
    }
    if (m.get()) {
      E.classList.add("sidebar--closed");
      if (t.get()) {
        A.set(false);
      }
    } else {
      E.classList.remove("sidebar--closed");
      if (t.get()) {
        A.set(true);
      }
    }
  }
  function N() {
    const e = p.get();
    E.style.opacity = e;
  }
  function w() {
    if (t.get()) {
      E.style.display = "block";
      if (!E.classList.contains("sidebar--closed")) {
        A.set(true);
      }
    } else {
      E.style.display = "none";
      A.set(false);
    }
  }
  x.onChanged = function () {};
  function M() {
    const e = document.querySelectorAll("." + s);
    if (e) {
      e.forEach(function (e) {
        e.parentNode.removeChild(e);
      });
    }
    const t = document.createElement("style");
    t.classList.add(s);
    let n = ".sidebar--closed .sidebar__close-button { ";
    n += "opacity: " + f.get();
    n += "}";
    const i = document.createTextNode(n);
    t.appendChild(i);
    document.body.appendChild(t);
  }
  function B() {
    const e = document.createElement("div");
    e.classList.add(o);
    e.classList.add(l);
    const t = a.patch.cgl.canvas.parentElement;
    const n = document.createElement("div");
    n.classList.add("sidebar__group");
    e.appendChild(n);
    const i = document.createElement("div");
    i.classList.add("sidebar__group-header");
    e.appendChild(i);
    const s = document.createElement("span");
    s.classList.add("sidebar__group-header-title");
    d = document.createElement("span");
    d.classList.add("sidebar__group-header-title-text");
    d.innerHTML = b.get();
    s.appendChild(d);
    i.appendChild(s);
    L(i);
    C(i);
    n.appendChild(i);
    e.appendChild(n);
    n.addEventListener("click", k);
    if (!t) {
      a.warn("[sidebar] no canvas parentelement found...");
      return;
    }
    t.appendChild(e);
    const r = document.createElement("div");
    r.classList.add(u);
    e.appendChild(r);
    g = document.createElement("div");
    g.classList.add(c);
    g.addEventListener("click", k);
    e.appendChild(g);
    return e;
  }
  b.onChange = function () {
    if (d) d.innerHTML = b.get();
  };
  function P(e) {}
  function k(e) {
    e.stopPropagation();
    if (!E) {
      a.logError("Sidebar could not be closed...");
      return;
    }
    E.classList.toggle("sidebar--closed");
    const t = e.target;
    let n = r;
    if (E.classList.contains("sidebar--closed")) {
      n = h;
      A.set(false);
    } else {
      A.set(true);
    }
  }
  function R() {
    const e = document.querySelectorAll("." + i);
    if (e) {
      e.forEach(function (e) {
        e.parentNode.removeChild(e);
      });
    }
    const t = document.createElement("style");
    t.innerHTML = n.style_css;
    t.classList.add(i);
    document.body.appendChild(t);
  }
  function V() {
    G(E);
  }
  function G(e) {
    if (e && e.parentNode && e.parentNode.removeChild)
      e.parentNode.removeChild(e);
  }
};
Ops.Sidebar.Sidebar.prototype = new CABLES.Op();
CABLES.OPS["5a681c35-78ce-4cb3-9858-bc79c34c6819"] = {
  f: Ops.Sidebar.Sidebar,
  objName: "Ops.Sidebar.Sidebar",
};
Ops.Gl.TextureEffects.ScaleTexture_v2 = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {
    scale_frag:
      "IN vec2 texCoord;\nUNI sampler2D tex;\nUNI sampler2D multiplierTex;\nUNI float amount;\nUNI float uScaleX,uScaleY;\nUNI float offsetX,offsetY;\nUNI float centerX,centerY;\n\n{{CGL.BLENDMODES3}}\n\nvoid main()\n{\n    float multiplier = 1.0;\n    vec2 uv = texCoord;\n\n    #ifdef MASK_SCALE\n        multiplier = dot(vec3(0.2126,0.7152,0.0722), texture(multiplierTex,texCoord).rgb);\n    #endif\n\n    uv.x = (uv.x - centerX) / (uScaleX * multiplier)  + centerX+offsetX ;\n    uv.y = (uv.y - centerY) / (uScaleY * multiplier)  + centerY+offsetY ;\n\n    vec4 col = texture(tex,uv);\n    vec4 base = texture(tex,texCoord);\n    float a=amount;\n\n    #ifdef CLEAR\n        base=vec4(0.0,0.0,0.0,0.0);\n    #endif\n\n    outColor=cgl_blendPixel(base,col,a);\n\n    if(uv.x>1.0||uv.y>1.0||uv.x<0.0||uv.y<0.0)\n        outColor.a=0.0;\n\n}\n",
  };
  const n = e.inTrigger("render"),
    i = e.inTexture("Multiplier"),
    s = CGL.TextureEffect.AddBlendSelect(e, "Blend Mode", "normal"),
    r = e.inValueSlider("Amount", 1),
    a = e.inValue("Scale X", 1.5),
    o = e.inValue("Scale Y", 1.5),
    l = e.inFloat("offset X", 0),
    u = e.inFloat("offset Y", 0),
    c = e.inFloat("center X", 0.5),
    h = e.inFloat("center Y", 0.5),
    g = e.inBool("Clear", true),
    d = e.outTrigger("trigger");
  const p = e.patch.cgl;
  const m = new CGL.Shader(p, e.name);
  m.setSource(m.getDefaultVertexShader(), t.scale_frag);
  const f = new CGL.Uniform(m, "t", "tex", 0),
    _ = new CGL.Uniform(m, "t", "multiplierTex", 1),
    v = new CGL.Uniform(m, "f", "amount", r),
    b = new CGL.Uniform(m, "f", "uScaleX", a),
    x = new CGL.Uniform(m, "f", "uScaleY", o),
    I = new CGL.Uniform(m, "f", "centerX", c),
    A = new CGL.Uniform(m, "f", "centerY", h),
    E = new CGL.Uniform(m, "f", "offsetX", l),
    T = new CGL.Uniform(m, "f", "offsetY", u);
  CGL.TextureEffect.setupBlending(e, m, s, r);
  g.onChange = i.onChange = function () {
    m.toggleDefine("MASK_SCALE", i.isLinked());
    m.toggleDefine("CLEAR", g.get());
  };
  n.onTriggered = function () {
    if (!CGL.TextureEffect.checkOpInEffect(e)) return;
    p.pushShader(m);
    p.currentTextureEffect.bind();
    p.setTexture(0, p.currentTextureEffect.getCurrentSourceTexture().tex);
    if (i.get()) p.setTexture(1, i.get().tex);
    p.currentTextureEffect.finish();
    p.popShader();
    d.trigger();
  };
};
Ops.Gl.TextureEffects.ScaleTexture_v2.prototype = new CABLES.Op();
CABLES.OPS["942ef040-9be9-4848-9122-61cb28cb7789"] = {
  f: Ops.Gl.TextureEffects.ScaleTexture_v2,
  objName: "Ops.Gl.TextureEffects.ScaleTexture_v2",
};
Ops.Sidebar.Slider_v3 = function () {
  CABLES.Op.apply(this, arguments);
  const s = this;
  const e = {};
  const t = 1e-5;
  const n = s.inObject("link");
  const i = s.inString("Text", "Slider");
  const r = s.inValue("Min", 0);
  const a = s.inValue("Max", 1);
  const o = s.inValue("Step", t);
  const l = s.inString("Suffix", "");
  const u = s.inBool("Grey Out", false);
  const c = s.inBool("Visible", true);
  const h = s.inValue("Input", 0.5);
  const g = s.inTriggerButton("Set Default");
  const d = s.inTriggerButton("Reset");
  let p = null;
  const m = s.inValue("Default", 0.5);
  m.setUiAttribs({ hidePort: true, greyout: true });
  const f = s.outObject("childs");
  const _ = s.outNumber("Result", m.get());
  s.toWorkNeedsParent("Ops.Sidebar.Sidebar");
  s.setPortGroup("Range", [r, a, o]);
  s.setPortGroup("Display", [u, c]);
  const v = document.createElement("div");
  v.addEventListener("dblclick", function () {
    _.set(parseFloat(m.get()));
    h.set(parseFloat(m.get()));
  });
  v.dataset.op = s.id;
  v.classList.add("cablesEle");
  v.classList.add("sidebar__item");
  v.classList.add("sidebar__slider");
  v.classList.add("sidebar__reloadable");
  s.patch.on("sidebarStylesChanged", () => {
    M();
  });
  const b = document.createElement("div");
  b.classList.add("sidebar__item-label");
  const x = document.createElement("div");
  x.classList.add("sidebar__greyout");
  v.appendChild(x);
  x.style.display = "none";
  const I = document.createTextNode(i.get());
  b.appendChild(I);
  v.appendChild(b);
  const A = document.createElement("input");
  A.value = m.get();
  A.classList.add("sidebar__text-input-input");
  A.setAttribute("type", "text");
  A.oninput = S;
  v.appendChild(A);
  const E = document.createElement("span");
  v.appendChild(E);
  l.onChange = () => {
    E.innerHTML = l.get();
  };
  const T = document.createElement("div");
  T.classList.add("sidebar__slider-input-wrapper");
  v.appendChild(T);
  const y = document.createElement("div");
  y.classList.add("sidebar__slider-input-active-track");
  T.appendChild(y);
  const C = document.createElement("input");
  C.classList.add("sidebar__slider-input");
  C.setAttribute("min", r.get());
  C.setAttribute("max", a.get());
  C.setAttribute("type", "range");
  C.setAttribute("step", o.get());
  C.setAttribute("value", m.get());
  C.style.display = "block";
  T.appendChild(C);
  M();
  C.addEventListener("input", N);
  n.onChange = V;
  i.onChange = R;
  h.onChange = L;
  m.onChange = k;
  g.onTriggered = O;
  r.onChange = B;
  a.onChange = P;
  o.onChange = w;
  s.onDelete = j;
  s.onLoaded = s.onInit = function () {
    if (s.patch.config.sidebar) {
      s.patch.config.sidebar[i.get()];
      _.set(s.patch.config.sidebar[i.get()]);
    } else {
      _.set(parseFloat(m.get()));
      h.set(parseFloat(m.get()));
    }
  };
  d.onTriggered = function () {
    const e = parseFloat(m.get());
    _.set(e);
    G(e);
    U(e);
    h.set(e);
    M();
  };
  u.onChange = function () {
    x.style.display = u.get() ? "block" : "none";
  };
  c.onChange = function () {
    v.style.display = c.get() ? "block" : "none";
  };
  function S(e) {
    let t = parseFloat(e.target.value);
    if (isNaN(t)) t = 0;
    const n = r.get();
    const i = a.get();
    if (t < n) {
      t = n;
    } else if (t > i) {
      t = i;
    }
    _.set(t);
    M();
    h.set(t);
    s.refreshParams();
  }
  function L() {
    let e = parseFloat(h.get());
    const t = r.get();
    const n = a.get();
    if (e > n) {
      e = n;
    } else if (e < t) {
      e = t;
    }
    G(e);
    U(e);
    _.set(e);
    M();
  }
  function O() {
    let e = parseFloat(h.get());
    const t = r.get();
    const n = a.get();
    if (e > n) {
      e = n;
    } else if (e < t) {
      e = t;
    }
    G(e);
    U(e);
    _.set(e);
    m.set(e);
    s.refreshParams();
    M();
  }
  function N(e) {
    e.preventDefault();
    e.stopPropagation();
    G(e.target.value);
    const t = parseFloat(e.target.value);
    _.set(t);
    h.set(t);
    s.refreshParams();
    M();
    return false;
  }
  function w() {
    const e = o.get();
    C.setAttribute("step", e);
    M();
  }
  function M(e) {
    let t = parseFloat(C.value);
    if (typeof e !== "undefined") t = e;
    let n = y.parentElement.getBoundingClientRect().width || 220;
    if (p)
      n =
        parseInt(
          getComputedStyle(p.parentElement).getPropertyValue("--sidebar-width")
        ) - 20;
    const i = CABLES.map(t, parseFloat(C.min), parseFloat(C.max), 0, n - 16);
    y.style.width = i + "px";
  }
  function B() {
    const e = r.get();
    C.setAttribute("min", e);
    M();
  }
  function P() {
    const e = a.get();
    C.setAttribute("max", e);
    M();
  }
  function k() {
    const e = m.get();
    _.set(parseFloat(e));
    B();
    P();
    U(e);
    G(e);
    M(e);
  }
  function R() {
    const e = i.get();
    b.textContent = e;
    if (CABLES.UI) s.setTitle("Slider: " + e);
  }
  function V() {
    f.set(null);
    p = n.get();
    if (p && p.parentElement) {
      p.parentElement.appendChild(v);
      f.set(p);
    } else if (v.parentElement) v.parentElement.removeChild(v);
    M();
  }
  function G(e) {
    A.value = e;
  }
  function U(e) {
    C.value = e;
  }
  function D(e) {
    if (e) e.style.display = "block";
  }
  function F(e) {
    if (e) e.style.display = "none";
  }
  function j() {
    z(v);
  }
  function z(e) {
    if (e && e.parentNode && e.parentNode.removeChild)
      e.parentNode.removeChild(e);
  }
};
Ops.Sidebar.Slider_v3.prototype = new CABLES.Op();
CABLES.OPS["74730122-5cba-4d0d-b610-df334ec6220a"] = {
  f: Ops.Sidebar.Slider_v3,
  objName: "Ops.Sidebar.Slider_v3",
};
Ops.Math.MapRange = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const g = e.inValueFloat("value", 0),
    d = e.inValueFloat("old min", 0),
    p = e.inValueFloat("old max", 1),
    m = e.inValueFloat("new min", -1),
    f = e.inValueFloat("new max", 1),
    n = e.inValueSelect(
      "Easing",
      ["Linear", "Smoothstep", "Smootherstep"],
      "Linear"
    ),
    _ = e.outNumber("result", 0);
  e.setPortGroup("Input Range", [d, p]);
  e.setPortGroup("Output Range", [m, f]);
  let v = 0;
  let b = 0;
  g.onChange = d.onChange = p.onChange = m.onChange = f.onChange = i;
  i();
  n.onChange = function () {
    if (n.get() == "Smoothstep") v = 1;
    else if (n.get() == "Smootherstep") v = 2;
    else v = 0;
  };
  function i() {
    const e = m.get();
    const t = f.get();
    const n = d.get();
    const i = p.get();
    let s = g.get();
    if (s >= Math.max(i, n)) {
      _.set(t);
      return;
    } else if (s <= Math.min(i, n)) {
      _.set(e);
      return;
    }
    let r = false;
    const a = Math.min(n, i);
    const o = Math.max(n, i);
    if (a != n) r = true;
    let l = false;
    const u = Math.min(e, t);
    const c = Math.max(e, t);
    if (u != e) l = true;
    let h = 0;
    if (r) h = ((o - s) * (c - u)) / (o - a);
    else h = ((s - a) * (c - u)) / (o - a);
    if (l) b = c - h;
    else b = h + u;
    if (v === 0) {
      _.set(b);
    } else if (v == 1) {
      s = Math.max(0, Math.min(1, (b - e) / (t - e)));
      _.set(e + s * s * (3 - 2 * s) * (t - e));
    } else if (v == 2) {
      s = Math.max(0, Math.min(1, (b - e) / (t - e)));
      _.set(e + s * s * s * (s * (s * 6 - 15) + 10) * (t - e));
    }
  }
};
Ops.Math.MapRange.prototype = new CABLES.Op();
CABLES.OPS["2617b407-60a0-4ff6-b4a7-18136cfa7817"] = {
  f: Ops.Math.MapRange,
  objName: "Ops.Math.MapRange",
};
Ops.Trigger.TriggerSend = function () {
  CABLES.Op.apply(this, arguments);
  const i = this;
  const e = {};
  const t = i.inTriggerButton("Trigger");
  i.varName = i.inValueSelect("Named Trigger", [], "", true);
  i.varName.onChange = s;
  t.onTriggered = r;
  i.patch.addEventListener("namedTriggersChanged", n);
  n();
  function n() {
    if (CABLES.UI) {
      const e = [];
      const t = i.patch.namedTriggers;
      e.push("+ create new one");
      for (const n in t) e.push(n);
      i.varName.uiAttribs.values = e;
    }
  }
  function s() {
    if (CABLES.UI) {
      if (i.varName.get() == "+ create new one") {
        new CABLES.UI.ModalDialog({
          prompt: true,
          title: "New Trigger",
          text: "enter a name for the new trigger",
          promptValue: "",
          promptOk: (e) => {
            i.varName.set(e);
            i.patch.namedTriggers[e] = i.patch.namedTriggers[e] || [];
            n();
          },
        });
        return;
      }
      i.refreshParams();
    }
    if (!i.patch.namedTriggers[i.varName.get()]) {
      i.patch.namedTriggers[i.varName.get()] =
        i.patch.namedTriggers[i.varName.get()] || [];
      i.patch.emitEvent("namedTriggersChanged");
    }
    i.setTitle(">" + i.varName.get());
    i.refreshParams();
    i.patch.emitEvent("opTriggerNameChanged", i, i.varName.get());
  }
  function r() {
    const t = i.patch.namedTriggers[i.varName.get()];
    i.patch.emitEvent("namedTriggerSent", i.varName.get());
    if (!t) {
      i.setUiError("unknowntrigger", "unknown trigger");
      return;
    } else i.setUiError("unknowntrigger", null);
    for (let e = 0; e < t.length; e++) {
      t[e]();
    }
  }
};
Ops.Trigger.TriggerSend.prototype = new CABLES.Op();
CABLES.OPS["ce1eaf2b-943b-4dc0-ab5e-ee11b63c9ed0"] = {
  f: Ops.Trigger.TriggerSend,
  objName: "Ops.Trigger.TriggerSend",
};
Ops.Devices.Keyboard.KeyPressLearn = function () {
  CABLES.Op.apply(this, arguments);
  const n = this;
  const e = {};
  const i = n.inValueInt("key code");
  const t = n.inValueBool("canvas only", true);
  const s = n.inValueSelect("Mod Key", ["none", "alt"], "none");
  const r = n.inValueBool("Enabled", true);
  const a = n.inValueBool("Prevent Default");
  const o = n.inTriggerButton("learn");
  const l = n.outTrigger("on press");
  const u = n.outTrigger("on release");
  const c = n.outBoolNum("Pressed", false);
  const h = n.outString("Key");
  const g = n.patch.cgl;
  let d = false;
  s.onChange = i.onChange = x;
  function p(e) {
    if (d) {
      i.set(e.keyCode);
      if (CABLES.UI) {
        n.refreshParams();
      }
      d = false;
      _();
      f();
      if (CABLES.UI) gui.emitEvent("portValueEdited", n, i, i.get());
    } else {
      if (e.keyCode == i.get()) {
        if (s.get() == "alt") {
          if (e.altKey === true) {
            l.trigger();
            c.set(true);
            if (a.get()) e.preventDefault();
          }
        } else {
          l.trigger();
          c.set(true);
          if (a.get()) e.preventDefault();
        }
      }
    }
  }
  function m(e) {
    if (e.keyCode == i.get()) {
      u.trigger();
      c.set(false);
    }
  }
  n.onDelete = function () {
    g.canvas.removeEventListener("keyup", m, false);
    g.canvas.removeEventListener("keydown", p, false);
    document.removeEventListener("keyup", m, false);
    document.removeEventListener("keydown", p, false);
  };
  o.onTriggered = function () {
    d = true;
    b();
    setTimeout(function () {
      d = false;
      _();
      f();
    }, 3e3);
  };
  function f() {
    if (t.get()) v();
    else b();
  }
  function _() {
    document.removeEventListener("keydown", p, false);
    document.removeEventListener("keyup", m, false);
    g.canvas.removeEventListener("keydown", p, false);
    g.canvas.removeEventListener("keyup", m, false);
    c.set(false);
  }
  function v() {
    g.canvas.addEventListener("keydown", p, false);
    g.canvas.addEventListener("keyup", m, false);
  }
  function b() {
    document.addEventListener("keydown", p, false);
    document.addEventListener("keyup", m, false);
  }
  r.onChange = function () {
    if (!r.get()) {
      _();
    } else {
      f();
    }
  };
  t.onChange = function () {
    _();
    f();
  };
  function x() {
    let e = CABLES.keyCodeToName(i.get());
    const t = s.get();
    if (t && t !== "none") {
      e = t.charAt(0).toUpperCase() + t.slice(1) + "-" + e;
    }
    n.setUiAttribs({ extendTitle: e });
    h.set(e);
  }
  v();
};
Ops.Devices.Keyboard.KeyPressLearn.prototype = new CABLES.Op();
CABLES.OPS["f069c0db-4051-4eae-989e-6ef7953787fd"] = {
  f: Ops.Devices.Keyboard.KeyPressLearn,
  objName: "Ops.Devices.Keyboard.KeyPressLearn",
};
Ops.Boolean.ToggleBool = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTriggerButton("trigger"),
    i = e.inTriggerButton("reset"),
    s = e.outBool("result"),
    r = e.inBool("Default", false);
  let a = false;
  s.set(a);
  s.ignoreValueSerialize = true;
  n.onTriggered = function () {
    a = !a;
    s.set(a);
  };
  i.onTriggered = function () {
    a = r.get();
    s.set(a);
  };
};
Ops.Boolean.ToggleBool.prototype = new CABLES.Op();
CABLES.OPS["712a25f4-3a93-4042-b8c5-2f56169186cc"] = {
  f: Ops.Boolean.ToggleBool,
  objName: "Ops.Boolean.ToggleBool",
};
Ops.Gl.Texture_v2 = function () {
  CABLES.Op.apply(this, arguments);
  const s = this;
  const e = {};
  const r = s.inUrl("File", [".jpg", ".png", ".webp", ".jpeg", ".avif"]),
    t = s.inSwitch("Filter", ["nearest", "linear", "mipmap"]),
    n = s.inValueSelect(
      "Wrap",
      ["repeat", "mirrored repeat", "clamp to edge"],
      "clamp to edge"
    ),
    i = s.inSwitch("Anisotropic", [0, 1, 2, 4, 8, 16], 0),
    a = s.inValueBool("Flip", false),
    o = s.inValueBool("Pre Multiplied Alpha", false),
    l = s.inValueBool("Active", true),
    u = s.inBool("Save Memory", true),
    c = s.outTexture("Texture"),
    h = s.outNumber("Width"),
    g = s.outNumber("Height"),
    d = s.outNumber("Aspect Ratio"),
    p = s.outNumber("Loaded", false),
    m = s.outNumber("Loading", false);
  s.setPortGroup("Size", [h, g]);
  o.setUiAttribs({ hidePort: true });
  s.toWorkPortsNeedToBeLinked(c);
  const f = s.patch.cgl;
  let _ = null;
  let v = null;
  let b = null;
  let x = CGL.Texture.FILTER_MIPMAP;
  let I = CGL.Texture.WRAP_REPEAT;
  let A = 0;
  let E = 0;
  r.onChange = a.onChange = function () {
    y();
  };
  i.onChange = t.onChange = S;
  n.onChange = L;
  o.onChange = function () {
    y();
  };
  t.set("mipmap");
  n.set("repeat");
  c.set(CGL.Texture.getEmptyTexture(f));
  l.onChange = function () {
    if (l.get()) {
      if (_ != r.get() || !b) y();
      else c.set(b);
    } else {
      c.set(CGL.Texture.getEmptyTexture(f));
      h.set(CGL.Texture.getEmptyTexture(f).width);
      g.set(CGL.Texture.getEmptyTexture(f).height);
      if (b) b.delete();
      b = null;
    }
  };
  const T = function () {
    const e = CGL.Texture.getTempTexture(f);
    c.set(e);
  };
  function y(e) {
    clearTimeout(E);
    E = setTimeout(function () {
      C(e);
    }, 30);
  }
  function C(e) {
    if (!l.get()) return;
    if (!v) v = f.patch.loading.start("textureOp", r.get());
    let t = s.patch.getFilePath(String(r.get()));
    if (e) t += "?rnd=" + CABLES.uuid();
    if (String(r.get()).indexOf("data:") == 0) t = r.get();
    let n = false;
    if (_ != r.get()) n = true;
    _ = r.get();
    if (r.get() && r.get().length > 1) {
      p.set(false);
      m.set(true);
      const i = r.get();
      s.setUiAttrib({ extendTitle: CABLES.basename(t) });
      if (n) s.refreshParams();
      f.patch.loading.addAssetLoadingTask(() => {
        s.setUiError("urlerror", null);
        CGL.Texture.load(
          f,
          t,
          function (e, t) {
            if (r.get() != i) {
              f.patch.loading.finished(v);
              v = null;
              return;
            }
            if (e) {
              T();
              s.setUiError(
                "urlerror",
                'could not load texture: "' + r.get() + '"',
                2
              );
              f.patch.loading.finished(v);
              return;
            }
            c.set(t);
            h.set(t.width);
            g.set(t.height);
            d.set(t.width / t.height);
            if (b) b.delete();
            b = t;
            c.set(null);
            c.set(b);
            m.set(false);
            p.set(true);
            if (u.get()) b.image = null;
            f.patch.loading.finished(v);
          },
          {
            anisotropic: A,
            wrap: I,
            flip: a.get(),
            unpackAlpha: o.get(),
            filter: x,
          }
        );
      });
    } else {
      f.patch.loading.finished(v);
      T();
    }
  }
  function S() {
    if (t.get() == "nearest") x = CGL.Texture.FILTER_NEAREST;
    else if (t.get() == "linear") x = CGL.Texture.FILTER_LINEAR;
    else if (t.get() == "mipmap") x = CGL.Texture.FILTER_MIPMAP;
    else if (t.get() == "Anisotropic") x = CGL.Texture.FILTER_ANISOTROPIC;
    A = parseFloat(i.get());
    y();
  }
  function L() {
    if (n.get() == "repeat") I = CGL.Texture.WRAP_REPEAT;
    if (n.get() == "mirrored repeat") I = CGL.Texture.WRAP_MIRRORED_REPEAT;
    if (n.get() == "clamp to edge") I = CGL.Texture.WRAP_CLAMP_TO_EDGE;
    y();
  }
  s.onFileChanged = function (e) {
    if (r.get() && r.get().indexOf(e) > -1) {
      c.set(CGL.Texture.getEmptyTexture(s.patch.cgl));
      c.set(CGL.Texture.getTempTexture(f));
      C(true);
    }
  };
};
Ops.Gl.Texture_v2.prototype = new CABLES.Op();
CABLES.OPS["790f3702-9833-464e-8e37-6f0f813f7e16"] = {
  f: Ops.Gl.Texture_v2,
  objName: "Ops.Gl.Texture_v2",
};
Ops.Trigger.GateTrigger = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTrigger("Execute"),
    i = e.inValueBool("Pass Through", true),
    s = e.outTrigger("Trigger out");
  n.onTriggered = function () {
    if (i.get()) s.trigger();
  };
};
Ops.Trigger.GateTrigger.prototype = new CABLES.Op();
CABLES.OPS["65e8b8a2-ba13-485f-883a-2bcf377989da"] = {
  f: Ops.Trigger.GateTrigger,
  objName: "Ops.Trigger.GateTrigger",
};
Ops.Trigger.IsTriggered = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTrigger("Trigger"),
    i = e.outTrigger("Next"),
    s = e.outBool("Was Triggered", false);
  let r = 0;
  e.onAnimFrame = function (e) {
    r++;
    if (r > 1) s.set(false);
  };
  n.onTriggered = function () {
    r = 0;
    s.set(true);
    i.trigger();
  };
};
Ops.Trigger.IsTriggered.prototype = new CABLES.Op();
CABLES.OPS["7c96fee9-4c2f-45e1-a41b-096b06d286b8"] = {
  f: Ops.Trigger.IsTriggered,
  objName: "Ops.Trigger.IsTriggered",
};
Ops.Boolean.Not = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValueBool("Boolean"),
    i = e.outBoolNum("Result");
  n.changeAlways = true;
  n.onChange = function () {
    i.set(!n.get());
  };
};
Ops.Boolean.Not.prototype = new CABLES.Op();
CABLES.OPS["6d123c9f-7485-4fd9-a5c2-76e59dcbeb34"] = {
  f: Ops.Boolean.Not,
  objName: "Ops.Boolean.Not",
};
Ops.Trigger.TriggerReceive = function () {
  CABLES.Op.apply(this, arguments);
  const i = this;
  const e = {};
  const t = i.outTrigger("Triggered");
  i.varName = i.inValueSelect("Named Trigger", [], "", true);
  r();
  i.patch.addEventListener("namedTriggersChanged", r);
  let n = null;
  function s() {
    t.trigger();
  }
  function r() {
    if (CABLES.UI) {
      let t = [];
      let n = i.patch.namedTriggers;
      for (let e in n) t.push(e);
      i.varName.uiAttribs.values = t;
    }
  }
  i.varName.onChange = function () {
    if (n) {
      let e = i.patch.namedTriggers[n];
      let t = e.indexOf(s);
      if (t != -1) e.splice(t, 1);
    }
    i.setTitle(">" + i.varName.get());
    i.patch.namedTriggers[i.varName.get()] =
      i.patch.namedTriggers[i.varName.get()] || [];
    let e = i.patch.namedTriggers[i.varName.get()];
    e.push(s);
    n = i.varName.get();
    a();
    i.patch.emitEvent("opTriggerNameChanged", i, i.varName.get());
  };
  i.on("uiParamPanel", a);
  function a() {
    if (!i.varName.get()) {
      i.setUiError("unknowntrigger", "unknown trigger");
    } else i.setUiError("unknowntrigger", null);
  }
};
Ops.Trigger.TriggerReceive.prototype = new CABLES.Op();
CABLES.OPS["0816c999-f2db-466b-9777-2814573574c5"] = {
  f: Ops.Trigger.TriggerReceive,
  objName: "Ops.Trigger.TriggerReceive",
};
Ops.Trigger.TriggerOnce = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTriggerButton("Exec"),
    i = e.inTriggerButton("Reset"),
    s = e.outTrigger("Next"),
    r = e.outBoolNum("Was Triggered");
  let a = false;
  e.toWorkPortsNeedToBeLinked(n);
  i.onTriggered = function () {
    a = false;
    r.set(a);
  };
  n.onTriggered = function () {
    if (a) return;
    a = true;
    s.trigger();
    r.set(a);
  };
};
Ops.Trigger.TriggerOnce.prototype = new CABLES.Op();
CABLES.OPS["cf3544e4-e392-432b-89fd-fcfb5c974388"] = {
  f: Ops.Trigger.TriggerOnce,
  objName: "Ops.Trigger.TriggerOnce",
};
Ops.TimeLine.TimeLineFrame = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  var n = e.addOutPort(new CABLES.Port(this, "time"));
  e.onAnimFrame = function (e) {
    n.set(Math.round(e * 30));
  };
};
Ops.TimeLine.TimeLineFrame.prototype = new CABLES.Op();
CABLES.OPS["a6c66f1f-2102-4b68-882b-afd25a4da538"] = {
  f: Ops.TimeLine.TimeLineFrame,
  objName: "Ops.TimeLine.TimeLineFrame",
};
Ops.Gl.TextureEffects.ChromaticAberration_v2 = function () {
  CABLES.Op.apply(this, arguments);
  const t = this;
  const e = {
    chromatic_frag:
      "IN vec2 texCoord;\nUNI sampler2D tex;\nUNI float pixel;\nUNI float onePixel;\nUNI float amount;\nUNI float lensDistort;\n\n#ifdef MASK\nUNI sampler2D texMask;\n#endif\n\n{{CGL.BLENDMODES3}}\n\nvoid main()\n{\n   vec4 base=texture(tex,texCoord);\n   vec4 col=texture(tex,texCoord);\n\n   vec2 tc=texCoord;;\n   float pix = pixel;\n   if(lensDistort>0.0)\n   {\n       float dist = distance(texCoord, vec2(0.5,0.5));\n       tc-=0.5;\n       tc *=smoothstep(-0.9,1.0*lensDistort,1.0-dist);\n       tc+=0.5;\n   }\n\n    #ifdef MASK\n        vec4 m=texture(texMask,texCoord);\n        pix*=m.r*m.a;\n    #endif\n\n    #ifdef SMOOTH\n    #ifdef WEBGL2\n        float numSamples=round(pix/onePixel/4.0+1.0);\n        col.r=0.0;\n        col.b=0.0;\n\n        for(float off=0.0;off<numSamples;off++)\n        {\n            float diff=(pix/numSamples)*off;\n            col.r+=texture(tex,vec2(tc.x+diff,tc.y)).r/numSamples;\n            col.b+=texture(tex,vec2(tc.x-diff,tc.y)).b/numSamples;\n        }\n    #endif\n    #endif\n\n    #ifndef SMOOTH\n        col.r=texture(tex,vec2(tc.x+pix,tc.y)).r;\n        col.b=texture(tex,vec2(tc.x-pix,tc.y)).b;\n    #endif\n\n   outColor= cgl_blendPixel(base,col,amount);\n\n}\n",
  };
  const n = t.inTrigger("render"),
    i = CGL.TextureEffect.AddBlendSelect(t, "Blend Mode", "normal"),
    s = t.inValueSlider("Amount", 1),
    r = t.inValue("Pixel", 5),
    a = t.inValueSlider("Lens Distort", 0),
    o = t.inValueBool("Smooth", false),
    l = t.inTexture("Mask"),
    u = t.outTrigger("trigger");
  const c = t.patch.cgl;
  const h = new CGL.Shader(c, "chromatic");
  CGL.TextureEffect.setupBlending(t, h, i, s);
  h.setSource(h.getDefaultVertexShader(), e.chromatic_frag);
  const g = new CGL.Uniform(h, "t", "tex", 0),
    d = new CGL.Uniform(h, "f", "pixel", 0),
    p = new CGL.Uniform(h, "f", "onePixel", 0),
    m = new CGL.Uniform(h, "t", "texMask", 1),
    f = new CGL.Uniform(h, "f", "amount", s),
    _ = new CGL.Uniform(h, "f", "lensDistort", a);
  o.onChange = function () {
    if (o.get()) h.define("SMOOTH");
    else h.removeDefine("SMOOTH");
  };
  l.onChange = function () {
    if (l.get()) h.define("MASK");
    else h.removeDefine("MASK");
  };
  n.onTriggered = function () {
    if (!CGL.TextureEffect.checkOpInEffect(t, 3)) return;
    var e = c.currentTextureEffect.getCurrentSourceTexture();
    d.setValue(r.get() * (1 / e.width));
    p.setValue(1 / e.width);
    c.pushShader(h);
    c.currentTextureEffect.bind();
    c.setTexture(0, e.tex);
    if (l.get()) c.setTexture(1, l.get().tex);
    c.currentTextureEffect.finish();
    c.popShader();
    u.trigger();
  };
};
Ops.Gl.TextureEffects.ChromaticAberration_v2.prototype = new CABLES.Op();
CABLES.OPS["07701f81-1a98-44c0-b1ef-592db3cbb5d3"] = {
  f: Ops.Gl.TextureEffects.ChromaticAberration_v2,
  objName: "Ops.Gl.TextureEffects.ChromaticAberration_v2",
};
Ops.Anim.RandomAnim = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTrigger("exe"),
    i = e.inValue("min", 0),
    s = e.inValue("max", 1),
    r = e.inValue("random seed", 0),
    a = e.inValue("duration", 0.5),
    o = e.inValue("pause between", 0),
    l = e.outTrigger("Next"),
    u = e.outNumber("result"),
    c = e.outTrigger("Looped");
  const h = new CABLES.Anim();
  h.createPort(e, "easing", f);
  e.setPortGroup("Timing", [a, o]);
  e.setPortGroup("Value", [i, s, r]);
  e.toWorkPortsNeedToBeLinked(n);
  let g = 0;
  i.onChange = s.onChange = o.onChange = r.onChange = a.onChange = p;
  let d = true;
  function p() {
    d = true;
  }
  function m() {
    const e = i.get();
    return Math.seededRandom() * (s.get() - e) + e;
  }
  function f() {
    Math.randomSeed = r.get() + g * 100;
    _(m());
    d = false;
  }
  function _(e) {
    h.clear();
    h.setValue(CABLES.now() / 1e3, e);
    if (o.get() !== 0) h.setValue(CABLES.now() / 1e3 + o.get(), e);
    h.setValue(a.get() + CABLES.now() / 1e3 + o.get(), m());
  }
  n.onTriggered = v;
  function v() {
    if (d) f();
    const e = CABLES.now() / 1e3;
    const t = h.getValue(e);
    if (h.hasEnded(e)) {
      g++;
      h.clear();
      _(t);
      c.trigger();
    }
    u.set(t);
    l.trigger();
  }
};
Ops.Anim.RandomAnim.prototype = new CABLES.Op();
CABLES.OPS["2d2e5f0e-b69f-4789-9a48-1ee6ade5049a"] = {
  f: Ops.Anim.RandomAnim,
  objName: "Ops.Anim.RandomAnim",
};
Ops.Anim.SineAnim = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTrigger("exe"),
    i = e.inSwitch("Mode", ["Sine", "Cosine"], "Sine"),
    s = e.inValueFloat("phase", 0),
    r = e.inValueFloat("frequency", 1),
    a = e.inValueFloat("amplitude", 1),
    o = e.outTrigger("Trigger out"),
    l = e.outNumber("result");
  let u = 0;
  const c = 0;
  const h = 1;
  e.toWorkPortsNeedToBeLinked(n);
  n.onTriggered = d;
  i.onChange = g;
  d();
  g();
  function g() {
    let e = i.get();
    if (e === "Sine") u = c;
    else if (e === "Cosine") u = h;
    d();
  }
  function d() {
    if (u == c)
      l.set(a.get() * Math.sin(e.patch.freeTimer.get() * r.get() + s.get()));
    else l.set(a.get() * Math.cos(e.patch.freeTimer.get() * r.get() + s.get()));
    o.trigger();
  }
};
Ops.Anim.SineAnim.prototype = new CABLES.Op();
CABLES.OPS["736d3d0e-c920-449e-ade0-f5ca6018fb5c"] = {
  f: Ops.Anim.SineAnim,
  objName: "Ops.Anim.SineAnim",
};
Ops.Math.FlipSign = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValueFloat("Value", 1),
    i = e.outNumber("Result");
  n.onChange = s;
  s();
  function s() {
    i.set(n.get() * -1);
  }
};
Ops.Math.FlipSign.prototype = new CABLES.Op();
CABLES.OPS["f5c858a2-2654-4108-86fe-319efa70ecec"] = {
  f: Ops.Math.FlipSign,
  objName: "Ops.Math.FlipSign",
};
Ops.Devices.Mouse.Mouse_v2 = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValueBool("Active", true),
    i = e.inValueBool("relative"),
    s = e.inValueBool("normalize"),
    r = e.inValueBool("flip y", true),
    a = e.inValueSelect(
      "Area",
      ["Canvas", "Document", "Parent Element"],
      "Canvas"
    ),
    o = e.inBool("right click prevent default", true),
    l = e.inValueBool("Touch support", true),
    u = e.inValueBool("smooth"),
    c = e.inValueFloat("smoothSpeed", 20),
    h = e.inValueFloat("multiply", 1),
    g = e.outNumber("x", 0),
    d = e.outNumber("y", 0),
    p = e.outBoolNum("button down"),
    m = e.outTrigger("click"),
    f = e.outTrigger("Button Up"),
    _ = e.outTrigger("click right"),
    v = e.outBoolNum("mouseOver"),
    b = e.outNumber("button");
  e.setPortGroup("Behavior", [i, s, r, a, o, l]);
  e.setPortGroup("Smoothing", [u, c, h]);
  let x = 0;
  const I = e.patch.cgl;
  let A = null;
  function E(n, i) {
    if (s.get()) {
      let e = I.canvas.width / I.pixelDensity;
      let t = I.canvas.height / I.pixelDensity;
      if (A == document.body) {
        e = A.clientWidth / I.pixelDensity;
        t = A.clientHeight / I.pixelDensity;
      }
      g.set((((n || 0) / e) * 2 - 1) * h.get());
      d.set((((i || 0) / t) * 2 - 1) * h.get());
    } else {
      g.set((n || 0) * h.get());
      d.set((i || 0) * h.get());
    }
  }
  u.onChange = function () {
    if (u.get()) x = setInterval(k, 5);
    else if (x) clearTimeout(x);
  };
  let T, y;
  let C = 0,
    S = 0;
  s.onChange = function () {
    L = 0;
    O = 0;
    E(L, O);
  };
  let L = I.canvas.width / 2;
  let O = I.canvas.height / 2;
  C = L;
  S = O;
  g.set(L);
  d.set(O);
  let N = 0;
  let w = 0;
  let M = 0;
  let B = 0;
  K();
  a.onChange = K;
  let P = 0;
  function k() {
    P = c.get();
    if (P <= 0) P = 0.01;
    const e = Math.abs(L - C);
    const t = Math.round(e / P, 0);
    C = C < L ? C + t : C - t;
    const n = Math.abs(O - S);
    const i = Math.round(n / P, 0);
    S = S < O ? S + i : S - i;
    E(C, S);
  }
  function R(e) {
    p.set(false);
    v.set(true);
    P = c.get();
  }
  function V(e) {
    b.set(e.which);
    p.set(true);
  }
  function G(e) {
    b.set(0);
    p.set(false);
    f.trigger();
  }
  function U(e) {
    _.trigger();
    if (o.get()) e.preventDefault();
  }
  function D(e) {
    m.trigger();
  }
  function F(e) {
    N = 0;
    w = 0;
    P = 100;
    v.set(false);
    p.set(false);
  }
  i.onChange = function () {
    M = 0;
    B = 0;
  };
  function j(e) {
    if (!i.get()) {
      if (a.get() != "Document") {
        M = e.offsetX;
        B = e.offsetY;
      } else {
        M = e.clientX;
        B = e.clientY;
      }
      if (u.get()) {
        L = M;
        if (r.get()) O = A.clientHeight - B;
        else O = B;
      } else {
        if (r.get()) E(M, A.clientHeight - B);
        else E(M, B);
      }
    } else {
      if (N != 0 && w != 0) {
        M = e.offsetX - N;
        B = e.offsetY - w;
      } else {
      }
      N = e.offsetX;
      w = e.offsetY;
      L += M;
      O += B;
      if (O > 460) O = 460;
    }
  }
  function z(e) {
    v.set(true);
    j(e);
  }
  function X(e) {
    if (event.touches && event.touches.length > 0) j(e.touches[0]);
  }
  function Y(e) {
    p.set(true);
    if (e.touches && e.touches.length > 0) V(e.touches[0]);
  }
  function W(e) {
    p.set(false);
    G();
  }
  l.onChange = function () {
    H();
    K();
  };
  function H() {
    if (!A) return;
    A.removeEventListener("touchend", W);
    A.removeEventListener("touchstart", Y);
    A.removeEventListener("touchmove", X);
    A.removeEventListener("click", D);
    A.removeEventListener("mousemove", z);
    A.removeEventListener("mouseleave", F);
    A.removeEventListener("mousedown", V);
    A.removeEventListener("mouseup", G);
    A.removeEventListener("mouseenter", R);
    A.removeEventListener("contextmenu", U);
    A = null;
  }
  function K() {
    if (A || !n.get()) H();
    if (!n.get()) return;
    A = I.canvas;
    if (a.get() == "Document") A = document.body;
    if (a.get() == "Parent Element") A = I.canvas.parentElement;
    if (l.get()) {
      A.addEventListener("touchend", W);
      A.addEventListener("touchstart", Y);
      A.addEventListener("touchmove", X);
    }
    A.addEventListener("mousemove", z);
    A.addEventListener("mouseleave", F);
    A.addEventListener("mousedown", V);
    A.addEventListener("mouseup", G);
    A.addEventListener("mouseenter", R);
    A.addEventListener("contextmenu", U);
    A.addEventListener("click", D);
  }
  n.onChange = function () {
    if (A) H();
    if (n.get()) K();
  };
  e.onDelete = function () {
    H();
  };
  K();
};
Ops.Devices.Mouse.Mouse_v2.prototype = new CABLES.Op();
CABLES.OPS["9fa3fc46-3147-4e3a-8ee8-a93ea9e8786e"] = {
  f: Ops.Devices.Mouse.Mouse_v2,
  objName: "Ops.Devices.Mouse.Mouse_v2",
};
Ops.Gl.ClearColor = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inTrigger("render"),
    i = e.outTrigger("trigger"),
    s = e.inFloatSlider("r", 0.1),
    r = e.inFloatSlider("g", 0.1),
    a = e.inFloatSlider("b", 0.1),
    o = e.inFloatSlider("a", 1);
  s.setUiAttribs({ colorPick: true });
  const l = e.patch.cgl;
  n.onTriggered = function () {
    l.gl.clearColor(s.get(), r.get(), a.get(), o.get());
    l.gl.clear(l.gl.COLOR_BUFFER_BIT | l.gl.DEPTH_BUFFER_BIT);
    i.trigger();
  };
};
Ops.Gl.ClearColor.prototype = new CABLES.Op();
CABLES.OPS["19b441eb-9f63-4f35-ba08-b87841517c4d"] = {
  f: Ops.Gl.ClearColor,
  objName: "Ops.Gl.ClearColor",
};
Ops.Devices.Mouse.Mouse_v3 = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inSwitch(
      "Coordinates",
      ["Pixel", "Pixel Display", "-1 to 1", "0 to 1"],
      "-1 to 1"
    ),
    i = e.inValueSelect(
      "Area",
      ["Canvas", "Document", "Parent Element"],
      "Canvas"
    ),
    s = e.inValueBool("flip y", true),
    r = e.inBool("right click prevent default", true),
    a = e.inValueBool("Touch support", true),
    o = e.inValueBool("Active", true),
    l = e.outNumber("x", 0),
    u = e.outNumber("y", 0),
    c = e.outTrigger("click"),
    h = e.outTrigger("click right"),
    g = e.outBoolNum("Button is down"),
    d = e.outBoolNum("Mouse is hovering");
  const p = e.patch.cgl;
  let m = 1;
  let f = null;
  let _ = p.canvas.width / 2;
  let v = p.canvas.height / 2;
  i.onChange = B;
  l.set(_);
  u.set(v);
  n.onChange = x;
  e.onDelete = M;
  B();
  function b(n, i) {
    n = n || 0;
    i = i || 0;
    if (m == 0) {
      l.set(n);
      u.set(i);
    } else if (m == 3) {
      l.set(n * p.pixelDensity);
      u.set(i * p.pixelDensity);
    } else {
      let e = p.canvas.width / p.pixelDensity;
      let t = p.canvas.height / p.pixelDensity;
      if (f == document.body) {
        e = f.clientWidth / p.pixelDensity;
        t = f.clientHeight / p.pixelDensity;
      }
      if (m == 1) {
        l.set((n / e) * 2 - 1);
        u.set((i / t) * 2 - 1);
      }
      if (m == 2) {
        l.set(n / e);
        u.set(i / t);
      }
    }
  }
  a.onChange = function () {
    M();
    B();
  };
  o.onChange = function () {
    if (f) M();
    if (o.get()) B();
  };
  function x() {
    _ = 0;
    v = 0;
    b(_, v);
    if (n.get() == "Pixel") m = 0;
    else if (n.get() == "-1 to 1") m = 1;
    else if (n.get() == "0 to 1") m = 2;
    else if (n.get() == "Pixel CSS") m = 3;
  }
  function I(e) {
    g.set(false);
    d.set(true);
  }
  function A(e) {
    g.set(true);
  }
  function E(e) {
    g.set(false);
  }
  function T(e) {
    h.trigger();
    if (r.get()) e.preventDefault();
  }
  function y(e) {
    c.trigger();
  }
  function C(e) {
    d.set(false);
    g.set(false);
  }
  function S(e) {
    let t = e.clientX;
    let n = e.clientY;
    if (i.get() != "Document") {
      t = e.offsetX;
      n = e.offsetY;
    }
    if (s.get()) b(t, f.clientHeight - n);
    else b(t, n);
  }
  function L(e) {
    d.set(true);
    S(e);
  }
  function O(e) {
    if (event.touches && event.touches.length > 0) S(e.touches[0]);
  }
  function N(e) {
    g.set(true);
    if (e.touches && e.touches.length > 0) A(e.touches[0]);
  }
  function w(e) {
    g.set(false);
    E();
  }
  function M() {
    if (!f) return;
    f.removeEventListener("touchend", w);
    f.removeEventListener("touchstart", N);
    f.removeEventListener("touchmove", O);
    f.removeEventListener("click", y);
    f.removeEventListener("mousemove", L);
    f.removeEventListener("mouseleave", C);
    f.removeEventListener("mousedown", A);
    f.removeEventListener("mouseup", E);
    f.removeEventListener("mouseenter", I);
    f.removeEventListener("contextmenu", T);
    f = null;
  }
  function B() {
    if (f || !o.get()) M();
    if (!o.get()) return;
    f = p.canvas;
    if (i.get() == "Document") f = document.body;
    if (i.get() == "Parent Element") f = p.canvas.parentElement;
    if (a.get()) {
      f.addEventListener("touchend", w);
      f.addEventListener("touchstart", N);
      f.addEventListener("touchmove", O);
    }
    f.addEventListener("mousemove", L);
    f.addEventListener("mouseleave", C);
    f.addEventListener("mousedown", A);
    f.addEventListener("mouseup", E);
    f.addEventListener("mouseenter", I);
    f.addEventListener("contextmenu", T);
    f.addEventListener("click", y);
  }
};
Ops.Devices.Mouse.Mouse_v3.prototype = new CABLES.Op();
CABLES.OPS["6d1edbc0-088a-43d7-9156-918fb3d7f24b"] = {
  f: Ops.Devices.Mouse.Mouse_v3,
  objName: "Ops.Devices.Mouse.Mouse_v3",
};
Ops.Math.Multiply = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValueFloat("number1", 1),
    i = e.inValueFloat("number2", 2),
    s = e.outNumber("result");
  e.setTitle("*");
  n.onChange = i.onChange = r;
  r();
  function r() {
    const e = n.get();
    const t = i.get();
    s.set(e * t);
  }
};
Ops.Math.Multiply.prototype = new CABLES.Op();
CABLES.OPS["1bbdae06-fbb2-489b-9bcc-36c9d65bd441"] = {
  f: Ops.Math.Multiply,
  objName: "Ops.Math.Multiply",
};
Ops.Math.Clamp = function () {
  CABLES.Op.apply(this, arguments);
  const e = this;
  const t = {};
  const n = e.inValueFloat("val", 0.5),
    i = e.inValueFloat("min", 0),
    s = e.inValueFloat("max", 1),
    r = e.inValueBool("ignore outside values"),
    a = e.outNumber("result");
  n.onChange = i.onChange = s.onChange = o;
  function o() {
    if (r.get()) {
      if (n.get() > s.get()) return;
      if (n.get() < i.get()) return;
    }
    a.set(Math.min(Math.max(n.get(), i.get()), s.get()));
  }
};
Ops.Math.Clamp.prototype = new CABLES.Op();
CABLES.OPS["cda1a98e-5e16-40bd-9b18-a67e9eaad5a1"] = {
  f: Ops.Math.Clamp,
  objName: "Ops.Math.Clamp",
};
window.addEventListener("load", function (e) {
  CABLES.jsLoaded = new Event("CABLES.jsLoaded");
  document.dispatchEvent(CABLES.jsLoaded);
});
(this.CGL = this.CGL || {}),
  (this.CGL.COREMODULES = this.CGL.COREMODULES || {}),
  (this.CGL.COREMODULES.Copytexture = (function (n) {
    var i = {};
    function s(e) {
      if (i[e]) return i[e].exports;
      var t = (i[e] = { i: e, l: !1, exports: {} });
      return n[e].call(t.exports, t, t.exports, s), (t.l = !0), t.exports;
    }
    return (
      (s.m = n),
      (s.c = i),
      (s.d = function (e, t, n) {
        s.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
      }),
      (s.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (s.t = function (t, e) {
        if ((1 & e && (t = s(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (
          (s.r(n),
          Object.defineProperty(n, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var i in t)
            s.d(
              n,
              i,
              function (e) {
                return t[e];
              }.bind(null, i)
            );
        return n;
      }),
      (s.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return s.d(t, "a", t), t;
      }),
      (s.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (s.p = ""),
      s((s.s = 0))
    );
  })([
    function (e, t, n) {
      "use strict";
      n.r(t);
      const s = {
          EASINGS: [
            "linear",
            "absolute",
            "smoothstep",
            "smootherstep",
            "Cubic In",
            "Cubic Out",
            "Cubic In Out",
            "Expo In",
            "Expo Out",
            "Expo In Out",
            "Sin In",
            "Sin Out",
            "Sin In Out",
            "Quart In",
            "Quart Out",
            "Quart In Out",
            "Quint In",
            "Quint Out",
            "Quint In Out",
            "Back In",
            "Back Out",
            "Back In Out",
            "Elastic In",
            "Elastic Out",
            "Bounce In",
            "Bounce Out",
          ],
          EASING_LINEAR: 0,
          EASING_ABSOLUTE: 1,
          EASING_SMOOTHSTEP: 2,
          EASING_SMOOTHERSTEP: 3,
          EASING_CUBICSPLINE: 4,
          EASING_CUBIC_IN: 5,
          EASING_CUBIC_OUT: 6,
          EASING_CUBIC_INOUT: 7,
          EASING_EXPO_IN: 8,
          EASING_EXPO_OUT: 9,
          EASING_EXPO_INOUT: 10,
          EASING_SIN_IN: 11,
          EASING_SIN_OUT: 12,
          EASING_SIN_INOUT: 13,
          EASING_BACK_IN: 14,
          EASING_BACK_OUT: 15,
          EASING_BACK_INOUT: 16,
          EASING_ELASTIC_IN: 17,
          EASING_ELASTIC_OUT: 18,
          EASING_BOUNCE_IN: 19,
          EASING_BOUNCE_OUT: 21,
          EASING_QUART_IN: 22,
          EASING_QUART_OUT: 23,
          EASING_QUART_INOUT: 24,
          EASING_QUINT_IN: 25,
          EASING_QUINT_OUT: 26,
          EASING_QUINT_INOUT: 27,
        },
        r = {
          OP_PORT_TYPE_VALUE: 0,
          OP_PORT_TYPE_FUNCTION: 1,
          OP_PORT_TYPE_OBJECT: 2,
          OP_PORT_TYPE_TEXTURE: 2,
          OP_PORT_TYPE_ARRAY: 3,
          OP_PORT_TYPE_DYNAMIC: 4,
          OP_PORT_TYPE_STRING: 5,
          OP_VERSION_PREFIX: "_v",
        },
        a = { PORT_DIR_IN: 0, PORT_DIR_OUT: 1 },
        o = {
          float32Concat: function (e, t) {
            e instanceof Float32Array || (e = new Float32Array(e)),
              t instanceof Float32Array || (t = new Float32Array(t));
            const n = new Float32Array(e.length + t.length);
            return n.set(e), n.set(t, e.length), n;
          },
        };
      (Math.randomSeed = 1),
        (Math.seededRandom = function (e, t) {
          0 === Math.randomSeed && (Math.randomSeed = 999 * Math.random()),
            (e = e || 1),
            (t = t || 0),
            (Math.randomSeed = (9301 * Math.randomSeed + 49297) % 233280);
          return t + (Math.randomSeed / 233280) * (e - t);
        }),
        (o.arrayWriteToEnd = function (t, e) {
          for (let e = 1; e < t.length; e++) t[e - 1] = t[e];
          t[t.length - 1] = e;
        }),
        (o.isNumeric = function (e) {
          return !isNaN(parseFloat(e)) && isFinite(e);
        }),
        (o.isArray = function (e) {
          return "[object Array]" === Object.prototype.toString.call(e);
        }),
        (String.prototype.endl = function () {
          return this + "\n";
        }),
        (String.prototype.startsWith = function (e) {
          return 0 === this.indexOf(e);
        }),
        (String.prototype.endsWith = function (e) {
          return this.match(e + "$") == e;
        });
      window.performance = window.performance || {
        offset: Date.now(),
        now: function () {
          return Date.now() - this.offset;
        },
      };
      const i =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        l = new Uint8Array(256);
      for (let e = 0; e < i.length; e++) l[i.charCodeAt(e)] = e;
      const h = l,
        u = function (e) {
          let t,
            n,
            i,
            s,
            r,
            a = 0.75 * e.length,
            o = e.length,
            l = 0;
          "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
          let u = new ArrayBuffer(a),
            c = new Uint8Array(u);
          for (t = 0; t < o; t += 4)
            (n = h[e.charCodeAt(t)]),
              (i = h[e.charCodeAt(t + 1)]),
              (s = h[e.charCodeAt(t + 2)]),
              (r = h[e.charCodeAt(t + 3)]),
              (c[l++] = (n << 2) | (i >> 4)),
              (c[l++] = ((15 & i) << 4) | (s >> 2)),
              (c[l++] = ((3 & s) << 6) | (63 & r));
          return u;
        };
      class c {
        constructor(e) {
          this._init(),
            (this._first = !0),
            (this._wireMesh = null),
            e && this.apply(e);
        }
        _init() {
          (this._max = [
            -Number.MAX_VALUE,
            -Number.MAX_VALUE,
            -Number.MAX_VALUE,
          ]),
            (this._min = [
              Number.MAX_VALUE,
              Number.MAX_VALUE,
              Number.MAX_VALUE,
            ]),
            (this._center = [0, 0, 0]),
            (this._size = [0, 0, 0]),
            (this._maxAxis = 0),
            (this._first = !0);
        }
        get maxAxis() {
          return this._maxAxis || 1;
        }
        get size() {
          return this._size;
        }
        get center() {
          return this._center;
        }
        get x() {
          return this._center[0];
        }
        get y() {
          return this._center[1];
        }
        get z() {
          return this._center[2];
        }
        get minX() {
          return this._min[0];
        }
        get minY() {
          return this._min[1];
        }
        get minZ() {
          return this._min[2];
        }
        get maxX() {
          return this._max[0];
        }
        get maxY() {
          return this._max[1];
        }
        get maxZ() {
          return this._max[2];
        }
        apply(t, e) {
          if (t) {
            if (t instanceof c) {
              const e = t;
              this.applyPos(e.maxX, e.maxY, e.maxZ),
                this.applyPos(e.minX, e.minY, e.minZ);
            } else
              for (let e = 0; e < t.vertices.length; e += 3)
                this.applyPos(
                  t.vertices[e],
                  t.vertices[e + 1],
                  t.vertices[e + 2]
                );
            this.calcCenterSize();
          }
        }
        copy() {
          return new c(this);
        }
        get changed() {
          return !(
            this._max[0] == -Number.MAX_VALUE &&
            this._max[1] == -Number.MAX_VALUE &&
            this._max[2] == -Number.MAX_VALUE
          );
        }
        applyPos(e, t, n) {
          if (
            e != Number.MAX_VALUE &&
            e != -Number.MAX_VALUE &&
            t != Number.MAX_VALUE &&
            t != -Number.MAX_VALUE &&
            n != Number.MAX_VALUE &&
            n != -Number.MAX_VALUE &&
            CABLES.UTILS.isNumeric(e) &&
            CABLES.UTILS.isNumeric(t) &&
            CABLES.UTILS.isNumeric(n)
          ) {
            if (this._first)
              return (
                (this._max[0] = e),
                (this._max[1] = t),
                (this._max[2] = n),
                (this._min[0] = e),
                (this._min[1] = t),
                (this._min[2] = n),
                void (this._first = !1)
              );
            (this._max[0] = Math.max(this._max[0], e)),
              (this._max[1] = Math.max(this._max[1], t)),
              (this._max[2] = Math.max(this._max[2], n)),
              (this._min[0] = Math.min(this._min[0], e)),
              (this._min[1] = Math.min(this._min[1], t)),
              (this._min[2] = Math.min(this._min[2], n));
          }
        }
        calcCenterSize() {
          this._first ||
            ((this._size[0] = this._max[0] - this._min[0]),
            (this._size[1] = this._max[1] - this._min[1]),
            (this._size[2] = this._max[2] - this._min[2]),
            (this._center[0] = (this._min[0] + this._max[0]) / 2),
            (this._center[1] = (this._min[1] + this._max[1]) / 2),
            (this._center[2] = (this._min[2] + this._max[2]) / 2),
            (this._maxAxis = Math.max(
              this._size[2],
              Math.max(this._size[0], this._size[1])
            )));
        }
        mulMat4(e) {
          this._first &&
            ((this._max[0] = 0),
            (this._max[1] = 0),
            (this._max[2] = 0),
            (this._min[0] = 0),
            (this._min[1] = 0),
            (this._min[2] = 0),
            (this._first = !1)),
            vec3.transformMat4(this._max, this._max, e),
            vec3.transformMat4(this._min, this._min, e),
            this.calcCenterSize();
        }
        render(e, t) {
          this._wireMesh || (this._wireMesh = new CGL.WireCube(e)),
            e.pushModelMatrix(),
            mat4.translate(e.mMatrix, e.mMatrix, this._center),
            this._wireMesh.render(
              e,
              this._size[0] / 2,
              this._size[1] / 2,
              this._size[2] / 2
            ),
            e.popModelMatrix();
        }
      }
      class g {
        constructor(e) {
          (this._logs = []), (this.initiator = e);
        }
        stack(e) {
          console.error("[" + this.initiator + "] ", e),
            console.log(new Error().stack),
            window.gui &&
              window.gui.emitEvent("coreLogEvent", this.initiator, "error", e);
        }
        groupCollapsed(e) {
          console.groupCollapsed("[" + this.initiator + "] " + e);
        }
        table(e) {
          console.table(e);
        }
        groupEnd() {
          console.groupEnd();
        }
        error(e) {
          console.error("[" + this.initiator + "]", ...arguments),
            window.gui &&
              window.gui.emitEvent(
                "coreLogEvent",
                this.initiator,
                "error",
                arguments
              );
        }
        info(e) {
          console.error("[" + this.initiator + "]", ...arguments),
            window.gui &&
              window.gui.emitEvent(
                "coreLogEvent",
                this.initiator,
                "info",
                arguments
              );
        }
        warn(e) {
          console.warn("[" + this.initiator + "]", ...arguments),
            window.gui &&
              window.gui.emitEvent(
                "coreLogEvent",
                this.initiator,
                "warn",
                arguments
              );
        }
        verbose() {
          ((CABLES.UI &&
            CABLES.UI.logFilter.shouldPrint(this.initiator, ...arguments)) ||
            !CABLES.logSilent) &&
            console.log("[" + this.initiator + "]", ...arguments),
            window.gui &&
              window.gui.emitEvent(
                "coreLogEvent",
                this.initiator,
                "verbose",
                arguments
              );
        }
        log(e) {
          ((CABLES.UI &&
            CABLES.UI.logFilter.shouldPrint(this.initiator, ...arguments)) ||
            !CABLES.logSilent) &&
            console.log("[" + this.initiator + "]", ...arguments),
            window.gui &&
              window.gui.emitEvent(
                "coreLogEvent",
                this.initiator,
                "log",
                arguments
              );
        }
        userInteraction(e) {}
      }
      const d = function (e) {
        (this.name = e || "unknown"),
          (this._log = new g("cgl_geometry")),
          (this.faceVertCount = 3),
          (this.glPrimitive = null),
          (this._attributes = {}),
          (this._vertices = []),
          (this.verticesIndices = []),
          (this.morphTargets = []),
          Object.defineProperty(this, "vertices", {
            get() {
              return this._vertices;
            },
            set(e) {
              this.setVertices(e);
            },
          }),
          Object.defineProperty(this, "texCoords", {
            get() {
              const e = this.getAttribute("texCoords");
              return e ? e.data : [];
            },
            set(e) {
              this.setAttribute("texCoords", e, 2);
            },
          }),
          Object.defineProperty(this, "vertexNormals", {
            get() {
              const e = this.getAttribute("vertexNormals");
              return e ? e.data : [];
            },
            set(e) {
              this.setAttribute("vertexNormals", e, 3);
            },
          }),
          Object.defineProperty(this, "tangents", {
            get() {
              const e = this.getAttribute("tangents");
              return e ? e.data : [];
            },
            set(e) {
              this.setAttribute("tangents", e, 3);
            },
          }),
          Object.defineProperty(this, "biTangents", {
            get() {
              const e = this.getAttribute("biTangents");
              return e ? e.data : [];
            },
            set(e) {
              this.setAttribute("biTangents", e, 3);
            },
          }),
          Object.defineProperty(this, "vertexColors", {
            get() {
              const e = this.getAttribute("vertexColors");
              return e ? e.data : [];
            },
            set(e) {
              this.setAttribute("vertexColors", e, 4);
            },
          });
      };
      (d.prototype.clear = function () {
        (this._vertices = new Float32Array([])),
          (this.verticesIndices = []),
          (this.texCoords = new Float32Array([])),
          (this.vertexNormals = new Float32Array([])),
          (this.tangents = []),
          (this.biTangents = []);
      }),
        (d.prototype.getAttributes = function () {
          return this._attributes;
        }),
        (d.prototype.getAttribute = function (t) {
          for (const e in this._attributes)
            if (this._attributes[e].name == t) return this._attributes[e];
          return null;
        }),
        (d.prototype.setAttribute = function (e, t, n) {
          let i = "";
          (!n || n > 4) &&
            (console.log("itemsize wrong?", n, e),
            this._log.stack("itemsize"),
            (n = 3)),
            1 == n
              ? (i = "float")
              : 2 == n
              ? (i = "vec2")
              : 3 == n
              ? (i = "vec3")
              : 4 == n && (i = "vec4");
          const s = { name: e, data: t, itemSize: n, type: i };
          this._attributes[e] = s;
        }),
        (d.prototype.copyAttribute = function (e, t) {
          const n = this.getAttribute(e);
          t.setAttribute(e, new Float32Array(n.data), n.itemSize);
        }),
        (d.prototype.setVertices = function (e) {
          e instanceof Float32Array
            ? (this._vertices = e)
            : (this._vertices = new Float32Array(e));
        }),
        (d.prototype.setTexCoords = function (e) {
          e instanceof Float32Array
            ? (this.texCoords = e)
            : (this.texCoords = new Float32Array(e));
        }),
        (d.prototype.calcNormals = function (e) {
          e || this.unIndex(), this.calculateNormals({});
        }),
        (d.prototype.flipNormals = function (t, n, i) {
          let s = vec3.create();
          null == t && (t = 1), null == n && (n = 1), null == i && (i = 1);
          for (let e = 0; e < this.vertexNormals.length; e += 3)
            vec3.set(
              s,
              this.vertexNormals[e + 0],
              this.vertexNormals[e + 1],
              this.vertexNormals[e + 2]
            ),
              (s[0] *= -t),
              (s[1] *= -n),
              (s[2] *= -i),
              vec3.normalize(s, s),
              (this.vertexNormals[e + 0] = s[0]),
              (this.vertexNormals[e + 1] = s[1]),
              (this.vertexNormals[e + 2] = s[2]);
        }),
        (d.prototype.getNumTriangles = function () {
          return this.verticesIndices && this.verticesIndices.length
            ? this.verticesIndices.length / 3
            : this.vertices.length / 3;
        }),
        (d.prototype.flipVertDir = function () {
          const t = [];
          t.length = this.verticesIndices.length;
          for (let e = 0; e < this.verticesIndices.length; e += 3)
            (t[e] = this.verticesIndices[e + 2]),
              (t[e + 1] = this.verticesIndices[e + 1]),
              (t[e + 2] = this.verticesIndices[e]);
          this.verticesIndices = t;
        }),
        (d.prototype.setPointVertices = function (t) {
          if (t.length % 3 == 0) {
            t instanceof Float32Array
              ? (this.vertices = t)
              : (this.vertices = new Float32Array(t)),
              this.texCoords instanceof Float32Array ||
                (this.texCoords = new Float32Array((t.length / 3) * 2)),
              (this.verticesIndices.length = t.length / 3);
            for (let e = 0; e < t.length / 3; e++)
              (this.verticesIndices[e] = e),
                (this.texCoords[2 * e] = 0),
                (this.texCoords[2 * e + 1] = 0);
          } else
            this._log.error(
              "SetPointVertices: Array must be multiple of three."
            );
        }),
        (d.prototype.merge = function (t) {
          if (!t) return;
          if (
            this.isIndexed() != t.isIndexed() &&
            (this.isIndexed() && this.unIndex(!1, !0), t.isIndexed())
          ) {
            const n = t.copy();
            n.unIndex(!1, !0), (t = n);
          }
          const n = this.verticesIndices.length,
            i = this._vertices.length / 3;
          this.verticesIndices.length =
            this.verticesIndices.length + t.verticesIndices.length;
          for (let e = 0; e < t.verticesIndices.length; e++)
            this.verticesIndices[n + e] = t.verticesIndices[e] + i;
          (this.vertices = o.float32Concat(this._vertices, t.vertices)),
            (this.texCoords = o.float32Concat(this.texCoords, t.texCoords)),
            (this.vertexNormals = o.float32Concat(
              this.vertexNormals,
              t.vertexNormals
            )),
            (this.tangents = o.float32Concat(this.tangents, t.tangents)),
            (this.biTangents = o.float32Concat(this.biTangents, t.biTangents));
        }),
        (d.prototype.copy = function () {
          const t = new d(this.name + " copy");
          if (
            ((t.faceVertCount = this.faceVertCount),
            (t.glPrimitive = this.glPrimitive),
            t.setVertices(this._vertices.slice(0)),
            this.verticesIndices)
          ) {
            t.verticesIndices.length = this.verticesIndices.length;
            for (let e = 0; e < this.verticesIndices.length; e++)
              t.verticesIndices[e] = this.verticesIndices[e];
          }
          for (let e in this._attributes) this.copyAttribute(e, t);
          t.morphTargets.length = this.morphTargets.length;
          for (let e = 0; e < this.morphTargets.length; e++)
            t.morphTargets[e] = this.morphTargets[e];
          return t;
        }),
        (d.prototype.calculateNormals = function (t) {
          const n = vec3.create(),
            i = vec3.create(),
            s = vec3.create();
          function r(e) {
            return (
              vec3.subtract(n, e[0], e[1]),
              vec3.subtract(i, e[0], e[2]),
              vec3.cross(s, n, i),
              vec3.normalize(s, s),
              t &&
                t.forceZUp &&
                s[2] < 0 &&
                ((s[0] *= -1), (s[1] *= -1), (s[2] *= -1)),
              s
            );
          }
          (this.getVertexVec = function (e) {
            const t = [0, 0, 0];
            return (
              (t[0] = this.vertices[3 * e + 0]),
              (t[1] = this.vertices[3 * e + 1]),
              (t[2] = this.vertices[3 * e + 2]),
              t
            );
          }),
            (this.vertexNormals instanceof Float32Array &&
              this.vertexNormals.length == this.vertices.length) ||
              (this.vertexNormals = new Float32Array(this.vertices.length));
          for (let e = 0; e < this.vertices.length; e++)
            this.vertexNormals[e] = 0;
          if (this.isIndexed()) {
            const t = [];
            t.length = Math.floor(this.verticesIndices.length / 3);
            for (let e = 0; e < this.verticesIndices.length; e += 3) {
              const i = [
                this.getVertexVec(this.verticesIndices[e + 0]),
                this.getVertexVec(this.verticesIndices[e + 1]),
                this.getVertexVec(this.verticesIndices[e + 2]),
              ];
              (t[e / 3] = r(i)),
                (this.vertexNormals[3 * this.verticesIndices[e + 0] + 0] +=
                  t[e / 3][0]),
                (this.vertexNormals[3 * this.verticesIndices[e + 0] + 1] +=
                  t[e / 3][1]),
                (this.vertexNormals[3 * this.verticesIndices[e + 0] + 2] +=
                  t[e / 3][2]),
                (this.vertexNormals[3 * this.verticesIndices[e + 1] + 0] +=
                  t[e / 3][0]),
                (this.vertexNormals[3 * this.verticesIndices[e + 1] + 1] +=
                  t[e / 3][1]),
                (this.vertexNormals[3 * this.verticesIndices[e + 1] + 2] +=
                  t[e / 3][2]),
                (this.vertexNormals[3 * this.verticesIndices[e + 2] + 0] +=
                  t[e / 3][0]),
                (this.vertexNormals[3 * this.verticesIndices[e + 2] + 1] +=
                  t[e / 3][1]),
                (this.vertexNormals[3 * this.verticesIndices[e + 2] + 2] +=
                  t[e / 3][2]);
            }
            for (let t = 0; t < this.verticesIndices.length; t += 3)
              for (let e = 0; e < 3; e++) {
                const i = [
                  this.vertexNormals[3 * this.verticesIndices[t + e] + 0],
                  this.vertexNormals[3 * this.verticesIndices[t + e] + 1],
                  this.vertexNormals[3 * this.verticesIndices[t + e] + 2],
                ];
                vec3.normalize(i, i),
                  (this.vertexNormals[3 * this.verticesIndices[t + e] + 0] =
                    i[0]),
                  (this.vertexNormals[3 * this.verticesIndices[t + e] + 1] =
                    i[1]),
                  (this.vertexNormals[3 * this.verticesIndices[t + e] + 2] =
                    i[2]);
              }
          } else {
            const t = [];
            for (let e = 0; e < this.vertices.length; e += 9) {
              const i = r([
                [
                  this.vertices[e + 0],
                  this.vertices[e + 1],
                  this.vertices[e + 2],
                ],
                [
                  this.vertices[e + 3],
                  this.vertices[e + 4],
                  this.vertices[e + 5],
                ],
                [
                  this.vertices[e + 6],
                  this.vertices[e + 7],
                  this.vertices[e + 8],
                ],
              ]);
              t.push(i[0], i[1], i[2], i[0], i[1], i[2], i[0], i[1], i[2]);
            }
            this.vertexNormals = t;
          }
        }),
        (d.prototype.calcTangentsBitangents = function () {
          if (!this.vertices.length)
            return void this._log.error(
              "Cannot calculate tangents/bitangents without vertices."
            );
          if (!this.vertexNormals.length)
            return void this._log.error(
              "Cannot calculate tangents/bitangents without normals."
            );
          if (!this.texCoords.length) {
            const o = (this.vertices.length / 3) * 2;
            this.texCoords = new Float32Array(o);
            for (let e = 0; e < o; e += 1) this.texCoords[e] = 0;
          }
          if (!this.verticesIndices || !this.verticesIndices.length)
            return void this._log.error(
              "Cannot calculate tangents/bitangents without vertex indices."
            );
          if (this.verticesIndices.length % 3 != 0)
            return void this._log.error("Vertex indices mismatch!");
          const o = this.verticesIndices.length / 3,
            l = this.vertices.length / 3;
          (this.tangents = new Float32Array(this.vertexNormals.length)),
            (this.biTangents = new Float32Array(this.vertexNormals.length));
          const u = [];
          u.length = 2 * l;
          const c = vec3.create(),
            h = vec3.create(),
            g = vec3.create(),
            d = vec2.create(),
            p = vec2.create(),
            m = vec2.create(),
            f = vec3.create(),
            _ = vec3.create();
          for (let a = 0; a < o; a += 1) {
            const o = this.verticesIndices[3 * a],
              v = this.verticesIndices[3 * a + 1],
              b = this.verticesIndices[3 * a + 2];
            vec3.set(
              c,
              this.vertices[3 * o],
              this.vertices[3 * o + 1],
              this.vertices[3 * o + 2]
            ),
              vec3.set(
                h,
                this.vertices[3 * v],
                this.vertices[3 * v + 1],
                this.vertices[3 * v + 2]
              ),
              vec3.set(
                g,
                this.vertices[3 * b],
                this.vertices[3 * b + 1],
                this.vertices[3 * b + 2]
              ),
              vec2.set(d, this.texCoords[2 * o], this.texCoords[2 * o + 1]),
              vec2.set(p, this.texCoords[2 * v], this.texCoords[2 * v + 1]),
              vec2.set(m, this.texCoords[2 * b], this.texCoords[2 * b + 1]);
            const x = h[0] - c[0],
              I = g[0] - c[0],
              A = h[1] - c[1],
              E = g[1] - c[1],
              T = h[2] - c[2],
              e = g[2] - c[2],
              t = p[0] - d[0],
              n = m[0] - d[0],
              i = p[1] - d[1],
              s = m[1] - d[1],
              r = 1 / (t * s - n * i);
            vec3.set(
              f,
              (s * x - i * I) * r,
              (s * A - i * E) * r,
              (s * T - i * e) * r
            ),
              vec3.set(
                _,
                (t * I - n * x) * r,
                (t * E - n * A) * r,
                (t * e - n * T) * r
              ),
              (u[o] = f),
              (u[v] = f),
              (u[b] = f),
              (u[o + l] = _),
              (u[v + l] = _),
              (u[b + l] = _);
          }
          const t = vec3.create(),
            v = vec3.create(),
            b = vec3.create(),
            x = vec3.create(),
            I = vec3.create(),
            A = vec3.create(),
            E = vec3.create(),
            T = vec3.create();
          for (let e = 0; e < l; e += 1) {
            if (!u[e]) continue;
            vec3.set(
              t,
              this.vertexNormals[3 * e],
              this.vertexNormals[3 * e + 1],
              this.vertexNormals[3 * e + 2]
            ),
              vec3.set(v, u[e][0], u[e][1], u[e][2]);
            const c = vec3.dot(t, v);
            vec3.scale(I, t, c),
              vec3.subtract(A, v, I),
              vec3.normalize(T, A),
              vec3.cross(E, t, v);
            vec3.dot(E, u[e + l]);
            const h = 1;
            vec3.scale(b, T, 1 / h),
              vec3.cross(x, t, b),
              (this.tangents[3 * e + 0] = b[0]),
              (this.tangents[3 * e + 1] = b[1]),
              (this.tangents[3 * e + 2] = b[2]),
              (this.biTangents[3 * e + 0] = x[0]),
              (this.biTangents[3 * e + 1] = x[1]),
              (this.biTangents[3 * e + 2] = x[2]);
          }
        }),
        (d.prototype.isIndexed = function () {
          return 0 == this._vertices.length || 0 != this.verticesIndices.length;
        }),
        (d.prototype.unIndex = function (e, t) {
          const n = [],
            i = [],
            s = [],
            r = [],
            a = [],
            o = [];
          let l = 0,
            u = 0;
          for (u = 0; u < this.verticesIndices.length; u += 3)
            n.push(
              this.vertices[3 * this.verticesIndices[u + 0] + 0],
              this.vertices[3 * this.verticesIndices[u + 0] + 1],
              this.vertices[3 * this.verticesIndices[u + 0] + 2]
            ),
              r.push(
                this.vertexNormals[3 * this.verticesIndices[u + 0] + 0],
                this.vertexNormals[3 * this.verticesIndices[u + 0] + 1],
                this.vertexNormals[3 * this.verticesIndices[u + 0] + 2]
              ),
              this.tangents.length > 0 &&
                a.push(
                  this.tangents[3 * this.verticesIndices[u + 0] + 0],
                  this.tangents[3 * this.verticesIndices[u + 0] + 1],
                  this.tangents[3 * this.verticesIndices[u + 0] + 2]
                ),
              this.biTangents.length > 0 &&
                o.push(
                  this.biTangents[3 * this.verticesIndices[u + 0] + 0],
                  this.biTangents[3 * this.verticesIndices[u + 0] + 1],
                  this.biTangents[3 * this.verticesIndices[u + 0] + 2]
                ),
              this.texCoords
                ? s.push(
                    this.texCoords[2 * this.verticesIndices[u + 0] + 0],
                    this.texCoords[2 * this.verticesIndices[u + 0] + 1]
                  )
                : s.push(0, 0),
              i.push(l),
              l++,
              n.push(
                this.vertices[3 * this.verticesIndices[u + 1] + 0],
                this.vertices[3 * this.verticesIndices[u + 1] + 1],
                this.vertices[3 * this.verticesIndices[u + 1] + 2]
              ),
              r.push(
                this.vertexNormals[3 * this.verticesIndices[u + 1] + 0],
                this.vertexNormals[3 * this.verticesIndices[u + 1] + 1],
                this.vertexNormals[3 * this.verticesIndices[u + 1] + 2]
              ),
              this.tangents.length > 0 &&
                a.push(
                  this.tangents[3 * this.verticesIndices[u + 1] + 0],
                  this.tangents[3 * this.verticesIndices[u + 1] + 1],
                  this.tangents[3 * this.verticesIndices[u + 1] + 2]
                ),
              this.biTangents.length > 0 &&
                o.push(
                  this.biTangents[3 * this.verticesIndices[u + 1] + 0],
                  this.biTangents[3 * this.verticesIndices[u + 1] + 1],
                  this.biTangents[3 * this.verticesIndices[u + 1] + 2]
                ),
              this.texCoords
                ? s.push(
                    this.texCoords[2 * this.verticesIndices[u + 1] + 0],
                    this.texCoords[2 * this.verticesIndices[u + 1] + 1]
                  )
                : s.push(0, 0),
              i.push(l),
              l++,
              n.push(
                this.vertices[3 * this.verticesIndices[u + 2] + 0],
                this.vertices[3 * this.verticesIndices[u + 2] + 1],
                this.vertices[3 * this.verticesIndices[u + 2] + 2]
              ),
              r.push(
                this.vertexNormals[3 * this.verticesIndices[u + 2] + 0],
                this.vertexNormals[3 * this.verticesIndices[u + 2] + 1],
                this.vertexNormals[3 * this.verticesIndices[u + 2] + 2]
              ),
              this.tangents.length > 0 &&
                a.push(
                  this.tangents[3 * this.verticesIndices[u + 2] + 0],
                  this.tangents[3 * this.verticesIndices[u + 2] + 1],
                  this.tangents[3 * this.verticesIndices[u + 2] + 2]
                ),
              this.biTangents.length > 0 &&
                o.push(
                  this.biTangents[3 * this.verticesIndices[u + 2] + 0],
                  this.biTangents[3 * this.verticesIndices[u + 2] + 1],
                  this.biTangents[3 * this.verticesIndices[u + 2] + 2]
                ),
              this.texCoords
                ? s.push(
                    this.texCoords[2 * this.verticesIndices[u + 2] + 0],
                    this.texCoords[2 * this.verticesIndices[u + 2] + 1]
                  )
                : s.push(0, 0),
              i.push(l),
              l++;
          (this.vertices = n),
            (this.texCoords = s),
            (this.vertexNormals = r),
            a.length > 0 && (this.tangents = a),
            o.length > 0 && (this.biTangents = o),
            (this.verticesIndices.length = 0),
            e && (this.verticesIndices = i),
            t || this.calculateNormals();
        }),
        (d.prototype.calcBarycentric = function () {
          let t = [];
          t.length = this.vertices.length;
          for (let e = 0; e < this.vertices.length; e++) t[e] = 0;
          let n = 0;
          for (let e = 0; e < this.vertices.length; e += 3)
            (t[e + n] = 1), n++, 3 == n && (n = 0);
          this.setAttribute("attrBarycentric", t, 3);
        }),
        (d.prototype.getBounds = function () {
          return new c(this);
        }),
        (d.prototype.center = function (e, t, n) {
          void 0 === e && ((e = !0), (t = !0), (n = !0));
          let i = 0;
          const s = this.getBounds(),
            r = [
              s.minX + (s.maxX - s.minX) / 2,
              s.minY + (s.maxY - s.minY) / 2,
              s.minZ + (s.maxZ - s.minZ) / 2,
            ];
          for (i = 0; i < this.vertices.length; i += 3)
            this.vertices[i + 0] == this.vertices[i + 0] &&
              (e && (this.vertices[i + 0] -= r[0]),
              t && (this.vertices[i + 1] -= r[1]),
              n && (this.vertices[i + 2] -= r[2]));
          return r;
        }),
        (d.prototype.mapTexCoords2d = function () {
          const n = this.getBounds(),
            i = this.vertices.length / 3;
          this.texCoords = new Float32Array(2 * i);
          for (let t = 0; t < i; t++) {
            const i = this.vertices[3 * t + 0],
              e = this.vertices[3 * t + 1];
            (this.texCoords[2 * t + 0] = i / (n.maxX - n.minX) + 0.5),
              (this.texCoords[2 * t + 1] = 1 - e / (n.maxY - n.minY) + 0.5);
          }
        }),
        (d.prototype.getInfo = function () {
          const e = {};
          return (
            3 == this.faceVertCount && this.verticesIndices
              ? (e.numFaces = this.verticesIndices.length / 3)
              : (e.numFaces = 0),
            this.verticesIndices &&
              this.verticesIndices.length &&
              (e.indices = this.verticesIndices.length),
            this.vertices
              ? (e.numVerts = this.vertices.length / 3)
              : (e.numVerts = 0),
            this.vertexNormals
              ? (e.numNormals = this.vertexNormals.length / 3)
              : (e.numNormals = 0),
            this.texCoords
              ? (e.numTexCoords = this.texCoords.length / 2)
              : (e.numTexCoords = 0),
            this.tangents
              ? (e.numTangents = this.tangents.length / 3)
              : (e.numTangents = 0),
            this.biTangents
              ? (e.numBiTangents = this.biTangents.length / 3)
              : (e.numBiTangents = 0),
            this.biTangents
              ? (e.numBiTangents = this.biTangents.length / 3)
              : (e.numBiTangents = 0),
            this.vertexColors
              ? (e.numVertexColors = this.vertexColors.length / 4)
              : (e.numVertexColors = 0),
            this.getAttributes()
              ? (e.numAttribs = Object.keys(this.getAttributes()).length)
              : (e.numAttribs = 0),
            (e.isIndexed = this.isIndexed()),
            e
          );
        }),
        (d.buildFromFaces = function (s, e, r) {
          const a = [],
            o = [];
          for (let e = 0; e < s.length; e += 3) {
            const l = s[e + 0],
              t = s[e + 1],
              n = s[e + 2],
              i = [-1, -1, -1];
            if (r)
              for (let e = 0; e < a.length; e += 3)
                a[e + 0] == l[0] &&
                  a[e + 1] == l[1] &&
                  a[e + 2] == l[2] &&
                  (i[0] = e / 3),
                  a[e + 0] == t[0] &&
                    a[e + 1] == t[1] &&
                    a[e + 2] == t[2] &&
                    (i[1] = e / 3),
                  a[e + 0] == n[0] &&
                    a[e + 1] == n[1] &&
                    a[e + 2] == n[2] &&
                    (i[2] = e / 3);
            -1 == i[0] &&
              (a.push(l[0], l[1], l[2]), (i[0] = (a.length - 1) / 3)),
              -1 == i[1] &&
                (a.push(t[0], t[1], t[2]), (i[1] = (a.length - 1) / 3)),
              -1 == i[2] &&
                (a.push(n[0], n[1], n[2]), (i[2] = (a.length - 1) / 3)),
              o.push(parseInt(i[0], 10)),
              o.push(parseInt(i[1], 10)),
              o.push(parseInt(i[2], 10));
          }
          const l = new d(e);
          return (l.name = e), (l.vertices = a), (l.verticesIndices = o), l;
        }),
        (d.json2geom = function (t) {
          const n = new d("jsonMeshGeom");
          if (
            ((n.verticesIndices = []),
            (n.vertices = t.vertices || []),
            (n.vertexNormals = t.normals || []),
            (n.vertexColors = t.colors || []),
            (n.tangents = t.tangents || []),
            (n.biTangents = t.bitangents || []),
            t.texturecoords && n.setTexCoords(t.texturecoords[0]),
            t.vertices_b64 &&
              (n.vertices = new Float32Array(u(t.vertices_b64))),
            t.normals_b64 &&
              (n.vertexNormals = new Float32Array(u(t.normals_b64))),
            t.tangents_b64 &&
              (n.tangents = new Float32Array(u(t.tangents_b64))),
            t.bitangents_b64 &&
              (n.biTangents = new Float32Array(u(t.bitangents_b64))),
            t.texturecoords_b64 &&
              n.setTexCoords(new Float32Array(u(t.texturecoords_b64[0]))),
            t.faces_b64)
          )
            n.verticesIndices = new Uint32Array(u(t.faces_b64));
          else {
            n.verticesIndices.length = 3 * t.faces.length;
            for (let e = 0; e < t.faces.length; e++)
              (n.verticesIndices[3 * e] = t.faces[e][0]),
                (n.verticesIndices[3 * e + 1] = t.faces[e][1]),
                (n.verticesIndices[3 * e + 2] = t.faces[e][2]);
          }
          return n;
        });
      const p = function () {
          (this._log = new g("eventtaget")),
            (this._eventCallbacks = {}),
            (this._logName = ""),
            (this._logEvents = !1),
            (this._listeners = {}),
            (this.addEventListener = this.on =
              function (e, t, n) {
                const i = { id: (n || "") + CABLES.uuid(), name: e, cb: t };
                return (
                  this._eventCallbacks[e]
                    ? this._eventCallbacks[e].push(i)
                    : (this._eventCallbacks[e] = [i]),
                  (this._listeners[i.id] = i),
                  i.id
                );
              }),
            (this.hasEventListener = function (e, t) {
              if (e && !t) return !!this._listeners[e];
              if (
                (this._log.warn("old eventtarget function haseventlistener!"),
                e && t && this._eventCallbacks[e])
              ) {
                return -1 != this._eventCallbacks[e].indexOf(t);
              }
            }),
            (this.removeEventListener = this.off =
              function (i, s) {
                if (null == i) return;
                if (!s) {
                  const s = this._listeners[i];
                  if (!s) return;
                  let n = !0;
                  for (; n; ) {
                    n = !1;
                    let t = -1;
                    for (
                      let e = 0;
                      e < this._eventCallbacks[s.name].length;
                      e++
                    )
                      0 === this._eventCallbacks[s.name][e].id.indexOf(i) &&
                        ((n = !0), (t = e));
                    -1 !== t &&
                      (this._eventCallbacks[s.name].splice(t, 1),
                      delete this._listeners[i]);
                  }
                  return;
                }
                this._log.stack(
                  " old function signature: removeEventListener! use listener id"
                );
                let t = null;
                for (let e = 0; e < this._eventCallbacks[i].length; e++)
                  this._eventCallbacks[i][e].cb == s && (t = e);
                null !== t
                  ? delete this._eventCallbacks[t]
                  : this._log.warn("removeEventListener not found " + i);
              }),
            (this.logEvents = function (e, t) {
              (this._logEvents = e), (this._logName = t);
            }),
            (this.emitEvent = function (t, n, i, s, r, a, o) {
              if (
                (this._logEvents &&
                  console.log(
                    "[event] ",
                    this._logName,
                    t,
                    this._eventCallbacks
                  ),
                this._eventCallbacks[t])
              )
                for (let e = 0; e < this._eventCallbacks[t].length; e++)
                  this._eventCallbacks[t][e] &&
                    this._eventCallbacks[t][e].cb(n, i, s, r, a, o);
              else
                this._logEvents &&
                  console.log(
                    "[event] has no event callback",
                    t,
                    this._eventCallbacks
                  );
            });
        },
        m = {
          Key: function (e) {
            (this.time = 0),
              (this.value = 0),
              (this.ui = null),
              (this.onChange = null),
              (this._easing = 0),
              (this.bezTangIn = 0),
              (this.bezTangOut = 0),
              (this.cb = null),
              (this.cbTriggered = !1);
            this.setEasing(s.EASING_LINEAR), this.set(e);
          },
        };
      (m.Key.cubicSpline = function (e, t, n) {
        let i = e * e,
          s = i * e;
        return (
          (2 * s - 3 * i + 1) * t.value +
          (s - 2 * i + e) * t.bezTangOut +
          (-2 * s + 3 * i) * n.value +
          (s - i) * n.bezTangIn
        );
      }),
        (m.Key.easeCubicSpline = function (e, t) {
          return m.Key.cubicSpline(e, this, t);
        }),
        (m.Key.linear = function (e, t, n) {
          return parseFloat(t.value) + parseFloat(n.value - t.value) * e;
        }),
        (m.Key.easeLinear = function (e, t) {
          return m.Key.linear(e, this, t);
        }),
        (m.Key.easeAbsolute = function (e, t) {
          return this.value;
        });
      m.Key.easeExpoIn = function (e, t) {
        return (
          (e = (function (e) {
            return Math.pow(2, 10 * (e - 1));
          })(e)),
          m.Key.linear(e, this, t)
        );
      };
      m.Key.easeExpoOut = function (e, t) {
        return (
          (e = (function (e) {
            return (e = 1 - Math.pow(2, -10 * e));
          })(e)),
          m.Key.linear(e, this, t)
        );
      };
      (m.Key.easeExpoInOut = function (e, t) {
        return (
          (e = (function (e) {
            return (
              (e *= 2) < 1
                ? (e = 0.5 * Math.pow(2, 10 * (e - 1)))
                : (e--, (e = 0.5 * (2 - Math.pow(2, -10 * e)))),
              e
            );
          })(e)),
          m.Key.linear(e, this, t)
        );
      }),
        (m.Key.easeSinIn = function (e, t) {
          return (
            (e = -1 * Math.cos((e * Math.PI) / 2) + 1), m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeSinOut = function (e, t) {
          return (e = Math.sin((e * Math.PI) / 2)), m.Key.linear(e, this, t);
        }),
        (m.Key.easeSinInOut = function (e, t) {
          return (
            (e = -0.5 * (Math.cos(Math.PI * e) - 1)), m.Key.linear(e, this, t)
          );
        });
      (m.Key.easeCubicIn = function (e, t) {
        return (
          (e = (function (e) {
            return (e *= e * e);
          })(e)),
          m.Key.linear(e, this, t)
        );
      }),
        (m.Key.easeInQuint = function (e, t) {
          return (e *= e * e * e * e), m.Key.linear(e, this, t);
        }),
        (m.Key.easeOutQuint = function (e, t) {
          return (e = (e -= 1) * e * e * e * e + 1), m.Key.linear(e, this, t);
        }),
        (m.Key.easeInOutQuint = function (e, t) {
          return (
            (e /= 0.5) < 1
              ? (e *= 0.5 * e * e * e * e)
              : (e = 0.5 * ((e -= 2) * e * e * e * e + 2)),
            m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeInQuart = function (e, t) {
          return (e *= e * e * e), m.Key.linear(e, this, t);
        }),
        (m.Key.easeOutQuart = function (e, t) {
          return (
            (e = -1 * ((e -= 1) * e * e * e - 1)), m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeInOutQuart = function (e, t) {
          return (
            (e /= 0.5) < 1
              ? (e *= 0.5 * e * e * e)
              : (e = -0.5 * ((e -= 2) * e * e * e - 2)),
            m.Key.linear(e, this, t)
          );
        }),
        (m.Key.bounce = function (e) {
          return (
            (e /= 1) < 1 / 2.75
              ? (e *= 7.5625 * e)
              : (e =
                  e < 2 / 2.75
                    ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
                    : e < 2.5 / 2.75
                    ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
                    : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375),
            e
          );
        }),
        (m.Key.easeInBounce = function (e, t) {
          return m.Key.linear(m.Key.bounce(e), this, t);
        }),
        (m.Key.easeOutBounce = function (e, t) {
          return m.Key.linear(m.Key.bounce(e), this, t);
        }),
        (m.Key.easeInElastic = function (e, t) {
          let n = 1.70158,
            i = 0,
            s = 1;
          return (
            0 === e
              ? (e = 0)
              : 1 == (e /= 1)
              ? (e = 1)
              : (i || (i = 0.3),
                s < Math.abs(1)
                  ? ((s = 1), (n = i / 4))
                  : (n = (i / (2 * Math.PI)) * Math.asin(1 / s)),
                (e =
                  -s *
                    Math.pow(2, 10 * (e -= 1)) *
                    Math.sin(((1 * e - n) * (2 * Math.PI)) / i) +
                  0)),
            m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeOutElastic = function (e, t) {
          let n = 1.70158,
            i = 0,
            s = 1;
          return (
            0 === e
              ? (e = 0)
              : 1 == (e /= 1)
              ? (e = 1)
              : (i || (i = 0.3),
                s < Math.abs(1)
                  ? ((s = 1), (n = i / 4))
                  : (n = (i / (2 * Math.PI)) * Math.asin(1 / s)),
                (e =
                  s *
                    Math.pow(2, -10 * e) *
                    Math.sin(((1 * e - n) * (2 * Math.PI)) / i) +
                  1 +
                  0)),
            m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeInBack = function (e, t) {
          const n = 1.70158;
          return (e = e * e * ((n + 1) * e - n)), m.Key.linear(e, this, t);
        }),
        (m.Key.easeOutBack = function (e, t) {
          const n = 1.70158;
          return (
            (e = (e = e / 1 - 1) * e * ((n + 1) * e + n) + 1),
            m.Key.linear(e, this, t)
          );
        }),
        (m.Key.easeInOutBack = function (e, t) {
          let n = 1.70158;
          return (
            (e =
              (e /= 0.5) < 1
                ? e * e * ((1 + (n *= 1.525)) * e - n) * 0.5
                : 0.5 * ((e -= 2) * e * ((1 + (n *= 1.525)) * e + n) + 2)),
            m.Key.linear(e, this, t)
          );
        });
      m.Key.easeCubicOut = function (e, t) {
        return (
          (e = (function (e) {
            return (e = --e * e * e + 1);
          })(e)),
          m.Key.linear(e, this, t)
        );
      };
      (m.Key.easeCubicInOut = function (e, t) {
        return (
          (e = (function (e) {
            return (
              (e *= 2) < 1
                ? (e *= 0.5 * e * e)
                : (e = 0.5 * ((e -= 2) * e * e + 2)),
              e
            );
          })(e)),
          m.Key.linear(e, this, t)
        );
      }),
        (m.Key.easeSmoothStep = function (e, t) {
          const n = Math.max(0, Math.min(1, e));
          return (e = n * n * (3 - 2 * n)), m.Key.linear(e, this, t);
        }),
        (m.Key.easeSmootherStep = function (e, t) {
          const n = Math.max(0, Math.min(1, (e - 0) / 1));
          return (
            (e = n * n * n * (n * (6 * n - 15) + 10)), m.Key.linear(e, this, t)
          );
        }),
        (m.Key.prototype.setEasing = function (e) {
          (this._easing = e),
            this._easing == s.EASING_LINEAR
              ? (this.ease = m.Key.easeLinear)
              : this._easing == s.EASING_ABSOLUTE
              ? (this.ease = m.Key.easeAbsolute)
              : this._easing == s.EASING_SMOOTHSTEP
              ? (this.ease = m.Key.easeSmoothStep)
              : this._easing == s.EASING_SMOOTHERSTEP
              ? (this.ease = m.Key.easeSmootherStep)
              : this._easing == s.EASING_CUBIC_IN
              ? (this.ease = m.Key.easeCubicIn)
              : this._easing == s.EASING_CUBIC_OUT
              ? (this.ease = m.Key.easeCubicOut)
              : this._easing == s.EASING_CUBIC_INOUT
              ? (this.ease = m.Key.easeCubicInOut)
              : this._easing == s.EASING_EXPO_IN
              ? (this.ease = m.Key.easeExpoIn)
              : this._easing == s.EASING_EXPO_OUT
              ? (this.ease = m.Key.easeExpoOut)
              : this._easing == s.EASING_EXPO_INOUT
              ? (this.ease = m.Key.easeExpoInOut)
              : this._easing == s.EASING_SIN_IN
              ? (this.ease = m.Key.easeSinIn)
              : this._easing == s.EASING_SIN_OUT
              ? (this.ease = m.Key.easeSinOut)
              : this._easing == s.EASING_SIN_INOUT
              ? (this.ease = m.Key.easeSinInOut)
              : this._easing == s.EASING_BACK_OUT
              ? (this.ease = m.Key.easeOutBack)
              : this._easing == s.EASING_BACK_IN
              ? (this.ease = m.Key.easeInBack)
              : this._easing == s.EASING_BACK_INOUT
              ? (this.ease = m.Key.easeInOutBack)
              : this._easing == s.EASING_ELASTIC_IN
              ? (this.ease = m.Key.easeInElastic)
              : this._easing == s.EASING_ELASTIC_OUT
              ? (this.ease = m.Key.easeOutElastic)
              : this._easing == s.EASING_ELASTIC_INOUT
              ? (this.ease = m.Key.easeElasticInOut)
              : this._easing == s.EASING_BOUNCE_IN
              ? (this.ease = m.Key.easeInBounce)
              : this._easing == s.EASING_BOUNCE_OUT
              ? (this.ease = m.Key.easeOutBounce)
              : this._easing == s.EASING_QUART_OUT
              ? (this.ease = m.Key.easeOutQuart)
              : this._easing == s.EASING_QUART_IN
              ? (this.ease = m.Key.easeInQuart)
              : this._easing == s.EASING_QUART_INOUT
              ? (this.ease = m.Key.easeInOutQuart)
              : this._easing == s.EASING_QUINT_OUT
              ? (this.ease = m.Key.easeOutQuint)
              : this._easing == s.EASING_QUINT_IN
              ? (this.ease = m.Key.easeInQuint)
              : this._easing == s.EASING_QUINT_INOUT
              ? (this.ease = m.Key.easeInOutQuint)
              : this._easing == s.EASING_CUBICSPLINE
              ? (this.ease = m.Key.easeCubicSpline)
              : ((this._easing = s.EASING_LINEAR),
                (this.ease = m.Key.easeLinear));
        }),
        (m.Key.prototype.trigger = function () {
          this.cb(), (this.cbTriggered = !0);
        }),
        (m.Key.prototype.setValue = function (e) {
          (this.value = e), null !== this.onChange && this.onChange();
        }),
        (m.Key.prototype.set = function (e) {
          e &&
            (e.e && this.setEasing(e.e),
            e.cb && ((this.cb = e.cb), (this.cbTriggered = !1)),
            e.b,
            e.hasOwnProperty("t") && (this.time = e.t),
            e.hasOwnProperty("time") && (this.time = e.time),
            e.hasOwnProperty("v")
              ? (this.value = e.v)
              : e.hasOwnProperty("value") && (this.value = e.value)),
            null !== this.onChange && this.onChange();
        }),
        (m.Key.prototype.getSerialized = function () {
          const e = {};
          return (e.t = this.time), (e.v = this.value), (e.e = this._easing), e;
        }),
        (m.Key.prototype.getEasing = function () {
          return this._easing;
        });
      const f = function (e) {
        p.apply(this),
          (e = e || {}),
          (this.keys = []),
          (this.onChange = null),
          (this.stayInTimeline = !1),
          (this.loop = !1),
          (this._log = new g("Anim")),
          (this.defaultEasing = e.defaultEasing || s.EASING_LINEAR),
          (this.onLooped = null),
          (this._timesLooped = 0),
          (this._needsSort = !1);
      };
      (f.prototype.forceChangeCallback = function () {
        null !== this.onChange && this.onChange(),
          this.emitEvent("onChange", this);
      }),
        (f.prototype.getLoop = function () {
          return this.loop;
        }),
        (f.prototype.setLoop = function (e) {
          (this.loop = e), this.emitEvent("onChange", this);
        }),
        (f.prototype.hasEnded = function (e) {
          return (
            0 === this.keys.length || this.keys[this.keys.length - 1].time <= e
          );
        }),
        (f.prototype.isRising = function (e) {
          if (this.hasEnded(e)) return !1;
          const t = this.getKeyIndex(e);
          return this.keys[t].value < this.keys[t + 1].value;
        }),
        (f.prototype.clearBefore = function (e) {
          const t = this.getValue(e),
            n = this.getKeyIndex(e);
          this.setValue(e, t), n > 1 && this.keys.splice(0, n);
        }),
        (f.prototype.clear = function (e) {
          let t = 0;
          e && (t = this.getValue(e)),
            (this.keys.length = 0),
            e && this.setValue(e, t),
            null !== this.onChange && this.onChange(),
            this.emitEvent("onChange", this);
        }),
        (f.prototype.sortKeys = function () {
          this.keys.sort((e, t) => parseFloat(e.time) - parseFloat(t.time)),
            (this._needsSort = !1);
        }),
        (f.prototype.getLength = function () {
          return 0 === this.keys.length
            ? 0
            : this.keys[this.keys.length - 1].time;
        }),
        (f.prototype.getKeyIndex = function (t) {
          let n = 0;
          for (let e = 0; e < this.keys.length; e++)
            if ((t >= this.keys[e].time && (n = e), this.keys[e].time > t))
              return n;
          return n;
        }),
        (f.prototype.setValue = function (t, n, i) {
          let s = null;
          for (const e in this.keys)
            if (this.keys[e].time == t) {
              (s = this.keys[e]),
                this.keys[e].setValue(n),
                (this.keys[e].cb = i);
              break;
            }
          return (
            s ||
              ((s = new m.Key({
                time: t,
                value: n,
                e: this.defaultEasing,
                cb: i,
              })),
              this.keys.push(s)),
            this.onChange && this.onChange(),
            this.emitEvent("onChange", this),
            (this._needsSort = !0),
            s
          );
        }),
        (f.prototype.setKeyEasing = function (e, t) {
          this.keys[e] &&
            (this.keys[e].setEasing(t), this.emitEvent("onChange", this));
        }),
        (f.prototype.getSerialized = function () {
          const t = { keys: [] };
          t.loop = this.loop;
          for (const e in this.keys) t.keys.push(this.keys[e].getSerialized());
          return t;
        }),
        (f.prototype.getKey = function (e) {
          const t = this.getKeyIndex(e);
          return this.keys[t];
        }),
        (f.prototype.getNextKey = function (e) {
          let t = this.getKeyIndex(e) + 1;
          return (
            t >= this.keys.length && (t = this.keys.length - 1), this.keys[t]
          );
        }),
        (f.prototype.isFinished = function (e) {
          return (
            this.keys.length <= 0 || e > this.keys[this.keys.length - 1].time
          );
        }),
        (f.prototype.isStarted = function (e) {
          return !(this.keys.length <= 0) && e >= this.keys[0].time;
        }),
        (f.prototype.getValue = function (e) {
          if (0 === this.keys.length) return 0;
          if ((this._needsSort && this.sortKeys(), e < this.keys[0].time))
            return this.keys[0].value;
          const t = this.keys.length - 1;
          if (this.loop && e > this.keys[t].time) {
            e / this.keys[t].time > this._timesLooped &&
              (this._timesLooped++, this.onLooped && this.onLooped()),
              (e =
                (e - this.keys[0].time) %
                (this.keys[t].time - this.keys[0].time)),
              (e += this.keys[0].time);
          }
          const n = this.getKeyIndex(e);
          if (n >= t)
            return (
              this.keys[t].cb &&
                !this.keys[t].cbTriggered &&
                this.keys[t].trigger(),
              this.keys[t].value
            );
          const i = parseInt(n, 10) + 1,
            s = this.keys[n],
            r = this.keys[i];
          if ((s.cb && !s.cbTriggered && s.trigger(), !r)) return -1;
          const a = (e - s.time) / (r.time - s.time);
          return s.ease || this.log._warn("has no ease", s, r), s.ease(a, r);
        }),
        (f.prototype.addKey = function (e) {
          void 0 === e.time
            ? this.log.warn("key time undefined, ignoring!")
            : (this.keys.push(e),
              null !== this.onChange && this.onChange(),
              this.emitEvent("onChange", this));
        }),
        (f.prototype.easingFromString = function (e) {
          return "linear" == e
            ? s.EASING_LINEAR
            : "absolute" == e
            ? s.EASING_ABSOLUTE
            : "smoothstep" == e
            ? s.EASING_SMOOTHSTEP
            : "smootherstep" == e
            ? s.EASING_SMOOTHERSTEP
            : "Cubic In" == e
            ? s.EASING_CUBIC_IN
            : "Cubic Out" == e
            ? s.EASING_CUBIC_OUT
            : "Cubic In Out" == e
            ? s.EASING_CUBIC_INOUT
            : "Expo In" == e
            ? s.EASING_EXPO_IN
            : "Expo Out" == e
            ? s.EASING_EXPO_OUT
            : "Expo In Out" == e
            ? s.EASING_EXPO_INOUT
            : "Sin In" == e
            ? s.EASING_SIN_IN
            : "Sin Out" == e
            ? s.EASING_SIN_OUT
            : "Sin In Out" == e
            ? s.EASING_SIN_INOUT
            : "Back In" == e
            ? s.EASING_BACK_IN
            : "Back Out" == e
            ? s.EASING_BACK_OUT
            : "Back In Out" == e
            ? s.EASING_BACK_INOUT
            : "Elastic In" == e
            ? s.EASING_ELASTIC_IN
            : "Elastic Out" == e
            ? s.EASING_ELASTIC_OUT
            : "Bounce In" == e
            ? s.EASING_BOUNCE_IN
            : "Bounce Out" == e
            ? s.EASING_BOUNCE_OUT
            : "Quart Out" == e
            ? s.EASING_QUART_OUT
            : "Quart In" == e
            ? s.EASING_QUART_IN
            : "Quart In Out" == e
            ? s.EASING_QUART_INOUT
            : "Quint Out" == e
            ? s.EASING_QUINT_OUT
            : "Quint In" == e
            ? s.EASING_QUINT_IN
            : "Quint In Out" == e
            ? s.EASING_QUINT_INOUT
            : void 0;
        }),
        (f.prototype.createPort = function (e, t, n) {
          const i = e.inDropDown(t, s.EASINGS);
          return (
            i.set("linear"),
            (i.defaultValue = "linear"),
            (i.onChange = function () {
              (this.defaultEasing = this.easingFromString(i.get())), n && n();
            }.bind(this)),
            i
          );
        }),
        (f.slerpQuaternion = function (n, i, s, r, a, o) {
          f.slerpQuaternion.q1 ||
            ((f.slerpQuaternion.q1 = quat.create()),
            (f.slerpQuaternion.q2 = quat.create()));
          const l = s.getKeyIndex(n);
          let u = l + 1;
          if ((u >= s.keys.length && (u = s.keys.length - 1), l == u))
            quat.set(
              i,
              s.keys[l].value,
              r.keys[l].value,
              a.keys[l].value,
              o.keys[l].value
            );
          else {
            const e = s.keys[l].time,
              t = (n - e) / (s.keys[u].time - e);
            quat.set(
              f.slerpQuaternion.q1,
              s.keys[l].value,
              r.keys[l].value,
              a.keys[l].value,
              o.keys[l].value
            ),
              quat.set(
                f.slerpQuaternion.q2,
                s.keys[u].value,
                r.keys[u].value,
                a.keys[u].value,
                o.keys[u].value
              ),
              quat.slerp(i, f.slerpQuaternion.q1, f.slerpQuaternion.q2, t);
          }
          return i;
        });
      m.Anim = f;
      const _ = function (e, t, n, i) {
        p.apply(this),
          (this.data = {}),
          (this._log = new g("core_port")),
          (this.direction = a.PORT_DIR_IN),
          (this.id = CABLES.simpleId()),
          (this.parent = e),
          (this.links = []),
          (this.value = 0),
          (this.name = t),
          (this.type = n || r.OP_PORT_TYPE_VALUE),
          (this.uiAttribs = i || {}),
          (this.anim = null),
          (this._oldAnimVal = -5711),
          (this.defaultValue = null),
          (this._uiActiveState = !0),
          (this.ignoreValueSerialize = !1),
          (this.onLinkChanged = null),
          (this.crashed = !1),
          (this._valueBeforeLink = null),
          (this._lastAnimFrame = -1),
          (this._animated = !1),
          (this.onValueChanged = null),
          (this.onTriggered = null),
          (this.onUiActiveStateChange = null),
          (this.changeAlways = !1),
          (this._warnedDeprecated = !1),
          (this._useVariableName = null),
          (this.activityCounter = 0),
          (this._tempLastUiValue = null),
          Object.defineProperty(this, "title", {
            get() {
              return this.uiAttribs.title || this.name;
            },
          }),
          Object.defineProperty(this, "val", {
            get() {
              return (
                this._log.warn("val getter deprecated!", this),
                this._log.stack("val getter deprecated"),
                (this._warnedDeprecated = !0),
                this.get()
              );
            },
            set(e) {
              this._log.warn("val setter deprecated!", this),
                this._log.stack("val setter deprecated"),
                this.setValue(e),
                (this._warnedDeprecated = !0);
            },
          });
      };
      (_.prototype.copyLinkedUiAttrib = function (e, t) {
        if (!CABLES.UI) return;
        if (!this.isLinked()) return;
        const n = {};
        (n[e] = this.links[0].getOtherPort(this).getUiAttrib(e)),
          t.setUiAttribs(n);
      }),
        (_.prototype.getValueForDisplay = function () {
          let e = String(this.value);
          return (
            this.uiAttribs &&
              "boolnum" == this.uiAttribs.display &&
              ((e += " - "), this.value ? (e += "true") : (e += "false")),
            (e = e.replace(/(<([^>]+)>)/gi, "")),
            e.length > 100 && (e = e.substring(0, 100)),
            e
          );
        }),
        (_.prototype.onAnimToggle = function () {}),
        (_.prototype._onAnimToggle = function () {
          this.onAnimToggle();
        }),
        (_.prototype.remove = function () {
          this.removeLinks(), this.parent.removePort(this);
        }),
        (_.prototype.setUiAttribs = function (t) {
          let n = !1;
          this.uiAttribs || (this.uiAttribs = {});
          for (const e in t)
            this.uiAttribs[e] != t[e] && (n = !0),
              (this.uiAttribs[e] = t[e]),
              "group" == e &&
                this.indexPort &&
                this.indexPort.setUiAttribs({ group: t[e] });
          n && this.emitEvent("onUiAttrChange", t, this);
        }),
        (_.prototype.getUiAttribs = function () {
          return this.uiAttribs;
        }),
        (_.prototype.getUiAttrib = function (e) {
          return this.uiAttribs && this.uiAttribs.hasOwnProperty(e)
            ? this.uiAttribs[e]
            : null;
        }),
        (_.prototype.get = function () {
          return (
            this._animated &&
              this._lastAnimFrame != this.parent.patch.getFrameNum() &&
              ((this._lastAnimFrame = this.parent.patch.getFrameNum()),
              (this.value = this.anim.getValue(
                this.parent.patch.timer.getTime()
              )),
              (this._oldAnimVal = this.value),
              this.forceChange()),
            this.value
          );
        }),
        (_.prototype.set = _.prototype.setValue =
          function (e) {
            if (
              void 0 !== e &&
              this.parent.enabled &&
              !this.crashed &&
              (e !== this.value ||
                this.changeAlways ||
                this.type == r.OP_PORT_TYPE_TEXTURE ||
                this.type == r.OP_PORT_TYPE_ARRAY)
            ) {
              if (this._animated)
                this.anim.setValue(this.parent.patch.timer.getTime(), e);
              else {
                try {
                  (this.value = e), this.forceChange();
                } catch (e) {
                  (this.crashed = !0),
                    (this.setValue = function (e) {}),
                    (this.onTriggered = function () {}),
                    this._log.error("onvaluechanged exception cought", e),
                    this._log.error(e.stack),
                    this._log.warn("exception in: " + this.parent.name),
                    this.parent.patch.isEditorMode() &&
                      gui.showOpCrash(this.parent),
                    this.parent.patch.emitEvent("exception", e, this.parent),
                    this.parent.onError && this.parent.onError(e);
                }
                this.parent &&
                  this.parent.patch &&
                  this.parent.patch.isEditorMode() &&
                  this.type == r.OP_PORT_TYPE_TEXTURE &&
                  gui.texturePreview().updateTexturePort(this);
              }
              if (this.direction == a.PORT_DIR_OUT)
                for (let e = 0; e < this.links.length; ++e)
                  this.links[e].setValue();
            }
          }),
        (_.prototype.updateAnim = function () {
          this._animated &&
            ((this.value = this.get()),
            (this._oldAnimVal != this.value || this.changeAlways) &&
              ((this._oldAnimVal = this.value), this.forceChange()),
            (this._oldAnimVal = this.value));
        }),
        (_.args = function (e) {
          return (e + "")
            .replace(/[/][/].*$/gm, "")
            .replace(/\s+/g, "")
            .replace(/[/][*][^/*]*[*][/]/g, "")
            .split("){", 1)[0]
            .replace(/^[^(]*[(]/, "")
            .replace(/=[^,]+/g, "")
            .split(",")
            .filter(Boolean);
        }),
        (_.prototype.forceChange = function () {
          this.onValueChanged || this.onChange,
            this._activity(),
            this.emitEvent("change", this.value, this),
            this.onChange
              ? this.onChange(this, this.value)
              : this.onValueChanged && this.onValueChanged(this, this.value);
        }),
        (_.prototype.getTypeString = function () {
          return this.type == r.OP_PORT_TYPE_VALUE
            ? "Number"
            : this.type == r.OP_PORT_TYPE_FUNCTION
            ? "Trigger"
            : this.type == r.OP_PORT_TYPE_OBJECT
            ? "Object"
            : this.type == r.OP_PORT_TYPE_DYNAMIC
            ? "Dynamic"
            : this.type == r.OP_PORT_TYPE_ARRAY
            ? "Array"
            : this.type == r.OP_PORT_TYPE_STRING
            ? "String"
            : "Unknown";
        }),
        (_.prototype.deSerializeSettings = function (t) {
          if (
            t &&
            (t.animated && this.setAnimated(t.animated),
            t.useVariable && this.setVariableName(t.useVariable),
            t.anim)
          ) {
            this.anim || (this.anim = new f()),
              this.anim.addEventListener("onChange", () => {
                this.parent.patch.emitEvent(
                  "portAnimUpdated",
                  this.parent,
                  this,
                  this.anim
                );
              }),
              t.anim.loop && (this.anim.loop = t.anim.loop);
            for (const e in t.anim.keys)
              this.anim.keys.push(new m.Key(t.anim.keys[e]));
          }
        }),
        (_.prototype.getSerialized = function () {
          const t = {};
          if (
            ((t.name = this.getName()),
            this.ignoreValueSerialize ||
              0 !== this.links.length ||
              (this.type == r.OP_PORT_TYPE_OBJECT &&
                this.value &&
                this.value.tex) ||
              (t.value = this.value),
            this._useVariableName && (t.useVariable = this._useVariableName),
            this._animated && (t.animated = !0),
            this.anim && (t.anim = this.anim.getSerialized()),
            "file" == this.uiAttribs.display &&
              (t.display = this.uiAttribs.display),
            this.direction == a.PORT_DIR_OUT && this.links.length > 0)
          ) {
            t.links = [];
            for (const e in this.links)
              !this.links[e].ignoreInSerialize &&
                this.links[e].portIn &&
                this.links[e].portOut &&
                t.links.push(this.links[e].getSerialized());
          }
          return t;
        }),
        (_.prototype.shouldLink = function () {
          return !0;
        }),
        (_.prototype.removeLinks = function () {
          let e = 0;
          for (; this.links.length > 0; ) {
            if ((e++, e > 5e3)) {
              this._log.warn("could not delete links... / infinite loop"),
                (this.links.length = 0);
              break;
            }
            this.links[0].remove();
          }
        }),
        (_.prototype.removeLink = function (t) {
          for (const e in this.links)
            this.links[e] == t && this.links.splice(e, 1);
          this.direction == a.PORT_DIR_IN &&
            (this.type == r.OP_PORT_TYPE_VALUE
              ? this.setValue(this._valueBeforeLink || 0)
              : this.setValue(this._valueBeforeLink || null)),
            CABLES.UI &&
              this.parent.checkLinkTimeWarnings &&
              this.parent.checkLinkTimeWarnings(),
            this.onLinkChanged && this.onLinkChanged(),
            this.emitEvent("onLinkChanged"),
            this.parent.emitEvent("onLinkChanged");
        }),
        (_.prototype.getName = function () {
          return this.name;
        }),
        (_.prototype.addLink = function (e) {
          (this._valueBeforeLink = this.value),
            this.links.push(e),
            CABLES.UI &&
              this.parent.checkLinkTimeWarnings &&
              this.parent.checkLinkTimeWarnings(),
            this.onLinkChanged && this.onLinkChanged(),
            this.emitEvent("onLinkChanged"),
            this.parent.emitEvent("onLinkChanged");
        }),
        (_.prototype.getLinkTo = function (t) {
          for (const e in this.links)
            if (this.links[e].portIn == t || this.links[e].portOut == t)
              return this.links[e];
        }),
        (_.prototype.removeLinkTo = function (t) {
          for (const e in this.links)
            if (this.links[e].portIn == t || this.links[e].portOut == t)
              return (
                this.links[e].remove(),
                CABLES.UI &&
                  this.parent.checkLinkTimeWarnings &&
                  this.parent.checkLinkTimeWarnings(),
                this.onLinkChanged && this.onLinkChanged(),
                void this.emitEvent("onLinkChanged")
              );
        }),
        (_.prototype.isLinkedTo = function (t) {
          for (const e in this.links)
            if (this.links[e].portIn == t || this.links[e].portOut == t)
              return !0;
          return !1;
        }),
        (_.prototype._activity = function () {
          this.activityCounter++;
        }),
        (_.prototype.trigger = function () {
          if ((this._activity(), 0 === this.links.length)) return;
          if (!this.parent.enabled) return;
          let t = null;
          try {
            for (let e = 0; e < this.links.length; ++e)
              this.links[e].portIn &&
                ((t = this.links[e].portIn),
                t.parent.patch.pushTriggerStack(t),
                t._onTriggered(),
                t.parent.patch.popTriggerStack()),
                this.links[e] && this.links[e].activity();
          } catch (e) {
            (this.parent.enabled = !1),
              this.parent.patch.isEditorMode() &&
                (this.parent.patch.emitEvent("exception", e, t.parent),
                this.parent.patch.emitEvent("opcrash", t),
                t.parent.onError && t.parent.onError(e)),
              this._log.warn("exception!"),
              this._log.error("ontriggered exception cought", e),
              this._log.error(e.stack),
              this._log.warn("exception in: " + t.parent.name);
          }
        }),
        (_.prototype.call = function () {
          this._log.warn("call deprecated - use trigger() "), this.trigger();
        }),
        (_.prototype.execute = function () {
          this._log.warn(
            "### execute port: " + this.getName(),
            this.goals.length
          );
        }),
        (_.prototype.setVariableName = function (e) {
          this._useVariableName = e;
        }),
        (_.prototype.getVariableName = function () {
          return this._useVariableName;
        }),
        (_.prototype.setVariable = function (e) {
          this.setAnimated(!1);
          const t = { useVariable: !1 };
          this._variableIn &&
            this._varChangeListenerId &&
            (this._variableIn.off(this._varChangeListenerId),
            (this._variableIn = null)),
            e
              ? ((this._variableIn = this.parent.patch.getVar(e)),
                this._variableIn
                  ? (this.type == r.OP_PORT_TYPE_OBJECT
                      ? (this._varChangeListenerId = this._variableIn.on(
                          "change",
                          () => {
                            this.set(null),
                              this.set(this._variableIn.getValue());
                          }
                        ))
                      : (this._varChangeListenerId = this._variableIn.on(
                          "change",
                          this.set.bind(this)
                        )),
                    this.set(this._variableIn.getValue()))
                  : this._log.warn("PORT VAR NOT FOUND!!!", e),
                (this._useVariableName = e),
                (t.useVariable = !0),
                (t.variableName = this._useVariableName))
              : ((t.variableName = this._useVariableName = null),
                (t.useVariable = !1)),
            this.setUiAttribs(t),
            this.parent.patch.emitEvent(
              "portSetVariable",
              this.parent,
              this,
              e
            );
        }),
        (_.prototype._handleNoTriggerOpAnimUpdates = function (e) {
          let t = !1;
          for (let e = 0; e < this.parent.portsIn.length; e++)
            if (this.parent.portsIn.type == r.OP_PORT_TYPE_FUNCTION) {
              t = !0;
              break;
            }
          t ||
            (e
              ? (this._notriggerAnimUpdate = this.parent.patch.on(
                  "onRenderFrame",
                  () => {
                    this.updateAnim();
                  }
                ))
              : this.parent.patch.removeEventListener(
                  this._notriggerAnimUpdate
                ));
        }),
        (_.prototype.setAnimated = function (e) {
          this._animated != e &&
            ((this._animated = e),
            this._animated &&
              !this.anim &&
              ((this.anim = new f()),
              this.anim.addEventListener("onChange", () => {
                this.parent.patch.emitEvent(
                  "portAnimUpdated",
                  this.parent,
                  this,
                  this.anim
                );
              })),
            this._onAnimToggle()),
            this._handleNoTriggerOpAnimUpdates(e),
            this.setUiAttribs({ isAnimated: this._animated });
        }),
        (_.prototype.toggleAnim = function () {
          (this._animated = !this._animated),
            this._animated &&
              !this.anim &&
              ((this.anim = new f()),
              this.anim.addEventListener("onChange", () => {
                this.parent.patch.emitEvent(
                  "portAnimUpdated",
                  this.parent,
                  this,
                  this.anim
                );
              })),
            this.setAnimated(this._animated),
            this._onAnimToggle(),
            this.setUiAttribs({ isAnimated: this._animated });
        }),
        (_.prototype.getType = function () {
          return this.type;
        }),
        (_.prototype.isLinked = function () {
          return (
            this.links.length > 0 ||
            this._animated ||
            null != this._useVariableName
          );
        }),
        (_.prototype.isBoundToVar = function () {
          return null != this._useVariableName;
        }),
        (_.prototype.isAnimated = function () {
          return this._animated;
        }),
        (_.prototype.isHidden = function () {
          return this.uiAttribs.hidePort;
        }),
        (_.prototype._onTriggered = function (e) {
          this._activity(),
            this.parent.updateAnims(),
            this.parent.enabled && this.onTriggered && this.onTriggered(e);
        }),
        (_.prototype._onSetProfiling = function (e) {
          this.parent.patch.profiler.add("port", this),
            this.setValue(e),
            this.parent.patch.profiler.add("port", null);
        }),
        (_.prototype._onTriggeredProfiling = function () {
          this.parent.enabled &&
            this.onTriggered &&
            (this.parent.patch.profiler.add("port", this),
            this.onTriggered(),
            this.parent.patch.profiler.add("port", null));
        }),
        (_.prototype.onValueChange = function (e) {
          this.onChange = e;
        }),
        (_.prototype.getUiActiveState = function () {
          return this._uiActiveState;
        }),
        (_.prototype.setUiActiveState = function (e) {
          (this._uiActiveState = e),
            this.onUiActiveStateChange && this.onUiActiveStateChange();
        }),
        (_.prototype.hidePort = function () {
          this._log.warn("op.hideport() is deprecated, do not use it!");
        }),
        (_.portTypeNumberToString = function (e) {
          return e == r.OP_PORT_TYPE_VALUE
            ? "value"
            : e == r.OP_PORT_TYPE_FUNCTION
            ? "function"
            : e == r.OP_PORT_TYPE_OBJECT
            ? "object"
            : e == r.OP_PORT_TYPE_ARRAY
            ? "array"
            : e == r.OP_PORT_TYPE_STRING
            ? "string"
            : e == r.OP_PORT_TYPE_DYNAMIC
            ? "dynamic"
            : "unknown";
        });
      var v = class {
        constructor(e, t, n, i, s, r, a, o, l, u) {
          if (
            ((this._log = new g("cg_uniform")),
            (this._type = t),
            (this._name = n),
            (this._shader = e),
            (this._value = 1e-5),
            (this._oldValue = null),
            (this._port = null),
            (this._structName = l),
            (this._structUniformName = o),
            (this._propertyName = u),
            this._shader._addUniform(this),
            (this.needsUpdate = !0),
            (this.shaderType = null),
            (this.comment = null),
            "f" == t)
          )
            (this.set = this.setValue = this.setValueF.bind(this)),
              (this.updateValue = this.updateValueF.bind(this));
          else if ("f[]" == t)
            (this.set = this.setValue = this.setValueArrayF.bind(this)),
              (this.updateValue = this.updateValueArrayF.bind(this));
          else if ("2f[]" == t)
            (this.set = this.setValue = this.setValueArray2F.bind(this)),
              (this.updateValue = this.updateValueArray2F.bind(this));
          else if ("3f[]" == t)
            (this.set = this.setValue = this.setValueArray3F.bind(this)),
              (this.updateValue = this.updateValueArray3F.bind(this));
          else if ("4f[]" == t)
            (this.set = this.setValue = this.setValueArray4F.bind(this)),
              (this.updateValue = this.updateValueArray4F.bind(this));
          else if ("i" == t)
            (this.set = this.setValue = this.setValueI.bind(this)),
              (this.updateValue = this.updateValueI.bind(this));
          else if ("2i" == t)
            (this.set = this.setValue = this.setValue2I.bind(this)),
              (this.updateValue = this.updateValue2I.bind(this));
          else if ("3i" == t)
            (this.set = this.setValue = this.setValue3I.bind(this)),
              (this.updateValue = this.updateValue3I.bind(this));
          else if ("4i" == t)
            (this.set = this.setValue = this.setValue4I.bind(this)),
              (this.updateValue = this.updateValue4I.bind(this));
          else if ("b" == t)
            (this.set = this.setValue = this.setValueBool.bind(this)),
              (this.updateValue = this.updateValueBool.bind(this));
          else if ("4f" == t)
            (this.set = this.setValue = this.setValue4F.bind(this)),
              (this.updateValue = this.updateValue4F.bind(this));
          else if ("3f" == t)
            (this.set = this.setValue = this.setValue3F.bind(this)),
              (this.updateValue = this.updateValue3F.bind(this));
          else if ("2f" == t)
            (this.set = this.setValue = this.setValue2F.bind(this)),
              (this.updateValue = this.updateValue2F.bind(this));
          else if ("t" == t)
            (this.set = this.setValue = this.setValueT.bind(this)),
              (this.updateValue = this.updateValueT.bind(this));
          else if ("tc" == t)
            (this.set = this.setValue = this.setValueT.bind(this)),
              (this.updateValue = this.updateValueT.bind(this));
          else if ("t[]" == t)
            (this.set = this.setValue = this.setValueArrayT.bind(this)),
              (this.updateValue = this.updateValueArrayT.bind(this));
          else {
            if ("m4" != t && "m4[]" != t)
              throw new Error("Unknown uniform type");
            (this.set = this.setValue = this.setValueM4.bind(this)),
              (this.updateValue = this.updateValueM4.bind(this));
          }
          "object" == typeof i && i instanceof _
            ? ((this._port = i),
              (this._value = this._port.get()),
              s && r && a
                ? ((s instanceof _ && r instanceof _ && a instanceof _) ||
                    this._log.error(
                      "[cgl_uniform] mixed port/value parameter for vec4 ",
                      this._name
                    ),
                  (this._value = [0, 0, 0, 0]),
                  (this._port2 = s),
                  (this._port3 = r),
                  (this._port4 = a),
                  this._port.on("change", this.updateFromPort4f.bind(this)),
                  this._port2.on("change", this.updateFromPort4f.bind(this)),
                  this._port3.on("change", this.updateFromPort4f.bind(this)),
                  this._port4.on("change", this.updateFromPort4f.bind(this)),
                  this.updateFromPort4f())
                : s && r
                ? ((s instanceof _ && r instanceof _) ||
                    this._log.error(
                      "[cgl_uniform] mixed port/value parameter for vec4 ",
                      this._name
                    ),
                  (this._value = [0, 0, 0]),
                  (this._port2 = s),
                  (this._port3 = r),
                  this._port.on("change", this.updateFromPort3f.bind(this)),
                  this._port2.on("change", this.updateFromPort3f.bind(this)),
                  this._port3.on("change", this.updateFromPort3f.bind(this)),
                  this.updateFromPort3f())
                : s
                ? (s instanceof _ ||
                    this._log.error(
                      "[cgl_uniform] mixed port/value parameter for vec4 ",
                      this._name
                    ),
                  (this._value = [0, 0]),
                  (this._port2 = s),
                  this._port.on("change", this.updateFromPort2f.bind(this)),
                  this._port2.on("change", this.updateFromPort2f.bind(this)),
                  this.updateFromPort2f())
                : this._port.on("change", this.updateFromPort.bind(this)))
            : (this._value = i),
            this.setValue(this._value),
            (this.needsUpdate = !0);
        }
        getType() {
          return this._type;
        }
        getName() {
          return this._name;
        }
        getValue() {
          return this._value;
        }
        getShaderType() {
          return this.shaderType;
        }
        isStructMember() {
          return !!this._structName;
        }
        updateFromPort4f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            (this._value[2] = this._port3.get()),
            (this._value[3] = this._port4.get()),
            this.setValue(this._value);
        }
        updateFromPort3f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            (this._value[2] = this._port3.get()),
            this.setValue(this._value);
        }
        updateFromPort2f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            this.setValue(this._value);
        }
        updateFromPort() {
          this.setValue(this._port.get());
        }
      };
      class b extends v {
        constructor(e, t, n, i, s, r, a, o, l, u) {
          super(e, t, n, i, s, r, a, o, l, u),
            (this._loc = -1),
            (this._cgl = e._cgl);
        }
        copy(e) {
          const t = new b(
            e,
            this._type,
            this._name,
            this._value,
            this._port2,
            this._port3,
            this._port4,
            this._structUniformName,
            this._structName,
            this._propertyName
          );
          return (t.shaderType = this.shaderType), t;
        }
        getGlslTypeString() {
          return b.glslTypeString(this._type);
        }
        _isValidLoc() {
          return -1 != this._loc;
        }
        resetLoc() {
          (this._loc = -1), (this.needsUpdate = !0);
        }
        bindTextures() {}
        getLoc() {
          return this._loc;
        }
        updateFromPort4f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            (this._value[2] = this._port3.get()),
            (this._value[3] = this._port4.get()),
            this.setValue(this._value);
        }
        updateFromPort3f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            (this._value[2] = this._port3.get()),
            this.setValue(this._value);
        }
        updateFromPort2f() {
          (this._value[0] = this._port.get()),
            (this._value[1] = this._port2.get()),
            this.setValue(this._value);
        }
        updateFromPort() {
          this.setValue(this._port.get());
        }
        updateValueF() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._shader.getCgl().gl.uniform1f(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++;
        }
        setValueF(e) {
          e != this._value && ((this.needsUpdate = !0), (this._value = e));
        }
        updateValueI() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._shader.getCgl().gl.uniform1i(this._loc, this._value),
            this._cgl.profileData.profileUniformCount++;
        }
        updateValue2I() {
          this._value &&
            (this._isValidLoc() ||
              ((this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
              this._cgl.profileData.profileShaderGetUniform++,
              (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._shader
              .getCgl()
              .gl.uniform2i(this._loc, this._value[0], this._value[1]),
            (this.needsUpdate = !1),
            this._cgl.profileData.profileUniformCount++);
        }
        updateValue3I() {
          this._value &&
            (this._isValidLoc() ||
              ((this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
              this._cgl.profileData.profileShaderGetUniform++,
              (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._shader
              .getCgl()
              .gl.uniform3i(
                this._loc,
                this._value[0],
                this._value[1],
                this._value[2]
              ),
            (this.needsUpdate = !1),
            this._cgl.profileData.profileUniformCount++);
        }
        updateValue4I() {
          this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._shader
              .getCgl()
              .gl.uniform4i(
                this._loc,
                this._value[0],
                this._value[1],
                this._value[2],
                this._value[3]
              ),
            this._cgl.profileData.profileUniformCount++;
        }
        setValueI(e) {
          e != this._value && ((this.needsUpdate = !0), (this._value = e));
        }
        setValue2I(e) {
          e &&
            (this._oldValue
              ? (e[0] == this._oldValue[0] && e[1] == this._oldValue[1]) ||
                ((this._oldValue[0] = e[0]),
                (this._oldValue[1] = e[1]),
                (this.needsUpdate = !0))
              : ((this._oldValue = [e[0] - 1, 1]), (this.needsUpdate = !0)),
            (this._value = e));
        }
        setValue3I(e) {
          e &&
            (this._oldValue
              ? (e[0] == this._oldValue[0] &&
                  e[1] == this._oldValue[1] &&
                  e[2] == this._oldValue[2]) ||
                ((this._oldValue[0] = e[0]),
                (this._oldValue[1] = e[1]),
                (this._oldValue[2] = e[2]),
                (this.needsUpdate = !0))
              : ((this._oldValue = [e[0] - 1, 1, 2]), (this.needsUpdate = !0)),
            (this._value = e));
        }
        setValue4I(e) {
          (this.needsUpdate = !0), (this._value = e || vec4.create());
        }
        updateValueBool() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._shader.getCgl().gl.uniform1i(this._loc, this._value ? 1 : 0),
            this._cgl.profileData.profileUniformCount++;
        }
        setValueBool(e) {
          e != this._value && ((this.needsUpdate = !0), (this._value = e));
        }
        setValueArray4F(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
        updateValueArray4F() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._value &&
              (this._shader.getCgl().gl.uniform4fv(this._loc, this._value),
              this._cgl.profileData.profileUniformCount++);
        }
        setValueArray3F(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
        updateValueArray3F() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._value &&
              (this._shader.getCgl().gl.uniform3fv(this._loc, this._value),
              this._cgl.profileData.profileUniformCount++);
        }
        setValueArray2F(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
        updateValueArray2F() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._value &&
              (this._shader.getCgl().gl.uniform2fv(this._loc, this._value),
              this._cgl.profileData.profileUniformCount++);
        }
        setValueArrayF(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
        updateValueArrayF() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._value &&
              (this._shader.getCgl().gl.uniform1fv(this._loc, this._value),
              this._cgl.profileData.profileUniformCount++);
        }
        setValueArrayT(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
        updateValue3F() {
          this._value &&
            (this._isValidLoc() ||
              ((this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
              this._cgl.profileData.profileShaderGetUniform++,
              (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._shader
              .getCgl()
              .gl.uniform3f(
                this._loc,
                this._value[0],
                this._value[1],
                this._value[2]
              ),
            (this.needsUpdate = !1),
            this._cgl.profileData.profileUniformCount++);
        }
        setValue3F(e) {
          e &&
            (this._oldValue
              ? (e[0] == this._oldValue[0] &&
                  e[1] == this._oldValue[1] &&
                  e[2] == this._oldValue[2]) ||
                ((this._oldValue[0] = e[0]),
                (this._oldValue[1] = e[1]),
                (this._oldValue[2] = e[2]),
                (this.needsUpdate = !0))
              : ((this._oldValue = [e[0] - 1, 1, 2]), (this.needsUpdate = !0)),
            (this._value = e));
        }
        updateValue2F() {
          this._value &&
            (this._isValidLoc() ||
              ((this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
              this._cgl.profileData.profileShaderGetUniform++,
              (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._shader
              .getCgl()
              .gl.uniform2f(this._loc, this._value[0], this._value[1]),
            (this.needsUpdate = !1),
            this._cgl.profileData.profileUniformCount++);
        }
        setValue2F(e) {
          e &&
            (this._oldValue
              ? (e[0] == this._oldValue[0] && e[1] == this._oldValue[1]) ||
                ((this._oldValue[0] = e[0]),
                (this._oldValue[1] = e[1]),
                (this.needsUpdate = !0))
              : ((this._oldValue = [e[0] - 1, 1]), (this.needsUpdate = !0)),
            (this._value = e));
        }
        updateValue4F() {
          this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._value ||
              (this._log.warn("no value for uniform", this._name, this),
              (this._value = [0, 0, 0, 0])),
            (this.needsUpdate = !1),
            this._shader
              .getCgl()
              .gl.uniform4f(
                this._loc,
                this._value[0],
                this._value[1],
                this._value[2],
                this._value[3]
              ),
            this._cgl.profileData.profileUniformCount++;
        }
        setValue4F(e) {
          "number" == typeof this.value && (this.value = vec4.create()),
            e &&
              (this._oldValue
                ? (e[0] == this._oldValue[0] &&
                    e[1] == this._oldValue[1] &&
                    e[2] == this._oldValue[2] &&
                    e[3] == this._oldValue[3]) ||
                  ((this._oldValue[0] = e[0]),
                  (this._oldValue[1] = e[1]),
                  (this._oldValue[2] = e[2]),
                  (this.needsUpdate = !0))
                : ((this._oldValue = [e[0] - 1, 1, 2, 3]),
                  (this.needsUpdate = !0)),
              (this._value = e));
        }
        updateValueM4() {
          if (
            (this._isValidLoc() ||
              ((this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
              this._cgl.profileData.profileShaderGetUniform++,
              (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            !this._value || this._value.length % 16 != 0)
          )
            return console.log("this.name", this._name, this._value);
          this._shader.getCgl().gl.uniformMatrix4fv(this._loc, !1, this._value),
            this._cgl.profileData.profileUniformCount++;
        }
        setValueM4(e) {
          (this.needsUpdate = !0), (this._value = e || mat4.create());
        }
        updateValueArrayT() {
          this._isValidLoc()
            ? (this.needsUpdate = !1)
            : (this._loc = this._shader
                .getCgl()
                .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._value &&
              (this._shader.getCgl().gl.uniform1iv(this._loc, this._value),
              this._cgl.profileData.profileUniformCount++);
        }
        updateValueT() {
          this._isValidLoc() ||
            ((this._loc = this._shader
              .getCgl()
              .gl.getUniformLocation(this._shader.getProgram(), this._name)),
            this._cgl.profileData.profileShaderGetUniform++,
            (this._cgl.profileData.profileShaderGetUniformName = this._name)),
            this._cgl.profileData.profileUniformCount++,
            this._shader.getCgl().gl.uniform1i(this._loc, this._value),
            (this.needsUpdate = !1);
        }
        setValueT(e) {
          (this.needsUpdate = !0), (this._value = e);
        }
      }
      b.glslTypeString = (e) =>
        "f" == e
          ? "float"
          : "b" == e
          ? "bool"
          : "i" == e
          ? "int"
          : "2i" == e
          ? "ivec2"
          : "2f" == e
          ? "vec2"
          : "3f" == e
          ? "vec3"
          : "4f" == e
          ? "vec4"
          : "m4" == e
          ? "mat4"
          : "t" == e
          ? "sampler2D"
          : "tc" == e
          ? "samplerCube"
          : "3f[]" == e || "m4[]" == e || "f[]" == e
          ? null
          : void (void 0)._log.warn(
              "[CGL UNIFORM] unknown glsl type string ",
              e
            );
      const x = 180 / Math.PI,
        I =
          (Math.PI,
          {
            SHADERVAR_VERTEX_POSITION: "vPosition",
            SHADERVAR_VERTEX_NUMBER: "attrVertIndex",
            SHADERVAR_VERTEX_NORMAL: "attrVertNormal",
            SHADERVAR_VERTEX_TEXCOORD: "attrTexCoord",
            SHADERVAR_INSTANCE_MMATRIX: "instMat",
            SHADERVAR_VERTEX_COLOR: "attrVertColor",
            SHADERVAR_UNI_PROJMAT: "projMatrix",
            SHADERVAR_UNI_VIEWMAT: "viewMatrix",
            SHADERVAR_UNI_MODELMAT: "modelMatrix",
            SHADERVAR_UNI_NORMALMAT: "normalMatrix",
            SHADERVAR_UNI_INVVIEWMAT: "inverseViewMatrix",
            SHADERVAR_UNI_INVPROJMAT: "invProjMatrix",
            SHADERVAR_UNI_VIEWPOS: "camPos",
          });
      const A = { lastMesh: null },
        E = function (e, t, n) {
          (this._cgl = e),
            (this._log = new g("cgl_mesh")),
            (this._bufVertexAttrib = null),
            (this._bufVerticesIndizes = this._cgl.gl.createBuffer()),
            (this._indexType = this._cgl.gl.UNSIGNED_SHORT),
            (this._attributes = []),
            (this._attribLocs = {}),
            (this._geom = null),
            (this._lastShader = null),
            (this._numInstances = 0),
            (this._glPrimitive = n),
            (this._preWireframeGeom = null),
            (this.addVertexNumbers = !1),
            (this.feedBackAttributes = []),
            this.setGeom(t),
            (this._feedBacks = []),
            (this._feedBacksChanged = !1),
            (this._transformFeedBackLoc = -1),
            (this._lastAttrUpdate = 0),
            (this._name = "unknown"),
            this._cgl.profileData.addHeavyEvent("mesh constructed", this._name),
            (this._queryExt = null),
            Object.defineProperty(this, "numInstances", {
              get() {
                return this._numInstances;
              },
              set(e) {
                this.setNumInstances(e);
              },
            });
        };
      (E.prototype.updateVertices = function (e) {
        this.setAttribute(I.SHADERVAR_VERTEX_POSITION, e.vertices, 3),
          (this._numVerts = e.vertices.length / 3);
      }),
        (E.prototype.setAttributePointer = function (t, n, i, s) {
          for (let e = 0; e < this._attributes.length; e++)
            this._attributes[e].name == t &&
              (this._attributes[e].pointer ||
                (this._attributes[e].pointer = []),
              this._attributes[e].pointer.push({
                loc: -1,
                name: n,
                stride: i,
                offset: s,
                instanced: t == I.SHADERVAR_INSTANCE_MMATRIX,
              }));
        }),
        (E.prototype.getAttribute = function (t) {
          for (let e = 0; e < this._attributes.length; e++)
            if (this._attributes[e].name == t) return this._attributes[e];
        }),
        (E.prototype.setAttributeRange = function (e, t, n, i) {
          e &&
            (n || i) &&
            (e.name || (console.log(e), this._log.stack("no attrname?!")),
            this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, e.buffer),
            (this._cgl.profileData.profileMeshAttributes += i - n || 0),
            (this._cgl.profileData.profileSingleMeshAttribute[this._name] =
              this._cgl.profileData.profileSingleMeshAttribute[this._name] ||
              0),
            (this._cgl.profileData.profileSingleMeshAttribute[this._name] +=
              i - n || 0),
            e.numItems < t.length / e.itemSize && this._resizeAttr(t, e),
            i >= t.length - 1 &&
              this._log.log(
                this._cgl.canvas.id +
                  " " +
                  e.name +
                  " buffersubdata out of bounds ?",
                t.length,
                i,
                n,
                e
              ),
            1 == this._cgl.glVersion
              ? this._cgl.gl.bufferSubData(this._cgl.gl.ARRAY_BUFFER, 0, t)
              : this._cgl.gl.bufferSubData(
                  this._cgl.gl.ARRAY_BUFFER,
                  4 * n,
                  t,
                  n,
                  i - n
                ));
        }),
        (E.prototype._resizeAttr = function (e, t) {
          t.buffer && this._cgl.gl.deleteBuffer(t.buffer),
            (t.buffer = this._cgl.gl.createBuffer()),
            this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, t.buffer),
            this._bufferArray(e, t),
            (t.numItems = e.length / t.itemSize);
        }),
        (E.prototype._bufferArray = function (e, t) {
          let n = null;
          e &&
            (this._cgl.debugOneFrame &&
              console.log("_bufferArray", e.length, t.name),
            e instanceof Float32Array
              ? (n = e)
              : t && n && n.length == e.length
              ? n.set(e)
              : ((n = new Float32Array(e)),
                this._cgl.debugOneFrame &&
                  console.log(
                    "_bufferArray create new float32array",
                    e.length,
                    t.name
                  ),
                this._cgl.profileData.profileNonTypedAttrib++,
                (this._cgl.profileData.profileNonTypedAttribNames =
                  "(" + this._name + ":" + t.name + ")")),
            (t.arrayLength = n.length),
            this._cgl.gl.bufferData(
              this._cgl.gl.ARRAY_BUFFER,
              n,
              this._cgl.gl.DYNAMIC_DRAW
            ));
        }),
        (E.prototype.addAttribute =
          E.prototype.updateAttribute =
          E.prototype.setAttribute =
            function (e, t, n, i) {
              if (!t)
                throw (
                  (this._log.error("mesh addAttribute - no array given! " + e),
                  new Error())
                );
              let s = null,
                r = !1,
                a = 0;
              const o = t.length / n;
              for (
                this._cgl.profileData.profileMeshAttributes += o || 0,
                  "function" == typeof i && (s = i),
                  "object" == typeof i &&
                    (i.cb && (s = i.cb), i.instanced && (r = i.instanced)),
                  e == I.SHADERVAR_INSTANCE_MMATRIX && (r = !0),
                  a = 0;
                a < this._attributes.length;
                a++
              ) {
                const n = this._attributes[a];
                if (n.name == e)
                  return (
                    n.numItems === o || this._resizeAttr(t, n),
                    this._cgl.gl.bindBuffer(
                      this._cgl.gl.ARRAY_BUFFER,
                      n.buffer
                    ),
                    this._bufferArray(t, n),
                    n
                  );
              }
              const l = this._cgl.gl.createBuffer();
              this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, l);
              let u = this._cgl.gl.FLOAT;
              i && i.type && (u = i.type);
              const c = {
                buffer: l,
                name: e,
                cb: s,
                itemSize: n,
                numItems: o,
                startItem: 0,
                instanced: r,
                type: u,
              };
              return (
                this._bufferArray(t, c),
                e == I.SHADERVAR_VERTEX_POSITION && (this._bufVertexAttrib = c),
                this._attributes.push(c),
                (this._attribLocs = {}),
                c
              );
            }),
        (E.prototype.getAttributes = function () {
          return this._attributes;
        }),
        (E.prototype.updateTexCoords = function (t) {
          if (t.texCoords && t.texCoords.length > 0)
            this.setAttribute(I.SHADERVAR_VERTEX_TEXCOORD, t.texCoords, 2);
          else {
            const e = new Float32Array(Math.round((t.vertices.length / 3) * 2));
            this.setAttribute(I.SHADERVAR_VERTEX_TEXCOORD, e, 2);
          }
        }),
        (E.prototype.updateNormals = function (t) {
          if (t.vertexNormals && t.vertexNormals.length > 0)
            this.setAttribute(I.SHADERVAR_VERTEX_NORMAL, t.vertexNormals, 3);
          else {
            const e = new Float32Array(Math.round(t.vertices.length));
            this.setAttribute(I.SHADERVAR_VERTEX_NORMAL, e, 3);
          }
        }),
        (E.prototype._setVertexNumbers = function (e) {
          if (
            !this._verticesNumbers ||
            this._verticesNumbers.length != this._numVerts ||
            e
          ) {
            if (e) this._verticesNumbers = e;
            else {
              this._verticesNumbers = new Float32Array(this._numVerts);
              for (let e = 0; e < this._numVerts; e++)
                this._verticesNumbers[e] = e;
            }
            this.setAttribute(
              I.SHADERVAR_VERTEX_NUMBER,
              this._verticesNumbers,
              1,
              (e, t, n) => {
                n.uniformNumVertices ||
                  (n.uniformNumVertices = new b(
                    n,
                    "f",
                    "numVertices",
                    this._numVerts
                  )),
                  n.uniformNumVertices.setValue(this._numVerts);
              }
            );
          }
        }),
        (E.prototype.setVertexIndices = function (t) {
          if (this._bufVerticesIndizes)
            if (t.length > 0) {
              for (let e = 0; e < t.length; e++)
                if (t[e] >= this._numVerts)
                  return void this._log.warn("invalid index in " + this._name);
              this._cgl.gl.bindBuffer(
                this._cgl.gl.ELEMENT_ARRAY_BUFFER,
                this._bufVerticesIndizes
              ),
                t instanceof Float32Array &&
                  this._log.warn("vertIndices float32Array: " + this._name),
                t instanceof Uint32Array
                  ? ((this.vertIndicesTyped = t),
                    (this._indexType = this._cgl.gl.UNSIGNED_INT))
                  : t instanceof Uint16Array
                  ? (this.vertIndicesTyped = t)
                  : (this.vertIndicesTyped = new Uint16Array(t)),
                this._cgl.gl.bufferData(
                  this._cgl.gl.ELEMENT_ARRAY_BUFFER,
                  this.vertIndicesTyped,
                  this._cgl.gl.DYNAMIC_DRAW
                ),
                (this._bufVerticesIndizes.itemSize = 1),
                (this._bufVerticesIndizes.numItems = t.length);
            } else this._bufVerticesIndizes.numItems = 0;
          else this._log.warn("no bufVerticesIndizes: " + this._name);
        }),
        (E.prototype.setGeom = function (e, t) {
          (this._geom = e),
            null != e.glPrimitive && (this._glPrimitive = e.glPrimitive),
            this._geom &&
              this._geom.name &&
              (this._name = "mesh " + this._geom.name),
            (A.lastMesh = null),
            this._cgl.profileData.profileMeshSetGeom++,
            this._disposeAttributes(),
            this.updateVertices(this._geom),
            this.setVertexIndices(this._geom.verticesIndices),
            this.addVertexNumbers && this._setVertexNumbers();
          const n = this._geom.getAttributes(),
            i = {
              texCoords: I.SHADERVAR_VERTEX_TEXCOORD,
              vertexNormals: I.SHADERVAR_VERTEX_NORMAL,
              vertexColors: I.SHADERVAR_VERTEX_COLOR,
              tangents: "attrTangent",
              biTangents: "attrBiTangent",
            };
          for (const e in n)
            n[e].data &&
              n[e].data.length &&
              this.setAttribute(i[e] || e, n[e].data, n[e].itemSize);
          t && (this._geom = null);
        }),
        (E.prototype._preBind = function (t) {
          for (let e = 0; e < this._attributes.length; e++)
            this._attributes[e].cb &&
              this._attributes[e].cb(this._attributes[e], this._geom, t);
        }),
        (E.prototype._checkAttrLengths = function () {
          for (let e = 0; e < this._attributes.length; e++)
            if (
              this._attributes[e].arrayLength / this._attributes[e].itemSize <
              this._attributes[0].arrayLength / this._attributes[0].itemSize
            ) {
              let e = "unknown";
              this._geom && (e = this._geom.name);
            }
        }),
        (E.prototype._bind = function (i) {
          if (!i.isValid()) return;
          let t = [];
          if (
            (this._attribLocs[i.id]
              ? (t = this._attribLocs[i.id])
              : (this._attribLocs[i.id] = t),
            (this._lastShader = i),
            i.lastCompile > this._lastAttrUpdate ||
              t.length != this._attributes.length)
          ) {
            this._lastAttrUpdate = i.lastCompile;
            for (let e = 0; e < this._attributes.length; e++) t[e] = -1;
          }
          for (let e = 0; e < this._attributes.length; e++) {
            const n = this._attributes[e];
            if (
              (-1 == t[e] &&
                n._attrLocationLastShaderTime != i.lastCompile &&
                ((n._attrLocationLastShaderTime = i.lastCompile),
                (t[e] = this._cgl.glGetAttribLocation(i.getProgram(), n.name)),
                this._cgl.profileData.profileAttrLoc++),
              -1 != t[e])
            )
              if (
                (this._cgl.gl.enableVertexAttribArray(t[e]),
                this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, n.buffer),
                n.instanced)
              )
                if (n.itemSize <= 4)
                  (n.itemSize && 0 != n.itemSize) ||
                    this._log.warn(
                      "instanced attrib itemsize error",
                      this._geom.name,
                      n
                    ),
                    this._cgl.gl.vertexAttribPointer(
                      t[e],
                      n.itemSize,
                      n.type,
                      !1,
                      4 * n.itemSize,
                      0
                    ),
                    this._cgl.gl.vertexAttribDivisor(t[e], 1);
                else if (16 == n.itemSize) {
                  const i = 64;
                  this._cgl.gl.vertexAttribPointer(t[e], 4, n.type, !1, i, 0),
                    this._cgl.gl.enableVertexAttribArray(t[e] + 1),
                    this._cgl.gl.vertexAttribPointer(
                      t[e] + 1,
                      4,
                      n.type,
                      !1,
                      i,
                      16
                    ),
                    this._cgl.gl.enableVertexAttribArray(t[e] + 2),
                    this._cgl.gl.vertexAttribPointer(
                      t[e] + 2,
                      4,
                      n.type,
                      !1,
                      i,
                      32
                    ),
                    this._cgl.gl.enableVertexAttribArray(t[e] + 3),
                    this._cgl.gl.vertexAttribPointer(
                      t[e] + 3,
                      4,
                      n.type,
                      !1,
                      i,
                      48
                    ),
                    this._cgl.gl.vertexAttribDivisor(t[e], 1),
                    this._cgl.gl.vertexAttribDivisor(t[e] + 1, 1),
                    this._cgl.gl.vertexAttribDivisor(t[e] + 2, 1),
                    this._cgl.gl.vertexAttribDivisor(t[e] + 3, 1);
                } else this._log.warn("unknown instance attrib size", n.name);
              else {
                if (
                  ((n.itemSize && 0 != n.itemSize) ||
                    this._log.warn("attrib itemsize error", this._name, n),
                  this._cgl.gl.vertexAttribPointer(
                    t[e],
                    n.itemSize,
                    n.type,
                    !1,
                    4 * n.itemSize,
                    0
                  ),
                  n.pointer)
                )
                  for (let t = 0; t < n.pointer.length; t++) {
                    const e = n.pointer[t];
                    -1 == e.loc &&
                      (e.loc = this._cgl.glGetAttribLocation(
                        i.getProgram(),
                        e.name
                      )),
                      this._cgl.profileData.profileAttrLoc++,
                      this._cgl.gl.enableVertexAttribArray(e.loc),
                      this._cgl.gl.vertexAttribPointer(
                        e.loc,
                        n.itemSize,
                        n.type,
                        !1,
                        e.stride,
                        e.offset
                      );
                  }
                this.bindFeedback(n);
              }
          }
          0 !== this._bufVerticesIndizes.numItems &&
            this._cgl.gl.bindBuffer(
              this._cgl.gl.ELEMENT_ARRAY_BUFFER,
              this._bufVerticesIndizes
            );
        }),
        (E.prototype.unBind = function () {
          const e = this._lastShader;
          if (((this._lastShader = null), !e)) return;
          let t = [];
          this._attribLocs[e.id]
            ? (t = this._attribLocs[e.id])
            : (this._attribLocs[e.id] = t),
            (A.lastMesh = null);
          for (let e = 0; e < this._attributes.length; e++)
            this._attributes[e].instanced &&
              (this._attributes[e].itemSize <= 4
                ? (-1 != t[e] && this._cgl.gl.vertexAttribDivisor(t[e], 0),
                  t[e] >= 0 && this._cgl.gl.disableVertexAttribArray(t[e]))
                : (this._cgl.gl.vertexAttribDivisor(t[e], 0),
                  this._cgl.gl.vertexAttribDivisor(t[e] + 1, 0),
                  this._cgl.gl.vertexAttribDivisor(t[e] + 2, 0),
                  this._cgl.gl.vertexAttribDivisor(t[e] + 3, 0),
                  this._cgl.gl.disableVertexAttribArray(t[e] + 1),
                  this._cgl.gl.disableVertexAttribArray(t[e] + 2),
                  this._cgl.gl.disableVertexAttribArray(t[e] + 3))),
              -1 != t[e] && this._cgl.gl.disableVertexAttribArray(t[e]);
        }),
        (E.prototype.meshChanged = function () {
          return this._cgl.lastMesh && this._cgl.lastMesh != this;
        }),
        (E.prototype.printDebug = function (e) {
          console.log("--attributes");
          for (let e = 0; e < this._attributes.length; e++)
            console.log("attribute " + e + " " + this._attributes[e].name);
        }),
        (E.prototype.setNumVertices = function (e) {
          this._bufVertexAttrib.numItems = e;
        }),
        (E.prototype.getNumVertices = function () {
          return this._bufVertexAttrib.numItems;
        }),
        (E.prototype.render = function (n) {
          if (!n || !n.isValid()) return;
          if (
            (this._checkAttrLengths(),
            this._geom &&
              (!this._preWireframeGeom ||
                n.wireframe ||
                this._geom.isIndexed() ||
                (this.setGeom(this._preWireframeGeom),
                (this._preWireframeGeom = null)),
              n.wireframe))
          ) {
            let e = !1;
            this._geom.isIndexed() &&
              (this._preWireframeGeom ||
                ((this._preWireframeGeom = this._geom),
                (this._geom = this._geom.copy())),
              this._geom.unIndex(),
              (e = !0)),
              this._geom.getAttribute("attrBarycentric") ||
                (this._preWireframeGeom ||
                  ((this._preWireframeGeom = this._geom),
                  (this._geom = this._geom.copy())),
                (e = !0),
                this._geom.calcBarycentric()),
              e && this.setGeom(this._geom);
          }
          let e = !1;
          A.lastMesh != this && (A.lastMesh && A.lastMesh.unBind(), (e = !0)),
            e && this._preBind(n),
            n.bind(),
            this._bind(n),
            this.addVertexNumbers && this._setVertexNumbers(),
            (A.lastMesh = this);
          let t = this._cgl.gl.TRIANGLES;
          void 0 !== this._glPrimitive && (t = this._glPrimitive),
            null !== n.glPrimitive && (t = n.glPrimitive);
          let i = 1,
            s = this._cgl.profileData.doProfileGlQuery,
            r = !1;
          if (s) {
            let e = this._name + " " + n.getName() + " #" + n.id;
            this._numInstances &&
              (e += " instanced " + this._numInstances + "x");
            let t = this._cgl.profileData.glQueryData[e];
            if (
              (t ||
                ((t = { id: e, num: 0 }),
                (this._cgl.profileData.glQueryData[e] = t)),
              this._queryExt ||
                !1 === this._queryExt ||
                (this._queryExt =
                  this._cgl.gl.getExtension(
                    "EXT_disjoint_timer_query_webgl2"
                  ) || !1),
              this._queryExt)
            ) {
              if (t._drawQuery) {
                if (
                  this._cgl.gl.getQueryParameter(
                    t._drawQuery,
                    this._cgl.gl.QUERY_RESULT_AVAILABLE
                  )
                ) {
                  const n =
                    this._cgl.gl.getQueryParameter(
                      t._drawQuery,
                      this._cgl.gl.QUERY_RESULT
                    ) / 1e6;
                  (t._times += n),
                    t._numcount++,
                    (t.when = performance.now()),
                    (t._drawQuery = null),
                    (t.queryStarted = !1);
                }
              }
              t.queryStarted ||
                ((t._drawQuery = this._cgl.gl.createQuery()),
                this._cgl.gl.beginQuery(
                  this._queryExt.TIME_ELAPSED_EXT,
                  t._drawQuery
                ),
                (r = t.queryStarted = !0));
            }
          }
          if (
            (this.hasFeedbacks()
              ? this.drawFeedbacks(n, t)
              : 0 === this._bufVerticesIndizes.numItems
              ? (t == this._cgl.gl.TRIANGLES && (i = 3),
                0 === this._numInstances
                  ? this._cgl.gl.drawArrays(
                      t,
                      this._bufVertexAttrib.startItem,
                      this._bufVertexAttrib.numItems -
                        this._bufVertexAttrib.startItem
                    )
                  : this._cgl.gl.drawArraysInstanced(
                      t,
                      this._bufVertexAttrib.startItem,
                      this._bufVertexAttrib.numItems,
                      this._numInstances
                    ))
              : 0 === this._numInstances
              ? this._cgl.gl.drawElements(
                  t,
                  this._bufVerticesIndizes.numItems,
                  this._indexType,
                  0
                )
              : this._cgl.gl.drawElementsInstanced(
                  t,
                  this._bufVerticesIndizes.numItems,
                  this._indexType,
                  0,
                  this._numInstances
                ),
            this._cgl.debugOneFrame &&
              this._cgl.gl.getError() != this._cgl.gl.NO_ERROR)
          ) {
            this._log.error("mesh draw gl error"),
              this._log.error("mesh", this),
              this._log.error("shader", n);
            for (
              let e = 0;
              e <
              this._cgl.gl.getProgramParameter(
                n.getProgram(),
                this._cgl.gl.ACTIVE_ATTRIBUTES
              );
              e++
            ) {
              const t = this._cgl.gl.getActiveAttrib(n.getProgram(), e).name;
              this._log.error("attrib ", t);
            }
          }
          (this._cgl.profileData.profileMeshNumElements +=
            (this._bufVertexAttrib.numItems / i) * (this._numInstances || 1)),
            this._cgl.profileData.profileMeshDraw++,
            s && r && this._cgl.gl.endQuery(this._queryExt.TIME_ELAPSED_EXT),
            this.unBind();
        }),
        (E.prototype.setNumInstances = function (n) {
          if (((n = Math.max(0, n)), this._numInstances != n)) {
            this._numInstances = n;
            const t = new Float32Array(n);
            for (let e = 0; e < n; e++) t[e] = e;
            this.setAttribute("instanceIndex", t, 1, { instanced: !0 });
          }
        }),
        (E.prototype._disposeAttributes = function () {
          if (this._attributes) {
            for (let e = 0; e < this._attributes.length; e++)
              this._attributes[e].buffer &&
                (this._cgl.gl.deleteBuffer(this._attributes[e].buffer),
                (this._attributes[e].buffer = null));
            this._attributes.length = 0;
          }
        }),
        (E.prototype.dispose = function () {
          this._bufVertexAttrib &&
            this._bufVertexAttrib.buffer &&
            this._cgl.gl.deleteBuffer(this._bufVertexAttrib.buffer),
            this._bufVerticesIndizes &&
              this._cgl.gl.deleteBuffer(this._bufVerticesIndizes),
            (this._bufVerticesIndizes = null),
            this._disposeAttributes();
        }),
        (function (e) {
          (e.prototype.hasFeedbacks = function () {
            return this._feedBacks.length > 0;
          }),
            (e.prototype.removeFeedbacks = function (e) {
              this._feedbacks &&
                ((this._feedbacks.length = 0), (this._feedBacksChanged = !0));
            }),
            (e.prototype.setAttributeFeedback = function () {}),
            (e.prototype.setFeedback = function (e, t, n) {
              let i = { nameOut: t },
                s = !1;
              this.unBindFeedbacks();
              for (let e = 0; e < this._feedBacks.length; e++)
                this._feedBacks[e].nameOut == t &&
                  ((i = this._feedBacks[e]), (s = !0));
              return (
                s || (this._feedBacksChanged = !0),
                (i.initialArr = n),
                (i.attrib = e),
                i.outBuffer && this._cgl.gl.deleteBuffer(i.outBuffer),
                (i.outBuffer = this._cgl.gl.createBuffer()),
                this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, i.outBuffer),
                this._cgl.gl.bufferData(
                  this._cgl.gl.ARRAY_BUFFER,
                  i.initialArr,
                  this._cgl.gl.STATIC_DRAW
                ),
                this._cgl.gl.bindBuffer(
                  this._cgl.gl.ARRAY_BUFFER,
                  i.attrib.buffer
                ),
                this._cgl.gl.bufferData(
                  this._cgl.gl.ARRAY_BUFFER,
                  i.initialArr,
                  this._cgl.gl.STATIC_DRAW
                ),
                s || this._feedBacks.push(i),
                i
              );
            }),
            (e.prototype.bindFeedback = function (n) {
              if (!this._feedBacks || 0 === this._feedBacks.length) return;
              -1 == this._transformFeedBackLoc &&
                (this._transformFeedBackLoc =
                  this._cgl.gl.createTransformFeedback()),
                this._cgl.gl.bindTransformFeedback(
                  this._cgl.gl.TRANSFORM_FEEDBACK,
                  this._transformFeedBackLoc
                );
              let i = !1;
              for (let t = 0; t < this._feedBacks.length; t++) {
                const e = this._feedBacks[t];
                e.attrib == n &&
                  ((i = !0),
                  this._cgl.gl.bindBufferBase(
                    this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER,
                    t,
                    e.outBuffer
                  ));
              }
            }),
            (e.prototype.drawFeedbacks = function (e, t) {
              let n = 0;
              if (this._feedBacksChanged) {
                const t = [];
                for (
                  this._cgl.gl.bindTransformFeedback(
                    this._cgl.gl.TRANSFORM_FEEDBACK,
                    this._transformFeedBackLoc
                  ),
                    n = 0;
                  n < this._feedBacks.length;
                  n++
                )
                  t.push(this._feedBacks[n].nameOut);
                return (
                  e.setFeedbackNames(t),
                  console.log("feedbacknames", t),
                  e.compile(),
                  (this._feedBacksChanged = !1),
                  this._cgl.gl.bindTransformFeedback(
                    this._cgl.gl.TRANSFORM_FEEDBACK,
                    null
                  ),
                  void console.log("changed finished")
                );
              }
              this._cgl.gl.beginTransformFeedback(this.glPrimitive),
                this._cgl.gl.drawArrays(
                  t,
                  0,
                  this._feedBacks[0].attrib.numItems
                ),
                this._cgl.gl.endTransformFeedback(),
                this.unBindFeedbacks(),
                this.feedBacksSwapBuffers();
            }),
            (e.prototype.unBindFeedbacks = function () {
              for (let e = 0; e < this._feedBacks.length; e++)
                this._cgl.gl.bindBufferBase(
                  this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER,
                  e,
                  null
                );
              this._cgl.gl.bindTransformFeedback(
                this._cgl.gl.TRANSFORM_FEEDBACK,
                null
              );
            }),
            (e.prototype.feedBacksSwapBuffers = function () {
              for (let t = 0; t < this._feedBacks.length; t++) {
                const e = this._feedBacks[t].attrib.buffer;
                (this._feedBacks[t].attrib.buffer =
                  this._feedBacks[t].outBuffer),
                  (this._feedBacks[t].outBuffer = e);
              }
            });
        })(E);
      const T = {
        getSimpleRect: function (e, t) {
          const n = new d(t);
          return (
            (n.vertices = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0]),
            (n.texCoords = [1, 1, 0, 1, 1, 0, 0, 0]),
            (n.verticesIndices = [0, 1, 2, 2, 1, 3]),
            (n.vertexNormals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            new E(e, n)
          );
        },
      };
      CGL.CopyTexture = class {
        constructor(e, t, n) {
          (this.cgl = e), (this._options = n), (this.fb = null);
          const i =
              n.shader ||
              "".endl() +
                "UNI sampler2D tex;".endl() +
                "IN vec2 texCoord;".endl() +
                "void main()".endl() +
                "{".endl() +
                "    vec4 col=texture(tex,texCoord);".endl() +
                "    outColor= col;".endl() +
                "}",
            s =
              "".endl() +
              "IN vec3 vPosition;".endl() +
              "IN vec2 attrTexCoord;".endl() +
              "OUT vec2 texCoord;".endl() +
              "void main()".endl() +
              "{".endl() +
              "   texCoord=attrTexCoord;".endl() +
              "   gl_Position = vec4(vPosition,  1.0);".endl() +
              "}";
          (this.bgShader = new CGL.Shader(e, "corelib copytexture " + t)),
            this.bgShader.setSource(s, i);
          new CGL.Uniform(this.bgShader, "t", "tex", 0);
          this.mesh = T.getSimpleRect(this.cgl, "texEffectRect");
        }
        copy(e) {
          if (!e) return CGL.Texture.getEmptyTexture(this.cgl);
          const i = this._options.width || e.width,
            s = this._options.height || e.height,
            r = this.cgl;
          if (this.fb)
            (this.fb.getWidth() == i && this.fb.getHeight() == s) ||
              this.fb.setSize(i, s);
          else {
            let e = CGL.Texture.FILTER_LINEAR,
              t = CGL.Texture.WRAP_CLAMP_TO_EDGE;
            this._options.hasOwnProperty("filter") &&
              (e = this._options.filter),
              this._options.hasOwnProperty("wrap") && (t = this._options.wrap);
            const n = {
              isFloatingPointTexture: this._options.isFloatingPointTexture,
              numRenderBuffers: this._options.numRenderBuffers || 1,
              filter: e,
              wrap: t,
            };
            1 == r.glVersion
              ? (this.fb = new CGL.Framebuffer(r, i, s, n))
              : (this.fb = new CGL.Framebuffer2(r, i, s, n));
          }
          return (
            (r.frameStore.renderOffscreen = !0),
            this.fb.renderStart(r),
            r.setTexture(0, e.tex),
            r.pushShader(this.bgShader),
            this.mesh.render(this.bgShader),
            r.popShader(),
            this.fb.renderEnd(),
            (r.frameStore.renderOffscreen = !1),
            this.fb.getTextureColor()
          );
        }
        dispose() {
          this.fb && this.fb.dispose(),
            this.bgShader && this.bgShader.dispose(),
            this.mesh && this.mesh.dispose();
        }
      };
    },
  ]).Copytexture);
