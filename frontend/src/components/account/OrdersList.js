import React from 'react';

/**
 * OrdersList \u2014 professional order history display sourced from Shopify.
 *
 * Data is normalized to the legacy `order` shape in `services/api.js`
 * (`shopifyOrderToLegacyOrder`) which surfaces:
 *   order_id, order_number, order_name, created_at, status,
 *   fulfillment_status, total, subtotal, shipping, tax, currency,
 *   status_url, shipping_address, line_items (with product_name,
 *   quantity, price, image, handle).
 *
 * Payment card last-4 is NOT exposed by the Shopify Storefront API for
 * privacy reasons; we surface the financial status ("paid", "refunded",
 * "pending") which is the analogous shopper-visible data.
 */

const formatMoney = (n, currency = 'CAD') => {
  const val = Number(n || 0);
  try {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(val);
  } catch (_) {
    return `$${val.toFixed(2)}`;
  }
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (_) {
    return iso;
  }
};

const STATUS_MAP = {
  paid: { label: 'Paid', bg: '#E8F5E9', fg: '#2E7D32' },
  authorized: { label: 'Authorized', bg: '#E3F2FD', fg: '#1565C0' },
  pending: { label: 'Pending', bg: '#FFF3E0', fg: '#E65100' },
  partially_paid: { label: 'Partially Paid', bg: '#FFF3E0', fg: '#E65100' },
  refunded: { label: 'Refunded', bg: '#EDE7F6', fg: '#5E35B1' },
  partially_refunded: { label: 'Partially Refunded', bg: '#EDE7F6', fg: '#5E35B1' },
  voided: { label: 'Voided', bg: '#ECEFF1', fg: '#455A64' },
  confirmed: { label: 'Confirmed', bg: '#E8F5E9', fg: '#2E7D32' },
};

const FULFILL_MAP = {
  fulfilled: { label: 'Shipped', bg: '#E8F5E9', fg: '#2E7D32' },
  partial: { label: 'Partial', bg: '#FFF3E0', fg: '#E65100' },
  unfulfilled: { label: 'Processing', bg: '#FFF3E0', fg: '#E65100' },
  restocked: { label: 'Restocked', bg: '#ECEFF1', fg: '#455A64' },
};

const StatusPill = ({ status, map }) => {
  const meta = map[(status || '').toLowerCase()] || { label: status || 'Unknown', bg: '#ECEFF1', fg: '#455A64' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      background: meta.bg,
      color: meta.fg,
    }}>{meta.label}</span>
  );
};

const OrderCard = ({ order }) => {
  const currency = order.currency || 'CAD';
  const shipName = order.shipping_address
    ? [order.shipping_address.firstName, order.shipping_address.lastName].filter(Boolean).join(' ')
    : null;

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7E6',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2B2B2B', marginBottom: '4px' }}>
            {order.order_name || `Order #${order.order_number || order.order_id}`}
          </div>
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span>Placed {formatDate(order.created_at)}</span>
            {shipName && <span>&bull; {shipName}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#c8102e', lineHeight: 1 }}>
            {formatMoney(order.total, currency)}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <StatusPill status={order.status} map={STATUS_MAP} />
            {order.fulfillment_status && <StatusPill status={order.fulfillment_status} map={FULFILL_MAP} />}
          </div>
        </div>
      </div>

      {/* Line items */}
      {order.line_items && order.line_items.length > 0 && (
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
          {order.line_items.map((li, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
              {li.image ? (
                <img
                  src={li.image}
                  alt={li.product_name}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#F5F1EB', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#2B2B2B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {li.product_name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Qty {li.quantity}</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#2B2B2B' }}>
                {formatMoney((li.price || 0) * (li.quantity || 1), currency)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Totals + shipping address footer */}
      <div style={{
        borderTop: '1px solid #F0F0F0',
        marginTop: '16px',
        paddingTop: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        <div style={{ fontSize: '13px', color: '#555' }}>
          {order.shipping_address && (
            <>
              <div style={{ fontWeight: 600, marginBottom: '4px', color: '#2B2B2B' }}>Ship to</div>
              <div>{order.shipping_address.address1}</div>
              {order.shipping_address.address2 && <div>{order.shipping_address.address2}</div>}
              <div>
                {[order.shipping_address.city, order.shipping_address.province, order.shipping_address.zip].filter(Boolean).join(', ')}
              </div>
              {order.shipping_address.country && <div>{order.shipping_address.country}</div>}
            </>
          )}
        </div>
        <div style={{ fontSize: '13px', color: '#555', textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>Subtotal</span><span>{formatMoney(order.subtotal, currency)}</span>
          </div>
          {order.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Shipping</span><span>{formatMoney(order.shipping, currency)}</span>
            </div>
          )}
          {order.tax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Tax</span><span>{formatMoney(order.tax, currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontWeight: 700, color: '#2B2B2B', marginTop: '4px' }}>
            <span>Total</span><span>{formatMoney(order.total, currency)}</span>
          </div>
        </div>
      </div>

      {/* Action row */}
      {order.status_url && (
        <div style={{ marginTop: '14px', textAlign: 'right' }}>
          <a
            href={order.status_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'transparent',
              border: '2px solid #c8102e',
              color: '#c8102e',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View Order Status
          </a>
        </div>
      )}
    </div>
  );
};

export const OrdersList = ({ orders, onManage: _onManage }) => {
  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>No orders yet</h3>
        <p style={{ color: '#666', marginBottom: '30px' }}>Start by building your first box!</p>
        <button
          className="btn-primary"
          onClick={() => { window.location.href = '/menu'; }}
          style={{ padding: '12px 24px', fontSize: '15px' }}
        >
          Order Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Order History</h3>
      {orders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          className="btn-primary"
          onClick={() => { window.location.href = '/menu'; }}
          style={{ padding: '10px 22px', fontSize: '14px' }}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};
