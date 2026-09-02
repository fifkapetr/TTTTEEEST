/* eslint-disable vue/one-component-per-file */
import { defineComponent } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import {
  getLoans,
  updateLoanStatus,
  autoDecideLoan,
  deleteLoan,
} from "../src/services/loanService";
import type { LoanApplication } from "../src/types/loan";

vi.mock("../src/services/loanService", () => ({
  getLoans: vi.fn(),
  updateLoanStatus: vi.fn(),
  autoDecideLoan: vi.fn(),
  deleteLoan: vi.fn(),
}));

const LoanFormStub = defineComponent({
  emits: ["created"],
  template:
    '<button data-testid="form-created" @click="$emit(\'created\')">created</button>',
});

const LoanListStub = defineComponent({
  props: {
    loans: {
      type: Array,
      required: true,
    },
  },
  emits: ["approve", "reject", "autoDecide", "delete"],
  template: `
    <div>
      <span data-testid="list-size">{{ loans.length }}</span>
      <button data-testid="approve" @click="$emit('approve', 'loan-1')">approve</button>
      <button data-testid="reject" @click="$emit('reject', 'loan-1')">reject</button>
      <button data-testid="auto" @click="$emit('autoDecide', 'loan-1')">auto</button>
      <button data-testid="delete" @click="$emit('delete', 'loan-1')">delete</button>
    </div>
  `,
});

const LoanSummaryStub = defineComponent({
  props: {
    loans: {
      type: Array,
      required: true,
    },
  },
  template: '<span data-testid="summary-size">{{ loans.length }}</span>',
});

function createLoan(overrides: Partial<LoanApplication> = {}): LoanApplication {
  return {
    id: "loan-1",
    applicantName: "Applicant",
    amount: 10000,
    termMonths: 12,
    interestRate: 0.08,
    status: "pending",
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function mountApp() {
  return mount(App, {
    global: {
      stubs: {
        LoanForm: LoanFormStub,
        LoanList: LoanListStub,
        LoanSummary: LoanSummaryStub,
      },
    },
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads loans on mount and refreshes after child events", async () => {
    vi.mocked(getLoans)
      .mockReturnValueOnce([createLoan()])
      .mockReturnValueOnce([createLoan({ status: "approved" })])
      .mockReturnValueOnce([createLoan({ status: "rejected" })])
      .mockReturnValueOnce([createLoan({ status: "approved" })])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    const wrapper = mountApp();
    await Promise.resolve();
    expect(wrapper.get('[data-testid="summary-size"]').text()).toBe("1");

    await wrapper.get('[data-testid="approve"]').trigger("click");
    expect(updateLoanStatus).toHaveBeenCalledWith("loan-1", "approved");

    await wrapper.get('[data-testid="reject"]').trigger("click");
    expect(updateLoanStatus).toHaveBeenCalledWith("loan-1", "rejected");

    await wrapper.get('[data-testid="auto"]').trigger("click");
    expect(autoDecideLoan).toHaveBeenCalledWith("loan-1");

    await wrapper.get('[data-testid="delete"]').trigger("click");
    expect(deleteLoan).toHaveBeenCalledWith("loan-1");

    await wrapper.get('[data-testid="form-created"]').trigger("click");

    expect(getLoans).toHaveBeenCalledTimes(6);
    expect(wrapper.get('[data-testid="list-size"]').text()).toBe("0");
  });
});
