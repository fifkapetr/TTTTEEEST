import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import type { LoanApplication } from '../src/types/loan'
import { calculateMonthlyPayment } from '../src/services/loanService'

vi.mock('../src/services/loanService', () => ({
  calculateMonthlyPayment: vi.fn()
}))

function createLoan(overrides: Partial<LoanApplication> = {}): LoanApplication {
  return {
    id: 'loan-1',
    applicantName: 'John Doe',
    amount: 10000,
    termMonths: 12,
    interestRate: 0.08,
    status: 'pending',
    createdAt: '2024-01-15T00:00:00.000Z',
    ...overrides
  }
}

describe('LoanList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(calculateMonthlyPayment).mockReturnValue(900)
  })

  it('shows empty state when no loans exist', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [] }
    })

    expect(wrapper.text()).toContain('No loan applications yet. Create one using the form.')
  })

  it('renders loan details and calculated monthly payment', () => {
    const loan = createLoan()
    const wrapper = mount(LoanList, {
      props: { loans: [loan] }
    })

    const formattedDate = new Date(loan.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('$10,000.00')
    expect(wrapper.text()).toContain('12 mo')
    expect(wrapper.text()).toContain('8.0%')
    expect(wrapper.text()).toContain('$900.00')
    expect(wrapper.text()).toContain(formattedDate)
    expect(calculateMonthlyPayment).toHaveBeenCalledWith(loan)
  })

  it('emits approve, reject, and autoDecide actions for pending loan', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [createLoan()] }
    })

    await wrapper.find('button[title="Approve"]').trigger('click')
    await wrapper.find('button[title="Reject"]').trigger('click')
    await wrapper.find('button[title="Auto-decide"]').trigger('click')

    expect(wrapper.emitted('approve')?.[0]).toEqual(['loan-1'])
    expect(wrapper.emitted('reject')?.[0]).toEqual(['loan-1'])
    expect(wrapper.emitted('autoDecide')?.[0]).toEqual(['loan-1'])
  })

  it('hides action buttons when loan is not pending', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [createLoan({ status: 'approved' })] }
    })

    expect(wrapper.find('button[title="Approve"]').exists()).toBe(false)
    expect(wrapper.find('button[title="Reject"]').exists()).toBe(false)
    expect(wrapper.find('button[title="Auto-decide"]').exists()).toBe(false)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
  })
})
