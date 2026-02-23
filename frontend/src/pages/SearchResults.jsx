import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ sort: 'relevance', page: 1 });
    const [loading, setLoading] = useState(true);
    const [availableFilters, setAvailableFilters] = useState({ brands: [], categories: [] });

    useEffect(() => {
        if (!query) return;
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await searchAPI.search({ q: query, ...filters });
                setProducts(res.data.products || []);
                setPagination(res.data.pagination || {});
                setAvailableFilters(res.data.filters || { brands: [], categories: [] });
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchResults();
    }, [query, filters]);

    return (
        <div className="products-page">
            <aside className="filters-sidebar">
                <h3 style={{ marginBottom: 16 }}>Filters</h3>
                {availableFilters.categories?.length > 0 && (
                    <div className="filter-group">
                        <h4>Category</h4>
                        {availableFilters.categories.map(c => c && <Link key={c.id} to={`/category/${c.id}`} style={{ display: 'block', padding: '4px 0', fontSize: '0.85rem' }}>{c.name}</Link>)}
                    </div>
                )}
                {availableFilters.brands?.length > 0 && (
                    <div className="filter-group">
                        <h4>Brand</h4>
                        {availableFilters.brands.map(b => <div key={b} style={{ padding: '4px 0', fontSize: '0.85rem' }}>{b}</div>)}
                    </div>
                )}
            </aside>

            <div className="products-main">
                <div className="products-header">
                    <span className="results-count">
                        {pagination.total || 0} results for "<strong>{query}</strong>"
                    </span>
                    <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value, page: 1 })}>
                        <option value="relevance">Relevance</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : products.length === 0 ? (
                    <div className="empty-state"><h2>No results found for "{query}"</h2><p>Try different keywords or browse categories</p><Link to="/products"><button className="btn btn-primary btn-lg">Browse All Products</button></Link></div>
                ) : (
                    <>
                        <div className="products-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</button>
                                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i + 1} className={filters.page === i + 1 ? 'active' : ''} onClick={() => setFilters({ ...filters, page: i + 1 })}>{i + 1}</button>)}
                                <button disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
