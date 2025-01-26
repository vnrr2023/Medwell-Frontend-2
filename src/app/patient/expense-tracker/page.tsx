"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, PlusCircle, MessageSquare, ChevronRight, X } from "lucide-react"
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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

// Update chart.js global defaults
ChartJS.defaults.color = "#000" // Changed to black
ChartJS.defaults.borderColor = "rgba(0,0,0,0.1)" // Changed to black

// Mock expense data (replace with actual API call in production)
const mockExpenseData = {
  overall_expense: 12500,
  expenses: [
    { id: 1, expense_type: "reports", amount: "500", date: "2024-01-20" },
    { id: 2, expense_type: "doctor", amount: "1200", date: "2024-01-18" },
    { id: 3, expense_type: "medicines", amount: "350", date: "2024-01-15" },
    { id: 4, expense_type: "tests", amount: "800", date: "2024-01-10" },
    { id: 5, expense_type: "reports", amount: "250", date: "2024-01-05" },
    { id: 6, expense_type: "doctor", amount: "1500", date: "2024-01-02" },
    { id: 7, expense_type: "medicines", amount: "400", date: "2023-12-28" },
    { id: 8, expense_type: "tests", amount: "600", date: "2023-12-25" },
    { id: 9, expense_type: "reports", amount: "700", date: "2023-12-20" },
    { id: 10, expense_type: "doctor", amount: "1000", date: "2023-12-15" },
  ],
  expense_trend: {
    expenses: [500, 1200, 350, 800, 250, 1500, 400, 600, 700, 1000],
  },
  expenses_per_month: {
    month_name: ["January", "February", "March", "April", "May", "June"],
    expenses: [4200, 3800, 4500, 3500, 4000, 4800],
  },
  expenses_per_type: {
    expense_type: ["reports", "doctor", "medicines", "tests"],
    total: [1450, 2700, 750, 1400],
  },
  expenses_per_year: {
    year: [2022, 2023, 2024],
    expenses: [15000, 18000, 12500],
  },
}

const expenseTypes = ["reports", "doctor", "medicines", "tests"]

