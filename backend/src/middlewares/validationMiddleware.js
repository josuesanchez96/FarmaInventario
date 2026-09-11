const validateMedicamento = (req, res, next) => {
  const { codigo, descripcion, cantidad, lote, vencimiento } = req.body;
  const errors = {};

  if (codigo === undefined || codigo === null || String(codigo).trim() === '') {
    errors.codigo = 'El código del medicamento (número) es obligatorio.';
  }

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    errors.descripcion = 'La descripción es obligatoria.';
  }

  if (cantidad === undefined || cantidad === null || isNaN(Number(cantidad))) {
    errors.cantidad = 'La cantidad debe ser un número válido.';
  } else if (Number(cantidad) < 0) {
    errors.cantidad = 'La cantidad no puede ser un valor negativo.';
  }

  if (!lote || typeof lote !== 'string' || lote.trim() === '') {
    errors.lote = 'El número de lote es obligatorio.';
  }

  if (!vencimiento || isNaN(Date.parse(vencimiento))) {
    errors.vencimiento = 'La fecha de vencimiento es obligatoria y debe ser una fecha válida.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en la solicitud.',
      errors
    });
  }

  next();
};

module.exports = {
  validateMedicamento
};
