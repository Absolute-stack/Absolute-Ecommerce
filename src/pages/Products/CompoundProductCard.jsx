export default function CompoundProductCard({ children }) {
  return <div>{children}</div>;
}

function CardLayout({ children }) {
  return <div className="card-layout">{children}</div>;
}

function CardImage({ src }) {
  return (
    <div className="card-image-container">
      <img
        src={src}
        alt={src}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

function CardTitle({ children }) {
  return <h2 className="card-title">{children}</h2>;
}

function CardPrice({ children }) {
  return <div className="card-price">{children}</div>;
}

function CardCategory({ children }) {
  return <div className="card-category">{children}</div>;
}

CompoundProductCard.cardImage = CardImage;
CompoundProductCard.cardTitle = CardTitle;
CompoundProductCard.cardPrice = CardPrice;
CompoundProductCard.cardLayout = CardLayout;
CompoundProductCard.cardCategory = CardCategory;
