import { useState } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import Modal from '../../components/common/Modal/modal'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/formatters'

export default function Salary() {
  const { employee, period, setPeriod, periodLabel, dashboardData, dashboardLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const salary = dashboardData?.salary

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title="Salary Details"
        subtitle={employee.name}
        avatarUrl={employee.avatarUrl}
        period={periodLabel}
        onPeriodClick={() => setShowModal(true)}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedMonth={period.month}
        selectedYear={period.year}
        onConfirm={(month, year) => setPeriod({ month, year })}
      />

      {dashboardLoading ? (
        <div className="flex items-center justify-center h-64 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
        </div>
      ) : dashboardData && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
          {/* Hero */}
          
        </main>
      )}

      <BottomNav />
    </div>
  )
}
