import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, Badge, VerifiedBadge } from '../../components/ui';
import { useBuyerProduct } from '../../hooks/useBuyerProducts';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [qty, setQty] = useState(1);
  const { product, loading, error } = useBuyerProduct(id);
  const { addToCart } = useCart();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleQtyChange = (newQty: number) => {
    if (!product) return;
    if (newQty < 1) {
      setValidationError("Quantity must be at least 1");
      setQty(1);
    } else if (newQty > product.quantity_kg) {
      setValidationError(`Maximum available quantity is ${product.quantity_kg} ${product.unit}`);
      setQty(product.quantity_kg);
    } else {
      setValidationError(null);
      setQty(newQty);
    }
  };

  if (loading) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-gray-500">Loading product...</div>
      </BuyerLayout>
    );
  }

  if (error || !product) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-red-500">{error || 'Product not found'}</div>
        <div className="text-center">
          <Btn onClick={() => navigate('/buyer/marketplace')}>Back to Marketplace</Btn>
        </div>
      </BuyerLayout>
    );
  }

  const total = qty * product.price_per_kg;

  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back to Marketplace</button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="h-80 bg-green-50 rounded-2xl overflow-hidden relative flex items-center justify-center text-6xl">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span>📦</span>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="active">Available</Badge>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {product.harvest_date && `Harvested ${new Date(product.harvest_date).toLocaleDateString()} · `}
                {product.location || 'Location not specified'}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl hover:bg-red-50 hover:text-red-500 transition">♡</button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-[#2E7D32]">₹{product.price_per_kg}/{product.unit}</span>
            {product.grade && <Badge variant="grade">Grade {product.grade}</Badge>}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Available</p>
              <p className="font-bold text-gray-900">{product.quantity_kg} {product.unit}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-bold text-gray-900">{product.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Quality</p>
              <p className="font-bold text-gray-900">{product.grade ? `Grade ${product.grade}` : 'N/A'}</p>
            </div>
          </div>

          {/* Farmer */}
          <Card className="p-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                {product.farmer?.avatar_url ? (
                  <img src={product.farmer.avatar_url} alt="Farmer" className="w-full h-full object-cover" />
                ) : (
                  <span>👨‍🌾</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{product.farmer?.full_name || 'Farmer'}</span>
                  {product.farmer?.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-xs text-gray-500">{product.location}</p>
              </div>
              <div className="text-right">
                <button onClick={() => navigate(`/buyer/farmer-profile/${product.farmer_id}`)} className="text-xs text-[#2E7D32] hover:underline block mt-1">View Profile</button>
              </div>
            </div>
          </Card>

          {validationError && (
            <p className="text-sm text-red-500 mb-4">{validationError}</p>
          )}

          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
              <button onClick={() => handleQtyChange(qty - 1)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-[#2E7D32] transition">−</button>
              <span className="w-16 text-center font-bold text-gray-900">{qty} {product.unit}</span>
              <button onClick={() => handleQtyChange(qty + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-[#2E7D32] transition">+</button>
            </div>
            <span className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">₹{total}</span></span>
          </div>

          <div className="flex gap-3">
            <Btn full size="lg" onClick={() => {
              addToCart(product, qty);
              alert('Added to cart!');
            }}>🛒 Add to Cart</Btn>
            <Btn variant="secondary" size="lg" onClick={() => {
              addToCart(product, qty);
              navigate('/buyer/cart');
            }}>Buy Now</Btn>
          </div>
        </div>
      </div>

      {/* Details sections */}
      {product.description && (
        <div className="mt-8 grid grid-cols-1 gap-4">
          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-2">About this Produce</h3>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </Card>
        </div>
      )}
    </BuyerLayout>
  );
}
