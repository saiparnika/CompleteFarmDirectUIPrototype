import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Btn, Badge, Input, Select } from '../../components/ui';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';

const tabs = ['All', 'Active', 'Low Stock', 'Sold Out'];

// Map common produce names to emoji icons
function getProductIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('tomato')) return '🍅';
  if (n.includes('onion')) return '🧅';
  if (n.includes('potato')) return '🥔';
  if (n.includes('chilli') || n.includes('chili')) return '🌶️';
  if (n.includes('brinjal') || n.includes('eggplant')) return '🍆';
  if (n.includes('cabbage')) return '🥬';
  if (n.includes('carrot')) return '🥕';
  if (n.includes('corn')) return '🌽';
  if (n.includes('rice') || n.includes('grain') || n.includes('wheat')) return '🌾';
  if (n.includes('apple')) return '🍎';
  if (n.includes('banana')) return '🍌';
  if (n.includes('mango')) return '🥭';
  if (n.includes('orange')) return '🍊';
  if (n.includes('grape')) return '🍇';
  return '🌿';
}

function getProductStatus(p: Product): 'active' | 'low' | 'sold' {
  if (p.quantity_kg <= 0 || !p.is_active) return 'sold';
  if (p.quantity_kg < 100) return 'low';
  return 'active';
}

function getStatusLabel(status: 'active' | 'low' | 'sold'): string {
  if (status === 'active') return 'Active';
  if (status === 'low') return 'Low Stock';
  return 'Sold Out';
}

export default function FarmerProducts() {
  const navigate = useNavigate();
  const { products, loading, error, updateProduct, deleteProduct } = useProducts();
  const [tab, setTab] = useState('All');

  // Edit modal state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', qty: '', price: '', quality: '', unit: '', harvest: '', location: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = products.filter(p => {
    const status = getProductStatus(p);
    if (tab === 'All') return true;
    if (tab === 'Active') return status === 'active';
    if (tab === 'Low Stock') return status === 'low';
    return status === 'sold';
  });

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setEditForm({
      name: p.name,
      category: p.category,
      qty: String(p.quantity_kg),
      price: String(p.price_per_kg),
      quality: p.grade || 'Grade A',
      unit: p.unit || 'kg',
      harvest: p.harvest_date || '',
      location: p.location || '',
    });
    setEditImageFile(null);
    setEditImagePreview(p.image_url);
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setEditError('');

    if (!editForm.name.trim()) { setEditError('Product name is required.'); return; }
    const price = parseFloat(editForm.price);
    const qty = parseFloat(editForm.qty);
    if (isNaN(price) || price <= 0) { setEditError('Price must be a positive number.'); return; }
    if (isNaN(qty) || qty < 0) { setEditError('Quantity must be non-negative.'); return; }

    setEditSaving(true);

    const { error: err } = await updateProduct(
      editProduct.id,
      {
        name: editForm.name.trim(),
        category: editForm.category,
        price_per_kg: price,
        quantity_kg: qty,
        grade: editForm.quality,
        unit: editForm.unit,
        harvest_date: editForm.harvest || null,
        location: editForm.location.trim() || null,
        is_active: qty > 0,
      },
      editImageFile
    );

    setEditSaving(false);
    if (err) {
      setEditError(err);
    } else {
      setEditProduct(null);
    }
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { setEditError('Only JPG, PNG, WebP allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setEditError('Image must be < 5MB.'); return; }
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    setEditError('');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error: err } = await deleteProduct(deleteId);
    setDeleting(false);
    if (err) {
      setEditError(err);
    }
    setDeleteId(null);
  };

  const handleToggleActive = async (p: Product) => {
    await updateProduct(p.id, { is_active: !p.is_active });
  };

  if (loading) {
    return (
      <FarmerLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">🌿</span>
            <p className="text-gray-500 font-medium">Loading products...</p>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Btn onClick={() => navigate('/farmer/add-product')}>+ Add Product</Btn>
      </div>

      {error && <div className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${tab === t ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No products yet</h2>
          <p className="text-gray-500 mb-6">List your first produce to start selling on the marketplace.</p>
          <Btn onClick={() => navigate('/farmer/add-product')}>+ Add Your First Product</Btn>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No products match the "{tab}" filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const status = getProductStatus(p);
            return (
              <Card key={p.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {getProductIcon(p.name)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{p.name}</span>
                      <Badge variant={status === 'active' ? 'active' : status === 'low' ? 'low' : 'sold'}>
                        {getStatusLabel(status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{p.grade || p.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className="text-sm font-semibold text-gray-900">{p.quantity_kg} {p.unit || 'kg'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-sm font-semibold text-gray-900">₹{p.price_per_kg}/kg</p>
                  </div>
                  {p.harvest_date && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                      <p className="text-xs text-gray-400">Harvested</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(p.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 text-xs font-medium text-[#2E7D32] py-2 px-3 rounded-lg bg-green-50 hover:bg-green-100 transition">Edit</button>
                  <button onClick={() => handleToggleActive(p)} className="flex-1 text-xs font-medium text-blue-600 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    {p.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="flex-1 text-xs font-medium text-red-600 py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 transition">Delete</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditProduct(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {editError && <div className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-xl p-3">{editError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" value={editForm.name} onChange={v => setEditForm(f => ({ ...f, name: v }))} />
              <Select label="Category" options={['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Organic']} value={editForm.category} onChange={v => setEditForm(f => ({ ...f, category: v }))} />
              <Input label="Quantity" value={editForm.qty} onChange={v => setEditForm(f => ({ ...f, qty: v }))} />
              <Input label="Price per kg (₹)" value={editForm.price} onChange={v => setEditForm(f => ({ ...f, price: v }))} />
              <Select label="Quality Grade" options={['Grade A', 'Grade B', 'Grade C', 'Organic']} value={editForm.quality} onChange={v => setEditForm(f => ({ ...f, quality: v }))} />
              <Select label="Unit" options={['kg', 'quintal', 'ton', 'dozen']} value={editForm.unit} onChange={v => setEditForm(f => ({ ...f, unit: v }))} />
              <Input label="Harvest Date" type="date" value={editForm.harvest} onChange={v => setEditForm(f => ({ ...f, harvest: v }))} />
              <Input label="Location" value={editForm.location} onChange={v => setEditForm(f => ({ ...f, location: v }))} />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Product Image</label>
              <input ref={editFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleEditImage} />
              <div onClick={() => editFileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#2E7D32]/50 transition cursor-pointer">
                {editImagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={editImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl" />
                    <p className="text-xs text-[#2E7D32] font-medium">Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl mb-1">📷</div>
                    <p className="text-xs text-gray-500">Click to upload</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Btn full onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? 'Saving...' : 'Save Changes'}
              </Btn>
              <Btn variant="outline" onClick={() => setEditProduct(null)} disabled={editSaving}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <Btn full variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Btn>
              <Btn full variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
