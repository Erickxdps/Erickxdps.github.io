"""Genera los diagramas SVG del portafolio (modelos de datos reales y traza de rally)
y los inserta en index.html entre los marcadores <!-- svg:clave --> ... <!-- /svg:clave -->.

Uso (desde la carpeta del portafolio): python3 herramientas/diagramas.py index.html
"""
import math
import re
import sys
from html import escape

W = 1000
NW, HEAD, ROW, PADB = 202, 30, 21, 9
COLS = [12, 270, 528, 786]
TOP = 14
GAP = 64


def nh(fields):
    return HEAD + ROW * len(fields) + PADB


def f0(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def redondear(pts, r=8):
    """Polilínea ortogonal con esquinas redondeadas."""
    d = f"M{f0(pts[0][0])} {f0(pts[0][1])}"
    for i in range(1, len(pts) - 1):
        (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
        l1 = math.hypot(x1 - x0, y1 - y0)
        l2 = math.hypot(x2 - x1, y2 - y1)
        rr = min(r, l1 / 2, l2 / 2)
        ax, ay = x1 - (x1 - x0) / l1 * rr, y1 - (y1 - y0) / l1 * rr
        bx, by = x1 + (x2 - x1) / l2 * rr, y1 + (y2 - y1) / l2 * rr
        d += f" L{f0(ax)} {f0(ay)} Q{f0(x1)} {f0(y1)} {f0(bx)} {f0(by)}"
    d += f" L{f0(pts[-1][0])} {f0(pts[-1][1])}"
    return d


def er(clave, etiqueta, nodos, aristas):
    """nodos: {nombre: (col, fila, [campo:tipo], vista?)}
    aristas: (uno, muchos, tipo, params) con tipo h | v | r | derivada"""
    alto_fila = [max((nh(n[2]) for n in nodos.values() if n[1] == f), default=0) for f in (0, 1)]
    tops = [TOP, TOP + alto_fila[0] + GAP]
    H = tops[1] + alto_fila[1] + TOP
    geo = {k: (COLS[c], tops[f], NW, nh(campos), f) for k, (c, f, campos, *_) in nodos.items()}
    hueco = tops[0] + alto_fila[0]

    out = [f'<svg class="diagrama" viewBox="0 0 {W} {H}" role="img" aria-labelledby="{clave}-t">',
           f'<title id="{clave}-t">{escape(etiqueta)}</title>', '<g class="aristas">']

    for a, b, tipo, *p in aristas:
        ax, ay, aw, ah, af = geo[a]
        bx, by, bw, bh, bf = geo[b]
        if tipo in ("h", "derivada"):
            if ax < bx:
                pts = [(ax + aw, ay + 15), (bx, by + 15)]
            else:
                pts = [(ax, ay + 15), (bx + bw, by + 15)]
        elif tipo == "v":
            dx = p[0] if p else NW / 2
            pts = [(ax + dx, ay + ah), (bx + dx, by)] if af < bf else [(ax + dx, ay), (bx + dx, by + bh)]
        else:  # ruta por el hueco entre filas
            sx, tx, gy = p
            y = hueco + gy
            if af < bf:
                pts = [(ax + sx, ay + ah), (ax + sx, y), (bx + tx, y), (bx + tx, by)]
            else:
                pts = [(ax + sx, ay), (ax + sx, y), (bx + tx, y), (bx + tx, by + bh)]

        clase = "arista derivada" if tipo == "derivada" else "arista"
        g = [f'<g class="{clase}" data-de="{a}" data-a="{b}">', f'<path class="linea" d="{redondear(pts)}"/>']
        if tipo != "derivada":
            # "uno": barra perpendicular cerca del origen
            (x0, y0), (x1, y1) = pts[0], pts[1]
            L = math.hypot(x1 - x0, y1 - y0)
            ux, uy = (x1 - x0) / L, (y1 - y0) / L
            px, py = -uy, ux
            cx, cy = x0 + ux * 9, y0 + uy * 9
            g.append(f'<path class="marca" d="M{f0(cx + px * 6)} {f0(cy + py * 6)} L{f0(cx - px * 6)} {f0(cy - py * 6)}"/>')
            # "muchos": pata de gallo en el destino
            (x0, y0), (x1, y1) = pts[-2], pts[-1]
            L = math.hypot(x1 - x0, y1 - y0)
            ux, uy = (x1 - x0) / L, (y1 - y0) / L
            px, py = -uy, ux
            bx_, by_ = x1 - ux * 13, y1 - uy * 13
            pie = " ".join(f"M{f0(bx_)} {f0(by_)} L{f0(x1 + px * 7 * s)} {f0(y1 + py * 7 * s)}" for s in (-1, 0, 1))
            g.append(f'<path class="marca" d="{pie}"/>')
        g.append("</g>")
        out.append("".join(g))

    out.append('</g><g class="nodos">')
    for k, (c, f, campos, *extra) in nodos.items():
        x, y, w, h, _ = geo[k]
        vista = bool(extra and extra[0])
        clase = "nodo vista" if vista else "nodo"
        nodo = [f'<g class="{clase}" data-tabla="{k}" transform="translate({x} {y})">',
                f'<rect class="caja" width="{w}" height="{h}" rx="8"/>',
                f'<path class="cabeza" d="M0 8 A8 8 0 0 1 8 0 H{w - 8} A8 8 0 0 1 {w} 8 V{HEAD} H0 Z"/>',
                f'<text class="tabla" x="12" y="20">{escape(k)}</text>']
        if vista:
            nodo.append(f'<text class="etiqueta" x="{w - 12}" y="20" text-anchor="end">vista</text>')
        for i, campo in enumerate(campos):
            nombre, _, tipo = campo.partition(":")
            ctipo = "tipo fk" if tipo == "fk" else "tipo"
            nodo.append(f'<text class="campo" x="12" y="{HEAD + 15 + i * ROW}">{escape(nombre)}'
                        f'<tspan class="{ctipo}" x="{w - 12}" text-anchor="end">{escape(tipo)}</tspan></text>')
        nodo.append("</g>")
        out.append("".join(nodo))
    out.append("</g></svg>")
    return "\n".join(out)


# ---------- Museum Ticketing (app/models/) ----------
mhn = er("mhn", "Parte del modelo de datos del sistema de entradas: usuarios, ventas, líneas de venta, "
         "categorías, talonarios, tickets y cierres diarios", {
             "User": (0, 0, ["username:str", "full_name:str", "role:enum", "is_active:bool"]),
             "Sale": (1, 0, ["user_id:fk", "total_amount:dec", "payment_method:str", "status:str"]),
             "SaleItem": (2, 0, ["sale_id:fk", "ticket_category_id:fk", "quantity:int", "unit_price:dec"]),
             "TicketCategory": (3, 0, ["name:str", "price:dec", "is_active:bool"]),
             "DailyClosure": (0, 1, ["closed_by:fk", "closure_date:date", "total_amount:dec", "cash_counted:dec"]),
             "Ticket": (2, 1, ["sale_item_id:fk", "booklet_id:fk", "ticket_code:str", "qr_token:str", "status:enum"]),
             "TicketBooklet": (3, 1, ["ticket_category_id:fk", "first_number:int", "last_number:int", "next_number:int"]),
         }, [
             ("User", "Sale", "h"), ("Sale", "SaleItem", "h"), ("TicketCategory", "SaleItem", "h"),
             ("User", "DailyClosure", "v"), ("SaleItem", "Ticket", "v"),
             ("TicketCategory", "TicketBooklet", "v"), ("TicketBooklet", "Ticket", "h"),
         ])

# ---------- Catastro (app/models/) ----------
cat = er("cat", "Parte del modelo de datos del catastro: dueños, terrenos, cuotas, asistencias, reuniones y multas", {
    "Cuota": (0, 0, ["terreno_id:fk", "titulo:str", "monto:float", "pagado:bool"]),
    "Terreno": (1, 0, ["duenio_id:fk", "lugar:str", "manzano:int", "metros_cuadrados:float"]),
    "Duenio": (2, 0, ["nombre:str", "paterno:str", "materno:str", "ci:str"]),
    "Asistencia": (3, 0, ["duenio_id:fk", "id_reunion:fk", "asistio:bool"]),
    "Multa": (2, 1, ["duenio_id:fk", "cuota_id:fk", "reunion_id:fk", "monto:float", "tipo:str"]),
    "Reunion": (3, 1, ["fecha:date", "hora:time", "monto_multa:float"]),
}, [
    ("Terreno", "Cuota", "h"), ("Duenio", "Terreno", "h"), ("Duenio", "Asistencia", "h"),
    ("Duenio", "Multa", "v"), ("Reunion", "Asistencia", "v"), ("Reunion", "Multa", "h"),
    ("Cuota", "Multa", "r", NW / 2, 44, 30),
])

# ---------- Café Manager (cafe/migrations/001_initial.sql) ----------
cafe = er("cafe", "Parte del modelo de datos de Café Manager: jornadas, pedidos, líneas de pedido, productos, "
          "variantes, movimientos de inventario y la vista que calcula el stock", {
              "workdays": (0, 0, ["work_date:text", "status:text", "opening_fund_cents:int", "counted_cash_cents:int"]),
              "orders": (1, 0, ["workday_id:fk", "status:text", "total_cents:int", "paid_at:text"]),
              "order_items": (2, 0, ["order_id:fk", "variant_id:fk", "name_snapshot:text", "unit_price_cents:int"]),
              "product_variants": (3, 0, ["product_id:fk", "name:text", "price_cents:int", "min_stock:int"]),
              "inventory_movements": (1, 1, ["variant_id:fk", "workday_id:fk", "order_id:fk", "kind:text", "quantity:int"]),
              "variant_stock": (2, 1, ["variant_id:int", "stock:SUM(quantity)"], True),
              "products": (3, 1, ["category_id:fk", "name:text", "active:int"]),
          }, [
              ("workdays", "orders", "h"), ("orders", "order_items", "h"), ("product_variants", "order_items", "h"),
              ("products", "product_variants", "v"), ("orders", "inventory_movements", "v"),
              ("workdays", "inventory_movements", "r", NW / 2, 44, 22),
              ("product_variants", "inventory_movements", "r", 44, NW - 44, 40),
              ("inventory_movements", "variant_stock", "derivada"),
          ])


# ---------- Rally: traza GPS con notas calculadas de la propia geometría ----------
def rally():
    # El tramo se dibuja con rumbos: (largo del segmento, giro al final en grados; + derecha, - izquierda)
    x, y, rumbo = 34.0, 258.0, -5.0
    pts = [(x, y)]
    for largo, giro in [(140, -70), (130, 85), (140, -55), (110, 135), (130, -90), (150, -25),
                        (130, 65), (130, -75), (110, 25), (80, 0)]:
        x += largo * math.cos(math.radians(rumbo))
        y += largo * math.sin(math.radians(rumbo))
        pts.append((round(x, 1), round(y, 1)))
        rumbo += giro
    segs = []
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        segs.append(f"C{f0(c1[0])} {f0(c1[1])} {f0(c2[0])} {f0(c2[1])} {f0(p2[0])} {f0(p2[1])}")
    d = f"M{f0(pts[0][0])} {f0(pts[0][1])} " + " ".join(segs)

    notas = []
    for i in range(1, len(pts) - 1):
        (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
        v1, v2 = (x1 - x0, y1 - y0), (x2 - x1, y2 - y1)
        cruz = v1[0] * v2[1] - v1[1] * v2[0]
        ang = math.degrees(math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (math.hypot(*v1) * math.hypot(*v2))))
        if ang < 30:
            continue
        sev = 1 if ang > 125 else 2 if ang > 98 else 3 if ang > 78 else 4 if ang > 60 else 5 if ang > 45 else 6
        lado = "der" if cruz > 0 else "izq"  # y crece hacia abajo: cruz > 0 = giro horario = derecha
        # la etiqueta va por fuera de la curva
        dx, dy = x2 - x0, y2 - y0
        L = math.hypot(dx, dy)
        nx, ny = (dy / L, -dx / L) if lado == "der" else (-dy / L, dx / L)
        notas.append((x1, y1, f"{lado} {sev}", nx, ny))
    print("notas:", [n[2] for n in notas], file=sys.stderr)

    out = [f'<svg class="diagrama rally" viewBox="0 0 {W} 300" role="img" aria-labelledby="rally-t">',
           '<title id="rally-t">Ilustración: traza GPS de un tramo con las curvas detectadas y sus notas de ruta</title>',
           f'<path class="traza-sombra" d="{d}"/>', f'<path class="traza" d="{d}"/>',
           f'<path class="traza-recorrida" d="{d}"/>']
    for x, y, txt, nx, ny in notas:
        w = 16 + len(txt) * 8.6
        tx, ty = x + nx * 34, y + ny * 30
        out.append(f'<g class="nota" data-x="{x}" data-y="{y}"><circle cx="{x}" cy="{y}" r="5"/>'
                   f'<rect x="{f0(tx - w / 2)}" y="{f0(ty - 13)}" width="{f0(w)}" height="26" rx="13"/>'
                   f'<text x="{f0(tx)}" y="{f0(ty + 4.5)}" text-anchor="middle">{txt}</text></g>')
    out.append(f'<circle class="inicio" cx="{pts[0][0]}" cy="{pts[0][1]}" r="5"/>'
               f'<text class="rotulo" x="{pts[0][0]}" y="{pts[0][1] + 26}">largada</text>'
               f'<circle class="fin" cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="5"/>'
               f'<text class="rotulo" x="{pts[-1][0]}" y="{pts[-1][1] + 26}" text-anchor="end">llegada</text>'
               f'<circle class="auto" cx="{pts[0][0]}" cy="{pts[0][1]}" r="7"/>')
    out.append("</svg>")
    return "\n".join(out)


bloques = {"mhn": mhn, "cat": cat, "cafe": cafe, "rally": rally()}
ruta = sys.argv[1]
html = open(ruta, encoding="utf-8").read()
for k, svg in bloques.items():
    patron = re.compile(rf"(<!-- svg:{k} -->)(.*?)(<!-- /svg:{k} -->)", re.S)
    if not patron.search(html):
        sys.exit(f"falta el marcador svg:{k}")
    html = patron.sub(lambda m: m.group(1) + "\n" + svg + "\n" + m.group(3), html)
open(ruta, "w", encoding="utf-8").write(html)
print("ok", {k: len(v) for k, v in bloques.items()})
