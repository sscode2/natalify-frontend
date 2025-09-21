import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get query parameters
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        
        // Fetch products based on filters
        const params = {
          limit: 12,
          ...(category && { category }),
          ...(search && { search })
        };
        
        const [productsResponse, featuredResponse] = await Promise.all([
          productService.getProducts(params),
          productService.getProducts({ featured: 'true', limit: 8 })
        ]);
        
        console.log('Products Response:', productsResponse);
        console.log('Featured Response:', featuredResponse);
        
        setProducts(productsResponse.data.products || []);
        setFeaturedProducts(featuredResponse.data.products || []);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isFiltered = searchParams.has('category') || searchParams.has('search');
  const pageTitle = searchParams.get('category') || 
                   (searchParams.get('search') ? `Search: ${searchParams.get('search')}` : null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - only show on home page */}
      {!isFiltered && <HeroSection />}
      
      {/* Category Section - only show on home page */}
      {!isFiltered && <CategorySection />}
      
      {/* Page Title for filtered results */}
      {isFiltered && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600 mt-2">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      )}
      
      {/* Featured Products Section - only show on home page */}
      {!isFiltered && featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Discover our handpicked selection of amazing products</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link 
                to="/?featured=true" 
                className="btn-secondary"
              >
                View All Featured Products
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* All Products Section */}
      <section className={`py-12 ${!isFiltered ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isFiltered && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">All Products</h2>
              <p className="text-lg text-gray-600">Browse our complete collection</p>
            </div>
          )}
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4v4H7V9h10z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {isFiltered 
                  ? 'Try adjusting your search or browse other categories.' 
                  : 'Products will appear here once they are added.'
                }
              </p>
              {isFiltered && (
                <Link to="/" className="btn-primary">
                  Browse All Products
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup - only show on home page */}
      {!isFiltered && (
        <section className="bg-primary-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-primary-100 mb-8">
              Get the latest deals and new product announcements delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;