interface TotalStampProps {
  total: number;
  count: number;
  formatCurrency: (amount: number) => string;
}

export function TotalStamp({ total, count, formatCurrency }: TotalStampProps) {
  return (
    <div className="total-stamp">
      <div className="total-stamp-inner">
        <svg className="total-stamp-flourish top-left" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2 2C2 8 8 14 14 14C8 14 2 20 2 20" />
        </svg>
        <svg className="total-stamp-flourish top-right" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M22 2C22 8 16 14 10 14C16 14 22 20 22 20" />
        </svg>
        <svg className="total-stamp-flourish bottom-left" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2 22C2 16 8 10 14 10C8 10 2 4 2 4" />
        </svg>
        <svg className="total-stamp-flourish bottom-right" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M22 22C22 16 16 10 10 10C16 10 22 4 22 4" />
        </svg>
        <div className="total-stamp-content">
          <span className="total-stamp-label">Total:</span>
          <span className="total-stamp-amount">{formatCurrency(total)}</span>
          <span className="total-stamp-count">
            {count} {count === 1 ? "depósito" : "depósitos"}
          </span>
        </div>
      </div>
    </div>
  );
}