import Link from "next/link";
import { ArrowLeft, MapPin, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { formatPrice, formatUnit, getPriceSummary } from "@/lib/format";
import type { Product } from "@/types/bazar";
import { MarketDataNotice } from "@/components/market-data-notice";

export function ProductDetail({ product }: { product: Product }) {
  const summary = getPriceSummary(product);
  const trend = product.change.dir;

  return (
    <section className="detail-page page-container">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} />
        সব পণ্য
      </Link>

      {product.isStale && <MarketDataNotice />}

      <div className="detail-overview">
        <div className="detail-product-symbol" aria-hidden="true">
          {product.image}
        </div>
        <div className="detail-product-copy">
          <div className="detail-tags">
            <span>{product.categoryIcon} {product.categoryNameBn}</span>
            <span>{formatUnit(product.unit)}</span>
          </div>
          <h1>{product.nameBn}</h1>
          <p>
            {product.nameBn} এর আজকের গড় দর{" "}
            <strong>{formatPrice(product.today)} টাকা</strong>। গতকালের তুলনায়
            বাজারে দাম{" "}
            {trend === "up"
              ? "বেড়েছে"
              : trend === "down"
                ? "কমেছে"
                : "অপরিবর্তিত রয়েছে"}
            ।
          </p>
          <span className={`detail-trend detail-trend-${trend}`}>
            {trend === "up" ? (
              <TrendingUp size={16} />
            ) : trend === "down" ? (
              <TrendingDown size={16} />
            ) : null}
            {trend === "flat"
              ? "দাম অপরিবর্তিত"
              : `${formatPrice(Math.abs(product.change.pct))}% ${
                  trend === "up" ? "দাম বেড়েছে" : "দাম কমেছে"
                }`}
          </span>
        </div>
        <div className="detail-current-price">
          <span>আজকের গড় দাম</span>
          <strong>
            {formatPrice(product.today)} <small>টাকা</small>
          </strong>
          <span>{formatUnit(product.unit)}</span>
        </div>
      </div>

      <div className="price-summary-grid">
        <article className="summary-card summary-min">
          <span className="summary-label">সর্বনিম্ন দাম</span>
          <strong>{formatPrice(summary.min)} <small>টাকা</small></strong>
          <span>বাজারে পাওয়া সর্বনিম্ন</span>
        </article>
        <article className="summary-card summary-average">
          <span className="summary-label">গড় দাম</span>
          <strong>{formatPrice(summary.average)} <small>টাকা</small></strong>
          <span>সকল বাজারের গড়</span>
        </article>
        <article className="summary-card summary-max">
          <span className="summary-label">সর্বোচ্চ দাম</span>
          <strong>{formatPrice(summary.max)} <small>টাকা</small></strong>
          <span>বাজারে পাওয়া সর্বোচ্চ</span>
        </article>
      </div>

      <div className="market-prices">
        <div className="market-section-heading">
          <div>
            <p className="section-eyebrow">এলাকাভিত্তিক দর</p>
            <h2>বাজারভিত্তিক আজকের দাম</h2>
            <p>আপনার কাছের বাজারে {product.nameBn} এর দাম যাচাই করুন।</p>
          </div>
          <span className="market-count">
            <MapPin size={15} />
            {product.markets.length.toLocaleString("bn-BD")} টি বাজার
          </span>
        </div>
        <div className="market-table-wrap">
          <table className="market-table">
            <thead>
              <tr>
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন</th>
                <th>সর্বোচ্চ</th>
                <th>দামের সীমা</th>
              </tr>
            </thead>
            <tbody>
              {product.markets.map((market) => (
                <tr key={`${market.market}-${market.division}`}>
                  <td>
                    <span className="market-name-icon">⌖</span>
                    {market.market}
                  </td>
                  <td>{market.division}</td>
                  <td>{formatPrice(market.min)} টাকা</td>
                  <td>{formatPrice(market.max)} টাকা</td>
                  <td>
                    <span className="market-range">
                      {formatPrice(market.min)}–{formatPrice(market.max)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link className="detail-return-link" href="/">
        আরও পণ্যের দাম দেখুন
        <MoveRight size={17} />
      </Link>
    </section>
  );
}
