const MedicamentoService = require('../services/medicamentoService');

class MedicamentoController {
  static async getAll(req, res) {
    try {
      const data = MedicamentoService.getMedicamentos(req.query);
      return res.status(200).json({
        success: true,
        data: data.items,
        pagination: data.pagination
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al consultar el inventario'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const med = MedicamentoService.getMedicamentoById(id);
      return res.status(200).json({
        success: true,
        data: med
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al obtener el medicamento'
      });
    }
  }

  static async create(req, res) {
    try {
      const newMed = MedicamentoService.createMedicamento(req.body);
      return res.status(201).json({
        success: true,
        message: 'Medicamento registrado con éxito',
        data: newMed
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al guardar el medicamento'
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updated = MedicamentoService.updateMedicamento(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Medicamento actualizado correctamente',
        data: updated
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al actualizar el medicamento'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      MedicamentoService.deleteMedicamento(id);
      return res.status(200).json({
        success: true,
        message: 'Medicamento eliminado del inventario'
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al eliminar el medicamento'
      });
    }
  }

  static async getDashboard(req, res) {
    try {
      const stats = MedicamentoService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al generar el resumen del dashboard'
      });
    }
  }
}

module.exports = MedicamentoController;
