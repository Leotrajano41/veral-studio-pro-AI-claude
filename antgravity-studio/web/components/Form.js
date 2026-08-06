import React from 'react';

export default function Form({ onSubmit, children, submitText = 'Salvar', loading = false }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {children}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Processando...' : submitText}
      </button>
    </form>
  );
}
