import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const stars = [];
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        for (let i = 0; i < full; i++) stars.push(<FaStar key={i} />);
        if (half) stars.push(<FaStarHalfAlt key="half" />);
        while (stars.length < 5) stars.push(<FaRegStar key={`e${stars.length}`} />);
        return stars;
    };

    const price = Number(product.price);
    const originalPrice = Number(product.originalPrice || product.price);

    return (
        <div className="product-card">
            <img className="product-card-img" src={product.thumbnail || product.images?.[0] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="%23f0f0f0"><rect width="300" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">No Image</text></svg>'} alt={product.title} onClick={() => navigate(`/products/${product.id}`)} loading="lazy" />
            <div className="product-card-body">
                <div className="product-card-title" onClick={() => navigate(`/products/${product.id}`)}>{product.title}</div>
                <div className="product-card-rating">
                    <span className="stars">{renderStars(product.avgRating || product.avg_rating || 0)}</span>
                    <span className="rating-count">{(product.totalReviews || product.total_reviews || 0).toLocaleString()}</span>
                </div>
                <div className="product-card-price">
                    {product.discount > 0 && <span className="price-discount">-{product.discount}%</span>}
                    <span className="price-current"><span className="price-symbol">₹</span>{price.toLocaleString('en-IN')}</span>
                    {product.discount > 0 && <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>}
                </div>
                {product.freeDelivery || product.free_delivery ? (
                    <div className="product-card-delivery"><span className="free-delivery">FREE Delivery</span> by Amazon</div>
                ) : (
                    <div className="product-card-delivery">Delivery ₹40</div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
