// medicare-nepal/frontend/src/app/fitness/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { Activity, Utensils, Moon, Heart, TrendingUp, Target, Flame, Droplet } from "lucide-react";

const workouts = [
  { name: "Morning Walk", duration: "30 min", calories: 150, icon: "🚶‍♂️" },
  { name: "Yoga", duration: "45 min", calories: 200, icon: "🧘‍♀️" },
  { name: "Cycling", duration: "60 min", calories: 400, icon: "🚴‍♂️" },
  { name: "Strength Training", duration: "45 min", calories: 300, icon: "💪" },
];

const meals = [
  { name: "Breakfast", items: ["Oatmeal", "Banana", "Milk"], calories: 350 },
  { name: "Lunch", items: ["Rice", "Lentils", "Vegetables"], calories: 450 },
  { name: "Dinner", items: ["Roti", "Chicken", "Salad"], calories: 400 },
  { name: "Snacks", items: ["Fruits", "Nuts"], calories: 200 },
];

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  };

  const metrics = [
    { label: "Steps Today", value: "8,542", target: "10,000", icon: Activity, color: "blue" },
    { label: "Calories Burned", value: "420", target: "500", icon: Flame, color: "orange" },
    { label: "Water Intake", value: "2.1", unit: "L", target: "3", icon: Droplet, color: "cyan" },
    { label: "Sleep", value: "7.2", unit: "h", target: "8", icon: Moon, color: "purple" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Fitness Tracker</h1>
                <p className="text-gray-400">Track your health journey with personalized insights</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
                {["overview", "workouts", "nutrition", "sleep"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon;
                  const progress = (parseFloat(metric.value) / parseFloat(metric.target)) * 100;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-2xl glass-card hover-lift"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-${metric.color}-500/20 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                          <div className="text-sm text-gray-400">/{metric.target}{metric.unit || ""}</div>
                        </div>
                      </div>
                      <h4 className="text-white font-medium mb-2">{metric.label}</h4>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* BMI Calculator */}
              <div className="p-6 rounded-2xl glass-card mb-8">
                <h3 className="text-xl font-bold text-white mb-6">BMI Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., 175"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., 70"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={calculateBMI}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
                    >
                      Calculate BMI
                    </button>
                  </div>
                </div>
                
                {bmi && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-400">Your BMI</div>
                        <div className="text-3xl font-bold text-white">{bmi}</div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        bmi < 18.5 ? "bg-blue-500/10 text-blue-400" :
                        bmi < 25 ? "bg-green-500/10 text-green-400" :
                        bmi < 30 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {bmi < 18.5 ? "Underweight" :
                         bmi < 25 ? "Normal" :
                         bmi < 30 ? "Overweight" : "Obese"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Workouts */}
              {activeTab === "workouts" && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Todays Workouts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workouts.map((workout, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="p-6 rounded-2xl glass-card hover-lift"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-4xl">{workout.icon}</div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{workout.calories}</div>
                            <div className="text-sm text-gray-400">calories</div>
                          </div>
                        </div>
                        <h4 className="text-white font-medium mb-2">{workout.name}</h4>
                        <p className="text-gray-400">{workout.duration}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition */}
              {activeTab === "nutrition" && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Todays Meals</h3>
                  <div className="space-y-4">
                    {meals.map((meal, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        className="p-6 rounded-2xl glass-card"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-white">{meal.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meal.items.map((item, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{meal.calories}</div>
                            <div className="text-sm text-gray-400">calories</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Track your food intake for better health</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Daily Goal</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Steps</span>
                      <span className="text-white font-medium">85%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Calories Burned</span>
                      <span className="text-white font-medium">84%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Water Intake</span>
                      <span className="text-white font-medium">70%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium">
                  Update Goals
                </button>
              </div>

              {/* Health Tips */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4">💡 Health Tips</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <span>Walk 10,000 steps daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <span>Drink 3L water daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <span>Sleep 7-8 hours nightly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <span>Include protein in every meal</span>
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Weekly Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Total Steps</span>
                    </div>
                    <span className="text-white font-bold">59,842</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-gray-300">Calories Burned</span>
                    </div>
                    <span className="text-white font-bold">2,940</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-gray-300">Active Days</span>
                    </div>
                    <span className="text-white font-bold">7/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Goals Achieved</span>
                    </div>
                    <span className="text-white font-bold">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

