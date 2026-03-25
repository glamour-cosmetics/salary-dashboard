import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import Modal from '../../components/common/Modal/modal'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const CIRCLE_R = 70
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

export default function Dashboard() {
	const navigate = useNavigate()
	const { employee, period, setPeriod, periodLabel, dashboardData, dashboardLoading } = useAuth()
	const [showModal, setShowModal] = useState(false)
	const salary = dashboardData?.salary
	const kpi = dashboardData?.kpi
	const planPct = kpi?.planAchievement ?? 0
	const circleOffset = CIRCLE_CIRCUMFERENCE - (Math.min(planPct, 100) / 100) * CIRCLE_CIRCUMFERENCE

	return (
		<div className="min-h-screen bg-surface pb-32">
			<TopBar
				title="Dashboard"
				subtitle={employee?.name}
				avatarUrl={employee?.avatarUrl}
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
				<main className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
					{/* <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary p-8 text-white shadow-lg">
						<div className="relative z-10">
							<p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-on-primary-container/80 mb-2">Total Salary Breakdown</p>
							<div className="flex items-baseline gap-2">
								<span className="text-4xl font-extrabold tracking-tighter">{formatCurrency(salary.total, '')}</span>
								<span className="text-xl font-medium opacity-80 uppercase">{salary.currency}</span>
							</div>
							<div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
								<span className="material-symbols-outlined text-[16px]">verified</span>
								<span className="text-[12px] font-medium">Verified for {salary.period}</span>
							</div>
						</div>
						<div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
					</section> */}

					{/* Total salary hero */}
					<section className="space-y-2">
						<h2 className="text-[11px] uppercase tracking-widest font-semibold text-outline">Total Estimated Salary</h2>
						<div className="bg-gradient-to-br from-primary-container to-primary p-8 rounded-xl shadow-lg relative overflow-hidden">
							<div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
							<div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
								<div>
									<div className="flex items-baseline gap-2">
										<span className="text-3xl md:text-5xl font-extrabold text-white tracking-tighter">
											{formatCurrency(salary.total, '')}
										</span>
										<span className="text-lg md:text-2xl font-medium text-on-primary-container">{salary.currency}</span>
									</div>
									<p className="text-on-primary-container/80 text-sm mt-1 font-medium">Estimated payout for current performance</p>
								</div>
								<div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10 inline-flex items-center gap-2 self-start md:self-auto">
									{/* <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span> */}
									<span className="text-white text-xs font-bold">{salary.trend}</span>
								</div>
							</div>
						</div>
					</section>


					{/* Plan achievement + KPI quick stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<section className="bg-surface-container-lowest p-6 rounded-xl space-y-6">
							<div className="flex justify-between items-center">
								<h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Plan Achievement</h2>
								<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
							</div>
							<div className="flex flex-col items-center justify-center py-4 relative">
								<div className="relative w-40 h-40 flex items-center justify-center">
									<svg className="w-full h-full transform -rotate-90">
										<circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r={CIRCLE_R} stroke="currentColor" strokeWidth="12" />
										<circle
											className="text-secondary"
											cx="80" cy="80" fill="transparent" r={CIRCLE_R}
											stroke="currentColor"
											strokeDasharray={CIRCLE_CIRCUMFERENCE}
											strokeDashoffset={circleOffset}
											strokeWidth="12"
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<span className="text-3xl font-black text-on-surface tracking-tighter">{formatPercent(planPct)}</span>
										<span className="text-[10px] font-bold text-secondary uppercase">
											{planPct >= 100 ? 'Exceeded' : 'In Progress'}
										</span>
									</div>
								</div>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">KPI Quick Stats</h2>
							<div className="grid grid-cols-1 gap-3">
								<div
									className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between cursor-pointer"
									onClick={() => navigate('/kpi-detail')}
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
											<span className="material-symbols-outlined text-secondary">payments</span>
										</div>
										<div>
											<p className="text-xs font-bold uppercase tracking-tighter">Sales</p>
											<p className="text-lg font-bold text-secondary">{formatPercent(kpi.planAchievement)}</p>
										</div>
									</div>
									<span className="material-symbols-outlined text-secondary">arrow_upward</span>
								</div>

								<div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
											<span className="material-symbols-outlined text-secondary">shopping_cart</span>
										</div>
										<div>
											<p className="text-xs font-bold uppercase tracking-tighter">ACB</p>
											<p className="text-lg font-bold text-secondary">{formatPercent(kpi.acb.achievement)}</p>
										</div>
									</div>
									<span className="material-symbols-outlined text-secondary">arrow_upward</span>
								</div>
							</div>
						</section>
					</div>

					{/* Working cycle progress */}
					<section className="space-y-3">
						<div className="flex justify-between items-end px-1">
							<h2 className="text-[12px] font-bold uppercase tracking-widest text-outline">Working Cycle Progress</h2>
							<p className="text-[14px] font-bold text-primary">{salary.workingDays.completed} / {salary.workingDays.total} Days</p>
						</div>
						<div className="bg-surface-container-high h-4 w-full rounded-full overflow-hidden p-1 shadow-inner">
							<div
								className="h-full rounded-full bg-gradient-to-r from-secondary to-on-secondary-container"
								style={{ width: `${(salary.workingDays.completed / salary.workingDays.total) * 100}%` }}
							></div>
						</div>
					</section>

					{/* Next goal */}
					<section className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-tertiary-fixed-dim">
						<div className="flex justify-between items-start mb-6">
							<div>
								<h2 className="text-lg font-bold text-on-surface tracking-tight">
									Next Goal: +{formatCurrency(kpi.overachievementSteps.nextGoalBonus)} bonus
								</h2>
								{/* <p className="text-on-surface-variant text-sm mt-1">Tier 3 Achievement Level</p> */}
							</div>
							<div className="w-12 h-12 bg-tertiary-fixed/30 rounded-full flex items-center justify-center">
								<span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>rewarded_ads</span>
							</div>
						</div>
						<div className="flex justify-between items-end mb-6">
							<p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sales Gap</p>
							<p className="text-xl font-bold text-on-surface tracking-tighter">
								{formatCurrency(kpi.overachievementSteps.salesGap, '')}
								<span className="text-xs font-medium text-outline ml-1 uppercase">{salary.currency}</span>
							</p>
						</div>
						<button
							onClick={() => navigate('/kpi')}
							className="w-full mt-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-primary-fixed-variant font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
						>
							View Detailed Breakdown
							<span className="material-symbols-outlined text-sm">chevron_right</span>
						</button>
					</section>

					{/* Earnings breakdown */}
					<section className="space-y-4">
						<h2 className="text-[12px] font-bold uppercase tracking-widest text-outline px-1">Earnings Breakdown</h2>
						<div className="space-y-3">
							{salary.components.map((item) =>
								item.highlight ? (
									<div key={item.id} className="bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
										<div className="flex items-center gap-4 relative z-10">
											<div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
												<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
											</div>
											<p className="text-sm font-bold text-secondary">{item.label}</p>
										</div>
										<p className="text-sm font-extrabold text-secondary">+{formatCurrency(item.amount, '')}</p>
									</div>
								) : (
									<div key={item.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between shadow-sm border border-black/[0.02]">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
												<span className="material-symbols-outlined text-primary">{item.icon}</span>
											</div>
											<div>
												<p className="text-sm font-semibold text-on-surface">{item.label}</p>
												{item.sublabel && <p className="text-[11px] text-on-surface-variant uppercase tracking-tighter">{item.sublabel}</p>}
											</div>
										</div>
										<p className="text-sm font-bold text-on-surface">{formatCurrency(item.amount, '')}</p>
									</div>
								)
							)}
						</div>
					</section>

					{/* Final total */}
					<section className="bg-surface-container-lowest rounded-2xl p-6 text-center space-y-2">
						<p className="text-[12px] font-bold text-outline uppercase tracking-widest">Final Estimated Salary</p>
						<p className="text-2xl font-black text-primary tracking-tight">{formatCurrency(salary.total)}</p>
						<p className="text-[12px] text-outline font-bold tracking-tight">{salary.disclaimer}</p>
					</section>
				</main>
			)}

			<BottomNav />
		</div>
	)
}