// Update the color schemes
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
}: { onAddExpense: (expense: { query_type: string; expense_type?: string; amount?: string; query?: string }) => void; onBack: () => void; inputMethod: string }) => {
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

  const handleNaturalLanguageSubmit = useCallback(() => {
    if (!naturalLanguageInput) return

    const expenseToAdd = {
      query_type: "natural_language",
      query: naturalLanguageInput,
    }

    onAddExpense(expenseToAdd)
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
}: { expense: { id: number; expense_type: string; amount: string; date: string }; onClose: () => void; onDelete: () => void }) => (
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
  const [expenseData, setExpenseData] = useState(mockExpenseData)
  const [chartData] = useState(mockExpenseData)
  const [showAddExpense, setShowAddExpense] = useState<string | null>(null)
  interface Expense {
    id: number;
    expense_type: string;
    amount: string;
    date: string;
  }

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [currentPage] = useState(0)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real application, fetch data here.
    // For this example, we'll use the mock data.
  }, [])

  interface NewExpense {
    expense_type: string;
    amount: string;
  }

  interface ExpenseItem extends NewExpense {
    id: number;
    date: string;
  }

  const handleAddExpense = useCallback(
    async (newExpense: { query_type: string; expense_type?: string; amount?: string; query?: string }) => {
      // Replace this with actual API call
      const newId = expenseData.expenses.length > 0 ? Math.max(...expenseData.expenses.map((e) => e.id)) + 1 : 1
      const newExpenseItem: ExpenseItem = { id: newId, expense_type: newExpense.expense_type || "", amount: newExpense.amount || "", date: new Date().toLocaleDateString() }
      setExpenseData((prev) => ({
        ...prev,
        overall_expense: prev.overall_expense + Number.parseFloat(newExpense.amount || "0"),
        expenses: [...prev.expenses, newExpenseItem],
      }))
      setShowAddExpense(null)
    },
    [expenseData],
  )

  const handleDeleteExpense = useCallback(async (expenseId: number) => {
    // Replace this with actual API call
    setExpenseData((prev) => {
      const deletedExpense = prev.expenses.find((e) => e.id === expenseId)
      if (deletedExpense) {
        return {
          ...prev,
          overall_expense: prev.overall_expense - Number.parseFloat(deletedExpense.amount),
          expenses: prev.expenses.filter((e) => e.id !== expenseId),
        }
      }
      return prev
    })
    setSelectedExpense(null)
    setShowMobileModal(false)
  }, [])

  const paginatedExpenses = useMemo(() => {
    const startIndex = currentPage * 4
    return expenseData.expenses.slice(startIndex, startIndex + 4)
  }, [expenseData.expenses, currentPage])

  const totalPages = Math.ceil(expenseData.expenses.length / 4)

  const expenseChartData = useMemo(
    () => ({
      labels: chartData.expenses_per_type.expense_type,
      datasets: [
        {
          data: chartData.expenses_per_type.total,
          backgroundColor: COLORS,
        },
      ],
    }),
    [chartData.expenses_per_type],
  )

  const expenseTrendData = useMemo(() => {
    const expenses = chartData.expense_trend.expenses
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
  }, [chartData.expense_trend])

  const monthlyExpenseData = useMemo(
    () => ({
      labels: chartData.expenses_per_month.month_name,
      datasets: [
        {
          label: "Monthly Expenses",
          data: chartData.expenses_per_month.expenses,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    }),
    [chartData.expenses_per_month],
  )

  const yearlyExpenseData = useMemo(
    () => ({
      labels: chartData.expenses_per_year.year,
      datasets: [
        {
          label: "Yearly Expenses",
          data: chartData.expenses_per_year.expenses,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    }),
    [chartData.expenses_per_year],
  )

  const expenseTypeData = useMemo(() => {
    const data: Record<string, { sum: number; count: number }> = {}
    expenseData.expenses.forEach((expense) => {
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
  }, [expenseData.expenses])

  const averageExpenseData = useMemo(() => {
    const data: { [key: string]: { sum: number; count: number } } = {}
    expenseData.expenses.forEach((expense) => {
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
  }, [expenseData.expenses])

  const MainView = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold text-black mb-8">Expense Tracker</h1> {/* Updated heading color */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Main Balance Card */}
          <div className="md:col-span-2 lg:col-span-3">
            <motion.div className="bg-white p-6 rounded-xl shadow-lg">
              {" "}
              {/* Updated bg color */}
              <h2 className="text-2xl font-semibold mb-4">Available Balance</h2>
              <p className="text-4xl font-bold text-green-400">
                ₹{Number.parseFloat(expenseData.overall_expense.toString()).toFixed(2)}
              </p>
              <div className="mt-4 h-[200px]">
                <Line
                  data={expenseTrendData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { color: "rgba(0,0,0,0.1)" } }, // Updated grid color
                      y: { grid: { color: "rgba(0,0,0,0.1)" } }, // Updated grid color
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddExpense("normal")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-all" // Updated bg color
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
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-all" // Updated bg color
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
            {" "}
            {/* Updated bg color */}
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <div className="h-[300px]">
              <Pie
                data={expenseChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom", labels: { color: "black" } } }, // Updated text color
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            {" "}
            {/* Updated bg color */}
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
            <div className="h-[300px]">
              <Bar
                data={monthlyExpenseData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: "rgba(0,0,0,0.1)" } }, // Updated grid color
                    y: { grid: { color: "rgba(0,0,0,0.1)" } }, // Updated grid color
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            {" "}
            {/* Updated bg color */}
            <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-4">
              {paginatedExpenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg text-black cursor-pointer" // Updated bg and text color
                  onClick={() => router.push(`/patient/reports/${expense.id}`)}
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
      yearlyExpenseData,
      expenseTypeData,
      averageExpenseData,
      selectedExpense,
    ],
  )

  return (
    <div className="max-w-[1600px] w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 bg-white text-black min-h-screen">
      {" "}
      {/* Updated bg and text color */}
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
      {showMobileModal && selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={() => setShowMobileModal(false)}
          onDelete={() => handleDeleteExpense(selectedExpense.id)}
        />
      )}
    </div>
  )
}

