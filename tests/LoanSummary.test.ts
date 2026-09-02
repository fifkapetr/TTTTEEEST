import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanSummary from '../src/components/LoanSummary.vue'
import type { LoanApplication } from '../src/types/loan'

const loans: LoanApplication[] = [
  {
    id: '1',
    applicantName: 'A',
    amount: 10000,
    termMonths: 12,
    interestRate: 0.08,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    applicantName: 'B',
    amount: 30000,
    termMonths: 24,
    interestRate: 0.06,
    status: 'approved',
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    applicantName: 'C',
    amount: 20000,
    termMonths: 36,
    interestRate: 0.05,
    status: 'approved',
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    applicantName: 'D',
    amount: 50000,
    termMonths: 48,
    interestRate: 0.04,
    status: 'rejected',
    createdAt: '2024-01-04T00:00:00.000Z'
  }
]

describe('LoanSummary', () => {
  it('shows summary stats for all loan statuses and approved amount', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const values = wrapper.findAll('.stat-value').map(node => node.text())

    expect(values).toEqual(['4', '1', '2', '1', '$50,000'])
  })
})
