import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: categoryId || searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || '',
        sort: searchParams.get('sort') || 'newest',
        featured: searchParams.get('featured') || '',
        page: parseInt(searchParams.get('page')) || 1
    });

    useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => { }); }, []);

    useEffect(() => {
        if (categoryId) setFilters(f => ({ ...f, category: categoryId, page: 1 }));
    }, [categoryId]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filters.category) params.category = filters.category;
                if (filters.brand) params.brand = filters.brand;
                if (filters.minPrice) params.minPrice = filters.minPrice;
                if (filters.maxPrice) params.maxPrice = filters.maxPrice;
                if (filters.rating) params.rating = filters.rating;
                if (filters.featured) params.featured = filters.featured;
                params.sort = filters.sort;
                params.page = filters.page;
                params.limit = 20;

                const res = await productAPI.getAll(params);
                setProducts(res.data.products || []);
                setPagination(res.data.pagination || {});
                setBrands(res.data.filters?.brands || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchProducts();
    }, [filters]);

    const updateFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));

    return (
        <div className="products-page">
            <aside className="filters-sidebar">
                <div className="filter-group">
                    <h4>Category</h4>
                    <label><input type="radio" name="cat" checked={!filters.category} onChange={() => updateFilter('category', '')} /> All Categories</label>
                    {categories.map(c => (
                        <label key={c.id}><input type="radio" name="cat" checked={filters.category == c.id} onChange={() => updateFilter('category', c.id)} /> {c.name}</label>
                    ))}
                </div>
                <div className="filter-group">
                    <h4>Price</h4>
                    <div className="filter-range">
                        <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                        <span>—</span>
                        <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
                    </div>
                </div>
                <div className="filter-group">
                    <h4>Customer Rating</h4>
                    {[4, 3, 2, 1].map(r => (
                        <label key={r}><input type="radio" name="rating" checked={filters.rating == r} onChange={() => updateFilter('rating', r)} /> {r}★ & Up</label>
                    ))}
                    <label><input type="radio" name="rating" checked={!filters.rating} onChange={() => updateFilter('rating', '')} /> All</label>
                </div>
                {brands.length > 0 && (
                    <div className="filter-group">
                        <h4>Brand</h4>
                        <label><input type="radio" name="brand" checked={!filters.brand} onChange={() => updateFilter('brand', '')} /> All Brands</label>
                        {brands.map(b => (
                            <label key={b}><input type="radio" name="brand" checked={filters.brand === b} onChange={() => updateFilter('brand', b)} /> {b}</label>
                        ))}
                    </div>
                )}
            </aside>

            <div className="products-main">
                <div className="products-header">
                    <span className="results-count">{pagination.total || 0} results</span>
                    <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                        <option value="bestselling">Best Selling</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : products.length === 0 ? (
                    <div className="empty-state"><h2>No products found</h2><p>Try adjusting your filters</p></div>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>Previous</button>
                                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                                    const pn = i + 1;
                                    return <button key={pn} className={filters.page === pn ? 'active' : ''} onClick={() => setFilters(f => ({ ...f, page: pn }))}>{pn}</button>;
                                })}
                                <button disabled={filters.page >= pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductList;
