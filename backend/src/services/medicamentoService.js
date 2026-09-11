const MedicamentoModel = require('../models/Medicamento');

class MedicamentoService {
  static getMedicamentos(queryParams) {
    return MedicamentoModel.getAll(queryParams);
  }

  static getMedicamentoById(id) {
    const med = MedicamentoModel.findById(id);
    if (!med) {
      throw { status: 404, message: 'Medicamento no encontrado en el sistema.' };
    }
    return med;
  }

  static createMedicamento(data) {
    // Check if code already exists
    const existing = MedicamentoModel.findByCodigo(data.codigo);
    if (existing) {
      throw { status: 400, message: `Ya existe un medicamento registrado con el código '${data.codigo.toUpperCase()}'.` };
    }

    return MedicamentoModel.create(data);
  }

  static updateMedicamento(id, data) {
    const existing = MedicamentoModel.findById(id);
    if (!existing) {
      throw { status: 404, message: 'El medicamento a actualizar no existe.' };
    }

    // Check code duplication if updated
    if (data.codigo && data.codigo.trim().toUpperCase() !== existing.codigo) {
      const codeCheck = MedicamentoModel.findByCodigo(data.codigo);
      if (codeCheck) {
        throw { status: 400, message: `El código '${data.codigo.toUpperCase()}' ya está en uso por otro medicamento.` };
      }
    }

    return MedicamentoModel.update(id, data);
  }

  static deleteMedicamento(id) {
    const success = MedicamentoModel.delete(id);
    if (!success) {
      throw { status: 404, message: 'No se pudo eliminar el medicamento especificado.' };
    }
    return true;
  }

  static getDashboardStats() {
    return MedicamentoModel.getDashboardStats();
  }
}

module.exports = MedicamentoService;
