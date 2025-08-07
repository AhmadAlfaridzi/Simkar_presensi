import { supabase } from '@/lib/supabase'

export const attendanceService = {
  async getUserAttendances(userId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Failed to fetch user attendances:', error)
      throw error
    }

    return data
  }
}
