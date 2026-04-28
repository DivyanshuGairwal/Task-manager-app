import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtp, verifyOtp } from '../store/slices/authSlice';
import { useTheme } from '@react-navigation/native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { loading, error, otpRequested } = useSelector((state) => state.auth);
  const { colors } = useTheme();
  const isDark = useColorScheme() === 'dark';

  const handleRequestOtp = () => {
    if (phone.length >= 10) {
      dispatch(requestOtp(phone));
    } else {
      alert('Please enter a valid phone number');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      dispatch(verifyOtp({ phone, otp }));
    } else {
      alert('Please enter a valid 4-digit OTP');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome to TaskManager
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {otpRequested ? 'Enter the 4-digit OTP sent to your phone' : 'Enter your phone number to continue'}
        </Text>

        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!otpRequested}
        />

        {otpRequested && (
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, marginTop: 15 }]}
            placeholder="4-digit OTP"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]} 
          onPress={otpRequested ? handleVerifyOtp : handleRequestOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{otpRequested ? 'Verify OTP' : 'Request OTP'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 10,
    textAlign: 'center',
  }
});
