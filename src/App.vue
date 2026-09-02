<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { LoanApplication, LoanStatus } from "./types/loan";
import {
  getLoans,
  updateLoanStatus,
  autoDecideLoan,
  deleteLoan,
} from "./services/loanService";
import LoanForm from "./components/LoanForm.vue";
import LoanList from "./components/LoanList.vue";
import LoanSummary from "./components/LoanSummary.vue";

const loans = ref<LoanApplication[]>([]);
const statusFilter = ref<LoanStatus | "all">("all");

const filteredLoans = computed(() => {
  if (statusFilter.value === "all") return loans.value;
  return loans.value.filter((l) => l.status === statusFilter.value);
});

function refreshLoans() {
  loans.value = getLoans();
}

function handleApprove(id: string) {
  updateLoanStatus(id, "approved");
  refreshLoans();
}

function handleReject(id: string) {
  updateLoanStatus(id, "rejected");
  refreshLoans();
}

function handleAutoDecide(id: string) {
  autoDecideLoan(id);
  refreshLoans();
}

function handleDelete(id: string) {
  deleteLoan(id);
  refreshLoans();
}

onMounted(() => {
  refreshLoans();
});
</script>

<template>
  <div class="app">
    <header class="app-header">
      <img src="/tredgate-logo-original.png" alt="Tredgate Logo" class="logo" />
      <h1>Tredgate Loan</h1>
      <p class="tagline">Simple loan application management</p>
    </header>

    <main class="main-content">
      <LoanForm @created="refreshLoans" />
      <div class="right-panel">
        <LoanSummary :loans="loans" />
        <div class="filter-bar">
          <label for="status-filter">Filter by status:</label>
          <select id="status-filter" v-model="statusFilter">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <LoanList
          :loans="filteredLoans"
          @approve="handleApprove"
          @reject="handleReject"
          @auto-decide="handleAutoDecide"
          @delete="handleDelete"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 0.5rem;
}

.tagline {
  color: var(--tagline-color);
  margin-top: -0.5rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-bar label {
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-bar select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: var(--border-radius, 4px);
  background-color: var(--card-background, #fff);
  font-size: 0.9rem;
  cursor: pointer;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .main-content > :first-child {
    max-width: 100%;
    width: 100%;
  }
}
</style>
