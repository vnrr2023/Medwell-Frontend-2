"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, PlusCircle, MessageSquare, ChevronRight, X, Trash2 } from "lucide-react"
import { Pie, Line, Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js"
import {
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js"
import { useRouter } from "next/navigation"
import DaddyAPI from "@/services/api"
import Chat from "@/components/chatbots/Chat"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

ChartJS.defaults.color = "#000"
ChartJS.defaults.borderColor = "rgba(0,0,0,0.1)"

const expenseTypes = ["reports", "doctor", "medicines", "tests"]

const COLORS = [
  "rgb(94, 129, 244)",
  "rgb(255, 123, 137)",
  "rgb(106, 231, 176)",
  "rgb(255, 168, 94)",
  "rgb(180, 107, 251)",
  "rgb(255, 200, 91)",
]

const AddExpenseView = ({
  onAddExpense,
  onBack,
  inputMethod,
}: {
  onAddExpense: (expense: { query_type: string; expense_type?: string; amount?: string; query?: string }) => void
  onBack: () => void
  inputMethod: string
}) => {
  const [newExpense, setNewExpense] = useState({ expense_type: "", amount: "" })
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("")

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewExpense((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewExpense((prev) => ({ ...prev, expense_type: e.target.value }))
  }, [])

  const handleAddExpense = useCallback(() => {
    if (!newExpense.expense_type || !newExpense.amount) return

    const expenseToAdd = {
      query_type: "normal",
      expense_type: newExpense.expense_type,
      amount: newExpense.amount,
    }

    onAddExpense(expenseToAdd)
  }, [newExpense, onAddExpense])

  const handleNaturalLanguageSubmit = useCallback(async() => {
    if (!naturalLanguageInput) return

    const response = await fetch('/api/expenseSep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query:naturalLanguageInput }),
    });
    if (response.ok) {
      const data = await response.json();
      const expenseToAdd={
        query_type: 'normal',
        expense_type: data.expense_type,
        amount: data.amount,
      };
      onAddExpense(expenseToAdd)
    } else {
      console.error('Failed to add expense');
    }

  }, [naturalLanguageInput, onAddExpense])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <button
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 text-lg transition-colors duration-300"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Expenses
      </button>
      <h2 className="text-3xl font-semibold mb-6">Add New Expense</h2>
      {inputMethod === "natural" ? (
        <div className="space-y-4">
          <textarea
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="E.g., I spent 500 rupees on medicine yesterday"
          />
          <button
            onClick={handleNaturalLanguageSubmit}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Expense
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label htmlFor="expenseType" className="block text-lg mb-2">
              Expense Type
            </label>
            <select
              id="expenseType"
              name="expense_type"
              value={newExpense.expense_type}
              onChange={handleSelectChange}
              className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="">Select expense type</option>
              {expenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-lg mb-2">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={newExpense.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddExpense}
            className="w-full text-lg py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Add Expense
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

const ExpenseDetailsModal = ({
  expense,
  onClose,
  onDelete,
}: {
  expense: { id: number; expense_type: string; amount: string; date: string }
  onClose: () => void
  onDelete: () => void
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-black" // Updated bg and text color
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Expense Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black">
          {" "}
          {/* Updated text color */}
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Type</span>
          <span className="font-medium">{expense.expense_type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Amount</span>
          <span className="text-green-400 font-semibold">₹{Number.parseFloat(expense.amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Date</span>
          <span>{expense.date}</span>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="mt-6 w-full bg-red-500/10 text-red-500 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
      >
        Delete Expense
      </button>
    </motion.div>
  </div>
)

export default function ExpenseTracker() {
  const [expenseData, setExpenseData] = useState<any>(null)
  const [showAddExpense, setShowAddExpense] = useState<string | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const dashboardResponse = await DaddyAPI.getExpensesDashboard()
        const expensesResponse = await DaddyAPI.showExpenses()
        setExpenseData({
          ...dashboardResponse?.data,
          overall_expense: expensesResponse?.data?.overall_expense,
          expenses: expensesResponse?.data?.expenses,
        })
      } catch (error) {
        console.error("Error fetching expense data:", error)
      }
    }

    fetchExpenseData()
  }, [])

  interface Expense {
    id: number
    expense_type: string
    amount: string
    date: string
  }

  const handleAddExpense = useCallback(
    async (newExpense: { query_type: string; expense_type?: string; amount?: string; query?: string }) => {
      try {
        await DaddyAPI.addExpenses(newExpense)
        const dashboardResponse = await DaddyAPI.getExpensesDashboard()
        const expensesResponse = await DaddyAPI.showExpenses()
        setExpenseData({
          ...dashboardResponse?.data,
          expenses: expensesResponse?.data?.expenses,
        })
        setShowAddExpense(null)
      } catch (error) {
        console.error("Error adding expense:", error)
      }
    },
    [],
  )

  const handleDeleteExpense = useCallback(async (expenseId: number) => {
    try {
      await DaddyAPI.deleteExpenses(expenseId)
      const dashboardResponse = await DaddyAPI.getExpensesDashboard()
      const expensesResponse = await DaddyAPI.showExpenses()
      setExpenseData({
        ...dashboardResponse?.data,
        expenses: expensesResponse?.data?.expenses,
      })
      setSelectedExpense(null)
      setShowMobileModal(false)
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }, [])

  const paginatedExpenses = useMemo(() => {
    const startIndex = currentPage * 10
    return expenseData?.expenses?.slice(startIndex, startIndex + 10) || []
  }, [expenseData?.expenses, currentPage])

  const totalPages = Math.ceil((expenseData?.expenses?.length || 0) / 10)

  const expenseChartData = useMemo(
    () => ({
      labels: expenseData?.expenses_per_type?.expense_type || [],
      datasets: [
        {
          data: expenseData?.expenses_per_type?.total || [],
          backgroundColor: COLORS,
        },
      ],
    }),
    [expenseData?.expenses_per_type],
  )

  const expenseTrendData = useMemo(() => {
    const expenses = expenseData?.expense_trend?.expenses || []
    const numberOfDays = expenses.length

    return {
      labels: Array.from({ length: numberOfDays }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: "Daily Expenses",
          data: expenses,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    }
  }, [expenseData?.expense_trend])

  const monthlyExpenseData = useMemo(
    () => ({
      labels: expenseData?.expenses_per_month?.month_name || [],
      datasets: [
        {
          label: "Monthly Expenses",
          data: expenseData?.expenses_per_month?.expenses || [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    }),
    [expenseData?.expenses_per_month],
  )

  const yearlyExpenseData = useMemo(
    () => ({
      labels: expenseData?.expenses_per_year?.year || [],
      datasets: [
        {
          label: "Yearly Expenses",
          data: expenseData?.expenses_per_year?.expenses || [],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    }),
    [expenseData?.expenses_per_year],
  )

  const expenseTypeData = useMemo(() => {
    const data: Record<string, { sum: number; count: number }> = {}
    expenseData?.expenses?.forEach((expense: any) => {
      if (data[expense.expense_type]) {
        data[expense.expense_type].count++
      } else {
        data[expense.expense_type] = { sum: 0, count: 1 }
      }
    })

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Number of Expenses",
          data: Object.values(data),
          backgroundColor: COLORS,
        },
      ],
    }
  }, [expenseData?.expenses])

  const averageExpenseData = useMemo(() => {
    const data: { [key: string]: { sum: number; count: number } } = {}
    expenseData?.expenses?.forEach((expense: any) => {
      const amount = Number.parseFloat(expense.amount) || 0
      if (data[expense.expense_type]) {
        data[expense.expense_type].sum += amount
        data[expense.expense_type].count++
      } else {
        data[expense.expense_type] = { sum: amount, count: 1 }
      }
    })

    const averages = Object.entries(data).map(([type, { sum, count }]) => ({
      type,
      average: sum / count,
    }))

    return {
      labels: averages.map((item) => item.type),
      datasets: [
        {
          label: "Average Expense",
          data: averages.map((item) => item.average),
          backgroundColor: COLORS,
        },
      ],
    }
  }, [expenseData?.expenses])

  const MainView = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold text-black mb-8">Expense Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 lg:col-span-3">
            <motion.div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Total Expenditure</h2>
              <p className="text-4xl font-bold text-green-400">
                ₹{Number(expenseData?.overall_expense)}
              </p>
              <div className="mt-4 h-[200px]">
                <Line
                  data={expenseTrendData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { color: "rgba(0,0,0,0.1)" } },
                      y: { grid: { color: "rgba(0,0,0,0.1)" } },
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddExpense("normal")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-md"
            >
              <span className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Expense
              </span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddExpense("natural")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-md"
            >
              <span className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Natural Input
              </span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <div className="h-[300px]">
              <Pie
                data={expenseChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom", labels: { color: "black" } } },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
            <div className="h-[300px]">
              <Bar
                data={monthlyExpenseData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: "rgba(0,0,0,0.1)" } },
                    y: { grid: { color: "rgba(0,0,0,0.1)" } },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-4">
              {paginatedExpenses.slice(0, 5).map((expense: any) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg text-black cursor-pointer"
                  onClick={() => setSelectedExpense(expense)}
                >
                  <div>
                    <p className="font-medium">{expense.expense_type}</p>
                    <p className="text-sm text-gray-400">{expense.date}</p>
                  </div>
                  <p className="text-green-400 font-semibold">₹{Number.parseFloat(expense.amount).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">All Expenses</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense: any) => (
                  <tr key={expense.id} className="border-b">
                    <td className="p-2">{expense.expense_type}</td>
                    <td className="p-2">₹{Number.parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="p-2">{expense.date}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    ),
    [
      expenseData,
      paginatedExpenses,
      currentPage,
      totalPages,
      handleDeleteExpense,
      expenseChartData,
      expenseTrendData,
      monthlyExpenseData,
    ],
  )

  return (
    <div className="max-w-[1600px] w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 text-black min-h-screen">
      <AnimatePresence mode="wait">
        {showAddExpense ? (
          <AddExpenseView
            key="add-expense"
            onAddExpense={handleAddExpense}
            onBack={() => setShowAddExpense(null)}
            inputMethod={showAddExpense}
          />
        ) : (
          <div key="main-view">{MainView}</div>
        )}
      </AnimatePresence>
      {selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onDelete={() => handleDeleteExpense(selectedExpense.id)}
        />
      )}
      <Chat/>
      
    </div>
  )
}

