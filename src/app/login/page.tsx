'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/authContext'
import { toast } from 'sonner'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const router = useRouter()
  const { login } = useAuth() 

  // Update date and time secara real time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }))
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Username dan password harus diisi')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      await login(username, password)
      toast.success('Login berhasil!')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.role === 'TEKNISI') {
          router.push('/dashboard/presensi/absen')
        } else {
          router.push('/dashboard')
        }
    } catch (error) {
      let errorMessage = 'Terjadi kesalahan saat login'
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      }
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
      {/* Background login */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/bg-login.jpg"
          alt="Login Background"
          fill
          quality={80}
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-4xl mx-auto bg-[#0d0d0d]/95 rounded-xl overflow-hidden border border-[#4A5568] backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row">
          {/* pembungkus bagian kanan Form */}
          <div className="w-full sm:w-1/2 p-6 sm:p-8">
            {/* Logo dan Nama Perusahaan */}
            <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8">
              <Image 
                src="/images/company-logo.png"
                alt="Company Logo"
                width={48}
                height={48}
                className="rounded-full border-2 border-[#FBF991] w-12 h-12 sm:w-14 sm:h-14"
              />
              <div className="hidden sm:block h-12 w-1 bg-[#FBF991] mx-4"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#FBF991] mt-3 sm:mt-0 text-center sm:text-left">
                PT Aishy Health Calibration
              </h1>
            </div>

            {/* Date and Time */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-white text-sm sm:text-base">{currentDate}</p>
              <p className="text-[#FBF991] text-xl sm:text-2xl font-bold drop-shadow-[0_0_4px_rgba(251,249,145,0.4)]">
                {currentTime}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="mb-4 sm:mb-6 p-3 bg-red-900/90 text-red-100 rounded text-xs sm:text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-white mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  className="w-full px-4 py-3 sm:py-2 bg-[#1a1a1a]/95 border border-gray-600 rounded-lg sm:rounded-md text-white focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[#FBF991] text-sm sm:text-base"
                  placeholder="Username"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-white mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className="w-full px-4 py-3 sm:py-2 bg-[#1a1a1a]/95 border border-gray-600 rounded-lg sm:rounded-md text-white focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[#FBF991] text-sm sm:text-base"
                  placeholder="Password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg sm:rounded-md text-sm sm:text-base transition-all duration-100 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>

          {/* pembungkus bagian kiri form - note: Hidden pada versi mobile */}
          <div className="hidden sm:flex sm:w-1/2 bg-[#1a1a1a] flex-col items-center justify-center p-8 text-center">
            <h2 className="text-3xl font-bold text-[#FBF991] mb-6">
              SELAMAT DATANG
            </h2>
            <p className="text-white text-xl mb-8">
              di aplikasi SIMKAR
            </p>
            <div className="border-t border-[#FBF991] w-1/2 my-6"></div>
            <p className="text-white text-lg">
              Platform Manajemen Kantor Terpadu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}