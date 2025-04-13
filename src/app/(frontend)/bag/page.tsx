'use client';

import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore'; // Assuming this path is correct
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus, ShoppingCart, X } from 'lucide-react'; // Removed unused Check icon
import { Button } from '@/components/ui/button'; // Assuming this path is correct
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge'; // Assuming this path is correct
import { Separator } from '@/components/ui/separator'; // Assuming this path is correct

// --- Firebase Auth Imports ---
import { auth } from '@/firebaseConfig'; // Ensure this path is correct for your Firebase config
import { onAuthStateChanged, User } from 'firebase/auth';
// ---------------------------

interface CartItem {
  product: {
    id: string;
    name: string;
    image_url?: string;
  };
  size: string;
  quantity: number;
  price: number;
}

export default function BagPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCartStore();
  const router = useRouter();

  // --- State for Firebase User Authentication ---
  const [user, setUser] = useState<User | null>(null);
  // --------------------------------------------

  // --- Listen for Firebase Auth State Changes ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state based on login status
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []); // Run only once on component mount
  // -------------------------------------------

  // Calculate total price and item count
  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count: number, item: CartItem) => count + item.quantity, 0);

  // --- Checkout Handler with Authentication Check ---
  const handleCheckout = () => {
    // 1. Check if the user is logged in
    if (!user) {
      toast.warning('Төлбөр хийхийн тулд эхлээд нэвтэрнэ үү.', {
        style: { background: '#f97316', color: 'white', border: 'none', borderRadius: '12px' },
        duration: 3000,
      });
      // Redirect to the login page (adjust path if needed)
      router.push('/auth/login');
      return; // Prevent further execution
    }

    // 2. Check if the cart is empty (original check)
    if (cart.length === 0) {
      toast.warning('Таны сагс хоосон байна', {
        style: { background: '#f97316', color: 'white', border: 'none', borderRadius: '12px' },
        duration: 3000,
      });
      return; // Prevent further execution
    }

    // 3. If logged in and cart is not empty, proceed to payment
    router.push('/payment');
  };
  // -------------------------------------------------

  // Handler to remove an item from the cart
  const handleRemoveItem = (id: string, size: string) => {
    removeFromCart(id, size);
    toast.success('Бараа сагснаас хасагдлаа', {
      style: { background: '#22c55e', color: 'white', border: 'none', borderRadius: '12px' },
      duration: 2000,
    });
  };

  // Handler to clear the entire cart
  const handleClearCart = () => {
    clearCart();
    toast.success('Сагс цэвэрлэгдлээ', {
      style: { background: '#22c55e', color: 'white', border: 'none', borderRadius: '12px' },
      duration: 2000,
    });
  };

  // Handler to update item quantity
  const handleQuantityChange = (id: string, size: string, newQuantity: number) => {
    // If quantity is reduced to 0 or less, remove the item
    if (newQuantity < 1) {
      handleRemoveItem(id, size);
      return;
    }
    // Check if updateQuantity function exists in the store
    if (updateQuantity) {
      updateQuantity(id, size, newQuantity);
    } else {
      console.error('updateQuantity function is not available in cart store');
      toast.error('Тоо ширхэг шинэчилж чадсангүй', { // 'Failed to update quantity'
        style: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px' },
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Toast notifications container */}
      <Toaster position="bottom-right" className="z-[100]" />

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">Таны Сагс</h1>
            <Badge variant="secondary" className="bg-neutral-800 text-neutral-300 rounded-full px-3 py-1 text-sm">
              {itemCount} {itemCount === 1 ? 'бараа' : 'бараа'}
            </Badge>
          </div>
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-100 px-0 hover:bg-transparent"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
            Дэлгүүр рүү буцах
          </Button>
        </div>

        {/* Conditional Rendering: Empty Cart or Cart Items */}
        {cart.length === 0 ? (
          // --- Empty Cart View ---
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-12 text-center mt-10 flex flex-col items-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800/50 mb-6 border border-neutral-700">
              <ShoppingBag className="h-10 w-10 text-neutral-500" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-100 mb-3">Таны сагс хоосон байна</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg">
              Дэлгүүрт зочлоод хүссэн бүтээгдэхүүнээ сонгоно уу
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white hover:bg-neutral-100 text-black font-medium px-8 py-6 rounded-full">
                Дэлгүүр рүү буцах
              </Button>
            </Link>
          </div>
        ) : (
          // --- Cart Items and Summary View ---
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item: CartItem) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`} // Unique key for animation
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }} // Slide out effect
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex justify-between items-start p-5 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-md hover:shadow-neutral-700/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 sm:gap-6 flex-1">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 96px, 112px" // Optimize image loading
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-neutral-600">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col justify-between h-full flex-1 mt-1 space-y-2">
                        <h2 className="text-lg sm:text-xl font-medium text-neutral-100 leading-tight">
                          {item.product.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                           <Badge variant="secondary" className="bg-neutral-800 text-neutral-300 border-neutral-700 rounded-md px-2.5 py-0.5 text-xs">
                            Хэмжээ: {item.size}
                           </Badge>
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-neutral-700 rounded-full overflow-hidden h-8">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex items-center justify-center h-8 min-w-[32px] px-2 text-sm font-medium bg-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                         <p className="text-lg sm:text-xl font-semibold text-neutral-100 pt-1">
                            {(item.price * item.quantity).toLocaleString()}₮
                         </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id, item.size)}
                      className="p-2 rounded-full text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition-all flex-shrink-0 ml-2"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              {cart.length > 0 && (
                <div className="mt-6 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearCart}
                    className="bg-red-900/50 border border-red-700/50 text-red-300 hover:bg-red-900/80 hover:text-red-200 rounded-lg px-4 py-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Сагс цэвэрлэх
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-neutral-100">Захиалгын дэлгэрэнгүй</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-neutral-300">
                    <span>Барааны нийт дүн ({itemCount}):</span>
                    <span className="font-medium text-neutral-100">{total.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Хүргэлтийн төлбөр:</span>
                    <span className="font-medium text-neutral-100">0₮</span> {/* Placeholder */}
                  </div>
                   {/* Add other fees like taxes if applicable */}
                </div>

                <Separator className="bg-neutral-700/50 mb-6" />

                {/* Total Amount */}
                <div className="flex justify-between text-lg font-semibold mb-8 text-neutral-100">
                  <span>Нийт төлөх дүн:</span>
                  <span>{total.toLocaleString()}₮</span>
                </div>

                {/* Checkout Button - Uses modified handleCheckout */}
                <Button
                  size="lg"
                  className="w-full bg-white text-black hover:bg-neutral-100 rounded-full py-6 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  onClick={handleCheckout} // Calls the function with auth check
                  disabled={cart.length === 0} // Still disabled if cart is empty
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Төлбөр хийх
                </Button>
                {/* Optional: Add info text if user is not logged in */}
                {!user && cart.length > 0 && (
                   <p className="text-xs text-center text-neutral-400 mt-4">
                     Төлбөр хийхийн тулд эхлээд нэвтэрнэ үү.
                   </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}