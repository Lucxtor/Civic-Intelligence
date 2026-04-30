import { AuthGuard } from '@/components/auth/AuthGuard';
import { CivicTelemetryHub } from '@/components/analytics/CivicTelemetryHub';

export const metadata = {
  title: 'Civic Telemetry Hub | Ipê',
  description: 'White-hat community analytics across 5 civic telemetry layers.',
};

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <CivicTelemetryHub />
    </AuthGuard>
  );
}
