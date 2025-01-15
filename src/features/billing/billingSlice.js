import { createSlice } from "@reduxjs/toolkit";
import {
  mockInvoices,
  mockBillingSummary,
  mockPlanDetails,
  mockInvoiceDetails,
  mockPaymentDetails,
  mockTransactions,
} from "../../api/mockData";

const initialState = {
  invoices: mockInvoices,
  billingSummary: mockBillingSummary,
  planDetails: mockPlanDetails,
  invoiceDetails: mockInvoiceDetails,
  paymentDetails: mockPaymentDetails,
  transactions: mockTransactions,
};

export const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // Add reducers here if needed
  },
});

export default billingSlice.reducer;
