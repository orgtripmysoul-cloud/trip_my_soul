"use client";

import React from "react";

export default function TrekCancellation() {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Cancellation & Voucher Policy</h2>
      <div className="text-xs text-gray-650 leading-relaxed space-y-3 font-medium">
        <p>
          Cancellations requested <strong>30 days or more</strong> prior to the trek start date are eligible for a{" "}
          <strong>90% refund</strong> or a 100% voucher credit valid for 1 year.
        </p>
        <p>
          Cancellations between <strong>15 to 30 days</strong> are eligible for a <strong>50% refund</strong> or a 100%
          voucher credit.
        </p>
        <p>
          Cancellations requested <strong>less than 15 days</strong> prior to departure are{" "}
          <strong>not eligible for refunds or credits</strong>. Rations, permits, and guides are fully paid in advance by
          this point.
        </p>
      </div>
    </>
  );
}
