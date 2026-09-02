import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanForm from '../src/components/LoanForm.vue'
import { createLoanApplication } from '../src/services/loanService'

vi.mock('../src/services/loanService', () => ({
  createLoanApplication: vi.fn()
}))

describe('LoanForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation error when applicant name is missing', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Applicant name is required')
  })

  it('shows validation error when amount is missing or invalid', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Amount must be greater than 0')
  })

  it('creates loan and emits created event for valid input', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('  Jane Doe  ')
    await wrapper.find('#amount').setValue('50000')
    await wrapper.find('#termMonths').setValue('24')
    await wrapper.find('#interestRate').setValue('0.08')
    await wrapper.find('form').trigger('submit')

    expect(createLoanApplication).toHaveBeenCalledWith({
      applicantName: 'Jane Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08
    })
    expect(wrapper.emitted('created')).toBeTruthy()
    expect((wrapper.find('#applicantName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#amount').element as HTMLInputElement).value).toBe('')
  })

  it('shows service error when creation fails with Error', async () => {
    vi.mocked(createLoanApplication).mockImplementationOnce(() => {
      throw new Error('Create failed')
    })

    const wrapper = mount(LoanForm)
    await wrapper.find('#applicantName').setValue('Jane Doe')
    await wrapper.find('#amount').setValue('50000')
    await wrapper.find('#termMonths').setValue('24')
    await wrapper.find('#interestRate').setValue('0.08')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Create failed')
  })

})
