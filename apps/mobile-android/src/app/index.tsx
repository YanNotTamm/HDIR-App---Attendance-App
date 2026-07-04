import { Redirect } from 'expo-router';

export default function Index() {
  // Automatically redirect to the login screen on app load
  return <Redirect href="/login" />;
}
