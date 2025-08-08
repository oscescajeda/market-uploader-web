import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'market_uploader_items_v1';

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function csvEscape(value = '') {
  const needsQuotes = /[",\n]/.test(value);
  const v = String(value).replace(/"/g, '""');
  return needsQuotes ? `"${v}"` : v;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('all');

  // form state
  const [imageFile, setImageFile] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [pictureTitle, setPictureTitle] = useState('');
  const [pictureDescription, setPictureDescription] = useState('');
  const [tags, setTags] = useState('');

  // load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const resetForm = () => {
    setImageFile(null);
    setBusinessName('');
    setContactName('');
    setContactInfo('');
    setPictureTitle('');
    setPictureDescription('');
    setTags('');
    const file = document.getElementById('imageInput');
    if (file) file.value = '';
  };

  async function handleAdd(e) {
    e.preventDefault();
    if (!imageFile) {
      alert('Please choose an image.');
      return;
    }
    const imageDataUrl = await readFileAsDataURL(imageFile);
    const item = {
      id: crypto.randomUUID(),
      imageDataUrl,
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      contactInfo: contactInfo.trim(),
      pictureTitle: pictureTitle.trim(),
      pictureDescription: pictureDescription.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };
    setItems(prev => [item, ...prev]);
    resetForm();
  }

  function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function startEdit(item) {
    const updatedBusiness = prompt('Business Name', item.businessName) ?? item.businessName;
    const updatedContactName = prompt('Contact Name', item.contactName) ?? item.contactName;
    const updatedContactInfo = prompt('Contact (email/phone/handle)', item.contactInfo) ?? item.contactInfo;
    const updatedTitle = prompt('What is the picture?', item.pictureTitle) ?? item.pictureTitle;
    const updatedDesc = prompt('Description', item.pictureDescription) ?? item.pictureDescription;
    const updatedTags = prompt('Tags (comma-separated)', item.tags.join(', ')) ?? item.tags.join(', ');
    const merged = {
      ...item,
      businessName: updatedBusiness.trim(),
      contactName: updatedContactName.trim(),
      contactInfo: updatedContactInfo.trim(),
      pictureTitle: updatedTitle.trim(),
      pictureDescription: updatedDesc.trim(),
      tags: updatedTags.split(',').map(t => t.trim()).filter(Boolean)
    };
    setItems(prev => prev.map(i => (i.id === item.id ? merged : i)));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `items-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportCSV() {
    const headers = [
      'id',
      'createdAt',
      'businessName',
      'contactName',
      'contactInfo',
      'pictureTitle',
      'pictureDescription',
      'tags'
    ];
    const rows = items.map(i =>
      [
        i.id,
        i.createdAt,
        i.businessName,
        i.contactName,
        i.contactInfo,
        i.pictureTitle,
        i.pictureDescription,
        i.tags.join('; ')
      ]
        .map(csvEscape)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `items-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter(i => {
      const matchesText =
        !q ||
        i.businessName.toLowerCase().includes(q) ||
        i.contactName.toLowerCase().includes(q) ||
        i.contactInfo.toLowerCase().includes(q) ||
        i.pictureTitle.toLowerCase().includes(q) ||
        i.pictureDescription.toLowerCase().includes(q);
      const matchesTag = tagFilter === 'all' || i.tags.includes(tagFilter);
      return matchesText && matchesTag;
    });
  }, [items, filter, tagFilter]);

  const allTags = useMemo(() => {
    const s = new Set();
    items.forEach(i => i.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [items]);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Market-Style Image Uploader</h1>
          <div className="small">
            Upload a picture and add: contact, business name, and what the picture is. Saves locally in your browser.
          </div>
        </div>
        <div className="actions">
          <button className="button secondary" onClick={exportCSV}>Export CSV</button>
          <button className="button secondary" onClick={exportJSON}>Export JSON</button>
          <label className="button secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Import JSON
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const data = JSON.parse(String(reader.result));
                    if (Array.isArray(data)) setItems(data);
                    else alert('Invalid JSON format');
                  } catch {
                    alert('Failed to parse JSON');
                  }
                };
                reader.readAsText(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <div className="card padded">
        <h2 style={{ margin: '0 0 12px 0' }}>Add a New Picture</h2>
        <form onSubmit={handleAdd} className="grid">
          <div>
            <label>Image</label>
            <input id="imageInput" className="input" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <label>Business Name</label>
            <input className="input" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g., Tacos El Gallo" />
          </div>
          <div>
            <label>Contact Name</label>
            <input className="input" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g., Maria Lopez" />
          </div>
          <div>
            <label>Contact (email/phone/handle)</label>
            <input className="input" value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="e.g., maria@biz.com / (555) 123-4567" />
          </div>
          <div>
            <label>What is the picture?</label>
            <input className="input" value={pictureTitle} onChange={e => setPictureTitle(e.target.value)} placeholder="e.g., Signature birria tacos" />
          </div>
          <div>
            <label>Description (optional)</label>
            <textarea className="textarea" value={pictureDescription} onChange={e => setPictureDescription(e.target.value)} placeholder="Any additional context about this image" />
          </div>
          <div>
            <label>Tags (comma-separated)</label>
            <input className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., tacos, beef, spicy" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="button" type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="toolbar">
        <div className="search" style={{ flex: 1 }}>
          <span className="icon">🔎</span>
          <input className="input" placeholder="Search by business, contact, or text" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        <select className="select" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="all">All tags</option>
          {allTags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button className="button secondary" onClick={() => { setFilter(''); setTagFilter('all'); }}>Reset</button>
      </div>

      {filtered.length === 0 ? (
        <div className="card padded" style={{ textAlign: 'center' }}>
          <p className="small">No items yet. Add a picture above to get started.</p>
        </div>
      ) : (
        <div className="gallery">
          {filtered.map(item => (
            <div className="card" key={item.id}>
              <div className="aspect-video">
                <img src={item.imageDataUrl} alt={item.pictureTitle || item.businessName} />
              </div>
              <div className="meta">
                <h3>{item.pictureTitle || 'Untitled'}</h3>
                <div className="small">{new Date(item.createdAt).toLocaleString()}</div>
                <hr />
                <div className="kv">
                  <div className="small">Business</div><div>{item.businessName || '—'}</div>
                  <div className="small">Contact Name</div><div>{item.contactName || '—'}</div>
                  <div className="small">Contact</div><div style={{ wordBreak: 'break-word' }}>{item.contactInfo || '—'}</div>
                </div>
                {item.pictureDescription && (
                  <>
                    <hr />
                    <div className="small">Description</div>
                    <div style={{ fontSize: 14 }}>{item.pictureDescription}</div>
                  </>
                )}
                {item.tags?.length > 0 && (
                  <>
                    <hr />
                    <div className="taglist">
                      {item.tags.map((t, i) => (<span key={i} className="tag">#{t}</span>))}
                    </div>
                  </>
                )}
                <div className="actions" style={{ marginTop: 12 }}>
                  <button className="button secondary" onClick={() => startEdit(item)}>Edit</button>
                  <button className="button danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <p>Local-only MVP. Data is stored in your browser via localStorage.</p>
      </div>
    </div>
  );
}
