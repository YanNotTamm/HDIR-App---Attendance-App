import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, CheckCircle, XCircle, Camera as CameraIcon } from 'lucide-react-native';

export default function AttendanceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [inRadius, setInRadius] = useState<boolean | null>(null);

  // Mock office location (Jakarta)
  const OFFICE = { lat: -6.2088, lng: 106.8456, radius: 100 }; // 100 meters

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin ditolak', 'Aplikasi membutuhkan akses lokasi untuk absen.');
        setLocationLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      // Simple mock logic for geofencing check
      // For demonstration, we'll randomly set it to true or false 
      // since the emulator location might not match Jakarta
      setInRadius(true); 
      setLocationLoading(false);
    })();
  }, []);

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Kami membutuhkan akses kamera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleClockIn = async () => {
    if (cameraRef.current) {
      try {
        Alert.alert('Memproses...', 'Sedang memverifikasi wajah Anda...');
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        
        if (!photo || !photo.base64) {
           throw new Error('Gagal mengambil foto');
        }

        // Mock userId = 1 untuk MVP ini (idealnya didapat dari Context/Auth)
        const { faceApi } = require('@hdir/core/src/api-client');
        const response = await faceApi.verify(1, photo.base64);
        
        if (response.data.match) {
          Alert.alert('Sukses!', 'Wajah terverifikasi. Anda berhasil Clock In!');
        } else {
          Alert.alert('Gagal', 'Wajah tidak terverifikasi!');
        }
      } catch (e: any) {
        const errorMsg = e.response?.data?.message || 'Gagal terhubung ke server AI';
        Alert.alert('Gagal Absen', errorMsg);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.faceGuide} />
          </View>
        </CameraView>
      </View>

      <View style={styles.bottomPanel}>
        <View style={styles.locationCard}>
          <MapPin size={24} color="#3b82f6" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Status Lokasi</Text>
            {locationLoading ? (
              <Text style={styles.locationDesc}>Mencari sinyal GPS...</Text>
            ) : inRadius ? (
              <Text style={[styles.locationDesc, { color: '#10b981' }]}>Di Dalam Jangkauan Kantor</Text>
            ) : (
              <Text style={[styles.locationDesc, { color: '#ef4444' }]}>Di Luar Jangkauan Kantor</Text>
            )}
          </View>
          {locationLoading ? (
            <ActivityIndicator color="#3b82f6" />
          ) : inRadius ? (
            <CheckCircle size={28} color="#10b981" />
          ) : (
            <XCircle size={28} color="#ef4444" />
          )}
        </View>

        <TouchableOpacity 
          style={[styles.clockButton, (!inRadius || locationLoading) && styles.clockButtonDisabled]}
          onPress={handleClockIn}
          disabled={!inRadius || locationLoading}
        >
          <CameraIcon size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.clockButtonText}>Clock In Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 125,
    borderStyle: 'dashed',
  },
  bottomPanel: {
    backgroundColor: '#f8fafc',
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  locationDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  clockButton: {
    backgroundColor: '#2563eb',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  clockButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  clockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
