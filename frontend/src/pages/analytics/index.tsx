import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { Loader2 } from 'lucide-react';

export const HRMetrics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getHRMetrics()
      .then((res: any) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">HR Metrics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.totalEmployees}</div><p className="text-sm text-muted-foreground">Total Employees</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.newHires}</div><p className="text-sm text-muted-foreground">New Hires</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.avgTenure?.toFixed(1)}</div><p className="text-sm text-muted-foreground">Avg Tenure (Years)</p></CardContent></Card>
      </div>
    </div>
  );
};

export const PayrollAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getPayrollAnalytics()
      .then((res: any) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payroll Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">${data?.totalPayroll?.toLocaleString()}</div><p className="text-sm text-muted-foreground">Total Payroll</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">${data?.avgSalary?.toLocaleString()}</div><p className="text-sm text-muted-foreground">Avg Salary</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.payrollRuns}</div><p className="text-sm text-muted-foreground">Payroll Runs</p></CardContent></Card>
      </div>
    </div>
  );
};

export const AttendanceReports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAttendanceReports()
      .then((res: any) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Attendance Reports</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.present}</div><p className="text-sm text-muted-foreground">Present</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.absent}</div><p className="text-sm text-muted-foreground">Absent</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.late}</div><p className="text-sm text-muted-foreground">Late</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{data?.total}</div><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
      </div>
    </div>
  );
};

export const AttritionAnalysis = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAttritionAnalysis()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Attrition Analysis</h1>
      <Card>
        <CardHeader><CardTitle>Monthly Exits</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.map((item, i) => (
              <div key={i} className="flex justify-between p-2 border-b">
                <span>{item.month}</span>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ExpenseAnalytics = () => <div className="p-6"><h1 className="text-2xl font-bold">Expense Analytics</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>;
export const CostBudgetReports = () => <div className="p-6"><h1 className="text-2xl font-bold">Cost & Budget Reports</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>;
export const CustomFinancialReports = () => <div className="p-6"><h1 className="text-2xl font-bold">Custom Financial Reports</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>;
export const CustomReports = () => <div className="p-6"><h1 className="text-2xl font-bold">Custom Reports</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>;