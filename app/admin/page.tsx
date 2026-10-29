import { isAdmin } from '@/lib/admin-auth'
import { getDashboardData } from './actions'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />
  const data = await getDashboardData()
  return <AdminDashboard initial={data} />
}
