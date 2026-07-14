import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRESETS, INITIAL_PRODUCTS, MOCK_USERS, INITIAL_REVIEWS } from '../mockData';
import { TRANSLATIONS, CURRENCY_RATES, CATEGORY_MAPPING } from '../i18n';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  runTransaction 
} from 'firebase/firestore';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Check if we are running in the browser
  const isBrowser = typeof window !== 'undefined';

  // Load from localStorage or defaults
  const getLocalStorage = (key, defaultValue) => {
    if (!isBrowser) return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
  };

  const saveLocalStorage = (key, value) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  // State Declarations
  const [activeThemeId, setActiveThemeId] = useState(() => getLocalStorage('activeThemeId', 'tech'));
  const [reviews, setReviews] = useState(() => getLocalStorage('reviews', INITIAL_REVIEWS));
  const [language, setLanguage] = useState(() => getLocalStorage('language', 'es'));

  useEffect(() => {
    saveLocalStorage('language', language);
  }, [language]);

  const t = (key, replacements = {}) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.es;
    let text = langDict[key] || TRANSLATIONS.es[key] || key;
    
    Object.keys(replacements).forEach((placeholder) => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return text;
  };

  const convertPrice = (priceInUSD) => {
    const rate = CURRENCY_RATES[currency] || 1.0;
    return priceInUSD * rate;
  };

  const formatPrice = (priceInUSD) => {
    const rate = CURRENCY_RATES[currency] || 1.0;
    const converted = priceInUSD * rate;
    if (currency === 'CLP$') {
      return `${currency}${Math.round(converted).toLocaleString(language === 'es' ? 'es-CL' : 'en-US')}`;
    }
    return `${currency}${converted.toFixed(2)}`;
  };

  const translateCategory = (cat) => {
    return CATEGORY_MAPPING[cat]?.[language] || cat;
  };
  const [storeName, setStoreName] = useState(() => getLocalStorage('storeName', ''));
  const [storeSlogan, setStoreSlogan] = useState(() => getLocalStorage('storeSlogan', ''));
  const [customHeroImage, setCustomHeroImage] = useState(() => getLocalStorage('customHeroImage', ''));
  const [customHeroDescription, setCustomHeroDescription] = useState(() => getLocalStorage('customHeroDescription', ''));
  const [promoBarEnabled, setPromoBarEnabled] = useState(() => getLocalStorage('promoBarEnabled', true));
  const [promoBarText, setPromoBarText] = useState(() => getLocalStorage('promoBarText', ''));
  const [promoBarColor, setPromoBarColor] = useState(() => getLocalStorage('promoBarColor', 'bg-amber-500 text-slate-950'));
  const [customColors, setCustomColors] = useState(() => getLocalStorage('customColors', null));
  const [products, setProducts] = useState(() => getLocalStorage('products', INITIAL_PRODUCTS));
  const [cart, setCart] = useState(() => getLocalStorage('cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(() => getLocalStorage('isAdminMode', false));
  const [currency, setCurrency] = useState(() => getLocalStorage('currency', '$'));
  const [contactEmail, setContactEmail] = useState(() => getLocalStorage('contactEmail', 'hello@flexcommerce.com'));
  const [orders, setOrders] = useState(() => getLocalStorage('orders', []));
  const [analytics, setAnalytics] = useState(() => getLocalStorage('analytics', {
    views: 1240,
    salesCount: 8,
    revenue: 1420.50
  }));
  const [currentUser, setCurrentUser] = useState(() => getLocalStorage('currentUser', null));
  const [users, setUsers] = useState(() => getLocalStorage('users', MOCK_USERS));
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState(() => getLocalStorage('wishlist', []));
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [coupons, setCoupons] = useState(() => getLocalStorage('coupons', [
    { id: 'c1', code: 'DESCUENTO10', type: 'percent', value: 10, isActive: true, minPurchase: 0 },
    { id: 'c2', code: 'REGALO15', type: 'fixed', value: 15, isActive: true, minPurchase: 50 },
    { id: 'c3', code: 'ENVIOFREE', type: 'shipping', value: 0, isActive: true, minPurchase: 30 }
  ]));

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Resolve current active theme settings
  const currentTheme = PRESETS[activeThemeId] || PRESETS.tech;
  const resolvedStoreName = storeName || currentTheme.name;
  const resolvedStoreSlogan = storeSlogan || currentTheme.slogan;

  // Persist Local States
  useEffect(() => {
    saveLocalStorage('activeThemeId', activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    saveLocalStorage('storeName', storeName);
  }, [storeName]);

  useEffect(() => {
    saveLocalStorage('storeSlogan', storeSlogan);
  }, [storeSlogan]);

  useEffect(() => {
    saveLocalStorage('customHeroImage', customHeroImage);
  }, [customHeroImage]);

  useEffect(() => {
    saveLocalStorage('customHeroDescription', customHeroDescription);
  }, [customHeroDescription]);

  useEffect(() => {
    saveLocalStorage('promoBarEnabled', promoBarEnabled);
  }, [promoBarEnabled]);

  useEffect(() => {
    saveLocalStorage('promoBarText', promoBarText);
  }, [promoBarText]);

  useEffect(() => {
    saveLocalStorage('promoBarColor', promoBarColor);
  }, [promoBarColor]);

  useEffect(() => {
    saveLocalStorage('customColors', customColors);
  }, [customColors]);

  useEffect(() => {
    saveLocalStorage('cart', cart);
  }, [cart]);

  useEffect(() => {
    saveLocalStorage('isAdminMode', isAdminMode);
  }, [isAdminMode]);

  useEffect(() => {
    saveLocalStorage('currency', currency);
  }, [currency]);

  useEffect(() => {
    saveLocalStorage('contactEmail', contactEmail);
  }, [contactEmail]);

  // Syncing with Firebase if configured
  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('currentUser', currentUser);
    }
  }, [currentUser, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('users', users);
    }
  }, [users, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('products', products);
    }
  }, [products, isFirebaseConfigured]);

  // Migration to seed missing default products for returning users (due to cached localStorage)
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const loadedIds = new Set(products.map(p => p.id));
      const missingProducts = INITIAL_PRODUCTS.filter(p => !loadedIds.has(p.id));
      if (missingProducts.length > 0) {
        console.log("Seeding missing default products to local state:", missingProducts.map(p => p.name));
        setProducts(prev => [...prev, ...missingProducts]);
      }
    }
  }, [isFirebaseConfigured, products]);

  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser) {
      saveLocalStorage('wishlist', wishlist);
    }
  }, [wishlist, currentUser, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('orders', orders);
    }
  }, [orders, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('analytics', analytics);
    }
  }, [analytics, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('coupons', coupons);
    }
  }, [coupons, isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      saveLocalStorage('reviews', reviews);
    }
  }, [reviews, isFirebaseConfigured]);

  // Firebase Real-time listeners
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Session Auth change listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
            setWishlist(userData.wishlist || []);
          } else {
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Usuario Firebase',
              role: 'customer'
            });
            setWishlist([]);
          }
        } catch (err) {
          console.error("Error fetching user profile from Firestore:", err);
        }
      } else {
        setCurrentUser(null);
        // Fallback to local storage wishlist when logged out
        setWishlist(getLocalStorage('wishlist', []));
      }
    });

    // 2. Real-time Products Sync
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), async (snapshot) => {
      if (snapshot.empty) {
        // Initial DB Seed
        console.log("Seeding initial products to Firestore...");
        try {
          for (const prod of INITIAL_PRODUCTS) {
            await addDoc(collection(db, 'products'), prod);
          }
        } catch (err) {
          console.error("Error seeding products:", err);
        }
      } else {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
        
        // Seed any missing default products to Firestore dynamically
        const existingIds = new Set(list.map(p => p.id));
        const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
        if (missing.length > 0) {
          console.log(`Seeding ${missing.length} missing default products to Firestore...`);
          try {
            for (const p of missing) {
              await setDoc(doc(db, 'products', p.id), p);
            }
          } catch (err) {
            console.error("Error seeding missing products to Firestore:", err);
          }
        }
      }
    });

    // 3. Real-time Analytics Sync
    const unsubscribeAnalytics = onSnapshot(doc(db, 'analytics', 'global'), async (snapshot) => {
      if (snapshot.exists()) {
        setAnalytics(snapshot.data());
      } else {
        try {
          await setDoc(doc(db, 'analytics', 'global'), {
            views: 1240,
            salesCount: 8,
            revenue: 1420.50
          });
        } catch (err) {
          console.error("Error initializing analytics:", err);
        }
      }
    });

    // 4. Real-time Orders Sync
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setOrders(list);
    });

    // 5. Real-time Coupons Sync
    const unsubscribeCoupons = onSnapshot(collection(db, 'coupons'), async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding default coupons to Firestore...");
        try {
          const defaultCoupons = [
            { code: 'DESCUENTO10', type: 'percent', value: 10, isActive: true, minPurchase: 0 },
            { code: 'REGALO15', type: 'fixed', value: 15, isActive: true, minPurchase: 50 },
            { code: 'ENVIOFREE', type: 'shipping', value: 0, isActive: true, minPurchase: 30 }
          ];
          for (const c of defaultCoupons) {
            await addDoc(collection(db, 'coupons'), c);
          }
        } catch (err) {
          console.error("Error seeding coupons:", err);
        }
      } else {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCoupons(list);
      }
    });

    // 6. Real-time Reviews Sync
    const unsubscribeReviews = onSnapshot(collection(db, 'reviews'), async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding default reviews to Firestore...");
        try {
          for (const r of INITIAL_REVIEWS) {
            await addDoc(collection(db, 'reviews'), r);
          }
        } catch (err) {
          console.error("Error seeding reviews:", err);
        }
      } else {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setReviews(list);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeAnalytics();
      unsubscribeOrders();
      unsubscribeCoupons();
      unsubscribeReviews();
    };
  }, [isFirebaseConfigured]);

  // Actions
  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      // Fallback
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (foundUser) {
        setCurrentUser(foundUser);
        if (foundUser.role !== 'admin') {
          setIsAdminMode(false);
        }
        showToast(t('welcome_back', { name: foundUser.name }), 'success');
        return { success: true };
      }
      return { success: false, error: language === 'es' ? 'Correo o contraseña incorrectos (Modo Demo).' : 'Incorrect email or password (Demo Mode).' };
    }

    const translateFirebaseError = (err) => {
      const code = err?.code || "";
      if (language === 'en') {
        switch (code) {
          case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
          case 'auth/email-already-in-use':
            return 'This email address is already in use.';
          case 'auth/invalid-email':
            return 'Invalid email address.';
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            return 'Incorrect email or password.';
          case 'auth/too-many-requests':
            return 'Too many failed attempts. Account temporarily locked.';
          default:
            return err.message || 'An unexpected error occurred.';
        }
      }
      switch (code) {
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está en uso por otra cuenta.';
        case 'auth/invalid-email':
          return 'El correo electrónico ingresado no es válido.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Correo o contraseña incorrectos.';
        case 'auth/too-many-requests':
          return 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.';
        default:
          return err.message || 'Ocurrió un error inesperado al conectar con el servidor.';
      }
    };

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      let welcomeName = email;
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          welcomeName = userDoc.data().name;
        }
      } catch (e) {
        console.error("Error fetching profile name for login toast:", e);
      }
      showToast(t('welcome_back', { name: welcomeName }), 'success');
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: translateFirebaseError(err) };
    }
  };

  const register = async (name, email, password, role) => {
    const translateFirebaseError = (err) => {
      const code = err?.code || "";
      if (language === 'en') {
        switch (code) {
          case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
          case 'auth/email-already-in-use':
            return 'This email address is already in use.';
          case 'auth/invalid-email':
            return 'Invalid email address.';
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            return 'Incorrect email or password.';
          case 'auth/too-many-requests':
            return 'Too many failed attempts. Account temporarily locked.';
          default:
            return err.message || 'An unexpected error occurred.';
        }
      }
      switch (code) {
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está en uso por otra cuenta.';
        case 'auth/invalid-email':
          return 'El correo electrónico ingresado no es válido.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Correo o contraseña incorrectos.';
        case 'auth/too-many-requests':
          return 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.';
        default:
          return err.message || 'Ocurrió un error inesperado al conectar con el servidor.';
      }
    };

    if (!isFirebaseConfigured) {
      // Fallback
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: language === 'es' ? 'El correo ya está registrado (Modo Demo).' : 'Email already registered (Demo Mode).' };
      }
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      if (role !== 'admin') {
        setIsAdminMode(false);
      }
      showToast(language === 'es' ? '¡Cuenta registrada (Modo Demo)!' : 'Account registered (Demo Mode)!', 'success');
      return { success: true };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Save profile under users collection
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        role
      });
      
      showToast(language === 'es' ? '¡Cuenta registrada e inicio de sesión completado!' : 'Account registered and logged in successfully!', 'success');
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: translateFirebaseError(err) };
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setCurrentUser(null);
      setIsAdminMode(false);
      showToast(language === 'es' ? 'Sesión cerrada correctamente (Modo Demo).' : 'Logged out successfully (Demo Mode).', 'info');
      return;
    }

    try {
      await signOut(auth);
      setIsAdminMode(false);
      showToast(language === 'es' ? 'Sesión cerrada correctamente.' : 'Logged out successfully.', 'info');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const updateUserProfile = async (profileUpdates) => {
    if (!currentUser) return { success: false, error: 'Usuario no autenticado' };

    const updatedUser = {
      ...currentUser,
      ...profileUpdates
    };
    setCurrentUser(updatedUser);

    if (!isFirebaseConfigured) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      showToast(t('profile_updated'), 'success');
      return { success: true };
    }

    try {
      const { id, email, ...dbPayload } = updatedUser;
      await setDoc(doc(db, 'users', currentUser.id), dbPayload, { merge: true });
      showToast(language === 'es' ? 'Perfil guardado en la nube.' : 'Profile saved in the cloud.', 'success');
      return { success: true };
    } catch (err) {
      console.error("Error updating profile in Firestore:", err);
      showToast(language === 'es' ? 'Error al guardar el perfil.' : 'Error saving profile.', 'error');
      return { success: false, error: err.message };
    }
  };

  const switchTheme = (themeId) => {
    if (PRESETS[themeId]) {
      setActiveThemeId(themeId);
      // Reset slogan and name if they were empty or matched previous default
      setStoreName("");
      setStoreSlogan("");
    }
  };

  const toggleWishlist = async (product) => {
    const isFav = wishlist.includes(product.id);
    let updatedList;
    if (isFav) {
      updatedList = wishlist.filter(id => id !== product.id);
      showToast(t('wishlist_removed', { name: product.name }), 'info');
    } else {
      updatedList = [...wishlist, product.id];
      showToast(t('wishlist_added', { name: product.name }), 'success');
    }
    setWishlist(updatedList);
    
    if (!isFirebaseConfigured || !currentUser) {
      saveLocalStorage('wishlist', updatedList);
      return;
    }

    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        wishlist: updatedList
      }, { merge: true });
    } catch (err) {
      console.error("Error updating wishlist in Firestore:", err);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const qty = Math.floor(Number(quantity));
    if (isNaN(qty) || qty <= 0) return;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
    setIsCartOpen(true);
    showToast(t('product_added', { name: product.name }), 'success');
  };

  const updateCartQty = (productId, quantity) => {
    const qty = Math.floor(Number(quantity));
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Product CRUD
  const addProduct = async (newProduct) => {
    const productPayload = {
      ...newProduct,
      rating: 5.0,
      theme: activeThemeId
    };

    if (!isFirebaseConfigured) {
      const productWithId = {
        ...productPayload,
        id: `${activeThemeId}-${Date.now()}`
      };
      setProducts((prev) => [productWithId, ...prev]);
      return;
    }

    try {
      await addDoc(collection(db, 'products'), productPayload);
    } catch (err) {
      console.error("Error adding product to Firestore:", err);
    }
  };

  const editProduct = async (updatedProduct) => {
    if (!isFirebaseConfigured) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      return;
    }

    try {
      const { id, ...payload } = updatedProduct;
      await setDoc(doc(db, 'products', id), payload);
    } catch (err) {
      console.error("Error editing product in Firestore:", err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!isFirebaseConfigured) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      removeFromCart(productId);
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      removeFromCart(productId);
    } catch (err) {
      console.error("Error deleting product from Firestore:", err);
    }
  };

  const addReview = async (productId, rating, comment) => {
    const name = currentUser ? currentUser.name : (language === 'es' ? 'Invitado' : 'Guest');
    const email = currentUser ? currentUser.email : 'guest@flexcommerce.com';
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userName: name,
      userEmail: email,
      rating: parseInt(rating) || 5,
      comment: comment.trim(),
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...reviews, newReview];
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    setReviews(updatedReviews);
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === productId ? { ...p, rating: avgRating } : p)
    );

    showToast(t('review_submitted'), 'success');

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'reviews'), newReview);
        await setDoc(doc(db, 'products', productId), { rating: avgRating }, { merge: true });
      } catch (err) {
        console.error("Error saving review to Firestore:", err);
      }
    }
  };

  const deleteReview = async (reviewId) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) return;

    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);

    const productId = reviewToDelete.productId;
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const avgRating = productReviews.length > 0 
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
      : 5.0;

    setProducts(prevProducts => 
      prevProducts.map(p => p.id === productId ? { ...p, rating: avgRating } : p)
    );

    showToast(language === 'es' ? 'Reseña eliminada.' : 'Review deleted.', 'info');

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        await setDoc(doc(db, 'products', productId), { rating: avgRating }, { merge: true });
      } catch (err) {
        console.error("Error deleting review from Firestore:", err);
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(t('status_updated') || 'Estado de pedido actualizado.', 'success');

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
      } catch (err) {
        console.error("Error updating order status in Firestore:", err);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(language === 'es' ? 'Pedido eliminado.' : 'Order deleted.', 'info');

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (err) {
        console.error("Error deleting order from Firestore:", err);
      }
    }
  };

  const addCoupon = async (newCoupon) => {
    const couponPayload = {
      code: newCoupon.code.toUpperCase().trim(),
      type: newCoupon.type,
      value: parseFloat(newCoupon.value) || 0,
      minPurchase: parseFloat(newCoupon.minPurchase) || 0,
      isActive: true
    };

    if (!isFirebaseConfigured) {
      const couponWithId = {
        ...couponPayload,
        id: `coupon-${Date.now()}`
      };
      setCoupons((prev) => [couponWithId, ...prev]);
      showToast('Cupón creado (Modo Demo).', 'success');
      return;
    }

    try {
      await addDoc(collection(db, 'coupons'), couponPayload);
      showToast('Cupón guardado en la nube.', 'success');
    } catch (err) {
      console.error("Error adding coupon to Firestore:", err);
      showToast('Error al guardar el cupón.', 'error');
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!isFirebaseConfigured) {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      showToast('Cupón eliminado (Modo Demo).', 'info');
      return;
    }

    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      showToast('Cupón eliminado de la nube.', 'info');
    } catch (err) {
      console.error("Error deleting coupon from Firestore:", err);
      showToast('Error al eliminar el cupón.', 'error');
    }
  };

  // Checkout and order simulation
  const placeOrder = async (customerData, orderTotalOverride) => {
    const finalTotal = orderTotalOverride !== undefined ? orderTotalOverride : cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder = {
      userId: currentUser ? currentUser.id : 'guest',
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: finalTotal,
      customer: customerData,
      status: 'Procesado'
    };

    if (!isFirebaseConfigured) {
      const offlineOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        ...newOrder
      };
      setOrders((prev) => [offlineOrder, ...prev]);
      setAnalytics((prev) => ({
        views: prev.views + 1,
        salesCount: prev.salesCount + 1,
        revenue: prev.revenue + finalTotal
      }));
      clearCart();
      return offlineOrder;
    }

    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      const analyticsRef = doc(db, 'analytics', 'global');
      await runTransaction(db, async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsRef);
        if (analyticsDoc.exists()) {
          const data = analyticsDoc.data();
          transaction.update(analyticsRef, {
            views: (data.views || 0) + 1,
            salesCount: (data.salesCount || 0) + 1,
            revenue: (data.revenue || 0) + finalTotal
          });
        }
      });
      clearCart();
      return { id: docRef.id, ...newOrder };
    } catch (err) {
      console.error("Error placing order in Firestore:", err);
      return null;
    }
  };

  const addView = async () => {
    if (!isFirebaseConfigured) {
      setAnalytics((prev) => ({
        ...prev,
        views: prev.views + 1
      }));
      return;
    }

    try {
      const analyticsRef = doc(db, 'analytics', 'global');
      await runTransaction(db, async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsRef);
        if (analyticsDoc.exists()) {
          const data = analyticsDoc.data();
          transaction.update(analyticsRef, {
            views: (data.views || 0) + 1
          });
        }
      });
    } catch (err) {
      console.error("Error incrementing views in Firestore:", err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        activeThemeId,
        currentTheme,
        storeName: resolvedStoreName,
        storeSlogan: resolvedStoreSlogan,
        setStoreName,
        setStoreSlogan,
        customColors,
        setCustomColors,
        products,
        setProducts,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isAdminMode,
        setIsAdminMode,
        currency,
        setCurrency,
        contactEmail,
        setContactEmail,
        orders,
        placeOrder,
        analytics,
        addView,
        switchTheme,
        addProduct,
        editProduct,
        deleteProduct,
        currentUser,
        users,
        isAuthOpen,
        setIsAuthOpen,
        login,
        register,
        logout,
        toast,
        setToast,
        showToast,
        wishlist,
        setWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isProfileOpen,
        setIsProfileOpen,
        updateUserProfile,
        coupons,
        addCoupon,
        deleteCoupon,
        language,
        setLanguage,
        t,
        convertPrice,
        formatPrice,
        translateCategory,
        reviews,
        addReview,
        deleteReview,
        updateOrderStatus,
        deleteOrder,
        customHeroImage,
        setCustomHeroImage,
        customHeroDescription,
        setCustomHeroDescription,
        promoBarEnabled,
        setPromoBarEnabled,
        promoBarText,
        setPromoBarText,
        promoBarColor,
        setPromoBarColor
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
