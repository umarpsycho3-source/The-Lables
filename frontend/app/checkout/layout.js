import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export default function CheckoutLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
