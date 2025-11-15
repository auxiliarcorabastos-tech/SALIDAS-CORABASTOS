# Mini ERP

Estructura base lista para GitHub.
# Mini ERP – Planillas de Entrega (PEF)

Mini ERP es una aplicación HTML5 que permite crear, gestionar y consultar planillas de entrega tipo **PEF (Planilla Entrega a Fundaciones/Organizaciones)**. Funciona 100% en el navegador usando LocalStorage, sin necesidad de servidor.

---

## 🚀 Funciones principales

### 🔐 Autenticación
- Inicio de sesión obligatorio.
- Roles de usuario:
  - **Administrador** → control total, creación de usuarios, fundaciones, items, documentos.
  - **Creador** → crea documentos y puede imprimir, pero no aprobar/desaprobar.

---

## 🧾 Gestión de documentos PEF
Cada documento incluye:
- Fundación / Organización.
- Punto de envío (sucursales).
- Conductor con placa fija.
- Items con cantidades y kilos.
- Flete, peaje y costos adicionales.
- Número único con prefijo **PEF-XXXX**.
- Generación de PDF o imagen.
- Firma digital antes del cierre.
- Historial de documentos descargables.

---

## 🚚 Conductores y Vehículos
- Registro de conductores.
- Cada conductor tiene placa fija asociada.
- Selección rápida en los documentos.

---

## 🏢 Fundaciones / Organizaciones
- Creación de fundaciones.
- Cada fundación puede tener múltiples puntos de envío.
- Información guardada automáticamente.
- Evita repetir datos en el futuro.

---

## 📦 Items
- Creación de items desde el panel o durante un documento.
- Lista seleccionable.
- Items con cantidades y kilos.

---

## 🧑‍💼 Usuarios
- Gestión de usuarios (solo administrador).
- Perfiles: Administrador y Creador.

---

## 📄 Exportación
- Generación de PDF o imagen.
- Descarga ilimitada.
- Firma obligatoria para cerrar planilla.

---

## 🗂 Estructura del proyecto
