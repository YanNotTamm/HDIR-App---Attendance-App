import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Halo, Budi Santoso</Text>
          <Text style={styles.subtitle}>Selamat datang di HDIR Karyawan</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Status Hari Ini</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
                <Clock size={24} color="#2563eb" />
              </View>
              <Text style={styles.statusLabel}>Jam Masuk</Text>
              <Text style={styles.statusValue}>--:--</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.iconWrapper, { backgroundColor: '#fce7f3' }]}>
                <Clock size={24} color="#db2777" />
              </View>
              <Text style={styles.statusLabel}>Jam Keluar</Text>
              <Text style={styles.statusValue}>--:--</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/attendance')}
        >
          <View style={styles.actionIcon}>
            <MapPin size={32} color="#fff" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Mulai Presensi</Text>
            <Text style={styles.actionDesc}>Absen menggunakan Kamera & GPS</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/leave-request')}>
              <Calendar size={28} color="#2563eb" />
              <Text style={styles.gridText}>Ajukan Cuti</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/history')}>
              <Clock size={28} color="#10b981" />
              <Text style={styles.gridText}>Riwayat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
});
