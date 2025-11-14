import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'
import { generateReceipt } from '../utils/receiptGenerator'

export default function Payments() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState({ total_paid: 0, total_pending: 0 })
  const [loading, setLoading] = useState(true)
  const user = api.getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchPayments = async () => {
      try {
        // Get regular payments from API
        const result = await api.getPayments(user.student_id)
        let apiPayments = []
        let apiSummary = { total_paid: 0, total_pending: 0 }
        
        if (result.success) {
          apiPayments = result.data || []
          apiSummary = result.summary || { total_paid: 0, total_pending: 0 }
        }

        // Get fee notices from localStorage (sent by admin)
        const feeNotices = JSON.parse(localStorage.getItem('feePayments') || '[]')
        
        // Filter notices relevant to this student's department and semester
        const relevantNotices = feeNotices.filter(notice => {
          if (!notice.feeDetails) return false
          
          // Check if notice is for student's department and semester
          // targetDepartment and targetSemester can be at root level or in feeDetails
          const targetDept = notice.targetDepartment || notice.feeDetails.targetDepartment
          const targetSem = notice.targetSemester || notice.feeDetails.targetSemester
          
          const matchesDept = targetDept === user.department
          const matchesSem = targetSem === user.semester?.toString()
          
          return matchesDept && matchesSem
        })

        // Convert notices to payment format
        const noticePayments = relevantNotices.map((notice, index) => ({
          id: `notice_${index}`,
          noticeId: notice.created_at, // Use timestamp as unique ID
          description: notice.feeDetails.feeTypeName || notice.title,
          amount: parseInt(notice.feeDetails.amount),
          due_date: notice.feeDetails.lastDateNormal,
          status: notice.status || 'pending', // Use the status from localStorage
          feeDetails: notice.feeDetails,
          isFromNotice: true,
          originalNotice: notice // Keep reference to original
        }))

        // Combine API payments and notice payments
        const allPayments = [...noticePayments, ...apiPayments]
        
        // Recalculate summary
        const totalPending = allPayments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0)
        
        const totalPaid = allPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0)

        setPayments(allPayments)
        setSummary({ 
          total_paid: totalPaid, 
          total_pending: totalPending 
        })
      } catch (error) {
        console.error('Error fetching payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handlePayNow = async (payment) => {
    // Check if this is a notice-based payment
    if (payment.isFromNotice) {
      // Show payment modal/confirmation
      const confirmed = window.confirm(
        `💳 Proceed to Payment?\n\n` +
        `Fee: ${payment.description}\n` +
        `Amount: ₹${payment.amount.toLocaleString()}\n\n` +
        `You will be redirected to the payment gateway.\n` +
        `(In production, this would open QR Code/UPI/Card payment)`
      )
      
      if (!confirmed) return
      
      // Simulate payment processing
      const paymentSuccess = window.confirm(
        `🔄 Processing Payment...\n\n` +
        `Scan QR Code or enter payment details.\n\n` +
        `Click OK to simulate successful payment\n` +
        `Click Cancel to simulate failed payment`
      )
      
      if (paymentSuccess) {
        // Mark as paid in localStorage
        const feePayments = JSON.parse(localStorage.getItem('feePayments') || '[]')
        
        // Find and update the matching payment using unique timestamp
        let updated = false
        const updatedPayments = feePayments.map(fp => {
          // Match by timestamp (unique ID)
          if (fp.created_at === payment.noticeId && fp.status !== 'paid') {
            updated = true
            return { 
              ...fp, 
              status: 'paid', 
              paidAt: new Date().toISOString(),
              paymentMethod: 'QR Code/UPI/Card'
            }
          }
          return fp
        })
        
        if (updated) {
          localStorage.setItem('feePayments', JSON.stringify(updatedPayments))
          alert('✅ Payment Successful!\n\nYour fee payment has been processed successfully.')
          window.location.reload()
        } else {
          alert('⚠️ Could not update payment status. Please contact support.')
        }
      } else {
        alert('❌ Payment Failed\n\nPlease try again or contact support.')
      }
    } else {
      // Handle API-based payments
      const result = await api.processPayment(payment.id, 'Online')
      if (result.success) {
        // Refresh payments
        const updatedResult = await api.getPayments(user.student_id)
        if (updatedResult.success) {
          setPayments(updatedResult.data || [])
          setSummary(updatedResult.summary || { total_paid: 0, total_pending: 0 })
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-800 dark:text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pb-24 px-4 py-6 max-w-6xl mx-auto"
      >
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Fee Payments</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name || 'Student'}</span>
            {user?.profile_image ? (
              <img 
                src={user.profile_image} 
                alt={user.full_name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || 'S'}
              </div>
            )}
          </div>
        </header>

        <p className="text-slate-600 dark:text-slate-400 mb-8">Manage your payments and dues</p>

        {/* Categorize payments */}
        {(() => {
          const today = new Date()
          const paidPayments = payments.filter(p => p.status === 'paid')
          const overduePayments = payments.filter(p => {
            if (p.status !== 'pending') return false
            const dueDate = new Date(p.due_date)
            return today > dueDate
          })
          const pendingPayments = payments.filter(p => {
            if (p.status !== 'pending') return false
            const dueDate = new Date(p.due_date)
            return today <= dueDate
          })

          const renderPayment = (payment, index) => {
            const dueDate = new Date(payment.due_date)
            const isOverdue = today > dueDate && payment.status === 'pending'
            const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
            
            // Calculate applicable fine for overdue payments
            let applicableFine = 0
            let fineLabel = ''
            if (isOverdue && payment.feeDetails) {
              const fineDate = new Date(payment.feeDetails.lastDateFine)
              const superFineDate = new Date(payment.feeDetails.lastDateSuperFine)
              
              if (today > superFineDate) {
                applicableFine = parseInt(payment.feeDetails.superFineAmount)
                fineLabel = 'Super Fine'
              } else if (today > fineDate) {
                applicableFine = parseInt(payment.feeDetails.fineAmount)
                fineLabel = 'Fine'
              }
            }
            
            return (
              <div
                key={index}
                className={`p-5 rounded-xl transition-all border-2 ${
                      payment.status === 'paid' 
                        ? 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 border-green-500/40' 
                        : isOverdue
                          ? 'bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 border-red-500/50'
                          : 'bg-orange-500/10 dark:bg-orange-500/20 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 border-orange-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          payment.status === 'paid' 
                            ? 'bg-green-500/20 text-green-500' 
                            : isOverdue 
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-orange-500/20 text-orange-500'
                        }`}>
                          <i className={`fas ${
                            payment.status === 'paid' ? 'fa-check' : isOverdue ? 'fa-exclamation-triangle' : 'fa-clock'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                            {payment.description}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-600 dark:text-slate-400">
                              <i className="fas fa-calendar mr-2"></i>
                              Due: {new Date(payment.due_date).toLocaleDateString('en-IN', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                              {payment.status === 'pending' && !isOverdue && daysRemaining > 0 && (
                                <span className="ml-2 text-orange-600 dark:text-orange-400 font-semibold">
                                  ({daysRemaining} days left)
                                </span>
                              )}
                              {isOverdue && (
                                <span className="ml-2 text-red-600 dark:text-red-400 font-bold">
                                  ⚠️ OVERDUE
                                </span>
                              )}
                            </p>
                            
                            {payment.feeDetails && (
                              <>
                                <p className="text-slate-600 dark:text-slate-400">
                                  <i className="fas fa-info-circle mr-2"></i>
                                  Fine: ₹{payment.feeDetails.fineAmount} | Super Fine: ₹{payment.feeDetails.superFineAmount}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                  <i className="fas fa-calendar-times mr-2"></i>
                                  With Fine: {new Date(payment.feeDetails.lastDateFine).toLocaleDateString('en-IN')} | 
                                  Final: {new Date(payment.feeDetails.lastDateSuperFine).toLocaleDateString('en-IN')}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        {applicableFine > 0 && (
                          <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                            + ₹{applicableFine.toLocaleString()} ({fineLabel})
                          </p>
                        )}
                        {payment.status === 'paid' && (
                          <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            PAID
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {payment.status === 'paid' && (
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                        <button
                          onClick={() => generateReceipt(payment, user)}
                          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Download Receipt
                        </button>
                      </div>
                    )}
                    
                    {payment.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                        <button
                          onClick={() => handlePayNow(payment)}
                          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                          <i className="fas fa-credit-card mr-2"></i>
                          Pay Now via QR Code / UPI / Card
                        </button>
                      </div>
                    )}
                  </div>
                )
              }

          return (
            <div className="space-y-8">
              {/* Overdue Fees Section */}
              {overduePayments.length > 0 && (
                <div className="bg-red-500/10 dark:bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-500/50 shadow-lg">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                      <i className="fas fa-exclamation-triangle"></i>
                      Overdue Fees ({overduePayments.length})
                    </h2>
                  </div>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    <i className="fas fa-info-circle mr-2"></i>
                    These payments are past their due date. Additional fines may apply.
                  </p>
                  <div className="space-y-4">
                    {overduePayments.map((payment, index) => renderPayment(payment, `overdue_${index}`))}
                  </div>
                </div>
              )}

              {/* Pending Fees Section */}
              {pendingPayments.length > 0 && (
                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <i className="fas fa-clock text-orange-500"></i>
                      Pending Fees ({pendingPayments.length})
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    <i className="fas fa-info-circle mr-2"></i>
                    Pay before the due date to avoid fines.
                  </p>
                  <div className="space-y-4">
                    {pendingPayments.map((payment, index) => renderPayment(payment, `pending_${index}`))}
                  </div>
                </div>
              )}

              {/* Paid Fees Section */}
              {paidPayments.length > 0 && (
                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Paid Fees
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {paidPayments.map((payment, index) => renderPayment(payment, `paid_${index}`))}
                  </div>
                </div>
              )}

              {/* No Payments */}
              {payments.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">No fee payments found!</p>
                </div>
              )}
            </div>
          )
        })()}


      </motion.div>
      <Navigation />
    </>
  )
}
