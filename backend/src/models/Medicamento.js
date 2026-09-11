let medicamentosStore = [
  {
    id: 'med-101',
    codigo: '931',
    descripcion: 'Paracetamol (acetaminofén) Tableta 500 mg',
    cantidad: 150,
    lote: 'LT-2026-081',
    vencimiento: '2027-11-30',
    categoria: 'Analgésico / Antipirético',
    precio: 4.50,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'med-102',
    codigo: '7',
    descripcion: 'Clindamicina clorhidrato Cápsula 300 mg',
    cantidad: 8, // Stock Bajo
    lote: 'LT-2026-092',
    vencimiento: '2027-06-15',
    categoria: 'Antibiótico Lincosamida',
    precio: 18.50,
    createdAt: '2026-01-12T11:20:00.000Z',
    updatedAt: '2026-03-01T14:15:00.000Z'
  },
  {
    id: 'med-103',
    codigo: '10534',
    descripcion: 'Sitagliptina Fosfato Comprimido recubierto 100 mg',
    cantidad: 45,
    lote: 'LT-2026-044',
    vencimiento: '2026-09-25', // Próximo a vencer
    categoria: 'Hipoglucemiante Oral / DPP-4',
    precio: 35.00,
    createdAt: '2026-01-15T09:30:00.000Z',
    updatedAt: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'med-104',
    codigo: '1205',
    descripcion: 'Ibuprofeno 400 mg Cápsula Blanda',
    cantidad: 200,
    lote: 'LT-2025-188',
    vencimiento: '2026-08-10', // Vencido
    categoria: 'Antiinflamatorio',
    precio: 6.25,
    createdAt: '2026-01-18T16:45:00.000Z',
    updatedAt: '2026-01-18T16:45:00.000Z'
  },
  {
    id: 'med-105',
    codigo: '458',
    descripcion: 'Amoxicilina + Ácido Clavulánico 875/125 mg Tabletas',
    cantidad: 5, // Stock Bajo
    lote: 'LT-2026-112',
    vencimiento: '2028-01-20',
    categoria: 'Antibiótico',
    precio: 42.00,
    createdAt: '2026-02-01T08:15:00.000Z',
    updatedAt: '2026-02-01T08:15:00.000Z'
  },
  {
    id: 'med-106',
    codigo: '892',
    descripcion: 'Omeprazol 20 mg Cápsula Gastrorresistente',
    cantidad: 320,
    lote: 'LT-2026-205',
    vencimiento: '2027-12-01',
    categoria: 'Antiácido / Inhibidor Bomba',
    precio: 8.75,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'med-107',
    codigo: '3041',
    descripcion: 'Loratadina 10 mg Jarabe / Comprimido',
    cantidad: 85,
    lote: 'LT-2026-056',
    vencimiento: '2026-10-05', // Próximo a vencer
    categoria: 'Antihistamínico',
    precio: 12.00,
    createdAt: '2026-02-15T14:30:00.000Z',
    updatedAt: '2026-02-15T14:30:00.000Z'
  },
  {
    id: 'med-108',
    codigo: '612',
    descripcion: 'Losartán Potásico 50 mg Comprimido',
    cantidad: 30,
    lote: 'LT-2026-301',
    vencimiento: '2027-04-18',
    categoria: 'Antihipertensivo',
    precio: 15.50,
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z'
  }
];

class MedicamentoModel {
  static getAll({ search = '', filter = 'all', page = 1, limit = 10 }) {
    let result = [...medicamentosStore];
    const today = new Date('2026-09-08');

    // Search filter
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      result = result.filter(m => 
        String(m.codigo).toLowerCase().includes(query) ||
        m.descripcion.toLowerCase().includes(query) ||
        m.lote.toLowerCase().includes(query) ||
        (m.categoria && m.categoria.toLowerCase().includes(query))
      );
    }

    // Category / Status filter
    if (filter === 'low_stock') {
      result = result.filter(m => m.cantidad <= 10);
    } else if (filter === 'expiring_soon') {
      result = result.filter(m => {
        const venc = new Date(m.vencimiento);
        const diffDays = Math.ceil((venc - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 60;
      });
    } else if (filter === 'expired') {
      result = result.filter(m => {
        const venc = new Date(m.vencimiento);
        return venc < today;
      });
    }

    // Sort by updated date descending
    result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    return {
      items: paginatedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    };
  }

  static findById(id) {
    return medicamentosStore.find(m => m.id === id);
  }

  static findByCodigo(codigo) {
    const codeStr = String(codigo).trim().toLowerCase();
    return medicamentosStore.find(m => String(m.codigo).trim().toLowerCase() === codeStr);
  }

  static create(data) {
    const newMed = {
      id: `med-${Date.now()}`,
      codigo: String(data.codigo).trim(),
      descripcion: data.descripcion.trim(),
      cantidad: parseInt(data.cantidad, 10),
      lote: data.lote.trim(),
      vencimiento: data.vencimiento,
      categoria: data.categoria ? data.categoria.trim() : 'General',
      precio: data.precio ? parseFloat(data.precio) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    medicamentosStore.unshift(newMed);
    return newMed;
  }

  static update(id, data) {
    const index = medicamentosStore.findIndex(m => m.id === id);
    if (index === -1) return null;

    const existing = medicamentosStore[index];
    const updated = {
      ...existing,
      codigo: data.codigo ? String(data.codigo).trim() : existing.codigo,
      descripcion: data.descripcion ? data.descripcion.trim() : existing.descripcion,
      cantidad: data.cantidad !== undefined ? parseInt(data.cantidad, 10) : existing.cantidad,
      lote: data.lote ? data.lote.trim() : existing.lote,
      vencimiento: data.vencimiento || existing.vencimiento,
      categoria: data.categoria !== undefined ? data.categoria.trim() : existing.categoria,
      precio: data.precio !== undefined ? parseFloat(data.precio) : existing.precio,
      updatedAt: new Date().toISOString()
    };

    medicamentosStore[index] = updated;
    return updated;
  }

  static delete(id) {
    const index = medicamentosStore.findIndex(m => m.id === id);
    if (index === -1) return false;
    medicamentosStore.splice(index, 1);
    return true;
  }

  static getDashboardStats() {
    const today = new Date('2026-09-08');
    const totalMedicamentos = medicamentosStore.length;
    let totalUnidades = 0;
    let stockBajoCount = 0;
    let proximosVencerCount = 0;
    let vencidosCount = 0;

    medicamentosStore.forEach(m => {
      totalUnidades += m.cantidad;
      if (m.cantidad <= 10) stockBajoCount++;

      const venc = new Date(m.vencimiento);
      const diffDays = Math.ceil((venc - today) / (1000 * 60 * 60 * 24));

      if (venc < today) {
        vencidosCount++;
      } else if (diffDays <= 60) {
        proximosVencerCount++;
      }
    });

    return {
      totalMedicamentos,
      totalUnidades,
      stockBajoCount,
      proximosVencerCount,
      vencidosCount,
      alertasCriticas: stockBajoCount + vencidosCount,
      ultimosRegistros: medicamentosStore.slice(0, 5)
    };
  }
}

module.exports = MedicamentoModel;
