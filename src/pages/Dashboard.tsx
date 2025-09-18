import { useState, useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Wrench, 
  AlertTriangle, 
  TrendingUp,
  QrCode,
  Clock,
  CheckCircle
} from "lucide-react";
import { useModal } from "@/ModalContext";
import ImageCarousel from "@/components/ui/ImageCarousel";

const ICONS = {
  Package,
  Wrench,
  AlertTriangle,
  TrendingUp,
};

type IconName = keyof typeof ICONS;

interface Stat {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}

interface Activity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  type: string;
}
interface DashboardProps {
  userRole: 'admin' | 'inspector' | 'vendor';
}

const Dashboard = ({ userRole }: DashboardProps) => {
  const { openScanner } = useModal();
  const [statsData, setStatsData] = useState<Stat[]>([
    { title: "Total Parts", value: 0, description: "All tracked components", icon: Package, trend: { value: 0, isPositive: true } },
    { title: "Active Installations", value: 0, description: "Currently installed", icon: Wrench, trend: { value: 0, isPositive: true } },
    { title: "Pending Replacements", value: 0, description: "Require attention", icon: AlertTriangle, trend: { value: 0, isPositive: false } },
    { title: "System Efficiency", value: '100%', description: "Overall performance", icon: TrendingUp, trend: { value: 0, isPositive: true } }
  ]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, you would fetch from your actual API endpoints.
        // These are placeholders that you will need to create in your backend.
        const [statsResponse, activityResponse] = await Promise.all([
          fetch('/api/dashboard-stats'),
          fetch('/api/recent-activity')
        ]);

        if (!statsResponse.ok || !activityResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsResult = await statsResponse.json();
        const activitiesResult = await activityResponse.json();

        // Map icon names from API to actual components
        const mappedStats = statsResult.map((stat: { icon: IconName }) => ({
          ...stat,
          icon: ICONS[stat.icon] || Package,
        }));

        setStatsData(mappedStats);
        setRecentActivities(activitiesResult);
      } catch (err: any) {
        setError("Could not load dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refetch data when the tab becomes visible again, to reflect changes
    // made in other pages (like adding a new installation).
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'install': return Wrench;
      case 'scan': return QrCode;
      case 'replace': return AlertTriangle;
      case 'upload': return Package;
      default: return CheckCircle;
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <AlertTriangle className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="w-full -mt-4">
        <ImageCarousel />
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userRole}. Here's an overview of your rail scan activity.
          </p>
        </div>
        <Button onClick={() => openScanner(userRole)} className="mt-4 sm:mt-0" variant="hero">
          <QrCode className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </header>

      {/* Responsive Grid for Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-rail-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of recent installations, scans, and replacements.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <li key={activity.id} className="py-4 flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-full">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
