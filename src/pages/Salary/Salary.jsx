import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'

export default function Salary() {
  const { employee, dashboardData, dashboardLoading } = useAuth()

  const salary = dashboardData?.salary

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title="Salary Details"
        subtitle={employee.name}
        avatarUrl={employee.avatarUrl}
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
