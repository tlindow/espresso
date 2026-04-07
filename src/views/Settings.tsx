import { useState, useEffect } from 'preact/hooks';
import { exportData, importData } from '../db/export';

export function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `espresso-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const result = await importData(text);
        setImportStatus(`Imported ${result.shots} shots and ${result.cafes} cafes`);
      } catch {
        setImportStatus('Import failed — invalid file format');
      }
    };
    input.click();
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Settings</h2>

      <div class="card" style={{ marginBottom: '16px' }}>
        <div class="form-label">Theme</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            class={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            class={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
        </div>
      </div>

      <div class="card">
        <div class="form-label">Data</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" class="btn btn-secondary" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" class="btn btn-secondary" onClick={handleImport}>
            Import JSON
          </button>
        </div>
        {importStatus && (
          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
}
